// ES · editor instructions — Macros, Unsafe, FFI & Money.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-systems-edges.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustSystemsEdgesInstructionsEs: Record<string, { instructions: string }> = {
  "rust-systems-edges-1": {
    instructions: `## Vuelve la invariante inquebrantable

Todo es privado por defecto, y \`pub\` en una struct **no** vuelve públicos sus campos. Eso es lo que convierte "un saldo nunca es negativo" de un comentario en una propiedad del tipo: el constructor es la única puerta.

| escrito | visible para |
| --- | --- |
| *(nada)* | este módulo y sus descendientes |
| \`pub(crate)\` | cualquier parte de este crate |
| \`pub(super)\` | el módulo padre |
| \`pub\` | cualquiera, incluidos otros crates |

### Tu tarea

1. \`mod ledger\` que contenga \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` — el campo **sigue privado**.
2. En \`impl Balance\`: \`pub fn new(stroops: i64) -> Option<Balance>\` (\`None\` si es negativo), \`pub fn stroops(&self) -> i64\`, y \`pub(crate) fn raw(&self) -> i64\`.
3. En \`main\`, haz \`use ledger::Balance;\` e imprime \`new(250)\` mapeado a sus stroops, \`new(-1)\` igual, y \`raw()\` sobre un saldo válido de \`10\`.

Salida esperada:

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

### Pistas

- \`Balance::new(250).map(|b| b.stroops())\` da un \`Option<i64>\`.
`,
  },

  "rust-systems-edges-2": {
    instructions: `## Una macro que una función no podría reemplazar

\`macro_rules!\` hace match sobre sintaxis y se expande a sintaxis, antes de la verificación de tipos. Hace lo que una función no puede: argumentos variádicos, tipos mezclados en una posición, y capturar el texto fuente de una expresión.

Repetición: \`$( ... ),+\` hace match con uno o más grupos separados por coma, y la misma forma en el cuerpo emite una copia por cada match. \`{{ ... }}\` convierte la expansión en una expresión de bloque, así que puede contener statements y aun así producir un valor.

### Tu tarea

Escribe \`macro_rules! metric\` con dos reglas:

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → lo mismo, y después \`",<k>=<v>"\` agregado por cada par.

Llámala con \`("requests", 42)\` y con \`("latency", 95, "method" => "getEvents", "code" => 200)\`.

Salida esperada:

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

### Pistas

- El cuerpo de la segunda regla necesita \`let mut out = format!(...)\`, luego un \`out.push_str(...)\` repetido, y luego \`out\` como cola.
- Pon primero la regla de dos argumentos; las reglas de una macro se prueban en orden.
`,
  },

  "rust-systems-edges-3": {
    instructions: `## Mira lo que genera un derive

\`#[derive(...)]\` es una macro procedural: lee los tokens de tu tipo y devuelve Rust común y corriente. Nada es un caso especial en el compilador, y \`cargo expand\` te muestra la salida.

\`Debug\` imprime cada campo por nombre. \`Clone\` clona cada campo. \`PartialEq\` compara cada campo. \`Default\` rellena cada campo con **su propio** default.

### Tu tarea

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`
2. Construye una con endpoint \`https://rpc\`, retries \`3\`, verbose \`false\`, y hazle \`clone()\`.
3. Imprime la original con \`{:?}\`, si las dos son iguales, y \`Config::default()\` con \`{:?}\`.

Salida esperada:

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Cuatro impls, ninguno escrito por ti.
`,
  },

  "rust-systems-edges-4": {
    instructions: `## Una API segura sobre un núcleo unsafe

\`unsafe\` desbloquea cinco capacidades — desreferenciar un puntero crudo, llamar a una fn \`unsafe\`, tocar un \`static mut\`, implementar un trait \`unsafe\`, leer un campo de una union. Ownership, borrowing y verificación de tipos quedan **sin cambios**.

Lo que significa es "estoy afirmando una invariante que el compilador no puede verificar", así que cada bloque lleva un comentario \`// SAFETY:\` diciendo por qué la afirmación se cumple.

Una función segura que contiene \`unsafe\` promete que la invariante se cumple para *cualquier* entrada. Eso es lo que vuelve seguro a \`split_at_mut\`.

### Tu tarea

Escribe \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` que devuelva dos mitades mutables que no se solapan, usando \`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\` y un comentario \`// SAFETY:\`.

En \`main\`, divide \`[1, 2, 3, 4, 5, 6]\`, escribe \`100\` en el primer elemento de la mitad izquierda y \`200\` en el de la derecha, imprime ambas mitades y luego imprime el array completo.

Salida esperada:

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\`

### Pistas

- Lee \`len()\` y \`mid\` **antes** de tomar el puntero, para que no haya ningún borrow vivo a través de él.
- \`ptr.add(mid)\` avanza \`mid\` elementos.
`,
  },

  "rust-systems-edges-5": {
    instructions: `## Maneja direcciones a propósito

Un puntero crudo es una dirección a secas: sin lifetime, sin ownership, sin garantía de aliasing. **Crear uno es seguro; desreferenciarlo no.**

Una desreferencia afirma cuatro cosas a la vez — no nulo, alineado, apuntando a un valor vivo, y sin alias con un \`&mut\` vivo. La última es la que se le escapa a la gente, y sus bugs aparecen lejos de la línea culpable.

### Tu tarea

1. \`let mut value = 42i64;\` y un \`*mut i64\` hacia él. En un bloque \`unsafe\` con un comentario \`// SAFETY:\`, incrementa a través del puntero e imprime el valor leído de vuelta a través de él. Luego imprime el binding original.
2. \`let arr = [10i64, 20, 30];\` y su \`as_ptr()\`. Imprime el elemento en el offset \`2\` vía \`add\`.
3. Construye \`std::ptr::null::<i64>()\` e imprime \`is_null()\` — una llamada segura, sin bloque.

Salida esperada:

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\`

### Pistas

- \`let p: *mut i64 = &mut value;\` convierte la referencia en un puntero crudo.
- \`add\` cuenta en unidades de \`T\`, así que \`add(2)\` sobre un \`*const i64\` avanza 16 bytes.
`,
  },

  "rust-systems-edges-6": {
    instructions: `## Ownership a través de la frontera

El ABI de Rust es deliberadamente inestable, así que cruzar a C significa adoptar el de ellos: \`#[repr(C)]\` para el layout, \`#[no_mangle]\` y \`extern "C"\` para el símbolo y la convención de llamada.

La parte difícil es el ownership cruzando una frontera que el compilador no puede ver. Cada \`Box::into_raw\` necesita exactamente un \`Box::from_raw\` correspondiente — cero es una fuga, dos es una doble liberación.

### Tu tarea

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — tiene que ser \`pub\`, ya que las funciones exportadas lo mencionan.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — \`0\` para nulo, si no \`x + y\`, con un comentario \`// SAFETY:\`.
3. \`point_new(x, y) -> *mut Point\` vía \`Box::into_raw\`, y \`point_free(p: *mut Point)\` vía \`Box::from_raw\`, con verificación de nulo.
4. En \`main\`: construye \`(3, 4)\`, imprime su suma, imprime el punto a través del puntero crudo, libéralo, imprime \`size_of::<Point>()\`, y luego \`point_sum\` de un puntero nulo.

Salida esperada:

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

Un \`into_raw\`, un \`from_raw\`. Ese par es el contrato completo.

### Pistas

- \`std::ptr::null()\` para la última llamada.
- Libera el punto **antes** de imprimir el tamaño, o el orden de los borrows te va a confundir.
`,
  },

  "rust-systems-edges-7": {
    instructions: `## Dinero en enteros

Un saldo nunca es un float — \`f64\` no puede representar la mayoría de las fracciones decimales con exactitud, y en un ledger ese error es dinero que no cuadra. Guarda la unidad indivisible más pequeña como entero: stroops, centavos, satoshis.

Los enteros no pierden precisión, pero se **desbordan** — y la verificación se compila fuera en builds de release. Sé explícito:

| método | ante un desbordamiento |
| --- | --- |
| \`checked_add\` | \`None\` — lo manejas tú |
| \`saturating_add\` | se queda en el máximo |
| \`wrapping_add\` | da la vuelta |

Para dinero, siempre \`checked_\`.

### Tu tarea

1. \`const STROOPS_PER_XLM: i64 = 10_000_000;\`
2. \`fn to_stroops(xlm: i64, fraction: i64) -> Option<i64>\` usando \`checked_mul(..)?\` y después \`checked_add(..)\`.
3. Imprime \`to_stroops(2, 5_000_000)\` y \`to_stroops(i64::MAX, 0)\` con \`{:?}\`.
4. Imprime \`100i64.checked_sub(30)\` y \`10i64.checked_sub(i64::MIN)\` con \`{:?}\`.
5. Imprime \`i64::MAX.saturating_add(1)\` e \`i64::MAX.wrapping_add(1)\`.
6. Imprime si \`0.1f64 + 0.2f64 == 0.3\`.

Salida esperada:

\`\`\`text
2.5 XLM: Some(25000000)
overflow: None
checked_sub ok: Some(70)
checked_sub under: None
saturating: 9223372036854775807
wrapping: -9223372036854775808
float equality: false
\`\`\`

La última línea es la razón por la que importan las seis primeras.
`,
  },
};
