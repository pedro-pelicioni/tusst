import type { Concept } from "../types";

// Craft V — the dependency rule alone: which way every arrow is allowed to
// point, and the mechanical test for whether a wall has been breached. Ports,
// adapters and the payoff are Craft VI, because "the law" and "the mechanism
// that lets you obey it" are two lessons, and the first one is the one people
// think they already know.

export const theCleanKeep: Concept = {
  meta: {
    slug: "the-clean-keep",
    title: "The Clean Keep",
    tagline: "One law: source-code dependencies point inward, only.",
    numeral: "V",
    arc: "craft",
    level: 2,
    requires: ["what-the-border-holds"],
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/the-clean-keep.webp",
    glyph: "🏰",
  },
  steps: [
    {
      kind: "theory",
      body: `## The keep and its walls

Architecture is one decision made many times: **what is allowed to depend on what.**

Picture a keep. In the **inner ring** live your *entities* and *use-cases* — the rules that make your dApp yours: who may release funds, when a refund is owed. In the **outer ring** lives the changing world: the UI, the database, the chain SDK, the wallet.

The **dependency rule** is the keep's one law: *source-code dependencies point inward, only.* The outer ring may name the inner. The inner ring never — *never* — names the outer.`,
    },
    {
      kind: "theory",
      body: `## Why inward?

Because the two rings age differently. Frameworks churn: SDK majors land, UI libraries rise and fall, databases get swapped. **Business rules outlive all of it** — "both parties must approve" will still be true in whatever framework hosts it five years from now.

If your domain imports the chain SDK, every SDK breaking change becomes a *domain* migration — your slowest-changing code held hostage by your fastest-changing dependency. Point the arrows inward and churn stays in the outer ring, where it's cheap.

The keep is the point. Frameworks are furniture.`,
    },
    {
      kind: "diagram",
      body: "The keep, from the outside in:",
      caption: "Every arrow points inward. The domain never learns the name of a database.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "infra",
            label: "infrastructure",
            note: "Postgres, Horizon, the filesystem, the clock. Replaceable by definition.",
            tone: "neutral",
          },
          {
            id: "adapters",
            label: "adapters",
            note: "Translate the outside world into the shapes the inside already speaks.",
            tone: "teal",
          },
          {
            id: "app",
            label: "application",
            note: "Use cases: the sequence of domain moves that answers one request.",
            tone: "accent",
          },
          {
            id: "domain",
            label: "domain",
            note: "The rules that would still be true on paper. It imports nothing.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "dependency-rule",
      body: `The law has a shape, and prose cannot draw it. **Switch imports on** and watch where the legal ones land — then breach a wall on purpose and read what it costs you.`,
    },
    {
      kind: "theory",
      body: `## Every breach was reasonable

No one breaks the rule out of malice. They break it on a Tuesday, for a good reason, under a deadline.

The escrow use-case needs the current ledger sequence to decide whether the deadline has passed. The number is one \`server.ledgers()\` call away. Writing a port for it means an interface, an adapter, a fake for the tests — twenty minutes for a number that is *right there*. So the SDK gets imported into the domain, with a comment promising to clean it up.

Eight months on, that one import has done three things. The domain no longer builds without a network client. The use-case tests need a running node, so they got slow, so they got skipped. And the SDK's major version is out, which now means a **domain** migration.

The twenty minutes were real. So was the interest.

The rule earns its keep precisely on the days it feels like bureaucracy — because the day it feels necessary is the day the cost has already been paid.`,
    },
    {
      kind: "quiz",
      question: `Three imports from a Stellar dApp. Which one **breaks the dependency rule**?`,
      options: [
        "domain/escrow.ts imports @stellar/stellar-sdk to build a transaction",
        "adapters/horizon.ts imports the PaymentsPort interface from the domain, in order to implement it",
        "ui/ReleaseButton.tsx imports the release use-case from the domain, in order to call it",
      ],
      answer: 0,
      explain: `The other two are the outer ring naming the inner — the rule working exactly as designed. The domain importing the SDK is the inner naming the outer: now the keep's deepest rooms shake every time a vendor ships a major version.`,
    },
    {
      kind: "quiz",
      question: `Where's the smell?`,
      options: [
        "A React component that itself decides whether escrow funds may be released, then renders the button",
        "A use-case that depends on a PaymentsPort interface and orchestrates the release",
        "An adapter that translates Horizon error codes into the domain's own error types",
      ],
      answer: 0,
      explain: `A business rule living in the UI is invisible to your core tests and gets duplicated by the next screen that needs it. Its mirror twin is SQL inside the domain — the inner ring reaching outward. Rules to the core, translation to the edge.`,
    },
    {
      kind: "fill",
      prompt: `The test is mechanical — open a domain file and read its imports:`,
      file: "domain/release-escrow.ts",
      before: `A framework or vendor name in that import list means `,
      after: ` .`,
      choices: [
        "a wall has been breached",
        "the file needs a comment explaining why",
        "the import should be loaded lazily",
        "the framework version is out of date",
      ],
      answer: 0,
      explain: `You do not need judgement for this one, which is the point — it is grep. A domain file that names \`@stellar/stellar-sdk\`, an ORM, or a React hook has already lost the argument, however reasonable the reason was at the time.`,
    },
    {
      kind: "theory",
      body: `## The law, and the missing mechanism

You can now say which way every arrow must point, and check any file in seconds.

What you cannot yet say is how the inner ring gets anything **done**. It must not name the chain SDK — but a payment still has to be sent. It must not know about a database — but the escrow still has to be stored somewhere. A law that makes the useful thing impossible is not a law anyone keeps.

**Next:** the doors the keep builds in its own walls, and who is allowed to stand outside them.`,
    },
  ],
  testOut: [
    {
      question: `State the dependency rule.`,
      options: [
        "Source-code dependencies point inward only — the outer ring may name the inner, never the reverse",
        "Every layer may depend on the layer directly below it, and no further",
        "Dependencies point toward whichever module changes least often",
      ],
      answer: 0,
    },
    {
      question: `Why inward rather than outward?`,
      options: [
        "Frameworks churn and business rules outlive them — pointing outward holds your slowest code hostage to your fastest dependency",
        "Inner modules are smaller, so they compile faster when they have no imports",
        "It is a convention that makes automated dependency graphs easier to draw",
      ],
      answer: 0,
    },
    {
      question: `Which import breaks the rule?`,
      options: [
        "domain/escrow.ts importing the chain SDK to build a transaction",
        "adapters/horizon.ts importing a domain interface in order to implement it",
        "ui/ReleaseButton.tsx importing a use-case in order to call it",
      ],
      answer: 0,
    },
    {
      question: `A React component decides whether escrow funds may be released, then renders the button. What is wrong with that?`,
      options: [
        "A business rule in the UI is invisible to the core's tests, and the next screen that needs it will duplicate it",
        "Nothing — deciding close to the render keeps the code together",
        "Only the performance: the check re-runs on every render",
      ],
      answer: 0,
    },
  ],
};
