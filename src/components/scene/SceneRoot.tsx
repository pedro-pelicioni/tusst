// Server wrapper for a cinematic surface. The root carries `data-js`
// statically (reveals start hidden pre-paint on SSR loads AND client
// navigations alike), and a <noscript> style forces everything visible when
// JS is off — same fail-safe as the landing's JsGate, without an inline
// <script>, which React never executes on client-side navigations and
// loudly warns about (Next 16 console error, seen 2026-08-28).

import type { ReactNode } from "react";
import { SceneMotion } from "./SceneMotion";
import "./scene.css";

export function SceneRoot({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} data-scene-root data-js="" className={className}>
      <noscript>
        <style>{`[data-scene-root][data-js] [data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>
      {children}
      <SceneMotion rootId={id} />
    </div>
  );
}
