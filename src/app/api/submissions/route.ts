import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { gradeSubmission } from "@/lib/validate";
import { TRIAL_LESSON_SLUG } from "@/content/steps";
import { acts } from "@/content/campaign";
import { getUnlockedActCount } from "@/lib/unlock";

const MAX_CODE_BYTES = 64 * 1024;
const MAX_BODY_BYTES = 80 * 1024; // code + JSON envelope

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  // Reject oversized requests before buffering the body. (Chunked bodies
  // without a length still get the per-field cap below.)
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Submission too large (64KB max)." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { lessonSlug, code } = (body ?? {}) as {
    lessonSlug?: unknown;
    code?: unknown;
  };
  if (typeof lessonSlug !== "string" || typeof code !== "string") {
    return NextResponse.json(
      { error: "Expected { lessonSlug: string, code: string }." },
      { status: 400 },
    );
  }
  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    return NextResponse.json(
      { error: "Submission too large (64KB max)." },
      { status: 413 },
    );
  }

  // Delayed signup (Mimo-style): the trial lesson is gradeable anonymously.
  // Everything else still requires an account. Anonymous verdicts are
  // stateless — no Submission row, no Progress, no gold.
  if (!userId && lessonSlug !== TRIAL_LESSON_SLUG) {
    return NextResponse.json(
      { error: "Sign in to submit solutions." },
      { status: 401 },
    );
  }

  const lesson = await prisma.lesson.findUnique({
    where: { slug: lessonSlug },
    include: { track: { select: { status: true, slug: true } } },
  });
  if (!lesson || lesson.status !== "active") {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  // Same campaign gate as the lesson page: live content, or an act unlocked
  // by the onboarding answer / by clearing everything before it.
  if (lesson.track.status !== "active") {
    const actIndex = acts.findIndex((a) => a.trackSlug === lesson.track.slug);
    const unlockedAct =
      actIndex >= 0 && actIndex < (await getUnlockedActCount(userId));
    if (!unlockedAct) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }
  }

  const verdict = await gradeSubmission(lessonSlug, code);
  if (!verdict) {
    return NextResponse.json(
      { error: "This lesson isn't playable yet." },
      { status: 422 },
    );
  }
  if (verdict.infraError) {
    return NextResponse.json(
      { error: "The forge is cold — the runner is unavailable. Try again." },
      { status: 503 },
    );
  }

  // Anonymous trial run: return the sanitized verdict without persisting.
  if (!userId) {
    return NextResponse.json({
      passed: verdict.passed,
      results: verdict.results,
      output: verdict.output,
      firstCompletion: false,
    });
  }

  // Full detail stays server-side (outputLog); the client gets only the
  // sanitized verdict below — never raw internals (Phase 4 rule, applied now).
  await prisma.submission.create({
    data: {
      userId,
      lessonId: lesson.id,
      code,
      status: verdict.passed ? "pass" : "fail",
      outputLog: JSON.stringify(verdict.results),
    },
  });

  // Phase 5 (the HIDDEN GOLD reveal): gold is credited exactly once per
  // lesson, and the FIRST credited completion flips User.goldRevealed — from
  // that moment on the pouch (header counter, profile) becomes visible and
  // the verdict carries the reward so the client can celebrate it.
  let firstCompletion = false;
  let goldOutcome: { earned: number; total: number; firstReveal: boolean } | null =
    null;
  if (verdict.passed) {
    // Atomic against concurrent passing submissions (double ⌘⏎, parallel
    // POSTs): the conditional updateMany re-evaluates its WHERE under the row
    // lock, and a concurrent duplicate create aborts the whole transaction
    // with P2002 — so the gold increment can never commit twice.
    try {
      const outcome = await prisma.$transaction(async (tx) => {
        const flipped = await tx.progress.updateMany({
          where: { userId, lessonId: lesson.id, completed: false },
          data: { completed: true, completedAt: new Date() },
        });
        let credited = flipped.count === 1;

        if (!credited) {
          const existing = await tx.progress.findUnique({
            where: { userId_lessonId: { userId, lessonId: lesson.id } },
            select: { id: true },
          });
          if (!existing) {
            await tx.progress.create({
              data: {
                userId,
                lessonId: lesson.id,
                completed: true,
                completedAt: new Date(),
              },
            });
            credited = true;
          }
        }

        if (!credited) return null;

        const before = await tx.user.findUniqueOrThrow({
          where: { id: userId },
          select: { goldRevealed: true },
        });
        const after = await tx.user.update({
          where: { id: userId },
          data: { gold: { increment: lesson.goldReward }, goldRevealed: true },
          select: { gold: true },
        });
        return {
          earned: lesson.goldReward,
          total: after.gold,
          firstReveal: !before.goldRevealed,
        };
      });
      firstCompletion = outcome !== null;
      goldOutcome = outcome;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        // A concurrent submission won the race — it credited; we didn't.
        firstCompletion = false;
      } else {
        throw e;
      }
    }
  }

  return NextResponse.json({
    passed: verdict.passed,
    results: verdict.results,
    output: verdict.output,
    firstCompletion,
    // Present only when this pass credited the reward (goldRevealed is now
    // guaranteed true — the economy stays hidden for anonymous/unrevealed).
    gold: goldOutcome ?? undefined,
  });
}
