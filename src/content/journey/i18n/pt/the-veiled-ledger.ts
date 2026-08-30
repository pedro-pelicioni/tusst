import type { Concept } from "../types";

export const theVeiledLedger: Concept = {
  meta: {
    slug: "the-veiled-ledger",
    title: "O Livro‑feito‑véu",
    tagline: "Tokens confidenciais, pagamentos privados — privacidade com um respaldo de conformidade.",
    numeral: "VIII",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 16,
    sigil: "/v2/journey/sigils/the-veiled-ledger.webp",
    glyph: "🕯️",
  },
  steps: [
    {
      kind: "theory",
      body: `## Transparência é um recurso — até vazar

Tudo que você construiu até agora é radicalmente público: todo saldo, todo pagamento, toda contraparte, para sempre.

Para finanças isso costuma ser *o* ponto de venda — reservas auditáveis, trilhas verificáveis. Mas, quando aplicado a negócios reais, corta o outro lado:

- Pague salários on‑chain e **cada funcionário pode ler o salário de todos os outros**.
- Pague um fornecedor e seus **concorrentes leem seus preços e volumes**.
- Mova o tesouro e o mercado antecipa sua intenção.

Dinheiro sério precisa de *silêncio seletivo*. A questão é como um livro‑feito‑público pode guardar segredos sem se tornar um segredo total.`,
    },
    {
      kind: "diagram",
      body: "O mesmo pagamento, visto dos dois lados:",
      caption: "Nada disso é criptografado hoje. Cada linha é pública por projeto — o que é a funcionalidade, e o vazamento.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "explorer",
            label: "o que qualquer um lê",
            tone: "bad",
          },
          {
            id: "you",
            label: "o que você quis compartilhar",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "o valor",
            cells: [
              {
                text: "o número exato, para sempre",
                tone: "bad",
              },
              {
                text: "que um pagamento aconteceu",
                tone: "good",
              },
            ],
          },
          {
            label: "a contraparte",
            cells: [
              {
                text: "o endereço dela, e tudo mais que ela já fez",
                tone: "bad",
              },
              {
                text: "nada sobre ela",
                tone: "good",
              },
            ],
          },
          {
            label: "sua folha",
            cells: [
              {
                text: "cada salário, comparável lado a lado",
                tone: "bad",
              },
              {
                text: "não é da conta de ninguém",
                tone: "good",
              },
            ],
          },
          {
            label: "seu caixa",
            cells: [
              {
                text: "seu saldo, até o stroop",
                tone: "bad",
              },
              {
                text: "não é da conta de ninguém",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Prova sem divulgação

A resposta vem do presente mais estranho da criptografia: a **prova de conhecimento zero**.

Uma prova ZK convence um verificador de que uma afirmação é verdadeira — *"este valor oculto é positivo, e meu saldo oculto o cobre"* — sem revelar **nada mais**: nem o valor, nem o saldo.

A prova é um pequeno bloco de matemática que qualquer pessoa pode checar de forma barata, e a verificação não requer confiança no provedor. Se verifica, a afirmação vale. Ponto final.

Coloque esse verificador dentro das regras do livro‑feito e a cadeia pode impor honestidade sobre números que nunca tem permissão de ver.`,
    },
    {
      kind: "theory",
      body: `## O reino forja as ferramentas

A verificação on‑chain precisa de matemática pesada específica como **funções de host** — e a Stellar entregou isso em camadas:

- **CAP‑59** trouxe operações de curva **BLS12‑381**, permitindo verificação de provas **Groth16** dentro de contratos Soroban.
- **Protocolos 25 e 26** adicionaram a curva **BN254** e o **hash Poseidon** — um hash projetado para ser barato *dentro* de circuitos ZK.

Essa segunda onda foi o que virou a balança: tornou **sistemas de pagamento privado práticos** na Stellar. Os primitivos são de nível de protocolo, então qualquer contrato verifica provas na velocidade nativa — sem penalidade de mil vezes o custo para fazer criptografia honestamente.`,
    },
    {
      kind: "quiz",
      question: `O que um verificador ZK on‑chain aprende quando aceita uma prova?`,
      options: [
        "Apenas que a afirmação provada é verdadeira — os valores ocultos permanecem ocultos",
        "Os valores subjacentes, que ele verifica e depois descarta",
        "Nada — a aceitação é apenas marketing probabilístico",
      ],
      answer: 0,
      explain: `Essa assimetria é todo o truque: a validade se torna pública enquanto os dados permanecem privados. O livro‑feito pode impor “ninguém gasta o que não tem” sem jamais ler um saldo.`,
    },
    {
      kind: "theory",
      body: `## Tokens Confidenciais: ocultando os valores

**Tokens Confidenciais** chegaram à pré‑visualização para desenvolvedores em **junho de 2026**, criados pela **OpenZeppelin e Nethermind**. O design é elegantemente discreto:

- Um **contrato wrapper** sobre qualquer token **SEP‑41** existente — USDC via seu Contrato de Ativo Stellar, tokens nativos do contrato, qualquer coisa que siga o padrão.
- Ao envolver seus tokens, seu **saldo e os valores transferidos ficam ocultos**, protegidos por provas de conhecimento zero.
- **Endereços permanecem públicos**: o explorador ainda vê *quem* transacionou com *quem* — apenas não vê *quanto*.

Construído para partes que se conhecem, mas precisam manter os números privados: folha de pagamento, faturas de fornecedores, liquidação B2B.`,
    },
    {
      kind: "theory",
      body: `## Stellar Private Payments: ocultando as contrapartes

Um véu a mais. **Stellar Private Payments (SPP)**, desenvolvido pela **Nethermind**, chegou à **pré‑visualização para desenvolvedores no testnet em agosto de 2026**.

Em vez de envolver um token, os usuários **depositam ativos em um pool compartilhado**. As transferências então ocorrem *dentro* do pool — e um observador externo não consegue mais ligar remetente a destinatário. Não apenas os valores: as **próprias contrapartes ficam ocultas**.

Onde Tokens Confidenciais atendem partes que se conhecem, o SPP cobre casos em que *quem pagou quem* é o próprio segredo — doações, relações sensíveis com fornecedores, finanças pessoais em trilhas públicas.`,
    },
    {
      kind: "diagram",
      body: "Acompanhe um pagamento atravessando o pool e veja o que o explorer guarda:",
      caption:
        "As bordas são públicas por construção. Tudo o que o pool protege acontece entre elas.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "deposit",
            label: "Depósito",
            tone: "gold",
            note: "Visível. O explorer registra que esta conta colocou fundos no pool, e quanto. Nada está escondido aqui — e nada precisa estar.",
          },
          {
            id: "inside",
            label: "Dentro do pool",
            tone: "accent",
            note: "Oculto. Transferências entre participantes do pool não precisam aparecer on-chain: sem remetente, sem destinatário, sem valor. É esta a parte que o véu cobre.",
          },
          {
            id: "withdraw",
            label: "Saque",
            tone: "gold",
            note: "Visível de novo. Alguém sai do pool com um valor — mas ligar ESTA saída àQUELA entrada é exatamente o que o pool quebra.",
          },
          {
            id: "observer",
            label: "O que sobra para o observador",
            tone: "neutral",
            note: "Duas bordas públicas e uma multidão no meio. Quanto maior o pool, mais fraco o vínculo entre qualquer entrada e qualquer saída.",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## A espinha de conformidade

"Privado" sem limites é o pesadelo de um oficial de sanções, e esses designs se recusam a chegar lá. O SPP combina confidencialidade com **salvaguardas de conformidade incorporadas**:

- **Participação condicionada a KYC** — entrar no pool requer identidade verificada.
- **Controles de acesso ao nível de identidade** — permissões vinculadas a *quem você é*, não apenas à chave que possui.
- **Capacidade de congelamento ao nível de conta** — atores maliciosos podem ser parados mesmo dentro do véu.

Essas três salvaguardas são aplicadas por uma peça que vale conhecer pelo nome: o **Association Set Provider (ASP)**. Um ASP publica um *conjunto* de depósitos pelos quais ele responde — uma allow list — ou aqueles pelos quais ele se recusa a responder — uma deny list. Para sacar, você prova que seus fundos remontam a algum depósito dentro desse conjunto, **sem revelar qual**. O SPP constrói isso sobre um association set baseado em chaves, apoiado por um registro público de chaves para que os participantes possam sequer ser referenciados.

Repare na consequência, porque ela é o truque inteiro: **o mesmo saque é privado e auditável ao mesmo tempo**. Privado, porque o vínculo com o seu depósito específico nunca é publicado. Auditável, porque você não poderia ter sacado sem provar pertencimento a um conjunto avalizado. ASPs diferentes podem atender jurisdições diferentes — e você escolhe de quem carrega o aval.

O objetivo em uma frase: **privacidade para usuários, não para crimes**. Transferências confidenciais *e* compatíveis em trilhas públicas — essa combinação, não o segredo bruto, é o que as instituições esperavam.`,
    },
    {
      kind: "quiz",
      question: `Um explorador observa uma transferência de Token Confidencial e uma transferência de pool SPP. O que ele vê em cada?`,
      options: [
        "CT: os dois endereços, mas não o valor; SPP: nem as contrapartes — valor movido dentro do pool compartilhado",
        "Ambos ocultam valores e endereços de forma idêntica — SPP é apenas a versão mais barata",
        "CT oculta os endereços mas mostra os valores; SPP mostra tudo para visualizadores com KYC",
      ],
      answer: 0,
      explain: `Duas camadas, dois véus. Tokens Confidenciais ocultam *quanto* entre partes conhecidas; o pool compartilhado do SPP também oculta *quem*. Escolha a camada que corresponde ao que seu caso de uso precisa manter em silêncio.`,
    },
    {
      kind: "fill",
      prompt: `O que um Token Confidencial pode envolver?`,
      file: "veil.txt",
      before: `token confidencial  =  wrapper ZK sobre qualquer token  `,
      after: ` — valores ocultos, endereços públicos`,
      choices: ["SEP-41", "SEP-24", "SEP-10", "SEP-1"],
      answer: 0,
      explain: `O padrão de interface do token é o ponto de conexão: qualquer coisa que siga SEP‑41 pode ser envolvida — incluindo ativos clássicos como USDC via seu Contrato de Ativo Stellar. A camada de privacidade compõe com tudo que você já conhece.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `Na bigorna da Forja: um laboratório de **Tokens Confidenciais**, onde você envolverá um token da testnet e verá os valores desaparecerem do explorador enquanto a transferência continua sendo liquidada corretamente. O cartão indica *em desenvolvimento* — esta fronteira está sendo construída enquanto você lê.

Observe como essas datas são recentes. Trabalhar com tecnologia tão nova significa ler o próprio pulso do protocolo — o capítulo final mostra como fazer isso.`,
    },
  ],
};
