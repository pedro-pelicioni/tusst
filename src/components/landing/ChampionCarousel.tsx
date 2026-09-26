"use client";

// The playable cast as a 3D card carousel over the runic backdrop: three
// visible slots (center card large, neighbors receding with a rotateY),
// flip-in animation when the center changes, PREVIOUS/NEXT controls,
// progress dashes, arrow keys and pointer swipe. Under the active card: its
// role and the eight pixel forms the hero grows through, then the door to
// the /hero picker. No autoplay. Under prefers-reduced-motion the CSS kills
// transitions/animations and the change becomes an instant swap.
//
// Seven cards, not eight: the Beholder is the Act VII boss, not someone you
// play (see src/content/heroes.ts).

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { HEROES, HERO_FORMS, type HeroId } from "@/content/heroes";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { sheetPosition } from "@/lib/hero";

function circularOffset(i: number, index: number, length: number): number {
  let d = i - index;
  if (d > length / 2) d -= length;
  if (d < -length / 2) d += length;
  return d;
}

export function ChampionCarousel({
  ctaHref,
  sheets,
}: {
  ctaHref: string;
  /** heroes whose pixel form sheet has landed (checked on the server) */
  sheets: HeroId[];
}) {
  const messages = useMessages();
  const m = messages.landing;
  const heroCopy = messages.overworld.heroes;
  const [index, setIndex] = useState(0);
  const swipeStart = useRef<number | null>(null);

  const total = HEROES.length;
  const go = (next: number) => setIndex(((next % total) + total) % total);
  const active = HEROES[index];
  const activeCopy = heroCopy[active.id];
  const activeName = activeCopy.name.toUpperCase();

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
          {HEROES.map((hero, i) => {
            const offset = circularOffset(i, index, total);
            const hidden = Math.abs(offset) > 1;
            const name = heroCopy[hero.id].name.toUpperCase();
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
                key={hero.id}
                type="button"
                onClick={() => go(i)}
                aria-label={fmt(m.a11y.goToCard, { name })}
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
                    src={`/cards/${hero.cardId}.png`}
                    alt={name}
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
            {activeName}
          </span>
          <span className="mt-1.5 block font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
            {activeCopy.role}
          </span>
          <span className="sr-only">
            {fmt(m.a11y.cardStatus, { name: activeName, index: index + 1, total })}
          </span>
        </p>

        {sheets.includes(active.id) ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <ol
              aria-label={fmt(m.a11y.formsList, { name: activeCopy.name })}
              className="grid w-full max-w-[26rem] grid-cols-8 gap-1 sm:gap-2"
            >
              {Array.from({ length: HERO_FORMS }, (_, form) => (
                <li
                  key={`${active.id}-${form}`}
                  title={activeCopy.forms[form]}
                  className="ld-form"
                  style={{ "--form-delay": `${form * 40}ms` } as React.CSSProperties}
                >
                  <span
                    aria-hidden
                    className="ld-pixel block aspect-square w-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${active.sheet})`,
                      backgroundSize: "400% 200%",
                      backgroundPosition: sheetPosition(form),
                    }}
                  />
                  <span className="sr-only">{activeCopy.forms[form]}</span>
                </li>
              ))}
            </ol>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted2">
              {m.carousel.formsLabel}
            </p>
          </div>
        ) : null}

        <div className="mt-9 flex items-center justify-center gap-3 sm:gap-8">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={m.a11y.prevCard}
            className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted2 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/20 text-accent-soft">
              ←
            </span>
            <span className="hidden sm:inline">{m.carousel.previous}</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {HEROES.map((hero, i) => (
              <button
                key={hero.id}
                type="button"
                onClick={() => go(i)}
                aria-label={fmt(m.a11y.goToCard, { name: heroCopy[hero.id].name.toUpperCase() })}
                aria-current={i === index || undefined}
                className={`h-[3px] rounded-full transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${i === index ? "w-6 bg-accent sm:w-9" : "w-3 bg-white/15 hover:bg-white/30 sm:w-5"}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={m.a11y.nextCard}
            className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted2 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            <span className="hidden sm:inline">{m.carousel.next}</span>
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/20 text-accent-soft">
              →
            </span>
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href={ctaHref} className="ld-btn-pixel">
            {m.carousel.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
