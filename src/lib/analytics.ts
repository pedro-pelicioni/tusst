import { track } from "@vercel/analytics";

// Thin, fail-safe wrapper over Vercel Analytics custom events. The event
// names are a closed set so dashboards never drift from the code; calls are
// no-ops on the server and swallow every error (analytics must never break
// the page).

export type AnalyticsEvent =
  | "login_view"
  | "login_provider_click"
  | "hero_chosen"
  | "map_open"
  | "mission_enter"
  | "mission_complete"
  | "armory_buy"
  | "armory_equip";

export function trackEvent(
  name: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  try {
    track(name, props);
  } catch {
    // Analytics is best-effort — never surface a failure to the player.
  }
}
