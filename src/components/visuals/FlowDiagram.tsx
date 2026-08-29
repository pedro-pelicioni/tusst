"use client";

import { useEffect, useRef, useState } from "react";
import type { DiagramNode } from "@/content/visuals/types";
import { useReducedMotion } from "./use-reduced-motion";
import { toneClass } from "./tone";

// Ordered stages with connectors. Serves the spec→tests→forge road, the
// red-green-refactor cycle, the agentic loop, a transaction's lifecycle and a
// path payment's hops — which is why it is the primitive that earns its keep
// first.
//
// Two interactions, both real buttons: pick a stage to read its note, or press
// ▶ to walk them in order. Reduced motion turns the walk into a jump.

const STEP_MS = 900;

export function FlowDiagram({
  nodes,
  layout,
  play,
}: {
  nodes: DiagramNode[];
  layout: "row" | "cycle";
  play?: boolean;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const walk = () => {
    if (timer.current) clearTimeout(timer.current);
    if (reduced) {
      // No animation: land on the last stage immediately.
      setActive(nodes.length - 1);
      return;
    }
    setWalking(true);
    let i = 0;
    const tick = () => {
      setActive(i);
      i += 1;
      if (i < nodes.length) {
        timer.current = setTimeout(tick, STEP_MS);
      } else {
        setWalking(false);
      }
    };
    tick();
  };

  const note = active !== null ? nodes[active]?.note : undefined;

  return (
    <div className="@container">
      <ol className="flex flex-col gap-2 @md:flex-row @md:items-stretch">
        {nodes.map((node, i) => (
          <li key={node.id} className="flex items-center gap-2 @md:flex-1 @md:flex-col">
            <button
              type="button"
              onClick={() => setActive(active === i ? null : i)}
              aria-pressed={active === i}
              className={`w-full rounded-xl border px-3 py-2.5 text-left transition @md:text-center ${toneClass(
                node.tone,
              )} ${
                active === i
                  ? "ring-1 ring-accent/60 sc-dg-pulse"
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] opacity-70">
                {i + 1}
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug">
                {node.label}
              </span>
            </button>
            {i < nodes.length - 1 && (
              <span aria-hidden className="shrink-0 text-muted @md:hidden">
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>

      {layout === "cycle" && (
        <p
          aria-hidden
          className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
        >
          ↺ {nodes[0]?.label}
        </p>
      )}

      <div className="mt-3 flex min-h-[2.5rem] items-start gap-3">
        {play && (
          <button
            type="button"
            onClick={walk}
            disabled={walking}
            className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition hover:bg-accent/20 disabled:opacity-50"
          >
            ▶
          </button>
        )}
        {note && (
          <p key={active} className="sc-dg-in text-[12.5px] leading-relaxed text-muted2">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
