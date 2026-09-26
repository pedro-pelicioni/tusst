import "@/components/landing/landing.css";

import { auth } from "@/lib/auth";
import { HEROES } from "@/content/heroes";
import { getConceptLocalized } from "@/content/journey/i18n";
import { getLocale, getMessages } from "@/i18n/server";
import { ChampionCarousel } from "@/components/landing/ChampionCarousel";
import { FeatureScene } from "@/components/landing/FeatureScene";
import { FinalCta } from "@/components/landing/FinalCta";
import { HeroScene } from "@/components/landing/HeroScene";
import { JsGate } from "@/components/landing/JsGate";
import { LandingNav } from "@/components/landing/LandingNav";
import { MapScene } from "@/components/landing/MapScene";
import { MotionOrchestrator } from "@/components/landing/MotionOrchestrator";
import { hasLandingAsset } from "@/components/landing/SceneLayers";
import { WhyScene } from "@/components/landing/WhyScene";

// Landing page — cinematic illustrated scenes over the Shattered Sky
// lore. The server resolves the session-dependent CTA targets and
// renders every scene's content as HTML; only the nav, the champion
// carousel and the motion orchestrator ship client JS.
export default async function Home() {
  const [session, messages, locale] = await Promise.all([auth(), getMessages(), getLocale()]);
  const m = messages.landing;

  // New visitors sign in first (GitHub / Discord), then pick a hero, then
  // reach the world map; returning players go straight to the world map.
  const beginHref = session?.user ? "/path" : "/login";
  const enterHref = session?.user ? "/path" : "/login";

  // The trial's answers link to the Journey chapter that teaches each one —
  // only while that chapter is live (a draft chapter would 404).
  const chapterTitles: Record<string, string> = {};
  for (const { chapterSlug } of m.why.questions) {
    const concept = getConceptLocalized(chapterSlug, locale);
    if (concept?.meta.status === "live") chapterTitles[chapterSlug] = concept.meta.title;
  }

  // heroes whose pixel form sheet has landed (the roster shows their 8 forms)
  const heroSheets = HEROES.filter((h) => hasLandingAsset(h.sheet)).map((h) => h.id);

  return (
    <div id="landing" suppressHydrationWarning className="overflow-x-clip bg-[#050409] text-fg">
      <JsGate />
      <LandingNav enterHref={enterHref} />
      <HeroScene m={m} beginHref={beginHref} signedIn={!!session?.user} />
      <main>
        <WhyScene m={m} beginHref={beginHref} chapterTitles={chapterTitles} />
        {/* /hero sends a signed-out visitor through /login and back on its own */}
        <ChampionCarousel ctaHref="/hero" sheets={heroSheets} />
        <MapScene m={m} world={messages.overworld.worldMap} beginHref={beginHref} />
        <FeatureScene
          id="forge"
          art="/landing/features/forge.webp"
          copy={m.features.forge}
          accentClass="text-accent2"
          particles="forge"
          cta={{ href: "/ide", label: m.features.forge.cta, badge: m.features.forge.ctaBadge }}
          card={{
            src: "/landing/features/forge-card.webp",
            alt: "TUSST Forge IDE",
            width: 1280,
            height: 800,
            glowClass: "bg-[radial-gradient(closest-side,rgba(69,214,196,0.25),transparent)]",
          }}
        />
      </main>
      <FinalCta m={m} beginHref={beginHref} />
      <MotionOrchestrator />
    </div>
  );
}
