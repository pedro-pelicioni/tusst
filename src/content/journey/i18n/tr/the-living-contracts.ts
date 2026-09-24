import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Soroban: Stellar'da kontratlar",
  tagline: "Soroban: ledger'da Wasm ve state koymak için üç raf.",
  steps: [
    {
      kind: "theory",
      body: `## Kontratlar diyara giriyor

**Soroban**, Stellar'ın akıllı kontrat platformu. Bir kontrat, **WebAssembly'ye derlenmiş Rust**'tır: ledger'a yüklenir ve sandbox'lanmış bir host'un içinde çalıştırılır — sahip olduğu her güç (depolama, kripto, başka kontratları çağırma) protokolün sağladığı **host function**'lar üzerinden gelir.

Zarif kısım da şu: birini çağırmak için yeni bir işlem formatı gerekmez. Parçalarına ayırdığın zarf tek bir operasyon taşır — \`invoke_host_function\` — ve çağrı onun içinde yolculuk eder: hangi kontrat, hangi fonksiyon, hangi argümanlar.

Aynı zarf, aynı imzalar, aynı ~5 saniyelik kapanış.`,
    },
    {
      kind: "theory",
      body: `## Üç depolama rafı

Soroban bir kontrata üç depolama katmanı verir — girdi başına seçilir, farklı fiyatlandırılır:

- **Temporary** — ucuz, kısa ömürlü, süresi dolunca sonsuza dek gider. Fiyat teklifleri, nonce'lar, zaman kutulu state.
- **Persistent** — gerçek arşiv: kullanıcı bakiyeleri, sahiplik kayıtları. Süresi dolduğunda *arşivleme* sayesinde hayatta kalır (sonraki adım).
- **Instance** — kontratın kendisine yapıştırılmış küçük state: admin adresi, yapılandırma, her çağrının ihtiyaç duyduğu metadata.

Yanlış rafı seçmek klasik bir çaylak vergisidir: instance şişkinliğini her bir çağrı sırtında taşır, temporary bakiyelerse kaybolup gider. Raf, tasarımın *bir parçasıdır*.`,
    },
    {
      kind: "diagram",
      body: "Üç raf, üç ömür:",
      caption: "State kiralanır, sahip olunmaz. Kimsenin dokunmadığı bir kontrat er geç kira ödemeyi bırakır ve verisi soğur.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "instance",
            label: "instance",
            note: "Kontratın kendi ayarları; kontratla birlikte yaşar, kontratla birlikte ölür.",
            tone: "gold",
          },
          {
            id: "persistent",
            label: "persistent",
            note: "Kullanıcı bakiyeleri ve hayatta kalması gereken her şey. Kirası aksarsa arşivlenir — kurtarılabilir, kaybolmaz.",
            tone: "accent",
          },
          {
            id: "temporary",
            label: "temporary",
            note: "Ucuz ve kısa ömürlü; kaybolmasına izin verilen şeyler için: nonce'lar, oturumlar, rate limit'ler.",
            tone: "teal",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Arayüz kontratla birlikte yolculuk eder

Derlenmiş bir Soroban kontratı gizemli bir blob değildir. Build, Wasm'ın kendisine bir **contract spec** gömer: her fonksiyon, argüman ve tip, makine tarafından okunabilir halde.

Araçlar doğrudan ondan içer — CLI, deploy edilmiş bir kontratın arayüzünü yazdırabilir ve istemciler zincir üstündeki Wasm'dan **tam tipli binding'leri otomatik üretir**. ABI JSON dosyası avı yok, kontrat ile dokümanları arasında sürüm kayması yok: ledger'ın kendisi *dokümantasyondur*.

Hiç görmediğin bir kontratı, tipleri derleme zamanında kontrol edilmiş halde çağır. Spec'in satın aldığı geliştirici deneyimi bu.`,
    },
    {
      kind: "quiz",
      question: `Bir kullanıcının oturum nonce'unu saklıyorsun; verildikten birkaç dakika sonra anlamsızlaşıyor. Hangi raf?`,
      options: [
        "Temporary — en ucuz kira ve onu unutmak tam olarak istediğin şey",
        "Persistent, böylece bir çağrı geç gelirse geri yüklenebilir",
        "Instance, böylece kontrat bir gün arşivlenirse kaybolur",
      ],
      answer: 0,
      explain: `Rafı verinin gerçek ömrüne eşlemek tasarım kararının tamamıdır ve insanlar bunu güvenli görünen yönde yanlış yapar: kısa ömürlü veriyi persistent rafa koymak, verinin hiç ihtiyaç duymadığı bir garanti için sonsuza dek daha fazlaya mal olur.`,
    },
    {
      kind: "fill",
      prompt: `Deploy edilmiş bir kontratın yanında ne taşıdığını tamamla:`,
      file: "NOTES.md",
      before: `Bir çağıranın bir kontratı çağırmak için senin dokümantasyonuna ihtiyacı yoktur, çünkü kontratın `,
      after: ` deploy edilmiş kodun kendisinden okunabilir.`,
      choices: ["arayüzü", "kaynak kodu", "yazarının adresi", "denetim raporu"],
      answer: 0,
      explain: `Kaynak ledger'da değil — derlenmiş Wasm orada — ve ne bir adres ne de bir denetim, bir araca hangi fonksiyonların var olduğunu ya da ne aldıklarını söyler. Kodla birlikte yolculuk eden arayüz, araçların kimsenin belgelemediği bir kontrata karşı çağrı kurabilmesinin nedenidir.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `Forge'da tam olarak bunun için canlı bir lab var: **OpenZeppelin Token Wizard**'ı aç, gerçek bir OZ token kontratı yapılandır ve onu Forge'un kendi Soroban runner'ıyla derle — spec'i, depolama rafları, hepsiyle. Runner Wasm'ını geri verdiğinde, her byte'ın altındaki teori bu bölüm.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `Kampanya'nın Perde VII'si borrow checker'ı bütün bunlar üzerinde çalıştırıyor — Rust'ı sen yazıyorsun, Wasm'ı sen derliyorsun ve \`invoke_host_function\`'ın *senin* kodunu ledger'a taşımasını izliyorsun. Tam dalış, ne zaman istersen orada.

Sonraki bölümde bir sürpriz: o kadar yetenekli kontratlar ki uygulama olmaktan çıkıp **hesabın kendisi** oluyorlar.`,
    },
    {
      kind: "theory",
      body: `## Burada hiçbir şey bedava değil

Artık bir Soroban kontratının ne olduğunu, verisinin nerede yaşadığını ve senin dokümantasyonun olmadan herkesin onu nasıl çağırdığını söyleyebiliyorsun.

Bunların hiçbirinin sana söylemediği şey, ekipleri geceleri uyandıran kısım: **state kiralanır, sahip olunmaz.** Her raftaki her girdinin bir saati var ve raflar tam olarak önemli olan tek bir noktada ayrışıyor — bir saat sıfıra ulaştığında ne olduğu.

Bunu yanlış yaparsan, hata bir bug gibi görünmez. Altı ay boyunca çalışmış, sonra bir salı günü verinin var olmadığını söylemeye başlamış bir kontrat gibi görünür.

**Sırada:** kalp atışı ve fatura.`,
    },
  ],
  testOut: [
    {
      question: `Ledger'da bir Soroban kontratı nedir?`,
      options: [
        "Ledger'da saklanan, adresi olan ve başka herhangi bir fiil gibi bir işlem operasyonuyla çağrılan derlenmiş Wasm",
        "Validator'ların çağrı anında kaynaktan yorumladığı bir betik",
        "Protokolün gerektiğinde dışarıdan çağırdığı zincir dışı bir servis",
      ],
      answer: 0,
    },
    {
      question: `Soroban neden tek bir depolama türü yerine üç ayrı tür sunar?`,
      options: [
        "Farklı verinin zaman içindeki değeri farklıdır ve raflar onu farklı fiyatlandırıp farklı sürelerde sona erdirir",
        "Her tür farklı bir veri boyutu için optimize edilmiştir",
        "Eski kontratlar bir türü, yenileri bir başkasını kullanır",
      ],
      answer: 0,
    },
    {
      question: `Arayüzün kontratla birlikte yolculuk etmesi ne demek?`,
      options: [
        "Kontratın spec'i deploy edilmiş kodun kendisinden okunabilir, böylece araçlar onu harici dokümantasyon olmadan çağırabilir",
        "Arayüz, SDF'nin tuttuğu halka açık bir dizine kaydedilir",
        "Çağıranlara kontratın yazarı tarafından bir istemci kütüphanesi verilmelidir",
      ],
      answer: 0,
    },
    {
      question: `Bir kontrat çağrısı nerede yolculuk eder?`,
      options: [
        "Zaten bildiğin aynı işlem zarfının içinde, bir invoke_host_function operasyonu olarak",
        "Kendi konsensüsü olan, yalnızca kontratlara ayrılmış ayrı bir kanalda",
        "Ledger'ı atlayarak, RPC üzerinden doğrudan bir validator'a",
      ],
      answer: 0,
    },
  ],
};
