import type { LessonStep } from "@/content/steps";

// TR · Smart Pointers & Interior Mutability.
//
// Overlay for ../../steps/rust-smart-pointers.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustSmartPointersStepsTr: Record<string, LessonStep[]> = {
  "rust-smart-pointers-1": [
    {
      kind: "theory",
      body: `\`Box<T>\` en basit smart pointer'dır (akıllı işaretçi): bir heap allocation'ı, tek bir sahip, box drop edildiğinde serbest bırakılır. Ne reference count (referans sayacı) ekler ne de runtime kontrolü.

Onu tanımlayan kullanım, **recursive bir tipe bilinen bir boyut** kazandırmaktır:

\`\`\`rust
enum Expr {
    Num(i64),
    Add(Expr, Expr),        // hata: recursive type has infinite size
}
\`\`\`

\`Expr\`'i belleğe yerleştirmek için derleyicinin \`Expr\`'in ne kadar büyük olduğunu bilmesi gerekir — bunun için de \`Expr\`'in ne kadar büyük olduğunu bilmesi gerekir. Box bu döngüyü kırar: neyi gösterirse göstersin, her zaman tek bir pointer genişliğindedir.`,
    },
    {
      kind: "theory",
      body: `\`\`\`rust
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),   // sorun yok — iki pointer
}
\`\`\`

Rust'ta her ağaç, liste ve AST böyle kurulur; \`Box<dyn Trait>\`'in yaptığı da aynı şeydir: \`dyn Trait\`'in bilinen bir boyutu yoktur, dolayısıyla bir pointer'ın arkasında yaşar.

Bir box üzerinden match yapmak özel bir şey gerektirmez — \`match e { Expr::Add(a, b) => ... }\` sana \`&Box<Expr>\` verir ve deref coercion sayesinde onu doğrudan \`&Expr\` alan bir fonksiyona geçirebilirsin.

Maliyeti, düğüm başına bir allocation ve traversal adımı başına bir pointer atlaması. Bir AST için bu hiçbir şey değildir. Milyonlarca düğümlü sıcak bir veri yapısı içinse arena allocator'ların var olma sebebidir.`,
    },
    {
      kind: "quiz",
      question: "Recursive bir enum neden kendi tipinin etrafında bir `Box`'a ihtiyaç duyar?",
      options: [
        "Derleyici tip için sabit bir boyut hesaplamak zorundadır ve doğrudan iç içe geçmiş bir varyant bu boyutu sonsuz yapar",
        "Rust'ta recursion yalnızca heap'te ayrılmış verilerde serbesttir",
        "`Box` olmadan enum her match'te kopyalanırdı",
      ],
      answer: 0,
      explain:
        "Bir `Box`, neyi gösterirse göstersin tek bir pointer genişliğindedir; dolayısıyla boyut hesabı sonlanır. Heap allocation'ı bir sonuçtur, amaç değil.",
    },
    {
      kind: "fill",
      prompt: "Recursive varyantı temsil edilebilir hale getir.",
      file: "main.rs",
      before: "enum Expr {\n    Num(i64),\n    Add(",
      after: ", Box<Expr>),\n}",
      choices: ["Box<Expr>", "Expr", "&Expr"],
      answer: 0,
      explain:
        "`&Expr` de tek pointer genişliğinde olurdu ama borrow eder — enum'un bir lifetime parametresine ihtiyacı olurdu ve çocuklarına sahip olamazdı.",
    },
    {
      kind: "quiz",
      question:
        "Heap allocation'ı dışında `Box<T>`, doğrudan bir `T` tutmaya kıyasla ne ekler?",
      options: [
        "Hiçbir şey — reference count yok, runtime borrow kontrolü yok, her zamanki gibi tek sahiplik",
        "Paylaşımlı sahiplik, hafif bir `Rc` gibi",
        "Interior mutability, yani değer paylaşımlı bir referans üzerinden değiştirilebilir",
      ],
      answer: 0,
      explain:
        "`Box`, ek semantiği olmayan tek smart pointer'dır. Indirection'a ihtiyacın olup başka hiçbir şeye ihtiyacın olmadığında doğru varsayılan olmasının sebebi budur.",
    },
    {
      kind: "editor",
      intro: `### Bir ifade ağacı

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`.
2. Her iki varyantı match eden ve \`Add\` üzerinde recursion yapan \`fn eval(e: &Expr) -> i64\`.
3. \`main\`'de \`2 + (3 + 4)\`'ü ağaç olarak kur, hesaplanan değeri yazdır, ardından ağacı \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

\`Box\`'ın \`Debug\`'ının şeffaf olduğuna dikkat et — gösterdiği şeyi yazdırır.`,
    },
  ],

  "rust-smart-pointers-2": [
    {
      kind: "theory",
      body: `\`Rc<T>\`, tek bir thread için **reference count'lu paylaşımlı sahipliktir**. Her \`Rc::clone\` bir sayacı artırır; her drop onu azaltır. Sayaç sıfıra ulaştığında değer serbest bırakılır.

\`\`\`rust
let config = Rc::new(String::from("timeout=30s"));
let a = Rc::clone(&config);        // sayaç: 2
let b = Rc::clone(&config);        // sayaç: 3
drop(b);                           // sayaç: 2
\`\`\`

\`x.clone()\` yerine \`Rc::clone(&x)\` idiyomatik olandır ve sebebi okunabilirlik: çağrı noktasında bunun verinin derin bir kopyası değil, ucuz bir sayaç artışı olduğunu apaçık gösterir.`,
    },
    {
      kind: "theory",
      body: `\`Rc\`'nin doğru araç olup olmadığına iki özellik karar verir.

**Immutable'dır.** \`Rc<T>\` sana \`&T\` verir, başka hiçbir şey vermez. Her biri \`&mut T\` tutan birden fazla sahip aliasing kuralını bozardı; dolayısıyla mutasyon için onu \`RefCell\` ile eşlemek gerekir — bir sonraki ders.

**\`Send\` değildir.** Sayaç, atomik olmayan artışlara sahip düz bir tamsayıdır; aynı anda clone yapan iki thread onu bozardı. Derleyici bunu derleme zamanında reddeder — çok thread'li sürüm olan \`Arc\`'ın ayrı bir tip olarak var olmasının sebebi budur: atomik sayacın bedelini yalnızca gerçekten thread'ler arasında paylaştığında ödersin.

\`Rc\`'yi düğümlerin birden fazla ebeveyni olduğu bir graph ya da ağaç için, ya da tek thread'li birçok sahibin paylaştığı bir konfigürasyon için kullan. Ona düz borrow'ları denedikten *sonra* uzan — bir \`&T\` hiçbir şeye mal olmaz ve genellikle yeterlidir.`,
    },
    {
      kind: "quiz",
      question:
        "İkisi de aynı şeye derlenirken `Rc::clone(&x)` neden `x.clone()`'a tercih edilir?",
      options: [
        "Çağrı noktasında 'bu bir sayaç artışı' der, 'bu veriyi derin kopyalar' değil",
        "`x.clone()` iç değerin derin bir kopyasını çıkarır",
        "`x.clone()` reference count'u artırmaz",
      ],
      answer: 0,
      explain:
        "Tamamen bir okunabilirlik geleneği, ama değerli bir gelenek: büyük bir struct üzerinde `clone()` genellikle bir allocation demektir; ucuz durumu bir bakışta ayırt edebilmek fazladan birkaç karaktere değer.",
    },
    {
      kind: "fill",
      prompt: "Değeri şu anda kaç sahibin tuttuğunu oku.",
      file: "main.rs",
      before: 'println!("count: {}", Rc::',
      after: "(&config));",
      choices: ["strong_count", "len", "count"],
      answer: 0,
      explain:
        "`strong_count` sahip olan sayaçtır. Karşılığı `weak_count`, değeri hayatta tutmayan, sahip olmayan `Weak` handle'larını izler.",
    },
    {
      kind: "quiz",
      question: "`Rc<T>` neden bilinçli olarak `Send` değildir?",
      options: [
        "Sayacı atomik olmayan artışlar kullanır; aynı anda clone yapan iki thread onu bozardı",
        "Gösterdiği değer her zaman heap'te ayrılmıştır ve heap thread-local'dır",
        "`Send`'dir, ama yalnızca `T: Sync` olduğunda",
      ],
      answer: 0,
      explain:
        "Bu bir gözden kaçma değil, bilinçli bir ayrımdır: tek thread'li kod atomiklerin bedelini ödememeli. `Arc`, atomik sayaçlı aynı tiptir.",
    },
    {
      kind: "editor",
      intro: `### Sahipleri say

1. \`timeout=30s\` tutan bir \`String\`'i bir \`Rc\` içine sar ve \`Rc::strong_count\`'u yazdır.
2. \`Rc::clone\` ile iki clone yap, sayacı yeniden yazdır ve değeri onlardan biri üzerinden yazdır.
3. Bir clone'u \`drop\` et ve sayacı bir kez daha yazdır.

Beklenen çıktı:

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\``,
    },
  ],

  "rust-smart-pointers-3": [
    {
      kind: "theory",
      body: `\`RefCell<T>\`, borrow kontrolünü **derleme zamanından çalışma zamanına** taşır. Kural değişmez — birçok paylaşımlı borrow ya da tek bir exclusive borrow — ama artık runtime'da sayılır ve onu ihlal etmek derlenmemek yerine **panic** üretir.

\`\`\`rust
let cell = RefCell::new(Vec::new());
cell.borrow_mut().push("started");    // &mut, ifadenin sonunda serbest bırakılır
println!("{}", cell.borrow().len());  // & — sorun yok, mut borrow gitti
\`\`\`

Bu **interior mutability**'dir (iç değiştirilebilirlik): bir \`&self\` üzerinden mutasyon. \`Rc<RefCell<T>>\`'nin birden fazla sahibe yazma yetkisi verebilmesini sağlayan şey budur.`,
    },
    {
      kind: "theory",
      body: `Panic bedeldir ve gerçek bir bedeldir — derleyicinin doğrulayamadığı bir kalıp karşılığında bir çalışma zamanı çökmesi. İki alışkanlık bunu yönetilebilir tutar.

**Guard'ları kısa ömürlü tut.** \`cell.borrow_mut().push(x)\` ifadenin sonunda serbest bırakır. \`let g = cell.borrow_mut();\` scope'un sonuna kadar tutar ve aradaki her \`borrow()\` panic'ler. Bu, \`MutexGuard\`'daki \`Drop\`-NLL tuzağının aynısıdır.

**Bir çakışma olasıysa \`try_borrow_mut\` kullan.** Panic'lemek yerine bir \`Result\` döndürür; bu da bir çökmeyi bir karara dönüştürür.

\`\`\`rust
let held = log.borrow();
log.try_borrow_mut().is_ok()    // false — açıkta bir paylaşımlı borrow var
\`\`\`

\`Cell<T>\`, \`Copy\` tipler için daha ucuz kardeştir: borrow takibi olmayan ve panic ihtimali bulunmayan \`get\`/\`set\` — çünkü hiçbir zaman bir referans dağıtmaz.`,
    },
    {
      kind: "quiz",
      question:
        "`RefCell`, normal borrow kurallarına göre neyi değiştirir?",
      options: [
        "Kuralların kendisini değil — yalnızca *ne zaman* kontrol edildiklerini; kontrol derleme zamanından, bir ihlalin panic ürettiği çalışma zamanına taşınır",
        "Aynı anda birden fazla mutable borrow'a izin verir",
        "Değeri thread'ler arasında güvenle paylaşılabilir hale getirir",
      ],
      answer: 0,
      explain:
        "Son seçenek yaygın ve tehlikeli bir karışıklıktır: `RefCell` `!Sync`'tir, dolayısıyla thread'ler arasında hiç paylaşılamaz. `Mutex` onun çok thread'li karşılığıdır.",
    },
    {
      kind: "fill",
      prompt:
        "Zaten açıkta bir borrow varsa panic riskine girmeden exclusive bir borrow dene.",
      file: "main.rs",
      before: "log.",
      after: "().is_ok()",
      choices: ["try_borrow_mut", "borrow_mut", "get_mut"],
      answer: 0,
      explain:
        "`borrow_mut` çakışmada panic'ler. `get_mut` `&mut self` alır, yani `RefCell`'in kendisine exclusive erişim ister — bir `Rc` içinde otururken tam olarak sahip olmadığın şey.",
    },
    {
      kind: "quiz",
      question:
        "Bir servis aralıklı olarak 'already borrowed: BorrowMutError' ile panic'liyor. Olağan sebep nedir?",
      options: [
        "Bir `Ref` guard'ı, yeniden borrow eden bir çağrı boyunca tutuluyor — guard son kullanımına kadar değil, scope'un sonuna kadar yaşar",
        "İki thread `RefCell`'i aynı anda borrow ediyor",
        "`RefCell`, onu tutan `Rc`'den önce yaratılmış",
      ],
      answer: 0,
      explain:
        "Thread olamaz: `RefCell` `!Sync`'tir, derleyici bunu zaten engellemişti. Neredeyse her zaman niyetlenenden uzun tutulan bir guard'dır — onu bir blokla sınırla ya da değeri dışarı clone'la.",
    },
    {
      kind: "editor",
      intro: `### Runtime'da kontrol edilen borrow

1. Boş bir vektör tutan bir \`Rc<RefCell<Vec<String>>>\` kur.
2. \`Rc\`'nin bir **clone**'u üzerinden \`started\` ve ardından \`ready\` push et — her biri kendi ifadesi olsun ki guard her seferinde serbest bırakılsın.
3. Uzunluğu, ardından ilk girdiyi yazdır.
4. Bir binding'de paylaşımlı bir borrow tut, \`try_borrow_mut()\`'un başarılı olup olmadığını yazdır, sonra binding'i \`drop\` et ve yeniden yazdır.

Beklenen çıktı:

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\``,
    },
  ],

  "rust-smart-pointers-4": [
    {
      kind: "theory",
      body: `Reference counting'in klasik bir başarısızlığı vardır: **döngü** (cycle). A B'ye sahipse ve B de A'ya sahipse, iki sayaç da asla sıfıra ulaşmaz ve bellek asla serbest bırakılmaz. Rust bunu engellemez — bu bir sızıntıdır (leak), unsoundness değil; borrow checker'ın da bu konuda söyleyecek bir sözü yoktur.

Bunun ortaya çıktığı standart biçim, ebeveyn bağlantıları olan bir ağaçtır:

\`\`\`rust
root.children  ->  Rc<Node>   (strong)
leaf.parent    ->  Rc<Node>   (strong)  // döngü: hiçbir şey asla serbest bırakılmaz
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`Weak<T>\` onu kırar. Weak bir handle değere sahip **değildir** ve onu hayatta tutmaz:

\`\`\`rust
parent: RefCell<Weak<Node>>          // Rc::downgrade(&root)
children: RefCell<Vec<Rc<Node>>>     // strong, eskisi gibi
\`\`\`

Bir \`Weak\` çoktan serbest bırakılmış bir şeyi gösteriyor olabileceğinden, onun üzerinden doğrudan okuyamazsın. \`upgrade()\` bir \`Option<Rc<T>>\` döndürür — değer hâlâ hayattaysa \`Some\`, gittiyse \`None\`. Güvenliğin bütün hikâyesi o \`Option\`'dır.

Akılda tutulacak kural: **sahiplik aşağı iner, referanslar yukarı çıkar.** Ebeveynler çocuklarına strong olarak sahiptir; çocuklar geriye weak olarak işaret eder. Aynısı observer listeleri ve cache'ler için de geçerlidir — cache \`Weak\` tutar, böylece bir şeyi cache'lemek onu tek başına asla hayatta tutmaz.`,
    },
    {
      kind: "quiz",
      question:
        "`Weak::upgrade()` neden `Rc<T>` yerine `Option<Rc<T>>` döndürür?",
      options: [
        "Değer çoktan drop edilmiş olabilir — weak bir handle onu hayatta tutmaz, dolayısıyla gitmiş olabilir",
        "Strong sayaç maksimumdaysa upgrade başarısız olabilir",
        "Başka bir thread değeri tuttuğu sürece `None` döndürür",
      ],
      answer: 0,
      explain:
        "O `Option`, `Weak`'in bütün amacıdır: 'işaret ettiğim şey gitmiş olabilir' durumunu sarkan bir pointer yerine ele almak zorunda olduğun bir değere dönüştürür.",
    },
    {
      kind: "fill",
      prompt: "Ebeveyne geri dönen, sahip olmayan bir handle yarat.",
      file: "main.rs",
      before: "parent: RefCell::new(Rc::",
      after: "(&root)),",
      choices: ["downgrade", "clone", "new"],
      answer: 0,
      explain:
        "`Rc::downgrade` bir `Weak` üretir ve yalnızca weak sayacı artırır. `Rc::clone` strong sayacı artırır ve döngüyü yeniden kurardı.",
    },
    {
      kind: "quiz",
      question:
        "Bir cache `Rc<Entry>` tutuyor ve her kullanıcı işini bitirdikten sonra bile bellek sınırsızca büyüyor. Çözüm nedir?",
      options: [
        "Cache'te `Weak<Entry>` tut, böylece bir girdiyi cache'lemek onu tek başına hayatta tutmasın",
        "Cache üzerinde periyodik olarak `drop` çağır",
        "`Rc`'yi deterministik olarak serbest bırakan `Box` ile değiştir",
      ],
      answer: 0,
      explain:
        "Strong referanslar tutan bir cache, cache değildir; lookup tablosu olan bir sızıntıdır. `Weak`, girdilerin gerçek sahipleri işini bitirdiğinde ölmesine izin verir ve `upgrade()` bunun ne zaman olduğunu sana söyler.",
    },
    {
      kind: "editor",
      intro: `### Sahiplik aşağı, referanslar yukarı

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`.
2. Boş bir \`Weak::new()\` ebeveyniyle bir \`root\`, ardından ebeveyni \`Rc::downgrade(&root)\` olan bir \`leaf\` kur.
3. \`leaf\`'in bir clone'unu \`root\`'un çocuklarına push et.
4. \`root\`'un strong sayacını, ardından weak sayacını yazdır.
5. leaf'in ebeveynini \`upgrade()\` et ve ebeveynin adını, clone'lanmış bir \`String\`'e map'leyerek \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

Root'un strong sayacı 1'de kalır — döngünün oluşmaması tam olarak budur.`,
    },
  ],

  "rust-smart-pointers-5": [
    {
      kind: "theory",
      body: `\`Cow<'a, T>\` — clone on write (yazarken kopyala) — iki varyantlı bir enum'dur:

\`\`\`rust
enum Cow<'a, T> {
    Borrowed(&'a T),
    Owned(T::Owned),
}
\`\`\`

Bir fonksiyonun yaygın yolda borrow edilmiş veri döndürmesine ve yalnızca gerçekten bir şeyi değiştirmek zorunda kaldığında sahip olunan veri döndürmesine izin verir:

\`\`\`rust
fn sanitize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))   // allocate edildi: değiştirdik
    } else {
        Cow::Borrowed(input)                  // bedava: yapacak bir şey yok
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Çağıran hangi varyantı aldığını umursamaz — \`Cow<str>\`, \`&str\`'ye deref olur; dolayısıyla her iki durumda da bir string gibi okunur.

Kazanç, değiştiren yol nadir olduğunda ortaya çıkar. On ikisi boşluk içeren bir milyon tanımlayıcıyı temizlemek on iki allocation yapar; koşulsuz \`String\` döndürmek ise bir milyon.

En yaygın yuvası parsing sınırıdır: bir URL'yi percent-decode etmek, bir header'ı unescape etmek, bir config değerini normalize etmek. Girdi zaten düzgünse — ki genellikle öyledir — hiçbir şey kopyalanmaz.

İki küçük not. \`.into_owned()\`, saklaman gerektiğinde sahip olunan biçimi zorlar. Değiştiren yol yaygın olansa \`Cow\`'u bırak: neredeyse her zaman gerçekleşen bir allocation'dan kaçınmak için bir enum discriminant'ı ve bir branch bedeli ödüyorsun demektir.`,
    },
    {
      kind: "quiz",
      question: "`Cow` gerçekte ne zaman kazandırır?",
      options: [
        "Değiştiren yol nadir olduğunda; böylece çağrıların çoğu bir borrow döndürür ve hiç allocate etmez",
        "Her zaman — `String` döndürmekten kesinlikle daha ucuzdur",
        "Girdi büyük olduğunda, ne sıklıkla değiştirildiğinden bağımsız olarak",
      ],
      answer: 0,
      explain:
        "Her çağrı değiştiriyorsa `Cow` bir discriminant ve bir branch ekler, sonra yine de allocate eder. Yaygın durum üzerine bir bahistir ve kötü bir bahis biraz maliyet getirir.",
    },
    {
      kind: "fill",
      prompt: "Girdiyi allocate etmeden, dokunmadan döndür.",
      file: "main.rs",
      before: "        Cow::",
      after: "(input)",
      choices: ["Borrowed", "Owned", "From"],
      answer: 0,
      explain:
        "`Cow::Owned(input.to_string())` derlenir ve doğru olurdu — ve tam olarak bu tipin bedava tutmak için var olduğu yolda allocate ederdi.",
    },
    {
      kind: "quiz",
      question:
        "Bir çağıranın, `Cow` döndüren bir fonksiyonun sonucunu uzun ömürlü bir struct'ta saklaması gerekiyor. Ne olmalı?",
      options: [
        "`.into_owned()` çağır — borrow edilmiş varyant girdinin lifetime'ına bağlıdır ve saklanamaz",
        "Hiçbir şey; `Cow` yapısı gereği `'static`'tir",
        "Lifetime'ını uzatmak için onu bir `Rc` içine sar",
      ],
      answer: 0,
      explain:
        "Ertelenen allocation'ın nihayet ödendiği an budur ve burada ödemek doğrudur: değer artık kullanılıp atılmak yerine elde tutuluyor.",
    },
    {
      kind: "editor",
      intro: `### Yalnızca mecbur kaldığında allocate et

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — girdi bir boşluk içeriyorsa boşlukları \`_\` ile değiştirilmiş bir \`Cow::Owned\` döndür; aksi halde \`Cow::Borrowed\` döndür.
2. Onu \`"get_events"\` ve \`"get events now"\` ile çağır.
3. Her biri için değeri ve borrow edilmiş varyant olup olmadığını yazdır; bunun için önce kendi binding'inde hesaplanmış \`matches!(&value, Cow::Borrowed(_))\` kullan.

Beklenen çıktı:

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\``,
    },
  ],

  "rust-smart-pointers-6": [
    {
      kind: "theory",
      body: `\`Deref\`, bir smart pointer'ın sardığı şey gibi hissettirmesini sağlayan şeydir. Onu implement etmek sana aynı anda iki şey verir:

- \`*\` operatörü
- **deref coercion** — \`&T\` beklenen yerde \`&Wrapper<T>\` kabul edilir ve \`wrapper.method()\`, \`T\`'nin metodlarını bulur

\`\`\`rust
impl<T> Deref for Tracked<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.inner }
}
\`\`\`

\`Box\`, \`Rc\`, \`Arc\`, \`String\` (\`str\`'ye) ve \`Vec\` (\`[T]\`'ye) tam olarak böyle çalışır. Hiçbirinde derleyici sihri yoktur.`,
    },
    {
      kind: "theory",
      body: `Metod çözümlemesi **önce** tipin kendisinde arar, sonra \`Deref\`'i izleyerek dışarı doğru gider. Yani wrapper üzerindeki inherent bir metod, hedefteki aynı adlı bir metodu gölgeler — \`Rc\`'nin metodlar yerine associated fonksiyonlar (\`Rc::clone(&x)\`, \`Rc::strong_count(&x)\`) kullanmasının sebebi budur: \`T\` üzerindeki hiçbir şeyi gölgelememeleri gerekir.

Standart kütüphanenin rehberliği dar ve saygıyı hak ediyor: **\`Deref\`'i yalnızca smart pointer'lar için implement et.** Onu kalıtım taklit etmek için kullanmak — bir \`Animal\`'a deref olan bir \`Dog\` — şaşırtıcı bir metod çözümlemesi ve yanlış tipi işaret eden hata mesajları üretir.

\`DerefMut\`, \`&mut\` için aynı şeydir ve \`Deref\` gerektirir. \`deref\`'in gerçek bir metod çağrısı olduğuna dikkat et: egzersizin yaptığı gibi içine iş koymak, her örtük coercion'da çalışması demektir.`,
    },
    {
      kind: "quiz",
      question:
        "`Rc` neden `Rc::strong_count(&x)`'i bir metod yerine associated fonksiyon olarak sunar?",
      options: [
        "Bir metod, sarılan tipteki aynı adlı herhangi bir metodu gölgelerdi; çünkü wrapper'ın kendi metodları önce bulunur",
        "Associated fonksiyonlar metodlardan daha hızlıdır",
        "`Deref` implement eden tiplerde metod çağrılamaz",
      ],
      answer: 0,
      explain:
        "`Rc::clone(&x)` geleneğinin, okunabilirliğin üstüne bu ikinci gerekçesi de vardır: associated fonksiyon olarak `T::clone`'u asla kazara gölgeleyemez.",
    },
    {
      kind: "fill",
      prompt: "Bu wrapper'ın deref olduğu tipi adlandır.",
      file: "main.rs",
      before: "impl<T> Deref for Tracked<T> {\n    type ",
      after: " = T;",
      choices: ["Target", "Item", "Output"],
      answer: 0,
      explain:
        "`Target`, `Deref`'in associated tipidir. `Item` `Iterator`'a, `Output` ise `Add` gibi operatör trait'lerine aittir.",
    },
    {
      kind: "quiz",
      question:
        "Kalıtımı modellemek için `Deref` implement etmek neden anti-pattern sayılır?",
      options: [
        "Metod çözümlemesi sessizce hedefte arar; dolayısıyla çağrılar ve hata mesajları okuyucunun hiç adını anmadığı bir tipi işaret eder",
        "Standart kütüphane dışında bir derleme hatasıdır",
        "`Deref` yalnızca bir pointer tutan tipler için implement edilebilir",
      ],
      answer: 0,
      explain:
        "Kusursuz derlenir. Bedeli okunabilirliktir: bir okuyucu bir metodun hangi tipten geldiğini söyleyemez; bir şey bozulduğunda hata mesajı da söyleyemez.",
    },
    {
      kind: "editor",
      intro: `### Bir smart pointer kur

1. \`fn new(inner: T) -> Self\` ve \`fn reads(&self) -> u32\` ile \`struct Tracked<T> { inner: T, reads: Cell<u32> }\`.
2. \`&self.inner\`'ı döndürmeden önce \`reads\`'i artıran, \`type Target = T\` ile \`impl<T> Deref for Tracked<T>\`.
3. \`&mut self.inner\` döndüren \`impl<T> DerefMut for Tracked<T>\` (sayım yok).
4. \`main\`'de \`vec![1, 2, 3]\`'ü sar, coercion üzerinden \`.len()\`'i yazdır, \`DerefMut\` üzerinden \`push(4)\` yap, \`*v\`'yi \`{:?}\` ile yazdır, ardından okuma sayısını yazdır.

Beklenen çıktı:

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

İki okuma: \`.len()\` ve \`*v\`. \`push\`, \`deref_mut\` üzerinden geçer ve \`reads()\` inherent olduğundan asla coerce etmez.`,
    },
  ],
};
