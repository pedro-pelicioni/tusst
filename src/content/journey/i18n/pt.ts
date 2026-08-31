import type { JourneyConceptText } from "./types";
import { translatedConcepts } from "./pt/index";

export const ptJourneyText = {
  "the-capstone-forging": {
    title: "A Forja Final",
    tagline: "Spec + testes + uma IA ao seu lado → um contrato publicado.",
  },
  ...translatedConcepts,
} satisfies Record<string, JourneyConceptText>;
