"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Realm, made touchable: the same transfer, seen from the outside, under three
// privacy layers.
//
// Deliberately NOT a cryptography demo. Faking a zero-knowledge proof in a
// widget would teach a wrong mechanism, which is worse than teaching none.
// What this shows is the only thing a reader actually needs to choose a layer:
// which fields an observer still reads, and which one went dark.

type Layer = 0 | 1 | 2;
/** rows × layers → is the field visible to an outside observer? */
const VISIBLE: boolean[][] = [
  //  public, confidential token, SPP pool
  [true, true, false], // sender
  [true, true, false], // receiver
  [true, false, false], // amount
  [true, true, true], // that *something* happened
];

export function ExplorerViewSim() {
  const m = useMessages().visuals.explorerView;
  const [layer, setLayer] = useState<Layer>(0);

  return (
    <div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
        {m.layerLabel}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {m.layers.map((label, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={layer === i}
            onClick={() => setLayer(i as Layer)}
            className={`rounded-lg border px-3 py-2 text-[12px] transition ${
              layer === i
                ? "border-accent/60 bg-accent/12 text-fg"
                : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
        {m.observerLabel}
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        {m.fields.map((field, r) => {
          const seen = VISIBLE[r][layer];
          return (
            <div
              key={r}
              className={`flex items-baseline justify-between rounded-lg border px-3 py-2 text-[12px] ${
                seen
                  ? "border-line bg-bg-elev text-fg"
                  : "border-emerald-400/40 bg-emerald-400/[0.07] text-muted2"
              }`}
            >
              <span>{field}</span>
              <span className="font-mono text-[11px]">
                {seen ? m.visible : m.hidden}
              </span>
            </div>
          );
        })}
      </div>

      <p
        className={`mt-4 text-[12.5px] leading-relaxed ${
          layer === 0 ? "text-gold" : "text-pop"
        }`}
      >
        {m.verdicts[layer]}
      </p>

      <p className="mt-3 font-mono text-[9.5px] leading-relaxed tracking-[0.12em] text-muted">
        {m.hint}
      </p>
    </div>
  );
}
