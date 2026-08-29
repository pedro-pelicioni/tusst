import type { JourneyConceptText } from "./types";
import { translatedConcepts } from "./fr/index";

export const frJourneyText = {
  ...translatedConcepts,
  "the-capstone-forging": {
    title: "La Forge Finale",
    tagline: "Spécification + tests + une IA à tes côtés → un contrat déployé.",
  },
} satisfies Record<string, JourneyConceptText>;
