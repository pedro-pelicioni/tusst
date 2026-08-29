import Link from "next/link";
import Image from "next/image";
import type { LabScenario } from "@/content/labs/types";
import {
  localizeLab,
  type LabTextOverlay,
} from "@/content/labs/localize";
import type { Messages } from "@/i18n/messages/en";
import { fmt } from "@/i18n/format";
import { hasV2Asset } from "@/components/scene/SceneArt";
import { XP_LAB } from "@/lib/xp";

// Server component: one lab on the Forge index. Emblem art is a v2 asset
// slot with a glyph stand-in; "soon" entries render as roadmap cards.

export function LabCard({
  lab,
  completed,
  m,
}: {
  lab: LabScenario;
  completed: boolean;
  m: Messages["labs"];
}) {
  const localizedLab = localizeLab(
    lab,
    (m.content as Record<string, LabTextOverlay | undefined>)[lab.meta.slug],
  );
  const { meta } = localizedLab;
  const live = meta.status === "live";
  const emblem = hasV2Asset(meta.emblem) ? (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
      <Image src={meta.emblem} alt="" fill sizes="64px" className="object-cover" />
    </div>
  ) : (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-line bg-[radial-gradient(70%_70%_at_50%_40%,rgba(69,214,196,0.14),transparent_75%)] text-3xl">
      <span aria-hidden>{meta.glyph}</span>
    </div>
  );

  const body = (
    <div
      className={`flex h-full gap-4 rounded-2xl border p-5 backdrop-blur transition ${
        live
          ? "sc-door border-accent2/25 bg-bg/70"
          : "border-line bg-bg/50 opacity-75"
      }`}
    >
      {emblem}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-bold tracking-wide text-fg">
            {meta.title}
          </h3>
          {completed && (
            <span className="rounded-full border border-pop/50 bg-pop/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-pop">
              {m.card.completed}
            </span>
          )}
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted2">
          {meta.tagline}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          <span>{m.difficulty[meta.difficulty]}</span>
          <span>{fmt(m.card.minutes, { minutes: meta.estMinutes })}</span>
          <span className="text-gold/80">
            {fmt(m.card.xp, { xp: XP_LAB[meta.difficulty] })}
          </span>
          {live ? (
            <span className="ml-auto text-accent2">
              {completed ? m.card.replay : m.card.start} →
            </span>
          ) : (
            <span className="ml-auto">{m.card.soon}</span>
          )}
        </div>
      </div>
    </div>
  );

  return live ? (
    <Link href={`/labs/${meta.slug}`} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}
