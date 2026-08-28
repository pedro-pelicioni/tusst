"use client";

// Fixed landing nav: transparent over the hero, condensing to a
// solid bar once the page scrolls (solid color on purpose — no
// backdrop-filter on a full-width fixed element). Section links smooth-
// scroll (instant under prefers-reduced-motion); the mobile overlay is
// inert while closed, locks body scroll and closes on Escape.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMessages } from "@/i18n/client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const SECTIONS = ["champions", "campaign", "boss", "forge"] as const;

export function LandingNav({ enterHref }: { enterHref: string }) {
  const m = useMessages().landing;
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      setCondensed(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const goTo = (id: string) => (event: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return; // fall through to the plain anchor navigation
    event.preventDefault();
    setOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  const links = (extra: string) =>
    SECTIONS.map((id) => (
      <a
        key={id}
        href={`#${id}`}
        onClick={goTo(id)}
        className={`font-mono uppercase tracking-[0.28em] text-muted2 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${extra}`}
      >
        {m.nav[id]}
      </a>
    ));

  return (
    <>
      <nav
        aria-label="TUSST"
        className={`ld-nav fixed inset-x-0 top-0 z-[80] ${condensed ? "is-condensed" : ""}`}
      >
        <div
          className={`relative mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 transition-[padding] duration-300 sm:px-8 ${condensed ? "py-3" : "py-5"}`}
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            <Image
              src="/logo-sigil.png"
              alt=""
              width={34}
              height={34}
              quality={75}
              className="h-[30px] w-[30px] rounded-full sm:h-[34px] sm:w-[34px]"
            />
            <span className="font-display text-[17px] font-bold tracking-[0.34em] text-fg">
              TUSST
            </span>
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 text-[11px] md:flex">
            {links("")}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="landing" />
            <Link
              href={enterHref}
              className="hidden rounded-full border border-accent/45 bg-accent/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-accent-soft transition-colors hover:bg-accent/25 hover:text-white focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 sm:block"
            >
              {m.nav.enterRealm}
            </Link>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="ld-mobile-menu"
              aria-label={open ? m.nav.closeMenu : m.nav.openMenu}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-md border border-line-strong focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 md:hidden"
            >
              <span
                aria-hidden
                className={`h-px w-4 bg-fg transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                aria-hidden
                className={`h-px w-4 bg-fg transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      <div
        id="ld-mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8 bg-[rgba(5,4,9,0.97)] transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {links("text-[14px]")}
        <Link
          href={enterHref}
          onClick={() => setOpen(false)}
          className="rounded-full border border-accent/45 bg-accent/10 px-6 py-3 font-mono text-[12px] uppercase tracking-[0.24em] text-accent-soft focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
        >
          {m.nav.enterRealm}
        </Link>
      </div>
    </>
  );
}
