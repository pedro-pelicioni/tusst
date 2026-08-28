import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { labBySlug } from "@/content/labs";
import { verifyOnChain } from "@/lib/labs/verify";
import { awardXp } from "@/lib/xp-award";
import { XP_LAB } from "@/lib/xp";
import type { LabArtifacts } from "@/content/labs/types";

// Lab completion claim. The client presents an address + artifacts; the
// server reads the chain itself (src/lib/labs/verify.ts) before persisting
// LabProgress and granting XP. Completion is provable, never client-claimed.

const ADDRESS_RE = /^G[A-Z2-7]{55}$/;
const MAX_BODY_BYTES = 16 * 1024;

// Horizon reads take a few round trips.
export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to claim your XP." },
      { status: 401 },
    );
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Body too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { labSlug, address, artifacts } = (body ?? {}) as {
    labSlug?: unknown;
    address?: unknown;
    artifacts?: unknown;
  };
  if (typeof labSlug !== "string") {
    return NextResponse.json(
      { error: "Expected { labSlug: string }." },
      { status: 400 },
    );
  }

  const lab = labBySlug(labSlug);
  if (!lab || lab.meta.status !== "live") {
    return NextResponse.json({ error: "Lab not found." }, { status: 404 });
  }

  // Sim-only labs (empty verify[]) have nothing on-chain to check — the
  // claim is honor-based, like sealing a journey chapter. Every lab that
  // touches the chain requires a valid account address.
  const needsChain = lab.verify.length > 0;
  if (needsChain && (typeof address !== "string" || !ADDRESS_RE.test(address))) {
    return NextResponse.json(
      { error: "Not a Stellar account address." },
      { status: 400 },
    );
  }

  if (needsChain) {
    let verdict;
    try {
      verdict = await verifyOnChain(address as string, lab.verify);
    } catch {
      return NextResponse.json(
        { error: "Could not reach the testnet — try again in a moment." },
        { status: 503 },
      );
    }
    if (!verdict.passed) {
      return NextResponse.json(
        { completed: false, failed: verdict.failed },
        { status: 422 },
      );
    }
  }

  // Keep only the artifact shape we defined; ignore anything else the
  // client sent. Verification above is the trust anchor, not this blob.
  const cleanArtifacts: LabArtifacts = {
    address: typeof address === "string" ? address : undefined,
    txHashes: {},
  };
  if (artifacts && typeof artifacts === "object") {
    const tx = (artifacts as { txHashes?: unknown }).txHashes;
    if (tx && typeof tx === "object") {
      for (const [k, v] of Object.entries(tx as Record<string, unknown>)) {
        if (typeof v === "string" && /^[0-9a-f]{64}$/.test(v) && k.length <= 64) {
          cleanArtifacts.txHashes[k] = v;
        }
      }
    }
  }

  let outcome;
  try {
    outcome = await prisma.$transaction(async (tx) => {
      await tx.labProgress.upsert({
        where: { userId_labSlug: { userId, labSlug } },
        create: {
          userId,
          labSlug,
          stepsDone: lab.steps.length,
          artifacts: cleanArtifacts as unknown as Prisma.InputJsonValue,
          completed: true,
          completedAt: new Date(),
        },
        update: {
          stepsDone: lab.steps.length,
          artifacts: cleanArtifacts as unknown as Prisma.InputJsonValue,
          completed: true,
          completedAt: new Date(),
        },
      });
      return awardXp(tx, {
        userId,
        amount: XP_LAB[lab.meta.difficulty],
        source: "lab",
        sourceKey: labSlug,
      });
    });
  } catch (e) {
    // A concurrent duplicate claim lost the race on the XpEvent unique
    // constraint, aborting the transaction (P2002 must be caught OUTSIDE
    // $transaction on Postgres — see src/lib/xp-award.ts). The winner
    // credited; answer this request as "already claimed".
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
