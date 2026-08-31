// The Builder's Journey — /journey map and the concept player chrome.
// Concept step content lives in src/content/journey (EN-first).
export const journey = {
  metaTitle: "Builder's Journey — TUSST",
  metaDescription:
    "The essential road: spec-driven craft, TDD, clean architecture and how Stellar really works — the engineering an AI won't learn for you.",
  kicker: "the essential road",
  title: "Builder's Journey",
  intro:
    "One road, in three parts. Level 0: what a ledger, a key and a contract actually are — no code, no acronyms. Part I: the engineering disciplines the AI era demands and will not hand you. Part II: the Stellar ecosystem end to end, from consensus to the privacy frontier. Short chapters, real depth — and every door into Rust stays optional.",
  mapHeading: "// chapters",
  levels: {
    legend: "Three tiers — start at level 0, where nothing is assumed.",
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
      title: "Part I — Engineering Craft",
      blurb: "Engineering in the AI era: specs, tests, bounded contexts, architecture — and how to drive a model without handing it the wheel.",
    },
    realm: {
      title: "Part II — The Stellar Ecosystem",
      blurb: "Stellar end to end: consensus, transactions, assets, anchors, contracts, smart wallets, privacy, and the living protocol.",
    },
  },
  recommended: "recommended next",
  startHere: "start here",
  chapter: {
    requires: "builds on {chapters}",
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "in preparation",
    completed: "completed",
    start: "Begin the chapter",
    revisit: "Revisit",
  },
  player: {
    exit: "Leave the chapter",
    branch: {
      kicker: "see it in rust",
      optional: "optional deep-dive",
      cta: "Open the Rust lesson",
      locked: "Unlocks with Campaign Act {numeral}",
    },
    lab: {
      kicker: "hands-on lab",
      completed: "lab completed ✓",
      cta: "Open the lab",
      soon: "this lab is still in preparation",
    },
    exercise: {
      kicker: "spec review",
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
      title: "Complete the chapter",
      body: "Mark this chapter complete and its XP is yours.",
      cta: "Mark complete (+{xp} xp)",
      saving: "saving…",
      signedOut:
        "Your progress lives in this browser only. Sign in to save chapters and earn XP.",
      signIn: "Sign in to save",
    },
    done: {
      kicker: "chapter complete",
      xpEarned: "+{xp} xp",
      levelUp: "Level {level} reached!",
      xpTotal: "{xp} xp total",
      already: "Already completed.",
      next: "Next chapter",
      backToMap: "Back to the Journey",
    },
  },
  testOut: {
    chapterCta: "I already know this",
    arcCta: "Test out of this section",
    chapterKicker: "chapter test-out",
    arcKicker: "section test-out",
    chapterTitle: "Skip {title}",
    arcTitle: "Skip {title}",
    chapterBlurb:
      "Answer {count} questions with nothing wrong and the chapter counts as complete, XP and all — no reading required.",
    arcBlurb:
      "Answer {count} questions ({allowed} slip allowed) and every chapter in this section counts as complete at once.",
    arcBlurbStrict:
      "Answer {count} questions with nothing wrong and every chapter in this section counts as complete at once.",
    question: "Question {current} of {total}",
    submit: "Check my answers",
    checking: "checking…",
    passKicker: "passed",
    passBody: "{correct}/{total}. Completed: {chapters}.",
    failKicker: "not this time",
    failBody:
      "{correct}/{total}. Nothing was marked complete — reading the chapter is the faster route from here.",
    readInstead: "Read the chapter instead",
    readArcInstead: "Start at the beginning",
    tryAgain: "Try a new set",
    backToMap: "Back to the Journey",
    signedOut: "Sign in first — a completed chapter has to land on an account.",
    signIn: "Sign in",
    unavailable: "That question set could not be loaded right now — try again in a moment.",
  },
};
