import type { LessonStep } from "@/content/steps";

// TR · Lifetimes.
//
// Overlay for ../../steps/rust-lifetimes.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustLifetimesStepsTr: Record<string, LessonStep[]> = {
  "rust-lifetimes-1": [
    {
      kind: "theory",
      body: `Bir lifetime (yaşam süresi) annotation'ı hiçbir şeyi daha uzun yaşatmaz. O, **çağıranın sağlamak zorunda olduğu bir kısıttır** ve derleyici bunu her call site'ta denetler.

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Bunu fonksiyon hakkında değil, çağıran hakkında bir cümle gibi oku: *"bana iki referans ver, ben de sana ikisi de geçerli olduğu sürece geçerli kalan bir referans geri vereyim."*

Hiçbir şey allocate edilmez. Hiçbir şey uzatılmaz. \`'a\`, dönüş değerinin bir argümana bağlanabilmesi için uydurulmuş, koddaki bir bölgenin adıdır.`,
    },
    {
      kind: "theory",
      body: `Yaygın yanlış okuma, iki parametrede de \`'a\` olmasının iki argümanın *eşit* uzunlukta yaşaması gerektiği anlamına geldiğidir. Gelmez.

Fonksiyon farklı lifetime'lara sahip referanslarla çağrıldığında derleyici \`'a\` olarak ikisinden **kısa** olanı seçer — böylece her \`'a\` yuvası sağlanmış olur, çünkü daha uzun yaşayan bir referans daha kısasının gerektiği her yerde kullanılabilir.

\`\`\`rust
let long = String::from("soroban");
{
    let short = String::from("rpc");
    let winner = longest(&long, &short);
    println!("{winner}");     // sorun yok — 'a iç kapsam
}
// \`winner\` bu bloktan kaçamaz: 'a, \`short\` ile birlikte bitti
\`\`\`

Sonuç yalnızca derleyicinin seçtiği bölgeyle kısıtlıdır; bu yüzden bu kod bloğun içinde derlenir, dışında reddedilir.`,
    },
    {
      kind: "quiz",
      question:
        "`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str`, biri programın tamamı boyunca, diğeri üç satır boyunca yaşayan iki referansla çağrılıyor. `'a` nedir?",
      options: [
        "İki bölgeden kısa olanı — ve dönen referans yalnızca onun içinde geçerli",
        "Uzun olanı, çünkü `'a` her iki argümanı da kapsamak zorunda",
        "Derleme hatası: iki argümanın da aynı lifetime'a sahip olması gerekir",
      ],
      answer: 0,
      explain:
        "Lifetime'lar subtyping gibi davranır: bir `&'long T`, `&'short T`'ye dönüşür (coerce). Derleyici her kısıtın sağlandığı en geniş bölgeyi seçer; bu da kesişim, yani kısa olandır.",
    },
    {
      kind: "fill",
      prompt:
        "Dönüş değerini girdilere bağla ki çağıran ne kadar süre geçerli olduğunu bilsin.",
      file: "main.rs",
      before: "fn longest<'a>(a: &'a str, b: &'a str) -> ",
      after: " {",
      choices: ["&'a str", "&str", "String"],
      answer: 0,
      explain:
        "Tek başına `&str` burada derlenmez: iki girdi referansı varken derleyici çıktının hangisinden borrow ettiğini tahmin edemez. `String` derlenir ama fonksiyonun ihtiyaç duymadığı bir allocation'ı zorunlu kılar.",
    },
    {
      kind: "quiz",
      question:
        "Bir fonksiyon imzasındaki `<'a>` çalışma zamanında gerçekte neye mal olur?",
      options: [
        "Hiçbir şeye. Lifetime'lar borrow check'ten sonra silinir ve hiç kod üretmez",
        "Bölge etiketini taşımak için referans başına fazladan bir makine word'ü",
        "Annotation'lı referansın her dereference'ında bir sınır denetimi",
      ],
      answer: 0,
      explain:
        "Lifetime'lar yalnızca derleme sırasında vardır. Borrow checker'ın bedava katı olabilmesinin sebebi budur — bedelini ödeyecek bir çalışma zamanı temsili yoktur.",
    },
    {
      kind: "editor",
      intro: `### Çıktıyı girdilerine bağla

Uzun olan argümanı döndüren \`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str\` fonksiyonunu yaz (eşitlerse \`a\`'yı döndür).

\`main\` içinde onu \`soroban\` tutan bir \`&String\` ve \`"rpc"\` literal'iyle çağır, kazananı yazdır.

Beklenen çıktı:

\`\`\`text
longest: soroban
\`\`\``,
    },
  ],

  "rust-lifetimes-2": [
    {
      kind: "theory",
      body: `İmzaların çoğu annotation gerektirmez, çünkü üç **elision (eksiltme) kuralı** boşlukları doldurur. Bunları bilmek, ne zaman kendin yazmak zorunda olduğunu tam olarak söyler.

1. Elide edilmiş her girdi lifetime'ı kendi ayrı parametresini alır.
2. **Tam olarak bir** girdi lifetime'ı varsa, elide edilmiş her çıktı lifetime'ına o atanır.
3. Girdilerden biri \`&self\` ya da \`&mut self\` ise, elide edilmiş her çıktı lifetime'ına **onun** lifetime'ı atanır.

\`\`\`rust
fn first_word(s: &str) -> &str        // kural 2 — tek girdi, belirsizlik yok
fn rest(&self) -> &str                // kural 3 — çıktı self'ten borrow eder
\`\`\``,
    },
    {
      kind: "theory",
      body: `Kurallar bilerek aptaldır: asla tahmin yürütmezler. İki girdi referansı da çıktının kaynağı olabilecekken elision pes eder ve annotation isteyen bir hata alırsın.

\`\`\`rust
fn pick(a: &str, b: &str) -> &str     // error: missing lifetime specifier
\`\`\`

Bu hata derleyicinin zorluk çıkarması değildir. \`a\` ve \`b\` bambaşka lifetime'lara sahip olabilir ve cevap, çağıranın sonuçla ne yapabileceğini değiştirir. Çıktının hangisinden geldiğini yalnızca sen bilirsin — o yüzden onu yalnızca sen yazabilirsin.`,
    },
    {
      kind: "quiz",
      question:
        "`fn head(&self, other: &str) -> &str` annotation'sız derleniyor. Dönen `&str` hangi lifetime'ı alır?",
      options: [
        "`self`'inkini — bir metodun `&self` alıcısı olduğunda kural 3 önceliklidir",
        "`other`'ınkini, çünkü parametre listesindeki son referans o",
        "`self` ile `other`'dan kısa olanını, her call site'ta ayrı seçilir",
      ],
      answer: 0,
      explain:
        "Kural 3 tam da `self`'in içine bir görünüm döndüren metotlar ezici çoğunlukta olduğu için vardır. Gerçekten `other`'dan bir borrow döndürmek istiyorsan annotation yazmalısın — aksi halde elision sessizce yanlış şeyi verir ve hata call site'ta ortaya çıkar.",
    },
    {
      kind: "fill",
      prompt:
        "Bu metot struct'ın kendi buffer'ına bir görünüm döndürüyor. impl başlığını tamamla.",
      file: "main.rs",
      before: "struct Parser<'a> { input: &'a str }\n\nimpl",
      after: " Parser<'a> {\n    fn rest(&self) -> &str { self.input }\n}",
      choices: ["<'a>", "<'static>", ""],
      answer: 0,
      explain:
        "Lifetime parametresi olan bir struct'ın bu parametreyi impl bloğunda da bildirmesi gerekir — `impl<'a> Parser<'a>`. Bloğun içinde `rest` annotation gerektirmez: kural 3 onu kapsar.",
    },
    {
      kind: "quiz",
      question: "Elision seni ne zaman açık bir lifetime yazmaya zorlar?",
      options: [
        "İki veya daha fazla girdi referansı varsa, `&self` yoksa ve fonksiyon bir referans döndürüyorsa",
        "Fonksiyon ne zaman bir referans döndürse",
        "Fonksiyonun birden fazla parametresi olduğunda",
      ],
      answer: 0,
      explain:
        "Üç koşulun da sağlanması gerekir. Tek girdi referansını kural 2, `&self` alıcısını kural 3 kapsar; owned bir değer döndürmekse hiç lifetime gerektirmez.",
    },
    {
      kind: "editor",
      intro: `### Bırak elision işini yapsın

1. İlk boşluktan önceki her şeyi (boşluk yoksa string'in tamamını) döndüren \`fn first_word(s: &str) -> &str\` fonksiyonunu yaz. Annotation yok — kural 2 kapsıyor.
2. \`impl<'a> Parser<'a>\` ile \`struct Parser<'a> { input: &'a str }\` tanımla ve \`self.input\` döndüren bir \`rest(&self) -> &str\` metodu ekle.
3. \`first_word("submit tx now")\` sonucunu, ardından \`"ledger 42"\` üzerine kurulmuş bir parser'da \`rest()\` sonucunu yazdır.

Beklenen çıktı:

\`\`\`text
word: submit
rest: ledger 42
\`\`\``,
    },
  ],

  "rust-lifetimes-3": [
    {
      kind: "theory",
      body: `İki girdinin lifetime'ları gerçekten birbirinden bağımsızsa onlara ayrı isimler ver. Önemli olan **çıktıdaki** isimdir.

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

Bu, kesin ve işe yarar bir şey söyler: sonuç \`text\`'ten borrow eder, \`sep\`'ten **değil**. Dolayısıyla çağıran \`sep\`'i hemen drop edip sonucu kullanmaya devam edebilir.

İkisini de \`'a\` altında birleştirmek de derlenirdi — ama sonucu sessizce \`sep\`'e de bağlar, çağıranı fonksiyonun hiç borrow etmediği bir şeyi hayatta tutmaya zorlardı.`,
    },
    {
      kind: "theory",
      body: `Fazla annotation'ın gerçek bedeli budur: fonksiyonu yanlış yapmaz, **gereksiz yere kısıtlayıcı** yapar ve bu kısıtı her çağıran hisseder.

\`\`\`rust
let cut = {
    let sep = String::from(":");
    prefix(&text, &sep)      // \`sep\` kapanan süslü parantezde ölür
};
println!("{cut}");           // hâlâ sorun yok — \`cut\` yalnızca \`text\`'ten borrow eder
\`\`\`

\`fn prefix<'a>(text: &'a str, sep: &'a str) -> &'a str\` ile tam olarak bu kod, okuyanın call site'tan göremeyeceği bir sebeple derlenmez olur. İmzalar bir API yüzeyidir; lifetime'lar sözleşmenin parçasıdır.`,
    },
    {
      kind: "quiz",
      question:
        "`prefix`, `<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str` iken `<'a>(text: &'a str, sep: &'a str) -> &'a str` olarak değiştiriliyor. Çağıranlar derlenmemeye başlıyor. Neden?",
      options: [
        "Sonuç artık `sep`'e de bağlı, dolayısıyla kısa ömürlü bir ayırıcıdan daha uzun yaşayamaz",
        "Tek bir lifetime parametresi birden fazla argümanda kullanılamaz",
        "Fonksiyon artık `text` yerine `sep`'ten bir borrow döndürüyor",
      ],
      answer: 0,
      explain:
        "`'a`, iki girdinin bölgelerinin kesişimi olur; çıktı da kısa olanı miras alır. Gövde değişmedi; yalnızca çağırana verilen söz küçüldü.",
    },
    {
      kind: "fill",
      prompt:
        "Sonuç yalnızca `text`'in bir dilimi. Dönüş tipini buna göre annotate et.",
      file: "main.rs",
      before: "fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> ",
      after: " {",
      choices: ["&'a str", "&'b str", "&'static str"],
      answer: 0,
      explain:
        "`&'b str` borrow checker'ın gövdede yakalayacağı bir yalan olurdu: dönen dilim `sep`'in değil, `text`'in içini gösterir.",
    },
    {
      kind: "quiz",
      question:
        "Bir fonksiyon iki referans alıp owned bir `String` döndürüyor. Kaç lifetime annotation'ı gerekir?",
      options: [
        "Hiç. Elision girdileri adlandırır; owned bir dönüş değeri hiçbir şeyden borrow etmez",
        "İki — her referans parametresi açıkça annotate edilmeli",
        "Bir, iki parametre tarafından paylaşılan",
      ],
      answer: 0,
      explain:
        "Annotation'ı zorunlu kılan tek şey, çıktının kendisinin bir referans olmasıdır. Owned veri döndürüyorsan girdilerin lifetime'ları kimsenin derdi olmaktan çıkar.",
    },
    {
      kind: "editor",
      intro: `### İki lifetime, biri önemsiz

\`text\` içinde \`sep\`'in ilk geçtiği yerden öncesini (hiç geçmiyorsa \`text\`'in tamamını) döndüren \`fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str\` fonksiyonunu yaz.

\`main\` içinde \`let text = String::from("GA7Q:250:live");\` oluştur, ardından bir **iç blokta** \`":"\` tutan bir ayırıcı \`String\` yarat, \`prefix\`'i çağır ve sonucu bloğun dışına bağla. Blok bittikten sonra yazdır.

Beklenen çıktı:

\`\`\`text
prefix: GA7Q
\`\`\`

Derleniyorsa, sonucun ayırıcıdan borrow etmediğini kanıtlamışsın demektir.`,
    },
  ],

  "rust-lifetimes-4": [
    {
      kind: "theory",
      body: `Bir struct referans tutabilir; o zaman bir lifetime parametresine ihtiyaç duyar:

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

Parametre bir sözdür: **bir \`Frame\` örneği, içini gösterdiği buffer'dan daha uzun yaşayamaz.** Derleyici bunu zorunlu kılar; dolayısıyla struct asla serbest bırakılmış bir allocation'a dangling pointer tutar halde kalamaz.

Her zero-copy parser'ın şekli budur. Alan başına bir \`String\` allocate etmek yerine, sahibi başkası olan bir buffer'ın dilimlerini dağıtırsın.`,
    },
    {
      kind: "theory",
      body: `Bu takası açıkça söylemek gerekir, çünkü tüm API'ni belirler.

**Borrowed (\`&'a str\` alanlar).** Alan başına allocation yok, dolayısıyla büyük bir isteği parse etmek neredeyse bedava. Bedeli: struct bağlı kalır — uzun ömürlü bir cache'e konamaz, buffer'dan uzun yaşayan başka bir thread'e gönderilemez, girdinin sahibi olan fonksiyondan döndürülemez.

**Owned (\`String\` alanlar).** Allocate eder, ama değer kendi kendine yeter, \`'static\`'tir ve her yere gider.

Bir isteği decode edip kullanan ve tek bir handler içinde drop eden bir RPC servisi için borrowed doğru karardır ve kazanç gerçektir. İstek bittikten sonra elinde tuttuğun her şey içinse allocation'ı göze al.`,
    },
    {
      kind: "quiz",
      question:
        "Bir handler isteği, istek buffer'ından borrow edilmiş bir `Frame<'a>` olarak parse ediyor, sonra onu uygulama state'inde yaşayan bir `Vec`'e push etmeye çalışıyor. Ne olur?",
      options: [
        "Derlenmez — `Vec` buffer'dan uzun yaşar, dolayısıyla borrow orada saklanamaz",
        "Derlenir ve buffer serbest bırakılınca frame'in dilimleri dangling olur",
        "Derlenir ve Rust alttaki byte'ları otomatik olarak Vec'e kopyalar",
      ],
      answer: 0,
      explain:
        "Lifetime parametresi tam da bu hatayı üretmek için vardır ve sana doğru bir şey söylüyor: o veriyi elinde tutmak ona sahip olmayı gerektirir. Lifetime'ın bittiği sınırda `String`'e dönüştür.",
    },
    {
      kind: "fill",
      prompt:
        "Aynı buffer'dan iki dilim borrow eden bir struct bildir.",
      file: "main.rs",
      before: "struct Frame",
      after: " {\n    method: &'a str,\n    params: &'a str,\n}",
      choices: ["<'a>", "<'static>", "<T>"],
      answer: 0,
      explain:
        "`<'static>` derlenirdi ama yalnızca programın tamamı boyunca geçerli referansları kabul ederdi — pratikte yalnızca literal'leri. Bir lifetime hatasına verilen klasik aşırı tepkidir.",
    },
    {
      kind: "quiz",
      question:
        "Constructor için neden `fn parse(raw: &'a str) -> Frame<'a>` doğru imzadır?",
      options: [
        "Frame'in dilimlerinin `raw`'ın içini gösterdiğini belirtir; derleyici de ikisinin kaderini birbirine bağlar",
        "`raw`'ın frame'e kopyalanmasını zorunlu kılar ve frame'i bağımsız hale getirir",
        "Yalnızca üslup meselesi — `fn parse(raw: &str) -> Frame` aynı anlama gelir",
      ],
      answer: 0,
      explain:
        "Üçüncü seçenek tehlikeli olacak kadar doğruya yakın: elision burada *gerçekten de* aynısını doldururdu (tek girdi referansı, kural 2). Yine de açıkça yazmaya değer — imza, dönüş değerinin bir kopya değil bir görünüm olduğunu belgeler.",
    },
    {
      kind: "editor",
      intro: `### Zero-copy bir görünüm

1. \`struct Frame<'a> { method: &'a str, params: &'a str }\` tanımla.
2. \`impl<'a> Frame<'a>\` içinde, ilk \`'|'\`'de bölen \`fn parse(raw: &'a str) -> Frame<'a>\` fonksiyonunu yaz — öncesi \`method\`, sonrası \`params\`. \`'|'\` yoksa \`method\` girdinin tamamı, \`params\` ise \`""\` olur.
3. \`main\` içinde \`getLedgerEntries|[42]\` tutan bir \`String\`'i parse et ve iki alanı da yazdır.

Beklenen çıktı:

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

\`parse\` içinde hiçbir yerde \`String\` allocation'ı yok.`,
    },
  ],

  "rust-lifetimes-5": [
    {
      kind: "theory",
      body: `\`'static\`, geçtiği yere göre iki farklı anlama gelir ve ikisini karıştırmak async Rust'taki en yaygın kafa karışıklığı kaynaklarından biridir.

**Referans lifetime'ı olarak — \`&'static T\`** — şu anlama gelir: bu referans programın tüm çalışması boyunca geçerlidir. String literal'leri bunu sağlar, çünkü binary'nin içine gömülüdürler.

\`\`\`rust
let s: &'static str = "baked into the binary";
\`\`\`

Bu güçlü bir iddiadır ve çalışma zamanındaki çok az değer bunu karşılayabilir.`,
    },
    {
      kind: "theory",
      body: `**Bound olarak — \`T: 'static\`** — çok daha zayıf bir şey söyler: bu tip, **programdan kısa lifetime'lı hiçbir referans içermez**. Değerin sonsuza dek yaşadığı anlamına *gelmez*.

Owned bir \`String\`, \`T: 'static\`'i rahatça sağlar. Hiçbir şeyden borrow etmez, dolayısıyla dangling olabilecek hiçbir şey yoktur. Yine de kapsamının sonunda diğer her değer gibi drop edilir.

\`\`\`rust
fn spawn_like<T: Send + 'static>(value: T) -> T { value }

let owned = String::from("owned at runtime");
spawn_like(owned);      // sorun yok: String: 'static
\`\`\`

\`thread::spawn\` ve \`tokio::spawn\`'ın \`'static\` istemesinin sebebi budur. Task, kendisini yaratan fonksiyondan uzun yaşayabilir; dolayısıyla o fonksiyonun yerel değişkenlerinden bir borrow tutamaz. Owned veri baş tacıdır; bound *süreyle* değil, *borrow* ile ilgilidir.`,
    },
    {
      kind: "quiz",
      question:
        "`thread::spawn`, `F: 'static` istiyor. Bu, closure'ın programın tamamı boyunca yaşaması gerektiği anlamına mı gelir?",
      options: [
        "Hayır — closure'ın programdan kısa ömürlü hiçbir şeyi borrow edemeyeceği anlamına gelir. Thread bitince drop edilir",
        "Evet — spawn edilen closure'lar leak edilir ve asla drop edilmez",
        "Evet, bu yüzden spawn edilen her closure `move` olmak ve yalnızca literal kullanmak zorundadır",
      ],
      answer: 0,
      explain:
        "Bound, değerin ne kadar süre yaşadığını değil, neyin *yakalanabileceğini* kısıtlar. Owned `String`'leri yakalayan `move` closure'ların bunu zorlanmadan sağlamasının sebebi budur.",
    },
    {
      kind: "fill",
      prompt:
        "Bir generic'i başka bir thread'e verilebilecek şekilde bound'la: kısa ömürlü borrow yok, güvenle aktarılabilir.",
      file: "main.rs",
      before: "fn spawn_like<T: ",
      after: ">(value: T) -> T {",
      choices: ["Send + 'static", "&'static", "Sync"],
      answer: 0,
      explain:
        "`Send` thread'ler arası aktarıma izin verir; `'static`, spawn eden frame döndüğünde dangling olabilecek hiçbir borrow olmadığını garanti eder. `Sync` ise bir referansı thread'ler arasında *paylaşmakla* ilgilidir — başka bir soru.",
    },
    {
      kind: "quiz",
      question:
        "Spawn edilmiş bir task'ta `error: borrowed value does not live long enough` alıyorsun. Genellikle doğru düzeltme hangisi?",
      options: [
        "Task'a owned veri ver — içine clone'la ya da bir `Arc` move et",
        "Borrow edilen değerin tipine `&'static` ekle",
        "Değeri `Box::leak` ile leak et ki `'static` olsun",
      ],
      answer: 0,
      explain:
        "`Box::leak` teknik olarak gerçekten bir `&'static` üretir ve gerçekten process ömrü boyunca yaşayan bir değer için ara sıra doğrudur — ama bir borrow hatasını susturmak için ona sarılmak, her çağrıda asla geri alamayacağın bellek allocate etmek demektir.",
    },
    {
      kind: "editor",
      intro: `### İki anlam, tek program

1. \`baked into the binary\` tutan bir \`&'static str\`'i açık tip annotation'ıyla bağla ve yazdır.
2. Argümanını olduğu gibi döndüren \`fn spawn_like<T: Send + 'static>(value: T) -> T\` fonksiyonunu yaz.
3. \`owned at runtime\` tutan owned bir \`String\`'i içinden geçir ve sonucu yazdır — \`String\`'in \`'static\`'i sağladığını kanıtla.

Beklenen çıktı:

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\``,
    },
  ],
};
