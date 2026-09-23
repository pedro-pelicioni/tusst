import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUnlockedActs } from "@/lib/onboarding";
import { getCampaignProgress } from "@/lib/campaign-progress";
import { acts } from "@/content/campaign";
import { getActLocalized, getCardLocalized, getSkirmishLocalized } from "@/content/i18n";
import { CAMPAIGN_WORLD, fortressId } from "@/content/overworld/campaign-world";
import type { NodeState } from "@/content/overworld/types";
import { getLocale, getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { XP_LESSON } from "@/lib/xp";
import { buildHeroView } from "@/lib/hero-view";
import { hasV2Asset } from "@/components/scene/SceneArt";
import { OverworldStage } from "@/components/overworld/OverworldStage";
import { TrackView } from "@/components/TrackView";

// The Rusted Isle — the Rust campaign as an island. The unlock math is the
// rail's, byte for byte: an act is open by the legacy onboarding cookie or by
// the ratcheted unlockedActCount (src/lib/campaign-progress.ts); everything
// past it is fogged. Waypoints are the skirmishes, fortresses open the act.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: `${m.pages.campaign.title} — TUSST` };
}

export default async function CampaignIslandPage({
  searchParams,
}: {
  searchParams: Promise<{ at?: string; go?: string; edit?: string }>;
}) {
  const [sp, session, m, locale] = await Promise.all([searchParams, auth(), getMessages(), getLocale()]);
  const userId = session?.user?.id;

  const [{ rows, unlockedActCount }, unlockedByOnboarding, character] = await Promise.all([
    getCampaignProgress(userId),
    getUnlockedActs(),
    userId
      ? prisma.character.findUnique({ where: { userId }, select: { heroId: true, xp: true } })
      : Promise.resolve(null),
  ]);
  // First visit after sign-in: pick a hero before walking anywhere.
  if (userId && character && !character.heroId) redirect("/hero?callbackUrl=%2Fcampaign");
  const unlockedCount = Math.max(unlockedByOnboarding, unlockedActCount);

  const done = new Set<string>();
  const playable = new Set<string>();
  for (const row of rows) for (const l of row.playable) playable.add(l.slug);
  if (userId) {
    const doneRows = await prisma.progress.findMany({
      where: { userId, completed: true },
      select: { lesson: { select: { slug: true } } },
    });
    for (const r of doneRows) done.add(r.lesson.slug);
  }

  // CTA rule from the rail: first unlocked act with an incomplete skirmish.
  const current = rows.find((r, i) => i < unlockedCount && r.nextLessonSlug !== null);
  const recommendedSlug = current?.nextLessonSlug ?? null;

  const b = m.overworld.bosses;
  const nodes: NodeState[] = [];
  rows.forEach(({ act: rawAct, cleared }, i) => {
    const act = getActLocalized(rawAct.trackSlug, locale) ?? rawAct;
    const unlocked = i < unlockedCount;
    const lockedNote = fmt(m.overworld.quest.lockedNote, { numeral: acts[Math.max(0, i - 1)].numeral });
    const bossName =
      rawAct.overlord ??
      b.acts[rawAct.trackSlug as keyof typeof b.acts] ??
      fmt(b.sentinel, { numeral: rawAct.numeral });
    const bossArt = `/v2/overworld/bosses/${rawAct.trackSlug}.webp`;

    rawAct.skirmishes.forEach((raw, j) => {
      const s = getSkirmishLocalized(raw.lessonSlug, locale) ?? raw;
      const live = unlocked && playable.has(raw.lessonSlug);
      const isDone = done.has(raw.lessonSlug);
      nodes.push({
        id: raw.lessonSlug,
        kind: "waypoint",
        href: live ? `/lessons/${raw.lessonSlug}` : null,
        title: s.title,
        subtitle: s.intro,
        number: `${i + 1}.${j + 1}`,
        numeral: raw.numeral,
        status: isDone ? "done" : !unlocked ? "locked" : live ? "live" : "soon",
        recommended: raw.lessonSlug === recommendedSlug,
        xp: XP_LESSON,
        lockedNote,
        region: rawAct.trackSlug,
        group: `${rawAct.numeral} · ${act.title}`,
      });
    });

    nodes.push({
      id: fortressId(rawAct.trackSlug),
      kind: "fortress",
      href: unlocked ? `/tracks/${rawAct.trackSlug}` : null,
      title: act.title,
      subtitle: `${act.territory}${act.synopsis ? ` — ${act.synopsis}` : ""}`,
      number: rawAct.numeral,
      numeral: rawAct.numeral,
      status: cleared ? "done" : unlocked ? "live" : "locked",
      recommended: false,
      // A fortress credits nothing on its own: the act's XP is paid lesson by
      // lesson (`XpSource` has no "act"), so advertising a lump sum here was
      // a promise no route keeps. The act's real prize is its champion card.
      xp: 0,
      rewardLabel: rawAct.cardId
        ? getCardLocalized(rawAct.cardId, locale)?.name
        : undefined,
      bossArt: hasV2Asset(bossArt) ? bossArt : null,
      bossName,
      bossLevel: 4 + i * 6,
      lockedNote,
      region: rawAct.trackSlug,
      group: `${rawAct.numeral} · ${act.title}`,
    });
  });

  const groups = rows.map(({ act: rawAct }) => {
    const act = getActLocalized(rawAct.trackSlug, locale) ?? rawAct;
    return {
      id: rawAct.trackSlug,
      label: `${rawAct.numeral} · ${act.title}`,
      nodes: nodes.filter((n) => n.region === rawAct.trackSlug && n.kind === "waypoint"),
    };
  });

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
      <TrackView name="map_open" props={{ world: "campaign" }} />
      <OverworldStage
        world={CAMPAIGN_WORLD}
        imageSrc={hasV2Asset(CAMPAIGN_WORLD.image.src) ? CAMPAIGN_WORLD.image.src : null}
        nodes={nodes}
        groups={groups}
        hero={hero}
        userKey={userId ?? "guest"}
        arriveAt={sp.at ?? null}
        go={sp.go ?? null}
        editable={editable}
        regionLabels={m.overworld.regions}
        changeHeroHref="/hero?callbackUrl=%2Fcampaign"
      />
    </>
  );
}
