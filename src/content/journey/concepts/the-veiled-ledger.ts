import type { Concept } from "../types";

// Chapter VIII — privacy lands on the public ledger: the ZK host-function
// groundwork, Confidential Tokens (amounts veiled, addresses public), and
// Stellar Private Payments' shared pool — all with a compliance spine.
// Frontier tech: the dates and specifics here matter.

export const theVeiledLedger: Concept = {
  meta: {
    slug: "the-veiled-ledger",
    title: "The Veiled Ledger",
    tagline: "Confidential tokens, private payments — privacy with a compliance spine.",
    numeral: "VIII",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 14,
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
      body: `## Stellar Private Payments: veiling the counterparties

One veil deeper. **Stellar Private Payments (SPP)**, built by **Nethermind**, reached **developer preview on testnet in August 2026**.

Instead of wrapping a token, users **deposit assets into a shared pool**. Transfers then happen *inside* the pool — and an outside observer can no longer link sender to receiver. Not just the amounts: the **counterparties themselves are hidden**.

Where Confidential Tokens suit parties who know each other, SPP covers cases where *who paid whom* is itself the secret — donations, sensitive vendor relationships, personal finance on public rails.`,
    },
    {
      kind: "theory",
      body: `## The compliance spine

"Private" without limits is a sanctions officer's nightmare, and these designs refuse to go there. SPP combines confidentiality with **compliance safeguards built in**:

- **KYC-gated participation** — joining the pool requires verified identity.
- **Identity-level access controls** — permissions attach to *who you are*, not just which key you hold.
- **Account-level freeze capability** — bad actors can be stopped even inside the veil.

The goal in one line: **privacy for users, not for crime**. Confidential *and* compliant transfers on public rails — that combination, not raw secrecy, is what institutions were waiting for.`,
    },
    {
      kind: "quiz",
      question: `An explorer watches a Confidential Token transfer and an SPP pool transfer. What does it see in each?`,
      options: [
        "CT: the two addresses but not the amount; SPP: not even the counterparties — value moved within the shared pool",
        "Both hide amounts and addresses identically — SPP is just the cheaper one",
        "CT hides the addresses but shows amounts; SPP shows everything to KYC'd viewers",
      ],
      answer: 0,
      explain: `Two layers, two veils. Confidential Tokens hide *how much* between known parties; SPP's shared pool also hides *who*. Pick the layer that matches what your use case must keep quiet.`,
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
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `On the Forge's anvil: a **Confidential Tokens** lab, where you'll wrap a testnet token and watch amounts vanish from the explorer while the transfer still settles honestly. Its card reads *being forged* — this frontier is being hammered as you read.

Notice how young these dates are. Riding tech this fresh means reading the protocol's own pulse — the final chapter shows you how.`,
    },
  ],
};
