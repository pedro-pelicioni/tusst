import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Contas, Confiança e Ativos",
  tagline: "Contas, reservas e trustlines: por que guardar um ativo é opt-in.",
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
      kind: "diagram",
      body: "Um ativo emitido, e quem pode tocar nele:",
      caption: "As linhas tracejadas são trustlines — opt-in e reversíveis. A sólida só existe porque as duas pontas aceitaram.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "issuer",
            label: "EMISSOR",
            x: 50,
            y: 12,
            tone: "gold",
            shape: "box",
            note: "Traz o ativo à existência simplesmente pagando com ele. Não há mint nem tabela de oferta.",
          },
          {
            id: "ana",
            label: "ANA",
            x: 16,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "Abriu uma trustline — esse opt-in é o que permite a ela guardar o ativo.",
          },
          {
            id: "bruno",
            label: "BRUNO",
            x: 50,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "Também aceitou, então a Ana pode pagar ele. As duas pontas precisam de trustline.",
          },
          {
            id: "caio",
            label: "CAIO",
            x: 84,
            y: 45,
            tone: "neutral",
            shape: "box",
            note: "Nunca abriu uma. Ninguém consegue mandar esse ativo para ele, por mais que tente.",
          },
        ],
        edges: [
          {
            from: "issuer",
            to: "ana",
            label: "trustline",
            style: "dashed",
          },
          {
            from: "issuer",
            to: "bruno",
            style: "dashed",
          },
          {
            from: "ana",
            to: "bruno",
            label: "pagamento",
            style: "solid",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## A reserva, contada

Regras abstratas sobre reserva ficam óbvias no instante em que você soma uma. Eis uma conta comum, em uso:

- **A própria conta** — 2 reservas-base.
- **Três trustlines** — USDC, EURC e o token local de um anchor: mais 3.
- **Uma oferta aberta** na DEX — mais 1.

Seis entradas a **0,5 XLM cada: 3 XLM travados.** Se a conta tem 3,4 XLM, o saldo gastável é 0,4 — e um pagamento de 1 XLM vai falhar, com um saldo que claramente parece cobrir.

Esse erro tem nome em toda fila de suporte da Stellar: *"eu tenho fundos mas o pagamento diz sem fundos."* Os fundos estão lá. Eles só não estão **disponíveis**, porque disponibilidade é total menos reserva, e a reserva cresceu toda vez que a conta concordou em guardar algo novo.

A boa notícia é que nada disso foi gasto. Feche a oferta e 0,5 XLM volta. Feche uma trustline que você não usa mais e volta outra. A reserva é um depósito por espaço no ledger, devolvido no instante em que você para de ocupá-lo.`,
    },
    { kind: "theory", body: `## O que o opt-in está de fato evitando

A trustline parece burocracia até você imaginar o ledger sem ela.

Numa chain onde qualquer um pode empurrar um token para qualquer endereço, sua carteira é uma caixa de entrada pública em que estranhos escrevem. Tokens caem sem pedir licença — uns como marketing, outros nomeados para se passar por um ativo real, outros desenhados para que interagir com eles te custe alguma coisa. Aí toda carteira precisa de um filtro, todo filtro precisa de uma lista, e toda lista é o julgamento de alguém sobre o que você tem permissão de ver.

A Stellar desce essa decisão uma camada, para dentro do protocolo: **um ativo não pode cair numa conta que não abriu uma trustline para ele.** Ninguém coloca nada na sua conta sem o seu consentimento prévio, explícito e registrado no ledger.

A reserva é o que torna esse consentimento honesto. Cada trustline trava 0,5 XLM, então abrir uma é um ato pequeno e deliberado em vez de algo que um script faz dez mil vezes — e fechar devolve a reserva.

A fricção era o ponto.` },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Você já fez isso com as próprias mãos: o laboratório **Sua Primeira Carteira** da Forja envia \`change_trust\` com sua assinatura na testnet ativa — o momento em que um novo ativo apareceu no seu saldo foi o nascimento de uma linha de confiança. Se você pulou esse laboratório, este capítulo é a oportunidade perfeita para abrir uma de verdade.`,
    },
    { kind: "theory", body: `## Guardar, e criar

Você já consegue ler qualquer conta do ledger: quanto ela custa para existir, quanto cada entrada acrescenta a esse custo, e quais ativos ela concordou em guardar.

Tudo até aqui foi pelo lado de quem guarda. Vire a moeda e aparece outro conjunto de perguntas: como um ativo passa a existir, quem tem permissão de criar um, e — a pergunta que todo emissor regulado precisa responder — o emissor consegue controlar quem o guarda depois?

**A seguir:** o outro lado da trustline.` },
  ],
  testOut: [
    { question: `O que é uma conta na Stellar, estruturalmente?`,
      options: ["Uma entrada do ledger com saldo, número de sequência e signatários — que custa uma reserva mínima para continuar existindo","Um registro dentro de um contrato de sistema que o protocolo aciona","Uma chave pública; o ledger não guarda nada até a chave ser usada"], answer: 0 },
    { question: `Por que cada entrada adicional do ledger aumenta o saldo mínimo de uma conta?`,
      options: ["Toda entrada custa armazenamento de todo validador, então a reserva precifica esse custo contínuo — e volta quando a entrada é removida","É uma taxa que financia a operação dos validadores","Desencoraja contas a guardarem mais de um ativo"], answer: 0 },
    { question: `Alguém te manda um ativo do qual você nunca ouviu falar. O que acontece?`,
      options: ["O pagamento falha — um ativo não pode cair numa conta que não abriu trustline para ele","Ele chega e aparece nos seus saldos até você removê-lo","Fica retido pelo protocolo até você aceitar ou recusar"], answer: 0 },
    { question: `Abrir uma trustline te compromete com o quê, de fato?`,
      options: ["Travar uma reserva e consentir, no ledger, em guardar aquele ativo específico daquele emissor específico","Confiar que o emissor não vai congelar seu saldo","Pagar uma taxa recorrente enquanto guardar o ativo"], answer: 0 },
  ],
};
