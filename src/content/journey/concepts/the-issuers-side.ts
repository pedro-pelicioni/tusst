import type { Concept } from "../types";

// Realm V — the issuer's side, split out of Accounts, Trust & Assets. Creating
// an asset is a payment from an account that has none; everything that makes
// that safe to run as a business — hygiene, flags, the SAC bridge — follows
// from that one sentence.

export const theIssuersSide: Concept = {
  meta: {
    slug: "the-issuers-side",
    title: "The Issuer's Side",
    tagline: "Asset issuance: anyone can mint — the craft is everything after that.",
    numeral: "V",
    arc: "realm",
    level: 1,
    requires: ["accounts-trust-and-assets"],
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/the-issuers-side.webp",
    glyph: "⚒️",
  },
  steps: [
    {
      kind: "theory",
      body: `## Issuing an asset: just pay it out

There is no "deploy a token" ritual in classic Stellar. An **asset is a pair**: a short code plus the **issuer's address** — \`USDC\` from Circle's account and \`USDC\` from a stranger are different assets.

To issue, the issuer simply **pays** the asset out of its own account to someone holding a trustline. That first payment *is* the mint. Supply is whatever the issuer has paid out and not received back — the ledger tracks it across trustlines automatically.

Any account can issue. Scarcity of trust, not permission, is what makes an asset matter.`,
    },
    {
      kind: "quiz",
      question: `What does it take to bring a brand-new asset into existence on classic Stellar?`,
      options: [
        "The issuer pays it to an account that opened a trustline — the first payment is the mint",
        "Deploy and verify a token contract, then register the ticker with the SDF",
        "Stake XLM proportional to the intended supply",
      ],
      answer: 0,
      explain: `An asset is identified by code + issuer, so it "exists" the moment it first moves. Contracts only enter the story when you want programmable behavior — or the SAC bridge waiting at the end of this chapter.`,
    },
    {
      kind: "theory",
      body: `## Two accounts, one asset: issuer hygiene

Serious issuers split the roles:

- The **issuing account** signs almost nothing. It mints by paying the distribution account, then goes back to sleep — cold keys, minimal attack surface.
- The **distribution account** holds working supply and does the daily traffic: customers, exchanges, hot paths.

If distribution keys leak, you lose a balance — not the printing press. An issuer can go further still: lock the issuing account's signers so *no one* can ever issue again, fixing max supply forever. The ledger itself becomes the audit.`,
    },
    {
      kind: "theory",
      body: `## Authorization flags: issuer as gatekeeper

Real-world assets carry real-world law, so an issuer can set flags on itself:

- **Auth required** — trustlines start unauthorized; the issuer approves each holder (KYC gates).
- **Auth revocable** — the issuer can freeze an authorized trustline, stopping that balance cold.
- **Clawback** — the issuer can pull the asset back entirely (court orders, stolen funds, fat-fingered payouts).

These flags are why regulated institutions can issue on a public ledger at all: compliance is enforced *by the protocol*, not by a promise in a PDF.`,
    },
    {
      kind: "quiz",
      question: `A regulated issuer learns one holder's account was hacked. Which flag lets it stop that balance from moving — right now?`,
      options: [
        "Auth revocable — revoke the trustline's authorization and the balance is frozen in place",
        "Auth required — it retroactively blocks the hacker's earlier deposits",
        "Auth immutable — it locks the whole asset for everyone",
      ],
      answer: 0,
      explain: `Auth required only gates *new* trustlines, and auth immutable just promises the flags will never change. Freezing stops movement; **clawback** goes one step further and pulls the asset back to the issuer.`,
    },
    {
      kind: "fill",
      prompt: `Complete the identity of a classic asset — what makes USDC *the real* USDC?`,
      file: "asset-identity.txt",
      before: `asset  =  asset code  +  `,
      after: `   (same code, different issuer → different asset)`,
      choices: [
        "the issuer's account address",
        "the contract's Wasm hash",
        "a global ticker registry",
        "the anchor's homepage URL",
      ],
      answer: 0,
      explain: `There is no namespace to squat. Wallets resolve which \`USDC\` is real via the issuer's address — and, as you'll see at the Gates of the Realm, that issuer proves itself with a file on its own domain.`,
    },
    {
      kind: "theory",
      body: `## The Stellar Asset Contract

Classic assets and smart contracts share one realm, and the bridge is the **Stellar Asset Contract (SAC)**. Any classic asset — XLM included — can be *summoned* as a contract: one deploy, zero code to write, and the asset now speaks **SEP-41**, the standard Soroban token interface.

Same asset, same supply, one balance sheet — but now contracts can hold it, move it, and build on it. USDC in a lending pool and USDC in grandma's trustline are the *same USDC*.

Every serious Soroban protocol leans on this bridge daily.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `Everything on this page is a decision, not a syntax. The Forge's **OZ Token Wizard** puts you on the issuing side for real on testnet — and the interesting part is not that it works, it is that every choice you make there is one an anchor makes too, with a compliance department attached.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `The Campaign's Act VI — **The Constellation Gate** — walks this same ground from Rust: accounts, balances and trustlines queried and forged in code instead of prose. Take the detour when you want your fingers on the ledger entries themselves.

Next on the road: assets in *motion* — payments that cross currencies mid-flight, and an exchange built into the protocol itself.`,
    },
  ],
  testOut: [
    {
      question: `How is a new asset created on Stellar?`,
      options: [
        "By paying it out — an issuing account simply sends an asset it has never held, and the supply comes into existence",
        "By deploying a token contract that mints it",
        "By registering the asset code with the SDF before first use",
      ],
      answer: 0,
    },
    {
      question: `Why do issuers keep a separate distribution account rather than paying out from the issuing account?`,
      options: [
        "The issuing account's balance is meaningless — supply is what it has paid out — so a distribution account is what makes circulating supply readable and the issuer's keys rarely used",
        "The protocol forbids an issuing account from holding its own asset",
        "It halves the reserve cost of the trustlines involved",
      ],
      answer: 0,
    },
    {
      question: `What do the issuer's authorization flags let it do?`,
      options: [
        "Gate who may hold the asset, and freeze a specific holder's trustline — control the issuer needs to operate under regulation",
        "Reverse individual payments after they settle",
        "Set the price at which the asset trades on the DEX",
      ],
      answer: 0,
    },
    {
      question: `What does the Stellar Asset Contract give a classic asset?`,
      options: [
        "A contract interface, so a classic asset can be used by Soroban contracts as if it were a contract token",
        "A second, contract-based supply that mirrors the classic one",
        "Automatic listing on contract-based AMMs",
      ],
      answer: 0,
    },
  ],
};
