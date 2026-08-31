// Páginas do app: path (o Salão usa `home`), campaign, cards, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "a estrada opcional",
    title: "Campanha de Rust",
    optionalNote:
      "A trilha de maestria. Cada ato é opcional — e cada ato te deixa mais afiado. A Jornada aponta para cá sempre que você quiser o Rust por trás de um conceito.",
  },
  path: {
    kicker: "trilha da campanha",
    title: "De Rust a Soroban",
    championCards: "Cartas da coleção",
    claimed: "{percent}% reivindicadas",
    actReward: "recompensa da seção",
    rewardStats: "{type} · poder {power}",
    skirmishesForgingSoon: "lições em preparo — em breve",
    startLearning: "Começar a aprender",
    viewChampions: "Ver suas cartas",
  },
  cards: {
    metaTitle: "Coleção de cartas — TUSST",
    metaDescription:
      "Cartas colecionáveis, uma por seção da campanha. Termine a última lição de uma seção para ganhar a carta dela.",
    kicker: "// coleção",
    title: "Coleção de cartas",
    intro:
      "Oito cartas, uma por seção da campanha. Termine a última lição de uma seção e a carta dela entra na sua coleção. Puramente cosmético — não dão vantagem nenhuma e não travam conteúdo algum.",
    bossCard: "carta do chefe",
    actLink: "Seção {numeral} — {title}",
    unassigned: "não atribuída",
    footnote:
      "as cartas são progressão cosmética — não trazem vantagem de gameplay. edições raras são concedidas por completar um ato de forma impecável. a reivindicação on-chain chega com o projeto final de Soroban.",
  },
  track: {
    backToPath: "trilha da campanha",
    trackLabel: "trilha / {level}",
    level: {
      beginner: "iniciante",
      intermediate: "intermediário",
      advanced: "avançado",
    },
    act: "Seção {numeral}",
    overlord: "chefe: {overlord}",
    actReward: "recompensa da seção",
    rewardStats: "{type} · poder {power}",
    progress: "progresso",
    lessonsHeading: "// lições",
    forgingTitle: "lições em preparo",
    forgingBefore:
      "Seu onboarding desbloqueou esta seção, mas as lições dela ainda estão sendo escritas. Volte para a",
    forgingLink: "trilha da campanha",
    forgingAfter: "para continuar lutando.",
    difficulty: {
      easy: "fácil",
      medium: "médio",
      hard: "difícil",
    },
    soon: "em breve",
    challengesAvailable:
      "{count} de {total} desafios disponíveis · mais estão a caminho.",
  },
  profile: {
    forgeborn: "builder",
    lvlXp: "nv {level} · {xp} xp",
    since: "desde {date}",
    goldCoinAlt: "Moeda de ouro — o dracma Stroop",
    goldCaption: "ouro · ganho uma lição de cada vez",
    stats: {
      skirmishesWon: "lições concluídas",
      actsCleared: "seções concluídas",
      championCards: "cartas da coleção",
    },
    campaignHeading: "// campanha",
    status: {
      cleared: "concluído",
      locked: "bloqueado",
    },
    continueCampaign: "Continuar a campanha",
    viewChampions: "Ver suas cartas",
  },
};
