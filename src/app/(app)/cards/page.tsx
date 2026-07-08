import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { cards, acts } from "@/content/campaign";
import { ChampionCard } from "@/components/ChampionCard";

export const metadata = {
  title: "Champions of the Realm — TUSST",
  description:
    "The champion cards of the Shattered Constellation. Complete an act's final skirmish to claim its champion.",
};

// All portraits are frameless art; the ChampionCard component draws the frame.
// Add a card id here only if its image file already includes a painted frame.
const FULL_ART = new Set<string>([]);

export default function CardsPage() {
  const publicCards = path.join(process.cwd(), "public", "cards");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        {"// the shattered constellation"}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-wide">
        Champions of the Realm
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted2">
        Seven cards for seven acts, scattered by the Great Panic. Each act of
        the campaign ends with a final skirmish — clear it, and its champion
        joins your collection. The last card is not given. It is taken.
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
                  {card.rarity === "boss" ? "boss card · " : ""}
                  {act ? (
                    <Link
                      href={`/tracks/${act.trackSlug}`}
                      className="text-accent/80 hover:underline"
                    >
                      Act {act.numeral} — {act.title}
                    </Link>
                  ) : (
                    "unassigned"
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-12 max-w-2xl font-mono text-[11px] leading-relaxed text-muted">
        cards are cosmetic progression — they carry no gameplay advantage. rare
        prints are awarded for flawless act completion. on-chain claiming
        arrives with the Soroban capstone.
      </p>
    </div>
  );
}
