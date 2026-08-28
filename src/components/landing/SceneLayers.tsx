// Server component: renders a scene's illustration as a stack of
// absolutely-positioned next/image layers. Layers with a `plx` factor
// get bleed (.ld-layer) so scroll translation never exposes an edge;
// `mouse` adds an inner wrapper the pointer-lerp can move without
// fighting the scroll transform. A layer whose file does not exist yet
// is simply skipped — each scene paints a CSS-gradient stand-in
// (landing.css), so the page works before the art lands.

import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const existsCache = new Map<string, boolean>();

export function hasLandingAsset(publicPath: string): boolean {
  let known = existsCache.get(publicPath);
  if (known === undefined) {
    known = fs.existsSync(path.join(process.cwd(), "public", publicPath));
    existsCache.set(publicPath, known);
  }
  return known;
}

export interface SceneLayer {
  src: string;
  /** scroll-parallax factor (0 = static backdrop) */
  plx?: number;
  /** pointer-parallax factor (hero only) */
  mouse?: number;
  /** LCP layers only */
  priority?: boolean;
  /** above-the-fold, non-LCP layers */
  eager?: boolean;
  quality?: 60 | 75;
  className?: string;
}

export function SceneLayers({
  layers,
  sizes = "100vw",
}: {
  layers: SceneLayer[];
  sizes?: string;
}) {
  return (
    <>
      {layers
        .filter((layer) => hasLandingAsset(layer.src))
        .map((layer) => {
          const image = (
            <Image
              src={layer.src}
              alt=""
              fill
              sizes={sizes}
              priority={layer.priority}
              loading={layer.priority ? undefined : layer.eager ? "eager" : undefined}
              quality={layer.quality ?? 60}
              className={`object-cover ${layer.className ?? ""}`}
            />
          );
          return (
            <div
              key={layer.src}
              aria-hidden
              data-plx={layer.plx || undefined}
              className={layer.plx ? "ld-layer ld-plx" : "absolute inset-0"}
            >
              {layer.mouse ? (
                <div className="absolute inset-0" data-plx-mouse={layer.mouse}>
                  {image}
                </div>
              ) : (
                image
              )}
            </div>
          );
        })}
    </>
  );
}
