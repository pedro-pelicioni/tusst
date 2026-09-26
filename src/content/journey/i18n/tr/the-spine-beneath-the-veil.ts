import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Özel ödemeler ve uyumluluk",
  tagline: "Private payments ve uyumluluk: karşı tarafları gizle, denetlenebilir kal.",
  steps: [
    {
      kind: "theory",
      body: `## Stellar Private Payments: karşı tarafları örtmek

Bir örtü daha derine. **Nethermind** tarafından inşa edilen **Stellar Private Payments (SPP)**, **Ağustos 2026'da testnet'te geliştirici ön izlemesine** ulaştı.

Bir token'ı sarmak yerine kullanıcılar **varlıklarını ortak bir pool'a yatırır**. Transferler sonra pool'un *içinde* gerçekleşir — ve dışarıdaki bir gözlemci artık göndereni alıcıya bağlayamaz. Yalnızca tutarlar değil: **karşı tarafların kendileri gizlidir**.

Confidential Token'lar birbirini tanıyan taraflara uyarken SPP, *kimin kime ödediğinin* bizzat sır olduğu durumları kapsar — bağışlar, hassas tedarikçi ilişkileri, halka açık raylarda kişisel finans.`,
    },
    {
      kind: "diagram",
      body: "Bir ödemeyi pool'un içinden takip et ve explorer'ın elinde ne kaldığına bak:",
      caption:
        "Kenarlar yapı gereği herkese açık. Pool'un koruduğu her şey, ikisinin arasında olur.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "deposit",
            label: "Yatırma",
            tone: "gold",
            note: "Görünür. Explorer, bu hesabın pool'a para taşıdığını ve ne kadar taşıdığını kaydeder. Burada gizli olan hiçbir şey yok — olması da gerekmiyor.",
          },
          {
            id: "inside",
            label: "Pool'un içi",
            tone: "accent",
            note: "Gizli. Pool üyeleri arasındaki transferlerin zincir üstünde hiç görünmesi gerekmez: gönderen yok, alıcı yok, tutar yok. Örtünün kapattığı kısım bu.",
          },
          {
            id: "withdraw",
            label: "Çekme",
            tone: "gold",
            note: "Yine görünür. Biri pool'dan bir değerle çıkıyor — ama BU çıkışı ŞU girişe bağlamak, pool'un kırdığı şeyin ta kendisi.",
          },
          {
            id: "observer",
            label: "Gözlemcinin elinde kalan",
            tone: "neutral",
            note: "İki herkese açık kenar ve arada bir kalabalık. Pool büyüdükçe, herhangi bir giriş ile herhangi bir çıkış arasındaki bağ zayıflar.",
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "explorer-view",
      body: `Bu katmanlar arasındaki seçim, ne kadar özel olabileceğinle ilgili değil. **Hangi alanın kararması gerektiğiyle** ilgili. Katmanları değiştir ve gözlemcinin sütununu oku.`,
    },
    {
      kind: "theory",
      body: `## Uyumluluk omurgası

Sınırsız "özel", bir yaptırım sorumlusunun kâbusudur ve bu tasarımlar oraya gitmeyi reddeder. SPP, gizliliği **yerleşik uyumluluk güvenceleriyle** birleştirir:

- **KYC kapılı katılım** — pool'a katılmak doğrulanmış kimlik gerektirir.
- **Kimlik seviyesinde erişim kontrolleri** — izinler yalnızca hangi anahtarı tuttuğuna değil, *kim olduğuna* bağlanır.
- **Hesap seviyesinde dondurma yeteneği** — kötü aktörler örtünün içinde bile durdurulabilir.

Bu üç güvence, adıyla bilmeye değer bir parça tarafından uygulanır: **Association Set Provider (ASP)**. Bir ASP, kefil olduğu yatırmaların bir *kümesini* yayımlar — bir izin listesi — ya da kefil olmayı reddettiklerini — bir ret listesi. Para çekmek için, fonlarının o kümenin içindeki bir yatırmaya kadar izlenebildiğini **hangisi olduğunu açıklamadan** kanıtlarsın. SPP bunu anahtar tabanlı bir association set üzerine kurar; katılımcılara referans verilebilsin diye arkasında herkese açık bir anahtar kaydı vardır.

Sonucun üstünde biraz dur, çünkü numaranın tamamı bu: **aynı çekme işlemi aynı anda hem özel hem denetlenebilir**. Özel, çünkü senin belirli yatırmana giden bağ asla yayımlanmaz. Denetlenebilir, çünkü kefil olunmuş bir kümeye üyeliğini kanıtlamadan çekemezdin. Farklı ASP'ler farklı yargı alanlarına hizmet edebilir — ve hangisinin sana kefil olacağını sen seçersin.

Hedef tek satırda: **suç için değil, kullanıcılar için gizlilik**. Halka açık raylarda gizli *ve* uyumlu transferler — kurumların beklediği şey ham gizlilik değil, işte bu bileşim.`,
    },
    {
      kind: "quiz",
      question: `Bir explorer, bir Confidential Token transferi ile bir SPP pool transferini izliyor. Her birinde ne görür?`,
      options: [
        "CT: iki adresi görür ama tutarı görmez; SPP: karşı tarafları bile görmez — değer ortak pool'un içinde hareket etti",
        "İkisi de tutarları ve adresleri aynı şekilde gizler — SPP yalnızca daha ucuz olanı",
        "CT adresleri gizler ama tutarları gösterir; SPP, KYC'den geçmiş izleyicilere her şeyi gösterir",
      ],
      answer: 0,
      explain: `İki katman, iki örtü. Confidential Token'lar tanışık taraflar arasında *ne kadar* olduğunu gizler; SPP'nin ortak pool'u *kimi* de gizler. Kullanım senaryonun sessiz tutması gerekene uyan katmanı seç.`,
    },
    {
      kind: "quiz",
      question: `Canlı pool'da \`get_asp_non_membership_root()\` çağırıyorsun ve cevap **0**. Bu sana gerçekte ne söylüyor?`,
      options: [
        "Blocklist boş — ve 0, kontratın her çekme işlemini karşılaştırdığı değer; dolayısıyla boş bir liste eksik değil, uygulanan bir politika",
        "Çağrı başarısız olup varsayılana düştü: bir Merkle kökü asla meşru olarak sıfır olmaz",
        "Blocklist gizli, bu yüzden kontrat ASP olmayan herkese 0 döndürüyor",
      ],
      answer: 0,
      explain: `Boş bir ağacın da gerçek bir kökü vardır ve bu blocklist için o kök tam anlamıyla 0'dır — yani "kimse yasaklı değil" kuralı ayarlanmamış bırakılmak yerine her harcamada aktif olarak uygulanıyor. Şimdi komşusunu dene: \`get_asp_membership_root()\` cevap olarak 2302223575749844940221218608817648865122641281382153518325924961250440546344 veriyor; **o da boş** olan bir ağaç için etkileyici görünen bir sayı. O, boş ağacın sıfır hash'i. Bunu "izin listesinde üyeler var" diye okumak bütün bu konudaki en kolay hata ve sen az önce ondan kurtuldun.`,
    },
    {
      kind: "theory",
      body: `## Git ve birinin içine bak

Yukarıdakilerin hepsi şu anda, gerçekten var olan bir pool'da kontrol edilebilir. Nethermind'ın geliştirici ön izlemesi testnet'te canlı ve okuma fonksiyonları **cüzdansız ve imzasız** cevap veriyor. Bu şeyin müşterisi değilsin — seyircisisin ve seyretmek bedava.

[Forge](/ide)'u aç, **Explore**'a geç ve bilinen kontratlardan **SPP privacy pool · XLM**'i seç. Sonra ona şu sırayla sor:

- \`get_policy_flags()\` — bu pool nasıl yapılandırılmış. Cevap **2**: blocklist uygulanıyor, izin listesi yok.
- \`get_root()\` — buraya şimdiye kadar yatırılmış her not'a bağlanan Merkle kökü. Bütün anonimlik kümesinin yerine duran tek bir sayı.
- \`is_known_root(<o sayı>)\` — **true**. Şimdi tek bir rakamı değiştir ve tekrar sor: **false**. Az önce pool'un kendi hatırlanan kökler halkasında yürüdün.
- \`is_spent(<herhangi bir sayı>)\` — **false**. Bu, nullifier kümesi: pool'un çifte harcamaya karşı savunması ve bir çekme işleminin kendisi hakkında yayımladığı neredeyse tek şey.

Bunları sırayla oku ve *eksik* olana dikkat et. O cevapların hiçbiri bir adres, bir tutar ya da bir karşı taraf içermiyor.

**İki uyarı, çünkü bir kontratın spec'i seni kendisi hakkında uyaramaz.** Bu pool, kibarca cevap verip hiçbir anlam taşımayan beş artık fonksiyon açığa çıkarıyor — \`balance\`, \`transfer\`, \`approve\` ve arkadaşları; Forge onları seni kandıramasınlar diye *yem* olarak işaretliyor. Ve ön izlemenin state'i **TTL**'lere bağlı. Bir TTL dolduğunda girdiler kaybolmaz, arşivlenir: okumalar yine cevap verir, bir sonraki yazma ise önce onları bir ücret karşılığında geri yükler. Bu, Soroban state kirası; bu ağdaki her kontrat onun altında yaşar — Forge kontratın saatini zincirden okur ve süre dolmaya yaklaşınca seni uyarır.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `Forge'da: bir **Confidential Token'lar** lab'ı; orada bir testnet token'ını saracak ve transfer hâlâ dürüstçe sonuçlanırken tutarların explorer'dan kaybolmasını izleyeceksin. Şimdilik kartında *hazırlanıyor* yazıyor.

Bu tarihlerin ne kadar taze olduğuna dikkat et. Bu kadar yeni bir teknolojiyle çalışmak, protokol yükseltmelerini yakından takip etmek demek — son bölüm sana nasıl olduğunu gösteriyor.`,
    },
  ],
  testOut: [
    {
      question: `Bir SPP pool'u karşı tarafları nasıl gizler?`,
      options: [
        "Kullanıcılar ortak bir pool'a yatırır ve içinde transfer yapar; böylece bir gözlemci göndereni alıcıya bağlayamaz",
        "Adresler şifrelenir ve yalnızca alıcı tarafından çözülebilir",
        "Transferler toplu işlenir, böylece birçok ödeme tek bir zincir üstü kaydı paylaşır",
      ],
      answer: 0,
    },
    {
      question: `Bir explorer, bir Confidential Token transferi ile bir SPP pool transferini izliyor. Her birinde ne görür?`,
      options: [
        "CT: iki adresi görür ama tutarı görmez. SPP: karşı tarafları bile görmez",
        "İkisi de tutarları ve adresleri aynı şekilde gizler; SPP yalnızca daha ucuz",
        "CT adresleri gizler ve tutarları gösterir; SPP, KYC'den geçmiş izleyicilere her şeyi gösterir",
      ],
      answer: 0,
    },
    {
      question: `Bir Association Set Provider ne yayımlar ve sen ona karşı neyi kanıtlarsın?`,
      options: [
        "Kefil olduğu bir yatırma kümesi — ve sen, fonlarının o kümedeki bir yatırmaya kadar izlenebildiğini, hangisi olduğunu açıklamadan kanıtlarsın",
        "Pool'un her transferde uyguladığı, onaylı alıcıların bir listesi",
        "Denetçilerin pool etkinliğini okumasını sağlayan şifre çözme anahtarları",
      ],
      answer: 0,
    },
    {
      question: `Aynı çekme işlemi nasıl aynı anda hem özel hem denetlenebilir olabilir?`,
      options: [
        "Özel, çünkü senin belirli yatırmana giden bağ asla yayımlanmaz; denetlenebilir, çünkü kefil olunmuş bir kümeye üyeliğini kanıtlamadan çekemezdin",
        "Denetçiler, gerektiğinde bağı açığa çıkaran bir ana anahtar tutar",
        "Olamaz — tasarım birini diğeriyle takas eder ve SPP denetlenebilirliği seçti",
      ],
      answer: 0,
    },
  ],
};
