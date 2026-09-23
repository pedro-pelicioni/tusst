"use client";

// DEV ONLY (`?edit=1`, never in production): drag nodes, shift-click to lay a
// road, Enter commits it, Backspace pops a point, Escape clears the draft,
// C copies `{ positions, roads }` as JSON to paste into the world file.

import { useCallback, useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import type { Point, WorldConfig } from "@/content/overworld/types";
import { useMessages } from "@/i18n/client";

export function useNodeEditor(
  world: WorldConfig,
  enabled: boolean,
  toWorldPercent: (x: number, y: number) => Point | null,
) {
  const [overrides, setOverrides] = useState<Record<string, Point>>({});
  const [roads, setRoads] = useState<Point[][]>(world.roads);
  const [draft, setDraft] = useState<Point[]>([]);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const round = (p: Point): Point => [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];

  const onNodeDragStart = useCallback(
    (id: string, e: ReactPointerEvent<HTMLButtonElement>) => {
      if (!enabled) return;
      e.stopPropagation();
      e.preventDefault();
      setDragging(id);
    },
    [enabled],
  );

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      const p = toWorldPercent(e.clientX, e.clientY);
      if (!p) return;
      setCursor(round(p));
      if (dragging) setOverrides((o) => ({ ...o, [dragging]: round(p) }));
    };
    const up = () => setDragging(null);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Enter" && draft.length > 1) {
        setRoads((r) => [...r, draft]);
        setDraft([]);
      } else if (e.key === "Backspace") {
        setDraft((d) => d.slice(0, -1));
      } else if (e.key === "Escape") {
        setDraft([]);
      } else if (e.key.toLowerCase() === "c" && !e.metaKey && !e.ctrlKey) {
        const positions: Record<string, Point> = {};
        for (const n of world.nodes) positions[n.id] = overrides[n.id] ?? n.pos;
        const json = JSON.stringify({ positions, roads }, null, 0)
          .replace(/\],\[/g, "],\n  [")
          .replace(/"roads":/, '\n"roads":');
        void navigator.clipboard?.writeText(json).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        });
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("keydown", key);
    };
  }, [enabled, dragging, draft, overrides, roads, toWorldPercent, world.nodes]);

  const onWorldClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!enabled || !e.shiftKey) return;
      const p = toWorldPercent(e.clientX, e.clientY);
      if (p) setDraft((d) => [...d, round(p)]);
    },
    [enabled, toWorldPercent],
  );

  return { overrides, roads, draft, cursor, copied, onNodeDragStart, onWorldClick };
}

export function EditorOverlay({ cursor, draft, copied }: { cursor: Point | null; draft: Point[]; copied: boolean }) {
  const e = useMessages().overworld.editor;
  return (
    <>
      {draft.map((p, i) => (
        <span key={i} className="ow-editor-dot" style={{ left: `${p[0]}%`, top: `${p[1]}%` }} />
      ))}
      <div className="ow-editor">
        {copied ? e.copied : e.hint}
        {cursor && ` · [${cursor[0]}, ${cursor[1]}]`}
        {draft.length > 0 && ` · road: ${draft.length} pts`}
      </div>
    </>
  );
}
