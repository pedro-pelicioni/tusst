"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";

// Realm, made touchable: the router is not yours to write. You state what you
// send and the least you will accept; the protocol walks books and pools for a
// route, and if no route clears your bound, NOTHING happens — no half-converted
// money stranded on a hop. That last property is the one people do not believe
// until they watch a payment simply not occur.
//
// Three illustrative routes with different depth. The direct book is thin, so
// it wins on small amounts and collapses on large ones — which is exactly why
// you do not hard-code a route.

interface Route {
  /** delivered per 1 unit sent, before depth is felt */
  rate: number;
  /** how much can flow before the price degrades badly */
  depth: number;
}
const ROUTES: Route[] = [
  { rate: 0.19, depth: 3_000 },    // direct book — best rate, thin
  { rate: 0.176, depth: 50_000 },  // via XLM — deep
  { rate: 0.171, depth: 20_000 },  // via USDC — medium
];
const AMOUNTS = [200, 5_000, 40_000];

/** Delivery degrades as the amount eats into the route's depth. */
function delivered(r: Route, amount: number) {
  const pressure = amount / (amount + r.depth);
  return amount * r.rate * (1 - pressure * 0.5);
}

export function PathPaymentSim() {
  const m = useMessages().visuals.pathPayment;
  const [amount, setAmount] = useState(AMOUNTS[0]);
  const [greedy, setGreedy] = useState(false);

  const results = ROUTES.map((r) => delivered(r, amount));
  const best = Math.max(...results);
  const bestIndex = results.indexOf(best);
  // A reasonable floor clears; a greedy one cannot be met by any route.
  const floor = greedy ? best * 1.1 : best * 0.97;
  const cleared = best >= floor;

  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={amount === a}
            onClick={() => setAmount(a)}
            className={`rounded-lg border px-3 py-2 font-mono text-[11px] transition ${
              amount === a
                ? "border-accent/60 bg-accent/12 text-fg"
                : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
            }`}
          >
            {m.send.replace("{n}", a.toLocaleString("en-US"))}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={greedy}
          onClick={() => setGreedy((v) => !v)}
          className={`rounded-lg border px-3 py-2 text-[12px] transition ${
            greedy
              ? "border-red-500/55 bg-red-500/10 text-fg"
              : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
          }`}
        >
          {greedy ? m.floorGreedy : m.floorFair}
        </button>
      </div>

      <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
        {m.routesLabel}
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        {m.routes.map((label, i) => (
          <div
            key={i}
            className={`flex items-baseline justify-between rounded-lg border px-3 py-2 text-[12px] ${
              i === bestIndex && cleared
                ? "border-accent/60 bg-accent/12 text-fg"
                : "border-line bg-bg-elev text-muted2"
            }`}
          >
            <span>{label}</span>
            <span className="font-mono text-[11px]">
              {m.delivers.replace("{n}", fmt(results[i]))}
            </span>
          </div>
        ))}
      </div>

      <p
        className={`mt-4 text-[12.5px] leading-relaxed ${
          cleared ? "text-pop" : "text-red-400"
        }`}
      >
        {cleared
          ? m.settled
              .replace("{n}", fmt(best))
              .replace("{route}", m.routes[bestIndex])
          : m.reverted.replace("{n}", fmt(floor)).replace("{best}", fmt(best))}
      </p>

      <p className="mt-3 font-mono text-[9.5px] leading-relaxed tracking-[0.12em] text-muted">
        {m.hint}
      </p>
    </div>
  );
}
