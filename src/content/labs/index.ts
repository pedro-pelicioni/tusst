import type { LabScenario } from "./types";
import { walletOnboarding } from "./wallet-onboarding";

// The Forge Labs catalog. Order = display order on /labs. A "soon" entry is
// meta-only (empty steps) — it renders as a roadmap card and has no player
// route until it goes live. Adding a lab = one content module + one entry.

const soon = (
  meta: Omit<LabScenario["meta"], "status" | "emblem"> & { emblem?: string },
): LabScenario => ({
  meta: {
    status: "soon",
    emblem: `/v2/labs/emblems/${meta.slug}.webp`,
    ...meta,
  },
  steps: [],
  verify: [],
});

export const labs: LabScenario[] = [
  walletOnboarding,

  soon({
    slug: "oz-token-wizard",
    title: "OpenZeppelin Token Wizard",
    tagline: "Pick extensions, forge real Rust, deploy your own token.",
    difficulty: "adept",
    estMinutes: 15,
    glyph: "⚒",
  }),
  soon({
    slug: "passkey-smart-wallet",
    title: "Passkey Smart Wallet",
    tagline: "A wallet with no seed phrase — your fingerprint signs.",
    difficulty: "adept",
    estMinutes: 10,
    glyph: "🛡",
  }),
  soon({
    slug: "scp-simulator",
    title: "SCP: The Council of Nodes",
    tagline: "Build quorums, watch consensus converge, break it on purpose.",
    difficulty: "novice",
    estMinutes: 10,
    glyph: "🕸",
  }),
  soon({
    slug: "treasure-chest",
    title: "The Treasure Chest",
    tagline: "Lock gold in a claimable balance that opens at midnight.",
    difficulty: "novice",
    estMinutes: 8,
    glyph: "🧰",
  }),
  soon({
    slug: "guild-vault",
    title: "The Guild Vault",
    tagline: "Multisig thresholds — a treasury that needs two officers.",
    difficulty: "adept",
    estMinutes: 12,
    glyph: "🏛",
  }),
  soon({
    slug: "confidential-tokens",
    title: "Confidential Tokens",
    tagline: "What the explorer sees vs. what you see.",
    difficulty: "master",
    estMinutes: 15,
    glyph: "🕯",
  }),
];

export function labBySlug(slug: string): LabScenario | undefined {
  return labs.find((l) => l.meta.slug === slug);
}
