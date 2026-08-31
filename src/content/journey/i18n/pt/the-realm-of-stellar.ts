import type { Concept } from "../types";

export const theRealmOfStellar: Concept = {
  meta: {
    slug: "the-realm-of-stellar",
    title: "Consenso e a rede Stellar",
    tagline: "Consenso (SCP): como milhares de máquinas concordam sem um rei.",
    numeral: "I",
    arc: "realm",
    level: 1,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-realm-of-stellar.webp",
    glyph: "🕸",
  },
  steps: [
    {
      kind: "theory",
      body: `## Acordo sem um rei

Todo blockchain responde a uma pergunta: **como estranhos concordam sobre a próxima página do livro‑razão?**

- Proof‑of‑Work responde com *eletricidade* — quem queima mais, escreve.
- Proof‑of‑Stake responde com *capital travado* — quem aposta mais, escreve.
- **Stellar responde com confiança**: cada nó nomeia os nós em que acredita, e o acordo se propaga por essas declarações. Sem mineração, sem staking — o **Stellar Consensus Protocol (SCP)**.

O resultado: os livros‑razão são fechados em ~5 segundos, as taxas custam frações de centavo, e a rede roda em máquinas que uma universidade pode pagar.`,
    },
    {
      kind: "theory",
      body: `## Fatias de quórum: "meu conselho"

Cada nó declara uma **fatia de quórum** — um pequeno conselho de nós que ele se recusa a mover sem:

> "Eu aceito um livro‑razão quando **bastante do meu conselho** o aceita."

Os conselhos se sobrepõem: os membros do seu conselho têm seus próprios conselhos, e essas cadeias de confiança unem toda a rede. Um **quórum** é um conjunto de nós que contém um conselho satisfeito *para cada membro* — assim que um quórum concorda, o livro‑razão fecha.

Nenhuma lista global. Nenhum escritório de admissões. A confiança é declarada localmente e se torna acordo global — da mesma forma que instituições humanas se federam.`,
    },
    {
      kind: "widget",
      component: "scp-sim",
      body: `## O Conselho de Nós

Sete validadores, cada um confiando em um pequeno conselho. **Proponha um livro‑razão** e observe a aceitação se propagar pelas fatias. Depois faça o que todo bom engenheiro faz a um protocolo de consenso: **clique nos nós para derrubá‑los** e veja o que os sobreviventes fazem.

Tente encontrar o ponto onde a rede *trava* — e perceba que ela trava ao invés de se dividir.`,
    },
    {
      kind: "quiz",
      question: `No SCP, quando um único nó aceita um livro‑razão?`,
      options: [
        "Quando suficiente da sua própria fatia de quórum o aceitou",
        "Quando 51 % de todos os nós da Terra o aceitaram",
        "Quando resolve primeiro um quebra‑cabeça criptográfico",
      ],
      answer: 0,
      explain: `Tudo é local: um nó avança quando seu *conselho* avança. O acordo global surge dos conselhos sobrepostos — nenhum nó jamais precisa de um censo de toda a rede.`,
    },
    {
      kind: "theory",
      body: `## Ninguém te entrega a lista

Aqui está a parte que soa como bug na primeira vez que você ouve: **não existe lista oficial de validadores.** Nenhum registro decide quem conta. Cada participante nomeia os outros de quem está disposto a depender, e é esse o processo de inscrição inteiro.

O que levanta a objeção óbvia. Se cada um escolhe o próprio conselho, o que impede a rede de rachar em dois grupos que concordam internamente e discordam entre si?

A resposta é **sobreposição**. Dois participantes só têm garantia de chegar à mesma conclusão se os círculos de confiança deles se cruzarem o bastante — e na prática cruzam, porque todo mundo acaba, de forma independente, nomeando o mesmo punhado de instituições bem operadas e publicamente responsáveis. A segurança da rede inteira é uma propriedade emergente de um monte de escolhas separadas e interessadas sobre em quem vale a pena depender.

Isso é genuinamente diferente de "o protocolo escolhe", e a diferença corta dos dois lados. Ninguém consegue se acrescentar a uma lista para ganhar influência. E ninguém consegue te entregar uma configuração boa também — **escolher mal é uma coisa que você tem permissão de fazer.** É por isso que o conselho prático para quem roda um validador é sem graça e correto: parta de uma configuração publicada e bem analisada, e entenda qualquer desvio antes de fazê-lo.`,
    },
    {
      kind: "theory",
      body: `## Segurança acima de vivacidade

Você viu isso no simulador: derrube nós demais de um conselho e a rede **espera**. Ela não adivinha. Não se divide em duas histórias.

Isso é um trade‑off deliberado, e tem um nome:

- **Segurança** — a rede nunca confirma dois livros‑razão conflitantes.
- **Vivacidade** — a rede continua confirmando *algo*.

Quando forçada a escolher, o SCP **para ao invés de bifurcar**. Para uma rede que movimenta dinheiro — salários, remessas, tesouros — um pagamento pausado vale mais que um pagamento que depois *desfaz* algo.`,
    },
    {
      kind: "diagram",
      body: "Dois jeitos de uma rede falhar — e só um deles toma seu dinheiro de volta:",
      caption: "Segurança acima de vivacidade: o SCP prefere travar a discordar de si mesmo.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "fork",
            label: "redes que bifurcam",
            tone: "bad",
          },
          {
            id: "scp",
            label: "Stellar",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "quando não há acordo",
            cells: [
              {
                text: "duas histórias seguem lado a lado",
                tone: "bad",
              },
              {
                text: "o ledger simplesmente para de fechar",
                tone: "good",
              },
            ],
          },
          {
            label: "o que você espera",
            cells: [
              {
                text: "confirmações suficientes para estar provavelmente seguro",
                tone: "bad",
              },
              {
                text: "nada — um ledger fechado é final",
                tone: "good",
              },
            ],
          },
          {
            label: "o pior caso",
            cells: [
              {
                text: "um pagamento é desfeito horas depois",
                tone: "bad",
              },
              {
                text: "um pagamento atrasa",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Um terço dos validadores na fatia de quórum do seu nó fica offline. O que seu nó faz?`,
      options: [
        "Trava — recusa confirmar livros‑razão até que sua fatia possa ser satisfeita novamente",
        "Bifurca e mantém sua própria versão da história",
        "Muda para mineração até que retornem",
      ],
      answer: 0,
      explain: `Para, não bifurca. Seu nó espera pelo seu conselho; se o resto da rede ainda contém quóruns funcionais, *eles* continuam fechando livros‑razão e seu nó se atualiza quando seu conselho volta.`,
    },
    {
      kind: "theory",
      body: `## O que isso compra para os construtores

Como o acordo é barato, a rede pode ser **rápida e de baixa taxa por padrão**:

- Os livros‑razão fecham a cada **5 segundos** — um pagamento é *final*, não "provavelmente final após 6 blocos".
- A taxa base é **100 stroops** (0,00001 XLM) — spam é caro em escala, os humanos mal percebem.
- A finalização é real: uma vez no livro‑razão, não há reorganização a temer.

Todo laboratório da Forja roda nesse ritmo — você já sentiu isso se acompanhou uma transação sendo confirmada no laboratório de carteira.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `O Ato VI da Campanha — **O Portão da Constelação** — explora esse mesmo céu na prática: frases‑senha da rede, horizontes e seus primeiros mapas estelares. Opcional, e vale o desvio quando você quer o mapa por trás da teoria.`,
    },
  ],
  testOut: [
    { question: `Como um participante decide de quem depende para concordar?`,
      options: ["Ele nomeia a própria fatia de quórum — não existe lista oficial de validadores, e a inscrição é essa nomeação","O protocolo atribui um conjunto a ele com base em stake","A SDF publica o conjunto autoritativo de validadores a cada versão do protocolo"], answer: 0 },
    { question: `Se cada um escolhe o próprio conselho, o que impede a rede de rachar?`,
      options: ["Sobreposição — a segurança se sustenta quando os círculos de confiança se cruzam o bastante, e na prática cruzam porque os participantes nomeiam de forma independente as mesmas instituições bem operadas","Uma regra de desempate que o protocolo aplica quando grupos discordam","Um número mínimo de validadores que toda fatia precisa conter"], answer: 0 },
    { question: `O SCP prefere segurança a liveness. O que isso significa quando a rede tem problema?`,
      options: ["Ela para em vez de arriscar duas histórias conflitantes — parar é recuperável, discordar sobre o passado não é","Ela continua produzindo ledgers e reconcilia qualquer fork depois","Ela elege um líder temporário para quebrar o impasse"], answer: 0 },
    { question: `O que consenso sem mineração dá a quem constrói, concretamente?`,
      options: ["Um ledger a cada poucos segundos com taxa medida em frações de centavo, e um fechamento como finalização","Mais vazão ao custo de finalização mais lenta","Transações gratuitas, já que não há mineradores a pagar"], answer: 0 },
  ],
};
