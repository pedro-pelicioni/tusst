/* eslint-disable @next/next/no-img-element */
"use client";

// Mimo/Duolingo-style step player: one bite-sized screen at a time, top
// progress bar, instant feedback sheet, and a mascot celebration at the end.
// The final "editor" step reuses LessonPlayer (server-graded, checks hidden).

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LessonPlayer } from "@/components/LessonPlayer";
import { Markdown } from "@/components/Markdown";
import type { LessonStep } from "@/content/steps";

const MASCOT_CELEBRATE = "/mascot/mascot-celebrate.png";
const MASCOT_ENCOURAGE = "/mascot/mascot-encourage.png";

const PRAISE = ["Well forged!", "That's it!", "The runes approve.", "Flawless."];

type Feedback = { correct: boolean; text: string } | null;

const stepsDoneKey = (slug: string) => `tusst:steps-done:${slug}`;

// A step's answer options in their shuffled display order, plus the index the
// correct answer ended up at once shuffled.
type ShuffledChoices = { displayOrder: string[]; correctIndex: number };

// Fold the option text down to a 32-bit number (FNV-1a) to seed the shuffle.
// We seed off the question's own text rather than Math.random so the shuffle is
// deterministic: the server and the client then produce the exact same order,
// which avoids a React hydration mismatch without needing a client-only effect.
const hashOptionsToSeed = (options: string[]): number => {
  const text = options.join(" ");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

// mulberry32 PRNG: a small deterministic generator. The same seed always yields
// the same sequence of numbers, which is what makes the shuffle reproducible.
const createSeededRandom = (seed: number): (() => number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Authored quiz/fill data always lists the correct option first (the answer
// index is 0 for every question), so without shuffling the whole game is beaten
// by always clicking the top option. This shuffles the options into a stable,
// deterministic order and reports where the correct answer moved to. Theory and
// editor steps have no options and return null.
const shuffleStepChoices = (step: LessonStep): ShuffledChoices | null => {
  let options: string[];
  if (step.kind === "quiz") options = step.options;
  else if (step.kind === "fill") options = step.choices;
  else return null;

  const correctOption = options[step.answer];
  const nextRandom = createSeededRandom(hashOptionsToSeed(options));

  // Fisher-Yates over a copy, so the original authored order stays untouched.
  const displayOrder = [...options];
  for (let i = displayOrder.length - 1; i > 0; i--) {
    const swapWith = Math.floor(nextRandom() * (i + 1));
    [displayOrder[i], displayOrder[swapWith]] = [displayOrder[swapWith], displayOrder[i]];
  }

  return { displayOrder, correctIndex: displayOrder.indexOf(correctOption) };
};

export function LessonSteps({
  lessonSlug,
  steps,
  starterCode,
  nextHref,
  trackHref,
  signedIn,
  allowAnonymous,
  title,
  numeral,
  fileName,
  language,
}: {
  lessonSlug: string;
  steps: LessonStep[];
  starterCode: string;
  nextHref: string | null;
  trackHref: string;
  signedIn: boolean;
  allowAnonymous: boolean;
  title: string;
  numeral?: string;
  fileName?: string;
  language?: string;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [done, setDone] = useState(false);
  // Deterministic per-question shuffle, identical on server and client.
  const shuffledChoicesByStep = useMemo(() => steps.map(shuffleStepChoices), [steps]);

  const total = steps.length;
  // Progress counts the congrats screen as 100%.
  const percent = done ? 100 : Math.round((index / total) * 100);
  const safeIndex = Math.min(index, total - 1);
  const step = steps[safeIndex];
  const shuffledChoices = shuffledChoicesByStep[safeIndex];

  const advance = useCallback(() => {
    setSelected(null);
    setFeedback(null);
    if (index + 1 >= total) {
      setDone(true);
      try {
        window.localStorage.setItem(stepsDoneKey(lessonSlug), "1");
      } catch {}
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, total, lessonSlug]);

  // Enter advances theory steps / confirmed feedback.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (feedback?.correct) advance();
      else if (step.kind === "theory" && !done) advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedback, step, done, advance]);

  const check = (answer: number, explain?: string) => {
    if (selected === null) return;
    if (selected === answer) {
      setFeedback({
        correct: true,
        text: explain ?? PRAISE[index % PRAISE.length],
      });
    } else {
      setFeedback({ correct: false, text: "Not quite — study the rune again." });
    }
  };

  const retry = () => {
    setSelected(null);
    setFeedback(null);
  };

  /* ─── congrats screen ─── */
  if (done) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
        <img
          src={MASCOT_CELEBRATE}
          alt=""
          className="h-44 w-44 object-contain"
          style={{ filter: "drop-shadow(0 0 40px rgba(143,123,255,0.35))" }}
        />
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
          skirmish complete
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-wide text-fg">
          {numeral && <span className="mr-3 text-lg text-accent/70">{numeral}</span>}
          {title}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted2">
          {signedIn
            ? "The beacon flickers a little brighter. Your progress is carved into the Ledgerstone."
            : "The beacon flickers a little brighter — but unwritten runes fade. Create a free account to save your progress and claim your champion cards."}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          {!signedIn && (
            <Link
              href="/login"
              className="rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[2px]"
              style={{
                background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                boxShadow: "0 0 34px rgba(143,123,255,0.4)",
              }}
            >
              Save my progress
            </Link>
          )}
          {signedIn && nextHref && (
            <Link
              href={nextHref}
              className="rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[2px]"
              style={{
                background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                boxShadow: "0 0 34px rgba(143,123,255,0.4)",
              }}
            >
              Next skirmish ›
            </Link>
          )}
          <Link
            href={trackHref}
            className="rounded-full border border-line px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:border-line-strong hover:text-fg"
          >
            Back to the act
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-120px)] max-w-3xl flex-col px-5 py-6">
      {/* ─── top bar: exit + progress ─── */}
      <div className="flex items-center gap-4">
        <Link
          href={trackHref}
          aria-label="Exit lesson"
          className="text-lg leading-none text-muted transition hover:text-fg"
        >
          ✕
        </Link>
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
        <span className="font-mono text-[11px] text-muted">
          {Math.min(index + 1, total)}/{total}
        </span>
      </div>

      {/* ─── step body ─── */}
      <div className="flex flex-1 flex-col justify-start pt-10">
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

        {step.kind === "quiz" && (
          <div className="mx-auto w-full max-w-xl">
            <Markdown>{step.question}</Markdown>
            <div className="mt-6 flex flex-col gap-3">
              {(shuffledChoices?.displayOrder ?? step.options).map((opt, i) => {
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
                    <code className="font-mono text-[13px]">{opt}</code>
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
                  {selected !== null ? (shuffledChoices?.displayOrder ?? step.choices)[selected] : " "}
                </span>
                {step.after}
              </pre>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {(shuffledChoices?.displayOrder ?? step.choices).map((c, i) => (
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
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {step.kind === "editor" && (
          <div className="w-full">
            <div className="mx-auto mb-6 max-w-xl">
              <Markdown>{step.intro}</Markdown>
              {!signedIn && !allowAnonymous && (
                <p className="mt-3 font-mono text-[11px] text-muted">
                  <Link href="/login" className="text-accent hover:underline">
                    sign in
                  </Link>{" "}
                  to run code and save progress
                </p>
              )}
            </div>
            <LessonPlayer
              lessonSlug={lessonSlug}
              starterCode={starterCode}
              nextHref={null}
              signedIn={signedIn}
              allowAnonymous={allowAnonymous}
              onPass={advance}
              editorHeight="300px"
              fileName={fileName}
              language={language}
            />
          </div>
        )}
      </div>

      {/* ─── bottom action / feedback sheet ─── */}
      {step.kind !== "editor" && (
        <div className="sticky bottom-0 -mx-5 mt-10 border-t border-line bg-bg/90 px-5 py-4 backdrop-blur">
          {feedback ? (
            <div className="mx-auto flex max-w-xl items-center gap-4">
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
              {feedback.correct ? (
                <button
                  type="button"
                  onClick={advance}
                  className="rounded-full px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817]"
                  style={{ background: "linear-gradient(180deg, #cfc3ff, #8f7bff)" }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-full border border-red-400/50 px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-red-300 transition hover:bg-red-400/10"
                >
                  Retry
                </button>
              )}
            </div>
          ) : (
            <div className="mx-auto flex max-w-xl justify-end">
              {step.kind === "theory" ? (
                <button
                  type="button"
                  onClick={advance}
                  className="w-full rounded-full px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[1px] sm:w-auto"
                  style={{
                    background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                    boxShadow: "0 0 24px rgba(143,123,255,0.35)",
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={selected === null}
                  onClick={() =>
                    step.kind === "quiz" || step.kind === "fill"
                      ? check(shuffledChoices?.correctIndex ?? step.answer, step.explain)
                      : undefined
                  }
                  className="w-full rounded-full px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[1px] disabled:opacity-40 sm:w-auto"
                  style={{
                    background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                    boxShadow: "0 0 24px rgba(143,123,255,0.35)",
                  }}
                >
                  Check
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
