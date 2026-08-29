import { LAB_TEXT } from "@/content/labs/i18n";

export const labs = {
  metaTitle: "A Forja — TUSST",
  metaDescription:
    "Labs guiados de Stellar: botões que financiam carteiras, abrem trustlines e fazem deploy de contratos na testnet real — enquanto você entende o efeito de cada clique.",
  kicker: "a forja",
  title: "A Forja Está Aberta",
  intro:
    "Labs guiados onde cada botão faz algo real na testnet — carteiras financiadas, trustlines abertas, pagamentos liquidados — e o texto explica exatamente o que aconteceu no ledger.",
  liveHeading: "// labs",
  soonHeading: "// sendo forjados",
  freeMode: {
    title: "Modo livre — o IDE",
    blurb:
      "A oficina Soroban completa no seu navegador: escreva Rust, compile, faça deploy na testnet e invoque contratos. Sem trilhos, sem muros.",
    cta: "Abrir o IDE",
    badge: "sem login · sem configuração",
  },
  card: {
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "sendo forjado",
    completed: "concluído",
    start: "Entrar no lab",
    resume: "Continuar",
    replay: "Refazer",
  },
  difficulty: {
    novice: "noviço",
    adept: "adepto",
    master: "mestre",
  },
  sim: {
    ariaLabel: "Simulador de quórum do SCP",
    nodeAria: "Nó {node}",
    propose: "Propor um ledger",
    reset: "Reiniciar o conselho",
    running: "o conselho delibera…",
    closed: "Ledger {n} fechado ✓",
    stalled: "{count} assento(s) esperam seu conselho — segurança antes de vivacidade.",
    halted: "Nenhum quórum se forma — a rede espera em vez de bifurcar.",
    hint: "Aperte propor e veja a aceitação se propagar. Clique num nó para derrubá-lo (ou reerguê-lo).",
    ledgers: "ledgers fechados: {n}",
  },
  content: LAB_TEXT.pt,
  player: {
    exit: "Sair do lab",
    wallet: {
      none: "sem selo ainda",
      yours: "seu selo",
      copy: "Copiar endereço",
      copied: "Copiado",
    },
    phases: {
      prepare: "preparando",
      passkey: "aguardando sua passkey",
      queued: "na fila da forja",
      building: "compilando rust → wasm",
      sign: "assinando",
      submit: "enviando à rede",
      confirm: "confirmando no ledger",
    },
    viewTx: "Ver a transação no explorer",
    viewAccount: "Ver sua conta no explorer",
    viewContract: "Ver a smart wallet no explorer",
    retry: "Tentar novamente",
    errors: {
      testnetBusy: "Os espíritos da testnet estão ocupados — tente novamente em instantes.",
      walletRequired: "Forje suas chaves primeiro — volte uma tela.",
      missingState: "Um passo anterior ficou para trás — volte e complete.",
      forgeCold: "A forja está fria — o runner está inacessível. Tente de novo em instantes.",
      buildFailed: "A compilação falhou — o runner rejeitou este contrato. Tente novamente.",
      buildTimeout: "A compilação estourou o tempo — a forja estava lotada. Tente novamente.",
      localWalletRequired:
        "Este rito precisa da chave testnet local da Forja para pagar o deploy — forje-a no passo anterior.",
      passkeyUnavailable:
        "Passkeys exigem contexto seguro e suporte a WebAuthn. Abra este lab por HTTPS num dispositivo compatível.",
      passkeyMismatch:
        "Essa passkey pertence a outra smart wallet. Tente de novo e escolha a credencial que acabou de forjar.",
      passkeyFailed:
        "A cerimônia da passkey não terminou. Aprove o pedido do dispositivo e tente novamente.",
      smartWalletDeployFailed:
        "A passkey foi criada, mas sua smart wallet não entrou na testnet. Tente novamente em instantes.",
      smartWalletFundFailed:
        "A smart wallet entrou, mas o Friendbot não conseguiu financiá-la para a prova de assinatura. Tente novamente em instantes.",
      passkeyTransactionFailed:
        "A transferência assinada pela passkey não entrou na testnet. Aprove o pedido do dispositivo e tente novamente.",
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
        "token-balance-positive": "um saldo de token no seu contrato",
        "smart-account-code": "o contrato canônico de smart account",
        "smart-account-native-balance": "XLM nativo na smart wallet",
        "claimable-balance-created": "um baú que você trancou",
        "account-thresholds": "um cofre que exige duas assinaturas",
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
