// El Salón — home con sesión en /path: dos caminos + la Forja.
export const home = {
  metaTitle: "El Salón — TUSST",
  metaDescription:
    "Elige tu camino: el Viaje del Constructor, el Camino Avanzado, los labs guiados de la Forja o la campaña opcional de Rust.",
  kicker: "el salón",
  title: "Elige tu camino",
  intro:
    "Tres caminos y un taller. Aprende el oficio de ingeniería, pulsa botones de verdad en una red de verdad y profundiza en Rust cuanto quieras.",
  continueCta: "Continuar donde lo dejaste",
  level: "nivel {level}",
  xpToNext: "{into} / {span} xp para el nivel {next}",
  doors: {
    journey: {
      label: "el camino esencial",
      title: "Viaje del Constructor",
      blurb:
        "Spec-driven, TDD, clean architecture — y cómo funciona Stellar de verdad. La disciplina que una IA no aprenderá por ti.",
      cta: "Recorrer el Viaje",
      soon: "primeros capítulos en la fragua",
    },
    campaign: {
      label: "el camino opcional",
      title: "Campaña de Rust",
      blurb:
        "Ocho actos de maestría Rust → Soroban. Opcional, profunda y digna de cada combate.",
      cta: "Marchar en la Campaña",
      progress: "{done}/{total} actos superados",
    },
    advanced: {
      label: "si ya entregas",
      title: "Camino Avanzado",
      blurb:
        "Ingeniería de sistemas en Rust a la profundidad que exige un puesto de infraestructura backend. Sin fundamentos, sin historia — ownership, lifetimes, concurrencia, internals de async, unsafe y FFI.",
      cta: "Abrir el Camino Avanzado",
      progress: "{done}/{total} lecciones hechas",
    },
    forge: {
      label: "donde se practica",
      title: "La Forja",
      blurb:
        "Labs guiados con botones que hacen cosas reales en la testnet real — más el IDE en modo libre. Sin login.",
      cta: "Entrar a la Forja",
      progress: "{done} labs completados",
    },
  },
};
