import "server-only";

import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/i18n/config";
import { MESSAGES, type Messages } from "@/i18n/messages";

// Resolve the request locale from the `tusst_locale` cookie.
// The cookie is the single source of truth at request time; `User.locale`
// only re-seeds it (login, new device) via the auth flow.
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getMessages(): Promise<Messages> {
  return MESSAGES[await getLocale()];
}
