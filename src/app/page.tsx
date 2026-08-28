import "@/components/landing/landing.css";

import { auth } from "@/lib/auth";
import { getMessages } from "@/i18n/server";
import { ChampionCarousel } from "@/components/landing/ChampionCarousel";
import { FeatureScene } from "@/components/landing/FeatureScene";
import { FinalCta } from "@/components/landing/FinalCta";
import { HeroScene } from "@/components/landing/HeroScene";
import { IntroScene } from "@/components/landing/IntroScene";
import { JsGate } from "@/components/landing/JsGate";
import { LandingNav } from "@/components/landing/LandingNav";
import { MotionOrchestrator } from "@/components/landing/MotionOrchestrator";

// Landing page — cinematic illustrated scenes over the Shattered Sky
// lore. The server resolves the session-dependent CTA targets and
// renders every scene's content as HTML; only the nav, the champion
// carousel and the motion orchestrator ship client JS.
export default async function Home() {
  const [session, messages] = await Promise.all([auth(), getMessages()]);
  const m = messages.landing;

  // New visitors get the Mimo-style personalized onboarding before their
  // first skirmish; returning players go straight to the campaign path.
  const beginHref = session?.user ? "/path" : "/onboarding";
  const enterHref = session?.user ? "/path" : "/login";

  return (
    <div id="landing" suppressHydrationWarning className="overflow-x-clip bg-[#050409] text-fg">
      <JsGate />
      <LandingNav enterHref={enterHref} />
      <HeroScene m={m} beginHref={beginHref} />
      <main>
        <IntroScene m={m} />
        <ChampionCarousel />
        <FeatureScene
          id="campaign"
          art="/landing/features/campaign.webp"
          copy={m.features.campaign}
          accentClass="text-gold"
          cta={{ href: beginHref, label: m.features.campaign.cta }}
        />
        <FeatureScene
          id="boss"
          art="/landing/features/boss.webp"
          copy={m.features.boss}
          accentClass="text-ember"
          particles="boss"
          note={m.features.boss.note}
          card={{
            src: "/cards/stroopbeholder.png",
            alt: "STROOPBEHOLDER",
            width: 848,
            height: 1264,
            glowClass: "bg-[radial-gradient(closest-side,rgba(161,61,61,0.35),transparent)]",
          }}
        />
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
