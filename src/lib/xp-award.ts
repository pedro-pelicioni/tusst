import "server-only";

import type { Prisma } from "@prisma/client";
import { levelFromXp, type XpSource } from "./xp";

// Award XP inside a caller-owned transaction. The XpEvent unique constraint
// (userId, source, sourceKey) is the anti-replay guard. Sequential replays
// are answered by the read-before-create below; a truly CONCURRENT duplicate
// hits the constraint, and on Postgres that P2002 aborts the whole
// transaction — it must be caught OUTSIDE $transaction by the caller (same
// rule as the gold credit in api/submissions; a query after a failed
// statement inside an aborted tx only yields "current transaction is
// aborted"). Character.xp/level are updated in the same transaction so the
// aggregate can never drift from the ledger.

export interface XpAwardOutcome {
  awarded: boolean;
  earned: number;
  /** ledger total after (or without) this award */
  total: number;
  level: number;
  leveledUp: boolean;
}

export async function awardXp(
  tx: Prisma.TransactionClient,
  {
    userId,
    amount,
    source,
    sourceKey,
  }: { userId: string; amount: number; source: XpSource; sourceKey: string },
): Promise<XpAwardOutcome> {
  const existing = await tx.xpEvent.findUnique({
    where: { userId_source_sourceKey: { userId, source, sourceKey } },
    select: { id: true },
  });
  if (existing) {
    // Already awarded (replayed claim, double-submit) — report current state.
    const character = await tx.character.findUnique({
      where: { userId },
      select: { xp: true, level: true },
    });
    return {
      awarded: false,
      earned: 0,
      total: character?.xp ?? 0,
      level: character?.level ?? 1,
      leveledUp: false,
    };
  }
  // Concurrent duplicate → P2002 aborts the caller's transaction (see above).
  await tx.xpEvent.create({ data: { userId, amount, source, sourceKey } });

  // events.createUser forges a Character for every signup, but the upsert
  // keeps dev/demo accounts from crashing if the row is missing.
  const bumped = await tx.character.upsert({
    where: { userId },
    create: { userId, xp: amount, level: levelFromXp(amount) },
    update: { xp: { increment: amount } },
    select: { xp: true, level: true },
  });
  const level = levelFromXp(bumped.xp);
  if (level !== bumped.level) {
    await tx.character.update({ where: { userId }, data: { level } });
  }
  return {
    awarded: true,
    earned: amount,
    total: bumped.xp,
    level,
    leveledUp: level > bumped.level,
  };
}
