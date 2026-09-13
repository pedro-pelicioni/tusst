import type { LessonStep } from "@/content/steps";

// ES · Errors That Survive Production.
//
// Overlay for ../../steps/rust-error-handling.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustErrorHandlingStepsEs: Record<string, LessonStep[]> = {
  "rust-error-handling-1": [
    {
      kind: "theory",
      body: `\`Result<T, E>\` es un enum de lo más normal. El lenguaje no tiene nada especial para él, salvo un operador.

\`\`\`rust
enum Result<T, E> { Ok(T), Err(E) }
\`\`\`

\`?\` es ese operador. Aplicado a un \`Result\`, hace unwrap del \`Ok\` y **retorna temprano** en el \`Err\`:

\`\`\`rust
let n: i64 = raw.trim().parse()?;
\`\`\`

que es exactamente:

\`\`\`rust
let n: i64 = match raw.trim().parse() {
    Ok(v) => v,
    Err(e) => return Err(From::from(e)),
};
\`\`\``,
    },
    {
      kind: "theory",
      body: `Dos detalles de esa expansión se ganan su lugar.

**\`From::from(e)\`.** \`?\` convierte el error a la salida. Por eso una función que devuelve \`Result<T, MyError>\` puede usar \`?\` sobre un \`ParseIntError\` — siempre que exista \`MyError: From<ParseIntError>\`. Este es el mecanismo entero detrás del manejo ergonómico de errores en Rust, y es la lección después de la siguiente.

**El retorno temprano.** \`?\` solo puede aparecer en una función que devuelve \`Result\` (u \`Option\`, u otro tipo \`Try\`). No es un unwrap que hace panic — es un operador de control de flujo, y la falla sigue subiendo hasta que alguien la maneja.`,
    },
    {
      kind: "quiz",
      question: "¿Qué hace `?` que `.unwrap()` no hace?",
      options: [
        "Devuelve el error desde la función que lo contiene, convirtiéndolo con `From` — quien llama decide qué pasa",
        "Reintenta la operación una vez antes de rendirse",
        "Registra el error en el log y continúa con un valor por defecto",
      ],
      answer: 0,
      explain:
        "`unwrap` termina el proceso. `?` sube la decisión un frame, que es lo único que permite que una biblioteca siga siendo usable dentro del servicio de otra persona.",
    },
    {
      kind: "fill",
      prompt:
        "Propaga la falla de parseo a quien llama en vez de hacer panic con ella.",
      file: "main.rs",
      before: "let n: i64 = raw.trim().parse()",
      after: ";",
      choices: ["?", ".unwrap()", ".expect(\"bad\")"],
      answer: 0,
      explain:
        "Los tres compilan. Solo `?` le deja una opción a quien llama — y en un handler de requests, los otros dos convierten una entrada inválida en una task colapsada.",
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `?` no compila dentro de un `fn main()` sin tipo de retorno?",
      options: [
        "`?` retorna temprano con un `Err`, y una función que devuelve `()` no tiene cómo devolverlo",
        "`main` es un caso especial y nunca permite propagar errores",
        "`?` exige un `use std::ops::Try` explícito",
      ],
      answer: 0,
      explain:
        "El arreglo es darle a main un tipo de retorno: `fn main() -> Result<(), Box<dyn Error>>`. Rust entonces imprime el `Debug` del error y sale con código distinto de cero.",
    },
    {
      kind: "editor",
      intro: `### Propaga, no hagas panic

Escribe \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` que haga trim de la entrada, la parsee como \`i64\` con \`?\` y devuelva el doble del valor.

En \`main\`, llámala dos veces — con \`" 21 "\` y con \`"x"\` — y haz \`match\` sobre cada resultado, imprimiendo \`ok: <v>\` o \`err: <e>\`.

Salida esperada:

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

La segunda línea es el texto de \`Display\` del propio \`ParseIntError\`.`,
    },
  ],

  "rust-error-handling-2": [
    {
      kind: "theory",
      body: `\`Result<T, String>\` es donde el manejo de errores va a morir. Una \`String\` no admite match, no carga campos estructurados, y obliga a quien llama a parsear inglés para decidir qué hacer.

Modela la falla como un enum — una variante por cada cosa que de verdad puede salir mal:

\`\`\`rust
#[derive(Debug)]
enum TxError {
    Empty,
    TooLarge { limit: u32, got: u32 },
}
\`\`\`

Ahora quien llama puede hacer \`match\` sobre la variante, y \`TooLarge\` carga los números que una línea de log o el cuerpo de un error HTTP realmente necesitan.`,
    },
    {
      kind: "theory",
      body: `Dos hábitos hacen que esto rinda.

**Pon los datos en la variante.** \`TooLarge { limit, got }\` no cuesta nada y responde la primera pregunta del operador. \`TooLarge\` a secas lo obliga a ir a leer el código para encontrar el límite.

**Mantén el enum cerrado y pequeño.** Una variante por *decisión que quien llama podría tomar de forma distinta*, no una por línea de código que puede fallar. Diez variantes que significan todas "el request estaba malformado" son una API peor que un solo \`Malformed { field: String }\`.

En un crate real derivarías \`Display\` y \`Error\` con \`thiserror\` en vez de escribirlos a mano. Genera exactamente lo que las dos próximas lecciones escriben manualmente — vale la pena hacerlo a mano una vez, para saber qué está haciendo la macro.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `Result<T, String>` es una mala elección como tipo de error público de una biblioteca?",
      options: [
        "Quien llama no puede hacer match sobre él, así que recuperarse de una falla concreta significa comparar prosa en inglés",
        "Los errores `String` asignan memoria, lo cual es demasiado lento para cualquier servicio en producción",
        "`String` no implementa `std::error::Error`, así que `?` no se puede usar en absoluto",
      ],
      answer: 0,
      explain:
        "La asignación es real pero rara vez decide nada — un camino de falla no suele ser caliente. Lo que de verdad duele es perder la capacidad de *ramificar* según la falla.",
    },
    {
      kind: "fill",
      prompt:
        "Dale a la variante los números que un operador va a necesitar, sin una búsqueda aparte.",
      file: "main.rs",
      before: "enum TxError {\n    Empty,\n    TooLarge ",
      after: ",\n}",
      choices: ["{ limit: u32, got: u32 }", "(String)", ""],
      answer: 0,
      explain:
        "Los campos con nombre en una variante se leen mejor en el punto de construcción que una variante de tupla: `TooLarge { limit: 100, got: size }` no necesita comentario.",
    },
    {
      kind: "quiz",
      question:
        "¿Cuántas variantes debería tener un enum de error de validación de requests?",
      options: [
        "Una por decisión que quien llama podría tomar de forma distinta — no una por línea que puede fallar",
        "Una por cada llamada a `?` en el módulo, para que toda falla sea rastreable",
        "Exactamente una, con un campo de mensaje",
      ],
      answer: 0,
      explain:
        "El enum es una API. Su forma debe seguir lo que quien llama necesita distinguir, y el detalle que solo sirve a humanos va en los campos.",
    },
    {
      kind: "editor",
      intro: `### Modela la falla, no la conviertas en string

1. Define \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`.
2. Escribe \`fn validate(size: u32) -> Result<u32, TxError>\`: \`0\` es \`Empty\`, cualquier valor mayor que \`100\` es \`TooLarge\` con límite \`100\`, todo lo demás es \`Ok(size)\`.
3. Imprime el \`{:?}\` de \`validate(50)\`, \`validate(0)\` y \`validate(150)\`.

Salida esperada:

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\``,
    },
  ],

  "rust-error-handling-3": [
    {
      kind: "theory",
      body: `\`?\` llama a \`From::from\` sobre el error cuando sale. Implementa \`From\` una vez, y todo \`?\` del módulo convierte gratis:

\`\`\`rust
impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadNumber(e)
    }
}
\`\`\`

Ahora esto compila, aunque \`parse\` devuelva \`ParseIntError\` y la función devuelva \`ConfigError\`:

\`\`\`rust
fn read_port(raw: &str) -> Result<u16, ConfigError> {
    let port: u16 = raw.parse()?;    // convertido a la salida
    Ok(port)
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Nunca implementes \`Into\` a mano. \`std\` tiene un blanket \`impl<T, U: From<T>> Into<U> for T\`, así que implementar \`From\` te da \`Into\` automáticamente — y al revés no funciona.

Para un \`Option\` en medio de una cadena de \`Result\`, haz el puente de forma explícita:

\`\`\`rust
let raw = raw.ok_or(ConfigError::Missing)?;
\`\`\`

\`ok_or\` convierte \`None\` en \`Err(...)\`; \`ok_or_else\` recibe una closure y es la que usar cuando construir el error no es gratis. Su imagen espejo, \`.ok()\`, descarta el error de un \`Result\` y te da un \`Option\` — cómodo, y digno de sospecha, porque tira a la basura el motivo.`,
    },
    {
      kind: "quiz",
      question:
        "Implementaste `From<ParseIntError> for ConfigError`. ¿Qué más obtienes?",
      options: [
        "`Into<ConfigError> for ParseIntError`, por el blanket impl de std — y conversión con `?` en cada call site",
        "Nada más; `Into` hay que implementarlo por separado",
        "`TryFrom` en la dirección opuesta, automáticamente",
      ],
      answer: 0,
      explain:
        "Por eso la regla es siempre 'implementa From, nunca Into'. Implementar `Into` directamente no te da ningún `From`, y `?` busca `From`.",
    },
    {
      kind: "fill",
      prompt:
        "Convierte un valor ausente en tu propio error para que `?` pueda llevarlo hacia arriba.",
      file: "main.rs",
      before: "let raw = raw.",
      after: "(ConfigError::Missing)?;",
      choices: ["ok_or", "unwrap_or", "expect"],
      answer: 0,
      explain:
        "`ok_or` mapea `Option<T>` a `Result<T, E>`. `unwrap_or` sustituiría un valor por defecto y ocultaría el hecho de que el valor no estaba.",
    },
    {
      kind: "quiz",
      question: "¿Cuándo conviene usar `ok_or_else` en vez de `ok_or`?",
      options: [
        "Cuando construir el valor de error no es gratis — `ok_or` evalúa su argumento de forma ansiosa, incluso en el camino `Some`",
        "Cuando el `Option` es `None` más veces que `Some`",
        "Cuando el tipo de error no implementa `Clone`",
      ],
      answer: 0,
      explain:
        "La misma regla que `unwrap_or` contra `unwrap_or_else`. Si el argumento es una variante unitaria simple, `ok_or` está bien y se lee mejor; si asigna memoria o formatea, usa la closure.",
    },
    {
      kind: "editor",
      intro: `### Deja que ? haga la conversión

1. Define \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`.
2. Implementa \`From<ParseIntError> for ConfigError\` produciendo \`BadNumber\`.
3. Escribe \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\`: \`ok_or\` para el caso \`Missing\`, después \`parse()?\` — sin ninguna conversión explícita en ningún lado.
4. Imprime el \`{:?}\` de tres llamadas: \`Some("8080")\`, \`None\`, \`Some("no")\`.

Salida esperada:

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\``,
    },
  ],

  "rust-error-handling-4": [
    {
      kind: "theory",
      body: `Un error le debe dos mensajes distintos a dos lectores distintos.

**\`Debug\`** — para ti, en un log o en un test que falla. Derívalo. Muestra la estructura, incluidos los nombres de los campos, y nunca se le muestra a un usuario.

**\`Display\`** — para un humano, en una línea de log o en una respuesta de API. Escríbelo a mano. Una frase, en minúsculas, sin punto final, sin prefijo "Error:" (quien llama le pone el contexto alrededor).

\`\`\`rust
impl fmt::Display for TimeoutError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "request timed out after {}ms", self.ms)
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`impl std::error::Error for TimeoutError {}\` — muchas veces un bloque vacío — es lo que convierte al tipo en un *error* y no en una struct que casualmente se puede imprimir.

Exige \`Debug + Display\`, y a cambio desbloquea el ecosistema: tu tipo puede meterse en un \`Box<dyn Error>\`, devolverse desde \`fn main()\`, viajar dentro de \`anyhow\` y encadenarse con \`source()\`.

\`\`\`rust
let boxed: Box<dyn Error> = Box::new(TimeoutError { ms: 250 });
println!("{boxed}");        // usa tu Display
\`\`\`

\`Box<dyn Error>\` es el tipo de error correcto en el nivel más alto de una aplicación, donde ya no pretendes hacer match sobre la variante. Una **biblioteca** debe conservar su enum concreto, para que quien la llama todavía pueda.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `std::error::Error` exige tanto `Debug` como `Display`?",
      options: [
        "Sirven a lectores distintos: `Debug` muestra la estructura para un desarrollador, `Display` escribe una frase para un log o un usuario",
        "`Debug` se usa en el camino de éxito y `Display` en el de falla",
        "Es histórico; hoy bastaría con `Display` solo",
      ],
      answer: 0,
      explain:
        "También tiene una consecuencia práctica: `fn main() -> Result<(), E>` imprime el `Debug`, no el `Display` — lo que sorprende a quien solo escribió un `Display` bonito.",
    },
    {
      kind: "fill",
      prompt: "Declara el tipo como error, heredando los métodos por defecto.",
      file: "main.rs",
      before: "impl Error for TimeoutError ",
      after: "",
      choices: ["{}", "{ fn description(&self) -> &str { \"\" } }", ";"],
      answer: 0,
      explain:
        "Todos los métodos de `Error` tienen implementación por defecto, así que un bloque vacío está completo. `description` está deprecado — `Display` lo reemplazó.",
    },
    {
      kind: "quiz",
      question:
        "¿Cuándo es `Box<dyn Error>` el tipo de error correcto, y cuándo es un error usarlo?",
      options: [
        "Correcto en el nivel más alto de una aplicación, donde nadie hace match sobre él; incorrecto en una biblioteca, cuyos usuarios todavía necesitan distinguir fallas",
        "Correcto en todas partes — es estrictamente más flexible que un enum concreto",
        "Incorrecto en todas partes: asigna memoria en cada camino de error",
      ],
      answer: 0,
      explain:
        "Es la misma división que `anyhow` contra `thiserror`. Borrar el tipo es una comodidad que solo puedes gastar en tu propio nombre, nunca en el de quien te llama.",
    },
    {
      kind: "editor",
      intro: `### Los dos mensajes que un error debe

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`.
2. Implementa \`fmt::Display\` imprimiendo \`request timed out after <ms>ms\`.
3. Implementa \`std::error::Error\` con un bloque vacío.
4. En \`main\`, imprime una instancia con \`{}\` y con \`{:?}\`, después mete una segunda (\`ms: 250\`) en un \`Box<dyn Error>\` e imprímela.

Salida esperada:

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\``,
    },
  ],

  "rust-error-handling-5": [
    {
      kind: "theory",
      body: `Un error de una sola línea suele ser inútil por sí solo. *"could not load config"* no le dice al operador nada que no supiera ya.

\`Error::source\` es la forma estándar de adjuntar el motivo:

\`\`\`rust
impl Error for LoadFailed {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        Some(&self.cause)
    }
}
\`\`\`

Cada capa añade *lo que estaba intentando hacer* y deja intacta la capa de abajo. Recorrer la cadena produce entonces la historia completa, desde la intención hasta la syscall.`,
    },
    {
      kind: "theory",
      body: `Recorrerla es un loop de lo más simple:

\`\`\`rust
let mut cause = err.source();
while let Some(e) = cause {
    println!("  caused by: {e}");
    cause = e.source();
}
\`\`\`

La regla que hace que esto valga la pena: **el \`Display\` de cada capa describe su propia intención, nunca la capa de abajo.** Si \`LoadFailed\` imprime "could not load config: permission denied", la cadena ahora dice "permission denied" dos veces, y la duplicación crece con cada nivel.

Esto es lo que el \`.context("could not load config")\` de \`anyhow\` construye automáticamente, y es la razón por la que una buena línea de log en Rust puede cerrar una investigación en vez de abrirla.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué el `Display` de un error que envuelve a otro no debería incluir el mensaje de su causa?",
      options: [
        "La cadena se imprime capa por capa, así que incrustarlo repite el mismo texto en cada nivel",
        "`Display` no tiene permitido llamar a otros impls de `Display`",
        "La causa puede no existir todavía cuando `Display` se ejecuta",
      ],
      answer: 0,
      explain:
        "Cada capa que incrusta su causa convierte una cadena de N niveles en O(N²) de texto. Cada capa enuncia su propia intención; la cadena pone el resto.",
    },
    {
      kind: "fill",
      prompt: "Expón la falla subyacente para que la cadena se pueda recorrer.",
      file: "main.rs",
      before: "impl Error for LoadFailed {\n    fn ",
      after: "(&self) -> Option<&(dyn Error + 'static)> {\n        Some(&self.cause)\n    }\n}",
      choices: ["source", "cause", "inner"],
      answer: 0,
      explain:
        "`cause` era el nombre antiguo y está deprecado. `source` es el que recorre todo el ecosistema.",
    },
    {
      kind: "quiz",
      question:
        "Un operador ve `could not load config` sin ningún detalle más. ¿Qué es lo que más probablemente falta?",
      options: [
        "El error que envuelve no implementa `source()`, así que la cadena termina en la primera capa",
        "El error se registró con `{}` en vez de `{:?}`",
        "El nivel de log es demasiado bajo para mostrar errores anidados",
      ],
      answer: 0,
      explain:
        "`source()` tiene una implementación por defecto que devuelve `None`, así que olvidarlo falla en silencio — la cadena simplemente se detiene, y nada te avisa.",
    },
    {
      kind: "editor",
      intro: `### Mantén la causa adjunta

1. \`#[derive(Debug)] struct Io(String)\` con \`Display\` imprimiendo \`io failure: <texto>\`, y un impl vacío de \`Error\`.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` con \`Display\` imprimiendo exactamente \`could not load config\` — sin mencionar la causa.
3. Implementa \`Error\` para \`LoadFailed\` con \`source()\` devolviendo \`Some(&self.cause)\`.
4. En \`main\`, construye uno con causa \`permission denied\`, imprímelo, y después recorre la cadena imprimiendo \`"  caused by: <e>"\` en cada nivel.

Salida esperada:

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\``,
    },
  ],

  "rust-error-handling-6": [
    {
      kind: "theory",
      body: `La línea no es "los panics son malos". Es una pregunta sobre *de quién* es el error que la condición representa.

**Una condición** es algo que el mundo exterior tiene permitido hacer: entrada malformada, un archivo que falta, un timeout, una conexión cerrada. No es un bug. Recibe un \`Result\`.

**Un bug** es una invariante violada que tu propio código debía mantener: un índice que la propia función calculó y que queda fuera de rango, una máquina de estados que llega a un brazo inalcanzable. Seguir adelante significa computar sobre datos que ya demostraste que están mal. Recibe un \`panic!\`.`,
    },
    {
      kind: "theory",
      body: `En un handler de requests, esa distinción se convierte en una propiedad de disponibilidad.

Un \`unwrap()\` sobre entrada del usuario convierte un request malformado en un panic. Según el runtime, eso o desenrolla una task — y devuelve un 500 pelado sin ningún log útil — o aborta el proceso y se lleva consigo todos los requests en vuelo. En cualquiera de los dos casos, un atacante que lo encontró tiene una denegación de servicio.

Reglas prácticas:

- \`unwrap\`/\`expect\` sobre cualquier cosa derivada de la entrada: **nunca** en un handler.
- \`expect("...")\` en el arranque, donde la alternativa es correr mal configurado: **está bien**, y es mejor que un \`Result\` que nadie lee.
- \`assert!\` para una invariante, con un mensaje que nombre qué se violó: **bien**, y además documenta la suposición.
- En tests: \`unwrap\` a discreción. Un test que falla *debe* hacer ruido.`,
    },
    {
      kind: "quiz",
      question:
        "Un handler hace `let id = params.get(\"id\").unwrap();`. ¿Cuál es el riesgo real?",
      options: [
        "Cualquier request sin `id` hace panic en la task — una denegación de servicio que cualquiera puede disparar a propósito",
        "La respuesta es más lenta porque desenrollar la pila es caro",
        "Ninguno, siempre que el cliente se porte bien",
      ],
      answer: 0,
      explain:
        "Una entrada ausente es una condición, no un bug. La tercera respuesta es el razonamiento que manda esto a producción: el cliente es exactamente la parte del sistema que no controlas.",
    },
    {
      kind: "fill",
      prompt:
        "Lee un índice que legítimamente puede estar fuera de rango, sin hacer panic.",
      file: "main.rs",
      before: "data.",
      after: "(i).copied()",
      choices: ["get", "index", "iter().nth"],
      answer: 0,
      explain:
        "`get` devuelve `Option<&T>`; `.copied()` convierte `Option<&i64>` en `Option<i64>`. `data[i]` hace panic, lo cual solo es correcto cuando estar fuera de rango sería un bug.",
    },
    {
      kind: "quiz",
      question:
        "¿Dónde es `expect(\"DATABASE_URL must be set\")` una elección defendible?",
      options: [
        "En el arranque — la alternativa es un proceso corriendo mal configurado, y el mensaje nombra exactamente qué falta",
        "En ningún lado; `expect` es `unwrap` con pasos extra",
        "En un handler de requests, siempre que el mensaje sea descriptivo",
      ],
      answer: 0,
      explain:
        "Fallar rápido en el arranque es una feature: el proceso nunca llega al load balancer. La misma llamada dentro de un handler es un colapso por request.",
    },
    {
      kind: "editor",
      intro: `### Condición o bug

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — un valor que puede no estar es una **condición**. Usa \`.get(i).copied()\`.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — quien llama garantiza el rango, así que una violación es un **bug**. \`assert!\` con un mensaje que nombre el índice y la longitud, después indexa directo.
3. En \`main\`, con \`vec![10, 20, 30]\`: imprime \`checked_index\` en \`1\` y en \`9\` con \`{:?}\`, después \`invariant_index\` en \`2\`.

Salida esperada:

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\``,
    },
  ],
};
