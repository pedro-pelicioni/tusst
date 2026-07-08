import "server-only";

import { getLessonContent, lessonGrader } from "@/content/lessons";
import { runInSandbox } from "@/lib/runner";

export interface CheckResult {
  name: string;
  passed: boolean;
}

export interface Verdict {
  passed: boolean;
  results: CheckResult[];
  output: string; // safe, user-facing output (program stdout / sanitized rustc)
  /** Sandbox infrastructure failed (docker down, image missing) — retryable. */
  infraError?: boolean;
}

// Comments are stripped before matching so pattern text inside a comment
// doesn't count as a solution.
function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

// Trailing-newline tolerant comparison: authored expectedOutput ends with \n,
// the runner strips the final newline from captured stdout.
function outputsMatch(actual: string, expected: string): boolean {
  return actual.replace(/\n+$/, "") === expected.replace(/\n+$/, "");
}

export async function gradeSubmission(
  lessonSlug: string,
  code: string,
): Promise<Verdict | undefined> {
  const content = getLessonContent(lessonSlug);
  if (!content) return undefined;

  // Structural pre-checks (fast, itemized names). A failure here skips the
  // sandbox entirely — no container is spent on code missing the basics.
  const cleaned = stripComments(code);
  const results: CheckResult[] = content.checks.map((check) => {
    const matched = check.pattern.test(cleaned);
    return { name: check.name, passed: check.forbidden ? !matched : matched };
  });
  const structuralPass = results.every((r) => r.passed);

  // RUNNER_MODE=regex: environments without Docker (Vercel serverless, local
  // dev without the image) grade on structural checks only — no container is
  // ever attempted.
  const regexOnly =
    lessonGrader(lessonSlug) === "regex" ||
    process.env.RUNNER_MODE === "regex";

  if (regexOnly || !structuralPass) {
    return {
      passed: structuralPass,
      results,
      output: structuralPass ? content.expectedOutput : "",
    };
  }

  // Real grading: compile + run in the hardened sandbox, compare stdout.
  const run = await runInSandbox(code);

  if (!run.ok) {
    // Infra trouble, not a wrong answer — the API surfaces a retryable 503.
    return { passed: false, results, output: "", infraError: true };
  }

  results.push({ name: "compiles", passed: run.compiled });
  if (!run.compiled) {
    return { passed: false, results, output: run.compileError };
  }

  if (run.timedOut) {
    results.push({ name: "runs within the time limit", passed: false });
    return { passed: false, results, output: "" };
  }

  const outputOk = run.ran && outputsMatch(run.stdout, content.expectedOutput);
  results.push({ name: "produces the expected output", passed: outputOk });

  return {
    passed: outputOk,
    results,
    output: run.stdout,
  };
}
