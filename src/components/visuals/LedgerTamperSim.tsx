"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { chainFingerprints } from "./hash";

// Chapter I, made touchable: four ledger pages, each carrying a real SHA-256
// fingerprint of the page before it. Edit any page and every page after it
// stops matching, in a cascade.
//
// This is the one sentence the chapter spends three paragraphs on — "one edit
// far in the past breaks every page that followed it" — and reading it is not
// the same as breaking it yourself.

const SHOWN = 10; // hex characters; the full 64 is noise on a phone

export function LedgerTamperSim() {
  const m = useMessages().visuals.ledgerTamper;
  const original = useRef<string[]>(m.pages);
  const [texts, setTexts] = useState<string[]>(m.pages);
  const [sealed, setSealed] = useState<string[]>([]);
  const [current, setCurrent] = useState<string[]>([]);

  // The sealed chain is computed once, from the pristine pages: it is what the
  // other eleven copies of the book still hold.
  useEffect(() => {
    let alive = true;
    void chainFingerprints(original.current).then((fps) => {
      if (alive) {
        setSealed(fps);
        setCurrent(fps);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    void chainFingerprints(texts).then((fps) => {
      if (alive) setCurrent(fps);
    });
    return () => {
      alive = false;
    };
  }, [texts]);

  const edit = useCallback((index: number, value: string) => {
    setTexts((prev) => prev.map((t, i) => (i === index ? value : t)));
  }, []);

  const broken = (i: number) =>
    sealed.length > i && current.length > i && sealed[i] !== current[i];

  return (
    <div aria-label={m.aria}>
      <ol className="flex flex-col gap-2">
        {texts.map((text, i) => {
          const isBroken = broken(i);
          return (
            <li
              key={i}
              className={`rounded-xl border px-3 py-2.5 transition ${
                isBroken
                  ? "sc-dg-break border-ember/50 bg-ember/[0.07]"
                  : "border-line bg-white/[0.03]"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
                  {fmt(m.pageLabel, { n: i + 1 })}
                </span>
                <span
                  className={`font-mono text-[9.5px] uppercase tracking-[0.16em] ${
                    isBroken ? "text-ember" : "text-pop"
                  }`}
                >
                  {isBroken ? m.broken : m.ok}
                </span>
              </div>

              <input
                value={text}
                onChange={(e) => edit(i, e.target.value)}
                aria-label={fmt(m.pageLabel, { n: i + 1 })}
                className="mt-1.5 w-full rounded border border-line bg-bg px-2 py-1.5 text-[12.5px] text-fg outline-none focus:border-accent/60"
              />

              <dl className="mt-2 grid gap-x-3 gap-y-0.5 font-mono text-[9.5px] @sm:grid-cols-[auto_1fr]">
                {i > 0 && (
                  <>
                    <dt className="text-muted">{m.prevLabel}</dt>
                    <dd className="truncate text-muted2">
                      {current[i - 1]?.slice(0, SHOWN) ?? "…"}
                    </dd>
                  </>
                )}
                <dt className="text-muted">{m.ownLabel}</dt>
                <dd className={`truncate ${isBroken ? "text-ember" : "text-accent2"}`}>
                  {current[i]?.slice(0, SHOWN) ?? "…"}
                </dd>
              </dl>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="max-w-md text-[12px] leading-relaxed text-muted2">{m.hint}</p>
        <button
          type="button"
          onClick={() => setTexts(original.current)}
          className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted2 transition hover:border-line-strong hover:text-fg"
        >
          {m.reset}
        </button>
      </div>
    </div>
  );
}
