import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { TRIAL_LESSON_SLUG } from "@/content/steps";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

// Mimo/Duolingo-style personalized onboarding. Deliberately outside the
// (app) group: no nav, no footer — a full-screen focused flow. Signed-in
// players skip straight to the campaign.
export default async function OnboardingPage() {
  const session = await auth();

  const firstActive = await prisma.track.findFirst({
    where: { status: "active" },
    orderBy: { order: "asc" },
    select: { slug: true },
  });
  const trackHref = firstActive ? `/tracks/${firstActive.slug}` : "/cards";

  if (session?.user) redirect(trackHref);

  const trialLesson = await prisma.lesson.findUnique({
    where: { slug: TRIAL_LESSON_SLUG },
    select: { slug: true, status: true },
  });
  const firstLessonHref =
    trialLesson?.status === "active" ? `/lessons/${trialLesson.slug}` : trackHref;

  return <OnboardingFlow firstLessonHref={firstLessonHref} />;
}
