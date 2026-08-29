import type { DiagramTone } from "@/content/visuals/types";

// Tones resolve to the app's design tokens — never to hex literals. (ScpSim
// predates this and copied #8f7bff/#45d6c4/#d9b96a by value; new visuals do
// not, so a token change reaches them.)

export const TONE_CLASS: Record<DiagramTone, string> = {
  neutral: "border-line bg-white/[0.03] text-muted2",
  accent: "border-accent/40 bg-accent/[0.08] text-accent",
  teal: "border-accent2/40 bg-accent2/[0.08] text-accent2",
  gold: "border-gold/40 bg-gold/[0.08] text-gold",
  good: "border-pop/45 bg-pop/[0.08] text-pop",
  bad: "border-ember/45 bg-ember/[0.08] text-ember",
};

/** SVG needs paint values, not utility classes — the same tokens, by var. */
export const TONE_VAR: Record<DiagramTone, string> = {
  neutral: "var(--muted-2)",
  accent: "var(--accent)",
  teal: "var(--accent-2)",
  gold: "var(--gold)",
  good: "var(--pop)",
  bad: "var(--ember)",
};

export function toneClass(tone: DiagramTone = "neutral"): string {
  return TONE_CLASS[tone];
}

export function toneVar(tone: DiagramTone = "neutral"): string {
  return TONE_VAR[tone];
}
