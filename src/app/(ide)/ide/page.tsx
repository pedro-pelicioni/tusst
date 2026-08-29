import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { labs } from "@/content/labs";
import { localizeLab, type LabTextOverlay } from "@/content/labs/localize";
import { getMessages } from "@/i18n/server";
import { IdeShell } from "@/components/ide/IdeShell";
import type { ForgeLabSummary } from "@/components/ide/LabDrawer";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.ide.meta.title,
    description: m.ide.meta.description,
  };
}

// The Forge is open to everyone: projects live in the browser (localStorage),
// compilation runs in the sandbox, and deploys are signed client-side. No
// auth gate — signed-in users just get a higher rate limit.
//
// The lab catalog is resolved here rather than in the client shell so titles
// arrive localized and completion comes from the database. Anonymous visitors
// simply get every lab marked unfinished.
export default async function IdePage() {
  const [session, m] = await Promise.all([auth(), getMessages()]);
  const userId = session?.user?.id;

  const completedRows = userId
    ? await prisma.labProgress.findMany({
        where: { userId, completed: true },
        select: { labSlug: true },
      })
    : [];
  const completed = new Set(completedRows.map((r) => r.labSlug));
  const overlays = m.labs.content as Record<string, LabTextOverlay | undefined>;

  const labSummaries: ForgeLabSummary[] = labs.map((lab) => {
    const { meta } = localizeLab(lab, overlays[lab.meta.slug]);
    return {
      slug: meta.slug,
      title: meta.title,
      tagline: meta.tagline,
      glyph: meta.glyph,
      difficulty: meta.difficulty,
      estMinutes: meta.estMinutes,
      status: meta.status,
      completed: completed.has(meta.slug),
    };
  });

  return <IdeShell labs={labSummaries} />;
}
