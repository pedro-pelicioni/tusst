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
  welcomeBody3: " na Stellar — uma pequena runa de cada vez.",

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
    "Empregado",
    "Freelancer / autônomo",
    "Nenhuma dessas",
  ],
  xpLevels: [
    {
      label: "NENHUMA",
      blurb: "Você nunca escreveu uma runa. Perfeito — a Cidadela foi construída para você.",
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
  proofHeading: "Os anciões já forjaram muitos aprendizes",
  proofBody:
    "Nossa missão é transformar Forgeborn em mestres da arte rúnica — código de verdade, julgado por provas ocultas, direto no seu navegador. Sem setup. Sem desculpas.",

  // Plano de campanha.
  planKicker: "Seu plano de campanha",
  planHeading: "Forgeborn — de Rust a Soroban",
  unlocksPaths: "Sua experiência desbloqueia as primeiras {count} trilhas.",
  firstPath: "Toda lenda começa na primeira trilha.",

  // Botões e links.
  begin: "Começar",
  continue: "Continuar",
  startLearning: "Começar a aprender",
  haveAccount: "Já tenho uma conta",

  // Rótulos aria.
  back: "Voltar",
  exit: "Sair",
  codingExperience: "Experiência com programação",
};
