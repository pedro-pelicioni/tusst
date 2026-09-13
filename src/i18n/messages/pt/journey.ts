// A Jornada do Builder — mapa /journey e chrome do player de conceito.
// O conteúdo dos passos vive em src/content/journey (EN-first).
export const journey = {
  metaTitle: "Jornada do Construtor — TUSST",
  metaDescription:
    "A estrada essencial: spec-driven, TDD, clean architecture e como a Stellar funciona de verdade — a engenharia que uma IA não aprende por você.",
  kicker: "a estrada essencial",
  title: "Jornada do Construtor",
  intro:
    "Uma estrada, em três partes. Nível 0: o que são, de fato, um livro-razão, uma chave e um contrato — sem código, sem siglas. Parte I: as disciplinas de engenharia que a era da IA exige e não te entrega. Parte II: o ecossistema Stellar de ponta a ponta, do consenso à fronteira da privacidade. Capítulos curtos, profundidade real — e toda porta pra Rust segue opcional.",
  mapHeading: "// capítulos",
  levels: {
    legend: "Três níveis — comece no nível 0, onde nada é pressuposto.",
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
      title: "Parte I — Ofício de engenharia",
      blurb: "Engenharia na era da IA: specs, testes, bounded contexts, arquitetura — e como dirigir um modelo sem entregar o volante a ele.",
    },
    realm: {
      title: "Parte II — O ecossistema Stellar",
      blurb: "Stellar de ponta a ponta: consenso, transações, assets, âncoras, contratos, smart wallets, privacidade e o protocolo vivo.",
    },
  },
  recommended: "próximo recomendado",
  startHere: "comece aqui",
  chapter: {
    requires: "apoia-se em {chapters}",
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "em preparo",
    completed: "concluído",
    start: "Começar o capítulo",
    revisit: "Revisitar",
  },
  player: {
    exit: "Sair do capítulo",
    branch: {
      kicker: "ver em rust",
      optional: "aprofundamento opcional",
      cta: "Abrir a lição de Rust",
      locked: "Destrava com a seção {numeral} da Campanha",
    },
    lab: {
      kicker: "lab prático",
      completed: "lab concluído ✓",
      cta: "Abrir o lab",
      soon: "este lab ainda está em preparo",
    },
    exercise: {
      kicker: "revisão da spec",
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
      title: "Concluir o capítulo",
      body: "Marque o capítulo como concluído e o XP é seu.",
      cta: "Marcar como concluído (+{xp} xp)",
      saving: "salvando…",
      signedOut:
        "Seu progresso vive só neste navegador. Entre para salvar capítulos e ganhar XP.",
      signIn: "Entrar para salvar",
    },
    done: {
      kicker: "capítulo concluído",
      xpEarned: "+{xp} xp",
      levelUp: "Nível {level} alcançado!",
      xpTotal: "{xp} xp no total",
      already: "Já concluído.",
      next: "Próximo capítulo",
      backToMap: "Voltar à Jornada",
    },
  },
  testOut: {
    chapterCta: "Eu já sei isto",
    arcCta: "Testar e pular esta seção",
    chapterKicker: "test-out do capítulo",
    arcKicker: "test-out da seção",
    chapterTitle: "Pular {title}",
    arcTitle: "Pular {title}",
    chapterBlurb:
      "Acerte {count} perguntas sem nenhum erro e o capítulo conta como concluído, com XP e tudo — sem precisar ler.",
    arcBlurb:
      "Acerte {count} perguntas ({allowed} escorregão permitido) e todo capítulo desta seção conta como concluído de uma vez.",
    arcBlurbStrict:
      "Acerte {count} perguntas sem nenhum erro e todo capítulo desta seção conta como concluído de uma vez.",
    question: "Pergunta {current} de {total}",
    submit: "Corrigir minhas respostas",
    checking: "corrigindo…",
    passKicker: "aprovado",
    passBody: "{correct}/{total}. Concluídos: {chapters}.",
    failKicker: "ainda não",
    failBody:
      "{correct}/{total}. Nada foi concluído — daqui, ler o capítulo é o caminho mais rápido.",
    readInstead: "Ler o capítulo",
    readArcInstead: "Começar do início",
    tryAgain: "Tentar outro conjunto",
    backToMap: "Voltar para a Jornada",
    signedOut: "Entre primeiro — um capítulo concluído precisa cair numa conta.",
    signIn: "Entrar",
    unavailable: "Não foi possível carregar esse conjunto agora — tente daqui a pouco.",
  },
};
