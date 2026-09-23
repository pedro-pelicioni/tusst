"use client";

// Top-left hero card (portrait, level, form, XP) and the "My hero" gallery
// of the 8 forms. Signed-out visitors get the default hero and a sign-in nudge.

import { useRef } from "react";
import type { HeroView } from "@/content/overworld/types";
import { HERO_FORMS } from "@/content/heroes";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { xpToNextForm } from "@/lib/hero";
import { SignInLink } from "@/components/SignInLink";
import { HeroPortrait } from "./HeroFigure";
import Link from "next/link";

export function HeroHud({ hero, changeHref }: { hero: HeroView; changeHref: string }) {
  const m = useMessages();
  const h = m.overworld.hud;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const heroCopy = m.overworld.heroes[hero.id];
  const toNext = xpToNextForm(hero.xp);

  return (
    <>
      <button
        type="button"
        className="ow-hud ow-panel-wood left-3 top-3 flex w-[270px] items-center gap-3 p-2.5 text-left max-md:left-2 max-md:top-2 max-md:w-[178px] max-md:gap-2 max-md:p-1.5"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={h.formsTitle}
      >
        <HeroPortrait hero={hero} size={56} className="shrink-0 max-md:!h-11 max-md:!w-11" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-[#eac990]">{hero.name}</span>
          <span className="ow-eyebrow mt-0.5 block truncate text-[8px] text-[#f7d98e]">
            {fmt(h.levelOf, { level: hero.level, max: HERO_FORMS, hero: heroCopy.name.toUpperCase() })}
          </span>
          <span className="block text-[12px] text-[#fff2cd]">{hero.formName}</span>
          <span className="ow-bar mt-1.5 block">
            <span style={{ width: `${Math.max(4, Math.min(100, hero.percent))}%` }} />
          </span>
          <span className="mt-0.5 block text-[10px] text-[#d5b994]">{fmt(h.xp, { xp: hero.xp.toLocaleString() })}</span>
        </span>
      </button>

      {!hero.signedIn && (
        <SignInLink className="ow-hud ow-btn-dark left-3 top-[104px] text-[11px] max-md:left-2 max-md:top-[92px] max-md:text-[10px]">
          ✦ {h.signInToSave}
        </SignInLink>
      )}

      <dialog ref={dialogRef} className="ow-dialog" aria-label={h.formsTitle}>
        <div className="ow-dialog-inner">
          <div className="ow-dialog-top">
            <span>◆ {h.formsTitle}</span>
            <button type="button" className="ow-close" onClick={() => dialogRef.current?.close()} aria-label="×">
              ×
            </button>
          </div>
          <div className="ow-dialog-body">
            <div className="flex items-center gap-4">
              <HeroPortrait hero={hero} size={72} />
              <div>
                <p className="ow-eyebrow text-[#804426]">
                  {fmt(h.level, { level: hero.level })} · {fmt(h.xp, { xp: hero.xp })}
                </p>
                <h2 className="ow-title mt-1 text-[#6d2630]">{hero.formName}</h2>
                <p className="text-[12.5px] text-[#583c27]">
                  {heroCopy.role} · {toNext > 0 ? fmt(h.nextForm, { xp: toNext }) : h.maxForm}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[12.5px] text-[#75583c]">
              {fmt(h.formsIntro, { hero: heroCopy.name, role: heroCopy.role })}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {heroCopy.forms.map((name, i) => {
                const locked = i > hero.form;
                return (
                  <div
                    key={name}
                    className={`ow-form-cell ${i === hero.form ? "is-current" : ""} ${locked ? "is-locked" : ""}`}
                  >
                    <HeroPortrait hero={hero} form={i} size={64} className="mx-auto" />
                    <p className="ow-eyebrow mt-2 text-[#804426]">
                      {fmt(h.level, { level: i + 1 })} {locked ? "⌑" : "✓"}
                    </p>
                    <p className="text-[11px] font-semibold text-[#3a2416]">{name}</p>
                  </div>
                );
              })}
            </div>
            {hero.signedIn && (
              <Link href={changeHref} className="ow-btn-quiet mt-4">
                {h.changeHero}
              </Link>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
