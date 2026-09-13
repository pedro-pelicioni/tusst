// PT · editor instructions — Macros, Unsafe, FFI & Money.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-systems-edges.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustSystemsEdgesInstructionsPt: Record<string, { instructions: string }> = {
  "rust-systems-edges-1": {
    instructions: `## Torne a invariante inquebrável

Tudo é privado por padrão, e \`pub\` numa struct **não** torna os campos públicos. É isso que transforma "um saldo nunca é negativo" de comentário em propriedade do tipo: o construtor é a única porta.

| escrito | visível para |
| --- | --- |
| *(nada)* | este módulo e os descendentes |
| \`pub(crate)\` | qualquer lugar deste crate |
| \`pub(super)\` | o módulo pai |
| \`pub\` | qualquer um, inclusive outros crates |

### Sua tarefa

1. \`mod ledger\` contendo \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` — o **campo continua privado**.
2. Em \`impl Balance\`: \`pub fn new(stroops: i64) -> Option<Balance>\` (\`None\` se negativo), \`pub fn stroops(&self) -> i64\`, e \`pub(crate) fn raw(&self) -> i64\`.
3. Em \`main\`, faça \`use ledger::Balance;\` e imprima \`new(250)\` mapeado para os stroops, \`new(-1)\` do mesmo jeito, e \`raw()\` num saldo válido de \`10\`.

Saída esperada:

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

### Dicas

- \`Balance::new(250).map(|b| b.stroops())\` dá um \`Option<i64>\`.
`,
  },

  "rust-systems-edges-2": {
    instructions: `## Uma macro que uma função não substituiria

\`macro_rules!\` casa sintaxe e expande para sintaxe, antes da checagem de tipos. Faz o que uma função não consegue: argumentos variádicos, tipos misturados numa mesma posição, e capturar o texto-fonte de uma expressão.

Repetição: \`$( ... ),+\` casa um ou mais grupos separados por vírgula, e a mesma forma no corpo emite uma cópia por casamento. \`{{ ... }}\` torna a expansão uma expressão de bloco, então ela pode conter statements e ainda produzir um valor.

### Sua tarefa

Escreva \`macro_rules! metric\` com duas regras:

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → o mesmo, e depois \`",<k>=<v>"\` acrescentado por par.

Chame com \`("requests", 42)\` e com \`("latency", 95, "method" => "getEvents", "code" => 200)\`.

Saída esperada:

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

### Dicas

- O corpo da segunda regra precisa de \`let mut out = format!(...)\`, depois um \`out.push_str(...)\` repetido, depois \`out\` como cauda.
- Ponha a regra de dois argumentos primeiro; as regras de macro são casadas em ordem.
`,
  },

  "rust-systems-edges-3": {
    instructions: `## Veja o que um derive gera

\`#[derive(...)]\` é uma macro procedural: ela lê os tokens do seu tipo e devolve Rust comum. Nada é caso especial no compilador, e \`cargo expand\` te mostra a saída.

\`Debug\` imprime todo campo pelo nome. \`Clone\` clona todo campo. \`PartialEq\` compara todo campo. \`Default\` preenche cada campo com o default **dele mesmo**.

### Sua tarefa

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`
2. Monte uma com endpoint \`https://rpc\`, retries \`3\`, verbose \`false\`, e faça \`clone()\`.
3. Imprima a original com \`{:?}\`, se as duas são iguais, e \`Config::default()\` com \`{:?}\`.

Saída esperada:

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Quatro impls, nenhum escrito por você.
`,
  },

  "rust-systems-edges-4": {
    instructions: `## Uma API segura sobre um núcleo unsafe

\`unsafe\` destrava cinco habilidades — desreferenciar um ponteiro cru, chamar uma fn \`unsafe\`, mexer num \`static mut\`, implementar um trait \`unsafe\`, ler um campo de union. Ownership, borrowing e checagem de tipos ficam **inalterados**.

O que ele significa é "estou afirmando uma invariante que o compilador não consegue checar", então todo bloco ganha um comentário \`// SAFETY:\` dizendo por que a afirmação vale.

Uma função segura contendo \`unsafe\` promete que a invariante vale para *toda* entrada. É isso que torna \`split_at_mut\` segura.

### Sua tarefa

Escreva \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` devolvendo duas metades mutáveis que não se sobrepõem, usando \`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\` e um comentário \`// SAFETY:\`.

Em \`main\`, divida \`[1, 2, 3, 4, 5, 6]\`, escreva \`100\` no primeiro elemento da metade esquerda e \`200\` no primeiro da direita, imprima as duas metades, e depois imprima o array inteiro.

Saída esperada:

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\`

### Dicas

- Leia \`len()\` e \`mid\` **antes** de pegar o ponteiro, para nenhum borrow estar vivo atravessando ele.
- \`ptr.add(mid)\` avança \`mid\` elementos.
`,
  },

  "rust-systems-edges-5": {
    instructions: `## Lide com endereços de propósito

Um ponteiro cru é um endereço puro: sem lifetime, sem ownership, sem garantia de aliasing. **Criar um é seguro; desreferenciar não é.**

Uma desreferência afirma quatro coisas de uma vez — não nulo, alinhado, apontando para um valor vivo, e sem fazer alias com um \`&mut\` vivo. A última é a que as pessoas esquecem, e os bugs dela aparecem longe da linha culpada.

### Sua tarefa

1. Pegue \`let mut value = 42i64;\` e um \`*mut i64\` para ele. Num bloco \`unsafe\` com comentário \`// SAFETY:\`, incremente pelo ponteiro e imprima o valor lido de volta por ele. Depois imprima o binding original.
2. Pegue \`let arr = [10i64, 20, 30];\` e o \`as_ptr()\` dele. Imprima o elemento no offset \`2\` via \`add\`.
3. Monte um \`std::ptr::null::<i64>()\` e imprima \`is_null()\` — chamada segura, sem bloco.

Saída esperada:

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\`

### Dicas

- \`let p: *mut i64 = &mut value;\` converte a referência num ponteiro cru.
- \`add\` conta em unidades de \`T\`, então \`add(2)\` num \`*const i64\` avança 16 bytes.
`,
  },

  "rust-systems-edges-6": {
    instructions: `## Ownership através da fronteira

A ABI de Rust é deliberadamente instável, então atravessar para C significa aderir à deles: \`#[repr(C)]\` para o layout, \`#[no_mangle]\` e \`extern "C"\` para o símbolo e a convenção de chamada.

A parte difícil é o ownership cruzando uma fronteira que o compilador não consegue enxergar. Todo \`Box::into_raw\` precisa de exatamente um \`Box::from_raw\` correspondente — zero é vazamento, dois é double free.

### Sua tarefa

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — precisa ser \`pub\`, já que as funções exportadas o mencionam.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — \`0\` para nulo, senão \`x + y\`, com comentário \`// SAFETY:\`.
3. \`point_new(x, y) -> *mut Point\` via \`Box::into_raw\`, e \`point_free(p: *mut Point)\` via \`Box::from_raw\`, com checagem de nulo.
4. Em \`main\`: monte \`(3, 4)\`, imprima a soma, imprima o ponto pelo ponteiro cru, libere, imprima \`size_of::<Point>()\`, e depois \`point_sum\` de um ponteiro nulo.

Saída esperada:

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

Um \`into_raw\`, um \`from_raw\`. Esse par é o contrato inteiro.

### Dicas

- \`std::ptr::null()\` para a última chamada.
- Libere o ponto **antes** de imprimir o tamanho, ou a ordem dos borrows vai te confundir.
`,
  },

  "rust-systems-edges-7": {
    instructions: `## Dinheiro em inteiros

Um saldo nunca é float — \`f64\` não consegue representar a maioria das frações decimais com exatidão, e num ledger esse erro é dinheiro que não fecha na conciliação. Guarde a menor unidade indivisível como inteiro: stroops, centavos, satoshis.

Inteiros não perdem precisão, mas fazem **overflow** — e a checagem é removida na compilação em builds de release. Seja explícito:

| método | em overflow |
| --- | --- |
| \`checked_add\` | \`None\` — você trata |
| \`saturating_add\` | trava no máximo |
| \`wrapping_add\` | dá a volta |

Para dinheiro, sempre \`checked_\`.

### Sua tarefa

1. \`const STROOPS_PER_XLM: i64 = 10_000_000;\`
2. \`fn to_stroops(xlm: i64, fraction: i64) -> Option<i64>\` usando \`checked_mul(..)?\` e depois \`checked_add(..)\`.
3. Imprima \`to_stroops(2, 5_000_000)\` e \`to_stroops(i64::MAX, 0)\` com \`{:?}\`.
4. Imprima \`100i64.checked_sub(30)\` e \`10i64.checked_sub(i64::MIN)\` com \`{:?}\`.
5. Imprima \`i64::MAX.saturating_add(1)\` e \`i64::MAX.wrapping_add(1)\`.
6. Imprima se \`0.1f64 + 0.2f64 == 0.3\`.

Saída esperada:

\`\`\`text
2.5 XLM: Some(25000000)
overflow: None
checked_sub ok: Some(70)
checked_sub under: None
saturating: 9223372036854775807
wrapping: -9223372036854775808
float equality: false
\`\`\`

A última linha é o motivo de as seis primeiras importarem.
`,
  },
};
