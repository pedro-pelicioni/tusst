import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Tejiendo el Grafo",
  tagline: "Graph engineering: muchos golems pequeños, cada uno en su banco, un plan tejido.",
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
    { kind: "widget", component: "fan-out",
      body: `Cuatro tareas, dos etapas cada una, tres formas de planificarlas. **Cambia las duraciones** y mira qué dos planificaciones dejan de ser la misma cosa.` },
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
    { kind: "quiz",
      question: `Cinco nodos producen cada uno un hallazgo, y cada hallazgo necesita luego verificarse. ¿Cuándo está bien esperar a **los cinco** hallazgos antes de empezar **cualquier** verificación?`,
      options: [
        "Solo cuando el paso de verificación necesita de verdad el conjunto entero a la vez — para deduplicar entre hallazgos, digamos, o para saltárselo todo si el recuento es cero",
        "Siempre — una frontera limpia entre etapas hace el pipeline más fácil de razonar",
        "Nunca — esperar siempre es tiempo desperdiciado en un sistema paralelo",
      ],
      answer: 0,
      explain: `Una barrera es una herramienta real con un coste real: gasta el tiempo del nodo más lento sin hacer nada con los otros cuatro. Se gana ese coste cuando la siguiente etapa trata de verdad sobre el *conjunto* — deduplicación, una salida temprana si hay cero, una comparación entre resultados. "Se lee mejor" no lo es, y "necesito aplanar la lista primero" tampoco.` },
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
    { kind: "theory", body: `## Una forma todavía no es un sistema

Ya sabes coger una misión demasiado grande para un solo banco y cortarla en nodos lo bastante pequeños como para hacerlos bien — y sabes entregar la comprobación a una segunda mente que nunca se encariñó con las decisiones de la primera.

Lo que tienes es una forma. Lo que aún no tienes es una máquina en la que alguien pueda confiar. ¿Quién decide qué nodo va después? ¿Qué les pasa a los demás nodos cuando uno falla? Y — la pregunta que más dinero ahorra — ¿cuándo **no** deberías construir un grafo?

**A continuación:** la parte que hace fiable a la forma.` },
  ],
  testOut: [
    { question: `¿Por qué descomponer una misión grande en un grafo de nodos en vez de un prompt largo?`,
      options: ["Cada nodo recibe su propio banco curado, así la calidad no se diluye entre pasos que no tienen nada que ver entre sí","Los modelos cobran menos por varias peticiones cortas que por una larga","Deja que el modelo elija su propio orden de trabajo, lo que mejora los resultados"], answer: 0 },
    { question: `¿Cuál es la prueba para saber si dos nodos pueden correr en paralelo?`,
      options: ["El nodo A ni lee la salida del nodo B ni toca su estado","Se espera que ambos nodos tarden aproximadamente lo mismo","Ninguno de los dos escribe en la red"], answer: 0 },
    { question: `¿Por qué darle al segundo golem el objetivo \"refutar\" y no \"revisar\"?`,
      options: ["Un nodo al que se le manda aprobar encontrará la forma de aprobar — la refutación es el único objetivo que apunta la mente a los agujeros","La refutación produce salida más corta, lo que cuesta menos","La revisión requiere el contexto original, y la refutación no"], answer: 0 },
    { question: `Cuatro tareas en paralelo, cada una con dos etapas. ¿Qué cuesta realmente esperar a que todas terminen la etapa uno?`,
      options: ["El tiempo de etapa uno de la tarea más lenta, gastado sin hacer nada con las demás — y otra vez en la etapa dos","Nada, mientras las tareas corran en paralelo dentro de cada etapa","Solo la sobrecarga de coordinación del planificador"], answer: 0 },
  ],
};
