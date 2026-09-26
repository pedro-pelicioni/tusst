"use client";

// Fires one analytics event when the surface mounts and renders nothing.
// A ref guards against React Strict Mode's double effect in development.

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export function TrackView({
  name,
  props,
}: {
  name: AnalyticsEvent;
  props?: Record<string, string | number | boolean>;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(name, props);
    // Fire once per mount — the event identity is the mount itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
