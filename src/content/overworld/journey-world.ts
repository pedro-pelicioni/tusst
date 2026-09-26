// The Isle of the Builder — the Journey island. Node positions are keyed by
// chapter slug (registry order decides the mission number), roads follow the
// sand paths painted on public/v2/overworld/journey-island.webp. Author with
// the dev editor (`/journey?edit=1`) and paste the JSON back here.
//
// Free-roam is unchanged: every live chapter is walkable; the roads only
// decide where the hero walks, never what opens.

import type { Point, WorldConfig } from "./types";

export const JOURNEY_POSITIONS: Record<string, Point> = {
  // Level 0 · Shore of Foundations (the beach village, SW)
  "the-book-no-one-can-erase": [38.5, 81],
  "the-key-and-the-seal": [44.5, 81],
  "machines-that-keep-promises": [53, 81],
  // Part I · The Craft Woods (forest + forge, center / NW)
  "think-before-you-forge": [43, 74],
  "the-red-green-rite": [35, 66],
  "borders-of-the-realm": [31, 57],
  "what-the-border-holds": [26, 50],
  "the-clean-keep": [23, 42],
  "the-keeps-own-doors": [26, 31],
  "taming-the-golem": [21, 22],
  "what-catches-it": [33, 27],
  "words-of-power": [44, 58],
  "what-the-golem-sees": [41.5, 49],
  "the-endless-loop": [49, 55],
  "the-hand-on-the-brake": [55, 54],
  "weaving-the-graph": [60, 62],
  "the-skeleton-and-the-organs": [66.5, 74],
  "the-capstone-forging": [57.5, 70],
  // Part II · The Stellar Highlands (mountains + citadel, NE)
  "the-realm-of-stellar": [60, 40],
  "anatomy-of-a-transaction": [64.5, 51],
  "the-fate-of-an-envelope": [66.5, 61],
  "accounts-trust-and-assets": [79.5, 51],
  "the-issuers-side": [81, 60],
  "rivers-of-value": [89, 51],
  "the-crossing": [84, 44],
  "gates-of-the-realm": [61.5, 33.5],
  "the-common-tongue": [62.5, 24],
  "the-living-contracts": [68, 16.5],
  "the-heartbeat-and-the-bill": [72.5, 9],
  "wallets-without-seeds": [76, 22],
  "the-veiled-ledger": [81, 25],
  "the-spine-beneath-the-veil": [87, 18],
  "the-protocols-edge": [90, 13],
};

export const JOURNEY_ROADS: Point[][] = [
  // beach road: pier → the three houses → the crossroads → forest edge
  [[44, 92], [44, 86], [38.5, 81], [44.5, 81], [53, 81], [50, 76], [43, 74]],
  // village climb: crossroads → houses → the NW plateau
  [[43, 74], [35, 66], [31, 57], [26, 50], [23, 42], [26, 31], [21, 22]],
  // plateau bridge: tower → bridge → forest
  [[26, 31], [33, 27], [41.5, 40], [41.5, 49]],
  // forge loop: crossroads → forest path → forge → river bridge
  [[43, 74], [44, 58], [41.5, 49], [49, 55], [55, 54]],
  // lowland road: bridge → temple road / lake → lower bridge
  [[55, 54], [60, 62], [57.5, 70], [66.5, 74], [79.5, 66], [81, 60]],
  // east road: bridge → sawmill → tent → sign → mills
  [[55, 54], [64.5, 51], [66.5, 61], [79.5, 51], [84, 44], [89, 51]],
  [[79.5, 51], [81, 60]],
  // highland path: temple → mountain pass → citadel → rune stones → lighthouse
  [[55, 54], [60, 40], [61.5, 33.5], [62.5, 24], [68, 16.5], [72.5, 9]],
  [[68, 16.5], [76, 22], [81, 25], [87, 18], [90, 13]],
  [[64.5, 51], [60, 40]],
  [[84, 44], [81, 25]],
];

export const JOURNEY_WORLD: WorldConfig = {
  id: "journey",
  image: { src: "/v2/overworld/journey-island.webp", width: 2528, height: 1696 },
  regions: [
    { id: "foundations", pos: [24, 88], tone: "foundations", radius: 16 },
    { id: "craft", pos: [30, 14], tone: "craft", radius: 22 },
    { id: "realm", pos: [80, 34], tone: "realm", radius: 22 },
  ],
  roads: JOURNEY_ROADS,
  nodes: Object.entries(JOURNEY_POSITIONS).map(([id, pos]) => ({
    id,
    kind: "mission" as const,
    pos,
  })),
  start: [44, 91],
};
