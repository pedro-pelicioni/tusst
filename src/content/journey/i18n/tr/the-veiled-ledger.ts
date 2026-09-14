import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Örtülü Ledger",
  tagline: "Zero-knowledge ve gizli token'lar: açıklamadan kanıt.",
  steps: [
    {
      kind: "theory",
      body: `## Şeffaflık bir özelliktir — sızdırana kadar

Şimdiye kadar inşa ettiğin her şey radikal biçimde halka açık: her bakiye, her ödeme, her karşı taraf, sonsuza dek.

Finans için bu çoğu zaman *asıl* satış argümanı — denetlenebilir rezervler, doğrulanabilir raylar. Ama gerçek bir işletmenin karşısına koy, tersine keser:

- Maaşları zincir üstünde öde, **her çalışan diğer herkesin maaşını okusun**.
- Bir tedarikçiye öde, **rakiplerin fiyatlarını ve hacimlerini okusun**.
- Hazineyi hareket ettir, piyasa niyetinin önüne geçsin.

Ciddi paranın *seçici* sessizliğe ihtiyacı var. Soru şu: halka açık bir ledger, kendisi bir sır olmadan nasıl sır tutabilir?`,
    },
    {
      kind: "diagram",
      body: "Aynı ödeme, iki taraftan görünüşü:",
      caption: "Buradaki hiçbir şey bugün şifreli değil. Her satır tasarım gereği herkese açık — özellik de bu, sızıntı da.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "explorer",
            label: "herkesin okuyabildiği",
            tone: "bad",
          },
          {
            id: "you",
            label: "paylaşmayı kastettiğin",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "tutar",
            cells: [
              {
                text: "kuruşu kuruşuna rakam, sonsuza dek",
                tone: "bad",
              },
              {
                text: "bir ödemenin yapıldığı",
                tone: "good",
              },
            ],
          },
          {
            label: "karşı taraf",
            cells: [
              {
                text: "adresi ve o adresin şimdiye kadar yaptığı her şey",
                tone: "bad",
              },
              {
                text: "onlar hakkında hiçbir şey",
                tone: "good",
              },
            ],
          },
          {
            label: "maaş bordron",
            cells: [
              {
                text: "her maaş, yan yana kıyaslanabilir halde",
                tone: "bad",
              },
              {
                text: "kimseyi ilgilendirmez",
                tone: "good",
              },
            ],
          },
          {
            label: "nakit ömrün",
            cells: [
              {
                text: "bakiyen, stroop'una kadar",
                tone: "bad",
              },
              {
                text: "kimseyi ilgilendirmez",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Açıklamadan kanıt

Cevap kriptografinin en tuhaf armağanından geliyor: **zero-knowledge proof** (sıfır bilgi kanıtı).

Bir ZK kanıtı, doğrulayıcıyı bir ifadenin doğru olduğuna ikna eder — *"bu gizli tutar pozitif ve gizli bakiyem onu karşılıyor"* — ve bunun dışında **hiçbir şey** açığa çıkarmaz: ne tutarı, ne bakiyeyi.

Kanıt, herkesin ucuza kontrol edebileceği küçük bir matematik parçasıdır ve kontrol etmek için kanıtlayana güvenmek gerekmez. Doğrulanıyorsa ifade geçerlidir. Nokta.

Böyle bir doğrulayıcıyı ledger'ın kurallarının içine koy; zincir, görmesine asla izin verilmeyen sayılar hakkında dürüstlüğü zorunlu kılabilsin.`,
    },
    {
      kind: "theory",
      body: `## Diyar araçları döver

Zincir üstü doğrulamanın **host function** olarak belirli ağır matematiğe ihtiyacı var — ve Stellar bunu katman katman gönderdi:

- **CAP-59**, **BLS12-381** eğri işlemlerini getirdi ve Soroban kontratlarının içinde **Groth16** kanıt doğrulamasını mümkün kıldı.
- **Protokol 25 ve 26**, **BN254** eğrisini ve **Poseidon hash**'ini ekledi — ZK devrelerinin *içinde* ucuz olacak şekilde tasarlanmış bir hash.

Dengeyi değiştiren o ikinci dalga oldu: Stellar'da **özel ödeme sistemlerini pratik** hale getirdi. Primitifler protokol seviyesinde, dolayısıyla her kontrat kanıtları yerel hızda doğrular — kriptografiyi dürüstçe yapmanın bin katlık maliyet cezası yok.`,
    },
    {
      kind: "quiz",
      question: `Zincir üstü bir ZK doğrulayıcı bir kanıtı kabul ettiğinde ne öğrenir?`,
      options: [
        "Yalnızca kanıtlanan ifadenin doğru olduğunu — arkasındaki gizli değerler gizli kalır",
        "Altta yatan değerleri; onları kontrol eder, sonra atar",
        "Hiçbir şey — kabul, olasılıksal bir pazarlama numarasıdır",
      ],
      answer: 0,
      explain: `Bu asimetri numaranın tamamı: geçerlilik halka açık olurken veri özel kalır. Ledger, tek bir bakiye bile okumadan "kimse sahip olmadığını harcayamaz" kuralını uygulayabilir.`,
    },
    {
      kind: "theory",
      body: `## Confidential Token'lar: tutarları örtmek

**Confidential Token'lar** (gizli token'lar), **OpenZeppelin ve Nethermind** tarafından inşa edildi ve **Haziran 2026**'da geliştirici ön izlemesine ulaştı. Tasarım zarif bir biçimde müdahalesiz:

- Mevcut herhangi bir **SEP-41** token'ının üzerine bir **wrapper kontratı** — Stellar Asset Contract'ı üzerinden USDC, kontrat yerlisi token'lar, standardı konuşan her şey.
- Token'larını sar; **bakiyen ve transfer tutarların gizlensin**, zero-knowledge kanıtlarıyla korunsun.
- **Adresler herkese açık kalır**: explorer hâlâ *kimin* kiminle işlem yaptığını görür — yalnızca *ne kadar* olduğunu görmez.

Birbirini tanıyan ama rakamları gizli tutması gereken taraflar için inşa edildi: maaş bordrosu, tedarikçi faturaları, B2B hesaplaşma.`,
    },
    {
      kind: "theory",
      body: `## Çekmediğin örtü

İnsanların fazla erken rahatladığı yer burası. Maaş bordrosunu bir Confidential Token'a sardın, tutarlar karardı ve problem çözülmüş gibi hissettiriyor.

Bir gözlemcinin elinde hâlâ ne olduğuna bak. Bir adres kırk adrese ödeme yapıyor. Bunu her ayın birinde yapıyor, on beşinde bir daha. O kırk adresten ikisi mart ayında almayı bıraktı, nisanda üç yenisi başladı. İçlerinden biri hem senin adresinden hem de ikinci bir şirketin adresinden alıyor.

Kimse tek bir maaş öğrenmedi — ve gözlemci artık çalışan sayını, ödeme döngünü, personel kaybını, işe alımlarını ve çalışanlarından hangilerinin ek iş yaptığını biliyor. **Tutarlar, ledger'ın söylediği tek şey hiçbir zaman değildi.**

Bu Confidential Token'larda bir kusur değil; vaat ettikleri şeyin biçimi bu. Bir örtü, seçtiğin alanı kapatır ve kapatılmayan her alan konuşmaya devam eder — zamanlama, sıklık ve her şeyden önce kimin kime dokunduğunun **grafı**.

İkinci, daha derin bir sistemin var olması gerekmesinin nedeni tam olarak bu.`,
    },
    {
      kind: "fill",
      prompt: `Bir Confidential Token neyi sarabilir?`,
      file: "veil.txt",
      before: `confidential token  =  herhangi bir  `,
      after: `  token'ın üzerine ZK wrapper — tutarlar gizli, adresler açık`,
      choices: ["SEP-41", "SEP-24", "SEP-10", "SEP-1"],
      answer: 0,
      explain: `Kanca, token arayüzü standardı: SEP-41 konuşan her şey sarılabilir — Stellar Asset Contract'ları üzerinden USDC gibi klasik varlıklar dahil. Gizlilik katmanı, zaten bildiğin her şeyle birleşiyor.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-protocol-27-1",
      body: `Bunların hiçbiri birinin yayımladığı bir kütüphane değildi. BLS12-381, BN254, Poseidon — her biri **adı konmuş bir protokol sürümünün içinde bir CAP** olarak geldi; bir kontratın kriptografiyi dürüstçe yapmak için bin katlık ceza ödemek yerine bir kanıtı yerel hızda doğrulamasının nedeni bu. Kampanya'nın protokol perdesi, bir sürümün gerçekten inişini izlediğin yer.`,
    },
    {
      kind: "theory",
      body: `## İmkânsız gibi gelen yarı

Artık sayılar için bir örtün var. Maaş bordrosu, faturalar, birbirini zaten tanıyan taraflar arasındaki hesaplaşma için gereksinimin tamamı bu — sır, rakamlardı.

Ama bazen sır rakamlar değildir. Bazen hassas olan *kimin kime ödediğidir*: bir bağış, rakiplerin öğrenmesini istemediğin bir tedarikçi, halka açık raylarda kişisel bir transfer.

Onu gizlemek daha derin örtüdür ve bariz bir itirazla gelir — her uyumluluk sorumlusunun ilk dakikada dile getirdiği, elle geçiştirmek yerine ciddiye almaya değer olan itiraz.

**Sırada:** ikinci örtü ve o itiraza verilen cevap.`,
    },
  ],
  testOut: [
    {
      question: `Bir işletme için tamamen şeffaf bir ledger'ın problemi nedir?`,
      options: [
        "Bakiyeler ve tutarlar sonsuza dek herkese açıktır; dolayısıyla herkes sıradan ödemelerden maaşları, marjları ve tedarikçi koşullarını çıkarabilir",
        "İşlemler gözlemciler tarafından geriye izlenip geri alınabilir",
        "Herkese açık veri, ledger'ın büyük ölçekte sorgulanmasını yavaşlatır",
      ],
      answer: 0,
    },
    {
      question: `Bir zero-knowledge kanıtı, doğrulayıcının neye kanaat getirmesini sağlar?`,
      options: [
        "Gizli değerler hakkındaki bir ifadenin doğru olduğuna — o değerler hakkında başka hiçbir şey öğrenmeden",
        "Kanıtlayanın üçüncü bir tarafça doğrulanmış, güvenilir bir taraf olduğuna",
        "Gizli değerlerin doğrulayıcının seçtiği bir aralığa düştüğüne",
      ],
      answer: 0,
    },
    {
      question: `Bu primitifler neden protokol seviyesinde host function olarak gelmek zorundaydı?`,
      options: [
        "Kontratlar kanıtları yerel hızda doğrulasın diye — aynı matematiği kontrat kodunda yapmak ezici bir maliyet cezası taşırdı",
        "Çünkü kontratların kriptografi yapmasına izin verilmez",
        "Yalnızca denetlenmiş kontratlar kullanabilsin diye",
      ],
      answer: 0,
    },
    {
      question: `Bir Confidential Token mevcut bir token'ı sarar. Ne değişir, ne değişmez?`,
      options: [
        "Bakiyeler ve transfer tutarları gizlenir; işlem yapan adresler herkese açık kalır",
        "Adresler gizlenir; tutarlar herkese açık kalır",
        "İkisi de gizlenir; onu gizli yapan da budur",
      ],
      answer: 0,
    },
  ],
};
