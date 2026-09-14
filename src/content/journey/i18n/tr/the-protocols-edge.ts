import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Protokolün Keskin Ucu",
  tagline: "CAP'ler, SEP'ler ve adlı sürümler: yaşayan bir protokolün dalgasına binmek.",
  steps: [
    {
      kind: "theory",
      body: `## Seviye atlayan bir protokol

Çalıştığın her şey — SCP, path payment'lar, Soroban, ZK host function'ları — **numaralı protokol sürümleriyle** geldi ve yenileri gelmeye devam ediyor.

Stellar'da yükseltmeler kaotik hard fork'lar değil. **Validator'lar oy verir**: ağın yeterince büyük bir kısmı hemfikir olduğunda yükseltme seçilen bir ledger'da (defterde) etkinleşir ve her düğüm **birlikte** ileri adım atar. Öncesinde tek ağ, sonrasında tek ağ.

Bu, SCP'nin çifte mesai yapması — işlemler üzerinde uzlaşan aynı konsensüs, *kuralların kendisi* üzerinde de uzlaşıyor. Bir blockchain yazılımdır; bu blockchain, bunun farkındaymış gibi sürüm çıkarıyor.`,
    },
    {
      kind: "theory",
      body: `## Değişimin iki nehri: CAP'ler ve SEP'ler

Değişim iki kanaldan akar ve bu ayrımı ezberlemeye değer:

- **CAP'ler** — *Core Advancement Proposals* — **protokolün kendisini** değiştirir: konsensüs, ledger kuralları, yeni host function'lar, ücret mekanikleri. Validator oyu gerektirirler, çünkü her düğüm birebir aynı şekilde çalıştırmak zorunda.
- **SEP'ler** — *Stellar Ecosystem Proposals* — zincirin **çevresindeki** standartlar: cüzdan-anchor akışları, token arayüzleri, stellar.toml. Oyla değil, uygulanarak benimsenirler.

Zincir hukuku ile ticaret teamülü. CAP-59 sana ZK eğrilerini verdi; SEP-24 sana deposit akışlarını. Farklı nehirler; ikisi de herkese açık, ikisi de açık tartışmayla şekilleniyor.`,
    },
    {
      kind: "diagram",
      body: "Bir değişiklik, üzerine inşa ettiğin ledger'a nasıl ulaşır:",
      caption: "Kodunu kimse senin yerine yükseltmez — ama kimse de bir gecede ayağının altındaki kuralları değiştirmez.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "draft",
            label: "bir CAP taslağı yazılır",
            note: "Herkes yazabilir. Protokolün kendisinde bir değişikliği savunur.",
            tone: "neutral",
          },
          {
            id: "review",
            label: "açıkta inceleme",
            note: "Tartışılır, gözden geçirilir ve sık sık reddedilir. Yavaş kısım burası — bilerek.",
            tone: "accent",
          },
          {
            id: "vote",
            label: "validator'lar oylar",
            note: "Ağ, ancak yeterince validator onu çalıştırmayı kabul ettiğinde yükselir.",
            tone: "teal",
          },
          {
            id: "you",
            label: "sıra sende",
            note: "SDK'yı yükselt, testlerini yeniden koştur, yeniden deploy et. Tarih aylar öncesinden herkese açık.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `(a) protokole yeni bir host function ve (b) yeni bir cüzdan-anchor akışı istiyorsun. Hangi belgeleri yazarsın?`,
      options: [
        "(a) bir CAP — core'u değiştiriyor; (b) bir SEP — bir ekosistem standardı",
        "(a) bir SEP — host function'lar ekosistemdir; (b) bir CAP — anchor'lar core'dur",
        "İkisi de CAP — SEP'ler yalnızca token listelemeleri içindir",
      ],
      answer: 0,
      explain: `Test şu: her validator onu birebir aynı çalıştırmak zorunda mı? O zaman core'dur — bir CAP. Servislerin HTTP üzerinden anlaştığı bir gelenekse, bir SEP.`,
    },
    {
      kind: "theory",
      body: `## Son dönemin temposu, adlarıyla

Yükseltmelerin artık adları var ve ritim hızlı:

- **Protocol 26 "Yardstick"** — bir hassasiyet ve güvenilirlik sürümü; Protocol 25 ile birlikte geçen bölümdeki BN254 + Poseidon ZK araç setini tamamladı.
- **Protocol 27 "Zipper"** — mainnet **Temmuz 2026**; smart account'lar için **CAP-71** kimlik doğrulama delegasyonunu taşıyor.
- **Protocol 28 "Adapter"** — **testnet 27 Ağustos 2026'da yükseltildi**; mainnet **16 Eylül 2026** için planlandı.

Yaklaşık bir mevsim arayla, her biri adlı, her biri yükseltme rehberleriyle duyurulmuş. Diyar geleceğe sürüklenmiyor — yayınlanmış bir takvimle yürüyor.`,
    },
    {
      kind: "theory",
      body: `## Bir yükseltme senden ne ister

Bir protokol sürümü aynı zamanda bir **araç sürümüdür**. SDK major'ları protokol sürümlerini takip eder: **js-stellar-sdk v17.0.0, Protocol 28 sürümüdür** — ağ 28'e adım attığında sen de onun için inşa edilmiş SDK'ya adım atarsın.

İnşacının talimi:

1. Sürüm duyurulduğunda **yükseltme rehberini** oku.
2. SDK'ları ve CLI'ı bir branch'te yükselt.
3. **Pencere açıkken testnet'te test et** — testnet, tam da bunu yapabil diye mainnet'ten haftalar önce yükselir.

Ağustos 2026 sonu itibarıyla o pencere **şu an açık**: testnet zaten 28'de; mainnet 16 Eylül'de takip ediyor.`,
    },
    {
      kind: "quiz",
      question: `Eylül 2026'nın başı ve uygulaman mainnet'te (Protocol 27) çalışıyor. Profesyonel hamle ne?`,
      options: [
        "Staging'i — zaten Protocol 28'de olan — testnet'e yönelt, SDK v17'ye güncelle ve mainnet 16 Eylül'de yükselmeden sorunları düzelt",
        "Hiçbir şey yapma — mainnet yükseltmeleri eski SDK'larla her zaman tamamen uyumludur",
        "Protokol bir yıl boyunca stabilleşene kadar tüm deploy'ları dondur",
      ],
      answer: 0,
      explain: `Önce-testnet penceresi tam olarak bu prova için var. Çoğu yükseltme pürüzsüz geçer — ama "geliştiriciler SDK'larını güncellemeli" cümlesi Protocol 28 duyurusunda boşuna yazmıyor.`,
    },
    {
      kind: "fill",
      prompt: `Protocol 28 konuşan SDK'yı sabitle.`,
      file: "package.json",
      before: `"@stellar/stellar-sdk": "`,
      after: `"`,
      choices: ["^17.0.0", "^16.2.0", "^28.0.0", "^2.8.0"],
      answer: 0,
      explain: `Major'lar protokolleri takip eder ama numaralar farklıdır: v17, Protocol 28 sürümüdür (v17.0.1 25 Ağustos 2026'da çıktı); daha eski major'lar daha eski protokolleri hedefler. Sürüm başlığını okumak, bir SDK'nın hangi ağ sürümünü konuştuğunu söyler.`,
    },
    {
      kind: "theory",
      body: `## Ucu gözlemek

Yaşayan bir protokolün dalgasına binmek kahramanca bir çaba değil, bir okuma alışkanlığıdır:

- **stellar.org dev blog** — yükseltme duyuruları, tarihler ve "inşacılar ne yapmalı" rehberleri.
- GitHub'daki **CAP deposu** — öneriler çıkmadan çok önce; bugünün taslağı gelecek yılın host function'ı.
- **Açık protokol toplantıları** — CAP'lerin herkesin önünde tartışıldığı yer.

Ayda yarım saat, seni bu bölümdeki her son tarihin önünde tutar. Yükseltme notlarını okuyan inşacı dalgaya biner; okumayan sürüm dışı kalır.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-protocol-27-1",
      body: `Kampanya'nın **Perde VIII**'i bu bölümü gerçekten yapıyor: çalışan bir projeyi kendi ellerinle bir protokol yükseltmesinden geçiriyorsun — SDK'ları yükseltmek, sürüm notlarını okumak, profesyonel bir ekip gibi yeni sürüme karşı test etmek.

Ve böylece diyarın haritası çıkarıldı — konsensüsten kontratlara, kapılardan örtülere, uçtan uca. Geriye en iyi kısım kalıyor: **git ve içinde inşa et**. Forge açık.`,
    },
  ],
  testOut: [
    { question: `CAP nedir ve SEP'ten nasıl ayrılır?`,
      options: ["CAP protokolün kendisini değiştirir ve numaralı bir sürümle çıkar; SEP servislerin birbiriyle nasıl konuştuğunu standartlaştırır ve protokol değişikliği gerektirmez",
        "CAP taslaktır, SEP onun onaylanmış halidir",
        "CAP kontratları yönetir, SEP klasik operasyonları"], answer: 0 },
    { question: `Protokol yükseltmelerinin numaralı ve adlı olması neden önemli?`,
      options: ["Bir özellik belirli bir protokol sürümünden itibaren var olur; yani \"Stellar bunu destekliyor mu?\" aslında \"bu ağ hangi protokolde?\" demektir",
        "Numaralandırma, validator'ların değişiklikleri hangi sırayla uygulayacağını belirler",
        "Adlı sürümler, SDF'nin production'da desteklediği tek sürümlerdir"], answer: 0 },
    { question: `Bir özellik testnet'te canlı ama mainnet'te henüz değil. Bu sana ne söyler?`,
      options: ["Protokol sürümü önce testnet'e ulaştı — ona karşı inşa etmek serbest, gerçek kullanıcılara göndermekse mainnet takip edene kadar değil",
        "Özellik reddedildi ve testnet onun emekliye ayrıldığı yer",
        "Hiçbir şey; testnet ve mainnet her zaman aynı protokolü çalıştırır"], answer: 0 },
    { question: `Bir inşacı neden yalnızca dokümantasyonu değil, protokolün changelog'unu da okumalı?`,
      options: ["Dokümantasyon şu an neyin doğru olduğunu anlatır; changelog ise neyin doğru olmak üzere olduğunu — hem de hazırlanmaya vakit varken — gördüğün yerdir",
        "Dokümantasyon sık sık güncelliğini yitirir ve changelog onun yerini alır",
        "Changelog tek yetkili API referansını içerir"], answer: 0 },
  ],
};
