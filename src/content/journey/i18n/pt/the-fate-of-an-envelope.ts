import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "O ciclo de vida de uma transação",
  tagline: "Sequência, taxas e o ciclo de vida da transação: enviada, incluída, falhou, cobrada.",
  steps: [
    {
      kind: "theory",
      body: `## O contador que impede repetições

Cada conta tem um número de sequência. Uma transação precisa declarar \`atual + 1\`, e o ledger o incrementa ao incluí-la — então uma transação assinada **nunca pode ser repetida** (o número dela já foi gasto), e duas transações da mesma conta **não podem disputar** o mesmo lugar.

Essa última tem uma consequência prática. Se o seu backend assina duas transações da mesma conta no mesmo instante, ambas reivindicam \`atual + 1\` — e exatamente uma vence. A outra volta com \`tx_bad_seq\`, que *não* significa "malformada"; significa *alguém moveu seu contador antes — reconstrua e assine de novo*.

A correção de sempre não é um laço de retentativa. É uma **conta-canal**: uma conta separada que fornece números de sequência, para que trabalhos em paralelo nunca briguem por um contador só.`,
    },
    {
      kind: "quiz",
      question: `Dois servidores assinam um pagamento da mesma conta no mesmo segundo. Os dois são submetidos. O que acontece?`,
      options: [
        "Um é incluído; o outro é recusado com tx_bad_seq e precisa ser reconstruído",
        "Os dois são incluídos — o ledger os ordena automaticamente",
        "Os dois são recusados, porque a conta fica travada enquanto há transação pendente",
      ],
      answer: 0,
      explain: `O contador é o juiz. Nada fica "travado" e nada entra numa fila para você — o segundo envelope nomeia um número de sequência que já não é o próximo, e é barrado. Reconstruir é a correção; uma conta-canal é a cura.`,
    },
    {
      kind: "fill",
      prompt: `Coloque o ciclo de vida em ordem — o que acontece entre construir e submeter?`,
      file: "lifecycle.txt",
      before: `construir o envelope  →  `,
      after: `  →  submeter  →  fechamento do ledger`,
      choices: ["assiná-lo", "minerá-lo", "notariá-lo", "apostá-lo"],
      answer: 0,
      explain: `Construa, **assine**, submeta, feche — cerca de cinco segundos de ponta a ponta. Não há mineração nem espera por várias confirmações: um fechamento de ledger já é a finalização.`,
    },
    {
      kind: "diagram",
      body: "Os cinco segundos, etapa por etapa:",
      caption:
        "A assinatura acontece na sua máquina, offline. Sua chave secreta nunca viaja — só o envelope pronto.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "build",
            label: "construir",
            note: "Monte origem, sequência, taxa e operações. Nada saiu da sua máquina ainda.",
            tone: "neutral",
          },
          {
            id: "sign",
            label: "assinar",
            note: "Cada signatário exigido sela o envelope localmente. As chaves secretas ficam onde estão.",
            tone: "accent",
          },
          {
            id: "submit",
            label: "submeter",
            note: "Enviado a um endpoint RPC ou Horizon, que o repassa aos validadores.",
            tone: "teal",
          },
          {
            id: "validate",
            label: "validar",
            note: "Assinaturas, sequência e taxa são conferidas. Falhe aqui e ele nunca chega ao ledger.",
            tone: "gold",
          },
          {
            id: "close",
            label: "fechamento do ledger",
            note: "~5 segundos. Um fechamento é a finalização — não há segunda confirmação para esperar.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## O erro que todo mundo comete uma vez

"Minha transação falhou, então nada aconteceu e não me custou nada."

Metade disso costuma estar errada, porque **duas coisas bem diferentes são chamadas de "falha"**:

- **Barrada na porta.** Assinatura ruim, sequência errada, taxa baixa demais. O envelope nunca entra. Nada é cobrado, nada é registrado, seu contador não se move.
- **Falhou dentro do ledger.** O envelope era válido, então *foi* incluído — e aí uma operação não funcionou. Os **efeitos** são todos revertidos, mas a transação é escrita na história como falha, **a taxa é consumida e o número de sequência é gasto.**`,
    },
    {
      kind: "diagram",
      body: "Duas palavras que soam as duas como falha:",
      caption:
        "A diferença é se o envelope chegou a ser válido. Válido-mas-condenado custa caro do mesmo jeito.",
      view: {
        kind: "compare",
        columns: [
          { id: "rejected", label: "barrada na porta", tone: "neutral" },
          { id: "failed", label: "falhou no ledger", tone: "bad" },
        ],
        rows: [
          {
            label: "código típico",
            cells: [
              { text: "tx_bad_seq, tx_bad_auth", tone: "neutral" },
              { text: "op_underfunded, op_no_trust", tone: "bad" },
            ],
          },
          {
            label: "escrita na história",
            cells: [
              { text: "não", tone: "good" },
              { text: "sim, marcada como falha", tone: "bad" },
            ],
          },
          {
            label: "taxa cobrada",
            cells: [
              { text: "não", tone: "good" },
              { text: "sim", tone: "bad" },
            ],
          },
          {
            label: "número de sequência",
            cells: [
              { text: "intacto", tone: "good" },
              { text: "gasto — precisa reconstruir", tone: "bad" },
            ],
          },
        ],
      },
    },
    {
      kind: "fill",
      prompt: `Complete a regra que pega quase todo mundo uma vez:`,
      file: "NOTES.md",
      before: `Uma transação válida o bastante para ser incluída, mas cuja operação falhou, é escrita no ledger como falha — e a taxa dela `,
      after: ` .`,
      choices: [
        "é cobrada mesmo assim",
        "é devolvida automaticamente",
        "nunca é cobrada",
        "só é cobrada na retentativa",
      ],
      answer: 0,
      explain: `Ser incluída é o que custa, não dar certo. A consequência prática: um laço de retentativa que trata todo erro igual vai alegremente reenviar um envelope que já queimou o próprio número de sequência. Leia o código antes de tentar de novo.`,
    },
    {
      kind: "theory",
      body: `## Taxas: um limitador de vazão, não uma fonte de receita

A taxa base é de **100 stroops por operação** — 0,00001 XLM, um arredondamento para um humano, dinheiro de verdade para um milhão de envelopes-lixo. Essa assimetria *é* o projeto.

- **Você oferece um máximo, você paga o mínimo.** A taxa que você define é um teto. Quando há espaço no ledger você paga a taxa base por mais alto que tenha ofertado; só quando a demanda passa da capacidade é que o preço de pico preenche o ledger por oferta.
- **Outra pessoa pode pagar.** Uma **transação fee-bump** embrulha um envelope já assinado e coloca outra conta na conta a pagar, sem invalidar nenhuma assinatura existente. É assim que um app patrocina um usuário que não tem XLM nenhum.`,
    },
    {
      kind: "quiz",
      question: `Por que a rede cobra uma taxa (100 stroops = 0,00001 XLM) por operação?`,
      options: [
        "Para tornar spam caro em escala enquanto permanece invisível para humanos",
        "Para pagar salários aos validadores — é o modelo de negócio deles",
        "Para subsidiar o Friendbot",
      ],
      answer: 0,
      explain: `Taxas no Stellar são um limitador de vazão, não uma fonte de receita — validadores não recebem recompensa de bloco nem renda de taxas. Ninguém roda um validador pela receita, e isso é boa parte do motivo de a taxa poder continuar tão pequena.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `No Ato VII da Campanha, o mesmo envelope carrega \`invoke_host_function\` — e o payload da operação é **o seu próprio Rust**. Tudo daqui continua valendo para ele: mesmo contador, mesmo ciclo de vida, mesma distinção entre barrada e falha.`,
    },
  ],
  testOut: [
    {
      question: `O que o número de sequência impede?`,
      options: [
        "Uma transação assinada ser repetida, e duas transações disputarem o mesmo lugar",
        "A taxa ser cobrada duas vezes numa retentativa",
        "Uma conta guardar mais de um ativo ao mesmo tempo",
      ],
      answer: 0,
    },
    {
      question: `Sua transação volta recusada com tx_bad_seq. O que isso te custou?`,
      options: [
        "Nada — ela nunca entrou no ledger, então nenhuma taxa e nenhum contador se moveu",
        "A taxa, porque a rede ainda precisou conferi-la",
        "A taxa e o número de sequência, igual a qualquer outra falha",
      ],
      answer: 0,
    },
    {
      question: `Uma transação é incluída, mas o pagamento dela acaba sem fundos. O que foi gasto?`,
      options: [
        "A taxa e o número de sequência, mesmo sem nada ter se movido",
        "Nada — efeitos revertidos significam transação revertida",
        "Só o número de sequência; taxas são devolvidas em caso de falha",
      ],
      answer: 0,
    },
    {
      question: `Um app quer trazer um usuário que não tem XLM nenhum. O que torna isso possível?`,
      options: [
        "Uma transação fee-bump, que coloca outra conta na conta a pagar sem tocar nas assinaturas existentes",
        "Zerar a taxa para contas novas",
        "O Friendbot, que paga taxas na mainnet para usuários de primeira viagem",
      ],
      answer: 0,
    },
  ],
};
