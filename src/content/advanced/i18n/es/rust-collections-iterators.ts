import type { LessonStep } from "@/content/steps";

// ES · Collections, Iterators & Closures.
//
// Overlay for ../../steps/rust-collections-iterators.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustCollectionsIteratorsStepsEs: Record<string, LessonStep[]> = {
  "rust-collections-iterators-1": [
    {
      kind: "theory",
      body: `\`Vec<T>\` es un array contiguo que crece. Vale la pena conocer sus costos con exactitud:

| operación | costo |
| --- | --- |
| \`push\` / \`pop\` al final | O(1) amortizado |
| \`insert\` / \`remove\` al frente | O(n) — todo se desplaza |
| índice | O(1) |

"Amortizado" cubre el crecimiento: cuando el buffer se llena, \`Vec\` asigna uno más grande (típicamente el doble) y copia todo. Promediado sobre muchos pushes eso es O(1), pero cualquier push *individual* puede ser el caro.`,
    },
    {
      kind: "theory",
      body: `Dos consecuencias sobre las que puedes actuar.

**Si sabes el tamaño, dilo.** \`Vec::with_capacity(n)\` asigna una sola vez. En un loop que hace push de un número conocido de elementos, esto elimina toda reasignación y toda copia — la ganancia de performance más barata del lenguaje.

**Si haces push y pop por los dos extremos, usa \`VecDeque<T>\`.** Es un ring buffer: \`push_front\` y \`pop_front\` son O(1), donde \`Vec::insert(0, x)\` es O(n). Esa es la diferencia entre una cola que escala y una que silenciosamente se vuelve cuadrática.

\`\`\`rust
let mut q: VecDeque<i32> = VecDeque::new();
q.push_back(2);
q.push_front(1);     // O(1) — un Vec desplazaría cada elemento
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "Un loop hace push de exactamente 10 000 elementos conocidos en un `Vec::new()`. ¿Qué ahorra `with_capacity(10_000)`?",
      options: [
        "Cerca de una docena de reasignaciones, cada una copiando todo lo que ya se había pusheado",
        "Nada — `Vec` ya asigna su tamaño final en el primer push",
        "La comprobación de límites en cada push",
      ],
      answer: 0,
      explain:
        "Duplicar de 4 a 10 000 son unos once pasos de crecimiento, y los últimos copian miles de elementos cada uno. Una sola asignación por adelantado elimina todo eso.",
    },
    {
      kind: "fill",
      prompt: "Agrega al frente de una cola en tiempo constante.",
      file: "main.rs",
      before: "let mut q: VecDeque<i32> = VecDeque::new();\nq.",
      after: "(1);",
      choices: ["push_front", "insert", "push"],
      answer: 0,
      explain:
        "`VecDeque` es un ring buffer, así que insertar al frente es mover un puntero. La misma operación en un `Vec` desplaza cada elemento.",
    },
    {
      kind: "quiz",
      question:
        "Una cola de jobs hace `jobs.remove(0)` en un `Vec` en cada tick, con miles de jobs. ¿Cuál es el síntoma?",
      options: [
        "El throughput se degrada con la profundidad de la cola — cada pop desplaza todos los elementos restantes",
        "La memoria crece sin límite porque `remove` nunca libera",
        "Nada medible; `remove(0)` está optimizado a un avance de puntero",
      ],
      answer: 0,
      explain:
        "La clásica cola cuadrática. Es invisible en un test con diez jobs y domina el profile con diez mil — reemplaza el `Vec` por un `VecDeque` y desaparece.",
    },
    {
      kind: "editor",
      intro: `### Contenedor correcto, costo correcto

1. Construye un \`Vec<i32>\` con \`Vec::with_capacity(4)\`, haz push de \`1..=4\`, e imprime el vector con \`{:?}\` y su \`capacity()\` — debería seguir siendo exactamente 4.
2. Construye un \`VecDeque<i32>\`, \`push_back\` de \`2\` y luego \`3\`, \`push_front\` de \`1\`, imprímelo con \`{:?}\`, y después imprime \`pop_front()\` con \`{:?}\`.

Salida esperada:

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\``,
    },
  ],

  "rust-collections-iterators-2": [
    {
      kind: "theory",
      body: `Los dos mapas difieren en un eje que decide todo lo demás: el **orden**.

\`HashMap<K, V>\` — búsqueda, inserción y eliminación O(1) en promedio. El orden de iteración es **arbitrario y deliberadamente aleatorizado** entre ejecuciones. Requiere \`K: Hash + Eq\`.

\`BTreeMap<K, V>\` — O(log n) para las mismas operaciones. La iteración va **siempre en orden de clave**, y soporta consultas por rango: \`map.range("a".."m")\`. Requiere \`K: Ord\`.`,
    },
    {
      kind: "theory",
      body: `Elige \`BTreeMap\` cuando necesites iteración ordenada, barridos por rango o salida determinista (un dump de config, un snapshot de test, un payload firmado). Elige \`HashMap\` en el resto de los casos — es más rápido y es el default correcto.

La API \`entry\` es el patrón idiomático que vale la pena memorizar para cualquiera de los dos:

\`\`\`rust
*hits.entry(method).or_insert(0) += 1;
\`\`\`

Una búsqueda, no dos. La versión ingenua — \`if map.contains_key(k) { ... } else { ... }\` — hashea la clave dos veces y toma prestado el mapa dos veces, cosa que el borrow checker también va a objetar. \`or_insert_with(Vec::new)\` es el mismo patrón cuando el valor por defecto no es gratis de construir.`,
    },
    {
      kind: "quiz",
      question:
        "Dos `HashMap`s con entradas idénticas pueden iterar en órdenes distintos, y el mismo programa puede variar entre ejecuciones. ¿Por qué es deliberado?",
      options: [
        "El hashing aleatorizado defiende contra ataques de colisión, y el orden inestable impide que el código dependa de un accidente",
        "Es un bug de la biblioteca estándar que se mantiene por compatibilidad",
        "El orden depende de cuánta memoria hay libre en ese momento",
      ],
      answer: 0,
      explain:
        "Las dos mitades son el punto: un hash predecible le permite a un atacante forzar todas las claves a un mismo bucket, y el código que depende sin querer del orden de iteración se rompe en cualquier redimensionamiento.",
    },
    {
      kind: "fill",
      prompt: "Incrementa un contador, creándolo en cero la primera vez que aparece.",
      file: "main.rs",
      before: "*hits.",
      after: "(m).or_insert(0) += 1;",
      choices: ["entry", "get", "insert"],
      answer: 0,
      explain:
        "`entry` hashea una vez y te devuelve un slot que puedes rellenar o modificar. `get` seguido de `insert` hashea dos veces y necesita dos borrows separados.",
    },
    {
      kind: "quiz",
      question:
        "Un servicio vuelca su config como JSON, y el diff entre dos ejecuciones sale ruidoso aunque la config no cambió. ¿Cuál es la causa probable?",
      options: [
        "Está serializando desde un `HashMap`, cuyo orden de iteración varía por ejecución — un `BTreeMap` haría la salida determinista",
        "El serializador de JSON no es determinista",
        "La config se está leyendo antes de terminar de cargarse",
      ],
      answer: 0,
      explain:
        "La salida determinista es la razón estándar para pagar el O(log n) de `BTreeMap`. Lo mismo aplica a cualquier cosa que se hashee o se firme, donde la estabilidad byte a byte es obligatoria.",
    },
    {
      kind: "editor",
      intro: `### Orden o velocidad

1. Con un \`HashMap<&str, u32>\`, cuenta las ocurrencias en \`["getEvents", "sendTx", "getEvents"]\` usando la API \`entry\`, y luego imprime el conteo de \`getEvents\`.
2. Con un \`BTreeMap<&str, u32>\`, inserta \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` en ese orden, luego recoge sus claves en un \`Vec<&str>\` e imprímelas — ordenadas, sin importar el orden de inserción.

Salida esperada:

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-3": [
    {
      kind: "theory",
      body: `Tres formas de iterar, y la diferencia está en lo que cada una te entrega:

| método | produce | colección después |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | intacta |
| \`.iter_mut()\` | \`&mut T\` | mutada en el lugar |
| \`.into_iter()\` | \`T\` | **consumida** |

\`\`\`rust
let doubled: Vec<i32> = data.iter().map(|n| n * 2).collect();  // data sobrevive
for n in data.iter_mut() { *n += 10; }                          // data cambia
let owned: Vec<String> = data.into_iter().map(...).collect();   // data ya no existe
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`for x in &collection\` es azúcar para \`.iter()\`, \`for x in &mut collection\` para \`.iter_mut()\`, y \`for x in collection\` para \`.into_iter()\`.

Esa última es la que sorprende a la gente: escribir \`for item in items\` **mueve** \`items\`, y la siguiente línea que lo use no va a compilar. El arreglo casi siempre es un solo \`&\`.

Elige \`into_iter\` a propósito, no por accidente. Cuando estás transformando datos propios en otros datos propios y no vas a necesitar el original — mapeando \`Vec<Row>\` a \`Vec<Response>\` — es exactamente lo correcto, y evita clonar cada elemento.`,
    },
    {
      kind: "quiz",
      question:
        "`for item in items { ... }` compila, pero la siguiente línea que usa `items` no. ¿Por qué?",
      options: [
        "El loop se desazucara a `into_iter()`, que consumió la colección",
        "El loop tomó prestado `items` y el borrow dura hasta el final de la función",
        "`items` tiene que declararse `mut` para poder leerse después de un loop",
      ],
      answer: 0,
      explain:
        "Un solo carácter lo arregla: `for item in &items`. Vale la pena internalizarlo, porque el mensaje de error apunta a la segunda línea y la causa está en la primera.",
    },
    {
      kind: "fill",
      prompt: "Modifica cada elemento del vector en el lugar.",
      file: "main.rs",
      before: "for n in data.",
      after: "() {\n    *n += 10;\n}",
      choices: ["iter_mut", "iter", "into_iter"],
      answer: 0,
      explain:
        "`iter_mut` produce `&mut i32`, así que `*n += 10` escribe a través de él. `iter` produciría `&i32`, al que no se le puede asignar.",
    },
    {
      kind: "quiz",
      question:
        "Estás convirtiendo un `Vec<Row>` en un `Vec<Response>` y no vas a necesitar las filas de nuevo. ¿Cuál es la opción correcta?",
      options: [
        "`into_iter()` — mueve cada fila dentro de la closure de mapeo, sin un clone por elemento",
        "`iter()` más `.clone()` dentro de la closure, para dejar el original intacto",
        "`iter_mut()`, mutando cada fila hasta convertirla en una respuesta",
      ],
      answer: 0,
      explain:
        "Aquí es donde `into_iter` se gana su lugar. Recurrir a `iter().cloned()` por costumbre asigna una vez por elemento para datos que estabas a punto de dropear.",
    },
    {
      kind: "editor",
      intro: `### Tomar prestado, mutar, consumir

Con \`let mut data = vec![1, 2, 3];\`:

1. \`.iter()\` y \`map\` para duplicar cada uno en un nuevo \`Vec<i32>\`, imprímelo — \`data\` sobrevive.
2. \`.iter_mut()\` para sumar \`10\` a cada uno en el lugar, imprime \`data\`.
3. \`.into_iter()\` y \`map\` para convertir cada uno en una \`String\`, recoge en un \`Vec<String>\`, imprímelo.

Salida esperada:

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-4": [
    {
      kind: "theory",
      body: `Los adapters de iteradores son **lazy**. \`map\`, \`filter\` y \`filter_map\` construyen un iterador nuevo y no ejecutan nada:

\`\`\`rust
let lazy = raw.iter().map(|s| s.len());   // cero elementos procesados
\`\`\`

El trabajo empieza solo cuando algo *consume* el iterador: \`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`. Hasta entonces estás armando un pipeline, no ejecutándolo.`,
    },
    {
      kind: "theory",
      body: `La laziness es lo que hace que encadenar salga gratis. \`filter\` y luego \`map\` **no** construye un \`Vec\` intermedio — cada elemento fluye por toda la cadena de uno en uno, y el compilador normalmente lo colapsa en un solo loop sin asignación.

También permite el cortocircuito: \`.find(...)\` sobre una cadena de un millón de elementos se detiene en la primera coincidencia, y los elementos posteriores nunca se tocan.

\`filter_map\` merece mención aparte. Mapea y filtra en una sola pasada, quedándose solo con los \`Some\`:

\`\`\`rust
.filter_map(|s| s.parse::<i64>().ok())    // parsea, descarta las fallas
\`\`\`

Esa es la forma idiomática de parsear un batch donde algunas entradas son basura — y descarta el motivo, así que usa \`.map(...).collect::<Result<Vec<_>, _>>()\` en su lugar cuando una falla deba abortar el batch.`,
    },
    {
      kind: "quiz",
      question:
        "`raw.iter().map(expensive).filter(pred)` se asigna a una variable y nunca se consume. ¿Cuántas veces corre `expensive`?",
      options: [
        "Cero — los adapters construyen un pipeline y nada se ejecuta hasta que un consumidor pide elementos",
        "Una vez por elemento, cuando se construye la cadena",
        "Una vez, sobre el primer elemento, para inferir los tipos",
      ],
      answer: 0,
      explain:
        "Por eso también `Iterator` lleva `#[must_use]`: una cadena sin consumir es casi siempre un bug, y el compilador lo advierte.",
    },
    {
      kind: "fill",
      prompt: "Parsea cada entrada y descarta silenciosamente las que fallan.",
      file: "main.rs",
      before: "raw.iter().",
      after: "(|s| s.parse::<i64>().ok())",
      choices: ["filter_map", "map", "filter"],
      answer: 0,
      explain:
        "`filter_map` se queda con los `Some` y descarta los `None` en una sola pasada. `map` solo te dejaría con un `Vec<Option<i64>>`.",
    },
    {
      kind: "quiz",
      question:
        "¿Cuándo es `filter_map(|x| f(x).ok())` la elección equivocada para parsear un batch?",
      options: [
        "Cuando una sola entrada mala debería hacer fallar el batch entero — descarta el error junto con el elemento",
        "Cuando el batch es grande, porque `filter_map` asigna por elemento",
        "Cuando la closure captura una variable del scope externo",
      ],
      answer: 0,
      explain:
        "Descartar entradas malformadas en silencio es una decisión real, y muchas veces la equivocada para datos financieros. `.collect::<Result<Vec<_>, _>>()` hace fallar el batch en el primer error.",
    },
    {
      kind: "editor",
      intro: `### Nada corre hasta que lo pidas

Con \`let raw = vec!["12", "x", "30", "", "8"];\`:

1. Encadena \`.iter()\`, \`filter_map\` parseando cada uno como \`i64\` y quedándote con los que tuvieron éxito, y luego \`filter\` quedándote solo con los valores \`>= 10\`. Recoge en un \`Vec<i64>\` e imprímelo.
2. Construye una segunda cadena mapeando cada entrada a su \`.len()\` y lígala a una variable **sin** consumirla. Imprime \`nothing ran yet\`, luego recógela en un \`Vec<usize>\` e imprime eso.

Salida esperada:

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\``,
    },
  ],

  "rust-collections-iterators-5": [
    {
      kind: "theory",
      body: `\`fold\` lleva un acumulador a través de toda la secuencia. Es el consumidor más general que existe — \`sum\`, \`count\`, \`max\` y \`collect\` son todos folds por debajo.

\`\`\`rust
let total = latencies.iter().fold(0u64, |acc, n| acc + n);
\`\`\`

Tres partes: el valor inicial, el acumulador, el elemento actual. La closure devuelve el siguiente acumulador.

\`reduce\` es \`fold\` sin valor inicial — usa el primer elemento en su lugar, y por eso devuelve \`Option\`, porque una secuencia vacía no tiene respuesta:

\`\`\`rust
let worst = latencies.iter().copied().reduce(u64::max);   // Option<u64>
\`\`\``,
    },
    {
      kind: "theory",
      body: `El acumulador no tiene por qué ser un número. Construir una \`String\` es un fold cuyo acumulador es la string que se está construyendo:

\`\`\`rust
.fold(String::new(), |mut acc, n| {
    if !acc.is_empty() { acc.push('|'); }
    acc.push_str(&n.to_string());
    acc
})
\`\`\`

Fíjate en \`|mut acc, ...|\` y en que se devuelve \`acc\` — el acumulador se *mueve* a través de cada paso, que es lo que mantiene esto libre de asignaciones por iteración.

No lo fuerces. Si un \`for\` simple con una local mutable queda más claro, escribe eso: el compilador produce el mismo código, y la versión en fold de un cuerpo complejo es genuinamente más difícil de leer.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué `reduce` devuelve `Option<T>` y `fold` no?",
      options: [
        "Toma su valor inicial del primer elemento, así que una secuencia vacía no tiene resultado que dar",
        "Puede fallar si la closure hace panic",
        "Es lazy, y el `Option` señala si ya se consumió",
      ],
      answer: 0,
      explain:
        "`fold` siempre tiene respuesta porque tú proporcionaste la identidad. `reduce` sobre un iterador vacío es genuinamente indefinido, y el `Option` lo dice.",
    },
    {
      kind: "fill",
      prompt: "Lleva un total acumulado a través de la secuencia desde un cero explícito.",
      file: "main.rs",
      before: "latencies.iter().",
      after: "(0u64, |acc, n| acc + n)",
      choices: ["fold", "reduce", "scan"],
      answer: 0,
      explain:
        "`reduce` no recibe valor inicial. `scan` es la variante que produce *cada* acumulador intermedio en lugar de solo el último.",
    },
    {
      kind: "quiz",
      question:
        "¿Cuál de estas es la razón honesta para preferir un loop `for` a un `fold`?",
      options: [
        "El cuerpo es lo bastante complejo como para que el fold se lea peor — el código generado es el mismo de cualquier forma",
        "`fold` asigna una closure en el heap por cada llamada",
        "Los loops `for` son más rápidos porque evitan el protocolo de iteradores",
      ],
      answer: 0,
      explain:
        "Los dos compilan al mismo loop. La legibilidad es toda la decisión, y 'más funcional' no es automáticamente más legible.",
    },
    {
      kind: "editor",
      intro: `### Agrega de tres maneras

Con \`let latencies = vec![12u64, 40, 7, 95, 23];\`:

1. \`fold\` desde \`0u64\` hasta un total, imprímelo.
2. \`.copied().reduce(u64::max)\` para el peor caso, imprímelo con \`{:?}\`.
3. \`fold\` desde \`String::new()\` uniendo los valores con \`'|'\`, imprímelo.

Salida esperada:

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\``,
    },
  ],

  "rust-collections-iterators-6": [
    {
      kind: "theory",
      body: `Una closure implementa uno de tres traits, y **tú no eliges** — el compilador decide a partir de lo que el cuerpo hace con sus capturas.

| trait | el cuerpo | se puede llamar |
| --- | --- | --- |
| \`FnOnce\` | **consume** una captura | una vez |
| \`FnMut\` | **muta** una captura | muchas veces, necesita \`&mut\` |
| \`Fn\` | solo **lee** las capturas | muchas veces, desde \`&\` |

Se anidan: toda \`Fn\` es también \`FnMut\`, y toda \`FnMut\` es también \`FnOnce\`. Así que acotar un parámetro con \`Fn\` es lo *más* restrictivo que puedes pedir.`,
    },
    {
      kind: "theory",
      body: `Lo que significa que la regla para escribir una firma es la inversa de la intuición:

**Acota con el trait más laxo que te deje llamarla tantas veces como necesites.** \`FnOnce\` si la llamas una vez, \`FnMut\` si la llamas repetidamente y no te molesta que guarde estado mutable, \`Fn\` solo si necesitas llamarla desde varios lugares a la vez — por ejemplo, desde varios threads.

\`\`\`rust
fn call_once<F: FnOnce() -> String>(f: F) -> String { f() }
fn call_mut<F: FnMut()>(mut f: F) { f(); f(); }
fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64 { f(1) + f(2) }
\`\`\`

Fíjate en \`mut f\` en el caso \`FnMut\`: llamarla necesita un borrow exclusivo de la closure misma, porque la closure es dueña del estado que está mutando.`,
    },
    {
      kind: "quiz",
      question:
        "El cuerpo de una closure hace `count += 1` sobre una local capturada. ¿Qué traits implementa?",
      options: [
        "`FnMut` y `FnOnce` — pero no `Fn`, porque llamarla muta su estado capturado",
        "Los tres — mutar una captura no afecta al trait",
        "Solo `FnOnce`, porque la mutación consume la captura",
      ],
      answer: 0,
      explain:
        "Por eso un parámetro acotado con `F: Fn()` rechaza una closure contadora. Los traits describen lo que *hace* llamarla, no lo que la closure devuelve.",
    },
    {
      kind: "fill",
      prompt:
        "Acota un callback que se va a invocar dos veces y tiene permitido guardar estado mutable.",
      file: "main.rs",
      before: "fn call_fn_mut<F: ",
      after: ">(mut f: F) {",
      choices: ["FnMut()", "Fn()", "FnOnce()"],
      answer: 0,
      explain:
        "`FnOnce` no se puede llamar dos veces, y `Fn` rechazaría cualquier closure que mute una captura — lo que excluye a la mayoría de los callbacks útiles.",
    },
    {
      kind: "quiz",
      question:
        "Un parámetro de callback está acotado con `F: Fn()` y la closure de quien llama no compila. ¿Cuál es el arreglo habitual?",
      options: [
        "Relajar el bound a `FnMut` — a menos que el callback de verdad necesite llamarse desde varios lugares a la vez",
        "Pedirle a quien llama que envuelva su estado en un `RefCell`",
        "Cambiar el parámetro a `&dyn Fn()`",
      ],
      answer: 0,
      explain:
        "`RefCell` sí funciona — convierte la restricción de tiempo de compilación en una de runtime — pero recurrir a él para satisfacer un bound demasiado apretado es resolver el problema de tu propia API en el código de quien te llama.",
    },
    {
      kind: "editor",
      intro: `### El compilador elige el trait

1. \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\` que devuelva \`f(1) + f(2)\`. Llámala con una closure que multiplique por un \`factor = 10\` capturado.
2. \`fn call_fn_mut<F: FnMut()>(mut f: F)\` que llame a \`f()\` dos veces. Llámala con una closure que incremente un \`count\` capturado, y luego imprime \`count\`.
3. \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` que llame a \`f()\` una vez. Llámala con una closure \`move\` que devuelva una \`String\` capturada.

Salida esperada:

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\``,
    },
  ],

  "rust-collections-iterators-7": [
    {
      kind: "theory",
      body: `Por defecto una closure captura por referencia — lo mínimo con lo que puede salirse con la suya. Eso es correcto para una closure que se usa de inmediato, y equivocado para una que **sobrevive al scope en el que se creó**.

\`move\` fuerza a que cada captura se tome por valor:

\`\`\`rust
fn make_greeter(name: String) -> Box<dyn Fn() -> String> {
    Box::new(move || format!("hello {name}"))
}
\`\`\`

Sin \`move\`, la closure guardaría una referencia a \`name\`, que muere cuando la función retorna. Con él, la closure es dueña de \`name\` y puede ir a cualquier parte.`,
    },
    {
      kind: "theory",
      body: `Dos formas de devolver una closure, y la elección es el mismo trade-off genérico-versus-objeto de antes:

**\`impl Fn() -> T\`** — un único tipo anónimo concreto, dispatch estático, sin asignación. Úsalo cuando la función devuelve exactamente una closure.

**\`Box<dyn Fn() -> T>\`** — asignada en el heap, con dispatch dinámico. Necesaria cuando distintas ramas devuelven closures *distintas*, o cuando necesitas guardar varias en una colección.

\`\`\`rust
fn make_counter(start: u32) -> impl FnMut() -> u32 {
    let mut n = start;
    move || { n += 1; n }
}
\`\`\`

Esa closure es dueña de \`n\`. Cada llamada muta su propio estado y este sobrevive a todas las llamadas — es una máquina de estados sin declarar ningún struct.`,
    },
    {
      kind: "quiz",
      question:
        "Una función devuelve `impl Fn() -> String` sobre una `String` construida localmente, sin `move`. ¿Qué pasa?",
      options: [
        "No compila — la closure toma prestada una local que muere cuando la función retorna",
        "Compila, y la closure devuelta ve una string vacía",
        "Compila; Rust extiende el lifetime de la local para que coincida con la closure",
      ],
      answer: 0,
      explain:
        "Es uno de los avisos de `move` más comunes del lenguaje, y la sugerencia del compilador es exactamente la correcta: agrega `move`.",
    },
    {
      kind: "fill",
      prompt:
        "Devuelve una closure que sea dueña de su estado capturado, con dispatch estático y sin asignación.",
      file: "main.rs",
      before: "fn make_counter(start: u32) -> ",
      after: " {\n    let mut n = start;\n    move || { n += 1; n }\n}",
      choices: ["impl FnMut() -> u32", "Box<dyn Fn() -> u32>", "fn() -> u32"],
      answer: 0,
      explain:
        "Tiene que ser `FnMut` (muta `n`), e `impl` evita el box. `fn() -> u32` es un puntero a función plano, que no puede llevar estado capturado en absoluto.",
    },
    {
      kind: "quiz",
      question: "¿Cuándo es obligatorio meter en un box la closure devuelta en lugar de usar `impl Fn`?",
      options: [
        "Cuando distintas ramas devuelven closures distintas — `impl Trait` nombra un único tipo concreto",
        "Siempre que la closure sea `move`",
        "Siempre que la closure capture más de una variable",
      ],
      answer: 0,
      explain:
        "Cada closure es su propio tipo anónimo, así que dos literales de closure son dos tipos aunque se vean idénticos. `impl Trait` solo puede representar a uno de ellos.",
    },
    {
      kind: "editor",
      intro: `### Closures que sobreviven a su scope

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — es dueña de \`n\`, lo incrementa y lo devuelve en cada llamada.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — devuelve \`"hello <name>"\`.
3. En \`main\`, llama al contador tres veces en bindings separados e imprime los tres en una sola línea, luego imprime la salida del greeter para \`rpc\`.

Salida esperada:

\`\`\`text
11 12 13
hello rpc
\`\`\`

El contador empieza en \`10\`. Liga cada llamada a su propia variable antes de imprimir — tres borrows \`&mut\` dentro de un solo \`println!\` es una pelea que no necesitas.`,
    },
  ],
};
