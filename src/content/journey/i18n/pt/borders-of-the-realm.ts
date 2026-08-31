import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Bounded contexts",
  tagline: "DDD e contextos delimitados: uma palavra, três sentidos, e as fronteiras que tornam isso seguro.",
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
      kind: "fill",
      prompt: `Complete a regra que faz de uma fronteira uma fronteira:`,
      file: "NOTES.md",
      before: `Dentro de um contexto uma palavra tem exatamente um sentido. Na fronteira, esse sentido pode `,
      after: ` .`,
      choices: ["mudar", "continuar o mesmo", "virar opcional", "ser herdado pelo próximo contexto"],
      answer: 0,
      explain: `Se o sentido não pudesse mudar, você não precisaria de fronteira — precisaria de um modelo único compartilhado, que é justamente o que as fronteiras existem para evitar. Uma fronteira é exatamente o lugar onde "Conta" pode significar outra coisa, de propósito, com uma tradução na passagem.`,
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
      body: `## A fronteira que se dissolve em silêncio

Fronteiras raramente caem de uma vez. Elas se erodem, e sempre pelo mesmo movimento educado: *"esses dois contextos compartilham só um pouquinho."*

Começa com um tipo. Pagamentos e Compliance precisam os dois de um endereço, então importam um \`Account\` compartilhado — só o identificador, mais nada. Aí Compliance precisa do status nele. Aí Pagamentos precisa de um campo de Compliance para um recibo. Seis meses depois o tipo compartilhado tem catorze campos, metade sem sentido em qualquer um dos contextos, e nenhum dos lados consegue mudá-lo sem uma reunião.

O sinal não é o tamanho da coisa compartilhada. É **quem precisa ser consultado para mudá-la**. Uma fronteira que você não atravessa sem tradução é uma fronteira. Uma fronteira que você atravessa importando é enfeite.

A ponte que continua saudável é aquela em que cada lado mantém o próprio modelo e algo no meio converte — que é exatamente o que um anchor faz, e exatamente o que um tipo compartilhado não faz.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## A prova do examinador: desenhe as fronteiras

Aqui está um sistema, descrito do jeito que um fundador descreveria:

> Um app de remessas. Usuários se cadastram e passam por verificação de identidade. Carregam um saldo por transferência bancária, mandam dinheiro para destinatários em outro país, e o destinatário saca num parceiro local. O suporte pode congelar uma conta e ver a trilha de auditoria completa.

Nomeie os **contextos delimitados** que você desenharia e, para cada um: as palavras cujo sentido muda naquela fronteira, e como os contextos conversam entre si. Só modelagem — sem schemas, sem serviços, sem nomes de framework.`,
      rubric: `1. Nomeia ao menos três contextos delimitados plausíveis, com uma linha de responsabilidade cada.
2. Identifica ao menos uma palavra que significa coisas genuinamente diferentes em dois desses contextos, e diz o que significa em cada um.
3. Descreve como ao menos um par de contextos se comunica — uma tradução na borda, não um modelo compartilhado.
4. Não resolve as diferenças propondo um modelo único para todo mundo.
5. Só modelagem — sem schema de banco, sem nomes de serviço ou framework, sem código.`,
      minChars: 180,
    },
    {
      kind: "theory",
      body: `## Por que o modelo precisa do seu mapa

Uma LLM leu um milhão de bases de código onde "conta", "transferência" e "saldo" significavam coisas diferentes. Deixe suas fronteiras não ditas e ela vai **misturar vocabulários no meio do arquivo** — uma regra de KYC vazando para o seu modelo de pagamentos, a ideia de Conta de uma exchange contaminando a da sua carteira — cada linha localmente plausível.

Então escreva a fronteira na bancada: *"Estamos no contexto de Pagamentos. Conta significa detentor de saldo. Compliance é um modelo separado — referencie só pelo endereço."* Um contexto declarado é uma cerca que o modelo respeita.

**A seguir:** você desenhou as linhas. O que de fato mora dentro de uma delas — e quais coisas só podem mudar juntas.`,
    },
  ],
  testOut: [
    { question: `Três times definem "Conta" de formas diferentes. Como o DDD chama o lugar onde o sentido pode mudar?`,
      options: ["Um contexto delimitado — a fronteira é o projeto, não uma falha dele","Uma colisão de nomes, a ser resolvida renomeando um deles","Dívida técnica, a ser paga unificando o modelo"], answer: 0 },
    { question: `Compliance pede para acrescentar \`kyc_status\` à Conta do contexto de Pagamentos. Qual é a leitura DDD?`,
      options: ["Manter modelos separados atrás de fronteiras separadas, ligados pelo endereço — cada contexto modela só o que precisa","Fundir os dois, já que duplicação é o mal maior","Acrescentar os campos como opcionais para Pagamentos ignorar"], answer: 0 },
    { question: `O que é um anchor da Stellar, no vocabulário deste capítulo?`,
      options: ["Um mapa de contextos virado negócio — ele traduz entre o contexto bancário e o contexto do ledger","Um modelo compartilhado que bancos e ledger concordam em adotar","Uma camada de compliance que fica acima dos dois contextos e os governa"], answer: 0 },
    { question: `Por que uma fronteira não declarada machuca mais quando é uma IA escrevendo o código?`,
      options: ["Ela leu um milhão de bases onde essas palavras significavam outras coisas, e vai misturar os vocabulários no meio do arquivo","Ela não consegue ler termos de domínio e precisa de nomes técnicos","Ela se recusa a seguir enquanto todo termo não for formalmente definido"], answer: 0 },
  ],
};
