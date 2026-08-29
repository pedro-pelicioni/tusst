import type { Concept } from "../types";

export const theRealmOfStellar: Concept = {
  meta: {
    slug: "the-realm-of-stellar",
    title: "O Reino de Stellar",
    tagline: "Como milhares de máquinas concordam sem um rei.",
    numeral: "I",
    arc: "realm",
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
      body: `## Segurança acima de vivacidade

Você viu isso no simulador: derrube nós demais de um conselho e a rede **espera**. Ela não adivinha. Não se divide em duas histórias.

Isso é um trade‑off deliberado, e tem um nome:

- **Segurança** — a rede nunca confirma dois livros‑razão conflitantes.
- **Vivacidade** — a rede continua confirmando *algo*.

Quando forçada a escolher, o SCP **para ao invés de bifurcar**. Para uma rede que movimenta dinheiro — salários, remessas, tesouros — um pagamento pausado vale mais que um pagamento que depois *desfaz* algo.`,
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
};
