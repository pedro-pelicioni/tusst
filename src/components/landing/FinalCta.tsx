// Closing scene + site footer: the page ends where it began — the Journey
// island (same file as the hero, already cached), dimmed under a heavy
// vignette so it reads as a backdrop — with one balanced display headline,
// the hero's crimson pixel button, the Forge escape hatch, and the brand strip.

import Image from "next/image";
import Link from "next/link";
import type { Messages } from "@/i18n/messages";
import { Particles } from "./Particles";
import { SceneLayers } from "./SceneLayers";

export function FinalCta({
  m,
  beginHref,
}: {
  m: Messages["landing"];
  beginHref: string;
}) {
  return (
    <footer data-scene className="ld-scene ld-scene--cta">
      <SceneLayers layers={[{ src: "/landing/hero/island.webp", plx: 0.05, className: "ld-pixel" }]} />
      <Particles tone="hero" count={8} />
      <div aria-hidden className="ld-scrim ld-scrim--cta" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-14 pt-28 text-center md:pt-36">
        <div data-reveal className="flex flex-col items-center">
          <Image
            src="/logo-sigil.png"
            alt=""
            width={56}
            height={56}
            quality={75}
            className="ld-glow h-14 w-14 rounded-full"
          />
          <h2 className="mt-7 font-display text-[clamp(32px,5vw,56px)] font-black uppercase leading-[1.06] text-fg">
            <span className="block [text-wrap:balance]">{m.cta.titleTop}</span>
            <span className="block text-gold [text-wrap:balance]">{m.cta.titleBottom}</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-fg/80">{m.cta.body}</p>

          <Link href={beginHref} className="ld-btn-pixel mt-10">
            {m.cta.button}
          </Link>

          <p className="mt-6 text-[13px] text-muted2">
            {m.cta.altPrefix}{" "}
            <Link
              href="/ide"
              className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-accent-soft focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
            >
              {m.cta.altLink}
            </Link>
            {m.cta.altSuffix}
          </p>
        </div>

        <div className="mt-24 w-full border-t border-white/10 pt-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-muted">
            tusst · {m.footer.tagline} · {m.footer.motto} ·{" "}
            <Link
              href="/privacy"
              className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
            >
              {m.footer.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
