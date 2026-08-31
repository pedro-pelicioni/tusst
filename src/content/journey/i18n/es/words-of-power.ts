import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Palabras de Poder",
  tagline: "Prompt engineering: las cuatro partes que tiene todo prompt que funciona.",
  steps: [
    {
      kind: "theory",
      body: `## Tus palabras son todo lo que tiene

El golem no conoce tu repositorio. No recuerda lo de ayer, y no ve el archivo que *no* adjuntaste. Su universo entero es el texto que tiene delante ahora mismo.

Esa es la regla más profunda del prompting, y no tiene nada de místico: **tú estás decidiendo qué existe.** Lo que pones delante de él es el mundo; lo que dejas fuera nunca ocurrió.

Así que la pregunta detrás de cada prompt no es "¿cómo lo redacto?", sino *"¿qué necesita el golem para acertar?"* Este capítulo es la primera mitad de la respuesta — las palabras. El siguiente es la mitad difícil.`,
    },
    {
      kind: "theory",
      body: `## Anatomía de un prompt

Un prompt que funciona es un pequeño documento de ingeniería con cuatro partes:

1. **Rol e instrucciones** — qué trabajo se está haciendo, y cómo: "Estás implementando un caso de uso en un dominio de pagos."
2. **Restricciones** — los debe y los no puede: "API pública sin cambios. Sin dependencias nuevas. Sin panics."
3. **Ejemplos** — una muestra de lo *bueno*, para mostrar la calidad en vez de describirla.
4. **La petición** — la tarea en sí, dicha al final, precisa y única.

La mayoría de los prompts malos no están mal *redactados* — les **falta una parte**, casi siempre las restricciones o el ejemplo.`,
    },
    {
      kind: "diagram",
      body: "Las cuatro partes, en el orden que les corresponde:",
      caption:
        "La petición va al final a propósito: todo lo de arriba es el marco con el que el golem lee la tarea.",
      view: {
        kind: "stack",
        bands: [
          { id: "role", label: "rol e instrucciones", note: "Qué trabajo se hace, y en qué mundo. Una o dos líneas bastan.", tone: "neutral" },
          { id: "constraints", label: "restricciones", note: "Los debe y los no puede. Es la parte que sí puede incumplirse — y por eso dirige.", tone: "accent" },
          { id: "examples", label: "ejemplos", note: "Una muestra de lo bueno. Enseña el estándar en vez de describirlo.", tone: "teal" },
          { id: "ask", label: "la petición", note: "Al final, precisa y única. Dos peticiones en un prompt son dos prompts.", tone: "gold" },
        ],
      },
    },
    {
      kind: "quiz",
      question: `¿Qué instrucción mejora de verdad el código del golem?`,
      options: [
        "Valida el importe: rechaza cero y negativos con un error tipado; nunca hagas panic; mantén la API pública sin cambios",
        "Por favor escribe un código muy limpio, profesional, de altísima calidad, listo para producción",
        "Eres el mejor programador que ha existido — programa a esa altura",
      ],
      answer: 0,
      explain: `El golem no puede fallar en "alta calidad" — toda salida se califica plausiblemente. Sí puede fallar en "nunca hagas panic", y ese es el punto: los criterios de aceptación crean la posibilidad de estar equivocado, y eso es lo que dirige a un modelo. La especificidad gana a la cortesía — y a la adulación.`,
    },
    {
      kind: "theory",
      body: `## Enseña, no describas

Los adjetivos describen la calidad; **los ejemplos la definen.** Un ejemplo trabajado pesa más que tres párrafos de adjetivos, porque el golem es una máquina de continuar patrones — así que dale un patrón que valga la pena continuar.

¿Quieres pruebas en el estilo de la casa? Pega **una prueba ideal** y di "así". ¿Quieres mensajes de error con un código y una pista de solución? Enseña *uno*.

El Capítulo I te enseñó que los requisitos en prosa filtran ambigüedad. Aquí pasa igual: un ejemplo es una especificación diminuta que se *copia* en vez de interpretarse — y copiar pierde mucho menos que interpretar.`,
    },
    {
      kind: "quiz",
      question: `Tu equipo tiene una forma muy propia de escribir mensajes de error. ¿Qué hace que el golem la reproduzca?`,
      options: [
        "Pegar un mensaje de error real del código y decir “así”",
        "Describir la convención con cuidado en tres frases",
        "Decirle que siga la guía de estilo establecida del equipo",
      ],
      answer: 0,
      explain: `Nunca ha leído tu guía de estilo y no ve tu código. Una descripción hay que interpretarla; un ejemplo solo hay que continuarlo — y continuar es lo único para lo que esta máquina está hecha.`,
    },
    {
      kind: "fill",
      prompt: `El prompt más afilado que tienes es uno que ya escribiste:`,
      file: "prompt.md",
      before: `Haz que esta `,
      after: ` que falla pase, sin cambiar sus aserciones.`,
      choices: ["prueba", "compilación", "demo", "publicación"],
      answer: 0,
      explain: `Una prueba que falla es un criterio de aceptación ejecutable — comportamiento, bordes y "terminado" en una forma que no se puede malinterpretar. Compilaciones, demos y despliegues también fallan, pero solo una prueba lleva aserciones: tu especificación con dientes, ahora haciendo de prompt.`,
    },
    {
      kind: "theory",
      body: `## Iterar es apretar la especificación

La primera salida sale mal. Bien — eso es información. La jugada de aficionado es volver a tirar los dados; la de ingeniero es **leer el fallo y encontrar la instrucción que faltaba**.

¿El golem ignoró un caso borde? Tus restricciones nunca lo mencionaron. ¿Estilo equivocado? Describiste en vez de enseñar. ¿Tocó archivos que no debía? La frontera no se dijo.

Cada fallo nombra un agujero en tus palabras — parchea el *prompt*, no solo la salida, igual que el Capítulo I te enseñó a apretar una especificación.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## La prueba del examinador: escribe el prompt

Esta es la tarea que estás a punto de delegar:

> Un contrato de pagos tiene una función \`refund\`. Hoy permite que la llame cualquiera. Debe poder llamarla solo el pagador original, solo antes del plazo, y nunca debe dejar al contrato con menos que la suma de sus depósitos abiertos.

Escribe el **prompt** que enviarías — las cuatro partes, en orden. No escribas la implementación, y no escribas la especificación en prosa: escribe lo que de verdad pegarías en el banco.`,
      rubric: `1. Las cuatro partes están presentes y se distinguen: rol/instrucciones, restricciones, al menos un ejemplo, y una petición única al final.
2. Las restricciones están redactadas de modo que puedan INCUMPLIRSE — concretas y comprobables, no "limpio" ni "de alta calidad".
3. Incluye al menos un ejemplo trabajado (una prueba, una firma, un mensaje de error, una llamada de muestra) en vez de solo describir el estilo deseado.
4. La petición es única y precisa — una tarea, no una lista de deseos vagamente relacionados.
5. Es un prompt, no una implementación ni una especificación en prosa.`,
      minChars: 160,
    },
    {
      kind: "theory",
      body: `## La mitad que es más difícil

Ya sabes escribir un prompt que dice exactamente lo que quiere. Esa es la disciplina fácil, y la mayoría se queda ahí.

La difícil es decidir **qué llega a ver el golem** — qué archivos, qué especificación, qué prueba, y, mucho más importante, qué dejar fuera. Redactar es una habilidad; seleccionar es el oficio.

**A continuación:** el banco mismo, y por qué añadirle cosas no sale gratis.`,
    },
  ],
  testOut: [
    { question: `Un prompt que funciona tiene cuatro partes. ¿Cuál suele ser la que falta?`,
      options: ["Las restricciones — los debe y los no puede que sí pueden incumplirse","El rol, que le dice al modelo quién debe ser","El saludo, que establece un tono cooperativo"], answer: 0 },
    { question: `¿Por qué "nunca hagas panic" dirige mejor a un modelo que "escribe código de alta calidad"?`,
      options: ["Porque se puede incumplir — un criterio de aceptación crea la posibilidad de estar equivocado","Porque es más corto, así que sobrevive más adentro del contexto","Porque usa un verbo en imperativo, que los modelos ponderan más"], answer: 0 },
    { question: `Quieres la salida en el estilo de la casa de tu equipo. ¿Qué funciona?`,
      options: ["Pegar un ejemplo real y decir “así”","Describir el estilo con cuidado y en detalle","Nombrar la guía de estilo que sigue el equipo"], answer: 0 },
    { question: `La primera salida vuelve mal. ¿Cuál es la jugada de ingeniero?`,
      options: ["Leer el fallo, encontrar la instrucción que faltaba y parchear el prompt","Volver a ejecutarlo — el mismo prompt produce salidas distintas cada vez","Añadir “ten cuidado y piensa paso a paso” y probar otra vez"], answer: 0 },
  ],
};
