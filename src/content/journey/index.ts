import type { Concept, ConceptArc, ConceptLevel } from "./types";
// ── Level 0 · Foundations — the ground floor, nothing assumed ─────────
import { theBookNoOneCanErase } from "./concepts/the-book-no-one-can-erase";
import { theKeyAndTheSeal } from "./concepts/the-key-and-the-seal";
import { machinesThatKeepPromises } from "./concepts/machines-that-keep-promises";
// ── Arc I · The Craft — engineering in the AI era ─────────────────────
import { thinkBeforeYouForge } from "./concepts/think-before-you-forge";
import { theRedGreenRite } from "./concepts/the-red-green-rite";
import { bordersOfTheRealm } from "./concepts/borders-of-the-realm";
import { whatTheBorderHolds } from "./concepts/what-the-border-holds";
import { theCleanKeep } from "./concepts/the-clean-keep";
import { theKeepsOwnDoors } from "./concepts/the-keeps-own-doors";
import { tamingTheGolem } from "./concepts/taming-the-golem";
import { whatCatchesIt } from "./concepts/what-catches-it";
import { wordsOfPower } from "./concepts/words-of-power";
import { whatTheGolemSees } from "./concepts/what-the-golem-sees";
import { theEndlessLoop } from "./concepts/the-endless-loop";
import { theHandOnTheBrake } from "./concepts/the-hand-on-the-brake";
import { weavingTheGraph } from "./concepts/weaving-the-graph";
import { theSkeletonAndTheOrgans } from "./concepts/the-skeleton-and-the-organs";
// ── Arc II · The Realm — the Stellar ecosystem, end to end ────────────
import { theRealmOfStellar } from "./concepts/the-realm-of-stellar";
import { anatomyOfATransaction } from "./concepts/anatomy-of-a-transaction";
import { theFateOfAnEnvelope } from "./concepts/the-fate-of-an-envelope";
import { accountsTrustAndAssets } from "./concepts/accounts-trust-and-assets";
import { theIssuersSide } from "./concepts/the-issuers-side";
import { riversOfValue } from "./concepts/rivers-of-value";
import { theCrossing } from "./concepts/the-crossing";
import { gatesOfTheRealm } from "./concepts/gates-of-the-realm";
import { theCommonTongue } from "./concepts/the-common-tongue";
import { theLivingContracts } from "./concepts/the-living-contracts";
import { theHeartbeatAndTheBill } from "./concepts/the-heartbeat-and-the-bill";
import { walletsWithoutSeeds } from "./concepts/wallets-without-seeds";
import { theVeiledLedger } from "./concepts/the-veiled-ledger";
import { theSpineBeneathTheVeil } from "./concepts/the-spine-beneath-the-veil";
import { theProtocolsEdge } from "./concepts/the-protocols-edge";

// The Builder's Journey — the essential road, in a ground floor and two arcs:
//   foundations — level 0: what a ledger is, what a key is, what a contract
//           is. No code, no acronyms, nothing assumed. The road's entrance;
//           everything above it used to be the first thing a newcomer saw.
//   craft — the disciplines an AI won't carry for you (specs, TDD, DDD,
//           clean architecture, harness/prompt/loop/graph engineering);
//   realm — the Stellar ecosystem end to end, from SCP to the privacy
//           frontier and the living protocol.
// Positional order inside each arc = display order on the map, and `level`
// (0 → 2) is monotonic along it, so the map reads as a trail. Progression
// stays FREE-ROAM even so: any live concept is playable, `requires` is drawn
// and never enforced, and the map only highlights the recommended next one
// per arc. Nothing here touches the campaign's unlock machinery.

export const JOURNEY_LIVE = true;

// The capstone needs the Phase-C mentor/runner machinery — declared, not
// yet forgeable.
const theCapstoneForging: Concept = {
  meta: {
    slug: "the-capstone-forging",
    title: "Capstone: Spec to Deployed Contract",
    tagline: "Spec + tests + an AI at your side → a deployed contract.",
    numeral: "XV",
    arc: "craft",
    level: 2,
    requires: ["think-before-you-forge", "the-red-green-rite"],
    status: "soon",
    estMinutes: 25,
    sigil: "/v2/journey/sigils/the-capstone-forging.webp",
    glyph: "⚔️",
  },
  steps: [],
};

export const journeyChapters: Concept[] = [
  // foundations
  theBookNoOneCanErase,
  theKeyAndTheSeal,
  machinesThatKeepPromises,
  // craft
  thinkBeforeYouForge,
  theRedGreenRite,
  bordersOfTheRealm,
  whatTheBorderHolds,
  theCleanKeep,
  theKeepsOwnDoors,
  tamingTheGolem,
  whatCatchesIt,
  wordsOfPower,
  whatTheGolemSees,
  theEndlessLoop,
  theHandOnTheBrake,
  weavingTheGraph,
  theSkeletonAndTheOrgans,
  theCapstoneForging,
  // realm
  theRealmOfStellar,
  anatomyOfATransaction,
  theFateOfAnEnvelope,
  accountsTrustAndAssets,
  theIssuersSide,
  riversOfValue,
  theCrossing,
  gatesOfTheRealm,
  theCommonTongue,
  theLivingContracts,
  theHeartbeatAndTheBill,
  walletsWithoutSeeds,
  theVeiledLedger,
  theSpineBeneathTheVeil,
  theProtocolsEdge,
];

export function conceptBySlug(slug: string): Concept | undefined {
  return journeyChapters.find((c) => c.meta.slug === slug);
}

export function chaptersByArc(arc: ConceptArc): Concept[] {
  return journeyChapters.filter((c) => c.meta.arc === arc);
}

/** Map order for the three stretches of the road — level 0 first, always. */
export const JOURNEY_ARCS: ConceptArc[] = ["foundations", "craft", "realm"];

/**
 * The trail's edges, resolved for display: the chapters a given one leans on.
 * Unknown slugs are dropped rather than thrown — content is data, and a
 * dangling edge must never take the map down.
 */
export function prerequisitesOf(
  concept: Concept,
  chapters: Concept[] = journeyChapters,
): Concept[] {
  return (concept.meta.requires ?? [])
    .map((slug) => chapters.find((c) => c.meta.slug === slug))
    .filter((c): c is Concept => Boolean(c));
}

/** Lowest tier the reader has not finished — "you are here" on the trail. */
export function currentLevel(completed: Set<string>): ConceptLevel {
  const levels: ConceptLevel[] = [0, 1, 2];
  return (
    levels.find((level) =>
      journeyChapters.some(
        (c) =>
          c.meta.level === level &&
          c.meta.status === "live" &&
          !completed.has(c.meta.slug),
      ),
    ) ?? 2
  );
}

export function firstLiveConceptSlug(): string {
  return journeyChapters.find((c) => c.meta.status === "live")?.meta.slug ?? "";
}
