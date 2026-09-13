import type { LessonStep } from "@/content/steps";

// ES · Ownership, Moves & Drops.
//
// Overlay for ../../steps/rust-ownership-deep.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustOwnershipDeepStepsEs: Record<string, LessonStep[]> = {
  "rust-ownership-deep-1": [
    {
      kind: "theory",
      body: `Todo valor en Rust tiene exactamente un dueño, y su tipo decide dónde viven realmente sus bytes.

Un \`i32\` ocupa 4 bytes y vive entero en el stack frame de la función que lo sostiene. Un \`String\` es distinto: el *handle* vive en la stack y siempre mide lo mismo, mientras que los caracteres viven en la heap.

Ese handle son tres palabras — un puntero, una longitud y una capacidad:

\`\`\`rust
let name = String::from("stellar");
// stack:  [ ptr | len: 7 | cap: 7 ]   = 24 bytes en un target de 64 bits
// heap:   s t e l l a r               = 7 bytes
\`\`\``,
    },
    {
      kind: "theory",
      body: `Esta separación es la razón entera de que exista ownership.

Copiar los 4 bytes de un \`i32\` es gratis, así que Rust simplemente los copia. Copiar un \`String\` significaría duplicar la asignación en la heap (caro, y en silencio) o tener dos handles apuntando a la misma asignación (que la libera dos veces).

Rust rechaza ambas cosas. En su lugar transfiere el handle — y esa transferencia es lo que significa "move". Nada en la heap se toca.

\`std::mem::size_of::<T>()\` informa el tamaño en la **stack** de un tipo, y nunca el payload en la heap que hay detrás. Vale la pena internalizar esa distinción ahora: es la que la gente falla en las entrevistas.`,
    },
    {
      kind: "quiz",
      question:
        "`size_of::<String>()` devuelve 24 en un target de 64 bits, tanto si la string tiene 3 caracteres como si tiene 3 millones. ¿Por qué?",
      options: [
        "Mide el handle en la stack — puntero, longitud y capacidad — y no el buffer en la heap al que apunta",
        "Rust limita todo String a 24 bytes y manda el resto a una tabla lateral",
        "24 es el tamaño de la primera línea de caché que entrega el asignador",
      ],
      answer: 0,
      explain:
        "`size_of` es una constante de tiempo de compilación, así que solo puede describir lo que el compilador sabe: el layout fijo en la stack. La longitud en la heap es un valor de runtime — eso es `.len()`.",
    },
    {
      kind: "fill",
      prompt:
        "Informa cuántos bytes ocupan los datos de la string en la heap — no el handle.",
      file: "main.rs",
      before: 'let name = String::from("stellar");\nprintln!("heap bytes: {}", name.',
      after: ");",
      choices: ["len()", "capacity()", "size_of()"],
      answer: 0,
      explain:
        "`len()` son los bytes realmente en uso. `capacity()` son los bytes reservados, que pueden ser más después de un crecimiento — una distinción real, solo que no la que se pide aquí.",
    },
    {
      kind: "quiz",
      question:
        "Una función recibe `data: Vec<u8>` por valor y se llama en un bucle caliente. ¿Qué se copia en cada llamada?",
      options: [
        "24 bytes — el handle del vector. El buffer en la heap no se toca, se reapunta",
        "El buffer entero, y por eso pasar por valor en un bucle es caro",
        "Nada — Rust pasa todo argumento por referencia por debajo",
      ],
      answer: 0,
      explain:
        "Mover es barato: es un memcpy del handle. El costo que la gente teme de `por valor` es el *drop* al final de la función llamada, no la transferencia.",
    },
    {
      kind: "editor",
      intro: `### Mide la separación

Imprime el tamaño en la stack de un \`i32\`, el tamaño en la stack de un \`String\` y los bytes en la heap de una string concreta.

Salida esperada:

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

Usa \`std::mem::size_of\` para los dos primeros y \`.len()\` para el tercero.`,
    },
  ],

  "rust-ownership-deep-2": [
    {
      kind: "theory",
      body: `La asignación hace una de dos cosas, y el tipo decide cuál.

Si el tipo implementa \`Copy\`, los bits se duplican y ambos bindings siguen usables. Si no, el ownership **se mueve** y el binding de origen está muerto — usarlo después es un error de compilación, no una sorpresa en runtime.

\`\`\`rust
let x = 10;
let y = x;
println!("{x}");        // ok — i32 es Copy

let s1 = String::from("hi");
let s2 = s1;
println!("{s1}");       // error: borrow of moved value: \`s1\`
\`\`\``,
    },
    {
      kind: "theory",
      body: `La regla de qué tipos son \`Copy\` no es arbitraria: **un tipo solo puede ser \`Copy\` si cada uno de sus campos lo es, y no debe implementar \`Drop\`.**

Eso excluye exactamente los tipos donde duplicar los bits estaría mal. \`String\`, \`Vec<T>\` y \`Box<T>\` son dueños de una asignación en la heap y todos implementan \`Drop\` — dos copias significarían dos frees.

\`Clone\` es el opt-in explícito para lo mismo: \`s1.clone()\` hace la copia profunda que \`=\` se negó a hacer en silencio. La verbosidad es el punto. Una asignación de memoria debería ser visible en el código.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué un tipo que implementa `Drop` nunca puede implementar también `Copy`?",
      options: [
        "Copiar los bits produciría dos dueños del mismo recurso, y `drop` correría dos veces sobre él",
        "`Drop` y `Copy` definen ambos un método llamado `clone`, así que chocan",
        "Sí puede — la biblioteca estándar simplemente elige no hacerlo para `String`",
      ],
      answer: 0,
      explain:
        "Esto es una regla dura del compilador, no una convención. `Copy` significa 'duplicar los bits es un duplicado completo'; `Drop` significa 'estos bits son dueños de algo que debe liberarse una sola vez'. Las dos afirmaciones se contradicen.",
    },
    {
      kind: "fill",
      prompt:
        "Mantén `s1` usable después de producir una segunda string independiente.",
      file: "main.rs",
      before: 'let s1 = String::from("ledger");\nlet s2 = s1.',
      after: ';\nprintln!("{s1} {s2}");',
      choices: ["clone()", "as_str()", "to_owned().as_str()"],
      answer: 0,
      explain:
        "`clone()` asigna un segundo buffer, así que cada handle es dueño de sus propios datos. `as_str()` haría un borrow en su lugar — Rust válido también, pero no te da un segundo `String`.",
    },
    {
      kind: "quiz",
      question:
        "`let t = (1i32, String::from(\"a\")); let u = t;` — ¿cuál es el estado de `t` después?",
      options: [
        "Movida por completo. Una tupla solo es `Copy` si cada elemento lo es, y `String` no lo es",
        "Parcialmente movida: `t.0` sigue siendo legible porque `i32` es `Copy`",
        "Intacta — las tuplas siempre se copian elemento por elemento",
      ],
      answer: 0,
      explain:
        "Asignar la tupla entera mueve la tupla entera. Los moves parciales campo a campo existen, pero solo cuando nombras el campo — que es la próxima lección.",
    },
    {
      kind: "editor",
      intro: `### Move, copy, clone

Muestra los tres comportamientos en un solo programa:

1. Liga \`10\` a \`a\`, luego \`a\` a \`b\`, e imprime ambos — esto es una copia.
2. Construye un \`String\` con \`ledger\`, hazle \`clone()\` e imprime ambos.
3. Mueve el clon a un tercer binding e imprímelo.

Salida esperada:

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\``,
    },
  ],

  "rust-ownership-deep-3": [
    {
      kind: "theory",
      body: `El ownership se rastrea **por campo**, no solo por valor.

Mover un campo fuera de una struct deja la struct parcialmente movida: el campo que sacaste está muerto, todos los demás siguen legibles.

\`\`\`rust
struct Account { id: String, balance: i64 }

let acct = Account { id: String::from("GA7Q"), balance: 250 };
let id = acct.id;              // mueve solo este campo
println!("{}", acct.balance);  // ok
println!("{}", acct.id);       // error: value moved
println!("{:?}", acct);        // error: \`acct\` ya no está entera
\`\`\``,
    },
    {
      kind: "theory",
      body: `Dos límites que vale la pena conocer antes de apoyarte en esto.

**Un valor parcialmente movido no puede usarse como un todo.** Puedes leer los campos que quedan, pero no puedes pasar \`acct\` a una función, retornarla ni moverla otra vez.

**Un tipo que implementa \`Drop\` no puede moverse parcialmente en absoluto.** Su \`drop\` va a correr contra el valor entero, así que el compilador no puede permitir un hueco. Si necesitas un campo de un tipo así, o le haces \`clone()\` o usas \`std::mem::take\`, que mete el valor por defecto y te entrega el original.`,
    },
    {
      kind: "quiz",
      question:
        "`let id = acct.id;` compila, pero agregar `#[derive(Debug)]` y luego `println!(\"{acct:?}\")` después no compila. ¿Por qué?",
      options: [
        "El formateo `Debug` lee la struct entera, y un campo ya no contiene un valor válido",
        "`derive(Debug)` toma ownership de la struct a la que se aplica",
        "Los moves parciales solo se permiten en structs que no derivan nada",
      ],
      answer: 0,
      explain:
        "La struct no desapareció — tiene un hueco. Todo lo que la necesita entera (Debug, pasarla, retornarla) se rechaza; leer un campo intacto no.",
    },
    {
      kind: "fill",
      prompt:
        "`Session` implementa `Drop`, así que no se puede mover un campo fuera de ella. Toma el token y deja una `String` vacía en su lugar.",
      file: "main.rs",
      before: "let token = std::mem::",
      after: "(&mut session.token);",
      choices: ["take", "drop", "swap"],
      answer: 0,
      explain:
        "`take` reemplaza el campo con `Default::default()` y devuelve el original — el valor sigue entero, así que `Drop` todavía tiene algo válido contra lo que correr. `swap` también funciona, pero tienes que aportar el reemplazo tú.",
    },
    {
      kind: "quiz",
      question:
        "Necesitas un campo `String` de una struct que además tienes que pasar a otra función después. ¿Qué es correcto?",
      options: [
        "Hacer `clone()` del campo, o `mem::take` si dejar un valor vacío atrás es aceptable",
        "Mover el campo fuera y pasar la struct — el compilador tapa el hueco",
        "Envolver la struct en un `Box` primero; el boxing vuelve enteros los moves parciales",
      ],
      answer: 0,
      explain:
        "La elección es un trade real: `clone` cuesta una asignación y conserva el original intacto, `mem::take` es gratis pero muta el origen. Ninguno es siempre el correcto.",
    },
    {
      kind: "editor",
      intro: `### Saca un campo, conserva el resto

Define \`struct Account { id: String, balance: i64 }\` y construye una con id \`GA7Q\` y balance \`250\`.

Mueve **solo** el campo \`id\` a su propio binding, luego imprime el id y el balance que sigue en la struct.

Salida esperada:

\`\`\`text
id: GA7Q
balance: 250
\`\`\``,
    },
  ],

  "rust-ownership-deep-4": [
    {
      kind: "theory",
      body: `El borrow checker impone una regla: en cualquier punto, un valor tiene **o** cualquier cantidad de referencias compartidas \`&T\`, **o** exactamente una referencia exclusiva \`&mut T\`. Nunca ambas.

La parte que hace tropezar a la gente es la frase *en cualquier punto*. Un borrow dura hasta su **último uso**, no hasta el final del bloque. Esto se llama NLL — non-lexical lifetimes — y significa que la mayoría de los errores de aliasing se arreglan moviendo una línea, no clonando.

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = &v[0];      // empieza el borrow compartido
println!("{first}");    // ...y termina aquí, en su último uso
v.push(4);              // ok — ya nada está tomando prestado v
\`\`\``,
    },
    {
      kind: "theory",
      body: `Reordenar solo funciona cuando el *resultado* del borrow no necesita sobrevivir a la mutación. Cuando sí lo necesita, extrae el valor fuera del borrow primero:

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = v[0];       // i32 es Copy — esto lee y termina el borrow
v.push(4);
println!("{first}");    // ok: \`first\` es dueño de sus 4 bytes
\`\`\`

Para un elemento que no es \`Copy\` existe el mismo movimiento — \`.clone()\`, o calcular un resumen como \`.len()\` o \`.iter().sum()\` — y debería ser una decisión deliberada, no un reflejo. Recurrir a \`clone()\` en cuanto el compilador se queja es como un camino caliente adquiere en silencio una asignación por iteración.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `let n = &v[0]; v.push(4); println!(\"{n}\");` falla, si mover el `println!` encima del `push` compila?",
      options: [
        "`push` puede reasignar el buffer, así que la referencia podría quedar colgante — y el borrow sigue vivo porque se usa después",
        "`push` exige que el vector no tenga referencias en ningún punto del cuerpo entero de la función",
        "La macro `println!` captura sus argumentos por valor, lo que mueve fuera de un borrow",
      ],
      answer: 0,
      explain:
        "Las dos mitades importan: `push` necesita `&mut`, y el borrow compartido sigue vivo porque una línea posterior lo usa. Sube esa línea y el borrow termina antes del `push` — que es exactamente lo que NLL te compra.",
    },
    {
      kind: "fill",
      prompt:
        "Calcula un total sobre el vector sin retener un borrow más allá de la línea.",
      file: "main.rs",
      before: "let total: i32 = ledger.iter().",
      after: ";\nledger.push(total);",
      choices: ["sum()", "collect()", "count()"],
      answer: 0,
      explain:
        "`sum()` consume el iterador y devuelve un `i32` propio, así que el borrow de `ledger` se acabó al final de la sentencia — `push` queda libre para tomar `&mut`.",
    },
    {
      kind: "quiz",
      question:
        "¿Cuál de estos es el *peor* arreglo habitual para un error del borrow checker en un bucle caliente?",
      options: [
        "Clonar el valor prestado, porque convierte en silencio un error de compilación en una asignación por iteración",
        "Estrechar el alcance del borrow para que termine antes de la mutación",
        "Extraer un resumen `Copy` de los datos antes de mutar",
      ],
      answer: 0,
      explain:
        "`clone()` no está prohibido — a veces es genuinamente la decisión correcta. El modo de fallo es usarlo *por reflejo*, lo que hace que el compilador deje de quejarse sin volver el código correcto ni rápido.",
    },
    {
      kind: "editor",
      intro: `### Termina el borrow antes de mutar

Dado \`let mut ledger = vec![10, 20, 30];\`:

1. Suma las entradas en \`total\` usando un iterador.
2. Haz \`push\` de \`total\` en \`ledger\`.
3. Imprime el vector, luego el total.

Salida esperada:

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\``,
    },
  ],

  "rust-ownership-deep-5": [
    {
      kind: "theory",
      body: `Dos coerciones ocurren tan seguido que se vuelven invisibles — y luego confunden la primera vez que no se disparan.

**Deref coercion.** \`&String\` se convierte en \`&str\`, \`&Vec<T>\` en \`&[T]\`, \`&Box<T>\` en \`&T\`. El compilador inserta la conversión en un call site siempre que el tipo destino no coincide pero un impl de \`Deref\` los conecta.

\`\`\`rust
fn describe(s: &str) -> usize { s.len() }

let owned = String::from("soroban");
describe(&owned);   // &String coercionado a &str — sin asignación, sin copia
\`\`\`

Por eso recibes \`&str\` en un parámetro y guardas \`String\` en un campo de struct: el parámetro acepta ambos, el campo es dueño de sus datos.`,
    },
    {
      kind: "theory",
      body: `**Reborrowing.** \`&mut T\` no es \`Copy\` — solo puede existir uno. Así que pasar uno a una función debería moverlo y dejar tu binding muerto. No lo hace:

\`\`\`rust
let mut seq = 41;
let handle = &mut seq;
bump(handle);           // reborrow implícito: &mut *handle
bump(&mut *handle);     // lo mismo, escrito completo
\`\`\`

El compilador pasa en silencio \`&mut *handle\` — un borrow *nuevo* y más corto, derivado del tuyo. Expira cuando la función llamada retorna y tu handle vuelve a estar vivo. Sin esto, todo \`&mut\` sería de un solo uso y el lenguaje sería insoportable.

Tienes que escribir el reborrow tú mismo en un caso común: guardar un \`&mut\` en una struct, o retornarlo, donde el compilador no puede inferir el lifetime más corto que querías decir.`,
    },
    {
      kind: "quiz",
      question:
        "`fn bump(n: &mut i64)` se llama dos veces seguidas con el mismo binding `&mut`, y compila. ¿Por qué la primera llamada no es un move?",
      options: [
        "El compilador inserta un reborrow implícito, `&mut *handle`, que expira cuando la llamada retorna",
        "`&mut i64` es `Copy` porque `i64` es `Copy`",
        "Los argumentos de función siempre se pasan por referencia, así que nada se mueve",
      ],
      answer: 0,
      explain:
        "El reborrowing es el mecanismo que hace que las referencias exclusivas sean usables más de una vez. `&mut T` nunca es `Copy`, sin importar `T`.",
    },
    {
      kind: "fill",
      prompt:
        "Escribe el reborrow explícitamente, para que la segunda llamada reciba su propio borrow exclusivo de vida corta.",
      file: "main.rs",
      before: "bump(",
      after: "handle);",
      choices: ["&mut *", "&", "*"],
      answer: 0,
      explain:
        "`&mut *handle` desreferencia para llegar al valor y luego toma un borrow exclusivo nuevo de él. `&handle` sería un borrow compartido *de la referencia misma* — otro tipo.",
    },
    {
      kind: "quiz",
      question:
        "Una función pública recibe `name: String` y solo llama a `.len()` sobre él. ¿Cuál debería ser la firma?",
      options: [
        "`&str` — acepta `&String` por deref coercion y `&'static str` directamente, y no fuerza ninguna asignación a quien llama",
        "`String`, para que la función sea dueña de sus datos y quien llama no pueda afectarla",
        "`&String`, que es el tipo más preciso y por lo tanto el más rápido",
      ],
      answer: 0,
      explain:
        "`&String` es estrictamente peor que `&str`: acepta menos (un literal no se coerciona *hacia arriba*) y no compra nada. Recibe `String` solo cuando de verdad necesitas guardarlo o consumirlo.",
    },
    {
      kind: "editor",
      intro: `### Las dos coerciones en un programa

1. Escribe \`fn describe(s: &str) -> usize\` que devuelva la longitud de la string, y llámala con un \`&String\` que contenga \`soroban\`.
2. Escribe \`fn bump(n: &mut i64)\` que sume 1.
3. Liga \`let mut seq = 41;\`, toma \`let handle = &mut seq;\`, luego llama a \`bump\` dos veces — una pasando \`handle\`, otra pasando un \`&mut *handle\` explícito.
4. Imprime el valor final de \`seq\`.

Salida esperada:

\`\`\`text
len: 7
seq: 43
\`\`\``,
    },
  ],

  "rust-ownership-deep-6": [
    {
      kind: "theory",
      body: `Cuando un valor sale de alcance, Rust corre su impl de \`Drop\` — sin \`finally\`, sin \`defer\`, sin \`close()\` que puedas olvidar. Eso es RAII: **adquirir el recurso es construir el valor, y liberarlo es que el valor termine.**

\`\`\`rust
struct Guard(&'static str);

impl Drop for Guard {
    fn drop(&mut self) {
        println!("release {}", self.0);
    }
}
\`\`\`

Nunca llamas a \`drop\` tú mismo. \`std::mem::drop(value)\` existe, pero todo lo que hace es tomar ownership y dejar que el valor salga de alcance antes.`,
    },
    {
      kind: "theory",
      body: `El orden es exacto y vale la pena memorizarlo, porque es lo que hace seguros a los lock guards y a los connection pools:

**Las variables de un alcance se dropean en orden inverso de declaración.** Última declarada, primera liberada — la stack se desarma como se armó. Los *campos* de una struct, en cambio, se dropean en orden de declaración.

\`\`\`rust
let _outer = Guard("outer");
{
    let _inner = Guard("inner");
}   // "release inner" aquí
    // "release outer" al final de main
\`\`\`

Por eso \`MutexGuard\` no necesita una llamada de unlock, y por eso meter un bloque \`{ }\` alrededor de una sección crítica es una técnica real y no una elección de estilo: la llave que cierra *es* el unlock.`,
    },
    {
      kind: "quiz",
      question:
        "Tres guards `a`, `b`, `c` se declaran en ese orden en un mismo alcance. ¿Qué se imprime?",
      options: [
        "c, luego b, luego a — orden inverso de declaración",
        "a, luego b, luego c — orden de declaración, como los campos de una struct",
        "El orden no está especificado y puede variar entre versiones del compilador",
      ],
      answer: 0,
      explain:
        "Orden inverso para las locales, orden directo para los campos de struct. La asimetría es deliberada: una local declarada después puede tomar prestado de una anterior, así que tiene que morir primero.",
    },
    {
      kind: "fill",
      prompt:
        "Libera un lock guard antes de tiempo, sin esperar al final de la función.",
      file: "main.rs",
      before: "let guard = lock.acquire();\n",
      after: "(guard);\nlong_running_work();",
      choices: ["drop", "guard.close", "std::mem::forget"],
      answer: 0,
      explain:
        "`drop` toma el valor por ownership y lo termina ahí. `mem::forget` hace lo contrario — fuga el valor a propósito y el lock nunca se libera.",
    },
    {
      kind: "quiz",
      question:
        "¿Por qué retener un `MutexGuard` durante una llamada lenta es un problema, incluso en tests de un solo thread?",
      options: [
        "El guard vive hasta el final de su alcance, así que el lock se retiene durante toda la llamada — todo otro thread se bloquea detrás",
        "`Drop` no puede correr mientras hay una llamada a función en la stack, así que el guard se fuga",
        "No es un problema; el compilador libera el lock en el último uso del guard",
      ],
      answer: 0,
      explain:
        "Esta es exactamente la trampa: NLL termina los *borrows* en el último uso, pero `Drop` corre al final del *alcance*. Un guard que dejaste de leer sigue reteniendo el lock. Delimítalo a propósito con un bloque.",
    },
    {
      kind: "editor",
      intro: `### Demuestra el orden

Define \`struct Guard(&'static str)\` con un impl de \`Drop\` que imprima \`release <nombre>\`.

En \`main\`, crea un guard llamado \`outer\`, luego abre un bloque interno que contenga un guard llamado \`inner\` y un \`println!("inside")\`. Después del bloque, imprime \`outside\`.

Salida esperada:

\`\`\`text
inside
release inner
outside
release outer
\`\`\``,
    },
  ],
};
