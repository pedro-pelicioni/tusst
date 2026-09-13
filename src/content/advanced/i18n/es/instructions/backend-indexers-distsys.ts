// ES · editor instructions — Indexers & Distributed Systems.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-indexers-distsys.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendIndexersDistsysInstructionsEs: Record<string, { instructions: string }> = {
  "backend-indexers-distsys-1": {
    instructions: `## Indexa un ledger, que te maten, retoma

Un indexer son cuatro cosas: un **source** de eventos del ledger ordenados, un **cursor** que nombra el último que terminaste, un **processor** que hace fold de cada evento en el estado, y un **store** que guarda ambos. El cursor vive en el store — eso es lo que lo convierte en un checkpoint y no en una variable.

Retomar es un filtro, no un seek: \`e.seq <= store.cursor\` se salta. El store es un \`Vec\` de pares y no un \`HashMap\` porque el orden de iteración tiene que ser determinista para que la salida sea reproducible.

El parámetro \`budget\` hace las veces del crash.

### Tu tarea

1. \`Store::apply\` suma \`e.delta\` a \`e.account\`, haciendo push de la cuenta si todavía no está.
2. \`run\` salta los eventos en o por debajo de \`store.cursor\`, aplica como máximo \`budget\` del resto, avanza \`store.cursor\` a \`e.seq\` después de cada apply, e imprime la línea de trace.
3. En \`main\`: run 1 con un budget de 5, imprime el checkpoint, imprime la línea del kill, después run 2 con \`usize::MAX\`, imprime el checkpoint, y después imprime la tabla de cuentas.

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

### Pistas

- Línea de trace: \`println!("  seq={} {:<6}{:>5}", e.seq, e.account, e.delta);\`
- Fila de la tabla: \`println!("{:<8}{:>7}", account, balance);\`
- Cuenta los eventos aplicados en un \`done\` local y haz \`break\` cuando llegue a \`budget\` — el \`continue\` de los eventos ya procesados tiene que ir primero, o el budget se gasta en saltos.
`,
  },

  "backend-indexers-distsys-2": {
    instructions: `## Mide los dos órdenes contra un mismo crash

Cada paso de un indexer son dos escrituras — el efecto sobre el store, y el commit del cursor — y un crash puede caer entre las dos.

**Cursor primero** es at-most-once: el checkpoint dice que \`seq=3\` está hecho, el saldo nunca se movió, y ningún restart lo vuelve a leer. **Efecto primero** es at-least-once: el efecto entró, el checkpoint no, así que el restart hace replay de \`seq=3\`. Uno de los dos es recuperable a partir de datos que todavía tienes.

### Tu tarea

1. \`drain\` recorre los eventos más allá de \`store.cursor\`. Bajo \`Order::CursorFirst\` hace commit del cursor **antes** del efecto; bajo \`Order::EffectFirst\`, **después**. Devuelve \`true\` cuando llega a \`e.seq == crash_at\`, dejando atrás el estado a medio terminar, e imprime la línea de trace solo para los pasos que se completan.
2. En \`main\`, para cada orden: construye un \`Store\` nuevo, imprime la etiqueta, haz drain con \`crash_at = 3\`, y si hubo crash imprime la línea de restart y vuelve a hacer drain con \`crash_at = 0\`.
3. Después imprime la tabla resumen y las dos líneas de veredicto.

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

### Pistas

- Trace: \`println!("  seq={} total={} cursor={}", e.seq, store.total, store.cursor);\`
- Fila del resumen: \`println!("{:<14}{:>7}{:>7}{:>10}", label(*order), applies, total, expected);\`
- \`for order in [Order::CursorFirst, Order::EffectFirst]\` itera un array por valor porque \`Order\` es \`Copy\`.
- Recolecta \`(order, store.total, store.applies)\` en un \`Vec\` para que la tabla se imprima después de ambas corridas.
`,
  },

  "backend-indexers-distsys-3": {
    instructions: `## Haz idempotente el processor

At-least-once significa que el mismo id de evento puede llegar dos veces, que los eventos pueden llegar fuera de orden, y que el stream entero se puede volver a entregar después de un restart. Las tres cosas pasan en \`delivered\`.

La idempotencia es una propiedad del processor, no del transporte: guarda los ids de evento aplicados en el mismo store que los datos, revisa antes del efecto, registra como parte de la misma escritura. La dedupe key tiene que ser el id de evento asignado por el productor: los ids 2 y 5 son pagos de 40 a bob idénticos byte a byte y ambos tienen que entrar, mientras que el id 2 llegando dos veces tiene que entrar una sola vez. Un hash del payload no puede distinguir esos dos casos.

### Tu tarea

1. \`apply_naive\` acredita incondicionalmente.
2. \`apply_idempotent\` retorna temprano cuando \`e.id\` ya está en \`self.seen\`; si no, registra el id y acredita.
3. En \`main\`, alimenta \`delivered\` a ambos stores dos veces, imprimiendo una fila por pasada, después imprime el total exactly-once, la tabla de saldos del idempotente y el tamaño del seen-set.

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

### Pistas

- Fila de pasada: \`println!("{:>4}{:>7}{:>12}", pass, naive.total(), safe.total());\`
- \`unique.iter().map(|e| e.amount).sum::<i64>()\` da el total exactly-once.
- El seen-set aquí es ilimitado. En producción es un índice único sobre el id del evento, o una ventana anclada al cursor.
`,
  },

  "backend-indexers-distsys-4": {
    instructions: `## Haz rollback hasta el fork, reaplica la rama

El **parent hash** de un bloque, no su altura, es lo que te dice si extiende tu cadena. \`b3\` llega a altura 3 con parent \`a2\` mientras el head es \`a5\` — solo por la altura, eso parece un duplicado o un hueco.

El rollback corre del head hacia abajo, aplicando el inverso del efecto de cada bloque, y se detiene en el punto de fork. El orden inverso importa en el momento en que los efectos dejan de conmutar.

### Tu tarea

1. \`apply\` acredita el bloque, le hace push a la cadena, e imprime la línea de apply.
2. \`rollback_to\` saca los bloques por encima de \`height\` del head hacia abajo, acreditando el delta inverso de cada uno e imprimiendo una línea de rollback.
3. En \`main\`: indexa la cadena canónica y llama a \`report\`; imprime la línea del reorg; encuentra el fork ubicando \`branch[0].parent\` en la cadena y tomando la altura de ese bloque; haz \`rollback_to\` hasta ahí; imprime la línea del punto de fork; aplica la rama; \`report\`; imprime la línea de cierre sobre carol.

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

### Pistas

- \`println!("  apply    {} height={} {} {:+}", b.hash, b.height, b.account, b.delta);\` — \`{:+}\` siempre imprime el signo.
- \`while let Some(b) = self.chain.last().copied()\` te da el head sin sostener un borrow a través del \`pop\`.
- \`self.chain.iter().position(|b| b.hash == branch[0].parent).map(|i| self.chain[i].height).unwrap_or(0)\`.
`,
  },

  "backend-indexers-distsys-5": {
    instructions: `## Codifica la máquina, y haz que rechace

Una columna de status con seis valores string no es una máquina de estados. La máquina es la relación de transición \`allowed(from, to)\`, y su valor está enteramente en aquello para lo que devuelve false.

El catch-all \`_ => false\` es el diseño: toda arista que no escribiste se rechaza por construcción. Los estados terminales son los que no tienen brazo de salida — \`Confirmed\` y \`Failed\` no reciben ninguno, y así es como un webhook duplicado que llega tarde no consigue resucitar una transacción confirmada.

\`Submitted -> Confirmed\` se rechaza aunque sea el desenlace que todo el mundo quiere: saltarse \`Pending\` destruye el registro de que la transacción estuvo en la mempool.

### Tu tarea

1. \`allowed\` hace match sobre \`(from, to)\`. Aristas legales: \`Received -> Validating\`, \`Validating -> Submitted\`, \`Submitted -> Pending\`, \`Pending -> Confirmed\`, y \`-> Failed\` desde cada uno de \`Received\`, \`Validating\`, \`Submitted\` y \`Pending\`. Todo lo demás es \`_ => false\`.
2. \`Tx::transition\` aplica el movimiento si \`allowed\`, si no incrementa \`rejected\` y deja el estado intacto — imprimiendo la línea from/to/veredicto en ambos casos.
3. En \`main\`, imprime el encabezado, dispara cada transición propuesta, imprime la línea final, y después cuenta las aristas de salida de \`Confirmed\` y \`Failed\`.

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

### Pistas

- Línea de veredicto: \`println!("{:<11} -> {:<11} accepted", name(from), name(to));\`
- Cuenta las aristas de salida filtrando los seis status por \`allowed\`: \`[..].iter().filter(|t| allowed(*s, **t)).count()\`.
- Captura \`let from = self.status;\` antes de mutar, para que la línea imprima el estado del que saliste.
`,
  },

  "backend-indexers-distsys-6": {
    instructions: `## Calcula el solapamiento, después particiona el cluster

La garantía de solapamiento es estrictamente \`R + W > N\`. La fila \`N=5, R=2, W=3\` suma exactamente 5 y **no** solapa — un quorum de lectura de dos puede ser completamente disjunto de los tres nodos que aceptaron la escritura, y devuelve datos stale sin ningún error.

Una partición no pide permiso. Con N=5, W=3 y un split 3|2, el lado mayoritario todavía reúne quorum; el lado minoritario no llega ni a R=3 ni a W=3 y rechaza ambos. Ese rechazo es la elección CP, y la hiciste cuando elegiste R y W.

Las lecturas se resuelven por **número de versión**, no por timestamp de reloj de pared.

### Tu tarea

1. \`write\` devuelve false a menos que el lado alcanzable tenga al menos \`w\` nodos; si no, pone \`version\` y \`value\` en todos ellos y devuelve true.
2. \`read\` devuelve \`None\` a menos que el lado tenga al menos \`r\` nodos; si no, devuelve el \`(version, value)\` más alto visto.
3. En \`main\`: imprime la tabla de quorum para \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\` — N, R, W, R+W, si \`r + w > n\`, y las fallas que cada quorum todavía tolera (\`n - w\` en escritura, \`n - r\` en lectura). Después corre la partición 3|2 con R=3, W=3: intenta una escritura de versión 2 / valor 250 en cada lado, lee de cada lado, e imprime la línea de cierre sobre AP.

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

### Pistas

- Fila de la tabla: \`println!("{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}", n, r, w, r + w, if overlaps { "yes" } else { "no" }, n - w, n - r);\`
- Las llaves literales de la línea de partición se escapan como \`{{\` y \`}}\`.
- \`minority.iter().map(|n| n.id).collect::<Vec<_>>().join(",")\` arma la lista de nodos.
- \`read\` hace fold en una tupla \`best: (u32, i64)\`, reemplazándola cada vez que \`n.version > best.0\` — gana la versión más alta, y un timestamp de reloj de pared no sería un orden total entre nodos.
`,
  },

  "backend-indexers-distsys-7": {
    instructions: `## Sella un trace con los dos relojes

Un reloj de Lamport son dos reglas: haz tick de tu contador en cada evento, y al recibir un mensaje sube tu contador hasta al menos el del remitente antes de hacer tick. Eso garantiza que \`a -> b\` implica \`L(a) < L(b)\` — y nada más. \`c1\` tiene L=1, \`a2\` tiene L=2, y son concurrentes.

Un vector clock mantiene un contador por nodo y toma el máximo elemento a elemento al recibir. \`a <= b\` componente a componente con al menos una estrictamente menor significa \`a -> b\`; ninguna de las dos direcciones significa **concurrentes**, un veredicto que Lamport estructuralmente no puede producir.

### Tu tarea

1. \`happens_before\` devuelve true cuando toda componente de \`a\` es \`<=\` la de \`b\` y al menos una es estrictamente menor.
2. Recorre los eventos en orden. En una entrega (\`Some(src)\`), sube el contador de Lamport de este nodo a \`lamport_of[src]\` si ese es mayor, y toma el máximo elemento a elemento de \`vector_of[src]\`. Después haz tick del contador de Lamport del nodo y de su propia componente del vector. Registra ambos stamps en \`lamport_of[i]\` / \`vector_of[i]\` e imprime la fila.
3. Imprime las filas de veredicto para los pares de índices de evento \`(1,3)\`, \`(4,1)\` y \`(2,4)\` — es decir \`a2,b2\`, \`c1,a2\` y \`b1,c1\` — con el signo de la comparación de Lamport y el veredicto del vector. Cierra con la línea de resumen.

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

### Pistas

- Fila de trace: \`println!("{}  {}     {}        [{},{},{}]", e.label, ["A", "B", "C"][e.node], lamport_of[i], vector_of[i][0], vector_of[i][1], vector_of[i][2]);\`
- Fila de veredicto: \`println!("{},{}   {} {} {}    {}", ...)\` con el signo calculado como \`"<"\`, \`">"\` o \`"="\`.
- \`for (i, e) in events.iter().enumerate()\` te da el índice bajo el cual registrar los stamps.
- Dos pares de arrays: los relojes **vivos** \`lamport: [u64; 3]\` y \`vector: [[u64; 3]; 3]\`, indexados por nodo — \`lamport[e.node] += 1\`, \`vector[e.node][e.node] += 1\` — y los stamps por evento \`lamport_of\` / \`vector_of\`, indexados por evento, a los que copias el reloj vivo después de hacer tick.
`,
  },
};
