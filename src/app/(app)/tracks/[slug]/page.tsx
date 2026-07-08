import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getLessonContent } from "@/content/lessons";
import { acts, getAct, getCard, getSkirmish } from "@/content/campaign";
import { getUnlockedActCount } from "@/lib/unlock";
import { ProgressBar } from "@/components/ProgressBar";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const track = await prisma.track.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!track) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  // A track opens if its content is live OR its act is unlocked — by the
  // onboarding answer or by clearing every act before it.
  const actIndex = acts.findIndex((a) => a.trackSlug === slug);
  const unlockedAct =
    actIndex >= 0 && actIndex < (await getUnlockedActCount(userId));
  if (track.status !== "active" && !unlockedAct) {
    notFound();
  }

  let completed = new Set<string>();
  if (userId) {
    const progress = await prisma.progress.findMany({
      where: { userId, completed: true, lesson: { trackId: track.id } },
      select: { lessonId: true },
    });
    completed = new Set(progress.map((p) => p.lessonId));
  }

  const act = getAct(track.slug);
  const rewardCard = act?.cardId ? getCard(act.cardId) : undefined;

  const completedCount = completed.size;
  const denom = track.challengeCount || track.lessons.length || 1;
  const percent = Math.round((completedCount / denom) * 100);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Link
        href="/path"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition hover:text-fg"
      >
        ‹ campaign path
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-md border border-accent/40 font-mono text-sm text-accent">
          {String(track.order).padStart(2, "0")}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          track / {track.level}
        </span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-wide">
        {act ? (
          <>
            <span className="mr-3 align-middle text-lg text-accent/70">
              Act {act.numeral}
            </span>
            {act.title}
          </>
        ) : (
          track.title
        )}
      </h1>
      {act && (
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {track.title} · {act.territory}
          {act.overlord ? ` · overlord: ${act.overlord}` : ""}
        </p>
      )}
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted2">
        {act ? act.synopsis : track.description}
      </p>

      {rewardCard && (
        <div className="mt-6 flex max-w-xl items-center gap-4 rounded-xl border border-accent/20 bg-accent/[0.04] px-5 py-4">
          <span className="font-mono text-lg text-accent">Ø</span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
              act reward
            </p>
            <p className="mt-1 truncate text-sm text-fg">
              {rewardCard.name}
              {rewardCard.epithet ? ` — ${rewardCard.epithet}` : ""}
            </p>
            <p className="font-mono text-[11px] text-muted">
              {rewardCard.type} · power {rewardCard.power}
            </p>
          </div>
        </div>
      )}

      {/* progress */}
      <div className="mt-6 max-w-sm">
        <div className="flex items-center justify-between font-mono text-[11px] text-muted">
          <span>progress</span>
          <span>
            {completedCount} / {track.challengeCount} · {percent}%
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar percent={percent} />
        </div>
      </div>

      {/* lessons */}
      <div className="mt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          {"// lessons"}
        </p>
        {track.lessons.length === 0 && (
          <div className="mt-4 rounded-xl border border-line bg-bg-elev p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              skirmishes being forged
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted2">
              Your onboarding unlocked this act, but its skirmishes are still
              being written. Head back to the{" "}
              <Link href="/path" className="text-accent hover:underline">
                campaign path
              </Link>{" "}
              to keep fighting.
            </p>
          </div>
        )}
        {track.lessons.length > 0 && (
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg-elev">
          {track.lessons.map((lesson) => {
            const done = completed.has(lesson.id);
            const skirmish = getSkirmish(lesson.slug);
            const playable =
              lesson.status === "active" && !!getLessonContent(lesson.slug);
            const row = (
              <>
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] ${
                    done
                      ? "border-accent/50 bg-accent/15 text-accent"
                      : "border-line text-muted"
                  }`}
                >
                  {done ? "✓" : lesson.order}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-fg">
                    {skirmish ? (
                      <>
                        <span className="mr-2 font-mono text-[11px] text-accent/70">
                          {skirmish.numeral}
                        </span>
                        {skirmish.title}
                      </>
                    ) : (
                      lesson.title
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-muted">
                    {skirmish ? lesson.title : lesson.summary}
                  </div>
                </div>
                <span className="shrink-0 rounded bg-white/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted2">
                  {playable ? lesson.difficulty : "soon"}
                </span>
                {playable && (
                  <span className="shrink-0 font-mono text-xs text-accent">
                    ›
                  </span>
                )}
              </>
            );
            return (
              <li key={lesson.id}>
                {playable ? (
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.03]"
                  >
                    {row}
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 px-5 py-4 opacity-60">
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        )}

        {track.lessons.length > 0 && (
          <p className="mt-4 font-mono text-[11px] text-muted">
            {track.lessons.length} of {track.challengeCount} challenges
            available · more are on the way.
          </p>
        )}
      </div>
    </div>
  );
}
