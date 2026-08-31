import type { Locale } from "@/i18n/config";
import { journeyChapters } from "../index";
import type { Concept } from "../types";
import { ptJourneyText } from "./pt";
import { esJourneyText } from "./es";
import { frJourneyText } from "./fr";
import type { JourneyConceptText } from "./types";

const TEXT: Partial<Record<Locale, Record<string, JourneyConceptText>>> = {
  pt: ptJourneyText,
  es: esJourneyText,
  fr: frJourneyText,
};

function localizeConcept(
  concept: Concept,
  text: JourneyConceptText | undefined,
): Concept {
  if (!text) return concept;
  return {
    ...concept,
    meta: {
      ...concept.meta,
      title: text.title,
      tagline: text.tagline,
    },
    steps: text.steps ?? concept.steps,
    testOut: text.testOut ?? concept.testOut,
  };
}

export function getConceptLocalized(
  slug: string,
  locale: Locale,
): Concept | undefined {
  const concept = journeyChapters.find((item) => item.meta.slug === slug);
  return concept && localizeConcept(concept, TEXT[locale]?.[slug]);
}

export function getJourneyChaptersLocalized(locale: Locale): Concept[] {
  const text = TEXT[locale];
  return journeyChapters.map((concept) =>
    localizeConcept(concept, text?.[concept.meta.slug]),
  );
}
