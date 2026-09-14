import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Dövmeden Önce Düşün",
  tagline: "Spec odaklı geliştirme: yapay zekânın senin yerine yapamayacağı beceri.",
  steps: [
    {
      kind: "theory",
      body: `## Vibe-coding tuzağı

Bir yapay zekâ otuz saniyede çalışır görünen bir kontrat dövebilir. Derlenir. Çalışır. Hatta *demo*da bile iyi durur.

Tuzak da tam olarak bu: kod ucuzlayınca **"doğru görünüyor" ile "doğru" birbirinden ayırt edilemez hale gelir** — dövme başlamadan önce *doğru*nun ne demek olduğunu yazıya dökmediysen.

O yazıya dökülen şeyin adı **spec** (spesifikasyon). Yapay zekâ eşli programlama çağında spec, mühendisliğin senin elinde kalan parçasıdır.`,
    },
    {
      kind: "theory",
      body: `## Spec aslında nedir

Bir spec **davranışı** tanımlar, uygulamayı değil:

- **Ne olmalı** — "yatıran, son tarihten sonra parasını geri alabilir."
- **Ne asla olmamalı** — "kontratın bakiyesi hiçbir zaman açık depozitoların toplamının altına düşmez."
- **Sınır durumlar** — "son tarih tam olarak *şimdi* ise? Miktar sıfırsa?"

Hangi döngü, hangi storage düzeni, hangi kütüphane — bunları bilerek **söylemez**. Birbirinden çok farklı iki uygulama aynı spec'e sadık kalabilir; spec'leri kalıcı ve yapay zekâ dostu yapan şey tam da bu özgürlüktür.`,
    },
    {
      kind: "quiz",
      question: `Bir escrow (emanet) kontratının spec'ini yazıyorsun. Hangi cümle **spec'e ait**?`,
      options: [
        "Fonlar yalnızca iki taraf da imzaladığında serbest bırakılabilir.",
        "Her depozitoyu numaralandır ve geliş sırasına göre kaydet.",
        "En yeni kontrat toolkit'iyle, hazır duraklatma anahtarını da ekleyerek inşa et.",
      ],
      answer: 0,
      explain: `Davranış içeride, uygulama dışarıda. Storage düzenleri ve araç seçimleri *dövenin* işi; spec'in sahiplendiği şeyse neyin doğru olması gerektiğidir.`,
    },
    {
      kind: "diagram",
      body: "Az önceki quiz'in çizdiği çizgi, genel haliyle:",
      caption: "Aynı spec'in iki uygulaması birbirine hiç benzemeyebilir. Mesele tam da bu özgürlük.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "spec",
            label: "spec'e ait",
            tone: "good",
          },
          {
            id: "forge",
            label: "dövmeye ait",
            tone: "neutral",
          },
        ],
        rows: [
          {
            label: "bir örnek",
            cells: [
              {
                text: "fonlar yalnızca iki taraf da imzaladığında serbest bırakılır",
                tone: "good",
              },
              {
                text: "depozitoları numaralı bir listede tut",
                tone: "neutral",
              },
            ],
          },
          {
            label: "sahibi kim",
            cells: [
              {
                text: "sen — her yeniden yazımdan sağ çıkar",
                tone: "good",
              },
              {
                text: "bu sefer kim dövüyorsa o",
                tone: "neutral",
              },
            ],
          },
          {
            label: "ne zaman değişir",
            cells: [
              {
                text: "davranışın değişmesi gerektiğinde",
                tone: "good",
              },
              {
                text: "daha hızlı bir yol bulunduğunda",
                tone: "neutral",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Bug'lar belirsizlikte yaşar

Masum görünen tek bir gereksinim al:

> "Alıcıya son tarihten sonra iade yapılır."

Üç mühendis — ya da üç yapay zekâ çalıştırması — bunu üç farklı şekilde okur:

1. **Otomatik** iade mi, yoksa **istediklerinde** mi?
2. Son tarih **geçtikten** sonra mı, yoksa tam **o anda** mı?
3. **Tam** tutar mı, yoksa ücretler düşülmüş hali mi?

Bu okumaların hiçbiri bir *kodlama* hatası değil. Bunlar **spec delikleri** — ve her biri, üstünde yemyeşil bir test suite'iyle bug olarak yayına çıkar.`,
    },
    {
      kind: "quiz",
      question: `İşte bir spec ve dövülmüş üç uygulama. **Hangisi spec'e sadık?**

**SPEC — Escrow v1**
1. Alıcı bir kez depozito yatırır; tutar oluşturma anında sabitlenir.
2. Fonlar satıcıya yalnızca **hem** alıcı **hem** satıcı onayladığında serbest bırakılır.
3. Son tarihten sonra, **serbest bırakma gerçekleşmediyse**, **alıcı** fonları çekebilir.

---

**A** — taraflardan *herhangi biri* onaylayınca satıcıya serbest bırakır; son tarihten sonra alıcı çekebilir.

**B** — yalnızca ikisi de onaylayınca satıcıya serbest bırakır; son tarihten sonra çekimi *herkes* tetikleyebilir ve fonlar alıcıya gider.

**C** — yalnızca ikisi de onaylayınca serbest bırakır; son tarihten sonra alıcı çekebilir — *serbest bırakma çoktan gerçekleşmiş olsa bile*, kontratın kalan bakiyesini kullanarak.`,
      options: [
        "B — iki taraflı serbest bırakma korunmuş ve iade, son tarih kuralına göre alıcıya ulaşıyor",
        "A — satıcı için daha pratik duruyor",
        "C — alıcı her zaman çıkabilmeli",
      ],
      answer: 0,
      explain: `A, 2. kuralı ihlal ediyor (herhangi biri ≠ ikisi de). C, 3. kuralın korumasını ("serbest bırakma gerçekleşmediyse") ihlal ediyor — escrow'u iki kez harcıyor. B, iadeyi *kimin tetikleyebileceğini* değiştiriyor ki spec bunu hiç kısıtlamamıştı — fonlar yine alıcıya ulaşıyor, yani spec'e sadık. Bu son ayrımı fark etmek, becerinin ta kendisi.`,
    },
    {
      kind: "theory",
      body: `## Invariant'lar: spec'in demir halkası

Bir spec'in en güçlü satırları **invariant**'lardır (değişmezler) — hangi fonksiyon çalışmış olursa olsun *her an* geçerli olması gereken ifadeler:

> escrow bakiyesi = açık depozitolar − serbest bırakmalar − iadeler

Bir invariant, uygulamanın ne kadar zekice olduğuna aldırmaz. Bir kez bozulursa kod yanlıştır. İleride **TDD** ile tanıştığında (sonraki bölümler) bu satırları çalıştırılabilir testlere çevireceksin — makinenin her dövmede yeniden denetlediği bir spec.`,
    },
    {
      kind: "fill",
      prompt: `Escrow invariant'ını tamamla:`,
      file: "SPEC.md",
      before: `balance(escrow) == deposits − releases − `,
      after: ``,
      choices: ["refunds", "fees", "profit", "gas"],
      answer: 0,
      explain: `Para escrow'dan tam olarak iki yoldan çıkar — satıcıya serbest bırakma, alıcıya iade. Bu üç terim denkleşmiyorsa biri bir delik dövmüş demektir.`,
    },
    {
      kind: "quiz",
      question: `Yapay zekâ eşin spec'i kusursuz uyguladı. Her test geçiyor. Üretimde bir alıcı, serbest bırakma işlemi *sırasında* çekim yapıyor ve escrow iki kez ödüyor — spec'inin hiç bahsetmediği bir durum.

Bug kimin?`,
      options: [
        "Spec'in — dolayısıyla senin: sahibi olduğun artefaktta bir delik vardı",
        "Yapay zekânın — eksik kuralı tahmin etmeliydi",
        "Kimsenin — tanımsız davranış sorun değil",
      ],
      answer: 0,
      explain: `Yapay zekâ çağı mühendisliğinin anlaşması bu: makine spec'in harfine göre döver, dolayısıyla spec'in harfi senin sorumluluğundur. Spec'i sıkılaştır, yeniden döv; iki okuma da ortadan kalkar.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## Sınav yapıcının sınavı: bir Lonca Bahşiş Kavanozu spec'i yaz

Kendi spec'ini dövme zamanı. Sipariş şu:

> Lonca zincir üstünde bir **bahşiş kavanozu** istiyor. Herkes içine bahşiş bırakabilir. İçindekini yalnızca loncanın **kâhyası** toplayabilir. Lonca iki konuda paranoyak: kâhyanın bir şekilde kavanozdakinden *fazlasını* alması ve kâhya ortadan kaybolursa bahşişlerin sonsuza dek sıkışıp kalması.

Spec'i yaz — bu bölümün öğrettiği gibi **yalnızca davranış**: ne olmalı, ne asla olmamalı ve sınır durumlar. Bir yapay zekâ sınav yapıcı onu aşağıdaki ölçütlere göre yargılayacak (ve tam da modelin dövdüğü gibi notlar: harfi harfine).`,
      rubric: `1. Yalnızca davranış — storage düzeni, kütüphane ya da fonksiyon imzası yok.
2. Yatırma kuralı ve toplama kuralının her biri belirsizliğe yer bırakmadan ifade edilmiş (kim, neyin üzerinde hareket edebilir).
3. Her an geçerli olması gereken en az bir **invariant**.
4. En az bir **sınır durum** ele alınmış (sıfır tutarlı bahşiş, boş kavanozdan toplama, tam bakiye toplama…).
5. "Kâhya ortadan kaybolursa" endişesi, açıkça belirtilmiş bir davranışla çözülmüş (makul her tasarım kabul edilir — ölçüt bir karar ister, belirli bir karar değil).`,
      minChars: 120,
    },
    {
      kind: "theory",
      body: `## Buradan sonraki yolun

Bu Yolculuğun her bölümü bunun gibi işler: yapay zekânın senin yerine taşımayacağı bir disiplin, **Stellar** üzerinde — gerçek makineleri olan gerçek bir ağda — pratik edilir.

Ve bir kavram seni metalin kendisine dair meraklandırdığında, **"Rust'ta gör"** kapısını ara: isteğe bağlı Kampanya'ya açılır; orada aynı fikirler çatışma çatışma, elle dövülür.

Sırada: içinde inşa edeceğin diyar — ve binlerce makinenin bir kral olmadan nasıl uzlaştığı.`,
    },
  ],
  testOut: [
    { question: `Yapay zekâ çağında spec neden mühendisliğin senin elinde kalan parçası?`,
      options: ["Kod ucuzlayınca, önce doğrunun ne demek olduğunu yazmadıysan \"doğru görünüyor\" ile \"doğru\" ayırt edilemez hale gelir","Çünkü modeller spec okuyamaz, o yüzden bir insanın tutması gerekir","Çünkü spec yazmak koddan hızlıdır, zaman kazandırır"], answer: 0 },
    { question: `Bir spec neyi tanımlar?`,
      options: ["Davranışı — ne olmalı, ne asla olmamalı ve sınır durumlar","Uygulamayı — her geliştiricinin aynı kodu üretecek kadar kesin biçimde","Storage düzenini ve public fonksiyon imzalarını"], answer: 0 },
    { question: `Birbirinden çok farklı iki uygulama da spec'ini karşılıyor. Bu ne anlama gelir?`,
      options: ["Spec işini yapıyor — davranışı kısıtlıyor, uygulamayı serbest bırakıyor","Spec fazla belirsiz, uygulama detayı eklenmesi gerek","İki uygulamadan biri yanlış olmalı"], answer: 0 },
    { question: `Bunlardan hangisi bir spec'e ait?`,
      options: ["\"Kontratın bakiyesi hiçbir zaman açık depozitoların toplamının altına düşmez\"","\"Depozitoları adresle anahtarlanmış persistent bir map'te sakla\"","\"En yeni SDK'yı kullan ve kodu temiz tut\""], answer: 0 },
  ],
};
