import Link from "next/link";
import { CharacterAvatar } from "./CharacterAvatar";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function Nav() {
  const session = await auth();
  const user = session?.user;

  // The pouch stays hidden until the Phase 5 reveal — the first completed
  // lesson flips goldRevealed, and only then does the coin counter appear.
  const pouch = user?.id
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: { gold: true, goldRevealed: true },
      })
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[#b8873e]/40 transition group-hover:border-[#b8873e]/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-sigil.png"
              alt="TUSST — the Stroop Sigil"
              className="h-full w-full object-contain p-0.5"
            />
          </span>
          <span className="font-mono text-sm font-semibold tracking-[0.22em] text-fg">
            TUSST
          </span>
        </Link>

        <nav className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link
            href="/path"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg"
          >
            path
          </Link>
          <Link
            href="/cards"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg"
          >
            cards
          </Link>
          <Link
            href="/ide"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg"
          >
            forge
          </Link>

          {user ? (
            <>
              <div className="h-5 w-px bg-line" />
              {pouch?.goldRevealed && (
                <Link
                  href="/profile"
                  aria-label={`Your pouch: ${pouch.gold} gold`}
                  title={`${pouch.gold} gold`}
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
              <Link
                href="/profile"
                aria-label="Your profile"
                className="transition-opacity hover:opacity-80"
              >
                <CharacterAvatar name={user.name ?? "guardian"} />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition hover:text-fg"
                >
                  sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="whitespace-nowrap rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition hover:bg-accent/20"
            >
              sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
