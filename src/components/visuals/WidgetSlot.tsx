"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { WidgetComponent } from "@/content/visuals/types";

// The registry that replaces `{step.component === "scp-sim" && <ScpSim />}` —
// a line that was duplicated byte-for-byte in ConceptPlayer and LabPlayer and
// would have grown a branch per simulator in both.
//
// Keying the Record on the union means adding a member to `WidgetComponent`
// without registering it here is a COMPILE error, not a blank space in a
// lesson. And `next/dynamic` keeps each simulator out of the bundle of every
// chapter that does not use it.

const WIDGETS: Record<WidgetComponent, ComponentType> = {
  "scp-sim": dynamic(() =>
    import("@/components/labs/sims/ScpSim").then((m) => m.ScpSim),
  ),
  "ledger-tamper": dynamic(() =>
    import("./LedgerTamperSim").then((m) => m.LedgerTamperSim),
  ),
  "seal-sign": dynamic(() => import("./SealSim").then((m) => m.SealSim)),
  "context-window": dynamic(() =>
    import("./ContextWindowSim").then((m) => m.ContextWindowSim),
  ),
  "loop-brake": dynamic(() =>
    import("./LoopBrakeSim").then((m) => m.LoopBrakeSim),
  ),
  "dependency-rule": dynamic(() =>
    import("./DependencyRuleSim").then((m) => m.DependencyRuleSim),
  ),
  "blast-radius": dynamic(() =>
    import("./BlastRadiusSim").then((m) => m.BlastRadiusSim),
  ),
  "fan-out": dynamic(() =>
    import("./FanOutSim").then((m) => m.FanOutSim),
  ),
  "amm-pool": dynamic(() =>
    import("./AmmPoolSim").then((m) => m.AmmPoolSim),
  ),
  "path-payment": dynamic(() =>
    import("./PathPaymentSim").then((m) => m.PathPaymentSim),
  ),
  "explorer-view": dynamic(() =>
    import("./ExplorerViewSim").then((m) => m.ExplorerViewSim),
  ),
  "state-archival": dynamic(() =>
    import("./StateArchivalSim").then((m) => m.StateArchivalSim),
  ),
};

export function WidgetSlot({ component }: { component: WidgetComponent }) {
  const Widget = WIDGETS[component];
  return <Widget />;
}
