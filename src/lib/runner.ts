import "server-only";

import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Hardened Docker execution of a Rust submission.
//
// The grader inside the container is the tusst-runner binary (see runner/):
// it evaluates the AST check spec, compiles with rustc (-D warnings), runs
// with a 5s timeout and reports everything as ONE JSON line on stdout:
//
//   __TUSST_REPORT__ {"schema_version":1,...}
//
// The check spec is piped in over STDIN — never mounted: /submission is
// readable by the student's program, so a checks.json on disk would leak the
// hidden tests.
//
// Security posture (from the project plan — non-negotiable):
//   --network none            no network, ever
//   --read-only               immutable rootfs; /tmp is the only writable spot
//   --tmpfs /tmp (exec)       build + run scratch, capped at 256MB
//   --cap-drop ALL            no capabilities
//   --pids-limit / --memory / --cpus   fork/alloc/cpu bombs contained
//   non-root user             baked into the image
//   host wall timeout         the container is killed even if the runner hangs
//
// Compiler output is path-stripped and capped before it leaves this module.
// Scale path (documented, not built): move this call behind a BullMQ/Redis
// queue with a worker pool — the SandboxResult contract already survives that
// swap.

export interface SandboxResult {
  ok: boolean; // the sandbox itself ran (docker available, report parsed)
  compiled: boolean;
  ran: boolean; // program exited 0 within the time limit
  timedOut: boolean;
  stdout: string;
  compileError: string; // sanitized, capped — safe for the client
  checks: { name: string; passed: boolean }[]; // AST check outcomes
  specError?: string; // authoring bug in the check spec — log server-side
}

const IMAGE = "tusst-runner:latest";
const REPORT_SENTINEL = "__TUSST_REPORT__ ";
const REPORT_SCHEMA_VERSION = 1;
const WALL_TIMEOUT_MS = 30_000;
const MAX_OUTPUT_BYTES = 1024 * 1024;
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

interface Report {
  schema_version: number;
  syntax_ok: boolean;
  checks: { name: string; passed: boolean }[];
  compiled: boolean;
  compile_error: string;
  run: "ok" | "timeout" | "crash" | "skipped";
  exit_code: number | null;
  stdout: string;
  spec_error: string | null;
}

// The report is the last (only) sentinel-prefixed line of container stdout.
// Anything unexpected — old image without the sentinel, wrong schema version,
// malformed JSON — is an infra failure (retryable 503), never a verdict.
function parseReport(containerStdout: string): Report | null {
  const line = containerStdout
    .split("\n")
    .reverse()
    .find((l) => l.startsWith(REPORT_SENTINEL));
  if (!line) return null;
  try {
    const report = JSON.parse(line.slice(REPORT_SENTINEL.length)) as Report;
    if (report.schema_version !== REPORT_SCHEMA_VERSION) return null;
    return report;
  } catch {
    return null;
  }
}

export async function runInSandbox(
  code: string,
  checksJson?: string,
): Promise<SandboxResult> {
  const failure: SandboxResult = {
    ok: false,
    compiled: false,
    ran: false,
    timedOut: false,
    stdout: "",
    compileError: "",
    checks: [],
  };

  await acquire();
  const dir = await mkdtemp(join(tmpdir(), "tusst-sub-"));
  try {
    await writeFile(join(dir, "main.rs"), code, "utf8");

    const containerStdout = await new Promise<string | null>((resolve) => {
      const child = spawn("docker", [
        "run",
        "--rm",
        "-i", // check spec arrives on stdin
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
      ]);

      let out = "";
      let settled = false;
      const settle = (value: string | null) => {
        if (!settled) {
          settled = true;
          clearTimeout(wall);
          resolve(value);
        }
      };
      const wall = setTimeout(() => {
        child.kill("SIGKILL");
        settle(null);
      }, WALL_TIMEOUT_MS);

      child.stdout.on("data", (chunk: Buffer) => {
        if (out.length < MAX_OUTPUT_BYTES) out += chunk.toString("utf8");
      });
      child.stderr.resume(); // drain, discard
      child.on("error", () => settle(null)); // docker binary missing
      child.on("close", (exitCode) => {
        // The runner always exits 0; non-zero means infra trouble (daemon
        // down, image missing).
        settle(exitCode === 0 ? out : null);
      });

      child.stdin.on("error", () => {}); // container may die before the write
      child.stdin.end(checksJson ?? '{"schema_version":1,"checks":[]}');
    });

    if (containerStdout === null) return failure;
    const report = parseReport(containerStdout);
    if (!report) return failure;

    return {
      ok: true,
      compiled: report.compiled,
      ran: report.run === "ok",
      timedOut: report.run === "timeout",
      stdout: report.stdout,
      compileError: report.compiled
        ? ""
        : sanitizeCompilerOutput(report.compile_error),
      checks: report.checks,
      specError: report.spec_error ?? undefined,
    };
  } catch {
    return failure;
  } finally {
    release();
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
