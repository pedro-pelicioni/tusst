"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A draggable divider between two panes. Hand-rolled on pointer events with
// pointer capture — the repo carries no UI library and this needs ~60 lines.
//
// PERFORMANCE, and the reason there are two callbacks: a pointermove fires
// ~60×/s, and committing each one to React state would re-render a tree that
// contains Monaco. So `onPreview` writes the new size straight to a CSS custom
// property on the shell root (the panes are sized from it), and only
// `onCommit` — once, on pointerup — touches state and localStorage. Monaco's
// automaticLayout follows the CSS variable on its own.
//
// `invert` exists because two of the three splitters grow the pane that sits
// AFTER them (the right panel and the console): there, dragging toward the
// start makes the pane bigger.
//
// Keyboard-operable on purpose: a resize you can only reach with a mouse is a
// resize half the users don't have.

const STEP = 16;
const STEP_COARSE = 64;

export function Splitter({
  orientation,
  value,
  min,
  max,
  invert = false,
  label,
  onPreview,
  onCommit,
  onReset,
}: {
  /** "vertical" = a vertical bar dragged left/right (resizes a width) */
  orientation: "vertical" | "horizontal";
  value: number;
  min: number;
  max: number;
  invert?: boolean;
  label: string;
  /** called on every pointermove — must NOT set React state */
  onPreview: (next: number) => void;
  /** called once, when the drag (or a key press) settles */
  onCommit: (next: number) => void;
  onReset: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const origin = useRef({ pos: 0, value: 0 });
  const latest = useRef(value);
  const vertical = orientation === "vertical";

  // Keep the live value in sync with committed state while idle. Without
  // this the keyboard path recomputes from a stale `value` prop, so holding
  // an arrow key (or four fast presses) only ever moves one step.
  useEffect(() => {
    if (!dragging) latest.current = value;
  }, [dragging, value]);

  const clamp = useCallback(
    (next: number) => Math.min(Math.max(Math.round(next), min), max),
    [max, min],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      origin.current = { pos: vertical ? e.clientX : e.clientY, value };
      latest.current = value;
      setDragging(true);
    },
    [value, vertical],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      const delta = (vertical ? e.clientX : e.clientY) - origin.current.pos;
      latest.current = clamp(origin.current.value + (invert ? -delta : delta));
      onPreview(latest.current);
    },
    [clamp, dragging, invert, onPreview, vertical],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      if (dragging) onCommit(latest.current);
      setDragging(false);
    },
    [dragging, onCommit],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const grow = vertical ? "ArrowRight" : "ArrowDown";
      const shrink = vertical ? "ArrowLeft" : "ArrowUp";
      const step = e.shiftKey ? STEP_COARSE : STEP;
      const commit = (next: number) => {
        e.preventDefault();
        const clamped = clamp(next);
        latest.current = clamped;
        onPreview(clamped);
        onCommit(clamped);
      };
      const base = latest.current;
      if (e.key === grow) commit(base + (invert ? -step : step));
      else if (e.key === shrink) commit(base + (invert ? step : -step));
      else if (e.key === "Home") commit(min);
      else if (e.key === "End") commit(max);
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onReset();
      }
    },
    [clamp, invert, max, min, onCommit, onPreview, onReset, vertical],
  );

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation={vertical ? "vertical" : "horizontal"}
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={onReset}
      onKeyDown={onKeyDown}
      className={`group relative shrink-0 touch-none outline-none ${
        vertical ? "w-px cursor-col-resize" : "h-px cursor-row-resize"
      } ${dragging ? "bg-accent" : "bg-line"} transition-colors hover:bg-accent/60 focus-visible:bg-accent`}
    >
      {/* The visual divider is 1px; the grab target is 9px on either side. */}
      <span
        aria-hidden
        className={`absolute ${
          vertical ? "-left-1 -right-1 inset-y-0" : "-top-1 -bottom-1 inset-x-0"
        }`}
      />
    </div>
  );
}
