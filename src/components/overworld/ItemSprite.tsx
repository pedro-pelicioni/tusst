// An Armory piece as a sprite-sheet cell, or a gilded rune plate while the
// sheet master hasn't landed. Sibling of <HeroFigure> and deliberately the
// same shape: the caller passes the resolved sheet path (null = not on disk
// yet, decided server-side by buildArmoryView), so this component never
// touches the filesystem and works in both server and client trees.

import { ARMORY_SHEET, type ArmorySlot } from "@/content/armory";
import { sheetPosition } from "@/lib/hero";

export function ItemSprite({
  cell,
  slot,
  sheet,
  color,
  size = 72,
  className = "",
}: {
  /** 0-7 seat in the slot sheet */
  cell: number;
  slot: ArmorySlot;
  /** resolved sheet path, or null while the art is missing */
  sheet: string | null;
  /** rarity colour — tints the stand-in glyph */
  color: string;
  size?: number;
  className?: string;
}) {
  if (sheet) {
    return (
      <span
        className={`ow-item-sprite ${className}`}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${sheet})`,
          backgroundPosition: sheetPosition(cell, ARMORY_SHEET.cols, ARMORY_SHEET.rows),
        }}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={`ow-item-standin ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <SlotGlyph slot={slot} color={color} />
    </span>
  );
}

/** One flat rune per slot — a blade, a shield, an egg. */
function SlotGlyph({ slot, color }: { slot: ArmorySlot; color: string }) {
  if (slot === "weapon") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M17 3 8 12l-2 6 6-2 9-9-4-4Z" />
        <path d="M6 18 3 21" />
      </svg>
    );
  }
  if (slot === "equipment") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M12 3c4 4 5 7 5 10a5 5 0 0 1-10 0c0-3 1-6 5-10Z" />
      <path d="M9 13h6" />
    </svg>
  );
}
