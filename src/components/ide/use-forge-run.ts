"use client";

import { useCallback, useRef, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { runForgeStream } from "@/lib/soroban/run-stream";
import type { ForgeMode, SorobanFileMap } from "@/lib/soroban/types";

// IDE half of the NDJSON streaming contract: the transport lives in
// src/lib/soroban/run-stream.ts (shared with the labs engine); this hook
// translates its events into console lines + status for the Forge UI.
// One run at a time; a new run cancels nothing (the button disables), but
// `cancel` aborts the fetch which kills the container.

export type ForgeRunStatus =
  | "idle"
  | "queued"
  | "building"
  | "testing"
  | "auditing"
  | "ok"
  | "err"
  | "timeout"
  | "infra";

export interface ConsoleLine {
  kind: "log" | "info" | "error";
  text: string;
}

const MAX_CLIENT_LINES = 2_500;
const RUNNING_STATUS: Record<ForgeMode, ForgeRunStatus> = {
  build: "building",
  test: "testing",
  audit: "auditing",
};

export function useForgeRun() {
  const m = useMessages();
  const [status, setStatus] = useState<ForgeRunStatus>("idle");
  const [mode, setMode] = useState<ForgeMode>("build");
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [wasm, setWasm] = useState<Uint8Array | null>(null);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const running =
    status === "queued" || status === "building" || status === "testing" || status === "auditing";

  const run = useCallback(async (runMode: ForgeMode, files: SorobanFileMap) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    const abort = new AbortController();
    abortRef.current = abort;

    setMode(runMode);
    setStatus(RUNNING_STATUS[runMode]);
    setLines([]);
    if (runMode === "build") setWasm(null);

    const pushLine = (line: ConsoleLine) => {
      setLines((prev) => [...prev, line].slice(-MAX_CLIENT_LINES));
    };

    try {
      const result = await runForgeStream(
        runMode,
        files,
        {
          onQueued: (position) => {
            setStatus("queued");
            pushLine({ kind: "info", text: fmt(m.ide.run.queued, { position }) });
          },
          onPhase: (name) => {
            if (name !== "prepare") setStatus(RUNNING_STATUS[runMode]);
            pushLine({ kind: "info", text: fmt(m.ide.run.phase, { name }) });
          },
          onLog: (line) => pushLine({ kind: "log", text: line }),
        },
        abort.signal,
      );

      if (result.aborted) {
        pushLine({ kind: "info", text: m.ide.run.cancelled });
        setStatus("idle");
        return;
      }
      if (result.preStreamError) {
        pushLine({ kind: "error", text: result.preStreamError ?? m.ide.run.genericError });
        setStatus("err");
        return;
      }
      if (result.networkError) {
        pushLine({ kind: "error", text: m.ide.run.networkError });
        setStatus("err");
        return;
      }
      if (result.infraError && !result.ok) {
        // Covers rejected/failed streams and streams that ended without a
        // done event — the forge is cold or the run died under it.
        if (!result.timedOut) pushLine({ kind: "error", text: m.ide.run.infraError });
        setStatus("infra");
        return;
      }

      if (runMode === "build" && result.wasm) setWasm(result.wasm);
      if (!result.ok && result.timedOut) {
        pushLine({ kind: "error", text: m.ide.run.timedOut });
      }
      setStatus(result.ok ? "ok" : result.timedOut ? "timeout" : "err");
    } finally {
      inFlightRef.current = false;
      abortRef.current = null;
    }
  }, [m]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { status, mode, lines, wasm, running, run, cancel };
}
