// Onboarding wizard.
export const onboarding = {
  chooseLanguage: "Elige tu idioma",

  // Welcome screen. The body is split into segments so the bolded
  // <strong> spans can be rendered around the translated text.
  welcomeHeading: "Aprende el Arte Rúnico",
  welcomeBody1: "Domina las habilidades para forjar programas en ",
  welcomeBodyRust: "Rust",
  welcomeBody2: " y ",
  welcomeBodySoroban: "contratos Soroban",
  welcomeBody3: " en Stellar — una pequeña runa a la vez.",

  // Question headings.
  goalQuestion: "¿Por qué estás aprendiendo a programar?",
  profileQuestion: "¿Cuál de estas opciones te describe mejor?",
  xpQuestion: "¿Cuánta experiencia programando tienes?",

  // Option labels, by index. The English constants in OnboardingFlow.tsx
  // remain the canonical values written to localStorage/cookies — these
  // are display-only.
  goals: [
    "Cambiar a una carrera en tecnología",
    "Mejorar en mi trabajo o estudios",
    "Por diversión — aprender algo nuevo",
    "Construir una dApp en Stellar",
    "Ninguna de estas",
  ],
  profiles: [
    "Estudiante de secundaria",
    "Estudiante universitario",
    "Empleado",
    "Freelancer / independiente",
    "Ninguna de estas",
  ],
  xpLevels: [
    {
      label: "NINGUNA",
      blurb: "Nunca has escrito una runa. Perfecto — la Ciudadela fue construida para ti.",
    },
    {
      label: "POCA",
      blurb: "Ya intentaste programar antes y conoces algunos fundamentos.",
    },
    {
      label: "ALTA",
      blurb: "Programas con regularidad y quieres dominar Rust y Soroban.",
    },
  ],

  // Social proof.
  proofHeading: "Los ancianos han forjado a muchos aprendices",
  proofBody:
    "Nuestra misión es convertir a los Forgeborn en maestros del arte rúnico — código real, juzgado por pruebas ocultas, directo en tu navegador. Sin instalación. Sin excusas.",

  // Campaign plan.
  planKicker: "Tu plan de campaña",
  planHeading: "Forgeborn — de Rust a Soroban",
  unlocksPaths: "Tu experiencia desbloquea las primeras {count} sendas.",
  firstPath: "Toda leyenda comienza en la primera senda.",

  // Buttons & links.
  begin: "Comenzar",
  continue: "Continuar",
  startLearning: "Empezar a aprender",
  haveAccount: "Ya tengo una cuenta",

  // Aria labels.
  back: "Atrás",
  exit: "Salir",
  codingExperience: "Experiencia programando",
};
