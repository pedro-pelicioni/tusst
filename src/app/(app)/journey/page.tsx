import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getJourneyChaptersLocalized } from "@/content/journey/i18n";
import { arcIsTestable, chapterIsTestable } from "@/content/journey/test-out";
import type { Concept, ConceptArc, ConceptLevel } from "@/content/journey/types";
import type { Messages } from "@/i18n/messages/en";
import { getLocale, getMessages } from "@/i18n/server";
import { fmt } from "@/i18n/format";
import { XP_CONCEPT } from "@/lib/xp";
import { SceneRoot } from "@/components/scene/SceneRoot";
import Image from "next/image";
import { SceneArt, hasV2Asset } from "@/components/scene/SceneArt";
import { SceneParticles } from "@/components/scene/SceneParticles";

// The Builder's Journey map — the essential road, read as a trail: level 0
// (Foundations) is the entrance, then the two arcs, the Craft (AI-era
// engineering) and the Realm (Stellar end to end). Free-roam is unchanged:
// every live chapter is playable, `requires` is DRAWN and never enforced, and
// each arc highlights its own recommended next one. The campaign's unlock
// machinery is never consulted here.

const LEVEL_KEY = ["foundations", "essential", "advanced"] as const;

// The two test-out seals. Both have a text-only fallback, same rule as the
// chapter sigils — a missing master must never cost the reader the shortcut.
const CHAPTER_SEAL = "/v2/journey/skip-chapter.webp";
const ARC_SEAL = "/v2/journey/skip-arc.webp";

/** "I already know this" — the Duolingo shortcut, drawn as a rune key. */
function SkipLink({
  href,
  label,
  art,
  tone,
}: {
  href: string;
  label: string;
  art: string | null;
  tone: "chapter" | "arc";
}) {
  return (
    <Link
      href={href}
      className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] transition ${
        tone === "arc"
          ? "border-gold/40 bg-gold/[0.07] text-gold/90 hover:border-gold/70"
          : "border-line bg-white/[0.03] text-muted2 hover:border-accent/50 hover:text-accent-soft"
      }`}
    >
      {art ? (
        <Image
          src={art}
          alt=""
          width={tone === "arc" ? 22 : 18}
          height={tone === "arc" ? 22 : 18}
          // The seals are not square, so the height is the constraint and the
          // width follows — without `w-auto` Next warns about the broken ratio.
          className={`w-auto object-contain ${tone === "arc" ? "h-[22px]" : "h-[18px]"}`}
        />
      ) : (
        <span aria-hidden>{tone === "arc" ? "🜲" : "🗝"}</span>
      )}
      {label}
    </Link>
  );
}

function levelLabel(level: ConceptLevel, m: Messages["journey"]) {
  return m.levels[LEVEL_KEY[level]];
}

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.journey.metaTitle, description: m.journey.metaDescription };
}

function ArcRail({
  chapters,
  completed,
  titles,
  startHere = false,
  skipArt,
  m,
}: {
  chapters: Concept[];
  completed: Set<string>;
  /** slug → localized title, for rendering the trail's prerequisite edges */
  titles: Map<string, string>;
  /** level 0 labels its next chapter "start here" until the tier is entered */
  startHere?: boolean;
  /** resolved chapter-seal path, or null when the master has not landed */
  skipArt: string | null;
  m: Messages["journey"];
}) {
  const recommended = chapters.find(
    (c) => c.meta.status === "live" && !completed.has(c.meta.slug),
  )?.meta.slug;

  return (
    <div className="mt-6">
      {chapters.map((chapter, i) => {
        const { meta } = chapter;
        const live = meta.status === "live";
        const done = completed.has(meta.slug);
        const isNext = meta.slug === recommended;
        // Advisory edges only — a chapter whose prerequisites are unwalked is
        // still a link, never a lock.
        const requires = (meta.requires ?? [])
          .map((slug) => titles.get(slug))
          .filter((title): title is string => Boolean(title));

        // hasV2Asset is an fs check, so this stays on the server; a chapter
        // whose master has not landed simply keeps the art-free layout.
        const sigil = hasV2Asset(meta.sigil) ? meta.sigil : null;

        const body = (
          <div
            className={`flex flex-1 gap-4 rounded-2xl border px-5 py-4 backdrop-blur transition ${
              isNext
                ? "border-accent/40 bg-accent/[0.08]"
                : live
                  ? "sc-door border-line bg-bg/60"
                  : "border-line/60 bg-bg/40 opacity-70"
            }`}
          >
            {sigil && (
              <div className="relative hidden h-14 w-14 shrink-0 self-start sm:block">
                <Image
                  src={sigil}
                  alt=""
                  fill
                  sizes="56px"
                  quality={75}
                  className={`object-contain ${live ? "" : "opacity-50 grayscale"}`}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
              <p
                className={`font-display text-[17px] font-bold tracking-wide ${
                  live ? "text-fg" : "text-muted2"
                }`}
              >
                {meta.title}
              </p>
              {done && (
                <span className="rounded-full border border-pop/50 bg-pop/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-pop">
                  {m.chapter.completed}
                </span>
              )}
              {isNext && !done && (
                <span className="rounded-full border border-accent/50 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-accent-soft">
                  {startHere ? m.startHere : m.recommended}
                </span>
              )}
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              {meta.tagline}
            </p>
            {requires.length > 0 && (
              <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted2">
                {fmt(m.chapter.requires, { chapters: requires.join(" · ") })}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              <span className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 text-[9px] tracking-[0.16em] text-muted2">
                {levelLabel(meta.level, m)}
              </span>
              {live ? (
                <>
                  <span>
                    {fmt(m.chapter.minutes, { minutes: meta.estMinutes })}
                  </span>
                  <span className="text-gold/80">
                    {fmt(m.chapter.xp, { xp: XP_CONCEPT })}
                  </span>
                  <span className="ml-auto text-accent-soft">
                    {done ? m.chapter.revisit : m.chapter.start} →
                  </span>
                </>
              ) : (
                <span>{m.chapter.soon}</span>
              )}
              </div>
            </div>
          </div>
        );

        return (
          <div key={meta.slug} className="flex gap-4">
            {/* rail marker */}
            <div className="flex flex-col items-center">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border font-display text-sm font-bold ${
                  done
                    ? "border-pop/60 bg-pop/15 text-pop"
                    : isNext
                      ? "border-accent bg-accent/20 text-accent"
                      : live
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-line bg-bg-elev text-muted"
                }`}
              >
                {done ? "✓" : live ? meta.numeral : meta.glyph}
              </span>
              {i < chapters.length - 1 && (
                <span className="w-px flex-1 bg-white/[0.08]" />
              )}
            </div>

            <div className="flex-1 pb-6">
              {live ? (
                <Link href={`/journey/${meta.slug}`} className="block">
                  {body}
                </Link>
              ) : (
                body
              )}
              {/* Sibling of the card's Link, never inside it — an anchor
                  nested in an anchor is invalid and swallows the click. */}
              {live && !done && chapterIsTestable(chapter) && (
                <SkipLink
                  href={`/journey/test-out/chapter/${meta.slug}`}
                  label={m.testOut.chapterCta}
                  art={skipArt}
                  tone="chapter"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function JourneyPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const [m, locale] = await Promise.all([getMessages(), getLocale()]);

  const completedRows = userId
    ? await prisma.journeyProgress.findMany({
        where: { userId, completed: true },
        select: { conceptSlug: true },
      })
    : [];
  const completed = new Set(completedRows.map((r) => r.conceptSlug));

  const chapters = getJourneyChaptersLocalized(locale);
  const foundations = chapters.filter(
    (chapter) => chapter.meta.arc === "foundations",
  );
  const craft = chapters.filter((chapter) => chapter.meta.arc === "craft");
  const realm = chapters.filter((chapter) => chapter.meta.arc === "realm");
  const titles = new Map(chapters.map((c) => [c.meta.slug, c.meta.title]));
  // fs checks, so they stay on the server — same guard the sigils use.
  const skipArt = hasV2Asset(CHAPTER_SEAL) ? CHAPTER_SEAL : null;
  const arcArt = hasV2Asset(ARC_SEAL) ? ARC_SEAL : null;
  // An arc is only skippable once every live chapter in it carries a bank —
  // otherwise one paper would seal chapters it never asked about.
  const arcSkippable = (arc: ConceptArc) =>
    arcIsTestable(arc, chapters) &&
    chapters.some(
      (c) => c.meta.arc === arc && c.meta.status === "live" && !completed.has(c.meta.slug),
    );
  // "start here" survives only until the ground floor is entered.
  const untouched = !foundations.some((c) => completed.has(c.meta.slug));

  return (
    <SceneRoot id="journey-map">
      <section
        data-scene
        className="sc-scene sc-scene--journey min-h-[calc(100dvh-56px)]"
      >
        <SceneArt
          layers={[{ src: "/v2/journey/map-bg-v2.webp", priority: true, quality: 75 }]}
        />
        <div className="sc-scrim" />
        <SceneParticles tone="journey" />

        <div className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-14">
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent-soft">
              {m.journey.kicker}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-wide text-[#f4f2fb] sm:text-5xl">
              {m.journey.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted2">
              {m.journey.intro}
            </p>

            {/* ─── the trail's three tiers, in one line ─── */}
            <p className="mt-6 max-w-2xl text-[12.5px] leading-relaxed text-muted">
              {m.journey.levels.legend}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {([0, 1, 2] as const).map((level, i) => (
                <span key={level} className="flex items-center gap-2">
                  {i > 0 && <span className="text-muted2/70">→</span>}
                  <span
                    className={`rounded-full border px-3 py-1 ${
                      level === 0
                        ? "border-accent/40 bg-accent/[0.08] text-accent-soft"
                        : "border-line bg-bg/50"
                    }`}
                  >
                    {levelLabel(level, m.journey)}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* ─── Level 0 · Foundations — the entrance ─── */}
          <div data-reveal="2" className="mt-12">
            <h2 className="font-display text-xl font-bold tracking-wide text-fg">
              {m.journey.arcs.foundations.title}
            </h2>
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-muted">
              {m.journey.arcs.foundations.blurb}
            </p>
            {arcSkippable("foundations") && (
              <SkipLink
                href="/journey/test-out/arc/foundations"
                label={m.journey.testOut.arcCta}
                art={arcArt}
                tone="arc"
              />
            )}
            <ArcRail
              chapters={foundations}
              completed={completed}
              titles={titles}
              skipArt={skipArt}
              startHere={untouched}
              m={m.journey}
            />
          </div>

          {/* ─── Arc I · The Craft ─── */}
          <div data-reveal="3" className="mt-14">
            <h2 className="font-display text-xl font-bold tracking-wide text-fg">
              {m.journey.arcs.craft.title}
            </h2>
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-muted">
              {m.journey.arcs.craft.blurb}
            </p>
            {arcSkippable("craft") && (
              <SkipLink
                href="/journey/test-out/arc/craft"
                label={m.journey.testOut.arcCta}
                art={arcArt}
                tone="arc"
              />
            )}
            <ArcRail
              chapters={craft}
              completed={completed}
              titles={titles}
              skipArt={skipArt}
              m={m.journey}
            />
          </div>

          {/* ─── Arc II · The Realm ─── */}
          <div data-reveal="4" className="mt-14">
            <h2 className="font-display text-xl font-bold tracking-wide text-fg">
              {m.journey.arcs.realm.title}
            </h2>
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-muted">
              {m.journey.arcs.realm.blurb}
            </p>
            {arcSkippable("realm") && (
              <SkipLink
                href="/journey/test-out/arc/realm"
                label={m.journey.testOut.arcCta}
                art={arcArt}
                tone="arc"
              />
            )}
            <ArcRail
              chapters={realm}
              completed={completed}
              titles={titles}
              skipArt={skipArt}
              m={m.journey}
            />
          </div>
        </div>
      </section>
    </SceneRoot>
  );
}
