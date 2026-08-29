import type { Concept } from "../types";

export const tamingTheGolem: Concept = {
  meta: {
    slug: "taming-the-golem",
    title: "Domar al Golem",
    tagline: "Ingeniería de arneses: dale a la IA una banca, no un deseo.",
    numeral: "V",
    arc: "craft",
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/taming-the-golem.webp",
    glyph: "🗿",
  },
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
    {
      kind: "theory",
      body: `## Has estado dentro de uno todo el tiempo

Mira alrededor: **TUSST es un arnés.**

El entorno de evaluación de la Forja es un mecanismo de verificación: tu solución se ejecuta de forma aislada, pruebas ocultas la juzgan y ningún texto convincente convierte un resultado rojo en verde. Los laboratorios on‑chain van más allá: no preguntan *si dices* que desplegaste — **leen la cadena** y lo comprueban.

Esa es la disciplina en una imagen: construye la banca de modo que estar equivocado sea *detectable* y estar en lo correcto sea *comprobable* — para golems y para humanos.

Próxima disciplina: las palabras mismas — lo que el golem realmente ve en la banca.`,
    },
  ],
};
