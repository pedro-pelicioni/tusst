import type { LessonStep } from "@/content/steps";
import { rustOwnershipDeepStepsPt } from "./rust-ownership-deep";
import { rustLifetimesStepsPt } from "./rust-lifetimes";
import { rustTraitsGenericsStepsPt } from "./rust-traits-generics";
import { rustErrorHandlingStepsPt } from "./rust-error-handling";
import { rustCollectionsIteratorsStepsPt } from "./rust-collections-iterators";
import { rustSmartPointersStepsPt } from "./rust-smart-pointers";
import { rustConcurrencyStepsPt } from "./rust-concurrency";
import { rustAsyncInternalsStepsPt } from "./rust-async-internals";
import { rustSystemsEdgesStepsPt } from "./rust-systems-edges";
import { backendDataLayerStepsPt } from "./backend-data-layer";
import { backendIndexersDistsysStepsPt } from "./backend-indexers-distsys";
import { backendProductionStepsPt } from "./backend-production";
import { backendRpcServicesStepsPt } from "./backend-rpc-services";

// PT step overlays for the Advanced Path.
//
// PARTIAL BY DESIGN: a lesson with no entry here falls back to English at
// resolution time (see `src/content/advanced/i18n/index.ts`), so a lesson can
// be authored in EN and translated in a later commit without leaving a gap on
// any page. `check:advanced` reports a missing translation and hard-fails on
// one whose structure drifted — a changed answer index, a translated
// `choices` array, an edited ```text``` output block.

export const ptAdvancedSteps: Record<string, LessonStep[]> = {
  ...rustOwnershipDeepStepsPt,
  ...rustLifetimesStepsPt,
  ...rustTraitsGenericsStepsPt,
  ...rustErrorHandlingStepsPt,
  ...rustCollectionsIteratorsStepsPt,
  ...rustSmartPointersStepsPt,
  ...rustConcurrencyStepsPt,
  ...rustAsyncInternalsStepsPt,
  ...rustSystemsEdgesStepsPt,
  ...backendIndexersDistsysStepsPt,
  ...backendDataLayerStepsPt,
  ...backendProductionStepsPt,
  ...backendRpcServicesStepsPt,
};
