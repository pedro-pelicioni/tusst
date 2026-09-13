import type { LessonStep } from "@/content/steps";
import { rustOwnershipDeepStepsFr } from "./rust-ownership-deep";
import { rustLifetimesStepsFr } from "./rust-lifetimes";
import { rustTraitsGenericsStepsFr } from "./rust-traits-generics";
import { rustErrorHandlingStepsFr } from "./rust-error-handling";
import { rustCollectionsIteratorsStepsFr } from "./rust-collections-iterators";
import { rustSmartPointersStepsFr } from "./rust-smart-pointers";
import { rustConcurrencyStepsFr } from "./rust-concurrency";
import { rustAsyncInternalsStepsFr } from "./rust-async-internals";
import { rustSystemsEdgesStepsFr } from "./rust-systems-edges";
import { backendDataLayerStepsFr } from "./backend-data-layer";
import { backendIndexersDistsysStepsFr } from "./backend-indexers-distsys";
import { backendProductionStepsFr } from "./backend-production";
import { backendRpcServicesStepsFr } from "./backend-rpc-services";

// FR step overlays for the Advanced Path.
//
// PARTIAL BY DESIGN: a lesson with no entry here falls back to English at
// resolution time (see `src/content/advanced/i18n/index.ts`), so a lesson can
// be authored in EN and translated in a later commit without leaving a gap on
// any page. `check:advanced` reports a missing translation and hard-fails on
// one whose structure drifted — a changed answer index, a translated
// `choices` array, an edited ```text``` output block.

export const frAdvancedSteps: Record<string, LessonStep[]> = {
  ...rustOwnershipDeepStepsFr,
  ...rustLifetimesStepsFr,
  ...rustTraitsGenericsStepsFr,
  ...rustErrorHandlingStepsFr,
  ...rustCollectionsIteratorsStepsFr,
  ...rustSmartPointersStepsFr,
  ...rustConcurrencyStepsFr,
  ...rustAsyncInternalsStepsFr,
  ...rustSystemsEdgesStepsFr,
  ...backendDataLayerStepsFr,
  ...backendIndexersDistsysStepsFr,
  ...backendProductionStepsFr,
  ...backendRpcServicesStepsFr,
};
