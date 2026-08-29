import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "OpenZeppelin Token Wizard",
    tagline: "Escolha extensões, gere Rust de verdade e publique seu próprio token.",
  },
  steps: {
    "intro": {
      body: `## Não forje sozinho

Os ferreiros de verdade não fundem seu próprio ferro para cada lâmina. No Stellar, contratos de token são forjados a partir dos blocos auditados da **OpenZeppelin** — as mesmas bibliotecas testadas em batalha que protegem bilhões em cadeias, portadas para Soroban como \`stellar-tokens\`.

Nos próximos minutos você vai **escolher as extensões**, verá a Forja montar **Rust de verdade** a partir delas, vai **compilar** o código em um runner isolado, **publicar o Wasm** na testnet com sua própria assinatura e **cunhar** a oferta inicial.

Sem mockups. O mesmo pipeline que o IDE em modo livre usa.`,
    },
    "sigil": {
      title: "Convoque seu sigilo",
      body: `Publicar um contrato exige uma assinatura, e a assinatura exige seu par de chaves. Se você já criou um no lab de carteira, a Forja vai reutilizá-lo; caso contrário, um novo será criado agora.`,
      cta: "Preparar o par de chaves",
      successBody: `Seu sigilo responde:

\`{address}\`

Todas as próximas transações — a publicação e a cunhagem — levarão essa assinatura.`,
    },
    "fund": {
      title: "Alimente a conta",
      body: `Publicações e invocações pagam pequenas taxas de recurso, então a conta precisa existir e ter saldo. O Friendbot a financia; se ela já estiver abastecida, a Forja simplesmente a reutiliza.`,
      cta: "Financiar com Friendbot",
      successBody: `A conta está ativa, com {balance} XLM disponíveis. Saldo suficiente para muitas publicações.`,
    },
    "name": {
      prompt: `## Nomeie sua criação

O **nome** do token é um metadado exibido ao usuário e gravado on-chain pelo construtor — carteiras e exploradores vão mostrá-lo.`,
      placeholder: "Forge Gold",
      hint: "2–24 caracteres",
    },
    "symbol": {
      prompt: `## Dê um símbolo

O ticker curto — o que aparece em saldos e pares de negociação.`,
      placeholder: "FGOLD",
      hint: "2–12 letras/dígitos, começa com letra",
    },
    "supply": {
      prompt: `## Defina a oferta inicial

Cunhada para **você** pelo construtor, em tokens inteiros. Seu token usa **7 casas decimais** — a convenção da Stellar —, então o contrato armazena o valor × 10⁷ internamente.`,
      placeholder: "1000",
      hint: "1 a 999.999.999 tokens inteiros",
    },
    "ext-pausable": {
      prompt: `## Extensão: Pausável?

Um token **pausável** tem um freio de emergência: o proprietário pode congelar transferências e mintagens enquanto um incidente é investigado, depois despausar. Emitentes regulados quase sempre querem isso; uma meme coin pode preferir a pureza sem freios.`,
      options: [
        {
          label: "Sim — adicione o freio de emergência",
          value: "yes",
          blurb: "O proprietário pode pausar/despausar cada transferência, mint e burn.",
        },
        {
          label: "Não — sem pausa por design",
          value: "no",
          blurb: "Não existe interruptor de pausa. Ninguém pode congelá-lo, inclusive você.",
        },
      ],
    },
    "ext-burnable": {
      prompt: `## Extensão: Queimável?

Um token **queimável** permite que os detentores destruam suas próprias unidades, reduzindo a oferta total — útil para fluxos de resgate ("queime o voucher, receba os bens") e designs deflacionários.`,
      options: [
        {
          label: "Sim — os detentores podem queimar",
          value: "yes",
          blurb: "Adiciona burn e burn_from da extensão queimável da OpenZeppelin.",
        },
        {
          label: "Não — a oferta só cresce",
          value: "no",
          blurb: "Nenhum ponto de entrada de queima é compilado.",
        },
      ],
    },
    "quiz-oz": {
      question: `Por que o wizard monta seu token a partir dos blocos da OpenZeppelin em vez de escrever Rust novo do zero?`,
      options: [
        "Código auditado, amplamente revisado com uma interface padrão supera código novo nas partes que todo token compartilha",
        "Escrever um token do zero é impossível em Rust",
        "Contratos da OpenZeppelin são o único código que a rede Stellar aceitará",
      ],
      explain: `A rede executa qualquer Wasm válido — mas a lógica de token é exatamente onde um bug sutil custa dinheiro real, e onde os padrões (SEP-41) tornam seu token legível por todas as carteiras e DEX. Novidade é para seu produto, não para a tubulação do token.`,
    },
    "build": {
      title: "Gere o Rust e compile",
      body: `A Forja agora monta **{name} ({symbol})** a partir de suas escolhas — Rust de verdade \`stellar-tokens\`, vinculado às mesmas versões auditadas que o IDE usa — e compila para **WebAssembly** em um runner isolado. Uma compilação real leva um ou dois minutos; acompanhe.`,
      cta: "Compilar para Wasm",
      successBody: `O runner devolveu seu contrato como um **blob Wasm** — o Rust foi transformado para a máquina virtual do ledger.

Observe o que NÃO aconteceu: seu nome, símbolo e oferta não estão embutidos no código. Eles viajam como **argumentos do construtor** na próxima etapa, então o mesmo Wasm verificado pode gerar mil tokens diferentes.`,
    },
    "deploy": {
      title: "Publique na testnet",
      body: `São duas transações, ambas assinadas por você: primeiro o Wasm é **carregado** no ledger; depois, uma **instância do contrato** é criada a partir dele. O \`__constructor\` roda uma vez com o nome, o símbolo e a oferta e cunha tudo para seu endereço.`,
      cta: "Publicar e executar o construtor",
      successBody: `**{symbol} vive.** Endereço do contrato:

\`{contract}\`

Esse endereço agora responde às chamadas SEP-41 — \`balance\`, \`transfer\`, \`name\` — feitas por qualquer carteira, explorador ou contrato. Ele também apareceu no painel **Interact** do IDE da Forja: é a mesma Forja e são as mesmas publicações.`,
    },
    "mint": {
      title: "Cunhe uma rodada extra",
      body: `O construtor já cunhou a oferta inicial para você. Agora invoque o contrato publicado diretamente: a Forja consulta a **spec on-chain**, monta uma chamada \`mint\`, **simula** a transação e pede que você assine a versão real — o mesmo fluxo de simular e depois assinar usado por todas as dApps Soroban.`,
      cta: "Cunhar mais 25 {symbol}",
      successBody: `Cunhagem concluída: mais 25 {symbol} no seu saldo. A operação foi autorizada porque o contrato verificou \`owner.require_auth()\` e **você é o proprietário**.

Qualquer outro que invoque \`mint\` é rejeitado pela mesma linha. Isso é controle de acesso on‑chain, reforçado pelo código que você escolheu.`,
    },
    "quiz-sep41": {
      question: `Seu token implementa SEP-41. O que isso lhe traz?`,
      options: [
        "Toda carteira, DEX e contrato que fala a interface padrão pode armazenar, exibir e mover — sem integração customizada",
        "Listagem em todas as exchanges, automaticamente",
        "Imunidade a bugs — o padrão é auditado, então as implementações também",
      ],
      explain: `Um padrão é uma linguagem compartilhada, não um acordo de marketing nem uma garantia de segurança. SEP-41 significa que seu token responde às chamadas que o ecossistema já sabe fazer — por isso o wizard usa o padrão em vez de inventar novos pontos de entrada.`,
    },
    "claim": {
      body: `O ledger guarda seu Wasm, seu contrato e um saldo cunhado para seu sigilo. Antes de liberar a recompensa, a Forja consultará a própria cadeia — **simulando \`balance(you)\` no seu contrato** — Prova, não promessa.`,
    },
  },
} satisfies LabTextOverlay;
