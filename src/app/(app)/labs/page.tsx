import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { labs } from "@/content/labs";
import { getMessages } from "@/i18n/server";
import { SceneRoot } from "@/components/scene/SceneRoot";
import { SceneArt } from "@/components/scene/SceneArt";
import { SceneParticles } from "@/components/scene/SceneParticles";
import { LabCard } from "@/components/labs/LabCard";

// The Forge, expanded — home of the guided labs AND the free-mode IDE.
// Labs teach by pressing real buttons on the real testnet; the IDE is the
// same fire with no rails. Public like /ide: anonymous visitors play labs
// too, they just claim XP after signing in.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.labs.metaTitle, description: m.labs.metaDescription };
}

export default async function LabsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const m = await getMessages();

  const completedRows = userId
    ? await prisma.labProgress.findMany({
        where: { userId, completed: true },
        select: { labSlug: true },
      })
    : [];
  const completed = new Set(completedRows.map((r) => r.labSlug));

  const live = labs.filter((l) => l.meta.status === "live");
  const soon = labs.filter((l) => l.meta.status === "soon");

  return (
    <SceneRoot id="forge-labs">
      <section
        data-scene
        className="sc-scene sc-scene--forge min-h-[calc(100dvh-56px)]"
      >
        <SceneArt
          layers={[{ src: "/v2/labs/forge-bg.webp", priority: true, quality: 75 }]}
        />
        <div className="sc-scrim" />
        <SceneParticles tone="forge" />

        <div className="relative mx-auto w-full max-w-5xl px-5 pb-24 pt-14">
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent2/90">
              {m.labs.kicker}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-wide text-[#f4f2fb] sm:text-5xl">
              {m.labs.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted2">
              {m.labs.intro}
            </p>
          </div>

          {/* free mode — the IDE, same forge, no rails */}
          <div
            data-reveal="2"
            className="sc-door mt-8 flex flex-col gap-4 rounded-2xl border border-accent2/25 bg-bg/70 p-5 backdrop-blur sm:flex-row sm:items-center"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-accent2/30 bg-accent2/10 text-2xl">
              <span className="sc-ember" aria-hidden>
                🔥
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-bold tracking-wide text-fg">
                {m.labs.freeMode.title}
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-muted2">
                {m.labs.freeMode.blurb}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <Link
                href="/ide"
                className="rounded-full border border-accent2/50 bg-accent2/10 px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-accent2 transition hover:bg-accent2/20"
              >
                {m.labs.freeMode.cta}
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {m.labs.freeMode.badge}
              </span>
            </div>
          </div>

          {/* guided labs */}
          <p
            data-reveal="3"
            className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-muted"
          >
            {m.labs.liveHeading}
          </p>
          <div data-reveal="4" className="mt-4 grid gap-5 md:grid-cols-2">
            {live.map((lab) => (
              <LabCard
                key={lab.meta.slug}
                lab={lab}
                completed={completed.has(lab.meta.slug)}
                m={m.labs}
              />
            ))}
          </div>

          {/* roadmap */}
          {soon.length > 0 && (
            <>
              <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                {m.labs.soonHeading}
              </p>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {soon.map((lab) => (
                  <LabCard
                    key={lab.meta.slug}
                    lab={lab}
                    completed={false}
                    m={m.labs}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </SceneRoot>
  );
}
