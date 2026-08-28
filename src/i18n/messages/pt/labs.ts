// A Forja — índice /labs (labs guiados + card do IDE livre) e o chrome do
// player de lab. O conteúdo dos passos vive em src/content/labs (EN-first).
export const labs = {
  metaTitle: "A Forja — TUSST",
  metaDescription:
    "Labs guiados de Stellar: botões grandes que fundeiam wallets, abrem trustlines e deployam contratos na testnet real — enquanto você aprende o que cada aperto fez.",
  kicker: "a forja",
  title: "A Forja Está Aberta",
  intro:
    "Labs guiados onde cada botão grande faz algo real na testnet — wallets fundeadas, trustlines abertas, pagamentos liquidados — e o texto conta exatamente o que acabou de acontecer no ledger.",
  liveHeading: "// labs",
  soonHeading: "// sendo forjados",
  freeMode: {
    title: "Modo livre — o IDE",
    blurb:
      "A oficina Soroban completa no seu navegador: escreva Rust, builde, deploye na testnet, invoque. Sem trilhos, sem muros.",
    cta: "Abrir o IDE",
    badge: "sem login · sem setup",
  },
  card: {
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "sendo forjado",
    completed: "concluído",
    start: "Entrar no lab",
    resume: "Continuar",
    replay: "Rejogar",
  },
  difficulty: {
    novice: "noviço",
    adept: "adepto",
    master: "mestre",
  },
  player: {
    exit: "Sair do lab",
    wallet: {
      none: "sem sigilo ainda",
      yours: "seu sigilo",
      copy: "Copiar endereço",
      copied: "Copiado",
    },
    phases: {
      prepare: "preparando",
      sign: "assinando",
      submit: "enviando à rede",
      confirm: "confirmando no ledger",
    },
    viewTx: "Ver a transação no explorer",
    viewAccount: "Ver sua conta no explorer",
    retry: "Malhar de novo",
    errors: {
      testnetBusy: "Os espíritos da testnet estão ocupados — malhe de novo em instantes.",
      walletRequired: "Forje suas chaves primeiro — volte uma tela.",
      missingState: "Um passo anterior ficou para trás — volte e complete.",
    },
    checkpoint: {
      title: "Reivindique sua recompensa",
      cta: "Ler o ledger & reivindicar XP",
      verifying: "consultando o ledger…",
      anonymous:
        "Sua jornada vive neste navegador. Entre e a Forja verifica tudo on-chain — prova, não promessa — e paga seu XP.",
      signIn: "Entrar para reivindicar",
      failed:
        "O ledger discorda — faltam feitos: {checks}. Complete os passos acima e reivindique de novo.",
      checkNames: {
        "account-exists": "uma conta viva",
        trustline: "a trustline de USDC",
        "payment-sent": "um pagamento enviado",
      },
    },
    done: {
      kicker: "lab concluído",
      xpEarned: "+{xp} xp",
      levelUp: "Nível {level} alcançado!",
      xpTotal: "{xp} xp no total",
      already: "Já reivindicado — o ledger lembra.",
      backToForge: "Voltar à Forja",
      openIde: "Seguir no IDE",
    },
  },
};
