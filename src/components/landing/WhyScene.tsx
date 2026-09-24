// "Why learn it the old way": the answer to "why would anyone still learn
// this, with AI writing the code?", told in two scenes.
//
//   1. The Seal — the golem scribe (the model) writes without end while the
//      apprentice reads the one contract before sealing it. Thesis, lead,
//      and the hard truth as a pull quote.
//   2. The Trial — three questions every builder shipping on Stellar should
//      answer without asking a model. Answers hide behind native <details>
//      (no client JS), each one pointing at the Journey chapter that teaches
//      it; then the multiplier line and the way in.
//
// The truth is told about the phenomenon, never about a case: no program, no
// team, no network named. The questions turn it into a mirror instead.

import Link from "next/link";
import type { Messages } from "@/i18n/messages";
import { Particles } from "./Particles";
import { SceneLayers } from "./SceneLayers";

const NUMERALS = ["I", "II", "III"];

export function WhyScene({
  m,
  beginHref,
  chapterTitles,
}: {
  m: Messages["landing"];
  beginHref: string;
  /** Journey chapter slug → localized title, resolved on the server */
  chapterTitles: Record<string, string>;
}) {
  const w = m.why;

  return (
    <>
      <section id="why" data-scene className="ld-scene ld-scene--why flex min-h-[max(100svh,720px)] items-center">
        {/* no parallax here: the layer bleed would zoom the art 12% and crop the
            golem out of the top-right corner, and he is half the metaphor */}
        <SceneLayers layers={[{ src: "/landing/why/scene.webp", className: "object-[52%_50%]" }]} />
        <div aria-hidden className="ld-scrim ld-scrim--why" />
        <Particles tone="why" count={8} />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12">
          <div className="max-w-xl">
            <div data-reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-gold">{w.eyebrow}</p>
              <h2 className="mt-5 font-display text-[clamp(32px,4.8vw,58px)] font-black uppercase leading-[1.04] text-fg">
                <span className="block [text-wrap:balance]">{w.titleTop}</span>
                <span className="block text-gold [text-wrap:balance]">{w.titleBottom}</span>
              </h2>
              <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-fg/80">{w.lead}</p>
            </div>

            <figure className="ld-truth mt-9 max-w-lg" data-reveal="2">
              <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-ember">{w.truthKicker}</p>
              <blockquote className="mt-4 text-[clamp(19px,2.1vw,24px)] font-medium leading-snug text-fg">
                {w.truth}
              </blockquote>
              <figcaption className="mt-4 max-w-lg text-[14px] leading-relaxed text-muted2">{w.truthNote}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="trial" data-scene className="ld-scene ld-scene--trial">
        <Particles tone="why" count={6} />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:px-12 md:py-28">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <h2 className="font-display text-[clamp(28px,4.2vw,46px)] font-black uppercase leading-[1.08] text-fg [text-wrap:balance]">
              {w.quizKicker}
            </h2>
          </div>

          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {w.questions.map((question, i) => (
              <li key={question.chapterSlug + i} data-reveal={String(i + 2)}>
                <div className="ld-trial-card h-full">
                  <p className="flex items-baseline justify-between gap-4">
                    <span aria-hidden className="font-display text-[26px] font-black text-gold">
                      {NUMERALS[i]}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-soft">
                      {question.topic}
                    </span>
                  </p>
                  <h3 className="mt-4 text-[17px] font-semibold leading-snug text-fg">{question.q}</h3>

                  <details className="ld-trial-reveal mt-auto pt-6">
                    <summary className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4">
                      {w.reveal}
                    </summary>
                    <div className="ld-trial-answer mt-4 border-t border-white/10 pt-4">
                      <p className="text-[14px] leading-relaxed text-fg/85">{question.a}</p>
                      {chapterTitles[question.chapterSlug] ? (
                        <Link
                          href={`/journey/${question.chapterSlug}`}
                          className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-soft underline decoration-accent/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-4"
                        >
                          {w.taughtIn} · {chapterTitles[question.chapterSlug]} →
                        </Link>
                      ) : null}
                    </div>
                  </details>
                </div>
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-10 max-w-xl text-center text-[14px] leading-relaxed text-accent-soft" data-reveal>
            {w.quizNewcomer}
          </p>

          <div className="mx-auto mt-20 flex max-w-3xl flex-col items-center text-center" data-reveal>
            <span aria-hidden className="h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <p className="mt-10 font-display text-[clamp(24px,3.6vw,40px)] font-black uppercase leading-[1.12] text-fg [text-wrap:balance]">
              {w.multiplier}
            </p>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted2">{w.closing}</p>
            <Link href={beginHref} className="ld-btn-pixel mt-10">
              {w.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
