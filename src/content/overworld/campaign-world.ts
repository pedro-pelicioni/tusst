// The Rusted Isle — the Rust campaign as one long road. Eight fortresses are
// hand-placed on the fortresses painted in public/v2/overworld/
// campaign-island.webp; the 39 skirmish waypoints are DERIVED, spread evenly
// along the road between the previous fortress (or the beach) and the act's
// own fortress — Mario World style: levels first, the castle at the end.
//
// Gating stays byte-compatible with the rail: the page decides what is
// locked from src/lib/unlock.ts; this file only knows where things are.

import { acts } from "@/content/campaign";
import { spreadAlong } from "@/lib/overworld/graph";
import type { Point, WorldConfig, WorldNode } from "./types";

export const CAMPAIGN_IMAGE = { src: "/v2/overworld/campaign-island.webp", width: 2528, height: 1696 };
const ASPECT = CAMPAIGN_IMAGE.width / CAMPAIGN_IMAGE.height;

/** landing beach — where a fresh hero stands */
export const CAMPAIGN_START: Point = [30, 88];

/** fortress per act, in act order, keyed by track slug */
export const FORTRESS_POSITIONS: Record<string, Point> = {
  "rust-fundamentals": [34.5, 64],
  "control-flow": [45.5, 52],
  "rust-standard-library": [57, 59.5],
  "mastering-option": [66.5, 52],
  "mastering-result": [62, 40],
  "stellar-101": [47, 30],
  "soroban-smart-contracts": [58, 21.6],
  "stellar-protocol-27": [71, 16.5],
};

/** the one road, beach → summit, through every fortress in order */
export const CAMPAIGN_ROAD: Point[] = [
  CAMPAIGN_START,
  [31, 78],
  ...acts.map((a) => FORTRESS_POSITIONS[a.trackSlug]),
];

export const fortressId = (trackSlug: string) => `act:${trackSlug}`;

function buildNodes(): WorldNode[] {
  const nodes: WorldNode[] = [];
  let prev: Point = CAMPAIGN_START;
  for (const act of acts) {
    const fortress = FORTRESS_POSITIONS[act.trackSlug];
    const spots = spreadAlong(CAMPAIGN_ROAD, prev, fortress, act.skirmishes.length, ASPECT);
    act.skirmishes.forEach((s, i) => {
      nodes.push({ id: s.lessonSlug, kind: "waypoint", pos: spots[i] ?? fortress, region: act.trackSlug });
    });
    nodes.push({ id: fortressId(act.trackSlug), kind: "fortress", pos: fortress, region: act.trackSlug, boss: act.trackSlug });
    prev = fortress;
  }
  return nodes;
}

export const CAMPAIGN_WORLD: WorldConfig = {
  id: "campaign",
  image: CAMPAIGN_IMAGE,
  regions: [{ id: "rust", pos: [22, 92], tone: "rust", radius: 30 }],
  roads: [CAMPAIGN_ROAD],
  nodes: buildNodes(),
  start: CAMPAIGN_START,
};
