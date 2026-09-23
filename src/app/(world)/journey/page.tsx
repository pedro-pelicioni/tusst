import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { JOURNEY_ARCS } from "@/content/journey";
import { getJourneyChaptersLocalized } from "@/content/journey/i18n";
import { chapterIsTestable } from "@/content/journey/test-out";
import { JOURNEY_WORLD } from "@/content/overworld/journey-world";
import type { NodeState } from "@/content/overworld/types";
import { getLocale, getMessages } from "@/i18n/server";
import { XP_CONCEPT, XP_CONCEPT_EXERCISE } from "@/lib/xp";
import { buildHeroView } from "@/lib/hero-view";
import { hasV2Asset } from "@/components/scene/SceneArt";
import { OverworldStage } from "@/components/overworld/OverworldStage";
import { TrackView } from "@/components/TrackView";

// The Isle of the Builder — the Journey as an island. Every live chapter is a
// mission node the hero can walk to (free-roam is unchanged: nothing here is
// ever locked, `requires` only shapes the roads). The server resolves the
// per-node state (done / recommended / art / test-out) and the player's hero,
// and the client stage does the walking.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.journey.metaTitle, description: m.journey.metaDescription };
}

export default async function JourneyIslandPage({
  searchParams,
}: {
  searchParams: Promise<{ at?: string; go?: string; edit?: string }>;
}) {
  const [sp, session, m, locale] = await Promise.all([searchParams, auth(), getMessages(), getLocale()]);
  const userId = session?.user?.id;

  const [completedRows, character] = await Promise.all([
    userId
      ? prisma.journeyProgress.findMany({
          where: { userId, completed: true },
          select: { conceptSlug: true },
        })
      : Promise.resolve([]),
    userId
      ? prisma.character.findUnique({ where: { userId }, select: { heroId: true, xp: true } })
      : Promise.resolve(null),
  ]);
  // First visit after sign-in: pick a hero before walking anywhere.
  if (userId && character && !character.heroId) redirect("/hero?callbackUrl=%2Fjourney");
  const completed = new Set(completedRows.map((r) => r.conceptSlug));

  const chapters = getJourneyChaptersLocalized(locale);
  // Same rule the rail used: the first live chapter not yet cleared, in
  // registry order (foundations → craft → realm).
  const recommendedSlug =
    chapters.find((c) => c.meta.status === "live" && !completed.has(c.meta.slug))?.meta.slug ?? null;

  const nodes: NodeState[] = chapters.map((c, i) => {
    const { meta } = c;
    const live = meta.status === "live";
    const done = completed.has(meta.slug);
    const hasExercise = c.steps.some((s) => s.kind === "exercise");
    return {
      id: meta.slug,
      kind: "mission",
      href: live ? `/journey/${meta.slug}` : null,
      title: meta.title,
      subtitle: meta.tagline,
      number: String(i + 1).padStart(2, "0"),
      numeral: meta.numeral,
      level: meta.level,
      status: done ? "done" : live ? "live" : "soon",
      recommended: meta.slug === recommendedSlug,
      xp: XP_CONCEPT + (hasExercise ? XP_CONCEPT_EXERCISE : 0),
      minutes: meta.estMinutes,
      sigil: hasV2Asset(meta.sigil) ? meta.sigil : null,
      testOutHref:
        live && !done && chapterIsTestable(c) ? `/journey/test-out/chapter/${meta.slug}` : null,
      region: meta.arc,
      group: m.overworld.regions[meta.arc],
    };
  });

  const groups = JOURNEY_ARCS.map((arc) => ({
    id: arc,
    label: m.overworld.regions[arc],
    nodes: nodes.filter((n) => n.region === arc),
  }));

  const hero = buildHeroView({
    heroId: character?.heroId,
    name: session?.user?.name,
    xp: character?.xp ?? 0,
    signedIn: !!userId,
    m: m.overworld,
  });

  const editable = process.env.NODE_ENV !== "production" && sp.edit === "1";

  return (
    <>
      <TrackView name="map_open" props={{ world: "journey" }} />
      <OverworldStage
        world={JOURNEY_WORLD}
        imageSrc={hasV2Asset(JOURNEY_WORLD.image.src) ? JOURNEY_WORLD.image.src : null}
        nodes={nodes}
        groups={groups}
        hero={hero}
        userKey={userId ?? "guest"}
        arriveAt={sp.at ?? null}
        go={sp.go ?? null}
        editable={editable}
        regionLabels={m.overworld.regions}
        changeHeroHref="/hero?callbackUrl=%2Fjourney"
      />
    </>
  );
}
