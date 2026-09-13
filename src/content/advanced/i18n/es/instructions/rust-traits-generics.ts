// ES · editor instructions — Traits, Generics & Dispatch.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-traits-generics.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustTraitsGenericsInstructionsEs: Record<string, { instructions: string }> = {
  "rust-traits-generics-1": {
    instructions: `## Un método obligatorio, uno por defecto

Un trait puede ofrecer cuerpos de método por defecto escritos en términos de sus métodos obligatorios. Quien implementa se los lleva gratis y puede sobrescribirlos.

\`\`\`rust
trait Health {
    fn name(&self) -> String;
    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

### Tu tarea

1. Define \`Health\` como arriba.
2. Define las unit structs \`Db\` y \`Rpc\`.
3. \`Db\` implementa solo \`name\`, devolviendo \`db\`.
4. \`Rpc\` implementa \`name\` (devolviendo \`rpc\`) **y** sobrescribe \`status\` para devolver \`"<name>: degraded"\`.
5. Imprime ambos status.

Salida esperada:

\`\`\`text
db: ok
rpc: degraded
\`\`\`

### Pistas

- Una unit struct se escribe \`struct Db;\` y se usa como el valor \`Db\`.
- \`format!\` arma una \`String\` de la misma forma en que \`println!\` arma una línea.
`,
  },

  "rust-traits-generics-2": {
    instructions: `## Restringe exactamente lo que usas

Un bound es un contrato de ida y vuelta: quien llama tiene que pasar un tipo que lo satisfaga, y a cambio el cuerpo puede contar con eso.

Restringe al **mínimo** que el cuerpo necesita. Un \`T: Clone\` innecesario en una función que nunca clona no agrega seguridad — rechaza a quien llama con un tipo no-\`Clone\` perfectamente bueno.

### Tu tarea

Escribe \`fn describe_all<T>(items: &[T]) -> String\` con una cláusula \`where T: Display\`, uniendo cada elemento con \`", "\`.

Llámala con \`&[1, 2, 3]\` y con \`&["a", "b"]\`.

Salida esperada:

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

### Pistas

- \`use std::fmt::Display;\`
- Arma el resultado con \`push_str\`, no con \`join\` — el punto es ver el bound en uso.
- \`.iter().enumerate()\` te da el índice, así puedes saltarte el separador en el primer elemento.
`,
  },

  "rust-traits-generics-3": {
    instructions: `## Una respuesta por tipo

Un **associated type** se elige una vez, en el único impl para un tipo dado. Un **parámetro genérico** permite muchos impls por tipo.

El test: *¿existe exactamente una respuesta sensata por tipo implementador?* \`Iterator::Item\` es asociado porque un contador produce un solo tipo de cosa. \`From<T>\` es genérico porque un tipo debería convertir desde muchos.

### Tu tarea

1. \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`
2. \`struct Counter { n: u32 }\` que implemente \`Source\` con \`type Item = u32;\` y \`fn next_item(&mut self) -> Option<u32>\` — el tipo resuelto, no \`Option<Self::Item>\` — produciendo \`1\`, \`2\`, \`3\` y luego \`None\`.
3. \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` recolectando todo lo que la fuente produzca.
4. Imprime el vector drenado con \`{:?}\`.

Salida esperada:

\`\`\`text
items: [1, 2, 3]
\`\`\`

### Pistas

- \`while let Some(item) = s.next_item()\` lo drena limpiamente.
- Fíjate en \`Vec<S::Item>\` — el associated type proyectado desde el \`S\` concreto.
`,
  },

  "rust-traits-generics-4": {
    instructions: `## Tres call sites, tres funciones

El compilador **monomorfiza** un genérico: estampa una copia especializada por cada tipo concreto con el que se lo llama. Cada copia conoce su tipo, así que cada llamada adentro es directa e inlineable — eso es lo que significa "costo cero" aquí.

Los costos se mueven al tamaño del binario y al tiempo de compilación.

### Tu tarea

Escribe \`fn emit<T: Debug>(label: &str, value: T)\` que imprima \`"<label>: <value:?>"\`.

Llámala con \`42u32\`, con \`"rpc"\` y con \`vec![true, false]\` — tres instanciaciones.

Salida esperada:

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

Fíjate en las comillas alrededor de \`rpc\`: eso es formato \`Debug\`, no \`Display\`, y la diferencia es el punto.

### Pistas

- \`use std::fmt::Debug;\`
- El formateador es \`{:?}\`.
`,
  },

  "rust-traits-generics-5": {
    instructions: `## Un registro heterogéneo

Un \`Vec<T>\` guarda un solo tipo. Cuando necesitas varios, necesitas un trait object:

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` no tiene tamaño en tiempo de compilación, así que siempre vive detrás de un puntero — y ese puntero es **gordo**: una palabra a los datos, otra a la vtable.

### Tu tarea

1. \`trait Check { fn run(&self) -> String; }\`
2. Unit structs \`Ping\` y \`Disk\` que lo implementen, devolviendo \`ping ok\` y \`disk ok\`.
3. Arma un \`Vec<Box<dyn Check>>\` con uno de cada, itéralo imprimiendo cada resultado, y luego imprime la cantidad.

Salida esperada:

\`\`\`text
ping ok
disk ok
count: 2
\`\`\`

### Pistas

- Itera con \`for c in &checks\` para que el vector no se consuma antes del \`.len()\`.
`,
  },

  "rust-traits-generics-6": {
    instructions: `## Mantén el trait usable como objeto

Un trait es **object safe** solo si cada método se puede despachar a través de una vtable. Dos reglas causan casi todos los fallos reales:

1. **Sin métodos genéricos** — una vtable es una tabla fija, y un genérico necesitaría un número ilimitado de slots.
2. **Sin \`Self\` en posición de retorno** — quien llama no puede saber el tamaño de ese tipo.

El arreglo para ambos es mover el hueco del tiempo de compilación al runtime: recibe \`&dyn Trait\` en vez de un genérico.

### Tu tarea

1. \`trait Encode { fn encode(&self) -> String; }\`
2. \`struct Num(i64)\` que lo implemente como el texto decimal del número.
3. \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — el \`&dyn\` es lo que lo mantiene object safe.
4. Unit struct \`Log\` que implemente \`Sink\`, devolviendo \`"log:<encoded>"\`.
5. Guárdalo como \`Box<dyn Sink>\` y acepta un \`Num(42)\`.

Salida esperada:

\`\`\`text
log:42
\`\`\`

Si \`accept\` hubiera sido genérico, el paso 5 no compilaría.
`,
  },

  "rust-traits-generics-7": {
    instructions: `## Un impl, todos los tipos Display

Un **blanket impl** cubre de una vez todo tipo que satisfaga un bound:

\`\`\`rust
impl<T: Display> Loggable for T { ... }
\`\`\`

La biblioteca estándar se apoya en esto: \`ToString\` es un blanket impl sobre \`Display\`, e \`Into<U>\` sobre \`From<T>\` — por eso implementas \`From\` y te llevas \`Into\` gratis.

La **orphan rule** es el límite: puedes implementar un trait para un tipo solo si el trait es tuyo o el tipo es tuyo. La salida es un newtype, que no cuesta nada en runtime.

### Tu tarea

1. \`trait Loggable { fn log_line(&self) -> String; }\`
2. Un blanket \`impl<T: Display> Loggable for T\` que devuelva \`"[log] <value>"\`.
3. Llama a \`.log_line()\` sobre \`42\` y sobre \`"rpc down"\` — dos tipos, cero impls extra.

Salida esperada:

\`\`\`text
[log] 42
[log] rpc down
\`\`\`
`,
  },
};
