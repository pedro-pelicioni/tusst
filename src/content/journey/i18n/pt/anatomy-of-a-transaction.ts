import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Anatomia de uma Transação",
  tagline: "Uma única forma carrega tudo que altera o ledger.",
  steps: [
    {
      kind: "theory",
      body: `## O envelope

Tudo que altera o ledger Stellar viaja dentro de uma única forma — um **envelope de transação**:

- **Conta de origem** — quem está agindo (e pagando a taxa).
- **Número de sequência** — o contador de transações desta conta.
- **Taxa** — o valor que você oferece para ser incluído.
- **Operações** — os verbos de verdade (de 1 a 100 deles).
- **Assinaturas** — prova de que a origem (e quem mais for necessário) concordou.

Não existe uma segunda forma. Um pagamento, a emissão de um token, a chamada de um contrato inteligente, uma negociação na DEX — todos são este envelope com verbos diferentes dentro. Aprenda-o uma vez e cada página de Explorer e cada chamada de SDK no Stellar ficam legíveis no mesmo instante.`,
    },
    {
      kind: "diagram",
      body: "O envelope, aberto:",
      caption:
        "A assinatura cobre o envelope inteiro. Mude um byte lá dentro e todas as assinaturas param de bater.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "source",
            label: "conta de origem",
            note: "Quem paga a taxa, e de quem o número de sequência avança.",
            tone: "neutral",
          },
          {
            id: "fee",
            label: "taxa",
            note: "100 stroops por operação — um centésimo de milésimo de XLM cada.",
            tone: "gold",
          },
          {
            id: "seq",
            label: "número de sequência",
            note: "Usado exatamente uma vez, para sempre. É isso que torna um replay impossível.",
            tone: "accent",
          },
          {
            id: "ops",
            label: "operações",
            note: "Até 100, aplicadas em ordem. Todas entram, ou nenhuma entra.",
            tone: "teal",
            bands: [
              {
                id: "op1",
                label: "pagamento",
                note: "Move um ativo de uma conta para outra.",
                tone: "teal",
              },
              {
                id: "op2",
                label: "abrir trustline",
                note: "Abre a linha de confiança que deixa o destino guardar o ativo.",
                tone: "teal",
              },
            ],
          },
          {
            id: "sigs",
            label: "assinaturas",
            note: "Uma por signatário exigido. Qualquer um confere contra o endereço de origem — ninguém falsifica.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Operações: os verbos

Uma **operação** é um verbo atômico. São cerca de 26 delas, em umas poucas famílias:

- **Mover valor** — \`payment\`, \`path_payment_strict_send\`, \`create_account\`.
- **Guardar valor** — \`change_trust\`, \`set_trust_line_flags\`, \`clawback\`.
- **Negociar** — \`manage_sell_offer\`, \`liquidity_pool_deposit\`.
- **Governar a conta** — \`set_options\`, \`manage_data\`, \`account_merge\`.
- **Chamar código** — \`invoke_host_function\`, a que alcança um contrato inteligente.

Um detalhe que quase todo mundo leva meses para notar: **cada operação pode nomear a própria conta de origem**, diferente da do envelope. É esse campo sozinho que torna a página seguinte possível.`,
    },
    {
      kind: "quiz",
      question: `Seu envelope contém três operações: um pagamento, uma linha de confiança e um segundo pagamento que acaba ficando sem fundos. O que é gravado no ledger?`,
      options: [
        "Nada — uma operação falha invalida toda a transação",
        "As duas primeiras operações — falha a partir da terceira",
        "Todas as três — falhas são registradas como avisos",
      ],
      answer: 0,
      explain: `A atomicidade é o ponto: uma transação é tudo-ou-nada, por isso configurações em várias etapas (criar + financiar + confiar) são seguras de agrupar.`,
    },
    {
      kind: "theory",
      body: `## Um envelope, três verbos, dois signatários

Ana quer trazer o Bruno para a Stellar e entregar a ele 50 USDC. Veja tudo caber num único envelope:

- **Origem:** Ana. O número de sequência dela avança; ela paga a taxa.
- **Op 1 —** \`create_account\`, destino Bruno, saldo inicial de **2 XLM**.
- **Op 2 —** \`change_trust\` para USDC, **origem: Bruno**. Uma trustline pertence a quem a guarda, então esta operação é do Bruno, não da Ana.
- **Op 3 —** \`payment\`, 50 USDC para o Bruno.

**Taxa:** 3 operações × 100 stroops = **300 stroops**, ou 0,00003 XLM.

E os 2 XLM do Bruno? Uma conta custa 2 reservas-base, uma trustline custa mais 1, a 0,5 XLM cada: **1,5 XLM travados**, 0,5 XLM livres. Reservas não são taxa — voltam para ele se um dia fechar a trustline.`,
    },
    {
      kind: "quiz",
      question: `Nesse envelope, por que o Bruno precisa assinar, se ele só está recebendo?`,
      options: [
        "Porque a op 2 abre a trustline *dele*, e uma operação é autorizada pela própria conta de origem",
        "Porque toda conta citada em qualquer lugar da transação precisa assiná-la",
        "Porque o pagamento é maior que o saldo inicial dele",
      ],
      answer: 0,
      explain: `Receber nunca exige a sua assinatura — mas abrir a trustline que permite receber, sim. Envie esse envelope sem a assinatura do Bruno e a rede responde \`tx_bad_auth\`: nada acontece, nem mesmo a op 1.`,
    },
    {
      kind: "fill",
      prompt: `Complete a regra que torna o agrupamento seguro:`,
      file: "NOTES.md",
      before: `Um envelope, até 100 operações, aplicadas em ordem — e se qualquer uma delas falhar, `,
      after: ` .`,
      choices: [
        "nenhuma tem efeito",
        "as demais ainda têm efeito",
        "a que falhou é pulada",
        "a rede tenta de novo automaticamente",
      ],
      answer: 0,
      explain: `Tudo ou nada. É por isso que "criar a conta *e* abrir a trustline *e* financiá-la" é um envelope só, e não três passos esperançosos — não existe estado em que o Bruno exista mas não consiga guardar o que você mandou.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Esse envelope não é hipotético. O laboratório **Sua Primeira Carteira** da Forja executa \`create_account\`, \`change_trust\` e \`payment\` com a sua própria assinatura na testnet real — os mesmos três verbos, com o hash da sua transação no fim.`,
    },
    {
      kind: "theory",
      body: `## O que você já sabe ler

Origem, sequência, taxa, operações, assinaturas. Você consegue olhar qualquer transação em qualquer Explorer da Stellar e nomear cada parte dela, e sabe por que uma configuração de várias etapas é segura de agrupar.

**A seguir:** você já monta um envelope válido — mas o que acontece depois que você aperta enviar é uma história à parte. Por que uma transação é barrada na porta enquanto outra é escrita na história como falha *e ainda é cobrada por isso* é o próximo capítulo.`,
    },
  ],
  testOut: [
    {
      question: `Quantas formas diferentes podem carregar uma alteração no ledger da Stellar?`,
      options: [
        "Uma — um pagamento, uma negociação e uma chamada de contrato são o mesmo envelope com verbos diferentes",
        "Três — uma para pagamentos, uma para negociações, uma para contratos",
        "Uma por tipo de operação, cerca de 26 delas",
      ],
      answer: 0,
    },
    {
      question: `Uma operação dentro do seu envelope nomeia uma conta de origem diferente da do envelope. O que decorre disso?`,
      options: [
        "Essa conta também precisa assinar o envelope",
        "A operação é aplicada em nome da origem do envelope mesmo assim",
        "O envelope é recusado — operações precisam compartilhar a origem do envelope",
      ],
      answer: 0,
    },
    {
      question: `Um envelope carrega quatro operações e a terceira falha. O que é gravado no ledger?`,
      options: [
        "Nenhuma das quatro tem efeito",
        "As duas primeiras — o envelope para onde quebrou",
        "As quatro, com a terceira marcada como aviso",
      ],
      answer: 0,
    },
    {
      question: `A taxa acompanha o quê?`,
      options: [
        "O número de operações no envelope",
        "O valor que está sendo movimentado",
        "Há quanto tempo o envelope espera para ser incluído",
      ],
      answer: 0,
    },
  ],
};
