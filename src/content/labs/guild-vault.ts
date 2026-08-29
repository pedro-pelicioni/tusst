import type { LabScenario } from "./types";

// Lab — "The Guild Vault". Multisig without a contract: on Stellar, "two
// officers must agree" is an account setting, not code you deploy.
//
// v1 stops at RAISING the bar and proving it on-chain (two signers, med
// threshold 2). Actually co-signing a transaction would need the second
// officer's secret to survive in run state, and `generate-keypair` discards
// it on purpose — so the second signature stays a quiz, not a fake ceremony.

export const guildVault: LabScenario = {
  meta: {
    slug: "guild-vault",
    title: "The Guild Vault",
    tagline: "Multisig thresholds — a treasury that needs two officers.",
    difficulty: "adept",
    estMinutes: 11,
    status: "live",
    emblem: "/v2/labs/emblems/guild-vault.webp",
    glyph: "🏛",
  },
  steps: [
    {
      kind: "narrate",
      id: "intro",
      body: `## One key is a single point of failure

Everything you have signed so far needed exactly one signature: yours. That is fine for a play account and reckless for a treasury — the key that can move everything is also the key that can be stolen, lost, or coerced.

The usual answer on other chains is to deploy a multisig contract. On Stellar you do not deploy anything: **every account already has signers and thresholds**. Raising the bar is a setting.`,
    },
    {
      kind: "action",
      id: "forge-keys",
      title: "The first officer",
      body: `Your own keypair — the account that will become the vault.`,
      cta: "Ready the keys",
      action: { type: "generate-keypair", target: "wallet" },
      successBody: `The vault will be \`{address}\`.`,
    },
    {
      kind: "action",
      id: "fund",
      title: "Fund the vault",
      body: `Signers are subentries, and subentries cost reserve. A vault with no XLM cannot afford a second officer.`,
      cta: "Summon Friendbot",
      action: { type: "friendbot" },
      successBody: `Funded: {balance} XLM.`,
      explorer: "account",
    },
    {
      kind: "narrate",
      id: "weights",
      body: `## Weights, not roles

Stellar has no notion of "admin". It has arithmetic.

Every signer carries a **weight**. Every kind of operation is guarded by one of three **thresholds** — low, medium, high. A transaction is authorised when the weights of its signatures add up to the threshold for the operation it carries.

- **Low** — allow trust, bump sequence.
- **Medium** — payments, offers, almost everything you do daily.
- **High** — changing the signers and thresholds themselves.

Your account right now: one signer (the master key) at weight 1, all thresholds 0. One signature clears everything.`,
    },
    {
      kind: "action",
      id: "second-officer",
      title: "Name the second officer",
      body: `A second keypair. Only its **public** address matters here — the vault needs to know who may co-sign, not their secret.`,
      cta: "Name an officer",
      action: { type: "generate-keypair", target: "state", stateKey: "officer" },
      successBody: `The second officer is \`{companion}\`.

That address is now going to be written into the vault's own ledger entry, alongside yours.`,
    },
    {
      kind: "quiz",
      id: "quiz-threshold",
      question: `You add the officer at weight 1 and set the **medium** threshold to 2. What can your master key do alone from that moment?`,
      options: [
        "Nothing that needs medium — a payment now requires both signatures",
        "Everything, since the master key always overrides thresholds",
        "Only operations it signed before the change",
      ],
      explain: `There is no override. The master key is just a signer with a weight, and if its weight alone does not reach the threshold, its signature alone is not enough. That is the whole safety property — and the whole footgun, which the next step is careful about.`,
      answer: 0,
    },
    {
      kind: "action",
      id: "raise-the-bar",
      title: "Raise the bar",
      body: `One operation does all of it: add the officer at weight 1, keep your master key at weight 1, and set **medium** to 2.

Note what is deliberately left alone: the **high** threshold stays at 0, so you can still undo this arrangement with one signature. Raising high to 2 at the same time as medium is how people lock themselves out of their own vault forever.`,
      cta: "Set the thresholds",
      action: {
        type: "classic-op",
        ops: (ctx) => [
          {
            type: "set-options",
            signer: ctx.state.officer ?? "",
            signerWeight: "1",
            masterWeight: "1",
            medThreshold: "2",
          },
        ],
      },
      successBody: `The vault is sealed.

Two signers, each at weight 1, and a medium threshold of 2. From now on a payment out of this account needs **both** officers — and the ledger enforces it, not your process document.

Open the Forge's **Conta** tab against this address: the signers and thresholds are right there, exactly as the chain sees them.`,
      explorer: "tx",
    },
    {
      kind: "quiz",
      id: "quiz-lockout",
      question: `A guild sets medium **and** high to 3, with three officers at weight 1. One officer loses their key. What is the state of that vault?`,
      options: [
        "Permanently frozen — changing the signers needs high, and high can no longer be reached",
        "Fine: the remaining two can vote out the lost key",
        "Fine: the master key can always reset the signers",
      ],
      explain: `This is the single most common way real treasuries die. The rule that protects you from theft protects the thief's absence just as well. Always keep a recovery path whose threshold you can still reach.`,
      answer: 0,
    },
    {
      kind: "checkpoint",
      id: "claim-xp",
      body: `You turned an ordinary account into a two-of-two treasury without deploying a line of code.

The server is about to read this account from the chain and check for itself: at least two signers, medium threshold at least 2.`,
    },
  ],
  verify: [
    { check: "account-exists" },
    { check: "account-thresholds", minSigners: 2, minMedThreshold: 2 },
  ],
};
