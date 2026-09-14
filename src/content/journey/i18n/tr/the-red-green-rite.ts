import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Kırmızı-Yeşil Ritüeli",
  tagline: "TDD: önce testler, sonra dövmek.",
  steps: [
    {
      kind: "theory",
      body: `## Spec diş çıkarıyor

Bölüm I'de *doğru*nun ne demek olduğunu yazıya dökmeyi öğrendin. Bir **test**, o cümlenin çalıştırılabilir hali — makinenin milisaniyeler içinde, her seferinde, sonsuza dek yeniden denetlediği bir spec (spesifikasyon).

Bu, yapay zekâyla *daha çok* önem kazanıyor, daha az değil. Bir model senin düzyazınla tartışabilir, niyetini yeniden yorumlayabilir, gereksinimlerini "iyileştirebilir". Ama \`assert_eq!\` ile tartışamaz. **Testler, makinenin itiraz edemediği spec'tir** — akla yatkın bir cevapla doğru cevabın birbirine karışmaktan çıktığı tek yer.

Onları **önce** yaz; ondan sonra dövdüğün her şey doğduğu andan itibaren notlanır.`,
    },
    {
      kind: "theory",
      body: `## Ritüel: kırmızı, yeşil, refactor

TDD üç vuruşluk bir ritüel ve mesele tam da sıralamada:

1. **Kırmızı** — henüz var olmayan bir davranış için küçük bir test yaz. Çalıştır. **Başarısız olmasını izle.**
2. **Yeşil** — onu geçiren en basit kodu yaz. En zekicesini değil. En basitini.
3. **Refactor** — şimdi, ağ gerildiğine göre, temizle. Sen parçaları oynatırken testler arkanı kollar.

Kırmızı, testin koruduğu bug'ı gerçekten yakalayabildiğini kanıtlar. Yeşil, davranışın var olduğunu kanıtlar. Refactor ise iyi kodun asıl yapıldığı yer — hem de *güvenle*.`,
    },
    {
      kind: "diagram",
      body: "Üç hamle, sonsuza dek:",
      caption: "Sıralama, disiplinin TA KENDİSİ: koddan sonra yazılan bir test, yalnızca kodun yaptığı şeyi yaptığını kanıtlar.",
      view: {
        kind: "flow",
        layout: "cycle",
        play: true,
        nodes: [
          {
            id: "red",
            label: "kırmızı",
            note: "Önce sınavı yaz ve başarısız olmasını izle. Hiç başarısız olmamış bir test hiçbir şey kanıtlamaz.",
            tone: "bad",
          },
          {
            id: "green",
            label: "yeşil",
            note: "Onu geçiren en küçük değişiklik. Zarif olanı değil — en küçüğü.",
            tone: "good",
          },
          {
            id: "refactor",
            label: "refactor",
            note: "Şimdi iyileştir; sen parçaları oynatırken sınav davranışı sabit tutar.",
            tone: "accent",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Yapay zekâ eşin bir özellik *ve* onun için yeni bir test teslim ediyor. Test suite'ini çalıştırıyorsun: ilk denemede her şey yeşil. Ritüele hâlâ ne borçlusun?`,
      options: [
        "Özelliği boz (ya da geri al) ve yeni testin kırmızıya dönmesini izle — hiç başarısız görülmemiş bir test, hiçbir şeyi test etmiyor olabilir",
        "Hiçbir şey — ilk çalıştırmada yeşil, olabilecek en iyi sonuç",
        "Yeşilin kararlı olduğundan emin olmak için suite'i birkaç kez daha çalıştır",
      ],
      answer: 0,
      explain: `Aynı model hem kodu hem testlerini dövdüğünde, çok az şey iddia eden bir test sonsuza dek yeşil kalır. Kırmızı, bir testin dişi olduğunun tek kanıtı — bilerek yapılan tek bir kırılma, onun ısırdığını gösterir.`,
    },
    {
      kind: "theory",
      body: `## İyi bir sınavın anatomisi

İyi bir unit test üç hamlede okunur — **arrange, act, assert** (hazırla, uygula, doğrula):

- **Arrange** — dünyayı kur: bir depozito tutan bir escrow (emanet), son tarih çoktan geçmiş.
- **Act** — *tek* bir şey yap: alıcı refund'ı çağırır.
- **Assert** — *tek bir davranışı* denetle: alıcının bakiyesi depozito kadar arttı.

Test başına tek davranış ve onu söyleyen bir isim: \`refund_after_deadline_returns_deposit\`. O test başarısız olduğunda, başarısızlık teşhisin *ta kendisi* — arkeoloji gerekmez.`,
    },
    {
      kind: "quiz",
      question: `Tek bir test depozito yatırıyor, onaylıyor, serbest bırakıyor, iade ediyor ve dört farklı davranış üzerine assert yapıyor. Bu gece kırmızı. Bu testin asıl sorunu ne?`,
      options: [
        "Başarısız olduğunda hangi davranışın bozulduğunu söyleyemezsin — çok davranışlı bir test, her başarısızlığı arkeolojiye çevirir",
        "Hiçbir şey — test başına daha fazla assertion her zaman daha fazla koruma demektir",
        "Fazla yavaş — çözüm, onu başka testlerle birleştirip daha da büyük tek bir test yapmak",
      ],
      answer: 0,
      explain: `Mesele kapsama değil — teşhis. Dört odaklı test aynı bug'ları yakalar ve kırmızıya dönen test, bozulan davranışın *adını* bedavaya söyler.`,
    },
    {
      kind: "theory",
      body: `## Örneklerden invariant'lara

Örnek tabanlı bir test tek bir noktayı sabitler: *şu* girdi, *bu* çıktı. **Property (özellik) tarzı düşünme** ise bir yasayı sabitler: *her* girdi için geçerli olması gereken bir şey.

Bölüm I'deki invariant'ların (değişmezlerin) tam olarak bu yasalar:

> escrow bakiyesi = depozitolar − serbest bırakmalar − iadeler

Testlerinin yaptığı *her* işlemden sonra bunu assert et — depozito, serbest bırakma, iade, tuhaf sıralamalar — ve tek bir örneğin etrafına çit çekmek yerine bütün durum uzayına yayılmış bir tuzak teli kurmuş olursun. Spec'indeki her invariant, denetlenmesi hiç bitmeyen en az bir assertion'ı hak eder.`,
    },
    {
      kind: "fill",
      prompt: `Bölüm I'in invariant'ını çalıştırılabilir bir sınava çevir:`,
      file: "escrow_test.rs",
      before: `assert_eq!(escrow.balance(), deposits - releases - `,
      after: `);`,
      choices: ["refunds", "fees", "interest", "gas"],
      answer: 0,
      explain: `Bölüm I'deki aynı demir halka, artık dişleriyle: para escrow'dan yalnızca serbest bırakma ya da iade olarak çıkar. Bir assertion olarak yazıldığında makine onu her dövmede yeniden denetler — bedava, sonsuza dek.`,
    },
    {
      kind: "theory",
      body: `## Modelin işini korkusuzca kabul etmek

İşte ödül. Bir yapay zekâ sana 300 satır teslim ediyor. Test yoksa seçeneklerin şunlar: *her satırı çok dikkatle oku* ya da *güven*. İkisi de ölçek büyüyünce çöker.

Önceden yazılmış bir suite'le kabul mekanik hale gelir: **kırmızı — reddet**, başarısızlık geri bildirim olarak. **Yeşil — kabul et**, üslubu da keyfine göre sonra oku.

Aynı ağ refactoring'i de korkusuz kılar — hem seninkini hem modelinkini. "Bu modülü yeniden yaz, testleri yeşil tut" *yalnızca* sınavlar var olduğu ve model onları kendi koduna uydurarak yazma fırsatı bulamadığı için güvenli bir talimattır.`,
    },
    {
      kind: "quiz",
      question: `Model gururla **%100 satır kapsaması** rapor ediyor. Aslında ne öğrendin?`,
      options: [
        "Testler sırasında her satır çalıştı — bu, assertion'ların gerçekte ne kadar davranış denetlediği hakkında hiçbir şey söylemez",
        "Kod doğru — her satır çalıştırıldı ve geçti",
        "Suite tamamlandı — %100'ün ötesinde test etmeye değer bir şey kalmadı",
      ],
      answer: 0,
      explain: `Kapsama, çalıştırılan satırları sayar, tutulan sözleri değil. Bir suite her satıra dokunup neredeyse hiçbir şey assert etmeyebilir. Davranışların ve invariant'ların peşine düş; kapsama bir yan ürün olsun, asla hedef.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "rust-fundamentals-1",
      body: `Kampanya hakkında bir sır: **her çatışma gizli sınavlarla notlanır** — sen dövüyorsun, sınavlar yargılıyor, kırmızı ya da yeşil. Kampanya, oyun olarak oynanan TDD'nin *ta kendisi* ve sen ilk çatışmandan beri ritüelin içindesin. Sıradaki disiplin: bir kelimenin anlam değiştirdiği sınırları çizmek — her spec'in bağlı olduğu harita.`,
    },
  ],
  testOut: [
    { question: `Başarısız olan testi neden koddan önce yazmalı?`,
      options: ["Hiç başarısız olmamış bir test, başarısız olabildiğini hiç kanıtlamamıştır — onu önce yazmak, doğru şeyi izlediğini bilmenin yoludur","Daha hızlı, çünkü testi sonradan yeniden yazmaktan kurtulursun","Uygulamayı, aksi halde olacağından daha basit olmaya zorlar"], answer: 0 },
    { question: `Kırmızı bir test, yapay zekâ eşine düzyazı gereksinimlerin vermediği neyi verir?`,
      options: ["Yanlış okuyamayacağı bir kabul kriteri ve kötü haber olabilen bir sinyal","Daha fazla bağlama yer bırakan daha kısa bir prompt","Public API'yi değiştirme izni"], answer: 0 },
    { question: `Model, başarısız testi tam olarak testin kullandığı girdiyi özel durum yaparak geçiriyor. Bu ne gösterir?`,
      options: ["Test, davranışı eksik belirtmiş — kuralı değil, tek bir örneği adlandırmış","Model kötü niyetli davranıyor ve daha sıkı talimatlara ihtiyacı var","Hiçbir şey; testi geçirmek 'bitti'nin tanımıdır"], answer: 0 },
    { question: `Emin olmadığın bir değişiklikten sonra suite'in yeşil. Bu sana aslında ne söyledi?`,
      options: ["Suite'in izlediği hiçbir şeyin bozulmadığını — ki bu da ancak suite'in tesadüfen izlediği kadardır","Değişikliğin doğru olduğunu","Değişikliğin deploy etmek için güvenli olduğunu"], answer: 0 },
  ],
};
