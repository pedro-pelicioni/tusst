import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale } from "@/i18n/server";
import {
  chatCompletion,
  mentorConfigured,
  mentorModel,
} from "@/lib/mentor/provider";
import { buildForgeMentorMessages } from "@/lib/mentor/prompt";
import { checkMentorQuota } from "@/lib/mentor/rate-limit";
import { searchRavenDocs } from "@/lib/mentor/raven";

// AI mentor for the Forge IDE: one Socratic hint about a failed build/test/
// audit run. Unlike lesson hints there is no server-side submission to read
// back — Forge runs aren't persisted — so the client sends its editor
// snapshot and console tail. That's acceptable here: there's no grading or
// reward attached, so forging the context only cheats yourself. The content
// is still treated as untrusted data in the prompt.

const MAX_BODY_BYTES = 96 * 1024;
const MAX_FILES = 6;
const MAX_FILE_CHARS = 24_000;
const MAX_LOG_CHARS = 12_000;
const MODES = new Set(["build", "test", "audit"]);

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to ask the mentor." },
      { status: 401 },
    );
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { mode, files, log } = (body ?? {}) as {
    mode?: unknown;
    files?: unknown;
    log?: unknown;
  };
  if (
    typeof mode !== "string" ||
    !MODES.has(mode) ||
    typeof log !== "string" ||
    typeof files !== "object" ||
    files === null ||
    Array.isArray(files)
  ) {
    return NextResponse.json(
      { error: "Expected { mode, files, log }." },
      { status: 400 },
    );
  }

  if (!mentorConfigured()) {
    return NextResponse.json({ error: "mentor_unavailable" }, { status: 503 });
  }

  const quota = await checkMentorQuota(userId, null);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: "rate_limited", scope: quota.scope },
      { status: 429 },
    );
  }

  // lib.rs first — it's where the contract (and usually the error) lives.
  const fileList = Object.entries(files as Record<string, unknown>)
    .filter((e): e is [string, string] => typeof e[1] === "string")
    .sort(([a], [b]) =>
      a.endsWith("lib.rs") ? -1 : b.endsWith("lib.rs") ? 1 : a.localeCompare(b),
    )
    .slice(0, MAX_FILES)
    .map(([path, contents]) => ({
      path: path.slice(0, 200),
      contents: contents.slice(0, MAX_FILE_CHARS),
    }));

  const logTail = log.slice(-MAX_LOG_CHARS);
  const locale = await getLocale();

  // Forge is always Soroban — ground the hint on the docs when Raven is
  // authorized. Query from the first compiler error line, else the mode.
  const errorLine = logTail
    .split("\n")
    .find((l) => /error(\[E\d+\])?:/.test(l))
    ?.slice(0, 160);
  const stellarDocs = await searchRavenDocs(
    errorLine ? `Soroban ${errorLine}` : `Soroban contract ${mode} failure`,
  );

  const completion = await chatCompletion(
    buildForgeMentorMessages({ locale, mode: mode as "build" | "test" | "audit", files: fileList, log: logTail, stellarDocs }),
  );
  if (!completion.ok) {
    return NextResponse.json(
      { error: completion.reason },
      { status: completion.reason === "rate_limited" ? 429 : 503 },
    );
  }

  await prisma.mentorHint.create({
    data: {
      userId,
      kind: "forge",
      locale,
      hint: completion.text,
      model: mentorModel(),
    },
  });

  return NextResponse.json({
    hint: completion.text,
    remaining: quota.remaining - 1,
  });
}
