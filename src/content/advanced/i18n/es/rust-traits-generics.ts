import type { LessonStep } from "@/content/steps";

// ES · Traits, Generics & Dispatch.
//
// Overlay for ../../steps/rust-traits-generics.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustTraitsGenericsStepsEs: Record<string, LessonStep[]> = {
  "rust-traits-generics-1": [
    {
      kind: "theory",
      body: `Un trait es un conjunto de métodos que un tipo promete ofrecer. No es una clase base: no hay herencia, no hay campos compartidos y no hay constructor.

\`\`\`rust
trait Health {
    fn name(&self) -> String;

    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

\`name\` es obligatorio. \`status\` tiene una **implementación por defecto**, escrita en términos de los métodos obligatorios — quien implementa se la lleva gratis y puede sobrescribirla.`,
    },
    {
      kind: "theory",
      body: `El patrón de *uno o dos métodos obligatorios más una pila de defaults* es lo que mantiene usable a la biblioteca estándar. \`Iterator\` exige exactamente un método, \`next\`, y te da unos setenta adaptadores encima.

Diseña tus propios traits igual. Deja la superficie obligatoria tan pequeña como la abstracción lo permita, y construye la comodidad encima como defaults:

\`\`\`rust
impl Health for Db {
    fn name(&self) -> String { String::from("db") }
    // status() viene gratis
}

impl Health for Rpc {
    fn name(&self) -> String { String::from("rpc") }
    fn status(&self) -> String { format!("{}: degraded", self.name()) }
}
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "Un trait tiene un método obligatorio y un método por defecto. ¿Qué tiene que escribir quien lo implementa?",
      options: [
        "Solo el obligatorio — el default se hereda, y sobrescribirlo es opcional",
        "Los dos, porque un impl de trait tiene que ser exhaustivo",
        "Solo el default; los métodos obligatorios los provee el compilador",
      ],
      answer: 0,
      explain:
        "Justo para esto existen los defaults: dejan que un trait crezca en superficie útil sin romper a cada implementador existente cada vez que lo hace.",
    },
    {
      kind: "fill",
      prompt:
        "Dale al trait un método por defecto construido a partir del obligatorio.",
      file: "main.rs",
      before: "trait Health {\n    fn name(&self) -> String;\n\n    fn status(&self) -> String {\n        format!(\"{}: ok\", ",
      after: ")\n    }\n}",
      choices: ["self.name()", "Self::name", "name()"],
      answer: 0,
      explain:
        "Un cuerpo por defecto puede llamar a cualquier otro método del trait a través de `self` — eso es lo que lo hace componible. `Self::name` sin receptor no sabría a qué instancia preguntarle.",
    },
    {
      kind: "quiz",
      question: "¿Por qué Rust no tiene acceso a campos a través de un trait?",
      options: [
        "Los traits describen comportamiento, no layout — quien implementa puede guardar sus datos con formas completamente distintas",
        "Sí lo tiene; `trait T { field: u32 }` es sintaxis válida",
        "Los campos son accesibles, pero solo desde cuerpos de métodos por defecto",
      ],
      answer: 0,
      explain:
        "Esta es la ruptura deliberada con la herencia. Si necesitas algo parecido a acceso a un campo, agrega un getter al trait — así un tipo que calcula ese valor al vuelo también puede implementarlo.",
    },
    {
      kind: "editor",
      intro: `### Un método obligatorio, uno por defecto

1. Define \`trait Health\` con \`fn name(&self) -> String\` obligatorio y un \`fn status(&self) -> String\` por defecto que devuelva \`"<name>: ok"\`.
2. Define las unit structs \`Db\` y \`Rpc\`.
3. \`Db\` implementa solo \`name\` (devolviendo \`db\`). \`Rpc\` implementa \`name\` (devolviendo \`rpc\`) **y** sobrescribe \`status\` para devolver \`"<name>: degraded"\`.
4. Imprime el status de cada uno.

Salida esperada:

\`\`\`text
db: ok
rpc: degraded
\`\`\``,
    },
  ],

  "rust-traits-generics-2": [
    {
      kind: "theory",
      body: `Un parámetro genérico sin bound es casi inútil: el cuerpo solo puede hacer lo que funciona para *todos* los tipos, que es casi nada.

Un **bound** recupera capacidad estrechando la entrada:

\`\`\`rust
fn describe_all<T: Display>(items: &[T]) -> String
\`\`\`

Ahora el cuerpo puede llamar a \`.to_string()\`, porque \`Display\` garantiza que existe. El bound es un contrato de ida y vuelta: quien llama tiene que pasar un tipo \`Display\`, y a cambio el cuerpo puede contar con eso.`,
    },
    {
      kind: "theory",
      body: `\`where\` mueve los bounds debajo de la firma. No es solo cosmético — algunos bounds ni siquiera se pueden escribir inline:

\`\`\`rust
fn process<T>(items: &[T]) -> String
where
    T: Display + Clone,
    for<'a> &'a T: IntoIterator,
{ ... }
\`\`\`

La disciplina que vale la pena mantener: **restringe exactamente lo que el cuerpo usa, y nada más.** Un \`T: Clone\` innecesario en una función que nunca clona no la hace más segura — rechaza a quien llama con un tipo no-\`Clone\` perfectamente bueno. Restringir de más es la versión genérica de anotar de más un lifetime.`,
    },
    {
      kind: "quiz",
      question:
        "Un helper recibe `items: &[T]` y lo único que hace es formatear cada elemento. ¿Cuál es el bound correcto?",
      options: [
        "`T: Display` — el mínimo que el cuerpo realmente necesita",
        "`T: Display + Clone + Debug`, para mantener la función flexible de cara al futuro",
        "Sin bound, y llamar a `.to_string()` — existe en todos los tipos",
      ],
      answer: 0,
      explain:
        "Agregar bounds no agrega flexibilidad; la quita, del lado de quien llama. Y `.to_string()` viene *de* `Display` vía un blanket impl — sin el bound ese método no existe.",
    },
    {
      kind: "fill",
      prompt:
        "Restringe el parámetro para que el cuerpo pueda formatear cada elemento, usando una cláusula `where`.",
      file: "main.rs",
      before: "fn describe_all<T>(items: &[T]) -> String\nwhere\n    T: ",
      after: ",\n{",
      choices: ["Display", "ToString + Clone", "Sized"],
      answer: 0,
      explain:
        "`ToString` también compilaría — la std lo implementa en blanket para todo `T: Display` — pero `Display` es el trait que expresa la capacidad, y le permite al cuerpo escribir en un buffer en vez de asignar una `String` por elemento. El `+ Clone` es el error de verdad: el cuerpo nunca clona.",
    },
    {
      kind: "quiz",
      question: "¿Qué significa `impl Trait` en posición de argumento?",
      options: [
        "Es azúcar para un parámetro genérico anónimo — `fn f(x: impl Display)` es `fn f<T: Display>(x: T)`",
        "Crea un trait object, metiendo el argumento en una box en runtime",
        "Significa que el argumento tiene que ser exactamente el único implementador de ese trait",
      ],
      answer: 0,
      explain:
        "La única diferencia real: con `impl Trait` el tipo no tiene nombre, así que quien llama no puede usar turbofish. Todo lo demás — monomorphization, dispatch estático — es idéntico.",
    },
    {
      kind: "editor",
      intro: `### Restringe exactamente lo que usas

Escribe \`fn describe_all<T>(items: &[T]) -> String\` con una cláusula \`where T: Display\`, uniendo cada elemento con \`", "\`.

Llámala dos veces en \`main\`: una con \`&[1, 2, 3]\`, otra con \`&["a", "b"]\`.

Salida esperada:

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

Importa \`std::fmt::Display\`. Arma la string con \`push_str\`, no con \`join\` — el punto es ver el bound en uso.`,
    },
  ],

  "rust-traits-generics-3": [
    {
      kind: "theory",
      body: `Los dos permiten que un trait sea genérico sobre un tipo. Significan cosas distintas:

\`\`\`rust
trait Source      { type Item;    fn next_item(&mut self) -> Option<Self::Item>; }
trait Source<T>   {               fn next_item(&mut self) -> Option<T>; }
\`\`\`

Con un **associated type**, un tipo implementa \`Source\` **una vez**, y elige \`Item\` como parte de esa única implementación.

Con un **parámetro genérico**, un tipo puede implementar \`Source<u32>\`, \`Source<String>\`, \`Source<Frame>\` — tantas veces como quiera.`,
    },
    {
      kind: "theory",
      body: `Esa diferencia decide cuál quieres, y hay un test limpio: **¿existe exactamente una respuesta sensata por tipo implementador?**

\`Iterator\` usa un associated type porque un \`Counter\` produce un solo tipo de cosa. Si \`Item\` fuera un parámetro genérico, \`counter.next()\` sería ambiguo en cada call site y te pasarías la vida escribiendo turbofish.

\`From\` usa un parámetro genérico por la razón opuesta: un tipo genuinamente debería convertir *desde* muchos otros, e \`impl From<u8> for Wide\` junto a \`impl From<u16> for Wide\` es exactamente lo correcto.

Los associated types también se leen mejor río abajo: \`fn drain<S: Source>(s: S) -> Vec<S::Item>\` nombra la salida sin un segundo parámetro.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `Iterator` usa `type Item` en vez de `trait Iterator<T>`?",
      options: [
        "Un iterador dado produce exactamente un tipo de elemento, así que un segundo impl solo crearía ambigüedad en cada call site",
        "Los associated types compilan más rápido que los parámetros genéricos",
        "Los parámetros genéricos no están permitidos en traits de la biblioteca estándar",
      ],
      answer: 0,
      explain:
        "Prueba el contrafactual: con `Iterator<T>`, `v.iter().next()` no podría inferir `T` y cada llamada necesitaría anotación. El associated type hace única la respuesta.",
    },
    {
      kind: "fill",
      prompt:
        "Nombra el tipo de salida en una firma río abajo sin agregar un segundo parámetro.",
      file: "main.rs",
      before: "fn drain<S: Source>(mut s: S) -> Vec<",
      after: "> {",
      choices: ["S::Item", "S", "Source::Item"],
      answer: 0,
      explain:
        "`S::Item` es el associated type proyectado desde el `S` concreto. `Source::Item` no tiene un `Self` desde el cual proyectar, así que el compilador no puede resolverlo.",
    },
    {
      kind: "quiz",
      question:
        "Estás diseñando un trait `Converter` y un tipo debería convertir desde `u8`, `u16` y `u32`. ¿Qué forma encaja?",
      options: [
        "Un parámetro genérico — el tipo necesita tres impls separados, uno por origen",
        "Un associated type, con un enum que cubra los tres",
        "Cualquiera; los dos son intercambiables en todos los casos",
      ],
      answer: 0,
      explain:
        "Varios impls por tipo es precisamente lo que un parámetro genérico permite y un associated type prohíbe. Es la misma razón por la que `From<T>` es genérico.",
    },
    {
      kind: "editor",
      intro: `### Una respuesta por tipo

1. Define \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`.
2. Define \`struct Counter { n: u32 }\` e implementa \`Source\` con \`type Item = u32\`, produciendo \`1\`, \`2\`, \`3\` y luego \`None\`.
3. Escribe \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` recolectando todo lo que la fuente produzca.
4. Imprime el vector drenado con \`{:?}\`.

Salida esperada:

\`\`\`text
items: [1, 2, 3]
\`\`\``,
    },
  ],

  "rust-traits-generics-4": [
    {
      kind: "theory",
      body: `Una función genérica no es una función. El compilador la **monomorfiza**: por cada tipo concreto con el que se la llama, estampa una copia especializada aparte.

\`\`\`rust
fn emit<T: Debug>(label: &str, value: T) { ... }

emit("count", 42u32);        // emite emit::<u32>
emit("name", "rpc");         // emite emit::<&str>
emit("flags", vec![true]);   // emite emit::<Vec<bool>>
\`\`\`

Tres call sites, tres funciones reales en el binario. Cada una conoce su tipo concreto, así que cada llamada a método adentro es una **llamada directa** — sin indirección, totalmente inlineable.`,
    },
    {
      kind: "theory",
      body: `Eso es lo que significa "abstracción de costo cero" aquí: la versión genérica compila a las mismas instrucciones que habrías escrito a mano.

Los costos son reales, pero se mueven a otro lado:

- **Tamaño del binario.** Cada instanciación es código duplicado. Una biblioteca muy genérica llamada con veinte tipos produce veinte copias.
- **Tiempo de compilación.** Esta es la mayor razón individual de que los builds de Rust sean lentos.

El trade casi siempre vale la pena en un camino caliente, y muchas veces no vale la pena para un registro de plugins o una colección heterogénea — que es para lo que existen los trait objects.`,
    },
    {
      kind: "quiz",
      question:
        "Una función genérica se llama con tres tipos concretos distintos. ¿Cuántas copias hay en el binario?",
      options: [
        "Tres — una instanciación especializada por cada tipo concreto usado",
        "Una, con el tipo pasado como argumento oculto en runtime",
        "Una, más una vtable por tipo",
      ],
      answer: 0,
      explain:
        "Las instanciaciones se generan bajo demanda: un genérico que nunca se llama nunca genera código, y por eso un helper genérico sin usar no cuesta nada.",
    },
    {
      kind: "fill",
      prompt: "Restringe el valor para que se pueda imprimir con el formateador `{:?}`.",
      file: "main.rs",
      before: "fn emit<T: ",
      after: ">(label: &str, value: T) {",
      choices: ["Debug", "Display", "Sized"],
      answer: 0,
      explain:
        "`{:?}` es `Debug`; `{}` es `Display`. Son traits separados a propósito — `Debug` es para desarrolladores y se puede derivar, `Display` es para usuarios y nunca se deriva.",
    },
    {
      kind: "quiz",
      question:
        "¿Cuándo es el dispatch dinámico la mejor opción a pesar de la llamada indirecta?",
      options: [
        "Cuando necesitas una colección heterogénea, o quieres que el tamaño del código deje de crecer con el número de implementadores",
        "Siempre que la función se llame más de una vez",
        "Siempre que el trait tenga más de un método",
      ],
      answer: 0,
      explain:
        "`Vec<Box<dyn Check>>` no tiene equivalente genérico — un `Vec<T>` guarda un solo tipo. Ese es el caso en el que los trait objects no son un compromiso sino la única opción.",
    },
    {
      kind: "editor",
      intro: `### Tres call sites, tres funciones

Escribe \`fn emit<T: Debug>(label: &str, value: T)\` que imprima \`"<label>: <value:?>"\`.

Llámala tres veces: con \`42u32\`, con \`"rpc"\` y con \`vec![true, false]\`.

Salida esperada:

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

Fíjate en las comillas alrededor de \`rpc\` — eso es \`Debug\`, no \`Display\`, y la diferencia es el punto.`,
    },
  ],

  "rust-traits-generics-5": [
    {
      kind: "theory",
      body: `Un genérico te da un tipo por instanciación. Cuando necesitas **varios tipos distintos en una misma colección**, necesitas un trait object:

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` no es un tipo con tamaño conocido, así que siempre aparece detrás de un puntero — \`Box<dyn Check>\`, \`&dyn Check\`, \`Arc<dyn Check>\`. Ese puntero es **gordo**: dos palabras, una a los datos y otra a la vtable.`,
    },
    {
      kind: "theory",
      body: `La vtable es una pequeña tabla estática, una por cada par (tipo, trait), que guarda un puntero a función por cada método más el tamaño y el drop glue.

Llamar a \`c.run()\` sobre un \`&dyn Check\` significa entonces: cargar el puntero a la vtable, cargar el slot de \`run\`, llamar a través de él. El costo es una indirección extra y — la parte que de verdad importa en un loop caliente — **la llamada no se puede inlinear**, porque el destino no se conoce hasta el runtime.

Para un registro de health checks invocado una vez por segundo, ese costo es inmedible y la flexibilidad lo vale todo. Para un comparador llamado un millón de veces dentro de un sort, es la diferencia que estabas buscando.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué `&dyn Check` mide dos palabras cuando `&Ping` mide una?",
      options: [
        "Lleva un puntero a los datos *y* un puntero a la vtable de ese tipo concreto",
        "Guarda los datos inline, así que el tamaño varía según el implementador",
        "Lleva un contador de referencias junto al puntero a los datos",
      ],
      answer: 0,
      explain:
        "Por esto no puedes convertir un `&dyn Trait` de vuelta a un `&T` gratis, y por esto `Box<dyn Trait>` sabe cómo ejecutar el destructor correcto: ambos hechos viven en la vtable.",
    },
    {
      kind: "fill",
      prompt: "Guarda dos tipos concretos distintos en una misma colección.",
      file: "main.rs",
      before: "let checks: Vec<",
      after: "> = vec![Box::new(Ping), Box::new(Disk)];",
      choices: ["Box<dyn Check>", "dyn Check", "Check"],
      answer: 0,
      explain:
        "`Vec<dyn Check>` no puede compilar: `Vec` necesita un elemento `Sized`, y `dyn Check` no tiene tamaño conocido en tiempo de compilación. El `Box` es lo que le da uno.",
    },
    {
      kind: "quiz",
      question:
        "El costo real del dispatch dinámico en un loop apretado normalmente no es la carga extra del puntero. ¿Cuál es?",
      options: [
        "La llamada no se puede inlinear, lo que además bloquea las optimizaciones que el inlining habría habilitado",
        "Cada llamada asigna una vtable nueva en el heap",
        "La búsqueda en la vtable requiere un lock, así que las llamadas concurrentes compiten",
      ],
      answer: 0,
      explain:
        "Las vtables son datos estáticos, creados una vez en tiempo de compilación — nunca por llamada. La barrera a la optimización es el costo honesto, y es fácil subestimarlo.",
    },
    {
      kind: "editor",
      intro: `### Un registro heterogéneo

1. Define \`trait Check { fn run(&self) -> String; }\`.
2. Define las unit structs \`Ping\` y \`Disk\` que lo implementen, devolviendo \`ping ok\` y \`disk ok\`.
3. Arma un \`Vec<Box<dyn Check>>\` con uno de cada, itéralo imprimiendo cada resultado, y luego imprime la cantidad.

Salida esperada:

\`\`\`text
ping ok
disk ok
count: 2
\`\`\``,
    },
  ],

  "rust-traits-generics-6": [
    {
      kind: "theory",
      body: `No todo trait puede convertirse en un \`dyn Trait\`. Un trait es **object safe** solo si cada método se puede llamar a través de una vtable — es decir, sin saber nada del tipo concreto salvo su dirección.

Dos reglas causan casi todos los fallos reales:

1. **Sin métodos genéricos.** \`fn build<T: Encode>(&self, v: T)\` necesitaría un slot en la vtable por cada \`T\` posible, y el conjunto es ilimitado.
2. **Sin \`Self\` en posición de retorno.** \`fn clone_me(&self) -> Self\` no puede funcionar: quien llama no tiene idea de qué es \`Self\` ni de cuánto mide.`,
    },
    {
      kind: "theory",
      body: `Los dos tienen el mismo arreglo: reemplazar el hueco de tiempo de compilación por uno de runtime.

\`\`\`rust
trait Sink { fn accept<T: Encode>(&self, v: T) -> String; }   // no es object safe
trait Sink { fn accept(&self, v: &dyn Encode) -> String; }    // object safe
\`\`\`

Cambiaste una indirección por la posibilidad de guardar un \`Box<dyn Sink>\` en absoluto — casi siempre el trade correcto, porque un trait que quieres como objeto es un trait que querías por su flexibilidad.

Cuando necesitas ambas cosas, el patrón estándar son dos traits: uno genérico para el camino rápido, y uno object safe implementado en blanket sobre él.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué un método genérico hace que un trait no sea object safe?",
      options: [
        "Una vtable es una tabla fija construida en tiempo de compilación, y un método genérico necesitaría un número ilimitado de slots",
        "Los métodos genéricos no pueden recibir `&self`",
        "El compilador podría soportarlo, pero lo prohíbe para mantener pequeñas las vtables",
      ],
      answer: 0,
      explain:
        "La vtable se construye por cada par (tipo, trait) cuando se crea el trait object. No puede saber qué instanciaciones va a necesitar quien llame en el futuro.",
    },
    {
      kind: "fill",
      prompt:
        "Haz el método object safe: recibe el valor como trait object en vez de como genérico.",
      file: "main.rs",
      before: "trait Sink {\n    fn accept(&self, value: ",
      after: ") -> String;\n}",
      choices: ["&dyn Encode", "impl Encode", "T"],
      answer: 0,
      explain:
        "`impl Encode` en posición de argumento es azúcar para un parámetro genérico, así que falla la object safety exactamente por la misma razón que el genérico explícito.",
    },
    {
      kind: "quiz",
      question:
        "`Clone` no es object safe. ¿Cuál de sus requisitos es el responsable?",
      options: [
        "`fn clone(&self) -> Self` devuelve `Self` por valor, y quien llama no puede saber el tamaño de ese tipo",
        "`Clone` lo implementan demasiados tipos como para que una vtable los enumere",
        "`clone` recibe `&self`, y los métodos object safe tienen que recibir `self`",
      ],
      answer: 0,
      explain:
        "Por esto un `Box<dyn Trait>` no se puede clonar sin más, y por esto los crates que lo esquivan definen un `fn clone_box(&self) -> Box<dyn Trait>` — un tipo de retorno con tamaño conocido.",
    },
    {
      kind: "editor",
      intro: `### Mantén el trait usable como objeto

1. Define \`trait Encode { fn encode(&self) -> String; }\`.
2. Define \`struct Num(i64)\` que lo implemente como el texto decimal del número.
3. Define \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — fíjate en el \`&dyn\`, que es lo que lo mantiene object safe.
4. Define la unit struct \`Log\` que implemente \`Sink\`, devolviendo \`"log:<encoded>"\`.
5. En \`main\`, guárdalo como \`Box<dyn Sink>\` y acepta un \`Num(42)\`.

Salida esperada:

\`\`\`text
log:42
\`\`\`

Si \`accept\` hubiera sido genérico, el paso 5 no compilaría.`,
    },
  ],

  "rust-traits-generics-7": [
    {
      kind: "theory",
      body: `Un **blanket impl** implementa un trait para todo tipo que satisfaga un bound, en un solo bloque:

\`\`\`rust
impl<T: Display> Loggable for T {
    fn log_line(&self) -> String {
        format!("[log] {}", self)
    }
}
\`\`\`

Ahora \`42.log_line()\` y \`"rpc down".log_line()\` funcionan, y también todo tipo que alguien escriba jamás que implemente \`Display\`.

La biblioteca estándar usa esto a fondo. \`ToString\` es un blanket impl sobre \`Display\`; \`Into<U>\` es un blanket impl sobre \`From<T>\`. Por eso implementar \`From\` te da \`Into\` gratis y nunca deberías implementar \`Into\` a mano.`,
    },
    {
      kind: "theory",
      body: `La **orphan rule** es el límite: puedes implementar un trait para un tipo solo si el trait es tuyo, o el tipo es tuyo. Ambos ajenos está prohibido.

\`\`\`rust
impl Display for Vec<u8> { ... }   // prohibido: los dos son de la std
\`\`\`

La razón es la coherencia. Si dos crates pudieran agregar ese impl cada uno, agregar una dependencia podría cambiar cuál se aplica — o volver ambiguo el programa y hacer que deje de compilar por razones que no están en ninguno de los dos crates.

La salida es el newtype: \`struct Bytes(Vec<u8>);\` es un tipo *tuyo*, así que puedes implementarle lo que quieras. No cuesta nada en runtime — una tuple struct de un solo campo tiene un layout idéntico al de su campo.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué no puedes hacer `impl Display for Vec<u8>` en tu propio crate?",
      options: [
        "La orphan rule: tanto el trait como el tipo son ajenos, así que dos crates podrían agregar impls en conflicto",
        "`Vec<u8>` ya implementa `Display` en la biblioteca estándar",
        "Los blanket impls de `std` reclaman todos los tipos por adelantado",
      ],
      answer: 0,
      explain:
        "La coherencia es una propiedad global. Sin la regla, que tu programa compile podría depender de una dependencia transitiva que nunca nombraste.",
    },
    {
      kind: "fill",
      prompt:
        "Implementa tu trait para todo tipo que ya se pueda mostrar.",
      file: "main.rs",
      before: "impl<T: Display> Loggable for ",
      after: " {",
      choices: ["T", "dyn Display", "Self"],
      answer: 0,
      explain:
        "`for T` con el bound en los genéricos del impl es la forma blanket. `for dyn Display` cubriría solo el trait object, no los tipos concretos.",
    },
    {
      kind: "quiz",
      question:
        "Necesitas `serde::Serialize` en un tipo de otro crate. ¿Cuál es la jugada estándar?",
      options: [
        "Envolverlo en un newtype tuyo e implementar el trait para ese",
        "Hacer un fork del otro crate y agregar el impl ahí",
        "Implementarlo igual — la orphan rule solo aplica a `std`",
      ],
      answer: 0,
      explain:
        "El newtype es gratis en runtime y local en alcance. (Serde además ofrece `#[serde(remote)]` exactamente para este caso, que genera por ti el código con forma de newtype.)",
    },
    {
      kind: "editor",
      intro: `### Un impl, todos los tipos Display

1. Define \`trait Loggable { fn log_line(&self) -> String; }\`.
2. Escribe un blanket \`impl<T: Display> Loggable for T\` que devuelva \`"[log] <value>"\`.
3. Llama a \`.log_line()\` sobre el entero \`42\` y sobre la string \`"rpc down"\` — dos tipos, cero impls extra.

Salida esperada:

\`\`\`text
[log] 42
[log] rpc down
\`\`\``,
    },
  ],
};
