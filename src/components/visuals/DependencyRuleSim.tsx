"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Craft V, made touchable. The dependency rule is one sentence — "source-code
// dependencies point inward, only" — and prose cannot show its shape. A
// matrix can: legal imports fill the lower triangle and nothing else, so the
// law stops being a slogan and becomes a picture you can break on purpose.
//
// Rings are ordered inner → outer, so row i importing column j is legal
// exactly when j <= i: an outer ring may name an inner one (or its own), and
// never the reverse.

const RINGS = 4;

export function DependencyRuleSim() {
  const m = useMessages().visuals.dependencyRule;
  // picked[i][j] — "the code in ring i imports from ring j"
  const [picked, setPicked] = useState<boolean[][]>(() =>
    Array.from({ length: RINGS }, () => Array<boolean>(RINGS).fill(false)),
  );

  const legal = (i: number, j: number) => j <= i;
  const breaches = picked.flatMap((row, i) =>
    row.map((on, j) => (on && !legal(i, j) ? 1 : 0)),
  ).reduce<number>((a, b) => a + b, 0);
  const chosen = picked.flat().filter(Boolean).length;

  const verdict =
    chosen === 0
      ? { text: m.empty, tone: "idle" as const }
      : breaches === 0
        ? { text: m.clean, tone: "good" as const }
        : { text: m.breached.replace("{n}", String(breaches)), tone: "bad" as const };

  return (
    <div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
        {m.matrixLabel}
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="border-separate border-spacing-1 text-left">
          <thead>
            <tr>
              <th className="pr-2" />
              {m.rings.map((r, j) => (
                <th
                  key={j}
                  className="px-1 pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted"
                >
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.rings.map((r, i) => (
              <tr key={i}>
                <th className="pr-2 text-right font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                  {r}
                </th>
                {m.rings.map((_, j) => {
                  const on = picked[i][j];
                  const ok = legal(i, j);
                  return (
                    <td key={j}>
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`${m.rings[i]} → ${m.rings[j]}`}
                        onClick={() =>
                          setPicked((prev) =>
                            prev.map((row, ri) =>
                              row.map((v, cj) => (ri === i && cj === j ? !v : v)),
                            ),
                          )
                        }
                        className={`h-9 w-16 rounded border text-[10px] transition ${
                          on
                            ? ok
                              ? "border-emerald-400/60 bg-emerald-400/15 text-fg"
                              : "border-red-500/60 bg-red-500/20 text-fg"
                            : "border-line bg-bg-elev hover:border-line-strong"
                        }`}
                      >
                        {on ? (ok ? "✓" : "✕") : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
        {m.axes}
      </p>

      <p
        className={`mt-4 text-[12.5px] leading-relaxed ${
          verdict.tone === "good"
            ? "text-pop"
            : verdict.tone === "bad"
              ? "text-red-400"
              : "text-muted"
        }`}
      >
        {verdict.text}
      </p>

      <button
        type="button"
        onClick={() =>
          setPicked(Array.from({ length: RINGS }, () => Array<boolean>(RINGS).fill(false)))
        }
        className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted2 underline-offset-4 hover:text-fg hover:underline"
      >
        {m.reset}
      </button>

      <p className="mt-3 font-mono text-[9.5px] leading-relaxed tracking-[0.12em] text-muted">
        {m.hint}
      </p>
    </div>
  );
}
