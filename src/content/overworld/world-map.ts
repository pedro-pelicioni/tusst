// The world map at /path: two islands, the harbor and the forge islet, drawn
// over public/v2/overworld/world-map.webp. No hero walks here — the islands
// are doors, positioned in % like every other world.

import type { Point, WorldConfig, WorldHotspot } from "./types";

export const WORLD_MAP_NODES: Record<string, Point> = {
  "island:journey": [23, 50],
  "island:campaign": [77, 47],
  "landmark:forge": [51, 13],
  "landmark:advanced": [47, 88],
};

/**
 * The landmasses, traced off world-map.webp as ellipses. Clicking the art
 * sails there, so the cards are a label rather than the only door — which is
 * what makes the chart usable on a phone, where the cards fall outside the
 * viewport. Wide enough to feel generous, tight enough not to swallow sea.
 */
export const WORLD_MAP_HOTSPOTS: Record<string, WorldHotspot> = {
  "island:journey": { cx: 25, cy: 48, rx: 20, ry: 33 },
  "island:campaign": { cx: 78, cy: 46, rx: 19, ry: 33 },
  "landmark:forge": { cx: 51, cy: 12, rx: 8, ry: 10 },
  "landmark:advanced": { cx: 47, cy: 92, rx: 15, ry: 11 },
};

export const WORLD_MAP: WorldConfig = {
  id: "world",
  image: { src: "/v2/overworld/world-map.webp", width: 2560, height: 1429 },
  regions: [],
  roads: [],
  nodes: [
    {
      id: "island:journey",
      kind: "island",
      pos: WORLD_MAP_NODES["island:journey"],
      hotspot: WORLD_MAP_HOTSPOTS["island:journey"],
    },
    {
      id: "island:campaign",
      kind: "island",
      pos: WORLD_MAP_NODES["island:campaign"],
      hotspot: WORLD_MAP_HOTSPOTS["island:campaign"],
    },
    {
      id: "landmark:forge",
      kind: "landmark",
      pos: WORLD_MAP_NODES["landmark:forge"],
      hotspot: WORLD_MAP_HOTSPOTS["landmark:forge"],
    },
    {
      id: "landmark:advanced",
      kind: "landmark",
      pos: WORLD_MAP_NODES["landmark:advanced"],
      hotspot: WORLD_MAP_HOTSPOTS["landmark:advanced"],
    },
  ],
  start: [50, 50],
};
