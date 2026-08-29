import type { Concept } from "../types";

export const riversOfValue: Concept = {
  meta: {
    slug: "rivers-of-value",
    title: "Ríos de Valor",
    tagline: "Pagos, pagos encadenados, el DEX y los AMM.",
    numeral: "IV",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/rivers-of-value.webp",
    glyph: "🌊",
  },
  steps: [
    {
      kind: "theory",
      body: `## Ríos, no bóvedas

Ya diseccionaste un simple \`payment\`: un activo, de A a B, finaliza en ~5 segundos. Eso es un canal — recto, útil, aburrido.

La parte interesante es que el libro mayor de Stellar no es solo una bóveda de saldos. Lleva un **intercambio de divisas completo dentro del protocolo**: libros de órdenes, pools de liquidez y operaciones de pago que *comercian mientras viajan*.

Sin intercambio externo, sin puente, sin desvío envuelto — la conversión es una capacidad nativa del libro mayor. Este capítulo sigue el agua: primero las ofertas, luego los pools, y después la operación que hace que las remesas parezcan magia.`,
    },
    {
      kind: "theory",
      body: `## Un libro de órdenes *en* el libro mayor

El **Stellar DEX** no es un contrato desplegado por alguien — es la maquinaria del protocolo.

- \`manage_sell_offer\` / \`manage_buy_offer\` colocan una oferta: *"Doy X, quiero Y, a este precio."*
- Cada oferta es una **entrada del libro mayor**, situada en el libro de órdenes como cualquier otro estado.
- **El emparejamiento ocurre al cerrar el libro mayor**: cuando las ofertas se cruzan, el protocolo ejecuta la operación como parte del consenso mismo.

Cada par de activos obtiene automáticamente un libro de órdenes — sin listados, sin permiso de un operador de mercado. Dos líneas de confianza y una oferta, y tú *eres* el mercado.`,
    },
    {
      kind: "quiz",
      question: `¿Quién empareja una oferta de compra con una oferta de venta en el Stellar DEX?`,
      options: [
        "El propio protocolo, al cerrar el libro mayor — las ofertas son entradas del libro mayor y el emparejamiento forma parte del consenso",
        "Un contrato inteligente de motor de emparejamiento mantenido por la SDF",
        "Relayers fuera de cadena que envían pares emparejados a cambio de una comisión",
      ],
      answer: 0,
      explain: `Esta es la rara cadena donde el intercambio vive *dentro* del protocolo. No hay un matcher desplegado, por lo que no hay matcher que hackear, sobornar o rug‑ear — y las operaciones se liquidan con la misma finalidad que los pagos.`,
    },
    {
      kind: "theory",
      body: `## Pools: el agua estancada

Los libros de órdenes necesitan traders activos cotizando precios. **Los pools de liquidez** solo requieren depósitos:

- Cualquiera deposita un par de activos en un **pool de producto constante** — la misma curva x · y = k que popularizó Uniswap.
- Las operaciones empujan la razón; el arbitraje la devuelve; los depositantes ganan una pequeña comisión en cada intercambio.
- En Stellar estos pools son **entradas nativas del libro mayor** — no contratos — gestionados con \`liquidity_pool_deposit\` y \`liquidity_pool_withdraw\`.

Los libros y los pools coexisten en igualdad de condiciones, y — como verás — un solo pago puede beber de ambos.`,
    },
    {
      kind: "quiz",
      question: `¿En qué se diferencian los pools de liquidez nativos de Stellar de los AMM al estilo Uniswap?`,
      options: [
        "Son características del protocolo — entradas del libro mayor gestionadas por operaciones, no contratos desplegados",
        "Utilizan emparejamiento de libro de órdenes internamente en lugar de una curva de precios",
        "Solo admiten pares que incluyan XLM",
      ],
      answer: 0,
      explain: `Misma matemática de producto constante, diferente hogar: el pool vive en el propio protocolo, cualquier par de activos es bienvenido. También existen AMM basados en contratos, una capa más arriba — conocerás sus nombres pronto.`,
    },
    {
      kind: "theory",
      body: `## Pagos encadenados: la característica estrella

\`path_payment_strict_send\` hace algo que casi ninguna otra cadena hace de forma nativa: **enviar un activo y entregar otro** — de forma atómica, en una sola operación.

Envías USDC. La red lo enruta a través de libros de órdenes y pools de liquidez — quizá USDC → XLM → EURC — y tu abuela recibe EURC. Una transacción. Si no hay una ruta que entregue dentro de tus límites, **no ocurre nada**: no quedan fondos atrapados a medio intercambio.

Dos variantes:

- **Strict send** — fijar lo que pagas; el destinatario recibe lo que la ruta produce (por encima de tu mínimo).
- **Strict receive** — fijar lo que recibe; pagas lo que cuesta (por debajo de tu máximo).`,
    },
    {
      kind: "diagram",
      body: "Un pago, tres monedas, una transacción atómica:",
      caption: "Si algún salto no cierra al precio que fijaste, no pasa nada — ningún dinero a medio convertir varado por el camino.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "send",
            label: "tú envías BRL",
            note: "Nunca tocas las monedas intermedias, y nunca las tienes.",
            tone: "accent",
          },
          {
            id: "hop1",
            label: "BRL → XLM",
            note: "El libro de órdenes cierra este salto a lo que ofrezca el mercado ahora.",
            tone: "teal",
          },
          {
            id: "hop2",
            label: "XLM → EURC",
            note: "Y el siguiente, en el mismo instante, dentro de la misma transacción.",
            tone: "teal",
          },
          {
            id: "recv",
            label: "recibe EURC",
            note: "Cantidad garantizada, o todo revierte. No hay llegada parcial.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Una factura es exactamente 900 EURC y tu tesorería tiene USDC. ¿Qué operación encaja?`,
      options: [
        "path_payment_strict_receive — fijar los 900 EURC entregados, limitar los USDC que gastarás",
        "path_payment_strict_send — enviar alrededor de 900 USDC y esperar que la tasa quede cerca del equilibrio",
        "Dos transacciones: intercambiar USDC por EURC en el DEX, luego un pago simple",
      ],
      answer: 0,
      explain: `Strict receive existe precisamente para los casos de "la factura está fija". Y una operación atómica supera a swap‑luego‑envío: no hay deslizamiento de precio entre pasos, no queda polvo residual, no hay estado a medio completar que limpiar.`,
    },
    {
      kind: "fill",
      prompt: `Dibuja el río — ¿qué ocurre entre el envío y la entrega en un pago encadenado?`,
      file: "remittance.txt",
      before: `enviar 100 USDC  →  `,
      after: `  →  entregar EURC — una transacción atómica`,
      choices: [
        "ruta a través de libros de órdenes y pools de liquidez",
        "puente a través de tokens envueltos en otra cadena",
        "cola en el escritorio de FX de un ancla para la conversión",
        "subasta del pago a bots creadores de mercado",
      ],
      answer: 0,
      explain: `El enrutamiento es on‑ledger y atómico: el protocolo recorre ofertas y pools para encontrar la entrega, y o bien todo el camino se ejecuta al cerrar el libro mayor o no ocurre nada.`,
    },
    {
      kind: "theory",
      body: `## Por qué los constructores de remesas vienen aquí

Los rieles antiguos: una transferencia transfronteriza salta entre bancos corresponsales durante **2–5 días** y pierde algunos porcentajes en comisiones en el camino.

El río: los dólares se convierten en USDC en un extremo, un **pago encadenado** los convierte y entrega EURC en unos **cinco segundos** por una comisión medida en fracciones de centavo, y los euros salen por el otro extremo.

La conversión FX — históricamente la parte cara y opaca — se vuelve un salto transparente a través de libros de órdenes y pools públicos. La liquidación multimoneda en segundos es el caso de uso al que Stellar apuntó desde el primer día.`,
    },
    {
      kind: "theory",
      body: `## La capa encima del río

Sobre la maquinaria nativa, el ecosistema construye en Soroban: **Soroswap**, **Phoenix** y **Aquarius** ejecutan protocolos AMM como contratos inteligentes, y los agregadores enrutan cada operación a través de libros nativos, pools nativos y pools de contrato buscando el mejor precio. No necesitas sus internos todavía — solo sabe que el río tiene una base sólida y un puerto activo construido encima.

Una pregunta queda abierta: ¿dónde entran y salen los *verdaderos* dólares y euros? Eso es negocio de los anclajes — las puertas del reino, y el próximo capítulo.`,
    },
  ],
};
