import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Soroban: contratos na Stellar",
  tagline: "Soroban: Wasm no ledger, e três prateleiras para pôr estado.",
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
      body: `## A interface viaja com o contrato

Um contrato Soroban compilado não é um blob misterioso. A build incorpora uma **spec de contrato** dentro do próprio Wasm: cada função, argumento e tipo, legível por máquina.

As ferramentas bebem direto dela — a CLI pode imprimir a interface de um contrato implantado, e os clientes **geram bindings tipados automaticamente** a partir do Wasm on‑chain. Nada de caçar arquivos ABI JSON, nada de divergência de versão entre o contrato e sua documentação: o ledger *é* a documentação.

Chame um contrato que você nunca viu, com tipos verificados em tempo de compilação. Essa é a experiência de desenvolvedor que a spec proporciona.`,
    },
    {
      kind: "quiz",
      question: `Você vai guardar o nonce de sessão de um usuário, que não significa nada alguns minutos depois de emitido. Qual prateleira?`,
      options: [
        "Temporária — o aluguel mais barato, e esquecer é exatamente o que você quer",
        "Persistente, para poder ser restaurado se uma chamada chegar atrasada",
        "De instância, para sumir se o contrato um dia for arquivado",
      ],
      answer: 0,
      explain: `Casar a prateleira com o tempo de vida real do dado é a decisão de projeto inteira, e é uma que as pessoas erram na direção que parece segura: pôr dado de vida curta na prateleira persistente custa mais para sempre, por uma garantia de que o dado nunca precisou.`,
    },
    {
      kind: "fill",
      prompt: `Complete o que um contrato publicado carrega junto:`,
      file: "NOTES.md",
      before: `Quem chama não precisa da sua documentação para invocar um contrato, porque a `,
      after: ` dele pode ser lida do próprio código publicado.`,
      choices: ["interface", "código-fonte", "endereço do autor", "relatório de auditoria"],
      answer: 0,
      explain: `O fonte não está no ledger — Wasm compilado está — e nem endereço nem auditoria dizem a uma ferramenta quais funções existem ou o que elas recebem. A interface viajar junto com o código é o motivo de ferramentas conseguirem montar uma chamada contra um contrato que ninguém documentou.`,
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
    { kind: "theory", body: `## Nada aqui é de graça

Você já sabe dizer o que é um contrato Soroban, onde os dados dele moram, e como qualquer um o chama sem precisar da sua documentação.

O que nada disso te disse é a parte que tira o sono de times: **estado é alugado, não possuído.** Toda entrada em toda prateleira tem um relógio, e as prateleiras diferem em exatamente uma coisa que importa — o que acontece quando um relógio chega a zero.

Errar isso não parece um bug. Parece um contrato que funcionou por seis meses e aí, numa terça-feira, começou a responder que o dado não existe.

**A seguir:** a pulsação, e a conta.` },
  ],
  testOut: [
    { question: `O que é um contrato Soroban, no ledger?`,
      options: ["Wasm compilado guardado no ledger, com um endereço, invocado por uma operação de transação como qualquer outro verbo","Um script que os validadores interpretam a partir do fonte na hora da chamada","Um serviço fora da chain que o protocolo aciona quando precisa"], answer: 0 },
    { question: `Por que o Soroban oferece três tipos separados de armazenamento em vez de um?`,
      options: ["Dados diferentes têm valor diferente ao longo do tempo, e as prateleiras os precificam e expiram de formas diferentes","Cada tipo é otimizado para um tamanho de dado diferente","Contratos antigos usam um tipo e os novos usam outro"], answer: 0 },
    { question: `O que significa a interface viajar junto com o contrato?`,
      options: ["A spec do contrato é legível a partir do próprio código publicado, então ferramentas conseguem chamá-lo sem documentação externa","A interface fica registrada num diretório público mantido pela SDF","Quem chama precisa receber uma biblioteca cliente do autor do contrato"], answer: 0 },
    { question: `Onde uma chamada de contrato viaja?`,
      options: ["Dentro do mesmo envelope de transação que você já conhece, como uma operação invoke_host_function","Num canal separado só para contratos, com consenso próprio","Direto para um validador por RPC, contornando o ledger"], answer: 0 },
  ],
};
