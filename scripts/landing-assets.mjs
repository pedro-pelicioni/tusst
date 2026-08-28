// Normalizes the Higgsfield masters in art-src/landing/ (gitignored)
// into the optimized WebP set the landing page serves from
// public/landing/. Re-run after regenerating any master:
//
//   npm run assets:landing
//
// Parallax cutout layers (hero far/mid/fg) are generated on a flat
// light-gray backdrop and keyed here by color distance — the dedicated
// background-remover is saliency-based and drops the dark rock masses
// these layers are made of.

import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "art-src", "landing");
const OUT = path.join(ROOT, "public", "landing");

const KEY_START = 12; // color distance where alpha starts
const KEY_FULL = 64; // color distance that is fully opaque (wide ramp = soft edge)

async function grayKey(file, opts = {}) {
  const keyStart = opts.keyStart ?? KEY_START;
  const keyFull = opts.keyFull ?? KEY_FULL;
  const alphaSteps = opts.alphaSteps ?? 0; // 0 = continuous
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // The backdrop is flat; sample it along the top edge (subjects never
  // touch it there in these layers).
  const sample = (x) => {
    const i = (4 * info.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const points = [sample(6), sample(Math.floor(info.width / 2)), sample(info.width - 7)];
  const bg = [0, 1, 2].map((c) => points.reduce((acc, p) => acc + p[c], 0) / points.length);

  for (let i = 0; i < data.length; i += 4) {
    const d = Math.max(
      Math.abs(data[i] - bg[0]),
      Math.abs(data[i + 1] - bg[1]),
      Math.abs(data[i + 2] - bg[2]),
    );
    let a = (d - keyStart) / (keyFull - keyStart);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    let keyed = Math.round(a * 255);
    if (alphaSteps > 0) {
      // quantizing the alpha kills the per-pixel noise that makes soft
      // mist layers balloon in size
      keyed = Math.round((keyed / 255) * alphaSteps) * Math.round(255 / alphaSteps);
      if (keyed > 255) keyed = 255;
    }
    if (keyed < data[i + 3]) data[i + 3] = keyed;

    // defringe: edge pixels are contaminated by the light-gray backdrop;
    // pull semi-transparent colors toward the scene's dark violet so the
    // fringe disappears against the night art. Fully transparent pixels
    // get the same dark color, so the alpha blur below never reveals the
    // gray backdrop as a halo.
    const alpha = data[i + 3];
    if (alpha === 0) {
      data[i] = 10;
      data[i + 1] = 7;
      data[i + 2] = 20;
    } else if (alpha < 255) {
      const blend = (1 - alpha / 255) * 0.85;
      data[i] = Math.round(data[i] * (1 - blend) + 10 * blend);
      data[i + 1] = Math.round(data[i + 1] * (1 - blend) + 7 * blend);
      data[i + 2] = Math.round(data[i + 2] * (1 - blend) + 20 * blend);
    }
  }

  // clean the matte edge in three sequential passes (each materialized —
  // sharp reorders chained ops internally):
  //   1. blur wide, 2. steep ramp centered ABOVE mid-gray → erodes the
  //   contour ~1px inward, discarding the outermost opaque ring that is
  //   still contaminated by the gray backdrop (the visible pale fringe),
  //   3. tiny blur → smooth antialiased silhouette.
  const dims = { width: info.width, height: info.height };
  const raw1 = { raw: { ...dims, channels: 1 } };
  const rgb = await sharp(data, { raw: { ...dims, channels: 4 } })
    .removeAlpha()
    .raw()
    .toBuffer();
  const original = await sharp(data, { raw: { ...dims, channels: 4 } })
    .extractChannel(3)
    .raw()
    .toBuffer();
  // NOTE: a 1-channel raw INPUT comes back 3-channel from .raw() unless
  // the pipeline is pinned to b-w — hence toColourspace + the asserts.
  const blur1ch = async (buffer, sigma) => {
    const out = await sharp(buffer, raw1).blur(sigma).toColourspace("b-w").raw().toBuffer();
    if (out.length !== dims.width * dims.height) {
      throw new Error(`1ch blur returned ${out.length} bytes, expected ${dims.width * dims.height}`);
    }
    return out;
  };

  let alphaSmooth;
  if (opts.erode) {
    // eroded hard matte: blur + steep ramp centered above mid-gray pulls
    // the opaque contour ~1px inward, discarding the outermost opaque
    // ring still contaminated by the gray backdrop (the pale fringe).
    // Only for hard-silhouette layers — it destroys soft mist/glow.
    const eroded = await blur1ch(original, 1.4);
    for (let i = 0; i < eroded.length; i++) {
      const v = (eroded[i] - 168) * 3.4 + 128;
      eroded[i] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
    alphaSmooth = Buffer.alloc(original.length);
    for (let i = 0; i < original.length; i++) {
      alphaSmooth[i] = original[i] >= 200 ? Math.min(original[i], eroded[i]) : original[i];
    }
  } else {
    alphaSmooth = original;
  }
  alphaSmooth = await blur1ch(alphaSmooth, 0.6);

  // materialize before returning: joinChannel silently disables a
  // later .resize() on the same pipeline, so hand back a fresh instance
  const joined = await sharp(rgb, { raw: { ...dims, channels: 3 } })
    .joinChannel(alphaSmooth, { raw: { ...dims, channels: 1 } })
    .png()
    .toBuffer();
  return sharp(joined);
}

/** @type {{src: string, out: string, kind: "scene"|"key"|"alpha", budgetKB: number, resize?: {width: number, height?: number}, jpeg?: boolean}[]} */
const JOBS = [
  { src: "hero-sky.png", out: "hero/sky.webp", kind: "scene", budgetKB: 350 },
  // distant blurry layer: half resolution reads identically and the huge
  // soft-alpha mist region is what costs bytes
  { src: "hero-far-raw.png", out: "hero/far.webp", kind: "key", budgetKB: 250, resize: { width: 1600 }, alphaQuality: 60, key: { keyStart: 30, keyFull: 115, alphaSteps: 6 } },
  { src: "hero-mid-raw.png", out: "hero/mid.webp", kind: "key", budgetKB: 450, resize: { width: 3840 }, alphaQuality: 90, key: { erode: true } },
  { src: "hero-fg-raw.png", out: "hero/fg.webp", kind: "key", budgetKB: 450, resize: { width: 3840 }, alphaQuality: 90 },
  // adventuring party sprite: saliency-cut (the characters ARE the
  // subject, unlike the rock layers), tight-trimmed, placed by HeroScene
  { src: "hero-party-cut.png", out: "hero/party.webp", kind: "alpha", budgetKB: 200, resize: { width: 1400 }, alphaQuality: 90, trim: true },
  { src: "intro-scene.png", out: "intro/scene.webp", kind: "scene", budgetKB: 350 },
  { src: "intro-character-cut.png", out: "intro/character.webp", kind: "alpha", budgetKB: 250, resize: { width: 1200 } },
  { src: "carousel-bg.png", out: "carousel/bg.webp", kind: "scene", budgetKB: 250 },
  { src: "feature-campaign.png", out: "features/campaign.webp", kind: "scene", budgetKB: 350 },
  { src: "feature-boss.png", out: "features/boss.webp", kind: "scene", budgetKB: 350 },
  { src: "feature-forge.png", out: "features/forge.webp", kind: "scene", budgetKB: 350 },
  { src: path.join("..", "..", "docs", "screenshots", "forge-ide.png"), out: "features/forge-card.webp", kind: "scene", budgetKB: 200, resize: { width: 1280 } },
  // Provisional OG (hero master crop). Phase 5 replaces it with a real
  // screenshot of the finished hero so the typography is genuine.
  { src: "hero-master.png", out: "og.jpg", kind: "scene", budgetKB: 300, resize: { width: 1200, height: 630 }, jpeg: true },
];

const HERO_LAYER_OUTS = ["hero/sky.webp", "hero/far.webp", "hero/mid.webp", "hero/fg.webp"];

async function run() {
  const rows = [];
  const heroDims = new Map();

  for (const job of JOBS) {
    const srcPath = path.join(SRC, job.src);
    const outPath = path.join(OUT, job.out);
    await mkdir(path.dirname(outPath), { recursive: true });

    let img = job.kind === "key" ? await grayKey(srcPath, job.key) : sharp(srcPath);
    if (job.trim) {
      // materialize first — sharp reorders chained ops, and trim must see
      // the keyed alpha
      img = sharp(await img.png().toBuffer()).trim({ threshold: 12 });
    }
    if (job.resize) {
      img = img.resize({
        width: job.resize.width,
        height: job.resize.height,
        fit: job.resize.height ? "cover" : "inside",
        withoutEnlargement: !job.resize.height,
      });
    }

    const buffer = job.jpeg
      ? await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer()
      : await img.webp({ quality: 82, alphaQuality: job.alphaQuality ?? 80, effort: 5 }).toBuffer();
    await writeFile(outPath, buffer);

    const meta = await sharp(buffer).metadata();
    // layers stack with identical object-cover, so what must match is the
    // aspect ratio — intrinsic resolution may differ per layer
    if (HERO_LAYER_OUTS.includes(job.out)) heroDims.set(job.out, (meta.width / meta.height).toFixed(3));

    const kb = Math.round((await stat(outPath)).size / 1024);
    rows.push({ out: job.out, dims: `${meta.width}x${meta.height}`, kb, budgetKB: job.budgetKB, over: kb > job.budgetKB });
  }

  const heroSizes = new Set(heroDims.values());
  console.log("\nlanding assets → public/landing/\n");
  for (const r of rows) {
    console.log(
      `${r.over ? "✗" : "✓"} ${r.out.padEnd(26)} ${r.dims.padEnd(11)} ${String(r.kb).padStart(5)} KB  (budget ${r.budgetKB} KB)`,
    );
  }
  const heroTotal = rows
    .filter((r) => HERO_LAYER_OUTS.includes(r.out))
    .reduce((acc, r) => acc + r.kb, 0);
  console.log(`\nhero layers total: ${heroTotal} KB (sources; delivery is resized AVIF via next/image)`);
  if (heroSizes.size > 1) {
    console.error(`✗ hero layers disagree on aspect ratio: ${[...heroDims.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`);
    process.exitCode = 1;
  }
  if (rows.some((r) => r.over)) {
    console.error("✗ some assets exceed their budget — raise compression or fix the master");
    process.exitCode = 1;
  }
}

await run();
