import type { Concept } from "../types";

// Chapter III (craft) — Domain-Driven Design with Stellar's own domain as the
// running example: "Account" means three things in three contexts, the
// transaction envelope is a textbook aggregate, and anchors are context
// mapping with a business model. Ends on why AI needs your borders stated.

export const bordersOfTheRealm: Concept = {
  meta: {
    slug: "borders-of-the-realm",
    title: "Borders of the Realm",
    tagline: "DDD & bounded contexts, mapped on Stellar itself.",
    numeral: "III",
    arc: "craft",
    level: 2,
    status: "live",
    estMinutes: 14,
    sigil: "/v2/journey/sigils/borders-of-the-realm.webp",
    glyph: "🗺",
  },
  steps: [
    {
      kind: "theory",
      body: `## One word, three meanings

Ask three teams on Stellar what an **Account** is:

- A *wallet* team: "a balance holder — someone who owns lumens and assets."
- An *anchor* team: "a KYC subject — someone we must identify before moving money."
- An *exchange* team: "an order-book participant — someone with open offers."

Same word. Same G-address, even. **Three different models.** Most "miscommunication bugs" are exactly this: two people using one word for two concepts, each certain the other agrees.

Domain-Driven Design begins here: make language precise *on purpose*.`,
    },
    {
      kind: "theory",
      body: `## Ubiquitous language, bounded contexts

Inside one team and one part of the system, DDD demands a **ubiquitous language**: one word, one meaning, used *everywhere* — conversation, spec, and code. If the spec says "release", the function is \`release\`, not \`transfer_out\`.

But no language rules the whole realm. A **bounded context** is the border where a word's meaning is allowed to change: inside *Payments*, an Account is a balance holder; cross into *Compliance*, and the same address is a KYC subject.

The border is not a failure of design. **The border is the design.**`,
    },
    {
      kind: "diagram",
      body: "The same word, three borders:",
      caption: "The dashed lines are translations, not shared code. A context that imports another's model has no border at all.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "pay",
            label: "PAYMENTS",
            x: 22,
            y: 20,
            tone: "accent",
            shape: "box",
            note: "Here an \"account\" is a source, a sequence number and a fee budget.",
          },
          {
            id: "trade",
            label: "TRADING",
            x: 78,
            y: 20,
            tone: "teal",
            shape: "box",
            note: "Here it is a set of open offers and the assets they are denominated in.",
          },
          {
            id: "custody",
            label: "CUSTODY",
            x: 50,
            y: 50,
            tone: "gold",
            shape: "box",
            note: "And here it is a signer set with thresholds. Same word, three meanings.",
          },
        ],
        edges: [
          {
            from: "pay",
            to: "trade",
            style: "dashed",
          },
          {
            from: "pay",
            to: "custody",
            style: "dashed",
          },
          {
            from: "trade",
            to: "custody",
            style: "dashed",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `The Compliance team asks you to add \`kyc_status\` and \`risk_score\` to the Payments context's Account model — "it's the same account, after all." What's the DDD read?`,
      options: [
        "Keep separate models behind separate borders, linked by the account's address — each context models only what it needs",
        "Merge them — one shared Account model for the whole system avoids duplication, which is the greater evil",
        "Add the fields but mark them optional, so Payments code can simply ignore them",
      ],
      answer: 0,
      explain: `A shared model grows every context's fields and rules until no context can move without breaking another. Two lean models that share an ID aren't duplication — they're two truths about one address, each owned where it's understood.`,
    },
    {
      kind: "theory",
      body: `## Entities and value objects

Two kinds of thing live inside any context:

- An **entity** has identity that survives change. A Stellar **Account** is the same account after a thousand payments — its address is its identity; its balances are just state.
- A **value object** *is* its value. A Stellar **Asset** is a code plus an issuer: two \`USDC\` from the same issuer are interchangeable — indistinguishable, in fact. Change the issuer and you haven't edited the asset; you're holding a *different* asset.

Entities are tracked. Values are compared. Mixing the two up is how ghost bugs are born.`,
    },
    {
      kind: "quiz",
      question: `Which of these is a **value object** in Stellar's domain?`,
      options: [
        "An asset — code + issuer; two with equal fields are the same thing, with no identity of their own",
        "An account — it keeps its identity while its balances change underneath",
        "A validator — it stays the same node across restarts and IP changes",
      ],
      answer: 0,
      explain: `Both other answers describe true things — but they're *entities*: identity surviving change. The asset is pure value: equality is field-by-field, and "which one is the original?" isn't even a meaningful question.`,
    },
    {
      kind: "theory",
      body: `## Aggregates: the envelope rule

Some objects only make sense **together**, guarded by one root that enforces the rules. That cluster is an **aggregate**.

Stellar hands you a perfect specimen: the **transaction envelope**. Operations live *inside* a transaction — signed together, sequenced together, and they **succeed or fail together**. You cannot pluck operation #3 out and apply it alone; the envelope is the only door, and it holds the signatures and the sequence number.

That's the aggregate pattern in production: consistency is enforced *at the boundary*, so nothing inside can ever be half-applied.`,
    },
    {
      kind: "quiz",
      question: `A signed Stellar transaction holds five operations, and the third is the only one you care about. Can that operation be applied to the ledger on its own?`,
      options: [
        "No — operations apply only through their envelope, and the whole transaction succeeds or fails as one",
        "Yes — each operation carries its own signature, so each can stand alone",
        "Yes — as long as you pay a separate fee for that single operation",
      ],
      answer: 0,
      explain: `The envelope is the aggregate root: signatures and the sequence number bind at the transaction, never per-operation. This is exactly what makes multi-operation atomic swaps safe — there is no world where only half of one lands.`,
    },
    {
      kind: "fill",
      prompt: `Complete the aggregate's law:`,
      file: "NOTES.md",
      before: `Ops in one envelope succeed or fail `,
      after: ` — the transaction is the unit of consistency.`,
      choices: ["together", "independently", "in fee order", "by signature weight"],
      answer: 0,
      explain: `Atomicity is the aggregate's whole promise. Fee order and signature weight are real Stellar concepts — but they decide *whether and when* an envelope applies, never *which parts* of it do.`,
    },
    {
      kind: "theory",
      body: `## Bridges between contexts: the anchor

Contexts still must talk. **Context mapping** is naming the borders and building deliberate bridges — translation at the edge, so neither side's language leaks into the other.

Stellar's **anchors** are this pattern with a business model. On one side: the *banking context* — IBANs, business days, compliance holds. On the other: the *ledger context* — trustlines, assets, 5-second finality. The anchor **translates**: an incoming wire becomes issued tokens; a redeemed token becomes a bank payout.

Neither world had to adopt the other's model. That's a healthy border: crossed by translation, never by leakage.`,
    },
    {
      kind: "theory",
      body: `## Why the golem needs your map

An LLM has read a million codebases where "account", "transfer", and "balance" all meant different things. Leave your borders unstated and it will **mix vocabularies mid-file** — a KYC rule drifting into your payments model, an exchange's idea of Account shading into your wallet's — every line locally plausible.

So spell the border onto the bench: *"We're in the Payments context. Account means balance holder. Compliance is a separate model — reference it by address only."* A stated context is a fence the golem respects.

Next discipline: inside one context, where does each piece *live*? Enter the keep.`,
    },
  ],
};
