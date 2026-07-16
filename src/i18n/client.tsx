"use client";

// Client side of the i18n layer: the root layout (server) resolves the
// locale + messages once per request and feeds them to this provider, so
// every client component reads translations from context — no async, no
// extra fetches, and the payload is plain JSON.
//
// Deliberately does NOT import the message catalogs: only the active
// locale's messages travel to the client (via the provider prop), keeping
// the other three languages out of the bundle.

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LocaleProvider>");
  return ctx;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

export function useMessages(): Messages {
  return useI18n().messages;
}
