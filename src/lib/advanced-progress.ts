import "server-only";

import { prisma } from "@/lib/db";
import { advancedTracks, type AdvancedTrack } from "@/content/advanced/curriculum";

// "How far into the Advanced Path is this reader" — consumed by /advanced,
// /advanced/[slug] and the Hall's third door.
//
// Progress is read from the same `Progress` table as the campaign, keyed by
// `Lesson.slug`. That is deliberate: an advanced lesson is an ordinary lesson
// row, so XP, submissions and the lesson player all work with no special
// cases anywhere. The only thing that differs is which surface links to it.

export interface AdvancedTrackProgress {
  track: AdvancedTrack;
  /** Authored lessons that actually exist as rows, in curriculum order. */
  lessons: { slug: string; title: string; summary: string; done: boolean }[];
  doneCount: number;
  total: number;
  /** 0–100 against the authored lesson count (never the advertised one). */
  percent: number;
  /** First unfinished lesson — the "resume" target. */
  nextLessonSlug: string | null;
}

export interface AdvancedProgress {
  rows: AdvancedTrackProgress[];
  totalDone: number;
  totalLessons: number;
  /** Across every active track — drives the Hall door's one-line summary. */
  percent: number;
}

async function completedSlugs(userId?: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  const rows = await prisma.progress.findMany({
    where: { userId, completed: true, lesson: { slug: { in: allSlugs() } } },
    select: { lesson: { select: { slug: true } } },
  });
  return new Set(rows.map((r) => r.lesson.slug));
}

function allSlugs(): string[] {
  return advancedTracks.flatMap((t) => t.lessons.map((l) => l.slug));
}

function buildRow(
  track: AdvancedTrack,
  done: Set<string>,
): AdvancedTrackProgress {
  const lessons = track.lessons.map((l) => ({
    slug: l.slug,
    title: l.title,
    summary: l.summary,
    done: done.has(l.slug),
  }));
  const doneCount = lessons.filter((l) => l.done).length;
  const total = lessons.length;

  return {
    track,
    lessons,
    doneCount,
    total,
    percent: total === 0 ? 0 : Math.round((doneCount / total) * 100),
    nextLessonSlug: lessons.find((l) => !l.done)?.slug ?? null,
  };
}

export async function getAdvancedProgress(
  userId?: string | null,
): Promise<AdvancedProgress> {
  const done = await completedSlugs(userId);
  const rows = advancedTracks
    .filter((t) => t.status === "active")
    .map((t) => buildRow(t, done));

  const totalDone = rows.reduce((n, r) => n + r.doneCount, 0);
  const totalLessons = rows.reduce((n, r) => n + r.total, 0);

  return {
    rows,
    totalDone,
    totalLessons,
    percent: totalLessons === 0 ? 0 : Math.round((totalDone / totalLessons) * 100),
  };
}

export async function getAdvancedTrackProgress(
  slug: string,
  userId?: string | null,
): Promise<AdvancedTrackProgress | null> {
  const track = advancedTracks.find((t) => t.slug === slug);
  if (!track) return null;
  return buildRow(track, await completedSlugs(userId));
}
