import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { getActsLocalized, getCardsLocalized } from "@/content/i18n";
import { HEROES, isHeroId, type HeroId } from "@/content/heroes";
import { getLocale, getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { sheetPosition } from "@/lib/hero";
import { ChampionCard } from "@/components/ChampionCard";
import { hasV2Asset } from "@/components/scene/SceneArt";

// The cast. This used to be a card binder — one collectible per campaign
// section — but the same eight faces are now the characters you actually play,
// so the page leads with who they are and what they become: the painted
// portrait, the role, and the eight-form ladder their pixel sheet carries.
//
// Seven are playable. `stroopbeholder` is not: the Aberration is the Act VII
// boss, so it keeps its entry here and is labelled as something you fight.

export async function generateMetadata() {
  const m = await getMessages();
  return {
    title: m.pages.cards.metaTitle,
    description: m.pages.cards.metaDescription,
  };
}

// All portraits are frameless art; the ChampionCard component draws the frame.
// Add a card id here only if its image file already includes a painted frame.
const FULL_ART = new Set<string>([]);

export default async function CharactersPage() {
  const publicCards = path.join(process.cwd(), "public", "cards");
  const locale = await getLocale();
  const m = await getMessages();
  const cards = getCardsLocalized(locale);
  const acts = getActsLocalized(locale);
  const t = m.pages.cards;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        {t.kicker}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-wide">
        {t.title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted2">{t.intro}</p>

      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {cards.map((card) => {
          const act = acts.find((a) => a.cardId === card.id);
          const hasImage = fs.existsSync(
            path.join(publicCards, path.basename(card.image)),
          );
          // Playable when the id is in the hero roster — which is exactly how
          // the rest of the app decides, so this page can never disagree with
          // the picker at /hero.
          const hero = isHeroId(card.id)
            ? HEROES.find((h) => h.id === (card.id as HeroId))
            : undefined;
          const copy = hero ? m.overworld.heroes[hero.id] : null;
          const portraits =
            hero && hasV2Asset(hero.portraits) ? hero.portraits : null;

          return (
            <div key={card.id}>
              <ChampionCard
                card={card}
                fullArt={FULL_ART.has(card.id)}
                hasImage={hasImage}
              />

              <div className="mt-3 text-center">
                <p className="font-mono text-[11px] uppercase tracking-wider text-fg">
                  {card.name}
                </p>

                {copy ? (
                  <p
                    className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em]"
                    style={{ color: hero?.color }}
                  >
                    {copy.role}
                  </p>
                ) : (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ow-crimson">
                    {t.bossCard}
                  </p>
                )}

                {/* the eight-form ladder — the whole point of a character */}
                {hero && copy && (
                  <>
                    <div
                      className="mt-2 flex items-end justify-center gap-[3px]"
                      title={copy.forms.map((f, i) => `${i + 1}. ${f}`).join("\n")}
                    >
                      {Array.from({ length: 8 }, (_, cell) =>
                        portraits ? (
                          <span
                            key={cell}
                            aria-hidden
                            className="block h-6 w-6 shrink-0"
                            style={{
                              backgroundImage: `url(${portraits})`,
                              backgroundPosition: sheetPosition(cell),
                              backgroundSize: "400% 200%",
                              backgroundRepeat: "no-repeat",
                              imageRendering: "pixelated",
                            }}
                          />
                        ) : (
                          <span
                            key={cell}
                            aria-hidden
                            className="block h-1.5 w-1.5 shrink-0 rounded-[1px]"
                            style={{
                              background: hero.color,
                              opacity: 0.25 + (cell / 7) * 0.75,
                            }}
                          />
                        ),
                      )}
                    </div>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      {t.formsLabel} · {copy.forms[0]} → {copy.forms[7]}
                    </p>
                    <Link
                      href="/hero?callbackUrl=%2Fcards"
                      className="mt-2 inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent transition hover:bg-accent/20"
                    >
                      {t.playCta}
                    </Link>
                  </>
                )}

                {!hero && (
                  <p className="mt-2 font-mono text-[10px] text-muted">{t.bossNote}</p>
                )}

                <p className="mt-2 font-mono text-[10px] text-muted">
                  {act ? (
                    <Link
                      href={`/tracks/${act.trackSlug}`}
                      className="text-accent/80 hover:underline"
                    >
                      {fmt(t.actLink, { numeral: act.numeral, title: act.title })}
                    </Link>
                  ) : (
                    t.unassigned
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-12 max-w-2xl font-mono text-[11px] leading-relaxed text-muted">
        {t.footnote}
      </p>
    </div>
  );
}
