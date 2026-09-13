import type { LessonStep } from "@/content/steps";

// ES · The Data Layer.
//
// Overlay for ../../steps/backend-data-layer.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendDataLayerStepsEs: Record<string, LessonStep[]> = {
  "backend-data-layer-1": [
    {
      kind: "theory",
      body: `Un índice B-tree es una estructura ordenada. Buscar una clave es un **descenso** por los nodos internos — O(log n) — seguido de un **recorrido secuencial** por el nivel de hojas enlazadas mientras el predicado se cumpla — O(k), donde k es el número de filas devueltas. Total: O(log n + k).

Un sequential scan es O(n) sea cual sea el predicado. Para devolver una fila entre mil, lee las mil y descarta 999.

\`\`\`text
seq scan     id BETWEEN 500 AND 500   →  1000 filas examinadas, 1 devuelta
index scan   id BETWEEN 500 AND 500   →     1 fila  examinada, 1 devuelta
\`\`\`

"Filas examinadas" no es una forma de hablar. Es el número que el planner presupuesta, y el número que \`EXPLAIN ANALYZE\` imprime como \`rows\` en cada nodo. Esta lección también lo imprime, para que la asintótica deje de ser una afirmación que tienes que aceptar de buena fe.`,
    },
    {
      kind: "theory",
      body: `El otro lado de la cuenta.

Un índice es una **segunda copia ordenada** de las columnas clave más un puntero a la fila. Cada \`INSERT\`, cada \`DELETE\` y cada \`UPDATE\` que toque una columna indexada tiene que escribirlo también. Tres índices en una tabla caliente más o menos triplican el write amplification y el volumen de WAL que la replicación y el backup luego tienen que cargar.

También tiene que quedarse residente para ser barato. Un índice por el que nadie filtra, hace join ni ordena es costo puro, pagado en cada escritura, para siempre.

Y el índice tampoco gana siempre en lectura. Su costo es **proporcional a las filas que coinciden**, y en un engine real cada fila coincidente puede ser un fetch de página aleatoria. Con 50% de selectividad el sequential scan es simplemente más barato, y el planner lo sabe. La lección 3 calcula exactamente dónde se cruzan las dos curvas; por ahora, quédate con el hecho de que existe un crossover.`,
    },
    {
      kind: "quiz",
      question:
        "Una query sobre una tabla de 10 millones de filas coincide con 6 millones de ellas. Hay un índice B-tree en la columna del predicado. ¿Por qué el planner podría igual elegir un sequential scan?",
      options: [
        "El costo del index scan crece con las filas coincidentes, así que pasado un crossover supera el costo fijo del seq scan",
        "Los índices B-tree solo se consultan para predicados de igualdad, nunca para rangos",
        "El índice solo se usa cuando la tabla supera el umbral de tamaño del planner",
      ],
      answer: 0,
      explain:
        "Un índice hace rápida una query *selectiva*. El seq scan paga un precio fijo por la tabla entera; el índice paga por fila coincidente más un fetch aleatorio cada vez. Seis millones de filas coincidentes está muy lejos del punto en que el precio fijo es la ganga.",
    },
    {
      kind: "fill",
      prompt:
        "Haz que el index scan haga seek al rango de claves en vez de recorrer el índice entero.",
      file: "main.rs",
      before: "for (_key, r) in ",
      after: " {",
      choices: [
        "idx.range(lo..=hi)",
        "idx.iter().filter(|(k, _)| **k >= lo && **k <= hi)",
        "idx.values().take((hi - lo + 1) as usize)",
      ],
      answer: 0,
      explain:
        "La versión con filter devuelve las mismas filas y es la tentadora — pero examina las 1000 entradas para hacerlo, lo que es un sequential scan con nombre de índice. `take` lee la *cantidad* correcta del *lugar* equivocado: las primeras k entradas, no las que están en el rango.",
    },
    {
      kind: "quiz",
      question:
        "Una tabla dominada por lecturas recibe un cuarto índice. ¿Cuál es el costo que acabas de aceptar?",
      options: [
        "Cada escritura en esa tabla ahora mantiene una cuarta estructura ordenada, y el WAL la carga",
        "Nada relevante — las lecturas dominan la carga, así que el mantenimiento se amortiza",
        "Solo el espacio en disco; el mantenimiento del índice ocurre en background en el checkpoint",
      ],
      answer: 0,
      explain:
        "El mantenimiento es por *escritura*, no por lectura, así que una razón lectura:escritura alta no lo amortiza — solo significa que el costo cae sobre un número menor de statements. Y esos statements suelen ser justo los sensibles a la latencia.",
    },
    {
      kind: "editor",
      intro: `### Cuenta las filas que examina cada plan

1. \`seq_scan(rows, lo, hi) -> (Vec<u32>, usize)\` — toca cada fila, cuenta cada una tocada, recoge el \`amount\` de aquellas cuyo \`id\` está en el rango.
2. \`index_scan(idx, lo, hi) -> (Vec<u32>, usize)\` — usa \`idx.range(lo..=hi)\` y cuenta solo las entradas que el rango realmente visita.
3. Construye 1000 filas (\`id\` 1..=1000, \`amount = id * 3\`) y un índice \`BTreeMap<u32, Row>\` sobre ellas.
4. Corre ambos planes sobre \`500..=500\`, \`500..=509\` y \`500..=599\`, imprime la tabla y después confirma que ambos planes devolvieron filas idénticas.

Salida esperada:

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

Misma respuesta, tres órdenes de magnitud de diferencia en trabajo hecho.`,
    },
  ],

  "backend-data-layer-2": [
    {
      kind: "theory",
      body: `Un índice sobre \`(tenant, status, created)\` es **una** estructura ordenada, con clave en la tupla concatenada. No son tres índices, y no es simétrico en sus columnas.

El orden es lexicográfico. Así que los únicos rangos de clave contiguos que contiene la estructura son los que fija un **leftmost prefix**:

\`\`\`text
(tenant)                     ✓ contiguo
(tenant, status)             ✓ contiguo
(tenant, status, created)    ✓ contiguo
(status)                     ✗ no es prefijo
(created)                    ✗ no es prefijo
(status, created)            ✗ no es prefijo
\`\`\`

Un predicado solo sobre \`status\` no nombra ningún rango contiguo — las entradas que coinciden están dispersas por el índice entero, una vez por tenant. No hay adónde hacer seek, así que el planner cae a un sequential scan de la tabla.`,
    },
    {
      kind: "theory",
      body: `Dos formas en que un índice compuesto se degrada sin llegar a un seek completo.

**Un hueco en el medio.** \`tenant\` y \`created\` sin \`status\` da un seek de prefijo sobre \`tenant\` más un **filtro residual** sobre todo lo que encuentra: examina cada fila de ese tenant y devuelve solo las que también coinciden. La brecha entre examinadas y coincidentes es precisamente \`Rows Removed by Filter\` en \`EXPLAIN ANALYZE\`, y es donde se esconde la latencia — el ejercicio imprime 100 examinadas para 30 coincidentes.

**Un rango demasiado pronto.** Solo la *última* columna usada en el seek puede ser un rango. Un rango sobre \`status\` convierte \`created\` en un filtro en vez de en clave de seek. De ahí la regla: columnas de igualdad primero, columna de rango al final.

**Covering index.** Si el índice carga cada columna que la query lee, el heap nunca se toca — un index-only scan.

El mismo trade existe un nivel más arriba, en el schema. Una columna desnormalizada es un join materializado que después puedes indexar: compras costo de lectura con write amplification y la posibilidad de anomalías de actualización. Exactamente el trato que hace un índice, en otra granularidad.`,
    },
    {
      kind: "quiz",
      question:
        "Dado un único índice sobre `(tenant, status, created)`, ¿qué query puede hacer seek a un rango contiguo de él?",
      options: [
        "`WHERE tenant = 3 AND status = 1` — un leftmost prefix",
        "`WHERE status = 1 AND created > 700` — ambas columnas están en el índice, así que el índice puede servirla",
        "`WHERE created > 700` — la columna de rango está indexada, así que el rango es contiguo",
      ],
      answer: 0,
      explain:
        "El criterio no es la pertenencia; es la posición. Las entradas de `status = 1` solo son contiguas *dentro* de un tenant, así que sin un predicado sobre `tenant` quedan dispersas por toda la estructura. Servir `(status, created)` necesita un segundo índice, con su propio costo de escritura.",
    },
    {
      kind: "fill",
      prompt:
        "Haz seek directo al inicio de `tenant = 3, status = 1, created >= 700`.",
      file: "main.rs",
      before: "let (e, m) = index_scan(&idx, ",
      after: ", (3, 1, max), &all);",
      choices: ["(3, 1, 700)", "(3, 700, 1)", "(0, 0, 700)"],
      answer: 0,
      explain:
        "La clave es una tupla en el orden del índice — `(tenant, status, created)` — no en el orden en que se escribieron los predicados. `(0, 0, 700)` es la creencia de que una clave inicial solo puede restringir la columna de rango; haría seek al principio mismo del índice y lo leería todo.",
    },
    {
      kind: "quiz",
      question:
        "`EXPLAIN ANALYZE` muestra un Index Scan con `rows=30` y `Rows Removed by Filter: 70`. ¿Qué pasó?",
      options: [
        "El índice hizo seek a un prefijo, y luego un filtro residual descartó 70 de las 100 filas que examinó",
        "El índice devolvió 30 filas y el executor descartó 70 duplicados producidos por el scan",
        "70 filas fueron removidas por un join posterior, y el índice examinó exactamente las 30 que devolvió",
      ],
      answer: 0,
      explain:
        "Un index scan examina solo lo que devuelve cuando el seek usa un prefijo *completo*. Con un hueco, examina el rango entero del prefijo y filtra. Esa línea es el costo de la columna que falta, cuantificado — y la creencia prolija de que un índice solo toca lo que devuelve es lo que hace que la gente la lea mal.",
    },
    {
      kind: "editor",
      intro: `### Demuestra la regla del leftmost prefix

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`, con \`created\` haciendo también de id de fila.
2. \`index_scan(idx, lo, hi, keep) -> (examined, matched)\` — recorre \`idx.range(lo..=hi)\`, cuenta cada entrada visitada y cada una que \`keep\` deja pasar.
3. \`seq_scan(rows, keep) -> (examined, matched)\` — para los predicados que ningún prefijo puede servir.
4. Construye 1000 filas: \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\`, y un \`BTreeMap<Key, u32>\` sobre ellas.
5. Corre las cinco queries e imprime qué prefijo usó cada una.

Salida esperada:

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

La fila cuatro es el filtro residual. La fila cinco es lo que de verdad cuesta un prefijo ausente.`,
    },
  ],

  "backend-data-layer-3": [
    {
      kind: "theory",
      body: `El planner no conoce los milisegundos. Enumera planes candidatos y le pone precio a cada uno en unidades arbitrarias armadas a partir de un puñado de constantes:

\`\`\`text
seq_page_cost           1.0     una página leída secuencialmente
random_page_cost        4.0     una página traída aleatoriamente
cpu_tuple_cost          0.01    procesar una fila
cpu_index_tuple_cost    0.005   procesar una entrada del índice
\`\`\`

**Seq scan** = \`pages x seq_page_cost + rows x cpu_tuple_cost\`. Un precio fijo, independiente de cuántas filas coincidan.

**Index scan** = descenso + \`matched x (random_page_cost + cpu costs)\`. Un precio por fila coincidente.

Uno es plano, el otro tiene pendiente. Se cruzan, y el planner elige el que sea más bajo en la cantidad estimada de filas. Eso es la selección de plan, entera. El \`cost=X..Y\` de \`EXPLAIN\` es exactamente estos números: costo de arranque, después costo total.

Esos son los defaults con los que viene Postgres. El ejercicio trabaja en las mismas unidades multiplicadas por 100 para que nada dependa de floats, y redondea \`cpu_index_tuple_cost\` hacia arriba a una unidad — es el término más pequeño de la suma y mueve el crossover menos de dos filas en cien mil.`,
    },
    {
      kind: "theory",
      body: `Todo lo anterior depende de una entrada que el planner tiene que adivinar: **cuántas filas van a coincidir**.

La selectividad sale de las estadísticas — \`n_distinct\`, la lista de most-common-values y el histograma, todos recogidos por \`ANALYZE\`. El plan nunca es mejor que esa estimación.

La falla clásica en producción es una estadística vieja o ausente. El planner estima 10 filas, recibe 200.000, y se queda con un nested loop que debió haber sido un hash join. Así que cuando leas \`EXPLAIN ANALYZE\`, compara \`rows\` estimadas contra \`rows\` reales **primero**: una brecha de 1000x ahí es el bug, y el plan es solo su síntoma.

El crossover también llega mucho antes de lo que sugiere la intuición. Con las constantes por defecto el índice pierde bastante por debajo del 1% de la tabla. "El índice no se está usando" casi siempre significa "el predicado no es lo bastante selectivo".

El **particionado** cambia la aritmética, no la fórmula: un predicado sobre la clave de partición elimina particiones enteras antes de costear (partition pruning), así que el planner le pone precio a una tabla más chica. El **sharding** es el mismo corte entre máquinas — con la diferencia de que nadie planifica entre shards por ti. El fan-out y el merge son código de tu aplicación.`,
    },
    {
      kind: "quiz",
      question:
        "Una query que debería usar un índice está haciendo seq scan. ¿Qué acción ataca la causa real?",
      options: [
        "Comparar rows estimadas vs reales en `EXPLAIN ANALYZE`, y después corregir la estimación o la selectividad del predicado",
        "Hacer `REINDEX` de la tabla — el índice se degradó y el planner ya no confía en él",
        "Crear un segundo índice sobre la misma columna para que el planner tenga una alternativa que costear",
      ],
      answer: 0,
      explain:
        "El planner no pasó por alto el índice; le puso precio y lo encontró más caro. Un índice duplicado recibe el mismo precio. `REINDEX` arregla bloat, que es un problema real y no este — la palanca es la estimación de filas (`ANALYZE`, estadísticas extendidas) o el predicado mismo.",
    },
    {
      kind: "fill",
      prompt:
        "Ponle precio a una fila coincidente de un index scan: el fetch de página es aleatorio, no secuencial.",
      file: "main.rs",
      before: "    INDEX_DEPTH * RANDOM_PAGE_COST\n        + matched * (",
      after: ")",
      choices: [
        "RANDOM_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "SEQ_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "CPU_TUPLE_COST + CPU_INDEX_COST",
      ],
      answer: 0,
      explain:
        "El orden del índice no es el orden del heap, así que cada fila coincidente es un fetch a una página arbitraria — ese 4x es la razón entera de que exista un crossover. Cobrar `seq_page_cost` empujaría el crossover cuatro veces más lejos; no cobrar ningún costo de página significaría que el índice siempre gana, que es exactamente la creencia que los números refutan.",
    },
    {
      kind: "quiz",
      question:
        "La base de datos corre sobre NVMe. ¿Qué hace en realidad bajar `random_page_cost` de 4.0 a 1.1?",
      options: [
        "Mueve el punto de crossover de cada query de la base, desplazando los planes hacia index scans de forma generalizada",
        "Nada medible — es un ajuste de documentación que describe el hardware a los operadores",
        "Aplica solo a bitmap heap scans, donde los fetches aleatorios ya vienen ordenados por página",
      ],
      answer: 0,
      explain:
        "La razón entre `random_page_cost` y `seq_page_cost` es lo que fija el crossover. Cambiarla vuelve a poner precio a cada index scan que el planner vaya a considerar — uno de los ajustes de mayor palanca del sistema, y el que más a menudo se deja en un valor afinado para discos giratorios.",
    },
    {
      kind: "editor",
      intro: `### Ponle precio a ambos planes y encuentra el crossover

1. \`seq_cost() -> u64\` — páginas leídas secuencialmente, más un costo de CPU por fila.
2. \`index_cost(matched: u64) -> u64\` — \`INDEX_DEPTH\` fetches aleatorios para descender, después un fetch de página aleatoria más costos de CPU por fila coincidente.
3. Para cada selectividad en \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` partes por millón, deriva \`matched = ROWS * ppm / 1_000_000\`, ponle precio a ambos planes e imprime el que el planner elegiría.
4. Después **encuentra** el crossover barriendo \`m\` hacia arriba hasta que \`index_cost(m) >= seq_cost()\` — no lo dejes fijo en el código.

Salida esperada:

\`\`\`text
selectivity  matched   seq cost  index cost  plan
     0.010%       10     150000        5220  Index Scan
     0.100%      100     150000       41400  Index Scan
     0.300%      300     150000      121800  Index Scan
     0.500%      500     150000      202200  Seq Scan
     1.000%     1000     150000      403200  Seq Scan
    10.000%    10000     150000     4021200  Seq Scan
crossover: seq scan wins from 371 rows (0.371%)
\`\`\`

371 filas de 100.000. Ahí es donde empieza "el índice no se está usando".`,
    },
  ],

  "backend-data-layer-4": [
    {
      kind: "theory",
      body: `\`LIMIT 20 OFFSET 4980\` no salta a ningún lado. El servidor produce las filas en orden, descarta las primeras 4980 y devuelve las 20 siguientes. El costo es O(offset + limit) — la página 250 cuesta 250 veces la página 1.

Un índice sobre la columna de orden elimina el **sort**, no el **salto**. Las filas llegan ya ordenadas, y aun así se producen y se tiran una por una.

\`\`\`text
página   1   →   20 filas leídas, 20 devueltas
página  10   →  200 filas leídas, 20 devueltas
página 250   → 5000 filas leídas, 20 devueltas
\`\`\`

El número que importa es el recorrido completo, porque eso es lo que un export en background o un cliente con scroll infinito ejecuta de verdad: 250 páginas cuestan 627.500 lecturas de fila por \`OFFSET\` y 5.000 por cursor.`,
    },
    {
      kind: "theory",
      body: `Un **cursor** es la clave de orden de la última fila. La página siguiente es:

\`\`\`sql
WHERE (created_at, id) > ($1, $2)
ORDER BY created_at, id
LIMIT 20
\`\`\`

Eso es un predicado al que el índice puede hacer seek, así que cada página cuesta O(log n + limit) sin importar qué tan profunda esté.

Tiene un requisito: un **orden total**. \`ORDER BY created_at\` solo no lo es — los empates hacen que una fila aparezca en dos páginas o en ninguna. Agrega un desempate único (la primary key) y compara como tupla.

Es tanto una corrección de correctitud como de velocidad. Sobre una tabla que recibe inserts, \`OFFSET\` se salta y duplica filas en silencio entre una página y la siguiente, porque el offset se mide contra un conjunto de resultados que cambió por debajo. Un cursor está anclado a una fila, así que no puede. *Servicios RPC a escala*, lección 7, cuenta las filas que un cliente pierde así; aquí la medida es el costo.

El trade es honesto: un cursor no puede saltar a la página 47 ni mostrar un conteo de páginas. Si la UI necesita páginas numeradas sobre una tabla grande, eso es una decisión de producto con precio adjunto.

Entre shards, el cursor es lo que hace viable el fan-out — cada shard hace seek a su propio cursor y devuelve \`limit\` filas para el merge. Con \`OFFSET\`, cada shard tiene que producir \`offset + limit\` filas y descartar casi todas.`,
    },
    {
      kind: "quiz",
      question:
        "La columna del `ORDER BY` está indexada, y la página 900 de un export paginado sigue dando timeout. ¿Por qué?",
      options: [
        "El índice provee el orden pero no el salto — las 18.000 filas anteriores se siguen produciendo y descartando",
        "El índice no se puede usar con `LIMIT`, así que el planner cae a un sort",
        "El conjunto de resultados ya no cabe en `work_mem`, así que el sort se derrama a disco",
      ],
      answer: 0,
      explain:
        "Esta es la creencia que manda a producción una query rápida en staging, donde solo miras la página 1, y que da timeout en producción en la página 900. El índice eliminó el sort. Nada eliminó el salto.",
    },
    {
      kind: "fill",
      prompt:
        "Haz seek a la primera fila estrictamente después del último id que devolvió la página anterior.",
      file: "main.rs",
      before: "for (id, _) in idx.range((",
      after: ", Bound::Unbounded)) {",
      choices: [
        "Bound::Excluded(after)",
        "Bound::Included(after)",
        "Bound::Unbounded",
      ],
      answer: 0,
      explain:
        "`Included` vuelve a devolver la última fila de la página anterior en cada página — el clásico off-by-one de keyset, y uno que parece correcto hasta que alguien cuenta. `Unbounded` arranca desde el principio cada vez, que es `OFFSET 0` para siempre.",
    },
    {
      kind: "quiz",
      question: "¿Qué hace a un cursor keyset más rápido que `OFFSET`?",
      options: [
        "Carga la clave de orden de la última fila, así que se convierte en un predicado `WHERE` al que el índice puede hacer seek",
        "Es un offset codificado, y decodificarlo del lado del servidor evita volver a parsear la query",
        "Guarda en cache el conjunto de resultados de la página anterior en el servidor, y la siguiente continúa desde ahí",
      ],
      answer: 0,
      explain:
        "La codificación es empaque, no mecanismo — un offset codificado rinde exactamente como `OFFSET`. Lo que lo hace rápido es que el valor del cursor se puede comparar contra la clave del índice. No hay ningún estado del lado del servidor, que es también por lo que sobrevive a una reconexión.",
    },
    {
      kind: "editor",
      intro: `### Cuenta lo que OFFSET lee

1. \`offset_page(rows, offset, limit) -> (Vec<u32>, usize)\` — lee desde el inicio, cuenta cada fila leída **incluyendo las saltadas**, después recoge \`limit\` filas.
2. \`cursor_page(idx, after, limit) -> (Vec<u32>, usize)\` — haz seek con \`Bound::Excluded(after)\` y lee exactamente \`limit\` filas.
3. 5000 filas, página de 20. Compara las páginas 1, 10, 50 y 250, y verifica que ambos enfoques devuelven páginas idénticas.
4. Después recorre las 250 páginas de las dos formas e imprime los totales.

Salida esperada:

\`\`\`text
 page  first id  offset rows read  cursor rows read
    1         1                20                20
   10       181               200                20
   50       981              1000                20
  250      4981              5000                20
full crawl of 250 pages: offset reads 627500, cursor reads 5000
same rows on every page: true
\`\`\`

125x menos filas leídas, para la salida idéntica.`,
    },
  ],

  "backend-data-layer-5": [
    {
      kind: "theory",
      body: `Las tres anomalías clásicas se definen, cada una, por lo que ve una **relectura**.

**Dirty read** — observas un valor que otra transacción escribió y no ha commiteado. Si hace rollback, actuaste sobre datos que nunca existieron.

**Non-repeatable read** — lees la misma fila dos veces en una transacción y obtienes dos valores distintos, porque otra transacción hizo commit en el medio.

**Phantom read** — corres la misma query de rango dos veces y la segunda devuelve filas que antes no estaban. Las filas que ya leíste no cambiaron; el *conjunto* cambió.

Los niveles de aislamiento ANSI se definen por cuáles de estas prohíben — no por cómo. Esa distinción es la lección: el nivel es un contrato, el mecanismo es asunto del engine.`,
    },
    {
      kind: "theory",
      body: `Lo que las implementaciones hacen de verdad.

**Read Committed** toma un snapshot nuevo por *statement*. **Repeatable Read** toma uno por *transacción*. Esa única diferencia produce la segunda columna de la tabla que estás a punto de imprimir.

Los nombres de los niveles son un **piso, no una especificación**. El \`REPEATABLE READ\` de Postgres es snapshot isolation y no permite phantoms, aunque ANSI se lo permitiría. El InnoDB de MySQL usa next-key locks y también bloquea la mayoría. Nunca portes una suposición sobre anomalías entre engines por la sola fuerza del nombre de un nivel.

Snapshot isolation todavía permite **write skew**: dos transacciones leen cada una un conjunto, cada una verifica un invariante, cada una escribe una fila *distinta*, y el invariante termina violado aunque ninguna vio un conflicto. Solo el \`SERIALIZABLE\` de verdad (SSI en Postgres) lo prohíbe — y lo prohíbe **abortando** una transacción con un error de serialización. Código serializable sin un retry loop no es serializable en la práctica.

El locking es el lado del costo. Los row locks son baratos y numerosos; los page y table locks son gruesos y baratos de rastrear. Algunos engines escalan row locks a table locks bajo presión de memoria, y ahí la concurrencia colapsa. Un predicado de rango serializable necesita un predicate lock o gap lock que cubra filas que todavía no existen — por eso es el nivel caro.`,
    },
    {
      kind: "quiz",
      question:
        "Un reporte de larga duración corre en `REPEATABLE READ`. ¿Qué garantiza eso?",
      options: [
        "El reporte ve un snapshot consistente; las otras transacciones hacen commit libremente y él simplemente no las ve",
        "Ninguna otra transacción puede commitear cambios en las filas que el reporte lee hasta que termine",
        "Las escrituras del propio reporte tienen éxito garantizado en el commit, ya que su snapshot es fijo",
      ],
      answer: 0,
      explain:
        "El aislamiento es sobre visibilidad, no sobre exclusión. Tratar una transacción larga como un lock es como la gente termina manteniendo abierto el horizonte del vacuum durante una hora para proteger datos que nadie estaba escribiendo — y una escritura de esa transacción todavía puede ser rechazada en el commit.",
    },
    {
      kind: "fill",
      prompt:
        "Read Committed toma un snapshot nuevo por statement — ve lo que esté commiteado ahora mismo.",
      file: "main.rs",
      before: "        Level::ReadCommitted => ",
      after: ",",
      choices: [
        "store.committed.clone()",
        "snapshot.to_vec()",
        "store.pending.clone()",
      ],
      answer: 0,
      explain:
        "`snapshot.to_vec()` es la regla de Repeatable Read — un snapshot para toda la transacción — e intercambiar los dos es la confusión más común entre los niveles. `pending` solo mostraría únicamente las escrituras sin commit y nada de la tabla commiteada.",
    },
    {
      kind: "quiz",
      question:
        "Un servicio pasa de `READ COMMITTED` a `SERIALIZABLE` y no cambia nada más. ¿Cuál es el resultado probable?",
      options: [
        "Los requests empiezan a fallar bajo contención con errores de serialización, porque nada reintenta las transacciones abortadas",
        "El throughput baja pero la correctitud mejora estrictamente, ya que ahora toda anomalía es imposible",
        "Nada cambia en Postgres, donde `READ COMMITTED` ya provee semántica serializable",
      ],
      answer: 0,
      explain:
        "`SERIALIZABLE` convierte anomalías silenciosas en abortos ruidosos — una mejora solo si quien llama hace retry. Sin un retry loop, la aplicación es menos correcta de lo que era, porque ahora devuelve errores donde antes devolvía respuestas ligeramente incorrectas. (Defaults que vale la pena saber: Read Committed en Postgres, Repeatable Read en MySQL.)",
    },
    {
      kind: "editor",
      intro: `### Deriva la tabla de anomalías a partir de un trace

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — una función, cuatro reglas. Read Uncommitted superpone \`pending\` sobre \`committed\`; Read Committed devuelve \`committed\`; Repeatable Read devuelve el snapshot más las filas que no existían en él; Serializable devuelve el snapshot solo.
2. \`read(...)\` elige una clave del conjunto visible; \`count_at_least(...)\` corre una query de rango sobre él — ahí es donde aparece el phantom.
3. Traza tres etapas: una escritura pendiente de \`200\` en la clave 1, después esa escritura commiteada, después una fila 3 nueva insertada.
4. Imprime las lecturas y después **deriva** la tabla de anomalías a partir de ellas — no la afirmes.

Salida esperada:

\`\`\`text
level                 read #1  read #2  rows >= 100
read uncommitted          200      200            3
read committed            100      200            3
repeatable read           100      100            3
serializable              100      100            2

anomaly                RU    RC    RR   SER
dirty read            yes    no    no    no
non-repeatable read   yes   yes    no    no
phantom read          yes   yes   yes    no
\`\`\`

La escalera es el punto: cada nivel prohíbe una anomalía más que el anterior.`,
    },
  ],

  "backend-data-layer-6": [
    {
      kind: "theory",
      body: `Una transacción es un **buffer de escritura más una regla de atomicidad**.

Dentro de la transacción, las lecturas ven tus propias escrituras sin commit. Fuera de ella, nada las ve hasta el \`COMMIT\`. Eso es read-your-own-writes, entero, y el ejercicio lo implementa como un lookup que revisa el buffer antes que el store.

\`ROLLBACK\` por lo tanto **no es un undo**. Los cambios nunca se aplicaron en ningún lugar donde otro pudiera verlos — el buffer se descarta, o los registros sin commit del WAL simplemente nunca se vuelven a aplicar. Hacer rollback de una transacción de un millón de filas no es proporcionalmente caro.

La durabilidad viene del write-ahead log: \`COMMIT\` es un \`fsync\` del registro de log, no de las páginas de datos. Ese \`fsync\` es el piso duro de la latencia de escritura, que es por lo que commitear 1000 filas en una transacción le gana a 1000 transacciones, y por lo que el group commit existe.

Lo que una transacción larga cuesta de verdad no es trabajo de rollback. Son los locks que sostiene y el horizonte de vacuum o undo que fija, de modo que las versiones viejas de fila no se pueden reclamar.`,
    },
    {
      kind: "theory",
      body: `Un prepared statement es **estado del lado del servidor**.

\`PREPARE\` parsea el SQL, arma un plan y le pone nombre. \`EXECUTE\` manda *valores* de parámetro por la conexión, no texto SQL. La reutilización ahorra el parseo y normalmente el plan, que para una query OLTP corta es una fracción real del tiempo total.

También es la defensa correcta contra injection, por una razón estructural: los parámetros llegan fuera de banda y nunca se le entregan al parser. El escaping es un filtro que puedes hacer mal; el parameter binding es un canal que no puede cargar sintaxis.

Dos trampas.

**Es por conexión.** Un pooler en transaction mode te entrega un backend distinto en cada transacción, así que el plan con nombre no está ahí. Esa es la razón concreta de que el transaction mode de pgbouncer y los prepared statements se hayan peleado históricamente, y de que los drivers vuelvan a preparar después de una reconexión.

**Un plan reutilizado es un plan genérico**, elegido sin conocer los valores de parámetro de esta llamada. Sobre una columna sesgada puede ser mucho peor que uno replanificado; Postgres se cubre costeando planes custom en las primeras cinco ejecuciones antes de decidir.

Los deadlocks van aquí porque son una falla a nivel de transacción. Dos transacciones que actualizan las mismas dos filas en órdenes opuestos forman un ciclo; el engine lo detecta y mata una con un error de deadlock — no se cuelga. Arréglalo ordenando las escrituras por una clave estable y manteniendo las transacciones cortas, y haz que todo el que llama pueda reintentar a la víctima del deadlock.`,
    },
    {
      kind: "quiz",
      question:
        "Un job masivo escribe 2 millones de filas en una transacción y después choca con una violación de constraint. ¿Qué cuesta el `ROLLBACK`?",
      options: [
        "Casi nada — las escrituras nunca se commitearon, así que no hay nada que deshacer donde otros pudieran verlo",
        "Aproximadamente el costo de las escrituras otra vez, ya que cada una debe revertirse",
        "Nada en el momento del rollback, pero una reescritura completa de la tabla en el siguiente checkpoint",
      ],
      answer: 0,
      explain:
        "La conclusión que suena operativamente sensata — 'entonces parte las escrituras grandes en transacciones chicas para que el rollback sea barato' — tiene el consejo correcto y la razón equivocada. Pártelas por la duración de los locks y el horizonte de vacuum que la transacción larga fija, no porque el rollback sea caro.",
    },
    {
      kind: "fill",
      prompt:
        "La constraint falló. Descarta las escrituras en buffer en vez de aplicarlas y revertirlas.",
      file: "main.rs",
      before: "    if after < 0 {\n        ",
      after:
        ";\n        return Err(format!(\"CHECK balance >= 0 violated: {}\", after));\n    }",
      choices: ["txn.rollback()", "txn.set(from, a)", "txn.commit(db)"],
      answer: 0,
      explain:
        "`txn.set(from, a)` es la escritura compensatoria — lo que haces cuando no tienes transacción. No hay nada que compensar: el store nunca se tocó. `commit` aplica justo la escritura que la verificación acaba de rechazar.",
    },
    {
      kind: "quiz",
      question: "¿Qué reutiliza en realidad un prepared statement?",
      options: [
        "Estado de parseo y plan del lado del servidor, sostenido por conexión y referenciado por nombre",
        "Un template SQL del lado del cliente con los valores de parámetro interpolados antes de enviar",
        "Un conjunto de resultados en cache en el servidor, devuelto otra vez cuando llegan los mismos parámetros",
      ],
      answer: 0,
      explain:
        "Ese único hecho explica las tres propiedades a la vez: es rápido porque no hay nada que volver a parsear, a prueba de injection porque los valores nunca llegan al parser, y roto bajo un pooler en transaction mode porque la conexión que carga el estado no es la que te devuelven.",
    },
    {
      kind: "editor",
      intro: `### Haz commit, rollback, y prepara una sola vez

1. \`Db\` guarda \`rows\`, los \`plans\` compilados y un contador \`executions\`. \`prepare(sql)\` devuelve el handle existente si ese texto ya se compiló; \`execute(plan)\` solo incrementa el contador.
2. \`Txn\` almacena las escrituras en un \`BTreeMap<u32, i64>\`. \`get\` lee a través del buffer y después cae al store; \`set\` guarda en el buffer; \`commit\` aplica cada escritura del buffer; \`rollback\` descarta el buffer.
3. \`transfer(...)\` debita, acredita, y después verifica \`balance >= 0\` — haciendo commit o rollback según corresponda.
4. Corre una transferencia de \`30\` (hace commit) y una transferencia de \`500\` (viola la verificación). Prepara el mismo SQL dos veces y muestra que el handle es el mismo.

Salida esperada:

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

Cuatro ejecuciones, una compilación — y la transferencia revertida no dejó rastro en el store.`,
    },
  ],

  "backend-data-layer-7": [
    {
      kind: "theory",
      body: `Un connection pool es una **cantidad fija de slots más una cola**.

Abrir una conexión a Postgres cuesta un handshake TCP, TLS, autenticación y un proceso backend forkeado — de unos pocos a decenas de milisegundos. Un pool amortiza eso manteniendo N abiertas y repartiéndolas: check out, usar, check in.

Así que la latencia que observa un cliente es **espera en cola + tiempo de query**. Cuando el pool está saturado el primer término domina y el segundo no cambia. Por eso \`pg_stat_statements\` muestra una query rápida en el mismo instante en que el cliente ve un request lento: los dos números miden intervalos distintos, y los dos son correctos.

El agotamiento aparece como un timeout de checkout — \`PoolTimedOut\`, \`TimeoutError: QueuePool limit ... overflow\`. Eso es una señal de capacidad sobre tu servicio, no una falla de la base de datos.

La simulación lo hace concreto: con capacidad 1, el peor request espera 198 ms en un pool cuya query más larga dura 25 ms.`,
    },
    {
      kind: "theory",
      body: `Más grande no es mejor.

Pasada la concurrencia útil de la base de datos — a grandes rasgos los cores más el paralelismo de I/O efectivo — los slots extra del pool no suman throughput. Sacan la cola de tu proceso, donde es medible y acotada, y la meten en la base de datos, donde se vuelve contención de locks y cambios de contexto que degradan a todos los demás clientes. El ejercicio lo muestra sin rodeos: 8 slots y 16 slots producen un makespan idéntico.

El techo real es multiplicativo: **instancias x tamaño del pool vs \`max_connections\`**. Diez pods con un pool de 20 son 200 conexiones desde un solo servicio. Colapsar eso es para lo que sirve un pooler del lado del servidor (pgbouncer, pgcat), al precio de las restricciones del transaction mode sobre el estado de sesión.

La corrección más barata normalmente no es un pool más grande sino un **checkout más corto**. Nunca sostengas una conexión a través de una llamada HTTP, y nunca abras la transacción antes de tener todo lo necesario para terminarla.

Las read replicas tienen su propio pool y su propio lag. La replicación es asíncrona por defecto, así que una lectura emitida milisegundos después de tu propia escritura puede legítimamente devolver el valor anterior a la escritura. Read-your-writes significa enrutar esa lectura al primario, o esperar a que la réplica alcance el LSN que devolvió tu commit. "Es eventualmente consistente" no es un diseño; la regla de enrutamiento sí lo es.`,
    },
    {
      kind: "quiz",
      question:
        "El p99 de un endpoint salta de 30 ms a 400 ms. La base de datos reporta la misma query con una media de 4 ms, sin cambios. ¿Qué es lo primero que hay que mirar?",
      options: [
        "La espera de checkout de conexión — la latencia del cliente incluye tiempo de cola que la base de datos nunca ve",
        "El plan de la query, ya que un p99 de 400 ms sobre una media de 4 ms significa que el plan cambió para algunos valores de parámetro",
        "Bloat del índice, que enlentece algunas ejecuciones sin mover la media que reporta la base de datos",
      ],
      answer: 0,
      explain:
        "El reflejo de afinar la query es lo que cuesta un día sin cambiar nada. El número de la base de datos arranca cuando el statement llega a una conexión; el del cliente arranca cuando llega el request. Bajo un pool saturado la brecha entre ambos es la regresión entera.",
    },
    {
      kind: "fill",
      prompt:
        "Mide lo que el cliente experimenta de verdad antes de que la query empiece.",
      file: "main.rs",
      before: "        let wait = ",
      after: ";",
      choices: ["start - arrival", "free_at[slot] - arrival", "ms"],
      answer: 0,
      explain:
        "`ms` es la duración de la query misma — el número que reporta la base de datos, y el que se queda plano mientras el p99 del cliente explota. `free_at[slot] - arrival` hace underflow cuando el slot ya estaba libre antes de que llegara el request, que es precisamente el caso sin contención.",
    },
    {
      kind: "quiz",
      question:
        "Aparecen timeouts de checkout bajo carga pico. ¿Por qué subir el tamaño del pool es el primer movimiento equivocado?",
      options: [
        "Cambia un error acotado y visible por contención dentro de la base de datos — y, multiplicado entre instancias, por una caída de `too many connections` que afecta a todos los servicios",
        "El tamaño del pool no se puede cambiar sin reiniciar la aplicación, así que no es una opción durante un incidente",
        "Un pool más grande aumenta la memoria por conexión, y ese es el único costo real",
      ],
      answer: 0,
      explain:
        "Un timeout en un pool acotado es el sistema diciendo la verdad sobre su capacidad. Quitar la cota no agrega capacidad — reubica la cola en un lugar donde no puedes verla, y pone en riesgo un recurso compartido en nombre de un solo servicio.",
    },
    {
      kind: "editor",
      intro: `### Lee la espera en cola de un pool

1. \`service_times()\` — un LCG determinista: seed \`1\`, \`next = seed * 1103515245 + 12345 mod 2^31\`, service \`= 5 + (next >> 16) % 21\`. Dieciséis de ellos.
2. \`simulate(capacity, service) -> (max wait, mean wait, timeouts, makespan)\` — los requests llegan cada 3 ms y toman el slot que se libera antes. La espera es \`start - arrival\`; una espera mayor que \`CHECKOUT_TIMEOUT\` cuenta como timeout.
3. Imprime los tiempos de servicio y el trabajo total de la base de datos, después una fila por capacidad en \`[1, 2, 4, 8, 16]\`.

Salida esperada:

\`\`\`text
service times (ms): [22, 9, 17, 6, 18, 25, 20, 11, 5, 17, 24, 25, 17, 11, 16, 13]
total db work: 256 ms over 16 requests

 capacity  max wait  mean wait  timeouts  makespan
        1       198         96        11       256
        2        74         34         4       132
        4        17          5         0        75
        8         0          0         0        58
       16         0          0         0        58
\`\`\`

Ninguna query se volvió más lenta entre capacidad 1 y capacidad 8. Solo cambió la espera — y fíjate que 16 slots no compran nada por encima de 8.`,
    },
  ],
};
