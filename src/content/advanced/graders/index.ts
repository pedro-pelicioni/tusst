import "server-only";

import type { AdvancedLessonContent } from "./types";
import { rustOwnershipDeepGraders } from "./rust-ownership-deep";
import { rustLifetimesGraders } from "./rust-lifetimes";
import { rustTraitsGenericsGraders } from "./rust-traits-generics";
import { rustErrorHandlingGraders } from "./rust-error-handling";
import { rustCollectionsIteratorsGraders } from "./rust-collections-iterators";
import { rustSmartPointersGraders } from "./rust-smart-pointers";
import { rustConcurrencyGraders } from "./rust-concurrency";
import { rustAsyncInternalsGraders } from "./rust-async-internals";
import { rustSystemsEdgesGraders } from "./rust-systems-edges";
import { backendIndexersDistsysGraders } from "./backend-indexers-distsys";
import { backendRpcServicesGraders } from "./backend-rpc-services";
import { backendDataLayerGraders } from "./backend-data-layer";
import { backendProductionGraders } from "./backend-production";

// SERVER-ONLY. Hidden grading data for the Advanced Path — AST checks,
// expected stdout and reference solutions. `src/content/lessons.ts` falls
// back to this map, so /api/submissions grades advanced lessons through the
// same sandbox path as the campaign with no changes to the route.

export const advancedGraders: Record<string, AdvancedLessonContent> = {
  ...rustOwnershipDeepGraders,
  ...rustLifetimesGraders,
  ...rustTraitsGenericsGraders,
  ...rustErrorHandlingGraders,
  ...rustCollectionsIteratorsGraders,
  ...rustSmartPointersGraders,
  ...rustConcurrencyGraders,
  ...rustAsyncInternalsGraders,
  ...rustSystemsEdgesGraders,
  ...backendIndexersDistsysGraders,
  ...backendRpcServicesGraders,
  ...backendDataLayerGraders,
  ...backendProductionGraders,
};

export function getAdvancedLessonContent(
  slug: string,
): AdvancedLessonContent | undefined {
  return advancedGraders[slug];
}
