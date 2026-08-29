import type { LocaleContent } from "../types";
import { actText, cardText, skirmishText } from "./campaign";
import { lessonTitles, trackText } from "./catalog";
import { steps1 } from "./steps1";
import { steps2 } from "./steps2";
import { steps3 } from "./steps3";

export const pt: LocaleContent = {
  steps: { ...steps1, ...steps2, ...steps3 },
  actText,
  skirmishText,
  cardText,
  trackText,
  lessonTitles,
};
