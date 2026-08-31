import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Pense antes de forjar",
  tagline: "Specs são a habilidade que a IA não pode exercer por você.",
  steps: [
    {
      kind: "theory",
      body: `## A armadilha do vibe coding

Uma IA consegue forjar um contrato com aparência funcional em trinta segundos. Ele compila. Ele roda. Até se sai bem numa *demo*.

E essa é exatamente a armadilha: quando código é barato, **“parece certo” e “está certo” se tornam indistinguíveis** — a menos que você tenha escrito, antes de começar a forjar, o que *certo* significa.

Essa definição escrita é uma **spec**. Na era da programação em dupla com IA, a spec é a parte da engenharia que continua sendo sua.`,
    },
    {
      kind: "theory",
      body: `## O que uma spec realmente é

Uma spec descreve **comportamento**, não implementação:

- **O que deve acontecer** — “quem depositou pode recuperar os fundos depois do prazo”.
- **O que nunca pode acontecer** — “o saldo do contrato nunca fica abaixo da soma dos depósitos abertos”.
- **Os casos de borda** — “e se o prazo for exatamente *agora*? e se o valor for zero?”.

Ela propositalmente **não** diz qual loop, qual formato de armazenamento ou qual biblioteca usar. Duas implementações muito diferentes podem respeitar a mesma spec — essa liberdade é o que torna specs duráveis e adequadas para trabalhar com IA.`,
    },
    {
      kind: "quiz",
      question:
        "Você está escrevendo a spec de um contrato de custódia. Qual frase **pertence à spec**?",
      options: [
        "Os fundos só podem ser liberados quando as duas partes tiverem assinado.",
        "Numere cada depósito e guarde-os na ordem em que chegam.",
        "Construa com a versão mais recente do kit de contratos e o botão de pausa que já vem pronto.",
      ],
      answer: 0,
      explain:
        "Comportamento entra; implementação fica de fora. Formatos de armazenamento e escolhas de ferramenta são assunto da *forja*; a spec determina o que precisa ser verdade.",
    },
    {
      kind: "diagram",
      body: "A linha que aquele quiz traçou, no geral:",
      caption: "Duas implementações da mesma spec podem não se parecer em nada. Essa liberdade é justamente o ponto.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "spec",
            label: "pertence à spec",
            tone: "good",
          },
          {
            id: "forge",
            label: "pertence à forja",
            tone: "neutral",
          },
        ],
        rows: [
          {
            label: "um exemplo",
            cells: [
              {
                text: "os fundos só são liberados quando as duas partes assinaram",
                tone: "good",
              },
              {
                text: "guardar os depósitos numa lista numerada",
                tone: "neutral",
              },
            ],
          },
          {
            label: "de quem é",
            cells: [
              {
                text: "sua — e sobrevive a toda reescrita",
                tone: "good",
              },
              {
                text: "de quem forjar, desta vez",
                tone: "neutral",
              },
            ],
          },
          {
            label: "quando muda",
            cells: [
              {
                text: "quando o comportamento precisa mudar",
                tone: "good",
              },
              {
                text: "sempre que aparecer um jeito mais rápido",
                tone: "neutral",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## É na ambiguidade que os bugs vivem

Considere um requisito aparentemente inocente:

> “O comprador recebe o reembolso depois do prazo.”

Três engenheiros — ou três execuções de IA — podem interpretá-lo de três maneiras:

1. O reembolso acontece **automaticamente** ou **quando o comprador solicita**?
2. Depois que o prazo **passa** ou **exatamente no instante** do prazo?
3. O valor **integral** ou com as taxas descontadas?

Nenhuma dessas interpretações é um erro de *código*. São **buracos na spec** — e cada um deles chega à produção como um bug usando uma suíte de testes verde.`,
    },
    {
      kind: "quiz",
      question: `Aqui está uma spec e três implementações forjadas. **Qual delas respeita a spec?**

**SPEC — Custódia v1**
1. O comprador deposita uma vez; o valor é fixado na criação.
2. Os fundos só são liberados ao vendedor quando **comprador e vendedor** tiverem aprovado.
3. Depois do prazo, **o comprador** pode retirar os fundos **se a liberação ainda não tiver acontecido**.

---

**A** — libera ao vendedor quando *qualquer uma* das partes aprova; depois do prazo, o comprador pode retirar.

**B** — libera ao vendedor apenas quando ambos aprovam; depois do prazo, *qualquer pessoa* pode acionar a retirada, e os fundos vão para o comprador.

**C** — libera apenas quando ambos aprovam; depois do prazo, o comprador pode retirar — *mesmo que a liberação já tenha acontecido*, usando o saldo restante do contrato.`,
      options: [
        "B — a liberação por ambas as partes foi respeitada, e o reembolso chega ao comprador conforme a regra do prazo",
        "A — parece mais conveniente para o vendedor",
        "C — o comprador sempre deveria poder sair",
      ],
      answer: 0,
      explain:
        "A viola a regra 2 (qualquer um ≠ ambos). C viola a condição da regra 3 (“se a liberação ainda não tiver acontecido”) — ela gasta a custódia duas vezes. B muda *quem pode acionar* o reembolso, algo que a spec não restringiu; os fundos ainda chegam ao comprador, portanto a spec é respeitada. Perceber essa última diferença é justamente a habilidade treinada aqui.",
    },
    {
      kind: "theory",
      body: `## Invariantes: o anel de ferro da spec

As linhas mais fortes de uma spec são as **invariantes** — afirmações que precisam continuar verdadeiras *em todos os momentos*, não importa qual função tenha sido executada:

> saldo da custódia = depósitos abertos − liberações − reembolsos

Uma invariante não se importa com o quanto a implementação é engenhosa. Se ela for quebrada uma única vez, o código está errado. Quando você encontrar o **TDD** nos próximos capítulos, transformará essas linhas em testes executáveis — uma spec que a máquina verifica novamente a cada forja.`,
    },
    {
      kind: "fill",
      prompt: "Complete a invariante da custódia:",
      file: "SPEC.md",
      before: "saldo(custódia) == depósitos − liberações − ",
      after: "",
      choices: ["reembolsos", "taxas", "lucro", "gas"],
      answer: 0,
      explain:
        "O dinheiro sai da custódia de exatamente duas maneiras: liberações ao vendedor e reembolsos ao comprador. Se esses três termos não fecharem, alguém forjou um buraco.",
    },
    {
      kind: "quiz",
      question: `Sua IA implementou a spec perfeitamente. Todos os testes passam. Em produção, um comprador retira *durante* a transação de liberação e a custódia paga duas vezes — um caso que sua spec nunca mencionou.

De quem é o bug?`,
      options: [
        "Da spec — e, portanto, seu: o artefato sob sua responsabilidade tinha um buraco",
        "Da IA — ela deveria ter adivinhado a regra ausente",
        "De ninguém — comportamento indefinido não é um problema",
      ],
      answer: 0,
      explain:
        "Este é o acordo da engenharia na era da IA: a máquina forja seguindo a spec ao pé da letra, portanto a letra da spec é sua responsabilidade. Aperte a spec, forje novamente e as duas interpretações desaparecem.",
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## A prova do examinador: escreva a spec de um Cofre de Gorjetas da Guilda

Chegou a hora de forjar sua própria spec. A encomenda é esta:

> A guilda quer um **cofre de gorjetas** on-chain. Qualquer pessoa pode depositar gorjetas nele. Somente o **guardião** da guilda pode recolher o que estiver dentro. A guilda teme duas coisas: o guardião conseguir retirar *mais* do que o cofre possui e as gorjetas ficarem presas para sempre caso o guardião desapareça.

Escreva a spec — **somente comportamento**, como este capítulo ensinou: o que deve acontecer, o que nunca pode acontecer e os casos de borda. Um examinador de IA vai avaliá-la usando a rubrica abaixo (e ele corrige exatamente como os golems da forja: ao pé da letra).`,
      rubric: `1. Somente comportamento — nada de formatos de armazenamento, bibliotecas ou assinaturas de funções.
2. A regra de depósito e a regra de coleta estão declaradas sem ambiguidade (quem pode agir e sobre o quê).
3. Pelo menos uma **invariante** que precisa ser verdadeira em todos os momentos.
4. Pelo menos um **caso de borda** é tratado (gorjeta de valor zero, coleta com cofre vazio, coleta do saldo exato…).
5. A preocupação “o guardião desaparece” é resolvida com um comportamento declarado (qualquer solução razoável é aceita — a rubrica exige uma decisão, não uma solução específica).`,
      minChars: 120,
    },
    {
      kind: "theory",
      body: `## Sua estrada daqui em diante

Todos os capítulos desta Jornada funcionam como este: uma disciplina que a IA não exerce por você, praticada na **Stellar** — uma rede real, com mecanismos reais.

E sempre que um conceito despertar sua curiosidade sobre o metal por baixo dele, procure a porta **“Ver em Rust”**: ela leva à Campanha opcional, onde as mesmas ideias são forjadas à mão, combate por combate.

A seguir: o reino no qual você vai construir — e como milhares de máquinas chegam a um acordo sem um rei.`,
    },
  ],
  testOut: [
    { question: `Por que uma spec é a parte da engenharia que continua sendo sua na era da IA?`,
      options: ["Quando código é barato, \"parece certo\" e \"está certo\" viram indistinguíveis, a menos que você tenha escrito antes o que certo significa","Porque modelos não conseguem ler especificações, então um humano precisa guardá-las","Porque specs são mais rápidas de escrever que código, então economizam tempo"], answer: 0 },
    { question: `Uma spec descreve o quê?`,
      options: ["Comportamento — o que precisa acontecer, o que nunca pode acontecer, e as bordas","A implementação, precisa o bastante para qualquer dev produzir o mesmo código","O layout de armazenamento e as assinaturas das funções públicas"], answer: 0 },
    { question: `Duas implementações bem diferentes satisfazem a sua spec. O que isso significa?`,
      options: ["A spec está fazendo o trabalho dela — restringe comportamento e deixa a implementação livre","A spec está vaga demais e precisa de detalhe de implementação","Uma das duas implementações precisa estar errada"], answer: 0 },
    { question: `Qual destes pertence a uma spec?`,
      options: ["\"O saldo do contrato nunca fica abaixo da soma dos depósitos em aberto\"","\"Guarde os depósitos num mapa persistente indexado por endereço\"","\"Use o SDK mais recente e mantenha o código limpo\""], answer: 0 },
  ],
};
