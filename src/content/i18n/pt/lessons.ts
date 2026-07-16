import "server-only";

// Localized lesson `instructions` markdown (server-only, like the source).
// ONLY instructions are localized — starter code, expected output and the
// hidden grading checks stay locale-neutral in content/lessons.ts.
export const lessonText: Record<string, { instructions: string }> = {
  "rust-fundamentals-1": {
    instructions: `## Hello, World!

Todo programa Rust começa na função \`main\`. Ela é o ponto de entrada — quando seu programa roda, \`main\` é o que é chamado.

Para imprimir texto no console, Rust te dá a **macro** \`println!\` (o \`!\` indica que é uma macro, não uma função — você vai aprender por que isso importa mais adiante).

\`\`\`rust
println!("seu texto aqui");
\`\`\`

### Sua missão

Faça o programa imprimir exatamente:

\`\`\`text
Hello, World!
\`\`\`

### Dicas

- O texto vai entre aspas duplas, dentro dos parênteses.
- Instruções em Rust terminam com ponto e vírgula \`;\`.
- Maiúsculas importam: \`Hello, World!\` — H maiúsculo, W maiúsculo.
`,
  },

  "rust-fundamentals-2": {
    instructions: `## Variáveis e Mutabilidade

Em Rust, variáveis são declaradas com \`let\` — e são **imutáveis por padrão**. Uma vez atribuído, o valor não pode mudar:

\`\`\`rust
let x = 5;
x = 10; // ❌ erro de compilação: não é possível atribuir duas vezes a uma variável imutável
\`\`\`

Para permitir reatribuição, marque a variável como mutável com \`mut\`:

\`\`\`rust
let mut x = 5;
x = 10; // ✅ tudo certo
\`\`\`

### Sua missão

O código inicial declara \`score\` como imutável e depois tenta alterá-lo — não vai compilar. Conserte:

1. Torne \`score\` **mutável**.
2. Mantenha a reatribuição para \`100\`.
3. Imprima a pontuação final com \`println!("score: {}", score);\`

Saída esperada:

\`\`\`text
score: 100
\`\`\`
`,
  },

  /* ───────────────────────── Ato I · 3–6 ───────────────────────── */

  "rust-fundamentals-3": {
    instructions: `## Tipos de Dados

Todo valor em Rust tem um **tipo** — sua forma. Rust geralmente consegue adivinhar, mas você pode (e muitas vezes deve) rotulá-lo você mesmo:

\`\`\`rust
let torches: i32 = 3;      // número inteiro
let weight: f64 = 2.5;     // número decimal
let is_lit: bool = true;   // valor sim/não
\`\`\`

### Sua missão

Rotule os três frascos do código inicial com seus tipos:

1. \`age\` é um número inteiro → \`i32\`
2. \`price\` é um número decimal → \`f64\`
3. \`is_open\` é um valor sim/não → \`bool\`

Saída esperada:

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\`

### Dicas

- O tipo vai depois do nome, separado por dois-pontos: \`let nome: tipo = valor;\`
`,
  },

  "rust-fundamentals-4": {
    instructions: `## Funções

Uma **função** é uma receita: recebe ingredientes (parâmetros), faz o trabalho e devolve um resultado.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\`

- Parâmetros declaram seus tipos: \`x: i32\`.
- \`-> i32\` diz que tipo vem de volta.
- A última linha **sem ponto e vírgula** é o valor retornado.

### Sua missão

\`main\` já chama \`add(2, 3)\` — mas a receita ainda não existe. Escreva-a abaixo de \`main\`:

1. Nomeie-a \`add\`, com dois parâmetros \`a: i32\` e \`b: i32\`.
2. Ela retorna um \`i32\`.
3. Ela retorna \`a + b\` (sem ponto e vírgula nessa linha!).

Saída esperada:

\`\`\`text
2 + 3 = 5
\`\`\`
`,
  },

  "rust-fundamentals-5": {
    instructions: `## Fundamentos de Ownership

A lei mais antiga de Rust: **todo valor tem exatamente um dono.** Quando você atribui uma \`String\` a outra variável, a posse (ownership) *se move* — o nome antigo não pode mais ser usado:

\`\`\`rust
let a = String::from("gem");
let b = a;            // a posse se move para b
println!("{}", a);    // ❌ erro: a não possui mais nada
\`\`\`

Se você realmente precisa de duas, forje uma cópia de verdade com \`.clone()\`:

\`\`\`rust
let b = a.clone();    // ✅ duas Strings independentes
\`\`\`

### Sua missão

O código inicial move \`sword\` para dentro de \`copy\` e depois tenta usar \`sword\` de novo — não vai compilar. Conserte **clonando** em vez de mover.

Saída esperada:

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\`
`,
  },

  "rust-fundamentals-6": {
    instructions: `## Empréstimos e Referências

Você não precisa *entregar* um valor para alguém lê-lo — pode **emprestá-lo**. Uma referência (\`&\`) permite que uma função tome o valor emprestado e o devolva automaticamente:

\`\`\`rust
fn inspect(item: &String) {   // toma emprestado, não toma posse
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);                // empreste com &
println!("{}", gem);          // ✅ ainda é seu
\`\`\`

### Sua missão

\`greet\` atualmente **toma posse** do nome, então \`main\` não pode usá-lo depois. Conserte:

1. Mude \`greet\` para tomar emprestado: o parâmetro vira \`who: &String\`.
2. Chame-a com uma referência: \`greet(&name);\`

Saída esperada:

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\`
`,
  },

  /* ───────────────────────── Ato II · controle de fluxo ───────────────────────── */

  "control-flow-1": {
    instructions: `## if / else

Programas decidem com \`if\`. A condição deve ser um \`bool\` — sem necessidade de parênteses:

\`\`\`rust
if torches > 0 {
    // executa quando a condição é verdadeira
} else {
    // executa caso contrário
}
\`\`\`

### Sua missão

A câmara tem \`torches = 3\`. Escreva a decisão:

1. **Se** \`torches\` for maior que \`0\`, imprima \`The hall is lit\`.
2. **Senão**, imprima \`Darkness...\`.

Saída esperada:

\`\`\`text
The hall is lit
\`\`\`
`,
  },

  "control-flow-2": {
    instructions: `## Expressões match

\`match\` compara um valor contra padrões — e Rust **te obriga a cobrir todos os casos**. O padrão \`_\` significa "qualquer outra coisa":

\`\`\`rust
let word = match number {
    1 => "one",
    2 => "two",
    _ => "many",
};
\`\`\`

Um \`match\` é uma *expressão*: produz um valor que você pode guardar.

### Sua missão

A câmara tem três portas e \`door = 2\`. Construa um \`match\`:

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. qualquer outra coisa (\`_\`) → \`"no door"\`
4. Guarde o resultado em \`path\` e imprima-o.

Saída esperada:

\`\`\`text
center
\`\`\`
`,
  },

  "control-flow-3": {
    instructions: `## loop

\`loop\` repete **para sempre** — até você escapar com \`break\`:

\`\`\`rust
loop {
    // executa de novo e de novo...
    if enough {
        break; // ...até isto
    }
}
\`\`\`

### Sua missão

Escape do corredor sem fim:

1. Dentro de um \`loop\`, some \`1\` a \`echoes\` a cada passagem.
2. Quando \`echoes\` chegar a \`3\` (\`echoes == 3\`), \`break\`.
3. A impressão final já está escrita para você.

Saída esperada:

\`\`\`text
escaped after 3 echoes
\`\`\`
`,
  },

  "control-flow-4": {
    instructions: `## Loops while

\`while\` repete **enquanto uma condição valer** — ele verifica antes de cada passagem:

\`\`\`rust
while supplies > 0 {
    // mais um dia...
}
\`\`\`

### Sua missão

Desça a galeria que afunda:

1. **Enquanto** \`floors\` for maior que \`0\`: imprima \`floor {}\` (o andar atual) e depois subtraia \`1\` de \`floors\`.
2. Depois do loop, imprima \`Ground level!\`.

Saída esperada:

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\`
`,
  },

  "control-flow-5": {
    instructions: `## Loops for

\`for\` percorre uma sequência — sem contador para gerenciar, sem como passar do limite:

\`\`\`rust
for n in 1..=5 {
    // n é 1, 2, 3, 4, 5
}
\`\`\`

\`1..=5\` é um **range** (intervalo): de 1 **até 5, inclusive**. (Sem o \`=\`, \`1..5\` para no 4.)

### Sua missão

Atravesse as cinco pedras do caminho:

1. Use \`for\` com o range \`1..=5\`.
2. Imprima \`step {}\` para cada número.

Saída esperada:

\`\`\`text
step 1
step 2
step 3
step 4
step 5
\`\`\`
`,
  },

  "control-flow-6": {
    instructions: `## Controle de Fluxo Aninhado

O verdadeiro golpe de mestre: uma decisão **dentro** de um loop. O operador \`%\` devolve o resto da divisão — \`n % 3 == 0\` significa "n é divisível por 3":

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\`

### Sua missão

Percorra os dez espelhos do Overlord:

1. \`for n in 1..=10\`
2. **Se** \`n\` for divisível por 3 (\`n % 3 == 0\`), imprima \`mirror\`.
3. **Senão**, imprima o número \`n\`.

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
\`\`\`
`,
  },

  /* ───────────────────── Ato III · biblioteca padrão ───────────────────── */

  "rust-standard-library-1": {
    instructions: `## Fundamentos de Vec

Um \`Vec\` é uma lista que cresce — a mochila do reino:

\`\`\`rust
let mut items = vec!["torch", "rope"];  // crie com conteúdo
items.push("map");                       // faça-a crescer
items.len()                              // quantos? → 3
\`\`\`

### Sua missão

1. Crie uma \`satchel\` **mutável** com \`vec!["torch", "rope"]\`.
2. Dê \`push\` em \`"map"\`.
3. Imprima \`items: {}\` com \`satchel.len()\`.

Saída esperada:

\`\`\`text
items: 3
\`\`\`
`,
  },

  "rust-standard-library-2": {
    instructions: `## Iteradores

Um **iterador** percorre uma coleção preguiçosamente — não faz trabalho algum até você pedir um resultado:

\`\`\`rust
let total: i32 = coins.iter().sum();
\`\`\`

\`.iter()\` inicia a cadeia; \`.sum()\` a reúne em um único valor. (O rótulo de tipo em \`total\` diz ao \`sum\` o que produzir.)

### Sua missão

A mochila guarda \`coins = vec![5, 10, 25]\`.

1. Some-as com \`.iter().sum()\` em \`total: i32\`.
2. Imprima \`total: {}\`.

Saída esperada:

\`\`\`text
total: 40
\`\`\`
`,
  },

  "rust-standard-library-3": {
    instructions: `## Indexação Segura com .get

\`vault[5]\` em um Vec de 2 itens **derruba** o programa. A pergunta educada é \`.get(5)\` — ela retorna um \`Option\`: \`Some(&item)\` se a posição existe, \`None\` se não existe.

\`\`\`rust
let tool = vault.get(5).unwrap_or(&"nothing");
\`\`\`

\`unwrap_or\` fornece um valor reserva quando a resposta é \`None\`. (Repare no \`&\` — \`get\` entrega referências.)

### Sua missão

O cofre tem 2 ferramentas; peça a posição \`5\` mesmo assim:

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. Imprima \`found: {}\`.

Saída esperada:

\`\`\`text
found: nothing
\`\`\`
`,
  },

  "rust-standard-library-4": {
    instructions: `## HashMap

Um \`HashMap\` liga **chaves a valores** — pergunte pela chave, receba o valor instantaneamente:

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
ledger.insert("gold", 100);
println!("{}", ledger["gold"]);  // → 100
\`\`\`

Ele vive em \`std::collections\`, então precisa da linha \`use\` no topo.

### Sua missão

1. Insira \`("gold", 100)\` e \`("silver", 250)\` no livro-razão.
2. Imprima \`gold: {}\` usando \`ledger["gold"]\`.

Saída esperada:

\`\`\`text
gold: 100
\`\`\`
`,
  },

  "rust-standard-library-5": {
    instructions: `## Manipulação de Strings

Uma \`String\` é texto que cresce. Dois feitiços hoje:

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");              // anexa texto

let banner = format!("The {}", s);   // tece strings em uma nova
\`\`\`

\`format!\` funciona exatamente como \`println!\` — mas retorna a String em vez de imprimi-la.

### Sua missão

1. Anexe \`" of the Vaults"\` a \`title\` com \`push_str\`.
2. Construa \`banner\` com \`format!("The {}", title)\`.
3. Imprima o estandarte.

Saída esperada:

\`\`\`text
The Keeper of the Vaults
\`\`\`
`,
  },

  "rust-standard-library-6": {
    instructions: `## Slices

Um **slice** é uma janela para um trecho de uma coleção — sem cópia, só uma vista:

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

O range inclui seu início e **exclui** seu fim (\`1..4\` → posições 1, 2, 3). Imprima um slice com o marcador de depuração \`{:?}\`.

### Sua missão

1. Pegue o meio da prateleira: \`&shelf[1..4]\`.
2. Imprima \`middle: {:?}\`.

Saída esperada:

\`\`\`text
middle: [2, 3, 4]
\`\`\`
`,
  },

  /* ───────────────────── Ato IV · Option ───────────────────── */

  "mastering-option-1": {
    instructions: `## Some ou None

\`Option<T>\` é como Rust diz *"pode haver um valor — ou não"*:

\`\`\`rust
enum Option<T> {
    Some(T),   // há um valor, embrulhado dentro
    None,      // não há nada
}
\`\`\`

Uma função que pode não ter resposta retorna \`Option\`:

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

### Sua missão

Complete \`find\`: se \`present\` for true, retorne \`Some(7)\`; caso contrário, \`None\`.

Saída esperada:

\`\`\`text
Some(7)
\`\`\`
`,
  },

  "mastering-option-2": {
    instructions: `## Desembrulhe com Segurança

\`.unwrap()\` arranca o valor de dentro de um Option — e entra em **pânico** (trava) num \`None\`. O pântano está cheio dos que deram unwrap.

O idioma seguro carrega um valor padrão:

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

### Sua missão

\`ghost\` é \`None\`. Extraia um valor **com segurança**:

1. \`let value = ghost.unwrap_or(0);\` — nada de \`.unwrap()\` em lugar nenhum.
2. Imprima \`value: {}\`.

Saída esperada:

\`\`\`text
value: 0
\`\`\`
`,
  },

  "mastering-option-3": {
    instructions: `## if let

Quando você só se importa com o caso \`Some\`, \`if let\` desembrulha e nomeia o valor em um só golpe:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light é o valor desembrulhado
} else {
    println!("darkness");
}
\`\`\`

### Sua missão

A lanterna guarda \`Some(3)\`. Pergunte a ela do jeito certo:

1. \`if let Some(light) = lantern\` → imprima \`light: {}\`.
2. \`else\` → imprima \`darkness\`.

Saída esperada:

\`\`\`text
light: 3
\`\`\`
`,
  },

  /* ───────────────────── Ato V · Result ───────────────────── */

  "mastering-result-1": {
    instructions: `## Ok ou Err

Onde \`Option\` modela a *ausência*, \`Result\` modela **falha com um motivo**:

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // funcionou — aqui está o valor
    Err(E),   // falhou — aqui está o porquê
}
\`\`\`

### Sua missão

Complete \`divide\`:

1. Se \`b == 0\` → \`Err(String::from("division by zero"))\`
2. Caso contrário → \`Ok(a / b)\`

Saída esperada:

\`\`\`text
Ok(5)
\`\`\`
`,
  },

  "mastering-result-2": {
    instructions: `## Lendo o Veredito

Você não chuta um \`Result\` — você o \`match\`eia, e o compilador garante que **ambos** os vereditos sejam tratados:

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

### Sua missão

A corte te entrega \`Ok(42)\`. Leia-o:

1. \`Ok(v)\` → imprima \`granted: {}\`
2. \`Err(e)\` → imprima \`denied: {}\`

Saída esperada:

\`\`\`text
granted: 42
\`\`\`
`,
  },

  "mastering-result-3": {
    instructions: `## O Operador ?

Tratar cada \`Result\` onde ele acontece soterra a lógica. O sinal \`?\` **propaga**: num \`Ok\` ele desembrulha e continua; num \`Err\` ele devolve o erro ao *seu* chamador imediatamente.

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // Err? → devolvido para cima, bem aqui
    Ok(n * 2)
}
\`\`\`

\`?\` só funciona dentro de funções que também retornam \`Result\` (ou \`Option\`).

### Sua missão

Complete \`double_first\`:

1. \`let n = parse("21")?;\`
2. Retorne \`Ok(n * 2)\`.

Saída esperada:

\`\`\`text
Ok(42)
\`\`\`
`,
  },

  /* ───────────────────── Ato VI · Stellar 101 (conceitual) ───────────────────── */

  "stellar-101-1": {
    instructions: `## Contas e Pares de Chaves

Todo ator na Stellar é uma **conta**, controlada por um **par de chaves**:

- **Chave pública** — começa com \`G\`. Seu endereço; compartilhe à vontade.
- **Chave secreta** — começa com \`S\`. Assina tudo; **nunca** a compartilhe. Perca-a e a conta se vai para sempre.

Uma conta precisa manter um saldo mínimo (**base reserve**) de **1 XLM** para existir no ledger.

### Sua missão

Complete a carta de fundação da fortaleza estelar — preencha os três valores.

Saída esperada:

\`\`\`text
star-keep chartered ✓
\`\`\`
`,
  },

  "stellar-101-2": {
    instructions: `## Lumens e Taxas

O ativo nativo é o **lumen (XLM)**, e sua menor unidade é o **stroop**:

- \`1 XLM = 10_000_000 stroops\` (dez milhões)
- Toda transação paga uma pequena taxa — a taxa base é de **100 stroops** (0.00001 XLM)

A taxa não é receita — é um pedágio anti-spam que mantém a rede rápida para todos.

### Sua missão

Preencha os dois números na placa do pedágio.

Saída esperada:

\`\`\`text
toll paid ✓
\`\`\`
`,
  },

  "stellar-101-3": {
    instructions: `## Trustlines e Ativos

Além do XLM, qualquer conta pode **emitir ativos** (dólares, pontos, ingressos…). Um ativo é identificado por duas coisas:

- um **código de ativo** — ex.: \`USDC\`
- o **emissor** — a conta (um endereço \`G...\`) que o criou

Mas sua conta não guarda nada sem seu consentimento: você precisa abrir uma **trustline** para um ativo antes de poder recebê-lo. Sem trustline, sem saldo.

### Sua missão

Abra a ponte de luz: preencha a trustline para **USDC**.

Saída esperada:

\`\`\`text
light-bridge opened ✓
\`\`\`
`,
  },

  "stellar-101-4": {
    instructions: `## Seu Primeiro Pagamento

Uma **operação de pagamento** precisa de exatamente três coisas:

1. **destination** — a conta que recebe (\`G...\`)
2. **asset** — o que você está enviando (\`XLM\` para o lumen nativo)
3. **amount** — quanto

Assine com sua chave secreta, pague o pedágio de ~100 stroops e em ~5 segundos está finalizado. Sem bancos, sem dias úteis.

### Sua missão

Trace o primeiro pagamento desde o Pânico: **25 XLM**.

Saída esperada:

\`\`\`text
lumens flowing ✓
\`\`\`
`,
  },

  /* ───────────────────── Ato VII · Soroban (pressupõe Rust) ───────────────────── */

  "soroban-smart-contracts-1": {
    instructions: `## Seu Primeiro Contrato

Um contrato Soroban é uma biblioteca Rust compilada para WASM e gravada no ledger. Três coisas fazem dele um contrato:

- \`#![no_std]\` — sem SO, sem alocador de heap, sem biblioteca padrão. O ledger é a máquina.
- \`#[contract]\` em uma struct unitária — a identidade do contrato.
- \`#[contractimpl]\` no bloco impl — exporta suas \`pub fn\`s como entradas invocáveis. Toda entrada recebe \`Env\` primeiro: sua alça para storage, eventos e chamadas entre contratos.

Strings são caras on-chain; identificadores curtos usam \`Symbol\` (≤ 9 caracteres via \`symbol_short!\`).

### Sua missão

1. Marque o bloco impl com \`#[contractimpl]\`.
2. Faça \`hello\` retornar \`symbol_short!("beacon")\`.

Resultado esperado da invocação:

\`\`\`text
hello() → Symbol(beacon)
\`\`\`
`,
  },

  "soroban-smart-contracts-2": {
    instructions: `## Storage do Contrato

Contratos não guardam estado entre invocações — o estado vive no **ledger**, atrás de \`env.storage()\`. Para estado do contrato inteiro, use o storage de **instância**:

\`\`\`rust
let count: u32 = env.storage().instance().get(&KEY).unwrap_or(0);
env.storage().instance().set(&KEY, &count);
\`\`\`

\`get\` retorna \`Option<T>\` — a chave pode nunca ter sido escrita (ou o aluguel dela expirou), então \`unwrap_or(0)\` é o idioma para contadores. Chaves e valores passam por referência.

### Sua missão

Implemente \`increment\`:

1. Leia a contagem atual do storage de instância sob \`COUNTER\` (padrão \`0\`).
2. Some \`1\`.
3. Escreva de volta com \`set\`.
4. Retorne a nova contagem.

Resultado esperado da invocação:

\`\`\`text
increment() → 1
\`\`\`
`,
  },

  "soroban-smart-contracts-3": {
    instructions: `## Autorização

Todo \`Address\` no Soroban pode provar que aprovou uma chamada. A verificação do lado do contrato é uma linha:

\`\`\`rust
from.require_auth();
\`\`\`

Se a transação não foi assinada (ou pré-autorizada) por \`from\`, a invocação **trava (trap)** — estado intocado. Pular essa linha em uma função que move fundos é o clássico bug fatal: qualquer um poderia passar qualquer endereço e drenar tudo.

### Sua missão

Guarde o cofre. Em \`withdraw\`, exija autorização de \`from\` **antes** de qualquer outra coisa acontecer.

Resultado esperado da invocação:

\`\`\`text
withdraw: authorized ✓
\`\`\`
`,
  },
};
