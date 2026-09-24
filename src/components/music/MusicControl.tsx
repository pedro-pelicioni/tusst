"use client";

// Nav control for the background music: the pixel speaker mutes/unmutes in
// one click, the number next to it opens the 1–100 volume slider. Mounting it
// is what asks the MusicProvider for sound, so music plays exactly on the
// pages that carry the shared Nav — it stays mounted (CSS-hidden) where the
// phone layout moves the controls into the profile menu (<MusicPanel>).

import { useEffect, useState, type CSSProperties } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { MUSIC_TOGGLE_ATTR, VOLUME_MAX, VOLUME_MIN, useMusic } from "./MusicProvider";

// 16×16 pixel grid, drawn as 1-unit squares so it stays crisp at any size.
const px = (cells: [number, number, number?, number?][]) =>
  cells.map(([x, y, w = 1, h = 1]) => `M${x} ${y}h${w}v${h}h${-w}z`).join("");
const SPEAKER = px([[2, 6, 3, 4], [5, 5, 1, 6], [6, 4, 1, 8], [7, 3, 1, 10], [8, 2, 1, 12]]);
const WAVES = [
  px([[10, 6, 1, 4]]),
  px([[11, 3], [12, 4, 1, 8], [11, 12]]),
  px([[13, 1], [14, 2, 1, 12], [13, 14]]),
];
const CROSS = px([
  [10, 5], [11, 6], [12, 7, 2, 2], [14, 9], [15, 10],
  [15, 5], [14, 6], [11, 9], [10, 10],
]);

function PixelSpeaker({ muted, idle, volume }: { muted: boolean; idle: boolean; volume: number }) {
  const waves = volume <= 33 ? 1 : volume <= 66 ? 2 : 3;
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      <path d={SPEAKER} />
      {muted ? (
        <path d={CROSS} className="text-ember" fill="currentColor" />
      ) : (
        <g className={idle ? "opacity-50 motion-safe:animate-pulse" : undefined}>
          {WAVES.slice(0, waves).map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}

function useToggleProps() {
  const m = useMessages().common.music;
  const { muted, status, toggleMute } = useMusic();
  const label = status === "idle" ? m.start : muted ? m.unmute : m.mute;
  return {
    [MUSIC_TOGGLE_ATTR]: "",
    type: "button" as const,
    onClick: toggleMute,
    "aria-label": label,
    title: status === "idle" ? m.idleHint : label,
  };
}

/** Speaker toggle + 1–100 slider: the volume popover body, and the phone row in the profile menu. */
export function MusicPanel() {
  const m = useMessages().common.music;
  const { volume, muted, status, setVolume } = useMusic();
  const toggleProps = useToggleProps();
  const fill = { "--fill": `${((volume - VOLUME_MIN) / (VOLUME_MAX - VOLUME_MIN)) * 100}%` } as CSSProperties;

  return (
    <div className="flex items-center gap-3">
      <button
        {...toggleProps}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line text-muted2 transition hover:border-line-strong hover:text-fg"
      >
        <PixelSpeaker muted={muted} idle={status === "idle"} volume={volume} />
      </button>
      <input
        type="range"
        min={VOLUME_MIN}
        max={VOLUME_MAX}
        step={1}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label={m.volume}
        aria-valuetext={`${volume}%`}
        className={`pixel-range w-full min-w-0 ${muted ? "is-muted" : ""}`}
        style={fill}
      />
      <span className="w-6 shrink-0 text-right font-pixel text-[10px] tabular-nums text-fg">{muted ? "—" : volume}</span>
    </div>
  );
}

/**
 * `phone` — what the bar shows below `sm`: "hidden" when the profile menu
 * carries the controls (signed-in), "mute" for the speaker alone.
 */
export function MusicControl({ phone }: { phone: "hidden" | "mute" }) {
  const m = useMessages().common.music;
  const { volume, muted, status, register } = useMusic();
  const toggleProps = useToggleProps();
  const [open, setOpen] = useState(false);

  useEffect(() => register(), [register]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={phone === "hidden" ? "relative hidden sm:block" : "relative"}>
      <div className="flex items-stretch rounded-md border border-line text-muted2 transition hover:border-line-strong">
        <button {...toggleProps} className="grid place-items-center px-1.5 py-1 transition hover:text-fg">
          <PixelSpeaker muted={muted} idle={status === "idle"} volume={volume} />
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={fmt(m.volumeAria, { value: volume })}
          title={m.volume}
          className={`hidden w-8 border-l border-line py-1 text-center font-pixel text-[10px] tabular-nums transition hover:text-fg sm:block ${
            muted ? "text-muted line-through" : ""
          }`}
        >
          {volume}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] cursor-default"
          />
          <div
            role="dialog"
            aria-label={m.volume}
            className="absolute right-0 z-[95] mt-2 w-64 rounded-lg border border-line bg-[#0b0817]/95 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur"
          >
            <div className="mb-3 font-pixel text-[10px] uppercase tracking-[0.18em] text-muted2">{m.label}</div>
            <MusicPanel />
          </div>
        </>
      )}
    </div>
  );
}
