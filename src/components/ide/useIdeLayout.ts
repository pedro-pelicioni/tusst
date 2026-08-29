"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  IDE_LAYOUT_DEFAULTS,
  loadIdeLayout,
  saveIdeLayout,
  type IdeLayoutState,
} from "@/lib/forge-store";

// The Forge's layout brain.
//
// Two things used to be conflated here and are now separated on purpose:
//
//   WIDTH decides the layout. Read live from matchMedia, so dragging the
//   window across a breakpoint re-lays the smithy without a reload. This
//   replaces a one-shot `isMobileDevice()` UA sniff that froze at mount —
//   which is why an iPad in landscape (1366px) always got the phone layout
//   and a half-screen desktop window got three clipped columns.
//
//   TOUCH decides the notice and the tutorial. That still comes from the UA
//   helper, because "has a coarse pointer" is not "is narrow".
//
// useSyncExternalStore is the right primitive for a browser media query:
// getServerSnapshot pins SSR/hydration to `desktop`, then the client
// re-renders with the truth on the first commit. No hydration mismatch.

export type IdeLayoutClass = "phone" | "narrow" | "desktop";

const NARROW_MQ = "(min-width: 768px)";
const DESKTOP_MQ = "(min-width: 1280px)";

/** Panes below these never shrink; the shell clamps against them on drag. */
export const PANE_LIMITS = {
  filesW: { min: 150, max: 420 },
  panelW: { min: 280, max: 640 },
  consoleH: { min: 96, max: 560 },
} as const;

export function clampPane(key: keyof typeof PANE_LIMITS, value: number): number {
  const { min, max } = PANE_LIMITS[key];
  return Math.min(Math.max(Math.round(value), min), max);
}

function subscribe(onChange: () => void): () => void {
  const narrow = window.matchMedia(NARROW_MQ);
  const desktop = window.matchMedia(DESKTOP_MQ);
  narrow.addEventListener("change", onChange);
  desktop.addEventListener("change", onChange);
  return () => {
    narrow.removeEventListener("change", onChange);
    desktop.removeEventListener("change", onChange);
  };
}

function getSnapshot(): IdeLayoutClass {
  if (window.matchMedia(DESKTOP_MQ).matches) return "desktop";
  if (window.matchMedia(NARROW_MQ).matches) return "narrow";
  return "phone";
}

function getServerSnapshot(): IdeLayoutClass {
  return "desktop";
}

export function useLayoutClass(): IdeLayoutClass {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export interface IdeLayout {
  /** live width class — changes as the window is dragged */
  layout: IdeLayoutClass;
  /** below desktop the side panes float over the editor instead of taking columns */
  overlayPanes: boolean;
  panes: IdeLayoutState;
  toggle: (pane: "filesOpen" | "panelOpen" | "consoleOpen") => void;
  setOpen: (pane: "filesOpen" | "panelOpen" | "consoleOpen", open: boolean) => void;
  resize: (key: keyof typeof PANE_LIMITS, value: number) => void;
  resetPane: (key: keyof typeof PANE_LIMITS) => void;
  setPanelTab: (tab: string) => void;
  setMobileTab: (tab: "editor" | "console") => void;
}

export function useIdeLayout(): IdeLayout {
  const layout = useLayoutClass();
  const overlayPanes = layout !== "desktop";
  const [panes, setPanes] = useState<IdeLayoutState>(IDE_LAYOUT_DEFAULTS);
  const hydrated = useRef(false);

  // localStorage is a browser-only external store, so hydration is an effect
  // (same shape as the project/wallet hydration elsewhere in the shell).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setPanes(loadIdeLayout());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Skip exactly one pass. Both effects run in the SAME first commit, and this
  // one runs second — with `panes` still holding the defaults, because the
  // hydrating setState has not re-rendered yet. Persisting there would write
  // the defaults straight over the stored layout on every single page load,
  // which is precisely what it did until this guard existed.
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    saveIdeLayout(panes);
  }, [panes]);

  const toggle = useCallback((pane: "filesOpen" | "panelOpen" | "consoleOpen") => {
    setPanes((prev) => ({ ...prev, [pane]: !prev[pane] }));
  }, []);

  const setOpen = useCallback(
    (pane: "filesOpen" | "panelOpen" | "consoleOpen", open: boolean) => {
      setPanes((prev) => (prev[pane] === open ? prev : { ...prev, [pane]: open }));
    },
    [],
  );

  const resize = useCallback((key: keyof typeof PANE_LIMITS, value: number) => {
    setPanes((prev) => ({ ...prev, [key]: clampPane(key, value) }));
  }, []);

  const resetPane = useCallback((key: keyof typeof PANE_LIMITS) => {
    setPanes((prev) => ({ ...prev, [key]: IDE_LAYOUT_DEFAULTS[key] }));
  }, []);

  const setPanelTab = useCallback((tab: string) => {
    setPanes((prev) => ({ ...prev, panelTab: tab }));
  }, []);

  const setMobileTab = useCallback((tab: "editor" | "console") => {
    setPanes((prev) => ({ ...prev, mobileTab: tab }));
  }, []);

  return {
    layout,
    overlayPanes,
    panes,
    toggle,
    setOpen,
    resize,
    resetPane,
    setPanelTab,
    setMobileTab,
  };
}

/**
 * VS Code muscle memory: ⌘B files, ⌘⌥B the side panel, ⌘J console.
 * Capture phase so Monaco — which owns keydown while focused — never eats it.
 * The handlers live in the shell because what "toggle" means depends on the
 * live layout: a persisted column on desktop, an ephemeral overlay below it.
 */
export function useIdeShortcuts(handlers: {
  onToggleFiles: () => void;
  onTogglePanel: () => void;
  onToggleConsole: () => void;
}) {
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return;
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        if (e.altKey) ref.current.onTogglePanel();
        else ref.current.onToggleFiles();
      } else if (key === "j") {
        e.preventDefault();
        ref.current.onToggleConsole();
      }
    }
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);
}
