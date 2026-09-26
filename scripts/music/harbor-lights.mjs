// "Harbor Lights" — TUSST overworld BGM. 84 BPM, C major, light swing, 48 bars ≈ 137s loop.
// Built to sit under play for a long time: the melody is out for 16 of every 48 bars, there
// is no snare, and the loop point (dusk → dawn) is the quietest place in the song.
//
// lead notes: [barInSection, step16, lenSteps, note]   pluck notes: [barInSection, step16, note]

const MAIN = ["Fmaj7", "Em7", "Dm7", "Cmaj7", "Fmaj7", "Em7", "Dm7", "G7sus"];
const BRIDGE = ["Am7", "Dm7", "G7", "Cmaj7", "Am7", "Bbmaj7", "Fmaj7", "G7sus"];

// Theme 1 — "rest, two eighths, long note", falling back to G over the sus chord
const M1 = [
  [0, 4, 2, "A5"], [0, 6, 2, "C6"], [0, 8, 6, "E6"], [0, 14, 2, "D6"],
  [1, 0, 4, "B5"], [1, 4, 2, "A5"], [1, 6, 10, "G5"],
  [2, 4, 2, "F5"], [2, 6, 2, "A5"], [2, 8, 4, "C6"], [2, 12, 4, "D6"],
  [3, 0, 6, "B5"], [3, 6, 2, "G5"], [3, 8, 8, "E5"],
  [4, 4, 2, "A5"], [4, 6, 2, "C6"], [4, 8, 4, "E6"], [4, 12, 2, "F6"], [4, 14, 2, "E6"],
  [5, 0, 6, "D6"], [5, 6, 2, "B5"], [5, 8, 8, "G5"],
  [6, 4, 2, "D6"], [6, 6, 2, "C6"], [6, 8, 4, "A5"], [6, 12, 4, "F5"],
  [7, 0, 12, "G5"],
];
// Theme 2 — lower and on the downbeat, answers theme 1
const M2 = [
  [0, 0, 4, "C5"], [0, 4, 4, "F5"], [0, 8, 2, "A5"], [0, 10, 2, "G5"], [0, 12, 4, "A5"],
  [1, 0, 6, "G5"], [1, 6, 2, "E5"], [1, 8, 4, "D5"], [1, 12, 4, "E5"],
  [2, 0, 4, "F5"], [2, 4, 4, "A5"], [2, 8, 2, "C6"], [2, 10, 2, "B5"], [2, 12, 4, "A5"],
  [3, 0, 8, "G5"], [3, 8, 4, "E5"], [3, 12, 4, "G5"],
  [4, 0, 4, "A5"], [4, 4, 4, "C6"], [4, 8, 2, "E6"], [4, 10, 2, "D6"], [4, 12, 4, "C6"],
  [5, 0, 6, "B5"], [5, 6, 2, "G5"], [5, 8, 8, "E5"],
  [6, 0, 4, "F5"], [6, 4, 2, "E5"], [6, 6, 2, "F5"], [6, 8, 4, "A5"], [6, 12, 4, "C6"],
  [7, 0, 6, "D6"], [7, 6, 2, "C6"], [7, 8, 8, "G5"],
];
// Music box over the bridge — falling chord tones on a 3+3+2 rhythm
const BELL = [
  [0, 0, "E6"], [0, 6, "C6"], [0, 10, "A5"],
  [1, 0, "D6"], [1, 6, "A5"], [1, 10, "F5"],
  [2, 0, "B5"], [2, 6, "G5"], [2, 10, "D6"],
  [3, 0, "C6"], [3, 6, "E6"], [3, 10, "G6"],
  [4, 0, "E6"], [4, 6, "C6"], [4, 10, "A5"],
  [5, 0, "D6"], [5, 6, "A5"], [5, 10, "F5"],
  [6, 0, "C6"], [6, 6, "A5"], [6, 10, "E6"],
  [7, 0, "D6"], [7, 6, "C6"], [7, 10, "G5"],
];
// Dusk: theme 1's first phrase as a fading music box, then only the bed
const DUSK = [
  [0, 4, "A5"], [0, 6, "C6"], [0, 8, "E6"], [0, 14, "D6"],
  [1, 0, "B5"], [1, 6, "G5"],
  [2, 4, "D6"], [2, 6, "C6"], [2, 8, "A5"], [2, 12, "F5"],
  [3, 0, "G5"],
];

const bedArp = { vol: 0.045 };
const leadArp = { vol: 0.03 };
const groove = { kick: 0.2, block: 0.035, shaker: 0.035 };

export default {
  bpm: 84,
  swing: 0.3,
  seed: 11,
  sections: [
    { name: "dawn", bars: 8, chords: MAIN, pad: 0.03, arp: bedArp, bass: { style: "whole", vol: 0.15 }, drums: { shaker: 0.025, bars: [4, 8] } },
    { name: "stroll", bars: 8, chords: MAIN, pad: 0.022, arp: leadArp, bass: { style: "stroll", vol: 0.16 }, drums: groove, lead: { notes: M1, octave: -1, wave: "pulse", duty: 0.5, vol: 0.075, cutoff: 2400 } },
    { name: "wander", bars: 8, chords: MAIN, pad: 0.022, arp: leadArp, bass: { style: "stroll", vol: 0.16 }, drums: groove, lead: { notes: M2, wave: "pulse", duty: 0.25, vol: 0.06, cutoff: 2000 } },
    { name: "musicbox", bars: 8, chords: BRIDGE, pad: 0.035, arp: { vol: 0.025, pattern: [3, 2, 1, 0, 2, 1, 0, 1] }, bass: { style: "half", vol: 0.14 }, drums: { shaker: 0.025, block: 0.025 }, pluck: { notes: BELL, vol: 0.11 } },
    { name: "return", bars: 8, chords: MAIN, pad: 0.022, arp: leadArp, bass: { style: "stroll", vol: 0.16 }, drums: groove, lead: { notes: M1, wave: "tri", vol: 0.13, cutoff: 3500, harmony: -2, harmVol: 0.03 } },
    { name: "dusk", bars: 8, chords: MAIN, pad: 0.03, arp: bedArp, bass: { style: "whole", vol: 0.15 }, drums: { shaker: 0.025, bars: [0, 4] }, pluck: { notes: DUSK, vol: 0.07 } },
  ],
};
