import type { LessonStep } from "@/content/steps";

// TR · Traits, Generics & Dispatch.
//
// Overlay for ../../steps/rust-traits-generics.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustTraitsGenericsStepsTr: Record<string, LessonStep[]> = {
  "rust-traits-generics-1": [
    {
      kind: "theory",
      body: `Bir trait (özellik arayüzü), bir tipin sağlamayı vaat ettiği metot kümesidir. Base class değildir: kalıtım yok, paylaşılan alan yok, constructor yok.

\`\`\`rust
trait Health {
    fn name(&self) -> String;

    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

\`name\` zorunlu. \`status\` ise zorunlu metotlar cinsinden yazılmış bir **default implementation**'a (varsayılan gövde) sahip — implement eden tip onu bedavaya alır ve isterse override edebilir.`,
    },
    {
      kind: "theory",
      body: `*Bir-iki zorunlu metot artı bir yığın default* kalıbı, standart kütüphaneyi kullanılabilir tutan şeydir. \`Iterator\` tam olarak tek bir metot ister, \`next\`, ve üstüne yetmiş küsur adapter verir.

Kendi trait'lerini de aynı şekilde tasarla. Zorunlu yüzeyi soyutlamanın izin verdiği kadar küçük tut, sonra rahatlığı default'lar olarak üstüne inşa et:

\`\`\`rust
impl Health for Db {
    fn name(&self) -> String { String::from("db") }
    // status() bedavaya gelir
}

impl Health for Rpc {
    fn name(&self) -> String { String::from("rpc") }
    fn status(&self) -> String { format!("{}: degraded", self.name()) }
}
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "Bir trait'in bir zorunlu, bir de default metodu var. Implement eden tip ne yazmak zorunda?",
      options: [
        "Sadece zorunlu metodu — default miras alınır, override etmek isteğe bağlı",
        "İkisini de, çünkü bir trait impl'i eksiksiz olmak zorunda",
        "Sadece default metodu; zorunlu metotları derleyici sağlar",
      ],
      answer: 0,
      explain:
        "Default'ların var olma sebebi tam olarak bu: bir trait'in, her büyüdüğünde mevcut tüm implementor'ları kırmadan faydalı yüzey kazanmasına izin verirler.",
    },
    {
      kind: "fill",
      prompt:
        "Trait'e, zorunlu metottan türetilmiş bir default metot ver.",
      file: "main.rs",
      before: "trait Health {\n    fn name(&self) -> String;\n\n    fn status(&self) -> String {\n        format!(\"{}: ok\", ",
      after: ")\n    }\n}",
      choices: ["self.name()", "Self::name", "name()"],
      answer: 0,
      explain:
        "Bir default gövde, trait'in diğer her metodunu `self` üzerinden çağırabilir — onu bileşilebilir kılan da bu. Receiver'sız `Self::name` hangi instance'a soracağını bilemez.",
    },
    {
      kind: "quiz",
      question: "Rust neden trait üzerinden alan (field) erişimi sunmaz?",
      options: [
        "Trait'ler davranışı tanımlar, bellek yerleşimini değil — implementor'lar verilerini bambaşka şekillerde saklayabilir",
        "Sunar; `trait T { field: u32 }` geçerli bir sözdizimi",
        "Alanlara erişilebilir ama yalnızca default metot gövdelerinden",
      ],
      answer: 0,
      explain:
        "Kalıtımdan bilinçli kopuş tam burada. Alan benzeri erişime ihtiyacın varsa trait'e bir getter ekle — böylece o değeri anında hesaplayan bir tip de implement edebilir.",
    },
    {
      kind: "editor",
      intro: `### Bir zorunlu metot, bir default

1. Zorunlu \`fn name(&self) -> String\` ve \`"<name>: ok"\` döndüren default bir \`fn status(&self) -> String\` ile \`trait Health\`'i tanımla.
2. \`Db\` ve \`Rpc\` unit struct'larını tanımla.
3. \`Db\` yalnızca \`name\`'i implement eder (\`db\` döndürür). \`Rpc\` hem \`name\`'i implement eder (\`rpc\` döndürür) **hem de** \`status\`'u override edip \`"<name>: degraded"\` döndürür.
4. Her birinin status'unu yazdır.

Beklenen çıktı:

\`\`\`text
db: ok
rpc: degraded
\`\`\``,
    },
  ],

  "rust-traits-generics-2": [
    {
      kind: "theory",
      body: `Bound'suz (sınırsız) bir generic parametre neredeyse işe yaramaz: gövde yalnızca *her* tip için çalışan şeyleri yapabilir, o da hemen hemen hiçbir şeydir.

Bir **bound** (sınır), girdiyi daraltarak yeteneği geri satın alır:

\`\`\`rust
fn describe_all<T: Display>(items: &[T]) -> String
\`\`\`

Artık gövde \`.to_string()\` çağırabilir, çünkü \`Display\` onun var olduğunu garanti eder. Bound iki yönlü bir sözleşmedir: çağıran bir \`Display\` tipi sağlamak zorunda, karşılığında gövde ona güvenebilir.`,
    },
    {
      kind: "theory",
      body: `\`where\`, bound'ları imzanın altına taşır. Sadece kozmetik değil — bazı bound'lar satır içinde hiç yazılamaz:

\`\`\`rust
fn process<T>(items: &[T]) -> String
where
    T: Display + Clone,
    for<'a> &'a T: IntoIterator,
{ ... }
\`\`\`

Tutmaya değer disiplin şu: **tam olarak gövdenin kullandığını bound'la, fazlasını değil.** Hiç clone yapmayan bir fonksiyondaki gereksiz \`T: Clone\` fonksiyonu daha güvenli yapmaz — gayet iyi bir \`Clone\`-olmayan tipe sahip çağıranları reddeder. Fazla bound koymak, bir lifetime'ı fazla annotate etmenin generic versiyonudur.`,
    },
    {
      kind: "quiz",
      question:
        "Bir yardımcı fonksiyon `items: &[T]` alıyor ve her elemanı yalnızca formatlıyor. Doğru bound hangisi?",
      options: [
        "`T: Display` — gövdenin gerçekten ihtiyaç duyduğu minimum",
        "`T: Display + Clone + Debug`, fonksiyonu gelecek için esnek tutmak adına",
        "Bound yok, doğrudan `.to_string()` çağır — her tipte var",
      ],
      answer: 0,
      explain:
        "Bound eklemek esneklik eklemez; çağıran tarafından esneklik alır. Ve `.to_string()` bir blanket impl aracılığıyla `Display`'*den* gelir — bound olmadan öyle bir metot yoktur.",
    },
    {
      kind: "fill",
      prompt:
        "Gövdenin her elemanı formatlayabilmesi için parametreyi bir `where` cümlesiyle bound'la.",
      file: "main.rs",
      before: "fn describe_all<T>(items: &[T]) -> String\nwhere\n    T: ",
      after: ",\n{",
      choices: ["Display", "ToString + Clone", "Sized"],
      answer: 0,
      explain:
        "`ToString` da derlenirdi — std onu her `T: Display` için blanket olarak implement eder — ama yeteneği ifade eden trait `Display`'dir ve gövdenin eleman başına `String` ayırmak yerine bir buffer'a yazmasına izin verir. Asıl hata `+ Clone`: gövde hiç clone yapmıyor.",
    },
    {
      kind: "quiz",
      question: "Argüman pozisyonundaki `impl Trait` ne anlama gelir?",
      options: [
        "İsimsiz bir generic parametrenin kısaltmasıdır — `fn f(x: impl Display)`, `fn f<T: Display>(x: T)` demektir",
        "Bir trait object oluşturur ve argümanı runtime'da Box'lar",
        "Argümanın tam olarak o trait'in tek implementor'u olması gerektiği anlamına gelir",
      ],
      answer: 0,
      explain:
        "Tek gerçek fark: `impl Trait` ile tipin bir adı olmadığından çağıran turbofish kullanamaz. Geri kalan her şey — monomorphization, static dispatch — birebir aynı.",
    },
    {
      kind: "editor",
      intro: `### Tam olarak kullandığını bound'la

\`where T: Display\` cümlesiyle \`fn describe_all<T>(items: &[T]) -> String\` yaz; her elemanı \`", "\` ile birleştirsin.

\`main\` içinde iki kez çağır: bir kez \`&[1, 2, 3]\` ile, bir kez \`&["a", "b"]\` ile.

Beklenen çıktı:

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

\`std::fmt::Display\`'i import et. String'i \`join\` ile değil \`push_str\` ile kur — amaç bound'un kullanıldığını görmek.`,
    },
  ],

  "rust-traits-generics-3": [
    {
      kind: "theory",
      body: `Bu ikisi de bir trait'in bir tip üzerinde generic olmasını sağlar. Ama farklı şeyler ifade ederler:

\`\`\`rust
trait Source      { type Item;    fn next_item(&mut self) -> Option<Self::Item>; }
trait Source<T>   {               fn next_item(&mut self) -> Option<T>; }
\`\`\`

**Associated type** (ilişkili tip) ile bir tip \`Source\`'u **bir kez** implement eder ve \`Item\`'ı o tek implementasyonun parçası olarak seçer.

**Generic parametre** ile bir tip \`Source<u32>\`, \`Source<String>\`, \`Source<Frame>\` implement edebilir — istediği kadar.`,
    },
    {
      kind: "theory",
      body: `Hangisini isteyeceğine bu fark karar verir ve temiz bir test var: **implement eden tip başına tam olarak tek bir makul cevap var mı?**

\`Iterator\` associated type kullanır, çünkü bir \`Counter\` tek çeşit şey üretir. \`Item\` generic parametre olsaydı \`counter.next()\` her çağrı noktasında belirsiz olurdu ve sonsuza kadar turbofish yazıyor olurdun.

\`From\` tam tersi sebeple generic parametre kullanır: bir tip gerçekten birçok başka tip*ten* dönüştürülebilmeli ve \`impl From<u8> for Wide\` ile yanındaki \`impl From<u16> for Wide\` tam olarak doğru olan şeydir.

Associated type'lar aşağı akışta da daha iyi okunur: \`fn drain<S: Source>(s: S) -> Vec<S::Item>\` çıktıyı ikinci bir parametre olmadan adlandırır.`,
    },
    {
      kind: "quiz",
      question:
        "`Iterator` neden `trait Iterator<T>` yerine `type Item` kullanır?",
      options: [
        "Belirli bir iterator tam olarak tek çeşit eleman üretir; ikinci bir impl her çağrı noktasında yalnızca belirsizlik yaratırdı",
        "Associated type'lar generic parametrelerden daha hızlı derlenir",
        "Standart kütüphanedeki trait'lerde generic parametreye izin verilmez",
      ],
      answer: 0,
      explain:
        "Karşı senaryoyu dene: `Iterator<T>` ile `v.iter().next()` `T`'yi çıkaramaz ve her çağrı annotation isterdi. Associated type cevabı tekil kılar.",
    },
    {
      kind: "fill",
      prompt:
        "İkinci bir parametre eklemeden, aşağı akıştaki bir imzada çıktı tipini adlandır.",
      file: "main.rs",
      before: "fn drain<S: Source>(mut s: S) -> Vec<",
      after: "> {",
      choices: ["S::Item", "S", "Source::Item"],
      answer: 0,
      explain:
        "`S::Item`, somut `S` üzerinden projekte edilen associated type'tır. `Source::Item`'ın projekte edilecek bir `Self`'i yoktur, bu yüzden derleyici çözümleyemez.",
    },
    {
      kind: "quiz",
      question:
        "Bir `Converter` trait'i tasarlıyorsun ve bir tip `u8`, `u16` ve `u32`'den dönüştürülebilmeli. Hangi biçim uyar?",
      options: [
        "Generic parametre — tipin üç ayrı impl'e ihtiyacı var, kaynak başına bir tane",
        "Üçünü de kapsayan bir enum ile associated type",
        "Fark etmez; ikisi her durumda birbirinin yerine geçer",
      ],
      answer: 0,
      explain:
        "Tip başına birden fazla impl, tam olarak generic parametrenin izin verip associated type'ın yasakladığı şeydir. `From<T>`'nin generic olmasının sebebi de aynı.",
    },
    {
      kind: "editor",
      intro: `### Tip başına tek cevap

1. \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\` tanımla.
2. \`struct Counter { n: u32 }\` tanımla ve \`Source\`'u \`type Item = u32\` ile implement et; \`1\`, \`2\`, \`3\` sonra \`None\` üretsin.
3. Kaynağın ürettiği her şeyi toplayan \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` yaz.
4. Boşaltılan vektörü \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
items: [1, 2, 3]
\`\`\``,
    },
  ],

  "rust-traits-generics-4": [
    {
      kind: "theory",
      body: `Generic bir fonksiyon tek bir fonksiyon değildir. Derleyici onu **monomorphize** eder (tekbiçimleştirir): çağrıldığı her somut tip için ayrı, özelleşmiş bir kopya basar.

\`\`\`rust
fn emit<T: Debug>(label: &str, value: T) { ... }

emit("count", 42u32);        // emit::<u32> üretir
emit("name", "rpc");         // emit::<&str> üretir
emit("flags", vec![true]);   // emit::<Vec<bool>> üretir
\`\`\`

Üç çağrı noktası, binary'de üç gerçek fonksiyon. Her biri kendi somut tipini bilir, dolayısıyla içindeki her metot çağrısı **doğrudan çağrıdır** — dolaylılık yok, tamamen inline edilebilir.`,
    },
    {
      kind: "theory",
      body: `"Sıfır maliyetli soyutlama" burada tam bunu ifade eder: generic versiyon, elle yazacağın talimatların aynısına derlenir.

Maliyetler gerçek ama başka yere taşınır:

- **Binary boyutu.** Her instantiation kopyalanmış koddur. Yirmi tiple çağrılan yoğun generic bir kütüphane yirmi kopya üretir.
- **Derleme süresi.** Rust build'lerinin yavaş olmasının en büyük tekil sebebi budur.

Bu takas sıcak bir yolda neredeyse her zaman yapmaya değer; bir plugin registry'si ya da heterojen bir koleksiyon içinse çoğu zaman değmez — trait object'ler tam bunun için var.`,
    },
    {
      kind: "quiz",
      question:
        "Generic bir fonksiyon üç farklı somut tiple çağrılıyor. Binary'de kaç kopya var?",
      options: [
        "Üç — kullanılan her somut tip için bir özelleşmiş instantiation",
        "Bir; tip gizli bir runtime argümanı olarak geçirilir",
        "Bir, artı tip başına bir vtable",
      ],
      answer: 0,
      explain:
        "Instantiation'lar talep üzerine üretilir: hiç çağrılmayan bir generic için hiç codegen yapılmaz; kullanılmayan bir generic yardımcının hiçbir maliyeti olmamasının sebebi bu.",
    },
    {
      kind: "fill",
      prompt: "Değeri `{:?}` formatlayıcısıyla yazdırılabilecek şekilde bound'la.",
      file: "main.rs",
      before: "fn emit<T: ",
      after: ">(label: &str, value: T) {",
      choices: ["Debug", "Display", "Sized"],
      answer: 0,
      explain:
        "`{:?}` `Debug`'dır; `{}` `Display`. Bilerek ayrı trait'lerdir — `Debug` geliştiriciler içindir ve derive edilebilir, `Display` kullanıcılar içindir ve asla derive edilmez.",
    },
    {
      kind: "quiz",
      question:
        "Dolaylı çağrıya rağmen dynamic dispatch ne zaman daha iyi seçimdir?",
      options: [
        "Heterojen bir koleksiyona ihtiyacın olduğunda ya da kod boyutunun implementor sayısıyla büyümesini durdurmak istediğinde",
        "Fonksiyon birden fazla kez çağrıldığında",
        "Trait'in birden fazla metodu olduğunda",
      ],
      answer: 0,
      explain:
        "`Vec<Box<dyn Check>>`'in generic karşılığı yoktur — bir `Vec<T>` tek tip tutar. Trait object'lerin bir ödün değil, tek seçenek olduğu durum budur.",
    },
    {
      kind: "editor",
      intro: `### Üç çağrı noktası, üç fonksiyon

\`"<label>: <value:?>"\` yazdıran \`fn emit<T: Debug>(label: &str, value: T)\` yaz.

Üç kez çağır: \`42u32\` ile, \`"rpc"\` ile ve \`vec![true, false]\` ile.

Beklenen çıktı:

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

\`rpc\`'nin etrafındaki tırnaklara dikkat — bu \`Debug\`, \`Display\` değil, ve mesele tam da bu fark.`,
    },
  ],

  "rust-traits-generics-5": [
    {
      kind: "theory",
      body: `Generic sana instantiation başına tek tip verir. **Tek koleksiyonda birkaç farklı tip** gerektiğinde bir trait object'e (trait nesnesi) ihtiyacın var:

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` boyutu bilinen bir tip değildir, bu yüzden her zaman bir pointer'ın arkasında görünür — \`Box<dyn Check>\`, \`&dyn Check\`, \`Arc<dyn Check>\`. O pointer **fat**'tir (şişman): iki word, biri veriye, biri vtable'a.`,
    },
    {
      kind: "theory",
      body: `Vtable, (tip, trait) çifti başına bir tane olan, her metot için bir fonksiyon pointer'ı artı boyut ve drop glue tutan küçük, statik bir tablodur.

Dolayısıyla bir \`&dyn Check\` üzerinde \`c.run()\` çağırmak şu demek: vtable pointer'ını yükle, \`run\` slotunu yükle, onun üzerinden çağır. Maliyet bir ekstra dolaylılık ve — sıcak bir döngüde gerçekten önemli olan kısım — **çağrı inline edilemez**, çünkü hedef runtime'a kadar bilinmez.

Saniyede bir çağrılan bir health-check registry'si için bu maliyet ölçülemez ve esneklik her şeye değer. Bir sort içinde milyon kez çağrılan bir comparator içinse aradığın fark tam olarak budur.`,
    },
    {
      kind: "quiz",
      question: "`&Ping` bir word genişliğindeyken `&dyn Check` neden iki word?",
      options: [
        "Hem veriye bir pointer *hem de* o somut tipin vtable'ına bir pointer taşır",
        "Veriyi satır içi saklar, bu yüzden boyut implementor'a göre değişir",
        "Veri pointer'ının yanında bir referans sayacı taşır",
      ],
      answer: 0,
      explain:
        "Bir `&dyn Trait`'i bedavaya `&T`'ye geri cast edememenin ve `Box<dyn Trait>`'in doğru destructor'ı nasıl drop edeceğini bilmesinin sebebi bu: iki bilgi de vtable'da yaşar.",
    },
    {
      kind: "fill",
      prompt: "İki farklı somut tipi tek koleksiyonda tut.",
      file: "main.rs",
      before: "let checks: Vec<",
      after: "> = vec![Box::new(Ping), Box::new(Disk)];",
      choices: ["Box<dyn Check>", "dyn Check", "Check"],
      answer: 0,
      explain:
        "`Vec<dyn Check>` derlenemez: `Vec` `Sized` bir eleman ister ve `dyn Check`'in derleme zamanında bilinen bir boyutu yoktur. Ona boyut kazandıran `Box`'tır.",
    },
    {
      kind: "quiz",
      question:
        "Sıkı bir döngüde dynamic dispatch'in gerçek maliyeti genellikle ekstra pointer yüklemesi değildir. Nedir?",
      options: [
        "Çağrı inline edilemez, bu da inlining'in mümkün kılacağı optimizasyonları engeller",
        "Her çağrı heap'te yeni bir vtable ayırır",
        "Vtable araması bir lock gerektirir, bu yüzden eşzamanlı çağrılar çekişir",
      ],
      answer: 0,
      explain:
        "Vtable'lar statik veridir, derleme zamanında bir kez ayrılır — asla çağrı başına değil. Dürüst maliyet optimizasyon bariyeridir ve hafife almak kolaydır.",
    },
    {
      kind: "editor",
      intro: `### Heterojen bir registry

1. \`trait Check { fn run(&self) -> String; }\` tanımla.
2. Onu implement eden, \`ping ok\` ve \`disk ok\` döndüren \`Ping\` ve \`Disk\` unit struct'larını tanımla.
3. Her birinden bir tane tutan bir \`Vec<Box<dyn Check>>\` kur, üzerinde dolaşıp her sonucu yazdır, sonra sayıyı yazdır.

Beklenen çıktı:

\`\`\`text
ping ok
disk ok
count: 2
\`\`\``,
    },
  ],

  "rust-traits-generics-6": [
    {
      kind: "theory",
      body: `Her trait bir \`dyn Trait\` olamaz. Bir trait yalnızca her metodu bir vtable üzerinden çağrılabiliyorsa **object safe**'tir (nesne güvenli) — yani somut tip hakkında adresinden başka hiçbir şey bilmeden.

Gerçek hataların neredeyse tamamına iki kural sebep olur:

1. **Generic metot yok.** \`fn build<T: Encode>(&self, v: T)\` olası her \`T\` için bir vtable slotu isterdi ve küme sınırsızdır.
2. **Dönüş pozisyonunda \`Self\` yok.** \`fn clone_me(&self) -> Self\` çalışamaz: çağıran \`Self\`'in ne olduğunu ya da ne kadar büyük olduğunu bilmez.`,
    },
    {
      kind: "theory",
      body: `İkisinin de düzeltmesi aynı: derleme zamanındaki deliği runtime'daki bir delikle değiştir.

\`\`\`rust
trait Sink { fn accept<T: Encode>(&self, v: T) -> String; }   // object safe değil
trait Sink { fn accept(&self, v: &dyn Encode) -> String; }    // object safe
\`\`\`

Bir dolaylılığı, \`Box<dyn Sink>\`'i hiç saklayabilme yeteneğiyle takas ettin — genellikle doğru takas, çünkü object olarak istediğin bir trait zaten esnekliği için istediğin bir trait'tir.

İkisi birden gerektiğinde standart kalıp iki trait'tir: hızlı yol için generic olanı ve onun üstüne blanket tarzı implement edilmiş object-safe olanı.`,
    },
    {
      kind: "quiz",
      question:
        "Generic bir metot bir trait'i neden object-safe olmaktan çıkarır?",
      options: [
        "Vtable derleme zamanında kurulan sabit bir tablodur ve generic bir metot sınırsız sayıda slot isterdi",
        "Generic metotlar `&self` alamaz",
        "Derleyici destekleyebilirdi ama vtable'ları küçük tutmak için yasaklar",
      ],
      answer: 0,
      explain:
        "Vtable, trait object oluşturulduğunda (tip, trait) çifti başına kurulur. Gelecekteki bir çağıranın hangi instantiation'lara ihtiyaç duyacağını bilemez.",
    },
    {
      kind: "fill",
      prompt:
        "Metodu object-safe yap: değeri generic yerine trait object olarak al.",
      file: "main.rs",
      before: "trait Sink {\n    fn accept(&self, value: ",
      after: ") -> String;\n}",
      choices: ["&dyn Encode", "impl Encode", "T"],
      answer: 0,
      explain:
        "Argüman pozisyonundaki `impl Encode` bir generic parametrenin şekeridir, dolayısıyla açık generic'in başarısız olduğu sebeple birebir aynı sebepten object safety'yi geçemez.",
    },
    {
      kind: "quiz",
      question:
        "`Clone` object safe değildir. Gereksinimlerinden hangisi sorumlu?",
      options: [
        "`fn clone(&self) -> Self`, `Self`'i değer olarak döndürür ve çağıran o tipin boyutunu bilemez",
        "`Clone` tek bir vtable'ın sayamayacağı kadar çok tip tarafından implement edilir",
        "`clone` `&self` alır, object-safe metotlar ise `self` almak zorundadır",
      ],
      answer: 0,
      explain:
        "`Box<dyn Trait>`'in doğrudan clone'lanamamasının ve bunu aşan crate'lerin `fn clone_box(&self) -> Box<dyn Trait>` tanımlamasının sebebi bu — boyutu bilinen bir dönüş tipi.",
    },
    {
      kind: "editor",
      intro: `### Trait'i object olarak kullanılabilir tut

1. \`trait Encode { fn encode(&self) -> String; }\` tanımla.
2. Onu sayının ondalık metni olarak implement eden \`struct Num(i64)\` tanımla.
3. \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` tanımla — \`&dyn\`'a dikkat, onu object safe tutan bu.
4. \`Sink\`'i implement eden, \`"log:<encoded>"\` döndüren \`Log\` unit struct'ını tanımla.
5. \`main\` içinde onu \`Box<dyn Sink>\` olarak sakla ve bir \`Num(42)\` kabul ettir.

Beklenen çıktı:

\`\`\`text
log:42
\`\`\`

\`accept\` generic olsaydı 5. adım derlenmezdi.`,
    },
  ],

  "rust-traits-generics-7": [
    {
      kind: "theory",
      body: `Bir **blanket impl** (battaniye implementasyonu), bir bound'u sağlayan her tip için trait'i tek blokta implement eder:

\`\`\`rust
impl<T: Display> Loggable for T {
    fn log_line(&self) -> String {
        format!("[log] {}", self)
    }
}
\`\`\`

Artık hem \`42.log_line()\` hem \`"rpc down".log_line()\` çalışır; \`Display\` implement eden, birinin gelecekte yazacağı her tip de öyle.

Standart kütüphane bunu yoğun kullanır. \`ToString\`, \`Display\` üzerinde bir blanket impl'dir; \`Into<U>\`, \`From<T>\` üzerinde. \`From\` implement etmenin sana \`Into\`'yu bedavaya vermesinin ve \`Into\`'yu asla elle implement etmemen gerekmesinin sebebi bu.`,
    },
    {
      kind: "theory",
      body: `**Orphan rule** (öksüz kuralı) sınırdır: bir trait'i bir tip için yalnızca trait sana aitse ya da tip sana aitse implement edebilirsin. İkisinin de yabancı olması yasaktır.

\`\`\`rust
impl Display for Vec<u8> { ... }   // yasak: ikisi de std'nin
\`\`\`

Sebep coherence (tutarlılık). İki crate o impl'i ayrı ayrı ekleyebilseydi, bir bağımlılık eklemek hangisinin geçerli olduğunu değiştirebilir — ya da programı belirsiz kılıp iki crate'in de içinde olmayan sebeplerle derlenmesini durdurabilirdi.

Çözüm newtype: \`struct Bytes(Vec<u8>);\` *senin* tipindir, dolayısıyla ona istediğin her şeyi implement edebilirsin. Runtime'da hiçbir maliyeti yoktur — tek alanlı bir tuple struct, alanıyla birebir aynı bellek yerleşimine sahiptir.`,
    },
    {
      kind: "quiz",
      question:
        "Kendi crate'inde neden `impl Display for Vec<u8>` yazamazsın?",
      options: [
        "Orphan rule: hem trait hem tip yabancı, dolayısıyla iki crate çakışan impl'ler ekleyebilirdi",
        "`Vec<u8>` standart kütüphanede zaten `Display` implement ediyor",
        "`std` içindeki blanket impl'ler her tipi önceden sahiplenir",
      ],
      answer: 0,
      explain:
        "Coherence global bir özelliktir. Kural olmasa programının derlenip derlenmeyeceği hiç adını anmadığın geçişli bir bağımlılığa bağlı olabilirdi.",
    },
    {
      kind: "fill",
      prompt:
        "Trait'ini, zaten görüntülenebilen her tip için implement et.",
      file: "main.rs",
      before: "impl<T: Display> Loggable for ",
      after: " {",
      choices: ["T", "dyn Display", "Self"],
      answer: 0,
      explain:
        "Impl generic'lerinde bound ile birlikte `for T`, blanket biçimidir. `for dyn Display` yalnızca trait object'i kapsardı, somut tipleri değil.",
    },
    {
      kind: "quiz",
      question:
        "Başka bir crate'ten gelen bir tipte `serde::Serialize`'a ihtiyacın var. Standart hamle nedir?",
      options: [
        "Onu sana ait bir newtype içine sar ve trait'i onun için implement et",
        "Diğer crate'i fork'la ve impl'i oraya ekle",
        "Yine de implement et — orphan rule yalnızca `std` için geçerli",
      ],
      answer: 0,
      explain:
        "Newtype runtime'da bedavadır ve kapsamı yereldir. (Serde tam bu durum için `#[serde(remote)]` de sunar; newtype biçimindeki kodu senin yerine üretir.)",
    },
    {
      kind: "editor",
      intro: `### Tek impl, her Display tipi

1. \`trait Loggable { fn log_line(&self) -> String; }\` tanımla.
2. \`"[log] <value>"\` döndüren bir blanket \`impl<T: Display> Loggable for T\` yaz.
3. \`42\` tam sayısı ve \`"rpc down"\` string'i üzerinde \`.log_line()\` çağır — iki tip, sıfır ekstra impl.

Beklenen çıktı:

\`\`\`text
[log] 42
[log] rpc down
\`\`\``,
    },
  ],
};
