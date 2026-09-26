"use client";

import { useEffect, useRef, useState } from "react";
import type { contract } from "@stellar/stellar-sdk";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { explorerTxUrl } from "@/lib/stellar/network";
import {
  WalletRequiredError,
  displayResult,
  fetchContractSpec,
  invokeFunction,
} from "@/lib/stellar/invoke";
import { errorInfo, errorText } from "@/lib/stellar/errors";
import {
  lookupKnownContract,
  type KnownContract,
} from "@/lib/stellar/known-contracts";
import {
  archiveStatus,
  fetchContractLiveness,
  type ContractLiveness,
} from "@/lib/stellar/liveness";
import {
  describeFunctions,
  formValuesToScVals,
  type SpecFunctionDescriptor,
} from "@/lib/stellar/spec-form";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { SpecArgsFields } from "./SpecArgsFields";

// Shared engine behind the Interact and Explore panels: load any deployed
// contract's spec from the chain and invoke its functions through
// auto-generated forms. Read vs write is decided by simulation, not a UI
// toggle — and since a read is never signed or submitted, it needs no wallet
// at all. You can walk up to a public contract and ask it questions.
//
// One thing a spec cannot tell you is whether a function means what it says.
// When the loaded contract is one we know by name, its decoys are labelled
// rather than hidden: hiding them would only move the trap to whoever pastes
// the same id somewhere else.

interface FnState {
  values: Record<string, string>;
  busy: boolean;
  error: string;
  outcome: {
    readOnly: boolean;
    fromArchive?: boolean;
    text: string;
    txHash?: string;
  } | null;
}

/** A contract id plus the human name we know it by, when we know one. */
export interface ContractSuggestion {
  value: string;
  label?: string;
}

export function ContractWorkbench({
  wallet,
  prefillContractId = null,
  suggestions,
  datalistId,
  presets,
  onSpecLoaded,
}: {
  wallet: ForgeWallet | null;
  prefillContractId?: string | null;
  suggestions: ContractSuggestion[];
  datalistId: string;
  /** curated contracts offered as one-click starting points */
  presets?: readonly KnownContract[];
  onSpecLoaded?: (contractId: string) => void;
}) {
  const m = useMessages();
  const [contractId, setContractId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [spec, setSpec] = useState<contract.Spec | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [functions, setFunctions] = useState<SpecFunctionDescriptor[]>([]);
  const [fnState, setFnState] = useState<Record<string, FnState>>({});
  const [openFn, setOpenFn] = useState<string | null>(null);
  const [showDecoys, setShowDecoys] = useState(false);
  // Keyed by id so a slow answer for the previous contract cannot land on
  // the next one.
  const [liveness, setLiveness] = useState<{
    id: string;
    info: ContractLiveness;
  } | null>(null);
  // Every load() takes a ticket; only the latest may write results, so a
  // slow answer for an earlier id cannot overwrite a newer one.
  const loadTicket = useRef(0);

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

  const load = async (idOverride?: string) => {
    const id = (idOverride ?? contractId).trim();
    if (idOverride) setContractId(idOverride);
    if (!/^C[A-Z2-7]{55}$/.test(id)) {
      setLoadError(m.ide.workbench.invalidId);
      return;
    }
    const ticket = ++loadTicket.current;
    setLoading(true);
    setLoadError("");
    setSpec(null);
    setLoadedId(null);
    setFunctions([]);
    setFnState({});
    setShowDecoys(false);
    setLiveness(null);
    try {
      const loaded = await fetchContractSpec(id, wallet?.address);
      if (ticket !== loadTicket.current) return;
      setSpec(loaded);
      setLoadedId(id);
      setFunctions(describeFunctions(loaded));
      onSpecLoaded?.(id);
      refreshLiveness(id);
    } catch (e) {
      if (ticket !== loadTicket.current) return;
      const { message, code } = errorInfo(e, m.ide.workbench.loadFailed);
      // The instance entry does not exist at all. Archived entries still
      // come back from the RPC, so this is a wrong id, another network, or
      // a testnet reset — never "archived". Other 404s (a missing Wasm, an
      // unresolvable external ref) keep their own message below.
      if (code === 404 && /contract instance/i.test(message)) {
        setLoadError(m.ide.workbench.notFound);
      } else {
        const trimmed = message.slice(0, 300);
        setLoadError(
          /wasm|entry|not found|contract instance/i.test(trimmed)
            ? fmt(m.ide.workbench.noSpecSuffix, { message: trimmed })
            : trimmed,
        );
      }
    } finally {
      if (ticket === loadTicket.current) setLoading(false);
    }
  };

  // Advisory only: a failed TTL lookup must not cost the learner the spec.
  const refreshLiveness = (id: string) => {
    fetchContractLiveness(id)
      .then((info) => info && setLiveness({ id, info }))
      .catch(() => {});
  };

  const invoke = async (fn: SpecFunctionDescriptor) => {
    // The spec on screen belongs to loadedId; the text box may already hold
    // another id, and calling that with this spec would be nonsense.
    if (!spec || !loadedId) return;
    const target = loadedId;
    const state = fnState[fn.name];
    patchFn(fn.name, { busy: true, error: "", outcome: null });
    try {
      const args = formValuesToScVals(spec, fn, state?.values ?? {});
      const outcome = await invokeFunction({
        contractId: target,
        spec,
        fnName: fn.name,
        args,
        wallet,
      });
      patchFn(fn.name, {
        busy: false,
        outcome: {
          readOnly: outcome.readOnly,
          fromArchive: outcome.fromArchive,
          text: displayResult(outcome.result),
          txHash: outcome.txHash,
        },
      });
      // A signed call restores whatever it touched, so the notice may be stale.
      if (!outcome.readOnly) refreshLiveness(target);
    } catch (e) {
      patchFn(fn.name, {
        busy: false,
        error:
          e instanceof WalletRequiredError
            ? m.ide.workbench.connectToInvoke
            : errorText(e, m.ide.workbench.invocationFailed).slice(0, 300),
      });
    }
  };

  const known = loadedId ? lookupKnownContract(loadedId) : undefined;
  const live = liveness && liveness.id === loadedId ? liveness.info : null;
  const archive = live ? archiveStatus(live) : "live";
  const decoyNames = new Set(known?.decoys ?? []);
  const realFns = functions.filter((f) => !decoyNames.has(f.name));
  const decoyFns = functions.filter((f) => decoyNames.has(f.name));

  const renderFn = (fn: SpecFunctionDescriptor, decoy: boolean) => {
    const state = fnState[fn.name];
    const open = openFn === fn.name;
    return (
      <div
        key={fn.name}
        className={`rounded-lg border bg-bg ${decoy ? "border-amber-500/30" : "border-line"}`}
      >
        <button
          type="button"
          onClick={() => setOpenFn(open ? null : fn.name)}
          className="flex w-full items-center justify-between px-3 py-2 text-left"
        >
          <span className="flex items-baseline gap-1.5">
            <span className="font-mono text-[12px] text-fg">{fn.name}</span>
            {decoy && (
              <span className="rounded-sm border border-amber-500/40 px-1 font-mono text-[9px] uppercase tracking-wider text-amber-400">
                {m.ide.known.decoyBadge}
              </span>
            )}
          </span>
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
              disabled={state?.busy}
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
                  {state.outcome.fromArchive
                    ? m.ide.workbench.archivedReadResult
                    : state.outcome.readOnly
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
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {presets && presets.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {m.ide.known.heading}
          </p>
          <div className="flex flex-col gap-1">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => void load(p.id)}
                title={p.id}
                className="flex items-baseline justify-between gap-2 rounded border border-line/60 px-2 py-1.5 text-left transition hover:border-accent/50 hover:bg-accent/[0.06]"
              >
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-fg">
                  {m.ide.known.entries[p.slug]}
                </span>
                <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                  {m.ide.known.preview}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

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
          {suggestions.map((s) => (
            <option key={s.value} value={s.value} label={s.label} />
          ))}
        </datalist>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading || contractId.trim() === ""}
          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {loading ? m.ide.workbench.loadingSpec : m.ide.workbench.loadContract}
        </button>
        {loadError && <p className="font-mono text-[10px] text-red-400">{loadError}</p>}
      </div>

      {live && archive !== "live" && !loadError && (
        <p className="font-mono text-[10px] text-amber-400">
          {archive === "archived"
            ? m.ide.workbench.stateArchived
            : fmt(m.ide.workbench.stateArchivesOn, {
                date: live.approxArchiveAt.toISOString().slice(0, 10),
              })}
        </p>
      )}

      {functions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {m.ide.workbench.functionsHeading}
          </p>
          {realFns.map((fn) => renderFn(fn, false))}

          {decoyFns.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowDecoys((v) => !v)}
                className="self-start font-mono text-[10px] text-amber-400/80 underline-offset-2 hover:underline"
              >
                {showDecoys
                  ? m.ide.known.hideDecoys
                  : fmt(m.ide.known.showDecoys, { count: decoyFns.length })}
              </button>
              {showDecoys && (
                <>
                  <p className="font-mono text-[10px] leading-relaxed text-amber-400/70">
                    {m.ide.known.decoyNote}
                  </p>
                  {decoyFns.map((fn) => renderFn(fn, true))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
