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
    level: 1,
    requires: ["machines-that-keep-promises"],
    status: "live",
    estMinutes: 13,
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

It deliberately does **not** say which loop, which storage layout, or which library. Two very different implementations can both honor the same spec — that freedom is what makes specs durable and AI-friendly.`,
    },
    {
      kind: "quiz",
      question: `You're writing the spec for an escrow contract. Which sentence **belongs in the spec**?`,
      options: [
        "Funds can be released only when both parties have signed.",
        "Number every deposit and save them in the order they arrive.",
        "Build it with the newest contract toolkit, plus its ready-made pause switch.",
      ],
      answer: 0,
      explain: `Behavior in, implementation out. Storage layouts and tooling choices are the *forge's* business; the spec owns what must be true.`,
    },
    {
      kind: "diagram",
      body: "The line that quiz just drew, in general:",
      caption: "Two implementations of the same spec can look nothing alike. That freedom is exactly the point.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "spec",
            label: "belongs in the spec",
            tone: "good",
          },
          {
            id: "forge",
            label: "belongs in the forge",
            tone: "neutral",
          },
        ],
        rows: [
          {
            label: "an example",
            cells: [
              {
                text: "funds are released only when both parties signed",
                tone: "good",
              },
              {
                text: "keep the deposits in a numbered list",
                tone: "neutral",
              },
            ],
          },
          {
            label: "who owns it",
            cells: [
              {
                text: "you — it outlives every rewrite",
                tone: "good",
              },
              {
                text: "whoever forges it, this time round",
                tone: "neutral",
              },
            ],
          },
          {
            label: "when it changes",
            cells: [
              {
                text: "when the behaviour must change",
                tone: "good",
              },
              {
                text: "whenever a faster way turns up",
                tone: "neutral",
              },
            ],
          },
        ],
      },
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
      kind: "exercise",
      mode: "spec-write",
      brief: `## The examiner's trial: spec a Guild Tip Jar

Time to forge a spec of your own. The commission:

> The guild wants an on-chain **tip jar**. Anyone may drop tips into it. Only the guild's **keeper** may collect what's inside. The guild is paranoid about two things: the keeper somehow taking *more* than the jar holds, and tips getting stuck forever if the keeper vanishes.

Write the spec — **behavior only**, the way this chapter taught: what must happen, what must never happen, and the edges. An AI examiner will judge it against the rubric below (and it grades exactly like the golem forges: to the letter).`,
      rubric: `1. Behavior only — no storage layouts, libraries, or function signatures.
2. The deposit rule and the collect rule are each stated unambiguously (who may act, on what).
3. At least one **invariant** that must hold at all times.
4. At least one **edge case** is addressed (zero-amount tip, empty-jar collect, exact-balance collect…).
5. The "keeper vanishes" concern is resolved by a stated behavior (any reasonable design is accepted — the rubric demands a decision, not a specific one).`,
      minChars: 120,
    },
    {
      kind: "theory",
      body: `## Your road from here

Every chapter of this Journey works like this one: a discipline the AI won't carry for you, practiced on **Stellar** — a real network with real machinery.

And whenever a concept makes you curious about the metal itself, look for the **"See it in Rust"** door: it leads into the optional Campaign, where the same ideas are forged by hand, skirmish by skirmish.

Next: the realm you'll be building in — and how thousands of machines agree without a king.`,
    },
  ],
  testOut: [
    { question: `Why is a spec the part of engineering that stays yours in the AI era?`,
      options: ["When code is cheap, \"looks right\" and \"is right\" become indistinguishable unless you wrote down what right means first","Because models cannot read specifications, so a human must hold them","Because specs are faster to write than code, so they save time"], answer: 0 },
    { question: `A spec describes what?`,
      options: ["Behavior — what must happen, what must never happen, and the edges","The implementation, precisely enough that any developer produces the same code","The storage layout and the public function signatures"], answer: 0 },
    { question: `Two very different implementations both satisfy your spec. What does that mean?`,
      options: ["The spec is doing its job — it constrains behavior and leaves implementation free","The spec is too vague and needs implementation detail added","One of the two implementations must be wrong"], answer: 0 },
    { question: `Which of these belongs in a spec?`,
      options: ["\"The contract's balance never falls below the sum of open deposits\"","\"Store deposits in a persistent map keyed by address\"","\"Use the latest SDK and keep the code clean\""], answer: 0 },
  ],
};
