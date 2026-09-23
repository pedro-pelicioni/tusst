"use client";

// The screen after a mission is sealed: the hero's form before and after,
// the XP line, the next destination and two ways back onto the island. It
// reads what the player already knows (the claim result) and never talks
// to the server itself.

import Link from "next/link";
import type { HeroView } from "@/content/overworld/types";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { heroForm } from "@/lib/hero";
import { HeroPortrait } from "./HeroFigure";
import "./overworld.css";
import "./battle.css";

export function VictoryScreen({
  hero,
  xpEarned,
  leveledUp,
  levelBefore,
  levelAfter,
  alreadyClaimed,
  nextHref,
  nextTitle,
  backHref,
  missionTitle,
}: {
  hero: HeroView;
  xpEarned: number;
  leveledUp: boolean;
  levelBefore: number;
  levelAfter: number;
  /** a revisit — the XP was not granted twice */
  alreadyClaimed: boolean;
  nextHref: string | null;
  nextTitle?: string | null;
  backHref: string;
  missionTitle: string;
}) {
  const m = useMessages();
  const v = m.overworld.victory;
  const heroCopy = m.overworld.heroes[hero.id];
  const formBefore = heroForm(levelBefore);
  const formAfter = heroForm(levelAfter);
  const evolved = formAfter !== formBefore;
  const kicker = leveledUp
    ? fmt(v.headerLevel, { level: levelAfter })
    : alreadyClaimed
      ? v.headerRevisit
      : v.headerDone;

  return (
    <div className="ow-battle-victory">
      <div className="ow-panel-parchment ow-battle-victory-card">
        <p className="ow-eyebrow text-[#804426]">{kicker}</p>
        <h1 className="ow-title mt-2 text-[#6d2630]">
          {fmt(v.congrats, { name: hero.name.toUpperCase() })}
        </h1>
        <p className="ow-battle-victory-title">{missionTitle}</p>

        <div className="ow-battle-forms">
          <div className="ow-battle-form">
            <HeroPortrait hero={hero} form={formBefore} size={72} />
            <span className="ow-eyebrow text-[#804426]">
              {fmt(m.overworld.hud.level, { level: levelBefore })}
            </span>
            <span className="ow-battle-form-name">{heroCopy.forms[formBefore]}</span>
          </div>
          <span className="ow-battle-forms-arrow" aria-hidden>
            →
          </span>
          <div className={`ow-battle-form ${evolved ? "is-new" : ""}`}>
            <HeroPortrait hero={hero} form={formAfter} size={72} />
            <span className="ow-eyebrow text-[#804426]">
              {fmt(m.overworld.hud.level, { level: levelAfter })}
            </span>
            <span className="ow-battle-form-name">{heroCopy.forms[formAfter]}</span>
          </div>
        </div>
        <span className="ow-chip">{evolved ? v.newForm : v.sameForm}</span>

        {hero.signedIn ? (
          alreadyClaimed ? (
            <p className="ow-battle-note">{v.revisitNote}</p>
          ) : (
            <p className="ow-battle-xp">{fmt(v.xpLine, { xp: xpEarned, role: hero.roleName })}</p>
          )
        ) : (
          <Link href="/login" className="ow-btn-quiet mt-4">
            {v.signIn}
          </Link>
        )}
        <p className="ow-battle-note">{v.saved}</p>

        <div className="ow-battle-next">
          <span className="ow-eyebrow text-[#804426]">{v.nextTitle}</span>
          <p>{nextHref ? nextTitle ?? v.walkNext : v.allClear}</p>
        </div>

        <div className="ow-battle-actions">
          {nextHref && (
            <Link href={nextHref} className="ow-btn-primary">
              {v.walkNext}
            </Link>
          )}
          <Link href={backHref} className="ow-btn-quiet">
            {v.exploreMap}
          </Link>
        </div>
      </div>
    </div>
  );
}
