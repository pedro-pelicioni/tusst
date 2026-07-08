import { cookies } from "next/headers";

// Server-side reader for the onboarding answers mirrored into a cookie by
// <OnboardingFlow />. Gates the campaign path and track pages.

export const ONBOARDING_COOKIE = "tusst_onboarding";

// Act VII (Soroban finale) is never unlocked from onboarding — it must be
// earned by completing the campaign.
const MAX_ONBOARDING_UNLOCK = 6;

export async function getUnlockedActs(): Promise<number> {
  try {
    const raw = (await cookies()).get(ONBOARDING_COOKIE)?.value;
    if (!raw) return 1;
    const n = Number(JSON.parse(decodeURIComponent(raw))?.unlockedActs);
    if (!Number.isFinite(n)) return 1;
    return Math.min(Math.max(Math.trunc(n), 1), MAX_ONBOARDING_UNLOCK);
  } catch {
    return 1;
  }
}
