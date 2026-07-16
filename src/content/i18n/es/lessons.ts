import "server-only";

// Localized lesson `instructions` markdown (server-only, like the source).
// ONLY instructions are localized — starter code, expected output and the
// hidden grading checks stay locale-neutral in content/lessons.ts.
export const lessonText: Record<string, { instructions: string }> = {
  "rust-fundamentals-1": {
    instructions: `## Hello, World!

Todo programa en Rust comienza en la función \`main\`. Es el punto de entrada: cuando tu programa se ejecuta, \`main\` es lo que se invoca.

Para imprimir texto en la consola, Rust te da la **macro** \`println!\` (el \`!\` significa que es una macro, no una función — más adelante aprenderás por qué eso importa).

\`\`\`rust
println!("your text here");
\`\`\`

### Tu misión

Haz que el programa imprima exactamente:

\`\`\`text
Hello, World!
\`\`\`

### Pistas

- El texto va entre comillas dobles, dentro de los paréntesis.
- Las sentencias en Rust terminan con punto y coma \`;\`.
- Las mayúsculas importan: \`Hello, World!\` — H mayúscula, W mayúscula.
`,
  },

  "rust-fundamentals-2": {
    instructions: `## Variables y mutabilidad

En Rust, las variables se declaran con \`let\` — y son **inmutables por defecto**. Una vez ligado, el valor no puede cambiar:

\`\`\`rust
let x = 5;
x = 10; // ❌ error de compilación: no se puede asignar dos veces a una variable inmutable
\`\`\`

Para permitir la reasignación, marca la variable como mutable con \`mut\`:

\`\`\`rust
let mut x = 5;
x = 10; // ✅ todo bien
\`\`\`

### Tu misión

El código inicial declara \`score\` como inmutable y luego intenta cambiarlo — no compilará. Arréglalo:

1. Haz que \`score\` sea **mutable**.
2. Conserva la reasignación a \`100\`.
3. Imprime la puntuación final con \`println!("score: {}", score);\`

Salida esperada:

\`\`\`text
score: 100
\`\`\`
`,
  },

  "rust-fundamentals-3": {
    instructions: `## Tipos de datos

Todo valor en Rust tiene un **tipo** — su forma. Rust normalmente puede adivinarlo, pero tú puedes (y a menudo deberías) etiquetarlo:

\`\`\`rust
let torches: i32 = 3;      // número entero
let weight: f64 = 2.5;     // número decimal
let is_lit: bool = true;   // valor sí/no
\`\`\`

### Tu misión

Etiqueta los tres frascos del código inicial con sus tipos:

1. \`age\` es un número entero → \`i32\`
2. \`price\` es un número decimal → \`f64\`
3. \`is_open\` es un valor sí/no → \`bool\`

Salida esperada:

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\`

### Pistas

- El tipo va después del nombre, separado por dos puntos: \`let name: type = value;\`
`,
  },

  "rust-fundamentals-4": {
    instructions: `## Funciones

Una **función** es una receta: toma ingredientes (parámetros), hace el trabajo y entrega un resultado.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\`

- Los parámetros declaran sus tipos: \`x: i32\`.
- \`-> i32\` indica qué tipo devuelve.
- La última línea **sin punto y coma** es el valor devuelto.

### Tu misión

\`main\` ya llama a \`add(2, 3)\` — pero la receta todavía no existe. Escríbela debajo de \`main\`:

1. Nómbrala \`add\`, con dos parámetros \`a: i32\` y \`b: i32\`.
2. Devuelve un \`i32\`.
3. Devuelve \`a + b\` (¡sin punto y coma en esa línea!).

Salida esperada:

\`\`\`text
2 + 3 = 5
\`\`\`
`,
  },

  "rust-fundamentals-5": {
    instructions: `## Fundamentos de ownership

La ley más antigua de Rust: **todo valor tiene exactamente un dueño.** Cuando asignas un \`String\` a otra variable, el ownership *se mueve* — el nombre anterior ya no se puede usar:

\`\`\`rust
let a = String::from("gem");
let b = a;            // el ownership se mueve a b
println!("{}", a);    // ❌ error: a ya no posee nada
\`\`\`

Si de verdad necesitas dos, forja una copia real con \`.clone()\`:

\`\`\`rust
let b = a.clone();    // ✅ dos Strings independientes
\`\`\`

### Tu misión

El código inicial mueve \`sword\` hacia \`copy\` y luego intenta usar \`sword\` de nuevo — no compilará. Arréglalo **clonando** en lugar de mover.

Salida esperada:

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\`
`,
  },

  "rust-fundamentals-6": {
    instructions: `## Borrowing y referencias

No tienes que *regalar* un valor para que alguien lo lea — puedes **prestarlo**. Una referencia (\`&\`) permite que una función tome prestado un valor y lo devuelva automáticamente:

\`\`\`rust
fn inspect(item: &String) {   // toma prestado, no se apropia
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);                // préstalo con &
println!("{}", gem);          // ✅ sigue siendo tuyo
\`\`\`

### Tu misión

\`greet\` actualmente **toma posesión** del nombre, así que \`main\` no puede usarlo después. Arréglalo:

1. Cambia \`greet\` para que tome prestado: el parámetro pasa a ser \`who: &String\`.
2. Llámala con una referencia: \`greet(&name);\`

Salida esperada:

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\`
`,
  },

  "control-flow-1": {
    instructions: `## if / else

Los programas deciden con \`if\`. La condición debe ser un \`bool\` — no hacen falta paréntesis:

\`\`\`rust
if torches > 0 {
    // se ejecuta cuando la condición es true
} else {
    // se ejecuta en caso contrario
}
\`\`\`

### Tu misión

La cámara tiene \`torches = 3\`. Escribe la decisión:

1. **Si** \`torches\` es mayor que \`0\`, imprime \`The hall is lit\`.
2. **Si no**, imprime \`Darkness...\`.

Salida esperada:

\`\`\`text
The hall is lit
\`\`\`
`,
  },

  "control-flow-2": {
    instructions: `## Expresiones match

\`match\` compara un valor contra patrones — y Rust **te obliga a cubrir todos los casos**. El patrón \`_\` significa "cualquier otra cosa":

\`\`\`rust
let word = match number {
    1 => "one",
    2 => "two",
    _ => "many",
};
\`\`\`

Un \`match\` es una *expresión*: produce un valor que puedes guardar.

### Tu misión

La cámara tiene tres puertas y \`door = 2\`. Construye un \`match\`:

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. cualquier otra cosa (\`_\`) → \`"no door"\`
4. Guarda el resultado en \`path\` e imprímelo.

Salida esperada:

\`\`\`text
center
\`\`\`
`,
  },

  "control-flow-3": {
    instructions: `## loop

\`loop\` se repite **para siempre** — hasta que sales con \`break\`:

\`\`\`rust
loop {
    // se ejecuta una y otra vez...
    if enough {
        break; // ...hasta esto
    }
}
\`\`\`

### Tu misión

Escapa del corredor infinito:

1. Dentro de un \`loop\`, suma \`1\` a \`echoes\` en cada vuelta.
2. Cuando \`echoes\` llegue a \`3\` (\`echoes == 3\`), haz \`break\`.
3. La impresión final ya está escrita para ti.

Salida esperada:

\`\`\`text
escaped after 3 echoes
\`\`\`
`,
  },

  "control-flow-4": {
    instructions: `## Bucles while

\`while\` se repite **mientras se cumpla una condición** — la comprueba antes de cada vuelta:

\`\`\`rust
while supplies > 0 {
    // un día más...
}
\`\`\`

### Tu misión

Desciende por la galería que se hunde:

1. **Mientras** \`floors\` sea mayor que \`0\`: imprime \`floor {}\` (el piso actual) y luego resta \`1\` a \`floors\`.
2. Después del bucle, imprime \`Ground level!\`.

Salida esperada:

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\`
`,
  },

  "control-flow-5": {
    instructions: `## Bucles for

\`for\` recorre una secuencia — sin contador que gestionar, sin forma de pasarse:

\`\`\`rust
for n in 1..=5 {
    // n vale 1, 2, 3, 4, 5
}
\`\`\`

\`1..=5\` es un **rango**: de 1 **hasta 5 inclusive**. (Sin el \`=\`, \`1..5\` se detiene en 4.)

### Tu misión

Cruza las cinco piedras del vado:

1. Usa \`for\` con el rango \`1..=5\`.
2. Imprime \`step {}\` para cada número.

Salida esperada:

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
    instructions: `## Control de flujo anidado

La verdadera jugada maestra: una decisión **dentro** de un bucle. El operador \`%\` da el resto de la división — \`n % 3 == 0\` significa "n es divisible por 3":

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\`

### Tu misión

Recorre los diez espejos del Overlord:

1. \`for n in 1..=10\`
2. **Si** \`n\` es divisible por 3 (\`n % 3 == 0\`), imprime \`mirror\`.
3. **Si no**, imprime el número \`n\`.

Salida esperada:

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

  "rust-standard-library-1": {
    instructions: `## Fundamentos de Vec

Un \`Vec\` es una lista que crece — el zurrón del reino:

\`\`\`rust
let mut items = vec!["torch", "rope"];  // crear con contenido
items.push("map");                       // hacerla crecer
items.len()                              // ¿cuántos hay? → 3
\`\`\`

### Tu misión

1. Crea un \`satchel\` **mutable** con \`vec!["torch", "rope"]\`.
2. Haz \`push\` de \`"map"\` dentro.
3. Imprime \`items: {}\` con \`satchel.len()\`.

Salida esperada:

\`\`\`text
items: 3
\`\`\`
`,
  },

  "rust-standard-library-2": {
    instructions: `## Iteradores

Un **iterador** recorre una colección de forma perezosa — no hace ningún trabajo hasta que le pides un resultado:

\`\`\`rust
let total: i32 = coins.iter().sum();
\`\`\`

\`.iter()\` inicia la cadena; \`.sum()\` la recoge en un solo valor. (La etiqueta de tipo en \`total\` le dice a \`sum\` qué producir.)

### Tu misión

El zurrón contiene \`coins = vec![5, 10, 25]\`.

1. Súmalas con \`.iter().sum()\` en \`total: i32\`.
2. Imprime \`total: {}\`.

Salida esperada:

\`\`\`text
total: 40
\`\`\`
`,
  },

  "rust-standard-library-3": {
    instructions: `## Indexación segura con .get

\`vault[5]\` sobre un Vec de 2 elementos **hace colapsar** el programa. La pregunta cortés es \`.get(5)\` — devuelve un \`Option\`: \`Some(&item)\` si la casilla existe, \`None\` si no.

\`\`\`rust
let tool = vault.get(5).unwrap_or(&"nothing");
\`\`\`

\`unwrap_or\` proporciona un valor de respaldo cuando la respuesta es \`None\`. (Fíjate en el \`&\` — \`get\` entrega referencias.)

### Tu misión

La bóveda tiene 2 herramientas; pregunta por la casilla \`5\` de todos modos:

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. Imprime \`found: {}\`.

Salida esperada:

\`\`\`text
found: nothing
\`\`\`
`,
  },

  "rust-standard-library-4": {
    instructions: `## HashMap

Un \`HashMap\` vincula **claves con valores** — pregunta por la clave y obtén el valor al instante:

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
ledger.insert("gold", 100);
println!("{}", ledger["gold"]);  // → 100
\`\`\`

Vive en \`std::collections\`, así que necesita la línea \`use\` al principio.

### Tu misión

1. Inserta \`("gold", 100)\` y \`("silver", 250)\` en el libro de cuentas.
2. Imprime \`gold: {}\` usando \`ledger["gold"]\`.

Salida esperada:

\`\`\`text
gold: 100
\`\`\`
`,
  },

  "rust-standard-library-5": {
    instructions: `## Manejo de String

Un \`String\` es texto que crece. Dos hechizos para hoy:

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");              // añade texto

let banner = format!("The {}", s);   // teje strings en uno nuevo
\`\`\`

\`format!\` funciona exactamente igual que \`println!\` — pero devuelve el String en lugar de imprimirlo.

### Tu misión

1. Añade \`" of the Vaults"\` a \`title\` con \`push_str\`.
2. Construye \`banner\` con \`format!("The {}", title)\`.
3. Imprime el estandarte.

Salida esperada:

\`\`\`text
The Keeper of the Vaults
\`\`\`
`,
  },

  "rust-standard-library-6": {
    instructions: `## Slices

Un **slice** es una ventana hacia un tramo de una colección — sin copias, solo una vista:

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

El rango incluye su inicio y **excluye** su final (\`1..4\` → casillas 1, 2, 3). Imprime un slice con el marcador de depuración \`{:?}\`.

### Tu misión

1. Toma el medio del estante: \`&shelf[1..4]\`.
2. Imprime \`middle: {:?}\`.

Salida esperada:

\`\`\`text
middle: [2, 3, 4]
\`\`\`
`,
  },

  "mastering-option-1": {
    instructions: `## Some o None

\`Option<T>\` es la forma en que Rust dice *"puede haber un valor — o no"*:

\`\`\`rust
enum Option<T> {
    Some(T),   // hay un valor, envuelto dentro
    None,      // no hay nada
}
\`\`\`

Una función que podría no tener respuesta devuelve \`Option\`:

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

### Tu misión

Completa \`find\`: si \`present\` es true devuelve \`Some(7)\`, si no, \`None\`.

Salida esperada:

\`\`\`text
Some(7)
\`\`\`
`,
  },

  "mastering-option-2": {
    instructions: `## Unwrap con seguridad

\`.unwrap()\` arranca el valor de un Option — y entra en **pánico** (colapsa) con \`None\`. El pantano está lleno de quienes hicieron unwrap.

El idioma seguro lleva un valor por defecto:

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

### Tu misión

\`ghost\` es \`None\`. Extrae un valor **con seguridad**:

1. \`let value = ghost.unwrap_or(0);\` — sin ningún \`.unwrap()\`.
2. Imprime \`value: {}\`.

Salida esperada:

\`\`\`text
value: 0
\`\`\`
`,
  },

  "mastering-option-3": {
    instructions: `## if let

Cuando solo te importa el caso \`Some\`, \`if let\` desenvuelve y nombra el valor de un solo trazo:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light es el valor desenvuelto
} else {
    println!("darkness");
}
\`\`\`

### Tu misión

La linterna contiene \`Some(3)\`. Pregúntale como corresponde:

1. \`if let Some(light) = lantern\` → imprime \`light: {}\`.
2. \`else\` → imprime \`darkness\`.

Salida esperada:

\`\`\`text
light: 3
\`\`\`
`,
  },

  "mastering-result-1": {
    instructions: `## Ok o Err

Donde \`Option\` modela la *ausencia*, \`Result\` modela el **fallo con una razón**:

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // funcionó — aquí está el valor
    Err(E),   // falló — aquí está el porqué
}
\`\`\`

### Tu misión

Completa \`divide\`:

1. Si \`b == 0\` → \`Err(String::from("division by zero"))\`
2. Si no → \`Ok(a / b)\`

Salida esperada:

\`\`\`text
Ok(5)
\`\`\`
`,
  },

  "mastering-result-2": {
    instructions: `## Leyendo el veredicto

Un \`Result\` no se adivina — se hace \`match\`, y el compilador se asegura de que **ambos** veredictos se manejen:

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

### Tu misión

La corte te entrega \`Ok(42)\`. Léelo:

1. \`Ok(v)\` → imprime \`granted: {}\`
2. \`Err(e)\` → imprime \`denied: {}\`

Salida esperada:

\`\`\`text
granted: 42
\`\`\`
`,
  },

  "mastering-result-3": {
    instructions: `## El operador ?

Manejar cada \`Result\` donde ocurre entierra la lógica. El signo \`?\` **propaga**: con \`Ok\` desenvuelve y continúa; con \`Err\` devuelve el error a *tu* invocador de inmediato.

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // ¿Err? → se devuelve hacia arriba, aquí mismo
    Ok(n * 2)
}
\`\`\`

\`?\` solo funciona dentro de funciones que a su vez devuelven \`Result\` (u \`Option\`).

### Tu misión

Completa \`double_first\`:

1. \`let n = parse("21")?;\`
2. Devuelve \`Ok(n * 2)\`.

Salida esperada:

\`\`\`text
Ok(42)
\`\`\`
`,
  },

  "stellar-101-1": {
    instructions: `## Cuentas y keypairs

Todo actor en Stellar es una **cuenta**, controlada por un **keypair** (par de claves):

- **Clave pública** — empieza con \`G\`. Tu dirección; compártela libremente.
- **Clave secreta** — empieza con \`S\`. Firma todo; **nunca** la compartas. Si la pierdes, la cuenta se pierde para siempre.

Una cuenta debe mantener un saldo mínimo (**base reserve**) de **1 XLM** para existir en el ledger.

### Tu misión

Completa la carta fundacional del fuerte estelar — rellena los tres valores.

Salida esperada:

\`\`\`text
star-keep chartered ✓
\`\`\`
`,
  },

  "stellar-101-2": {
    instructions: `## Lumens y comisiones

El activo nativo es el **lumen (XLM)**, y su unidad más pequeña es el **stroop**:

- \`1 XLM = 10_000_000 stroops\` (diez millones)
- Cada transacción paga una pequeña comisión — la comisión base es de **100 stroops** (0.00001 XLM)

La comisión no es una ganancia — es un peaje antispam que mantiene la red rápida para todos.

### Tu misión

Rellena los dos números de la placa del peaje.

Salida esperada:

\`\`\`text
toll paid ✓
\`\`\`
`,
  },

  "stellar-101-3": {
    instructions: `## Trustlines y activos

Más allá de XLM, cualquier cuenta puede **emitir activos** (dólares, puntos, boletos…). Un activo se identifica por dos cosas:

- un **código de activo** — p. ej. \`USDC\`
- el **emisor** — la cuenta (una dirección \`G...\`) que lo creó

Pero tu cuenta no guarda nada que no haya consentido: debes abrir una **trustline** hacia un activo antes de poder recibirlo. Sin trustline, no hay saldo.

### Tu misión

Abre el puente de luz: rellena la trustline para **USDC**.

Salida esperada:

\`\`\`text
light-bridge opened ✓
\`\`\`
`,
  },

  "stellar-101-4": {
    instructions: `## Tu primer pago

Una **operación de pago** necesita exactamente tres cosas:

1. **destination** — la cuenta que recibe (\`G...\`)
2. **asset** — lo que envías (\`XLM\` para el lumen nativo)
3. **amount** — cuánto

Fírmala con tu clave secreta, paga el peaje de ~100 stroops y en ~5 segundos es definitiva. Sin bancos, sin días hábiles.

### Tu misión

Traza el primer pago desde el Pánico: **25 XLM**.

Salida esperada:

\`\`\`text
lumens flowing ✓
\`\`\`
`,
  },

  "soroban-smart-contracts-1": {
    instructions: `## Tu primer contrato

Un contrato Soroban es una biblioteca de Rust compilada a WASM y tallada en el ledger. Tres cosas lo convierten en contrato:

- \`#![no_std]\` — sin sistema operativo, sin asignador de heap, sin biblioteca estándar. El ledger es la máquina.
- \`#[contract]\` sobre un unit struct — la identidad del contrato.
- \`#[contractimpl]\` sobre el bloque impl — exporta sus \`pub fn\` como entradas invocables. Cada entrada recibe \`Env\` primero: tu acceso al almacenamiento, los eventos y las llamadas entre contratos.

Los strings son caros on-chain; los identificadores cortos usan \`Symbol\` (≤ 9 caracteres vía \`symbol_short!\`).

### Tu misión

1. Marca el bloque impl con \`#[contractimpl]\`.
2. Haz que \`hello\` devuelva \`symbol_short!("beacon")\`.

Resultado esperado de la invocación:

\`\`\`text
hello() → Symbol(beacon)
\`\`\`
`,
  },

  "soroban-smart-contracts-2": {
    instructions: `## Almacenamiento del contrato

Los contratos no tienen estado entre invocaciones — el estado vive en el **ledger**, detrás de \`env.storage()\`. Para estado a nivel de contrato, usa el almacenamiento **instance**:

\`\`\`rust
let count: u32 = env.storage().instance().get(&KEY).unwrap_or(0);
env.storage().instance().set(&KEY, &count);
\`\`\`

\`get\` devuelve \`Option<T>\` — puede que la clave nunca se haya escrito (o que su renta haya expirado), así que \`unwrap_or(0)\` es el idioma para contadores. Las claves y los valores se pasan por referencia.

### Tu misión

Implementa \`increment\`:

1. Lee el contador actual del almacenamiento instance bajo \`COUNTER\` (por defecto \`0\`).
2. Suma \`1\`.
3. Escríbelo de vuelta con \`set\`.
4. Devuelve el nuevo contador.

Resultado esperado de la invocación:

\`\`\`text
increment() → 1
\`\`\`
`,
  },

  "soroban-smart-contracts-3": {
    instructions: `## Autorización

Cada \`Address\` en Soroban puede demostrar que aprobó una llamada. La comprobación del lado del contrato es una sola línea:

\`\`\`rust
from.require_auth();
\`\`\`

Si la transacción no fue firmada (o preautorizada) por \`from\`, la invocación **se detiene (trap)** — el estado queda intacto. Omitir esta línea en una función que mueve fondos es el clásico bug fatal: cualquiera podría pasar cualquier dirección y vaciarlo todo.

### Tu misión

Protege la bóveda. En \`withdraw\`, exige la autorización de \`from\` **antes** de que ocurra cualquier otra cosa.

Resultado esperado de la invocación:

\`\`\`text
withdraw: authorized ✓
\`\`\`
`,
  },

  "stellar-protocol-27-1": {
    instructions: `## Protocol 27: El Zipper

Stellar no se parchea en silencio — la red se actualiza **por voto**. Los validadores arman una nueva versión del protocolo y, en un ledger programado, la *red entera* gira de una vez. Sin forks, sin rezagados.

El **Protocol 27 — nombre en clave "Zipper"** — es la actualización de 2026. La cronología que ya ocurrió:

- Versión estable de Stellar Core — **5 de junio de 2026**
- SDKs — 5–11 de junio · RPC y Galexie — 10 de junio · Horizon — 12 de junio
- **Testnet actualizada — 18 de junio de 2026**
- **Voto de Mainnet — 8 de julio de 2026**

Sus dos grandes cambios viven en el [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md): **delegación de autenticación** para custom accounts y **signature payloads vinculados a la dirección**. (Protocolos anteriores trajeron los CAP-0055/0060/0064 — el Zipper trata de cómo las cuentas *prueban quiénes son*.)

Lee la [guía oficial de actualización del Protocol 27](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide) y guarda [Software Versions](https://developers.stellar.org/docs/networks/software-versions) en favoritos.

### Tu misión

Enciende el faro de la actualización — registra los hechos en \`lib.rs\`:

1. \`PROTOCOL_VERSION\` — la versión que votó la red.
2. \`CODENAME\` — el nombre en clave, en minúsculas.
3. \`MAINNET_VOTE\` — la fecha del voto de Mainnet, \`YYYY-MM-DD\`.

Resultado esperado:

\`\`\`text
beacon lit: protocol 27 (zipper) ✓
\`\`\`
`,
  },

  "stellar-protocol-27-2": {
    instructions: `## Smart accounts y \`__check_auth\`

En la Guarida aprendiste \`require_auth()\` — el sello. Pero ¿*quién* verifica el sello? Para una cuenta normal, el protocolo comprueba una firma ed25519. Cuando el \`Address\` pertenece a un **contrato**, el host invoca el punto de entrada del propio contrato:

\`\`\`rust
fn __check_auth(env: Env, payload: Hash<32>, signatures: ..., contexts: Vec<Context>)
\`\`\`

La cuenta *es* un contrato, y \`__check_auth\` es su ley de firmas. Así existen las **custom accounts**: carteras multisig, social recovery, inicio de sesión con passkeys, account abstraction — cada una es solo un \`__check_auth\` distinto. (OpenZeppelin ya las construía; el Protocol 27 hace nativas las partes difíciles.)

Contexto: [discusión del Protocol 27 — custom accounts modulares y seguridad de firmas](https://developers.stellar.org/meetings/2026/04/30#protocol-discussion-modular-custom-accounts-and-signature-security-in-protocol-27).

### Tu misión

1. Exporta el bloque impl con \`#[contractimpl]\`.
2. Renombra el punto de entrada al nombre que el host llama de verdad: \`__check_auth\`.

Resultado esperado:

\`\`\`text
__check_auth: the account writes its own law ✓
\`\`\`
`,
  },

  "stellar-protocol-27-3": {
    instructions: `## Delegación de autenticación (CAP-0071-01)

Antes del Zipper, una custom account que quisiera que *otro* contrato respondiera por ella no tenía soporte del protocolo — los constructores lo improvisaban con frágiles rondas de pre-simulación para propagar el contexto de auth. El Protocol 27 hace de la delegación una ley, con dos nuevas host functions:

- \`delegate_account_auth\` — llamable **solo dentro de \`__check_auth\`**: entrega la verificación de auth actual a una dirección delegada, cuya propia lógica de firmas se ejecuta entonces.
- \`get_delegated_signers_for_current_auth_check\` — permite al contrato llamado ver qué firmantes delegados aprobaron.

Un nuevo tipo de credencial, \`SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES\`, agrupa los firmantes delegados y sus firmas en una sola entrada de autorización — transacciones más pequeñas, simulación más simple.

A fondo: [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) · [recap del CAP-71 — delegación de autenticación](https://developers.stellar.org/meetings/2026/04/30#cap-71-recap-authentication-delegation-for-custom-accounts).

### Tu misión

Dentro de \`__check_auth\`, entrega la verificación al custodio almacenado:

1. El \`Address\` delegado ya está cargado desde el instance storage.
2. Llama a \`delegate_account_auth\` con el delegado y el signature payload — y elimina el \`todo!()\`.

Resultado esperado:

\`\`\`text
crown delegated: steward honored ✓
\`\`\`
`,
  },

  "stellar-protocol-27-4": {
    instructions: `## Seguridad de firmas y credenciales V2 (CAP-0071-02)

Las auditorías de seguridad encontraron un eco sutil en el formato antiguo de credenciales. El escenario exige tres cosas a la vez:

1. Un contrato estilo admin que **no incluye la dirección del firmante** en el payload firmado.
2. El admin es **rotado** a otra dirección…
3. …y ambas direcciones comparten la **misma clave privada**.

Entonces una firma hecha para el admin viejo puede sufrir **replay** hacia el nuevo — mints duplicados, acciones no autorizadas. *Nunca ha ocurrido on-chain*, pero el daño potencial justificó el arreglo en el protocolo.

El **\`SOROBAN_CREDENTIALS_ADDRESS_V2\`** vincula el signature payload a la dirección para la que fue creado. Un eco robado ya no abre otra puerta. El viejo \`SOROBAN_CREDENTIALS_ADDRESS\` sigue válido **hasta el Protocol 28** — ventana de migración, no precipicio. Salvaguarda provisional para contratos estilo admin: incluye tú mismo la dirección del firmante en el payload.

Mira: [Stellar Developer Meeting — custom accounts y seguridad de firmas](https://www.youtube.com/watch?v=5O1cDDGv7_o).

### Tu misión

1. Actualiza \`CREDENTIALS\` al nombre de la credencial V2.
2. Registra hasta qué protocolo sigue válido el V1.
3. En \`binding_address\`, obtén el propio \`Address\` de este contrato vía \`env.current_contract_address()\` y devuélvelo (quien llama lo añade al material firmado) — elimina el \`todo!()\`.

Resultado esperado:

\`\`\`text
seal bound to its door: the echo dies ✓
\`\`\`
`,
  },

  "stellar-protocol-27-5": {
    instructions: `## Migrando al Protocol 27

Un protocol upgrade es una caravana, y el orden de lanzamientos fue el camino: **Core → SDKs → RPC y Galexie → Horizon → Testnet → Mainnet**. Cada SDK — Rust, JavaScript, Go, Java, Python, iOS, PHP, .NET, Flutter, Elixir — publicó una versión Protocol 27 y debe actualizarse antes de que gire la Mainnet.

El único **breaking change** que sienten la mayoría de las apps: \`@stellar/stellar-base\` fue **consolidado en \`@stellar/stellar-sdk\`**. Los imports viejos se rompen; el arreglo es renombrar el paquete.

Tu checklist de migración:

1. Actualiza cada SDK y biblioteca cliente de Stellar — revisa [Software Versions](https://developers.stellar.org/docs/networks/software-versions).
2. Renombra los imports de \`@stellar/stellar-base\` a \`@stellar/stellar-sdk\`.
3. Planifica el paso a \`SOROBAN_CREDENTIALS_ADDRESS_V2\` antes del Protocol 28.
4. Operadores de nodo: actualicen Core, RPC, Galexie y Horizon antes del voto.

Referencias: [guía de actualización](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide) · [guía de migración](https://developers.stellar.org/meetings/2026/04/30#migration-guidance).

### Tu misión

Completa el manifiesto de la caravana:

1. \`JS_XDR_PACKAGE\` — el paquete que absorbió a \`stellar-base\`.
2. \`TESTNET_UPGRADE\` — la fecha en que giró la Testnet, \`YYYY-MM-DD\`.
3. \`UPGRADE_ALL_SDKS\` — ¿*todos* los SDKs necesitan la actualización?

Resultado esperado:

\`\`\`text
caravan cleared the Gate: nothing left behind ✓
\`\`\`
`,
  },

  "stellar-protocol-27-6": {
    instructions: `## Jefe: La cuenta delegada

Todo converge. El Espectro del Eco llega con un sello robado — y encuentra una cuenta que es *ley*: una custom account cuyo \`__check_auth\` verifica a su firmante raíz **y** delega en un custodio, exactamente como pretendía el Protocol 27.

Tu \`ZipperAccount\` debe, dentro de \`__check_auth\`:

1. Cargar la clave pública del firmante raíz (\`BytesN<32>\`) del instance storage bajo \`SIGNER\`.
2. Verificar la firma ed25519 sobre el payload con \`env.crypto().ed25519_verify(...)\` — un sello falso debe hacer trap.
3. Cargar el \`Address\` del custodio del instance storage bajo \`DELEGATE\` y entregar el resto de la verificación con \`delegate_account_auth\` — el golpe del Protocol 27.

Y exporta el bloque impl. Ningún \`todo!()\` sobrevive al final.

Resultado esperado:

\`\`\`text
__check_auth: signature verified, steward honored — the echo is silent ✓
\`\`\`
`,
  },
};
