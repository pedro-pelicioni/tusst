import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Pagamentos privados e compliance",
  tagline: "Private payments e compliance: esconder as contrapartes, continuar auditável.",
  steps: [
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
    { kind: "widget", component: "explorer-view",
      body: `A escolha entre essas camadas não é sobre quão privado dá para ficar. É sobre **qual campo precisa apagar**. Troque de camada e leia a coluna do observador.` },
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
      kind: "quiz",
      question: `Você chama \`get_asp_non_membership_root()\` no pool vivo e ele responde **0**. O que isso de fato te diz?`,
      options: [
        "A blocklist está vazia — e 0 é o valor contra o qual o contrato confere todo saque, então lista vazia é política aplicada, não política ausente",
        "A chamada falhou e caiu num default: uma raiz de Merkle nunca é legitimamente zero",
        "A blocklist é confidencial, então o contrato devolve 0 para quem não é um ASP",
      ],
      answer: 0,
      explain: `Uma árvore vazia ainda tem raiz de verdade, e para esta blocklist ela é literalmente 0 — ou seja, "ninguém está barrado" é ativamente aplicado a cada gasto, não deixado em branco. Agora experimente a vizinha: \`get_asp_membership_root()\` responde 2302223575749844940221218608817648865122641281382153518325924961250440546344, um número impressionante para uma árvore que **também está vazia**. Aquilo é o zero-hash de árvore vazia. Ler isso como "a allowlist tem membros" é o erro mais fácil deste assunto inteiro, e você acabou de evitá-lo.`,
    },
    {
      kind: "theory",
      body: `## Vá olhar dentro de um

Tudo acima é verificável agora, num pool que existe de verdade. O developer preview da Nethermind está vivo na testnet, e as funções de leitura dele respondem **sem carteira e sem assinatura**. Você não é cliente dessa coisa — você é espectador, e assistir é de graça.

Abra a [Forge](/ide), vá em **Explore** e escolha **pool de privacidade SPP · XLM** entre os contratos conhecidos. Depois pergunte, nesta ordem:

- \`get_policy_flags()\` — como este pool está configurado. Responde **2**: blocklist aplicada, sem allowlist.
- \`get_root()\` — a raiz de Merkle que compromete toda nota já depositada ali. Um número só, representando o conjunto de anonimato inteiro.
- \`is_known_root(<esse número>)\` — **true**. Agora mude um dígito e pergunte de novo: **false**. Você acabou de percorrer o anel de raízes que o pool lembra.
- \`is_spent(<qualquer número>)\` — **false**. Este é o conjunto de nullifiers: a defesa do pool contra gasto duplo, e quase a única coisa que um saque publica sobre si mesmo.

Leia na ordem e repare no que está *faltando*. Nenhuma dessas respostas contém endereço, valor ou contraparte. A chain está dizendo a verdade exata e não está dizendo nada.

**Dois avisos, porque a spec de um contrato não consegue avisar sobre ela mesma.** Este pool expõe cinco funções sobradas — \`balance\`, \`transfer\`, \`approve\` e companhia — que respondem educadamente e não significam nada; a Forge marca elas como *isca* para que não enganem você. E o estado do preview **arquiva em 2026-09-02**, depois disso as leituras param de responder até alguém pagar para restaurar. Isso não é a Forge falhando: é o state rent do Soroban, sob o qual todo contrato desta rede vive.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `Na bigorna da Forja: um laboratório de **Tokens Confidenciais**, onde você envolverá um token da testnet e verá os valores desaparecerem do explorador enquanto a transferência continua sendo liquidada corretamente. O cartão indica *em desenvolvimento* — esta fronteira está sendo construída enquanto você lê.

Observe como essas datas são recentes. Trabalhar com tecnologia tão nova significa ler o próprio pulso do protocolo — o capítulo final mostra como fazer isso.`,
    },
  ],
  testOut: [
    { question: `Como um pool SPP esconde as contrapartes?`,
      options: ["Usuários depositam num pool compartilhado e transferem dentro dele, então o observador não consegue ligar remetente a destinatário","Endereços são cifrados e só o destinatário consegue decifrar","Transferências são agrupadas, então vários pagamentos dividem um registro on-chain"], answer: 0 },
    { question: `Um explorador observa uma transferência de Token Confidencial e uma de pool SPP. O que ele vê em cada uma?`,
      options: ["CT: os dois endereços, mas não o valor. SPP: nem as contrapartes","Os dois escondem valores e endereços igualmente; o SPP só é mais barato","CT esconde endereços e mostra valores; SPP mostra tudo a quem passou por KYC"], answer: 0 },
    { question: `O que um Association Set Provider publica, e contra o que você prova?`,
      options: ["Um conjunto de depósitos pelos quais ele responde — e você prova que seus fundos remontam a algum depósito daquele conjunto, sem revelar qual","Uma lista de destinatários aprovados, que o pool impõe em toda transferência","As chaves de decifragem que deixam auditores ler a atividade do pool"], answer: 0 },
    { question: `Como o mesmo saque pode ser privado e auditável ao mesmo tempo?`,
      options: ["Privado porque a ligação com o seu depósito específico nunca é publicada; auditável porque você não conseguiria sacar sem provar pertencer a um conjunto avalizado","Auditores guardam uma chave mestra que revela a ligação quando necessário","Não pode — o projeto troca um pelo outro, e o SPP escolheu auditabilidade"], answer: 0 },
  ],
};
