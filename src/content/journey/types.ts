import type { DiagramView, WidgetComponent } from "@/content/visuals/types";

// Builder's Journey content model. Concepts are pure DATA (no functions),
// so server pages can localize/enrich and pass steps straight to the client
// player as props. Step kinds `theory | quiz | fill` mirror the campaign's
// steps.ts shapes on purpose (authoring muscle memory); the new kinds are
// what make the journey a journey: interactive widgets, cinematic handoffs
// into Forge labs, and the optional "See it in Rust" branch into the
// campaign.

export type JourneyStep =
  | { kind: "theory"; body: string; image?: string }
  | {
      kind: "quiz";
      question: string;
      /** correct answer first — the player shuffles with a seeded order */
      options: string[];
      answer: number;
      explain?: string;
    }
  | {
      kind: "fill";
      prompt: string;
      file: string;
      before: string;
      after: string;
      choices: string[];
      answer: number;
      explain?: string;
    }
  | { kind: "widget"; component: WidgetComponent; body?: string }
  /**
   * A declarative picture. Labels live in `view`, so the existing locale
   * overlay translates them and check-i18n guards the structure around them.
   */
  | { kind: "diagram"; view: DiagramView; body?: string; caption?: string }
  | { kind: "labLink"; labSlug: string; body: string }
  | { kind: "rustBranch"; lessonSlug: string; body: string }
  | {
      kind: "exercise";
      mode: "spec-write";
      /** the assignment, shown to the student (markdown) */
      brief: string;
      /** grading criteria — shown to the student AND given to the examiner */
      rubric: string;
      minChars?: number;
    };

export type ConceptArc = "foundations" | "craft" | "realm";

export type ConceptLevel = 0 | 1 | 2;

export interface ConceptMeta {
  slug: string;
  /** EN-first; locale overlays arrive with the content i18n phase */
  title: string;
  tagline: string;
  /** roman numeral shown on the map rail */
  numeral: string;
  /**
   * The road's three stretches: foundations = the ground floor, where a
   * newcomer starts and nothing is assumed; craft = being a formidable dev
   * in the AI era; realm = Stellar, end to end. Rendered as a badge on the
   * map card.
   */
  arc: ConceptArc;
  /**
   * Difficulty tier, and the reason the map reads as a trail: 0 assumes
   * nothing at all (no code, no acronyms), 1 is the essential road, 2 is the
   * deep end. Chapters are grouped by it so "where do I start?" answers
   * itself.
   */
  level: ConceptLevel;
  /**
   * Chapters whose ideas this one leans on, by slug — the trail's edges.
   * ADVISORY: the map draws them, nothing enforces them. Progression stays
   * free-roam, so a curious builder can always jump ahead.
   */
  requires?: string[];
  status: "live" | "soon";
  estMinutes: number;
  /** public/ path for the chapter sigil art; glyph is the stand-in */
  sigil: string;
  glyph: string;
}

/**
 * One test-out question. Deliberately NOT a `JourneyStep`: these never render
 * inside the player, and their `answer` must never reach the browser — the
 * API ships `question` + pre-shuffled `options` only, and grades on the
 * server. Correct answer first, same authoring convention as `quiz`.
 */
export interface TestOutQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface Concept {
  meta: ConceptMeta;
  steps: JourneyStep[];
  /**
   * The "I already know this" bank. Dedicated questions, not a replay of the
   * chapter's own checks — a reader who fails must still meet fresh material
   * when they walk the chapter. OPTIONAL: a chapter without a bank simply
   * offers no skip, and an arc is only skippable once every live chapter in
   * it has one.
   */
  testOut?: TestOutQuestion[];
}
