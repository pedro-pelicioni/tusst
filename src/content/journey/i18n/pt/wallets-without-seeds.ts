import type { Concept } from "../types";

export const walletsWithoutSeeds: Concept = {
  meta: {
    slug: "wallets-without-seeds",
    title: "Carteiras Sem Sementes",
    tagline: "Contas inteligentes, chaves de acesso e taxas patrocinadas por terceiros.",
    numeral: "VII",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/wallets-without-seeds.webp",
    glyph: "🛡️",
  },
  steps: [
    {
      kind: "theory",
      body: `## O problema das vinte e quatro palavras

Carteiras tradicionais recebem o novo usuário com um ritual: *anote estas 24 palavras; se as perder, seu dinheiro desaparece para sempre; se as mostrar a alguém, ele some ainda mais rápido.*

Pessoas reais falham nesse teste o tempo todo — capturas de tela, anotações em gavetas, backups que nunca foram feitos. Fortunas inteiras evaporaram por causa de um post‑it perdido. E a maioria dos usuários nunca chega tão longe: **a jornada morre na tela da frase‑semente**.

Se as infraestruturas da cadeia vão transportar salários e compras, a cerimônia da chave precisa desaparecer. No Stellar isso é possível — porque uma conta não precisa *ser* um par de chaves.`,
    },
    {
      kind: "theory",
      body: `## Contas que são contratos

Uma conta clássica autentica de um jeito: o protocolo verifica assinaturas ed25519 contra sua lista de signatários. Lógica fixa, para sempre.

Uma **conta inteligente** é diferente: ela *é* um contrato Soroban, e quando uma transação reivindica sua autoridade, o protocolo chama a função \`__check_auth\` do contrato e pergunta: *"você aceita isso?"*

A regra de assinatura se torna **código que você escreveu**. Verifique uma curva diferente. Exija dois dispositivos acima de um limiar. Gire chaves após uma violação sem mudar o endereço. Qualquer política que você puder expressar em Rust agora é um tipo de assinatura.`,
    },
    {
      kind: "theory",
      body: `## Chaves de acesso: a chave que você não pode perder

Seu telefone já contém um cofre: o **secure enclave**, hardware que assina com chaves que nunca deixam o chip, desbloqueado por Face ID ou impressão digital. O padrão web para isso é o **WebAuthn** — chaves de acesso — e ele usa a curva **secp256r1**.

O Stellar verifica secp256r1 **nativamente**, então uma conta inteligente pode aceitar o enclave do seu telefone como signatário diretamente: o hardware biométrico assina, a cadeia verifica a assinatura da chave de acesso por conta própria.

Nenhuma frase‑semente existe em nenhum momento. A “carteira” é o mesmo hardware que já protege seu app bancário — agora assinando transações no ledger.`,
    },
    {
      kind: "diagram",
      body: "A mesma conta, dois jeitos de guardá-la:",
      caption: "A passkey nunca sai do hardware seguro do aparelho — que é exatamente por que não dá para arrancá-la de você por phishing.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "seed",
            label: "vinte e quatro palavras",
            tone: "bad",
          },
          {
            id: "passkey",
            label: "uma passkey",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "onde vive",
            cells: [
              {
                text: "um print, um app de notas, uma gaveta",
                tone: "bad",
              },
              {
                text: "o enclave seguro do aparelho",
                tone: "good",
              },
            ],
          },
          {
            label: "como se perde",
            cells: [
              {
                text: "uma foto do papel já basta",
                tone: "bad",
              },
              {
                text: "não dá para copiar para fora",
                tone: "good",
              },
            ],
          },
          {
            label: "para assinar",
            cells: [
              {
                text: "digitar ou colar tudo",
                tone: "bad",
              },
              {
                text: "uma digital",
                tone: "good",
              },
            ],
          },
          {
            label: "se o aparelho morrer",
            cells: [
              {
                text: "não importa — as palavras são a conta",
                tone: "neutral",
              },
              {
                text: "cadastre um segundo signatário antes desse dia",
                tone: "gold",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Em uma carteira inteligente com chave de acesso, o que substitui a frase‑semente?`,
      options: [
        "Nada para memorizar — uma chave gerada no hardware seguro do dispositivo assina, e a cadeia a verifica nativamente",
        "Uma frase curta de seis palavras que seja mais fácil de lembrar",
        "O âncora, que guarda a frase‑semente para você em custódia",
      ],
      answer: 0,
      explain: `A chave privada nunca sai do enclave e nunca foi mostrada a ninguém — não há nada para anotar, fotografar ou ser alvo de phishing. A recuperação passa a ser uma questão de política (signatários extras, dispositivo guardião), não um teste de memória.`,
    },
    {
      kind: "theory",
      body: `## Políticas: assinaturas com opinião

Quando a regra de autenticação vira código, um signatário pode carregar **política**:

- **Limites de gasto** — a chave de acesso sozinha aprova até 50 USDC por dia; acima disso, um segundo fator deve co‑assinar.
- **Contratos permitidos** — um signatário que pode *apenas* interagir com seu jogo, nunca com a DEX.
- **Chaves de sessão** — conceda a um dapp sua própria chave limitada para a noite; ela expira sozinha.

É isso que “programável” realmente entrega aos usuários: guardrails impostas pelo ledger, não por uma promessa nos termos de serviço do app.`,
    },
    {
      kind: "fill",
      prompt: `Qual curva permite que a cadeia verifique a assinatura do enclave seguro do telefone?`,
      file: "auth-stack.txt",
      before: `Face ID  →  enclave seguro assina com  `,
      after: `  →  verificada nativamente no ledger`,
      choices: ["secp256r1", "secp256k1", "ed25519", "curve25519"],
      answer: 0,
      explain: `ed25519 é a curva clássica do Stellar e secp256k1 pertence ao Bitcoin e Ethereum. O hardware WebAuthn fala secp256r1 (também conhecido como P‑256), e o protocolo a verifica nativamente — sem emulação pesada dentro do contrato, sem explosão de custos.`,
    },
    {
      kind: "theory",
      body: `## Taxas que outra pessoa paga

Ainda há um obstáculo: um usuário recém‑chegado não tem XLM, e as transações custam (mínimas) taxas. Dizer a ele “primeiro, vá comprar XLM numa exchange” mata a magia.

A resposta do Stellar é **patrocínio de taxa**: outra conta — tipicamente a do app — envolve a transação do usuário e **paga sua taxa**, podendo também patrocinar reservas. A primeira ação on‑chain do usuário não custa nada e não requer financiamento prévio.

Chave de acesso + patrocínio juntos: toque em “criar conta”, confirme com Face ID, e você está transacionando em um ledger público — sem visita a exchange, sem cerimônia de semente, sem XLM à vista.`,
    },
    {
      kind: "theory",
      body: `## Protocolo 27 “Zipper”: delegação chega

Contas inteligentes ainda são novas, e o protocolo está ativamente pavimentando seu caminho. **Protocolo 27 — “Zipper”**, ativo na mainnet desde **julho de 2026**, lançou **CAP‑71: delegação de autenticação** para contas inteligentes.

A delegação permite que uma autoridade transfira poder de assinatura para outra de forma limpa, ao nível do protocolo — o que **simplifica configurações multisig** e **reduz custos de transação** para exatamente os padrões de conta descritos neste capítulo.

Tradução para desenvolvedores: carteiras multi‑dispositivo, recuperação por guardião e designs pesados em políticas ficaram mais baratos e simples de operar. O protocolo está **apoiando** contas inteligentes, não apenas tolerando‑as.`,
    },
    {
      kind: "quiz",
      question: `O que o CAP‑71 no Protocolo 27 “Zipper” mudou para contas inteligentes?`,
      options: [
        "Delegação de autenticação — simplificando multisig e reduzindo custos de transação",
        "Tornou todas as transações de contas inteligentes isentas de taxas para sempre",
        "Substituiu ed25519 por secp256r1 em toda a rede",
      ],
      answer: 0,
      explain: `Delegação é infraestrutura, não fogos de artifício: menos assinaturas para carregar, autenticação multipartes mais barata. Contas clássicas ed25519 continuam funcionando exatamente como antes — os dois estilos de conta coexistem.`,
    },
    {
      kind: "labLink",
      labSlug: "passkey-smart-wallet",
      body: `A Forge está pronta: entre em **Passkey Smart Wallet**, registre uma chave de acesso real, implante seu contrato de conta inteligente na testnet e responda a um novo desafio WebAuthn com seu próprio dispositivo.

Quando o ledger confirmar que o código implantado é o Wasm canônico da conta inteligente, retorne ao caminho. Ele se curva para algo ainda mais estranho: um ledger onde os *valores próprios* usam um véu.`,
    },
  ],
  testOut: [
    { question: `Que problema uma smart account resolve que um par de chaves clássico não resolve?`,
      options: ["A autorização vira programável — a conta decide o que conta como assinatura válida, em vez de uma chave ser a única resposta","Ela elimina as taxas de transação para o dono da conta","Ela deixa uma conta guardar ativos para os quais não tem trustline"], answer: 0 },
    { question: `O que uma passkey substitui, e o que ela não substitui?`,
      options: ["Substitui a frase-semente que um humano precisa guardar em segurança; não elimina a necessidade de a conta autorizar alguma coisa","Substitui a assinatura da conta por completo — contas com passkey não assinam nada","Substitui a taxa da rede, já que contas com passkey são patrocinadas por padrão"], answer: 0 },
    { question: `O patrocínio de taxas permite a uma aplicação fazer o quê?`,
      options: ["Pagar as taxas e reservas de um usuário, para quem não tem XLM nenhum conseguir transacionar","Reduzir a taxa base abaixo do mínimo do protocolo para seus usuários","Agrupar as transações dos usuários num envelope só para dividir uma taxa"], answer: 0 },
    { question: `Por que \"ninguém precisa anotar doze palavras\" é decisão de produto e não só conveniência?`,
      options: ["Frases-semente são a maior fonte isolada de perda irreversível de usuários — tirá-las elimina o modo de falha, não só o atrito","Porque listas de palavras não existem em todos os idiomas","Porque guardar frase-semente é proibido na maioria das jurisdições"], answer: 0 },
  ],
};
