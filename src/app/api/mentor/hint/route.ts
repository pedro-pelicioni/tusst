import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { acts } from "@/content/campaign";
import { getUnlockedActCount } from "@/lib/unlock";
import { getLessonContentLocalized } from "@/content/i18n/server";
import { getLocale } from "@/i18n/server";
import {
  chatCompletion,
  mentorConfigured,
  mentorModel,
} from "@/lib/mentor/provider";
import { buildMentorMessages } from "@/lib/mentor/prompt";
import { checkMentorQuota } from "@/lib/mentor/rate-limit";
import { extractStaticHints } from "@/lib/mentor/static-hints";

// AI mentor: one Socratic hint for the student's latest failed submission.
//
// The client sends only the lesson slug — code, failed checks and compiler
// output are read back from the Submission row this server graded, so the
// hint context can't be forged. Degrades to the lesson's authored hints
// when the LLM is over quota or unreachable.

const MAX_BODY_BYTES = 1024;

// LLM round trip (20s provider timeout) + DB reads.
export const maxDuration = 30;

interface StoredVerdict {
  results: { name: string; passed: boolean }[];
  output: string;
}

// outputLog holds { results, output } since the mentor feature; older rows
// hold a bare results array (no output — the hint still works from code +
// failed check names).
function parseOutputLog(log: string | null): StoredVerdict {
  if (!log) return { results: [], output: "" };
  try {
    const parsed: unknown = JSON.parse(log);
    if (Array.isArray(parsed)) {
      return { results: parsed as StoredVerdict["results"], output: "" };
    }
    const obj = parsed as Partial<StoredVerdict> | null;
    return {
      results: Array.isArray(obj?.results) ? obj.results : [],
      output: typeof obj?.output === "string" ? obj.output : "",
    };
  } catch {
    return { results: [], output: "" };
  }
}

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
  const { lessonSlug } = (body ?? {}) as { lessonSlug?: unknown };
  if (typeof lessonSlug !== "string") {
    return NextResponse.json(
      { error: "Expected { lessonSlug: string }." },
      { status: 400 },
    );
  }

  const lesson = await prisma.lesson.findUnique({
    where: { slug: lessonSlug },
    include: { track: { select: { status: true, slug: true } } },
  });
  if (!lesson || lesson.status !== "active") {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }
  // Same campaign gate as grading: no hints for content the player can't see.
  if (lesson.track.status !== "active") {
    const actIndex = acts.findIndex((a) => a.trackSlug === lesson.track.slug);
    const unlockedAct =
      actIndex >= 0 && actIndex < (await getUnlockedActCount(userId));
    if (!unlockedAct) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }
  }

  const locale = await getLocale();
  const content = getLessonContentLocalized(lessonSlug, locale);
  if (!content) {
    return NextResponse.json(
      { error: "This lesson isn't playable yet." },
      { status: 422 },
    );
  }
  const staticHints = extractStaticHints(content.instructions);

  if (!mentorConfigured()) {
    return NextResponse.json(
      { error: "mentor_unavailable", staticHints },
      { status: 503 },
    );
  }

  const submission = await prisma.submission.findFirst({
    where: { userId, lessonId: lesson.id, status: "fail" },
    orderBy: { createdAt: "desc" },
    select: { id: true, code: true, outputLog: true },
  });
  if (!submission) {
    return NextResponse.json(
      { error: "no_failed_submission" },
      { status: 409 },
    );
  }

  const quota = await checkMentorQuota(userId, lesson.id);

  // Cache before quota: re-asking about the same graded attempt is free and
  // never burns provider budget.
  const cached = await prisma.mentorHint.findUnique({
    where: { submissionId: submission.id },
    select: { hint: true },
  });
  if (cached) {
    return NextResponse.json({
      hint: cached.hint,
      cached: true,
      remaining: quota.allowed ? quota.remaining : 0,
    });
  }

  if (!quota.allowed) {
    return NextResponse.json(
      { error: "rate_limited", scope: quota.scope, staticHints },
      { status: 429 },
    );
  }

  const verdict = parseOutputLog(submission.outputLog);
  const messages = buildMentorMessages({
    locale,
    instructions: content.instructions,
    studentCode: submission.code,
    failedChecks: verdict.results.filter((r) => !r.passed).map((r) => r.name),
    output: verdict.output,
    expectedOutput: content.expectedOutput,
  });
  if (process.env.NODE_ENV !== "production") {
    console.debug("[mentor] prompt:\n", messages[1]?.content);
  }

  const completion = await chatCompletion(messages);
  if (!completion.ok) {
    return NextResponse.json(
      { error: completion.reason, staticHints },
      { status: completion.reason === "rate_limited" ? 429 : 503 },
    );
  }

  try {
    await prisma.mentorHint.create({
      data: {
        userId,
        lessonId: lesson.id,
        submissionId: submission.id,
        locale,
        hint: completion.text,
        model: mentorModel(),
      },
    });
  } catch (e) {
    // Double-click race: a concurrent request persisted first. Its hint is
    // equally valid — serve ours without a second row.
    if (
      !(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
    ) {
      throw e;
    }
  }

  return NextResponse.json({
    hint: completion.text,
    remaining: quota.remaining - 1,
  });
}
