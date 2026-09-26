"use client";

// The landing island's cast: every playable character walking their own road
// on the map, and stopping at the end of it to do the thing that defines them
// — the warrior swings, the illusionist hurls fire, the archivist reads, the
// oracle weighs two fates, the phantom phases out, the voyager reads the
// stars, the herald zips the sky shut. Then they turn and walk back.
//
// The animation is frame-by-frame, not transforms: each character's
// anim.webp is a 4×2 sheet (row 0 a walk cycle, row 1 the action) and
// landing.css steps through it. All motion is CSS, so the reduced-motion
// switch there stops the whole island at once. The only JS is projecting each
// road's image-space points into stage pixels through the island layer's
// object-cover + 6% bleed geometry, so feet stay on the path at any viewport
// aspect. Hidden below md, where the copy takes the whole frame.

import { useEffect, useRef, useState } from "react";

const ISLAND = { width: 2528, height: 1696 };
/** SceneLayers gives parallax layers `inset: -6%` of bleed */
const BLEED = 0.06;

export interface CastMember {
  id: string;
  /** 4×2 animation sheet, or null while the art hasn't landed */
  anim: string | null;
  /** accent, for the stand-in */
  color: string;
  /** the road, in % of the island master (public/landing/hero/island.webp) */
  road: readonly (readonly [number, number])[];
  /** negative seconds into the loop, so the island never moves in unison */
  delay: number;
}

/** `path()` data, in stage px, for a road projected through the cover fit. */
function roadPath(
  road: CastMember["road"],
  stageWidth: number,
  stageHeight: number,
): string {
  const boxWidth = stageWidth * (1 + 2 * BLEED);
  const boxHeight = stageHeight * (1 + 2 * BLEED);
  const scale = Math.max(boxWidth / ISLAND.width, boxHeight / ISLAND.height);
  const imageWidth = ISLAND.width * scale;
  const imageHeight = ISLAND.height * scale;
  const originX = (boxWidth - imageWidth) / 2 - BLEED * stageWidth;
  const originY = (boxHeight - imageHeight) / 2 - BLEED * stageHeight;
  return road
    .map(([x, y], i) => {
      const px = (originX + (x / 100) * imageWidth).toFixed(1);
      const py = (originY + (y / 100) * imageHeight).toFixed(1);
      return `${i === 0 ? "M" : "L"}${px} ${py}`;
    })
    .join(" ");
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
        {cast.map((member) => {
          const path = size ? roadPath(member.road, size.w, size.h) : null;
          // One delay drives every layer, so walking, facing, stepping and the
          // walk/act swap stay locked to the same moment of the loop.
          const delay = { animationDelay: `${member.delay}s` };
          return (
            <div
              key={member.id}
              className={`ld-cast${path ? " is-ready" : ""}`}
              style={{
                ...(path ? { offsetPath: `path("${path}")` } : {}),
                ...delay,
              }}
            >
              <span className="ld-cast-figure" style={delay}>
                {member.anim ? (
                  <>
                    <span
                      className="ld-cast-frames ld-cast-walk"
                      style={{ backgroundImage: `url(${member.anim})`, ...delay }}
                    />
                    <span
                      className="ld-cast-frames ld-cast-act"
                      style={{ backgroundImage: `url(${member.anim})`, ...delay }}
                    />
                  </>
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
