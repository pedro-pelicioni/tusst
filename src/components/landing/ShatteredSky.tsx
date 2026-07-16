/* eslint-disable @next/next/no-img-element */
"use client";

// "C - Shattered Sky" — cinematic landing page, implemented from the
// Claude Design handoff (gaming-project-landing-page). One client
// component: scroll reveals, typed prologue, pointer+scroll parallax,
// card tilt, nav condensation and a scroll progress bar.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useMessages } from "@/i18n/client";

interface ShatteredSkyProps {
  /** First active track — "Enter the Citadel" / footer CTA target. */
  beginHref: string;
  /** Nav pill target: the campaign when signed in, /login otherwise. */
  enterHref: string;
}

const MONO = "var(--font-jetbrains-mono), monospace";

const HERO_CARDS = [
  {
    src: "/cards/stroowarrior.png",
    style: { left: "4%", top: "24%", width: 150, "--rot": "-9deg", animation: "sky-floaty 7s ease-in-out infinite" },
    plx: 0.55,
    border: "rgba(217,185,106,0.4)",
  },
  {
    src: "/cards/strooracle.png",
    style: { right: "5%", top: "32%", width: 130, "--rot": "8deg", animation: "sky-floaty 8.5s ease-in-out 1s infinite" },
    plx: 0.4,
    border: "rgba(143,123,255,0.4)",
  },
  {
    src: "/cards/stroophantom.png",
    style: { left: "14%", bottom: "12%", width: 110, "--rot": "6deg", animation: "sky-floaty 6.5s ease-in-out 2s infinite", opacity: 0.85 },
    plx: 0.7,
    border: "rgba(69,214,196,0.4)",
  },
  {
    src: "/cards/astrostroopie.png",
    style: { right: "13%", bottom: "9%", width: 120, "--rot": "-7deg", animation: "sky-floaty 7.8s ease-in-out 0.5s infinite", opacity: 0.9 },
    plx: 0.6,
    border: "rgba(143,123,255,0.4)",
  },
] as const;

const DRIFT_STARS = [
  { left: "8%", size: 2, bg: "#fff", glow: "#8f7bff", anim: "sky-stardrift 24s linear infinite" },
  { left: "22%", size: 3, bg: "#cfc3ff", glow: "#8f7bff", anim: "sky-stardrift 30s linear 5s infinite" },
  { left: "41%", size: 2, bg: "#fff", glow: "#45d6c4", anim: "sky-stardrift 26s linear 11s infinite" },
  { left: "58%", size: 2, bg: "#d9b96a", glow: "#d9b96a", anim: "sky-stardrift 33s linear 2s infinite" },
  { left: "74%", size: 3, bg: "#cfc3ff", glow: "#8f7bff", anim: "sky-stardrift 22s linear 8s infinite" },
  { left: "89%", size: 2, bg: "#fff", glow: "#8f7bff", anim: "sky-stardrift 28s linear 15s infinite" },
  { left: "33%", size: 2, bg: "#fff", glow: "#cfc3ff", anim: "sky-stardrift 36s linear 19s infinite" },
  { left: "66%", size: 2, bg: "#45d6c4", glow: "#45d6c4", anim: "sky-stardrift 29s linear 13s infinite" },
] as const;

const SEALED_ACTS = [
  { numeral: "II", src: "/cards/stropillusion.png", titleKey: "act2Title", tagKey: "act2Tag", hover: "hover:border-[rgba(143,123,255,0.45)]" },
  { numeral: "III", src: "/cards/stroopkeeper.png", titleKey: "act3Title", tagKey: "act3Tag", hover: "hover:border-[rgba(143,123,255,0.45)]" },
  { numeral: "IV", src: "/cards/stroophantom.png", titleKey: "act4Title", tagKey: "act4Tag", hover: "hover:border-[rgba(143,123,255,0.45)]" },
  { numeral: "V", src: "/cards/strooracle.png", titleKey: "act5Title", tagKey: "act5Tag", hover: "hover:border-[rgba(143,123,255,0.45)]" },
  { numeral: "VI", src: "/cards/astrostroopie.png", titleKey: "act6Title", tagKey: "act6Tag", hover: "hover:border-[rgba(69,214,196,0.5)]" },
  { numeral: "VIII", src: "/cards/stroopzipper.png", titleKey: "act8Title", tagKey: "act8Tag", hover: "hover:border-[rgba(217,185,106,0.5)]" },
] as const;

const CHAMPIONS = [
  { src: "/cards/stroowarrior.png", alt: "Stroowarrior", name: "STROOWARRIOR", metaKey: "metaStroowarrior", border: "rgba(217,185,106,0.4)", glow: "", nameColor: "#f4f2fb", metaColor: "#696980" },
  { src: "/cards/stropillusion.png", alt: "Stropillusion", name: "STROPILLUSION", metaKey: "metaStropillusion", border: "rgba(143,123,255,0.35)", glow: "", nameColor: "#f4f2fb", metaColor: "#696980" },
  { src: "/cards/stroopkeeper.png", alt: "Stroopkeeper", name: "STROOPKEEPER", metaKey: "metaStroopkeeper", border: "rgba(143,123,255,0.35)", glow: "", nameColor: "#f4f2fb", metaColor: "#696980" },
  { src: "/cards/stroophantom.png", alt: "Stroophantom", name: "STROOPHANTOM", metaKey: "metaStroophantom", border: "rgba(69,214,196,0.4)", glow: ", 0 0 30px rgba(69,214,196,0.12)", nameColor: "#f4f2fb", metaColor: "#45d6c4" },
  { src: "/cards/strooracle.png", alt: "Strooracle", name: "STROORACLE", metaKey: "metaStrooracle", border: "rgba(69,214,196,0.4)", glow: ", 0 0 30px rgba(69,214,196,0.12)", nameColor: "#f4f2fb", metaColor: "#45d6c4" },
  { src: "/cards/astrostroopie.png", alt: "Astrostroopie", name: "ASTROSTROOPIE", metaKey: "metaAstrostroopie", border: "rgba(69,214,196,0.4)", glow: ", 0 0 30px rgba(69,214,196,0.12)", nameColor: "#f4f2fb", metaColor: "#45d6c4" },
  { src: "/cards/stroopbeholder.png", alt: "Stroopbeholder", name: "STROOPBEHOLDER", metaKey: "metaStroopbeholder", border: "rgba(161,61,61,0.55)", glow: ", 0 0 34px rgba(161,61,61,0.25)", nameColor: "#c96a6a", metaColor: "#c96a6a" },
  { src: "/cards/stroopzipper.png", alt: "Stroopzipper", name: "STROOPZIPPER", metaKey: "metaStroopzipper", border: "rgba(217,185,106,0.5)", glow: ", 0 0 34px rgba(217,185,106,0.2)", nameColor: "#d9b96a", metaColor: "#d9b96a" },
] as const;

const HOW_IT_WORKS = [
  { num: "01", titleKey: "step1Title", copyKey: "step1Copy" },
  { num: "02", titleKey: "step2Title", copyKey: "step2Copy" },
  { num: "03", titleKey: "step3Title", copyKey: "step3Copy" },
] as const;

const EYES = [
  { top: "18%", left: "8%", size: 22, anim: "sky-eyeflicker 6s ease-in-out infinite" },
  { top: "62%", left: "4%", size: 14, anim: "sky-eyeflicker 8s ease-in-out 2s infinite" },
  { top: "28%", right: "6%", size: 17, anim: "sky-eyeflicker 7s ease-in-out 4s infinite" },
  { top: "74%", right: "10%", size: 12, anim: "sky-eyeflicker 9s ease-in-out 1s infinite" },
] as const;

export function ShatteredSky({ beginHref, enterHref }: ShatteredSkyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const m = useMessages();
  const typedLine = m.landing.prologue.typedLine;
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll + close on ESC while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: (() => void)[] = [];

    // scroll reveals
    const revealEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    for (const el of revealEls) {
      el.style.opacity = "0";
      el.style.transform = "translateY(36px)";
      el.style.transition =
        "opacity 900ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)";
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    revealEls.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // typed prologue line
    const typeEl = root.querySelector<HTMLElement>("[data-typeline]");
    if (typeEl) {
      let started = false;
      let t: ReturnType<typeof setTimeout>;
      const typeIo = new IntersectionObserver(
        (entries) => {
          if (started || !entries.some((e) => e.isIntersecting)) return;
          started = true;
          let i = 0;
          const tick = () => {
            i++;
            typeEl.textContent = typedLine.slice(0, i);
            if (i < typedLine.length) t = setTimeout(tick, 34);
          };
          tick();
          typeIo.disconnect();
        },
        { threshold: 0.6 },
      );
      typeIo.observe(typeEl);
      cleanups.push(() => {
        clearTimeout(t);
        typeIo.disconnect();
      });
    }

    // hero mouse + scroll parallax (combined), progress bar, nav condense
    let mx = 0;
    let my = 0;
    const apply = () => {
      const y = window.scrollY;
      for (const el of root.querySelectorAll<HTMLElement>("[data-plx]")) {
        const f = parseFloat(el.dataset.plx ?? "0.3") || 0.3;
        el.style.translate = `${-mx * f * 46}px ${-my * f * 30 + y * f * 0.4}px`;
      }
      const prog = root.querySelector<HTMLElement>("[data-progress]");
      if (prog) {
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (total > 0 ? (y / total) * 100 : 0) + "%";
      }
      const nav = root.querySelector<HTMLElement>("[data-nav]");
      if (nav) {
        if (y > 60) {
          nav.style.background = "rgba(5,4,9,0.78)";
          nav.style.backdropFilter = "blur(12px)";
          nav.style.paddingTop = "12px";
          nav.style.paddingBottom = "12px";
        } else {
          nav.style.background = "transparent";
          nav.style.backdropFilter = "none";
          nav.style.paddingTop = "";
          nav.style.paddingBottom = "";
        }
      }
    };
    const onMove = (ev: PointerEvent) => {
      mx = ev.clientX / window.innerWidth - 0.5;
      my = ev.clientY / window.innerHeight - 0.5;
      requestAnimationFrame(apply);
    };
    const onScroll = () => requestAnimationFrame(apply);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    cleanups.push(() => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    });

    // card tilt with brightness glare
    for (const el of root.querySelectorAll<HTMLElement>("[data-tilt]")) {
      el.style.perspective = "1000px";
      const img = el.querySelector("img");
      if (!img) continue;
      img.style.transition = "transform 180ms ease, filter 180ms ease";
      const move = (ev: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        img.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 15}deg) scale(1.05)`;
        img.style.filter = `brightness(${1 + (0.5 - y) * 0.18})`;
      };
      const leave = () => {
        img.style.transform = "";
        img.style.filter = "";
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    }

    // resume the hero video if the browser paused it while backgrounded
    const heroVideo = root.querySelector<HTMLVideoElement>("[data-herovideo]");
    if (heroVideo) {
      const resume = () => {
        if (
          document.visibilityState === "visible" &&
          heroVideo.paused &&
          !heroVideo.ended
        ) {
          heroVideo.play().catch(() => {});
        }
      };
      document.addEventListener("visibilitychange", resume);
      resume();
      cleanups.push(() =>
        document.removeEventListener("visibilitychange", resume),
      );
    }

    return () => cleanups.forEach((fn) => fn());
  }, [typedLine]);

  return (
    <div
      ref={rootRef}
      className="min-h-screen overflow-x-hidden bg-[#050409] text-[#e7e7f1]"
    >
      {/* scroll progress */}
      <div
        data-progress
        className="fixed left-0 top-0 z-[99] h-[2px] w-0"
        style={{
          background: "linear-gradient(90deg, #8f7bff, #cfc3ff)",
          boxShadow: "0 0 12px rgba(143,123,255,0.8)",
          transition: "width 80ms linear",
        }}
      />

      {/* nav */}
      <nav
        data-nav
        className="fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-4 py-4 sm:px-9 sm:py-5"
        style={{
          transition:
            "background 300ms ease, backdrop-filter 300ms ease, padding-top 300ms ease, padding-bottom 300ms ease",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img
            src="/logo-sigil.png"
            alt="TUSST"
            className="h-[34px] w-[34px] object-contain"
            style={{ animation: "sky-sigilglow 4s ease-in-out infinite" }}
          />
          <span className="font-display text-[15px] font-extrabold tracking-[0.3em] text-[#e7e7f1]">
            TUSST
          </span>
        </Link>
        {/* inline links — tablet / desktop */}
        <div
          className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.24em] sm:flex"
          style={{ fontFamily: MONO }}
        >
          <a href="#prologue" className="text-[#9c9cb4] transition-colors hover:text-[#e7e7f1]">
            {m.landing.nav.prologue}
          </a>
          <a href="#acts" className="text-[#9c9cb4] transition-colors hover:text-[#e7e7f1]">
            {m.landing.nav.campaign}
          </a>
          <a href="#champions" className="text-[#9c9cb4] transition-colors hover:text-[#e7e7f1]">
            {m.landing.nav.champions}
          </a>
          <a href="#boss" className="hidden text-[#9c9cb4] transition-colors hover:text-[#e7e7f1] md:block">
            {m.landing.nav.beholder}
          </a>
          <Link
            href="/ide"
            className="hidden text-[#cfc3ff] transition-colors hover:text-white sm:block"
          >
            {m.landing.nav.forge}
          </Link>
          <LanguageSwitcher variant="landing" />
          <Link
            href={enterHref}
            className="rounded-full border border-[rgba(143,123,255,0.6)] bg-[rgba(143,123,255,0.12)] px-5 py-2.5 text-[#cfc3ff] backdrop-blur-[6px] transition-colors hover:bg-[rgba(143,123,255,0.28)] hover:text-white"
          >
            {m.landing.nav.enterRealm}
          </Link>
        </div>

        {/* hamburger — mobile only */}
        <button
          type="button"
          aria-label={menuOpen ? m.landing.nav.closeMenu : m.landing.nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls="sky-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(143,123,255,0.35)] bg-[rgba(143,123,255,0.08)] text-[#cfc3ff] transition-colors hover:bg-[rgba(143,123,255,0.2)] sm:hidden"
        >
          <span className="relative block h-[14px] w-[20px]">
            <span
              className="absolute left-0 block h-[2px] w-full rounded bg-current transition-transform duration-300"
              style={{
                top: "50%",
                transform: menuOpen
                  ? "translateY(-50%) rotate(45deg)"
                  : "translateY(-7px)",
              }}
            />
            <span
              className="absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 rounded bg-current transition-opacity duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="absolute left-0 block h-[2px] w-full rounded bg-current transition-transform duration-300"
              style={{
                top: "50%",
                transform: menuOpen
                  ? "translateY(-50%) rotate(-45deg)"
                  : "translateY(5px)",
              }}
            />
          </span>
        </button>
      </nav>

      {/* mobile menu overlay */}
      <div
        id="sky-mobile-menu"
        className={`fixed inset-0 z-[85] flex flex-col transition-opacity duration-300 sm:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label={m.landing.nav.closeMenu}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-[rgba(5,4,9,0.8)] backdrop-blur-[6px]"
        />
        <nav
          aria-label="Mobile"
          className={`relative mt-[72px] flex flex-col gap-1 border-y border-[rgba(143,123,255,0.18)] bg-[rgba(9,8,16,0.96)] px-4 py-4 text-[13px] uppercase tracking-[0.24em] transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-4"
          }`}
          style={{ fontFamily: MONO }}
        >
          {[
            { href: "#prologue", label: m.landing.nav.prologue },
            { href: "#acts", label: m.landing.nav.campaign },
            { href: "#champions", label: m.landing.nav.champions },
            { href: "#boss", label: m.landing.nav.beholder },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[44px] items-center text-[#9c9cb4] transition-colors hover:text-[#e7e7f1]"
            >
              {l.label}
            </a>
          ))}
          <div className="flex min-h-[44px] items-center">
            <LanguageSwitcher variant="landing" />
          </div>
          <Link
            href={enterHref}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(143,123,255,0.6)] bg-[rgba(143,123,255,0.12)] px-5 text-[#cfc3ff] transition-colors hover:bg-[rgba(143,123,255,0.28)] hover:text-white"
          >
            {m.landing.nav.enterRealm}
          </Link>
        </nav>
      </div>

      {/* ═══ HERO: cinematic full-bleed ═══ */}
      <header className="relative h-screen min-h-[640px] overflow-hidden">
        <div
          data-plx="0.25"
          className="absolute inset-[-6%] overflow-hidden will-change-transform"
          style={{ animation: "sky-slowzoom 30s ease-in-out infinite alternate" }}
        >
          {/* final frame: the original artwork, revealed when the video ends */}
          <div
            className="absolute inset-0 bg-cover"
            style={{ backgroundImage: "url('/sky-shattered.png')", backgroundPosition: "center 30%" }}
          />
          <video
            data-herovideo
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/sky-shattered.png"
            onEnded={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
            className="relative h-full w-full object-cover"
            style={{
              objectPosition: "center 30%",
              transition: "opacity 1500ms ease",
            }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 80% at 50% 40%, transparent 35%, rgba(5,4,9,0.75) 80%, #050409 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,4,9,0.55), transparent 25%, transparent 55%, #050409 96%)",
          }}
        />

        {/* shooting stars */}
        <span
          className="pointer-events-none absolute right-[-4%] top-[12%] h-[1.5px] w-[130px] rounded-[2px]"
          style={{
            background: "linear-gradient(270deg, transparent, #cfc3ff, #fff)",
            animation: "sky-shootingstar 11s linear 2s infinite",
          }}
        />
        <span
          className="pointer-events-none absolute right-[-8%] top-[30%] h-px w-[90px] rounded-[2px]"
          style={{
            background: "linear-gradient(270deg, transparent, #8f7bff, #fff)",
            animation: "sky-shootingstar 17s linear 9s infinite",
          }}
        />

        {/* drifting stars */}
        <div className="pointer-events-none absolute inset-0">
          {DRIFT_STARS.map((s, i) => (
            <span
              key={i}
              className="absolute bottom-[-6px] rounded-full"
              style={{
                left: s.left,
                width: s.size,
                height: s.size,
                background: s.bg,
                boxShadow: `0 0 ${s.size * 3}px ${s.glow}`,
                animation: s.anim,
              }}
            />
          ))}
        </div>

        {/* floating champion cards, edges of frame (hidden < 900px) */}
        {HERO_CARDS.map((c, i) => (
          <div
            key={i}
            data-plx={c.plx}
            className="absolute z-[3] hidden min-[900px]:block"
            style={c.style as React.CSSProperties}
          >
            <img
              src={c.src}
              alt=""
              className="block w-full rounded-[10px]"
              style={{
                border: `1px solid ${c.border}`,
                boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
              }}
            />
          </div>
        ))}

        {/* title block */}
        <div
          data-plx="0.15"
          className="relative z-[5] flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <img
            src="/logo-sigil.png"
            alt=""
            className="mb-[22px] h-[96px] w-[96px] object-contain md:h-[112px] md:w-[112px]"
            style={{ animation: "sky-sigilglow 4s ease-in-out infinite" }}
          />
          <h1
            className="mb-0 mt-[22px] font-display font-black text-[#f4f2fb]"
            style={{
              fontSize: "clamp(34px, 6vw, 76px)",
              lineHeight: 1.05,
              animation: "sky-titleglow 5s ease-in-out infinite",
            }}
          >
            {m.landing.hero.titleTop}
            <br />
            <span className="text-[0.62em] tracking-[0.14em] text-[#cfc3ff]">
              {m.landing.hero.titleBottom}
            </span>
          </h1>
          <p
            className="mb-0 mt-[30px] max-w-[520px] text-base leading-[1.75] text-[#b9b9d1]"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.95)" }}
          >
            {m.landing.hero.taglineIntro}{" "}
            <strong className="text-[#f4f2fb]">{m.landing.hero.taglineRust}</strong>
            {m.landing.hero.taglineMiddle}{" "}
            <strong className="text-[#f4f2fb]">{m.landing.hero.taglineSoroban}</strong>{" "}
            {m.landing.hero.taglineOutro}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link
                href={beginHref}
                className="inline-block rounded-full px-8 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-[#0b0817] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_0_60px_rgba(143,123,255,0.7),0_14px_36px_rgba(0,0,0,0.6)] sm:px-[42px] sm:py-[17px] sm:text-[15px]"
                style={{
                  background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                  boxShadow:
                    "0 0 40px rgba(143,123,255,0.45), 0 10px 30px rgba(0,0,0,0.6)",
                }}
              >
                {m.landing.hero.beginCampaign}
              </Link>
              <Link
                href="/ide"
                className="inline-flex items-center gap-3 rounded-full border border-[rgba(143,123,255,0.6)] bg-[rgba(143,123,255,0.12)] px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-[#cfc3ff] backdrop-blur-[6px] transition-[transform,box-shadow,background-color] duration-150 hover:-translate-y-[2px] hover:bg-[rgba(143,123,255,0.24)] hover:shadow-[0_0_50px_rgba(143,123,255,0.5),0_14px_36px_rgba(0,0,0,0.6)] sm:px-[34px] sm:py-[16px] sm:text-[15px]"
              >
                {m.landing.hero.openForge}
                <span
                  className="rounded-full border border-[rgba(207,195,255,0.45)] px-2 py-[3px] text-[9px] font-normal tracking-[0.2em] text-[#cfc3ff]"
                  style={{ fontFamily: MONO }}
                >
                  {m.landing.hero.noLoginBadge}
                </span>
              </Link>
            </div>
            <span
              className="text-[11px] text-[#696980]"
              style={{ fontFamily: MONO }}
            >
              {m.landing.hero.freeLine}
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-6 left-1/2 z-[5] -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-[#696980]"
          style={{ fontFamily: MONO }}
        >
          <span style={{ animation: "sky-caretblink 1.4s steps(1) infinite" }}>
            ▼
          </span>{" "}
          {m.landing.hero.descend}
        </div>
      </header>

      {/* ═══ PROLOGUE: the lore band ═══ */}
      <section id="prologue" className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-[130px]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 500px at 20% 50%, rgba(143,123,255,0.07), transparent 70%)",
          }}
        />
        <div data-reveal className="relative mx-auto max-w-[760px] text-center">
          <p
            className="m-0 text-[11px] uppercase tracking-[0.5em] text-[#696980]"
            style={{ fontFamily: MONO }}
          >
            {m.landing.prologue.kicker}
          </p>
          <div className="my-[26px] flex items-center justify-center gap-4">
            <span
              className="block h-px w-20"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(143,123,255,0.6))",
              }}
            />
            <span className="text-[13px] text-[#8f7bff]">✦</span>
            <span
              className="block h-px w-20"
              style={{
                background:
                  "linear-gradient(270deg, transparent, rgba(143,123,255,0.6))",
              }}
            />
          </div>
          <p
            data-typeline
            className="m-0 min-h-[3em] font-display font-bold leading-[1.5] text-[#e7e7f1]"
            style={{ fontSize: "clamp(22px, 3.2vw, 34px)" }}
          />
          <p className="mx-auto mb-0 mt-[34px] max-w-[560px] text-[15px] leading-[1.85] text-[#9c9cb4]">
            {m.landing.prologue.body}
          </p>
          <p
            className="mb-0 mt-[26px] text-[11px] tracking-[0.2em] text-[#696980]"
            style={{ fontFamily: MONO }}
          >
            {m.landing.prologue.attribution}
          </p>
        </div>
      </section>

      {/* ═══ ACTS: cinematic bands ═══ */}
      <section id="acts" className="relative py-10">
        <div data-reveal className="mb-[90px] px-6 text-center">
          <p
            className="m-0 text-[11px] uppercase tracking-[0.5em] text-[#696980]"
            style={{ fontFamily: MONO }}
          >
            {m.landing.acts.kicker}
          </p>
          <h2
            className="mb-0 mt-4 font-display font-extrabold text-[#f4f2fb]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            {m.landing.acts.headingTop}
            <br />
            {m.landing.acts.headingBottom}
          </h2>
        </div>

        {/* Act I band */}
        <div
          data-reveal
          className="mx-auto mb-[110px] grid max-w-[1160px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-8 px-5 sm:gap-[60px] sm:px-8"
        >
          <div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:gap-[18px]">
              <span
                className="font-display text-[72px] font-black leading-none text-transparent sm:text-[110px]"
                style={{ WebkitTextStroke: "1px rgba(217,185,106,0.7)" }}
              >
                I
              </span>
              <div>
                <p
                  className="m-0 text-[10px] uppercase tracking-[0.3em] text-[#d9b96a]"
                  style={{ fontFamily: MONO }}
                >
                  {m.landing.acts.act1Kicker}
                </p>
                <h3 className="mb-0 mt-2 font-display text-[34px] font-extrabold text-[#f4f2fb]">
                  {m.landing.acts.act1Title}
                </h3>
              </div>
            </div>
            <p className="mb-0 mt-[22px] max-w-[460px] text-[15px] leading-[1.8] text-[#9c9cb4]">
              {m.landing.acts.act1Body}
            </p>
            <Link
              href={beginHref}
              className="mt-[26px] inline-block border-b border-[rgba(217,185,106,0.5)] py-3 pb-1 text-xs uppercase tracking-[0.2em] text-[#d9b96a] transition-colors hover:text-[#f0d894]"
              style={{ fontFamily: MONO }}
            >
              {m.landing.acts.act1Cta}
            </Link>
          </div>
          <div
            data-tilt
            className="w-full max-w-[250px] justify-self-center transition-transform duration-[160ms]"
          >
            <img
              src="/cards/stroowarrior.png"
              alt="Stroowarrior"
              className="block w-full rounded-[14px]"
              style={{
                border: "1px solid rgba(217,185,106,0.45)",
                boxShadow:
                  "0 30px 80px rgba(0,0,0,0.85), 0 0 50px rgba(217,185,106,0.12)",
              }}
            />
            <p
              className="mb-0 mt-[14px] text-center text-[10px] uppercase tracking-[0.2em] text-[#696980]"
              style={{ fontFamily: MONO }}
            >
              {m.landing.acts.act1Reward}
            </p>
          </div>
        </div>

        {/* Acts II–VI: sealed constellation row */}
        <div data-reveal className="mx-auto mb-10 max-w-[1160px] px-5 sm:px-8">
          <p
            className="mb-7 mt-0 text-center text-[10px] uppercase tracking-[0.3em] text-[#696980]"
            style={{ fontFamily: MONO }}
          >
            ⊗ {m.landing.acts.sealedNote}
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
            {SEALED_ACTS.map((a) => (
              <div
                key={a.numeral}
                className={`rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(13,13,20,0.6)] p-5 text-center transition-[border-color,transform] duration-200 hover:-translate-y-1 ${a.hover}`}
              >
                <div className="mx-auto mb-[14px] w-[58px] overflow-hidden rounded-md border border-[rgba(255,255,255,0.1)]">
                  <img
                    src={a.src}
                    alt=""
                    className="block aspect-[2/3] w-full object-cover brightness-[0.55] grayscale"
                  />
                </div>
                <span className="font-display text-[22px] font-extrabold text-[#696980]">
                  {a.numeral}
                </span>
                <div className="mt-1.5 font-display text-[15px] font-bold text-[#c9c9dd]">
                  {m.landing.acts[a.titleKey]}
                </div>
                <div
                  className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-[#696980]"
                  style={{ fontFamily: MONO }}
                >
                  {m.landing.acts[a.tagKey]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Act VII: the boss ═══ */}
      <section
        id="boss"
        data-reveal
        className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-[130px]"
        style={{
          background:
            "radial-gradient(900px 600px at 50% 50%, rgba(161,61,61,0.13), transparent 70%), linear-gradient(180deg, #050409, #0a0508 50%, #050409)",
        }}
      >
        {/* watching eyes */}
        {EYES.map((e, i) => (
          <span
            key={i}
            className="pointer-events-none absolute text-[#c96a6a]"
            style={{
              top: e.top,
              left: "left" in e ? e.left : undefined,
              right: "right" in e ? e.right : undefined,
              fontSize: e.size,
              animation: e.anim,
            }}
          >
            ◉
          </span>
        ))}
        <div className="mx-auto grid max-w-[1160px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-8 sm:gap-[60px]">
          <div
            data-tilt
            className="w-full max-w-[290px] justify-self-center transition-transform duration-[160ms]"
          >
            <img
              src="/cards/stroopbeholder.png"
              alt="Stroopbeholder"
              className="block w-full rounded-[14px] border border-[rgba(161,61,61,0.6)]"
              style={{ animation: "sky-redpulse 4s ease-in-out infinite" }}
            />
          </div>
          <div>
            <p
              className="m-0 text-[10px] uppercase tracking-[0.3em] text-[#c96a6a]"
              style={{ fontFamily: MONO }}
            >
              {m.landing.boss.kicker}
            </p>
            <h3
              className="mb-0 mt-3 font-display font-black leading-[1.08] text-[#f0dede]"
              style={{ fontSize: "clamp(34px, 4.5vw, 54px)" }}
            >
              {m.landing.boss.titleTop}
              <br />
              {m.landing.boss.titleBottom}
            </h3>
            <p className="mb-0 mt-6 max-w-[460px] text-[15px] leading-[1.8] text-[#9c9cb4]">
              {m.landing.boss.body}
            </p>
            <p
              className="mb-0 mt-5 text-xs text-[#c96a6a]"
              style={{ fontFamily: MONO }}
            >
              {m.landing.boss.trophy}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CHAMPIONS: full gallery ═══ */}
      <section
        id="champions"
        className="relative px-5 py-20 sm:px-7 sm:py-[120px]"
        style={{
          background:
            "radial-gradient(900px 500px at 50% 15%, rgba(143,123,255,0.08), transparent 65%)",
        }}
      >
        <div data-reveal className="mb-16 text-center">
          <p
            className="m-0 text-[11px] uppercase tracking-[0.5em] text-[#696980]"
            style={{ fontFamily: MONO }}
          >
            {m.landing.champions.kicker}
          </p>
          <h2
            className="mb-0 mt-4 font-display font-extrabold text-[#f4f2fb]"
            style={{ fontSize: "clamp(34px, 4.8vw, 58px)" }}
          >
            {m.landing.champions.heading}
          </h2>
          <p className="mx-auto mb-0 mt-5 max-w-[540px] text-sm leading-[1.75] text-[#9c9cb4]">
            {m.landing.champions.body}
          </p>
        </div>

        <div
          className="mx-auto flex max-w-[1240px] flex-wrap justify-center gap-7"
          style={{ perspective: "1400px" }}
        >
          {CHAMPIONS.map((c) => (
            <div
              key={c.name}
              data-reveal
              data-tilt
              className="w-[200px] transition-transform duration-[160ms]"
            >
              <img
                src={c.src}
                alt={c.alt}
                className="block aspect-[2/3] w-full rounded-xl object-cover"
                style={{
                  border: `1px solid ${c.border}`,
                  boxShadow: `0 20px 50px rgba(0,0,0,0.75)${c.glow}`,
                }}
              />
              <div className="mt-3 text-center">
                <div
                  className="font-display text-sm font-bold tracking-[0.1em]"
                  style={{ color: c.nameColor }}
                >
                  {c.name}
                </div>
                <div
                  className="mt-[3px] text-[10px]"
                  style={{ fontFamily: MONO, color: c.metaColor }}
                >
                  {m.landing.champions[c.metaKey]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS: three beats ═══ */}
      <section className="mx-auto max-w-[1100px] px-5 pb-20 pt-10 sm:px-8 sm:pb-[110px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10">
          {HOW_IT_WORKS.map((b) => (
            <div key={b.num} data-reveal className="text-center">
              <span
                className="font-display text-[54px] font-black text-transparent"
                style={{ WebkitTextStroke: "1px rgba(143,123,255,0.7)" }}
              >
                {b.num}
              </span>
              <h3 className="mb-0 mt-[14px] font-display text-xl font-bold text-[#f4f2fb]">
                {m.landing.howItWorks[b.titleKey]}
              </h3>
              <p className="mx-auto mb-0 mt-3 max-w-[300px] text-sm leading-[1.75] text-[#9c9cb4]">
                {m.landing.howItWorks[b.copyKey]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <footer className="relative overflow-hidden px-5 pb-[60px] pt-24 text-center sm:px-6 sm:pt-[150px]">
        <div
          className="absolute inset-0 bg-cover opacity-[0.28]"
          style={{
            backgroundImage: "url('/sky-shattered.png')",
            backgroundPosition: "center 15%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #050409 0%, transparent 45%, rgba(5,4,9,0.9) 100%)",
          }}
        />
        <div data-reveal className="relative z-[2]">
          <img
            src="/logo-sigil.png"
            alt=""
            className="inline-block h-[54px] w-[54px] object-contain"
            style={{ animation: "sky-sigilglow 4s ease-in-out infinite" }}
          />
          <h2
            className="mb-0 mt-5 font-display font-black text-[#f4f2fb]"
            style={{
              fontSize: "clamp(34px, 5.5vw, 68px)",
              animation: "sky-titleglow 5s ease-in-out infinite",
            }}
          >
            {m.landing.footer.heading}
          </h2>
          <p className="mx-auto mb-0 mt-[18px] max-w-[460px] text-sm leading-[1.75] text-[#9c9cb4]">
            {m.landing.footer.body}
          </p>
          <Link
            href={beginHref}
            className="mt-10 inline-block rounded-full px-[52px] py-[18px] font-display text-base font-bold uppercase tracking-[0.16em] text-[#0b0817] transition-transform duration-150 hover:-translate-y-[2px]"
            style={{
              background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
              boxShadow:
                "0 0 50px rgba(143,123,255,0.5), 0 12px 32px rgba(0,0,0,0.6)",
            }}
          >
            {m.landing.footer.beginCampaign}
          </Link>
          <p className="mb-0 mt-6 text-[12px] text-[#9c9cb4]">
            {m.landing.footer.skipPrefix}{" "}
            <Link
              href="/ide"
              className="text-[#cfc3ff] underline decoration-[rgba(143,123,255,0.5)] underline-offset-4 transition-colors hover:text-white"
            >
              {m.landing.footer.skipLink}
            </Link>
            {m.landing.footer.skipSuffix}
          </p>
          <p
            className="mb-0 mt-[90px] text-[10px] uppercase tracking-[0.3em] text-[#696980]"
            style={{ fontFamily: MONO }}
          >
            tusst · {m.landing.footer.taglineTutorial} · Ø{" "}
            {m.landing.footer.taglineMotto}
          </p>
        </div>
      </footer>
    </div>
  );
}
