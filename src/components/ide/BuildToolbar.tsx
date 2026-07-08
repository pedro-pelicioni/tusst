"use client";

import type { ForgeRunStatus } from "./use-forge-run";

// Point-and-click actions for the sandbox pipeline: build / test / audit,
// cancel while running, and download of the last compiled wasm.

export function BuildToolbar({
  status,
  running,
  hasWasm,
  onBuild,
  onTest,
  onAudit,
  onCancel,
  onDownload,
}: {
  status: ForgeRunStatus;
  running: boolean;
  hasWasm: boolean;
  onBuild: () => void;
  onTest: () => void;
  onAudit: () => void;
  onCancel: () => void;
  onDownload: () => void;
}) {
  const actionClass =
    "rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted2";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onBuild}
        disabled={running}
        className="rounded-md border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
      >
        {running && status === "building" ? "building…" : "build ⌘⏎"}
      </button>
      <button type="button" onClick={onTest} disabled={running} className={actionClass}>
        {running && status === "testing" ? "testing…" : "test"}
      </button>
      <button type="button" onClick={onAudit} disabled={running} className={actionClass}>
        {running && status === "auditing" ? "auditing…" : "audit"}
      </button>
      {running ? (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-red-400/40 px-3 py-1.5 font-mono text-[11px] text-red-400 transition hover:bg-red-400/10"
        >
          cancel
        </button>
      ) : (
        <button
          type="button"
          onClick={onDownload}
          disabled={!hasWasm}
          className={actionClass}
          title={hasWasm ? "download the compiled .wasm" : "build first"}
        >
          ↓ .wasm
        </button>
      )}
    </div>
  );
}
