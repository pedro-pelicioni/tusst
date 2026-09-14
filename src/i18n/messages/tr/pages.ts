// App pages: path (Salon `home`'u kullanır), campaign, cards, tracks/[slug], profile.
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
  cards: {
    metaTitle: "Kart Koleksiyonu — TUSST",
    metaDescription:
      "Her kampanya bölümü için bir tane koleksiyon kartı. Bir bölümün son dersini bitir, kartını al.",
    kicker: "// koleksiyon",
    title: "Kart Koleksiyonu",
    intro:
      "Sekiz kart, her kampanya bölümü için bir tane. Bir bölümün son dersini bitir, kartı koleksiyonuna katılsın. Tamamen kozmetik — hiçbir avantaj sağlamazlar ve bu sayfadaki hiçbir şey içerik kilitlemez.",
    bossCard: "boss kartı",
    actLink: "Bölüm {numeral} — {title}",
    unassigned: "atanmamış",
    footnote:
      "kartlar yalnızca kozmetiktir — avantaj sağlamaz, hiçbir şeyi kilitlemez. nadir baskılar, bir bölümü tek yanlış cevap vermeden bitirenlere verilir.",
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
    viewChampions: "Kartlarını gör",
  },
};
