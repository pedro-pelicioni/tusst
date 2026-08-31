"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Craft VIII, made touchable: least privilege, priced.
//
// Two meters move independently, and that is the entire lesson. The first
// four grants buy nearly all the capability a fix-and-prove task needs. The
// last three buy almost none — and carry the blast radius that turns a
// confidently wrong plan at 2 a.m. into an incident. Prose can assert that;
// only two diverging bars can show it.

/** Index order matches `visuals.blastRadius.grants` in every locale. */
const GRANTS = [
  { power: 3, blast: 1 }, // read the repo
  { power: 3, blast: 1 }, // run the test suite
  { power: 3, blast: 2 }, // write files in one directory
  { power: 2, blast: 2 }, // testnet keys
  { power: 0, blast: 4 }, // write files anywhere
  { power: 1, blast: 4 }, // open network access
  { power: 0, blast: 6 }, // mainnet signing keys
] as const;

/** The four that a fix-and-prove task actually needs. */
const ESSENTIAL = [0, 1, 2, 3];
const MAX_POWER = GRANTS.reduce((a, g) => a + g.power, 0);
const MAX_BLAST = GRANTS.reduce((a, g) => a + g.blast, 0);

export function BlastRadiusSim() {
  const m = useMessages().visuals.blastRadius;
  const [on, setOn] = useState<boolean[]>(() => GRANTS.map(() => false));

  const power = GRANTS.reduce((a, g, i) => a + (on[i] ? g.power : 0), 0);
  const blast = GRANTS.reduce((a, g, i) => a + (on[i] ? g.blast : 0), 0);
  const chosen = on.filter(Boolean).length;
  const essentialsOn = ESSENTIAL.every((i) => on[i]);
  const extrasOn = on.some((v, i) => v && !ESSENTIAL.includes(i));

  const verdict =
    chosen === 0
      ? { text: m.void, tone: "idle" as const }
      : essentialsOn && !extrasOn
        ? { text: m.tight, tone: "good" as const }
        : extrasOn
          ? { text: m.overGranted, tone: "bad" as const }
          : { text: m.partial, tone: "idle" as const };

  const bar = (label: string, value: number, max: number, tone: string) => (
    <div className="mt-2">
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full transition-[width] duration-300 ${tone}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
        {m.grantsLabel}
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        {m.grants.map((g, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={on[i]}
            onClick={() => setOn((p) => p.map((v, j) => (j === i ? !v : v)))}
            className={`rounded-lg border px-3 py-2 text-left text-[12px] transition ${
              on[i]
                ? GRANTS[i].blast >= 4
                  ? "border-red-500/55 bg-red-500/10 text-fg"
                  : "border-accent/60 bg-accent/12 text-fg"
                : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
            }`}
          >
            {g}
            {on[i] && (
              <span className="mt-0.5 block font-mono text-[9.5px] text-muted">
                {m.worstCases[i]}
              </span>
            )}
          </button>
        ))}
      </div>

      {bar(m.powerLabel, power, MAX_POWER, "bg-accent/70")}
      {bar(m.blastLabel, blast, MAX_BLAST, "bg-red-500/60")}

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
        onClick={() => setOn(GRANTS.map(() => false))}
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
