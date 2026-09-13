import { rustOwnershipDeepInstructionsPt } from "./rust-ownership-deep";
import { rustLifetimesInstructionsPt } from "./rust-lifetimes";
import { rustTraitsGenericsInstructionsPt } from "./rust-traits-generics";
import { rustErrorHandlingInstructionsPt } from "./rust-error-handling";
import { rustCollectionsIteratorsInstructionsPt } from "./rust-collections-iterators";
import { rustSmartPointersInstructionsPt } from "./rust-smart-pointers";
import { rustConcurrencyInstructionsPt } from "./rust-concurrency";
import { rustAsyncInternalsInstructionsPt } from "./rust-async-internals";
import { rustSystemsEdgesInstructionsPt } from "./rust-systems-edges";
import { backendDataLayerInstructionsPt } from "./backend-data-layer";
import { backendIndexersDistsysInstructionsPt } from "./backend-indexers-distsys";
import { backendProductionInstructionsPt } from "./backend-production";
import { backendRpcServicesInstructionsPt } from "./backend-rpc-services";

// PT · editor instructions for the Advanced Path, one file per track.
//
// A slug with no entry falls back to English at resolution time
// (see ../../index.ts); `check:advanced` reports the gap.

export const ptAdvancedInstructions: Record<string, { instructions: string }> = {
  ...rustOwnershipDeepInstructionsPt,
  ...rustLifetimesInstructionsPt,
  ...rustTraitsGenericsInstructionsPt,
  ...rustErrorHandlingInstructionsPt,
  ...rustCollectionsIteratorsInstructionsPt,
  ...rustSmartPointersInstructionsPt,
  ...rustConcurrencyInstructionsPt,
  ...rustAsyncInternalsInstructionsPt,
  ...rustSystemsEdgesInstructionsPt,
  ...backendDataLayerInstructionsPt,
  ...backendIndexersDistsysInstructionsPt,
  ...backendProductionInstructionsPt,
  ...backendRpcServicesInstructionsPt,
};
