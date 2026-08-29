import type { Concept } from "../types";

// Chapter III — the transaction, dissected. Hands off into the Forge's
// wallet-onboarding lab so the anatomy is something the learner has
// actually signed, not just read about.

export const anatomyOfATransaction: Concept = {
  meta: {
    slug: "anatomy-of-a-transaction",
    title: "Anatomia de uma Transação",
    tagline: "Envelope, operações, taxas, assinaturas — dissecados ao vivo.",
    numeral: "II",
    arc: "realm",
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/anatomy-of-a-transaction.webp",
    glyph: "✉️",
  },
  steps: [
    {
      kind: "theory",
      body: `## O envelope

Tudo que altera o ledger Stellar viaja dentro de uma única forma — um **envelope de transação**:

- **Conta de origem** — quem está agindo (e pagando a taxa).
- **Número de sequência** — o contador de transações desta conta.
- **Taxa** — o valor que você oferece para ser incluído.
- **Operações** — os verbos reais (de 1 a 100 deles).
- **Assinaturas** — prova de que a origem (e quem mais for necessário) concordou.

Aprenda essa única forma e cada página do Explorer, chamada de SDK e erro de transação falha no Stellar se tornarão legíveis.`,
    },
    {
      kind: "theory",
      body: `## Operações: os verbos

Uma **operação** é um verbo atômico: \`payment\`, \`create_account\`, \`change_trust\`, \`manage_sell_offer\`, \`invoke_host_function\` (a que chama contratos inteligentes)… são cerca de 26 delas.

Um único envelope pode carregar **várias operações**, e elas são aplicadas **atomicamente**: criar uma conta *e* financiá‑la *e* abrir sua linha de confiança em um único passo — ou nada acontece.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Você já viu esses verbos na prática — ou está prestes a ver. O laboratório **Sua Primeira Carteira** da Forja executa \`create_account\`, \`change_trust\` e \`payment\` com sua própria assinatura na testnet real. A teoria faz mais sentido com os hashes das suas próprias transações.`,
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
      explain: `A atomicidade é o ponto: uma transação é tudo‑ou‑nada, por isso configurações em múltiplas etapas (criar + financiar + confiar) são seguras para serem agrupadas.`,
    },
    {
      kind: "theory",
      body: `## Números de sequência: sem repetições, sem corridas

Cada conta possui um contador. Uma transação deve indicar \`current + 1\`, e o ledger o incrementa ao ser incluída — assim:

- uma transação assinada **nunca pode ser reproduzida** (seu número já foi usado),
- duas transações da mesma conta **não podem competir** pelo mesmo slot.

Aquele erro "tx_bad_seq" que todo desenvolvedor Stellar encontra? Significa apenas que *alguém já avançou seu contador — reconstrua e re‑assine.*`,
    },
    {
      kind: "fill",
      prompt: `Coloque o ciclo de vida em ordem — o que acontece entre construir e submeter?`,
      file: "lifecycle.txt",
      before: `construir o envelope  →  `,
      after: `  →  submeter  →  fechamento do ledger`,
      choices: ["assiná‑lo", "minerá‑lo", "notariá‑lo", "apostará‑lo"],
      answer: 0,
      explain: `Construa, **assine**, submeta, feche — cerca de cinco segundos de ponta a ponta. Não há mineração, nem esperas por múltiplas confirmações: um fechamento de ledger já é a finalização.`,
    },
    {
      kind: "quiz",
      question: `Por que a rede cobra uma taxa (100 stroops = 0.00001 XLM) por operação?`,
      options: [
        "Para tornar spam caro em escala enquanto permanece invisível para humanos",
        "Para pagar salários aos validadores — é o modelo de negócio deles",
        "Para subsidiar o Friendbot",
      ],
      answer: 0,
      explain: `Taxas no Stellar são um limitador de taxa, não uma fonte de receita — as taxas coletadas são recicladas pelo protocolo. Um milhão de transações lixo custariam dinheiro real; seu pagamento custa apenas um arredondamento insignificante.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `No Ato VII da Campanha, o mesmo envelope carrega \`invoke_host_function\` — e o payload da operação é **seu próprio Rust**. Quando estiver pronto para forjar os próprios verbos, a porta está aqui.`,
    },
  ],
};
