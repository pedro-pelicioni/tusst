import type { JourneyConceptText } from "./types";
import { translatedConcepts } from "./es/index";

export const esJourneyText = {
  ...translatedConcepts,
  "the-capstone-forging": {
    title: "La Forja Final",
    tagline: "Especificación + pruebas + una IA a tu lado → un contrato desplegado.",
  },
} satisfies Record<string, JourneyConceptText>;
