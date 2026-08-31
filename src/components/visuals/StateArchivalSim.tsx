"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Realm, made touchable: the three shelves differ in what EXPIRY means, and
// that difference is the whole design. Prose can list it; only running the
// clock makes "temporary is gone forever, persistent is merely asleep" land
// before someone learns it from a support ticket.

const MAX_TTL = 200;
const STEP = 50;
type Shelf = 0 | 1 | 2; // temporary · persistent · instance

export function StateArchivalSim() {
  const m = useMessages().visuals.stateArchival;
  const [shelf, setShelf] = useState<Shelf>(0);
  const [ttl, setTtl] = useState(MAX_TTL);
  const [archived, setArchived] = useState(false);
  const [lost, setLost] = useState(false);

  const reset = (next: Shelf) => {
    setShelf(next);
    setTtl(MAX_TTL);
    setArchived(false);
    setLost(false);
  };

  const advance = () => {
    const next = ttl - STEP;
    if (next > 0) {
      setTtl(next);
      return;
    }
    setTtl(0);
    // Temporary entries are deleted outright. Persistent and instance entries
    // are archived — still recoverable, for a price.
    if (shelf === 0) setLost(true);
    else setArchived(true);
  };

  const state = lost ? "lost" : archived ? "archived" : ttl > 0 ? "live" : "live";
  const verdict = lost
    ? m.verdictLost[shelf]
    : archived
      ? m.verdictArchived[shelf]
      : ttl <= STEP
        ? m.verdictSoon
        : m.verdictLive[shelf];

  return (
    <div>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
        {m.shelfLabel}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {m.shelves.map((label, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={shelf === i}
            onClick={() => reset(i as Shelf)}
            className={`rounded-lg border px-3 py-2 text-[12px] transition ${
              shelf === i
                ? "border-accent/60 bg-accent/12 text-fg"
                : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
        {m.ttlLabel.replace("{n}", String(Math.max(0, ttl)))}
      </p>
      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            lost ? "bg-red-500/60" : archived ? "bg-gold/60" : "bg-accent/70"
          }`}
          style={{ width: `${(Math.max(0, ttl) / MAX_TTL) * 100}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={lost || archived}
          onClick={advance}
          className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition hover:bg-accent/20 disabled:opacity-40"
        >
          {m.advance.replace("{n}", String(STEP))}
        </button>
        {!lost && !archived && (
          <button
            type="button"
            onClick={() => setTtl(MAX_TTL)}
            className="rounded-full border border-line px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted2 transition hover:text-fg"
          >
            {m.bump}
          </button>
        )}
        {archived && (
          <button
            type="button"
            onClick={() => {
              setArchived(false);
              setTtl(MAX_TTL);
            }}
            className="rounded-full border border-gold/45 bg-gold/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold transition hover:bg-gold/20"
          >
            {m.restore}
          </button>
        )}
        <button
          type="button"
          onClick={() => reset(shelf)}
          className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted2 underline-offset-4 hover:text-fg hover:underline"
        >
          {m.reset}
        </button>
      </div>

      <p
        className={`mt-4 text-[12.5px] leading-relaxed ${
          lost ? "text-red-400" : archived ? "text-gold" : "text-pop"
        }`}
      >
        {verdict}
      </p>

      <p className="mt-3 font-mono text-[9.5px] leading-relaxed tracking-[0.12em] text-muted">
        {state === "lost" ? m.hintLost : m.hint}
      </p>
    </div>
  );
}
