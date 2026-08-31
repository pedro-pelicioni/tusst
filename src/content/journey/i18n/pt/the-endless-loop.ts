import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Loops agênticos",
  tagline: "Laços agênticos: agir, observar, corrigir — e os sinais que fazem o laço subir.",
  steps: [
    {
      kind: "theory",
      body: `## Do desejo ao laço

Prompting de um tiro só é um desejo: descreva, receba, torça. O **laço agêntico** troca a torcida por um ciclo:

> **agir → observar → corrigir → agir de novo**

O modelo escreve código, *roda*, lê a reclamação do compilador, conserta, roda de novo — do jeito que você trabalha, em ritmo de máquina. A qualidade de um tiro só deixou de ser o número interessante no instante em que o modelo passou a ver os próprios resultados.

Mas um laço é maquinário, não mágica. Ele tem peças que podem ser bem ou mal projetadas, e este capítulo é sobre as duas que decidem se ele sobe.`,
    },
    {
      kind: "diagram",
      body: "O laço, e a única saída que importa:",
      caption:
        "Três destes quatro são este capítulo. O quarto — decidir parar — é o próximo, e é o que as pessoas pulam.",
      view: {
        kind: "flow",
        layout: "cycle",
        play: true,
        nodes: [
          { id: "act", label: "agir", note: "Dê o menor passo que o plano permite, então pare e olhe.", tone: "accent" },
          { id: "observe", label: "observar", note: "Leia o que o mundo respondeu. Não o que você esperava.", tone: "teal" },
          { id: "correct", label: "corrigir", note: "Ajuste o plano, não só a última jogada.", tone: "gold" },
          { id: "stop", label: "parar?", note: "Pronto, travado ou sem orçamento. Decida explicitamente, todo turno.", tone: "good" },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Observação: os olhos do laço

Um laço melhora só até onde as **observações** dele são verdadeiras. Corrigir precisa de um sinal *para o qual* corrigir:

- **códigos de saída** — o comando falhou?
- **saída dos testes** — qual prova, qual asserção, qual linha?
- **estado on-chain** — o que o ledger de fato guarda depois da execução?

Sinais, não vibrações. "A saída parece razoável" não corrige nada, porque nunca pode ser falso. Todo verificador que você colocou no arreio agora rende juros: ligado ao laço, ele vira os olhos pelos quais o modelo se guia — **em cada iteração**.`,
    },
    {
      kind: "quiz",
      question: `Qual observação consegue de fato guiar um laço?`,
      options: [
        "O relatório do runner de testes: 3 passaram, 1 falhou — refund_after_deadline, asserção na linha 41",
        "O resumo de fechamento do próprio modelo: agora está tudo correto",
        "O fato de o código ter compilado de primeira — forte evidência de que a lógica está certa",
      ],
      answer: 0,
      explain: `Compilar significa que os tipos batem, não que o comportamento é o desejado — e um autorresumo é a mente corrigindo o próprio dever de casa. Um sinal de direção precisa ser externo, específico e capaz de ser má notícia. "1 falhou, linha 41" é uma manchete; "parece correto" é meteorologia.`,
    },
    {
      kind: "theory",
      body: `## Um turno, rastreado

É fácil concordar com um ciclo no abstrato. Aqui está um único turno, com o que de fato passa pelo fio.

**Agir.** O modelo edita \`refunds.rs\` — troca a comparação de prazo de \`>\` para \`>=\`. Uma mudança só, porque um turno que muda seis coisas não consegue te dizer qual delas funcionou.

**Observar.** O arreio roda as evals fixas e devolve exatamente isto:

> \`test_refund_after_deadline ... FAILED\`
> \`assertion failed: balance == 0, left: 40, right: 0\`
> \`4 passed, 3 failed\`

Não "continua quebrado". Uma linha, um número, e uma contagem que dá para comparar com a do turno anterior.

**Corrigir.** Três verdes viraram quatro. Então a comparação era *um* dos bugs e não o único: o prazo está tratado, o saldo não. O plano se atualiza — o próximo turno vai atrás do saldo.

Repare no que fez esse turno valer alguma coisa. Não foi o modelo que decidiu ter melhorado. **Foi a contagem.**`,
    },
    {
      kind: "theory",
      body: `## Evals: a bússola

Como você sabe que a iteração 7 superou a 6? Não pelo sentimento. **Evals** são um conjunto *fixo* de verificações — testes, lint, build, uma asserção on-chain — rodadas **a cada iteração**, para que toda tentativa seja medida pela mesma régua.

*Fixo* é a palavra que sustenta tudo. Se as verificações mudam entre tentativas, "progresso" fica impossível de medir — você está comparando notas de provas diferentes.

Com uma bússola, o laço sabe *de fato* se andou: 4 verdes de 7 viraram 6 de 7. Sem ela, ele só sabe que se mexeu. Progresso é **medido, não sentido**.`,
    },
    {
      kind: "fill",
      prompt: `Complete a propriedade que faz de uma bússola uma bússola:`,
      file: "NOTES.md",
      before: `As evals rodam a cada iteração, e o conjunto de verificações precisa continuar `,
      after: ` — senão duas tentativas estão sendo corrigidas por duas provas diferentes.`,
      choices: [
        "fixo",
        "aleatorizado",
        "opcional",
        "regenerado a cada tentativa",
      ],
      answer: 0,
      explain: `Uma régua que se mexe não mede nada. É também por isso que "deixa o modelo escrever os próprios testes enquanto trabalha" destrói o sinal em silêncio: a prova e o aluno deixam de ser coisas diferentes.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## A prova do examinador: escreva um contrato de observação

Um laço está prestes a ser apontado para uma tarefa real:

> Um contrato Soroban tem um comportamento com defeito: reembolsos estão sendo pagos **depois** de o prazo ter passado. Você vai entregar isso a um laço agêntico e deixá-lo trabalhar sozinho por um tempo.

Antes que ele gire uma vez, escreva o **contrato de observação** dele: por quais sinais este laço vai se guiar, e o que torna cada um confiável. Só comportamento — sem código de arreio, sem nomes de biblioteca.`,
      rubric: `1. Nomeia pelo menos dois sinais concretos e externos (saída de teste, código de saída, estado on-chain, resultado de lint/build) — nem autoavaliação, nem "parece certo".
2. Para pelo menos um sinal, diz o que o torna confiável — determinístico, reproduzível ou independente do código que está mudando.
3. Diz o que conta como PRONTO em termos desses sinais, não em termos da opinião do modelo.
4. Nomeia pelo menos um sinal que NÃO deve ser confiado, e por quê (um autorresumo, um build que passou, um teste instável…).
5. Só comportamento — sem implementação de arreio, sem exigir ferramentas ou bibliotecas específicas.`,
      minChars: 140,
    },
    {
      kind: "theory",
      body: `## O que este capítulo não te deu

Você já consegue montar um laço que enxerga com honestidade e mede o próprio progresso. Aponte para uma tarefa e ele sobe.

Repare no que falta: nada aqui decide quando ele **para**. Não quando está pronto — essa parte você acabou de escrever — mas quando está *travado*, ou quando já gastou mais do que a tarefa valia. Um laço com bons olhos e sem freio não falha alto. Ele falha na fatura.

**A seguir:** os freios, e a única rodada em que você descobre para que serviam.`,
    },
  ],
  testOut: [
    { question: `O que um laço agêntico substitui, em comparação com prompting de um tiro só?`,
      options: ["A torcida — o modelo agora vê o resultado do próprio trabalho e corrige contra ele","A necessidade de uma spec, já que o laço descobre os requisitos no caminho","O compilador, já que o laço confere o código sozinho"], answer: 0 },
    { question: `Por que "a saída parece razoável" nunca consegue guiar um laço?`,
      options: ["Porque nunca pode ser falso — um sinal que não pode ser má notícia não carrega informação","Porque chega tarde demais na iteração para ser usado","Porque modelos não são treinados para avaliar julgamentos em linguagem natural"], answer: 0 },
    { question: `Por que o conjunto de evals precisa continuar fixo entre iterações?`,
      options: ["Senão duas tentativas são corrigidas por provas diferentes e o progresso fica impossível de medir","Senão o laço fica mais lento a cada verificação acrescentada","Senão o modelo memoriza as verificações e as burla"], answer: 0 },
    { question: `Um laço compila limpo na primeira tentativa. O que isso prova?`,
      options: ["Que os tipos batem — não que o comportamento é o que se queria","Que a lógica está muito provavelmente certa, já que a maioria dos bugs é de tipo","Nada; compilação não tem relação com qualidade de código"], answer: 0 },
  ],
};
