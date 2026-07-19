// Phone/tablet detection for surfaces that degrade on touch (the Forge IDE).
// UA-based on purpose: an iPad in landscape is still an iPad — no extension
// wallets, no hover, cramped multi-pane layouts — regardless of viewport size.

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  // QA escape hatch: ?mobile=1 forces the compact layout on any device.
  try {
    if (new URLSearchParams(window.location.search).get("mobile") === "1") return true;
  } catch {
    // Ignore — fall through to UA detection.
  }
  const ua = navigator.userAgent;
  // iPadOS 13+ masquerades as macOS; the multi-touch screen is the tell.
  const apple =
    /iPhone|iPad|iPod/.test(ua) ||
    (/\bMacintosh\b/.test(ua) && navigator.maxTouchPoints > 1);
  const android = /\bAndroid\b/.test(ua);
  return apple || android;
}
