// ES · editor instructions — RPC Services at Scale.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-rpc-services.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendRpcServicesInstructionsEs: Record<string, { instructions: string }> = {
  "backend-rpc-services-1": {
    instructions: `## Clasifica una request entrante

Una Request JSON-RPC 2.0 es \`{"jsonrpc": "2.0", "method": ..., "params": ..., "id": ...}\`. Una Response lleva **o** \`result\` **o** \`error\`, nunca los dos. Hay cinco códigos reservados:

| código | significado | cuándo |
| --- | --- | --- |
| -32700 | Parse error | los bytes no son JSON |
| -32600 | Invalid Request | parseó, pero no es un objeto Request |
| -32601 | Method not found | el nombre no está registrado |
| -32602 | Invalid params | el método existe, los argumentos no pasan el chequeo de tipos |
| -32603 | Internal error | el handler corrió y falló |

De \`-32000\` a \`-32099\` queda reservado para tus propios errores de servidor.

La regla del id es la que atrapa a la gente: devuelve el id **byte a byte idéntico** una vez que tienes un objeto Request válido, y manda \`id: null\` cuando no — un parse error puede no haber producido id alguno, y una request con forma incorrecta puede tener un id del tipo equivocado.

### Tu tarea

Completa \`classify\`. Corre los cinco chequeos en orden — parse, forma de la request, método, params, handler — y responde cada uno con su código.

1. \`well_formed == false\` es \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. Un \`version\` que no sea \`Some("2.0")\`, o un \`method\` ausente, es \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. Un método que no está en \`methods\` es \`-32601\` \`"Method not found"\`, devolviendo el id.
4. \`params_ok == false\` es \`-32602\` \`"Invalid params"\`, devolviendo el id.
5. \`handler_ok == false\` es \`-32603\` \`"Internal error"\`, devolviendo el id.
6. En cualquier otro caso \`Reply { code: 0, message: "result", id }\` — \`main\` imprime el código \`0\` como \`-\`.

Salida esperada:

\`\`\`text
request                   code  message           id
truncated body          -32700  Parse error       null
jsonrpc 1.0             -32600  Invalid Request   null
no method member        -32600  Invalid Request   null
method sbutract         -32601  Method not found  3
sum of strings          -32602  Invalid params    "a3"
sum, handler panicked   -32603  Internal error    5
sum, healthy                 -  result            6
\`\`\`

### Pistas

- \`Id\` es \`Clone\`, así que \`r.id.clone()\` lo devuelve.
- \`methods.contains(&r.method.unwrap())\` — el \`unwrap\` es seguro porque el chequeo 2 ya rechazó un método ausente.
- Los \`return\` tempranos mantienen visible el orden de los chequeos; ese orden *es* la clasificación.
`,
  },

  "backend-rpc-services-2": {
    instructions: `## Los dos frames que no reciben respuesta

El miembro id es un interruptor. Una Request **sin id** es una **notification**: el servidor corre el handler y NO DEBE mandar un objeto de respuesta, ni siquiera un error. Un id \`null\` explícito es otra cosa — esa es una llamada cuyo id da la casualidad de ser null.

Un batch es un array JSON de objetos Request, y tres de sus reglas rompen a los servidores ingenuos:

- Un **array vacío** no es un objeto Request, así que recibe un único \`-32600\` con \`id: null\`.
- Un batch de **solo notifications** no produce **ningún cuerpo de respuesta** — no \`[]\`.
- Un **miembro malformado** se responde con \`id: null\`, porque el servidor no tiene forma de saber si ese miembro iba a ser una notification.

El orden tampoco está garantizado: el cliente empareja respuestas con requests por id, nunca por posición.

### Tu tarea

Completa \`handle_one\` y \`handle_batch\`.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → mete el método en \`effects\` y devuelve \`None\`. El efecto secundario sigue corriendo; solo se suprime la respuesta.
3. \`Frame::Call { method, id }\` → un método distinto de \`"add"\` es \`Some(error_obj(-32601, "Method not found", &id.to_string()))\`; si no, mete el método y devuelve \`Some(format!("{{\\"jsonrpc\\":\\"2.0\\",\\"result\\":7,\\"id\\":{}}}", id))\`.
4. \`handle_batch\`: un slice vacío es un único \`-32600\` con id null. Si no, pasa los frames por \`filter_map\` con \`handle_one\`, y devuelve \`None\` cuando nadie respondió, y si no las respuestas unidas con \`,\` dentro de \`[\` \`]\`.

Salida esperada:

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

### Pistas

- \`filter_map(|f| handle_one(f, effects))\` descarta exactamente los miembros que devolvieron \`None\`.
- \`replies.join(",")\` arma el cuerpo del array.
- Seis invocaciones de handler contra tres cuerpos de respuesta es todo el punto: \`effects.len()\` cuenta trabajo hecho, no respuestas enviadas.
`,
  },

  "backend-rpc-services-3": {
    instructions: `## Un router de handlers en Box

Los handlers tienen cuerpos distintos y deben compartir una firma, así que cada uno es un trait object:

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
\`\`\`

El Box es lo que permite que closures de tipos concretos distintos vivan en un mismo \`HashMap\`. El costo es una indirección de puntero por llamada, contra un lookup de hash que ya queda enano al lado de la lectura del socket. Un \`match\` escrito a mano sobre el nombre del método hace dispatch igual de rápido, pero no puede ser extendido al arrancar por un módulo independiente, ni enumerado en runtime.

Separar las tres fallas es la otra mitad del trabajo. \`-32601\` es un nombre que la tabla no tiene. \`-32602\` es el chequeo de forma y aridad que ocurre **antes** de entrar al handler. \`-32603\` es un handler que llegó a trabajo real y falló — y nunca debe filtrar un mensaje interno al cable.

### Tu tarea

1. \`register\` inserta el handler en Box dentro de \`self.routes\` bajo su nombre.
2. \`dispatch\` busca el método. \`Some(handler)\` lo llama; \`None\` es \`Err(RpcError { code: -32601, message: "Method not found" })\`.
3. \`method_names\` recolecta las claves y las **ordena** — el orden de iteración de \`HashMap\` no está especificado y varía por proceso.
4. En \`main\`, registra dos handlers:
   - \`"sum"\` devuelve \`Ok(params.iter().sum())\`.
   - \`"div"\` devuelve \`-32602\` \`"Invalid params"\` cuando \`params.len() != 2\`, \`-32603\` \`"Internal error"\` cuando el divisor es cero, y si no \`Ok(params[0] / params[1])\`.

Salida esperada:

\`\`\`text
methods: ["div", "sum"]
method     params     outcome
sum        [1, 2, 3]  result 6
div        [10, 2]    result 5
div        [10, 0]    -32603 Internal error
div        [10]       -32602 Invalid params
multiply   [3, 4]     -32601 Method not found
\`\`\`

### Pistas

- \`Box::new(|params: &[i64]| ...)\` — la closure necesita el tipo de su parámetro anotado para coercionar a \`Handler\`.
- \`self.routes.keys().copied().collect()\` te da un \`Vec<&'static str>\` que puedes ordenar.
- Dividir por cero es \`-32603\`, no \`-32602\`: los params pasaron el chequeo de tipos, y después el handler falló.
`,
  },

  "backend-rpc-services-4": {
    instructions: `## Service y Layer

Todo el ecosistema Tower son dos traits. \`Service\` es un método — request que entra, respuesta que sale. \`Layer<S>\` es un método — toma un service, devuelve un service. Cada middleware que has usado es una struct que guarda un \`S\` interno y que implementa \`Service\` haciendo algo y luego llamando a \`self.inner.call(req)\`.

El Tower real agrega \`poll_ready\` (el canal de backpressure: un service dice "ahora no" *antes* de que le entregues una request) y los tipos asociados Response/Error/Future. La forma es lo que construyes aquí.

El orden de composición es la decisión que mide el ejercicio. \`TimeoutLayer.layer(CountLayer.layer(Backend))\` pone el timeout más afuera, así que una request fuera de presupuesto se rechaza sin que nunca se entre al backend — y el contador marca 3 de 5.

### Tu tarea

Escribe cuatro impls.

1. \`impl<S: Service> Service for Counted<S>\` — incrementa \`self.calls\`, luego delega en \`self.inner.call(req)\`.
2. \`impl<S> Layer<S> for CountLayer\` con \`type Svc = Counted<S>\`, construyendo \`Counted { inner, calls: 0 }\`.
3. \`impl<S: Service> Service for Timeout<S>\` — si \`req.cost_ms > self.limit_ms\`, devuelve \`Resp::Err(-32001, "Request timeout")\` **sin** llamar al service interno; si no, delega.
4. \`impl<S> Layer<S> for TimeoutLayer\` con \`type Svc = Timeout<S>\`, pasando \`limit_ms\` hacia adentro.

Salida esperada:

\`\`\`text
method      cost_ms  outcome
ping              5  ok in 5ms
report          250  -32001 Request timeout
sum              90  ok in 90ms
export          400  -32001 Request timeout
ping             12  ok in 12ms
requests: 5, reached the backend: 3
\`\`\`

### Pistas

- \`stack.inner\` es el \`Counted\`, porque el timeout es el layer externo — eso es lo que hace que el conteo se pueda leer al final.
- Nada duerme. El costo es un dato en la request; el timeout es una comparación.
- Invierte los dos layers y cada request llegaría al backend. El contador es la evidencia de que el orden es una decisión de diseño.
`,
  },

  "backend-rpc-services-5": {
    instructions: `## Shed o queue

Un límite de concurrencia es la única perilla que acota un servicio. Threads, conexiones, handles de base de datos: algo es finito, y si tú no eliges el número la máquina lo elige por ti, mal. Cuando los permits se acaban, el limiter tiene exactamente dos opciones, y esta simulación corre ambas contra tráfico idéntico.

La Ley de Little dice \`L = λW\`: con una tasa de llegada por encima de la capacidad de servicio, la longitud de la cola y la espera crecen sin límite. Una request que espera 150ms detrás de un pool lleno y luego corre 150ms quemó tiempo del backend para producir una respuesta de 300ms para un cliente cuyo deadline era 200ms — un cliente que ya reintentó, duplicando λ. Esa es la falla metaestable: el servicio no está caído, está gastando toda su capacidad en trabajo que va a ser tirado a la basura.

### Tu tarea

Completa \`simulate\`. Para cada llegada, en orden:

1. Pon \`now = req.at_ms\` y haz \`retain\` solo de las entradas de \`busy_until\` que sigan \`> now\`.
2. Si \`busy_until.len() == CAPACITY\` y \`shed_early\`, cuenta un rechazo e imprime la fila con wait \`0\`, latency \`0\`, backend \`"no"\`, outcome \`"-32002 Server busy"\`, y sigue con la siguiente.
3. Si no, elige un tiempo de inicio: \`now\` si hay un slot libre, y si no el tiempo de término **más temprano** en \`busy_until\` — quita ese slot y empieza ahí.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`; mete \`finish\`.
5. Un \`latency > DEADLINE_MS\` cuenta un rechazo, suma \`req.cost_ms\` a \`doomed_ms\` y se lee \`"-32001 Request timeout"\`; si no \`"ok"\`. Imprime la fila con backend \`"yes"\`.

Salida esperada:

\`\`\`text
policy: shed early
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0      0        0        no  -32002 Server busy
  4       0      0        0        no  -32002 Server busy
  5      10      0        0        no  -32002 Server busy
failed: 3, backend-ms spent on doomed work: 0

policy: queue everything
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0    150      300       yes  -32001 Request timeout
  4       0    150      300       yes  -32001 Request timeout
  5      10    290      310       yes  -32001 Request timeout
failed: 3, backend-ms spent on doomed work: 320
\`\`\`

### Pistas

- \`busy_until.iter().min()\` encuentra el slot que se libera antes; \`position\` después lo ubica para el \`remove\`.
- La columna wait es \`start - now\`.
- Lee los dos totales uno contra el otro: las mismas tres fallas de cualquier forma, y 320ms de tiempo de backend como lo único que encolar compró.
`,
  },

  "backend-rpc-services-6": {
    instructions: `## Un token bucket por cliente

Un bucket guarda hasta \`capacity\` tokens y se rellena a una tasa fija; una request cuesta un token y una request que no puede pagar se rechaza. De ahí salen dos propiedades: el bucket permite un burst de \`capacity\` y luego se asienta exactamente en la tasa de refill. Una ventana fija de 60/minuto deja que un cliente mande 120 requests a caballo del borde de la ventana; un bucket nunca.

**No** corras un timer de refill. Rellena lazy al acceder a partir de \`(now - last_seen) * rate\`, recortado en capacity: una línea de aritmética, ninguna tarea de fondo, dos enteros de estado por cliente. Todo aquí está en mili-tokens para que la aritmética entera se mantenga exacta, y \`(deficit + rate - 1) / rate\` es la división con techo que convierte un faltante en un \`retry_after\` que el cliente puede honrar.

### Tu tarea

1. \`Bucket::new\` arranca un cliente lleno: \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\` acredita \`(now_ms - self.last_ms) * REFILL_PER_MS\`, recorta con \`.min(CAPACITY)\` y guarda \`last_ms = now_ms\`.
3. \`take\` devuelve \`Ok(self.tokens)\` después de restar \`COST\` cuando hay tokens suficientes. Si no, calcula \`deficit = COST - self.tokens\` y devuelve \`Err((deficit + REFILL_PER_MS - 1) / REFILL_PER_MS)\` — los milisegundos hasta que exista un token entero. Una negativa no gasta nada.

Salida esperada:

\`\`\`text
  t_ms client   before   after  outcome
     0 alice     5.000   4.000  allowed
     0 alice     4.000   3.000  allowed
     0 alice     3.000   2.000  allowed
     0 alice     2.000   1.000  allowed
     0 alice     1.000   0.000  allowed
     0 alice     0.000   0.000  -32005 Rate limit exceeded, retry_after_ms=200
   200 alice     1.000   0.000  allowed
   250 alice     0.250   0.250  -32005 Rate limit exceeded, retry_after_ms=150
   250 bob       5.000   4.000  allowed
  1500 alice     5.000   4.000  allowed
final alice: 4.000 tokens
final bob: 4.000 tokens
\`\`\`

### Pistas

- \`BTreeMap\` mantiene el listado final en un orden fijo; un \`HashMap\` no lo haría.
- \`bob\` llega en t=250 con el bucket lleno — el estado es por clave, y elegir la clave es la política.
- En t=1500 alice vuelve a estar en capacity: 1250ms de crédito recortados a 5 tokens, no 6,25.
`,
  },

  "backend-rpc-services-7": {
    instructions: `## Demuestra que OFFSET pierde una fila

\`offset=3&limit=3\` significa "cuenta tres filas desde el inicio de la colección **tal como existe ahora mismo**". Entre la página 1 y la página 2 la colección cambia — se borra una fila y todo lo que viene después baja una posición, así que la página 2 empieza una fila tarde y una fila que el cliente nunca vio se salta para siempre. Un insert produce el bug espejo: un duplicado.

Un cursor codifica la posición de la última fila en un orden total estable (\`WHERE id > $cursor ORDER BY id LIMIT n\`), así que la página siguiente se define por contenido y no por una cuenta, y las ediciones antes del cursor no pueden desplazarlo. Dos detalles del contrato: ordena por algo único — \`created_at\` solo pierde filas que comparten timestamp, así que la clave es \`(created_at, id)\` — y haz el token opaco para poder cambiar lo que tiene adentro sin romper clientes.

La terminación también es parte del contrato. El siguiente cursor está **ausente** en la última página; eso, y no una página vacía, es cómo un cliente sabe que terminó.

### Tu tarea

1. \`page_by_offset\` devuelve \`ids.iter().skip(offset).take(limit)\` recolectado — contando desde el inicio de la tabla que le entreguen.
2. \`page_by_cursor\` conserva los ids estrictamente mayores que el cursor (todos cuando \`after\` es \`None\`), toma \`limit\`, y devuelve la página con su siguiente cursor: el **último** id de la página cuando \`page.len() == limit\`, y \`None\` cuando la página vino corta.
3. \`missed\` devuelve las filas sobrevivientes que nunca aparecieron en ninguna página.

\`main\` borra la fila 2 entre la página 1 y la página 2 para ambos clientes.

Salida esperada:

\`\`\`text
api=v1  page_size=3  row 2 is deleted between page 1 and page 2
client     req_id   argument     page
offset     a-1      offset=0     [1, 2, 3]
offset     a-2      offset=3     [5, 6, 7]
offset     a-3      offset=6     [8, 9]
cursor     b-1      after=start  [1, 2, 3]
cursor     b-2      after=3      [4, 5, 6]
cursor     b-3      after=6      [7, 8, 9]
rows still in the table: [1, 3, 4, 5, 6, 7, 8, 9]
offset client never saw: [4]
cursor client never saw: []
\`\`\`

### Pistas

- \`page.last().copied()\` te da un \`Option<u64>\` directo desde un \`Vec<u64>\`.
- La fila 4 es la que el cliente por offset pierde — sigue en la tabla y no apareció en ninguna página.
- La columna \`req_id\` es la otra mitad del contrato: genera uno en el borde, devuélvelo en cada respuesta, y ponlo en cada línea de log y en cada llamada downstream.
`,
  },
};
