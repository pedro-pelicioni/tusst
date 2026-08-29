"use client";

import { useSyncExternalStore } from "react";

// A live subscription, unlike the one-shot `matchMedia(...).matches` read the
// SCP sim does at action time. Toggling Reduce Motion in the OS now settles
// every visual on screen instead of only affecting the next interaction.
//
// The CSS kill switch (scene.css + visuals.css) already stops declarative
// animation; this is for the JS-driven parts — steppers and cascades — which
// jump straight to their terminal state instead of animating there.

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
