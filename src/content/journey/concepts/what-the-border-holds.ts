import type { Concept } from "../types";

// Craft IV — tactical DDD, split out of Borders of the Realm. Inside one
// border: what has identity, what is only its value, and which things are
// only allowed to change together. Stellar supplies the specimens — the
// account, the asset, and the transaction envelope — so none of it has to be
// taught in the abstract.

export const whatTheBorderHolds: Concept = {
  meta: {
    slug: "what-the-border-holds",
    title: "What the Border Holds",
    tagline: "Identity, value, and the cluster that must move as one.",
    numeral: "IV",
    arc: "craft",
    level: 2,
    requires: ["borders-of-the-realm"],
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/what-the-border-holds.webp",
    glyph: "🧩",
  },
  steps: [
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
      kind: "diagram",
      body: "Two kinds of thing, and the question that separates them:",
      caption:
        "Ask \"if I swap this for an identical copy, has anything changed?\" — no means value, yes means entity.",
      view: {
        kind: "compare",
        columns: [
          { id: "entity", label: "entity", tone: "accent" },
          { id: "value", label: "value object", tone: "teal" },
        ],
        rows: [
          {
            label: "Stellar specimen",
            cells: [
              { text: "an account (G…)", tone: "accent" },
              { text: "an asset (code + issuer)", tone: "teal" },
            ],
          },
          {
            label: "what makes two equal",
            cells: [
              { text: "the same identity", tone: "accent" },
              { text: "the same fields", tone: "teal" },
            ],
          },
          {
            label: "survives a change of state",
            cells: [
              { text: "yes — balances move, the account stays", tone: "accent" },
              { text: "no — change the issuer and it is a different asset", tone: "teal" },
            ],
          },
          {
            label: "you therefore",
            cells: [
              { text: "track it", tone: "accent" },
              { text: "compare it", tone: "teal" },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Aggregates: the envelope rule

Some objects only make sense **together**, guarded by one root that enforces the rules. That cluster is an **aggregate**.

Stellar hands you a perfect specimen: the **transaction envelope**. Operations live *inside* a transaction — signed together, sequenced together, and they **succeed or fail together**. You cannot pluck operation #3 out and apply it alone; the envelope is the only door, and it holds the signatures and the sequence number.

That's the aggregate pattern in production: consistency is enforced *at the boundary*, so nothing inside can ever be half-applied.`,
    },
    {
      kind: "theory",
      body: `## The aggregate that ate the system

The classic way to get this wrong is to draw the aggregate **too big**.

It starts reasonably: these things must stay consistent, so put them under one root. Then so must those. Soon the root is "the Ledger", every change has to go through it, and two unrelated operations cannot proceed at the same time because they contend on the same guard. Consistency was bought with a queue.

Stellar shows the restraint. The envelope is an aggregate — but a **small** one: up to a hundred operations, one account's sequence number, and nothing else. It does not guard the ledger; it guards one submission. Everyone else's envelopes proceed in the same five seconds, untouched.

The rule of thumb: an aggregate should be the smallest cluster that must be **correct together**, not the largest cluster that happens to be **related**.`,
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
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `These two shapes stop being abstract the moment you store them. In the Campaign's Act VII, an entity is what you reach for by **key** in contract storage, and a value object is a \`#[contracttype]\` you compare with \`==\`. Getting that pairing wrong is how the same asset ends up stored under two keys.`,
    },
    {
      kind: "theory",
      body: `## Inside the border, where does it live?

You can now say, for one context: what has identity, what is only its value, and which cluster has to move as one.

What you cannot yet say is where any of it **sits**. Does the aggregate know about the database? May the ledger client reach into the domain rules? Those questions have an answer, and it is the same answer every time.

**Next:** the keep, and the one rule that decides which direction every dependency is allowed to point.`,
    },
  ],
  testOut: [
    {
      question: `Two USDC from the same issuer. Is there a meaningful question "which is the original"?`,
      options: [
        "No — an asset is a value object; equality is field-by-field and it has no identity of its own",
        "Yes — each token carries a serial that distinguishes it",
        "Only if they are held by different accounts",
      ],
      answer: 0,
    },
    {
      question: `An account pays out a thousand times. Is it the same account?`,
      options: [
        "Yes — an entity keeps its identity while its state changes underneath",
        "No — its balance defines it, so a changed balance is a changed account",
        "Only if the sequence number has not wrapped",
      ],
      answer: 0,
    },
    {
      question: `What makes the transaction envelope a textbook aggregate?`,
      options: [
        "It is the only door in: signatures and sequence bind at the envelope, and its contents succeed or fail together",
        "It is the largest object in the protocol, so it contains everything else",
        "It can be split into its operations when only one of them is needed",
      ],
      answer: 0,
    },
    {
      question: `What is the classic way to draw an aggregate wrong?`,
      options: [
        "Too big — consistency ends up bought with a queue, because unrelated work contends on one root",
        "Too small — every rule then needs a transaction across several roots",
        "Without a root, so nothing enforces the invariants",
      ],
      answer: 0,
    },
  ],
};
