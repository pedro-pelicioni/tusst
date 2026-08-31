import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "El Lado del Emisor",
  tagline: "Emisión de activos: cualquiera puede emitir — el oficio es todo lo que viene después.",
  steps: [
    {
      kind: "theory",
      body: `## Emitir un activo: solo pagarlo

No hay un ritual de "desplegar un token" en Stellar clásico. Un **activo es un par**: un código corto más la **dirección del emisor** — \`USDC\` del cuenta de Circle y \`USDC\` de un desconocido son activos diferentes.

Para emitir, el emisor simplemente **paga** el activo desde su propia cuenta a alguien que tenga una línea de confianza. Ese primer pago *es* la acuñación. La oferta es lo que el emisor ha pagado y no ha recibido de vuelta — el libro mayor lo rastrea automáticamente a través de las líneas de confianza.

Cualquier cuenta puede emitir. La escasez de confianza, no el permiso, es lo que hace que un activo importe.`,
    },
    {
      kind: "quiz",
      question: `¿Qué se necesita para crear un activo completamente nuevo en Stellar clásico?`,
      options: [
        "El emisor lo paga a una cuenta que abrió una línea de confianza — el primer pago es la acuñación",
        "Desplegar y verificar un contrato de token, luego registrar el ticker con el SDF",
        "Apostar XLM proporcional al suministro previsto",
      ],
      answer: 0,
      explain: `Un activo se identifica por código + emisor, por lo que "existe" en el momento en que se mueve por primera vez. Los contratos solo aparecen en la historia cuando deseas comportamiento programable — o el puente SAC que espera al final de este capítulo.`,
    },
    {
      kind: "theory",
      body: `## Dos cuentas, un activo: higiene del emisor

Los emisores serios separan los roles:

- La **cuenta emisora** firma casi nada. Acuña al pagar a la cuenta de distribución, y luego vuelve a dormir — claves frías, superficie de ataque mínima.
- La **cuenta de distribución** mantiene la oferta circulante y gestiona el tráfico diario: clientes, exchanges, rutas calientes.

Si se filtran las claves de distribución, pierdes un saldo — no la imprenta. Un emisor puede ir más allá: bloquear a los firmantes de la cuenta emisora para que *nadie* pueda volver a emitir, fijando la oferta máxima para siempre. El propio libro mayor se convierte en la auditoría.`,
    },
    {
      kind: "theory",
      body: `## Banderas de autorización: el emisor como guardián

Los activos del mundo real están sujetos a leyes reales, por lo que un emisor puede establecer banderas sobre sí mismo:

- **Auth required** — las líneas de confianza comienzan sin autorización; el emisor aprueba a cada titular (puertas KYC).
- **Auth revocable** — el emisor puede congelar una línea de confianza autorizada, deteniendo ese saldo en frío.
- **Clawback** — el emisor puede recuperar el activo por completo (orden judicial, fondos robados, pagos por error).

Estas banderas son la razón por la que instituciones reguladas pueden emitir en un libro mayor público: el cumplimiento se aplica *por el protocolo*, no por una promesa en PDF.`,
    },
    {
      kind: "quiz",
      question: `Un emisor regulado descubre que la cuenta de un titular fue hackeada. ¿Qué bandera le permite detener ese saldo de inmediato?`,
      options: [
        "Auth revocable — revocar la autorización de la línea de confianza y congelar el saldo en su lugar",
        "Auth required — bloquea retroactivamente los depósitos previos del hacker",
        "Auth immutable — bloquea todo el activo para todos",
      ],
      answer: 0,
      explain: `Auth required solo controla *nuevas* líneas de confianza, y auth immutable solo garantiza que las banderas nunca cambien. Congelar detiene el movimiento; **clawback** va un paso más allá y recupera el activo al emisor.`,
    },
    {
      kind: "fill",
      prompt: `Completa la identidad de un activo clásico — ¿qué hace que USDC sea *el* USDC real?`,
      file: "asset-identity.txt",
      before: `asset  =  asset code  +  `,
      after: `   (mismo código, diferente emisor → activo diferente)`,
      choices: [
        "la dirección de la cuenta del emisor",
        "el hash Wasm del contrato",
        "un registro global de tickers",
        "la URL de la página del ancla",
      ],
      answer: 0,
      explain: `No hay un espacio de nombres que alguien pueda ocupar. Las billeteras resuelven cuál \`USDC\` es real mediante la dirección del emisor — y, como verás en las Puertas del Reino, ese emisor lo prueba con un archivo en su propio dominio.`,
    },
    {
      kind: "theory",
      body: `## El Stellar Asset Contract

Los activos clásicos y los contratos inteligentes comparten un mismo reino, y el puente es el **Stellar Asset Contract (SAC)**. Cualquier activo clásico — incluido XLM — puede ser *invocado* como contrato: un despliegue, cero código que escribir, y el activo ahora habla **SEP‑41**, la interfaz estándar de tokens de Soroban.

Mismo activo, misma oferta, una sola hoja de balance — pero ahora los contratos pueden poseerlo, moverlo y construir sobre él. USDC en un pool de préstamos y USDC en la línea de confianza de la abuela son el *mismo* USDC.

Todo protocolo serio de Soroban se apoya en este puente a diario.`,
    },
    { kind: "labLink", labSlug: "oz-token-wizard",
      body: `Todo en esta página es una decisión, no sintaxis. El **Asistente de Tokens OZ** de la Forja te pone del lado emisor de verdad en testnet — y lo interesante no es que funcione, sino que cada elección que haces ahí es una que un anchor también toma, con un departamento de cumplimiento al lado.` },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `El Acto VI de la Campaña — **La Puerta de la Constelación** — recorre este mismo terreno desde Rust: cuentas, saldos y líneas de confianza consultados y forjados en código en lugar de prosa. Toma el desvío cuando quieras tus dedos sobre las propias entradas del libro mayor.

Lo siguiente en el camino: activos en *movimiento* — pagos que cruzan monedas en vuelo, y un intercambio incorporado al propio protocolo.`,
    },
  ],
  testOut: [
    { question: `¿Cómo se crea un activo nuevo en Stellar?`,
      options: ["Pagándolo — una cuenta emisora simplemente envía un activo que nunca ha tenido, y la oferta pasa a existir","Desplegando un contrato de token que lo acuña","Registrando el código del activo en la SDF antes del primer uso"], answer: 0 },
    { question: `¿Por qué los emisores mantienen una cuenta de distribución separada en vez de pagar desde la emisora?`,
      options: ["El saldo de la emisora no significa nada — la oferta es lo que ha pagado — así que una cuenta de distribución hace legible la oferta en circulación y deja las claves del emisor poco usadas","El protocolo prohíbe que una cuenta emisora tenga su propio activo","Reduce a la mitad el coste de reserva de las trustlines implicadas"], answer: 0 },
    { question: `¿Qué le permiten al emisor sus flags de autorización?`,
      options: ["Controlar quién puede tener el activo, y congelar la trustline de un tenedor concreto — el control que necesita para operar bajo regulación","Revertir pagos individuales una vez liquidados","Fijar el precio al que el activo se negocia en el DEX"], answer: 0 },
    { question: `¿Qué le da el Stellar Asset Contract a un activo clásico?`,
      options: ["Una interfaz de contrato, para que un activo clásico lo usen los contratos Soroban como si fuera un token de contrato","Una segunda oferta basada en contrato que refleja la clásica","Listado automático en AMMs basadas en contratos"], answer: 0 },
  ],
};
