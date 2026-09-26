import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Durum arşivleme ve ücretler",
  tagline: "State archival ve ücretler: state kiralıktır, çağrının bedeli ise açık artırmayla değil ölçümle belirlenir.",
  steps: [
    {
      kind: "theory",
      body: `## State'in bir kalp atışı var

Çoğu zincir state'in (durumun) sonsuza dek birikmesine izin verir — her düğüm 2019'dan kalma her terk edilmiş kaydı peşinden sürükler. Stellar bunu reddediyor: **her Soroban kaydının bir TTL'i** (time-to-live, yaşam süresi) var; ledger (defter) cinsinden sayılıyor ve kira onu uzatıyor.

TTL dolduğunda:

- **Temporary** kayıtlar silinir. Gitti.
- **Persistent** ve **instance** kayıtlar **arşivlenir** — canlı ledger'dan çıkarılır ama silinmez. Bunlardan birine ihtiyaç duyan sonraki bir işlem, onu ilk iş olarak bir ücret karşılığında geri getirebilir ve kayıt tam olarak bırakıldığı gibi döner.

Buna **state archival** (durum arşivleme) deniyor ve başka hiçbir büyük zincir bunu yapmıyor. Canlı ledger yalın kalır, validator'lar ucuz kalır, geçmiş kurtarılabilir kalır.`,
    },
    {
      kind: "widget",
      component: "state-archival",
      body: `Saat işlerken üç raf da birbirinin aynı görünür. Her birinde **ledger'ların geçmesine izin ver** ve sıfırda ne olduğunu izle — aralarındaki bütün fark o anda saklı.`,
    },
    {
      kind: "theory",
      body: `## Bir kontrat, üç raf

Soyut raflar, elinde gerçek veri olduğu anda bir tasarım kararına dönüşür. Basit bir escrow (emanet) kontratını ele al:

- **Admin adresi ve ücret oranı** **instance** storage'a gider. Kontratın kendisine aittirler, neredeyse her çağrıda okunurlar ve kontratın saatini paylaşırlar: kontrat canlı olduğu sürece onlar da canlıdır, arşivlenmiş bir kontratı geri getirmek de onları onunla birlikte geri getirir.
- **Açık olan her escrow** **persistent** storage'a gider. İçinde birinin parası var. TTL'i dolsa bile kayıt kurtarılabilir kalmalı, çünkü "param nerede" sorusuna "unutmuşuz" kabul edilebilir bir cevap değildir.
- Çağıranın işlemi onaylamadan önce çektiği **kısa ömürlü bir fiyat teklifi** **temporary** storage'a gider. On dakika sonra beş para etmez ve kimse onu tutmak için kira ödememeli.

Her birini belirleyen soruya dikkat et. "Bu ne kadar önemli?" değil — ücret oranı kritik ama yine de instance'a ait. Soru şu: **kimse uzun süre dokunmazsa buna ne olmalı?** Kontratla birlikte kalsın, kurtarılabilir kalsın ya da gitsin.

Bunu tersine çevirirsen hata sessiz olur. Temporary storage'daki escrow kayıtları yazdığın gün hata fırlatmaz. Aylarca kusursuz çalışır.`,
    },
    {
      kind: "quiz",
      question: `Kontratın her kullanıcının token bakiyesini takip ediyor. Hangi storage katmanı?`,
      options: [
        "Persistent — bakiyeler her TTL dolumunu atlatmalı ve arşivden geri getirilebilmeli",
        "Temporary — en ucuzu, süresi dolarsa kullanıcılar yeniden yatırır",
        "Instance — bakiyeler kontrata ait, o yüzden onunla birlikte yolculuk eder",
      ],
      answer: 0,
      explain: `Temporary silme *kalıcıdır* — buharlaşan bir bakiye, ihmalden doğan bir rug-pull'dur. Instance storage ise her bir çağrıda yüklenir; kullanıcı başına veriyi oraya tıkıştırmak herkese herkesin bedelini ödetir.`,
    },
    {
      kind: "fill",
      prompt: `Bakiyeyi doğru rafa koy.`,
      file: "token/src/lib.rs",
      before: `env.storage().`,
      after: `().set(&user, &balance);`,
      choices: ["persistent", "temporary", "instance", "eternal"],
      answer: 0,
      explain: `soroban-sdk katmanları birebir yansıtır: \`env.storage().persistent()\`, \`.temporary()\`, \`.instance()\`. \`eternal\` diye bir şey yok — kira tasarımının bütün amacı da bu.`,
    },
    {
      kind: "theory",
      body: `## Açık artırmayla değil, ölçerek belirlenen ücretler

Gas açık artırmalı zincirlerde blok alanı için *teklif verirsin* ve dua edersin; popüler tek bir mint herkesin maliyetini katlayabilir.

Soroban bunun yerine **ölçer**. Bir işlem **kaynaklarını** beyan eder — CPU komutları, bellek, ledger okuma ve yazmaları, byte'lar — ve ücret bu ölçülmüş ihtiyaçlardan *hesaplanır*; üstüne dokunduğu storage için kira eklenir. Dürüstçe beyan et (simülasyon bunu senin yerine yapar), fazla tahminin iade edilebilir kısmı geri gelir.

Sonuç, önceden söyleyebildiğin bir maliyet: "bu aksiyon yaklaşık bir sente mal olur" cümlesi, ağın yoğun bir gün geçirdiği anda bile doğru kalır.`,
    },
    {
      kind: "theory",
      body: `## Önce simüle et, tam olarak onu imzala

Her Soroban istemcisi tek bir ritmi izler:

1. Çağrıyı bir RPC düğümüne karşı **simüle et** — imza yok, maliyet yok.
2. Simülasyon **footprint**'i (ayak izini) döndürür — çağrının tam olarak hangi ledger kayıtlarını okuyup yazacağını — artı kaynak tahminlerini, ihtiyaç duyduğu auth'u ve varsa önce geri getirmesi gereken arşivlenmiş kayıtları.
3. **Tam olarak simüle ettiğini imzalar** ve gönderirsin.

İmzalı işlem footprint'ini taşır; böylece validator'lar onu çalıştırmadan önce bütün dünyasını bilir ve footprint dışındaki hiçbir şeye dokunulamaz. Simülasyonu atlarsan, ağın düpedüz reddedeceği sayıları tahmin ediyorsun demektir.`,
    },
    {
      kind: "quiz",
      question: `Soroban akışı neden imzalamadan önce simüle eder?`,
      options: [
        "Simülasyon footprint'i ve kaynak ihtiyaçlarını hesaplar; böylece kesin, uygulanabilir sınırları olan bir işlem imzalarsın",
        "Debug için nezaketen yapılan bir kuru çalışmadır — production uygulamalar atlar",
        "Simülasyon çağrıyı önceden çalıştırır, böylece validator'ların yeniden çalıştırması gerekmez",
      ],
      answer: 0,
      explain: `Validator'lar her zaman yeniden çalıştırır — ama yalnızca beyan edilen footprint içinde. Simülasyon, bir işlemin kendi sınırlarını öğrenme yoludur; ledger sonra bu sınırları byte'ına kadar uygular.`,
    },
  ],
  testOut: [
    { question: `Temporary bir kaydın TTL'i sıfıra ulaşıyor. Veriye ne olur?`,
      options: ["Silinir — temporary storage için hiçbir fiyata geri getirme yoktur","Arşivlenir ve diğer her kayıt gibi bir ücret karşılığında geri getirilebilir","Tutulur ama süresi uzatılana kadar salt okunur olur"], answer: 0 },
    { question: `Persistent bir kaydın TTL'i sıfıra ulaşıyor. Ne olur?`,
      options: ["Silinmez, arşivlenir — ona ihtiyaç duyan sonraki bir işlem önce onu geri getirebilir ve geri getirmenin bir ücreti vardır","Temporary bir kayıt gibi silinir","Kayıt yeniden yazılana kadar kontrat duraklatılır"], answer: 0 },
    { question: `Protokol state için neden kira alıyor ki?`,
      options: ["Çünkü state her validator'a sonsuza dek storage'a mal olur; tek seferlik bir yazma ücreti, herkesin sınırsız ve sürekli bir maliyet dayatmasına izin verirdi","Kontratları on-chain'de hiçbir şey saklamamaya caydırmak için","Arşiv ücretlerinden ödenen validator operasyonlarını finanse etmek için"], answer: 0 },
    { question: `Bir kontrat çağrısını imzalamadan önce simüle etmenin anlamı ne?`,
      options: ["Simülasyon, çağrının ihtiyaç duyduğu kesin kaynakları ve footprint'i döndürür ve sen onu imzalarsın — böylece ücret tahmin edilmez, ölçülür","Kontratın kaynak kodunu bilinen açıklar için tarar","Sonraki ledger'da bir yer ayırır, böylece çağrı kalabalıkta dışarıda kalmaz"], answer: 0 },
  ],
};
