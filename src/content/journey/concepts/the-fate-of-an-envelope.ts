import type { Concept } from "../types";

// Realm III — what happens AFTER submit. Split out of Anatomy so neither
// chapter runs long: the counter, the five-second lifecycle, the difference
// between rejected-at-the-door and failed-on-the-ledger, and what the fee is
// actually for. The compare diagram is the payload — that distinction is the
// one every Stellar developer otherwise learns the expensive way.

export const theFateOfAnEnvelope: Concept = {
  meta: {
    slug: "the-fate-of-an-envelope",
    title: "The Transaction Lifecycle",
    tagline: "Sequence, fees & the transaction lifecycle: submitted, included, failed, charged.",
    numeral: "III",
    arc: "realm",
    level: 1,
    requires: ["anatomy-of-a-transaction"],
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/the-fate-of-an-envelope.webp",
    glyph: "🎲",
  },
  steps: [
    {
      kind: "theory",
      body: `## The counter that stops replays

Every account carries a sequence number. A transaction must state \`current + 1\`, and the ledger increments it on inclusion — so a signed transaction can **never be replayed** (its number is spent), and two transactions from the same account **can't race** into the same slot.

That last one has a practical edge. If your backend signs two transactions from the same account at the same moment, both claim \`current + 1\` — and exactly one wins. The other comes back \`tx_bad_seq\`, which does *not* mean "malformed"; it means *someone else moved your counter first — rebuild and resign*.

The usual fix is not a retry loop. It is a **channel account**: a separate account that supplies sequence numbers, so parallel work never fights over one counter.`,
    },
    {
      kind: "quiz",
      question: `Two servers sign a payment from the same account in the same second. Both are submitted. What happens?`,
      options: [
        "One is included; the other is rejected with tx_bad_seq and must be rebuilt",
        "Both are included — the ledger orders them automatically",
        "Both are rejected, because the account is locked while a transaction is pending",
      ],
      answer: 0,
      explain: `The counter is the referee. Nothing is "locked" and nothing is queued for you — the second envelope names a sequence number that is no longer next, and is turned away. Rebuilding is the fix; a channel account is the cure.`,
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
      kind: "diagram",
      body: "The five seconds, stage by stage:",
      caption:
        "Signing happens on your machine, offline. Your secret key never travels — only the finished envelope does.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "build",
            label: "build",
            note: "Assemble source, sequence, fee and operations. Nothing has left your machine.",
            tone: "neutral",
          },
          {
            id: "sign",
            label: "sign",
            note: "Every required signer seals the envelope locally. Secret keys stay put.",
            tone: "accent",
          },
          {
            id: "submit",
            label: "submit",
            note: "Sent to an RPC or Horizon endpoint, which forwards it to the validators.",
            tone: "teal",
          },
          {
            id: "validate",
            label: "validate",
            note: "Signatures, sequence and fee are checked. Fail here and it never reaches the ledger.",
            tone: "gold",
          },
          {
            id: "close",
            label: "ledger close",
            note: "~5 seconds. One close is finality — there is no second confirmation to wait for.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## The mistake everyone makes once

"My transaction failed, so nothing happened and it cost me nothing."

Half of that is usually wrong, because **two very different things both get called "failed"**:

- **Rejected at the door.** Bad signature, bad sequence, fee too low. The envelope never gets in. Nothing charged, nothing recorded, your counter does not move.
- **Failed on the ledger.** The envelope was valid, so it *was* included — then an operation didn't work. Its **effects** are all reverted, but the transaction is written into history as a failure, **the fee is consumed, and the sequence number is spent.**`,
    },
    {
      kind: "diagram",
      body: "Two words that both sound like failure:",
      caption:
        "The difference is whether the envelope was ever valid. Valid-but-doomed still costs you.",
      view: {
        kind: "compare",
        columns: [
          { id: "rejected", label: "rejected at the door", tone: "neutral" },
          { id: "failed", label: "failed on the ledger", tone: "bad" },
        ],
        rows: [
          {
            label: "typical code",
            cells: [
              { text: "tx_bad_seq, tx_bad_auth", tone: "neutral" },
              { text: "op_underfunded, op_no_trust", tone: "bad" },
            ],
          },
          {
            label: "written to history",
            cells: [
              { text: "no", tone: "good" },
              { text: "yes, marked failed", tone: "bad" },
            ],
          },
          {
            label: "fee charged",
            cells: [
              { text: "no", tone: "good" },
              { text: "yes", tone: "bad" },
            ],
          },
          {
            label: "sequence number",
            cells: [
              { text: "untouched", tone: "good" },
              { text: "spent — rebuild required", tone: "bad" },
            ],
          },
        ],
      },
    },
    {
      kind: "fill",
      prompt: `Complete the rule that catches most people once:`,
      file: "NOTES.md",
      before: `A transaction that was valid enough to be included, but whose operation failed, is written to the ledger as a failure — and its fee `,
      after: ` .`,
      choices: [
        "is charged anyway",
        "is refunded automatically",
        "is never charged at all",
        "is charged only on the retry",
      ],
      answer: 0,
      explain: `Being included is what costs you, not succeeding. The practical consequence: a retry loop that treats every error the same will happily resubmit an envelope that already burned its sequence number. Read the code before you retry.`,
    },
    {
      kind: "theory",
      body: `## Fees: a rate limiter, not a revenue stream

The base fee is **100 stroops per operation** — 0.00001 XLM, a rounding error for a human, real money for a million junk envelopes. That asymmetry *is* the design.

- **You bid a maximum, you pay the minimum.** The fee you set is a ceiling. When the ledger has room you are charged the base fee no matter how high you bid; only when demand exceeds capacity does surge pricing fill the ledger by bid.
- **Somebody else can pay.** A **fee-bump transaction** wraps an already-signed envelope and puts a different account on the bill, without invalidating a single existing signature. It is how an app sponsors a user who holds no XLM at all.`,
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
      explain: `Fees on Stellar are a rate limiter, not a revenue stream — validators receive neither block rewards nor fee income. Nobody runs a validator for the revenue, which is a large part of why the fee can stay this small.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `In the Campaign's Act VII, the same envelope carries \`invoke_host_function\` — and the operation's payload is **your own Rust**. Everything here still applies to it: same counter, same lifecycle, same distinction between rejected and failed.`,
    },
  ],
  // Dedicated test-out bank — see the note in the-book-no-one-can-erase.
  testOut: [
    {
      question: `What does the sequence number prevent?`,
      options: [
        "A signed transaction being replayed, and two transactions racing into the same slot",
        "The fee from being charged twice on a retry",
        "An account from holding more than one asset at a time",
      ],
      answer: 0,
    },
    {
      question: `Your transaction comes back rejected with tx_bad_seq. What did it cost you?`,
      options: [
        "Nothing — it never entered the ledger, so no fee and no counter moved",
        "The fee, because the network still had to check it",
        "The fee and the sequence number, same as any other failure",
      ],
      answer: 0,
    },
    {
      question: `A transaction is included, but its payment turns out to be underfunded. What was spent?`,
      options: [
        "The fee and the sequence number, even though nothing moved",
        "Nothing — reverted effects mean a reverted transaction",
        "Only the sequence number; fees are refunded on failure",
      ],
      answer: 0,
    },
    {
      question: `An app wants to onboard a user who holds no XLM at all. What makes that possible?`,
      options: [
        "A fee-bump transaction, which puts a different account on the bill without touching the existing signatures",
        "Lowering the fee to zero for new accounts",
        "The Friendbot, which pays fees on mainnet for first-time users",
      ],
      answer: 0,
    },
  ],
};
