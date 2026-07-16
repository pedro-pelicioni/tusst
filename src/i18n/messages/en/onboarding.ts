// Onboarding wizard.
export const onboarding = {
  chooseLanguage: "Choose your language",

  // Welcome screen. The body is split into segments so the bolded
  // <strong> spans can be rendered around the translated text.
  welcomeHeading: "Learn the Runecraft",
  welcomeBody1: "Master the skills to forge ",
  welcomeBodyRust: "Rust",
  welcomeBody2: " programs and ",
  welcomeBodySoroban: "Soroban contracts",
  welcomeBody3: " on Stellar — one small rune at a time.",

  // Question headings.
  goalQuestion: "Why are you learning to code?",
  profileQuestion: "Which of these best describes you?",
  xpQuestion: "How much coding experience do you have?",

  // Option labels, by index. The English constants in OnboardingFlow.tsx
  // remain the canonical values written to localStorage/cookies — these
  // are display-only.
  goals: [
    "Switch to a career in tech",
    "Get better at my job or studies",
    "For fun — learn something new",
    "Build a dApp on Stellar",
    "None of these",
  ],
  profiles: [
    "High-school student",
    "University student",
    "Employed",
    "Freelancer / self-employed",
    "None of these",
  ],
  xpLevels: [
    {
      label: "NONE",
      blurb: "You've never written a rune. Perfect — the Citadel was built for you.",
    },
    {
      label: "LOW",
      blurb: "You've tried coding before and know some fundamentals.",
    },
    {
      label: "HIGH",
      blurb: "You code regularly and want to master Rust & Soroban.",
    },
  ],

  // Social proof.
  proofHeading: "The elders have forged many apprentices",
  proofBody:
    "Our mission is to turn Forgeborn into masters of the runecraft — real code, judged by hidden trials, straight in your browser. No setup. No excuses.",

  // Campaign plan.
  planKicker: "Your campaign plan",
  planHeading: "Forgeborn — Rust to Soroban",
  unlocksPaths: "Your experience unlocks the first {count} paths.",
  firstPath: "Every legend starts at the first path.",

  // Buttons & links.
  begin: "Begin",
  continue: "Continue",
  startLearning: "Start learning",
  haveAccount: "I already have an account",

  // Aria labels.
  back: "Back",
  exit: "Exit",
  codingExperience: "Coding experience",
};
