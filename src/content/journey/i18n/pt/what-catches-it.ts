import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Menor privilégio e caminhos de falha",
  tagline: "Menor privilégio e caminhos de falha: toda ferramenta é um raio de destruição.",
  steps: [
    {
      kind: "theory",
      body: `## Menor privilégio: menos dentes, por favor

Um modelo com \`rm -rf\` disponível é um modelo que *eventualmente* o executará — não por malícia, mas por um plano confiante e errado às 2 da manhã. A solução é antiga e comprovada: **menor privilégio**.

- Conceda ferramentas para *esta tarefa*, não ferramentas em geral.
- Prefira acesso **somente leitura** sempre que escrita não for necessária.
- Limite a um diretório; sandbox tudo que for executado.
- Dê apenas **chaves de testnet** — nunca uma chave cuja perda realmente cause dano.

Permissão concedida "por precaução" é como incidentes começam. Cada ferramenta tem um raio de explosão; conceda de acordo.`,
    },
    {
      kind: "widget",
      component: "blast-radius",
      body: `Dois medidores, e eles não andam juntos. **Conceda ao modelo o que uma tarefa de consertar-e-provar precisa**, depois continue acrescentando — e veja qual barra responde.`,
    },
    {
      kind: "fill",
      prompt: `Delimite o poder do modelo antes que ele comece a trabalhar:`,
      file: "harness.toml",
      before: `signing_keys = "`,
      after: `"`,
      choices: ["testnet", "mainnet", "all-networks", "treasury"],
      answer: 0,
      explain: `Regra prática: um modelo só deve possuir chaves cuja perda total você possa ignorar. Lumens de testnet são gratuitos via friendbot; uma chave de mainnet ou do tesouro dentro de um loop automatizado é um incidente com contagem regressiva.`,
    },
    {
      kind: "theory",
      body: `## A concessão que ninguém lembra de ter feito

Conceder demais raramente é uma decisão. É uma terça-feira à tarde.

O modelo precisa conferir um saldo, então ganha acesso à rede — de forma estreita, para aquilo. Uma semana depois ele precisa instalar uma dependência, então a rede fica aberta. Alguém está depurando um problema de mainnet e larga uma chave real no ambiente "só para esta execução", e ninguém remove, porque remover é uma tarefa e nada está quebrado no momento.

Agora volte e faça a pergunta que o arreio existe para responder: *quando isto der errado, o que pega?* Rede aberta mais chave real mais um plano confiantemente errado não é um perfil de risco hipotético. São três terças-feiras comuns, empilhadas.

A auditoria é barata e ninguém faz: **liste o que o modelo tem hoje e, para cada item, nomeie a tarefa que precisou daquilo.** Qualquer coisa sem nome nessa coluna é uma concessão que ninguém lembra de ter feito.`,
    },
    {
      kind: "quiz",
      question: `Você acrescenta rede aberta e escrita em qualquer lugar a um modelo que já lê o repositório, roda testes, escreve num diretório e tem chaves de testnet. O que essas duas concessões compraram?`,
      options: [
        "Quase nenhuma capacidade nova, e um salto grande no raio de destruição",
        "Um salto grande nos dois — foi essa a troca que você aceitou",
        "Sobretudo capacidade, já que acesso à rede destrava quase toda tarefa",
      ],
      answer: 0,
      explain: `Este é o formato que vale internalizar: a capacidade satura cedo e o raio de destruição não. As primeiras concessões fazem quase todo o trabalho útil, o que significa que as acrescentadas "só por garantia" são quase sempre exposição pura. Conceda para a tarefa que está na sua frente, não para a que você talvez imagine depois.`,
    },
    {
      kind: "theory",
      body: `## Projete o caminho de falha

Amadores projetam o que acontece quando o modelo está *certo*. Engenheiros projetam o que acontece quando ele está **errado** — porque às vezes ele estará.

- Uma verificação falha **bloqueia o merge**; não registra um aviso no vazio.
- Retries têm um **orçamento**, então um modelo travado se torna um modelo parado, não uma conta crescente.
- Um humano revisa **um diff com contexto**, nunca um fato consumado já em produção.
- Rollback é um caminho testado, não uma oração.

Para cada passo do harness, faça a pergunta: *"quando isso está errado, o que o captura?"* Se a resposta for "esperançosamente nada dá errado" — isso é um desejo, não um design.`,
    },
    {
      kind: "diagram",
      body: "Um desejo e um caminho projetado, lado a lado:",
      caption:
        "Os dois parecem cautela num code review. Só um deles faz alguma coisa no dia que importa.",
      view: {
        kind: "compare",
        columns: [
          { id: "wish", label: "um desejo", tone: "bad" },
          { id: "designed", label: "um caminho projetado", tone: "good" },
        ],
        rows: [
          { label: "o que é", cells: [{ text: "\"tenha cuidado e confira duas vezes\"", tone: "bad" }, { text: "uma suíte vermelha que barra o merge", tone: "good" }] },
          { label: "quando o modelo erra", cells: [{ text: "ele segue em frente, confiante", tone: "bad" }, { text: "ele para no fio de disparo", tone: "good" }] },
          { label: "quem descobre", cells: [{ text: "quem esbarrar no bug", tone: "bad" }, { text: "um humano, com o diff e a falha", tone: "good" }] },
          { label: "quando", cells: [{ text: "em produção, depois", tone: "bad" }, { text: "antes de qualquer merge", tone: "good" }] },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Qual destes é um caminho de falha **projetado**?`,
      options: [
        "Uma suite de testes vermelha bloqueia o auto‑merge, e um humano recebe o diff junto com a saída falha",
        "O prompt instrui firmemente o modelo a ser extremamente cuidadoso e a revisar tudo duas vezes",
        "O loop tenta a mesma tarefa, sem limite, até que a saída finalmente passe",
      ],
      answer: 0,
      explain: `Instruções são esperanças — úteis, mas não *capturam* nada. Retries ilimitados são uma conta sem teto (um capítulo posterior nomeia a correção). Um caminho projetado tem um gatilho, uma parada e um humano com contexto suficiente para agir.`,
    },
    {
      kind: "theory",
      body: `## Você esteve dentro de um esse tempo todo

Olhe em volta: **o TUSST é um arreio.**

O runner avaliado da Forja é um arreio de verificação — sua solução executa num sandbox, provas escondidas a julgam, e nenhuma quantidade de prosa confiante transforma um vermelho em verde. Os labs on-chain vão além: eles não perguntam *se você diz* que fez o deploy — eles **leem a chain** e conferem.

É a disciplina numa imagem: construa a bancada de modo que errar seja *detectável* e acertar seja *demonstrável* — para modelos e para humanos.

**A seguir:** as palavras em si — o que o modelo de fato vê na bancada.`,
    },
  ],
  testOut: [
    { question: `Por que dar chaves de testnet e não de mainnet a um laço automatizado?`,
      options: ["Um modelo só deve segurar chaves cuja perda total você consiga dar de ombros — lumens do friendbot são de graça, uma chave de tesouraria é um incidente com contagem regressiva","Chaves de mainnet são recusadas pela maioria dos SDKs em contexto automatizado","Transações de testnet são mais rápidas, então o laço itera antes"], answer: 0 },
    { question: `Qual destes é um caminho de falha projetado?`,
      options: ["Uma suíte vermelha barra o auto-merge, e um humano recebe o diff mais a saída da falha","O prompt instrui firmemente o modelo a ter cuidado e conferir tudo duas vezes","O laço repete a mesma tarefa sem limite até algo passar"], answer: 0 },
    { question: `Qual é a única pergunta a fazer de cada passo de um arreio?`,
      options: ["Quando isto der errado, o que pega?","Com que frequência esse passo falha na prática?","Esse passo pode ficar mais rápido ou mais barato?"], answer: 0 },
    { question: `Você dá ao modelo rede aberta e permissão de escrever em qualquer lugar. O que isso comprou de fato?`,
      options: ["Quase nenhuma capacidade extra, e uma porção grande de raio de destruição — o formato clássico da concessão \"só por garantia\"","Ganhos mais ou menos proporcionais em capacidade e em risco","Mais capacidade que risco, já que a maioria das tarefas acaba precisando dos dois"], answer: 0 },
  ],
};
