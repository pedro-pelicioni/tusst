import { rustOwnershipDeepInstructionsTr } from "./rust-ownership-deep";
import { rustLifetimesInstructionsTr } from "./rust-lifetimes";
import { rustTraitsGenericsInstructionsTr } from "./rust-traits-generics";
import { rustErrorHandlingInstructionsTr } from "./rust-error-handling";
import { rustCollectionsIteratorsInstructionsTr } from "./rust-collections-iterators";
import { rustSmartPointersInstructionsTr } from "./rust-smart-pointers";
import { rustConcurrencyInstructionsTr } from "./rust-concurrency";
import { rustAsyncInternalsInstructionsTr } from "./rust-async-internals";
import { rustSystemsEdgesInstructionsTr } from "./rust-systems-edges";
import { backendDataLayerInstructionsTr } from "./backend-data-layer";
import { backendIndexersDistsysInstructionsTr } from "./backend-indexers-distsys";
import { backendProductionInstructionsTr } from "./backend-production";
import { backendRpcServicesInstructionsTr } from "./backend-rpc-services";

// TR · editor instructions for the Advanced Path, one file per track.
//
// A slug with no entry falls back to English at resolution time
// (see ../../index.ts); `check:advanced` reports the gap.

export const trAdvancedInstructions: Record<string, { instructions: string }> = {
  ...rustOwnershipDeepInstructionsTr,
  ...rustLifetimesInstructionsTr,
  ...rustTraitsGenericsInstructionsTr,
  ...rustErrorHandlingInstructionsTr,
  ...rustCollectionsIteratorsInstructionsTr,
  ...rustSmartPointersInstructionsTr,
  ...rustConcurrencyInstructionsTr,
  ...rustAsyncInternalsInstructionsTr,
  ...rustSystemsEdgesInstructionsTr,
  ...backendDataLayerInstructionsTr,
  ...backendIndexersDistsysInstructionsTr,
  ...backendProductionInstructionsTr,
  ...backendRpcServicesInstructionsTr,
};
