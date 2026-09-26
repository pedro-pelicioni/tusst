// Hero form math, shared by the HUD, the map sprite, the picker and the
// battle frame. Forms follow `Character.level` (src/lib/xp.ts): level 1 is
// form 0, level 8+ is the final form — 2 800 XP, roughly the whole game.

import { HERO_FORMS } from "@/content/heroes";
import { progressToNext, xpForLevel } from "@/lib/xp";

export const HERO_SHEET_COLS = 4;
export const HERO_SHEET_ROWS = 2;

/** 0-based form index for a level. */
export function heroForm(level: number): number {
  return Math.max(0, Math.min(HERO_FORMS - 1, Math.floor(level) - 1));
}

/** `background-position` for a cell of a `cols × rows` sheet. */
export function sheetPosition(
  cell: number,
  cols = HERO_SHEET_COLS,
  rows = HERO_SHEET_ROWS,
): string {
  const n = Math.max(0, Math.min(cols * rows - 1, cell));
  const x = cols > 1 ? ((n % cols) * 100) / (cols - 1) : 0;
  const y = rows > 1 ? (Math.floor(n / cols) * 100) / (rows - 1) : 0;
  return `${x}% ${y}%`;
}

/** XP still missing until the NEXT form (0 at the final form). */
export function xpToNextForm(xp: number): number {
  const { level } = progressToNext(xp);
  if (level >= HERO_FORMS) return 0;
  return Math.max(0, xpForLevel(level + 1) - xp);
}
