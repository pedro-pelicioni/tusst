import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chaptersByArc, conceptBySlug } from "@/content/journey";
import { labBySlug } from "@/content/labs";
import { acts } from "@/content/campaign";
import { getActLocalized } from "@/content/i18n";
import { getLocale } from "@/i18n/server";
import { getUnlockedActCount } from "@/lib/unlock";
import { XP_CONCEPT } from "@/lib/xp";
import {
  ConceptPlayer,
  type BranchState,
  type LabLinkState,
} from "@/components/journey/ConceptPlayer";
import { SceneRoot } from "@/components/scene/SceneRoot";

// One journey chapter. Concept steps are pure data, so the server enriches
// them here — lab completion for labLink steps, campaign lock state for
// rustBranch steps (a branch into a locked act renders as "unlocks with Act
// N", never a link into a 404) — and hands everything to the client player.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = conceptBySlug(slug);
  if (!concept) return {};
  return {
    title: `${concept.meta.title} — TUSST`,
    description: concept.meta.tagline,
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = conceptBySlug(slug);
  if (!concept || concept.meta.status !== "live") notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const locale = await getLocale();

  // Enrich labLink steps with live/completed state.
  const labSlugs = concept.steps.flatMap((s) =>
    s.kind === "labLink" ? [s.labSlug] : [],
  );
  const labDone = new Set(
    userId && labSlugs.length > 0
      ? (
          await prisma.labProgress.findMany({
            where: { userId, completed: true, labSlug: { in: labSlugs } },
            select: { labSlug: true },
          })
        ).map((r) => r.labSlug)
      : [],
  );
  const labState: Record<string, LabLinkState> = {};
  for (const labSlug of labSlugs) {
    const lab = labBySlug(labSlug);
    if (!lab) continue;
    labState[labSlug] = {
      live: lab.meta.status === "live",
      completed: labDone.has(labSlug),
      title: lab.meta.title,
      tagline: lab.meta.tagline,
    };
  }

  // Enrich rustBranch steps with the campaign gate (same rule as the lesson
  // page: track active OR act index below the unlocked count).
  const branchSlugs = concept.steps.flatMap((s) =>
    s.kind === "rustBranch" ? [s.lessonSlug] : [],
  );
  const branchState: Record<string, BranchState> = {};
  if (branchSlugs.length > 0) {
    const [lessons, unlockedCount] = await Promise.all([
      prisma.lesson.findMany({
        where: { slug: { in: branchSlugs } },
        select: { slug: true, track: { select: { slug: true, status: true } } },
      }),
      getUnlockedActCount(userId),
    ]);
    for (const lesson of lessons) {
      const actIndex = acts.findIndex((a) => a.trackSlug === lesson.track.slug);
      const act = actIndex >= 0 ? acts[actIndex] : null;
      const localized = act ? getActLocalized(act.trackSlug, locale) ?? act : null;
      const unlocked =
        lesson.track.status === "active" ||
        (actIndex >= 0 && actIndex < unlockedCount);
      branchState[lesson.slug] = {
        locked: !unlocked,
        actNumeral: act?.numeral ?? "?",
        actTitle: localized?.title ?? lesson.track.slug,
      };
    }
  }

  // Next live chapter within the same arc (for the done screen).
  const liveSlugs = chaptersByArc(concept.meta.arc)
    .filter((c) => c.meta.status === "live")
    .map((c) => c.meta.slug);
  const nextSlug = liveSlugs[liveSlugs.indexOf(slug) + 1] ?? null;

  return (
    <SceneRoot id="concept-player">
      <section
        data-scene
        className="sc-scene sc-scene--journey min-h-[calc(100dvh-56px)]"
      >
        <div className="relative">
          <ConceptPlayer
            conceptSlug={slug}
            title={concept.meta.title}
            numeral={concept.meta.numeral}
            steps={concept.steps}
            xp={XP_CONCEPT}
            signedIn={!!userId}
            nextHref={nextSlug ? `/journey/${nextSlug}` : null}
            labState={labState}
            branchState={branchState}
          />
        </div>
      </section>
    </SceneRoot>
  );
}
