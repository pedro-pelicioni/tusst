import type { LessonStep } from "@/content/steps";

// Localized lesson steps — PART 2 (lessons 17+ in steps.ts order).
// Same rules as steps1.ts.
export const steps2: Record<string, LessonStep[]> = {
  "mastering-option-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Na maioria dos reinos, o "nada" é uma emboscada — um null que te derruba à meia-noite. O pântano faz diferente: **a ausência faz parte do tipo**.

\`\`\`rust
enum Option<T> {
    Some(T),   // EXISTE um valor, embrulhado dentro
    None,      // não há nada — declarado com honestidade
}
\`\`\`

Você conheceu Option na estante do Acumulador. Agora vai dominá-lo.`,
    },
    {
      kind: "theory",
      body: `Uma função que pode não ter resposta diz isso na própria assinatura:

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

Repare: sem ponto e vírgula em \`Some(7)\` / \`None\` — o \`if/else\` é uma expressão, e seu resultado é retornado.`,
    },
    {
      kind: "quiz",
      question: "Por que `find` retorna `Option<i32>` em vez de um simples `i32`?",
      options: [
        "É honesto — pode não haver resposta, e o tipo deixa isso claro",
        "Option é mais rápido que i32",
        "Toda função em Rust é obrigada a retornar Option",
      ],
      answer: 0,
      explain: "O tipo obriga todo chamador a tratar o caso None. Nada de emboscadas à meia-noite.",
    },
    {
      kind: "fill",
      prompt: "Embrulhe o valor encontrado — o aldeão 7 existe.",
      file: "main.rs",
      before: "if present { ",
      after: "(7) } else { None }",
      choices: ["Some", "Ok", "Value"],
      answer: 0,
      explain: "Some embrulha a presença; None declara a ausência. (Ok pertence a Result — próximo ato.)",
    },
    {
      kind: "editor",
      intro: `### Prova final — Some, ou None?

Complete \`find\`: se \`present\` for true, retorne \`Some(7)\`; caso contrário, \`None\` — e remova o \`todo!()\`.

Saída esperada:

\`\`\`text
Some(7)
\`\`\``,
    },
  ],

  "mastering-option-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`.unwrap()\` arranca o valor de dentro de um Option:

\`\`\`rust
let x = Some(5).unwrap();   // → 5. tranquilo.
let y = ghost.unwrap();     // ghost é None → 💥 PÂNICO
\`\`\`

Diante de \`None\`, unwrap **entra em pânico** — o programa inteiro afunda. As lápides deste pântano dizem todas a mesma coisa.`,
    },
    {
      kind: "theory",
      body: `Os sobreviventes carregam um **valor padrão**:

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

Você já usou esse idioma duas vezes — na estante do Acumulador — e ele vai te proteger de novo na fortaleza de Soroban. É a runa mais útil do pântano.`,
    },
    {
      kind: "quiz",
      question: "`let ghost: Option<i32> = None;` — o que `ghost.unwrap()` faz?",
      options: [
        "Entra em pânico — o programa quebra",
        "Retorna 0",
        "Retorna None",
      ],
      answer: 0,
      explain: "Nunca dê unwrap no que você não checou. O pântano está cheio dos que deram.",
    },
    {
      kind: "fill",
      prompt: "Extraia com segurança: use 0 como padrão se o ghost for None.",
      file: "main.rs",
      before: "let value = ghost.",
      after: "(0);",
      choices: ["unwrap_or", "unwrap", "or_else"],
      answer: 0,
      explain: "unwrap_or nunca entra em pânico — a ausência vira o seu valor padrão.",
    },
    {
      kind: "editor",
      intro: `### Prova final — nunca dê unwrap às cegas

\`ghost\` é \`None\`. Extraia um valor com segurança:

1. \`let value = ghost.unwrap_or(0);\` — nenhum \`.unwrap()\` em lugar algum.
2. Imprima \`value: {}\`.

Saída esperada:

\`\`\`text
value: 0
\`\`\``,
    },
  ],

  "mastering-option-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Um \`match\` completo em um Option funciona — mas quando só o caso \`Some\` importa, o pântano tem um atalho:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);
}
\`\`\`

\`if let\` pergunta e desembrulha num golpe só: *se o padrão encaixa, dê nome ao valor e entre.*`,
    },
    {
      kind: "theory",
      body: `E ele se compõe com \`else\`, igual a um \`if\` comum:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light é o i32 desembrulhado
} else {
    println!("darkness");
}
\`\`\`

Dentro do primeiro ramo, \`light\` é um valor puro — sem Option, sem unwrap, sem perigo.`,
    },
    {
      kind: "quiz",
      question: "Em `if let Some(light) = lantern { ... }`, o que é `light` dentro das chaves?",
      options: [
        "O valor desembrulhado — um i32 puro",
        "Ainda um Option<i32>",
        "Um booleano",
      ],
      answer: 0,
      explain: "O padrão descascou o Some — lá dentro, você segura o valor em si.",
    },
    {
      kind: "fill",
      prompt: "Pergunte à lanterna: se houver luz, tome-a pelo nome.",
      file: "main.rs",
      before: "if let ",
      after: "(light) = lantern {\n    println!(\"light: {}\", light);\n}",
      choices: ["Some", "Option", "Has"],
      answer: 0,
      explain: "if let Some(light) — o padrão dá nome ao valor embrulhado.",
    },
    {
      kind: "editor",
      intro: `### Prova final — pergunte ao próprio pântano

A lanterna guarda \`Some(3)\`:

1. \`if let Some(light) = lantern\` → imprima \`light: {}\`
2. \`else\` → imprima \`darkness\`

Saída esperada:

\`\`\`text
light: 3
\`\`\``,
    },
  ],

  /* ───────────────────── Ato V · Result ───────────────────── */

  "mastering-result-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `O pântano te ensinou a *ausência*. A Alta Corte julga o **fracasso** — e o fracasso sempre declara seu motivo:

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // funcionou — aqui está o valor
    Err(E),   // falhou — aqui está o PORQUÊ
}
\`\`\`

Onde \`Option\` diz "nada", \`Result\` diz "eis o que deu errado".`,
    },
    {
      kind: "theory",
      body: `Uma função que pode falhar retorna um Result — e sentencia explicitamente:

\`\`\`rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}
\`\`\`

Sem crash, sem resposta errada em silêncio — um veredito, registrado nos autos.`,
    },
    {
      kind: "quiz",
      question: "Quando uma função deve retornar `Result` em vez de `Option`?",
      options: [
        "Quando o chamador precisa saber POR QUE falhou",
        "Quando ela nunca falha",
        "Result e Option são intercambiáveis",
      ],
      answer: 0,
      explain: "None é silencioso; Err carrega o motivo. Cortes mantêm registros.",
    },
    {
      kind: "fill",
      prompt: "Sentencie a falha: divisão por zero é um erro.",
      file: "main.rs",
      before: "if b == 0 {\n    ",
      after: "(String::from(\"division by zero\"))\n} else {\n    Ok(a / b)\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Err(motivo) — a falha com o porquê anexado.",
    },
    {
      kind: "editor",
      intro: `### Prova final — os dois vereditos

Complete \`divide\` (e remova o \`todo!()\`):

1. \`b == 0\` → \`Err(String::from("division by zero"))\`
2. Caso contrário → \`Ok(a / b)\`

Saída esperada:

\`\`\`text
Ok(5)
\`\`\``,
    },
  ],

  "mastering-result-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Um veredito lacrado chega. Você não adivinha — você usa \`match\`, e o compilador garante que **ambos** os desfechos sejam tratados:

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

Os padrões desembrulham ao casar: \`v\` é o valor, \`e\` é o motivo.`,
    },
    {
      kind: "theory",
      body: `Sobre a porta do tribunal: \`#[must_use]\`.

Significa que o Rust **te avisa** se você receber um Result e ignorá-lo — um veredito não lido é um bug esperando para acontecer. Todo Result deve ser lido, casado num match ou repassado de propósito. A Corte não esquece nada.`,
    },
    {
      kind: "quiz",
      question: "O que o compilador faz se você chamar uma função que retorna Result e ignorar o veredito?",
      options: [
        "Te avisa — Result é #[must_use]",
        "Nada — ignorar não tem problema",
        "Recusa-se a compilar, sempre",
      ],
      answer: 0,
      explain: "O aviso de Result não usado é o lema da Corte imposto em código.",
    },
    {
      kind: "fill",
      prompt: "Trate o braço da falha — desembrulhe o motivo como `e`.",
      file: "main.rs",
      before: "match verdict {\n    Ok(v) => println!(\"granted: {}\", v),\n    ",
      after: "(e) => println!(\"denied: {}\", e),\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Ok e Err — os dois braços, ambos tratados. O compilador não aceita menos que isso.",
    },
    {
      kind: "editor",
      intro: `### Prova final — lendo o julgamento

A corte te entrega \`Ok(42)\`. Case os dois vereditos:

1. \`Ok(v)\` → imprima \`granted: {}\`
2. \`Err(e)\` → imprima \`denied: {}\`

Saída esperada:

\`\`\`text
granted: 42
\`\`\``,
    },
  ],

  "mastering-result-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Casar cada Result onde ele acontece soterra sua lógica em cerimônia. Algumas cortes não julgam — elas **passam o caso para instância superior**.

A menor runa do reino:

\`\`\`rust
let n = parse("21")?;
\`\`\`

Esse \`?\` significa: *em Ok, desembrulhe e continue. Em Err, devolva o erro a quem me chamou — agora mesmo.*`,
    },
    {
      kind: "theory",
      body: `Uma condição: \`?\` só funciona dentro de uma função que **também retorna Result** — o erro precisa de um lugar para onde ir:

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // um Err sairia aqui, rumo acima
    Ok(n * 2)               // o caminho feliz fica limpo
}
\`\`\`

É assim que o código Rust de verdade se mantém legível: os erros correm morro acima, a lógica fica plana.`,
    },
    {
      kind: "quiz",
      question: "O que o `?` faz quando o Result é `Err`?",
      options: [
        "Retorna o Err da função atual imediatamente",
        "Entra em pânico",
        "Converte para None",
      ],
      answer: 0,
      explain: "Uma marca, e o julgamento corre morro acima até quem te chamou.",
    },
    {
      kind: "fill",
      prompt: "Propague: desembrulhe em Ok, retorne para cima em Err.",
      file: "main.rs",
      before: "let n = parse(\"21\")",
      after: ";\nOk(n * 2)",
      choices: ["?", ".unwrap()", "!"],
      answer: 0,
      explain: "? propaga; unwrap entra em pânico. Na corte, nunca se entra em pânico.",
    },
    {
      kind: "editor",
      intro: `### Prova final — a marca da propagação

Complete \`double_first\` (e remova o \`todo!()\`):

1. \`let n = parse("21")?;\`
2. Retorne \`Ok(n * 2)\`.

Saída esperada:

\`\`\`text
Ok(42)
\`\`\``,
    },
  ],

  /* ───────────────── Ato VI · Stellar 101 (conceitual) ───────────────── */

  "stellar-101-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bem-vindo ao céu, Forgeborn. **Stellar** é um ledger público — um livro de contas compartilhado que nenhum poder controla sozinho, liquidando pagamentos em ~5 segundos.

Cada ator nele é uma **conta** (uma fortaleza-estelar), controlada por um **par de chaves** (keypair): duas chaves, nascidas juntas, com deveres opostos.`,
    },
    {
      kind: "theory",
      body: `As duas chaves:

- **Chave pública** — começa com \`G\`. Seu endereço. Grite-a das torres; é assim que os outros te encontram e te pagam.
- **Chave secreta** — começa com \`S\`. Assina tudo o que você faz. **Nunca** a compartilhe, nunca a cole, nunca a comite. Perdeu → a conta se foi para sempre. Não há balcão de suporte no céu.

E para sequer existir no ledger, uma conta guarda uma **reserva base mínima: 1 XLM**.`,
    },
    {
      kind: "quiz",
      question: "Alguém pede seu endereço para te enviar lumens. Qual chave você entrega?",
      options: [
        "A chave pública G... — ela existe para isso",
        "A chave secreta S... — ela prova que a conta é sua",
        "As duas, por garantia",
      ],
      answer: 0,
      explain: "G é para compartilhar. S assina — quem a segurar é DONO da sua conta.",
    },
    {
      kind: "quiz",
      question: "Você perde sua chave secreta (S...). E agora?",
      options: [
        "A conta é irrecuperável — nada mais pode assinar por ela",
        "O suporte da Stellar pode resetá-la",
        "A chave pública pode regenerá-la",
      ],
      answer: 0,
      explain: "Sem custodiante, sem reset. A seed É a propriedade — guarde-a com a vida.",
    },
    {
      kind: "fill",
      prompt: "Preencha a carta: qual selo inicia uma chave **pública**?",
      file: "star-chart.toml",
      before: "public_key_starts_with = \"",
      after: "\"",
      choices: ["G", "S", "X"],
      answer: 0,
      explain: "G para o endereço que você compartilha; S para a seed que você guarda.",
    },
    {
      kind: "editor",
      intro: `### Prova final — a carta da fortaleza-estelar

Complete a carta: os dois selos, e a reserva base (em XLM) que uma conta precisa para existir.

Saída esperada:

\`\`\`text
star-keep chartered ✓
\`\`\``,
    },
  ],

  "stellar-101-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A moeda nativa do céu é o **lumen (XLM)**. Sua menor centelha é o **stroop**:

\`\`\`text
1 XLM = 10,000,000 stroops
\`\`\`

Dez milhões. Todos os valores no ledger são contados, na verdade, em stroops — as casas decimais são para humanos.`,
    },
    {
      kind: "theory",
      body: `Toda transação paga um pequeno pedágio — a **taxa base: 100 stroops** (0,00001 XLM).

Não é receita. É antisspam: caro o bastante para impedir que alguém inunde o céu de ruído, barato o bastante para que um milhão de pagamentos reais custe cerca de um dólar. Quando o tráfego dispara, as taxas sobem por um breve momento — um leilão por espaço.`,
    },
    {
      kind: "quiz",
      question: "Quanto custa, aproximadamente, enviar um pagamento na Stellar?",
      options: [
        "100 stroops — um centésimo de centavo",
        "1 XLM por pagamento",
        "Uma porcentagem do valor enviado",
      ],
      answer: 0,
      explain: "Fixa, minúscula, antisspam. O valor que você envia não muda o pedágio.",
    },
    {
      kind: "fill",
      prompt: "Quantos stroops formam um lumen?",
      file: "star-chart.toml",
      before: "stroops_per_lumen = ",
      after: "",
      choices: ["10_000_000", "1_000", "100"],
      answer: 0,
      explain: "Dez milhões de centelhas por lumen.",
    },
    {
      kind: "editor",
      intro: `### Prova final — o pedágio do portão

Preencha a placa: stroops por lumen, e a taxa base em stroops.

Saída esperada:

\`\`\`text
toll paid ✓
\`\`\``,
    },
  ],

  "stellar-101-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `O céu carrega mais do que lumens. **Qualquer conta pode emitir um ativo** — dólares, ouro, ingressos, pontos. Um ativo é definido por duas coisas juntas:

- um **código de ativo**: \`USDC\`, \`EURC\`, ...
- seu **emissor**: a conta \`G...\` que o criou

Mesmo código, emissor diferente → um ativo completamente diferente. O emissor É a identidade.`,
    },
    {
      kind: "theory",
      body: `Mas eis a regra de consentimento do céu: sua conta não pode segurar um ativo que ela não aceitou explicitamente.

Uma **trustline** é essa aceitação — uma ponte que você abre da sua conta para um ativo de um emissor:

\`\`\`text
trustline = "aceito USDC, emitido por G...CENTRE"
\`\`\`

Sem trustline, sem saldo — pagamentos naquele ativo simplesmente não conseguem te alcançar. (Cada trustline aberta também aumenta um pouco sua reserva.)`,
    },
    {
      kind: "quiz",
      question: "Alguém te envia USDC, mas você nunca abriu uma trustline para ele. O que acontece?",
      options: [
        "O pagamento falha — sem ponte, sem carga",
        "Ele chega como XLM no lugar",
        "Ele espera numa fila de pendências",
      ],
      answer: 0,
      explain: "O céu leva o consentimento a sério: você não segura nada que não aceitou.",
    },
    {
      kind: "quiz",
      question: "Dois ativos, ambos chamados USDC, de dois emissores diferentes. São o mesmo ativo?",
      options: [
        "Não — código + emissor definem o ativo; o emissor é a identidade",
        "Sim — o que importa é o código",
        "Só se tiverem o mesmo preço",
      ],
      answer: 0,
      explain: "Qualquer um pode chamar um ativo de USDC. QUEM o emitiu é aquilo em que você confia.",
    },
    {
      kind: "fill",
      prompt: "O emissor de um ativo é sempre... que tipo de coisa?",
      file: "star-chart.toml",
      before: "asset_issuer_starts_with = \"",
      after: "\"   # emissores são contas",
      choices: ["G", "S", "USD"],
      answer: 0,
      explain: "Emissores são contas — identificadas pela sua chave pública G... .",
    },
    {
      kind: "editor",
      intro: `### Prova final — abra a ponte de luz

Preencha a trustline para **USDC**: o código do ativo, e o selo com que todo endereço de emissor começa.

Saída esperada:

\`\`\`text
light-bridge opened ✓
\`\`\``,
    },
  ],

  "stellar-101-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Tudo converge. Uma **operação de pagamento** precisa de exatamente três coisas:

1. **destino** — a conta que recebe (\`G...\`)
2. **ativo** — o que você está enviando (\`XLM\` para o lumen nativo)
3. **valor** — quanto

Você a assina com sua chave secreta, paga o pedágio de ~100 stroops e, em ~5 segundos, ela é **final**. Sem bancos. Sem dias úteis. Sem fronteiras.`,
    },
    {
      kind: "theory",
      body: `A jornada completa do seu pagamento:

\`\`\`text
monte a operação
  → assine com sua chave S...
    → envie à rede
      → os validadores concordam (~5s)
        → final. para sempre. no ledger.
\`\`\`

Este é o céu que o Beholder quebrou — e o que você está prestes a reacender. Depois deste Portão: Soroban, onde o ledger executa o *seu* Rust.`,
    },
    {
      kind: "quiz",
      question: "O que torna uma operação de pagamento válida para envio?",
      options: [
        "Estar assinada com a chave secreta do remetente",
        "O destinatário aprová-la primeiro",
        "Um banco compensá-la em 2 dias úteis",
      ],
      answer: 0,
      explain: "A assinatura é a autoridade — por isso a chave S... é sagrada.",
    },
    {
      kind: "fill",
      prompt: "Registre a carga: o código do ativo nativo.",
      file: "star-chart.toml",
      before: "asset = \"",
      after: "\"",
      choices: ["XLM", "USD", "STR"],
      answer: 0,
      explain: "XLM — o lumen, o ativo nativo do céu.",
    },
    {
      kind: "editor",
      intro: `### Prova final — a primeira luz cruzando o céu

Registre o pagamento: o selo do destino, o código do ativo nativo, e envie **25**.

Saída esperada:

\`\`\`text
lumens flowing ✓
\`\`\``,
    },
  ],

  /* ───────────────── Ato VII · Soroban (pressupõe domínio de Rust) ───────────────── */

  "soroban-smart-contracts-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Forgeborn, as regras mudam além do Portão. Um **contrato Soroban** é uma biblioteca Rust compilada para WASM e armazenada no ledger da Stellar — onde qualquer um pode invocá-la.

\`\`\`rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env};
\`\`\`

\`#![no_std]\` não é decoração: não há SO, não há alocador, não há \`std\` on-chain. O ledger é a máquina, e o \`soroban_sdk\` agora é a sua biblioteca padrão.`,
    },
    {
      kind: "theory",
      body: `Dois atributos transformam Rust puro em contrato:

\`\`\`rust
#[contract]
pub struct HelloContract;      // a identidade do contrato

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env) -> Symbol { ... }
}
\`\`\`

\`#[contractimpl]\` exporta cada \`pub fn\` como um ponto de entrada invocável. Cada uma recebe \`Env\` primeiro — seu acesso ao storage, aos eventos e a outros contratos.`,
    },
    {
      kind: "theory",
      body: `On-chain, cada byte é aluguel. Strings são pesadas — então identificadores curtos usam \`Symbol\`, um tipo compacto do ledger:

\`\`\`rust
use soroban_sdk::{symbol_short, Symbol};

let s: Symbol = symbol_short!("beacon");  // ≤ 9 caracteres, [a-zA-Z0-9_]
\`\`\`

Onde um dev web retorna \`"ok"\`, um dev Soroban retorna \`symbol_short!("ok")\`.`,
    },
    {
      kind: "quiz",
      question: "Por que um contrato Soroban começa com `#![no_std]`?",
      options: [
        "Não há SO nem alocador on-chain — a std completa não pode existir lá",
        "Deixa a compilação mais rápida",
        "É estilo opcional — a std funciona normalmente on-chain",
      ],
      answer: 0,
      explain: "O WASM no ledger não tem sistema operacional por baixo. O SDK substitui a std.",
    },
    {
      kind: "fill",
      prompt: "Exporte o bloco impl como a interface pública do contrato.",
      file: "lib.rs",
      before: "#[contract]\npub struct HelloContract;\n\n",
      after: "\nimpl HelloContract {\n    pub fn hello(env: Env) -> Symbol { /* ... */ }\n}",
      choices: ["#[contractimpl]", "#[contract]", "#[export]"],
      answer: 0,
      explain: "#[contract] marca a struct; #[contractimpl] exporta as funções.",
    },
    {
      kind: "editor",
      intro: `### Prova final — grave a primeira runa celeste

1. Marque o bloco impl com \`#[contractimpl]\`.
2. Faça \`hello\` retornar \`symbol_short!("beacon")\` — e remova o \`todo!()\`.

Invocação esperada:

\`\`\`text
hello() → Symbol(beacon)
\`\`\``,
    },
  ],

  "soroban-smart-contracts-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Contratos **não guardam memória entre invocações** — toda variável local morre quando a chamada retorna. O estado vive no **ledger**, atrás de \`env.storage()\`.

Para estado do contrato inteiro (contadores, config, admin), a prateleira certa é o **instance storage**:

\`\`\`rust
env.storage().instance()
\`\`\`

Ele compartilha o tempo de vida do próprio contrato — arquivado e restaurado junto com ele.`,
    },
    {
      kind: "theory",
      body: `Ler e escrever são simétricos, e tudo passa **por referência**:

\`\`\`rust
const COUNTER: Symbol = symbol_short!("COUNTER");

let count: u32 = env.storage().instance()
    .get(&COUNTER)
    .unwrap_or(0);

env.storage().instance().set(&COUNTER, &count);
\`\`\`

\`get\` retorna um \`Option<T>\` — a chave pode nunca ter sido escrita, ou o aluguel dela (TTL) pode ter expirado. \`unwrap_or(0)\` é o idioma do contador.`,
    },
    {
      kind: "quiz",
      question: "Por que `storage().get(&KEY)` retorna um `Option<T>` em vez de `T`?",
      options: [
        "A chave pode nunca ter sido escrita — ou o TTL dela expirou",
        "Todas as funções do SDK retornam Option por consistência",
        "Para forçar tratamento de erro em incompatibilidades de tipo",
      ],
      answer: 0,
      explain: "O storage do ledger é alugado, não possuído. Ausência é um estado normal — trate-a.",
    },
    {
      kind: "fill",
      prompt: "Use 0 como padrão quando o contador nunca tiver sido escrito.",
      file: "lib.rs",
      before: "let count: u32 = env.storage().instance().get(&COUNTER).",
      after: ";",
      choices: ["unwrap_or(0)", "unwrap()", "expect(\"0\")"],
      answer: 0,
      explain: "unwrap() entraria em pânico na primeira chamada — unwrap_or(0) faz da ausência um ponto de partida.",
    },
    {
      kind: "editor",
      intro: `### Prova final — faça o ledger lembrar

Implemente \`increment\`:

1. Leia o count do instance storage sob \`&COUNTER\` — padrão \`0\`.
2. Some \`1\`.
3. \`set(&COUNTER, &count)\` para gravar de volta.
4. Retorne o novo count (e remova o \`todo!()\`).

Invocação esperada:

\`\`\`text
increment() → 1
\`\`\``,
    },
  ],

  "soroban-smart-contracts-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Qualquer um pode invocar uma função pública de contrato, passando **qualquer** \`Address\` como argumento. Então como um cofre sabe que o chamador é mesmo quem diz ser?

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    from.require_auth();   // ← o selo
    // ...
}
\`\`\`

\`require_auth()\` verifica que \`from\` de fato **assinou** (ou pré-autorizou) esta exata invocação. Se não, a chamada dá **trap** — revertida, estado intocado.`,
    },
    {
      kind: "theory",
      body: `Esta é a linha cuja ausência ergueu a fortaleza do Beholder. Sem ela:

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    // sem require_auth ← qualquer um passa o SEU endereço e te drena
}
\`\`\`

A regra do reino: **toda função que move valor ou altera o estado de alguém exige o auth dessa pessoa — primeira linha, antes de qualquer coisa.**`,
    },
    {
      kind: "quiz",
      question: "O que acontece quando `from.require_auth()` falha?",
      options: [
        "A invocação dá trap — tudo é revertido, estado intocado",
        "Retorna false e a função continua",
        "Registra um aviso no ledger",
      ],
      answer: 0,
      explain: "Falha de auth não é uma condição a tratar — ela mata a invocação na hora.",
    },
    {
      kind: "fill",
      prompt: "Sele o cofre: exija a autorização do signatário.",
      file: "lib.rs",
      before: "pub fn withdraw(env: Env, from: Address, amount: i128) {\n    from.",
      after: ";\n    // lógica de transferência...\n}",
      choices: ["require_auth()", "verify()", "is_signed()"],
      answer: 0,
      explain: "require_auth() — a linha mais importante do Soroban.",
    },
    {
      kind: "editor",
      intro: `### Prova final — o selo do signatário

Proteja o cofre: em \`withdraw\`, exija a autorização de \`from\` **antes** de qualquer outra coisa.

Uma linha. O Beholder caiu pela falta dela.

Invocação esperada:

\`\`\`text
withdraw: authorized ✓
\`\`\``,
    },
  ],

  // ---- Ato VIII — Stellar Protocol 27 ("O Zipper") -------------------------

  "stellar-protocol-27-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `O Beholder se foi — e o próprio céu está mudando. A Stellar se atualiza **por consenso**: os validadores votam para armar uma nova versão do protocolo e, num ledger agendado, a *rede inteira* vira de uma vez. Sem forks, sem retardatários.

Isso é um **protocol upgrade**: uma única virada coordenada do céu.`,
    },
    {
      kind: "theory",
      body: `O **Protocol 27**, codinome **"Zipper"**, é o upgrade de 2026 — e sua linha do tempo já aconteceu:

- Stellar Core estável — **5 de junho de 2026**
- SDKs — 5–11 de junho · RPC e Galexie — 10 de junho · Horizon — 12 de junho
- **Testnet atualizada — 18 de junho de 2026**
- **Voto da Mainnet — 8 de julho de 2026**

O plano completo está no [guia oficial de upgrade do Protocol 27](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide).`,
    },
    {
      kind: "theory",
      body: `O que o Zipper muda de fato? As duas grandes novidades vivem no [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md):

1. **Delegação de autenticação** — custom accounts podem entregar sua verificação de auth a outro contrato.
2. **Assinaturas vinculadas ao endereço** — um selo que só abre a própria porta.

(Upgrades anteriores trouxeram os CAP-0055, 0060 e 0064 — o Zipper é sobre como as contas *provam quem são*.) Acompanhe as versões dos componentes em [Software Versions](https://developers.stellar.org/docs/networks/software-versions).`,
    },
    {
      kind: "quiz",
      question: "Como um protocol upgrade da Stellar entra em vigor?",
      options: [
        "Os validadores votam para armá-lo; no ledger agendado a rede inteira vira de uma vez",
        "Cada nó atualiza quando quiser e as versões coexistem",
        "A Foundation aperta um botão nos próprios servidores",
      ],
      answer: 0,
      explain: "Consenso, não decreto: o voto arma, um ledger vira o céu inteiro.",
    },
    {
      kind: "quiz",
      question: "Quando aconteceu o voto da Mainnet para o Protocol 27?",
      options: ["8 de julho de 2026", "18 de junho de 2026", "Ainda não aconteceu"],
      answer: 0,
      explain: "A Testnet virou em 18 de junho; a Mainnet votou em 8 de julho de 2026. O Zipper está no ar.",
    },
    {
      kind: "fill",
      prompt: "Arme o farol com a versão que os validadores votaram.",
      file: "lib.rs",
      before: "pub const PROTOCOL_VERSION: u32 = ",
      after: ";",
      choices: ["27", "26", "28"],
      answer: 0,
      explain: "Protocol 27 — o Zipper. (28 é onde as credenciais V1 vão morrer.)",
    },
    {
      kind: "editor",
      intro: `### Prova final — acenda o farol do upgrade

Registre os fatos da reforja:

1. \`PROTOCOL_VERSION\` — a versão que a rede votou.
2. \`CODENAME\` — em minúsculas.
3. \`MAINNET_VOTE\` — \`YYYY-MM-DD\`.

Esperado:

\`\`\`text
beacon lit: protocol 27 (zipper) ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `No Covil você selou um cofre com \`require_auth()\`. Mas quem *verifica* o selo?

Para uma conta normal, o protocolo confere uma assinatura ed25519 contra as chaves da conta. Mas um \`Address\` no Soroban também pode pertencer a um **contrato** — e aí algo notável acontece.`,
    },
    {
      kind: "theory",
      body: `Quando \`require_auth\` dispara para um \`Address\` de contrato, o host invoca o ponto de entrada do próprio contrato:

\`\`\`rust
pub fn __check_auth(
    env: Env,
    signature_payload: Hash<32>,
    signatures: ...,
    auth_contexts: Vec<Context>,
) { ... }
\`\`\`

A conta **é** um contrato, e \`__check_auth\` é a sua lei particular das assinaturas. Aprove retornando; rejeite com trap.`,
    },
    {
      kind: "theory",
      body: `Toda **custom account** é apenas um \`__check_auth\` diferente:

- **Multisig** — exija 2 de 3 assinaturas
- **Social recovery** — deixe amigos de confiança rotacionar uma chave perdida
- **Passkeys** — verifique uma assinatura WebAuthn em vez de ed25519
- **Account abstraction** — qualquer regra que você consiga escrever em Rust

Construtores como a OpenZeppelin já forjavam essas contas; [o Protocol 27 torna as partes difíceis nativas](https://developers.stellar.org/meetings/2026/04/30#protocol-discussion-modular-custom-accounts-and-signature-security-in-protocol-27).`,
    },
    {
      kind: "quiz",
      question: "Quem invoca `__check_auth`?",
      options: [
        "O host do Soroban, sempre que require_auth dispara para um Address de uma custom account",
        "O usuário, manualmente, antes de cada transação",
        "O compilador, em tempo de build",
      ],
      answer: 0,
      explain: "É o callback do host: seu contrato vira o juiz dos próprios selos.",
    },
    {
      kind: "fill",
      prompt: "Nomeie o ponto de entrada que o host chama numa custom account.",
      file: "lib.rs",
      before: "impl GuardianAccount {\n    pub fn ",
      after: "(env: Env, payload: Hash<32>, sig: BytesN<64>, ctx: Vec<Context>) {",
      choices: ["__check_auth", "check_auth", "require_auth"],
      answer: 0,
      explain: "Underscore duplo: __check_auth é o nome reservado que o host procura.",
    },
    {
      kind: "editor",
      intro: `### Prova final — a conta escreve a própria lei

1. Exporte o bloco impl com \`#[contractimpl]\`.
2. Renomeie o placeholder para o ponto de entrada que o host realmente chama.

Esperado:

\`\`\`text
__check_auth: the account writes its own law ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Uma coroa que guarda todos os cofres sozinha logo se parte. Contas de verdade querem dizer: *"deixe meu guardião responder por mim."*

Antes do Zipper não havia suporte do protocolo para isso — os construtores improvisavam a delegação com frágeis rodadas de **pré-simulação** para propagar o contexto de auth. Funcionava. Por pouco. Às vezes.`,
    },
    {
      kind: "theory",
      body: `O Protocol 27 (CAP-0071-01) faz da delegação uma lei, com duas novas host functions:

\`\`\`rust
// APENAS dentro de __check_auth:
delegate_account_auth(&delegate, &payload);

// e para o contrato sendo chamado:
get_delegated_signers_for_current_auth_check()
\`\`\`

A primeira entrega a verificação de auth atual à lógica de assinatura do delegado. A segunda revela quais signatários delegados aprovaram.`,
    },
    {
      kind: "theory",
      body: `O formato de transporte ganhou o upgrade correspondente: o tipo de credencial \`SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES\` empacota signatários delegados e suas assinaturas numa **única** entrada de autorização.

Transações menores, simulação mais simples — a delegação deixa de ser gambiarra frágil e vira padrão suportado. Spec completa: [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) · [recap do CAP-71](https://developers.stellar.org/meetings/2026/04/30#cap-71-recap-authentication-delegation-for-custom-accounts).`,
    },
    {
      kind: "quiz",
      question: "O que `delegate_account_auth` permite a uma custom account fazer?",
      options: [
        "Entregar a verificação de auth atual à lógica de assinatura de um contrato delegado",
        "Transferir a posse da conta permanentemente",
        "Pular a verificação de assinatura por completo",
      ],
      answer: 0,
      explain: "A coroa continua sua — só a *verificação* vai para o guardião, chamada a chamada.",
    },
    {
      kind: "fill",
      prompt: "Entregue esta verificação de auth ao guardião armazenado — do jeito do Protocol 27.",
      file: "lib.rs",
      before: "// dentro de __check_auth:\n",
      after: "(&delegate, &signature_payload);",
      choices: ["delegate_account_auth", "require_auth", "get_delegated_signers_for_current_auth_check"],
      answer: 0,
      explain: "delegate_account_auth — só pode ser chamada dentro de __check_auth, nova no Protocol 27.",
    },
    {
      kind: "editor",
      intro: `### Prova final — delegue a coroa

O \`Address\` do guardião já está carregado. Chame \`delegate_account_auth\` com o delegado e o signature payload — e remova o \`todo!()\`.

Esperado:

\`\`\`text
crown delegated: steward honored ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `O truque do Espectro do Eco, em termos simples — um **replay de assinatura**. As auditorias de segurança descobriram que ele exige três coisas ao mesmo tempo:

1. Um contrato estilo admin que **não nomeia o endereço do signatário** no payload assinado.
2. O admin é **rotacionado** para um endereço diferente…
3. …e os dois endereços compartilham a **mesma chave privada**.

Aí um selo feito para a porta antiga abre a nova. Mints duplicados. Movimentos não autorizados.`,
    },
    {
      kind: "theory",
      body: `Essa combinação exata **nunca ocorreu on-chain** — mas o estrago possível justificou uma correção no protocolo.

O **\`SOROBAN_CREDENTIALS_ADDRESS_V2\`** (CAP-0071-02) vincula o signature payload ao endereço para o qual foi criado. Um eco roubado não abre mais uma porta diferente.

O antigo \`SOROBAN_CREDENTIALS_ADDRESS\` continua válido **até o Protocol 28** — uma janela de migração, não um precipício.`,
    },
    {
      kind: "theory",
      body: `Até migrar, existe uma salvaguarda provisória para contratos estilo admin: **inclua você mesmo o endereço do signatário no payload** — assim a rotação com chave compartilhada não pode ser ecoada.

\`\`\`rust
let me: Address = env.current_contract_address();
// anexe \`me\` ao material assinado
\`\`\`

Assista ao mergulho técnico: [Stellar Developer Meeting — signature security](https://www.youtube.com/watch?v=5O1cDDGv7_o).`,
    },
    {
      kind: "quiz",
      question: "Que ataque as credenciais V2 eliminam?",
      options: [
        "Repetir um signature payload válido contra outra conta que compartilha a mesma chave de assinatura",
        "Força bruta em chaves privadas ed25519",
        "Front-running de transações antes de chegarem ao ledger",
      ],
      answer: 0,
      explain: "Payloads vinculados ao endereço: o selo nomeia sua porta, e o eco morre.",
    },
    {
      kind: "quiz",
      question: "Por quanto tempo o antigo SOROBAN_CREDENTIALS_ADDRESS continua válido?",
      options: [
        "Até o upgrade do Protocol 28",
        "Parou de funcionar no momento em que o Protocol 27 ativou",
        "Para sempre — o V2 é opcional",
      ],
      answer: 0,
      explain: "Uma janela de migração: adote o V2 no seu ritmo, mas antes do Protocol 28.",
    },
    {
      kind: "fill",
      prompt: "Pronuncie a credencial que ata o selo à sua porta.",
      file: "lib.rs",
      before: "pub const CREDENTIALS: &str = \"SOROBAN_CREDENTIALS_",
      after: "\";",
      choices: ["ADDRESS_V2", "ADDRESS", "ADDRESS_WITH_DELEGATES"],
      answer: 0,
      explain: "V2 = payloads vinculados ao endereço. (WITH_DELEGATES é o pacote de delegação da VIII.3.)",
    },
    {
      kind: "editor",
      intro: `### Prova final — ate o selo

1. Atualize \`CREDENTIALS\` para o nome V2.
2. Registre até qual protocolo o V1 continua válido.
3. Em \`binding_address\`, retorne o próprio \`Address\` deste contrato via \`env.current_contract_address()\` — remova o \`todo!()\`.

Esperado:

\`\`\`text
seal bound to its door: the echo dies ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Nada cruza para o céu reforjado sem mudar. A caravana de releases viajou em ordem estrita:

**Core → SDKs → RPC e Galexie → Horizon → Testnet → Mainnet**

Todo SDK — Rust, JavaScript, Go, Java, Python, iOS, PHP, .NET, Flutter, Elixir — lançou uma versão Protocol 27. Todos precisam de upgrade antes de a Mainnet virar. Confira o seu em [Software Versions](https://developers.stellar.org/docs/networks/software-versions).`,
    },
    {
      kind: "theory",
      body: `A única **breaking change** que a maioria dos apps sente:

\`\`\`ts
// antes do Zipper:
import { xdr } from "@stellar/stellar-base";

// depois — o pacote base foi consolidado:
import { xdr } from "@stellar/stellar-sdk";
\`\`\`

Renomeie o import e a caravana segue. O resto das notas de migração está na [orientação oficial](https://developers.stellar.org/meetings/2026/04/30#migration-guidance).`,
    },
    {
      kind: "theory",
      body: `O checklist de migração do Forgeborn:

1. **Atualize todo SDK** e biblioteca cliente.
2. **Renomeie** imports de \`stellar-base\` para \`stellar-sdk\`.
3. **Planeje a mudança para credenciais V2** antes do Protocol 28.
4. **Operadores de nó**: Core, RPC, Galexie, Horizon — tudo atualizado antes do voto.

O [guia de upgrade](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide) tem o manifesto completo.`,
    },
    {
      kind: "quiz",
      question: "Seu app JS importa de `@stellar/stellar-base`. Depois do Protocol 27…",
      options: [
        "Troque o import — o pacote foi consolidado em @stellar/stellar-sdk",
        "Nada muda; ele continua sendo publicado separadamente",
        "Você precisa reescrever o app em Rust",
      ],
      answer: 0,
      explain: "Um rename. O pacote base entrou no sdk e não saiu mais.",
    },
    {
      kind: "fill",
      prompt: "Conserte o import para ele cruzar o Portal.",
      file: "app.ts",
      before: "import { xdr } from \"@stellar/stellar-",
      after: "\";",
      choices: ["sdk", "base", "core"],
      answer: 0,
      explain: "O stellar-base foi consolidado no stellar-sdk nas releases do Protocol 27.",
    },
    {
      kind: "editor",
      intro: `### Prova final — libere o manifesto da caravana

1. \`JS_XDR_PACKAGE\` — o pacote que absorveu o antigo base.
2. \`TESTNET_UPGRADE\` — \`YYYY-MM-DD\`.
3. \`UPGRADE_ALL_SDKS\` — *todo* SDK cruza o Portal?

Esperado:

\`\`\`text
caravan cleared the Gate: nothing left behind ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `O Espectro vem atrás do seu cofre com um selo roubado e um eco perfeito. Disponha o que você forjou pelo Céu Reescrito:

- \`__check_auth\` — a lei da sua própria conta (VIII.2)
- \`delegate_account_auth\` — a coroa-guardiã (VIII.3)
- selos vinculados ao endereço — o mata-eco (VIII.4)

Hora de combinar os três numa única conta.`,
    },
    {
      kind: "theory",
      body: `O plano do \`ZipperAccount\`, dentro de \`__check_auth\`:

\`\`\`rust
// 1) a chave pública do signatário-raiz, do storage:
let signer: BytesN<32> = env.storage().instance().get(&SIGNER).unwrap();

// 2) um selo falso precisa dar trap:
env.crypto().ed25519_verify(&signer, &payload.into(), &signature);

// 3) o golpe do Protocol 27 — entregue o resto ao guardião:
delegate_account_auth(...)
\`\`\`

Assinatura primeiro, delegação depois. O eco do Espectro morre no passo 2; um guardião forjado morre no passo 3.`,
    },
    {
      kind: "quiz",
      question: "Dentro de `__check_auth`, o que derrota o replay do Espectro do Eco?",
      options: [
        "Verificar um payload vinculado a esta conta — um eco roubado não casa com outro endereço",
        "Assinar duas vezes mais rápido que o Espectro",
        "Chamar require_auth em si mesmo, recursivamente",
      ],
      answer: 0,
      explain: "Selos atados + assinaturas verificadas: o eco fica sem porta para abrir.",
    },
    {
      kind: "fill",
      prompt: "Um selo falso precisa dar trap — verifique a assinatura sobre o payload.",
      file: "lib.rs",
      before: "env.crypto().",
      after: "(&signer, &signature_payload.into(), &signature);",
      choices: ["ed25519_verify", "sha256", "delegate_account_auth"],
      answer: 0,
      explain: "ed25519_verify dá trap numa assinatura inválida — exatamente o que um selo deve fazer.",
    },
    {
      kind: "editor",
      intro: `### O último eco do Espectro

Dentro de \`__check_auth\`:

1. Carregue o signatário-raiz (\`BytesN<32>\`) do storage sob \`SIGNER\`.
2. Verifique a assinatura ed25519 sobre o payload — \`env.crypto().ed25519_verify(...)\`.
3. Carregue o guardião sob \`DELEGATE\` e chame \`delegate_account_auth\`.

Exporte o bloco impl. Nenhum \`todo!()\` sobrevive ao final.

Esperado:

\`\`\`text
__check_auth: signature verified, steward honored — the echo is silent ✓
\`\`\``,
    },
  ],
};
