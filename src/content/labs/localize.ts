import type { LabMeta, LabScenario, LabStep } from "./types";

type ChoiceText = { label: string; value: string; blurb?: string };

export interface LabStepText {
  [key: string]: unknown;
  body?: string;
  title?: string;
  cta?: string;
  successBody?: string;
  question?: string;
  options?: string[] | ChoiceText[];
  explain?: string;
  prompt?: string;
  placeholder?: string;
  hint?: string;
}

export interface LabTextOverlay {
  meta?: Partial<Pick<LabMeta, "title" | "tagline">>;
  steps?:
    | Record<string, LabStepText>
    | Array<LabStepText & { id: string }>;
}

function copyStepText(step: LabStepText): LabStepText {
  const text: LabStepText = {};
  if (typeof step.body === "string") text.body = step.body;
  if (typeof step.title === "string") text.title = step.title;
  if (typeof step.cta === "string") text.cta = step.cta;
  if (typeof step.successBody === "string") text.successBody = step.successBody;
  if (typeof step.question === "string") text.question = step.question;
  if (Array.isArray(step.options)) text.options = step.options;
  if (typeof step.explain === "string") text.explain = step.explain;
  if (typeof step.prompt === "string") text.prompt = step.prompt;
  if (typeof step.placeholder === "string") text.placeholder = step.placeholder;
  if (typeof step.hint === "string") text.hint = step.hint;
  return text;
}

function stepTextById(
  steps: LabTextOverlay["steps"],
): Record<string, LabStepText> | undefined {
  if (!steps) return undefined;
  if (!Array.isArray(steps)) return steps;
  return Object.fromEntries(
    steps.map((step) => [step.id, copyStepText(step)]),
  );
}

/** Extract the English source copy into the same serializable overlay shape. */
export function labTextFromScenario(lab: LabScenario): LabTextOverlay {
  return {
    meta: { title: lab.meta.title, tagline: lab.meta.tagline },
    steps: Object.fromEntries(
      lab.steps.map((step) => {
        return [step.id, copyStepText(step)];
      }),
    ),
  };
}

/** Overlay translated copy without duplicating executable lab actions. */
export function localizeLab(
  lab: LabScenario,
  overlay?: LabTextOverlay,
): LabScenario {
  if (!overlay) return lab;

  const translatedSteps = stepTextById(overlay.steps);

  return {
    ...lab,
    meta: {
      ...lab.meta,
      title: overlay.meta?.title ?? lab.meta.title,
      tagline: overlay.meta?.tagline ?? lab.meta.tagline,
    },
    steps: lab.steps.map((step) => {
      const translated = translatedSteps?.[step.id];
      return translated ? ({ ...step, ...translated } as LabStep) : step;
    }),
  };
}
