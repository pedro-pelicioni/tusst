import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "As Portas da Própria Fortaleza",
  tagline: "Portas e adaptadores — o domínio declara a porta, o mundo se encaixa nela.",
  steps: [
    {
      kind: "theory",
      body: `## Portas e adaptadores

Como o anel interno *usa* a cadeia sem nomeá‑la? Ele declara uma **porta** — uma interface que o domínio possui, escrita na própria linguagem do domínio:

> PaymentsPort: enviar um pagamento, ler saldo, observar chegada.

Na borda, **adaptadores** implementam a porta: um *adaptador Horizon* hoje, um *adaptador Soroban RPC* para contratos, um *adaptador falso* para testes. Trocar provedores RPC? Um novo adaptador. Migrar testnet → mainnet? Configuração. **O núcleo nunca ouve sobre isso.**

O domínio fala com a porta. O mundo se conecta à porta. Essa é a arquitetura hexagonal em uma frase.`,
    },
    {
      kind: "diagram",
      body: "Uma requisição, atravessando todos os muros:",
      caption:
        "A seta se inverte na porta. Tudo à esquerda dela é a linguagem da própria fortaleza; tudo à direita é a de outra pessoa.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          { id: "ui", label: "ui", note: "Fora. Coleta a intenção e chama para dentro. Não tem regra própria.", tone: "neutral" },
          { id: "usecase", label: "caso de uso", note: "Dentro. Decide o que precisa acontecer, nas palavras do domínio.", tone: "accent" },
          { id: "port", label: "porta", note: "A borda interna — uma interface que o DOMÍNIO possui e nomeia. É esta a porta.", tone: "gold" },
          { id: "adapter", label: "adaptador", note: "Fora. Implementa a porta na linguagem do fornecedor, e traduz de volta.", tone: "teal" },
          { id: "network", label: "rede", note: "Horizon, RPC, um banco, um dublê nos testes. Trocável por construção.", tone: "good" },
        ],
      },
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
      body: `## A porta que vaza

Uma porta pode satisfazer a regra de dependência e ainda assim traí-la. Olhe:

> \`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`

Nada aqui importa um adaptador — a seta continua apontando para o lado certo, e o linter está feliz. Mas a *assinatura* fala a linguagem do fornecedor. O domínio agora pensa em \`TransactionBuilder\`, e todo caso de uso que toca nesta porta aprendeu, caladinho, um tipo do Horizon.

Troque o provedor e a interface muda. O que significa que todos os chamadores mudam. Que era exatamente a coisa que a porta existia para evitar.

**Uma porta pertence ao domínio, então precisa ser escrita nas palavras do domínio:**

> \`PaymentsPort.send(to: AccountId, amount: Money): Promise<PaymentReceipt>\`

O trabalho inteiro do adaptador é a tradução entre esses dois vocabulários. Se nada está sendo traduzido na borda, a borda não está fazendo nada — e a porta é um buraco.`,
    },
    {
      kind: "theory",
      body: `## A ilha testável

Um núcleo sem importações de framework é uma **ilha pura**: construa‑a em um teste, passe‑a um adaptador falso, verifique o comportamento. Sem rede, sem cadeia dockerizada, sem RPC instável — os testes do rito Vermelho‑Verde rodam em **milissegundos**.

Esse é o retorno silencioso e cumulativo: equipes com fortalezas limpas escrevem mais testes *porque testes são baratos*, e testes baratos significam loops curtos — para humanos e golems alike.

Os adaptadores ainda têm seus próprios testes contra a rede real — uma camada fina e honesta, testada separadamente em sua velocidade mais lenta.`,
    },
    {
      kind: "theory",
      body: `## A troca, contada

Um time com a fortaleza limpa migra do Horizon para um provedor de RPC Soroban. Este é o diff inteiro, por arquivo:

- **\`adapters/soroban-rpc.ts\`** — novo, ~120 linhas. Implementa a \`PaymentsPort\`, traduz os erros do provedor para os tipos de erro do próprio domínio.
- **\`wiring/container.ts\`** — uma linha mudada, escolhendo qual adaptador construir.
- **\`adapters/soroban-rpc.test.ts\`** — novo, testado contra a rede real, na velocidade mais lenta dele.

E a lista de arquivos que **não** mudaram: toda entidade, todo caso de uso, todo teste de domínio. Não porque alguém tomou cuidado durante a migração — mas porque nada lá dentro conseguia nomear o provedor antigo, para começo de conversa.

É para isso que a arquitetura serve de verdade. Não elegância: **o roadmap de um fornecedor precificado em um arquivo e uma linha.**`,
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
      kind: "exercise",
      mode: "spec-write",
      brief: `## A prova do examinador: declare as portas

Um caso de uso, dito nas palavras do domínio:

> **Liberar um escrow.** Quando as duas partes aprovaram e o prazo não passou, o valor em custódia vai para o vendedor e o escrow é fechado. Se o prazo passou e só uma parte aprovou, o valor volta para o comprador.

Declare as **portas** que este caso de uso precisa — as portas que o domínio possui. Para cada uma: para que serve, e o formato do que entra e do que volta, **no vocabulário do domínio**. Depois nomeie um adaptador que você escreveria para cada uma, e uma coisa que esse adaptador precisa traduzir.`,
      rubric: `1. Declara ao menos duas portas, cada uma com um propósito declarado.
2. As entradas e saídas de cada porta são nomeadas em termos de DOMÍNIO — sem tipos de fornecedor, sem nomes de classe de SDK, sem vocabulário de HTTP ou SQL.
3. Nomeia ao menos um adaptador concreto por porta.
4. Diz ao menos uma coisa que um adaptador precisa traduzir entre o vocabulário do fornecedor e o do domínio.
5. A decisão do próprio caso de uso (quem recebe os fundos, e quando) fica no caso de uso — não é delegada a uma porta.`,
      minChars: 180,
    },
    {
      kind: "theory",
      body: `## Pequenas muralhas, pequenos prompts

Aqui está o que a fortaleza lhe oferece na era da IA: **módulos bem delimitados são prompts bem delimitados**.

“Reescreva o adaptador Horizon para o novo RPC — aqui está a porta que ele deve satisfazer, aqui estão seus testes” é uma tarefa que um golem completa *dentro de uma caixa*: o contexto de um pequeno arquivo, um contrato a cumprir, testes a passar, e muralhas que limitam o raio de explosão. O golem reconstrói um cômodo sem jamais percorrer toda a fortaleza.

Próxima disciplina: o próprio golem — e o banco que você deve construir ao seu redor.`,
    },
  ],
  testOut: [
    { question: `Como o anel de dentro usa a chain sem nomeá-la?`,
      options: ["Ele declara uma porta — uma interface que o domínio possui e escreve nas próprias palavras — e um adaptador a implementa na borda","Ele importa o SDK mas embrulha cada chamada num try/catch para conter o acoplamento","Ele chama o adaptador direto, já que adaptadores são assunto do anel de fora"], answer: 0 },
    { question: `\`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`. A seta aponta para dentro. O que ainda está errado?`,
      options: ["A assinatura fala a linguagem do fornecedor, então trocar de provedor muda a interface e todos os chamadores junto","Nada — a regra de dependência está satisfeita e esse é o teste inteiro","Ela retorna uma Promise, o que acopla o domínio ao runtime assíncrono"], answer: 0 },
    { question: `Seu provedor de RPC anuncia que vai fechar. Numa fortaleza com portas e adaptadores, o que muda?`,
      options: ["Um adaptador, mais a fiação que o seleciona — o domínio e os casos de uso não mudam em nada","Todo caso de uso que envia pagamento, já que cada um chama o provedor","As entidades de domínio, já que o endpoint está guardado nelas"], answer: 0 },
    { question: `Por que um núcleo sem framework deixa o laço do Rito mais barato?`,
      options: ["Ele se constrói num teste com um adaptador dublê e afirma em milissegundos — sem rede, sem container, sem instabilidade","Ele compila num binário menor, então o runner de testes inicia mais rápido","Ele elimina a necessidade de testes de adaptador, cortando a suíte pela metade"], answer: 0 },
  ],
};
