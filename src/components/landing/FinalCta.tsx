// Closing scene + site footer: the hero sky plate returns (same file —
// already cached), one centered display headline, the primary CTA, the
// Forge escape hatch, and the brand strip.

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
      <SceneLayers layers={[{ src: "/landing/hero/sky.webp", plx: 0.05, className: "object-top" }]} />
      <Particles tone="hero" count={8} />
      <div aria-hidden className="ld-scrim" />

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
          <h2 className="mt-7 font-display text-[clamp(36px,6vw,64px)] font-black uppercase leading-[1.05] text-fg">
            {m.cta.titleTop}
            <br />
            {m.cta.titleBottom}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted2">{m.cta.body}</p>

          <Link
            href={beginHref}
            className="mt-10 rounded-full bg-accent px-9 py-4 font-display text-[14px] font-bold uppercase tracking-[0.18em] text-[#0b0716] shadow-[0_0_40px_rgba(143,123,255,0.45)] transition hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-4"
          >
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
            tusst · {m.footer.tagline} · {m.footer.motto}
          </p>
        </div>
      </div>
    </footer>
  );
}
