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
    estMinutes: 21,
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
      kind: "diagram",
      body: "Follow one payment through the pool, and watch what the explorer keeps:",
      caption:
        "The edges are public by construction. Everything the pool protects happens between them.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "deposit",
            label: "Deposit",
            tone: "gold",
            note: "Visible. The explorer records that this account moved funds into the pool, and how much. Nothing is hidden here — and nothing needs to be.",
          },
          {
            id: "inside",
            label: "Inside the pool",
            tone: "accent",
            note: "Hidden. Transfers between pool members need not surface on-chain at all: no sender, no receiver, no amount. This is the part the veil covers.",
          },
          {
            id: "withdraw",
            label: "Withdrawal",
            tone: "gold",
            note: "Visible again. Someone leaves the pool with a value — but tying THIS exit to THAT entry is exactly what the pool breaks.",
          },
          {
            id: "observer",
            label: "What the observer keeps",
            tone: "neutral",
            note: "Two public edges and a crowd in between. The bigger the pool, the weaker the link between any entry and any exit.",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## The compliance spine

"Private" without limits is a sanctions officer's nightmare, and these designs refuse to go there. SPP combines confidentiality with **compliance safeguards built in**:

- **KYC-gated participation** — joining the pool requires verified identity.
- **Identity-level access controls** — permissions attach to *who you are*, not just which key you hold.
- **Account-level freeze capability** — bad actors can be stopped even inside the veil.

Those three safeguards are enforced by a piece worth knowing by name: the **Association Set Provider (ASP)**. An ASP publishes a *set* of deposits it vouches for — an allow list — or the ones it refuses to vouch for — a deny list. To withdraw, you prove your funds trace back to some deposit inside that set, **without revealing which one**. SPP builds this on a key-based association set, backed by a public key registry so participants can be referenced at all.

Sit with the consequence, because it is the whole trick: **the same withdrawal is private and auditable at once**. Private, because the link to your particular deposit is never published. Auditable, because you could not have withdrawn without proving membership of a vouched-for set. Different ASPs can serve different jurisdictions — and you choose whose blessing you carry.

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
      kind: "theory",
      body: `## Go and look inside one

Everything above is checkable right now, on a pool that actually exists. Nethermind's developer preview is live on testnet, and its read functions answer **without a wallet and without a signature**. You are not a customer of this thing — you are a spectator, and spectating is free.

Open the [Forge](/ide), switch to **Explore**, and pick **SPP privacy pool · XLM** from the known contracts. Then ask it, in this order:

- \`get_policy_flags()\` — how this pool is configured. It answers **2**: blocklist enforced, no allowlist.
- \`get_root()\` — the Merkle root committing to every note ever deposited here. One number standing in for the entire anonymity set.
- \`is_known_root(<that number>)\` — **true**. Now change a single digit and ask again: **false**. You just walked the pool's own ring of remembered roots.
- \`is_spent(<any number>)\` — **false**. This is the nullifier set: the pool's defence against double-spending, and very nearly the only thing a withdrawal publishes about itself.

Read them in order and notice what is *missing*. Not one of those answers contains an address, an amount or a counterparty. The chain is telling you the exact truth and telling you nothing.

**Two warnings, because a contract's spec cannot warn you about itself.** This pool exposes five leftover functions — \`balance\`, \`transfer\`, \`approve\` and friends — that answer politely and mean nothing at all; the Forge marks them *decoy* so they cannot fool you. And the preview's state **archives on 2026-09-02**, after which those reads stop answering until somebody pays to restore them. That is not the Forge failing: it is Soroban state rent, which every contract on this network lives under.`,
    },
    {
      kind: "quiz",
      question: `You call \`get_asp_non_membership_root()\` on the live pool and it answers **0**. What does that actually tell you?`,
      options: [
        "The blocklist is empty — and 0 is the value the contract checks every withdrawal against, so an empty list is an enforced policy, not a missing one",
        "The call failed and fell back to a default: a Merkle root is never legitimately zero",
        "The blocklist is confidential, so the contract returns 0 to anyone who is not an ASP",
      ],
      answer: 0,
      explain: `An empty tree still has a real root, and for this blocklist it is literally 0 — so "nobody is barred" is being actively enforced on every spend rather than left unset. Now try its neighbour: \`get_asp_membership_root()\` answers 2302223575749844940221218608817648865122641281382153518325924961250440546344, an impressive-looking number for a tree that is **also empty**. That one is the empty-tree zero-hash. Reading it as "the allowlist has members" is the easiest mistake in this whole subject, and you just avoided it.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `On the Forge's anvil: a **Confidential Tokens** lab, where you'll wrap a testnet token and watch amounts vanish from the explorer while the transfer still settles honestly. Its card reads *being forged* — this frontier is being hammered as you read.

Notice how young these dates are. Riding tech this fresh means reading the protocol's own pulse — the final chapter shows you how.`,
    },
  ],
};
