// A Forja — índice /labs (labs guiados + card do IDE livre) e o chrome do
// player de lab. O conteúdo dos passos vive em src/content/labs (EN-first).
const passkeySmartWalletContent = {
  meta: {
    title: "Smart Wallet com Passkey",
    tagline: "Uma carteira sem frase-semente — seu dispositivo assina.",
  },
  steps: {
    intro: {
      body: `## A chave que você nunca vê

Uma carteira Stellar clássica começa com um segredo \`S…\`. Uma **carteira com passkey** começa dentro do hardware seguro do seu celular ou computador. O WebAuthn pede que esse hardware crie uma chave **secp256r1** e libera somente a parte pública; Face ID, Touch ID, um PIN ou uma chave de segurança desbloqueiam cada assinatura.

Hoje você vai cadastrar uma passkey real, publicar um **contrato de smart account** na testnet e responder a um novo desafio de autenticação com ela. Nenhuma frase-semente será mostrada — porque ela não existe.`,
    },
    "forge-deployer": {
      title: "Prepare a conta de lançamento",
      body: `Um contrato não consegue pagar a taxa do próprio nascimento. Por isso, a Forja precisa de uma pequena **conta G** comum para lançá-lo. Se você já criou uma, ela será reutilizada; caso contrário, uma nova chave exclusiva da testnet será criada neste navegador.

Essa conta de lançamento **não** assina pela smart wallet. Ela apenas paga e fornece o salt do deploy — nada mais.`,
      cta: "Preparar a conta de lançamento",
      successBody: `Conta de lançamento pronta:

\`{address}\`

O segredo permanece neste navegador. A passkey criada a seguir ficará separada, dentro do hardware seguro.`,
    },
    "fund-deployer": {
      title: "Abasteça o lançamento",
      body:
        "Publicar um contrato Soroban consome XLM de testnet para a taxa do envelope e os recursos do ledger. O Friendbot financia a conta de lançamento; se ela já existir, a Forja simplesmente a reutiliza.",
      cta: "Financiar com Friendbot",
      successBody:
        "{balance} XLM agora abastecem a conta de lançamento. É o bastante para publicar a smart wallet sem relayer e sem dar à chave de lançamento qualquer autoridade sobre ela.",
    },
    "quiz-secret": {
      question: "Onde fica a parte privada de uma passkey?",
      options: [
        "Dentro do hardware seguro do autenticador; o app recebe assinaturas, nunca a chave privada",
        "Criptografada no banco de dados do TUSST para o servidor assinar depois",
        "Dentro do contrato da smart account como dado público do ledger",
      ],
      explain:
        "Exatamente. O navegador entrega um desafio ao autenticador. A rede vê uma chave pública e uma assinatura; o TUSST nunca recebe material de chave privada.",
    },
    "create-passkey-wallet": {
      title: "Cadastre a passkey e publique a carteira",
      body: `Seu dispositivo abrirá o pedido nativo de passkey. Depois da sua aprovação, a Forja monta uma **smart account do Protocolo 27**, cuja assinatura padrão é essa credencial, e a conta de lançamento paga a taxa do deploy diretamente pelo RPC.

O código da conta é o Wasm canônico baseado em OpenZeppelin e publicado com \`smart-account-kit@0.6.2\`.`,
      cta: "Criar passkey e publicar a carteira",
      successBody: `Sua carteira sem seed está ativa na testnet:

\`{contract}\`

O endereço começa com **C** porque a carteira é um contrato. Sua regra de autorização aponta para a passkey que você acabou de criar — não para a conta G que pagou o deploy.`,
    },
    "quiz-authority": {
      question:
        "A conta G pagou para publicar a smart wallet. O segredo dela pode autorizar gastos da nova conta C?",
      options: [
        "Não — pagar o deploy não torna a conta uma signatária; as regras da própria smart account decidem",
        "Sim — quem paga a taxa passa a controlar para sempre todo contrato publicado",
        "Somente até o próximo ledger fechar",
      ],
      explain:
        "Certo. Conta de origem, pagador da taxa, salt do deployer e signatário da smart account são papéis separados. A assinatura padrão desta carteira é a credencial WebAuthn.",
    },
    "authenticate-passkey": {
      title: "Deixe a passkey assinar",
      body: `O deploy registrou uma chave pública, mas uma carteira só é útil quando a rede aceita suas assinaturas. A Forja financia a nova conta C com XLM de testnet, monta uma **transferência de 1 XLM de volta para sua conta de lançamento** e pede que a credencial vinculada a \`{contract}\` a autorize.

Aprove o pedido do dispositivo. Desta vez, a assinatura vai para a rede, e o \`__check_auth\` da smart account precisa aceitá-la.`,
      cta: "Assinar e enviar 1 XLM com a passkey",
      successBody: `A transferência foi concluída. Seu hardware seguro assinou, o verificador WebAuthn conferiu a prova secp256r1 e o \`__check_auth\` autorizou a smart wallet a enviar **1 XLM**.

Essa transação é a prova pública de que a passkey controla \`{contract}\` — não apenas de que uma janela do navegador apareceu.`,
    },
    "quiz-cap71": {
      question:
        "O que a CAP-71 do Protocolo 27 tornou mais fácil para smart accounts?",
      options: [
        "Delegar autenticação de forma limpa, reduzindo o peso e o custo de fluxos de autorização com vários signatários",
        "Transformar automaticamente toda conta G clássica em uma passkey",
        "Remover todas as taxas de transação da rede",
      ],
      explain:
        "Delegação é infraestrutura do protocolo: uma autoridade pode entregar o trabalho de autenticação a outra sem carregar o formato antigo completo em cada transação. Isso ajuda smart accounts; não elimina taxas nem reescreve contas clássicas.",
    },
    claim: {
      body:
        "Agora a Forja consultará a própria testnet: a conta G de lançamento precisa existir, o endereço C deve resolver para o **código canônico da smart account do Protocolo 27**, e essa smart wallet ainda deve possuir XLM nativo depois da transferência assinada pela passkey. Só então o ledger libera o XP do lab.",
    },
  },
};

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
  sim: {
    propose: "Propor um ledger",
    reset: "Reiniciar o conselho",
    running: "o conselho delibera…",
    closed: "Ledger {n} fechado ✓",
    stalled: "{count} assento(s) esperam seu conselho — segurança antes de vivacidade.",
    halted: "Nenhum quórum se forma — a rede espera em vez de bifurcar.",
    hint: "Aperte propor e veja a aceitação se propagar. Clique num nó para derrubá-lo (ou reerguê-lo).",
    ledgers: "ledgers fechados: {n}",
  },
  content: {
    "passkey-smart-wallet": passkeySmartWalletContent,
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
