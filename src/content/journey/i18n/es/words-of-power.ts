import type { Concept } from "../types";

export const wordsOfPower: Concept = {
  meta: {
    slug: "words-of-power",
    title: "Palabras de Poder",
    tagline: "Ingeniería de prompts y contexto — lo que realmente ve el gólem.",
    numeral: "VI",
    arc: "craft",
    level: 2,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/words-of-power.webp",
    glyph: "🪶",
  },
  steps: [
    {
      kind: "theory",
      body: `## El banco es todo el mundo

El gólem no conoce tu repositorio. No recuerda el día de ayer y no puede ver el archivo que *no* adjuntaste. Su universo completo es la **ventana de contexto** — el texto que tiene delante en este momento.

Esa es la regla más profunda del prompting, y no es mística: **tú decides qué existe**. Lo que está en el banco es el mundo; lo que está fuera del banco nunca ocurrió.

Así que la pregunta detrás de cada prompt no es "¿cómo lo formulo?" sino *"¿qué necesita ver el gólem para hacerlo bien?"*`,
    },
    {
      kind: "theory",
      body: `## Anatomía de un prompt

Un prompt funcional es un pequeño documento de ingeniería con cuatro partes:

1. **Rol e instrucciones** — qué trabajo se está realizando y cómo: "Eres responsable de implementar un caso de uso en un dominio de pagos."
2. **Restricciones** — lo que se debe y no se debe hacer: "API pública sin cambios. Sin dependencias nuevas. Sin pánicos."
3. **Ejemplos** — una muestra de *bueno*, para que la calidad se muestre en lugar de describirse.
4. **La petición** — la tarea real, enunciada al final, precisa y única.

La mayoría de los prompts malos no están mal *redactados* — les **falta una parte**, normalmente las restricciones o el ejemplo.`,
    },
    {
      kind: "quiz",
      question: `¿Qué instrucción realmente mejora el código del gólem?`,
      options: [
        "Validar la cantidad: rechazar cero y negativos con un error tipado; nunca pánico; mantener la API pública sin cambios",
        "Por favor escribe código realmente limpio, profesional, de alta calidad y listo para producción",
        "Eres el mejor programador que ha existido — codifica en consecuencia",
      ],
      answer: 0,
      explain: `El gólem no puede fallar en "alta calidad" — cualquier salida plausible califica. Sí puede fallar en "nunca pánico", y ese es el punto: los criterios de aceptación crean la posibilidad de equivocarse, lo que guía al modelo. La especificidad supera la cortesía — y el halago.`,
    },
    {
      kind: "theory",
      body: `## Mostrar, no contar

Los adjetivos describen calidad; **los ejemplos la definen**. Un ejemplo trabajado supera a tres párrafos de adjetivos, porque el gólem es una máquina de continuación de patrones — así que entrégale un patrón que valga la pena continuar.

¿Quieres pruebas al estilo de tu equipo? Pega **una prueba ideal** y di "así". ¿Quieres mensajes de error que lleven un código y una pista de remediación? Muestra *uno*.

El Capítulo I te enseñó que los requisitos en prosa filtran ambigüedad. Lo mismo ocurre en el banco: un ejemplo es una pequeña especificación que se *copia* en lugar de interpretarse — y copiar pierde mucho menos que interpretar.`,
    },
    {
      kind: "theory",
      body: `## Ingeniería de contexto: curación, no acumulación

El prompting pregunta *cómo formular*. **La ingeniería de contexto** plantea la cuestión más importante: *¿qué se coloca en el banco?*

Para un error en la ruta de reembolso, el gólem necesita:

- el **módulo de reembolso** — el código realmente en juego,
- la **especificación** de reembolsos — artefacto del Capítulo I,
- la **prueba que falla** — artefacto del Rite, que nombra exactamente qué significa "corregido".

No todo el repositorio. No las notas de migración del mes pasado. La habilidad es *selección*: las doscientas líneas correctas superan a la obra completa de tu base de código.`,
    },
    {
      kind: "diagram",
      body: "Lo que crees que enviaste, y lo que de verdad llegó:",
      caption: "El contexto es un presupuesto, no un recipiente. Todo lo que añades compite con lo que ya pusiste.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "you",
            label: "lo que querías decir",
            tone: "neutral",
          },
          {
            id: "model",
            label: "lo que recibió",
            tone: "accent",
          },
        ],
        rows: [
          {
            label: "la tarea",
            cells: [
              {
                text: "\"arregla el bug\"",
                tone: "neutral",
              },
              {
                text: "tres palabras, ninguna salida de error, ningún archivo",
                tone: "accent",
              },
            ],
          },
          {
            label: "el código",
            cells: [
              {
                text: "\"está todo en el repo\"",
                tone: "neutral",
              },
              {
                text: "lo que cupo, normalmente la mitad equivocada",
                tone: "accent",
              },
            ],
          },
          {
            label: "el estándar",
            cells: [
              {
                text: "\"ya conoces nuestro estilo\"",
                tone: "neutral",
              },
              {
                text: "nada; nunca ha visto tus comentarios de revisión",
                tone: "accent",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Decaimiento del contexto

Aquí viene la parte contraintuitiva: el contexto irrelevante no solo ocupa espacio — **daña activamente**.

- Un archivo distractor invita al gólem a "ayudar" tocándolo.
- Vocabularios mezclados traen el modelo equivocado de Account — la pesadilla del Capítulo III, autoinfligida.
- Documentación obsoleta y código muerto enseñan comportamientos antiguos como si fueran actuales.
- Y cuanto más largo es el banco, más fina es la atención: tu restricción crucial compite ahora con diez mil tokens de ruido.

La curación funciona en ambos sentidos. **Eliminar del banco es tan poderoso como añadir**.`,
    },
    {
      kind: "quiz",
      question: `Estás enviando al gólem a arreglar un error en la ruta de reembolso. ¿Qué va en el banco?`,
      options: [
        "El módulo de reembolso, las reglas de reembolso de la especificación y la prueba que falla — y poco más",
        "Todo el repositorio, para que no falte ningún detalle potencialmente relevante",
        "Solo el mensaje de error — cualquier contexto de código sesgaría su perspectiva fresca",
      ],
      answer: 0,
      explain: `Pasar hambre y ahogarse son ambos modos de falla: muy poco contexto obliga a adivinar, mientras que contexto indiscriminado entierra la señal e invita a ediciones que nunca pediste. La curación — el módulo relevante, la especificación, la prueba — es el oficio mismo.`,
    },
    {
      kind: "fill",
      prompt: `El prompt más afilado que posees es uno que ya escribiste:`,
      file: "prompt.md",
      before: `Haz que este `,
      after: ` pase, sin cambiar sus aserciones.`,
      choices: ["test", "build", "demo", "deploy"],
      answer: 0,
      explain: `Una prueba que falla es un criterio de aceptación ejecutable — comportamiento, casos límite y finalización en una forma que no puede malinterpretarse. Los builds, demos y despliegues también pueden fallar, pero solo una prueba lleva aserciones: tu especificación con dientes, ahora trabajando como prompt.`,
    },
    {
      kind: "theory",
      body: `## La iteración es afinación de la especificación

La primera salida está equivocada. Bien, eso es datos. El movimiento amateur es volver a lanzar los dados; el movimiento del ingeniero es **leer el fallo y encontrar la instrucción que falta**.

¿El gólem ignoró un caso límite? Tus restricciones nunca lo mencionaron. ¿Estilo incorrecto? Dijiste en lugar de mostrar. ¿Tocó archivos que no debía? El banco estaba desordenado, o el borde no estaba definido.

Cada fallo nombra un agujero en tus palabras — corrige el *prompt*, no solo la salida, exactamente como el Capítulo I te enseñó a afinar una especificación.

Próxima disciplina: poner las palabras en movimiento — el bucle que actúa, observa y corrige.`,
    },
  ],
};
