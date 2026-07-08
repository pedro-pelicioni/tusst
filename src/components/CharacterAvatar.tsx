// The player's character. Intentionally shows identity + progression (level),
// but NO economy (no gold, no shop, no inventory) until the hidden currency
// layer is revealed after the first completed lesson.
//
// The avatar is a "rune-gem": a diamond cut with a per-player hue derived
// from the name, bearing the player's initial — every Forgeborn gets their
// own stone, no uploads needed.

export function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
}

export function CharacterAvatar({
  name = "guardian",
  level = 1,
}: {
  name?: string;
  level?: number;
}) {
  const hue = hueFromName(name);
  const initial = (name.trim()[0] ?? "?").toUpperCase();

  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden text-right leading-tight sm:block">
        <div className="font-mono text-[11px] text-muted2">{name}</div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
          lvl {level}
        </div>
      </div>
      <div className="relative grid h-9 w-9 place-items-center" aria-hidden="true">
        {/* the cut stone */}
        <span
          className="absolute h-[26px] w-[26px] rotate-45 rounded-[7px]"
          style={{
            background: `linear-gradient(135deg, hsl(${hue} 75% 66%), hsl(${(hue + 60) % 360} 70% 48%))`,
            boxShadow: `0 0 14px hsl(${hue} 80% 60% / 0.45), inset 0 1px 0 rgba(255,255,255,0.35)`,
          }}
        />
        {/* facet line */}
        <span
          className="absolute h-[26px] w-[26px] rotate-45 rounded-[7px]"
          style={{
            background:
              "linear-gradient(315deg, rgba(0,0,0,0.28) 0%, transparent 45%)",
          }}
        />
        <span className="relative font-display text-[13px] font-extrabold leading-none text-[#0b0817]">
          {initial}
        </span>
      </div>
    </div>
  );
}
