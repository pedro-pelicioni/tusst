// The world map: the real /path chart (the same pixel art the game opens
// on), three numbered pins on its islands, and one card per path underneath.
// The island names and blurbs are the overworld's own copy, so the landing
// can never describe the map differently from the map itself.
//
// Order is the advice: the Journey is where everyone starts (free-roam),
// the Rust campaign is optional depth, the Harbor is the narrative-free
// Advanced Path. The Forge islet gets its own scene right below.

import Image from "next/image";
import Link from "next/link";
import type { Messages } from "@/i18n/messages";
import { WORLD_MAP, WORLD_MAP_NODES } from "@/content/overworld/world-map";

const NUMERALS = ["I", "II", "III"];

export function MapScene({
  m,
  world,
  beginHref,
}: {
  m: Messages["landing"];
  world: Messages["overworld"]["worldMap"];
  beginHref: string;
}) {
  const paths = [
    { node: "island:journey", tag: m.map.tagStart, copy: world.islands.journey },
    { node: "island:campaign", tag: m.map.tagOptional, copy: world.islands.campaign },
    { node: "landmark:advanced", tag: m.map.tagDeep, copy: world.landmarks.advanced },
  ];

  return (
    <section id="map" data-scene className="ld-scene ld-scene--map">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:px-12 md:py-28">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-gold">{m.map.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(32px,4.8vw,56px)] font-black uppercase leading-[1.06] text-fg">
            <span className="block [text-wrap:balance]">{m.map.titleTop}</span>
            <span className="block text-gold [text-wrap:balance]">{m.map.titleBottom}</span>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted2">{m.map.body}</p>
        </div>

        <figure className="ld-map-frame mt-14" data-reveal="2">
          <Image
            src={WORLD_MAP.image.src}
            alt={m.map.mapAlt}
            width={WORLD_MAP.image.width}
            height={WORLD_MAP.image.height}
            quality={75}
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="ld-pixel block h-auto w-full"
          />
          {paths.map((path, i) => {
            const [x, y] = WORLD_MAP_NODES[path.node];
            return (
              <span
                key={path.node}
                aria-hidden
                className="ld-map-pin"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {NUMERALS[i]}
              </span>
            );
          })}
        </figure>

        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {paths.map((path, i) => (
            <li key={path.node} className="ld-path-card" data-reveal={String(i + 2)}>
              <p className="flex items-center justify-between gap-3">
                <span aria-hidden className="font-display text-[22px] font-black text-gold">
                  {NUMERALS[i]}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] ${i === 0 ? "border-gold/50 text-gold" : "border-white/15 text-muted2"}`}
                >
                  {path.tag}
                </span>
              </p>
              <h3 className="mt-3 font-display text-[18px] font-bold uppercase tracking-[0.06em] text-fg">
                {path.copy.title}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent-soft">
                {path.copy.subtitle}
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-muted2">{path.copy.blurb}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center" data-reveal>
          <Link href={beginHref} className="ld-btn-pixel">
            {m.map.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
