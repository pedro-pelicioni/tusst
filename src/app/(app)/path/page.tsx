import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUnlockedActs } from "@/lib/onboarding";
import { getCampaignProgress } from "@/lib/campaign-progress";
import { acts, getCard } from "@/content/campaign";
import { ProgressBar } from "@/components/ProgressBar";

// Campaign path — the Mimo-style "career plan" view. One vertical rail of
// acts; locks come from the onboarding answers (cookie) plus real progress.
export default async function PathPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [{ rows, clearedStreak, cardsClaimed }, unlockedByOnboarding] =
    await Promise.all([getCampaignProgress(userId), getUnlockedActs()]);

  // An act is unlocked by the onboarding answer, or by finishing every act
  // before it (which is also the only way to reach Act VII).
  const unlockedCount = Math.max(
    unlockedByOnboarding,
    Math.min(clearedStreak + 1, acts.length),
  );

  const cardsPercent = Math.round((cardsClaimed / acts.length) * 100);

  // CTA: first unlocked act with an incomplete playable skirmish.
  const current = rows.find(
    (r, i) => i < unlockedCount && r.nextLessonSlug !== null,
  );
  const ctaHref = current?.nextLessonSlug
    ? `/lessons/${current.nextLessonSlug}`
    : "/cards";

  return (
    <div className="mx-auto max-w-2xl px-5 pb-32 pt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-muted">
        campaign path
      </p>
      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-wide text-[#f4f2fb]">
        Forgeborn — Rust to Soroban
      </h1>

      {/* champion cards summary (Mimo's certificates strip) */}
      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-bg-elev px-5 py-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 font-mono text-lg text-accent">
          Ø
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">Champion cards</p>
          <div className="mt-2">
            <ProgressBar percent={cardsPercent} />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[11px] text-muted">
            <span>{cardsPercent}% claimed</span>
            <span>
              {cardsClaimed}/{acts.length}
            </span>
          </div>
        </div>
      </div>

      {/* rail */}
      <div className="mt-10">
        {rows.map(({ act, cleared: complete, percent, playable }, i) => {
          const unlocked = i < unlockedCount;
          const isCurrent = current ? rows[i] === current : false;
          const reward = act.cardId ? getCard(act.cardId) : undefined;
          const hasContent = playable.length > 0;

          const body = (
            <div
              className={`flex-1 rounded-2xl px-4 py-3 transition ${
                isCurrent
                  ? "border border-accent/30 bg-accent/[0.07]"
                  : unlocked
                    ? "hover:bg-white/[0.03]"
                    : ""
              }`}
            >
              <p
                className={`font-display text-[16px] font-bold ${
                  unlocked ? "text-fg" : "text-muted2"
                }`}
              >
                {i + 1}. {act.title}
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                {act.territory}
                {act.overlord ? ` · ${act.overlord}` : ""}
              </p>

              {/* act reward — Mimo's "section project" card */}
              {reward && (
                <div
                  className={`mt-3 rounded-xl border px-4 py-3 ${
                    unlocked ? "border-line bg-bg" : "border-line/60 bg-bg/50"
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                    act reward
                  </p>
                  <p className={`mt-1 text-sm ${unlocked ? "text-fg" : "text-muted2"}`}>
                    {reward.name}
                    {reward.epithet ? ` — ${reward.epithet}` : ""}
                  </p>
                  <p className="font-mono text-[11px] text-muted">
                    {reward.type} · power {reward.power}
                  </p>
                </div>
              )}

              {unlocked && !hasContent && (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  skirmishes being forged — soon
                </p>
              )}
            </div>
          );

          return (
            <div key={act.numeral} className="flex gap-4">
              {/* rail marker */}
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border font-display text-sm font-bold ${
                    complete
                      ? "border-pop/60 bg-pop/15 text-pop"
                      : isCurrent
                        ? "border-accent bg-accent/20 text-accent"
                        : unlocked
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-line bg-bg-elev text-muted"
                  }`}
                >
                  {complete ? "✓" : unlocked ? (isCurrent ? `${percent}%` : act.numeral) : "🔒"}
                </span>
                {i < acts.length - 1 && (
                  <span
                    className={`w-px flex-1 ${
                      i < unlockedCount - 1 ? "bg-accent/40" : "bg-white/[0.08]"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 pb-8">
                {unlocked ? (
                  <Link href={`/tracks/${act.trackSlug}`} className="block">
                    {body}
                  </Link>
                ) : (
                  <div className="opacity-70">{body}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-bg/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <Link
            href={ctaHref}
            className="block w-full rounded-full px-8 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.16em] text-[#0b0817] transition-transform hover:-translate-y-[2px]"
            style={{
              background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
              boxShadow: "0 0 40px rgba(143,123,255,0.45), 0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            {current ? "Start learning" : "View your champions"}
          </Link>
        </div>
      </div>
    </div>
  );
}
