"use client";

import { useEffect, useState } from "react";
import type { contract } from "@stellar/stellar-sdk";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { explorerTxUrl } from "@/lib/stellar/network";
import { displayResult, fetchContractSpec, invokeFunction } from "@/lib/stellar/invoke";
import {
  describeFunctions,
  formValuesToScVals,
  type SpecFunctionDescriptor,
} from "@/lib/stellar/spec-form";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { SpecArgsFields } from "./SpecArgsFields";

// Shared engine behind the Interact and Explore panels: load any deployed
// contract's spec from the chain and invoke its functions through
// auto-generated forms. Loading the spec needs no wallet; invocations do
// (the wallet's account anchors the simulation and signs writes). Reads
// return without signing — decided by simulation, not a UI toggle.

interface FnState {
  values: Record<string, string>;
  busy: boolean;
  error: string;
  outcome: { readOnly: boolean; text: string; txHash?: string } | null;
}

export function ContractWorkbench({
  wallet,
  prefillContractId = null,
  suggestions,
  datalistId,
  onSpecLoaded,
}: {
  wallet: ForgeWallet | null;
  prefillContractId?: string | null;
  suggestions: string[];
  datalistId: string;
  onSpecLoaded?: (contractId: string) => void;
}) {
  const m = useMessages();
  const [contractId, setContractId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [spec, setSpec] = useState<contract.Spec | null>(null);
  const [functions, setFunctions] = useState<SpecFunctionDescriptor[]>([]);
  const [fnState, setFnState] = useState<Record<string, FnState>>({});
  const [openFn, setOpenFn] = useState<string | null>(null);

  // The freshly-deployed id arrives from outside React's event flow.
  /* eslint-disable react-hooks/set-state-in-effect */
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
    const id = contractId.trim();
    if (!/^C[A-Z2-7]{55}$/.test(id)) {
      setLoadError(m.ide.workbench.invalidId);
      return;
    }
    setLoading(true);
    setLoadError("");
    setSpec(null);
    setFunctions([]);
    setFnState({});
    try {
      const loaded = await fetchContractSpec(id, wallet?.address);
      setSpec(loaded);
      setFunctions(describeFunctions(loaded));
      onSpecLoaded?.(id);
    } catch (e) {
      const message =
        e instanceof Error ? e.message.slice(0, 300) : m.ide.workbench.loadFailed;
      setLoadError(
        /wasm|entry|not found/i.test(message)
          ? fmt(m.ide.workbench.noSpecSuffix, { message })
          : message,
      );
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
        error: e instanceof Error ? e.message.slice(0, 300) : m.ide.workbench.invocationFailed,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {m.ide.workbench.contractIdLabel}
        </label>
        <input
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="C…"
          list={datalistId}
          className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
        />
        <datalist id={datalistId}>
          {suggestions.map((id) => (
            <option key={id} value={id} />
          ))}
        </datalist>
        <button
          type="button"
          onClick={load}
          disabled={loading || contractId.trim() === ""}
          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {loading ? m.ide.workbench.loadingSpec : m.ide.workbench.loadContract}
        </button>
        {loadError && <p className="font-mono text-[10px] text-red-400">{loadError}</p>}
      </div>

      {functions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {m.ide.workbench.functionsHeading}
          </p>
          {!wallet && (
            <p className="font-mono text-[10px] text-muted2">
              {m.ide.workbench.connectToInvoke}
            </p>
          )}
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
                    {fmt(
                      fn.fields.length === 1
                        ? m.ide.workbench.argCountOne
                        : m.ide.workbench.argCountOther,
                      { count: fn.fields.length },
                    )}{" "}
                    {open ? "▾" : "▸"}
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
                      {state?.busy ? m.ide.workbench.invoking : m.ide.workbench.invoke}
                    </button>
                    {state?.error && (
                      <p className="break-all font-mono text-[10px] text-red-400">{state.error}</p>
                    )}
                    {state?.outcome && (
                      <div className="rounded border border-line bg-bg-elev px-2 py-1.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                          {state.outcome.readOnly
                            ? m.ide.workbench.readResult
                            : m.ide.workbench.writeResult}
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
                            {m.ide.workbench.txLink}
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
