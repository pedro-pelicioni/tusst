import type { Concept } from "../types";

// Craft VI — ports and adapters, split out of The Clean Keep. The law said
// the domain may not name the world; this is the mechanism that lets it get
// anything done anyway, plus the two things it buys: a core that tests in
// milliseconds, and vendor churn priced at one adapter.

export const theKeepsOwnDoors: Concept = {
  meta: {
    slug: "the-keeps-own-doors",
    title: "Ports & Adapters",
    tagline: "Ports & adapters: the domain declares the door, the world fits it.",
    numeral: "VI",
    arc: "craft",
    level: 2,
    requires: ["the-clean-keep"],
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-keeps-own-doors.webp",
    glyph: "🚪",
  },
  steps: [
    {
      kind: "theory",
      body: `## Ports and adapters

How does the inner ring *use* the chain without naming it? It declares a **port** — an interface the domain owns, written in the domain's own language:

> PaymentsPort: send a payment, read a balance, watch for arrival.

At the edge, **adapters** implement the port: a *Horizon adapter* today, a *Soroban RPC adapter* for contracts, a *fake adapter* for tests. Swapping RPC providers? A new adapter. Moving testnet → mainnet? Configuration. **The core never hears about it.**

The domain speaks to the port. The world plugs into the port. That's hexagonal architecture in one sentence.`,
    },
    {
      kind: "diagram",
      body: "One request, crossing every wall:",
      caption:
        "The arrow reverses at the port. Everything left of it is the keep's own language; everything right of it is somebody else's.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "ui",
            label: "ui",
            note: "Outer. Collects the intent and calls inward. Owns no rule of its own.",
            tone: "neutral",
          },
          {
            id: "usecase",
            label: "use-case",
            note: "Inner. Decides what must happen, in the domain's own words.",
            tone: "accent",
          },
          {
            id: "port",
            label: "port",
            note: "The inner edge — an interface the DOMAIN owns and names. This is the door.",
            tone: "gold",
          },
          {
            id: "adapter",
            label: "adapter",
            note: "Outer. Implements the port in the vendor's language, and translates back.",
            tone: "teal",
          },
          {
            id: "network",
            label: "network",
            note: "Horizon, RPC, a database, a fake in tests. Swappable by construction.",
            tone: "good",
          },
        ],
      },
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
      body: `## The port that leaks

A port can satisfy the dependency rule and still betray it. Watch:

> \`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`

Nothing here imports an adapter — the arrow still points the right way, and the linter is happy. But the *signature* speaks the vendor's language. The domain now thinks in \`TransactionBuilder\`, and every use-case that touches this port has quietly learned a Horizon type.

Swap the provider and the interface changes. Which means every caller changes. Which was the exact thing the port was built to prevent.

**A port is owned by the domain, so it must be written in the domain's words:**

> \`PaymentsPort.send(to: AccountId, amount: Money): Promise<PaymentReceipt>\`

The adapter's whole job is the translation between those two vocabularies. If nothing is being translated at the edge, the edge is not doing anything — and the door is a hole.`,
    },
    {
      kind: "theory",
      body: `## The testable island

A core with no framework imports is a **pure island**: construct it in a test, hand it a fake adapter, assert on behavior. No network, no dockerized chain, no flaky RPC — the trials from the Red-Green Rite, running in **milliseconds**.

This is the quiet, compounding payoff: teams with clean keeps write more tests *because tests are cheap*, and cheap trials mean tight loops — for humans and models alike.

The adapters still earn their own tests against the real network — a thin, honest layer, tested separately at its own slower speed.`,
    },
    {
      kind: "theory",
      body: `## The swap, counted

A team with a clean keep moves from Horizon to a Soroban RPC provider. Here is the whole diff, by file:

- **\`adapters/soroban-rpc.ts\`** — new, ~120 lines. Implements \`PaymentsPort\`, translates the provider's errors into the domain's own error types.
- **\`wiring/container.ts\`** — one line changed, choosing which adapter to construct.
- **\`adapters/soroban-rpc.test.ts\`** — new, tested against the real network at its own slower speed.

And the list of files that did **not** change: every entity, every use-case, every domain test. Not because anyone was careful during the migration — because nothing in there could name the old provider in the first place.

That is what the architecture is actually for. Not elegance: **a vendor's roadmap priced at one file and one line.**`,
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
      kind: "exercise",
      mode: "spec-write",
      brief: `## The examiner's trial: declare the doors

A use-case, stated in the domain's own words:

> **Release an escrow.** When both parties have approved and the deadline has not passed, the escrowed amount goes to the seller and the escrow is closed. If the deadline has passed and only one party approved, it goes back to the buyer instead.

Declare the **ports** this use-case needs — the doors the domain owns. For each: what it is for, and the shape of what goes in and what comes back, **in the domain's vocabulary**. Then name one adapter you would write for each, and one thing that adapter has to translate.`,
      rubric: `1. Declares at least two ports, each with a stated purpose.
2. Every port's inputs and outputs are named in DOMAIN terms — no vendor types, no SDK class names, no HTTP or SQL vocabulary.
3. Names at least one concrete adapter per port.
4. States at least one thing an adapter must translate between the vendor's vocabulary and the domain's.
5. The use-case's own decision (who gets the funds, and when) stays in the use-case — it is not delegated to a port.`,
      minChars: 180,
    },
    {
      kind: "theory",
      body: `## Small walls, small prompts

Here is what the keep buys you in the AI era: **well-bounded modules are well-bounded prompts.**

"Rewrite the Horizon adapter to target the new RPC — here's the port it must satisfy, here are its tests" is a task a model completes *inside a box*: one small file's worth of context, a contract to satisfy, trials to pass, and walls that cap the blast radius. The model rebuilds one room without ever wandering the keep.

Next discipline: the model itself — and the bench you must build around it.`,
    },
  ],
  testOut: [
    {
      question: `How does the inner ring use the chain without naming it?`,
      options: [
        "It declares a port — an interface the domain owns and writes in its own words — and an adapter implements it at the edge",
        "It imports the SDK but wraps every call in a try/catch so the coupling is contained",
        "It calls the adapter directly, since adapters are the outer ring's own concern",
      ],
      answer: 0,
    },
    {
      question: `\`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`. The arrow points inward. What is still wrong?`,
      options: [
        "The signature speaks the vendor's language, so swapping providers changes the interface and every caller with it",
        "Nothing — the dependency rule is satisfied and that is the whole test",
        "It returns a Promise, which couples the domain to the async runtime",
      ],
      answer: 0,
    },
    {
      question: `Your RPC provider announces a shutdown. In a keep built on ports and adapters, what changes?`,
      options: [
        "One adapter, plus the wiring that selects it — the domain and use-cases do not change at all",
        "Every use-case that sends a payment, since each one calls the provider",
        "The domain entities, since the endpoint is stored on them",
      ],
      answer: 0,
    },
    {
      question: `Why does a framework-free core make the loop from the Rite cheaper?`,
      options: [
        "It constructs in a test with a fake adapter and asserts in milliseconds — no network, no container, no flake",
        "It compiles to a smaller binary, so the test runner starts faster",
        "It removes the need for adapter tests, halving the suite",
      ],
      answer: 0,
    },
  ],
};
