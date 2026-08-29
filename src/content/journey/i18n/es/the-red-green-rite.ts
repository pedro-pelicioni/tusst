import type { Concept } from "../types";

// Chapter II (craft) — test-driven development as the rite that makes AI
// output acceptable at all: tests are the executable spec the machine can't
// argue with. Red-green-refactor, arrange-act-assert, invariants-as-assertions,
// and the campaign's hidden trials revealed as TDD played as a game.

export const theRedGreenRite: Concept = {
  meta: {
    slug: "the-red-green-rite",
    title: "El Rito Rojo‑Verde",
    tagline: "TDD: pruebas primero, forja después.",
    numeral: "II",
    arc: "craft",
    level: 1,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-red-green-rite.webp",
    glyph: "🟥",
  },
  steps: [
    {
      kind: "theory",
      body: `## La especificación crece dientes

En el Capítulo I aprendiste a escribir qué significa *correcto*. Una **prueba** es esa frase hecha ejecutable — una especificación que la máquina vuelve a comprobar en milisegundos, cada vez, para siempre.

Esto importa *más* con IA, no menos. Un gólem puede discutir tu prosa, reinterpretar tu intención, “mejorar” tus requisitos. No puede discutir con \`assert_eq!\`. **Las pruebas son la especificación con la que la máquina no puede discutir** — el único lugar donde una respuesta plausible y una respuesta correcta dejan de ser confundibles.

Escríbelas **primero**, y cada forja que sigue se califica desde el nacimiento.`,
    },
    {
      kind: "theory",
      body: `## El rito: rojo, verde, refactorizar

TDD es un rito de tres tiempos, y el orden es el punto clave:

1. **Rojo** — escribe una prueba pequeña para un comportamiento que aún no existe. Ejecútala. **Observa que falla.**
2. **Verde** — escribe el código más simple que haga que pase. No el más ingenioso. El más simple.
3. **Refactorizar** — ahora, con la red en marcha, límpialo. Las pruebas te cubren la espalda mientras mueves las cosas.

Rojo demuestra que la prueba puede atrapar el error que protege. Verde demuestra que el comportamiento existe. Refactorizar es donde el buen código realmente se crea — *de forma segura*.`,
    },
    {
      kind: "diagram",
      body: "Tres movimientos, para siempre:",
      caption: "El orden ES la disciplina: una prueba escrita después del código solo demuestra que el código hace lo que hace.",
      view: {
        kind: "flow",
        layout: "cycle",
        play: true,
        nodes: [
          {
            id: "red",
            label: "rojo",
            note: "Escribe la prueba primero y mírala fallar. Una prueba que nunca falló no demuestra nada.",
            tone: "bad",
          },
          {
            id: "green",
            label: "verde",
            note: "El cambio más pequeño que la hace pasar. No el elegante — el más pequeño.",
            tone: "good",
          },
          {
            id: "refactor",
            label: "refactorizar",
            note: "Ahora hazlo bien, con la prueba sujetando el comportamiento mientras mueves cosas.",
            tone: "accent",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Tu compañero IA entrega una funcionalidad *y* una nueva prueba para ella. Ejecutas el conjunto: todo está verde en el primer intento. ¿Qué le debes aún al rito?`,
      options: [
        "Romper la funcionalidad (o revertirla) y observar que la nueva prueba se vuelve roja — una prueba que nunca ha fallado puede no estar probando nada",
        "Nada — verde en la primera ejecución es el mejor resultado posible",
        "Volver a ejecutar el conjunto unas cuantas veces más para asegurarse de que el verde es estable",
      ],
      answer: 0,
      explain: `Cuando el mismo gólem forja tanto el código como sus pruebas, una prueba que afirma demasiado poco permanece verde para siempre. Rojo es la única prueba de que la prueba tiene dientes — una ruptura deliberada te dice que muerde.`,
    },
    {
      kind: "theory",
      body: `## Anatomía de una buena prueba

Una buena prueba unitária se lee en tres movimientos — **arrange, act, assert**:

- **Arrange** — construye el mundo: un escrow con un depósito, plazo ya vencido.
- **Act** — haz *una* cosa: el comprador llama a reembolso.
- **Assert** — verifica *un* comportamiento: el saldo del comprador aumentó en el depósito.

Un comportamiento por prueba, y un nombre que lo indique: \`refund_after_deadline_returns_deposit\`. Cuando esa prueba falla, el fallo *es* el diagnóstico — sin necesidad de arqueología.`,
    },
    {
      kind: "quiz",
      question: `Una única prueba deposita, aprueba, libera, reembolsa y afirma cuatro comportamientos diferentes. Esta noche está roja. ¿Cuál es el problema real de esta prueba?`,
      options: [
        "Cuando falla no puedes saber qué comportamiento se rompió — una prueba con muchos comportamientos convierte cada fallo en arqueología",
        "Nada — más aserciones por prueba siempre significan más protección",
        "Es demasiado lenta — la solución es combinarla con otras pruebas en una aún más grande",
      ],
      answer: 0,
      explain: `La cobertura no es el problema — el diagnóstico sí lo es. Cuatro pruebas enfocadas capturan los mismos errores, y la que se vuelve roja *nombra* el comportamiento roto gratuitamente.`,
    },
    {
      kind: "theory",
      body: `## De ejemplos a invariantes

Una prueba de ejemplo fija un punto: *esta* entrada, *esa* salida. **Pensar al estilo de propiedades** fija una ley: algo que debe mantenerse para *cada* entrada.

Tus invariantes del Capítulo I son exactamente esas leyes:

> saldo del escrow = depósitos − liberaciones − reembolsos

Afirmalo después de *cada* operación que tus pruebas realicen — depósito, liberación, reembolso, ordenes extrañas — y habrás construido una trampa a lo largo de todo el espacio de estados, no una cerca alrededor de un solo ejemplo. Cada invariante en tu especificación merece al menos una aserción que nunca deje de comprobarse.`,
    },
    {
      kind: "fill",
      prompt: `Convierte la invariante del Capítulo I en una prueba ejecutable:`,
      file: "escrow_test.rs",
      before: `assert_eq!(escrow.balance(), deposits - releases - `,
      after: `);`,
      choices: ["refunds", "fees", "interest", "gas"],
      answer: 0,
      explain: `El mismo anillo de hierro del Capítulo I, ahora con dientes: el dinero sale del escrow solo como liberaciones o reembolsos. Escrito como una aserción, la máquina lo vuelve a comprobar en cada forja — gratis, para siempre.`,
    },
    {
      kind: "theory",
      body: `## Aceptar el trabajo del gólem sin miedo

Aquí está la recompensa. Una IA te entrega 300 líneas. Sin pruebas, tus opciones son *leer cada línea con mucho cuidado* o *confiar*. Ambas fallan a escala.

Con un conjunto escrito primero, la aceptación es mecánica: **rojo — rechazar**, con el fallo como retroalimentación. **verde — aceptar**, y leer por estilo cuando quieras.

La misma red hace que refactorizar sea intrépido — tanto el tuyo como el del gólem. “Reescribe este módulo, mantén las pruebas verdes” es una instrucción segura *solo porque* las pruebas existen y el gólem no pudo escribirlas para que encajaran con su propio código.`,
    },
    {
      kind: "quiz",
      question: `El gólem se enorgullece de reportar **100 % de cobertura de líneas**. ¿Qué aprendiste realmente?`,
      options: [
        "Cada línea se ejecutó durante las pruebas — lo que no dice nada sobre cuánta lógica realmente verifican las aserciones",
        "El código es correcto — cada línea fue ejercitada y aprobó",
        "El conjunto está terminado — pasado el 100 % no queda nada que valga la pena probar",
      ],
      answer: 0,
      explain: `La cobertura cuenta líneas ejecutadas, no promesas cumplidas. Un conjunto puede tocar cada línea y afirmar casi nada. Persigue comportamientos e invariantes; deja que la cobertura sea un subproducto, nunca el objetivo.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "rust-fundamentals-1",
      body: `Un secreto de la Campaña: **cada escaramuza es calificada por pruebas ocultas** — forjas, las pruebas juzgan, rojo o verde. La Campaña *es* TDD jugado como un juego, y has estado dentro del rito desde tu primera escaramuza. Próxima disciplina: dibujar los límites donde una palabra cambia su significado — el mapa del que depende toda especificación.`,
    },
  ],
};
