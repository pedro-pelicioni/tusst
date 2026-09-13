import type { AdvancedTrackText } from "../types";

// FR · Advanced Path curriculum metadata — track and lesson names as shown on
// /advanced and /advanced/[slug].
//
// CLIENT-SAFE. Keyed by the same slugs as the English source in
// ../../curriculum.ts, and PARTIAL: a missing key falls back to English.
//
// Rust terms are not translated — ownership, borrow, trait, lifetime,
// closure. Translating them pulls the reader away from the real compiler
// error, which is where they will meet the word again.

export const frAdvancedTrackText: Record<string, AdvancedTrackText> = {};

export const frAdvancedLessonText: Record<
  string,
  { title: string; summary: string }
> = {};
