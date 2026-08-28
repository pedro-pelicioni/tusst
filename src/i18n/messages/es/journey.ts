// El Viaje del Builder — mapa /journey y chrome del player de concepto.
// El contenido de los pasos vive en src/content/journey (EN-first).
export const journey = {
  metaTitle: "Viaje del Builder — TUSST",
  metaDescription:
    "El camino esencial: spec-driven, TDD, clean architecture y cómo funciona Stellar de verdad — la ingeniería que una IA no aprenderá por ti.",
  kicker: "el camino esencial",
  title: "Viaje del Builder",
  intro:
    "Dos arcos, un camino. El Oficio: las disciplinas de ingeniería que la era de la IA exige y no te regala. El Reino: el ecosistema Stellar de punta a punta, del consenso a la frontera de la privacidad. Capítulos cortos, profundidad real — y cada puerta a Rust sigue siendo opcional.",
  mapHeading: "// capítulos",
  arcs: {
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
  chapter: {
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
