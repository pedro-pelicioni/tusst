import type { Locale } from "@/i18n/config";
import type { LessonStep } from "@/content/steps";
import { ptAdvancedSteps } from "./pt";
import { esAdvancedSteps } from "./es";
import { frAdvancedSteps } from "./fr";
import { trAdvancedSteps } from "./tr";
import { ptAdvancedInstructions } from "./pt/instructions";
import { esAdvancedInstructions } from "./es/instructions";
import { frAdvancedInstructions } from "./fr/instructions";
import { trAdvancedInstructions } from "./tr/instructions";
import { ptAdvancedLessonText, ptAdvancedTrackText } from "./pt/curriculum";
import { esAdvancedLessonText, esAdvancedTrackText } from "./es/curriculum";
import { frAdvancedLessonText, frAdvancedTrackText } from "./fr/curriculum";
import { trAdvancedLessonText, trAdvancedTrackText } from "./tr/curriculum";
import type { AdvancedTrackText } from "./types";

// Locale resolution for the Advanced Path.
//
// CLIENT-SAFE (mirrors src/content/i18n/index.ts): steps and instructions
// are both learner-facing. Grading data never passes through here.
//
// Every map is PARTIAL and every lookup falls back to English, so a lesson
// can be authored in EN and translated in a later commit without breaking a
// single page. Coverage (all 87 lessons × pt/es/fr/tr) is enforced by
// `check:advanced`, not by the types.

const ADVANCED_STEPS: Partial<Record<Locale, Record<string, LessonStep[]>>> = {
  pt: ptAdvancedSteps,
  es: esAdvancedSteps,
  fr: frAdvancedSteps,
  tr: trAdvancedSteps,
};

const ADVANCED_INSTRUCTIONS: Partial<
  Record<Locale, Record<string, { instructions: string }>>
> = {
  pt: ptAdvancedInstructions,
  es: esAdvancedInstructions,
  fr: frAdvancedInstructions,
  tr: trAdvancedInstructions,
};

export function getAdvancedStepsLocalized(
  slug: string,
  locale: Locale,
): LessonStep[] | undefined {
  return ADVANCED_STEPS[locale]?.[slug];
}

export function getAdvancedInstructionsLocalized(
  slug: string,
  locale: Locale,
): string | undefined {
  return ADVANCED_INSTRUCTIONS[locale]?.[slug]?.instructions;
}

const ADVANCED_TRACK_TEXT: Partial<
  Record<Locale, Record<string, AdvancedTrackText>>
> = {
  pt: ptAdvancedTrackText,
  es: esAdvancedTrackText,
  fr: frAdvancedTrackText,
  tr: trAdvancedTrackText,
};

const ADVANCED_LESSON_TEXT: Partial<
  Record<Locale, Record<string, { title: string; summary: string }>>
> = {
  pt: ptAdvancedLessonText,
  es: esAdvancedLessonText,
  fr: frAdvancedLessonText,
  tr: trAdvancedLessonText,
};

/** Track name/description/serves/syllabus, English when untranslated. */
export function localizeAdvancedTrack<
  T extends { slug: string; title: string; description: string; serves: string; syllabus?: string[] },
>(track: T, locale: Locale): T {
  const t = ADVANCED_TRACK_TEXT[locale]?.[track.slug];
  if (!t) return track;
  return {
    ...track,
    title: t.title,
    description: t.description,
    serves: t.serves,
    syllabus: t.syllabus ?? track.syllabus,
  };
}

/** Lesson name/summary, English when untranslated. */
export function localizeAdvancedLesson(
  slug: string,
  base: { title: string; summary: string },
  locale: Locale,
): { title: string; summary: string } {
  return ADVANCED_LESSON_TEXT[locale]?.[slug] ?? base;
}
