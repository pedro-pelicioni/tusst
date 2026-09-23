// Páginas do app: path (o Salão usa `home`), campaign, cards, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "a estrada opcional",
    title: "Campanha de Rust",
    optionalNote:
      "A trilha de aprofundamento. Cada seção é opcional — e cada uma te deixa mais afiado. A Jornada aponta para cá sempre que você quiser o Rust por trás de um conceito.",
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
    metaTitle: "Os personagens — TUSST",
    metaDescription:
      "Os oito personagens do reino — sete você pode jogar, um você enfrenta. Cada um é conhecido ao terminar uma seção da campanha.",
    kicker: "// o elenco",
    title: "Os personagens",
    intro:
      "Oito personagens caminham por este reino, um esperando no fim de cada seção da campanha. Sete deles você pode ser: escolha um e ele cresce com você por oito formas, de aprendiz a campeão solar. O oitavo não é um companheiro.",
    bossCard: "chefe",
    formsLabel: "oito formas",
    playCta: "Jogar com este herói",
    bossNote: "Para enfrentar, não para jogar.",
    actLink: "Seção {numeral} — {title}",
    unassigned: "não atribuído",
    footnote:
      "os personagens são puramente cosméticos — sua escolha não dá vantagem nenhuma e não trava conteúdo algum. você conhece cada um terminando a seção da campanha dele, e pode trocar quem você joga no seu perfil quando quiser.",
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
