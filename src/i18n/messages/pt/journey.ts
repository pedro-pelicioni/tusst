// A Jornada do Builder — mapa /journey e chrome do player de conceito.
// O conteúdo dos passos vive em src/content/journey (EN-first).
export const journey = {
  metaTitle: "Jornada do Construtor — TUSST",
  metaDescription:
    "A estrada essencial: spec-driven, TDD, clean architecture e como a Stellar funciona de verdade — a engenharia que uma IA não aprende por você.",
  kicker: "a estrada essencial",
  title: "Jornada do Construtor",
  intro:
    "Um térreo e dois arcos, uma estrada. Nível 0: o que são, de fato, um livro-razão, uma chave e um contrato — sem código, sem siglas. O Ofício: as disciplinas de engenharia que a era da IA exige e não te entrega. O Reino: o ecossistema Stellar de ponta a ponta, do consenso à fronteira da privacidade. Capítulos curtos, profundidade real — e toda porta pra Rust segue opcional.",
  mapHeading: "// capítulos",
  levels: {
    legend: "A estrada sobe em três níveis — comece no nível 0, onde nada é pressuposto.",
    foundations: "nível 0 · fundamentos",
    essential: "nível 1 · essencial",
    advanced: "nível 2 · avançado",
  },
  arcs: {
    foundations: {
      title: "Nível 0 — Fundamentos",
      blurb: "O térreo: o que é um livro-razão, o que é uma chave, o que é um contrato. Sem código, sem siglas, sem nada pressuposto. Três capítulos curtos e o resto da estrada deixa de intimidar.",
    },
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
  startHere: "comece aqui",
  chapter: {
    requires: "apoia-se em {chapters}",
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
  testOut: {
    chapterCta: "Eu já sei isto",
    arcCta: "Testar e pular este trecho",
    chapterKicker: "a chave do atalho",
    arcKicker: "o selo mestre",
    chapterTitle: "Pular {title}",
    arcTitle: "Pular {title}",
    chapterBlurb:
      "Acerte {count} perguntas sem nenhum erro e o capítulo é selado, com XP e tudo — sem precisar ler.",
    arcBlurb:
      "Acerte {count} perguntas ({allowed} escorregão permitido) e todo capítulo deste trecho é selado de uma vez.",
    arcBlurbStrict:
      "Acerte {count} perguntas sem nenhum erro e todo capítulo deste trecho é selado de uma vez.",
    question: "Pergunta {current} de {total}",
    submit: "Corrigir minha prova",
    checking: "corrigindo…",
    passKicker: "a porta se abre",
    passBody: "{correct}/{total}. Selados: {chapters}.",
    failKicker: "hoje não",
    failBody:
      "{correct}/{total}. Nada foi selado — daqui, o capítulo é o caminho mais rápido.",
    readInstead: "Ler o capítulo",
    readArcInstead: "Começar do início",
    tryAgain: "Sortear outra prova",
    backToMap: "Voltar para a Jornada",
    signedOut: "Entre primeiro — um capítulo selado precisa cair numa conta.",
    signIn: "Entrar",
    unavailable: "Não foi possível sortear essa prova agora — tente daqui a pouco.",
  },
};
