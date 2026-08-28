import type { Concept } from "../types";

// Chapter IV (craft) — clean & hexagonal architecture as a keep: the
// dependency rule, ports & adapters on a Stellar dApp (PaymentsPort vs
// Horizon/Soroban RPC adapters), the pure testable core, and why small
// well-bounded modules become small well-bounded prompts.

export const theCleanKeep: Concept = {
  meta: {
    slug: "the-clean-keep",
    title: "The Clean Keep",
    tagline: "Clean & hexagonal architecture — every piece in its place.",
    numeral: "IV",
    arc: "craft",
    status: "live",
    estMinutes: 13,
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
      kind: "theory",
      body: `## Ports and adapters

How does the inner ring *use* the chain without naming it? It declares a **port** — an interface the domain owns, written in the domain's own language:

> PaymentsPort: send a payment, read a balance, watch for arrival.

At the edge, **adapters** implement the port: a *Horizon adapter* today, a *Soroban RPC adapter* for contracts, a *fake adapter* for tests. Swapping RPC providers? A new adapter. Moving testnet → mainnet? Configuration. **The core never hears about it.**

The domain speaks to the port. The world plugs into the port. That's hexagonal architecture in one sentence.`,
    },
    {
      kind: "fill",
      prompt: `The keep speaks to the port, never to the vendor:`,
      file: "domain/release-escrow.ts",
      before: `constructor(private payments: `,
      after: `) {}`,
      choices: ["PaymentsPort", "HorizonClient", "SorobanServer", "FreighterApi"],
      answer: 0,
      explain: `The other three are real and useful — and they belong in adapters, behind the port. The use-case names only the interface it owns, which is why a fake adapter can stand in during tests and a new RPC provider never touches this file.`,
    },
    {
      kind: "theory",
      body: `## Where everything lives

A request crosses the walls like this:

**UI** (outer) → **use-case** (inner) → **port** (inner edge) → **adapter** (outer) → network.

- React components, routes, styling — **outer**.
- Postgres, ORM, migrations — **outer**.
- stellar-sdk, RPC clients, the wallet bridge — **outer**.
- "Funds release only when both approved" — **inner**, in a module that imports *nothing* from the list above.

The smell test is mechanical: open a domain file and read its imports. A framework name in that list means a wall is breached.`,
    },
    {
      kind: "theory",
      body: `## The testable island

A core with no framework imports is a **pure island**: construct it in a test, hand it a fake adapter, assert on behavior. No network, no dockerized chain, no flaky RPC — the trials from the Red-Green Rite, running in **milliseconds**.

This is the quiet, compounding payoff: teams with clean keeps write more tests *because tests are cheap*, and cheap trials mean tight loops — for humans and golems alike.

The adapters still earn their own tests against the real network — a thin, honest layer, tested separately at its own slower speed.`,
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
      kind: "quiz",
      question: `Your RPC provider announces a shutdown. In a keep built on ports and adapters, what has to change?`,
      options: [
        "One adapter, plus the wiring that selects it — the domain and use-cases don't change at all",
        "Every use-case that sends a payment, since each one calls the provider",
        "The domain entities, since the endpoint URL is stored on them",
      ],
      answer: 0,
      explain: `That's the architecture's ROI in one line: vendor churn is priced at one adapter. If the honest answer in your codebase is "every use-case", the dependency arrows are pointing the wrong way.`,
    },
    {
      kind: "theory",
      body: `## Small walls, small prompts

Here is what the keep buys you in the AI era: **well-bounded modules are well-bounded prompts.**

"Rewrite the Horizon adapter to target the new RPC — here's the port it must satisfy, here are its tests" is a task a golem completes *inside a box*: one small file's worth of context, a contract to satisfy, trials to pass, and walls that cap the blast radius. The golem rebuilds one room without ever wandering the keep.

Next discipline: the golem itself — and the bench you must build around it.`,
    },
  ],
};
