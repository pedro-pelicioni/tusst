import type { LessonStep } from "@/content/steps";

// ES · Lifetimes.
//
// Overlay for ../../steps/rust-lifetimes.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustLifetimesStepsEs: Record<string, LessonStep[]> = {
  "rust-lifetimes-1": [
    {
      kind: "theory",
      body: `Una anotación de lifetime no hace que nada viva más tiempo. Es una **restricción que quien llama tiene que satisfacer**, y el compilador la verifica en cada call site.

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Léelo como una frase sobre quien llama, no sobre la función: *"dame dos referencias, y te devuelvo una que es válida mientras las dos entradas lo sean."*

No se asigna nada. No se extiende nada. \`'a\` es solo un nombre para una región de código, inventado para atar el valor de retorno a un argumento.`,
    },
    {
      kind: "theory",
      body: `La lectura equivocada más común es pensar que \`'a\` en los dos parámetros obliga a que los dos argumentos vivan *lo mismo*. No es así.

Cuando la función se llama con referencias de lifetimes distintos, el compilador elige \`'a\` como el **más corto** de los dos — y entonces todo slot \`'a\` queda satisfecho, porque una referencia que vive más siempre sirve donde se pide una que vive menos.

\`\`\`rust
let long = String::from("soroban");
{
    let short = String::from("rpc");
    let winner = longest(&long, &short);
    println!("{winner}");     // ok — 'a es el scope interno
}
// \`winner\` no puede escapar de este bloque: 'a terminó junto con \`short\`
\`\`\`

El resultado solo está restringido por la región que eligió el compilador — por eso esto compila dentro del bloque y se rechaza fuera de él.`,
    },
    {
      kind: "quiz",
      question:
        "`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str` se llama con una referencia que vive todo el programa y otra que vive tres líneas. ¿Qué es `'a`?",
      options: [
        "La más corta de las dos regiones — y la referencia devuelta solo es válida dentro de ella",
        "La más larga de las dos, porque `'a` tiene que cubrir los dos argumentos",
        "Es un error de compilación: los dos argumentos tienen que tener el mismo lifetime",
      ],
      answer: 0,
      explain:
        "Los lifetimes funcionan como subtipado: un `&'long T` se convierte en `&'short T`. El compilador elige la región más grande donde toda restricción se cumple, que es la intersección — o sea, la más corta.",
    },
    {
      kind: "fill",
      prompt:
        "Ata el valor de retorno a las entradas para que quien llama sepa cuánto tiempo es válido.",
      file: "main.rs",
      before: "fn longest<'a>(a: &'a str, b: &'a str) -> ",
      after: " {",
      choices: ["&'a str", "&str", "String"],
      answer: 0,
      explain:
        "`&str` a secas no compila aquí: con dos referencias de entrada el compilador no puede adivinar de cuál de ellas toma prestada la salida. `String` compilaría, pero fuerza una asignación que la función no necesita.",
    },
    {
      kind: "quiz",
      question: "¿Cuánto cuesta `<'a>` en una firma, en tiempo de ejecución?",
      options: [
        "Nada. Los lifetimes se borran después de la verificación de borrows y no emiten código en absoluto",
        "Una palabra de máquina extra por referencia, para llevar la etiqueta de la región",
        "Una comprobación de límites en cada desreferencia de la referencia anotada",
      ],
      answer: 0,
      explain:
        "Los lifetimes existen solo durante la compilación. Por eso el borrow checker puede ser estricto gratis — no hay representación en runtime que pagar.",
    },
    {
      kind: "editor",
      intro: `### Ata una salida a sus entradas

Escribe \`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str\` que devuelva el argumento más largo (devuelve \`a\` cuando son iguales).

En \`main\`, llámala con un \`&String\` que contenga \`soroban\` y el literal \`"rpc"\`, e imprime el ganador.

Salida esperada:

\`\`\`text
longest: soroban
\`\`\``,
    },
  ],

  "rust-lifetimes-2": [
    {
      kind: "theory",
      body: `La mayoría de las firmas no necesitan anotación, porque tres **reglas de elisión** las completan. Conocerlas te dice exactamente cuándo tienes que escribir una a mano.

1. Cada lifetime de entrada omitido recibe su propio parámetro.
2. Si hay **exactamente un** lifetime de entrada, se asigna a todo lifetime de salida omitido.
3. Si una de las entradas es \`&self\` o \`&mut self\`, **el suyo** se asigna a todo lifetime de salida omitido.

\`\`\`rust
fn first_word(s: &str) -> &str        // regla 2 — una entrada, sin ambigüedad
fn rest(&self) -> &str                // regla 3 — la salida toma prestado de self
\`\`\``,
    },
    {
      kind: "theory",
      body: `Las reglas son deliberadamente tontas: nunca adivinan. Cuando dos referencias de entrada podrían plausiblemente ser el origen de la salida, la elisión simplemente se rinde y recibes un error pidiendo una anotación.

\`\`\`rust
fn pick(a: &str, b: &str) -> &str     // error: missing lifetime specifier
\`\`\`

Ese error no es el compilador poniéndose difícil. \`a\` y \`b\` pueden tener lifetimes completamente distintos, y la respuesta cambia lo que quien llama puede hacer con el resultado. Solo tú sabes de cuál de ellas salió la salida — así que solo tú puedes escribirlo.`,
    },
    {
      kind: "quiz",
      question:
        "`fn head(&self, other: &str) -> &str` compila sin anotaciones. ¿Qué lifetime recibe el `&str` devuelto?",
      options: [
        "El de `self` — la regla 3 tiene precedencia siempre que el método tiene un receptor `&self`",
        "El de `other`, porque es la última referencia en la lista de parámetros",
        "El más corto entre `self` y `other`, elegido en cada call site",
      ],
      answer: 0,
      explain:
        "La regla 3 existe precisamente porque los métodos que devuelven una vista de `self` son el caso abrumadoramente común. Si de verdad querías devolver un borrow de `other`, tienes que anotar — si no, la elisión te da silenciosamente la cosa equivocada, y el error aparece en el call site.",
    },
    {
      kind: "fill",
      prompt:
        "Este método devuelve una vista del buffer de la propia struct. Completa el encabezado del impl.",
      file: "main.rs",
      before: "struct Parser<'a> { input: &'a str }\n\nimpl",
      after: " Parser<'a> {\n    fn rest(&self) -> &str { self.input }\n}",
      choices: ["<'a>", "<'static>", ""],
      answer: 0,
      explain:
        "Una struct con parámetro de lifetime necesita declararlo también en el bloque impl — `impl<'a> Parser<'a>`. Dentro del bloque, `rest` no necesita anotación: la regla 3 lo cubre.",
    },
    {
      kind: "quiz",
      question: "¿Cuándo te obliga la elisión a escribir un lifetime explícito?",
      options: [
        "Cuando hay dos o más referencias de entrada, ningún `&self`, y la función devuelve una referencia",
        "Siempre que la función devuelve una referencia",
        "Siempre que la función tiene más de un parámetro",
      ],
      answer: 0,
      explain:
        "Las tres condiciones tienen que cumplirse a la vez. Una sola referencia de entrada la cubre la regla 2, un receptor `&self` la regla 3, y devolver un valor propio no necesita lifetime alguno.",
    },
    {
      kind: "editor",
      intro: `### Deja que la elisión haga su trabajo

1. Escribe \`fn first_word(s: &str) -> &str\` que devuelva todo lo anterior al primer espacio (la string entera si no hay ninguno). Sin anotaciones — la regla 2 lo cubre.
2. Define \`struct Parser<'a> { input: &'a str }\` con \`impl<'a> Parser<'a>\` y un método \`rest(&self) -> &str\` que devuelva \`self.input\`.
3. Imprime \`first_word("submit tx now")\`, y después \`rest()\` sobre un parser construido sobre \`"ledger 42"\`.

Salida esperada:

\`\`\`text
word: submit
rest: ledger 42
\`\`\``,
    },
  ],

  "rust-lifetimes-3": [
    {
      kind: "theory",
      body: `Cuando dos entradas tienen lifetimes genuinamente independientes, dales nombres separados. El que importa es el que aparece en la **salida**.

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

Esto dice algo preciso y útil: el resultado toma prestado de \`text\` y **no** de \`sep\`. Quien llama puede, por tanto, descartar \`sep\` de inmediato y seguir usando el resultado.

Colapsar los dos en \`'a\` también compilaría — y ataría silenciosamente el resultado también a \`sep\`, obligando a quien llama a mantener vivo algo de lo que la función nunca tomó prestado.`,
    },
    {
      kind: "theory",
      body: `Ese es el costo real de anotar de más: no hace que la función sea incorrecta, la hace **innecesariamente restrictiva**, y la restricción la sufre cada quien que llama.

\`\`\`rust
let cut = {
    let sep = String::from(":");
    prefix(&text, &sep)      // \`sep\` muere en la llave de cierre
};
println!("{cut}");           // sigue ok — \`cut\` solo toma prestado de \`text\`
\`\`\`

Con \`fn prefix<'a>(text: &'a str, sep: &'a str) -> &'a str\` este mismo código deja de compilar, por una razón que no se ve desde el call site. Las firmas son superficie de API; los lifetimes son parte del contrato.`,
    },
    {
      kind: "quiz",
      question:
        "`prefix` cambia de `<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str` a `<'a>(text: &'a str, sep: &'a str) -> &'a str`. Quienes la llaman empiezan a fallar. ¿Por qué?",
      options: [
        "El resultado ahora está atado también a `sep`, así que no puede sobrevivir a un separador de vida corta",
        "Un único parámetro de lifetime no puede usarse en más de un argumento",
        "La función ahora devuelve un borrow de `sep` en lugar de `text`",
      ],
      answer: 0,
      explain:
        "`'a` se convierte en la intersección de las regiones de las dos entradas, así que la salida hereda la más corta. El cuerpo no cambió; solo la promesa a quien llama se hizo más pequeña.",
    },
    {
      kind: "fill",
      prompt:
        "El resultado es un slice solo de `text`. Anota el tipo de retorno en consecuencia.",
      file: "main.rs",
      before: "fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> ",
      after: " {",
      choices: ["&'a str", "&'b str", "&'static str"],
      answer: 0,
      explain:
        "`&'b str` sería una mentira que el borrow checker atrapa en el cuerpo: el slice devuelto apunta dentro de `text`, no dentro de `sep`.",
    },
    {
      kind: "quiz",
      question:
        "Una función recibe dos referencias y devuelve una `String` propia. ¿Cuántas anotaciones de lifetime necesita?",
      options: [
        "Ninguna. La elisión nombra las entradas, y un valor de retorno propio no toma prestado de nada",
        "Dos — cada parámetro que es referencia tiene que anotarse explícitamente",
        "Una, compartida por los dos parámetros",
      ],
      answer: 0,
      explain:
        "Las anotaciones solo las fuerza una salida que es ella misma una referencia. Si devuelves datos propios, los lifetimes de las entradas dejan de ser problema de nadie.",
    },
    {
      kind: "editor",
      intro: `### Dos lifetimes, uno de ellos irrelevante

Escribe \`fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str\` que devuelva todo lo que hay en \`text\` antes de la primera aparición de \`sep\` (o todo \`text\` si no aparece).

En \`main\`, construye \`let text = String::from("GA7Q:250:live");\`, después en un **bloque interno** crea un separador \`String\` que contenga \`":"\`, llama a \`prefix\` y liga el resultado fuera del bloque. Imprímelo después de que el bloque haya terminado.

Salida esperada:

\`\`\`text
prefix: GA7Q
\`\`\`

Si compila, has probado que el resultado no toma prestado del separador.`,
    },
  ],

  "rust-lifetimes-4": [
    {
      kind: "theory",
      body: `Una struct puede guardar referencias, y entonces necesita un parámetro de lifetime:

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

El parámetro es una promesa: **una instancia de \`Frame\` no puede sobrevivir al buffer al que apunta.** El compilador lo hace cumplir, así que la struct nunca puede quedarse con un puntero colgante hacia una asignación liberada.

Esta es la forma de todo parser zero-copy. En lugar de asignar una \`String\` por campo, entregas slices de un buffer que es de otro.`,
    },
    {
      kind: "theory",
      body: `Vale la pena enunciar el trade con claridad, porque decide toda tu API.

**Prestado (campos \`&'a str\`).** Sin asignación por campo, así que parsear una petición grande es casi gratis. El costo: la struct queda atada — no puede guardarse en una cache de vida larga, enviarse a otro thread que sobreviva al buffer, ni devolverse desde la función que es dueña de la entrada.

**Propio (campos \`String\`).** Asigna, pero el valor es autocontenido, es \`'static\`, y va a cualquier parte.

Para un servicio RPC que decodifica una petición, la usa y la descarta dentro de un mismo handler, prestado es la decisión correcta y la ganancia es real. Para cualquier cosa que retengas más allá de la petición, paga la asignación.`,
    },
    {
      kind: "quiz",
      question:
        "Un handler parsea una petición en un `Frame<'a>` prestado del buffer de la petición, y después intenta meterlo en un `Vec` que vive en el estado de la aplicación. ¿Qué pasa?",
      options: [
        "No compila — el `Vec` sobrevive al buffer, así que el borrow no puede guardarse ahí",
        "Compila, y los slices del frame quedan colgantes cuando se libera el buffer",
        "Compila, y Rust copia los bytes subyacentes dentro del Vec automáticamente",
      ],
      answer: 0,
      explain:
        "Este es exactamente el error que el parámetro de lifetime existe para producir, y te está diciendo algo cierto: retener esos datos exige ser dueño de ellos. Convierte a `String` en la frontera donde termina el lifetime.",
    },
    {
      kind: "fill",
      prompt: "Declara una struct que toma prestados dos slices del mismo buffer.",
      file: "main.rs",
      before: "struct Frame",
      after: " {\n    method: &'a str,\n    params: &'a str,\n}",
      choices: ["<'a>", "<'static>", "<T>"],
      answer: 0,
      explain:
        "`<'static>` compilaría pero solo aceptaría referencias válidas durante todo el programa — en la práctica, solo literales. Es la clásica reacción exagerada a un error de lifetime.",
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `fn parse(raw: &'a str) -> Frame<'a>` es la firma correcta para el constructor?",
      options: [
        "Declara que los slices del frame apuntan dentro de `raw`, así que el compilador ata los destinos de ambos",
        "Fuerza a que `raw` se copie dentro del frame, haciendo el frame independiente",
        "Es solo estilo — `fn parse(raw: &str) -> Frame` significa lo mismo",
      ],
      answer: 0,
      explain:
        "La tercera opción se acerca lo suficiente como para ser peligrosa: la elisión *sí* lo completaría de forma idéntica aquí (una referencia de entrada, regla 2). Escribirlo explícito sigue valiendo la pena — la firma documenta que el valor de retorno es una vista, no una copia.",
    },
    {
      kind: "editor",
      intro: `### Una vista zero-copy

1. Define \`struct Frame<'a> { method: &'a str, params: &'a str }\`.
2. En \`impl<'a> Frame<'a>\`, escribe \`fn parse(raw: &'a str) -> Frame<'a>\` que divida en el primer \`'|'\` — el texto anterior es \`method\`, el posterior es \`params\`. Sin \`'|'\`, \`method\` es la entrada entera y \`params\` es \`""\`.
3. En \`main\`, parsea una \`String\` que contenga \`getLedgerEntries|[42]\` e imprime los dos campos.

Salida esperada:

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

Ninguna asignación de \`String\` en ningún punto de \`parse\`.`,
    },
  ],

  "rust-lifetimes-5": [
    {
      kind: "theory",
      body: `\`'static\` significa dos cosas distintas según dónde aparece, y confundirlas es una de las fuentes de confusión más comunes en async Rust.

**Como lifetime de una referencia — \`&'static T\`** — significa: esta referencia es válida durante toda la ejecución del programa. Los literales de string califican, porque están horneados dentro del binario.

\`\`\`rust
let s: &'static str = "baked into the binary";
\`\`\`

Es una afirmación fuerte, y muy pocos valores de runtime pueden hacerla.`,
    },
    {
      kind: "theory",
      body: `**Como bound — \`T: 'static\`** — significa algo mucho más débil: este tipo **no contiene referencias con un lifetime más corto que el del programa**. *No* significa que el valor viva para siempre.

Una \`String\` propia satisface \`T: 'static\` sin problema. No toma prestado de nada, así que no hay nada que pueda quedar colgante. Y aun así se dropea al final de su scope como cualquier otro valor.

\`\`\`rust
fn spawn_like<T: Send + 'static>(value: T) -> T { value }

let owned = String::from("owned at runtime");
spawn_like(owned);      // ok: String: 'static
\`\`\`

Por eso \`thread::spawn\` y \`tokio::spawn\` exigen \`'static\`. La task puede sobrevivir a la función que la creó, así que no puede sostener un borrow de las locales de esa función. Los datos propios son bienvenidos; el bound trata de *tomar prestado*, no de *duración*.`,
    },
    {
      kind: "quiz",
      question:
        "`thread::spawn` exige `F: 'static`. ¿Significa eso que la closure tiene que vivir todo el programa?",
      options: [
        "No — significa que la closure no puede tomar prestado nada de vida más corta que el programa. Se dropea cuando el thread termina",
        "Sí — las closures spawneadas se fugan y nunca se dropean",
        "Sí, y por eso toda closure spawneada tiene que ser `move` y usar solo literales",
      ],
      answer: 0,
      explain:
        "El bound restringe lo que puede *capturarse*, no cuánto dura el valor. Por eso las closures `move` que capturan `String`s propias lo satisfacen sin dificultad.",
    },
    {
      kind: "fill",
      prompt:
        "Acota un genérico para que pueda entregarse a otro thread: sin borrows de vida corta, seguro de transferir.",
      file: "main.rs",
      before: "fn spawn_like<T: ",
      after: ">(value: T) -> T {",
      choices: ["Send + 'static", "&'static", "Sync"],
      answer: 0,
      explain:
        "`Send` permite la transferencia entre threads; `'static` garantiza que no hay ningún borrow que pueda quedar colgante cuando el frame que hizo el spawn retorne. `Sync` trata de *compartir* una referencia entre threads — otra pregunta distinta.",
    },
    {
      kind: "quiz",
      question:
        "Te topas con `error: borrowed value does not live long enough` en una task spawneada. ¿Qué arreglo suele ser el correcto?",
      options: [
        "Darle a la task datos propios — clona hacia dentro, o mueve un `Arc`",
        "Añadir `&'static` al tipo del valor prestado",
        "Fugar el valor con `Box::leak` para que se vuelva `'static`",
      ],
      answer: 0,
      explain:
        "`Box::leak` técnicamente produce un `&'static` y ocasionalmente es correcto para un valor que de verdad dura todo el proceso — pero recurrir a él para callar un error de borrow significa asignar memoria que nunca vas a recuperar, una vez por llamada.",
    },
    {
      kind: "editor",
      intro: `### Dos significados, un programa

1. Liga un \`&'static str\` con la anotación de tipo explícita, que contenga \`baked into the binary\`, e imprímelo.
2. Escribe \`fn spawn_like<T: Send + 'static>(value: T) -> T\` que simplemente devuelva su argumento.
3. Pasa una \`String\` propia que contenga \`owned at runtime\` a través de ella e imprime el resultado — probando que \`String\` satisface \`'static\`.

Salida esperada:

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\``,
    },
  ],
};
