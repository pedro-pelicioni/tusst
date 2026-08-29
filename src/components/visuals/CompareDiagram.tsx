"use client";

import type { DiagramCell, DiagramTone } from "@/content/visuals/types";
import { toneClass } from "./tone";

// Side-by-side with a verdict per cell. This is also the answer to "should we
// add remark-gfm for markdown tables": it gives everything a table would, plus
// typed tone semantics and a layout that stacks into cards on a phone instead
// of scrolling sideways.

const MARK: Partial<Record<DiagramTone, string>> = {
  good: "✓",
  bad: "✗",
  gold: "~",
};

function Cell({ cell }: { cell: DiagramCell }) {
  const mark = cell.tone ? MARK[cell.tone] : undefined;
  return (
    <span className={`flex gap-1.5 rounded-lg border px-2.5 py-2 ${toneClass(cell.tone)}`}>
      {mark && (
        <span aria-hidden className="shrink-0 font-mono text-[11px] leading-relaxed">
          {mark}
        </span>
      )}
      <span className="text-[12px] leading-relaxed">{cell.text}</span>
    </span>
  );
}

export function CompareDiagram({
  columns,
  rows,
}: {
  columns: { id: string; label: string; tone?: DiagramTone }[];
  rows: { label: string; cells: DiagramCell[] }[];
}) {
  return (
    <div className="@container">
      {/* Wide: a real grid with a header row. */}
      <div className="hidden @md:block">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `minmax(6rem, 1fr) repeat(${columns.length}, 1fr)` }}
        >
          <span />
          {columns.map((col) => (
            <span
              key={col.id}
              className={`rounded-lg border px-2.5 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.16em] ${toneClass(
                col.tone,
              )}`}
            >
              {col.label}
            </span>
          ))}
          {rows.map((row) => (
            <div key={row.label} className="contents">
              <span className="self-center py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {row.label}
              </span>
              {row.cells.map((cell, i) => (
                <Cell key={`${row.label}-${columns[i]?.id ?? i}`} cell={cell} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Narrow: one card per row, each cell labelled by its column. */}
      <div className="flex flex-col gap-3 @md:hidden">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {row.label}
            </p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {row.cells.map((cell, i) => (
                <span key={columns[i]?.id ?? i} className="flex flex-col gap-1">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted2">
                    {columns[i]?.label}
                  </span>
                  <Cell cell={cell} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
