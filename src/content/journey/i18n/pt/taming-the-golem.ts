import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Harness engineering",
  tagline: "Harness engineering: o modelo é alugado, o arreio é seu.",
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
- **Reviewer step** — onde um humano (ou outro modelo) inspeciona o diff.

Duas equipes com o mesmo modelo e harnesses diferentes obtêm resultados *extremamente* diferentes. Quando a qualidade da saída muda, os engenheiros depuram o harness — não o horóscopo.`,
    },
    {
      kind: "diagram",
      body: "Uma bancada, em quatro partes:",
      caption: "Troque o modelo e isto sobrevive. É por isso que a bancada é o ativo, não o prompt.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "context",
            label: "o que ele enxerga",
            note: "Os arquivos, a documentação, a saída que falhou. Curado — não tudo que você tem.",
            tone: "accent",
          },
          {
            id: "tools",
            label: "o que ele pode fazer",
            note: "Um conjunto limitado de verbos. Cada um que falta é um erro que ele não comete.",
            tone: "teal",
          },
          {
            id: "run",
            label: "deixe agir",
            note: "Ele se move, e a bancada responde com honestidade em vez de concordar por educação.",
            tone: "neutral",
          },
          {
            id: "verify",
            label: "confira o trabalho",
            note: "Testes, tipos, um linter. Verificação é o que transforma saída em resultado.",
            tone: "good",
          },
        ],
      },
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

A característica mais perigosa do modelo não é ignorância — é **confiança enquanto está errado**. Ele anuncia sucesso no mesmo tom caloroso, quer o deploy tenha funcionado ou nunca tenha acontecido. Confiança é *estilo*, não sinal.

Então um harness nunca confia; ele **recheca**, usando juízes que não podem ser convencidos por conversa fiada:

- o **compilador** — ele realmente compila?
- a **suite de testes** — seus testes do Rito, vermelhos ou verdes
- o **linter** — os padrões foram mantidos?
- a **cadeia em si** — o ledger diz o que o modelo afirma?

Reclamações são dados. Verificadores são a verdade.`,
    },
    {
      kind: "quiz",
      question: `O modelo relata: "Contrato implantado e inicializado com sucesso." O que um harness bem construído faz com essa frase?`,
      options: [
        "Trata-a como uma afirmação — lê a cadeia, busca o contrato, chama uma função de visualização e acredita no ledger",
        "Aceita — modelos são treinados para ser verídicos, e este tem sido confiável até agora",
        "Pede ao modelo que verifique cuidadosamente seu próprio trabalho na mesma sessão",
      ],
      answer: 0,
      explain: `Auto‑revisão pelo mesmo modelo compartilha os mesmos pontos cegos — se ele acreditou que o deploy funcionou, acreditará novamente. Verificadores independentes não compartilham esses pontos cegos, e no Stellar uma leitura via RPC custa milissegundos. O ledger é o detector de mentiras mais barato que você terá.`,
    },
    {
      kind: "fill",
      prompt: `Complete a primeira jogada do engenheiro de arreio:`,
      file: "NOTES.md",
      before: `O modelo diz que o deploy deu certo. Antes que essa frase mude qualquer coisa, o arreio `,
      after: ` .`,
      choices: ["lê a chain e confere", "pede ao modelo que confirme", "registra a afirmação no log da execução", "refaz o deploy por garantia"],
      answer: 0,
      explain: `Pedir à mesma mente que confirme o próprio trabalho te compra o mesmo ponto cego duas vezes. E uma afirmação escrita num log continua sendo uma afirmação — só ficou com cara de oficial. Na Stellar a conferência custa uma leitura de RPC, o que faz do ledger o detector de mentiras mais barato que você vai ter.`,
    },
    {
      kind: "labLink",
      labSlug: "guild-vault",
      body: `Você pode ficar dentro de um arreio de verificação agora mesmo. O laboratório **O Cofre da Guilda** da Forja te faz elevar o limiar de assinatura de uma conta, para um tesouro exigir dois oficiais — e depois não acredita na sua palavra. O servidor lê o ledger e confere o conjunto de signatários ele mesmo. Dizer que você fez não é a conferência; a chain é.`,
    },
    {
      kind: "theory",
      body: `## A metade que é pulada

Você já consegue nomear as peças de um arreio e, mais importante, se recusar a acreditar em qualquer coisa que o modelo diga sobre o próprio trabalho.

Tudo até aqui foi sobre dar **mãos** a ele — ferramentas, um diretório, um runner. Nada até aqui fez a pergunta mais difícil: quais mãos, exatamente, e o que acontece no dia em que ele usar essas mãos num plano confiantemente errado.

**A seguir:** quanto poder o trabalho de fato precisa, e a única pergunta a fazer de cada passo que você construir.`,
    },
  ],
  testOut: [
    { question: `O que é o arreio, e por que ele importa mais que o prompt?`,
      options: ["Tudo em volta do modelo — ferramentas, permissões, diretório de trabalho, verificadores. O modelo é alugado; o arreio é seu e sobrevive a uma troca de modelo","O prompt de sistema e suas instruções, que é onde o comportamento é de fato definido","A infraestrutura do provedor, que determina latência e vazão"], answer: 0 },
    { question: `Mesmo modelo, mesmas tarefas, e a saída deste mês está bem pior. Onde o engenheiro de arreio olha primeiro?`,
      options: ["Para o que cerca o modelo — o contexto dado, as ferramentas disponíveis, as checagens que barram a saída","Para os pesos, que se degradam sob carga sustentada","Lugar nenhum — aleatoriedade de amostragem explica qualquer oscilação"], answer: 0 },
    { question: `Qual é o traço mais perigoso do modelo?`,
      options: ["Confiança estando errado — ele relata sucesso no mesmo tom caloroso, tenha acontecido algo ou não","Ignorância — há coisas que ele simplesmente nunca viu","Lentidão em tarefas longas, o que tenta as pessoas a pular a revisão"], answer: 0 },
    { question: `"Contrato publicado e inicializado com sucesso." O que um bom arreio faz com essa frase?`,
      options: ["Trata como afirmação, lê a chain, chama uma função de leitura e acredita no ledger","Aceita — o modelo tem sido confiável até agora","Pede ao modelo que confira o próprio trabalho na mesma sessão"], answer: 0 },
  ],
};
