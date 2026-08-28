import type { LabScenario } from "./types";

// Lab 1 — "Your First Wallet". The exact flow the expanded Forge exists for:
// big buttons that perform real testnet interactions while the copy teaches
// what just happened on the ledger. Fully client-signed; completion is
// verified on-chain by /api/labs/complete before any XP is granted.

// Circle's USDC issuer on the Stellar TESTNET (stable across quarterly
// resets — Circle re-establishes it). If the trustline step ever fails with
// op_no_issuer after a reset, this constant is the thing to re-check.
export const USDC_TESTNET = {
  code: "USDC",
  issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
};

export const walletOnboarding: LabScenario = {
  meta: {
    slug: "wallet-onboarding",
    title: "Your First Wallet",
    tagline: "Forge a keypair, wake an account, open a trustline, send gold.",
    difficulty: "novice",
    estMinutes: 8,
    status: "live",
    emblem: "/v2/labs/emblems/wallet-onboarding.webp",
    glyph: "🗝",
  },
  steps: [
    {
      kind: "narrate",
      id: "intro",
      body: `## Every hero needs a sigil

On Stellar, your identity is a **keypair**: a public address you show the world (it starts with \`G\`) and a secret key you guard with your life (it starts with \`S\`).

No form. No email. No permission. You *forge* an identity out of pure math — and in the next few minutes it will hold funds, trust an asset, and pay another account. All of it real, on the **testnet**: Stellar's sparring grounds, where the coins are play coins but the machinery is the same.`,
    },
    {
      kind: "action",
      id: "forge-keys",
      title: "Forge your keys",
      body: `One press of the hammer generates 32 bytes of randomness and derives both keys from it. The secret stays **in your browser** — TUSST never sees it, and no server is involved in anything you sign today.`,
      cta: "Forge the keypair",
      action: { type: "generate-keypair", target: "wallet" },
      successBody: `Your sigil is struck:

\`{address}\`

That address is public — share it freely. The secret key beneath it signs on your behalf; anyone holding it *is* you. On testnet that's fine. On mainnet, guard it like a dragon.`,
    },
    {
      kind: "action",
      id: "friendbot",
      title: "Wake the account",
      body: `Right now your address is just math — **the ledger has never heard of it**. An account only exists once someone funds it past the *base reserve* (a small XLM deposit that pays for its ledger entry).

On testnet, a tireless spirit called **Friendbot** funds anyone who asks.`,
      cta: "Summon Friendbot",
      action: { type: "friendbot" },
      successBody: `Friendbot answered — your account now **exists on the ledger** with {balance} XLM.

Two things were born with it: a **balance** and a **sequence number** that counts every transaction you'll ever sign. Look it up on any explorer — it's public record now.`,
      explorer: "account",
    },
    {
      kind: "quiz",
      id: "quiz-reserve",
      question: `Before Friendbot, sending XLM to your address would have needed a special \`create_account\` operation. Why does Stellar make new accounts hold a **base reserve**?`,
      options: [
        "It pays for the account's permanent entry in the ledger, keeping spam accounts expensive",
        "It is a fee collected by validators as profit",
        "It is insurance refunded by Stellar support if you lose your key",
      ],
      answer: 0,
      explain: `Exactly — every ledger entry (account, trustline, offer) locks a small reserve so the ledger can't be flooded with free junk. Delete the entry, get the reserve back.`,
    },
    {
      kind: "action",
      id: "trustline",
      title: "Open a trustline",
      body: `Your account holds XLM natively — but any other asset must be **invited in**. A *trustline* is you telling the ledger: "I accept USDC issued by Circle, up to this limit."

That's why nobody can airdrop junk tokens at you on Stellar: **no trustline, no tokens**. This transaction is also your first signature.`,
      cta: "Trust USDC",
      action: {
        type: "classic-op",
        ops: () => [{ type: "change-trust", asset: USDC_TESTNET }],
      },
      successBody: `Trustline open — your account can now hold **USDC** (testnet issue by Circle).

Notice what it cost: a tiny fee (~0.00001 XLM) and one more base reserve locked, because a trustline is a new ledger entry. Your sequence number just ticked up, too.`,
      explorer: "tx",
    },
    {
      kind: "action",
      id: "shrine",
      title: "Carve a companion sigil",
      body: `You can't send a payment into the void — you need a **destination**. Let's carve a second address: a small shrine to receive your first offering.

We'll generate it and *throw the secret key into the sea*. The account will exist, hold what you send it, and answer to no one. A monument.`,
      cta: "Carve the sigil",
      action: { type: "generate-keypair", target: "state", stateKey: "companion" },
      successBody: `The shrine's sigil:

\`{companion}\`

It doesn't exist on the ledger yet — same as yours before Friendbot. But this time **you** will be the one bringing it to life.`,
    },
    {
      kind: "action",
      id: "create-companion",
      title: "Raise the shrine",
      body: `A \`create_account\` operation funds a new address past the base reserve — precisely what Friendbot did for you. Now you do it for the shrine, from **your** balance: 100 XLM of testnet gold.`,
      cta: "Raise it (send 100 XLM)",
      action: {
        type: "classic-op",
        ops: (ctx) => [
          {
            type: "create-account",
            destination: ctx.state.companion,
            startingBalance: "100",
          },
        ],
      },
      successBody: `The shrine stands. You just performed the same rite Friendbot performed for you — **accounts create accounts**. That's the whole hierarchy; there is no registrar.`,
      explorer: "tx",
    },
    {
      kind: "action",
      id: "payment",
      title: "Make an offering",
      body: `The classic. A \`payment\` operation moves value from one account to another — settled in ~5 seconds, for a fee of about **0.00001 XLM**. This is the transaction Stellar was built around.`,
      cta: "Send 25 XLM",
      action: {
        type: "classic-op",
        ops: (ctx) => [
          { type: "payment", destination: ctx.state.companion, amount: "25" },
        ],
      },
      successBody: `Offering delivered — 25 XLM, final, irreversible, on public record:

\`{tx}\`

Fee, sequence bump, two balances updated, one ledger close. Five seconds. That's a Stellar payment.`,
      explorer: "tx",
    },
    {
      kind: "quiz",
      id: "quiz-recap",
      question: `Someone wants to send **USDC** to your shrine account. Will it arrive?`,
      options: [
        "No — the shrine never opened a USDC trustline, so the ledger refuses it",
        "Yes — any account can receive any asset",
        "Only if they pay a higher fee",
      ],
      answer: 0,
      explain: `Right. Trustlines are per-account, per-asset. Your main account trusts USDC; the shrine only holds native XLM. And since its secret is at the bottom of the sea, no one can ever open one for it.`,
    },
    {
      kind: "checkpoint",
      id: "claim",
      body: `The ledger remembers everything you just did: an account born, a trustline opened, a payment settled. Present your address, and the Forge will read the chain itself — **proof, not promises** — before it pays out your XP.`,
    },
  ],
  verify: [
    { check: "account-exists" },
    {
      check: "trustline",
      assetCode: USDC_TESTNET.code,
      assetIssuer: USDC_TESTNET.issuer,
    },
    { check: "payment-sent" },
  ],
};
