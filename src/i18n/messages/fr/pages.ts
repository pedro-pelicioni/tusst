// App pages: path, cards, tracks/[slug], profile.
export const pages = {
  path: {
    kicker: "voie de campagne",
    title: "Forgeborn — de Rust à Soroban",
    championCards: "Cartes de champion",
    claimed: "{percent}% réclamées",
    actReward: "récompense d'acte",
    rewardStats: "{type} · puissance {power}",
    skirmishesForgingSoon: "combats en cours de forge — bientôt",
    startLearning: "Commencer à apprendre",
    viewChampions: "Voir tes champions",
  },
  cards: {
    metaTitle: "Champions du Royaume — TUSST",
    metaDescription:
      "Les cartes de champion de la Constellation Brisée. Remporte le combat final d'un acte pour réclamer son champion.",
    kicker: "// la constellation brisée",
    title: "Champions du Royaume",
    intro:
      "Huit cartes pour huit actes, dispersées par la Grande Panique. Chaque acte de la campagne s'achève sur un combat final — remporte-le, et son champion rejoint ta collection. La dernière carte ne se donne pas. Elle se prend.",
    bossCard: "carte de boss",
    actLink: "Acte {numeral} — {title}",
    unassigned: "non attribuée",
    footnote:
      "les cartes sont une progression cosmétique — elles n'apportent aucun avantage en jeu. les tirages rares récompensent un acte terminé sans faute. la réclamation on-chain arrive avec le capstone Soroban.",
  },
  track: {
    backToPath: "voie de campagne",
    trackLabel: "parcours / {level}",
    level: {
      beginner: "débutant",
      intermediate: "intermédiaire",
      advanced: "avancé",
    },
    act: "Acte {numeral}",
    overlord: "boss : {overlord}",
    actReward: "récompense d'acte",
    rewardStats: "{type} · puissance {power}",
    progress: "progression",
    lessonsHeading: "// leçons",
    forgingTitle: "combats en cours de forge",
    forgingBefore:
      "Ton onboarding a déverrouillé cet acte, mais ses combats sont encore en cours d'écriture. Retourne à la",
    forgingLink: "voie de campagne",
    forgingAfter: "pour continuer le combat.",
    difficulty: {
      easy: "facile",
      medium: "moyen",
      hard: "difficile",
    },
    soon: "bientôt",
    challengesAvailable:
      "{count} défis sur {total} disponibles · d'autres arrivent.",
  },
  profile: {
    forgeborn: "forgeborn",
    lvlXp: "niv {level} · {xp} xp",
    since: "depuis {date}",
    goldCoinAlt: "Pièce d'or — la drachme Stroop",
    goldCaption: "or · gagné une leçon à la fois",
    stats: {
      skirmishesWon: "combats gagnés",
      actsCleared: "actes terminés",
      championCards: "cartes de champion",
    },
    campaignHeading: "// campagne",
    status: {
      cleared: "terminé",
      locked: "verrouillé",
    },
    continueCampaign: "Continuer la campagne",
    viewChampions: "Voir tes champions",
  },
};
