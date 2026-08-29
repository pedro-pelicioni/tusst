import type { Concept } from "../types";

export const accountsTrustAndAssets: Concept = {
  meta: {
    slug: "accounts-trust-and-assets",
    title: "Contas, Confiança e Ativos",
    tagline: "Reservas, linhas de confiança e como nasce qualquer ativo.",
    numeral: "III",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/accounts-trust-and-assets.webp",
    glyph: "🪙",
  },
  steps: [
    {
      kind: "theory",
      body: `## Uma conta é uma entrada no livro‑razão

Remova a interface da carteira e uma **conta** Stellar é uma linha no livro‑razão replicado: uma chave pública, um saldo de XLM, alguns flags — e o **número de sequência** que você viu ao dissecar envelopes (o contador à prova de replay).

Linhas não são gratuitas. Cada validador armazena cada entrada, então cada entrada deve bloquear uma **reserva base** de XLM — atualmente 0,5 XLM, com uma conta nova contendo ao menos duas (1 XLM) que não pode gastar. Apague entradas e a reserva volta.

A reserva não é uma taxa. É **aluguel por depósito**: o livro‑razão permanece enxuto porque o inchaço tem preço.`,
    },
    {
      kind: "theory",
      body: `## Linhas de confiança: ativos são opt‑in

Em muitas cadeias, qualquer pessoa pode lançar tokens lixo no seu endereço. No Stellar isso não acontece: para manter qualquer ativo além de XLM, sua conta deve primeiro abrir uma **linha de confiança** para ele.

Uma linha de confiança diz: *"Eu aceito o ativo X do emissor Y, até este **limite**."* Ela é criada com a operação \`change_trust\`, é sua própria entrada no livro‑razão — então bloqueia **uma reserva base** — e enquanto não existir, pagamentos desse ativo para você simplesmente falham.

Opt‑in por design: seu balanço contém apenas o que você concordou em segurar.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Você já fez isso com as próprias mãos: o laboratório **Sua Primeira Carteira** da Forja envia \`change_trust\` com sua assinatura na testnet ativa — o momento em que um novo ativo apareceu no seu saldo foi o nascimento de uma linha de confiança. Se você pulou esse laboratório, este capítulo é a oportunidade perfeita para abrir uma de verdade.`,
    },
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
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `O Ato VI da Campanha — **O Portão da Constelação** — percorre o mesmo terreno a partir de Rust: contas, saldos e linhas de confiança consultados e forjados em código ao invés de prosa. Faça o desvio quando quiser colocar os dedos nas próprias entradas do livro‑razão.

Próximo na jornada: ativos em *movimento* — pagamentos que cruzam moedas no meio do caminho, e uma exchange incorporada ao próprio protocolo.`,
    },
  ],
};
