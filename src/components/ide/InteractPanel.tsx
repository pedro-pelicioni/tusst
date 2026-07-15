"use client";

import { useEffect, useState } from "react";
import { listDeployments } from "@/lib/forge-store";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { ContractWorkbench } from "./ContractWorkbench";

// Interact = the workbench anchored to YOUR deployments: prefilled with the
// freshly-deployed contract, suggestions from the deploy history.

export function InteractPanel({
  wallet,
  prefillContractId,
}: {
  wallet: ForgeWallet | null;
  prefillContractId: string | null;
}) {
  const [history, setHistory] = useState<string[]>([]);

  // Hydrate from localStorage (external to React, so an effect is right).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHistory(listDeployments().map((d) => d.contractId));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <ContractWorkbench
      wallet={wallet}
      prefillContractId={prefillContractId}
      suggestions={history}
      datalistId="forge-deployments"
    />
  );
}
