// Chrome da experiência de lição: LessonSteps, LessonPlayer, página da lição.
export const lesson = {
  // página da lição (server)
  lessonNumber: "lição {number}",
  completedBadge: "concluída",
  skirmishTag: "combate · {act}",
  signIn: "entre",
  signInSuffix: "para rodar código e salvar o progresso",
  comingSoon: "em breve",
  comingSoonBody:
    "O conteúdo interativo desta lição ainda está sendo escrito. Experimente as lições anteriores em",
  comingSoonEnd: ".",

  // LessonSteps (player de passos)
  praise: ["Bem forjado!", "É isso!", "As runas aprovam.", "Impecável."],
  incorrect: "Ainda não — estude a runa de novo.",
  skirmishComplete: "combate concluído",
  doneSignedIn:
    "O farol tremula um pouco mais forte. Seu progresso está gravado na Pedra do Ledger.",
  doneAnonymous:
    "O farol tremula um pouco mais forte — mas runas não escritas se apagam. Crie uma conta gratuita para salvar seu progresso e reivindicar suas cartas de campeão.",
  saveProgress: "Salvar meu progresso",
  nextSkirmish: "Próximo combate ›",
  backToAct: "Voltar ao ato",
  exitLesson: "Sair da lição",
  stepProgress: "{current}/{total}",
  continueLabel: "Continuar",
  retry: "Tentar de novo",
  check: "Verificar",

  // LessonPlayer (editor + saída)
  signInToRun: "Entre para rodar seu código e salvar o progresso.",
  genericError: "Algo deu errado.",
  networkError: "Erro de rede — tente de novo.",
  reset: "resetar",
  run: "rodar ⌘⏎",
  running: "rodando…",
  loadingEditor: "carregando editor…",
  output: "saída",
  statusIdle: "ocioso",
  statusRunning: "rodando",
  statusPass: "passou",
  statusFail: "falhou",
  statusError: "erro",
  idleHint: "// rode seu código para conferi-lo contra os testes (⌘⏎)",
  compiling: "compilando…",
  stdout: "// stdout",
  compilerError: "// erro de compilação",
  actualOutput: "// sua saída",
  details: "// detalhes",
  mentorAsk: "pedir dica ao mentor",
  mentorThinking: "o mentor reflete…",
  mentorTitle: "// conselho do mentor",
  mentorRemaining: "{n} dicas restantes para esta lição hoje",
  mentorLimit:
    "o mentor descansa — você usou as dicas de hoje para esta lição. Restam as dicas do pergaminho:",
  mentorUnavailable:
    "o mentor está longe da forja — as dicas do pergaminho podem ajudar:",
  goldCoinAlt: "Moeda de ouro",
  goldEarned: "+{gold} de ouro",
  goldFirstReveal:
    "uma bolsa escondida se revela no seu cinto — seu ouro agora aparece no cabeçalho e no seu perfil",
  goldPouch: "bolsa: {total} de ouro",
  passedSaved: "todas as verificações passaram — progresso salvo",
  passed: "todas as verificações passaram",
  continueStep: "continuar ›",
  nextLesson: "próxima lição ›",
};
