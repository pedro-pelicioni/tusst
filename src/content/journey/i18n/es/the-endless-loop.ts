import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "El Bucle Infinito",
  tagline: "Actuar, observar, corregir — y las señales que lo hacen subir.",
  steps: [
    { kind: "theory", body: `## Del deseo al bucle

El prompting de un solo tiro es un deseo: describe, recibe, cruza los dedos. El **bucle agéntico** cambia los dedos cruzados por un ciclo:

> **actuar → observar → corregir → actuar de nuevo**

El golem escribe código, lo *ejecuta*, lee la queja del compilador, corrige, ejecuta otra vez — como trabajas tú, a ritmo de máquina. La calidad de un solo tiro dejó de ser el número interesante en cuanto el golem pudo ver sus propios resultados.

Pero un bucle es maquinaria, no magia. Tiene piezas que pueden estar bien o mal diseñadas, y este capítulo trata de las dos que deciden si sube.` },
    { kind: "diagram", body: "El bucle, y la única salida que importa:",
      caption: "Tres de estos cuatro son este capítulo. El cuarto — decidir parar — es el siguiente, y es el que la gente se salta.",
      view: { kind: "flow", layout: "cycle", play: true, nodes: [
        { id: "act", label: "actuar", note: "Da el paso más pequeño que permita el plan, luego párate y mira.", tone: "accent" },
        { id: "observe", label: "observar", note: "Lee lo que respondió el mundo. No lo que esperabas.", tone: "teal" },
        { id: "correct", label: "corregir", note: "Ajusta el plan, no solo el último movimiento.", tone: "gold" },
        { id: "stop", label: "¿parar?", note: "Hecho, bloqueado o sin presupuesto. Decídelo explícitamente, cada turno.", tone: "good" },
      ] } },
    { kind: "theory", body: `## Observación: los ojos del bucle

Un bucle mejora solo hasta donde sus **observaciones** son verdaderas. Corregir necesita una señal *hacia la que* corregir:

- **códigos de salida** — ¿falló el comando?
- **salida de las pruebas** — ¿qué prueba, qué aserción, qué línea?
- **estado on-chain** — ¿qué contiene realmente el libro mayor tras la ejecución?

Señales, no sensaciones. "La salida parece razonable" no corrige nada, porque nunca puede ser falso. Cada verificador que metiste en el arnés ahora da intereses: conectado al bucle, se convierte en los ojos con los que se guía el golem — **en cada iteración**.` },
    { kind: "quiz", question: `¿Qué observación puede dirigir de verdad un bucle?`,
      options: [
        "El informe del ejecutor de pruebas: 3 pasaron, 1 falló — refund_after_deadline, aserción en la línea 41",
        "El resumen final del propio golem: ahora todo parece correcto",
        "Que el código compilara a la primera — fuerte evidencia de que la lógica está bien",
      ], answer: 0,
      explain: `Compilar significa que los tipos encajan, no que el comportamiento sea el deseado — y un autorresumen es la mente corrigiendo sus propios deberes. Una señal de dirección debe ser externa, específica y capaz de ser mala noticia. "1 falló, línea 41" es un titular; "parece correcto" es meteorología.` },
    { kind: "theory", body: `## Un turno, rastreado

Es fácil asentir ante un ciclo en abstracto. Aquí tienes un único turno, con lo que realmente cruza el cable.

**Actuar.** El golem edita \`refunds.rs\` — cambia la comparación de plazo de \`>\` a \`>=\`. Un solo cambio, porque un turno que cambia seis cosas no puede decirte cuál funcionó.

**Observar.** El arnés ejecuta las evals fijas y devuelve exactamente esto:

> \`test_refund_after_deadline ... FAILED\`
> \`assertion failed: balance == 0, left: 40, right: 0\`
> \`4 passed, 3 failed\`

No "sigue roto". Una línea, un número, y un recuento comparable con el del turno anterior.

**Corregir.** Tres verdes pasaron a cuatro. Así que la comparación era *uno* de los bugs y no el único: el plazo está resuelto, el saldo no. El plan se actualiza — el siguiente turno va a por el saldo.

Fíjate en qué hizo que ese turno valiera algo. No fue el golem quien decidió que había mejorado. **Fue el recuento.**` },
    { kind: "theory", body: `## Evals: la brújula

¿Cómo sabes que la iteración 7 superó a la 6? No por intuición. Las **evals** son un conjunto *fijo* de comprobaciones — pruebas, lint, build, una aserción on-chain — ejecutadas **en cada iteración**, para que cada intento se mida con la misma vara.

*Fijo* es la palabra que lo sostiene todo. Si las comprobaciones cambian entre intentos, el "progreso" se vuelve imposible de medir — estás comparando notas de exámenes distintos.

Con una brújula, el bucle sabe *de hecho* si se movió: 4 verdes de 7 pasaron a 6 de 7. Sin ella, solo sabe que se movió. El progreso se **mide, no se siente**.` },
    { kind: "fill", prompt: `Completa la propiedad que hace de una brújula una brújula:`,
      file: "NOTES.md",
      before: `Las evals se ejecutan en cada iteración, y el conjunto de comprobaciones debe permanecer `,
      after: ` — si no, dos intentos se están calificando con dos exámenes distintos.`,
      choices: ["fijo", "aleatorizado", "opcional", "regenerado en cada intento"], answer: 0,
      explain: `Una vara que se mueve no mide nada. Por eso también "deja que el golem escriba sus propias pruebas sobre la marcha" destruye la señal en silencio: el examen y el alumno dejan de ser cosas distintas.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## La prueba del examinador: escribe un contrato de observación

Un bucle está a punto de apuntarse a una tarea real:

> Un contrato Soroban tiene un comportamiento defectuoso: los reembolsos se están pagando **después** de vencido el plazo. Vas a entregarle esto a un bucle agéntico y dejarlo trabajar sin supervisión un rato.

Antes de que gire una sola vez, escribe su **contrato de observación**: por qué señales se va a guiar este bucle, y qué hace fiable a cada una. Solo comportamiento — sin código de arnés, sin nombres de bibliotecas.`,
      rubric: `1. Nombra al menos dos señales concretas y externas (salida de pruebas, código de salida, estado on-chain, resultado de lint/build) — ni autoevaluación ni "parece bien".
2. Para al menos una señal, dice qué la hace fiable — determinista, reproducible o independiente del código que se está cambiando.
3. Dice qué cuenta como TERMINADO en términos de esas señales, no de la opinión del golem.
4. Nombra al menos una señal en la que NO se debe confiar, y por qué (un autorresumen, una compilación exitosa, una prueba inestable…).
5. Solo comportamiento — sin implementación del arnés, sin exigir herramientas ni bibliotecas concretas.`,
      minChars: 140 },
    { kind: "theory", body: `## Lo que este capítulo no te dio

Ya sabes montar un bucle que ve con honestidad y mide su propio avance. Apúntalo a una tarea y subirá.

Fíjate en lo que falta: aquí nada decide cuándo **para**. No cuándo está terminado — esa parte acabas de escribirla — sino cuándo está *atascado*, o cuándo ha gastado más de lo que valía la tarea. Un bucle con buenos ojos y sin freno no falla en voz alta. Falla en la factura.

**A continuación:** los frenos, y la única ejecución en la que descubres para qué estaban.` },
  ],
  testOut: [
    { question: `¿Qué sustituye un bucle agéntico, comparado con el prompting de un solo tiro?`,
      options: ["La esperanza — el golem ve ahora el resultado de su propio trabajo y corrige contra él","La necesidad de una especificación, ya que el bucle descubre los requisitos sobre la marcha","El compilador, ya que el bucle revisa el código por sí mismo"], answer: 0 },
    { question: `¿Por qué "la salida parece razonable" nunca puede dirigir un bucle?`,
      options: ["Porque nunca puede ser falso — una señal que no puede ser mala noticia no lleva información","Porque llega demasiado tarde en la iteración para actuar sobre ella","Porque los modelos no están entrenados para evaluar juicios en lenguaje natural"], answer: 0 },
    { question: `¿Por qué el conjunto de evals debe permanecer fijo entre iteraciones?`,
      options: ["Si no, dos intentos se califican con exámenes distintos y el progreso es inmedible","Si no, el bucle se ralentiza con cada comprobación añadida","Si no, el modelo memoriza las comprobaciones y las burla"], answer: 0 },
    { question: `Un bucle compila limpio a la primera. ¿Qué demuestra eso?`,
      options: ["Que los tipos encajan — no que el comportamiento sea el que se quería","Que la lógica es muy probablemente correcta, ya que la mayoría de los bugs son de tipos","Nada en absoluto; compilar no tiene relación con la calidad del código"], answer: 0 },
  ],
};
