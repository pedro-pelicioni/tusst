"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CharacterAvatar } from "./CharacterAvatar";
import { useMessages } from "@/i18n/client";

/** Profile avatar that opens a dropdown with the nav links and sign out. */
export function NavMenu({
  name,
  signOutAction,
}: {
  name: string;
  signOutAction: () => Promise<void>;
}) {
  const m = useMessages();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/path", label: m.common.nav.path },
    { href: "/cards", label: m.common.nav.cards },
    { href: "/ide", label: m.common.nav.forge },
  ] as const;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={m.common.nav.openProfileMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center rounded-full transition-opacity hover:opacity-80"
      >
        <CharacterAvatar name={name} levelLabel={m.common.nav.lvl} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 min-w-[168px] overflow-hidden rounded-xl border border-line bg-bg-elev py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        >
          <Link
            role="menuitem"
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex min-h-[44px] items-center px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:bg-white/[0.04] hover:text-fg"
          >
            {m.common.nav.profile}
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              role="menuitem"
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:bg-white/[0.04] hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-line" />
          <form action={signOutAction}>
            <button
              role="menuitem"
              type="submit"
              className="flex min-h-[44px] w-full items-center px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition hover:bg-white/[0.04] hover:text-fg"
            >
              {m.common.nav.signOut}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
