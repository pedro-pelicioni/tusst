import type { Concept } from "../types";

// Chapter III — the transaction, dissected. Hands off into the Forge's
// wallet-onboarding lab so the anatomy is something the learner has
// actually signed, not just read about.

export const anatomyOfATransaction: Concept = {
  meta: {
    slug: "anatomy-of-a-transaction",
    title: "Anatomy of a Transaction",
    tagline: "Envelope, operations, fees, signatures — dissected live.",
    numeral: "III",
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/3.webp",
    glyph: "✉️",
  },
  steps: [
    {
      kind: "theory",
      body: `## The envelope

Everything that ever changes the Stellar ledger travels inside one shape — a **transaction envelope**:

- **Source account** — who is acting (and paying the fee).
- **Sequence number** — this account's transaction counter.
- **Fee** — what you bid to be included.
- **Operations** — the actual verbs (1 to 100 of them).
- **Signatures** — proof the source (and anyone else required) agreed.

Learn this one shape and every explorer page, SDK call and failed-transaction error on Stellar becomes readable.`,
    },
    {
      kind: "theory",
      body: `## Operations: the verbs

An **operation** is one atomic verb: \`payment\`, \`create_account\`, \`change_trust\`, \`manage_sell_offer\`, \`invoke_host_function\` (the one that calls smart contracts)… there are ~26 of them.

A single envelope can carry **several operations**, and they land **atomically**: create an account *and* fund it *and* open its trustline in one stroke — or none of it happens at all.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `You've met these verbs in the flesh — or you're about to. The Forge's **Your First Wallet** lab performs \`create_account\`, \`change_trust\` and \`payment\` with your own signature on the real testnet. Theory reads better with your own transaction hashes in it.`,
    },
    {
      kind: "quiz",
      question: `Your envelope carries three operations: a payment, a trustline, and a second payment that turns out to be underfunded. What lands on the ledger?`,
      options: [
        "Nothing — one failed operation fails the whole transaction",
        "The first two operations — it fails from the third onward",
        "All three — failures are recorded as warnings",
      ],
      answer: 0,
      explain: `Atomicity is the point: a transaction is all-or-nothing, which is why multi-step setups (create + fund + trust) are safe to batch.`,
    },
    {
      kind: "theory",
      body: `## Sequence numbers: no replays, no races

Every account carries a counter. A transaction must state \`current + 1\`, and the ledger increments it on inclusion — so:

- a signed transaction can **never be replayed** (its number is spent),
- two transactions from the same account **can't race** into the same slot.

That "tx_bad_seq" error every Stellar developer eventually meets? It just means *someone else moved your counter first — rebuild and resign.*`,
    },
    {
      kind: "fill",
      prompt: `Put the lifecycle in order — what happens between building and submitting?`,
      file: "lifecycle.txt",
      before: `build the envelope  →  `,
      after: `  →  submit  →  ledger close`,
      choices: ["sign it", "mine it", "notarize it", "stake it"],
      answer: 0,
      explain: `Build, **sign**, submit, close — about five seconds end to end. No mining, no waiting for confirmations-plural: one ledger close is finality.`,
    },
    {
      kind: "quiz",
      question: `Why does the network charge a fee (100 stroops = 0.00001 XLM) per operation at all?`,
      options: [
        "To make spam expensive at scale while staying invisible to humans",
        "To pay validators a salary — it's their business model",
        "To subsidize the Friendbot",
      ],
      answer: 0,
      explain: `Fees on Stellar are a rate limiter, not a revenue stream — collected fees are recycled by the protocol. A million junk transactions cost real money; your payment costs a rounding error.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `In the Campaign's Act VII, the same envelope carries \`invoke_host_function\` — and the operation's payload is **your own Rust**. When you're ready to forge the verbs themselves, the door is here.`,
    },
  ],
};
