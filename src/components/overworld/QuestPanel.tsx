"use client";

// The parchment quest panel: the selected mission's card and the one button
// that drives the loop — walk → walking… → enter → revisit. Locked nodes
// (campaign only) show the note and a shortcut to the current mission.

import Link from "next/link";
import { useState } from "react";
import type { NodeState } from "@/content/overworld/types";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";

const LEVEL_KEY = ["foundations", "essential", "advanced"] as const;

export function QuestPanel({
  node,
  near,
  moving,
  currentId,
  onWalk,
  onEnter,
  onGoCurrent,
}: {
  node: NodeState | null;
  near: boolean;
  moving: boolean;
  /** the recommended / current mission id (locked-note shortcut) */
  currentId: string | null;
  onWalk: () => void;
  onEnter: () => void;
  onGoCurrent: () => void;
}) {
  const m = useMessages();
  const q = m.overworld.quest;
  const [collapsed, setCollapsed] = useState(false);
  const [concept, setConcept] = useState(false);
  if (!node) return null;

  const done = node.status === "done";
  const locked = node.status === "locked";
  const soon = node.status === "soon";
  const enterable = !!node.href && !locked && !soon;
  const dock = node.kind === "dock";
  const label =
    node.kind === "fortress" && node.numeral
      ? fmt(q.act, { numeral: node.numeral })
      : node.kind === "waypoint" && node.numeral
        ? fmt(q.skirmish, { numeral: node.numeral })
        : dock
          ? fmt(q.track, { number: node.number })
          : fmt(q.mission, { number: node.number });

  return (
    <aside
      className={`ow-hud ow-panel-parchment right-3 bottom-[76px] w-[285px] max-w-[calc(100vw-24px)] p-4 max-md:right-2 max-md:bottom-16 max-md:w-[min(260px,calc(100vw-120px))] max-md:p-3 ${collapsed ? "is-collapsed" : ""}`}
      aria-live="polite"
    >
      <button
        type="button"
        className="absolute right-2 top-1.5 grid h-7 w-7 place-items-center text-[20px] leading-none text-[#703d2b]"
        aria-label={q.collapse}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
        style={{ transform: collapsed ? "rotate(180deg)" : undefined }}
      >
        ⌄
      </button>
      <div className="flex items-center gap-2 pr-6">
        <span className="ow-eyebrow text-[#804426]">{done ? q.cleared : locked ? q.locked : label}</span>
        {node.group && <span className="ml-auto text-[11px] text-[#75583c]">{node.group}</span>}
      </div>
      <h2 className="ow-title mt-2 text-[#6d2630]">{node.title}</h2>

      {!collapsed && (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#75583c]">
            {node.level !== undefined && (
              <span className="ow-chip">{m.journey.levels[LEVEL_KEY[node.level]]}</span>
            )}
            {node.minutes !== undefined && <span>{fmt(q.minutes, { minutes: node.minutes })}</span>}
            {soon && <span>{q.soon}</span>}
          </div>

          {concept && node.subtitle && (
            <p className="mt-3 text-[12.5px] leading-relaxed text-[#583c27]">{node.subtitle}</p>
          )}

          <div className="mt-3">
            {enterable ? (
              <>
                <div className="flex items-center justify-between pb-2 text-[11px] text-[#77583b]">
                  {/* a dock grants nothing itself — its row is the track's progress */}
                  <span className="ow-eyebrow">{dock ? q.progress : done ? q.earned : q.reward}</span>
                  <strong className="text-[#87372a]">
                    {node.rewardLabel ?? fmt(q.xpReward, { xp: node.xp })}
                  </strong>
                </div>
                {near ? (
                  <button type="button" className="ow-btn-primary" onClick={onEnter}>
                    {dock ? q.openTrack : done ? q.revisit : node.kind === "fortress" ? q.openAct : q.enter}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`ow-btn-primary ${moving ? "is-busy" : ""}`}
                    disabled={moving}
                    onClick={onWalk}
                  >
                    {moving ? q.walking : q.walk}
                  </button>
                )}
                <p className="mt-2 text-[11px] leading-snug text-[#75583c]">
                  {near ? q.arrived : moving ? q.walkingNote : q.walkHint}
                </p>
              </>
            ) : (
              <>
                <p className="mb-2 border border-[#9a713f] bg-[#e0c695] px-2 py-1.5 text-[12px] text-[#67482c]">
                  {locked ? node.lockedNote ?? q.lockedRegion : q.soon}
                </p>
                {currentId && currentId !== node.id && (
                  <button type="button" className="ow-btn-primary" onClick={onGoCurrent}>
                    {q.goCurrent}
                  </button>
                )}
              </>
            )}
          </div>

          {node.subtitle && (
            <button type="button" className="ow-btn-quiet mt-2" onClick={() => setConcept((c) => !c)}>
              {concept ? q.hideConcept : q.concept}
            </button>
          )}
          {node.testOutHref && !done && (
            <Link
              href={node.testOutHref}
              className="mt-2 block text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#732d2c] underline underline-offset-4"
            >
              🗝 {m.journey.testOut.chapterCta}
            </Link>
          )}
        </>
      )}
    </aside>
  );
}
