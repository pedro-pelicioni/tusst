// Landing page (illustrated scenes).
// Brand strings (TUSST, the tagline, the motto and champion names) stay
// in English across locales on purpose.
export const landing = {
  metaDescription:
    "Hands-on, gamified coding challenges. Master Rust first, then ship real Soroban smart contracts on Stellar. No setup — just code.",
  metaImageAlt: "TUSST — a pixel adventure to master Rust and Stellar",
  nav: {
    why: "Why",
    map: "The Map",
    champions: "Champions",
    forge: "The Forge",
    enterRealm: "Sign in",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },
  hero: {
    kicker: "a pixel adventure to master Rust and Stellar",
    subtitle: "The Ultimate Stellar Supreme Tutorial",
    tagline:
      "Master Rust, then forge Soroban contracts on Stellar — eight acts, eight champions, one many-eyed horror.",
    ctaPrimary: "Begin the journey",
    ctaContinue: "Continue the journey",
    ctaEnter: "I already have an account · sign in",
    ctaSecondary: "Open the Forge",
    ctaSecondaryBadge: "no login",
    freeLine: "free · no setup · in-browser",
    scrollHint: "descend",
  },
  // Why learn it the old way — the answer to "why bother, with AI writing the code?".
  // Tells the truth about the phenomenon, never about a case: no program, team or
  // network is named, and Stellar only appears as the reason fundamentals matter.
  why: {
    eyebrow: "AI can code. Why learn the basics?",
    titleTop: "AI writes the code.",
    titleBottom: "You sign for it.",
    lead: "Because AI writes code, not accountability. You can't catch a bug in review if you don't know it can exist — and in the AI era, review is the job. When a real payment fails, nobody accepts \"the prompt did it\": the question lands on you.",
    truthKicker: "What working code hides",
    truth: "On every chain, people are shipping to mainnet, raising capital and holding other people's money without knowing the basics of what they built. Close the AI tab, ask why it works, and it goes quiet.",
    truthNote: "Blame the shortcut, not the people. Working code feels like understanding, especially to whoever shipped it. Nothing flags what you skipped, until real money is at stake and someone asks why. Nobody asks the model.",
    quizKicker: "Your turn. The AI tab stays closed.",
    quizNewcomer: "Blank on all three? That's a starting line, not a verdict. Every answer is a free chapter on a trail that starts at zero.",
    reveal: "Reveal the answer",
    taughtIn: "Taught in",
    questions: [
      {
        topic: "Trustlines",
        q: "Your app sends USDC to a user's just-created account. It fails. What's missing?",
        a: "A trustline: the account's on-ledger opt-in to hold one asset from one issuer. The account itself signs a change_trust, which locks one base reserve (0.5 XLM). Without a trustline, a classic payment fails with op_no_trust: that account never agreed to hold USDC.",
        chapterSlug: "accounts-trust-and-assets",
      },
      {
        topic: "Transaction lifecycle",
        q: "Your app tells the user: \"Failed, so nothing was charged.\" Is that true?",
        a: "Not always. Rejected at the door (bad signature, bad sequence, fee too low): nothing charged. But included in a ledger with a failed operation? Effects are reverted, yet the fee is charged and the sequence number spent. That envelope is dead: rebuild, re-sign.",
        chapterSlug: "the-fate-of-an-envelope",
      },
      {
        topic: "State archival",
        q: "Your contract stores user balances, and their TTL runs out. Where's the money?",
        a: "Depends on the storage you chose. Persistent and instance entries are archived, not lost: they come back intact for a fee. Temporary entries are deleted, with no restore at any price. Keep balances there and the record of who owns what is gone for good.",
        chapterSlug: "the-heartbeat-and-the-bill",
      },
    ],
    multiplier: "AI multiplies what you know. A thousand times zero is still zero.",
    closing: "TUSST uses AI too: a mentor for hints, an examiner for your specs. The tool was never the enemy; signing what you don't understand is. Stellar moves real money: payments, remittances, stablecoins. TUSST forges Stellar's next generation: builders who answer for every line.",
    cta: "Learn what you sign",
  },
  carousel: {
    kicker: "The Cast",
    heading: "Choose Your Hero",
    body: "Seven champions walk the island — one of them is you. Every mission you clear earns XP, and each level grows your hero through eight forms, from apprentice to legend. Cosmetic only: your pick gates nothing.",
    formsLabel: "8 forms · they grow as you level up",
    cta: "Choose your hero",
    previous: "Previous",
    next: "Next",
  },
  map: {
    eyebrow: "The world map",
    titleTop: "Three islands.",
    titleBottom: "Start with the first.",
    body: "The Builder's Journey is the way in: the fundamentals, how Stellar really works, and the craft AI can't do for you — every mission open from day one. The Rusted Isle and the Harbor are there when you want to go deeper.",
    cta: "Open the map",
    tagStart: "Start here",
    tagOptional: "Optional",
    tagDeep: "Go deeper",
    mapAlt: "The TUSST world map: the Isle of the Builder, the Rusted Isle, the Harbor and the Forge islet",
  },
  features: {
    forge: {
      eyebrow: "no login · no setup",
      titleTop: "The Forge",
      titleBottom: "Is Open",
      body: "A full Soroban smithy in your browser: write, compile, test and deploy real contracts to the testnet — with Raven, the AI mentor, croaking hints whenever a run fails.",
      cta: "Open the Forge",
      ctaBadge: "no login",
    },
  },
  cta: {
    titleTop: "The island is waiting.",
    titleBottom: "So is your first mission.",
    body: "Free, in the browser, no setup. The first mission takes about ten minutes — and it starts at zero.",
    button: "Begin the journey",
    altPrefix: "Or skip straight to the anvil —",
    altLink: "open the Forge",
    altSuffix: ", no login required.",
  },
  footer: {
    tagline: "the ultimate stellar supreme tutorial",
    motto: "nothing left unhandled",
    privacy: "privacy",
  },
  a11y: {
    carouselLabel: "Playable heroes",
    prevCard: "Previous hero",
    nextCard: "Next hero",
    goToCard: "Go to {name}",
    cardStatus: "{name} — hero {index} of {total}",
    formsList: "{name}'s eight forms",
  },
};
