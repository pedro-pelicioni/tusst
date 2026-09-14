import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "OpenZeppelin Token Wizard",
    tagline: "Extension'ları seç, gerçek Rust döv, kendi token'ını deploy et.",
  },
  steps: {
    "intro": {
      body: `## Tek başına dövme

Gerçek demirciler her kılıç için kendi demirini eritmez. Stellar'da token kontratları **OpenZeppelin'in denetlenmiş yapı taşlarından** dövülür — zincirler arasında milyarları koruyan, savaş görmüş aynı kütüphaneler, Soroban'a \`stellar-tokens\` olarak taşındı.

Önümüzdeki birkaç dakikada **extension'larını seçeceksin**, Forge'un onlardan **gerçek Rust** kurduğunu izleyeceksin, onu sandbox'lanmış bir runner'da **derleyeceksin**, kendi imzanla **Wasm'ı testnet'e deploy edeceksin** ve ilk arzını **mint edeceksin**.

Mockup yok. Serbest mod IDE'nin kullandığı pipeline'ın aynısı.`,
    },
    "sigil": {
      title: "Mührünü çağır",
      body: `Deploy etmek bir imzaya mal olur, imza için de anahtar çiftin gerekir. Cüzdan lab'ında bir tane dövdüysen Forge onu çağırır; dövmediysen şimdi yeni bir tane basılır.`,
      cta: "Anahtar çiftini çağır",
      successBody: `Mührün yanıt veriyor:

\`{address}\`

Bundan sonraki her işlem — deploy, mint — bu imzayı taşıyacak.`,
    },
    "fund": {
      title: "Hesabı körükle",
      body: `Deploy'lar ve çağrılar küçük kaynak ücretleri öder, bu yüzden hesabın canlı ve fonlu olması gerekir. Friendbot doldurur — zaten fonluysa sadece başını sallar.`,
      cta: "Körükle (Friendbot)",
      successBody: `Hesap nefes alıyor — {balance} XLM hazırda. Bin deploy'a yetecek yakıt.`,
    },
    "name": {
      prompt: `## Yarattığına bir ad ver

Token'ın **adı** insanlara dönük bir metadata'dır ve construction sırasında zincire yazılır — cüzdanlar ve explorer'lar onu gösterir.`,
      placeholder: "Forge Gold",
      hint: "2–24 karakter",
    },
    "symbol": {
      prompt: `## Bir sembol ver

Kısa ticker — bakiyelerde ve işlem çiftlerinde görünen şey.`,
      placeholder: "FGOLD",
      hint: "2–12 harf/rakam, harfle başlar",
    },
    "supply": {
      prompt: `## Başlangıç arzını belirle

Construction sırasında tam token cinsinden **sana** mint edilir. Token'ın **7 ondalık** kullanır — Stellar geleneği — yani kontrat perde arkasında senin sayın × 10⁷ değerini saklar.`,
      placeholder: "1000",
      hint: "1 ile 999.999.999 arası tam token",
    },
    "ext-pausable": {
      prompt: `## Extension: Pausable?

**Pausable** bir token'ın acil freni vardır: sahibi, bir olay araştırılırken transferleri ve mint'leri dondurup sonra yeniden açabilir. Regüle ihraççılar bunu neredeyse her zaman ister; bir meme coin frensiz saflığı tercih edebilir.`,
      options: [
        {
          label: "Evet — acil freni ekle",
          value: "yes",
          blurb: "Sahibi her transferi, mint'i ve burn'ü durdurabilir/yeniden açabilir.",
        },
        {
          label: "Hayır — tasarım gereği durdurulamaz",
          value: "no",
          blurb: "Pause anahtarı yok. Kimse donduramaz, sen dahil.",
        },
      ],
    },
    "ext-burnable": {
      prompt: `## Extension: Burnable?

**Burnable** bir token, sahiplerinin kendi birimlerini yok ederek toplam arzı küçültmesine izin verir — geri alım akışları ("kuponu yak, malı al") ve deflasyonist tasarımlar için kullanışlı.`,
      options: [
        {
          label: "Evet — sahipler yakabilir",
          value: "yes",
          blurb: "OpenZeppelin'in burnable extension'ından burn ve burn_from ekler.",
        },
        {
          label: "Hayır — arz yalnızca büyür",
          value: "no",
          blurb: "Hiçbir burn entrypoint'i derlemeye dahil edilmez.",
        },
      ],
    },
    "quiz-oz": {
      question: `Wizard neden sıfırdan taze Rust yazmak yerine token'ını OpenZeppelin'in bloklarından kuruyor?`,
      options: [
        "Her token'ın paylaştığı parçalar için denetlenmiş, geniş çapta incelenmiş, standart arayüzlü kod yeni yazılmış koddan iyidir",
        "Rust'ta sıfırdan token yazmak imkânsızdır",
        "OpenZeppelin kontratları Stellar ağının kabul ettiği tek koddur",
      ],
      explain: `Ağ geçerli her Wasm'ı çalıştırır — ama token mantığı, tam da ince bir bug'ın gerçek paraya mal olduğu ve standartların (SEP-41) token'ını her cüzdan ve DEX için okunur kıldığı yerdir. Yenilik ürünün için; token tesisatın için değil.`,
    },
    "build": {
      title: "Rust'ı döv ve derle",
      body: `Forge şimdi seçimlerinden **{name} ({symbol})** token'ını kuruyor — IDE'nin kullandığı aynı denetlenmiş sürümlere sabitlenmiş gerçek \`stellar-tokens\` Rust'ı — ve onu sandbox'lanmış bir runner'da **WebAssembly**'ye derliyor. Gerçek bir derleme bir iki dakika sürer; çalışmasını izle.`,
      cta: "Wasm'a derle",
      successBody: `Runner kontratını bir **Wasm blob** olarak döndürür — eritilip ledger'ın sanal makinesi için yeniden dökülmüş Rust.

Olmayan şeye dikkat: adın, sembolün ve arzın koda gömülmedi. Sonraki adımda **constructor argümanı** olarak yolculuk edecekler; böylece aynı doğrulanmış Wasm bin farklı token doğurabilir.`,
    },
    "deploy": {
      title: "Testnet'e deploy et",
      body: `İkisi de senin imzaladığın iki işlem: önce Wasm ledger'a **yüklenir**, sonra ondan bir **kontrat instance'ı** yaratılır — ve \`__constructor\` adın, sembolün ve arzınla bir kez çalışıp her şeyi adresine mint eder.`,
      cta: "Deploy et ve constructor'ı çalıştır",
      successBody: `**{symbol} yaşıyor.** Kontrat adresi:

\`{contract}\`

Bu adres artık soran her cüzdan, explorer ya da kontrat için SEP-41 çağrılarına — \`balance\`, \`transfer\`, \`name\` — yanıt veriyor. Forge IDE'nin **Interact** panelinde de az önce belirdi: aynı Forge, aynı deploy'lar.`,
    },
    "mint": {
      title: "Bonus tur mint et",
      body: `Constructor'ın başlangıç arzını sana zaten mint etti. Şimdi yaşayan kontratı doğrudan çağır: Forge **spec'ini zincirden** çeker, bir \`mint\` çağrısı kurar, onu **simüle eder** ve gerçeğini sana imzalatır — her Soroban dApp'inin kullandığı simüle-et-sonra-imzala akışının aynısı.`,
      cta: "25 {symbol} daha mint et",
      successBody: `Mint edildi — bakiyende 25 {symbol} daha; yetkilendirildi, çünkü kontrat \`owner.require_auth()\` kontrolünü yaptı ve **sahibi sensin**.

\`mint\` çağıran başka herkes aynı satırda reddedilir. Zincir üstü erişim kontrolü bu; senin seçtiğin kod tarafından uygulanıyor.`,
    },
    "quiz-sep41": {
      question: `Token'ın SEP-41 uyguluyor. Bu ona ne kazandırır?`,
      options: [
        "Standart arayüzü konuşan her cüzdan, DEX ve kontrat onu tutabilir, gösterebilir ve taşıyabilir — özel entegrasyon gerekmez",
        "Her borsada otomatik listeleme",
        "Bug bağışıklığı — standart denetlenmiş, dolayısıyla implementasyonlar da",
      ],
      explain: `Standart ortak bir dildir; pazarlama anlaşması ya da güvenlik garantisi değil. SEP-41, token'ının ekosistemin zaten yapmayı bildiği çağrılara yanıt vermesi demek — wizard'ın entrypoint icat etmek yerine standardın üstüne inşa etmesinin sebebi de bu.`,
    },
    "claim": {
      body: `Ledger Wasm'ını, kontratını ve mührüne mint edilmiş bir bakiyeyi tutuyor. Forge ödeme yapmadan önce zincirin kendisine soracak — **kontratında \`balance(you)\` simüle ederek**. Vaat değil, kanıt.`,
    },
  },
} satisfies LabTextOverlay;
