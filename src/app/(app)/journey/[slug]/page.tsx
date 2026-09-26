import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chaptersByArc, journeyChapters } from "@/content/journey";
import { getConceptLocalized } from "@/content/journey/i18n";
import { labBySlug } from "@/content/labs";
import { LAB_TEXT } from "@/content/labs/i18n";
import {
  localizeLab,
  type LabTextOverlay,
} from "@/content/labs/localize";
import { acts } from "@/content/campaign";
import { getActLocalized } from "@/content/i18n";
import { getLocale, getMessages } from "@/i18n/server";
import { getUnlockedActCount } from "@/lib/unlock";
import { XP_CONCEPT } from "@/lib/xp";
import {
  ConceptPlayer,
  type BranchState,
  type LabLinkState,
} from "@/components/journey/ConceptPlayer";
import { hasV2Asset } from "@/components/scene/SceneArt";
import type { BattleSkin } from "@/components/overworld/BattleFrame";
import { JOURNEY_POSITIONS, JOURNEY_WORLD } from "@/content/overworld/journey-world";
import { buildHeroView } from "@/lib/hero-view";

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
  const locale = await getLocale();
  const concept = getConceptLocalized(slug, locale);
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
  const locale = await getLocale();
  const concept = getConceptLocalized(slug, locale);
  if (!concept || concept.meta.status !== "live") notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const m = await getMessages();
  // The hero for the battle frame — signed-out visitors fight as the default
  // hero at form 0, exactly as the island shows them.
  const character = userId
    ? await prisma.character.findUnique({
        where: { userId },
        select: { heroId: true, xp: true },
      })
    : null;

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
    const baseLab = labBySlug(labSlug);
    if (!baseLab) continue;
    const lab = localizeLab(
      baseLab,
      locale === "en"
        ? undefined
        : (LAB_TEXT[locale] as Record<string, LabTextOverlay | undefined>)[
            labSlug
          ],
    );
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

  // Next live chapter for the done screen: within the same arc, except on the
  // ground floor — level 0 exists to hand the reader over, so its trail runs
  // straight into the Craft road instead of dead-ending on its last chapter.
  const trail =
    concept.meta.arc === "foundations"
      ? [...chaptersByArc("foundations"), ...chaptersByArc("craft")]
      : chaptersByArc(concept.meta.arc);
  const liveSlugs = trail
    .filter((c) => c.meta.status === "live")
    .map((c) => c.meta.slug);
  const nextSlug = liveSlugs[liveSlugs.indexOf(slug) + 1] ?? null;

  // The battle skin: this chapter's region boss (level grows with the
  // mission number), the island cropped around the chapter's node, and the
  // two ways back — both land the hero ON this node; `go=` makes the island
  // walk to the next chapter. Presentation only; XP and grading live in the
  // player and the API exactly as before.
  const chapterIndex = Math.max(
    0,
    journeyChapters.findIndex((c) => c.meta.slug === slug),
  );
  const bossArt = `/v2/overworld/bosses/${concept.meta.arc}.webp`;
  const battle: BattleSkin = {
    hero: buildHeroView({
      heroId: character?.heroId,
      name: session?.user?.name,
      xp: character?.xp ?? 0,
      signedIn: !!userId,
      m: m.overworld,
    }),
    boss: {
      name: m.overworld.bosses[concept.meta.arc],
      level: 4 + chapterIndex * 3,
      art: hasV2Asset(bossArt) ? bossArt : null,
    },
    arena: {
      src: hasV2Asset(JOURNEY_WORLD.image.src) ? JOURNEY_WORLD.image.src : null,
      pos: JOURNEY_POSITIONS[slug] ?? [50, 50],
    },
    missionNumber: String(chapterIndex + 1).padStart(2, "0"),
    backHref: `/journey?at=${slug}`,
    nextHref: nextSlug ? `/journey?at=${slug}&go=${nextSlug}` : null,
    nextTitle: nextSlug ? getConceptLocalized(nextSlug, locale)?.meta.title ?? null : null,
  };

  return (
    <ConceptPlayer
      conceptSlug={slug}
      title={concept.meta.title}
      numeral={concept.meta.numeral}
      sigilSrc={hasV2Asset(concept.meta.sigil) ? concept.meta.sigil : null}
      steps={concept.steps}
      xp={XP_CONCEPT}
      signedIn={!!userId}
      nextHref={nextSlug ? `/journey/${nextSlug}` : null}
      labState={labState}
      branchState={branchState}
      battle={battle}
    />
  );
}
