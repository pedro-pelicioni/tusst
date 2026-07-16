import type { LessonStep } from "@/content/steps";

// Localized lesson steps — PART 2 (lessons 17+ in steps.ts order).
// Same rules as steps1.ts.
export const steps2: Record<string, LessonStep[]> = {
  "mastering-option-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `En la mayoría de los reinos, "nada" es una emboscada — un null que te derriba a medianoche. El pantano lo hace distinto: **la ausencia es parte del tipo**.

\`\`\`rust
enum Option<T> {
    Some(T),   // SÍ hay un valor, envuelto adentro
    None,      // no hay nada — declarado con honestidad
}
\`\`\`

Conociste a Option en el estante del Acaparador. Ahora vas a dominarlo.`,
    },
    {
      kind: "theory",
      body: `Una función que quizá no tenga respuesta lo dice en su firma:

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

Fíjate: sin punto y coma en \`Some(7)\` / \`None\` — el \`if/else\` es una expresión, y su resultado se devuelve.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué `find` devuelve `Option<i32>` en lugar de un simple `i32`?",
      options: [
        "Es honesto — puede no haber respuesta, y el tipo lo dice",
        "Option es más rápido que i32",
        "Todas las funciones de Rust deben devolver Option",
      ],
      answer: 0,
      explain: "El tipo obliga a cada llamador a manejar el caso None. Sin emboscadas a medianoche.",
    },
    {
      kind: "fill",
      prompt: "Envuelve el valor encontrado — el aldeano 7 existe.",
      file: "main.rs",
      before: "if present { ",
      after: "(7) } else { None }",
      choices: ["Some", "Ok", "Value"],
      answer: 0,
      explain: "Some envuelve la presencia; None declara la ausencia. (Ok pertenece a Result — el próximo acto.)",
    },
    {
      kind: "editor",
      intro: `### Prueba final — ¿Some, o None?

Completa \`find\`: si \`present\` es true devuelve \`Some(7)\`, de lo contrario \`None\` — y elimina el \`todo!()\`.

Salida esperada:

\`\`\`text
Some(7)
\`\`\``,
    },
  ],

  "mastering-option-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`.unwrap()\` arranca el valor de un Option:

\`\`\`rust
let x = Some(5).unwrap();   // → 5. bien.
let y = ghost.unwrap();     // ghost es None → 💥 PANIC
\`\`\`

Sobre un \`None\`, unwrap entra en **pánico** — el programa entero se ahoga. Las lápidas de este pantano dicen todas lo mismo.`,
    },
    {
      kind: "theory",
      body: `Los sobrevivientes llevan un **valor por defecto**:

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

Ya usaste este idioma dos veces — en el estante del Acaparador, y volverá a protegerte en la fortaleza de Soroban. Es la runa más útil del pantano.`,
    },
    {
      kind: "quiz",
      question: "`let ghost: Option<i32> = None;` — ¿qué hace `ghost.unwrap()`?",
      options: [
        "Entra en pánico — el programa se rompe",
        "Devuelve 0",
        "Devuelve None",
      ],
      answer: 0,
      explain: "Nunca hagas unwrap de lo que no has comprobado. El pantano está lleno de quienes lo hicieron.",
    },
    {
      kind: "fill",
      prompt: "Extrae con seguridad: usa 0 por defecto si el fantasma es None.",
      file: "main.rs",
      before: "let value = ghost.",
      after: "(0);",
      choices: ["unwrap_or", "unwrap", "or_else"],
      answer: 0,
      explain: "unwrap_or nunca entra en pánico — la ausencia se convierte en tu valor por defecto.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — nunca hagas unwrap a ciegas

\`ghost\` es \`None\`. Extrae un valor con seguridad:

1. \`let value = ghost.unwrap_or(0);\` — sin ningún \`.unwrap()\`.
2. Imprime \`value: {}\`.

Salida esperada:

\`\`\`text
value: 0
\`\`\``,
    },
  ],

  "mastering-option-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Un \`match\` completo sobre un Option funciona — pero cuando solo te importa el caso \`Some\`, el pantano tiene un atajo:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);
}
\`\`\`

\`if let\` pregunta y desenvuelve en un solo golpe: *si el patrón encaja, nombra el valor y entra.*`,
    },
    {
      kind: "theory",
      body: `Y se combina con \`else\`, igual que un \`if\` normal:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light es el i32 desenvuelto
} else {
    println!("darkness");
}
\`\`\`

Dentro de la primera rama, \`light\` es un valor simple — sin Option, sin unwrap, sin peligro.`,
    },
    {
      kind: "quiz",
      question: "En `if let Some(light) = lantern { ... }`, ¿qué es `light` dentro de las llaves?",
      options: [
        "El valor desenvuelto — un i32 simple",
        "Sigue siendo un Option<i32>",
        "Un booleano",
      ],
      answer: 0,
      explain: "El patrón le quitó el Some — adentro, sostienes el valor mismo.",
    },
    {
      kind: "fill",
      prompt: "Pregúntale a la linterna: si hay luz, tómala por su nombre.",
      file: "main.rs",
      before: "if let ",
      after: "(light) = lantern {\n    println!(\"light: {}\", light);\n}",
      choices: ["Some", "Option", "Has"],
      answer: 0,
      explain: "if let Some(light) — el patrón nombra el valor envuelto.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — pregúntale al propio pantano

La linterna guarda \`Some(3)\`:

1. \`if let Some(light) = lantern\` → imprime \`light: {}\`
2. \`else\` → imprime \`darkness\`

Salida esperada:

\`\`\`text
light: 3
\`\`\``,
    },
  ],

  /* ───────────────────── Acto V · Result ───────────────────── */

  "mastering-result-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `El pantano te enseñó la *ausencia*. La Alta Corte juzga el **fracaso** — y el fracaso siempre declara su razón:

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // funcionó — aquí está el valor
    Err(E),   // falló — aquí está el PORQUÉ
}
\`\`\`

Donde \`Option\` dice "nada", \`Result\` dice "esto es lo que salió mal".`,
    },
    {
      kind: "theory",
      body: `Una función que puede fallar devuelve un Result — y dicta sentencia de forma explícita:

\`\`\`rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}
\`\`\`

Sin crash, sin respuesta errónea silenciosa — un veredicto, que queda registrado.`,
    },
    {
      kind: "quiz",
      question: "¿Cuándo debería una función devolver `Result` en lugar de `Option`?",
      options: [
        "Cuando el llamador necesita saber POR QUÉ falló",
        "Cuando nunca falla",
        "Result y Option son intercambiables",
      ],
      answer: 0,
      explain: "None guarda silencio; Err lleva la razón. Las cortes llevan registros.",
    },
    {
      kind: "fill",
      prompt: "Dicta sentencia sobre el fracaso: dividir por cero es un error.",
      file: "main.rs",
      before: "if b == 0 {\n    ",
      after: "(String::from(\"division by zero\"))\n} else {\n    Ok(a / b)\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Err(razón) — el fracaso con su porqué adjunto.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — los dos veredictos

Completa \`divide\` (y elimina el \`todo!()\`):

1. \`b == 0\` → \`Err(String::from("division by zero"))\`
2. De lo contrario → \`Ok(a / b)\`

Salida esperada:

\`\`\`text
Ok(5)
\`\`\``,
    },
  ],

  "mastering-result-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Llega un veredicto sellado. No adivinas — haces \`match\`, y el compilador se asegura de que **ambos** desenlaces queden atendidos:

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

Los patrones desenvuelven al encajar: \`v\` es el valor, \`e\` es la razón.`,
    },
    {
      kind: "theory",
      body: `Sobre la puerta del tribunal: \`#[must_use]\`.

Significa que Rust **te advierte** si recibes un Result y lo ignoras — un veredicto sin leer es un bug esperando su momento. Todo Result debe leerse, pasarse por match o entregarse deliberadamente hacia arriba. La Corte no olvida nada.`,
    },
    {
      kind: "quiz",
      question: "¿Qué hace el compilador si llamas a una función que devuelve Result e ignoras el veredicto?",
      options: [
        "Te advierte — Result es #[must_use]",
        "Nada — ignorarlo está bien",
        "Se niega a compilar, siempre",
      ],
      answer: 0,
      explain: "La advertencia de Result sin usar es el lema de la Corte aplicado en código.",
    },
    {
      kind: "fill",
      prompt: "Atiende la rama del fracaso — desenvuelve la razón como `e`.",
      file: "main.rs",
      before: "match verdict {\n    Ok(v) => println!(\"granted: {}\", v),\n    ",
      after: "(e) => println!(\"denied: {}\", e),\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Ok y Err — ambas ramas, ambas atendidas. El compilador no acepta menos.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — leer la sentencia

La corte te entrega \`Ok(42)\`. Haz match sobre ambos veredictos:

1. \`Ok(v)\` → imprime \`granted: {}\`
2. \`Err(e)\` → imprime \`denied: {}\`

Salida esperada:

\`\`\`text
granted: 42
\`\`\``,
    },
  ],

  "mastering-result-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Hacer match de cada Result donde ocurre entierra tu lógica en ceremonia. Algunas cortes no dictan sentencia — **elevan el caso**.

La runa más pequeña del reino:

\`\`\`rust
let n = parse("21")?;
\`\`\`

Ese \`?\` significa: *con Ok, desenvuelve y continúa. Con Err, devuelve el error a quien me llamó — ahora mismo.*`,
    },
    {
      kind: "theory",
      body: `Una condición: \`?\` solo funciona dentro de una función que **también devuelve Result** — el error necesita adónde ir:

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // un Err saldría aquí, hacia arriba
    Ok(n * 2)               // el camino feliz queda limpio
}
\`\`\`

Así es como el código Rust real se mantiene legible: los errores fluyen cuesta arriba, la lógica queda plana.`,
    },
    {
      kind: "quiz",
      question: "¿Qué hace `?` cuando el Result es `Err`?",
      options: [
        "Devuelve el Err desde la función actual de inmediato",
        "Entra en pánico",
        "Lo convierte en None",
      ],
      answer: 0,
      explain: "Una sola marca, y la sentencia fluye cuesta arriba hacia quien te llamó.",
    },
    {
      kind: "fill",
      prompt: "Propaga: desenvuelve con Ok, devuelve hacia arriba con Err.",
      file: "main.rs",
      before: "let n = parse(\"21\")",
      after: ";\nOk(n * 2)",
      choices: ["?", ".unwrap()", "!"],
      answer: 0,
      explain: "? propaga; unwrap entra en pánico. En la corte, jamás entras en pánico.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — la marca de la propagación

Completa \`double_first\` (y elimina el \`todo!()\`):

1. \`let n = parse("21")?;\`
2. Devuelve \`Ok(n * 2)\`.

Salida esperada:

\`\`\`text
Ok(42)
\`\`\``,
    },
  ],

  /* ───────────────── Acto VI · Stellar 101 (conceptual) ───────────────── */

  "stellar-101-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bienvenido al cielo, Forgeborn. **Stellar** es un libro mayor público — un libro de cuentas compartido que ningún poder controla en solitario, y que liquida pagos en ~5 segundos.

Cada actor en él es una **cuenta** (una fortaleza estelar), controlada por un **par de claves**: dos claves, nacidas juntas, con deberes opuestos.`,
    },
    {
      kind: "theory",
      body: `Las dos claves:

- **Clave pública** — empieza con \`G\`. Tu dirección. Grítala desde las torres; es como los demás te encuentran y te pagan.
- **Clave secreta** — empieza con \`S\`. Firma todo lo que haces. **Nunca** la compartas, nunca la pegues, nunca la subas a un repositorio. Si la pierdes → la cuenta se pierde para siempre. No hay mesa de soporte en el cielo.

Y para siquiera existir en el libro mayor, una cuenta guarda una **reserva base mínima: 1 XLM**.`,
    },
    {
      kind: "quiz",
      question: "Alguien te pide tu dirección para enviarte lumens. ¿Qué clave le das?",
      options: [
        "La clave pública G... — para eso existe",
        "La clave secreta S... — demuestra que la cuenta es tuya",
        "Ambas, por si acaso",
      ],
      answer: 0,
      explain: "La G es para compartir. La S firma — quien la tenga ES DUEÑO de tu cuenta.",
    },
    {
      kind: "quiz",
      question: "Pierdes tu clave secreta (S...). ¿Y ahora qué?",
      options: [
        "La cuenta es irrecuperable — nada podrá firmar por ella otra vez",
        "El soporte de Stellar puede restablecerla",
        "La clave pública puede regenerarla",
      ],
      answer: 0,
      explain: "Sin custodio, sin restablecimiento. La semilla ES la propiedad — cuídala con tu vida.",
    },
    {
      kind: "fill",
      prompt: "Completa la carta fundacional: ¿qué sigilo inicia una clave **pública**?",
      file: "star-chart.toml",
      before: "public_key_starts_with = \"",
      after: "\"",
      choices: ["G", "S", "X"],
      answer: 0,
      explain: "G para la dirección que compartes; S para la semilla que resguardas.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — la carta de la fortaleza estelar

Completa la carta: los dos sigilos, y la reserva base (en XLM) que una cuenta necesita para existir.

Salida esperada:

\`\`\`text
star-keep chartered ✓
\`\`\``,
    },
  ],

  "stellar-101-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `La moneda nativa del cielo es el **lumen (XLM)**. Su chispa más pequeña es el **stroop**:

\`\`\`text
1 XLM = 10,000,000 stroops
\`\`\`

Diez millones. Todos los montos del libro mayor se cuentan en realidad en stroops — los decimales son para los humanos.`,
    },
    {
      kind: "theory",
      body: `Cada transacción paga un pequeño peaje — la **tarifa base: 100 stroops** (0.00001 XLM).

No es un ingreso. Es anti-spam: lo bastante cara para impedir que alguien inunde el cielo de ruido, lo bastante barata para que un millón de pagos reales cuesten alrededor de un dólar. Cuando el tráfico se dispara, las tarifas suben brevemente — una subasta por el espacio.`,
    },
    {
      kind: "quiz",
      question: "¿Cuánto cuesta, aproximadamente, enviar un pago en Stellar?",
      options: [
        "100 stroops — una centésima de centavo",
        "1 XLM por pago",
        "Un porcentaje del monto enviado",
      ],
      answer: 0,
      explain: "Fija, diminuta, anti-spam. El monto que envías no cambia el peaje.",
    },
    {
      kind: "fill",
      prompt: "¿Cuántos stroops forman un lumen?",
      file: "star-chart.toml",
      before: "stroops_per_lumen = ",
      after: "",
      choices: ["10_000_000", "1_000", "100"],
      answer: 0,
      explain: "Diez millones de chispas por lumen.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — el peaje de la puerta

Completa la placa: stroops por lumen, y la tarifa base en stroops.

Salida esperada:

\`\`\`text
toll paid ✓
\`\`\``,
    },
  ],

  "stellar-101-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `El cielo transporta más que lumens. **Cualquier cuenta puede emitir un activo** — dólares, oro, boletos, puntos. Un activo se define por dos cosas juntas:

- un **código de activo**: \`USDC\`, \`EURC\`, ...
- su **emisor**: la cuenta \`G...\` que lo creó

Mismo código, distinto emisor → un activo completamente distinto. El emisor ES la identidad.`,
    },
    {
      kind: "theory",
      body: `Pero esta es la regla de consentimiento del cielo: tu cuenta no puede sostener un activo que no haya aceptado explícitamente.

Una **trustline** es esa aceptación — un puente que abres desde tu cuenta hacia un activo de un emisor:

\`\`\`text
trustline = "Acepto USDC, emitido por G...CENTRE"
\`\`\`

Sin trustline, no hay balance — los pagos en ese activo simplemente no pueden llegarte. (Cada trustline abierta también eleva un poco tu reserva.)`,
    },
    {
      kind: "quiz",
      question: "Alguien te envía USDC pero nunca abriste una trustline hacia él. ¿Qué pasa?",
      options: [
        "El pago falla — sin puente, no hay carga",
        "Llega como XLM en su lugar",
        "Espera en una cola de pendientes",
      ],
      answer: 0,
      explain: "El cielo se toma el consentimiento en serio: no sostienes nada que no aceptaste.",
    },
    {
      kind: "quiz",
      question: "Dos activos llamados USDC, de dos emisores distintos. ¿Son el mismo activo?",
      options: [
        "No — código + emisor definen el activo; el emisor es la identidad",
        "Sí — lo que importa es el código",
        "Solo si tienen el mismo precio",
      ],
      answer: 0,
      explain: "Cualquiera puede llamar USDC a un activo. En QUIÉN lo emitió es en quien confías.",
    },
    {
      kind: "fill",
      prompt: "El emisor de un activo siempre es... ¿qué tipo de cosa?",
      file: "star-chart.toml",
      before: "asset_issuer_starts_with = \"",
      after: "\"   # issuers are accounts",
      choices: ["G", "S", "USD"],
      answer: 0,
      explain: "Los emisores son cuentas — identificadas por su clave pública G...",
    },
    {
      kind: "editor",
      intro: `### Prueba final — abre el puente de luz

Completa la trustline para **USDC**: el código del activo, y el sigilo con el que empieza toda dirección de emisor.

Salida esperada:

\`\`\`text
light-bridge opened ✓
\`\`\``,
    },
  ],

  "stellar-101-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Todo converge. Una **operación de pago** necesita exactamente tres cosas:

1. **destino** — la cuenta que recibe (\`G...\`)
2. **activo** — lo que envías (\`XLM\` para el lumen nativo)
3. **monto** — cuánto

La firmas con tu clave secreta, pagas el peaje de ~100 stroops, y en ~5 segundos es **definitiva**. Sin bancos. Sin días hábiles. Sin fronteras.`,
    },
    {
      kind: "theory",
      body: `El viaje completo de tu pago:

\`\`\`text
construye la operación
  → firma con tu clave S...
    → envíala a la red
      → los validadores acuerdan (~5s)
        → definitiva. para siempre. en el libro mayor.
\`\`\`

Este es el cielo que el Beholder rompió — y el que estás a punto de volver a encender. Tras esta Puerta: Soroban, donde el libro mayor ejecuta *tu* Rust.`,
    },
    {
      kind: "quiz",
      question: "¿Qué hace válida una operación de pago para enviarla?",
      options: [
        "Está firmada con la clave secreta del remitente",
        "El destino la aprueba primero",
        "Un banco la compensa en 2 días hábiles",
      ],
      answer: 0,
      explain: "La firma es la autoridad — por eso la clave S... es sagrada.",
    },
    {
      kind: "fill",
      prompt: "Registra la carga: el código del activo nativo.",
      file: "star-chart.toml",
      before: "asset = \"",
      after: "\"",
      choices: ["XLM", "USD", "STR"],
      answer: 0,
      explain: "XLM — el lumen, el activo nativo del cielo.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — primera luz a través del cielo

Traza el pago: el sigilo del destino, el código del activo nativo, y envía **25**.

Salida esperada:

\`\`\`text
lumens flowing ✓
\`\`\``,
    },
  ],

  /* ───────────────── Acto VII · Soroban (asume dominio de Rust) ───────────────── */

  "soroban-smart-contracts-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Forgeborn, las reglas cambian más allá de la Puerta. Un **contrato Soroban** es una biblioteca de Rust compilada a WASM y almacenada en el libro mayor de Stellar — donde cualquiera puede invocarlo.

\`\`\`rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env};
\`\`\`

\`#![no_std]\` no es decoración: no hay OS, no hay allocator, no hay \`std\` on-chain. El libro mayor es la máquina, y el \`soroban_sdk\` es ahora tu biblioteca estándar.`,
    },
    {
      kind: "theory",
      body: `Dos atributos convierten Rust común en un contrato:

\`\`\`rust
#[contract]
pub struct HelloContract;      // la identidad del contrato

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env) -> Symbol { ... }
}
\`\`\`

\`#[contractimpl]\` exporta cada \`pub fn\` como un punto de entrada invocable. Cada una recibe \`Env\` primero — tu acceso al almacenamiento, los eventos y otros contratos.`,
    },
    {
      kind: "theory",
      body: `On-chain, cada byte paga renta. Los strings pesan — así que los identificadores cortos usan \`Symbol\`, un tipo compacto del libro mayor:

\`\`\`rust
use soroban_sdk::{symbol_short, Symbol};

let s: Symbol = symbol_short!("beacon");  // ≤ 9 caracteres, [a-zA-Z0-9_]
\`\`\`

Donde un dev web devuelve \`"ok"\`, un dev de Soroban devuelve \`symbol_short!("ok")\`.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué un contrato Soroban empieza con `#![no_std]`?",
      options: [
        "No hay OS ni allocator on-chain — la std completa no puede existir ahí",
        "Hace la compilación más rápida",
        "Es estilo opcional — std funciona bien on-chain",
      ],
      answer: 0,
      explain: "El WASM en el libro mayor no tiene sistema operativo debajo. El SDK reemplaza a std.",
    },
    {
      kind: "fill",
      prompt: "Exporta el bloque impl como la interfaz pública del contrato.",
      file: "lib.rs",
      before: "#[contract]\npub struct HelloContract;\n\n",
      after: "\nimpl HelloContract {\n    pub fn hello(env: Env) -> Symbol { /* ... */ }\n}",
      choices: ["#[contractimpl]", "#[contract]", "#[export]"],
      answer: 0,
      explain: "#[contract] marca el struct; #[contractimpl] exporta las funciones.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — talla la primera runa celeste

1. Marca el bloque impl con \`#[contractimpl]\`.
2. Haz que \`hello\` devuelva \`symbol_short!("beacon")\` — y elimina el \`todo!()\`.

Invocación esperada:

\`\`\`text
hello() → Symbol(beacon)
\`\`\``,
    },
  ],

  "soroban-smart-contracts-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Los contratos **no guardan memoria entre invocaciones** — toda variable local muere cuando la llamada retorna. El estado vive en el **libro mayor**, detrás de \`env.storage()\`.

Para el estado de todo el contrato (contadores, configuración, admin), el estante correcto es el **instance storage**:

\`\`\`rust
env.storage().instance()
\`\`\`

Comparte el tiempo de vida del propio contrato — se archiva y se restaura junto con él.`,
    },
    {
      kind: "theory",
      body: `Leer y escribir son simétricos, y todo se pasa **por referencia**:

\`\`\`rust
const COUNTER: Symbol = symbol_short!("COUNTER");

let count: u32 = env.storage().instance()
    .get(&COUNTER)
    .unwrap_or(0);

env.storage().instance().set(&COUNTER, &count);
\`\`\`

\`get\` devuelve un \`Option<T>\` — puede que la clave nunca se haya escrito, o que su renta (TTL) haya expirado. \`unwrap_or(0)\` es el idioma del contador.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué `storage().get(&KEY)` devuelve un `Option<T>` en lugar de `T`?",
      options: [
        "Puede que la clave nunca se haya escrito — o que su TTL haya expirado",
        "Todas las funciones del SDK devuelven Option por consistencia",
        "Para forzar el manejo de errores en desajustes de tipo",
      ],
      answer: 0,
      explain: "El almacenamiento del libro mayor se renta, no se posee. La ausencia es un estado normal — manéjala.",
    },
    {
      kind: "fill",
      prompt: "Usa 0 por defecto cuando el contador nunca se haya escrito.",
      file: "lib.rs",
      before: "let count: u32 = env.storage().instance().get(&COUNTER).",
      after: ";",
      choices: ["unwrap_or(0)", "unwrap()", "expect(\"0\")"],
      answer: 0,
      explain: "unwrap() entraría en pánico en la primera llamada — unwrap_or(0) convierte la ausencia en un punto de partida.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — haz que el libro mayor recuerde

Implementa \`increment\`:

1. Lee el conteo del instance storage bajo \`&COUNTER\` — por defecto \`0\`.
2. Suma \`1\`.
3. \`set(&COUNTER, &count)\` para escribirlo de vuelta.
4. Devuelve el nuevo conteo (y elimina el \`todo!()\`).

Invocación esperada:

\`\`\`text
increment() → 1
\`\`\``,
    },
  ],

  "soroban-smart-contracts-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Cualquiera puede invocar una función pública de un contrato, pasando **cualquier** \`Address\` como argumento. Entonces, ¿cómo sabe una bóveda que quien llama es realmente quien dice ser?

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    from.require_auth();   // ← el sello
    // ...
}
\`\`\`

\`require_auth()\` verifica que \`from\` realmente **firmó** (o preautorizó) exactamente esta invocación. Si no, la llamada **se aborta (trap)** — revertida, con el estado intacto.`,
    },
    {
      kind: "theory",
      body: `Esta es la línea cuya ausencia construyó la fortaleza del Beholder. Sin ella:

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    // sin require_auth ← cualquiera pasa TU dirección y te vacía
}
\`\`\`

La regla del reino: **toda función que mueve valor o cambia el estado de alguien exige su autorización — primera línea, antes que cualquier otra cosa.**`,
    },
    {
      kind: "quiz",
      question: "¿Qué pasa cuando `from.require_auth()` falla?",
      options: [
        "La invocación se aborta (trap) — todo se revierte, el estado queda intacto",
        "Devuelve false y la función continúa",
        "Registra una advertencia en el libro mayor",
      ],
      answer: 0,
      explain: "Un fallo de autorización no es una condición que se maneja — mata la invocación de raíz.",
    },
    {
      kind: "fill",
      prompt: "Sella la bóveda: exige la autorización del firmante.",
      file: "lib.rs",
      before: "pub fn withdraw(env: Env, from: Address, amount: i128) {\n    from.",
      after: ";\n    // transfer logic...\n}",
      choices: ["require_auth()", "verify()", "is_signed()"],
      answer: 0,
      explain: "require_auth() — la línea más importante de Soroban.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — el sello del firmante

Protege la bóveda: en \`withdraw\`, exige la autorización de \`from\` **antes** que cualquier otra cosa.

Una línea. El Beholder cayó por su ausencia.

Invocación esperada:

\`\`\`text
withdraw: authorized ✓
\`\`\``,
    },
  ],
};
