import type { LessonStep } from "@/content/steps";

// Localized lesson steps — PART 1 (lessons 1–16 in steps.ts order).
// Keyed by lesson slug; a missing slug falls back to the English steps.
// Translate ONLY prose (body, question, options, prompt, explain, intro).
// Never touch code blocks' code, answer indexes, files, or option order.
export const steps1: Record<string, LessonStep[]> = {
  "rust-fundamentals-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Boas-vindas ao **Rust**, a linguagem que os antigos Forgeborn usavam para manter o céu inteiro.

Todo programa em Rust começa na função \`main\` — o ponto de entrada. Quando seu programa roda, é \`main\` que é chamada.

\`\`\`rust
fn main() {
    // suas runas vão aqui
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Para imprimir texto no console, o Rust te dá a **macro** \`println!\`.

\`\`\`rust
println!("your text here");
\`\`\`

O \`!\` significa que é uma *macro*, não uma função — você vai aprender por que isso importa mais tarde. Por enquanto: viu um \`!\`, pense "macro".`,
    },
    {
      kind: "quiz",
      question: "O que o `!` em `println!` te diz?",
      options: [
        "É uma macro, não uma função",
        "O texto é impresso em voz alta",
        "A linha nunca pode falhar",
      ],
      answer: 0,
      explain: "O `!` marca a invocação de uma macro — println! é a mais famosa do Rust.",
    },
    {
      kind: "fill",
      prompt: "Complete a runa para que ela imprima texto no console.",
      file: "main.rs",
      before: "fn main() {\n    ",
      after: `("Hello, World!");\n}`,
      choices: ["println!", "print", "echo!"],
      answer: 0,
      explain: "println! imprime o texto seguido de uma nova linha.",
    },
    {
      kind: "quiz",
      question: "Instruções em Rust terminam com…",
      options: ["um ponto e vírgula ;", "um ponto final .", "nada — quebras de linha bastam"],
      answer: 0,
      explain: "O farol é pedante: toda instrução termina com `;`.",
    },
    {
      kind: "editor",
      intro: `### Prova final — pronuncie as palavras do despertar

Faça o programa imprimir **exatamente**:

\`\`\`text
Hello, World!
\`\`\`

Maiúsculas importam: H maiúsculo, W maiúsculo. O texto vai entre aspas duplas, dentro dos parênteses — e não esqueça o ponto e vírgula.`,
    },
  ],

  "rust-fundamentals-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Programas precisam **lembrar** valores para exibi-los ou alterá-los. Para isso, o Rust tem **variáveis**, declaradas com \`let\`:

\`\`\`rust
let score = 50;
\`\`\`

Como baús etiquetados, variáveis têm conteúdo — e nomes que dizem o que há dentro.`,
    },
    {
      kind: "theory",
      body: `Eis a velha lei do arsenal: variáveis em Rust são **imutáveis por padrão**. Uma vez vinculado, o valor não pode mudar.

\`\`\`rust
let x = 5;
x = 10; // ❌ erro de compilação: não é possível atribuir duas vezes
\`\`\`

O compilador — seu aliado mais severo — vai se recusar a forjar isso.`,
    },
    {
      kind: "quiz",
      question: "O que acontece quando você compila isto?\n\n`let x = 5; x = 10;`",
      options: [
        "Erro de compilação — x é imutável",
        "x vira 10",
        "x vira 15",
      ],
      answer: 0,
      explain: "Uma vez forjado, nunca mudado — a menos que você declare o contrário.",
    },
    {
      kind: "theory",
      body: `Para permitir reatribuição, declare sua intenção ao próprio aço com \`mut\`:

\`\`\`rust
let mut x = 5;
x = 10; // ✅ tudo certo
\`\`\`

\`mut\` é uma promessa feita em voz alta: *este valor vai mudar*.`,
    },
    {
      kind: "fill",
      prompt: "Torne `score` reforjável — declare a variável como mutável.",
      file: "main.rs",
      before: "let ",
      after: " score = 50;\nscore = 100;",
      choices: ["mut", "var", "flex"],
      answer: 0,
      explain: "let mut score = 50; — agora a reatribuição compila.",
    },
    {
      kind: "quiz",
      question: "Qual declaração permite reatribuição mais tarde?",
      options: ["let mut power = 7;", "let power = 7;", "immutable power = 7;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Prova final — reforje a lâmina

O código inicial declara \`score\` de forma imutável e depois tenta alterá-la — não vai compilar. Conserte:

1. Torne \`score\` **mutável**.
2. Mantenha a reatribuição para \`100\`.
3. Imprima a pontuação final com \`println!("score: {}", score);\`

Saída esperada:

\`\`\`text
score: 100
\`\`\``,
    },
  ],

  /* ───────────────────────── Act I · 3–6 ───────────────────────── */

  "rust-fundamentals-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Todo valor em Rust tem um **tipo** — sua forma. Pense nos frascos de Ferrisia: cada um leva um rótulo do que há dentro.

As três formas que você mais vai usar:

- \`i32\` — um **número inteiro**: \`3\`, \`-7\`, \`2026\`
- \`f64\` — um **número decimal**: \`2.5\`, \`0.1\`
- \`bool\` — um **valor sim/não**: \`true\` ou \`false\``,
    },
    {
      kind: "theory",
      body: `O Rust geralmente consegue adivinhar o tipo — mas você pode rotulá-lo por conta própria, e a Cidadela prefere que você o faça:

\`\`\`rust
let torches: i32 = 3;
let weight: f64 = 2.5;
let is_lit: bool = true;
\`\`\`

O padrão é sempre o mesmo: \`let nome: tipo = valor;\` — o rótulo vem depois do nome, atrás de dois-pontos.`,
    },
    {
      kind: "quiz",
      question: "Qual tipo serve para o valor `4.5`?",
      options: ["f64 — um número decimal", "i32 — um número inteiro", "bool — um valor sim/não"],
      answer: 0,
      explain: "Qualquer coisa com ponto decimal precisa de um tipo de ponto flutuante como f64.",
    },
    {
      kind: "fill",
      prompt: "Rotule o frasco: `is_open` guarda `true` — um valor sim/não.",
      file: "main.rs",
      before: "let is_open: ",
      after: " = true;",
      choices: ["bool", "i32", "yes"],
      answer: 0,
      explain: "true e false vivem no tipo bool.",
    },
    {
      kind: "quiz",
      question: "Onde vai o rótulo de tipo?\n\n`let age ___ = 12;`",
      options: [": i32 — depois do nome, atrás de dois-pontos", "i32: — antes do nome", "as i32 — depois do valor"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Prova final — rotule os frascos

Três frascos sem rótulo estão na prateleira. Adicione o tipo a cada um:

1. \`age\` é um número inteiro → \`i32\`
2. \`price\` é um decimal → \`f64\`
3. \`is_open\` é sim/não → \`bool\`

Saída esperada:

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\``,
    },
  ],

  "rust-fundamentals-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Você vem escrevendo código dentro de \`main\` — mas um programa que é só \`main\` é uma forja com uma única receita gigante pregada na parede.

Uma **função** é uma receita que você escreve uma vez e usa para sempre: recebe ingredientes, faz o trabalho e devolve um resultado.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Leia a receita parte por parte:

- \`fn double\` — o **nome** da receita
- \`(x: i32)\` — o **ingrediente** e seu tipo
- \`-> i32\` — o tipo do que **volta**

E o segredo da última linha: \`x * 2\` **não tem ponto e vírgula**. Em Rust, a expressão final sem ponto e vírgula *é* o valor retornado.`,
    },
    {
      kind: "quiz",
      question: "Em `fn double(x: i32) -> i32 { x * 2 }`, por que `x * 2` não tem ponto e vírgula?",
      options: [
        "É o valor de retorno — expressões sem ; são devolvidas",
        "Pontos e vírgulas são opcionais em Rust",
        "É um erro de digitação",
      ],
      answer: 0,
      explain: "A última expressão sem ponto e vírgula é o que a função retorna.",
    },
    {
      kind: "fill",
      prompt: "Complete a assinatura da receita: ela retorna um `i32`.",
      file: "main.rs",
      before: "fn add(a: i32, b: i32) ",
      after: " i32 {\n    a + b\n}",
      choices: ["->", "=>", ":"],
      answer: 0,
      explain: "-> declara o tipo de retorno. (=> pertence aos braços de match.)",
    },
    {
      kind: "quiz",
      question: "Como você chama a receita `add` com 2 e 3, guardando o resultado?",
      options: ["let sum = add(2, 3);", "let sum = add 2 3;", "call add(2, 3) into sum;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Prova final — escreva a receita

\`main\` já chama \`add(2, 3)\` — mas a receita ainda não existe. Escreva-a abaixo de \`main\`:

1. Nome: \`add\`, parâmetros \`a: i32\` e \`b: i32\`.
2. Retorna um \`i32\`.
3. Retorna \`a + b\` — **sem ponto e vírgula** nessa linha.

Saída esperada:

\`\`\`text
2 + 3 = 5
\`\`\``,
    },
  ],

  "rust-fundamentals-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Agora a lei que faz o Rust ser *Rust* — a que está gravada na porta do cofre:

**Todo valor tem exatamente um dono.**

\`\`\`rust
let sword = String::from("blade");
\`\`\`

Aqui \`sword\` é **dona** daquela String. Um tesouro, um guardião. Sem exceções.`,
    },
    {
      kind: "theory",
      body: `Entregue o tesouro a outro nome, e a posse (ownership) **se move**:

\`\`\`rust
let a = String::from("gem");
let b = a;            // a gema agora pertence a b
println!("{}", a);    // ❌ erro: a não possui nada
\`\`\`

Isso não é crueldade — é assim que o Rust sabe exatamente quem deve limpar cada valor, sem garbage collector e sem vazamentos.`,
    },
    {
      kind: "quiz",
      question: "Depois de `let b = a;` (onde `a` é uma String), o que você pode fazer com `a`?",
      options: [
        "Nada — a posse se moveu para b",
        "Usá-la normalmente",
        "Lê-la, mas não alterá-la",
      ],
      answer: 0,
      explain: "O valor se moveu. Estenda a mão para a de novo e as proteções vão te queimar — em tempo de compilação.",
    },
    {
      kind: "theory",
      body: `Às vezes você precisa mesmo de **dois** tesouros. Então você forja uma cópia real e independente:

\`\`\`rust
let b = a.clone();   // ✅ duas Strings, dois donos
\`\`\`

\`.clone()\` custa trabalho de verdade — os ferreiros o usam de propósito, não por hábito.`,
    },
    {
      kind: "fill",
      prompt: "Mantenha os dois nomes utilizáveis: faça de `copy` uma cópia de verdade em vez de um move.",
      file: "main.rs",
      before: "let sword = String::from(\"blade\");\nlet copy = sword",
      after: ";",
      choices: [".clone()", ".copy()", ".dup()"],
      answer: 0,
      explain: "clone() forja uma String independente — os dois donos seguem vivos.",
    },
    {
      kind: "editor",
      intro: `### Prova final — a lei do guardião único

O código inicial move \`sword\` para \`copy\` e depois tenta usar \`sword\` de novo — as proteções recusam. Conserte **clonando** em vez de mover.

Saída esperada:

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\``,
    },
  ],

  "rust-fundamentals-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Clonar tudo levaria a forja à falência. O Guardião dos Empréstimos ensina um caminho melhor:

**Você não precisa entregar um valor para que alguém o leia. Empreste-o.**

Uma **referência** (\`&\`) permite que uma função *pegue emprestado* um valor — e ele volta para a sua mão automaticamente quando ela termina.`,
    },
    {
      kind: "theory",
      body: `Duas pequenas marcas fazem tudo funcionar:

\`\`\`rust
fn inspect(item: &String) {  // ① pega emprestado, não toma
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);               // ② empreste com &
println!("{}", gem);         // ✅ ainda é sua
\`\`\`

\`&String\` na receita, \`&gem\` na chamada. Empresta, lê, devolvido.`,
    },
    {
      kind: "quiz",
      question: "O que `&` significa em `inspect(&gem)`?",
      options: [
        "Emprestar gem — inspect pega emprestado e devolve",
        "Mover gem para dentro de inspect permanentemente",
        "Fazer uma cópia completa de gem",
      ],
      answer: 0,
      explain: "Uma referência pega emprestado. A posse nunca sai das suas mãos.",
    },
    {
      kind: "fill",
      prompt: "Conserte a receita para que ela *pegue emprestado* o nome em vez de tomá-lo.",
      file: "main.rs",
      before: "fn greet(who: ",
      after: ") {\n    println!(\"welcome, {}\", who);\n}",
      choices: ["&String", "String", "clone String"],
      answer: 0,
      explain: "&String pega emprestado — main mantém a posse do nome.",
    },
    {
      kind: "editor",
      intro: `### Prova final — empreste a lâmina

\`greet\` atualmente **toma** o nome, então \`main\` o perde. Conserte as duas marcas:

1. O parâmetro vira \`who: &String\`.
2. A chamada vira \`greet(&name);\`

Saída esperada:

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\``,
    },
  ],

  /* ───────────────────────── Act II · control flow ───────────────────────── */

  "control-flow-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Até agora seus programas correm em linha reta, linha por linha. Mas o labirinto exige **decisões**.

\`if\` executa código somente quando uma condição é verdadeira:

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
}
\`\`\`

A condição (\`torches > 0\`) precisa ser um \`bool\` — uma pergunta de verdadeiro/falso. Não precisa de parênteses em volta dela.`,
    },
    {
      kind: "theory",
      body: `\`else\` captura tudo o que o \`if\` não pegou:

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
} else {
    println!("Darkness...");
}
\`\`\`

Exatamente uma das duas portas se abre. Nunca ambas, nunca nenhuma.`,
    },
    {
      kind: "quiz",
      question: "Com `let torches = 0;`, o que o código acima imprime?",
      options: ["Darkness...", "The hall is lit", "Nada"],
      answer: 0,
      explain: "0 > 0 é falso, então a porta do else se abre.",
    },
    {
      kind: "fill",
      prompt: "Complete a condição: entre no cofre somente se `keys` for maior que 0.",
      file: "main.rs",
      before: "if keys ",
      after: " 0 {\n    println!(\"enter\");\n}",
      choices: [">", "=", "=>"],
      answer: 0,
      explain: "> pergunta \"maior que?\". Um único = é atribuição, não uma pergunta.",
    },
    {
      kind: "editor",
      intro: `### Prova final — as duas portas

A câmara tem \`torches = 3\`. Escreva a decisão:

1. **Se** \`torches > 0\` → imprima \`The hall is lit\`
2. **Senão** → imprima \`Darkness...\`

Saída esperada:

\`\`\`text
The hall is lit
\`\`\``,
    },
  ],

  "control-flow-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Uma corrente de \`if / else if / else\` fica desajeitada rápido. Para "comparar um valor contra muitas possibilidades", o Rust tem algo mais afiado: \`match\`.

\`\`\`rust
match number {
    1 => println!("one"),
    2 => println!("two"),
    _ => println!("many"),
}
\`\`\`

Cada linha é um **braço** (arm): \`padrão => o que fazer\`.`,
    },
    {
      kind: "theory",
      body: `Duas regras fazem do \`match\` o favorito do Overlord:

1. **Todo caso precisa ser coberto.** O braço \`_\` significa "qualquer outra coisa" — esqueça-o e o compilador se recusa.
2. **Um match produz um valor** que você pode guardar:

\`\`\`rust
let word = match number {
    1 => "one",
    _ => "many",
};
\`\`\``,
    },
    {
      kind: "quiz",
      question: "O que o braço `_` significa em um match?",
      options: [
        "Qualquer outra coisa — o caso pega-tudo",
        "Um valor vazio",
        "Pular este match",
      ],
      answer: 0,
      explain: "match precisa cobrir todas as possibilidades; _ varre o resto.",
    },
    {
      kind: "fill",
      prompt: "Complete o braço: a porta `2` leva ao centro.",
      file: "main.rs",
      before: "let path = match door {\n    1 => \"left\",\n    2 ",
      after: " \"center\",\n    _ => \"no door\",\n};",
      choices: ["=>", "->", ":"],
      answer: 0,
      explain: "Braços de match usam => (funções usam -> para tipos de retorno).",
    },
    {
      kind: "editor",
      intro: `### Prova final — cada reflexo nomeado

\`door = 2\`. Monte o match:

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. \`_\` → \`"no door"\`
4. Guarde o resultado em \`path\`, depois \`println!("{}", path);\`

Saída esperada:

\`\`\`text
center
\`\`\``,
    },
  ],

  "control-flow-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Às vezes você precisa repetir algo até que *você* decida parar. A repetição mais simples do Rust é o \`loop\` — ele roda **para sempre**:

\`\`\`rust
loop {
    println!("again...");
}
\`\`\`

Para sempre. A menos que você escape.`,
    },
    {
      kind: "theory",
      body: `\`break\` é a palavra de fuga — ela sai do loop imediatamente:

\`\`\`rust
let mut count = 0;
loop {
    count += 1;      // += soma e guarda: count = count + 1
    if count == 3 {
        break;       // fora!
    }
}
\`\`\`

Repare em \`==\` (uma pergunta: "igual?") versus \`=\` (uma ordem: "guarde isto").`,
    },
    {
      kind: "quiz",
      question: "O que acontece com um `loop` sem nenhum `break` dentro?",
      options: [
        "Ele roda para sempre — o programa nunca segue adiante",
        "Ele roda uma vez",
        "O compilador adiciona um break automaticamente",
      ],
      answer: 0,
      explain: "Viajantes que o percorrem para sempre viram parte da parede.",
    },
    {
      kind: "fill",
      prompt: "Escape quando a contagem chegar a 3.",
      file: "main.rs",
      before: "loop {\n    count += 1;\n    if count == 3 {\n        ",
      after: ";\n    }\n}",
      choices: ["break", "stop", "exit"],
      answer: 0,
      explain: "break sai do loop no meio do passo.",
    },
    {
      kind: "editor",
      intro: `### Prova final — quebre o corredor sem fim

1. Dentro de um \`loop\`, some \`1\` a \`echoes\` a cada passagem (\`echoes += 1;\`).
2. Quando \`echoes == 3\`, \`break\`.

Saída esperada:

\`\`\`text
escaped after 3 echoes
\`\`\``,
    },
  ],

  "control-flow-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`loop\` + \`if\` + \`break\` funciona, mas existe uma runa mais limpa quando a condição de saída é conhecida de antemão: \`while\`.

\`\`\`rust
while floors > 0 {
    println!("descending...");
    floors -= 1;
}
\`\`\`

**Enquanto a condição valer, repita.** A checagem acontece *antes* de cada passagem — se ela for falsa desde o início, o corpo nunca roda.`,
    },
    {
      kind: "quiz",
      question: "Com `let mut floors = 0;`, quantas vezes `while floors > 0 { ... }` roda?",
      options: [
        "Zero — a condição é checada antes da primeira passagem",
        "Uma vez, depois para",
        "Para sempre",
      ],
      answer: 0,
      explain: "while primeiro checa, depois age. 0 > 0 já é falso.",
    },
    {
      kind: "theory",
      body: `Um perigo: se a condição nunca se tornar falsa, o \`while\` repete para sempre — igual ao \`loop\`.

Por isso o corpo geralmente **muda** algo de que a condição depende:

\`\`\`rust
while floors > 0 {
    floors -= 1;   // ← a maré que encerra o loop
}
\`\`\``,
    },
    {
      kind: "fill",
      prompt: "Continue descendo enquanto houver andares restantes.",
      file: "main.rs",
      before: "",
      after: " floors > 0 {\n    println!(\"floor {}\", floors);\n    floors -= 1;\n}",
      choices: ["while", "until", "if"],
      answer: 0,
      explain: "while repete; if decide só uma vez.",
    },
    {
      kind: "editor",
      intro: `### Prova final — vença a maré

1. **Enquanto** \`floors > 0\`: imprima \`floor {}\`, depois \`floors -= 1;\`
2. Depois do loop: imprima \`Ground level!\`

Saída esperada:

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\``,
    },
  ],

  "control-flow-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Quando você conhece o caminho de antemão — "todo número de 1 a 5" — administrar seu próprio contador está abaixo de você. O \`for\` percorre a sequência por você:

\`\`\`rust
for n in 1..=5 {
    println!("step {}", n);
}
\`\`\`

A cada passagem, \`n\` assume o próximo valor: 1, 2, 3, 4, 5. Sem contador para esquecer, sem como passar do ponto.`,
    },
    {
      kind: "theory",
      body: `\`1..=5\` é um **range** (intervalo) — e o \`=\` importa:

- \`1..=5\` → 1, 2, 3, 4, **5** (inclusivo)
- \`1..5\` → 1, 2, 3, 4 (para *antes* do 5)

O erro de "um a menos" (off-by-one) é a armadilha mais antiga do labirinto. O \`=\` é como você a desarma.`,
    },
    {
      kind: "quiz",
      question: "Quais números `for n in 1..4` produz?",
      options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"],
      answer: 0,
      explain: "Sem o =, o range para antes do fim.",
    },
    {
      kind: "fill",
      prompt: "Percorra as pedras de 1 a 5 — **incluindo** a 5.",
      file: "main.rs",
      before: "for n in 1",
      after: "5 {\n    println!(\"step {}\", n);\n}",
      choices: ["..=", "..", "to"],
      answer: 0,
      explain: "..= inclui a pedra final.",
    },
    {
      kind: "editor",
      intro: `### Prova final — os passos contados

Atravesse as cinco pedras do caminho:

1. \`for\` sobre o range \`1..=5\`
2. Imprima \`step {}\` para cada número.

Saída esperada:

\`\`\`text
step 1
step 2
step 3
step 4
step 5
\`\`\``,
    },
  ],

  "control-flow-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Você conhece todas as runas agora — \`if\`, \`match\`, \`loop\`, \`while\`, \`for\`. O labirinto do Overlord exige que você as **combine**: uma decisão *dentro* de uma repetição.

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `O novo símbolo \`%\` devolve o **resto** de uma divisão:

- \`7 % 3\` → \`1\` (7 ÷ 3 = 2, resto **1**)
- \`9 % 3\` → \`0\` (divide exato)

Então \`n % 3 == 0\` pergunta: *"n é divisível por 3?"* — o jeito clássico de achar cada terceiro espelho.`,
    },
    {
      kind: "quiz",
      question: "Quanto é `10 % 3`?",
      options: ["1 — o resto de 10 ÷ 3", "3 — o resultado da divisão", "0 — divide exato"],
      answer: 0,
      explain: "10 = 3×3 + 1. O operador % te entrega esse 1.",
    },
    {
      kind: "fill",
      prompt: "Faça a pergunta: `n` é divisível por 3?",
      file: "main.rs",
      before: "if n % 3 ",
      after: " 0 {\n    println!(\"mirror\");\n}",
      choices: ["==", "=", "%"],
      answer: 0,
      explain: "== compara. Um único = tentaria atribuir.",
    },
    {
      kind: "editor",
      intro: `### Prova final — o labirinto do Overlord

Percorra os dez espelhos:

1. \`for n in 1..=10\`
2. **Se** \`n % 3 == 0\` → imprima \`mirror\`
3. **Senão** → imprima o número \`n\`

Saída esperada:

\`\`\`text
1
2
mirror
4
5
mirror
7
8
mirror
10
\`\`\``,
    },
  ],

  /* ───────────────────── Act III · standard library ───────────────────── */

  "rust-standard-library-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Uma variável guarda **um** valor. Mas aventuras produzem *listas*: itens, moedas, nomes. Para isso, a ferramenta favorita do reino é o \`Vec\` — um alforje que cresce:

\`\`\`rust
let mut items = vec!["torch", "rope"];
\`\`\`

\`vec![...]\` o cria já com conteúdo dentro. Ele precisa de \`mut\` se você planeja alterá-lo — e você planeja.`,
    },
    {
      kind: "theory",
      body: `Dois movimentos que você vai usar o tempo todo:

\`\`\`rust
items.push("map");    // adiciona ao final — o alforje cresce
items.len()           // quantos dentro? → 3
\`\`\`

E a regra dos deuses antigos: posições contam **a partir do zero**. \`items[0]\` é \`"torch"\`, \`items[1]\` é \`"rope"\`.`,
    },
    {
      kind: "quiz",
      question: "Depois de `let mut v = vec![10, 20]; v.push(30);` — quanto é `v[0]`?",
      options: ["10 — posições contam a partir do zero", "30 — push o coloca primeiro", "20 — o segundo item"],
      answer: 0,
      explain: "push adiciona ao FINAL; a indexação começa em 0, como os deuses antigos determinaram.",
    },
    {
      kind: "fill",
      prompt: "Faça o alforje crescer: adicione `\"map\"` ao final.",
      file: "main.rs",
      before: "let mut satchel = vec![\"torch\", \"rope\"];\nsatchel.",
      after: "(\"map\");",
      choices: ["push", "add", "append_one"],
      answer: 0,
      explain: "push adiciona um item ao final de um Vec.",
    },
    {
      kind: "editor",
      intro: `### Prova final — arrume o alforje

1. Crie um \`satchel\` **mutável** com \`vec!["torch", "rope"]\`.
2. Dê \`push\` em \`"map"\`.
3. Imprima \`items: {}\` com \`satchel.len()\`.

Saída esperada:

\`\`\`text
items: 3
\`\`\``,
    },
  ],

  "rust-standard-library-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Conheça os trabalhadores mais preguiçosos do reino: os **iteradores**. Um iterador promete percorrer uma coleção — e então não faz *nada* até você exigir um resultado.

\`\`\`rust
coins.iter()   // uma corrente de espíritos preguiçosos, esperando
\`\`\`

Você já os comandou sem saber: \`for n in 1..=5\` move um iterador por baixo dos panos.`,
    },
    {
      kind: "theory",
      body: `A mágica está em **terminar a corrente**. Peça um resultado, e os espíritos finalmente trabalham:

\`\`\`rust
let coins = vec![5, 10, 25];
let total: i32 = coins.iter().sum();   // → 40
\`\`\`

O rótulo de tipo \`: i32\` em \`total\` diz ao \`.sum()\` o que produzir — não o pule.`,
    },
    {
      kind: "quiz",
      question: "O que `coins.iter()` faz **sozinho**, sem nenhum `.sum()` depois?",
      options: [
        "Nada ainda — iteradores são preguiçosos até serem coletados",
        "Soma as moedas imediatamente",
        "Copia o Vec inteiro",
      ],
      answer: 0,
      explain: "Eles não levantam um dedo até você coletar. Essa preguiça é o que torna as correntes baratas.",
    },
    {
      kind: "fill",
      prompt: "Termine a corrente: faça os espíritos somarem tudo.",
      file: "main.rs",
      before: "let total: i32 = coins.iter().",
      after: "();",
      choices: ["sum", "total", "add_all"],
      answer: 0,
      explain: ".sum() consome a corrente e retorna um único valor.",
    },
    {
      kind: "editor",
      intro: `### Prova final — colete a fortuna

\`coins = vec![5, 10, 25]\`.

1. Some-as: \`let total: i32 = coins.iter().sum();\`
2. Imprima \`total: {}\`.

Saída esperada:

\`\`\`text
total: 40
\`\`\``,
    },
  ],

  "rust-standard-library-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A armadilha favorita do Hoarder: um Vec com 2 itens, e um aventureiro esticando a mão para o compartimento 5.

\`\`\`rust
let vault = vec!["hammer", "chisel"];
vault[5]   // 💥 PANIC — o programa quebra
\`\`\`

Colchetes *presumem* que o compartimento existe. Presunções, nos cofres, são fatais.`,
    },
    {
      kind: "theory",
      body: `A pergunta educada é \`.get()\`:

\`\`\`rust
vault.get(0)   // → Some(&"hammer")  — o compartimento existe
vault.get(5)   // → None             — sem quebra, só "nada aqui"
\`\`\`

Essa resposta \`Some / None\` é uma \`Option\` — seu primeiro gostinho do Pântano Evanescente. Combine-a com um plano B: \`vault.get(5).unwrap_or(&"nothing")\`.`,
    },
    {
      kind: "quiz",
      question: "`vault` tem 2 itens. O que `vault.get(5)` retorna?",
      options: [
        "None — um tranquilo \"nada aqui\"",
        "Ele quebra o programa",
        "O último item",
      ],
      answer: 0,
      explain: "get nunca quebra — ele responde Some(&item) ou None.",
    },
    {
      kind: "fill",
      prompt: "Peça o compartimento 5 **educadamente** — quebrar não é permitido.",
      file: "main.rs",
      before: "let tool = vault.",
      after: "(5).unwrap_or(&\"nothing\");",
      choices: ["get", "[]", "grab"],
      answer: 0,
      explain: "get(5) retorna uma Option; unwrap_or fornece o plano B.",
    },
    {
      kind: "editor",
      intro: `### Prova final — a prateleira que pode estar vazia

O cofre tem 2 ferramentas. Peça o compartimento \`5\` mesmo assim — com segurança:

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. Imprima \`found: {}\`.

Saída esperada:

\`\`\`text
found: nothing
\`\`\``,
    },
  ],

  "rust-standard-library-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Um Vec responde por **posição**. Mas o livro-razão do Hoarder responde por **nome**: pergunte "ouro?" e ele diz "100".

Isso é um \`HashMap\` — chaves vinculadas a valores:

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
\`\`\`

Ele vive mais fundo nos cofres (\`std::collections\`), então precisa da linha \`use\` no topo.`,
    },
    {
      kind: "theory",
      body: `Escrevendo e lendo o livro-razão:

\`\`\`rust
ledger.insert("gold", 100);     // vincula chave → valor
ledger.insert("silver", 250);

println!("{}", ledger["gold"]); // pergunta pela chave → 100
\`\`\`

As entradas **não mantêm ordem alguma** — o encantamento troca ordem por respostas instantâneas.`,
    },
    {
      kind: "quiz",
      question: "O que acontece se você fizer `insert(\"gold\", 999)` quando \"gold\" já existe?",
      options: [
        "O valor antigo é substituído — um valor por chave",
        "O map guarda os dois valores",
        "Ele quebra com um erro de duplicata",
      ],
      answer: 0,
      explain: "Uma chave se vincula a exatamente um valor; inserir de novo o sobrescreve.",
    },
    {
      kind: "fill",
      prompt: "Registre o tesouro: vincule `\"gold\"` a `100`.",
      file: "main.rs",
      before: "ledger.",
      after: "(\"gold\", 100);",
      choices: ["insert", "push", "set"],
      answer: 0,
      explain: "HashMaps usam insert(key, value) — push pertence ao Vec.",
    },
    {
      kind: "editor",
      intro: `### Prova final — o livro-razão encantado

1. Insira \`("gold", 100)\` e \`("silver", 250)\`.
2. Imprima \`gold: {}\` usando \`ledger["gold"]\`.

Saída esperada:

\`\`\`text
gold: 100
\`\`\``,
    },
  ],

  "rust-standard-library-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Você conheceu a \`String\` no cofre da posse — agora aprenda a fazê-la **crescer**:

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");   // anexa texto ao final
\`\`\`

\`push_str\` é o cinzel das inscrições vivas. (Seu primo \`push\` adiciona um único caractere.)`,
    },
    {
      kind: "theory",
      body: `E o feitiço de tecelagem — \`format!\`:

\`\`\`rust
let banner = format!("The {}", s);
\`\`\`

Funciona **exatamente** como \`println!\` — os mesmos encaixes \`{}\` — mas em vez de imprimir, ele te entrega a nova String para guardar.`,
    },
    {
      kind: "quiz",
      question: "Qual é a diferença entre `println!(\"The {}\", s)` e `format!(\"The {}\", s)`?",
      options: [
        "println! imprime; format! retorna a String em vez disso",
        "format! é mais rápido",
        "println! não pode usar encaixes {}",
      ],
      answer: 0,
      explain: "Mesmo feitiço, destino diferente — o console, ou as suas mãos.",
    },
    {
      kind: "fill",
      prompt: "Faça a inscrição crescer: anexe `\" of the Vaults\"`.",
      file: "main.rs",
      before: "let mut title = String::from(\"Keeper\");\ntitle.",
      after: "(\" of the Vaults\");",
      choices: ["push_str", "push", "append"],
      answer: 0,
      explain: "push_str anexa texto; push anexa um único caractere.",
    },
    {
      kind: "editor",
      intro: `### Prova final — a inscrição viva

1. Anexe \`" of the Vaults"\` a \`title\` com \`push_str\`.
2. \`let banner = format!("The {}", title);\`
3. Imprima o banner.

Saída esperada:

\`\`\`text
The Keeper of the Vaults
\`\`\``,
    },
  ],

  "rust-standard-library-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `O Hoarder não deixa tesouro sair — mas deixa você **olhar**. Um **slice** (fatia) é uma janela para um trecho de uma coleção:

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

Nenhuma cópia é feita. O \`&\` a marca como empréstimo — você está olhando a prateleira do Hoarder, não a carregando para fora.`,
    },
    {
      kind: "theory",
      body: `Cuidado com as bordas — a mesma regra dos ranges do \`for\`:

- \`1..4\` → compartimentos 1, 2, 3 (**exclui** o fim)
- \`1..=4\` → compartimentos 1, 2, 3, 4 (inclui)

E para imprimir um slice inteiro, use o **marcador de debug** \`{:?}\`:

\`\`\`rust
println!("{:?}", window);   // [2, 3, 4]
\`\`\``,
    },
    {
      kind: "quiz",
      question: "Para `vec![10, 20, 30, 40]`, quanto é `&v[0..2]`?",
      options: ["[10, 20] — o fim é excluído", "[10, 20, 30] — o fim é incluído", "[20, 30]"],
      answer: 0,
      explain: "0..2 cobre os compartimentos 0 e 1. A janela exclui seu fim.",
    },
    {
      kind: "fill",
      prompt: "Imprima a janela — slices precisam do marcador de debug.",
      file: "main.rs",
      before: "println!(\"",
      after: "\", window);",
      choices: ["{:?}", "{}", "{window}"],
      answer: 0,
      explain: "{:?} é o marcador de debug — coleções imprimem com ele.",
    },
    {
      kind: "editor",
      intro: `### Prova final — uma janela para o tesouro

1. Pegue o meio: \`let middle = &shelf[1..4];\`
2. Imprima \`middle: {:?}\`.

Saída esperada:

\`\`\`text
middle: [2, 3, 4]
\`\`\``,
    },
  ],
};
