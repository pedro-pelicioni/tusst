import type { JourneyConceptText } from "./types";
import { translatedConcepts } from "./tr/index";

export const trJourneyText = {
  ...translatedConcepts,
  "the-capstone-forging": {
    title: "Son Dövüş",
    tagline: "Spec + testler + yanında bir yapay zekâ → deploy edilmiş bir kontrat.",
  },
} satisfies Record<string, JourneyConceptText>;
