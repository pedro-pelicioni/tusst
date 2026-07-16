// i18n foundation — locale list, cookie contract, display names.
// Locale is stored in the `tusst_locale` cookie (readable from server
// components) and mirrored to `User.locale` for signed-in players.

export const LOCALES = ["en", "pt", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "tusst_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Native-language labels — always shown in their own language so a user
// stuck in the wrong locale can still find their way home.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
  fr: "Français",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  pt: "🇧🇷",
  es: "🇪🇸",
  fr: "🇫🇷",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
