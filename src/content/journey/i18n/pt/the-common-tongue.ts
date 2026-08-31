import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "A Língua Comum",
  tagline: "SEPs — implemente uma vez, e todo portão abre.",
  steps: [
    { kind: "theory", body: `## A aritmética que obriga a existir um padrão

Conte as integrações. Dez carteiras, dez portões, cada par precisando do próprio fluxo de depósito, do próprio login, do próprio jeito de pedir a foto do passaporte: **cem integrações sob medida** — e cento e vinte e uma no instante em que aparecer uma décima primeira de qualquer um dos lados.

Isso não é um modo de falha hipotético. É o que aconteceu com a geração anterior do encanamento de pagamentos, e é por isso que mandar dinheiro para fora historicamente significou pedir a um banco que peça a outro banco.

Só existem duas saídas do N×M. Uma é o monopólio: todo mundo integra com o único portão que venceu, nos termos dele. A outra é um **padrão** — um documento público dizendo exatamente como qualquer carteira fala com qualquer portão, para os dois lados construírem contra o documento em vez de um contra o outro.

A Stellar pegou o segundo caminho, e os documentos têm nome.` },
    {
      kind: "theory",
      body: `## SEPs: a língua comum

Existem muitas carteiras e muitas âncoras. Sem padrões, cada par precisaria de uma integração customizada — encanamento N×M, para sempre.

A resposta do Stellar é o **SEP**: *Stellar Ecosystem Proposal*. SEPs são padrões públicos que definem exatamente como carteiras, âncoras e serviços se comunicam. Você implementa um SEP uma vez e sua carteira funciona com **toda âncora** que o implemente também — fluxos de depósito, autenticação, identidade, tudo.

Essa cultura de interoperabilidade‑primeiro é um dos superpoderes silenciosos do Stellar: os usuários escolhem qualquer porta, e todas as portas compartilham a mesma forma de chave.`,
    },
    {
      kind: "theory",
      body: `## SEP-1 e SEP-10: identidade e prova

Dois padrões pequenos carregam todo o portão:

- **SEP-1** — todo domínio sério publica um \`stellar.toml\`: seu **cartão de identidade on‑chain**. Quais ativos emite, quais contas são oficiais, onde seus serviços vivem. Carteiras leem isso para distinguir o emissor real de um impostor com o mesmo código de ativo.
- **SEP-10** — **web auth**: a âncora envia uma *transação de desafio*, você a assina com a chave da sua conta e a devolve. Propriedade comprovada, sessão concedida — e o desafio **nunca é submetido** ao ledger.

Login com assinatura: sem senha, sem e‑mail.`,
    },
    {
      kind: "quiz",
      question: `O que exatamente o web auth SEP-10 prova a uma âncora?`,
      options: [
        "Que você controla a chave secreta da conta — assinando uma transação de desafio que nunca toca o ledger",
        "Sua identidade legal — o SEP-10 realiza a verificação KYC por si só",
        "Que sua conta possui XLM suficiente para pagar as taxas da âncora",
      ],
      answer: 0,
      explain: `SEP-10 é pura comprovação de propriedade da chave. Identidade legal é um padrão separado (SEP-12) que as âncoras utilizam *após* a autenticação — assinatura primeiro, documentação depois.`,
    },
    {
      kind: "fill",
      prompt: `Onde uma carteira encontra o cartão de identidade de um domínio?`,
      file: "discovery.txt",
      before: `https://anchor.example/`,
      after: `  →  ativos, contas oficiais e endpoints de serviço`,
      choices: [
        ".well-known/stellar.toml",
        "api/v2/anchor-manifest.json",
        "stellar/config.xml",
        "identity.pdf",
      ],
      answer: 0,
      explain: `SEP-1, o padrão mais simples de todos: um arquivo TOML em um caminho bem‑conhecido. Prove que você possui o domínio, liste suas contas emissoras no arquivo, e as carteiras podem exibir “emitido por anchor.example” como fato, não como sensação.`,
    },
    {
      kind: "theory",
      body: `## Os portões em funcionamento: 24, 31, 41

- **SEP-24** — depósito e saque *interativo*. Sua carteira abre a webview hospedada pela âncora; a âncora cuida dos formulários KYC e dos dados bancários; os tokens chegam quando a transferência bancária é concluída. A rampa cotidiana para pessoas.
- **SEP-31** — pagamentos transfronteiriços entre *empresas*: uma âncora remetente e uma âncora receptora liquidam via Stellar enquanto cada uma gerencia seus trilhos locais.
- **SEP-41** — um velho amigo: a **interface de token** padrão para contratos Soroban, aquela que todo Stellar Asset Contract fala.

Ramps para pessoas, trilhos para instituições, um dialeto de token para contratos.`,
    },
    {
      kind: "theory",
      body: `## Um padrão não é selo de aprovação

Aqui está a confusão que vale cortar pela raiz, porque é a que custa dinheiro às pessoas.

Um portão que implementa SEP-1, SEP-10 e SEP-24 te disse exatamente uma coisa: **o encanamento dele funciona**. Ele publica um arquivo dizendo quem alega ser. Ele consegue verificar uma assinatura. Ele consegue rodar um fluxo de depósito que a sua carteira sabe abrir.

Ele não te disse nada sobre os dólares existirem, sobre a entidade ser licenciada em algum lugar, sobre a custódia ser segregada, ou sobre alguém atender quando você tentar resgatar. Qualquer um consegue hospedar um \`stellar.toml\`. O arquivo é uma alegação de identidade, não um certificado de idoneidade — o SEP-1 torna um emissor **identificável**, o que é pré-condição para confiança e não substituto dela.

Então leia os padrões pelo que eles são: eles tornam o ecossistema *interoperável*, não *seguro*. O primeiro é um problema de protocolo, resolvido. O segundo é diligência, e continua sendo sua.`,
    },
    { kind: "exercise", mode: "spec-write",
      brief: `## A prova do examinador: escolha a língua

Você está construindo uma carteira para um corredor:

> Usuários no Brasil têm BRL num banco. Eles querem mandar dinheiro para a família em Portugal, que saca euros numa conta local. Você vai integrar com um anchor brasileiro e um português, e não controla nenhum dos dois.

Escreva o **plano de integração como uma sequência de padrões**. Para cada passo: qual SEP, o que ele te dá, e o que quebraria se você pulasse. Depois nomeie uma coisa nesse corredor que nenhum SEP vai resolver para você.

Só padrões e comportamento — sem endpoints, sem chamadas de SDK, sem código.`,
      rubric: `1. Nomeia os padrões numa ordem que funciona, começando por descobrir quem é o anchor antes de se autenticar nele.
2. Para cada padrão nomeado, diz concretamente o que ele fornece — não só o número ou o título.
3. Diz o que quebraria se ao menos um dos passos fosse pulado.
4. Nomeia ao menos um problema real do corredor que padrões não resolvem (risco cambial, licenciamento, liquidez em algum dos portões, recusa de KYC, falha de resgate…).
5. Só padrões e comportamento — sem caminhos de endpoint, sem nomes de método de SDK, sem código.`,
      minChars: 180 },
    { kind: "theory", body: `## Onde o reino clássico termina

Faça o balanço do que você já consegue ler: consenso, envelopes, contas e ativos, os mercados dentro do ledger, o pagamento que atravessa moedas, os portões nas duas bordas, e os padrões que fazem esses portões cooperarem.

Cada uma dessas coisas é **maquinário embutido no protocolo**. Você configurou, você pagou, você roteou por ele — mas não escreveu nada disso. As regras já estavam lá, decididas por gente que não é você.

**A seguir:** a parte do reino que você mesmo programa, onde um contrato é algo que você publica e até o armazenamento dele tem batimento.` },
  ],
  testOut: [
    { question: `Que problema um SEP existe para resolver?`,
      options: ["Encanamento sob medida N×M — com um padrão público, qualquer carteira funciona com qualquer portão que o implemente","Liquidação lenta entre carteiras e anchors","A ausência de um registro central de anchors aprovados"], answer: 0 },
    { question: `O que exatamente a autenticação SEP-10 prova a um anchor?`,
      options: ["Que você controla a chave secreta da conta — assinando uma transação-desafio que nunca é submetida ao ledger","Sua identidade legal, já que o SEP-10 faz o próprio KYC","Que a conta tem XLM suficiente para cobrir as taxas do anchor"], answer: 0 },
    { question: `Onde uma carteira encontra a carteira de identidade on-chain de um domínio?`,
      options: ["Num stellar.toml em caminho conhecido no domínio — o SEP-1, o mais simples de todos os padrões","Num contrato de registro que a SDF mantém na mainnet","Nas entradas manage_data da conta emissora"], answer: 0 },
    { question: `Qual padrão é a rampa interativa de depósito e saque do dia a dia, para humanos?`,
      options: ["SEP-24 — a carteira abre o fluxo hospedado do anchor, que cuida do KYC e dos dados bancários","SEP-31, que liquida pagamentos transfronteiriços entre empresas","SEP-41, a interface de token que contratos Soroban falam"], answer: 0 },
  ],
};
