"use client";

/* eslint-disable @next/next/no-img-element */
// One node on the island: the pixel marker (number / ✓ / ⌑), the sigil or
// boss art floating above it, the level chip and the hover tip. Pure
// presentation — the stage owns selection and travel.

import type { PointerEvent as ReactPointerEvent } from "react";
import type { NodeState, Point } from "@/content/overworld/types";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";

export function MissionNode({
  node,
  pos,
  selected,
  onSelect,
  onDragStart,
}: {
  node: NodeState;
  pos: Point;
  selected: boolean;
  onSelect: (id: string) => void;
  /** dev editor: start dragging this node */
  onDragStart?: (id: string, e: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  const m = useMessages().overworld.map;
  const done = node.status === "done";
  const locked = node.status === "locked";
  const soon = node.status === "soon";
  const label = fmt(m.nodeAria, { number: node.number, title: node.title });
  const suffix = done ? `, ${m.nodeDone}` : locked ? `, ${m.nodeLocked}` : soon ? `, ${m.nodeSoon}` : "";
  const marker = done ? "✓" : locked ? "⌑" : soon ? "…" : node.number;
  const art = node.bossArt ?? node.sigil ?? null;
  // A harbor dock stands on a landmark the map already paints (the fort, the
  // lighthouse…), so it floats nothing above its marker.
  const floatsArt = node.kind !== "waypoint" && node.kind !== "dock";
  // "10.3" does not fit the round waypoint marker; it stretches into a pill.
  const wide = marker.length > 3;

  return (
    <button
      type="button"
      className={`ow-node ow-${node.kind} ${wide ? "is-wide" : ""} ${selected ? "is-selected" : ""} ${done ? "is-done" : ""} ${locked ? "is-locked" : ""} ${soon ? "is-soon" : ""} ${node.recommended && !done ? "is-recommended" : ""}`}
      style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
      aria-label={label + suffix}
      aria-pressed={selected}
      onClick={() => onSelect(node.id)}
      onPointerDown={onDragStart ? (e) => onDragStart(node.id, e) : undefined}
    >
      {floatsArt && (
        <span className="ow-node-art" aria-hidden>
          {art ? (
            <img src={art} alt="" loading="lazy" decoding="async" />
          ) : (
            <span className="ow-glyph">{node.numeral ?? "◆"}</span>
          )}
          {node.bossLevel !== undefined && (
            <span className="ow-node-level">
              {done ? m.defeated : fmt(m.bossLevel, { level: node.bossLevel })}
            </span>
          )}
        </span>
      )}
      <span className="ow-marker">{marker}</span>
      <span className="ow-tip" role="presentation">
        {node.bossName && <b>{node.bossName}</b>}
        {locked ? node.lockedNote ?? fmt(m.lockedTip, { number: node.number }) : node.title}
      </span>
    </button>
  );
}
