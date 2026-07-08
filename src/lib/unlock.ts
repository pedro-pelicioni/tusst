import { acts } from "@/content/campaign";
import { getCampaignProgress } from "@/lib/campaign-progress";
import { getUnlockedActs } from "@/lib/onboarding";

// Single source of truth for campaign gating: an act is open if the player's
// onboarding answer unlocked it, or if every act before it is fully cleared.
// Clearing acts is the only road to Act VII (the Beholder's Lair).
export async function getUnlockedActCount(
  userId?: string | null,
): Promise<number> {
  const onboarding = await getUnlockedActs();
  if (!userId) return onboarding;

  const { clearedStreak } = await getCampaignProgress(userId);
  return Math.max(onboarding, Math.min(clearedStreak + 1, acts.length));
}
