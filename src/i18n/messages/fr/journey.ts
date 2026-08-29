// Le Voyage du Builder — carte /journey et chrome du player de concept.
// Le contenu des étapes vit dans src/content/journey (EN-first).
export const journey = {
  metaTitle: "Voyage du Bâtisseur — TUSST",
  metaDescription:
    "La route essentielle : spec-driven, TDD, clean architecture et le vrai fonctionnement de Stellar — l'ingénierie qu'une IA n'apprendra pas à ta place.",
  kicker: "la route essentielle",
  title: "Voyage du Bâtisseur",
  intro:
    "Un rez-de-chaussée et deux arcs, une route. Niveau 0 : ce que sont vraiment un registre, une clé et un contrat — sans code, sans sigles. L'Art : les disciplines d'ingénierie que l'ère de l'IA exige sans te les offrir. Le Royaume : l'écosystème Stellar de bout en bout, du consensus à la frontière de la vie privée. Chapitres courts, vraie profondeur — et chaque porte vers Rust reste optionnelle.",
  mapHeading: "// chapitres",
  levels: {
    legend: "La route monte en trois niveaux — commencez au niveau 0, où rien n'est présupposé.",
    foundations: "niveau 0 · fondations",
    essential: "niveau 1 · essentiel",
    advanced: "niveau 2 · avancé",
  },
  arcs: {
    foundations: {
      title: "Niveau 0 — Fondations",
      blurb: "Le rez-de-chaussée : ce qu'est un registre, ce qu'est une clé, ce qu'est un contrat. Pas de code, pas de sigles, rien de présupposé. Trois chapitres courts et le reste de la route cesse d'intimider.",
    },
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
  startHere: "commencez ici",
  chapter: {
    requires: "s'appuie sur {chapters}",
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
    exercise: {
      kicker: "l'épreuve de l'examinateur",
      rubricLabel: "critères d'évaluation",
      placeholder: "Écris ta spécification ici — comportement, invariants, cas limites…",
      submit: "Soumettre à l'examinateur",
      checking: "l'examinateur lit…",
      passKicker: "spécification acceptée",
      failKicker: "l'examinateur demande des ajustements",
      revise: "Réviser et renvoyer",
      notConfigured: "L'examinateur n'est pas configuré dans cet environnement.",
      rateLimited: "L'examinateur a atteint sa limite d'utilisation actuelle ; réessaie plus tard.",
      signedOut: "Ta session a expiré ; reconnecte-toi avant d'envoyer ta réponse.",
      invalid: "La spécification n'a pas pu être envoyée. Relis-la puis réessaie.",
      unavailable: "L'examinateur est injoignable pour l'instant — réessaie dans un moment.",
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
