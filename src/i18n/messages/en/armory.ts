// The Armory — the shop the hidden gold finally opens.
// Item names/flavour are keyed by the ids in src/content/armory.ts, exactly
// like the heroes' copy in overworld.ts. Ids are append-only: never rename a
// key here without renaming it there.

import type { ArmoryItemId } from "@/content/armory";

export const armory = {
  metaTitle: "The Armory — TUSST",
  kicker: "the armory",
  title: "Spend what the lessons paid you",
  intro:
    "Every finished lesson pays 10 gold into your pouch. Here is what it buys — a blade, a piece of gear, a creature at your heel. None of it makes you stronger.",

  // Shown instead of the shop when the currency layer is still hidden.
  locked: {
    title: "The doors are shut",
    body: "The Armory opens after your first finished lesson.",
    cta: "Pick a lesson",
  },

  pouch: "{gold} gold",
  collection: "{owned} of {total} pieces",
  artPending: "Forged, not yet painted — the art for this piece is on its way.",

  slots: {
    weapon: "weapons",
    equipment: "equipment",
    mascot: "mascots",
  },
  slotIntro: {
    weapon: "What your champion holds.",
    equipment: "What your champion wears.",
    mascot: "Who stands at your champion's heel.",
  },
  /** landmark label for the slot tabs — the h1 is a sentence, not a label */
  slotsNav: "Item slots",

  rarity: {
    common: "common",
    uncommon: "uncommon",
    rare: "rare",
    epic: "epic",
    legendary: "legendary",
  },

  buy: "Buy",
  buying: "Paying…",
  equip: "Equip",
  equipping: "Equipping…",
  equipped: "Equipped",
  unequip: "Unequip",
  missing: "{missing} gold short",
  buyAria: "Buy {name} for {price} gold",
  equipAria: "Equip {name}",
  unequipAria: "Unequip {name}",

  loadout: {
    title: "Your loadout",
    empty: "Nothing worn yet. Everything below is unlocked by gold, not by level.",
    slotEmpty: "empty",
    open: "Open the Armory",
  },

  err: {
    funds: "Not enough gold for that one yet. Finish another lesson and come back.",
    locked: "The Armory is not open for you yet — finish a lesson first.",
    "unknown-item": "That piece is not in the catalog.",
  },

  items: {
    // ── weapons ────────────────────────────────────────────────────────────
    "rune-dagger": {
      name: "Rune Dagger",
      detail: "First steel. Small, honest, and sharp enough for a beginning.",
    },
    "iron-shortsword": {
      name: "Iron Shortsword",
      detail: "Nothing borrowed, nothing moved. The blade every squire outgrows.",
    },
    "trustline-spear": {
      name: "Trustline Spear",
      detail: "Reach is trust. It only strikes what has agreed to be struck.",
    },
    "twin-lumens": {
      name: "Twin Lumens",
      detail: "Two blades, one balance. Neither moves without the other.",
    },
    "forge-hammer": {
      name: "Hammer of the Forge",
      detail: "Molten at the seams. What it breaks, it breaks into parts you can name.",
    },
    "soroban-staff": {
      name: "Staff of Soroban",
      detail: "A contract on a stick. Say the words and the world keeps its promise.",
    },
    "ledger-scythe": {
      name: "Ledger Scythe",
      detail: "Its blade is a page. What it reaps, no one can erase.",
    },
    "consensus-greatsword": {
      name: "Consensus Greatsword",
      detail: "Too heavy for one hand. It falls only when the whole realm agrees.",
    },

    // ── equipment ──────────────────────────────────────────────────────────
    patchcloak: {
      name: "Squire's Patchcloak",
      detail: "Warm, ugly, and yours. Every Forgeborn starts in patches.",
    },
    "keeper-lantern": {
      name: "Keeper's Lantern",
      detail: "Holds a light that reads back. Nothing is archived in the dark.",
    },
    "runed-bracers": {
      name: "Runed Bracers",
      detail: "Etched with the rules that catch a slip before it costs you.",
    },
    "sigil-pauldrons": {
      name: "Sigil Pauldrons",
      detail: "Steel that remembers which gates you were let through.",
    },
    "gem-cuirass": {
      name: "Gem Cuirass",
      detail: "One stone at the heart, carrying every state you have held.",
    },
    "starweave-cloak": {
      name: "Starweave Cloak",
      detail: "Woven from the graph itself — the sky shifts when you turn.",
    },
    "golden-aegis": {
      name: "Aegis of the Clean Keep",
      detail: "A shield with no spare parts. Nothing on it is unaccounted for.",
    },
    "protocol-crown": {
      name: "Crown of the Protocol",
      detail: "Glyphs orbit the head that finally learned to read them.",
    },

    // ── mascots ────────────────────────────────────────────────────────────
    "ember-wyrmling": {
      name: "Ember Wyrmling",
      detail: "Hatched in the forge's ash. Chews on your compile errors.",
    },
    "rune-sprite": {
      name: "Rune Sprite",
      detail: "Small, teal and insistent. Points at the line you got wrong.",
    },
    "lumen-moth": {
      name: "Lumen Moth",
      detail: "Follows value the way moths follow light — straight to the payment.",
    },
    "golem-pup": {
      name: "Golem Pup",
      detail: "Stone, runes and no manners. Fetches whatever you allocate.",
    },
    "frost-drake": {
      name: "Frost Drake",
      detail: "Freezes a moment so you can read it. Insufferably smug about it.",
    },
    "void-beholder": {
      name: "Void Beholder",
      detail: "One great eye, many small ones. Sees what the golem sees.",
    },
    "sky-leviathan": {
      name: "Sky Leviathan",
      detail: "A hatchling of cloud and star, already too large for the room.",
    },
    "solar-dragon": {
      name: "Solar Dragon",
      detail: "The last thing the Forge makes. It answers only to a finished hero.",
    },
  } satisfies Record<ArmoryItemId, { name: string; detail: string }>,
};
