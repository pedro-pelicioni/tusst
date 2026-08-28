"use client";

// The NDJSON streaming transport for the Forge runner, extracted from
// use-forge-run so the IDE hook and the labs engine share one client for
// /api/soroban/{compile,test,audit}. Pure transport: no i18n, no React —
// callers translate events into their own UI language.

import type { ForgeEvent, ForgeMode, SorobanFileMap } from "@/lib/soroban/types";

// The sandbox needs a host with Docker. Same-origin by default (dev, VPS
// deploys); on serverless hosts set NEXT_PUBLIC_FORGE_RUNNER_URL to a
// runner instance (same app deployed on a Docker-capable box with
// FORGE_CORS_ORIGIN allowing this site). Inlined at build time.
const RUNNER_BASE = (process.env.NEXT_PUBLIC_FORGE_RUNNER_URL ?? "").replace(/\/+$/, "");
export const FORGE_ENDPOINT: Record<ForgeMode, string> = {
  build: `${RUNNER_BASE}/api/soroban/compile`,
  test: `${RUNNER_BASE}/api/soroban/test`,
  audit: `${RUNNER_BASE}/api/soroban/audit`,
};

export interface ForgeStreamCallbacks {
  onQueued?(position: number): void;
  onPhase?(name: string): void;
  onLog?(line: string): void;
}

export interface ForgeStreamResult {
  ok: boolean;
  timedOut: boolean;
  infraError: boolean;
  /** the runner rejected the request before streaming (validation, rate limit) */
  preStreamError?: string;
  /** fetch/stream failed at the network layer (and was not an abort) */
  networkError?: boolean;
  aborted?: boolean;
  /** present after a successful build */
  wasm: Uint8Array | null;
  wasmB64: string | null;
}

function decodeBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function runForgeStream(
  mode: ForgeMode,
  files: SorobanFileMap,
  cb: ForgeStreamCallbacks = {},
  signal?: AbortSignal,
): Promise<ForgeStreamResult> {
  const result: ForgeStreamResult = {
    ok: false,
    timedOut: false,
    infraError: false,
    wasm: null,
    wasmB64: null,
  };

  try {
    const res = await fetch(FORGE_ENDPOINT[mode], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files }),
      signal,
    });

    // A JSON body means the request was rejected before the stream began.
    if (res.headers.get("content-type")?.includes("application/json")) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      result.preStreamError = data?.error ?? "request rejected";
      return result;
    }
    if (!res.ok || !res.body) {
      result.infraError = true;
      return result;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let pending = "";
    let finished = false;

    const handleEvent = (event: ForgeEvent) => {
      switch (event.t) {
        case "queued":
          cb.onQueued?.(event.position);
          break;
        case "phase":
          cb.onPhase?.(event.name);
          break;
        case "log":
          cb.onLog?.(event.line);
          break;
        case "wasm":
          try {
            result.wasm = decodeBase64(event.b64);
            result.wasmB64 = event.b64;
          } catch {
            // caller sees a build marked ok but no wasm — treated as failure
          }
          break;
        case "done":
          finished = true;
          result.ok = event.ok;
          result.timedOut = !event.ok && !!event.timedOut;
          result.infraError = !event.ok && !!event.infraError;
          break;
        case "ping":
          break;
      }
    };

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      pending += decoder.decode(value, { stream: true });
      for (;;) {
        const nl = pending.indexOf("\n");
        if (nl === -1) break;
        const raw = pending.slice(0, nl);
        pending = pending.slice(nl + 1);
        if (!raw.trim()) continue;
        try {
          handleEvent(JSON.parse(raw) as ForgeEvent);
        } catch {
          // tolerate a malformed line
        }
      }
    }
    if (!finished) result.infraError = true;
    return result;
  } catch {
    if (signal?.aborted) {
      result.aborted = true;
    } else {
      result.networkError = true;
    }
    return result;
  }
}
