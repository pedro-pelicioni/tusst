import type { Concept } from "../types";

export const gatesOfTheRealm: Concept = {
  meta: {
    slug: "gates-of-the-realm",
    title: "Portões do Reino",
    tagline: "Âncoras & SEPs — onde o ledger encontra o mundo real.",
    numeral: "V",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/gates-of-the-realm.webp",
    glyph: "⛩️",
  },
  steps: [
    {
      kind: "theory",
      body: `## Âncoras: os portões

Os rios do capítulo anterior movimentam ativos *ledger*. Mas seu salário está em um banco. A ponte é uma **âncora**: um negócio regulado que **emite ativos lastreados em fiat** e opera as **rampas de entrada/saída**.

Você entrega dólares a uma âncora e ela paga tokens equivalentes da sua conta emissora — a mesma mecânica que você aprendeu dois capítulos atrás: emissor, linhas de confiança, flags de autorização para conformidade. Ao resgatar os tokens, ela envia os dólares de volta.

Todo ativo fiat sério no Stellar está por trás de um portão como este. As âncoras são onde o ledger toca o chão.`,
    },
    {
      kind: "theory",
      body: `## SEPs: a língua comum

Existem muitas carteiras e muitas âncoras. Sem padrões, cada par precisaria de uma integração customizada — encanamento N×M, para sempre.

A resposta do Stellar é o **SEP**: *Stellar Ecosystem Proposal*. SEPs são padrões públicos que definem exatamente como carteiras, âncoras e serviços se comunicam. Você implementa um SEP uma vez e sua carteira funciona com **toda âncora** que o implemente também — fluxos de depósito, autenticação, identidade, tudo.

Essa cultura de interoperabilidade‑primeiro é um dos superpoderes silenciosos do Stellar: os usuários escolhem qualquer porta, e todas as portas compartilham a mesma forma de chave.`,
    },
    {
      kind: "theory",
      body: `## SEP-1 e SEP-10: identidade e prova

Dois padrões pequenos carregam todo o portão:

- **SEP-1** — todo domínio sério publica um \`stellar.toml\`: seu **cartão de identidade on‑chain**. Quais ativos emite, quais contas são oficiais, onde seus serviços vivem. Carteiras leem isso para distinguir o emissor real de um impostor com o mesmo código de ativo.
- **SEP-10** — **web auth**: a âncora envia uma *transação de desafio*, você a assina com a chave da sua conta e a devolve. Propriedade comprovada, sessão concedida — e o desafio **nunca é submetido** ao ledger.

Login com assinatura: sem senha, sem e‑mail.`,
    },
    {
      kind: "quiz",
      question: `O que exatamente o web auth SEP-10 prova a uma âncora?`,
      options: [
        "Que você controla a chave secreta da conta — assinando uma transação de desafio que nunca toca o ledger",
        "Sua identidade legal — o SEP-10 realiza a verificação KYC por si só",
        "Que sua conta possui XLM suficiente para pagar as taxas da âncora",
      ],
      answer: 0,
      explain: `SEP-10 é pura comprovação de propriedade da chave. Identidade legal é um padrão separado (SEP-12) que as âncoras utilizam *após* a autenticação — assinatura primeiro, documentação depois.`,
    },
    {
      kind: "theory",
      body: `## Os portões em funcionamento: 24, 31, 41

- **SEP-24** — depósito e saque *interativo*. Sua carteira abre a webview hospedada pela âncora; a âncora cuida dos formulários KYC e dos dados bancários; os tokens chegam quando a transferência bancária é concluída. A rampa cotidiana para pessoas.
- **SEP-31** — pagamentos transfronteiriços entre *empresas*: uma âncora remetente e uma âncora receptora liquidam via Stellar enquanto cada uma gerencia seus trilhos locais.
- **SEP-41** — um velho amigo: a **interface de token** padrão para contratos Soroban, aquela que todo Stellar Asset Contract fala.

Ramps para pessoas, trilhos para instituições, um dialeto de token para contratos.`,
    },
    {
      kind: "fill",
      prompt: `Onde uma carteira encontra o cartão de identidade de um domínio?`,
      file: "discovery.txt",
      before: `https://anchor.example/`,
      after: `  →  ativos, contas oficiais e endpoints de serviço`,
      choices: [
        ".well-known/stellar.toml",
        "api/v2/anchor-manifest.json",
        "stellar/config.xml",
        "identity.pdf",
      ],
      answer: 0,
      explain: `SEP-1, o padrão mais simples de todos: um arquivo TOML em um caminho bem‑conhecido. Prove que você possui o domínio, liste suas contas emissoras no arquivo, e as carteiras podem exibir “emitido por anchor.example” como fato, não como sensação.`,
    },
    {
      kind: "theory",
      body: `## Uma remessa, portão a portão

Observe Ana, em Chicago, pagando sua mãe em Lisboa:

1. A carteira de Ana lê o \`stellar.toml\` da âncora dos EUA (SEP-1), autentica (SEP-10) e abre um depósito (SEP-24). Seus dólares se tornam USDC no ledger.
2. Um **pagamento de caminho** cruza o rio: USDC sai, EURC chega — em segundos, taxa sub‑centavo.
3. A carteira da mãe retira através de uma âncora europeia (SEP-24 novamente). Euros chegam na conta bancária dela.

Dois portões regulados, um cruzamento atômico no meio. A cadeia nunca viu um “dólar” — apenas ativos que os portões prometem honrar.`,
    },
    {
      kind: "quiz",
      question: `Nessa remessa portão a portão, qual parte realizou a conversão de moeda?`,
      options: [
        "O pagamento de caminho — roteando USDC para EURC através de livros de ordens e pools on‑ledger",
        "A mesa de FX interna da âncora remetente, fora do ledger",
        "Um contrato ponte que bloqueou USDC e cunhou EURC",
      ],
      answer: 0,
      explain: `Os portões apenas traduzem entre dinheiro bancário e ativos no ledger. A FX em si ocorre em trânsito, nos mercados públicos, a um preço que qualquer um pode verificar — algo que os trilhos de remessa legados não podem oferecer.`,
    },
    {
      kind: "theory",
      body: `## Portões de prática: testanchor

Você não precisa de licença bancária para programar contra tudo isso. O SDF roda **testanchor** na testnet — uma âncora totalmente funcional que fala SEP-1, SEP-10 e SEP-24 com dinheiro de brincadeira. Aponte seu código de carteira para ela e ensaie todo o fluxo de depósito e saque antes de envolver um único dólar real.

Portões, rios, confiança — tudo até agora tem sido o *clássico* reino, mecânica embutida no protocolo. No próximo capítulo cruzaremos para a parte que você programa: **Soroban**, onde contratos ganham vida e até o armazenamento tem um batimento cardíaco.`,
    },
  ],
};
