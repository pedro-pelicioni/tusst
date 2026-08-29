import type { Concept } from "../types";

export const riversOfValue: Concept = {
  meta: {
    slug: "rivers-of-value",
    title: "Rios de Valor",
    tagline: "Pagamentos, pagamentos encadeados, a DEX e os AMMs.",
    numeral: "IV",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/rivers-of-value.webp",
    glyph: "🌊",
  },
  steps: [
    {
      kind: "theory",
      body: `## Rios, não cofres

Você já disseccionou um simples \`payment\`: um ativo, de A para B, concluído em ~5 segundos. Isso é um canal — reto, útil, entediante.

A parte interessante é que o ledger da Stellar não é apenas um cofre de saldos. Ele contém **troca completa de moedas dentro do próprio protocolo**: livros de ofertas, pools de liquidez e operações de pagamento que *negociam enquanto viajam*.

Sem exchange externa, sem ponte, sem desvio encapsulado — a conversão é um poder nativo do ledger. Este capítulo segue a água: primeiro as ofertas, depois os pools, depois a operação que faz remessas parecerem mágica.`,
    },
    {
      kind: "theory",
      body: `## Um livro de ofertas *no* ledger

A **Stellar DEX** não é um contrato que alguém implantou — é a maquinaria do protocolo.

- \`manage_sell_offer\` / \`manage_buy_offer\` colocam uma oferta: *"Eu dou X, eu quero Y, a este preço."*
- Cada oferta é uma **entrada de ledger**, sentada no livro de ofertas como qualquer outro estado.
- **A correspondência ocorre no fechamento do ledger**: quando as ofertas se cruzam, o protocolo executa a troca como parte do consenso.

Todo par de ativos recebe um livro de ofertas automaticamente — sem listagens, sem permissão de um operador de mercado. Duas linhas de confiança e uma oferta, e você *é* o mercado.`,
    },
    {
      kind: "quiz",
      question: `Quem combina uma oferta de compra com uma oferta de venda na Stellar DEX?`,
      options: [
        "O próprio protocolo, no fechamento do ledger — ofertas são entradas de ledger e a correspondência faz parte do consenso",
        "Um contrato inteligente de motor de correspondência mantido pela SDF",
        "Relayers off-chain que enviam pares combinados por uma taxa",
      ],
      answer: 0,
      explain: `Esta é a rara cadeia onde a exchange vive *dentro* do protocolo. Nenhum matcher implantado significa que não há matcher para hackear, subornar ou fazer rug‑pull — e as negociações liquidam com a mesma finalização dos pagamentos.`,
    },
    {
      kind: "theory",
      body: `## Pools: a água parada

Livros de ofertas precisam de traders ativos cotando preços. **Pools de liquidez** precisam apenas de depósitos:

- Qualquer pessoa deposita um par de ativos em um **pool de produto constante** — a mesma curva x · y = k que a Uniswap popularizou.
- Negócios empurram a razão; arbitragem a traz de volta; depositantes ganham uma pequena taxa em cada swap.
- Na Stellar esses pools são **entradas nativas do ledger** — não contratos — gerenciados com \`liquidity_pool_deposit\` e \`liquidity_pool_withdraw\`.

Livros e pools coexistem em pé de igualdade e — como você verá em breve — um único pagamento pode beber de ambos.`,
    },
    {
      kind: "quiz",
      question: `Como os pools de liquidez nativos da Stellar diferem dos AMMs estilo Uniswap?`,
      options: [
        "São recursos do protocolo — entradas de ledger gerenciadas por operações, não contratos implantados",
        "Usam correspondência de livro de ofertas internamente ao invés de uma curva de preço",
        "Só suportam pares que incluam XLM",
      ],
      answer: 0,
      explain: `Mesma matemática de produto constante, mas lar diferente: o pool vive no próprio protocolo, qualquer par de ativos é bem‑vindo. AMMs baseados em contrato também existem, uma camada acima — você conhecerá seus nomes em breve.`,
    },
    {
      kind: "theory",
      body: `## Pagamentos encadeados: a funcionalidade matadora

\`path_payment_strict_send\` faz algo que quase nenhuma outra cadeia faz nativamente: **enviar um ativo e entregar outro** — atomicamente, em uma única operação.

Você envia USDC. A rede o encaminha por livros de ofertas e pools de liquidez — talvez USDC → XLM → EURC — e sua avó recebe EURC. Uma transação. Se nenhum caminho puder entregar dentro dos seus limites, **nada acontece**: nenhum fundo fica preso no meio do swap.

Dois sabores:

- **Strict send** — fixa o que você paga; o destino recebe o que o caminho gera (acima do seu mínimo).
- **Strict receive** — fixa o que eles recebem; você paga o que for necessário (abaixo do seu máximo).`,
    },
    {
      kind: "quiz",
      question: `Uma fatura é exatamente 900 EURC e seu tesouro possui USDC. Qual operação se encaixa?`,
      options: [
        "path_payment_strict_receive — fixa os 900 EURC entregues, limita o USDC que você gastará",
        "path_payment_strict_send — envia cerca de 900 USDC e espera que a taxa fique quase equilibrada",
        "Duas transações: troca USDC por EURC na DEX, depois um pagamento simples",
      ],
      answer: 0,
      explain: `Strict receive existe exatamente para casos em que “a conta está fixa”. E uma operação atômica supera swap‑então‑envio: sem deriva de preço entre etapas, sem poeira residual, sem estado parcialmente concluído para limpar.`,
    },
    {
      kind: "fill",
      prompt: `Desenhe o rio — o que acontece entre o envio e a entrega em um pagamento encadeado?`,
      file: "remittance.txt",
      before: `envia 100 USDC  →  `,
      after: `  →  entrega EURC — uma transação atômica`,
      choices: [
        "roteia por livros de ofertas e pools de liquidez",
        "faz ponte por tokens encapsulados em outra cadeia",
        "fila na mesa de FX de um anchor para conversão",
        "leilão o pagamento para bots market‑maker",
      ],
      answer: 0,
      explain: `O roteamento é on‑ledger e atômico: o protocolo percorre ofertas e pools para encontrar a entrega, e ou todo o caminho executa no fechamento do ledger ou nenhum deles ocorre.`,
    },
    {
      kind: "theory",
      body: `## Por que construtores de remessa vêm aqui

Os trilhos antigos: uma transferência transfronteiriça salta entre bancos correspondentes por **2–5 dias** e perde alguns por cento em taxas ao longo do caminho.

O rio: dólares se tornam USDC em uma ponta, um **pagamento encadeado** converte e entrega EURC em cerca de **cinco segundos** por uma taxa medida em frações de centavo, e euros saem pela outra ponta.

A conversão FX — historicamente o caro e opaco meio‑termo — torna‑se um salto transparente através de livros de ofertas e pools públicos. Liquidação cross‑currency em segundos é o caso de uso que a Stellar mirou desde o primeiro dia.`,
    },
    {
      kind: "theory",
      body: `## A camada acima do rio

 Sobre a maquinaria nativa, o ecossistema constrói em Soroban: **Soroswap**, **Phoenix** e **Aquarius** rodam protocolos AMM como contratos inteligentes, e agregadores roteiam cada trade entre livros nativos, pools nativos e pools de contrato buscando o melhor preço. Você ainda não precisa dos detalhes internos — basta saber que o rio tem tanto um leito sólido quanto um porto movimentado construído em cima.

Uma pergunta ainda fica aberta: onde os *verdadeiros* dólares e euros entram e saem? Essa é a tarefa dos anchors — os portões do reino, e o próximo capítulo.`,
    },
  ],
};
