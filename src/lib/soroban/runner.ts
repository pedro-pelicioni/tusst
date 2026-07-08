import "server-only";

import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { ForgeEvent, ForgeMode, SorobanFileMap } from "./types";

// Hardened Docker execution for the Forge IDE (compile / test / audit).
//
// Same posture as the lesson runner (src/lib/runner.ts) with two deliberate
// deltas driven by cargo builds:
//   * streaming — output is parsed line-by-line and yielded as ForgeEvents
//     while the container runs, instead of buffered at the end;
//   * no --read-only — cargo builds in-place at /opt/warm, reusing the
//     image's pre-compiled dependency target/ with zero copy. Writes land in
//     the container's ephemeral layer and vanish with `--rm`. The rest of the
//     posture (no network, cap-drop, non-root, pids/memory/cpu limits, host
//     wall timeout) is unchanged.
//
// Scale path (documented, not built): swap the semaphore for a queue — the
// AsyncIterable<ForgeEvent> contract survives that move.

const IMAGE = "tusst-soroban-runner:latest";
const MAX_CONCURRENT = 2;
const WALL_TIMEOUT_MS: Record<ForgeMode, number> = {
  build: 180_000,
  test: 240_000,
  audit: 240_000,
};
const MAX_LOG_LINES = 2_000;
const MAX_LOG_BYTES = 512 * 1024;
const MAX_WASM_B64_BYTES = 8 * 1024 * 1024;
const MARKER = "__TUSST_FORGE__";

// In-process semaphore, independent of the lesson runner's (builds are heavy).
let active = 0;
const waiters: Array<() => void> = [];
function queuePosition(): number {
  return active < MAX_CONCURRENT ? 0 : waiters.length + 1;
}
async function acquire(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return;
  }
  await new Promise<void>((resolve) => waiters.push(resolve));
  active++;
}
function release(): void {
  active--;
  waiters.shift()?.();
}

function sanitizeLine(raw: string): string {
  return raw
    .replaceAll("/opt/warm/", "")
    .replaceAll("/opt/warm", ".")
    .replaceAll("/opt/cargo/", "~/.cargo/")
    .replaceAll("/opt/cargo", "~/.cargo")
    .replaceAll("/project/", "")
    .slice(0, 2048);
}

/** Push-based channel bridging child-process callbacks to an async iterator. */
function eventChannel<T>() {
  const buffer: T[] = [];
  let notify: (() => void) | null = null;
  let closed = false;
  return {
    push(value: T) {
      if (closed) return;
      buffer.push(value);
      notify?.();
    },
    close() {
      closed = true;
      notify?.();
    },
    async *[Symbol.asyncIterator]() {
      for (;;) {
        while (buffer.length > 0) yield buffer.shift() as T;
        if (closed) return;
        await new Promise<void>((resolve) => {
          notify = () => {
            notify = null;
            resolve();
          };
        });
      }
    },
  };
}

export async function* runForge(
  mode: ForgeMode,
  files: SorobanFileMap,
  signal?: AbortSignal,
): AsyncGenerator<ForgeEvent> {
  const position = queuePosition();
  if (position > 0) yield { t: "queued", position };

  await acquire();
  const dir = await mkdtemp(join(tmpdir(), "tusst-forge-"));
  const containerName = `tusst-forge-${randomUUID()}`;
  let killed = false;
  const kill = () => {
    if (killed) return;
    killed = true;
    spawn("docker", ["kill", containerName], { stdio: "ignore" }).on("error", () => {});
  };

  try {
    if (signal?.aborted) return;

    for (const [path, contents] of Object.entries(files)) {
      const target = join(dir, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, contents, "utf8");
    }

    const channel = eventChannel<ForgeEvent>();
    const child = spawn(
      "docker",
      [
        "run",
        "--rm",
        "--name", containerName,
        "--network", "none",
        "--cap-drop", "ALL",
        "--security-opt", "no-new-privileges",
        "--pids-limit", "256",
        "--memory", "2g",
        "--cpus", "2",
        "--tmpfs", "/tmp:rw,exec,size=64m",
        "-v", `${dir}:/project:ro`,
        IMAGE,
        mode,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );

    const wallTimer = setTimeout(kill, WALL_TIMEOUT_MS[mode]);
    const onAbort = () => kill();
    signal?.addEventListener("abort", onAbort);

    // Line-by-line marker parser fed by both stdout and stderr.
    let pending = "";
    let logLines = 0;
    let logBytes = 0;
    let truncated = false;
    let collectingWasm = false;
    let wasmB64 = "";
    let sawEnd = false;
    let result: { ok: boolean; timedOut: boolean } | null = null;

    const handleLine = (line: string) => {
      if (line.startsWith(MARKER)) {
        const words = line.slice(MARKER.length).trim().split(/\s+/);
        switch (words[0]) {
          case "phase":
            if (
              words[1] === "prepare" ||
              words[1] === "compile" ||
              words[1] === "test" ||
              words[1] === "audit"
            ) {
              channel.push({ t: "phase", name: words[1] });
            }
            return;
          case "result":
            result = {
              ok: words[1] === "ok",
              timedOut: words[1] === "timeout",
            };
            return;
          case "wasm-begin":
            collectingWasm = true;
            wasmB64 = "";
            return;
          case "wasm-end":
            collectingWasm = false;
            if (wasmB64.length > 0 && wasmB64.length <= MAX_WASM_B64_BYTES) {
              channel.push({ t: "wasm", b64: wasmB64 });
            }
            wasmB64 = "";
            return;
          case "end":
            sawEnd = true;
            return;
          default:
            return;
        }
      }
      if (collectingWasm) {
        if (wasmB64.length <= MAX_WASM_B64_BYTES) wasmB64 += line.trim();
        return;
      }
      if (truncated) return;
      logLines++;
      logBytes += line.length;
      if (logLines > MAX_LOG_LINES || logBytes > MAX_LOG_BYTES) {
        truncated = true;
        channel.push({ t: "log", line: "… output truncated …" });
        return;
      }
      channel.push({ t: "log", line: sanitizeLine(line) });
    };

    const onChunk = (chunk: Buffer) => {
      pending += chunk.toString("utf8");
      for (;;) {
        const nl = pending.indexOf("\n");
        if (nl === -1) break;
        handleLine(pending.slice(0, nl).replace(/\r$/, ""));
        pending = pending.slice(nl + 1);
      }
    };
    child.stdout.on("data", onChunk);
    child.stderr.on("data", onChunk);

    child.on("error", () => channel.close());
    child.on("close", () => {
      if (pending.length > 0) handleLine(pending);
      channel.close();
    });

    try {
      for await (const event of channel) yield event;
    } finally {
      clearTimeout(wallTimer);
      signal?.removeEventListener("abort", onAbort);
      kill();
    }

    if (signal?.aborted) return;
    // `result` is written inside stream callbacks; TS's flow analysis can't
    // see that, so widen it explicitly.
    const r = result as { ok: boolean; timedOut: boolean } | null;
    yield {
      t: "done",
      ok: r?.ok === true && sawEnd,
      timedOut: r?.timedOut === true || (killed && r === null),
      // No end marker and no wall-timeout kill → docker/image trouble.
      infraError: !sawEnd && !killed,
    };
  } finally {
    release();
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
