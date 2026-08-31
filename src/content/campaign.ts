// TUSST campaign layer — "The Shattered Constellation".
// Wraps tracks as narrative Acts and lessons as Skirmishes, and defines the
// card catalog awarded per act. Full world bible: docs/LORE.md.
//
// Pure data, safe for client and server. Keyed by track/lesson slugs so it
// overlays the existing catalog without schema changes.

export type CardRarity = "common" | "rare" | "boss";

export interface ChampionCard {
  id: string;
  name: string; // e.g. "STROOWARRIOR"
  epithet: string | null; // e.g. "Hall of Mirrors Explorer"
  type: string; // e.g. "Stropie · Illusionist"
  power: number;
  flavor: string;
  rarity: CardRarity;
  image: string; // public path, e.g. /cards/stroowarrior.png
  awardedByTrack: string; // track slug whose finale awards this card
}

export interface Skirmish {
  lessonSlug: string;
  title: string; // narrative title, e.g. "The Waking Words"
  numeral: string; // e.g. "I.1"
  intro: string; // 2–4 sentences of story shown above the technical task
}

export interface Act {
  numeral: string; // "I", "II", ...
  trackSlug: string;
  title: string; // e.g. "The Rusted Citadel"
  territory: string; // short territory descriptor
  overlord: string | null; // act boss, if any
  synopsis: string; // shown on the track page
  cardId: string | null; // champion card awarded at the act finale
  skirmishes: Skirmish[];
}

export const cards: ChampionCard[] = [
  {
    id: "stroowarrior",
    name: "STROOWARRIOR",
    epithet: null,
    type: "Warrior",
    power: 7,
    flavor:
      "Only when the world trembles does the true warrior reveal his unyielding light.",
    rarity: "common",
    image: "/cards/stroowarrior.png",
    awardedByTrack: "rust-fundamentals",
  },
  {
    id: "stropillusion",
    name: "STROPILLUSION",
    epithet: "Hall of Mirrors Explorer",
    type: "Stropie · Illusionist",
    power: 6,
    flavor:
      "Reflections deceive, secrets remain hidden — he bends reality within the endless mirrors.",
    rarity: "common",
    image: "/cards/stropillusion.png",
    awardedByTrack: "control-flow",
  },
  {
    id: "stroopkeeper",
    name: "STROOPKEEPER",
    epithet: "Warden of the Endless Vaults",
    type: "Stropie · Archivist",
    power: 8,
    flavor:
      "Every tool ever forged sleeps in his vaults — indexed from zero, as the old gods intended.",
    rarity: "common",
    image: "/cards/stroopkeeper.png",
    awardedByTrack: "rust-standard-library",
  },
  {
    id: "stroophantom",
    name: "STROOPHANTOM",
    epithet: "The Knight Who May Not Be",
    type: "Stropie · Specter",
    power: 6,
    flavor:
      "Ask him if he is there. Never assume. The marsh is full of those who unwrapped.",
    rarity: "rare",
    image: "/cards/stroophantom.png",
    awardedByTrack: "mastering-option",
  },
  {
    id: "strooracle",
    name: "STROORACLE",
    epithet: "Arbiter of the Two Fates",
    type: "Stropie · Oracle",
    power: 9,
    flavor:
      "Two doors, one verdict. She has never ignored a Result, and she will not start with yours.",
    rarity: "rare",
    image: "/cards/strooracle.png",
    awardedByTrack: "mastering-result",
  },
  {
    id: "astrostroopie",
    name: "ASTROSTROOPIE",
    epithet: "Voyager of the Constellation Gate",
    type: "Stropie · Voyager",
    power: 8,
    flavor:
      "He charted the sky by its wounds, and crossed the Gate where the light had failed.",
    rarity: "rare",
    image: "/cards/astrostroopie.png",
    awardedByTrack: "stellar-101",
  },
  {
    id: "stroopbeholder",
    name: "STROOPBEHOLDER",
    epithet: null,
    type: "Stropie · Aberration",
    power: 10,
    flavor: "From the depths of ruin, its many eyes see only conquest.",
    rarity: "boss",
    image: "/cards/stroopbeholder.png",
    awardedByTrack: "soroban-smart-contracts",
  },
  {
    id: "stroopzipper",
    name: "STROOPZIPPER",
    epithet: "Herald of the Rewritten Sky",
    type: "Stropie · Herald",
    power: 10,
    flavor:
      "The sky does not break when it changes — it zips itself anew, seam by luminous seam.",
    rarity: "boss",
    image: "/cards/stroopzipper.png",
    awardedByTrack: "stellar-protocol-27",
  },
];

export const acts: Act[] = [
  {
    numeral: "I",
    trackSlug: "rust-fundamentals",
    title: "Rust Fundamentals",
    territory: "syntax, types, ownership",
    overlord: null,
    synopsis:
      "The ground floor of the language: printing, bindings and mutability, types, functions, and the ownership and borrowing rules everything else depends on.",
    cardId: "stroowarrior",
    skirmishes: [
      {
        lessonSlug: "rust-fundamentals-1",
        numeral: "I.1",
        title: "Hello, World!",
        intro:
          "Every Rust program starts at `main`. You will print one exact line and meet the `println!` macro — the tool you will use to inspect everything that follows.",
      },
      {
        lessonSlug: "rust-fundamentals-2",
        numeral: "I.2",
        title: "Variables & Mutability",
        intro:
          "Bindings are immutable by default. You will see the compile error that causes, and fix it with `mut` — the first of many places Rust makes you state your intent.",
      },
      {
        lessonSlug: "rust-fundamentals-3",
        numeral: "I.3",
        title: "Data Types",
        intro:
          "Integers, floats, booleans and characters, and when the compiler needs you to annotate a type it cannot infer on its own.",
      },
      {
        lessonSlug: "rust-fundamentals-4",
        numeral: "I.4",
        title: "Functions",
        intro:
          "Parameters, return types, and Rust's implicit return: the last expression without a semicolon is the value. That one rule explains a lot of later syntax.",
      },
      {
        lessonSlug: "rust-fundamentals-5",
        numeral: "I.5",
        title: "Ownership Basics",
        intro:
          "Every value has exactly one owner. Assigning a `String` moves it, and the old binding is dead — the single idea the rest of Rust is built on.",
      },
      {
        lessonSlug: "rust-fundamentals-6",
        numeral: "I.6",
        title: "Borrowing & References",
        intro:
          "You do not have to give a value away to let a function read it. Lend a reference with `&` and it comes back — the everyday alternative to cloning.",
      },
    ],
  },
  {
    numeral: "II",
    trackSlug: "control-flow",
    title: "Control Flow",
    territory: "branches, matching, loops",
    overlord: null,
    synopsis:
      "Branching and repetition in Rust, including exhaustive `match` — the mechanism that makes `Option` and `Result` safe to handle later.",
    cardId: "stropillusion",
    skirmishes: [
      {
        lessonSlug: "control-flow-1",
        numeral: "II.1",
        title: "if / else",
        intro:
          "Branching in Rust is an expression, not just a statement — so an `if` can produce a value you bind directly.",
      },
      {
        lessonSlug: "control-flow-2",
        numeral: "II.2",
        title: "match Expressions",
        intro:
          "`match` must be exhaustive: the compiler rejects any case you forgot. That is the mechanism behind safe `Option` and `Result` handling later.",
      },
      {
        lessonSlug: "control-flow-3",
        numeral: "II.3",
        title: "loop",
        intro:
          "An unconditional loop, and `break` with a value — the idiomatic way to retry until something succeeds.",
      },
      {
        lessonSlug: "control-flow-4",
        numeral: "II.4",
        title: "while Loops",
        intro:
          "Loop while a condition holds. You will also see why `while let` exists and where it beats a plain `while`.",
      },
      {
        lessonSlug: "control-flow-5",
        numeral: "II.5",
        title: "for Loops",
        intro:
          "Iterating a range or a collection — the loop you will actually write, and the first place iterators appear.",
      },
      {
        lessonSlug: "control-flow-6",
        numeral: "II.6",
        title: "Nested Control Flow",
        intro:
          "Combining branches and loops, and keeping the result readable when the logic stops being trivial.",
      },
    ],
  },
  {
    numeral: "III",
    trackSlug: "rust-standard-library",
    title: "The Standard Library",
    territory: "collections, iterators, structs",
    overlord: null,
    synopsis:
      "The types you will reach for every day: `Vec`, `HashMap`, strings and slices, iterators, and giving your own types behaviour with `impl`.",
    cardId: "stroopkeeper",
    skirmishes: [
      {
        lessonSlug: "rust-standard-library-1",
        numeral: "III.1",
        title: "Vec Basics",
        intro:
          "A growable array: push, index, and the reason `Vec` is the default collection in almost every Rust program.",
      },
      {
        lessonSlug: "rust-standard-library-2",
        numeral: "III.2",
        title: "Iterators",
        intro:
          "`map`, `filter` and `collect` — and the fact that nothing runs until a consumer asks for elements.",
      },
      {
        lessonSlug: "rust-standard-library-3",
        numeral: "III.3",
        title: "Option & map",
        intro:
          "Transforming a value that may not be there, without unwrapping it first.",
      },
      {
        lessonSlug: "rust-standard-library-4",
        numeral: "III.4",
        title: "HashMap",
        intro:
          "Key/value lookup, and the `entry` API that reads or inserts in a single hash.",
      },
      {
        lessonSlug: "rust-standard-library-5",
        numeral: "III.5",
        title: "String Handling",
        intro:
          "`String` versus `&str`, why you cannot index a string by number, and what UTF-8 has to do with it.",
      },
      {
        lessonSlug: "rust-standard-library-6",
        numeral: "III.6",
        title: "Slices",
        intro:
          "A borrowed view into part of a collection — no copy, no allocation.",
      },
      {
        lessonSlug: "rust-standard-library-7",
        numeral: "III.7",
        title: "Structs",
        intro:
          "Grouping related data under one name, with each field's type stated.",
      },
      {
        lessonSlug: "rust-standard-library-8",
        numeral: "III.8",
        title: "impl & Methods",
        intro:
          "Attaching behaviour to a type, and the difference between `self`, `&self` and `&mut self`.",
      },
    ],
  },
  {
    numeral: "IV",
    trackSlug: "mastering-option",
    title: "Option<T>",
    territory: "absence, modelled as a type",
    overlord: null,
    synopsis:
      "Rust has no null. `Option<T>` makes 'there may be nothing here' a case the compiler forces you to handle.",
    cardId: "stroophantom",
    skirmishes: [
      {
        lessonSlug: "mastering-option-1",
        numeral: "IV.1",
        title: "Some or None",
        intro:
          "`Option<T>` makes absence a case the compiler forces you to handle — this is why Rust has no null.",
      },
      {
        lessonSlug: "mastering-option-2",
        numeral: "IV.2",
        title: "Unwrap Safely",
        intro:
          "`unwrap_or`, `unwrap_or_else` and `expect`, and the rule for when `unwrap()` is acceptable in production.",
      },
      {
        lessonSlug: "mastering-option-3",
        numeral: "IV.3",
        title: "if let",
        intro:
          "Matching one case and ignoring the rest, when a full `match` would be noise.",
      },
    ],
  },
  {
    numeral: "V",
    trackSlug: "mastering-result",
    title: "Result<T, E>",
    territory: "failure, modelled as a value",
    overlord: null,
    synopsis:
      "Errors are values, not exceptions. Match them, convert them, and propagate them with `?` instead of unwinding a stack.",
    cardId: "strooracle",
    skirmishes: [
      {
        lessonSlug: "mastering-result-1",
        numeral: "V.1",
        title: "Ok or Err",
        intro:
          "`Result<T, E>` carries either the value or the reason it failed — and `#[must_use]` means you cannot quietly ignore it.",
      },
      {
        lessonSlug: "mastering-result-2",
        numeral: "V.2",
        title: "Matching on Result",
        intro:
          "Handling both arms explicitly, and deciding per call site whether a failure is recoverable.",
      },
      {
        lessonSlug: "mastering-result-3",
        numeral: "V.3",
        title: "The ? Operator",
        intro:
          "Propagating a failure to the caller in one character, instead of a `match` at every level.",
      },
    ],
  },
  {
    numeral: "VI",
    trackSlug: "stellar-101",
    title: "Stellar 101",
    territory: "accounts, lumens, trustlines, payments",
    overlord: null,
    synopsis:
      "How the network actually works: what an account is, what a lumen pays for, why holding an asset is opt-in, and how a payment is built and submitted.",
    cardId: "astrostroopie",
    skirmishes: [
      {
        lessonSlug: "stellar-101-1",
        numeral: "VI.1",
        title: "Accounts & Keypairs",
        intro:
          "A Stellar account is a public key. The secret key signs; the public key identifies. Everything else builds on that.",
      },
      {
        lessonSlug: "stellar-101-2",
        numeral: "VI.2",
        title: "Lumens & Fees",
        intro:
          "XLM, stroops, the base reserve and why every account must hold a minimum balance.",
      },
      {
        lessonSlug: "stellar-101-3",
        numeral: "VI.3",
        title: "Trustlines & Assets",
        intro:
          "Holding a non-native asset is opt-in: you open a trustline first, and that is a deliberate protocol design.",
      },
      {
        lessonSlug: "stellar-101-4",
        numeral: "VI.4",
        title: "Your First Payment",
        intro:
          "Building, signing and submitting a payment — the shape every Stellar operation shares.",
      },
    ],
  },
  {
    numeral: "VII",
    trackSlug: "soroban-smart-contracts",
    title: "Soroban Smart Contracts",
    territory: "contracts, storage, authorization",
    overlord: null,
    synopsis:
      "Writing, storing state in, and securing a Soroban contract in Rust — the three things every real contract needs.",
    cardId: "stroopbeholder",
    skirmishes: [
      {
        lessonSlug: "soroban-smart-contracts-1",
        numeral: "VII.1",
        title: "Your First Contract",
        intro:
          "`#[contract]`, `#[contractimpl]` and an exported function — the minimum a Soroban contract needs to exist.",
      },
      {
        lessonSlug: "soroban-smart-contracts-2",
        numeral: "VII.2",
        title: "Contract Storage",
        intro:
          "Instance, persistent and temporary storage: three shelves with different lifetimes and different costs.",
      },
      {
        lessonSlug: "soroban-smart-contracts-3",
        numeral: "VII.3",
        title: "Authorization",
        intro:
          "`require_auth` is the line between a contract anyone can drain and one only its owner can move.",
      },
    ],
  },
  {
    numeral: "VIII",
    trackSlug: "stellar-protocol-27",
    title: "Protocol 27",
    territory: "smart accounts & auth delegation",
    overlord: null,
    synopsis:
      "The current upgrade: smart accounts that define their own auth policy, delegation via CAP-0071, address-bound signatures, and the migration path.",
    cardId: "stroopzipper",
    skirmishes: [
      {
        lessonSlug: "stellar-protocol-27-1",
        numeral: "VIII.1",
        title: "Protocol 27 Overview",
        intro:
          "What the upgrade changes, and why authentication delegation matters for anyone building wallets.",
      },
      {
        lessonSlug: "stellar-protocol-27-2",
        numeral: "VIII.2",
        title: "Smart Accounts & __check_auth",
        intro:
          "A contract account decides for itself what counts as a valid signature — that function is the whole policy.",
      },
      {
        lessonSlug: "stellar-protocol-27-3",
        numeral: "VIII.3",
        title: "Authentication Delegation (CAP-0071)",
        intro:
          "Letting one account delegate its auth check to another, and what that unlocks for recovery and session keys.",
      },
      {
        lessonSlug: "stellar-protocol-27-4",
        numeral: "VIII.4",
        title: "Signature Security & V2 Credentials",
        intro:
          "Address-bound signatures, and the replay attack the V2 credential format closes.",
      },
      {
        lessonSlug: "stellar-protocol-27-5",
        numeral: "VIII.5",
        title: "Migrating to Protocol 27",
        intro:
          "What breaks, what does not, and the order to change things in across the SDKs.",
      },
      {
        lessonSlug: "stellar-protocol-27-6",
        numeral: "VIII.6",
        title: "Putting It Together: A Delegated Account",
        intro:
          "Implement `__check_auth` end to end: verify the signature, honour the delegate, and reject the replay.",
      },
    ],
  },
];

export function getAct(trackSlug: string): Act | undefined {
  return acts.find((a) => a.trackSlug === trackSlug);
}

export function getSkirmish(lessonSlug: string): (Skirmish & { act: Act }) | undefined {
  for (const act of acts) {
    const s = act.skirmishes.find((sk) => sk.lessonSlug === lessonSlug);
    if (s) return { ...s, act };
  }
  return undefined;
}

export function getCard(id: string): ChampionCard | undefined {
  return cards.find((c) => c.id === id);
}

export function getCardForTrack(trackSlug: string): ChampionCard | undefined {
  return cards.find((c) => c.awardedByTrack === trackSlug);
}
