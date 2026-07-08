"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Editor, { type OnMount } from "@monaco-editor/react";

interface CheckResult {
  name: string;
  passed: boolean;
}

type RunStatus = "idle" | "running" | "pass" | "fail" | "error";

const draftKey = (slug: string) => `tusst:draft:${slug}`;

export function LessonPlayer({
  lessonSlug,
  starterCode,
  nextHref,
  signedIn,
  allowAnonymous = false,
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
  /** Step-player mode: called when the user continues after a pass. */
  onPass?: () => void;
  editorHeight?: string;
  /** Display name of the edited file (e.g. lib.rs, star-chart.toml). */
  fileName?: string;
  /** Monaco language id for highlighting. */
  language?: string;
}) {
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
      setMessage("Sign in to run your code and save progress.");
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
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setResults(data.results ?? []);
      setOutput(data.output ?? "");
      setStatus(data.passed ? "pass" : "fail");
      if (data.passed && signedIn) router.refresh();
    } catch {
      if (fresh()) {
        setStatus("error");
        setMessage("Network error — try again.");
      }
    } finally {
      inFlightRef.current = false;
    }
  }, [lessonSlug, signedIn, allowAnonymous, router]);

  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

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
  };

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
              reset
            </button>
            <button
              type="button"
              onClick={run}
              disabled={status === "running"}
              className="rounded-md border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
            >
              {status === "running" ? "running…" : "run ⌘⏎"}
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
              loading editor…
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
          <span className="font-mono text-[11px] text-muted">output</span>
          <span
            className={`font-mono text-[11px] uppercase tracking-wider ${
              status === "pass"
                ? "text-pop"
                : status === "fail" || status === "error"
                  ? "text-red-400"
                  : "text-muted"
            }`}
          >
            {status === "idle" ? "idle" : status}
          </span>
        </div>
        <div className="min-h-[120px] px-4 py-3 font-mono text-[12.5px] leading-relaxed">
          {status === "idle" && (
            <p className="text-muted">
              {"// run your code to check it against the tests (⌘⏎)"}
            </p>
          )}
          {status === "running" && <p className="text-muted2">compiling…</p>}
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

          {status === "pass" && (
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-muted">{"// stdout"}</p>
              <pre className="mt-1 whitespace-pre-wrap text-fg">{output}</pre>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-pop">
                  {signedIn
                    ? "all checks passed — progress saved"
                    : "all checks passed"}
                </span>
                {onPass ? (
                  <button
                    type="button"
                    onClick={onPass}
                    className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent transition hover:bg-accent/20"
                  >
                    continue ›
                  </button>
                ) : (
                  nextHref && (
                    <Link
                      href={nextHref}
                      className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent transition hover:bg-accent/20"
                    >
                      next lesson ›
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
