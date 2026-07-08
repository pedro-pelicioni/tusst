"use client";

import { useEffect, useRef } from "react";
import type { ConsoleLine, ForgeRunStatus } from "./use-forge-run";

// Streamed output console. Follows the tail unless the user scrolls up
// (a manual scroll unpins; scrolling back to the bottom re-pins).

 
const ANSI_RE = /\[[0-9;]*m/g;

const STATUS_STYLE: Record<ForgeRunStatus, string> = {
  idle: "text-muted",
  queued: "text-muted2",
  building: "text-accent",
  testing: "text-accent",
  auditing: "text-accent",
  ok: "text-pop",
  err: "text-red-400",
  timeout: "text-red-400",
  infra: "text-red-400",
};

export function ConsolePane({
  lines,
  status,
}: {
  lines: ConsoleLine[];
  status: ForgeRunStatus;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pinnedRef = useRef(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-elev">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[11px] text-muted">console</span>
        <span
          className={`font-mono text-[11px] uppercase tracking-wider ${STATUS_STYLE[status]}`}
        >
          {status === "infra" ? "forge cold" : status}
        </span>
      </div>
      <div
        ref={scrollRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          pinnedRef.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 24;
        }}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-relaxed"
      >
        {lines.length === 0 ? (
          <p className="text-muted">
            {"// build, test or audit your contract to see output here (⌘⏎ builds)"}
          </p>
        ) : (
          lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-all ${
                line.kind === "error"
                  ? "text-red-400"
                  : line.kind === "info"
                    ? "text-muted"
                    : "text-fg/90"
              }`}
            >
              {line.text.replace(ANSI_RE, "") || " "}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
