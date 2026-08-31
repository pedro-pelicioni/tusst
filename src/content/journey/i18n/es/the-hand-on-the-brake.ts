import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Mano en el Freno",
  tagline: "Bucles agénticos y frenos: sin regla de parada no es autonomía, es una factura.",
  steps: [
    { kind: "theory", body: `## Todo bucle necesita un freno

Un bucle sin vigilancia no converge — **gasta**. Un bucle sin parada es una factura, y de vez en cuando una caída. Instala los frenos *antes* del primer giro:

- **Criterios de éxito** — las comprobaciones que significan *terminado*, decididas de antemano.
- **Presupuesto** — tokens, minutos, euros: lo que se agote primero.
- **Máximo de iteraciones** — un techo duro, siempre.
- **Detección de falta de avance** — el mismo error dos veces significa *cambia de estrategia o escala*, nunca "otra vez, pero con más ganas".

La regla del reino: nunca empieces un bucle sin haber decidido cómo pararlo.` },
    { kind: "widget", component: "loop-brake",
      body: `Dos interruptores, cuatro ejecuciones. **Gira el bucle** con los frenos puestos y el feedback honesto, y luego quita una cosa cada vez y mira de cuál te libras.` },
    { kind: "theory", body: `## Lo que cuesta cuando nada lo detiene

La factura es la parte visible, y es la menor.

Un bucle sin frenos que se pasó la noche sobre una prueba mentirosa no te devuelve nada. Te devuelve una rama: cuarenta commits, la mayoría ediciones de código que nunca estuvo roto, cada una plausible por separado, todas hechas para satisfacer un rojo que nunca fue real. Las evals siguen sin ponerse verdes — así que nada en esa rama te dice dónde acabó el trabajo real y empezó la superstición.

El camino más barato ahora es tirar la noche entera y empezar de nuevo con la inestabilidad arreglada. Que es exactamente lo que el freno por falta de avance te habría dicho en la iteración cuatro, al precio de cuatro iteraciones.

Esa es la forma del asunto: **el freno no te ahorra dinero en las ejecuciones buenas. Te ahorra la arqueología en las malas.**` },
    { kind: "quiz", question: `Iteración 40, y el bucle lleva chocando con la misma eval y el mismo mensaje de error desde la iteración 12. ¿Qué debería hacer el arnés?`,
      options: [
        "Parar y escalar a un humano — repetir sin avanzar es una condición de parada, no persistencia",
        "Seguir — iterar es todo el sentido de un bucle, y el intento 41 puede ser el bueno",
        "Subir la temperatura del modelo para que sea más creativo con el arreglo",
      ], answer: 0,
      explain: `Veintiocho fallos idénticos son un mensaje: al bucle le falta algo — contexto, un permiso, una especificación correcta — que más iteraciones no pueden aportar. Aleatorizar más fuerte compra error disperso al mismo precio. Detecta la falta de avance, para y entrégale el rastro a un humano.` },
    { kind: "fill", prompt: `Instala el freno antes de que el bucle gire:`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: ["budget.max_iterations", "usize::MAX", "evals.len()", "iterations + 1"], answer: 0,
      explain: `usize::MAX es "sin freno — ya lo hablamos en la factura". Un límite que se mueve con el contador (iterations + 1) nunca llega a sujetar. Y evals.len() confunde cuántas comprobaciones existen con cuánto seguir intentándolo. El techo es un presupuesto que elegiste a propósito.` },
    { kind: "theory", body: `## El feedback inestable envenena el bucle

Una prueba que falla al azar — tiempos, orden, un puerto compartido — es una molestia para los humanos. Suspiramos y la repetimos. Para un bucle es **veneno**, porque el bucle *actúa sobre cada señal*.

Llega un rojo fantasma → el golem "arregla" código que nunca estuvo roto → el cambio entra → en la siguiente iteración, otro fantasma → otro arreglo. El bucle está aprendiendo supersticiones, cada una sobre la anterior, todas a partir de ruido.

La regla: **haz el feedback determinista antes de conectarlo a un bucle.** Una prueba inestable es peor que ninguna prueba — el silencio no engaña a nadie; el ruido engaña sin cansarse.` },
    { kind: "quiz", question: `Una prueba falla al azar una de cada cinco veces, por cuestión de tiempos. Para un humano es una molestia. ¿Qué es para un bucle?`,
      options: [
        "Veneno — el bucle toma cada fallo fantasma por verdad y 'arregla' código sano, agravando el error en cada pasada",
        "La misma molestia — a lo largo de muchas iteraciones la aleatoriedad se compensa",
        "Levemente útil — los fallos extra presionan para que el código sea más robusto",
      ], answer: 0,
      explain: `Nada se compensa, porque cada señal falsa dispara un cambio real de código sobre el que la siguiente iteración construye. Los humanos descuentan el ruido; los bucles actúan obedientemente sobre él. El determinismo no es un lujo del arnés — es condición previa para que haya bucle.` },
    { kind: "diagram", body: "La misma tarea, ejecutada dos veces:",
      caption: "En el día bueno los frenos son invisibles. Por eso justamente se dejan fuera.",
      view: { kind: "compare",
        columns: [{ id: "braked", label: "con frenos", tone: "good" }, { id: "loose", label: "sin", tone: "bad" }],
        rows: [
          { label: "feedback honesto", cells: [{ text: "converge; los frenos no actúan", tone: "good" }, { text: "converge; resultado idéntico", tone: "neutral" }] },
          { label: "el feedback miente", cells: [{ text: "para en tres turnos, escala", tone: "good" }, { text: "corre hasta el techo que no existe", tone: "bad" }] },
          { label: "lo que pagas", cells: [{ text: "una cantidad acotada y conocida", tone: "good" }, { text: "lo que saliera, descubierto después", tone: "bad" }] },
          { label: "daño al código", cells: [{ text: "detectado pronto, pocos arreglos fantasma", tone: "good" }, { text: "ediciones en código que nunca estuvo roto", tone: "bad" }] },
        ] } },
    { kind: "theory", body: `## La altitud correcta

¿Dónde se coloca el humano mientras el bucle gira? No dentro — revisar cada pulsación significa que *tú* eres el bucle, a ritmo de golem. Y tampoco por encima de las nubes, sellando lo que caiga.

La altitud correcta es la **frontera**: revisa el *diff* contra la *especificación*. ¿Pasaron las evals? ¿El cambio respeta las reglas del Capítulo I? ¿Se movió algo que no tenía nada que hacer ahí? Confía en los instrumentos del bucle para lo pequeño; guarda el juicio humano para lo que los instrumentos no ven.

**A continuación:** cuando un bucle no basta — muchos golems pequeños, un plan tejido.` },
  ],
  testOut: [
    { question: `Un bucle lleva veintiocho iteraciones fallando la misma eval con el mismo error. ¿Qué te debe el arnés?`,
      options: ["Una parada y una escalada — repetir sin avanzar es una condición de parada, no persistencia","Más iteraciones, ya que el siguiente intento es tan probable como cualquiera","Una temperatura más alta, para que el modelo varíe su enfoque"], answer: 0 },
    { question: `¿Por qué una prueba inestable es peor para un bucle que para un humano?`,
      options: ["El bucle actúa sobre cada señal, así que un rojo fantasma se convierte en una edición real de código sano","El bucle ejecuta la suite más a menudo, así que se topa más con el fallo","Es el mismo problema; los bucles solo lo sacan antes a la luz"], answer: 0 },
    { question: `En una ejecución con feedback honesto, ¿qué cambian los frenos?`,
      options: ["Nada en absoluto — justo por eso se dejan fuera, y justo por eso es un error","Reducen a la mitad las iteraciones necesarias","Mejoran la calidad final al forzar una convergencia más temprana"], answer: 0 },
    { question: `¿Dónde debe situarse el humano mientras corre un bucle?`,
      options: ["En la frontera — revisando el diff contra la especificación, ni cada pulsación ni nada","Dentro del bucle, comprobando cada acción antes de ejecutarla","Completamente fuera; un bucle supervisado no es autónomo"], answer: 0 },
  ],
};
