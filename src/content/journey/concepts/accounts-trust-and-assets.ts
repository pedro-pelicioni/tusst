import type { Concept } from "../types";

// Chapter III — the account as a ledger entry, trust as an opt-in, and the
// birth of an asset. Ends at the Stellar Asset Contract: the drawbridge
// between the classic realm and the smart-contract one.

export const accountsTrustAndAssets: Concept = {
  meta: {
    slug: "accounts-trust-and-assets",
    title: "Accounts, Trust & Assets",
    tagline: "Reserves, trustlines, and how any asset is born.",
    numeral: "III",
    arc: "realm",
    level: 1,
    requires: ["anatomy-of-a-transaction"],
    status: "live",
    estMinutes: 13,
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
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `You have already done this with your own hands: the Forge's **Your First Wallet** lab submits \`change_trust\` with your signature on the live testnet — the moment a new asset appeared in your balance was a trustline being born. If you skipped that lab, this is the perfect chapter to go open one for real.`,
    },
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
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `The Campaign's Act VI — **The Constellation Gate** — walks this same ground from Rust: accounts, balances and trustlines queried and forged in code instead of prose. Take the detour when you want your fingers on the ledger entries themselves.

Next on the road: assets in *motion* — payments that cross currencies mid-flight, and an exchange built into the protocol itself.`,
    },
  ],
};
