import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { getActsLocalized, getCardsLocalized } from "@/content/i18n";
import { getLocale, getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { ChampionCard } from "@/components/ChampionCard";

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

export default async function CardsPage() {
  const publicCards = path.join(process.cwd(), "public", "cards");
  const locale = await getLocale();
  const m = await getMessages();
  const cards = getCardsLocalized(locale);
  const acts = getActsLocalized(locale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        {m.pages.cards.kicker}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-wide">
        {m.pages.cards.title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted2">
        {m.pages.cards.intro}
      </p>

      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {cards.map((card) => {
          const act = acts.find((a) => a.cardId === card.id);
          const hasImage = fs.existsSync(
            path.join(publicCards, path.basename(card.image)),
          );
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
                <p className="mt-1 font-mono text-[10px] text-muted">
                  {card.rarity === "boss" ? `${m.pages.cards.bossCard} · ` : ""}
                  {act ? (
                    <Link
                      href={`/tracks/${act.trackSlug}`}
                      className="text-accent/80 hover:underline"
                    >
                      {fmt(m.pages.cards.actLink, {
                        numeral: act.numeral,
                        title: act.title,
                      })}
                    </Link>
                  ) : (
                    m.pages.cards.unassigned
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-12 max-w-2xl font-mono text-[11px] leading-relaxed text-muted">
        {m.pages.cards.footnote}
      </p>
    </div>
  );
}
