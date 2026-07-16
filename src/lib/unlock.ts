import { getCampaignProgress } from "@/lib/campaign-progress";
import { getUnlockedActs } from "@/lib/onboarding";

// Single source of truth for campaign gating: an act is open if the player's
// onboarding answer unlocked it, if every act before it is fully cleared, or
// if the player already earned it before (the ratchet in getCampaignProgress
// — adding lessons later to an already-cleared act must never re-lock acts
// after it; see memory `tusst-seed-safety`).
export async function getUnlockedActCount(
  userId?: string | null,
): Promise<number> {
  const onboarding = await getUnlockedActs();
  if (!userId) return onboarding;

  const { unlockedActCount } = await getCampaignProgress(userId);
  return Math.max(onboarding, unlockedActCount);
}
