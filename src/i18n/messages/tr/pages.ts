// App pages: path (Salon `home`'u kullanır), campaign, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "isteğe bağlı yol",
    title: "Rust Kampanyası",
    optionalNote:
      "Ustalık parkuru. Her perde isteğe bağlı — ve her perde seni daha keskin yapar. Bir kavramın altındaki Rust'ı istediğinde Yolculuk seni buraya yönlendirir.",
  },
  path: {
    kicker: "kampanya",
    title: "Rust'tan Soroban'a",
    championCards: "Koleksiyon kartları",
    claimed: "%{percent} alındı",
    actReward: "bölüm ödülü",
    rewardStats: "{type} · güç {power}",
    skirmishesForgingSoon: "dersler hazırlanıyor — yakında",
    startLearning: "Öğrenmeye başla",
    viewChampions: "Kartlarını gör",
  },
  track: {
    backToPath: "kampanya",
    trackLabel: "parkur / {level}",
    level: {
      beginner: "başlangıç",
      intermediate: "orta",
      advanced: "ileri",
    },
    act: "Bölüm {numeral}",
    overlord: "boss: {overlord}",
    actReward: "bölüm ödülü",
    rewardStats: "{type} · güç {power}",
    progress: "ilerleme",
    lessonsHeading: "// dersler",
    forgingTitle: "dersler hazırlanıyor",
    forgingBefore:
      "Onboarding'in bu bölümün kilidini açtı, ama dersleri hâlâ yazılıyor. Savaşmaya devam etmek için",
    forgingLink: "kampanyaya",
    forgingAfter: "geri dön.",
    difficulty: {
      easy: "kolay",
      medium: "orta",
      hard: "zor",
    },
    soon: "yakında",
    challengesAvailable:
      "{total} meydan okumadan {count} tanesi mevcut · fazlası yolda.",
  },
  profile: {
    forgeborn: "inşacı",
    lvlXp: "sev {level} · {xp} xp",
    since: "{date} tarihinden beri",
    goldCoinAlt: "Altın sikke",
    goldCaption: "altın · her seferinde bir dersle kazanıldı",
    stats: {
      skirmishesWon: "tamamlanan dersler",
      actsCleared: "temizlenen bölümler",
      championCards: "koleksiyon kartları",
    },
    campaignHeading: "// kampanya",
    status: {
      cleared: "temizlendi",
      locked: "kilitli",
    },
    continueCampaign: "Kampanyaya devam et",
    openCampaignMap: "Kampanya haritasını aç",
  },
};
