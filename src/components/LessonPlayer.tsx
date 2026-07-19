"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Markdown } from "@/components/Markdown";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";

interface CheckResult {
  name: string;
  passed: boolean;
}

// AI mentor panel: idle → loading → one of shown (a hint for the latest
// failed run), limited (daily quota) or unavailable (LLM offline) — the
// last two fall back to the lesson's authored hints when it has any.
type MentorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "shown"; hint: string; remaining: number }
  | { status: "limited"; staticHints: string | null }
  | { status: "unavailable"; staticHints: string | null };

/** Reward payload — present only when a pass credits the lesson's gold. */
interface GoldReward {
  earned: number;
  total: number;
  firstReveal: boolean;
}

type RunStatus = "idle" | "running" | "pass" | "fail" | "error";

const draftKey = (slug: string) => `tusst:draft:${slug}`;

export function LessonPlayer({
  lessonSlug,
  starterCode,
  nextHref,
  signedIn,
  allowAnonymous = false,
  mentorEnabled = false,
  onPass,
  editorHeight = "420px",
  fileName = "main.rs",
  language = "rust",
}: {
  lessonSlug: string;
  starterCode: string;
  nextHref: string | null;
  signedIn: boolean;
  /** Trial lessons can be run without an account (progress isn't saved). */
  allowAnonymous?: boolean;
  /** AI mentor hints — server-gated (signed in + MENTOR_API_KEY set). */
  mentorEnabled?: boolean;
  /** Step-player mode: called when the user continues after a pass. */
  onPass?: () => void;
  editorHeight?: string;
  /** Display name of the edited file (e.g. lib.rs, star-chart.toml). */
  fileName?: string;
  /** Monaco language id for highlighting. */
  language?: string;
}) {
  const m = useMessages();
  // Lazy init restores any saved draft (client only; SSR sees starterCode —
  // safe because the editor value is never serialized into server HTML).
  const [code, setCode] = useState(() => {
    if (typeof window === "undefined") return starterCode;
    return window.localStorage.getItem(draftKey(lessonSlug)) ?? starterCode;
  });
  const [status, setStatus] = useState<RunStatus>("idle");
  const [results, setResults] = useState<CheckResult[]>([]);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [gold, setGold] = useState<GoldReward | null>(null);
  const [mentor, setMentor] = useState<MentorState>({ status: "idle" });
  const router = useRouter();

  // codeRef mirrors the editor value for the run handler; it is only written
  // from handlers (React 19 forbids ref writes during render).
  const codeRef = useRef(code);

  // Concurrency guards: the ⌘⏎ Monaco command bypasses the disabled button,
  // so re-entrancy is blocked with a ref (state is stale inside callbacks),
  // and each run is tagged so late responses can't clobber newer state
  // (e.g. a slow fail overwriting a fast pass, or a reset).
  const inFlightRef = useRef(false);
  const runIdRef = useRef(0);

  const run = useCallback(async () => {
    if (!signedIn && !allowAnonymous) {
      setStatus("error");
      setMessage(m.lesson.signInToRun);
      return;
    }
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    const runId = ++runIdRef.current;
    const fresh = () => runId === runIdRef.current;

    setStatus("running");
    setMessage("");
    setResults([]);
    setOutput("");
    setGold(null);
    setMentor({ status: "idle" });
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonSlug, code: codeRef.current }),
      });
      const data = await res.json();
      if (!fresh()) return;
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? m.lesson.genericError);
        return;
      }
      setResults(data.results ?? []);
      setOutput(data.output ?? "");
      setGold(data.gold ?? null);
      setStatus(data.passed ? "pass" : "fail");
      // Refresh server components so the header pouch counter picks up the
      // freshly credited gold (and the first-time reveal).
      if (data.passed && signedIn) router.refresh();
    } catch {
      if (fresh()) {
        setStatus("error");
        setMessage(m.lesson.networkError);
      }
    } finally {
      inFlightRef.current = false;
    }
  }, [lessonSlug, signedIn, allowAnonymous, router, m]);

  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  const askMentor = useCallback(async () => {
    // Tagged with the run id so a slow hint can't surface after the student
    // already re-ran (or reset) — same staleness rule as run() itself.
    const runId = runIdRef.current;
    const fresh = () => runId === runIdRef.current;
    setMentor({ status: "loading" });
    try {
      const res = await fetch("/api/mentor/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonSlug }),
      });
      const data = await res.json();
      if (!fresh()) return;
      if (res.ok) {
        setMentor({
          status: "shown",
          hint: data.hint ?? "",
          remaining: data.remaining ?? 0,
        });
      } else if (res.status === 429) {
        setMentor({ status: "limited", staticHints: data.staticHints ?? null });
      } else {
        setMentor({
          status: "unavailable",
          staticHints: data.staticHints ?? null,
        });
      }
    } catch {
      if (fresh()) setMentor({ status: "unavailable", staticHints: null });
    }
  }, [lessonSlug]);

  const onMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme("tusst", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d0d14",
        "editorGutter.background": "#0d0d14",
      },
    });
    monaco.editor.setTheme("tusst");
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () =>
      runRef.current(),
    );
  };

  const onChange = (value: string | undefined) => {
    const v = value ?? "";
    setCode(v);
    codeRef.current = v;
    window.localStorage.setItem(draftKey(lessonSlug), v);
  };

  const reset = () => {
    runIdRef.current++; // discard any in-flight response
    setCode(starterCode);
    codeRef.current = starterCode;
    window.localStorage.removeItem(draftKey(lessonSlug));
    setStatus("idle");
    setResults([]);
    setOutput("");
    setMessage("");
    setGold(null);
    setMentor({ status: "idle" });
  };

  // Which failure the output text belongs to: a compile error (sanitized
  // rustc stderr) or the program's actual stdout on a mismatch. The check
  // names are the server contract from validate.ts.
  const compileFailed = results.some((r) => r.name === "compiles" && !r.passed);
  const outputMismatch = results.some(
    (r) => r.name === "produces the expected output" && !r.passed,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* editor */}
      <div className="overflow-hidden rounded-xl border border-line bg-bg-elev">
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="font-mono text-[11px] text-muted">{fileName}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg"
            >
              {m.lesson.reset}
            </button>
            <button
              type="button"
              onClick={run}
              disabled={status === "running"}
              className="rounded-md border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
            >
              {status === "running" ? m.lesson.running : m.lesson.run}
            </button>
          </div>
        </div>
        <Editor
          height={editorHeight}
          language={language}
          value={code}
          onChange={onChange}
          onMount={onMount}
          theme="vs-dark"
          loading={
            <div
              className="grid w-full place-items-center font-mono text-xs text-muted"
              style={{ height: editorHeight }}
            >
              {m.lesson.loadingEditor}
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 22,
            scrollBeyondLastLine: false,
            tabSize: 4,
            padding: { top: 14 },
            automaticLayout: true,
            renderLineHighlight: "none",
            overviewRulerLanes: 0,
          }}
        />
      </div>

      {/* output */}
      <div className="rounded-xl border border-line bg-bg-elev">
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="font-mono text-[11px] text-muted">
            {m.lesson.output}
          </span>
          <span
            className={`font-mono text-[11px] uppercase tracking-wider ${
              status === "pass"
                ? "text-pop"
                : status === "fail" || status === "error"
                  ? "text-red-400"
                  : "text-muted"
            }`}
          >
            {
              {
                idle: m.lesson.statusIdle,
                running: m.lesson.statusRunning,
                pass: m.lesson.statusPass,
                fail: m.lesson.statusFail,
                error: m.lesson.statusError,
              }[status]
            }
          </span>
        </div>
        <div className="min-h-[120px] px-4 py-3 font-mono text-[12.5px] leading-relaxed">
          {status === "idle" && (
            <p className="text-muted">{m.lesson.idleHint}</p>
          )}
          {status === "running" && (
            <p className="text-muted2">{m.lesson.compiling}</p>
          )}
          {message && <p className="text-red-400">{message}</p>}

          {results.length > 0 && (
            <ul className="flex flex-col gap-1">
              {results.map((r) => (
                <li
                  key={r.name}
                  className={r.passed ? "text-pop" : "text-red-400"}
                >
                  {r.passed ? "✓" : "✗"}{" "}
                  <span className="text-muted2">{r.name}</span>
                </li>
              ))}
            </ul>
          )}

          {status === "fail" && output && (
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-muted">
                {compileFailed
                  ? m.lesson.compilerError
                  : outputMismatch
                    ? m.lesson.actualOutput
                    : m.lesson.details}
              </p>
              <pre className="mt-1 whitespace-pre-wrap text-red-300/90">
                {output}
              </pre>
            </div>
          )}

          {status === "fail" && mentorEnabled && (
            <div className="mt-3 border-t border-line pt-3">
              {(mentor.status === "idle" || mentor.status === "loading") && (
                <button
                  type="button"
                  onClick={askMentor}
                  disabled={mentor.status === "loading"}
                  className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
                >
                  {mentor.status === "loading"
                    ? m.lesson.mentorThinking
                    : <>🧙 {m.lesson.mentorAsk}</>}
                </button>
              )}

              {mentor.status === "shown" && (
                <div className="rounded-xl border border-accent/40 bg-accent/[0.06] px-4 py-3">
                  <p className="text-muted">{m.lesson.mentorTitle}</p>
                  <div className="mt-1">
                    <Markdown>{mentor.hint}</Markdown>
                  </div>
                  <p className="mt-2 text-[11px] text-muted2">
                    {fmt(m.lesson.mentorRemaining, { n: mentor.remaining })}
                  </p>
                </div>
              )}

              {(mentor.status === "limited" ||
                mentor.status === "unavailable") && (
                <div className="rounded-xl border border-line px-4 py-3">
                  <p className="text-muted2">
                    {mentor.status === "limited"
                      ? m.lesson.mentorLimit
                      : m.lesson.mentorUnavailable}
                  </p>
                  {mentor.staticHints && (
                    <div className="mt-1">
                      <Markdown>{mentor.staticHints}</Markdown>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {status === "pass" && (
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-muted">{m.lesson.stdout}</p>
              <pre className="mt-1 whitespace-pre-wrap text-fg">{output}</pre>

              {/* gold reward — only when this pass credited the lesson */}
              {gold && gold.earned > 0 && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#b8873e]/35 bg-[#b8873e]/[0.08] px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/gold-coin.png"
                    alt={m.lesson.goldCoinAlt}
                    className="h-10 w-10 animate-bounce object-contain drop-shadow-[0_0_12px_rgba(184,135,62,0.6)]"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#e0b25f]">
                      {fmt(m.lesson.goldEarned, { gold: gold.earned })}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted2">
                      {gold.firstReveal
                        ? m.lesson.goldFirstReveal
                        : fmt(m.lesson.goldPouch, { total: gold.total })}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <span className="text-pop">
                  {signedIn ? m.lesson.passedSaved : m.lesson.passed}
                </span>
                {onPass ? (
                  <button
                    type="button"
                    onClick={onPass}
                    className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent transition hover:bg-accent/20"
                  >
                    {m.lesson.continueStep}
                  </button>
                ) : (
                  nextHref && (
                    <Link
                      href={nextHref}
                      className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent transition hover:bg-accent/20"
                    >
                      {m.lesson.nextLesson}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
