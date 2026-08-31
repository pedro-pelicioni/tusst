// The Hall — the logged-in home at /path: two roads + the Forge.
export const home = {
  metaTitle: "The Hall — TUSST",
  metaDescription:
    "Choose your road: the Builder's Journey, the Advanced Path, the Forge's guided labs, or the optional Rust campaign.",
  kicker: "the hall",
  title: "Choose your road",
  intro:
    "Three roads and a workshop. Learn the engineering craft, press real buttons on a real network, and go as deep into Rust as you want to.",
  continueCta: "Continue where you left off",
  level: "level {level}",
  xpToNext: "{into} / {span} xp to level {next}",
  doors: {
    journey: {
      label: "the essential road",
      title: "Builder's Journey",
      blurb:
        "Spec-driven craft, TDD, clean architecture — and how Stellar actually works. The discipline an AI won't learn for you.",
      cta: "Walk the Journey",
      soon: "first chapters in preparation",
    },
    campaign: {
      label: "the optional road",
      title: "Rust Campaign",
      blurb:
        "Eight sections from Rust basics to Soroban contracts, graded in a real sandbox. Optional, and the fastest way to get your hands dirty.",
      cta: "Open the Campaign",
      progress: "{done}/{total} sections cleared",
    },
    advanced: {
      label: "if you already ship",
      title: "Advanced Path",
      blurb:
        "Rust systems engineering at the depth a backend infrastructure role asks for. No fundamentals, no story — ownership, lifetimes, concurrency, async internals, unsafe and FFI.",
      cta: "Open the Advanced Path",
      progress: "{done}/{total} lessons done",
    },
    forge: {
      label: "where you practice",
      title: "The Forge",
      blurb:
        "Guided labs with buttons that do real things on the real testnet — plus the free-mode IDE. No login needed.",
      cta: "Enter the Forge",
      progress: "{done} labs completed",
    },
  },
};
