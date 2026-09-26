"use client";

// Bottom-center badge strip — one pixel badge per mission, grouped by region
// or act; lit when cleared. Click selects the node on the map.

import type { NodeState } from "@/content/overworld/types";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";

export interface BadgeGroup {
  id: string;
  label: string;
  nodes: NodeState[];
}

export function BadgeStrip({ groups, onSelect }: { groups: BadgeGroup[]; onSelect: (id: string) => void }) {
  const m = useMessages().overworld.map;
  const all = groups.flatMap((g) => g.nodes);
  const done = all.filter((n) => n.status === "done").length;
  return (
    <div className="ow-hud ow-panel-wood bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 px-3 py-2 max-md:bottom-3 max-md:left-3 max-md:translate-x-0 max-md:px-2.5 max-md:py-1.5">
      <span className="whitespace-nowrap text-[11px] text-[#ddc295]">{fmt(m.badges, { done, total: all.length })}</span>
      <div className="flex items-center gap-2 max-md:hidden">
        {groups.map((g) => (
          <div key={g.id} className="flex items-center gap-1" title={g.label}>
            {g.nodes.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`ow-badge ${n.status === "done" ? "is-earned" : ""}`}
                title={n.title}
                aria-label={`${n.status === "done" ? m.badgeEarned : n.status === "locked" ? m.badgeLocked : m.badgeExplore} ${n.number}: ${n.title}`}
                onClick={() => onSelect(n.id)}
              >
                {n.number}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
