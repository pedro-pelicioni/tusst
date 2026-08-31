import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Lo Que Guarda la Frontera",
  tagline: "DDD táctico: identidad, valor, y el conjunto que debe moverse a la vez.",
  steps: [
    {
      kind: "theory",
      body: `## Entidades y objetos de valor

Dos tipos de cosas viven dentro de cualquier contexto:

- Una **entidad** tiene identidad que sobrevive al cambio. Una **Cuenta** de Stellar es la misma cuenta después de mil pagos — su dirección es su identidad; sus saldos son solo estado.
- Un **objeto de valor** *es* su valor. Un **Activo** de Stellar es un código más un emisor: dos \`USDC\` del mismo emisor son intercambiables — indistinguibles, de hecho. Cambiar el emisor no edita el activo; estás sosteniendo un *activo diferente*.

Las entidades se rastrean. Los valores se comparan. Confundir los dos es cómo nacen los bugs fantasma.`,
    },
    {
      kind: "quiz",
      question: `¿Cuál de estos es un **objeto de valor** en el dominio de Stellar?`,
      options: [
        "Un activo — código + emisor; dos con los mismos campos son la misma cosa, sin identidad propia",
        "Una cuenta — mantiene su identidad mientras sus saldos cambian bajo ella",
        "Un validador — permanece el mismo nodo a través de reinicios y cambios de IP",
      ],
      answer: 0,
      explain: `Las otras dos respuestas describen cosas reales — pero son *entidades*: identidad que sobrevive al cambio. El activo es puro valor: la igualdad es campo por campo, y la pregunta “¿cuál es el original?” ni siquiera tiene sentido.`,
    },
    { kind: "diagram",
      body: "Dos tipos de cosa, y la pregunta que los separa:",
      caption: "Pregunta \"si lo cambio por una copia idéntica, ¿ha cambiado algo?\" — no significa valor, sí significa entidad.",
      view: { kind: "compare",
        columns: [{ id: "entity", label: "entidad", tone: "accent" }, { id: "value", label: "objeto de valor", tone: "teal" }],
        rows: [
          { label: "espécimen en Stellar", cells: [{ text: "una cuenta (G…)", tone: "accent" }, { text: "un activo (código + emisor)", tone: "teal" }] },
          { label: "qué hace iguales a dos", cells: [{ text: "la misma identidad", tone: "accent" }, { text: "los mismos campos", tone: "teal" }] },
          { label: "sobrevive a un cambio de estado", cells: [{ text: "sí — los saldos se mueven, la cuenta permanece", tone: "accent" }, { text: "no — cambia el emisor y es otro activo", tone: "teal" }] },
          { label: "por tanto tú", cells: [{ text: "lo rastreas", tone: "accent" }, { text: "lo comparas", tone: "teal" }] },
        ] } },
    {
      kind: "theory",
      body: `## Agregados: la regla del sobre

Algunos objetos solo tienen sentido **juntos**, protegidos por una raíz que impone las reglas. Ese conjunto es un **agregado**.

Stellar te brinda un espécimen perfecto: el **sobre de transacción**. Las operaciones viven *dentro* de una transacción — firmadas juntas, secuenciadas juntas, y **todas tienen éxito o fallan juntas**. No puedes extraer la operación #3 y aplicarla sola; el sobre es la única puerta, y contiene las firmas y el número de secuencia.

Ese es el patrón de agregado en producción: la consistencia se impone *en la frontera*, de modo que nada dentro pueda quedar a medio aplicar.`,
    },
    { kind: "theory", body: `## El agregado que se comió el sistema

La forma clásica de equivocarse aquí es dibujar el agregado **demasiado grande**.

Empieza razonable: estas cosas deben mantenerse consistentes, así que van bajo una raíz. Luego aquellas también. Pronto la raíz es "el Libro Mayor", todo cambio tiene que pasar por ella, y dos operaciones sin relación no pueden avanzar a la vez porque compiten por la misma guarda. Consistencia comprada con una cola.

Stellar muestra la contención. El sobre es un agregado — pero **pequeño**: hasta cien operaciones, el número de secuencia de una cuenta, y nada más. No guarda el libro mayor; guarda un envío. Los sobres de todos los demás avanzan en esos mismos cinco segundos, intactos.

La regla práctica: un agregado debe ser el conjunto más pequeño que debe estar **correcto a la vez**, no el más grande que resulta estar **relacionado**.` },
    {
      kind: "quiz",
      question: `Una transacción firmada en Stellar contiene cinco operaciones, y la tercera es la única que te importa. ¿Puede esa operación aplicarse al libro mayor por sí sola?`,
      options: [
        "No — las operaciones se aplican solo a través de su sobre, y toda la transacción tiene éxito o falla como una unidad",
        "Sí — cada operación lleva su propia firma, así que cada una puede actuar de forma independiente",
        "Sí — siempre que pagues una tarifa separada por esa única operación",
      ],
      answer: 0,
      explain: `El sobre es la raíz del agregado: firmas y número de secuencia están vinculados a la transacción, nunca a cada operación. Esto es exactamente lo que hace seguros los swaps atómicos de múltiples operaciones — no existe un mundo donde solo la mitad de una se aplique.`,
    },
    {
      kind: "fill",
      prompt: `Completa la ley del agregado:`,
      file: "NOTES.md",
      before: `Las ops en un sobre `,
      after: ` — la transacción es la unidad de consistencia.`,
      choices: [
        "juntas",
        "de forma independiente",
        "por orden de comisión",
        "por peso de firma",
      ],
      answer: 0,
      explain: `La atomicidad es la promesa completa del agregado. Orden de tarifas y peso de firma son conceptos reales de Stellar — pero deciden *cuándo y si* un sobre se aplica, nunca *qué partes* del mismo se aplican.`,
    },
    { kind: "rustBranch", lessonSlug: "soroban-smart-contracts-1",
      body: `Estas dos formas dejan de ser abstractas en cuanto las almacenas. En el Acto VII de la Campaña, una entidad es lo que recuperas por **clave** en el almacenamiento del contrato, y un objeto de valor es un \`#[contracttype]\` que comparas con \`==\`. Equivocar ese emparejamiento es cómo el mismo activo acaba guardado bajo dos claves.` },
    { kind: "theory", body: `## Dentro de la frontera, ¿dónde vive?

Ya sabes decir, para un contexto: qué tiene identidad, qué es solo su valor, y qué conjunto tiene que moverse a la vez.

Lo que aún no sabes decir es dónde **se sitúa** cada cosa. ¿Conoce el agregado la base de datos? ¿Puede el cliente del libro mayor meter mano en las reglas de dominio? Esas preguntas tienen respuesta, y es siempre la misma.

**A continuación:** la fortaleza, y la única regla que decide hacia dónde puede apuntar cada dependencia.` },
  ],
  testOut: [
    { question: `Dos USDC del mismo emisor. ¿Tiene sentido preguntar "cuál es el original"?`,
      options: ["No — un activo es un objeto de valor; la igualdad es campo a campo y no tiene identidad propia","Sí — cada token lleva un número de serie que los distingue","Solo si están en cuentas distintas"], answer: 0 },
    { question: `Una cuenta paga mil veces. ¿Sigue siendo la misma cuenta?`,
      options: ["Sí — una entidad conserva su identidad mientras su estado cambia por debajo","No — su saldo la define, así que un saldo distinto es otra cuenta","Solo si el número de secuencia no ha dado la vuelta"], answer: 0 },
    { question: `¿Qué hace del sobre de transacción un agregado de manual?`,
      options: ["Es la única puerta: firmas y secuencia se atan al sobre, y su contenido pasa o falla junto","Es el objeto más grande del protocolo, así que contiene todo lo demás","Puede dividirse en sus operaciones cuando solo hace falta una"], answer: 0 },
    { question: `¿Cuál es la forma clásica de dibujar mal un agregado?`,
      options: ["Demasiado grande — la consistencia acaba comprándose con una cola, porque trabajos sin relación compiten por una raíz","Demasiado pequeño — entonces cada regla necesita una transacción entre varias raíces","Sin raíz, así que nada garantiza las invariantes"], answer: 0 },
  ],
};
