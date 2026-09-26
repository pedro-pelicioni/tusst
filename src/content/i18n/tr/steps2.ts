import type { LessonStep } from "@/content/steps";

// Localized lesson steps — PART 2 (mastering-option, mastering-result, stellar-101).
// Same rules as steps1.ts.
export const steps2: Record<string, LessonStep[]> = {
  "mastering-option-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Çoğu diyarda "hiçlik" bir pusudur — gece yarısı seni çökerten bir null. Bataklık bunu farklı yapar: **yokluk, tipin bir parçasıdır**.

\`\`\`rust
enum Option<T> {
    Some(T),   // bir değer VAR, içine sarılmış
    None,      // hiçbir şey yok — dürüstçe ilan edilmiş
}
\`\`\`

Option'la İstifçi'nin rafında tanışmıştın. Şimdi ona hükmedeceksin.`,
    },
    {
      kind: "theory",
      body: `Cevabı olmayabilecek bir fonksiyon bunu imzasında söyler:

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

Dikkat: \`Some(7)\` / \`None\` sonunda noktalı virgül yok — \`if/else\` bir ifadedir (expression) ve sonucu döndürülür.`,
    },
    {
      kind: "quiz",
      question: "`find` neden düz `i32` yerine `Option<i32>` döndürüyor?",
      options: [
        "Dürüstlük — cevap olmayabilir ve tip bunu açıkça söylüyor",
        "Option, i32'den daha hızlıdır",
        "Rust'ta bütün fonksiyonlar Option döndürmek zorundadır",
      ],
      answer: 0,
      explain: "Tip, her çağıranı None durumunu ele almaya zorlar. Gece yarısı pusuları yok.",
    },
    {
      kind: "fill",
      prompt: "Bulunan değeri sar — 7 numaralı köylü mevcut.",
      file: "main.rs",
      before: "if present { ",
      after: "(7) } else { None }",
      choices: ["Some", "Ok", "Value"],
      answer: 0,
      explain: "Some varlığı sarar; None yokluğu ilan eder. (Ok, Result'a aittir — sonraki perde.)",
    },
    {
      kind: "editor",
      intro: `### Son sınav — Some mı, None mu?

\`find\`'ı tamamla: \`present\` true ise \`Some(7)\` döndür, değilse \`None\` — ve \`todo!()\`'yu kaldır.

Beklenen çıktı:

\`\`\`text
Some(7)
\`\`\``,
    },
  ],

  "mastering-option-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`.unwrap()\` değeri Option'un içinden söküp alır:

\`\`\`rust
let x = Some(5).unwrap();   // → 5. sorun yok.
let y = ghost.unwrap();     // ghost None → 💥 PANIC
\`\`\`

\`None\` üzerinde unwrap **panic** yapar — bütün program çöker.`,
    },
    {
      kind: "theory",
      body: `Hayatta kalanlar yanlarında bir **varsayılan** taşır:

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

Bu kalıbı zaten iki kez kullandın — İstifçi'nin rafında; ve Soroban kalesinde seni yine koruyacak. Bataklığın en işe yarar rünü bu.`,
    },
    {
      kind: "quiz",
      question: "`let ghost: Option<i32> = None;` — `ghost.unwrap()` ne yapar?",
      options: [
        "Panic — program çöker",
        "0 döndürür",
        "None döndürür",
      ],
      answer: 0,
      explain: "Kontrol etmediğin şeyi asla unwrap etme.",
    },
    {
      kind: "fill",
      prompt: "Güvenle çıkar: ghost None ise 0'a düş.",
      file: "main.rs",
      before: "let value = ghost.",
      after: "(0);",
      choices: ["unwrap_or", "unwrap", "or_else"],
      answer: 0,
      explain: "unwrap_or asla panic yapmaz — yokluk, senin varsayılanın olur.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — asla körlemesine unwrap etme

\`ghost\`, \`None\`. Değeri güvenle çıkar:

1. \`let value = ghost.unwrap_or(0);\` — hiçbir yerde \`.unwrap()\` yok.
2. \`value: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
value: 0
\`\`\``,
    },
  ],

  "mastering-option-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bir Option üzerinde tam bir \`match\` çalışır — ama sadece \`Some\` durumu umurundaysa bataklığın bir kestirmesi var:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);
}
\`\`\`

\`if let\` tek hamlede hem sorar hem unwrap eder: *desen uyuyorsa değere ad ver ve içeri gir.*`,
    },
    {
      kind: "theory",
      body: `Ve tıpkı sıradan bir \`if\` gibi \`else\` ile birleşir:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light, sarmalı çözülmüş i32
} else {
    println!("darkness");
}
\`\`\`

İlk dalın içinde \`light\` düz bir değerdir — Option yok, unwrap yok, tehlike yok.`,
    },
    {
      kind: "quiz",
      question: "`if let Some(light) = lantern { ... }` içinde, süslü parantezlerin arasındaki `light` nedir?",
      options: [
        "Sarmalı çözülmüş değer — düz bir i32",
        "Hâlâ bir Option<i32>",
        "Bir boolean",
      ],
      answer: 0,
      explain: "Desen Some'ı soyup attı — içeride değerin kendisini tutuyorsun.",
    },
    {
      kind: "fill",
      prompt: "Fenere sor: ışık varsa adıyla al.",
      file: "main.rs",
      before: "if let ",
      after: "(light) = lantern {\n    println!(\"light: {}\", light);\n}",
      choices: ["Some", "Option", "Has"],
      answer: 0,
      explain: "if let Some(light) — desen, sarılı değere ad verir.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — bataklığın kendisine sor

Fener \`Some(3)\` tutuyor:

1. \`if let Some(light) = lantern\` → \`light: {}\` yazdır
2. \`else\` → \`darkness\` yazdır

Beklenen çıktı:

\`\`\`text
light: 3
\`\`\``,
    },
  ],

  /* ───────────────────── Perde V · Result ───────────────────── */

  "mastering-result-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bataklık sana *yokluğu* öğretti. Yüce Divan ise **başarısızlığı** yargılar — ve başarısızlık her zaman nedenini söyler:

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // işe yaradı — işte değer
    Err(E),   // başarısız oldu — işte NEDENİ
}
\`\`\`

\`Option\` "hiçbir şey yok" derken, \`Result\` "işte ters giden şu" der.`,
    },
    {
      kind: "theory",
      body: `Başarısız olabilecek bir fonksiyon Result döndürür — ve hükmünü açıkça verir:

\`\`\`rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}
\`\`\`

Çökme yok, sessizce yanlış cevap yok — kayda geçen bir hüküm.`,
    },
    {
      kind: "quiz",
      question: "Bir fonksiyon ne zaman `Option` yerine `Result` döndürmeli?",
      options: [
        "Çağıranın NEDEN başarısız olduğunu bilmesi gerektiğinde",
        "Hiç başarısız olmadığında",
        "Result ve Option birbirinin yerine kullanılabilir",
      ],
      answer: 0,
      explain: "None sessizdir; Err nedenini taşır. Divanlar kayıt tutar.",
    },
    {
      kind: "fill",
      prompt: "Başarısızlığa hükmet: sıfıra bölme bir hatadır.",
      file: "main.rs",
      before: "if b == 0 {\n    ",
      after: "(String::from(\"division by zero\"))\n} else {\n    Ok(a / b)\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Err(neden) — nedeni iliştirilmiş başarısızlık.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — iki hüküm

\`divide\`'ı tamamla (ve \`todo!()\`'yu kaldır):

1. \`b == 0\` → \`Err(String::from("division by zero"))\`
2. Aksi halde → \`Ok(a / b)\`

Beklenen çıktı:

\`\`\`text
Ok(5)
\`\`\``,
    },
  ],

  "mastering-result-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Mühürlü bir hüküm gelir. Tahmin etmezsin — \`match\` yaparsın ve derleyici **iki** sonucun da ele alındığından emin olur:

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

Desenler eşleşirken sarmalı da çözer: \`v\` değer, \`e\` neden.`,
    },
    {
      kind: "theory",
      body: `Mahkeme salonunun kapısının üstünde: \`#[must_use]\`.

Anlamı şu: bir Result alıp görmezden gelirsen Rust **seni uyarır** — okunmamış bir hüküm, patlamayı bekleyen bir bug'dır. Her Result okunmalı, match edilmeli ya da bilerek yukarı aktarılmalı.`,
    },
    {
      kind: "quiz",
      question: "Result döndüren bir fonksiyonu çağırıp hükmü görmezden gelirsen derleyici ne yapar?",
      options: [
        "Seni uyarır — Result, #[must_use]'dur",
        "Hiçbir şey — görmezden gelmek serbest",
        "Her zaman derlemeyi reddeder",
      ],
      answer: 0,
      explain: "Kullanılmayan-Result uyarısı, Divan'ın düsturunun koda işlenmiş hâlidir.",
    },
    {
      kind: "fill",
      prompt: "Başarısızlık kolunu ele al — nedeni `e` olarak çöz.",
      file: "main.rs",
      before: "match verdict {\n    Ok(v) => println!(\"granted: {}\", v),\n    ",
      after: "(e) => println!(\"denied: {}\", e),\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Ok ve Err — iki kol da ele alınmalı, yoksa kod derlenmez.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — hükmü okumak

Divan sana \`Ok(42)\` veriyor. İki hükmü de match et:

1. \`Ok(v)\` → \`granted: {}\` yazdır
2. \`Err(e)\` → \`denied: {}\` yazdır

Beklenen çıktı:

\`\`\`text
granted: 42
\`\`\``,
    },
  ],

  "mastering-result-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Her Result'ı olduğu yerde match etmek, mantığını tören kalabalığına gömer. Bazı divanlar hüküm vermez — **davayı yukarı aktarır**.

Diyarın en küçük rünü:

\`\`\`rust
let n = parse("21")?;
\`\`\`

O \`?\` şu demek: *Ok ise sarmalı çöz ve devam et. Err ise hatayı çağırana döndür — hemen, şu anda.*`,
    },
    {
      kind: "theory",
      body: `Tek şart: \`?\` yalnızca **kendisi de Result döndüren** bir fonksiyonun içinde çalışır — hatanın gidecek bir yeri olmalı:

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // Err burada çıkardı, yukarıya
    Ok(n * 2)               // mutlu yol temiz kalır
}
\`\`\`

Gerçek Rust kodu böyle okunabilir kalır: hatalar yokuş yukarı akar, mantık düz kalır.`,
    },
    {
      kind: "theory",
      body: `Sana hazır verilen \`parse\` yardımcısında bir rün daha var:

\`\`\`rust
text.parse().map_err(|_| String::from("not a number"))
\`\`\`

\`|_| String::from("not a number")\` bir **closure** — küçük, isimsiz bir fonksiyon. \`_\` şu demek: "argümanı al, bana lazım değil"; gövde ise closure'ın geri verdiği şey. Henüz bir tane yazmana gerek yok — sadece şunu bil: \`map_err\` onu yalnızca çevrilecek bir \`Err\` olduğunda çağırır.`,
    },
    {
      kind: "quiz",
      question: "Result `Err` olduğunda `?` ne yapar?",
      options: [
        "Err'i mevcut fonksiyondan anında döndürür",
        "Panic yapar",
        "Onu None'a çevirir",
      ],
      answer: 0,
      explain: "Tek bir işaret — ve hüküm, seni kim çağırdıysa ona doğru yokuş yukarı akar.",
    },
    {
      kind: "fill",
      prompt: "Yukarı aktar: Ok ise çöz, Err ise yukarıya döndür.",
      file: "main.rs",
      before: "let n = parse(\"21\")",
      after: ";\nOk(n * 2)",
      choices: ["?", ".unwrap()", "!"],
      answer: 0,
      explain: "? yukarı aktarır; unwrap panic yapar. Divanda asla panik yapmazsın.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — aktarma işareti

\`double_first\`'ü tamamla (ve \`todo!()\`'yu kaldır):

1. \`let n = parse("21")?;\`
2. \`Ok(n * 2)\` döndür.

Beklenen çıktı:

\`\`\`text
Ok(42)
\`\`\``,
    },
  ],

  /* ───────────────── Perde VI · Stellar 101 (kavramsal) ───────────────── */

  "stellar-101-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Gökyüzüne hoş geldin, Forgeborn. **Stellar** herkese açık bir ledger'dır (defter) — tek bir gücün kontrol etmediği, ödemeleri ~5 saniyede sonuçlandıran ortak bir hesap defteri.

Üzerindeki her aktör bir **hesaptır** (bir yıldız kalesi) ve bir **anahtar çifti** tarafından kontrol edilir: birlikte doğmuş, zıt görevli iki anahtar.`,
    },
    {
      kind: "theory",
      body: `İki anahtar:

- **Public key** (açık anahtar) — \`G\` ile başlar. Adresin. Kulelerden haykır; başkaları seni böyle bulur ve sana böyle öder.
- **Secret key** (gizli anahtar) — \`S\` ile başlar. Yaptığın her şeyi imzalar. **Asla** paylaşma, asla yapıştırma, asla commit'leme. Kaybedersen → hesap sonsuza dek gitti. Gökyüzünde destek masası yok.

Ve ledger'da var olabilmek için bir hesap asgari bir **temel rezerv: 1 XLM** tutar.`,
    },
    {
      kind: "quiz",
      question: "Biri sana lumen göndermek için adresini istiyor. Hangi anahtarı verirsin?",
      options: [
        "G... public key'i — zaten onun için var",
        "S... secret key'i — hesabın sana ait olduğunu kanıtlar",
        "İkisini de, ne olur ne olmaz",
      ],
      answer: 0,
      explain: "G paylaşmak içindir. S imzalar — onu elinde tutan herkes hesabının SAHİBİDİR.",
    },
    {
      kind: "quiz",
      question: "Secret key'ini (S...) kaybettin. Şimdi ne olacak?",
      options: [
        "Hesap kurtarılamaz — artık hiçbir şey onun adına imza atamaz",
        "Stellar desteği sıfırlayabilir",
        "Public key onu yeniden üretebilir",
      ],
      answer: 0,
      explain: "Emanetçi yok, sıfırlama yok. Tohum (seed) sahipliğin TA KENDİSİDİR — canın pahasına koru.",
    },
    {
      kind: "fill",
      prompt: "Fermanı doldur: **public** key hangi mühürle başlar?",
      file: "star-chart.toml",
      before: "public_key_starts_with = \"",
      after: "\"",
      choices: ["G", "S", "X"],
      answer: 0,
      explain: "Paylaştığın adres için G; koruduğun tohum için S.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — yıldız kalesi fermanı

Fermanı tamamla: iki mühür ve bir hesabın var olmak için ihtiyaç duyduğu temel rezerv (XLM cinsinden).

Beklenen çıktı:

\`\`\`text
star-keep chartered ✓
\`\`\``,
    },
  ],

  "stellar-101-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Gökyüzünün yerel para birimi **lumen (XLM)**. En küçük kıvılcımı ise **stroop**:

\`\`\`text
1 XLM = 10.000.000 stroop
\`\`\`

On milyon. Ledger'daki bütün miktarlar aslında stroop cinsinden sayılır — ondalıklar insanlar için.`,
    },
    {
      kind: "theory",
      body: `Her işlem küçük bir geçiş ücreti öder — **temel ücret: 100 stroop** (0.00001 XLM).

Bu bir gelir değil. Anti-spam: gökyüzünü gürültüye boğmak isteyeni durduracak kadar pahalı, bir milyon gerçek ödemenin yaklaşık bir dolara mal olacağı kadar ucuz. Trafik yükseldiğinde ücretler kısa süreliğine artar — yer için bir açık artırma.`,
    },
    {
      kind: "quiz",
      question: "Stellar'da bir ödeme göndermek kabaca ne kadara mal olur?",
      options: [
        "100 stroop — bir sentin yüzde biri",
        "Ödeme başına 1 XLM",
        "Gönderilen miktarın bir yüzdesi",
      ],
      answer: 0,
      explain: "Sabit, minicik, anti-spam. Gönderdiğin miktar geçiş ücretini değiştirmez.",
    },
    {
      kind: "fill",
      prompt: "Bir lumen kaç stroop eder?",
      file: "star-chart.toml",
      before: "stroops_per_lumen = ",
      after: "",
      choices: ["10_000_000", "1_000", "100"],
      answer: 0,
      explain: "Lumen başına on milyon kıvılcım.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — kapının geçiş ücreti

Levhayı doldur: lumen başına stroop sayısı ve stroop cinsinden temel ücret.

Beklenen çıktı:

\`\`\`text
toll paid ✓
\`\`\``,
    },
  ],

  "stellar-101-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Gökyüzü lumenden fazlasını taşır. **Her hesap bir varlık (asset) ihraç edebilir** — dolar, altın, bilet, puan. Bir varlık, iki şeyin birleşimiyle tanımlanır:

- bir **asset code** (varlık kodu): \`USDC\`, \`EURC\`, ...
- ve **ihraççısı** (issuer): onu yaratan \`G...\` hesabı

Aynı kod, farklı ihraççı → tamamen farklı bir varlık. Kimlik, ihraççının TA KENDİSİDİR.`,
    },
    {
      kind: "theory",
      body: `Ama gökyüzünün rıza kuralı şu: hesabın, açıkça kabul etmediği bir varlığı tutamaz.

**Trustline** (güven hattı) işte o kabuldür — hesabından, tek bir ihraççının tek bir varlığına açtığın bir köprü:

\`\`\`text
trustline = "G...CENTRE tarafından ihraç edilen USDC'yi kabul ediyorum"
\`\`\`

Trustline yok, bakiye yok — o varlıkta sana yapılan bir ödeme \`op_no_trust\` ile başarısız olur. (Açık her trustline rezervini de biraz yükseltir.)`,
    },
    {
      kind: "quiz",
      question: "Biri sana USDC gönderiyor ama sen ona hiç trustline açmadın. Ne olur?",
      options: [
        "Ödeme başarısız olur — köprü yoksa yük de yok",
        "Onun yerine XLM olarak gelir",
        "Bekleyen bir kuyrukta bekler",
      ],
      answer: 0,
      explain: "Gökyüzü rızayı ciddiye alır: kabul etmediğin hiçbir şeyi tutmazsın.",
    },
    {
      kind: "quiz",
      question: "İki farklı ihraççıdan, ikisinin de adı USDC olan iki varlık. Bunlar aynı varlık mı?",
      options: [
        "Hayır — kod + ihraççı varlığı tanımlar; kimlik ihraççıdır",
        "Evet — önemli olan kod",
        "Sadece fiyatları aynıysa",
      ],
      answer: 0,
      explain: "Herkes bir varlığa USDC adını verebilir. Güvendiğin şey, onu KİMİN ihraç ettiğidir.",
    },
    {
      kind: "fill",
      prompt: "Bir varlığın ihraççısı her zaman... ne tür bir şeydir?",
      file: "star-chart.toml",
      before: "asset_issuer_starts_with = \"",
      after: "\"   # issuers are accounts",
      choices: ["G", "S", "USD"],
      answer: 0,
      explain: "İhraççılar hesaptır — public G... anahtarlarıyla tanımlanırlar.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — ışık köprüsünü aç

**USDC** için trustline'ı doldur: varlık kodu ve her ihraççı adresinin başladığı mühür.

Beklenen çıktı:

\`\`\`text
light-bridge opened ✓
\`\`\``,
    },
  ],

  "stellar-101-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Her şey burada birleşiyor. Bir **ödeme işlemi (payment operation)** tam olarak üç şey ister:

1. **destination** (hedef) — alıcı hesap (\`G...\`)
2. **asset** (varlık) — ne gönderdiğin (yerel lumen için \`XLM\`)
3. **amount** (miktar) — ne kadar

Secret key'inle imzalarsın, ~100 stroop'luk geçiş ücretini ödersin ve ~5 saniye içinde **kesinleşir**. Banka yok. İş günü yok. Sınır yok.`,
    },
    {
      kind: "theory",
      body: `Ödemenin tam yolculuğu:

\`\`\`text
işlemi kur
  → S... anahtarınla imzala
    → ağa gönder
      → doğrulayıcılar uzlaşır (~5 sn)
        → kesin. sonsuza dek. ledger'da.
\`\`\`

Bu Kapı'dan sonra: Soroban — ledger'ın *senin* Rust kodunu çalıştırdığı yer.`,
    },
    {
      kind: "quiz",
      question: "Bir ödeme işlemini göndermeye uygun kılan nedir?",
      options: [
        "Gönderenin secret key'iyle imzalanmış olması",
        "Hedefin onu önce onaylaması",
        "Bir bankanın 2 iş günü içinde takas etmesi",
      ],
      answer: 0,
      explain: "Yetki imzadadır — S... anahtarı bu yüzden kutsaldır.",
    },
    {
      kind: "fill",
      prompt: "Yükü haritala: yerel varlığın kodu.",
      file: "star-chart.toml",
      before: "asset = \"",
      after: "\"",
      choices: ["XLM", "USD", "STR"],
      answer: 0,
      explain: "XLM — lumen, gökyüzünün yerel varlığı.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — gökyüzündeki ilk ışık

Ödemeyi haritala: hedef mührü, yerel varlık kodu ve **25** gönder.

Beklenen çıktı:

\`\`\`text
lumens flowing ✓
\`\`\``,
    },
  ],
};
