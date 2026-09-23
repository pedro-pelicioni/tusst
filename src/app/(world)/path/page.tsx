import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { acts } from "@/content/campaign";
import { journeyChapters } from "@/content/journey";
import { WORLD_MAP } from "@/content/overworld/world-map";
import { getAdvancedProgress } from "@/lib/advanced-progress";
import { getCampaignProgress } from "@/lib/campaign-progress";
import { buildHeroView } from "@/lib/hero-view";
import { getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { hasV2Asset } from "@/components/scene/SceneArt";
import { HeroHud } from "@/components/overworld/HeroHud";
import { WorldMapView, type WorldDoor } from "@/components/overworld/WorldMapView";
import { TrackView } from "@/components/TrackView";

// The world map — the home every login lands on (/path stays the URL the
// landing and the auth flow hardcode). Two islands and two landmarks; a
// signed-in player without a hero is sent to pick one first.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.overworld.worldMap.metaTitle, description: m.overworld.worldMap.metaDescription };
}

export default async function WorldMapPage() {
  const [session, m] = await Promise.all([auth(), getMessages()]);
  const userId = session?.user?.id;

  const [character, journeyDone, campaign, advanced, labsDone] = await Promise.all([
    userId
      ? prisma.character.findUnique({ where: { userId }, select: { heroId: true, xp: true } })
      : Promise.resolve(null),
    userId ? prisma.journeyProgress.count({ where: { userId, completed: true } }) : Promise.resolve(0),
    getCampaignProgress(userId),
    getAdvancedProgress(userId),
    userId ? prisma.labProgress.count({ where: { userId, completed: true } }) : Promise.resolve(0),
  ]);

  if (userId && character && !character.heroId) redirect("/hero?callbackUrl=%2Fpath");

  const w = m.overworld.worldMap;
  const journeyTotal = journeyChapters.filter((c) => c.meta.status === "live").length;
  const actsCleared = campaign.rows.filter((r) => r.cleared).length;

  const doors: WorldDoor[] = [
    {
      id: "island:journey",
      href: "/journey",
      eyebrow: w.islands.journey.subtitle,
      title: w.islands.journey.title,
      blurb: w.islands.journey.blurb,
      cta: w.islands.journey.cta,
      progress: {
        label: fmt(w.islands.journey.progress, { done: journeyDone, total: journeyTotal }),
        done: journeyDone,
        total: journeyTotal,
      },
      tone: "journey",
    },
    {
      id: "island:campaign",
      href: "/campaign",
      eyebrow: w.islands.campaign.subtitle,
      title: w.islands.campaign.title,
      blurb: w.islands.campaign.blurb,
      cta: w.islands.campaign.cta,
      progress: {
        label: fmt(w.islands.campaign.progress, { done: actsCleared, total: acts.length }),
        done: actsCleared,
        total: acts.length,
      },
      tone: "campaign",
    },
    {
      id: "landmark:forge",
      href: "/labs",
      eyebrow: w.landmarks.forge.subtitle,
      title: w.landmarks.forge.title,
      blurb: w.landmarks.forge.blurb,
      cta: w.landmarks.forge.cta,
      progress: {
        label: fmt(m.home.doors.forge.progress, { done: labsDone }),
        done: labsDone,
        total: Math.max(labsDone, 7),
      },
      tone: "forge",
    },
    {
      id: "landmark:advanced",
      href: "/advanced",
      eyebrow: w.landmarks.advanced.subtitle,
      title: w.landmarks.advanced.title,
      blurb: w.landmarks.advanced.blurb,
      cta: w.landmarks.advanced.cta,
      progress: {
        label: fmt(m.home.doors.advanced.progress, { done: advanced.totalDone, total: advanced.totalLessons }),
        done: advanced.totalDone,
        total: advanced.totalLessons,
      },
      tone: "advanced",
    },
  ];

  const hero = buildHeroView({
    heroId: character?.heroId,
    name: session?.user?.name,
    xp: character?.xp ?? 0,
    signedIn: !!userId,
    m: m.overworld,
  });

  return (
    <>
      <TrackView name="map_open" props={{ world: "world" }} />
      <WorldMapView
        imageSrc={hasV2Asset(WORLD_MAP.image.src) ? WORLD_MAP.image.src : null}
        doors={doors}
        standInLabel={m.overworld.map.standIn}
      >
        <HeroHud hero={hero} changeHref="/hero?callbackUrl=%2Fpath" />
        <div className="ow-hud ow-panel-wood left-1/2 top-3 -translate-x-1/2 px-4 py-2 text-center max-md:hidden">
          <p className="ow-eyebrow text-[#eabc6a]">{w.kicker}</p>
          <p className="mt-0.5 font-pixel text-[14px] text-[#f6e4bc]">{w.title}</p>
        </div>
      </WorldMapView>
    </>
  );
}
