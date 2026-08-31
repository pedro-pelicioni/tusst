import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Portões do Reino",
  tagline: "Anchors — onde o ledger encosta no chão.",
  steps: [
    {
      kind: "theory",
      body: `## Âncoras: os portões

Os rios do capítulo anterior movimentam ativos *ledger*. Mas seu salário está em um banco. A ponte é uma **âncora**: um negócio regulado que **emite ativos lastreados em fiat** e opera as **rampas de entrada/saída**.

Você entrega dólares a uma âncora e ela paga tokens equivalentes da sua conta emissora — a mesma mecânica que você aprendeu dois capítulos atrás: emissor, linhas de confiança, flags de autorização para conformidade. Ao resgatar os tokens, ela envia os dólares de volta.

Todo ativo fiat sério no Stellar está por trás de um portão como este. As âncoras são onde o ledger toca o chão.`,
    },
    { kind: "theory", body: `## O que "lastreado" está de fato prometendo

O token que um anchor emite não é dólar. É um **direito contra uma empresa** — e o edifício inteiro se apoia nessa empresa honrar o direito.

O que significa que as perguntas interessantes sobre qualquer ativo fiat não são técnicas:

- **Quem é o emissor, juridicamente?** Uma entidade regulada numa jurisdição, ou uma conta anônima?
- **Onde está o dinheiro?** Custódia segregada, ou a mesma conta de onde saem os salários?
- **Quem consegue provar?** Um laudo que dá para ler, ou uma promessa numa landing page?
- **O que acontece se pararem?** Um caminho de resgate que sobrevive à empresa, ou um token que vira souvenir em silêncio?

O ledger é honesto sobre exatamente uma coisa aqui: ele te diz, com precisão e para sempre, *qual conta emitiu este ativo*. Tudo depois disso é diligência — e é por isso que um código de ativo sozinho não significa nada, e \`USDC\` do emissor errado é outro ativo que por acaso divide o nome.` },
    { kind: "quiz",
      question: `Uma carteira mostra saldo de \`USDC\`. O que o código do ativo sozinho te diz?`,
      options: [
        "Quase nada — um ativo é um código *mais o emissor dele*, e qualquer um pode emitir um código escrito USDC",
        "Que é a stablecoin de dólar conhecida, já que códigos de ativo são únicos no ledger",
        "Que alguma entidade regulada atestou o lastro",
      ],
      answer: 0,
      explain: `Esta é a leitura errada mais cara do ecossistema, e o protocolo não tem culpa: códigos de ativo nunca foram únicos e nunca foram feitos para ser. O endereço do emissor é a identidade; o código é um rótulo. Uma carteira que te mostra um sem o outro está te mostrando um boato.` },
    { kind: "fill",
      prompt: `Complete o que um ativo de fato é:`,
      file: "NOTES.md",
      before: `Um ativo na Stellar é um código de ativo mais `,
      after: ` — e dois ativos que dividem só o código são dois ativos diferentes.`,
      choices: ["o endereço do emissor dele", "a quantidade em circulação", "o domínio do anchor", "um registro na lista de ativos da SDF"],
      answer: 0,
      explain: `O domínio chega perto e é genuinamente útil — é assim que um emissor publica quem é — mas é uma alegação em cima. A identidade que o próprio protocolo garante é a conta emissora, e é a única parte que ninguém consegue forjar.` },
    { kind: "labLink", labSlug: "oz-token-wizard",
      body: `Um anchor é uma empresa embrulhada em torno de um único ato técnico: **emitir um token**. Você consegue executar esse ato. O **Assistente de Token OZ** da Forja forja um token de verdade na testnet, com você de emissor — e o que ele não te dá é tudo aquilo que faz de um anchor um anchor: a licença, a custódia, as auditorias e a promessa de resgatar.` },
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
      kind: "diagram",
      body: "Dinheiro de banco entra, dinheiro de banco sai — o ledger só segura o meio:",
      caption: "As duas portas nunca se encontram. Cada uma só precisa confiar no ledger entre elas.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "in",
            label: "a porta de saída",
            note: "Uma âncora recebe dinheiro de verdade e emite um token lastreado nele.",
            tone: "gold",
          },
          {
            id: "ledger",
            label: "o ledger",
            note: "Cinco segundos, uma fração de centavo, e nenhum banco correspondente à vista.",
            tone: "accent",
          },
          {
            id: "out",
            label: "a porta de chegada",
            note: "Outra âncora queima o token e paga em moeda local.",
            tone: "gold",
          },
          {
            id: "done",
            label: "dinheiro na mão",
            note: "Quem recebeu nunca instalou carteira, e nunca ouviu a palavra ledger.",
            tone: "good",
          },
        ],
      },
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
    { kind: "theory", body: `## As siglas por que você passou batido

Você as viu na remessa da Ana e provavelmente deixou passar: SEP-1, SEP-10, SEP-24. Três padrões fazendo três trabalhos — *quem é este anchor*, *prove que é você*, e *execute o depósito*.

Elas não eram acessórias. Sem elas, a carteira da Ana precisaria de uma integração sob medida com o anchor dela, a carteira da mãe precisaria de outra com o dela, e toda carteira nova começaria esse trabalho do zero. Dois portões só cooperaram porque já tinham combinado como falar.

**A seguir:** o combinado em si — os padrões que deixam qualquer carteira chegar em qualquer portão.` },
  ],
  testOut: [
    { question: `O que é um anchor?`,
      options: ["Uma empresa regulada que emite ativos lastreados em fiat e opera as rampas de entrada e saída entre dinheiro de banco e o ledger","Um recurso do protocolo que converte fiat em ativos do ledger automaticamente","Um validador especializado em tráfego de pagamentos"], answer: 0 },
    { question: `Uma carteira mostra \`USDC\`. O que o código do ativo sozinho estabelece?`,
      options: ["Quase nada — um ativo é um código mais o emissor, e qualquer conta pode emitir esse código","Que é a stablecoin de dólar conhecida; códigos são únicos","Que alguém atestou o lastro"], answer: 0 },
    { question: `Numa remessa de portão a portão, qual peça faz a conversão de moeda?`,
      options: ["O path payment, roteando por livros e pools do ledger a um preço que qualquer um verifica","A mesa de câmbio interna do anchor emissor, fora do ledger","Um contrato de ponte que trava um ativo e emite o outro"], answer: 0 },
    { question: `Por que dá para construir uma integração completa com anchor sem licença bancária?`,
      options: ["A SDF roda o testanchor na testnet — um anchor funcional com dinheiro de brincadeira para ensaiar a dança inteira","Anchors publicam credenciais de produção para uso em desenvolvimento","Não dá; integração com anchor exige um contrato assinado antes"], answer: 0 },
  ],
};
