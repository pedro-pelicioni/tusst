import type { Concept } from "../types";

export const weavingTheGraph: Concept = {
  meta: {
    slug: "weaving-the-graph",
    title: "Tecendo o Grafo",
    tagline: "Engenharia de grafos: muitos pequenos golems, um plano entrelaçado.",
    numeral: "VIII",
    arc: "craft",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/weaving-the-graph.webp",
    glyph: "🕸️",
  },
  steps: [
    {
      kind: "theory",
      body: `## Quando um loop não basta

Algumas missões transbordam uma única mente: *auditar este contrato, corrigir o que encontrar, atualizar a documentação, preparar a migração.* Juntar tudo em um único contexto dilui a qualidade a cada passo — o último capítulo explicou o porquê.

O movimento é antigo: **decompor**. Construa um **grafo** de etapas:

- **Nós** — tarefas pequenas e focadas, cada uma com seu *próprio banco curado*.
- **Arestas** — o que flui entre eles: uma especificação, um diff, um relatório.

Você já fez isso ao programar a vida inteira — funções pequenas, responsabilidades únicas, entradas e saídas explícitas. Agora faça o mesmo com o trabalho em si.`,
    },
    {
      kind: "theory",
      body: `## Fan out, fan in

Independência é a palavra favorita do escalonador.

**Fan-out**: três SDKs candidatos para avaliar? Três nós, em paralelo — cada um em seu próprio banco, sem precisar dos outros, sem vazamento de contexto entre eles.

**Fan-in**: um nó de *síntese* recebe os três relatórios, pesa contra seus critérios e recomenda.

A disciplina está em identificar a *verdadeira* independência: trabalho paralelo não deve compartilhar **nenhum estado** — nós competindo para editar o mesmo arquivo não são um grafo, são uma briga. É pensar em dependências, o tipo que você já aplica a pipelines de dados, agora aplicado às mentes.`,
    },
    {
      kind: "quiz",
      question: `Qual conjunto de subtarefas pode ser distribuído em paralelo com segurança?`,
      options: [
        "Avaliar três bibliotecas candidatas contra a mesma checklist — trabalho independente, sem estado compartilhado",
        "Escrever um script de migração e executar esse mesmo script — sobrepor salva tempo",
        "Três golems editando o mesmo módulo ao mesmo tempo, para terminá‑lo três vezes mais rápido",
      ],
      answer: 0,
      explain: `Executar antes de escrever viola uma dependência, e editar o mesmo arquivo gera conflitos de merge e passos extras. O teste é simples e confiável: se o nó A não lê a saída do nó B nem toca no estado do nó B, eles podem rodar juntos.`,
    },
    {
      kind: "theory",
      body: `## O forjador e o refutador

O capítulo do arnês avisou: auto‑revisão compartilha os pontos cegos do eu. Um grafo corrige isso *estruturalmente*.

Adicione um **nó verificador**: um golem forja; um nó *diferente* — contexto novo, sem vínculo às escolhas já feitas — recebe a tarefa de **refutar**: encontrar onde o diff viola a especificação, caçar casos de borda, tentar quebrá‑lo.

A descrição do trabalho importa. "Revise isto" convida a um aceno de aprovação. *"Encontre o que está errado aqui"* direciona a mente para os buracos. Pares adversariais capturam o que a auto‑revisão não pode estruturalmente — por isso forjas reais emparelham um criador com um inspetor.`,
    },
    {
      kind: "fill",
      prompt: `Dê ao segundo golem sua verdadeira tarefa:`,
      file: "graph.toml",
      before: `verifier.goal = "`,
      after: ` o diff do nó forjador"`,
      choices: ["refutar", "aprovar", "resumir", "reescrever"],
      answer: 0,
      explain: `Um verificador instruído a aprovar encontrará um jeito de aprovar. "Summarize" produz prosa, não escrutínio; "rewrite" cria um segundo forjador com seus próprios pontos cegos. Refutar é o único objetivo que direciona o nó aos buracos.`,
    },
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
      kind: "theory",
      body: `## Compartimentos para raciocínio

O presente mais silencioso do grafo é **confinamento**.

Em um prompt gigante, uma única confusão na segunda etapa envenena tudo que vem depois — mesmo contexto, sem compartimentos, o erro se acumula educadamente até o fim.

Em um grafo, um nó que falha **falha sozinho**. Seu contexto é colocado em quarentena; suas próprias avaliações capturam a falha em *sua* fronteira — a bússola do último capítulo, agora publicada por nó; o orquestrador o repete ou o contorna. É isso que ferramentas de pipelines e multi‑agentes oferecem — etapas nomeadas, handoffs tipados, retries — e é a lição do raio de explosão da fortaleza novamente, um nível acima.`,
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
      kind: "theory",
      body: `## O ofício, montado

Olhe o que está no seu cinto agora: **especificações** que dizem o que é certo; **testes** que verificam isso eternamente; **fronteiras** que mantêm as palavras honestas; um **keep** que contém mudanças; um **arnês** que contém o golem; **palavras** que moldam o que ele vê; **loops** que permitem correção; e um **grafo** que entrelaça muitas mentes em um plano.

Nenhum desses carregará a IA por você. Todos eles tornam a IA valer dez vezes mais.

Próximo passo na jornada: voltar ao reino — levar o ofício à Forja e colocá-lo em prática na rede real.`,
    },
  ],
};
