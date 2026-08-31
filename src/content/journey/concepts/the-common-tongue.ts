import type { Concept } from "../types";

// Realm VIII — the standards, split out of Gates of the Realm. The previous
// chapter used SEP-1, SEP-10 and SEP-24 in passing on purpose; this one is
// the definition, and the reason the ecosystem is not N×M bespoke plumbing.

export const theCommonTongue: Concept = {
  meta: {
    slug: "the-common-tongue",
    title: "The Common Tongue",
    tagline: "SEPs — implement once, and every gate opens.",
    numeral: "IX",
    arc: "realm",
    level: 2,
    requires: ["gates-of-the-realm"],
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/the-common-tongue.webp",
    glyph: "📜",
  },
  steps: [
    {
      kind: "theory",
      body: `## The arithmetic that forces a standard

Count the integrations. Ten wallets, ten gates, every pair needing its own deposit flow, its own login, its own way of asking for a passport photo: **one hundred bespoke integrations**, and one hundred and twenty-one the moment an eleventh of either shows up.

That is not a hypothetical failure mode. It is what happened to the previous generation of payment plumbing, and it is why sending money abroad has historically meant asking a bank to ask a bank.

There are only two ways out of N×M. One is a monopoly: everybody integrates with the one gate that won, on its terms. The other is a **standard** — a public document that says exactly how any wallet talks to any gate, so both sides build against the document instead of against each other.

Stellar took the second road, and the documents have a name.`,
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
      body: `## The working gates: 24, 31, 41

- **SEP-24** — *interactive* deposit and withdraw. Your wallet opens the anchor's hosted webview; the anchor handles KYC forms and bank details; tokens arrive when the wire clears. The everyday ramp for humans.
- **SEP-31** — cross-border payments between *businesses*: a sending anchor and a receiving anchor settle over Stellar while each handles its local rails.
- **SEP-41** — an old friend: the standard **token interface** for Soroban contracts, the one every Stellar Asset Contract speaks.

Ramps for people, rails for institutions, one token dialect for contracts.`,
    },
    {
      kind: "theory",
      body: `## A standard is not a seal of approval

Here is the confusion worth heading off, because it is the one that costs people money.

A gate that implements SEP-1, SEP-10 and SEP-24 has told you exactly one thing: **its plumbing works**. It publishes a file saying who it claims to be. It can verify a signature. It can run a deposit flow your wallet knows how to open.

It has told you nothing about whether the dollars exist, whether the entity is licensed anywhere, whether custody is segregated, or whether anyone will answer when you try to redeem. Anyone can host a \`stellar.toml\`. The file is a claim of identity, not a certificate of good standing — SEP-1 makes an issuer **identifiable**, which is a precondition for trust and not a substitute for it.

So read the standards for what they are: they make the ecosystem *interoperable*, not *safe*. The first is a protocol problem, solved. The second is diligence, and it stays yours.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## The examiner's trial: choose the tongue

You are building a wallet for a corridor:

> Users in Brazil hold BRL in a bank. They want to send money to family in Portugal, who withdraw euros to a local account. You will integrate with one Brazilian anchor and one Portuguese anchor, neither of which you control.

Write the **integration plan as a sequence of standards**. For each step: which SEP, what it gets you, and what would break if you skipped it. Then name one thing in this corridor that no SEP will solve for you.

Standards and behavior only — no endpoints, no SDK calls, no code.`,
      rubric: `1. Names the standards in a workable order, starting with discovery of who the anchor is before authenticating to it.
2. For each named standard, states concretely what it provides — not merely its number or title.
3. States what would break if at least one of the steps were skipped.
4. Names at least one real problem in the corridor that standards do not solve (FX risk, licensing, liquidity at either gate, KYC rejection, redemption failure…).
5. Standards and behavior only — no endpoint paths, no SDK method names, no code.`,
      minChars: 180,
    },
    {
      kind: "theory",
      body: `## Where the classic realm ends

Take stock of what you can now read: consensus, envelopes, accounts and assets, the markets inside the ledger, the payment that crosses currencies, the gates at either edge, and the standards that let those gates cooperate.

Every one of those is **machinery baked into the protocol**. You configured it, you paid for it, you routed through it — but you never wrote any of it. The rules were already there, decided by people who are not you.

**Next:** the part of the realm you program yourself, where a contract is a thing you deploy and even its storage has a heartbeat.`,
    },
  ],
  testOut: [
    {
      question: `What problem does a SEP exist to solve?`,
      options: [
        "N×M bespoke plumbing — with a public standard, any wallet works with any gate that implements it",
        "Slow settlement between wallets and anchors",
        "The absence of a central registry of approved anchors",
      ],
      answer: 0,
    },
    {
      question: `What exactly does SEP-10 web auth prove to an anchor?`,
      options: [
        "That you control the account's secret key — by signing a challenge transaction that is never submitted to the ledger",
        "Your legal identity, since SEP-10 performs the KYC check itself",
        "That the account holds enough XLM to cover the anchor's fees",
      ],
      answer: 0,
    },
    {
      question: `Where does a wallet find a domain's on-chain identity card?`,
      options: [
        "A stellar.toml at a well-known path on the domain — SEP-1, the simplest standard of all",
        "A registry contract the SDF maintains on mainnet",
        "The issuing account's manage_data entries",
      ],
      answer: 0,
    },
    {
      question: `Which standard is the everyday interactive deposit and withdraw ramp for humans?`,
      options: [
        "SEP-24 — the wallet opens the anchor's hosted flow, which handles KYC and bank details",
        "SEP-31, which settles cross-border payments between businesses",
        "SEP-41, the token interface Soroban contracts speak",
      ],
      answer: 0,
    },
  ],
};
