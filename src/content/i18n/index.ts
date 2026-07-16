// Locale-aware resolvers over the English content in src/content/*.
// CLIENT-SAFE (mirrors steps.ts/campaign.ts): no grading data here.
// Every resolver falls back to English when a translation is missing, so
// partially translated locales degrade gracefully instead of breaking.

import type { Locale } from "@/i18n/config";
import {
  acts,
  cards,
  type Act,
  type ChampionCard,
  type Skirmish,
} from "@/content/campaign";
import { getLessonSteps, type LessonStep } from "@/content/steps";
import { es } from "./es";
import { fr } from "./fr";
import { pt } from "./pt";
import type { LocaleContent, TrackText } from "./types";

const CONTENT: Partial<Record<Locale, LocaleContent>> = { pt, es, fr };

export function getLessonStepsLocalized(
  slug: string,
  locale: Locale,
): LessonStep[] | undefined {
  return CONTENT[locale]?.steps[slug] ?? getLessonSteps(slug);
}

function localizeAct(act: Act, content: LocaleContent | undefined): Act {
  if (!content) return act;
  const t = content.actText[act.trackSlug];
  return {
    ...act,
    ...(t
      ? {
          title: t.title,
          territory: t.territory,
          synopsis: t.synopsis,
          overlord: t.overlord === undefined ? act.overlord : t.overlord,
        }
      : {}),
    skirmishes: act.skirmishes.map((s) => {
      const st = content.skirmishText[s.lessonSlug];
      return st ? { ...s, title: st.title, intro: st.intro } : s;
    }),
  };
}

export function getActsLocalized(locale: Locale): Act[] {
  const content = CONTENT[locale];
  if (!content) return acts;
  return acts.map((a) => localizeAct(a, content));
}

export function getActLocalized(
  trackSlug: string,
  locale: Locale,
): Act | undefined {
  const act = acts.find((a) => a.trackSlug === trackSlug);
  return act && localizeAct(act, CONTENT[locale]);
}

export function getSkirmishLocalized(
  lessonSlug: string,
  locale: Locale,
): (Skirmish & { act: Act }) | undefined {
  for (const act of getActsLocalized(locale)) {
    const skirmish = act.skirmishes.find((s) => s.lessonSlug === lessonSlug);
    if (skirmish) return { ...skirmish, act };
  }
  return undefined;
}

function localizeCard(
  card: ChampionCard,
  content: LocaleContent | undefined,
): ChampionCard {
  const t = content?.cardText[card.id];
  if (!t) return card;
  return {
    ...card,
    flavor: t.flavor,
    epithet: t.epithet === undefined ? card.epithet : t.epithet,
    type: t.type ?? card.type,
  };
}

export function getCardsLocalized(locale: Locale): ChampionCard[] {
  const content = CONTENT[locale];
  if (!content) return cards;
  return cards.map((c) => localizeCard(c, content));
}

export function getCardLocalized(
  id: string,
  locale: Locale,
): ChampionCard | undefined {
  const card = cards.find((c) => c.id === id);
  return card && localizeCard(card, CONTENT[locale]);
}

export function getCardForTrackLocalized(
  trackSlug: string,
  locale: Locale,
): ChampionCard | undefined {
  const card = cards.find((c) => c.awardedByTrack === trackSlug);
  return card && localizeCard(card, CONTENT[locale]);
}

/** Localize a track's title/description (base values come from the DB). */
export function localizeTrackText(
  slug: string,
  base: TrackText,
  locale: Locale,
): TrackText {
  return CONTENT[locale]?.trackText[slug] ?? base;
}

/** Localize a lesson title (base value comes from the DB). */
export function localizeLessonTitle(
  slug: string,
  base: string,
  locale: Locale,
): string {
  return CONTENT[locale]?.lessonTitles[slug] ?? base;
}
