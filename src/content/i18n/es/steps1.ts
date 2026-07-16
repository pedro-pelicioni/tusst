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
      body: `Bienvenido a **Rust**, el lenguaje que los antiguos Forgeborn usaban para sostener el cielo.

Todo programa de Rust comienza en la función \`main\` — el punto de entrada. Cuando tu programa se ejecuta, \`main\` es lo que se invoca.

\`\`\`rust
fn main() {
    // tus runas van aquí
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Para imprimir texto en la consola, Rust te da el **macro** \`println!\`.

\`\`\`rust
println!("your text here");
\`\`\`

El \`!\` significa que es un *macro*, no una función — más adelante aprenderás por qué eso importa. Por ahora: si ves un \`!\`, piensa "macro".`,
    },
    {
      kind: "quiz",
      question: "¿Qué te dice el `!` en `println!`?",
      options: [
        "Es un macro, no una función",
        "El texto se imprime en voz alta",
        "La línea nunca puede fallar",
      ],
      answer: 0,
      explain: "El `!` marca la invocación de un macro — println! es el más famoso de Rust.",
    },
    {
      kind: "fill",
      prompt: "Completa la runa para que imprima texto en la consola.",
      file: "main.rs",
      before: "fn main() {\n    ",
      after: `("Hello, World!");\n}`,
      choices: ["println!", "print", "echo!"],
      answer: 0,
      explain: "println! imprime el texto seguido de un salto de línea.",
    },
    {
      kind: "quiz",
      question: "Las sentencias en Rust terminan con…",
      options: ["un punto y coma ;", "un punto .", "nada — los saltos de línea bastan"],
      answer: 0,
      explain: "El faro es pedante: toda sentencia termina con `;`.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — pronuncia las palabras del despertar

Haz que el programa imprima **exactamente**:

\`\`\`text
Hello, World!
\`\`\`

Las mayúsculas importan: H mayúscula, W mayúscula. El texto va entre comillas dobles, dentro de los paréntesis — y no olvides el punto y coma.`,
    },
  ],

  "rust-fundamentals-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Los programas necesitan **recordar** valores para mostrarlos o cambiarlos. Para eso, Rust tiene **variables**, declaradas con \`let\`:

\`\`\`rust
let score = 50;
\`\`\`

Como cofres etiquetados, las variables tienen contenido — y nombres que nos dicen qué hay dentro.`,
    },
    {
      kind: "theory",
      body: `Esta es la antigua ley de la armería: las variables en Rust son **inmutables por defecto**. Una vez ligado, el valor no puede cambiar.

\`\`\`rust
let x = 5;
x = 10; // ❌ error de compilación: no se puede asignar dos veces
\`\`\`

El compilador — tu aliado más severo — se negará a forjar esto.`,
    },
    {
      kind: "quiz",
      question: "¿Qué ocurre cuando compilas esto?\n\n`let x = 5; x = 10;`",
      options: [
        "Error de compilación — x es inmutable",
        "x pasa a valer 10",
        "x pasa a valer 15",
      ],
      answer: 0,
      explain: "Una vez forjado, jamás cambia — a menos que declares lo contrario.",
    },
    {
      kind: "theory",
      body: `Para permitir la reasignación, declara tu intención ante el propio acero con \`mut\`:

\`\`\`rust
let mut x = 5;
x = 10; // ✅ correcto
\`\`\`

\`mut\` es una promesa hecha en voz alta: *este valor va a cambiar*.`,
    },
    {
      kind: "fill",
      prompt: "Haz que `score` pueda reforjarse — decláralo mutable.",
      file: "main.rs",
      before: "let ",
      after: " score = 50;\nscore = 100;",
      choices: ["mut", "var", "flex"],
      answer: 0,
      explain: "let mut score = 50; — ahora la reasignación compila.",
    },
    {
      kind: "quiz",
      question: "¿Cuál declaración permite reasignar más adelante?",
      options: ["let mut power = 7;", "let power = 7;", "immutable power = 7;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Prueba final — reforja la hoja

El código inicial declara \`score\` como inmutable y luego intenta cambiarlo — no compila. Arréglalo:

1. Haz que \`score\` sea **mutable**.
2. Mantén la reasignación a \`100\`.
3. Imprime el puntaje final con \`println!("score: {}", score);\`

Salida esperada:

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
      body: `Todo valor en Rust tiene un **tipo** — su forma. Piensa en los frascos de Ferrisia: cada uno lleva una etiqueta con lo que contiene.

Las tres formas que más usarás:

- \`i32\` — un **número entero**: \`3\`, \`-7\`, \`2026\`
- \`f64\` — un **número decimal**: \`2.5\`, \`0.1\`
- \`bool\` — un **valor sí/no**: \`true\` o \`false\``,
    },
    {
      kind: "theory",
      body: `Rust normalmente puede adivinar el tipo — pero puedes etiquetarlo tú mismo, y la Ciudadela prefiere que lo hagas:

\`\`\`rust
let torches: i32 = 3;
let weight: f64 = 2.5;
let is_lit: bool = true;
\`\`\`

El patrón es siempre el mismo: \`let nombre: tipo = valor;\` — la etiqueta va después del nombre, tras dos puntos.`,
    },
    {
      kind: "quiz",
      question: "¿Qué tipo le corresponde al valor `4.5`?",
      options: ["f64 — un número decimal", "i32 — un número entero", "bool — un valor sí/no"],
      answer: 0,
      explain: "Todo lo que lleva punto decimal necesita un tipo de punto flotante como f64.",
    },
    {
      kind: "fill",
      prompt: "Etiqueta el frasco: `is_open` contiene `true` — un valor sí/no.",
      file: "main.rs",
      before: "let is_open: ",
      after: " = true;",
      choices: ["bool", "i32", "yes"],
      answer: 0,
      explain: "true y false viven en el tipo bool.",
    },
    {
      kind: "quiz",
      question: "¿Dónde va la etiqueta de tipo?\n\n`let age ___ = 12;`",
      options: [": i32 — después del nombre, tras dos puntos", "i32: — antes del nombre", "as i32 — después del valor"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Prueba final — etiqueta los frascos

Tres frascos sin etiqueta reposan en el estante. Agrega el tipo a cada uno:

1. \`age\` es un número entero → \`i32\`
2. \`price\` es un decimal → \`f64\`
3. \`is_open\` es sí/no → \`bool\`

Salida esperada:

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
      body: `Has estado escribiendo código dentro de \`main\` — pero un programa que es puro \`main\` es una forja con una única receta gigante clavada en la pared.

Una **función** es una receta que escribes una vez y usas para siempre: recibe ingredientes, hace el trabajo y devuelve un resultado.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Lee la receta pieza por pieza:

- \`fn double\` — el **nombre** de la receta
- \`(x: i32)\` — el **ingrediente** y su tipo
- \`-> i32\` — el tipo de lo que **regresa**

Y el secreto de la última línea: \`x * 2\` **no lleva punto y coma**. En Rust, la expresión final sin punto y coma *es* el valor retornado.`,
    },
    {
      kind: "quiz",
      question: "En `fn double(x: i32) -> i32 { x * 2 }`, ¿por qué `x * 2` no lleva punto y coma?",
      options: [
        "Es el valor de retorno — las expresiones sin ; se devuelven",
        "Los puntos y coma son opcionales en Rust",
        "Es un error de tipeo",
      ],
      answer: 0,
      explain: "La última expresión sin punto y coma es lo que la función retorna.",
    },
    {
      kind: "fill",
      prompt: "Completa la firma de la receta: retorna un `i32`.",
      file: "main.rs",
      before: "fn add(a: i32, b: i32) ",
      after: " i32 {\n    a + b\n}",
      choices: ["->", "=>", ":"],
      answer: 0,
      explain: "-> declara el tipo de retorno. (=> pertenece a los brazos de match.)",
    },
    {
      kind: "quiz",
      question: "¿Cómo llamas a la receta `add` con 2 y 3, guardando el resultado?",
      options: ["let sum = add(2, 3);", "let sum = add 2 3;", "call add(2, 3) into sum;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Prueba final — escribe la receta

\`main\` ya llama a \`add(2, 3)\` — pero la receta aún no existe. Escríbela debajo de \`main\`:

1. Nombre: \`add\`, parámetros \`a: i32\` y \`b: i32\`.
2. Retorna un \`i32\`.
3. Retorna \`a + b\` — **sin punto y coma** en esa línea.

Salida esperada:

\`\`\`text
2 + 3 = 5
\`\`\``,
    },
  ],

  "rust-fundamentals-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Ahora la ley que hace que Rust sea *Rust* — la que está tallada en la puerta de la bóveda:

**Todo valor tiene exactamente un dueño.**

\`\`\`rust
let sword = String::from("blade");
\`\`\`

Aquí \`sword\` **es dueño** de ese String. Un tesoro, un guardián. Sin excepciones.`,
    },
    {
      kind: "theory",
      body: `Entrega el tesoro a otro nombre, y la propiedad (ownership) **se mueve**:

\`\`\`rust
let a = String::from("gem");
let b = a;            // la gema ahora pertenece a b
println!("{}", a);    // ❌ error: a no posee nada
\`\`\`

No es crueldad — así es como Rust sabe exactamente quién debe limpiar cada valor, sin recolector de basura y sin fugas.`,
    },
    {
      kind: "quiz",
      question: "Después de `let b = a;` (donde `a` es un String), ¿qué puedes hacer con `a`?",
      options: [
        "Nada — la propiedad se movió a b",
        "Usarlo con normalidad",
        "Leerlo, pero no cambiarlo",
      ],
      answer: 0,
      explain: "El valor se movió. Intenta alcanzar a de nuevo y las guardas te quemarán — en tiempo de compilación.",
    },
    {
      kind: "theory",
      body: `A veces de verdad necesitas **dos** tesoros. Entonces forjas una copia real e independiente:

\`\`\`rust
let b = a.clone();   // ✅ dos Strings, dos dueños
\`\`\`

\`.clone()\` cuesta trabajo real — los herreros lo usan con deliberación, no por costumbre.`,
    },
    {
      kind: "fill",
      prompt: "Mantén ambos nombres usables: haz que `copy` sea una copia verdadera en vez de un movimiento.",
      file: "main.rs",
      before: "let sword = String::from(\"blade\");\nlet copy = sword",
      after: ";",
      choices: [".clone()", ".copy()", ".dup()"],
      answer: 0,
      explain: "clone() forja un String independiente — ambos dueños siguen vivos.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — la ley del único guardián

El código inicial mueve \`sword\` hacia \`copy\` y luego intenta usar \`sword\` otra vez — las guardas se niegan. Arréglalo **clonando** en vez de mover.

Salida esperada:

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
      body: `Clonar todo llevaría a la forja a la bancarrota. El Guardián del Préstamo enseña un camino mejor:

**No tienes que regalar un valor para que alguien lo lea. Préstalo.**

Una **referencia** (\`&\`) permite que una función *tome prestado* un valor — y este vuelve a tu mano automáticamente cuando terminan.`,
    },
    {
      kind: "theory",
      body: `Dos pequeñas marcas lo hacen funcionar:

\`\`\`rust
fn inspect(item: &String) {  // ① toma prestado, no se lo queda
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);               // ② presta con &
println!("{}", gem);         // ✅ sigue siendo tuya
\`\`\`

\`&String\` en la receta, \`&gem\` en la llamada. Prestas, leen, regresa.`,
    },
    {
      kind: "quiz",
      question: "¿Qué significa `&` en `inspect(&gem)`?",
      options: [
        "Prestar gem — inspect la toma prestada y la devuelve",
        "Mover gem hacia inspect permanentemente",
        "Hacer una copia completa de gem",
      ],
      answer: 0,
      explain: "Una referencia toma prestado. La propiedad nunca sale de tus manos.",
    },
    {
      kind: "fill",
      prompt: "Arregla la receta para que *tome prestado* el nombre en vez de quedárselo.",
      file: "main.rs",
      before: "fn greet(who: ",
      after: ") {\n    println!(\"welcome, {}\", who);\n}",
      choices: ["&String", "String", "clone String"],
      answer: 0,
      explain: "&String toma prestado — main conserva la propiedad del nombre.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — presta la hoja

\`greet\` actualmente **se queda** con el nombre, así que \`main\` lo pierde. Corrige ambas marcas:

1. El parámetro pasa a ser \`who: &String\`.
2. La llamada pasa a ser \`greet(&name);\`

Salida esperada:

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
      body: `Hasta ahora tus programas corren en línea recta, renglón por renglón. Pero el laberinto exige **decisiones**.

\`if\` ejecuta código solo cuando una condición es verdadera:

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
}
\`\`\`

La condición (\`torches > 0\`) debe ser un \`bool\` — una pregunta de verdadero/falso. No necesita paréntesis alrededor.`,
    },
    {
      kind: "theory",
      body: `\`else\` atrapa todo lo que el \`if\` no cubrió:

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
} else {
    println!("Darkness...");
}
\`\`\`

Exactamente una de las dos puertas se abre. Nunca ambas, nunca ninguna.`,
    },
    {
      kind: "quiz",
      question: "Con `let torches = 0;`, ¿qué imprime el código de arriba?",
      options: ["Darkness...", "The hall is lit", "Nada"],
      answer: 0,
      explain: "0 > 0 es falso, así que se abre la puerta del else.",
    },
    {
      kind: "fill",
      prompt: "Completa la condición: entra a la bóveda solo si `keys` es mayor que 0.",
      file: "main.rs",
      before: "if keys ",
      after: " 0 {\n    println!(\"enter\");\n}",
      choices: [">", "=", "=>"],
      answer: 0,
      explain: "> pregunta \"¿mayor que?\". Un solo = es asignación, no una pregunta.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — las dos puertas

La cámara tiene \`torches = 3\`. Escribe la decisión:

1. **Si** \`torches > 0\` → imprime \`The hall is lit\`
2. **Si no** → imprime \`Darkness...\`

Salida esperada:

\`\`\`text
The hall is lit
\`\`\``,
    },
  ],

  "control-flow-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Una cadena de \`if / else if / else\` se vuelve torpe rápido. Para "comparar un valor contra muchas posibilidades", Rust tiene algo más afilado: \`match\`.

\`\`\`rust
match number {
    1 => println!("one"),
    2 => println!("two"),
    _ => println!("many"),
}
\`\`\`

Cada línea es un **brazo** (arm): \`patrón => qué hacer\`.`,
    },
    {
      kind: "theory",
      body: `Dos reglas hacen de \`match\` el favorito del Overlord:

1. **Todo caso debe estar cubierto.** El brazo \`_\` significa "cualquier otra cosa" — olvídalo y el compilador se niega.
2. **Un match produce un valor** que puedes guardar:

\`\`\`rust
let word = match number {
    1 => "one",
    _ => "many",
};
\`\`\``,
    },
    {
      kind: "quiz",
      question: "¿Qué significa el brazo `_` en un match?",
      options: [
        "Cualquier otra cosa — el caso comodín",
        "Un valor vacío",
        "Saltarse este match",
      ],
      answer: 0,
      explain: "match debe cubrir toda posibilidad; _ barre con el resto.",
    },
    {
      kind: "fill",
      prompt: "Completa el brazo: la puerta `2` lleva al centro.",
      file: "main.rs",
      before: "let path = match door {\n    1 => \"left\",\n    2 ",
      after: " \"center\",\n    _ => \"no door\",\n};",
      choices: ["=>", "->", ":"],
      answer: 0,
      explain: "Los brazos de match usan => (las funciones usan -> para el tipo de retorno).",
    },
    {
      kind: "editor",
      intro: `### Prueba final — cada reflejo con su nombre

\`door = 2\`. Construye el match:

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. \`_\` → \`"no door"\`
4. Guarda el resultado en \`path\` y luego \`println!("{}", path);\`

Salida esperada:

\`\`\`text
center
\`\`\``,
    },
  ],

  "control-flow-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A veces necesitas repetir algo hasta que *tú* decidas parar. La repetición más simple de Rust es \`loop\` — corre **para siempre**:

\`\`\`rust
loop {
    println!("again...");
}
\`\`\`

Para siempre. A menos que escapes.`,
    },
    {
      kind: "theory",
      body: `\`break\` es la palabra de escape — sale del bucle de inmediato:

\`\`\`rust
let mut count = 0;
loop {
    count += 1;      // += suma y guarda: count = count + 1
    if count == 3 {
        break;       // ¡afuera!
    }
}
\`\`\`

Nota \`==\` (una pregunta: "¿igual?") frente a \`=\` (una orden: "guarda esto").`,
    },
    {
      kind: "quiz",
      question: "¿Qué le pasa a un `loop` sin ningún `break` adentro?",
      options: [
        "Corre para siempre — el programa nunca avanza",
        "Corre una sola vez",
        "El compilador agrega un break automáticamente",
      ],
      answer: 0,
      explain: "Los viajeros que lo caminan por siempre se vuelven parte del muro.",
    },
    {
      kind: "fill",
      prompt: "Escapa cuando el conteo llegue a 3.",
      file: "main.rs",
      before: "loop {\n    count += 1;\n    if count == 3 {\n        ",
      after: ";\n    }\n}",
      choices: ["break", "stop", "exit"],
      answer: 0,
      explain: "break sale del bucle a mitad de zancada.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — rompe el corredor sin fin

1. Dentro de un \`loop\`, suma \`1\` a \`echoes\` en cada pasada (\`echoes += 1;\`).
2. Cuando \`echoes == 3\`, \`break\`.

Salida esperada:

\`\`\`text
escaped after 3 echoes
\`\`\``,
    },
  ],

  "control-flow-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`loop\` + \`if\` + \`break\` funciona, pero hay una runa más limpia cuando la condición de salida se conoce de antemano: \`while\`.

\`\`\`rust
while floors > 0 {
    println!("descending...");
    floors -= 1;
}
\`\`\`

**Mientras la condición se cumpla, repite.** La comprobación ocurre *antes* de cada pasada — si es falsa desde el inicio, el cuerpo nunca corre.`,
    },
    {
      kind: "quiz",
      question: "Con `let mut floors = 0;`, ¿cuántas veces corre `while floors > 0 { ... }`?",
      options: [
        "Cero — la condición se comprueba antes de la primera pasada",
        "Una vez, y luego se detiene",
        "Para siempre",
      ],
      answer: 0,
      explain: "while primero pregunta, después actúa. 0 > 0 ya es falso.",
    },
    {
      kind: "theory",
      body: `Un peligro: si la condición nunca se vuelve falsa, \`while\` gira para siempre — igual que \`loop\`.

Por eso el cuerpo normalmente **cambia** algo de lo que depende la condición:

\`\`\`rust
while floors > 0 {
    floors -= 1;   // ← la marea que pone fin al bucle
}
\`\`\``,
    },
    {
      kind: "fill",
      prompt: "Sigue descendiendo mientras queden pisos.",
      file: "main.rs",
      before: "",
      after: " floors > 0 {\n    println!(\"floor {}\", floors);\n    floors -= 1;\n}",
      choices: ["while", "until", "if"],
      answer: 0,
      explain: "while repite; if decide una sola vez.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — gana la carrera contra la marea

1. **Mientras** \`floors > 0\`: imprime \`floor {}\` y luego \`floors -= 1;\`
2. Después del bucle: imprime \`Ground level!\`

Salida esperada:

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
      body: `Cuando conoces el camino de antemano — "todos los números del 1 al 5" — administrar tu propio contador es indigno de ti. \`for\` recorre la secuencia por ti:

\`\`\`rust
for n in 1..=5 {
    println!("step {}", n);
}
\`\`\`

En cada pasada, \`n\` toma el siguiente valor: 1, 2, 3, 4, 5. Sin contador que olvidar, sin forma de pasarse.`,
    },
    {
      kind: "theory",
      body: `\`1..=5\` es un **rango** — y el \`=\` importa:

- \`1..=5\` → 1, 2, 3, 4, **5** (inclusivo)
- \`1..5\` → 1, 2, 3, 4 (se detiene *antes* del 5)

El error de "uno de más o uno de menos" es la trampa más vieja del laberinto. El \`=\` es cómo la desarmas.`,
    },
    {
      kind: "quiz",
      question: "¿Qué números produce `for n in 1..4`?",
      options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"],
      answer: 0,
      explain: "Sin el =, el rango se detiene antes de su final.",
    },
    {
      kind: "fill",
      prompt: "Camina por las piedras 1 a 5 — **incluyendo** la 5.",
      file: "main.rs",
      before: "for n in 1",
      after: "5 {\n    println!(\"step {}\", n);\n}",
      choices: ["..=", "..", "to"],
      answer: 0,
      explain: "..= incluye la piedra final.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — los pasos contados

Cruza las cinco piedras del vado:

1. \`for\` sobre el rango \`1..=5\`
2. Imprime \`step {}\` para cada número.

Salida esperada:

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
      body: `Ya conoces todas las runas — \`if\`, \`match\`, \`loop\`, \`while\`, \`for\`. El laberinto del Overlord exige que las **combines**: una decisión *dentro* de una repetición.

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
      body: `El nuevo símbolo \`%\` da el **resto** de una división:

- \`7 % 3\` → \`1\` (7 ÷ 3 = 2, resto **1**)
- \`9 % 3\` → \`0\` (divide exacto)

Así que \`n % 3 == 0\` pregunta: *"¿n es divisible por 3?"* — la forma clásica de encontrar cada tercer espejo.`,
    },
    {
      kind: "quiz",
      question: "¿Cuánto es `10 % 3`?",
      options: ["1 — el resto de 10 ÷ 3", "3 — el resultado de la división", "0 — divide exacto"],
      answer: 0,
      explain: "10 = 3×3 + 1. El operador % te entrega ese 1.",
    },
    {
      kind: "fill",
      prompt: "Haz la pregunta: ¿`n` es divisible por 3?",
      file: "main.rs",
      before: "if n % 3 ",
      after: " 0 {\n    println!(\"mirror\");\n}",
      choices: ["==", "=", "%"],
      answer: 0,
      explain: "== compara. Un solo = intentaría asignar.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — el laberinto del Overlord

Recorre los diez espejos:

1. \`for n in 1..=10\`
2. **Si** \`n % 3 == 0\` → imprime \`mirror\`
3. **Si no** → imprime el número \`n\`

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
\`\`\``,
    },
  ],

  /* ───────────────────── Act III · standard library ───────────────────── */

  "rust-standard-library-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Una variable guarda **un** valor. Pero las aventuras producen *listas*: objetos, monedas, nombres. Para eso, la herramienta favorita del reino es el \`Vec\` — un morral que crece:

\`\`\`rust
let mut items = vec!["torch", "rope"];
\`\`\`

\`vec![...]\` lo crea con contenido ya adentro. Necesita \`mut\` si planeas cambiarlo — y lo planeas.`,
    },
    {
      kind: "theory",
      body: `Dos movimientos que usarás constantemente:

\`\`\`rust
items.push("map");    // agrega al final — el morral crece
items.len()           // ¿cuántos hay dentro? → 3
\`\`\`

Y la regla de los antiguos dioses: las posiciones se cuentan **desde cero**. \`items[0]\` es \`"torch"\`, \`items[1]\` es \`"rope"\`.`,
    },
    {
      kind: "quiz",
      question: "Después de `let mut v = vec![10, 20]; v.push(30);` — ¿cuánto vale `v[0]`?",
      options: ["10 — las posiciones se cuentan desde cero", "30 — push lo pone primero", "20 — el segundo elemento"],
      answer: 0,
      explain: "push agrega al FINAL; el índice empieza en 0, como quisieron los antiguos dioses.",
    },
    {
      kind: "fill",
      prompt: "Haz crecer el morral: agrega `\"map\"` al final.",
      file: "main.rs",
      before: "let mut satchel = vec![\"torch\", \"rope\"];\nsatchel.",
      after: "(\"map\");",
      choices: ["push", "add", "append_one"],
      answer: 0,
      explain: "push agrega un elemento al final de un Vec.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — empaca el morral

1. Crea un \`satchel\` **mutable** con \`vec!["torch", "rope"]\`.
2. Haz \`push\` de \`"map"\`.
3. Imprime \`items: {}\` con \`satchel.len()\`.

Salida esperada:

\`\`\`text
items: 3
\`\`\``,
    },
  ],

  "rust-standard-library-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Conoce a los trabajadores más perezosos del reino: los **iteradores**. Un iterador promete recorrer una colección — y luego no hace *nada* hasta que exiges un resultado.

\`\`\`rust
coins.iter()   // una cadena de espíritus perezosos, esperando
\`\`\`

Ya los has comandado sin saberlo: \`for n in 1..=5\` mueve un iterador por debajo.`,
    },
    {
      kind: "theory",
      body: `La magia está en **rematar la cadena**. Pide un resultado, y los espíritus por fin trabajan:

\`\`\`rust
let coins = vec![5, 10, 25];
let total: i32 = coins.iter().sum();   // → 40
\`\`\`

La etiqueta de tipo \`: i32\` en \`total\` le dice a \`.sum()\` qué producir — no la omitas.`,
    },
    {
      kind: "quiz",
      question: "¿Qué hace `coins.iter()` **por sí solo**, sin `.sum()` después?",
      options: [
        "Nada todavía — los iteradores son perezosos hasta que se recolectan",
        "Suma las monedas de inmediato",
        "Copia el Vec completo",
      ],
      answer: 0,
      explain: "No mueven un dedo hasta que recolectas. Esa pereza es lo que hace baratas las cadenas.",
    },
    {
      kind: "fill",
      prompt: "Remata la cadena: haz que los espíritus lo sumen todo.",
      file: "main.rs",
      before: "let total: i32 = coins.iter().",
      after: "();",
      choices: ["sum", "total", "add_all"],
      answer: 0,
      explain: ".sum() consume la cadena y devuelve un solo valor.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — reúne la fortuna

\`coins = vec![5, 10, 25]\`.

1. Súmalas: \`let total: i32 = coins.iter().sum();\`
2. Imprime \`total: {}\`.

Salida esperada:

\`\`\`text
total: 40
\`\`\``,
    },
  ],

  "rust-standard-library-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `La trampa favorita del Acaparador: un Vec con 2 elementos, y un aventurero estirando la mano hacia la ranura 5.

\`\`\`rust
let vault = vec!["hammer", "chisel"];
vault[5]   // 💥 PANIC — el programa se estrella
\`\`\`

Los corchetes *asumen* que la ranura existe. Las suposiciones, en las bóvedas, son fatales.`,
    },
    {
      kind: "theory",
      body: `La pregunta cortés es \`.get()\`:

\`\`\`rust
vault.get(0)   // → Some(&"hammer")  — la ranura existe
vault.get(5)   // → None             — sin estrellarse, solo "no hay nada"
\`\`\`

Esa respuesta \`Some / None\` es un \`Option\` — tu primera probada del Pantano Evanescente. Acompáñala con un plan B: \`vault.get(5).unwrap_or(&"nothing")\`.`,
    },
    {
      kind: "quiz",
      question: "`vault` tiene 2 elementos. ¿Qué devuelve `vault.get(5)`?",
      options: [
        "None — un sereno \"no hay nada\"",
        "Estrella el programa",
        "El último elemento",
      ],
      answer: 0,
      explain: "get nunca se estrella — responde Some(&item) o None.",
    },
    {
      kind: "fill",
      prompt: "Pregunta por la ranura 5 **con cortesía** — prohibido estrellarse.",
      file: "main.rs",
      before: "let tool = vault.",
      after: "(5).unwrap_or(&\"nothing\");",
      choices: ["get", "[]", "grab"],
      answer: 0,
      explain: "get(5) devuelve un Option; unwrap_or aporta el plan B.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — el estante que puede estar vacío

La bóveda tiene 2 herramientas. Pregunta por la ranura \`5\` de todos modos — con seguridad:

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. Imprime \`found: {}\`.

Salida esperada:

\`\`\`text
found: nothing
\`\`\``,
    },
  ],

  "rust-standard-library-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Un Vec responde por **posición**. Pero el libro de cuentas del Acaparador responde por **nombre**: preguntas "¿oro?" y dice "100".

Eso es un \`HashMap\` — claves ligadas a valores:

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
\`\`\`

Vive en lo profundo de las bóvedas (\`std::collections\`), así que necesita la línea \`use\` al principio.`,
    },
    {
      kind: "theory",
      body: `Escribir y leer el libro de cuentas:

\`\`\`rust
ledger.insert("gold", 100);     // liga clave → valor
ledger.insert("silver", 250);

println!("{}", ledger["gold"]); // pregunta por clave → 100
\`\`\`

Las entradas **no guardan ningún orden en particular** — el encantamiento cambia orden por respuestas instantáneas.`,
    },
    {
      kind: "quiz",
      question: "¿Qué pasa si haces `insert(\"gold\", 999)` cuando \"gold\" ya existe?",
      options: [
        "El valor viejo se reemplaza — un valor por clave",
        "El mapa conserva ambos valores",
        "Se estrella con un error de duplicado",
      ],
      answer: 0,
      explain: "Una clave se liga a exactamente un valor; insertar de nuevo lo sobrescribe.",
    },
    {
      kind: "fill",
      prompt: "Registra el tesoro: liga `\"gold\"` a `100`.",
      file: "main.rs",
      before: "ledger.",
      after: "(\"gold\", 100);",
      choices: ["insert", "push", "set"],
      answer: 0,
      explain: "Los HashMap usan insert(clave, valor) — push pertenece a Vec.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — el libro de cuentas encantado

1. Inserta \`("gold", 100)\` y \`("silver", 250)\`.
2. Imprime \`gold: {}\` usando \`ledger["gold"]\`.

Salida esperada:

\`\`\`text
gold: 100
\`\`\``,
    },
  ],

  "rust-standard-library-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Ya conociste a \`String\` en la bóveda del ownership — ahora aprende a hacerlo **crecer**:

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");   // añade texto al final
\`\`\`

\`push_str\` es el cincel de las inscripciones vivas. (Su primo \`push\` agrega un solo carácter.)`,
    },
    {
      kind: "theory",
      body: `Y el hechizo tejedor — \`format!\`:

\`\`\`rust
let banner = format!("The {}", s);
\`\`\`

Funciona **exactamente** como \`println!\` — mismos huecos \`{}\` — pero en vez de imprimir, te entrega el nuevo String para que lo guardes.`,
    },
    {
      kind: "quiz",
      question: "¿Cuál es la diferencia entre `println!(\"The {}\", s)` y `format!(\"The {}\", s)`?",
      options: [
        "println! lo imprime; format! devuelve el String en su lugar",
        "format! es más rápido",
        "println! no puede usar huecos {}",
      ],
      answer: 0,
      explain: "Mismo hechizo, distinto destino — la consola, o tus manos.",
    },
    {
      kind: "fill",
      prompt: "Haz crecer la inscripción: añade `\" of the Vaults\"`.",
      file: "main.rs",
      before: "let mut title = String::from(\"Keeper\");\ntitle.",
      after: "(\" of the Vaults\");",
      choices: ["push_str", "push", "append"],
      answer: 0,
      explain: "push_str añade texto; push añade un solo carácter.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — la inscripción viva

1. Añade \`" of the Vaults"\` a \`title\` con \`push_str\`.
2. \`let banner = format!("The {}", title);\`
3. Imprime el estandarte.

Salida esperada:

\`\`\`text
The Keeper of the Vaults
\`\`\``,
    },
  ],

  "rust-standard-library-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `El Acaparador no deja que el tesoro salga — pero sí te deja **mirar**. Un **slice** es una ventana hacia un tramo de una colección:

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

No se hace ninguna copia. El \`&\` lo marca como préstamo — estás mirando el estante del Acaparador, no llevándotelo.`,
    },
    {
      kind: "theory",
      body: `Cuidado con los bordes — la misma regla que los rangos de \`for\`:

- \`1..4\` → ranuras 1, 2, 3 (**excluye** el final)
- \`1..=4\` → ranuras 1, 2, 3, 4 (lo incluye)

Y para imprimir un slice completo, usa el **marcador de depuración** \`{:?}\`:

\`\`\`rust
println!("{:?}", window);   // [2, 3, 4]
\`\`\``,
    },
    {
      kind: "quiz",
      question: "Para `vec![10, 20, 30, 40]`, ¿qué es `&v[0..2]`?",
      options: ["[10, 20] — el final se excluye", "[10, 20, 30] — el final se incluye", "[20, 30]"],
      answer: 0,
      explain: "0..2 cubre las ranuras 0 y 1. La ventana excluye su final.",
    },
    {
      kind: "fill",
      prompt: "Imprime la ventana — los slices necesitan el marcador de depuración.",
      file: "main.rs",
      before: "println!(\"",
      after: "\", window);",
      choices: ["{:?}", "{}", "{window}"],
      answer: 0,
      explain: "{:?} es el marcador de depuración — las colecciones se imprimen con él.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — una ventana al botín

1. Toma el medio: \`let middle = &shelf[1..4];\`
2. Imprime \`middle: {:?}\`.

Salida esperada:

\`\`\`text
middle: [2, 3, 4]
\`\`\``,
    },
  ],
};
