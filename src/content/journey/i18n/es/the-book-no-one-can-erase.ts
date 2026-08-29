import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "El libro que nadie puede borrar",
  tagline: "Qué es una blockchain, contado sin una sola sigla.",
  steps: [
    {
      kind: "theory",
      body: `## Empieza por la cuenta de la taberna

Tú y once amigos bebéis cada semana en la misma taberna. Nadie paga en el momento — el tabernero lo anota todo en un libro: *Ana debe 3, Bruno debe 5, Ana devolvió 3.*

El libro funciona. Pero tiene una debilidad, y no es la aritmética: **el tabernero es el único que lo tiene.** Si una página se reescribe una noche cualquiera, no hay nada con qué compararla.

Todo este capítulo sale de corregir esa única debilidad. No hace falta matemática — solo una mejor disposición del libro.`,
    },
    {
      kind: "theory",
      body: `## Arreglo 1: cada uno guarda una copia

Así que cambias la regla. Cada línea que escribe el tabernero, los doce la copiáis en vuestro propio libro, en el mismo momento.

Ahora reescribir una página es casi inútil. Cambia tu copia y los otros once simplemente no están de acuerdo contigo — y la mayoría tiene razón, obviamente. El tabernero dejó de ser *el* libro y pasó a ser *uno de* los libros.

Esa es toda la idea de un **libro mayor compartido**: no es un archivo mágico, es solo una lista de movimientos que demasiada gente sostiene a la vez como para que alguno pueda editarla en silencio.`,
    },
    {
      kind: "diagram",
      body: `Toda la diferencia, en tres líneas:`,
      caption: "Nada de esto es criptografía: es solo aritmética sobre cuántas copias existen.",
      view: {
        kind: "compare",
        columns: [
          { id: "one", label: "un solo libro", tone: "bad" },
          { id: "many", label: "doce copias", tone: "good" },
        ],
        rows: [
          {
            label: "reescribir una página",
            cells: [
              { text: "nadie se entera", tone: "bad" },
              { text: "once copias discrepan", tone: "good" },
            ],
          },
          {
            label: "en quién confiar",
            cells: [
              { text: "en el tabernero", tone: "bad" },
              { text: "en nadie en particular", tone: "good" },
            ],
          },
          {
            label: "perder el libro",
            cells: [
              { text: "se acabó todo", tone: "bad" },
              { text: "quedan once copias", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Arreglo 2: encadena las páginas

Todavía queda un hueco. ¿Qué impide que alguien reescriba una página *del año pasado*, en el fondo del libro, donde nadie mira?

Así que añades una costumbre: al principio de cada página nueva copias un breve resumen de la anterior. La página 40 lleva una huella de la 39, que lleva una de la 38, y así hasta la primera.

Ahora tocar una página antigua cambia su huella — que ya no coincide con la anotada en la página siguiente, que ya no coincide con la próxima. **Una edición en el pasado rompe todas las páginas posteriores**, ruidosamente, para todos los que tienen una copia.

Páginas encadenadas a las páginas anteriores. Eso es el "chain" de blockchain — y sí, la palabra no significa nada más que eso.`,
    },
    {
      kind: "widget",
      component: "ledger-tamper",
      body: `Aquí está ese libro, encadenado. **Cambia cualquier página** y mira qué les pasa a las siguientes.`,
    },
    {
      kind: "quiz",
      question: `Alguien con una copia del libro compartido reescribe en silencio una línea de hace tres años. ¿Qué pasa?`,
      options: [
        "Todos lo notan: la página editada ya no coincide con la huella registrada en la página siguiente",
        "Nada — las páginas antiguas quedan demasiado atrás como para que alguien las revise",
        "El libro se repara solo y la edición desaparece en silencio",
      ],
      answer: 0,
      explain: `Para eso sirve encadenar las páginas. El historial no está protegido por un candado ni por una contraseña — está protegido por el hecho de que alterarlo *se nota*. La copia de los demás conserva las huellas originales, y la tuya deja de coincidir.`,
    },
    {
      kind: "theory",
      body: `## Arreglo 3: ¿quién escribe la próxima página?

Doce copias bastan entre amigos. Ahora imagina miles de desconocidos, repartidos por el mundo, que no confían entre sí — y una línea nueva llegando cada pocos segundos.

¿Quién tiene derecho a anotarla? Si todos escriben a la vez, ¿qué versión es la real?

Toda red de este tipo existe para responder esa única pregunta, y la respuesta es lo que las diferencia. Algunas celebran una lotería decidida por potencia de cálculo bruta. **Stellar celebra una votación:** cada participante nombra a quienes considera fiables, y una línea se vuelve real cuando esos círculos se solapan lo suficiente para coincidir.

La consecuencia práctica es lo que conviene recordar: una página nueva cada **5 segundos aproximadamente**, y una comisión por movimiento tan pequeña que se mide en fracciones de céntimo.`,
    },
    {
      kind: "quiz",
      question: `¿Por qué un libro mayor compartido necesita una regla sobre *quién escribe la próxima página*?`,
      options: [
        "Porque miles de desconocidos reciben movimientos al mismo tiempo y deben acabar con el mismo libro",
        "Porque escribir es caro y alguien tiene que pagar el papel",
        "Porque solo el autor original del libro puede añadir líneas",
      ],
      answer: 0,
      explain: `Lo difícil es el acuerdo, no el almacenamiento. Copiar una lista es fácil; lograr que miles de máquinas que no confían entre sí coincidan en la *misma* lista, en el mismo orden, es el problema que cada una de estas redes se construyó para resolver. Lo desmontarás a fondo en el Reino — e incluso lo romperás a propósito.`,
    },
    {
      kind: "fill",
      prompt: `Completa la frase que define la cosa:`,
      file: "NOTES.md",
      before: `Una blockchain es una lista de movimientos que mucha gente sostiene a la vez, donde cada página lleva una huella de la anterior — de modo que alterar el historial `,
      after: ` .`,
      choices: [
        "es inmediatamente visible para todos",
        "cuesta una pequeña comisión",
        "requiere una contraseña",
        "es imposible por matemática",
      ],
      answer: 0,
      explain: `Cuidado con la última: es el mito. El historial no es *imposible* de alterar; es imposible de alterar **en silencio**. Todo lo demás se apoya en esa distinción.`,
    },
    {
      kind: "theory",
      body: `## ¿Y qué es Stellar?

Uno de estos libros — construido específicamente para **el valor que se mueve entre personas**.

No es un ordenador mundial de propósito general ni una máquina de especulación: es un libro mayor diseñado para que enviar dinero a través de una frontera cueste una fracción de céntimo, liquide en unos cinco segundos y funcione igual con diez céntimos que con diez millones.

Todo lo que encontrarás más adelante — cuentas, pagos, tokens, contratos — es una línea, o una regla sobre líneas, en ese mismo libro compartido.

**A continuación:** si el libro es público y cualquiera puede escribir en él, ¿qué impide que un desconocido gaste *tu* dinero? La respuesta es una clave — y no se parece en nada a una contraseña.`,
    },
  ],
};
