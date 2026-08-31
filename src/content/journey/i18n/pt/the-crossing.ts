import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "A Travessia",
  tagline: "Envie uma moeda, entregue outra — atomicamente, numa operação.",
  steps: [
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
      kind: "diagram",
      body: "Um pagamento, três moedas, uma transação atômica:",
      caption: "Se qualquer salto não fechar no preço que você definiu, nada acontece — nenhum dinheiro meio convertido preso no meio do caminho.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "send",
            label: "você envia BRL",
            note: "Você nunca toca nas moedas do meio, e nunca as segura.",
            tone: "accent",
          },
          {
            id: "hop1",
            label: "BRL → XLM",
            note: "O livro de ofertas fecha este salto pelo que o mercado oferecer agora.",
            tone: "teal",
          },
          {
            id: "hop2",
            label: "XLM → EURC",
            note: "E o próximo, no mesmo instante, dentro da mesma transação.",
            tone: "teal",
          },
          {
            id: "recv",
            label: "ele recebe EURC",
            note: "Valor garantido, ou tudo reverte. Não existe chegada parcial.",
            tone: "good",
          },
        ],
      },
    },
    { kind: "widget", component: "path-payment",
      body: `**Envie um pagamento atravessando moedas** e veja qual rota o protocolo escolhe conforme o valor cresce — depois exija mais do que qualquer uma consegue entregar, e veja a coisa toda simplesmente não acontecer.` },
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
      body: `## O limite é o projeto inteiro

Tudo acima depende de um número que você fornece: o mínimo que você aceita, ou o máximo que você gasta. Os dois jeitos de errar são silenciosos.

**Apertado demais** e seus pagamentos simplesmente param de acontecer. Não com alarde — um path payment que não consegue satisfazer o limite reverte, o que parece idêntico a um pagamento que ninguém enviou. Em algum lugar uma fila enche de transferências que "não passaram", e a causa é uma tolerância que alguém definiu uma vez e nunca revisitou.

**Frouxo demais** e você assinou um cheque em branco para o que quer que a rota custe no instante em que o seu envelope cair. O protocolo vai honrar um preço péssimo com a mesma fidelidade que um bom; o limite era a única coisa que dizia não.

O hábito que funciona não é esperto, é disciplinado: **cote primeiro, depois defina o limite a partir daquela cotação mais uma tolerância que você escolheu de propósito.** Um limite copiado de um exemplo, ou deixado num número redondo porque parecia razoável, é um número de que ninguém é responsável — e é ele que decide se os seus usuários recebem.`,
    },
    { kind: "theory", body: `## A propriedade que torna isso usável

Cada parte disso podia dar errado. A rota podia estar rasa, o preço podia se mover entre o instante em que você assinou e o instante em que executou, um salto podia não preencher.

E a resposta para tudo isso é a mesma, e é ela que faz do path payment algo sobre o qual dá para montar um negócio: **ou o caminho inteiro executa no fechamento do ledger, ou nenhuma parte dele executa.**

Não existe estado em que seus BRL saíram, viraram XLM e pararam. Sem saldo meio convertido parado numa moeda que ninguém pediu. Sem ticket de suporte que começa com *"o dinheiro está em algum lugar no meio."*

Isso não é um mimo. É a diferença entre um trilho de pagamento e um experimento científico — e é por isso que o limite que você define não é uma preferência, é o contrato: *entregue ao menos isto, ou não toque nos meus fundos.*` },
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
  testOut: [
    { question: `O que \`path_payment_strict_send\` faz que um pagamento simples não faz?`,
      options: ["Enviar um ativo e entregar outro, roteando por livros e pools dentro de uma única operação atômica","Enviar para vários destinos de uma vez","Agendar um pagamento para executar num ledger futuro"], answer: 0 },
    { question: `Uma fatura é de exatos 900 EURC e sua tesouraria tem USDC. Qual operação serve?`,
      options: ["path_payment_strict_receive — fixe os 900 EURC entregues, limite o USDC que você vai gastar","path_payment_strict_send — mande mais ou menos 900 USDC e torça para a taxa cair perto","Duas transações: trocar na DEX, depois um pagamento simples"], answer: 0 },
    { question: `Nenhuma rota consegue entregar dentro do limite que você definiu. O que acontece com seus fundos?`,
      options: ["Absolutamente nada — o caminho inteiro executa ou nenhuma parte executa, então não há saldo meio convertido em lugar nenhum","Eles convertem até onde a rota chegou, e o resto volta no próximo ledger","Ficam retidos pelo protocolo até abrir uma rota"], answer: 0 },
    { question: `Por que uma aplicação não deve fixar na mão qual rota um pagamento toma?`,
      options: ["A melhor rota depende do valor — o livro mais raso frequentemente cota a melhor taxa e desaba com o tamanho","Rotas são privadas e não podem ser inspecionadas antes do envio","O protocolo cobra mais por uma rota que você mesmo especificou"], answer: 0 },
  ],
};
