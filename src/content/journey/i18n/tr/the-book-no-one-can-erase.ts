import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Blockchain nedir",
  tagline: "Blockchain nedir — tek bir kısaltma bile kullanmadan anlatıyoruz.",
  steps: [
    {
      kind: "theory",
      body: `## Meyhanedeki hesap defteriyle başlayalım

Sen ve on bir arkadaşın her hafta aynı meyhanede içiyorsunuz. Kimse anında ödemiyor — hancı her şeyi bir deftere yazıyor: *Ana 3 borçlu, Bruno 5 borçlu, Ana 3'ü geri ödedi.*

Defter işe yarıyor. Ama tek bir zayıf noktası var ve bu aritmetik değil: **defteri elinde tutan tek kişi hancı.** Sessiz bir gece bir sayfa baştan yazılırsa, karşılaştıracak hiçbir şey yok.

Bu bölümdeki her şey, o tek zayıf noktayı düzeltmekten doğuyor. Matematik gerekmiyor — sadece defterin daha iyi bir düzeni.`,
    },
    {
      kind: "theory",
      body: `## Birinci düzeltme: herkes bir kopya tutar

Kuralı değiştiriyorsun. Hancının yazdığı her satırı, on ikiniz de aynı anda kendi defterinize kopyalıyorsunuz.

Artık bir sayfayı baştan yazmak neredeyse anlamsız. Kendi kopyanı değiştir, diğer on bir kişi seninle uyuşmaz — ve çoğunluğun haklı olduğu apaçık ortada. Hancı *defterin kendisi* olmaktan çıkıp *defterlerden biri* haline geldi.

**Paylaşılan ledger**'ın (defterin) bütün fikri bu: sihirli bir dosya değil, sadece aynı anda o kadar çok kişinin elinde bulunan bir hareket listesi ki hiçbiri onu sessizce düzenleyemez.`,
    },
    {
      kind: "diagram",
      body: `Bütün fark, üç satırda:`,
      caption: "Buradaki hiçbir şey kriptografi değil — sadece kaç kopya olduğuyla ilgili aritmetik.",
      view: {
        kind: "compare",
        columns: [
          { id: "one", label: "tek hancı", tone: "bad" },
          { id: "many", label: "on iki kopya", tone: "good" },
        ],
        rows: [
          {
            label: "bir sayfayı baştan yazmak",
            cells: [
              { text: "kimse fark etmez", tone: "bad" },
              { text: "on bir kopya uyuşmaz", tone: "good" },
            ],
          },
          {
            label: "kime güvenmen gerekir",
            cells: [
              { text: "hancıya", tone: "bad" },
              { text: "özellikle kimseye", tone: "good" },
            ],
          },
          {
            label: "defteri kaybetmek",
            cells: [
              { text: "her şey gider", tone: "bad" },
              { text: "on bir kopya kalır", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## İkinci düzeltme: sayfaları birbirine zincirle

Hâlâ bir açık var. Birinin, defterin derinlerinde kimsenin bakmadığı *geçen yılki* bir sayfayı baştan yazmasını ne engeller?

Bir alışkanlık ekliyorsun: her yeni sayfanın en üstüne, bir önceki sayfanın kısa bir özetini kopyalıyorsun. 40. sayfa 39. sayfanın parmak izini taşıyor, o da 38.'ninkini, ve böyle ilk sayfaya kadar geriye.

Artık eski bir sayfaya dokunmak parmak izini değiştiriyor — bu iz artık sonraki sayfaya yazılanla uyuşmuyor, o da bir sonrakiyle uyuşmuyor. **Geçmişin derinlerinde tek bir düzenleme, ondan sonra gelen her sayfayı kırıyor**; hem de gürültüyle, kopyayı elinde tutan herkesin gözü önünde.

Kendinden önceki sayfalara bağlı sayfalar. Blockchain'deki "chain" (zincir) tam olarak bu — ve evet, kelimenin tüm anlamı gerçekten bundan ibaret.`,
    },
    {
      kind: "widget",
      component: "ledger-tamper",
      body: `İşte o defter, zincirlenmiş halde. **Herhangi bir sayfayı değiştir** ve sonrakilere ne olduğunu izle.`,
    },
    {
      kind: "quiz",
      question: `Paylaşılan defterin bir kopyasını tutan biri, üç yıl önceki bir satırı sessizce baştan yazıyor. Ne olur?`,
      options: [
        "Herkes fark eder: düzenlenen sayfa, bir sonraki sayfaya kaydedilmiş parmak iziyle artık uyuşmaz",
        "Hiçbir şey — eski sayfalar kimsenin kontrol edemeyeceği kadar geride kalmıştır",
        "Defter kendini onarır ve düzenleme sessizce kaybolur",
      ],
      answer: 0,
      explain: `Sayfaları zincirlemenin amacı tam olarak bu. Geçmiş bir kilitle ya da parolayla korunmuyor — onu değiştirmenin *görünmesiyle* korunuyor. Herkesin kopyasında hâlâ orijinal parmak izleri var; seninki uyuşmaz hale geliyor.`,
    },
    {
      kind: "theory",
      body: `## Üçüncü düzeltme: bir sonraki sayfayı kim yazar?

On iki kopya arkadaşlar arasında yeter. Şimdi dünyaya dağılmış, birbirine güvenmeyen binlerce yabancı düşün — ve birkaç saniyede bir gelen yeni bir satır.

Onu kim yazacak? Hepsi aynı anda yazarsa, hangisinin versiyonu gerçek?

Bu türden her ağ, işte o tek soruya cevap vermek için var; verdikleri cevap da onları birbirinden ayıran şey. Bazıları ham hesaplama gücüyle belirlenen bir piyango düzenliyor. **Stellar bir oylama yapıyor:** her katılımcı güvenilir bulduğu diğerlerini seçiyor ve bu çemberler yeterince örtüşüp uzlaştığında bir satır gerçek oluyor.

Akılda tutmaya değer kısım pratik sonuç: yaklaşık **5 saniyede bir** yeni sayfa ve hareket başına o kadar küçük bir ücret ki sentin kesirleriyle ölçülüyor.`,
    },
    {
      kind: "quiz",
      question: `Paylaşılan bir ledger neden *bir sonraki sayfayı kimin yazacağına* dair bir kurala ihtiyaç duyar?`,
      options: [
        "Çünkü binlerce yabancı aynı anda hareketler alıyor ve hepsinin aynı deftere ulaşması gerekiyor",
        "Çünkü yazmak pahalı ve birinin kâğıt parasını ödemesi gerekiyor",
        "Çünkü deftere yalnızca ilk yazarı ekleme yapabilir",
      ],
      answer: 0,
      explain: `Zor olan uzlaşma, depolama değil. Bir listeyi kopyalamak kolay; birbirine güvenmeyen binlerce makinenin *aynı* liste üzerinde, aynı sırayla uzlaşmasını sağlamaksa bu ağların her birinin çözmek için kurulduğu problem. Bunu Diyar'da adamakıllı söküp inceleyeceksin — hatta bilerek kıracaksın bile.`,
    },
    {
      kind: "fill",
      prompt: `Bu şeyi tanımlayan cümleyi tamamla:`,
      file: "NOTES.md",
      before: `Blockchain, birçok kişinin aynı anda tuttuğu ve her sayfasının bir önceki sayfanın parmak izini taşıdığı bir hareket listesidir — böylece geçmişi değiştirmek `,
      after: ` .`,
      choices: [
        "anında herkes tarafından görülür",
        "küçük bir ücrete mal olur",
        "parola gerektirir",
        "matematiksel olarak imkânsızdır",
      ],
      answer: 0,
      explain: `Sonuncuya dikkat — o bir efsane. Geçmişi değiştirmek *imkânsız* değil; **sessizce** değiştirmek imkânsız. Buradaki her şey bu ayrımın üstüne kurulu.`,
    },
    {
      kind: "theory",
      body: `## Peki Stellar nedir?

Bu defterlerden biri — özellikle **insanlar arasında hareket eden değer** için inşa edilmiş.

Genel amaçlı bir dünya bilgisayarı değil, bir spekülasyon makinesi değil: sınır ötesine para göndermenin sentin kesri kadar tuttuğu, yaklaşık beş saniyede kesinleştiği ve on sent de göndersen on milyon da aynı şekilde çalışacak biçimde tasarlanmış bir ledger.

İleride karşılaşacağın her şey — hesaplar, ödemeler, token'lar, kontratlar — bu tek paylaşılan defterdeki bir satır ya da satırlarla ilgili bir kural.

**Sırada:** defter herkese açıksa ve herkes ona yazabiliyorsa, bir yabancının *senin* paranı harcamasını ne engeller? Cevap bir anahtar — ve parolayla uzaktan yakından ilgisi yok.`,
    },
  ],
  testOut: [
    { question: `On iki arkadaşın her biri meyhane defterinin kendi kopyasını tutuyor. Bu düzen onlara gerçekte ne kazandırıyor?`,
      options: ["Kimsenin hancıya güvenmesi gerekmiyor — sessiz bir düzenleme diğer on bir kopyayla uyuşmaz hale geliyor","Defter kaybedilemez hale geliyor, ama hancı yine de baştan yazabiliyor","Yazmak hızlanıyor, çünkü on iki kişi işi paylaşıyor"], answer: 0 },
    { question: `Her sayfa ayrıca bir önceki sayfanın kısa özetini taşıyor. Bu, tek başına kopyaların sağlamadığı neyi ekliyor?`,
      options: ["ESKİ bir sayfayı düzenlemek yalnızca o sayfayı değil, ondan sonra gelen her sayfayı kırıyor","Defteri sıkıştırıyor, böylece eski sayfalar daha az yer kaplıyor","Defteri yerini kaybetmeden tersten okumanı sağlıyor"], answer: 0 },
    { question: `Paylaşılan bir defter neden bir sonraki sayfayı kimin yazacağına dair bir kurala ihtiyaç duyar?`,
      options: ["Binlerce yabancı aynı anda hareketler alıyor ve hepsinin aynı deftere, aynı sırayla ulaşması gerekiyor","Çünkü kâğıt pahalı ve birinin bundan sorumlu olması gerekiyor","Çünkü deftere yalnızca onu başlatan kişi ekleme yapabilir"], answer: 0 },
    { question: `Bu bölümün terimleriyle Stellar nedir?`,
      options: ["Bu paylaşılan defterlerden biri; özellikle insanlar arasında hareket eden değer için inşa edilmiş","Defteri tutan ve ona yazmak için ücret alan bir şirket","Tesadüfen bir defter saklayan genel amaçlı bir bilgisayar"], answer: 0 },
  ],
};
