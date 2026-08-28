// Full-viewport illustrated hero: four parallax layers (sky plate, far
// spires, citadel hill, foreground rocks), CSS light rays and drifting
// motes, and the centered title block — a giant rune glyph behind it
// works as an oversized sigil watermark.

import Image from "next/image";
import Link from "next/link";
import type { Messages } from "@/i18n/messages";
import { Particles } from "./Particles";
import { SceneLayers, hasLandingAsset } from "./SceneLayers";

export function HeroScene({
  m,
  beginHref,
}: {
  m: Messages["landing"];
  beginHref: string;
}) {
  return (
    <header data-scene className="ld-scene ld-scene--hero flex min-h-[max(100svh,640px)] items-center">
      <SceneLayers
        layers={[
          { src: "/landing/hero/sky.webp", plx: 0.05, mouse: 0.25, priority: true, quality: 75 },
          { src: "/landing/hero/far.webp", plx: 0.12, mouse: 0.45, eager: true },
          { src: "/landing/hero/mid.webp", plx: 0.2, mouse: 0.7, priority: true, quality: 75 },
        ]}
      />

      {/* the party marches toward the citadel between the crag and the
          foreground rocks — same parallax factor as the rocks so their
          feet stay planted on them */}
      {hasLandingAsset("/landing/hero/party.webp") && (
        <div
          aria-hidden
          data-plx={0.3}
          className="ld-plx pointer-events-none absolute bottom-[20%] left-[3%] hidden w-[clamp(240px,24vw,410px)] md:block"
        >
          <div data-plx-mouse={1.1}>
            <Image
              src="/landing/hero/party.webp"
              alt=""
              width={1400}
              height={895}
              quality={75}
              sizes="400px"
              className="h-auto w-full drop-shadow-[0_16px_26px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      )}

      <SceneLayers
        layers={[
          { src: "/landing/hero/fg.webp", plx: 0.3, mouse: 1.1, eager: true, quality: 75, className: "object-bottom" },
        ]}
      />

      <div aria-hidden className="ld-ray left-[16%]" style={{ "--delay": "0s" } as React.CSSProperties} />
      <div aria-hidden className="ld-ray left-[38%]" style={{ "--delay": "2.4s" } as React.CSSProperties} />
      <Particles tone="hero" />
      <div aria-hidden className="ld-scrim" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-center px-6 pb-24 pt-28 md:pb-16">
        <div className="relative flex w-full max-w-xl flex-col items-center text-center" data-reveal>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none font-display text-[200px] font-black leading-none text-gold/[0.08] md:-top-24 md:text-[290px]"
          >
            Ø
          </span>

          <Image
            src="/logo-sigil.png"
            alt=""
            width={96}
            height={96}
            priority
            quality={75}
            className="ld-glow h-20 w-20 rounded-full md:h-24 md:w-24"
          />

          <h1 className="mt-6 flex flex-col items-center gap-3">
            <span className="font-display text-[clamp(64px,12vw,124px)] font-black leading-none tracking-[0.08em] text-fg [text-shadow:0_0_46px_rgba(143,123,255,0.45),0_10px_50px_rgba(0,0,0,0.9)]">
              TUSST
            </span>
            <span className="font-mono text-[clamp(10px,1.6vw,13px)] uppercase tracking-[0.5em] text-accent-soft">
              {m.hero.subtitle}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted2">
            {m.hero.tagline}
          </p>

          <div className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row">
            <Link
              href={beginHref}
              className="rounded-full bg-accent px-8 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.18em] text-[#0b0716] shadow-[0_0_34px_rgba(143,123,255,0.4)] transition hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-4"
            >
              {m.hero.ctaPrimary}
            </Link>
            <Link
              href="/ide"
              className="flex items-center gap-2.5 rounded-full border border-gold/45 bg-[rgba(217,185,106,0.07)] px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.18em] text-gold transition hover:bg-[rgba(217,185,106,0.16)] focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
            >
              {m.hero.ctaSecondary}
              <span className="rounded-full border border-gold/40 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em]">
                {m.hero.ctaSecondaryBadge}
              </span>
            </Link>
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            {m.hero.freeLine}
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center font-mono text-[9px] uppercase tracking-[0.4em] text-muted"
      >
        <span className="ld-hint mb-1 block text-[13px] text-accent-soft">▼</span>
        {m.hero.scrollHint}
      </div>
    </header>
  );
}
