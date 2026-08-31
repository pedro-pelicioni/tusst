import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Lo Que Lo Detiene",
  tagline: "Toda herramienta es un radio de daño. Diseña para el día en que se equivoque.",
  steps: [
    {
      kind: "theory",
      body: `## Menor privilegio: menos dientes, por favor

Un golem con \`rm -rf\` disponible es un golem que *eventualmente* lo ejecutará — no por malicia, sino por un plan erróneo y confiado a las 2 a.m. La solución es antigua y probada: **menor privilegio**.

- Concede herramientas para *esta tarea*, no herramientas en general.
- Prefiere acceso **solo de lectura** siempre que escribir no sea necesario.
- Limítalo a un directorio; sandboxea cualquier cosa que se ejecute.
- Dale **solo claves de testnet** — nunca una clave cuya pérdida realmente cause daño.

Conceder poder "por si acaso" es cómo empiezan los incidentes. Cada herramienta tiene un radio de explosión; concédele según corresponda.`,
    },
    { kind: "widget", component: "blast-radius",
      body: `Dos medidores, y no se mueven juntos. **Concédele al golem lo que necesita una tarea de arreglar-y-probar**, y luego sigue añadiendo — y mira qué barra responde.` },
    {
      kind: "fill",
      prompt: `Delimita el poder del golem antes de que empiece a trabajar:`,
      file: "harness.toml",
      before: `signing_keys = "`,
      after: `"`,
      choices: ["testnet", "mainnet", "all-networks", "treasury"],
      answer: 0,
      explain: `Regla práctica: un golem solo posee claves cuya pérdida total puedas encarar con indiferencia. Los lumens de testnet son gratuitos gracias a friendbot; una clave de mainnet o del tesoro dentro de un bucle automatizado es un incidente con cuenta regresiva.`,
    },
    { kind: "theory", body: `## La concesión que nadie recuerda haber hecho

Conceder de más rara vez es una decisión. Es un martes por la tarde.

El golem necesita comprobar un saldo, así que recibe acceso a la red — de forma estrecha, para eso. Una semana después necesita instalar una dependencia, así que la red se queda abierta. Alguien está depurando un problema de mainnet y suelta una clave real en el entorno "solo para esta ejecución", y nadie la quita, porque quitarla es una tarea y ahora mismo no hay nada roto.

Ahora vuelve y haz la pregunta que el arnés existe para responder: *cuando esto salga mal, ¿qué lo detiene?* Red abierta más clave real más un plan seguro y equivocado no es un perfil de riesgo hipotético. Son tres martes corrientes, apilados.

La auditoría es barata y nadie la hace: **enumera lo que el golem tiene hoy y, para cada cosa, nombra la tarea que la necesitó.** Todo lo que quede sin nombre en esa columna es una concesión que nadie recuerda haber hecho.` },
    { kind: "quiz",
      question: `Añades red abierta y escritura en cualquier sitio a un golem que ya lee el repositorio, ejecuta pruebas, escribe en un directorio y tiene claves de testnet. ¿Qué compraron esas dos concesiones?`,
      options: [
        "Casi ninguna capacidad nueva, y un salto grande en el radio de daño",
        "Un salto grande en ambos — ese es el trato que aceptaste",
        "Sobre todo capacidad, ya que el acceso a red desbloquea casi cualquier tarea",
      ],
      answer: 0,
      explain: `Esta es la forma que conviene interiorizar: la capacidad se satura pronto y el radio de daño no. Las primeras concesiones hacen casi todo el trabajo útil, lo que significa que las añadidas "por si acaso" son casi siempre exposición pura. Concede para la tarea que tienes delante, no para la que puedas imaginar después.` },
    {
      kind: "theory",
      body: `## Diseña la ruta de falla

Los aficionados diseñan lo que ocurre cuando el golem está *correcto*. Los ingenieros diseñan lo que ocurre cuando está **equivocado** — porque a veces lo estará.

- Un chequeo fallido **bloquea el merge**; no registra una advertencia en el vacío.
- Los reintentos tienen un **presupuesto**, así un golem atascado se convierte en un golem detenido, no en una factura.
- Un humano revisa **un diff con contexto**, nunca un hecho consumado ya en producción.
- El rollback es una ruta probada, no una oración.

Para cada paso del arnés, haz una pregunta: *"cuando esto está mal, ¿qué lo captura?"* Si la respuesta es "ojalá que nada salga mal" — es un deseo, no un diseño.`,
    },
    { kind: "diagram",
      body: "Un deseo y un camino diseñado, uno al lado del otro:",
      caption: "Los dos parecen cautela en una revisión de código. Solo uno hace algo el día que importa.",
      view: { kind: "compare",
        columns: [{ id: "wish", label: "un deseo", tone: "bad" }, { id: "designed", label: "un camino diseñado", tone: "good" }],
        rows: [
          { label: "qué es", cells: [{ text: "\"ten cuidado y compruébalo dos veces\"", tone: "bad" }, { text: "una suite en rojo que bloquea el merge", tone: "good" }] },
          { label: "cuando el golem se equivoca", cells: [{ text: "sigue adelante, seguro de sí", tone: "bad" }, { text: "se detiene en el cable trampa", tone: "good" }] },
          { label: "quién se entera", cells: [{ text: "quien se choque con el bug", tone: "bad" }, { text: "un humano, con el diff y el fallo", tone: "good" }] },
          { label: "cuándo", cells: [{ text: "en producción, más tarde", tone: "bad" }, { text: "antes de que nada se integre", tone: "good" }] },
        ] } },
    {
      kind: "quiz",
      question: `¿Cuál de estos es una ruta de falla **diseñada**?`,
      options: [
        "Una suite de pruebas roja bloquea el auto‑merge, y un humano recibe el diff más la salida fallida",
        "El prompt instruye firmemente al golem a ser extremadamente cuidadoso y a doble‑chequear todo",
        "El bucle reintenta la misma tarea, sin límite, hasta que la salida finalmente pasa",
      ],
      answer: 0,
      explain: `Las instrucciones son esperanzas — útiles, pero no *capturan* nada. Los reintentos ilimitados son una factura sin techo (un capítulo posterior nombra la solución). Una ruta diseñada tiene un disparador, una parada y un humano con suficiente contexto para actuar.`,
    },
    { kind: "theory", body: `## Has estado dentro de uno todo este tiempo

Mira a tu alrededor: **TUSST es un arnés.**

El ejecutor calificado de la Forja es un arnés de verificación — tu solución corre en un sandbox, pruebas ocultas la juzgan, y ninguna cantidad de prosa segura convierte un rojo en verde. Los laboratorios on-chain van más lejos: no preguntan *si tú dices* que desplegaste — **leen la cadena** y comprueban.

Esa es la disciplina en una imagen: construye el banco de modo que equivocarse sea *detectable* y acertar sea *demostrable* — para golems y para humanos.

**A continuación:** las palabras mismas — lo que el golem ve de verdad en el banco.` },
  ],
  testOut: [
    { question: `¿Por qué dar claves de testnet y no de mainnet a un bucle automatizado?`,
      options: ["Un golem solo debe tener claves cuya pérdida total puedas encogerte de hombros — los lumens del friendbot son gratis, una clave de tesorería es un incidente con cuenta atrás","Los SDK rechazan las claves de mainnet en contextos automatizados","Las transacciones de testnet son más rápidas, así que el bucle itera antes"], answer: 0 },
    { question: `¿Cuál de estos es un camino de fallo diseñado?`,
      options: ["Una suite en rojo bloquea el auto-merge, y un humano recibe el diff más la salida del fallo","El prompt instruye firmemente al golem a tener cuidado y comprobarlo todo dos veces","El bucle repite la misma tarea sin límite hasta que algo pase"], answer: 0 },
    { question: `¿Cuál es la única pregunta que hacerle a cada paso de un arnés?`,
      options: ["Cuando esto salga mal, ¿qué lo detiene?","¿Con qué frecuencia falla este paso en la práctica?","¿Puede este paso ser más rápido o más barato?"], answer: 0 },
    { question: `Le das al golem red abierta y permiso para escribir en cualquier sitio. ¿Qué compró eso realmente?`,
      options: ["Casi ninguna capacidad extra, y una gran cantidad de radio de daño — la forma clásica de la concesión \"por si acaso\"","Ganancias más o menos proporcionales en capacidad y en riesgo","Más capacidad que riesgo, ya que la mayoría de tareas acaba necesitando ambas"], answer: 0 },
  ],
};
