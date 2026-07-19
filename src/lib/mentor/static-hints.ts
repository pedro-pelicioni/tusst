import "server-only";

// The authored "### Hints" section of a lesson's instructions, in every
// locale the content ships in. Used twice, in opposite directions:
//   - extractStaticHints: the graceful-degradation payload when the LLM is
//     over quota or unreachable;
//   - stripHintsSection: removed from the mentor prompt so the model adds
//     to the static hints instead of parroting them.
const HINT_HEADINGS = ["Hints", "Dicas", "Pistas", "Indices", "Astuces", "Consejos"];

const headingRe = () =>
  new RegExp(String.raw`^###\s+(?:${HINT_HEADINGS.join("|")})\s*$`, "im");

// Section body runs from the heading to the next heading of any level.
function sectionBounds(
  instructions: string,
): { start: number; bodyStart: number; end: number } | null {
  const match = headingRe().exec(instructions);
  if (!match) return null;
  const bodyStart = match.index + match[0].length;
  const next = /^#{1,6}\s/m.exec(instructions.slice(bodyStart));
  const end = next ? bodyStart + next.index : instructions.length;
  return { start: match.index, bodyStart, end };
}

export function extractStaticHints(instructions: string): string | null {
  const bounds = sectionBounds(instructions);
  if (!bounds) return null;
  const body = instructions.slice(bounds.bodyStart, bounds.end).trim();
  return body === "" ? null : body;
}

export function stripHintsSection(instructions: string): string {
  const bounds = sectionBounds(instructions);
  if (!bounds) return instructions;
  return (
    instructions.slice(0, bounds.start) + instructions.slice(bounds.end)
  ).trim();
}
