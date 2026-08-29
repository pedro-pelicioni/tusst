import type { Concept } from "../types";

export const anatomyOfATransaction: Concept = {
  meta: {
    slug: "anatomy-of-a-transaction",
    title: "Anatomía de una Transacción",
    tagline: "Sobre, operaciones, comisiones, firmas — diseccionadas en vivo.",
    numeral: "II",
    arc: "realm",
    level: 1,
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/anatomy-of-a-transaction.webp",
    glyph: "✉️",
  },
  steps: [
    {
      kind: "theory",
      body: `## El sobre

Todo lo que alguna vez cambia el libro mayor de Stellar viaja dentro de una única forma: un **sobre de transacción**:

- **Cuenta origen** — quién actúa (y paga la comisión).
- **Número de secuencia** — el contador de transacciones de esta cuenta.
- **Comisión** — lo que ofreces para que sea incluida.
- **Operaciones** — los verbos reales (de 1 a 100).
- **Firmas** — prueba de que el origen (y cualquiera más requerido) está de acuerdo.

Aprende esta única forma y cada página del explorador, llamada SDK y error de transacción fallida en Stellar se volverán legibles.`,
    },
    {
      kind: "diagram",
      body: "El envelope, abierto:",
      caption: "La firma cubre el envelope entero. Cambia un byte ahí dentro y todas las firmas dejan de coincidir.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "source",
            label: "cuenta de origen",
            note: "Quién paga la comisión, y de quién avanza el número de secuencia.",
            tone: "neutral",
          },
          {
            id: "fee",
            label: "comisión",
            note: "100 stroops por operación: una cienmilésima de XLM cada una.",
            tone: "gold",
          },
          {
            id: "seq",
            label: "número de secuencia",
            note: "Usado exactamente una vez, para siempre. Eso hace imposible un replay.",
            tone: "accent",
          },
          {
            id: "ops",
            label: "operaciones",
            note: "Hasta 100, aplicadas en orden. Entran todas, o no entra ninguna.",
            tone: "teal",
            bands: [
              {
                id: "op1",
                label: "pago",
                note: "Mueve un activo de una cuenta a otra.",
                tone: "teal",
              },
              {
                id: "op2",
                label: "abrir trustline",
                note: "Abre la línea de confianza que permite al destino tenerlo.",
                tone: "teal",
              },
            ],
          },
          {
            id: "sigs",
            label: "firmas",
            note: "Una por firmante exigido. Cualquiera las comprueba contra la dirección de origen; nadie las falsifica.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Operaciones: los verbos

Una **operación** es un verbo atómico: \`payment\`, \`create_account\`, \`change_trust\`, \`manage_sell_offer\`, \`invoke_host_function\` (la que llama a contratos inteligentes)… hay ~26 de ellas.

Un solo sobre puede contener **varias operaciones**, y se aplican **átomicamente**: crear una cuenta *y* financiarla *y* abrir su línea de confianza en un solo paso — o no ocurre nada.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Ya has visto estos verbos en la práctica — o estás a punto de hacerlo. El laboratorio **Tu Primera Billetera** de la Forja ejecuta \`create_account\`, \`change_trust\` y \`payment\` con tu propia firma en la testnet real. La teoría se entiende mejor con los hashes de tus propias transacciones.`,
    },
    {
      kind: "quiz",
      question: `Tu sobre lleva tres operaciones: un pago, una línea de confianza y un segundo pago que resulta estar sin fondos. ¿Qué se registra en el libro mayor?`,
      options: [
        "Nada — una operación fallida invalida toda la transacción",
        "Las dos primeras operaciones — falla a partir de la tercera",
        "Las tres — los fallos se registran como advertencias",
      ],
      answer: 0,
      explain: `La atomicidad es la clave: una transacción es todo o nada, por eso los procesos de varios pasos (crear + financiar + confiar) son seguros de agrupar.`,
    },
    {
      kind: "theory",
      body: `## Números de secuencia: sin repeticiones, sin carreras

Cada cuenta lleva un contador. Una transacción debe indicar \`actual + 1\`, y el libro mayor lo incrementa al incluirla — así:

- una transacción firmada **nunca puede reproducirse** (su número ya está gastado),
- dos transacciones de la misma cuenta **no pueden competir** por el mismo espacio.

¿Ese error "tx_bad_seq" que todo desarrollador de Stellar encuentra eventualmente? Simplemente significa *alguien más movió tu contador primero — vuelve a crearla y firma de nuevo.*`,
    },
    {
      kind: "fill",
      prompt: `Ordena el ciclo de vida — ¿qué ocurre entre construir y enviar?`,
      file: "lifecycle.txt",
      before: `construir el sobre  →  `,
      after: `  →  enviar  →  cierre del libro`,
      choices: ["firmarlo", "minarlo", "notarizarlo", "apostarlo"],
      answer: 0,
      explain: `Construir, **firmar**, enviar, cerrar — alrededor de cinco segundos de extremo a extremo. No hay minería, no hay esperas de confirmaciones múltiples: un cierre de libro es la finalización.`,
    },
    {
      kind: "quiz",
      question: `¿Por qué la red cobra una comisión (100 stroops = 0.00001 XLM) por operación?`,
      options: [
        "Para que el spam sea costoso a gran escala sin ser perceptible para los humanos",
        "Para pagar a los validadores un salario — es su modelo de negocio",
        "Para subvencionar al Friendbot",
      ],
      answer: 0,
      explain: `Las comisiones en Stellar son un limitador de velocidad, no una fuente de ingresos — las comisiones recaudadas son recicladas por el protocolo. Un millón de transacciones basura costarían dinero real; tu pago solo cuesta un error de redondeo.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `En el Acto VII de la Campaña, el mismo sobre lleva \`invoke_host_function\` — y la carga útil de la operación es **tu propio Rust**. Cuando estés listo para forjar los verbos tú mismo, la puerta está aquí.`,
    },
  ],
};
