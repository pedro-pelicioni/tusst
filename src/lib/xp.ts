// XP economy — pure math, safe on server and client.
//
// The ledger (XpEvent) is the source of truth; Character.xp/level are
// denormalized aggregates. Award amounts live here so content, API routes
// and UI all agree on the numbers.

export type XpSource = "lesson" | "lab" | "journey";

export const XP_LESSON = 25;
export const XP_CONCEPT = 30;
export const XP_CONCEPT_EXERCISE = 20;

export const XP_LAB: Record<"novice" | "adept" | "master", number> = {
  novice: 75,
  adept: 100,
  master: 150,
};

/** Cumulative XP required to REACH level `level` (level 1 = 0 xp). */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1); // L2=100, L3=300, L4=600, L5=1000…
}

/** Level for a given XP total (inverse of xpForLevel, floored). */
export function levelFromXp(xp: number): number {
  if (xp <= 0) return 1;
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + xp / 12.5)) / 2));
}

export interface LevelProgress {
  level: number;
  /** xp earned inside the current level */
  into: number;
  /** xp span of the current level */
  span: number;
  /** 0–100 toward the next level */
  percent: number;
}

export function progressToNext(xp: number): LevelProgress {
  const level = levelFromXp(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const span = ceil - floor;
  const into = Math.max(0, xp - floor);
  return {
    level,
    into,
    span,
    percent: Math.min(100, Math.round((into / span) * 100)),
  };
}
