// The Forge — /labs index (guided labs + free-mode IDE card) and the lab
// player chrome. Step content itself lives in src/content/labs (EN-first).
export const labs = {
  metaTitle: "The Forge — TUSST",
  metaDescription:
    "Guided Stellar labs: big buttons that fund wallets, open trustlines and deploy contracts on the real testnet — while you learn what each press did.",
  kicker: "the forge",
  title: "The Forge Is Open",
  intro:
    "Guided labs where every big button does something real on the testnet — wallets funded, trustlines opened, payments settled — and the copy tells you exactly what just happened on the ledger.",
  liveHeading: "// labs",
  soonHeading: "// being forged",
  freeMode: {
    title: "Free mode — the IDE",
    blurb:
      "The full Soroban workshop in your browser: write Rust, build, deploy to testnet, invoke. No rails, no walls.",
    cta: "Open the IDE",
    badge: "no login · no setup",
  },
  card: {
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "being forged",
    completed: "completed",
    start: "Enter the lab",
    resume: "Resume",
    replay: "Replay",
  },
  difficulty: {
    novice: "novice",
    adept: "adept",
    master: "master",
  },
  sim: {
    propose: "Propose a ledger",
    reset: "Reset the council",
    running: "the council deliberates…",
    closed: "Ledger {n} closed ✓",
    stalled: "{count} seat(s) wait for their council — safety over liveness.",
    halted: "No quorum can form — the network waits rather than fork.",
    hint: "Press propose and watch acceptance ripple. Click a node to strike it down (or raise it back).",
    ledgers: "ledgers closed: {n}",
  },
  player: {
    exit: "Leave the lab",
    wallet: {
      none: "no sigil yet",
      yours: "your sigil",
      copy: "Copy address",
      copied: "Copied",
    },
    phases: {
      prepare: "preparing",
      passkey: "waiting for your passkey",
      queued: "in the forge queue",
      building: "compiling rust → wasm",
      sign: "signing",
      submit: "submitting to the network",
      confirm: "confirming on the ledger",
    },
    viewTx: "See the transaction on the explorer",
    viewAccount: "See your account on the explorer",
    viewContract: "See the smart wallet on the explorer",
    retry: "Strike again",
    errors: {
      testnetBusy: "The testnet spirits are busy — strike again in a moment.",
      walletRequired: "Forge your keys first — step back one screen.",
      missingState: "A previous step was skipped — step back and complete it.",
      forgeCold: "The forge is cold — the runner is unreachable. Try again in a moment.",
      buildFailed: "The compile failed — the runner rejected this contract. Strike again.",
      buildTimeout: "The compile ran out of time — the forge was crowded. Strike again.",
      localWalletRequired:
        "This rite needs the Forge's local testnet key to pay deployment fees — forge it in the previous step.",
      passkeyUnavailable:
        "Passkeys need a secure browser context and WebAuthn support. Open this lab over HTTPS on a passkey-capable device.",
      passkeyMismatch:
        "That passkey belongs to a different smart wallet. Try again and choose the credential you just forged.",
      passkeyFailed:
        "The passkey ceremony did not finish. Approve the device prompt and strike again.",
      smartWalletDeployFailed:
        "The passkey was created, but its smart wallet did not land on testnet. Strike again in a moment.",
      smartWalletFundFailed:
        "The smart wallet landed, but Friendbot could not fund it for the signing trial. Strike again in a moment.",
      passkeyTransactionFailed:
        "The passkey-signed transfer did not land on testnet. Approve the device prompt and strike again.",
    },
    checkpoint: {
      title: "Claim your reward",
      cta: "Read the ledger & claim XP",
      verifying: "consulting the ledger…",
      anonymous:
        "Your run lives in this browser. Sign in and the Forge will verify it on-chain — proof, not promises — and pay out your XP.",
      signIn: "Sign in to claim",
      failed:
        "The ledger disagrees — some deeds are missing: {checks}. Finish the steps above and claim again.",
      checkNames: {
        "account-exists": "a living account",
        trustline: "the USDC trustline",
        "payment-sent": "a sent payment",
        "token-balance-positive": "a token balance on your contract",
        "smart-account-code": "the canonical smart-account contract",
        "smart-account-native-balance": "native XLM in the smart wallet",
      },
    },
    done: {
      kicker: "lab complete",
      xpEarned: "+{xp} xp",
      levelUp: "Level {level} reached!",
      xpTotal: "{xp} xp total",
      already: "Already claimed — the ledger remembers.",
      backToForge: "Back to the Forge",
      openIde: "Keep going in the IDE",
    },
  },
};
