"use client";

// Interactive TCG-style card (TCG Pocket-inspired): 3D tilt following the
// pointer + holographic sheen. Renders a parchment frame around the portrait
// art, matching the style of the painted card set (see docs/LORE.md §4).

import { useRef, useState } from "react";
import type { ChampionCard as CardData } from "@/content/campaign";

interface Props {
  card: CardData;
  /** image contains the full card art incl. frame (original scans) */
  fullArt?: boolean;
  /** portrait file exists in /public/cards */
  hasImage?: boolean;
  /** card not yet earned — rendered face-down-ish */
  locked?: boolean;
}

export function ChampionCard({ card, fullArt, hasImage = true, locked }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [sheen, setSheen] = useState<React.CSSProperties>({ opacity: 0 });

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || locked) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -18; // tilt
    const ry = (px - 0.5) * 18;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`,
      transition: "transform 40ms linear",
    });
    setSheen({
      opacity: 1,
      background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,235,180,0.28) 0%, rgba(120,200,255,0.10) 35%, transparent 60%)`,
    });
  }

  function onLeave() {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 400ms ease",
    });
    setSheen({ opacity: 0, transition: "opacity 400ms ease" });
  }

  const rarityRing =
    card.rarity === "boss"
      ? "ring-2 ring-red-500/40"
      : card.rarity === "rare"
        ? "ring-2 ring-sky-300/30"
        : "ring-1 ring-black/40";

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ ...style, aspectRatio: "2 / 3", containerType: "inline-size" }}
      className={`relative w-full select-none overflow-hidden rounded-2xl ${rarityRing} ${
        locked ? "opacity-40 grayscale" : ""
      }`}
    >
      {fullArt && hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image}
          alt={card.name}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col bg-[#b8873e] p-[6%] text-[#2a1c0e]">
          {/* title */}
          <div className="text-center font-display font-bold uppercase leading-tight tracking-wide [font-size:clamp(10px,5cqw,20px)]">
            {card.name}
          </div>
          {card.epithet && (
            <div className="text-center font-display font-semibold uppercase leading-tight [font-size:clamp(8px,3.4cqw,13px)]">
              {card.epithet}
            </div>
          )}
          {/* portrait */}
          <div className="relative mt-[4%] flex-1 overflow-hidden rounded-md border border-black/30 bg-[#1b1710]">
            {hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.image}
                alt={card.name}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center font-serif text-4xl text-[#b8873e]/60">
                Ø
              </div>
            )}
          </div>
          {/* type + power */}
          <div className="mt-[4%] flex items-center gap-[3%]">
            <div className="flex-1 rounded-full border-2 border-[#2a1c0e]/80 px-[5%] py-[1.5%] font-display font-bold [font-size:clamp(8px,3.6cqw,14px)]">
              Type: {card.type}
            </div>
            <div className="grid aspect-square w-[14%] place-items-center rounded-full border-2 border-[#2a1c0e]/80 font-display font-bold [font-size:clamp(10px,5cqw,20px)]">
              {card.power}
            </div>
          </div>
          {/* flavor */}
          <p className="mt-[3%] font-serif italic leading-snug [font-size:clamp(7px,3.2cqw,12px)]">
            &ldquo;{card.flavor}&rdquo;
          </p>
        </div>
      )}

      {/* holographic sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={sheen}
        aria-hidden
      />
    </div>
  );
}
