"use client";

import Link from "next/link";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { XP_LAB } from "@/lib/xp";

// The door the free-mode Forge never had. `/labs` has always linked here;
// nothing linked back, and `/ide` is not in the nav at all — so a builder who
// landed in the workshop had no way to discover the guided labs at all.
//
// Summaries are resolved on the server (localized, with completion state) and
// passed down as plain data, so this stays presentational.

export interface ForgeLabSummary {
  slug: string;
  title: string;
  tagline: string;
  glyph: string;
  difficulty: "novice" | "adept" | "master";
  estMinutes: number;
  status: "live" | "soon";
  completed: boolean;
}

export function LabDrawer({
  open,
  labs,
  onClose,
}: {
  open: boolean;
  labs: ForgeLabSummary[];
  onClose: () => void;
}) {
  const m = useMessages();
  if (!open) return null;

  const live = labs.filter((l) => l.status === "live");
  const soon = labs.filter((l) => l.status === "soon");

  const row = (lab: ForgeLabSummary) => {
    const body = (
      <div
        className={`flex gap-3 rounded-xl border px-3 py-2.5 transition ${
          lab.status === "live"
            ? "border-accent2/25 bg-bg/60 hover:border-accent2/50 hover:bg-accent2/[0.06]"
            : "border-line bg-bg/40 opacity-70"
        }`}
      >
        <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-lg">
          {lab.completed ? "✓" : lab.glyph}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] text-fg">{lab.title}</span>
            {lab.completed && (
              <span className="rounded-full border border-pop/50 bg-pop/10 px-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-pop">
                {m.labs.card.completed}
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-muted2">
            {lab.tagline}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <span>{m.labs.difficulty[lab.difficulty]}</span>
            {lab.status === "live" ? (
              <>
                <span>{fmt(m.labs.card.minutes, { minutes: lab.estMinutes })}</span>
                <span className="text-gold/80">
                  {fmt(m.labs.card.xp, { xp: XP_LAB[lab.difficulty] })}
                </span>
              </>
            ) : (
              <span>{m.labs.card.soon}</span>
            )}
          </span>
        </span>
      </div>
    );

    return lab.status === "live" ? (
      <Link key={lab.slug} href={`/labs/${lab.slug}`} className="block">
        {body}
      </Link>
    ) : (
      <div key={lab.slug}>{body}</div>
    );
  };

  return (
    <div className="absolute inset-0 z-20 flex justify-end">
      <button
        type="button"
        aria-label={m.ide.labs.close}
        onClick={onClose}
        className="flex-1 cursor-default bg-bg/60"
      />
      <div className="flex w-[min(22rem,88vw)] flex-col border-l border-line bg-bg-elev shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {m.ide.labs.title}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.ide.labs.close}
            className="rounded px-1.5 font-mono text-[12px] text-muted2 transition hover:text-fg"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <p className="text-[12px] leading-relaxed text-muted2">{m.ide.labs.blurb}</p>

          <div className="mt-4 flex flex-col gap-2">{live.map(row)}</div>

          {soon.length > 0 && (
            <>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                {m.labs.soonHeading}
              </p>
              <div className="mt-2 flex flex-col gap-2">{soon.map(row)}</div>
            </>
          )}
        </div>

        <div className="border-t border-line px-4 py-3">
          <Link
            href="/labs"
            className="font-mono text-[11px] text-accent2 underline-offset-2 transition hover:underline"
          >
            {m.ide.labs.seeAll}
          </Link>
        </div>
      </div>
    </div>
  );
}
