import type { LessonStep } from "@/content/steps";
import { rustOwnershipDeepStepsEs } from "./rust-ownership-deep";
import { rustLifetimesStepsEs } from "./rust-lifetimes";
import { rustTraitsGenericsStepsEs } from "./rust-traits-generics";
import { rustErrorHandlingStepsEs } from "./rust-error-handling";
import { rustCollectionsIteratorsStepsEs } from "./rust-collections-iterators";
import { rustSmartPointersStepsEs } from "./rust-smart-pointers";
import { rustConcurrencyStepsEs } from "./rust-concurrency";
import { rustAsyncInternalsStepsEs } from "./rust-async-internals";
import { rustSystemsEdgesStepsEs } from "./rust-systems-edges";
import { backendDataLayerStepsEs } from "./backend-data-layer";
import { backendIndexersDistsysStepsEs } from "./backend-indexers-distsys";
import { backendProductionStepsEs } from "./backend-production";
import { backendRpcServicesStepsEs } from "./backend-rpc-services";

// ES step overlays for the Advanced Path.
//
// PARTIAL BY DESIGN: a lesson with no entry here falls back to English at
// resolution time (see `src/content/advanced/i18n/index.ts`), so a lesson can
// be authored in EN and translated in a later commit without leaving a gap on
// any page. `check:advanced` reports a missing translation and hard-fails on
// one whose structure drifted — a changed answer index, a translated
// `choices` array, an edited ```text``` output block.

export const esAdvancedSteps: Record<string, LessonStep[]> = {
  ...rustOwnershipDeepStepsEs,
  ...rustLifetimesStepsEs,
  ...rustTraitsGenericsStepsEs,
  ...rustErrorHandlingStepsEs,
  ...rustCollectionsIteratorsStepsEs,
  ...rustSmartPointersStepsEs,
  ...rustConcurrencyStepsEs,
  ...rustAsyncInternalsStepsEs,
  ...rustSystemsEdgesStepsEs,
  ...backendDataLayerStepsEs,
  ...backendIndexersDistsysStepsEs,
  ...backendProductionStepsEs,
  ...backendRpcServicesStepsEs,
};
