import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "O Que o Golem Enxerga",
  tagline: "Context engineering: curadoria, não acúmulo.",
  steps: [
    {
      kind: "theory",
      body: `## Curadoria, não acúmulo

Prompt engineering pergunta *como formular*. **Context engineering** faz a pergunta mais importante: *o que vai para a frente do golem, afinal?*

Para um bug no fluxo de reembolso, ele precisa de três coisas:

- o **módulo de reembolso** — o código que está em jogo,
- as **regras de reembolso da spec** — o artefato do Capítulo I,
- o **teste que falha** — o artefato do Rito, nomeando exatamente o que "consertado" significa.

Não o repositório inteiro. Não as notas de migração do mês passado. A habilidade é a *seleção*: as duzentas linhas certas valem mais que a obra completa do seu código.`,
    },
    {
      kind: "theory",
      body: `## Uma bancada, montada

O bug de reembolso, de verdade. Isto é o que entra, com tamanho e motivo:

- \`refunds.rs\` (180 linhas) — o código que está errado. Não o módulo que o chama; o que decide.
- As três cláusulas de reembolso da spec (14 linhas) — para "correto" ter uma definição que não é a opinião do golem.
- \`test_refund_after_deadline\` e a saída de falha dele (20 linhas) — a única prova que está vermelha, e o que ela de fato imprimiu.

E o que fica de fora, que é a metade mais difícil:

- \`payments.rs\`, mesmo com reembolso morando dentro de pagamentos — não é onde está o bug, e **todo arquivo na bancada é um arquivo que o golem pode decidir melhorar**.
- As notas de migração da release que introduziu o prazo. Elas descrevem um schema que já mudou duas vezes desde então, e material velho ensina com confiança.
- O resto da suíte de testes. Seiscentas linhas de verde não dizem nada sobre a única que está vermelha.

Cerca de 210 linhas, contra um repositório de quarenta mil. Essa proporção *é* o trabalho.`,
    },
    {
      kind: "diagram",
      body: "O que você acha que mandou, e o que de fato chegou:",
      caption:
        "Contexto é orçamento, não recipiente. Tudo que você acrescenta disputa com tudo que você já pôs lá.",
      view: {
        kind: "compare",
        columns: [
          { id: "you", label: "o que você quis dizer", tone: "neutral" },
          { id: "model", label: "o que ele recebeu", tone: "accent" },
        ],
        rows: [
          {
            label: "a tarefa",
            cells: [
              { text: "\"conserta o bug\"", tone: "neutral" },
              { text: "três palavras, sem saída de erro, sem arquivo", tone: "accent" },
            ],
          },
          {
            label: "o código",
            cells: [
              { text: "\"está tudo no repositório\"", tone: "neutral" },
              { text: "o que coube — geralmente a metade errada", tone: "accent" },
            ],
          },
          {
            label: "o padrão",
            cells: [
              { text: "\"você conhece nosso estilo\"", tone: "neutral" },
              { text: "nada; ele nunca viu seus comentários de review", tone: "accent" },
            ],
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "context-window",
      body: `Aqui está esse orçamento. **Carregue a bancada** e veja dois números se mexerem ao mesmo tempo — quanto espaço sobrou, e quanto do que está lá é de fato sobre a tarefa.`,
    },
    {
      kind: "quiz",
      question: `Você vai mandar o golem consertar um bug no fluxo de reembolso. O que vai para a bancada?`,
      options: [
        "O módulo de reembolso, as regras de reembolso da spec e o teste que falha — e pouco mais",
        "O repositório inteiro, para que nenhum detalhe potencialmente relevante fique de fora",
        "Só a mensagem de erro — qualquer contexto de código enviesaria a perspectiva fresca dele",
      ],
      answer: 0,
      explain: `Passar fome e se afogar são os dois modos de falha: contexto de menos obriga a adivinhar, contexto indiscriminado enterra o sinal e convida a edições que você nunca pediu. Curadoria — o módulo relevante, a spec, a prova — é o ofício em si.`,
    },
    {
      kind: "theory",
      body: `## Apodrecimento de contexto

Aqui vem a parte contraintuitiva: contexto irrelevante não só desperdiça espaço — ele **causa dano ativo**.

- Um arquivo distrator convida o golem a "prestativamente" mexer nele.
- Vocabulários misturados puxam o modelo errado de Conta — o pesadelo do Capítulo III, autoinfligido.
- Docs velhos e código morto ensinam comportamento antigo como se fosse o atual.
- E quanto mais longa a bancada, mais fina a atenção: sua única restrição crucial agora disputa com dez mil tokens de ruído.

A curadoria corta dos dois lados. **Tirar da bancada é tão poderoso quanto pôr nela.**`,
    },
    {
      kind: "quiz",
      question: `Qual destes causa mais estrago numa bancada lotada?`,
      options: [
        "Um doc velho descrevendo como o módulo funcionava antes — ele ensina comportamento antigo como atual",
        "Um arquivo longo que simplesmente não tem relação e acaba ignorado",
        "Linhas em branco a mais entre as seções do prompt",
      ],
      answer: 0,
      explain: `Material sem relação te custa espaço e atenção. Material *contraditório* te custa correção: o golem não tem como saber qual das duas versões da verdade é a atual, e confiante-e-errado é o modo de falha caro.`,
    },
    {
      kind: "fill",
      prompt: `Complete a frase que separa esta disciplina do prompting:`,
      file: "NOTES.md",
      before: `Contexto é orçamento, não recipiente — e por isso tirar da bancada é `,
      after: ` .`,
      choices: [
        "tão poderoso quanto pôr nela",
        "só vale a pena quando o espaço acaba",
        "um último recurso quando o modelo se confunde",
        "resolvido automaticamente pelo modelo",
      ],
      answer: 0,
      explain: `É o capítulo inteiro numa linha. Formular é uma habilidade que se treina numa tarde; decidir o que o golem nunca vê é a parte que continua difícil, e a que separa uma bancada que funciona de uma bancada cheia.`,
    },
    {
      kind: "theory",
      body: `## Por que este é o último capítulo calmo

Até aqui o golem fez uma coisa de cada vez: você monta a bancada, escreve o pedido, lê a resposta. O laço ainda é você.

No instante em que ele começa a agir sobre a própria saída — rodar o teste que acabou de escrever, ler a falha, tentar de novo — tudo daqui se compõe. Uma bancada que estava apenas bagunçada vira uma bancada que **cresce**, sozinha, a cada passo que ele dá.

**A seguir:** o laço que age, observa e corrige — e como dizer a ele quando parar.`,
    },
  ],
  testOut: [
    {
      question: `Que pergunta o context engineering faz que o prompt engineering não faz?`,
      options: [
        "O que vai para a frente do modelo, afinal — o que é uma questão de seleção, não de formulação",
        "Como redigir a instrução para o modelo não poder ler errado",
        "Para qual modelo mandar a tarefa",
      ],
      answer: 0,
    },
    {
      question: `Por que contexto irrelevante é pior do que só desperdício?`,
      options: [
        "Um distrator convida a edições que você nunca pediu, e material velho ensina comportamento antigo como atual",
        "Deixa a resposta lenta o bastante para quebrar o fluxo de trabalho",
        "Modelos cobram mais por entradas longas, então é puramente um problema de custo",
      ],
      answer: 0,
    },
    {
      question: `Mandar o repositório inteiro em vez de três arquivos relevantes te dá o quê?`,
      options: [
        "O que coube no orçamento — e não é você quem escolhe qual metade foi essa",
        "Um quadro completo, ao custo de uma resposta mais lenta",
        "O mesmo resultado, já que modelos ignoram o que não é relevante",
      ],
      answer: 0,
    },
    {
      question: `Os dois modos de falha têm nome neste capítulo. Quais são?`,
      options: [
        "Passar fome — de menos, então ele adivinha; e se afogar — tanto que o sinal fica enterrado",
        "Overfitting e underfitting",
        "Partida a frio e apodrecimento de contexto",
      ],
      answer: 0,
    },
  ],
};
