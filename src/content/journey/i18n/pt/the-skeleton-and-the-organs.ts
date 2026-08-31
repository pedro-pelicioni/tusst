import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "O Esqueleto e os Órgãos",
  tagline: "Confiabilidade vem da estrutura, inteligência vem dos nós.",
  steps: [
    {
      kind: "theory",
      body: `## Orquestração vs. autonomia

Separe claramente as duas funções do grafo:

- **Arestas são determinísticas.** Código simples decide o que roda quando, o que flui onde, como um retry se parece — fluxo de controle que você pode ler, testar e reproduzir.
- **Julgamento vive dentro dos nós.** Dentro de sua caixa, o modelo aplica todo o ofício à sua única tarefa.

Misture as coisas — deixe o modelo improvisar qual passo vem a seguir — e as falhas deixam de ser reproduzíveis: cada execução vira uma nova aventura por um grafo diferente. Mantenha a estrutura entediante e as mentes contidas: **confiabilidade do esqueleto, inteligência dos órgãos.**`,
    },
    {
      kind: "quiz",
      question: `Em um grafo bem construído, onde reside o julgamento do modelo?`,
      options: [
        "Dentro dos nós — enquanto as arestas entre eles permanecem código determinístico que você pode testar e reproduzir",
        "Nas arestas — deixar o modelo improvisar qual nó roda a seguir mantém o sistema flexível",
        "Em nenhum lugar — um pipeline sério é determinístico de ponta a ponta, ou não é engenharia",
      ],
      answer: 0,
      explain: `Fluxo de controle improvisado gera falhas não reproduzíveis — você não consegue depurar um caminho que nunca acontece da mesma forma duas vezes. E um pipeline sem julgamento em nenhum ponto nem precisaria de golems. Esqueleto determinístico, órgãos julgadores: cada tipo de confiabilidade onde pertence.`,
    },
    {
      kind: "fill",
      prompt: `Complete a separação que torna um grafo depurável:`,
      file: "graph.toml",
      before: `As arestas são código `,
      after: `; o julgamento mora dentro dos nós.`,
      choices: [
        "determinístico",
        "gerado pelo modelo",
        "adaptativo",
        "automodificável",
      ],
      answer: 0,
      explain: `Toda outra resposta compra a mesma coisa: uma execução que você não consegue reproduzir. Se o caminho pelo grafo é ele mesmo uma saída de modelo, então duas execuções da mesma falha tomaram dois trajetos diferentes — e não há o que percorrer passo a passo, porque o que deu errado foi o mapa.`,
    },
    {
      kind: "theory",
      body: `## Compartimentos para raciocínio

O presente mais silencioso do grafo é **confinamento**.

Em um prompt gigante, uma única confusão na segunda etapa envenena tudo que vem depois — mesmo contexto, sem compartimentos, o erro se acumula educadamente até o fim.

Em um grafo, um nó que falha **falha sozinho**. Seu contexto é colocado em quarentena; suas próprias avaliações capturam a falha em *sua* fronteira — a bússola do último capítulo, agora publicada por nó; o orquestrador o repete ou o contorna. É isso que ferramentas de pipelines e multi‑agentes oferecem — etapas nomeadas, handoffs tipados, retries — e é a lição do raio de explosão da fortaleza novamente, um nível acima.`,
    },
    {
      kind: "diagram",
      body: "Uma confusão no passo dois, duas arquiteturas:",
      caption:
        "Mesmo erro, mesmo modelo. A única diferença é se havia alguma coisa entre o passo dois e o passo cinco.",
      view: {
        kind: "compare",
        columns: [
          { id: "mono", label: "um prompt longo", tone: "bad" },
          { id: "graph", label: "um grafo", tone: "good" },
        ],
        rows: [
          { label: "para onde vai o erro", cells: [{ text: "para o contexto que todo passo seguinte lê", tone: "bad" }, { text: "lugar nenhum — o contexto do nó é dele", tone: "good" }] },
          { label: "quem percebe", cells: [{ text: "você, no fim, pela saída", tone: "bad" }, { text: "as evals daquele nó, na fronteira dele", tone: "good" }] },
          { label: "o que custa", cells: [{ text: "todo passo depois dele, refeito", tone: "bad" }, { text: "um nó, repetido ou contornado", tone: "good" }] },
          { label: "o que dá para depurar", cells: [{ text: "uma transcrição longa", tone: "bad" }, { text: "o nó que falhou, isolado", tone: "good" }] },
        ],
      },
    },
    {
      kind: "quiz",
      question: `A tarefa: renomear uma função e seus pontos de chamada em um único arquivo. O que você usa?`,
      options: [
        "Um loop simples — ou apenas seu editor; o custo de coordenação de um grafo superaria a tarefa",
        "Um grafo — mais golems significa mais qualidade, tanto em tarefas pequenas quanto grandes",
        "Um grafo — tarefas pequenas são exatamente o lugar para praticar para as grandes",
      ],
      answer: 0,
      explain: `Cada nó tem custo de preparação: contexto a curar, arestas a definir, falhas a rotear. Em uma tarefa pequena a estrutura pesa mais que o trabalho — um conselho de guerra convocado para matar uma mosca. Tarefa simples, loop simples; o grafo só vale a pena quando a decomposição justifica.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## A prova do examinador: teça um

Uma missão que não cabe numa bancada só:

> Um contrato de token Soroban precisa de uma passada de segurança antes da mainnet. Audite as classes comuns de bug, conserte o que for achado, atualize o README para bater com o comportamento corrigido, e produza uma nota curta de migração para quem já está na versão antiga.

Projete o **grafo**. Nomeie os nós e para que serve cada um; diga quais podem rodar em paralelo e por que são genuinamente independentes; diga onde fica um verificador e qual é o objetivo dele; e nomeie um nó cuja falha não pode derrubar o resto, e o que acontece quando ele falhar.

Só projeto — sem código de orquestração, sem nomes de ferramenta ou framework.`,
      rubric: `1. Nomeia ao menos quatro nós, cada um com um propósito único declarado.
2. Identifica quais nós podem rodar em paralelo E justifica a independência — nenhum lê a saída do outro nem toca no estado do outro.
3. Coloca ao menos um nó verificador e declara o objetivo dele como refutação, não aprovação.
4. Nomeia ao menos um nó cuja falha é contida, e diz o que o orquestrador faz a respeito (repetir, contornar, parar e escalar).
5. Só projeto — sem código de orquestração, sem nomes de framework ou ferramenta, e o controle de fluxo não é deixado para um modelo improvisar.`,
      minChars: 200,
    },
    {
      kind: "theory",
      body: `## O ofício, montado

Olhe o que está no seu cinto agora: **especificações** que dizem o que é certo; **testes** que verificam isso eternamente; **fronteiras** que mantêm as palavras honestas; um **keep** que contém mudanças; um **arnês** que contém o golem; **palavras** que moldam o que ele vê; **loops** que permitem correção; e um **grafo** que entrelaça muitas mentes em um plano.

Nenhum desses carregará a IA por você. Todos eles tornam a IA valer dez vezes mais.

Próximo passo na jornada: voltar ao reino — levar o ofício à Forja e colocá-lo em prática na rede real.`,
    },
  ],
  testOut: [
    { question: `Num grafo bem construído, onde mora o julgamento do modelo?`,
      options: ["Dentro dos nós, enquanto as arestas entre eles continuam código determinístico que dá para testar e repetir","Nas arestas — deixar o modelo escolher o próximo nó mantém o sistema flexível","Em lugar nenhum; um pipeline sério é determinístico de ponta a ponta"], answer: 0 },
    { question: `O que dá errado quando o modelo decide qual passo roda em seguida?`,
      options: ["As falhas deixam de ser reproduzíveis — não dá para depurar um caminho que nunca acontece igual duas vezes","Nada, desde que cada nó ainda tenha as próprias evals","Fica mais caro, porque a decisão de roteamento é uma chamada a mais"], answer: 0 },
    { question: `Um nó falha no meio de um grafo. O que deveria acontecer?`,
      options: ["Ele falha sozinho — o contexto dele fica em quarentena, as evals dele o pegam, e o orquestrador repete ou contorna","A execução inteira aborta, já que os resultados seguintes se baseariam numa falha","O próximo nó herda a saída parcial dele e segue em frente"], answer: 0 },
    { question: `A tarefa: renomear uma função e os pontos de chamada dela num único arquivo. O que você usa?`,
      options: ["Um laço simples, ou só o seu editor — a coordenação de um grafo custaria mais que a tarefa","Um grafo, já que mais nós significa mais qualidade em qualquer tamanho","Um grafo, porque tarefas pequenas são onde se treina para as grandes"], answer: 0 },
  ],
};
