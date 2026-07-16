"use client";

import { useEffect, useMemo, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { addDeployment } from "@/lib/forge-store";
import { explorerContractUrl, explorerTxUrl } from "@/lib/stellar/network";
import {
  constructorSpecFromWasm,
  deployContract,
  type DeployStep,
} from "@/lib/stellar/deploy";
import {
  describeFunction,
  formValuesToScVals,
  type SpecFunctionDescriptor,
} from "@/lib/stellar/spec-form";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { SpecArgsFields } from "./SpecArgsFields";

// Two-transaction testnet deploy panel: wasm summary → constructor args form
// (auto-generated from the wasm's spec) → progress stepper → contract id.

export function DeployPanel({
  wasm,
  wallet,
  onDeployed,
}: {
  wasm: Uint8Array | null;
  wallet: ForgeWallet | null;
  onDeployed: (contractId: string) => void;
}) {
  const m = useMessages();
  const stepLabel: Record<DeployStep, string> = {
    "upload-sign": m.ide.deploy.stepUploadSign,
    "upload-confirm": m.ide.deploy.stepUploadConfirm,
    "create-sign": m.ide.deploy.stepCreateSign,
    "create-confirm": m.ide.deploy.stepCreateConfirm,
  };
  const [values, setValues] = useState<Record<string, string>>({});
  const [step, setStep] = useState<DeployStep | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ contractId: string; createTx: string } | null>(null);

  // Constructor form (if the contract has one), derived from the built wasm.
  const ctor = useMemo(() => {
    if (!wasm) return null;
    try {
      const { spec, func } = constructorSpecFromWasm(wasm);
      return { spec, descriptor: func ? describeFunction(func) : null };
    } catch {
      return null;
    }
  }, [wasm]);

  // A new artifact invalidates the previous form/result state.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setValues({});
    setResult(null);
    setError("");
  }, [wasm]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const wasmSummary = useMemo(() => {
    if (!wasm) return null;
    return { kb: (wasm.length / 1024).toFixed(1) };
  }, [wasm]);

  const deploy = async () => {
    if (!wasm || !wallet || !ctor) return;
    setError("");
    setResult(null);
    let args: ReturnType<typeof formValuesToScVals> = [];
    try {
      args = ctor.descriptor
        ? formValuesToScVals(ctor.spec, ctor.descriptor as SpecFunctionDescriptor, values)
        : [];
    } catch (e) {
      setError(e instanceof Error ? e.message : m.ide.deploy.invalidArgs);
      return;
    }
    try {
      const res = await deployContract({
        wasm,
        wallet,
        constructorArgs: args,
        onStep: setStep,
      });
      setResult({ contractId: res.contractId, createTx: res.createTx });
      addDeployment({
        contractId: res.contractId,
        wasmHash: res.wasmHash,
        network: "testnet",
        label: "",
        createdAt: Date.now(),
      });
      onDeployed(res.contractId);
    } catch (e) {
      setError(e instanceof Error ? e.message : m.ide.deploy.failed);
    } finally {
      setStep(null);
    }
  };

  if (!wasm) {
    return (
      <p className="p-4 font-mono text-[11px] leading-relaxed text-muted">
        {m.ide.deploy.buildFirst}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="rounded-lg border border-line bg-bg px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {m.ide.deploy.artifact}
        </p>
        <p className="mt-1 font-mono text-[11px] text-fg">
          {fmt(m.ide.deploy.artifactSummary, { kb: wasmSummary?.kb ?? "" })}
        </p>
      </div>

      {!wallet && (
        <p className="font-mono text-[11px] text-muted">{m.ide.deploy.connectWallet}</p>
      )}

      {ctor?.descriptor && ctor.descriptor.fields.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {m.ide.deploy.constructorArgs}
          </p>
          <SpecArgsFields
            fields={ctor.descriptor.fields}
            values={values}
            onChange={(name, v) => setValues((prev) => ({ ...prev, [name]: v }))}
          />
        </div>
      )}

      <button
        type="button"
        disabled={!wallet || step !== null}
        onClick={deploy}
        className="rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
      >
        {step ? stepLabel[step] : m.ide.deploy.deployButton}
      </button>

      {error && <p className="font-mono text-[11px] text-red-400">{error}</p>}

      {result && (
        <div className="rounded-lg border border-pop/30 bg-pop/5 px-3 py-2">
          <p className="font-mono text-[10px] uppercase tracking-wider text-pop">
            {m.ide.deploy.deployed}
          </p>
          <p className="mt-1 break-all font-mono text-[11px] text-fg">{result.contractId}</p>
          <div className="mt-2 flex gap-3">
            <a
              href={explorerContractUrl(result.contractId)}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] text-accent underline-offset-2 hover:underline"
            >
              stellar.expert ↗
            </a>
            <a
              href={explorerTxUrl(result.createTx)}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] text-muted2 underline-offset-2 hover:underline"
            >
              {m.ide.deploy.txLink}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
