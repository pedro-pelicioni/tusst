import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Travesía",
  tagline: "Envía una moneda, entrega otra — atómicamente, en una operación.",
  steps: [
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
    { kind: "widget", component: "path-payment",
      body: `**Envía un pago cruzando monedas** y mira qué ruta elige el protocolo según crece el importe — luego exige más de lo que ninguna puede entregar, y mira cómo la cosa entera sencillamente no ocurre.` },
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
    { kind: "theory", body: `## El límite es todo el diseño

Todo lo anterior cuelga de un número que tú aportas: lo mínimo que aceptas, o lo máximo que gastas. Las dos formas de equivocarse son silenciosas.

**Demasiado ajustado** y tus pagos sencillamente dejan de ocurrir. Sin ruido — un path payment que no puede cumplir su límite revierte, lo que se ve idéntico a un pago que nadie envió. En algún sitio una cola se llena de transferencias que "no pasaron", y la causa es una tolerancia que alguien fijó una vez y nunca revisó.

**Demasiado holgado** y has firmado un cheque en blanco a lo que sea que cueste la ruta en el instante en que tu sobre aterrice. El protocolo honrará un precio pésimo con la misma fidelidad que uno bueno; el límite era lo único que decía no.

El hábito que funciona no es ingenioso, es disciplinado: **cotiza primero, y luego fija el límite a partir de esa cotización más una tolerancia que elegiste a propósito.** Un límite copiado de un ejemplo, o dejado en un número redondo porque parecía razonable, es un número del que nadie se responsabiliza — y es el que decide si tus usuarios cobran.` },
    { kind: "theory", body: `## La propiedad que lo hace usable

Cada parte de esto podía salir mal. La ruta podía estar delgada, el precio podía moverse entre el instante en que firmaste y el instante en que se ejecutó, un salto podía no llenarse.

Y la respuesta a todo ello es la misma, y es lo que convierte al path payment en algo sobre lo que se puede montar un negocio: **o el camino entero se ejecuta al cierre del ledger, o no se ejecuta ninguna parte.**

No hay estado en el que tus BRL salieron, se volvieron XLM y se detuvieron. Sin saldo a medio convertir parado en una moneda que nadie pidió. Sin ticket de soporte que empiece por *"el dinero está en algún punto intermedio."*

Eso no es un lujo. Es la diferencia entre un raíl de pagos y un experimento científico — y por eso el límite que fijas no es una preferencia sino el contrato: *entrega al menos esto, o no toques mis fondos.*` },
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
  testOut: [
    { question: `¿Qué hace \`path_payment_strict_send\` que un pago simple no puede?`,
      options: ["Enviar un activo y entregar otro distinto, enrutando por libros y pools dentro de una única operación atómica","Enviar a varios destinos a la vez","Programar un pago para un ledger futuro"], answer: 0 },
    { question: `Una factura es de exactamente 900 EURC y tu tesorería tiene USDC. ¿Qué operación encaja?`,
      options: ["path_payment_strict_receive — fija los 900 EURC entregados, limita el USDC que gastarás","path_payment_strict_send — envía unos 900 USDC y espera que el tipo salga parejo","Dos transacciones: cambiar en el DEX y luego un pago simple"], answer: 0 },
    { question: `Ninguna ruta puede entregar dentro del límite que fijaste. ¿Qué pasa con tus fondos?`,
      options: ["Nada en absoluto — el camino entero se ejecuta o no se ejecuta nada, así que no hay saldo a medio convertir en ningún sitio","Se convierten hasta donde llegó la ruta, y el resto vuelve al siguiente ledger","Los retiene el protocolo hasta que se abra una ruta"], answer: 0 },
    { question: `¿Por qué una aplicación no debería fijar a mano qué ruta toma un pago?`,
      options: ["La mejor ruta depende del importe — el libro más delgado suele cotizar el mejor tipo y se hunde con el tamaño","Las rutas son privadas y no pueden inspeccionarse antes del envío","El protocolo cobra más por una ruta que especificaste tú"], answer: 0 },
  ],
};
