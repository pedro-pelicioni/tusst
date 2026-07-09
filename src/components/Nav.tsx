import Link from "next/link";
import { NavMenu } from "./NavMenu";
import { auth, signOut } from "@/lib/auth";

export async function Nav() {
  const session = await auth();
  const user = session?.user;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-2.5">
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

        <nav className="flex items-center gap-3 sm:gap-7">
          {user ? (
            <NavMenu name={user.name ?? "guardian"} signOutAction={handleSignOut} />
          ) : (
            <>
              <Link
                href="/path"
                className="-my-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg"
              >
                path
              </Link>
              <Link
                href="/cards"
                className="-my-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg"
              >
                cards
              </Link>
              <Link
                href="/ide"
                className="-my-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg"
              >
                forge
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition hover:bg-accent/20"
              >
                sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
