// Server wrapper for a cinematic surface. Stamps `data-js` with a
// render-blocking inline script during HTML parse (the landing's JsGate
// trick) so reveals never flash, and mounts the SceneMotion client island
// that drives reveals + parallax for everything inside.

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
    // suppressHydrationWarning: the gate script stamps `data-js` during
    // parse, before hydration — same as the landing's #landing root.
    <div id={id} data-scene-root suppressHydrationWarning className={className}>
      <script
        // Runs during parse, before first paint — no hydration flash.
        dangerouslySetInnerHTML={{
          __html: `document.currentScript.parentElement.setAttribute("data-js","")`,
        }}
      />
      {children}
      <SceneMotion rootId={id} />
    </div>
  );
}
