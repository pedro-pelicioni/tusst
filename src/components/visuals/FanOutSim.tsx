"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Craft XIII, made touchable: the same four tasks, three schedules.
//
// Everyone accepts that parallel beats sequential. The lesson people miss is
// the second comparison — a BARRIER (wait for every task to finish stage one
// before any of them starts stage two) versus a PIPELINE (each task walks its
// own stages). They are identical when every task takes the same time, and
// wildly different when they do not. The barrier's true cost is variance,
// which is exactly the thing a sentence cannot show.

/** [stage one, stage two] per task. */
const UNEVEN: [number, number][] = [
  [1, 5],
  [5, 1],
  [2, 3],
  [4, 2],
];
const EVEN: [number, number][] = [
  [3, 3],
  [3, 3],
  [3, 3],
  [3, 3],
];

const sequential = (t: [number, number][]) =>
  t.reduce((a, [x, y]) => a + x + y, 0);
const barrier = (t: [number, number][]) =>
  Math.max(...t.map((s) => s[0])) + Math.max(...t.map((s) => s[1]));
const pipeline = (t: [number, number][]) =>
  Math.max(...t.map(([x, y]) => x + y));

export function FanOutSim() {
  const m = useMessages().visuals.fanOut;
  const [uneven, setUneven] = useState(true);
  const tasks = uneven ? UNEVEN : EVEN;

  const rows = [
    { label: m.sequential, value: sequential(tasks), tone: "bg-red-500/60" },
    { label: m.barrier, value: barrier(tasks), tone: "bg-gold/60" },
    { label: m.pipeline, value: pipeline(tasks), tone: "bg-accent/70" },
  ];
  const worst = Math.max(...rows.map((r) => r.value));

  return (
    <div>
      <button
        type="button"
        aria-pressed={uneven}
        onClick={() => setUneven((v) => !v)}
        className={`rounded-lg border px-3 py-2 text-[12px] transition ${
          uneven
            ? "border-accent/60 bg-accent/12 text-fg"
            : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
        }`}
      >
        {uneven ? m.unevenOn : m.unevenOff}
      </button>

      <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
        {m.tasksLabel}{" "}
        {tasks.map(([a, b]) => `${a}+${b}`).join(" · ")}
      </p>

      <div className="mt-3 flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted2">
                {r.label}
              </span>
              <span className="font-mono text-[11px] text-fg">
                {m.units.replace("{n}", String(r.value))}
              </span>
            </div>
            <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${r.tone}`}
                style={{ width: `${(r.value / worst) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p
        className={`mt-4 text-[12.5px] leading-relaxed ${
          uneven ? "text-pop" : "text-gold"
        }`}
      >
        {uneven ? m.verdictUneven : m.verdictEven}
      </p>

      <p className="mt-3 font-mono text-[9.5px] leading-relaxed tracking-[0.12em] text-muted">
        {m.hint}
      </p>
    </div>
  );
}
