import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "DEX ve likidite havuzları",
  tagline: "DEX ve likidite pool'ları: protokolün kendi içinde bir döviz bürosu.",
  steps: [
    {
      kind: "theory",
      body: `## Kasalar değil, nehirler

Düz bir \`payment\`'ı zaten parçalarına ayırdın: tek varlık, A'dan B'ye, ~5 saniyede kesin. O bir kanal — düz, işe yarar, sıkıcı.

İlginç kısım şu: Stellar'ın ledger'ı yalnızca bakiyelerden oluşan bir kasa değil. **Protokolün içinde eksiksiz bir döviz borsası** taşıyor: emir defterleri, likidite pool'ları ve *yol boyunca takas yapan* ödeme operasyonları.

Dış borsa yok, köprü yok, wrapped token dolambacı yok — dönüşüm ledger'ın yerli bir gücü. Bu bölüm suyu takip ediyor: önce teklifler, sonra pool'lar, sonra da havaleleri sihir gibi hissettiren operasyon.`,
    },
    {
      kind: "theory",
      body: `## Ledger'ın *üstünde* bir emir defteri

**Stellar DEX** birinin deploy ettiği bir kontrat değil — protokol makinesi.

- \`manage_sell_offer\` / \`manage_buy_offer\` bir teklif koyar: *"X veriyorum, Y istiyorum, bu fiyattan."*
- Her teklif bir **ledger kaydıdır**; başka her state gibi emir defterinde durur.
- **Eşleştirme ledger kapanışında olur**: teklifler kesiştiğinde protokol takası, konsensüsün bir parçası olarak kendisi yürütür.

Her varlık çifti otomatik olarak bir emir defteri alır — listeleme yok, piyasa operatöründen izin yok. İki trustline ve bir teklif; piyasa *sensin*.`,
    },
    {
      kind: "quiz",
      question: `Stellar DEX'te bir alış teklifini bir satış teklifiyle kim eşleştirir?`,
      options: [
        "Protokolün kendisi, ledger kapanışında — teklifler ledger kaydıdır ve eşleştirme konsensüsün parçasıdır",
        "SDF'nin bakımını yaptığı bir eşleştirme motoru akıllı kontratı",
        "Eşleşmiş çiftleri komisyon karşılığı gönderen off-chain relayer'lar",
      ],
      answer: 0,
      explain: `Bu, borsanın protokolün *içinde* yaşadığı nadir zincir. Deploy edilmiş bir eşleştirici olmaması, hack'lenecek, rüşvet verilecek ya da rug'lanacak bir eşleştirici olmaması demek — ve takaslar ödemelerle aynı kesinlikle sonuçlanır.`,
    },
    {
      kind: "theory",
      body: `## Pool'lar: durgun su

Emir defterleri fiyat veren aktif trader'lara ihtiyaç duyar. **Likidite pool'ları** yalnızca mevduata ihtiyaç duyar:

- Herhangi biri bir **sabit çarpım pool'una** bir varlık çifti yatırır — Uniswap'in meşhur ettiği aynı x · y = k eğrisi.
- Takaslar oranı iter; arbitraj geri çeker; mevduat sahipleri her swap'ta küçük bir ücret kazanır.
- Stellar'da bu pool'lar **protokole yerli ledger kayıtlarıdır** — kontrat değil — \`liquidity_pool_deposit\` ve \`liquidity_pool_withdraw\` ile yönetilir.

Defterler ve pool'lar eşit koşullarda bir arada yaşar ve — birazdan göreceğin gibi — tek bir ödeme her ikisinden de içebilir.`,
    },
    {
      kind: "theory",
      body: `## Aynı takas, iki mekân

Defterler ve pool'lar, birinin kazandığı rakipler değil. Zıt yönlerde başarısız olurlar ve ledger ikisini de bilerek taşır.

Diyelim ki 5.000 USDC'lik XLM istiyorsun.

**Emir defteri** seni insanların gerçekten koyduğu tekliflerle doldurur. Bir piyasa yapıcı dar fiyat veriyorsa, kimsenin geçemeyeceği bir fiyat alırsın — gerçek teklifler, gerçek fiyatlar, eğri yok. Bu sabah o çifte kimse bakmıyorsa defter incedir ya da boştur; kötü dolarsın ya da hiç dolmazsın. Bir defterin kalitesi, birinin dikkatidir.

**Pool** her zaman fiyat verir. Fikri yok, mesai saati yok, izin günü yok — kimse uyanık olsun olmasın eğri emrini fiyatlar. Bu güvenilirlik için aldığı bedel slippage'dır: sabahın üçünde, karşında kimse yokken takas yapabilme ayrıcalığının parasını ödersin.

Yani dürüst özet sıkıcı: **biri başında durduğunda defter daha iyidir, kimse durmadığında pool.** Aggregator'ların var olma nedeni tam da bu — ve mekânı elle seçmemen gerekmesinin de.`,
    },
    {
      kind: "widget",
      component: "amm-pool",
      body: `Eğri okunmaktan çok hissedilir. **Pool'a sat** — sonra aynı emri daha sığ bir pool'a taşı ve fiyatın sana ne yaptığını izle.`,
    },
    {
      kind: "quiz",
      question: `Stellar'ın yerli likidite pool'ları Uniswap tarzı AMM'lerden nasıl ayrılır?`,
      options: [
        "Protokol özellikleridir — deploy edilmiş kontratlar değil, operasyonlarla yönetilen ledger kayıtları",
        "Fiyat eğrisi yerine içeride emir defteri eşleştirmesi kullanırlar",
        "Yalnızca XLM içeren çiftleri desteklerler",
      ],
      answer: 0,
      explain: `Aynı sabit çarpım matematiği, farklı bir yuva: pool protokolün kendisinde yaşar, her varlık çifti buyursun. Kontrat tabanlı AMM'ler de var, bir kat yukarıda — adlarıyla birazdan tanışacaksın.`,
    },
    {
      kind: "fill",
      prompt: `Sabit çarpım pool'unun gerçekte neyi vadettiğini tamamla:`,
      file: "NOTES.md",
      before: `Bir pool sana her zaman bir fiyat verir. Vadetmediği şey, fiyatın yerinde durmasıdır — emrin pool'a göre ne kadar büyükse, `,
      after: ` .`,
      choices: [
        "sonunda ödediğin fiyat o kadar kötü olur",
        "senden kesilen ücret o kadar küçük olur",
        "takasın kesinleşmesi o kadar uzun sürer",
        "takasın reddedilme ihtimali o kadar artar",
      ],
      answer: 0,
      explain: `Pool tükenemez ve seni reddedemez — eğrinin bütün amacı bu. Bunun yerine yaptığı, bir tarafı boşalttıkça her birim için senden daha fazla almaktır; yani küçük bir pool'daki büyük bir emir kusursuzca ve pahalıya tamamlanır.`,
    },
    {
      kind: "theory",
      body: `## Bunu asla elle yapmayacaksın

Artık ledger'ın içinde bir piyasa olduğunu biliyorsun: kapanışta eşleşen defterler, bir eğriden fiyat veren pool'lar ve üstüne yaslandığında hareket eden bir fiyat.

İşte onu işe yarar kılan kısım: **bunların hiçbiriyle neredeyse hiç doğrudan etkileşmeyeceksin.** Teklif koymayacak, defteri gezmeyecek, pool seçmeyeceksin. Ne gönderdiğini ve ne gelmesi gerektiğini söyleyeceksin — alışverişi başka bir şey yapacak.

**Sırada:** bu koca makineyi senin adına, tek bir atomik adımda harcayan operasyon.`,
    },
  ],
  testOut: [
    {
      question: `Stellar DEX'te bir alış teklifini bir satış teklifiyle kim eşleştirir?`,
      options: [
        "Protokolün kendisi, ledger kapanışında — teklifler ledger kaydıdır ve eşleştirme konsensüsün parçasıdır",
        "SDF'nin bakımını yaptığı bir eşleştirme motoru akıllı kontratı",
        "Eşleşmiş çiftleri komisyon karşılığı gönderen off-chain relayer'lar",
      ],
      answer: 0,
    },
    {
      question: `DEX'te yeni bir varlık çifti için piyasa yaratmak ne gerektirir?`,
      options: [
        "İki trustline ve bir teklif — her çift otomatik olarak bir defter alır, listeleme de izin de yok",
        "Hangi çiftlerin takas edilebileceğini seçen SDF'ye başvuru",
        "O çift için bir piyasa kontratı deploy etmek",
      ],
      answer: 0,
    },
    {
      question: `Bir emir defteri fiyat veren aktif trader'lara ihtiyaç duyar. Likidite pool'u bunun yerine neye ihtiyaç duyar?`,
      options: [
        "Yalnızca mevduata — sabit çarpım eğrisi kimse bakmadan her an bir fiyat verir",
        "Pool'un ücretlerden ödediği bir piyasa yapıcı bot'a",
        "Ona güncel dış fiyatı besleyen bir oracle'a",
      ],
      answer: 0,
    },
    {
      question: `Emrin pool'a göre büyük. Ne olur?`,
      options: [
        "Tamamlanır, giderek kötüleşen bir fiyattan — bir tarafı boşalttıkça eğri her birim için daha fazla alır",
        "Reddedilir, çünkü pool onu karşılayamaz",
        "Yeterli likidite yatırılana kadar sıraya alınır",
      ],
      answer: 0,
    },
  ],
};
