import type { LessonStep } from "@/content/steps";

// TR · Localized lesson steps — PART 1 (lessons 1–18 in steps.ts order).
// Keyed by lesson slug; a missing slug falls back to the English steps.
// Translate ONLY prose (body, question, options, prompt, explain, intro).
// Never touch code blocks' code, answer indexes, files, or option order.
export const steps1: Record<string, LessonStep[]> = {
  "rust-fundamentals-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `**Rust**'a hoş geldin. Hadi ilk programını yazalım.

Her Rust programı \`main\` fonksiyonundan başlar — giriş noktası. Programın çalıştığında çağrılan şey \`main\`'dir.

\`\`\`rust
fn main() {
    // rünlerin buraya gelecek
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Konsola metin yazdırmak için Rust sana \`println!\` **makrosunu** verir.

\`\`\`rust
println!("your text here");
\`\`\`

\`!\` işareti bunun bir fonksiyon değil, *makro* olduğunu söyler — bunun neden önemli olduğunu ileride öğreneceksin. Şimdilik: bir \`!\` gördüğünde "makro" diye düşün.`,
    },
    {
      kind: "quiz",
      question: "`println!` içindeki `!` sana ne söyler?",
      options: [
        "Bu bir makro, fonksiyon değil",
        "Metin yüksek sesle yazdırılır",
        "Bu satır asla başarısız olamaz",
      ],
      answer: 0,
      explain: "`!` bir makro çağrısını işaretler — println! Rust'ın en ünlü makrosudur.",
    },
    {
      kind: "fill",
      prompt: "Rünü tamamla: konsola metin yazdırsın.",
      file: "main.rs",
      before: "fn main() {\n    ",
      after: `("Hello, World!");\n}`,
      choices: ["println!", "print", "echo!"],
      answer: 0,
      explain: "println! metni yazdırır ve ardından yeni bir satıra geçer.",
    },
    {
      kind: "quiz",
      question: "Rust'ta ifadeler (statement) şununla biter…",
      options: ["noktalı virgülle ;", "noktayla .", "hiçbir şeyle — satır sonu yeterli"],
      answer: 0,
      explain: "Fener titizdir: her statement `;` ile biter.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — uyandırma sözlerini söyle

Program **tam olarak** şunu yazdırsın:

\`\`\`text
Hello, World!
\`\`\`

Büyük-küçük harf önemli: büyük H, büyük W. Metin çift tırnak arasına, parantezlerin içine yazılır — ve noktalı virgülü unutma.`,
    },
  ],

  "rust-fundamentals-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Programların değerleri göstermek ya da değiştirmek için onları **hatırlaması** gerekir. Bunun için Rust'ta \`let\` ile tanımlanan **değişkenler** var:

\`\`\`rust
let score = 50;
\`\`\`

Etiketli sandıklar gibi, değişkenlerin de bir içeriği vardır — ve içinde ne olduğunu söyleyen adları.`,
    },
    {
      kind: "theory",
      body: `Rust'ta değişkenler **varsayılan olarak değiştirilemez** (immutable). Bir kez bağlandı mı, değer bir daha değişmez.

\`\`\`rust
let x = 5;
x = 10; // ❌ derleme hatası: iki kez atama yapılamaz
\`\`\`

Derleyici bunu reddeder.`,
    },
    {
      kind: "quiz",
      question: "Bunu derlediğinde ne olur?\n\n`let x = 5; x = 10;`",
      options: [
        "Derleme hatası — x değiştirilemez",
        "x 10 olur",
        "x 15 olur",
      ],
      answer: 0,
      explain: "`mut` olmadan bir değişkene yeniden atama yapılamaz.",
    },
    {
      kind: "theory",
      body: `Yeniden atamaya izin vermek için \`mut\` ekle:

\`\`\`rust
let mut x = 5;
x = 10; // ✅ sorun yok
\`\`\`

\`mut\` yüksek sesle verilmiş bir sözdür: *bu değer değişecek*.`,
    },
    {
      kind: "fill",
      prompt: "`score`'u yeniden dövülebilir yap — onu mutable olarak tanımla.",
      file: "main.rs",
      before: "let ",
      after: " score = 50;\nscore = 100;",
      choices: ["mut", "var", "flex"],
      answer: 0,
      explain: "let mut score = 50; — artık yeniden atama derlenir.",
    },
    {
      kind: "quiz",
      question: "Hangi tanım daha sonra yeniden atamaya izin verir?",
      options: ["let mut power = 7;", "let power = 7;", "immutable power = 7;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Son sınav — kılıcı yeniden döv

Başlangıç kodu \`score\`'u değiştirilemez olarak tanımlıyor, sonra da onu değiştirmeye çalışıyor — derlenmez. Düzelt:

1. \`score\`'u **mutable** yap.
2. \`100\`'e yeniden atamayı koru.
3. Son skoru \`println!("score: {}", score);\` ile yazdır.

Beklenen çıktı:

\`\`\`text
score: 100
\`\`\``,
    },
  ],

  /* ───────────────────────── Perde I · 3–6 ───────────────────────── */

  "rust-fundamentals-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Rust'ta her değerin bir **tipi** vardır — yani biçimi. Ferrisia'nın şişelerini düşün: her birinin üstünde içinde ne olduğu yazar.

En çok kullanacağın üç biçim:

- \`i32\` — bir **tam sayı**: \`3\`, \`-7\`, \`2026\`
- \`f64\` — bir **ondalık sayı**: \`2.5\`, \`0.1\`
- \`bool\` — bir **evet/hayır değeri**: \`true\` ya da \`false\``,
    },
    {
      kind: "theory",
      body: `Rust tipi genellikle kendi başına tahmin edebilir — ama etiketi sen de koyabilirsin, ve Kale bunu tercih eder:

\`\`\`rust
let torches: i32 = 3;
let weight: f64 = 2.5;
let is_lit: bool = true;
\`\`\`

Kalıp hep aynı: \`let name: type = value;\` — etiket adın ardından, iki noktanın arkasına gelir.`,
    },
    {
      kind: "quiz",
      question: "`4.5` değerine hangi tip uyar?",
      options: ["f64 — ondalık sayı", "i32 — tam sayı", "bool — evet/hayır değeri"],
      answer: 0,
      explain: "Ondalık noktası olan her şey f64 gibi bir kayan noktalı tip ister.",
    },
    {
      kind: "fill",
      prompt: "Şişeyi etiketle: `is_open` içinde `true` var — bir evet/hayır değeri.",
      file: "main.rs",
      before: "let is_open: ",
      after: " = true;",
      choices: ["bool", "i32", "yes"],
      answer: 0,
      explain: "true ve false, bool tipinde yaşar.",
    },
    {
      kind: "quiz",
      question: "Tip etiketi nereye gelir?\n\n`let age ___ = 12;`",
      options: [": i32 — adın ardından, iki noktanın arkasına", "i32: — adın önüne", "as i32 — değerin ardına"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Son sınav — şişeleri etiketle

Rafta etiketsiz üç şişe duruyor. Her birine tipini ekle:

1. \`age\` bir tam sayı → \`i32\`
2. \`price\` bir ondalık → \`f64\`
3. \`is_open\` evet/hayır → \`bool\`

Beklenen çıktı:

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\``,
    },
  ],

  "rust-fundamentals-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Şimdiye dek kodunu \`main\`'in içine yazdın — ama baştan sona \`main\`'den ibaret bir program, duvara tek bir dev tarifin çivilendiği bir demirci ocağı gibidir.

Bir **fonksiyon**, bir kez yazıp sonsuza dek kullandığın bir tariftir: malzemeleri alır, işi yapar ve sana bir sonuç verir.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Tarifi parça parça oku:

- \`fn double\` — tarifin **adı**
- \`(x: i32)\` — **malzeme** ve tipi
- \`-> i32\` — **geri dönen** şeyin tipi

Ve son satırın sırrı: \`x * 2\` satırında **noktalı virgül yok**. Rust'ta noktalı virgülsüz son ifade, döndürülen değerin *ta kendisidir*.`,
    },
    {
      kind: "quiz",
      question: "`fn double(x: i32) -> i32 { x * 2 }` içinde `x * 2` neden noktalı virgülsüz?",
      options: [
        "Dönüş değeri o — ; olmayan ifadeler geri verilir",
        "Rust'ta noktalı virgül isteğe bağlıdır",
        "Yazım hatası",
      ],
      answer: 0,
      explain: "Noktalı virgülsüz son ifade, fonksiyonun döndürdüğü şeydir.",
    },
    {
      kind: "fill",
      prompt: "Tarifin imzasını tamamla: bir `i32` döndürüyor.",
      file: "main.rs",
      before: "fn add(a: i32, b: i32) ",
      after: " i32 {\n    a + b\n}",
      choices: ["->", "=>", ":"],
      answer: 0,
      explain: "-> dönüş tipini bildirir. (=> match kollarına aittir.)",
    },
    {
      kind: "quiz",
      question: "`add` tarifini 2 ve 3 ile çağırıp sonucu nasıl saklarsın?",
      options: ["let sum = add(2, 3);", "let sum = add 2 3;", "call add(2, 3) into sum;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Son sınav — tarifi yaz

\`main\` zaten \`add(2, 3)\` çağırıyor — ama tarif henüz yok. Onu \`main\`'in altına yaz:

1. Ad: \`add\`, parametreler \`a: i32\` ve \`b: i32\`.
2. Bir \`i32\` döndürür.
3. \`a + b\` döndürür — o satırda **noktalı virgül yok**.

Beklenen çıktı:

\`\`\`text
2 + 3 = 5
\`\`\``,
    },
  ],

  "rust-fundamentals-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Şimdi Rust'ı *Rust* yapan kural:

**Her değerin tam olarak bir sahibi vardır.**

\`\`\`rust
let sword = String::from("blade");
\`\`\`

Burada \`sword\` o String'in **sahibidir** (ownership). Bir hazine, bir bekçi. İstisnasız.`,
    },
    {
      kind: "theory",
      body: `Hazineyi başka bir ada devret, sahiplik **taşınır** (move):

\`\`\`rust
let a = String::from("gem");
let b = a;            // mücevher artık b'nin
println!("{}", a);    // ❌ hata: a'nın elinde hiçbir şey yok
\`\`\`

Bu zalimlik değil — Rust'ın her değeri kimin temizleyeceğini tam olarak bilme yolu bu: ne çöp toplayıcı var ne de sızıntı.`,
    },
    {
      kind: "quiz",
      question: "`let b = a;` sonrasında (`a` bir String), `a` ile ne yapabilirsin?",
      options: [
        "Hiçbir şey — sahiplik b'ye taşındı",
        "Normal şekilde kullanabilirsin",
        "Okuyabilirsin ama değiştiremezsin",
      ],
      answer: 0,
      explain: "Değer taşındı. `a`'yı yeniden kullanırsan kod derlenmez.",
    },
    {
      kind: "theory",
      body: `Bazen gerçekten **iki** hazineye ihtiyacın olur. O zaman gerçek, bağımsız bir kopya döversin:

\`\`\`rust
let b = a.clone();   // ✅ iki String, iki sahip
\`\`\`

\`.clone()\` gerçek emek ister — ustalar onu alışkanlıkla değil, bilerek kullanır.`,
    },
    {
      kind: "fill",
      prompt: "İki adı da kullanılabilir tut: `copy` bir move değil, gerçek bir kopya olsun.",
      file: "main.rs",
      before: "let sword = String::from(\"blade\");\nlet copy = sword",
      after: ";",
      choices: [".clone()", ".copy()", ".dup()"],
      answer: 0,
      explain: "clone() bağımsız bir String döver — iki sahip de yaşamaya devam eder.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — tek bekçi yasası

Başlangıç kodu \`sword\`'u \`copy\`'ye taşıyor, sonra \`sword\`'u yeniden kullanmaya çalışıyor — derleyici reddediyor. Taşımak yerine **klonlayarak** düzelt.

Beklenen çıktı:

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\``,
    },
  ],

  "rust-fundamentals-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Her şeyi klonlamak Forge'u iflas ettirir. Ödünç Muhafızı (Borrow Warden) daha iyi bir yol öğretir:

**Birinin bir değeri okuması için onu elden çıkarmak zorunda değilsin. Ödünç ver.**

Bir **referans** (\`&\`), bir fonksiyonun bir değeri *ödünç almasına* (borrow) izin verir — işi bitince değer kendiliğinden eline geri döner.`,
    },
    {
      kind: "theory",
      body: `İki küçük işaret bunu sağlar:

\`\`\`rust
fn inspect(item: &String) {  // ① ödünç alır, sahiplenmez
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);               // ② & ile ödünç ver
println!("{}", gem);         // ✅ hâlâ senin
\`\`\`

Tarifte \`&String\`, çağrıda \`&gem\`. Ödünç ver, oku, geri al.`,
    },
    {
      kind: "quiz",
      question: "`inspect(&gem)` içindeki `&` ne anlama gelir?",
      options: [
        "gem'i ödünç ver — inspect onu alır ve geri verir",
        "gem'i kalıcı olarak inspect'e taşı",
        "gem'in tam bir kopyasını çıkar",
      ],
      answer: 0,
      explain: "Referans ödünç alır. Sahiplik asla elinden çıkmaz.",
    },
    {
      kind: "fill",
      prompt: "Tarifi düzelt: adı alıp götürmek yerine *ödünç alsın*.",
      file: "main.rs",
      before: "fn greet(who: ",
      after: ") {\n    println!(\"welcome, {}\", who);\n}",
      choices: ["&String", "String", "clone String"],
      answer: 0,
      explain: "&String ödünç alır — adın sahibi main olarak kalır.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — kılıcı ödünç ver

\`greet\` şu anda adı **alıp götürüyor**, bu yüzden \`main\` onu kaybediyor. İki işareti de düzelt:

1. Parametre \`who: &String\` olsun.
2. Çağrı \`greet(&name);\` olsun.

Beklenen çıktı:

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\``,
    },
  ],

  /* ───────────────────────── Perde II · kontrol akışı ───────────────────────── */

  "control-flow-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Şimdiye dek programların satır satır, dümdüz aşağı aktı. Ama labirent **kararlar** ister.

\`if\`, kodu yalnızca bir koşul doğruysa çalıştırır:

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
}
\`\`\`

Koşul (\`torches > 0\`) bir \`bool\` olmalı — bir doğru/yanlış sorusu. Etrafına parantez gerekmez.`,
    },
    {
      kind: "theory",
      body: `\`else\`, \`if\`'in yakalamadığı her şeyi yakalar:

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
} else {
    println!("Darkness...");
}
\`\`\`

İki kapıdan tam olarak biri açılır. Asla ikisi birden, asla hiçbiri.`,
    },
    {
      kind: "quiz",
      question: "`let torches = 0;` ile yukarıdaki kod ne yazdırır?",
      options: ["Darkness...", "The hall is lit", "Hiçbir şey"],
      answer: 0,
      explain: "0 > 0 yanlıştır, o yüzden else kapısı açılır.",
    },
    {
      kind: "fill",
      prompt: "Koşulu tamamla: kasaya yalnızca `keys` 0'dan büyükse gir.",
      file: "main.rs",
      before: "if keys ",
      after: " 0 {\n    println!(\"enter\");\n}",
      choices: [">", "=", "=>"],
      answer: 0,
      explain: "> \"daha büyük mü?\" diye sorar. Tek bir = atamadır, soru değil.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — iki kapı

Odada \`torches = 3\` var. Kararı yaz:

1. **If** \`torches > 0\` → \`The hall is lit\` yazdır
2. **Else** → \`Darkness...\` yazdır

Beklenen çıktı:

\`\`\`text
The hall is lit
\`\`\``,
    },
  ],

  "control-flow-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bir \`if / else if / else\` zinciri çabucak hantallaşır. "Bir değeri birçok olasılıkla karşılaştır" işi için Rust'ın daha keskin bir aracı var: \`match\`.

\`\`\`rust
match number {
    1 => println!("one"),
    2 => println!("two"),
    _ => println!("many"),
}
\`\`\`

Her satır bir **koldur** (arm): \`desen => yapılacak şey\`.`,
    },
    {
      kind: "theory",
      body: `İki kural \`match\`'i Hükümdar'ın gözdesi yapar:

1. **Her durum kapsanmalı.** \`_\` kolu "geri kalan her şey" demektir — unutursan derleyici reddeder.
2. **Bir match, saklayabileceğin bir değer üretir:**

\`\`\`rust
let word = match number {
    1 => "one",
    _ => "many",
};
\`\`\``,
    },
    {
      kind: "quiz",
      question: "Bir match içindeki `_` kolu ne anlama gelir?",
      options: [
        "Geri kalan her şey — hepsini yakalayan durum",
        "Boş bir değer",
        "Bu match'i atla",
      ],
      answer: 0,
      explain: "match her olasılığı kapsamak zorundadır; _ geri kalanı süpürür.",
    },
    {
      kind: "fill",
      prompt: "Kolu tamamla: `2` numaralı kapı merkeze çıkar.",
      file: "main.rs",
      before: "let path = match door {\n    1 => \"left\",\n    2 ",
      after: " \"center\",\n    _ => \"no door\",\n};",
      choices: ["=>", "->", ":"],
      answer: 0,
      explain: "Match kolları => kullanır (fonksiyonlar dönüş tipi için -> kullanır).",
    },
    {
      kind: "editor",
      intro: `### Son sınav — her yansımaya bir ad

\`door = 2\`. Match'i kur:

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. \`_\` → \`"no door"\`
4. Sonucu \`path\` içinde sakla, sonra \`println!("{}", path);\`

Beklenen çıktı:

\`\`\`text
center
\`\`\``,
    },
  ],

  "control-flow-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bazen bir şeyi *sen* durmaya karar verene dek tekrarlaman gerekir. Rust'ın en basit tekrarı \`loop\`'tur — **sonsuza dek** çalışır:

\`\`\`rust
loop {
    println!("again...");
}
\`\`\`

Sonsuza dek. Kaçmazsan.`,
    },
    {
      kind: "theory",
      body: `\`break\` kaçış sözcüğüdür — döngüden anında çıkar:

\`\`\`rust
let mut count = 0;
loop {
    count += 1;      // += ekler ve saklar: count = count + 1
    if count == 3 {
        break;       // dışarı!
    }
}
\`\`\`

\`==\` (bir soru: "eşit mi?") ile \`=\` (bir emir: "bunu sakla") arasındaki farka dikkat.`,
    },
    {
      kind: "quiz",
      question: "İçinde `break` olmayan bir `loop`'a ne olur?",
      options: [
        "Sonsuza dek çalışır — program asla ilerlemez",
        "Bir kez çalışır",
        "Derleyici kendiliğinden bir break ekler",
      ],
      answer: 0,
      explain: "`break` olmadan onu hiçbir şey durdurmaz.",
    },
    {
      kind: "fill",
      prompt: "Sayaç 3'e ulaşınca kaç.",
      file: "main.rs",
      before: "loop {\n    count += 1;\n    if count == 3 {\n        ",
      after: ";\n    }\n}",
      choices: ["break", "stop", "exit"],
      answer: 0,
      explain: "break döngüden adım ortasında çıkar.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — sonsuz koridoru kır

1. Bir \`loop\` içinde her turda \`echoes\` değerine \`1\` ekle (\`echoes += 1;\`).
2. \`echoes == 3\` olunca \`break\`.

Beklenen çıktı:

\`\`\`text
escaped after 3 echoes
\`\`\``,
    },
  ],

  "control-flow-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`loop\` + \`if\` + \`break\` işe yarar, ama çıkış koşulu baştan belliyse daha temiz bir rün var: \`while\`.

\`\`\`rust
while floors > 0 {
    println!("descending...");
    floors -= 1;
}
\`\`\`

**Koşul geçerli olduğu sürece tekrarla.** Kontrol her turdan *önce* yapılır — daha en başta yanlışsa gövde hiç çalışmaz.`,
    },
    {
      kind: "quiz",
      question: "`let mut floors = 0;` ile `while floors > 0 { ... }` kaç kez çalışır?",
      options: [
        "Sıfır — koşul ilk turdan önce kontrol edilir",
        "Bir kez, sonra durur",
        "Sonsuza dek",
      ],
      answer: 0,
      explain: "while önce kontrol eder, sonra harekete geçer. 0 > 0 daha baştan yanlış.",
    },
    {
      kind: "theory",
      body: `Bir tehlike: koşul hiç yanlış olmazsa \`while\` sonsuza dek döner — tıpkı \`loop\` gibi.

Bu yüzden gövde genellikle koşulun bağlı olduğu bir şeyi **değiştirir**:

\`\`\`rust
while floors > 0 {
    floors -= 1;   // ← döngüyü bitiren dalga
}
\`\`\``,
    },
    {
      kind: "fill",
      prompt: "Kat kaldığı sürece inmeye devam et.",
      file: "main.rs",
      before: "",
      after: " floors > 0 {\n    println!(\"floor {}\", floors);\n    floors -= 1;\n}",
      choices: ["while", "until", "if"],
      answer: 0,
      explain: "while tekrarlar; if yalnızca bir kez karar verir.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — dalgayı geride bırak

1. \`floors > 0\` **olduğu sürece**: \`floor {}\` yazdır, sonra \`floors -= 1;\`
2. Döngüden sonra: \`Ground level!\` yazdır

Beklenen çıktı:

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\``,
    },
  ],

  "control-flow-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Yolu önceden biliyorsan — "1'den 5'e her sayı" — kendi sayacını yönetmek sana yakışmaz. \`for\` diziyi senin yerine yürür:

\`\`\`rust
for n in 1..=5 {
    println!("step {}", n);
}
\`\`\`

Her turda \`n\` sıradaki değeri alır: 1, 2, 3, 4, 5. Unutulacak sayaç yok, sınırı aşmanın yolu yok.`,
    },
    {
      kind: "theory",
      body: `\`1..=5\` bir **aralıktır** (range) — ve \`=\` önemlidir:

- \`1..=5\` → 1, 2, 3, 4, **5** (dahil)
- \`1..5\` → 1, 2, 3, 4 (5'ten *önce* durur)

Bir eksik/bir fazla hatası (off-by-one) labirentin en eski tuzağıdır. \`=\` onu etkisiz kılma yolun.`,
    },
    {
      kind: "quiz",
      question: "`for n in 1..4` hangi sayıları üretir?",
      options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"],
      answer: 0,
      explain: "= olmadan aralık, sonuna gelmeden durur.",
    },
    {
      kind: "fill",
      prompt: "1'den 5'e kadar taşları yürü — 5 **dahil**.",
      file: "main.rs",
      before: "for n in 1",
      after: "5 {\n    println!(\"step {}\", n);\n}",
      choices: ["..=", "..", "to"],
      answer: 0,
      explain: "..= son taşı da dahil eder.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — sayılı adımlar

Beş basamak taşını geç:

1. \`1..=5\` aralığı üzerinde \`for\`
2. Her sayı için \`step {}\` yazdır.

Beklenen çıktı:

\`\`\`text
step 1
step 2
step 3
step 4
step 5
\`\`\``,
    },
  ],

  "control-flow-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Artık her rünü biliyorsun — \`if\`, \`match\`, \`loop\`, \`while\`, \`for\`. Hükümdar'ın labirenti onları **birleştirmeni** ister: bir tekrarın *içinde* bir karar.

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Yeni sembol \`%\`, bir bölmenin **kalanını** verir:

- \`7 % 3\` → \`1\` (7 ÷ 3 = 2, kalan **1**)
- \`9 % 3\` → \`0\` (tam bölünür)

Yani \`n % 3 == 0\` şunu sorar: *"n 3'e bölünüyor mu?"* — her üçüncü aynayı bulmanın klasik yolu.`,
    },
    {
      kind: "quiz",
      question: "`10 % 3` kaçtır?",
      options: ["1 — 10 ÷ 3 işleminin kalanı", "3 — bölmenin sonucu", "0 — tam bölünür"],
      answer: 0,
      explain: "10 = 3×3 + 1. % operatörü sana o 1'i verir.",
    },
    {
      kind: "fill",
      prompt: "Soruyu sor: `n` 3'e bölünüyor mu?",
      file: "main.rs",
      before: "if n % 3 ",
      after: " 0 {\n    println!(\"mirror\");\n}",
      choices: ["==", "=", "%"],
      answer: 0,
      explain: "== karşılaştırır. Tek bir = atama yapmaya kalkar.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — Hükümdar'ın labirenti

On aynayı yürü:

1. \`for n in 1..=10\`
2. **If** \`n % 3 == 0\` → \`mirror\` yazdır
3. **Else** → \`n\` sayısını yazdır

Beklenen çıktı:

\`\`\`text
1
2
mirror
4
5
mirror
7
8
mirror
10
\`\`\``,
    },
  ],

  /* ───────────────────── Perde III · standart kütüphane ───────────────────── */

  "rust-standard-library-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bir değişken **tek** bir değer tutar. Ama maceralar *listeler* üretir: eşyalar, sikkeler, adlar. Bunun için diyarın gözde aracı \`Vec\`'tir — büyüyen bir çanta:

\`\`\`rust
let mut items = vec!["torch", "rope"];
\`\`\`

\`vec![...]\` onu içi dolu olarak oluşturur. Değiştirmeyi planlıyorsan \`mut\` gerekir — ve planlıyorsun.`,
    },
    {
      kind: "theory",
      body: `Sürekli kullanacağın iki hamle:

\`\`\`rust
items.push("map");    // sona ekle — çanta büyür
items.len()           // içinde kaç tane var? → 3
\`\`\`

Ve dikkat: konumlar **sıfırdan** sayılır. \`items[0]\` \`"torch"\`, \`items[1]\` ise \`"rope"\`'tur.`,
    },
    {
      kind: "quiz",
      question: "`let mut v = vec![10, 20]; v.push(30);` sonrasında `v[0]` nedir?",
      options: ["10 — konumlar sıfırdan sayılır", "30 — push onu başa koyar", "20 — ikinci öğe"],
      answer: 0,
      explain: "push SONA ekler; indeksleme 0'dan başlar.",
    },
    {
      kind: "fill",
      prompt: "Çantayı büyüt: sona `\"map\"` ekle.",
      file: "main.rs",
      before: "let mut satchel = vec![\"torch\", \"rope\"];\nsatchel.",
      after: "(\"map\");",
      choices: ["push", "add", "append_one"],
      answer: 0,
      explain: "push bir Vec'in sonuna tek bir öğe ekler.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — çantayı hazırla

1. \`vec!["torch", "rope"]\` ile **mutable** bir \`satchel\` oluştur.
2. \`"map"\` değerini \`push\`'la.
3. \`satchel.len()\` ile \`items: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
items: 3
\`\`\``,
    },
  ],

  "rust-standard-library-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Diyarın en tembel işçileriyle tanış: **iterator**'lar. Bir iterator, bir koleksiyonu baştan sona yürüyeceğine söz verir — sonra da sen bir sonuç isteyene dek *hiçbir şey* yapmaz.

\`\`\`rust
coins.iter()   // bekleyen tembel ruhlardan bir zincir
\`\`\`

Onlara farkında olmadan zaten komuta ettin: \`for n in 1..=5\` altta bir iterator sürer.`,
    },
    {
      kind: "theory",
      body: `Büyü, **zinciri bitirmekte**. Bir sonuç iste, ruhlar nihayet çalışsın:

\`\`\`rust
let coins = vec![5, 10, 25];
let total: i32 = coins.iter().sum();   // → 40
\`\`\`

\`total\` üstündeki \`: i32\` tip etiketi \`.sum()\`'a ne üreteceğini söyler — onu atlama.`,
    },
    {
      kind: "quiz",
      question: "`coins.iter()` **tek başına**, ardında `.sum()` olmadan ne yapar?",
      options: [
        "Henüz hiçbir şey — iterator'lar toplanana dek tembeldir",
        "Sikkeleri hemen toplar",
        "Tüm Vec'i kopyalar",
      ],
      answer: 0,
      explain: "Sen toplayana dek parmaklarını bile kıpırdatmazlar. Zincirleri ucuz kılan da bu tembelliktir.",
    },
    {
      kind: "fill",
      prompt: "Zinciri bitir: ruhlar her şeyi toplasın.",
      file: "main.rs",
      before: "let total: i32 = coins.iter().",
      after: "();",
      choices: ["sum", "total", "add_all"],
      answer: 0,
      explain: ".sum() zinciri tüketir ve tek bir değer döndürür.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — serveti topla

\`coins = vec![5, 10, 25]\`.

1. Topla: \`let total: i32 = coins.iter().sum();\`
2. \`total: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
total: 40
\`\`\``,
    },
  ],

  "rust-standard-library-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `İstifçi'nin gözde tuzağı: 2 öğeli bir Vec ve 5 numaralı yuvaya uzanan bir maceracı.

\`\`\`rust
let vault = vec!["hammer", "chisel"];
vault[5]   // 💥 PANIC — program çöker
\`\`\`

Köşeli parantezler yuvanın var olduğunu *varsayar*.`,
    },
    {
      kind: "theory",
      body: `Kibar soru \`.get()\`'tir:

\`\`\`rust
vault.get(0)   // → Some(&"hammer")  — yuva var
vault.get(5)   // → None             — çökme yok, sadece "orada bir şey yok"
\`\`\`

O \`Some / None\` cevabı bir \`Option\`'dır — Kaybolan Bataklık'tan ilk tadımın. Bir yedekle eşleştir: \`vault.get(5).unwrap_or(&"nothing")\`.`,
    },
    {
      kind: "quiz",
      question: "`vault` içinde 2 öğe var. `vault.get(5)` ne döndürür?",
      options: [
        "None — sakin bir \"orada bir şey yok\"",
        "Programı çökertir",
        "Son öğeyi",
      ],
      answer: 0,
      explain: "get asla çökmez — Some(&item) ya da None diye cevap verir.",
    },
    {
      kind: "fill",
      prompt: "5 numaralı yuvayı **kibarca** iste — çökmek yasak.",
      file: "main.rs",
      before: "let tool = vault.",
      after: "(5).unwrap_or(&\"nothing\");",
      choices: ["get", "[]", "grab"],
      answer: 0,
      explain: "get(5) bir Option döndürür; unwrap_or yedeği sağlar.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — boş olabilecek raf

Kasada 2 alet var. Yine de \`5\` numaralı yuvayı iste — güvenle:

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. \`found: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
found: nothing
\`\`\``,
    },
  ],

  "rust-standard-library-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bir Vec **konuma** göre cevap verir. Ama İstifçi'nin defteri **ada** göre cevap verir: "altın?" diye sor, "100" desin.

İşte bu bir \`HashMap\` — değerlere bağlanmış anahtarlar:

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
\`\`\`

Kasaların daha derininde yaşar (\`std::collections\`), o yüzden en üstte \`use\` satırı gerekir.`,
    },
    {
      kind: "theory",
      body: `Deftere yazmak ve defteri okumak:

\`\`\`rust
ledger.insert("gold", 100);     // anahtar → değer bağla
ledger.insert("silver", 250);

println!("{}", ledger["gold"]); // anahtarla sor → 100
\`\`\`

Kayıtlar **belirli bir sıra** tutmaz — büyü, sırayı anında cevaplarla takas eder.`,
    },
    {
      kind: "quiz",
      question: "\"gold\" zaten varken `insert(\"gold\", 999)` yaparsan ne olur?",
      options: [
        "Eski değer değiştirilir — her anahtara tek değer",
        "Map iki değeri de tutar",
        "Yinelenen anahtar hatasıyla çöker",
      ],
      answer: 0,
      explain: "Bir anahtar tam olarak tek bir değere bağlanır; yeniden insert etmek üzerine yazar.",
    },
    {
      kind: "fill",
      prompt: "Hazineyi kaydet: `\"gold\"` anahtarını `100` değerine bağla.",
      file: "main.rs",
      before: "ledger.",
      after: "(\"gold\", 100);",
      choices: ["insert", "push", "set"],
      answer: 0,
      explain: "HashMap'ler insert(key, value) kullanır — push Vec'e aittir.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — büyülü defter

1. \`("gold", 100)\` ve \`("silver", 250)\` insert et.
2. \`ledger["gold"]\` kullanarak \`gold: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
gold: 100
\`\`\``,
    },
  ],

  "rust-standard-library-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`String\` ile sahiplik kasasında tanışmıştın — şimdi onu **büyütmeyi** öğren:

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");   // sona metin ekle
\`\`\`

\`push_str\` metin ekler; kuzeni \`push\` ise tek bir karakter ekler.`,
    },
    {
      kind: "theory",
      body: `Ve dokuma büyüsü — \`format!\`:

\`\`\`rust
let banner = format!("The {}", s);
\`\`\`

**Tam olarak** \`println!\` gibi çalışır — aynı \`{}\` yuvaları — ama yazdırmak yerine yeni String'i saklaman için sana verir.`,
    },
    {
      kind: "quiz",
      question: "`println!(\"The {}\", s)` ile `format!(\"The {}\", s)` arasındaki fark ne?",
      options: [
        "println! yazdırır; format! ise String'i döndürür",
        "format! daha hızlıdır",
        "println! {} yuvalarını kullanamaz",
      ],
      answer: 0,
      explain: "Aynı büyü, farklı hedef — konsol ya da senin ellerin.",
    },
    {
      kind: "fill",
      prompt: "Yazıtı büyüt: sona `\" of the Vaults\"` ekle.",
      file: "main.rs",
      before: "let mut title = String::from(\"Keeper\");\ntitle.",
      after: "(\" of the Vaults\");",
      choices: ["push_str", "push", "append"],
      answer: 0,
      explain: "push_str metin ekler; push tek bir karakter ekler.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — yaşayan yazıt

1. \`push_str\` ile \`title\` değerine \`" of the Vaults"\` ekle.
2. \`let banner = format!("The {}", title);\`
3. Banner'ı yazdır.

Beklenen çıktı:

\`\`\`text
The Keeper of the Vaults
\`\`\``,
    },
  ],

  "rust-standard-library-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `İstifçi hazinenin dışarı çıkmasına izin vermez — ama **bakmana** izin verir. Bir **slice** (dilim), bir koleksiyonun bir kesitine açılan penceredir:

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

Kopya yapılmaz. \`&\` bunun bir ödünç alma olduğunu işaretler — İstifçi'nin rafına bakıyorsun, onu dışarı taşımıyorsun.`,
    },
    {
      kind: "theory",
      body: `Kenarlara dikkat — \`for\` aralıklarıyla aynı kural:

- \`1..4\` → 1, 2, 3 numaralı yuvalar (sonu **hariç**)
- \`1..=4\` → 1, 2, 3, 4 numaralı yuvalar (sonu dahil)

Ve bir slice'ın tamamını yazdırmak için **debug işaretini** \`{:?}\` kullan:

\`\`\`rust
println!("{:?}", window);   // [2, 3, 4]
\`\`\``,
    },
    {
      kind: "quiz",
      question: "`vec![10, 20, 30, 40]` için `&v[0..2]` nedir?",
      options: ["[10, 20] — son hariç", "[10, 20, 30] — son dahil", "[20, 30]"],
      answer: 0,
      explain: "0..2, 0 ve 1 numaralı yuvaları kapsar. Pencere sonunu dışarıda bırakır.",
    },
    {
      kind: "fill",
      prompt: "Pencereyi yazdır — slice'lar debug işareti ister.",
      file: "main.rs",
      before: "println!(\"",
      after: "\", window);",
      choices: ["{:?}", "{}", "{window}"],
      answer: 0,
      explain: "{:?} debug işaretidir — koleksiyonlar onunla yazdırılır.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — hazineye açılan pencere

1. Ortayı al: \`let middle = &shelf[1..4];\`
2. \`middle: {:?}\` yazdır.

Beklenen çıktı:

\`\`\`text
middle: [2, 3, 4]
\`\`\``,
    },
  ],
};
