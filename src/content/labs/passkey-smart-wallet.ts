import type { LabScenario } from "./types";

// Canonical Protocol 27 testnet artifacts published by stellar/smart-account-kit
// for v0.6.2. The server re-hashes the deployed contract Wasm at claim time, so
// a random C-address cannot masquerade as a completed smart-wallet deployment.
export const PASSKEY_TESTNET = {
  accountWasmHash:
    "1b5f4534a76322da2ad7c745f6900857a6802b0ca79850c35a03561df997785a",
  webauthnVerifierAddress:
    "CC7EKIHQP3TN4CARQDND6CEOY2UXLWWC2X5GHTD5NLAT7BG5GPZIOM3F",
  nativeTokenContract:
    "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
};

export const passkeySmartWallet: LabScenario = {
  meta: {
    slug: "passkey-smart-wallet",
    title: "Passkey Smart Wallet",
    tagline: "A wallet with no seed phrase — your device signs.",
    difficulty: "adept",
    estMinutes: 10,
    status: "live",
    emblem: "/v2/labs/emblems/passkey-smart-wallet.webp",
    glyph: "🛡",
  },
  steps: [
    {
      kind: "narrate",
      id: "intro",
      body: `## The key you never see

A classic Stellar wallet starts with an \`S…\` secret. A **passkey wallet** starts inside the secure hardware of your phone or computer. WebAuthn asks that hardware to create a **secp256r1** key and releases only the public half; Face ID, Touch ID, a PIN, or a security key unlocks each signature.

Today you will enroll a real passkey, deploy a real **smart account contract** to testnet, and answer a fresh authentication challenge with it. No seed phrase will ever be shown — because no seed phrase exists.`,
    },
    {
      kind: "action",
      id: "forge-deployer",
      title: "Prepare the launch account",
      body: `A contract cannot pay the fee for its own birth. The Forge therefore needs a small, ordinary **G-account** to launch it. If you already forged one, it returns; otherwise a fresh testnet-only keypair is created in this browser.

This launch account is **not** a signer of the smart wallet. It pays and salts the deployment — nothing more.`,
      cta: "Prepare the launch account",
      action: { type: "generate-keypair", target: "wallet" },
      successBody: `Launch account ready:

\`{address}\`

Its secret remains in this browser. The passkey you create next will live separately in secure hardware.`,
    },
    {
      kind: "action",
      id: "fund-deployer",
      title: "Fuel the launch",
      body: `Deploying a Soroban contract consumes testnet XLM for the envelope fee and ledger resources. Friendbot funds the launch account; if it already exists, the Forge simply reuses it.`,
      cta: "Fund with Friendbot",
      action: { type: "friendbot" },
      successBody: `{balance} XLM now fuels the launch account. Enough to deploy the smart wallet without a relayer and without giving the launch key any authority over it.`,
      explorer: "account",
    },
    {
      kind: "quiz",
      id: "quiz-secret",
      question: `Where does the private half of a passkey live?`,
      options: [
        "Inside the authenticator's secure hardware; the app receives signatures, never the private key",
        "Encrypted in TUSST's database so the server can sign later",
        "Inside the smart-account contract as public ledger data",
      ],
      answer: 0,
      explain: `Exactly. The browser brokers a challenge to the authenticator. The chain sees a public key and a signature; TUSST never receives private key material.`,
    },
    {
      kind: "action",
      id: "create-passkey-wallet",
      title: "Enroll the passkey & deploy",
      body: `Your device will open its native passkey prompt. After you approve it, the Forge builds a **Protocol 27 smart account** whose default signer is that credential, then the launch account pays the deployment fee directly through RPC.

The account code is the canonical OpenZeppelin-based Wasm published with \`smart-account-kit@0.6.2\`.`,
      cta: "Create passkey & deploy wallet",
      action: {
        type: "passkey-create",
        appName: "TUSST Forge",
        ...PASSKEY_TESTNET,
      },
      successBody: `Your seedless wallet lives on testnet:

\`{contract}\`

The address begins with **C** because the wallet is a contract. Its authorization law points to the passkey you just created — not to the G-account that paid for deployment.`,
      explorer: "contract",
    },
    {
      kind: "quiz",
      id: "quiz-authority",
      question: `The G-account paid to deploy the smart wallet. Can its secret authorize spending from the new C-account?`,
      options: [
        "No — paying for deployment does not make it a signer; the smart account's own auth rules decide",
        "Yes — the fee payer permanently owns every contract it deploys",
        "Only until the next ledger closes",
      ],
      answer: 0,
      explain: `Right. Source account, fee payer, deployer salt, and smart-account signer are separate roles. This wallet's default signer is the WebAuthn credential.`,
    },
    {
      kind: "action",
      id: "authenticate-passkey",
      title: "Let the passkey sign",
      body: `Deployment recorded a public key, but a wallet is only useful if the chain accepts its signatures. The Forge funds the new C-account with testnet XLM, builds a **1 XLM transfer back to your launch account**, and asks the exact credential bound to \`{contract}\` to authorize it.

Approve the device prompt. This time the signature travels on-chain and the smart account's \`__check_auth\` must accept it.`,
      cta: "Sign & send 1 XLM with the passkey",
      action: {
        type: "passkey-connect",
        ...PASSKEY_TESTNET,
      },
      successBody: `The transfer landed. Your secure hardware signed, the WebAuthn verifier checked the secp256r1 proof, and \`__check_auth\` authorized the smart wallet to send **1 XLM**.

That transaction is public proof that the passkey controls \`{contract}\` — not merely that a browser dialog opened.`,
      explorer: "tx",
    },
    {
      kind: "quiz",
      id: "quiz-cap71",
      question: `What did CAP-71 in Protocol 27 make easier for smart accounts?`,
      options: [
        "Delegating authentication cleanly, reducing the weight and cost of multi-signer authorization flows",
        "Turning every classic G-account into a passkey automatically",
        "Removing all transaction fees from the network",
      ],
      answer: 0,
      explain: `Delegation is protocol plumbing: one authority can hand authentication work to another without hauling the old full auth shape through every transaction. It helps smart accounts; it does not erase fees or rewrite classic accounts.`,
    },
    {
      kind: "checkpoint",
      id: "claim",
      body: `The Forge will now inspect testnet itself: the launch G-account must exist, the C-address must resolve to the **canonical Protocol 27 smart-account code**, and that smart wallet must still hold native XLM after its passkey-signed transfer. Only then does the ledger pay the lab's XP.`,
    },
  ],
  verify: [
    { check: "account-exists" },
    {
      check: "smart-account-code",
      wasmHash: PASSKEY_TESTNET.accountWasmHash,
    },
    {
      check: "smart-account-native-balance",
      nativeTokenContract: PASSKEY_TESTNET.nativeTokenContract,
    },
  ],
};
