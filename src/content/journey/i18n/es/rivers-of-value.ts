import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Ríos de Valor",
  tagline: "Una casa de cambio viviendo dentro del propio protocolo.",
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
    { kind: "theory", body: `## La misma orden, dos lugares

Libros y pools no son rivales con un ganador. Fallan en direcciones opuestas, y el libro mayor lleva ambos a propósito.

Digamos que quieres 5.000 USDC en XLM.

**El libro de órdenes** te llena contra lo que la gente realmente publicó. Si un creador de mercado cotiza ajustado, te llevas un precio que nadie batiría — ofertas reales, precios reales, sin curva. Si nadie mira ese par esta mañana, el libro está delgado o vacío, y llenas mal o no llenas. La calidad de un libro es la atención de alguien.

**El pool** siempre cotiza. No tiene opinión, ni horario, ni día libre — la curva pone precio a tu orden esté alguien despierto o no. Lo que cobra por esa fiabilidad es slippage: pagas por el privilegio de poder operar a las tres de la madrugada contra nadie.

Así que el resumen honesto es aburrido: **el libro es mejor cuando alguien lo cuida, y el pool es mejor cuando nadie lo hace.** Justo por eso existen los agregadores, y por eso no deberías estar eligiendo el lugar a mano.` },
    { kind: "widget", component: "amm-pool",
      body: `La curva se siente mejor de lo que se lee. **Vende dentro del pool** — luego lleva la misma orden a uno menos profundo y mira lo que el precio te hace.` },
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
    { kind: "fill",
      prompt: `Completa lo que un pool de producto constante promete de verdad:`,
      file: "NOTES.md",
      before: `Un pool siempre te cotizará un precio. Lo que no promete es que el precio se quede quieto — cuanto mayor sea tu orden respecto al pool, `,
      after: ` .`,
      choices: ["peor el precio que acabas pagando", "menor la comisión que te cobran", "más tarda en liquidarse", "más probable que la orden sea rechazada"],
      answer: 0,
      explain: `El pool no puede agotarse ni puede rechazarte — ese es todo el sentido de la curva. Lo que hace en cambio es cobrarte más por cada unidad conforme drenas un lado, así que una orden grande en un pool pequeño se completa perfectamente y cara.` },
    { kind: "theory", body: `## Nunca vas a hacer esto a mano

Ya sabes que hay un mercado dentro del libro mayor: libros que casan al cierre, pools que cotizan desde una curva, y un precio que se mueve cuando te apoyas en él.

Y aquí está lo que lo hace útil: **casi nunca vas a interactuar con nada de eso directamente.** No vas a colocar una oferta, ni recorrer el libro, ni elegir un pool. Vas a declarar qué envías y qué debe llegar — y otra cosa hará la compra.

**A continuación:** la operación que gasta toda esa maquinaria en tu nombre, en un único paso atómico.` },
  ],
  testOut: [
    { question: `¿Quién casa una oferta de compra con una de venta en el DEX de Stellar?`,
      options: ["El propio protocolo, al cierre del ledger — las ofertas son entradas del libro mayor y el casamiento forma parte del consenso","Un contrato de motor de casamiento mantenido por la SDF","Relayers fuera de la cadena que envían pares casados a cambio de una parte"], answer: 0 },
    { question: `¿Qué hace falta para crear mercado para un nuevo par de activos en el DEX?`,
      options: ["Dos trustlines y una oferta — todo par obtiene un libro automáticamente, sin listado ni permiso","Una solicitud a la SDF, que cura qué pares son negociables","Desplegar un contrato de mercado para ese par"], answer: 0 },
    { question: `Un libro de órdenes necesita traders activos cotizando. ¿Qué necesita en cambio un pool de liquidez?`,
      options: ["Solo depósitos — la curva de producto constante cotiza un precio en todo momento sin que nadie mire","Un bot creador de mercado, al que el pool paga con las comisiones","Un oráculo que le alimente el precio externo actual"], answer: 0 },
    { question: `Tu orden es grande respecto al pool. ¿Qué pasa?`,
      options: ["Se completa, a un precio progresivamente peor — la curva cobra más por cada unidad conforme drenas un lado","Se rechaza, porque el pool no puede cubrirla","Se encola hasta que se deposite liquidez suficiente"], answer: 0 },
  ],
};
