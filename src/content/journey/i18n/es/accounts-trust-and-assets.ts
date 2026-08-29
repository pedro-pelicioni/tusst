import type { Concept } from "../types";

export const accountsTrustAndAssets: Concept = {
  meta: {
    slug: "accounts-trust-and-assets",
    title: "Cuentas, Confianza y Activos",
    tagline: "Reservas, líneas de confianza y cómo nace cualquier activo.",
    numeral: "III",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/accounts-trust-and-assets.webp",
    glyph: "🪙",
  },
  steps: [
    {
      kind: "theory",
      body: `## Una cuenta es una entrada del libro mayor

Quita la interfaz de la billetera y una **cuenta** de Stellar es una fila en el libro mayor replicado: una clave pública, un saldo de XLM, algunas banderas — y el **número de secuencia** que viste al diseccionar sobres (el contador a prueba de re‑reproducción).

Las filas no son gratuitas. Cada validador almacena cada entrada, por lo que cada una debe bloquear una **reserva base** de XLM — actualmente 0,5 XLM, y una cuenta nueva debe mantener al menos dos (1 XLM) que no puede gastar. Si eliminas entradas, la reserva vuelve.

La reserva no es una tarifa. Es **alquiler‑por‑depósito**: el libro mayor se mantiene liviano porque el exceso tiene un costo.`,
    },
    {
      kind: "theory",
      body: `## Líneas de confianza: los activos son opt‑in

En muchas cadenas cualquiera puede lanzar tokens basura a tu dirección. En Stellar no pueden: para mantener cualquier activo que no sea XLM, tu cuenta debe abrir primero una **línea de confianza** hacia él.

Una línea de confianza dice: *"Acepto el activo X del emisor Y, hasta este **límite**."* Se crea con la operación \`change_trust\`, es su propia entrada en el libro mayor — por lo que bloquea **una reserva base** — y mientras no exista, los pagos de ese activo a ti simplemente fallan.

Opt‑in por diseño: tu balance solo contiene lo que aceptaste mantener.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Ya lo hiciste con tus propias manos: el laboratorio **Tu Primera Billetera** de la Forja envía \`change_trust\` con tu firma en la testnet activa — el momento en que un nuevo activo apareció en tu saldo fue el nacimiento de una línea de confianza. Si te saltaste ese laboratorio, este es el capítulo perfecto para abrir una ahora mismo.`,
    },
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
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `El Acto VI de la Campaña — **La Puerta de la Constelación** — recorre este mismo terreno desde Rust: cuentas, saldos y líneas de confianza consultados y forjados en código en lugar de prosa. Toma el desvío cuando quieras tus dedos sobre las propias entradas del libro mayor.

Lo siguiente en el camino: activos en *movimiento* — pagos que cruzan monedas en vuelo, y un intercambio incorporado al propio protocolo.`,
    },
  ],
};
