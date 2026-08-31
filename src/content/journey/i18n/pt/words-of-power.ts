import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Palavras de Poder",
  tagline: "Prompt engineering: as quatro partes que todo prompt que funciona tem.",
  steps: [
    {
      kind: "theory",
      body: `## Suas palavras são tudo o que ele tem

O golem não conhece seu repositório. Ele não lembra de ontem, e não enxerga o arquivo que você *não* anexou. O universo inteiro dele é o texto que está na frente dele agora.

Essa é a regra mais profunda de prompting, e não tem nada de místico: **você está decidindo o que existe.** O que você põe na frente dele é o mundo; o que você deixa de fora nunca aconteceu.

Então a pergunta por trás de todo prompt não é "como eu formulo isso?", e sim *"o que o golem precisa ter para acertar?"* Este capítulo é a primeira metade da resposta — as palavras em si. O próximo é a metade mais difícil.`,
    },
    {
      kind: "theory",
      body: `## Anatomia de um prompt

Um prompt que funciona é um pequeno documento de engenharia com quatro partes:

1. **Papel e instruções** — que trabalho está sendo feito, e como: "Você está implementando um caso de uso num domínio de pagamentos."
2. **Restrições** — os deve e os não pode: "API pública inalterada. Sem dependências novas. Sem panics."
3. **Exemplos** — uma amostra do que é *bom*, para a qualidade ser mostrada em vez de descrita.
4. **O pedido** — a tarefa de fato, dita por último, precisa e única.

A maioria dos prompts ruins não está mal *escrita* — está **faltando uma parte**, quase sempre as restrições ou o exemplo.`,
    },
    {
      kind: "diagram",
      body: "As quatro partes, na ordem a que pertencem:",
      caption:
        "O pedido vem por último de propósito: tudo acima dele é a moldura pela qual o golem lê a tarefa.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "role",
            label: "papel e instruções",
            note: "Que trabalho está sendo feito, e em que mundo. Uma ou duas linhas bastam.",
            tone: "neutral",
          },
          {
            id: "constraints",
            label: "restrições",
            note: "Os deve e os não pode. É a parte que pode de fato ser violada — e é isso que faz ela guiar.",
            tone: "accent",
          },
          {
            id: "examples",
            label: "exemplos",
            note: "Uma amostra do que é bom. Mostra o padrão em vez de descrevê-lo.",
            tone: "teal",
          },
          {
            id: "ask",
            label: "o pedido",
            note: "Por último, preciso e único. Dois pedidos num prompt são dois prompts.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Qual instrução de fato melhora o código do golem?`,
      options: [
        "Valide o valor: rejeite zero e negativos com um erro tipado; nunca faça panic; mantenha a API pública inalterada",
        "Por favor escreva um código bem limpo, profissional, de altíssima qualidade, pronto para produção",
        "Você é o maior programador que já existiu — codifique à altura",
      ],
      answer: 0,
      explain: `O golem não consegue falhar em "alta qualidade" — toda saída plausivelmente se qualifica. Ele *consegue* falhar em "nunca faça panic", e o ponto é esse: critérios de aceite criam a possibilidade de estar errado, e é isso que guia um modelo. Especificidade vence educação — e bajulação.`,
    },
    {
      kind: "theory",
      body: `## Mostre, não descreva

Adjetivos descrevem qualidade; **exemplos a definem.** Um exemplo trabalhado vale mais que três parágrafos de adjetivos, porque o golem é uma máquina de continuar padrões — então entregue a ele um padrão que valha a pena continuar.

Quer testes no estilo da casa? Cole **um teste ideal** e diga "assim". Quer mensagens de erro que carreguem um código e uma dica de correção? Mostre *uma*.

O Capítulo I ensinou que requisitos em prosa vazam ambiguidade. Aqui vale o mesmo: um exemplo é uma spec minúscula que é *copiada* em vez de interpretada — e copiar perde muito menos do que interpretar.`,
    },
    {
      kind: "quiz",
      question: `Seu time tem um jeito bem próprio de escrever mensagens de erro. O que faz o golem acertar esse jeito?`,
      options: [
        "Colar uma mensagem de erro real do código e dizer “assim”",
        "Descrever a convenção com cuidado em três frases",
        "Mandar ele seguir o guia de estilo estabelecido do time",
      ],
      answer: 0,
      explain: `Ele nunca leu o seu guia de estilo e não enxerga o seu código. Uma descrição precisa ser interpretada; um exemplo só precisa ser continuado — e continuar é a única coisa que essa máquina foi feita para fazer.`,
    },
    {
      kind: "fill",
      prompt: `O prompt mais afiado que você tem é um que você já escreveu:`,
      file: "prompt.md",
      before: `Faça este `,
      after: ` que falha passar, sem mudar as asserções dele.`,
      choices: ["teste", "build", "demo", "deploy"],
      answer: 0,
      explain: `Um teste que falha é um critério de aceite executável — comportamento, bordas e "pronto" numa forma que não dá para ler errado. Builds, demos e deploys também falham, mas só um teste carrega asserções: sua spec com dentes, agora fazendo bico de prompt.`,
    },
    {
      kind: "theory",
      body: `## Iterar é apertar a spec

A primeira saída vem errada. Tudo bem — isso é dado. A jogada amadora é rolar o dado de novo; a jogada de engenheiro é **ler a falha e achar a instrução que faltava**.

O golem ignorou um caso de borda? Suas restrições nunca o mencionaram. Estilo errado? Você descreveu em vez de mostrar. Mexeu em arquivos que não devia? A fronteira não foi dita.

Cada falha nomeia um buraco nas suas palavras — remende o *prompt*, não só a saída, exatamente como o Capítulo I ensinou a apertar uma spec.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## A prova do examinador: escreva o prompt

Esta é a tarefa que você está prestes a entregar:

> Um contrato de pagamentos tem uma função \`refund\`. Hoje ela deixa qualquer um chamar. Ela precisa ser chamável só pelo pagador original, só antes do prazo, e nunca pode deixar o contrato segurando menos que a soma dos depósitos em aberto.

Escreva o **prompt** que você mandaria — as quatro partes, na ordem. Não escreva a implementação, e não escreva a spec em prosa: escreva a coisa que você de fato colaria na bancada.`,
      rubric: `1. As quatro partes estão presentes e distinguíveis: papel/instruções, restrições, ao menos um exemplo, e um pedido único no fim.
2. As restrições estão escritas de forma que possam ser VIOLADAS — concretas e conferíveis, não "limpo" ou "de alta qualidade".
3. Inclui ao menos um exemplo trabalhado (um teste, uma assinatura, uma mensagem de erro, uma chamada de amostra) em vez de só descrever o estilo desejado.
4. O pedido é único e preciso — uma tarefa, não uma lista de desejos frouxamente relacionados.
5. É um prompt, não uma implementação e não uma especificação em prosa.`,
      minChars: 160,
    },
    {
      kind: "theory",
      body: `## A metade que é mais difícil

Você já consegue escrever um prompt que diz exatamente o que quer. Essa é a disciplina mais fácil, e a maioria das pessoas para aqui.

A mais difícil é decidir **o que o golem chega a ver** — quais arquivos, qual spec, qual teste, e, muito mais importante, o que deixar de fora. Formular é uma habilidade; selecionar é o ofício.

**A seguir:** a própria bancada, e por que acrescentar a ela não é de graça.`,
    },
  ],
  testOut: [
    {
      question: `Um prompt que funciona tem quatro partes. Qual delas costuma ser a que falta?`,
      options: [
        "As restrições — os deve e os não pode que podem de fato ser violados",
        "O papel, que diz ao modelo quem ele deve ser",
        "A saudação, que estabelece um tom cooperativo",
      ],
      answer: 0,
    },
    {
      question: `Por que "nunca faça panic" guia um modelo melhor do que "escreva código de alta qualidade"?`,
      options: [
        "Porque pode ser descumprido — um critério de aceite cria a possibilidade de estar errado",
        "Porque é mais curto, então sobrevive mais adiante no contexto",
        "Porque usa um verbo no imperativo, que os modelos pesam mais",
      ],
      answer: 0,
    },
    {
      question: `Você quer a saída no estilo da casa do seu time. O que funciona?`,
      options: [
        "Colar um exemplo real e dizer “assim”",
        "Descrever o estilo com cuidado e em detalhe",
        "Citar o guia de estilo que o time segue",
      ],
      answer: 0,
    },
    {
      question: `A primeira saída volta errada. Qual é a jogada de engenheiro?`,
      options: [
        "Ler a falha, achar a instrução que faltava e remendar o prompt",
        "Rodar de novo — o mesmo prompt produz saída diferente a cada vez",
        "Acrescentar “tenha cuidado e pense passo a passo” e tentar de novo",
      ],
      answer: 0,
    },
  ],
};
