"use client";

import { useEffect, useState } from "react";
import { addExplored, listExplored } from "@/lib/forge-store";
import { KNOWN_CONTRACTS } from "@/lib/stellar/known-contracts";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { ContractWorkbench } from "./ContractWorkbench";

// Explore = the workbench pointed at the open testnet: paste any deployed
// contract id, browse its interface, invoke. No wallet needed to look around —
// reads are simulated against a synthetic source and never signed.
//
// The curated list is the answer to an empty first visit: the panel used to
// open as a blank field demanding 56 characters that a beginner does not have.

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
      suggestions={history.map((value) => ({ value }))}
      datalistId="forge-explored"
      presets={KNOWN_CONTRACTS}
      onSpecLoaded={(id) => {
        addExplored(id);
        setHistory(listExplored());
      }}
    />
  );
}
