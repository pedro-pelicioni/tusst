import type { Concept } from "../types";

// Chapter V — anchors and SEPs: the regulated gates where bank money
// becomes ledger money and back, and the standards that let any wallet
// talk to any gate. Ends with a full remittance walked end to end.

export const gatesOfTheRealm: Concept = {
  meta: {
    slug: "gates-of-the-realm",
    title: "Gates of the Realm",
    tagline: "Anchors & SEPs — where the ledger meets the real world.",
    numeral: "V",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/gates-of-the-realm.webp",
    glyph: "⛩️",
  },
  steps: [
    {
      kind: "theory",
      body: `## Anchors: the gates

The rivers of the last chapter move *ledger* assets. But your salary sits in a bank. The bridge is an **anchor**: a regulated business that **issues fiat-backed assets** and runs the **on/off ramps**.

Hand an anchor dollars and it pays you equivalent tokens from its issuing account — the exact machinery you learned two chapters ago: an issuer, trustlines, auth flags for compliance. Redeem the tokens and it wires the dollars back.

Every serious fiat asset on Stellar stands behind a gate like this. Anchors are where the ledger touches the ground.`,
    },
    {
      kind: "theory",
      body: `## SEPs: the common tongue

There are many wallets and many anchors. Without standards, each pair would need a custom integration — N×M plumbing, forever.

Stellar's answer is the **SEP**: *Stellar Ecosystem Proposal*. SEPs are public standards defining exactly how wallets, anchors and services speak to each other. Implement a SEP once and your wallet works with **every anchor** that implements it too — deposit flows, authentication, identity, all of it.

This interoperability-first culture is one of Stellar's quiet superpowers: users pick any door, and all the doors share one key shape.`,
    },
    {
      kind: "theory",
      body: `## SEP-1 and SEP-10: identity and proof

Two small standards carry the whole gate:

- **SEP-1** — every serious domain publishes a \`stellar.toml\`: its **on-chain identity card**. Which assets it issues, which accounts are official, where its services live. Wallets read it to tell the real issuer from an impostor with the same asset code.
- **SEP-10** — **web auth**: the anchor sends a *challenge transaction*, you sign it with your account's key and hand it back. Ownership proven, session granted — and the challenge is **never submitted** to the ledger.

Log in with a signature: no password, no email.`,
    },
    {
      kind: "quiz",
      question: `What exactly does SEP-10 web auth prove to an anchor?`,
      options: [
        "That you control the account's secret key — by signing a challenge transaction that never touches the ledger",
        "Your legal identity — SEP-10 performs the KYC check itself",
        "That your account holds enough XLM to pay the anchor's fees",
      ],
      answer: 0,
      explain: `SEP-10 is pure key ownership. Legal identity is a separate standard (SEP-12) that anchors run *after* you're authenticated — signature first, paperwork second.`,
    },
    {
      kind: "theory",
      body: `## The working gates: 24, 31, 41

- **SEP-24** — *interactive* deposit and withdraw. Your wallet opens the anchor's hosted webview; the anchor handles KYC forms and bank details; tokens arrive when the wire clears. The everyday ramp for humans.
- **SEP-31** — cross-border payments between *businesses*: a sending anchor and a receiving anchor settle over Stellar while each handles its local rails.
- **SEP-41** — an old friend: the standard **token interface** for Soroban contracts, the one every Stellar Asset Contract speaks.

Ramps for people, rails for institutions, one token dialect for contracts.`,
    },
    {
      kind: "fill",
      prompt: `Where does a wallet find a domain's identity card?`,
      file: "discovery.txt",
      before: `https://anchor.example/`,
      after: `  →  assets, official accounts, service endpoints`,
      choices: [
        ".well-known/stellar.toml",
        "api/v2/anchor-manifest.json",
        "stellar/config.xml",
        "identity.pdf",
      ],
      answer: 0,
      explain: `SEP-1, the simplest standard of all: one TOML file at a well-known path. Prove you own the domain, list your issuing accounts in the file, and wallets can show "issued by anchor.example" as fact, not vibes.`,
    },
    {
      kind: "theory",
      body: `## A remittance, gate to gate

Watch Ana in Chicago pay her mother in Lisbon:

1. Ana's wallet reads the US anchor's \`stellar.toml\` (SEP-1), authenticates (SEP-10), and opens a deposit (SEP-24). Her dollars become USDC on-ledger.
2. One **path payment** crosses the river: USDC out, EURC delivered — seconds, sub-cent fee.
3. Her mother's wallet withdraws through a European anchor (SEP-24 again). Euros land in her bank account.

Two regulated gates, one atomic river crossing in the middle. The chain never saw a "dollar" — only assets that gates promise to honor.`,
    },
    {
      kind: "quiz",
      question: `In that gate-to-gate remittance, which piece performed the currency conversion?`,
      options: [
        "The path payment — routing USDC to EURC across on-ledger order books and pools",
        "The sending anchor's internal FX desk, off the ledger",
        "A bridge contract that locked USDC and minted EURC",
      ],
      answer: 0,
      explain: `The gates only translate between bank money and ledger assets. The FX itself happens in transit, on public markets, at a price anyone can verify — the piece legacy remittance rails cannot offer.`,
    },
    {
      kind: "theory",
      body: `## Practice gates: testanchor

You don't need a banking license to build against all this. The SDF runs **testanchor** on testnet — a fully working anchor speaking SEP-1, SEP-10 and SEP-24 with play money. Point your wallet code at it and rehearse the entire deposit-and-withdraw dance before a single real dollar is involved.

Gates, rivers, trust — everything so far has been the *classic* realm, machinery baked into the protocol. Next chapter we cross into the part you program yourself: **Soroban**, where contracts are alive and even storage has a heartbeat.`,
    },
  ],
};
