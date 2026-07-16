import type { LocaleContent } from "../types";
import { actText, cardText, skirmishText } from "./campaign";
import { lessonTitles, trackText } from "./catalog";
import { steps1 } from "./steps1";
import { steps2 } from "./steps2";

export const es: LocaleContent = {
  steps: { ...steps1, ...steps2 },
  actText,
  skirmishText,
  cardText,
  trackText,
  lessonTitles,
};
