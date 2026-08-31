import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Graph engineering",
  tagline: "Graph engineering: muitos modelos pequenos, cada um na própria bancada, um plano tecido.",
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
      kind: "diagram",
      body: "Um plano, três trabalhadores, um veredito:",
      caption: "Cada trabalhador começa limpo. Esse isolamento é o ponto — um passo ruim em um nunca envenena os outros.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "plan",
            label: "PLANO",
            x: 50,
            y: 12,
            tone: "accent",
            shape: "box",
            note: "Divide o trabalho em pedaços que não precisam conversar entre si.",
          },
          {
            id: "a",
            label: "A",
            x: 18,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Contexto próprio, orçamento próprio. Ele nunca vê os erros do B.",
          },
          {
            id: "b",
            label: "B",
            x: 50,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Roda ao mesmo tempo, com o mesmo briefing, em outro pedaço.",
          },
          {
            id: "c",
            label: "C",
            x: 82,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Três tentativas baratas valem mais que uma cara que você não consegue conferir.",
          },
          {
            id: "judge",
            label: "JUIZ",
            x: 50,
            y: 56,
            tone: "gold",
            shape: "box",
            note: "Lê as três e decide. É daqui que a qualidade realmente vem.",
          },
        ],
        edges: [
          {
            from: "plan",
            to: "a",
            style: "solid",
          },
          {
            from: "plan",
            to: "b",
            style: "solid",
          },
          {
            from: "plan",
            to: "c",
            style: "solid",
          },
          {
            from: "a",
            to: "judge",
            style: "dashed",
          },
          {
            from: "b",
            to: "judge",
            style: "dashed",
          },
          {
            from: "c",
            to: "judge",
            style: "dashed",
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "fan-out",
      body: `Quatro tarefas, dois estágios cada, três formas de agendá-las. **Inverta as durações** e veja quais duas agendas deixam de ser a mesma coisa.`,
    },
    {
      kind: "quiz",
      question: `Qual conjunto de subtarefas pode ser distribuído em paralelo com segurança?`,
      options: [
        "Avaliar três bibliotecas candidatas contra a mesma checklist — trabalho independente, sem estado compartilhado",
        "Escrever um script de migração e executar esse mesmo script — sobrepor salva tempo",
        "Três modelos editando o mesmo módulo ao mesmo tempo, para terminá‑lo três vezes mais rápido",
      ],
      answer: 0,
      explain: `Executar antes de escrever viola uma dependência, e editar o mesmo arquivo gera conflitos de merge e passos extras. O teste é simples e confiável: se o nó A não lê a saída do nó B nem toca no estado do nó B, eles podem rodar juntos.`,
    },
    {
      kind: "quiz",
      question: `Cinco nós produzem cada um um achado, e cada achado depois precisa ser verificado. Quando é certo esperar por **todos os cinco** achados antes de começar **qualquer** verificação?`,
      options: [
        "Só quando o passo de verificação realmente precisa do conjunto inteiro de uma vez — para deduplicar entre achados, digamos, ou para pular tudo se a contagem for zero",
        "Sempre — uma fronteira limpa entre estágios torna o pipeline mais fácil de raciocinar",
        "Nunca — esperar é sempre tempo desperdiçado num sistema paralelo",
      ],
      answer: 0,
      explain: `Uma barreira é uma ferramenta real com um custo real: ela gasta o tempo do nó mais lento sem fazer nada com os outros quatro. Ela merece esse custo quando o próximo estágio é genuinamente sobre o *conjunto* — deduplicação, uma saída antecipada em zero, uma comparação entre resultados. "Fica mais legível" não é isso, e "preciso achatar a lista antes" também não.`,
    },
    {
      kind: "theory",
      body: `## O forjador e o refutador

O capítulo do arnês avisou: auto‑revisão compartilha os pontos cegos do eu. Um grafo corrige isso *estruturalmente*.

Adicione um **nó verificador**: um modelo forja; um nó *diferente* — contexto novo, sem vínculo às escolhas já feitas — recebe a tarefa de **refutar**: encontrar onde o diff viola a especificação, caçar casos de borda, tentar quebrá‑lo.

A descrição do trabalho importa. "Revise isto" convida a um aceno de aprovação. *"Encontre o que está errado aqui"* direciona a mente para os buracos. Pares adversariais capturam o que a auto‑revisão não pode estruturalmente — por isso forjas reais emparelham um criador com um inspetor.`,
    },
    {
      kind: "fill",
      prompt: `Dê ao segundo modelo sua verdadeira tarefa:`,
      file: "graph.toml",
      before: `verifier.goal = "`,
      after: ` o diff do nó forjador"`,
      choices: ["refutar", "aprovar", "resumir", "reescrever"],
      answer: 0,
      explain: `Um verificador instruído a aprovar encontrará um jeito de aprovar. "Summarize" produz prosa, não escrutínio; "rewrite" cria um segundo forjador com seus próprios pontos cegos. Refutar é o único objetivo que direciona o nó aos buracos.`,
    },
    {
      kind: "theory",
      body: `## Uma forma ainda não é um sistema

Você já consegue pegar uma missão grande demais para uma bancada só e cortá-la em nós pequenos o bastante para serem bem feitos — e sabe entregar a conferência a uma segunda mente que nunca se apegou às escolhas da primeira.

O que você tem é uma forma. O que você ainda não tem é uma máquina em que alguém possa confiar. Quem decide qual nó roda em seguida? O que acontece com os outros nós quando um deles falha? E — a pergunta que mais economiza dinheiro — quando você **não** deveria construir um grafo?

**A seguir:** a parte que torna a forma confiável.`,
    },
  ],
  testOut: [
    { question: `Por que decompor uma missão grande num grafo de nós em vez de um prompt longo?`,
      options: ["Cada nó ganha a própria bancada curada, então a qualidade não se dilui entre passos que não têm nada a ver um com o outro","Modelos cobram menos por vários pedidos curtos do que por um longo","Isso deixa o modelo escolher a própria ordem de trabalho, o que melhora os resultados"], answer: 0 },
    { question: `Qual é o teste para saber se dois nós podem rodar em paralelo?`,
      options: ["O nó A não lê a saída do nó B nem toca no estado dele","Espera-se que os dois nós levem aproximadamente o mesmo tempo","Nenhum dos dois escreve na rede"], answer: 0 },
    { question: `Por que dar ao segundo modelo o objetivo \"refutar\" e não \"revisar\"?`,
      options: ["Um nó mandado aprovar vai achar um jeito de aprovar — refutação é o único objetivo que aponta a mente para os buracos","Refutação produz saída mais curta, o que custa menos","Revisão exige o contexto original, e refutação não"], answer: 0 },
    { question: `Quatro tarefas em paralelo, cada uma com dois estágios. O que esperar todas terminarem o estágio um de fato custa?`,
      options: ["O tempo de estágio um da tarefa mais lenta, gasto sem fazer nada com as outras — e de novo no estágio dois","Nada, desde que as tarefas rodem em paralelo dentro de cada estágio","Só o custo de coordenação do escalonador"], answer: 0 },
  ],
};
