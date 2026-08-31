import type { Concept } from "../types";

// Realm IV — the account and the trustline: what a ledger entry costs to keep,
// and why holding an asset is something you opt into. Issuance, issuer hygiene
// and the authorization flags are Realm V, because "how do I hold an asset"
// and "how do I create one" are different jobs with different readers.

export const accountsTrustAndAssets: Concept = {
  meta: {
    slug: "accounts-trust-and-assets",
    title: "Accounts, Trust & Assets",
    tagline: "Accounts, reserves & trustlines: why holding an asset is opt-in.",
    numeral: "IV",
    arc: "realm",
    level: 1,
    requires: ["the-fate-of-an-envelope"],
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/accounts-trust-and-assets.webp",
    glyph: "🪙",
  },
  steps: [
    {
      kind: "theory",
      body: `## An account is a ledger entry

Strip the wallet UI away and a Stellar **account** is one row in the replicated ledger: a public key, an XLM balance, a few flags — and the **sequence number** you met while dissecting envelopes (the replay-proof counter).

Rows are not free. Every validator stores every entry, so each entry must lock a **base reserve** of XLM — currently 0.5 XLM, with a fresh account holding at least two (1 XLM) it cannot spend. Delete entries and the reserve comes back.

The reserve is not a fee. It is **rent-by-deposit**: the ledger stays lean because bloat has a price tag.`,
    },
    {
      kind: "theory",
      body: `## Trustlines: assets are opt-in

On many chains, anyone can airdrop junk tokens into your address. On Stellar they cannot: to hold any asset besides XLM, your account must first open a **trustline** to it.

A trustline says: *"I accept asset X from issuer Y, up to this **limit**."* It is created with the \`change_trust\` operation, it is its own ledger entry — so it locks **one base reserve** — and until it exists, payments of that asset to you simply fail.

Opt-in by design: your balance sheet contains only what you agreed to hold.`,
    },
    {
      kind: "diagram",
      body: "An issued asset, and who is allowed to touch it:",
      caption: "The dashed lines are trustlines — opt-in, and reversible. The solid one exists only because both of its ends opted in.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "issuer",
            label: "ISSUER",
            x: 50,
            y: 12,
            tone: "gold",
            shape: "box",
            note: "Brings the asset into existence simply by paying it out. There is no mint and no supply table.",
          },
          {
            id: "ana",
            label: "ANA",
            x: 16,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "Opened a trustline — that opt-in is what lets her hold any of the asset at all.",
          },
          {
            id: "bruno",
            label: "BRUNO",
            x: 50,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "Also opted in, so Ana can pay him. Both ends need a trustline.",
          },
          {
            id: "caio",
            label: "CAIO",
            x: 84,
            y: 45,
            tone: "neutral",
            shape: "box",
            note: "Never opened one. Nobody can send him this asset, however hard they try.",
          },
        ],
        edges: [
          {
            from: "issuer",
            to: "ana",
            label: "trustline",
            style: "dashed",
          },
          {
            from: "issuer",
            to: "bruno",
            style: "dashed",
          },
          {
            from: "ana",
            to: "bruno",
            label: "payment",
            style: "solid",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## The reserve, counted

Abstract rules about reserves become obvious the moment you total one up. Here is an ordinary working account:

- **The account itself** — 2 base reserves.
- **Three trustlines** — USDC, EURC and one anchor's local token: 3 more.
- **One open offer** on the DEX — 1 more.

Six entries at **0.5 XLM each: 3 XLM locked.** If the account holds 3.4 XLM, its spendable balance is 0.4 — and a payment of 1 XLM will fail, with a balance that plainly looks like it should cover it.

That error has a name in every support queue on Stellar: *"I have funds but the payment says underfunded."* The funds are there. They are just not **available**, because availability is total minus reserve, and the reserve grew every time the account agreed to hold something new.

The good news is that none of it is spent. Close the offer and 0.5 XLM comes back. Close a trustline you no longer need and so does another. The reserve is a deposit on ledger space, refunded the moment you stop using it.`,
    },
    {
      kind: "theory",
      body: `## What the opt-in is actually preventing

The trustline feels like friction until you picture the ledger without it.

On a chain where anyone can push a token into any address, your wallet is a public inbox that strangers can write to. Airdropped tokens arrive unasked — some as marketing, some named to impersonate a real asset, some designed so that interacting with them costs you something. Every wallet then needs a filter, every filter needs a list, and every list is somebody's judgement about what you are allowed to see.

Stellar moves that decision one layer down, into the protocol: **an asset cannot land in an account that has not opened a trustline to it.** Nobody can put anything in your account without your prior, explicit, on-ledger consent.

The reserve is what makes that consent honest. Each trustline locks 0.5 XLM, so opening one is a small deliberate act rather than something a script does ten thousand times — and closing it gives the reserve back.

Friction was the point.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `You have already done this with your own hands: the Forge's **Your First Wallet** lab submits \`change_trust\` with your signature on the live testnet — the moment a new asset appeared in your balance was a trustline being born. If you skipped that lab, this is the perfect chapter to go open one for real.`,
    },
    {
      kind: "theory",
      body: `## Holding, and making

You can now read any account on the ledger: what it costs to exist, what each entry adds to that cost, and which assets it has agreed to hold.

Everything so far has been from the holder's side. Turn it around and a different set of questions appears: how does an asset come into existence at all, who is allowed to create one, and — the question every regulated issuer has to answer — can the issuer control who holds it afterwards?

**Next:** the other side of the trustline.`,
    },
  ],
  testOut: [
    {
      question: `What is an account on Stellar, structurally?`,
      options: [
        "A ledger entry with a balance, a sequence number and signers — which costs a minimum reserve to keep existing",
        "A record inside a system contract that the protocol calls into",
        "A public key; the ledger stores nothing until the key is used",
      ],
      answer: 0,
    },
    {
      question: `Why does each additional ledger entry raise an account's minimum balance?`,
      options: [
        "Every entry costs every validator storage, so the reserve prices that ongoing cost — and it is returned when the entry is removed",
        "It is a fee that funds validator operations",
        "It discourages accounts from holding more than one asset",
      ],
      answer: 0,
    },
    {
      question: `Someone sends you an asset you have never heard of. What happens?`,
      options: [
        "The payment fails — an asset cannot land in an account that has not opened a trustline to it",
        "It arrives and appears in your balances until you remove it",
        "It is held by the protocol until you accept or reject it",
      ],
      answer: 0,
    },
    {
      question: `What does opening a trustline actually commit you to?`,
      options: [
        "Locking a reserve, and consenting on-ledger to hold that specific asset from that specific issuer",
        "Trusting the issuer not to freeze your balance",
        "Paying a recurring fee for as long as you hold the asset",
      ],
      answer: 0,
    },
  ],
};
