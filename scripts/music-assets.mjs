// Renders the site's background music from source and encodes the web set the
// MusicProvider serves from public/audio/. The score is procedural (see
// scripts/music/bgm.mjs + one song file per track), so it is license-clean and
// re-renders bit-for-bit. Needs ffmpeg on PATH. Re-run after editing a song:
//
//   npm run assets:music
//
// Two encodes per track: Opus-in-WebM (small; Chrome, Firefox, Edge, Safari 17+)
// and AAC-in-M4A as the fallback. The client loops the decoded buffer itself
// (Web Audio, loopEnd = exact bar length), so encoder padding never reaches the
// seam.

import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TRACKS = ["harbor-lights"];
const OUT = "public/audio";

const tmp = mkdtempSync(join(tmpdir(), "tusst-music-"));
try {
  for (const name of TRACKS) {
    const wav = join(tmp, `${name}.wav`);
    execFileSync("node", ["scripts/music/bgm.mjs", `scripts/music/${name}.mjs`, wav], { stdio: "inherit" });
    const ff = (...args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", wav, ...args]);
    ff("-c:a", "libopus", "-b:a", "64k", "-vbr", "on", `${OUT}/${name}.webm`);
    ff("-c:a", "aac", "-b:a", "112k", "-movflags", "+faststart", `${OUT}/${name}.m4a`);
    const meter = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", wav, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" });
    const lufs = /I:\s+(-?[\d.]+) LUFS\s+Threshold/.exec(meter.stderr.split("Summary:").pop())?.[1];
    console.log(`  integrated loudness ${lufs} LUFS`);
    for (const ext of ["webm", "m4a"]) {
      console.log(`  ${OUT}/${name}.${ext}  ${(statSync(`${OUT}/${name}.${ext}`).size / 1024).toFixed(0)} KiB`);
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
