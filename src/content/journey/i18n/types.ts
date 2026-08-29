import type { Concept, JourneyStep } from "../types";

export type { Concept } from "../types";

// Text-only overlays for Journey chapters. A missing chapter or `steps`
// entry deliberately falls back to the English source of truth.
export interface JourneyConceptText {
  title: string;
  tagline: string;
  steps?: JourneyStep[];
}

export function conceptTextFromConcept(concept: Concept): JourneyConceptText {
  return {
    title: concept.meta.title,
    tagline: concept.meta.tagline,
    steps: concept.steps,
  };
}
