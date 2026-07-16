import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { tracks as catalog } from "../src/content/tracks";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Representative lessons per active track. Lesson *content* (MDX) + the editor
// arrive in Phase 3 — here we seed metadata so track pages and progress work.
const LESSON_TITLES: Record<string, string[]> = {
  "rust-fundamentals": [
    "Hello, World!",
    "Variables & Mutability",
    "Data Types",
    "Functions",
    "Ownership Basics",
    "Borrowing & References",
  ],
  "control-flow": [
    "if / else",
    "match Expressions",
    "loop",
    "while Loops",
    "for Loops",
    "Nested Control Flow",
  ],
  "rust-standard-library": [
    "Vec Basics",
    "Iterators",
    "Option & map",
    "HashMap",
    "String Handling",
    "Slices",
  ],
  "mastering-option": [
    "Some or None",
    "Unwrap Safely",
    "if let",
  ],
  "mastering-result": [
    "Ok or Err",
    "Reading the Verdict",
    "The ? Operator",
  ],
  "stellar-101": [
    "Accounts & Keypairs",
    "Lumens & Fees",
    "Trustlines & Assets",
    "Your First Payment",
  ],
  // Act VII — reachable only by clearing the campaign (or a future DB flip);
  // lessons are seeded so the finale is playable the moment it unlocks.
  "soroban-smart-contracts": [
    "Your First Contract",
    "Contract Storage",
    "Authorization",
  ],
  // Act VIII — the Protocol 27 finale; same progression-only gating as Act VII.
  "stellar-protocol-27": [
    "Protocol 27: The Zipper",
    "Smart Accounts & __check_auth",
    "Authentication Delegation (CAP-0071)",
    "Signature Security & V2 Credentials",
    "Migrating to Protocol 27",
    "Boss: The Delegated Account",
  ],
};

async function main() {
  // ---- Tracks (idempotent upsert by slug) ----
  for (const t of catalog) {
    const data = {
      title: t.title,
      description: t.description,
      level: t.level,
      domain: t.domain,
      order: Number(t.index),
      status: t.status,
      tags: t.tags,
      estMinutes: t.estHours ? Math.round(t.estHours * 60) : 0,
      challengeCount: t.challenges,
      popular: t.badge === "popular",
      isNew: t.badge === "new",
    };
    await prisma.track.upsert({
      where: { slug: t.slug },
      create: { slug: t.slug, ...data },
      update: data,
    });
  }

  // ---- Lessons for every track with authored titles ----
  // (locked tracks stay gated by the pages; seeding them keeps onboarding /
  // progression unlocks playable without a re-seed)
  for (const t of catalog) {
    if (!LESSON_TITLES[t.slug]) continue;
    const track = await prisma.track.findUnique({ where: { slug: t.slug } });
    if (!track) continue;
    const titles = LESSON_TITLES[t.slug] ?? [];
    for (let i = 0; i < titles.length; i++) {
      const order = i + 1;
      const slug = `${t.slug}-${order}`;
      const data = {
        trackId: track.id,
        title: titles[i],
        summary: `Lesson ${order} of the ${t.title} track.`,
        order,
        difficulty:
          t.slug === "soroban-smart-contracts" || t.slug === "stellar-protocol-27"
            ? "hard"
            : i < 4
              ? "easy"
              : "medium",
        goldReward: 10, // accrues silently; UI gated by User.goldRevealed
        status: "active" as const,
      };
      await prisma.lesson.upsert({
        where: { slug },
        create: { slug, ...data },
        update: data,
      });
    }
  }

  // ---- Demo user with some progress (for local verification) ----
  const demo = await prisma.user.upsert({
    where: { email: "demo@dev.local" },
    create: {
      email: "demo@dev.local",
      name: "demo",
      character: { create: {} },
    },
    update: { name: "demo" },
  });

  const firstThree = await prisma.lesson.findMany({
    where: { track: { slug: "rust-fundamentals" }, order: { lte: 3 } },
    orderBy: { order: "asc" },
  });
  for (const lesson of firstThree) {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId: demo.id, lessonId: lesson.id } },
      create: {
        userId: demo.id,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      },
      update: { completed: true },
    });
  }

  const trackCount = await prisma.track.count();
  const lessonCount = await prisma.lesson.count();
  console.log(
    `Seeded ${trackCount} tracks, ${lessonCount} lessons, demo user with ${firstThree.length} completed lessons.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
