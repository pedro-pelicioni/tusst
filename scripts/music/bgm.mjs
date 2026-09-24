// Loopable background-music renderer for the TUSST overworld — same NES-style palette as
// the v2 trailer score (videos/tusst-v2-update/audio-src/chiptune.mjs), tuned for "leave it on for an hour":
// soft filtered pulses, triangle bass, no snare, light swing, echo + small room reverb.
//
//   node scripts/music/bgm.mjs scripts/music/harbor-lights.mjs out.wav   (or: npm run assets:music)
//
// The output is exactly N bars long and loops seamlessly: every note/echo/reverb tail that
// runs past the end is wrapped into the head, and the effects run over two passes of the
// loop so their state at the seam is the steady state.

import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const SR = 44100;
const [, , songPath, outPath = "out.wav"] = process.argv;
const song = (await import(pathToFileURL(resolve(songPath)).href)).default;

const BPM = song.bpm;
const BEAT = 60 / BPM, BAR = 4 * BEAT, STEP = BEAT / 4;
const SWING = song.swing ?? 0; // fraction of a 16th that off-beat 8ths land late

// ---------- pitch ----------
const PC = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
function midi(n) {
  const m = /^([A-G][#b]?)(-?\d)$/.exec(n);
  if (!m) throw new Error("bad note " + n);
  return 12 * (Number(m[2]) + 1) + PC[m[1]];
}
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const QUAL = { maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], 7: [0, 4, 7, 10], "7sus": [0, 5, 7, 10], m: [0, 3, 7], "": [0, 4, 7], 6: [0, 4, 7, 9] };
function chord(name) {
  const m = /^([A-G][#b]?)(.*)$/.exec(name);
  const iv = QUAL[m[2]];
  if (!iv) throw new Error("bad chord " + name);
  return { root: PC[m[1]], iv };
}
const inWindow = (pc, lo) => lo + (((pc - lo) % 12) + 12) % 12; // pitch class → [lo, lo+12)
const SCALE = song.scale ?? [0, 2, 4, 5, 7, 9, 11];
function diatonic(m, deg) {
  let x = m, d = deg;
  const dir = Math.sign(d);
  while (d !== 0) { x += dir; if (SCALE.includes(((x % 12) + 12) % 12)) d -= dir; }
  return x;
}

// deterministic rng (mulberry32) — same file every render
let seed = song.seed ?? 7;
function rnd() {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ---------- oscillators ----------
function polyblep(t, dt) {
  if (t < dt) { t /= dt; return t + t - t * t - 1; }
  if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
  return 0;
}
function pulse(ph, dt, duty) {
  let v = ph < duty ? 1 : -1;
  v += polyblep(ph, dt);
  v -= polyblep((ph - duty + 1) % 1, dt);
  return v;
}
const tri = (ph) => 4 * Math.abs(ph - 0.5) - 1;

// ---------- buses ----------
const totalBars = song.sections.reduce((a, s) => a + s.bars, 0);
const LOOP = Math.round(totalBars * BAR * SR);
const TAIL = 6 * SR;
const LEN = LOOP + TAIL;
const bus = () => [new Float32Array(LEN), new Float32Array(LEN)];
const DRY = bus(), ECHO = bus(), VERB = bus();

function put(i, v, pan, echo, verb) {
  const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
  DRY[0][i] += v * gl; DRY[1][i] += v * gr;
  if (echo) { ECHO[0][i] += v * gl * echo; ECHO[1][i] += v * gr * echo; }
  if (verb) { VERB[0][i] += v * gl * verb; VERB[1][i] += v * gr * verb; }
}

// timing: bar + 16th step, with swing on the off-beat 8ths
function at(bar, st) {
  bar += Math.floor(st / 16); st = ((st % 16) + 16) % 16;
  return bar * BAR + st * STEP + (st % 4 === 2 ? SWING * STEP : 0);
}

function tone({ t0, dur, m, wave = "pulse", duty = 0.5, vol = 0.1, pan = 0, a = 0.006, d = 0.1, s = 0.7, r = 0.08, pluck = 0, cutoff = 4000, vib = 0, vibDelay = 0.22, detune = 0, echo = 0, verb = 0 }) {
  const f0 = hz(m);
  const i0 = Math.round(t0 * SR), n = Math.round((dur + r) * SR);
  const ac = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
  const level = (t) => pluck ? Math.min(1, t / a) * Math.exp(-t * pluck) : t < a ? t / a : t < a + d ? 1 - ((1 - s) * (t - a)) / d : s;
  const relFrom = level(dur);
  let p1 = 0, p2 = 0.37, lp1 = 0, lp2 = 0;
  for (let k = 0; k < n; k++) {
    const i = i0 + k;
    if (i >= LEN) break;
    const t = k / SR;
    const env = t <= dur ? level(t) : relFrom * Math.max(0, 1 - (t - dur) / r);
    let f = f0;
    if (vib && t > vibDelay) f *= 1 + vib * Math.sin(2 * Math.PI * 5 * (t - vibDelay)) * Math.min(1, (t - vibDelay) / 0.3);
    const dt = f / SR;
    p1 += dt; if (p1 >= 1) p1 -= 1;
    let v = wave === "tri" ? tri(p1) : pulse(p1, dt, duty);
    if (detune) {
      const dt2 = dt * (1 + detune);
      p2 += dt2; if (p2 >= 1) p2 -= 1;
      v = 0.5 * (v + (wave === "tri" ? tri(p2) : pulse(p2, dt2, duty)));
    }
    lp1 += ac * (v - lp1); lp2 += ac * (lp1 - lp2); // 12 dB/oct — takes the fizz off the pulses
    put(i, lp2 * env * vol, pan, echo, verb);
  }
}

function kick(t0, vol) {
  const i0 = Math.round(t0 * SR), n = Math.round(0.35 * SR);
  let ph = 0;
  for (let k = 0; k < n && i0 + k < LEN; k++) {
    const t = k / SR;
    ph += (48 + 70 * Math.exp(-t * 30)) / SR;
    put(i0 + k, Math.sin(2 * Math.PI * ph) * Math.min(1, t / 0.002) * Math.exp(-t * 9) * vol, 0, 0, 0);
  }
}
function shaker(t0, vol, pan = 0.25) {
  const i0 = Math.round(t0 * SR), n = Math.round(0.09 * SR);
  let a = 0, b = 0;
  const ca = 1 - Math.exp((-2 * Math.PI * 7000) / SR), cb = 1 - Math.exp((-2 * Math.PI * 2500) / SR);
  for (let k = 0; k < n && i0 + k < LEN; k++) {
    const t = k / SR;
    const w = rnd() * 2 - 1;
    a += ca * (w - a); b += cb * (a - b);
    put(i0 + k, (a - b) * Math.min(1, t / 0.004) * Math.exp(-t * 45) * vol, pan, 0, 0.1);
  }
}
function block(t0, vol) {
  const i0 = Math.round(t0 * SR), n = Math.round(0.09 * SR);
  for (let k = 0; k < n && i0 + k < LEN; k++) {
    const t = k / SR;
    const v = (Math.sin(2 * Math.PI * 1050 * t) + 0.45 * Math.sin(2 * Math.PI * 1580 * t)) * Math.min(1, t / 0.001) * Math.exp(-t * 60) * vol;
    put(i0 + k, v, -0.3, 0, 0.22);
  }
}

// ---------- arrangement ----------
const BASS = {
  whole: [[0, 16, 0]],
  half: [[0, 8, 0], [8, 8, 7]],
  stroll: [[0, 7, 0], [10, 4, 7], [14, 2, 12]],
};
const inRange = (b, range) => !range || (b >= range[0] && b < range[1]);

let bar0 = 0;
for (const sec of song.sections) {
  for (let b = 0; b < sec.bars; b++) {
    const B = bar0 + b;
    const ch = chord(sec.chords[b % sec.chords.length]);

    if (sec.pad) {
      // close voicing of the chord minus its root, parked in G3–F#4
      const tones = (ch.iv.length > 3 ? ch.iv.slice(1) : ch.iv).map((i) => inWindow(ch.root + i, 55)).sort((x, y) => x - y);
      tones.forEach((m, j) => tone({ t0: B * BAR, dur: BAR, m, duty: 0.5, detune: 0.004, cutoff: 1100, vol: sec.pad, pan: (j - 1) * 0.35, a: 0.6, d: 0.6, s: 0.8, r: 0.9, verb: 0.4 }));
    }

    if (sec.arp && inRange(b, sec.arp.bars)) {
      const root = inWindow(ch.root, 57);
      const notes = ch.iv.map((i) => root + i);
      const pat = sec.arp.pattern ?? [0, 1, 2, 3, 1, 2, 3, 2];
      for (let j = 0; j < 8; j++) {
        const m = notes[pat[j] % notes.length];
        const vol = sec.arp.vol * (j % 2 ? 0.8 : 1) * (0.88 + 0.24 * rnd());
        tone({ t0: at(B, j * 2), dur: STEP * 1.8, m, duty: 0.25, cutoff: 2000, vol, pan: 0.35, a: 0.003, pluck: 7, r: 0.06, echo: 0.12, verb: 0.3 });
      }
    }

    if (sec.bass) {
      const root = inWindow(ch.root, 36);
      for (const [st, len, off] of BASS[sec.bass.style]) {
        const t0 = at(B, st);
        tone({ t0, dur: at(B, st + len) - t0 - 0.02, m: root + off, wave: "tri", cutoff: 1800, vol: sec.bass.vol, a: 0.005, d: 0.12, s: 0.8, r: 0.06 });
      }
    }

    const dr = sec.drums;
    if (dr && inRange(b, dr.bars)) {
      if (dr.kick) for (const st of [0, 10]) kick(at(B, st), dr.kick);
      if (dr.block) for (const st of [4, 12]) block(at(B, st), dr.block);
      if (dr.shaker) for (let st = 0; st < 16; st += 2) shaker(at(B, st), dr.shaker * (st % 4 === 2 ? 1 : 0.55) * (0.85 + 0.3 * rnd()));
    }
  }

  const ld = sec.lead;
  if (ld) {
    for (const [bar, st, len, note] of ld.notes) {
      const m = midi(note) + 12 * (ld.octave ?? 0);
      const t0 = at(bar0 + bar, st);
      const dur = (at(bar0 + bar, st + len) - t0) * 0.94;
      const common = { t0, dur, wave: ld.wave, duty: ld.duty ?? 0.5, cutoff: ld.cutoff ?? 2600, a: 0.012, d: 0.12, s: 0.75, r: 0.12, vib: len >= 6 ? 0.007 : 0 };
      tone({ ...common, m, vol: ld.vol, pan: -0.1, echo: 0.25, verb: 0.3 });
      if (ld.harmony) tone({ ...common, m: diatonic(m, ld.harmony), wave: "pulse", duty: 0.25, cutoff: 1800, vol: ld.harmVol, pan: 0.35, echo: 0.1, verb: 0.35 });
    }
  }

  const pk = sec.pluck;
  if (pk) {
    for (const [bar, st, note] of pk.notes) {
      const t0 = at(bar0 + bar, st), m = midi(note);
      tone({ t0, dur: 1.4, m, wave: "tri", vol: pk.vol, pan: 0.15, a: 0.002, pluck: 3.2, r: 0.3, cutoff: 5000, echo: 0.35, verb: 0.45 });
      tone({ t0, dur: 0.8, m: m + 12, wave: "tri", vol: pk.vol * 0.22, pan: 0.3, a: 0.002, pluck: 6, r: 0.2, cutoff: 6000, echo: 0.2, verb: 0.4 });
    }
  }
  bar0 += sec.bars;
}

// ---------- wrap tails into the head: the dry loop is now exactly periodic ----------
for (const buf of [...DRY, ...ECHO, ...VERB]) for (let i = 0; i < TAIL; i++) buf[i] += buf[LOOP + i];

// ---------- effects: ping-pong dotted-8th echo + Freeverb-style room ----------
function comb(len, fb, damp) {
  const buf = new Float32Array(len); let i = 0, store = 0;
  return (x) => { const y = buf[i]; store = y * (1 - damp) + store * damp; buf[i] = x + store * fb; i = (i + 1) % len; return y; };
}
function allpass(len) {
  const buf = new Float32Array(len); let i = 0;
  return (x) => { const b = buf[i]; buf[i] = x + b * 0.5; i = (i + 1) % len; return b - x; };
}
function room(spread) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491].map((n) => comb(n + spread, 0.86, 0.35));
  const aps = [556, 441, 341].map((n) => allpass(n + spread));
  return (x) => { let y = 0; for (const c of combs) y += c(x); y *= 0.08; for (const ap of aps) y = ap(y); return y; };
}
const roomL = room(0), roomR = room(23);
const dN = Math.round(3 * STEP * SR), FB = 0.38;
const dl = new Float32Array(dN), drr = new Float32Array(dN);
let di = 0, dampL = 0, dampR = 0;
const OUT = [new Float32Array(LOOP), new Float32Array(LOOP)];
const mcut = 1 - Math.exp((-2 * Math.PI * 9000) / SR);
const hcut = 1 - Math.exp((-2 * Math.PI * 32) / SR); // high-pass: no sub rumble on headphones
let mL = 0, mR = 0, sL = 0, sR = 0;
for (let pass = 0; pass < 2; pass++) {
  for (let i = 0; i < LOOP; i++) {
    const yl = dl[di], yr = drr[di];
    dampL += 0.35 * (yl - dampL); dampR += 0.35 * (yr - dampR);
    dl[di] = ECHO[0][i] + dampR * FB; drr[di] = ECHO[1][i] + dampL * FB; // cross-fed: ping-pong
    di = (di + 1) % dN;
    const rl = roomL(VERB[0][i] + yl * 0.3), rr = roomR(VERB[1][i] + yr * 0.3);
    mL += mcut * (DRY[0][i] + yl + rl - mL);
    mR += mcut * (DRY[1][i] + yr + rr - mR);
    sL += hcut * (mL - sL); sR += hcut * (mR - sR);
    if (pass === 1) { OUT[0][i] = mL - sL; OUT[1][i] = mR - sR; }
  }
}

// ---------- master: soft saturation, peak-normalize, 16-bit WAV ----------
let peak = 1e-9;
for (const ch of OUT) for (let i = 0; i < LOOP; i++) { ch[i] = Math.tanh(ch[i] * 1.2); peak = Math.max(peak, Math.abs(ch[i])); }
const g = (song.peak ?? 0.89) / peak;
const buf = Buffer.alloc(44 + LOOP * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + LOOP * 4, 4); buf.write("WAVE", 8);
buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(LOOP * 4, 40);
for (let i = 0; i < LOOP; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, OUT[0][i] * g)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, OUT[1][i] * g)) * 32767), 46 + i * 4);
}
writeFileSync(outPath, buf);
console.log(`wrote ${outPath}: ${totalBars} bars @ ${BPM} BPM = ${(LOOP / SR).toFixed(3)}s loop (${LOOP} samples)`);
