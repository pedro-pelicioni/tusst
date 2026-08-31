import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Anatomía de una Transacción",
  tagline: "Una sola forma carga todo lo que cambia el libro mayor.",
  steps: [
    {
      kind: "theory",
      body: `## El sobre

Todo lo que alguna vez cambia el libro mayor de Stellar viaja dentro de una única forma: un **sobre de transacción**:

- **Cuenta origen** — quién actúa (y paga la comisión).
- **Número de secuencia** — el contador de transacciones de esta cuenta.
- **Comisión** — lo que ofreces para que sea incluida.
- **Operaciones** — los verbos de verdad (de 1 a 100).
- **Firmas** — prueba de que el origen (y quien más haga falta) estuvo de acuerdo.

No hay una segunda forma. Un pago, la emisión de un token, la llamada a un contrato inteligente, una operación en el DEX — todos son este sobre con verbos distintos dentro. Apréndelo una vez y cada página del explorador y cada llamada del SDK en Stellar se vuelven legibles en el mismo momento.`,
    },
    {
      kind: "diagram",
      body: "El sobre, abierto:",
      caption:
        "La firma cubre el sobre entero. Cambia un byte ahí dentro y todas las firmas dejan de coincidir.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "source",
            label: "cuenta origen",
            note: "Quién paga la comisión, y de quién avanza el número de secuencia.",
            tone: "neutral",
          },
          {
            id: "fee",
            label: "comisión",
            note: "100 stroops por operación — una cienmilésima de XLM cada una.",
            tone: "gold",
          },
          {
            id: "seq",
            label: "número de secuencia",
            note: "Usado exactamente una vez, para siempre. Es lo que hace imposible un replay.",
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
                note: "Abre la línea de confianza que permite al destino guardar el activo.",
                tone: "teal",
              },
            ],
          },
          {
            id: "sigs",
            label: "firmas",
            note: "Una por firmante requerido. Cualquiera las verifica contra la dirección de origen — nadie las falsifica.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Operaciones: los verbos

Una **operación** es un verbo atómico. Hay unas 26, en unas pocas familias:

- **Mover valor** — \`payment\`, \`path_payment_strict_send\`, \`create_account\`.
- **Guardar valor** — \`change_trust\`, \`set_trust_line_flags\`, \`clawback\`.
- **Negociar** — \`manage_sell_offer\`, \`liquidity_pool_deposit\`.
- **Gobernar la cuenta** — \`set_options\`, \`manage_data\`, \`account_merge\`.
- **Llamar código** — \`invoke_host_function\`, la que alcanza un contrato inteligente.

Un detalle que a casi todo el mundo se le escapa durante meses: **cada operación puede nombrar su propia cuenta origen**, distinta de la del sobre. Ese único campo es lo que hace posible la página siguiente.`,
    },
    {
      kind: "quiz",
      question: `Tu sobre lleva tres operaciones: un pago, una línea de confianza y un segundo pago que resulta no tener fondos. ¿Qué queda registrado en el libro mayor?`,
      options: [
        "Nada — una operación fallida invalida toda la transacción",
        "Las dos primeras operaciones — falla a partir de la tercera",
        "Las tres — los fallos se registran como advertencias",
      ],
      answer: 0,
      explain: `La atomicidad es la clave: una transacción es todo o nada, por eso las configuraciones de varios pasos (crear + fondear + confiar) son seguras de agrupar.`,
    },
    {
      kind: "theory",
      body: `## Un sobre, tres verbos, dos firmantes

Ana quiere traer a Bruno a Stellar y entregarle 50 USDC. Mira cómo cabe todo en un único sobre:

- **Origen:** Ana. Su número de secuencia avanza; ella paga la comisión.
- **Op 1 —** \`create_account\`, destino Bruno, saldo inicial de **2 XLM**.
- **Op 2 —** \`change_trust\` para USDC, **origen: Bruno**. Una trustline pertenece a quien la guarda, así que esta operación es de Bruno, no de Ana.
- **Op 3 —** \`payment\`, 50 USDC a Bruno.

**Comisión:** 3 operaciones × 100 stroops = **300 stroops**, o 0,00003 XLM.

¿Y los 2 XLM de Bruno? Una cuenta cuesta 2 reservas base, una trustline cuesta 1 más, a 0,5 XLM cada una: **1,5 XLM bloqueados**, 0,5 XLM libres. Las reservas no son una comisión — se le devuelven si algún día cierra la trustline.`,
    },
    {
      kind: "quiz",
      question: `En ese sobre, ¿por qué tiene que firmar Bruno, si solo está recibiendo?`,
      options: [
        "Porque la op 2 abre *su* trustline, y una operación la autoriza su propia cuenta origen",
        "Porque toda cuenta nombrada en cualquier parte de la transacción debe firmarla",
        "Porque el pago es mayor que su saldo inicial",
      ],
      answer: 0,
      explain: `Recibir nunca exige tu firma — pero abrir la trustline que te permite recibir, sí. Envía ese sobre sin la firma de Bruno y la red responde \`tx_bad_auth\`: no ocurre nada en absoluto, ni siquiera la op 1.`,
    },
    {
      kind: "fill",
      prompt: `Completa la regla que hace seguro agrupar:`,
      file: "NOTES.md",
      before: `Un sobre, hasta 100 operaciones, aplicadas en orden — y si cualquiera de ellas falla, `,
      after: ` .`,
      choices: [
        "ninguna surte efecto",
        "las demás sí surten efecto",
        "la que falló se omite",
        "la red lo reintenta automáticamente",
      ],
      answer: 0,
      explain: `Todo o nada. Por eso "crear la cuenta *y* abrir su trustline *y* fondearla" es un solo sobre y no tres pasos esperanzados — no existe un estado en el que Bruno exista pero no pueda guardar lo que le enviaste.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Ese sobre no es hipotético. El laboratorio **Tu Primera Billetera** de la Forja ejecuta \`create_account\`, \`change_trust\` y \`payment\` con tu propia firma en la testnet real — los mismos tres verbos, con el hash de tu transacción al final.`,
    },
    {
      kind: "theory",
      body: `## Lo que ya sabes leer

Origen, secuencia, comisión, operaciones, firmas. Puedes mirar cualquier transacción en cualquier explorador de Stellar y nombrar cada parte, y sabes por qué una configuración de varios pasos es segura de agrupar.

**A continuación:** ya construyes un sobre válido — pero lo que ocurre después de pulsar enviar es una historia aparte. Por qué una transacción es rechazada en la puerta mientras otra queda escrita en la historia como fallo *y encima se le cobra por ello* es el próximo capítulo.`,
    },
  ],
  testOut: [
    { question: `¿Cuántas formas distintas pueden llevar un cambio al libro mayor de Stellar?`,
      options: ["Una — un pago, una operación en el DEX y una llamada a contrato son el mismo sobre con verbos distintos","Tres — una para pagos, una para trading, una para contratos","Una por tipo de operación, unas 26"], answer: 0 },
    { question: `Una operación dentro de tu sobre nombra una cuenta origen distinta de la del sobre. ¿Qué se sigue de eso?`,
      options: ["Esa cuenta también tiene que firmar el sobre","La operación se aplica en nombre del origen del sobre igualmente","El sobre se rechaza — las operaciones deben compartir el origen del sobre"], answer: 0 },
    { question: `Un sobre lleva cuatro operaciones y la tercera falla. ¿Qué queda en el libro mayor?`,
      options: ["Ninguna de las cuatro surte efecto","Las dos primeras — el sobre se detiene donde se rompió","Las cuatro, con la tercera marcada como advertencia"], answer: 0 },
    { question: `¿Con qué escala la comisión?`,
      options: ["Con el número de operaciones del sobre","Con la cantidad de valor que se mueve","Con el tiempo que el sobre lleva esperando a ser incluido"], answer: 0 },
  ],
};
