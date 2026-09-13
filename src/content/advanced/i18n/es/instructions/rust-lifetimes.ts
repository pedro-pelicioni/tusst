// ES · editor instructions — Lifetimes.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-lifetimes.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustLifetimesInstructionsEs: Record<string, { instructions: string }> = {
  "rust-lifetimes-1": {
    instructions: `## Ata una salida a sus entradas

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Léelo como una promesa a quien llama: *dame dos referencias, y la que te devuelvo es válida mientras las dos entradas lo sean.* No se asigna nada y no se extiende nada — \`'a\` solo le permite al compilador conectar la salida con las entradas.

### Tu tarea

Implementa \`longest\`, devolviendo el argumento más largo (devuelve \`a\` cuando las longitudes son iguales).

Llámala en \`main\` con un \`&String\` que contenga \`soroban\` y el literal \`"rpc"\`.

Salida esperada:

\`\`\`text
longest: soroban
\`\`\`

### Pistas

- \`.len()\` sobre un \`&str\` da la longitud en bytes.
- Un \`if\`/\`else\` es una expresión — puede ser la cola de la función.
`,
  },

  "rust-lifetimes-2": {
    instructions: `## Deja que la elisión haga su trabajo

Tres reglas completan los lifetimes que no escribiste:

1. Cada referencia de entrada omitida recibe su propio parámetro de lifetime.
2. Con **exactamente un** lifetime de entrada, se asigna a toda salida omitida.
3. Con un receptor \`&self\`, el lifetime de **self** se asigna a toda salida omitida.

### Tu tarea

1. \`fn first_word(s: &str) -> &str\` — todo lo anterior al primer espacio, o la string entera si no hay ninguno. La regla 2 significa que no hace falta anotación.
2. \`struct Parser<'a> { input: &'a str }\` con \`impl<'a> Parser<'a>\` y \`fn rest(&self) -> &str\` que devuelva \`self.input\`. La regla 3 cubre el método.
3. Imprime \`first_word("submit tx now")\`, y después \`rest()\` sobre un parser sobre \`"ledger 42"\`.

Salida esperada:

\`\`\`text
word: submit
rest: ledger 42
\`\`\`

### Pistas

- \`s.find(' ')\` devuelve \`Option<usize>\` — el índice en bytes de la primera coincidencia.
- \`&s[..i]\` hace un slice hasta ese índice.
`,
  },

  "rust-lifetimes-3": {
    instructions: `## Dos lifetimes, uno de ellos irrelevante

Cuando dos entradas no están relacionadas, nómbralas por separado. Lo que importa es cuál aparece en la **salida**:

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

Esto le dice a quien llama que el resultado toma prestado de \`text\` y no de \`sep\` — así que \`sep\` puede descartarse de inmediato.

### Tu tarea

Implementa \`prefix\`: todo lo que hay en \`text\` antes de la primera aparición de \`sep\`, o todo \`text\` si no aparece.

En \`main\`:

1. \`let text = String::from("GA7Q:250:live");\`
2. En un **bloque interno**, crea un separador \`String\` que contenga \`":"\`, llama a \`prefix\` y deja que el bloque evalúe al resultado.
3. Imprime el resultado *después* del bloque — donde el separador ya no existe.

Salida esperada:

\`\`\`text
prefix: GA7Q
\`\`\`

Si compila, has probado que el resultado no toma prestado del separador.
`,
  },

  "rust-lifetimes-4": {
    instructions: `## Una vista zero-copy

Una struct que guarda referencias necesita un parámetro de lifetime, que promete que la struct no puede sobrevivir al buffer al que apunta:

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

Esta es la forma de todo parser zero-copy: slices del buffer de otro en lugar de una \`String\` por campo.

### Tu tarea

1. Define \`Frame<'a>\` como arriba.
2. En \`impl<'a> Frame<'a>\`, escribe \`fn parse(raw: &'a str) -> Frame<'a>\` que divida en el primer \`'|'\`. El texto anterior es \`method\`, el posterior es \`params\`. Sin \`'|'\`, \`method\` es la entrada entera y \`params\` es \`""\`.
3. En \`main\`, parsea una \`String\` que contenga \`getLedgerEntries|[42]\` e imprime los dos campos.

Salida esperada:

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

Ninguna asignación de \`String\` en ningún punto dentro de \`parse\`.
`,
  },

  "rust-lifetimes-5": {
    instructions: `## 'static significa dos cosas distintas

**\`&'static T\`** — una referencia válida durante todo el programa. Los literales de string califican; casi nada calculado en runtime lo hace.

**\`T: 'static\`** — un bound que significa que el tipo **no contiene referencias de vida corta**. Una \`String\` propia lo satisface trivialmente, y aun así se dropea al final de su scope. Este es el bound que \`thread::spawn\` y \`tokio::spawn\` exigen: una task puede sobrevivir a quien la spawneó, así que no puede tomar prestadas sus locales.

### Tu tarea

1. Liga un \`&'static str\` **con la anotación de tipo explícita**, que contenga \`baked into the binary\`, e imprímelo.
2. Escribe \`fn spawn_like<T: Send + 'static>(value: T) -> T\` que devuelva su argumento sin cambios.
3. Pasa una \`String\` propia que contenga \`owned at runtime\` a través de ella, e imprime el resultado — probando que una \`String\` propia satisface \`'static\`.

Salida esperada:

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\`
`,
  },
};
