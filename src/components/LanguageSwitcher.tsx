"use client";

// Fixed-header language switcher (EN · PT · ES · FR).
// Selecting a language calls the setLocale server action (cookie +
// User.locale) and the layout revalidation re-renders the whole tree in
// the new language — no page reload, works signed-out.

import { useState, useTransition } from "react";
import {
  LOCALES,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  type Locale,
} from "@/i18n/config";
import { setLocale } from "@/i18n/actions";
import { useI18n } from "@/i18n/client";

export function LanguageSwitcher({
  variant = "nav",
}: {
  variant?: "nav" | "landing";
}) {
  const { locale, messages } = useI18n();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const pick = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
    });
  };

  const trigger =
    variant === "landing"
      ? "flex items-center gap-1.5 rounded-full border border-[rgba(143,123,255,0.35)] bg-[rgba(143,123,255,0.08)] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[#cfc3ff] backdrop-blur-[6px] transition-colors hover:bg-[rgba(143,123,255,0.2)] hover:text-white"
      : "flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:border-line-strong hover:text-fg";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={messages.common.changeLanguage}
        title={messages.common.changeLanguage}
        className={trigger}
        disabled={pending}
      >
        <span aria-hidden className="text-[14px] leading-none">
          {LOCALE_FLAGS[locale]}
        </span>
        <span className="font-semibold">{locale}</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] cursor-default"
          />
          <ul
            role="listbox"
            aria-label={messages.common.languageLabel}
            className="absolute right-0 z-[95] mt-2 w-44 overflow-hidden rounded-lg border border-line bg-[#0b0817]/95 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur"
          >
            {LOCALES.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l === locale}
                  onClick={() => pick(l)}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left font-mono text-[12px] transition ${
                    l === locale
                      ? "bg-accent/15 text-accent"
                      : "text-muted2 hover:bg-white/[0.05] hover:text-fg"
                  }`}
                >
                  <span aria-hidden className="text-[14px] leading-none">
                    {LOCALE_FLAGS[l]}
                  </span>
                  {LOCALE_LABELS[l]}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
