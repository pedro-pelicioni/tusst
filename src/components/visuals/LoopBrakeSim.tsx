"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Craft IX, made touchable: two switches, four outcomes.
//
// The point the chapter cannot make in prose is the boring one — brakes on a
// healthy loop change nothing at all. You only learn what they were for on
// the run where the feedback lies, and by then an unbraked loop has already
// spent the budget and edited code that was never broken.
//
// The run is deterministic on purpose (a fixed phantom schedule, no
// Math.random): the same switches must always tell the same story, or the
// lesson is luck.

const EVALS = 7;
const CEILING = 12;
const RUNAWAY = 200;
const NO_PROGRESS_TURNS = 3;

/** Iterations on which flaky feedback reports a red that isn't real. */
const PHANTOM_EVERY = 2;

type Outcome = "converged" | "escalated" | "burning";

interface Run {
  turns: { n: number; green: number; phantom: boolean }[];
  outcome: Outcome;
  phantomFixes: number;
  iterations: number;
}

function simulate(brakes: boolean, flaky: boolean): Run {
  const turns: Run["turns"] = [];
  let green = 2;
  let phantomFixes = 0;
  // No-progress is measured against the BEST score seen, never against the
  // previous turn: flaky feedback makes the score oscillate, and a loop that
  // alternates 3-2-3-2 has made no progress at all while looking busy every
  // single turn. Comparing to the previous turn would never fire here, which
  // is precisely the run the brakes exist for.
  let best = green;
  let stagnant = 0;
  const limit = brakes ? CEILING : RUNAWAY;

  for (let n = 1; n <= limit; n++) {
    const phantom = flaky && n % PHANTOM_EVERY === 0;
    if (phantom) {
      // A red that was never real. The loop believes it and "repairs"
      // working code, which is how noise turns into committed damage.
      green = Math.max(0, green - 1);
      phantomFixes++;
    } else if (green < EVALS) {
      green++;
    }
    turns.push({ n, green, phantom });

    if (green >= EVALS) return { turns, outcome: "converged", phantomFixes, iterations: n };

    if (green > best) {
      best = green;
      stagnant = 0;
    } else {
      stagnant++;
    }
    if (brakes && stagnant >= NO_PROGRESS_TURNS) {
      return { turns, outcome: "escalated", phantomFixes, iterations: n };
    }
  }
  return { turns, outcome: "burning", phantomFixes, iterations: limit };
}

export function LoopBrakeSim() {
  const m = useMessages().visuals.loopBrake;
  const [brakes, setBrakes] = useState(true);
  const [flaky, setFlaky] = useState(false);
  const [run, setRun] = useState<Run | null>(null);

  const toggle = (active: boolean, label: string, onClick: () => void) => (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        onClick();
        setRun(null);
      }}
      className={`rounded-lg border px-3 py-2 text-[12px] transition ${
        active
          ? "border-accent/60 bg-accent/12 text-fg"
          : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
      }`}
    >
      {label}
    </button>
  );

  const verdict = run
    ? run.outcome === "converged"
      ? brakes
        ? m.convergedBraked
        : m.convergedUnbraked
      : run.outcome === "escalated"
        ? m.escalated
        : m.burning
    : null;

  return (
    <div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
        {m.controlsLabel}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {toggle(brakes, brakes ? m.brakesOn : m.brakesOff, () => setBrakes((v) => !v))}
        {toggle(flaky, flaky ? m.feedbackFlaky : m.feedbackClean, () => setFlaky((v) => !v))}
      </div>

      <button
        type="button"
        onClick={() => setRun(simulate(brakes, flaky))}
        className="mt-3 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition hover:bg-accent/20"
      >
        {m.run}
      </button>

      {run && (
        <div className="mt-4 rounded-xl border border-line bg-white/[0.03] px-3 py-2.5">
          <div className="max-h-44 overflow-y-auto font-mono text-[11px] leading-relaxed">
            {run.turns.slice(0, 40).map((t) => (
              <div
                key={t.n}
                className={t.phantom ? "text-red-400" : "text-muted2"}
              >
                {m.logLine
                  .replace("{n}", String(t.n))
                  .replace("{green}", String(t.green))
                  .replace("{total}", String(EVALS))}
                {t.phantom ? ` — ${m.phantom}` : ""}
              </div>
            ))}
            {run.turns.length > 40 && (
              <div className="text-muted">
                {m.truncated.replace("{n}", String(run.turns.length - 40))}
              </div>
            )}
          </div>

          <p
            className={`mt-3 text-[12.5px] leading-relaxed ${
              run.outcome === "converged"
                ? "text-pop"
                : run.outcome === "escalated"
                  ? "text-gold"
                  : "text-red-400"
            }`}
          >
            {verdict
              ?.replace("{n}", String(run.iterations))
              .replace("{fixes}", String(run.phantomFixes))}
          </p>
        </div>
      )}

      <p className="mt-3 font-mono text-[9.5px] leading-relaxed tracking-[0.12em] text-muted">
        {m.hint}
      </p>
    </div>
  );
}
