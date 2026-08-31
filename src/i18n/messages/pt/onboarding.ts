// Assistente de onboarding.
export const onboarding = {
  chooseLanguage: "Escolha seu idioma",

  // Tela de boas-vindas. O corpo é dividido em segmentos para que os spans
  // em negrito <strong> possam ser renderizados ao redor do texto traduzido.
  welcomeHeading: "Aprenda a Arte Rúnica",
  welcomeBody1: "Domine as habilidades para forjar programas ",
  welcomeBodyRust: "Rust",
  welcomeBody2: " e ",
  welcomeBodySoroban: "contratos Soroban",
  welcomeBody3: " na Stellar — um pequeno passo de cada vez.",

  // Títulos das perguntas.
  goalQuestion: "Por que você está aprendendo a programar?",
  profileQuestion: "Qual destas opções descreve você melhor?",
  xpQuestion: "Quanta experiência com programação você tem?",

  // Rótulos das opções, por índice. As constantes em inglês em
  // OnboardingFlow.tsx seguem sendo os valores canônicos gravados em
  // localStorage/cookies — estes são apenas de exibição.
  goals: [
    "Migrar para uma carreira em tecnologia",
    "Melhorar no meu trabalho ou nos estudos",
    "Por diversão — aprender algo novo",
    "Construir um dApp na Stellar",
    "Nenhuma dessas",
  ],
  profiles: [
    "Estudante do ensino médio",
    "Estudante universitário",
    "Trabalho em tempo integral",
    "Freelancer / autônomo",
    "Nenhuma dessas",
  ],
  xpLevels: [
    {
      label: "NENHUMA",
      blurb: "Você nunca escreveu uma linha de código. Perfeito — esta trilha começa aí.",
    },
    {
      label: "POUCA",
      blurb: "Você já experimentou programar e conhece alguns fundamentos.",
    },
    {
      label: "MUITA",
      blurb: "Você programa com frequência e quer dominar Rust & Soroban.",
    },
  ],

  // Prova social.
  proofHeading: "Builders que terminaram a trilha",
  proofBody:
    "Código de verdade, corrigido por testes ocultos, direto no seu navegador. Sem setup local, sem toolchain para instalar.",

  // Plano de campanha.
  planKicker: "Seu plano de campanha",
  planHeading: "De Rust a Soroban",
  unlocksPaths: "Sua experiência desbloqueia as primeiras {count} trilhas.",
  firstPath: "Toda lenda começa na primeira trilha.",
  planJourneyNote:
    "Estas seções são sua estrada opcional de aprofundamento. Sua estrada essencial — a Jornada do Construtor — começa agora.",

  // Botões e links.
  begin: "Começar",
  continue: "Continuar",
  startLearning: "Começar a aprender",
  startJourney: "Começar a Jornada",
  orCampaign: "prefere Rust primeiro? comece a Campanha",
  haveAccount: "Já tenho uma conta",

  // Rótulos aria.
  back: "Voltar",
  exit: "Sair",
  codingExperience: "Experiência com programação",
};
