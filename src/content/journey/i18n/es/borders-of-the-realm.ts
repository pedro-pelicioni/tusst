import type { Concept } from "../types";

export const bordersOfTheRealm: Concept = {
  meta: {
    slug: "borders-of-the-realm",
    title: "Fronteras del Reino",
    tagline: "DDD y contextos limitados, mapeados sobre Stellar mismo.",
    numeral: "III",
    arc: "craft",
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/borders-of-the-realm.webp",
    glyph: "🗺",
  },
  steps: [
    {
      kind: "theory",
      body: `## Una palabra, tres significados

Pregunta a tres equipos en Stellar qué es una **Cuenta**:

- Equipo *wallet*: "un titular de saldo — alguien que posee lumens y activos."
- Equipo *anchor*: "un sujeto KYC — alguien que debemos identificar antes de mover dinero."
- Equipo *exchange*: "un participante del libro de órdenes — alguien con ofertas abiertas."

Misma palabra. Mismo G‑address, incluso. **Tres modelos diferentes.** La mayoría de los “bugs de mala comunicación” son exactamente esto: dos personas usan una palabra para dos conceptos, cada una segura de que la otra está de acuerdo.

El Diseño Dirigido por el Dominio comienza aquí: haz que el lenguaje sea preciso *a propósito*.`,
    },
    {
      kind: "theory",
      body: `## Lenguaje ubicuo, contextos limitados

Dentro de un equipo y una parte del sistema, DDD exige un **lenguaje ubicuo**: una palabra, un significado, usado *en todas partes* — conversación, especificación y código. Si la spec dice "release", la función es \`release\`, no \`transfer_out\`.

Pero ningún lenguaje rige todo el reino. Un **contexto limitado** es la frontera donde el significado de una palabra puede cambiar: dentro de *Payments*, una Cuenta es un titular de saldo; al cruzar a *Compliance*, la misma dirección es un sujeto KYC.

La frontera no es un fallo de diseño. **La frontera es el diseño.**`,
    },
    {
      kind: "quiz",
      question: `El equipo de Compliance te pide añadir \`kyc_status\` y \`risk_score\` al modelo de Cuenta del contexto Payments — “es la misma cuenta, al fin y al cabo”. ¿Cuál es la lectura DDD?`,
      options: [
        "Mantener modelos separados detrás de fronteras distintas, enlazados por la dirección de la cuenta — cada contexto modela solo lo que necesita",
        "Fusionarlos — un modelo de Cuenta compartido para todo el sistema evita duplicación, que es el mayor mal",
        "Añadir los campos pero marcarlos opcionales, de modo que el código de Payments simplemente los ignore",
      ],
      answer: 0,
      explain: `Un modelo compartido hace que cada contexto acumule campos y reglas hasta que ninguno pueda moverse sin romper a otro. Dos modelos ligeros que comparten un ID no son duplicación — son dos verdades sobre una misma dirección, cada una poseída donde se entiende.`,
    },
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
    {
      kind: "theory",
      body: `## Agregados: la regla del sobre

Algunos objetos solo tienen sentido **juntos**, protegidos por una raíz que impone las reglas. Ese conjunto es un **agregado**.

Stellar te brinda un espécimen perfecto: el **sobre de transacción**. Las operaciones viven *dentro* de una transacción — firmadas juntas, secuenciadas juntas, y **todas tienen éxito o fallan juntas**. No puedes extraer la operación #3 y aplicarla sola; el sobre es la única puerta, y contiene las firmas y el número de secuencia.

Ese es el patrón de agregado en producción: la consistencia se impone *en la frontera*, de modo que nada dentro pueda quedar a medio aplicar.`,
    },
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
    {
      kind: "theory",
      body: `## Puentes entre contextos: el anchor

Los contextos aún deben comunicarse. **Mapeo de contextos** es nombrar las fronteras y construir puentes deliberados — traducción en el borde, de modo que el lenguaje de un lado no se filtre al otro.

Los **anchors** de Stellar son este patrón con un modelo de negocio. En un lado: el *contexto bancario* — IBANs, días hábiles, retenciones de cumplimiento. En el otro: el *contexto de libro mayor* — líneas de confianza, activos, finalidad de 5 segundos. El anchor **traduce**: una transferencia entrante se convierte en tokens emitidos; un token redimido se convierte en un pago bancario.

Ningún mundo tuvo que adoptar el modelo del otro. Esa es una frontera saludable: cruzada por traducción, nunca por filtración.`,
    },
    {
      kind: "theory",
      body: `## Por qué el golem necesita tu mapa

Un LLM ha leído millones de bases de código donde "account", "transfer" y "balance" significan cosas distintas. Si dejas tus fronteras sin declarar, él **mezclará vocabularios a mitad de archivo** — una regla KYC que se cuela en tu modelo de pagos, la idea de Cuenta de un exchange que se filtra en tu wallet — cada línea parece plausible localmente.

Así que escribe la frontera en la mesa: *"Estamos en el contexto Payments. Cuenta significa titular de saldo. Compliance es un modelo separado — refiérete a él solo por dirección."* Un contexto declarado es una valla que el golem respeta.

Siguiente disciplina: dentro de un contexto, ¿dónde vive cada pieza? Entra la fortaleza.`,
    },
  ],
};
