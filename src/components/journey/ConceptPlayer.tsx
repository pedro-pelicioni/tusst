/* eslint-disable @next/next/no-img-element */
"use client";

// The Builder's Journey concept player. Same skeleton as LessonSteps /
// LabPlayer (index/maxIndex, seeded option shuffle, feedback sheet, mascot),
// plus the journey-only step kinds: interactive widgets, forge-lab handoffs,
// and the optional "See it in Rust" branch. Steps arrive as PROPS (journey
// content is pure data), already enriched server-side with lab completion
// and campaign lock state.

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { Diagram, DiagramFrame } from "@/components/visuals/Diagram";
import { WidgetSlot } from "@/components/visuals/WidgetSlot";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import type { JourneyStep } from "@/content/journey/types";

const MASCOT_CELEBRATE = "/mascot/mascot-celebrate.png";
const MASCOT_ENCOURAGE = "/mascot/mascot-encourage.png";
const RUNE_ARROW = "/rune-arrow.png";

type Feedback = { correct: boolean; text: string } | null;
type ClaimStatus =
  | { s: "idle" }
  | { s: "saving" }
  | { s: "done"; earned: number; total: number; level: number; leveledUp: boolean; already: boolean };
type ExerciseStatus =
  | { s: "idle" }
  | { s: "checking" }
  | {
      s: "error";
      reason: "notConfigured" | "rateLimited" | "signedOut" | "invalid" | "unavailable";
    }
  | { s: "verdict"; meets: boolean; feedback: string; xpEarned?: number };

export interface LabLinkState {
  live: boolean;
  completed: boolean;
  title: string;
  tagline: string;
}

export interface BranchState {
  locked: boolean;
  actNumeral: string;
  actTitle: string;
}

const doneKey = (slug: string) => `tusst:journey-steps:${slug}`;
const draftKey = (slug: string) => `tusst:journey-ex:${slug}`;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededOrder(length: number, seed: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  let s = seed || 1;
  for (let i = length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function ArrowButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "back" | "forward";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-bg-elev transition hover:border-accent/40 hover:bg-accent/[0.07] disabled:invisible"
    >
      <img
        src={RUNE_ARROW}
        alt=""
        className={`h-[22px] w-[22px] object-contain ${direction === "forward" ? "-scale-x-100" : ""}`}
        style={{ filter: "drop-shadow(0 0 6px rgba(143,123,255,0.45))" }}
      />
    </button>
  );
}

export function ConceptPlayer({
  conceptSlug,
  title,
  numeral,
  sigilSrc,
  steps,
  xp,
  signedIn,
  nextHref,
  labState,
  branchState,
}: {
  conceptSlug: string;
  title: string;
  numeral: string;
  /** resolved by the server page; null while a chapter has no master yet */
  sigilSrc: string | null;
  steps: JourneyStep[];
  xp: number;
  signedIn: boolean;
  nextHref: string | null;
  labState: Record<string, LabLinkState>;
  branchState: Record<string, BranchState>;
}) {
  const m = useMessages();
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [atSeal, setAtSeal] = useState(false);
  const [claim, setClaim] = useState<ClaimStatus>({ s: "idle" });
  const [exSpec, setExSpec] = useState("");
  const [exStatus, setExStatus] = useState<ExerciseStatus>({ s: "idle" });

  // Restore an unsent spec draft on mount — same sync-from-localStorage
  // pattern (and lint carve-out) as the lab player's run hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(draftKey(conceptSlug));
      if (saved) setExSpec(saved);
    } catch {}
  }, [conceptSlug]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const total = steps.length;
  const step = steps[Math.min(index, total - 1)];

  const optionOrder = useMemo(() => {
    if (step.kind === "quiz")
      return seededOrder(step.options.length, hashString(conceptSlug + step.question));
    if (step.kind === "fill")
      return seededOrder(step.choices.length, hashString(conceptSlug + step.prompt));
    return [];
  }, [step, conceptSlug]);

  const advance = useCallback(() => {
    setSelected(null);
    setFeedback(null);
    if (index + 1 >= total) {
      setAtSeal(true);
      try {
        window.localStorage.setItem(doneKey(conceptSlug), "1");
      } catch {}
    } else {
      setIndex((i) => i + 1);
      setMaxIndex((mx) => Math.max(mx, index + 1));
    }
  }, [index, total, conceptSlug]);

  const goBack = useCallback(() => {
    setSelected(null);
    setFeedback(null);
    if (atSeal) {
      setAtSeal(false);
      return;
    }
    setIndex((i) => Math.max(0, i - 1));
  }, [atSeal]);

  const goForward = useCallback(() => {
    setSelected(null);
    setFeedback(null);
    setIndex((i) => Math.min(i + 1, maxIndex));
  }, [maxIndex]);

  // Enter advances confirmed feedback / plain-continue steps (never the
  // exercise — Enter belongs to its textarea).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (step.kind === "exercise") return;
      if (feedback?.correct) advance();
      else if (
        (step.kind === "theory" ||
          step.kind === "widget" ||
          step.kind === "diagram" ||
          step.kind === "labLink" ||
          step.kind === "rustBranch") &&
        !atSeal
      )
        advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedback, step, atSeal, advance]);

  const submitSpec = async () => {
    if (step.kind !== "exercise") return;
    setExStatus({ s: "checking" });
    try {
      const res = await fetch("/api/journey/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptSlug, spec: exSpec }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        const reason =
          body?.error === "mentor_not_configured"
            ? "notConfigured"
            : body?.error === "rate_limited"
              ? "rateLimited"
              : res.status === 401
                ? "signedOut"
                : res.status === 400 || res.status === 422
                  ? "invalid"
                  : "unavailable";
        setExStatus({ s: "error", reason });
        return;
      }
      const body = (await res.json()) as {
        meets: boolean;
        feedback: string;
        xp?: { awarded: boolean; earned: number };
      };
      setExStatus({
        s: "verdict",
        meets: body.meets,
        feedback: body.feedback,
        xpEarned: body.xp?.awarded ? body.xp.earned : undefined,
      });
    } catch {
      setExStatus({ s: "error", reason: "unavailable" });
    }
  };

  const sealChapter = async () => {
    setClaim({ s: "saving" });
    try {
      const res = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptSlug }),
      });
      if (!res.ok) {
        setClaim({ s: "idle" });
        return;
      }
      const body = (await res.json()) as {
        already: boolean;
        xp: { earned: number; total: number; level: number; leveledUp: boolean };
      };
      setClaim({
        s: "done",
        earned: body.xp.earned,
        total: body.xp.total,
        level: body.xp.level,
        leveledUp: body.xp.leveledUp,
        already: body.already,
      });
    } catch {
      setClaim({ s: "idle" });
    }
  };

  const percent =
    claim.s === "done" ? 100 : atSeal ? 96 : Math.round((index / total) * 100);

  /* ─── done screen ─── */
  if (claim.s === "done") {
    const p = m.journey.player.done;
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
        <img
          src={MASCOT_CELEBRATE}
          alt=""
          className="h-44 w-44 object-contain"
          style={{ filter: "drop-shadow(0 0 40px rgba(143,123,255,0.35))" }}
        />
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
          {p.kicker}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-wide text-fg">
          <span className="mr-3 text-lg text-accent/70">{numeral}</span>
          {title}
        </h1>
        {claim.already ? (
          <p className="mt-4 text-sm text-muted2">{p.already}</p>
        ) : (
          <>
            <p className="mt-5 font-display text-4xl font-extrabold text-gold">
              {fmt(p.xpEarned, { xp: claim.earned })}
            </p>
            {claim.leveledUp && (
              <p className="mt-2 font-display text-lg font-bold text-accent-soft">
                {fmt(p.levelUp, { level: claim.level })}
              </p>
            )}
          </>
        )}
        <p className="mt-2 font-mono text-[11px] text-muted">
          {fmt(p.xpTotal, { xp: claim.total })}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          {nextHref && (
            <Link
              href={nextHref}
              className="rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[2px]"
              style={{
                background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                boxShadow: "0 0 34px rgba(143,123,255,0.4)",
              }}
            >
              {p.next}
            </Link>
          )}
          <Link
            href="/journey"
            className="rounded-full border border-line px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:border-line-strong hover:text-fg"
          >
            {p.backToMap}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-140px)] max-w-3xl flex-col px-5 py-6">
      {/* ─── top bar ─── */}
      <div className="flex items-center gap-3">
        <Link
          href="/journey"
          aria-label={m.journey.player.exit}
          className="shrink-0 text-lg leading-none text-muted transition hover:text-fg"
        >
          ✕
        </Link>
        {sigilSrc && (
          <img
            src={sigilSrc}
            alt=""
            title={title}
            className="hidden h-7 w-7 shrink-0 object-contain sm:block"
          />
        )}
        <ArrowButton
          direction="back"
          label={m.lesson.previousStep}
          disabled={index === 0 && !atSeal}
          onClick={goBack}
        />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${Math.max(percent, 4)}%`,
              background: "linear-gradient(90deg, #8f7bff, #cfc3ff)",
              boxShadow: "0 0 12px rgba(143,123,255,0.6)",
            }}
          />
        </div>
        <ArrowButton
          direction="forward"
          label={m.lesson.nextStep}
          disabled={atSeal || index >= maxIndex}
          onClick={goForward}
        />
        <span className="shrink-0 font-mono text-[11px] text-muted">
          {fmt(m.lesson.stepProgress, {
            current: atSeal ? total : Math.min(index + 1, total),
            total,
          })}
        </span>
      </div>

      {/* ─── body ─── */}
      <div className="flex flex-1 flex-col justify-start pt-10">
        {atSeal ? (
          /* seal screen */
          <div className="mx-auto w-full max-w-xl text-center">
            {sigilSrc && (
              <img
                src={sigilSrc}
                alt=""
                className="mx-auto mb-6 h-28 w-28 object-contain"
                style={{ filter: "drop-shadow(0 0 30px rgba(217,185,106,0.3))" }}
              />
            )}
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
              {m.journey.player.claim.title}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted2">
              {m.journey.player.claim.body}
            </p>
            {signedIn ? (
              <button
                type="button"
                disabled={claim.s === "saving"}
                onClick={sealChapter}
                className="mt-8 w-full rounded-2xl px-8 py-5 font-display text-[15px] font-bold uppercase tracking-[0.16em] text-[#241d06] transition-transform enabled:hover:-translate-y-[2px] disabled:opacity-70"
                style={{
                  background: "linear-gradient(180deg, #ecd9a6, #d9b96a)",
                  boxShadow:
                    "0 0 40px rgba(217,185,106,0.35), 0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                {claim.s === "saving"
                  ? m.journey.player.claim.saving
                  : fmt(m.journey.player.claim.cta, { xp })}
              </button>
            ) : (
              <div className="mt-8 rounded-xl border border-line bg-bg-elev px-5 py-5">
                <p className="text-sm leading-relaxed text-muted2">
                  {m.journey.player.claim.signedOut}
                </p>
                <Link
                  href="/login"
                  className="mt-4 inline-block rounded-full px-7 py-3 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-[#0b0817]"
                  style={{ background: "linear-gradient(180deg, #cfc3ff, #8f7bff)" }}
                >
                  {m.journey.player.claim.signIn}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {step.kind === "theory" && (
              <div>
                {step.image && (
                  <img
                    src={step.image}
                    alt=""
                    className="mx-auto mb-6 h-36 w-36 object-contain"
                    style={{ filter: "drop-shadow(0 0 30px rgba(143,123,255,0.3))" }}
                  />
                )}
                <div className="mx-auto max-w-xl">
                  <Markdown>{step.body}</Markdown>
                </div>
              </div>
            )}

            {step.kind === "widget" && (
              <div className="mx-auto w-full max-w-2xl">
                {step.body && (
                  <div className="mx-auto max-w-xl">
                    <Markdown>{step.body}</Markdown>
                  </div>
                )}
                <div className="mt-6">
                  <WidgetSlot component={step.component} />
                </div>
              </div>
            )}

            {step.kind === "diagram" && (
              <div className="mx-auto w-full max-w-2xl">
                {step.body && (
                  <div className="mx-auto max-w-xl">
                    <Markdown>{step.body}</Markdown>
                  </div>
                )}
                <div className="mt-6">
                  <DiagramFrame caption={step.caption}>
                    <Diagram view={step.view} />
                  </DiagramFrame>
                </div>
              </div>
            )}

            {step.kind === "quiz" && (
              <div className="mx-auto w-full max-w-xl">
                <Markdown>{step.question}</Markdown>
                <div className="mt-6 flex flex-col gap-3">
                  {optionOrder.map((i) => {
                    const opt = step.options[i];
                    const isSel = selected === i;
                    const wrong = feedback && !feedback.correct && isSel;
                    const right = feedback?.correct && isSel;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={!!feedback?.correct}
                        onClick={() => {
                          if (feedback) setFeedback(null);
                          setSelected(i);
                        }}
                        className={`rounded-xl border px-5 py-4 text-left text-sm transition ${
                          right
                            ? "border-pop/60 bg-pop/10 text-pop"
                            : wrong
                              ? "border-red-400/60 bg-red-400/10 text-red-300"
                              : isSel
                                ? "border-accent/70 bg-accent/15 text-fg"
                                : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
                        }`}
                      >
                        <span className="text-[13.5px] leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step.kind === "fill" && (
              <div className="mx-auto w-full max-w-xl">
                <Markdown>{step.prompt}</Markdown>
                <div className="mt-6 overflow-hidden rounded-xl border border-line bg-bg-elev">
                  <div className="border-b border-line px-4 py-2 font-mono text-[11px] text-muted">
                    {step.file}
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-fg">
                    {step.before}
                    <span
                      className={`inline-block min-w-[72px] rounded border px-2 text-center align-baseline ${
                        selected !== null
                          ? feedback?.correct
                            ? "border-pop/60 bg-pop/10 text-pop"
                            : feedback
                              ? "border-red-400/60 bg-red-400/10 text-red-300"
                              : "border-accent/70 bg-accent/15 text-fg"
                          : "border-dashed border-line-strong text-muted"
                      }`}
                    >
                      {selected !== null ? step.choices[selected] : " "}
                    </span>
                    {step.after}
                  </pre>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {optionOrder.map((i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={!!feedback?.correct}
                      onClick={() => {
                        if (feedback) setFeedback(null);
                        setSelected(selected === i ? null : i);
                      }}
                      className={`rounded-lg border px-4 py-2.5 font-mono text-[13px] transition ${
                        selected === i
                          ? "border-accent/70 bg-accent/15 text-fg"
                          : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      {step.choices[i]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step.kind === "labLink" && (
              <div className="mx-auto w-full max-w-xl">
                <Markdown>{step.body}</Markdown>
                {(() => {
                  const lab = labState[step.labSlug];
                  if (!lab) return null;
                  return (
                    <div className="mt-6 rounded-2xl border border-accent2/30 bg-bg-elev p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent2/90">
                        {m.journey.player.lab.kicker}
                      </p>
                      <p className="mt-1.5 font-display text-xl font-bold tracking-wide text-fg">
                        {lab.title}
                      </p>
                      <p className="mt-1 text-[12.5px] text-muted2">{lab.tagline}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {lab.live ? (
                          <Link
                            href={`/labs/${step.labSlug}`}
                            className="rounded-full border border-accent2/50 bg-accent2/10 px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-accent2 transition hover:bg-accent2/20"
                          >
                            {m.journey.player.lab.cta}
                          </Link>
                        ) : (
                          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                            {m.journey.player.lab.soon}
                          </span>
                        )}
                        {lab.completed && (
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-pop">
                            {m.journey.player.lab.completed}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {step.kind === "exercise" && (
              <div className="mx-auto w-full max-w-xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
                  {m.journey.player.exercise.kicker}
                </p>
                <div className="mt-3">
                  <Markdown>{step.brief}</Markdown>
                </div>
                <div className="mt-4 rounded-xl border border-line bg-bg-elev px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                    {m.journey.player.exercise.rubricLabel}
                  </p>
                  <div className="mt-2 text-[12.5px] leading-relaxed text-muted2">
                    <Markdown>{step.rubric}</Markdown>
                  </div>
                </div>

                {signedIn ? (
                  <>
                    <textarea
                      value={exSpec}
                      rows={9}
                      maxLength={6000}
                      placeholder={m.journey.player.exercise.placeholder}
                      onChange={(e) => {
                        setExSpec(e.target.value);
                        if (exStatus.s === "verdict" && !exStatus.meets)
                          setExStatus({ s: "idle" });
                        try {
                          window.localStorage.setItem(
                            draftKey(conceptSlug),
                            e.target.value,
                          );
                        } catch {}
                      }}
                      className="mt-5 w-full resize-y rounded-xl border border-line bg-bg-elev px-4 py-3 font-mono text-[13px] leading-relaxed text-fg outline-none transition placeholder:text-muted/50 focus:border-gold/50"
                    />
                    {exStatus.s === "error" && (
                      <p className="mt-4 rounded-xl border border-red-400/40 bg-red-400/[0.06] px-5 py-3 text-sm text-red-300">
                        {m.journey.player.exercise[exStatus.reason]}
                      </p>
                    )}
                    {exStatus.s === "verdict" && (
                      <div
                        className={`mt-4 rounded-xl border px-5 py-4 ${
                          exStatus.meets
                            ? "border-pop/50 bg-pop/[0.07]"
                            : "border-red-400/40 bg-red-400/[0.06]"
                        }`}
                      >
                        <p
                          className={`font-mono text-[10px] uppercase tracking-[0.25em] ${
                            exStatus.meets ? "text-pop" : "text-red-300"
                          }`}
                        >
                          {exStatus.meets
                            ? m.journey.player.exercise.passKicker
                            : m.journey.player.exercise.failKicker}
                          {exStatus.xpEarned
                            ? ` · ${fmt(m.journey.player.done.xpEarned, { xp: exStatus.xpEarned })}`
                            : ""}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted2">
                          {exStatus.feedback}
                        </p>
                      </div>
                    )}
                    <div className="mt-5 flex flex-wrap gap-3">
                      {exStatus.s === "verdict" && exStatus.meets ? (
                        <button
                          type="button"
                          onClick={advance}
                          className="rounded-full px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817]"
                          style={{ background: "linear-gradient(180deg, #cfc3ff, #8f7bff)" }}
                        >
                          {m.lesson.continueLabel}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            exStatus.s === "checking" ||
                            exSpec.length < (step.minChars ?? 80)
                          }
                          onClick={submitSpec}
                          className="rounded-full px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#241d06] transition-transform enabled:hover:-translate-y-[1px] disabled:opacity-50"
                          style={{ background: "linear-gradient(180deg, #ecd9a6, #d9b96a)" }}
                        >
                          {exStatus.s === "checking"
                            ? m.journey.player.exercise.checking
                            : exStatus.s === "verdict"
                              ? m.journey.player.exercise.revise
                              : m.journey.player.exercise.submit}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="mt-6 rounded-xl border border-line bg-bg-elev px-5 py-5">
                    <p className="text-sm leading-relaxed text-muted2">
                      {m.journey.player.claim.signedOut}
                    </p>
                    <Link
                      href="/login"
                      className="mt-4 inline-block rounded-full px-7 py-3 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-[#0b0817]"
                      style={{ background: "linear-gradient(180deg, #cfc3ff, #8f7bff)" }}
                    >
                      {m.journey.player.claim.signIn}
                    </Link>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={advance}
                        className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition hover:text-fg"
                      >
                        {m.lesson.continueLabel} →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step.kind === "rustBranch" && (
              <div className="mx-auto w-full max-w-xl">
                <Markdown>{step.body}</Markdown>
                {(() => {
                  const branch = branchState[step.lessonSlug];
                  if (!branch) return null;
                  return (
                    <div className="mt-6 rounded-2xl border border-gold/30 bg-bg-elev p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
                        {m.journey.player.branch.kicker} ·{" "}
                        {m.journey.player.branch.optional}
                      </p>
                      <p className="mt-1.5 font-display text-lg font-bold tracking-wide text-fg">
                        {branch.actTitle}
                      </p>
                      <div className="mt-4">
                        {branch.locked ? (
                          <span className="inline-block rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                            🔒{" "}
                            {fmt(m.journey.player.branch.locked, {
                              numeral: branch.actNumeral,
                            })}
                          </span>
                        ) : (
                          <Link
                            href={`/lessons/${step.lessonSlug}`}
                            className="inline-block rounded-full border border-gold/50 bg-gold/10 px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/20"
                          >
                            {m.journey.player.branch.cta}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── bottom action / feedback sheet (the exercise owns its buttons) ─── */}
      {!atSeal && step.kind !== "exercise" && (
        // The sheet used to be a flat `bg-bg/90` block the width of the
        // reading column. That was invisible while the player had no backdrop
        // — now that it sits on art, it read as a black rectangle floating
        // mid-screen with hard left and right edges. The band is now
        // full-bleed (clipped by `.sc-scene`'s overflow, so no scrollbar) and
        // fades upward into the art instead of butting against it.
        <div className="sticky bottom-0 z-10 -mx-5 mt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-100vmax] bottom-0 top-0 -z-10 border-t border-line/60 bg-bg/80 backdrop-blur"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-100vmax] bottom-full -z-10 h-16 bg-gradient-to-t from-bg/80 to-transparent"
          />
          <div className="px-5 py-4">
          {feedback ? (
            <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-4 sm:flex-1">
                <img
                  src={feedback.correct ? MASCOT_CELEBRATE : MASCOT_ENCOURAGE}
                  alt=""
                  className="h-14 w-14 shrink-0 object-contain"
                />
                <p
                  className={`flex-1 text-sm font-medium ${
                    feedback.correct ? "text-pop" : "text-red-300"
                  }`}
                >
                  {feedback.text}
                </p>
              </div>
              {feedback.correct ? (
                <button
                  type="button"
                  onClick={advance}
                  className="w-full rounded-full px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817] sm:w-auto"
                  style={{ background: "linear-gradient(180deg, #cfc3ff, #8f7bff)" }}
                >
                  {m.lesson.continueLabel}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setFeedback(null);
                  }}
                  className="w-full rounded-full border border-red-400/50 px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-red-300 transition hover:bg-red-400/10 sm:w-auto"
                >
                  {m.lesson.retry}
                </button>
              )}
            </div>
          ) : (
            <div className="mx-auto flex max-w-xl justify-end">
              {step.kind === "quiz" || step.kind === "fill" ? (
                <button
                  type="button"
                  disabled={selected === null}
                  onClick={() => {
                    if (selected === null) return;
                    if (selected === step.answer) {
                      setFeedback({
                        correct: true,
                        text:
                          step.explain ??
                          m.lesson.praise[index % m.lesson.praise.length],
                      });
                    } else {
                      setFeedback({ correct: false, text: m.lesson.incorrect });
                    }
                  }}
                  className="w-full rounded-full px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[1px] disabled:opacity-40 sm:w-auto"
                  style={{
                    background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                    boxShadow: "0 0 24px rgba(143,123,255,0.35)",
                  }}
                >
                  {m.lesson.check}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={advance}
                  className="w-full rounded-full px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[1px] sm:w-auto"
                  style={{
                    background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                    boxShadow: "0 0 24px rgba(143,123,255,0.35)",
                  }}
                >
                  {m.lesson.continueLabel}
                </button>
              )}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
