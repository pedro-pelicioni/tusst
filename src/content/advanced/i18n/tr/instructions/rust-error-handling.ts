// TR · editor instructions — Errors That Survive Production.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-error-handling.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustErrorHandlingInstructionsTr: Record<string, { instructions: string }> = {
  "rust-error-handling-1": {
    instructions: `## İlet, panic atma

\`?\`, \`Ok\`'u unwrap eder (paketinden çıkarır) ve \`Err\` durumunda erken döner; çıkış yolunda hatayı \`From\` ile dönüştürür. Bir unwrap değil, bir kontrol akışı operatörüdür — başarısızlık, biri onu ele alana kadar yolculuğuna devam eder.

### Görevin

Girdiyi trim'leyen, **\`?\` ile** \`i64\` olarak parse eden ve değerin iki katını döndüren \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` yaz.

\`main\` içinde onu \`" 21 "\` ile ve \`"x"\` ile çağır; her sonucu \`match\` ile ayrıştırıp \`ok: <v>\` ya da \`err: <e>\` bas.

Beklenen çıktı:

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

İkinci satır \`ParseIntError\`'ün kendi \`Display\` metni — onu sen yazmıyorsun.

### İpuçları

- \`raw.trim().parse()\`, hedef tipini binding'in tip açıklamasından çıkarır.
- \`Ok(n * 2)\` başarı yolu.
`,
  },

  "rust-error-handling-2": {
    instructions: `## Başarısızlığı modelle, string'e çevirme

\`Result<T, String>\` üzerinde match yapılamaz ve yapılandırılmış veri taşımaz. Başarısızlığı bir enum olarak modelle — gerçekten ters gidebilecek her şey için bir varyant, operatörün ihtiyaç duyacağı veri de zaten varyantın içinde.

### Görevin

1. \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`
2. \`fn validate(size: u32) -> Result<u32, TxError>\`: \`0\` → \`Empty\`; \`100\` üstü → limiti \`100\` olan \`TooLarge\`; aksi halde \`Ok(size)\`.
3. \`validate(50)\`, \`validate(0)\`, \`validate(150)\` sonuçlarının \`{:?}\` çıktısını bas.

Beklenen çıktı:

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\`

### İpuçları

- Her başarısız durum için erken \`return Err(...)\`, ardından kuyrukta \`Ok(size)\`.
`,
  },

  "rust-error-handling-3": {
    instructions: `## Dönüşümü ? yapsın

\`?\`, hata fonksiyondan çıkarken üzerinde \`From::from\` çağırır. \`From\`'u bir kez implement et; modüldeki her \`?\` bedavaya dönüştürsün.

\`Into\`'yu asla elle implement etme — std'deki blanket impl (kapsayıcı implementasyon) onu sana \`From\`'dan verir ve \`?\`, \`From\` arar.

### Görevin

1. \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`
2. \`BadNumber\` üreten \`impl From<ParseIntError> for ConfigError\`.
3. \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\`: \`Missing\` durumu için \`ok_or\`, ardından \`parse()?\` — hiçbir yerde **açık dönüşüm olmadan**.
4. \`read_port(Some("8080"))\`, \`read_port(None)\`, \`read_port(Some("no"))\` sonuçlarının \`{:?}\` çıktısını bas.

Beklenen çıktı:

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\`

### İpuçları

- \`use std::num::ParseIntError;\`
- \`raw.ok_or(ConfigError::Missing)?\`, \`Option\`'ı \`Result\`'a çevirir ve unwrap eder.
`,
  },

  "rust-error-handling-4": {
    instructions: `## Bir hatanın borçlu olduğu iki mesaj

**\`Debug\`** bir geliştirici içindir, bir logda ya da bir test hatasında — derive et.
**\`Display\`** bir insan içindir: tek cümle, küçük harf, sonda nokta yok — elle yaz.

\`impl std::error::Error\` (çoğu zaman boş bir blok), tipi bir *hata* yapan şeydir: \`Box<dyn Error>\`'ın, silinmiş tiplere \`?\` ile geçişin ve \`source()\` zincirlemesinin kilidini açar.

### Görevin

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`
2. \`request timed out after <ms>ms\` basan \`impl fmt::Display\`.
3. \`impl Error for TimeoutError {}\` — boş.
4. \`main\` içinde: bir örneği (\`ms: 5000\`) \`{}\` ve \`{:?}\` ile bas, ardından ikincisini (\`ms: 250\`) \`Box<dyn Error>\` olarak box'la ve bas.

Beklenen çıktı:

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\`

### İpuçları

- \`use std::error::Error;\` ve \`use std::fmt;\`
- İmza \`fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result\`.
`,
  },

  "rust-error-handling-5": {
    instructions: `## Nedeni iliştirilmiş tut

\`Error::source\` nedeni iliştirir. Her katman **kendi niyetini** söyler ve alttaki katmanı olduğu gibi korur — nedeni asla kendi \`Display\`'ine gömmez; yoksa N seviyeli bir zincir aynı metni N kez basar.

### Görevin

1. \`#[derive(Debug)] struct Io(String)\` — \`Display\`, \`io failure: <text>\` basar; \`Error\` impl'i boş.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` — \`Display\` tam olarak \`could not load config\` basar, nedenden hiç söz etmez.
3. \`Some(&self.cause)\` döndüren \`source()\` ile \`impl Error for LoadFailed\`.
4. \`main\` içinde: nedeni \`permission denied\` olan bir tane oluştur, bas, ardından zinciri yürüyüp her seviyede \`"  caused by: <e>"\` bas.

Beklenen çıktı:

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\`

### İpuçları

- Zinciri yürümek: \`let mut cause = err.source(); while let Some(e) = cause { ...; cause = e.source(); }\`
- \`source\`'un dönüş tipi \`Option<&(dyn Error + 'static)>\`.
`,
  },

  "rust-error-handling-6": {
    instructions: `## Koşul mu bug mı

**Koşul (condition)**, dış dünyanın yapmaya hakkı olan bir şeydir — bozuk girdi, bir timeout, kapanmış bir bağlantı. Bug değildir. Bir \`Result\` ya da bir \`Option\` alır.

**Bug**, kendi kodunun korumak zorunda olduğu ama ihlal edilmiş bir invariant'tır (değişmez). Onu geçip devam etmek, yanlış olduğunu zaten kanıtladığın veri üzerinde hesap yapmak demektir. Bir \`panic!\` ya da bir \`assert!\` alır.

Bir handler'da girdi üzerindeki bir \`unwrap\`, herkesin bilerek tetikleyebileceği bir denial-of-service'tir (hizmet engelleme).

### Görevin

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — bir koşul. \`.get(i).copied()\` kullan.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — aralığı çağıran garanti eder, dolayısıyla bir ihlal bug'dır. Index'i ve uzunluğu adlandıran bir mesajla \`assert!\`, ardından doğrudan index'le.
3. \`main\` içinde, \`vec![10, 20, 30]\` ile: \`checked_index\`'i \`1\`'de ve \`9\`'da \`{:?}\` ile bas, ardından \`invariant_index\`'i \`2\`'de.

Beklenen çıktı:

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\`

### İpuçları

- \`.get()\`, \`Option<&i64>\` verir; \`.copied()\` onu \`Option<i64>\` yapar.
- \`assert!(cond, "…{}…", value)\` format argümanları alır.
`,
  },
};
