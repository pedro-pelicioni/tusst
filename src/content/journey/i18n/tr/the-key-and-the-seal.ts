import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Anahtarlar, imzalar ve hesaplar",
  tagline: "Anahtarlar ve imzalar: hesabın bir anahtar, imzalamak bir mühür.",
  steps: [
    {
      kind: "theory",
      body: `## Parola, başkasının tuttuğu bir sözdür

Bankana giriş yaparken bir parola yazarsın ve banka onu *kontrol eder*. Bu cümlenin her parçası bir bağımlılık saklıyor: listeyi banka tutuyor, senin sen olduğuna banka karar veriyor, banka seni dışarıda bırakabiliyor ve bankanın listesi sızarsa parolan da sızıyor.

Geçen bölümdeki paylaşılan defterde banka yok. Arkasında oturup bir şeyleri kontrol eden kimse yok.

O yüzden daha iyi bir şey kullanıyor: birine *söylediğin* bir sır değil, elinde olduğunu *kanıtladığın* bir sır — **hem de onu hiç göstermeden**.`,
    },
    {
      kind: "theory",
      body: `## Bir anahtar, iki yarım

Hesabın, birbirine uyan iki yarımdan oluşan bir çift: birlikte, senin kendi cihazında yaratılıyor.

- **Açık** (public) yarım senin adresin. \`GABC…7XQ\` gibi görünür. Gönül rahatlığıyla paylaş — insanların sana bir şey gönderdiği yer orası, tıpkı bir e-posta adresi gibi. Onu yayınlamak risk değil; bütün amacı zaten bu.
- **Gizli** (secret) yarım ise elinden asla çıkmaz. \`SDXY…4KP\` gibi görünür. Adresin tuttuğu şeyi *hareket ettiren* o.

İki yarım, tek ilişki: açık yarım gizli yarımdan her zaman türetilebilir, **tersi asla**. Bütün düzen bu tek yönlü yolun üstünde duruyor.

Aklında tutmanın kolay yolu: adresin herkesin görebildiği posta kutusu, gizli anahtarın ise onu açan tek anahtar.`,
    },
    {
      kind: "quiz",
      question: `Bir pazar yeri sana ödeme yapabilmek için "Stellar adresini" istiyor. Hangi yarımı gönderirsin?`,
      options: [
        "Açık olanı, G ile başlayanı — o bir adres, paylaşılmak için var",
        "Gizli olanı, S ile başlayanı — yoksa ödeme sana ulaşamaz",
        "Hiçbirini: adresler gizlidir, ödemeler e-postayla ayarlanır",
      ],
      answer: 0,
      explain: `Almak için adresinden başka hiçbir şey gerekmez. Biri bir ödemenin gizli anahtarını gerektirdiğini iddia ediyorsa, dolandırıcılık o isteğin ta kendisidir — ve artık onu bir bakışta tanıyorsun.`,
    },
    {
      kind: "theory",
      body: `## İmzalamak: kimsenin taklit edemediği mühür

Gizli yarımın ekmeğini kazandığı yer burası. Bir şeyi hareket ettirmek için talimatı yazarsın — *"Bruno'ya 10 gönder"* — ve cihazın onu gizli anahtarınla **mühürler**.

Mührün üç özelliği var ve yavaş yavaş okumaya değer:

1. **Onu yalnızca senin anahtarın üretebilirdi.** Kimse taklit edemez.
2. **Herkes kontrol edebilir**; açık adresine bakarak, gizli yarımını hiç görmeden.
3. **Tam olarak bu talimatı kapsar.** Tutarın tek bir rakamını değiştir, mühür dağılır.

İşte **imza** bu. Ağ seni tanımıyor, sana güvenmiyor ve buna ihtiyacı da yok — sadece mührün, paranın çıktığı adresle eşleştiğini doğruluyor.`,
    },
    {
      kind: "widget",
      component: "seal-sign",
      body: `Dene. Bir şey yaz, mühürle — sonra tek bir karakteri değiştir ve mührün eşleşmeyi bırakışını izle.`,
    },
    {
      kind: "theory",
      body: `## İnsanların her şeyi kaybettiği kısım

Defterin arkasında banka olmadığı için "parolamı unuttum" da yok, destek hattı da yok, geri alma da yok. Bu iki tarafa da keser; ve keskin kenar hakkında dürüst olmak, coşkudan daha önemli:

- **Gizli anahtarı kaybedersen → fonlar sonsuza dek orada kalır: herkese görünür, kimseye ulaşılabilir değil.** Anahtarın "içinde" değiller; anahtar sadece onları hareket ettirebilen tek şey.
- **Gizli anahtarı başkası ele geçirirse → artık o, sensin.** İtiraz yolu yok, çünkü ağa göre yanlış hiçbir şey olmadı: geçerli bir mühür, geçerli fonları hareket ettirdi.

Dolayısıyla bu alanda bugüne kadar çevrilmiş her dolabı boşa çıkaran tek kural: **meşru hiç kimse gizli anahtarına asla ihtiyaç duymaz.** Ne destek ekibi, ne bir çekiliş, ne bir "cüzdan doğrulaması", ne de grup sohbetindeki bir admin. Bir kez bile, asla.`,
    },
    {
      kind: "quiz",
      question: `"Ağ desteği" diye sana yazan biri hesabının takıldığını söylüyor ve açmak için gizli anahtarını (ya da 24 kurtarma kelimeni) istiyor. Gerçekte olan ne?`,
      options: [
        "Hırsızlık — gizli anahtara senden başka kimsenin ihtiyacı yoktur ve onu vermek, hesabı vermektir",
        "Rutin bir işlem — desteğin kilidi senin adına imzalamak için anahtara ihtiyacı var",
        "Hemen ardından anahtarı değiştirdiğin sürece güvenli",
      ],
      answer: 0,
      explain: `Üçüncü bir cevap yok. Bu mesajın her çeşidi — destek, airdrop, "cüzdan doğrulaması", cana yakın bir yabancı — farklı kostüm giymiş aynı hırsızlık. Kuralın ezberlenecek istisnası yok; işe yaramasının sebebi de tam olarak bu.`,
    },
    {
      kind: "fill",
      prompt: `Hesabı güvende tutan kuralı tamamla:`,
      file: "NOTES.md",
      before: `Açık anahtarı gönül rahatlığıyla paylaş; gizli anahtar `,
      after: ` .`,
      choices: [
        "cihazından asla çıkmaz",
        "yalnızca doğrulanmış desteğe verilir",
        "yedek olarak kendine e-postayla gönderilir",
        "işlemle birlikte yayınlanır",
      ],
      answer: 0,
      explain: `Ve "kendine e-postayla gönder" tuzak cevap: gelen kutusu, anahtarının başkasının binasında duran, bir parolayla korunan bir kopyasıdır. Bir anahtarı çevrimdışı yedekle — kâğıda ya da bir cihaza — ya da hiç yedekleme.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Teori yeter — git bir tane yap. Forge'daki **İlk Cüzdanın** gerçek bir anahtar çifti üretir, onu Stellar'ın test ağında fonlar ve sen imzaladıktan saniyeler sonra hesabın paylaşılan defterde bir satır olarak belirişini gösterir. Test ağı, oyun parası, gerçek makine.`,
    },
    {
      kind: "theory",
      body: `## Artık elinde olanlar

Hesap bir anahtar çiftidir. Adres, paylaştığın yarımdır. İmza, yalnızca gizli yarımının üretebildiği ve herkesin kontrol edebildiği mühürdür. O yarımı kaybetmek kesindir ve dürüst hiç kimse onu senden istemez.

**Sırada:** defter bakiyelerden fazlasını tutabilir. *Kurallar* tutabilir — ve o kurallar kendi kendine çalışır, ortada onları yerine getirip getirmemeye karar veren kimse olmadan.`,
    },
  ],
  testOut: [
    { question: `Bir imza gerçekte neyi kanıtlar?`,
      options: ["Özel anahtarı elinde tutan kişinin tam olarak bu mesajı onayladığını","Mesajın güvenilir bir cihazdan gönderildiğini","Ağın mesajı kabul etmeden önce gönderenin kimliğini kontrol ettiğini"], answer: 0 },
    { question: `Bir yabancının elinde açık adresin var. Onunla ne yapabilir?`,
      options: ["Sana değer gönderebilir ve imzalarını kontrol edebilir — başka hiçbir şey","En son ne zaman imzaladığını da biliyorsa hesabından harcama yapabilir","Yeterince zaman verilirse özel anahtarını okuyabilir"], answer: 0 },
    { question: `Bir anahtar neden sadece "fazladan adımlı bir parola" değildir?`,
      options: ["Parola onu kontrol eden bir servise gösterilir; anahtar yanından hiç ayrılmaz ve bunun yerine bir kanıt üretir","Anahtar daha uzundur, o yüzden tahmin etmek daha çok deneme ister","Parolayı destek sıfırlar, anahtarı ise ağ"], answer: 0 },
    { question: `İmzaladıktan sonra mesajın tek bir karakterini değiştiriyorsun. Ne olur?`,
      options: ["İmza eşleşmeyi bırakır — bir parçasını değil, mesajın tamamını kapsar","Hiçbir şey, değişiklik imzadan küçük olduğu sürece","İmza yeni metni kapsayacak şekilde kendini günceller"], answer: 0 },
  ],
};
