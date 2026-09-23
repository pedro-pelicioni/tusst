// The hero wearing what they bought. No per-hero sprite surgery: the hero's
// own portrait cell is drawn untouched by <HeroPortrait> and the three worn
// pieces are DOM-layered around it — weapon at the sword hand, mascot at the
// heel, equipment as a shoulder badge — plus an aura tinted by the rarest
// piece in the loadout. One layout serves all three heroes and every future
// item, and a missing sheet degrades to the rune plate instead of a gap.

import type { HeroView } from "@/content/overworld/types";
import { ARMORY_RARITIES } from "@/content/armory";
import { HeroPortrait } from "./HeroFigure";
import { ItemSprite } from "./ItemSprite";
import type { ArmorySlotView } from "@/lib/armory-view";
// Both stylesheets on purpose: the pieces are styled by armory.css, but the
// portrait underneath them is a .ow-portrait cell from overworld.css — a
// surface that imports only one of the two (e.g. /profile) would draw a
// smoothed, borderless, stretched hero.
import "./overworld.css";
import "./armory.css";

export function LoadoutFigure({
  hero,
  slots,
  size = 128,
}: {
  hero: HeroView;
  slots: readonly ArmorySlotView[];
  size?: number;
}) {
  const worn = slots
    .map((s) => (s.equipped ? { ...s.equipped, sheet: s.sheet } : null))
    .filter((v): v is NonNullable<typeof v> => v !== null);

  // The aura takes its colour from the rarest thing being worn.
  const best = worn.reduce<(typeof worn)[number] | null>(
    (top, piece) =>
      !top || ARMORY_RARITIES.indexOf(piece.rarity) > ARMORY_RARITIES.indexOf(top.rarity)
        ? piece
        : top,
    null,
  );

  const pieceSize = Math.round(size * 0.42);

  return (
    <span className="ow-loadout" style={{ width: size, height: size }}>
      {best && (
        <span
          className="ow-loadout-aura"
          style={{
            background: `radial-gradient(circle, ${best.color}33 0%, transparent 70%)`,
          }}
        />
      )}
      <HeroPortrait hero={hero} size={size} />
      {worn.map((piece) => (
        <span
          key={piece.id}
          className={`ow-loadout-slot ow-loadout-${piece.slot}`}
          style={{ width: pieceSize, height: pieceSize }}
        >
          <ItemSprite
            cell={piece.cell}
            slot={piece.slot}
            sheet={piece.sheet}
            color={piece.color}
            size={pieceSize}
          />
        </span>
      ))}
    </span>
  );
}
