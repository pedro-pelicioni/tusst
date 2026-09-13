// PT · editor instructions — Collections, Iterators & Closures.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-collections-iterators.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustCollectionsIteratorsInstructionsPt: Record<string, { instructions: string }> = {
  "rust-collections-iterators-1": {
    instructions: `## Container certo, custo certo

\`Vec<T>\` é contíguo: push/pop O(1) no **fim**, insert/remove O(n) no **início**. \`with_capacity\` aloca uma vez em vez de dobrar repetidamente.

\`VecDeque<T>\` é um ring buffer: O(1) nas **duas** pontas.

### Sua tarefa

1. \`Vec::with_capacity(4)\`, empurre \`1..=4\`, imprima o vetor com \`{:?}\` e a \`capacity()\` — ainda exatamente 4.
2. Um \`VecDeque<i32>\`: \`push_back(2)\`, \`push_back(3)\`, \`push_front(1)\`. Imprima com \`{:?}\`, depois imprima \`pop_front()\` com \`{:?}\`.

Saída esperada:

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\`

### Dicas

- \`use std::collections::VecDeque;\`
- \`for n in 1..=4\` é um range inclusivo.
`,
  },

  "rust-collections-iterators-2": {
    instructions: `## Ordem ou velocidade

\`HashMap\` — O(1) em média, ordem de iteração **arbitrária** (aleatorizada por execução, de propósito).
\`BTreeMap\` — O(log n), **sempre ordenado** por chave, suporta consultas por faixa.

Escolha \`BTreeMap\` para iteração ordenada, faixas ou saída determinística. \`HashMap\` no resto.

A API \`entry\` faz hash uma vez onde \`contains_key\` + \`insert\` faz duas:

\`\`\`rust
*hits.entry(m).or_insert(0) += 1;
\`\`\`

### Sua tarefa

1. Com um \`HashMap<&str, u32>\`, conte as ocorrências em \`["getEvents", "sendTx", "getEvents"]\` usando \`entry\`, e imprima a contagem de \`getEvents\`.
2. Com um \`BTreeMap<&str, u32>\`, insira \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` nessa ordem, colete as \`keys()\` num \`Vec<&str>\` e imprima.

Saída esperada:

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\`

### Dicas

- \`use std::collections::{BTreeMap, HashMap};\`
- \`.keys().copied().collect()\` transforma \`&&str\` em \`&str\`.
`,
  },

  "rust-collections-iterators-3": {
    instructions: `## Emprestar, mutar, consumir

| método | produz | coleção depois |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | intacta |
| \`.iter_mut()\` | \`&mut T\` | mutada no lugar |
| \`.into_iter()\` | \`T\` | consumida |

\`for x in collection\` expande para \`into_iter()\` — é por isso que a próxima linha que usar a coleção não vai compilar.

### Sua tarefa

Com \`let mut data = vec![1, 2, 3];\`:

1. \`.iter()\` + \`map\` dobrando cada um num novo \`Vec<i32>\`; imprima.
2. \`.iter_mut()\` somando \`10\` em cada no lugar; imprima \`data\`.
3. \`.into_iter()\` + \`map\` transformando cada um numa \`String\`; colete num \`Vec<String>\` e imprima.

Saída esperada:

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\`
`,
  },

  "rust-collections-iterators-4": {
    instructions: `## Nada roda até você pedir

Adapters (\`map\`, \`filter\`, \`filter_map\`) são **lazy** — eles montam um pipeline. O trabalho só começa num consumidor (\`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`).

É por isso que encadear não aloca nada entre as etapas: cada elemento atravessa a cadeia inteira um de cada vez.

### Sua tarefa

Com \`let raw = vec!["12", "x", "30", "", "8"];\`:

1. \`.iter()\` → \`filter_map\` parseando cada um como \`i64\` e mantendo os que deram certo → \`filter\` mantendo \`>= 10\` → colete num \`Vec<i64>\`; imprima.
2. Monte uma segunda cadeia mapeando cada entrada para seu \`.len()\` e ligue a uma variável **sem consumir**. Imprima \`nothing ran yet\`, depois colete num \`Vec<usize>\` e imprima.

Saída esperada:

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\`

### Dicas

- \`s.parse::<i64>().ok()\` transforma o \`Result\` no \`Option\` que \`filter_map\` quer.
- \`.collect::<Vec<usize>>()\` anota o collect inline.
`,
  },

  "rust-collections-iterators-5": {
    instructions: `## Agregue de três formas

\`fold\` carrega um acumulador pela sequência a partir de um valor inicial explícito. \`reduce\` tira o valor inicial do primeiro elemento, e por isso devolve \`Option\`.

O acumulador não precisa ser um número — construir uma \`String\` é um fold cujo acumulador é a string.

### Sua tarefa

Com \`let latencies = vec![12u64, 40, 7, 95, 23];\`:

1. \`fold\` a partir de \`0u64\` até um total; imprima.
2. \`.copied().reduce(u64::max)\` para o pior caso; imprima com \`{:?}\`.
3. \`fold\` a partir de \`String::new()\` juntando os valores com \`'|'\`; imprima.

Saída esperada:

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\`

### Dicas

- A closure do fold de string recebe \`|mut acc, n|\` e devolve \`acc\`.
- Proteja o separador com \`if !acc.is_empty()\`.
`,
  },

  "rust-collections-iterators-6": {
    instructions: `## O compilador escolhe a trait

| trait | o corpo | pode ser chamada |
| --- | --- | --- |
| \`FnOnce\` | consome uma captura | uma vez |
| \`FnMut\` | muta uma captura | várias, precisa de \`&mut\` |
| \`Fn\` | só lê as capturas | várias, a partir de \`&\` |

Elas se aninham, então \`Fn\` é o bound **mais** restritivo que você pode pedir. Restrinja pela mais frouxa que ainda permita chamar quantas vezes você precisa.

### Sua tarefa

1. \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\` devolvendo \`f(1) + f(2)\`. Chame com uma closure que multiplica por um \`factor = 10\` capturado.
2. \`fn call_fn_mut<F: FnMut()>(mut f: F)\` chamando \`f()\` duas vezes. Chame com uma closure que incrementa um \`count\` capturado, e depois imprima \`count\`.
3. \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` chamando \`f()\` uma vez. Chame com uma closure \`move\` que devolve uma \`String\` capturada.

Saída esperada:

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\`

### Dicas

- O parâmetro \`FnMut\` precisa ser \`mut f: F\` — chamá-la pega a closure emprestada com exclusividade.
- A \`String\` capturada contém \`consumed\`.
`,
  },

  "rust-collections-iterators-7": {
    instructions: `## Closures que sobrevivem ao próprio escopo

Uma closure captura por referência por padrão. \`move\` força toda captura a ser tomada **por valor**, que é o que uma closure devolvida por uma função precisa.

\`impl Fn() -> T\` nomeia um único tipo anônimo concreto: dispatch estático, sem alocação. \`Box<dyn Fn() -> T>\` é obrigatório quando ramos diferentes devolvem closures diferentes, ou quando você guarda várias juntas.

### Sua tarefa

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — é dona de \`n\`, incrementa e devolve a cada chamada.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — devolve \`"hello <name>"\`.
3. Em \`main\`, chame o contador três vezes em **bindings separados**, imprima os três numa linha, depois imprima a saída do greeter para \`rpc\`.

Saída esperada:

\`\`\`text
11 12 13
hello rpc
\`\`\`

O contador começa em \`10\`. Ligue cada chamada à própria variável antes de imprimir — três borrows \`&mut\` dentro de um \`println!\` é uma briga desnecessária.
`,
  },
};
