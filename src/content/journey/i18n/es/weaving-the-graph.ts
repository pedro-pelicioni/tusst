import type { Concept } from "../types";

export const weavingTheGraph: Concept = {
  meta: {
    slug: "weaving-the-graph",
    title: "Tejiendo el Grafo",
    tagline: "Ingeniería de grafos: muchos pequeños gólems, un plan tejido.",
    numeral: "VIII",
    arc: "craft",
    level: 2,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/weaving-the-graph.webp",
    glyph: "🕸️",
  },
  steps: [
    {
      kind: "theory",
      body: `## Cuando un bucle no basta

Algunas misiones sobrepasan la capacidad de una sola mente: *auditar este contrato, arreglar lo que encuentres, actualizar la documentación, preparar la migración.* Meter todo en un único contexto diluye la calidad en cada paso — el capítulo anterior te explicó por qué.

El movimiento es ancestral: **descomponer**. Construye un **grafo** de pasos:

- **Nodos** — tareas pequeñas y enfocadas, cada una con su *propio banco curado*.
- **Aristas** — lo que fluye entre ellos: una especificación, un diff, un informe.

Lo has hecho con código toda tu vida — funciones pequeñas, responsabilidades únicas, entradas y salidas explícitas. Ahora hazlo con el trabajo mismo.`,
    },
    {
      kind: "theory",
      body: `## Fan out, fan in

La independencia es la palabra favorita del planificador.

**Fan-out**: ¿tres SDKs candidatos para evaluar? Tres nodos, en paralelo — cada uno en su propio banco, sin necesitar a los demás, sin que el contexto se mezcle entre ellos.

**Fan-in**: un nodo de *síntesis* recibe los tres informes, los pondera según tus criterios y recomienda.

La disciplina consiste en detectar la *verdadera* independencia: el trabajo paralelo no debe compartir **ningún estado** — nodos que compiten por editar el mismo archivo no forman un grafo, son una pelea. Es pensar en dependencias, como ya lo haces con pipelines de datos, ahora aplicado a las mentes.`,
    },
    {
      kind: "diagram",
      body: "Un plan, tres trabajadores, un veredicto:",
      caption: "Cada trabajador empieza limpio. Ese aislamiento es el punto: un mal paso en uno nunca envenena a los otros.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "plan",
            label: "PLAN",
            x: 50,
            y: 12,
            tone: "accent",
            shape: "box",
            note: "Divide el trabajo en piezas que no necesitan hablar entre sí.",
          },
          {
            id: "a",
            label: "A",
            x: 18,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Contexto propio, presupuesto propio. Nunca ve los errores de B.",
          },
          {
            id: "b",
            label: "B",
            x: 50,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Corre a la vez, con el mismo encargo, sobre otra pieza.",
          },
          {
            id: "c",
            label: "C",
            x: 82,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Tres intentos baratos valen más que uno caro que no puedes comprobar.",
          },
          {
            id: "judge",
            label: "JUEZ",
            x: 50,
            y: 56,
            tone: "gold",
            shape: "box",
            note: "Lee los tres y decide. De aquí sale realmente la calidad.",
          },
        ],
        edges: [
          {
            from: "plan",
            to: "a",
            style: "solid",
          },
          {
            from: "plan",
            to: "b",
            style: "solid",
          },
          {
            from: "plan",
            to: "c",
            style: "solid",
          },
          {
            from: "a",
            to: "judge",
            style: "dashed",
          },
          {
            from: "b",
            to: "judge",
            style: "dashed",
          },
          {
            from: "c",
            to: "judge",
            style: "dashed",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `¿Qué conjunto de subtareas es seguro ejecutar en paralelo?`,
      options: [
        "Evaluar tres bibliotecas candidatas contra la misma lista de verificación — trabajo independiente, sin estado compartido",
        "Escribir un script de migración y ejecutar ese mismo script — superponiéndolos se ahorra tiempo",
        "Tres gólems editando el mismo módulo a la vez, para terminarlo tres veces más rápido",
      ],
      answer: 0,
      explain: `Ejecutar antes de escribir viola una dependencia, y la edición simultánea del mismo archivo genera conflictos de fusión y pasos extra. La prueba es sencilla y fiable: si el nodo A no lee la salida del nodo B ni toca su estado, pueden ejecutarse juntos.`,
    },
    {
      kind: "theory",
      body: `## El forjador y el refutador

El capítulo del arnés te advirtió: la auto‑revisión comparte los puntos ciegos del yo. Un grafo lo corrige *estructuralmente*.

Añade un **nodo verificador**: un gólem forja; un nodo *diferente* — contexto fresco, sin apego a las decisiones ya tomadas — recibe la orden de **refutar**: encontrar dónde el diff viola la especificación, buscar casos límite, intentar romperlo.

La descripción del trabajo importa. “Revisa esto” invita a un asentimiento. *“Encuentra qué está mal en esto”* dirige la mente a los agujeros. Los pares adversariales capturan lo que la auto‑revisión estructuralmente no puede — por eso los forjadores reales emparejan a un creador con un inspector.`,
    },
    {
      kind: "fill",
      prompt: `Da al segundo gólem su verdadero trabajo:`,
      file: "graph.toml",
      before: `verifier.goal = "`,
      after: ` el diff del nodo forjador"`,
      choices: ["refutar", "aprobar", "resumir", "reescribir"],
      answer: 0,
      explain: `Un verificador que se le indique aprobar encontrará una forma de aprobar. “Summarize” produce prosa, no escrutinio; “rewrite” simplemente crea otro forjador con sus propios puntos ciegos. La refutación es el único objetivo que dirige al nodo a los agujeros.`,
    },
    {
      kind: "theory",
      body: `## Orquestación vs. autonomía

Separa claramente los dos trabajos del grafo:

- **Las aristas son determinísticas.** Código simple decide qué se ejecuta cuándo, qué fluye dónde, cómo es un reintento — flujo de control que puedes leer, probar y reproducir.
- **El juicio vive dentro de los nodos.** Dentro de su caja, el modelo aporta todo su arte a su única tarea.

Desdibujar la separación — dejar que el modelo improvise el siguiente paso — hace que los fallos dejen de ser reproducibles: cada ejecución es una nueva aventura por un grafo diferente. Mantén la estructura aburrida y las mentes contenidas: **fiabilidad del esqueleto, inteligencia de los órganos.**`,
    },
    {
      kind: "quiz",
      question: `En un grafo bien construido, ¿dónde reside el juicio del modelo?`,
      options: [
        "Dentro de los nodos — mientras las aristas entre ellos siguen siendo código determinístico que puedes probar y reproducir",
        "En las aristas — dejar que el modelo improvise qué nodo se ejecuta después mantiene el sistema flexible",
        "En ninguna parte — una pipeline seria es determinista de extremo a extremo, o no es ingeniería",
      ],
      answer: 0,
      explain: `El flujo de control improvisado genera fallos no reproducibles — no puedes depurar una ruta que nunca ocurre de la misma forma. Y una pipeline sin juicio en ningún lado no necesitaría gólems. Esqueleto determinista, órganos que juzgan: cada tipo de fiabilidad donde corresponde.`,
    },
    {
      kind: "theory",
      body: `## Mamparos para el razonamiento

El regalo más silencioso del grafo es la **contención**.

En un único prompt gigante, una confusión en el paso dos envenena todo lo que sigue — mismo contexto, sin mamparos, el error se acumula educadamente hasta el final.

En un grafo, un nodo fallido **falla solo**. Su contexto queda en cuarentena; sus propias evaluaciones capturan el fallo en *su* frontera — la brújula del capítulo anterior, ahora publicada por nodo; el orquestador lo reintenta o lo rodea. Esto es lo que las herramientas de pipelines y multi‑agentes existen para ofrecerte: pasos nombrados, handoffs tipados, reintentos — y es la lección del radio de explosión del bastión, una capa más arriba.`,
    },
    {
      kind: "quiz",
      question: `La tarea: renombrar una función y sus llamadas en un solo archivo. ¿Qué eliges?`,
      options: [
        "Un bucle simple — o simplemente tu editor; el coste de coordinación de un grafo superaría la tarea",
        "Un grafo — más gólems significa más calidad, tanto en tareas pequeñas como grandes",
        "Un grafo — las tareas pequeñas son exactamente el lugar para practicar para las grandes",
      ],
      answer: 0,
      explain: `Cada nodo implica una configuración: contexto que curar, aristas que definir, fallos que encaminar. En una tarea pequeña, el andamiaje supera al trabajo — una consejo de guerra convocado para aplastar una mosca. Tarea simple, bucle simple; el grafo solo vale la pena cuando la descomposición lo justifica.`,
    },
    {
      kind: "theory",
      body: `## El oficio, ensamblado

Mira lo que llevas ahora en el cinturón: **especificaciones** que dicen qué es correcto; **pruebas** que lo verifican siempre; **límites** que mantienen las palabras honestas; una **fortaleza** que contiene el cambio; un **arnés** que contiene al gólem; **palabras** que moldean lo que ve; **bucles** que le permiten autocorregirse; y un **grafo** que teje muchas mentes en un solo plan.

Ninguno de estos lo hará la IA por ti. Todos ellos hacen que la IA valga diez veces su propio esfuerzo.

Lo siguiente en el camino: volver al reino — llevar el oficio al Forge y gastarlo en la red real.`,
    },
  ],
};
