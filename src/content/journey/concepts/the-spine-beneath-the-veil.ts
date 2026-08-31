import type { Concept } from "../types";

// Realm XII — the deeper veil and, more importantly, the thing that keeps it
// from being a sanctions problem. The Association Set Provider is the piece
// worth carrying out of this chapter: it is what makes "private" and
// "auditable" true of the same withdrawal.

export const theSpineBeneathTheVeil: Concept = {
  meta: {
    slug: "the-spine-beneath-the-veil",
    title: "Private Payments & Compliance",
    tagline: "Private payments & compliance: hiding the counterparties, staying auditable.",
    numeral: "XIV",
    arc: "realm",
    level: 2,
    requires: ["the-veiled-ledger"],
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-spine-beneath-the-veil.webp",
    glyph: "🌫️",
  },
  steps: [
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
      kind: "widget",
      component: "explorer-view",
      body: `The choice between these layers is not about how private you can get. It is about **which field has to go dark**. Switch layers and read the observer's column.`,
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
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `On the Forge's anvil: a **Confidential Tokens** lab, where you'll wrap a testnet token and watch amounts vanish from the explorer while the transfer still settles honestly. Its card reads *being forged* — this frontier is being hammered as you read.

Notice how young these dates are. Riding tech this fresh means reading the protocol's own pulse — the final chapter shows you how.`,
    },
  ],
  testOut: [
    {
      question: `How does an SPP pool hide the counterparties?`,
      options: [
        "Users deposit into a shared pool and transfer inside it, so an observer cannot link a sender to a receiver",
        "Addresses are encrypted and only decryptable by the recipient",
        "Transfers are batched, so many payments share one on-chain record",
      ],
      answer: 0,
    },
    {
      question: `An explorer watches a Confidential Token transfer and an SPP pool transfer. What does it see in each?`,
      options: [
        "CT: the two addresses but not the amount. SPP: not even the counterparties",
        "Both hide amounts and addresses identically; SPP is simply cheaper",
        "CT hides addresses and shows amounts; SPP shows everything to KYC'd viewers",
      ],
      answer: 0,
    },
    {
      question: `What does an Association Set Provider publish, and what do you prove against it?`,
      options: [
        "A set of deposits it vouches for — and you prove your funds trace back to some deposit in that set, without revealing which one",
        "A list of approved recipients, which the pool enforces on every transfer",
        "The decryption keys that let auditors read pool activity",
      ],
      answer: 0,
    },
    {
      question: `How can the same withdrawal be private and auditable at once?`,
      options: [
        "Private because the link to your particular deposit is never published; auditable because you could not withdraw without proving membership of a vouched-for set",
        "Auditors hold a master key that reveals the link when required",
        "It cannot — the design trades one for the other, and SPP chose auditability",
      ],
      answer: 0,
    },
  ],
};
