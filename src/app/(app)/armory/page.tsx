import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArmoryShop } from "@/components/overworld/ArmoryShop";
import { ARMORY_SLOTS, isArmorySlot, type ArmorySlot } from "@/content/armory";
import { getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { auth } from "@/lib/auth";
import { buildArmoryView } from "@/lib/armory-view";
import { prisma } from "@/lib/db";
import { buildHeroView } from "@/lib/hero-view";

// The Armory — the only place gold is spent, and therefore the payoff of the
// hidden-currency mechanic. Gated the same way the pouch is: until
// `User.goldRevealed` flips on the first finished lesson there is no shop, only
// a shut door, so a brand-new player never sees an economy they have not been
// introduced to (prisma/schema.prisma, the HIDDEN GOLD note).
//
// `?slot=` picks the tab and is where the buy/equip actions send the player
// back to; `?err=` carries a refusal (not enough gold) because a server action
// that must work without JS cannot hand a value back to the DOM.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.armory.metaTitle };
}

export default async function ArmoryPage({
  searchParams,
}: {
  searchParams: Promise<{ slot?: string; err?: string }>;
}) {
  const { slot: rawSlot, err } = await searchParams;

  const [session, m] = await Promise.all([auth(), getMessages()]);
  const userId = session?.user?.id;
  if (!userId) redirect("/login?callbackUrl=%2Farmory");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      gold: true,
      goldRevealed: true,
      character: { select: { heroId: true, xp: true } },
    },
  });
  if (!user) redirect("/login");

  // Only read the inventory for a player who actually has one: before the
  // reveal there is no shop to draw, so there is nothing to look up.
  const pieces = user.goldRevealed
    ? await prisma.armoryPiece.findMany({
        where: { userId },
        select: { itemId: true, equipped: true },
      })
    : [];

  const t = m.armory;
  const active: ArmorySlot = isArmorySlot(rawSlot) ? rawSlot : ARMORY_SLOTS[0];

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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-pixel text-[11px] uppercase tracking-[0.3em] text-ow-ink-muted">
              {t.kicker}
            </p>
            <h1 className="mt-3 font-pixel text-2xl leading-tight text-ow-ink sm:text-3xl">
              {user.goldRevealed ? t.title : t.locked.title}
            </h1>
          </div>

          {user.goldRevealed && (
            <span className="flex shrink-0 items-center gap-2 rounded-full border border-[#b8873e]/50 bg-[#2a1a10]/10 px-3 py-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gold-coin.png"
                alt=""
                className="h-[18px] w-[18px] object-contain"
              />
              <span className="font-pixel text-[12px] tabular-nums text-ow-ink">
                {fmt(t.pouch, { gold: user.gold })}
              </span>
            </span>
          )}
        </div>

        {user.goldRevealed ? (
          <>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ow-ink-muted">
              {t.intro}
            </p>
            <ArmoryShop
              view={buildArmoryView({ gold: user.gold, pieces })}
              hero={buildHeroView({
                heroId: user.character?.heroId,
                name: user.name,
                xp: user.character?.xp ?? 0,
                signedIn: true,
                m: m.overworld,
              })}
              active={active}
              error={err ?? null}
              m={t}
            />
          </>
        ) : (
          // The door stays shut, and says how to open it — no prices, no
          // teaser grid, nothing that leaks the economy early.
          <div className="mt-4 max-w-xl">
            <p className="text-sm leading-relaxed text-ow-ink-muted">{t.locked.body}</p>
            <Link
              href="/campaign"
              className="mt-6 inline-block rounded-md px-7 py-3 font-pixel text-[12px] uppercase tracking-[0.18em] text-ow-parchment transition-transform hover:-translate-y-[2px] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{
                background:
                  "linear-gradient(180deg, var(--ow-crimson), var(--ow-crimson-2))",
                boxShadow: "var(--ow-gilding)",
              }}
            >
              {t.locked.cta}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
