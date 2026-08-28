import type { LabArtifacts } from "@/content/labs/types";

// Client-side lab progress — same versioned-localStorage approach as the
// Forge IDE store (src/lib/forge-store.ts). Anonymous players keep their run
// (and its on-chain artifacts) here; signing in later re-posts the artifacts
// to /api/labs/complete, where the chain itself is re-verified.

const PREFIX = "tusst:labs:v1";
const runKey = (slug: string) => `${PREFIX}:${slug}`;

export interface LabRun {
  stepsDone: number;
  state: Record<string, string>;
  artifacts: LabArtifacts;
  completedAt?: number;
}

export function emptyRun(): LabRun {
  return { stepsDone: 0, state: {}, artifacts: { txHashes: {} } };
}

export function loadRun(slug: string): LabRun {
  try {
    const raw = window.localStorage.getItem(runKey(slug));
    if (!raw) return emptyRun();
    const parsed = JSON.parse(raw) as Partial<LabRun>;
    return {
      stepsDone: parsed.stepsDone ?? 0,
      state: parsed.state ?? {},
      artifacts: parsed.artifacts ?? { txHashes: {} },
      completedAt: parsed.completedAt,
    };
  } catch {
    return emptyRun();
  }
}

export function saveRun(slug: string, run: LabRun): void {
  try {
    window.localStorage.setItem(runKey(slug), JSON.stringify(run));
  } catch {
    // Quota exceeded / private mode — in-memory state stays authoritative.
  }
}

export function resetRun(slug: string): void {
  try {
    window.localStorage.removeItem(runKey(slug));
  } catch {
    // ignore
  }
}
