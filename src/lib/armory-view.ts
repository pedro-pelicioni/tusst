// Server-side builder for the ArmoryView the shop, the profile loadout and
// the hero figure all read. One place folds the TS catalog
// (src/content/armory.ts) together with the player's rows and their purse, so
// every surface agrees on what is owned, what is worn and what is affordable —
// and so a missing sprite sheet shows the stand-in instead of a broken image.
//
// Server-only: `hasV2Asset` touches the filesystem (same reason as
// src/lib/hero-view.ts).

import { hasV2Asset } from "@/components/scene/SceneArt";
import {
  ARMORY_ITEMS,
  ARMORY_SLOTS,
  RARITY_COLOR,
  itemsInSlot,
  slotSheet,
  type ArmoryItem,
  type ArmorySlot,
} from "@/content/armory";

export interface ArmoryItemView extends ArmoryItem {
  /** rarity ring colour */
  color: string;
  owned: boolean;
  equipped: boolean;
  /** owned items are always "affordable" — nothing left to pay */
  affordable: boolean;
  /** gold still missing (0 when owned or affordable) */
  missing: number;
}

export interface ArmorySlotView {
  slot: ArmorySlot;
  /** null until the master lands — the card falls back to a runic plate */
  sheet: string | null;
  items: ArmoryItemView[];
  equipped: ArmoryItemView | null;
  ownedCount: number;
}

export interface ArmoryView {
  gold: number;
  slots: ArmorySlotView[];
  ownedCount: number;
  totalCount: number;
}

/** What the page hands in: the player's purse and their ArmoryPiece rows. */
export interface BuildArmoryViewInput {
  gold: number;
  pieces: readonly { itemId: string; equipped: boolean }[];
}

export function buildArmoryView(input: BuildArmoryViewInput): ArmoryView {
  const gold = Math.max(0, Math.floor(input.gold || 0));
  const owned = new Map(input.pieces.map((p) => [p.itemId, p.equipped]));

  const slots = ARMORY_SLOTS.map((slot): ArmorySlotView => {
    const items = itemsInSlot(slot).map((item): ArmoryItemView => {
      const isOwned = owned.has(item.id);
      return {
        ...item,
        color: RARITY_COLOR[item.rarity],
        owned: isOwned,
        equipped: owned.get(item.id) === true,
        affordable: isOwned || gold >= item.price,
        missing: isOwned ? 0 : Math.max(0, item.price - gold),
      };
    });
    const sheetPath = slotSheet(slot);
    return {
      slot,
      sheet: hasV2Asset(sheetPath) ? sheetPath : null,
      items,
      equipped: items.find((i) => i.equipped) ?? null,
      ownedCount: items.filter((i) => i.owned).length,
    };
  });

  return {
    gold,
    slots,
    ownedCount: slots.reduce((n, s) => n + s.ownedCount, 0),
    totalCount: ARMORY_ITEMS.length,
  };
}

/** The three equipped pieces, for surfaces that draw the loadout only. */
export function equippedOf(view: ArmoryView): ArmoryItemView[] {
  return view.slots.map((s) => s.equipped).filter((i): i is ArmoryItemView => !!i);
}
