import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Orkestrasyon",
  tagline: "Orkestrasyon: deterministik kenarlar, yargı düğümlerin içinde.",
  steps: [
    {
      kind: "theory",
      body: `## Orkestrasyon ve otonomi

Grafın iki işini temiz ayır:

- **Kenarlar deterministiktir.** Neyin ne zaman çalışacağına, neyin nereye akacağına, bir yeniden denemenin neye benzeyeceğine düz kod karar verir — okuyabildiğin, test edebildiğin, yeniden oynatabildiğin bir kontrol akışı.
- **Yargı düğümlerin içinde yaşar.** Kendi kutusunda model, tek işine bütün ustalığını getirir.

Ayrımı bulanıklaştır — sıradaki adımı modelin doğaçlamasına izin ver — ve hatalar yeniden üretilebilir olmaktan çıkar: her çalıştırma farklı bir grafta yeni bir maceradır. Yapıyı sıkıcı, zihinleri kutularında tut: **güvenilirlik iskeletten, zekâ organlardan.**`,
    },
    {
      kind: "quiz",
      question: `İyi kurulmuş bir grafta model yargısı nerede yaşar?`,
      options: [
        "Düğümlerin içinde — aralarındaki kenarlar ise test edip yeniden oynatabildiğin deterministik kod olarak kalır",
        "Kenarlarda — sıradaki düğümü modelin doğaçlamasına izin vermek sistemi esnek tutar",
        "Hiçbir yerde — ciddi bir pipeline uçtan uca deterministiktir, yoksa mühendislik değildir",
      ],
      answer: 0,
      explain: `Doğaçlama kontrol akışı, yeniden üretilemeyen hatalar demektir — asla aynı şekilde iki kez olmayan bir yolu debug edemezsin. Hiçbir yerinde yargı olmayan bir pipeline'ın ise modele hiç ihtiyacı yoktu. Deterministik iskelet, yargılayan organlar: her güvenilirlik türü ait olduğu yerde.`,
    },
    {
      kind: "fill",
      prompt: `Bir grafı debug edilebilir kılan ayrımı tamamla:`,
      file: "graph.toml",
      before: `Kenarlar `,
      after: ` koddur; yargı düğümlerin içinde yaşar.`,
      choices: [
        "deterministik",
        "model üretimi",
        "uyarlanabilir",
        "kendini değiştiren",
      ],
      answer: 0,
      explain: `Diğer her cevap aynı şeyi satın alır: yeniden üretemediğin bir çalıştırma. Graftan geçen yolun kendisi bir model çıktısıysa, aynı hatanın iki çalıştırması iki farklı rota izlemiştir — ve adım adım gidilecek bir şey yoktur, çünkü ters giden şey haritanın kendisidir.`,
    },
    {
      kind: "theory",
      body: `## Akıl yürütme için su geçirmez bölmeler

Grafın en sessiz armağanı **kapsamadır** (containment).

Tek bir dev prompt'ta, ikinci adımdaki tek bir kafa karışıklığı ondan sonraki her şeyi zehirler — aynı bağlam, hiçbir bölme yok, hata sona kadar kibarca katlanarak büyür.

Bir grafta ise başarısız bir düğüm **tek başına başarısız olur**. Bağlamı karantinadadır; kendi eval'leri hatayı *kendi* sınırında yakalar — geçen bölümün pusulası, şimdi her düğüme asılmış; orkestratör onu yeniden dener ya da etrafından dolaşır. Pipeline ve çok ajanlı araçların sana vermek için var olduğu şey budur — adlandırılmış adımlar, tipli el değiştirmeler, yeniden denemeler — ve bu, kalenin patlama yarıçapı dersinin bir kat üstteki tekrarıdır.`,
    },
    {
      kind: "diagram",
      body: "İkinci adımda tek bir kafa karışıklığı, iki mimari:",
      caption:
        "Aynı hata, aynı model. Tek fark, ikinci adımla beşinci adım arasında bir şeyin durup durmadığı.",
      view: {
        kind: "compare",
        columns: [
          { id: "mono", label: "tek bir uzun prompt", tone: "bad" },
          { id: "graph", label: "bir graf", tone: "good" },
        ],
        rows: [
          {
            label: "hata nereye gider",
            cells: [
              { text: "sonraki her adımın okuduğu bağlama", tone: "bad" },
              { text: "hiçbir yere — düğümün bağlamı kendine ait", tone: "good" },
            ],
          },
          {
            label: "kim fark eder",
            cells: [
              { text: "sen, en sonda, çıktıdan", tone: "bad" },
              { text: "o düğümün kendi eval'leri, kendi sınırında", tone: "good" },
            ],
          },
          {
            label: "neye mal olur",
            cells: [
              { text: "ondan sonraki her adım, baştan", tone: "bad" },
              { text: "tek bir düğüm, yeniden denenir ya da etrafından dolaşılır", tone: "good" },
            ],
          },
          {
            label: "neyi debug edebilirsin",
            cells: [
              { text: "upuzun tek bir transkript", tone: "bad" },
              { text: "başarısız düğümü, yalıtılmış halde", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `İş: tek bir dosyada bir fonksiyonu ve çağrıldığı yerleri yeniden adlandırmak. Neye uzanırsın?`,
      options: [
        "Basit bir döngüye — ya da sadece editörüne; bir grafın koordinasyon maliyeti işin kendisini aşar",
        "Bir grafa — daha çok model daha çok kalite demektir, küçük işte de büyük işte de",
        "Bir grafa — küçük işler, büyükleri için pratik yapmanın tam yeridir",
      ],
      answer: 0,
      explain: `Her düğümün bir kurulum bedeli vardır: seçilecek bağlam, tanımlanacak kenarlar, yönlendirilecek hatalar. Küçük bir işte iskele işin kendisinden ağır basar — bir sineği kovmak için toplanmış bir savaş konseyi. Basit iş, basit döngü; graf ancak ayrıştırma hak ettiğinde hakkını verir.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## Sınav yapıcının sınavı: bir tane doku

Tek bir tezgâha sığmayacak bir görev:

> Bir Soroban token kontratının mainnet öncesi bir güvenlik geçişine ihtiyacı var. Yaygın bug sınıflarına karşı denetle, bulunanları düzelt, README'yi düzeltilmiş davranışa uyacak şekilde güncelle ve eski sürümde olan herkes için kısa bir migration notu hazırla.

**Grafı** tasarla. Düğümleri ve her birinin ne için olduğunu adlandır; hangilerinin paralel çalışabileceğini ve neden gerçekten bağımsız olduklarını söyle; doğrulayıcının nerede durduğunu ve hedefinin ne olduğunu söyle; ve başarısızlığı geri kalanı çökertmemesi gereken bir düğümü, bir de gerçekten başarısız olduğunda ne olacağını adlandır.

Yalnızca tasarım — orkestrasyon kodu yok, araç ya da framework adı yok.`,
      rubric: `1. Her birinin tek bir amacı belirtilmiş en az dört düğüm adlandırıyor.
2. Hangi düğümlerin paralel çalışabileceğini belirliyor VE bağımsızlığı gerekçelendiriyor — hiçbiri diğerinin çıktısını okumuyor ve state'ine dokunmuyor.
3. En az bir doğrulayıcı düğüm yerleştiriyor ve hedefini onay değil, çürütme olarak belirtiyor.
4. Başarısızlığı kapsanan en az bir düğüm adlandırıyor ve orkestratörün bununla ne yaptığını söylüyor (yeniden dene, etrafından dolaş, dur ve yukarı bildir).
5. Yalnızca tasarım — orkestrasyon kodu yok, framework ya da araç adı yok ve kontrol akışı bir modelin doğaçlamasına bırakılmamış.`,
      minChars: 200,
    },
    {
      kind: "theory",
      body: `## Zanaat, bir araya getirildi

Kemerinde şimdi ne olduğuna bak: doğrunun ne demek olduğunu söyleyen **spec'ler**; onu sonsuza dek kontrol eden **sınavlar**; kelimeleri dürüst tutan **sınırlar**; değişimi kapsayan bir **kale**; modeli kapsayan bir **harness**; onun ne gördüğünü biçimlendiren **kelimeler**; kendini düzeltmesine izin veren **döngüler**; ve birçok zihni tek bir plana dokuyan bir **graf**.

Yapay zekâ bunların hiçbirini kendiliğinden getirmez. Her biri onu çok daha kullanışlı yapar.

Yolda sırada: diyara dönüş — zanaatı Forge'a taşı ve gerçek ağda harca.`,
    },
  ],
  testOut: [
    {
      question: `İyi kurulmuş bir grafta model yargısı nerede yaşar?`,
      options: [
        "Düğümlerin içinde; aralarındaki kenarlar ise test edip yeniden oynatabildiğin deterministik kod olarak kalır",
        "Kenarlarda — sıradaki düğümü modelin seçmesine izin vermek sistemi esnek tutar",
        "Hiçbir yerde; ciddi bir pipeline uçtan uca deterministiktir",
      ],
      answer: 0,
    },
    {
      question: `Sıradaki adımın hangisi olacağına model karar verdiğinde ne ters gider?`,
      options: [
        "Hatalar yeniden üretilebilir olmaktan çıkar — asla aynı şekilde iki kez olmayan bir yolu debug edemezsin",
        "Hiçbir şey, her düğümün hâlâ kendi eval'leri olduğu sürece",
        "Daha pahalıya gelir, çünkü yönlendirme kararı fazladan bir çağrıdır",
      ],
      answer: 0,
    },
    {
      question: `Bir düğüm grafın ortasında başarısız oluyor. Ne olmalı?`,
      options: [
        "Tek başına başarısız olur — bağlamı karantinaya alınır, kendi eval'leri onu yakalar ve orkestratör yeniden dener ya da etrafından dolaşır",
        "Bütün çalıştırma iptal edilir, çünkü sonraki sonuçlar bir hataya dayanacaktır",
        "Sonraki düğüm onun kısmi çıktısını devralır ve devam eder",
      ],
      answer: 0,
    },
    {
      question: `İş: tek bir dosyada bir fonksiyonu ve çağrıldığı yerleri yeniden adlandırmak. Neye uzanırsın?`,
      options: [
        "Basit bir döngüye ya da sadece editörüne — bir grafın koordinasyonu işin kendisinden pahalıya gelir",
        "Bir grafa, çünkü daha çok düğüm her ölçekte daha çok kalite demektir",
        "Bir grafa, çünkü küçük işler büyükleri için pratik yaptığın yerdir",
      ],
      answer: 0,
    },
  ],
};
