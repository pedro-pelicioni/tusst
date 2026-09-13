// Verifies the Advanced Path's promise to the reader.
//
// A sandbox lesson makes three claims at once: the AST checks describe a
// solvable shape, the code compiles under `-D warnings`, and stdout matches
// `expectedOutput` byte for byte. Authoring all three by eye ships lessons
// that mark correct code wrong — the single fastest way to lose a senior
// reader, who will assume the platform is broken rather than that they are.
//
// So this compiles every `referenceSolution` with the SAME rustc flags the
// hardened runner uses (runner/crates/tusst-runner/src/compile.rs), runs it,
// and diffs real stdout against the promise — and then evaluates the lesson's
// own `astChecks` against that same solution with the SAME evaluator the
// runner uses (tusst-syntest, driven by the runner/crates/tusst-checkfile
// harness), so a typo'd `expr` or a self-tripping `forbidden` rule cannot ship.
//
// It also checks the structural invariants that make a lesson playable at
// all: steps exist, the flow ends in an `editor` step, curriculum and content
// agree on which lessons exist, and no slug collides with the campaign.
//
// Run: npm run check:advanced   (needs a local rustc for section 5 and cargo
// for section 6; each skips with a clear warning if its toolchain is missing,
// so the structural checks still guard a machine without a Rust toolchain)
//
// Run: npm run check:advanced -- --strict   (CI)
// In strict mode every skip becomes an error, and the script asserts that it
// compiled AND verified every sandbox lesson. Without that assertion a skipped
// section still prints "advanced content OK" and exits 0 — which is exactly
// how a gate ends up guarding nothing while looking green.

import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { serializeChecks } from "../src/content/lesson-checks";
import { advancedTracks, advancedLessonSlugs } from "../src/content/advanced/curriculum";
import { advancedSteps } from "../src/content/advanced/steps";
import { advancedGraders } from "../src/content/advanced/graders";
import { ptAdvancedSteps } from "../src/content/advanced/i18n/pt";
import { ptAdvancedInstructions } from "../src/content/advanced/i18n/pt/instructions";

const STRICT =
  process.argv.includes("--strict") || process.env.CHECK_ADVANCED_STRICT === "1";

const errors: string[] = [];
const warnings: string[] = [];

// Every sandbox lesson must be both compiled (section 5) and evaluated
// (section 6). Tracked at module scope so the assertion at the bottom can see
// them no matter which branch ran.
const sandboxLessons = Object.values(advancedGraders).filter(
  (c) => c.grader === "sandbox",
).length;
let compiledCount = 0;
let verifiedCount = 0;

/**
 * A degradation, not a defect — unless we are in CI, where a toolchain that
 * silently is not there is the whole failure mode this flag exists to catch.
 */
function skip(message: string) {
  if (STRICT) errors.push(`${message} (fatal under --strict)`);
  else warnings.push(message);
}

function check(condition: unknown, message: string) {
  if (!condition) errors.push(message);
}

// Mirrors compile.rs exactly. If that file changes, change this.
const RUSTC_FLAGS = [
  "--edition", "2021",
  "--color", "never",
  "-D", "warnings",
  "-A", "unused_variables",
  "-A", "unused_assignments",
  "-A", "unused_mut",
  "-A", "dead_code",
  "-A", "unused_imports",
];

function hasRustc(): boolean {
  try {
    execFileSync("rustc", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 1. Curriculum ↔ content agreement
// ---------------------------------------------------------------------------

const curriculumSlugs = new Set(advancedLessonSlugs);
const stepSlugs = new Set(Object.keys(advancedSteps));
const graderSlugs = new Set(Object.keys(advancedGraders));

for (const slug of curriculumSlugs) {
  check(stepSlugs.has(slug), `${slug}: in the curriculum but has no authored steps`);
  check(graderSlugs.has(slug), `${slug}: in the curriculum but has no grading data`);
}
for (const slug of stepSlugs) {
  check(curriculumSlugs.has(slug), `${slug}: has steps but is not in the curriculum`);
}
for (const slug of graderSlugs) {
  check(curriculumSlugs.has(slug), `${slug}: has grading data but is not in the curriculum`);
}

// A `soon` track must stay empty — otherwise the index page promises a
// syllabus while the seed quietly creates playable lessons behind it.
for (const track of advancedTracks) {
  if (track.status === "soon") {
    check(
      track.lessons.length === 0,
      `${track.slug}: marked "soon" but carries ${track.lessons.length} lesson(s)`,
    );
    check(
      (track.syllabus?.length ?? 0) > 0,
      `${track.slug}: marked "soon" but publishes no syllabus`,
    );
  } else {
    check(track.lessons.length > 0, `${track.slug}: active with no lessons`);
  }
}

// Slugs are the identity of a Progress row. A collision with the campaign
// would let two different lessons write to the same row.
const campaignSlugPattern =
  /^(rust-fundamentals|control-flow|rust-standard-library|mastering-option|mastering-result|stellar-101|soroban-smart-contracts|stellar-protocol-27)-\d+$/;
for (const slug of curriculumSlugs) {
  check(
    !campaignSlugPattern.test(slug),
    `${slug}: collides with the campaign's slug namespace`,
  );
}

// ---------------------------------------------------------------------------
// 2. Step-flow shape
// ---------------------------------------------------------------------------

for (const [slug, steps] of Object.entries(advancedSteps)) {
  check(steps.length >= 3, `${slug}: only ${steps.length} step(s) — too thin`);

  const last = steps[steps.length - 1];
  check(
    last?.kind === "editor",
    `${slug}: the flow must end in an editor step (ends in "${last?.kind}")`,
  );
  check(
    steps.filter((s) => s.kind === "editor").length === 1,
    `${slug}: expected exactly one editor step`,
  );

  steps.forEach((step, i) => {
    const label = `${slug}/${i}`;
    if (step.kind === "quiz") {
      check(step.options.length >= 2, `${label}: quiz needs at least 2 options`);
      check(
        step.answer >= 0 && step.answer < step.options.length,
        `${label}: quiz answer index ${step.answer} is out of range`,
      );
      check(
        new Set(step.options).size === step.options.length,
        `${label}: quiz has duplicate options`,
      );
    }
    if (step.kind === "fill") {
      check(
        step.answer >= 0 && step.answer < step.choices.length,
        `${label}: fill answer index ${step.answer} is out of range`,
      );
      check(
        new Set(step.choices).size === step.choices.length,
        `${label}: fill has duplicate choices`,
      );
    }
    // The campaign leans on a mascot image for warmth. This path does not —
    // it is the single most visible piece of the narrative layer the readers
    // asked us to drop, so it is a hard error here rather than a taste note.
    if (step.kind === "theory" && step.image) {
      check(false, `${label}: the advanced path carries no mascot art`);
    }
  });
}

// ---------------------------------------------------------------------------
// 3. Grading data
// ---------------------------------------------------------------------------

for (const [slug, content] of Object.entries(advancedGraders)) {
  check(
    content.instructions.trim() !== "",
    `${slug}: empty instructions`,
  );
  check(content.starterCode.trim() !== "", `${slug}: empty starter code`);
  check(
    content.expectedOutput.endsWith("\n"),
    `${slug}: expectedOutput should end with a newline`,
  );
  check(
    content.referenceSolution.trim() !== "",
    `${slug}: missing reference solution`,
  );
  if (content.grader === "sandbox") {
    check(content.astChecks.length > 0, `${slug}: sandbox lesson with no AST checks`);
    for (const c of content.astChecks) {
      check(c.name.trim() !== "", `${slug}: an AST check has no user-facing name`);
    }
  }
  // The reference solution must not leak into what the student is handed.
  check(
    content.starterCode !== content.referenceSolution,
    `${slug}: starter code IS the solution`,
  );
}

// ---------------------------------------------------------------------------
// 4. PT overlay parity (EN is the source of truth; pt must match structurally)
// ---------------------------------------------------------------------------

for (const [slug, steps] of Object.entries(advancedSteps)) {
  const pt = ptAdvancedSteps[slug];
  if (!pt) {
    warnings.push(`${slug}: no pt translation yet`);
    continue;
  }
  check(
    pt.length === steps.length,
    `pt/${slug}: expected ${steps.length} steps, got ${pt.length}`,
  );
  if (pt.length !== steps.length) continue;

  steps.forEach((source, i) => {
    const target = pt[i];
    const label = `pt/${slug}/${i}`;
    check(target.kind === source.kind, `${label}: kind changed`);
    if (source.kind === "quiz" && target.kind === "quiz") {
      check(target.answer === source.answer, `${label}: quiz answer changed`);
      check(
        target.options.length === source.options.length,
        `${label}: option count changed`,
      );
    }
    if (source.kind === "fill" && target.kind === "fill") {
      check(target.answer === source.answer, `${label}: fill answer changed`);
      // Choices are code, not prose — translating them breaks the exercise.
      check(
        JSON.stringify(target.choices) === JSON.stringify(source.choices),
        `${label}: executable choices were translated`,
      );
      check(target.file === source.file, `${label}: file changed`);
    }
  });
}

for (const slug of Object.keys(ptAdvancedSteps)) {
  check(slug in advancedSteps, `pt/${slug}: translation for an unknown lesson`);
}
for (const slug of Object.keys(ptAdvancedInstructions)) {
  check(
    slug in advancedGraders,
    `pt/${slug}: instructions for an unknown lesson`,
  );
}

// ---------------------------------------------------------------------------
// 5. The real check: compile and run every reference solution
// ---------------------------------------------------------------------------

if (!hasRustc()) {
  skip("rustc not found — skipped compiling reference solutions");
} else {
  const dir = mkdtempSync(join(tmpdir(), "tusst-advanced-"));
  let compiled = 0;
  try {
    for (const [slug, content] of Object.entries(advancedGraders)) {
      if (content.grader !== "sandbox") continue;

      const src = join(dir, `${slug}.rs`);
      const bin = join(dir, slug);
      writeFileSync(src, content.referenceSolution);

      const build = spawnSync(
        "rustc",
        [...RUSTC_FLAGS, "-o", bin, src],
        { encoding: "utf8" },
      );
      if (build.status !== 0) {
        errors.push(
          `${slug}: reference solution does not compile\n${(build.stderr || "").trim().split("\n").slice(0, 12).join("\n")}`,
        );
        continue;
      }

      const run = spawnSync(bin, [], { encoding: "utf8", timeout: 10_000 });
      if (run.status !== 0) {
        errors.push(
          `${slug}: reference solution exited ${run.status}${run.stderr ? `\n${run.stderr.trim()}` : ""}`,
        );
        continue;
      }
      if (run.stdout !== content.expectedOutput) {
        errors.push(
          `${slug}: stdout does not match expectedOutput\n  expected: ${JSON.stringify(content.expectedOutput)}\n  actual:   ${JSON.stringify(run.stdout)}`,
        );
        continue;
      }
      compiled++;
    }
    compiledCount = compiled;
    console.log(`compiled and ran ${compiled} reference solution(s)`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// 6. The other half of the promise: AST checks must hold on that solution
// ---------------------------------------------------------------------------
//
// Section 5 proves the reference solution compiles and prints the right bytes.
// It says nothing about the hidden tests. A check with a typo'd `expr`, a
// renamed helper, or a `forbidden` rule the reference solution itself trips
// yields a lesson that marks CORRECT code wrong — and a senior reader will
// conclude the platform is broken rather than that they are.
//
// So run the real evaluator over every lesson's astChecks against its own
// referenceSolution. `runner/crates/tusst-checkfile` is a thin host-side
// driver for `tusst_syntest::evaluate` — the exact code path the sandbox uses,
// minus docker, compilation and the network.

const RUNNER_DIR = join(process.cwd(), "runner");

function hasCargo(): boolean {
  try {
    execFileSync("cargo", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Returns the harness path, or null after pushing a warning — never an error.
// A missing Rust toolchain must degrade exactly like the rustc path above:
// CI without cargo still gets every structural guarantee.
function resolveCheckfile(): string | null {
  if (!existsSync(join(RUNNER_DIR, "Cargo.toml"))) {
    skip(`runner workspace not found at ${RUNNER_DIR} — skipped AST-check verification`);
    return null;
  }

  const debugBin = join(RUNNER_DIR, "target", "debug", "tusst-checkfile");
  const releaseBin = join(RUNNER_DIR, "target", "release", "tusst-checkfile");

  if (!hasCargo()) {
    // No cargo, but a previous build may have left the binary behind. Only
    // trust it if it is newer than every tusst-syntest source: a stale binary
    // would bless all 87 lessons under the OLD normalization, which is the
    // precise failure this section exists to catch.
    const prebuilt = [releaseBin, debugBin].find((p) => existsSync(p));
    if (prebuilt) {
      const srcDir = join(RUNNER_DIR, "crates", "tusst-syntest", "src");
      const newestSource = existsSync(srcDir)
        ? Math.max(
            ...readdirSync(srcDir).map((f) => statSync(join(srcDir, f)).mtimeMs),
          )
        : 0;
      if (statSync(prebuilt).mtimeMs >= newestSource) return prebuilt;
      skip(
        `${prebuilt} is older than tusst-syntest's sources and cargo is unavailable to rebuild it — skipped AST-check verification rather than trust a stale evaluator`,
      );
      return null;
    }
    skip("cargo not found — skipped AST-check verification");
    return null;
  }

  // Always rebuild: a stale binary would evaluate against an old tusst-syntest.
  // Cargo is incremental, so this is a no-op once warm.
  const build = spawnSync(
    "cargo",
    ["build", "--quiet", "-p", "tusst-checkfile"],
    { cwd: RUNNER_DIR, encoding: "utf8", timeout: 600_000 },
  );
  if (build.status !== 0) {
    skip(
      `could not build tusst-checkfile — skipped AST-check verification\n${(build.stderr || "").trim().split("\n").slice(0, 8).join("\n")}`,
    );
    return null;
  }
  if (existsSync(debugBin)) return debugBin;
  // cargo said it built, but the binary is not where we look — CARGO_TARGET_DIR
  // is the usual reason, and it is standard CI cache practice. This was the one
  // bail-out that returned null in silence.
  skip(
    `cargo built tusst-checkfile but no binary at ${debugBin} — CARGO_TARGET_DIR is probably set; skipped AST-check verification`,
  );
  return null;
}

const checkfile = resolveCheckfile();

if (checkfile) {
  const dir = mkdtempSync(join(tmpdir(), "tusst-astchecks-"));
  let verified = 0;
  try {
    for (const [slug, content] of Object.entries(advancedGraders)) {
      if (content.grader !== "sandbox") continue;

      const specPath = join(dir, `${slug}.checks.json`);
      const srcPath = join(dir, `${slug}.ref.rs`);
      // serializeChecks is the exact payload the API pipes to the runner, so
      // a wire-shape drift between TS and serde fails here rather than in prod.
      writeFileSync(specPath, serializeChecks(content.astChecks));
      writeFileSync(srcPath, content.referenceSolution);

      const res = spawnSync(checkfile, [specPath, srcPath, "--json"], {
        encoding: "utf8",
        timeout: 30_000,
      });
      // 0 = all checks hold, 1 = some check failed. Anything else is the
      // harness itself refusing the input (unreadable file, spec the runner's
      // serde would also reject) — a real defect, not a skip.
      if (res.status !== 0 && res.status !== 1) {
        errors.push(
          `${slug}: check harness rejected the spec (exit ${res.status})${res.stderr ? `\n  ${res.stderr.trim()}` : ""}`,
        );
        continue;
      }

      let report: {
        syntax_ok: boolean;
        checks: { name: string; forbidden: boolean; passed: boolean; reason: string; detail: string }[];
      };
      try {
        report = JSON.parse(res.stdout);
      } catch {
        errors.push(`${slug}: could not parse check harness output`);
        continue;
      }

      if (!report.syntax_ok) {
        errors.push(
          `${slug}: reference solution does not parse with syn — every AST check fails for the student too`,
        );
        continue;
      }

      for (const c of report.checks) {
        if (c.passed) continue;
        if (c.reason === "spec_error") {
          errors.push(
            `${slug}: check "${c.name}" is malformed — ${c.detail}. It can never pass.`,
          );
        } else if (c.reason === "forbidden_present") {
          errors.push(
            `${slug}: forbidden check "${c.name}" MATCHES the reference solution — the lesson rejects its own answer`,
          );
        } else {
          errors.push(
            `${slug}: check "${c.name}" does not hold on the reference solution — correct code would be marked wrong`,
          );
        }
      }
      verified++;
    }
    verifiedCount = verified;
    console.log(`evaluated AST checks for ${verified} lesson(s)`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------

// The assertion that makes every skip above impossible to ignore: if a section
// ran but covered fewer lessons than exist, the counts disagree and the build
// fails. A gate that can quietly verify nothing while printing OK is not a gate.
if (STRICT) {
  check(
    compiledCount === sandboxLessons,
    `compiled ${compiledCount} reference solution(s) but ${sandboxLessons} sandbox lesson(s) exist — section 5 did not cover everything`,
  );
  check(
    verifiedCount === sandboxLessons,
    `evaluated AST checks for ${verifiedCount} lesson(s) but ${sandboxLessons} sandbox lesson(s) exist — section 6 did not cover everything`,
  );
}

for (const warning of warnings) console.warn(`! ${warning}`);

if (errors.length > 0) {
  console.error(`\nadvanced content check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const active = advancedTracks.filter((t) => t.status === "active");
console.log(
  `advanced content OK: ${active.length} active track(s), ${advancedLessonSlugs.length} lessons, ` +
    `${advancedTracks.length - active.length} track(s) declared, ` +
    `${compiledCount}/${sandboxLessons} compiled, ${verifiedCount}/${sandboxLessons} AST-verified` +
    (STRICT ? " [strict]" : "") +
    ".",
);
