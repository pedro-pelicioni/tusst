import { LAB_TEXT } from "@/content/labs/i18n";

// La Forja — índice /labs (labs guiados + card del IDE libre) y el chrome del
// player de lab. El contenido de los pasos vive en src/content/labs (EN-first).
export const labs = {
  metaTitle: "La Forja — TUSST",
  metaDescription:
    "Labs guiados de Stellar: botones que financian carteras, abren trustlines y despliegan contratos en la testnet real — mientras entiendes el efecto de cada pulsación.",
  kicker: "la forja",
  title: "La Forja Está Abierta",
  intro:
    "Labs guiados donde cada botón hace algo real en la testnet — carteras financiadas, trustlines abiertas, pagos liquidados — y el texto explica exactamente qué acaba de pasar en el ledger.",
  liveHeading: "// labs",
  soonHeading: "// en la fragua",
  freeMode: {
    title: "Modo libre — el IDE",
    blurb:
      "El taller Soroban completo en tu navegador: escribe Rust, compila, despliega en la testnet e invoca contratos. Sin raíles, sin muros.",
    cta: "Abrir el IDE",
    badge: "sin login · sin configuración",
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
    ariaLabel: "Simulador de quórum de SCP",
    nodeAria: "Nodo {node}",
    propose: "Proponer un ledger",
    reset: "Reiniciar el concilio",
    running: "el concilio delibera…",
    closed: "Ledger {n} cerrado ✓",
    stalled: "{count} escaño(s) esperan a su concilio — seguridad antes que vivacidad.",
    halted: "Ningún quórum puede formarse — la red espera en vez de bifurcarse.",
    hint: "Pulsa proponer y mira la aceptación propagarse. Haz clic en un nodo para derribarlo (o levantarlo).",
    ledgers: "ledgers cerrados: {n}",
  },
  content: LAB_TEXT.es,
  player: {
    exit: "Salir del lab",
    wallet: {
      none: "sin sello aún",
      yours: "tu sello",
      copy: "Copiar dirección",
      copied: "Copiado",
    },
    phases: {
      prepare: "preparando",
      passkey: "esperando tu passkey",
      queued: "en la cola de la fragua",
      building: "compilando rust → wasm",
      sign: "firmando",
      submit: "enviando a la red",
      confirm: "confirmando en el ledger",
    },
    viewTx: "Ver la transacción en el explorer",
    viewAccount: "Ver tu cuenta en el explorer",
    viewContract: "Ver la smart wallet en el explorer",
    retry: "Intentar de nuevo",
    errors: {
      testnetBusy: "La testnet está ocupada; inténtalo de nuevo en un momento.",
      walletRequired: "Forja tus llaves primero — retrocede una pantalla.",
      missingState: "Un paso anterior quedó pendiente — retrocede y complétalo.",
      forgeCold: "La fragua está fría — el runner está inaccesible. Inténtalo de nuevo en un momento.",
      buildFailed: "La compilación falló: el runner rechazó este contrato. Inténtalo de nuevo.",
      buildTimeout: "La compilación agotó el tiempo: la fragua estaba ocupada. Inténtalo de nuevo.",
      localWalletRequired:
        "Este rito necesita la clave testnet local de la Forja para pagar el despliegue — fórjala en el paso anterior.",
      passkeyUnavailable:
        "Las passkeys necesitan un contexto seguro y soporte WebAuthn. Abre este lab por HTTPS en un dispositivo compatible.",
      passkeyMismatch:
        "Esa passkey pertenece a otra smart wallet. Inténtalo de nuevo y elige la credencial que acabas de forjar.",
      passkeyFailed:
        "La ceremonia de la passkey no terminó. Aprueba la solicitud del dispositivo e inténtalo de nuevo.",
      smartWalletDeployFailed:
        "La passkey fue creada, pero su smart wallet no llegó a la testnet. Inténtalo de nuevo en un momento.",
      smartWalletFundFailed:
        "La smart wallet se desplegó, pero Friendbot no pudo financiarla para la prueba de firma. Inténtalo de nuevo en un momento.",
      passkeyTransactionFailed:
        "La transferencia firmada con la passkey no llegó a la testnet. Aprueba la solicitud del dispositivo e inténtalo de nuevo.",
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
        "smart-account-code": "el contrato canónico de smart account",
        "smart-account-native-balance": "XLM nativo en la smart wallet",
        "claimable-balance-created": "un cofre que cerraste",
        "account-thresholds": "una bóveda que exige dos firmas",
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
