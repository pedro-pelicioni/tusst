import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getLessonContent } from "@/content/lessons";
import { acts, getSkirmish } from "@/content/campaign";
import { getUnlockedActCount } from "@/lib/unlock";
import { getLessonSteps, TRIAL_LESSON_SLUG } from "@/content/steps";
import { LessonPlayer } from "@/components/LessonPlayer";
import { LessonSteps } from "@/components/LessonSteps";
import { Markdown } from "@/components/Markdown";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    include: {
      track: {
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!lesson || lesson.status !== "active") {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  // Same gate as the track page: live content, or an act unlocked by the
  // onboarding answer / by clearing everything before it.
  if (lesson.track.status !== "active") {
    const actIndex = acts.findIndex((a) => a.trackSlug === lesson.track.slug);
    const unlockedAct =
      actIndex >= 0 && actIndex < (await getUnlockedActCount(userId));
    if (!unlockedAct) {
      notFound();
    }
  }

  const content = getLessonContent(slug);
  const skirmish = getSkirmish(slug);

  let completed = false;
  if (userId) {
    const progress = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
    });
    completed = progress?.completed ?? false;
  }

  const siblings = lesson.track.lessons;
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  const next =
    idx >= 0
      ? siblings
          .slice(idx + 1)
          .find((l) => l.status === "active" && getLessonContent(l.slug))
      : undefined;
  const nextHref = next ? `/lessons/${next.slug}` : null;

  // Editor identity per domain: Stellar 101 edits a conceptual star-chart,
  // Soroban contracts live in lib.rs, everything else is plain Rust.
  const fileName =
    lesson.track.slug === "stellar-101"
      ? "star-chart.toml"
      : lesson.track.slug === "soroban-smart-contracts"
        ? "lib.rs"
        : "main.rs";
  const language = lesson.track.slug === "stellar-101" ? "toml" : "rust";

  // Bite-sized step flow (Mimo-style) — used whenever the lesson has authored
  // steps. Falls back to the classic two-pane layout otherwise.
  const steps = getLessonSteps(slug);
  if (content && steps) {
    return (
      <LessonSteps
        lessonSlug={slug}
        steps={steps}
        starterCode={content.starterCode}
        nextHref={nextHref}
        trackHref={`/tracks/${lesson.track.slug}`}
        signedIn={!!userId}
        allowAnonymous={slug === TRIAL_LESSON_SLUG}
        title={skirmish?.title ?? lesson.title}
        numeral={skirmish?.numeral}
        fileName={fileName}
        language={language}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      {/* header */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href={`/tracks/${lesson.track.slug}`}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition hover:text-fg"
        >
          ‹ {lesson.track.title}
        </Link>
        <span className="font-mono text-[11px] text-muted">/</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted2">
          lesson {String(lesson.order).padStart(2, "0")}
        </span>
        <span className="rounded bg-white/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted2">
          {lesson.difficulty}
        </span>
        {completed && (
          <span className="rounded border border-pop/30 bg-pop/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-pop">
            completed
          </span>
        )}
      </div>

      <h1 className={`mt-4 text-2xl font-semibold sm:text-3xl ${skirmish ? "font-display tracking-wide" : "tracking-tight"}`}>
        {skirmish ? (
          <>
            <span className="mr-3 align-middle text-base text-accent/70">
              {skirmish.numeral}
            </span>
            {skirmish.title}
          </>
        ) : (
          lesson.title
        )}
      </h1>

      {skirmish && (
        <div className="mt-6 max-w-3xl rounded-xl border border-accent/20 bg-accent/[0.04] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
            skirmish · {skirmish.act.title}
          </p>
          <p className="mt-3 text-sm italic leading-relaxed text-muted2">
            {skirmish.intro}
          </p>
        </div>
      )}

      {content ? (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* instructions */}
          <div className="min-w-0">
            <Markdown>{content.instructions}</Markdown>
          </div>

          {/* editor + output */}
          <div className="min-w-0">
            <LessonPlayer
              lessonSlug={slug}
              starterCode={content.starterCode}
              nextHref={nextHref}
              signedIn={!!userId}
              fileName={fileName}
              language={language}
            />
            {!userId && (
              <p className="mt-3 font-mono text-[11px] text-muted">
                <Link href="/login" className="text-accent hover:underline">
                  sign in
                </Link>{" "}
                to run code and save progress
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10 max-w-xl rounded-xl border border-line bg-bg-elev p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            coming soon
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted2">
            This lesson&apos;s interactive content is still being written. Try
            the earlier lessons in{" "}
            <Link
              href={`/tracks/${lesson.track.slug}`}
              className="text-accent hover:underline"
            >
              {lesson.track.title}
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
