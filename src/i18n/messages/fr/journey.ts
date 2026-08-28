// Le Voyage du Builder — carte /journey et chrome du player de concept.
// Le contenu des étapes vit dans src/content/journey (EN-first).
export const journey = {
  metaTitle: "Voyage du Builder — TUSST",
  metaDescription:
    "La route essentielle : spec-driven, TDD, clean architecture et le vrai fonctionnement de Stellar — l'ingénierie qu'une IA n'apprendra pas à ta place.",
  kicker: "la route essentielle",
  title: "Voyage du Builder",
  intro:
    "Deux arcs, une route. L'Art : les disciplines d'ingénierie que l'ère de l'IA exige sans te les offrir. Le Royaume : l'écosystème Stellar de bout en bout, du consensus à la frontière de la vie privée. Chapitres courts, vraie profondeur — et chaque porte vers Rust reste optionnelle.",
  mapHeading: "// chapitres",
  arcs: {
    craft: {
      title: "Arc I — L'Art",
      blurb: "L'ingénierie à l'ère de l'IA : specs, tests, frontières, architecture — et l'art de commander le golem.",
    },
    realm: {
      title: "Arc II — Le Royaume",
      blurb: "Stellar de bout en bout : consensus, transactions, assets, ancres, contrats, smart wallets, vie privée et protocole vivant.",
    },
  },
  recommended: "prochain recommandé",
  chapter: {
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "en cours de forge",
    completed: "terminé",
    start: "Commencer le chapitre",
    revisit: "Revisiter",
  },
  player: {
    exit: "Quitter le chapitre",
    branch: {
      kicker: "le voir en rust",
      optional: "approfondissement optionnel",
      cta: "Entrer dans l'escarmouche",
      locked: "Se déverrouille avec l'Acte {numeral} de la Campagne",
    },
    lab: {
      kicker: "passage vers la forge",
      completed: "lab terminé ✓",
      cta: "Ouvrir le lab",
      soon: "ce lab est encore en cours de forge",
    },
    claim: {
      title: "Sceller le chapitre",
      body: "La route se souvient de ce que tu as parcouru. Scelle-la, et l'XP du chapitre est à toi.",
      cta: "Sceller (+{xp} xp)",
      saving: "scellage…",
      signedOut:
        "Ta lecture vit dans ce navigateur. Connecte-toi pour sceller les chapitres et gagner de l'XP.",
      signIn: "Se connecter pour sceller",
    },
    done: {
      kicker: "chapitre terminé",
      xpEarned: "+{xp} xp",
      levelUp: "Niveau {level} atteint !",
      xpTotal: "{xp} xp au total",
      already: "Déjà scellé — la route s'en souvient.",
      next: "Chapitre suivant",
      backToMap: "Retour au Voyage",
    },
  },
};
