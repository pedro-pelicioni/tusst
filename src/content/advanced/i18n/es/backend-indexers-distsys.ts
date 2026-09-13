import type { LessonStep } from "@/content/steps";

// ES · Indexers & Distributed Systems.
//
// Overlay for ../../steps/backend-indexers-distsys.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendIndexersDistsysStepsEs: Record<string, LessonStep[]> = {
  "backend-indexers-distsys-1": [
    {
      kind: "theory",
      body: `Un indexer son cuatro cosas y nada más.

| parte | trabajo |
| --- | --- |
| source | eventos del ledger ordenados, replayable desde cualquier punto |
| cursor | el número de secuencia del último evento que terminaste |
| processor | hace fold de un evento en el estado |
| store | guarda el estado plegado **y** el cursor |

La última fila es la que importa. Si el cursor vive en una variable local es una barra de progreso; si vive en el mismo store que los datos es un checkpoint, y un checkpoint es lo único que sobrevive a un \`SIGKILL\`.

\`\`\`rust
struct Store {
    balances: Vec<(&'static str, i64)>,
    cursor: u64,
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Retomar es un **filtro**, no un seek:

\`\`\`rust
if e.seq <= store.cursor {
    continue;
}
\`\`\`

Ese único predicado es toda la historia del restart. También es la razón por la que el contrato del source es "replayable desde un punto arbitrario" — un feed que solo puedes consumir una vez te obliga a hacer atómicos el cursor y el efecto, y eso no se puede hacer entre dos sistemas.

El processor es un fold. Mismo source, mismo cursor inicial, mismo estado final — que es lo que convierte re-indexar de un incidente en una operación de rutina que puedes correr un martes cualquiera.

El orden de iteración del store tiene que ser determinista o la salida no es reproducible, y un indexer no reproducible no se puede comparar contra un rebuild. Por eso el store aquí es un \`Vec\` de pares y no un \`HashMap\`: el orden de iteración de \`HashMap\` se aleatoriza por proceso, a propósito.`,
    },
    {
      kind: "quiz",
      question:
        "El store guarda saldos ya plegados. ¿Puedes reconstruir el cursor escaneándolo después de un crash?",
      options: [
        "No — el fold descartó los números de secuencia, así que el más alto que procesaste no se puede recuperar a partir de los saldos",
        "Sí — toma el número de secuencia máximo guardado en cada fila de cuenta",
        "Sí — la cantidad de eventos aplicados es igual al cursor, así que cuenta las filas",
      ],
      answer: 0,
      explain:
        "El cursor no es un cache de algo que los datos ya saben. Es estado independiente, y precisamente por eso hay que escribirlo.",
    },
    {
      kind: "fill",
      prompt:
        "Salta todo evento que el store ya plegó. El checkpoint nombra el último evento **terminado**, así que a ese evento en sí no se le debe hacer replay.",
      file: "main.rs",
      before: "for e in source {\n        if ",
      after: " {\n            continue;\n        }",
      choices: [
        "e.seq <= store.cursor",
        "e.seq < store.cursor",
        "e.seq == store.cursor",
      ],
      explain:
        "`<` hace replay del evento del checkpoint en cada restart — un duplicado justo en la costura, que es el tipo más difícil de detectar. `==` salta un evento y reprocesa todo lo que está debajo.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Guardar el progreso en memoria y reiniciar desde la secuencia 0 después de un crash es seguro cuando:",
      options: [
        "todo efecto del processor es idempotente, así que hacer replay de toda la historia converge al mismo estado",
        "el ledger es append-only, ya que nada por debajo del head puede cambiar",
        "el restart ocurre lo bastante rápido como para que no haya llegado ningún evento nuevo",
      ],
      answer: 0,
      explain:
        "Append-only no dice nada sobre tus efectos secundarios: un `+= delta` aplicado dos veces está mal por más inmutable que sea la fuente. La idempotencia son las próximas tres lecciones.",
    },
    {
      kind: "editor",
      intro: `### Indexa un ledger, que te maten, retoma

1. \`Store::apply\` suma \`e.delta\` a \`e.account\`, haciendo push de la cuenta si todavía no está.
2. \`run\` salta los eventos en o por debajo de \`store.cursor\`, aplica como máximo \`budget\` del resto, avanza \`store.cursor\` a \`e.seq\` después de cada apply, e imprime la línea de trace.
3. En \`main\`: run 1 con un budget de 5 (el crash), imprime el checkpoint, después run 2 sin límite, y después imprime la tabla de cuentas.

Salida esperada:

\`\`\`text
run 1: resume from cursor=0
  seq=1 alice   100
  seq=2 bob      50
  seq=3 alice   -30
  seq=4 carol    20
  seq=5 bob      -5
  checkpoint cursor=5
-- process killed, store survives --
run 2: resume from cursor=5
  seq=6 alice    60
  seq=7 carol    15
  seq=8 bob      25
  checkpoint cursor=8
account balance
alice       130
bob          70
carol        35
\`\`\`

La línea de trace es \`"  seq={} {:<6}{:>5}"\`; la fila de la tabla es \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-2": [
    {
      kind: "theory",
      body: `Cada paso de un indexer son **dos escrituras** — el efecto sobre el store, y el commit del cursor. Un crash puede caer entre las dos, y su orden decide qué modo de falla te toca. No hay tercera opción salvo una transacción que cubra ambas.

**Cursor primero** da at-most-once. El checkpoint dice que \`seq=3\` está hecho, el saldo nunca se movió, ningún restart lo vuelve a leer. La corrida termina con \`total=120\` contra un esperado de \`150\` y no reporta ningún error.

**Efecto primero** da at-least-once. El efecto entró, el checkpoint no, así que el restart hace replay de \`seq=3\` y llega a \`180\`. Mal — pero mal en una dirección que una dedupe key puede arreglar.`,
    },
    {
      kind: "theory",
      body: `| orden | crash entre las escrituras | ¿recuperable? |
| --- | --- | --- |
| cursor primero | evento saltado en silencio | no — re-index completo |
| efecto primero | evento aplicado dos veces | sí — dedupe por el id del evento |

At-least-once es, por tanto, la garantía de entrega sobre la que **construyes**, no una que toleras. "Exactly-once" en un message broker significa entrega at-least-once más procesamiento idempotente en el consumidor; el broker te está vendiendo la mitad que todavía tienes que escribir.

Si el efecto y el cursor viven en la misma base de datos, una transacción que cubra ambos elimina el problema por completo. La pregunta del orden es la que enfrentas en el momento en que no es así — filas en Postgres, cursor en Redis — y esa separación suele introducirla, por una razón de latencia, alguien que no sabía que estaba eligiendo un modo de falla.`,
    },
    {
      kind: "quiz",
      question:
        "\"Haz commit del cursor primero, y así nunca haces el trabajo dos veces.\" ¿Qué tiene de malo?",
      options: [
        "Nunca lo haces dos veces porque a veces no lo haces ninguna — el evento saltado es irrecuperable y se reporta como éxito",
        "Nada; es el orden correcto, y los duplicados son la falla más seria",
        "Está mal solo porque la escritura del cursor es más lenta que la escritura del efecto",
      ],
      answer: 0,
      explain:
        "La corrida sale con 0, el log está limpio, y al total le falta un evento. Te enteras por un job de reconciliación, semanas después, si es que tienes uno.",
    },
    {
      kind: "fill",
      prompt:
        "Efecto primero: el commit del cursor es la **última** escritura del brazo, pasado el punto de crash. Haz commit de la secuencia que de verdad acabas de aplicar.",
      file: "main.rs",
      before:
        "store.total += e.amount;\n            store.applies += 1;\n            if e.seq == crash_at {\n                return true;\n            }\n            ",
      after: "\n        }",
      choices: [
        "store.cursor = e.seq;",
        "store.cursor += 1;",
        "store.cursor = e.seq - 1;",
      ],
      explain:
        "`+= 1` asume que los números de secuencia son contiguos — un solo hueco en el feed y el cursor se queda atrás para siempre. `- 1` vuelve a leer el evento que acabas de terminar en cada restart.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué un evento perdido y un evento duplicado no son bugs simétricos?",
      options: [
        "El duplicado es recuperable a partir de datos que todavía tienes; la pérdida necesita una fuente a la que quizá ya no puedas hacer replay",
        "Son simétricos — ambos dejan el total mal por el monto de un evento",
        "El duplicado es peor, porque corrompe el estado mientras que la pérdida solo lo retrasa",
      ],
      answer: 0,
      explain:
        "Un duplicado es un bug que arreglas hacia adelante con una dedupe key. Una pérdida es un bug que solo arreglas releyendo la historia — suponiendo que la ventana de retención no haya pasado.",
    },
    {
      kind: "editor",
      intro: `### Mide los dos órdenes contra un mismo crash

1. \`drain\` recorre los eventos más allá de \`store.cursor\`. Bajo \`CursorFirst\` hace commit del cursor **antes** del efecto; bajo \`EffectFirst\`, **después**. Devuelve \`true\` cuando llega a \`e.seq == crash_at\`, dejando atrás el estado a medio terminar.
2. En \`main\`, corre ambos órdenes con \`crash_at = 3\`, reinicia cada uno después del crash (\`crash_at = 0\` nunca coincide), y después imprime la tabla resumen y las dos líneas de veredicto.

Salida esperada:

\`\`\`text
cursor-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=3
  seq=4 total=70 cursor=4
  seq=5 total=120 cursor=5
effect-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=2
  seq=3 total=90 cursor=3
  seq=4 total=130 cursor=4
  seq=5 total=180 cursor=5
ordering      applies  total  expected
cursor-first        4    120       150
effect-first        6    180       150
cursor-first lost seq=3: no restart can recover it
effect-first applied seq=3 twice: dedupe can recover it
\`\`\`

La línea de trace se imprime solo cuando el paso se completa; la fila del resumen es \`"{:<14}{:>7}{:>7}{:>10}"\`.`,
    },
  ],

  "backend-indexers-distsys-3": [
    {
      kind: "theory",
      body: `At-least-once significa que a tu consumidor le pueden pasar tres cosas distintas, y las tres aparecen en el slice \`delivered\` de esta lección:

- el mismo id de evento llega **dos veces** (id 2),
- los eventos llegan **fuera de orden** (id 3 antes que id 2),
- el stream entero se **vuelve a entregar** después de un restart (pass 2).

La idempotencia es una propiedad del *processor*, no del transporte. Guarda el conjunto de ids de evento aplicados en el mismo store que los datos, revísalo antes del efecto, y regístralo como parte de la misma escritura.

\`\`\`rust
fn apply_idempotent(&mut self, e: Event) {
    if self.seen.contains(&e.id) {
        return;
    }
    self.seen.push(e.id);
    self.credit(e.account, e.amount);
}
\`\`\`

El processor ingenuo sube de 305 → 610 a lo largo de dos pasadas. El idempotente se queda en 265 — el total exactly-once — las dos veces.`,
    },
    {
      kind: "theory",
      body: `**La dedupe key tiene que ser el id de evento asignado por el productor.** Hashear el payload confunde dos eventos legítimamente idénticos: los ids 2 y 5 son ambos \`bob, 40\` y son dos pagos distintos, mientras que la segunda entrega del id 2 es el mismo pago dos veces. Un hash ve un caso; el id ve ambos.

**Independencia del orden e independencia de duplicados son propiedades separadas.** Acreditar un saldo es conmutativo, así que reordenar no cuesta nada en esta lección. Una operación de \`set\` no es conmutativa, y necesita una guarda de versión o de secuencia — "aplica solo si \`e.version > row.version\`" — encima del dedupe.

**El seen-set aquí es ilimitado y en producción no debe serlo.** Acótalo con un índice único sobre el id del evento (el insert falla, la transacción hace rollback, el efecto nunca entra), o con una ventana anclada al cursor, ya que nada por debajo del checkpoint puede reaparecer legítimamente.`,
    },
    {
      kind: "quiz",
      question:
        "Tu broker anuncia entrega exactly-once. ¿Qué sigue habiendo que escribir en el consumidor?",
      options: [
        "El dedupe del lado del consumidor — exactly-once es entrega at-least-once más procesamiento idempotente, y el broker solo aporta la primera mitad",
        "Nada, siempre que el consumidor haga ack de cada mensaje antes de procesarlo",
        "Solo una política de retry; la transacción del broker cubre las escrituras del consumidor",
      ],
      answer: 0,
      explain:
        "La transacción de un broker cubre su propio log. No puede cubrir una escritura en tu base de datos, así que en el momento en que tu efecto sale del broker la garantía se acaba.",
    },
    {
      kind: "fill",
      prompt:
        "Haz dedupe por la identidad del evento asignada por el productor, no por lo que el evento resulta decir.",
      file: "main.rs",
      before: "fn apply_idempotent(&mut self, e: Event) {\n        if self.seen.contains(",
      after: ") {\n            return;\n        }",
      choices: ["&e.id", "&e.amount", "&e.account"],
      explain:
        "Haz dedupe por el monto y el id 5 — un segundo pago real de 40 a bob — desaparece junto con el dinero. Haz dedupe por la cuenta y aplicas exactamente un evento por cuenta, para siempre.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué un hash del payload del evento es una mala dedupe key para un feed de pagos?",
      options: [
        "Dos transferencias legítimamente idénticas dan el mismo hash, así que la segunda se descarta en silencio",
        "Hashear es demasiado lento para correrlo en cada evento a volumen de producción",
        "Los hashes de payload colisionan lo suficiente como para confundir eventos no relacionados",
      ],
      answer: 0,
      explain:
        "La falla no es una colisión en el sentido criptográfico — los dos eventos de verdad son idénticos byte a byte. Y aun así son dos pagos distintos.",
    },
    {
      kind: "editor",
      intro: `### Haz idempotente el processor

1. \`apply_naive\` acredita incondicionalmente.
2. \`apply_idempotent\` retorna temprano cuando \`e.id\` ya está en \`self.seen\`; si no, registra el id y acredita.
3. En \`main\`, alimenta \`delivered\` a ambos stores **dos veces**, imprimiendo una fila por pasada, después el total exactly-once, la tabla de saldos del idempotente y el tamaño del seen-set.

Salida esperada:

\`\`\`text
pass  naive  idempotent
   1    305         265
   2    610         265
exactly-once total: 265
account balance
alice       125
bob          80
carol        60
distinct event ids retained: 5
\`\`\`

La fila de pasada es \`"{:>4}{:>7}{:>12}"\`; la fila de saldo es \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-4": [
    {
      kind: "theory",
      body: `El **parent hash** de un bloque, no su altura, es lo que te dice si extiende tu cadena.

\`\`\`text
genesis - a1 - a2 - a3 - a4 - a5          <- head indexado
               \\
                b3 - b4 - b5 - b6         <- llega, parent = a2
\`\`\`

\`b3\` llega a altura 3 mientras el head es \`a5\`. Solo por la altura, eso parece un duplicado, o un feed que saltó hacia atrás. Por el \`parent\` no hay ambigüedad: bifurca por debajo del head, así que tres bloques tuyos acaban de quedar huérfanos.

El rollback corre **del head hacia abajo**, aplicando el inverso del efecto de cada bloque, y se detiene en el punto de fork. El orden inverso importa en el momento en que los efectos dejan de conmutar; deshacer hacia adelante produce un store que ninguna rama tuvo jamás.`,
    },
    {
      kind: "theory",
      body: `Deshacer exige que hayas guardado lo suficiente para invertir. Guardar los bloques aplicados junto a los saldos es la versión barata — un indexer de verdad mantiene un undo log o snapshots por altura, porque "recalcular desde el genesis" no es un tiempo de respuesta.

**Confirmado no es final.** Los 20 de carol se acreditaron a altura 4 y se sostuvieron dos bloques; después del reorg su saldo es 0 y la fila sobrevive solo como evidencia. La finalidad es la profundidad a la que *dejas de estar dispuesto a deshacer* — una política que eliges, no una propiedad que el bloque trae consigo.

De esto es de lo que pending-versus-confirmed te está protegiendo en realidad. Todo lo que expusiste como confirmado por encima del fork ahora hay que retractarlo río abajo, y por eso un indexer emite eventos de reorg y no simples updates de fila: un consumidor que solo ve el saldo nuevo no tiene forma de distinguir una corrección de un pago.`,
    },
    {
      kind: "quiz",
      question:
        "El head es `a5`. `b6` llega a altura 6 en una rama que bifurca en `a2`. ¿Por qué no simplemente hacer fast-forward a la cadena más larga?",
      options: [
        "Aplicar `b3..b6` encima de `a5` conserva los efectos de `a3`, `a4` y `a5`, produciendo un estado que ninguna cadena tuvo jamás",
        "Está bien siempre que la rama sea estrictamente más larga — esa es la regla de la cadena más larga",
        "Está bien, pero solo después de volver a verificar las firmas de `b3..b6`",
      ],
      answer: 0,
      explain:
        "La regla de la cadena más larga dice qué rama es la canónica. No dice nada sobre cómo llevar tu store hasta ahí, y tu store está sosteniendo ahora mismo los efectos de tres bloques que esa rama nunca contuvo.",
    },
    {
      kind: "fill",
      prompt:
        "Ubica el punto de fork: el bloque de tu cadena que la rama entrante nombra como su parent.",
      file: "main.rs",
      before: "let fork = ix\n        .chain\n        .iter()\n        .position(|b| ",
      after: ")\n        .map(|i| ix.chain[i].height)\n        .unwrap_or(0);",
      choices: [
        "b.hash == branch[0].parent",
        "b.height == branch[0].height",
        "b.parent == branch[0].parent",
      ],
      explain:
        "Coincidir por altura encuentra `a3` — el bloque que está quedando huérfano — y hace rollback hasta 3, dejando `a3` aplicado. Coincidir parent con parent encuentra al hermano `a3` por la misma razón: ambos nombran `a2`.",
      answer: 0,
    },
    {
      kind: "quiz",
      question: "¿Qué te dan en realidad \"seis confirmaciones\"?",
      options: [
        "Un costo de reversión lo bastante alto como para que elijas dejar de deshacer — un argumento económico, no una garantía",
        "Una garantía del protocolo de que un bloque a esa profundidad ya no puede ser reemplazado",
        "Una garantía en operación normal, inválida solo si la cadena es atacada",
      ],
      answer: 0,
      explain:
        "Seis es un umbral que alguien eligió. Tu indexer sigue necesitando un camino de rollback, porque el número que ayer lo hacía antieconómico es un parámetro de un mercado.",
    },
    {
      kind: "editor",
      intro: `### Haz rollback hasta el fork, reaplica la rama

1. \`apply\` acredita el bloque, le hace push a la cadena, e imprime la línea de apply.
2. \`rollback_to\` saca los bloques por encima de \`height\` del head hacia abajo, acreditando el delta **inverso** de cada uno e imprimiendo una línea de rollback.
3. En \`main\`: indexa la cadena canónica y reporta; encuentra el fork ubicando \`branch[0].parent\` en la cadena; haz rollback; aplica la rama; reporta; imprime la línea de cierre sobre carol.

Salida esperada:

\`\`\`text
  apply    a1 height=1 alice +100
  apply    a2 height=2 bob +50
  apply    a3 height=3 alice +30
  apply    a4 height=4 carol +20
  apply    a5 height=5 bob +10
head=a5 height=5
  alice    130
  bob       60
  carol     20
b3 arrives: parent=a2, our head=a5 -> reorg
  rollback a5 height=5 bob -10
  rollback a4 height=4 carol -20
  rollback a3 height=3 alice -30
  fork point height=2 hash=a2
  apply    b3 height=3 alice +5
  apply    b4 height=4 dave +70
  apply    b5 height=5 bob +10
  apply    b6 height=6 alice +15
head=b6 height=6
  alice    120
  bob       60
  carol      0
  dave      70
carol was credited in a4 and confirmed for 2 blocks; that credit is now gone
\`\`\`

Ambas líneas de trace usan \`{:+}\` para el delta, así que el signo siempre se imprime.`,
    },
  ],

  "backend-indexers-distsys-5": [
    {
      kind: "theory",
      body: `Una columna de status con seis valores string no es una máquina de estados. La máquina es la **relación de transición**:

\`\`\`rust
fn allowed(from: Status, to: Status) -> bool {
    match (from, to) {
        (Status::Received, Status::Validating) => true,
        (Status::Validating, Status::Submitted) => true,
        (Status::Submitted, Status::Pending) => true,
        (Status::Pending, Status::Confirmed) => true,
        // ... todo estado puede fallar ...
        _ => false,
    }
}
\`\`\`

Su valor está enteramente en aquello para lo que devuelve **false**. El catch-all \`_ => false\` es el diseño, no una formalidad: toda arista que no escribiste se rechaza por construcción, así que agregar un séptimo status más adelante falla cerrado en vez de permitir en silencio una docena de transiciones nuevas.`,
    },
    {
      kind: "theory",
      body: `**Los estados terminales son los que no tienen brazo de salida.** \`Confirmed\` y \`Failed\` reportan 0 transiciones de salida cada uno, y así es como un webhook duplicado que llega tarde intentando mover una transacción confirmada de vuelta a \`Pending\` es rechazado en vez de resucitarla.

**Una transición rechazada tiene que dejar el estado sin cambios y ser contada.** Tres de las siete propuestas aquí se rechazan y la transacción igual termina en \`Confirmed\`. Un rechazo sin log es un incidente que más tarde vas a investigar desde cero, porque la única evidencia de que ocurrió fue un branch que retornó temprano.

**\`Submitted → Confirmed\` se rechaza** aunque sea el desenlace que todo el mundo quiere. Saltarse \`Pending\` significa que no queda registro de que la transacción estuvo en la mempool, y un cliente que hace polling por \`Pending\` nunca la ve — así que su lógica de retry, su timer y su UI se apoyan todos en una arista que nunca se disparó.`,
    },
    {
      kind: "quiz",
      question:
        "La transacción termina `Confirmed` de todos modos. ¿Qué te cuesta saltarte `Submitted → Pending → Confirmed`?",
      options: [
        "El audit trail, y todo consumidor que observa la arista intermedia en vez del estado final",
        "Nada medible — los estados intermedios existen para la UI, y el estado terminal es el que manda",
        "Solo las métricas de tiempo entre los dos estados",
      ],
      answer: 0,
      explain:
        "La pregunta de la reconciliación no es \"¿está confirmada?\" sino \"¿cómo llegó ahí?\". Sin la fila intermedia, una transacción que nunca se transmitió y una que se minó en un segundo se ven idénticas.",
    },
    {
      kind: "fill",
      prompt:
        "Cierra la tabla de transiciones. Toda arista que no esté escrita arriba debe rechazarse, y los estados terminales deben seguir siendo terminales.",
      file: "main.rs",
      before: "(Status::Pending, Status::Failed) => true,\n        ",
      after: "\n    }",
      choices: ["_ => false,", "(_, Status::Failed) => true,", "_ => true,"],
      explain:
        "`(_, Status::Failed) => true` se lee como \"cualquier cosa puede fallar\" y permite calladamente `Confirmed → Failed`, destruyendo la terminalidad. `_ => true` invierte la máquina en una tabla de cosas que por casualidad prohíbes.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "¿Dónde va la verificación de transición — en el handler de la API, o junto al estado?",
      options: [
        "Junto al estado, porque el handler de reorg, el job de backfill y el fix manual escriben todos la misma columna y ninguno pasa por el handler",
        "En el handler de la API, ya que ahí es donde llega toda petición externa y donde hay que devolver el error",
        "En ambos, duplicada, para que el handler pueda devolver un 409 sin un round trip",
      ],
      answer: 0,
      explain:
        "Una regla aplicada en uno de varios puntos de entrada no es una regla, es una convención. Los escritores que la esquivan son exactamente los que corren sin supervisión a las 3 de la mañana.",
    },
    {
      kind: "editor",
      intro: `### Codifica la máquina, y haz que rechace

1. \`allowed\` hace match sobre \`(from, to)\`: un brazo por arista legal, \`_ => false\` para todo lo demás. \`Confirmed\` y \`Failed\` **no** reciben brazo de salida.
2. \`Tx::transition\` aplica el movimiento si \`allowed\`, si no incrementa \`rejected\` y deja el estado intacto — imprimiendo la línea from/to/veredicto en ambos casos.
3. En \`main\`, dispara cada transición propuesta, imprime la línea final, y después cuenta las aristas de salida de cada estado terminal.

Salida esperada:

\`\`\`text
from        -> to          verdict
Received    -> Validating  accepted
Validating  -> Submitted   accepted
Submitted   -> Confirmed   REJECTED
Submitted   -> Pending     accepted
Pending     -> Confirmed   accepted
Confirmed   -> Failed      REJECTED
Confirmed   -> Pending     REJECTED
final=Confirmed rejected=3
Confirmed has 0 outgoing transitions
Failed has 0 outgoing transitions
\`\`\`

La línea de veredicto es \`"{:<11} -> {:<11} accepted"\` / \`... REJECTED\`.`,
    },
  ],

  "backend-indexers-distsys-6": [
    {
      kind: "theory",
      body: `La garantía de solapamiento es estrictamente \`R + W > N\`. No \`>=\`.

| N | R | W | R+W | solapa | write sobrevive | read sobrevive |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | 1 | 1 | 2 | no | 2 | 2 |
| 3 | 2 | 2 | 4 | sí | 1 | 1 |
| 3 | 1 | 3 | 4 | sí | 0 | 2 |
| 3 | 3 | 1 | 4 | sí | 2 | 0 |
| 5 | 2 | 3 | 5 | **no** | 2 | 3 |
| 5 | 3 | 3 | 6 | sí | 2 | 2 |

La fila cinco es la configuración que la gente lleva a producción creyendo que es segura. R+W es igual a N, así que un quorum de lectura de dos nodos puede ser completamente disjunto de los tres que aceptaron la escritura. Devuelve datos stale, sin error y sin forma de que quien llama lo note.`,
    },
    {
      kind: "theory",
      body: `R y W son dos perillas que se intercambian **entre sí**, no contra una "consistencia" abstracta. Con N=3, \`W=1\` tolera dos fallas de nodo en escritura y cero en lectura; \`W=3\` lo invierte. La latencia sigue la misma curva, porque cada quorum espera a su miembro más lento — así que subir W sube el p99 específicamente en el camino de escritura.

Una partición no pide permiso. Con N=5, W=3 y un split 3|2, el lado mayoritario todavía reúne quorum y hace commit de la versión 2; el lado minoritario tiene dos nodos alcanzables y no llega ni a R=3 ni a W=3, así que rechaza ambos.

Ese rechazo **es** la elección CP, y la hiciste cuando elegiste R y W. Servir la versión 1 stale de n4/n5 habría sido la elección AP — disponible, y equivocada. CAP no es una propiedad de la red; es cuál de esas dos líneas llevaste a producción.

Los números de versión, no los timestamps de reloj de pared, son lo que hace resoluble la lectura: el lector toma la versión más alta entre las respuestas que sí recibió.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué `R + W >= N` no es la regla de quorum?",
      options: [
        "En la igualdad los dos quorums pueden ser disjuntos — N=5, R=2, W=3 tiene un conjunto de lectura que no toca ninguno de los tres nodos que aceptaron la escritura",
        "Sí es la regla; la forma estricta es una convención conservadora con un nodo de holgura",
        "Falla por uno solo para N par, donde no existe mayoría",
      ],
      answer: 0,
      explain:
        "Palomar: R+W > N fuerza al menos un nodo a estar en ambos conjuntos. Con R+W = N hay exactamente el espacio justo para que se eviten, y la lectura stale es silenciosa.",
    },
    {
      kind: "fill",
      prompt:
        "Enuncia la condición de solapamiento. Tiene que forzar al menos un nodo a estar tanto en el conjunto de lectura como en el de escritura.",
      file: "main.rs",
      before: "let overlaps = ",
      after: ";",
      choices: ["r + w > n", "r + w >= n", "w > n / 2"],
      explain:
        "`>=` admite la fila N=5/R=2/W=3 de arriba. `w > n / 2` es la regla de mayoría del lado de *escritura* — hace que las escrituras concurrentes se serialicen, pero no dice nada sobre si un lector las ve.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Durante la partición 3|2, ¿puede el lado minoritario seguir sirviendo lecturas \"apenas un poco atrasadas\"?",
      options: [
        "Solo si pones R en 2 o menos, que es el trade hecho explícito — y entonces las lecturas del lado mayoritario también pierden su garantía de solapamiento",
        "Sí — las lecturas son seguras durante una partición; solo las escrituras necesitan quorum",
        "Sí, siempre que marque la respuesta como potencialmente stale",
      ],
      answer: 0,
      explain:
        "R es un solo número para todo el cluster. No puedes bajarlo para la minoría particionada y mantenerlo alto en todo lo demás, y por eso la elección se hace en tiempo de configuración y no durante el incidente.",
    },
    {
      kind: "editor",
      intro: `### Calcula el solapamiento, después particiona el cluster

1. \`write\` rechaza a menos que el lado alcanzable pueda reunir W nodos; si no, escribe la versión y el valor en todos ellos.
2. \`read\` rechaza a menos que el lado pueda reunir R nodos; si no, devuelve la **versión más alta** vista.
3. En \`main\`: imprime la tabla de quorum para \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\`, después corre una partición 3|2 con N=5, R=3, W=3 — escribe versión 2 / valor 250 en cada lado, lee de cada lado, e imprime la línea de cierre sobre AP.

Salida esperada:

\`\`\`text
 N  R  W  R+W  overlaps  write survives  read survives
 3  1  1    2  no                     2              2
 3  2  2    4  yes                    1              1
 3  1  3    4  yes                    0              2
 3  3  1    4  yes                    2              0
 5  2  3    5  no                     2              3
 5  3  3    6  yes                    2              2
N=5 R=3 W=3, partition {n1,n2,n3} | {n4,n5}
  majority write v=2: ok
  minority write v=2: refused
  majority read: version=2 value=250
  minority read: refused
  minority still holds version=1 on n4,n5: serving that read is the AP choice
\`\`\`

La fila de la tabla es \`"{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}"\`; las columnas de supervivencia son \`n - w\` y \`n - r\`.`,
    },
  ],

  "backend-indexers-distsys-7": [
    {
      kind: "theory",
      body: `Un reloj de Lamport son dos reglas: haz tick de tu contador en cada evento, y al recibir un mensaje sube tu contador hasta al menos el stamp del remitente antes de hacer tick.

Eso garantiza que \`a → b\` implica \`L(a) < L(b)\`. Es todo lo que el reloj prometió jamás, y **la recíproca es falsa**:

| par | lamport | causalidad |
| --- | --- | --- |
| a2, b2 | 2 < 3 | happens-before |
| c1, a2 | 1 < 2 | concurrentes |
| b1, c1 | 1 = 1 | concurrentes |

\`c1\` tiene un stamp menor que \`a2\` y no hay camino causal entre ellos. Así que "last write wins por timestamp de Lamport" es elegir un ganador arbitrario entre escrituras concurrentes y presentarlo como una respuesta.`,
    },
    {
      kind: "theory",
      body: `Un **vector clock** mantiene un contador por nodo, hace tick solo de su propia componente, y toma el máximo elemento a elemento al recibir.

\`\`\`rust
fn happens_before(a: &[u64; 3], b: &[u64; 3]) -> bool {
    let mut strict = false;
    for i in 0..3 {
        if a[i] > b[i] { return false; }
        if a[i] < b[i] { strict = true; }
    }
    strict
}
\`\`\`

\`a ≤ b\` componente a componente con al menos una estrictamente menor significa \`a → b\`. Ninguna de las dos direcciones significa **concurrentes** — un veredicto que Lamport estructuralmente no puede producir.

El costo está en la forma del stamp: O(1) por evento para Lamport, O(nodos) para vectores. Por eso los vectores no sobreviven al contacto con un sistema que agrega nodos libremente, y por eso la detección de conflictos suele acotarse a una clave y no a todo el cluster.

Concurrente es una respuesta real, no una incapacidad de decidir. Detectarlo es lo que te permite exponer versiones hermanas, un merge, o una pregunta al usuario, en vez de descartar en silencio una de dos escrituras que nunca se vieron.`,
    },
    {
      kind: "quiz",
      question: "`L(a) < L(b)`. ¿Qué te dice eso sobre la causalidad?",
      options: [
        "Nada — es consistente con `a → b` y con que `a` y `b` sean concurrentes, como muestra la fila c1/a2",
        "Que `a` ocurrió antes que `b`, que es la garantía que dan los relojes de Lamport",
        "Que `a` ocurrió antes que `b`, salvo que los dos eventos estén en el mismo nodo",
      ],
      answer: 0,
      explain:
        "La implicación corre en una sola dirección: la causalidad implica stamps ordenados, nunca al revés. La contrapositiva sigue siendo útil — `L(a) >= L(b)` prueba que `a` no causó `b`.",
    },
    {
      kind: "fill",
      prompt:
        "La regla de recepción de un vector clock: toma el máximo elemento a elemento entre tu vector y el del remitente, componente por componente.",
      file: "main.rs",
      before: "for k in 0..3 {\n                if ",
      after:
        " {\n                    vector[e.node][k] = vector_of[src][k];\n                }\n            }",
      choices: [
        "vector_of[src][k] > vector[e.node][k]",
        "vector_of[src][k] != vector[e.node][k]",
        "vector_of[src][k] > vector[e.node][e.node]",
      ],
      explain:
        "`!=` copia el valor del remitente incluso cuando el tuyo es mayor, descartando historia que ya habías observado. Comparar contra `vector[e.node][e.node]` compara cada componente contra tu propio contador.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "NTP mantiene la flota dentro de unos pocos milisegundos. ¿Por qué no ordenar los eventos por reloj de pared?",
      options: [
        "El skew excede rutinariamente el intervalo que intentas ordenar, y ninguna cota sobre él es exigible — un receive puede traer un timestamp anterior al de su send",
        "Los relojes de pared sirven para ordenar; los relojes lógicos existen solo para ahorrar los bytes que cuesta un timestamp",
        "Porque los timestamps tienen resolución de milisegundos, y los empates no se pueden romper",
      ],
      answer: 0,
      explain:
        "Una pausa de VM, un leap-second smear o un peer NTP malo mueven un reloj más que los microsegundos que separan dos escrituras a la misma clave. Los relojes lógicos existen porque esa cota no se puede exigir.",
    },
    {
      kind: "editor",
      intro: `### Sella un trace con los dos relojes

1. \`happens_before\` es true cuando toda componente de \`a\` es \`<=\` la de \`b\` y al menos una es estrictamente menor.
2. Recorre los eventos en orden. En una entrega, sube el contador de Lamport de este nodo hasta el stamp del remitente y toma el máximo elemento a elemento del vector del remitente; después haz tick del contador de Lamport del nodo y de su propia componente del vector. Registra ambos stamps por evento e imprime la tabla.
3. Imprime las filas de veredicto para los pares \`(a2,b2)\`, \`(c1,a2)\` y \`(b1,c1)\` — índices de evento \`(1,3)\`, \`(4,1)\` y \`(2,4)\`.

Salida esperada:

\`\`\`text
ev  node  lamport  vector
a1  A     1        [1,0,0]
a2  A     2        [2,0,0]
b1  B     1        [0,1,0]
b2  B     3        [2,2,0]
c1  C     1        [0,0,1]
b3  B     4        [2,3,0]
c2  C     5        [2,3,2]
pair    lamport  vector verdict
a2,b2   2 < 3    happens-before
c1,a2   1 < 2    concurrent
b1,c1   1 = 1    concurrent
a smaller lamport stamp does not mean caused-by: see c1,a2
\`\`\`

La letra del nodo sale de \`["A", "B", "C"][e.node]\`; la línea de trace es \`"{}  {}     {}        [{},{},{}]"\` y la línea de veredicto es \`"{},{}   {} {} {}    {}"\`.`,
    },
  ],
};
