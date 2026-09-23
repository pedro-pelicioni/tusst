"use client";

// Top-center campaign guide: "STEP 4 OF 33 · title · 1 walk / 2 enter".

import type { NodeState } from "@/content/overworld/types";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";

export function GuideBanner({
  recommended,
  index,
  total,
  near,
}: {
  recommended: NodeState | null;
  index: number;
  total: number;
  near: boolean;
}) {
  const g = useMessages().overworld.guide;
  return (
    <div className="ow-hud ow-panel-wood left-1/2 top-3 w-[360px] -translate-x-1/2 px-4 py-2.5 text-center max-md:left-auto max-md:right-2 max-md:top-2 max-md:w-[calc(100vw-200px)] max-md:max-w-[190px] max-md:translate-x-0 max-md:px-2.5 max-md:py-1.5 max-md:text-left">
      {recommended ? (
        <>
          <p className="ow-eyebrow text-[#eabc6a]">{fmt(g.step, { current: index, total })}</p>
          <p className="mt-1 text-[13px] font-semibold leading-snug text-[#f6e4bc] max-md:line-clamp-2 max-md:text-[11px]">{recommended.title}</p>
          <p className="mt-1 text-[11px] text-[#c7a787] max-md:hidden">
            {near ? `✓ ${g.walk} · 2 ${g.enter}` : `1 ${g.walk} · 2 ${g.enter}`}
          </p>
        </>
      ) : (
        <p className="text-[12px] text-[#ffe29a]">✦ {g.allDone}</p>
      )}
    </div>
  );
}
