import "server-only";

// TR · Localized lesson `instructions` markdown (server-only, like the source).
// ONLY instructions are localized — starter code, expected output and the
// hidden grading checks stay locale-neutral in content/lessons.ts.
export const lessonText: Record<string, { instructions: string }> = {
  "rust-fundamentals-1": {
    instructions: `## Hello, World!

Her Rust programı \`main\` fonksiyonundan başlar. Giriş noktası budur — programın çalıştığında çağrılan şey \`main\`'dir.

Konsola metin yazdırmak için Rust sana \`println!\` **makrosunu** verir (\`!\` bunun bir fonksiyon değil, makro olduğunu gösterir — bunun neden önemli olduğunu ileride öğreneceksin).

\`\`\`rust
println!("your text here");
\`\`\`

### Görevin

Programın tam olarak şunu yazdırmasını sağla:

\`\`\`text
Hello, World!
\`\`\`

### İpuçları

- Metin, parantezlerin içinde, çift tırnak arasına yazılır.
- Rust'ta ifadeler noktalı virgülle \`;\` biter.
- Büyük-küçük harf önemli: \`Hello, World!\` — büyük H, büyük W.
`,
  },

  "rust-fundamentals-2": {
    instructions: `## Değişkenler ve Mutability

Rust'ta değişkenler \`let\` ile tanımlanır — ve **varsayılan olarak immutable'dır** (değiştirilemez). Bir kez bağlandı mı, değer bir daha değişemez:

\`\`\`rust
let x = 5;
x = 10; // ❌ derleme hatası: immutable bir değişkene iki kez atama yapılamaz
\`\`\`

Yeniden atamaya izin vermek için değişkeni \`mut\` ile mutable (değiştirilebilir) olarak işaretle:

\`\`\`rust
let mut x = 5;
x = 10; // ✅ sorun yok
\`\`\`

### Görevin

Başlangıç kodu \`score\`'u immutable olarak tanımlayıp sonra değiştirmeye çalışıyor — derlenmeyecek. Düzelt:

1. \`score\`'u **mutable** yap.
2. \`100\`'e yeniden atamayı koru.
3. Son skoru \`println!("score: {}", score);\` ile yazdır.

Beklenen çıktı:

\`\`\`text
score: 100
\`\`\`
`,
  },

  "rust-fundamentals-3": {
    instructions: `## Veri Tipleri

Rust'ta her değerin bir **tipi** vardır — yani biçimi. Rust genellikle bunu kendisi tahmin edebilir, ama sen de etiketleyebilirsin (ve çoğu zaman etiketlemelisin):

\`\`\`rust
let torches: i32 = 3;      // tam sayı
let weight: f64 = 2.5;     // ondalıklı sayı
let is_lit: bool = true;   // evet/hayır değeri
\`\`\`

### Görevin

Başlangıç kodundaki üç değişkeni tipleriyle etiketle:

1. \`age\` bir tam sayı → \`i32\`
2. \`price\` bir ondalıklı sayı → \`f64\`
3. \`is_open\` bir evet/hayır değeri → \`bool\`

Beklenen çıktı:

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\`

### İpuçları

- Tip, isimden sonra iki nokta ile ayrılarak yazılır: \`let name: type = value;\`
`,
  },

  "rust-fundamentals-4": {
    instructions: `## Fonksiyonlar

Bir **fonksiyon** bir tariftir: malzemeleri (parametreleri) alır, işi yapar ve bir sonuç geri verir.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\`

- Parametreler tiplerini belirtir: \`x: i32\`.
- \`-> i32\` geri dönen tipin ne olduğunu söyler.
- **Noktalı virgülsüz** son satır, döndürülen değerdir.

### Görevin

\`main\` zaten \`add(2, 3)\`'ü çağırıyor — ama tarif henüz yok. \`main\`'in altına yaz:

1. Adı \`add\` olsun, iki parametresi de \`a: i32\` ve \`b: i32\`.
2. Bir \`i32\` döndürsün.
3. \`a + b\` döndürsün (o satırda noktalı virgül yok!).

Beklenen çıktı:

\`\`\`text
2 + 3 = 5
\`\`\`
`,
  },

  "rust-fundamentals-5": {
    instructions: `## Ownership Temelleri

Rust'ın temel kuralı: **her değerin tam olarak bir sahibi (owner) vardır.** Bir \`String\`'i başka bir değişkene atadığında ownership (sahiplik) *taşınır* — eski isim artık kullanılamaz:

\`\`\`rust
let a = String::from("gem");
let b = a;            // ownership b'ye taşınır
println!("{}", a);    // ❌ hata: a artık hiçbir şeyin sahibi değil
\`\`\`

Gerçekten iki tane gerekiyorsa, \`.clone()\` ile gerçek bir kopya döv:

\`\`\`rust
let b = a.clone();    // ✅ birbirinden bağımsız iki String
\`\`\`

### Görevin

Başlangıç kodu \`sword\`'u \`copy\`'ye taşıyor, sonra \`sword\`'u tekrar kullanmaya çalışıyor — derlenmeyecek. Taşımak yerine **klonlayarak** düzelt.

Beklenen çıktı:

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\`
`,
  },

  "rust-fundamentals-6": {
    instructions: `## Borrowing ve Referanslar

Birinin bir değeri okuması için onu *elden çıkarmak* zorunda değilsin — **ödünç verebilirsin**. Bir referans (\`&\`), bir fonksiyonun değeri borrow etmesine (ödünç almasına) ve otomatik olarak geri vermesine izin verir:

\`\`\`rust
fn inspect(item: &String) {   // ödünç alır, sahiplenmez
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);                // & ile ödünç ver
println!("{}", gem);          // ✅ hâlâ senin
\`\`\`

### Görevin

\`greet\` şu anda ismin **ownership'ini alıyor**, bu yüzden \`main\` onu sonrasında kullanamıyor. Düzelt:

1. \`greet\`'i borrow edecek şekilde değiştir: parametre \`who: &String\` olsun.
2. Referansla çağır: \`greet(&name);\`

Beklenen çıktı:

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\`
`,
  },

  "control-flow-1": {
    instructions: `## if / else

Programlar \`if\` ile karar verir. Koşul bir \`bool\` olmalı — parantez gerekmez:

\`\`\`rust
if torches > 0 {
    // koşul doğruysa çalışır
} else {
    // aksi halde çalışır
}
\`\`\`

### Görevin

Odada \`torches = 3\` var. Kararı yaz:

1. **Eğer** \`torches\` \`0\`'dan büyükse, \`The hall is lit\` yazdır.
2. **Değilse**, \`Darkness...\` yazdır.

Beklenen çıktı:

\`\`\`text
The hall is lit
\`\`\`
`,
  },

  "control-flow-2": {
    instructions: `## match İfadeleri

\`match\`, bir değeri desenlerle karşılaştırır — ve Rust **seni her durumu kapsamaya zorlar**. \`_\` deseni "geri kalan her şey" demektir:

\`\`\`rust
let word = match number {
    1 => "one",
    2 => "two",
    _ => "many",
};
\`\`\`

\`match\` bir *ifadedir* (expression): saklayabileceğin bir değer üretir.

### Görevin

Odada üç kapı var ve \`door = 2\`. Bir \`match\` kur:

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. geri kalan her şey (\`_\`) → \`"no door"\`
4. Sonucu \`path\` içinde sakla ve yazdır.

Beklenen çıktı:

\`\`\`text
center
\`\`\`
`,
  },

  "control-flow-3": {
    instructions: `## loop

\`loop\` **sonsuza kadar** tekrar eder — sen \`break\` ile çıkana dek:

\`\`\`rust
loop {
    // tekrar tekrar çalışır...
    if enough {
        break; // ...ta ki buraya kadar
    }
}
\`\`\`

### Görevin

Sonsuz koridordan kaç:

1. Bir \`loop\` içinde, her turda \`echoes\` değerine \`1\` ekle.
2. \`echoes\` \`3\` olduğunda (\`echoes == 3\`), \`break\` ile çık.
3. Son yazdırma satırı zaten senin için yazılmış.

Beklenen çıktı:

\`\`\`text
escaped after 3 echoes
\`\`\`
`,
  },

  "control-flow-4": {
    instructions: `## while Döngüleri

\`while\`, **bir koşul geçerli olduğu sürece** tekrar eder — her turdan önce kontrol eder:

\`\`\`rust
while supplies > 0 {
    // bir gün daha...
}
\`\`\`

### Görevin

Batan galeriden aşağı in:

1. \`floors\` \`0\`'dan büyük **olduğu sürece**: \`floor {}\` (mevcut kat) yazdır, sonra \`floors\` değerinden \`1\` çıkar.
2. Döngüden sonra \`Ground level!\` yazdır.

Beklenen çıktı:

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\`
`,
  },

  "control-flow-5": {
    instructions: `## for Döngüleri

\`for\` bir dizinin üzerinde yürür — yönetilecek sayaç yok, sınırı aşma ihtimali yok:

\`\`\`rust
for n in 1..=5 {
    // n sırasıyla 1, 2, 3, 4, 5 olur
}
\`\`\`

\`1..=5\` bir **aralıktır** (range): 1'den başlar, **5 dahil** 5'e kadar gider. (\`=\` olmadan \`1..5\`, 4'te durur.)

### Görevin

Beş basamak taşını geç:

1. \`1..=5\` aralığıyla \`for\` kullan.
2. Her sayı için \`step {}\` yazdır.

Beklenen çıktı:

\`\`\`text
step 1
step 2
step 3
step 4
step 5
\`\`\`
`,
  },

  "control-flow-6": {
    instructions: `## İç İçe Kontrol Akışı

Asıl güçlü hamle: bir döngünün **içinde** bir karar. \`%\` operatörü bölme kalanını verir — \`n % 3 == 0\`, "n 3'e tam bölünür" demektir:

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\`

### Görevin

Salon'un on aynasını dolaş:

1. \`for n in 1..=10\`
2. **Eğer** \`n\` 3'e tam bölünüyorsa (\`n % 3 == 0\`), \`mirror\` yazdır.
3. **Değilse**, \`n\` sayısını yazdır.

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
\`\`\`
`,
  },

  "rust-standard-library-1": {
    instructions: `## Vec Temelleri

\`Vec\` büyüyebilen bir listedir:

\`\`\`rust
let mut items = vec!["torch", "rope"];  // içerikle birlikte oluştur
items.push("map");                       // büyüt
items.len()                              // kaç tane? → 3
\`\`\`

### Görevin

1. \`vec!["torch", "rope"]\` ile **mutable** bir \`satchel\` oluştur.
2. İçine \`"map"\` \`push\`'la.
3. \`satchel.len()\` ile \`items: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
items: 3
\`\`\`
`,
  },

  "rust-standard-library-2": {
    instructions: `## Iterator'lar

Bir **iterator**, bir koleksiyonun üzerinde tembelce (lazy) yürür — sen bir sonuç isteyene kadar hiç iş yapmaz:

\`\`\`rust
let total: i32 = coins.iter().sum();
\`\`\`

\`.iter()\` zinciri başlatır; \`.sum()\` hepsini tek bir değerde toplar. (\`total\` üzerindeki tip etiketi, \`sum\`'a ne üreteceğini söyler.)

### Görevin

Çantada \`coins = vec![5, 10, 25]\` var.

1. \`.iter().sum()\` ile hepsini \`total: i32\` içinde topla.
2. \`total: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
total: 40
\`\`\`
`,
  },

  "rust-standard-library-3": {
    instructions: `## .get ile Güvenli İndeksleme

2 elemanlı bir Vec'te \`vault[5]\` programı **çökertir**. Kibar soru \`.get(5)\`'tir — bir \`Option\` döndürür: slot varsa \`Some(&item)\`, yoksa \`None\`.

\`\`\`rust
let tool = vault.get(5).unwrap_or(&"nothing");
\`\`\`

\`unwrap_or\`, cevap \`None\` olduğunda bir yedek değer sağlar. (\`&\` işaretine dikkat — \`get\` referans dağıtır.)

### Görevin

Kasada 2 alet var; yine de \`5\` numaralı slotu iste:

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. \`found: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
found: nothing
\`\`\`
`,
  },

  "rust-standard-library-4": {
    instructions: `## HashMap

Bir \`HashMap\` **anahtarları değerlere** bağlar — anahtarla sor, değeri anında al:

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
ledger.insert("gold", 100);
println!("{}", ledger["gold"]);  // → 100
\`\`\`

\`std::collections\` içinde yaşar, bu yüzden en üstte bir \`use\` satırına ihtiyaç duyar.

### Görevin

1. Deftere \`("gold", 100)\` ve \`("silver", 250)\` ekle (insert).
2. \`ledger["gold"]\` kullanarak \`gold: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
gold: 100
\`\`\`
`,
  },

  "rust-standard-library-5": {
    instructions: `## String İşlemleri

\`String\` büyüyebilen metindir. Bugünlük iki araç:

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");              // metin ekle

let banner = format!("The {}", s);   // string'leri yeni bir string'de ör
\`\`\`

\`format!\` tıpkı \`println!\` gibi çalışır — ama yazdırmak yerine String'i döndürür.

### Görevin

1. \`push_str\` ile \`title\` sonuna \`" of the Vaults"\` ekle.
2. \`format!("The {}", title)\` ile \`banner\` oluştur.
3. Banner'ı yazdır.

Beklenen çıktı:

\`\`\`text
The Keeper of the Vaults
\`\`\`
`,
  },

  "rust-standard-library-6": {
    instructions: `## Slice'lar

Bir **slice**, bir koleksiyonun bir bölümüne açılan penceredir — kopyalama yok, sadece bir görünüm:

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

Aralık, başlangıcını içerir ve bitişini **dışarıda bırakır** (\`1..4\` → 1, 2, 3 numaralı slotlar). Bir slice'ı debug işaretçisi \`{:?}\` ile yazdır.

### Görevin

1. Rafın ortasını al: \`&shelf[1..4]\`.
2. \`middle: {:?}\` yazdır.

Beklenen çıktı:

\`\`\`text
middle: [2, 3, 4]
\`\`\`
`,
  },

  "rust-standard-library-7": {
    instructions: `## Struct'lar

Bir **struct**, ilişkili değerleri tek bir adlandırılmış tipte gruplar. Biçimi bir kez tanımla, sonra istediğin kadar örnek (instance) oluştur:

\`\`\`rust
struct Player {
    name: String,
    hp: i32,
}
\`\`\`

Her alana bir değer vererek, bir **struct literal** ile örnek oluştur:

\`\`\`rust
let hero = Player { name: String::from("Ferrisia"), hp: 100 };
\`\`\`

Bir alana nokta gösterimiyle eriş: \`hero.name\`, \`hero.hp\`.

### Görevin

1. \`name: String\` ve \`hp: i32\` alanlarına sahip bir \`Player\` struct'ı tanımla — tam bu sırayla.
2. \`name: String::from("Ferrisia")\` ve \`hp: 100\` ile \`hero\` adında bir \`Player\` oluştur.
3. Tam olarak şunu yazdır: \`Ferrisia has 100 hp\`.

### İpuçları

- Bu ders için struct tanımındaki alan sırası önemli: önce \`name\`, sonra \`hp\`.
- \`hero.name\` ve \`hero.hp\` ile \`{} has {} hp\` kullan.
`,
  },

  "rust-standard-library-8": {
    instructions: `## impl ve Metotlar

Tek başına bir struct yalnızca veri tutar. Bir \`impl\` bloğu ona davranış ekler — o tiple nasıl çalışılacağını bilen fonksiyonlar.

\`\`\`rust
impl Player {
    fn new(name: &str) -> Player {
        Player { name: String::from(name), hp: 100 }
    }

    fn is_alive(&self) -> bool {
        self.hp > 0
    }
}
\`\`\`

- \`new\` bir **associated function**'dır (ilişkili fonksiyon) — \`self\` almaz, \`Player::new(...)\` şeklinde çağrılır.
- \`is_alive\` bir **metottur** — \`&self\` alır, \`hero.is_alive()\` şeklinde çağrılır.

Rust'ın \`{:?}\` ile yazdırabileceğin bir debug görünümünü otomatik üretmesi için struct'ın üstüne \`#[derive(Debug)]\` ekle:

\`\`\`rust
#[derive(Debug)]
struct Player { /* ... */ }
\`\`\`

### Görevin

1. \`Player\` üstüne \`#[derive(Debug)]\` ekle.
2. \`impl Player\` içinde, verilen isimle ve \`hp: 100\` ile bir \`Player\` kuran \`new(name: &str) -> Player\` yaz.
3. \`self.hp > 0\` döndüren bir \`is_alive(&self) -> bool\` metodu yaz.
4. \`main\` içinde \`Player::new("Ferrisia")\` ile \`hero\` oluştur, \`hero.is_alive()\` ile \`alive: {}\` yazdır, sonra \`hero\` değerini \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
alive: true
Player { name: "Ferrisia", hp: 100 }
\`\`\`
`,
  },

  "mastering-option-1": {
    instructions: `## Some ya da None

\`Option<T>\`, Rust'ın *"bir değer olabilir — ya da olmayabilir"* deme biçimidir:

\`\`\`rust
enum Option<T> {
    Some(T),   // bir değer var, içine sarılmış
    None,      // hiçbir şey yok
}
\`\`\`

Cevabı olmayabilecek bir fonksiyon \`Option\` döndürür:

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

### Görevin

\`find\` fonksiyonunu tamamla: \`present\` true ise \`Some(7)\`, değilse \`None\` döndür.

Beklenen çıktı:

\`\`\`text
Some(7)
\`\`\`
`,
  },

  "mastering-option-2": {
    instructions: `## Güvenle Unwrap Et

\`.unwrap()\` değeri Option'ın içinden söküp alır — ve \`None\` görünce **panic** atar (çöker).

Güvenli kalıp yanında bir varsayılan taşır:

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

### Görevin

\`ghost\` bir \`None\`. Değeri **güvenle** çıkar:

1. \`let value = ghost.unwrap_or(0);\` — hiçbir yerde \`.unwrap()\` olmayacak.
2. \`value: {}\` yazdır.

Beklenen çıktı:

\`\`\`text
value: 0
\`\`\`
`,
  },

  "mastering-option-3": {
    instructions: `## if let

Yalnızca \`Some\` durumu umurundaysa, \`if let\` tek hamlede hem unwrap eder hem de değere isim verir:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light, unwrap edilmiş değer
} else {
    println!("darkness");
}
\`\`\`

### Görevin

Fener \`Some(3)\` taşıyor. Ona doğru düzgün sor:

1. \`if let Some(light) = lantern\` → \`light: {}\` yazdır.
2. \`else\` → \`darkness\` yazdır.

Beklenen çıktı:

\`\`\`text
light: 3
\`\`\`
`,
  },

  "mastering-result-1": {
    instructions: `## Ok ya da Err

\`Option\` *yokluğu* modellerken, \`Result\` **sebebiyle birlikte başarısızlığı** modeller:

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // çalıştı — işte değer
    Err(E),   // başarısız oldu — işte sebebi
}
\`\`\`

### Görevin

\`divide\` fonksiyonunu tamamla:

1. \`b == 0\` ise → \`Err(String::from("division by zero"))\`
2. Değilse → \`Ok(a / b)\`

Beklenen çıktı:

\`\`\`text
Ok(5)
\`\`\`
`,
  },

  "mastering-result-2": {
    instructions: `## Hükmü Okumak

Bir \`Result\` hakkında tahmin yürütmezsin — onu \`match\` ile açarsın ve derleyici **her iki** hükmün de ele alındığından emin olur:

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

### Görevin

Mahkeme sana \`Ok(42)\` veriyor. Hükmü oku:

1. \`Ok(v)\` → \`granted: {}\` yazdır
2. \`Err(e)\` → \`denied: {}\` yazdır

Beklenen çıktı:

\`\`\`text
granted: 42
\`\`\`
`,
  },

  "mastering-result-3": {
    instructions: `## ? Operatörü

Her \`Result\`'ı olduğu yerde ele almak mantığı gömer. \`?\` işareti hatayı **yukarı iletir**: \`Ok\` ise unwrap edip devam eder; \`Err\` ise hatayı anında *senin* çağıranına döndürür.

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // Err mi? → tam burada yukarı döndürülür
    Ok(n * 2)
}
\`\`\`

\`?\` yalnızca kendisi de \`Result\` (ya da \`Option\`) döndüren fonksiyonların içinde çalışır.

### Görevin

\`double_first\` fonksiyonunu tamamla:

1. \`let n = parse("21")?;\`
2. \`Ok(n * 2)\` döndür.

Beklenen çıktı:

\`\`\`text
Ok(42)
\`\`\`
`,
  },

  "stellar-101-1": {
    instructions: `## Hesaplar ve Anahtar Çiftleri

Stellar'daki her aktör bir **hesaptır** ve bir **anahtar çifti** tarafından kontrol edilir:

- **Public key (açık anahtar)** — \`G\` ile başlar. Senin adresin; gönül rahatlığıyla paylaş.
- **Secret key (gizli anahtar)** — \`S\` ile başlar. Her şeyi o imzalar; **asla** paylaşma. Kaybedersen hesap sonsuza dek gider.

Bir hesabın ledger'da (defterde) var olabilmesi için minimum bir bakiye (**base reserve**) tutması gerekir: **1 XLM**.

### Görevin

Yıldız kalesinin beratını tamamla — üç değeri doldur.

Beklenen çıktı:

\`\`\`text
star-keep chartered ✓
\`\`\`
`,
  },

  "stellar-101-2": {
    instructions: `## Lumen'ler ve Ücretler

Yerel varlık **lumen (XLM)**, en küçük birimi ise **stroop**'tur:

- \`1 XLM = 10_000_000 stroops\` (on milyon)
- Her işlem küçük bir ücret öder — temel ücret **100 stroop** (0.00001 XLM)

Bu ücret gelir değil — ağı herkes için hızlı tutan bir spam önleme geçiş vergisi.

### Görevin

Geçiş levhasındaki iki sayıyı doldur.

Beklenen çıktı:

\`\`\`text
toll paid ✓
\`\`\`
`,
  },

  "stellar-101-3": {
    instructions: `## Trustline'lar ve Varlıklar

XLM'nin ötesinde, herhangi bir hesap **varlık ihraç edebilir** (dolar, puan, bilet…). Bir varlık iki şeyle tanımlanır:

- bir **varlık kodu** — ör. \`USDC\`
- **ihraççı (issuer)** — onu yaratan hesap (bir \`G...\` adresi)

Ama hesabın rıza göstermediği hiçbir şeyi tutmaz: bir varlığı alabilmek için önce ona bir **trustline** açman gerekir. Trustline yoksa bakiye de yok.

### Görevin

Işık köprüsünü aç: **USDC** için trustline'ı doldur.

Beklenen çıktı:

\`\`\`text
light-bridge opened ✓
\`\`\`
`,
  },

  "stellar-101-4": {
    instructions: `## İlk Ödemen

Bir **payment operation** (ödeme işlemi) tam olarak üç şeye ihtiyaç duyar:

1. **destination** — alıcı hesap (\`G...\`)
2. **asset** — ne gönderdiğin (yerel lumen için \`XLM\`)
3. **amount** — ne kadar

Gizli anahtarınla imzala, ~100 stroop'luk geçiş vergisini öde ve ~5 saniyede kesinleşsin. Banka yok, iş günü yok.

### Görevin

İlk ödemeni gönder: **25 XLM**.

Beklenen çıktı:

\`\`\`text
lumens flowing ✓
\`\`\`
`,
  },

  "soroban-smart-contracts-1": {
    instructions: `## İlk Kontratın

Bir Soroban kontratı, WASM'a derlenip ledger'a (deftere) deploy edilmiş bir Rust kütüphanesidir. Onu kontrat yapan üç şey var:

- \`#![no_std]\` — işletim sistemi yok, heap ayırıcı yok, standart kütüphane yok. Makine, ledger'ın kendisi.
- Bir unit struct üstünde \`#[contract]\` — kontratın kimliği.
- impl bloğu üstünde \`#[contractimpl]\` — \`pub fn\`'lerini çağrılabilir girişler olarak dışa aktarır. Her giriş ilk parametre olarak \`Env\` alır: depolamaya, event'lere ve kontratlar arası çağrılara açılan kapın.

Zincir üstünde string'ler pahalıdır; kısa tanımlayıcılar \`Symbol\` kullanır (\`symbol_short!\` ile ≤ 9 karakter).

### Görevin

1. impl bloğunu \`#[contractimpl]\` ile işaretle.
2. \`hello\` fonksiyonunun \`symbol_short!("beacon")\` döndürmesini sağla.

Beklenen çağrı sonucu:

\`\`\`text
hello() → Symbol(beacon)
\`\`\`
`,
  },

  "soroban-smart-contracts-2": {
    instructions: `## Kontrat Depolaması

Kontratlar çağrılar arasında durum tutmaz — durum **ledger**'da, \`env.storage()\` arkasında yaşar. Kontrat geneli durum için **instance** storage kullan:

\`\`\`rust
let count: u32 = env.storage().instance().get(&KEY).unwrap_or(0);
env.storage().instance().set(&KEY, &count);
\`\`\`

\`get\` bir \`Option<T>\` döndürür, çünkü anahtar hiç yazılmamış olabilir; bu yüzden sayaçlar için kalıp \`unwrap_or(0)\`'dır. Süresi dolmuş bir instance girdisi \`None\` olarak dönmez: arşivlenir ve işlem, kodun çalışmadan önce onu geri yükler (ya da kodu hiç çalıştırmadan başarısız olur). Anahtarlar ve değerler referansla geçirilir.

### Görevin

\`increment\` fonksiyonunu gerçekle:

1. Mevcut sayacı instance storage'dan \`COUNTER\` anahtarıyla oku (varsayılan \`0\`).
2. \`1\` ekle.
3. \`set\` ile geri yaz.
4. Yeni sayacı döndür.

Beklenen çağrı sonucu:

\`\`\`text
increment() → 1
\`\`\`
`,
  },

  "soroban-smart-contracts-3": {
    instructions: `## Yetkilendirme

Soroban'daki her \`Address\`, bir çağrıyı onayladığını kanıtlayabilir. Kontrat tarafındaki kontrol tek satır:

\`\`\`rust
from.require_auth();
\`\`\`

İşlem \`from\` tarafından imzalanmadıysa (ya da önceden yetkilendirilmediyse) çağrı **trap** olur — duruma dokunulmaz. Para taşıyan bir fonksiyonda bu satırı atlamak klasik ölümcül bug'dır: herkes herhangi bir adresi geçirip kasayı boşaltabilir.

### Görevin

Kasayı koru. \`withdraw\` içinde, başka **hiçbir şey** olmadan önce \`from\` adresinden yetkilendirme iste.

Beklenen çağrı sonucu:

\`\`\`text
withdraw: authorized ✓
\`\`\`
`,
  },

  "stellar-protocol-27-1": {
    instructions: `## Protocol 27: The Zipper

Stellar kendini sessizce yamamaz — ağ **oylamayla** yükseltilir. Validator'lar yeni bir protokol sürümünü kurar ve planlanan ledger'da *ağın tamamı* aynı anda geçiş yapar. Fork yok, geride kalan yok.

**Protocol 27 — kod adı "Zipper"** — 2026 yükseltmesi. Çoktan yaşanmış olan zaman çizelgesi:

- Stellar Core kararlı sürüm — **5 Haziran 2026**
- SDK sürümleri — 5–11 Haziran · RPC & Galexie — 10 Haziran · Horizon — 12 Haziran
- **Testnet yükseltildi — 18 Haziran 2026**
- **Mainnet oylaması — 8 Temmuz 2026**

İki manşet değişikliği de [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) içinde yaşıyor: custom account'lar için **authentication delegation** (kimlik doğrulama devri) ve **adrese bağlı imza payload'ları**. (Önceki protokoller CAP-0055/0060/0064'ü getirmişti — Zipper ise hesapların *kim olduklarını nasıl kanıtladığıyla* ilgili.)

Resmi [Protocol 27 yükseltme rehberini](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide) oku ve [Software Versions](https://developers.stellar.org/docs/networks/software-versions) sayfasını yer imlerinde tut.

### Görevin

Yükseltme fenerini yak — gerçekleri \`lib.rs\` içine kaydet:

1. \`PROTOCOL_VERSION\` — ağın oylayıp kabul ettiği sürüm.
2. \`CODENAME\` — yükseltmenin kod adı, küçük harflerle.
3. \`MAINNET_VOTE\` — Mainnet oylamasının tarihi, \`YYYY-MM-DD\`.

Beklenen sonuç:

\`\`\`text
beacon lit: protocol 27 (zipper) ✓
\`\`\`
`,
  },

  "stellar-protocol-27-2": {
    instructions: `## Smart Account'lar ve \`__check_auth\`

\`require_auth()\`'u zaten biliyorsun — mührü. Peki mührü *kim* doğrular?

Klasik bir hesap basittir: iki anahtar. Gizli anahtar imzalar; ağ o imzayı açık anahtara karşı **ed25519** ile kontrol eder — dijital imza üretip doğrulamaya yarayan belirli bir kriptografik şema. Gizli yarıyla imzala, açık yarıyla doğrula — gizli anahtarı olmayan kimse taklit edemez.

Ama Stellar'da bir \`Address\` anahtar çifti olmak zorunda değil. Bir **kontrata** da işaret edebilir: anahtar çifti hiç yok, sadece "imzalanmış" sayılanın kuralını kendi yazan kod. O kural tek bir giriş noktasında yaşar: \`__check_auth\`.

| | klasik hesap | kontrat hesabı |
|---|---|---|
| tuttuğu | bir anahtar çifti | anahtar yok — sadece kod |
| kimliğini kanıtlama yolu | bir ed25519 imzası | kendi \`__check_auth\` mantığı |

Aynı \`Address\` tipi. Aynı \`require_auth()\` çağrı noktası. Altında bambaşka iki bekçi. \`Address\` bir **kontrata** aitse host, o kontratın kendi giriş noktasını çağırır:

\`\`\`rust
fn __check_auth(env: Env, payload: Hash<32>, signatures: ..., contexts: Vec<Context>)
\`\`\`

Hesap bir kontrat*tır* ve \`__check_auth\` onun imza politikasıdır. **Custom account**'lar böyle var olur: multisig cüzdanlar, social recovery, passkey girişleri, account abstraction — her biri sadece farklı bir \`__check_auth\`. (OpenZeppelin bunları zaten inşa ediyordu; Protocol 27 zor kısımları birinci sınıf yapıyor.)

Bağlam: [Protocol 27 tartışması — modüler custom account'lar ve imza güvenliği](https://developers.stellar.org/meetings/2026/04/30#protocol-discussion-modular-custom-accounts-and-signature-security-in-protocol-27).

### Görevin

1. impl bloğunu \`#[contractimpl]\` ile dışa aktar.
2. Giriş noktasını host'un gerçekten çağırdığı isme çevir: \`__check_auth\`.

Beklenen sonuç:

\`\`\`text
__check_auth: the account writes its own law ✓
\`\`\`
`,
  },

  "stellar-protocol-27-3": {
    instructions: `## Authentication Delegation (CAP-0071-01)

Zipper'dan önce, *başka* bir kontratın kendisine kefil olmasını isteyen bir custom account'ın protokol desteği yoktu — inşacılar bunu, auth bağlamını yaymak için kırılgan ön-simülasyon turlarıyla taklit ediyordu. Protocol 27 devri iki yeni host function ile birinci sınıf yapıyor:

- \`delegate_account_auth\` — **yalnızca \`__check_auth\` içinden** çağrılabilir: mevcut auth kontrolünü bir delege adrese devreder, ardından onun kendi imza mantığı çalışır.
- \`get_delegated_signers_for_current_auth_check\` — çağrılan kontratın hangi delege imzacıların onay verdiğini görmesini sağlar.

Yeni bir credential tipi, \`SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES\`, delege imzacıları ve imzaları tek bir yetkilendirme girdisinde paketler — daha küçük işlemler, daha basit simülasyon.

Derin dalış: [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) · [CAP-71 özeti — custom account'lar için authentication delegation](https://developers.stellar.org/meetings/2026/04/30#cap-71-recap-authentication-delegation-for-custom-accounts).

### Görevin

\`__check_auth\` içinde kontrolü kayıtlı kâhyaya devret:

1. Delege \`Address\` zaten instance storage'dan yüklenmiş durumda.
2. \`delegate_account_auth\` fonksiyonunu delege ve imza payload'ıyla çağır — ve \`todo!()\`'yu kaldır.

Beklenen sonuç:

\`\`\`text
crown delegated: steward honored ✓
\`\`\`
`,
  },

  "stellar-protocol-27-4": {
    instructions: `## İmza Güvenliği ve V2 Credential'lar (CAP-0071-02)

Bir **replay saldırısı** geçerli bir şeyi — bir imzayı, basılmış bir mührü — alır ve hiç işlemesi gerekmeyen bir yerde yeniden kullanır. Güvenlik denetimleri, eski credential formatında bunun sinsi bir versiyonunun saklandığını buldu. Senaryo için üç şeyin aynı anda olması gerekiyor:

1. İmzalanan payload'a **imzacının adresini eklemeyen** admin tarzı bir kontrat.
2. Admin farklı bir adrese **rotasyonla devredilir**…
3. …ve iki adres de **aynı private key'i** paylaşır.

O zaman eski admin için üretilmiş bir imza yeni admin için **yeniden oynatılabilir** — mükerrer mint'ler, yetkisiz eylemler. *Zincir üstünde hiç yaşanmadı*, ama patlama alanı bir protokol düzeltmesini haklı çıkardı.

**\`SOROBAN_CREDENTIALS_ADDRESS_V2\`**, imza payload'ını üretildiği adrese bağlar. Eski \`SOROBAN_CREDENTIALS_ADDRESS\`, **Protocol 28'e kadar** geçerli kalır — bir geçiş penceresi, uçurum değil. Admin tarzı kontratlar için geçici önlem: imzacının adresini payload'a kendin ekle.

İzle: [Stellar Developer Meeting — custom account'lar ve imza güvenliği](https://www.youtube.com/watch?v=5O1cDDGv7_o).

### Görevin

1. \`CREDENTIALS\` sabitini V2 credential adına yükselt.
2. V1'in hangi protokole kadar geçerli kaldığını kaydet.
3. \`bound_payload\` içinde bu kontratın kendi \`Address\`'ini \`env.current_contract_address()\` ile al ve döndür (çağıran bunu imzalanan malzemeye ekler) — \`todo!()\`'yu kaldır.

Beklenen sonuç:

\`\`\`text
seal bound to its door: the echo dies ✓
\`\`\`
`,
  },

  "stellar-protocol-27-5": {
    instructions: `## Protocol 27'ye Geçiş

Sürümler şu sırayla çıktı: **Core → SDK'lar → RPC & Galexie → Horizon → Testnet → Mainnet**. Her SDK — Rust, JavaScript, Go, Java, Python, iOS, PHP, .NET, Flutter, Elixir — bir Protocol 27 sürümü çıkardı ve Mainnet dönmeden önce yükseltilmesi gerekiyor.

Çoğu uygulamanın hissettiği tek **breaking change**: \`@stellar/stellar-base\`, **\`@stellar/stellar-sdk\` içinde birleştirildi**. Eski import'lar kırılır; çözüm paketin adını değiştirmek.

Geçiş kontrol listen:

1. Her Stellar SDK'sını ve istemci kütüphanesini yükselt — [Software Versions](https://developers.stellar.org/docs/networks/software-versions) sayfasına bak.
2. \`@stellar/stellar-base\` import'larını \`@stellar/stellar-sdk\` olarak yeniden adlandır.
3. Protocol 28'den önce \`SOROBAN_CREDENTIALS_ADDRESS_V2\`'ye geçişi planla.
4. Node operatörleri: oylamadan önce Core, RPC, Galexie ve Horizon'u yükseltin.

Kaynaklar: [yükseltme rehberi](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide) · [geçiş rehberi](https://developers.stellar.org/meetings/2026/04/30#migration-guidance).

### Görevin

Kervan manifestosunu doldur:

1. \`JS_XDR_PACKAGE\` — \`stellar-base\`'i içine alan paket.
2. \`TESTNET_UPGRADE\` — Testnet'in döndüğü tarih, \`YYYY-MM-DD\`.
3. \`UPGRADE_ALL_SDKS\` — *tüm* SDK'ların yükseltilmesi gerekiyor mu?

Beklenen sonuç:

\`\`\`text
caravan cleared the Gate: nothing left behind ✓
\`\`\`
`,
  },

  "stellar-protocol-27-6": {
    instructions: `## Boss: Delege Edilmiş Hesap

Yankı Hayaleti çalıntı bir imzayla geliyor. Onu, \`__check_auth\`'u kök imzacısını doğrulayan **ve** bir kâhyaya devreden bir custom account ile yen.

\`ZipperAccount\` kontratın \`__check_auth\` içinde şunları yapmalı:

1. Kök imzacının public key'ini (\`BytesN<32>\`) instance storage'dan \`SIGNER\` anahtarıyla yükle.
2. Payload üstündeki ed25519 imzasını \`env.crypto().ed25519_verify(...)\` ile doğrula — kötü bir mühür trap olmalı.
3. Kâhya \`Address\`'ini instance storage'dan \`DELEGATE\` anahtarıyla yükle ve kontrolün kalanını \`delegate_account_auth\` ile ona devret — Protocol 27 hamlesi.

Ve impl bloğunu dışa aktar. Finalden sağ çıkan \`todo!()\` olmayacak.

Beklenen sonuç:

\`\`\`text
__check_auth: signature verified, steward honored — the echo is silent ✓
\`\`\`
`,
  },
};
