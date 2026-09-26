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
  // Each character's road on the island master (% of the image), walked end
  // to end and back. The roads hug the left and right thirds so nobody walks
  // behind the centered copy block. Delays are negative so the island is
  // already mid-motion on first paint, and every character is at a different
  // moment of the loop.
  const ROADS: Record<string, Pick<CastMember, "road" | "delay">> = {
    // the west shore road, beach to watchtower — the original walker's route
    stroowarrior:  { road: [[24, 63], [23.5, 57], [26, 47], [26.5, 38]], delay: 0 },
    stroopkeeper:  { road: [[12, 78], [18, 74], [24, 76]], delay: -4.3 },
    stroophantom:  { road: [[8, 52], [10, 44], [13, 36]], delay: -8.6 },
    strooracle:    { road: [[70, 34], [75, 30], [80, 33]], delay: -12.9 },
    stropillusion: { road: [[74, 52], [79, 46], [84, 50]], delay: -17.1 },
    astrostroopie: { road: [[74, 20], [79, 16], [84, 20]], delay: -21.4 },
    stroopzipper:  { road: [[70, 74], [76, 70], [82, 72]], delay: -25.7 },
  };

  // Same fs check SceneLayers uses for its own art: a sheet that has not
  // landed yet falls back to the character's coloured stand-in.
  const cast: CastMember[] = HEROES.filter((h) => ROADS[h.id]).map((h) => ({
    id: h.id,
    anim: hasLandingAsset(h.anim) ? h.anim : null,
    color: h.color,
    ...ROADS[h.id],
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
