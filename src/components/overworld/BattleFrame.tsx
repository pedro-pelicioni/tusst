/* eslint-disable @next/next/no-img-element */
"use client";

// The battle skin around a step player: the island crop as the arena, the
// hero facing the region's boss, an HP bar that drains with every right
// answer, three cosmetic hearts, and the untouched step UI in the other
// column. Purely presentational — it never sees a grade, an XP call or a
// step transition; the players feed it derived numbers and a `hit` pulse.
//
// `overworld.css` is imported here on purpose: the slug pages live in the
// `(app)` group where no map stage ever renders, so the `ow-*` panels,
// sprite and chips would be unstyled otherwise (Next dedupes the import).

import type { CSSProperties, ReactNode } from "react";
import type { HeroView } from "@/content/overworld/types";
import { HERO_FORMS } from "@/content/heroes";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { HeroFigure } from "./HeroFigure";
import "./overworld.css";
import "./battle.css";

export interface BattleBoss {
  name: string;
  level: number;
  /** public path; null draws the glyph stand-in */
  art: string | null;
}

export interface BattleArena {
  /** the island webp; null draws the sea stand-in */
  src: string | null;
  /** `[x%, y%]` of the island — the crop centers on the mission's node */
  pos: [number, number];
}

export type BattleHit = "boss" | "player" | null;

/** What a server page hands a step player to dress it as a battle. */
export interface BattleSkin {
  hero: HeroView;
  boss: BattleBoss;
  arena: BattleArena;
  /** "07" / "I.3" — the mission label in the header band */
  missionNumber: string;
  /** back to the island, standing on this node */
  backHref: string;
  /** the island walking to the next node, or null at the end of the road */
  nextHref: string | null;
  /** the next mission's title for the victory card */
  nextTitle?: string | null;
}

const HEARTS = 3;

export function BattleFrame({
  hero,
  boss,
  arena,
  hp,
  hearts,
  hit,
  hitKey,
  header,
  children,
}: {
  hero: HeroView;
  boss: BattleBoss;
  arena: BattleArena;
  hp: { max: number; current: number };
  hearts: number;
  hit: BattleHit;
  /** bump to replay the strike even when `hit` keeps its value */
  hitKey: number;
  header: string;
  children: ReactNode;
}) {
  const m = useMessages();
  const b = m.overworld.battle;
  const max = Math.max(1, Math.floor(hp.max));
  const current = Math.max(0, Math.min(max, Math.floor(hp.current)));
  const defeated = current === 0;
  const heartsLeft = Math.max(0, Math.min(HEARTS, Math.floor(hearts)));
  const heroSize =
    hero.form >= HERO_FORMS - 1 ? "is-divine" : hero.form >= 5 ? "is-ascended" : "";

  const arenaStyle = {
    "--ow-arena-x": `${arena.pos[0]}%`,
    "--ow-arena-y": `${arena.pos[1]}%`,
    ...(arena.src ? { "--ow-arena-src": `url("${arena.src}")` } : {}),
  } as CSSProperties;

  return (
    <div className="ow-battle">
      <div className="ow-battle-stage">
        <section className="ow-battle-arena" style={arenaStyle} aria-label={b.arenaLabel}>
          <span className="ow-battle-caption">{fmt(b.level, { level: boss.level })}</span>

          {/* boss — re-keyed on every strike so the shake replays */}
          <div
            key={hit === "boss" ? `boss-${hitKey}` : "boss"}
            className={`ow-battle-boss ${hit === "boss" ? "is-hit" : ""} ${defeated ? "is-defeated" : ""}`}
          >
            <span className="ow-battle-platform" aria-hidden />
            {boss.art ? (
              <img src={boss.art} alt="" className="ow-battle-figure" />
            ) : (
              <span className="ow-battle-figure ow-battle-glyph" aria-hidden>
                ☠
              </span>
            )}
            {hit === "boss" && <span className="ow-battle-flash" aria-hidden />}
            {defeated && <span className="ow-battle-defeated">{m.overworld.map.defeated}</span>}
          </div>

          {/* hero — same trick for the counter-attack flinch */}
          <div
            key={hit === "player" ? `hero-${hitKey}` : "hero"}
            className={`ow-battle-hero ${hit === "player" ? "is-hit" : ""}`}
          >
            <span className="ow-battle-platform" aria-hidden />
            <span className={`ow-hero ${heroSize}`}>
              <HeroFigure hero={hero} />
            </span>
            {hit === "player" && <span className="ow-battle-flash" aria-hidden />}
          </div>

          {/* strike particle: hero → boss on a hit, boss → hero on a miss */}
          {hit && (
            <span
              key={`fx-${hitKey}`}
              className={`ow-battle-fx ${hit === "boss" ? "is-strike" : "is-counter"}`}
              aria-hidden
            />
          )}

          {/* boss plate */}
          <div className="ow-panel-parchment ow-battle-plate ow-battle-plate-boss">
            <div className="ow-battle-plate-row">
              <span className="ow-battle-name" title={boss.name}>
                {boss.name}
              </span>
              <span className="ow-chip shrink-0">{fmt(m.overworld.hud.level, { level: boss.level })}</span>
            </div>
            <div
              className="ow-battle-hp"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={max}
              aria-valuenow={current}
              aria-label={boss.name}
            >
              <span style={{ width: `${(current / max) * 100}%` }} />
            </div>
            <span className="ow-battle-sub">{fmt(b.bossHp, { current, max })}</span>
          </div>

          {/* hero plate */}
          <div className="ow-panel-parchment ow-battle-plate ow-battle-plate-hero">
            <div className="ow-battle-plate-row">
              <span className="ow-battle-name" title={hero.name}>
                {hero.name}
              </span>
              <span className="ow-chip shrink-0">{fmt(m.overworld.hud.level, { level: hero.level })}</span>
            </div>
            <span className="ow-battle-hearts" aria-label={`${heartsLeft} / ${HEARTS}`}>
              {Array.from({ length: HEARTS }, (_, i) => (
                <span key={i} className={i < heartsLeft ? "" : "is-lost"} aria-hidden>
                  ♥
                </span>
              ))}
            </span>
            <span className="ow-battle-sub">{b.heartsRule}</span>
          </div>
        </section>

        <div className="ow-panel-parchment ow-battle-console">
          <span className="ow-eyebrow text-[#804426]">{b.guide}</span>
          <p>{b.heartsNote}</p>
        </div>
      </div>

      <div className="ow-battle-side">
        <div className="ow-battle-band">
          <span>{header}</span>
          <span className="hidden sm:inline">{fmt(b.progress, { current: max - current, total: max })}</span>
        </div>
        <div className="ow-battle-body">{children}</div>
      </div>
    </div>
  );
}
