// App pages: path (le Hall utilise `home`), campaign, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "la route optionnelle",
    title: "Campagne Rust",
    optionalNote:
      "La voie de la maîtrise. Chaque acte est optionnel — et chaque acte t'aiguise. Le Voyage pointe ici dès que tu veux le Rust derrière un concept.",
  },
  path: {
    kicker: "voie de campagne",
    title: "De Rust à Soroban",
    championCards: "Cartes de champion",
    claimed: "{percent}% réclamées",
    actReward: "récompense d'acte",
    rewardStats: "{type} · puissance {power}",
    skirmishesForgingSoon: "combats en cours de forge — bientôt",
    startLearning: "Commencer à apprendre",
    viewChampions: "Voir tes champions",
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
    forgeborn: "bâtisseur",
    lvlXp: "niv {level} · {xp} xp",
    since: "depuis {date}",
    goldCoinAlt: "Pièce d'or",
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
    openCampaignMap: "Ouvrir la carte de la campagne",
  },
};
