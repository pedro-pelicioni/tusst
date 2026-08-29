import type { Concept } from "../types";

export const theProtocolsEdge: Concept = {
  meta: {
    slug: "the-protocols-edge",
    title: "A Vantagem do Protocolo",
    tagline: "CAPs, SEPs, upgrades nomeados — surfando um protocolo vivo.",
    numeral: "IX",
    arc: "realm",
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/the-protocols-edge.webp",
    glyph: "⚡",
  },
  steps: [
    {
      kind: "theory",
      body: `## Um protocolo que evolui

Tudo que você estudou — SCP, pagamentos por caminho, Soroban, funções host ZK — chegou em **versões numeradas do protocolo**, e novas versões continuam surgindo.

Upgrades no Stellar não são forks caóticos. **Os validadores votam**: quando a rede suficiente concorda, a atualização é ativada em um ledger escolhido e todos os nós avançam **juntos**. Uma rede antes, uma rede depois.

Isso é o SCP cumprindo dois papéis — o mesmo consenso que aprova transações também aprova *as regras em si*. Uma blockchain é software; esta entrega releases como se soubesse disso.`,
    },
    {
      kind: "theory",
      body: `## Dois rios de mudança: CAPs e SEPs

A mudança flui por dois canais, e vale a pena memorizar a divisão:

- **CAPs** — *Core Advancement Proposals* — alteram o **protocolo em si**: consenso, regras de ledger, novas funções host, mecânicas de taxas. Precisam de voto dos validadores porque cada nó deve executar de forma idêntica.
- **SEPs** — *Stellar Ecosystem Proposals* — são os padrões **ao redor** da cadeia: fluxos carteira‑âncora, interfaces de token, stellar.toml. São adotados por implementações, não por voto.

Lei da cadeia versus costume comercial. CAP‑59 trouxe curvas ZK; SEP‑24 trouxe fluxos de depósito. Rios diferentes, ambos públicos, ambos moldados em discussão aberta.`,
    },
    {
      kind: "quiz",
      question: `Você quer (a) uma nova função host no protocolo e (b) um novo fluxo carteira‑para‑âncora. Que documentos você escreve?`,
      options: [
        "(a) um CAP — ele altera o core; (b) um SEP — é um padrão do ecossistema",
        "(a) um SEP — funções host são ecossistema; (b) um CAP — âncoras são core",
        "Ambos são CAPs — SEPs servem apenas para listagens de token",
      ],
      answer: 0,
      explain: `O teste: todo validador precisa executar isso de forma idêntica? Então é core — um CAP. Se for uma convenção que serviços concordam via HTTP, é um SEP.`,
    },
    {
      kind: "theory",
      body: `## A cadência recente, por nome

As upgrades agora recebem nomes, e o ritmo está acelerado:

- **Protocolo 26 "Yardstick"** — um release de precisão e confiabilidade; com o Protocolo 25 completou o toolkit BN254 + Poseidon ZK do capítulo anterior.
- **Protocolo 27 "Zipper"** — mainnet **julho de 2026**, trazendo **CAP‑71** delegação de autenticação para contas inteligentes.
- **Protocolo 28 "Adapter"** — **testnet atualizado em 27 de agosto de 2026**; mainnet programada para **16 de setembro de 2026**.

Mais ou menos uma estação de diferença, cada uma nomeada, cada uma anunciada com guias de upgrade. O reino não vagueia para o futuro — ele avança segundo um calendário publicado.`,
    },
    {
      kind: "theory",
      body: `## O que uma upgrade pede de você

Um release de protocolo também é um **release de ferramentas**. As versões principais do SDK acompanham as versões do protocolo: **js-stellar-sdk v17.0.0 é o release do Protocolo 28** — quando a rede avança para 28, você avança para o SDK construído para ele.

O passo a passo do desenvolvedor:

1. Leia o **guia de upgrade** quando a versão for anunciada.
2. Atualize SDKs e a CLI em um branch.
3. **Teste no testnet durante a janela** — upgrades no testnet acontecem semanas antes do mainnet exatamente para que você possa testar.

A partir de final de agosto de 2026 essa janela está **aberta agora**: o testnet já roda 28; o mainnet segue em 16 de setembro.`,
    },
    {
      kind: "quiz",
      question: `É início de setembro de 2026 e seu app roda no mainnet (Protocolo 27). Qual a ação profissional?`,
      options: [
        "Apontar o ambiente de staging para o testnet — já em Protocolo 28 — atualizar para SDK v17 e corrigir problemas antes da upgrade do mainnet em 16 de setembro",
        "Não fazer nada — upgrades no mainnet são sempre totalmente compatíveis com SDKs antigos",
        "Congelar todas as implantações até que o protocolo estabilize por um ano",
      ],
      answer: 0,
      explain: `A janela testnet‑first existe exatamente para esse ensaio. A maioria das upgrades é tranquila — mas “os desenvolvedores devem atualizar seus SDKs” está escrito no anúncio do Protocolo 28 por um motivo.`,
    },
    {
      kind: "fill",
      prompt: `Fixe o SDK que fala Protocolo 28.`,
      file: "package.json",
      before: `"@stellar/stellar-sdk": "`,
      after: `"`,
      choices: ["^17.0.0", "^16.2.0", "^28.0.0", "^2.8.0"],
      answer: 0,
      explain: `Versões principais acompanham protocolos, mas os números diferem: v17 é o release do Protocolo 28 (v17.0.1 foi entregue em 25 de agosto de 2026), enquanto versões principais mais antigas apontam para protocolos mais antigos. Ler o título do release indica qual versão de rede o SDK suporta.`,
    },
    {
      kind: "theory",
      body: `## Observando a borda

Surfar um protocolo vivo é um hábito de leitura, não um esforço heroico:

- O **blog de desenvolvedores da stellar.org** — anúncios de upgrades, datas e guias de “o que os desenvolvedores precisam fazer”.
- O **repositório CAP** no GitHub — propostas muito antes de serem enviadas; o rascunho de hoje é a função host do próximo ano.
- **Reuniões abertas do protocolo** — onde os CAPs são debatidos publicamente.

Meia hora por mês mantém você à frente de cada prazo neste capítulo. O desenvolvedor que lê as notas de upgrade surfa a onda; quem não lê fica desatualizado.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-protocol-27-1",
      body: `A **Ato VIII** da Campanha traz este capítulo à prática: você leva um projeto funcional através de um upgrade de protocolo — atualizando SDKs, lendo notas de release, testando contra a nova versão como uma equipe profissional.

E com isso, o reino está mapeado — consenso para contratos, portões para véus, borda para borda. O que resta é a melhor parte: **vá construir nele**. A Forge está aberta.`,
    },
  ],
};
