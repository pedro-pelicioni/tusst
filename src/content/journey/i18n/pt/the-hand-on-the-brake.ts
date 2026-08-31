import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "A Mão no Freio",
  tagline: "Laços agênticos e freios: sem regra de parada não é autonomia, é uma fatura.",
  steps: [
    {
      kind: "theory",
      body: `## Todo laço precisa de freio

Um laço sem vigilância não converge — ele **gasta**. Um laço sem parada é uma conta a pagar, e de vez em quando uma queda. Instale os freios *antes* do primeiro giro:

- **Critérios de sucesso** — as verificações que significam *pronto*, decididas de antemão.
- **Orçamento** — tokens, minutos, reais: o que acabar primeiro.
- **Máximo de iterações** — um teto rígido, sempre.
- **Detecção de não-progresso** — o mesmo erro duas vezes significa *mude a estratégia ou escale*, nunca "de novo, mas com mais força".

A regra do reino: nunca comece um laço sem ter decidido como pará-lo.`,
    },
    {
      kind: "widget",
      component: "loop-brake",
      body: `Dois interruptores, quatro rodadas. **Gire o laço** com os freios ligados e o feedback honesto, depois tire uma coisa de cada vez e veja qual remoção passa impune.`,
    },
    {
      kind: "theory",
      body: `## O que custa quando nada o para

A fatura é a parte visível, e é a menor.

Um laço sem freio que passou a noite em cima de um teste mentiroso não te devolve nada. Ele te devolve uma branch: quarenta commits, a maioria editando código que nunca esteve quebrado, cada um plausível sozinho, todos feitos para satisfazer um vermelho que nunca foi real. As evals continuam sem ficar verdes — então nada naquela branch te diz onde o trabalho de verdade parou e a superstição começou.

O caminho mais barato agora é jogar a noite inteira fora e recomeçar com a instabilidade corrigida. Que é exatamente o que o freio de não-progresso teria te dito na iteração quatro, pelo preço de quatro iterações.

É esse o formato da coisa: **o freio não te economiza dinheiro nas rodadas boas. Ele te economiza a arqueologia nas ruins.**`,
    },
    {
      kind: "quiz",
      question: `Iteração 40, e o laço vem batendo na mesma eval com a mesma mensagem de erro desde a iteração 12. O que o arreio deveria fazer?`,
      options: [
        "Parar e escalar para um humano — repetir sem progresso é condição de parada, não persistência",
        "Continuar — iterar é todo o ponto de um laço, e a tentativa 41 pode ser a boa",
        "Aumentar a temperatura do modelo para ele ficar mais criativo no conserto",
      ],
      answer: 0,
      explain: `Vinte e oito falhas idênticas são um recado: falta ao laço alguma coisa — contexto, uma permissão, uma spec correta — que mais iterações não fornecem. Aleatorizar mais forte compra erro espalhado pelo mesmo preço. Detecte não-progresso, pare e entregue o rastro a um humano.`,
    },
    {
      kind: "fill",
      prompt: `Instale o freio antes de o laço girar:`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: ["budget.max_iterations", "usize::MAX", "evals.len()", "iterations + 1"],
      answer: 0,
      explain: `usize::MAX é "sem freio — a gente discute na fatura". Um limite que anda junto com o contador (iterations + 1) nunca prende. E evals.len() confunde quantas verificações existem com por quanto tempo insistir. O teto é um orçamento que você escolheu de propósito.`,
    },
    {
      kind: "theory",
      body: `## Feedback instável envenena o laço

Um teste que falha aleatoriamente — tempo, ordem, uma porta compartilhada — é um aborrecimento para humanos. A gente suspira e roda de novo. Para um laço é **veneno**, porque o laço *age sobre todo sinal*.

Chega um vermelho fantasma → o golem "conserta" código que nunca esteve quebrado → a mudança entra → na iteração seguinte, um novo fantasma → outro conserto. O laço agora está aprendendo superstições, cada uma se compondo sobre a anterior, todas vindas de ruído.

A regra: **torne o feedback determinístico antes de ligá-lo a um laço.** Uma prova instável é pior que prova nenhuma — o silêncio não engana ninguém; o ruído engana sem cansar.`,
    },
    {
      kind: "quiz",
      question: `Um teste falha aleatoriamente uma vez a cada cinco execuções, por questão de tempo. Para um humano é um incômodo. O que é para um laço?`,
      options: [
        "Veneno — o laço trata cada falha fantasma como verdade e 'conserta' código saudável, compondo erro a cada passada",
        "O mesmo incômodo — ao longo de muitas iterações a aleatoriedade se compensa",
        "Levemente útil — falhas extras pressionam o código a ficar mais robusto",
      ],
      answer: 0,
      explain: `Nada se compensa, porque cada sinal falso dispara uma mudança real de código sobre a qual a próxima iteração então constrói. Humanos descontam ruído; laços obedientemente agem sobre ele. Determinismo não é um luxo do arreio — é pré-condição para haver laço.`,
    },
    {
      kind: "diagram",
      body: "A mesma tarefa, rodada duas vezes:",
      caption:
        "No dia bom os freios são invisíveis. É exatamente por isso que eles ficam de fora.",
      view: {
        kind: "compare",
        columns: [
          { id: "braked", label: "com freios", tone: "good" },
          { id: "loose", label: "sem", tone: "bad" },
        ],
        rows: [
          { label: "feedback honesto", cells: [{ text: "converge; os freios nunca disparam", tone: "good" }, { text: "converge; desfecho idêntico", tone: "neutral" }] },
          { label: "feedback mente", cells: [{ text: "para em três turnos, escala", tone: "good" }, { text: "corre até o teto que não existe", tone: "bad" }] },
          { label: "o que você paga", cells: [{ text: "um valor limitado e conhecido", tone: "good" }, { text: "o que der, descoberto depois", tone: "bad" }] },
          { label: "dano ao código", cells: [{ text: "pego cedo, poucos consertos fantasma", tone: "good" }, { text: "edições em código que nunca esteve quebrado", tone: "bad" }] },
        ],
      },
    },
    {
      kind: "theory",
      body: `## A altitude certa

Onde fica o humano enquanto o laço gira? Não dentro dele — revisar cada tecla significa que *você* é o laço, em ritmo de golem. E nem acima das nuvens, carimbando o que quer que caia.

A altitude certa é a **fronteira**: revise o *diff* contra a *spec*. As evals passaram? A mudança respeita as regras do Capítulo I? Alguma coisa se mexeu sem ter o que fazer ali? Confie nos instrumentos do laço para o miúdo; guarde o julgamento humano para o que os instrumentos não veem.

**A seguir:** quando um laço não basta — muitos golens pequenos, um plano tecido.`,
    },
  ],
  testOut: [
    { question: `Um laço vem falhando na mesma eval com o mesmo erro há vinte e oito iterações. O que o arreio te deve?`,
      options: ["Uma parada e uma escalada — repetir sem progresso é condição de parada, não persistência","Mais iterações, já que a próxima tentativa é tão provável quanto qualquer outra","Uma temperatura mais alta, para o modelo variar a abordagem"], answer: 0 },
    { question: `Por que um teste instável é pior para um laço do que para um humano?`,
      options: ["O laço age sobre todo sinal, então um vermelho fantasma vira edição real em código saudável","O laço roda a suíte com mais frequência, então esbarra na instabilidade mais vezes","É o mesmo problema; laços só o revelam mais cedo"], answer: 0 },
    { question: `Numa rodada em que o feedback é honesto, o que os freios mudam?`,
      options: ["Nada — e é exatamente por isso que ficam de fora, e por isso que isso é um erro","Cortam pela metade o número de iterações necessárias","Melhoram a qualidade final ao forçar convergência mais cedo"], answer: 0 },
    { question: `Onde o humano deve ficar enquanto um laço roda?`,
      options: ["Na fronteira — revisando o diff contra a spec, nem cada tecla nem nada","Dentro do laço, conferindo cada ação antes de ela acontecer","Totalmente fora dele; um laço supervisionado não é autônomo"], answer: 0 },
  ],
};
