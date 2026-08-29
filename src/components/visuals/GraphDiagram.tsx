"use client";

import { useState } from "react";
import type { DiagramEdge, DiagramNode } from "@/content/visuals/types";
import { toneVar } from "./tone";

// Nodes and edges on an author-placed 0–100 grid. No layout engine and no d3:
// a teaching diagram has a dozen nodes whose arrangement IS part of the point,
// so the author places them and the SVG viewBox does the scaling.
//
// Picking a node dims everything it does not touch — the fastest way to read
// "who talks to whom" in a bounded-context map or a subagent graph.

type PlacedNode = DiagramNode & { x: number; y: number; shape?: "circle" | "box" };

const W = 100;
const H = 62;

export function GraphDiagram({
  nodes,
  edges,
}: {
  nodes: PlacedNode[];
  edges: DiagramEdge[];
}) {
  const [focus, setFocus] = useState<string | null>(null);

  const neighbours = (id: string) =>
    new Set(
      edges
        .filter((e) => e.from === id || e.to === id)
        .flatMap((e) => [e.from, e.to])
        .concat(id),
    );
  const lit = focus ? neighbours(focus) : null;
  const dim = (id: string) => (lit && !lit.has(id) ? 0.25 : 1);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const note = focus ? byId.get(focus)?.note : undefined;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={nodes.map((n) => n.label).join(", ")}
      >
        {edges.map((edge) => {
          const a = byId.get(edge.from);
          const b = byId.get(edge.to);
          if (!a || !b) return null;
          const shown = !lit || (lit.has(edge.from) && lit.has(edge.to));
          return (
            <g key={`${edge.from}-${edge.to}`} opacity={shown ? 1 : 0.15}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--muted-2)"
                strokeWidth={0.6}
                strokeDasharray={edge.style === "dashed" ? "2 1.4" : undefined}
              />
              {edge.label && (
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 1.2}
                  textAnchor="middle"
                  fill="var(--muted)"
                  fontSize={2.2}
                  fontFamily="var(--font-jetbrains-mono), monospace"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((node) => {
          const paint = toneVar(node.tone);
          const active = focus === node.id;
          return (
            <g
              key={node.id}
              opacity={dim(node.id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={node.label}
              onClick={() => setFocus(active ? null : node.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFocus(active ? null : node.id);
                }
              }}
            >
              {node.shape === "box" ? (
                <rect
                  x={node.x - 9}
                  y={node.y - 4}
                  width={18}
                  height={8}
                  rx={1.6}
                  fill={paint}
                  fillOpacity={active ? 0.28 : 0.14}
                  stroke={paint}
                  strokeWidth={active ? 0.7 : 0.4}
                />
              ) : (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={5.4}
                  fill={paint}
                  fillOpacity={active ? 0.28 : 0.14}
                  stroke={paint}
                  strokeWidth={active ? 0.7 : 0.4}
                />
              )}
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                fill="var(--fg)"
                fontSize={2.6}
                fontFamily="var(--font-jetbrains-mono), monospace"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-1 min-h-[2.25rem] text-[12.5px] leading-relaxed text-muted2">
        {note && (
          <span key={focus} className="sc-dg-in block">
            {note}
          </span>
        )}
      </p>
    </div>
  );
}
