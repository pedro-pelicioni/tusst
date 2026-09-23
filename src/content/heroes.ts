// The three playable heroes. Each is a champion card (src/content/campaign.ts)
// re-drawn as a pixel character with 8 forms that follow the player's level
// (src/lib/hero.ts). Art lands in public/v2/overworld/heroes/<id>/ via
// `npm run assets:pixel`; until then every surface draws a stand-in.

// The playable roster. Every champion card in src/content/campaign.ts is a
// character here EXCEPT `stroopbeholder`: the Aberration is the Act VII boss
// (see the boss table in docs/ART-BRIEFS-v2.md), not someone you can be.
export type HeroId =
  | "stroowarrior"
  | "stropillusion"
  | "stroopkeeper"
  | "stroophantom"
  | "strooracle"
  | "astrostroopie"
  | "stroopzipper";

export interface Hero {
  id: HeroId;
  /** champion card id — the painted reference for the pixel forms */
  cardId: string;
  /** 4×2 sheet of the 8 forms, 256px cells */
  sheet: string;
  /** 4×2 sheet of the 8 bust portraits, 256px cells */
  portraits: string;
  /** accent for the HUD + stand-ins */
  color: string;
}

export const HERO_FORMS = 8;

export const HEROES: readonly Hero[] = [
  {
    id: "stroowarrior",
    cardId: "stroowarrior",
    sheet: "/v2/overworld/heroes/stroowarrior/forms.webp",
    portraits: "/v2/overworld/heroes/stroowarrior/portraits.webp",
    color: "#d9b96a",
  },
  {
    id: "stropillusion",
    cardId: "stropillusion",
    sheet: "/v2/overworld/heroes/stropillusion/forms.webp",
    portraits: "/v2/overworld/heroes/stropillusion/portraits.webp",
    color: "#8f7bff",
  },
  {
    id: "stroopkeeper",
    cardId: "stroopkeeper",
    sheet: "/v2/overworld/heroes/stroopkeeper/forms.webp",
    portraits: "/v2/overworld/heroes/stroopkeeper/portraits.webp",
    color: "#45d6c4",
  },
  {
    id: "stroophantom",
    cardId: "stroophantom",
    sheet: "/v2/overworld/heroes/stroophantom/forms.webp",
    portraits: "/v2/overworld/heroes/stroophantom/portraits.webp",
    color: "#8fe3ff",
  },
  {
    id: "strooracle",
    cardId: "strooracle",
    sheet: "/v2/overworld/heroes/strooracle/forms.webp",
    portraits: "/v2/overworld/heroes/strooracle/portraits.webp",
    color: "#c06ae0",
  },
  {
    id: "astrostroopie",
    cardId: "astrostroopie",
    sheet: "/v2/overworld/heroes/astrostroopie/forms.webp",
    portraits: "/v2/overworld/heroes/astrostroopie/portraits.webp",
    color: "#6f8fe0",
  },
  {
    id: "stroopzipper",
    cardId: "stroopzipper",
    sheet: "/v2/overworld/heroes/stroopzipper/forms.webp",
    portraits: "/v2/overworld/heroes/stroopzipper/portraits.webp",
    color: "#f0a742",
  },
];

export const DEFAULT_HERO_ID: HeroId = "stroowarrior";

export function isHeroId(value: unknown): value is HeroId {
  return typeof value === "string" && HEROES.some((h) => h.id === value);
}

/** Never throws — an unknown / missing id falls back to the default hero. */
export function heroById(id: string | null | undefined): Hero {
  return HEROES.find((h) => h.id === id) ?? HEROES[0];
}
