import type { Metadata } from "next";
import { Markdown } from "@/components/Markdown";
import { fmt } from "@/i18n/format";
import { getLocale, getMessages } from "@/i18n/server";

// The privacy policy — public, linked from the Footer, the landing's closing
// strip and the login page. The body lives in the `legal` messages namespace
// (one markdown document per locale) and must describe what the code does
// today: whenever data collection changes, update every locale's body AND
// bump PRIVACY_UPDATED so the "last updated" line stays honest.

const PRIVACY_UPDATED = new Date("2026-09-25T12:00:00Z");

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.legal.privacy.metaTitle,
    description: m.legal.privacy.metaDescription,
  };
}

export default async function PrivacyPage() {
  const [m, locale] = await Promise.all([getMessages(), getLocale()]);
  const p = m.legal.privacy;
  const updated = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(PRIVACY_UPDATED);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent2/90">
        {p.kicker}
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-wide text-fg sm:text-5xl">
        {p.title}
      </h1>
      <p className="mt-4 font-mono text-[12px] text-muted">
        {fmt(p.updated, { date: updated })}
      </p>
      <article className="mt-10 border-t border-line pt-8">
        <Markdown>{p.body}</Markdown>
      </article>
    </div>
  );
}
