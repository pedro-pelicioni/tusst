// TR · editor instructions — Threads, Send/Sync & Shared State.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-concurrency.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustConcurrencyInstructionsTr: Record<string, { instructions: string }> = {
  "rust-concurrency-1": {
    instructions: `## Dağıt, sonra geri topla

\`thread::spawn\` bir \`JoinHandle<T>\` döndürür; \`join()\` bloklar ve sana closure'ın dönüş değerini bir \`Result\` içinde verir — \`Err\`, o thread'in (iş parçacığı) panic ettiği anlamına gelir.

Closure \`'static\` olmak zorundadır; bu yüzden \`move\` neredeyse her zaman gerekir.

### Görevin

1. \`0..4u32\` içindeki her \`id\` için bir tane olmak üzere dört thread spawn et; her biri \`id * id\` döndürsün.
2. Handle'ları bir \`Vec\`'te topla.
3. Onları **spawn sırasıyla** bir \`Vec<u32>\`'ye join et, \`{:?}\` ile yazdır, sonra toplamı yazdır.

Beklenen çıktı:

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

Çalıştırma sırası deterministik değildir; sırayla join etmek sonucu yine de deterministik yapar.

### İpuçları

- \`use std::thread;\`
- \`results.iter().sum::<u32>()\` toplamın tipini satır içinde belirtir.
`,
  },

  "rust-concurrency-2": {
    instructions: `## Özellikleri kanıtla

**\`Send\`** — değer başka bir thread'e *move* edilebilir.
**\`Sync\`** — değer thread'ler arasında *referansla paylaşılabilir* (\`T: Sync\` ⟺ \`&T: Send\`).

İkisi de auto trait'tir: bir tip, tüm alanları sahipse onları alır.

Öğretici örnekler: \`Rc\` ikisi de değildir (atomik olmayan sayaç). \`Cell\` \`Send\`'dir ama \`Sync\` **değildir** — cell'i move etmek sorunsuzdur, \`&Cell\`'i paylaşmak \`set\` üzerinde yarışır.

### Görevin

1. \`"Send"\` döndüren \`fn assert_send<T: Send>(_: &T) -> &'static str\` ve \`"Sync"\` döndüren \`fn assert_sync<T: Sync>(_: &T) -> &'static str\`.
2. \`Arc<u32>\`'nin ikisini de sağladığını göster.
3. \`42\` tutan bir \`Rc<u32>\` oluştur ve sadece değerini yazdır — onu \`assert_send\`'e geçirmek derlenmezdi, ders de bu.
4. \`Cell<u32>\`'nin \`Send\`'i sağladığını göster. Onun üzerinde \`assert_sync\` **çağırma**.

Beklenen çıktı:

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\`

### İpuçları

- \`use std::rc::Rc;\`, \`use std::sync::Arc;\`, \`use std::cell::Cell;\`
- Yardımcılar hiçbir şeyi move etmez — kanıtı zorlayan şey *bound*'dur.
`,
  },

  "rust-concurrency-3": {
    instructions: `## Bir tabloyu dört worker'la paylaş

\`Arc<T>\`, atomik referans sayaçlı \`Rc<T>\`'dir; onu \`Send + Sync\` yapan şey budur. Tek başına **paylaşılan salt-okunur** erişim verir — değiştirmek için içte bir \`Mutex\` ya da \`RwLock\` gerekir.

Kalıp, binding'i döngünün içinde gölgelemektir: \`move\` closure'ından önce \`let table = Arc::clone(&table);\`.

### Görevin

1. \`(1..=1000).collect()\` tutan bir \`Arc<Vec<u64>>\` kur; \`Arc::strong_count\`'u yazdır.
2. Dört thread spawn et. Her biri kendi \`Arc::clone\`'unu alsın ve 250 elemanlık bir dilimi \`.iter().skip(chunk * 250).take(250).sum::<u64>()\` ile toplasın.
3. Join et, kısmi toplamları topla ve toplamı yazdır.
4. Strong count'u yeniden yazdır — 1'e geri döner.

Beklenen çıktı:

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\`

### İpuçları

- Collect'in tipini belirt: \`let table: Arc<Vec<u64>> = Arc::new((1..=1000).collect());\`
- \`chunk\`, \`0..4usize\`'dan gelen bir \`usize\`'dır.
`,
  },

  "rust-concurrency-4": {
    instructions: `## Sekiz thread, bir sayaç

\`Mutex<T>\` verisine **sahiptir** — kilitlemeden değere ulaşmanın bir yolu yoktur. Guard \`&mut T\`'ye deref olur ve drop'ta bırakır; \`unlock()\` diye bir şey yoktur.

\`lock()\` bir \`Result\` döndürür; sebebi **poisoning** (zehirlenme): kilidi tutarken panic eden bir thread onu işaretler ve sonraki her \`lock()\` \`Err\` döndürür.

Kritik bölümü kısa tut. \`Drop\`, son kullanımda değil, **scope**'un sonunda çalışır.

### Görevin

1. \`0\`'dan başlayan bir \`Arc<Mutex<u64>>\` kur.
2. Sekiz thread spawn et. Her biri kendi \`Arc::clone\`'unu alsın ve bin kez kilitleyip artırsın — guard tek bir iterasyona scope'lanmış olsun.
3. Sekizini de join et, sonra son sayımı ve mutex'in \`is_poisoned()\` olup olmadığını yazdır.

Beklenen çıktı:

\`\`\`text
count: 8000
poisoned: false
\`\`\`

### İpuçları

- \`use std::sync::{Arc, Mutex};\`
- \`*counter.lock().unwrap()\` sonunda değeri okur.
`,
  },

  "rust-concurrency-5": {
    instructions: `## Birçok okuyucu, tek yazıcı

\`RwLock<T>\`, aynı anda birçok \`read()\` guard'ına ya da tek bir özel (exclusive) \`write()\` guard'ına izin verir.

Bedava bir yükseltme **değildir**: işlem başına \`Mutex\`'ten daha pahalıdır ve yalnızca okumalar gerçekten baskınsa *ve* üst üste binecek kadar yavaşsa kazanır. Yazıcı açlığı (writer starvation) gerçek bir risktir ve adalet politikası std'den değil, OS'ten gelir.

Varsayılan olarak \`Mutex\` kullan; \`RwLock\`'a bir profil üzerine geç.

### Görevin

1. \`vec![10, 20, 30]\` tutan bir \`Arc<RwLock<Vec<u64>>>\` kur.
2. Dört okuyucu thread spawn et; her biri \`read()\` alsın ve \`.len()\` döndürsün.
3. Onları join et, dönen uzunlukları topla, toplamı yazdır.
4. \`write()\` al ve \`40\` push'la, sonra vektörü taze bir \`read()\` üzerinden yazdır.

Beklenen çıktı:

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\`

### İpuçları

- \`use std::sync::{Arc, RwLock};\`
- \`*cache.read().unwrap()\`, \`{:?}\` için guard'ı deref eder.
`,
  },

  "rust-concurrency-6": {
    instructions: `## Kilitleri sırala

Bir deadlock (kilitlenme) için iki kilidi **ters sırada** alan iki thread gerekir. Rust, data race'leri derleme zamanında önler; deadlock'ları önlemez, çünkü sonsuza kadar beklemek bellek açısından güvenlidir.

Çözüm **global bir kilit sırası**dır: kilitlerin üzerinde toplam bir sıralama seç ve işlemin kendi yönü ne olursa olsun her zaman o sırayla al.

### Görevin

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — ikisini \`id\`'ye göre sırala, önce düşük olanı kilitle, sonra borç ve alacağı doğru taraflara uygula.
3. \`1\` (bakiye \`100\`) ve \`2\` (bakiye \`50\`) hesaplarını \`Arc\` içinde kur.
4. 100 thread spawn et: 50 tanesi a'dan b'ye \`1\` transfer etsin, 50 tanesi b'den a'ya \`1\`. Hepsini join et.
5. Her bakiyeyi, sonra toplamı yazdır.

Beklenen çıktı:

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Sıralama olmadan bu program deadlock'a girer. Sıralamayla net sıfırdır ve toplam korunur.

### İpuçları

- \`let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };\`
- Kilitledikten sonra hangi guard'a borç yazacağını bilmek için \`from.id == first.id\` kontrolü yap.
`,
  },

  "rust-concurrency-7": {
    instructions: `## Lock'suz say, tek bir kazanan seç

Bir atomic (atomik değer), donanım tarafından lock olmadan oku-değiştir-yaz edilir. \`compare_exchange\` değeri yalnızca o an beklediğin şeye eşitse yazar — kazandıysan \`Ok(previous)\`, kaybettiysen \`Err(actual)\`.

\`Ordering\` (bellek sıralaması) bir hız düğmesi değildir; çevresindeki bellek işlemlerinin nasıl yeniden sıralanabileceğini kısıtlar:

- **\`Relaxed\`** — yalnızca bu değer üzerinde atomik. Bir istatistik sayacı için doğru tercih.
- **\`Release\`/\`Acquire\`** — bir store'dan önce yazılan veriyi, onu load eden herkese yayınlar.
- **\`SeqCst\`** — tüm thread'lerin üzerinde anlaştığı tek bir toplam sıra. En güvenlisi, en yavaşı.

### Görevin

1. \`0\`'dan başlayan bir \`Arc<AtomicU64>\`. Sekiz thread spawn et, her biri bin kez \`fetch_add(1, Ordering::Relaxed)\` yapsın. Join et, sonra değeri bir \`Acquire\` load'uyla yazdır.
2. \`false\`'tan başlayan bir \`AtomicBool\`. \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\`'ı **iki kez** çağır, her sonucu \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — kazandık ve bir \`false\` değerinin üzerine yazdık. \`Err(true)\` — kaybettik, bulduğumuz değer de bu.

### İpuçları

- \`use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};\`
`,
  },

  "rust-concurrency-8": {
    instructions: `## Fan-in yap, sonra backpressure'ı hisset

Bir channel (kanal) thread'ler arasında **ownership** taşır. \`mpsc\` çok üreticili, tek tüketicilidir: sender'ı klonla, tek bir receiver tut.

Receiver'ın iterator'ı yalnızca **her** sender ortadan kalktığında biter — \`main\` içindeki orijinali de dahil; \`drop(tx)\`'in opsiyonel olmamasının sebebi tam olarak budur.

\`channel()\` sınırsızdır: üreticiler asla beklemez ve yavaş bir tüketici, bellek yetmezliğinden gelen bir kill'e dönüşür. \`sync_channel(n)\` sınırlıdır ve o bloklama **tam olarak** backpressure'dır (geri basınç).

### Görevin

1. \`mpsc::channel::<u64>()\`. Üç üretici spawn et; \`id\` numaralı üretici, \`0..3\` aralığındaki her \`n\` için \`id * 10 + n\` gönderir. **Orijinal sender'ı drop et**, sonra receiver'ı bir \`Vec<u64>\` içinde topla, sırala ve hem kendisini hem de uzunluğunu yazdır.
2. \`mpsc::sync_channel::<u64>(1)\`. Bir değer gönder, ikinci bir \`try_send\`'in **başarısız olup olmadığını** yazdır, sonra \`recv()\` yap ve çıkanı yazdır.

Beklenen çıktı:

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Fan-in'i deterministik yapan şey sıralamadır — varış sırası değil.

### İpuçları

- \`use std::sync::mpsc;\`
- \`rx.iter().collect()\`, her sender ortadan kalkana kadar channel'ı boşaltır.
`,
  },
};
