// Presentation scene: war-room interior, display
// headline + copy on the darker left half, the Forgeborn apprentice on
// the right, and the platform-badge row.

import Image from "next/image";
import type { Messages } from "@/i18n/messages";
import { SceneLayers, hasLandingAsset } from "./SceneLayers";

const CHARACTER = "/landing/intro/character.webp";

export function IntroScene({ m }: { m: Messages["landing"] }) {
  const badges = [
    m.intro.badgeRust,
    m.intro.badgeSoroban,
    m.intro.badgeBrowser,
    m.intro.badgeFree,
  ];

  return (
    <section id="intro" data-scene className="ld-scene ld-scene--intro flex min-h-[92svh] items-center">
      <SceneLayers layers={[{ src: "/landing/intro/scene.webp", plx: 0.07 }]} />
      <div aria-hidden className="ld-scrim ld-scrim--left" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-[1.05fr_0.95fr] md:px-12">
        <div data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-gold">
            {m.intro.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-[clamp(38px,6vw,68px)] font-black uppercase leading-[1.04] text-fg">
            {m.intro.titleTop}
            <br />
            {m.intro.titleBottom}
          </h2>
          <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-muted2">
            {m.intro.body}
          </p>

          <ul className="mt-10 flex max-w-lg flex-wrap gap-x-7 gap-y-4">
            {badges.map((badge) => (
              <li
                key={badge}
                className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/85"
              >
                <span aria-hidden className="text-gold">
                  ✦
                </span>
                {badge}
              </li>
            ))}
          </ul>
        </div>

        {hasLandingAsset(CHARACTER) && (
          <div className="relative mx-auto w-full max-w-[340px] md:max-w-[400px]" data-reveal="2">
            <div
              aria-hidden
              className="absolute inset-x-6 bottom-2 top-14 rounded-full bg-[radial-gradient(closest-side,rgba(217,185,106,0.22),transparent)]"
            />
            <Image
              src={CHARACTER}
              alt=""
              width={1200}
              height={1600}
              quality={75}
              sizes="(max-width: 768px) 340px, 400px"
              className="ld-float relative h-auto w-full drop-shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
