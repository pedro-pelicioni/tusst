// App pages: path (el Salón usa `home`), campaign, cards, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "el camino opcional",
    title: "Campaña de Rust — Forgeborn",
    optionalNote:
      "La senda de maestría. Cada acto es opcional — y cada acto te afila más. El Viaje enlaza aquí cuando quieras el Rust detrás de un concepto.",
  },
  path: {
    kicker: "senda de campaña",
    title: "Forgeborn — de Rust a Soroban",
    championCards: "Cartas de campeón",
    claimed: "{percent}% reclamadas",
    actReward: "recompensa del acto",
    rewardStats: "{type} · poder {power}",
    skirmishesForgingSoon: "combates en la forja — pronto",
    startLearning: "Empezar a aprender",
    viewChampions: "Ver tus campeones",
  },
  cards: {
    metaTitle: "Los Personajes — TUSST",
    metaDescription:
      "Los ocho personajes del reino — siete que puedes jugar, uno al que te enfrentas. Conoces a cada uno al terminar un acto de la campaña.",
    kicker: "// el reparto",
    title: "Los Personajes",
    intro:
      "Ocho personajes recorren este reino, uno esperando al final de cada acto de la campaña. Siete de ellos puedes ser tú: elige uno y crecerá contigo a través de ocho formas, de aprendiz a campeón radiante. El octavo no es un compañero.",
    bossCard: "jefe",
    formsLabel: "ocho formas",
    playCta: "Jugar con este personaje",
    bossNote: "Se enfrenta, no se juega.",
    actLink: "Acto {numeral} — {title}",
    unassigned: "sin asignar",
    footnote:
      "los personajes son solo cosméticos — tu elección no otorga ninguna ventaja ni desbloquea nada. conoces a cada uno al terminar su acto de la campaña, y puedes cambiar de personaje desde tu perfil cuando quieras.",
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
    forgeborn: "forgeborn",
    lvlXp: "nv {level} · {xp} xp",
    since: "desde {date}",
    goldCoinAlt: "Moneda de oro — la dracma Stroop",
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
    viewChampions: "Ver tus campeones",
  },
};
