import type { LessonStep } from "@/content/steps";

// ES · RPC Services at Scale.
//
// Overlay for ../../steps/backend-rpc-services.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendRpcServicesStepsEs: Record<string, LessonStep[]> = {
  "backend-rpc-services-1": [
    {
      kind: "theory",
      body: `Una Request JSON-RPC 2.0 son cuatro miembros: \`jsonrpc\`, \`method\`, un \`params\` opcional y un \`id\` opcional. Una Response lleva **o** \`result\` **o** \`error\` — nunca los dos, nunca ninguno.

\`\`\`json
{"jsonrpc": "2.0", "method": "sum", "params": [1, 2], "id": 3}
{"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": 3}
\`\`\`

Hay cinco códigos reservados, y particionan el espacio de fallas en el orden en que los chequeas:

| código | significado | qué aprende quien llama |
| --- | --- | --- |
| -32700 | Parse error | los bytes no eran JSON |
| -32600 | Invalid Request | parseó, pero no es un objeto Request |
| -32601 | Method not found | este endpoint no existe |
| -32602 | Invalid params | existe — reintenta con otros argumentos |
| -32603 | Internal error | no eres tú, es el servidor |

De \`-32000\` a \`-32099\` queda reservado para los errores de servidor propios de la aplicación: \`-32001 Request timeout\`, \`-32002 Server busy\` y lo que sea que documente tu contrato.`,
    },
    {
      kind: "theory",
      body: `JSON-RPC no dice **nada** sobre HTTP. El mismo envelope viaja por HTTP/1.1, HTTP/2 o un socket crudo sin cambiar, y el transporte de abajo es el que decide tu concurrencia, no el protocolo.

**HTTP/1.1 con keep-alive** da una request en vuelo por conexión. N llamadas concurrentes necesitan un pool de N conexiones, y el head-of-line blocking es por conexión — una respuesta lenta atasca solo ese socket.

**HTTP/2** multiplexa muchos streams sobre una conexión, así que un pool de 2–4 conexiones satura un backend. El precio es que un solo evento de pérdida TCP ahora atasca todos los streams que comparten esa conexión.

Dimensionar el pool es aritmética, no gusto. Un pool de 8 contra un servicio con un límite de 200 conexiones, con 30 instancias de cliente, son 240 conexiones — y las últimas 40 son una tormenta de conexiones rechazadas que parece una caída.

Dos detalles del envelope que muerden después: el \`id\` tiene que volver **byte a byte idéntico** (un id string vuelve como string), y el orden no está garantizado. El id es la única correlación que el protocolo te da.`,
    },
    {
      kind: "quiz",
      question:
        "Un cliente llama a `sbutract` — un typo de un método que el servidor no tiene. ¿Qué código, y por qué importa la distinción?",
      options: [
        "-32601 Method not found: el nombre no está registrado. -32602 es para un método que *sí* existe y cuyos argumentos no pasan el chequeo de tipos",
        "-32602 Invalid params, porque el nombre del método es en sí mismo un parámetro malo de la request",
        "-32603 Internal error, ya que el servidor no pudo completar la llamada",
      ],
      answer: 0,
      explain:
        "Confundirlos le cuesta a quien llama el único bit que separa 'este endpoint no existe' de 'reintenta con otros argumentos'. Un cliente que ve -32602 va a seguir reintentando contra un endpoint que nunca va a existir.",
    },
    {
      kind: "fill",
      prompt: "Un nombre de método que el servidor no conoce tiene su propio código.",
      file: "main.rs",
      before: "return Reply { code: ",
      after: ', message: "Method not found", id: r.id.clone() };',
      choices: ["-32601", "-32602", "-32600"],
      answer: 0,
      explain:
        "-32602 diría que los argumentos estaban mal para un método que existe; -32600 diría que el propio objeto de la request estaba malformado. Ninguna de las dos es cierta aquí — el envelope estaba bien y el nombre no estaba registrado.",
    },
    {
      kind: "quiz",
      question:
        "¿Por qué -32700 y -32600 responden con `id: null` mientras -32601, -32602 y -32603 devuelven el id que recibieron?",
      options: [
        "No puedes confiar en el id hasta tener un objeto Request válido en la mano — el cuerpo puede no haber parseado, o el miembro id puede ser del tipo equivocado",
        "Null se usa en toda respuesta de error; solo los resultados exitosos llevan id",
        "El id se devuelve solo cuando el handler corrió, así que -32601 y -32602 también mandan null",
      ],
      answer: 0,
      explain:
        "'Devuelve siempre el id que recibiste' es la idea equivocada. En un parse error puede no haber id en absoluto, y en un objeto Request inválido el miembro puede ser un objeto o un array. Una vez validada la request, los tres códigos restantes lo devuelven.",
    },
    {
      kind: "editor",
      intro: `### Clasifica una request entrante

Completa \`classify\`. Corre los cinco chequeos en orden — parse, forma de la request, método, params, handler — y responde cada uno con su código.

1. \`well_formed == false\` → \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. \`version\` distinto de \`Some("2.0")\`, o \`method\` ausente → \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. Un método que no está en \`methods\` → \`-32601\` \`"Method not found"\`, devolviendo el id.
4. \`params_ok == false\` → \`-32602\` \`"Invalid params"\`, devolviendo el id.
5. \`handler_ok == false\` → \`-32603\` \`"Internal error"\`, devolviendo el id.
6. En cualquier otro caso \`Reply { code: 0, message: "result", id }\`.

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

Dos filas responden \`null\` y cuatro devuelven el id — esa división es la lección.`,
    },
  ],

  "backend-rpc-services-2": [
    {
      kind: "theory",
      body: `El miembro \`id\` es un interruptor. Un objeto Request **sin id** es una **notification**: el servidor corre el handler y NO DEBE mandar un objeto de respuesta — ni un result, ni siquiera un error.

Eso es el contrato, no una optimización. Un cliente que mandó una notification no está leyendo a la espera de una respuesta, y escribirle una desincroniza una conexión pipelined: cada respuesta posterior se empareja con la request equivocada.

La spec es cuidadosa con una distinción que la gente aplana:

| cuerpo | significado |
| --- | --- |
| \`{"jsonrpc":"2.0","method":"log"}\` | notification — sin respuesta |
| \`{"jsonrpc":"2.0","method":"log","id":null}\` | una llamada cuyo id da la casualidad de ser null — responde con \`"id":null\` |

Un id **ausente** y un id explícitamente **null** son requests distintas.`,
    },
    {
      kind: "theory",
      body: `Un batch es un array JSON de objetos Request. El servidor PUEDE procesar los miembros en cualquier orden y de forma concurrente, y el array de respuesta contiene solo los miembros que produjeron una respuesta. Tres consecuencias rompen a los servidores ingenuos:

- Un **array vacío** no es un objeto Request. Recibe un único \`-32600\` con \`id: null\`.
- Un batch de **solo notifications** no produce **ningún cuerpo de respuesta** — no \`[]\`, nada.
- Un **miembro malformado** se responde con \`id: null\`, porque el servidor no tiene forma de saber si ese miembro iba a ser una notification.

Y la regla de orden que el lado cliente debe honrar: empareja respuestas con requests **por id**, nunca por posición. El array que recibes de vuelta es más corto que el que mandaste y puede venir en cualquier orden.`,
    },
    {
      kind: "quiz",
      question:
        "Un cliente manda un batch de cinco notifications. ¿Qué pone en el cable un servidor correcto?",
      options: [
        "Nada en absoluto — ningún cuerpo de respuesta, porque ningún miembro produjo un objeto de respuesta",
        "`[]`, un array vacío, ya que el batch era válido y simplemente no produjo resultados",
        "Cinco objetos `{\"jsonrpc\":\"2.0\",\"result\":null}`, uno por miembro",
      ],
      answer: 0,
      explain:
        "Devolver `[]` es un bug de interoperabilidad real: un cliente estricto trata un array vacío como violación del protocolo, porque la spec dice que el servidor no devuelve nada cuando no hay nada que devolver. El array de *request* vacío es el caso que recibe -32600 — no el de *respuesta* vacío.",
    },
    {
      kind: "fill",
      prompt:
        "Una notification corre su handler y después produce la cosa que nunca llega al cable.",
      file: "main.rs",
      before: "Frame::Notify { method } => {\n    effects.push(method);\n    ",
      after: "\n}",
      choices: ["None", 'Some(String::new())', 'Some("[]".to_string())'],
      answer: 0,
      explain:
        "`Some(String::new())` escribe un cuerpo de longitud cero, que sigue siendo una escritura — y `handle_batch` lo contaría como respuesta y emitiría un `[]`. `None` es lo que hace que el miembro desaparezca por completo de la respuesta del batch.",
    },
    {
      kind: "quiz",
      question:
        "Seis frames llegan a lo largo de los batches del ejercicio, pero solo salen tres cuerpos de respuesta. ¿Qué dice esa proporción sobre las notifications?",
      options: [
        "El efecto secundario sigue corriendo para cada notification — lo que se suprime es la respuesta, no el trabajo",
        "Las notifications son fire-and-forget, así que el servidor puede descartar el handler bajo carga",
        "Las tres respuestas que faltan se descartaron porque sus handlers fallaron",
      ],
      answer: 0,
      explain:
        "'Fire-and-forget significa que el servidor puede saltárselo' es la idea equivocada, y convierte una escritura durable en un no-op silencioso. El contador del ejercicio existe para hacer la distinción contable: seis invocaciones de handler, tres cuerpos.",
    },
    {
      kind: "editor",
      intro: `### Los frames que no reciben respuesta

Completa \`handle_one\` y \`handle_batch\`.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → mete el método en \`effects\`, devuelve \`None\`.
3. \`Frame::Call { method, id }\` → un método distinto de \`"add"\` es \`-32601\` devolviendo el id; si no, mete el método y devuelve el objeto de resultado con \`"result":7\`.
4. \`handle_batch\` → un slice vacío es un único \`-32600\` con id null. Si no, pasa los frames por \`filter_map\` con \`handle_one\`, devuelve \`None\` cuando nadie respondió, y si no las respuestas unidas con \`,\` entre corchetes.

Salida esperada:

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

Seis handlers, tres cuerpos.`,
    },
  ],

  "backend-rpc-services-3": [
    {
      kind: "theory",
      body: `Los handlers tienen cuerpos distintos pero deben compartir una firma, así que cada uno es un trait object:

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
struct Router { routes: HashMap<&'static str, Handler> }
\`\`\`

El Box no es ceremonia — es lo que permite que closures de tipos concretos distintos vivan en una misma colección. El costo es una indirección de puntero por llamada, contra un lookup de hash que ya está dominado por la lectura del socket.

Un \`match\` escrito a mano sobre el nombre del método compila al mismo dispatch. Lo que no puede es **extenderse en runtime**: ningún módulo registrando sus propios métodos al arrancar, ningún \`rpc.discover\`, ninguna métrica por método enumerada desde la tabla, y cada método nuevo recompila el archivo dueño del match.

Una trampa de salida determinista: el orden de iteración de \`HashMap\` no está especificado y varía por proceso. Cualquier listado de métodos tiene que ordenarse antes de imprimirse o hashearse.`,
    },
    {
      kind: "theory",
      body: `Validar en el borde es lo que \`-32602\` significa. En un servicio real, Serde hace ese trabajo:

\`\`\`rust
#[derive(Deserialize)]
struct SumParams { values: Vec<i64> }
\`\`\`

Eso convierte "el JSON no tenía la forma que mi handler asume" en una falla tipada en la frontera, antes de que corra cualquier código de negocio. Las representaciones untagged e internally-tagged de enum deciden cómo se empareja una unión de params con la forma que vino por el cable.

La división que importa:

| falla | código | culpa de quién |
| --- | --- | --- |
| aridad incorrecta, tipo incorrecto, campo ausente | -32602 | de quien llama |
| el handler corrió y explotó | -32603 | del servidor |

Y \`-32603\` nunca debe filtrar un mensaje interno. \`"Internal error"\` en el cable, el id de la request y el stack trace en los logs — un mensaje de error es un canal de exfiltración de nombres de tablas, rutas de archivos y texto de queries.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué preferir un `HashMap` de handlers en Box a un `match` sobre el string del método?",
      options: [
        "La tabla puede poblarse al arrancar desde módulos independientes y enumerarse en runtime; un `match` hace imposibles ambas cosas",
        "El `HashMap` hace dispatch en O(1) mientras que un `match` sobre strings es una cadena lineal de comparaciones",
        "Las closures en Box evitan la monomorphization que de otro modo inflaría el binario",
      ],
      answer: 0,
      explain:
        "Un `match` sobre literales de string compila a un árbol de decisión por longitud y prefijo, así que el argumento de rendimiento es casi un empate. Registrabilidad e introspección son la diferencia real, y son lo que una frontera de plugin necesita.",
    },
    {
      kind: "fill",
      prompt:
        "Haz que el listado de métodos sea idéntico en cada ejecución, cualquiera que haya sido la semilla del hash.",
      file: "main.rs",
      before:
        "let mut names: Vec<&'static str> = self.routes.keys().copied().collect();\nnames.",
      after: "();\nnames",
      choices: ["sort", "dedup", "reverse"],
      answer: 0,
      explain:
        "`dedup` solo elimina duplicados *adyacentes*, lo que sobre una entrada sin ordenar es casi un no-op, y las claves ya son únicas de todos modos. `reverse` invierte un orden que ya era arbitrario.",
    },
    {
      kind: "quiz",
      question:
        "`div` se llama con `[10, 0]`. Los params pasaron el chequeo de tipos; el handler dividió por cero. ¿Qué código?",
      options: [
        "-32603 Internal error — se entró al handler y falló",
        "-32602 Invalid params, porque los parámetros son lo que causó la falla",
        "-32600 Invalid Request, ya que la request nunca podría haber tenido éxito",
      ],
      answer: 0,
      explain:
        "La respuesta tentadora es -32602: los params sí lo causaron. Pero -32602 está reservado para el chequeo de forma y aridad que ocurre *antes* de entrar al handler. Una vez que estás dentro del handler, cada falla es tuya.",
    },
    {
      kind: "editor",
      intro: `### Un router de handlers en Box

1. \`register\` inserta el handler en Box dentro de \`self.routes\` bajo su nombre.
2. \`dispatch\` busca el método; \`None\` es \`-32601\` \`"Method not found"\`.
3. \`method_names\` recolecta las claves y las **ordena**.
4. Registra dos handlers en \`main\`:
   - \`"sum"\` → \`Ok(params.iter().sum())\`.
   - \`"div"\` → \`-32602\` cuando \`params.len() != 2\`, \`-32603\` cuando el divisor es cero, si no \`Ok(params[0] / params[1])\`.

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

Tres fallas distintas, tres códigos distintos, un lookup de tabla.`,
    },
  ],

  "backend-rpc-services-4": [
    {
      kind: "theory",
      body: `Todo el ecosistema Tower son dos traits.

\`\`\`rust
trait Service { fn call(&mut self, req: &Req) -> Resp; }
trait Layer<S> { type Svc; fn layer(&self, inner: S) -> Self::Svc; }
\`\`\`

\`Service\` es request que entra, respuesta que sale. \`Layer\` toma un service y devuelve un service. Esa es la abstracción entera — timeout, retry, límite de concurrencia, auth, tracing, load balancing son todos una struct que guarda un \`S\` interno, implementando \`Service\` al hacer algo y luego llamar a \`self.inner.call(req)\`.

El Tower real agrega \`poll_ready\` — el canal de backpressure, donde un service dice "ahora no" **antes** de que le entregues una request — más los tipos asociados Response, Error y Future. La forma es lo que construyes aquí.`,
    },
    {
      kind: "theory",
      body: `\`TimeoutLayer.layer(CountLayer.layer(Backend))\` arma una cebolla. El timeout es el más externo, así que una request fuera de presupuesto se rechaza sin que nunca se entre al backend, y el contador marca **3 de 5**. Invierte los dos y las cinco llegan al backend, con el timeout limitando solo la respuesta.

Una pila de layers es un orden total sobre preocupaciones transversales, y deberías poder defenderlo:

| decisión | arriba | abajo |
| --- | --- | --- |
| auth vs rate limit | el tráfico sin autenticar sigue consumiendo cuota | tu limiter hace criptografía para tráfico basura |
| tracing vs retry | un span por llamada lógica | un span por intento |
| timeout vs límite de concurrencia | la espera en cola cuenta contra el presupuesto | solo cuenta el tiempo de servicio |

Ninguna de esas tiene una respuesta universal. Todas tienen una respuesta para tu servicio.`,
    },
    {
      kind: "quiz",
      question:
        "El layer de timeout rechaza una request a los 100ms. ¿Qué pasó con el trabajo que el backend ya había empezado?",
      options: [
        "Corre hasta terminar — el timeout dropea la future interna, lo que libera este thread pero no la query que ya está en vuelo",
        "Se cancela y su conexión se libera en el momento en que el timeout se dispara",
        "Recibe un poll más con un flag de cancelación puesto, y se desmonta limpiamente",
      ],
      answer: 0,
      explain:
        "Por esto un timeout no protege a una base de datos de una query lenta: dropear la future devuelve el thread de quien llama, pero el trabajo del lado del servidor continúa. Acotar eso necesita un statement timeout del otro lado, no un layer de este.",
    },
    {
      kind: "fill",
      prompt: "El layer de conteo registra la llamada y luego la pasa adelante.",
      file: "main.rs",
      before: "self.calls += 1;\n",
      after: "\n",
      choices: [
        "self.inner.call(req)",
        "Resp::Ok(req.cost_ms)",
        "Backend.call(req)",
      ],
      answer: 0,
      explain:
        "La segunda responde la request por sí misma, así que nada debajo del contador llega a correr. La tercera llama a un `Backend` nuevo en vez del service que le entregaron — lo que descarta en silencio cada layer que está debajo en la pila.",
    },
    {
      kind: "quiz",
      question:
        "`CountLayer.layer(TimeoutLayer.layer(Backend))` en su lugar. ¿Qué marca el contador, y qué cambió?",
      options: [
        "5 — el contador ahora es el más externo, así que ve cada request, incluidas las dos que el timeout rechaza",
        "3 — lo mismo, ya que el timeout sigue rechazando las mismas dos requests",
        "0 — el contador ya no envuelve al backend, así que no cuenta nada",
      ],
      answer: 0,
      explain:
        "El orden determina lo que cada layer *ve*. Las mismas dos requests fallan de cualquier forma; lo que se mueve es la medición, que es exactamente por qué 'requests recibidas' y 'requests servidas' son métricas distintas y quieren posiciones distintas en la pila.",
    },
    {
      kind: "editor",
      intro: `### Service y Layer

Escribe cuatro impls.

1. \`impl<S: Service> Service for Counted<S>\` — incrementa \`self.calls\`, luego delega en \`self.inner.call(req)\`.
2. \`impl<S> Layer<S> for CountLayer\`, \`type Svc = Counted<S>\`, construyendo \`Counted { inner, calls: 0 }\`.
3. \`impl<S: Service> Service for Timeout<S>\` — cuando \`req.cost_ms > self.limit_ms\`, devuelve \`Resp::Err(-32001, "Request timeout")\` **sin** llamar al service interno.
4. \`impl<S> Layer<S> for TimeoutLayer\`, \`type Svc = Timeout<S>\`, pasando \`limit_ms\` hacia adentro.

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

Nada duerme: el costo es un dato en la request y el timeout es una comparación. La última línea es la evidencia de que el orden es una decisión de diseño.`,
    },
  ],

  "backend-rpc-services-5": [
    {
      kind: "theory",
      body: `Un límite de concurrencia es la única perilla que de verdad acota un servicio. Threads, conexiones, handles de base de datos — algo es finito, y si tú no eliges el número la máquina lo elige por ti, mal: un pool de 500 threads pasándose la vida en context switches, o un pool agotado por una dependencia lenta mientras cada otro endpoint que lo comparte se apaga.

Un layer de límite guarda una cuenta de permits. Cuando los permits se acaban tiene que elegir entre dos políticas, y esa elección es esta lección:

- **shed** — rechazar de inmediato con un código documentado del rango \`-32000..-32099\`
- **queue** — retener la request hasta que se libere un permit

Las dos fallan las mismas requests aquí. Solo una de ellas gasta el tiempo del backend para hacerlo.`,
    },
    {
      kind: "theory",
      body: `Encolar no crea capacidad. Convierte rechazo en latencia.

La Ley de Little es \`L = λW\`: con una tasa de llegada por encima de la capacidad de servicio, la longitud de la cola y la espera crecen sin límite. Una request que espera 150ms detrás de un pool lleno y luego corre 150ms quemó tiempo del backend para producir una respuesta de 300ms para un cliente cuyo deadline era 200ms — un cliente que ya reintentó, duplicando λ.

Esa es la falla metaestable que todo el mundo ha visto alguna vez. El servicio no está caído. Está al 100% de utilización, sirviendo trabajo que será descartado al llegar, y no se va a recuperar mientras los retries continúen.

Hacer shed temprano mantiene rápidas las requests admitidas y mantiene la falla legible: un \`-32002\` documentado, un \`retry_after\`, un contrato de cliente que dice reintentable-con-backoff, y una cuenta de rechazos que puedes poner en un dashboard. Backpressure es la misma idea un nivel más arriba — una cola acotada cuya llenura es una señal que viaja de vuelta al productor.`,
    },
    {
      kind: "quiz",
      question:
        "La cola frente a un servicio saturado se duplica para absorber picos. ¿Qué compra eso?",
      options: [
        "Una latencia más alta a la que las requests fallan — convierte fallas rápidas en lentas y retrasa la recuperación",
        "Más disponibilidad, ya que las requests que habrían sido rechazadas ahora tienen éxito",
        "Nada medible, porque la profundidad de la cola no afecta la tasa de servicio de ninguna manera",
      ],
      answer: 0,
      explain:
        "Una cola más grande solo ayuda con un pico corto en relación con la tasa de servicio. Contra una sobrecarga sostenida eleva la espera hasta que cada request admitida pierde su deadline — el ejercicio muestra cuentas de éxito idénticas con 320ms de trabajo condenado en el backend como única diferencia.",
    },
    {
      kind: "fill",
      prompt:
        "Antes de admitir nada, suelta los slots cuyo trabajo ya terminó.",
      file: "main.rs",
      before: "busy_until.",
      after: "(|finish| *finish > now);",
      choices: ["retain", "iter", "drain"],
      answer: 0,
      explain:
        "`iter` construye un iterador lazy y no muta nada, así que el pool se llenaría y nunca se liberaría. `drain` toma un rango, no un predicado, y vaciaría el pool entero.",
    },
    {
      kind: "quiz",
      question:
        "Un cliente argumenta que el shed es peor para él: un rechazo es una falla, mientras que una request encolada todavía podría tener éxito. ¿Cuál es la respuesta?",
      options: [
        "Un rechazo a los 0ms es una respuesta reintentable dentro de su presupuesto; un timeout a los 310ms es una falla que además consumió el servidor. No son la misma falla",
        "Tiene razón, y el arreglo es un deadline de cliente más largo para que las requests encoladas tengan tiempo de aterrizar",
        "Tiene razón para un cliente aislado, pero el shed se elige igual porque el costo del servidor pesa más que la experiencia del cliente",
      ],
      answer: 0,
      explain:
        "El deadline del propio cliente es lo que decide esto. Una request que no puede completarse dentro del presupuesto ya falló; encolarla solo esconde cuándo. El shed le devuelve el presupuesto al cliente mientras todavía puede gastarlo — en un retry, un fallback o una respuesta degradada.",
    },
    {
      kind: "editor",
      intro: `### Shed o queue

Completa \`simulate\`. Para cada llegada, en orden:

1. \`now = req.at_ms\`; haz \`retain\` solo de las entradas de \`busy_until\` que sigan \`> now\`.
2. Lleno **y** \`shed_early\` → cuenta un rechazo, imprime wait \`0\`, latency \`0\`, backend \`"no"\`, \`"-32002 Server busy"\`, continúa.
3. Si no, empieza en \`now\` si hay un slot libre, y si no en el tiempo de término **más temprano** — quita ese slot.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`, mete \`finish\`.
5. \`latency > DEADLINE_MS\` → cuenta un rechazo, suma \`req.cost_ms\` a \`doomed_ms\`, \`"-32001 Request timeout"\`; si no \`"ok"\`. Backend \`"yes"\` en ambos casos.

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

Los mismos dos éxitos, las mismas tres fallas, 320ms de tiempo de backend como lo único que encolar compró.`,
    },
  ],

  "backend-rpc-services-6": [
    {
      kind: "theory",
      body: `Un token bucket guarda hasta \`capacity\` tokens y se rellena a una tasa fija. Una request cuesta un token; una request que no puede pagar se rechaza. De ahí salen dos propiedades, y son la razón de que esta sea la forma correcta para una cuota de API:

- permite un burst de \`capacity\`, y luego se asienta exactamente en la tasa de refill
- nunca tiene borde de ventana — una ventana fija de 60/minuto deja que un cliente mande 120 requests en dos segundos a caballo de la costura

El detalle de implementación que importa: **no corras un timer de refill.** Rellena lazy al acceder, a partir de \`(now - last_seen) * rate\`, recortado en capacity.

\`\`\`rust
let earned = (now_ms - self.last_ms) * REFILL_PER_MS;
self.tokens = (self.tokens + earned).min(CAPACITY);
\`\`\`

Una línea de aritmética, ninguna tarea de fondo, dos enteros de estado por cliente. Los mili-tokens lo mantienen en enteros para que no haya deriva de punto flotante, y \`(deficit + rate - 1) / rate\` es la división con techo que convierte un faltante en un \`retry_after\` que el cliente puede honrar.`,
    },
    {
      kind: "theory",
      body: `El bucket es por **clave**, y elegir la clave *es* la política. Id de cliente, API key, tenant, IP — y limitar por IP detrás de un NAT o de una CDN aplica el rate limit a una oficina entera como si fuera un solo cliente.

Ese estado también es la razón de que una flota RPC sea solo casi stateless. Corre este limiter en proceso en 10 nodos detrás de un load balancer round-robin y un límite de 5/s se vuelve 50/s — y cambia cada vez que la flota hace autoscaling. Las opciones son las de verdad:

| enfoque | costo |
| --- | --- |
| dividir el límite por la cantidad de nodos | incorrecto en cuanto un nodo muere o se agrega |
| centralizar en Redis | un round trip de red en la ruta de la request, y una dependencia dura |
| contadores distribuidos aproximados | correctos en promedio, se pasan a propósito |

Todo lo *demás* en el servicio debería seguir siendo genuinamente stateless: sin afinidad de sesión, sin estado de usuario en memoria. Entonces cualquier nodo sirve cualquier request y un rolling deploy no es una migration de datos.`,
    },
    {
      kind: "quiz",
      question:
        "¿Por qué rellenar lazy al acceder en vez de hacer tick de cada bucket desde una tarea de fondo?",
      options: [
        "Un ticker es trabajo O(clientes) por tick para buckets que nadie está usando; el refill lazy es O(1) por request y aritméticamente idéntico",
        "Una tarea de fondo no puede mutar el mapa de buckets de forma segura sin un lock, y el refill lazy evita el lock",
        "El refill lazy es más preciso, porque un ticker cuantiza los tokens al intervalo del tick",
      ],
      answer: 0,
      explain:
        "El argumento del lock es real pero secundario — necesitas uno de cualquier forma. El argumento de precisión es falso: un ticker a 1ms también es exacto, solo que gasta CPU proporcional a la cantidad de claves ociosas para serlo.",
    },
    {
      kind: "fill",
      prompt: "Acredita el tiempo transcurrido, pero nunca por encima de lo que el bucket puede guardar.",
      file: "main.rs",
      before: "self.tokens = (self.tokens + earned).",
      after: "(CAPACITY);",
      choices: ["min", "max", "rem_euclid"],
      answer: 0,
      explain:
        "`max` pondría un piso al bucket en capacity, así que un cliente ocioso un segundo tendría presupuesto infinito. Sin el recorte del todo, un cliente ocioso una hora llega con 18.000 tokens y el límite de burst no significa nada.",
    },
    {
      kind: "quiz",
      question:
        "El limiter corre en proceso, guarda solo dos enteros por cliente, y el servicio se describe como horizontalmente escalable. ¿Qué tiene de malo esa descripción?",
      options: [
        "Los buckets por nodo multiplican el límite configurado por la cantidad de nodos y derivan con el autoscaling — el límite en tu doc de API no es el límite que aplicas",
        "Nada — limitar por nodo es exacto mientras el load balancer sea round-robin",
        "El estado del bucket vuelve stateful a los nodos, así que un rolling deploy va a tirar requests en vuelo",
      ],
      answer: 0,
      explain:
        "Que un rolling deploy pierda el estado de los buckets es inofensivo — los clientes vuelven con buckets llenos, lo que se equivoca a favor del cliente. La multiplicación es el bug: 10 nodos aplicando 5/s cada uno son 50/s, y 30 nodos son 150/s, en silencio, el día en que escalas.",
    },
    {
      kind: "editor",
      intro: `### Un token bucket por cliente

1. \`Bucket::new\` arranca un cliente lleno: \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\` acredita \`(now_ms - self.last_ms) * REFILL_PER_MS\`, recorta en \`CAPACITY\`, guarda \`last_ms\`.
3. \`take\` resta \`COST\` y devuelve \`Ok(self.tokens)\` cuando hay suficiente; si no devuelve \`Err\` con \`(deficit + REFILL_PER_MS - 1) / REFILL_PER_MS\` — los milisegundos hasta que exista un token entero. Una negativa no gasta nada.

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

Un burst de cinco, luego exactamente la tasa de refill. En t=1500 alice está en capacity, no por encima.`,
    },
  ],

  "backend-rpc-services-7": [
    {
      kind: "theory",
      body: `\`offset=3&limit=3\` significa "cuenta tres filas desde el inicio de la colección **tal como existe ahora mismo**". Esa es una promesa que no puedes cumplir a lo largo de más de una request.

Borra una fila entre la página 1 y la página 2 y cada fila después de ella baja una posición. La página 2 empieza una fila tarde, y una fila que el cliente nunca vio se salta **para siempre** — sin error, sin hueco en la salida, nada sobre lo que alertar. Un insert produce el bug espejo: un duplicado.

Un cursor es un token opaco que codifica la posición de la última fila en un orden total estable:

\`\`\`sql
SELECT * FROM rows WHERE id > $cursor ORDER BY id LIMIT 3
\`\`\`

La página siguiente se define por contenido, no por una cuenta, así que las ediciones antes del cursor no pueden desplazarlo. Dos detalles del contrato: ordena por algo **único** — \`created_at\` solo pierde filas que comparten timestamp, así que la clave es \`(created_at, id)\` — y mantén el token opaco (la tupla en base64) para poder cambiar lo que tiene adentro sin romper clientes.

La terminación es parte del contrato: \`next_cursor\` está **ausente** en la última página. Eso, y no una página vacía, es cómo un cliente sabe que terminó.

El argumento de costo a favor de los cursores — que \`OFFSET\` es O(offset + limit) y un keyset seek es O(log n + limit) a cualquier profundidad — es el tema de *La capa de datos*, lección 4. Esta lección va de la otra mitad: qué le prometen los dos contratos a un cliente cuya colección está cambiando debajo de él.`,
    },
    {
      kind: "theory",
      body: `El resto del contrato, en tres partes.

**Versionado.** Los cambios aditivos — un campo opcional nuevo, un método nuevo — no necesitan versión. Un campo eliminado o un tipo cambiado sí. El mecanismo más barato en JSON-RPC es el propio nombre del método: \`user.get\` y \`user.get.v2\`, que versiona por endpoint en vez de congelar toda la API en su consumidor más lento. Depreca con una fecha publicada y métricas de uso por cliente, no con una esperanza.

**Request IDs.** Genera uno en el borde si el cliente no mandó ninguno, devuélvelo en cada respuesta, y ponlo en cada línea de log y en cada llamada downstream. Es lo único que te deja reconstruir el camino de una request a través de una flota, y cuesta un header.

**Schemas de error.** El miembro \`data\` de un error JSON-RPC es donde va el detalle legible por máquina — qué campo falló, \`retryable: true\`, un \`retry_after_ms\`. Debería ser tan estable como tus tipos de éxito, porque los clientes ramifican sobre él.`,
    },
    {
      kind: "quiz",
      question:
        "Un ingeniero defiende la paginación por OFFSET: el orden es determinista, así que las páginas son deterministas. ¿Qué está mal?",
      options: [
        "El determinismo del orden no es el problema — lo es la colección mutando bajo un recorrido de varias requests, y un delete antes del offset salta una fila en silencio",
        "El orden no es determinista, porque los empates en la clave de orden los ordena arbitrariamente el planner",
        "Nada está mal mientras la query corra dentro de una única transacción repeatable-read",
      ],
      answer: 0,
      explain:
        "El desempate es un bug real y aparte, y una transacción con snapshot de larga vida sí arregla la corrección, al costo de mantener una vista de lectura abierta durante el tiempo de reflexión del cliente. Ninguno de los dos es el argumento: el recorrido por offset está mal incluso con un orden único perfecto, porque la cuenta en la que se basa cambió.",
    },
    {
      kind: "fill",
      prompt:
        "El siguiente cursor es la posición de la última fila que esta página entregó.",
      file: "main.rs",
      before: "let next = if page.len() == limit { page.",
      after: "().copied() } else { None };",
      choices: ["last", "first", "iter().next"],
      answer: 0,
      explain:
        "`first` (e `iter().next`) devuelve un cursor por el que el cliente ya pasó, así que la página siguiente vuelve a entregar todo lo posterior a la fila uno — un loop infinito que parece estar avanzando.",
    },
    {
      kind: "quiz",
      question:
        "Un cliente pagina hasta recibir una página vacía. ¿Qué se rompe?",
      options: [
        "Hace un round trip desperdiciado en cada recorrido, y se rompe en cuanto una página viene corta por cualquier otra razón — un contrato correcto señala la terminación con un next_cursor ausente",
        "Nada — una página vacía es la señal estándar de terminación en la paginación por cursor",
        "Cuenta dos veces la última página, porque la respuesta vacía todavía lleva un cursor",
      ],
      answer: 0,
      explain:
        "Las páginas vienen cortas por razones que no son el final: un filtro aplicado después del limit, una fila que quien llama no está autorizado a ver, un registro con soft delete. Un cliente que trata corta-pero-no-vacía como 'sigue' está bien; uno que la trata como el final, no — por eso el cursor, y no la longitud de la página, es la señal.",
    },
    {
      kind: "editor",
      intro: `### Demuestra que OFFSET pierde una fila

1. \`page_by_offset\` → \`skip(offset).take(limit)\`, contando desde el inicio de la tabla que le entreguen.
2. \`page_by_cursor\` → ids estrictamente mayores que el cursor (todos cuando \`after\` es \`None\`), \`take(limit)\`, devolviendo la página más su siguiente cursor: el **último** id de la página cuando \`page.len() == limit\`, y \`None\` cuando la página vino corta.
3. \`missed\` → las filas sobrevivientes que nunca aparecieron en ninguna página.

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

La fila 4 sigue en la tabla y no apareció en ninguna página. Ese es el bug, con nombre.`,
    },
  ],
};
