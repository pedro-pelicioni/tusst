"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Realm, made touchable: the constant-product curve, and the one thing prose
// cannot convey — that slippage is not a property of the pool or of the trade,
// but of the RATIO between them. The same 5,000 USDC is invisible in a deep
// pool and a self-inflicted wound in a shallow one.
//
// x · y = k with a 0.3% fee, which is the real shape. Numbers are illustrative.

const FEE = 0.003;
const POOLS = {
  deep: { x: 2_000_000, y: 10_000_000 },
  shallow: { x: 40_000, y: 200_000 },
};
const SIZES = [100, 2_000, 20_000];

export function AmmPoolSim() {
  const m = useMessages().visuals.ammPool;
  const [deep, setDeep] = useState(true);
  const [size, setSize] = useState(SIZES[0]);

  const { x, y } = deep ? POOLS.deep : POOLS.shallow;
  const k = x * y;
  const inAfterFee = size * (1 - FEE);
  const out = y - k / (x + inAfterFee);
  const spot = y / x;
  const effective = out / size;
  const slippage = Math.max(0, (1 - effective / spot) * 100);

  const fmt = (n: number) =>
    n >= 1000 ? Math.round(n).toLocaleString("en-US") : n.toFixed(2);

  const verdict =
    slippage < 1
      ? { text: m.tiny, tone: "good" as const }
      : slippage < 8
        ? { text: m.noticeable.replace("{p}", slippage.toFixed(1)), tone: "warn" as const }
        : { text: m.severe.replace("{p}", slippage.toFixed(1)), tone: "bad" as const };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={deep}
          onClick={() => setDeep((v) => !v)}
          className={`rounded-lg border px-3 py-2 text-[12px] transition ${
            deep
              ? "border-accent/60 bg-accent/12 text-fg"
              : "border-gold/50 bg-gold/10 text-fg"
          }`}
        >
          {deep ? m.poolDeep : m.poolShallow}
        </button>
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={size === s}
            onClick={() => setSize(s)}
            className={`rounded-lg border px-3 py-2 font-mono text-[11px] transition ${
              size === s
                ? "border-accent/60 bg-accent/12 text-fg"
                : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
            }`}
          >
            {m.sell.replace("{n}", s.toLocaleString("en-US"))}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-line bg-white/[0.03] px-3 py-2.5 font-mono text-[11.5px] leading-relaxed">
        <div className="text-muted2">
          {m.reserves
            .replace("{x}", fmt(x))
            .replace("{y}", fmt(y))}
        </div>
        <div className="mt-1 text-muted2">
          {m.spot.replace("{p}", spot.toFixed(4))}
        </div>
        <div className="mt-1 text-fg">
          {m.youGet.replace("{n}", fmt(out))}
        </div>
        <div className="mt-1 text-muted2">
          {m.effective.replace("{p}", effective.toFixed(4))}
        </div>
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

      <p className="mt-3 font-mono text-[9.5px] leading-relaxed tracking-[0.12em] text-muted">
        {m.hint}
      </p>
    </div>
  );
}
