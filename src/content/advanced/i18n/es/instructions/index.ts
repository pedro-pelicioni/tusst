import { rustOwnershipDeepInstructionsEs } from "./rust-ownership-deep";
import { rustLifetimesInstructionsEs } from "./rust-lifetimes";
import { rustTraitsGenericsInstructionsEs } from "./rust-traits-generics";
import { rustErrorHandlingInstructionsEs } from "./rust-error-handling";
import { rustCollectionsIteratorsInstructionsEs } from "./rust-collections-iterators";
import { rustSmartPointersInstructionsEs } from "./rust-smart-pointers";
import { rustConcurrencyInstructionsEs } from "./rust-concurrency";
import { rustAsyncInternalsInstructionsEs } from "./rust-async-internals";
import { rustSystemsEdgesInstructionsEs } from "./rust-systems-edges";
import { backendDataLayerInstructionsEs } from "./backend-data-layer";
import { backendIndexersDistsysInstructionsEs } from "./backend-indexers-distsys";
import { backendProductionInstructionsEs } from "./backend-production";
import { backendRpcServicesInstructionsEs } from "./backend-rpc-services";

// ES · editor instructions for the Advanced Path, one file per track.
//
// A slug with no entry falls back to English at resolution time
// (see ../../index.ts); `check:advanced` reports the gap.

export const esAdvancedInstructions: Record<string, { instructions: string }> = {
  ...rustOwnershipDeepInstructionsEs,
  ...rustLifetimesInstructionsEs,
  ...rustTraitsGenericsInstructionsEs,
  ...rustErrorHandlingInstructionsEs,
  ...rustCollectionsIteratorsInstructionsEs,
  ...rustSmartPointersInstructionsEs,
  ...rustConcurrencyInstructionsEs,
  ...rustAsyncInternalsInstructionsEs,
  ...rustSystemsEdgesInstructionsEs,
  ...backendDataLayerInstructionsEs,
  ...backendIndexersDistsysInstructionsEs,
  ...backendProductionInstructionsEs,
  ...backendRpcServicesInstructionsEs,
};
