// ES · editor instructions — The Data Layer.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-data-layer.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendDataLayerInstructionsEs: Record<string, { instructions: string }> = {
  "backend-data-layer-1": {
    instructions: `## Index scan vs seq scan: filas examinadas

Una búsqueda en un B-tree es un descenso — O(log n) — seguido de un recorrido por el nivel de hojas — O(k). Un sequential scan es O(n) sea cual sea el predicado: examina las 1000 filas para devolver 1.

"Filas examinadas" es el número que \`EXPLAIN ANALYZE\` reporta como \`rows\` en cada nodo. Imprímelo, y la asintótica deja de ser una afirmación.

### Tu tarea

1. \`seq_scan(rows: &[Row], lo: u32, hi: u32) -> (Vec<u32>, usize)\` — toca cada fila, cuenta cada una tocada, recoge el \`amount\` de aquellas cuyo \`id\` cae en \`lo..=hi\`.
2. \`index_scan(idx: &BTreeMap<u32, Row>, lo: u32, hi: u32) -> (Vec<u32>, usize)\` — recorre el rango del índice y cuenta solo las entradas que el rango realmente visita.
3. En \`main\`, construye 1000 filas (\`id\` 1..=1000, \`amount = id * 3\`) y un \`BTreeMap<u32, Row>\` con clave en \`id\`.
4. Corre ambos planes sobre \`(500, 500)\`, \`(500, 509)\` y \`(500, 599)\`, imprime la tabla, y después imprime si ambos planes devolvieron filas idénticas.

Salida esperada:

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

### Pistas

- \`idx.range(lo..=hi)\` produce \`(&u32, &Row)\` exactamente para las claves en el rango — no visita el resto.
- El encabezado y cada fila usan \`"{:>11}  {:>7}  {:>9}  {:>9}"\`.
- \`format!("{}..={}", lo, hi)\` arma la etiqueta del rango para que \`{:>11}\` pueda alinearla a la derecha.
- Lleva la cuenta en un \`examined\` local y haz \`examined += 1\` al principio del cuerpo de cada loop — contar las entradas que el plan visita es la medición, así que tiene que ocurrir antes del predicado, no después.
`,
  },

  "backend-data-layer-2": {
    instructions: `## Índices compuestos y el leftmost prefix

Un índice sobre \`(tenant, status, created)\` es **una** estructura con clave en la tupla concatenada, ordenada lexicográficamente. Los únicos rangos contiguos que contiene son los que fija un leftmost prefix.

Un hueco en el medio se degrada a un seek de prefijo más un filtro residual — \`Rows Removed by Filter\` en \`EXPLAIN\`. Un predicado sin prefijo usable recibe un sequential scan.

### Tu tarea

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`, con \`created\` haciendo también de id de fila.
2. \`index_scan(idx, lo, hi, keep) -> (usize, usize)\` — recorre \`idx.range(lo..=hi)\`, contando cada entrada visitada y cada una que \`keep\` deja pasar.
3. \`seq_scan(rows, keep) -> (usize, usize)\` — toca cada fila, para los predicados que ningún prefijo puede servir.
4. Construye 1000 filas como \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\` para \`id\` en \`1..=1000\`, y un \`BTreeMap<Key, u32>\` sobre ellas.
5. Corre estas cinco queries — todas contra \`tenant = 3\`, \`status = 1\`, \`created >= 700\` — y reporta qué prefijo usó cada una:

| predicados | seek desde | seek hasta | keep |
| --- | --- | --- | --- |
| tenant | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&all\` |
| tenant, status | \`(3, 1, 0)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, status, created | \`(3, 1, 700)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, created | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&late\` |
| status, created | *sin prefijo* — \`seq_scan\` | | una closure sobre \`k.1 == 1 && k.2 >= 700\` |

con \`let max = u32::MAX;\`, \`let all = \|_k: Key\| true;\` y \`let late = \|k: Key\| k.2 >= 700;\`. La fila cuatro es el hueco en el medio: el seek solo puede fijar \`tenant\`, y \`late\` filtra el resto.

Salida esperada:

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

### Pistas

- La cota superior de un seek de prefijo rellena las columnas sin restringir con \`u32::MAX\`.
- \`keep\` es un \`&dyn Fn(Key) -> bool\`; pasa \`&all\` cuando el seek es exacto y \`&late\` cuando un filtro residual está haciendo el trabajo.
- \`report\` usa \`"{:<24}{:<26}{:>9}{:>9}"\`, y el encabezado también.
`,
  },

  "backend-data-layer-3": {
    instructions: `## El cost model detrás de EXPLAIN

El planner enumera planes y le pone precio a cada uno en unidades arbitrarias armadas a partir de cuatro constantes — \`seq_page_cost\`, \`random_page_cost\`, \`cpu_tuple_cost\`, \`cpu_index_tuple_cost\`. Un seq scan es un precio fijo; un index scan es un precio por fila coincidente. Se cruzan, y el planner toma el más bajo.

Las constantes aquí están escaladas a enteros para que nada dependa de floats.

### Tu tarea

1. \`seq_cost() -> u64\` — \`ROWS / ROWS_PER_PAGE\` páginas a \`SEQ_PAGE_COST\`, más \`ROWS * CPU_TUPLE_COST\`.
2. \`index_cost(matched: u64) -> u64\` — \`INDEX_DEPTH\` fetches aleatorios para descender, después por cada fila coincidente un fetch de página aleatoria más \`CPU_TUPLE_COST + CPU_INDEX_COST\`.
3. Para cada selectividad en \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` partes por millón, deriva \`matched\`, ponle precio a ambos planes e imprime el plan que el planner elegiría.
4. Encuentra el crossover barriendo \`m\` hacia arriba hasta que \`index_cost(m) >= seq_cost()\`. No lo dejes fijo en el código.

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

### Pistas

- \`matched = ROWS * ppm / 1_000_000\`, en ese orden — dividir primero pierde las selectividades pequeñas.
- Encabezado y filas comparten \`"{:>11}{:>9}{:>11}{:>12}  {}"\`.
- La etiqueta de la fila del crossover es \`selectivity_label(crossover * 1_000_000 / ROWS)\`.
- Liga los dos precios como \`seq\` e \`idx\` por fila; el plan es \`if idx < seq { "Index Scan" } else { "Seq Scan" }\`, así que un empate se lo lleva el seq scan.
`,
  },

  "backend-data-layer-4": {
    instructions: `## Paginación por cursor vs OFFSET

\`LIMIT 20 OFFSET 4980\` no hace seek. El servidor produce las filas en orden y descarta las primeras 4980. Un índice sobre la columna de orden elimina el sort, no el salto.

Un cursor keyset es la clave de orden de la última fila, lo que convierte "la página siguiente" en un predicado al que el índice puede hacer seek — O(log n + limit) a cualquier profundidad.

### Tu tarea

1. \`offset_page(rows: &[u32], offset: usize, limit: usize) -> (Vec<u32>, usize)\` — lee desde el inicio y cuenta **cada** fila leída, incluidas las que el offset descarta.
2. \`cursor_page(idx: &BTreeMap<u32, u32>, after: u32, limit: usize) -> (Vec<u32>, usize)\` — haz seek estrictamente después de \`after\` y lee exactamente \`limit\` filas.
3. 5000 filas, \`PAGE = 20\`. Compara las páginas 1, 10, 50 y 250, imprimiendo las filas leídas por cada enfoque, y lleva registro de si ambos devolvieron páginas idénticas.
4. Después recorre las 250 páginas de las dos formas e imprime los dos totales.

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

### Pistas

- \`idx.range((Bound::Excluded(after), Bound::Unbounded))\` es el seek. \`Bound::Included\` vuelve a devolver la última fila de la página anterior.
- El cursor de la página 1 es \`0\`, que está por debajo de todo id de la tabla.
- La tabla usa \`"{:>5}{:>10}{:>18}{:>18}"\`.
- Cuenta en un \`read\` local con \`read += 1\` por fila. **No** recurras a \`.skip(offset)\` para después sumarle \`offset\`: el punto entero es que las filas descartadas se producen una por una, y un adaptador de iterador esconde exactamente el costo que la lección está midiendo.
`,
  },

  "backend-data-layer-5": {
    instructions: `## Niveles de aislamiento y las anomalías que permiten

Cada anomalía se define por lo que ve una relectura. Un **dirty read** ve una escritura sin commit. Un **non-repeatable read** ve una fila cambiar entre dos lecturas. Un **phantom read** ve el *conjunto* cambiar entre dos queries de rango.

Los niveles ANSI se definen por cuáles de estas prohíben. Read Committed toma un snapshot por statement; Repeatable Read toma uno por transacción.

### Tu tarea

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — una función, cuatro reglas. \`ReadUncommitted\` superpone \`pending\` sobre \`committed\`; \`ReadCommitted\` devuelve \`committed\`; \`RepeatableRead\` devuelve el snapshot más las filas commiteadas ausentes de él; \`Serializable\` devuelve el snapshot solo.
2. \`read(level, store, snapshot, key) -> i64\` elige una clave del conjunto visible (\`0\` cuando falta).
3. \`count_at_least(level, store, snapshot, min) -> usize\` corre una query de rango sobre el conjunto visible.
4. Traza tres etapas: una escritura **pendiente** de \`200\` en la clave 1, después esa escritura **commiteada**, después una fila nueva \`(3, 100)\` insertada. Registra las lecturas de cada nivel en cada etapa.
5. Imprime las lecturas, después **deriva** la tabla de anomalías a partir de ellas — un dirty read es \`read #1 == 200\`, un non-repeatable read es \`read #2 != 100\`, un phantom es \`rows >= 100\` distinto de \`2\`.

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

### Pistas

- El snapshot es \`vec![(1, 100), (2, 100)]\` y nunca cambia.
- Repeatable Read es la regla interesante: conserva los *valores* del snapshot pero igual ve filas que no existían en él, por eso muestra el phantom y no el non-repeatable read.
- \`"{:<20}{:>9}{:>9}{:>13}"\` para la primera tabla, \`"{:<20}{:>5}{:>6}{:>6}{:>6}"\` para la segunda, y un \`println!();\` pelado entre ambas.
`,
  },

  "backend-data-layer-6": {
    instructions: `## Transacciones, rollback y prepared statements

Una transacción es un buffer de escritura más una regla de atomicidad: dentro de ella, las lecturas ven tus propias escrituras sin commit; fuera, nadie las ve hasta el \`COMMIT\`. \`ROLLBACK\` por lo tanto no deshace nada — descarta un buffer que nunca se aplicó.

Un prepared statement es estado de parseo y plan del lado del servidor, con nombre y reutilizado. \`EXECUTE\` manda valores, no texto SQL.

### Tu tarea

1. \`Db\` guarda \`rows\`, un vector \`plans\` y un contador \`executions\`. \`prepare(sql)\` devuelve el handle existente si ese texto exacto ya se compiló, y si no hace push y devuelve el índice nuevo. \`execute(plan)\` solo incrementa \`executions\`.
2. \`Txn\` almacena las escrituras en un \`BTreeMap<u32, i64>\`. \`get\` lee a través del buffer y después cae al store; \`set\` guarda en el buffer; \`commit\` aplica cada escritura del buffer a \`db.rows\`; \`rollback\` descarta el buffer.
3. \`transfer(db, plan, from, to, amount)\` — debita \`from\`, acredita \`to\` (llamando a \`execute\` por cada uno), después vuelve a leer \`from\`. Si quedó negativo, haz rollback y devuelve \`Err(format!("CHECK balance >= 0 violated: {}", after))\`. Si no, haz commit.
4. Abre con \`a = 100\`, \`b = 50\`. Transfiere \`30\` (hace commit), después \`prepare\` el mismo SQL otra vez y transfiere \`500\` (viola la verificación). Imprime los snapshots y las estadísticas del plan.

Salida esperada:

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

### Pistas

- \`self.plans.iter().position(|p| *p == sql)\` encuentra un plan ya compilado.
- \`commit(self, db)\` toma \`self\` por valor, así que el buffer no se puede usar después — eso es el sistema de tipos haciendo cumplir el ciclo de vida.
- \`-430\` es \`70 - 500\`: el débito se guarda en el buffer antes de que corra la verificación, que es lo que hace que la verificación tenga sentido.
`,
  },

  "backend-data-layer-7": {
    instructions: `## Connection pools y adónde se va la latencia

Un pool es una cantidad fija de slots más una cola. La latencia que observa el cliente es **espera en cola + tiempo de query**, que es por lo que la base de datos reporta una query rápida mientras el cliente ve un request lento — los dos números miden intervalos distintos.

Pasada la concurrencia útil de la base de datos, los slots extra no suman throughput; reubican la cola dentro de la base de datos, donde se vuelve contención.

### Tu tarea

1. \`service_times() -> Vec<u32>\` — un LCG determinista. \`seed\` arranca en \`1\`; en cada paso \`seed = (seed * 1103515245 + 12345) % 2147483648\`, y el tiempo de servicio es \`5 + (seed >> 16) % 21\`. Produce \`REQUESTS\` de ellos.
2. \`simulate(capacity, service) -> (u32, u32, usize, u32)\` — el request \`i\` llega en \`i * ARRIVAL_GAP\` y toma el slot que se libera antes. Devuelve \`(max wait, mean wait, checkout timeouts, makespan)\`; una espera mayor que \`CHECKOUT_TIMEOUT\` cuenta como timeout.
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

### Pistas

- Usa \`wrapping_mul\` / \`wrapping_add\` sobre un seed \`u64\` para que la multiplicación no pueda desbordar bajo \`-D warnings\`.
- \`free_at\` es \`vec![0u32; capacity]\`; un request arranca en \`max(free_at[slot], arrival)\`, y su espera es \`start - arrival\`.
- La espera media es división entera: \`total_wait / REQUESTS as u32\`.
- Nada aquí toca el reloj. La simulación tiene que ser determinista.
`,
  },
};
