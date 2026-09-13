// ES · editor instructions — Async From First Principles.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-async-internals.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustAsyncInternalsInstructionsEs: Record<string, { instructions: string }> = {
  "rust-async-internals-1": {
    instructions: `## Implementa Future a mano

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` pregunta "¿ya terminaste?" y responde \`Ready(v)\` o \`Pending\`. Nada ejecuta una future por sí solo.

### Tu tarea

1. \`struct Immediate(u32)\` implementando \`Future<Output = u32>\`, devolviendo \`Poll::Ready(self.0)\` de inmediato.
2. \`struct Countdown { left: u32 }\` implementando \`Future<Output = u32>\`: mientras \`left > 0\`, decrementa y devuelve \`Pending\`; en cero devuelve \`Ready(0)\`.
3. En \`main\`, arma un \`Context\` a partir de \`Waker::noop()\` y hazle poll a cada una a mano — \`Immediate\` una vez, \`Countdown\` tres veces — imprimiendo cada \`Poll\` con \`{:?}\`.

Salida esperada:

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

No hay executor en este programa. El executor eres tú.

### Pistas

- \`use std::task::{Context, Poll, Waker};\`
- \`Countdown::poll\` necesita \`mut self: Pin<&mut Self>\` para decrementar.
- \`Pin::new(&mut f).poll(&mut cx)\` le hace poll a una future que no se ha movido.
`,
  },

  "rust-async-internals-2": {
    instructions: `## Demuestra que nada corre por sí solo

Llamar a un \`async fn\` **no ejecuta nada** de su cuerpo — construye una máquina de estados parada en el estado cero. El cuerpo corre solo cuando algo le hace poll.

Es lo opuesto a una promise de JavaScript, y es la razón por la que \`Future\` es \`#[must_use]\`: una future dropeada sin await significa que el trabajo nunca ocurrió.

### Tu tarea

1. \`struct Effect { ran: bool }\` implementando \`Future<Output = &'static str>\`: \`poll\` pone \`ran = true\` y devuelve \`Ready("side effect happened")\`.
2. \`async fn build() -> &'static str\` que devuelve \`"from an async fn"\`.
3. En \`main\`: crea el \`Effect\`, imprime \`ran\` (false). Hazle poll una vez, imprime el \`Poll\` y \`ran\` otra vez (true). Después llama a \`build()\`, imprime que nada corrió, hazle \`Box::pin\` y hazle poll.

Salida esperada:

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\`

### Pistas

- Un bloque \`async\` no es \`Unpin\`, así que necesita \`Box::pin\`, no \`Pin::new\`.
- Hazle poll a la future en el Box con \`fut.as_mut().poll(&mut cx)\`.
`,
  },

  "rust-async-internals-3": {
    instructions: `## Escribe un block_on de verdad

Un executor es un loop: hacer poll y, en \`Pending\`, esperar hasta que te despierten. El \`Waker\` es la forma en que una future dice "hazme poll de nuevo".

\`Waker\` es una vtable armada a mano sobre un \`*const ()\` borrado — aquí, un \`Arc<Signal>\` fugado a un puntero crudo. \`clone\` tiene que incrementar el refcount y \`drop\` tiene que decrementarlo; es el único lugar del async en Rust que de verdad necesita \`unsafe\`.

### Tu tarea

1. \`struct Signal { ready: Mutex<bool>, cv: Condvar }\` con \`new() -> Arc<Signal>\`, \`wait(&self)\` (duerme hasta que el flag se activa, y después lo limpia) y \`notify(&self)\`.
2. Un \`static VTABLE: RawWakerVTable\` con cuatro \`unsafe fn\`: \`clone\` incrementa el conteo, \`wake\` notifica y consume, \`wake_by_ref\` notifica sin consumir, \`drop\` decrementa.
3. \`fn waker_for(signal: &Arc<Signal>) -> Waker\` vía \`Waker::from_raw\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, arma el contexto, loop: \`Ready\` retorna, \`Pending\` llama a \`signal.wait()\`.
5. \`struct Yield { left: u32 }\` que cede tres veces y después \`Ready(7)\`; \`async fn work() -> u32\` que le hace await y suma 1.
6. Corre \`block_on(async { 5u32 })\` y \`block_on(work())\`.

Salida esperada:

\`\`\`text
simple: 5
yielding: 8
\`\`\`

Es el ejercicio más largo del camino, y el que hace que todo runtime posterior se lea como código común y corriente.

### Pistas

- \`Arc::into_raw\` / \`Arc::from_raw\` son el par fugar-y-reconstruir; usa \`std::mem::forget\` cuando no debas consumir el \`Arc\` reconstruido.
- \`Yield\` tiene que llamar a \`cx.waker().wake_by_ref()\` antes de devolver \`Pending\`, o \`wait()\` duerme para siempre.
- \`Condvar::wait\` te devuelve el guard: \`ready = self.cv.wait(ready).unwrap();\`
`,
  },

  "rust-async-internals-4": {
    instructions: `## Cooperativo, y qué pasa cuando no lo eres

Una task corre hasta que devuelve \`Pending\`. Nada la interrumpe a la fuerza. Así que un \`poll\` que calcula durante 200ms retiene su thread del runtime durante 200ms, y todas las demás tasks de ese thread esperan.

La parte confusa en producción: la latencia sube en los *otros* endpoints que comparten ese thread, así que el trace lento apunta a código inocente.

### Tu tarea

1. \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\` implementando \`Future<Output = ()>\`: registra \`"<name>:<left>"\`; si \`left\` es cero devuelve \`Ready\`; si no, decrementa, despierta, devuelve \`Pending\`.
2. \`struct Hog { name: &'static str, log: Rc<RefCell<Vec<String>>> }\` cuyo único \`poll\` registra tres entradas (\`"<name>:0"\`, \`"<name>:1"\`, \`"<name>:2"\`) y devuelve \`Ready\`.
3. Hazle poll a dos \`Task\` (\`a\` y \`b\`, ambas con \`left: 2\`) alternadamente hasta que las dos terminen, y después imprime el log.
4. Con un log nuevo, hazle poll a un \`Hog\` llamado \`hog\` hasta completarlo, después a una \`Task\` llamada \`starved\` (\`left: 1\`), e imprime ese log.

Salida esperada:

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

El primer log se intercala. El segundo no.

### Pistas

- \`Poll::is_ready()\` es cómodo para el loop alternado.
- \`{:?}\` sobre \`log.borrow()\` imprime el \`Vec\` interno.
`,
  },

  "rust-async-internals-5": {
    instructions: `## Mira cómo una cancelación limpia

No hay \`cancel()\`. **Cancelar es dropear la future** — la máquina de estados se destruye donde sea que estuviera suspendida, y cada local que sostenía se dropea en el orden de siempre.

Dos consecuencias: una future puede dropearse en cualquier \`.await\`, así que una operación a medio completar se queda a medias; y \`Drop\` no puede hacer \`.await\`, así que la limpieza tiene que ser síncrona.

### Tu tarea

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`impl Drop\` que hace push de \`"cleanup <id>"\`.
3. \`impl Future<Output = u32>\` cuyo \`poll\` hace push de \`"poll <id>"\`, despierta, y devuelve \`Pending\` — para siempre.
4. En \`main\`: dentro de un bloque, crea la request \`1\`, hazle poll **dos veces**, y deja que el bloque termine — esa es la cancelación. Haz push de un marcador \`"---"\`. Después crea la request \`2\`, hazle poll una vez, y hazle \`drop\` explícitamente.
5. Imprime el log.

Salida esperada:

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

Ninguna de las dos requests devolvió \`Ready\` jamás. Las dos limpiaron de todos modos.

### Pistas

- \`Poll\` es \`#[must_use]\`; liga el resultado con \`let _ = ...\` para descartarlo.
`,
  },

  "rust-async-internals-6": {
    instructions: `## Haz competir dos futures

Un timeout no es una señal ni un thread — es una future que le hace poll a dos cosas y devuelve la que termine primero. Eso es \`select!\`, y **la perdedora se dropea**, que es exactamente una cancelación.

### Tu tarea

1. \`struct Ticks { label: &'static str, left: u32 }\` implementando \`Future<Output = &'static str>\`: en cero devuelve \`Ready(self.label)\`; si no, decrementa, despierta, devuelve \`Pending\`.
2. \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` donde ambas son \`Future<Output = &'static str> + Unpin\` — un loop que le hace poll a \`a\` y luego a \`b\`, devolviendo el primer \`Ready\`.
3. Haz competir \`work\` (\`left: 2\`) contra \`timeout\` (\`left: 5\`), y después \`work\` (\`left: 9\`) contra \`timeout\` (\`left: 3\`).

Salida esperada:

\`\`\`text
work
timeout
\`\`\`

En cada caso la perdedora se dropea en el \`return\`.

### Pistas

- \`if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) { return v; }\`
- El bound \`Unpin\` es lo que le permite a \`race\` usar \`Pin::new\` en vez de meterlas en un Box.
`,
  },

  "rust-async-internals-7": {
    instructions: `## Un mini runtime con spawn

Todo lo que Tokio ofrece es un nombre para algo que ya construiste: \`block_on\` es tu loop, \`tokio::spawn\` es meter en una cola, \`select!\` es tu \`race\`, \`timeout\` es una carrera contra un timer.

Lo que Tokio de verdad agrega es un reactor epoll/kqueue, un scheduler con work stealing, y una timer wheel.

### Tu tarea

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\` con \`new()\`, \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` que hace push de \`Box::pin(f)\`, y \`run(&mut self)\` que saca de la cola, hace poll, registra los \`Ready\` y vuelve a encolar los \`Pending\`.
3. \`struct Delayed { label: &'static str, left: u32 }\` que cede \`left\` veces antes de devolver su label.
4. Spawnea \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` y \`async { "immediate" }\`, corre, e imprime el orden de finalización.

Salida esperada:

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

El orden de finalización es por *disponibilidad*, no por orden de spawn. Este runtime vuelve a encolar incondicionalmente y por eso ignora el waker por completo — que es lo único que lo separa de uno de verdad.

### Pistas

- \`use std::collections::VecDeque;\`
- \`while let Some(mut task) = self.queue.pop_front()\` mueve el loop.
`,
  },
};
