import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MusicControl } from "./music/MusicControl";
import { NavMenu } from "./NavMenu";
import { SignInLink } from "./SignInLink";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { JOURNEY_LIVE } from "@/content/journey";

export async function Nav() {
  const session = await auth();
  const user = session?.user;
  const m = await getMessages();

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  // The pouch stays hidden until the hidden-gold reveal; the level chip stays
  // hidden until the first XP lands — same philosophy, no zero-noise.
  const pouch = user?.id
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          gold: true,
          goldRevealed: true,
          character: { select: { level: true, xp: true } },
        },
      })
    : null;

  // The two roads + the workshop. Same set signed-in and signed-out; the
  // Journey joins once its first chapters go live (Phase B).
  const links = [
    ...(JOURNEY_LIVE ? [{ href: "/journey", label: m.common.nav.journey }] : []),
    { href: "/labs", label: m.common.nav.forge },
    { href: "/campaign", label: m.common.nav.campaign },
    { href: "/harbor", label: m.common.nav.advanced },
    // The Armory appears with the pouch, never before: the hidden-currency
    // reveal is the whole point (see prisma/schema.prisma).
    ...(pouch?.goldRevealed ? [{ href: "/armory", label: m.common.nav.armory }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[#b8873e]/40 transition group-hover:border-[#b8873e]/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-sigil.png"
              alt={m.common.logoAlt}
              className="h-full w-full object-contain p-0.5"
            />
          </span>
          <span className="font-mono text-sm font-semibold tracking-[0.22em] text-fg">
            TUSST
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          {user ? (
            <>
              <span className="hidden items-center gap-6 md:flex">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="-my-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg"
                  >
                    {l.label}
                  </Link>
                ))}
              </span>
              {(pouch?.character?.xp ?? 0) > 0 && (
                <Link
                  href="/profile"
                  title={fmt(m.common.nav.lvl, {
                    level: pouch?.character?.level ?? 1,
                  })}
                  className="flex items-center rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-accent-soft transition hover:border-accent/70 hover:bg-accent/20"
                >
                  {fmt(m.common.nav.lvl, { level: pouch?.character?.level ?? 1 })}
                </Link>
              )}
              {pouch?.goldRevealed && (
                <Link
                  // The pouch is the shortest road to the Armory: click the
                  // gold, see what it buys. It only renders once the currency
                  // is revealed, so this leaks nothing.
                  href="/armory"
                  aria-label={fmt(m.common.nav.pouchAria, { gold: pouch.gold })}
                  title={fmt(m.common.nav.pouchTitle, { gold: pouch.gold })}
                  className="flex items-center gap-1.5 rounded-full border border-[#b8873e]/35 bg-[#b8873e]/10 px-2.5 py-1 transition hover:border-[#b8873e]/70 hover:bg-[#b8873e]/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/gold-coin.png"
                    alt=""
                    className="h-[18px] w-[18px] object-contain drop-shadow-[0_0_6px_rgba(184,135,62,0.55)]"
                  />
                  <span className="font-mono text-[11px] font-semibold tabular-nums text-[#e0b25f]">
                    {pouch.gold}
                  </span>
                </Link>
              )}
              <MusicControl phone="hidden" />
              <LanguageSwitcher />
              <NavMenu
                name={user.name ?? "guardian"}
                journeyLive={JOURNEY_LIVE}
                armoryOpen={!!pouch?.goldRevealed}
                signOutAction={handleSignOut}
              />
            </>
          ) : (
            <>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="-my-2 hidden py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg sm:block"
                >
                  {l.label}
                </Link>
              ))}
              <MusicControl phone="mute" />
              <LanguageSwitcher />
              <SignInLink className="whitespace-nowrap rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition hover:bg-accent/20">
                {m.common.nav.signIn}
              </SignInLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
