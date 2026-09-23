// App pages: path (le Hall utilise `home`), campaign, cards, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "la route optionnelle",
    title: "Campagne Rust — Forgeborn",
    optionalNote:
      "La voie de la maîtrise. Chaque acte est optionnel — et chaque acte t'aiguise. Le Voyage pointe ici dès que tu veux le Rust derrière un concept.",
  },
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
    metaTitle: "Les Personnages — TUSST",
    metaDescription:
      "Les huit personnages du royaume — sept à incarner, un à affronter. Chacun se rencontre en terminant une section de la campagne.",
    kicker: "// la troupe",
    title: "Les Personnages",
    intro:
      "Huit personnages parcourent ce royaume, un qui attend à la fin de chaque section de la campagne. Sept d'entre eux, tu peux les incarner : choisis-en un et il grandira avec toi à travers huit formes, de l'apprenti au champion radieux. Le huitième n'est pas un compagnon.",
    bossCard: "boss",
    formsLabel: "huit formes",
    playCta: "Incarner ce héros",
    bossNote: "Affronté, pas incarné.",
    actLink: "Section {numeral} — {title}",
    unassigned: "non attribué",
    footnote:
      "les personnages sont purement cosmétiques — ton choix n'apporte aucun avantage et ne verrouille rien. tu rencontres chacun d'eux en terminant sa section de la campagne, et tu peux changer de personnage depuis ton profil à tout moment.",
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
