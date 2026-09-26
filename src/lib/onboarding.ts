import { cookies } from "next/headers";

// Server-side reader for the legacy `tusst_onboarding` cookie. The
// onboarding questionnaire that wrote it was removed on 2026-09-20 (new
// visitors now sign in, pick a hero and land on the world map); the cookie
// is read for backward compatibility only, so players who answered it keep
// the acts it unlocked. New users get the floor of 1. Gates the campaign
// path and track pages alongside the ratcheted campaign progress.

export const ONBOARDING_COOKIE = "tusst_onboarding";

// Acts VII and VIII (Soroban + Protocol 27 finales) are never unlocked from
// onboarding — they must be earned by completing the campaign.
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
