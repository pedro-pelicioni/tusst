import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCampaignProgress } from "@/lib/campaign-progress";
import { acts } from "@/content/campaign";
import { JOURNEY_LIVE } from "@/content/journey";
import { getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { progressToNext } from "@/lib/xp";
import { SceneRoot } from "@/components/scene/SceneRoot";
import { SceneArt, hasV2Asset } from "@/components/scene/SceneArt";
import { SceneParticles } from "@/components/scene/SceneParticles";

// The Hall — the home every login funnels into (/path is hardcoded by the
// landing, so the URL stays; the campaign rail this page used to hold now
// lives at /campaign). Two roads — the Journey (essential) and the Campaign
// (optional) — plus the Forge, which is not a road: it's where you practice.
// The Journey door follows the registry's JOURNEY_LIVE flag.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.home.metaTitle, description: m.home.metaDescription };
}

function DoorArt({
  src,
  glyph,
  tone,
}: {
  src: string;
  glyph: string;
  tone: "journey" | "campaign";
}) {
  if (hasV2Asset(src)) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image src={src} alt="" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`grid aspect-[4/3] place-items-center rounded-xl border border-line ${
        tone === "journey"
          ? "bg-[radial-gradient(80%_80%_at_50%_30%,rgba(143,123,255,0.16),transparent_70%)]"
          : "bg-[radial-gradient(80%_80%_at_50%_30%,rgba(217,185,106,0.13),transparent_70%)]"
      }`}
    >
      <span className="text-6xl opacity-80" aria-hidden>
        {glyph}
      </span>
    </div>
  );
}

export default async function HallPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const m = await getMessages();

  const [{ rows, cardsClaimed }, character, labsDone] = await Promise.all([
    getCampaignProgress(userId),
    userId
      ? prisma.character.findUnique({
          where: { userId },
          select: { xp: true, level: true },
        })
      : Promise.resolve(null),
    userId
      ? prisma.labProgress.count({ where: { userId, completed: true } })
      : Promise.resolve(0),
  ]);

  const current = rows.find((r) => r.nextLessonSlug !== null);
  const continueHref = current?.nextLessonSlug
    ? `/lessons/${current.nextLessonSlug}`
    : null;
  const level = character ? progressToNext(character.xp) : null;

  return (
    <SceneRoot id="hall">
      <section
        data-scene
        className="sc-scene sc-scene--hall -mb-px flex min-h-[calc(100dvh-56px)] flex-col"
      >
        <SceneArt
          layers={[
            { src: "/v2/home/hall-bg.webp", priority: true, quality: 75 },
            { src: "/v2/home/hall-mid.webp", plx: 0.06, mouse: 0.4 },
          ]}
        />
        <div className="sc-scrim" />
        <SceneParticles tone="hall" />

        <div className="relative mx-auto w-full max-w-5xl flex-1 px-5 pb-20 pt-14">
          {/* ─── hero ─── */}
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold/80">
              {m.home.kicker}
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-wide text-[#f4f2fb] sm:text-5xl">
              {m.home.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted2">
              {m.home.intro}
            </p>
          </div>

          {/* ─── level strip + continue (signed-in only) ─── */}
          {userId && (level || continueHref) && (
            <div
              data-reveal="2"
              className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-bg/60 px-5 py-4 backdrop-blur sm:flex-row sm:items-center"
            >
              {level && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between font-mono text-[11px] text-muted">
                    <span className="uppercase tracking-[0.25em] text-accent-soft">
                      {fmt(m.home.level, { level: level.level })}
                    </span>
                    <span>
                      {fmt(m.home.xpToNext, {
                        into: level.into,
                        span: level.span,
                        next: level.level + 1,
                      })}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(level.percent, 3)}%`,
                        background: "linear-gradient(90deg, #8f7bff, #cfc3ff)",
                        boxShadow: "0 0 12px rgba(143,123,255,0.6)",
                      }}
                    />
                  </div>
                </div>
              )}
              {continueHref && (
                <Link
                  href={continueHref}
                  className="shrink-0 rounded-full px-6 py-3 text-center font-display text-[12px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[2px]"
                  style={{
                    background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                    boxShadow: "0 0 24px rgba(143,123,255,0.4)",
                  }}
                >
                  {m.home.continueCta}
                </Link>
              )}
            </div>
          )}

          {/* ─── the two roads ─── */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Journey door */}
            <div
              data-reveal="3"
              className={`sc-door rounded-2xl border border-accent/25 bg-bg/70 p-5 backdrop-blur ${
                JOURNEY_LIVE ? "" : "opacity-90"
              }`}
            >
              <DoorArt
                src="/v2/home/door-journey.webp"
                glyph="🧭"
                tone="journey"
              />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent-soft">
                {m.home.doors.journey.label}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold tracking-wide text-fg">
                {m.home.doors.journey.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted2">
                {m.home.doors.journey.blurb}
              </p>
              {JOURNEY_LIVE ? (
                <Link
                  href="/journey"
                  className="mt-4 inline-block rounded-full px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-[#0b0817]"
                  style={{ background: "linear-gradient(180deg, #cfc3ff, #8f7bff)" }}
                >
                  {m.home.doors.journey.cta}
                </Link>
              ) : (
                <p className="mt-4 inline-block rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {m.home.doors.journey.soon}
                </p>
              )}
            </div>

            {/* Campaign door */}
            <div
              data-reveal="4"
              className="sc-door rounded-2xl border border-gold/25 bg-bg/70 p-5 backdrop-blur"
            >
              <DoorArt
                src="/v2/home/door-campaign.webp"
                glyph="⚔️"
                tone="campaign"
              />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
                {m.home.doors.campaign.label}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold tracking-wide text-fg">
                {m.home.doors.campaign.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted2">
                {m.home.doors.campaign.blurb}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/campaign"
                  className="inline-block rounded-full border border-gold/50 bg-gold/10 px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/20"
                >
                  {m.home.doors.campaign.cta}
                </Link>
                <span className="font-mono text-[11px] text-muted">
                  {fmt(m.home.doors.campaign.progress, {
                    done: cardsClaimed,
                    total: acts.length,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* ─── the Forge (not a road — the workshop) ─── */}
          <div
            data-reveal="5"
            className="sc-door mt-6 overflow-hidden rounded-2xl border border-accent2/25 bg-bg/70 backdrop-blur"
          >
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-accent2/30 bg-[radial-gradient(70%_70%_at_50%_40%,rgba(69,214,196,0.16),transparent_75%)]">
                <span className="sc-ember text-4xl" aria-hidden>
                  ⚒️
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent2/90">
                  {m.home.doors.forge.label}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-wide text-fg">
                  {m.home.doors.forge.title}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted2">
                  {m.home.doors.forge.blurb}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <Link
                  href="/labs"
                  className="rounded-full border border-accent2/50 bg-accent2/10 px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-accent2 transition hover:bg-accent2/20"
                >
                  {m.home.doors.forge.cta}
                </Link>
                {userId && (
                  <span className="font-mono text-[11px] text-muted">
                    {fmt(m.home.doors.forge.progress, { done: labsDone })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SceneRoot>
  );
}
