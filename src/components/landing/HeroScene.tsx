// Full-viewport pixel-art hero: the Journey island is the backdrop (one
// parallax layer, nearest-neighbour scaled), the whole playable cast stands
// on it — each character at their own spot, doing the thing that defines
// them — and the centered title block sits over a light vignette so the
// island's coast and citadel stay visible around the copy.

import Image from "next/image";
import Link from "next/link";
import type { Messages } from "@/i18n/messages";
import { HEROES } from "@/content/heroes";
import { HeroCast, type CastMember } from "./HeroCast";
import { Particles } from "./Particles";
import { SceneLayers, hasLandingAsset } from "./SceneLayers";

export function HeroScene({
  m,
  beginHref,
  signedIn,
}: {
  m: Messages["landing"];
  beginHref: string;
  signedIn: boolean;
}) {
  // Where each character stands on the island master, and what they do there.
  // Stations hug the left and right thirds so nobody stands behind the
  // centered copy block; the right-hand half faces back toward it.
  const STATIONS: Record<string, Omit<CastMember, "id" | "sheet" | "color">> = {
    stroowarrior:  { at: [23, 55], form: 5, act: "swing", delay: 0 },
    stroopkeeper:  { at: [15, 74], form: 5, act: "read",  delay: 1.1 },
    stroophantom:  { at: [11, 44], form: 5, act: "fade",  delay: 2.2 },
    strooracle:    { at: [72, 30], form: 5, act: "weigh", delay: 0.6, flip: true },
    stropillusion: { at: [84, 47], form: 5, act: "cast",  delay: 1.7, flip: true },
    astrostroopie: { at: [88, 20], form: 5, act: "chart", delay: 2.8, flip: true },
    stroopzipper:  { at: [76, 70], form: 5, act: "zip",   delay: 3.4, flip: true },
  };

  // Same fs check SceneLayers uses for its own art: a sheet that has not
  // landed yet simply falls back to the character's coloured stand-in.
  const cast: CastMember[] = HEROES.filter((h) => STATIONS[h.id]).map((h) => ({
    id: h.id,
    sheet: hasLandingAsset(h.sheet) ? h.sheet : null,
    color: h.color,
    ...STATIONS[h.id],
  }));

  return (
    <header data-scene className="ld-scene ld-scene--hero flex min-h-[max(100svh,640px)] items-center">
      <SceneLayers
        layers={[
          {
            src: "/landing/hero/island.webp",
            plx: 0.08,
            mouse: 0.3,
            priority: true,
            quality: 75,
            className: "ld-pixel",
          },
        ]}
      />

      <HeroCast cast={cast} />
      <Particles tone="hero" />
      <div aria-hidden className="ld-scrim ld-scrim--island" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-center px-6 pb-24 pt-28 md:pb-16">
        <div className="flex w-full max-w-xl flex-col items-center text-center" data-reveal>
          <Image
            src="/logo-sigil.png"
            alt=""
            width={96}
            height={96}
            priority
            quality={75}
            className="ld-glow h-20 w-20 rounded-full md:h-24 md:w-24"
          />

          <p className="mt-6 font-pixel text-[10px] uppercase tracking-[0.3em] text-gold">
            {m.hero.kicker}
          </p>

          <h1 className="mt-4 flex flex-col items-center gap-4">
            <span className="font-pixel text-[clamp(56px,10vw,112px)] font-bold leading-none tracking-[0.06em] text-fg [text-shadow:4px_4px_0_#1a1024,0_0_40px_rgba(143,123,255,.45)]">
              TUSST
            </span>
            <span className="font-mono text-[clamp(10px,1.6vw,13px)] uppercase tracking-[0.5em] text-accent-soft">
              {m.hero.subtitle}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-fg/80">
            {m.hero.tagline}
          </p>

          <div className="mt-9 flex w-full flex-col items-center gap-3.5 sm:w-auto sm:flex-row">
            <Link href={beginHref} className="ld-btn-pixel">
              {signedIn ? m.hero.ctaContinue : m.hero.ctaPrimary}
            </Link>
            <Link
              href="/ide"
              className="inline-flex items-center justify-center gap-2.5 border-2 border-gold/40 bg-[rgba(5,4,9,0.35)] px-6 py-3 font-pixel text-[11px] uppercase tracking-[0.08em] text-gold shadow-[3px_4px_0_rgba(26,16,36,0.8)] transition-colors hover:border-gold/70 hover:bg-[rgba(217,185,106,0.12)] focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
            >
              {m.hero.ctaSecondary}
              <span className="border border-gold/40 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.16em] text-gold/80">
                {m.hero.ctaSecondaryBadge}
              </span>
            </Link>
          </div>

          {!signedIn && (
            <Link
              href="/login"
              className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-soft/85 underline decoration-accent/40 underline-offset-4 transition-colors hover:text-white hover:decoration-accent-soft focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-4"
            >
              {m.hero.ctaEnter}
            </Link>
          )}

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted2">
            {m.hero.freeLine}
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center font-mono text-[9px] uppercase tracking-[0.4em] text-muted2"
      >
        <span className="ld-hint mb-1 block text-[13px] text-accent-soft">▼</span>
        {m.hero.scrollHint}
      </div>
    </header>
  );
}
