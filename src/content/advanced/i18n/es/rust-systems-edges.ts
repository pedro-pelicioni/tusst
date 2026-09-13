import type { LessonStep } from "@/content/steps";

// ES · Macros, Unsafe, FFI & Money.
//
// Overlay for ../../steps/rust-systems-edges.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustSystemsEdgesStepsEs: Record<string, LessonStep[]> = {
  "rust-systems-edges-1": [
    {
      kind: "theory",
      body: `Todo en Rust es **privado por defecto**, y el árbol de módulos es lo que vuelve una invariante algo que se impone en vez de algo que solo se documenta.

\`\`\`rust
mod ledger {
    pub struct Balance { stroops: i64 }   // tipo público, campo privado
}
\`\`\`

Fuera de \`ledger\`, nadie puede construir un \`Balance\` con un literal, leer \`stroops\` directamente ni mutarlo. La única entrada es el constructor que expusiste — así que "un saldo nunca es negativo" deja de ser un comentario y pasa a ser una propiedad del tipo.`,
    },
    {
      kind: "theory",
      body: `Cuatro niveles de visibilidad, en el orden en que deberías recurrir a ellos:

| escrito | visible para |
| --- | --- |
| *(nada)* | este módulo y sus descendientes |
| \`pub(crate)\` | cualquier parte de este crate |
| \`pub(super)\` | el módulo padre |
| \`pub\` | cualquiera, incluidos otros crates |

\`pub(crate)\` es el que la gente usa de menos. Es el nivel correcto para un helper que varios módulos comparten pero que nunca debe aparecer en tu API pública — y, a diferencia de \`pub\`, cambiarlo después no rompe compatibilidad para quien te usa.

La convención de layout: \`mod\` declara, \`use\` importa, \`super::\` sube, \`crate::\` parte de la raíz. Un \`lib.rs\` que es casi solo líneas de \`pub mod\` y \`pub use\` es la API pública completa en un archivo legible, que es exactamente lo que debería ser.`,
    },
    {
      kind: "quiz",
      question:
        "`pub struct Balance { stroops: i64 }` — ¿qué puede hacer con él el código de fuera del módulo?",
      options: [
        "Solo lo que permitan las funciones públicas del módulo — el campo es privado, así que ni construcción por literal ni lecturas directas",
        "Todo; `pub` en la struct vuelve públicos sus campos también",
        "Nada en absoluto; el tipo es inutilizable fuera de su módulo",
      ],
      answer: 0,
      explain:
        "La privacidad de campo es por campo y por defecto es privada. Este es el mecanismo detrás de todo tipo 'parse, don't validate' en Rust — el constructor es la única puerta.",
    },
    {
      kind: "fill",
      prompt:
        "Expón un helper a todo el crate sin agregarlo a la API pública.",
      file: "main.rs",
      before: "    ",
      after: " fn raw(&self) -> i64 {",
      choices: ["pub(crate)", "pub", "pub(super)"],
      answer: 0,
      explain:
        "`pub(crate)` lo mantiene fuera de la superficie publicada, así que puede cambiar sin una release que rompa compatibilidad. `pub(super)` solo alcanzaría al módulo padre.",
    },
    {
      kind: "quiz",
      question:
        "¿Por qué importa, más allá del estilo, hacer un helper `pub` en vez de `pub(crate)`?",
      options: [
        "`pub` forma parte de tu contrato de semver — quitarlo o cambiarlo después es una release que rompe compatibilidad",
        "Los ítems `pub` se compilan por separado y hacen más lento el build",
        "`pub` desactiva el inlining a través de las fronteras de módulo",
      ],
      answer: 0,
      explain:
        "Cada ítem `pub` es una promesa a desconocidos. La visibilidad más estrecha que compila es la que te deja libre para cambiar de idea.",
    },
    {
      kind: "editor",
      intro: `### Vuelve la invariante inquebrantable

1. \`mod ledger\` que contenga \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` — el **campo sigue privado**.
2. En \`impl Balance\`: \`pub fn new(stroops: i64) -> Option<Balance>\` que devuelva \`None\` para un valor negativo, \`pub fn stroops(&self) -> i64\`, y \`pub(crate) fn raw(&self) -> i64\`.
3. En \`main\`, haz \`use ledger::Balance;\` e imprime \`new(250)\` mapeado a sus stroops, \`new(-1)\` de la misma forma, y \`raw()\` sobre un saldo válido.

Salida esperada:

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

No hay forma de construir un \`Balance\` negativo desde \`main\`. Ese es el punto.`,
    },
  ],

  "rust-systems-edges-2": [
    {
      kind: "theory",
      body: `\`macro_rules!\` hace match sobre **sintaxis** y se expande a más sintaxis, antes de la verificación de tipos. Hace lo que una función no puede:

- recibir un número variable de argumentos
- aceptar argumentos de tipos distintos en la misma posición
- capturar el *texto fuente* de una expresión (así es como \`assert_eq!\` imprime ambos lados)

\`\`\`rust
macro_rules! metric {
    ($name:expr, $value:expr) => { format!("{}={}", $name, $value) };
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Dos mecanismos hacen la mayor parte del trabajo.

**Los fragment specifiers** dicen qué tipo de sintaxis acepta cada captura: \`expr\`, \`ident\`, \`ty\`, \`literal\`, \`block\`, \`pat\`, \`tt\`. Usar el más estrecho da mejores errores — \`$n:ident\` rechaza una expresión completa en el call site de la macro, en vez de en lo profundo de la expansión.

**Repetición.** \`$( ... ),+\` hace match con uno o más grupos separados por coma, y el mismo \`$( ... )+\` en el cuerpo emite una copia por cada match:

\`\`\`rust
($name:expr, $value:expr, $($k:expr => $v:expr),+) => {{
    let mut out = format!("{}={}", $name, $value);
    $( out.push_str(&format!(",{}={}", $k, $v)); )+
    out
}};
\`\`\`

Fíjate en las llaves dobles: \`{{ ... }}\` convierte la expansión en una expresión de bloque, así que puede contener statements y aun así evaluar a un valor.

La disciplina: **primero intenta con una función.** Una macro es más difícil de leer, más difícil de depurar e invisible para el go-to-definition de \`rust-analyzer\`. Usa una cuando lo que necesitas genuinamente no pueda ser una función — argumentos variádicos, o capturar texto fuente.`,
    },
    {
      kind: "quiz",
      question: "¿Qué puede hacer una macro `macro_rules!` que una función no?",
      options: [
        "Recibir un número variable de argumentos, mezclar tipos en una posición y capturar el texto fuente de una expresión",
        "Correr más rápido, porque se expande en tiempo de compilación",
        "Acceder a campos privados de tipos de otros módulos",
      ],
      answer: 0,
      explain:
        "La velocidad no es motivo: una macro se expande a código que el optimizador ve exactamente igual que a una función inlineada. Los variádicos y la captura de fuente son las motivaciones reales, y las únicas.",
    },
    {
      kind: "fill",
      prompt: "Haz match con uno o más pares clave/valor separados por coma.",
      file: "main.rs",
      before: "($name:expr, $value:expr, $($k:expr => $v:expr)",
      after: ") => {{",
      choices: [",+", "*", ";?"],
      answer: 0,
      explain:
        "`,+` significa 'uno o más, separados por coma'. `,*` permitiría cero, lo que aquí choca con la regla de dos argumentos que está justo arriba.",
    },
    {
      kind: "quiz",
      question: "¿Por qué se usa `{{ ... }}` en el cuerpo de una expansión de macro?",
      options: [
        "Las llaves internas convierten la expansión en una expresión de bloque, así que puede contener statements y aun así evaluar a un valor",
        "Escapan las llaves para que aparezcan literalmente en la salida",
        "Es sintaxis obligatoria para cualquier macro con repetición",
      ],
      answer: 0,
      explain:
        "El par externo delimita la expansión; el interno es un bloque Rust de verdad. Sin él, una expansión con varios statements no puede usarse donde se espera un valor.",
    },
    {
      kind: "editor",
      intro: `### Una macro que una función no podría reemplazar

Escribe \`macro_rules! metric\` con dos reglas:

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → lo mismo, y después \`",<k>=<v>"\` agregado por cada par.

Luego llámala dos veces: con \`("requests", 42)\`, y con \`("latency", 95, "method" => "getEvents", "code" => 200)\`.

Salida esperada:

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

Dos aridades distintas, y la segunda es variádica — que es exactamente por qué esto no puede ser una función.`,
    },
  ],

  "rust-systems-edges-3": [
    {
      kind: "theory",
      body: `\`#[derive(...)]\` es una **macro procedural**: recibe el token stream de tu tipo y devuelve código generado, que se compila junto con él.

\`#[derive(Debug)]\` escribe un impl de \`Debug\` que imprime cada campo por nombre. \`#[derive(Clone)]\` escribe un \`clone\` que clona cada campo. \`#[derive(PartialEq)]\` compara cada campo. \`#[derive(Default)]\` rellena cada campo con **su propio** default — \`0\`, \`false\`, \`String::new()\`.

Nada es un caso especial en el compilador. La salida es Rust común y corriente, y \`cargo expand\` te la muestra.`,
    },
    {
      kind: "theory",
      body: `Dos consecuencias que vale la pena retener.

**Un derive solo puede hacer lo que sus entradas permiten.** \`#[derive(Clone)]\` en una struct con un campo que no es \`Clone\` falla — y el error apunta al derive, que es por qué esos mensajes suenan raro las primeras veces.

**Los atributos configuran el código generado.** \`#[serde(rename = "type")]\`, \`#[serde(default)]\`, \`#[serde(skip)]\` los lee el derive de Serde mientras genera el impl. No son features del compilador; son argumentos para una macro.

Los tres tipos de macro procedural, para dejar el vocabulario resuelto: **derive** (\`#[derive(Serialize)]\`), **de atributo** (\`#[tokio::main]\`, que reescribe tu \`fn main\` en uno que arranca un runtime), y **tipo función** (\`sqlx::query!\`, que llega a la base de datos en tiempo de compilación para verificar tu SQL). Los tres son crates Rust comunes que corren durante la compilación.`,
    },
    {
      kind: "quiz",
      question: "¿Qué hace en realidad `#[tokio::main]`?",
      options: [
        "Es una macro de atributo que reescribe tu `async fn main` en un `main` síncrono que construye un runtime y llama a `block_on`",
        "Marca la función para que el compilador enlace el runtime de Tokio",
        "Es un builtin del compilador que habilita el soporte de async",
      ],
      answer: 0,
      explain:
        "`cargo expand` muestra la reescritura completa — y es el mismo `Runtime::new().block_on(...)` que habrías escrito tú. Saber esto vuelve obvio el panic de 'cannot start a runtime from within a runtime'.",
    },
    {
      kind: "fill",
      prompt:
        "Dale a la struct comparación por valor y un constructor en ceros.",
      file: "main.rs",
      before: "#[derive(Debug, Clone, ",
      after: ")]\nstruct Config {",
      choices: ["PartialEq, Default", "Eq, New", "Copy, Default"],
      answer: 0,
      explain:
        "`Copy` fallaría aquí: la struct guarda una `String`, que es dueña de una asignación en el heap y por lo tanto no puede ser `Copy`.",
    },
    {
      kind: "quiz",
      question:
        "`#[derive(Clone)]` en una struct no compila. ¿Cuál es casi siempre la causa?",
      options: [
        "Uno de los campos no es `Clone`, y el derive solo puede generar lo que sus entradas soportan",
        "A la struct le falta `#[derive(Copy)]`, que `Clone` requiere",
        "La struct tiene un parámetro de lifetime, que los derives no soportan",
      ],
      answer: 0,
      explain:
        "La dependencia va en el otro sentido — `Copy` requiere `Clone`, nunca al revés. Y los derives manejan lifetimes sin problema.",
    },
    {
      kind: "editor",
      intro: `### Mira lo que genera un derive

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`.
2. Construye una con endpoint \`https://rpc\`, retries \`3\`, verbose \`false\`, y hazle \`clone()\`.
3. Imprime la original con \`{:?}\`, si las dos son iguales, y \`Config::default()\` con \`{:?}\`.

Salida esperada:

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Cuatro impls, ninguno escrito por ti — y cada uno es Rust común que podrías haber escrito a mano.`,
    },
  ],

  "rust-systems-edges-4": [
    {
      kind: "theory",
      body: `\`unsafe\` no apaga el borrow checker. Desbloquea exactamente cinco capacidades:

1. desreferenciar un puntero crudo
2. llamar a una función \`unsafe\`
3. acceder a un \`static mut\`
4. implementar un trait \`unsafe\`
5. acceder a un campo de una union

Todo lo demás — ownership, borrowing, lifetimes, verificación de tipos — aplica dentro de un bloque \`unsafe\` exactamente igual que fuera.`,
    },
    {
      kind: "theory",
      body: `Lo que \`unsafe\` significa de verdad es **"estoy afirmando una invariante que el compilador no puede verificar."** Así que la habilidad que se pone a prueba — por la que de hecho le pagan a quien revisa código de sistemas — es enunciar esa invariante con precisión.

La convención es un comentario \`// SAFETY:\` en cada bloque \`unsafe\`, diciendo *por qué* la afirmación se cumple:

\`\`\`rust
// SAFETY: mid <= len, así que ambos rangos están dentro de la misma asignación, y
// no se solapan — por eso las dos slices &mut nunca hacen alias.
unsafe {
    (from_raw_parts_mut(ptr, mid), from_raw_parts_mut(ptr.add(mid), len - mid))
}
\`\`\`

De ahí salen dos reglas. **Mantén el bloque lo más pequeño posible** — una operación, no el cuerpo entero de una función, para que quien lee sepa exactamente qué línea carga con la afirmación. Y **una función segura que contiene \`unsafe\` está prometiendo que la invariante se cumple para cualquier entrada posible**; si quien llama puede romperla con código seguro común, la función misma tiene que marcarse \`unsafe\`.

El \`split_at_mut\` de la biblioteca estándar es exactamente este programa: una API que el borrow checker no puede expresar, vuelta segura por un argumento que su autor dejó por escrito.`,
    },
    {
      kind: "quiz",
      question: "¿Qué cambia en realidad un bloque `unsafe`?",
      options: [
        "Permite cinco operaciones específicas, como desreferenciar un puntero crudo — ownership, borrowing y verificación de tipos no se ven afectados",
        "Desactiva el borrow checker para el código que encierra",
        "Permite data races y se salta las verificaciones de límites",
      ],
      answer: 0,
      explain:
        "Este es el malentendido más común. Los errores de borrow dentro de un bloque `unsafe` siguen siendo errores de borrow — `unsafe` es una llave mucho más estrecha de lo que sugiere su reputación.",
    },
    {
      kind: "fill",
      prompt: "Documenta la invariante que este bloque está afirmando.",
      file: "main.rs",
      before: "// ",
      after: ": mid <= len, así que ambos rangos están dentro de los límites y no se solapan.\nunsafe {",
      choices: ["SAFETY", "NOTE", "UNSAFE"],
      answer: 0,
      explain:
        "`// SAFETY:` es la convención de todo el ecosistema, y el lint `undocumented_unsafe_blocks` de clippy busca exactamente ese prefijo.",
    },
    {
      kind: "quiz",
      question:
        "¿Cuándo una función que contiene un bloque `unsafe` debe marcarse ella misma como `unsafe fn`?",
      options: [
        "Cuando quien llama podría romper la invariante usando solo código seguro — entonces la obligación pasa a ser de quien llama",
        "Siempre — cualquier función que contenga `unsafe` debe ser `unsafe`",
        "Nunca — marcar el bloque es suficiente",
      ],
      answer: 0,
      explain:
        "Este es el diseño completo de las abstracciones seguras. `Vec::push` usa `unsafe` por dentro y es seguro, porque nadie que lo llame con código seguro puede violar sus invariantes. `slice::get_unchecked` es `unsafe` porque quien llama puede pasar cualquier índice.",
    },
    {
      kind: "editor",
      intro: `### Una API segura sobre un núcleo unsafe

Escribe \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` que devuelva dos mitades mutables que no se solapan — algo que el borrow checker no puede expresar, y que \`std\` ofrece como \`split_at_mut\`.

Usa \`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\`, y un comentario \`// SAFETY:\` que diga por qué las dos slices nunca hacen alias.

En \`main\`, divide \`[1, 2, 3, 4, 5, 6]\`, escribe \`100\` en el primer elemento de la mitad izquierda y \`200\` en el primero de la derecha, imprime ambas mitades y luego imprime el array completo.

Salida esperada:

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\``,
    },
  ],

  "rust-systems-edges-5": [
    {
      kind: "theory",
      body: `Un puntero crudo — \`*const T\` o \`*mut T\` — es una dirección a secas. No carga lifetime, ni ownership, ni garantía de aliasing, y puede ser nulo o estar desalineado.

Crear uno es **seguro**. Desreferenciarlo no:

\`\`\`rust
let p: *mut i64 = &mut value;    // seguro — es solo una dirección
unsafe { *p += 1; }              // unsafe — estás afirmando que es válido
\`\`\`

Esa separación es deliberada: sostener una dirección nunca puede corromper nada. Leer a través de ella, sí.`,
    },
    {
      kind: "theory",
      body: `Desreferenciar afirma cuatro cosas a la vez, y las cuatro son responsabilidad tuya:

**No nulo.** \`ptr::null()\` existe e \`is_null()\` lo verifica — un puntero crudo no tiene nicho de \`Option\` en el que apoyarse.
**Alineado.** Un \`*mut i64\` tiene que estar en una frontera de 8 bytes. Una lectura desalineada es comportamiento indefinido incluso en hardware que la tolera.
**Apuntando a un valor vivo.** El original no debe haber sido dropeado ni movido.
**Sin alias con un \`&mut\` vivo.** Esta es la que se le escapa a la gente. El optimizador de Rust asume que \`&mut T\` es único, y escribir a través de un puntero crudo que se solapa con un \`&mut\` vivo rompe esa suposición — la miscompilación puede aparecer lejos de la línea culpable.

\`ptr.add(n)\` hace aritmética de punteros en unidades de \`T\`, y exige que el resultado se mantenga dentro de la misma asignación — uno más allá del final está permitido, cualquier cosa más allá es indefinido aunque nunca lo leas.

La guía práctica: si estás recurriendo a punteros crudos fuera de FFI o de una estructura de datos que el borrow checker genuinamente no puede expresar, casi seguro hay una forma segura. Corre \`cargo miri test\` cuando lo hagas — detecta la mayoría de estas violaciones en runtime.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué crear un puntero crudo es seguro y desreferenciarlo no?",
      options: [
        "Sostener una dirección nunca puede corromper nada; leer o escribir a través de ella afirma una validez que el compilador no puede verificar",
        "La creación se verifica en tiempo de compilación, la desreferencia en runtime",
        "Crear un puntero crudo también es unsafe; el compilador simplemente no lo impone",
      ],
      answer: 0,
      explain:
        "Por eso `&raw const x` y los casts son operaciones seguras. La obligación se ata al punto de uso, que es también donde va el comentario `// SAFETY:`.",
    },
    {
      kind: "fill",
      prompt: "Avanza un puntero dos elementos, no dos bytes.",
      file: "main.rs",
      before: "unsafe { println!(\"offset 2: {}\", *base.",
      after: "(2)); }",
      choices: ["add", "offset_bytes", "wrapping_byte_add"],
      answer: 0,
      explain:
        "`add` cuenta en unidades de `T`, así que `base.add(2)` sobre un `*const i64` avanza 16 bytes. El resultado tiene que quedar dentro de la misma asignación.",
    },
    {
      kind: "quiz",
      question:
        "¿Qué violación de punteros crudos es la más propensa a producir un bug que aparece lejos de su causa?",
      options: [
        "Escribir a través de un puntero crudo que hace alias con un `&mut` vivo — el optimizador asumió unicidad y miscompila en otra parte",
        "Desreferenciar un puntero nulo, que colapsa de inmediato",
        "Leer un elemento más allá del final de un array",
      ],
      answer: 0,
      explain:
        "Una desreferencia nula da segfault en la línea. Una violación de aliasing es silenciosa, y el código erróneo que emitió el optimizador puede estar en una función completamente distinta — que es exactamente para lo que existe `cargo miri`.",
    },
    {
      kind: "editor",
      intro: `### Maneja direcciones a propósito

1. Toma \`let mut value = 42i64;\` y un \`*mut i64\` hacia él. En un bloque \`unsafe\` con un comentario \`// SAFETY:\`, incrementa a través del puntero e imprime el valor leído de vuelta a través de él. Luego imprime el binding original — mismo valor.
2. Toma \`let arr = [10i64, 20, 30];\` y su \`as_ptr()\`. Imprime el elemento en el offset \`2\` vía \`add\`.
3. Construye un \`std::ptr::null::<i64>()\` e imprime \`is_null()\` — una llamada segura, sin bloque.

Salida esperada:

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\``,
    },
  ],

  "rust-systems-edges-6": [
    {
      kind: "theory",
      body: `Un **ABI** es la convención de llamada a nivel de máquina: cómo se pasan los argumentos, cómo se devuelven los valores, cómo se dispone una struct en memoria. El ABI propio de Rust es deliberadamente inestable, así que cruzar a C o C++ significa adoptar el de ellos.

Dos atributos lo hacen:

\`\`\`rust
#[repr(C)]                        // dispón esta struct como lo haría C
pub struct Point { x: i64, y: i64 }

#[no_mangle]                      // conserva el nombre del símbolo tal cual
pub extern "C" fn point_sum(p: *const Point) -> i64
\`\`\`

Sin \`#[repr(C)]\`, Rust puede reordenar los campos para compactar. Sin \`#[no_mangle]\`, el linker ve un símbolo mangled que ningún código C puede encontrar.`,
    },
    {
      kind: "theory",
      body: `La parte difícil de FFI no es la sintaxis, es **el ownership cruzando una frontera que el compilador no puede ver**.

\`\`\`rust
Box::into_raw(Box::new(Point { x, y }))   // el ownership sale de Rust
drop(Box::from_raw(p))                    // el ownership vuelve, liberado una vez
\`\`\`

Entre esas dos llamadas, nada en Rust está rastreando ese puntero. Las reglas que hacen esto sobrevivible:

**Cada \`into_raw\` necesita exactamente un \`from_raw\` correspondiente.** Cero es una fuga; dos es una doble liberación. Entrega la función de liberación junto con el constructor, y documenta el par.

**Libera con el mismo allocator que asignó.** La memoria del \`Box\` de Rust tiene que volver a Rust, nunca al \`free\` de C, y viceversa.

**Nunca dejes que un panic cruce la frontera.** Que el unwinding atraviese frames de C es comportamiento indefinido; atrápalo con \`catch_unwind\` en el borde y devuelve un código de error.

**Valida todo lo que llega.** Un puntero que viene de C puede ser nulo, estar desalineado o colgante — verifica lo que puedas, y pon el resto en la documentación \`# Safety\` de la función.

En la práctica, recurre a \`cxx\` (un puente Rust/C++ verificado) o \`bindgen\` (genera declaraciones a partir de headers de C) en vez de escribir declaraciones a mano. Ambos eliminan los errores de transcripción, que son los que de verdad muerden.`,
    },
    {
      kind: "quiz",
      question: "¿Qué garantiza `#[repr(C)]`?",
      options: [
        "Los campos se disponen en orden de declaración con las reglas de padding de C, así que un programa en C puede leer la struct",
        "La struct solo puede usarse desde código C",
        "Cada campo se convierte a un tipo de C al accederlo",
      ],
      answer: 0,
      explain:
        "La representación por defecto de Rust puede reordenar campos para reducir el padding. Es una buena optimización, y una fatal si algo del otro lado espera un layout fijo.",
    },
    {
      kind: "fill",
      prompt: "Entrega el ownership de un valor del heap hacia el otro lado de la frontera.",
      file: "main.rs",
      before: "    Box::",
      after: "(Box::new(Point { x, y }))",
      choices: ["into_raw", "leak", "as_ref"],
      answer: 0,
      explain:
        "`into_raw` cede el ownership y devuelve el puntero, que `from_raw` puede reclamar después. `Box::leak` también cede el ownership, pero devuelve un `&'static mut` que nunca puede liberarse.",
    },
    {
      kind: "quiz",
      question: "¿Por qué un panic nunca debe cruzar una frontera de FFI?",
      options: [
        "Que el unwinding atraviese frames de stack de C es comportamiento indefinido — atrápalo en el borde y devuelve un código de error",
        "C no puede mostrar el mensaje del panic",
        "El panic se tragaría en silencio y el error se perdería",
      ],
      answer: 0,
      explain:
        'Las funciones `extern "C"` abortan en vez de hacer unwinding por defecto en el Rust actual, lo que convierte el UB en un colapso. Envolver el cuerpo en `catch_unwind` y devolver un status es la versión que quien llama sí puede manejar.',
    },
    {
      kind: "editor",
      intro: `### Ownership a través de la frontera

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — tiene que ser \`pub\`, ya que las funciones exportadas lo mencionan.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — devuelve \`0\` para nulo, si no \`x + y\`, con un comentario \`// SAFETY:\`.
3. \`point_new(x, y) -> *mut Point\` vía \`Box::into_raw\`, y \`point_free(p: *mut Point)\` vía \`Box::from_raw\`, con verificación de nulo.
4. En \`main\`: construye un punto \`(3, 4)\`, imprime su suma, imprime el punto mismo a través del puntero crudo, libéralo, imprime \`size_of::<Point>()\`, y luego imprime \`point_sum\` de un puntero nulo.

Salida esperada:

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

Un \`into_raw\`, un \`from_raw\`. Ese par es el contrato completo.`,
    },
  ],

  "rust-systems-edges-7": [
    {
      kind: "theory",
      body: `**Un saldo nunca es un float.** \`f64\` no puede representar \`0.1\` con exactitud, así que la aritmética acumula error — y en un ledger, error es dinero que no cuadra.

\`\`\`rust
0.1f64 + 0.2f64 == 0.3     // false
\`\`\`

La respuesta universal es **punto fijo**: guarda la unidad indivisible más pequeña como entero. Stellar cuenta *stroops*, a \`10_000_000\` por XLM. La mayoría de las monedas cuentan centavos. No hay redondeo, porque no hay nada que redondear.`,
    },
    {
      kind: "theory",
      body: `Los enteros no pierden precisión en silencio, pero sí se **desbordan** — y en builds de release la verificación se compila fuera, así que \`i64::MAX + 1\` da la vuelta a \`i64::MIN\` sin ningún aviso. Un build de debug hace panic; producción no. Esa diferencia ha causado incidentes reales.

Así que sé explícito. Rust da cuatro familias, y la elección es una decisión de diseño:

| método | ante un desbordamiento |
| --- | --- |
| \`checked_add\` | \`None\` — lo manejas tú |
| \`saturating_add\` | se queda en el máximo |
| \`wrapping_add\` | da la vuelta |
| \`overflowing_add\` | \`(valor, bool)\` |

**Para dinero, siempre \`checked_\`.** Un saldo que se desborda es un error que quien llama tiene que ver, no un valor para saturar o dar la vuelta. \`checked_mul(..)?.checked_add(..)\` se encadena limpio con \`?\` dentro de una función que devuelve \`Option\` o \`Result\`.

\`saturating_\` es correcto para una métrica que no debe dar la vuelta; \`wrapping_\` para un hash o un número de secuencia donde dar la vuelta es el comportamiento buscado. Ninguno de los dos se acerca a un saldo.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué un saldo monetario nunca debe guardarse en un `f64`?",
      options: [
        "El punto flotante binario no puede representar la mayoría de las fracciones decimales con exactitud, así que la aritmética acumula un error que el ledger no puede reconciliar",
        "`f64` es más lento que `i64` en hardware moderno",
        "`f64` tiene un rango menor que `i64`",
      ],
      answer: 0,
      explain:
        "`f64` en realidad tiene un rango mucho mayor. El rango nunca fue el problema — la exactitud sí, y `0.1 + 0.2 != 0.3` es la prueba de una línea.",
    },
    {
      kind: "fill",
      prompt: "Multiplica de modo que un desbordamiento se vuelva un valor que quien llama tiene que manejar.",
      file: "main.rs",
      before: "xlm.",
      after: "(STROOPS_PER_XLM)?.checked_add(fraction)",
      choices: ["checked_mul", "saturating_mul", "wrapping_mul"],
      answer: 0,
      explain:
        "`saturating_mul` se quedaría en silencio en `i64::MAX` — inventando un saldo que nadie tiene. Para dinero, el desbordamiento tiene que llegar a quien llama.",
    },
    {
      kind: "quiz",
      question:
        "Un servicio calcula saldos con un `+` a secas y funciona bien en staging, y luego produce un saldo negativo en producción. ¿Qué pasó?",
      options: [
        "Las verificaciones de desbordamiento están activas en debug y se compilan fuera en release — la misma expresión hizo panic en staging y dio la vuelta en producción",
        "La base de datos devolvió un valor corrupto",
        "Los builds de release usan un ancho de entero distinto",
      ],
      answer: 0,
      explain:
        "Por eso `overflow-checks = true` en el perfil de release es una configuración defendible para código financiero, y por eso `checked_` en la aritmética misma es mejor todavía.",
    },
    {
      kind: "editor",
      intro: `### Dinero en enteros

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

La última línea es la razón por la que importan las seis primeras.`,
    },
  ],
};
