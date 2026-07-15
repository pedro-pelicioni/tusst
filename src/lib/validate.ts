import "server-only";

import { serializeChecks } from "@/content/lesson-checks";
import { getLessonContent } from "@/content/lessons";
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

// Comments are stripped before regex matching so pattern text inside a
// comment doesn't count as a solution. (Sandbox lessons don't need this —
// the AST checks never see comments.)
function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
}

// Trailing-newline tolerant comparison: authored expectedOutput ends with \n,
// the runner caps (and may trim) the captured stdout.
function outputsMatch(actual: string, expected: string): boolean {
  return actual.replace(/\n+$/, "") === expected.replace(/\n+$/, "");
}

export async function gradeSubmission(
  lessonSlug: string,
  code: string,
): Promise<Verdict | undefined> {
  const content = getLessonContent(lessonSlug);
  if (!content) return undefined;

  // Conceptual lessons (Stellar 101 configs, Soroban stubs) aren't runnable
  // Rust programs — they grade on regex checks alone.
  if (content.grader === "regex") {
    const cleaned = stripComments(code);
    const results: CheckResult[] = content.checks.map((check) => {
      const matched = check.pattern.test(cleaned);
      return { name: check.name, passed: check.forbidden ? !matched : matched };
    });
    const passed = results.every((r) => r.passed);
    return { passed, results, output: passed ? content.expectedOutput : "" };
  }

  // Sandbox lessons need the Docker runner; there is no regex fallback
  // anymore (the AST checks live inside the container). RUNNER_MODE=regex
  // environments get an explicit, non-retryable verdict instead of a 503 —
  // it's a configuration state, not a transient failure.
  if (process.env.RUNNER_MODE === "regex") {
    return {
      passed: false,
      results: [{ name: "sandbox grading available", passed: false }],
      output:
        "This lesson is graded in the Docker sandbox, which is not available " +
        "in this environment. Build the image (npm run runner:build) and " +
        "unset RUNNER_MODE=regex.",
    };
  }

  // Real grading: AST checks + compile + run in the hardened sandbox, then
  // compare stdout. All feedback comes back in one container round trip.
  const run = await runInSandbox(code, serializeChecks(content.astChecks));

  if (!run.ok) {
    // Infra trouble, not a wrong answer — the API surfaces a retryable 503.
    return { passed: false, results: [], output: "", infraError: true };
  }

  if (run.specError) {
    // Authoring bug in this lesson's check spec — visible in server logs,
    // never blamed on the student (their checks already report failed).
    console.error(`[validate] check spec error for ${lessonSlug}: ${run.specError}`);
  }

  const results: CheckResult[] = [
    ...run.checks,
    { name: "compiles", passed: run.compiled },
  ];
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
    passed: results.every((r) => r.passed),
    results,
    output: run.stdout,
  };
}
