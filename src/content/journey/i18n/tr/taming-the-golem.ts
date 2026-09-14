import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Golem'i Ehlileştirmek",
  tagline: "Harness engineering: model kiralıktır, harness ise senindir.",
  steps: [
    {
      kind: "theory",
      body: `## Boşluktaki bir zihin

Her şeyi soyup at, bir LLM tam olarak tek bir şey yapar: **metin girer, metin çıkar**. Kod çalıştıramaz, repo'nu okuyamaz, zinciri kontrol edemez. Tek başına, boşluktaki bir zihindir — parlak, kör ve silahsız.

O zihni bir *işçiye* dönüştüren her şey **harness**'tır (koşum takımı): çağırabildiği araçlar, dokunabildiği dosyalar, onu içinde tutan sandbox, çıktısını yargılayan doğrulayıcılar.

Ve işte çoğu kişinin gözden kaçırdığı kısım: model kiralıktır. **Harness ise mühendisliktir — ve senindir.**`,
    },
    {
      kind: "theory",
      body: `## Bir harness'ın anatomisi

Çalışan bir harness'ın adı konmuş parçaları vardır:

- **Model** — zihin.
- **Araç seti** — ne *yapabildiği*: test çalıştırmak, dosya düzenlemek, bir Stellar RPC'sine sormak.
- **İzinler** — neye dokunabildiği ve neye dokunamadığı.
- **Çalışma dizini** — gördüğü dünya.
- **Test runner** — çıktısının karşısına çıkmak zorunda olduğu yargıç.
- **İnceleme adımı** — bir insanın (ya da başka bir modelin) diff'i incelediği yer.

Aynı modele sahip, harness'ları farklı iki ekip *fena halde* farklı sonuçlar alır. Çıktı kalitesi kaydığında mühendisler harness'ı debug eder — burcu değil.`,
    },
    {
      kind: "diagram",
      body: "Bir harness, dört parçada:",
      caption: "Modeli değiştir, bu yine ayakta kalır. Varlık olan harness'tır, prompt değil; sebebi bu.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "context",
            label: "ne görebildiği",
            note: "Dosyalar, dokümanlar, patlayan çıktı. Seçilmiş — sahip olduğun her şey değil.",
            tone: "accent",
          },
          {
            id: "tools",
            label: "ne yapabildiği",
            note: "Sınırlı bir fiil kümesi. Eksik olan her fiil, yapamayacağı bir hatadır.",
            tone: "teal",
          },
          {
            id: "run",
            label: "bırak hareket etsin",
            note: "Hamlesini yapar; tezgâh da kibarca onaylamak yerine dürüstçe cevap verir.",
            tone: "neutral",
          },
          {
            id: "verify",
            label: "işi kontrol et",
            note: "Testler, tipler, bir linter. Çıktıyı sonuca çeviren şey doğrulamadır.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Aynı model, aynı türde iş — ama bu ayın sonuçları geçen aydan çok daha kötü. Bir harness mühendisi ilk nereye bakar?`,
      options: [
        "Modelin etrafındakilere — verilen bağlama, çalıştırabildiği araçlara, çıktısını süzen kontrollere",
        "Modelin ağırlıklarına — yoğun kullanımda makine gibi aşınırlar",
        "Hiçbir yere — örnekleme rastgeleliği her dalgalanmayı açıklar, dolayısıyla yapılacak bir şey yoktur",
      ],
      answer: 0,
      explain: `Ağırlıklar aşınmaz, rastgelelik de kalıcı bir düşüşü nadiren açıklar. Harness parçaları ise sürekli kayar — yeri değişen bir dosya, susturulmuş bir test runner, genişletilmiş bir izin — ve her biri incelenebilir, diff'lenebilir, düzeltilebilir. Harness'a sahip olmanın önemi tam da burada.`,
    },
    {
      kind: "theory",
      body: `## Doğrulama güveni yener

Modelin en tehlikeli huyu cehalet değil — **yanılırken bile kendinden emin olması**. Deploy başarılı da olsa hiç gerçekleşmemiş de olsa, başarıyı aynı sıcak tonda ilan eder. Kendine güven bir *üslup*, sinyal değil.

Bu yüzden bir harness asla güvenmez; tatlı dille kandırılamayan yargıçlar kullanarak **yeniden kontrol eder**:

- **derleyici** — build bile oluyor mu?
- **test paketi** — Ayin'den kalan sınavların, kırmızı ya da yeşil
- **linter** — standartlar korundu mu?
- **zincirin kendisi** — ledger, modelin söylediğini söylüyor mu?

İddialar veridir. Doğrulayıcılar hakikattir.`,
    },
    {
      kind: "quiz",
      question: `Model raporluyor: "Kontrat başarıyla deploy edildi ve başlatıldı." İyi kurulmuş bir harness bu cümleyle ne yapar?`,
      options: [
        "Onu bir iddia sayar — zinciri okur, kontratı çeker, bir view fonksiyonu çağırır ve ledger'a inanır",
        "Kabul eder — modeller doğru söylemek üzere eğitilmiştir ve bu model şimdiye dek güvenilirdi",
        "Modelden aynı oturumda kendi işini dikkatlice bir kez daha kontrol etmesini ister",
      ],
      answer: 0,
      explain: `Aynı zihnin kendi işini incelemesi aynı kör noktaları paylaşır — deploy'un çalıştığına inandıysa, yine inanır. Bağımsız doğrulayıcılar kimsenin kör noktasını paylaşmaz; Stellar'da bir RPC okuması da milisaniyeler tutar. Ledger, sahip olacağın en ucuz yalan makinesidir.`,
    },
    {
      kind: "fill",
      prompt: `Harness mühendisinin ilk hamlesini tamamla:`,
      file: "NOTES.md",
      before: `Model deploy'un başarılı olduğunu söylüyor. O cümle herhangi bir şeyi değiştirmeden önce harness `,
      after: ` .`,
      choices: [
        "zinciri okur ve kontrol eder",
        "modelden bunu doğrulamasını ister",
        "iddiayı çalışma günlüğüne kaydeder",
        "ne olur ne olmaz diye deploy'u tekrarlar",
      ],
      answer: 0,
      explain: `Aynı zihinden kendi işini doğrulamasını istemek, aynı kör noktayı iki kez satın almaktır. Günlüğe yazılmış bir iddia da hâlâ iddiadır — sadece artık resmî görünür. Stellar'da kontrol tek bir RPC okumasına mal olur; ledger'ı sahip olacağın en ucuz yalan makinesi yapan da bu.`,
    },
    {
      kind: "labLink",
      labSlug: "guild-vault",
      body: `Bir doğrulama harness'ının içinde şu anda durabilirsin. Forge'daki **Lonca Kasası** lab'ı sana bir hesabın imza eşiğini yükselttiriyor, böylece hazine iki yetkili istiyor — sonra da sözüne güvenmiyor. Sunucu ledger'ı okuyup imzacı kümesini kendisi kontrol ediyor. Yaptım demek kontrol değildir; zincir öyledir.`,
    },
    {
      kind: "theory",
      body: `## Atlanan yarı

Artık bir harness'ın parçalarını sayabiliyorsun ve daha önemlisi, modelin kendi işi hakkında söylediği hiçbir şeye inanmayı reddedebiliyorsun.

Şimdiye kadar her şey ona **el** vermekle ilgiliydi — araçlar, bir dizin, bir runner. Daha zor soruyu henüz kimse sormadı: tam olarak hangi eller ve o elleri kendinden emin ama yanlış bir plan üzerinde kullandığı gün ne olur?

**Sırada:** işin gerçekte ne kadar güce ihtiyacı olduğu ve kurduğun her adıma sorman gereken o tek soru.`,
    },
  ],
  testOut: [
    {
      question: `Harness nedir ve neden prompt'tan daha önemlidir?`,
      options: [
        "Modelin etrafındaki her şey — araçlar, izinler, çalışma dizini, doğrulayıcılar. Model kiralıktır; harness senindir ve model değişse de ayakta kalır",
        "Davranışın asıl belirlendiği yer olan sistem prompt'u ve talimatları",
        "Gecikmeyi ve verimi belirleyen sağlayıcı altyapısı",
      ],
      answer: 0,
    },
    {
      question: `Aynı model, aynı işler ve bu ayın çıktısı çok daha kötü. Bir harness mühendisi ilk nereye bakar?`,
      options: [
        "Modelin etrafındakilere — verilen bağlama, mevcut araçlara, çıktıyı süzen kontrollere",
        "Ağırlıklara — sürekli yük altında bozulurlar",
        "Hiçbir yere — örnekleme rastgeleliği her dalgalanmayı açıklar",
      ],
      answer: 0,
    },
    {
      question: `Modelin en tehlikeli huyu nedir?`,
      options: [
        "Yanılırken bile kendinden emin olması — bir şey olsun olmasın, başarıyı aynı sıcak tonda bildirir",
        "Cehalet — hiç görmediği şeyler vardır",
        "Uzun işlerde yavaşlık — insanları incelemeyi atlamaya iter",
      ],
      answer: 0,
    },
    {
      question: `"Kontrat başarıyla deploy edildi ve başlatıldı." İyi bir harness bu cümleyle ne yapar?`,
      options: [
        "Onu bir iddia sayar, zinciri okur, bir view fonksiyonu çağırır ve ledger'a inanır",
        "Kabul eder — model şimdiye dek güvenilirdi",
        "Modelden aynı oturumda kendi işini bir kez daha kontrol etmesini ister",
      ],
      answer: 0,
    },
  ],
};
