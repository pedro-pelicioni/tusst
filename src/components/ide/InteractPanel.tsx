"use client";

import { useEffect, useState } from "react";
import { useMessages } from "@/i18n/client";
import { listDeployments, type ForgeDeployment } from "@/lib/forge-store";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { ContractWorkbench } from "./ContractWorkbench";

// Interact = the workbench anchored to YOUR deployments: prefilled with the
// freshly-deployed contract, suggestions from the deploy history.
//
// The store has always carried a `label` (the labs engine writes "lab: SYM"
// after a guided deploy), plus the wasm hash and a timestamp — and this panel
// used to drop all three on the floor, mapping straight to `contractId`. A
// contract you forged in a lab now shows up here by name.

export function InteractPanel({
  wallet,
  prefillContractId,
}: {
  wallet: ForgeWallet | null;
  prefillContractId: string | null;
}) {
  const m = useMessages();
  const [history, setHistory] = useState<ForgeDeployment[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  // Hydrate from localStorage (external to React, so an effect is right).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHistory(listDeployments());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="flex flex-col">
      {history.length > 0 && (
        <div className="border-b border-line px-4 pb-3 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {m.ide.workbench.recentHeading}
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {history.slice(0, 6).map((d) => (
              <button
                key={d.contractId}
                type="button"
                onClick={() => setPicked(d.contractId)}
                title={d.contractId}
                className="flex items-baseline justify-between gap-2 rounded border border-line/60 px-2 py-1.5 text-left transition hover:border-accent/50 hover:bg-accent/[0.06]"
              >
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-fg">
                  {d.label || `${d.contractId.slice(0, 6)}…${d.contractId.slice(-4)}`}
                </span>
                <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                  {new Date(d.createdAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <ContractWorkbench
        wallet={wallet}
        prefillContractId={picked ?? prefillContractId}
        suggestions={history.map((d) => ({ value: d.contractId, label: d.label }))}
        datalistId="forge-deployments"
      />
    </div>
  );
}
