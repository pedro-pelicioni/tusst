import type { Track, TrackLevel, TrackDomain } from "@/content/tracks";

// Maps a Prisma Track row into the view-model used by <TrackCard /> and the
// track pages. Keeps the UI decoupled from the DB shape.
export interface DbTrackLike {
  slug: string;
  title: string;
  description: string;
  level: TrackLevel;
  domain: TrackDomain;
  order: number;
  status: string; // active | locked | coming_soon
  tags: string[];
  estMinutes: number;
  challengeCount: number;
  popular: boolean;
  isNew: boolean;
}

export function toTrackView(t: DbTrackLike): Track {
  return {
    index: String(t.order).padStart(2, "0"),
    slug: t.slug,
    title: t.title,
    description: t.description,
    level: t.level,
    domain: t.domain,
    challenges: t.challengeCount,
    estHours: t.estMinutes ? Math.round((t.estMinutes / 60) * 10) / 10 : null,
    tags: t.tags,
    badge: t.popular ? "popular" : t.isNew ? "new" : null,
    status: t.status === "active" ? "active" : "locked",
  };
}
