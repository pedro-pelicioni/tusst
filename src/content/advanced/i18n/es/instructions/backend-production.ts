// ES · editor instructions — Running It in Production.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-production.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendProductionInstructionsEs: Record<string, { instructions: string }> = {
  "backend-production-1": {
    instructions: `## Counters, gauges e histograms

Un **counter** es monotónico y no significa nada como valor — lees su tasa. Un **gauge** es un nivel en un instante que se mueve en ambas direcciones. Un **histogram** son counters acumulativos por bucket más \`_sum\` y \`_count\`.

Dos trampas. Un gauge solo se ve en el momento del scrape, así que todo lo que sube y baja entre scrapes es invisible. Y cada valor distinto de label es una serie temporal aparte — los labels son para conjuntos acotados, nunca para un id de usuario.

### Tu tarea

1. Implementa \`Histogram\`: \`observe(v)\` suma \`v\` a \`sum\` e incrementa el primer bucket cuyo límite es \`>= v\`; \`count()\` totaliza las observaciones; \`above(bound)\` lee la cola larga a partir de los buckets.
2. Recorre los 12 ticks. El counter recibe \`ARRIVALS[t]\`; el gauge recibe \`ARRIVALS[t] - DEPARTURES[t]\`. Sigue el pico real en cada tick y el pico que vería un scrape, scrapeando cuando \`t % 3 == 2\`.
3. Observa cada latencia, imprime la fila de buckets, y después la media y cuántas superaron los 100 ms.

Salida esperada:

\`\`\`text
tick  accepted  active  scrape
   0         4       4  -
   1        10       9  -
   2        12       3  yes
   3        21      11  -
   4        26      14  -
   5        27       4  yes
   6        30       5  -
   7        37      11  -
   8        39       5  yes
   9        43       8  -
  10        46       9  -
  11        47       2  yes

counter accepted_total = 47 (monotonic)
gauge   active = 2, true peak = 14, peak seen by scrapes = 5

le<=10 le<=50 le<=100 le<=500 +Inf
    15      2       0       3    0
mean = 42.2 ms; over 100 ms = 3 of 20
\`\`\`

### Pistas

- \`observe\` recorre \`BOUNDS\` mientras \`v > BOUNDS[i]\`, así que un valor igual a un límite se queda en ese bucket. El índice con el que sales del loop es \`4\` (el bucket \`+Inf\`) para cualquier cosa por encima de \`500\`.
- \`above(100)\` encuentra el primer límite \`>= 100\` y suma todos los buckets que vienen después. No guardes las muestras para ordenarlas — la gracia es que los buckets ya lo saben.
- La columna de scrape imprime \`"yes"\` o \`"-"\`; el encabezado es \`tick  accepted  active  scrape\` con anchos \`{:>4}  {:>8}  {:>6}\`.
- Llama al gauge \`active\`: \`Gauge\` lleva tanto \`value\` como \`peak\`, y el pico real se mantiene con \`if active.value > active.peak { active.peak = active.value; }\` en cada tick — no solo en un scrape.
`,
  },

  "backend-production-2": {
    instructions: `## Percentiles desde buckets

La media es exacta: \`_sum / _count\`. Un cuantil no — calculas un rank, recorres los conteos acumulados de bucket hasta cruzarlo, y reportas el **límite superior** de ese bucket. Tus límites son la resolución de tu respuesta.

Los percentiles no son lineales, así que los p99 por instancia no se pueden promediar ni tomar el máximo. **Los conteos de bucket sí se pueden sumar**, y por eso la query de la flota suma los buckets antes de calcular el cuantil.

### Tu tarea

1. Implementa \`count()\`, \`mean()\` y \`quantile(q)\` — rank \`ceil(q · n)\`, recorre los conteos acumulados, devuelve el límite superior del bucket donde cruzas (\`f64::INFINITY\` para \`+Inf\`).
2. Construye \`api-1\` y \`api-2\` a partir de los conteos en los comentarios del starter, y después \`merged\` sumando los buckets y sumando las sums.
3. Imprime la tabla de buckets, y después una fila de count/sum/mean/p50/p95/p99 por histogram.
4. Imprime la media de los dos p95 contra el p95 fusionado real, y lo mismo para p99.

Salida esperada:

\`\`\`text
le       api-1  api-2  merged
1         120      0     120
2         300      0     300
5         380      2     382
10        150      3     153
25         40     10      50
100         5     20      25
500         4     40      44
2000        1     25      26
+Inf        0      0       0

          count       sum    mean     p50     p95     p99
api-1      1000      4200     4.2       5      10      25
api-2       100     42000   420.0     500    2000    2000
merged     1100     46200    42.0       5     500    2000

mean of the p95s: 1005.0   true merged p95: 500
mean of the p99s: 1012.5   true merged p99: 2000
\`\`\`

### Pistas

- Un helper \`row(h: &Hist)\` mantiene las tres filas idénticas: \`"{:<8} {:>6} {:>9.0} {:>7.1} {:>7.0} {:>7.0} {:>7.0}"\`.
- La etiqueta de la tabla de buckets es \`"+Inf"\` cuando \`i == BOUNDS.len()\`, y si no \`BOUNDS[i].to_string()\`.
- La fila de encabezado se imprime con el mismo format string que las filas de datos, con \`""\` en la columna del nombre.
- Dentro de \`quantile\`, recorre con un \`cum\` local: \`cum += self.counts[i]\`, y devuelve en cuanto \`cum >= rank\`.
`,
  },

  "backend-production-3": {
    instructions: `## Logs estructurados y un correlation ID

\`level=error event=user_load_failed user_id=91 org_id=4 err=timeout\` es un registro con dimensiones consultables. Una frase formateada es un solo string opaco al que solo puedes aplicarle regex.

Un log de producción son muchas requests intercaladas, así que un request ID que viaja por todas las capas es lo que vuelve a convertir el stream en una sola historia. Agrega \`depth\` y tienes el árbol de spans — y root menos children es el tiempo propio del handler.

### Tu tarea

1. \`fn emit(...) -> String\` construye una línea: \`seq\` con ceros a la izquierda hasta dos dígitos, después \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — más \`dur_ms\` **solo en un end**, y \`level=warn\` cuando un end supera los 40 ms.
2. Emite los 12 eventos en orden, con seq empezando en 1.
3. Filtra a \`req=7f3a\`. Para cada start, encuentra su end correspondiente, e imprime el span indentado \`depth * 2\` con su duración.
4. Imprime root, children y unaccounted, y después cuántas de las 12 líneas coincidieron.

Salida esperada:

\`\`\`text
--- log stream (two requests interleaved) ---
seq=01 level=info req=7f3a span=http.request depth=0 event=start
seq=02 level=info req=7f3a span=auth.verify depth=1 event=start
seq=03 level=info req=b91c span=http.request depth=0 event=start
seq=04 level=info req=7f3a span=auth.verify depth=1 event=end dur_ms=3
seq=05 level=info req=b91c span=auth.verify depth=1 event=start
seq=06 level=info req=7f3a span=db.query depth=1 event=start
seq=07 level=info req=b91c span=auth.verify depth=1 event=end dur_ms=2
seq=08 level=info req=b91c span=db.query depth=1 event=start
seq=09 level=warn req=7f3a span=db.query depth=1 event=end dur_ms=41
seq=10 level=warn req=7f3a span=http.request depth=0 event=end dur_ms=46
seq=11 level=info req=b91c span=db.query depth=1 event=end dur_ms=7
seq=12 level=info req=b91c span=http.request depth=0 event=end dur_ms=11

--- filtered req=7f3a ---
http.request      46ms
  auth.verify      3ms
  db.query        41ms
root 46ms, children 44ms, unaccounted 2ms
lines matching req=7f3a: 6 of 12
\`\`\`

### Pistas

- \`"seq={:02} level={} req={} span={} depth={} event={}"\`, y después \`push_str\` del sufijo \`" dur_ms={}"\` en un end.
- La fila del árbol usa anchos en runtime: \`"{:indent$}{:<w$}{:>4}ms"\` con \`indent = depth * 2\` y \`w = 16 - depth * 2\`.
- Los children son los eventos \`end\` con \`depth == 1\`; el root es \`depth == 0\`. No sumes los dos.
- Guarda la duración del root como \`total\` y la suma de los children como \`child\`; el trabajo propio del handler es \`total - child\`.
`,
  },

  "backend-production-4": {
    instructions: `## Backoff, jitter y un retry budget

El backoff exponencial espacia los retries pero los **sincroniza**: los clientes que fallaron juntos reintentan juntos. El full jitter — un delay tomado uniformemente de \`[0, backoff]\` — es lo que los descorrelaciona, y un tope evita que un cliente retenga un slot de conexión durante 17 minutos.

Los retries multiplican la carga justo cuando la capacidad está más baja. Un retry budget acota la amplificación como fracción del volumen de requests, en el cliente, sea cual sea la tasa de fallos.

### Tu tarea

1. Implementa el LCG: \`next()\` multiplica por \`6364136223846793005\` y suma \`1442695040888963407\` (con wrapping), devolviendo \`state >> 33\`; \`below(n)\` es \`next() % n\`, y \`0\` cuando \`n\` es \`0\`.
2. Siembra con \`0x2545F491\` e imprime, para los intentos \`0..5\`, el backoff con tope (\`BASE_MS << attempt\`, con tope en \`CAP_MS\`) junto a una tirada de full jitter.
3. Cuenta el total de intentos sin budget: cada llamada que falla consume \`MAX_RETRIES\`.
4. Cuéntalos otra vez con budget: gana \`BUDGET_PER_CALL\` por llamada, paga \`RETRY_COST\` por retry, deniega cuando no puedas pagar. Imprime intentos, amplificación y el desglose granted/denied para ambos.

Salida esperada:

\`\`\`text
attempt  backoff_ms  full_jitter_ms
      0         100              45
      1         200               1
      2         400             169
      3         800             501
      4        1000             517

40 calls, 25 of them failing, max 3 retries each
policy       attempts  amplification  granted  denied
no budget         115           2.88x       75       0
10% budget         43           1.07x        3      72
\`\`\`

### Pistas

- Toma el jitter con \`rng.below(b + 1)\` para que todo el intervalo cerrado sea alcanzable — por eso el intento 1 muestra 1 ms.
- \`BASE_MS.saturating_mul(1u64 << attempt)\`, y después acótalo a \`CAP_MS\`.
- Calcula el delay; nunca lo duermas. La lección es determinista a propósito.
- Las dos filas de política comparten \`"{:<12} {:>8}  {:>13.2}x {:>8}  {:>6}"\`; el conteo de granted de la fila sin budget es \`naive - CALLS\`.
- Guarda el saldo del budget en un \`tokens\` local: \`tokens += BUDGET_PER_CALL\` por llamada, y \`tokens -= RETRY_COST\` por cada retry que concedas.
`,
  },

  "backend-production-5": {
    instructions: `## Un circuit breaker como máquina de estados

**Closed** deja pasar las llamadas; una racha de fallos lo dispara. **Open** no hace ninguna llamada — quien llama falla en microsegundos en vez de en un timeout de 30 segundos. Tras un cooldown, **half-open** admite exactamente una sonda: el éxito cierra y limpia la racha, el fallo lo vuelve a abrir y reinicia el cooldown.

El breaker protege los threads y los slots de conexión de quien llama al menos tanto como protege a la dependencia.

### Tu tarea

Imprime \`t\`, el estado al entrar, la acción, el resultado y el siguiente estado, para los 22 ticks.

- **closed** — llama. \`THRESHOLD\` fallos consecutivos lo disparan a open, registrando \`opened_at\`.
- **open** — cortocircuito. \`COOLDOWN\` ticks después de \`opened_at\`, pasa a half-open.
- **half-open** — una sonda. El éxito cierra y limpia la racha; el fallo lo vuelve a abrir y reinicia el cooldown.

Termina con el número de llamadas downstream hechas y el número de ticks cortocircuitados.

Salida esperada:

\`\`\`text
t   state      action         result    next
0   closed     call           ok        closed
1   closed     call           ok        closed
2   closed     call           ok        closed
3   closed     call           fail 1/3  closed
4   closed     call           fail 2/3  closed
5   closed     call           fail 3/3  open
6   open       short-circuit  -         open
7   open       short-circuit  -         open
8   open       short-circuit  -         open
9   half-open  probe          fail      open
10  open       short-circuit  -         open
11  open       short-circuit  -         open
12  open       short-circuit  -         open
13  half-open  probe          fail      open
14  open       short-circuit  -         open
15  open       short-circuit  -         open
16  open       short-circuit  -         open
17  half-open  probe          ok        closed
18  closed     call           ok        closed
19  closed     call           ok        closed
20  closed     call           ok        closed
21  closed     call           ok        closed

downstream calls: 13, short-circuited: 9 of 22 ticks
\`\`\`

### Pistas

- Aplica la transición del cooldown al *principio* del tick, y después toma la instantánea \`before = state\` — la fila imprime el estado al entrar y el estado al salir.
- La columna de resultado es \`"fail {}/{}"\` para un fallo en estado closed pero un \`"fail"\` a secas para una sonda fallida, así que ramifica sobre \`before == State::HalfOpen\`.
- \`t.saturating_sub(opened_at) >= COOLDOWN\` mantiene t=0 a salvo.
- Formato de fila: \`"{:<3} {:<10} {:<14} {:<9} {}"\`.
- La racha de fallos es un \`consecutive\` local: un fallo lo incrementa y dispara en \`consecutive >= THRESHOLD\`; cualquier éxito pone \`consecutive = 0\`.
`,
  },

  "backend-production-6": {
    instructions: `## Shutdown ordenado

Cuatro fases, en orden: dejar de aceptar (primero falla readiness, después se cierra el listener), drenar lo que está en vuelo, acotar el drenado con un plazo, cerrar a la fuerza el resto.

Salir de inmediato con SIGTERM mata todas las requests en vuelo. Drenar mata solo las que siguen corriendo al llegar el plazo — y el plazo tiene que quedar por debajo del grace period del orquestador, o llega antes el SIGKILL y no hubo drenado alguno.

### Tu tarea

En cada tick: admite las llegadas del tick solo mientras se acepta (si no, cuenta un 503), decrementa cada request en vuelo, retira las que llegan a 0, e imprime la fila.

- En \`SIGTERM_AT\`: deja de aceptar, cambia readiness a \`503\`, y registra cuántas estaban en vuelo.
- Para cuando \`in_flight\` esté vacío (un drenado limpio), o cuando hayan pasado \`DEADLINE\` ticks desde SIGTERM — entonces cierra a la fuerza lo que quede, imprimiendo los ids con \`{:?}\`.
- Termina con completadas, rechazadas y cerradas a la fuerza, y después lo que una salida inmediata habría matado en su lugar.

Salida esperada:

\`\`\`text
t   accepting  ready  arrived  admitted  in_flight  done
0   yes        200    2        2         2          0
1   yes        200    1        1         1          2
2   yes        200    3        3         3          3
3   yes        200    1        1         3          4
4   yes        200    2        2         5          4
5   no         503    2        0         4          5
6   no         503    0        0         2          7
7   no         503    0        0         2          7
8   no         503    0        0         1          8
9   no         503    0        0         1          8
10  no         503    0        0         1          8
11  no         503    0        0         1          8
12  no         503    0        0         1          8
13  no         503    0        0         1          8
deadline hit at t=13 -- force-closing [8]

completed 8, rejected 2 (503 after SIGTERM), force-closed 1
immediate exit at t=5 would have killed 5 in-flight instead
\`\`\`

### Pistas

- Itera con \`for t in 0..20u32\` y sal con \`break\`; la corrida termina en t=13.
- Primero decrementa, después \`in_flight.retain(|r| r.left > 0)\`; \`completed\` es la caída en la longitud.
- Las llegadas más allá de \`ARRIVALS.len()\` son \`0\`, así que las dos llegadas de t=5 son los únicos rechazos.
- Formato de fila: \`"{:<3} {:<10} {:<6} {:<8} {:<9} {:<10} {}"\`.
- Registra el tick de la señal como \`sigterm_tick\`; el drenado termina cuando \`t - sigterm_tick >= DEADLINE\`.
`,
  },

  "backend-production-7": {
    instructions: `## Little's Law

\`L = λ · W\`. L son las requests en el sistema, λ la tasa de llegada, W el tiempo en el sistema. Se cumple para cualquier sistema estable sin ninguna suposición sobre la distribución de las llegadas.

Por debajo de la capacidad, la latencia es el tiempo de servicio. Pasada la capacidad el backlog crece linealmente y sin límite, así que el objetivo de latencia es lo que fija el límite de concurrencia: admite L, descarta la siguiente de inmediato.

### Tu tarea

1. \`capacity()\` es \`WORKERS / SERVICE_S\`. \`concurrency(lambda, w_s)\` es \`lambda * w_s\` — escribe Little's Law una sola vez y reutilízala.
2. Para cada tasa ofrecida imprime L, utilización, el backlog tras un segundo de sobrecarga, la latencia resultante (\`SERVICE_S + backlog / capacity()\`) y un veredicto de \`ok\`, \`at capacity\` o \`saturated\`.
3. Imprime los workers necesarios para servir el pico con el tiempo de servicio actual.
4. Convierte \`TARGET_MS\` en un límite de concurrencia, divídelo en en-servicio y encolados, e imprime cuánto tarda la sobrecarga en llenar la cola.

Salida esperada:

\`\`\`text
capacity = L / W = 32 / 0.020s = 1600 rps

offered      L  util%  backlog_1s  latency_ms  verdict
    400    8.0   25.0           0        20.0  ok
    800   16.0   50.0           0        20.0  ok
   1200   24.0   75.0           0        20.0  ok
   1600   32.0  100.0           0        20.0  at capacity
   1800   36.0  112.5         200       145.0  saturated
   2000   40.0  125.0         400       270.0  saturated

to serve 2000 rps at W = 20 ms you need L = 2000 * 0.020 = 40 workers
latency target 50 ms at 1600 rps: L = 1600 * 0.050 = 80 in system
  = 32 in service + 48 queued -> concurrency limit 80, shed beyond it
  at 1800 rps the queue passes 48 after 0.24s of overload
\`\`\`

### Pistas

- \`concurrency\` recibe **segundos**, así que pásale \`TARGET_MS / 1000.0\`.
- Por debajo de la capacidad el backlog es \`0.0\` y la latencia es \`SERVICE_S * 1000.0\`; el veredicto es \`"at capacity"\` solo cuando la utilización llega a 100.
- La fila de la tabla es \`"{:>7.0} {:>6.1} {:>6.1} {:>11.0} {:>11.1}  {}"\`.
- \`queue_max / overload\` a 1800 rps es \`48 / 200 = 0.24\` segundos.
`,
  },
};
