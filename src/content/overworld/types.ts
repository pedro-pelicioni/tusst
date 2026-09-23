// The overworld — serializable world configs and the per-node state the
// server computes for them.
//
// Positions live HERE (keyed by content slug), never on ConceptMeta / Act:
// content stays pure data, `check:i18n` never sees a coordinate, and a map
// can be re-laid-out without touching a chapter. Every coordinate is a
// percentage of the world image (x of width, y of height), the same
// convention the reference implementation used, so a node reads as
// `left:x%; top:y%` on any viewport.

import type { HeroId } from "@/content/heroes";

/** `[x%, y%]` of the world image. */
export type Point = [number, number];

export type WorldId = "journey" | "campaign" | "world";

export interface WorldImage {
  /** public path; the stage falls back to a CSS stand-in when it's missing */
  src: string;
  width: number;
  height: number;
}

export type RegionTone = "foundations" | "craft" | "realm" | "rust" | "sea";

export interface WorldRegion {
  id: string;
  /** label anchor */
  pos: Point;
  tone: RegionTone;
  /** stand-in blob radius in % of width (only used when the art is missing) */
  radius?: number;
}

export type NodeKind = "mission" | "fortress" | "waypoint" | "landmark" | "island";

/**
 * A clickable area of the map art, as an ellipse in % of the image. The
 * world map uses it so a whole island is the button, not just its card —
 * on a phone the cards sit off the cover-sized chart and the art is the
 * only thing the thumb can reach.
 */
export interface WorldHotspot {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface WorldNode {
  /** journey: chapter slug · campaign: `act:<trackSlug>` or lesson slug · world: `island:<id>` / `landmark:<id>` */
  id: string;
  kind: NodeKind;
  pos: Point;
  region?: string;
  /** boss art slot id (public/v2/overworld/bosses/<slot>.webp) */
  boss?: string;
  /** the shape of the landmass itself, when the art is the button */
  hotspot?: WorldHotspot;
}

export interface WorldConfig {
  id: WorldId;
  image: WorldImage;
  regions: WorldRegion[];
  /** road polylines; nodes must sit on (or within ~2% of) a road */
  roads: Point[][];
  nodes: WorldNode[];
  /** where a fresh hero stands */
  start: Point;
}

export type NodeStatus = "done" | "live" | "soon" | "locked";

/** What the server resolves for every node before handing the map to the client. */
export interface NodeState {
  id: string;
  kind: NodeKind;
  /** null when not enterable (soon / locked) */
  href: string | null;
  title: string;
  subtitle?: string;
  /** "01".."33" — display index inside the world */
  number: string;
  numeral?: string;
  level?: 0 | 1 | 2;
  status: NodeStatus;
  recommended: boolean;
  xp: number;
  /**
   * What this node actually grants, when it is not XP. A fortress pays no
   * XP of its own — its reward is the act's champion card — so it carries
   * the card's name here and the quest panel prints that instead of an
   * amount no route would ever credit.
   */
  rewardLabel?: string;
  minutes?: number;
  sigil?: string | null;
  bossArt?: string | null;
  bossName?: string;
  bossLevel?: number;
  /** test-out shortcut, when the chapter carries a bank and isn't done */
  testOutHref?: string | null;
  /** copy for the locked note (campaign only) */
  lockedNote?: string;
  region?: string;
  /** which group (arc / act) the node belongs to, for the badge strip */
  group?: string;
}

/** The player's hero as the HUD, the sprite and the battle frame see it. */
export interface HeroView {
  id: HeroId;
  name: string;
  roleName: string;
  level: number;
  xp: number;
  /** 0..7 */
  form: number;
  formName: string;
  /** null when the master hasn't landed — the sprite draws its stand-in */
  sheet: string | null;
  portraits: string | null;
  signedIn: boolean;
  xpInto: number;
  xpSpan: number;
  percent: number;
}
