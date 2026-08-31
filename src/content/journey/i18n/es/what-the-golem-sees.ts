import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Lo Que el Golem Ve",
  tagline: "Context engineering: curaduría, no acumulación.",
  steps: [
    {
      kind: "theory",
      body: `## Curaduría, no acumulación

El prompt engineering pregunta *cómo redactar*. El **context engineering** hace la pregunta más importante: *¿qué llega delante del golem, para empezar?*

Para un bug en el flujo de reembolsos necesita tres cosas:

- el **módulo de reembolsos** — el código que está en juego,
- las **reglas de reembolso de la especificación** — el artefacto del Capítulo I,
- la **prueba que falla** — el artefacto del Rito, que nombra exactamente qué significa "arreglado".

No el repositorio entero. No las notas de migración del mes pasado. La habilidad es la *selección*: las doscientas líneas correctas valen más que la obra completa de tu código.`,
    },
    {
      kind: "theory",
      body: `## Un banco, montado

El bug de reembolsos, de verdad. Esto es lo que entra, con tamaño y motivo:

- \`refunds.rs\` (180 líneas) — el código que está mal. No el módulo que lo llama; el que decide.
- Las tres cláusulas de reembolso de la especificación (14 líneas) — para que "correcto" tenga una definición que no sea la opinión del golem.
- \`test_refund_after_deadline\` y su salida de fallo (20 líneas) — la única prueba en rojo, y lo que realmente imprimió.

Y lo que se queda fuera, que es la mitad difícil:

- \`payments.rs\`, aunque los reembolsos vivan dentro de pagos — no es donde está el bug, y **todo archivo en el banco es un archivo que el golem puede decidir mejorar**.
- Las notas de migración de la versión que introdujo el plazo. Describen un esquema que ha cambiado dos veces desde entonces, y el material viejo enseña con aplomo.
- El resto de la suite de pruebas. Seiscientas líneas en verde no dicen nada sobre la única que está en rojo.

Unas 210 líneas, frente a un repositorio de cuarenta mil. Esa proporción *es* el trabajo.`,
    },
    {
      kind: "diagram",
      body: "Lo que crees que enviaste, y lo que llegó de verdad:",
      caption:
        "El contexto es un presupuesto, no un recipiente. Todo lo que añades compite con todo lo que ya pusiste.",
      view: {
        kind: "compare",
        columns: [
          { id: "you", label: "lo que querías decir", tone: "neutral" },
          { id: "model", label: "lo que recibió", tone: "accent" },
        ],
        rows: [
          { label: "la tarea", cells: [{ text: "\"arregla el bug\"", tone: "neutral" }, { text: "tres palabras, sin salida de error, sin archivo", tone: "accent" }] },
          { label: "el código", cells: [{ text: "\"está todo en el repositorio\"", tone: "neutral" }, { text: "lo que cupo — normalmente la mitad equivocada", tone: "accent" }] },
          { label: "el estándar", cells: [{ text: "\"ya conoces nuestro estilo\"", tone: "neutral" }, { text: "nada; nunca ha visto vuestros comentarios de revisión", tone: "accent" }] },
        ],
      },
    },
    {
      kind: "widget",
      component: "context-window",
      body: `Aquí tienes ese presupuesto. **Carga el banco** y observa dos números moverse a la vez — cuánto sitio queda, y cuánto de lo que hay va realmente sobre la tarea.`,
    },
    {
      kind: "quiz",
      question: `Vas a mandar al golem a arreglar un bug en el flujo de reembolsos. ¿Qué va al banco?`,
      options: [
        "El módulo de reembolsos, las reglas de reembolso de la especificación y la prueba que falla — y poco más",
        "El repositorio entero, para que no falte ningún detalle potencialmente relevante",
        "Solo el mensaje de error — cualquier contexto de código sesgaría su perspectiva fresca",
      ],
      answer: 0,
      explain: `Pasar hambre y ahogarse son ambos modos de fallo: poco contexto obliga a adivinar, y el contexto indiscriminado entierra la señal e invita a ediciones que nunca pediste. La curaduría — el módulo relevante, la especificación, la prueba — es el oficio en sí.`,
    },
    {
      kind: "theory",
      body: `## Podredumbre de contexto

Aquí viene la parte contraintuitiva: el contexto irrelevante no solo malgasta sitio — **hace daño activo**.

- Un archivo distractor invita al golem a tocarlo "por ayudar".
- Los vocabularios mezclados arrastran el modelo equivocado de Cuenta — la pesadilla del Capítulo III, autoinfligida.
- Los documentos viejos y el código muerto enseñan comportamiento antiguo como si fuera el actual.
- Y cuanto más largo el banco, más fina la atención: tu única restricción crucial compite ahora con diez mil tokens de ruido.

La curaduría corta en los dos sentidos. **Quitar del banco es tan potente como añadirle.**`,
    },
    {
      kind: "quiz",
      question: `¿Cuál de estos hace más daño en un banco abarrotado?`,
      options: [
        "Un documento viejo que describe cómo funcionaba el módulo — enseña comportamiento antiguo como actual",
        "Un archivo largo que simplemente no viene a cuento y acaba ignorado",
        "Líneas en blanco de más entre las secciones del prompt",
      ],
      answer: 0,
      explain: `El material sin relación te cuesta sitio y atención. El material *contradictorio* te cuesta corrección: el golem no tiene forma de saber cuál de las dos versiones de la verdad es la actual, y seguro-y-equivocado es el modo de fallo caro.`,
    },
    {
      kind: "fill",
      prompt: `Completa la frase que separa esta disciplina del prompting:`,
      file: "NOTES.md",
      before: `El contexto es un presupuesto, no un recipiente — por eso quitar del banco es `,
      after: ` .`,
      choices: [
        "tan potente como añadirle",
        "algo que solo vale la pena cuando te quedas sin sitio",
        "un último recurso cuando el modelo se lía",
        "algo que el modelo resuelve automáticamente",
      ],
      answer: 0,
      explain: `Es el capítulo entero en una línea. Redactar es una habilidad que se practica en una tarde; decidir qué no ve nunca el golem es la parte que sigue siendo difícil, y la que separa un banco que funciona de uno que está lleno.`,
    },
    {
      kind: "theory",
      body: `## Por qué este es el último capítulo tranquilo

Hasta ahora el golem ha hecho una cosa cada vez: tú montas el banco, escribes la petición, lees la respuesta. El bucle sigues siendo tú.

En el momento en que empieza a actuar sobre su propia salida — ejecutar la prueba que acaba de escribir, leer el fallo, intentarlo otra vez — todo esto se compone. Un banco que solo estaba desordenado pasa a ser un banco que **crece**, solo, con cada paso que da.

**A continuación:** el bucle que actúa, observa y corrige — y cómo decirle cuándo parar.`,
    },
  ],
  testOut: [
    { question: `¿Qué pregunta hace el context engineering que el prompt engineering no hace?`,
      options: ["Qué llega delante del modelo, para empezar — una cuestión de selección, no de redacción","Cómo redactar la instrucción para que el modelo no pueda malinterpretarla","A qué modelo mandar la tarea"], answer: 0 },
    { question: `¿Por qué el contexto irrelevante es peor que un simple desperdicio?`,
      options: ["Un distractor invita a ediciones que nunca pediste, y el material viejo enseña comportamiento antiguo como actual","Ralentiza la respuesta lo bastante como para romper el ritmo de trabajo","Los modelos cobran más por entradas largas, así que es puramente un problema de coste"], answer: 0 },
    { question: `Mandar el repositorio entero en vez de tres archivos relevantes ¿qué te da?`,
      options: ["Lo que cupo en el presupuesto — y no eliges tú qué mitad fue esa","Una imagen completa, a costa de una respuesta más lenta","El mismo resultado, ya que los modelos ignoran lo que no es relevante"], answer: 0 },
    { question: `Los dos modos de fallo tienen nombre en este capítulo. ¿Cuáles son?`,
      options: ["Pasar hambre — muy poco, así que adivina; y ahogarse — tanto que la señal queda enterrada","Sobreajuste y subajuste","Arranque en frío y podredumbre de contexto"], answer: 0 },
  ],
};
