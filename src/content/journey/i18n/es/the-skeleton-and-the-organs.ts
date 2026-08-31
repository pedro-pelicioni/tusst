import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "El Esqueleto y los Órganos",
  tagline: "Orquestación: aristas deterministas, juicio dentro de los nodos.",
  steps: [
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
    { kind: "fill",
      prompt: `Completa la separación que hace depurable a un grafo:`,
      file: "graph.toml",
      before: `Las aristas son código `,
      after: `; el juicio vive dentro de los nodos.`,
      choices: ["determinista", "generado por el modelo", "adaptativo", "automodificable"],
      answer: 0,
      explain: `Cualquier otra respuesta compra lo mismo: una ejecución que no puedes reproducir. Si el camino por el grafo es a su vez una salida del modelo, dos ejecuciones del mismo fallo tomaron dos rutas distintas — y no hay nada que recorrer paso a paso, porque lo que falló fue el mapa.` },
    {
      kind: "theory",
      body: `## Mamparos para el razonamiento

El regalo más silencioso del grafo es la **contención**.

En un único prompt gigante, una confusión en el paso dos envenena todo lo que sigue — mismo contexto, sin mamparos, el error se acumula educadamente hasta el final.

En un grafo, un nodo fallido **falla solo**. Su contexto queda en cuarentena; sus propias evaluaciones capturan el fallo en *su* frontera — la brújula del capítulo anterior, ahora publicada por nodo; el orquestador lo reintenta o lo rodea. Esto es lo que las herramientas de pipelines y multi‑agentes existen para ofrecerte: pasos nombrados, handoffs tipados, reintentos — y es la lección del radio de explosión del bastión, una capa más arriba.`,
    },
    { kind: "diagram",
      body: "Una confusión en el paso dos, dos arquitecturas:",
      caption: "El mismo error, el mismo modelo. La única diferencia es si había algo entre el paso dos y el paso cinco.",
      view: { kind: "compare",
        columns: [{ id: "mono", label: "un prompt largo", tone: "bad" }, { id: "graph", label: "un grafo", tone: "good" }],
        rows: [
          { label: "adónde va el error", cells: [{ text: "al contexto que lee cada paso posterior", tone: "bad" }, { text: "a ningún sitio — el contexto del nodo es suyo", tone: "good" }] },
          { label: "quién se da cuenta", cells: [{ text: "tú, al final, por la salida", tone: "bad" }, { text: "las evals de ese nodo, en su frontera", tone: "good" }] },
          { label: "qué cuesta", cells: [{ text: "cada paso posterior, rehecho", tone: "bad" }, { text: "un nodo, reintentado o esquivado", tone: "good" }] },
          { label: "qué puedes depurar", cells: [{ text: "una transcripción larga", tone: "bad" }, { text: "el nodo que falló, aislado", tone: "good" }] },
        ] } },
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
    { kind: "exercise", mode: "spec-write",
      brief: `## La prueba del examinador: teje uno

Una misión que no cabe en un solo banco:

> Un contrato de token Soroban necesita una pasada de seguridad antes de mainnet. Audítalo por las clases comunes de bug, arregla lo que encuentres, actualiza el README para que refleje el comportamiento corregido, y produce una nota breve de migración para quien ya esté en la versión antigua.

Diseña el **grafo**. Nombra los nodos y para qué sirve cada uno; di cuáles pueden correr en paralelo y por qué son genuinamente independientes; di dónde se sitúa un verificador y cuál es su objetivo; y nombra un nodo cuyo fallo no deba tumbar al resto, y qué pasa cuando falle.

Solo diseño — sin código de orquestación, sin nombres de herramienta ni framework.`,
      rubric: `1. Nombra al menos cuatro nodos, cada uno con un propósito único declarado.
2. Identifica qué nodos pueden correr en paralelo Y justifica la independencia — ninguno lee la salida del otro ni toca su estado.
3. Sitúa al menos un nodo verificador y declara su objetivo como refutación, no aprobación.
4. Nombra al menos un nodo cuyo fallo quede contenido, y dice qué hace el orquestador al respecto (reintentar, esquivar, parar y escalar).
5. Solo diseño — sin código de orquestación, sin nombres de framework ni herramienta, y el control de flujo no se deja a un modelo para que improvise.`,
      minChars: 200 },
    {
      kind: "theory",
      body: `## El oficio, ensamblado

Mira lo que llevas ahora en el cinturón: **especificaciones** que dicen qué es correcto; **pruebas** que lo verifican siempre; **límites** que mantienen las palabras honestas; una **fortaleza** que contiene el cambio; un **arnés** que contiene al gólem; **palabras** que moldean lo que ve; **bucles** que le permiten autocorregirse; y un **grafo** que teje muchas mentes en un solo plan.

Ninguno de estos lo hará la IA por ti. Todos ellos hacen que la IA valga diez veces su propio esfuerzo.

Lo siguiente en el camino: volver al reino — llevar el oficio al Forge y gastarlo en la red real.`,
    },
  ],
  testOut: [
    { question: `En un grafo bien construido, ¿dónde vive el juicio del modelo?`,
      options: ["Dentro de los nodos, mientras las aristas entre ellos siguen siendo código determinista que puedes probar y repetir","En las aristas — dejar que el modelo elija el siguiente nodo mantiene el sistema flexible","En ningún sitio; un pipeline serio es determinista de punta a punta"], answer: 0 },
    { question: `¿Qué sale mal cuando el modelo decide qué paso va después?`,
      options: ["Los fallos dejan de ser reproducibles — no puedes depurar un camino que nunca ocurre igual dos veces","Nada, siempre que cada nodo siga teniendo sus propias evals","Cuesta más, porque la decisión de enrutado es una llamada extra"], answer: 0 },
    { question: `Un nodo falla a mitad de un grafo. ¿Qué debería pasar?`,
      options: ["Falla solo — su contexto queda en cuarentena, sus propias evals lo detectan, y el orquestador reintenta o lo esquiva","La ejecución entera aborta, ya que los resultados posteriores se basarían en un fallo","El siguiente nodo hereda su salida parcial y continúa"], answer: 0 },
    { question: `La tarea: renombrar una función y sus llamadas en un solo archivo. ¿A qué recurres?`,
      options: ["Un bucle simple, o directamente tu editor — la coordinación de un grafo costaría más que la tarea","Un grafo, ya que más nodos significa más calidad a cualquier tamaño","Un grafo, porque las tareas pequeñas son donde se practica para las grandes"], answer: 0 },
  ],
};
