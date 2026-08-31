import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { JOURNEY_ARCS } from "@/content/journey";
import { getJourneyChaptersLocalized } from "@/content/journey/i18n";
import {
  buildPaper,
  gradePaper,
  type TestOutScope,
} from "@/content/journey/test-out";
import { getLocale } from "@/i18n/server";
import { awardXp } from "@/lib/xp-award";
import { XP_CONCEPT } from "@/lib/xp";

// The test-out paper: GET one, POST it back to be marked.
//
// The answers live only here. GET ships questions with their options already
// permuted; POST receives DISPLAY positions and re-derives the same paper
// from the nonce to mark it. A passing paper seals exactly what it asked
// about — the one chapter, or every live chapter in the arc.
//
// Reading a paper is open (same as reading a chapter signed out); sealing one
// needs an account, because that is where XP lands.

function parseTarget(searchParams: URLSearchParams) {
  const scope = searchParams.get("scope");
  const target = searchParams.get("target");
  if (scope !== "chapter" && scope !== "arc") return null;
  if (!target) return null;
  if (scope === "arc" && !JOURNEY_ARCS.includes(target as never)) return null;
  return { scope: scope as TestOutScope, target };
}

export async function GET(req: Request) {
  const parsed = parseTarget(new URL(req.url).searchParams);
  if (!parsed) {
    return NextResponse.json({ error: "Unknown paper." }, { status: 400 });
  }
  const locale = await getLocale();
  const chapters = getJourneyChaptersLocalized(locale);
  const paper = buildPaper(
    parsed.scope,
    parsed.target,
    chapters,
    randomUUID(),
  );
  if (!paper) {
    return NextResponse.json(
      { error: "No test-out for this one yet." },
      { status: 404 },
    );
  }
  return NextResponse.json(paper, {
    // A paper is minted per request; caching one would hand the same draw to
    // everybody and make a second attempt pointless.
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to skip ahead." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { scope, target, nonce, picks } = (body ?? {}) as {
    scope?: unknown;
    target?: unknown;
    nonce?: unknown;
    picks?: unknown;
  };
  if (
    (scope !== "chapter" && scope !== "arc") ||
    typeof target !== "string" ||
    typeof nonce !== "string" ||
    !Array.isArray(picks) ||
    !picks.every((p) => Number.isInteger(p))
  ) {
    return NextResponse.json(
      { error: "Expected { scope, target, nonce, picks }." },
      { status: 400 },
    );
  }

  const locale = await getLocale();
  const chapters = getJourneyChaptersLocalized(locale);
  const verdict = gradePaper(
    scope,
    target,
    chapters,
    nonce,
    picks as number[],
  );
  if (!verdict) {
    return NextResponse.json({ error: "Unknown paper." }, { status: 404 });
  }

  if (!verdict.passed) {
    return NextResponse.json({
      passed: false,
      correct: verdict.correct,
      total: verdict.total,
      sealed: [],
    });
  }

  let earned = 0;
  let total = 0;
  let level = 1;
  let leveledUp = false;
  try {
    await prisma.$transaction(async (tx) => {
      for (const slug of verdict.seals) {
        await tx.journeyProgress.upsert({
          where: { userId_conceptSlug: { userId, conceptSlug: slug } },
          create: {
            userId,
            conceptSlug: slug,
            completed: true,
            completedAt: new Date(),
          },
          update: { completed: true, completedAt: new Date() },
        });
        // Same stakes as reading it — passing the paper proves the same
        // thing. The ledger's unique key means an already-sealed chapter
        // simply reports awarded:false instead of paying twice.
        const outcome = await awardXp(tx, {
          userId,
          amount: XP_CONCEPT,
          source: "journey",
          sourceKey: slug,
        });
        earned += outcome.earned;
        total = outcome.total;
        level = outcome.level;
        leveledUp = leveledUp || outcome.leveledUp;
      }
    });
  } catch (e) {
    // Concurrent duplicate → P2002 aborts the transaction; caught OUTSIDE
    // it, same rule as api/journey/complete and the gold credit.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const character = await prisma.character.findUnique({
        where: { userId },
        select: { xp: true, level: true },
      });
      return NextResponse.json({
        passed: true,
        correct: verdict.correct,
        total: verdict.total,
        sealed: verdict.seals,
        xp: {
          awarded: false,
          earned: 0,
          total: character?.xp ?? 0,
          level: character?.level ?? 1,
          leveledUp: false,
        },
      });
    }
    throw e;
  }

  return NextResponse.json({
    passed: true,
    correct: verdict.correct,
    total: verdict.total,
    sealed: verdict.seals,
    xp: { awarded: earned > 0, earned, total, level, leveledUp },
  });
}
