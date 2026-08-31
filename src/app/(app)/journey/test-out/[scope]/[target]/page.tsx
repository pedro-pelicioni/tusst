import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { JOURNEY_ARCS } from "@/content/journey";
import { getJourneyChaptersLocalized } from "@/content/journey/i18n";
import {
  arcIsTestable,
  chapterIsTestable,
  type TestOutScope,
} from "@/content/journey/test-out";
import type { ConceptArc } from "@/content/journey/types";
import { getLocale, getMessages } from "@/i18n/server";
import { TestOutRunner } from "@/components/journey/TestOutRunner";
import { SceneArt, hasV2Asset } from "@/components/scene/SceneArt";
import { SceneParticles } from "@/components/scene/SceneParticles";
import { SceneRoot } from "@/components/scene/SceneRoot";

// The test-out screen for one chapter or one whole arc. The paper itself is
// fetched client-side (a fresh draw per attempt, never cached); this page
// only resolves what is being skipped and whether it is skippable at all.

const CHAPTER_SEAL = "/v2/journey/skip-chapter.webp";
const ARC_SEAL = "/v2/journey/skip-arc.webp";

function resolveScope(scope: string): TestOutScope | null {
  return scope === "chapter" || scope === "arc" ? scope : null;
}

async function resolve(scope: string, target: string) {
  const kind = resolveScope(scope);
  if (!kind) return null;
  const locale = await getLocale();
  const chapters = getJourneyChaptersLocalized(locale);

  if (kind === "chapter") {
    const concept = chapters.find((c) => c.meta.slug === target);
    if (!chapterIsTestable(concept)) return null;
    return {
      kind,
      chapters,
      title: concept!.meta.title,
      readHref: `/journey/${target}`,
    };
  }

  if (!JOURNEY_ARCS.includes(target as ConceptArc)) return null;
  if (!arcIsTestable(target as ConceptArc, chapters)) return null;
  const m = await getMessages();
  const first = chapters.find(
    (c) => c.meta.arc === target && c.meta.status === "live",
  );
  return {
    kind,
    chapters,
    title: m.journey.arcs[target as ConceptArc].title,
    readHref: first ? `/journey/${first.meta.slug}` : "/journey",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scope: string; target: string }>;
}): Promise<Metadata> {
  const { scope, target } = await params;
  const resolved = await resolve(scope, target);
  if (!resolved) return {};
  const m = await getMessages();
  return {
    title: `${resolved.title} — TUSST`,
    description: m.journey.testOut.chapterKicker,
  };
}

export default async function TestOutPage({
  params,
}: {
  params: Promise<{ scope: string; target: string }>;
}) {
  const { scope, target } = await params;
  const resolved = await resolve(scope, target);
  if (!resolved) notFound();

  const session = await auth();
  const seal = resolved.kind === "arc" ? ARC_SEAL : CHAPTER_SEAL;

  return (
    <SceneRoot id="test-out">
      <section
        data-scene
        className="sc-scene sc-scene--journey min-h-[calc(100dvh-140px)]"
      >
        <SceneArt
          layers={[
            {
              src: "/v2/journey/map-bg-v2.webp",
              priority: true,
              quality: 60,
              className: "opacity-60",
            },
          ]}
        />
        <div className="sc-scrim" />
        <SceneParticles tone="journey" count={8} />
        <div className="relative">
          <TestOutRunner
            scope={resolved.kind}
            target={target}
            title={resolved.title}
            readHref={resolved.readHref}
            sealArt={hasV2Asset(seal) ? seal : null}
            signedIn={!!session?.user?.id}
            chapterTitles={Object.fromEntries(
              resolved.chapters.map((c) => [c.meta.slug, c.meta.title]),
            )}
          />
        </div>
      </section>
    </SceneRoot>
  );
}
