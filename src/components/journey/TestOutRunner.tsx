"use client";

// The test-out paper. Questions arrive from the API without their answers and
// are marked there too, so nothing in this component knows what is correct —
// it collects DISPLAY positions and posts them. One question per screen, same
// rhythm as the chapter player, minus the feedback sheet: a paper tells you
// how you did at the end, not as you go.

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";

interface Paper {
  nonce: string;
  questions: { question: string; options: string[] }[];
  allowedWrong: number;
}

interface Result {
  passed: boolean;
  correct: number;
  total: number;
  sealed: string[];
  xp?: { earned: number; total: number; level: number; leveledUp: boolean };
}

type Phase =
  | { s: "loading" }
  | { s: "unavailable" }
  | { s: "paper"; paper: Paper }
  | { s: "marking"; paper: Paper }
  | { s: "signedOut"; paper: Paper }
  | { s: "done"; result: Result };

export function TestOutRunner({
  scope,
  target,
  title,
  readHref,
  sealArt,
  signedIn,
  chapterTitles,
}: {
  scope: "chapter" | "arc";
  target: string;
  title: string;
  /** where "read it instead" goes — the chapter, or the arc's first chapter */
  readHref: string;
  sealArt: string | null;
  signedIn: boolean;
  /** slug → title, for naming what a passing paper sealed */
  chapterTitles: Record<string, string>;
}) {
  const messages = useMessages();
  const t = messages.journey.testOut;

  const [phase, setPhase] = useState<Phase>({ s: "loading" });
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);

  // Fetch only — no setState, so the mount effect below can await it before
  // touching state (react-hooks/set-state-in-effect).
  const fetchPaper = useCallback(async (): Promise<Paper | null> => {
    try {
      const res = await fetch(
        `/api/journey/test-out?scope=${scope}&target=${encodeURIComponent(target)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return null;
      return (await res.json()) as Paper;
    } catch {
      return null;
    }
  }, [scope, target]);

  const applyPaper = useCallback((paper: Paper | null) => {
    setIndex(0);
    if (!paper) {
      setPicks([]);
      setPhase({ s: "unavailable" });
      return;
    }
    setPicks(new Array(paper.questions.length).fill(-1));
    setPhase({ s: "paper", paper });
  }, []);

  /** The retry button: user-initiated, so the loading state is wanted here. */
  const drawPaper = useCallback(async () => {
    setPhase({ s: "loading" });
    applyPaper(await fetchPaper());
  }, [fetchPaper, applyPaper]);

  useEffect(() => {
    let alive = true;
    void fetchPaper().then((paper) => {
      if (alive) applyPaper(paper);
    });
    return () => {
      alive = false;
    };
  }, [fetchPaper, applyPaper]);

  const submit = async (paper: Paper, finalPicks: number[]) => {
    setPhase({ s: "marking", paper });
    try {
      const res = await fetch("/api/journey/test-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope,
          target,
          nonce: paper.nonce,
          picks: finalPicks,
        }),
      });
      if (res.status === 401) return setPhase({ s: "signedOut", paper });
      if (!res.ok) return setPhase({ s: "unavailable" });
      setPhase({ s: "done", result: (await res.json()) as Result });
    } catch {
      setPhase({ s: "unavailable" });
    }
  };

  const choose = (paper: Paper, display: number) => {
    const next = [...picks];
    next[index] = display;
    setPicks(next);
    if (index + 1 < paper.questions.length) {
      window.setTimeout(() => setIndex((i) => i + 1), 200);
    } else {
      window.setTimeout(() => void submit(paper, next), 200);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div className="relative mx-auto w-full max-w-2xl px-5 pb-24 pt-14">
      <div className="flex items-center gap-4">
        {sealArt && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={sealArt} alt="" className="h-12 w-12 shrink-0 object-contain" />
        )}
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-soft">
            {scope === "arc" ? t.arcKicker : t.chapterKicker}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-wide text-fg">
            {fmt(scope === "arc" ? t.arcTitle : t.chapterTitle, { title })}
          </h1>
        </div>
      </div>
      {children}
    </div>
  );

  if (phase.s === "loading") {
    return shell(
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-muted2">
        …
      </p>,
    );
  }

  if (phase.s === "unavailable") {
    return shell(
      <div className="mt-10">
        <p className="text-sm leading-relaxed text-muted">{t.unavailable}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void drawPaper()}
            className="sc-door rounded-xl border border-line bg-bg-elev px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg"
          >
            {t.tryAgain}
          </button>
          <Link
            href="/journey"
            className="rounded-xl border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2"
          >
            {t.backToMap}
          </Link>
        </div>
      </div>,
    );
  }

  if (phase.s === "done") {
    const { result } = phase;
    const names = result.sealed
      .map((slug) => chapterTitles[slug] ?? slug)
      .join(" · ");
    return shell(
      <div className="mt-10">
        <p
          className={`font-mono text-[10px] uppercase tracking-[0.3em] ${
            result.passed ? "text-pop" : "text-muted2"
          }`}
        >
          {result.passed ? t.passKicker : t.failKicker}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {result.passed
            ? fmt(t.passBody, {
                correct: result.correct,
                total: result.total,
                chapters: names,
              })
            : fmt(t.failBody, {
                correct: result.correct,
                total: result.total,
              })}
        </p>
        {result.passed && result.xp && result.xp.earned > 0 && (
          <p className="mt-2 font-mono text-[12px] tracking-[0.14em] text-gold">
            {fmt(messages.journey.player.done.xpEarned, { xp: result.xp.earned })}
            {result.xp.leveledUp
              ? ` · ${fmt(messages.journey.player.done.levelUp, { level: result.xp.level })}`
              : ""}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/journey"
            className="sc-door rounded-xl border border-accent/50 bg-accent/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-soft"
          >
            {t.backToMap}
          </Link>
          {!result.passed && (
            <>
              <Link
                href={readHref}
                className="rounded-xl border border-line bg-bg-elev px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg"
              >
                {scope === "arc" ? t.readArcInstead : t.readInstead}
              </Link>
              <button
                type="button"
                onClick={() => void drawPaper()}
                className="rounded-xl border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2"
              >
                {t.tryAgain}
              </button>
            </>
          )}
        </div>
      </div>,
    );
  }

  const { paper } = phase;
  const q = paper.questions[index];
  const percent = Math.round((index / paper.questions.length) * 100);

  return shell(
    <div className="mt-8">
      <p className="text-[12.5px] leading-relaxed text-muted">
        {scope === "arc"
          ? paper.allowedWrong > 0
            ? fmt(t.arcBlurb, {
                count: paper.questions.length,
                allowed: paper.allowedWrong,
              })
            : fmt(t.arcBlurbStrict, { count: paper.questions.length })
          : fmt(t.chapterBlurb, { count: paper.questions.length })}
      </p>

      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted2">
        {fmt(t.question, {
          current: index + 1,
          total: paper.questions.length,
        })}
      </p>

      <div className="mt-8">
        <Markdown>{q.question}</Markdown>
        <div className="mt-6 flex flex-col gap-3">
          {q.options.map((opt, display) => (
            <button
              key={display}
              type="button"
              disabled={phase.s !== "paper"}
              onClick={() => choose(paper, display)}
              className={`rounded-xl border px-5 py-3.5 text-left text-[13.5px] leading-relaxed transition ${
                picks[index] === display
                  ? "border-accent/70 bg-accent/15 text-fg"
                  : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {phase.s === "marking" && (
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted2">
          {t.checking}
        </p>
      )}
      {phase.s === "signedOut" && (
        <div className="mt-6">
          <p className="text-sm text-muted">{t.signedOut}</p>
          <Link
            href="/login"
            className="mt-3 inline-block rounded-xl border border-accent/50 bg-accent/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-soft"
          >
            {t.signIn}
          </Link>
        </div>
      )}
      {!signedIn && phase.s === "paper" && (
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted2">
          {t.signedOut}
        </p>
      )}
    </div>,
  );
}
