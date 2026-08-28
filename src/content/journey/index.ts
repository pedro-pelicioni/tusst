import type { Concept, ConceptMeta } from "./types";
import { thinkBeforeYouForge } from "./concepts/think-before-you-forge";
import { theRealmOfStellar } from "./concepts/the-realm-of-stellar";
import { anatomyOfATransaction } from "./concepts/anatomy-of-a-transaction";

// The Builder's Journey — the essential road. Positional array = display
// order on the map, but progression is FREE-ROAM: any live concept is
// playable; the map only highlights the recommended next one. Nothing here
// touches the campaign's unlock machinery.

export const JOURNEY_LIVE = true;

const soon = (
  meta: Omit<ConceptMeta, "status" | "sigil">,
): Concept => ({
  meta: { status: "soon", sigil: `/v2/journey/sigils/${meta.numeral}.webp`, ...meta },
  steps: [],
});

export const journeyChapters: Concept[] = [
  thinkBeforeYouForge,
  theRealmOfStellar,
  anatomyOfATransaction,

  soon({
    slug: "the-red-green-rite",
    title: "The Red-Green Rite",
    tagline: "TDD: tests first, forge second — against the real runner.",
    numeral: "IV",
    estMinutes: 15,
    glyph: "🟥",
  }),
  soon({
    slug: "borders-of-the-realm",
    title: "Borders of the Realm",
    tagline: "DDD & bounded contexts, mapped on Stellar's own domain.",
    numeral: "V",
    estMinutes: 15,
    glyph: "🗺",
  }),
  soon({
    slug: "the-clean-keep",
    title: "The Clean Keep",
    tagline: "Clean & hexagonal architecture — where each piece lives.",
    numeral: "VI",
    estMinutes: 15,
    glyph: "🏰",
  }),
  soon({
    slug: "taming-the-golem",
    title: "Taming the Golem",
    tagline: "Harness engineering: context, prompts, loops, graphs, evals.",
    numeral: "VII",
    estMinutes: 18,
    glyph: "🗿",
  }),
  soon({
    slug: "the-capstone-forging",
    title: "The Capstone Forging",
    tagline: "Spec + tests + an AI at your side → a deployed contract.",
    numeral: "VIII",
    estMinutes: 25,
    glyph: "⚔️",
  }),
];

export function conceptBySlug(slug: string): Concept | undefined {
  return journeyChapters.find((c) => c.meta.slug === slug);
}

export function firstLiveConceptSlug(): string {
  return journeyChapters.find((c) => c.meta.status === "live")?.meta.slug ?? "";
}
