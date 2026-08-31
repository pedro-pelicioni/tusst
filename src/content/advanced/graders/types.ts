import "server-only";

import type { LessonContent } from "@/content/lessons";

// Server-only grading data for the Advanced Path.
//
// Identical to the campaign's `LessonContent` in every way the runner cares
// about, plus one field the campaign has never had: `referenceSolution`.
//
// WHY A REFERENCE SOLUTION IS MANDATORY HERE
// ------------------------------------------
// A sandbox lesson is a triple promise: the AST checks pass, the program
// compiles under `-D warnings`, and stdout equals `expectedOutput` byte for
// byte. Authoring all three by eye is how you ship a lesson that cannot be
// completed — the student sees a red X on correct code and has no way to
// tell whether they or the lesson is wrong. Nothing erodes trust faster.
//
// So every advanced lesson carries a solution that `npm run check:advanced`
// actually compiles with the runner's exact rustc flags and runs, diffing
// real stdout against the promise. A lesson that cannot be solved fails the
// check before it reaches a reader.
//
// It never ships to the client: this module is `server-only`, and the page
// passes `instructions` / `starterCode` down as props — nothing else.
export type AdvancedLessonContent = LessonContent & {
  /**
   * A complete, correct solution. MUST compile under the runner's flags and
   * print exactly `expectedOutput`. Verified by scripts/check-advanced.ts.
   */
  referenceSolution: string;
};
