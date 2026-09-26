"use client";

// Three replayable slides on first entry. Never touches progress; the
// "seen" flag lives in localStorage so the dialog stays out of the way.

import { useEffect, useRef, useState } from "react";
import type { HeroView } from "@/content/overworld/types";
import { HERO_FORMS } from "@/content/heroes";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { HeroFigure } from "./HeroFigure";

export const TUTORIAL_KEY = "tusst:ow:tutorial:v1";

export function TutorialDialog({ hero, forceOpen = false }: { hero: HeroView; forceOpen?: boolean }) {
  const t = useMessages().overworld.tutorial;
  const ref = useRef<HTMLDialogElement | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(TUTORIAL_KEY) === "1";
    } catch {
      /* ignore */
    }
    if ((forceOpen || !seen) && ref.current && !ref.current.open) {
      const id = window.setTimeout(() => ref.current?.showModal(), 350);
      return () => window.clearTimeout(id);
    }
  }, [forceOpen]);

  const done = () => {
    try {
      window.localStorage.setItem(TUTORIAL_KEY, "1");
    } catch {
      /* ignore */
    }
    ref.current?.close();
  };

  const slide = t.slides[step];
  const last = step === t.slides.length - 1;

  return (
    <dialog ref={ref} className="ow-dialog" aria-label={t.header} onClose={done}>
      <div className="ow-dialog-inner">
        <div className="ow-dialog-top">
          <span>◆ {t.header}</span>
          <button type="button" className="ow-close" onClick={done} aria-label="×">
            ×
          </button>
        </div>
        <div className="ow-dialog-body text-center">
          <div className={`ow-dialog-demo ${step === 0 ? "is-walk" : ""}`} aria-hidden>
            {step === 2 ? (
              <>
                <span className="ow-hero">
                  <HeroFigure hero={hero} form={0} />
                </span>
                <span className="ow-keys">→</span>
                <span className="ow-hero is-divine">
                  <HeroFigure hero={hero} form={HERO_FORMS - 1} />
                </span>
              </>
            ) : (
              <>
                <span className="ow-hero">
                  <HeroFigure hero={hero} />
                </span>
                <span className="ow-keys">{step === 0 ? "▶\n↓\n✦" : "VS"}</span>
                {step === 1 && <span className="ow-glyph text-[42px]">☠</span>}
              </>
            )}
          </div>
          <p className="ow-eyebrow text-[#804426]">{slide.tag}</p>
          <h2 className="ow-title mt-2 text-[18px] text-[#6d2630]">{slide.title}</h2>
          <p className="mx-auto mt-2 max-w-[420px] text-[14px] leading-relaxed text-[#62412a]">{slide.body}</p>
          <div className="ow-dots" aria-label={fmt(t.stepOf, { current: step + 1, total: t.slides.length })}>
            {t.slides.map((s, i) => (
              <span key={s.tag} className={i === step ? "is-active" : ""} />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {step > 0 && (
              <button type="button" className="ow-btn-quiet !w-auto px-4" onClick={() => setStep((s) => s - 1)}>
                {t.back}
              </button>
            )}
            <button
              type="button"
              className="ow-btn-primary flex-1"
              onClick={() => (last ? done() : setStep((s) => s + 1))}
            >
              {last ? t.ready : t.next}
            </button>
          </div>
          <button type="button" className="mt-3 text-[12px] text-[#715339] underline" onClick={done}>
            {t.skip}
          </button>
        </div>
      </div>
    </dialog>
  );
}
