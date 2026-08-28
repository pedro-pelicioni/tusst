"use client";

// The Council of Nodes — a deliberately small federated-voting simulator.
// Seven validators in three "orgs"; each declares a quorum slice (self + 4
// peers, threshold 3). Propose a ledger and acceptance ripples slice by
// slice; strike nodes down and watch the survivors either keep closing
// ledgers or STALL — never fork. Pure client, deterministic, no chain.
// Shared by the journey chapter (widget "scp-sim") and the scp-simulator lab.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";

const N = 7;
// Org grouping (colors): A = 0,1,2 · B = 3,4 · C = 5,6
const ORG: Record<number, "a" | "b" | "c"> = {
  0: "a", 1: "a", 2: "a", 3: "b", 4: "b", 5: "c", 6: "c",
};
// Quorum slices (include self), threshold 3-of-5.
const SLICES: number[][] = [
  [0, 1, 2, 3, 5],
  [1, 2, 0, 4, 6],
  [2, 0, 1, 3, 6],
  [3, 4, 0, 5, 1],
  [4, 3, 1, 6, 2],
  [5, 6, 0, 3, 2],
  [6, 5, 2, 4, 1],
];
const THRESHOLD = 3;
// A ledger closes when a working majority of the full council accepts —
// with this fixed topology, 4 of 7 approximates a real quorum.
const CLOSE_THRESHOLD = 4;
const TICK_MS = 600;

const NODE_LABELS = ["A1", "A2", "A3", "B1", "B2", "C1", "C2"];

type Phase = "idle" | "running" | "closed" | "stalled";
// Two-stage federated voting, simplified for teaching: a node VOTES for the
// proposal as soon as anyone in its slice has voted (nomination gossip),
// then ACCEPTS once THRESHOLD members of its slice are on board. Without
// the vote stage nothing can bootstrap past the proposer.
type NodeState = "idle" | "voted" | "accepted";

function positions(): { x: number; y: number }[] {
  const cx = 240;
  const cy = 168;
  const r = 118;
  return Array.from({ length: N }, (_, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

function nextWave(states: NodeState[], down: boolean[]): NodeState[] {
  const out = states.slice();
  // Vote gossip: hearing any slice member vote is enough to vote yourself.
  for (let n = 0; n < N; n++) {
    if (down[n] || out[n] !== "idle") continue;
    const heard = SLICES[n].some(
      (m) => m !== n && !down[m] && states[m] !== "idle",
    );
    if (heard) out[n] = "voted";
  }
  // Accept: THRESHOLD slice members (self included) on board.
  for (let n = 0; n < N; n++) {
    if (down[n] || out[n] !== "voted") continue;
    const onBoard = SLICES[n].filter(
      (m) => !down[m] && out[m] !== "idle",
    ).length;
    if (onBoard >= THRESHOLD) out[n] = "accepted";
  }
  return out;
}

export function ScpSim() {
  const m = useMessages().labs.sim;
  const pos = useMemo(() => positions(), []);
  const [down, setDown] = useState<boolean[]>(() => Array(N).fill(false));
  const [states, setStates] = useState<NodeState[]>(() => Array(N).fill("idle"));
  const [phase, setPhase] = useState<Phase>("idle");
  const [ledgers, setLedgers] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => stopTimer, []);

  const settle = useCallback((state: NodeState[]) => {
    const acceptedCount = state.filter((s) => s === "accepted").length;
    if (acceptedCount >= CLOSE_THRESHOLD) {
      setPhase("closed");
      setLedgers((l) => l + 1);
    } else {
      setPhase("stalled");
    }
  }, []);

  const propose = useCallback(() => {
    stopTimer();
    const proposer = down.findIndex((d) => !d);
    if (proposer === -1) {
      setPhase("stalled");
      return;
    }
    let state = Array(N).fill("idle") as NodeState[];
    state[proposer] = "voted";
    setStates(state);
    setPhase("running");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // No animation: settle to the fixpoint instantly.
      for (let i = 0; i < 2 * N; i++) state = nextWave(state, down);
      setStates(state);
      settle(state);
      return;
    }

    timer.current = setInterval(() => {
      setStates((prev) => {
        const next = nextWave(prev, down);
        const progressed = next.some((v, i) => v !== prev[i]);
        if (!progressed) {
          stopTimer();
          settle(next);
        }
        return next;
      });
    }, TICK_MS);
  }, [down, settle]);

  const toggleNode = (i: number) => {
    stopTimer();
    setDown((prev) => {
      const next = prev.slice();
      next[i] = !next[i];
      return next;
    });
    setStates(Array(N).fill("idle"));
    setPhase("idle");
  };

  const reset = () => {
    stopTimer();
    setDown(Array(N).fill(false));
    setStates(Array(N).fill("idle"));
    setPhase("idle");
    setLedgers(0);
  };

  const aliveStalled =
    phase === "stalled"
      ? states.filter((s, i) => s !== "accepted" && !down[i]).length
      : 0;
  const allDown = down.every(Boolean);

  const orgColor: Record<"a" | "b" | "c", string> = {
    a: "#8f7bff",
    b: "#45d6c4",
    c: "#d9b96a",
  };

  return (
    <div className="rounded-2xl border border-line bg-bg-elev/80 p-4">
      <svg viewBox="0 0 480 336" className="w-full" role="img" aria-label="SCP quorum simulator">
        {/* slice edges */}
        {SLICES.map((slice, n) =>
          slice
            .filter((peer) => peer !== n)
            .map((peer) => {
              const lit =
                states[n] !== "idle" &&
                states[peer] !== "idle" &&
                !down[n] &&
                !down[peer];
              return (
                <line
                  key={`${n}-${peer}`}
                  x1={pos[n].x}
                  y1={pos[n].y}
                  x2={pos[peer].x}
                  y2={pos[peer].y}
                  stroke={lit ? "#45d6c4" : "#ffffff"}
                  strokeOpacity={lit ? 0.3 : 0.07}
                  strokeWidth={lit ? 1.5 : 1}
                />
              );
            }),
        )}
        {/* nodes */}
        {pos.map((p, i) => {
          const isDown = down[i];
          const state = isDown ? "idle" : states[i];
          const isWaiting = phase === "stalled" && state !== "accepted" && !isDown;
          const base = orgColor[ORG[i]];
          return (
            <g
              key={i}
              onClick={() => toggleNode(i)}
              className="cursor-pointer"
              role="button"
              aria-label={`node ${NODE_LABELS[i]}`}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={20}
                fill={
                  isDown
                    ? "#1a0d12"
                    : state === "accepted"
                      ? base
                      : state === "voted"
                        ? base
                        : "#0d0d14"
                }
                fillOpacity={state === "accepted" ? 0.9 : state === "voted" ? 0.3 : 1}
                stroke={isDown ? "#c96a6a" : isWaiting ? "#d9b96a" : base}
                strokeWidth={2}
                strokeDasharray={isWaiting ? "4 3" : undefined}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize={11}
                fontFamily="var(--font-jetbrains-mono), monospace"
                fill={
                  isDown
                    ? "#c96a6a"
                    : state === "accepted"
                      ? "#0b0817"
                      : "#9c9cb4"
                }
              >
                {isDown ? "✕" : NODE_LABELS[i]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* status line */}
      <div className="mt-2 grid min-h-[40px] place-items-center text-center">
        {phase === "closed" && (
          <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent2">
            {fmt(m.closed, { n: ledgers })}
          </p>
        )}
        {phase === "stalled" && (
          <p className="max-w-md font-mono text-[11px] leading-relaxed text-gold">
            {allDown || aliveStalled === 0
              ? m.halted
              : fmt(m.stalled, { count: aliveStalled })}
          </p>
        )}
        {phase === "running" && (
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted2">
            {m.running}
          </p>
        )}
        {phase === "idle" && (
          <p className="max-w-md font-mono text-[11px] leading-relaxed text-muted">
            {m.hint}
          </p>
        )}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={phase === "running"}
          onClick={propose}
          className="rounded-full px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-[#062421] transition-transform enabled:hover:-translate-y-[1px] disabled:opacity-60"
          style={{ background: "linear-gradient(180deg, #9ef0e4, #45d6c4)" }}
        >
          {m.propose}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted2 transition hover:border-line-strong hover:text-fg"
        >
          {m.reset}
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {fmt(m.ledgers, { n: ledgers })}
        </span>
      </div>
    </div>
  );
}
