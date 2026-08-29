// El Viaje del Builder — mapa /journey y chrome del player de concepto.
// El contenido de los pasos vive en src/content/journey (EN-first).
export const journey = {
  metaTitle: "Viaje del Constructor — TUSST",
  metaDescription:
    "El camino esencial: spec-driven, TDD, clean architecture y cómo funciona Stellar de verdad — la ingeniería que una IA no aprenderá por ti.",
  kicker: "el camino esencial",
  title: "Viaje del Constructor",
  intro:
    "Una planta baja y dos arcos, un camino. Nivel 0: qué son de verdad un libro mayor, una clave y un contrato — sin código, sin siglas. El Oficio: las disciplinas de ingeniería que la era de la IA exige y no te regala. El Reino: el ecosistema Stellar de punta a punta, del consenso a la frontera de la privacidad. Capítulos cortos, profundidad real — y cada puerta a Rust sigue siendo opcional.",
  mapHeading: "// capítulos",
  levels: {
    legend: "El camino sube en tres niveles — empieza en el nivel 0, donde no se da nada por sabido.",
    foundations: "nivel 0 · fundamentos",
    essential: "nivel 1 · esencial",
    advanced: "nivel 2 · avanzado",
  },
  arcs: {
    foundations: {
      title: "Nivel 0 — Fundamentos",
      blurb: "La planta baja: qué es un libro mayor, qué es una clave, qué es un contrato. Sin código, sin siglas, sin nada por sabido. Tres capítulos cortos y el resto del camino deja de intimidar.",
    },
    craft: {
      title: "Arco I — El Oficio",
      blurb: "Ingeniería en la era de la IA: specs, tests, fronteras, arquitectura — y cómo comandar al gólem.",
    },
    realm: {
      title: "Arco II — El Reino",
      blurb: "Stellar de punta a punta: consenso, transacciones, assets, anclas, contratos, smart wallets, privacidad y el protocolo vivo.",
    },
  },
  recommended: "siguiente recomendado",
  startHere: "empieza aquí",
  chapter: {
    requires: "se apoya en {chapters}",
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "en la fragua",
    completed: "completado",
    start: "Empezar el capítulo",
    revisit: "Revisitar",
  },
  player: {
    exit: "Salir del capítulo",
    branch: {
      kicker: "verlo en rust",
      optional: "profundización opcional",
      cta: "Entrar a la escaramuza",
      locked: "Se desbloquea con el Acto {numeral} de la Campaña",
    },
    lab: {
      kicker: "pase a la forja",
      completed: "lab completado ✓",
      cta: "Abrir el lab",
      soon: "este lab aún está en la fragua",
    },
    exercise: {
      kicker: "la prueba del examinador",
      rubricLabel: "criterios de evaluación",
      placeholder: "Escribe aquí tu especificación — comportamiento, invariantes, casos límite…",
      submit: "Enviar al examinador",
      checking: "el examinador lee…",
      passKicker: "especificación aceptada",
      failKicker: "el examinador pide ajustes",
      revise: "Revisar y reenviar",
      notConfigured: "El examinador no está configurado en este entorno.",
      rateLimited: "El examinador alcanzó su límite de uso actual; inténtalo de nuevo más tarde.",
      signedOut: "Tu sesión caducó; inicia sesión de nuevo antes de enviar.",
      invalid: "No se pudo enviar la especificación. Revísala e inténtalo de nuevo.",
      unavailable: "El examinador está inaccesible ahora — inténtalo de nuevo en un momento.",
    },
    claim: {
      title: "Sellar el capítulo",
      body: "El camino recuerda lo que anduviste. Séllalo, y el XP del capítulo es tuyo.",
      cta: "Sellar (+{xp} xp)",
      saving: "sellando…",
      signedOut:
        "Tu lectura vive en este navegador. Inicia sesión para sellar capítulos y ganar XP.",
      signIn: "Inicia sesión para sellar",
    },
    done: {
      kicker: "capítulo completado",
      xpEarned: "+{xp} xp",
      levelUp: "¡Nivel {level} alcanzado!",
      xpTotal: "{xp} xp en total",
      already: "Ya sellado — el camino recuerda.",
      next: "Siguiente capítulo",
      backToMap: "Volver al Viaje",
    },
  },
};
