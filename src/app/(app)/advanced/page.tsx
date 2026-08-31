import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { advancedTracks } from "@/content/advanced/curriculum";
import { getAdvancedProgress } from "@/lib/advanced-progress";
import { getLocale, getMessages } from "@/i18n/server";
import { localizeAdvancedTrack } from "@/content/advanced/i18n";
import { fmt } from "@/i18n/format";
import { ProgressBar } from "@/components/ProgressBar";

// The Advanced Path index.
//
// Visually the quietest page in the app, on purpose. No SceneArt, no
// particles, no sigils, no champion cards — this is a syllabus, and its
// reader wants to scan it and pick a gap, not be immersed in anything.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.advanced.metaTitle,
    description: m.advanced.metaDescription,
  };
}

export default async function AdvancedIndexPage() {
  const session = await auth();
  const [m, locale] = await Promise.all([getMessages(), getLocale()]);
  const t = m.advanced;

  const { rows, totalDone, totalLessons, percent } = await getAdvancedProgress(
    session?.user?.id,
  );
  const declared = advancedTracks.filter((track) => track.status === "soon");

  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent2/90">
        {t.kicker}
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-wide text-[#f4f2fb]">
        {t.title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted2">
        {t.intro}
      </p>
      <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted">
        {t.calibration}
      </p>

      {/* overall progress — only meaningful once something is finished */}
      {totalDone > 0 && (
        <div className="mt-8 rounded-2xl border border-line bg-bg-elev px-5 py-4">
          <div className="flex items-baseline justify-between font-mono text-[11px] text-muted">
            <span className="uppercase tracking-[0.25em] text-accent2/90">
              {t.progress}
            </span>
            <span>
              {totalDone}/{totalLessons}
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar percent={percent} />
          </div>
        </div>
      )}

      <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        {t.tracksHeading}
      </h2>

      <div className="mt-5 space-y-4">
        {rows.map(({ track: raw, doneCount, total, percent: pct, nextLessonSlug }) => {
          const track = localizeAdvancedTrack(raw, locale);
          const cta =
            doneCount === 0 ? t.start : nextLessonSlug ? t.resume : t.review;

          return (
            <Link
              key={track.slug}
              href={`/advanced/${track.slug}`}
              className="block rounded-2xl border border-line bg-bg-elev px-5 py-5 transition hover:border-accent2/40 hover:bg-white/[0.03]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-[19px] font-bold tracking-wide text-fg">
                  {track.title}
                </h3>
                <span className="font-mono text-[11px] text-muted">
                  {fmt(t.lessonCount, { count: total })} ·{" "}
                  {fmt(t.hours, { hours: track.estHours })}
                </span>
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-muted2">
                {track.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent2/30 bg-accent2/[0.07] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent2/90">
                  {t.serves}: {track.serves}
                </span>
                {track.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {doneCount > 0 && (
                <div className="mt-4">
                  <ProgressBar percent={pct} />
                  <p className="mt-1.5 font-mono text-[11px] text-muted">
                    {fmt(t.percentDone, { percent: pct })}
                  </p>
                </div>
              )}

              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent2">
                {cta} →
              </p>
            </Link>
          );
        })}
      </div>

      {declared.length > 0 && (
        <>
          <h2 className="mt-14 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            {t.declaredHeading}
          </h2>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted">
            {t.declaredNote}
          </p>

          <div className="mt-5 space-y-4">
            {declared.map((raw) => {
              const track = localizeAdvancedTrack(raw, locale);
              return (
              <div
                key={track.slug}
                className="rounded-2xl border border-line/60 bg-bg-elev/50 px-5 py-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-[17px] font-bold tracking-wide text-muted2">
                    {track.title}
                  </h3>
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {t.soon}
                  </span>
                </div>

                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {track.description}
                </p>

                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {t.syllabusHeading}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {track.syllabus?.map((line) => (
                    <li
                      key={line}
                      className="flex gap-2.5 text-[13px] leading-relaxed text-muted2"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-muted" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-14 space-y-2 border-t border-line pt-6">
        <p className="font-mono text-[11px] leading-relaxed text-muted">
          {t.notes.sandbox}
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-muted">
          {t.notes.english}
        </p>
      </div>
    </div>
  );
}
