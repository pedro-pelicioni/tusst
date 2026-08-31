import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "O Lado do Emissor",
  tagline: "Qualquer um consegue emitir. O ofício é tudo o que vem depois.",
  steps: [
    {
      kind: "theory",
      body: `## Emitindo um ativo: basta pagá‑lo

Não existe um ritual de “deploy de token” no Stellar clássico. Um **ativo é um par**: um código curto mais o **endereço do emissor** — \`USDC\` da conta da Circle e \`USDC\` de um estranho são ativos diferentes.

Para emitir, o emissor simplesmente **paga** o ativo de sua própria conta para alguém que tenha aberto uma linha de confiança. Esse primeiro pagamento *é* a cunhagem. O suprimento é tudo que o emissor pagou e ainda não recebeu de volta — o livro‑razão rastreia isso automaticamente entre as linhas de confiança.

Qualquer conta pode emitir. A escassez de confiança, não permissão, é o que faz um ativo valer.`,
    },
    {
      kind: "quiz",
      question: `O que é necessário para trazer um ativo totalmente novo à existência no Stellar clássico?`,
      options: [
        "O emissor paga para uma conta que abriu uma linha de confiança — o primeiro pagamento é a cunhagem",
        "Deploy e verificação de um contrato de token, depois registro do ticker no SDF",
        "Stake de XLM proporcional ao suprimento pretendido",
      ],
      answer: 0,
      explain: `Um ativo é identificado por código + emissor, então ele “existe” no momento em que se move pela primeira vez. Contratos só entram na história quando você quer comportamento programável — ou a ponte SAC que espera no final deste capítulo.`,
    },
    {
      kind: "theory",
      body: `## Duas contas, um ativo: higiene do emissor

Emissores sérios separam os papéis:

- A **conta emissora** assina quase nada. Ela cunha pagando a conta de distribuição, depois volta a dormir — chaves frias, superfície de ataque mínima.
- A **conta de distribuição** detém o suprimento em circulação e faz o tráfego diário: clientes, exchanges, caminhos quentes.

Se as chaves de distribuição vazarem, você perde um saldo — não a prensa de impressão. Um emissor pode ir além: bloquear os signatários da conta emissora para que *ninguém* jamais possa emitir novamente, fixando o suprimento máximo para sempre. O próprio livro‑razão torna‑se a auditoria.`,
    },
    {
      kind: "theory",
      body: `## Flags de autorização: emissor como porteiro

Ativos do mundo real carregam leis do mundo real, então um emissor pode definir flags em si mesmo:

- **Auth required** — linhas de confiança começam não autorizadas; o emissor aprova cada detentor (portões KYC).
- **Auth revocable** — o emissor pode congelar uma linha de confiança autorizada, parando aquele saldo frio.
- **Clawback** — o emissor pode recolher o ativo totalmente (ordens judiciais, fundos roubados, pagamentos com erro de digitação).

Essas flags explicam por que instituições reguladas podem emitir em um livro‑razão público: a conformidade é imposta *pelo protocolo*, não por uma promessa em PDF.`,
    },
    {
      kind: "quiz",
      question: `Um emissor regulado descobre que a conta de um detentor foi hackeada. Qual flag permite parar esse saldo de se mover — agora mesmo?`,
      options: [
        "Auth revocable — revoga a autorização da linha de confiança e o saldo fica congelado no lugar",
        "Auth required — bloqueia retroativamente os depósitos anteriores do hacker",
        "Auth immutable — bloqueia todo o ativo para todos",
      ],
      answer: 0,
      explain: `Auth required só controla *novas* linhas de confiança, e auth immutable apenas garante que as flags nunca mudarão. Congelar impede a movimentação; **clawback** vai um passo além e recolhe o ativo de volta ao emissor.`,
    },
    {
      kind: "fill",
      prompt: `Complete a identidade de um ativo clássico — o que faz o USDC ser *o verdadeiro* USDC?`,
      file: "asset-identity.txt",
      before: `asset  =  asset code  +  `,
      after: `   (mesmo código, emissor diferente → ativo diferente)`,
      choices: [
        "o endereço da conta do emissor",
        "o hash Wasm do contrato",
        "um registro global de tickers",
        "a URL da página inicial do anchor",
      ],
      answer: 0,
      explain: `Não há namespace para ocupar. Carteiras resolvem qual \`USDC\` é real via o endereço do emissor — e, como você verá nos Portões do Reino, esse emissor prova sua identidade com um arquivo em seu próprio domínio.`,
    },
    {
      kind: "theory",
      body: `## O Stellar Asset Contract

Ativos clássicos e contratos inteligentes compartilham um mesmo reino, e a ponte é o **Stellar Asset Contract (SAC)**. Qualquer ativo clássico — XLM incluído — pode ser *invocado* como um contrato: um deploy, zero código para escrever, e o ativo agora fala **SEP‑41**, a interface padrão de token Soroban.

Mesmo ativo, mesmo suprimento, um único balanço — mas agora contratos podem mantê‑lo, movê‑lo e construir sobre ele. USDC em um pool de empréstimos e USDC na linha de confiança da avó são o *mesmo USDC*.

Todo protocolo Soroban sério depende dessa ponte diariamente.`,
    },
    { kind: "labLink", labSlug: "oz-token-wizard",
      body: `Tudo nesta página é decisão, não sintaxe. O **Assistente de Token OZ** da Forja te coloca do lado do emissor de verdade, na testnet — e a parte interessante não é que funciona, é que cada escolha que você faz ali é uma escolha que um anchor também faz, com um departamento de compliance junto.` },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `O Ato VI da Campanha — **O Portão da Constelação** — percorre o mesmo terreno a partir de Rust: contas, saldos e linhas de confiança consultados e forjados em código ao invés de prosa. Faça o desvio quando quiser colocar os dedos nas próprias entradas do livro‑razão.

Próximo na jornada: ativos em *movimento* — pagamentos que cruzam moedas no meio do caminho, e uma exchange incorporada ao próprio protocolo.`,
    },
  ],
  testOut: [
    { question: `Como um ativo novo é criado na Stellar?`,
      options: ["Pagando com ele — uma conta emissora simplesmente envia um ativo que nunca teve, e a oferta passa a existir","Publicando um contrato de token que o emite","Registrando o código do ativo na SDF antes do primeiro uso"], answer: 0 },
    { question: `Por que emissores mantêm uma conta de distribuição separada em vez de pagar direto da conta emissora?`,
      options: ["O saldo da conta emissora não significa nada — a oferta é o que ela pagou — então uma conta de distribuição é o que torna a oferta em circulação legível e as chaves do emissor pouco usadas","O protocolo proíbe uma conta emissora de guardar o próprio ativo","Reduz pela metade o custo de reserva das trustlines envolvidas"], answer: 0 },
    { question: `O que as flags de autorização do emissor permitem a ele?`,
      options: ["Controlar quem pode guardar o ativo, e congelar a trustline de um portador específico — controle de que o emissor precisa para operar sob regulação","Reverter pagamentos individuais depois de liquidados","Definir o preço a que o ativo negocia na DEX"], answer: 0 },
    { question: `O que o Stellar Asset Contract dá a um ativo clássico?`,
      options: ["Uma interface de contrato, para um ativo clássico ser usado por contratos Soroban como se fosse um token de contrato","Uma segunda oferta, baseada em contrato, que espelha a clássica","Listagem automática em AMMs baseadas em contrato"], answer: 0 },
  ],
};
