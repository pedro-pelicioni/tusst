// TR · editor instructions — Macros, Unsafe, FFI & Money.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-systems-edges.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustSystemsEdgesInstructionsTr: Record<string, { instructions: string }> = {
  "rust-systems-edges-1": {
    instructions: `## Invariant'ı kırılmaz yap

Her şey varsayılan olarak private'tır ve bir struct'ın üstündeki \`pub\`, alanlarını public yap**maz**. "Bir bakiye asla negatif olmaz" cümlesini bir yorum olmaktan çıkarıp tipin bir özelliğine çeviren de tam olarak budur: tek kapı constructor'dır.

| yazılan | kime görünür |
| --- | --- |
| *(hiçbir şey)* | bu module ve altındakiler |
| \`pub(crate)\` | bu crate içinde her yer |
| \`pub(super)\` | üst module |
| \`pub\` | herkes, diğer crate'ler dâhil |

### Görevin

1. İçinde \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` olan bir \`mod ledger\` — alan **private kalır**.
2. \`impl Balance\` içinde: \`pub fn new(stroops: i64) -> Option<Balance>\` (negatifse \`None\`), \`pub fn stroops(&self) -> i64\` ve \`pub(crate) fn raw(&self) -> i64\`.
3. \`main\`'de \`use ledger::Balance;\` yaz; \`new(250)\`'yi stroops'una map'leyip yazdır, \`new(-1)\`'i aynı şekilde, bir de \`10\` değerindeki geçerli bir bakiye üzerinde \`raw()\`'u.

Beklenen çıktı:

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

### İpuçları

- \`Balance::new(250).map(|b| b.stroops())\` sana bir \`Option<i64>\` verir.
`,
  },

  "rust-systems-edges-2": {
    instructions: `## Bir fonksiyonun yerini tutamayacağı bir macro

\`macro_rules!\` syntax eşler ve tip denetiminden önce syntax'a genişler. Bir fonksiyonun yapamadığını yapar: variadic argümanlar, tek konumda karışık tipler ve bir ifadenin kaynak metnini yakalamak.

Tekrar: \`$( ... ),+\` virgülle ayrılmış bir ya da daha fazla grubu eşler; gövdedeki aynı şekil de her eşleşme için bir kopya üretir. \`{{ ... }}\` genişlemeyi bir block ifadesi yapar, böylece statement'lar barındırıp yine de bir değer üretebilir.

### Görevin

İki kurallı \`macro_rules! metric\` yaz:

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → aynısı, ardından her çift için sona eklenen \`",<k>=<v>"\`.

Onu \`("requests", 42)\` ile ve \`("latency", 95, "method" => "getEvents", "code" => 200)\` ile çağır.

Beklenen çıktı:

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

### İpuçları

- İkinci kuralın gövdesinde \`let mut out = format!(...)\`, sonra tekrarlanan bir \`out.push_str(...)\`, en sonda da kuyruk olarak \`out\` gerekir.
- İki argümanlı kuralı başa koy; macro kuralları sırayla eşlenir.
`,
  },

  "rust-systems-edges-3": {
    instructions: `## Bir derive'ın ne ürettiğini gör

\`#[derive(...)]\` bir procedural macro'dur: tipinin token'larını okur ve sıradan Rust döndürür. Derleyicide özel olarak ele alınan hiçbir şey yok; \`cargo expand\` da çıktıyı sana gösterir.

\`Debug\` her alanı adıyla yazdırır. \`Clone\` her alanı klonlar. \`PartialEq\` her alanı karşılaştırır. \`Default\` her alanı **kendi** default'uyla doldurur.

### Görevin

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`
2. Endpoint \`https://rpc\`, retries \`3\`, verbose \`false\` ile bir tane kur ve \`clone()\`'la.
3. Orijinali \`{:?}\` ile, ikisinin eşit olup olmadığını ve \`Config::default()\`'u \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Dört impl, hiçbirini sen yazmadın.
`,
  },

  "rust-systems-edges-4": {
    instructions: `## Unsafe bir çekirdeğin üstünde safe bir API

\`unsafe\` beş yeteneğin kilidini açar — bir raw pointer (ham işaretçi) dereference etmek, \`unsafe\` bir fn çağırmak, bir \`static mut\`'a dokunmak, \`unsafe\` bir trait implement etmek, bir union alanı okumak. Ownership, borrowing ve tip denetimi **değişmeden kalır**.

Anlamı şu: "Derleyicinin denetleyemediği bir invariant'ı ben garanti ediyorum". Bu yüzden her block, iddianın neden geçerli olduğunu söyleyen bir \`// SAFETY:\` yorumu alır.

İçinde \`unsafe\` geçen safe bir fonksiyon, invariant'ın *her* girdi için geçerli olduğuna söz verir. \`split_at_mut\`'ı safe yapan da budur.

### Görevin

\`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\` ve bir \`// SAFETY:\` yorumu kullanarak, çakışmayan iki mutable yarım döndüren \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` yaz.

\`main\`'de \`[1, 2, 3, 4, 5, 6]\`'yı böl, sol yarımın ilk elemanına \`100\`, sağ yarımınkine \`200\` yaz, iki yarımı da yazdır, sonra dizinin tamamını yazdır.

Beklenen çıktı:

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\`

### İpuçları

- \`len()\` ve \`mid\`'i pointer'ı almadan **önce** oku; böylece o sırada canlı bir borrow kalmaz.
- \`ptr.add(mid)\` \`mid\` eleman kadar ileri gider.
`,
  },

  "rust-systems-edges-5": {
    instructions: `## Adresleri bilerek ele al

Bir raw pointer düpedüz bir adrestir: lifetime yok, ownership yok, aliasing garantisi yok. **Bir tane oluşturmak safe'tir; dereference etmek değil.**

Bir dereference aynı anda dört şeyi garanti eder — null olmadığını, hizalı (aligned) olduğunu, canlı bir değeri gösterdiğini ve canlı bir \`&mut\` ile alias etmediğini. Sonuncusu insanların kaçırdığıdır; bug'ları da suçlu satırdan çok uzakta yüzeye çıkar.

### Görevin

1. \`let mut value = 42i64;\` ve ona bakan bir \`*mut i64\`. \`// SAFETY:\` yorumu olan bir \`unsafe\` block içinde pointer üzerinden değeri artır ve yine pointer üzerinden okuduğun değeri yazdır. Sonra orijinal binding'i yazdır.
2. \`let arr = [10i64, 20, 30];\` ve onun \`as_ptr()\`'si. \`add\` ile offset \`2\`'deki elemanı yazdır.
3. Bir \`std::ptr::null::<i64>()\` kur ve \`is_null()\`'ı yazdır — safe bir çağrı, block gerekmez.

Beklenen çıktı:

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\`

### İpuçları

- \`let p: *mut i64 = &mut value;\` referansı bir raw pointer'a çevirir.
- \`add\` \`T\` birimiyle sayar, yani bir \`*const i64\` üzerinde \`add(2)\` 16 byte ilerler.
`,
  },

  "rust-systems-edges-6": {
    instructions: `## Sınırın öbür yanına ownership

Rust'ın ABI'si bilerek unstable'dır (kararsız), dolayısıyla C tarafına geçmek onlarınkini kabul etmek demektir: yerleşim için \`#[repr(C)]\`, sembol ve çağırma sözleşmesi için \`#[no_mangle]\` ve \`extern "C"\`.

Zor kısım, ownership'in derleyicinin içini göremediği bir sınırı geçmesi. Her \`Box::into_raw\` için tam olarak bir eşleşen \`Box::from_raw\` gerekir — sıfır tanesi leak, iki tanesi double free demektir.

### Görevin

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — \`pub\` olmak zorunda, çünkü dışa açtığın fonksiyonlar ondan söz ediyor.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — null için \`0\`, aksi hâlde \`x + y\`; üstüne de bir \`// SAFETY:\` yorumu.
3. \`Box::into_raw\` ile \`point_new(x, y) -> *mut Point\`, \`Box::from_raw\` ile de null kontrollü \`point_free(p: *mut Point)\`.
4. \`main\`'de: \`(3, 4)\`'ü kur, toplamını yazdır, noktayı raw pointer üzerinden yazdır, free et, \`size_of::<Point>()\`'i yazdır, sonra da null bir pointer için \`point_sum\`'ı.

Beklenen çıktı:

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

Bir \`into_raw\`, bir \`from_raw\`. Sözleşmenin tamamı bu eşleşmeden ibaret.

### İpuçları

- Son çağrı için \`std::ptr::null()\`.
- Noktayı, boyutu yazdırmadan **önce** free et; yoksa borrow sırası kafanı karıştırır.
`,
  },

  "rust-systems-edges-7": {
    instructions: `## Integer'larda para

Bakiye asla float değildir — \`f64\` çoğu ondalık kesri tam gösteremez ve bir ledger'da (defter) o hata, tutmayan para demektir. En küçük bölünemez birimi integer olarak sakla: stroop, kuruş, satoshi.

Integer'lar hassasiyet kaybetmez ama **overflow** eder (taşar) — ve bu kontrol release build'lerde derlemeden çıkarılır. Açık ol:

| metot | overflow olunca |
| --- | --- |
| \`checked_add\` | \`None\` — sen ele alırsın |
| \`saturating_add\` | maksimumda sabitlenir |
| \`wrapping_add\` | başa sarar |

Para söz konusuysa her zaman \`checked_\`.

### Görevin

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

Son satır, ilk altısının neden önemli olduğunun ta kendisi.
`,
  },
};
