import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "O Cofre da Guilda",
    tagline: "Limiares multisig — um tesouro que exige dois oficiais.",
  },
  steps: {
    intro: {
      body: `## Uma chave só é um ponto único de falha

Tudo que você assinou até agora precisou de exatamente uma assinatura: a sua. Isso serve para uma conta de brincadeira e é temerário para um tesouro — a chave que move tudo é também a chave que pode ser roubada, perdida ou arrancada de você.

A resposta usual em outras chains é publicar um contrato de multisig. Na Stellar você não publica nada: **toda conta já tem signatários e limiares**. Subir a barra é uma configuração.`,
    },
    "forge-keys": {
      title: "O primeiro oficial",
      body: `Seu próprio par de chaves — a conta que vai virar o cofre.`,
      cta: "Preparar as chaves",
      successBody: `O cofre será \`{address}\`.`,
    },
    fund: {
      title: "Funde o cofre",
      body: `Signatários são subentradas, e subentradas custam reserva. Um cofre sem XLM não tem como pagar por um segundo oficial.`,
      cta: "Chamar o Friendbot",
      successBody: `Fundeado: {balance} XLM.`,
    },
    weights: {
      body: `## Pesos, não cargos

A Stellar não tem a noção de "admin". Ela tem aritmética.

Cada signatário carrega um **peso**. Cada tipo de operação é guardado por um de três **limiares** — baixo, médio, alto. Uma transação é autorizada quando os pesos das assinaturas somam o limiar da operação que ela carrega.

- **Baixo** — abrir trustline, avançar sequência.
- **Médio** — pagamentos, ofertas, quase tudo do dia a dia.
- **Alto** — mexer nos próprios signatários e limiares.

Sua conta agora: um signatário (a chave mestra) com peso 1, todos os limiares em 0. Uma assinatura resolve tudo.`,
    },
    "second-officer": {
      title: "Nomeie o segundo oficial",
      body: `Um segundo par de chaves. Só o endereço **público** importa aqui — o cofre precisa saber quem pode co-assinar, não o segredo dessa pessoa.`,
      cta: "Nomear um oficial",
      successBody: `O segundo oficial é \`{companion}\`.

Esse endereço vai ser escrito na própria entrada do cofre no ledger, ao lado do seu.`,
    },
    "quiz-threshold": {
      question: `Você adiciona o oficial com peso 1 e coloca o limiar **médio** em 2. O que a sua chave mestra consegue fazer sozinha a partir daí?`,
      options: [
        "Nada que exija médio — um pagamento agora precisa das duas assinaturas",
        "Tudo, já que a chave mestra sempre passa por cima dos limiares",
        "Só operações que ela já tinha assinado antes da mudança",
      ],
      explain: `Não existe passar por cima. A chave mestra é apenas um signatário com um peso, e se o peso dela sozinho não alcança o limiar, a assinatura dela sozinha não basta. É essa a propriedade de segurança — e é esse o tiro no pé de que o próximo passo toma cuidado.`,
    },
    "raise-the-bar": {
      title: "Suba a barra",
      body: `Uma operação faz tudo: adiciona o oficial com peso 1, mantém sua chave mestra com peso 1, e põe o **médio** em 2.

Repare no que fica deliberadamente intocado: o limiar **alto** continua em 0, então você ainda consegue desfazer este arranjo com uma assinatura só. Subir alto junto com médio é como as pessoas se trancam para fora do próprio cofre, para sempre.`,
      cta: "Definir os limiares",
      successBody: `O cofre está selado.

Dois signatários, cada um com peso 1, e limiar médio 2. A partir de agora um pagamento saindo desta conta precisa dos **dois** oficiais — e quem garante isso é o ledger, não o seu documento de processo.

Abra a aba **Conta** da Forja com este endereço: os signatários e os limiares estão lá, exatamente como a chain os enxerga.`,
    },
    "quiz-lockout": {
      question: `Uma guilda põe médio **e** alto em 3, com três oficiais de peso 1. Um oficial perde a chave. Em que estado fica o cofre?`,
      options: [
        "Congelado para sempre — trocar signatários exige alto, e alto não é mais alcançável",
        "Tranquilo: os dois restantes podem destituir a chave perdida",
        "Tranquilo: a chave mestra sempre pode redefinir os signatários",
      ],
      explain: `Esta é de longe a forma mais comum de um tesouro real morrer. A regra que te protege do ladrão protege igualmente a ausência dele. Sempre deixe um caminho de recuperação cujo limiar você ainda consegue alcançar.`,
    },
    "claim-xp": {
      body: `Você transformou uma conta comum num tesouro de dois-de-dois sem publicar uma linha de código.

O servidor vai ler esta conta na chain e conferir por conta própria: pelo menos dois signatários, limiar médio pelo menos 2.`,
    },
  },
} satisfies LabTextOverlay;
