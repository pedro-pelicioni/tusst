// TR · Cephanelik — gizli altının nihayet açtığı dükkân.
// Eşya adları ve tanıtımları src/content/armory.ts'teki id'lerle anahtarlanır,
// tıpkı overworld.ts'teki kahraman metinleri gibi. Id'ler yalnızca eklenir:
// orada yeniden adlandırmadan buradaki bir anahtarı asla değiştirme.

export const armory = {
  metaTitle: "Cephanelik — TUSST",
  kicker: "cephanelik",
  title: "Derslerin sana ödediğini harca",
  intro:
    "Bitirdiğin her ders kesene 10 altın ödüyor. İşte satın alabileceklerin — bir kılıç, bir teçhizat parçası, yanı başında bir yaratık. Hiçbiri seni daha güçlü yapmıyor.",

  // Para birimi katmanı hâlâ gizliyken dükkânın yerine gösterilir.
  locked: {
    title: "Kapılar kapalı",
    body: "Cephanelik, bitirdiğin ilk dersten sonra açılır.",
    cta: "Bir ders seç",
  },

  pouch: "{gold} altın",
  collection: "{total} parçanın {owned} tanesi",
  artPending: "Dövüldü, henüz boyanmadı — bu parçanın çizimi yolda.",

  slots: {
    weapon: "silahlar",
    equipment: "teçhizat",
    mascot: "maskotlar",
  },
  slotIntro: {
    weapon: "Kahramanının elinde tuttuğu şey.",
    equipment: "Kahramanının üzerine giydiği şey.",
    mascot: "Kahramanının yanı başında duran yaratık.",
  },
  slotsNav: "Eşya yuvaları",

  rarity: {
    common: "yaygın",
    uncommon: "az bulunur",
    rare: "nadir",
    epic: "epik",
    legendary: "efsanevi",
  },

  buy: "Satın al",
  buying: "Ödeniyor…",
  equip: "Kullan",
  equipping: "Kullanılıyor…",
  equipped: "Kullanımda",
  unequip: "Kullanımdan çıkar",
  missing: "{missing} altın eksik",
  buyAria: "{name} eşyasını {price} altına satın al",
  equipAria: "{name} eşyasını kullan",
  unequipAria: "{name} eşyasını kullanımdan çıkar",

  loadout: {
    title: "Donanımın",
    empty: "Henüz hiçbir şey kuşanılmadı. Aşağıdaki her şey seviyeyle değil, altınla açılır.",
    slotEmpty: "boş",
    open: "Cephaneliği aç",
  },

  err: {
    funds: "Bunun için altının henüz yetmiyor. Bir ders daha bitir ve geri gel.",
    locked: "Cephanelik sana henüz açılmadı — önce bir ders bitir.",
    "unknown-item": "Bu parça katalogda yok.",
  },

  items: {
    // ── silahlar ───────────────────────────────────────────────────────────
    "rune-dagger": {
      name: "Rün Hançeri",
      detail: "İlk çelik. Küçük, dürüst ve bir başlangıç için yeterince keskin.",
    },
    "iron-shortsword": {
      name: "Demir Kısa Kılıç",
      detail: "Ödünç yok, taşıma yok. Her silahtarın büyüyüp bıraktığı kılıç.",
    },
    "trustline-spear": {
      name: "Trustline Mızrağı",
      detail: "Erişim güvendir. Yalnızca vurulmayı kabul edene vurur.",
    },
    "twin-lumens": {
      name: "İkiz Lumen'ler",
      detail: "İki kılıç, tek denge. Biri diğeri olmadan kıpırdamaz.",
    },
    "forge-hammer": {
      name: "Forge'un Çekici",
      detail: "Dikişlerinde erimiş. Kırdığı şeyi, adını koyabileceğin parçalara ayırır.",
    },
    "soroban-staff": {
      name: "Soroban Asası",
      detail: "Sopanın ucunda bir kontrat. Sözleri söyle, dünya sözünü tutar.",
    },
    "ledger-scythe": {
      name: "Ledger Tırpanı",
      detail: "Kesici ucu bir sayfadır. Biçtiğini kimse silemez.",
    },
    "consensus-greatsword": {
      name: "Uzlaşmanın Büyük Kılıcı",
      detail: "Tek elle kaldırılamaz. Ancak tüm diyar hemfikir olduğunda iner.",
    },

    // ── teçhizat ───────────────────────────────────────────────────────────
    patchcloak: {
      name: "Silahtarın Yamalı Pelerini",
      detail: "Sıcak, çirkin ve senin. Her Forgeborn yamalarla başlar.",
    },
    "keeper-lantern": {
      name: "Muhafızın Feneri",
      detail: "Geri okuyan bir ışık taşır. Karanlıkta hiçbir şey arşivlenmez.",
    },
    "runed-bracers": {
      name: "Rünlü Kolçaklar",
      detail: "Bir hatayı sana pahalıya çıkmadan yakalayan kurallarla kazınmış.",
    },
    "sigil-pauldrons": {
      name: "Mühürlü Omuzluklar",
      detail: "Hangi kapılardan geçmene izin verildiğini hatırlayan çelik.",
    },
    "gem-cuirass": {
      name: "Mücevherli Göğüs Zırhı",
      detail: "Kalbinde tek bir taş; tuttuğun her durumu taşır.",
    },
    "starweave-cloak": {
      name: "Yıldız Dokuma Pelerin",
      detail: "Grafın kendisinden dokunmuş — döndüğünde gökyüzü kayar.",
    },
    "golden-aegis": {
      name: "Temiz Kalenin Kalkanı",
      detail: "Yedek parçası olmayan bir kalkan. Üzerinde hesabı verilmemiş hiçbir şey yok.",
    },
    "protocol-crown": {
      name: "Protokolün Tacı",
      detail: "Glifler, nihayet onları okumayı öğrenen başın çevresinde döner.",
    },

    // ── maskotlar ──────────────────────────────────────────────────────────
    "ember-wyrmling": {
      name: "Kor Yavru Ejderi",
      detail: "Forge'un külünde yumurtadan çıktı. Derleme hatalarını kemirir.",
    },
    "rune-sprite": {
      name: "Rün Perisi",
      detail: "Küçük, turkuaz ve ısrarcı. Yanlış yazdığın satırı işaret eder.",
    },
    "lumen-moth": {
      name: "Lumen Güvesi",
      detail: "Güvelerin ışığı izlediği gibi değeri izler — doğruca ödemeye.",
    },
    "golem-pup": {
      name: "Golem Yavrusu",
      detail: "Taş, rün ve sıfır terbiye. Ne ayırırsan getirir.",
    },
    "frost-drake": {
      name: "Ayaz Ejderi",
      detail: "Okuyabilmen için bir anı dondurur. Bununla da dayanılmaz biçimde övünür.",
    },
    "void-beholder": {
      name: "Boşluğun Beholder'ı",
      detail: "Bir büyük göz, bir sürü küçük göz. Golemin gördüğünü görür.",
    },
    "sky-leviathan": {
      name: "Gökyüzü Leviathanı",
      detail: "Buluttan ve yıldızdan bir yavru; şimdiden odaya sığmıyor.",
    },
    "solar-dragon": {
      name: "Güneş Ejderi",
      detail: "Forge'un yaptığı son şey. Yalnızca tamamlanmış bir kahramana boyun eğer.",
    },
  },
};
