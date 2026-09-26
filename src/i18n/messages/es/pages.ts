// App pages: path (el Salón usa `home`), campaign, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "el camino opcional",
    title: "Campaña de Rust",
    optionalNote:
      "La senda de maestría. Cada acto es opcional — y cada acto te afila más. El Viaje enlaza aquí cuando quieras el Rust detrás de un concepto.",
  },
  path: {
    kicker: "senda de campaña",
    title: "De Rust a Soroban",
    championCards: "Cartas de campeón",
    claimed: "{percent}% reclamadas",
    actReward: "recompensa del acto",
    rewardStats: "{type} · poder {power}",
    skirmishesForgingSoon: "combates en la forja — pronto",
    startLearning: "Empezar a aprender",
    viewChampions: "Ver tus campeones",
  },
  track: {
    backToPath: "senda de campaña",
    trackLabel: "ruta / {level}",
    level: {
      beginner: "principiante",
      intermediate: "intermedio",
      advanced: "avanzado",
    },
    act: "Acto {numeral}",
    overlord: "jefe: {overlord}",
    actReward: "recompensa del acto",
    rewardStats: "{type} · poder {power}",
    progress: "progreso",
    lessonsHeading: "// lecciones",
    forgingTitle: "combates en la forja",
    forgingBefore:
      "Tu onboarding desbloqueó este acto, pero sus combates aún se están escribiendo. Vuelve a la",
    forgingLink: "senda de campaña",
    forgingAfter: "para seguir luchando.",
    difficulty: {
      easy: "fácil",
      medium: "media",
      hard: "difícil",
    },
    soon: "pronto",
    challengesAvailable:
      "{count} de {total} desafíos disponibles · más están en camino.",
  },
  profile: {
    forgeborn: "constructor",
    lvlXp: "nv {level} · {xp} xp",
    since: "desde {date}",
    goldCoinAlt: "Moneda de oro",
    goldCaption: "oro · ganado lección a lección",
    stats: {
      skirmishesWon: "combates ganados",
      actsCleared: "actos superados",
      championCards: "cartas de campeón",
    },
    campaignHeading: "// campaña",
    status: {
      cleared: "superado",
      locked: "bloqueado",
    },
    continueCampaign: "Continuar la campaña",
    openCampaignMap: "Abrir el mapa de la campaña",
  },
};
