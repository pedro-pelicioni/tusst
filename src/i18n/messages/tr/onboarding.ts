// Onboarding wizard.
export const onboarding = {
  chooseLanguage: "Dilini seç",

  // Welcome screen. The body is split into segments so the bolded
  // <strong> spans can be rendered around the translated text.
  welcomeHeading: "Rün Sanatını Öğren",
  welcomeBody1: "Stellar üzerinde ",
  welcomeBodyRust: "Rust",
  welcomeBody2: " programları ve ",
  welcomeBodySoroban: "Soroban kontratları",
  welcomeBody3: " dövmek için gereken becerilerde ustalaş — her seferinde küçük bir adım.",

  // Question headings.
  goalQuestion: "Neden kod yazmayı öğreniyorsun?",
  profileQuestion: "Seni en iyi hangisi tanımlar?",
  xpQuestion: "Ne kadar kodlama deneyimin var?",

  // Option labels, by index. The English constants in OnboardingFlow.tsx
  // remain the canonical values written to localStorage/cookies — these
  // are display-only.
  goals: [
    "Teknoloji alanında kariyere geçmek",
    "İşimde ya da eğitimimde daha iyi olmak",
    "Eğlence için — yeni bir şey öğrenmek",
    "Stellar üzerinde bir dApp geliştirmek",
    "Hiçbiri",
  ],
  profiles: [
    "Lise öğrencisi",
    "Üniversite öğrencisi",
    "Çalışan",
    "Freelancer / serbest çalışan",
    "Hiçbiri",
  ],
  xpLevels: [
    {
      label: "YOK",
      blurb: "Hiç tek satır kod yazmadın. Mükemmel — bu parkur tam oradan başlıyor.",
    },
    {
      label: "AZ",
      blurb: "Daha önce kod yazmayı denedin ve bazı temelleri biliyorsun.",
    },
    {
      label: "ÇOK",
      blurb: "Düzenli kod yazıyorsun ve Rust ile Soroban'da ustalaşmak istiyorsun.",
    },
  ],

  // Social proof.
  proofHeading: "Parkuru bitiren inşacılar",
  proofBody:
    "Gizli testlerle notlandırılan gerçek kod, doğrudan tarayıcında. Yerel kurulum yok, yüklenecek toolchain yok.",

  // Campaign plan.
  planKicker: "Kampanya planın",
  planHeading: "Rust'tan Soroban'a",
  unlocksPaths: "Deneyimin ilk {count} yolun kilidini açıyor.",
  firstPath: "Her efsane ilk yolda başlar.",
  planJourneyNote:
    "Bu perdeler isteğe bağlı ustalık yolun. Temel yolun — İnşacının Yolculuğu — şimdi başlıyor.",

  // Buttons & links.
  begin: "Başla",
  continue: "Devam et",
  startLearning: "Öğrenmeye başla",
  startJourney: "Yolculuğa başla",
  orCampaign: "önce Rust mu istiyorsun? Kampanyayı başlat",
  haveAccount: "Zaten hesabım var",

  // Aria labels.
  back: "Geri",
  exit: "Çık",
  codingExperience: "Kodlama deneyimi",
};
