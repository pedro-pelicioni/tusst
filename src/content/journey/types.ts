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
  | { kind: "widget"; component: "scp-sim"; body?: string }
  | { kind: "labLink"; labSlug: string; body: string }
  | { kind: "rustBranch"; lessonSlug: string; body: string };

export interface ConceptMeta {
  slug: string;
  /** EN-first; locale overlays arrive with the content i18n phase */
  title: string;
  tagline: string;
  /** roman numeral shown on the map rail */
  numeral: string;
  status: "live" | "soon";
  estMinutes: number;
  /** public/ path for the chapter sigil art; glyph is the stand-in */
  sigil: string;
  glyph: string;
}

export interface Concept {
  meta: ConceptMeta;
  steps: JourneyStep[];
}
