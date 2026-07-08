import "server-only";

import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Hardened Docker execution of a Rust submission (Phase 4).
//
// Security posture (from the project plan — non-negotiable):
//   --network none            no network, ever
//   --read-only               immutable rootfs; /tmp is the only writable spot
//   --tmpfs /tmp (exec)       build + run scratch, capped at 256MB
//   --cap-drop ALL            no capabilities
//   --pids-limit / --memory / --cpus   fork/alloc/cpu bombs contained
//   non-root user             baked into the image
//   host wall timeout         the container is killed even if `timeout` dies
//
// stderr is never returned raw: compiler output is path-stripped and capped
// before it leaves this module. Scale path (documented, not built): move this
// call behind a BullMQ/Redis queue with a worker pool — the Verdict contract
// already survives that swap.

export interface SandboxResult {
  ok: boolean; // the sandbox itself ran (docker available, no infra error)
  compiled: boolean;
  ran: boolean; // program exited 0 within the time limit
  timedOut: boolean;
  stdout: string;
  compileError: string; // sanitized, capped — safe for the client
}

const IMAGE = "tusst-runner:latest";
const WALL_TIMEOUT_MS = 30_000;
const MAX_CONCURRENT = 4;

// Tiny in-process semaphore — good for a single dev/server process; the
// queue replaces it at scale.
let active = 0;
const waiters: Array<() => void> = [];
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

function sanitizeCompilerOutput(raw: string): string {
  return raw
    .replaceAll("/submission/main.rs", "main.rs")
    .replaceAll("/tmp/", "")
    .slice(0, 4096)
    .trim();
}

function parseMarkers(stdout: string): Omit<SandboxResult, "ok"> {
  const compiled = /^__TUSST_COMPILE__ ok$/m.test(stdout);
  const runMatch = stdout.match(/^__TUSST_RUN__ (ok|timeout|crash)/m);
  const timedOut = runMatch?.[1] === "timeout";
  const ran = runMatch?.[1] === "ok";

  let programOut = "";
  const outStart = stdout.indexOf("__TUSST_STDOUT__\n");
  const outEnd = stdout.lastIndexOf("__TUSST_END__");
  if (outStart !== -1 && outEnd > outStart) {
    programOut = stdout.slice(outStart + "__TUSST_STDOUT__\n".length, outEnd);
    // entrypoint appends one trailing newline after the capped stdout
    if (programOut.endsWith("\n")) programOut = programOut.slice(0, -1);
  }

  let compileError = "";
  if (!compiled) {
    const errStart = stdout.indexOf("__TUSST_COMPILE__ err\n");
    const errEnd = stdout.lastIndexOf("__TUSST_END__");
    if (errStart !== -1 && errEnd > errStart) {
      compileError = sanitizeCompilerOutput(
        stdout.slice(errStart + "__TUSST_COMPILE__ err\n".length, errEnd),
      );
    }
  }

  return { compiled, ran, timedOut, stdout: programOut, compileError };
}

export async function runInSandbox(code: string): Promise<SandboxResult> {
  const failure: SandboxResult = {
    ok: false,
    compiled: false,
    ran: false,
    timedOut: false,
    stdout: "",
    compileError: "",
  };

  await acquire();
  const dir = await mkdtemp(join(tmpdir(), "tusst-sub-"));
  try {
    await writeFile(join(dir, "main.rs"), code, "utf8");

    const stdout = await new Promise<string | null>((resolve) => {
      execFile(
        "docker",
        [
          "run",
          "--rm",
          "--network", "none",
          "--read-only",
          "--tmpfs", "/tmp:rw,exec,size=256m",
          "--cap-drop", "ALL",
          "--security-opt", "no-new-privileges",
          "--pids-limit", "128",
          "--memory", "512m",
          "--cpus", "1",
          "-v", `${dir}:/submission:ro`,
          IMAGE,
        ],
        { timeout: WALL_TIMEOUT_MS, maxBuffer: 1024 * 1024, killSignal: "SIGKILL" },
        (error, out) => {
          // The entrypoint always exits 0; a non-zero exit means infra
          // trouble (daemon down, image missing, wall timeout).
          if (error && !out?.includes("__TUSST_END__")) resolve(null);
          else resolve(out ?? "");
        },
      );
    });

    if (stdout === null) return failure;
    return { ok: true, ...parseMarkers(stdout) };
  } catch {
    return failure;
  } finally {
    release();
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
