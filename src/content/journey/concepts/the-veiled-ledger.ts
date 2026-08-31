import type { Concept } from "../types";

// Realm XI — why a public ledger needs a veil at all, the primitive that makes
// one possible, and the first of the two systems built on it. The deeper veil
// and the compliance spine that makes it legitimate are Realm XII, because
// "amounts can be hidden" and "and it is still auditable" are separate claims
// and only the second one is the surprising part.

export const theVeiledLedger: Concept = {
  meta: {
    slug: "the-veiled-ledger",
    title: "The Veiled Ledger",
    tagline: "Proof without disclosure — and the first veil built on it.",
    numeral: "XIII",
    arc: "realm",
    level: 2,
    requires: ["wallets-without-seeds"],
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-veiled-ledger.webp",
    glyph: "🕯️",
  },
  steps: [
    {
      kind: "theory",
      body: `## Transparency is a feature — until it leaks

Everything you have built so far is radically public: every balance, every payment, every counterparty, forever.

For finance that is often *the* selling point — auditable reserves, verifiable rails. But hold it against real business and it cuts the other way:

- Pay salaries on-chain and **every employee can read every other salary**.
- Pay a supplier and your **competitors read your prices and volumes**.
- Move treasury and the market front-runs your intent.

Serious money needs *selective* silence. The question is how a public ledger can keep secrets without becoming one.`,
    },
    {
      kind: "diagram",
      body: "The same payment, seen from two sides:",
      caption: "Nothing here is encrypted today. Every line is public by design — which is the feature, and the leak.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "explorer",
            label: "what anyone can read",
            tone: "bad",
          },
          {
            id: "you",
            label: "what you meant to share",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "the amount",
            cells: [
              {
                text: "the exact figure, forever",
                tone: "bad",
              },
              {
                text: "that a payment happened",
                tone: "good",
              },
            ],
          },
          {
            label: "the counterparty",
            cells: [
              {
                text: "their address, and everything else it ever did",
                tone: "bad",
              },
              {
                text: "nothing about them",
                tone: "good",
              },
            ],
          },
          {
            label: "your payroll",
            cells: [
              {
                text: "every salary, comparable side by side",
                tone: "bad",
              },
              {
                text: "nobody's business",
                tone: "good",
              },
            ],
          },
          {
            label: "your runway",
            cells: [
              {
                text: "your balance, to the stroop",
                tone: "bad",
              },
              {
                text: "nobody's business",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Proof without disclosure

The answer comes from cryptography's strangest gift: the **zero-knowledge proof**.

A ZK proof convinces a verifier that a statement is true — *"this hidden amount is positive, and my hidden balance covers it"* — while revealing **nothing else**: not the amount, not the balance.

The proof is a small blob of math anyone can check cheaply, and checking requires no trust in the prover. If it verifies, the statement holds. Period.

Put such a verifier inside the ledger's rules, and the chain can enforce honesty about numbers it is never allowed to see.`,
    },
    {
      kind: "theory",
      body: `## The realm forges the tools

On-chain verification needs specific heavy math as **host functions** — and Stellar shipped it in layers:

- **CAP-59** brought **BLS12-381** curve operations, enabling **Groth16** proof verification inside Soroban contracts.
- **Protocols 25 and 26** added the **BN254** curve and the **Poseidon hash** — a hash designed to be cheap *inside* ZK circuits.

That second wave is what tipped the scales: it made **private payment systems practical** on Stellar. The primitives are protocol-level, so any contract verifies proofs at native speed — no thousand-fold cost penalty for doing cryptography honestly.`,
    },
    {
      kind: "quiz",
      question: `What does an on-chain ZK verifier learn when it accepts a proof?`,
      options: [
        "Only that the proven statement is true — the hidden values behind it stay hidden",
        "The underlying values, which it checks and then discards",
        "Nothing at all — acceptance is probabilistic marketing",
      ],
      answer: 0,
      explain: `That asymmetry is the entire trick: validity becomes public while data stays private. The ledger can enforce "no one spends what they don't have" without ever reading a balance.`,
    },
    {
      kind: "theory",
      body: `## Confidential Tokens: veiling the amounts

**Confidential Tokens** reached developer preview in **June 2026**, built by **OpenZeppelin and Nethermind**. The design is elegantly unintrusive:

- A **wrapper contract** over any existing **SEP-41** token — USDC through its Stellar Asset Contract, contract-native tokens, anything speaking the standard.
- Wrap your tokens and your **balance and transfer amounts become hidden**, protected by zero-knowledge proofs.
- **Addresses stay public**: the explorer still sees *who* transacted with whom — just not *how much*.

Built for parties who know each other but must keep figures private: payroll, supplier invoices, B2B settlement.`,
    },
    {
      kind: "theory",
      body: `## The veil you did not draw

Here is where people relax too early. You wrapped payroll in a Confidential Token, the amounts went dark, and the problem feels solved.

Watch what an observer still has. One address pays forty addresses. It does so on the first of every month, and again on the fifteenth. Two of those forty stopped receiving in March, and three new ones started in April. One of them receives from your address and from a second company's address.

Nobody learned a single salary — and an observer now knows your headcount, your pay cycle, your attrition, your hiring, and which of your staff moonlight. **The amounts were never the only thing the ledger was saying.**

This is not a flaw in Confidential Tokens; it is the shape of what they promise. A veil covers the field you chose, and every uncovered field goes on speaking — timing, frequency, and above all the **graph** of who touches whom.

Which is exactly why a second, deeper system had to exist.`,
    },
    {
      kind: "fill",
      prompt: `What can a Confidential Token wrap?`,
      file: "veil.txt",
      before: `confidential token  =  ZK wrapper over any  `,
      after: `  token — amounts hidden, addresses public`,
      choices: ["SEP-41", "SEP-24", "SEP-10", "SEP-1"],
      answer: 0,
      explain: `The token interface standard is the hook: anything speaking SEP-41 can be wrapped — including classic assets like USDC through their Stellar Asset Contract. The privacy layer composes with everything you already know.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-protocol-27-1",
      body: `None of this was a library someone published. BLS12-381, BN254, Poseidon — each arrived as a **CAP inside a named protocol release**, which is why a contract verifies a proof at native speed instead of paying a thousandfold penalty to do cryptography honestly. The Campaign's protocol act is where you watch a release actually land.`,
    },
    {
      kind: "theory",
      body: `## The half that sounds impossible

You now have a veil for the numbers. For payroll, invoices, settlement between parties who already know each other, that is the whole requirement — the figures were the secret.

But sometimes the figures are not the secret. Sometimes *who paid whom* is the sensitive part: a donation, a supplier you would rather competitors not learn about, a personal transfer on public rails.

Hiding that is the deeper veil, and it comes with an obvious objection — the one every compliance officer raises in the first minute, and the one worth taking seriously rather than waving away.

**Next:** the second veil, and the answer to that objection.`,
    },
  ],
  testOut: [
    {
      question: `What is the problem with a fully transparent ledger, for a business?`,
      options: [
        "Balances and amounts are public forever, so anyone can derive salaries, margins and supplier terms from ordinary payments",
        "Transactions can be traced back and reversed by observers",
        "Public data makes the ledger slower to query at scale",
      ],
      answer: 0,
    },
    {
      question: `What does a zero-knowledge proof let a verifier conclude?`,
      options: [
        "That a statement about hidden values is true, while learning nothing else about those values",
        "That the prover is a trusted party, verified by a third party",
        "That the hidden values fall inside a range the verifier chose",
      ],
      answer: 0,
    },
    {
      question: `Why did these primitives have to arrive as protocol-level host functions?`,
      options: [
        "So contracts verify proofs at native speed — doing the same maths in contract code would carry a crushing cost penalty",
        "Because contracts are not allowed to perform cryptography",
        "So that only audited contracts can use them",
      ],
      answer: 0,
    },
    {
      question: `A Confidential Token wraps an existing token. What changes, and what does not?`,
      options: [
        "Balances and transfer amounts become hidden; the addresses transacting stay public",
        "Addresses become hidden; the amounts stay public",
        "Both become hidden, which is what makes it confidential",
      ],
      answer: 0,
    },
  ],
};
