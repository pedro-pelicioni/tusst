import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HEROES } from "@/content/heroes";
import { HeroPicker } from "@/components/overworld/HeroPicker";
import { getMessages } from "@/i18n/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { safeCallbackUrl } from "@/lib/safe-redirect";

// The hero pick — the one screen between the first login and the world map
// (/path sends signed-in players without a `Character.heroId` here), and
// the "change hero" door from the profile. Renders the parchment frame and
// hands the three cards to <HeroPicker>, which posts to `chooseHero`.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.overworld.heroPick.metaTitle };
}

export default async function HeroPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const safe = safeCallbackUrl(callbackUrl, "/path");

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    // Come back here after login — keeping the destination when there is one.
    const back =
      safe === "/path" ? "/hero" : `/hero?callbackUrl=${encodeURIComponent(safe)}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(back)}`);
  }

  const [character, m] = await Promise.all([
    prisma.character.findUnique({
      where: { userId },
      select: { heroId: true },
    }),
    getMessages(),
  ]);
  const heroId = character?.heroId ?? null;
  const t = m.overworld.heroPick;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <section
        className="rounded-2xl border-4 border-ow-frame p-5 text-ow-ink sm:p-10"
        style={{
          background:
            "linear-gradient(180deg, var(--ow-parchment), var(--ow-parchment-2))",
          boxShadow: "var(--ow-gilding)",
        }}
      >
        <p className="font-pixel text-[11px] uppercase tracking-[0.3em] text-ow-ink-muted">
          {t.kicker}
        </p>
        <h1 className="mt-3 font-pixel text-2xl leading-tight text-ow-ink sm:text-3xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ow-ink-muted">
          {t.intro}
        </p>

        <div className="mt-8">
          <HeroPicker
            heroes={HEROES.map((h) => ({ id: h.id, cardId: h.cardId, color: h.color }))}
            current={heroId}
            callbackUrl={safe}
          />
        </div>
      </section>
    </div>
  );
}
