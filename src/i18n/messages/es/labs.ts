// La Forja — índice /labs (labs guiados + card del IDE libre) y el chrome del
// player de lab. El contenido de los pasos vive en src/content/labs (EN-first).
export const labs = {
  metaTitle: "La Forja — TUSST",
  metaDescription:
    "Labs guiados de Stellar: botones grandes que fondean wallets, abren trustlines y despliegan contratos en la testnet real — mientras aprendes qué hizo cada pulsación.",
  kicker: "la forja",
  title: "La Forja Está Abierta",
  intro:
    "Labs guiados donde cada botón grande hace algo real en la testnet — wallets fondeadas, trustlines abiertas, pagos liquidados — y el texto te cuenta exactamente qué acaba de pasar en el ledger.",
  liveHeading: "// labs",
  soonHeading: "// en la fragua",
  freeMode: {
    title: "Modo libre — el IDE",
    blurb:
      "El taller Soroban completo en tu navegador: escribe Rust, compila, despliega en testnet, invoca. Sin raíles, sin muros.",
    cta: "Abrir el IDE",
    badge: "sin login · sin setup",
  },
  card: {
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "en la fragua",
    completed: "completado",
    start: "Entrar al lab",
    resume: "Continuar",
    replay: "Repetir",
  },
  difficulty: {
    novice: "novato",
    adept: "adepto",
    master: "maestro",
  },
  sim: {
    propose: "Proponer un ledger",
    reset: "Reiniciar el concilio",
    running: "el concilio delibera…",
    closed: "Ledger {n} cerrado ✓",
    stalled: "{count} escaño(s) esperan a su concilio — seguridad antes que vivacidad.",
    halted: "Ningún quórum puede formarse — la red espera en vez de bifurcarse.",
    hint: "Pulsa proponer y mira la aceptación propagarse. Haz clic en un nodo para derribarlo (o levantarlo).",
    ledgers: "ledgers cerrados: {n}",
  },
  player: {
    exit: "Salir del lab",
    wallet: {
      none: "sin sigilo aún",
      yours: "tu sigilo",
      copy: "Copiar dirección",
      copied: "Copiado",
    },
    phases: {
      prepare: "preparando",
      queued: "en la cola de la fragua",
      building: "compilando rust → wasm",
      sign: "firmando",
      submit: "enviando a la red",
      confirm: "confirmando en el ledger",
    },
    viewTx: "Ver la transacción en el explorer",
    viewAccount: "Ver tu cuenta en el explorer",
    retry: "Golpear de nuevo",
    errors: {
      testnetBusy: "Los espíritus de la testnet están ocupados — golpea de nuevo en un momento.",
      walletRequired: "Forja tus llaves primero — retrocede una pantalla.",
      missingState: "Un paso anterior quedó pendiente — retrocede y complétalo.",
      forgeCold: "La fragua está fría — el runner está inaccesible. Inténtalo de nuevo en un momento.",
      buildFailed: "La compilación falló — el runner rechazó este contrato. Golpea de nuevo.",
      buildTimeout: "La compilación agotó el tiempo — la fragua estaba llena. Golpea de nuevo.",
    },
    checkpoint: {
      title: "Reclama tu recompensa",
      cta: "Leer el ledger y reclamar XP",
      verifying: "consultando el ledger…",
      anonymous:
        "Tu partida vive en este navegador. Inicia sesión y la Forja lo verificará on-chain — pruebas, no promesas — y pagará tu XP.",
      signIn: "Inicia sesión para reclamar",
      failed:
        "El ledger no está de acuerdo — faltan hazañas: {checks}. Completa los pasos de arriba y reclama de nuevo.",
      checkNames: {
        "account-exists": "una cuenta viva",
        trustline: "la trustline de USDC",
        "payment-sent": "un pago enviado",
        "token-balance-positive": "un saldo de token en tu contrato",
      },
    },
    done: {
      kicker: "lab completado",
      xpEarned: "+{xp} xp",
      levelUp: "¡Nivel {level} alcanzado!",
      xpTotal: "{xp} xp en total",
      already: "Ya reclamado — el ledger recuerda.",
      backToForge: "Volver a la Forja",
      openIde: "Seguir en el IDE",
    },
  },
};
