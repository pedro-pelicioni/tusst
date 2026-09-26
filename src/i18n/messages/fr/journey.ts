// Le Voyage du Builder — carte /journey et chrome du player de concept.
// Le contenu des étapes vit dans src/content/journey (EN-first).
export const journey = {
  metaTitle: "Voyage du Bâtisseur — TUSST",
  metaDescription:
    "La route essentielle : spec-driven, TDD, clean architecture et le vrai fonctionnement de Stellar — l'ingénierie qu'une IA n'apprendra pas à ta place.",
  kicker: "la route essentielle",
  title: "Voyage du Bâtisseur",
  intro:
    "Une route, en trois parties. Niveau 0 : ce que sont vraiment un registre, une clé et un contrat — sans code, sans sigles. Partie I : les disciplines d'ingénierie que l'ère de l'IA exige sans te les offrir. Partie II : l'écosystème Stellar de bout en bout, du consensus à la frontière de la vie privée. Chapitres courts, vraie profondeur — et chaque porte vers Rust reste optionnelle.",
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
      title: "Partie I — Le métier d'ingénieur",
      blurb: "L'ingénierie à l'ère de l'IA : specs, tests, frontières, architecture — et comment piloter un modèle sans lui céder le volant.",
    },
    realm: {
      title: "Partie II — L'écosystème Stellar",
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
      title: "Terminer le chapitre",
      body: "Marque ce chapitre comme terminé et son XP est à toi.",
      cta: "Marquer comme terminé (+{xp} xp)",
      saving: "enregistrement…",
      signedOut:
        "Ta progression ne vit que dans ce navigateur. Connecte-toi pour sauvegarder les chapitres et gagner de l'XP.",
      signIn: "Se connecter pour sauvegarder",
    },
    done: {
      kicker: "chapitre terminé",
      xpEarned: "+{xp} xp",
      levelUp: "Niveau {level} atteint !",
      xpTotal: "{xp} xp au total",
      already: "Déjà terminé.",
      next: "Chapitre suivant",
      backToMap: "Retour au Voyage",
    },
  },
  testOut: {
    chapterCta: "Je sais déjà tout ça",
    arcCta: "Passer l'examen de ce tronçon",
    chapterKicker: "examen du chapitre",
    arcKicker: "examen du tronçon",
    chapterTitle: "Sauter {title}",
    arcTitle: "Sauter {title}",
    chapterBlurb:
      "Répondez juste à {count} questions, sans aucune erreur, et le chapitre compte comme terminé, XP compris — sans rien lire.",
    arcBlurb:
      "Répondez juste à {count} questions ({allowed} erreur tolérée) et chaque chapitre de ce tronçon compte comme terminé d'un coup.",
    arcBlurbStrict:
      "Répondez juste à {count} questions, sans aucune erreur, et chaque chapitre de ce tronçon compte comme terminé d'un coup.",
    question: "Question {current} sur {total}",
    submit: "Corriger ma copie",
    checking: "correction…",
    passKicker: "réussi",
    passBody: "{correct}/{total}. Terminés : {chapters}.",
    failKicker: "pas cette fois",
    failBody:
      "{correct}/{total}. Rien n'a été validé — d'ici, lire le chapitre est la route la plus rapide.",
    readInstead: "Lire le chapitre",
    readArcInstead: "Commencer par le début",
    tryAgain: "Tirer une nouvelle copie",
    backToMap: "Retour au Voyage",
    signedOut: "Connectez-vous d'abord — un chapitre terminé doit atterrir sur un compte.",
    signIn: "Se connecter",
    unavailable: "Impossible de tirer cette copie pour l'instant — réessayez dans un instant.",
  },
};
