import type { LessonStep } from "@/content/steps";

// TR · Ownership, Moves & Drops.
//
// Overlay for ../../steps/rust-ownership-deep.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustOwnershipDeepStepsTr: Record<string, LessonStep[]> = {
  "rust-ownership-deep-1": [
    {
      kind: "theory",
      body: `Rust'ta her değerin tam olarak bir sahibi (owner) vardır ve byte'larının gerçekte nerede yaşayacağına tipi karar verir.

Bir \`i32\` 4 byte'tır ve onu tutan fonksiyonun stack frame'inde bütünüyle yaşar. \`String\` farklıdır: *handle* stack'te durur ve her zaman aynı boyuttadır; karakterlerse heap'te yaşar.

O handle üç kelimeden oluşur — bir pointer, bir uzunluk ve bir kapasite:

\`\`\`rust
let name = String::from("stellar");
// stack:  [ ptr | len: 7 | cap: 7 ]   = 64-bit hedefte 24 byte
// heap:   s t e l l a r               = 7 byte
\`\`\``,
    },
    {
      kind: "theory",
      body: `Ownership'in (sahiplik) var olmasının tüm sebebi bu ayrımdır.

4 byte'lık bir \`i32\`'yi kopyalamak bedavadır, Rust da öylece kopyalar. Bir \`String\`'i kopyalamaksa ya heap'teki allocation'ı çoğaltmak (pahalı, üstelik sessizce) ya da iki handle'ın aynı allocation'ı göstermesi (o da iki kez free eder) demektir.

Rust ikisini de reddeder. Onun yerine handle'ı devreder — "move" (taşıma) dediğimiz şey tam olarak bu devirdir. Heap'te hiçbir şeye dokunulmaz.

\`std::mem::size_of::<T>()\` bir tipin **stack** boyutunu raporlar; arkasındaki heap payload'ını asla. Bu ayrımı şimdiden içselleştirmeye değer: mülakatlarda insanların en çok yanlış yaptığı şey budur.`,
    },
    {
      kind: "quiz",
      question:
        "`size_of::<String>()` 64-bit hedefte 24 döndürür; string ister 3 karakter tutsun ister 3 milyon. Neden?",
      options: [
        "Stack'teki handle'ı ölçer — pointer, uzunluk ve kapasite — işaret ettiği heap buffer'ını değil",
        "Rust her String'i 24 byte'ta sınırlar ve kalanı bir yan tabloya taşırır",
        "24, allocator'ın dağıttığı ilk cache line'ın boyutudur",
      ],
      answer: 0,
      explain:
        "`size_of` bir compile-time sabitidir, dolayısıyla yalnızca derleyicinin bildiğini tarif edebilir: sabit stack layout'unu. Heap uzunluğu bir runtime değeridir — o da `.len()`.",
    },
    {
      kind: "fill",
      prompt:
        "String verisinin heap'te kapladığı byte sayısını yazdır — handle'ınkini değil.",
      file: "main.rs",
      before: 'let name = String::from("stellar");\nprintln!("heap bytes: {}", name.',
      after: ");",
      choices: ["len()", "capacity()", "size_of()"],
      answer: 0,
      explain:
        "`len()` gerçekten kullanımda olan byte'lardır. `capacity()` ayrılmış byte'lardır ve bir büyümeden sonra daha fazla olabilir — gerçek bir ayrım, ama burada sorulan o değil.",
    },
    {
      kind: "quiz",
      question:
        "Bir fonksiyon `data: Vec<u8>` parametresini değer olarak alıyor ve sıcak bir döngüde çağrılıyor. Her çağrıda ne kopyalanır?",
      options: [
        "24 byte — vektörün handle'ı. Heap buffer'ına dokunulmaz, yalnızca yeniden işaret edilir",
        "Buffer'ın tamamı; bir döngüde değer olarak geçirmenin pahalı olmasının sebebi budur",
        "Hiçbir şey — Rust perde arkasında her argümanı referansla geçirir",
      ],
      answer: 0,
      explain:
        "Move ucuzdur: handle'ın memcpy'ıdır. İnsanların `değer olarak` geçirmekten korktuğu maliyet devir değil, çağrılan fonksiyonun sonundaki *drop*'tur.",
    },
    {
      kind: "editor",
      intro: `### Ayrımı ölç

Bir \`i32\`'nin stack boyutunu, bir \`String\`'in stack boyutunu ve belirli bir string'in tuttuğu heap byte'larını yazdır.

Beklenen çıktı:

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

İlk ikisi için \`std::mem::size_of\`, üçüncüsü için \`.len()\` kullan.`,
    },
  ],

  "rust-ownership-deep-2": [
    {
      kind: "theory",
      body: `Atama iki şeyden birini yapar ve hangisini yapacağına tip karar verir.

Tip \`Copy\` implemente ediyorsa bit'ler çoğaltılır ve iki binding de kullanılabilir kalır. Etmiyorsa ownership **move** edilir ve kaynak binding ölür — sonradan kullanmak bir çalışma zamanı sürprizi değil, derleme hatasıdır.

\`\`\`rust
let x = 10;
let y = x;
println!("{x}");        // sorun yok — i32 Copy'dir

let s1 = String::from("hi");
let s2 = s1;
println!("{s1}");       // error: borrow of moved value: \`s1\`
\`\`\``,
    },
    {
      kind: "theory",
      body: `Hangi tiplerin \`Copy\` olduğunu belirleyen kural keyfi değildir: **bir tip ancak her alanı \`Copy\` ise \`Copy\` olabilir ve \`Drop\` implemente etmemelidir.**

Bu, tam olarak bit'leri çoğaltmanın yanlış olacağı tipleri dışarıda bırakır. \`String\`, \`Vec<T>\` ve \`Box<T>\` hepsi bir heap allocation'ına sahiptir ve hepsi \`Drop\` implemente eder — iki kopya, iki free demek olurdu.

\`Clone\` aynı şeyin açık (explicit) opt-in'idir: \`s1.clone()\`, \`=\`'in sessizce yapmayı reddettiği derin kopyayı yapar. Bu uzunluk bilinçli bir tercih. Bir allocation kaynak kodda görünür olmalı.`,
    },
    {
      kind: "quiz",
      question:
        "`Drop` implemente eden bir tip neden asla `Copy` de implemente edemez?",
      options: [
        "Bit'leri kopyalamak aynı kaynağın iki sahibini üretir ve `drop` o kaynak üzerinde iki kez çalışırdı",
        "`Drop` ve `Copy` ikisi de `clone` adında bir metot tanımlar, o yüzden çakışırlar",
        "Edebilir — standart kütüphane `String` için bunu yapmamayı tercih ediyor, o kadar",
      ],
      answer: 0,
      explain:
        "Bu bir konvansiyon değil, katı bir derleyici kuralı. `Copy` 'bit'leri çoğaltmak eksiksiz bir kopya üretir' der; `Drop` ise 'bu bit'ler yalnızca bir kez serbest bırakılması gereken bir şeye sahip' der. İki iddia birbiriyle çelişir.",
    },
    {
      kind: "fill",
      prompt:
        "İkinci, bağımsız bir string ürettikten sonra `s1` kullanılabilir kalsın.",
      file: "main.rs",
      before: 'let s1 = String::from("ledger");\nlet s2 = s1.',
      after: ';\nprintln!("{s1} {s2}");',
      choices: ["clone()", "as_str()", "to_owned().as_str()"],
      answer: 0,
      explain:
        "`clone()` ikinci bir buffer ayırır, böylece iki handle da kendi verisine sahip olur. `as_str()` onun yerine borrow ederdi — o da geçerli Rust, ama sana ikinci bir `String` vermez.",
    },
    {
      kind: "quiz",
      question:
        "`let t = (1i32, String::from(\"a\")); let u = t;` — sonrasında `t`'nin durumu nedir?",
      options: [
        "Tamamen move edilmiş. Bir tuple ancak her elemanı `Copy` ise `Copy`'dir ve `String` değildir",
        "Kısmen move edilmiş: `i32` `Copy` olduğu için `t.0` hâlâ okunabilir",
        "Dokunulmamış — tuple'lar her zaman eleman eleman kopyalanır",
      ],
      answer: 0,
      explain:
        "Tuple'ın tamamını atamak tuple'ın tamamını move eder. Alan alan kısmi move mümkündür, ama yalnızca alanı adıyla andığında — o da bir sonraki ders.",
    },
    {
      kind: "editor",
      intro: `### Move, copy, clone

Üç davranışı da tek programda göster:

1. \`10\`'u \`a\`'ya, sonra \`a\`'yı \`b\`'ye bağla ve ikisini de yazdır — bu bir copy.
2. \`ledger\` tutan bir \`String\` oluştur, \`clone()\` et ve ikisini de yazdır.
3. Klonu üçüncü bir binding'e move et ve onu yazdır.

Beklenen çıktı:

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\``,
    },
  ],

  "rust-ownership-deep-3": [
    {
      kind: "theory",
      body: `Ownership yalnızca değer başına değil, **alan başına** takip edilir.

Bir struct'tan tek bir alanı move etmek struct'ı kısmen move edilmiş bırakır: aldığın alan ölüdür, diğer her alan hâlâ okunabilir.

\`\`\`rust
struct Account { id: String, balance: i64 }

let acct = Account { id: String::from("GA7Q"), balance: 250 };
let id = acct.id;              // yalnızca bu alanı dışarı move eder
println!("{}", acct.balance);  // sorun yok
println!("{}", acct.id);       // error: value moved
println!("{:?}", acct);        // error: \`acct\` artık bütün değil
\`\`\``,
    },
    {
      kind: "theory",
      body: `Buna güvenmeden önce bilmen gereken iki sınır var.

**Kısmen move edilmiş bir değer bütün olarak kullanılamaz.** Kalan alanları okuyabilirsin, ama \`acct\`'i bir fonksiyona geçiremez, döndüremez ya da yeniden move edemezsin.

**\`Drop\` implemente eden bir tip hiç kısmen move edilemez.** \`drop\`'u değerin tamamı üzerinde çalışacaktır, o yüzden derleyici içinde bir delik olmasına izin veremez. Böyle bir tipten bir alan almak istiyorsan ya \`clone()\` et ya da yerine varsayılan değeri koyup orijinali sana veren \`std::mem::take\`'i kullan.`,
    },
    {
      kind: "quiz",
      question:
        "`let id = acct.id;` derleniyor, ama `#[derive(Debug)]` ekleyip ardından `println!(\"{acct:?}\")` yazınca derlenmiyor. Neden?",
      options: [
        "`Debug` biçimlendirmesi struct'ın tamamını okur ve bir alan artık geçerli bir değer tutmuyor",
        "`derive(Debug)` uygulandığı struct'ın ownership'ini alır",
        "Kısmi move'lara yalnızca hiçbir şey derive etmeyen struct'larda izin verilir",
      ],
      answer: 0,
      explain:
        "Struct yok olmadı — içinde bir delik var. Tamamına ihtiyaç duyan her şey (Debug, başka yere geçirmek, döndürmek) reddedilir; bozulmamış bir alanı okumak reddedilmez.",
    },
    {
      kind: "fill",
      prompt:
        "`Session` `Drop` implemente ediyor, dolayısıyla içinden bir alan move edilemez. Token'ı al ve geride boş bir `String` bırak.",
      file: "main.rs",
      before: "let token = std::mem::",
      after: "(&mut session.token);",
      choices: ["take", "drop", "swap"],
      answer: 0,
      explain:
        "`take` alanı `Default::default()` ile değiştirir ve orijinali döndürür — değer bütün kalır, böylece `Drop`'un üzerinde çalışacağı geçerli bir şey hâlâ vardır. `swap` de iş görür, ama yerine konacak değeri kendin sağlaman gerekir.",
    },
    {
      kind: "quiz",
      question:
        "Sonrasında başka bir fonksiyona da geçirmen gereken bir struct'tan tek bir `String` alanına ihtiyacın var. Doğru olan hangisi?",
      options: [
        "Alanı `clone()` et ya da geride boş bir değer bırakmak kabul edilebilirse `mem::take` et",
        "Alanı dışarı move et ve struct'ı geçir — derleyici deliği yamar",
        "Struct'ı önce `Box`'a sar; box'lamak kısmi move'ları yeniden bütün yapar",
      ],
      answer: 0,
      explain:
        "Bu gerçek bir takas: `clone` bir allocation'a mal olur ve orijinali bozmadan korur, `mem::take` bedavadır ama kaynağı değiştirir. İkisi de her zaman doğru değildir.",
    },
    {
      kind: "editor",
      intro: `### Bir alanı al, gerisini koru

\`struct Account { id: String, balance: i64 }\` tanımla ve id'si \`GA7Q\`, balance'ı \`250\` olan bir tane oluştur.

**Yalnızca** \`id\` alanını kendi binding'ine move et, sonra id'yi ve struct'ta hâlâ duran balance'ı yazdır.

Beklenen çıktı:

\`\`\`text
id: GA7Q
balance: 250
\`\`\``,
    },
  ],

  "rust-ownership-deep-4": [
    {
      kind: "theory",
      body: `Borrow checker tek bir kuralı uygular: herhangi bir anda bir değerin **ya** istediğin kadar paylaşımlı referansı \`&T\` vardır, **ya da** tam olarak bir tane özel (exclusive) referansı \`&mut T\`. Asla ikisi birden değil.

İnsanları tökezleten kısım *herhangi bir anda* ifadesi. Bir borrow (ödünç alma) bloğun sonuna kadar değil, **son kullanımına** kadar sürer. Buna NLL — non-lexical lifetimes — denir ve anlamı şu: çoğu aliasing hatası clone'layarak değil, bir satırı taşıyarak düzelir.

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = &v[0];      // paylaşımlı borrow başlar
println!("{first}");    // ...ve burada, son kullanımında biter
v.push(4);              // sorun yok — artık v'yi borrow eden kimse yok
\`\`\``,
    },
    {
      kind: "theory",
      body: `Yeniden sıralama yalnızca borrow'un *sonucunun* mutasyondan uzun yaşaması gerekmediğinde işe yarar. Gerektiğinde, değeri önce borrow'un dışına çıkar:

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = v[0];       // i32 Copy'dir — bu okur ve borrow'u bitirir
v.push(4);
println!("{first}");    // sorun yok: \`first\` kendi 4 byte'ına sahip
\`\`\`

\`Copy\` olmayan bir eleman için aynı hamle mevcuttur — \`.clone()\`, ya da \`.len()\` veya \`.iter().sum()\` gibi bir özet hesaplamak — ve bu bir refleks değil, bilinçli bir seçim olmalı. Derleyici şikâyet eder etmez \`clone()\`'a uzanmak, sıcak bir yolun her iterasyonda sessizce bir allocation kazanmasının yoludur.`,
    },
    {
      kind: "quiz",
      question:
        "`let n = &v[0]; v.push(4); println!(\"{n}\");` neden başarısız oluyor da `println!`'i `push`'un üstüne taşıyınca derleniyor?",
      options: [
        "`push` buffer'ı yeniden ayırabilir, dolayısıyla referans dangling kalabilir — ve borrow hâlâ canlı çünkü sonrasında kullanılıyor",
        "`push`, fonksiyon gövdesinin tamamı boyunca vektörün hiçbir noktada referansı olmamasını gerektirir",
        "`println!` makrosu argümanlarını değer olarak yakalar, bu da bir borrow'dan dışarı move eder",
      ],
      answer: 0,
      explain:
        "İki yarı da önemli: `push`'un `&mut`'a ihtiyacı var ve paylaşımlı borrow hâlâ hayatta çünkü sonraki bir satır onu kullanıyor. O satırı yukarı taşı, borrow `push`'tan önce biter — NLL'in sana kazandırdığı tam olarak bu.",
    },
    {
      kind: "fill",
      prompt:
        "Satırın ötesinde bir borrow tutmadan vektör üzerinden bir toplam hesapla.",
      file: "main.rs",
      before: "let total: i32 = ledger.iter().",
      after: ";\nledger.push(total);",
      choices: ["sum()", "collect()", "count()"],
      answer: 0,
      explain:
        "`sum()` iterator'ı tüketir ve sahipli bir `i32` döndürür, dolayısıyla `ledger`'ın borrow'u ifadenin sonunda bitmiştir — `push` artık `&mut` almakta serbesttir.",
    },
    {
      kind: "quiz",
      question:
        "Sıcak bir döngüde bir borrow checker hatası için bunlardan hangisi *en kötü* alışkanlık haline gelmiş çözümdür?",
      options: [
        "Borrow edilen değeri clone'lamak, çünkü bir derleme hatasını sessizce iterasyon başına bir allocation'a dönüştürür",
        "Borrow'un kapsamını daraltmak, böylece mutasyondan önce bitmesini sağlamak",
        "Mutasyondan önce veriden `Copy` bir özet çıkarmak",
      ],
      answer: 0,
      explain:
        "`clone()` yasak değil — bazen gerçekten doğru çağrıdır. Hata modu onu *refleks olarak* kullanmaktır; bu, kodu doğru ya da hızlı yapmadan derleyicinin şikâyetini susturur.",
    },
    {
      kind: "editor",
      intro: `### Mutasyondan önce borrow'u bitir

\`let mut ledger = vec![10, 20, 30];\` verildiğinde:

1. Bir iterator kullanarak girdileri \`total\`'a topla.
2. \`total\`'ı \`ledger\`'a push et.
3. Vektörü, sonra toplamı yazdır.

Beklenen çıktı:

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\``,
    },
  ],

  "rust-ownership-deep-5": [
    {
      kind: "theory",
      body: `İki coercion (örtük dönüşüm) o kadar sık çalışır ki görünmez olur — sonra da ilk kez tetiklenmediklerinde kafa karıştırır.

**Deref coercion.** \`&String\` \`&str\`'ye, \`&Vec<T>\` \`&[T]\`'ye, \`&Box<T>\` \`&T\`'ye dönüşür. Hedef tip uyuşmuyor ama bir \`Deref\` impl'i aradaki köprüyü kuruyorsa derleyici çağrı noktasına dönüşümü kendisi ekler.

\`\`\`rust
fn describe(s: &str) -> usize { s.len() }

let owned = String::from("soroban");
describe(&owned);   // &String, &str'ye coerce edildi — allocation yok, kopya yok
\`\`\`

Parametrede \`&str\`, struct alanında \`String\` almanın sebebi budur: parametre ikisini de kabul eder, alan kendi verisine sahip olur.`,
    },
    {
      kind: "theory",
      body: `**Reborrowing (yeniden ödünç alma).** \`&mut T\` \`Copy\` değildir — her zaman yalnızca bir tane olabilir. Dolayısıyla onu bir fonksiyona geçirmek onu move edip binding'ini ölü bırakmalıydı. Bırakmaz:

\`\`\`rust
let mut seq = 41;
let handle = &mut seq;
bump(handle);           // örtük reborrow: &mut *handle
bump(&mut *handle);     // aynı şey, açıkça yazılmış
\`\`\`

Derleyici sessizce \`&mut *handle\` geçirir — seninkinden türetilmiş *yeni*, daha kısa bir borrow. Çağrılan fonksiyon döndüğünde sona erer ve senin handle'ın yeniden canlıdır. Bu olmasaydı her \`&mut\` tek kullanımlık olurdu ve dil çekilmez hale gelirdi.

Yaygın bir durumda reborrow'u kendin yazman gerekir: bir \`&mut\`'ı bir struct'ta saklarken ya da döndürürken — derleyicinin, kastettiğin daha kısa lifetime'ı çıkaramadığı yerde.`,
    },
    {
      kind: "quiz",
      question:
        "`fn bump(n: &mut i64)` aynı `&mut` binding'iyle art arda iki kez çağrılıyor ve derleniyor. İlk çağrı neden bir move değil?",
      options: [
        "Derleyici örtük bir reborrow ekler, `&mut *handle`, ve bu çağrı döndüğünde sona erer",
        "`i64` `Copy` olduğu için `&mut i64` de `Copy`'dir",
        "Fonksiyon argümanları her zaman referansla geçirilir, dolayısıyla hiçbir şey move edilmez",
      ],
      answer: 0,
      explain:
        "Reborrowing, özel referansların birden fazla kez kullanılabilmesini sağlayan mekanizmadır. `&mut T`, `T` ne olursa olsun asla `Copy` değildir.",
    },
    {
      kind: "fill",
      prompt:
        "Reborrow'u açıkça yaz; ikinci çağrı kendi kısa ömürlü özel borrow'unu alsın.",
      file: "main.rs",
      before: "bump(",
      after: "handle);",
      choices: ["&mut *", "&", "*"],
      answer: 0,
      explain:
        "`&mut *handle` değere ulaşmak için dereference eder, sonra onun taze bir özel borrow'unu alır. `&handle` ise *referansın kendisinin* paylaşımlı bir borrow'u olurdu — farklı bir tip.",
    },
    {
      kind: "quiz",
      question:
        "Herkese açık bir fonksiyon `name: String` alıyor ve üzerinde yalnızca `.len()` çağırıyor. İmza ne olmalı?",
      options: [
        "`&str` — deref coercion ile `&String`'i, doğrudan da `&'static str`'yi kabul eder ve çağırana hiçbir allocation dayatmaz",
        "`String`, böylece fonksiyon verisine sahip olur ve çağırandan etkilenemez",
        "`&String`, en kesin tip olduğu için en hızlısı da odur",
      ],
      answer: 0,
      explain:
        "`&String`, `&str`'den kesinlikle daha kötüdür: daha azını kabul eder (bir literal *yukarı* coerce edilmez) ve karşılığında hiçbir şey kazandırmaz. `String`'i yalnızca gerçekten saklaman ya da tüketmen gerektiğinde al.",
    },
    {
      kind: "editor",
      intro: `### İki coercion tek programda

1. String'in uzunluğunu döndüren \`fn describe(s: &str) -> usize\` yaz ve \`soroban\` tutan bir \`&String\` ile çağır.
2. 1 ekleyen \`fn bump(n: &mut i64)\` yaz.
3. \`let mut seq = 41;\` bağla, \`let handle = &mut seq;\` al, sonra \`bump\`'ı iki kez çağır — bir kez \`handle\` geçirerek, bir kez açık bir \`&mut *handle\` geçirerek.
4. \`seq\`'in son değerini yazdır.

Beklenen çıktı:

\`\`\`text
len: 7
seq: 43
\`\`\``,
    },
  ],

  "rust-ownership-deep-6": [
    {
      kind: "theory",
      body: `Bir değer kapsam dışına çıktığında Rust onun \`Drop\` impl'ini çalıştırır — \`finally\` yok, \`defer\` yok, unutabileceğin bir \`close()\` yok. RAII budur: **kaynağı edinmek değeri kurmaktır, serbest bırakmak da değerin sona ermesidir.**

\`\`\`rust
struct Guard(&'static str);

impl Drop for Guard {
    fn drop(&mut self) {
        println!("release {}", self.0);
    }
}
\`\`\`

\`drop\`'u asla kendin çağırmazsın. \`std::mem::drop(value)\` vardır, ama tek yaptığı ownership'i alıp değerin erkenden kapsam dışına düşmesine izin vermektir.`,
    },
    {
      kind: "theory",
      body: `Sıra kesindir ve ezberlemeye değer, çünkü lock guard'ları ve bağlantı pool'larını güvenli kılan şey budur:

**Bir kapsamdaki değişkenler ters bildirim sırasıyla drop edilir.** Son bildirilen ilk serbest bırakılır — stack, kurulduğu gibi çözülür. Struct *alanları* ise bildirim sırasıyla drop edilir.

\`\`\`rust
let _outer = Guard("outer");
{
    let _inner = Guard("inner");
}   // "release inner" burada
    // "release outer" main'in sonunda
\`\`\`

\`MutexGuard\`'ın unlock çağrısına ihtiyaç duymamasının ve kritik bir bölümü \`{ }\` bloğuna almanın bir üslup tercihi değil gerçek bir teknik olmasının sebebi budur: kapanan süslü parantez, unlock'un *ta kendisidir*.`,
    },
    {
      kind: "quiz",
      question:
        "Üç guard `a`, `b`, `c` tek kapsamda bu sırayla bildiriliyor. Ne yazdırılır?",
      options: [
        "c, sonra b, sonra a — ters bildirim sırası",
        "a, sonra b, sonra c — struct alanları gibi bildirim sırası",
        "Sıra belirsizdir ve derleyici sürümleri arasında değişebilir",
      ],
      answer: 0,
      explain:
        "Yerel değişkenler için ters sıra, struct alanları için düz sıra. Bu asimetri bilinçli: sonra bildirilen bir yerel, öncekinden borrow ediyor olabilir, dolayısıyla önce o ölmeli.",
    },
    {
      kind: "fill",
      prompt:
        "Bir lock guard'ı fonksiyonun sonunu beklemeden erkenden serbest bırak.",
      file: "main.rs",
      before: "let guard = lock.acquire();\n",
      after: "(guard);\nlong_running_work();",
      choices: ["drop", "guard.close", "std::mem::forget"],
      answer: 0,
      explain:
        "`drop` değeri ownership'iyle alır ve orada sonlandırır. `mem::forget` tam tersini yapar — değeri bilerek sızdırır ve lock asla serbest bırakılmaz.",
    },
    {
      kind: "quiz",
      question:
        "Tek thread'li test koşularında bile, yavaş bir çağrı boyunca bir `MutexGuard` tutmak neden sorundur?",
      options: [
        "Guard kapsamının sonuna kadar yaşar, dolayısıyla lock çağrının tamamı boyunca tutulur — diğer her thread arkasında bloklanır",
        "Stack'te bir fonksiyon çağrısı varken `Drop` çalışamaz, dolayısıyla guard sızar",
        "Sorun değildir; derleyici lock'u guard'ın son kullanımında serbest bırakır",
      ],
      answer: 0,
      explain:
        "Tuzak tam olarak bu: NLL *borrow'ları* son kullanımda bitirir, ama `Drop` *kapsamın* sonunda çalışır. Okumayı bıraktığın bir guard lock'u hâlâ tutuyordur. Bir blokla bilinçli olarak kapsamla.",
    },
    {
      kind: "editor",
      intro: `### Sırayı kanıtla

\`release <name>\` yazdıran bir \`Drop\` impl'ine sahip \`struct Guard(&'static str)\` tanımla.

\`main\` içinde \`outer\` adlı bir guard oluştur, sonra \`inner\` adlı bir guard ve bir \`println!("inside")\` içeren bir iç blok aç. Bloktan sonra \`outside\` yazdır.

Beklenen çıktı:

\`\`\`text
inside
release inner
outside
release outer
\`\`\``,
    },
  ],
};
