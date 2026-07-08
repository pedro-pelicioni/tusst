"use client";

import { useCallback, useRef, useState } from "react";
import type { ForgeEvent, ForgeMode, SorobanFileMap } from "@/lib/soroban/types";

// Client half of the NDJSON streaming contract: POST the live editor
// snapshot, parse ForgeEvents line by line, surface console lines + status +
// the compiled wasm. One run at a time; a new run cancels nothing (the button
// disables), but `cancel` aborts the fetch which kills the container.

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
const ENDPOINT: Record<ForgeMode, string> = {
  build: "/api/soroban/compile",
  test: "/api/soroban/test",
  audit: "/api/soroban/audit",
};
const RUNNING_STATUS: Record<ForgeMode, ForgeRunStatus> = {
  build: "building",
  test: "testing",
  audit: "auditing",
};

function decodeBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function useForgeRun() {
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

    const pushLines = (batch: ConsoleLine[]) => {
      if (batch.length === 0) return;
      setLines((prev) => [...prev, ...batch].slice(-MAX_CLIENT_LINES));
    };

    try {
      const res = await fetch(ENDPOINT[runMode], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
        signal: abort.signal,
      });

      if (res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json().catch(() => null);
        pushLines([
          { kind: "error", text: (data as { error?: string })?.error ?? "Something went wrong." },
        ]);
        setStatus("err");
        return;
      }
      if (!res.ok || !res.body) {
        pushLines([{ kind: "error", text: "The forge is cold — try again." }]);
        setStatus("infra");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let pending = "";
      let finished = false;

      const handleEvent = (event: ForgeEvent, batch: ConsoleLine[]) => {
        switch (event.t) {
          case "queued":
            setStatus("queued");
            batch.push({
              kind: "info",
              text: `// queued — position ${event.position} in the forge line`,
            });
            break;
          case "phase":
            if (event.name !== "prepare") setStatus(RUNNING_STATUS[runMode]);
            batch.push({ kind: "info", text: `// phase: ${event.name}` });
            break;
          case "log":
            batch.push({ kind: "log", text: event.line });
            break;
          case "wasm":
            try {
              setWasm(decodeBase64(event.b64));
            } catch {
              batch.push({ kind: "error", text: "internal: could not decode wasm payload" });
            }
            break;
          case "done":
            finished = true;
            setStatus(
              event.ok ? "ok" : event.timedOut ? "timeout" : event.infraError ? "infra" : "err",
            );
            break;
          case "ping":
            break;
        }
      };

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        pending += decoder.decode(value, { stream: true });
        const batch: ConsoleLine[] = [];
        for (;;) {
          const nl = pending.indexOf("\n");
          if (nl === -1) break;
          const raw = pending.slice(0, nl);
          pending = pending.slice(nl + 1);
          if (!raw.trim()) continue;
          try {
            handleEvent(JSON.parse(raw) as ForgeEvent, batch);
          } catch {
            // tolerate a malformed line
          }
        }
        pushLines(batch);
      }
      if (!finished) setStatus("infra");
    } catch {
      if (!abort.signal.aborted) {
        pushLines([{ kind: "error", text: "Network error — try again." }]);
        setStatus("err");
      } else {
        pushLines([{ kind: "info", text: "// cancelled" }]);
        setStatus("idle");
      }
    } finally {
      inFlightRef.current = false;
      abortRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { status, mode, lines, wasm, running, run, cancel };
}
