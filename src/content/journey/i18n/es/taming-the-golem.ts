import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Domando al Golem",
  tagline: "Harness engineering: el modelo se alquila, el arnés es tuyo.",
  steps: [
    {
      kind: "theory",
      body: `## Una mente en el vacío

Quita todo y un LLM hace exactamente una cosa: **texto entra, texto sale**. No puede ejecutar código, leer tu repositorio ni consultar la cadena. Solo, es una mente en un vacío — brillante, ciega e indefensa.

Todo lo que convierte esa mente en un *trabajador* es el **arnés**: las herramientas que puede invocar, los archivos que puede tocar, el sandbox que lo contiene, los verificadores que juzgan su salida.

Y aquí está la parte que la mayoría pasa por alto: el modelo se alquila. **El arnés es ingeniería — y es tuyo.**`,
    },
    {
      kind: "theory",
      body: `## Anatomía de un arnés

Un arnés funcional tiene partes con nombre:

- **Modelo** — la mente.
- **Conjunto de herramientas** — lo que puede *hacer*: ejecutar pruebas, editar archivos, consultar un RPC de Stellar.
- **Permisos** — lo que puede tocar y lo que no.
- **Directorio de trabajo** — el mundo que ve.
- **Ejecutor de pruebas** — el juez al que debe enfrentarse su salida.
- **Paso de revisión** — donde un humano (u otro golem) inspecciona el diff.

Dos equipos con el mismo modelo y arneses diferentes obtienen resultados *drásticamente* distintos. Cuando la calidad de la salida cambia, los ingenieros depuran el arnés — no el horóscopo.`,
    },
    {
      kind: "diagram",
      body: "Un banco de trabajo, en cuatro partes:",
      caption: "Cambia el modelo y esto sobrevive. Por eso el banco es el activo, no el prompt.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "context",
            label: "lo que puede ver",
            note: "Los archivos, la documentación, la salida que falló. Curado, no todo lo que tienes.",
            tone: "accent",
          },
          {
            id: "tools",
            label: "lo que puede hacer",
            note: "Un conjunto acotado de verbos. Cada uno que falta es un error que no puede cometer.",
            tone: "teal",
          },
          {
            id: "run",
            label: "déjalo actuar",
            note: "Se mueve, y el banco responde con honestidad en vez de asentir por cortesía.",
            tone: "neutral",
          },
          {
            id: "verify",
            label: "comprueba el trabajo",
            note: "Pruebas, tipos, un linter. La verificación convierte la salida en un resultado.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Mismo modelo, mismo tipo de tarea — pero los resultados de este mes son mucho peores que los del mes pasado. ¿Dónde mira primero un ingeniero de arnés?`,
      options: [
        "En lo que rodea al modelo — el contexto que se le dio, las herramientas que podía usar, los controles que limitan su salida",
        "En los pesos del modelo — se desgastan con el uso intensivo, como la maquinaria",
        "En ninguna parte — la aleatoriedad del muestreo explica cualquier variación, así que no hay nada accionable",
      ],
      answer: 0,
      explain: `Los pesos no se desgastan, y la aleatoriedad rara vez explica una caída sostenida. Las partes del arnés cambian constantemente — un archivo movido, un ejecutor de pruebas silenciado, un permiso ampliado — y cada una de ellas es inspeccionable, comparable y corregible. Por eso es importante poseer el arnés.`,
    },
    {
      kind: "theory",
      body: `## La verificación supera la confianza

El rasgo más peligroso del golem no es la ignorancia — es la **confianza mientras está equivocado**. Anuncia éxito con el mismo tono cálido tanto si el despliegue funcionó como si nunca ocurrió. La confianza es *estilo*, no señal.

Por eso un arnés nunca confía; **re‑verifica**, usando jueces a los que no se les puede convencer con palabras dulces:

- el **compilador** — ¿incluso compila?
- la **suite de pruebas** — tus pruebas del Rito, rojas o verdes
- el **linter** — ¿se mantuvieron los estándares?
- la **cadena misma** — ¿el libro mayor dice lo que el golem afirma?

Las afirmaciones son datos. Los verificadores son la verdad.`,
    },
    {
      kind: "quiz",
      question: `El golem informa: "Contrato desplegado e inicializado con éxito." ¿Qué hace un arnés bien construido con esa frase?`,
      options: [
        "La trata como una afirmación — lee la cadena, recupera el contrato, llama a una función de vista y confía en el libro mayor",
        "La acepta — los modelos están entrenados para ser veraces, y este ha sido fiable hasta ahora",
        "Le pide al golem que revise cuidadosamente su propio trabajo en la misma sesión",
      ],
      answer: 0,
      explain: `Una auto‑revisión por la misma mente comparte los mismos puntos ciegos — si creyó que el despliegue funcionó, volverá a creerlo. Los verificadores independientes no comparten esos puntos ciegos, y en Stellar una lectura RPC cuesta milisegundos. El libro mayor es el detector de mentiras más barato que tendrás.`,
    },
    { kind: "fill",
      prompt: `Completa el primer movimiento del ingeniero de arneses:`,
      file: "NOTES.md",
      before: `El golem dice que el despliegue salió bien. Antes de que esa frase cambie nada, el arnés `,
      after: ` .`,
      choices: ["lee la cadena y comprueba", "le pide al golem que lo confirme", "anota la afirmación en el registro de la ejecución", "repite el despliegue por si acaso"],
      answer: 0,
      explain: `Pedirle a la misma mente que confirme su propio trabajo te compra el mismo punto ciego dos veces. Y una afirmación escrita en un log sigue siendo una afirmación — solo que ahora parece oficial. En Stellar la comprobación cuesta una lectura RPC, lo que convierte al libro mayor en el detector de mentiras más barato que tendrás.` },
    { kind: "labLink", labSlug: "guild-vault",
      body: `Puedes meterte dentro de un arnés de verificación ahora mismo. El laboratorio **La Cámara del Gremio** de la Forja te hace elevar el umbral de firma de una cuenta, para que una tesorería exija dos oficiales — y luego no se fía de tu palabra. El servidor lee el libro mayor y comprueba él mismo el conjunto de firmantes. Decir que lo hiciste no es la comprobación; la cadena sí.` },
    { kind: "theory", body: `## La mitad que se salta

Ya sabes nombrar las piezas de un arnés y, más importante, negarte a creer nada de lo que el golem diga sobre su propio trabajo.

Todo hasta aquí ha ido de darle **manos** — herramientas, un directorio, un ejecutor. Nada hasta aquí ha hecho la pregunta difícil: qué manos exactamente, y qué pasa el día en que las use sobre un plan seguro y equivocado.

**A continuación:** cuánto poder necesita de verdad el trabajo, y la única pregunta que hacerle a cada paso que construyas.` },
  ],
  testOut: [
    { question: `¿Qué es el arnés, y por qué importa más que el prompt?`,
      options: ["Todo lo que rodea al modelo — herramientas, permisos, directorio de trabajo, verificadores. El modelo se alquila; el arnés es tuyo y sobrevive a un cambio de modelo","El prompt de sistema y sus instrucciones, que es donde se fija el comportamiento","La infraestructura del proveedor, que determina latencia y rendimiento"], answer: 0 },
    { question: `Mismo modelo, mismas tareas, y la salida de este mes es mucho peor. ¿Dónde mira primero un ingeniero de arneses?`,
      options: ["A lo que rodea al modelo — el contexto dado, las herramientas disponibles, las comprobaciones que filtran la salida","A los pesos, que se degradan bajo carga sostenida","A ningún sitio — la aleatoriedad del muestreo explica cualquier oscilación"], answer: 0 },
    { question: `¿Cuál es el rasgo más peligroso del golem?`,
      options: ["Seguridad estando equivocado — informa de éxito con el mismo tono cálido haya pasado algo o no","Ignorancia — hay cosas que sencillamente no ha visto nunca","Lentitud en tareas largas, lo que tienta a saltarse la revisión"], answer: 0 },
    { question: `"Contrato desplegado e inicializado con éxito." ¿Qué hace un buen arnés con esa frase?`,
      options: ["La trata como una afirmación, lee la cadena, llama a una función de lectura y cree al libro mayor","La acepta — el modelo ha sido fiable hasta ahora","Le pide al golem que revise su propio trabajo en la misma sesión"], answer: 0 },
  ],
};
