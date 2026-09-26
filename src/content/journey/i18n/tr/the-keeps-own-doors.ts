import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Port'lar ve adapter'lar",
  tagline: "Port'lar ve adapter'lar: kapıyı alan ilan eder, dünya ona uyar.",
  steps: [
    { kind: "theory", body: `## Port'lar ve adapter'lar

İç halka, adını anmadan chain'i nasıl *kullanır*? Bir **port** ilan ederek — alanın sahip olduğu, alanın kendi diliyle yazılmış bir interface:

> PaymentsPort: ödeme gönder, bakiye oku, varışı izle.

Kenarda **adapter**'lar port'u implement eder: bugün bir *Horizon adapter'ı*, kontratlar için bir *Soroban RPC adapter'ı*, testler için bir *fake adapter*. RPC sağlayıcısı mı değişiyor? Yeni bir adapter. Testnet'ten mainnet'e mi geçiliyor? Konfigürasyon. **Çekirdek bunların hiçbirini duymaz.**

Alan port'la konuşur. Dünya port'a takılır. Hexagonal architecture tek cümlede bu.` },
    { kind: "diagram", body: "Tek bir istek, her surdan geçerken:",
      caption: "Ok port'ta yön değiştirir. Solundaki her şey kalenin kendi dili; sağındaki her şey başkasının.",
      view: { kind: "flow", layout: "row", play: true, nodes: [
        { id: "ui", label: "ui", note: "Dış. Niyeti toplar ve içeri çağırır. Kendine ait hiçbir kuralı yoktur.", tone: "neutral" },
        { id: "usecase", label: "use-case", note: "İç. Ne olması gerektiğine alanın kendi kelimeleriyle karar verir.", tone: "accent" },
        { id: "port", label: "port", note: "İç kenar — ALANIN sahip olduğu ve adlandırdığı bir interface. Kapı budur.", tone: "gold" },
        { id: "adapter", label: "adapter", note: "Dış. Port'u tedarikçinin diliyle implement eder ve geri çevirir.", tone: "teal" },
        { id: "network", label: "ağ", note: "Horizon, RPC, bir veritabanı, testlerde bir fake. Yapısı gereği değiştirilebilir.", tone: "good" },
      ] } },
    { kind: "theory", body: `## Her şey nerede yaşıyor

Bir istek surları şöyle geçer:

**UI** (dış) → **use-case** (iç) → **port** (iç kenar) → **adapter** (dış) → ağ.

- React bileşenleri, route'lar, stil — **dış**.
- Postgres, ORM, migrasyonlar — **dış**.
- stellar-sdk, RPC istemcileri, cüzdan köprüsü — **dış**.
- "Fonlar yalnızca iki taraf da onayladığında serbest bırakılır" — **iç**, yukarıdaki listeden *hiçbir şey* import etmeyen bir modülde.

Koku testi mekaniktir: bir alan dosyası aç ve import'larını oku. O listedeki bir framework adı, bir surda gedik açılmış demektir.` },
    { kind: "fill", prompt: `Kale port'la konuşur, tedarikçiyle asla:`,
      file: "domain/release-escrow.ts",
      before: `constructor(private payments: `,
      after: `) {}`,
      choices: ["PaymentsPort", "HorizonClient", "SorobanServer", "FreighterApi"], answer: 0,
      explain: `Diğer üçü gerçek ve yararlı — ve yerleri adapter'lar, port'un arkası. Use-case yalnızca sahip olduğu interface'in adını anar; testlerde bir fake adapter'ın yerine geçebilmesinin ve yeni bir RPC sağlayıcısının bu dosyaya asla dokunmamasının sebebi bu.` },
    { kind: "theory", body: `## Sızdıran port

Bir port bağımlılık kuralını karşılayıp ona yine de ihanet edebilir. Bak:

> \`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`

Burada hiçbir şey bir adapter import etmiyor — ok hâlâ doğru yöne bakıyor ve linter mutlu. Ama *imza* tedarikçinin dilini konuşuyor. Alan artık \`TransactionBuilder\` cinsinden düşünüyor ve bu port'a dokunan her use-case sessizce bir Horizon tipi öğrenmiş oldu.

Sağlayıcıyı değiştir, interface değişir. Yani her çağıran değişir. Ki port tam da bunu önlemek için kurulmuştu.

**Port alana aittir, o halde alanın kelimeleriyle yazılmalıdır:**

> \`PaymentsPort.send(to: AccountId, amount: Money): Promise<PaymentReceipt>\`

Adapter'ın bütün işi bu iki sözcük dağarcığı arasındaki çeviridir. Kenarda hiçbir şey çevrilmiyorsa kenar hiçbir şey yapmıyordur — ve kapı bir deliktir.` },
    { kind: "theory", body: `## Test edilebilir ada

Framework import'u olmayan bir çekirdek **saf bir adadır**: bir testte kur, eline bir fake adapter ver, davranış üzerinde assert et. Ağ yok, docker'lanmış chain yok, flaky RPC yok — Kırmızı-Yeşil Ayini'nin testleri, **milisaniyeler** içinde koşuyor.

Sessiz, katlanarak büyüyen kazanç bu: temiz kaleleri olan ekipler daha çok test yazar *çünkü testler ucuzdur*, ucuz testler de sıkı döngüler demektir — insanlar için de modeller için de.

Adapter'lar yine de gerçek ağa karşı kendi testlerini hak eder — ince, dürüst bir katman, kendi daha yavaş hızında ayrıca test edilir.` },
    { kind: "theory", body: `## Değişim, sayılmış halde

Temiz kalesi olan bir ekip Horizon'dan bir Soroban RPC sağlayıcısına geçiyor. İşte bütün diff, dosya dosya:

- **\`adapters/soroban-rpc.ts\`** — yeni, ~120 satır. \`PaymentsPort\`'u implement eder, sağlayıcının hatalarını alanın kendi hata tiplerine çevirir.
- **\`wiring/container.ts\`** — bir satır değişti, hangi adapter'ın kurulacağını seçen satır.
- **\`adapters/soroban-rpc.test.ts\`** — yeni, gerçek ağa karşı kendi daha yavaş hızında test edilir.

Ve **değişmeyen** dosyaların listesi: her entity, her use-case, her alan testi. Migrasyon sırasında biri dikkatli davrandığı için değil — oradaki hiçbir şey daha en başından eski sağlayıcının adını anamadığı için.

Mimarinin gerçekte ne için olduğu bu. Zarafet değil: **bir tedarikçinin yol haritası, bir dosya ve bir satıra fiyatlanmış.**` },
    { kind: "quiz", question: `RPC sağlayıcın kapanacağını duyuruyor. Port'lar ve adapter'lar üzerine kurulu bir kalede neyin değişmesi gerekir?`,
      options: [
        "Tek bir adapter, artı onu seçen wiring — alan ve use-case'ler hiç değişmez",
        "Ödeme gönderen her use-case, çünkü her biri sağlayıcıyı çağırır",
        "Alan entity'leri, çünkü endpoint URL'si onların üstünde saklanır",
      ], answer: 0,
      explain: `Mimarinin ROI'si tek satırda bu: tedarikçi değişimi bir adapter'a fiyatlanır. Kod tabanındaki dürüst cevap "her use-case" ise bağımlılık okları yanlış yöne bakıyor demektir.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## Sınav yapıcının sınavı: kapıları ilan et

Alanın kendi kelimeleriyle ifade edilmiş bir use-case:

> **Bir escrow'u serbest bırak.** İki taraf da onayladığında ve deadline geçmediğinde, escrow'daki tutar satıcıya gider ve escrow kapanır. Deadline geçmiş ve yalnızca bir taraf onaylamışsa tutar bunun yerine alıcıya geri döner.

Bu use-case'in ihtiyaç duyduğu **port**'ları ilan et — alanın sahip olduğu kapıları. Her biri için: ne işe yaradığını ve **alanın sözcük dağarcığıyla** neyin girip neyin çıktığının şeklini. Sonra her biri için yazacağın bir adapter ve o adapter'ın çevirmek zorunda olduğu bir şey adlandır.`,
      rubric: `1. Her biri belirtilmiş bir amaçla, en az iki port ilan eder.
2. Her port'un girdileri ve çıktıları ALAN terimleriyle adlandırılmıştır — tedarikçi tipi yok, SDK sınıf adı yok, HTTP ya da SQL sözcük dağarcığı yok.
3. Port başına en az bir somut adapter adlandırır.
4. Bir adapter'ın tedarikçinin sözcük dağarcığı ile alanınki arasında çevirmek zorunda olduğu en az bir şey belirtir.
5. Use-case'in kendi kararı (fonları kimin, ne zaman alacağı) use-case'te kalır — bir port'a devredilmez.`,
      minChars: 180 },
    { kind: "theory", body: `## Küçük surlar, küçük prompt'lar

Kalenin yapay zekâ çağında sana kazandırdığı şu: **iyi sınırlanmış modüller, iyi sınırlanmış prompt'lardır.**

"Horizon adapter'ını yeni RPC'yi hedefleyecek şekilde yeniden yaz — işte karşılaması gereken port, işte testleri" bir modelin *bir kutunun içinde* tamamladığı bir görevdir: tek bir küçük dosyalık bağlam, karşılanacak bir sözleşme, geçilecek testler ve patlama yarıçapını sınırlayan surlar. Model, kalede hiç dolaşmadan tek bir odayı yeniden inşa eder.

Sıradaki disiplin: modelin kendisi — ve etrafına kurman gereken tezgâh.` },
  ],
  testOut: [
    { question: `İç halka, adını anmadan chain'i nasıl kullanır?`,
      options: ["Bir port ilan eder — alanın sahip olduğu ve kendi kelimeleriyle yazdığı bir interface — ve kenarda bir adapter onu implement eder","SDK'yı import eder ama bağlaşmayı sınırlamak için her çağrıyı try/catch içine alır","Adapter'ı doğrudan çağırır, çünkü adapter'lar dış halkanın kendi meselesidir"], answer: 0 },
    { question: `\`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`. Ok içeri bakıyor. Hâlâ yanlış olan ne?`,
      options: ["İmza tedarikçinin dilini konuşuyor, bu yüzden sağlayıcıyı değiştirmek interface'i ve onunla birlikte her çağıranı değiştirir","Hiçbir şey — bağımlılık kuralı karşılanıyor ve bütün test bundan ibaret","Bir Promise döndürüyor, bu da alanı async runtime'a bağlıyor"], answer: 0 },
    { question: `RPC sağlayıcın kapanacağını duyuruyor. Port'lar ve adapter'lar üzerine kurulu bir kalede ne değişir?`,
      options: ["Tek bir adapter, artı onu seçen wiring — alan ve use-case'ler hiç değişmez","Ödeme gönderen her use-case, çünkü her biri sağlayıcıyı çağırır","Alan entity'leri, çünkü endpoint onların üstünde saklanır"], answer: 0 },
    { question: `Framework'süz bir çekirdek, Ayin'deki döngüyü neden ucuzlatır?`,
      options: ["Bir testte fake bir adapter'la kurulur ve milisaniyeler içinde assert eder — ağ yok, container yok, flake yok","Daha küçük bir binary'ye derlenir, böylece test runner daha hızlı başlar","Adapter testlerine olan ihtiyacı kaldırır, test paketini yarıya indirir"], answer: 0 },
  ],
};
