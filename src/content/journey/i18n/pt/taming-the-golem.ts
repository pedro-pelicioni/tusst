import type { Concept } from "../types";

export const tamingTheGolem: Concept = {
  meta: {
    slug: "taming-the-golem",
    title: "Domando o Golem",
    tagline: "Engenharia de harness: dê ao IA um banco de testes, não um desejo.",
    numeral: "V",
    arc: "craft",
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/taming-the-golem.webp",
    glyph: "🗿",
  },
  steps: [
    {
      kind: "theory",
      body: `## Uma mente no vazio

Remova tudo e um LLM faz exatamente uma coisa: **texto entra, texto sai**. Ele não pode executar código, ler seu repositório ou checar a cadeia. Sozinho, ele é uma mente no vazio — brilhante, cega e desarmada.

Tudo que transforma essa mente em um *trabalhador* é o **harness**: as ferramentas que ele pode chamar, os arquivos que pode tocar, a sandbox que o contém, os verificadores que julgam sua saída.

E aqui está a parte que a maioria das pessoas perde: o modelo é alugado. **O harness é engenharia — e é seu.**`,
    },
    {
      kind: "theory",
      body: `## Anatomia de um harness

Um harness funcional tem partes nomeadas:

- **Model** — a mente.
- **Tool set** — o que ele pode *fazer*: rodar testes, editar arquivos, consultar um RPC Stellar.
- **Permissions** — o que ele pode tocar, e o que não pode.
- **Working directory** — o mundo que ele vê.
- **Test runner** — o juiz que sua saída deve enfrentar.
- **Reviewer step** — onde um humano (ou outro golem) inspeciona o diff.

Duas equipes com o mesmo modelo e harnesses diferentes obtêm resultados *extremamente* diferentes. Quando a qualidade da saída muda, os engenheiros depuram o harness — não o horóscopo.`,
    },
    {
      kind: "quiz",
      question: `Mesmo modelo, mesma tarefa — mas os resultados deste mês são muito piores que os do mês passado. Onde um engenheiro de harness olha primeiro?`,
      options: [
        "No que cerca o modelo — o contexto que foi dado, as ferramentas que ele pode usar, as verificações que limitam sua saída",
        "Nos pesos do modelo — eles se desgastam com uso intenso, como máquinas",
        "Em nenhum lugar — a aleatoriedade da amostragem explica qualquer variação, então nada é acionável",
      ],
      answer: 0,
      explain: `Os pesos não se desgastam, e a aleatoriedade raramente explica uma queda sustentada. As partes do harness mudam constantemente — um arquivo movido, um test runner silenciado, uma permissão ampliada — e cada uma delas é inspecionável, comparável e corrigível. É por isso que possuir o harness importa.`,
    },
    {
      kind: "theory",
      body: `## Verificação supera confiança

A característica mais perigosa do golem não é ignorância — é **confiança enquanto está errado**. Ele anuncia sucesso no mesmo tom caloroso, quer o deploy tenha funcionado ou nunca tenha acontecido. Confiança é *estilo*, não sinal.

Então um harness nunca confia; ele **recheca**, usando juízes que não podem ser convencidos por conversa fiada:

- o **compilador** — ele realmente compila?
- a **suite de testes** — seus testes do Rito, vermelhos ou verdes
- o **linter** — os padrões foram mantidos?
- a **cadeia em si** — o ledger diz o que o golem afirma?

Reclamações são dados. Verificadores são a verdade.`,
    },
    {
      kind: "quiz",
      question: `O golem relata: "Contrato implantado e inicializado com sucesso." O que um harness bem construído faz com essa frase?`,
      options: [
        "Trata-a como uma afirmação — lê a cadeia, busca o contrato, chama uma função de visualização e acredita no ledger",
        "Aceita — modelos são treinados para ser verídicos, e este tem sido confiável até agora",
        "Pede ao golem que verifique cuidadosamente seu próprio trabalho na mesma sessão",
      ],
      answer: 0,
      explain: `Auto‑revisão pelo mesmo modelo compartilha os mesmos pontos cegos — se ele acreditou que o deploy funcionou, acreditará novamente. Verificadores independentes não compartilham esses pontos cegos, e no Stellar uma leitura via RPC custa milissegundos. O ledger é o detector de mentiras mais barato que você terá.`,
    },
    {
      kind: "theory",
      body: `## Menor privilégio: menos dentes, por favor

Um golem com \`rm -rf\` disponível é um golem que *eventualmente* o executará — não por malícia, mas por um plano confiante e errado às 2 da manhã. A solução é antiga e comprovada: **menor privilégio**.

- Conceda ferramentas para *esta tarefa*, não ferramentas em geral.
- Prefira acesso **somente leitura** sempre que escrita não for necessária.
- Limite a um diretório; sandbox tudo que for executado.
- Dê apenas **chaves de testnet** — nunca uma chave cuja perda realmente cause dano.

Permissão concedida "por precaução" é como incidentes começam. Cada ferramenta tem um raio de explosão; conceda de acordo.`,
    },
    {
      kind: "fill",
      prompt: `Delimite o poder do golem antes que ele comece a trabalhar:`,
      file: "harness.toml",
      before: `signing_keys = "`,
      after: `"`,
      choices: ["testnet", "mainnet", "all-networks", "treasury"],
      answer: 0,
      explain: `Regra prática: um golem só deve possuir chaves cuja perda total você possa ignorar. Lumens de testnet são gratuitos via friendbot; uma chave de mainnet ou do tesouro dentro de um loop automatizado é um incidente com contagem regressiva.`,
    },
    {
      kind: "theory",
      body: `## Projete o caminho de falha

Amadores projetam o que acontece quando o golem está *certo*. Engenheiros projetam o que acontece quando ele está **errado** — porque às vezes ele estará.

- Uma verificação falha **bloqueia o merge**; não registra um aviso no vazio.
- Retries têm um **orçamento**, então um golem travado se torna um golem parado, não uma conta crescente.
- Um humano revisa **um diff com contexto**, nunca um fato consumado já em produção.
- Rollback é um caminho testado, não uma oração.

Para cada passo do harness, faça a pergunta: *"quando isso está errado, o que o captura?"* Se a resposta for "esperançosamente nada dá errado" — isso é um desejo, não um design.`,
    },
    {
      kind: "quiz",
      question: `Qual destes é um caminho de falha **projetado**?`,
      options: [
        "Uma suite de testes vermelha bloqueia o auto‑merge, e um humano recebe o diff junto com a saída falha",
        "O prompt instrui firmemente o golem a ser extremamente cuidadoso e a revisar tudo duas vezes",
        "O loop tenta a mesma tarefa, sem limite, até que a saída finalmente passe",
      ],
      answer: 0,
      explain: `Instruções são esperanças — úteis, mas não *capturam* nada. Retries ilimitados são uma conta sem teto (um capítulo posterior nomeia a correção). Um caminho projetado tem um gatilho, uma parada e um humano com contexto suficiente para agir.`,
    },
    {
      kind: "theory",
      body: `## Você já esteve dentro de um o tempo todo

Olhe ao redor: **TUSST é um harness.**

O ambiente de avaliação da Forja é um mecanismo de verificação: sua solução roda isolada, testes ocultos a julgam, e nenhum texto convincente transforma um resultado vermelho em verde. Os laboratórios on‑chain vão além: eles não perguntam *se você disse* que implantou — eles **leem a cadeia** e conferem.

Essa é a disciplina em uma imagem: construa o banco de forma que estar errado seja *detectável* e estar certo seja *comprovável* — para golems e para humanos.

Próxima disciplina: as próprias palavras — o que o golem realmente vê no banco.`,
    },
  ],
};
