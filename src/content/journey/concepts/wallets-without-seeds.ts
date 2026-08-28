import type { Concept } from "../types";

// Chapter VII — smart accounts: the signing rule becomes code. Passkeys
// instead of seed phrases, policies instead of prayers, sponsored fees
// instead of "first, go buy XLM". Onboarding that finally feels like Web2.

export const walletsWithoutSeeds: Concept = {
  meta: {
    slug: "wallets-without-seeds",
    title: "Wallets Without Seeds",
    tagline: "Smart accounts, passkeys, and fees someone else sponsors.",
    numeral: "VII",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/wallets-without-seeds.webp",
    glyph: "🛡️",
  },
  steps: [
    {
      kind: "theory",
      body: `## The twenty-four words problem

Traditional wallets greet a new user with a ritual: *write down these 24 words; lose them and your money is gone forever; show them to anyone and it's gone faster.*

Real people fail this test constantly — screenshots, drawer notes, backups that never happened. Whole fortunes have evaporated over a lost sticky note. And most users never get that far: **onboarding dies at the seed phrase screen**.

If chain rails are going to carry salaries and groceries, the key ceremony has to disappear. On Stellar it can — because an account doesn't have to *be* a keypair.`,
    },
    {
      kind: "theory",
      body: `## Accounts that are contracts

A classic account authenticates one way: the protocol checks ed25519 signatures against its signer list. Fixed logic, forever.

A **smart account** is different: it *is* a Soroban contract, and when a transaction claims its authority, the protocol calls the contract's \`__check_auth\` function and asks: *"do you accept this?"*

The signing rule becomes **code you wrote**. Verify a different curve. Require two devices above a threshold. Rotate keys after a breach without changing the address. Whatever policy you can express in Rust is now a kind of signature.`,
    },
    {
      kind: "theory",
      body: `## Passkeys: the key you cannot lose

Your phone already contains a vault: the **secure enclave**, hardware that signs with keys that never leave the chip, unlocked by Face ID or a fingerprint. The web standard for this is **WebAuthn** — passkeys — and it speaks the **secp256r1** curve.

Stellar verifies secp256r1 **natively**, so a smart account can accept your phone's enclave as a signer directly: the biometric hardware signs, the chain checks the passkey signature itself.

No seed phrase exists at any point. The "wallet" is the same hardware that already guards your banking app — now signing ledger transactions.`,
    },
    {
      kind: "quiz",
      question: `In a passkey smart wallet, what replaces the seed phrase?`,
      options: [
        "Nothing to memorize — a key born in the device's secure hardware signs, and the chain verifies it natively",
        "A shorter six-word phrase that is easier to remember",
        "The anchor, which holds the seed phrase for you in custody",
      ],
      answer: 0,
      explain: `The private key never leaves the enclave and was never shown to anyone — there is nothing to write down, photograph, or phish. Recovery becomes a policy question (extra signers, a guardian device), not a memory test.`,
    },
    {
      kind: "theory",
      body: `## Policies: signatures with opinions

Once the auth rule is code, a signer can carry **policy**:

- **Spending limits** — the passkey alone approves up to 50 USDC a day; beyond that, a second factor must co-sign.
- **Allowed contracts** — a signer that may *only* talk to your game, never to the DEX.
- **Session keys** — grant a dapp its own limited key for the evening; it expires on its own.

This is what "programmable" actually buys users: guardrails enforced by the ledger, not by a promise in the app's terms of service.`,
    },
    {
      kind: "fill",
      prompt: `Which curve lets the chain verify a phone's secure-enclave signature?`,
      file: "auth-stack.txt",
      before: `Face ID  →  secure enclave signs with  `,
      after: `  →  verified natively on-ledger`,
      choices: ["secp256r1", "secp256k1", "ed25519", "curve25519"],
      answer: 0,
      explain: `ed25519 is classic Stellar's curve and secp256k1 belongs to Bitcoin and Ethereum. WebAuthn hardware speaks secp256r1 (a.k.a. P-256), and the protocol verifies it natively — no clunky in-contract emulation, no cost explosion.`,
    },
    {
      kind: "theory",
      body: `## Fees someone else pays

One wall remains: a brand-new user owns zero XLM, and transactions cost (tiny) fees. Telling them "first, go buy XLM on an exchange" kills the magic.

Stellar's answer is **fee sponsorship**: another account — typically the app's — wraps the user's transaction and **pays its fee**, and can sponsor reserves too. The user's first on-chain action costs them nothing and requires no prior funding.

Passkey plus sponsorship together: tap "create account", glance at Face ID, and you are transacting on a public ledger — no exchange visit, no seed ceremony, no XLM in sight.`,
    },
    {
      kind: "theory",
      body: `## Protocol 27 "Zipper": delegation arrives

Smart accounts are young, and the protocol is actively paving their road. **Protocol 27 — "Zipper"**, live on mainnet since **July 2026**, shipped **CAP-71: authentication delegation** for smart accounts.

Delegation lets one authority hand signing power to another cleanly, at the protocol level — which **streamlines multisig** setups and **cuts transaction costs** for exactly the account patterns this chapter described.

Translation for builders: multi-device wallets, guardian recovery and policy-heavy designs got cheaper and simpler to run. The protocol is leaning *into* smart accounts, not merely tolerating them.`,
    },
    {
      kind: "quiz",
      question: `What did CAP-71 in Protocol 27 "Zipper" change for smart accounts?`,
      options: [
        "Authentication delegation — streamlining multisig and cutting transaction costs",
        "It made all smart-account transactions fee-free forever",
        "It replaced ed25519 with secp256r1 across the whole network",
      ],
      answer: 0,
      explain: `Delegation is plumbing, not fireworks: fewer signatures to haul around, cheaper multi-party auth. Classic ed25519 accounts keep working exactly as before — the two account styles coexist.`,
    },
    {
      kind: "labLink",
      labSlug: "passkey-smart-wallet",
      body: `The Forge is ready: enter **Passkey Smart Wallet**, enroll a real passkey, deploy its smart-account contract to testnet, and answer a fresh WebAuthn challenge with your own device.

When the ledger confirms that the deployed code is the canonical smart-account Wasm, return to the road. It bends somewhere stranger: a ledger where the *amounts themselves* wear a veil.`,
    },
  ],
};
