// Server-side builder for the HeroView the HUD, the map sprite, the battle
// frame and the victory screen all read. One place turns the persisted
// `Character.heroId` + XP into the hero's level, form, names and (only when
// the art has actually landed) sheet paths — so every surface agrees, and a
// missing master shows the stand-in instead of a broken image.
//
// Server-only: `hasV2Asset` touches the filesystem.

import type { Messages } from "@/i18n/messages";
import type { HeroView } from "@/content/overworld/types";
import { heroById } from "@/content/heroes";
import { hasV2Asset } from "@/components/scene/SceneArt";
import { heroForm } from "@/lib/hero";
import { progressToNext } from "@/lib/xp";

export interface BuildHeroViewInput {
  /** `Character.heroId` — unknown / null falls back to the default hero */
  heroId: string | null | undefined;
  /** the player's display name (User.name) */
  name: string | null | undefined;
  xp: number;
  signedIn: boolean;
  m: Messages["overworld"];
}

const FALLBACK_NAME = "guardian";

export function buildHeroView(input: BuildHeroViewInput): HeroView {
  const hero = heroById(input.heroId);
  const copy = input.m.heroes[hero.id];
  const xp = Math.max(0, Math.floor(input.xp || 0));
  const progress = progressToNext(xp);
  const form = heroForm(progress.level);
  const name = input.name?.trim() || FALLBACK_NAME;

  return {
    id: hero.id,
    name,
    roleName: copy.role,
    level: progress.level,
    xp,
    form,
    formName: copy.forms[form] ?? copy.forms[copy.forms.length - 1] ?? "",
    sheet: hasV2Asset(hero.sheet) ? hero.sheet : null,
    portraits: hasV2Asset(hero.portraits) ? hero.portraits : null,
    signedIn: input.signedIn,
    xpInto: progress.into,
    xpSpan: progress.span,
    percent: progress.percent,
  };
}
