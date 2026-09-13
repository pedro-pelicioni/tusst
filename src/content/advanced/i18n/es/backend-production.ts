import type { LessonStep } from "@/content/steps";

// ES · Running It in Production.
//
// Overlay for ../../steps/backend-production.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendProductionStepsEs: Record<string, LessonStep[]> = {};
