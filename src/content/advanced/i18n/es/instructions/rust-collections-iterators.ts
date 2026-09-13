// ES · editor instructions — Collections, Iterators & Closures.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-collections-iterators.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustCollectionsIteratorsInstructionsEs: Record<string, { instructions: string }> = {
  "rust-collections-iterators-1": {
    instructions: `## Contenedor correcto, costo correcto

\`Vec<T>\` es contiguo: push/pop O(1) al **final**, insert/remove O(n) al **frente**. \`with_capacity\` asigna una sola vez en lugar de duplicar repetidamente.

\`VecDeque<T>\` es un ring buffer: O(1) por **los dos** extremos.

### Tu tarea

1. \`Vec::with_capacity(4)\`, haz push de \`1..=4\`, imprime el vector con \`{:?}\` y su \`capacity()\` — sigue siendo exactamente 4.
2. Un \`VecDeque<i32>\`: \`push_back(2)\`, \`push_back(3)\`, \`push_front(1)\`. Imprímelo con \`{:?}\`, luego imprime \`pop_front()\` con \`{:?}\`.

Salida esperada:

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\`

### Pistas

- \`use std::collections::VecDeque;\`
- \`for n in 1..=4\` es un rango inclusivo.
`,
  },

  "rust-collections-iterators-2": {
    instructions: `## Orden o velocidad

\`HashMap\` — O(1) en promedio, orden de iteración **arbitrario** (aleatorizado por ejecución, a propósito).
\`BTreeMap\` — O(log n), **siempre ordenado** por clave, soporta consultas por rango.

Elige \`BTreeMap\` para iteración ordenada, rangos o salida determinista. \`HashMap\` en el resto de los casos.

La API \`entry\` hashea una vez donde \`contains_key\` + \`insert\` hashea dos veces:

\`\`\`rust
*hits.entry(m).or_insert(0) += 1;
\`\`\`

### Tu tarea

1. Con un \`HashMap<&str, u32>\`, cuenta las ocurrencias en \`["getEvents", "sendTx", "getEvents"]\` usando \`entry\`, y luego imprime el conteo de \`getEvents\`.
2. Con un \`BTreeMap<&str, u32>\`, inserta \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` en ese orden, recoge sus \`keys()\` en un \`Vec<&str>\`, e imprímelas.

Salida esperada:

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\`

### Pistas

- \`use std::collections::{BTreeMap, HashMap};\`
- \`.keys().copied().collect()\` convierte \`&&str\` en \`&str\`.
`,
  },

  "rust-collections-iterators-3": {
    instructions: `## Tomar prestado, mutar, consumir

| método | produce | colección después |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | intacta |
| \`.iter_mut()\` | \`&mut T\` | mutada en el lugar |
| \`.into_iter()\` | \`T\` | consumida |

\`for x in collection\` se desazucara a \`into_iter()\` — por eso la siguiente línea que la use no va a compilar.

### Tu tarea

Con \`let mut data = vec![1, 2, 3];\`:

1. \`.iter()\` + \`map\` duplicando cada uno en un nuevo \`Vec<i32>\`; imprímelo.
2. \`.iter_mut()\` sumando \`10\` a cada uno en el lugar; imprime \`data\`.
3. \`.into_iter()\` + \`map\` convirtiendo cada uno en una \`String\`; recoge en un \`Vec<String>\` e imprímelo.

Salida esperada:

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\`
`,
  },

  "rust-collections-iterators-4": {
    instructions: `## Nada corre hasta que lo pidas

Los adapters (\`map\`, \`filter\`, \`filter_map\`) son **lazy** — construyen un pipeline. El trabajo empieza solo en un consumidor (\`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`).

Por eso encadenar no asigna nada entre etapas: cada elemento fluye por toda la cadena de uno en uno.

### Tu tarea

Con \`let raw = vec!["12", "x", "30", "", "8"];\`:

1. \`.iter()\` → \`filter_map\` parseando cada uno como \`i64\` y quedándote con los éxitos → \`filter\` quedándote con \`>= 10\` → recoge en un \`Vec<i64>\`; imprímelo.
2. Construye una segunda cadena mapeando cada entrada a su \`.len()\` y lígala a una variable **sin consumirla**. Imprime \`nothing ran yet\`, luego recógela en un \`Vec<usize>\` e imprime eso.

Salida esperada:

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\`

### Pistas

- \`s.parse::<i64>().ok()\` convierte el \`Result\` en el \`Option\` que \`filter_map\` quiere.
- \`.collect::<Vec<usize>>()\` anota el collect en la misma línea.
`,
  },

  "rust-collections-iterators-5": {
    instructions: `## Agrega de tres maneras

\`fold\` lleva un acumulador a través de la secuencia desde un valor inicial explícito. \`reduce\` toma su valor inicial del primer elemento, así que devuelve \`Option\`.

El acumulador no tiene por qué ser un número — construir una \`String\` es un fold cuyo acumulador es la string.

### Tu tarea

Con \`let latencies = vec![12u64, 40, 7, 95, 23];\`:

1. \`fold\` desde \`0u64\` hasta un total; imprímelo.
2. \`.copied().reduce(u64::max)\` para el peor caso; imprímelo con \`{:?}\`.
3. \`fold\` desde \`String::new()\` uniendo los valores con \`'|'\`; imprímelo.

Salida esperada:

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\`

### Pistas

- La closure del fold de string recibe \`|mut acc, n|\` y devuelve \`acc\`.
- Protege el separador con \`if !acc.is_empty()\`.
`,
  },

  "rust-collections-iterators-6": {
    instructions: `## El compilador elige el trait

| trait | el cuerpo | se puede llamar |
| --- | --- | --- |
| \`FnOnce\` | consume una captura | una vez |
| \`FnMut\` | muta una captura | muchas veces, necesita \`&mut\` |
| \`Fn\` | solo lee las capturas | muchas veces, desde \`&\` |

Se anidan, así que \`Fn\` es el bound **más** restrictivo que puedes pedir. Acota con el más laxo que te deje llamarla tantas veces como necesites.

### Tu tarea

1. \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\` que devuelva \`f(1) + f(2)\`. Llámala con una closure que multiplique por un \`factor = 10\` capturado.
2. \`fn call_fn_mut<F: FnMut()>(mut f: F)\` que llame a \`f()\` dos veces. Llámala con una closure que incremente un \`count\` capturado, y luego imprime \`count\`.
3. \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` que llame a \`f()\` una vez. Llámala con una closure \`move\` que devuelva una \`String\` capturada.

Salida esperada:

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\`

### Pistas

- El parámetro \`FnMut\` tiene que ser \`mut f: F\` — llamarla toma prestada la closure de forma exclusiva.
- La \`String\` capturada contiene \`consumed\`.
`,
  },

  "rust-collections-iterators-7": {
    instructions: `## Closures que sobreviven a su scope

Una closure captura por referencia por defecto. \`move\` fuerza a que cada captura se tome **por valor**, que es lo que necesita una closure devuelta desde una función.

\`impl Fn() -> T\` nombra un único tipo anónimo concreto: dispatch estático, sin asignación. \`Box<dyn Fn() -> T>\` es obligatorio cuando distintas ramas devuelven closures distintas, o cuando guardas varias juntas.

### Tu tarea

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — es dueña de \`n\`, lo incrementa y lo devuelve en cada llamada.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — devuelve \`"hello <name>"\`.
3. En \`main\`, llama al contador tres veces en **bindings separados**, imprime los tres en una sola línea, luego imprime la salida del greeter para \`rpc\`.

Salida esperada:

\`\`\`text
11 12 13
hello rpc
\`\`\`

El contador empieza en \`10\`. Liga cada llamada antes de imprimir — tres borrows \`&mut\` dentro de un solo \`println!\` es una pelea que no necesitas.
`,
  },
};
