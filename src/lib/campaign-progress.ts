import "server-only";

import { prisma } from "@/lib/db";
import { acts, type Act } from "@/content/campaign";
import { getLessonContent } from "@/content/lessons";

// Single source of truth for "how far into the campaign is this player" —
// consumed by /path, /profile and the unlock gates (src/lib/unlock.ts).

export interface LessonLite {
  id: string;
  slug: string;
  order: number;
}

export interface ActProgress {
  act: Act;
  /** lessons that are live + have authored content */
  playable: LessonLite[];
  doneCount: number;
  cleared: boolean;
  /** 0–100, against the track's advertised challenge count */
  percent: number;
  nextLessonSlug: string | null;
}

export interface CampaignProgress {
  rows: ActProgress[];
  /** consecutive cleared acts from Act I (progression unlock basis) */
  clearedStreak: number;
  /** champion cards = fully cleared acts */
  cardsClaimed: number;
  totalPlayable: number;
  totalDone: number;
}

export async function getCampaignProgress(
  userId?: string | null,
): Promise<CampaignProgress> {
  const [tracks, progress] = await Promise.all([
    prisma.track.findMany({
      include: { lessons: { orderBy: { order: "asc" } } },
    }),
    userId
      ? prisma.progress.findMany({
          where: { userId, completed: true },
          select: { lessonId: true },
        })
      : Promise.resolve([]),
  ]);

  const completed = new Set(progress.map((p) => p.lessonId));
  const bySlug = new Map(tracks.map((t) => [t.slug, t]));

  const rows: ActProgress[] = acts.map((act) => {
    const track = bySlug.get(act.trackSlug);
    const playable = (track?.lessons ?? []).filter(
      (l) => l.status === "active" && !!getLessonContent(l.slug),
    );
    const done = playable.filter((l) => completed.has(l.id));
    const cleared = playable.length > 0 && done.length === playable.length;
    const denom = track?.challengeCount || playable.length || 1;
    const next = playable.find((l) => !completed.has(l.id));
    return {
      act,
      playable: playable.map((l) => ({ id: l.id, slug: l.slug, order: l.order })),
      doneCount: done.length,
      cleared,
      percent: Math.round((done.length / denom) * 100),
      nextLessonSlug: next?.slug ?? null,
    };
  });

  let clearedStreak = 0;
  while (clearedStreak < rows.length && rows[clearedStreak].cleared) {
    clearedStreak++;
  }

  return {
    rows,
    clearedStreak,
    cardsClaimed: rows.filter((r) => r.cleared).length,
    totalPlayable: rows.reduce((n, r) => n + r.playable.length, 0),
    totalDone: rows.reduce((n, r) => n + r.doneCount, 0),
  };
}
