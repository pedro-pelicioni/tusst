// Server component: a scene's illustration as absolutely-positioned
// next/image layers — the landing's SceneLayers pattern, generalized for the
// v2 surfaces. A layer whose file does not exist yet is simply skipped; each
// scene paints a CSS-gradient stand-in (scene.css), so every page works
// before the Higgsfield art lands.

import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const existsCache = new Map<string, boolean>();

export function hasV2Asset(publicPath: string): boolean {
  let known = existsCache.get(publicPath);
  if (known === undefined) {
    known = fs.existsSync(path.join(process.cwd(), "public", publicPath));
    existsCache.set(publicPath, known);
  }
  return known;
}

export interface SceneArtLayer {
  src: string;
  /** scroll-parallax factor (0 = static backdrop) */
  plx?: number;
  /** pointer-parallax factor */
  mouse?: number;
  priority?: boolean;
  eager?: boolean;
  quality?: 60 | 75;
  className?: string;
}

export function SceneArt({
  layers,
  sizes = "100vw",
}: {
  layers: SceneArtLayer[];
  sizes?: string;
}) {
  return (
    <>
      {layers
        .filter((layer) => hasV2Asset(layer.src))
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
              className={layer.plx ? "sc-layer sc-plx" : "absolute inset-0"}
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
