// One full-viewport illustrated feature section: eyebrow +
// display headline + body on the darker left half, optionally a framed
// floating card on the right, ambient particles per mood. Used three
// times (campaign / boss / forge).

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Particles } from "./Particles";
import { SceneLayers } from "./SceneLayers";

export interface FeatureCopy {
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  body: string;
}

export function FeatureScene({
  id,
  art,
  copy,
  accentClass,
  particles,
  note,
  cta,
  card,
}: {
  id: "campaign" | "boss" | "forge";
  art: string;
  copy: FeatureCopy;
  accentClass: string;
  particles?: "boss" | "forge";
  note?: string;
  cta?: { href: string; label: string; badge?: string };
  card?: { src: string; alt: string; width: number; height: number; glowClass: string };
}) {
  let content: ReactNode = null;
  if (card) {
    content = (
      <div className="relative mx-auto w-full max-w-[300px] md:max-w-[340px]" data-reveal="2">
        <div aria-hidden className={`absolute -inset-7 rounded-[36px] ${card.glowClass}`} />
        <div className="ld-float relative overflow-hidden rounded-2xl border border-white/12 shadow-[0_34px_80px_rgba(0,0,0,0.8)]">
          <Image
            src={card.src}
            alt={card.alt}
            width={card.width}
            height={card.height}
            quality={60}
            sizes="(max-width: 768px) 300px, 340px"
            className="h-auto w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <section id={id} data-scene className={`ld-scene ld-scene--${id} flex min-h-[92svh] items-center`}>
      <SceneLayers layers={[{ src: art, plx: 0.07 }]} />
      <div aria-hidden className="ld-scrim ld-scrim--left" />
      {particles ? <Particles tone={particles} count={8} /> : null}

      <div
        className={`relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-24 md:px-12 ${card ? "md:grid-cols-[1.05fr_0.95fr]" : ""}`}
      >
        <div data-reveal>
          <p className={`font-mono text-[11px] uppercase tracking-[0.42em] ${accentClass}`}>
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-[clamp(36px,5.6vw,64px)] font-black uppercase leading-[1.04] text-fg">
            {copy.titleTop}
            <br />
            {copy.titleBottom}
          </h2>
          <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-muted2">{copy.body}</p>

          {note ? (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.26em] text-ember">
              {note}
            </p>
          ) : null}

          {cta ? (
            <Link
              href={cta.href}
              className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-accent/45 bg-accent/10 px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.18em] text-accent-soft transition hover:bg-accent/25 hover:text-white focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
            >
              {cta.label}
              {cta.badge ? (
                <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em]">
                  {cta.badge}
                </span>
              ) : null}
            </Link>
          ) : null}
        </div>

        {content}
      </div>
    </section>
  );
}
