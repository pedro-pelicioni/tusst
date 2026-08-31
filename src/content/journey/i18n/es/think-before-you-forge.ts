import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Piensa antes de forjar",
  tagline: "Spec-driven development: la habilidad que la IA no puede ejercer por ti.",
  steps: [
    {
      kind: "theory",
      body: `## La trampa del vibe coding

Una IA puede forjar un contrato que parece funcionar en treinta segundos. Compila. Se ejecuta. Incluso luce bien en una *demo*.

Y esa es precisamente la trampa: cuando el código es barato, **«parece correcto» y «es correcto» se vuelven indistinguibles** — a menos que hayas escrito, antes de empezar a forjar, qué significa *correcto*.

Eso que se deja por escrito es una **especificación**. En la era de programar en pareja con una IA, la especificación es la parte de la ingeniería que sigue siendo tuya.`,
    },
    {
      kind: "theory",
      body: `## Qué es realmente una especificación

Una especificación describe **comportamiento**, no implementación:

- **Qué debe ocurrir** — «quien depositó puede recuperar los fondos después del plazo».
- **Qué nunca debe ocurrir** — «el saldo del contrato nunca baja de la suma de los depósitos abiertos».
- **Los casos límite** — «¿qué pasa si el plazo vence exactamente *ahora*? ¿y si el importe es cero?».

Deliberadamente **no** indica qué bucle, qué formato de almacenamiento ni qué biblioteca usar. Dos implementaciones muy distintas pueden cumplir la misma especificación; esa libertad es lo que hace que las especificaciones sean duraderas y funcionen bien con la IA.`,
    },
    {
      kind: "quiz",
      question:
        "Estás escribiendo la especificación de un contrato de depósito en garantía. ¿Qué frase **pertenece a la especificación**?",
      options: [
        "Los fondos solo pueden liberarse cuando ambas partes hayan firmado.",
        "Numera cada depósito y guárdalos en el orden en que llegan.",
        "Constrúyelo con la versión más reciente del kit de contratos y su botón de pausa ya listo.",
      ],
      answer: 0,
      explain:
        "El comportamiento entra; la implementación queda fuera. Los formatos de almacenamiento y la elección de herramientas son asunto de la *forja*; la especificación determina qué debe ser verdad.",
    },
    {
      kind: "diagram",
      body: "La línea que acaba de trazar ese quiz, en general:",
      caption: "Dos implementaciones de la misma especificación pueden no parecerse en nada. Esa libertad es justo el punto.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "spec",
            label: "pertenece a la especificación",
            tone: "good",
          },
          {
            id: "forge",
            label: "pertenece a la forja",
            tone: "neutral",
          },
        ],
        rows: [
          {
            label: "un ejemplo",
            cells: [
              {
                text: "los fondos se liberan solo cuando ambas partes firmaron",
                tone: "good",
              },
              {
                text: "guardar los depósitos en una lista numerada",
                tone: "neutral",
              },
            ],
          },
          {
            label: "de quién es",
            cells: [
              {
                text: "tuya — y sobrevive a cada reescritura",
                tone: "good",
              },
              {
                text: "de quien forje, esta vez",
                tone: "neutral",
              },
            ],
          },
          {
            label: "cuándo cambia",
            cells: [
              {
                text: "cuando el comportamiento debe cambiar",
                tone: "good",
              },
              {
                text: "cada vez que aparece una forma más rápida",
                tone: "neutral",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## En la ambigüedad viven los errores

Considera este requisito aparentemente inocente:

> «El comprador recibe el reembolso después del plazo».

Tres ingenieros — o tres ejecuciones de una IA — pueden interpretarlo de tres maneras:

1. ¿El reembolso ocurre **automáticamente** o **cuando el comprador lo solicita**?
2. ¿Después de que el plazo **haya pasado** o **exactamente cuando vence**?
3. ¿El importe **completo** o descontando las comisiones?

Ninguna de estas interpretaciones es un error de *programación*. Son **huecos en la especificación**, y cada uno llega a producción convertido en un error con una suite de pruebas en verde.`,
    },
    {
      kind: "quiz",
      question: `Aquí tienes una especificación y tres implementaciones. **¿Cuál cumple la especificación?**

**ESPECIFICACIÓN — Depósito en garantía v1**
1. El comprador deposita una sola vez; el importe queda fijado al crear el contrato.
2. Los fondos solo se liberan al vendedor cuando **comprador y vendedor** han dado su aprobación.
3. Después del plazo, **el comprador** puede retirar los fondos **si todavía no se han liberado**.

---

**A** — libera los fondos al vendedor cuando *cualquiera* de las partes aprueba; después del plazo, el comprador puede retirarlos.

**B** — solo libera los fondos al vendedor cuando ambos aprueban; después del plazo, *cualquiera* puede iniciar el retiro y los fondos van al comprador.

**C** — solo libera los fondos cuando ambos aprueban; después del plazo, el comprador puede retirarlos *aunque ya se hayan liberado*, usando el saldo restante del contrato.`,
      options: [
        "B — respeta la aprobación de ambas partes y el reembolso llega al comprador según la regla del plazo",
        "A — parece más conveniente para el vendedor",
        "C — el comprador siempre debería poder salir",
      ],
      answer: 0,
      explain:
        "A incumple la regla 2 (cualquiera ≠ ambos). C incumple la condición de la regla 3 («si todavía no se han liberado») y gasta dos veces el depósito. B cambia *quién puede iniciar* el reembolso, algo que la especificación nunca restringió; los fondos siguen llegando al comprador, así que la especificación se cumple. Detectar esa última diferencia es precisamente la habilidad que entrenamos.",
    },
    {
      kind: "theory",
      body: `## Invariantes: el anillo de hierro de la especificación

Las líneas más poderosas de una especificación son los **invariantes**: afirmaciones que deben cumplirse *en todo momento*, sin importar qué función se haya ejecutado:

> saldo del depósito = depósitos abiertos − liberaciones − reembolsos

A un invariante no le importa lo ingeniosa que sea la implementación. Si se rompe una sola vez, el código está mal. Cuando conozcas el **TDD** en los próximos capítulos, convertirás estas líneas en pruebas ejecutables: una especificación que la máquina vuelve a comprobar en cada forja.`,
    },
    {
      kind: "fill",
      prompt: "Completa el invariante del depósito en garantía:",
      file: "SPEC.md",
      before: "saldo(depósito) == depósitos − liberaciones − ",
      after: "",
      choices: ["reembolsos", "comisiones", "beneficio", "gas"],
      answer: 0,
      explain:
        "El dinero sale del depósito exactamente de dos maneras: liberaciones al vendedor y reembolsos al comprador. Si esos tres términos no cuadran, alguien ha forjado un agujero.",
    },
    {
      kind: "quiz",
      question: `Tu IA implementó la especificación a la perfección. Todas las pruebas pasan. En producción, un comprador retira los fondos *durante* la transacción de liberación y el depósito paga dos veces; tu especificación nunca mencionó ese caso.

¿De quién es el error?`,
      options: [
        "De la especificación y, por tanto, tuyo: el artefacto bajo tu responsabilidad tenía un hueco",
        "De la IA: debería haber adivinado la regla que faltaba",
        "De nadie: el comportamiento indefinido no importa",
      ],
      answer: 0,
      explain:
        "Este es el acuerdo de la ingeniería en la era de la IA: la máquina forja al pie de la letra, así que la letra de la especificación es tu responsabilidad. Precisa la especificación, vuelve a forjar y ambas interpretaciones desaparecerán.",
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## La prueba del examinador: especifica una Hucha de Propinas del Gremio

Ha llegado el momento de forjar tu propia especificación. Este es el encargo:

> El gremio quiere una **hucha de propinas** on-chain. Cualquiera puede depositar propinas. Solo el **guardián** del gremio puede recoger lo que contiene. Al gremio le preocupan dos cosas: que el guardián consiga retirar *más* de lo que hay y que las propinas queden bloqueadas para siempre si el guardián desaparece.

Escribe la especificación — **solo comportamiento**, como enseña este capítulo: qué debe ocurrir, qué nunca debe ocurrir y cuáles son los casos límite. Un examinador de IA la evaluará con la rúbrica siguiente (y calificará como los gólems de la forja: al pie de la letra).`,
      rubric: `1. Solo comportamiento: nada de formatos de almacenamiento, bibliotecas ni firmas de funciones.
2. La regla de depósito y la regla de recogida están expresadas sin ambigüedad (quién puede actuar y sobre qué).
3. Al menos un **invariante** que deba cumplirse en todo momento.
4. Se aborda al menos un **caso límite** (propina de valor cero, recogida con la hucha vacía, recogida del saldo exacto…).
5. La preocupación «el guardián desaparece» se resuelve mediante un comportamiento explícito (se acepta cualquier diseño razonable: la rúbrica exige una decisión, no una solución concreta).`,
      minChars: 120,
    },
    {
      kind: "theory",
      body: `## Tu camino a partir de aquí

Todos los capítulos de este Viaje funcionan como este: una disciplina que la IA no ejercerá por ti, practicada en **Stellar**, una red real con mecanismos reales.

Y cuando un concepto despierte tu curiosidad por el metal que hay debajo, busca la puerta **«Verlo en Rust»**: conduce a la Campaña opcional, donde las mismas ideas se forjan a mano, combate a combate.

A continuación: el reino en el que vas a construir y cómo miles de máquinas llegan a un acuerdo sin un rey.`,
    },
  ],
  testOut: [
    { question: `¿Por qué una especificación es la parte de la ingeniería que sigue siendo tuya en la era de la IA?`,
      options: ["Cuando el código es barato, \"parece correcto\" y \"es correcto\" se vuelven indistinguibles salvo que escribieras antes qué significa correcto","Porque los modelos no saben leer especificaciones, así que un humano debe sostenerlas","Porque las especificaciones se escriben más rápido que el código y ahorran tiempo"], answer: 0 },
    { question: `¿Qué describe una especificación?`,
      options: ["Comportamiento — qué debe ocurrir, qué no debe ocurrir nunca, y los bordes","La implementación, con precisión suficiente para que cualquier dev produzca el mismo código","El diseño de almacenamiento y las firmas de las funciones públicas"], answer: 0 },
    { question: `Dos implementaciones muy distintas satisfacen tu especificación. ¿Qué significa eso?`,
      options: ["La especificación cumple su función — restringe el comportamiento y deja libre la implementación","La especificación es demasiado vaga y le falta detalle de implementación","Una de las dos implementaciones tiene que estar mal"], answer: 0 },
    { question: `¿Cuál de estas pertenece a una especificación?`,
      options: ["\"El saldo del contrato nunca baja de la suma de los depósitos abiertos\"","\"Guarda los depósitos en un mapa persistente indexado por dirección\"","\"Usa el SDK más reciente y mantén el código limpio\""], answer: 0 },
  ],
} satisfies JourneyConceptText;
