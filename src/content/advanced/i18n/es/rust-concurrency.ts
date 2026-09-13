import type { LessonStep } from "@/content/steps";

// ES · Threads, Send/Sync & Shared State.
//
// Overlay for ../../steps/rust-concurrency.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustConcurrencyStepsEs: Record<string, LessonStep[]> = {
  "rust-concurrency-1": [
    {
      kind: "theory",
      body: `\`thread::spawn\` arranca un thread real del SO y devuelve un \`JoinHandle<T>\`, donde \`T\` es lo que devuelva la closure.

\`\`\`rust
let h = thread::spawn(move || id * id);
let value = h.join().unwrap();
\`\`\`

\`join()\` bloquea hasta que ese thread termina y te da su valor de retorno — envuelto en un \`Result\`, porque el thread puede haber hecho **panic**. \`Err\` es el panic; el \`unwrap()\` de aquí lo propaga al thread padre.`,
    },
    {
      kind: "theory",
      body: `Dos cosas sobre \`spawn\` moldean todo lo que escribes con él.

**La closure tiene que ser \`'static\`.** El thread puede sobrevivir a la función que lo creó, así que no puede tomar prestadas las locales de esa función. \`move\` es casi siempre obligatorio, y por eso compartir datos significa \`Arc\`, no \`&\`.

**Los threads sueltos mueren al salir.** Si \`main\` retorna sin hacer join, los threads pendientes se terminan donde estén — sin unwinding, sin destructores. Recoger los handles y hacer join en todos no es prolijidad: es la forma de saber que el trabajo terminó.

\`\`\`rust
for h in handles { results.push(h.join().unwrap()); }
\`\`\`

Hacer join en orden de spawn vuelve deterministas los *resultados* aunque la *ejecución* no lo fuera — y eso es lo que hace testeable a un cómputo paralelo.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué `join()` devuelve un `Result`?",
      options: [
        "El thread puede haber hecho panic, y `Err` lleva el payload del panic en vez de perderlo",
        "El thread puede seguir corriendo, y `Err` significa 'no terminó'",
        "El `Result` informa si el SO pudo asignar un thread",
      ],
      answer: 0,
      explain:
        "Un panic en un thread spawneado no aborta el proceso por defecto — termina ese thread. Sin revisar el `Result`, tratarías en silencio a un worker que colapsó como a uno que no hizo trabajo alguno.",
    },
    {
      kind: "fill",
      prompt:
        "Dale al thread el ownership del valor capturado, para que no tenga que tomar prestada una local.",
      file: "main.rs",
      before: "handles.push(thread::spawn(",
      after: "|| id * id));",
      choices: ["move ", "", "&"],
      answer: 0,
      explain:
        "Sin `move` la closure toma prestado `id`, y el compilador lo rechaza: el thread puede sobrevivir a la iteración del loop que es dueña de él.",
    },
    {
      kind: "quiz",
      question:
        "`main` spawnea cuatro workers y retorna sin hacer join en ninguno. ¿Qué les pasa?",
      options: [
        "Mueren al salir el proceso, a mitad del trabajo, sin unwinding y sin correr destructores",
        "El proceso espera a todos los threads antes de salir",
        "Se promueven a daemon threads y siguen corriendo después de la salida",
      ],
      answer: 0,
      explain:
        "Es una fuente real de escrituras perdidas y salida truncada. Haz join en los handles, o sostén algo que los workers señalicen antes de retornar.",
    },
    {
      kind: "editor",
      intro: `### Reparte y recoge

1. Spawnea cuatro threads, uno por \`id\` en \`0..4u32\`, cada uno devolviendo \`id * id\`.
2. Mete cada \`JoinHandle\` en un \`Vec\`.
3. Haz join **en orden de spawn** en un \`Vec<u32>\`, imprímelo con \`{:?}\` y después imprime la suma.

Salida esperada:

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

El orden de ejecución no es determinista; hacer join en orden vuelve determinista el *resultado* de todas formas.`,
    },
  ],

  "rust-concurrency-2": [
    {
      kind: "theory",
      body: `Dos marker traits cargan con toda la seguridad de threads de Rust. Ninguno tiene métodos — son afirmaciones que el compilador verifica y después impone.

**\`Send\`** — el valor puede **moverse** a otro thread.
**\`Sync\`** — el valor puede **compartirse** por referencia entre threads. Formalmente: \`T\` es \`Sync\` si y solo si \`&T\` es \`Send\`.

Son **auto traits**: un tipo los recibe automáticamente cuando todos sus campos los tienen. Casi nunca los implementas a mano, y hacerlo exige \`unsafe\` porque estás haciendo una promesa que el compilador no puede verificar.`,
    },
    {
      kind: "theory",
      body: `Los casos instructivos son los tipos que tienen uno y no el otro.

**\`Rc<T>\`: ninguno.** Su contador de referencias es un entero común con incrementos no atómicos. Dos threads clonando a la vez tendrían una carrera y liberarían el valor antes de tiempo — un use-after-free. \`Arc<T>\` es el mismo tipo con un contador atómico, y tiene los dos.

**\`Cell<T>\`: \`Send\` pero no \`Sync\`.** Mover una \`Cell\` entera a otro thread está bien — solo un thread la tiene. *Compartir* \`&Cell\` no lo está: \`set\` es una escritura común, así que dos threads escribiendo a la vez tienen una carrera. Este es el par que hace que la distinción haga clic.

**\`MutexGuard\`: \`Sync\` pero no \`Send\`.** Algunas plataformas exigen que el thread que bloqueó un mutex sea el que lo libere, así que el guard no puede cruzar threads.

Todo lo demás se deriva: \`Mutex<T>\` es \`Sync\` cuando \`T: Send\`, que es exactamente por lo que \`Arc<Mutex<T>>\` es el tipo de estado mutable compartido.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué `Cell<T>` es `Send` pero no `Sync`?",
      options: [
        "Mover la cell entera está bien porque solo un thread la sostiene; compartir `&Cell` no, porque `set` es una escritura sin sincronizar",
        "`Cell` contiene un lock, y los locks no se pueden compartir",
        "Sí es `Sync`; solo `RefCell` no lo es",
      ],
      answer: 0,
      explain:
        "Es la ilustración más limpia de la división. `Send` va de entregar el valor; `Sync` va de que dos threads lo toquen a la vez.",
    },
    {
      kind: "fill",
      prompt:
        "Acota un helper para que solo acepte valores que puedan moverse a otro thread.",
      file: "main.rs",
      before: "fn assert_send<T: ",
      after: ">(_: &T) -> &'static str {",
      choices: ["Send", "Sync", "Copy"],
      answer: 0,
      explain:
        "El helper en realidad nunca mueve nada — existe para que el *bound* obligue al compilador a probar la propiedad. Llamarlo con un `Rc` es un error de compilación, y esa es la demostración.",
    },
    {
      kind: "quiz",
      question:
        "Te sale 'the trait `Send` is not implemented for `Rc<Config>`' en una task spawneada. ¿Cuál es el arreglo?",
      options: [
        "Usar `Arc<Config>` — el mismo ownership compartido con un contador de referencias atómico",
        "Envolver el `Rc` en un `Mutex`, que vuelve `Send` a cualquier tipo",
        "Agregar `unsafe impl Send for Rc<Config>`",
      ],
      answer: 0,
      explain:
        "`Mutex` no lo rescata: `Mutex<T>` solo es `Send`/`Sync` cuando `T` es `Send`. Y el `unsafe impl` compilaría y después tendría una carrera — el compilador tenía razón.",
    },
    {
      kind: "editor",
      intro: `### Prueba las propiedades

1. Escribe \`fn assert_send<T: Send>(_: &T) -> &'static str\` que devuelva \`"Send"\`, y \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` que devuelva \`"Sync"\`.
2. Muestra que \`Arc<u32>\` satisface los dos.
3. Crea un \`Rc<u32>\` y solo imprime su valor — pasárselo a \`assert_send\` no compilaría, y esa es la lección.
4. Muestra que \`Cell<u32>\` satisface \`Send\`. (No es \`Sync\`, así que no llames a \`assert_sync\` con ella.)

Salida esperada:

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\``,
    },
  ],

  "rust-concurrency-3": [
    {
      kind: "theory",
      body: `\`Arc<T>\` es \`Rc<T>\` con un contador de referencias **atómico**. Esa única diferencia es lo que lo vuelve \`Send + Sync\` (cuando \`T\` lo es), y es la forma estándar de entregar los mismos datos a varios threads.

\`\`\`rust
let table = Arc::new(big_vec);
for chunk in 0..4 {
    let table = Arc::clone(&table);      // un incremento atómico
    thread::spawn(move || { /* lee table */ });
}
\`\`\`

El \`let table = Arc::clone(&table);\` que hace shadowing dentro del loop es el patrón idiomático: clona el handle para esta iteración, y la closure \`move\` se lleva ese clon en vez del binding externo.`,
    },
    {
      kind: "theory",
      body: `\`Arc<T>\` solo da **acceso compartido de solo lectura** — entrega \`&T\`, nunca \`&mut T\`. Para una tabla de búsqueda grande, una config o un mapa de rutas compilado, es exactamente lo que quieres y no necesita ningún lock.

El costo es honesto pero pequeño: un incremento atómico al clonar y un decremento atómico al hacer drop, cada uno una operación sincronizada sobre una línea de cache que todos los threads comparten. Clonar un \`Arc\` en un loop interno apretado se nota; clonarlo una vez por task, no.

Para **mutación**, combínalo: \`Arc<Mutex<T>>\` o \`Arc<RwLock<T>>\`. El \`Arc\` aporta ownership compartido entre threads, el tipo interno aporta acceso sincronizado. Son ortogonales, y confundir los dos es la fuente más común de "por qué no compila esto" en el Rust concurrente de los primeros días.`,
    },
    {
      kind: "quiz",
      question:
        "¿Qué les permite hacer `Arc<T>` por sí solo a varios threads con el valor?",
      options: [
        "Leerlo — solo entrega `&T`. Mutar necesita un `Mutex` o `RwLock` interno",
        "Leerlo y escribirlo; el contador atómico sincroniza el acceso",
        "Nada hasta que se bloquea; todo acceso a un `Arc` toma un lock",
      ],
      answer: 0,
      explain:
        "El contador atómico protege el *contador*, no los datos. `Arc` y `Mutex` resuelven dos problemas distintos y por eso se componen.",
    },
    {
      kind: "fill",
      prompt: "Dale al thread de esta iteración su propio handle a la tabla compartida.",
      file: "main.rs",
      before: "let table = Arc::",
      after: "(&table);",
      choices: ["clone", "new", "get_mut"],
      answer: 0,
      explain:
        "`Arc::new` asignaría una segunda tabla sin relación con la primera. `get_mut` devuelve `Some` solo cuando el contador es 1, que nunca es el caso aquí.",
    },
    {
      kind: "quiz",
      question:
        "Después de que cuatro workers hicieron join, `Arc::strong_count` vuelve a leer 1. ¿Por qué?",
      options: [
        "El clon de cada thread se dropeó cuando terminó su closure, decrementando el contador de vuelta",
        "`join` resetea el contador a 1",
        "El contador nunca pasó de 1; los clones comparten un único slot de contador",
      ],
      answer: 0,
      explain:
        "Es `Drop` haciendo su trabajo a través de las fronteras entre threads: cada clon movido muere con la closure que era su dueña.",
    },
    {
      kind: "editor",
      intro: `### Comparte una tabla con cuatro workers

1. Arma un \`Arc<Vec<u64>>\` con \`(1..=1000).collect()\` e imprime \`Arc::strong_count\`.
2. Spawnea cuatro threads. Cada uno toma su propio \`Arc::clone\` y suma un slice de 250 elementos: \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Haz join, sumando las parciales, e imprime el total.
4. Imprime el strong count otra vez — volvió a 1.

Salida esperada:

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\``,
    },
  ],

  "rust-concurrency-4": [
    {
      kind: "theory",
      body: `\`Mutex<T>\` es **dueño** de sus datos. No hay forma de llegar al valor sin bloquear, así que "me olvidé de tomar el lock" no es un bug que puedas escribir.

\`\`\`rust
let mut guard = counter.lock().unwrap();
*guard += 1;
\`\`\`

\`lock()\` devuelve \`Result<MutexGuard<T>, PoisonError<_>>\`. El guard hace deref a \`&mut T\`, y **libera el lock cuando se dropea**. No existe \`unlock()\`.`,
    },
    {
      kind: "theory",
      body: `El \`Result\` es el **poisoning**. Si un thread hace panic sosteniendo el lock, el mutex queda marcado como envenenado y todo \`lock()\` posterior devuelve \`Err\` — los datos pueden haber quedado actualizados a medias, y el compilador te obliga a reconocerlo. \`PoisonError::into_inner()\` te da los datos de todas formas si decides que es seguro.

La regla que importa en producción: **mantén la sección crítica corta, y nunca sostengas un guard a través de una llamada lenta.**

\`\`\`rust
let value = { cache.lock().unwrap().get(&key).cloned() };   // liberado aquí
expensive_io(value);                                        // sin lock tomado
\`\`\`

La trampa es que \`Drop\` corre al final del **scope**, no en el último uso. Un guard que dejaste de leer sigue sosteniendo el lock — así que delimítalo a propósito con un bloque, o saca el valor afuera y dropea el guard.`,
    },
    {
      kind: "quiz",
      question: "¿Qué significa un `Mutex` envenenado?",
      options: [
        "Un thread hizo panic sosteniendo el lock, así que los datos pueden estar actualizados a medias y todo `lock()` posterior devuelve `Err`",
        "Dos threads hicieron deadlock y el runtime rompió el ciclo",
        "El lock se sostuvo más tiempo que un timeout incorporado",
      ],
      answer: 0,
      explain:
        "Es una señal de corrección, no de liveness. `into_inner()` te deja tomar los datos igual una vez que decidiste que la invariante sobrevivió.",
    },
    {
      kind: "fill",
      prompt: "Libera el lock apenas el valor esté afuera.",
      file: "main.rs",
      before: "let value = { cache.lock().unwrap().get(&key).",
      after: "() };",
      choices: ["cloned", "as_ref", "unwrap"],
      answer: 0,
      explain:
        "`cloned()` copia el valor hacia afuera para que el guard pueda morir en la llave de cierre. Devolver una referencia mantendría vivo el guard para satisfacer el borrow.",
    },
    {
      kind: "quiz",
      question:
        "Un handler bloquea un cache, hace una llamada HTTP y después escribe el resultado — todo en un mismo scope. ¿Cuál es el síntoma bajo carga?",
      options: [
        "El throughput se desploma a una petición por vez: todos los demás threads esperan detrás de la llamada de red",
        "El mutex se envenena porque la llamada tarda demasiado",
        "Nada — el guard se libera en su último uso, antes de la llamada",
      ],
      answer: 0,
      explain:
        "La última opción es exactamente el malentendido que manda este bug a producción. NLL termina los *borrows* en el último uso; `Drop` corre al final del *scope*, y el lock se sostiene durante las dos llamadas.",
    },
    {
      kind: "editor",
      intro: `### Ocho threads, un contador

1. Arma un \`Arc<Mutex<u64>>\` que arranque en \`0\`.
2. Spawnea ocho threads. Cada uno toma su propio \`Arc::clone\` y, mil veces, bloquea e incrementa — el guard delimitado a una sola iteración.
3. Haz join en los ocho, después imprime el conteo final y si el mutex está \`is_poisoned()\`.

Salida esperada:

\`\`\`text
count: 8000
poisoned: false
\`\`\`

Ocho mil incrementos sin actualizaciones perdidas — eso es el mutex, no suerte.`,
    },
  ],

  "rust-concurrency-5": [
    {
      kind: "theory",
      body: `\`RwLock<T>\` parte el lock en dos:

- \`read()\` — **muchos** lectores a la vez
- \`write()\` — **un** escritor, excluyendo a todos los lectores

\`\`\`rust
let len = cache.read().unwrap().len();     // concurrente con otros lectores
cache.write().unwrap().push(40);           // exclusivo
\`\`\`

En lo demás, la API es idéntica a la de \`Mutex\`: guards, poisoning, liberación al hacer drop.`,
    },
    {
      kind: "theory",
      body: `\`RwLock\` no es un upgrade gratis, y agarrarlo por defecto es un error común.

**Es más lento que \`Mutex\` por operación.** Lleva un conteo de lectores además del flag de escritura, así que un \`read()\` sin contención cuesta más que un \`lock()\` sin contención.

**Solo gana cuando las lecturas dominan de verdad y son lo bastante lentas para solaparse.** Una lectura que copia un entero termina antes de que llegue un segundo thread; pagaste por una concurrencia que nunca usaste. Una lectura que recorre una estructura grande mientras ocho threads hacen lo mismo es donde rinde.

**El starvation de escritores es un riesgo real.** Con una implementación que prefiere lectores y un flujo constante de ellos, un escritor puede esperar indefinidamente. El \`RwLock\` de std prefiere escritores en las plataformas principales, así que un escritor en espera bloquea a los lectores nuevos en vez de hacer cola detrás de ellos para siempre — pero la política es un detalle de implementación, no una garantía documentada, así que no construyas sobre ella.

Usa \`Mutex\` por defecto. Pásate a \`RwLock\` cuando un profile muestre contención de lectura, no cuando la carga simplemente *suene* a muchas lecturas.`,
    },
    {
      kind: "quiz",
      question:
        "Una carga se describe como 'casi todo lecturas', así que cambian `Mutex` por `RwLock` y nada se vuelve más rápido. ¿Por qué?",
      options: [
        "Las lecturas son demasiado cortas para solaparse — cada una termina antes de que llegue el siguiente thread, así que solo se paga el costo mayor por operación",
        "`RwLock` serializa las lecturas a menos que se agrupen explícitamente en batch",
        "Las lecturas tienen que marcarse `#[inline]` para correr en concurrencia",
      ],
      answer: 0,
      explain:
        "La concurrencia solo ayuda cuando las operaciones de verdad se solapan en el tiempo. Para una lectura que termina en nanosegundos, la contabilidad extra es lo único que compraste.",
    },
    {
      kind: "fill",
      prompt: "Toma un lock compartido para que varios lectores avancen a la vez.",
      file: "main.rs",
      before: "cache.",
      after: "().unwrap().len()",
      choices: ["read", "write", "lock"],
      answer: 0,
      explain:
        "`write()` excluiría a los otros lectores y los serializaría — exactamente lo que `RwLock` existe para evitar.",
    },
    {
      kind: "quiz",
      question: "¿Qué es el starvation de escritores, y quién decide si ocurre?",
      options: [
        "Un escritor esperando indefinidamente detrás de un flujo continuo de lectores — y la política de equidad viene de la primitiva del SO, no de std",
        "Un escritor envenenado por el panic de un lector; std elige la política",
        "Un escritor perdiendo sus datos mientras los lectores sostienen el lock; el compilador lo impide",
      ],
      answer: 0,
      explain:
        "Como std delega en la plataforma, el mismo código puede comportarse distinto en Linux y en macOS. Es una buena razón para no depender de la política en absoluto.",
    },
    {
      kind: "editor",
      intro: `### Muchos lectores, un escritor

1. Arma un \`Arc<RwLock<Vec<u64>>>\` con \`vec![10, 20, 30]\`.
2. Spawnea cuatro threads lectores, cada uno tomando \`read()\` y devolviendo \`.len()\`.
3. Haz join, sumando las longitudes devueltas, e imprime el total.
4. Toma \`write()\` y haz push de \`40\`, después imprime el vector a través de un \`read()\` nuevo.

Salida esperada:

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\``,
    },
  ],

  "rust-concurrency-6": [
    {
      kind: "theory",
      body: `Un deadlock necesita dos threads y dos locks adquiridos en **órdenes opuestos**:

\`\`\`text
thread 1: bloquea A ─── quiere B
thread 2: bloquea B ─── quiere A
\`\`\`

Ninguno puede avanzar y ninguno va a dar timeout. Rust impide los data races en tiempo de compilación; **no** impide los deadlocks, porque un deadlock no es unsoundness — es un bug de liveness, y el sistema de tipos no tiene nada que decir al respecto.

Una función de transferencia es la forma canónica de escribir uno sin querer: \`transfer(a, b)\` y \`transfer(b, a)\` corriendo a la vez adquieren en órdenes opuestos.`,
    },
    {
      kind: "theory",
      body: `El arreglo es un **orden global de locks**: elige un orden total sobre tus locks y adquiérelos siempre en ese orden, sin importar la dirección propia de la operación.

\`\`\`rust
let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };
let g1 = first.balance.lock().unwrap();
let g2 = second.balance.lock().unwrap();
\`\`\`

Ahora todo thread adquiere primero el id menor, así que el ciclo no puede formarse. Cualquier clave estable sirve — un id, un índice, incluso la dirección del puntero.

Dos tácticas de apoyo. **Sostén un lock a la vez** donde el algoritmo lo permita, ya que un solo lock no puede hacer deadlock consigo mismo. Y **\`try_lock\` con back-off** convierte un deadlock potencial en un retry — útil como red de seguridad, pero un mal sustituto de un orden, porque puede caer en livelock en su lugar.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué el sistema de tipos de Rust impide los data races pero no los deadlocks?",
      options: [
        "Un deadlock es un bug de liveness, no unsoundness — nada se corrompe, el programa simplemente se detiene",
        "Los deadlocks sí se impiden, pero solo en builds de release",
        "El borrow checker los impediría si `Mutex` se usara sin `Arc`",
      ],
      answer: 0,
      explain:
        "`Send`/`Sync` y las reglas de borrow hacen imposible *observar datos rotos*. Esperar para siempre es perfectamente seguro en memoria, y ningún análisis estático del lenguaje intenta atraparlo.",
    },
    {
      kind: "fill",
      prompt:
        "Impón un orden global para que dos transferencias opuestas no puedan formar un ciclo.",
      file: "main.rs",
      before: "let (first, second) = if from.id ",
      after: " to.id { (from, to) } else { (to, from) };",
      choices: ["<", "==", "!="],
      answer: 0,
      explain:
        "Cualquier orden total sirve; lo que importa es que todo thread aplique el *mismo*. Comparar por igualdad o desigualdad no da orden alguno.",
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `try_lock` con retry es una respuesta más débil que un orden global de locks?",
      options: [
        "Puede caer en livelock — threads tomando y soltando repetidamente sin progresar — mientras que un orden vuelve imposible el ciclo",
        "`try_lock` es unsafe y exige un bloque `unsafe`",
        "`try_lock` envenena el mutex cuando falla",
      ],
      answer: 0,
      explain:
        "El retry es una red de seguridad razonable, sobre todo con back-off aleatorizado. Como estrategia principal, convierte un cuelgue que puedes depurar en un spin que no puedes.",
    },
    {
      kind: "editor",
      intro: `### Ordena los locks

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — ordena las dos cuentas por \`id\`, bloquea primero la menor, y después aplica el débito y el crédito en los lados correctos.
3. Arma las cuentas \`1\` (saldo \`100\`) y \`2\` (saldo \`50\`) dentro de \`Arc\`s.
4. Spawnea 100 threads: 50 transfiriendo \`1\` de a hacia b, 50 transfiriendo \`1\` de b hacia a. Haz join en todos.
5. Imprime cada saldo y el total.

Salida esperada:

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Sin el orden, este programa hace deadlock. Con él, el neto es cero y el total se conserva.`,
    },
  ],

  "rust-concurrency-7": [
    {
      kind: "theory",
      body: `Un atomic es un único valor que el hardware puede leer-modificar-escribir sin lock. Para un contador, es dramáticamente más barato que \`Mutex<u64>\`:

\`\`\`rust
hits.fetch_add(1, Ordering::Relaxed);
\`\`\`

\`compare_exchange\` es la primitiva sobre la que se construye todo lo demás — escribe el valor **solo si** actualmente es igual a lo que esperabas:

\`\`\`rust
claimed.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
// Ok(false)  — ganamos, era false y ahora es true
// Err(true)  — ganó otro; el valor es lo que encontramos
\`\`\`

Así es como eliges exactamente un ganador entre N threads sin ningún lock.`,
    },
    {
      kind: "theory",
      body: `El argumento \`Ordering\` no es una perilla de rendimiento — restringe cómo el compilador y la CPU pueden reordenar las operaciones de memoria de alrededor.

- **\`Relaxed\`** — atómico solo sobre este valor. Ninguna garantía de orden sobre nada más. Correcto para un contador de estadísticas que nadie lee para tomar una decisión.
- **\`Release\`** en un store — todo lo escrito antes de él es visible para un thread que después haga un load \`Acquire\` de ese valor.
- **\`Acquire\`** en un load — todo lo que el thread que hizo release escribió antes de su store ahora es visible para ti.
- **\`AcqRel\`** — los dos, para un read-modify-write.
- **\`SeqCst\`** — además, un único orden total con el que todos los threads están de acuerdo. El más seguro y el más lento.

La regla honesta: **\`Relaxed\` para contadores, \`Acquire\`/\`Release\` para publicar datos, \`SeqCst\` cuando no estás seguro.** Agarrar \`Relaxed\` para que un flag sea "más rápido" es como se manda a producción un bug que aparece solo en ARM, solo bajo carga, una vez por semana.`,
    },
    {
      kind: "quiz",
      question:
        "Un worker escribe un buffer y después pone un flag `ready`; un lector hace spin sobre el flag y después lee el buffer. Los dos usan `Relaxed`. ¿Qué puede salir mal?",
      options: [
        "El lector puede ver `ready == true` antes de que las escrituras del buffer sean visibles, y leer basura",
        "Nada — `Relaxed` igual garantiza que la escritura ocurre primero en orden de programa",
        "El flag puede quedar roto, mostrando un valor que no es ni true ni false",
      ],
      answer: 0,
      explain:
        "Este es el patrón de publicación, y necesita `Release` en el store y `Acquire` en el load. `Relaxed` vuelve atómica cada *operación* y no ordena nada a su alrededor.",
    },
    {
      kind: "fill",
      prompt: "Incrementa un contador de estadísticas con el ordering correcto más barato.",
      file: "main.rs",
      before: "hits.fetch_add(1, Ordering::",
      after: ");",
      choices: ["Relaxed", "SeqCst", "Acquire"],
      answer: 0,
      explain:
        "Nada más depende del orden de este contador, así que `Relaxed` es a la vez correcto y el más barato. `Acquire` es legal en un read-modify-write como `fetch_add`, pero aquí no ordena nada y cuesta más — y `SeqCst` cuesta todavía más.",
    },
    {
      kind: "quiz",
      question: "¿Cuál es la descripción honesta de `SeqCst`?",
      options: [
        "El más fuerte y el más lento — un único orden total con el que todo thread está de acuerdo; el default correcto cuando no estás seguro",
        "El más rápido, ya que la CPU optimiza mejor un orden total",
        "Idéntico a `AcqRel` con otro nombre",
      ],
      answer: 0,
      explain:
        "Empezar en `SeqCst` y debilitar con un benchmark en la mano es una forma sólida de trabajar. Empezar en `Relaxed` y cruzar los dedos, no.",
    },
    {
      kind: "editor",
      intro: `### Cuenta sin lock, elige un ganador

1. Arma un \`Arc<AtomicU64>\` en \`0\`. Spawnea ocho threads, cada uno haciendo \`fetch_add(1, Ordering::Relaxed)\` mil veces. Haz join e imprime el valor con un load \`Acquire\`.
2. Crea un \`AtomicBool\` en \`false\`. Llama a \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\` **dos veces** e imprime cada resultado con \`{:?}\`.

Salida esperada:

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — ganamos, y el valor que reemplazamos era \`false\`. \`Err(true)\` — perdimos, y esto es lo que encontramos en realidad.`,
    },
  ],

  "rust-concurrency-8": [
    {
      kind: "theory",
      body: `Un channel mueve **ownership** entre threads. \`mpsc\` es multi-productor, consumidor único: clona el sender tantas veces como necesites, quédate con un solo receiver.

\`\`\`rust
let (tx, rx) = mpsc::channel::<u64>();
for id in 0..3 {
    let tx = tx.clone();
    thread::spawn(move || { tx.send(id).unwrap(); });
}
drop(tx);                       // dropea el original, o rx nunca termina
for value in rx { ... }
\`\`\`

Ese \`drop(tx)\` es el detalle que la gente se pierde. El iterador del receiver termina cuando **todos** los senders desaparecieron — y el \`tx\` original en \`main\` es uno de ellos.`,
    },
    {
      kind: "theory",
      body: `\`channel()\` es **no acotado**. Un productor nunca espera, lo que suena bien y es la forma clásica de construir una fuga de memoria: si los consumidores son más lentos que los productores, la cola crece hasta que matan el proceso.

\`sync_channel(n)\` es **acotado**. Una vez que hay \`n\` mensajes en el buffer, \`send\` bloquea:

\`\`\`rust
let (tx, rx) = mpsc::sync_channel::<u64>(1);
tx.send(1).unwrap();
tx.try_send(2).is_err();     // true — lleno
\`\`\`

Ese bloqueo *es* **backpressure**: la profundidad de la cola se vuelve una señal que viaja de vuelta hasta quien produce, así que un sistema sobrecargado frena su entrada en vez de bufferizar hasta un OOM kill.

Para un servicio, prefiere acotado. Una cola no acotada no elimina el límite, solo lo mueve a un lugar donde te enteras por un page en vez de por una métrica.`,
    },
    {
      kind: "quiz",
      question:
        "Un loop `for value in rx` nunca termina aunque todos los workers acabaron. ¿Por qué?",
      options: [
        "El sender original en `main` nunca se dropeó, así que el channel todavía tiene un sender vivo",
        "El receiver tiene que cerrarse explícitamente con `rx.close()`",
        "Los workers tienen que llamar a `tx.flush()` antes de salir",
      ],
      answer: 0,
      explain:
        "El iterador termina cuando el conteo de senders llega a cero. Clonar para cada worker y olvidar el original deja exactamente un sender vivo — en el thread que está esperando.",
    },
    {
      kind: "fill",
      prompt: "Crea un channel acotado para que los productores sientan backpressure.",
      file: "main.rs",
      before: "let (btx, brx) = mpsc::",
      after: "::<u64>(1);",
      choices: ["sync_channel", "channel", "bounded"],
      answer: 0,
      explain:
        "`channel()` es no acotado y no recibe argumento de capacidad. `bounded` es el nombre que le da Crossbeam — std lo llama `sync_channel`.",
    },
    {
      kind: "quiz",
      question:
        "¿Qué sale mal en realidad con una cola no acotada delante de un consumidor lento?",
      options: [
        "La memoria crece sin límite hasta que el proceso muere por OOM — el límite sigue existiendo, solo que es el de la máquina",
        "Los mensajes se descartan en silencio cuando se alcanza un límite interno",
        "Los senders empiezan a bloquear, que es el backpressure deseado",
      ],
      answer: 0,
      explain:
        "No acotado no significa 'sin límite', significa 'el límite es la RAM y te enteras cuando te despiertan con un page'. Una cola acotada hace que el límite sea tuyo, y visible como latencia.",
    },
    {
      kind: "editor",
      intro: `### Junta todo, después siente el backpressure

1. \`mpsc::channel::<u64>()\`. Spawnea tres productores; el productor \`id\` envía \`id * 10 + n\` para \`n\` en \`0..3\`. **Dropea el sender original**, después recoge el receiver en un \`Vec<u64>\`, ordénalo, imprímelo junto con su longitud.
2. \`mpsc::sync_channel::<u64>(1)\`. Envía un valor, imprime si un segundo \`try_send\` **falla**, después haz \`recv()\` e imprime lo que salió.

Salida esperada:

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Ordenar es lo que vuelve determinista el fan-in — el orden de llegada no lo es.`,
    },
  ],
};
