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
];

export const acts: Act[] = [
  {
    numeral: "I",
    trackSlug: "rust-fundamentals",
    title: "The Rusted Citadel",
    territory: "Ruined capital of runecraft",
    overlord: null,
    synopsis:
      "You awaken in the oxidized ruins of the Citadel. Ferrisia the Crab-Mother teaches you the waking words, the binding of names, and the law of the Unbending Blade. Relight the beacon, Forgeborn.",
    cardId: "stroowarrior",
    skirmishes: [
      {
        lessonSlug: "rust-fundamentals-1",
        numeral: "I.1",
        title: "The Waking Words",
        intro:
          "The Citadel's beacon has been dark since the Great Panic, and it answers only to a spoken rune. Ferrisia hands you a chisel. \"Every rune ever forged begins at `main`,\" she says. \"Speak, Forgeborn — and mind your semicolons. The beacon is pedantic.\"",
      },
      {
        lessonSlug: "rust-fundamentals-2",
        numeral: "I.2",
        title: "The Unbending Blade",
        intro:
          "In the armory, every blade is bound immutable by the old law — once forged, never changed. To reforge one you must declare your intent to the steel itself. The Borrow Warden watches from the doorway, arms crossed, waiting for you to try changing it without `mut`.",
      },
      {
        lessonSlug: "rust-fundamentals-3",
        numeral: "I.3",
        title: "The Shapes of Matter",
        intro:
          "Ferrisia opens a cabinet of labeled vials: whole numbers, broken numbers, truths and lies. \"The Citadel refuses any rune whose shape it cannot name,\" she says. \"Label your vials, Forgeborn — the beacon reads only what is typed.\"",
      },
      {
        lessonSlug: "rust-fundamentals-4",
        numeral: "I.4",
        title: "The Rune-Smith's Recipe",
        intro:
          "On the forge wall hangs a recipe: take two ingots, fuse them, hand back the alloy. \"A recipe written once serves a thousand forgings,\" Ferrisia says. \"The smiths called them functions. Write yours, and the forge will call it by name.\"",
      },
      {
        lessonSlug: "rust-fundamentals-5",
        numeral: "I.5",
        title: "The Law of One Keeper",
        intro:
          "The vault door bears the Citadel's oldest law: every treasure has exactly one keeper. Hand a treasure to another and it is no longer yours — reach for it again and the wards will burn you. Tonight you learn why the old smiths sometimes forged a true copy instead.",
      },
      {
        lessonSlug: "rust-fundamentals-6",
        numeral: "I.6",
        title: "The Borrowed Blade",
        intro:
          "The Borrow Warden finally speaks: \"You need not surrender a blade to let another read its inscription. Lend it — a reference — and it returns to your hand when they are done.\" He taps the `&` sigil etched into his gauntlet. \"This mark. Learn it.\"",
      },
    ],
  },
  {
    numeral: "II",
    trackSlug: "control-flow",
    title: "The Hall of Forking Roads",
    territory: "Labyrinth of mirrors",
    overlord: "The Mirror Overlord",
    synopsis:
      "A labyrinth where every corridor matches a different fate. The Mirror Overlord traps travelers in infinite loops. Branch wisely, match every reflection, and break the eternal loop.",
    cardId: "stropillusion",
    skirmishes: [
      {
        lessonSlug: "control-flow-1",
        numeral: "II.1",
        title: "The Two Doors",
        intro:
          "The labyrinth's first chamber holds two doors and a single torch. \"Every path here is a question,\" whispers a reflection that is almost you. \"If the torch burns, one door. Else, the other. The maze only respects a traveler who can decide.\"",
      },
      {
        lessonSlug: "control-flow-2",
        numeral: "II.2",
        title: "The Hall of Every Reflection",
        intro:
          "A corridor of mirrors, each showing a different door you might have taken. The Mirror Overlord's rule is absolute: name what you see in every mirror — every one — or be trapped between them. The old runecraft calls this a `match`, and it forgets nothing.",
      },
      {
        lessonSlug: "control-flow-3",
        numeral: "II.3",
        title: "The Endless Corridor",
        intro:
          "This corridor repeats. The same sconce, the same crack in the stone, again and again. Travelers who walk it forever become part of the wall. The only way out is to count your echoes — and when the count is right, to `break` the spell mid-stride.",
      },
      {
        lessonSlug: "control-flow-4",
        numeral: "II.4",
        title: "The Sinking Gallery",
        intro:
          "The floor descends one flight at a time, and the water is rising. \"While there are floors above the tide, keep climbing down to the vault,\" the reflection says, unhelpfully. Check the condition before every step — the gallery drowns the careless.",
      },
      {
        lessonSlug: "control-flow-5",
        numeral: "II.5",
        title: "The Counted Steps",
        intro:
          "Five stepping stones cross the mirror-lake, numbered one to five. Step on each exactly once, in order, announcing it aloud — the lake listens. The old smiths had a rune for walking a known path without counting on your fingers: `for`.",
      },
      {
        lessonSlug: "control-flow-6",
        numeral: "II.6",
        title: "The Overlord's Maze",
        intro:
          "The final gallery: ten mirrors, and the Mirror Overlord hiding behind every third one. Walk the row; call out the number of each mirror — but where the Overlord hides, shout \"mirror\" instead. Branch inside your loop, Forgeborn. Break the labyrinth's heart.",
      },
    ],
  },
  {
    numeral: "III",
    trackSlug: "rust-standard-library",
    title: "The Endless Vaults",
    territory: "Dungeon-archive beneath the realm",
    overlord: "The Hoarder",
    synopsis:
      "Beneath the realm sleeps every tool the old Stroopies ever forged: growable satchels, enchanted ledgers, chains of lazy spirits that do no work until collected. The Hoarder guards it all — and indexes everything off-by-one.",
    cardId: "stroopkeeper",
    skirmishes: [
      {
        lessonSlug: "rust-standard-library-1",
        numeral: "III.1",
        title: "The Bottomless Satchel",
        intro:
          "The first vault holds the Stroopies' favorite tool: a satchel that grows to fit whatever you push into it. \"A `Vec`,\" the Stroopkeeper says, unlocking the case. \"Every adventurer carries one. Few respect it. It counts from zero, as the old gods intended.\"",
      },
      {
        lessonSlug: "rust-standard-library-2",
        numeral: "III.2",
        title: "The Chain of Lazy Spirits",
        intro:
          "Deeper in, spirits hang in chains — each one holding a value, doing absolutely nothing. \"Iterators,\" whispers the Keeper. \"The laziest workers in the realm. They lift no finger until you collect. Chain them well and they'll sum a fortune in one breath.\"",
      },
      {
        lessonSlug: "rust-standard-library-3",
        numeral: "III.3",
        title: "The Shelf That May Be Empty",
        intro:
          "The Hoarder's trap: a shelf with five slots, and adventurers who reach for the sixth. In the old days that reach crashed the whole vault. The satchel's `.get` asks politely instead — and the answer, Forgeborn, may be nothing at all.",
      },
      {
        lessonSlug: "rust-standard-library-4",
        numeral: "III.4",
        title: "The Enchanted Ledger",
        intro:
          "A book that answers questions: ask it \"gold?\" and it answers \"100\". Every entry is a key bound to a value, in no particular order — the enchantment trades order for speed. The smiths called it a `HashMap`. The Hoarder calls it his memory.",
      },
      {
        lessonSlug: "rust-standard-library-5",
        numeral: "III.5",
        title: "The Living Inscription",
        intro:
          "Some inscriptions are carved once and never change — and some grow, letter by letter, as their story does. Tonight you work with the living kind: `String`, the growable text of the realm, and `format!`, the spell that weaves many into one.",
      },
      {
        lessonSlug: "rust-standard-library-6",
        numeral: "III.6",
        title: "A Window Into the Hoard",
        intro:
          "The Hoarder will not let you carry the hoard out — but he'll let you look. A slice is a window into a stretch of treasure: no copy, no theft, just a view from here to there. Mind the edges; the window includes its start and excludes its end.",
      },
    ],
  },
  {
    numeral: "IV",
    trackSlug: "mastering-option",
    title: "The Vanishing Marsh",
    territory: "Haunted wetlands of maybe",
    overlord: null,
    synopsis:
      "Things here may or may not be. Villagers vanish into None; the foolish unwrap blindly and are never seen again. In the marsh you ask the only question that matters: Some, or None?",
    cardId: "stroophantom",
    skirmishes: [
      {
        lessonSlug: "mastering-option-1",
        numeral: "IV.1",
        title: "Some, or None?",
        intro:
          "The Stroophantom materializes — or doesn't. Hard to say. \"In the marsh, every answer is wrapped,\" it says from somewhere. \"`Some(thing)`, or `None`. Other realms pretend absence doesn't exist and crash into it at midnight. Here, we put it in the type.\"",
      },
      {
        lessonSlug: "mastering-option-2",
        numeral: "IV.2",
        title: "The Fools Who Unwrapped",
        intro:
          "Gravestones line the path, each carved with the same last word: `.unwrap()`. \"They assumed,\" the Phantom sighs. \"On `None`, unwrap panics — the whole program drowns. Carry a default instead, and the marsh cannot touch you.\"",
      },
      {
        lessonSlug: "mastering-option-3",
        numeral: "IV.3",
        title: "Ask the Marsh Itself",
        intro:
          "At the marsh's heart, a lantern that may or may not be lit. The Phantom teaches the final courtesy: \"`if let Some(light)` — if there is something, take it by name and use it. If not, walk the else path. Never assume. Ask.\"",
      },
    ],
  },
  {
    numeral: "V",
    trackSlug: "mastering-result",
    title: "The Trial of Two Fates",
    territory: "The realm's High Court",
    overlord: null,
    synopsis:
      "Every rune is judged here: Ok or Err. The Court's motto is carved over the door — #[must_use]. Learn to propagate judgment with ?, recover from Err with grace, and never panic in court.",
    cardId: "strooracle",
    skirmishes: [
      {
        lessonSlug: "mastering-result-1",
        numeral: "V.1",
        title: "The Two Verdicts",
        intro:
          "The Strooracle presides, and her court knows exactly two rulings: `Ok(value)` and `Err(reason)`. \"The marsh taught you absence,\" she says. \"I teach you failure — and failure, Forgeborn, always states its reason for the record.\"",
      },
      {
        lessonSlug: "mastering-result-2",
        numeral: "V.2",
        title: "Reading the Judgment",
        intro:
          "A scroll arrives sealed with a verdict inside. You do not guess at verdicts in this court — you `match` them: one arm for `Ok`, one arm for `Err`, both handled, nothing ignored. The motto over the door glows as you enter: `#[must_use]`.",
      },
      {
        lessonSlug: "mastering-result-3",
        numeral: "V.3",
        title: "The Mark of Propagation",
        intro:
          "Not every court must rule; some pass the case upward. The Oracle shows you the smallest rune in the realm: `?`. \"On Ok, unwrap and continue. On Err, return it to whoever called you — instantly. One mark, and the judgment flows uphill.\"",
      },
    ],
  },
  {
    numeral: "VI",
    trackSlug: "stellar-101",
    title: "The Constellation Gate",
    territory: "The broken sky",
    overlord: null,
    synopsis:
      "With five champions gathered, you ascend. Star-keeps for accounts, sigil-and-secret for keypairs, light-bridges for trustlines — and lumens flowing again for the first time since the Panic.",
    cardId: "astrostroopie",
    skirmishes: [
      {
        lessonSlug: "stellar-101-1",
        numeral: "VI.1",
        title: "The Star-Keep Charter",
        intro:
          "Astrostroopie meets you at the Gate with a charter and two keys. \"Every soul in the sky is a star-keep — an account. The `G` sigil you may shout from the towers; the `S` seed you guard with your life. Lose the first, awkward. Lose the second, everything.\"",
      },
      {
        lessonSlug: "stellar-101-2",
        numeral: "VI.2",
        title: "The Toll of the Gate",
        intro:
          "\"The sky's currency is the lumen,\" the Voyager says, flipping a coin that splits into ten million sparks. \"Each spark, a stroop. Every crossing pays a tiny toll — a hundred stroops, give or take the traffic — so no one floods the sky with noise.\"",
      },
      {
        lessonSlug: "stellar-101-3",
        numeral: "VI.3",
        title: "The Light-Bridge",
        intro:
          "Beyond lumens, the sky carries every asset a star-keep dares to issue — but only across bridges you build yourself. \"A trustline,\" Astrostroopie says, \"is you telling the sky: I accept THIS asset, from THIS issuer. No bridge, no cargo. The sky takes consent seriously.\"",
      },
      {
        lessonSlug: "stellar-101-4",
        numeral: "VI.4",
        title: "First Light Across the Sky",
        intro:
          "Everything converges: a destination star-keep, an asset, an amount. The Voyager steps back from the console. \"Lumens haven't crossed this Gate since the Panic. Chart the payment, Forgeborn. Let there be traffic.\"",
      },
    ],
  },
  {
    numeral: "VII",
    trackSlug: "soroban-smart-contracts",
    title: "The Beholder's Lair",
    territory: "Fortress of unhandled errors",
    overlord: "The Stroopbeholder",
    synopsis:
      "Beyond the Gate it waits, in a fortress built of every error never handled. Forge Soroban runes, deploy them to the living sky, and turn the Beholder's own corrupted contracts against it.",
    cardId: "stroopbeholder",
    skirmishes: [
      {
        lessonSlug: "soroban-smart-contracts-1",
        numeral: "VII.1",
        title: "The First Sky-Rune",
        intro:
          "The fortress gate reads runes, not steel. Here your Rust is no longer a program — it is a contract, carved into the living sky where every star can call it. No standard library, no operating system: just `#![no_std]`, the Env, and your word. Carve the first sky-rune.",
      },
      {
        lessonSlug: "soroban-smart-contracts-2",
        numeral: "VII.2",
        title: "The Ledger That Remembers",
        intro:
          "Inside the fortress, a ledger writes itself. Everything the Beholder ever counted is stored here — but storage in the sky is rented, not owned. Read, increment, write back. The ledger remembers what your contract tells it to remember, and nothing else.",
      },
      {
        lessonSlug: "soroban-smart-contracts-3",
        numeral: "VII.3",
        title: "The Seal of the Signer",
        intro:
          "The Beholder's corruption began with a single unguarded function — anyone could withdraw what wasn't theirs. One line would have stopped it. Demand the signer's seal before you move a single lumen: `require_auth`. Turn its own vault against it.",
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
