import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { advancedTrackBySlug } from "@/content/advanced/curriculum";
import { getAdvancedTrackProgress } from "@/lib/advanced-progress";
import { getLocale, getMessages } from "@/i18n/server";
import {
  localizeAdvancedLesson,
  localizeAdvancedTrack,
} from "@/content/advanced/i18n";
import { fmt } from "@/i18n/format";
import { ProgressBar } from "@/components/ProgressBar";

// One Advanced Path track: its lessons, in order, with what is finished.
//
// `soon` tracks 404 here rather than rendering an empty shell — the index
// page is where their syllabus lives, and a track page with no lessons is
// just a dead end wearing a heading.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raw = advancedTrackBySlug(slug);
  if (!raw) return {};
  const track = localizeAdvancedTrack(raw, await getLocale());
  return { title: `${track.title} — TUSST`, description: track.description };
}

export default async function AdvancedTrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = advancedTrackBySlug(slug);
  if (!raw || raw.status !== "active") notFound();

  const session = await auth();
  const [m, locale] = await Promise.all([getMessages(), getLocale()]);
  const t = m.advanced;
  const track = localizeAdvancedTrack(raw, locale);

  const progress = await getAdvancedTrackProgress(slug, session?.user?.id);
  if (!progress) notFound();

  const { lessons, doneCount, total, percent, nextLessonSlug } = progress;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-14">
      <Link
        href="/advanced"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition hover:text-fg"
      >
        ‹ {t.backToIndex}
      </Link>

      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-wide text-[#f4f2fb]">
        {track.title}
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted2">
        {track.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-accent2/30 bg-accent2/[0.07] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent2/90">
          {t.serves}: {track.serves}
        </span>
        <span className="font-mono text-[11px] text-muted">
          {fmt(t.lessonCount, { count: total })} ·{" "}
          {fmt(t.hours, { hours: track.estHours })}
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-bg-elev px-5 py-4">
        <div className="flex items-baseline justify-between font-mono text-[11px] text-muted">
          <span className="uppercase tracking-[0.25em] text-accent2/90">
            {t.progress}
          </span>
          <span>
            {doneCount}/{total}
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar percent={percent} />
        </div>
        {nextLessonSlug && (
          <Link
            href={`/lessons/${nextLessonSlug}`}
            className="mt-4 inline-block rounded-full border border-accent2/50 bg-accent2/10 px-6 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-accent2 transition hover:bg-accent2/20"
          >
            {doneCount === 0 ? t.start : t.resume}
          </Link>
        )}
      </div>

      <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        {t.lessonsHeading}
      </h2>

      {lessons.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t.empty}</p>
      ) : (
        <ol className="mt-5 space-y-3">
          {lessons.map((raw, i) => {
            const lesson = {
              ...raw,
              ...localizeAdvancedLesson(raw.slug, raw, locale),
            };
            return (
            <li key={lesson.slug}>
              <Link
                href={`/lessons/${lesson.slug}`}
                className="flex gap-4 rounded-xl border border-line bg-bg-elev px-4 py-4 transition hover:border-accent2/40 hover:bg-white/[0.03]"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border font-mono text-[11px] ${
                    lesson.done
                      ? "border-accent2/50 bg-accent2/10 text-accent2"
                      : "border-line text-muted"
                  }`}
                >
                  {lesson.done ? "✓" : String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[15px] font-semibold text-fg">
                    {lesson.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted2">
                    {lesson.summary}
                  </p>
                </div>
              </Link>
            </li>
            );
          })}
        </ol>
      )}

      <p className="mt-12 border-t border-line pt-6 font-mono text-[11px] leading-relaxed text-muted">
        {t.notes.sandbox}
      </p>
    </div>
  );
}
