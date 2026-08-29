"use client";

import { useState } from "react";

// A collapsible tree for decoded XDR and ledger query results. Deliberately
// plain: this is a reading surface, so the only interaction is open/close, and
// everything is keyboard reachable.
//
// Nodes past `defaultDepth` start collapsed — a Horizon page of 20 operations
// is unreadable fully expanded, and the shape is the first thing you want.

const INDENT = 12;

function isContainer(value: unknown): value is Record<string, unknown> | unknown[] {
  return typeof value === "object" && value !== null;
}

function Leaf({ value }: { value: unknown }) {
  if (typeof value === "string") {
    return <span className="break-all text-accent2">&quot;{value}&quot;</span>;
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return <span className="text-gold">{String(value)}</span>;
  }
  if (typeof value === "boolean") {
    return <span className="text-accent">{String(value)}</span>;
  }
  if (value === null) return <span className="text-muted">null</span>;
  if (value === undefined) return <span className="text-muted">undefined</span>;
  return <span className="text-fg">{String(value)}</span>;
}

function Node({
  label,
  value,
  depth,
  defaultDepth,
}: {
  label?: string;
  value: unknown;
  depth: number;
  defaultDepth: number;
}) {
  const [open, setOpen] = useState(depth < defaultDepth);

  if (!isContainer(value)) {
    return (
      <div style={{ paddingLeft: depth * INDENT }} className="leading-relaxed">
        {label !== undefined && <span className="text-muted2">{label}: </span>}
        <Leaf value={value} />
      </div>
    );
  }

  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value).filter(([, v]) => v !== undefined);
  const summary = Array.isArray(value)
    ? `[${entries.length}]`
    : `{${entries.length}}`;

  return (
    <div style={{ paddingLeft: depth * INDENT }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-baseline gap-1 text-left leading-relaxed transition hover:text-fg"
      >
        <span className="w-2.5 shrink-0 text-muted">{open ? "▾" : "▸"}</span>
        {label !== undefined && <span className="text-muted2">{label}</span>}
        <span className="text-muted">{summary}</span>
      </button>
      {open &&
        entries.map(([k, v]) => (
          <Node
            key={k}
            label={k}
            value={v}
            depth={depth + 1}
            defaultDepth={defaultDepth}
          />
        ))}
    </div>
  );
}

export function JsonTree({
  value,
  defaultDepth = 2,
}: {
  value: unknown;
  defaultDepth?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-bg px-3 py-2.5 font-mono text-[11px]">
      <Node value={value} depth={0} defaultDepth={defaultDepth} />
    </div>
  );
}
