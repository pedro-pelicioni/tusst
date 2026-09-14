// TR · editor instructions — Traits, Generics & Dispatch.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-traits-generics.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustTraitsGenericsInstructionsTr: Record<string, { instructions: string }> = {
  "rust-traits-generics-1": {
    instructions: `## Bir zorunlu metot, bir default

Bir trait, zorunlu metotları cinsinden yazılmış default metot gövdeleri sağlayabilir. Implement eden tipler onları bedavaya alır ve override edebilir.

\`\`\`rust
trait Health {
    fn name(&self) -> String;
    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

### Görevin

1. \`Health\`'i yukarıdaki gibi tanımla.
2. \`Db\` ve \`Rpc\` unit struct'larını tanımla.
3. \`Db\` yalnızca \`name\`'i implement eder ve \`db\` döndürür.
4. \`Rpc\` \`name\`'i implement eder (\`rpc\` döndürür) **ve** \`status\`'u override edip \`"<name>: degraded"\` döndürür.
5. İki status'u da yazdır.

Beklenen çıktı:

\`\`\`text
db: ok
rpc: degraded
\`\`\`

### İpuçları

- Unit struct \`struct Db;\` diye yazılır ve \`Db\` değeri olarak kullanılır.
- \`format!\`, \`println!\`'in bir satır kurduğu gibi bir \`String\` kurar.
`,
  },

  "rust-traits-generics-2": {
    instructions: `## Tam olarak kullandığını bound'la

Bir bound iki yönlü bir sözleşmedir: çağıran onu sağlayan bir tip vermek zorunda, karşılığında gövde ona güvenebilir.

Gövdenin ihtiyaç duyduğu **minimumu** bound'la. Hiç clone yapmayan bir fonksiyondaki gereksiz \`T: Clone\` güvenlik eklemez — gayet iyi bir \`Clone\`-olmayan tipe sahip çağıranları reddeder.

### Görevin

\`where T: Display\` cümlesiyle \`fn describe_all<T>(items: &[T]) -> String\` yaz; her elemanı \`", "\` ile birleştirsin.

\`&[1, 2, 3]\` ile ve \`&["a", "b"]\` ile çağır.

Beklenen çıktı:

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

### İpuçları

- \`use std::fmt::Display;\`
- Sonucu \`join\` ile değil \`push_str\` ile kur — amaç bound'un kullanıldığını görmek.
- \`.iter().enumerate()\` sana index'i verir, böylece ilk elemanda ayracı atlayabilirsin.
`,
  },

  "rust-traits-generics-3": {
    instructions: `## Tip başına tek cevap

Bir **associated type** bir kez, belirli bir tipin tek impl'inde seçilir. Bir **generic parametre** tip başına birçok impl'e izin verir.

Test şu: *implement eden tip başına tam olarak tek bir makul cevap var mı?* \`Iterator::Item\` associated'dır, çünkü bir sayaç tek çeşit şey üretir. \`From<T>\` generic'tir, çünkü bir tip birçok tipten dönüştürülebilmeli.

### Görevin

1. \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`
2. \`Source\`'u \`type Item = u32;\` ve \`fn next_item(&mut self) -> Option<u32>\` ile implement eden \`struct Counter { n: u32 }\` — çözümlenmiş tip, \`Option<Self::Item>\` değil — \`1\`, \`2\`, \`3\`, sonra \`None\` üretsin.
3. Kaynağın ürettiği her şeyi toplayan \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\`.
4. Boşaltılan vektörü \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
items: [1, 2, 3]
\`\`\`

### İpuçları

- \`while let Some(item) = s.next_item()\` onu temizce boşaltır.
- \`Vec<S::Item>\`'a dikkat — somut \`S\` üzerinden projekte edilen associated type.
`,
  },

  "rust-traits-generics-4": {
    instructions: `## Üç çağrı noktası, üç fonksiyon

Derleyici bir generic'i **monomorphize** eder: çağrıldığı her somut tip için bir özelleşmiş kopya basar. Her kopya kendi tipini bilir, dolayısıyla içindeki her çağrı doğrudan ve inline edilebilirdir — "sıfır maliyet" burada bunu ifade eder.

Maliyetler binary boyutuna ve derleme süresine taşınır.

### Görevin

\`"<label>: <value:?>"\` yazdıran \`fn emit<T: Debug>(label: &str, value: T)\` yaz.

\`42u32\` ile, \`"rpc"\` ile ve \`vec![true, false]\` ile çağır — üç instantiation.

Beklenen çıktı:

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

\`rpc\`'nin etrafındaki tırnaklara dikkat: bu \`Debug\` formatlaması, \`Display\` değil, ve mesele tam da bu fark.

### İpuçları

- \`use std::fmt::Debug;\`
- Formatlayıcı \`{:?}\`.
`,
  },

  "rust-traits-generics-5": {
    instructions: `## Heterojen bir registry

Bir \`Vec<T>\` tek tip tutar. Birkaç tip gerektiğinde bir trait object'e ihtiyacın var:

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\`'in derleme zamanında boyutu yoktur, bu yüzden her zaman bir pointer'ın arkasında yaşar — ve o pointer **fat**'tir: bir word veriye, bir word vtable'a.

### Görevin

1. \`trait Check { fn run(&self) -> String; }\`
2. Onu implement eden, \`ping ok\` ve \`disk ok\` döndüren \`Ping\` ve \`Disk\` unit struct'ları.
3. Her birinden bir tane tutan bir \`Vec<Box<dyn Check>>\` kur, üzerinde dolaşıp her sonucu yazdır, sonra sayıyı yazdır.

Beklenen çıktı:

\`\`\`text
ping ok
disk ok
count: 2
\`\`\`

### İpuçları

- \`for c in &checks\` ile dolaş ki vektör \`.len()\`'den önce tüketilmesin.
`,
  },

  "rust-traits-generics-6": {
    instructions: `## Trait'i object olarak kullanılabilir tut

Bir trait yalnızca her metodu bir vtable üzerinden dispatch edilebiliyorsa **object safe**'tir. Gerçek hataların neredeyse tamamına iki kural sebep olur:

1. **Generic metot yok** — vtable sabit bir tablodur ve bir generic sınırsız sayıda slot isterdi.
2. **Dönüş pozisyonunda \`Self\` yok** — çağıran o tipin boyutunu bilemez.

İkisinin de düzeltmesi deliği derleme zamanından runtime'a taşımaktır: generic yerine \`&dyn Trait\` al.

### Görevin

1. \`trait Encode { fn encode(&self) -> String; }\`
2. Onu sayının ondalık metni olarak implement eden \`struct Num(i64)\`.
3. \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — onu object safe tutan \`&dyn\`.
4. \`Sink\`'i implement eden, \`"log:<encoded>"\` döndüren \`Log\` unit struct'ı.
5. Onu \`Box<dyn Sink>\` olarak sakla ve bir \`Num(42)\` kabul ettir.

Beklenen çıktı:

\`\`\`text
log:42
\`\`\`

\`accept\` generic olsaydı 5. adım derlenmezdi.
`,
  },

  "rust-traits-generics-7": {
    instructions: `## Tek impl, her Display tipi

Bir **blanket impl**, bir bound'u sağlayan her tipi tek seferde kapsar:

\`\`\`rust
impl<T: Display> Loggable for T { ... }
\`\`\`

Standart kütüphane buna yaslanır: \`ToString\`, \`Display\` üzerinde bir blanket impl'dir; \`Into<U>\` da \`From<T>\` üzerinde — \`From\` implement edip \`Into\`'yu bedavaya almanın sebebi bu.

**Orphan rule** sınırdır: bir trait'i bir tip için yalnızca trait sana aitse ya da tip sana aitse implement edebilirsin. Çözüm, runtime'da hiçbir maliyeti olmayan bir newtype'tır.

### Görevin

1. \`trait Loggable { fn log_line(&self) -> String; }\`
2. \`"[log] <value>"\` döndüren bir blanket \`impl<T: Display> Loggable for T\`.
3. \`42\` ve \`"rpc down"\` üzerinde \`.log_line()\` çağır — iki tip, sıfır ekstra impl.

Beklenen çıktı:

\`\`\`text
[log] 42
[log] rpc down
\`\`\`
`,
  },
};
