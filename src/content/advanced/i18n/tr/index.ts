import type { LessonStep } from "@/content/steps";
import { rustOwnershipDeepStepsTr } from "./rust-ownership-deep";
import { rustLifetimesStepsTr } from "./rust-lifetimes";
import { rustTraitsGenericsStepsTr } from "./rust-traits-generics";
import { rustErrorHandlingStepsTr } from "./rust-error-handling";
import { rustCollectionsIteratorsStepsTr } from "./rust-collections-iterators";
import { rustSmartPointersStepsTr } from "./rust-smart-pointers";
import { rustConcurrencyStepsTr } from "./rust-concurrency";
import { rustAsyncInternalsStepsTr } from "./rust-async-internals";
import { rustSystemsEdgesStepsTr } from "./rust-systems-edges";
import { backendDataLayerStepsTr } from "./backend-data-layer";
import { backendIndexersDistsysStepsTr } from "./backend-indexers-distsys";
import { backendProductionStepsTr } from "./backend-production";
import { backendRpcServicesStepsTr } from "./backend-rpc-services";

// FR step overlays for the Advanced Path.
//
// PARTIAL BY DESIGN: a lesson with no entry here falls back to English at
// resolution time (see `src/content/advanced/i18n/index.ts`), so a lesson can
// be authored in EN and translated in a later commit without leaving a gap on
// any page. `check:advanced` reports a missing translation and hard-fails on
// one whose structure drifted — a changed answer index, a translated
// `choices` array, an edited ```text``` output block.

export const trAdvancedSteps: Record<string, LessonStep[]> = {
  ...rustOwnershipDeepStepsTr,
  ...rustLifetimesStepsTr,
  ...rustTraitsGenericsStepsTr,
  ...rustErrorHandlingStepsTr,
  ...rustCollectionsIteratorsStepsTr,
  ...rustSmartPointersStepsTr,
  ...rustConcurrencyStepsTr,
  ...rustAsyncInternalsStepsTr,
  ...rustSystemsEdgesStepsTr,
  ...backendDataLayerStepsTr,
  ...backendIndexersDistsysStepsTr,
  ...backendProductionStepsTr,
  ...backendRpcServicesStepsTr,
};
