/* eslint-disable @next/next/no-img-element */
"use client";

// Personalized onboarding (Mimo/Duolingo playbook, TUSST voice):
// progress bar · one question per screen · experience slider · social proof
// · campaign plan reveal · straight into the first skirmish, no signup wall.
// Answers land in localStorage for later personalization.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { acts } from "@/content/campaign";

const MASCOT_GUIDE = "/mascot/mascot-guide.png";
const MASCOT_CELEBRATE = "/mascot/mascot-celebrate.png";

const STORAGE_KEY = "tusst:onboarding";

const GOALS = [
  { icon: "⚒", label: "Switch to a career in tech" },
  { icon: "✦", label: "Get better at my job or studies" },
  { icon: "◉", label: "For fun — learn something new" },
  { icon: "⟠", label: "Build a dApp on Stellar" },
  { icon: "𖤐", label: "None of these" },
] as const;

const PROFILES = [
  { icon: "✎", label: "High-school student" },
  { icon: "🜁", label: "University student" },
  { icon: "⚙", label: "Employed" },
  { icon: "☍", label: "Freelancer / self-employed" },
  { icon: "𖤐", label: "None of these" },
] as const;

const XP_LEVELS = [
  { label: "NONE", blurb: "You've never written a rune. Perfect — the Citadel was built for you." },
  { label: "LOW", blurb: "You've tried coding before and know some fundamentals." },
  { label: "HIGH", blurb: "You code regularly and want to master Rust & Soroban." },
] as const;

const MONO = "var(--font-jetbrains-mono), monospace";

// How many acts the experience answer unlocks. The finale (Act VII, Soroban)
// is never unlocked from onboarding — it must be earned in the campaign.
const UNLOCKED_BY_XP = [1, 3, 6] as const; // NONE · LOW · HIGH

// welcome · goal · profile · xp · social proof · plan
const TOTAL_SCREENS = 6;

export function OnboardingFlow({ firstLessonHref }: { firstLessonHref: string }) {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [goal, setGoal] = useState<number | null>(null);
  const [profile, setProfile] = useState<number | null>(null);
  const [xp, setXp] = useState(1);

  const percent = Math.round(((screen + 1) / TOTAL_SCREENS) * 100);

  // Persist answers as they change (personalization hook for later phases).
  // The cookie mirror lets server components (path/track pages) read the
  // unlock level and gate the campaign accordingly.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          goal: goal !== null ? GOALS[goal].label : null,
          profile: profile !== null ? PROFILES[profile].label : null,
          experience: XP_LEVELS[xp].label.toLowerCase(),
          unlockedActs: UNLOCKED_BY_XP[xp],
          completedAt: screen === TOTAL_SCREENS - 1 ? Date.now() : null,
        }),
      );
      document.cookie = `tusst_onboarding=${encodeURIComponent(
        JSON.stringify({
          experience: XP_LEVELS[xp].label.toLowerCase(),
          unlockedActs: UNLOCKED_BY_XP[xp],
        }),
      )}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
  }, [goal, profile, xp, screen]);

  const next = () => setScreen((s) => Math.min(s + 1, TOTAL_SCREENS - 1));
  const back = () => setScreen((s) => Math.max(s - 1, 0));

  const pick = (setter: (i: number) => void) => (i: number) => {
    setter(i);
    // Mimo-style: tapping an option advances after a beat.
    window.setTimeout(next, 250);
  };

  const primaryBtn =
    "w-full rounded-full px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.16em] text-[#0b0817] transition-transform hover:-translate-y-[2px] sm:w-auto sm:min-w-[280px]";
  const primaryStyle = {
    background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
    boxShadow: "0 0 40px rgba(143,123,255,0.45), 0 10px 30px rgba(0,0,0,0.6)",
  } as const;

  const screens = useMemo(
    () => [
      /* ─── 0 · welcome ─── */
      <div key="welcome" className="flex flex-1 flex-col items-center justify-center text-center">
        <img
          src={MASCOT_GUIDE}
          alt=""
          className="h-48 w-48 object-contain"
          style={{ filter: "drop-shadow(0 0 40px rgba(143,123,255,0.35))" }}
        />
        <h1 className="mt-8 font-display text-3xl font-extrabold text-[#f4f2fb] sm:text-4xl">
          Learn the Runecraft
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted2">
          Master the skills to forge <strong className="text-fg">Rust</strong> programs and{" "}
          <strong className="text-fg">Soroban contracts</strong> on Stellar — one small
          rune at a time.
        </p>
      </div>,

      /* ─── 1 · goal ─── */
      <QuestionScreen
        key="goal"
        question="Why are you learning to code?"
        options={GOALS}
        selected={goal}
        onPick={pick(setGoal)}
      />,

      /* ─── 2 · profile ─── */
      <QuestionScreen
        key="profile"
        question="Which of these best describes you?"
        options={PROFILES}
        selected={profile}
        onPick={pick(setProfile)}
      />,

      /* ─── 3 · experience ─── */
      <div key="xp" className="flex flex-1 flex-col items-center justify-center text-center">
        <h2 className="max-w-lg font-display text-2xl font-extrabold text-[#f4f2fb] sm:text-3xl">
          How much coding experience do you have?
        </h2>
        <img
          src={MASCOT_GUIDE}
          alt=""
          className="mt-8 h-36 w-36 object-contain"
          style={{ filter: "drop-shadow(0 0 30px rgba(143,123,255,0.3))" }}
        />
        <div className="mt-10 w-full max-w-md">
          <div
            className="flex justify-between text-[11px] uppercase tracking-[0.2em]"
            style={{ fontFamily: MONO }}
          >
            {XP_LEVELS.map((l, i) => (
              <button
                key={l.label}
                type="button"
                onClick={() => setXp(i)}
                className={xp === i ? "font-bold text-accent" : "text-muted"}
              >
                {l.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="mt-3 w-full accent-[#8f7bff]"
            aria-label="Coding experience"
          />
        </div>
        <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-muted2">
          {XP_LEVELS[xp].blurb}
        </p>
      </div>,

      /* ─── 4 · social proof ─── */
      <div key="proof" className="flex flex-1 flex-col items-center justify-center text-center">
        <h2 className="max-w-lg font-display text-2xl font-extrabold text-[#f4f2fb] sm:text-3xl">
          The elders have forged many apprentices
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted2">
          Our mission is to turn Forgeborn into masters of the runecraft — real code,
          judged by hidden trials, straight in your browser. No setup. No excuses.
        </p>
        <img
          src={MASCOT_CELEBRATE}
          alt=""
          className="mt-10 h-52 w-52 object-contain"
          style={{ filter: "drop-shadow(0 0 50px rgba(143,123,255,0.4))" }}
        />
      </div>,

      /* ─── 5 · campaign plan ─── */
      <div key="plan" className="flex flex-1 flex-col items-center pt-2">
        <p
          className="text-[11px] uppercase tracking-[0.4em] text-muted"
          style={{ fontFamily: MONO }}
        >
          Your campaign plan
        </p>
        <h2 className="mt-3 text-center font-display text-2xl font-extrabold text-[#f4f2fb] sm:text-3xl">
          Forgeborn — Rust to Soroban
        </h2>
        <p className="mt-2 text-center text-[13px] text-muted2">
          {UNLOCKED_BY_XP[xp] > 1
            ? `Your experience unlocks the first ${UNLOCKED_BY_XP[xp]} paths.`
            : "Every legend starts at the first path."}
        </p>
        <div className="mt-8 w-full max-w-md">
          {acts.map((act, i) => {
            const unlocked = i < UNLOCKED_BY_XP[xp];
            return (
            <div key={act.numeral} className="flex gap-4">
              {/* rail */}
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border font-display text-sm font-bold ${
                    unlocked
                      ? "border-accent/70 bg-accent/15 text-accent"
                      : "border-line bg-bg-elev text-muted"
                  }`}
                >
                  {unlocked ? act.numeral : "🔒"}
                </span>
                {i < acts.length - 1 && (
                  <span
                    className={`w-px flex-1 ${unlocked ? "bg-accent/50" : "bg-white/[0.08]"}`}
                  />
                )}
              </div>
              <div className="pb-7">
                <p
                  className={`font-display text-[15px] font-bold ${
                    unlocked ? "text-fg" : "text-muted2"
                  }`}
                >
                  {i + 1}. {act.title}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                  {act.territory}
                  {act.overlord ? ` · ${act.overlord}` : ""}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>,
    ],
    [goal, profile, xp], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const isQuestion = screen === 1 || screen === 2;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6 py-6">
      {/* top bar */}
      <div className="flex items-center gap-4">
        {screen > 0 ? (
          <button
            type="button"
            onClick={back}
            aria-label="Back"
            className="text-lg leading-none text-muted transition hover:text-fg"
          >
            ‹
          </button>
        ) : (
          <Link
            href="/"
            aria-label="Exit"
            className="text-base leading-none text-muted transition hover:text-fg"
          >
            ✕
          </Link>
        )}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg, #8f7bff, #cfc3ff)",
              boxShadow: "0 0 12px rgba(143,123,255,0.6)",
            }}
          />
        </div>
      </div>

      {screens[screen]}

      {/* bottom actions (question screens advance on tap) */}
      {!isQuestion && (
        <div className="mt-10 flex flex-col items-center gap-4 pb-4">
          {screen === TOTAL_SCREENS - 1 ? (
            <button
              type="button"
              onClick={() => router.push(firstLessonHref)}
              className={primaryBtn}
              style={primaryStyle}
            >
              Start learning
            </button>
          ) : (
            <button type="button" onClick={next} className={primaryBtn} style={primaryStyle}>
              {screen === 0 ? "Begin" : "Continue"}
            </button>
          )}
          {screen === 0 && (
            <Link
              href="/login"
              className="text-sm text-muted2 transition hover:text-fg"
            >
              I already have an account
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionScreen({
  question,
  options,
  selected,
  onPick,
}: {
  question: string;
  options: readonly { icon: string; label: string }[];
  selected: number | null;
  onPick: (i: number) => void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center py-10">
      <h2 className="text-center font-display text-2xl font-extrabold text-[#f4f2fb] sm:text-3xl">
        {question}
      </h2>
      <div className="mt-10 flex flex-col gap-3">
        {options.map((opt, i) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onPick(i)}
            className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-left text-[15px] transition ${
              selected === i
                ? "border-accent/70 bg-accent/15 text-fg"
                : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:bg-white/[0.03] hover:text-fg"
            }`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-lg text-accent">
              {opt.icon}
            </span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
