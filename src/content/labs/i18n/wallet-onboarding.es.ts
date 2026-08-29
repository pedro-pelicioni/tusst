import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Tu primera cartera",
    tagline: "Crea un par de claves, activa una cuenta, abre una trustline y envía XLM.",
  },
  steps: {
    "intro": {
      body: `## Todo héroe necesita un sigilo

En Stellar, tu identidad es un **par de claves**: una dirección pública que muestras al mundo (comienza con \`G\`) y una clave secreta que proteges con cuidado (comienza con \`S\`).

Sin formularios. Sin correo. Sin pedir permiso. *Forjas* una identidad a partir de pura matemática — y en los próximos minutos tendrá fondos, aceptará un activo y pagará a otra cuenta. Todo real, en la **testnet**: los campos de entrenamiento de Stellar, donde las monedas no tienen valor pero la maquinaria es la misma.`,
    },
    "forge-keys": {
      title: "Forja tus claves",
      body: `Un solo golpe del martillo genera 32 bytes de aleatoriedad y deriva ambas claves de ella. El secreto permanece **en tu navegador** — TUSST nunca lo ve, y ningún servidor participa en nada que firmes hoy.`,
      cta: "Forja el par de claves",
      successBody: `Tu sigilo está forjado:

\`{address}\`

Esa dirección es pública — compártela libremente. La clave secreta asociada firma en tu nombre; quien la posea controla la cuenta. En testnet no tiene consecuencias económicas. En mainnet, protégela como a un dragón.`,
    },
    "friendbot": {
      title: "Despierta la cuenta",
      body: `Ahora mismo tu dirección es solo matemáticas — el libro mayor nunca ha oído hablar de ella. Una cuenta solo existe cuando alguien la financia más allá de la reserva base (un pequeño depósito de XLM que paga por su entrada en el libro mayor).

En testnet, un espíritu incansable llamado **Friendbot** financia a cualquiera que lo solicite.`,
      cta: "Invoca a Friendbot",
      successBody: `Friendbot respondió — tu cuenta ahora existe en el libro mayor con {balance} XLM.

Con ella nacieron dos cosas: un saldo y un número de secuencia que cuenta cada transacción que firmarás. Busca en cualquier explorador — ahora es registro público.`,
    },
    "quiz-reserve": {
      question: `Antes de Friendbot, enviar XLM a tu dirección requeriría una operación especial \`create_account\`. ¿Por qué Stellar hace que las nuevas cuentas mantengan una reserva base?`,
      options: [
        "Paga por la entrada permanente de la cuenta en el libro mayor, encareciendo la creación de cuentas de spam",
        "Es una tarifa recaudada por los validadores como beneficio",
        "Es un seguro reembolsado por el soporte de Stellar si pierdes tu llave",
      ],
      explain: `Exactamente — cada entrada del libro mayor (cuenta, línea de confianza, oferta) bloquea una pequeña reserva para que el libro mayor no se llene de basura gratuita. Elimina la entrada, recupera la reserva.`,
    },
    "trustline": {
      title: "Abre una línea de confianza",
      body: `Tu cuenta mantiene XLM nativamente — pero cualquier otro activo debe ser invitado. Una línea de confianza es que le dices al libro mayor: "Acepto USDC emitido por Circle, hasta este límite."

Por eso nadie puede enviarte tokens basura sin tu permiso en Stellar: **sin línea de confianza, sin tokens**. Esta transacción también es tu primera firma.`,
      cta: "Confía en USDC",
      successBody: `Línea de confianza abierta — tu cuenta ahora puede mantener **USDC** (emitido por Circle en testnet).

Observa lo que costó: una pequeña tarifa (~0.00001 XLM) y una reserva base más bloqueada, porque una línea de confianza es una nueva entrada del libro mayor. Tu número de secuencia también subió.`,
    },
    "shrine": {
      title: "Forja un sigilo compañero",
      body: `No puedes enviar un pago al vacío — necesitas un destino. Vamos a tallar una segunda dirección: un pequeño santuario para recibir tu primera ofrenda.

Lo generaremos y lanzaremos la clave secreta al mar. La cuenta existirá, mantendrá lo que le envíes y no responderá a nadie. Un monumento.`,
      cta: "Forjar el sigilo",
      successBody: `El sigilo del santuario:

\`{companion}\`

Aún no existe en el libro mayor — igual que la tuya antes de Friendbot. Pero esta vez serás tú quien le dé vida.`,
    },
    "create-companion": {
      title: "Eleva el santuario",
      body: `Una operación \`create_account\` financia una nueva dirección más allá de la reserva base — precisamente lo que Friendbot hizo por ti. Ahora lo haces por el santuario, desde tu saldo: 100 XLM de oro testnet.`,
      cta: "Eleva (envía 100 XLM)",
      successBody: `El santuario se alza. Acabas de realizar el mismo rito que Friendbot hizo por ti — las cuentas crean cuentas. Esa es toda la jerarquía; no existe un registrador central.`,
    },
    "payment": {
      title: "Haz una ofrenda",
      body: `El clásico. Una operación \`payment\` mueve valor de una cuenta a otra — liquidado en ~5 segundos, por una tarifa de ~0.00001 XLM. Esta es la transacción para la que se creó Stellar.`,
      cta: "Envía 25 XLM",
      successBody: `Ofrenda entregada — 25 XLM, final, irreversible, en registro público:

\`{tx}\`

Tarifa, aumento de secuencia, dos saldos actualizados, un cierre de libro mayor. Cinco segundos. Eso es un pago Stellar.`,
    },
    "quiz-recap": {
      question: `Alguien quiere enviar **USDC** a tu cuenta de santuario. ¿Llegará?`,
      options: [
        "No — el santuario nunca abrió una línea de confianza USDC, por lo que el libro mayor lo rechaza",
        "Sí — cualquier cuenta puede recibir cualquier activo",
        "Solo si pagan una tarifa más alta",
      ],
      explain: `Correcto. Las líneas de confianza son por cuenta, por activo. Tu cuenta principal confía en USDC; el santuario solo mantiene XLM nativo. Y como su secreto está en el fondo del mar, nadie puede abrir una para él.`,
    },
    "claim": {
      body: `El ledger registra todo lo que acabas de hacer: una cuenta creada, una línea de confianza abierta, un pago liquidado. Presenta tu dirección, y la Forja consultará la propia cadena — prueba, no promesas — antes de liberar tus XP.`,
    },
  },
} satisfies LabTextOverlay;
