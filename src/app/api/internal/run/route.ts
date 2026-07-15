import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runInSandbox } from "@/lib/runner";

// Internal grading endpoint — the runner-host half of the lesson-grading
// split (see runRemote in src/lib/runner.ts). Serves ONLY when this instance
// IS the runner: RUNNER_SHARED_SECRET set and no RUNNER_REMOTE_URL (a
// misconfigured instance proxying to itself would recurse). Everything else
// gets a 404, indistinguishable from the route not existing.

const MAX_CODE_BYTES = 64 * 1024;
const MAX_CHECKS_BYTES = 256 * 1024;

const SECRET = process.env.RUNNER_SHARED_SECRET ?? "";
const IS_RUNNER = SECRET !== "" && !process.env.RUNNER_REMOTE_URL;

function secretMatches(provided: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(SECRET, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!IS_RUNNER || !secretMatches(req.headers.get("x-runner-secret") ?? "")) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { code, checks } = (body ?? {}) as { code?: unknown; checks?: unknown };
  if (
    typeof code !== "string" ||
    Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES ||
    (checks !== undefined &&
      (typeof checks !== "string" ||
        Buffer.byteLength(checks, "utf8") > MAX_CHECKS_BYTES))
  ) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  return NextResponse.json(await runInSandbox(code, checks));
}
