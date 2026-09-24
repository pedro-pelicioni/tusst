import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Context engineering",
  tagline: "Bağlam mühendisliği: yığmak değil, seçmek.",
  steps: [
    {
      kind: "theory",
      body: `## Yığmak değil, seçmek

Prompt mühendisliği *nasıl ifade edileceğini* sorar. **Bağlam mühendisliği** daha önemli soruyu sorar: *modelin önüne ne konacak?*

Refund yolundaki bir bug için üç şeye ihtiyacı var:

- **refund modülü** — gerçekten devrede olan kod,
- **spec'teki refund kuralları** — Bölüm I'in artefaktı,
- **başarısız olan test** — Ritüel'in artefaktı; "düzeldi"nin tam olarak ne demek olduğunu söyler.

Bütün repo değil. Geçen ayın migration notları değil. Beceri *seçmektir*: doğru iki yüz satır, kod tabanının bütün külliyatını yener.`,
    },
    {
      kind: "theory",
      body: `## Tek bir tezgâh, kurulmuş halde

Refund bug'ı, gerçekten. Tezgâha ne konuyor — boyutu ve gerekçesiyle:

- \`refunds.rs\` (180 satır) — yanlış olan kod. Onu çağıran modül değil; karar veren.
- Spec'teki üç refund maddesi (14 satır) — böylece "doğru"nun, modelin fikri olmayan bir tanımı olur.
- \`test_refund_after_deadline\` ve başarısız çıktısı (20 satır) — kırmızı olan tek sınav ve gerçekte ne yazdırdığı.

Ve dışarıda kalanlar — zor olan yarı:

- \`payments.rs\`; refund'lar payments'ın altında yaşasa bile — bug orada değil ve **tezgâhtaki her dosya, modelin iyileştirmeye karar verebileceği bir dosyadır**.
- Son tarihi getiren sürümün migration notları. O zamandan beri iki kez değişmiş bir şemayı anlatıyorlar ve bayat malzeme kendinden emin öğretir.
- Test suite'inin geri kalanı. Altı yüz satır yeşil, kırmızı olan tek satır hakkında hiçbir şey söylemez.

Kırk bin satırlık bir repo'ya karşı kabaca 210 satır. O oran, işin *ta kendisi*.`,
    },
    {
      kind: "diagram",
      body: "Gönderdiğini sandığın şey ve gerçekte ulaşan:",
      caption:
        "Bağlam bir kap değil, bir bütçedir. Eklediğin her şey, oraya zaten koyduğun her şeyle yarışır.",
      view: {
        kind: "compare",
        columns: [
          { id: "you", label: "kastettiğin", tone: "neutral" },
          { id: "model", label: "onun aldığı", tone: "accent" },
        ],
        rows: [
          {
            label: "görev",
            cells: [
              { text: "\"şu bug'ı düzelt\"", tone: "neutral" },
              { text: "üç kelime, başarısız çıktı yok, dosya yok", tone: "accent" },
            ],
          },
          {
            label: "kod tabanı",
            cells: [
              { text: "\"hepsi repo'da\"", tone: "neutral" },
              { text: "sığan ne varsa — genelde yanlış yarısı", tone: "accent" },
            ],
          },
          {
            label: "standart",
            cells: [
              { text: "\"üslubumuzu biliyorsun\"", tone: "neutral" },
              { text: "hiçbir şey; review yorumlarını hiç görmedi", tone: "accent" },
            ],
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "context-window",
      body: `İşte o bütçe. **Tezgâhı yükle** ve iki sayının aynı anda oynamasını izle — ne kadar yer kaldığı ve oradakilerin ne kadarının gerçekten görevle ilgili olduğu.`,
    },
    {
      kind: "quiz",
      question: `Modeli refund yolundaki bir bug'ı düzeltmeye gönderiyorsun. Tezgâha ne konur?`,
      options: [
        "Refund modülü, spec'in refund kuralları ve başarısız test — ve başka pek az şey",
        "Bütün repo; böylece ilgili olabilecek hiçbir ayrıntı eksik kalmaz",
        "Yalnızca hata mesajı — herhangi bir kod bağlamı taze bakışını yanlı kılar",
      ],
      answer: 0,
      explain: `Aç bırakmak da boğmak da hata modudur: çok az bağlam tahmine zorlar, ayrım gözetmeyen bağlam ise sinyali gömer ve hiç istemediğin düzenlemelere davetiye çıkarır. Seçmek — ilgili modül, spec, sınav — zanaatın ta kendisidir.`,
    },
    {
      kind: "theory",
      body: `## Bağlam çürümesi

İşte sezgiye aykırı kısım: ilgisiz bağlam sadece yer harcamaz — **aktif olarak zarar verir**.

- Dikkat dağıtan bir dosya, modeli ona "yardımcı olmak için" dokunmaya davet eder.
- Karışık sözlükler yanlış Account modelini içeri çeker — Bölüm III'ün kâbusu, kendi elinle.
- Bayat dokümanlar ve ölü kod, eski davranışı güncelmiş gibi öğretir.
- Ve tezgâh uzadıkça dikkat incelir: o tek kritik kısıtın artık on bin token'lık gürültüyle yarışıyor.

Seçmek iki yöne de keser. **Tezgâhtan çıkarmak, tezgâha eklemek kadar güçlüdür.**`,
    },
    {
      kind: "quiz",
      question: `Kalabalık bir tezgâhta en çok zararı hangisi verir?`,
      options: [
        "Modülün eskiden nasıl çalıştığını anlatan bayat bir doküman — eski davranışı güncelmiş gibi öğretir",
        "Sadece ilgisiz olan ve görmezden gelinen uzun bir dosya",
        "Prompt'un bölümleri arasındaki fazladan boş satırlar",
      ],
      answer: 0,
      explain: `İlgisiz malzeme sana yer ve dikkat kaybettirir. *Çelişkili* malzeme ise doğruluk kaybettirir: modelin, gerçeğin iki anlatımından hangisinin güncel olduğunu bilmesinin hiçbir yolu yoktur ve kendinden emin ama yanlış, en pahalı hata modudur.`,
    },
    {
      kind: "fill",
      prompt: `Bu disiplini prompt yazmaktan ayıran satırı tamamla:`,
      file: "NOTES.md",
      before: `Bağlam bir kap değil, bir bütçedir — bu yüzden tezgâhtan çıkarmak `,
      after: ` .`,
      choices: [
        "tezgâha eklemek kadar güçlüdür",
        "yalnızca yer kalmadığında yapmaya değer",
        "modelin kafası karışınca başvurulan son çaredir",
        "model tarafından otomatik olarak halledilir",
      ],
      answer: 0,
      explain: `Bütün bölüm tek satırda. İfade, bir öğleden sonrada çalışabileceğin bir beceri; modelin neyi asla görmeyeceğine karar vermekse zor kalan kısım — çalışan bir tezgâhı dolu bir tezgâhtan ayıran kısım.`,
    },
    {
      kind: "theory",
      body: `## Bu neden son sessiz bölüm

Şimdiye kadar model her seferinde tek bir şey yaptı: tezgâhı sen kurdun, isteği sen yazdın, cevabı sen okudun. Döngü hâlâ sensin.

Kendi çıktısı üzerinde hareket etmeye başladığı an — az önce yazdığı testi çalıştırmak, başarısızlığı okumak, yeniden denemek — buradaki her şey birikerek katlanır. Yalnızca dağınık olan bir tezgâh, attığı her adımla kendi kendine büyüyen bir tezgâha dönüşür.

**Sırada:** hareket eden, gözlemleyen ve düzelten döngü — ve ona ne zaman duracağını nasıl söyleyeceğin.`,
    },
  ],
  testOut: [
    {
      question: `Bağlam mühendisliği, prompt mühendisliğinin sormadığı hangi soruyu sorar?`,
      options: [
        "Modelin önüne ne konacak — ki bu bir ifade değil, seçim sorusudur",
        "Talimatı, modelin yanlış okuyamayacağı biçimde nasıl kelimelere dökeceğin",
        "Görevin hangi modele gönderileceği",
      ],
      answer: 0,
    },
    {
      question: `İlgisiz bağlam neden sadece israftan daha kötüdür?`,
      options: [
        "Dikkat dağıtan bir şey, hiç istemediğin düzenlemelere davetiye çıkarır; bayat malzeme ise eski davranışı güncelmiş gibi öğretir",
        "Cevabı, iş akışını bozacak kadar yavaşlatır",
        "Modeller daha uzun girdi için daha çok ücret alır, yani bu sadece bir maliyet sorunudur",
      ],
      answer: 0,
    },
    {
      question: `Üç ilgili dosya yerine bütün repo'yu göndermek sana ne kazandırır?`,
      options: [
        "Bütçeye sığan ne varsa — ve hangi yarısının sığdığını seçme hakkın yoktur",
        "Daha yavaş bir cevap pahasına eksiksiz bir resim",
        "Aynı sonucu, çünkü modeller ilgisiz olanı görmezden gelir",
      ],
      answer: 0,
    },
    {
      question: `Bu bölümde iki hata modunun da adı var. Nedir bunlar?`,
      options: [
        "Aç bırakmak — çok az, o yüzden tahmin eder; ve boğmak — o kadar çok ki sinyal gömülür",
        "Overfitting ve underfitting",
        "Cold start ve bağlam çürümesi",
      ],
      answer: 0,
    },
  ],
};
