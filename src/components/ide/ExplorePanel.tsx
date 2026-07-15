"use client";

import { useEffect, useState } from "react";
import { addExplored, listExplored } from "@/lib/forge-store";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { ContractWorkbench } from "./ContractWorkbench";

// Explore = the workbench pointed at the open testnet: paste any deployed
// contract id, browse its interface, invoke. No wallet needed to look around.

export function ExplorePanel({ wallet }: { wallet: ForgeWallet | null }) {
  const [history, setHistory] = useState<string[]>([]);

  // Hydrate from localStorage (external to React, so an effect is right).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHistory(listExplored());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <ContractWorkbench
      wallet={wallet}
      suggestions={history}
      datalistId="forge-explored"
      onSpecLoaded={(id) => {
        addExplored(id);
        setHistory(listExplored());
      }}
    />
  );
}
