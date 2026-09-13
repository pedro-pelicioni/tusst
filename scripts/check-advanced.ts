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
// It also holds the pt/es/fr overlays to the English source: every lesson
// translated, and every translation structurally identical to its original —
// same step kinds, same answer indexes, byte-identical ```text``` output
// blocks and executable `choices`.
//
// Run: npm run check:advanced   (needs a local rustc for section 5 and cargo
// for section 6; each skips with a clear warning if its toolchain is missing,
// so the structural checks still guard CI)
//
// Env switches, both for the translation loop and both off by default:
//   ADVANCED_I18N_PARTIAL=1    a lesson missing from an overlay is a warning
//                              instead of an error (while a locale is being
//                              filled in)
//   ADVANCED_STRUCTURAL_ONLY=1 skip sections 5–6 even when the Rust toolchain
//                              is present (nothing in a translation can change
//                              a reference solution)

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { serializeChecks } from "../src/content/lesson-checks";
import { advancedTracks, advancedLessonSlugs } from "../src/content/advanced/curriculum";
import { advancedSteps } from "../src/content/advanced/steps";
import { advancedGraders } from "../src/content/advanced/graders";
import type { LessonStep } from "../src/content/steps";
import { ptAdvancedSteps } from "../src/content/advanced/i18n/pt";
import { esAdvancedSteps } from "../src/content/advanced/i18n/es";
import { frAdvancedSteps } from "../src/content/advanced/i18n/fr";
import { ptAdvancedInstructions } from "../src/content/advanced/i18n/pt/instructions";
import { esAdvancedInstructions } from "../src/content/advanced/i18n/es/instructions";
import { frAdvancedInstructions } from "../src/content/advanced/i18n/fr/instructions";
import {
  ptAdvancedLessonText,
  ptAdvancedTrackText,
} from "../src/content/advanced/i18n/pt/curriculum";
import {
  esAdvancedLessonText,
  esAdvancedTrackText,
} from "../src/content/advanced/i18n/es/curriculum";
import {
  frAdvancedLessonText,
  frAdvancedTrackText,
} from "../src/content/advanced/i18n/fr/curriculum";

const PARTIAL_OVERLAYS = process.env.ADVANCED_I18N_PARTIAL === "1";
const STRUCTURAL_ONLY = process.env.ADVANCED_STRUCTURAL_ONLY === "1";

const errors: string[] = [];
const warnings: string[] = [];

function check(condition: unknown, message: string) {
  if (!condition) errors.push(message);
}

// A missing translation: an error once a locale ships, a warning while it is
// being filled in.
function missing(message: string) {
  if (PARTIAL_OVERLAYS) warnings.push(message);
  else errors.push(message);
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
// 4. Locale overlay parity (EN is the source of truth; pt/es/fr must match)
// ---------------------------------------------------------------------------
//
// A translation may change every word of prose and nothing else. The bits a
// translator can break without noticing are exactly the bits the grader and
// the step player depend on: the answer index, the executable `choices`, the
// ```text``` block the reader is told to reproduce byte for byte, and the
// `{placeholder}` names inside format strings.

// Copied from scripts/check-i18n.ts — that script is not importable, it runs
// the whole campaign check on import.
function placeholders(value: unknown): string[] {
  if (typeof value === "string") {
    return [...value.matchAll(/\{[A-Za-z_][A-Za-z0-9_]*\}/g)].map(
      (match) => match[0],
    );
  }
  if (Array.isArray(value)) return value.flatMap(placeholders);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(placeholders);
  }
  return [];
}

function checkPlaceholders(source: unknown, translated: unknown, label: string) {
  const expected = placeholders(source).sort();
  const actual = placeholders(translated).sort();
  check(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label}: placeholders differ (${actual.join(", ")} vs ${expected.join(", ")})`,
  );
}

// Every ```text``` fence in a markdown string, in order.
function textBlocks(markdown: string): string[] {
  return [...markdown.matchAll(/```text\n([\s\S]*?)```/g)].map((m) => m[1]);
}

// In an editor intro and in the grader instructions a ```text``` block IS the
// expected output — the runner compares stdout byte for byte, so a translated
// (or even re-wrapped) block promises the reader the wrong bytes. In a theory
// step the same fence usually holds a diagram, which a translator may and
// should localize; there only the block count has to survive.
function checkTextBlocks(source: string, translated: string, label: string) {
  check(
    JSON.stringify(textBlocks(translated)) === JSON.stringify(textBlocks(source)),
    `${label}: a \`\`\`text\`\`\` output block changed`,
  );
}

function checkTextBlockCount(source: string, translated: string, label: string) {
  check(
    textBlocks(translated).length === textBlocks(source).length,
    `${label}: \`\`\`text\`\`\` block count changed`,
  );
}

// Fill-step code may translate its `//` comments and nothing else. The blank
// can sit inside a comment (before = "// ", after = "the rest of the line"),
// so the two halves are compared as one joined line.
function stripLineComments(code: string): string {
  return code.replace(/\/\/.*$/gm, "").replace(/[ \t]+$/gm, "");
}

function fillCode(step: { before: string; after: string }): string {
  return stripLineComments(`${step.before}___${step.after}`);
}

// The prose of a step, keyed by field, for the "still English" heuristic.
function proseFields(step: LessonStep): Record<string, string> {
  switch (step.kind) {
    case "theory":
      return { body: step.body };
    case "quiz":
      return {
        question: step.question,
        ...Object.fromEntries(step.options.map((o, i) => [`options[${i}]`, o])),
        ...(step.explain ? { explain: step.explain } : {}),
      };
    case "fill":
      return {
        prompt: step.prompt,
        ...(step.explain ? { explain: step.explain } : {}),
      };
    case "editor":
      return { intro: step.intro };
  }
}

function allProse(step: LessonStep): string {
  return Object.values(proseFields(step)).join("\n");
}

// Short fields (a code-only quiz option like `Rc<RefCell<T>>`) legitimately
// stay identical across locales; a sentence does not.
function looksUntranslated(source: string, translated: string): boolean {
  return source === translated && source.length > 40 && /[A-Za-z]{4,}\s+[A-Za-z]{3,}/.test(source);
}

const OVERLAYS = [
  {
    locale: "pt",
    steps: ptAdvancedSteps,
    instructions: ptAdvancedInstructions,
    tracks: ptAdvancedTrackText,
    lessons: ptAdvancedLessonText,
  },
  {
    locale: "es",
    steps: esAdvancedSteps,
    instructions: esAdvancedInstructions,
    tracks: esAdvancedTrackText,
    lessons: esAdvancedLessonText,
  },
  {
    locale: "fr",
    steps: frAdvancedSteps,
    instructions: frAdvancedInstructions,
    tracks: frAdvancedTrackText,
    lessons: frAdvancedLessonText,
  },
] as const;

const coverage: string[] = [];

for (const overlay of OVERLAYS) {
  const { locale } = overlay;
  let stepsDone = 0;
  let instructionsDone = 0;

  // 4a. Steps
  for (const [slug, steps] of Object.entries(advancedSteps)) {
    const target = overlay.steps[slug];
    if (!target) {
      missing(`${locale}/${slug}: no ${locale} steps yet`);
      continue;
    }
    stepsDone++;
    check(
      target.length === steps.length,
      `${locale}/${slug}: expected ${steps.length} steps, got ${target.length}`,
    );
    if (target.length !== steps.length) continue;

    steps.forEach((source, i) => {
      const translated = target[i];
      const label = `${locale}/${slug}/${i}`;
      check(translated.kind === source.kind, `${label}: kind changed`);
      if (translated.kind !== source.kind) return;

      checkPlaceholders(source, translated, label);
      if (source.kind === "editor") {
        checkTextBlocks(allProse(source), allProse(translated), label);
      } else {
        checkTextBlockCount(allProse(source), allProse(translated), label);
      }

      if (source.kind === "quiz" && translated.kind === "quiz") {
        check(translated.answer === source.answer, `${label}: quiz answer changed`);
        check(
          translated.options.length === source.options.length,
          `${label}: option count changed`,
        );
      }
      if (source.kind === "fill" && translated.kind === "fill") {
        check(translated.answer === source.answer, `${label}: fill answer changed`);
        // Choices are code, not prose — translating them breaks the exercise.
        check(
          JSON.stringify(translated.choices) === JSON.stringify(source.choices),
          `${label}: executable choices were translated`,
        );
        check(translated.file === source.file, `${label}: file changed`);
        check(
          fillCode(translated) === fillCode(source),
          `${label}: fill code changed (only // comments may be translated)`,
        );
      }
      if (source.kind === "theory" && translated.kind === "theory") {
        check(translated.image === source.image, `${label}: image changed`);
      }

      const sourceProse = proseFields(source);
      const translatedProse = proseFields(translated);
      for (const [field, text] of Object.entries(sourceProse)) {
        if (looksUntranslated(text, translatedProse[field] ?? "")) {
          warnings.push(`${label}: ${field} is identical to English`);
        }
      }
    });
  }
  for (const slug of Object.keys(overlay.steps)) {
    check(slug in advancedSteps, `${locale}/${slug}: translation for an unknown lesson`);
  }

  // 4b. Instructions
  for (const [slug, content] of Object.entries(advancedGraders)) {
    const translated = overlay.instructions[slug]?.instructions;
    if (translated === undefined) {
      missing(`${locale}/${slug}: no ${locale} instructions yet`);
      continue;
    }
    instructionsDone++;
    const label = `${locale}/${slug}/instructions`;
    check(translated.trim() !== "", `${label}: empty`);
    check(translated !== content.instructions, `${label}: identical to English`);
    checkTextBlocks(content.instructions, translated, label);
    checkPlaceholders(content.instructions, translated, label);
  }
  for (const slug of Object.keys(overlay.instructions)) {
    check(slug in advancedGraders, `${locale}/${slug}: instructions for an unknown lesson`);
  }

  // 4c. Curriculum
  let tracksDone = 0;
  for (const track of advancedTracks) {
    const text = overlay.tracks[track.slug];
    if (!text) {
      missing(`${locale}/${track.slug}: no ${locale} track text yet`);
      continue;
    }
    tracksDone++;
    const label = `${locale}/${track.slug}/track`;
    check(text.title.trim() !== "", `${label}: empty title`);
    check(text.description.trim() !== "", `${label}: empty description`);
    check(text.serves.trim() !== "", `${label}: empty serves`);
    check(
      (text.syllabus?.length ?? 0) === (track.syllabus?.length ?? 0),
      `${label}: syllabus length differs from English`,
    );
    if (looksUntranslated(track.description, text.description)) {
      warnings.push(`${label}: description is identical to English`);
    }
  }
  for (const slug of Object.keys(overlay.tracks)) {
    check(
      advancedTracks.some((t) => t.slug === slug),
      `${locale}/${slug}: track text for an unknown track`,
    );
  }
  let lessonsDone = 0;
  for (const track of advancedTracks) {
    for (const lesson of track.lessons) {
      const text = overlay.lessons[lesson.slug];
      if (!text) {
        missing(`${locale}/${lesson.slug}: no ${locale} lesson title yet`);
        continue;
      }
      lessonsDone++;
      const label = `${locale}/${lesson.slug}/lesson`;
      check(text.title.trim() !== "", `${label}: empty title`);
      check(text.summary.trim() !== "", `${label}: empty summary`);
      if (looksUntranslated(lesson.summary, text.summary)) {
        warnings.push(`${label}: summary is identical to English`);
      }
    }
  }
  for (const slug of Object.keys(overlay.lessons)) {
    check(curriculumSlugs.has(slug), `${locale}/${slug}: lesson text for an unknown lesson`);
  }

  coverage.push(
    `${locale}: ${stepsDone}/${advancedLessonSlugs.length} steps, ${instructionsDone}/${Object.keys(advancedGraders).length} instructions, ${tracksDone}/${advancedTracks.length} tracks, ${lessonsDone}/${advancedLessonSlugs.length} lesson titles`,
  );
}

// ---------------------------------------------------------------------------
// 5. The real check: compile and run every reference solution
// ---------------------------------------------------------------------------

if (STRUCTURAL_ONLY) {
  warnings.push("ADVANCED_STRUCTURAL_ONLY=1 — skipped compiling reference solutions");
} else if (!hasRustc()) {
  warnings.push(
    "rustc not found — skipped compiling reference solutions (structure was still checked)",
  );
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
    warnings.push(
      `runner workspace not found at ${RUNNER_DIR} — skipped AST-check verification`,
    );
    return null;
  }

  const debugBin = join(RUNNER_DIR, "target", "debug", "tusst-checkfile");
  const releaseBin = join(RUNNER_DIR, "target", "release", "tusst-checkfile");

  if (!hasCargo()) {
    // No cargo, but a previous build may have left the binary behind.
    const prebuilt = [releaseBin, debugBin].find((p) => existsSync(p));
    if (prebuilt) return prebuilt;
    warnings.push(
      "cargo not found — skipped AST-check verification (structure and reference solutions were still checked)",
    );
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
    warnings.push(
      `could not build tusst-checkfile — skipped AST-check verification\n${(build.stderr || "").trim().split("\n").slice(0, 8).join("\n")}`,
    );
    return null;
  }
  return existsSync(debugBin) ? debugBin : null;
}

const checkfile = STRUCTURAL_ONLY ? null : resolveCheckfile();

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
    console.log(`evaluated AST checks for ${verified} lesson(s)`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------

for (const warning of warnings) console.warn(`! ${warning}`);

if (errors.length > 0) {
  console.error(`\nadvanced content check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const line of coverage) console.log(`overlay ${line}`);
const active = advancedTracks.filter((t) => t.status === "active");
console.log(
  `advanced content OK: ${active.length} active track(s), ${advancedLessonSlugs.length} lessons, ${advancedTracks.length - active.length} track(s) declared.`,
);
