// Normalizes the Higgsfield masters in art-src/v2/ (gitignored) into the
// optimized WebP set the v2 surfaces serve from public/v2/. Sibling of
// scripts/landing-assets.mjs — deliberately NOT an import of it, so the
// landing pipeline stays untouched and independently tunable. Re-run after
// regenerating any master:
//
//   npm run assets:v2
//
// Slot briefs (dimensions, matte vs keyed, Higgsfield prompts) live in
// docs/ART-BRIEFS-v2.md. Keyed layers are generated on a flat light-gray
// backdrop and cut here by color distance, same as the landing hero layers.

import { mkdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "art-src", "v2");
const OUT = path.join(ROOT, "public", "v2");

const KEY_START = 12;
const KEY_FULL = 64;

// Copy of the landing pipeline's gray-key matte (see landing-assets.mjs for
// the full commentary on each pass).
async function grayKey(file, opts = {}) {
  const keyStart = opts.keyStart ?? KEY_START;
  const keyFull = opts.keyFull ?? KEY_FULL;
  const alphaSteps = opts.alphaSteps ?? 0;
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const sample = (x, y) => {
    const i = (y * info.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  // Default: top-row sampling (landing convention — subjects clear of the
  // top edge). bgCenter: sample mid-height instead, for masters whose props
  // touch the top edge but keep the center empty.
  const y = opts.bgCenter ? Math.floor(info.height / 2) : 4;
  const xs = opts.bgCenter
    ? [Math.floor(info.width * 0.4), Math.floor(info.width * 0.5), Math.floor(info.width * 0.6)]
    : [6, Math.floor(info.width / 2), info.width - 7];
  const points = xs.map((x) => sample(x, y));
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
      keyed = Math.round((keyed / 255) * alphaSteps) * Math.round(255 / alphaSteps);
      if (keyed > 255) keyed = 255;
    }
    if (keyed < data[i + 3]) data[i + 3] = keyed;

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
  const blur1ch = async (buffer, sigma) => {
    const out = await sharp(buffer, raw1).blur(sigma).toColourspace("b-w").raw().toBuffer();
    if (out.length !== dims.width * dims.height) {
      throw new Error(`1ch blur returned ${out.length} bytes, expected ${dims.width * dims.height}`);
    }
    return out;
  };

  let alphaSmooth;
  if (opts.erode) {
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

  const joined = await sharp(rgb, { raw: { ...dims, channels: 3 } })
    .joinChannel(alphaSmooth, { raw: { ...dims, channels: 1 } })
    .png()
    .toBuffer();
  return sharp(joined);
}

/** @type {{src: string, out: string, kind: "scene"|"key"|"alpha", budgetKB: number, resize?: {width: number, height?: number}, key?: object, alphaQuality?: number, trim?: boolean}[]} */
const JOBS = [
  // ── The Hall (home at /path) ──────────────────────────────────────
  { src: "hall-bg.png", out: "home/hall-bg.webp", kind: "scene", budgetKB: 380, resize: { width: 2560 } },
  // Painterly gray backdrops carry ±20 shades of texture — key harder than
  // the landing default or the whole canvas keeps alpha slivers and the
  // webp balloons (first run: 2.2MB).
  { src: "hall-mid-raw.png", out: "home/hall-mid.webp", kind: "key", budgetKB: 400, resize: { width: 3840 }, alphaQuality: 85, key: { erode: true, keyStart: 30, keyFull: 92, bgCenter: true } },
  { src: "door-journey.png", out: "home/door-journey.webp", kind: "scene", budgetKB: 220, resize: { width: 1200 } },
  { src: "door-campaign.png", out: "home/door-campaign.webp", kind: "scene", budgetKB: 220, resize: { width: 1200 } },
  { src: "forge-vignette.png", out: "home/forge-vignette.webp", kind: "scene", budgetKB: 220, resize: { width: 1200 } },

  // ── The Forge (labs index + player backdrops) ─────────────────────
  { src: "forge-bg.png", out: "labs/forge-bg.webp", kind: "scene", budgetKB: 380, resize: { width: 2560 } },
  { src: "emblem-wallet-onboarding.png", out: "labs/emblems/wallet-onboarding.webp", kind: "alpha", budgetKB: 120, resize: { width: 800 }, alphaQuality: 90, trim: true },
  { src: "emblem-oz-token-wizard.png", out: "labs/emblems/oz-token-wizard.webp", kind: "alpha", budgetKB: 120, resize: { width: 800 }, alphaQuality: 90, trim: true },
  { src: "emblem-passkey-smart-wallet.png", out: "labs/emblems/passkey-smart-wallet.webp", kind: "alpha", budgetKB: 160, resize: { width: 800 }, alphaQuality: 90, trim: true },
  { src: "emblem-scp-simulator.png", out: "labs/emblems/scp-simulator.webp", kind: "alpha", budgetKB: 120, resize: { width: 800 }, alphaQuality: 90, trim: true },

  // ── The Journey (map + chapter sigils, slug-named) ────────────────
  { src: "journey-bg.png", out: "journey/map-bg.webp", kind: "scene", budgetKB: 380, resize: { width: 2560 } },
  { src: "sigil-1.png", out: "journey/sigils/think-before-you-forge.webp", kind: "alpha", budgetKB: 100, resize: { width: 640 }, alphaQuality: 90, trim: true },
  { src: "sigil-2.png", out: "journey/sigils/the-realm-of-stellar.webp", kind: "alpha", budgetKB: 100, resize: { width: 640 }, alphaQuality: 90, trim: true },
  { src: "sigil-3.png", out: "journey/sigils/anatomy-of-a-transaction.webp", kind: "alpha", budgetKB: 100, resize: { width: 640 }, alphaQuality: 90, trim: true },
];

async function run() {
  const rows = [];
  let missing = 0;

  for (const job of JOBS) {
    const srcPath = path.join(SRC, job.src);
    // Masters land incrementally — a missing source is fine, the UI has a
    // CSS/glyph stand-in for every slot. Report it and move on.
    if (!existsSync(srcPath)) {
      missing++;
      rows.push({ out: job.out, dims: "—", kb: 0, budgetKB: job.budgetKB, over: false, missing: true });
      continue;
    }
    const outPath = path.join(OUT, job.out);
    await mkdir(path.dirname(outPath), { recursive: true });

    let img = job.kind === "key" ? await grayKey(srcPath, job.key) : sharp(srcPath);
    if (job.trim) {
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

    const buffer = await img
      .webp({ quality: 82, alphaQuality: job.alphaQuality ?? 80, effort: 5 })
      .toBuffer();
    await writeFile(outPath, buffer);

    const meta = await sharp(buffer).metadata();
    const kb = Math.round((await stat(outPath)).size / 1024);
    rows.push({ out: job.out, dims: `${meta.width}x${meta.height}`, kb, budgetKB: job.budgetKB, over: kb > job.budgetKB });
  }

  console.log("\nv2 assets → public/v2/\n");
  for (const r of rows) {
    if (r.missing) {
      console.log(`· ${r.out.padEnd(36)} (master not in art-src/v2 yet — stand-in stays)`);
      continue;
    }
    console.log(
      `${r.over ? "✗" : "✓"} ${r.out.padEnd(36)} ${r.dims.padEnd(11)} ${String(r.kb).padStart(5)} KB  (budget ${r.budgetKB} KB)`,
    );
  }
  if (missing) console.log(`\n${missing} slot(s) still waiting on masters — see docs/ART-BRIEFS-v2.md`);
  if (rows.some((r) => r.over)) {
    console.error("✗ some assets exceed their budget — raise compression or fix the master");
    process.exitCode = 1;
  }
}

await run();
