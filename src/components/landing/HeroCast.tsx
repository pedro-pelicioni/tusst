"use client";

// The landing island's cast: every playable character standing at their own
// spot on the map, each performing the idle action that says who they are —
// the warrior swings, the illusionist casts, the archivist reads, the oracle
// weighs two fates, the phantom fades, the voyager charts, the herald zips the
// sky. Replaces the single wandering walker.
//
// All motion is CSS (`landing.css`, the `ld-act-*` keyframes) so the
// reduced-motion switch there stops everything at once; the only JS is
// projecting each station's image-space point into stage pixels through the
// island layer's object-cover + 6% bleed geometry, so a figure's feet stay on
// the sand at any viewport aspect. Hidden below md, where the copy takes the
// whole frame.

import { useEffect, useRef, useState } from "react";
import { sheetPosition } from "@/lib/hero";

const ISLAND = { width: 2528, height: 1696 };
/** SceneLayers gives parallax layers `inset: -6%` of bleed */
const BLEED = 0.06;

export interface CastMember {
  id: string;
  /** form sheet (4×2), or null while the art hasn't landed */
  sheet: string | null;
  /** accent, for the character's signature effect */
  color: string;
  /** station, in % of the island master (public/landing/hero/island.webp) */
  at: readonly [number, number];
  /** which of the 8 forms to stand here in */
  form: number;
  /** the signature idle action */
  act: "swing" | "cast" | "read" | "weigh" | "fade" | "chart" | "zip";
  /** face left instead of right */
  flip?: boolean;
  /** stagger, so the island does not pulse in unison */
  delay: number;
}

/** Image-space % → stage px, matching the cover fit the browser applies. */
function project(
  x: number,
  y: number,
  stageWidth: number,
  stageHeight: number,
): { left: number; top: number } {
  const boxWidth = stageWidth * (1 + 2 * BLEED);
  const boxHeight = stageHeight * (1 + 2 * BLEED);
  const scale = Math.max(boxWidth / ISLAND.width, boxHeight / ISLAND.height);
  const imageWidth = ISLAND.width * scale;
  const imageHeight = ISLAND.height * scale;
  const originX = (boxWidth - imageWidth) / 2 - BLEED * stageWidth;
  const originY = (boxHeight - imageHeight) / 2 - BLEED * stageHeight;
  return {
    left: originX + (x / 100) * imageWidth,
    top: originY + (y / 100) * imageHeight,
  };
}

export function HeroCast({ cast }: { cast: readonly CastMember[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // ResizeObserver fires once on observe(), so this covers mount too.
    const observer = new ResizeObserver(() => {
      const { offsetWidth, offsetHeight } = stage;
      if (offsetWidth > 0 && offsetHeight > 0) {
        setSize({ w: offsetWidth, h: offsetHeight });
      }
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden
      data-plx={0.08}
      className="ld-plx pointer-events-none absolute inset-0 hidden md:block"
    >
      <div className="absolute inset-0" data-plx-mouse={0.3}>
        {size &&
          cast.map((member) => {
            const { left, top } = project(member.at[0], member.at[1], size.w, size.h);
            return (
              <div
                key={member.id}
                className={`ld-cast ld-act-${member.act}`}
                style={{
                  left,
                  top,
                  // Every effect reads the character's own accent, so the
                  // slash, the flame and the seam are all in their colour.
                  ["--cast-accent" as string]: member.color,
                  animationDelay: `${member.delay}s`,
                }}
              >
                <span
                  className="ld-cast-fx"
                  style={{ animationDelay: `${member.delay}s` }}
                />
                <span
                  className={`ld-cast-body${member.flip ? " is-flipped" : ""}`}
                  style={{ animationDelay: `${member.delay}s` }}
                >
                  {member.sheet ? (
                    <span
                      className="ld-cast-cell"
                      style={{
                        backgroundImage: `url(${member.sheet})`,
                        backgroundPosition: sheetPosition(member.form),
                      }}
                    />
                  ) : (
                    <span
                      className="ld-cast-standin"
                      style={{ background: member.color }}
                    />
                  )}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
