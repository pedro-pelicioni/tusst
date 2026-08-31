import type { Concept } from "../types";

// Craft III — strategic DDD: language, borders, and the bridges between
// them. The tactical patterns that live INSIDE a border — entities, value
// objects, aggregates — are Craft IV, because "where do the lines go" and
// "what is on either side of them" are two different lessons and only the
// first one is about the model mixing your vocabularies.

export const bordersOfTheRealm: Concept = {
  meta: {
    slug: "borders-of-the-realm",
    title: "Bounded Contexts",
    tagline: "DDD & bounded contexts: one word, three meanings, and the borders that make that safe.",
    numeral: "III",
    arc: "craft",
    level: 2,
    requires: ["think-before-you-forge"],
    status: "live",
    estMinutes: 12,
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
      kind: "fill",
      prompt: `Complete the rule that makes a border a border:`,
      file: "NOTES.md",
      before: `Inside one context a word has exactly one meaning. At the border, that meaning is allowed to `,
      after: ` .`,
      choices: [
        "change",
        "stay the same",
        "become optional",
        "be inherited by the next context",
      ],
      answer: 0,
      explain: `If the meaning could not change, you would not need a border — you would need one shared model, which is the thing borders exist to prevent. A border is precisely the place where "Account" is allowed to mean something else, on purpose, with a translation on the way through.`,
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
      body: `## The border that quietly dissolves

Borders rarely fall in one go. They erode, and always by the same polite move: *"these two contexts share just a little."*

It starts with one type. Payments and Compliance both need an address, so they import a shared \`Account\` — only the identifier, nothing else. Then Compliance needs the status on it. Then Payments needs one Compliance field for a receipt. Six months later the shared type has fourteen fields, half of them meaningless in either context, and neither side can change it without a meeting.

The tell is not the size of the shared thing. It is **who has to be consulted to change it**. A border you cannot cross without a translation is a border. A border you cross by importing is a decoration.

The bridge that stays healthy is the one where each side keeps its own model and something in the middle converts — which is exactly what an anchor does, and exactly what a shared type does not.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## The examiner's trial: draw the borders

Here is a system, described the way a founder would describe it:

> A remittance app. Users sign up and pass identity checks. They fund a balance from a bank transfer, send money to recipients in another country, and the recipient cashes out at a local partner. Support staff can freeze an account and view a full audit trail.

Name the **bounded contexts** you would draw, and for each: the words whose meaning changes at that border, and how the contexts talk to each other. Modelling only — no schemas, no services, no framework names.`,
      rubric: `1. Names at least three plausible bounded contexts with a one-line responsibility each.
2. Identifies at least one word that means genuinely different things in two of those contexts, and says what it means in each.
3. Describes how at least one pair of contexts communicates — a translation at the edge, not a shared model.
4. Does not resolve the differences by proposing one shared model for everyone.
5. Modelling only — no database schemas, no service or framework names, no code.`,
      minChars: 180,
    },
    {
      kind: "theory",
      body: `## Why the model needs your map

An LLM has read a million codebases where "account", "transfer", and "balance" all meant different things. Leave your borders unstated and it will **mix vocabularies mid-file** — a KYC rule drifting into your payments model, an exchange's idea of Account shading into your wallet's — every line locally plausible.

So spell the border onto the bench: *"We're in the Payments context. Account means balance holder. Compliance is a separate model — reference it by address only."* A stated context is a fence the model respects.

**Next:** you have drawn the lines. What actually lives inside one — and which things are only allowed to change together.`,
    },
  ],
  testOut: [
    {
      question: `Three teams each define "Account" differently. What does DDD call the place where the meaning is allowed to change?`,
      options: [
        "A bounded context — the border is the design, not a failure of it",
        "A namespace collision, to be resolved by renaming one of them",
        "Technical debt, to be paid down by unifying the model",
      ],
      answer: 0,
    },
    {
      question: `Compliance asks you to add \`kyc_status\` to the Payments context's Account. What is the DDD read?`,
      options: [
        "Keep separate models behind separate borders, linked by the address — each context models only what it needs",
        "Merge them, since duplication is the greater evil",
        "Add the fields as optional so Payments can ignore them",
      ],
      answer: 0,
    },
    {
      question: `What is a Stellar anchor, in the vocabulary of this chapter?`,
      options: [
        "A context map made into a business — it translates between the banking context and the ledger context",
        "A shared model that both banks and the ledger agree to adopt",
        "A compliance layer that sits above both contexts and governs them",
      ],
      answer: 0,
    },
    {
      question: `Why does an unstated border hurt you more when an AI is writing the code?`,
      options: [
        "It has read a million codebases where those words meant other things, and will mix the vocabularies mid-file",
        "It cannot read domain terms at all and needs technical names",
        "It refuses to proceed until every term is formally defined",
      ],
      answer: 0,
    },
  ],
};
