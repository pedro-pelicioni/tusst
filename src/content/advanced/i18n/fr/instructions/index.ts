import { rustOwnershipDeepInstructionsFr } from "./rust-ownership-deep";
import { rustLifetimesInstructionsFr } from "./rust-lifetimes";
import { rustTraitsGenericsInstructionsFr } from "./rust-traits-generics";
import { rustErrorHandlingInstructionsFr } from "./rust-error-handling";
import { rustCollectionsIteratorsInstructionsFr } from "./rust-collections-iterators";
import { rustSmartPointersInstructionsFr } from "./rust-smart-pointers";
import { rustConcurrencyInstructionsFr } from "./rust-concurrency";
import { rustAsyncInternalsInstructionsFr } from "./rust-async-internals";
import { rustSystemsEdgesInstructionsFr } from "./rust-systems-edges";
import { backendDataLayerInstructionsFr } from "./backend-data-layer";
import { backendIndexersDistsysInstructionsFr } from "./backend-indexers-distsys";
import { backendProductionInstructionsFr } from "./backend-production";
import { backendRpcServicesInstructionsFr } from "./backend-rpc-services";

// FR · editor instructions for the Advanced Path, one file per track.
//
// A slug with no entry falls back to English at resolution time
// (see ../../index.ts); `check:advanced` reports the gap.

export const frAdvancedInstructions: Record<string, { instructions: string }> = {
  ...rustOwnershipDeepInstructionsFr,
  ...rustLifetimesInstructionsFr,
  ...rustTraitsGenericsInstructionsFr,
  ...rustErrorHandlingInstructionsFr,
  ...rustCollectionsIteratorsInstructionsFr,
  ...rustSmartPointersInstructionsFr,
  ...rustConcurrencyInstructionsFr,
  ...rustAsyncInternalsInstructionsFr,
  ...rustSystemsEdgesInstructionsFr,
  ...backendDataLayerInstructionsFr,
  ...backendIndexersDistsysInstructionsFr,
  ...backendProductionInstructionsFr,
  ...backendRpcServicesInstructionsFr,
};
