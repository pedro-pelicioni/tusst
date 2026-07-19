"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import type { SorobanFileMap, ForgeMode } from "@/lib/soroban/types";
import type { ConsoleLine, ForgeRunStatus } from "./use-forge-run";

// AI mentor over a failed run: one hint per click, quota'd server-side.
type MentorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "shown"; hint: string; remaining: number }
  | { status: "limited" }
  | { status: "unavailable" }
  | { status: "signin" };

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
  mode,
  files,
}: {
  lines: ConsoleLine[];
  status: ForgeRunStatus;
  mode: ForgeMode;
  files: SorobanFileMap;
}) {
  const m = useMessages();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pinnedRef = useRef(true);
  const [mentor, setMentor] = useState<MentorState>({ status: "idle" });

  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [lines, mentor]);

  const failed = status === "err" || status === "timeout";

  // A new run makes the previous counsel stale — adjust-during-render
  // pattern (React 19 lint forbids setState inside effects).
  const [wasFailed, setWasFailed] = useState(failed);
  if (wasFailed !== failed) {
    setWasFailed(failed);
    if (!failed) setMentor({ status: "idle" });
  }

  const askMentor = useCallback(async () => {
    setMentor({ status: "loading" });
    try {
      const res = await fetch("/api/mentor/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          files,
          log: lines.map((l) => l.text).join("\n"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMentor({
          status: "shown",
          hint: data.hint ?? "",
          remaining: data.remaining ?? 0,
        });
      } else if (res.status === 401) {
        setMentor({ status: "signin" });
      } else if (res.status === 429) {
        setMentor({ status: "limited" });
      } else {
        setMentor({ status: "unavailable" });
      }
    } catch {
      setMentor({ status: "unavailable" });
    }
  }, [mode, files, lines]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-elev">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[11px] text-muted">{m.ide.console.title}</span>
        <span
          className={`font-mono text-[11px] uppercase tracking-wider ${STATUS_STYLE[status]}`}
        >
          {m.ide.console.status[status]}
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
          <p className="text-muted">{m.ide.console.empty}</p>
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

        {failed && (
          <div className="mt-3 border-t border-line pt-3">
            {(mentor.status === "idle" || mentor.status === "loading") && (
              <button
                type="button"
                onClick={askMentor}
                disabled={mentor.status === "loading"}
                className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
              >
                {mentor.status === "loading"
                  ? m.ide.mentor.thinking
                  : <>🧙 {m.ide.mentor.ask}</>}
              </button>
            )}
            {mentor.status === "shown" && (
              <div className="rounded-xl border border-accent/40 bg-accent/[0.06] px-4 py-3">
                <p className="text-muted">{m.ide.mentor.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-fg/90">
                  {mentor.hint}
                </p>
                <p className="mt-2 text-[11px] text-muted2">
                  {fmt(m.ide.mentor.remaining, { n: mentor.remaining })}
                </p>
              </div>
            )}
            {mentor.status === "signin" && (
              <p className="text-muted2">{m.ide.mentor.signIn}</p>
            )}
            {mentor.status === "limited" && (
              <p className="text-muted2">{m.ide.mentor.limit}</p>
            )}
            {mentor.status === "unavailable" && (
              <p className="text-muted2">{m.ide.mentor.unavailable}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
