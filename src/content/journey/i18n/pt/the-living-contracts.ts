import type { Concept } from "../types";

export const theLivingContracts: Concept = {
  meta: {
    slug: "the-living-contracts",
    title: "Os Contratos Vivos",
    tagline: "Soroban: Wasm, armazenamento que expira, taxas que fazem sentido.",
    numeral: "VI",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/the-living-contracts.webp",
    glyph: "📦",
  },
  steps: [
    {
      kind: "theory",
      body: `## Contratos entram no reino

**Soroban** é a plataforma de contratos inteligentes da Stellar. Um contrato é **Rust compilado para WebAssembly**, enviado ao ledger e executado dentro de um host sandboxed — todo poder que ele tem (armazenamento, criptografia, chamadas a outros contratos) chega através das **funções de host** que o protocolo fornece.

E aqui está a parte elegante: chamar um contrato não requer um novo formato de transação. O envelope que você analisou carrega uma única operação — \`invoke_host_function\` — e dentro dela está a chamada: qual contrato, qual função, quais argumentos.

Mesmo envelope, mesmas assinaturas, mesmo fechamento em ~5 segundos. O reino clássico e o reino dos contratos compartilham o mesmo fluxo sanguíneo.`,
    },
    {
      kind: "theory",
      body: `## Três prateleiras de armazenamento

Soroban oferece ao contrato três camadas de armazenamento — escolhidas por entrada, com preços diferentes:

- **Temporary** — barato, de curta duração, desaparece para sempre ao expirar. Cotações de preço, nonces, estado com limite de tempo.
- **Persistent** — o verdadeiro arquivo: saldos de usuários, registros de propriedade. Sobrevive à expiração através do *arquivo* (próximo passo).
- **Instance** — pequeno estado colado ao próprio contrato: endereço do admin, configuração, os metadados que toda chamada precisa.

Escolher a prateleira errada é um clássico erro de iniciante: inchaço de instância faz com que cada chamada carregue esse peso, e saldos temporários simplesmente desaparecem. A prateleira *é* parte do design.`,
    },
    {
      kind: "diagram",
      body: "Três prateleiras, três tempos de vida:",
      caption: "Estado é alugado, não possuído. Um contrato em que ninguém toca uma hora para de pagar aluguel e os dados esfriam.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "instance",
            label: "instância",
            note: "As configurações do próprio contrato, que vivem e morrem com ele.",
            tone: "gold",
          },
          {
            id: "persistent",
            label: "persistente",
            note: "Saldos de usuário e tudo que precisa sobreviver. Arquivado se o aluguel vencer — recuperável, não perdido.",
            tone: "accent",
          },
          {
            id: "temporary",
            label: "temporário",
            note: "Barato e de vida curta, para o que pode sumir: nonces, sessões, limites de taxa.",
            tone: "teal",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## O estado tem um batimento cardíaco

A maioria das cadeias deixa o estado se acumular para sempre — cada nó carrega todas as entradas abandonadas desde 2019. A Stellar recusa: **todo entry do Soroban tem um TTL** (time‑to‑live), contado em ledgers, e o aluguel o estende.

Quando o TTL se esgota:

- Entradas **Temporary** são deletadas. Desaparecem.
- Entradas **Persistent** e **instance** são **arquivadas** — removidas do ledger ativo, mas restauráveis depois com uma prova, retornando exatamente como estavam.

Isso é **arquivo de estado**, e nenhuma outra grande cadeia faz isso. O ledger ativo permanece enxuto, os validadores ficam baratos, a história permanece recuperável.`,
    },
    {
      kind: "quiz",
      question: `Seu contrato rastreia o saldo de token de cada usuário. Qual camada de armazenamento?`,
      options: [
        "Persistent — os saldos precisam sobreviver a qualquer lapsus de TTL e ser restauráveis a partir do arquivo",
        "Temporary — é o mais barato, e os usuários podem redepositar se expirar",
        "Instance — os saldos pertencem ao contrato, então viajam com ele",
      ],
      answer: 0,
      explain: `A exclusão temporária é *permanente* — um saldo desaparecido é um rug‑pull por negligência. E o armazenamento de instância carrega em cada chamada, então colocar dados de usuário lá faz todos pagarem por todos.`,
    },
    {
      kind: "fill",
      prompt: `Coloque o saldo na prateleira correta.`,
      file: "token/src/lib.rs",
      before: `env.storage().`,
      after: `().set(&user, &balance);`,
      choices: ["persistent", "temporary", "instance", "eternal"],
      answer: 0,
      explain: `O soroban-sdk espelha as camadas uma a uma: \`env.storage().persistent()\`, \`.temporary()\`, \`.instance()\`. Não existe \`eternal\` — esse é o ponto central do design de aluguel.`,
    },
    {
      kind: "theory",
      body: `## Taxas que são medidas, não leiloadas

Em cadeias de leilão de gás você *dá lances* por espaço de bloco e reza; um mint popular pode multiplicar os custos de todos.

Soroban **mede** em vez disso. Uma transação declara seus **recursos** — instruções de CPU, memória, leituras e escritas no ledger, bytes — e a taxa é *calculada* a partir dessas necessidades mensuradas, mais o aluguel do armazenamento que ela toca. Declare honestamente (a simulação faz isso por você) e a parte reembolsável de qualquer superestima volta para você.

O resultado é um custo que você pode cotar antecipadamente: “esta ação custa cerca de um centavo” continua verdadeiro mesmo quando a rede está ocupada.`,
    },
    {
      kind: "theory",
      body: `## Simule primeiro, assine exatamente isso

Todo cliente Soroban segue um ritmo:

1. **Simule** a chamada contra um nó RPC — sem assinatura, sem custo.
2. A simulação devolve o **footprint** — exatamente quais entradas do ledger a chamada lerá e escreverá — além das estimativas de recursos e da autorização necessária.
3. Você **assina exatamente o que simulou** e submete.

A transação assinada carrega seu footprint, então os validadores conhecem todo o seu mundo antes de executá‑la; nada fora do footprint pode ser tocado. Pular a simulação é adivinhar números que a rede simplesmente rejeitará.`,
    },
    {
      kind: "quiz",
      question: `Por que o fluxo Soroban simula antes de assinar?`,
      options: [
        "A simulação calcula o footprint e as necessidades de recursos, assim você assina uma transação com limites exatos e aplicáveis",
        "É um ensaio cortês para depuração — apps de produção o ignoram",
        "A simulação pré‑executa a chamada para que os validadores não precisem rodá‑la novamente",
      ],
      answer: 0,
      explain: `Os validadores sempre re‑executam — mas apenas dentro do footprint declarado. A simulação é como a transação aprende seus próprios limites; o ledger então os impõe ao byte.`,
    },
    {
      kind: "theory",
      body: `## A interface viaja com o contrato

Um contrato Soroban compilado não é um blob misterioso. A build incorpora uma **spec de contrato** dentro do próprio Wasm: cada função, argumento e tipo, legível por máquina.

As ferramentas bebem direto dela — a CLI pode imprimir a interface de um contrato implantado, e os clientes **geram bindings tipados automaticamente** a partir do Wasm on‑chain. Nada de caçar arquivos ABI JSON, nada de divergência de versão entre o contrato e sua documentação: o ledger *é* a documentação.

Chame um contrato que você nunca viu, com tipos verificados em tempo de compilação. Essa é a experiência de desenvolvedor que a spec proporciona.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `A Forja já tem um lab exatamente para isso: abra o **OpenZeppelin Token Wizard**, configure um contrato de token OZ real e compile-o no runner Soroban da própria Forja — spec, prateleiras de armazenamento e tudo. Quando o runner devolver seu Wasm, este capítulo será a teoria por trás de cada byte.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `O Ato VII da Campanha coloca o borrow checker para trabalhar em tudo isso — você escreve o Rust, compila o Wasm e vê \`invoke_host_function\` levar *seu* código ao ledger. A imersão total está lá sempre que você quiser.

Próximo capítulo, uma reviravolta: contratos tão capazes que deixam de ser apps — e se tornam a **própria conta**.`,
    },
  ],
};
