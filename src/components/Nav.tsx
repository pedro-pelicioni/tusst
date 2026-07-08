import Link from "next/link";
import { CharacterAvatar } from "./CharacterAvatar";
import { auth, signOut } from "@/lib/auth";

export async function Nav() {
  const session = await auth();
  const user = session?.user;

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

        <nav className="flex items-center gap-5 sm:gap-7">
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
              className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition hover:bg-accent/20"
            >
              sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
