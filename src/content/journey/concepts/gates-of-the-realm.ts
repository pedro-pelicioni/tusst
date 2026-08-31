import type { Concept } from "../types";

// Realm VII — the gate as a business: what an anchor actually promises, and
// the shape of a remittance that crosses two of them. The standards those
// gates speak are Realm VIII, so the acronyms appear here in context first
// and get defined immediately after.

export const gatesOfTheRealm: Concept = {
  meta: {
    slug: "gates-of-the-realm",
    title: "Gates of the Realm",
    tagline: "Anchors: where the ledger touches the ground.",
    numeral: "VIII",
    arc: "realm",
    level: 2,
    requires: ["the-crossing"],
    status: "live",
    estMinutes: 11,
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
      body: `## What "backed" is actually promising

The token an anchor issues is not dollars. It is a **claim on a business** — and the whole edifice rests on that business honouring it.

Which means the interesting questions about any fiat asset are not technical:

- **Who is the issuer, legally?** A regulated entity in a jurisdiction, or an anonymous account?
- **Where is the money?** Segregated custody, or the same account that pays their salaries?
- **Who can prove it?** An attestation you can read, or a promise on a landing page?
- **What happens if they stop?** A redemption path that survives the company, or a token that quietly becomes a souvenir?

The ledger is honest about exactly one thing here: it will tell you, precisely and forever, *which account issued this asset*. Everything after that is diligence — which is why an asset code alone means nothing, and \`USDC\` from the wrong issuer is a different asset that happens to share a name.`,
    },
    {
      kind: "quiz",
      question: `A wallet shows a balance of \`USDC\`. What does the asset code alone tell you?`,
      options: [
        "Almost nothing — an asset is a code *plus its issuer*, and anyone may issue a code that reads USDC",
        "That it is the well-known dollar stablecoin, since asset codes are unique on the ledger",
        "That some regulated entity has attested to backing it",
      ],
      answer: 0,
      explain: `This is the single most expensive misreading in the ecosystem, and the protocol is not the one at fault: asset codes were never unique and were never meant to be. The issuer's address is the identity; the code is a label. A wallet that shows you one without the other is showing you a rumour.`,
    },
    {
      kind: "fill",
      prompt: `Complete the thing an asset actually is:`,
      file: "NOTES.md",
      before: `An asset on Stellar is an asset code plus `,
      after: ` — and two assets sharing only the code are two different assets.`,
      choices: [
        "the address of its issuer",
        "the amount in circulation",
        "the anchor's domain name",
        "a registration in the SDF's asset list",
      ],
      answer: 0,
      explain: `The domain comes close and is genuinely useful — it is how an issuer publishes who they are — but it is a claim layered on top. The identity that the protocol itself enforces is the issuing account, and it is the only part nobody can spoof.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `An anchor is a business wrapped around a single technical act: **issuing a token**. You can perform that act yourself. The Forge's **OZ Token Wizard** forges a real token on testnet, with you as its issuer — and what it will not give you is everything that makes an anchor an anchor: the licence, the custody, the audits and the promise to redeem.`,
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
      kind: "diagram",
      body: "Bank money in, bank money out — the ledger only holds the middle:",
      caption: "The two gates never meet. Each one only has to trust the ledger between them.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "in",
            label: "the sending gate",
            note: "An anchor takes real money in and issues a token backed by it.",
            tone: "gold",
          },
          {
            id: "ledger",
            label: "the ledger",
            note: "Five seconds, a fraction of a cent, and no correspondent bank in sight.",
            tone: "accent",
          },
          {
            id: "out",
            label: "the receiving gate",
            note: "Another anchor burns the token and pays out in local money.",
            tone: "gold",
          },
          {
            id: "done",
            label: "cash in hand",
            note: "The recipient never installed a wallet, and never heard the word ledger.",
            tone: "good",
          },
        ],
      },
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
    {
      kind: "theory",
      body: `## The acronyms you just walked past

You saw them in Ana's remittance and probably let them slide: SEP-1, SEP-10, SEP-24. Three standards doing three jobs — *who is this anchor*, *prove you are you*, and *run the deposit*.

They were not incidental. Without them, Ana's wallet would need a bespoke integration with her anchor, her mother's wallet would need another with hers, and every new wallet would start that work from zero. Two gates only cooperated because they had already agreed how to speak.

**Next:** the agreement itself — the standards that let any wallet walk up to any gate.`,
    },
  ],
  testOut: [
    {
      question: `What is an anchor?`,
      options: [
        "A regulated business that issues fiat-backed assets and runs the on- and off-ramps between bank money and the ledger",
        "A protocol feature that converts fiat into ledger assets automatically",
        "A validator that specialises in payment traffic",
      ],
      answer: 0,
    },
    {
      question: `A wallet shows \`USDC\`. What does the asset code alone establish?`,
      options: [
        "Almost nothing — an asset is a code plus its issuer, and any account may issue that code",
        "That it is the well-known dollar stablecoin; codes are unique",
        "That someone has attested to its backing",
      ],
      answer: 0,
    },
    {
      question: `In a gate-to-gate remittance, which piece performs the currency conversion?`,
      options: [
        "The path payment, routing across on-ledger order books and pools at a price anyone can verify",
        "The sending anchor's internal FX desk, off the ledger",
        "A bridge contract that locks one asset and mints the other",
      ],
      answer: 0,
    },
    {
      question: `Why can you build a full anchor integration without a banking licence?`,
      options: [
        "The SDF runs testanchor on testnet — a working anchor with play money to rehearse the whole dance against",
        "Anchors publish their production credentials for development use",
        "You cannot; anchor integration requires a signed agreement first",
      ],
      answer: 0,
    },
  ],
};
