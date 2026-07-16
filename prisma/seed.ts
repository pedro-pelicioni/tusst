import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { tracks as catalog } from "../src/content/tracks";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Representative lessons per active track. Lesson *content* (MDX) + the editor
// arrive in Phase 3 — here we seed metadata so track pages and progress work.
//
// IMPORTANT — slug is explicit, never derived from array position. A real
// user's Progress is keyed to a Lesson row by id, matched here via `slug`.
// If slug were computed as `${track}-${index}` (the old scheme), inserting
// a title anywhere but the very end would shift every later slug and the
// upsert would silently repaint an existing (already-completed) row with a
// different lesson's content — see memory `tusst-seed-safety` for the 2026-
// 07-16 incident this caused in production. Appending is still the safest
// way to add a lesson (keeps `order` stable for everyone already past it),
// but with explicit slugs an insert-in-the-middle can no longer corrupt an
// existing row's identity even if someone does it anyway.
interface SeedLesson {
  slug: string;
  title: string;
}

const LESSON_TITLES: Record<string, SeedLesson[]> = {
  "rust-fundamentals": [
    { slug: "rust-fundamentals-1", title: "Hello, World!" },
    { slug: "rust-fundamentals-2", title: "Variables & Mutability" },
    { slug: "rust-fundamentals-3", title: "Data Types" },
    { slug: "rust-fundamentals-4", title: "Functions" },
    { slug: "rust-fundamentals-5", title: "Ownership Basics" },
    { slug: "rust-fundamentals-6", title: "Borrowing & References" },
  ],
  "control-flow": [
    { slug: "control-flow-1", title: "if / else" },
    { slug: "control-flow-2", title: "match Expressions" },
    { slug: "control-flow-3", title: "loop" },
    { slug: "control-flow-4", title: "while Loops" },
    { slug: "control-flow-5", title: "for Loops" },
    { slug: "control-flow-6", title: "Nested Control Flow" },
  ],
  "rust-standard-library": [
    { slug: "rust-standard-library-1", title: "Vec Basics" },
    { slug: "rust-standard-library-2", title: "Iterators" },
    { slug: "rust-standard-library-3", title: "Option & map" },
    { slug: "rust-standard-library-4", title: "HashMap" },
    { slug: "rust-standard-library-5", title: "String Handling" },
    { slug: "rust-standard-library-6", title: "Slices" },
    { slug: "rust-standard-library-7", title: "Structs" },
    { slug: "rust-standard-library-8", title: "impl & Methods" },
  ],
  "mastering-option": [
    { slug: "mastering-option-1", title: "Some or None" },
    { slug: "mastering-option-2", title: "Unwrap Safely" },
    { slug: "mastering-option-3", title: "if let" },
  ],
  "mastering-result": [
    { slug: "mastering-result-1", title: "Ok or Err" },
    { slug: "mastering-result-2", title: "Reading the Verdict" },
    { slug: "mastering-result-3", title: "The ? Operator" },
  ],
  "stellar-101": [
    { slug: "stellar-101-1", title: "Accounts & Keypairs" },
    { slug: "stellar-101-2", title: "Lumens & Fees" },
    { slug: "stellar-101-3", title: "Trustlines & Assets" },
    { slug: "stellar-101-4", title: "Your First Payment" },
  ],
  // Act VII — reachable only by clearing the campaign (or a future DB flip);
  // lessons are seeded so the finale is playable the moment it unlocks.
  "soroban-smart-contracts": [
    { slug: "soroban-smart-contracts-1", title: "Your First Contract" },
    { slug: "soroban-smart-contracts-2", title: "Contract Storage" },
    { slug: "soroban-smart-contracts-3", title: "Authorization" },
  ],
  // Act VIII — the Protocol 27 finale; same progression-only gating as Act VII.
  "stellar-protocol-27": [
    { slug: "stellar-protocol-27-1", title: "Protocol 27: The Zipper" },
    { slug: "stellar-protocol-27-2", title: "Smart Accounts & __check_auth" },
    { slug: "stellar-protocol-27-3", title: "Authentication Delegation (CAP-0071)" },
    { slug: "stellar-protocol-27-4", title: "Signature Security & V2 Credentials" },
    { slug: "stellar-protocol-27-5", title: "Migrating to Protocol 27" },
    { slug: "stellar-protocol-27-6", title: "Boss: The Delegated Account" },
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
    const lessons = LESSON_TITLES[t.slug] ?? [];
    for (let i = 0; i < lessons.length; i++) {
      const order = i + 1;
      const { slug, title } = lessons[i];
      const data = {
        trackId: track.id,
        title,
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
      const existing = await prisma.lesson.findUnique({
        where: { slug },
        select: { title: true },
      });
      if (existing && existing.title !== title) {
        // Title changed under an existing slug — either an intentional rename
        // (fine) or a sign LESSON_TITLES got reordered/edited in place instead
        // of appended (the bug this structure is meant to prevent). Flagged,
        // not blocked, since legitimate renames are common.
        console.warn(
          `[seed] ${slug}: title changing "${existing.title}" -> "${title}" — confirm this is an intentional rename, not a reorder.`,
        );
      }
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
