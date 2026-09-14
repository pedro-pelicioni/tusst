import type { LessonStep } from "@/content/steps";

// TR · Collections, Iterators & Closures.
//
// Overlay for ../../steps/rust-collections-iterators.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustCollectionsIteratorsStepsTr: Record<string, LessonStep[]> = {
  "rust-collections-iterators-1": [
    {
      kind: "theory",
      body: `\`Vec<T>\` bitişik (contiguous) ve büyüyebilen bir dizidir. Maliyetlerini tam olarak bilmeye değer:

| işlem | maliyet |
| --- | --- |
| sonda \`push\` / \`pop\` | O(1) amortize |
| başta \`insert\` / \`remove\` | O(n) — her şey kayar |
| index | O(1) |

"Amortize" büyümeyi kapsar: buffer dolduğunda \`Vec\` daha büyük bir tane (genelde iki katı) ayırır ve her şeyi oraya kopyalar. Çok sayıda push üzerinden ortalandığında bu O(1)'dir, ama *tek bir* push pekâlâ pahalı olan olabilir.`,
    },
    {
      kind: "theory",
      body: `Üzerine aksiyon alabileceğin iki sonuç.

**Boyutu biliyorsan söyle.** \`Vec::with_capacity(n)\` tek seferde ayırır. Bilinen sayıda öğe push eden bir döngüde bu, her reallocation'ı ve her kopyayı ortadan kaldırır — dilin en ucuz performans kazancı.

**İki uçtan da push ve pop yapıyorsan \`VecDeque<T>\` kullan.** Bu bir ring buffer'dır: \`push_front\` ve \`pop_front\` O(1)'dir; \`Vec::insert(0, x)\` ise O(n). Ölçeklenen bir kuyrukla sessizce kuadratik hale gelen bir kuyruk arasındaki fark tam olarak budur.

\`\`\`rust
let mut q: VecDeque<i32> = VecDeque::new();
q.push_back(2);
q.push_front(1);     // O(1) — bir Vec her elemanı kaydırırdı
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "Bir döngü, bir `Vec::new()` içine tam olarak 10 000 bilinen öğe push ediyor. `with_capacity(10_000)` neyi kurtarır?",
      options: [
        "Yaklaşık bir düzine reallocation'ı; her biri o ana kadar push edilen her şeyi kopyalıyor",
        "Hiçbir şeyi — `Vec` ilk push'ta zaten nihai boyutunu ayırır",
        "Her push'taki bounds check'i",
      ],
      answer: 0,
      explain:
        "4'ten 10 000'e ikiye katlayarak çıkmak yaklaşık on bir büyüme adımıdır ve son birkaçı her seferinde binlerce eleman kopyalar. Baştan tek bir allocation hepsini ortadan kaldırır.",
    },
    {
      kind: "fill",
      prompt: "Bir kuyruğun başına sabit zamanda ekle.",
      file: "main.rs",
      before: "let mut q: VecDeque<i32> = VecDeque::new();\nq.",
      after: "(1);",
      choices: ["push_front", "insert", "push"],
      answer: 0,
      explain:
        "`VecDeque` bir ring buffer'dır, dolayısıyla başa ekleme bir pointer hareketidir. Aynı işlem bir `Vec` üzerinde her elemanı kaydırır.",
    },
    {
      kind: "quiz",
      question:
        "Bir iş kuyruğu her tick'te bir `Vec` üzerinde `jobs.remove(0)` yapıyor; binlerce iş var. Belirti nedir?",
      options: [
        "Throughput kuyruk derinliğiyle düşer — her pop, kalan her elemanı kaydırır",
        "Bellek sınırsız büyür çünkü `remove` hiçbir zaman serbest bırakmaz",
        "Ölçülebilir hiçbir şey; `remove(0)` bir pointer artırımına optimize edilmiştir",
      ],
      answer: 0,
      explain:
        "Klasik kuadratik kuyruk. On işlik bir testte görünmezdir, on binde ise profile hâkim olur — `Vec`'i bir `VecDeque` ile değiştir, kaybolur.",
    },
    {
      kind: "editor",
      intro: `### Doğru container, doğru maliyet

1. \`Vec::with_capacity(4)\` ile bir \`Vec<i32>\` oluştur, \`1..=4\` push et, vektörü \`{:?}\` ile ve \`capacity()\` değerini yazdır — hâlâ tam olarak 4 olmalı.
2. Bir \`VecDeque<i32>\` oluştur, \`push_back\` ile \`2\` sonra \`3\`, \`push_front\` ile \`1\` ekle, \`{:?}\` ile yazdır, ardından \`pop_front()\` sonucunu \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\``,
    },
  ],

  "rust-collections-iterators-2": [
    {
      kind: "theory",
      body: `İki map, geri kalan her şeyi belirleyen tek bir eksende ayrılır: **sıralama**.

\`HashMap<K, V>\` — ortalama O(1) lookup, insert ve remove. Iteration sırası **keyfidir ve çalıştırmalar arasında bilerek rastgeleleştirilir**. \`K: Hash + Eq\` gerektirir.

\`BTreeMap<K, V>\` — aynı işlemler için O(log n). Iteration **her zaman sıralı key düzenindedir** ve aralık sorgularını destekler: \`map.range("a".."m")\`. \`K: Ord\` gerektirir.`,
    },
    {
      kind: "theory",
      body: `Sıralı iteration, aralık taraması veya deterministik çıktı (bir config dump'ı, bir test snapshot'ı, imzalanmış bir payload) gerekiyorsa \`BTreeMap\` seç. Aksi halde \`HashMap\` — daha hızlıdır ve doğru varsayılan odur.

\`entry\` API'si (giriş arayüzü), ikisi için de ezberlemeye değer kalıptır:

\`\`\`rust
*hits.entry(method).or_insert(0) += 1;
\`\`\`

İki değil, tek lookup. Naif sürüm — \`if map.contains_key(k) { ... } else { ... }\` — key'i iki kez hash'ler ve map'i iki kez borrow eder; borrow checker da buna itiraz edecektir. Varsayılanı üretmek bedava değilse \`or_insert_with(Vec::new)\` aynı kalıbın karşılığıdır.`,
    },
    {
      kind: "quiz",
      question:
        "Aynı girdileri tutan iki `HashMap` farklı sıralarda iterate edebilir; aynı program çalıştırmalar arasında bile farklılaşabilir. Bu neden bilinçli bir tercih?",
      options: [
        "Rastgeleleştirilmiş hashing collision saldırılarına karşı savunmadır; kararsız sıra da kodun bir tesadüfe bağımlı olmasını engeller",
        "Standart kütüphanede uyumluluk uğruna korunan bir bug'dır",
        "Sıra, o anda ne kadar boş bellek olduğuna bağlıdır",
      ],
      answer: 0,
      explain:
        "İki yarı da meselenin özü: öngörülebilir bir hash, saldırganın her key'i tek bir bucket'a zorlamasına izin verir; iteration sırasına sessizce bel bağlayan kod da ilk resize'da kırılır.",
    },
    {
      kind: "fill",
      prompt: "Bir sayacı artır; ilk görüşte sıfırdan oluştur.",
      file: "main.rs",
      before: "*hits.",
      after: "(m).or_insert(0) += 1;",
      choices: ["entry", "get", "insert"],
      answer: 0,
      explain:
        "`entry` bir kez hash'ler ve doldurabileceğin ya da değiştirebileceğin bir slot geri verir. `get` ardından `insert` iki kez hash'ler ve iki ayrı borrow gerektirir.",
    },
    {
      kind: "quiz",
      question:
        "Bir servis config'ini JSON olarak dump ediyor ve config değişmediği halde iki çalıştırma arasındaki diff gürültülü. Olası sebep nedir?",
      options: [
        "Bir `HashMap` üzerinden serialize ediyor; onun iteration sırası her çalıştırmada değişir — bir `BTreeMap` çıktıyı deterministik yapardı",
        "JSON serializer deterministik değil",
        "Config tamamen yüklenmeden okunuyor",
      ],
      answer: 0,
      explain:
        "Deterministik çıktı, `BTreeMap`'in O(log n) bedelini ödemenin standart gerekçesidir. Aynı şey byte-byte kararlılık gereken, hash'lenen ya da imzalanan her şey için geçerlidir.",
    },
    {
      kind: "editor",
      intro: `### Sıra mı hız mı

1. Bir \`HashMap<&str, u32>\` ile \`["getEvents", "sendTx", "getEvents"]\` içindeki tekrarları \`entry\` API'sini kullanarak say, sonra \`getEvents\` sayısını yazdır.
2. Bir \`BTreeMap<&str, u32>\` içine \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` girdilerini bu sırayla ekle, sonra key'lerini bir \`Vec<&str>\` içine topla ve yazdır — ekleme sırasından bağımsız olarak sıralı.

Beklenen çıktı:

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-3": [
    {
      kind: "theory",
      body: `Iterate etmenin üç yolu var ve fark, her birinin sana ne verdiğinde:

| metot | üretir | sonrasında koleksiyon |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | dokunulmamış |
| \`.iter_mut()\` | \`&mut T\` | yerinde değiştirilmiş |
| \`.into_iter()\` | \`T\` | **tüketilmiş** |

\`\`\`rust
let doubled: Vec<i32> = data.iter().map(|n| n * 2).collect();  // data hayatta kalır
for n in data.iter_mut() { *n += 10; }                          // data değişir
let owned: Vec<String> = data.into_iter().map(...).collect();   // data gitti
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`for x in &collection\`, \`.iter()\` için; \`for x in &mut collection\`, \`.iter_mut()\` için; \`for x in collection\` ise \`.into_iter()\` için sözdizimsel şekerdir.

İnsanları şaşırtan sonuncusu: \`for item in items\` yazmak \`items\`'ı **move eder** ve onu kullanan bir sonraki satır derlenmez. Çözüm neredeyse her zaman tek bir \`&\`'dir.

\`into_iter\`'ı kazara değil, bilinçli olarak seç. Sahip olduğun veriyi başka sahipli veriye dönüştürüyorsan ve orijinale ihtiyacın kalmayacaksa — \`Vec<Row>\`'u \`Vec<Response>\`'a map'lemek gibi — tam yerindedir ve her elemanı clone'lamaktan kurtarır.`,
    },
    {
      kind: "quiz",
      question:
        "`for item in items { ... }` derleniyor ama `items`'ı kullanan bir sonraki satır derlenmiyor. Neden?",
      options: [
        "Döngü `into_iter()`'a desugar olur; o da koleksiyonu tüketti",
        "Döngü `items`'ı borrow etti ve borrow fonksiyonun sonuna kadar sürüyor",
        "Bir döngüden sonra okunabilmesi için `items`'ın `mut` olarak bildirilmesi gerekir",
      ],
      answer: 0,
      explain:
        "Tek karakter düzeltir: `for item in &items`. İçselleştirmeye değer, çünkü hata mesajı ikinci satırı gösterir ama sebep ilk satırdadır.",
    },
    {
      kind: "fill",
      prompt: "Vektörün her elemanını yerinde değiştir.",
      file: "main.rs",
      before: "for n in data.",
      after: "() {\n    *n += 10;\n}",
      choices: ["iter_mut", "iter", "into_iter"],
      answer: 0,
      explain:
        "`iter_mut`, `&mut i32` üretir; `*n += 10` onun üzerinden yazar. `iter` ise `&i32` üretirdi ve ona atama yapılamaz.",
    },
    {
      kind: "quiz",
      question:
        "Bir `Vec<Row>`'u `Vec<Response>`'a çeviriyorsun ve satırlara bir daha ihtiyacın olmayacak. Doğrusu hangisi?",
      options: [
        "`into_iter()` — her satırı map closure'ına move eder, eleman başına clone yok",
        "`iter()` artı closure içinde `.clone()`, orijinali olduğu gibi bırakmak için",
        "`iter_mut()`, her satırı yerinde bir response'a dönüştürerek",
      ],
      answer: 0,
      explain:
        "`into_iter` yerini burada hak eder. Alışkanlıkla `iter().cloned()`'a uzanmak, zaten atmak üzere olduğun veri için eleman başına bir allocation demektir.",
    },
    {
      kind: "editor",
      intro: `### Borrow et, değiştir, tüket

\`let mut data = vec![1, 2, 3];\` ile:

1. \`.iter()\` ve \`map\` ile her birini ikiye katlayıp yeni bir \`Vec<i32>\` oluştur, yazdır — \`data\` hayatta kalır.
2. \`.iter_mut()\` ile her birine yerinde \`10\` ekle, \`data\`'yı yazdır.
3. \`.into_iter()\` ve \`map\` ile her birini bir \`String\`'e çevir, \`Vec<String>\` içine topla, yazdır.

Beklenen çıktı:

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-4": [
    {
      kind: "theory",
      body: `Iterator adapter'ları **lazy**'dir (tembel). \`map\`, \`filter\` ve \`filter_map\` yeni bir iterator kurar ve hiçbir şey çalıştırmaz:

\`\`\`rust
let lazy = raw.iter().map(|s| s.len());   // sıfır eleman işlendi
\`\`\`

İş ancak bir şey iterator'ı *tükettiğinde* başlar: \`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`. O ana kadar bir pipeline kuruyorsun, çalıştırmıyorsun.`,
    },
    {
      kind: "theory",
      body: `Zincirlemeyi bedava yapan şey laziness'tır. \`filter\` ardından \`map\`, ara bir \`Vec\` **kurmaz** — her eleman tüm zincirden teker teker akar ve derleyici bunu genelde allocation'sız tek bir döngüye indirger.

Kısa devre yapmaya da izin verir: milyon elemanlı bir zincirde \`.find(...)\` ilk eşleşmede durur ve sonrasındaki elemanlara hiç dokunulmaz.

\`filter_map\` özellikle anılmayı hak ediyor. Tek geçişte hem map'ler hem filtreler, yalnızca \`Some\` olanları tutar:

\`\`\`rust
.filter_map(|s| s.parse::<i64>().ok())    // parse et, başarısızları at
\`\`\`

Bazı girdileri çöp olan bir batch'i parse etmenin idiyomatik yolu budur — ama sebebi de atar, dolayısıyla bir hata batch'in tamamını iptal etmeliyse onun yerine \`.map(...).collect::<Result<Vec<_>, _>>()\` kullan.`,
    },
    {
      kind: "quiz",
      question:
        "`raw.iter().map(expensive).filter(pred)` bir değişkene atanıyor ve hiç tüketilmiyor. `expensive` kaç kez çalışır?",
      options: [
        "Sıfır — adapter'lar bir pipeline kurar ve bir consumer eleman isteyene kadar hiçbir şey yürütülmez",
        "Eleman başına bir kez, zincir kurulduğu anda",
        "Bir kez, ilk elemanda, tipleri çıkarsamak için",
      ],
      answer: 0,
      explain:
        "`Iterator`'ın `#[must_use]` olmasının sebebi de bu: tüketilmemiş bir zincir neredeyse her zaman bir bug'dır ve derleyici seni uyarır.",
    },
    {
      kind: "fill",
      prompt: "Her girdiyi parse et ve başarısız olanları sessizce at.",
      file: "main.rs",
      before: "raw.iter().",
      after: "(|s| s.parse::<i64>().ok())",
      choices: ["filter_map", "map", "filter"],
      answer: 0,
      explain:
        "`filter_map` tek geçişte `Some`'ları tutar, `None`'ları atar. Tek başına `map` elinde bir `Vec<Option<i64>>` bırakırdı.",
    },
    {
      kind: "quiz",
      question:
        "Bir batch'i parse ederken `filter_map(|x| f(x).ok())` ne zaman yanlış tercihtir?",
      options: [
        "Tek bir bozuk girdi tüm batch'i başarısız kılmalıyken — elemanla birlikte hatayı da atar",
        "Batch büyükken, çünkü `filter_map` eleman başına allocation yapar",
        "Closure, kapsayan scope'tan bir değişken yakaladığında",
      ],
      answer: 0,
      explain:
        "Bozuk girdileri sessizce atmak gerçek bir karardır ve finansal veri için çoğunlukla yanlış olanıdır. `.collect::<Result<Vec<_>, _>>()` ise ilk hatada batch'i başarısız kılar.",
    },
    {
      kind: "editor",
      intro: `### Sen istemeden hiçbir şey çalışmaz

\`let raw = vec!["12", "x", "30", "", "8"];\` ile:

1. \`.iter()\`, ardından her girdiyi \`i64\` olarak parse edip başarılıları tutan \`filter_map\`, sonra yalnızca \`>= 10\` değerleri tutan \`filter\` zincirle. \`Vec<i64>\` içine topla ve yazdır.
2. Her girdiyi \`.len()\` değerine map'leyen ikinci bir zincir kur ve onu tüketmeden **bir değişkene bağla**. \`nothing ran yet\` yazdır, sonra \`Vec<usize>\` içine topla ve onu yazdır.

Beklenen çıktı:

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\``,
    },
  ],

  "rust-collections-iterators-5": [
    {
      kind: "theory",
      body: `\`fold\`, tüm dizi boyunca bir accumulator (biriktirici) taşır. Var olan en genel consumer'dır — \`sum\`, \`count\`, \`max\` ve \`collect\` altta hep birer fold'dur.

\`\`\`rust
let total = latencies.iter().fold(0u64, |acc, n| acc + n);
\`\`\`

Üç parça: başlangıç değeri, accumulator, mevcut eleman. Closure bir sonraki accumulator'ı döndürür.

\`reduce\`, başlangıç değeri olmayan \`fold\`'dur — onun yerine ilk elemanı kullanır ve bu yüzden \`Option\` döndürür, çünkü boş bir dizinin cevabı yoktur:

\`\`\`rust
let worst = latencies.iter().copied().reduce(u64::max);   // Option<u64>
\`\`\``,
    },
    {
      kind: "theory",
      body: `Accumulator'ın bir sayı olması şart değil. Bir \`String\` kurmak, accumulator'ı kurulmakta olan string olan bir fold'dur:

\`\`\`rust
.fold(String::new(), |mut acc, n| {
    if !acc.is_empty() { acc.push('|'); }
    acc.push_str(&n.to_string());
    acc
})
\`\`\`

\`|mut acc, ...|\` ve \`acc\`'in geri döndürülmesine dikkat — accumulator her adımda *move* edilir; iterasyon başına allocation olmamasını sağlayan tam olarak budur.

Zorlama. Mutable bir yerel değişkenle düz bir \`for\` döngüsü daha okunaklıysa onu yaz: derleyici aynı kodu üretir ve karmaşık bir gövdenin fold sürümü gerçekten daha zor okunur.`,
    },
    {
      kind: "quiz",
      question: "`fold` döndürmezken `reduce` neden `Option<T>` döndürür?",
      options: [
        "Başlangıç değerini ilk elemandan alır, dolayısıyla boş bir dizinin verecek sonucu yoktur",
        "Closure panic'lerse başarısız olabilir",
        "Lazy'dir ve `Option`, tüketilip tüketilmediğini bildirir",
      ],
      answer: 0,
      explain:
        "`fold`'un her zaman bir cevabı vardır çünkü identity'yi sen verdin. Boş bir iterator üzerinde `reduce` gerçekten tanımsızdır ve `Option` bunu söyler.",
    },
    {
      kind: "fill",
      prompt: "Açık bir sıfırdan başlayarak dizi boyunca bir ara toplam taşı.",
      file: "main.rs",
      before: "latencies.iter().",
      after: "(0u64, |acc, n| acc + n)",
      choices: ["fold", "reduce", "scan"],
      answer: 0,
      explain:
        "`reduce` başlangıç değeri almaz. `scan` ise yalnızca sonuncuyu değil, *her* ara accumulator'ı üreten varyanttır.",
    },
    {
      kind: "quiz",
      question:
        "Bir `fold` yerine `for` döngüsünü tercih etmenin dürüst sebebi hangisi?",
      options: [
        "Gövde, fold'un daha kötü okunacağı kadar karmaşık — üretilen kod iki durumda da aynı",
        "`fold` her çağrıda heap'te bir closure ayırır",
        "`for` döngüleri iterator protokolünden kaçındığı için daha hızlıdır",
      ],
      answer: 0,
      explain:
        "İkisi de aynı döngüye derlenir. Karar tamamen okunabilirlikle ilgilidir ve 'daha fonksiyonel' otomatik olarak 'daha okunaklı' demek değildir.",
    },
    {
      kind: "editor",
      intro: `### Üç yoldan topla

\`let latencies = vec![12u64, 40, 7, 95, 23];\` ile:

1. \`0u64\`'ten başlayan bir \`fold\` ile toplamı bul, yazdır.
2. En kötüsü için \`.copied().reduce(u64::max)\`, \`{:?}\` ile yazdır.
3. \`String::new()\`'dan başlayan bir \`fold\` ile değerleri \`'|'\` ile birleştir, yazdır.

Beklenen çıktı:

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\``,
    },
  ],

  "rust-collections-iterators-6": [
    {
      kind: "theory",
      body: `Bir closure üç trait'ten birini implemente eder ve **seçen sen değilsin** — derleyici, gövdenin yakaladıklarıyla ne yaptığına bakarak karar verir.

| trait | gövde ne yapar | çağrılabilirlik |
| --- | --- | --- |
| \`FnOnce\` | bir capture'ı **tüketir** | bir kez |
| \`FnMut\` | bir capture'ı **değiştirir** | çok kez, \`&mut\` ister |
| \`Fn\` | capture'ları yalnızca **okur** | çok kez, \`&\` üzerinden |

İç içe geçerler: her \`Fn\` aynı zamanda \`FnMut\`, her \`FnMut\` aynı zamanda \`FnOnce\`'tır. Dolayısıyla bir parametreyi \`Fn\` ile sınırlamak isteyebileceğin *en* kısıtlayıcı şeydir.`,
    },
    {
      kind: "theory",
      body: `Bu da demektir ki bir imza yazmanın kuralı sezginin tam tersi:

**Seni ihtiyacın kadar sık çağırmaya izin veren en gevşek trait'i bound olarak koy.** Bir kez çağıracaksan \`FnOnce\`; tekrar tekrar çağıracaksan ve mutable state tutmasında sakınca yoksa \`FnMut\`; yalnızca aynı anda birden fazla yerden — örneğin birden fazla thread'den — çağırman gerekiyorsa \`Fn\`.

\`\`\`rust
fn call_once<F: FnOnce() -> String>(f: F) -> String { f() }
fn call_mut<F: FnMut()>(mut f: F) { f(); f(); }
fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64 { f(1) + f(2) }
\`\`\`

\`FnMut\` durumundaki \`mut f\`'e dikkat: onu çağırmak closure'ın kendisi üzerinde exclusive bir borrow gerektirir, çünkü değiştirdiği state'in sahibi closure'dır.`,
    },
    {
      kind: "quiz",
      question:
        "Bir closure gövdesi yakalanan bir yerel değişken üzerinde `count += 1` yapıyor. Hangi trait'leri implemente eder?",
      options: [
        "`FnMut` ve `FnOnce` — ama `Fn` değil, çünkü onu çağırmak yakalanan state'ini değiştirir",
        "Üçünü de — bir capture'ın değiştirilmesi trait'i etkilemez",
        "Yalnızca `FnOnce`, çünkü değiştirmek capture'ı tüketir",
      ],
      answer: 0,
      explain:
        "`F: Fn()` ile sınırlanmış bir parametrenin sayaç closure'ını reddetmesinin sebebi budur. Trait'ler çağırmanın *ne yaptığını* tanımlar, closure'ın ne döndürdüğünü değil.",
    },
    {
      kind: "fill",
      prompt:
        "İki kez çağrılacak ve mutable state tutmasına izin verilen bir callback'i sınırla.",
      file: "main.rs",
      before: "fn call_fn_mut<F: ",
      after: ">(mut f: F) {",
      choices: ["FnMut()", "Fn()", "FnOnce()"],
      answer: 0,
      explain:
        "`FnOnce` iki kez çağrılamaz; `Fn` ise bir capture'ı değiştiren her closure'ı reddederdi — ki bu, işe yarar callback'lerin çoğunu dışarıda bırakır.",
    },
    {
      kind: "quiz",
      question:
        "Bir callback parametresi `F: Fn()` ile sınırlanmış ve çağıranın closure'ı derlenmiyor. Olağan düzeltme nedir?",
      options: [
        "Bound'u `FnMut`'a gevşet — callback'in gerçekten aynı anda birden fazla yerden çağrılması gerekmiyorsa",
        "Çağırandan state'ini bir `RefCell` içine sarmasını iste",
        "Parametreyi `&dyn Fn()` olarak değiştir",
      ],
      answer: 0,
      explain:
        "`RefCell` çalışır — compile-time kısıtlamasını runtime kısıtlamasına çevirir — ama fazla sıkı bir bound'u tatmin etmek için ona uzanmak, kendi API'nin sorununu çağıranın kodunda çözmektir.",
    },
    {
      kind: "editor",
      intro: `### Trait'i derleyici seçer

1. \`f(1) + f(2)\` döndüren \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\`. Yakalanan bir \`factor = 10\` ile çarpan bir closure'la çağır.
2. \`f()\`'i iki kez çağıran \`fn call_fn_mut<F: FnMut()>(mut f: F)\`. Yakalanan bir \`count\`'u artıran bir closure'la çağır, sonra \`count\`'u yazdır.
3. \`f()\`'i bir kez çağıran \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\`. Yakalanan bir \`String\` döndüren bir \`move\` closure'la çağır.

Beklenen çıktı:

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\``,
    },
  ],

  "rust-collections-iterators-7": [
    {
      kind: "theory",
      body: `Varsayılan olarak bir closure referansla yakalar — yetinebileceği en azı. Hemen kullanılan bir closure için doğru, **oluşturulduğu scope'tan daha uzun yaşayan** bir closure içinse yanlıştır.

\`move\`, her capture'ın değer olarak alınmasını zorlar:

\`\`\`rust
fn make_greeter(name: String) -> Box<dyn Fn() -> String> {
    Box::new(move || format!("hello {name}"))
}
\`\`\`

\`move\` olmadan closure, fonksiyon döndüğünde ölen \`name\`'e bir referans tutardı. \`move\` ile closure \`name\`'in sahibidir ve istediği yere gidebilir.`,
    },
    {
      kind: "theory",
      body: `Bir closure için iki dönüş şekli var ve seçim, daha önceki generic-mi-object-mi takasının aynısı:

**\`impl Fn() -> T\`** — tek bir somut anonim tip, static dispatch, allocation yok. Fonksiyon tam olarak tek bir closure döndürüyorsa bunu kullan.

**\`Box<dyn Fn() -> T>\`** — heap'te ayrılır, dinamik dispatch edilir. Farklı dallar *farklı* closure'lar döndürdüğünde ya da birkaçını bir koleksiyonda saklaman gerektiğinde zorunludur.

\`\`\`rust
fn make_counter(start: u32) -> impl FnMut() -> u32 {
    let mut n = start;
    move || { n += 1; n }
}
\`\`\`

O closure \`n\`'in sahibidir. Her çağrı kendi state'ini değiştirir ve state her çağrıdan sağ çıkar — bu, struct bildirimi olmayan bir state machine'dir.`,
    },
    {
      kind: "quiz",
      question:
        "Bir fonksiyon, yerel olarak kurulmuş bir `String` üzerinden `move` olmadan `impl Fn() -> String` döndürüyor. Ne olur?",
      options: [
        "Derlenmez — closure, fonksiyon döndüğünde ölen bir yerel değişkeni borrow ediyor",
        "Derlenir ve döndürülen closure boş bir string görür",
        "Derlenir; Rust yerel değişkenin lifetime'ını closure'a uyacak şekilde uzatır",
      ],
      answer: 0,
      explain:
        "Dilin en yaygın `move` uyarılarından biri budur ve derleyicinin önerisi tam isabet: `move` ekle.",
    },
    {
      kind: "fill",
      prompt:
        "Yakaladığı state'in sahibi olan, static dispatch'li ve allocation'sız bir closure döndür.",
      file: "main.rs",
      before: "fn make_counter(start: u32) -> ",
      after: " {\n    let mut n = start;\n    move || { n += 1; n }\n}",
      choices: ["impl FnMut() -> u32", "Box<dyn Fn() -> u32>", "fn() -> u32"],
      answer: 0,
      explain:
        "`FnMut` olmak zorunda (`n`'i değiştiriyor) ve `impl` box'tan kurtarır. `fn() -> u32` düz bir fonksiyon pointer'ıdır; yakalanan state'i hiç taşıyamaz.",
    },
    {
      kind: "quiz",
      question: "Döndürülen bir closure'ı `impl Fn` yerine ne zaman box'lamak zorundasın?",
      options: [
        "Farklı dallar farklı closure'lar döndürdüğünde — `impl Trait` tek bir somut tipi adlandırır",
        "Closure `move` olduğu her durumda",
        "Closure birden fazla değişken yakaladığı her durumda",
      ],
      answer: 0,
      explain:
        "Her closure kendi anonim tipidir; dolayısıyla iki closure literal'i birebir aynı görünse bile iki ayrı tiptir. `impl Trait` yalnızca birinin yerine geçebilir.",
    },
    {
      kind: "editor",
      intro: `### Scope'undan uzun yaşayan closure'lar

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — \`n\`'in sahibidir, her çağrıda artırıp döndürür.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — \`"hello <name>"\` döndürür.
3. \`main\` içinde sayacı üç kez ayrı binding'lere çağır ve üçünü tek satırda yazdır, sonra \`rpc\` için greeter'ın çıktısını yazdır.

Beklenen çıktı:

\`\`\`text
11 12 13
hello rpc
\`\`\`

Sayaç \`10\`'dan başlar. Yazdırmadan önce her çağrıyı kendi değişkenine bağla — tek bir \`println!\` içinde üç \`&mut\` borrow, ihtiyacın olmayan bir kavgadır.`,
    },
  ],
};
