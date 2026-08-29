"use client";

import { useMemo, useState } from "react";
import { useMessages } from "@/i18n/client";
import {
  buildClassicTx,
  ClassicSubmitError,
  runClassicOps,
  type ClassicOpSpec,
} from "@/lib/stellar/classic";
import { setLastEnvelope } from "@/lib/forge-store";
import { decodeEnvelope } from "@/lib/stellar/xdr-tools";
import { JsonTree } from "./JsonTree";
import { CLASSIC_OPS } from "@/lib/stellar/ops";
import { explorerTxUrl } from "@/lib/stellar/network";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { SpecArgsFields } from "./SpecArgsFields";

// The Anvil: build a classic transaction out of real operations, sign it with
// your own key, and watch Horizon answer.
//
// The queue is the point. Stellar puts up to 100 operations in ONE atomic
// transaction, and that is how sponsorship (begin → sponsored op → end) and
// multi-step setups are actually expressed — so the panel is built around a
// list, not a single op.

type Status =
  | { s: "idle" }
  | { s: "signing" }
  | { s: "submitting" }
  | { s: "ok"; hash: string }
  | { s: "err"; message: string; codes: string[] };

export function OpsPanel({ wallet }: { wallet: ForgeWallet | null }) {
  const m = useMessages();

  // classic.ts already turns a result code into an English sentence for the
  // labs path; here the same code is looked up in the reader's own language,
  // falling back to that English hint when we have no translation for it.
  const hints = m.ide.ops.hints as Record<string, string | undefined>;
  const localizedHint = (codes: string[]) =>
    codes.map((c) => hints[c]).find(Boolean);
  const [type, setType] = useState<ClassicOpSpec["type"]>("payment");
  const [values, setValues] = useState<Record<string, string>>({});
  const [queue, setQueue] = useState<ClassicOpSpec[]>([]);
  const [buildError, setBuildError] = useState("");
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const [preview, setPreview] = useState<unknown>(null);
  const [previewing, setPreviewing] = useState(false);

  const descriptor = useMemo(
    () => CLASSIC_OPS.find((op) => op.type === type) ?? CLASSIC_OPS[0],
    [type],
  );

  const add = () => {
    try {
      setQueue((q) => [...q, descriptor.build(values)]);
      setValues({});
      setBuildError("");
      setStatus({ s: "idle" });
    } catch (e) {
      setBuildError(e instanceof Error ? e.message : String(e));
    }
  };

  // "Show me what I am about to sign." Builds the real unsigned envelope (same
  // call the submit path uses) and stashes it so the Rune Reader can pick it
  // up from its own tab.
  const previewXdr = async () => {
    if (!wallet || queue.length === 0) return;
    setPreviewing(true);
    setBuildError("");
    try {
      const xdr = await buildClassicTx(wallet.address, queue);
      setLastEnvelope(xdr);
      setPreview(decodeEnvelope(xdr));
    } catch (e) {
      setBuildError(e instanceof Error ? e.message : String(e));
    } finally {
      setPreviewing(false);
    }
  };

  const submit = async () => {
    if (!wallet || queue.length === 0) return;
    setStatus({ s: "signing" });
    try {
      // buildClassicTx re-reads the sequence, so a stale one can't leak in.
      const promise = runClassicOps(wallet, queue);
      setStatus({ s: "submitting" });
      const { hash } = await promise;
      setStatus({ s: "ok", hash });
      setQueue([]);
      setPreview(null);
    } catch (e) {
      if (e instanceof ClassicSubmitError) {
        setStatus({ s: "err", message: e.message, codes: e.codes });
      } else {
        setStatus({ s: "err", message: e instanceof Error ? e.message : String(e), codes: [] });
      }
    }
  };

  if (!wallet) {
    return (
      <p className="px-4 py-4 font-mono text-[11px] leading-relaxed text-muted">
        {m.ide.ops.connectFirst}
      </p>
    );
  }

  const busy = status.s === "signing" || status.s === "submitting";

  return (
    <div className="px-4 py-4">
      <label className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {m.ide.ops.pick}
        </span>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as ClassicOpSpec["type"]);
            setValues({});
            setBuildError("");
          }}
          className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
        >
          {CLASSIC_OPS.map((op) => (
            <option key={op.type} value={op.type}>
              {m.ide.ops.list[op.type].label}
            </option>
          ))}
        </select>
      </label>

      <p className="mt-2 text-[11.5px] leading-relaxed text-muted2">
        {m.ide.ops.list[descriptor.type].doc}
      </p>

      <div className="mt-3">
        <SpecArgsFields
          fields={descriptor.fields}
          values={values}
          onChange={(name, value) => setValues((v) => ({ ...v, [name]: value }))}
        />
      </div>

      {buildError && (
        <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-ember">
          {buildError}
        </p>
      )}

      <button
        type="button"
        onClick={add}
        className="mt-3 w-full rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20"
      >
        {m.ide.ops.add}
      </button>

      <div className="mt-5 border-t border-line pt-3">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {m.ide.ops.queue}
            {queue.length > 0 && ` · ${queue.length}`}
          </p>
          {queue.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQueue([]);
                setPreview(null);
              }}
              className="font-mono text-[10px] text-muted transition hover:text-fg"
            >
              {m.ide.ops.clear}
            </button>
          )}
        </div>

        {queue.length === 0 ? (
          <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-muted">
            {m.ide.ops.queueEmpty}
          </p>
        ) : (
          <>
            <ol className="mt-2 flex flex-col gap-1">
              {queue.map((op, i) => (
                <li
                  key={`${op.type}-${i}`}
                  className="flex items-center justify-between gap-2 rounded border border-line/60 px-2 py-1.5"
                >
                  <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-fg">
                    {i + 1}. {m.ide.ops.list[op.type].label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQueue((q) => q.filter((_, j) => j !== i))}
                    aria-label={m.ide.ops.remove}
                    className="shrink-0 font-mono text-[11px] text-muted2 transition hover:text-ember"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-2 font-mono text-[9.5px] leading-relaxed text-muted">
              {m.ide.ops.multiHint}
            </p>
            <button
              type="button"
              onClick={() => void previewXdr()}
              disabled={previewing}
              className="mt-3 w-full rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg disabled:opacity-50"
            >
              {previewing ? m.ide.ops.previewing : m.ide.ops.preview}
            </button>
            {preview !== null && (
              <div className="mt-2">
                <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                  {m.ide.ops.previewTitle}
                </p>
                <JsonTree value={preview} defaultDepth={2} />
              </div>
            )}
            <button
              type="button"
              onClick={() => void submit()}
              disabled={busy}
              className="mt-3 w-full rounded-md px-3 py-2 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#062421] transition disabled:opacity-60"
              style={{ background: "linear-gradient(180deg, #9ef0e4, #45d6c4)" }}
            >
              {status.s === "signing"
                ? m.ide.ops.signing
                : status.s === "submitting"
                  ? m.ide.ops.submitting
                  : m.ide.ops.sign}
            </button>
          </>
        )}
      </div>

      {status.s === "ok" && (
        <div className="mt-4 rounded-lg border border-pop/40 bg-pop/10 px-3 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-pop">
            {m.ide.ops.success}
          </p>
          <a
            href={explorerTxUrl(status.hash)}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block font-mono text-[10.5px] text-accent2 underline-offset-2 hover:underline"
          >
            {m.ide.ops.viewTx}
          </a>
        </div>
      )}

      {status.s === "err" && (
        <div className="mt-4 rounded-lg border border-ember/40 bg-ember/10 px-3 py-2.5">
          {/* The hint is the teaching: Horizon's result codes are precise, and
              classic.ts already maps the common ones to a human sentence. */}
          <p className="text-[11.5px] leading-relaxed text-ember">
            {localizedHint(status.codes) ?? status.message}
          </p>
          {status.codes.length > 0 && (
            <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ember/70">
              {status.codes.join(" · ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
