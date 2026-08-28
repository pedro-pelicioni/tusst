import type { Concept } from "../types";

// Chapter I — spec-driven development. The journey's thesis chapter: in the
// AI era the scarce skill is not typing code, it is SPECIFYING behavior
// precisely enough that you can tell right from plausible. The spec-review
// exercise ships curated implementations in the content itself (deterministic,
// zero provider cost); the live "AI implements YOUR spec" exercise arrives
// with the mentor route in Phase C.

export const thinkBeforeYouForge: Concept = {
  meta: {
    slug: "think-before-you-forge",
    title: "Think Before You Forge",
    tagline: "Specs are the skill AI can't do for you.",
    numeral: "I",
    arc: "craft",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/think-before-you-forge.webp",
    glyph: "📜",
  },
  steps: [
    {
      kind: "theory",
      body: `## The vibe-coding trap

An AI can forge a working-looking contract in thirty seconds. It compiles. It runs. It even *demos* well.

And that is exactly the trap: when code is cheap, **"looks right" and "is right" become indistinguishable** — unless you wrote down, before the forging started, what *right* means.

That written-down thing is a **spec**. In the age of AI pair-programmers, the spec is the part of engineering that stays yours.`,
    },
    {
      kind: "theory",
      body: `## What a spec actually is

A spec describes **behavior**, not implementation:

- **What must happen** — "the depositor can reclaim funds after the deadline."
- **What must never happen** — "the contract's balance never drops below the sum of open deposits."
- **The edges** — "what if the deadline is exactly *now*? what if the amount is zero?"

It deliberately does **not** say which loop, which storage key, or which crate. Two very different implementations can both honor the same spec — that freedom is what makes specs durable and AI-friendly.`,
    },
    {
      kind: "quiz",
      question: `You're writing the spec for an escrow contract. Which sentence **belongs in the spec**?`,
      options: [
        "Funds can be released only when both parties have signed.",
        "Store the deposit in a persistent map keyed by a u64 counter.",
        "Use soroban-sdk 26 and the OpenZeppelin pausable extension.",
      ],
      answer: 0,
      explain: `Behavior in, implementation out. Storage layouts and crate choices are the *forge's* business; the spec owns what must be true.`,
    },
    {
      kind: "theory",
      body: `## Ambiguity is where bugs live

Take one innocent-looking requirement:

> "The buyer is refunded after the deadline."

Three engineers — or three AI runs — will read it three ways:

1. Refunded **automatically**, or refunded **when they ask**?
2. After the deadline **passes**, or **at** the deadline exactly?
3. The **full** amount, or minus fees?

None of these readings is a *coding* mistake. They are **spec holes** — and every one of them ships as a bug wearing a green test suite.`,
    },
    {
      kind: "quiz",
      question: `Here is a spec, and three forged implementations. **Which one honors the spec?**

**SPEC — Escrow v1**
1. The buyer deposits once; the amount is fixed at creation.
2. Funds are released to the seller only when **both** buyer and seller have approved.
3. After the deadline, **the buyer** may withdraw the funds **if release has not happened**.

---

**A** — releases to the seller when *either* party approves; after the deadline, the buyer may withdraw.

**B** — releases to the seller only when both approve; after the deadline, *anyone* may trigger the withdrawal, and funds go to the buyer.

**C** — releases only when both approve; after the deadline, the buyer may withdraw — *even if the release already happened*, using the contract's remaining balance.`,
      options: [
        "B — both-party release honored, and refund reaches the buyer under the deadline rule",
        "A — it feels more convenient for the seller",
        "C — the buyer should always be able to exit",
      ],
      answer: 0,
      explain: `A violates rule 2 (either ≠ both). C violates rule 3's guard ("if release has not happened") — it double-spends the escrow. B changes *who may trigger* the refund, which the spec never constrained — the funds still reach the buyer, so the spec is honored. Noticing that last distinction is the whole skill.`,
    },
    {
      kind: "theory",
      body: `## Invariants: the spec's iron ring

The strongest lines in a spec are **invariants** — statements that must hold *at every moment*, no matter which function ran:

> escrow balance = open deposits − releases − refunds

An invariant doesn't care how clever the implementation is. If it breaks once, the code is wrong. When you later meet **TDD** (next chapters), you'll turn these lines into executable tests — a spec the machine re-checks on every forge.`,
    },
    {
      kind: "fill",
      prompt: `Complete the escrow invariant:`,
      file: "SPEC.md",
      before: `balance(escrow) == deposits − releases − `,
      after: ``,
      choices: ["refunds", "fees", "profit", "gas"],
      answer: 0,
      explain: `Money leaves the escrow exactly two ways — releases to the seller, refunds to the buyer. If those three terms don't balance, someone forged a hole.`,
    },
    {
      kind: "quiz",
      question: `Your AI pair implemented the spec perfectly. Every test passes. In production, a buyer withdraws *during* the release transaction and the escrow pays twice — a case your spec never mentioned.

Whose bug is it?`,
      options: [
        "The spec's — and therefore yours: the artifact you own had a hole",
        "The AI's — it should have guessed the missing rule",
        "Nobody's — undefined behavior is fine",
      ],
      answer: 0,
      explain: `This is the deal of AI-era engineering: the machine forges to the letter of the spec, so the letter of the spec is your responsibility. Tighten the spec, re-forge, and both readings disappear.`,
    },
    {
      kind: "theory",
      body: `## Your road from here

Every chapter of this Journey works like this one: a discipline the AI won't carry for you, practiced on **Stellar** — a real network with real machinery.

And whenever a concept makes you curious about the metal itself, look for the **"See it in Rust"** door: it leads into the optional Campaign, where the same ideas are forged by hand, skirmish by skirmish.

Next: the realm you'll be building in — and how thousands of machines agree without a king.`,
    },
  ],
};
