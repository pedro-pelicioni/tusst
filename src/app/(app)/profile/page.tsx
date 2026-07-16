import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { acts } from "@/content/campaign";
import { getActLocalized } from "@/content/i18n";
import { getCampaignProgress } from "@/lib/campaign-progress";
import { getUnlockedActs } from "@/lib/onboarding";
import { getLocale, getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { hueFromName } from "@/components/CharacterAvatar";
import { ProgressBar } from "@/components/ProgressBar";

// The Forgeborn's profile: identity, character progression and campaign
// standing. The pouch (gold) only appears after the Phase 5 reveal —
// User.goldRevealed flips on the first completed lesson; before that the
// economy stays invisible.
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [user, campaign, onboardingUnlock] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        character: true,
        accounts: { select: { provider: true } },
      },
    }),
    getCampaignProgress(userId),
    getUnlockedActs(),
  ]);
  if (!user) redirect("/login");

  const locale = await getLocale();
  const m = await getMessages();
  const p = m.pages.profile;

  const name = user.name ?? "guardian";
  const hue = hueFromName(name);
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  const level = user.character?.level ?? 1;
  const xp = user.character?.xp ?? 0;

  const providers =
    user.accounts.length > 0
      ? user.accounts.map((a) => a.provider)
      : user.email?.endsWith("@dev.local")
        ? ["dev"]
        : [];

  const joined = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(user.createdAt);

  const { rows, clearedStreak, cardsClaimed, totalPlayable, totalDone } =
    campaign;
  const unlockedCount = Math.max(
    onboardingUnlock,
    Math.min(clearedStreak + 1, acts.length),
  );
  const campaignPercent = Math.round(
    (totalDone / Math.max(totalPlayable, 1)) * 100,
  );
  const current = rows.find((r, i) => i < unlockedCount && r.nextLessonSlug);

  const stats = [
    { label: p.stats.skirmishesWon, value: `${totalDone}/${totalPlayable}` },
    { label: p.stats.actsCleared, value: `${cardsClaimed}/${acts.length}` },
    {
      label: p.stats.championCards,
      value: `${cardsClaimed}/${acts.length}`,
      href: "/cards",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      {/* ── identity ── */}
      <div className="flex items-center gap-6">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center" aria-hidden="true">
          <span
            className="absolute h-[68px] w-[68px] rotate-45 rounded-[14px]"
            style={{
              background: `linear-gradient(135deg, hsl(${hue} 75% 66%), hsl(${(hue + 60) % 360} 70% 48%))`,
              boxShadow: `0 0 40px hsl(${hue} 80% 60% / 0.45), inset 0 2px 0 rgba(255,255,255,0.35)`,
            }}
          />
          <span
            className="absolute h-[68px] w-[68px] rotate-45 rounded-[14px]"
            style={{
              background:
                "linear-gradient(315deg, rgba(0,0,0,0.28) 0%, transparent 45%)",
            }}
          />
          <span className="relative font-display text-3xl font-extrabold leading-none text-[#0b0817]">
            {initial}
          </span>
        </div>

        <div className="min-w-0">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted"
          >
            {p.forgeborn}
          </p>
          <h1 className="mt-1 truncate font-display text-3xl font-extrabold tracking-wide text-[#f4f2fb]">
            {name}
          </h1>
          <p className="mt-1 font-mono text-[11px] text-muted">
            {fmt(p.lvlXp, { level, xp })}
            {user.email ? ` · ${user.email}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted2">
              {fmt(p.since, { date: joined })}
            </span>
            {providers.map((p) => (
              <span
                key={p}
                className="rounded border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── pouch (hidden until goldRevealed) ── */}
      {user.goldRevealed && (
        <div className="mt-10 flex items-center gap-4 rounded-2xl border border-[#b8873e]/30 bg-[#b8873e]/[0.06] px-5 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gold-coin.png"
            alt={p.goldCoinAlt}
            className="h-12 w-12 object-contain drop-shadow-[0_0_14px_rgba(184,135,62,0.5)]"
          />
          <div>
            <p className="font-display text-2xl font-extrabold tabular-nums text-[#e0b25f]">
              {user.gold}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              {p.goldCaption}
            </p>
          </div>
        </div>
      )}

      {/* ── stats ── */}
      <div className="mt-10 grid grid-cols-3 gap-3">
        {stats.map((s) => {
          const body = (
            <div className="rounded-2xl border border-line bg-bg-elev px-4 py-4 text-center transition group-hover:border-line-strong">
              <p className="font-display text-2xl font-extrabold text-fg">
                {s.value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {s.label}
              </p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="group">
              {body}
            </Link>
          ) : (
            <div key={s.label}>{body}</div>
          );
        })}
      </div>

      {/* ── campaign standing ── */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            {p.campaignHeading}
          </p>
          <span className="font-mono text-[11px] text-muted">
            {campaignPercent}%
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar percent={campaignPercent} />
        </div>

        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-bg-elev">
          {rows.map(({ act: rawAct, cleared, percent }, i) => {
            const act = getActLocalized(rawAct.trackSlug, locale) ?? rawAct;
            const unlocked = i < unlockedCount;
            const row = (
              <>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                    cleared
                      ? "border-pop/50 bg-pop/10 text-pop"
                      : unlocked
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-line text-muted"
                  }`}
                >
                  {cleared ? "✓" : unlocked ? act.numeral : "🔒"}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-sm ${
                    unlocked ? "text-fg" : "text-muted2"
                  }`}
                >
                  {act.title}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted">
                  {cleared
                    ? p.status.cleared
                    : unlocked
                      ? `${percent}%`
                      : p.status.locked}
                </span>
              </>
            );
            return (
              <li key={act.numeral}>
                {unlocked ? (
                  <Link
                    href={`/tracks/${act.trackSlug}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/[0.03]"
                  >
                    {row}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 opacity-60">
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <Link
            href={
              current?.nextLessonSlug
                ? `/lessons/${current.nextLessonSlug}`
                : "/cards"
            }
            className="inline-block rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.16em] text-[#0b0817] transition-transform hover:-translate-y-[2px]"
            style={{
              background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
              boxShadow: "0 0 34px rgba(143,123,255,0.4)",
            }}
          >
            {current ? p.continueCampaign : p.viewChampions}
          </Link>
        </div>
      </div>
    </div>
  );
}
