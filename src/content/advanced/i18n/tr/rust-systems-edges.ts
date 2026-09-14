import type { LessonStep } from "@/content/steps";

// TR · Macros, Unsafe, FFI & Money.
//
// Overlay for ../../steps/rust-systems-edges.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustSystemsEdgesStepsTr: Record<string, LessonStep[]> = {
  "rust-systems-edges-1": [
    {
      kind: "theory",
      body: `Rust'ta her şey **varsayılan olarak private**'tır ve bir invariant'ı (değişmez kural) yalnızca belgelenmiş bir şey olmaktan çıkarıp zorunlu kılan da module ağacıdır.

\`\`\`rust
mod ledger {
    pub struct Balance { stroops: i64 }   // tip public, alan private
}
\`\`\`

\`ledger\`'ın dışında kimse bir \`Balance\`'ı literal ile kuramaz, \`stroops\`'u doğrudan okuyamaz ya da değiştiremez. İçeri girmenin tek yolu dışa açtığın constructor'dır — böylece "bir bakiye asla negatif olmaz" bir yorum olmaktan çıkar, tipin bir özelliği hâline gelir.`,
    },
    {
      kind: "theory",
      body: `Dört görünürlük seviyesi, tercih etmen gereken sırayla:

| yazılan | kime görünür |
| --- | --- |
| *(hiçbir şey)* | bu module ve altındakiler |
| \`pub(crate)\` | bu crate içinde her yer |
| \`pub(super)\` | üst module |
| \`pub\` | herkes, diğer crate'ler dâhil |

\`pub(crate)\` insanların en az kullandığı seviye. Birkaç module'ün paylaştığı ama public API'nde asla görünmemesi gereken bir helper için doğru seviye tam olarak budur — ve \`pub\`'ın aksine, sonradan değiştirmek kullanıcıların için breaking change sayılmaz.

Yerleşim kuralı: \`mod\` bildirir, \`use\` içe aktarır, \`super::\` bir üste çıkar, \`crate::\` kökten başlar. Çoğunlukla \`pub mod\` ve \`pub use\` satırlarından oluşan bir \`lib.rs\`, okunabilir tek bir dosyada public API'nin tamamıdır — zaten olması gereken de tam olarak bu.`,
    },
    {
      kind: "quiz",
      question:
        "`pub struct Balance { stroops: i64 }` — module dışındaki kod bununla ne yapabilir?",
      options: [
        "Yalnızca module'ün public fonksiyonlarının izin verdiğini — alan private, dolayısıyla ne literal ile kurma var ne de doğrudan okuma",
        "Her şeyi; struct'taki `pub` alanlarını da public yapar",
        "Hiçbir şey; tip kendi module'ü dışında kullanılamaz",
      ],
      answer: 0,
      explain:
        "Alan gizliliği alan başınadır ve varsayılanı private'tır. Rust'taki her 'parse et, doğrulama' tipinin arkasındaki mekanizma budur — constructor tek kapıdır.",
    },
    {
      kind: "fill",
      prompt:
        "Bir helper'ı public API'ye eklemeden tüm crate'e aç.",
      file: "main.rs",
      before: "    ",
      after: " fn raw(&self) -> i64 {",
      choices: ["pub(crate)", "pub", "pub(super)"],
      answer: 0,
      explain:
        "`pub(crate)` onu yayımlanan yüzeyin dışında tutar, böylece breaking bir sürüm çıkarmadan değişebilir. `pub(super)` yalnızca üst module'e ulaşırdı.",
    },
    {
      kind: "quiz",
      question:
        "Bir helper'ı `pub(crate)` yerine `pub` yapmak neden stil meselesinin ötesinde önemli?",
      options: [
        "`pub` semver sözleşmenin parçasıdır — sonradan kaldırmak ya da değiştirmek breaking bir sürüm demektir",
        "`pub` öğeler ayrı derlenir ve build'i yavaşlatır",
        "`pub` module sınırları arasında inlining'i kapatır",
      ],
      answer: 0,
      explain:
        "Her `pub` öğe yabancılara verilmiş bir sözdür. Derlenen en dar görünürlük, fikrini değiştirme özgürlüğünü sana bırakan görünürlüktür.",
    },
    {
      kind: "editor",
      intro: `### Invariant'ı kırılmaz yap

1. İçinde \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` olan bir \`mod ledger\` — **alan private kalır**.
2. \`impl Balance\` içinde: negatif değer için \`None\` döndüren \`pub fn new(stroops: i64) -> Option<Balance>\`, \`pub fn stroops(&self) -> i64\` ve \`pub(crate) fn raw(&self) -> i64\`.
3. \`main\`'de \`use ledger::Balance;\` yaz; \`new(250)\`'yi stroops'una map'leyip yazdır, \`new(-1)\`'i aynı şekilde, geçerli bir bakiye üzerinde de \`raw()\`'u.

Beklenen çıktı:

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

\`main\`'den negatif bir \`Balance\` kurmanın hiçbir yolu yok. Mesele de zaten bu.`,
    },
  ],

  "rust-systems-edges-2": [
    {
      kind: "theory",
      body: `\`macro_rules!\` **syntax** eşler ve tip denetiminden önce daha fazla syntax'a genişler. Bir fonksiyonun yapamadığını yapar:

- değişken sayıda argüman alır
- aynı konumda farklı tiplerde argümanlar kabul eder
- bir ifadenin *kaynak metnini* yakalar (\`assert_eq!\` iki tarafı da böyle yazdırır)

\`\`\`rust
macro_rules! metric {
    ($name:expr, $value:expr) => { format!("{}={}", $name, $value) };
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `İşin çoğunu iki mekanizma yapar.

**Fragment specifier'lar** her yakalamanın hangi tür syntax'ı kabul ettiğini söyler: \`expr\`, \`ident\`, \`ty\`, \`literal\`, \`block\`, \`pat\`, \`tt\`. En darını kullanmak daha iyi hatalar verir — \`$n:ident\`, tam bir ifadeyi genişlemenin derinliklerinde değil, macro'nun çağrıldığı yerde reddeder.

**Tekrar.** \`$( ... ),+\` virgülle ayrılmış bir ya da daha fazla grubu eşler ve gövdedeki aynı \`$( ... )+\` her eşleşme için bir kopya üretir:

\`\`\`rust
($name:expr, $value:expr, $($k:expr => $v:expr),+) => {{
    let mut out = format!("{}={}", $name, $value);
    $( out.push_str(&format!(",{}={}", $k, $v)); )+
    out
}};
\`\`\`

Çift süslü parantezlere dikkat: \`{{ ... }}\` genişlemeyi bir block ifadesi yapar, böylece statement'lar barındırıp yine de bir değere çözümlenebilir.

Disiplin şu: **önce fonksiyona uzan.** Bir macro daha zor okunur, daha zor debug edilir ve \`rust-analyzer\`'ın go-to-definition'ı için görünmezdir. İhtiyacın olan şey gerçekten fonksiyon olamıyorsa kullan — variadic argümanlar ya da kaynak metni yakalamak.`,
    },
    {
      kind: "quiz",
      question: "Bir `macro_rules!` macro'su, bir fonksiyonun yapamadığı neyi yapabilir?",
      options: [
        "Değişken sayıda argüman alabilir, tek konumda tipleri karıştırabilir ve bir ifadenin kaynak metnini yakalayabilir",
        "Compile time'da genişletildiği için daha hızlı çalışır",
        "Başka module'lerdeki tiplerin private alanlarına erişebilir",
      ],
      answer: 0,
      explain:
        "Hız bir gerekçe değil: macro, optimizer'ın tıpkı inline edilmiş bir fonksiyon gibi gördüğü koda genişler. Variadic'ler ve kaynak yakalama gerçek — ve tek — motivasyondur.",
    },
    {
      kind: "fill",
      prompt: "Virgülle ayrılmış bir ya da daha fazla anahtar/değer çiftini eşle.",
      file: "main.rs",
      before: "($name:expr, $value:expr, $($k:expr => $v:expr)",
      after: ") => {{",
      choices: [",+", "*", ";?"],
      answer: 0,
      explain:
        "`,+` 'bir ya da daha fazla, virgülle ayrılmış' demektir. `,*` sıfıra izin verirdi; bu da burada üstteki iki argümanlı kuralla çakışır.",
    },
    {
      kind: "quiz",
      question: "Macro genişleme gövdesinde `{{ ... }}` neden kullanılır?",
      options: [
        "İçteki parantezler genişlemeyi bir block ifadesi yapar; böylece statement'lar barındırıp yine de bir değere çözümlenir",
        "Parantezleri escape eder, böylece çıktıda olduğu gibi görünürler",
        "Tekrar içeren her macro için zorunlu syntax'tır",
      ],
      answer: 0,
      explain:
        "Dıştaki çift genişlemeyi sınırlar; içteki çift gerçek bir Rust block'udur. O olmadan çok statement'lı bir genişleme, değer beklenen yerde kullanılamaz.",
    },
    {
      kind: "editor",
      intro: `### Bir fonksiyonun yerini tutamayacağı bir macro

İki kurallı \`macro_rules! metric\` yaz:

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → aynısı, ardından her çift için sona eklenen \`",<k>=<v>"\`.

Sonra iki kez çağır: \`("requests", 42)\` ile ve \`("latency", 95, "method" => "getEvents", "code" => 200)\` ile.

Beklenen çıktı:

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

İki farklı arity, ikincisi de variadic — bunun fonksiyon olamamasının sebebi tam olarak bu.`,
    },
  ],

  "rust-systems-edges-3": [
    {
      kind: "theory",
      body: `\`#[derive(...)]\` bir **procedural macro**'dur: tipinin token stream'ini alır ve onunla birlikte derlenen üretilmiş kod döndürür.

\`#[derive(Debug)]\` her alanı adıyla yazdıran bir \`Debug\` impl'i yazar. \`#[derive(Clone)]\` her alanı clone'layan bir \`clone\` yazar. \`#[derive(PartialEq)]\` her alanı karşılaştırır. \`#[derive(Default)]\` her alanı **kendi** default'uyla doldurur — \`0\`, \`false\`, \`String::new()\`.

Derleyicide özel muamele gören hiçbir şey yok. Çıktı sıradan Rust'tır ve \`cargo expand\` onu sana gösterir.`,
    },
    {
      kind: "theory",
      body: `Akılda tutmaya değer iki sonuç.

**Bir derive yalnızca girdilerinin izin verdiğini yapabilir.** \`Clone\` olmayan bir alanı olan struct üzerinde \`#[derive(Clone)]\` başarısız olur — ve hata derive'ı işaret eder; o mesajlar ilk birkaç seferinde bu yüzden tuhaf okunur.

**Attribute'lar üretilen kodu yapılandırır.** \`#[serde(rename = "type")]\`, \`#[serde(default)]\`, \`#[serde(skip)]\` Serde'nin derive'ı impl'i üretirken okunur. Derleyici özelliği değildirler; bir macro'ya verilen argümanlardır.

Terminoloji otursun diye procedural macro'nun üç türü: **derive** (\`#[derive(Serialize)]\`), **attribute** (\`#[tokio::main]\`, \`fn main\`'ini bir runtime başlatan hâle yeniden yazar) ve **function-like** (\`sqlx::query!\`, SQL'ini denetlemek için compile time'da veritabanına uzanır). Üçü de derleme sırasında çalışan sıradan Rust crate'leridir.`,
    },
    {
      kind: "quiz",
      question: "`#[tokio::main]` gerçekte ne yapar?",
      options: [
        "`async fn main`'ini bir runtime kurup `block_on` çağıran sync bir `main`'e yeniden yazan bir attribute macro'sudur",
        "Fonksiyonu işaretler, derleyici de Tokio runtime'ını link'ler",
        "Async desteğini açan bir derleyici builtin'idir",
      ],
      answer: 0,
      explain:
        "`cargo expand` yeniden yazımı bütünüyle gösterir — ve senin yazacağın `Runtime::new().block_on(...)` ile aynıdır. Bunu bilmek 'cannot start a runtime from within a runtime' panic'ini apaçık kılar.",
    },
    {
      kind: "fill",
      prompt:
        "Struct'a değer eşitliği karşılaştırması ve sıfırlanmış bir constructor kazandır.",
      file: "main.rs",
      before: "#[derive(Debug, Clone, ",
      after: ")]\nstruct Config {",
      choices: ["PartialEq, Default", "Eq, New", "Copy, Default"],
      answer: 0,
      explain:
        "`Copy` burada başarısız olurdu: struct bir `String` tutuyor; o da bir heap allocation'ının sahibi, dolayısıyla `Copy` olamaz.",
    },
    {
      kind: "quiz",
      question:
        "Bir struct üzerindeki `#[derive(Clone)]` derlenmiyor. Sebep neredeyse her zaman nedir?",
      options: [
        "Alanlardan biri kendisi `Clone` değil ve derive yalnızca girdilerinin desteklediğini üretebilir",
        "Struct'ta `Clone`'un gerektirdiği `#[derive(Copy)]` eksik",
        "Struct'ın bir lifetime parametresi var, derive'lar bunu desteklemez",
      ],
      answer: 0,
      explain:
        "Bağımlılık ters yönde işler — `Copy`, `Clone` gerektirir; asla tersi değil. Derive'lar lifetime'larla da gayet iyi başa çıkar.",
    },
    {
      kind: "editor",
      intro: `### Bir derive'ın ne ürettiğini gör

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`.
2. endpoint \`https://rpc\`, retries \`3\`, verbose \`false\` ile bir tane kur ve \`clone()\`'la.
3. Orijinali \`{:?}\` ile, ikisinin eşit olup olmadığını ve \`Config::default()\`'u \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Dört impl, hiçbirini sen yazmadın — ve her biri kendin yazabileceğin sıradan Rust.`,
    },
  ],

  "rust-systems-edges-4": [
    {
      kind: "theory",
      body: `\`unsafe\` borrow checker'ı kapatmaz. Tam olarak beş yeteneğin kilidini açar:

1. bir raw pointer'ı (ham işaretçi) dereference etmek
2. bir \`unsafe\` fonksiyon çağırmak
3. bir \`static mut\`'a erişmek
4. bir \`unsafe\` trait implement etmek
5. bir union alanına erişmek

Geri kalan her şey — ownership, borrowing, lifetime'lar, tip denetimi — \`unsafe\` bir block'un içinde de dışındakiyle birebir aynı şekilde geçerlidir.`,
    },
    {
      kind: "theory",
      body: `\`unsafe\`'in gerçek anlamı şudur: **"derleyicinin denetleyemediği bir invariant'ı ben garanti ediyorum."** Yani sınanan beceri — bir sistem reviewer'ının gerçekten para aldığı şey — o invariant'ı kesin bir dille ifade etmektir.

Gelenek, her \`unsafe\` block'un üstüne iddianın *neden* geçerli olduğunu söyleyen bir \`// SAFETY:\` yorumu koymaktır:

\`\`\`rust
// SAFETY: mid <= len, dolayısıyla iki aralık da aynı allocation içinde ve
// örtüşmüyorlar — yani iki &mut slice asla alias olmaz.
unsafe {
    (from_raw_parts_mut(ptr, mid), from_raw_parts_mut(ptr.add(mid), len - mid))
}
\`\`\`

Bundan iki kural çıkar. **Block'u olabildiğince küçük tut** — bütün bir fonksiyon gövdesi değil, tek bir işlem; böylece okuyan, iddiayı hangi satırın taşıdığını tam olarak bilir. Ve **içinde \`unsafe\` olan safe bir fonksiyon, invariant'ın olası her girdi için geçerli olduğuna söz verir**; bir çağıran onu sıradan safe kodla kırabiliyorsa fonksiyonun kendisi \`unsafe\` olarak işaretlenmelidir.

Standart kütüphanenin \`split_at_mut\`'ı tam olarak bu programdır: borrow checker'ın ifade edemediği, yazarının kaleme aldığı bir gerekçeyle safe kılınmış bir API.`,
    },
    {
      kind: "quiz",
      question: "Bir `unsafe` block gerçekte neyi değiştirir?",
      options: [
        "Raw pointer dereference etmek gibi beş belirli işleme izin verir — ownership, borrowing ve tip denetimi etkilenmez",
        "Kapsadığı kod için borrow checker'ı devre dışı bırakır",
        "Data race'lere izin verir ve bounds check'leri atlar",
      ],
      answer: 0,
      explain:
        "En yaygın yanlış kanı budur. `unsafe` bir block'un içindeki borrow hataları hâlâ borrow hatasıdır — `unsafe`, namından çok daha dar bir anahtardır.",
    },
    {
      kind: "fill",
      prompt: "Bu block'un garanti ettiği invariant'ı belgele.",
      file: "main.rs",
      before: "// ",
      after: ": mid <= len, dolayısıyla iki aralık da sınırlar içinde ve örtüşmüyor.\nunsafe {",
      choices: ["SAFETY", "NOTE", "UNSAFE"],
      answer: 0,
      explain:
        "`// SAFETY:` ekosistem genelindeki gelenektir ve clippy'nin `undocumented_unsafe_blocks` lint'i tam olarak bu öneki arar.",
    },
    {
      kind: "quiz",
      question:
        "İçinde `unsafe` block olan bir fonksiyonun kendisi ne zaman `unsafe fn` olarak işaretlenmelidir?",
      options: [
        "Bir çağıran invariant'ı yalnızca safe kodla kırabiliyorsa — o zaman yükümlülük çağırana aittir",
        "Her zaman — içinde `unsafe` olan her fonksiyon `unsafe` olmalıdır",
        "Hiçbir zaman — block'u işaretlemek yeterlidir",
      ],
      answer: 0,
      explain:
        "Safe abstraction'ların bütün tasarımı budur. `Vec::push` içeride `unsafe` kullanır ve safe'dir, çünkü hiçbir safe çağıran invariant'larını ihlal edemez. `slice::get_unchecked` `unsafe`'dir, çünkü çağıran herhangi bir index geçebilir.",
    },
    {
      kind: "editor",
      intro: `### Unsafe bir çekirdek üstünde safe bir API

Örtüşmeyen iki mutable yarı döndüren \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` yaz — borrow checker'ın ifade edemediği, \`std\`'nin \`split_at_mut\` olarak sunduğu şey.

\`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\` ve iki slice'ın neden asla alias olmadığını söyleyen bir \`// SAFETY:\` yorumu kullan.

\`main\`'de \`[1, 2, 3, 4, 5, 6]\`'yı böl, sol yarının ilk elemanına \`100\`, sağınkine \`200\` yaz, iki yarıyı da yazdır, sonra dizinin tamamını yazdır.

Beklenen çıktı:

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\``,
    },
  ],

  "rust-systems-edges-5": [
    {
      kind: "theory",
      body: `Bir raw pointer — \`*const T\` ya da \`*mut T\` — düpedüz bir adrestir. Lifetime taşımaz, ownership taşımaz, aliasing garantisi vermez; null ya da hizasız (unaligned) olabilir.

Bir tane oluşturmak **safe**'dir. Dereference etmek değildir:

\`\`\`rust
let p: *mut i64 = &mut value;    // safe — sadece bir adres
unsafe { *p += 1; }              // unsafe — geçerli olduğunu sen garanti ediyorsun
\`\`\`

Bu ayrım bilinçli: bir adresi elinde tutmak hiçbir şeyi bozamaz. Üzerinden okumak bozabilir.`,
    },
    {
      kind: "theory",
      body: `Dereference aynı anda dört şeyi garanti eder ve dördü de senin sorumluluğundadır:

**Null değil.** \`ptr::null()\` vardır ve \`is_null()\` onu denetler — raw pointer'ın yaslanacağı bir \`Option\` niche'i yoktur.
**Hizalı (aligned).** \`*mut i64\` 8 byte'lık bir sınıra oturmalıdır. Hizasız bir okuma, buna tahammül eden donanımda bile undefined behavior'dır (tanımsız davranış).
**Canlı bir değeri gösteriyor.** Orijinal drop ya da move edilmiş olmamalıdır.
**Canlı bir \`&mut\` ile alias olmuyor.** İnsanların kaçırdığı bu. Rust'ın optimizer'ı \`&mut T\`'nin tekil olduğunu varsayar ve canlı bir \`&mut\` ile örtüşen bir raw pointer üzerinden yazmak bu varsayımı kırar — hatalı derleme, suçlu satırdan çok uzakta ortaya çıkabilir.

\`ptr.add(n)\` pointer aritmetiğini \`T\` birimiyle yapar ve sonucun aynı allocation içinde kalmasını gerektirir — sonun bir ötesine izin vardır; daha ötesi, hiç okumasan bile undefined'dır.

Pratik tavsiye: FFI'ın ya da borrow checker'ın gerçekten ifade edemediği bir veri yapısının dışında raw pointer'lara uzanıyorsan, neredeyse kesinlikle safe bir yol vardır. Uzandığında \`cargo miri test\` çalıştır — bu ihlallerin çoğunu runtime'da yakalar.`,
    },
    {
      kind: "quiz",
      question:
        "Raw pointer oluşturmak safe iken dereference etmek neden değil?",
      options: [
        "Bir adresi tutmak hiçbir şeyi bozamaz; üzerinden okumak ya da yazmak, derleyicinin denetleyemediği bir geçerlilik garantisi verir",
        "Oluşturma compile time'da, dereference runtime'da denetlenir",
        "Raw pointer oluşturmak da unsafe'dir; derleyici sadece zorlamaz",
      ],
      answer: 0,
      explain:
        "`&raw const x` ve cast'lerin safe işlemler olmasının sebebi bu. Yükümlülük kullanım noktasında bağlanır — `// SAFETY:` yorumunun da yeri orasıdır.",
    },
    {
      kind: "fill",
      prompt: "Pointer'ı iki byte değil, iki eleman ileri taşı.",
      file: "main.rs",
      before: "unsafe { println!(\"offset 2: {}\", *base.",
      after: "(2)); }",
      choices: ["add", "offset_bytes", "wrapping_byte_add"],
      answer: 0,
      explain:
        "`add` `T` birimiyle sayar; yani bir `*const i64` üzerinde `base.add(2)` 16 byte ilerler. Sonuç aynı allocation içinde kalmalıdır.",
    },
    {
      kind: "quiz",
      question:
        "Hangi raw pointer ihlali, sebebinden çok uzakta ortaya çıkan bir bug üretmeye en yatkındır?",
      options: [
        "Canlı bir `&mut` ile alias olan bir raw pointer üzerinden yazmak — optimizer tekillik varsaydı ve başka bir yeri hatalı derledi",
        "Anında çöken bir null pointer dereference'ı",
        "Bir dizinin sonundan bir eleman ötesini okumak",
      ],
      answer: 0,
      explain:
        "Null dereference o satırda segfault verir. Aliasing ihlali sessizdir ve optimizer'ın ürettiği yanlış kod bambaşka bir fonksiyonda olabilir — `cargo miri` tam olarak bunu yakalamak için var.",
    },
    {
      kind: "editor",
      intro: `### Adresleri bilinçli ele al

1. \`let mut value = 42i64;\` ve ona bir \`*mut i64\` al. \`// SAFETY:\` yorumlu bir \`unsafe\` block'ta pointer üzerinden artır ve yine pointer üzerinden okuduğun değeri yazdır. Sonra orijinal binding'i yazdır — aynı değer.
2. \`let arr = [10i64, 20, 30];\` ve onun \`as_ptr()\`'ını al. \`add\` ile offset \`2\`'deki elemanı yazdır.
3. Bir \`std::ptr::null::<i64>()\` kur ve \`is_null()\`'ı yazdır — safe bir çağrı, block gerekmez.

Beklenen çıktı:

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\``,
    },
  ],

  "rust-systems-edges-6": [
    {
      kind: "theory",
      body: `Bir **ABI**, makine seviyesindeki çağırma sözleşmesidir: argümanlar nasıl geçilir, değerler nasıl döndürülür, bir struct bellekte nasıl yerleşir. Rust'ın kendi ABI'si bilerek unstable'dır (kararsız), dolayısıyla C ya da C++ tarafına geçmek onlarınkini kabul etmek demektir.

Bunu iki attribute yapar:

\`\`\`rust
#[repr(C)]                        // bu struct'ı C'nin yerleştireceği gibi yerleştir
pub struct Point { x: i64, y: i64 }

#[no_mangle]                      // sembol adını yazıldığı gibi koru
pub extern "C" fn point_sum(p: *const Point) -> i64
\`\`\`

\`#[repr(C)]\` olmadan Rust, sıkı paketleme için alanların sırasını değiştirebilir. \`#[no_mangle]\` olmadan linker, hiçbir C çağıranının bulamayacağı mangle edilmiş bir sembol görür.`,
    },
    {
      kind: "theory",
      body: `FFI'ın (yabancı fonksiyon arayüzü) zor kısmı syntax değil, **ownership'in derleyicinin içini göremediği bir sınırı geçmesi**dir.

\`\`\`rust
Box::into_raw(Box::new(Point { x, y }))   // ownership Rust'tan çıkar
drop(Box::from_raw(p))                    // ownership geri döner, bir kez free edilir
\`\`\`

Bu iki çağrı arasında Rust'ta o pointer'ı takip eden hiçbir şey yok. İşin içinden sağ çıkmanı sağlayan kurallar şunlar:

**Her \`into_raw\` için tam olarak bir eşleşen \`from_raw\`.** Sıfır tanesi leak, iki tanesi double free demektir. Free fonksiyonunu constructor'la birlikte ver ve eşleşmeyi belgele.

**Tahsisi yapan allocator ile (bellek tahsisçisi) free et.** Rust'ın \`Box\`'ından gelen bellek Rust'a geri dönmeli, asla C'nin \`free\`'sine değil; tersi de aynı.

**Bir panic'in sınırı geçmesine asla izin verme.** C frame'lerine doğru unwind etmek undefined behavior'dır (tanımsız davranış); sınırda \`catch_unwind\` ile yakala ve bir hata kodu döndür.

**Gelen her şeyi doğrula.** C'den gelen bir pointer null, hizasız (misaligned) ya da dangling olabilir — doğrulayabildiğini doğrula, kalanını da fonksiyonun \`# Safety\` dokümantasyonuna yaz.

Pratikte bildirimleri elle yazmak yerine \`cxx\` (denetimli bir Rust/C++ köprüsü) ya da \`bindgen\` (C header'larından bildirim üretir) tarafına uzan. İkisi de kopyalama hatalarını ortadan kaldırır; asıl canını yakanlar da zaten onlardır.`,
    },
    {
      kind: "quiz",
      question: "`#[repr(C)]` neyi garanti eder?",
      options: [
        "Alanlar, C'nin padding kurallarıyla bildirim sırasına göre yerleşir; böylece bir C programı struct'ı okuyabilir",
        "Struct yalnızca C kodundan kullanılabilir",
        "Her alan, erişildiğinde bir C tipine dönüştürülür",
      ],
      answer: 0,
      explain:
        "Rust'ın varsayılan gösterimi padding'i azaltmak için alanların sırasını değiştirebilir. Bu iyi bir optimizasyondur — ve karşı tarafta sabit bir yerleşim bekleyen biri varsa ölümcül bir optimizasyondur.",
    },
    {
      kind: "fill",
      prompt: "Heap'teki bir değerin ownership'ini sınırın öbür tarafına devret.",
      file: "main.rs",
      before: "    Box::",
      after: "(Box::new(Point { x, y }))",
      choices: ["into_raw", "leak", "as_ref"],
      answer: 0,
      explain:
        "`into_raw` ownership'i bırakır ve pointer'ı döndürür; `from_raw` da onu sonradan geri alabilir. `Box::leak` de ownership'i bırakır ama asla free edilemeyecek bir `&'static mut` döndürür.",
    },
    {
      kind: "quiz",
      question: "Bir panic neden asla bir FFI sınırını geçmemeli?",
      options: [
        "C stack frame'lerinin içinden unwind etmek undefined behavior'dır — sınırda yakala ve bir hata kodu döndür",
        "C, panic mesajını gösteremez",
        "Panic sessizce yutulur ve hata kaybolur",
      ],
      answer: 0,
      explain:
        "Güncel Rust'ta `extern \"C\"` fonksiyonlar varsayılan olarak unwind etmek yerine abort eder; bu da UB'yi bir çökmeye çevirir. Gövdeyi `catch_unwind` ile sarıp bir durum kodu döndürmek, çağıranın gerçekten ele alabileceği sürümdür.",
    },
    {
      kind: "editor",
      intro: `### Sınırın öbür yanına ownership

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — \`pub\` olmak zorunda, çünkü dışa açtığın fonksiyonlar ondan söz ediyor.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — null için \`0\`, aksi hâlde \`x + y\` döndür; üstüne de bir \`// SAFETY:\` yorumu koy.
3. \`Box::into_raw\` ile \`point_new(x, y) -> *mut Point\`, \`Box::from_raw\` ile de null kontrollü \`point_free(p: *mut Point)\`.
4. \`main\`'de: \`(3, 4)\` noktasını kur, toplamını yazdır, noktanın kendisini raw pointer üzerinden yazdır, free et, \`size_of::<Point>()\`'i yazdır, sonra da null bir pointer için \`point_sum\`'ı yazdır.

Beklenen çıktı:

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

Bir \`into_raw\`, bir \`from_raw\`. Sözleşmenin tamamı bu eşleşmeden ibaret.`,
    },
  ],

  "rust-systems-edges-7": [
    {
      kind: "theory",
      body: `**Bir bakiye asla float değildir.** \`f64\`, \`0.1\`'i tam olarak gösteremez; aritmetik hata biriktirir — ve bir ledger'da (defter) hata, tutmayan para demektir.

\`\`\`rust
0.1f64 + 0.2f64 == 0.3     // false
\`\`\`

Evrensel cevap **fixed point** (sabit nokta): en küçük bölünemez birimi integer olarak sakla. Stellar *stroop* sayar, XLM başına \`10_000_000\` tane. Çoğu para birimi kuruş sayar. Yuvarlama yok, çünkü yuvarlanacak bir şey yok.`,
    },
    {
      kind: "theory",
      body: `Integer'lar sessizce hassasiyet kaybetmez ama **overflow** eder (taşar) — ve release build'lerde bu kontrol derlemeden çıkarılır, yani \`i64::MAX + 1\` tek bir uyarı bile vermeden \`i64::MIN\`'e sarar. Debug build panic atar; production atmaz. Bu fark gerçek olaylara yol açtı.

O yüzden açık ol. Rust dört aile sunuyor ve seçim bir tasarım kararıdır:

| metot | overflow olunca |
| --- | --- |
| \`checked_add\` | \`None\` — sen ele alırsın |
| \`saturating_add\` | maksimumda sabitlenir |
| \`wrapping_add\` | başa sarar |
| \`overflowing_add\` | \`(value, bool)\` |

**Para söz konusuysa her zaman \`checked_\`.** Taşan bir bakiye, sabitlenecek ya da başa sardırılacak bir değer değil, çağıranın görmesi gereken bir hatadır. \`checked_mul(..)?.checked_add(..)\`, \`Option\` ya da \`Result\` döndüren bir fonksiyonun içinde \`?\` ile tertemiz zincirlenir.

\`saturating_\` başa sarmaması gereken bir metrik için doğrudur; \`wrapping_\` ise sarmanın bilerek istendiği bir hash ya da sequence number için. İkisinin de bir bakiyenin yanında işi yok.`,
    },
    {
      kind: "quiz",
      question: "Parasal bir bakiye neden asla `f64`'te saklanmamalı?",
      options: [
        "İkilik kayan nokta çoğu ondalık kesri tam gösteremez; aritmetik, ledger'ın tutturamayacağı bir hata biriktirir",
        "`f64`, modern donanımda `i64`'ten yavaştır",
        "`f64`'ün aralığı `i64`'ünkinden dardır",
      ],
      answer: 0,
      explain:
        "`f64`'ün aralığı aslında çok daha geniştir. Sorun hiçbir zaman aralık değildi — sorun kesinlik; `0.1 + 0.2 != 0.3` de tek satırlık kanıtı.",
    },
    {
      kind: "fill",
      prompt: "Çarpımı öyle yap ki overflow, çağıranın ele almak zorunda olduğu bir değere dönüşsün.",
      file: "main.rs",
      before: "xlm.",
      after: "(STROOPS_PER_XLM)?.checked_add(fraction)",
      choices: ["checked_mul", "saturating_mul", "wrapping_mul"],
      answer: 0,
      explain:
        "`saturating_mul` sessizce `i64::MAX`'e sabitlerdi — kimsede olmayan bir bakiye uydurarak. Para söz konusuysa overflow çağırana ulaşmak zorunda.",
    },
    {
      kind: "quiz",
      question:
        "Bir servis bakiyeleri düz `+` ile hesaplıyor; staging'de sorunsuz çalışıyor, sonra production'da negatif bir bakiye üretiyor. Ne oldu?",
      options: [
        "Overflow kontrolleri debug'da açık, release'te derlemeden çıkarılmış — aynı ifade staging'de panic attı, production'da başa sardı",
        "Veritabanı bozuk bir değer döndürdü",
        "Release build'ler farklı bir integer genişliği kullanır",
      ],
      answer: 0,
      explain:
        "Finansal kodda release profilinde `overflow-checks = true` ayarının savunulabilir olmasının sebebi bu — ve `checked_`'ı doğrudan aritmetiğin kendisinde kullanmanın daha da iyi olmasının sebebi de.",
    },
    {
      kind: "editor",
      intro: `### Integer'larda para

1. \`const STROOPS_PER_XLM: i64 = 10_000_000;\`
2. Önce \`checked_mul(..)?\`, sonra \`checked_add(..)\` kullanan \`fn to_stroops(xlm: i64, fraction: i64) -> Option<i64>\`.
3. \`to_stroops(2, 5_000_000)\` ve \`to_stroops(i64::MAX, 0)\`'ı \`{:?}\` ile yazdır.
4. \`100i64.checked_sub(30)\` ve \`10i64.checked_sub(i64::MIN)\`'i \`{:?}\` ile yazdır.
5. \`i64::MAX.saturating_add(1)\` ve \`i64::MAX.wrapping_add(1)\`'i yazdır.
6. \`0.1f64 + 0.2f64 == 0.3\` doğru mu, yazdır.

Beklenen çıktı:

\`\`\`text
2.5 XLM: Some(25000000)
overflow: None
checked_sub ok: Some(70)
checked_sub under: None
saturating: 9223372036854775807
wrapping: -9223372036854775808
float equality: false
\`\`\`

Son satır, ilk altısının neden önemli olduğunun ta kendisi.`,
    },
  ],
};
