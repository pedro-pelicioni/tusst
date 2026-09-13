// ES · editor instructions — Errors That Survive Production.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-error-handling.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustErrorHandlingInstructionsEs: Record<string, { instructions: string }> = {
  "rust-error-handling-1": {
    instructions: `## Propaga, no hagas panic

\`?\` hace unwrap del \`Ok\` y retorna temprano en el \`Err\`, convirtiendo el error con \`From\` a la salida. Es un operador de control de flujo, no un unwrap — la falla sigue viajando hasta que alguien la maneja.

### Tu tarea

Escribe \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` que haga trim de la entrada, la parsee como \`i64\` **con \`?\`** y devuelva el doble del valor.

En \`main\`, llámala con \`" 21 "\` y con \`"x"\`, haciendo \`match\` sobre cada resultado e imprimiendo \`ok: <v>\` o \`err: <e>\`.

Salida esperada:

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

La segunda línea es el texto de \`Display\` del propio \`ParseIntError\` — no lo escribes tú.

### Pistas

- \`raw.trim().parse()\` infiere el tipo destino a partir de la anotación del binding.
- \`Ok(n * 2)\` es el camino de éxito.
`,
  },

  "rust-error-handling-2": {
    instructions: `## Modela la falla, no la conviertas en string

\`Result<T, String>\` no admite match y no carga datos estructurados. Modela la falla como un enum, una variante por cada cosa que de verdad puede salir mal, con los datos que un operador va a necesitar ya dentro de la variante.

### Tu tarea

1. \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`
2. \`fn validate(size: u32) -> Result<u32, TxError>\`: \`0\` → \`Empty\`; mayor que \`100\` → \`TooLarge\` con límite \`100\`; en cualquier otro caso \`Ok(size)\`.
3. Imprime el \`{:?}\` de \`validate(50)\`, \`validate(0)\`, \`validate(150)\`.

Salida esperada:

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\`

### Pistas

- \`return Err(...)\` temprano para cada caso que falla, y \`Ok(size)\` como cola.
`,
  },

  "rust-error-handling-3": {
    instructions: `## Deja que ? haga la conversión

\`?\` llama a \`From::from\` sobre el error cuando sale de la función. Implementa \`From\` una vez y todo \`?\` del módulo convierte gratis.

Nunca implementes \`Into\` a mano — el blanket impl de std te lo da a partir de \`From\`, y \`?\` busca \`From\`.

### Tu tarea

1. \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`
2. \`impl From<ParseIntError> for ConfigError\` produciendo \`BadNumber\`.
3. \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\`: \`ok_or\` para el caso \`Missing\`, después \`parse()?\` — **sin** ninguna conversión explícita en ningún lado.
4. Imprime el \`{:?}\` de \`read_port(Some("8080"))\`, \`read_port(None)\`, \`read_port(Some("no"))\`.

Salida esperada:

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\`

### Pistas

- \`use std::num::ParseIntError;\`
- \`raw.ok_or(ConfigError::Missing)?\` convierte el \`Option\` en un \`Result\` y le hace unwrap.
`,
  },

  "rust-error-handling-4": {
    instructions: `## Los dos mensajes que un error debe

**\`Debug\`** es para un desarrollador, en un log o en un test que falla — derívalo.
**\`Display\`** es para un humano, una frase, en minúsculas, sin punto final — escríbelo.

\`impl std::error::Error\` (muchas veces un bloque vacío) es lo que convierte al tipo en un *error*: desbloquea \`Box<dyn Error>\`, \`?\` hacia tipos borrados, y el encadenamiento con \`source()\`.

### Tu tarea

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`
2. \`impl fmt::Display\` imprimiendo \`request timed out after <ms>ms\`.
3. \`impl Error for TimeoutError {}\` — vacío.
4. En \`main\`: imprime una instancia (\`ms: 5000\`) con \`{}\` y con \`{:?}\`, después mete una segunda (\`ms: 250\`) en un \`Box<dyn Error>\` e imprímela.

Salida esperada:

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\`

### Pistas

- \`use std::error::Error;\` y \`use std::fmt;\`
- La firma es \`fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result\`.
`,
  },

  "rust-error-handling-5": {
    instructions: `## Mantén la causa adjunta

\`Error::source\` adjunta el motivo. Cada capa enuncia **su propia intención** y deja intacta la capa de abajo — nunca incrusta la causa en su propio \`Display\`, o una cadena de N niveles imprime el mismo texto N veces.

### Tu tarea

1. \`#[derive(Debug)] struct Io(String)\` — \`Display\` imprime \`io failure: <texto>\`, impl vacío de \`Error\`.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` — \`Display\` imprime exactamente \`could not load config\`, sin mencionar la causa.
3. \`impl Error for LoadFailed\` con \`source()\` devolviendo \`Some(&self.cause)\`.
4. En \`main\`: construye uno con causa \`permission denied\`, imprímelo, después recorre la cadena imprimiendo \`"  caused by: <e>"\` en cada nivel.

Salida esperada:

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\`

### Pistas

- El recorrido de la cadena es \`let mut cause = err.source(); while let Some(e) = cause { ...; cause = e.source(); }\`
- El tipo de retorno de \`source\` es \`Option<&(dyn Error + 'static)>\`.
`,
  },

  "rust-error-handling-6": {
    instructions: `## Condición o bug

**Una condición** es algo que el mundo exterior tiene permitido hacer — entrada malformada, un timeout, una conexión cerrada. No es un bug. Recibe un \`Result\` o un \`Option\`.

**Un bug** es una invariante violada que tu propio código debía mantener. Seguir adelante significa computar sobre datos que ya demostraste que están mal. Recibe un \`panic!\` o un \`assert!\`.

En un handler, un \`unwrap\` sobre la entrada es una denegación de servicio que cualquiera puede disparar a propósito.

### Tu tarea

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — una condición. Usa \`.get(i).copied()\`.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — quien llama garantiza el rango, así que una violación es un bug. \`assert!\` con un mensaje que nombre el índice y la longitud, después indexa directo.
3. En \`main\`, con \`vec![10, 20, 30]\`: imprime \`checked_index\` en \`1\` y en \`9\` con \`{:?}\`, después \`invariant_index\` en \`2\`.

Salida esperada:

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\`

### Pistas

- \`.get()\` da \`Option<&i64>\`; \`.copied()\` lo convierte en \`Option<i64>\`.
- \`assert!(cond, "…{}…", value)\` acepta argumentos de formato.
`,
  },
};
