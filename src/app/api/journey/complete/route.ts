import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { conceptBySlug } from "@/content/journey";
import { awardXp } from "@/lib/xp-award";
import { XP_CONCEPT } from "@/lib/xp";

// Seal a journey chapter. Quiz/fill steps are client-validated (same trust
// model as the campaign's non-editor steps); the XpEvent ledger's unique
// constraint makes the reward replay-proof, and the stakes are XP_CONCEPT.

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to seal chapters." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { conceptSlug } = (body ?? {}) as { conceptSlug?: unknown };
  if (typeof conceptSlug !== "string") {
    return NextResponse.json(
      { error: "Expected { conceptSlug: string }." },
      { status: 400 },
    );
  }

  const concept = conceptBySlug(conceptSlug);
  if (!concept || concept.meta.status !== "live") {
    return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
  }

  let outcome;
  try {
    outcome = await prisma.$transaction(async (tx) => {
      await tx.journeyProgress.upsert({
        where: { userId_conceptSlug: { userId, conceptSlug } },
        create: { userId, conceptSlug, completed: true, completedAt: new Date() },
        update: { completed: true, completedAt: new Date() },
      });
      return awardXp(tx, {
        userId,
        amount: XP_CONCEPT,
        source: "journey",
        sourceKey: conceptSlug,
      });
    });
  } catch (e) {
    // Concurrent duplicate → P2002 aborts the transaction; catch OUTSIDE
    // (see src/lib/xp-award.ts). The winner credited.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const character = await prisma.character.findUnique({
        where: { userId },
        select: { xp: true, level: true },
      });
      return NextResponse.json({
        completed: true,
        already: true,
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
    completed: true,
    already: !outcome.awarded,
    xp: outcome,
  });
}
