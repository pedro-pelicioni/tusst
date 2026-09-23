/* eslint-disable @next/next/no-img-element */
// The world map: the sea chart with the two islands and two landmarks as
// pixel cards. Server-rendered — nothing moves here except the hover.

import Link from "next/link";
import { preload } from "react-dom";
import "./overworld.css";
import { WORLD_MAP } from "@/content/overworld/world-map";
import type { Point } from "@/content/overworld/types";

export interface WorldDoor {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
  cta: string;
  /** "12 / 33 missions" — omitted for landmarks without progress */
  progress?: { label: string; done: number; total: number };
  tone: "journey" | "campaign" | "forge" | "advanced";
}

const TONE: Record<WorldDoor["tone"], string> = {
  journey: "#8f7bff",
  campaign: "#e07a3a",
  forge: "#45d6c4",
  advanced: "#d9b96a",
};

function DoorCard({ door, pos, large }: { door: WorldDoor; pos: Point; large: boolean }) {
  const pct = door.progress ? Math.round((door.progress.done / Math.max(1, door.progress.total)) * 100) : 0;
  // A card centered on its landmark hangs half its height past the map's edge
  // when the landmark sits near the top or bottom (the harbor at 88%, the
  // forge at 13%). The stage is `overflow: clip`, so a clipped card can never
  // be scrolled into view. Near an edge the card flips to the inward side and
  // the pin moves to whichever face still touches the landmark.
  const anchor = pos[1] >= 68 ? "above" : pos[1] <= 26 ? "below" : "center";
  const placement =
    anchor === "above"
      ? "-translate-y-[calc(100%+18px)]"
      : anchor === "below"
        ? "translate-y-[18px]"
        : "-translate-y-1/2";
  return (
    <Link
      href={door.href}
      className={`ow-door group absolute -translate-x-1/2 ${placement} ${large ? "w-[250px] max-md:w-[200px]" : "w-[190px] max-md:w-[160px]"}`}
      style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
    >
      <span
        className={`ow-door-pin ${anchor === "above" ? "is-below" : ""}`}
        style={{ background: TONE[door.tone], boxShadow: `0 0 18px ${TONE[door.tone]}aa` }}
        aria-hidden
      />
      <span className="ow-panel-parchment block p-3 transition group-hover:-translate-y-0.5 group-hover:brightness-105">
        <span className="ow-eyebrow block text-[#804426]">{door.eyebrow}</span>
        <span className="ow-title mt-1 block text-[#6d2630]">{door.title}</span>
        <span className="ow-door-blurb mt-1 block text-[11.5px] leading-snug text-[#583c27] max-md:hidden">{door.blurb}</span>
        {door.progress && (
          <span className="ow-door-progress mt-2 block">
            <span className="ow-bar block">
              <span style={{ width: `${Math.max(3, pct)}%` }} />
            </span>
            <span className="mt-1 block text-[10px] text-[#75583c]">{door.progress.label}</span>
          </span>
        )}
        <span className={`ow-btn-primary mt-2 ${large ? "" : "!py-2 !text-[10px]"}`}>{door.cta}</span>
      </span>
    </Link>
  );
}

export function WorldMapView({
  imageSrc,
  doors,
  standInLabel,
  children,
}: {
  imageSrc: string | null;
  doors: WorldDoor[];
  standInLabel: string;
  /** HUD children (hero card, title) */
  children?: React.ReactNode;
}) {
  const aspect = WORLD_MAP.image.width / WORLD_MAP.image.height;
  if (imageSrc) preload(imageSrc, { as: "image", fetchPriority: "high" });
  const byId = new Map(WORLD_MAP.nodes.map((n) => [n.id, n]));
  return (
    <div className="ow-shell ow-shell--static">
      <div
        className="ow-world ow-world-static"
        // Sizing lives in CSS (see .ow-world-static) so a media query can
        // override it; an inline width would outrank the stylesheet.
        style={{ ["--ow-aspect" as string]: aspect }}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="" fetchPriority="high" decoding="async" draggable={false} />
        ) : (
          <div className="ow-standin" style={{ background: "radial-gradient(60% 60% at 25% 50%, #4d7d43 0 40%, transparent 41%), radial-gradient(55% 55% at 77% 47%, #6b3a2a 0 40%, transparent 41%), #1b6e86" }} />
        )}
        <div className="ow-vignette" />
        {/* The art itself is the button. Drawn under the cards (z-5 vs z-6)
            so a card click still wins, and hidden from the a11y tree because
            the card is already the labelled link to the same place. */}
        {doors.map((door) => {
          const spot = byId.get(door.id)?.hotspot;
          if (!spot) return null;
          return (
            <Link
              key={`hotspot-${door.id}`}
              href={door.href}
              aria-hidden
              tabIndex={-1}
              className="ow-hotspot"
              style={{
                left: `${spot.cx}%`,
                top: `${spot.cy}%`,
                width: `${spot.rx * 2}%`,
                height: `${spot.ry * 2}%`,
                ["--ow-hotspot-tone" as string]: TONE[door.tone],
              }}
            />
          );
        })}

        {doors.map((door) => {
          const node = byId.get(door.id);
          if (!node) return null;
          return <DoorCard key={door.id} door={door} pos={node.pos} large={node.kind === "island"} />;
        })}
      </div>
      {!imageSrc && <p className="ow-hud ow-eyebrow bottom-4 left-3 text-[#ffe7a6]">{standInLabel}</p>}
      {children}
    </div>
  );
}
