import { readFileSync } from "node:fs";
import { acts, cards } from "../src/content/campaign";
import { es as campaignEs } from "../src/content/i18n/es";
import { fr as campaignFr } from "../src/content/i18n/fr";
import { pt as campaignPt } from "../src/content/i18n/pt";
import { journeyChapters } from "../src/content/journey";
import { esJourneyText } from "../src/content/journey/i18n/es";
import { frJourneyText } from "../src/content/journey/i18n/fr";
import { ptJourneyText } from "../src/content/journey/i18n/pt";
import type { JourneyConceptText } from "../src/content/journey/i18n/types";
import { labs } from "../src/content/labs";
import { LAB_TEXT } from "../src/content/labs/i18n";
import type {
  LabStepText,
  LabTextOverlay,
} from "../src/content/labs/localize";
import type { LabStep } from "../src/content/labs/types";
import { getLessonSteps } from "../src/content/steps";

const errors: string[] = [];

function check(condition: unknown, message: string) {
  if (!condition) errors.push(message);
}

// A diagram's `view` is an OBJECT, so it cannot ride the flat stable-field
// list below — a === comparison would always fail. Instead we compare its
// SKELETON: every prose string collapses to "§", while the strings that are
// really structure (kinds, ids, edge endpoints, tones) and every number
// (coordinates, weights) are kept verbatim. A translator may rewrite labels
// freely; dropping a node, renaming an edge target or switching the diagram
// type fails the build.
const STRUCTURAL_KEYS = new Set([
  "kind",
  "id",
  "from",
  "to",
  "tone",
  "style",
  "shape",
  "layout",
  "component",
]);

function skeleton(value: unknown, key?: string): unknown {
  if (typeof value === "string") {
    return key && STRUCTURAL_KEYS.has(key) ? value : "§";
  }
  if (Array.isArray(value)) return value.map((item) => skeleton(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, skeleton(v, k)]),
    );
  }
  return value;
}

function keys(value: object): string[] {
  return Object.keys(value).sort();
}

function sameKeys(
  actual: object,
  expected: object,
  label: string,
) {
  const actualKeys = keys(actual);
  const expectedKeys = keys(expected);
  check(
    JSON.stringify(actualKeys) === JSON.stringify(expectedKeys),
    `${label}: keys differ (actual ${actualKeys.length}, expected ${expectedKeys.length})`,
  );
}

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

function checkPlaceholders(
  source: unknown,
  translated: unknown,
  label: string,
) {
  const expected = placeholders(source).sort();
  const actual = placeholders(translated).sort();
  check(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label}: placeholders differ (${actual.join(", ")} vs ${expected.join(", ")})`,
  );
}

const translatedJourneys = {
  pt: ptJourneyText,
  es: esJourneyText,
  fr: frJourneyText,
} satisfies Record<string, Record<string, JourneyConceptText>>;

for (const [locale, translated] of Object.entries(translatedJourneys)) {
  const translatedBySlug = translated as Record<
    string,
    JourneyConceptText | undefined
  >;
  const expectedSlugs = Object.fromEntries(
    journeyChapters.map((chapter) => [chapter.meta.slug, true]),
  );
  sameKeys(translated, expectedSlugs, `journey/${locale}`);

  for (const source of journeyChapters) {
    const slug = source.meta.slug;
    const target = translatedBySlug[slug];
    if (!target) continue;
    check(target.title.trim() !== "", `journey/${locale}/${slug}: empty title`);
    check(
      target.tagline.trim() !== "",
      `journey/${locale}/${slug}: empty tagline`,
    );
    if (source.meta.status !== "live") continue;
    check(
      target.steps?.length === source.steps.length,
      `journey/${locale}/${slug}: expected ${source.steps.length} steps, got ${target.steps?.length ?? 0}`,
    );
    if (!target.steps || target.steps.length !== source.steps.length) continue;

    source.steps.forEach((sourceStep, index) => {
      const targetStep = target.steps![index];
      const label = `journey/${locale}/${slug}/${index}`;
      check(
        targetStep.kind === sourceStep.kind,
        `${label}: kind changed (${targetStep.kind} vs ${sourceStep.kind})`,
      );
      checkPlaceholders(sourceStep, targetStep, label);

      if ("view" in sourceStep) {
        const sourceView = (sourceStep as { view: unknown }).view;
        const targetView = (targetStep as { view?: unknown }).view;
        check(
          JSON.stringify(skeleton(sourceView)) ===
            JSON.stringify(skeleton(targetView)),
          `${label}: diagram structure changed`,
        );
      }

      for (const field of [
        "answer",
        "component",
        "labSlug",
        "lessonSlug",
        "mode",
        "minChars",
        "file",
      ] as const) {
        if (field in sourceStep) {
          check(
            field in targetStep &&
              targetStep[field as keyof typeof targetStep] ===
                sourceStep[field as keyof typeof sourceStep],
            `${label}: stable field ${field} changed`,
          );
        }
      }
    });
  }
}

const labTextFields = [
  "body",
  "title",
  "cta",
  "successBody",
  "question",
  "options",
  "explain",
  "prompt",
  "placeholder",
  "hint",
] as const;

function textByStep(
  overlay: LabTextOverlay,
): Record<string, LabStepText> {
  if (!overlay.steps) return {};
  if (!Array.isArray(overlay.steps)) return overlay.steps;
  return Object.fromEntries(overlay.steps.map((step) => [step.id, step]));
}

function sourceText(step: LabStep): LabStepText {
  const result: LabStepText = {};
  for (const field of labTextFields) {
    if (field in step) {
      result[field] = step[field as keyof LabStep] as never;
    }
  }
  return result;
}

for (const locale of ["pt", "es", "fr"] as const) {
  const translated = LAB_TEXT[locale] as Record<
    string,
    LabTextOverlay | undefined
  >;
  const expectedSlugs = Object.fromEntries(labs.map((lab) => [lab.meta.slug, true]));
  sameKeys(translated, expectedSlugs, `labs/${locale}`);

  for (const lab of labs) {
    const slug = lab.meta.slug;
    const overlay = translated[slug];
    if (!overlay) continue;
    check(
      typeof overlay.meta?.title === "string" && overlay.meta.title.trim() !== "",
      `labs/${locale}/${slug}: missing title`,
    );
    check(
      typeof overlay.meta?.tagline === "string" &&
        overlay.meta.tagline.trim() !== "",
      `labs/${locale}/${slug}: missing tagline`,
    );
    if (lab.meta.status !== "live") continue;

    const translatedSteps = textByStep(overlay);
    const expectedSteps = Object.fromEntries(lab.steps.map((step) => [step.id, true]));
    sameKeys(translatedSteps, expectedSteps, `labs/${locale}/${slug}/steps`);

    for (const step of lab.steps) {
      const target = translatedSteps[step.id];
      if (!target) continue;
      const expectedText = sourceText(step);
      for (const field of Object.keys(expectedText) as (keyof LabStepText)[]) {
        check(
          target[field] !== undefined,
          `labs/${locale}/${slug}/${step.id}: missing ${String(field)}`,
        );
        if (field === "options") {
          const sourceOptions = expectedText.options;
          const targetOptions = target.options;
          check(
            Array.isArray(sourceOptions) &&
              Array.isArray(targetOptions) &&
              targetOptions.length === sourceOptions.length,
            `labs/${locale}/${slug}/${step.id}: option count changed`,
          );
          if (
            Array.isArray(sourceOptions) &&
            Array.isArray(targetOptions) &&
            typeof sourceOptions[0] === "object" &&
            typeof targetOptions[0] === "object"
          ) {
            sourceOptions.forEach((option, index) => {
              check(
                typeof option === "object" &&
                  typeof targetOptions[index] === "object" &&
                  targetOptions[index].value === option.value,
                `labs/${locale}/${slug}/${step.id}: option ${index} value changed`,
              );
            });
          }
        }
      }
      checkPlaceholders(
        expectedText,
        target,
        `labs/${locale}/${slug}/${step.id}`,
      );
    }
  }
}

const translatedCampaigns = {
  pt: campaignPt,
  es: campaignEs,
  fr: campaignFr,
};
const lessonSlugs = acts.flatMap((act) =>
  act.skirmishes.map((skirmish) => skirmish.lessonSlug),
);
const trackSlugs = acts.map((act) => act.trackSlug);
const cardIds = cards.map((card) => card.id);

function localizedInstructionSlugs(locale: string): Record<string, true> {
  const file = readFileSync(
    new URL(`../src/content/i18n/${locale}/lessons.ts`, import.meta.url),
    "utf8",
  );
  return Object.fromEntries(
    [...file.matchAll(/^  "([^"]+)": \{/gm)].map((match) => [
      match[1],
      true,
    ]),
  );
}

for (const [locale, content] of Object.entries(translatedCampaigns)) {
  const instructionSlugs = localizedInstructionSlugs(locale);
  const expectedLessonSlugs = Object.fromEntries(
    lessonSlugs.map((slug) => [slug, true]),
  );
  sameKeys(
    instructionSlugs,
    expectedLessonSlugs,
    `campaign/${locale}/instructions`,
  );

  for (const slug of lessonSlugs) {
    check(slug in content.steps, `campaign/${locale}: missing steps for ${slug}`);
    check(
      slug in content.skirmishText,
      `campaign/${locale}: missing skirmish ${slug}`,
    );
    check(
      slug in content.lessonTitles,
      `campaign/${locale}: missing lesson title ${slug}`,
    );

    const sourceSteps = getLessonSteps(slug);
    const targetSteps = content.steps[slug];
    check(Boolean(sourceSteps), `campaign/source: missing steps for ${slug}`);
    if (!sourceSteps || !targetSteps) continue;
    check(
      targetSteps.length === sourceSteps.length,
      `campaign/${locale}/${slug}: expected ${sourceSteps.length} steps, got ${targetSteps.length}`,
    );
    if (targetSteps.length !== sourceSteps.length) continue;

    sourceSteps.forEach((sourceStep, index) => {
      const targetStep = targetSteps[index];
      const label = `campaign/${locale}/${slug}/${index}`;
      check(
        targetStep.kind === sourceStep.kind,
        `${label}: kind changed (${targetStep.kind} vs ${sourceStep.kind})`,
      );
      checkPlaceholders(sourceStep, targetStep, label);

      if ("answer" in sourceStep) {
        check(
          "answer" in targetStep && targetStep.answer === sourceStep.answer,
          `${label}: answer changed`,
        );
      }
      if (sourceStep.kind === "quiz" && targetStep.kind === "quiz") {
        check(
          targetStep.options.length === sourceStep.options.length,
          `${label}: option count changed`,
        );
      }
      if (sourceStep.kind === "fill" && targetStep.kind === "fill") {
        check(targetStep.file === sourceStep.file, `${label}: file changed`);
        check(
          JSON.stringify(targetStep.choices) ===
            JSON.stringify(sourceStep.choices),
          `${label}: executable choices changed`,
        );
      }
      if ("image" in sourceStep && sourceStep.image) {
        check(
          "image" in targetStep && targetStep.image === sourceStep.image,
          `${label}: image changed`,
        );
      }
    });
  }
  for (const slug of trackSlugs) {
    check(slug in content.actText, `campaign/${locale}: missing act ${slug}`);
    check(slug in content.trackText, `campaign/${locale}: missing track ${slug}`);
  }
  for (const id of cardIds) {
    check(id in content.cardText, `campaign/${locale}: missing card ${id}`);
  }
}

if (errors.length > 0) {
  console.error(`i18n coverage failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `i18n coverage OK: ${journeyChapters.length} Journey chapters, ${labs.length} Labs, ${lessonSlugs.length} Campaign lessons × 3 translated locales.`,
);
