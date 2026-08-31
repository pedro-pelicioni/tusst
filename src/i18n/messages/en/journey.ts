// The Builder's Journey — /journey map and the concept player chrome.
// Concept step content lives in src/content/journey (EN-first).
export const journey = {
  metaTitle: "Builder's Journey — TUSST",
  metaDescription:
    "The essential road: spec-driven craft, TDD, clean architecture and how Stellar really works — the engineering an AI won't learn for you.",
  kicker: "the essential road",
  title: "Builder's Journey",
  intro:
    "A ground floor and two arcs, one road. Level 0: what a ledger, a key and a contract actually are — no code, no acronyms. The Craft: the engineering disciplines the AI era demands and won't hand you. The Realm: the Stellar ecosystem end to end, from consensus to the privacy frontier. Short chapters, real depth — and every door into Rust stays optional.",
  mapHeading: "// chapters",
  levels: {
    legend: "The road climbs in three tiers — start at level 0, where nothing is assumed.",
    foundations: "level 0 · foundations",
    essential: "level 1 · essential",
    advanced: "level 2 · advanced",
  },
  arcs: {
    foundations: {
      title: "Level 0 — Foundations",
      blurb: "The ground floor: what a ledger is, what a key is, what a contract is. No code, no acronyms, nothing assumed. Three short chapters and the rest of the road stops being intimidating.",
    },
    craft: {
      title: "Arc I — The Craft",
      blurb: "Engineering in the AI era: specs, tests, borders, architecture — and how to command the golem.",
    },
    realm: {
      title: "Arc II — The Realm",
      blurb: "Stellar end to end: consensus, transactions, assets, anchors, contracts, smart wallets, privacy, and the living protocol.",
    },
  },
  recommended: "recommended next",
  startHere: "start here",
  chapter: {
    requires: "builds on {chapters}",
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "being forged",
    completed: "completed",
    start: "Begin the chapter",
    revisit: "Revisit",
  },
  player: {
    exit: "Leave the chapter",
    branch: {
      kicker: "see it in rust",
      optional: "optional deep-dive",
      cta: "Enter the skirmish",
      locked: "Unlocks with Campaign Act {numeral}",
    },
    lab: {
      kicker: "forge handoff",
      completed: "lab completed ✓",
      cta: "Open the lab",
      soon: "this lab is still being forged",
    },
    exercise: {
      kicker: "the examiner's trial",
      rubricLabel: "the rubric it will be graded against",
      placeholder: "Write your spec here — behavior, invariants, edges…",
      submit: "Submit to the examiner",
      checking: "the examiner reads…",
      passKicker: "spec accepted",
      failKicker: "the examiner objects",
      revise: "Revise & resubmit",
      notConfigured: "The examiner is not configured in this environment.",
      rateLimited: "The examiner has reached its current usage limit — try again later.",
      signedOut: "Your session expired — sign in again before submitting.",
      invalid: "The specification could not be submitted. Review it and try again.",
      unavailable: "The examiner is unreachable right now — try again in a moment.",
    },
    claim: {
      title: "Seal the chapter",
      body: "The road remembers what you've walked. Seal it, and the chapter's XP is yours.",
      cta: "Seal it (+{xp} xp)",
      saving: "sealing…",
      signedOut:
        "Your reading lives in this browser. Sign in to seal chapters and earn XP.",
      signIn: "Sign in to seal",
    },
    done: {
      kicker: "chapter complete",
      xpEarned: "+{xp} xp",
      levelUp: "Level {level} reached!",
      xpTotal: "{xp} xp total",
      already: "Already sealed — the road remembers.",
      next: "Next chapter",
      backToMap: "Back to the Journey",
    },
  },
  testOut: {
    chapterCta: "I already know this",
    arcCta: "Test out of this stretch",
    chapterKicker: "the shortcut key",
    arcKicker: "the master seal",
    chapterTitle: "Skip {title}",
    arcTitle: "Skip {title}",
    chapterBlurb:
      "Answer {count} questions with nothing wrong and the chapter is sealed, XP and all — no reading required.",
    arcBlurb:
      "Answer {count} questions ({allowed} slip allowed) and every chapter in this stretch is sealed at once.",
    arcBlurbStrict:
      "Answer {count} questions with nothing wrong and every chapter in this stretch is sealed at once.",
    question: "Question {current} of {total}",
    submit: "Mark my paper",
    checking: "marking…",
    passKicker: "the door opens",
    passBody: "{correct}/{total}. Sealed: {chapters}.",
    failKicker: "not this time",
    failBody:
      "{correct}/{total}. Nothing was sealed — the chapter is the faster road from here.",
    readInstead: "Read the chapter instead",
    readArcInstead: "Start at the beginning",
    tryAgain: "Draw a new paper",
    backToMap: "Back to the Journey",
    signedOut: "Sign in first — a sealed chapter has to land on an account.",
    signIn: "Sign in",
    unavailable: "That paper could not be drawn right now — try again in a moment.",
  },
};
