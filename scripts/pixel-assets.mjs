// Normalizes the overworld masters in art-src/v2/overworld/ (gitignored) into
// the WebP set the RPG surfaces serve: the three island/world maps under
// public/v2/overworld/, the landing-hero island under public/landing/hero/,
// and — next phase — the hero sheets and boss keys. Sibling of
// scripts/v2-assets.mjs, deliberately NOT an import of it, so the painterly
// pipeline stays independently tunable. Re-run after regenerating any master:
//
//   npm run assets:pixel
//
// Four kinds:
//   "pixel" — maps. Downscale with a nearest-neighbour kernel so pixel
//             clusters stay crisp (no lanczos smear), then encode
//             near-lossless. If that blows the budget the job falls back to a
//             lossy encode and says so in the table.
//   "scene" — a lossy full-bleed export (the landing hero background), same
//             settings as v2-assets' scene jobs.
//   "key"   — subject on a flat light-gray backdrop, cut by color distance
//             (bosses). Same gray-key pass as v2-assets.
//   "alpha" — master already carries its alpha (the hero sheets came out of
//             gpt_image_2_5 with background:"transparent"). No key pass;
//             near-lossless first, lossy fallback like "pixel".
//
// `regrid` (hero sheets): the app addresses a 4×2 sheet by
// background-position, so the output must be exactly cols×cell by rows×cell
// with every figure inside its own equal cell. The generated grid is never
// pixel-exact (and the masters are 16:9, not 2:1), so the step finds the
// emptiest cut lines near the nominal boundaries, crops each figure to its
// alpha bbox, and composites the 8 figures into a fresh canvas — one uniform
// scale for the whole sheet (the largest figure fits the cell minus padding)
// so the hero keeps its proportions from form to form.
//
// Slot briefs (dimensions, prompts, settings) live in docs/ART-BRIEFS-v2.md
// under "Overworld".

import { mkdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "art-src", "v2", "overworld");
const OUT = path.join(ROOT, "public");
const ONLY = process.argv.slice(2);

const KEY_START = 12;
const KEY_FULL = 64;

// Copy of the v2/landing gray-key matte (see landing-assets.mjs for the full
// commentary on each pass). Kept verbatim so heroes/bosses key identically to
// the sigils and seals.
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
  // Default: top-row sampling (subjects clear of the top edge). bgCenter:
  // sample mid-height instead, for masters whose props touch the top edge
  // but keep the center empty.
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

// Encoders. `out` is relative to public/ (not public/v2/) because the landing
// island lands under public/landing/.
const PIXEL_NEAR_LOSSLESS = { nearLossless: true, quality: 90, effort: 5 };
const PIXEL_LOSSY = { quality: 88, effort: 6 };
const SCENE = { quality: 82, alphaQuality: 80, effort: 5 };

// Keep in step with HEROES in src/content/heroes.ts — the playable roster.
// `stroopbeholder` is deliberately absent: it is the Act VII boss, not a hero.
const HERO_IDS = [
  "stroowarrior",
  "stropillusion",
  "stroopkeeper",
  "stroophantom",
  "strooracle",
  "astrostroopie",
  "stroopzipper",
];
// 3 journey region bosses + 8 act overlords. Slot ids match the `boss` field
// in src/content/overworld/*-world.ts (regions ids / act trackSlugs).
const BOSS_SLOTS = [
  "foundations",
  "craft",
  "realm",
  "rust-fundamentals",
  "control-flow",
  "rust-standard-library",
  "mastering-option",
  "mastering-result",
  "stellar-101",
  "soroban-smart-contracts",
  "stellar-protocol-27",
];

/** Sheet geometry the app relies on — see HERO_SHEET_COLS/ROWS in src/lib/hero.ts. */
const HERO_SHEET = { cols: 4, rows: 2, cell: 256, pad: 8 };

/**
 * Armory slots — one 4x2 sheet of 8 cosmetics each, cell n = the item whose
 * `cell` is n in src/content/armory.ts. Same geometry as the hero sheets, so
 * the app addresses both through the one `sheetPosition()` helper.
 */
const ARMORY_SHEETS = ["weapons", "equipment", "mascots"];

/** @type {{src: string, out: string, kind: "pixel"|"scene"|"key"|"alpha", budgetKB: number, resize?: {width: number, height?: number}, key?: object, alphaQuality?: number, trim?: boolean, regrid?: {cols: number, rows: number, cell: number, pad?: number, anchor?: "center"|"bottom", alphaMin?: number}}[]} */
const JOBS = [
  // ── Maps (Phase 2) ────────────────────────────────────────────────
  // The engine sizes one <img> at max(100vw, 150dvh) and pans it, so these
  // ship at 2560 wide — the largest the camera can ask for on a 2x laptop.
  { src: "journey-island.png", out: "v2/overworld/journey-island.webp", kind: "pixel", budgetKB: 1400, resize: { width: 2560 } },
  { src: "campaign-island.png", out: "v2/overworld/campaign-island.webp", kind: "pixel", budgetKB: 1400, resize: { width: 2560 } },
  { src: "world-map.png", out: "v2/overworld/world-map.webp", kind: "pixel", budgetKB: 1200, resize: { width: 2560 } },
  // The Harbor (Advanced Path). Its master came out of gpt_image_2_5 at
  // 2048×1360; `withoutEnlargement` keeps it there rather than smearing a
  // 1.25× nearest-neighbour upscale into it.
  { src: "harbor-island.png", out: "v2/overworld/harbor-island.webp", kind: "pixel", budgetKB: 1400, resize: { width: 2560 } },
  // The landing hero reuses the Journey master as its background layer. It
  // sits under a scrim and a parallax transform, so lossy is fine there and
  // the budget is a third of the map's.
  { src: "journey-island.png", out: "landing/hero/island.webp", kind: "scene", budgetKB: 520, resize: { width: 2560 } },

  // ── Heroes (Phase 6) — 4×2 sheets of 8 forms + 8 bust portraits ───────
  // Masters: hero-<id>-forms.png / hero-<id>-portraits.png, transparent PNGs
  // from gpt_image_2_5 (2688×1520, 16:9 — the model has no 2:1). The regrid
  // step turns each into the exact 1024×512 / 256px-cell sheet the app
  // addresses. Forms sit on a shared baseline (feet on the cell floor, so the
  // walk bob and the map anchor stay put form to form); portraits center.
  // ── Hero animation sheets (Phase 8) — 4×2 of 8 REAL frames ───────────
  // Masters: hero-<id>-anim.png. Row 0 is a 4-frame side-view walk cycle,
  // row 1 a 4-frame signature action, so one sheet drives both loops: the
  // CSS steps background-position-x across a row (0 → 133.333% in steps(4),
  // which lands exactly on the four columns of a 400% background) and picks
  // the row with background-position-y. `anchor: "bottom"` matters more here
  // than anywhere else — the feet must sit on one baseline or the character
  // bounces as the frames advance.
  ...HERO_IDS.map((id) => ({
    src: `hero-${id}-anim.png`,
    out: `v2/overworld/heroes/${id}/anim.webp`,
    kind: "alpha",
    budgetKB: 160,
    alphaQuality: 78,
    regrid: { ...HERO_SHEET, anchor: "bottom" },
  })),

  ...HERO_IDS.flatMap((id) => [
    { src: `hero-${id}-forms.png`, out: `v2/overworld/heroes/${id}/forms.webp`, kind: "alpha", budgetKB: 160, alphaQuality: 78, regrid: { ...HERO_SHEET, anchor: "bottom" } },
    { src: `hero-${id}-portraits.png`, out: `v2/overworld/heroes/${id}/portraits.webp`, kind: "alpha", budgetKB: 160, alphaQuality: 82, regrid: { ...HERO_SHEET, anchor: "center" } },
  ]),

  // ── Bosses (Phase 6) — 512 wide keyed, flat #d4d4d4 backdrop ──────────
  // Masters: boss-<slot>.png (nano_banana_pro, 2k, 1:1). Trimmed to the
  // subject, so the height varies a little per boss.
  ...BOSS_SLOTS.map((slot) => ({
    src: `boss-${slot}.png`,
    out: `v2/overworld/bosses/${slot}.webp`,
    kind: "key",
    budgetKB: 90,
    resize: { width: 512 },
    alphaQuality: 88,
    trim: true,
    key: { keyStart: 30, keyFull: 92 },
  })),

  // ── Armory (Phase 7) — 4x2 sheets of 8 cosmetics each ─────────────────
  // Masters: armory-<slot>.png, transparent PNGs from gpt_image_2_5 (same
  // settings as the hero sheets: quality high, 2k, background transparent,
  // 16:9). Items are props, not figures, so they center in their cell rather
  // than standing on a baseline — a dagger must not float to the floor of the
  // cell just because a greatsword does. One uniform scale across the sheet is
  // what keeps a dagger visibly smaller than a greatsword.
  // alphaQuality 74 (not the heroes' 82): these sheets carry big soft rim-light
  // glows, which is exactly what the alpha plane spends its bits on — mascots
  // lands at 163 KB against a 160 KB budget at 82. Lower alphaQuality before
  // quality, per the rule in docs/ART-BRIEFS-v2.md.
  ...ARMORY_SHEETS.map((slot) => ({
    src: `armory-${slot}.png`,
    out: `v2/armory/${slot}.webp`,
    kind: "alpha",
    budgetKB: 160,
    alphaQuality: 74,
    regrid: { ...HERO_SHEET, anchor: "center" },
  })),
];

// Re-cells a generated character sheet. `img` is a sharp instance with alpha
// (kind "alpha" master, or the output of grayKey). Returns a sharp instance of
// exactly cols*cell × rows*cell.
async function regrid(img, opts) {
  const { cols, rows, cell, pad = 8, anchor = "center", alphaMin = 24 } = opts;
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const alphaAt = (x, y) => data[(y * W + x) * 4 + 3];

  // Coverage profiles: how many solid pixels each column / row carries.
  const colCov = new Uint32Array(W);
  const rowCov = new Uint32Array(H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (alphaAt(x, y) >= alphaMin) {
        colCov[x]++;
        rowCov[y]++;
      }
    }
  }

  // Cut lines: the emptiest line within ±20% of a cell around each nominal
  // boundary (ties go to the line closest to nominal). A perfectly regular
  // grid resolves to the nominal boundaries; a drifted one follows the gaps.
  const cuts = (cov, n, len) => {
    const out = [0];
    for (let i = 1; i < n; i++) {
      const nominal = Math.round((i * len) / n);
      const span = Math.round((len / n) * 0.2);
      let best = nominal;
      let bestCov = Infinity;
      for (let p = Math.max(1, nominal - span); p < Math.min(len - 1, nominal + span); p++) {
        const c = cov[p];
        if (c < bestCov || (c === bestCov && Math.abs(p - nominal) < Math.abs(best - nominal))) {
          bestCov = c;
          best = p;
        }
      }
      out.push(best);
    }
    out.push(len);
    return out;
  };
  const xCuts = cuts(colCov, cols, W);
  const yCuts = cuts(rowCov, rows, H);

  // Per-cell alpha bbox.
  const boxes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = xCuts[c];
      const x1 = xCuts[c + 1];
      const y0 = yCuts[r];
      const y1 = yCuts[r + 1];
      let minX = x1;
      let maxX = x0 - 1;
      let minY = y1;
      let maxY = y0 - 1;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          if (alphaAt(x, y) >= alphaMin) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      boxes.push(maxX >= minX ? { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 } : null);
    }
  }
  const found = boxes.filter(Boolean);
  if (found.length !== cols * rows) {
    throw new Error(`regrid: found ${found.length} figures, expected ${cols * rows} (empty cells: ${boxes.map((b, i) => (b ? null : i)).filter((i) => i !== null).join(",")})`);
  }

  // One scale for the whole sheet: the largest figure fits the padded cell.
  const inner = cell - pad * 2;
  const maxDim = Math.max(...found.map((b) => Math.max(b.width, b.height)));
  const scale = inner / maxDim;

  const src = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  const composites = [];
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    const w = Math.max(1, Math.round(b.width * scale));
    const h = Math.max(1, Math.round(b.height * scale));
    const cx = (i % cols) * cell;
    const cy = Math.floor(i / cols) * cell;
    const left = cx + Math.round((cell - w) / 2);
    const top = anchor === "bottom" ? cy + cell - pad - h : cy + Math.round((cell - h) / 2);
    const input = await src.clone().extract(b).resize(w, h, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
    composites.push({ input, left, top });
  }

  const canvas = await sharp({
    create: { width: cols * cell, height: rows * cell, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(composites)
    .png()
    .toBuffer();
  return sharp(canvas);
}

async function encodePixel(img, budgetKB, alphaQuality) {
  // First pass: near-lossless keeps the pixel clusters and flat fills exact.
  let buffer = await img.clone().webp(PIXEL_NEAR_LOSSLESS).toBuffer();
  if (buffer.length / 1024 <= budgetKB) return { buffer, mode: "near-lossless" };
  // Fallback: lossy at a high quality. Pixel art survives this well because
  // the blocks are large relative to the DCT-ish artifacts. Sheets with alpha
  // keep their edges with a high alphaQuality.
  buffer = await img
    .clone()
    .webp({ ...PIXEL_LOSSY, ...(alphaQuality ? { alphaQuality } : {}) })
    .toBuffer();
  return { buffer, mode: "lossy-fallback" };
}

async function run() {
  const rows = [];
  let missing = 0;

  for (const job of JOBS) {
    // `npm run assets:pixel -- harbor` re-cuts only the jobs whose master or
    // output path contains one of the arguments; no argument runs them all.
    if (ONLY.length && !ONLY.some((f) => job.src.includes(f) || job.out.includes(f))) continue;
    const srcPath = path.join(SRC, job.src);
    // Masters land incrementally — a missing source is fine, every slot has
    // a CSS/glyph stand-in (sea gradient + region blobs for maps, the
    // CharacterAvatar diamond for heroes, a sigil glyph for bosses).
    if (!existsSync(srcPath)) {
      missing++;
      rows.push({ out: job.out, dims: "—", kb: 0, budgetKB: job.budgetKB, over: false, missing: true });
      continue;
    }
    const outPath = path.join(OUT, job.out);
    await mkdir(path.dirname(outPath), { recursive: true });

    let img = job.kind === "key" ? await grayKey(srcPath, job.key) : sharp(srcPath);
    if (job.regrid) {
      img = await regrid(img, job.regrid);
    }
    if (job.trim) {
      img = sharp(await img.png().toBuffer()).trim({ threshold: 12 });
    }
    if (job.resize) {
      const meta = await sharp(srcPath).metadata();
      const downscaling = (meta.width ?? 0) > job.resize.width;
      img = img.resize({
        width: job.resize.width,
        height: job.resize.height,
        fit: job.resize.height ? "cover" : "inside",
        withoutEnlargement: !job.resize.height,
        // Nearest keeps pixel edges hard when a map master is larger than
        // its slot. Smooth kernels are right for the painterly scene/key
        // exports and for an upscale (which we never do — no enlargement).
        ...(job.kind === "pixel" && downscaling ? { kernel: sharp.kernel.nearest } : {}),
      });
    }

    let buffer;
    let mode = "";
    if (job.kind === "pixel" || job.kind === "alpha") {
      ({ buffer, mode } = await encodePixel(img, job.budgetKB, job.alphaQuality));
    } else {
      buffer = await img.webp({ ...SCENE, alphaQuality: job.alphaQuality ?? SCENE.alphaQuality }).toBuffer();
    }
    await writeFile(outPath, buffer);

    const meta = await sharp(buffer).metadata();
    const kb = Math.round((await stat(outPath)).size / 1024);
    rows.push({ out: job.out, dims: `${meta.width}x${meta.height}`, kb, budgetKB: job.budgetKB, over: kb > job.budgetKB, mode });
  }

  console.log("\npixel assets → public/\n");
  for (const r of rows) {
    if (r.missing) {
      console.log(`· ${r.out.padEnd(44)} (master not in art-src/v2/overworld yet — stand-in stays)`);
      continue;
    }
    const note = r.mode === "lossy-fallback" ? "  note: near-lossless over budget, lossy fallback used" : "";
    console.log(
      `${r.over ? "✗" : "✓"} ${r.out.padEnd(44)} ${r.dims.padEnd(11)} ${String(r.kb).padStart(5)} KB  (budget ${r.budgetKB} KB)${note}`,
    );
  }
  if (missing) console.log(`\n${missing} slot(s) still waiting on masters — see docs/ART-BRIEFS-v2.md (Overworld)`);
  if (rows.some((r) => r.over)) {
    console.error("✗ some assets exceed their budget — raise compression or fix the master");
    process.exitCode = 1;
  }
}

await run();
