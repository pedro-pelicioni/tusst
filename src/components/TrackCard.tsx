import Link from "next/link";
import type { Track } from "@/content/tracks";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";

function fmtHours(h: number | null) {
  if (!h || h <= 0) return "~0m";
  return `~${h}h`;
}

export function TrackCard({
  track,
  completed = 0,
}: {
  track: Track;
  completed?: number;
}) {
  const locked = track.status === "locked";
  const percent =
    track.challenges > 0 ? Math.round((completed / track.challenges) * 100) : 0;
  const badge = locked ? "locked" : track.badge;

  const inner = (
    <article
      className={`relative flex h-full flex-col rounded-xl border bg-bg-elev p-6 transition ${
        locked
          ? "border-line opacity-55"
          : "border-line hover:border-line-strong hover:bg-bg-elev2"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-7 w-7 place-items-center rounded-md border font-mono text-xs ${
              locked ? "border-line text-muted" : "border-accent/40 text-accent"
            }`}
          >
            {track.index}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            track / {track.level}
          </span>
        </div>
        {badge && <Badge kind={badge} />}
      </div>

      <h3
        className={`mt-5 text-lg font-semibold tracking-tight ${
          locked ? "text-muted2" : "text-fg"
        }`}
      >
        {track.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted2">
        {track.description}
      </p>

      <div className="mt-5 font-mono text-[12px] text-muted">
        <span className="text-muted2">{track.challenges}</span> challenges ·{" "}
        {fmtHours(track.estHours)} · {track.level}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {track.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-muted2"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between font-mono text-[11px] text-muted">
          <span>progress</span>
          <span>
            {completed} / {track.challenges} · {percent}%
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar percent={percent} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-[11px] text-muted">
          {locked ? "coming soon" : "start fresh"}
        </span>
        <span
          className={`rounded-md border px-3 py-1.5 font-mono text-xs transition ${
            locked
              ? "border-line bg-white/[0.02] text-muted"
              : "border-accent/40 bg-accent/10 text-accent group-hover:bg-accent/20"
          }`}
        >
          {locked ? "locked ›" : "start ›"}
        </span>
      </div>
    </article>
  );

  if (locked) {
    return (
      <div className="h-full cursor-default" aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/tracks/${track.slug}`} className="group h-full">
      {inner}
    </Link>
  );
}
