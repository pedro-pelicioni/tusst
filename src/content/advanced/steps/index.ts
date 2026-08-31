import type { LessonStep } from "@/content/steps";
import { rustOwnershipDeepSteps } from "./rust-ownership-deep";
import { rustLifetimesSteps } from "./rust-lifetimes";
import { rustTraitsGenericsSteps } from "./rust-traits-generics";
import { rustErrorHandlingSteps } from "./rust-error-handling";
import { rustCollectionsIteratorsSteps } from "./rust-collections-iterators";
import { rustSmartPointersSteps } from "./rust-smart-pointers";
import { rustConcurrencySteps } from "./rust-concurrency";
import { rustAsyncInternalsSteps } from "./rust-async-internals";
import { rustSystemsEdgesSteps } from "./rust-systems-edges";
import { backendIndexersDistsysSteps } from "./backend-indexers-distsys";
import { backendRpcServicesSteps } from "./backend-rpc-services";
import { backendDataLayerSteps } from "./backend-data-layer";
import { backendProductionSteps } from "./backend-production";

// Client-safe step flows for the Advanced Path, merged into one record.
// `src/content/steps.ts` falls back to this map, so the existing lesson
// player and its locale overlay work on advanced lessons unchanged.

export const advancedSteps: Record<string, LessonStep[]> = {
  ...rustOwnershipDeepSteps,
  ...rustLifetimesSteps,
  ...rustTraitsGenericsSteps,
  ...rustErrorHandlingSteps,
  ...rustCollectionsIteratorsSteps,
  ...rustSmartPointersSteps,
  ...rustConcurrencySteps,
  ...rustAsyncInternalsSteps,
  ...rustSystemsEdgesSteps,
  ...backendIndexersDistsysSteps,
  ...backendRpcServicesSteps,
  ...backendDataLayerSteps,
  ...backendProductionSteps,
};

export function getAdvancedSteps(slug: string): LessonStep[] | undefined {
  return advancedSteps[slug];
}
