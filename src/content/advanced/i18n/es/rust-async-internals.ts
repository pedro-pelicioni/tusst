import type { LessonStep } from "@/content/steps";

// ES · Async From First Principles.
//
// Overlay for ../../steps/rust-async-internals.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustAsyncInternalsStepsEs: Record<string, LessonStep[]> = {
  "rust-async-internals-1": [
    {
      kind: "theory",
      body: `Una \`Future\` es una struct con un método. Esa es toda la abstracción:

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` es una pregunta: *"¿ya terminaste?"* La respuesta es \`Poll::Ready(value)\` o \`Poll::Pending\`.

No hay ningún thread aquí, ni scheduler, ni magia. Una future es una máquina de estados que alguien más tiene que llamar una y otra vez.`,
    },
    {
      kind: "theory",
      body: `Dos piezas de la firma que conviene nombrar ahora, para que dejen de ser ruido.

**\`Pin<&mut Self>\`.** Un bloque \`async\` compila a una máquina de estados que puede guardar referencias *hacia sí misma* — un borrow que cruza un \`.await\` se convierte en una struct autorreferencial. Mover un valor así invalidaría esos punteros, así que \`Pin\` es la promesa de que no se va a mover. Para una future escrita a mano sin autorreferencias, \`Pin::new(&mut f)\` es gratis y no tiene nada de especial.

**\`Context\`.** Hoy carga exactamente una cosa: el \`Waker\`. Cuando una future devuelve \`Pending\`, es responsable de arreglárselas para que el waker sea llamado en cuanto el progreso sea posible — eso es lo que evita que el executor gire en vacío. La lección tres construye uno.

La regla que sale de la firma por sí sola: **\`poll\` nunca debe bloquear.** Tiene que devolver \`Pending\` rápido y recibir poll de nuevo más tarde, o todas las demás futures que comparten el thread se detienen.`,
    },
    {
      kind: "quiz",
      question: "¿Qué es una `Future`, mecánicamente?",
      options: [
        "Una máquina de estados con un método `poll` que devuelve `Ready(v)` o `Pending` — nada la ejecuta por sí solo",
        "Un handle a un thread que el runtime arrancó cuando se creó la future",
        "Un callback registrado en el event loop del sistema operativo",
      ],
      answer: 0,
      explain:
        "Las futures de Rust son *basadas en poll*, a diferencia de las promises de JavaScript, que son basadas en push y empiezan a correr de inmediato. Casi toda sorpresa del async en Rust sale de esa única diferencia.",
    },
    {
      kind: "fill",
      prompt: "Reporta que la future terminó, llevando su valor.",
      file: "main.rs",
      before: "fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {\n    Poll::",
      after: "(self.0)\n}",
      choices: ["Ready", "Pending", "Done"],
      answer: 0,
      explain:
        "`Poll` tiene exactamente dos variantes: `Ready(T)` y `Pending`. `Pending` no lleva nada — todavía no hay valor.",
    },
    {
      kind: "quiz",
      question: "¿Por qué `poll` recibe `Pin<&mut Self>` en vez de `&mut self`?",
      options: [
        "Un bloque `async` puede guardar referencias a su propio estado, y moverlo las invalidaría — `Pin` promete que no se va a mover",
        "`Pin` es un lock que impide que dos threads hagan poll a la vez",
        "Mantiene viva la future hasta que el runtime la dropea",
      ],
      answer: 0,
      explain:
        "Por esto existe `Pin`. Para una future escrita a mano sin autorreferencias, `Pin::new(&mut f)` no cuesta nada — te topas con `Pin` por lo que genera `async fn`.",
    },
    {
      kind: "editor",
      intro: `### Implementa Future a mano

1. \`struct Immediate(u32)\` implementando \`Future<Output = u32>\`, devolviendo \`Poll::Ready(self.0)\` de inmediato.
2. \`struct Countdown { left: u32 }\` implementando \`Future<Output = u32>\`: mientras \`left > 0\`, decrementa y devuelve \`Pending\`; en cero, devuelve \`Ready(0)\`.
3. En \`main\`, arma un \`Context\` a partir de \`Waker::noop()\` y hazle poll a cada future a mano — \`Immediate\` una vez, \`Countdown\` tres veces — imprimiendo cada \`Poll\` con \`{:?}\`.

Salida esperada:

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

No hay executor en este programa. El executor eres tú.`,
    },
  ],

  "rust-async-internals-2": [
    {
      kind: "theory",
      body: `Llamar a un \`async fn\` **no ejecuta nada de su cuerpo**. Construye una máquina de estados y te la entrega, parada en el estado cero:

\`\`\`rust
let fut = build();          // no ha pasado nada
\`\`\`

El cuerpo corre solo cuando algo le hace poll. Es lo opuesto a una promise de JavaScript, que empieza a ejecutarse en el momento en que se crea.

Por eso una future sin await es un warning: \`Future\` es \`#[must_use]\`, y dropear una en silencio significa que el trabajo que pediste nunca ocurrió.`,
    },
    {
      kind: "theory",
      body: `La laziness es una feature, y de ella salen tres comportamientos reales.

**Cancelar es gratis.** Dropea la future y el trabajo simplemente nunca ocurre. Un runtime no necesita interrumpir nada — dos lecciones más adelante se cubre lo que eso significa para la limpieza.

**Componer es gratis.** \`select!\` puede armar cinco futures y hacerles poll hasta que una termine, y después dropear el resto. Si crearlas las hubiera arrancado, serían cuatro operaciones desperdiciadas en vez de cero.

**Los timeouts envuelven en vez de interrumpir.** \`timeout(d, fut)\` es solo otra future que le hace poll a la interna hasta el plazo. No hay ningún thread que matar.

El costo de la laziness es el modo de falla: olvida el \`.await\` y nada corre, no aparece ningún error, y el warning \`unused_must_use\` del compilador es lo único entre tú y una tarde muy confusa.`,
    },
    {
      kind: "quiz",
      question:
        "Escribes `let fut = fetch_data();` y te olvidas del `.await`. ¿Qué pasa?",
      options: [
        "No corre nada — la future se dropea sin recibir poll, y solo el warning de `must_use` lo insinúa",
        "La request corre en segundo plano y su resultado se descarta",
        "Es un error de compilación, ya que las futures tienen que recibir await",
      ],
      answer: 0,
      explain:
        "'La request corre en segundo plano' es lo que hace una promise de JavaScript, y arrastrar esa intuición a Rust es el error de async más común que existe.",
    },
    {
      kind: "fill",
      prompt:
        "Haz pin a la máquina de estados de un bloque async para poder hacerle poll a mano.",
      file: "main.rs",
      before: "let mut fut = ",
      after: "(build());",
      choices: ["Box::pin", "Box::new", "Pin::new"],
      answer: 0,
      explain:
        "`Pin::new` exige que el valor sea `Unpin`, y un bloque `async` no lo es. `Box::pin` asigna memoria y hace pin en un solo paso — exactamente lo que `.await` hace por ti por debajo.",
    },
    {
      kind: "quiz",
      question: "¿Por qué la laziness hace que cancelar sea barato?",
      options: [
        "El trabajo que no corrió no necesita interrupción — dropear la future es la cancelación",
        "El runtime mantiene un log de deshacer por cada future",
        "Las futures canceladas reciben un poll más para desenrollarse limpiamente",
      ],
      answer: 0,
      explain:
        "También explica por qué la cancelación no puede ser *async*: dropear es síncrono, así que cualquier limpieza que necesite un await tiene que arreglarse de otra forma.",
    },
    {
      kind: "editor",
      intro: `### Demuestra que nada corre por sí solo

1. \`struct Effect { ran: bool }\` implementando \`Future<Output = &'static str>\`: \`poll\` pone \`ran = true\` y devuelve \`Ready("side effect happened")\`.
2. \`async fn build() -> &'static str\` que devuelve \`"from an async fn"\`.
3. En \`main\`: crea el \`Effect\` e imprime \`ran\` (false). Hazle poll una vez, imprime el \`Poll\` y \`ran\` otra vez (true). Después llama a \`build()\`, imprime que nada corrió, hazle \`Box::pin\` y hazle poll.

Salida esperada:

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\``,
    },
  ],

  "rust-async-internals-3": [
    {
      kind: "theory",
      body: `Un executor es un loop:

\`\`\`rust
loop {
    match future.as_mut().poll(&mut cx) {
        Poll::Ready(v) => return v,
        Poll::Pending  => /* espera hasta que te despierten */,
    }
}
\`\`\`

La única parte difícil es *"espera hasta que te despierten"*. Girar en vacío funcionaría y quemaría un core. En su lugar, el executor entrega un \`Waker\` en el \`Context\` y después estaciona el thread — y el trabajo de la future es llamar a ese waker cuando el progreso sea posible.`,
    },
    {
      kind: "theory",
      body: `\`Waker\` es una vtable armada a mano, porque es anterior a que \`dyn\` fuera usable en esa posición:

\`\`\`rust
static VTABLE: RawWakerVTable =
    RawWakerVTable::new(clone_raw, wake_raw, wake_by_ref_raw, drop_raw);
\`\`\`

Cuatro punteros a función sobre un \`*const ()\` borrado — y ese puntero es un \`Arc\` que fugamos a un puntero crudo y reconstruimos en cada callback. \`clone\` tiene que incrementar el refcount, \`drop\` tiene que decrementarlo, y equivocarse ahí fuga memoria o libera dos veces. Es el único lugar del async en Rust donde de verdad necesitas \`unsafe\`, y por eso todo proyecto real usa un crate para esto.

La mitad del park es un \`Mutex<bool>\` más un \`Condvar\`: \`wait\` duerme hasta que el flag se activa, \`notify\` lo activa y despierta al que duerme. Escribirlo una vez vale una tarde — después de esto, \`block_on\` no es una función misteriosa de un crate, son treinta líneas que ya escribiste.`,
    },
    {
      kind: "quiz",
      question: "¿Cuál es el trabajo del `Waker`?",
      options: [
        "Dejar que una future le diga al executor 'hazme poll de nuevo' — sin él, el executor tiene que girar en vacío o dormir para siempre",
        "Correr el cuerpo de la future en un thread de fondo",
        "Cancelar la future cuando tarda demasiado",
      ],
      answer: 0,
      explain:
        "Este es el contrato que hace eficiente al async: una future `Pending` no cuesta nada hasta que algo la despierta, así que diez mil conexiones ociosas cuestan diez mil máquinas de estados estacionadas y cero CPU.",
    },
    {
      kind: "fill",
      prompt:
        "Haz pin a la future una sola vez, en el heap, para poder hacerle poll repetidamente en el loop.",
      file: "main.rs",
      before: "let mut future = ",
      after: "(future);",
      choices: ["Box::pin", "Box::new", "Arc::new"],
      answer: 0,
      explain:
        "`block_on` acepta cualquier `F: Future`, incluido un bloque async que no es `Unpin`, así que tiene que hacerle pin. Meterla en un Box es la forma más simple; los executors reales hacen pin en el stack para evitar la asignación.",
    },
    {
      kind: "quiz",
      question:
        "Una future escrita a mano devuelve `Pending` y nunca llama al waker. ¿Qué pasa en un executor real?",
      options: [
        "Nunca recibe poll de nuevo — la task se cuelga para siempre, sin error y sin uso de CPU",
        "El executor le hace poll otra vez después de un timeout por defecto",
        "El runtime detecta el wake faltante y hace panic",
      ],
      answer: 0,
      explain:
        "Es el bug clásico de la future escrita a mano, y es invisible: la task simplemente se detiene. Nada te avisa, porque 'todavía no está lista' y 'nunca va a estar lista' se ven idénticos desde afuera.",
    },
    {
      kind: "editor",
      intro: `### Escribe un block_on de verdad

1. \`struct Signal { ready: Mutex<bool>, cv: Condvar }\` con \`new() -> Arc<Signal>\`, \`wait(&self)\` (duerme hasta que el flag se activa, y después lo limpia) y \`notify(&self)\`.
2. Un \`static VTABLE: RawWakerVTable\` con cuatro \`unsafe fn\` sobre un \`Arc<Signal>\` fugado a \`*const ()\`. \`clone\` incrementa el conteo, \`wake_by_ref\` notifica sin consumir, \`wake\` notifica y consume, \`drop\` decrementa.
3. \`fn waker_for(signal: &Arc<Signal>) -> Waker\` que lo arma con \`Waker::from_raw\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, arma el contexto, y después el loop: \`Ready\` retorna, \`Pending\` llama a \`signal.wait()\`.
5. \`struct Yield { left: u32 }\` que cede tres veces y después \`Ready(7)\`, y \`async fn work() -> u32\` que le hace await y suma 1.
6. Corre \`block_on(async { 5u32 })\` y \`block_on(work())\`.

Salida esperada:

\`\`\`text
simple: 5
yielding: 8
\`\`\`

Es el ejercicio más largo del camino. También es el que hace que todo runtime posterior se lea como código común y corriente.`,
    },
  ],

  "rust-async-internals-4": [
    {
      kind: "theory",
      body: `La concurrencia async es **cooperativa**. Una task corre hasta que devuelve \`Pending\`, y solo entonces otra task en ese thread puede correr. Nada la interrumpe a la fuerza.

Así que el modelo tiene un único requisito: toda task tiene que devolver \`Pending\` con regularidad. Una task que calcula durante 200ms dentro de un solo \`poll\` retiene su thread del runtime durante 200ms, y todas las demás tasks asignadas a ese thread esperan — incluidas aquellas cuyos clientes están dando timeout.`,
    },
    {
      kind: "theory",
      body: `El modo de falla tiene nombre — **bloquear el executor** — y tres causas comunes:

- **I/O síncrono.** \`std::fs::read\`, un driver de base de datos bloqueante, \`std::thread::sleep\` dentro de un \`async fn\`.
- **Trabajo de CPU.** Hashing, compresión, un sort grande.
- **Un lock retenido a través de un \`.await\`.** La task se estaciona sosteniéndolo, y todos los demás hacen fila detrás de una task que ni siquiera está corriendo.

El arreglo es mover el trabajo fuera de los threads async: \`tokio::task::spawn_blocking\` para I/O y llamadas bloqueantes cortas, un pool de \`rayon\` dedicado para CPU pesada. La regla general es que un poll debería completarse en decenas de microsegundos.

Por eso también el síntoma es tan confuso. La latencia sube en los endpoints que comparten un thread del runtime con el culpable, no en el endpoint que está bloqueando — así que el trace lento apunta a código inocente.`,
    },
    {
      kind: "quiz",
      question:
        "Un handler hace una lectura síncrona de archivo de 200ms dentro de un `async fn`. ¿Qué ve un operador?",
      options: [
        "La latencia p99 sube en *otros* endpoints que comparten ese thread del runtime — el handler culpable puede verse bien",
        "Solo ese handler se vuelve lento; el runtime aísla las tasks entre sí",
        "El runtime registra un warning y mueve la task a un pool bloqueante",
      ],
      answer: 0,
      explain:
        "La pista falsa es lo que hace que esto sea caro de debuggear. Las métricas de task de Tokio con `--cfg tokio_unstable` y un histograma de duración de poll existen precisamente para señalar al verdadero culpable.",
    },
    {
      kind: "fill",
      prompt:
        "Devuelve el control al executor para que otras tasks puedan avanzar.",
      file: "main.rs",
      before: "self.left -= 1;\ncx.waker().",
      after: "();\nPoll::Pending",
      choices: ["wake_by_ref", "wake", "clone"],
      answer: 0,
      explain:
        "`wake_by_ref` agenda otro poll sin consumir el waker, que es lo que quieres cuando el waker vive en el `Context` que te entregaron.",
    },
    {
      kind: "quiz",
      question: "¿Dónde debería correr un cálculo de CPU de 500ms?",
      options: [
        "En un pool dedicado — `spawn_blocking` o un pool de `rayon` — nunca dentro de un poll en un thread worker async",
        "Dentro del `async fn`, ya que el runtime lo va a interrumpir después de un slice de tiempo",
        "Repartido en muchos `async fn`, que el runtime intercala automáticamente",
      ],
      answer: 0,
      explain:
        "No hay preemption con la que contar. Partirlo en varios `async fn` tampoco cambia nada — sin un `.await` en medio, sigue siendo un solo poll ininterrumpido.",
    },
    {
      kind: "editor",
      intro: `### Cooperativo, y qué pasa cuando no lo eres

1. \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\` implementando \`Future<Output = ()>\`: registra \`"<name>:<left>"\`, y si \`left\` es cero devuelve \`Ready\`; si no, decrementa, despierta, y devuelve \`Pending\`.
2. \`struct Hog { name, log }\` cuyo único \`poll\` registra tres entradas y devuelve \`Ready\` — todo su trabajo en un solo turno.
3. Hazle poll a dos \`Task\` (\`a\` y \`b\`, ambas con \`left: 2\`) alternadamente hasta que las dos terminen, e imprime el log.
4. Con un log nuevo, hazle poll a un \`Hog\` hasta completarlo, después a una \`Task\` llamada \`starved\` (\`left: 1\`), e imprime ese log.

Salida esperada:

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

El primer log se intercala. El segundo no — el hog terminó todo antes de que la otra task tuviera un solo turno.`,
    },
  ],

  "rust-async-internals-5": [
    {
      kind: "theory",
      body: `No hay \`cancel()\` en async Rust. **Cancelar es dropear la future.**

\`\`\`rust
{
    let mut req = Request { .. };
    poll(&mut req);          // arrancó
    poll(&mut req);          // sigue pendiente
}                            // se dropea aquí — cancelada
\`\`\`

La máquina de estados se destruye donde sea que estuviera suspendida. Cada local que sostenía se dropea, en el orden de siempre. Ese es todo el mecanismo de limpieza.`,
    },
    {
      kind: "theory",
      body: `Dos consecuencias que deciden si un servicio es correcto bajo carga.

**Una future puede dropearse en cualquier \`.await\`.** Cuando un cliente se desconecta o un timeout se dispara, la task se detiene entre dos sentencias. Todo lo que estaba a medio hacer se queda a medio hacer — así que una operación de dos pasos tiene que ser idempotente, o estar envuelta de forma que un retry pueda repetirla sin riesgo. Esta propiedad se llama **cancellation safety**, y la documentación de las bibliotecas la declara explícitamente: \`tokio::sync::mpsc::Receiver::recv\` y \`AsyncReadExt::read\` son cancel-safe; \`read_exact\` no lo es, porque puede ya haber movido bytes a tu buffer cuando se dropea.

**La limpieza tiene que ser síncrona.** \`Drop\` no puede hacer \`.await\`, así que una future no puede esperar un cierre ordenado a la salida. Las soluciones estándar son hacer la limpieza de forma síncrona en \`Drop\`, o pasarle el trabajo a una task independiente que sobreviva a la cancelada.

La forma práctica: mantén pequeña la región con await, haz cada paso idempotente, y pon todo lo que tenga que ocurrir detrás de un guard de \`Drop\` en vez de después del último \`.await\`.`,
    },
    {
      kind: "quiz",
      question: "¿Cómo se cancela una task async en vuelo en Rust?",
      options: [
        "Se dropea su future — la máquina de estados se destruye donde estaba suspendida, corriendo el `Drop` de cada local",
        "El runtime le manda una señal de cancelación que puede capturar y manejar",
        "Recibe un último poll con un flag de cancelación activado en el `Context`",
      ],
      answer: 0,
      explain:
        "Como es un `Drop` común, la cancelación es síncrona y no puede recibir await. Ese único hecho es la fuente de casi toda dificultad de graceful shutdown en async Rust.",
    },
    {
      kind: "fill",
      prompt:
        "Adjunta una limpieza que corra incluso cuando la future se cancela a mitad de vuelo.",
      file: "main.rs",
      before: "impl ",
      after: " for Request {\n    fn drop(&mut self) { /* release */ }\n}",
      choices: ["Drop", "Future", "Cancel"],
      answer: 0,
      explain:
        "`Drop` es el único hook que corre en la cancelación. El código puesto después del último `.await` no corre, porque la task nunca llega ahí.",
    },
    {
      kind: "quiz",
      question:
        "Un handler debita una cuenta, hace `.await` a una llamada de red, y después acredita otra. El cliente se desconecta durante el await. ¿Cuál es el estado?",
      options: [
        "Debitada y no acreditada — la future se dropeó a mitad de vuelo, y el dinero desapareció",
        "Los dos pasos se revierten automáticamente cuando la future se dropea",
        "El runtime termina el handler antes de atender la desconexión",
      ],
      answer: 0,
      explain:
        "Esto es cancellation safety como bug de corrección, no como nota de estilo. El arreglo es una transacción, una clave de idempotencia, o un guard de `Drop` que compense — no esperar que el cliente siga conectado.",
    },
    {
      kind: "editor",
      intro: `### Mira cómo una cancelación limpia

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`impl Drop\` que hace push de \`"cleanup <id>"\`.
3. \`impl Future<Output = u32>\` cuyo \`poll\` hace push de \`"poll <id>"\`, despierta, y devuelve \`Pending\` para siempre.
4. En \`main\`: dentro de un bloque, crea la request \`1\`, hazle poll **dos veces**, y deja que el bloque termine — esa es la cancelación. Haz push de un marcador \`"---"\`. Después crea la request \`2\`, hazle poll una vez, y hazle \`drop\` explícitamente.
5. Imprime el log.

Salida esperada:

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

Ninguna de las dos requests devolvió \`Ready\` jamás. Las dos limpiaron de todos modos.`,
    },
  ],

  "rust-async-internals-6": [
    {
      kind: "theory",
      body: `Un timeout no es una señal ni un thread. Es una future que le hace poll a dos cosas y devuelve la que termine primero:

\`\`\`rust
loop {
    if let Poll::Ready(v) = poll(&mut work)    { return v; }
    if let Poll::Ready(v) = poll(&mut deadline) { return v; }
}
\`\`\`

Eso es \`select!\`, y \`timeout(d, fut)\` es el caso especial en que uno de los lados es un timer. Nada se interrumpe — **la perdedora simplemente se dropea**, que por la lección anterior es exactamente lo que es cancelar.`,
    },
    {
      kind: "theory",
      body: `De ahí salen tres cosas, y cada una termina mordiendo a alguien.

**Una rama dropeada se cancela a mitad de vuelo.** Si la rama perdedora había hecho la mitad de una operación de dos pasos, esa mitad queda hecha. Pon solo futures cancel-safe en una rama de \`select!\`, o reestructura para que el estado parcial no importe.

**El orden de poll es una cuestión de equidad.** Un \`select\` ingenuo que siempre le hace poll primero a la primera rama deja morir de hambre a la segunda cuando la primera suele estar lista. \`tokio::select!\` aleatoriza el orden de las ramas por defecto exactamente por esto — y te deja apagarlo con \`biased;\` cuando de verdad quieres prioridad.

**Toda llamada saliente necesita un plazo.** Sin uno, una dependencia colgada se convierte en tu propia cola sin límite: las conexiones se acumulan, la memoria crece, y la caída se propaga a quien te llama. Un timeout no es manejo de errores, es cómo una falla se queda local.`,
    },
    {
      kind: "quiz",
      question: "¿Qué pasa con la rama perdedora de un `select!`?",
      options: [
        "Se dropea — cancelada donde sea que estuviera suspendida, con cualquier trabajo parcial dejado como estaba",
        "Sigue corriendo en segundo plano y su resultado se descarta",
        "Recibe poll hasta completarse primero, y después se ignora",
      ],
      answer: 0,
      explain:
        "Por eso la documentación de `tokio` marca las futures como cancel-safe o no. Poner una future que no es cancel-safe en una rama de `select!` es un bug de corrección, no una nota de rendimiento.",
    },
    {
      kind: "fill",
      prompt:
        "Retorna en cuanto cualquiera de los dos lados termine, sin esperar al otro.",
      file: "main.rs",
      before: "if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) {\n    ",
      after: " v;\n}",
      choices: ["return", "break", "continue"],
      answer: 0,
      explain:
        "Retornar de inmediato es lo que dropea la otra future — la perdedora sale de scope junto con la función. Ese drop *es* la cancelación.",
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `tokio::select!` aleatoriza a qué rama le hace poll primero?",
      options: [
        "Para no dejar morir de hambre a las ramas posteriores cuando una anterior suele estar lista",
        "Para que la expansión de la macro sea más pequeña",
        "Para repartir la carga de forma pareja entre los threads worker del runtime",
      ],
      answer: 0,
      explain:
        "Un orden fijo es un orden de prioridad, y una prioridad que no buscaste es starvation. `biased;` vuelve al orden determinista cuando la prioridad es deliberada.",
    },
    {
      kind: "editor",
      intro: `### Haz competir dos futures

1. \`struct Ticks { label: &'static str, left: u32 }\` implementando \`Future<Output = &'static str>\`: en cero devuelve \`Ready(self.label)\`; si no, decrementa, despierta, devuelve \`Pending\`.
2. \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` donde ambas son \`Future<Output = &'static str> + Unpin\` — un loop que le hace poll a \`a\` y luego a \`b\`, devolviendo el primer \`Ready\`.
3. Haz competir \`work\` (\`left: 2\`) contra \`timeout\` (\`left: 5\`), y después \`work\` (\`left: 9\`) contra \`timeout\` (\`left: 3\`).

Salida esperada:

\`\`\`text
work
timeout
\`\`\`

En cada caso la perdedora se dropea en el \`return\` — que es precisamente una cancelación.`,
    },
  ],

  "rust-async-internals-7": [
    {
      kind: "theory",
      body: `Todo lo que Tokio ofrece es ahora un nombre para algo que ya construiste.

| tú escribiste | Tokio |
| --- | --- |
| el \`loop\` de \`block_on\` | \`#[tokio::main]\` / \`Runtime::block_on\` |
| meter una future en una cola | \`tokio::spawn\` |
| la entrada de la cola en sí | \`JoinHandle<T>\` |
| tu función \`race\` | \`tokio::select!\` |
| competir contra un contador | \`tokio::time::timeout\` |
| \`Signal\` + \`Condvar\` | el registro de wakers del reactor |
| "no bloquees el poll" | \`tokio::task::spawn_blocking\` |

No hay ningún concepto extra en la lista. Lo que Tokio agrega es escala y un reactor de I/O.`,
    },
    {
      kind: "theory",
      body: `Las partes que de verdad vale la pena tomar de la biblioteca en vez de escribirlas:

**Un reactor epoll/kqueue.** Tu \`Signal\` despertaba con una condvar. Un runtime real registra un socket en el SO y despierta exactamente la task cuyo socket se volvió legible. Esto es lo que permite que un thread atienda diez mil conexiones.

**Un scheduler multithread con work stealing.** Las tasks se reparten entre threads worker, y un worker ocioso roba de la cola de uno ocupado. De ahí viene el bound \`Send + 'static\` de \`tokio::spawn\`: una task puede migrar entre threads en cualquier punto de await.

**Una timer wheel.** Tu race le hacía poll a un contador en un busy loop. Tokio mantiene una única estructura ordenada de timers y despierta cada task en su plazo, así que un millón de timeouts pendientes cuestan casi nada.

Conserva el modelo mental que construiste. Cuando una task se cuelga, la pregunta sigue siendo *"¿quién tenía que llamar al waker, y por qué no lo hizo?"* — y ahora sabes qué significa eso.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué `tokio::spawn` exige que la future sea `Send + 'static`?",
      options: [
        "El scheduler con work stealing puede mover la task entre threads worker, y puede sobrevivir a la función que la spawneó",
        "Toda task spawneada se serializa para enviarla al reactor",
        "`'static` garantiza que la task corre durante toda la vida del proceso",
      ],
      answer: 0,
      explain:
        "`tokio::task::spawn_local` quita el requisito de `Send` precisamente porque un `LocalSet` fija las tasks a un solo thread — el bound es sobre migración, no sobre async.",
    },
    {
      kind: "fill",
      prompt:
        "Guarda futures heterogéneas en una sola cola — la lista de tasks del mini-runtime.",
      file: "main.rs",
      before: "type Task = ",
      after: "<Box<dyn Future<Output = &'static str>>>;",
      choices: ["Pin", "Box", "Arc"],
      answer: 0,
      explain:
        "`Pin<Box<dyn Future>>` es el tipo canónico de task en un Box — `Box` por el tamaño desconocido, `Pin` porque `poll` lo exige. El tipo interno de task de Tokio es esto con más contabilidad encima.",
    },
    {
      kind: "quiz",
      question:
        "Una task en producción se cuelga para siempre sin uso de CPU y sin error. ¿Cuál es la primera pregunta?",
      options: [
        "¿Quién tenía que llamar al waker de esta task, y por qué no lo hizo?",
        "¿Qué thread está bloqueando, y cómo la interrumpimos a la fuerza?",
        "¿Qué tan grande es su stack, y se desbordó?",
      ],
      answer: 0,
      explain:
        "Cero CPU descarta un bloqueo — una task bloqueada quema su thread. Una task estacionada que nunca es despertada es silenciosa, y esa es exactamente la forma de un wake que falta.",
    },
    {
      kind: "editor",
      intro: `### Un mini runtime con spawn

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\` con \`new()\`, \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` que hace push de \`Box::pin(f)\`, y \`run(&mut self)\` que saca de la cola, hace poll, registra los \`Ready\` y vuelve a encolar los \`Pending\`.
3. \`struct Delayed { label: &'static str, left: u32 }\` que cede \`left\` veces antes de devolver su label.
4. Spawnea \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` y \`async { "immediate" }\`, corre, e imprime el orden de finalización.

Salida esperada:

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

El orden de finalización es por *disponibilidad*, no por orden de spawn. Fíjate que este runtime vuelve a encolar incondicionalmente y por lo tanto ignora el waker por completo — que es lo único que lo separa de uno de verdad.`,
    },
  ],
};
