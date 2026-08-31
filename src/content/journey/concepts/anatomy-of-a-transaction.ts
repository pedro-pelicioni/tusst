import type { Concept } from "../types";

// Realm II — the envelope itself: what a transaction IS. Half the Realm
// declares this chapter as a prerequisite, so it stays short and does one
// job: the shape, the verbs inside it, and one worked envelope the reader
// can picture. Everything that happens AFTER you press submit — sequence
// numbers, the lifecycle, fees, rejected vs. failed — is the next chapter.

export const anatomyOfATransaction: Concept = {
  meta: {
    slug: "anatomy-of-a-transaction",
    title: "Anatomy of a Transaction",
    tagline: "One shape carries everything that ever changes the ledger.",
    numeral: "II",
    arc: "realm",
    level: 1,
    requires: ["the-key-and-the-seal", "the-realm-of-stellar"],
    status: "live",
    estMinutes: 9,
    sigil: "/v2/journey/sigils/anatomy-of-a-transaction.webp",
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

There is no second shape. A payment, a token issuance, a smart-contract call, a trade on the DEX — all of them are this envelope with different verbs inside. Learn it once and every explorer page and SDK call on Stellar becomes readable at the same moment.`,
    },
    {
      kind: "diagram",
      body: "The envelope, opened:",
      caption:
        "Signing covers the whole envelope. Change one byte anywhere inside and every signature stops matching.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "source",
            label: "source account",
            note: "Who pays the fee, and whose sequence number advances.",
            tone: "neutral",
          },
          {
            id: "fee",
            label: "fee",
            note: "100 stroops per operation — a hundred-thousandth of an XLM each.",
            tone: "gold",
          },
          {
            id: "seq",
            label: "sequence number",
            note: "Used exactly once, ever. This is what makes a replay impossible.",
            tone: "accent",
          },
          {
            id: "ops",
            label: "operations",
            note: "Up to 100, applied in order. All of them land, or none of them do.",
            tone: "teal",
            bands: [
              {
                id: "op1",
                label: "payment",
                note: "Move an asset from one account to another.",
                tone: "teal",
              },
              {
                id: "op2",
                label: "change trust",
                note: "Open the trustline that lets the destination hold it.",
                tone: "teal",
              },
            ],
          },
          {
            id: "sigs",
            label: "signatures",
            note: "One per required signer. Anyone can check them against the source's address — nobody can forge one.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Operations: the verbs

An **operation** is one atomic verb. There are ~26 of them, in a handful of families:

- **Move value** — \`payment\`, \`path_payment_strict_send\`, \`create_account\`.
- **Hold value** — \`change_trust\`, \`set_trust_line_flags\`, \`clawback\`.
- **Trade** — \`manage_sell_offer\`, \`liquidity_pool_deposit\`.
- **Govern the account** — \`set_options\`, \`manage_data\`, \`account_merge\`.
- **Call code** — \`invoke_host_function\`, the one that reaches a smart contract.

One detail most people miss for months: **each operation may name its own source account**, different from the envelope's. That single field is what makes the next page possible.`,
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
      body: `## One envelope, three verbs, two signers

Ana wants to bring Bruno onto Stellar and hand him 50 USDC. Watch it fit into a single envelope:

- **Source:** Ana. Her sequence number advances; she pays the fee.
- **Op 1 —** \`create_account\`, destination Bruno, starting balance **2 XLM**.
- **Op 2 —** \`change_trust\` for USDC, **source: Bruno**. A trustline belongs to whoever holds it, so this operation is Bruno's, not Ana's.
- **Op 3 —** \`payment\`, 50 USDC to Bruno.

**Fee:** 3 operations × 100 stroops = **300 stroops**, or 0.00003 XLM.

And Bruno's 2 XLM? An account costs 2 base reserves, a trustline costs 1 more, at 0.5 XLM each: **1.5 XLM locked**, 0.5 XLM free. Reserves are not a fee — they come back if he ever closes the trustline.`,
    },
    {
      kind: "quiz",
      question: `In that envelope, why does Bruno have to sign at all — he is only receiving?`,
      options: [
        "Because op 2 opens *his* trustline, and an operation is authorized by its own source account",
        "Because every account named anywhere in a transaction must sign it",
        "Because the payment is larger than his starting balance",
      ],
      answer: 0,
      explain: `Receiving never requires your signature — but opening the trustline that lets you receive does. Send this envelope without Bruno's signature and the network answers \`tx_bad_auth\`: nothing happens at all, not even op 1.`,
    },
    {
      kind: "fill",
      prompt: `Complete the rule that makes batching safe:`,
      file: "NOTES.md",
      before: `One envelope, up to 100 operations, applied in order — and if any single one of them fails, `,
      after: ` .`,
      choices: [
        "none of them take effect",
        "the rest still take effect",
        "the failed one is skipped",
        "the network retries it automatically",
      ],
      answer: 0,
      explain: `All or nothing. This is why "create the account *and* open its trustline *and* fund it" is one envelope and not three hopeful steps — there is no state where Bruno exists but cannot hold what you sent him.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `That envelope is not hypothetical. The Forge's **Your First Wallet** lab performs \`create_account\`, \`change_trust\` and \`payment\` with your own signature on the real testnet — the same three verbs, with your own transaction hash at the end.`,
    },
    {
      kind: "theory",
      body: `## What you can read now

Source, sequence, fee, operations, signatures. You can look at any transaction on any Stellar explorer and name every part of it, and you know why a multi-step setup is safe to batch.

**Next:** you can build a valid envelope — but what happens after you press submit is a story of its own. Why one transaction is turned away at the door, while another is written into history as a failure *and charged for the privilege*, is the next chapter.`,
    },
  ],
  // Dedicated test-out bank — see the note in the-book-no-one-can-erase.
  testOut: [
    {
      question: `How many different shapes can carry a change to the Stellar ledger?`,
      options: [
        "One — a payment, a trade and a contract call are the same envelope with different verbs",
        "Three — one for payments, one for trades, one for contracts",
        "One per operation type, around 26 of them",
      ],
      answer: 0,
    },
    {
      question: `An operation inside your envelope names a source account different from the envelope's. What follows?`,
      options: [
        "That account has to sign the envelope too",
        "The operation is applied on behalf of the envelope's source anyway",
        "The envelope is rejected — operations must share the envelope's source",
      ],
      answer: 0,
    },
    {
      question: `An envelope carries four operations and the third one fails. What lands on the ledger?`,
      options: [
        "None of the four take effect",
        "The first two — the envelope stops where it broke",
        "All four, with the third marked as a warning",
      ],
      answer: 0,
    },
    {
      question: `What does the fee scale with?`,
      options: [
        "The number of operations in the envelope",
        "The amount of value being moved",
        "How long the envelope has been waiting to be included",
      ],
      answer: 0,
    },
  ],
};
