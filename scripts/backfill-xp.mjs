// One-off, owner-run XP backfill: every completed lesson that predates the
// XP ledger earns its XpEvent retroactively, then Character.xp/level are
// recomputed from the ledger. Idempotent by construction — the (userId,
// source, sourceKey) unique constraint plus skipDuplicates means re-running
// never double-credits.
//
//   node scripts/backfill-xp.mjs            (local dev DB)
//   DATABASE_URL=… node scripts/backfill-xp.mjs   (Neon — owner only)

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Keep in sync with src/lib/xp.ts (plain .mjs can't import the TS module).
const XP_LESSON = 25;
const levelFromXp = (xp) =>
  xp <= 0 ? 1 : Math.max(1, Math.floor((1 + Math.sqrt(1 + xp / 12.5)) / 2));

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const done = await prisma.progress.findMany({
  where: { completed: true },
  select: { userId: true, lesson: { select: { slug: true } } },
});

const { count } = await prisma.xpEvent.createMany({
  data: done.map((p) => ({
    userId: p.userId,
    amount: XP_LESSON,
    source: "lesson",
    sourceKey: p.lesson.slug,
  })),
  skipDuplicates: true,
});

// Recompute aggregates from the ledger for every user that has any events —
// this also heals drift if a past transaction half-applied.
const totals = await prisma.xpEvent.groupBy({
  by: ["userId"],
  _sum: { amount: true },
});

let updated = 0;
for (const t of totals) {
  const xp = t._sum.amount ?? 0;
  await prisma.character.upsert({
    where: { userId: t.userId },
    create: { userId: t.userId, xp, level: levelFromXp(xp) },
    update: { xp, level: levelFromXp(xp) },
  });
  updated++;
}

console.log(
  `[backfill-xp] ${done.length} completed lessons scanned · ${count} new XpEvents · ${updated} characters recomputed`,
);
await prisma.$disconnect();
