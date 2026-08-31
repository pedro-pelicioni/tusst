"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Craft VII, made touchable: the context window is a budget, not a container.
// Toggle what goes on the bench and two things move at once — how much room
// is left, and how much of what is there is actually about the task.
//
// The costs are illustrative, not a tokenizer. What they reproduce faithfully
// is the SHAPE of the problem: the relevant material is small, the tempting
// "just send the whole repo" is not, and noise does not sit quietly beside
// the signal — it takes its room and its share of the attention.

const BUDGET = 100;

/** Index order matches `visuals.contextWindow.items` in every locale. */
const ITEMS = [
  { cost: 22, signal: true }, // the refund module
  { cost: 14, signal: true }, // the refund rules from the spec
  { cost: 10, signal: true }, // the failing test
  { cost: 140, signal: false }, // the whole repository
  { cost: 18, signal: false }, // last month's migration notes
  { cost: 12, signal: false }, // the README
  { cost: 16, signal: false }, // a dead-code file nobody deleted
] as const;

const SIGNAL_COUNT = ITEMS.filter((i) => i.signal).length;

export function ContextWindowSim() {
  const m = useMessages().visuals.contextWindow;
  const [on, setOn] = useState<boolean[]>(() => ITEMS.map(() => false));

  const picked = ITEMS.filter((_, i) => on[i]);
  const used = picked.reduce((a, it) => a + it.cost, 0);
  const signalUsed = picked
    .filter((it) => it.signal)
    .reduce((a, it) => a + it.cost, 0);
  const noiseUsed = used - signalUsed;
  const signalOn = picked.filter((it) => it.signal).length;

  const verdict =
    used === 0
      ? { text: m.starving, tone: "bad" as const }
      : used > BUDGET
        ? { text: m.overflow, tone: "bad" as const }
        : noiseUsed > 0
          ? {
              text: m.noisy.replace(
                "{percent}",
                String(Math.round((noiseUsed / used) * 100)),
              ),
              tone: "warn" as const,
            }
          : signalOn === SIGNAL_COUNT
            ? { text: m.clean, tone: "good" as const }
            : { text: m.partial, tone: "warn" as const };

  // Bars are capped at the budget so an overflowing bench reads as "full and
  // then some" rather than silently rescaling — truncation is the lesson.
  const pct = (n: number) => `${Math.min(100, (n / BUDGET) * 100)}%`;

  return (
    <div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
        {m.benchLabel}
      </p>

      <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full bg-accent/70 transition-[width] duration-300"
          style={{ width: pct(signalUsed) }}
        />
        <div
          className="h-full bg-red-500/60 transition-[width] duration-300"
          style={{ width: pct(noiseUsed) }}
        />
      </div>
      <p className="mt-1.5 font-mono text-[9.5px] tracking-[0.14em] text-muted2">
        {m.usedLabel
          .replace("{used}", String(used))
          .replace("{budget}", String(BUDGET))}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ITEMS.map((item, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={on[i]}
            onClick={() =>
              setOn((prev) => prev.map((v, j) => (j === i ? !v : v)))
            }
            className={`rounded-lg border px-3 py-2 text-left text-[12px] transition ${
              on[i]
                ? item.signal
                  ? "border-accent/60 bg-accent/12 text-fg"
                  : "border-red-500/50 bg-red-500/10 text-fg"
                : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
            }`}
          >
            {m.items[i]}
            <span className="ml-2 font-mono text-[9.5px] text-muted">
              {item.cost}
            </span>
          </button>
        ))}
      </div>

      <p
        className={`mt-4 text-[12.5px] leading-relaxed ${
          verdict.tone === "good"
            ? "text-pop"
            : verdict.tone === "warn"
              ? "text-gold"
              : "text-red-400"
        }`}
      >
        {verdict.text}
      </p>

      <button
        type="button"
        onClick={() => setOn(ITEMS.map(() => false))}
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
