"use client";

import { useEffect, useState } from "react";
import { useMessages } from "@/i18n/client";
import { sha256Hex } from "./hash";

// Chapter II, made touchable: write a message, seal it, then change one
// character and watch the seal stop matching.
//
// The seal is a keyed digest, NOT Ed25519 — and the copy says so, because
// teaching a wrong mechanism is worse than teaching none. What it reproduces
// faithfully is the property that matters: the seal covers THIS message, and
// nothing else, and anyone can check it.

const DEMO_KEY = "S-demo-secret-key-never-leaves-this-page";
const SHOWN = 24;

export function SealSim() {
  const m = useMessages().visuals.seal;
  const [message, setMessage] = useState("");
  const [seal, setSeal] = useState<string | null>(null);
  const [live, setLive] = useState<string | null>(null);

  // Async digest of the live message — a data effect, not derived state.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let alive = true;
    if (message.trim() === "") {
      setLive(null);
      return;
    }
    void sha256Hex(`${DEMO_KEY}|${message}`).then((h) => {
      if (alive) setLive(h);
    });
    return () => {
      alive = false;
    };
  }, [message]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const matches = seal !== null && live !== null && seal === live;

  return (
    <div>
      <label className="flex flex-col gap-1">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
          {m.messageLabel}
        </span>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={m.messagePlaceholder}
          className="rounded border border-line bg-bg px-2.5 py-2 text-[13px] text-fg outline-none focus:border-accent/60"
        />
      </label>

      <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
        {m.keyLabel}
      </p>

      <button
        type="button"
        onClick={() => setSeal(live)}
        disabled={live === null}
        className="mt-3 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition hover:bg-accent/20 disabled:opacity-40"
      >
        {m.sign}
      </button>

      <div className="mt-3 rounded-xl border border-line bg-white/[0.03] px-3 py-2.5">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
          {m.sealLabel}
        </p>
        {seal === null ? (
          <p className="mt-1 font-mono text-[10.5px] text-muted">{m.none}</p>
        ) : (
          <>
            <p className="mt-1 break-all font-mono text-[11px] text-gold">
              {seal.slice(0, SHOWN)}…
            </p>
            <p
              key={String(matches)}
              className={`sc-dg-in mt-2 text-[12px] leading-relaxed ${
                matches ? "text-pop" : "text-ember"
              }`}
            >
              {matches ? m.valid : m.invalid}
            </p>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="max-w-md text-[12px] leading-relaxed text-muted2">{m.hint}</p>
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setSeal(null);
          }}
          className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted2 transition hover:border-line-strong hover:text-fg"
        >
          {m.reset}
        </button>
      </div>
    </div>
  );
}
