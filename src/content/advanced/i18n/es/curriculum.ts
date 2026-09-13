import type { AdvancedTrackText } from "../types";

// ES · Advanced Path curriculum metadata — track and lesson names as shown on
// /advanced and /advanced/[slug].
//
// CLIENT-SAFE. Keyed by the same slugs as the English source in
// ../../curriculum.ts, and PARTIAL: a missing key falls back to English.
//
// Rust terms are not translated — ownership, borrow, trait, lifetime,
// closure. Translating them pulls the reader away from the real compiler
// error, which is where they will meet the word again.

export const esAdvancedTrackText: Record<string, AdvancedTrackText> = {
  "rust-ownership-deep": {
    title: "Ownership, moves y drops",
    description:
      "El modelo que el borrow checker impone de verdad. Dónde vive un valor, cuándo se mueve, cuándo se copia en su lugar, y el punto exacto en que se destruye.",
    serves: "programación de sistemas en Rust/C++",
  },
  "rust-lifetimes": {
    title: "Lifetimes",
    description:
      "Las anotaciones dejan de ser ruido cuando las lees como una restricción entre entradas y salidas. Elisión, structs que guardan referencias, 'static, y lo que un bound promete en realidad.",
    serves: "programación de sistemas en Rust/C++",
  },
  "rust-traits-generics": {
    title: "Traits, generics y dispatch",
    description:
      "Cómo Rust reutiliza código sin herencia. Bounds, associated types, blanket impls, y la diferencia real de costo entre un generic y un dyn Trait.",
    serves: "programación de sistemas en Rust/C++",
  },
  "rust-error-handling": {
    title: "Errores que sobreviven a producción",
    description:
      "Result de punta a punta: propagación, conversión, tipos de error propios que cargan la causa, y una política explícita de cuándo un panic es correcto y cuándo es una caída del servicio.",
    serves: "ownership de infraestructura de producción",
  },
  "rust-collections-iterators": {
    title: "Colecciones, iteradores y closures",
    description:
      "Elegir el contenedor por complejidad y no por costumbre, y luego expresar la transformación de forma lazy. Incluye la distinción Fn/FnMut/FnOnce, que decide qué puede capturar una closure.",
    serves: "programación de sistemas en Rust/C++",
  },
  "rust-smart-pointers": {
    title: "Smart pointers y mutabilidad interior",
    description:
      "Box, Rc, RefCell, Cow y Weak — qué compra cada uno, qué cuesta, y la distinción entre borrow en tiempo de compilación y en runtime que decide cuál necesitas de verdad.",
    serves: "programación de sistemas en Rust/C++",
  },
  "rust-concurrency": {
    title: "Threads, Send/Sync y estado compartido",
    description:
      "El núcleo de cualquier servicio RPC bajo carga real. Threads, los dos auto traits que hacen que compartir sea seguro, Arc<Mutex<T>> y sus alternativas, atomics con memory ordering honesto, y channels.",
    serves: "servicios RPC/API a gran escala",
  },
  "rust-async-internals": {
    title: "Async desde los primeros principios",
    description:
      "Construido de abajo hacia arriba desde el poll loop, no de arriba hacia abajo desde una macro. Escribes un Future a mano, armas un block_on funcional con un Waker de verdad, y solo entonces miras lo que Tokio agrega encima.",
    serves: "servicios RPC/API a gran escala",
  },
  "rust-systems-edges": {
    title: "Macros, unsafe, FFI y dinero",
    description:
      "Los cuatro bordes que se espera que domine quien revisa código de sistemas: a qué se expande un derive, qué promete un bloque unsafe, qué cuesta cruzar a C++, y por qué un float nunca debe guardar un saldo.",
    serves: "programación de sistemas en Rust/C++",
  },
  "backend-rpc-services": {
    title: "Servicios RPC a escala",
    description:
      "El servicio frente a la red: JSON-RPC 2.0 hecho con exactitud, Serde en el borde, capas Tower para timeout y rate limiting, y las preguntas de arquitectura que una entrevista hace de verdad.",
    serves: "servicios RPC/API a gran escala",
  },
  "backend-data-layer": {
    title: "La capa de datos",
    description:
      "Arquitectura de base de datos como la describe el puesto: indexación y patrones de query primero, después el lado Rust — pools, transacciones y prepared statements.",
    serves: "arquitectura, indexación y patrones de query de base de datos",
  },
  "backend-indexers-distsys": {
    title: "Indexers y sistemas distribuidos",
    description:
      "El camino que recorre una transacción del cliente al consenso y de vuelta, y el indexer que la vuelve consultable. Cursores, replay, idempotencia y los modos de falla que solo aparecen a escala.",
    serves: "infraestructura blockchain en producción",
  },
  "backend-production": {
    title: "Corriéndolo en producción",
    description:
      "Lo que separa un prototipo de una infraestructura por la que a alguien lo despiertan de madrugada: observabilidad, percentiles honestos, pruebas de carga, shutdown ordenado y una postura de confiabilidad que puedas defender.",
    serves: "ownership de infraestructura de producción",
  },
};

export const esAdvancedLessonText: Record<
  string,
  { title: string; summary: string }
> = {
  // ownership
  "rust-ownership-deep-1": {
    title: "Stack, heap y quién es dueño de qué",
    summary: "Lee el layout real de memoria de un valor y di qué parte vive dónde.",
  },
  "rust-ownership-deep-2": {
    title: "Move vs copy",
    summary: "Predice si una asignación mueve o copia — y demuestra que compila.",
  },
  "rust-ownership-deep-3": {
    title: "Moves parciales",
    summary: "Mueve un campo fuera de una struct y sigue usando el resto, legalmente.",
  },
  "rust-ownership-deep-4": {
    title: "Reglas de borrow en la práctica",
    summary: "Arregla errores de aliasing acotando el scope en vez de recurrir a clone().",
  },
  "rust-ownership-deep-5": {
    title: "Reborrowing y deref coercion",
    summary: "Explica por qué &mut T pasa a un parámetro &T, y por qué String pasa como &str.",
  },
  "rust-ownership-deep-6": {
    title: "Orden de drop y RAII",
    summary: "Predice el orden de destrucción y libera un recurso sin llamar a close().",
  },
  // lifetimes
  "rust-lifetimes-1": {
    title: "Lo que un lifetime dice en realidad",
    summary: "Lee 'a como una relación entre argumentos, no como una duración.",
  },
  "rust-lifetimes-2": {
    title: "Reglas de elisión",
    summary: "Di qué firmas no necesitan anotación, y por qué la tuya sí.",
  },
  "rust-lifetimes-3": {
    title: "Múltiples lifetimes",
    summary: "Anota una función cuya salida toma prestado de solo una de dos entradas.",
  },
  "rust-lifetimes-4": {
    title: "Structs que guardan referencias",
    summary: "Construye una vista de parser zero-copy sobre un buffer que no es tuyo.",
  },
  "rust-lifetimes-5": {
    title: "'static: dos significados distintos",
    summary: "Distingue un &'static str de un bound T: 'static — no son la misma afirmación.",
  },
  // traits & generics
  "rust-traits-generics-1": {
    title: "Definir e implementar un trait",
    summary: "Escribe un trait con un método por defecto y sobreescríbelo.",
  },
  "rust-traits-generics-2": {
    title: "Trait bounds y cláusulas where",
    summary: "Restringe un generic lo justo para que el cuerpo compile, sin restringirlo de más.",
  },
  "rust-traits-generics-3": {
    title: "Associated types vs parámetros genéricos",
    summary: "Elige bien entre los dos, y di por qué Iterator usa uno y no el otro.",
  },
  "rust-traits-generics-4": {
    title: "Dispatch estático y monomorphization",
    summary: "Explica qué emite el compilador para una función genérica, y qué cuesta.",
  },
  "rust-traits-generics-5": {
    title: "Trait objects y la vtable",
    summary: "Guarda tipos mezclados detrás de Box<dyn Trait> y nombra el costo en runtime.",
  },
  "rust-traits-generics-6": {
    title: "Object safety",
    summary: "Predice qué traits pueden volverse trait objects antes de que el compilador te lo diga.",
  },
  "rust-traits-generics-7": {
    title: "Blanket impls y la orphan rule",
    summary: "Implementa un trait para todo tipo que satisfaga un bound — y sabe cuándo no puedes.",
  },
  // errors
  "rust-error-handling-1": {
    title: "Result y el operador ?",
    summary: "Propaga la falla sin un solo match.",
  },
  "rust-error-handling-2": {
    title: "Tipos de error propios",
    summary: "Modela tus fallas como un enum en vez de un String.",
  },
  "rust-error-handling-3": {
    title: "From, Into y conversión automática",
    summary: "Haz que ? convierta un error ajeno en el tuyo, gratis.",
  },
  "rust-error-handling-4": {
    title: "Display, Debug y std::error::Error",
    summary: "Escribe los dos mensajes que un error te debe: el del operador y el del log.",
  },
  "rust-error-handling-5": {
    title: "Encadenamiento de errores y source()",
    summary: "Mantén la causa adjunta para que una línea de log cierre una investigación.",
  },
  "rust-error-handling-6": {
    title: "Cuándo panic! es lo correcto",
    summary: "Traza la línea entre un bug y una condición — y deja de hacer unwrap cruzándola.",
  },
  // collections
  "rust-collections-iterators-1": {
    title: "Vec, VecDeque y crecimiento",
    summary: "Elige entre ellos por el extremo donde haces push/pop, y deja de reasignar en un loop caliente.",
  },
  "rust-collections-iterators-2": {
    title: "HashMap vs BTreeMap",
    summary: "Elige por orden y complejidad, no por cuál escribiste la última vez.",
  },
  "rust-collections-iterators-3": {
    title: "iter, iter_mut e into_iter",
    summary: "Di qué te entrega cada uno, y qué le hace a la colección.",
  },
  "rust-collections-iterators-4": {
    title: "Adapters y laziness",
    summary: "Encadena map/filter/filter_map y explica por qué nada corrió hasta el collect.",
  },
  "rust-collections-iterators-5": {
    title: "fold, reduce y agregación a medida",
    summary: "Reemplaza un loop con acumulador mutable por una sola expresión.",
  },
  "rust-collections-iterators-6": {
    title: "Fn, FnMut y FnOnce",
    summary: "Predice qué trait implementa una closure a partir de lo que captura.",
  },
  "rust-collections-iterators-7": {
    title: "Closures move y capturas que escapan",
    summary: "Entrega una closure a algo que sobrevive a su scope, correctamente.",
  },
  // smart pointers
  "rust-smart-pointers-1": {
    title: "Box<T> y tipos recursivos",
    summary: "Dale a un enum recursivo un tamaño conocido.",
  },
  "rust-smart-pointers-2": {
    title: "Rc<T> y ownership compartido",
    summary: "Comparte una asignación entre varios dueños en un solo thread.",
  },
  "rust-smart-pointers-3": {
    title: "RefCell<T> y borrow en runtime",
    summary: "Mueve un chequeo de borrow de tiempo de compilación a runtime — y acepta el panic que eso compra.",
  },
  "rust-smart-pointers-4": {
    title: "Weak<T> y ciclos de referencia",
    summary: "Construye un grafo padre/hijo que de verdad se libera.",
  },
  "rust-smart-pointers-5": {
    title: "Cow<T> y asignar solo cuando toca",
    summary: "Devuelve datos prestados en el camino común, y propios en el camino raro.",
  },
  "rust-smart-pointers-6": {
    title: "Deref, DerefMut y punteros propios",
    summary: "Haz que tu wrapper se comporte como aquello que envuelve.",
  },
  // concurrency
  "rust-concurrency-1": {
    title: "Crear y unir threads",
    summary: "Corre trabajo en paralelo y recoge cada resultado de forma determinista.",
  },
  "rust-concurrency-2": {
    title: "Send y Sync",
    summary: "Di por qué Rc no es Send y Arc sí, a partir de la definición y no de memoria.",
  },
  "rust-concurrency-3": {
    title: "Arc<T>: ownership compartido entre threads",
    summary: "Comparte estado de solo lectura con N workers al costo de un atomic.",
  },
  "rust-concurrency-4": {
    title: "Mutex, guards y poisoning",
    summary: "Muta estado compartido con seguridad, y mantén la sección crítica corta a propósito.",
  },
  "rust-concurrency-5": {
    title: "RwLock y estado con muchas lecturas",
    summary: "Elige RwLock sobre Mutex con evidencia, y nombra el riesgo de starvation que asumiste.",
  },
  "rust-concurrency-6": {
    title: "Deadlocks y orden de locks",
    summary: "Reproduce un deadlock, y luego elimínalo con un orden global de locks.",
  },
  "rust-concurrency-7": {
    title: "Atomics y memory ordering",
    summary: "Usa fetch_add y compare_exchange, y justifica Relaxed vs Acquire/Release.",
  },
  "rust-concurrency-8": {
    title: "Channels y backpressure",
    summary: "Arma un productor/consumidor con mpsc y explica qué compra un channel acotado.",
  },
  // async
  "rust-async-internals-1": {
    title: "Un Future es una función poll",
    summary: "Implementa Future a mano y comprueba que no tiene nada de magia.",
  },
  "rust-async-internals-2": {
    title: "Nada corre sin un executor",
    summary: "Demuestra que una future sin await no hace absolutamente nada, y di por qué eso es una feature.",
  },
  "rust-async-internals-3": {
    title: "Construye block_on",
    summary: "Escribe un executor de verdad: Waker, RawWaker y un loop de park/unpark.",
  },
  "rust-async-internals-4": {
    title: "Scheduling cooperativo y llamadas bloqueantes",
    summary: "Explica por qué una sola llamada bloqueante frena un thread entero del runtime.",
  },
  "rust-async-internals-5": {
    title: "Cancelar es un drop",
    summary: "Haz que la limpieza sea correcta cuando un cliente se desconecta a mitad de la request.",
  },
  "rust-async-internals-6": {
    title: "Timeouts y select",
    summary: "Haz competir una future contra un plazo, y di qué lado ganó y qué se fugó.",
  },
  "rust-async-internals-7": {
    title: "Lo que Tokio agrega",
    summary: "Mapea cada pieza que construiste a su equivalente en Tokio: spawn, JoinHandle, select!, spawn_blocking.",
  },
  // systems edges
  "rust-systems-edges-1": {
    title: "Módulos, visibilidad y layout del crate",
    summary: "Usa mod, pub y pub(crate) para volver una invariante inquebrantable desde afuera.",
  },
  "rust-systems-edges-2": {
    title: "macro_rules! y macros declarativas",
    summary: "Escribe una macro que una función no podría haber reemplazado.",
  },
  "rust-systems-edges-3": {
    title: "Derive y macros procedurales",
    summary: "Di qué genera en realidad #[derive(Debug, Clone)], y dónde encaja Serde.",
  },
  "rust-systems-edges-4": {
    title: "unsafe: el contrato",
    summary: "Enuncia la invariante que un bloque unsafe asume — la habilidad por la que le pagan a un revisor.",
  },
  "rust-systems-edges-5": {
    title: "Punteros crudos y aliasing",
    summary: "Maneja *const/*mut T y nombra la garantía a la que acabas de renunciar.",
  },
  "rust-systems-edges-6": {
    title: 'FFI, extern "C" y la frontera del ABI',
    summary: "Pasa ownership a través de una frontera C sin fugas ni doble liberación.",
  },
  "rust-systems-edges-7": {
    title: "Dinero en enteros y aritmética checked",
    summary: "Maneja un saldo en enteros de punto fijo, y elige entre checked, saturating y wrapping a propósito.",
  },
  // ── backend / infra ───────────────────────────────────────────────────
  "backend-rpc-services-1": {
    title: "El envelope JSON-RPC 2.0 y sus cinco códigos de error",
    summary:
      "Clasifica cualquier request entrante en el código de error JSON-RPC correcto, y conoce los dos casos en que el id de la respuesta debe ser null en vez de devolverse tal cual.",
  },
  "backend-rpc-services-2": {
    title: "Notifications, batches y las requests que no debes responder",
    summary:
      "Implementa las dos reglas que rompen a los servidores JSON-RPC ingenuos: una notification no recibe respuesta alguna, y un batch vacío es en sí mismo una request inválida.",
  },
  "backend-rpc-services-3": {
    title: "Una tabla de dispatch de métodos con handlers en Box",
    summary:
      "Construye un router a partir de un HashMap de closures en Box, y separa las tres fallas que puede tener una llamada: el método no existe, argumentos malos, el handler explotó.",
  },
  "backend-rpc-services-4": {
    title: "Service y Layer: construir Tower a partir de dos traits",
    summary:
      "Escribe los dos traits de los que está hecho todo el ecosistema Tower, luego envuelve un backend en un timeout y demuestra que las requests que expiraron nunca le llegan.",
  },
  "backend-rpc-services-5": {
    title: "Límites de concurrencia y load shedding",
    summary:
      "Simula la misma sobrecarga bajo dos políticas de admisión y lee lo que encolar cuesta en realidad: los mismos éxitos, más 320ms de tiempo de backend gastado en respuestas que nadie puede usar.",
  },
  "backend-rpc-services-6": {
    title: "Un rate limiter token-bucket sobre un reloj simulado",
    summary:
      "Implementa token buckets por cliente con refill lazy, devuelve un retry_after sobre el que el cliente pueda actuar, y ve por qué el límite que configuras no es el límite que tu flota impone.",
  },
  "backend-rpc-services-7": {
    title: "Contratos de paginación: cursores, offsets y request IDs",
    summary:
      "Demuestra que la paginación por OFFSET pierde filas en silencio cuando la colección cambia a mitad del recorrido, y escribe el contrato de cursor que no las pierde.",
  },
  "backend-data-layer-1": {
    title: "Index scan vs seq scan: filas examinadas",
    summary:
      "Cuenta las filas examinadas en ambos planes y di a cuál favorecen los números.",
  },
  "backend-data-layer-2": {
    title: "Índices compuestos y el leftmost prefix",
    summary:
      "Di qué conjuntos de predicados puede servir un índice compuesto, y cuáles solo filtra.",
  },
  "backend-data-layer-3": {
    title: "El cost model detrás de EXPLAIN",
    summary:
      "Ponle precio a un index scan contra un seq scan y predice la elección del planner.",
  },
  "backend-data-layer-4": {
    title: "Paginación por cursor vs OFFSET",
    summary: "Reemplaza OFFSET por un cursor keyset y cuantifica lo que ahorra.",
  },
  "backend-data-layer-5": {
    title: "Niveles de aislamiento y las anomalías que permiten",
    summary:
      "Nombra qué anomalía permite cada nivel de aislamiento, y demuéstralo con un trace.",
  },
  "backend-data-layer-6": {
    title: "Transacciones, rollback y prepared statements",
    summary:
      "Implementa commit y rollback, y di qué reutiliza en realidad un prepared statement.",
  },
  "backend-data-layer-7": {
    title: "Connection pools y adónde se va la latencia",
    summary:
      "Lee la espera en cola de una simulación de pool y dimensiona un pool con un motivo.",
  },
  "backend-indexers-distsys-1": {
    title: "El pipeline del indexer y un cursor que sobrevive al restart",
    summary:
      "Construye el pipeline de cuatro etapas — fuente del ledger, cursor, procesador, store — y reinícialo a mitad del stream sin perder ni repetir trabajo.",
  },
  "backend-indexers-distsys-2": {
    title: "Haz commit del cursor después del efecto, nunca antes",
    summary:
      "Inyecta un crash entre las dos escrituras y mide ambos órdenes: cursor-primero pierde un evento en silencio, efecto-primero duplica uno — y solo uno de los dos es recuperable.",
  },
  "backend-indexers-distsys-3": {
    title: "Idempotencia bajo entrega at-least-once",
    summary:
      "Procesa un stream que duplica y reordena eventos, dos veces seguidas, y llega exactamente al estado que un feed exactly-once perfecto habría producido.",
  },
  "backend-indexers-distsys-4": {
    title: "Sobrevivir a un reorg: vuelve al fork, reaplica la rama",
    summary:
      "Detecta que un bloque entrante bifurca por debajo de tu head, deshaz los bloques huérfanos en orden decreciente de altura, y reaplica la rama ganadora.",
  },
  "backend-indexers-distsys-5": {
    title: "Estado de transacción como máquina de estados que rechaza",
    summary:
      "Codifica Received/Validating/Submitted/Pending/Confirmed/Failed como una tabla de transiciones cuyo brazo por defecto rechaza movimientos ilegales y deja el estado intacto.",
  },
  "backend-indexers-distsys-6": {
    title: "Aritmética de quorum: R + W > N, y lo que una partición le hace",
    summary:
      "Calcula qué configuraciones (N, R, W) garantizan que una lectura vea la última escritura, luego corre una partición 3|2 y mira al lado minoritario rechazar lecturas y escrituras.",
  },
  "backend-indexers-distsys-7": {
    title: "Ordenar eventos sin reloj: Lamport y vector stamps",
    summary:
      "Sella un trace de eventos distribuido con ambos tipos de reloj y muestra el par donde Lamport reporta un orden que la causalidad no respalda.",
  },
  "backend-production-1": {
    title: "Counters, gauges e histograms",
    summary:
      "Elige el instrumento correcto para una pregunta, y ve lo que cada uno no puede responder.",
  },
  "backend-production-2": {
    title: "Percentiles desde buckets, y por qué no puedes promediarlos",
    summary:
      "Calcula p50/p95/p99 a partir de conteos de bucket, y fusiona dos instancias sin mentir.",
  },
  "backend-production-3": {
    title: "Logs estructurados y un correlation ID",
    summary:
      "Pasa un solo ID por una cadena de llamadas y reconstruye una request completa a partir de un stream intercalado.",
  },
  "backend-production-4": {
    title: "Backoff, jitter y un retry budget",
    summary:
      "Acota la amplificación de retries con un budget en vez de esperar que la dependencia se recupere.",
  },
  "backend-production-5": {
    title: "Un circuit breaker como máquina de estados",
    summary:
      "Deja de mandar tráfico a una dependencia muerta, y sondéala de vuelta a la vida sin una estampida.",
  },
  "backend-production-6": {
    title: "Shutdown ordenado: drenar, plazo, cierre forzado",
    summary:
      "Saca un pod de rotación y termina su trabajo en vuelo sin que un deploy tire requests.",
  },
  "backend-production-7": {
    title: "Little's Law: un objetivo de latencia es un límite de concurrencia",
    summary:
      "Convierte un SLO de latencia en el número de requests concurrentes que tienes permitido admitir.",
  },
};
