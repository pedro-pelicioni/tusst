import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Clean architecture",
  tagline: "Clean architecture: dependências de código-fonte apontam para dentro, só.",
  steps: [
    {
      kind: "theory",
      body: `## A fortaleza e suas muralhas

Arquitetura é uma decisão tomada muitas vezes: **o que pode depender de quê**.

Imagine uma fortaleza. No **anel interno** vivem suas *entidades* e *casos de uso* — as regras que tornam seu dApp seu: quem pode liberar fundos, quando um reembolso é devido. No **anel externo** vive o mundo em mudança: a UI, o banco de dados, o SDK da cadeia, a carteira.

A **regra de dependência** é a única lei da fortaleza: *as dependências de código‑fonte apontam para dentro, apenas*. O anel externo pode referenciar o interno. O anel interno nunca — *nunca* — referencia o externo.`,
    },
    {
      kind: "theory",
      body: `## Por que para dentro?

Porque os dois anéis envelhecem de forma diferente. Frameworks giram: versões maiores do SDK chegam, bibliotecas de UI sobem e caem, bancos de dados são trocados. **Regras de negócio sobrevivem a tudo isso** — “ambas as partes devem aprovar” ainda será verdade em qualquer framework que a hospede daqui a cinco anos.

Se seu domínio importa o SDK da cadeia, toda mudança quebradora do SDK vira uma migração *do domínio* — seu código que muda mais devagar fica refém da sua dependência que muda mais rápido. Aponte as setas para dentro e a rotatividade fica no anel externo, onde é barata.

A fortaleza é o ponto. Frameworks são mobília.`,
    },
    {
      kind: "diagram",
      body: "O forte, de fora para dentro:",
      caption: "Toda seta aponta para dentro. O domínio nunca fica sabendo o nome de um banco de dados.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "infra",
            label: "infraestrutura",
            note: "Postgres, Horizon, o sistema de arquivos, o relógio. Substituíveis por definição.",
            tone: "neutral",
          },
          {
            id: "adapters",
            label: "adaptadores",
            note: "Traduzem o mundo de fora para as formas que o de dentro já fala.",
            tone: "teal",
          },
          {
            id: "app",
            label: "aplicação",
            note: "Casos de uso: a sequência de movimentos do domínio que responde a um pedido.",
            tone: "accent",
          },
          {
            id: "domain",
            label: "domínio",
            note: "As regras que continuariam verdadeiras no papel. Ele não importa nada.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "dependency-rule",
      body: `A lei tem uma forma, e prosa não consegue desenhá-la. **Ligue alguns imports** e veja onde os legais caem — depois rompa um muro de propósito e leia o que isso te custa.`,
    },
    {
      kind: "theory",
      body: `## Toda brecha foi razoável

Ninguém quebra a regra por maldade. Quebra numa terça-feira, por um bom motivo, com prazo em cima.

O caso de uso do escrow precisa da sequência atual do ledger para decidir se o prazo passou. O número está a uma chamada de \`server.ledgers()\` de distância. Escrever uma porta para isso significa uma interface, um adaptador, um dublê para os testes — vinte minutos por um número que está *bem ali*. Então o SDK é importado para dentro do domínio, com um comentário prometendo limpar depois.

Oito meses adiante, esse único import fez três coisas. O domínio não compila mais sem um cliente de rede. Os testes do caso de uso passaram a exigir um nó rodando, então ficaram lentos, então foram pulados. E saiu a versão maior do SDK, o que agora significa uma migração **de domínio**.

Os vinte minutos foram reais. Os juros também.

A regra se paga exatamente nos dias em que parece burocracia — porque no dia em que ela parecer necessária, o custo já foi pago.`,
    },
    {
      kind: "quiz",
      question: `Três importações de um dApp Stellar. Qual delas **quebra a regra de dependência**?`,
      options: [
        "domain/escrow.ts importa @stellar/stellar-sdk para montar uma transação",
        "adapters/horizon.ts importa a interface PaymentsPort do domínio, a fim de implementá‑la",
        "ui/ReleaseButton.tsx importa o caso de uso de liberação do domínio, a fim de chamá‑lo",
      ],
      answer: 0,
      explain: `As outras duas são o anel externo nomeando o interno — a regra funcionando exatamente como projetada. O domínio importando o SDK é o interno nomeando o externo: agora os cômodos mais profundos da fortaleza tremem a cada versão maior lançada pelo fornecedor.`,
    },
    {
      kind: "quiz",
      question: `Onde está o cheiro?`,
      options: [
        "Um componente React que decide por si mesmo se os fundos em escrow podem ser liberados, e então renderiza o botão",
        "Um caso de uso que depende de uma interface PaymentsPort e orquestra a liberação",
        "Um adaptador que traduz códigos de erro do Horizon para os tipos de erro próprios do domínio",
      ],
      answer: 0,
      explain: `Uma regra de negócio vivendo na UI fica invisível aos testes do núcleo e se duplica na próxima tela que precisar dela. Seu gêmeo espelhado é SQL dentro do domínio — o anel interno alcançando para fora. Regras para o núcleo, tradução para a borda.`,
    },
    {
      kind: "fill",
      prompt: `O teste é mecânico — abra um arquivo de domínio e leia os imports:`,
      file: "domain/release-escrow.ts",
      before: `Um nome de framework ou de fornecedor nessa lista de imports significa que `,
      after: ` .`,
      choices: [
        "um muro foi rompido",
        "o arquivo precisa de um comentário explicando por quê",
        "o import deveria ser carregado sob demanda",
        "a versão do framework está desatualizada",
      ],
      answer: 0,
      explain: `Você não precisa de julgamento para este — e é esse o ponto: é grep. Um arquivo de domínio que nomeia \`@stellar/stellar-sdk\`, um ORM ou um hook de React já perdeu a discussão, por mais razoável que tenha sido o motivo na época.`,
    },
    {
      kind: "theory",
      body: `## A lei, e o mecanismo que falta

Você já consegue dizer para que lado cada seta precisa apontar, e conferir qualquer arquivo em segundos.

O que você ainda não consegue dizer é como o anel de dentro **faz** alguma coisa. Ele não pode nomear o SDK da chain — mas um pagamento ainda precisa ser enviado. Não pode saber de banco de dados — mas o escrow ainda precisa ser guardado em algum lugar. Uma lei que torna impossível a coisa útil não é uma lei que alguém cumpre.

**A seguir:** as portas que a fortaleza constrói nos próprios muros, e quem tem permissão de ficar do lado de fora delas.`,
    },
  ],
  testOut: [
    { question: `Enuncie a regra de dependência.`,
      options: ["Dependências de código-fonte apontam só para dentro — o anel de fora pode nomear o de dentro, nunca o contrário","Cada camada pode depender da camada imediatamente abaixo, e não além","Dependências apontam para o módulo que muda com menos frequência"], answer: 0 },
    { question: `Por que para dentro e não para fora?`,
      options: ["Frameworks se agitam e regras de negócio os sobrevivem — apontar para fora deixa seu código mais lento refém da sua dependência mais rápida","Módulos internos são menores, então compilam mais rápido sem imports","É uma convenção que facilita desenhar grafos de dependência automáticos"], answer: 0 },
    { question: `Qual import quebra a regra?`,
      options: ["domain/escrow.ts importando o SDK da chain para montar uma transação","adapters/horizon.ts importando uma interface do domínio para implementá-la","ui/ReleaseButton.tsx importando um caso de uso para chamá-lo"], answer: 0 },
    { question: `Um componente React decide se os fundos do escrow podem ser liberados e então renderiza o botão. Qual é o problema?`,
      options: ["Uma regra de negócio na UI é invisível para os testes do núcleo, e a próxima tela que precisar dela vai duplicá-la","Nenhum — decidir perto do render mantém o código junto","Só a performance: a checagem roda de novo a cada render"], answer: 0 },
  ],
};
