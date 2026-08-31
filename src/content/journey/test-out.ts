import { hashString, seededOrder } from "@/lib/seeded-order";
import { chaptersByArc } from "./index";
import type { Concept, ConceptArc, TestOutQuestion } from "./types";

// The "I already know this" challenge — Duolingo's test-out, adapted.
//
// The Journey is free-roam, so this never UNLOCKS anything: it hands out the
// credit (JourneyProgress + XP) a reader would have earned by walking the
// chapter, so the map's ✓ and its "recommended next" move on.
//
// Two rules shape the whole module:
//   1. `answer` never leaves the server. A paper is built by shipping options
//      already permuted; the client posts back DISPLAY positions and this
//      module maps them home. Nothing in the page source says which is right.
//   2. A paper is derived from a nonce, so two attempts at the same chapter
//      draw a different subset in a different order. That is a speed bump,
//      not a lock — grading is only as trustworthy as the rest of the
//      Journey, which is to say client-sealed. It exists to make the skip
//      mean something to an honest reader, not to defeat a determined one.

/** How many questions a single chapter's paper asks. */
export const CHAPTER_PAPER_LEN = 3;
/** How many each live chapter contributes to its arc's paper, and the cap. */
export const ARC_PAPER_PER_CHAPTER = 1;
export const ARC_PAPER_MAX = 12;

export type TestOutScope = "chapter" | "arc";

/** One question as the browser gets it: no answer, options already permuted. */
export interface PaperQuestion {
  question: string;
  options: string[];
}

export interface Paper {
  nonce: string;
  questions: PaperQuestion[];
  /** wrong answers still allowed — 0 for a chapter, 1 for a long arc paper */
  allowedWrong: number;
}

/** A question plus where it came from, so a passed arc paper knows what to seal. */
interface SourcedQuestion {
  slug: string;
  q: TestOutQuestion;
}

function liveWithBank(chapters: Concept[]): Concept[] {
  return chapters.filter(
    (c) => c.meta.status === "live" && (c.testOut?.length ?? 0) > 0,
  );
}

/**
 * Every live chapter in the arc must carry a bank. A partial arc paper would
 * hand out completions for chapters it never asked about.
 */
export function arcIsTestable(arc: ConceptArc, chapters?: Concept[]): boolean {
  const inArc = (chapters ?? chaptersByArc(arc)).filter(
    (c) => c.meta.arc === arc && c.meta.status === "live",
  );
  return inArc.length > 0 && inArc.every((c) => (c.testOut?.length ?? 0) > 0);
}

export function chapterIsTestable(concept: Concept | undefined): boolean {
  return !!concept && concept.meta.status === "live" && (concept.testOut?.length ?? 0) > 0;
}

/** Deterministic draw of `take` items, seeded — the paper's subset. */
function draw<T>(items: T[], take: number, seed: number): T[] {
  return seededOrder(items.length, seed)
    .slice(0, Math.min(take, items.length))
    .map((i) => items[i]);
}

function sourcedFor(
  scope: TestOutScope,
  target: string,
  chapters: Concept[],
  nonce: string,
): SourcedQuestion[] {
  if (scope === "chapter") {
    const concept = chapters.find((c) => c.meta.slug === target);
    if (!chapterIsTestable(concept)) return [];
    return draw(
      concept!.testOut!.map((q) => ({ slug: target, q })),
      CHAPTER_PAPER_LEN,
      hashString(`${nonce}:${target}`),
    );
  }
  const inArc = liveWithBank(chapters.filter((c) => c.meta.arc === target));
  if (!arcIsTestable(target as ConceptArc, chapters)) return [];
  const picked = inArc.flatMap((c) =>
    draw(
      c.testOut!.map((q) => ({ slug: c.meta.slug, q })),
      ARC_PAPER_PER_CHAPTER,
      hashString(`${nonce}:${c.meta.slug}`),
    ),
  );
  return draw(picked, ARC_PAPER_MAX, hashString(`${nonce}:${target}:order`));
}

function optionOrderFor(nonce: string, question: string, length: number) {
  return seededOrder(length, hashString(`${nonce}::${question}`));
}

function allowedWrongFor(scope: TestOutScope, length: number): number {
  // A three-question chapter paper has to be perfect. A long arc paper
  // forgives one — it is the harder ask, and a single slip should not send
  // someone back through sixteen chapters.
  return scope === "arc" && length >= 6 ? 1 : 0;
}

/** Build the paper the browser will render. Answers stay here. */
export function buildPaper(
  scope: TestOutScope,
  target: string,
  chapters: Concept[],
  nonce: string,
): Paper | null {
  const sourced = sourcedFor(scope, target, chapters, nonce);
  if (sourced.length === 0) return null;
  return {
    nonce,
    allowedWrong: allowedWrongFor(scope, sourced.length),
    questions: sourced.map(({ q }) => ({
      question: q.question,
      options: optionOrderFor(nonce, q.question, q.options.length).map(
        (i) => q.options[i],
      ),
    })),
  };
}

export interface Verdict {
  passed: boolean;
  correct: number;
  total: number;
  /** chapters to seal on a pass — the one chapter, or every live one in the arc */
  seals: string[];
}

/**
 * Re-derive the same paper from the nonce and mark it. `picks[i]` is the
 * DISPLAY position the reader chose for question i, or -1 for unanswered.
 */
export function gradePaper(
  scope: TestOutScope,
  target: string,
  chapters: Concept[],
  nonce: string,
  picks: number[],
): Verdict | null {
  const sourced = sourcedFor(scope, target, chapters, nonce);
  if (sourced.length === 0) return null;

  let correct = 0;
  sourced.forEach(({ q }, i) => {
    const order = optionOrderFor(nonce, q.question, q.options.length);
    const pick = picks[i];
    if (pick >= 0 && pick < order.length && order[pick] === q.answer) correct++;
  });

  const total = sourced.length;
  const passed = total - correct <= allowedWrongFor(scope, total);
  const seals = !passed
    ? []
    : scope === "chapter"
      ? [target]
      : chapters
          .filter((c) => c.meta.arc === target && c.meta.status === "live")
          .map((c) => c.meta.slug);
  return { passed, correct, total, seals };
}
