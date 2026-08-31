import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "O Que a Fronteira Guarda",
  tagline: "Identidade, valor, e o conjunto que precisa se mover junto.",
  steps: [
    {
      kind: "theory",
      body: `## Entidades e objetos de valor

Dois tipos de coisa vivem dentro de qualquer contexto:

- Uma **entidade** tem identidade que sobrevive a mudanças. Uma **Account** Stellar é a mesma conta após mil pagamentos — seu endereço é sua identidade; seus saldos são apenas estado.
- Um **objeto de valor** *é* seu valor. Um **Asset** Stellar é um código mais um emissor: dois \`USDC\` do mesmo emissor são intercambiáveis — indistinguíveis, na verdade. Trocar o emissor não edita o ativo; você passa a segurar um *ativo diferente*.

Entidades são rastreadas. Valores são comparados. Confundir os dois gera bugs fantasma.`,
    },
    {
      kind: "quiz",
      question: `Qual destes é um **objeto de valor** no domínio Stellar?`,
      options: [
        "Um ativo — código + emissor; dois com campos iguais são a mesma coisa, sem identidade própria",
        "Uma conta — mantém sua identidade enquanto seus saldos mudam por baixo",
        "Um validador — permanece o mesmo nó entre reinicializações e mudanças de IP",
      ],
      answer: 0,
      explain: `As outras duas respostas descrevem coisas reais — mas são *entidades*: identidade que sobrevive a mudanças. O ativo é puro valor: a igualdade é campo a campo, e "qual é o original?" nem faz sentido.`,
    },
    {
      kind: "diagram",
      body: "Dois tipos de coisa, e a pergunta que os separa:",
      caption:
        "Pergunte \"se eu trocar isto por uma cópia idêntica, mudou alguma coisa?\" — não significa valor, sim significa entidade.",
      view: {
        kind: "compare",
        columns: [
          { id: "entity", label: "entidade", tone: "accent" },
          { id: "value", label: "objeto de valor", tone: "teal" },
        ],
        rows: [
          { label: "espécime na Stellar", cells: [{ text: "uma conta (G…)", tone: "accent" }, { text: "um ativo (código + emissor)", tone: "teal" }] },
          { label: "o que torna dois iguais", cells: [{ text: "a mesma identidade", tone: "accent" }, { text: "os mesmos campos", tone: "teal" }] },
          { label: "sobrevive a mudar de estado", cells: [{ text: "sim — saldos se movem, a conta fica", tone: "accent" }, { text: "não — mude o emissor e é outro ativo", tone: "teal" }] },
          { label: "portanto você", cells: [{ text: "rastreia", tone: "accent" }, { text: "compara", tone: "teal" }] },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Agregados: a regra do envelope

Alguns objetos só fazem sentido **juntos**, guardados por uma raiz que impõe as regras. Esse conjunto é um **agregado**.

O Stellar lhe dá um espécime perfeito: o **transaction envelope**. Operações vivem *dentro* de uma transação — assinadas juntas, sequenciadas juntas, e **todas têm sucesso ou falham juntas**. Você não pode retirar a operação #3 e aplicá‑la isoladamente; o envelope é a única porta, contendo assinaturas e número de sequência.

Esse é o padrão de agregado em produção: a consistência é imposta *na fronteira*, de modo que nada interno pode ficar meio‑aplicado.`,
    },
    {
      kind: "theory",
      body: `## O agregado que comeu o sistema

O jeito clássico de errar isto é desenhar o agregado **grande demais**.

Começa razoável: estas coisas precisam ficar consistentes, então põe tudo sob uma raiz. Depois aquelas também. Logo a raiz é "o Ledger", toda mudança precisa passar por ela, e duas operações sem relação nenhuma não conseguem andar ao mesmo tempo porque disputam a mesma guarda. Consistência comprada com uma fila.

A Stellar mostra a contenção. O envelope é um agregado — mas **pequeno**: até cem operações, o número de sequência de uma conta, e nada mais. Ele não guarda o ledger; guarda uma submissão. Os envelopes de todo mundo seguem nos mesmos cinco segundos, intocados.

A regra de bolso: um agregado deve ser o menor conjunto que precisa estar **correto junto**, não o maior conjunto que por acaso é **relacionado**.`,
    },
    {
      kind: "quiz",
      question: `Uma transação Stellar assinada contém cinco operações, e a terceira é a única que importa. Essa operação pode ser aplicada ao ledger sozinha?`,
      options: [
        "Não — operações só são aplicadas através do envelope, e a transação inteira tem sucesso ou falha como um todo",
        "Sim — cada operação tem sua própria assinatura, então cada uma pode ficar independente",
        "Sim — desde que você pague uma taxa separada por essa única operação",
      ],
      answer: 0,
      explain: `O envelope é a raiz do agregado: assinaturas e número de sequência estão vinculados à transação, nunca por operação. Isso é exatamente o que torna swaps atômicos de múltiplas operações seguros — não existe um mundo onde só metade de uma operação seja aplicada.`,
    },
    {
      kind: "fill",
      prompt: `Complete a lei do agregado:`,
      file: "NOTES.md",
      before: `Ops em um envelope `,
      after: ` — a transação é a unidade de consistência.`,
      choices: ["juntas", "independentemente", "por ordem de taxa", "por peso de assinatura"],
      answer: 0,
      explain: `Atomicidade é a promessa completa do agregado. Ordem de taxa e peso de assinatura são conceitos reais do Stellar — mas eles decidem *quando e se* um envelope se aplica, nunca *quais partes* dele se aplicam.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `Essas duas formas deixam de ser abstratas no instante em que você as guarda. No Ato VII da Campanha, uma entidade é o que você busca por **chave** no storage do contrato, e um objeto de valor é um \`#[contracttype]\` que você compara com \`==\`. Errar esse par é como o mesmo ativo acaba guardado sob duas chaves.`,
    },
    {
      kind: "theory",
      body: `## Dentro da fronteira, onde isso mora?

Você já sabe dizer, para um contexto: o que tem identidade, o que é só o próprio valor, e qual conjunto precisa se mover junto.

O que você ainda não sabe dizer é onde cada coisa **fica**. O agregado conhece o banco de dados? O cliente do ledger pode enfiar a mão nas regras de domínio? Essas perguntas têm resposta, e é sempre a mesma.

**A seguir:** a fortaleza, e a única regra que decide para que lado cada dependência pode apontar.`,
    },
  ],
  testOut: [
    { question: `Dois USDC do mesmo emissor. Existe pergunta com sentido do tipo "qual é o original"?`,
      options: ["Não — um ativo é objeto de valor; igualdade é campo a campo e ele não tem identidade própria","Sim — cada token carrega um serial que os distingue","Só se estiverem em contas diferentes"], answer: 0 },
    { question: `Uma conta paga mil vezes. Continua sendo a mesma conta?`,
      options: ["Sim — uma entidade mantém a identidade enquanto o estado muda por baixo","Não — o saldo a define, então saldo mudado é conta mudada","Só se o número de sequência não tiver dado a volta"], answer: 0 },
    { question: `O que faz do envelope de transação um agregado de manual?`,
      options: ["É a única porta de entrada: assinaturas e sequência prendem no envelope, e o conteúdo dele passa ou falha junto","É o maior objeto do protocolo, então contém todo o resto","Ele pode ser dividido nas operações quando só uma delas é necessária"], answer: 0 },
    { question: `Qual é o jeito clássico de desenhar um agregado errado?`,
      options: ["Grande demais — a consistência acaba comprada com uma fila, porque trabalhos sem relação disputam uma raiz só","Pequeno demais — aí toda regra precisa de transação entre várias raízes","Sem raiz, então nada garante as invariantes"], answer: 0 },
  ],
};
