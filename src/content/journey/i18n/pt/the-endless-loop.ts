import type { Concept } from "../types";

export const theEndlessLoop: Concept = {
  meta: {
    slug: "the-endless-loop",
    title: "O Loop Infinito",
    tagline: "Loops agentes: agir, observar, corrigir — e saber quando parar.",
    numeral: "VII",
    arc: "craft",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-endless-loop.webp",
    glyph: "🔁",
  },
  steps: [
    {
      kind: "theory",
      body: `## Do desejo ao loop

Prompt único é um desejo: descreva, receba, espere. O **loop agente** substitui a esperança por um ciclo:

> **agir → observar → corrigir → agir novamente**

O golem escreve código, *executa*‑o, lê a reclamação do compilador, corrige, executa de novo — a forma como você trabalha, no ritmo da máquina. A qualidade de um prompt único deixou de ser o número interessante no momento em que o golem pôde ver seus próprios resultados.

Mas um loop é maquinaria, não magia. Ele tem partes que podem ser bem ou mal projetadas — e cada uma das próximas telas é uma dessas partes.`,
    },
    {
      kind: "theory",
      body: `## Observação: os olhos do loop

Um loop melhora apenas na medida em que suas **observações** são verdadeiras. A correção precisa de um sinal para corrigir *em direção a*:

- **códigos de saída** — o comando falhou?
- **saída de teste** — qual teste, qual asserção, qual linha?
- **estado on‑chain** — o que o ledger realmente contém após a execução?

Sinais, não vibrações. “A saída parece razoável” não corrige nada, porque nunca pode ser falsa. Cada verificador que você incorporou ao harness agora rende juros: conectado ao loop, ele se torna os olhos pelos quais o golem se orienta — **em cada iteração**.`,
    },
    {
      kind: "quiz",
      question: `Qual observação pode realmente orientar um loop?`,
      options: [
        "O relatório do test runner: 3 passaram, 1 falhou — refund_after_deadline, asserção na linha 41",
        "O resumo de fechamento do próprio golem: tudo parece correto agora",
        "O fato de o código ter compilado na primeira tentativa — forte evidência de que a lógica está certa",
      ],
      answer: 0,
      explain: `Compilar significa que os tipos batem, não que o comportamento seja o desejado — e um resumo interno é a mente avaliando seu próprio dever de casa. Um sinal de orientação deve ser externo, específico e capaz de ser uma má notícia. “1 falhou, linha 41” é um cabeçalho; “parece correto” é clima.`,
    },
    {
      kind: "theory",
      body: `## Todo loop precisa de freio

Um loop sem monitoramento não converge — ele **gasta**. Um loop sem parada é uma conta, e às vezes um apagão. Instale os freios *antes* da primeira volta:

- **Critérios de sucesso** — as verificações que significam *concluído*, decididas antecipadamente.
- **Orçamento** — tokens, minutos, dólares: o que acabar primeiro.
- **Máximo de iterações** — um teto rígido, sempre.
- **Detecção de falta de progresso** — o mesmo erro duas vezes significa *mudar a estratégia ou escalar*, nunca “de novo, mas mais difícil”.

A regra do reino: nunca inicie um loop sem ter decidido como pará‑lo.`,
    },
    {
      kind: "quiz",
      question: `Iteração 40, e o loop vem encontrando a mesma avaliação falha com a mesma mensagem de erro desde a iteração 12. O que o harness deve fazer?`,
      options: [
        "Parar e escalar para um humano — repetir sem progresso é condição de parada, não persistência",
        "Continuar — iteração é o objetivo de um loop, e a tentativa 41 pode ser a certa",
        "Aumentar a temperatura do modelo para que ele seja mais criativo na correção",
      ],
      answer: 0,
      explain: `Vinte e oito falhas idênticas são uma mensagem: o loop carece de algo — contexto, permissão, especificação correta — que mais iterações não podem fornecer. Randomizar mais não passa de espalhar erros ao mesmo custo. Detecte falta de progresso, pare e entregue o rastro a um humano.`,
    },
    {
      kind: "fill",
      prompt: `Instale o freio antes que o loop gire:`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: ["budget.max_iterations", "usize::MAX", "evals.len()", "iterations + 1"],
      answer: 0,
      explain: `usize::MAX é “sem freio — vamos discutir isso na fatura”. Um limite que se move com o contador (iterations + 1) nunca realmente limita. E evals.len() confunde quantas verificações existem com quanto tempo tentar. O teto é um orçamento que você escolheu deliberadamente.`,
    },
    {
      kind: "theory",
      body: `## Avaliações: a bússola

Como saber que a iteração 7 superou a iteração 6? Não por sensação. **Avaliações** são um conjunto *fixo* de verificações — testes, lint, build, uma asserção on‑chain — executadas **a cada iteração**, de modo que cada tentativa é medida contra a mesma régua.

*Fixo* é a palavra que sustenta a carga. Se as verificações mudam entre tentativas, “progresso” se torna incalculável — você está comparando notas de exames diferentes.

Com uma bússola, o loop sabe *com certeza* se avançou: 4 verdes de 7 viraram 6 de 7. Sem ela, ele só sabe que se moveu. Progresso é **medido, não sentido**.`,
    },
    {
      kind: "theory",
      body: `## Feedback instável envenena o loop

Um teste que falha aleatoriamente — por timing, ordem, porta compartilhada — é um incômodo para humanos. Suspiramos e reexecutamos. Para um loop isso é **veneno**, porque o loop *age sobre cada sinal*.

Um vermelho fantasma aparece → o golem “corrige” código que nunca estava quebrado → a mudança é aplicada → na próxima iteração, outro fantasma → outra correção. O loop passa a aprender superstições, cada uma se acumulando, tudo a partir de ruído.

A regra: **torne o feedback determinístico antes de conectá‑lo a um loop**. Um teste instável é pior que nenhum teste — silêncio não engana ninguém; ruído engana incansavelmente.`,
    },
    {
      kind: "quiz",
      question: `Um teste falha aleatoriamente uma vez a cada cinco execuções, por questões de timing. Para um humano é um incômodo. O que isso representa para um loop?`,
      options: [
        "Veneno — o loop trata cada falha fantasma como verdade e “corrige” código saudável, acumulando erros a cada passagem",
        "O mesmo incômodo — ao longo de muitas iterações a aleatoriedade se equilibra",
        "Levemente útil — falhas extras aumentam a pressão para tornar o código mais robusto",
      ],
      answer: 0,
      explain: `Nada se equilibra, porque cada sinal falso dispara uma mudança real de código que a próxima iteração então incorpora. Humanos descartam ruído; loops obedecem a ele. Determinismo não é um luxo do harness — é pré‑requisito para qualquer loop.`,
    },
    {
      kind: "theory",
      body: `## A altitude correta

Onde o humano fica enquanto o loop gira? Não dentro dele — revisar cada tecla significa *você* ser o loop, no ritmo do golem. E também não acima das nuvens, aprovando tudo que chega.

A altitude correta é a **fronteira**: revise o *diff* contra a *especificação*. As avaliações passaram? A mudança respeita as regras do Capítulo I? Algo se moveu sem necessidade? Confie nos instrumentos do loop para os detalhes; mantenha o julgamento humano para o que os instrumentos não conseguem ver.

Próxima disciplina: quando um loop não basta — muitos golems pequenos, um plano entrelaçado.`,
    },
  ],
};
