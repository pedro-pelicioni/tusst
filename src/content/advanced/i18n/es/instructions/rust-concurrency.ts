// ES · editor instructions — Threads, Send/Sync & Shared State.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-concurrency.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustConcurrencyInstructionsEs: Record<string, { instructions: string }> = {
  "rust-concurrency-1": {
    instructions: `## Reparte y recoge

\`thread::spawn\` devuelve un \`JoinHandle<T>\`; \`join()\` bloquea y te da el valor de retorno de la closure dentro de un \`Result\` — \`Err\` significa que ese thread hizo panic.

La closure tiene que ser \`'static\`, así que \`move\` es casi siempre obligatorio.

### Tu tarea

1. Spawnea cuatro threads, uno por \`id\` en \`0..4u32\`, cada uno devolviendo \`id * id\`.
2. Recoge los handles en un \`Vec\`.
3. Haz join **en orden de spawn** en un \`Vec<u32>\`, imprímelo con \`{:?}\` y después imprime la suma.

Salida esperada:

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

El orden de ejecución no es determinista; hacer join en orden vuelve determinista el resultado de todas formas.

### Pistas

- \`use std::thread;\`
- \`results.iter().sum::<u32>()\` anota la suma inline.
`,
  },

  "rust-concurrency-2": {
    instructions: `## Prueba las propiedades

**\`Send\`** — el valor puede *moverse* a otro thread.
**\`Sync\`** — el valor puede *compartirse por referencia* entre threads (\`T: Sync\` ⟺ \`&T: Send\`).

Los dos son auto traits: un tipo los recibe cuando todos sus campos los tienen.

Los casos instructivos: \`Rc\` no es ninguno (contador no atómico). \`Cell\` es \`Send\` pero **no** \`Sync\` — mover la cell está bien, compartir \`&Cell\` tiene una carrera en \`set\`.

### Tu tarea

1. \`fn assert_send<T: Send>(_: &T) -> &'static str\` que devuelva \`"Send"\`, y \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` que devuelva \`"Sync"\`.
2. Muestra que \`Arc<u32>\` satisface los dos.
3. Crea un \`Rc<u32>\` con \`42\` y solo imprime su valor — pasárselo a \`assert_send\` no compilaría, y esa es la lección.
4. Muestra que \`Cell<u32>\` satisface \`Send\`. **No** llames a \`assert_sync\` con ella.

Salida esperada:

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\`

### Pistas

- \`use std::rc::Rc;\`, \`use std::sync::Arc;\`, \`use std::cell::Cell;\`
- Los helpers nunca mueven nada — el *bound* es lo que fuerza la prueba.
`,
  },

  "rust-concurrency-3": {
    instructions: `## Comparte una tabla con cuatro workers

\`Arc<T>\` es \`Rc<T>\` con un contador de referencias atómico, que es lo que lo vuelve \`Send + Sync\`. Por sí solo da acceso **compartido de solo lectura** — mutar necesita un \`Mutex\` o \`RwLock\` interno.

El patrón idiomático es hacer shadowing del binding dentro del loop: \`let table = Arc::clone(&table);\` antes de la closure \`move\`.

### Tu tarea

1. Arma un \`Arc<Vec<u64>>\` con \`(1..=1000).collect()\`; imprime \`Arc::strong_count\`.
2. Spawnea cuatro threads. Cada uno toma su propio \`Arc::clone\` y suma un slice de 250 elementos con \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Haz join, sumando las parciales, e imprime el total.
4. Imprime el strong count otra vez — de vuelta en 1.

Salida esperada:

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\`

### Pistas

- Anota el collect: \`let table: Arc<Vec<u64>> = Arc::new((1..=1000).collect());\`
- \`chunk\` es un \`usize\` de \`0..4usize\`.
`,
  },

  "rust-concurrency-4": {
    instructions: `## Ocho threads, un contador

\`Mutex<T>\` es **dueño** de sus datos — no hay forma de llegar al valor sin bloquear. El guard hace deref a \`&mut T\` y libera al hacer drop; no existe \`unlock()\`.

\`lock()\` devuelve un \`Result\` por el **poisoning**: un thread que hace panic sosteniendo el lock lo marca, y todo \`lock()\` posterior devuelve \`Err\`.

Mantén la sección crítica corta. \`Drop\` corre al final del **scope**, no en el último uso.

### Tu tarea

1. Arma un \`Arc<Mutex<u64>>\` que arranque en \`0\`.
2. Spawnea ocho threads. Cada uno toma su propio \`Arc::clone\` y, mil veces, bloquea e incrementa — el guard delimitado a una iteración.
3. Haz join en los ocho, después imprime el conteo final y si el mutex está \`is_poisoned()\`.

Salida esperada:

\`\`\`text
count: 8000
poisoned: false
\`\`\`

### Pistas

- \`use std::sync::{Arc, Mutex};\`
- \`*counter.lock().unwrap()\` lee el valor al final.
`,
  },

  "rust-concurrency-5": {
    instructions: `## Muchos lectores, un escritor

\`RwLock<T>\` permite muchos guards \`read()\` concurrentes o un único guard \`write()\` exclusivo.

**No** es un upgrade gratis: cuesta más por operación que \`Mutex\`, y solo gana cuando las lecturas dominan de verdad *y* son lo bastante lentas para solaparse. El starvation de escritores es un riesgo real, y la política de equidad viene del SO, no de std.

Usa \`Mutex\` por defecto; pásate a \`RwLock\` con un profile en la mano.

### Tu tarea

1. Arma un \`Arc<RwLock<Vec<u64>>>\` con \`vec![10, 20, 30]\`.
2. Spawnea cuatro threads lectores, cada uno tomando \`read()\` y devolviendo \`.len()\`.
3. Haz join, sumando las longitudes devueltas, e imprime el total.
4. Toma \`write()\` y haz push de \`40\`, después imprime el vector a través de un \`read()\` nuevo.

Salida esperada:

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\`

### Pistas

- \`use std::sync::{Arc, RwLock};\`
- \`*cache.read().unwrap()\` hace deref del guard para \`{:?}\`.
`,
  },

  "rust-concurrency-6": {
    instructions: `## Ordena los locks

Un deadlock necesita dos threads adquiriendo dos locks en **órdenes opuestos**. Rust impide los data races en tiempo de compilación; no impide los deadlocks, porque esperar para siempre es seguro en memoria.

El arreglo es un **orden global de locks**: elige un orden total sobre tus locks y adquiérelos siempre en ese orden, sea cual sea la dirección propia de la operación.

### Tu tarea

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — ordena las dos por \`id\`, bloquea primero la menor, y después aplica el débito y el crédito en los lados correctos.
3. Arma las cuentas \`1\` (saldo \`100\`) y \`2\` (saldo \`50\`) dentro de \`Arc\`s.
4. Spawnea 100 threads: 50 transfiriendo \`1\` de a hacia b, y 50 transfiriendo \`1\` de b hacia a. Haz join en todos.
5. Imprime cada saldo, después el total.

Salida esperada:

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Sin el orden, este programa hace deadlock. Con él, el neto es cero y el total se conserva.

### Pistas

- \`let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };\`
- Después de bloquear, revisa \`from.id == first.id\` para saber a qué guard debitar.
`,
  },

  "rust-concurrency-7": {
    instructions: `## Cuenta sin lock, elige un ganador

Un atomic lo lee-modifica-escribe el hardware sin lock. \`compare_exchange\` escribe el valor solo si actualmente es igual a lo que esperabas — \`Ok(previous)\` si ganaste, \`Err(actual)\` si perdiste.

\`Ordering\` no es una perilla de velocidad; restringe cómo pueden reordenarse las operaciones de memoria de alrededor:

- **\`Relaxed\`** — atómico solo sobre este valor. Correcto para un contador de estadísticas.
- **\`Release\`/\`Acquire\`** — publican los datos escritos antes de un store a quien lo cargue.
- **\`SeqCst\`** — un único orden total con el que todos los threads están de acuerdo. El más seguro, el más lento.

### Tu tarea

1. \`Arc<AtomicU64>\` en \`0\`. Spawnea ocho threads, cada uno haciendo \`fetch_add(1, Ordering::Relaxed)\` mil veces. Haz join, después imprime el valor con un load \`Acquire\`.
2. Un \`AtomicBool\` en \`false\`. Llama a \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\` **dos veces**, imprimiendo cada resultado con \`{:?}\`.

Salida esperada:

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — ganamos, y reemplazamos un \`false\`. \`Err(true)\` — perdimos, y esto es lo que encontramos.

### Pistas

- \`use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};\`
`,
  },

  "rust-concurrency-8": {
    instructions: `## Junta todo, después siente el backpressure

Un channel mueve **ownership** entre threads. \`mpsc\` es multi-productor, consumidor único: clona el sender, quédate con un solo receiver.

El iterador del receiver termina solo cuando **todos** los senders desaparecieron — incluido el original en \`main\`, y por eso \`drop(tx)\` no es opcional.

\`channel()\` es no acotado: los productores nunca esperan, y un consumidor lento se convierte en un OOM kill. \`sync_channel(n)\` es acotado, y ese bloqueo **es** backpressure.

### Tu tarea

1. \`mpsc::channel::<u64>()\`. Spawnea tres productores; el productor \`id\` envía \`id * 10 + n\` para \`n\` en \`0..3\`. **Dropea el sender original**, después recoge el receiver en un \`Vec<u64>\`, ordénalo, e imprímelo junto con su longitud.
2. \`mpsc::sync_channel::<u64>(1)\`. Envía un valor, imprime si un segundo \`try_send\` **falla**, después haz \`recv()\` e imprime lo que salió.

Salida esperada:

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Ordenar es lo que vuelve determinista el fan-in — el orden de llegada no lo es.

### Pistas

- \`use std::sync::mpsc;\`
- \`rx.iter().collect()\` drena el channel hasta que todos los senders desaparecen.
`,
  },
};
