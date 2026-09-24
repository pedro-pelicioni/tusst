import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAdvancedProgress } from "@/lib/advanced-progress";
import { localizeAdvancedLesson, localizeAdvancedTrack } from "@/content/advanced/i18n";
import {
  HARBOR_DISTRICT,
  HARBOR_DISTRICTS,
  HARBOR_STREETS,
  HARBOR_WORLD,
  dockId,
} from "@/content/overworld/harbor-world";
import type { NodeState } from "@/content/overworld/types";
import { getLocale, getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { XP_LESSON } from "@/lib/xp";
import { buildHeroView } from "@/lib/hero-view";
import { hasV2Asset } from "@/components/scene/SceneArt";
import { OverworldStage } from "@/components/overworld/OverworldStage";
import { TrackView } from "@/components/TrackView";

// The Harbor — the Advanced Path as a port town. Every lesson is a waypoint on
// its track's street and every track a dock at the street's end; nothing is
// ever locked (the path has no gates). The map is only the way in: lessons
// keep the plain player, and a dock opens the track's syllabus page.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.overworld.harbor.metaTitle, description: m.overworld.harbor.metaDescription };
}

export default async function HarborPage({
  searchParams,
}: {
  searchParams: Promise<{ at?: string; go?: string; edit?: string }>;
}) {
  const [sp, session, m, locale] = await Promise.all([searchParams, auth(), getMessages(), getLocale()]);
  const userId = session?.user?.id;

  const [{ rows }, character] = await Promise.all([
    getAdvancedProgress(userId),
    userId
      ? prisma.character.findUnique({ where: { userId }, select: { heroId: true, xp: true } })
      : Promise.resolve(null),
  ]);
  // First visit after sign-in: pick a hero before walking anywhere.
  if (userId && character && !character.heroId) redirect("/hero?callbackUrl=%2Fharbor");

  const mapped = rows.filter((r) => HARBOR_STREETS[r.track.slug]);
  // The reader picks their own gap, so the guide follows them: the next
  // lesson of the first track they've started and not finished, else the
  // first lesson not yet done.
  const current =
    mapped.find((r) => r.doneCount > 0 && r.nextLessonSlug) ?? mapped.find((r) => r.nextLessonSlug);
  const recommendedSlug = current?.nextLessonSlug ?? null;

  const nodes: NodeState[] = [];
  mapped.forEach(({ track: raw, lessons, doneCount, total }, i) => {
    const track = localizeAdvancedTrack(raw, locale);
    const number = String(i + 1).padStart(2, "0");
    const district = HARBOR_DISTRICT[raw.slug];
    const group = `${number} · ${track.title}`;

    lessons.forEach((lesson, j) => {
      const text = localizeAdvancedLesson(lesson.slug, lesson, locale);
      nodes.push({
        id: lesson.slug,
        kind: "waypoint",
        href: `/lessons/${lesson.slug}`,
        title: text.title,
        subtitle: text.summary,
        number: `${i + 1}.${j + 1}`,
        status: lesson.done ? "done" : "live",
        recommended: lesson.slug === recommendedSlug,
        xp: XP_LESSON,
        region: district,
        group,
      });
    });

    nodes.push({
      id: dockId(raw.slug),
      kind: "dock",
      href: `/advanced/${raw.slug}`,
      title: track.title,
      subtitle: track.description,
      number,
      status: total > 0 && doneCount === total ? "done" : "live",
      recommended: false,
      // A dock pays nothing itself (XP is credited lesson by lesson); its row
      // in the quest panel is the track's progress instead.
      xp: 0,
      rewardLabel: fmt(m.overworld.harbor.dockProgress, { done: doneCount, total }),
      region: district,
      group,
    });
  });

  // 87 lesson badges would not fit the strip: the harbor shows one per dock.
  const groups = HARBOR_DISTRICTS.map((district) => ({
    id: district,
    label: m.overworld.regions[district],
    nodes: nodes.filter((n) => n.region === district && n.kind === "dock"),
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
      <TrackView name="map_open" props={{ world: "harbor" }} />
      <OverworldStage
        world={HARBOR_WORLD}
        imageSrc={hasV2Asset(HARBOR_WORLD.image.src) ? HARBOR_WORLD.image.src : null}
        nodes={nodes}
        groups={groups}
        hero={hero}
        userKey={userId ?? "guest"}
        arriveAt={sp.at ?? null}
        go={sp.go ?? null}
        editable={editable}
        regionLabels={m.overworld.regions}
        changeHeroHref="/hero?callbackUrl=%2Fharbor"
      />
      {/* The syllabus stays one click away for the reader who'd rather scan a list. */}
      <Link
        href="/advanced"
        title={m.overworld.harbor.listViewTitle}
        className="ow-hud ow-btn-dark right-3 top-3 text-[11px] max-md:left-2 max-md:right-auto max-md:top-auto max-md:bottom-[100px]"
      >
        {m.overworld.harbor.listView}
      </Link>
    </>
  );
}
