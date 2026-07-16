import "server-only";

// Locale-aware resolver for the SERVER-ONLY lesson content. Only the
// learner-facing `instructions` markdown is localized — starter code,
// expected output and the hidden grading checks are locale-neutral and
// always come from the English source of truth.

import type { Locale } from "@/i18n/config";
import { getLessonContent, type LessonContent } from "@/content/lessons";
import { lessonText as es } from "./es/lessons";
import { lessonText as fr } from "./fr/lessons";
import { lessonText as pt } from "./pt/lessons";

const LESSON_TEXT: Partial<
  Record<Locale, Record<string, { instructions: string }>>
> = { pt, es, fr };

export function getLessonContentLocalized(
  slug: string,
  locale: Locale,
): LessonContent | undefined {
  const base = getLessonContent(slug);
  if (!base) return undefined;
  const t = LESSON_TEXT[locale]?.[slug];
  return t ? { ...base, instructions: t.instructions } : base;
}
