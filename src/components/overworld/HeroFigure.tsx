"use client";

// The hero as a sprite-sheet cell, or the rune-gem stand-in while the sheet
// hasn't landed. Used inside the map's `.ow-hero`, the tutorial demo, the
// forms gallery and the battle arena — one figure, many stages.

import type { HeroView } from "@/content/overworld/types";
import { hueFromName } from "@/components/CharacterAvatar";
import { sheetPosition } from "@/lib/hero";

export function HeroFigure({
  hero,
  form,
  className = "",
}: {
  hero: HeroView;
  /** override the form shown (gallery / evolution reveal) */
  form?: number;
  className?: string;
}) {
  const cell = form ?? hero.form;
  if (hero.sheet) {
    return (
      <span
        className={`ow-hero-sprite ${className}`}
        style={{
          backgroundImage: `url(${hero.sheet})`,
          backgroundPosition: sheetPosition(cell),
        }}
        aria-hidden
      />
    );
  }
  const hue = hueFromName(hero.id + cell);
  return (
    <span className={`ow-hero-standin ${className}`} aria-hidden>
      <span
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 75% 66%), hsl(${(hue + 60) % 360} 70% 48%))`,
        }}
      >
        <b>{hero.name.trim()[0]?.toUpperCase() ?? "?"}</b>
      </span>
    </span>
  );
}

/** A bust from the portrait sheet, or the initial on a colored tile. */
export function HeroPortrait({
  hero,
  form,
  size = 60,
  className = "",
}: {
  hero: HeroView;
  form?: number;
  size?: number;
  className?: string;
}) {
  const cell = form ?? hero.form;
  if (hero.portraits) {
    return (
      <span
        className={`ow-portrait block ${className}`}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${hero.portraits})`,
          backgroundPosition: sheetPosition(cell),
        }}
        aria-hidden
      />
    );
  }
  const hue = hueFromName(hero.id + cell);
  return (
    <span
      className={`ow-portrait ow-portrait-standin ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${(hue + 60) % 360} 65% 42%))`,
      }}
      aria-hidden
    >
      {hero.name.trim()[0]?.toUpperCase() ?? "?"}
    </span>
  );
}
