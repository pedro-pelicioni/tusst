import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "El Destino de un Sobre",
  tagline: "Secuencia, comisiones y el ciclo de vida de la transacción: enviada, incluida, fallida, cobrada.",
  steps: [
    {
      kind: "theory",
      body: `## El contador que impide repeticiones

Cada cuenta lleva un número de secuencia. Una transacción debe declarar \`actual + 1\`, y el libro mayor lo incrementa al incluirla — así una transacción firmada **nunca puede repetirse** (su número ya está gastado), y dos transacciones de la misma cuenta **no pueden competir** por el mismo hueco.

Esto último tiene un filo práctico. Si tu backend firma dos transacciones de la misma cuenta en el mismo instante, ambas reclaman \`actual + 1\` — y gana exactamente una. La otra vuelve con \`tx_bad_seq\`, que *no* significa "mal formada"; significa *alguien movió tu contador primero — reconstruye y vuelve a firmar*.

El arreglo habitual no es un bucle de reintentos. Es una **cuenta canal**: una cuenta aparte que aporta números de secuencia, para que el trabajo en paralelo nunca pelee por un único contador.`,
    },
    {
      kind: "quiz",
      question: `Dos servidores firman un pago desde la misma cuenta en el mismo segundo. Ambos se envían. ¿Qué ocurre?`,
      options: [
        "Uno se incluye; el otro es rechazado con tx_bad_seq y hay que reconstruirlo",
        "Ambos se incluyen — el libro mayor los ordena automáticamente",
        "Ambos son rechazados, porque la cuenta queda bloqueada mientras hay una transacción pendiente",
      ],
      answer: 0,
      explain: `El contador es el árbitro. Nada queda "bloqueado" y nada se encola por ti — el segundo sobre nombra un número de secuencia que ya no es el siguiente, y se le da la vuelta. Reconstruir es el arreglo; una cuenta canal es la cura.`,
    },
    {
      kind: "fill",
      prompt: `Pon el ciclo de vida en orden — ¿qué ocurre entre construir y enviar?`,
      file: "lifecycle.txt",
      before: `construir el sobre  →  `,
      after: `  →  enviar  →  cierre del ledger`,
      choices: ["firmarlo", "minarlo", "notarizarlo", "apostarlo"],
      answer: 0,
      explain: `Construye, **firma**, envía, cierra — unos cinco segundos de punta a punta. Sin minería y sin esperar varias confirmaciones: un cierre de ledger ya es la finalidad.`,
    },
    {
      kind: "diagram",
      body: "Los cinco segundos, etapa por etapa:",
      caption:
        "La firma ocurre en tu máquina, sin conexión. Tu clave secreta nunca viaja — solo el sobre terminado.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "build",
            label: "construir",
            note: "Ensambla origen, secuencia, comisión y operaciones. Nada ha salido de tu máquina.",
            tone: "neutral",
          },
          {
            id: "sign",
            label: "firmar",
            note: "Cada firmante requerido sella el sobre localmente. Las claves secretas se quedan donde están.",
            tone: "accent",
          },
          {
            id: "submit",
            label: "enviar",
            note: "Va a un endpoint RPC u Horizon, que lo reenvía a los validadores.",
            tone: "teal",
          },
          {
            id: "validate",
            label: "validar",
            note: "Se comprueban firmas, secuencia y comisión. Falla aquí y nunca llega al libro mayor.",
            tone: "gold",
          },
          {
            id: "close",
            label: "cierre del ledger",
            note: "~5 segundos. Un cierre es la finalidad — no hay una segunda confirmación que esperar.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## El error que todo el mundo comete una vez

"Mi transacción falló, así que no pasó nada y no me costó nada."

La mitad de eso suele ser falso, porque **dos cosas muy distintas se llaman "fallo"**:

- **Rechazada en la puerta.** Firma mala, secuencia mala, comisión demasiado baja. El sobre nunca entra. No se cobra nada, no se registra nada, tu contador no se mueve.
- **Falló dentro del ledger.** El sobre era válido, así que *fue* incluido — y entonces una operación no funcionó. Sus **efectos** se revierten todos, pero la transacción queda escrita en la historia como fallo, **la comisión se consume y el número de secuencia se gasta.**`,
    },
    {
      kind: "diagram",
      body: "Dos palabras que suenan ambas a fallo:",
      caption:
        "La diferencia es si el sobre llegó a ser válido. Válido pero condenado te cuesta igual.",
      view: {
        kind: "compare",
        columns: [
          { id: "rejected", label: "rechazada en la puerta", tone: "neutral" },
          { id: "failed", label: "falló en el ledger", tone: "bad" },
        ],
        rows: [
          {
            label: "código típico",
            cells: [
              { text: "tx_bad_seq, tx_bad_auth", tone: "neutral" },
              { text: "op_underfunded, op_no_trust", tone: "bad" },
            ],
          },
          {
            label: "escrita en la historia",
            cells: [
              { text: "no", tone: "good" },
              { text: "sí, marcada como fallo", tone: "bad" },
            ],
          },
          {
            label: "comisión cobrada",
            cells: [
              { text: "no", tone: "good" },
              { text: "sí", tone: "bad" },
            ],
          },
          {
            label: "número de secuencia",
            cells: [
              { text: "intacto", tone: "good" },
              { text: "gastado — hay que reconstruir", tone: "bad" },
            ],
          },
        ],
      },
    },
    {
      kind: "fill",
      prompt: `Completa la regla que pilla a casi todo el mundo una vez:`,
      file: "NOTES.md",
      before: `Una transacción lo bastante válida como para ser incluida, pero cuya operación falló, queda escrita en el libro mayor como fallo — y su comisión `,
      after: ` .`,
      choices: [
        "se cobra igualmente",
        "se devuelve automáticamente",
        "no se cobra nunca",
        "solo se cobra en el reintento",
      ],
      answer: 0,
      explain: `Lo que cuesta es ser incluida, no salir bien. La consecuencia práctica: un bucle de reintentos que trata todos los errores igual reenviará alegremente un sobre que ya quemó su número de secuencia. Lee el código antes de reintentar.`,
    },
    {
      kind: "theory",
      body: `## Comisiones: un limitador de caudal, no una fuente de ingresos

La comisión base es de **100 stroops por operación** — 0,00001 XLM, un redondeo para un humano, dinero de verdad para un millón de sobres basura. Esa asimetría *es* el diseño.

- **Ofreces un máximo, pagas el mínimo.** La comisión que fijas es un techo. Cuando el ledger tiene sitio se te cobra la comisión base por muy alto que hayas ofertado; solo cuando la demanda supera la capacidad el precio de pico llena el ledger por puja.
- **Puede pagar otra persona.** Una **transacción fee-bump** envuelve un sobre ya firmado y pone a otra cuenta en la factura, sin invalidar ni una sola firma existente. Así es como una app patrocina a un usuario que no tiene ni un XLM.`,
    },
    {
      kind: "quiz",
      question: `¿Por qué la red cobra una comisión (100 stroops = 0,00001 XLM) por operación?`,
      options: [
        "Para que el spam salga caro a escala mientras permanece invisible para los humanos",
        "Para pagar un sueldo a los validadores — es su modelo de negocio",
        "Para subvencionar al Friendbot",
      ],
      answer: 0,
      explain: `Las comisiones en Stellar son un limitador de caudal, no una fuente de ingresos — los validadores no reciben ni recompensa de bloque ni renta por comisiones. Nadie corre un validador por los ingresos, y eso explica que la comisión pueda seguir siendo tan pequeña.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `En el Acto VII de la Campaña, el mismo sobre lleva \`invoke_host_function\` — y la carga útil de la operación es **tu propio Rust**. Todo lo de aquí le sigue aplicando: mismo contador, mismo ciclo de vida, misma distinción entre rechazada y fallida.`,
    },
  ],
  testOut: [
    { question: `¿Qué impide el número de secuencia?`,
      options: ["Que una transacción firmada se repita, y que dos transacciones compitan por el mismo hueco","Que la comisión se cobre dos veces en un reintento","Que una cuenta guarde más de un activo a la vez"], answer: 0 },
    { question: `Tu transacción vuelve rechazada con tx_bad_seq. ¿Qué te costó?`,
      options: ["Nada — nunca entró en el libro mayor, así que ni comisión ni contador se movieron","La comisión, porque la red igual tuvo que comprobarla","La comisión y el número de secuencia, igual que cualquier otro fallo"], answer: 0 },
    { question: `Una transacción se incluye, pero su pago resulta no tener fondos. ¿Qué se gastó?`,
      options: ["La comisión y el número de secuencia, aunque no se movió nada","Nada — efectos revertidos significan transacción revertida","Solo el número de secuencia; las comisiones se devuelven al fallar"], answer: 0 },
    { question: `Una app quiere incorporar a un usuario que no tiene ni un XLM. ¿Qué lo hace posible?`,
      options: ["Una transacción fee-bump, que pone a otra cuenta en la factura sin tocar las firmas existentes","Poner la comisión a cero para cuentas nuevas","El Friendbot, que paga comisiones en mainnet a los usuarios primerizos"], answer: 0 },
  ],
};
