import type { Concept } from "../types";

export const theEndlessLoop: Concept = {
  meta: {
    slug: "the-endless-loop",
    title: "El Bucle Infinito",
    tagline: "Bucles agenticos: actuar, observar, corregir — y saber cuándo detenerse.",
    numeral: "VII",
    arc: "craft",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-endless-loop.webp",
    glyph: "🔁",
  },
  steps: [
    {
      kind: "theory",
      body: `## De un deseo a un bucle

El prompting de un solo disparo es un deseo: describir, recibir, esperar. El **bucle agentico** reemplaza la esperanza por un ciclo:

> **actuar → observar → corregir → actuar de nuevo**

El gólem escribe código, lo *ejecuta*, lee la queja del compilador, lo arregla y lo vuelve a ejecutar — la forma en que trabajas, al ritmo de la máquina. La calidad de un solo disparo dejó de ser el número interesante en el momento en que el gólem pudo ver sus propios resultados.

Pero un bucle es maquinaria, no magia. Tiene partes que pueden diseñarse bien o mal — y cada una de las siguientes pantallas es una de esas partes.`,
    },
    {
      kind: "theory",
      body: `## Observación: los ojos del bucle

Un bucle mejora solo en la medida en que sus **observaciones** sean verdaderas. La corrección necesita una señal para corregir *hacia*:

- **códigos de salida** — ¿falló el comando?
- **salida de pruebas** — ¿qué prueba, qué aserción, qué línea?
- **estado on‑chain** — ¿qué contiene realmente el libro mayor después de la ejecución?

Señales, no vibraciones. “La salida parece razonable” no corrige nada, porque nunca puede ser falsa. Cada verificador que incorporaste al harness ahora gana interés: conectado al bucle, se convierte en los ojos con los que el gólem se guía — **en cada iteración**.`,
    },
    {
      kind: "quiz",
      question: `¿Qué observación puede realmente guiar un bucle?`,
      options: [
        "El informe del corredor de pruebas: 3 aprobados, 1 fallado — refund_after_deadline, aserción en la línea 41",
        "El propio resumen final del gólem: todo parece correcto ahora",
        "El hecho de que el código compiló en el primer intento — fuerte evidencia de que la lógica es correcta",
      ],
      answer: 0,
      explain: `Compilar solo indica que los tipos coinciden, no que el comportamiento sea el deseado — y un auto‑resumen es la mente calificando su propia tarea. Una señal de dirección debe ser externa, específica y capaz de ser mala noticia. “1 falló, línea 41” es un encabezado; “parece correcto” es clima.`,
    },
    {
      kind: "theory",
      body: `## Todo bucle necesita un freno

Un bucle sin vigilancia no converge — **gasta**. Un bucle sin parada es una factura, y ocasionalmente una caída del servicio. Instala los frenos *antes* de la primera vuelta:

- **Criterios de éxito** — las verificaciones que significan *listo*, decididas de antemano.
- **Presupuesto** — tokens, minutos, dólares: lo que se agote primero.
- **Máximo de iteraciones** — un techo rígido, siempre.
- **Detección de falta de progreso** — el mismo error dos veces significa *cambiar de estrategia o escalar*, nunca “de nuevo, pero más fuerte”.

La regla del reino: nunca inicies un bucle sin haber decidido cómo detenerlo.`,
    },
    {
      kind: "quiz",
      question: `Iteración 40, y el bucle ha estado encontrando la misma evaluación fallida con el mismo mensaje de error desde la iteración 12. ¿Qué debe hacer el harness?`,
      options: [
        "Detenerse y escalar a un humano — repetir sin progreso es una condición de parada, no persistencia",
        "Seguir adelante — la iteración es el objetivo del bucle, y la 41 podría ser la correcta",
        "Aumentar la temperatura del modelo para que sea más creativo con la solución",
      ],
      answer: 0,
      explain: `Veintiocho fallos idénticos son un mensaje: al bucle le falta algo — contexto, un permiso, una especificación correcta — que más iteraciones no pueden proporcionar. Randomizar más duro solo genera más errores al mismo precio. Detecta la falta de progreso, detén el bucle y entrega la pista a un humano.`,
    },
    {
      kind: "fill",
      prompt: `Instala el freno antes de que el bucle gire:`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: ["budget.max_iterations", "usize::MAX", "evals.len()", "iterations + 1"],
      answer: 0,
      explain: `usize::MAX es “sin freno — lo discutiremos en la factura”. Un límite que avanza con el contador (iterations + 1) nunca se aplica. Y evals.len() confunde cuántas verificaciones existen con cuánto tiempo seguir intentando. El techo es un presupuesto que elegiste a propósito.`,
    },
    {
      kind: "theory",
      body: `## Evaluaciones: la brújula

¿Cómo sabes que la iteración 7 superó a la 6? No por sensación. **Las evaluaciones** son un conjunto *fijo* de verificaciones — pruebas, lint, compilación, una aserción on‑chain — que se ejecutan **en cada iteración**, de modo que cada intento se mide contra la misma regla.

*Fijo* es la palabra estructural. Si las verificaciones cambian entre intentos, el “progreso” se vuelve incalculable — estarías comparando puntuaciones de exámenes diferentes.

Con una brújula, el bucle sabe *con certeza* si se movió: 4 verdes de 7 pasaron a 6 de 7. Sin ella, solo sabe que se movió. El progreso es **medido, no sentido**.`,
    },
    {
      kind: "theory",
      body: `## La retroalimentación inestable envenena el bucle

Una prueba que falla aleatoriamente — por tiempo, orden, un puerto compartido — es una molestia para los humanos. Suspiramos y la volvemos a ejecutar. Para un bucle es **veneno**, porque el bucle *actúa sobre cada señal*.

Un rojo fantasma aparece → el gólem “arregla” código que nunca estuvo roto → el cambio se aplica → en la siguiente iteración, otro fantasma → otro arreglo. El bucle ahora aprende supersticiones, cada una se acumula, todo a partir del ruido.

La regla: **haz que la retroalimentación sea determinista antes de conectarla a un bucle.** Una prueba inestable es peor que ninguna prueba — el silencio no engaña a nadie; el ruido engaña incansablemente.`,
    },
    {
      kind: "quiz",
      question: `Una prueba falla aleatoriamente una de cada cinco ejecuciones, por razones de temporización. Para un humano es una molestia. ¿Qué es para un bucle?`,
      options: [
        "Veneno — el bucle trata cada fallo fantasma como verdad y “arregla” código sano, acumulando errores en cada pasada",
        "La misma molestia — con muchas iteraciones la aleatoriedad se promedia",
        "Levemente útil — fallos extra aplican presión adicional para robustecer el código",
      ],
      answer: 0,
      explain: `Nada se promedia, porque cada señal falsa desencadena un cambio real de código que la siguiente iteración construye. Los humanos descartan el ruido; los bucles actúan obedientemente sobre él. La determinismo no es un lujo del harness — es una condición previa para cualquier bucle.`,
    },
    {
      kind: "theory",
      body: `## La altitud correcta

¿Dónde se sitúa el humano mientras el bucle gira? No dentro de él — revisar cada pulsación de tecla significa *que tú* eres el bucle, al ritmo del gólem. Y tampoco arriba de las nubes, aprobando sin cuestionar lo que llega.

La altitud correcta es el **límite**: revisar el *diff* contra la *especificación*. ¿Pasaron las evaluaciones? ¿Respeta el cambio las reglas del Capítulo I? ¿Algo se movió sin razón? Confía en los instrumentos del bucle para lo pequeño; conserva el juicio humano para lo que los instrumentos no pueden ver.

Próxima disciplina: cuando un bucle no basta — muchos gólems pequeños, un plan tejido.`,
    },
  ],
};
