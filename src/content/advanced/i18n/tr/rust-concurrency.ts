import type { LessonStep } from "@/content/steps";

// TR · Threads, Send/Sync & Shared State.
//
// Overlay for ../../steps/rust-concurrency.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustConcurrencyStepsTr: Record<string, LessonStep[]> = {
  "rust-concurrency-1": [
    {
      kind: "theory",
      body: `\`thread::spawn\` gerçek bir OS thread'i (iş parçacığı) başlatır ve bir \`JoinHandle<T>\` döndürür; \`T\`, closure'ın döndürdüğü şey neyse odur.

\`\`\`rust
let h = thread::spawn(move || id * id);
let value = h.join().unwrap();
\`\`\`

\`join()\` o thread bitene kadar bloklar ve sana dönüş değerini verir — bir \`Result\` içine sarılı olarak, çünkü thread **panic** etmiş olabilir. \`Err\` panic demektir; buradaki \`unwrap()\` onu ebeveyn thread'e yayar.`,
    },
    {
      kind: "theory",
      body: `\`spawn\` hakkında, onunla yazdığın her şeyi şekillendiren iki şey var.

**Closure \`'static\` olmak zorunda.** Thread, kendisini yaratan fonksiyondan daha uzun yaşayabilir; dolayısıyla o fonksiyonun yerel değişkenlerini borrow edemez. \`move\` neredeyse her zaman zorunludur ve veri paylaşmanın \`&\` değil \`Arc\` demek olmasının sebebi de budur.

**Detached (bağı koparılmış) thread'ler çıkışta öldürülür.** \`main\` join yapmadan dönerse, açıkta kalan thread'ler nerede olurlarsa olsunlar orada sonlandırılır — unwinding yok, destructor yok. Handle'ları toplayıp hepsini join etmek titizlik değildir; işin bittiğini bilmenin tek yoludur.

\`\`\`rust
for h in handles { results.push(h.join().unwrap()); }
\`\`\`

Spawn sırasıyla join etmek, *çalıştırma* deterministik olmasa bile *sonuçları* deterministik yapar — paralel bir hesaplamayı test edilebilir kılan şey de budur.`,
    },
    {
      kind: "quiz",
      question: "`join()` neden bir `Result` döndürür?",
      options: [
        "Thread panic etmiş olabilir ve `Err`, panic payload'ını kaybetmek yerine taşır",
        "Thread hâlâ çalışıyor olabilir ve `Err` 'henüz bitmedi' demektir",
        "`Result`, OS'in bir thread ayırıp ayıramadığını bildirir",
      ],
      answer: 0,
      explain:
        "Spawn edilmiş bir thread'deki panic, varsayılan olarak süreci durdurmaz — o thread'i bitirir. `Result`'ı kontrol etmezsen çökmüş bir worker'ı, sessizce, hiç iş yapmamış bir worker gibi ele alırsın.",
    },
    {
      kind: "fill",
      prompt:
        "Yakalanan değerin ownership'ini thread'e ver ki yerel bir değişkeni borrow etmek zorunda kalmasın.",
      file: "main.rs",
      before: "handles.push(thread::spawn(",
      after: "|| id * id));",
      choices: ["move ", "", "&"],
      answer: 0,
      explain:
        "`move` olmadan closure `id`'yi borrow eder ve derleyici reddeder: thread, `id`'nin sahibi olan döngü iterasyonundan daha uzun yaşayabilir.",
    },
    {
      kind: "quiz",
      question:
        "`main` dört worker spawn ediyor ve hiçbirini join etmeden dönüyor. Onlara ne olur?",
      options: [
        "Süreç çıkarken işin ortasında öldürülürler; unwinding olmaz, destructor çalışmaz",
        "Süreç çıkmadan önce her thread'i bekler",
        "Daemon thread'e terfi ederler ve çıkıştan sonra da çalışmaya devam ederler",
      ],
      answer: 0,
      explain:
        "Kaybolan yazmaların ve kesilmiş çıktıların gerçek bir kaynağı budur. Handle'ları join et ya da dönmeden önce worker'ların sinyal verdiği bir şeyi elinde tut.",
    },
    {
      kind: "editor",
      intro: `### Dağıt, sonra geri topla

1. \`0..4u32\` içindeki her \`id\` için bir tane olmak üzere dört thread spawn et; her biri \`id * id\` döndürsün.
2. Her \`JoinHandle\`'ı bir \`Vec\`'e push'la.
3. Onları **spawn sırasıyla** bir \`Vec<u32>\`'ye join et, \`{:?}\` ile yazdır, sonra toplamı yazdır.

Beklenen çıktı:

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

Çalıştırma sırası deterministik değildir; sırayla join etmek *sonucu* yine de deterministik yapar.`,
    },
  ],

  "rust-concurrency-2": [
    {
      kind: "theory",
      body: `Rust'ın thread güvenliğinin tamamını iki marker trait taşır. İkisinin de metodu yoktur — derleyicinin kontrol edip sonra dayattığı birer iddiadırlar.

**\`Send\`** — değer başka bir thread'e **move** edilebilir.
**\`Sync\`** — değer thread'ler arasında referansla **paylaşılabilir**. Resmî tanım: \`T\`, ancak ve ancak \`&T\` \`Send\` ise \`Sync\`'tir.

Bunlar **auto trait**'tir: bir tip, tüm alanları bu trait'lere sahipse onları otomatik olarak alır. Elle neredeyse hiç implement etmezsin; edersen de \`unsafe\` gerekir, çünkü derleyicinin doğrulayamayacağı bir söz veriyorsundur.`,
    },
    {
      kind: "theory",
      body: `Öğretici olan örnekler, birine sahip olup diğerine sahip olmayan tiplerdir.

**\`Rc<T>\`: ikisi de değil.** Referans sayacı, atomik olmayan artırmalarla çalışan düz bir tamsayıdır. Aynı anda clone yapan iki thread yarışır ve değeri erken free eder — bir use-after-free. \`Arc<T>\`, atomik sayaçlı aynı tiptir ve ikisine de sahiptir.

**\`Cell<T>\`: \`Send\` ama \`Sync\` değil.** Bir \`Cell\`'in tamamını başka bir thread'e move etmek sorun değildir — onu yalnızca bir thread tutar. \`&Cell\`'i *paylaşmak* ise sorundur: \`set\` düz bir yazmadır, aynı anda yazan iki thread yarışır. Ayrımı kafada oturtan ikili budur.

**\`MutexGuard\`: \`Sync\` ama \`Send\` değil.** Bazı platformlar mutex'i kilitleyen thread ile kilidi açan thread'in aynı olmasını şart koşar; bu yüzden guard thread'ler arasında geçemez.

Gerisi bundan türer: \`T: Send\` olduğunda \`Mutex<T>\` \`Sync\`'tir — \`Arc<Mutex<T>>\`'nin paylaşılan-değiştirilebilir-durum tipi olmasının sebebi tam olarak budur.`,
    },
    {
      kind: "quiz",
      question: "`Cell<T>` neden `Send` ama `Sync` değildir?",
      options: [
        "Cell'in tamamını move etmek sorunsuzdur çünkü onu yalnızca bir thread tutar; `&Cell`'i paylaşmak değildir, çünkü `set` senkronize edilmemiş bir yazmadır",
        "`Cell` bir kilit içerir ve kilitler paylaşılamaz",
        "`Sync`'tir; yalnızca `RefCell` değildir",
      ],
      answer: 0,
      explain:
        "Ayrımın en temiz örneği budur. `Send` değeri devretmekle ilgilidir; `Sync` iki thread'in ona aynı anda dokunmasıyla.",
    },
    {
      kind: "fill",
      prompt:
        "Bir yardımcı fonksiyonu öyle sınırla ki yalnızca başka bir thread'e move edilebilen değerleri kabul etsin.",
      file: "main.rs",
      before: "fn assert_send<T: ",
      after: ">(_: &T) -> &'static str {",
      choices: ["Send", "Sync", "Copy"],
      answer: 0,
      explain:
        "Yardımcı aslında hiçbir şeyi move etmez — var olma sebebi, *bound*'un derleyiciyi bu özelliği kanıtlamaya zorlamasıdır. Onu bir `Rc` ile çağırmak derleme hatasıdır; gösteri de tam olarak budur.",
    },
    {
      kind: "quiz",
      question:
        "Spawn edilen bir task'ta 'the trait `Send` is not implemented for `Rc<Config>`' hatası alıyorsun. Çözüm nedir?",
      options: [
        "`Arc<Config>` kullan — aynı paylaşılan ownership, atomik referans sayacıyla",
        "`Rc`'yi bir `Mutex`'e sar; bu her tipi `Send` yapar",
        "`unsafe impl Send for Rc<Config>` ekle",
      ],
      answer: 0,
      explain:
        "`Mutex` kurtarmaz: `Mutex<T>` yalnızca `T` `Send` olduğunda `Send`/`Sync`'tir. `unsafe impl` ise derlenir ve sonra yarışır — derleyici haklıydı.",
    },
    {
      kind: "editor",
      intro: `### Özellikleri kanıtla

1. \`"Send"\` döndüren \`fn assert_send<T: Send>(_: &T) -> &'static str\` ve \`"Sync"\` döndüren \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` yaz.
2. \`Arc<u32>\`'nin ikisini de sağladığını göster.
3. Bir \`Rc<u32>\` oluştur ve sadece değerini yazdır — onu \`assert_send\`'e geçirmek derlenmezdi, ders de bu.
4. \`Cell<u32>\`'nin \`Send\`'i sağladığını göster. (\`Sync\` değildir, dolayısıyla onun üzerinde \`assert_sync\` çağırma.)

Beklenen çıktı:

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\``,
    },
  ],

  "rust-concurrency-3": [
    {
      kind: "theory",
      body: `\`Arc<T>\`, **atomik** referans sayaçlı \`Rc<T>\`'dir. Onu (\`T\` öyleyse) \`Send + Sync\` yapan tek fark budur ve aynı veriyi birden fazla thread'e vermenin standart yolu odur.

\`\`\`rust
let table = Arc::new(big_vec);
for chunk in 0..4 {
    let table = Arc::clone(&table);      // tek bir atomik artırma
    thread::spawn(move || { /* reads table */ });
}
\`\`\`

Döngünün içindeki gölgeleyen \`let table = Arc::clone(&table);\` kalıbın kendisidir: handle'ı bu iterasyon için clone'lar ve \`move\` closure'ı dıştaki binding'i değil o clone'u alır.`,
    },
    {
      kind: "theory",
      body: `Tek başına \`Arc<T>\` **paylaşılan salt-okunur erişim** verir — \`&T\` dağıtır, asla \`&mut T\` değil. Büyük bir lookup tablosu, bir config ya da derlenmiş bir route haritası için tam istediğin şey budur ve hiç kilit gerektirmez.

Maliyeti dürüst ama küçüktür: clone'da bir atomik artırma, drop'ta bir atomik azaltma; her biri, tüm thread'lerin paylaştığı bir cache line üzerinde senkronize bir işlemdir. Sıkı bir iç döngüde \`Arc\` clone'lamak ölçülebilir; task başına bir kez clone'lamak değildir.

**Değiştirme** için eşleştir: \`Arc<Mutex<T>>\` ya da \`Arc<RwLock<T>>\`. \`Arc\` thread'ler arasında paylaşılan ownership'i sağlar, içteki tip senkronize erişimi. Bunlar birbirinden bağımsızdır (ortogonal) ve ikisini karıştırmak, erken dönem eşzamanlı Rust'ta "bu neden derlenmiyor"un en yaygın kaynağıdır.`,
    },
    {
      kind: "quiz",
      question:
        "Tek başına `Arc<T>`, birden fazla thread'in değerle ne yapmasına izin verir?",
      options: [
        "Okumasına — yalnızca `&T` dağıtır. Değiştirmek için içte bir `Mutex` ya da `RwLock` gerekir",
        "Okuyup yazmasına; atomik sayaç erişimi senkronize eder",
        "Kilitlenene kadar hiçbir şeye; her `Arc` erişimi bir kilit alır",
      ],
      answer: 0,
      explain:
        "Atomik sayaç *sayacı* korur, veriyi değil. `Arc` ve `Mutex` iki farklı problemi çözer ve tam da bu yüzden birlikte kullanılır.",
    },
    {
      kind: "fill",
      prompt: "Bu iterasyonun thread'ine paylaşılan tabloya kendi handle'ını ver.",
      file: "main.rs",
      before: "let table = Arc::",
      after: "(&table);",
      choices: ["clone", "new", "get_mut"],
      answer: 0,
      explain:
        "`Arc::new` ikinci, alakasız bir tablo ayırırdı. `get_mut` yalnızca sayaç 1 olduğunda `Some` döndürür; burada bu asla geçerli değil.",
    },
    {
      kind: "quiz",
      question:
        "Dört worker thread join edildikten sonra `Arc::strong_count` yeniden 1 okunuyor. Neden?",
      options: [
        "Her thread'in clone'u, closure'ı bitince drop edildi ve sayacı geri düşürdü",
        "`join` sayacı 1'e sıfırlar",
        "Sayaç hiç 1'in üstüne çıkmadı; clone'lar tek bir sayaç slotunu paylaşır",
      ],
      answer: 0,
      explain:
        "Bu, `Drop`'un thread sınırlarının ötesinde işini yapmasıdır: move edilen her clone, sahibi olan closure ile birlikte ölür.",
    },
    {
      kind: "editor",
      intro: `### Bir tabloyu dört worker'la paylaş

1. \`(1..=1000).collect()\` tutan bir \`Arc<Vec<u64>>\` kur, \`Arc::strong_count\`'u yazdır.
2. Dört thread spawn et. Her biri kendi \`Arc::clone\`'unu alsın ve 250 elemanlık bir dilimi toplasın: \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Onları join et, kısmi toplamları topla ve toplamı yazdır.
4. Strong count'u yeniden yazdır — 1'e geri dönmüştür.

Beklenen çıktı:

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\``,
    },
  ],

  "rust-concurrency-4": [
    {
      kind: "theory",
      body: `\`Mutex<T>\` verisine **sahiptir**. Kilitlemeden değere ulaşmanın bir yolu yoktur; dolayısıyla "kilidi almayı unuttum" yazabileceğin bir bug değildir.

\`\`\`rust
let mut guard = counter.lock().unwrap();
*guard += 1;
\`\`\`

\`lock()\`, \`Result<MutexGuard<T>, PoisonError<_>>\` döndürür. Guard \`&mut T\`'ye deref olur ve **drop edildiğinde kilidi bırakır**. \`unlock()\` diye bir şey yoktur.`,
    },
    {
      kind: "theory",
      body: `O \`Result\`, **poisoning** (zehirlenme) içindir. Bir thread kilidi tutarken panic ederse mutex zehirlenmiş olarak işaretlenir ve sonraki her \`lock()\` \`Err\` döndürür — veri yarım güncellenmiş kalmış olabilir ve derleyici bunu kabul etmeni zorunlu kılar. Güvenli olduğuna karar verirsen \`PoisonError::into_inner()\` veriyi yine de verir.

Production'da önemli olan kural: **kritik bölümü kısa tut ve bir guard'ı asla yavaş bir çağrı boyunca elinde tutma.**

\`\`\`rust
let value = { cache.lock().unwrap().get(&key).cloned() };   // burada bırakılır
expensive_io(value);                                        // kilit tutulmuyor
\`\`\`

Tuzak şu: \`Drop\`, son kullanımda değil, **scope**'un sonunda çalışır. Okumayı bıraktığın bir guard hâlâ kilidi tutuyordur — o yüzden bir blokla bilinçli olarak scope'la ya da değeri dışarı bağlayıp guard'ı drop et.`,
    },
    {
      kind: "quiz",
      question: "Zehirlenmiş (poisoned) bir `Mutex` ne anlama gelir?",
      options: [
        "Bir thread kilidi tutarken panic etti; veri yarım güncellenmiş olabilir ve sonraki her `lock()` `Err` döndürür",
        "İki thread deadlock'a girdi ve runtime döngüyü kırdı",
        "Kilit, yerleşik bir zaman aşımından daha uzun tutuldu",
      ],
      answer: 0,
      explain:
        "Bu bir doğruluk sinyalidir, canlılık (liveness) sinyali değil. Invariant'ın ayakta kaldığına karar verdiğinde `into_inner()` veriyi yine de almanı sağlar.",
    },
    {
      kind: "fill",
      prompt: "Değer dışarı çıkar çıkmaz kilidi bırak.",
      file: "main.rs",
      before: "let value = { cache.lock().unwrap().get(&key).",
      after: "() };",
      choices: ["cloned", "as_ref", "unwrap"],
      answer: 0,
      explain:
        "`cloned()` değeri dışarı kopyalar; böylece guard kapanış parantezinde ölebilir. Bir referans döndürmek, borrow'u tatmin etmek için guard'ı hayatta tutardı.",
    },
    {
      kind: "quiz",
      question:
        "Bir handler cache'i kilitliyor, sonra bir HTTP çağrısı yapıyor, sonra sonucu yazıyor — hepsi tek scope'ta. Yük altındaki belirti nedir?",
      options: [
        "Throughput tek seferde bir isteğe çöker: diğer her thread ağ çağrısının arkasında bekler",
        "Çağrı çok uzun sürdüğü için mutex zehirlenir",
        "Hiçbir şey — guard, çağrıdan önce, son kullanımında bırakılır",
      ],
      answer: 0,
      explain:
        "Son seçenek, bu bug'ı production'a yollayan yanılgının ta kendisidir. NLL *borrow*'ları son kullanımda bitirir; `Drop` ise *scope*'un sonunda çalışır ve kilit her iki çağrı boyunca tutulur.",
    },
    {
      kind: "editor",
      intro: `### Sekiz thread, bir sayaç

1. \`0\`'dan başlayan bir \`Arc<Mutex<u64>>\` kur.
2. Sekiz thread spawn et. Her biri kendi \`Arc::clone\`'unu alsın ve bin kez kilitleyip artırsın — guard tek bir iterasyona scope'lanmış olsun.
3. Sekizini de join et, sonra son sayımı ve mutex'in \`is_poisoned()\` olup olmadığını yazdır.

Beklenen çıktı:

\`\`\`text
count: 8000
poisoned: false
\`\`\`

Hiç kayıp güncelleme olmadan sekiz bin artırma — bu mutex'in işi, şans değil.`,
    },
  ],

  "rust-concurrency-5": [
    {
      kind: "theory",
      body: `\`RwLock<T>\` kilidi ikiye böler:

- \`read()\` — aynı anda **birçok** okuyucu
- \`write()\` — **tek** yazıcı, tüm okuyucuları dışarıda bırakır

\`\`\`rust
let len = cache.read().unwrap().len();     // diğer okuyucularla eşzamanlı
cache.write().unwrap().push(40);           // özel (exclusive)
\`\`\`

API bunun dışında \`Mutex\` ile aynıdır: guard'lar, poisoning, drop'ta bırakma.`,
    },
    {
      kind: "theory",
      body: `\`RwLock\` bedava bir yükseltme değildir ve varsayılan olarak ona uzanmak yaygın bir hatadır.

**İşlem başına \`Mutex\`'ten daha yavaştır.** Yazma bayrağının yanı sıra bir okuyucu sayacı da tutar; bu yüzden çekişmesiz bir \`read()\`, çekişmesiz bir \`lock()\`'tan daha pahalıdır.

**Yalnızca okumalar gerçekten baskınsa ve üst üste binecek kadar yavaşsa kazanır.** Tek bir tamsayı kopyalayan bir okuma, ikinci thread gelmeden biter; hiç kullanmadığın bir eşzamanlılığın parasını ödemişsindir. Sekiz thread aynı şeyi yaparken büyük bir yapıyı dolaşan bir okuma ise karşılığını aldığı yerdir.

**Yazıcı açlığı (writer starvation) gerçek bir risktir.** Okuyucu-öncelikli bir implementasyonda ve sürekli bir okuyucu akışında bir yazıcı sonsuza kadar bekleyebilir. std'nin \`RwLock\`'u büyük platformlarda yazıcı-önceliklidir; yani bekleyen bir yazıcı, sonsuza kadar arkalarında sıraya girmek yerine yeni okuyucuları bloklar — ama bu politika belgelenmiş bir garanti değil, bir implementasyon ayrıntısıdır; üzerine bir şey inşa etme.

Varsayılan olarak \`Mutex\` kullan. \`RwLock\`'a, iş yükü kulağa okuma-ağırlıklı geldiğinde değil, bir profil okuma çekişmesi gösterdiğinde geç.`,
    },
    {
      kind: "quiz",
      question:
        "Bir iş yükü 'çoğunlukla okuma' diye tarif ediliyor; `Mutex` `RwLock` ile değiştiriliyor ve hiçbir şey hızlanmıyor. Neden?",
      options: [
        "Okumalar üst üste binemeyecek kadar kısa — her biri bir sonraki thread gelmeden bitiyor, dolayısıyla yalnızca işlem başına daha yüksek maliyet ödeniyor",
        "`RwLock`, açıkça batch'lenmedikçe okumaları seri hâle getirir",
        "Okumaların eşzamanlı çalışması için `#[inline]` ile işaretlenmesi gerekir",
      ],
      answer: 0,
      explain:
        "Eşzamanlılık yalnızca işlemler zaman içinde gerçekten üst üste bindiğinde yardımcı olur. Nanosaniyelerde biten bir okuma için satın aldığın tek şey fazladan defter tutmadır.",
    },
    {
      kind: "fill",
      prompt: "Birden fazla okuyucunun aynı anda ilerlemesi için paylaşımlı bir kilit al.",
      file: "main.rs",
      before: "cache.",
      after: "().unwrap().len()",
      choices: ["read", "write", "lock"],
      answer: 0,
      explain:
        "`write()` diğer okuyucuları dışarıda bırakıp onları seri hâle getirirdi — `RwLock`'un tam da önlemek için var olduğu şey.",
    },
    {
      kind: "quiz",
      question: "Yazıcı açlığı (writer starvation) nedir ve olup olmayacağına kim karar verir?",
      options: [
        "Sürekli bir okuyucu akışının arkasında sonsuza kadar bekleyen bir yazıcı — ve adalet politikası std'den değil, OS primitifinden gelir",
        "Bir okuyucunun panic'i yüzünden zehirlenen bir yazıcı; politikayı std seçer",
        "Okuyucular kilidi tutarken verisini kaybeden bir yazıcı; derleyici bunu engeller",
      ],
      answer: 0,
      explain:
        "std platforma delege ettiği için aynı kod Linux'ta ve macOS'te farklı davranabilir. Politikaya hiç güvenmemek için iyi bir sebep.",
    },
    {
      kind: "editor",
      intro: `### Birçok okuyucu, tek yazıcı

1. \`vec![10, 20, 30]\` tutan bir \`Arc<RwLock<Vec<u64>>>\` kur.
2. Dört okuyucu thread spawn et; her biri \`read()\` alsın ve \`.len()\` döndürsün.
3. Onları join et, dönen uzunlukları topla ve toplamı yazdır.
4. \`write()\` al ve \`40\` push'la, sonra vektörü taze bir \`read()\` üzerinden yazdır.

Beklenen çıktı:

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\``,
    },
  ],

  "rust-concurrency-6": [
    {
      kind: "theory",
      body: `Bir deadlock (kilitlenme) için iki thread ve **ters sırada** alınan iki kilit gerekir:

\`\`\`text
thread 1: A'yı kilitler ─── B'yi ister
thread 2: B'yi kilitler ─── A'yı ister
\`\`\`

İkisi de ilerleyemez ve ikisi de zaman aşımına uğramaz. Rust, data race'leri derleme zamanında önler; deadlock'ları **önlemez**, çünkü deadlock unsound değildir — bir liveness (canlılık) bug'ıdır ve tip sisteminin bu konuda söyleyecek hiçbir şeyi yoktur.

Bir transfer fonksiyonu, kazara deadlock yazmanın klasik yoludur: aynı anda çalışan \`transfer(a, b)\` ve \`transfer(b, a)\` kilitleri ters sırada alır.`,
    },
    {
      kind: "theory",
      body: `Çözüm **global bir kilit sırası**dır: kilitlerin üzerinde toplam bir sıralama seç ve işlemin kendi yönü ne olursa olsun her zaman o sırayla al.

\`\`\`rust
let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };
let g1 = first.balance.lock().unwrap();
let g2 = second.balance.lock().unwrap();
\`\`\`

Artık her thread önce düşük id'yi alır, dolayısıyla döngü oluşamaz. Kararlı herhangi bir anahtar işe yarar — bir id, bir indeks, hatta pointer adresi.

İki destekleyici taktik. Algoritma izin veriyorsa **aynı anda tek kilit tut**; tek bir kilit kendine karşı deadlock'a giremez. Ve **back-off'lu \`try_lock\`**, olası bir deadlock'u bir yeniden denemeye çevirir — emniyet ağı olarak faydalı, ama sıralamanın yerini tutmaz; çünkü onun yerine livelock'a girebilir.`,
    },
    {
      kind: "quiz",
      question:
        "Rust'ın tip sistemi neden data race'leri önler ama deadlock'ları önlemez?",
      options: [
        "Deadlock bir liveness bug'ıdır, unsoundness değil — hiçbir şey bozulmaz, program yalnızca durur",
        "Deadlock'lar önlenir, ama yalnızca release build'lerde",
        "`Mutex` `Arc` olmadan kullanılsaydı borrow checker onları önlerdi",
      ],
      answer: 0,
      explain:
        "`Send`/`Sync` ve borrow kuralları *bozuk veriyi gözlemlemeyi* imkânsız kılar. Sonsuza kadar beklemek bellek açısından tamamen güvenlidir ve dildeki hiçbir statik analiz bunu yakalamaya çalışmaz.",
    },
    {
      kind: "fill",
      prompt:
        "Global bir sıra dayat ki iki karşıt transfer bir döngü oluşturamasın.",
      file: "main.rs",
      before: "let (first, second) = if from.id ",
      after: " to.id { (from, to) } else { (to, from) };",
      choices: ["<", "==", "!="],
      answer: 0,
      explain:
        "Herhangi bir toplam sıra işe yarar; önemli olan her thread'in *aynı* sırayı uygulamasıdır. Eşitlik ya da eşitsizlik karşılaştırması hiçbir sıralama vermez.",
    },
    {
      kind: "quiz",
      question:
        "Yeniden denemeli `try_lock` neden global bir kilit sırasından daha zayıf bir cevaptır?",
      options: [
        "Livelock'a girebilir — thread'ler ilerleme kaydetmeden tekrar tekrar alıp bırakır — oysa bir sıralama döngüyü imkânsız kılar",
        "`try_lock` unsafe'dir ve bir `unsafe` bloğu gerektirir",
        "`try_lock` başarısız olunca mutex'i zehirler",
      ],
      answer: 0,
      explain:
        "Yeniden deneme, özellikle rastgele back-off ile makul bir emniyet ağıdır. Birincil strateji olarak ise debug edebileceğin bir takılmayı, edemeyeceğin bir dönüşe çevirir.",
    },
    {
      kind: "editor",
      intro: `### Kilitleri sırala

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — iki hesabı \`id\`'ye göre sırala, önce düşük olanı kilitle, sonra borç ve alacağı doğru taraflara uygula.
3. \`1\` (bakiye \`100\`) ve \`2\` (bakiye \`50\`) hesaplarını \`Arc\` içinde kur.
4. 100 thread spawn et: 50 tanesi a'dan b'ye \`1\` transfer etsin, 50 tanesi b'den a'ya \`1\`. Hepsini join et.
5. Her bakiyeyi ve toplamı yazdır.

Beklenen çıktı:

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Sıralama olmadan bu program deadlock'a girer. Sıralamayla net sıfırdır ve toplam korunur.`,
    },
  ],

  "rust-concurrency-7": [
    {
      kind: "theory",
      body: `Bir atomic (atomik değer), donanımın kilitsiz olarak oku-değiştir-yaz yapabildiği tek bir değerdir. Bir sayaç için \`Mutex<u64>\`'ten çarpıcı biçimde ucuzdur:

\`\`\`rust
hits.fetch_add(1, Ordering::Relaxed);
\`\`\`

\`compare_exchange\`, diğer her şeyin üzerine kurulduğu primitiftir — değeri **yalnızca** şu an beklediğine eşitse ayarla:

\`\`\`rust
claimed.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
// Ok(false)  — biz kazandık, false'tu ve artık true
// Err(true)  — başkası kazandı; değer bulduğumuz şey
\`\`\`

N thread arasından, hiç kilit olmadan, tam olarak bir kazanan seçmenin yolu budur.`,
    },
    {
      kind: "theory",
      body: `\`Ordering\` argümanı bir performans düğmesi değildir — çevredeki bellek işlemlerinin derleyici ve CPU tarafından nasıl yeniden sıralanabileceğini kısıtlar.

- **\`Relaxed\`** — yalnızca bu değer üzerinde atomik. Başka hiçbir şey hakkında sıralama garantisi yok. Kimsenin karar vermek için okumadığı bir istatistik sayacı için doğru.
- Bir store'da **\`Release\`** — ondan önce yazılan her şey, o değeri daha sonra \`Acquire\` ile yükleyen bir thread'e görünür.
- Bir load'da **\`Acquire\`** — release eden thread'in store'undan önce yazdığı her şey artık sana görünür.
- **\`AcqRel\`** — ikisi birden, bir oku-değiştir-yaz için.
- **\`SeqCst\`** — ek olarak, tüm thread'lerin hemfikir olduğu tek bir toplam sıra. En güvenli ve en yavaş.

Dürüst kural: **sayaçlar için \`Relaxed\`, veri yayımlamak için \`Acquire\`/\`Release\`, emin değilsen \`SeqCst\`.** Bir bayrağı "hızlandırmak" için \`Relaxed\`'a uzanmak, yalnızca ARM'de, yalnızca yük altında, haftada bir ortaya çıkan bir bug'ı production'a yollamanın yoludur.`,
    },
    {
      kind: "quiz",
      question:
        "Bir worker bir buffer yazıp sonra `ready` bayrağını set ediyor; bir okuyucu bayrakta spin edip sonra buffer'ı okuyor. İkisi de `Relaxed` kullanıyor. Ne ters gidebilir?",
      options: [
        "Okuyucu, buffer yazmaları görünür olmadan önce `ready == true` görebilir ve çöp okuyabilir",
        "Hiçbir şey — `Relaxed` yine de yazmanın program sırasında önce olmasını garanti eder",
        "Bayrak parçalanabilir (torn) ve ne true ne false olan bir değer gösterebilir",
      ],
      answer: 0,
      explain:
        "Bu yayımlama (publish) kalıbıdır ve store'da `Release`, load'da `Acquire` gerektirir. `Relaxed` her *işlemi* atomik yapar ve çevresinde hiçbir şeyi sıralamaz.",
    },
    {
      kind: "fill",
      prompt: "Bir istatistik sayacını en ucuz doğru ordering ile artır.",
      file: "main.rs",
      before: "hits.fetch_add(1, Ordering::",
      after: ");",
      choices: ["Relaxed", "SeqCst", "Acquire"],
      answer: 0,
      explain:
        "Başka hiçbir şey bu sayacın sıralamasına bağlı değil; dolayısıyla `Relaxed` hem doğru hem en ucuz. `Acquire`, `fetch_add` gibi bir oku-değiştir-yaz üzerinde geçerlidir ama burada hiçbir şeyi sıralamaz ve daha pahalıdır — `SeqCst` daha da pahalı.",
    },
    {
      kind: "quiz",
      question:
        "`SeqCst`'nin dürüst tarifi hangisi?",
      options: [
        "En güçlü ve en yavaş — her thread'in hemfikir olduğu tek bir toplam sıra; emin değilken doğru varsayılan",
        "En hızlısı, çünkü CPU toplam bir sırayı en iyi optimize eder",
        "Farklı adla `AcqRel` ile birebir aynı",
      ],
      answer: 0,
      explain:
        "`SeqCst` ile başlayıp elinde bir benchmark'la zayıflatmak sağlam bir çalışma yoludur. `Relaxed` ile başlayıp umut etmek değildir.",
    },
    {
      kind: "editor",
      intro: `### Kilitsiz say, bir kazanan seç

1. \`0\`'da bir \`Arc<AtomicU64>\` kur. Sekiz thread spawn et; her biri bin kez \`fetch_add(1, Ordering::Relaxed)\` yapsın. Join et ve değeri bir \`Acquire\` load ile yazdır.
2. \`false\`'ta bir \`AtomicBool\` oluştur. \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\`'i **iki kez** çağır ve her sonucu \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — biz kazandık ve değiştirdiğimiz değer \`false\`'tu. \`Err(true)\` — kaybettik ve gerçekte bulduğumuz şey bu.`,
    },
  ],

  "rust-concurrency-8": [
    {
      kind: "theory",
      body: `Bir channel (kanal), thread'ler arasında **ownership** taşır. \`mpsc\` çok üreticili, tek tüketicilidir (multi-producer, single-consumer): sender'ı istediğin kadar clone'la, tek bir receiver tut.

\`\`\`rust
let (tx, rx) = mpsc::channel::<u64>();
for id in 0..3 {
    let tx = tx.clone();
    thread::spawn(move || { tx.send(id).unwrap(); });
}
drop(tx);                       // orijinali drop et, yoksa rx hiç bitmez
for value in rx { ... }
\`\`\`

O \`drop(tx)\`, insanların kaçırdığı ayrıntıdır. Receiver'ın iterator'ı **her** sender gittiğinde biter — ve \`main\`'deki orijinal \`tx\` onlardan biridir.`,
    },
    {
      kind: "theory",
      body: `\`channel()\` **sınırsızdır** (unbounded). Bir üretici asla beklemez; kulağa iyi gelir ve bellek sızıntısı kurmanın klasik yoludur: tüketiciler üreticilerden yavaşsa, kuyruk süreç öldürülene kadar büyür.

\`sync_channel(n)\` **sınırlıdır** (bounded). \`n\` mesaj buffer'landıktan sonra \`send\` bloklar:

\`\`\`rust
let (tx, rx) = mpsc::sync_channel::<u64>(1);
tx.send(1).unwrap();
tx.try_send(2).is_err();     // true — dolu
\`\`\`

O bloklama **backpressure**'ın (geri basınç) ta kendisidir: kuyruğun derinliği, üreten kim ise ona geri giden bir sinyale dönüşür; böylece aşırı yüklenmiş bir sistem, buffer'laya buffer'laya bir out-of-memory kill'e gitmek yerine alımını yavaşlatır.

Bir servis için sınırlıyı tercih et. Sınırsız bir kuyruk limiti kaldırmaz; onu yalnızca, bir metrik olarak değil bir page (uyarı çağrısı) olarak öğreneceğin bir yere taşır.`,
    },
    {
      kind: "quiz",
      question:
        "Her worker bitmiş olmasına rağmen bir `for value in rx` döngüsü hiç sonlanmıyor. Neden?",
      options: [
        "`main`'deki orijinal sender hiç drop edilmedi; dolayısıyla channel'ın hâlâ canlı bir sender'ı var",
        "Receiver'ın `rx.close()` ile açıkça kapatılması gerekir",
        "Worker'ların çıkmadan önce `tx.flush()` çağırması gerekir",
      ],
      answer: 0,
      explain:
        "Iterator, sender sayısı sıfıra ulaştığında biter. Her worker için clone'layıp orijinali unutmak, tam olarak bir sender'ı canlı bırakır — bekleyen thread'in içinde.",
    },
    {
      kind: "fill",
      prompt: "Üreticilerin backpressure hissetmesi için sınırlı bir channel oluştur.",
      file: "main.rs",
      before: "let (btx, brx) = mpsc::",
      after: "::<u64>(1);",
      choices: ["sync_channel", "channel", "bounded"],
      answer: 0,
      explain:
        "`channel()` sınırsızdır ve kapasite argümanı almaz. `bounded`, Crossbeam'in buna verdiği addır — std ona `sync_channel` der.",
    },
    {
      kind: "quiz",
      question:
        "Yavaş bir tüketicinin önündeki sınırsız bir kuyrukta gerçekte ne ters gider?",
      options: [
        "Bellek, süreç OOM-kill edilene kadar sınırsız büyür — limit hâlâ vardır, sadece makineninkidir",
        "Dahili bir limite ulaşılınca mesajlar sessizce düşürülür",
        "Sender'lar bloklamaya başlar; istenen backpressure de budur",
      ],
      answer: 0,
      explain:
        "Sınırsız, 'limit yok' demek değildir; 'limit RAM'dir ve bunu page'lenerek öğrenirsin' demektir. Sınırlı bir kuyruk limiti senin yapar ve gecikme (latency) olarak görünür kılar.",
    },
    {
      kind: "editor",
      intro: `### Topla, sonra backpressure'ı hisset

1. \`mpsc::channel::<u64>()\`. Üç üretici spawn et; üretici \`id\`, \`0..3\` içindeki \`n\` için \`id * 10 + n\` göndersin. **Orijinal sender'ı drop et**, sonra receiver'ı bir \`Vec<u64>\`'ye topla, sırala, kendisini ve uzunluğunu yazdır.
2. \`mpsc::sync_channel::<u64>(1)\`. Bir değer gönder, ikinci bir \`try_send\`'in **başarısız** olup olmadığını yazdır, sonra \`recv()\` yap ve çıkanı yazdır.

Beklenen çıktı:

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Fan-in'i deterministik yapan sıralamadır — varış sırası değildir.`,
    },
  ],
};
