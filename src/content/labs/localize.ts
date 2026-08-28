import type { LabMeta, LabScenario, LabStep } from "./types";

type ChoiceText = { label: string; value: string; blurb?: string };

export interface LabStepText {
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
  steps?: Record<string, LabStepText>;
}

/** Extract the English source copy into the same serializable overlay shape. */
export function labTextFromScenario(lab: LabScenario): LabTextOverlay {
  return {
    meta: { title: lab.meta.title, tagline: lab.meta.tagline },
    steps: Object.fromEntries(
      lab.steps.map((step) => {
        const text: LabStepText = {};
        if ("body" in step && step.body !== undefined) text.body = step.body;
        if ("title" in step) text.title = step.title;
        if ("cta" in step) text.cta = step.cta;
        if ("successBody" in step) text.successBody = step.successBody;
        if ("question" in step) text.question = step.question;
        if ("options" in step) text.options = step.options;
        if ("explain" in step && step.explain !== undefined)
          text.explain = step.explain;
        if ("prompt" in step) text.prompt = step.prompt;
        if ("placeholder" in step) text.placeholder = step.placeholder;
        if ("hint" in step && step.hint !== undefined) text.hint = step.hint;
        return [step.id, text];
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

  return {
    ...lab,
    meta: { ...lab.meta, ...overlay.meta },
    steps: lab.steps.map((step) => {
      const translated = overlay.steps?.[step.id];
      return translated ? ({ ...step, ...translated } as LabStep) : step;
    }),
  };
}
