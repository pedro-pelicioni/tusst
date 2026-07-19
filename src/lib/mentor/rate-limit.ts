import "server-only";

// Mentor quota, counted from MentorHint rows (UTC day). DB-backed on
// purpose: the site runs on serverless where in-memory buckets (like the
// Forge one in src/lib/soroban/rate-limit.ts) reset per instance.
//
// Three fences:
//   - per lesson/day: pedagogy — struggle a little before the next hint;
//   - per user/day:   abuse cap;
//   - global/day:     headroom under the provider's own free-tier quota
//                     (GitHub Models mini models: ~150 requests/day).

import { prisma } from "@/lib/db";

export const LESSON_DAILY_LIMIT = 3;
export const USER_DAILY_LIMIT = 10;
export const GLOBAL_DAILY_LIMIT = 120;

export type MentorQuota =
  | { allowed: true; remaining: number }
  | { allowed: false; scope: "lesson" | "user" | "global" };

export async function checkMentorQuota(
  userId: string,
  lessonId: string,
): Promise<MentorQuota> {
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const today = { createdAt: { gte: dayStart } };

  const [lessonCount, userCount, globalCount] = await Promise.all([
    prisma.mentorHint.count({ where: { userId, lessonId, ...today } }),
    prisma.mentorHint.count({ where: { userId, ...today } }),
    prisma.mentorHint.count({ where: today }),
  ]);

  if (globalCount >= GLOBAL_DAILY_LIMIT) return { allowed: false, scope: "global" };
  if (userCount >= USER_DAILY_LIMIT) return { allowed: false, scope: "user" };
  if (lessonCount >= LESSON_DAILY_LIMIT) return { allowed: false, scope: "lesson" };

  return {
    allowed: true,
    remaining: Math.min(
      LESSON_DAILY_LIMIT - lessonCount,
      USER_DAILY_LIMIT - userCount,
    ),
  };
}
