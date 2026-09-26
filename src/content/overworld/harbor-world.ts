// The Harbor — the Advanced Path as a port town, drawn over
// public/v2/overworld/harbor-island.webp. Every track owns one street that
// ends at its dock (a landmark painted on the art: the fountain plaza, the
// chapel, the shipyard, the dry dock, the watch tower's road, the fort, the
// lighthouse, the warehouse, the islet, the fish market, the customs house,
// the east pier, the south-west boardwalk). The lessons are DERIVED, spread
// evenly along the street before the dock, the same way the campaign spreads
// its skirmishes before a fortress.
//
// No gates, no story: every lesson is open, a dock only opens its track's
// syllabus. The streets were traced off the painted cobblestone and piers and
// spaced so no two stops sit closer than 3.3 world units — above the hero's
// 3.1 arrival radius, so standing on one lesson never reads as standing on
// its neighbour. `npm run check:overworld` holds that line.
//
// Streets start at a vertex of an earlier street (or of a link) so the road
// graph is one piece; `HARBOR_LINKS` are the cross streets that carry no
// lessons and only shorten the walk.

import { advancedTracks } from "@/content/advanced/curriculum";
import { spreadAlong } from "@/lib/overworld/graph";
import type { Point, WorldConfig, WorldNode } from "./types";

export const HARBOR_IMAGE = { src: "/v2/overworld/harbor-island.webp", width: 2048, height: 1360 };
const ASPECT = HARBOR_IMAGE.width / HARBOR_IMAGE.height;

/** the end of the long central pier — where a fresh hero stands */
export const HARBOR_START: Point = [41.3, 88];

/** each track's street, keyed by track slug; the last point is the dock */
export const HARBOR_STREETS: Record<string, Point[]> = {
  // Rust in depth — the plaza, the west village and the north shore
  "rust-ownership-deep": [[41.3, 88], [41.3, 65], [40.8, 64], [40.8, 59], [38.3, 58.3]],
  "rust-lifetimes": [[38.3, 58.3], [37.2, 60], [36.3, 62.3], [33.4, 62], [29.5, 62.4], [26, 62], [22.8, 61], [21.5, 58], [19.6, 55.5], [19.6, 53.5], [20, 51.4]],
  "rust-traits-generics": [[20, 51.4], [21.8, 53.3], [24, 52.4], [26.3, 50.4], [26.9, 47.6], [26.3, 45.4], [23.7, 43], [23.4, 39.8], [24.2, 38.5], [24.9, 37.1], [24.6, 32.6]],
  "rust-error-handling": [[24.6, 32.6], [27, 32.6], [30.9, 32.6], [32.3, 31.5], [34.3, 30.7], [36.6, 30.8], [38.3, 30.4], [41.3, 28.4]],
  "rust-collections-iterators": [[46.3, 14.2], [46, 17.5], [44.4, 18.5], [44, 20], [44.7, 23.9], [44.7, 27.1], [46.1, 28], [48.4, 30.7], [52.4, 32.9], [53.8, 34.5]],
  // Systems & concurrency — over the bridge, the fort, the lighthouse cape, the warehouse quay
  "rust-smart-pointers": [[53.8, 34.5], [57.2, 34.3], [60, 33.5], [63, 33.6], [66.5, 35.5], [69.5, 36.8], [70.6, 37]],
  "rust-concurrency": [[70.6, 37], [72.7, 36.1], [77.3, 36], [80.5, 35.4], [82, 33], [84, 31], [86.5, 28.6], [88.9, 27.1], [91.4, 23.8]],
  "rust-async-internals": [[80.5, 35.4], [80, 39.8], [78.2, 41.3], [77, 44.5], [77.6, 47.5], [78.9, 50.6], [80.2, 52.4], [82, 52.4], [84.1, 52.1], [86.6, 50.6]],
  "rust-systems-edges": [[86.6, 50.6], [87, 53.2], [87.7, 56.7], [88.4, 60], [89, 64.5], [89.6, 67.6], [89.2, 70], [88.8, 73], [88.2, 76], [87.5, 79], [86.3, 81]],
  // Backend at scale — the fish market, the customs house and the waterfront
  "backend-rpc-services": [[77, 44.5], [75.5, 45.8], [72.5, 45.6], [69.3, 46.4], [67.5, 47.5], [65.5, 50.4], [64.2, 52.6], [64.5, 54.6], [65.8, 55.5], [68.5, 55.2], [70.2, 55]],
  "backend-data-layer": [[47.3, 40.3], [46.9, 46.5], [46, 49.6], [46.6, 52.1], [47.5, 52.3], [49.3, 54.1], [50.5, 54.7], [51.6, 58.4], [52.4, 59.8], [55, 59.8], [57.5, 59.8]],
  "backend-indexers-distsys": [[57.5, 59.8], [56.9, 63], [56.5, 66.5], [56.4, 68.5], [57.5, 70.8], [60.5, 71.2], [61.5, 73], [61.5, 78], [61.5, 85]],
  "backend-production": [[40.8, 64], [38.6, 63.9], [37.9, 64.9], [33.9, 66.5], [30.2, 68.8], [27, 70.5], [23.1, 72.8], [19.3, 72.4]],
};

/** cross streets with no lessons on them — shortcuts between the tracks */
export const HARBOR_LINKS: Point[][] = [
  [[41.3, 28.4], [43, 27.8], [44.7, 27.1]],
  [[53.8, 34.5], [53.4, 38.3], [51.2, 38.4], [47.3, 40.3]],
  [[64.2, 52.6], [63.4, 53.8], [63.7, 57.8], [62.5, 59.9], [60, 60], [57.5, 59.8]],
  [[80.2, 52.4], [81.3, 59.3], [81.3, 62.6], [82.9, 68.2], [86.6, 67.9], [89.6, 67.6]],
  [[38.3, 58.3], [40.5, 57], [43, 56.3], [44.5, 54], [46.6, 52.1]],
  [[46, 49.6], [43, 50], [40, 51], [37.6, 52.4], [34.9, 51.5], [30.2, 52.1], [28.5, 52.7], [26.3, 50.4]],
  [[38.3, 58.3], [37, 56.5], [37.6, 52.4]],
];

export type HarborDistrict = "harborCore" | "harborSystems" | "harborBackend";

/** which district (badge group + region label) a track belongs to */
export const HARBOR_DISTRICT: Record<string, HarborDistrict> = {
  "rust-ownership-deep": "harborCore",
  "rust-lifetimes": "harborCore",
  "rust-traits-generics": "harborCore",
  "rust-error-handling": "harborCore",
  "rust-collections-iterators": "harborCore",
  "rust-smart-pointers": "harborSystems",
  "rust-concurrency": "harborSystems",
  "rust-async-internals": "harborSystems",
  "rust-systems-edges": "harborSystems",
  "backend-rpc-services": "harborBackend",
  "backend-data-layer": "harborBackend",
  "backend-indexers-distsys": "harborBackend",
  "backend-production": "harborBackend",
};

export const HARBOR_DISTRICTS: HarborDistrict[] = ["harborCore", "harborSystems", "harborBackend"];

export const dockId = (trackSlug: string) => `track:${trackSlug}`;

/** the tracks that stand on the map: live ones with a street */
export const harborTracks = () =>
  advancedTracks.filter((t) => t.status === "active" && HARBOR_STREETS[t.slug]);

function buildNodes(): WorldNode[] {
  const nodes: WorldNode[] = [];
  for (const track of harborTracks()) {
    const street = HARBOR_STREETS[track.slug];
    const dock = street[street.length - 1];
    const spots = spreadAlong(street, street[0], dock, track.lessons.length, ASPECT);
    track.lessons.forEach((lesson, i) => {
      nodes.push({ id: lesson.slug, kind: "waypoint", pos: spots[i] ?? dock, region: track.slug });
    });
    nodes.push({ id: dockId(track.slug), kind: "dock", pos: dock, region: track.slug });
  }
  return nodes;
}

export const HARBOR_WORLD: WorldConfig = {
  id: "harbor",
  image: HARBOR_IMAGE,
  regions: [
    { id: "harborCore", pos: [21, 11], tone: "rust", radius: 22 },
    { id: "harborSystems", pos: [80, 9], tone: "realm", radius: 22 },
    { id: "harborBackend", pos: [74, 90], tone: "craft", radius: 20 },
  ],
  roads: [...Object.values(HARBOR_STREETS), ...HARBOR_LINKS],
  nodes: buildNodes(),
  start: HARBOR_START,
};
