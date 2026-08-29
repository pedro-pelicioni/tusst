// A Jornada do Builder — mapa /journey e chrome do player de conceito.
// O conteúdo dos passos vive em src/content/journey (EN-first).
export const journey = {
  metaTitle: "Jornada do Construtor — TUSST",
  metaDescription:
    "A estrada essencial: spec-driven, TDD, clean architecture e como a Stellar funciona de verdade — a engenharia que uma IA não aprende por você.",
  kicker: "a estrada essencial",
  title: "Jornada do Construtor",
  intro:
    "Dois arcos, uma estrada. O Ofício: as disciplinas de engenharia que a era da IA exige e não te entrega. O Reino: o ecossistema Stellar de ponta a ponta, do consenso à fronteira da privacidade. Capítulos curtos, profundidade real — e toda porta pra Rust segue opcional.",
  mapHeading: "// capítulos",
  arcs: {
    craft: {
      title: "Arco I — O Ofício",
      blurb: "Engenharia na era da IA: specs, testes, fronteiras, arquitetura — e como comandar o golem.",
    },
    realm: {
      title: "Arco II — O Reino",
      blurb: "Stellar de ponta a ponta: consenso, transações, assets, âncoras, contratos, smart wallets, privacidade e o protocolo vivo.",
    },
  },
  recommended: "próximo recomendado",
  chapter: {
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "sendo forjado",
    completed: "concluído",
    start: "Começar o capítulo",
    revisit: "Revisitar",
  },
  player: {
    exit: "Sair do capítulo",
    branch: {
      kicker: "ver em rust",
      optional: "aprofundamento opcional",
      cta: "Entrar no combate",
      locked: "Destrava com o Ato {numeral} da Campanha",
    },
    lab: {
      kicker: "passagem pra forja",
      completed: "lab concluído ✓",
      cta: "Abrir o lab",
      soon: "este lab ainda está sendo forjado",
    },
    exercise: {
      kicker: "a prova do examinador",
      rubricLabel: "critérios de avaliação",
      placeholder: "Escreva sua especificação aqui — comportamento, invariantes, casos de borda…",
      submit: "Enviar ao examinador",
      checking: "o examinador lê…",
      passKicker: "especificação aceita",
      failKicker: "o examinador pede ajustes",
      revise: "Revisar e reenviar",
      notConfigured: "O examinador não está configurado neste ambiente.",
      rateLimited: "O examinador atingiu o limite de uso atual — tente novamente mais tarde.",
      signedOut: "Sua sessão expirou — entre novamente antes de enviar.",
      invalid: "Não foi possível enviar a spec. Revise o texto e tente novamente.",
      unavailable: "O examinador está inacessível agora — tente de novo em instantes.",
    },
    claim: {
      title: "Selar o capítulo",
      body: "A estrada lembra o que você caminhou. Sele, e o XP do capítulo é seu.",
      cta: "Selar (+{xp} xp)",
      saving: "selando…",
      signedOut:
        "Sua leitura vive neste navegador. Entre para selar capítulos e ganhar XP.",
      signIn: "Entrar para selar",
    },
    done: {
      kicker: "capítulo concluído",
      xpEarned: "+{xp} xp",
      levelUp: "Nível {level} alcançado!",
      xpTotal: "{xp} xp no total",
      already: "Já selado — a estrada lembra.",
      next: "Próximo capítulo",
      backToMap: "Voltar à Jornada",
    },
  },
};
