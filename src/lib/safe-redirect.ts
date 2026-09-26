// Open-redirect guard for `callbackUrl` round-trips through /login.
//
// A callback is only honoured when it is an app-relative path: it must start
// with a single "/" (never "//", which browsers read as protocol-relative),
// carry no backslash (some parsers fold "\" into "/"), no scheme and no
// whitespace. Anything else falls back to the world map. Nothing is
// rewritten — a safe value is returned exactly as given.

const DEFAULT_FALLBACK = "/path";

export function safeCallbackUrl(raw: unknown, fallback = DEFAULT_FALLBACK): string {
  if (typeof raw !== "string") return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (raw.includes("\\")) return fallback;
  if (raw.includes("://") || /^\/[a-z][a-z0-9+.-]*:/i.test(raw)) return fallback;
  if (/\s/.test(raw)) return fallback;
  return raw;
}

// Append `?callbackUrl=` to a link (typically "/login") when the callback is
// safe and not already the default destination. Uses "&" when the href
// already carries a query string.
export function withCallback(href: string, callbackUrl?: string | null): string {
  const safe = safeCallbackUrl(callbackUrl);
  if (safe === DEFAULT_FALLBACK) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}callbackUrl=${encodeURIComponent(safe)}`;
}
