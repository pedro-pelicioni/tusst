import type { Concept } from "../types";

export const theCleanKeep: Concept = {
  meta: {
    slug: "the-clean-keep",
    title: "A Fortaleza Limpa",
    tagline: "Arquitetura limpa e hexagonal — cada peça em seu lugar.",
    numeral: "IV",
    arc: "craft",
    level: 2,
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/the-clean-keep.webp",
    glyph: "🏰",
  },
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
      kind: "theory",
      body: `## Portas e adaptadores

Como o anel interno *usa* a cadeia sem nomeá‑la? Ele declara uma **porta** — uma interface que o domínio possui, escrita na própria linguagem do domínio:

> PaymentsPort: enviar um pagamento, ler saldo, observar chegada.

Na borda, **adaptadores** implementam a porta: um *adaptador Horizon* hoje, um *adaptador Soroban RPC* para contratos, um *adaptador falso* para testes. Trocar provedores RPC? Um novo adaptador. Migrar testnet → mainnet? Configuração. **O núcleo nunca ouve sobre isso.**

O domínio fala com a porta. O mundo se conecta à porta. Essa é a arquitetura hexagonal em uma frase.`,
    },
    {
      kind: "fill",
      prompt: `A fortaleza fala com a porta, nunca com o fornecedor:`,
      file: "domain/release-escrow.ts",
      before: `constructor(private payments: `,
      after: `) {}`,
      choices: ["PaymentsPort", "HorizonClient", "SorobanServer", "FreighterApi"],
      answer: 0,
      explain: `As outras três são reais e úteis — e pertencem aos adaptadores, atrás da porta. O caso de uso nomeia apenas a interface que possui, por isso um adaptador falso pode ser usado nos testes e um novo provedor RPC nunca toca este arquivo.`,
    },
    {
      kind: "theory",
      body: `## Onde tudo vive

Uma requisição atravessa as muralhas assim:

**UI** (externa) → **caso de uso** (interna) → **porta** (borda interna) → **adaptador** (externo) → rede.

- Componentes React, rotas, estilos — **externo**.
- Postgres, ORM, migrações — **externo**.
- stellar-sdk, clientes RPC, ponte da carteira — **externo**.
- “Liberar fundos somente quando ambos aprovarem” — **interno**, em um módulo que não importa *nada* da lista acima.

O teste de cheiro é mecânico: abra um arquivo do domínio e leia suas importações. Um nome de framework nessa lista indica que uma muralha foi violada.`,
    },
    {
      kind: "theory",
      body: `## A ilha testável

Um núcleo sem importações de framework é uma **ilha pura**: construa‑a em um teste, passe‑a um adaptador falso, verifique o comportamento. Sem rede, sem cadeia dockerizada, sem RPC instável — os testes do rito Vermelho‑Verde rodam em **milissegundos**.

Esse é o retorno silencioso e cumulativo: equipes com fortalezas limpas escrevem mais testes *porque testes são baratos*, e testes baratos significam loops curtos — para humanos e golems alike.

Os adaptadores ainda têm seus próprios testes contra a rede real — uma camada fina e honesta, testada separadamente em sua velocidade mais lenta.`,
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
      kind: "quiz",
      question: `Seu provedor RPC anuncia um desligamento. Em uma fortaleza construída com portas e adaptadores, o que precisa mudar?`,
      options: [
        "Um adaptador, mais a fiação que o seleciona — o domínio e os casos de uso não mudam nada",
        "Todos os casos de uso que enviam um pagamento, já que cada um chama o provedor",
        "As entidades do domínio, já que a URL do endpoint está armazenada nelas",
      ],
      answer: 0,
      explain: `Esse é o ROI da arquitetura em uma linha: a rotatividade do fornecedor tem preço de um adaptador. Se a resposta honesta no seu código é “todos os casos de uso”, as setas de dependência estão apontando na direção errada.`,
    },
    {
      kind: "theory",
      body: `## Pequenas muralhas, pequenos prompts

Aqui está o que a fortaleza lhe oferece na era da IA: **módulos bem delimitados são prompts bem delimitados**.

“Reescreva o adaptador Horizon para o novo RPC — aqui está a porta que ele deve satisfazer, aqui estão seus testes” é uma tarefa que um golem completa *dentro de uma caixa*: o contexto de um pequeno arquivo, um contrato a cumprir, testes a passar, e muralhas que limitam o raio de explosão. O golem reconstrói um cômodo sem jamais percorrer toda a fortaleza.

Próxima disciplina: o próprio golem — e o banco que você deve construir ao seu redor.`,
    },
  ],
};
