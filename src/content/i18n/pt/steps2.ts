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
      prompt: "Preencha a carta: qual sigilo inicia uma chave **pública**?",
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

Complete a carta: os dois sigilos, e a reserva base (em XLM) que uma conta precisa para existir.

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

Preencha a trustline para **USDC**: o código do ativo, e o sigilo com que todo endereço de emissor começa.

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

Registre o pagamento: o sigilo do destino, o código do ativo nativo, e envie **25**.

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
};
