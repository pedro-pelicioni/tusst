import type { Concept } from "../types";

export const theRedGreenRite: Concept = {
  meta: {
    slug: "the-red-green-rite",
    title: "O Rito Vermelho-Verde",
    tagline: "TDD: testes primeiro, forja depois.",
    numeral: "II",
    arc: "craft",
    level: 1,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-red-green-rite.webp",
    glyph: "🟥",
  },
  steps: [
    {
      kind: "theory",
      body: `## A especificação ganha dentes

No Capítulo I você aprendeu a escrever o que *certo* significa. Um **teste** é essa frase tornada executável — uma especificação que a máquina reavalia em milissegundos, toda vez, para sempre.

Isso importa *mais* com IA, não menos. Um golem pode discutir seu texto, reinterpretar sua intenção, “melhorar” seus requisitos. Ele não pode discutir \`assert_eq!\`. **Testes são a especificação que a máquina não pode contestar** — o único lugar onde uma resposta plausível e uma resposta correta deixam de ser confundíveis.

Escreva‑os **primeiro**, e toda forja que vier depois será avaliada desde o nascimento.`,
    },
    {
      kind: "theory",
      body: `## O rito: vermelho, verde, refatorar

TDD é um rito de três batidas, e a ordem é o ponto crucial:

1. **Vermelho** — escreva um teste pequeno para um comportamento que ainda não existe. Execute‑o. **Observe a falha.**
2. **Verde** — escreva o código mais simples que faça o teste passar. Não o mais inteligente. O mais simples.
3. **Refatorar** — agora, com a rede em verde, deixe o código limpo. Os testes protegem você enquanto faz as mudanças.

Vermelho prova que o teste pode capturar o bug que ele protege. Verde prova que o comportamento existe. Refatorar é onde o código bom realmente nasce — *com segurança*.`,
    },
    {
      kind: "diagram",
      body: "Três movimentos, para sempre:",
      caption: "A ordem É a disciplina: um teste escrito depois do código só prova que o código faz o que faz.",
      view: {
        kind: "flow",
        layout: "cycle",
        play: true,
        nodes: [
          {
            id: "red",
            label: "vermelho",
            note: "Escreva a prova primeiro e veja ela falhar. Um teste que nunca falhou não prova nada.",
            tone: "bad",
          },
          {
            id: "green",
            label: "verde",
            note: "A menor mudança que faz passar. Não a elegante — a menor.",
            tone: "good",
          },
          {
            id: "refactor",
            label: "refatorar",
            note: "Agora deixe bom, com a prova segurando o comportamento parado enquanto você mexe.",
            tone: "accent",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Seu par de IA entrega uma funcionalidade *e* um novo teste para ela. Você roda a suíte: tudo fica verde na primeira tentativa. O que ainda falta ao rito?`,
      options: [
        "Quebrar a funcionalidade (ou revertê‑la) e observar o novo teste ficar vermelho — um teste que nunca falhou pode não estar testando nada",
        "Nada — verde na primeira execução é o melhor resultado possível",
        "Executar a suíte mais algumas vezes para garantir que o verde está estável",
      ],
      answer: 0,
      explain: `Quando o mesmo golem forja tanto o código quanto seus testes, um teste que afirma pouco demais permanece verde para sempre. Vermelho é a única prova de que um teste tem dentes — uma quebra deliberada mostra que ele realmente morde.`,
    },
    {
      kind: "theory",
      body: `## Anatomia de um bom teste

Um bom teste unitário segue três passos — **arrange, act, assert**:

- **Arrange** — monte o mundo: um escrow contendo um depósito, prazo já expirado.
- **Act** — faça *uma* coisa: o comprador solicita reembolso.
- **Assert** — verifique *um* comportamento: o saldo do comprador aumentou em relação ao depósito.

Um comportamento por teste, e um nome que o descreva: \`refund_after_deadline_returns_deposit\`. Quando esse teste falha, a falha *é* o diagnóstico — sem necessidade de arqueologia.`,
    },
    {
      kind: "quiz",
      question: `Um único teste deposita, aprova, libera, reembolsa e ainda verifica quatro comportamentos diferentes. Hoje ele está vermelho. Qual o real problema desse teste?`,
      options: [
        "Quando falha você não consegue dizer qual comportamento quebrou — um teste com muitos comportamentos transforma cada falha em arqueologia",
        "Nada — mais asserções por teste sempre significam mais proteção",
        "É lento demais — a solução é mesclá‑lo com outros testes em um ainda maior",
      ],
      answer: 0,
      explain: `Cobertura não é o problema — diagnóstico é. Quatro testes focados capturam os mesmos bugs, e o que fica vermelho *nomeia* o comportamento quebrado gratuitamente.`,
    },
    {
      kind: "theory",
      body: `## De exemplos a invariantes

Um teste de exemplo fixa um ponto: *esta* entrada, *aquele* resultado. **Pensamento estilo propriedade** fixa uma lei: algo que deve valer para *todas* as entradas.

Suas invariantes do Capítulo I são exatamente essas leis:

> escrow balance = deposits − releases − refunds

Afirme‑as após *cada* operação que seus testes realizam — depósito, liberação, reembolso, ordens estranhas — e você terá um fio de segurança por todo o espaço de estado, não uma cerca ao redor de um único exemplo. Cada invariante da sua especificação merece ao menos uma asserção que nunca deixa de ser verificada.`,
    },
    {
      kind: "fill",
      prompt: `Transforme a invariante do Capítulo I em um teste executável:`,
      file: "escrow_test.rs",
      before: `assert_eq!(escrow.balance(), deposits - releases - `,
      after: `);`,
      choices: ["refunds", "fees", "interest", "gas"],
      answer: 0,
      explain: `O mesmo anel de ferro do Capítulo I, agora com dentes: o dinheiro sai do escrow apenas como liberações ou reembolsos. Escrito como asserção, a máquina o verifica a cada forja — grátis, para sempre.`,
    },
    {
      kind: "theory",
      body: `## Aceitando o trabalho do golem sem medo

Aqui está a recompensa. Uma IA entrega 300 linhas. Sem testes, suas opções são *ler cada linha com muito cuidado* ou *confiar*. Ambas falham em escala.

Com uma suíte escrita antes, a aceitação se torna mecânica: **vermelho — rejeitar**, com a falha como feedback. **verde — aceitar**, e ler por estilo quando quiser.

A mesma rede torna a refatoração destemida — a sua *e* a do golem. “Reescreva este módulo, mantenha os testes verdes” é uma instrução segura *apenas porque* os testes existem e o golem não os escreveu para se adequar ao próprio código.`,
    },
    {
      kind: "quiz",
      question: `O golem se gaba de **100 % de cobertura de linhas**. O que você realmente aprendeu?`,
      options: [
        "Todas as linhas foram executadas nos testes — o que não diz nada sobre quanto comportamento as asserções realmente verificam",
        "O código está correto — cada linha foi exercida e passou",
        "A suíte está concluída — acima de 100 % não há mais nada que valha a pena testar",
      ],
      answer: 0,
      explain: `Cobertura conta linhas executadas, não promessas cumpridas. Uma suíte pode tocar todas as linhas e quase não afirmar nada. Persiga comportamentos e invariantes; deixe a cobertura ser um subproduto, nunca o objetivo.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "rust-fundamentals-1",
      body: `Um segredo da Campanha: **cada escaramuça é avaliada por testes ocultos** — você forja, os testes julgam, vermelho ou verde. A Campanha *é* TDD jogado como um jogo, e você está dentro do rito desde sua primeira escaramuça. Próxima disciplina: desenhar as fronteiras onde uma palavra muda de sentido — o mapa de que toda especificação depende.`,
    },
  ],
};
