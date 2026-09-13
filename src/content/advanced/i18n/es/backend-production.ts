import type { LessonStep } from "@/content/steps";

// ES · Running It in Production.
//
// Overlay for ../../steps/backend-production.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendProductionStepsEs: Record<string, LessonStep[]> = {
  "backend-production-1": [
    {
      kind: "theory",
      body: `Tres tipos de instrumento, y cada uno responde una pregunta distinta.

Un **counter** es monotónico: solo sube, y solo se reinicia con un restart del proceso. Su valor instantáneo no significa nada; lo que lees es su *tasa*.

\`\`\`text
rate(http_requests_total[5m])
\`\`\`

Un **gauge** es un nivel puntual que se mueve en ambas direcciones: conexiones activas, profundidad de la cola, tamaño del pool, requests en vuelo.

Un **histogram** es un conjunto de counters de bucket acumulativos más \`_sum\` y \`_count\`. Le observas valores hacia adentro y le consultas distribuciones hacia afuera.

Estos tres son los que deberías usar. Prometheus también trae un **summary**, que calcula sus cuantiles dentro del proceso y los exporta como números terminados — y los cuantiles, a diferencia de los conteos de bucket, no se pueden sumar, así que un summary no se puede fusionar a lo largo de una flota. Ese es el tema completo de la próxima lección, y la razón por la que un histogram es el default.

Equivocarte de tipo no es un error de estilo: un counter no puede decirte concurrencia, y un gauge no puede decirte tasa.`,
    },
    {
      kind: "theory",
      body: `Dos trampas, y las dos muerden en producción.

**Un gauge solo se ve en el momento del scrape**, típicamente cada 15–30 s. Todo lo que pasa entre scrapes es invisible. En el ejercicio el pico real de 14 requests en vuelo nunca se observa, porque cada scrape cae en un valle y reporta 5. Si el pico es lo que importa — agotamiento del pool, marca de agua de la cola — exporta un gauge de máximo-desde-el-último-scrape junto al instantáneo, o usa un histogram.

**Cada valor distinto de label es una serie temporal separada.** Un label \`user_id\` en un histogram de 9 buckets con 100k usuarios son 900.000 series, y así es como tumbas tu propio backend de métricas. Los labels son para conjuntos acotados: ruta, método, clase de status.`,
    },
    {
      kind: "quiz",
      question: "Un gauge de requests en vuelo se scrapea cada 15 s. La muestra más alta registrada en todo el día es 5. ¿Qué establece eso sobre el pico real?",
      options: [
        "Solo que algún scrape vio 5 — cualquier cosa que subió y bajó entre dos scrapes nunca fue muestreada, así que el pico real puede ser mucho más alto",
        "El pico real fue 5: un gauge exporta el máximo alcanzado desde el scrape anterior",
        "El pico real fue 5, porque una request vive más que el intervalo de scrape, así que nada puede esconderse entre muestras",
      ],
      answer: 0,
      explain: "Un gauge simple reporta el valor en el instante en que se lee, no un máximo sobre el intervalo — eso es un instrumento aparte que tienes que exportar a propósito. La tercera opción es el argumento que la gente realmente da, y falla exactamente cuando importa: las ráfagas de requests cortas son justo los picos que agotan un pool.",
    },
    {
      kind: "fill",
      prompt: "Asigna una observación a un bucket. Los buckets de Prometheus son `le` — menor **o igual** que el límite.",
      file: "main.rs",
      before: "while i < BOUNDS.len() && v ",
      after: " BOUNDS[i] {\n    i += 1;\n}",
      choices: ["> ", ">= ", "< "],
      answer: 0,
      explain: "Con `>=`, un valor igual al límite se salta su propio bucket: una request de 10 ms cae en `le<=50` y el conteo de `le<=10` sub-reporta en silencio. `<` camina en la dirección equivocada y mete todo en el primer bucket.",
    },
    {
      kind: "quiz",
      question: "Un servicio exporta `http_request_duration_sum` y `http_request_duration_count` y nada más. ¿Qué pregunta no puede responder?",
      options: [
        "Cuántas requests tardaron más de 100 ms — eso es un conteo de bucket, y una suma y un conteo no pueden reconstruir uno",
        "La latencia media de los últimos cinco minutos — una suma y un conteo no se pueden convertir en tasa sobre una ventana",
        "El tiempo total que el servicio pasó sirviendo requests — `_sum` es un conteo de requests, no un total de duraciones",
      ],
      answer: 0,
      explain: "La media es exactamente lo que esos dos te dan: `rate(_sum[5m]) / rate(_count[5m])`. En el ejercicio la media es 42,2 ms mientras 15 de 20 requests terminaron en menos de 10 ms — la media es real y también es inútil para la cola larga.",
    },
    {
      kind: "editor",
      intro: `### Tres instrumentos sobre una misma carga

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

El pico real del gauge es 14 y todos los scrapes se lo pierden. La media es 42,2 ms y 15 de 20 requests terminaron en menos de 10 ms.`,
    },
  ],

  "backend-production-2": [
    {
      kind: "theory",
      body: `Prometheus expone \`_bucket{le="..."}\` como conteos **acumulativos**, más \`_sum\` y \`_count\`.

La media es exacta: \`_sum / _count\`. Un cuantil no lo es. Calculas un rank, recorres los conteos acumulados hasta cruzarlo, y reportas el límite superior de ese bucket:

\`\`\`text
rank = ceil(q · n)
recorre los conteos acumulados hasta que cum >= rank
respuesta = el límite superior de ese bucket
\`\`\`

Así que un p99 reportado de 2000 ms significa solo "en algún punto entre 500 y 2000 ms". **Los límites de tus buckets son la resolución de tu respuesta**, y por eso tienen que rodear tu SLO. Apretar un SLO significa agregar límites, no agregar muestras.`,
    },
    {
      kind: "theory",
      body: `Los percentiles no son lineales. No puedes promediarlos entre instancias, y tampoco puedes tomar el máximo. **Sumar conteos de bucket sí es válido**, porque cada bucket es un counter — esa es toda la razón por la que los histograms de Prometheus tienen esta forma, y por la que la query de flota suma los buckets *antes* de calcular el cuantil:

\`\`\`text
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_bucket[5m])))
\`\`\`

El ejercicio hace visible el error en ambas direcciones. Una instancia ocupada y sana (1000 req) y una tranquila y enferma (100 req) dan media-de-los-p99 = 1012,5 contra un valor real de 2000, y media-de-los-p95 = 1005 contra un valor real de 500. Promediar subestimó uno y duplicó el otro, porque la media sin ponderar ignora que api-1 carga el 91% del tráfico.

La media fusionada es 42 ms y el p99 fusionado es 2000 ms — una brecha de 48x. Una media de 42 ms nunca despierta a nadie; un usuario de cada cien está esperando dos segundos. Criterion te da la misma distribución para un benchmark, y un flamegraph te dice *dónde* se fue el tiempo de la cola larga una vez que el histogram te dijo que existe.`,
    },
    {
      kind: "quiz",
      question: "Doce instancias exportan cada una su p99. ¿Cuál es el p99 de la flota?",
      options: [
        "Ninguno de los p99 por instancia se puede combinar — suma los buckets entre instancias primero, y después calcula el cuantil a partir de los conteos fusionados",
        "El máximo de ellos: p99 es una medida de peor caso, así que la peor instancia fija el de la flota",
        "El promedio de ellos, ponderado por el conteo de requests de cada instancia — una media de cuantiles ponderada por requests es exacta",
      ],
      answer: 0,
      explain: "La media ponderada es la respuesta equivocada sofisticada, y sigue estando equivocada: ponderar corrige el sesgo de tráfico, pero el cuantil de una mezcla no es ninguna media de los cuantiles de las partes. Solo los buckets son aditivos.",
    },
    {
      kind: "fill",
      prompt: "Fusiona los histograms de dos instancias en uno solo.",
      file: "main.rs",
      before: "for i in 0..9 {\n    merged.counts[i] = ",
      after: ";\n}",
      choices: ["a.counts[i] + b.counts[i]", "(a.counts[i] + b.counts[i]) / 2", "a.counts[i].max(b.counts[i])"],
      answer: 0,
      explain: "Cada bucket es un counter, así que la fusión es una suma. Promediar parte a la mitad el conteo de observaciones de la flota y reporta una distribución que nadie experimentó; tomar el máximo no cuenta nada dos veces y descarta por completo la cola larga de la instancia tranquila.",
    },
    {
      kind: "quiz",
      question: "Tus buckets son `..., 500, 2000, +Inf` y el dashboard reporta p99 = 2000 ms. ¿Qué te dijo?",
      options: [
        "Que el 99% de las requests terminaron dentro de 2000 ms — el p99 real está en algún punto por encima de 500 ms, y 2000 es un límite que tú elegiste, no una medición",
        "Que el 1% más lento de las requests tardó aproximadamente 2000 ms cada una",
        "Que una request de cada cien tardó exactamente 2000 ms — el histogram guarda el valor observado en ese rank",
      ],
      answer: 0,
      explain: "Un histogram por buckets no guarda ninguna muestra, solo conteos. Todo p99 entre 500 y 2000 reporta 2000; para resolver un SLO de 900 ms agregas un límite de 1000 ms.",
    },
    {
      kind: "editor",
      intro: `### Fusiona dos instancias sin mentir

1. Implementa \`count()\`, \`mean()\` (\`_sum / _count\`) y \`quantile(q)\` — rank \`ceil(q · n)\`, recorre los conteos acumulados, devuelve el límite superior del bucket donde cruzas.
2. Construye \`api-1\` y \`api-2\` a partir de los conteos en los comentarios del starter, y después \`merged\` **sumando los buckets** y sumando las sums.
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

Promediar los p95 duplica la verdad; promediar los p99 la parte a la mitad.`,
    },
  ],

  "backend-production-3": [
    {
      kind: "theory",
      body: `Una línea de log es key=value, no una oración.

\`\`\`rust
error!("failed to load user {} for org {}", uid, org);
\`\`\`

Eso es un string opaco. No puedes agregarlo, indexarlo ni alertar sobre él sin un regex que se rompe la próxima vez que alguien edita la redacción. Esto es un registro:

\`\`\`text
level=error event=user_load_failed user_id=91 org_id=4 err=timeout
\`\`\`

Cada campo es una dimensión consultable, el texto del mensaje es estable, y la misma línea se serializa a JSON para un pipeline de ingesta sin cambios. Eso es lo que \`tracing\` te da por encima de \`log\`: un \`Subscriber\` formatea campos estructurados en vez de un string pre-renderizado, y \`#[instrument]\` adjunta los campos de un span a cada evento dentro de él automáticamente.`,
    },
    {
      kind: "theory",
      body: `Un log de producción son muchas requests intercaladas. En el ejercicio, los seq 01–12 alternan entre dos request IDs y **ninguna línea está junto a la línea a la que pertenece**. Un request ID generado en el borde y arrastrado por cada capa — y hacia afuera por el cable como \`traceparent\` hacia los servicios downstream — es lo que convierte ese stream de vuelta en una historia.

Agrega \`depth\`, o un span padre real, y puedes reconstruir el árbol con duraciones. Fíjate en lo que sale:

\`\`\`text
root 46ms, hijos 44ms, sin contabilizar 2ms
\`\`\`

Esos 2 ms son el trabajo propio del handler. Es el número que te dice si optimizar tu código o tu dependencia, y no puedes sacarlo de ninguna de las dos duraciones por separado.

Regla de cardinalidad: un request ID está bien como **campo** de log, y es catastrófico como **label** de métrica.`,
    },
    {
      kind: "quiz",
      question: "El equipo no tiene correlation ID pero sí loguea `user_id` y `endpoint` en cada línea. ¿Por qué eso no es equivalente?",
      options: [
        "Dos requests concurrentes del mismo usuario al mismo endpoint producen líneas intercaladas que ningún filtro puede separar",
        "`user_id` y `endpoint` son campos de alta cardinalidad, así que el backend de logs se niega a indexarlos",
        "Las líneas de log de una request son contiguas en el stream, así que un filtro es innecesario desde el principio",
      ],
      answer: 0,
      explain: "Se degrada exactamente cuando lo necesitas: bajo carga, con un cliente que reintenta, durante el incidente. Las otras dos opciones son falsas sobre un backend de logs (los campos son baratos; los *labels* de métricas son los que no) y falsas sobre el stream (el intercalado es el default).",
    },
    {
      kind: "fill",
      prompt: "Suma los spans hijos, para poder separar el tiempo propio del handler del de lo que llama.",
      file: "main.rs",
      before: "EVENTS.iter()\n    .filter(|e| e.0 == \"7f3a\" && e.3 == \"end\" && ",
      after: ")\n    .map(|e| e.4)\n    .sum()",
      choices: ["e.2 == 1", "e.2 == 0", "e.2 >= 0"],
      answer: 0,
      explain: "Depth 0 es el root — justo el span del que estás restando. Incluirlo reporta 0 ms sin contabilizar y esconde el costo propio del handler; incluir todo da 90 ms de hijos dentro de un root de 46 ms.",
    },
    {
      kind: "quiz",
      question: "Un span root dura 46 ms y sus dos spans hijos suman 44 ms. ¿Qué está haciendo el handler en sí?",
      options: [
        "2 ms de trabajo — los spans hijos son el tiempo de lo que se llamó, y la diferencia es el tiempo propio de quien llama",
        "44 ms de trabajo — los hijos son las operaciones propias del handler, instrumentadas",
        "46 ms de trabajo — el span root mide todo lo que hace el handler, hijos incluidos",
      ],
      answer: 0,
      explain: "Confundir los dos te manda a optimizar el proceso equivocado. 2 ms de tiempo propio contra 41 ms en `db.query` significa que la respuesta es un index o reescribir la query, no un handler más rápido.",
    },
    {
      kind: "editor",
      intro: `### Reconstruye una request a partir de un stream intercalado

1. \`fn emit(...) -> String\` construye una línea estructurada: \`seq\` con ceros a la izquierda hasta dos dígitos, \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — más \`dur_ms\` **solo en un end**, y \`level=warn\` cuando un end supera los 40 ms.
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

2 ms sin contabilizar son el trabajo propio del handler. 41 de los 46 ms están en \`db.query\`.`,
    },
  ],

  "backend-production-4": [
    {
      kind: "theory",
      body: `Un intervalo de retry fijo es peor que ningún retry: golpea a una dependencia en apuros exactamente en el peor momento, una y otra vez. El backoff exponencial — \`base · 2^attempt\`, con un tope — reparte los intentos.

Pero **el backoff solo sincroniza**. Si 500 clientes fallan en el mismo instante, todos reintentan en t+100 ms, y después todos en t+300 ms: una estampida (thundering herd) con horario prolijo. El full jitter los decorrelaciona:

\`\`\`text
delay = uniform(0, min(cap, base · 2^attempt))
\`\`\`

El tope también importa. Duplicar sin tope desde una base de 100 ms llega a \`100 << 13\` = 819.200 ms — trece minutos y medio — en el intento 13, y un cliente al que el usuario abandonó hace rato sigue ocupando un slot de conexión.

El LCG del ejercicio se siembra de forma determinista a propósito — una política de retry que no puedes reproducir es una política de retry que no puedes testear. Fíjate en que el intento 1 saca 1 ms de jitter: el full jitter de verdad puede devolver casi cero, y por eso algunos sistemas prefieren jitter decorrelacionado con un piso.`,
    },
    {
      kind: "theory",
      body: `Los retries multiplican la carga exactamente cuando el sistema tiene menos capacidad para absorberla. Con 3 retries sobre una llamada que falla el 62% de las veces, el ejercicio lleva la carga ofrecida de 40 intentos a 115 — **2,88x de amplificación apuntada a una dependencia que ya está caída**. Esa es la forma de la mayoría de los outages en cascada: la lógica de retry convierte una dependencia degradada en una muerta.

Un **retry budget** lo arregla en el cliente. Los retries pueden consumir como máximo una fracción fija del volumen de requests — 10% aquí, implementado como un token bucket que gana 10 centi-tokens por llamada y paga 100 por retry. La amplificación baja a 1,07x, 72 de 75 retries se deniegan, y la dependencia gana espacio para recuperarse.

Dos reglas no negociables: reintenta solo operaciones idempotentes, y nunca reintentes un 4xx. La dependencia respondió correctamente; la request está mal, y va a estar igual de mal la segunda vez.`,
    },
    {
      kind: "quiz",
      question: "Todos los clientes usan backoff exponencial. ¿Por qué igual puede formarse una estampida (thundering herd)?",
      options: [
        "Los clientes que fallaron juntos hacen backoff por las mismas cantidades, así que llegan juntos a cada retry — el backoff cambia cuándo llega la estampida, no el hecho de que llega",
        "El backoff pone un tope al delay, y una vez que todos los clientes están en el tope reintentan a la frecuencia del tope para siempre",
        "El crecimiento exponencial le gana a la recuperación de la dependencia, así que la estampida se forma cuando la dependencia ya está sana",
      ],
      answer: 0,
      explain: "El jitter es lo que rompe la correlación. La opción de los clientes en el tope describe un estado estable real, pero la estampida ya está sincronizada mucho antes del tope — está sincronizada desde el primer retry.",
    },
    {
      kind: "fill",
      prompt: "Convierte un backoff en un delay con full jitter.",
      file: "main.rs",
      before: "let b = backoff(attempt);\nlet delay = ",
      after: ";",
      choices: ["rng.below(b + 1)", "b / 2 + rng.below(b / 2 + 1)", "b + rng.below(b + 1)"],
      answer: 0,
      explain: "El full jitter es uniforme sobre todo el intervalo `[0, b]`. La segunda opción es *equal* jitter — una variante real de AWS con piso en `b/2`, que parte la dispersión a la mitad y por eso decorrelaciona menos. La tercera agrega jitter encima del backoff, lo que retrasa a todos los clientes sin decorrelacionarlos en absoluto.",
    },
    {
      kind: "quiz",
      question: "Todos los clientes tienen un tope de 3 retries por llamada. ¿Por qué eso no acota la carga que ve la dependencia?",
      options: [
        "Un tope por llamada acota una llamada y no dice nada del volumen: con una tasa de fallo del 100% la flota igual entrega 4x su tráfico normal",
        "El tope es por cliente, y los clientes no pueden verse entre sí, así que el total no está acotado ni siquiera con una tasa de fallo baja",
        "Los retries se saltan el tope cuando el primer intento da timeout en vez de devolver un error",
      ],
      answer: 0,
      explain: "La amplificación es una propiedad de la flota, así que la cota tiene que expresarse contra el volumen de la flota. Un budget del 10% de las requests se sostiene con cualquier tasa de fallo; un tope de 3 se sostiene solo con una tasa de fallo que tú no controlas.",
    },
    {
      kind: "editor",
      intro: `### Acota la amplificación

1. Implementa el LCG: \`next()\` multiplica por \`6364136223846793005\` y suma \`1442695040888963407\` (con wrapping), devolviendo \`state >> 33\`; \`below(n)\` es \`next() % n\`, y \`0\` cuando \`n\` es \`0\`.
2. Siembra con \`0x2545F491\` e imprime, para los intentos \`0..5\`, el backoff con tope (\`BASE_MS << attempt\`, con tope en \`CAP_MS\`) junto a una tirada de full jitter.
3. Cuenta el total de intentos sin budget: cada llamada que falla consume \`MAX_RETRIES\`.
4. Cuéntalos otra vez con budget: gana \`BUDGET_PER_CALL\` por llamada, paga \`RETRY_COST\` por retry, deniega el retry cuando no puedas pagar. Imprime intentos, amplificación y el desglose granted/denied para ambos.

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

2,88x se convierte en 1,07x, y 72 de 75 retries nunca salen del cliente.`,
    },
  ],

  "backend-production-5": [
    {
      kind: "theory",
      body: `Tres estados, y las transiciones entre ellos son todo el mecanismo.

**Closed** — las llamadas pasan. Una racha de fallos que alcanza el umbral lo dispara.
**Open** — no se hace ninguna llamada. Quien llama falla de inmediato con el error propio del breaker, en microsegundos en vez de un connect timeout de 30 segundos.
**Half-open** — se alcanza tras un cooldown. Se deja pasar exactamente una sonda. El éxito cierra el breaker y limpia la racha de fallos; el fallo lo vuelve a abrir y reinicia el cooldown.

El ejercicio imprime el recorrido completo: se dispara en t=5, sondas en t=9, 13 y 17, cierre en 17. Fíjate en lo que el breaker compra mientras la dependencia sigue caída — 9 de 22 ticks cortocircuitados, que son 9 threads o slots de conexión que nunca se bloquearon en una llamada condenada.

Ese es el punto real. **Un breaker protege a quien llama del agotamiento de recursos al menos tanto como protege a quien recibe la llamada.**`,
    },
    {
      kind: "theory",
      body: `Los parámetros, y dónde salen mal.

**Un umbral de fallos consecutivos es simple pero nervioso.** Las librerías de producción usan en cambio una tasa de fallo móvil — "más del 50% de las últimas 100 llamadas, mínimo 20 llamadas" — porque eso no se dispara con un par de mala suerte y no se queda cerrado bajo una tasa de fallo estable del 40%.

**Half-open debe admitir una sonda, no reanudar el tráfico normal.** Cerrar directo a carga completa vuelve a inundar una dependencia que acaba de volver con un cache frío, y dispara el breaker otra vez de inmediato.

**No todos los fallos cuentan.** Un connect timeout o un 503 deberían; un 400 no — la dependencia respondió correctamente y va a responder igual la próxima vez.

Relacionado, y vale la pena tenerlo claro: una sonda de **liveness** responde "¿el orquestador debería reiniciarme?" y no debe depender de nada downstream, o una dependencia enferma reinicia toda tu flota. Una sonda de **readiness** responde "¿el load balancer debería enrutar hacia mí?" y legítimamente sí puede.`,
    },
    {
      kind: "quiz",
      question: "El cooldown expira. ¿Por qué el breaker pasa a half-open en vez de volver directo a closed?",
      options: [
        "Cerrar manda la carga completa a una dependencia que nadie ha probado; half-open gasta exactamente una request en averiguarlo primero",
        "Half-open existe para resetear el contador de fallos, cosa que closed no puede hacer mientras hay una racha en curso",
        "El cooldown es un mínimo, y half-open mantiene el breaker abierto hasta que la dependencia se reporta sana",
      ],
      answer: 0,
      explain: "La dependencia en recuperación es el caso frágil: caches fríos, connection pools fríos, un backlog por procesar. Una sonda es una pregunta barata; una reconexión en estampida es lo que la vuelve a tumbar.",
    },
    {
      kind: "fill",
      prompt: "La sonda half-open falló. Vuelve a abrir el breaker.",
      file: "main.rs",
      before: "} else if state == State::HalfOpen {\n    state = State::Open;\n    opened_at = ",
      after: ";\n}",
      choices: ["t", "opened_at", "0"],
      answer: 0,
      explain: "El cooldown tiene que reiniciarse desde *este* fallo. Mantener el `opened_at` original deja el cooldown ya expirado, así que el breaker vuelve a half-open en el siguiente tick y sondea una dependencia muerta en cada tick — justo el martilleo que el breaker existe para frenar. `0` es el mismo bug, de forma permanente.",
    },
    {
      kind: "quiz",
      question: "¿Qué protege primero un circuit breaker?",
      options: [
        "A quien llama — sus threads y slots de conexión dejan de consumirse en llamadas que de todas formas van a dar timeout",
        "A quien recibe la llamada — descartar carga es lo que permite que una dependencia en apuros se recupere",
        "Al usuario — un error rápido es mejor experiencia que uno lento",
      ],
      answer: 0,
      explain: "Aliviar a la dependencia y fallar rápido son beneficios reales, pero son consecuencias. Quien llama sin un breaker muere de la enfermedad de la dependencia: cada worker estacionado en un timeout de 30 segundos, y un outage en una dependencia se convierte en un outage en tu servicio.",
    },
    {
      kind: "editor",
      intro: `### Recorre la máquina de estados

Imprime \`t\`, el estado al entrar, la acción, el resultado y el siguiente estado, para los 22 ticks.

- **closed** — llama. \`THRESHOLD\` fallos consecutivos lo disparan a open, registrando \`opened_at\`.
- **open** — cortocircuito; no hagas ninguna llamada. \`COOLDOWN\` ticks después de \`opened_at\`, pasa a half-open.
- **half-open** — una sonda. El éxito cierra el breaker y limpia la racha; el fallo lo vuelve a abrir y reinicia el cooldown.

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

13 llamadas en vez de 22, y las dos sondas fallidas costaron una request cada una en vez de una estampida.`,
    },
  ],

  "backend-production-6": [
    {
      kind: "theory",
      body: `Cuatro fases, en este orden.

**1. Dejar de aceptar.** Con SIGTERM, cambia la sonda de readiness a fallando y cierra el listener, para que el load balancer deje de enrutar requests nuevas aquí mientras el proceso sigue vivo. Readiness tiene que cambiar *antes* de que el listener cierre en un clúster real — el LB necesita unos segundos para darse cuenta, y por eso los handlers de shutdown en producción duermen antes de cerrar nada.

**2. Drenar.** Sigue sirviendo lo que ya está en vuelo. La curva de drenado del ejercicio es 5 → 4 → 2 → 1 a medida que las requests se retiran.

**3. Plazo.** El drenado no puede ser ilimitado: una request atascada retendría el pod para siempre, y el período de gracia del propio orquestador no va a esperar. Kubernetes te da 30 s y después manda SIGKILL.

**4. Cierre forzado** de lo que quede, y loguea qué requests mataste — aquí la request 8, el outlier de 20 ticks.`,
    },
    {
      kind: "theory",
      body: `Qué compra esto, y qué no.

Salir de inmediato con SIGTERM mata 5 requests en vuelo. Drenar mata 1. Esa diferencia es el deploy que aparece como un pico de p99 y una ráfaga de 502 versus el deploy del que nadie se entera — multiplicado por cada pod en un rolling update.

Las requests rechazadas son comportamiento correcto, no errores: un 503 con la conexión cerrándose es una señal al balancer para que enrute a otro lado.

Dos cosas que el shutdown ordenado **no** te da. No te da **idempotencia** — una request matada en el plazo puede haber hecho commit a medias, así que el trabajo en sí tiene que ser seguro de reintentar. Y no rescata el **trabajo de larga duración**: un job de 10 minutos no va detrás de una request, va en una cola cuyo consumidor pueda interrumpirse y reanudarse.

Los rollbacks son la misma familia de pensamiento. Un rollback tiene que ser tan automático como un deploy porque es la única remediación cuyo radio de impacto ya entiendes.`,
    },
    {
      kind: "quiz",
      question: "¿Es equivalente cerrar el listener y cambiar readiness a fallando, o importa el orden?",
      options: [
        "Readiness primero: cerrar el socket mientras el balancer todavía cree en este pod rechaza conexiones que está enrutando aquí activamente",
        "Listener primero: un socket abierto es lo que mantiene al balancer enrutando, así que cerrarlo es lo que realmente drena el tráfico",
        "Equivalente — ambos dejan el pod inalcanzable, y el balancer descubre cualquiera de los dos en su próximo health check",
      ],
      answer: 0,
      explain: "Drenan dos cosas distintas. El cambio de readiness drena el *enrutamiento*; el cierre del listener drena el *socket*. Haz el socket primero y cada request que el balancer manda en los segundos antes de darse cuenta recibe un connection refused, que es exactamente la ráfaga de 502 que estabas evitando.",
    },
    {
      kind: "fill",
      prompt: "Admite una llegada solo mientras el servidor sigue aceptando.",
      file: "main.rs",
      before: "for _ in 0..arrived {\n    if ",
      after: " && next_id < SERVICE.len() { /* admit */ } else { rejected += 1; }\n}",
      choices: ["accepting", "t < SIGTERM_AT + DEADLINE", "in_flight.len() < 5"],
      answer: 0,
      explain: "La segunda opción sigue admitiendo durante toda la ventana de drenado — aceptando trabajo que ya prometiste cerrar a la fuerza en el plazo. La tercera es un límite de concurrencia: algo bueno de tener, y ningún sustituto, ya que admite requests nuevas después de SIGTERM tan campante siempre que haya lugar.",
    },
    {
      kind: "quiz",
      question: "El plazo de drenado se describe como una red de seguridad que nunca debería activarse, así que se fija en 60 s. ¿Qué tiene de malo?",
      options: [
        "Se activa precisamente con las requests que ya son patológicas, y 60 s supera el período de gracia de 30 s de Kubernetes — SIGKILL llega primero y el drenado nunca termina",
        "Un plazo largo mantiene abiertas las conexiones del pod, así que el balancer sigue enrutando hacia él durante los 60 s completos",
        "El plazo es por request, así que un plazo de 60 s deja acumular 60 s de trabajo nuevo antes de aplicarse",
      ],
      answer: 0,
      explain: "Un plazo más largo que el período de gracia del orquestador es un plazo que no existe, y te queda el shutdown desordenado que intentabas evitar. Elígelo por debajo del período de gracia, y espera que se active — las requests que mata son las que nunca iban a terminar.",
    },
    {
      kind: "editor",
      intro: `### Drenar, plazo, cierre forzado

En cada tick: admite las llegadas del tick solo mientras se acepta (si no, cuenta un 503), decrementa cada request en vuelo, retira las que llegan a 0, e imprime la fila.

- En \`SIGTERM_AT\`: deja de aceptar, cambia readiness a \`503\`, y recuerda cuántas estaban en vuelo.
- Para cuando \`in_flight\` esté vacío (un drenado limpio), o cuando hayan pasado \`DEADLINE\` ticks desde SIGTERM — entonces cierra a la fuerza lo que quede, imprimiendo los ids.
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

Una request matada en vez de cinco, y la que muere es el outlier de 20 ticks que nunca iba a terminar.`,
    },
  ],

  "backend-production-7": [
    {
      kind: "theory",
      body: `\`\`\`text
L = λ · W
\`\`\`

**L** es el número de requests *en el sistema* — siendo servidas más encoladas. **λ** es la tasa de llegada. **W** es el tiempo que una request pasa en el sistema.

Se cumple para cualquier sistema estable, sin ninguna suposición sobre la distribución de llegadas. Por eso es el único resultado de teoría de colas que vale la pena memorizar.

Léelo de tres maneras.

**Hacia adelante** — 1200 rps con un objetivo de 250 ms necesita 300 slots concurrentes.
**Hacia atrás** — 32 workers con 20 ms de servicio cada uno son 32/0,020 = 1600 rps de capacidad, y punto; ningún tuning saca más sin cambiar uno de esos dos números.
**De costado** — un dashboard que muestra 40 en vuelo, 1200 rps y 20 ms de latencia te está mostrando un número equivocado, porque 1200 · 0,020 es 24.`,
    },
    {
      kind: "theory",
      body: `Por debajo de la capacidad, la latencia es solo el tiempo de servicio y la cola está vacía. Pasada esa capacidad, las llegadas superan las salidas y **el backlog crece linealmente y sin límite**. A 1800 rps contra 1600, un segundo de sobrecarga deja 200 encoladas, cada una esperando 200/1600 = 125 ms encima de sus 20 ms de trabajo. La latencia no se degrada con gracia; se degrada a la tasa del excedente.

Así que fija el límite deliberadamente. Con un objetivo de 50 ms y 1600 rps de capacidad, L = 1600 · 0,050 = 80 en el sistema: 32 en servicio, 48 pueden encolarse. **Admite 80. Descarta la 81 con un 503 inmediato**, porque una request admitida más allá de ese punto no puede cumplir los 50 ms de todas formas y va a ocupar un slot mientras no los cumple.

Esto es lo que mide un load test. Sube en rampa para encontrar la capacidad (sostenido), pásate para encontrar el modo de fallo (saturación), aplícale un escalón para ver si la recuperación es ordenada (pico). Mira la latencia de los percentiles altos, no la media — la media de un sistema que se satura se mantiene respetable durante un tiempo sorprendentemente largo.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué el 100% de utilización no es el punto de operación eficiente?",
      options: [
        "Al 100% no hay holgura para absorber la varianza de las llegadas, así que cualquier ráfaga arma una cola que nunca se drena del todo y la latencia sube mientras el throughput todavía se ve bien",
        "Al 100% el scheduler pasa la mayor parte del tiempo en context switches, así que el throughput efectivo cae por debajo de la capacidad",
        "El 100% de utilización sí es eficiente — la convención del 60–70% es para dejar lugar a una réplica caída, no por latencia",
      ],
      answer: 0,
      explain: "Las llegadas no están espaciadas de manera uniforme. Con cero margen, cada ráfaga deja un residuo que el siguiente período tranquilo no tiene capacidad de sobra para procesar, y W sube mientras λ no cambia — la cola es el único término que puede moverse.",
    },
    {
      kind: "fill",
      prompt: "Convierte un objetivo de latencia en un límite de concurrencia. `concurrency` recibe segundos.",
      file: "main.rs",
      before: "let l_max = concurrency(capacity(), ",
      after: ");",
      choices: ["TARGET_MS / 1000.0", "TARGET_MS", "SERVICE_S"],
      answer: 0,
      explain: "Pasar milisegundos contra una tasa por segundo da L = 80.000 — el error de unidades que hace que Little's Law parezca equivocada. Pasar `SERVICE_S` da L = 32, que es el número de workers: la idea errónea de que el límite es el tamaño del pool y que no se permite encolar nada.",
    },
    {
      kind: "quiz",
      question: "El servicio se satura, así que la cola de requests se agranda de 100 a 10.000. ¿Qué cambia eso?",
      options: [
        "Nada sobre la capacidad: convierte un problema de disponibilidad en uno de latencia, lo que compra tiempo para una ráfaga y solo hace que la sobrecarga sostenida falle lento en vez de rápido",
        "Sube la capacidad efectiva, ya que se rechazan menos requests por segundo y los workers nunca quedan ociosos esperando que llegue una",
        "Baja el p99, porque las requests que se habrían descartado ahora se completan en vez de que el cliente las reintente",
      ],
      answer: 0,
      explain: "Una cola es un buffer, no un servidor. Contra una sobrecarga sostenida ahora cada request espera y después falla, lo que es estrictamente peor que fallar de inmediato. Un límite de concurrencia es lo que convierte el descarte en una decisión en vez de un accidente.",
    },
    {
      kind: "editor",
      intro: `### De un objetivo de latencia a un límite de admisión

1. \`capacity()\` es \`WORKERS / SERVICE_S\`. \`concurrency(lambda, w_s)\` es \`lambda * w_s\` — Little's Law, escrita una sola vez.
2. Para cada tasa ofrecida imprime L, utilización, el backlog tras un segundo de sobrecarga, la latencia resultante (\`SERVICE_S + backlog / capacity()\`) y un veredicto de \`ok\`, \`at capacity\` o \`saturated\`.
3. Imprime los workers necesarios para servir el pico con el tiempo de servicio actual.
4. Convierte \`TARGET_MS\` en un límite de concurrencia — \`L = capacity · target\` — divídelo en en-servicio y encolados, e imprime cuánto tarda la sobrecarga en llenar la cola.

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

Más allá de 1600 rps la cola es el único término que puede absorber el excedente, y lo hace linealmente.`,
    },
  ],
};
