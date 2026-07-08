"use client";

import { useEffect, useState } from "react";
import type { contract } from "@stellar/stellar-sdk";
import { listDeployments } from "@/lib/forge-store";
import { explorerTxUrl } from "@/lib/stellar/network";
import { displayResult, fetchContractSpec, invokeFunction } from "@/lib/stellar/invoke";
import {
  describeFunctions,
  formValuesToScVals,
  type SpecFunctionDescriptor,
} from "@/lib/stellar/spec-form";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { SpecArgsFields } from "./SpecArgsFields";

// Integration panel: load any deployed contract's spec from the chain and
// invoke its functions through auto-generated forms. Reads return without
// signing (decided by simulation); writes prompt the wallet.

interface FnState {
  values: Record<string, string>;
  busy: boolean;
  error: string;
  outcome: { readOnly: boolean; text: string; txHash?: string } | null;
}

export function InteractPanel({
  wallet,
  prefillContractId,
}: {
  wallet: ForgeWallet | null;
  prefillContractId: string | null;
}) {
  const [contractId, setContractId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [spec, setSpec] = useState<contract.Spec | null>(null);
  const [functions, setFunctions] = useState<SpecFunctionDescriptor[]>([]);
  const [fnState, setFnState] = useState<Record<string, FnState>>({});
  const [openFn, setOpenFn] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Hydrate from localStorage / accept the freshly-deployed id (both are
  // external to React, so effects are the right tool).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHistory(listDeployments().map((d) => d.contractId));
  }, []);

  useEffect(() => {
    if (prefillContractId) setContractId(prefillContractId);
  }, [prefillContractId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const patchFn = (name: string, patch: Partial<FnState>) =>
    setFnState((prev) => {
      const base: FnState = prev[name] ?? {
        values: {},
        busy: false,
        error: "",
        outcome: null,
      };
      return { ...prev, [name]: { ...base, ...patch } };
    });

  const load = async () => {
    if (!wallet) {
      setLoadError("connect a wallet first — its account anchors simulations");
      return;
    }
    const id = contractId.trim();
    if (!/^C[A-Z2-7]{55}$/.test(id)) {
      setLoadError("that doesn't look like a contract id (C…)");
      return;
    }
    setLoading(true);
    setLoadError("");
    setSpec(null);
    setFunctions([]);
    setFnState({});
    try {
      const loaded = await fetchContractSpec(id, wallet.address);
      setSpec(loaded);
      setFunctions(describeFunctions(loaded));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message.slice(0, 300) : "could not load the contract");
    } finally {
      setLoading(false);
    }
  };

  const invoke = async (fn: SpecFunctionDescriptor) => {
    if (!wallet || !spec) return;
    const state = fnState[fn.name];
    patchFn(fn.name, { busy: true, error: "", outcome: null });
    try {
      const args = formValuesToScVals(spec, fn, state?.values ?? {});
      const outcome = await invokeFunction({
        contractId: contractId.trim(),
        spec,
        fnName: fn.name,
        args,
        wallet,
      });
      patchFn(fn.name, {
        busy: false,
        outcome: {
          readOnly: outcome.readOnly,
          text: displayResult(outcome.result),
          txHash: outcome.txHash,
        },
      });
    } catch (e) {
      patchFn(fn.name, {
        busy: false,
        error: e instanceof Error ? e.message.slice(0, 300) : "invocation failed",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
          contract id
        </label>
        <input
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="C…"
          list="forge-deployments"
          className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
        />
        <datalist id="forge-deployments">
          {history.map((id) => (
            <option key={id} value={id} />
          ))}
        </datalist>
        <button
          type="button"
          onClick={load}
          disabled={loading || contractId.trim() === ""}
          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {loading ? "loading spec…" : "load contract"}
        </button>
        {loadError && <p className="font-mono text-[10px] text-red-400">{loadError}</p>}
      </div>

      {functions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            functions · reads answer without signing
          </p>
          {functions.map((fn) => {
            const state = fnState[fn.name];
            const open = openFn === fn.name;
            return (
              <div key={fn.name} className="rounded-lg border border-line bg-bg">
                <button
                  type="button"
                  onClick={() => setOpenFn(open ? null : fn.name)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left"
                >
                  <span className="font-mono text-[12px] text-fg">{fn.name}</span>
                  <span className="font-mono text-[10px] text-muted">
                    {fn.fields.length} arg{fn.fields.length === 1 ? "" : "s"} {open ? "▾" : "▸"}
                  </span>
                </button>
                {open && (
                  <div className="flex flex-col gap-2 border-t border-line px-3 py-2.5">
                    {fn.fields.length > 0 && (
                      <SpecArgsFields
                        fields={fn.fields}
                        values={state?.values ?? {}}
                        onChange={(name, v) =>
                          patchFn(fn.name, {
                            values: { ...(state?.values ?? {}), [name]: v },
                          })
                        }
                      />
                    )}
                    <button
                      type="button"
                      disabled={state?.busy || !wallet}
                      onClick={() => invoke(fn)}
                      className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
                    >
                      {state?.busy ? "invoking…" : "invoke"}
                    </button>
                    {state?.error && (
                      <p className="break-all font-mono text-[10px] text-red-400">{state.error}</p>
                    )}
                    {state?.outcome && (
                      <div className="rounded border border-line bg-bg-elev px-2 py-1.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                          {state.outcome.readOnly ? "read (no signature)" : "write (signed)"}
                        </p>
                        <pre className="mt-1 whitespace-pre-wrap break-all font-mono text-[11px] text-pop">
                          {state.outcome.text}
                        </pre>
                        {state.outcome.txHash && (
                          <a
                            href={explorerTxUrl(state.outcome.txHash)}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[10px] text-accent underline-offset-2 hover:underline"
                          >
                            tx ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
