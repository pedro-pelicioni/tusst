"use client";

import { useState } from "react";
import type { DiagramBand } from "@/content/visuals/types";
import { toneClass } from "./tone";

// Labelled bands, top to bottom, nesting one level. Reads a transaction
// envelope (operations inside it), a layered architecture, or the tiers of
// contract storage — anything whose lesson is "this contains that".

function Band({ band, depth }: { band: DiagramBand; depth: number }) {
  const [open, setOpen] = useState(false);
  const hasDetail = Boolean(band.note) || Boolean(band.bands?.length);

  return (
    <div className={`rounded-xl border ${toneClass(band.tone)} ${depth > 0 ? "" : ""}`}>
      <button
        type="button"
        onClick={() => hasDetail && setOpen((v) => !v)}
        aria-expanded={hasDetail ? open : undefined}
        disabled={!hasDetail}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left disabled:cursor-default"
      >
        <span className="text-[12.5px] leading-snug">{band.label}</span>
        {hasDetail && (
          <span aria-hidden className="shrink-0 font-mono text-[10px] opacity-60">
            {open ? "▾" : "▸"}
          </span>
        )}
      </button>

      {open && (
        <div className="sc-dg-in px-3 pb-3">
          {band.note && (
            <p className="text-[12px] leading-relaxed text-muted2">{band.note}</p>
          )}
          {band.bands && band.bands.length > 0 && (
            <div className="mt-2 flex flex-col gap-1.5">
              {band.bands.map((child) => (
                <Band key={child.id} band={child} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function StackDiagram({ bands }: { bands: DiagramBand[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {bands.map((band) => (
        <Band key={band.id} band={band} depth={0} />
      ))}
    </div>
  );
}
