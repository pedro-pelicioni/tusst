import type { LessonStep } from "@/content/steps";

// ES · Smart Pointers & Interior Mutability.
//
// Overlay for ../../steps/rust-smart-pointers.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustSmartPointersStepsEs: Record<string, LessonStep[]> = {
  "rust-smart-pointers-1": [
    {
      kind: "theory",
      body: `\`Box<T>\` es el smart pointer más simple: una asignación en la heap, un dueño, liberada cuando la box hace drop. No añade conteo de referencias ni chequeos en runtime.

Su uso definitorio es darle a un **tipo recursivo un tamaño conocido**:

\`\`\`rust
enum Expr {
    Num(i64),
    Add(Expr, Expr),        // error: recursive type has infinite size
}
\`\`\`

Para disponer \`Expr\` en memoria, el compilador tiene que saber cuánto ocupa \`Expr\` — lo que exige saber cuánto ocupa \`Expr\`. Una box rompe el bucle: siempre mide un puntero, apunte a lo que apunte.`,
    },
    {
      kind: "theory",
      body: `\`\`\`rust
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),   // bien — dos punteros
}
\`\`\`

Así se construye todo árbol, lista y AST en Rust, y es lo que \`Box<dyn Trait>\` también está haciendo: \`dyn Trait\` no tiene tamaño conocido, así que vive detrás de un puntero.

Hacer match a través de una box no necesita nada especial — \`match e { Expr::Add(a, b) => ... }\` te da \`&Box<Expr>\`, y la deref coercion significa que puedes pasarlo directo a una función que recibe \`&Expr\`.

El costo es una asignación por nodo y un salto de puntero por paso de recorrido. Para un AST eso no es nada. Para una estructura de datos caliente con millones de nodos, es la razón por la que existen los arena allocators.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué un enum recursivo necesita un `Box` alrededor de su propio tipo?",
      options: [
        "El compilador tiene que calcular un tamaño fijo para el tipo, y una variante anidada directamente hace que ese tamaño sea infinito",
        "En Rust la recursión solo se permite sobre datos asignados en la heap",
        "Sin `Box` el enum se copiaría en cada match",
      ],
      answer: 0,
      explain:
        "Un `Box` mide un puntero sin importar a qué apunte, así que el cálculo del tamaño termina. La asignación en la heap es una consecuencia, no el objetivo.",
    },
    {
      kind: "fill",
      prompt: "Haz representable la variante recursiva.",
      file: "main.rs",
      before: "enum Expr {\n    Num(i64),\n    Add(",
      after: ", Box<Expr>),\n}",
      choices: ["Box<Expr>", "Expr", "&Expr"],
      answer: 0,
      explain:
        "`&Expr` también mediría un puntero, pero toma prestado — el enum necesitaría un parámetro de lifetime y no podría ser dueño de sus hijos.",
    },
    {
      kind: "quiz",
      question:
        "¿Qué añade `Box<T>` sobre guardar un `T` directamente, aparte de la asignación en la heap?",
      options: [
        "Nada — sin conteo de referencias, sin chequeos de borrow en runtime, ownership único como siempre",
        "Ownership compartido, como un `Rc` ligero",
        "Mutabilidad interior, para poder modificar el valor a través de una referencia compartida",
      ],
      answer: 0,
      explain:
        "`Box` es el único smart pointer sin semántica extra. Por eso es el default correcto siempre que necesitas indirección y nada más.",
    },
    {
      kind: "editor",
      intro: `### Un árbol de expresiones

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`.
2. \`fn eval(e: &Expr) -> i64\` haciendo match sobre las dos variantes y recurriendo en \`Add\`.
3. En \`main\`, construye \`2 + (3 + 4)\` como árbol, imprime el valor evaluado y luego imprime el árbol con \`{:?}\`.

Salida esperada:

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

Fíjate en que el \`Debug\` de \`Box\` es transparente — imprime aquello a lo que apunta.`,
    },
  ],

  "rust-smart-pointers-2": [
    {
      kind: "theory",
      body: `\`Rc<T>\` es **ownership compartido con conteo de referencias**, para un solo thread. Cada \`Rc::clone\` incrementa un contador; cada drop lo decrementa. El valor se libera cuando el conteo llega a cero.

\`\`\`rust
let config = Rc::new(String::from("timeout=30s"));
let a = Rc::clone(&config);        // conteo: 2
let b = Rc::clone(&config);        // conteo: 3
drop(b);                           // conteo: 2
\`\`\`

\`Rc::clone(&x)\` es el patrón idiomático en lugar de \`x.clone()\`, y la razón es legibilidad: deja obvio en el call site que esto es un incremento barato de contador, no una copia profunda de los datos.`,
    },
    {
      kind: "theory",
      body: `Dos propiedades deciden cuándo \`Rc\` es la herramienta correcta.

**Es inmutable.** \`Rc<T>\` te da \`&T\` y nada más. Varios dueños, cada uno con \`&mut T\`, romperían la regla de aliasing, así que mutar exige combinarlo con \`RefCell\` — la próxima lección.

**No es \`Send\`.** El contador es un entero normal con incrementos no atómicos, así que dos threads clonando a la vez lo corromperían. El compilador lo rechaza en tiempo de compilación, y por eso la versión multithread, \`Arc\`, existe como tipo separado: pagas el contador atómico solo cuando de verdad compartes entre threads.

Usa \`Rc\` para un grafo o árbol donde los nodos tienen varios padres, o para configuración compartida por muchos dueños en un solo thread. Recurre a él *después* de intentar borrows simples — un \`&T\` no cuesta nada y normalmente basta.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué se prefiere `Rc::clone(&x)` sobre `x.clone()` si los dos compilan a lo mismo?",
      options: [
        "Hace que el call site diga 'esto es un incremento de contador', no 'esto copia los datos a fondo'",
        "`x.clone()` hace una copia profunda del valor interno",
        "`x.clone()` no incrementa el conteo de referencias",
      ],
      answer: 0,
      explain:
        "Es pura convención de legibilidad, y una valiosa: `clone()` sobre una struct grande normalmente significa una asignación, así que distinguir el caso barato de un vistazo vale los caracteres extra.",
    },
    {
      kind: "fill",
      prompt: "Lee cuántos dueños sostienen el valor ahora mismo.",
      file: "main.rs",
      before: 'println!("count: {}", Rc::',
      after: "(&config));",
      choices: ["strong_count", "len", "count"],
      answer: 0,
      explain:
        "`strong_count` es el conteo de dueños. Su contraparte `weak_count` rastrea handles `Weak` que no son dueños y no mantienen el valor vivo.",
    },
    {
      kind: "quiz",
      question: "¿Por qué `Rc<T>` deliberadamente no es `Send`?",
      options: [
        "Su contador usa incrementos no atómicos, así que dos threads clonando a la vez lo corromperían",
        "El valor al que apunta siempre está asignado en la heap, y la heap es local al thread",
        "Sí es `Send`, pero solo cuando `T: Sync`",
      ],
      answer: 0,
      explain:
        "Es una separación deliberada y no un descuido: el código de un solo thread no debería pagar por atomics. `Arc` es el mismo tipo con un contador atómico.",
    },
    {
      kind: "editor",
      intro: `### Cuenta los dueños

1. Envuelve una \`String\` con \`timeout=30s\` en un \`Rc\` e imprime \`Rc::strong_count\`.
2. Haz dos clones con \`Rc::clone\`, imprime el conteo otra vez e imprime el valor a través de uno de ellos.
3. Haz \`drop\` de un clon e imprime el conteo una vez más.

Salida esperada:

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\``,
    },
  ],

  "rust-smart-pointers-3": [
    {
      kind: "theory",
      body: `\`RefCell<T>\` mueve el chequeo de borrow de **tiempo de compilación a runtime**. La regla no cambia — muchos borrows compartidos o un borrow exclusivo — pero ahora se cuenta en runtime, y violarla hace **panic** en lugar de fallar al compilar.

\`\`\`rust
let cell = RefCell::new(Vec::new());
cell.borrow_mut().push("started");    // &mut, liberado al final de la sentencia
println!("{}", cell.borrow().len());  // & — bien, el borrow mut ya no está
\`\`\`

Esto es **mutabilidad interior**: mutar a través de un \`&self\`. Es lo que permite que \`Rc<RefCell<T>>\` le dé a varios dueños la capacidad de escribir.`,
    },
    {
      kind: "theory",
      body: `El panic es el precio, y es real — un colapso en runtime a cambio de un patrón que el compilador no podía verificar. Dos hábitos lo mantienen manejable.

**Mantén los guards de vida corta.** \`cell.borrow_mut().push(x)\` libera al final de la sentencia. \`let g = cell.borrow_mut();\` retiene hasta el final del scope, y cualquier \`borrow()\` en medio hace panic. Es la misma trampa de \`Drop\` contra NLL que con \`MutexGuard\`.

**Usa \`try_borrow_mut\` cuando un conflicto sea plausible.** Devuelve un \`Result\` en lugar de hacer panic, lo que convierte un colapso en una decisión.

\`\`\`rust
let held = log.borrow();
log.try_borrow_mut().is_ok()    // false — hay un borrow compartido pendiente
\`\`\`

\`Cell<T>\` es el hermano más barato para tipos \`Copy\`: \`get\`/\`set\` sin rastreo de borrows y sin posibilidad de panic, porque nunca entrega una referencia.`,
    },
    {
      kind: "quiz",
      question:
        "¿Qué cambia `RefCell` respecto a las reglas normales de borrow?",
      options: [
        "Nada en las reglas — solo *cuándo* se chequean, moviéndolo de tiempo de compilación a runtime, donde una violación hace panic",
        "Permite varios borrows mutables simultáneos",
        "Hace que el valor sea seguro de compartir entre threads",
      ],
      answer: 0,
      explain:
        "La última opción es una confusión común y peligrosa: `RefCell` es `!Sync`, así que no puede compartirse entre threads en absoluto. `Mutex` es su contraparte multithread.",
    },
    {
      kind: "fill",
      prompt:
        "Intenta un borrow exclusivo sin arriesgar un panic si ya hay uno pendiente.",
      file: "main.rs",
      before: "log.",
      after: "().is_ok()",
      choices: ["try_borrow_mut", "borrow_mut", "get_mut"],
      answer: 0,
      explain:
        "`borrow_mut` hace panic ante el conflicto. `get_mut` recibe `&mut self`, así que necesita acceso exclusivo al propio `RefCell` — exactamente lo que no tienes cuando está dentro de un `Rc`.",
    },
    {
      kind: "quiz",
      question:
        "Un servicio hace panic de forma intermitente con 'already borrowed: BorrowMutError'. ¿Cuál es la causa habitual?",
      options: [
        "Un guard `Ref` se está reteniendo a través de una llamada que vuelve a tomar prestado — el guard vive hasta el final del scope, no hasta el último uso",
        "Dos threads están tomando prestado el `RefCell` a la vez",
        "El `RefCell` se creó antes que el `Rc` que lo contiene",
      ],
      answer: 0,
      explain:
        "No pueden ser threads: `RefCell` es `!Sync`, así que el compilador ya lo impidió. Casi siempre es un guard retenido más tiempo del previsto — acótalo con un bloque, o clona el valor hacia afuera.",
    },
    {
      kind: "editor",
      intro: `### Borrow chequeado en runtime

1. Construye un \`Rc<RefCell<Vec<String>>>\` con un vector vacío.
2. A través de un **clon** del \`Rc\`, haz push de \`started\` y luego de \`ready\` — cada uno en su propia sentencia, para que el guard se libere cada vez.
3. Imprime la longitud y luego la primera entrada.
4. Retén un borrow compartido en un binding, imprime si \`try_borrow_mut()\` tiene éxito, luego haz \`drop\` del binding e imprímelo otra vez.

Salida esperada:

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\``,
    },
  ],

  "rust-smart-pointers-4": [
    {
      kind: "theory",
      body: `El conteo de referencias tiene una falla clásica: el **ciclo**. Si A es dueño de B y B es dueño de A, ningún conteo llega nunca a cero y la memoria nunca se libera. Rust no lo impide — es una fuga, no unsoundness, y el borrow checker no tiene nada que decir al respecto.

La forma estándar donde aparece es un árbol con enlaces al padre:

\`\`\`rust
root.children  ->  Rc<Node>   (fuerte)
leaf.parent    ->  Rc<Node>   (fuerte)  // ciclo: nunca se libera nada
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`Weak<T>\` lo rompe. Un handle débil **no** es dueño del valor y no lo mantiene vivo:

\`\`\`rust
parent: RefCell<Weak<Node>>          // Rc::downgrade(&root)
children: RefCell<Vec<Rc<Node>>>     // fuerte, como antes
\`\`\`

Como un \`Weak\` puede apuntar a algo ya liberado, no puedes leer a través de él directamente. \`upgrade()\` devuelve \`Option<Rc<T>>\` — \`Some\` si el valor sigue vivo, \`None\` si ya no está. Ese \`Option\` es toda la historia de seguridad.

La regla para llevarte: **el ownership baja, las referencias suben.** Los padres son dueños fuertes de los hijos; los hijos apuntan de vuelta débilmente. Lo mismo aplica a listas de observers y caches — el cache guarda \`Weak\`, así que cachear algo nunca lo mantiene vivo por sí solo.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `Weak::upgrade()` devuelve `Option<Rc<T>>` y no `Rc<T>`?",
      options: [
        "El valor puede haber sido dropeado ya — un handle débil no lo mantiene vivo, así que puede haber desaparecido",
        "El upgrade puede fallar si el conteo fuerte está en su máximo",
        "Devuelve `None` mientras otro thread sostiene el valor",
      ],
      answer: 0,
      explain:
        "Ese `Option` es el punto entero de `Weak`: convierte 'aquello a lo que apunto puede haber desaparecido' en un valor que estás obligado a manejar, en lugar de un puntero colgante.",
    },
    {
      kind: "fill",
      prompt: "Crea un handle no dueño de vuelta al padre.",
      file: "main.rs",
      before: "parent: RefCell::new(Rc::",
      after: "(&root)),",
      choices: ["downgrade", "clone", "new"],
      answer: 0,
      explain:
        "`Rc::downgrade` produce un `Weak` e incrementa solo el conteo débil. `Rc::clone` incrementaría el conteo fuerte y recrearía el ciclo.",
    },
    {
      kind: "quiz",
      question:
        "Un cache guarda `Rc<Entry>` y la memoria crece sin límite incluso después de que todos los usuarios terminaron. ¿Cuál es el arreglo?",
      options: [
        "Guardar `Weak<Entry>` en el cache, para que cachear una entrada no la mantenga viva por sí solo",
        "Llamar `drop` sobre el cache periódicamente",
        "Reemplazar `Rc` por `Box`, que libera de forma determinista",
      ],
      answer: 0,
      explain:
        "Un cache que guarda referencias fuertes no es un cache, es una fuga con tabla de búsqueda. `Weak` deja que las entradas mueran cuando sus dueños reales terminan, y `upgrade()` te dice cuándo pasó.",
    },
    {
      kind: "editor",
      intro: `### El ownership baja, las referencias suben

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`.
2. Construye un \`root\` con un padre \`Weak::new()\` vacío, y luego un \`leaf\` cuyo padre es \`Rc::downgrade(&root)\`.
3. Haz push de un clon de \`leaf\` en los hijos de \`root\`.
4. Imprime el conteo fuerte de \`root\`, luego su conteo débil.
5. Haz \`upgrade()\` del padre del leaf e imprime el nombre del padre con \`{:?}\`, mapeando a una \`String\` clonada.

Salida esperada:

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

El conteo fuerte de root se queda en 1 — eso es el ciclo no formándose.`,
    },
  ],

  "rust-smart-pointers-5": [
    {
      kind: "theory",
      body: `\`Cow<'a, T>\` — clone on write — es un enum con dos variantes:

\`\`\`rust
enum Cow<'a, T> {
    Borrowed(&'a T),
    Owned(T::Owned),
}
\`\`\`

Le permite a una función devolver datos prestados en el camino común y datos propios solo cuando de verdad tuvo que cambiar algo:

\`\`\`rust
fn sanitize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))   // asignado: lo cambiamos
    } else {
        Cow::Borrowed(input)                  // gratis: nada que hacer
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `A quien llama no le importa qué variante recibió — \`Cow<str>\` hace deref a \`&str\`, así que se lee como una string de cualquier forma.

La ganancia aparece cuando el camino que modifica es raro. Sanitizar un millón de identificadores de los cuales doce contienen un espacio hace doce asignaciones, donde devolver \`String\` incondicionalmente haría un millón.

Su hogar más común es el borde del parsing: decodificar el percent-encoding de una URL, desescapar un header, normalizar un valor de config. Cuando la entrada ya está bien — que es lo habitual — no se copia nada.

Dos notas menores. \`.into_owned()\` fuerza la forma propia cuando necesitas guardarlo. Y si el camino que modifica es el común, suelta el \`Cow\`: estás pagando un discriminante de enum y un branch para evitar una asignación que casi siempre ocurre.`,
    },
    {
      kind: "quiz",
      question: "¿Cuándo compensa `Cow` de verdad?",
      options: [
        "Cuando el camino que modifica es raro, así que la mayoría de las llamadas devuelven un borrow y no asignan nada",
        "Siempre — es estrictamente más barato que devolver `String`",
        "Cuando la entrada es grande, sin importar con qué frecuencia se modifica",
      ],
      answer: 0,
      explain:
        "Si cada llamada modifica, `Cow` añade un discriminante y un branch y luego asigna de todos modos. Es una apuesta al caso común, y una mala apuesta cuesta un poco.",
    },
    {
      kind: "fill",
      prompt: "Devuelve la entrada intacta, sin asignar.",
      file: "main.rs",
      before: "        Cow::",
      after: "(input)",
      choices: ["Borrowed", "Owned", "From"],
      answer: 0,
      explain:
        "`Cow::Owned(input.to_string())` compilaría y sería correcto — y asignaría exactamente en el camino que este tipo entero existe para mantener gratis.",
    },
    {
      kind: "quiz",
      question:
        "Quien llama necesita guardar el resultado de una función que devuelve `Cow` en una struct de vida larga. ¿Qué tiene que pasar?",
      options: [
        "Llamar `.into_owned()` — la variante prestada está atada al lifetime de la entrada y no puede guardarse",
        "Nada; `Cow` es `'static` por construcción",
        "Envolverlo en un `Rc` para extender su lifetime",
      ],
      answer: 0,
      explain:
        "Este es el momento en que la asignación diferida por fin se paga, y pagarla aquí es correcto: el valor ahora se está reteniendo en lugar de usarse y descartarse.",
    },
    {
      kind: "editor",
      intro: `### Asigna solo cuando toca

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — si la entrada contiene un espacio, devuelve \`Cow::Owned\` con los espacios reemplazados por \`_\`; si no, devuelve \`Cow::Borrowed\`.
2. Llámala con \`"get_events"\` y con \`"get events now"\`.
3. Para cada una, imprime el valor y si es la variante prestada, usando \`matches!(&value, Cow::Borrowed(_))\` calculado antes en su propio binding.

Salida esperada:

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\``,
    },
  ],

  "rust-smart-pointers-6": [
    {
      kind: "theory",
      body: `\`Deref\` es lo que hace que un smart pointer se sienta como aquello que envuelve. Implementarlo te da dos cosas a la vez:

- el operador \`*\`
- **deref coercion** — \`&Wrapper<T>\` se acepta donde se espera \`&T\`, y \`wrapper.method()\` encuentra los métodos de \`T\`

\`\`\`rust
impl<T> Deref for Tracked<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.inner }
}
\`\`\`

Así es exactamente como funcionan \`Box\`, \`Rc\`, \`Arc\`, \`String\` (a \`str\`) y \`Vec\` (a \`[T]\`). No hay magia de compilador en ninguno de ellos.`,
    },
    {
      kind: "theory",
      body: `La resolución de métodos busca **primero** en el tipo mismo, y luego sigue \`Deref\` hacia afuera. Así que un método inherente del wrapper oculta un método del mismo nombre en el target — por eso \`Rc\` usa funciones asociadas (\`Rc::clone(&x)\`, \`Rc::strong_count(&x)\`) en lugar de métodos: no deben ocultar nada de \`T\`.

La guía de la biblioteca estándar es estrecha y vale la pena respetarla: **implementa \`Deref\` solo para smart pointers.** Usarlo para simular herencia — un \`Dog\` que hace deref a un \`Animal\` — produce una resolución de métodos sorprendente y mensajes de error que apuntan al tipo equivocado.

\`DerefMut\` es lo mismo para \`&mut\`, y requiere \`Deref\`. Fíjate en que \`deref\` es una llamada a método real: meterle trabajo, como hace el ejercicio, significa que corre en cada coerción implícita.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `Rc` expone `Rc::strong_count(&x)` como función asociada y no como método?",
      options: [
        "Un método ocultaría cualquier método del mismo nombre en el tipo envuelto, ya que los métodos propios del wrapper se encuentran primero",
        "Las funciones asociadas son más rápidas que los métodos",
        "No se pueden llamar métodos sobre tipos que implementan `Deref`",
      ],
      answer: 0,
      explain:
        "La convención `Rc::clone(&x)` tiene este mismo segundo motivo además de la legibilidad: como función asociada, nunca puede ocultar `T::clone` por accidente.",
    },
    {
      kind: "fill",
      prompt: "Nombra el tipo al que este wrapper desreferencia.",
      file: "main.rs",
      before: "impl<T> Deref for Tracked<T> {\n    type ",
      after: " = T;",
      choices: ["Target", "Item", "Output"],
      answer: 0,
      explain:
        "`Target` es el tipo asociado de `Deref`. `Item` pertenece a `Iterator` y `Output` a los traits de operadores como `Add`.",
    },
    {
      kind: "quiz",
      question:
        "¿Por qué implementar `Deref` para modelar herencia se considera un antipatrón?",
      options: [
        "La resolución de métodos busca en el target en silencio, así que las llamadas y los mensajes de error apuntan a un tipo que el lector nunca nombró",
        "Es un error de compilación fuera de la biblioteca estándar",
        "`Deref` solo puede implementarse para tipos que guardan un puntero",
      ],
      answer: 0,
      explain:
        "Compila perfectamente. El costo es legibilidad: un lector no puede saber de qué tipo vino un método, y el mensaje de error tampoco cuando algo sale mal.",
    },
    {
      kind: "editor",
      intro: `### Construye un smart pointer

1. \`struct Tracked<T> { inner: T, reads: Cell<u32> }\` con \`fn new(inner: T) -> Self\` y \`fn reads(&self) -> u32\`.
2. \`impl<T> Deref for Tracked<T>\` con \`type Target = T\`, incrementando \`reads\` antes de devolver \`&self.inner\`.
3. \`impl<T> DerefMut for Tracked<T>\` devolviendo \`&mut self.inner\` (sin contar).
4. En \`main\`, envuelve \`vec![1, 2, 3]\`, imprime \`.len()\` a través de la coerción, haz \`push(4)\` a través de \`DerefMut\`, imprime \`*v\` con \`{:?}\`, y luego imprime el conteo de lecturas.

Salida esperada:

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

Dos lecturas: \`.len()\` y \`*v\`. \`push\` pasa por \`deref_mut\`, y \`reads()\` es inherente, así que nunca coerciona.`,
    },
  ],
};
