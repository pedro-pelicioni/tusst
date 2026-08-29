// Device hints for surfaces that degrade on touch.
//
// NOTE (29/08/2026): the Forge's LAYOUT no longer asks this — it reads the
// viewport through matchMedia (see components/ide/useIdeLayout.ts), because
// UA sniffing sent an iPad in landscape (1366px) to the phone layout and left
// a half-screen desktop window with three clipped columns. What is genuinely
// a device trait — a coarse pointer, no extension wallet — still belongs here.

/** QA escape hatch: ?mobile=1 forces the compact Forge on any device. */
export function forgeCompactOverride(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("mobile") === "1";
  } catch {
    return false;
  }
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  if (forgeCompactOverride()) return true;
  const ua = navigator.userAgent;
  // iPadOS 13+ masquerades as macOS; the multi-touch screen is the tell.
  const apple =
    /iPhone|iPad|iPod/.test(ua) ||
    (/\bMacintosh\b/.test(ua) && navigator.maxTouchPoints > 1);
  const android = /\bAndroid\b/.test(ua);
  return apple || android;
}
