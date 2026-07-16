// Onboarding wizard.
export const onboarding = {
  chooseLanguage: "Choisis ta langue",

  // Welcome screen. The body is split into segments so the bolded
  // <strong> spans can be rendered around the translated text.
  welcomeHeading: "Apprends l'Art des Runes",
  welcomeBody1: "Maîtrise les compétences pour forger des programmes ",
  welcomeBodyRust: "Rust",
  welcomeBody2: " et des ",
  welcomeBodySoroban: "contrats Soroban",
  welcomeBody3: " sur Stellar — une petite rune à la fois.",

  // Question headings.
  goalQuestion: "Pourquoi apprends-tu à coder ?",
  profileQuestion: "Laquelle de ces descriptions te correspond le mieux ?",
  xpQuestion: "Quelle est ton expérience en programmation ?",

  // Option labels, by index. The English constants in OnboardingFlow.tsx
  // remain the canonical values written to localStorage/cookies — these
  // are display-only.
  goals: [
    "Me reconvertir dans la tech",
    "Progresser dans mon travail ou mes études",
    "Pour le plaisir — apprendre quelque chose de nouveau",
    "Construire une dApp sur Stellar",
    "Aucune de ces réponses",
  ],
  profiles: [
    "Lycéen",
    "Étudiant à l'université",
    "Salarié",
    "Freelance / indépendant",
    "Aucune de ces réponses",
  ],
  xpLevels: [
    {
      label: "AUCUNE",
      blurb: "Tu n'as jamais écrit une rune. Parfait — la Citadelle a été bâtie pour toi.",
    },
    {
      label: "FAIBLE",
      blurb: "Tu as déjà essayé de coder et tu connais quelques fondamentaux.",
    },
    {
      label: "ÉLEVÉE",
      blurb: "Tu codes régulièrement et tu veux maîtriser Rust & Soroban.",
    },
  ],

  // Social proof.
  proofHeading: "Les anciens ont forgé bien des apprentis",
  proofBody:
    "Notre mission est de transformer les Forgeborn en maîtres de l'art des runes — du vrai code, jugé par des épreuves cachées, directement dans ton navigateur. Zéro installation. Zéro excuse.",

  // Campaign plan.
  planKicker: "Ton plan de campagne",
  planHeading: "Forgeborn — de Rust à Soroban",
  unlocksPaths: "Ton expérience déverrouille les {count} premières voies.",
  firstPath: "Toute légende commence à la première voie.",

  // Buttons & links.
  begin: "Commencer",
  continue: "Continuer",
  startLearning: "Commencer à apprendre",
  haveAccount: "J'ai déjà un compte",

  // Aria labels.
  back: "Retour",
  exit: "Quitter",
  codingExperience: "Expérience en programmation",
};
