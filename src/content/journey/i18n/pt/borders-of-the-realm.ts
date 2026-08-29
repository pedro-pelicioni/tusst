import type { Concept } from "../types";

// Chapter III (craft) — Domain-Driven Design with Stellar's own domain as the
// running example: "Account" means three things in three contexts, the
// transaction envelope is a textbook aggregate, and anchors are context
// mapping with a business model. Ends on why AI needs your borders stated.

export const bordersOfTheRealm: Concept = {
  meta: {
    slug: "borders-of-the-realm",
    title: "Fronteiras do Reino",
    tagline: "DDD e contextos delimitados, mapeados no próprio Stellar.",
    numeral: "III",
    arc: "craft",
    level: 2,
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/borders-of-the-realm.webp",
    glyph: "🗺",
  },
  steps: [
    {
      kind: "theory",
      body: `## Uma palavra, três significados

Pergunte a três equipes no Stellar o que é uma **Account**:

- Uma equipe *wallet*: "um detentor de saldo — alguém que possui lumens e ativos."
- Uma equipe *anchor*: "um sujeito KYC — alguém que precisamos identificar antes de mover dinheiro."
- Uma equipe *exchange*: "um participante do livro de ofertas — alguém com ofertas abertas."

Mesma palavra. Mesmo endereço G, até. **Três modelos diferentes.** A maioria dos “bugs de comunicação” são exatamente isso: duas pessoas usando uma palavra para dois conceitos, cada uma certa de que a outra concorda.

Domain-Driven Design começa aqui: tornar a linguagem precisa *de propósito*.`,
    },
    {
      kind: "theory",
      body: `## Linguagem ubíqua, contextos delimitados

Dentro de uma equipe e de uma parte do sistema, DDD exige uma **linguagem ubíqua**: uma palavra, um significado, usado *em todo lugar* — conversa, especificação e código. Se a spec diz "release", a função é \`release\`, não \`transfer_out\`.

Mas nenhuma linguagem governa todo o reino. Um **contexto delimitado** é a fronteira onde o significado de uma palavra pode mudar: dentro de *Payments*, uma Account é um detentor de saldo; ao cruzar para *Compliance*, o mesmo endereço é um sujeito KYC.

A fronteira não é uma falha de design. **A fronteira é o design.**`,
    },
    {
      kind: "diagram",
      body: "A mesma palavra, três fronteiras:",
      caption: "As linhas tracejadas são traduções, não código compartilhado. Um contexto que importa o modelo do outro não tem fronteira nenhuma.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "pay",
            label: "PAGAMENTOS",
            x: 22,
            y: 20,
            tone: "accent",
            shape: "box",
            note: "Aqui uma \"conta\" é uma origem, um número de sequência e um orçamento de taxa.",
          },
          {
            id: "trade",
            label: "NEGOCIAÇÃO",
            x: 78,
            y: 20,
            tone: "teal",
            shape: "box",
            note: "Aqui ela é um conjunto de ofertas abertas e os ativos em que estão denominadas.",
          },
          {
            id: "custody",
            label: "CUSTÓDIA",
            x: 50,
            y: 50,
            tone: "gold",
            shape: "box",
            note: "E aqui é um conjunto de signatários com limiares. Mesma palavra, três sentidos.",
          },
        ],
        edges: [
          {
            from: "pay",
            to: "trade",
            style: "dashed",
          },
          {
            from: "pay",
            to: "custody",
            style: "dashed",
          },
          {
            from: "trade",
            to: "custody",
            style: "dashed",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `A equipe de Compliance pede para adicionar \`kyc_status\` e \`risk_score\` ao modelo de Account do contexto Payments — "é a mesma conta, afinal". Qual a leitura DDD?`,
      options: [
        "Manter modelos separados atrás de fronteiras distintas, ligados pelo endereço da conta — cada contexto modela apenas o que precisa",
        "Mesclar tudo — um modelo de Account compartilhado para todo o sistema evita duplicação, que é o maior mal",
        "Adicionar os campos mas marcá‑los como opcionais, para que o código de Payments simplesmente os ignore",
      ],
      answer: 0,
      explain: `Um modelo compartilhado cresce os campos e regras de todos os contextos até que nenhum contexto possa mudar sem quebrar outro. Dois modelos enxutos que compartilham um ID não são duplicação — são duas verdades sobre um mesmo endereço, cada uma onde é compreendida.`,
    },
    {
      kind: "theory",
      body: `## Entidades e objetos de valor

Dois tipos de coisa vivem dentro de qualquer contexto:

- Uma **entidade** tem identidade que sobrevive a mudanças. Uma **Account** Stellar é a mesma conta após mil pagamentos — seu endereço é sua identidade; seus saldos são apenas estado.
- Um **objeto de valor** *é* seu valor. Um **Asset** Stellar é um código mais um emissor: dois \`USDC\` do mesmo emissor são intercambiáveis — indistinguíveis, na verdade. Trocar o emissor não edita o ativo; você passa a segurar um *ativo diferente*.

Entidades são rastreadas. Valores são comparados. Confundir os dois gera bugs fantasma.`,
    },
    {
      kind: "quiz",
      question: `Qual destes é um **objeto de valor** no domínio Stellar?`,
      options: [
        "Um ativo — código + emissor; dois com campos iguais são a mesma coisa, sem identidade própria",
        "Uma conta — mantém sua identidade enquanto seus saldos mudam por baixo",
        "Um validador — permanece o mesmo nó entre reinicializações e mudanças de IP",
      ],
      answer: 0,
      explain: `As outras duas respostas descrevem coisas reais — mas são *entidades*: identidade que sobrevive a mudanças. O ativo é puro valor: a igualdade é campo a campo, e "qual é o original?" nem faz sentido.`,
    },
    {
      kind: "theory",
      body: `## Agregados: a regra do envelope

Alguns objetos só fazem sentido **juntos**, guardados por uma raiz que impõe as regras. Esse conjunto é um **agregado**.

O Stellar lhe dá um espécime perfeito: o **transaction envelope**. Operações vivem *dentro* de uma transação — assinadas juntas, sequenciadas juntas, e **todas têm sucesso ou falham juntas**. Você não pode retirar a operação #3 e aplicá‑la isoladamente; o envelope é a única porta, contendo assinaturas e número de sequência.

Esse é o padrão de agregado em produção: a consistência é imposta *na fronteira*, de modo que nada interno pode ficar meio‑aplicado.`,
    },
    {
      kind: "quiz",
      question: `Uma transação Stellar assinada contém cinco operações, e a terceira é a única que importa. Essa operação pode ser aplicada ao ledger sozinha?`,
      options: [
        "Não — operações só são aplicadas através do envelope, e a transação inteira tem sucesso ou falha como um todo",
        "Sim — cada operação tem sua própria assinatura, então cada uma pode ficar independente",
        "Sim — desde que você pague uma taxa separada por essa única operação",
      ],
      answer: 0,
      explain: `O envelope é a raiz do agregado: assinaturas e número de sequência estão vinculados à transação, nunca por operação. Isso é exatamente o que torna swaps atômicos de múltiplas operações seguros — não existe um mundo onde só metade de uma operação seja aplicada.`,
    },
    {
      kind: "fill",
      prompt: `Complete a lei do agregado:`,
      file: "NOTES.md",
      before: `Ops em um envelope `,
      after: ` — a transação é a unidade de consistência.`,
      choices: ["juntas", "independentemente", "por ordem de taxa", "por peso de assinatura"],
      answer: 0,
      explain: `Atomicidade é a promessa completa do agregado. Ordem de taxa e peso de assinatura são conceitos reais do Stellar — mas eles decidem *quando e se* um envelope se aplica, nunca *quais partes* dele se aplicam.`,
    },
    {
      kind: "theory",
      body: `## Pontes entre contextos: o anchor

Contextos ainda precisam conversar. **Mapeamento de contexto** é nomear as fronteiras e construir pontes deliberadas — tradução na borda, para que nenhuma linguagem de um lado vaze para o outro.

Os **anchors** do Stellar são esse padrão com um modelo de negócio. De um lado: o *contexto bancário* — IBANs, dias úteis, retenções de compliance. Do outro: o *contexto de ledger* — trustlines, assets, finalidade de 5 segundos. O anchor **traduza**: um wire de entrada vira tokens emitidos; um token resgatado vira pagamento bancário.

Nenhum dos mundos precisou adotar o modelo do outro. Essa é uma fronteira saudável: cruzada por tradução, nunca por vazamento.`,
    },
    {
      kind: "theory",
      body: `## Por que o golem precisa do seu mapa

Um LLM leu milhões de bases de código onde "account", "transfer" e "balance" significam coisas diferentes. Deixe suas fronteiras sem declarar e ele **misturará vocabulários no meio do arquivo** — uma regra KYC invadindo seu modelo de pagamentos, a ideia de Account de exchange sombreando sua wallet — cada linha parece plausível localmente.

Então escreva a fronteira no banco: *"Estamos no contexto Payments. Account significa detentor de saldo. Compliance é um modelo separado — referencie-o apenas pelo endereço."* Um contexto declarado é uma cerca que o golem respeita.

Próxima disciplina: dentro de um contexto, onde cada peça *vive*? Entre na fortaleza.`,
    },
  ],
};
