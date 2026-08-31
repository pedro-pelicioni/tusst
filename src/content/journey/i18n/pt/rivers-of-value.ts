import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "A DEX e as pools de liquidez",
  tagline: "A DEX e os pools de liquidez: uma casa de câmbio dentro do próprio protocolo.",
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
      kind: "theory",
      body: `## A mesma ordem, dois lugares

Livros e pools não são rivais com um vencedor. Eles falham em direções opostas, e o ledger carrega os dois de propósito.

Digamos que você quer 5.000 USDC em XLM.

**O livro de ofertas** te preenche contra o que as pessoas de fato postaram. Se um formador de mercado está cotando apertado, você leva um preço que ninguém bateria — ofertas reais, preços reais, sem curva. Se ninguém está olhando aquele par nesta manhã, o livro está raso ou vazio, e você preenche mal ou não preenche. A qualidade de um livro é a atenção de alguém.

**O pool** sempre cota. Ele não tem opinião, não tem horário e não tira folga — a curva precifica sua ordem esteja alguém acordado ou não. O que ele cobra por essa confiabilidade é slippage: você paga pelo privilégio de conseguir negociar às três da manhã contra ninguém.

Então o resumo honesto é sem graça: **o livro é melhor quando tem alguém cuidando dele, e o pool é melhor quando não tem.** É exatamente por isso que agregadores existem, e por que você não deveria estar escolhendo o lugar na mão.`,
    },
    { kind: "widget", component: "amm-pool",
      body: `A curva se sente melhor do que se lê. **Venda para dentro do pool** — depois mova a mesma ordem para um pool mais raso e veja o que o preço faz com você.` },
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
    { kind: "fill",
      prompt: `Complete o que um pool de produto constante de fato promete:`,
      file: "NOTES.md",
      before: `Um pool sempre vai te cotar um preço. O que ele não promete é que o preço fica parado — quanto maior a sua ordem em relação ao pool, `,
      after: ` .`,
      choices: ["pior o preço que você acaba pagando", "menor a taxa que te cobram", "mais demorada a liquidação", "mais provável a ordem ser recusada"],
      answer: 0,
      explain: `O pool não pode acabar e não pode te recusar — é esse o ponto inteiro da curva. O que ele faz no lugar é te cobrar mais por cada unidade conforme você drena um dos lados, então uma ordem grande num pool pequeno se completa perfeitamente e caro.` },
    { kind: "theory", body: `## Você nunca vai fazer isso na mão

Agora você sabe que existe um mercado dentro do ledger: livros que casam no fechamento, pools que cotam a partir de uma curva, e um preço que se move quando você se apoia nele.

E aqui está a parte que torna isso útil: **você quase nunca vai interagir com nada disso diretamente.** Você não vai colocar uma oferta, percorrer o livro nem escolher um pool. Você vai declarar o que está enviando e o que precisa chegar — e outra coisa faz as compras.

**A seguir:** a operação que gasta essa máquina inteira em seu nome, num único passo atômico.` },
  ],
  testOut: [
    { question: `Quem casa uma oferta de compra com uma de venda na DEX da Stellar?`,
      options: ["O próprio protocolo, no fechamento do ledger — ofertas são entradas do ledger e o casamento faz parte do consenso","Um contrato de motor de casamento mantido pela SDF","Relayers fora da chain que submetem pares casados por uma fatia"], answer: 0 },
    { question: `O que é preciso para criar mercado para um novo par de ativos na DEX?`,
      options: ["Duas trustlines e uma oferta — todo par ganha um livro automaticamente, sem listagem e sem permissão","Uma solicitação à SDF, que faz a curadoria dos pares negociáveis","Publicar um contrato de mercado para aquele par"], answer: 0 },
    { question: `Um livro de ofertas precisa de traders ativos cotando preços. Do que um pool de liquidez precisa no lugar?`,
      options: ["Só de depósitos — a curva de produto constante cota um preço a cada instante sem ninguém olhando","De um bot formador de mercado, que o pool paga com as taxas","De um oráculo alimentando o preço externo atual"], answer: 0 },
    { question: `Sua ordem é grande em relação ao pool. O que acontece?`,
      options: ["Ela se completa, a um preço progressivamente pior — a curva cobra mais por cada unidade conforme você drena um lado","Ela é recusada, porque o pool não consegue cobri-la","Ela entra numa fila até depositarem liquidez suficiente"], answer: 0 },
  ],
};
