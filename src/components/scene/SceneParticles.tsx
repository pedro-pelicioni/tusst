// Server component: ambient drifting particles for v2 scenes — the landing's
// Particles with sc- classes and v2 tone palettes. Deterministic arrays (no
// Math.random) so SSR HTML is stable.

import type { CSSProperties } from "react";

interface Mote {
  x: number;
  dur: number;
  delay: number;
  size: number;
  sway: number;
}

const PATTERN: Mote[] = [
  { x: 6, dur: 19, delay: -3, size: 5, sway: 5.2 },
  { x: 14, dur: 15, delay: -9, size: 4, sway: 4.1 },
  { x: 23, dur: 22, delay: -14, size: 6, sway: 6.3 },
  { x: 31, dur: 17, delay: -5, size: 3, sway: 3.8 },
  { x: 42, dur: 21, delay: -11, size: 5, sway: 5.7 },
  { x: 51, dur: 14, delay: -2, size: 4, sway: 4.4 },
  { x: 60, dur: 23, delay: -17, size: 6, sway: 6.8 },
  { x: 68, dur: 16, delay: -7, size: 3, sway: 3.5 },
  { x: 77, dur: 20, delay: -12, size: 5, sway: 5.0 },
  { x: 84, dur: 15, delay: -4, size: 4, sway: 4.7 },
  { x: 91, dur: 24, delay: -19, size: 6, sway: 6.1 },
  { x: 97, dur: 18, delay: -8, size: 3, sway: 4.0 },
];

const TONES: Record<"hall" | "forge" | "journey", string[]> = {
  hall: [
    "rgba(217, 185, 106, 0.85)",
    "rgba(207, 195, 255, 0.8)",
    "rgba(255, 255, 255, 0.7)",
  ],
  forge: [
    "rgba(69, 214, 196, 0.85)",
    "rgba(217, 185, 106, 0.8)",
    "rgba(207, 195, 255, 0.6)",
  ],
  journey: [
    "rgba(207, 195, 255, 0.9)",
    "rgba(106, 168, 255, 0.75)",
    "rgba(255, 255, 255, 0.7)",
  ],
};

export function SceneParticles({
  tone,
  count = 12,
}: {
  tone: keyof typeof TONES;
  count?: number;
}) {
  const palette = TONES[tone];
  return (
    <div className="sc-particles" aria-hidden>
      {PATTERN.slice(0, count).map((mote, i) => (
        <span
          key={i}
          className="sc-mote"
          style={
            {
              "--x": `${mote.x}%`,
              "--dur": `${mote.dur}s`,
              "--delay": `${mote.delay}s`,
            } as CSSProperties
          }
        >
          <span
            className="sc-mote-dot"
            style={
              {
                "--sz": `${mote.size}px`,
                "--sway": `${10 + mote.size * 2}px`,
                "--sway-dur": `${mote.sway}s`,
                "--clr": palette[i % palette.length],
              } as CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}
