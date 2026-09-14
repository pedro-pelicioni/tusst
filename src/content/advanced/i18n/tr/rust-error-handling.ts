import type { LessonStep } from "@/content/steps";

// TR · Errors That Survive Production.
//
// Overlay for ../../steps/rust-error-handling.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustErrorHandlingStepsTr: Record<string, LessonStep[]> = {
  "rust-error-handling-1": [
    {
      kind: "theory",
      body: `\`Result<T, E>\` sıradan bir enum. Dilin bunun için yerleşik hiçbir şeyi yok — tek bir operatör dışında.

\`\`\`rust
enum Result<T, E> { Ok(T), Err(E) }
\`\`\`

\`?\` işte o operatör. Bir \`Result\`'a uygulandığında \`Ok\`'u unwrap eder (paketinden çıkarır) ve \`Err\` durumunda **erken döner**:

\`\`\`rust
let n: i64 = raw.trim().parse()?;
\`\`\`

bu, tam olarak şuna eşdeğer:

\`\`\`rust
let n: i64 = match raw.trim().parse() {
    Ok(v) => v,
    Err(e) => return Err(From::from(e)),
};
\`\`\``,
    },
    {
      kind: "theory",
      body: `Bu desugaring'deki (açılımdaki) iki ayrıntı hakkını fazlasıyla veriyor.

**\`From::from(e)\`.** \`?\` hatayı çıkış yolunda dönüştürür. \`Result<T, MyError>\` döndüren bir fonksiyonun bir \`ParseIntError\` üzerinde \`?\` kullanabilmesi bu yüzden — yeter ki \`MyError: From<ParseIntError>\` mevcut olsun. Rust'ta ergonomik hata yönetiminin arkasındaki mekanizmanın tamamı bu, ve bir sonrakinden sonraki dersin konusu.

**Erken dönüş.** \`?\` yalnızca \`Result\` (ya da \`Option\`, ya da başka bir \`Try\` tipi) döndüren bir fonksiyonda görünebilir. Panic atan bir unwrap değil — bir kontrol akışı operatörü; başarısızlık, biri onu ele alana kadar yukarı doğru yolculuğuna devam eder.`,
    },
    {
      kind: "quiz",
      question:
        "`?`, `.unwrap()`'ın yapmadığı neyi yapar?",
      options: [
        "Hatayı `From` ile dönüştürüp kapsayan fonksiyondan döndürür — ne olacağına çağıran karar verir",
        "Vazgeçmeden önce işlemi bir kez daha dener",
        "Hatayı loglar ve varsayılan bir değerle devam eder",
      ],
      answer: 0,
      explain:
        "`unwrap` süreci bitirir. `?` kararı bir frame yukarı taşır; bir kütüphanenin başkasının servisinin içinde kullanılabilir kalmasını sağlayan tek şey de budur.",
    },
    {
      kind: "fill",
      prompt:
        "Parse hatasını panic atmak yerine çağırana ilet.",
      file: "main.rs",
      before: "let n: i64 = raw.trim().parse()",
      after: ";",
      choices: ["?", ".unwrap()", ".expect(\"bad\")"],
      answer: 0,
      explain:
        "Üçü de derlenir. Çağırana seçim hakkı bırakan yalnızca `?` — ve bir request handler'da diğer ikisi, bozuk bir girdiyi çökmüş bir task'a çevirir.",
    },
    {
      kind: "quiz",
      question:
        "`?`, dönüş tipi olmayan bir `fn main()` içinde neden derlenmez?",
      options: [
        "`?` bir `Err` ile erken döner ve `()` döndüren bir fonksiyonun onu döndürecek bir şeyi yoktur",
        "`main` özel bir durumdur ve hata iletimine asla izin vermez",
        "`?` açık bir `use std::ops::Try` import'u gerektirir",
      ],
      answer: 0,
      explain:
        "Çözüm main'e bir dönüş tipi vermek: `fn main() -> Result<(), Box<dyn Error>>`. Rust o zaman hatanın `Debug` çıktısını basar ve sıfır olmayan bir kodla çıkar.",
    },
    {
      kind: "editor",
      intro: `### İlet, panic atma

Girdiyi trim'leyen, \`?\` ile \`i64\` olarak parse eden ve değerin iki katını döndüren \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` yaz.

\`main\` içinde onu iki kez çağır — \`" 21 "\` ile ve \`"x"\` ile — ve her sonucu \`match\` ile ayrıştırıp \`ok: <v>\` ya da \`err: <e>\` bas.

Beklenen çıktı:

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

İkinci satır \`ParseIntError\`'ün kendi \`Display\` metni.`,
    },
  ],

  "rust-error-handling-2": [
    {
      kind: "theory",
      body: `\`Result<T, String>\`, hata yönetiminin ölmeye gittiği yer. Bir \`String\` üzerinde match yapılamaz, yapılandırılmış alan taşıyamaz ve her çağıranı ne yapacağına karar vermek için İngilizce parse etmeye zorlar.

Onun yerine başarısızlığı bir enum olarak modelle — gerçekten ters gidebilecek her şey için bir varyant:

\`\`\`rust
#[derive(Debug)]
enum TxError {
    Empty,
    TooLarge { limit: u32, got: u32 },
}
\`\`\`

Artık çağıran varyant üzerinde \`match\` yapabilir ve \`TooLarge\`, bir log satırının ya da bir HTTP hata gövdesinin gerçekten ihtiyaç duyduğu sayıları taşır.`,
    },
    {
      kind: "theory",
      body: `Bunu karşılığını veren iki alışkanlık var.

**Veriyi varyantın içine koy.** \`TooLarge { limit, got }\` hiçbir şeye mal olmaz ve operatörün ilk sorusunu yanıtlar. Tek başına \`TooLarge\`, limiti bulmak için gidip kodu okumaya zorlar.

**Enum'u kapalı ve küçük tut.** Başarısız olabilecek her kod satırı için değil, *çağıranın farklı karar verebileceği her durum* için bir varyant. Hepsi "istek bozuktu" anlamına gelen on varyant, tek bir \`Malformed { field: String }\`'den daha kötü bir API'dir.

Gerçek bir crate'te \`Display\` ve \`Error\`'ı elle yazmak yerine \`thiserror\` ile derive ederdin. O makro, sonraki iki dersin elle yazdığının birebir aynısını üretir — bir kez elle yapmaya değer, böylece makronun ne yaptığını bilirsin.`,
    },
    {
      kind: "quiz",
      question:
        "`Result<T, String>` bir kütüphanenin public hata tipi için neden kötü bir seçim?",
      options: [
        "Çağıranlar üzerinde match yapamaz; belirli bir hatadan toparlanmak İngilizce düzyazıyı string eşleştirmek demektir",
        "`String` hataları allocate eder, bu da herhangi bir production servisi için fazla yavaştır",
        "`String`, `std::error::Error`'ı implement etmez, dolayısıyla `?` hiç kullanılamaz",
      ],
      answer: 0,
      explain:
        "Allocation gerçek ama nadiren belirleyici — bir hata yolu genelde sıcak değildir. Asıl acıtan, hata üzerinde *dallanma* yeteneğini kaybetmektir.",
    },
    {
      kind: "fill",
      prompt:
        "Varyanta, operatörün ayrı bir arama yapmadan ihtiyaç duyacağı sayıları ver.",
      file: "main.rs",
      before: "enum TxError {\n    Empty,\n    TooLarge ",
      after: ",\n}",
      choices: ["{ limit: u32, got: u32 }", "(String)", ""],
      answer: 0,
      explain:
        "Bir varyanttaki isimli alanlar, oluşturulduğu yerde tuple varyanttan daha iyi okunur: `TooLarge { limit: 100, got: size }` yorum gerektirmez.",
    },
    {
      kind: "quiz",
      question:
        "Bir istek doğrulama hata enum'unun kaç varyantı olmalı?",
      options: [
        "Çağıranın farklı karar verebileceği her durum için bir tane — hata verebilecek her satır için değil",
        "Modüldeki her `?` çağrısı için bir tane, böylece her hata izlenebilir olur",
        "Tam olarak bir tane, bir mesaj alanı taşıyan",
      ],
      answer: 0,
      explain:
        "Enum bir API'dir. Şekli, çağıranların neyi ayırt etmesi gerektiğini izlemeli; yalnızca insanlar için olan ayrıntı ise alanlara aittir.",
    },
    {
      kind: "editor",
      intro: `### Başarısızlığı modelle, string'e çevirme

1. \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\` tanımla.
2. \`fn validate(size: u32) -> Result<u32, TxError>\` yaz: \`0\` → \`Empty\`, \`100\` üstü her şey → limiti \`100\` olan \`TooLarge\`, geri kalan her şey → \`Ok(size)\`.
3. \`validate(50)\`, \`validate(0)\` ve \`validate(150)\` sonuçlarının \`{:?}\` çıktısını bas.

Beklenen çıktı:

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\``,
    },
  ],

  "rust-error-handling-3": [
    {
      kind: "theory",
      body: `\`?\`, hata fonksiyondan çıkarken üzerinde \`From::from\` çağırır. \`From\`'u bir kez implement et; modüldeki her \`?\` bedavaya dönüştürsün:

\`\`\`rust
impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadNumber(e)
    }
}
\`\`\`

\`parse\` bir \`ParseIntError\` döndürüp fonksiyon \`ConfigError\` döndürse de artık şu derlenir:

\`\`\`rust
fn read_port(raw: &str) -> Result<u16, ConfigError> {
    let port: u16 = raw.parse()?;    // çıkış yolunda dönüştürülür
    Ok(port)
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`Into\`'yu asla elle implement etme. \`std\`'de bir blanket impl (kapsayıcı implementasyon) var: \`impl<T, U: From<T>> Into<U> for T\`. Yani \`From\`'u implement etmek sana \`Into\`'yu otomatik verir — tersi geçerli değildir.

Bir \`Result\` zincirinin ortasındaki bir \`Option\` için köprüyü açıkça kur:

\`\`\`rust
let raw = raw.ok_or(ConfigError::Missing)?;
\`\`\`

\`ok_or\`, \`None\`'ı \`Err(...)\`'e çevirir; \`ok_or_else\` bir closure alır ve hatayı oluşturmak bedava değilse kullanılacak olan odur. Ayna görüntüsü \`.ok()\` ise bir \`Result\`'ın hatasını atıp sana bir \`Option\` verir — pratik, ama şüpheyle yaklaşmaya değer, çünkü nedeni çöpe atar.`,
    },
    {
      kind: "quiz",
      question:
        "`From<ParseIntError> for ConfigError` implement ettin. Başka ne elde edersin?",
      options: [
        "std'deki blanket impl sayesinde `Into<ConfigError> for ParseIntError` — ve her çağrı noktasında `?` dönüşümü",
        "Başka hiçbir şey; `Into` ayrıca implement edilmelidir",
        "Otomatik olarak ters yönde `TryFrom`",
      ],
      answer: 0,
      explain:
        "Tavsiyenin her zaman 'From implement et, asla Into' olması bu yüzden. `Into`'yu doğrudan implement etmek sana `From` kazandırmaz ve `?`, `From` arar.",
    },
    {
      kind: "fill",
      prompt:
        "Eksik değeri kendi hatana çevir ki `?` onu ileri taşıyabilsin.",
      file: "main.rs",
      before: "let raw = raw.",
      after: "(ConfigError::Missing)?;",
      choices: ["ok_or", "unwrap_or", "expect"],
      answer: 0,
      explain:
        "`ok_or`, `Option<T>`'yi `Result<T, E>`'ye eşler. `unwrap_or` yerine bir varsayılan koyar ve değerin eksik olduğu gerçeğini gizlerdi.",
    },
    {
      kind: "quiz",
      question:
        "Ne zaman `ok_or` yerine `ok_or_else`'e uzanmalısın?",
      options: [
        "Hata değerini oluşturmak bedava değilken — `ok_or` argümanını `Some` yolunda bile hevesle (eagerly) değerlendirir",
        "`Option`, `Some`'dan daha sık `None` olduğunda",
        "Hata tipi `Clone` implement etmediğinde",
      ],
      answer: 0,
      explain:
        "`unwrap_or` ile `unwrap_or_else` arasındaki kuralın aynısı. Argüman düz bir unit varyantsa `ok_or` yeterlidir ve daha iyi okunur; allocate ediyor ya da format'lıyorsa closure'ı seç.",
    },
    {
      kind: "editor",
      intro: `### Dönüşümü ? yapsın

1. \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\` tanımla.
2. \`BadNumber\` üreten \`From<ParseIntError> for ConfigError\` implement et.
3. \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\` yaz: \`Missing\` durumu için \`ok_or\`, ardından \`parse()?\` — hiçbir yerde açık dönüşüm olmadan.
4. Üç çağrının \`{:?}\` çıktısını bas: \`Some("8080")\`, \`None\`, \`Some("no")\`.

Beklenen çıktı:

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\``,
    },
  ],

  "rust-error-handling-4": [
    {
      kind: "theory",
      body: `Bir hata, iki farklı okuyucuya iki farklı mesaj borçludur.

**\`Debug\`** — senin için, bir logda ya da bir test hatasında. Derive et. Alan adları dahil yapıyı gösterir ve asla bir kullanıcıya gösterilmez.

**\`Display\`** — bir insan için, bir log satırında ya da bir API yanıtında. Elle yaz. Tek cümle, küçük harf, sonda nokta yok, "Error:" öneki yok (bağlamı çağıran ekler).

\`\`\`rust
impl fmt::Display for TimeoutError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "request timed out after {}ms", self.ms)
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`impl std::error::Error for TimeoutError {}\` — çoğu zaman boş bir blok — tipi, tesadüfen yazdırılabilen bir struct değil, bir *hata* yapan şeydir.

\`Debug + Display\` gerektirir ve karşılığında ekosistemin kilidini açar: tipin \`Box<dyn Error>\` olarak box'lanabilir, \`fn main()\`'den döndürülebilir, \`anyhow\` tarafından taşınabilir ve \`source()\` ile zincirlenebilir.

\`\`\`rust
let boxed: Box<dyn Error> = Box::new(TimeoutError { ms: 250 });
println!("{boxed}");        // senin Display'ini kullanır
\`\`\`

\`Box<dyn Error>\`, artık varyant üzerinde match yapmayı düşünmediğin bir uygulamanın en üst katmanı için doğru hata tipidir. Bir **kütüphane** ise somut enum'unu korumalı ki çağıranları hâlâ match yapabilsin.`,
    },
    {
      kind: "quiz",
      question:
        "`std::error::Error` neden hem `Debug` hem `Display` gerektirir?",
      options: [
        "Farklı okuyuculara hizmet ederler: `Debug` geliştirici için yapıyı gösterir, `Display` bir log ya da kullanıcı için tek cümle yazar",
        "`Debug` başarı yolunda, `Display` hata yolunda kullanılır",
        "Tarihsel bir kalıntı; bugün tek başına `Display` yeterli olurdu",
      ],
      answer: 0,
      explain:
        "Pratik bir sonucu da var: `fn main() -> Result<(), E>`, `Display`'i değil `Debug`'ı basar — yalnızca güzel bir `Display` yazmış olanları şaşırtır.",
    },
    {
      kind: "fill",
      prompt:
        "Tipi, varsayılan metotları devralarak bir hata olarak ilan et.",
      file: "main.rs",
      before: "impl Error for TimeoutError ",
      after: "",
      choices: ["{}", "{ fn description(&self) -> &str { \"\" } }", ";"],
      answer: 0,
      explain:
        "`Error` üzerindeki her metodun bir varsayılanı var, dolayısıyla boş bir blok eksiksizdir. `description` deprecated — yerini `Display` aldı.",
    },
    {
      kind: "quiz",
      question:
        "`Box<dyn Error>` ne zaman doğru hata tipidir, ne zaman yanlış?",
      options: [
        "Kimsenin üzerinde match yapmadığı bir uygulamanın en üst katmanında doğru; çağıranlarının hâlâ hataları ayırt etmesi gereken bir kütüphane için yanlış",
        "Her yerde doğru — somut bir enum'dan kesinlikle daha esnek",
        "Her yerde yanlış: her hata yolunda allocate eder",
      ],
      answer: 0,
      explain:
        "Bu, `anyhow` ile `thiserror` arasındaki ayrımın aynısı. Tipi silmek, yalnızca kendi adına harcayabileceğin bir kolaylıktır; asla çağıranların adına değil.",
    },
    {
      kind: "editor",
      intro: `### Bir hatanın borçlu olduğu iki mesaj

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`.
2. \`request timed out after <ms>ms\` basan \`fmt::Display\` implement et.
3. Boş blokla \`std::error::Error\` implement et.
4. \`main\` içinde bir örneği \`{}\` ve \`{:?}\` ile bas, ardından ikinci bir tanesini (\`ms: 250\`) \`Box<dyn Error>\` olarak box'la ve bas.

Beklenen çıktı:

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\``,
    },
  ],

  "rust-error-handling-5": [
    {
      kind: "theory",
      body: `Tek satırlık bir hata çoğu zaman tek başına işe yaramaz. *"could not load config"*, bir operatöre zaten bilmediği hiçbir şey söylemez.

\`Error::source\`, nedeni iliştirmenin standart yolu:

\`\`\`rust
impl Error for LoadFailed {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        Some(&self.cause)
    }
}
\`\`\`

Her katman *ne yapmaya çalıştığını* ekler ve alttaki katmanı olduğu gibi korur. Zinciri yürümek o zaman niyetten syscall'a kadar hikâyenin tamamını üretir.`,
    },
    {
      kind: "theory",
      body: `Zinciri yürümek düz bir döngü:

\`\`\`rust
let mut cause = err.source();
while let Some(e) = cause {
    println!("  caused by: {e}");
    cause = e.source();
}
\`\`\`

Bunu yapmaya değer kılan kural: **her katmanın \`Display\`'i kendi niyetini anlatır, asla alttaki katmanı değil.** \`LoadFailed\` "could not load config: permission denied" basarsa zincir artık "permission denied"ı iki kez söyler ve tekrar her seviyede büyür.

\`anyhow\`'un \`.context("could not load config")\`'u otomatik olarak işte bunu kurar; iyi bir Rust log satırının bir soruşturmayı başlatmak yerine bitirebilmesinin nedeni de bu.`,
    },
    {
      kind: "quiz",
      question:
        "Sarmalayan bir hatanın `Display`'i neden kaynağının (source) mesajını içermemeli?",
      options: [
        "Zincir katman katman basılır, dolayısıyla onu gömmek aynı metni her seviyede tekrar eder",
        "`Display`'in başka `Display` impl'lerini çağırmasına izin verilmez",
        "`Display` çalıştığında kaynak henüz var olmayabilir",
      ],
      answer: 0,
      explain:
        "Nedenini inline eden her katman, N seviyeli bir zinciri O(N²) metne çevirir. Her katman kendi niyetini söyler; gerisini zincir sağlar.",
    },
    {
      kind: "fill",
      prompt: "Zincirin yürünebilmesi için altta yatan hatayı açığa çıkar.",
      file: "main.rs",
      before: "impl Error for LoadFailed {\n    fn ",
      after: "(&self) -> Option<&(dyn Error + 'static)> {\n        Some(&self.cause)\n    }\n}",
      choices: ["source", "cause", "inner"],
      answer: 0,
      explain:
        "`cause` eski isimdi ve deprecated. `source`, tüm ekosistemin yürüdüğü isim.",
    },
    {
      kind: "quiz",
      question:
        "Bir operatör başka hiçbir ayrıntı olmadan `could not load config` görüyor. Büyük ihtimalle eksik olan ne?",
      options: [
        "Sarmalayan hata `source()` implement etmiyor, dolayısıyla zincir ilk katmanda bitiyor",
        "Hata `{:?}` yerine `{}` ile loglanmış",
        "Log seviyesi iç içe hataları gösteremeyecek kadar düşük",
      ],
      answer: 0,
      explain:
        "`source()`'un `None` döndüren bir varsayılanı var, dolayısıyla onu unutmak sessizce başarısız olur — zincir yalnızca durur ve hiçbir şey seni uyarmaz.",
    },
    {
      kind: "editor",
      intro: `### Nedeni iliştirilmiş tut

1. \`io failure: <text>\` basan bir \`Display\`'i ve boş bir \`Error\` impl'i olan \`#[derive(Debug)] struct Io(String)\`.
2. Tam olarak \`could not load config\` basan — nedenden hiç söz etmeyen — bir \`Display\`'i olan \`#[derive(Debug)] struct LoadFailed { cause: Io }\`.
3. \`LoadFailed\` için, \`Some(&self.cause)\` döndüren \`source()\` ile \`Error\` implement et.
4. \`main\` içinde nedeni \`permission denied\` olan bir tane oluştur, bas, ardından zinciri yürüyüp her seviye için \`"  caused by: <e>"\` bas.

Beklenen çıktı:

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\``,
    },
  ],

  "rust-error-handling-6": [
    {
      kind: "theory",
      body: `Çizgi "panic'ler kötüdür" değil. Soru, durumun *kimin* hatasını temsil ettiği.

**Koşul (condition)**, dış dünyanın yapmaya hakkı olan bir şeydir: bozuk girdi, eksik bir dosya, bir timeout, kapanmış bir bağlantı. Bir bug değildir. Bir \`Result\` alır.

**Bug**, kendi kodunun korumak zorunda olduğu ama ihlal edilmiş bir invariant'tır (değişmez): fonksiyonun kendi hesapladığı bir index'in aralık dışına çıkması, bir durum makinesinin ulaşılamaz bir kola varması. Onu geçip devam etmek, yanlış olduğunu zaten kanıtladığın veri üzerinde hesap yapmak demektir. O bir \`panic!\` alır.`,
    },
    {
      kind: "theory",
      body: `Bir request handler'da bu ayrım bir erişilebilirlik (availability) özelliğine dönüşür.

Kullanıcı girdisi üzerindeki bir \`unwrap()\`, bozuk bir isteği panic'e çevirir. Runtime'a bağlı olarak bu ya tek bir task'ı unwind eder — ve işe yarar hiçbir log olmadan çıplak bir 500 döndürür — ya da süreci abort edip uçuştaki her isteği de beraberinde götürür. Her iki durumda da bunu bulan bir saldırganın elinde bir denial-of-service (hizmet engelleme) vardır.

Pratik kurallar:

- Girdiden türetilmiş herhangi bir şey üzerinde \`unwrap\`/\`expect\`: bir handler'da **asla**.
- Başlangıçta, alternatifin yanlış yapılandırılmış halde çalışmak olduğu yerde \`expect("...")\`: **sorun yok**, hatta kimsenin okumadığı bir \`Result\`'tan iyidir.
- Neyin ihlal edildiğini adlandıran bir mesajla, bir invariant için \`assert!\`: **iyi**, üstelik varsayımı belgeler.
- Testlerde: \`unwrap\` gönül rahatlığıyla. Başarısız bir test *gürültülü olmalı*.`,
    },
    {
      kind: "quiz",
      question:
        "Bir handler `let id = params.get(\"id\").unwrap();` yapıyor. Gerçek risk ne?",
      options: [
        "`id` içermeyen her istek task'ı panic'e sokar — herkesin bilerek tetikleyebileceği bir denial-of-service",
        "Unwind pahalı olduğu için yanıt daha yavaş olur",
        "Client uslu durduğu sürece hiçbiri",
      ],
      answer: 0,
      explain:
        "Eksik girdi bir koşuldur, bug değil. Üçüncü yanıt, bunu production'a gönderen akıl yürütmenin ta kendisi: client, sistemin tam olarak kontrol etmediğin parçasıdır.",
    },
    {
      kind: "fill",
      prompt:
        "Meşru olarak aralık dışında olabilecek bir index'i panic atmadan oku.",
      file: "main.rs",
      before: "data.",
      after: "(i).copied()",
      choices: ["get", "index", "iter().nth"],
      answer: 0,
      explain:
        "`get`, `Option<&T>` döndürür; `.copied()`, `Option<&i64>`'ü `Option<i64>`'e çevirir. `data[i]` panic atar; bu yalnızca aralık dışında olmanın bir bug olacağı durumda doğrudur.",
    },
    {
      kind: "quiz",
      question:
        "`expect(\"DATABASE_URL must be set\")` nerede savunulabilir bir seçimdir?",
      options: [
        "Başlangıçta — alternatif yanlış yapılandırılmış halde çalışan bir süreçtir ve mesaj tam olarak neyin eksik olduğunu söyler",
        "Hiçbir yerde; `expect`, fazladan adımlarla `unwrap`'tır",
        "Bir request handler'da, mesaj açıklayıcı olduğu sürece",
      ],
      answer: 0,
      explain:
        "Boot'ta hızlı başarısız olmak bir özelliktir: süreç load balancer'a hiç ulaşmaz. Aynı çağrı bir handler'ın içinde istek başına bir çöküştür.",
    },
    {
      kind: "editor",
      intro: `### Koşul mu bug mı

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — var olmayabilecek bir değer bir **koşuldur**. \`.get(i).copied()\` kullan.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — aralığı çağıran garanti eder, dolayısıyla bir ihlal **bug**'dır. Index'i ve uzunluğu adlandıran bir mesajla \`assert!\`, ardından doğrudan index'le.
3. \`main\` içinde, \`vec![10, 20, 30]\` ile: \`checked_index\`'i \`1\`'de ve \`9\`'da \`{:?}\` ile bas, ardından \`invariant_index\`'i \`2\`'de.

Beklenen çıktı:

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\``,
    },
  ],
};
