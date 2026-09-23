// The Armory — the cosmetic gold sink.
//
// Gold is the game's hidden currency: it accrues 10 per completed lesson and
// stays invisible until the first one lands (`User.goldRevealed`, see
// src/app/api/submissions/route.ts). Until now it had nothing to buy. This is
// what it buys — 24 cosmetics across three slots the player equips on their
// hero.
//
// Same content-identity rule as lessons, labs and journey concepts: the item
// catalog is PURE TS keyed by `id`, the database only tracks per-user state
// (`ArmoryPiece`). So:
//   * ids are APPEND-ONLY — an id keys the rows that say who owns what, and
//     renaming one orphans a purchase.
//   * `cell` is the item's seat in its slot's 4x2 sprite sheet and is equally
//     frozen: change it and every owner's sword turns into someone else's.
//   * `slot` is frozen for the same reason — ArmoryPiece stores a copy taken at
//     purchase time, so moving an item between slots would leave old rows in
//     the old slot, invisible to the equip swap that is scoped by slot.
//   * prices live here and NOWHERE else, so the server always charges the
//     authoritative number and a client can never name its own price.
//
// Names and flavour text live in i18n (`armory.items.<id>`), exactly like the
// heroes' copy (`overworld.heroes.<id>`) — the catalog itself is language-free.
//
// Art: three 4x2 sheets of 256 px cells under public/v2/armory/, addressed by
// `background-position` through `sheetPosition()` (src/lib/hero.ts), the same
// way hero forms are. Every slot has a stand-in (a runic glyph plate), so this
// ships correct with no art at all — see docs/ART-BRIEFS-v2.md § Armory.

export const ARMORY_SLOTS = ["weapon", "equipment", "mascot"] as const;
export type ArmorySlot = (typeof ARMORY_SLOTS)[number];

export const ARMORY_RARITIES = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
] as const;
export type ArmoryRarity = (typeof ARMORY_RARITIES)[number];

/** Sheet geometry — mirrors the hero sheets so `sheetPosition()` just works. */
export const ARMORY_SHEET = { cols: 4, rows: 2, cell: 256 } as const;
export const ARMORY_SLOT_CELLS = ARMORY_SHEET.cols * ARMORY_SHEET.rows; // 8

/**
 * The catalog's identities, as a type. Spelled out rather than derived so it
 * can be used INSIDE ArmoryItem below (deriving it from ARMORY_ITEMS would be
 * circular) — and so the i18n copy can be typed `Record<ArmoryItemId, ...>`,
 * which turns "added an item, forgot to translate it" from a runtime crash on
 * every locale into a compile error. Append-only, like the ids themselves.
 */
export type ArmoryItemId =
  // weapons
  | "rune-dagger"
  | "iron-shortsword"
  | "trustline-spear"
  | "twin-lumens"
  | "forge-hammer"
  | "soroban-staff"
  | "ledger-scythe"
  | "consensus-greatsword"
  // equipment
  | "patchcloak"
  | "keeper-lantern"
  | "runed-bracers"
  | "sigil-pauldrons"
  | "gem-cuirass"
  | "starweave-cloak"
  | "golden-aegis"
  | "protocol-crown"
  // mascots
  | "ember-wyrmling"
  | "rune-sprite"
  | "lumen-moth"
  | "golem-pup"
  | "frost-drake"
  | "void-beholder"
  | "sky-leviathan"
  | "solar-dragon";

export interface ArmoryItem {
  /** append-only content identity — keys `ArmoryPiece.itemId` */
  id: ArmoryItemId;
  slot: ArmorySlot;
  /** 0-7, seat in the slot sheet (frozen once shipped) */
  cell: number;
  /** gold — the server's only source of truth for what this costs */
  price: number;
  rarity: ArmoryRarity;
}

/** Ring / glow colour per rarity, drawn from the overworld palette. */
export const RARITY_COLOR: Record<ArmoryRarity, string> = {
  common: "#b0a58f",
  uncommon: "#45d6c4", // stellar teal
  rare: "#8f7bff", // periwinkle
  epic: "#d1495b", // crimson
  legendary: "#f4ce7b", // gilded frame-light
};

/**
 * Prices climb with the cell so each slot has a first rung a player can reach
 * after two lessons (20 gold) and a top rung worth the whole campaign.
 * A campaign-only run pays out 390 gold (39 lessons x 10); the Advanced Path
 * adds 870 (87 lessons), so lifetime supply is 1 260 against a 3 445 catalog.
 * Nobody buys all 24 — that is the point of a sink.
 */
export const ARMORY_ITEMS: readonly ArmoryItem[] = [
  // ── weapons ──────────────────────────────────────────────────────────────
  { id: "rune-dagger", slot: "weapon", cell: 0, price: 20, rarity: "common" },
  { id: "iron-shortsword", slot: "weapon", cell: 1, price: 45, rarity: "common" },
  { id: "trustline-spear", slot: "weapon", cell: 2, price: 70, rarity: "uncommon" },
  { id: "twin-lumens", slot: "weapon", cell: 3, price: 100, rarity: "uncommon" },
  { id: "forge-hammer", slot: "weapon", cell: 4, price: 140, rarity: "rare" },
  { id: "soroban-staff", slot: "weapon", cell: 5, price: 185, rarity: "rare" },
  { id: "ledger-scythe", slot: "weapon", cell: 6, price: 240, rarity: "epic" },
  {
    id: "consensus-greatsword",
    slot: "weapon",
    cell: 7,
    price: 320,
    rarity: "legendary",
  },

  // ── equipment ────────────────────────────────────────────────────────────
  { id: "patchcloak", slot: "equipment", cell: 0, price: 20, rarity: "common" },
  { id: "keeper-lantern", slot: "equipment", cell: 1, price: 40, rarity: "common" },
  { id: "runed-bracers", slot: "equipment", cell: 2, price: 65, rarity: "uncommon" },
  {
    id: "sigil-pauldrons",
    slot: "equipment",
    cell: 3,
    price: 95,
    rarity: "uncommon",
  },
  { id: "gem-cuirass", slot: "equipment", cell: 4, price: 135, rarity: "rare" },
  { id: "starweave-cloak", slot: "equipment", cell: 5, price: 180, rarity: "rare" },
  { id: "golden-aegis", slot: "equipment", cell: 6, price: 235, rarity: "epic" },
  {
    id: "protocol-crown",
    slot: "equipment",
    cell: 7,
    price: 320,
    rarity: "legendary",
  },

  // ── mascots ──────────────────────────────────────────────────────────────
  { id: "ember-wyrmling", slot: "mascot", cell: 0, price: 30, rarity: "common" },
  { id: "rune-sprite", slot: "mascot", cell: 1, price: 55, rarity: "common" },
  { id: "lumen-moth", slot: "mascot", cell: 2, price: 80, rarity: "uncommon" },
  { id: "golem-pup", slot: "mascot", cell: 3, price: 110, rarity: "uncommon" },
  { id: "frost-drake", slot: "mascot", cell: 4, price: 150, rarity: "rare" },
  { id: "void-beholder", slot: "mascot", cell: 5, price: 200, rarity: "rare" },
  { id: "sky-leviathan", slot: "mascot", cell: 6, price: 260, rarity: "epic" },
  { id: "solar-dragon", slot: "mascot", cell: 7, price: 350, rarity: "legendary" },
];

/** Sheet served for a slot — one 4x2 webp per slot. */
export function slotSheet(slot: ArmorySlot): string {
  return `/v2/armory/${slot === "mascot" ? "mascots" : slot === "weapon" ? "weapons" : "equipment"}.webp`;
}

export function isArmorySlot(value: unknown): value is ArmorySlot {
  return (
    typeof value === "string" && (ARMORY_SLOTS as readonly string[]).includes(value)
  );
}

export function isArmoryItemId(value: unknown): value is ArmoryItemId {
  return typeof value === "string" && ARMORY_ITEMS.some((i) => i.id === value);
}

/** Never throws — an unknown id is simply absent (a dropped item, a tampered form). */
export function armoryItem(id: string | null | undefined): ArmoryItem | null {
  if (!id) return null;
  return ARMORY_ITEMS.find((i) => i.id === id) ?? null;
}

export function itemsInSlot(slot: ArmorySlot): ArmoryItem[] {
  return ARMORY_ITEMS.filter((i) => i.slot === slot).sort((a, b) => a.cell - b.cell);
}

/** Total gold to own everything — the ceiling the copy quotes. */
export function armoryTotalPrice(): number {
  return ARMORY_ITEMS.reduce((sum, i) => sum + i.price, 0);
}
