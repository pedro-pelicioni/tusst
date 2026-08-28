"use client";

// 3D card carousel over the runic backdrop: three visible
// slots (center card large, neighbors receding with a rotateY), flip-in
// animation when the center changes, PREVIOUS/NEXT controls, progress
// dashes, arrow keys and pointer swipe. No autoplay. Under
// prefers-reduced-motion the CSS kills transitions/animations and the
// change becomes an instant swap.

import Image from "next/image";
import { useRef, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import type { Messages } from "@/i18n/messages";

type CardMetaKey = keyof Messages["landing"]["carousel"]["cards"];

const CHAMPIONS: { slug: string; name: string; metaKey: CardMetaKey }[] = [
  { slug: "stroowarrior", name: "STROOWARRIOR", metaKey: "metaStroowarrior" },
  { slug: "stropillusion", name: "STROPILLUSION", metaKey: "metaStropillusion" },
  { slug: "stroopkeeper", name: "STROOPKEEPER", metaKey: "metaStroopkeeper" },
  { slug: "stroophantom", name: "STROOPHANTOM", metaKey: "metaStroophantom" },
  { slug: "strooracle", name: "STROORACLE", metaKey: "metaStrooracle" },
  { slug: "astrostroopie", name: "ASTROSTROOPIE", metaKey: "metaAstrostroopie" },
  { slug: "stroopbeholder", name: "STROOPBEHOLDER", metaKey: "metaStroopbeholder" },
  { slug: "stroopzipper", name: "STROOPZIPPER", metaKey: "metaStroopzipper" },
];

function circularOffset(i: number, index: number, length: number): number {
  let d = i - index;
  if (d > length / 2) d -= length;
  if (d < -length / 2) d += length;
  return d;
}

export function ChampionCarousel() {
  const m = useMessages().landing;
  const [index, setIndex] = useState(0);
  const swipeStart = useRef<number | null>(null);

  const total = CHAMPIONS.length;
  const go = (next: number) => setIndex(((next % total) + total) % total);
  const active = CHAMPIONS[index];

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  };

  return (
    <section
      id="champions"
      data-scene
      className="ld-scene ld-scene--carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={m.a11y.carouselLabel}
      onKeyDown={onKeyDown}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/landing/carousel/bg.webp')] bg-cover bg-center opacity-90"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12 md:py-28">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-accent">
            {m.carousel.kicker}
          </p>
          <h2 className="mt-4 font-display text-[clamp(34px,5vw,56px)] font-black uppercase leading-[1.06] text-fg">
            {m.carousel.heading}
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-muted2">{m.carousel.body}</p>
        </div>

        <div className="ld-stage relative mx-auto mt-14 h-[min(118vw,430px)] w-full max-w-3xl" data-reveal="2">
          {CHAMPIONS.map((champion, i) => {
            const offset = circularOffset(i, index, total);
            const hidden = Math.abs(offset) > 1;
            const style: React.CSSProperties = hidden
              ? {
                  transform: `translateX(calc(-50% + ${Math.sign(offset) * 150}%)) scale(0.6)`,
                  opacity: 0,
                }
              : offset === 0
                ? { transform: "translateX(-50%) scale(1)", opacity: 1 }
                : {
                    transform: `translateX(calc(-50% + ${offset * 70}%)) scale(0.78) rotateY(${offset * -16}deg)`,
                    opacity: 0.45,
                  };
            return (
              <button
                key={champion.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={fmt(m.a11y.goToCard, { name: champion.name })}
                aria-current={offset === 0 || undefined}
                aria-hidden={hidden || undefined}
                inert={hidden}
                tabIndex={offset === 0 ? -1 : 0}
                onPointerDown={(e) => {
                  swipeStart.current = e.clientX;
                }}
                onPointerUp={(e) => {
                  const start = swipeStart.current;
                  swipeStart.current = null;
                  if (start === null) return;
                  const delta = e.clientX - start;
                  if (delta > 40) go(index - 1);
                  else if (delta < -40) go(index + 1);
                }}
                className={`ld-card absolute left-1/2 top-0 w-[min(62vw,300px)] cursor-pointer touch-pan-y focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${offset === 0 ? "z-30" : "z-20"}`}
                style={style}
              >
                <span
                  key={offset === 0 ? `front-${index}` : undefined}
                  className={`block overflow-hidden rounded-2xl border border-white/10 ${offset === 0 ? "ld-card--flip shadow-[0_0_60px_rgba(143,123,255,0.3),0_30px_70px_rgba(0,0,0,0.75)]" : "shadow-[0_20px_50px_rgba(0,0,0,0.6)]"}`}
                >
                  <Image
                    src={`/cards/${champion.slug}.png`}
                    alt={champion.name}
                    width={848}
                    height={1264}
                    quality={60}
                    sizes="(max-width: 640px) 62vw, 300px"
                    className="h-auto w-full"
                  />
                </span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="mt-10 text-center">
          <span className="font-display text-[19px] font-bold tracking-[0.22em] text-fg">
            {active.name}
          </span>
          <span className="mt-1.5 block font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
            {m.carousel.cards[active.metaKey]}
          </span>
          <span className="sr-only">
            {fmt(m.a11y.cardStatus, { name: active.name, index: index + 1, total })}
          </span>
        </p>

        <div className="mt-9 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={m.a11y.prevCard}
            className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted2 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/20 text-accent-soft">
              ←
            </span>
            {m.carousel.previous}
          </button>

          <div className="flex items-center gap-2">
            {CHAMPIONS.map((champion, i) => (
              <button
                key={champion.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={fmt(m.a11y.goToCard, { name: champion.name })}
                aria-current={i === index || undefined}
                className={`h-[3px] rounded-full transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${i === index ? "w-9 bg-accent" : "w-5 bg-white/15 hover:bg-white/30"}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={m.a11y.nextCard}
            className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted2 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            {m.carousel.next}
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/20 text-accent-soft">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
