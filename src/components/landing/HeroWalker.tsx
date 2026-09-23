"use client";

// The landing hero's wandering sprite: a hero figure walking the Journey
// island's west shore road from the beach up to the watchtower and back,
// forever. All motion is CSS (`ld-hero-walk` animates `offset-distance`,
// `ld-hero-face` flips the figure for the return trip, `ld-hero-bob` is
// the 2-frame walk cycle) so the reduced-motion switch in landing.css
// stops everything; the only JS work is turning the road's image-space
// points into a px path that matches the island layer's object-cover + 6%
// bleed geometry, so the figure's feet stay on the sand at any viewport
// aspect. Hidden below md.

import { useEffect, useRef, useState } from "react";

/** the west shore road, in % of the island master
 *  (public/landing/hero/island.webp): from the beach by the fishing pier
 *  north past the village houses to the watchtower crossroads. It stays
 *  on the island's western third, clear of the centered copy block. */
const ROAD: readonly (readonly [number, number])[] = [
  [24, 63], // sand between the red houses and the palms
  [23.5, 57], // the beach road below the houses
  [26, 47], // up the west road
  [26.5, 38], // past the ruins
  [28.5, 29.5], // the crossroads by the watchtower
];

const ISLAND = { width: 2528, height: 1696 };
/** SceneLayers gives parallax layers `inset: -6%` of bleed */
const BLEED = 0.06;

/** `path()` data, in px of the stage, for the road projected through the
 *  island layer's cover fit (same math the browser applies to the image). */
function roadPath(stageWidth: number, stageHeight: number): string {
  const boxWidth = stageWidth * (1 + 2 * BLEED);
  const boxHeight = stageHeight * (1 + 2 * BLEED);
  const scale = Math.max(boxWidth / ISLAND.width, boxHeight / ISLAND.height);
  const imageWidth = ISLAND.width * scale;
  const imageHeight = ISLAND.height * scale;
  const originX = (boxWidth - imageWidth) / 2 - BLEED * stageWidth;
  const originY = (boxHeight - imageHeight) / 2 - BLEED * stageHeight;
  return ROAD.map(([x, y], i) => {
    const px = (originX + (x / 100) * imageWidth).toFixed(1);
    const py = (originY + (y / 100) * imageHeight).toFixed(1);
    return `${i === 0 ? "M" : "L"}${px} ${py}`;
  }).join(" ");
}

export function HeroWalker({
  /** hero form sheet (4×2), or null while the art hasn't landed */
  sheet,
}: {
  sheet: string | null;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // ResizeObserver delivers an initial notification on observe(), so
    // this covers mount as well as every later resize.
    const observer = new ResizeObserver(() => {
      const { offsetWidth, offsetHeight } = stage;
      if (offsetWidth > 0 && offsetHeight > 0) {
        setPath(roadPath(offsetWidth, offsetHeight));
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
      className="ld-plx ld-hero-stage pointer-events-none absolute inset-0 hidden md:block"
    >
      <div className="absolute inset-0" data-plx-mouse={0.3}>
        <div
          className={`ld-hero-walker ${path ? "is-ready" : ""}`}
          style={path ? { offsetPath: `path("${path}")` } : undefined}
        >
          <div className="ld-hero-face">
            {sheet ? (
              <span
                className="ld-hero-body ld-hero-bob ld-hero-cell"
                style={{ backgroundImage: `url(${sheet})` }}
              />
            ) : (
              <span className="ld-hero-body ld-hero-bob ld-hero-standin">
                <b>T</b>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
