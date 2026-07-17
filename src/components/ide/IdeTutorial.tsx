"use client";

import { useEffect, useMemo, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";

// First-visit walkthrough for the Forge IDE. Sequential popover (no
// spotlight mask — cheaper to build, no library on hand) pointing at each
// `data-tutorial-id` target in IdeShell. Persistence lives in forge-store.

const STEP_ORDER = [
  "projects",
  "fileTree",
  "editor",
  "build",
  "console",
  "wallet",
  "panels",
] as const;

const POPOVER_WIDTH = 320;
const POPOVER_EST_HEIGHT = 200;
const MARGIN = 12;

function measureTarget(stepKey: string): DOMRect | null {
  const el = document.querySelector(`[data-tutorial-id="${stepKey}"]`);
  return el ? el.getBoundingClientRect() : null;
}

export function IdeTutorial({ onDone }: { onDone: () => void }) {
  const m = useMessages();
  const [index, setIndex] = useState(0);
  // Resize is the only genuine external event here — the listener only ever
  // sets state from inside its own callback, never synchronously in the
  // effect body, so it counts as the "subscribe + setState in a callback"
  // pattern rather than the "setState in an effect" one.
  const [resizeTick, setResizeTick] = useState(0);

  useEffect(() => {
    const onResize = () => setResizeTick((t) => t + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const stepKey = STEP_ORDER[index];
  // Derived at render time, not in an effect — resizeTick is only a
  // recompute trigger, the DOM query itself has no dependency of its own.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rect = useMemo(() => measureTarget(stepKey), [stepKey, resizeTick]);

  const step = m.ide.tutorial.steps[stepKey];
  const isLast = index === STEP_ORDER.length - 1;

  let top = rect ? rect.bottom + MARGIN : window.innerHeight / 2 - POPOVER_EST_HEIGHT / 2;
  let left = rect ? rect.left : window.innerWidth / 2 - POPOVER_WIDTH / 2;
  if (rect && top + POPOVER_EST_HEIGHT > window.innerHeight) {
    top = Math.max(MARGIN, rect.top - POPOVER_EST_HEIGHT - MARGIN);
  }
  left = Math.min(Math.max(MARGIN, left), window.innerWidth - POPOVER_WIDTH - MARGIN);
  top = Math.min(Math.max(MARGIN, top), window.innerHeight - POPOVER_EST_HEIGHT - MARGIN);

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/60" />
      {rect && (
        <div
          className="pointer-events-none fixed z-[101] rounded-lg border-2 border-accent transition-all"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: "0 0 0 4px rgba(143,123,255,0.25)",
          }}
        />
      )}
      <div
        className="fixed z-[102] rounded-xl border border-line bg-[#0b0817] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        style={{ top, left, width: POPOVER_WIDTH }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70">
          {fmt(m.ide.tutorial.stepCounter, { current: index + 1, total: STEP_ORDER.length })}
        </p>
        <h3 className="mt-2 font-display text-base text-fg">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted2">{step.body}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onDone}
            className="font-mono text-[11px] text-muted transition hover:text-fg"
          >
            {m.ide.tutorial.skip}
          </button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={() => setIndex((i) => i - 1)}
                className="rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted2 transition hover:border-line-strong hover:text-fg"
              >
                {m.ide.tutorial.back}
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? onDone() : setIndex((i) => i + 1))}
              className="rounded-full px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[1px]"
              style={{
                background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                boxShadow: "0 0 20px rgba(143,123,255,0.35)",
              }}
            >
              {isLast ? m.ide.tutorial.done : m.ide.tutorial.next}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
