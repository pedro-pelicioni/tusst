// The Builder's Journey — /journey map and the concept player chrome.
// Concept step content lives in src/content/journey (EN-first).
export const journey = {
  metaTitle: "Builder's Journey — TUSST",
  metaDescription:
    "The essential road: spec-driven craft, TDD, clean architecture and how Stellar really works — the engineering an AI won't learn for you.",
  kicker: "the essential road",
  title: "Builder's Journey",
  intro:
    "Two arcs, one road. The Craft: the engineering disciplines the AI era demands and won't hand you. The Realm: the Stellar ecosystem end to end, from consensus to the privacy frontier. Short chapters, real depth — and every door into Rust stays optional.",
  mapHeading: "// chapters",
  arcs: {
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
  chapter: {
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
};
