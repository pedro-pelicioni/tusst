"use client";

// Hero card fan — three champion cards fanned like a hand in a TCG,
// each with the interactive 3D tilt from <ChampionCard />.

import { ChampionCard } from "./ChampionCard";
import type { ChampionCard as CardData } from "@/content/campaign";

export function CardFan({ cards }: { cards: CardData[] }) {
  const poses = [
    "-rotate-[8deg] -translate-x-[52%] translate-y-3 z-10",
    "z-20 -translate-y-2",
    "rotate-[8deg] translate-x-[52%] translate-y-3 z-10",
  ];
  return (
    <div className="relative mx-auto grid h-full w-full place-items-center">
      <div className="relative h-[300px] w-[190px] sm:h-[340px] sm:w-[215px]">
        {cards.slice(0, 3).map((card, i) => (
          <div
            key={card.id}
            className={`absolute inset-0 transition-transform duration-300 hover:z-30 ${poses[i] ?? ""}`}
          >
            <ChampionCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
