import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { labBySlug } from "@/content/labs";
import { LabPlayer } from "@/components/labs/LabPlayer";
import { SceneRoot } from "@/components/scene/SceneRoot";

// One guided lab. Public like /ide — anonymous heroes play the whole flow;
// only the XP claim asks them to sign in. The scenario itself is resolved
// client-side by the player (content modules carry functions).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = labBySlug(slug);
  if (!lab) return {};
  return {
    title: `${lab.meta.title} — TUSST`,
    description: lab.meta.tagline,
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lab = labBySlug(slug);
  if (!lab || lab.meta.status !== "live") notFound();

  const session = await auth();

  return (
    <SceneRoot id="lab-player">
      <section data-scene className="sc-scene sc-scene--lab min-h-[calc(100dvh-56px)]">
        <div className="relative">
          <LabPlayer labSlug={slug} signedIn={!!session?.user?.id} />
        </div>
      </section>
    </SceneRoot>
  );
}
