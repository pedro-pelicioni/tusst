"use client";

import { useCallback, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import type { SorobanFileMap, ForgeMode } from "@/lib/soroban/types";
import type { ConsoleLine, ForgeRunStatus } from "./use-forge-run";

// The Raven (🐦‍⬛ — the Stellar scout, AI mentor): a side-panel card that
// materializes only when a build/test/audit run failed, offering one
// Socratic hint about the first error. Lives in the right aside so it never
// competes with the console log for attention.

type RavenState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "shown"; hint: string; remaining: number }
  | { status: "limited" }
  | { status: "unavailable" }
  | { status: "signin" };

export function RavenPanel({
  status,
  mode,
  files,
  lines,
}: {
  status: ForgeRunStatus;
  mode: ForgeMode;
  files: SorobanFileMap;
  lines: ConsoleLine[];
}) {
  const m = useMessages();
  const [raven, setRaven] = useState<RavenState>({ status: "idle" });

  const failed = status === "err" || status === "timeout";

  // A new run makes the previous counsel stale — adjust-during-render
  // pattern (React 19 lint forbids setState inside effects).
  const [wasFailed, setWasFailed] = useState(failed);
  if (wasFailed !== failed) {
    setWasFailed(failed);
    if (!failed) setRaven({ status: "idle" });
  }

  const ask = useCallback(async () => {
    setRaven({ status: "loading" });
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
        setRaven({
          status: "shown",
          hint: data.hint ?? "",
          remaining: data.remaining ?? 0,
        });
      } else if (res.status === 401) {
        setRaven({ status: "signin" });
      } else if (res.status === 429) {
        setRaven({ status: "limited" });
      } else {
        setRaven({ status: "unavailable" });
      }
    } catch {
      setRaven({ status: "unavailable" });
    }
  }, [mode, files, lines]);

  if (!failed) return null;

  return (
    <div className="border-b border-accent/30 bg-accent/[0.05] px-4 py-3 font-mono text-[12px] leading-relaxed">
      {(raven.status === "idle" || raven.status === "loading") && (
        <button
          type="button"
          onClick={ask}
          disabled={raven.status === "loading"}
          className="w-full rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {raven.status === "loading"
            ? <>🐦‍⬛ {m.ide.mentor.thinking}</>
            : <>🐦‍⬛ {m.ide.mentor.ask}</>}
        </button>
      )}

      {raven.status === "shown" && (
        <div>
          <p className="text-muted">🐦‍⬛ {m.ide.mentor.title}</p>
          <p className="mt-1 whitespace-pre-wrap text-fg/90">{raven.hint}</p>
          <p className="mt-2 text-[11px] text-muted2">
            {fmt(m.ide.mentor.remaining, { n: raven.remaining })}
          </p>
        </div>
      )}

      {raven.status === "signin" && (
        <p className="text-muted2">🐦‍⬛ {m.ide.mentor.signIn}</p>
      )}
      {raven.status === "limited" && (
        <p className="text-muted2">🐦‍⬛ {m.ide.mentor.limit}</p>
      )}
      {raven.status === "unavailable" && (
        <p className="text-muted2">🐦‍⬛ {m.ide.mentor.unavailable}</p>
      )}
    </div>
  );
}
