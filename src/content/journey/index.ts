import type { Concept } from "./types";
// ── Arc I · The Craft — engineering in the AI era ─────────────────────
import { thinkBeforeYouForge } from "./concepts/think-before-you-forge";
import { theRedGreenRite } from "./concepts/the-red-green-rite";
import { bordersOfTheRealm } from "./concepts/borders-of-the-realm";
import { theCleanKeep } from "./concepts/the-clean-keep";
import { tamingTheGolem } from "./concepts/taming-the-golem";
import { wordsOfPower } from "./concepts/words-of-power";
import { theEndlessLoop } from "./concepts/the-endless-loop";
import { weavingTheGraph } from "./concepts/weaving-the-graph";
// ── Arc II · The Realm — the Stellar ecosystem, end to end ────────────
import { theRealmOfStellar } from "./concepts/the-realm-of-stellar";
import { anatomyOfATransaction } from "./concepts/anatomy-of-a-transaction";
import { accountsTrustAndAssets } from "./concepts/accounts-trust-and-assets";
import { riversOfValue } from "./concepts/rivers-of-value";
import { gatesOfTheRealm } from "./concepts/gates-of-the-realm";
import { theLivingContracts } from "./concepts/the-living-contracts";
import { walletsWithoutSeeds } from "./concepts/wallets-without-seeds";
import { theVeiledLedger } from "./concepts/the-veiled-ledger";
import { theProtocolsEdge } from "./concepts/the-protocols-edge";

// The Builder's Journey — the essential road, in two arcs:
//   craft — the disciplines an AI won't carry for you (specs, TDD, DDD,
//           clean architecture, harness/prompt/loop/graph engineering);
//   realm — the Stellar ecosystem end to end, from SCP to the privacy
//           frontier and the living protocol.
// Positional order inside each arc = display order on the map, but
// progression is FREE-ROAM: any live concept is playable; the map only
// highlights the recommended next one per arc. Nothing here touches the
// campaign's unlock machinery.

export const JOURNEY_LIVE = true;

// The capstone needs the Phase-C mentor/runner machinery — declared, not
// yet forgeable.
const theCapstoneForging: Concept = {
  meta: {
    slug: "the-capstone-forging",
    title: "The Capstone Forging",
    tagline: "Spec + tests + an AI at your side → a deployed contract.",
    numeral: "IX",
    arc: "craft",
    status: "soon",
    estMinutes: 25,
    sigil: "/v2/journey/sigils/the-capstone-forging.webp",
    glyph: "⚔️",
  },
  steps: [],
};

export const journeyChapters: Concept[] = [
  // craft
  thinkBeforeYouForge,
  theRedGreenRite,
  bordersOfTheRealm,
  theCleanKeep,
  tamingTheGolem,
  wordsOfPower,
  theEndlessLoop,
  weavingTheGraph,
  theCapstoneForging,
  // realm
  theRealmOfStellar,
  anatomyOfATransaction,
  accountsTrustAndAssets,
  riversOfValue,
  gatesOfTheRealm,
  theLivingContracts,
  walletsWithoutSeeds,
  theVeiledLedger,
  theProtocolsEdge,
];

export function conceptBySlug(slug: string): Concept | undefined {
  return journeyChapters.find((c) => c.meta.slug === slug);
}

export function chaptersByArc(arc: "craft" | "realm"): Concept[] {
  return journeyChapters.filter((c) => c.meta.arc === arc);
}

export function firstLiveConceptSlug(): string {
  return journeyChapters.find((c) => c.meta.status === "live")?.meta.slug ?? "";
}
