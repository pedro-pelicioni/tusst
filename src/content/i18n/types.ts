// Shapes for localized content overlays. Everything is keyed by the same
// slugs/ids as the English source in src/content/*, and every map is
// PARTIAL: a missing key falls back to English at resolution time.

import type { LessonStep } from "@/content/steps";

export interface ActText {
  title: string;
  territory: string;
  /** Omit to keep the English overlord name (proper nouns usually stay). */
  overlord?: string | null;
  synopsis: string;
}

export interface SkirmishText {
  title: string;
  intro: string;
}

export interface CardText {
  /** Card NAMES are proper nouns and never translated — only these fields. */
  epithet?: string | null;
  type?: string;
  flavor: string;
}

export interface TrackText {
  title: string;
  description: string;
}

export interface LocaleContent {
  /** Full per-lesson step replacements, keyed by lesson slug. */
  steps: Record<string, LessonStep[]>;
  /** Keyed by track slug. */
  actText: Record<string, ActText>;
  /** Keyed by lesson slug. */
  skirmishText: Record<string, SkirmishText>;
  /** Keyed by card id. */
  cardText: Record<string, CardText>;
  /** Keyed by track slug (overrides DB/seed titles at render time). */
  trackText: Record<string, TrackText>;
  /** Keyed by lesson slug (overrides DB/seed titles at render time). */
  lessonTitles: Record<string, string>;
}
