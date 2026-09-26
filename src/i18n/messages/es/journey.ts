// El Viaje del Builder — mapa /journey y chrome del player de concepto.
// El contenido de los pasos vive en src/content/journey (EN-first).
export const journey = {
  metaTitle: "Viaje del Constructor — TUSST",
  metaDescription:
    "El camino esencial: spec-driven, TDD, clean architecture y cómo funciona Stellar de verdad — la ingeniería que una IA no aprenderá por ti.",
  kicker: "el camino esencial",
  title: "Viaje del Constructor",
  intro:
    "Un camino, en tres partes. Nivel 0: qué son de verdad un libro mayor, una clave y un contrato — sin código, sin siglas. Parte I: las disciplinas de ingeniería que la era de la IA exige y no te regala. Parte II: el ecosistema Stellar de punta a punta, del consenso a la frontera de la privacidad. Capítulos cortos, profundidad real — y cada puerta a Rust sigue siendo opcional.",
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
      title: "Parte I — Oficio de ingeniería",
      blurb: "Ingeniería en la era de la IA: specs, tests, fronteras, arquitectura — y cómo conducir un modelo sin cederle el volante.",
    },
    realm: {
      title: "Parte II — El ecosistema Stellar",
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
      title: "Completar el capítulo",
      body: "Marca este capítulo como completado y su XP es tuyo.",
      cta: "Marcar como completado (+{xp} xp)",
      saving: "guardando…",
      signedOut:
        "Tu progreso vive solo en este navegador. Inicia sesión para guardar capítulos y ganar XP.",
      signIn: "Inicia sesión para guardar",
    },
    done: {
      kicker: "capítulo completado",
      xpEarned: "+{xp} xp",
      levelUp: "¡Nivel {level} alcanzado!",
      xpTotal: "{xp} xp en total",
      already: "Ya completado.",
      next: "Siguiente capítulo",
      backToMap: "Volver al Viaje",
    },
  },
  testOut: {
    chapterCta: "Ya me sé esto",
    arcCta: "Examinarme y saltar este tramo",
    chapterKicker: "examen del capítulo",
    arcKicker: "examen del tramo",
    chapterTitle: "Saltar {title}",
    arcTitle: "Saltar {title}",
    chapterBlurb:
      "Acierta {count} preguntas sin ningún fallo y el capítulo cuenta como completado, con XP incluido — sin leer nada.",
    arcBlurb:
      "Acierta {count} preguntas ({allowed} desliz permitido) y todos los capítulos de este tramo cuentan como completados de una vez.",
    arcBlurbStrict:
      "Acierta {count} preguntas sin ningún fallo y todos los capítulos de este tramo cuentan como completados de una vez.",
    question: "Pregunta {current} de {total}",
    submit: "Corregir mi examen",
    checking: "corrigiendo…",
    passKicker: "aprobado",
    passBody: "{correct}/{total}. Completados: {chapters}.",
    failKicker: "hoy no",
    failBody:
      "{correct}/{total}. No se completó nada — desde aquí, leer el capítulo es el camino más rápido.",
    readInstead: "Leer el capítulo",
    readArcInstead: "Empezar por el principio",
    tryAgain: "Sacar otro examen",
    backToMap: "Volver al Viaje",
    signedOut: "Inicia sesión primero — un capítulo completado tiene que caer en una cuenta.",
    signIn: "Iniciar sesión",
    unavailable: "No se pudo sacar ese examen ahora mismo — inténtalo en un momento.",
  },
};
