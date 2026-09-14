import type { LessonStep } from "@/content/steps";

// TR · Async From First Principles.
//
// Overlay for ../../steps/rust-async-internals.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustAsyncInternalsStepsTr: Record<string, LessonStep[]> = {
  "rust-async-internals-1": [
    {
      kind: "theory",
      body: `Bir \`Future\` (gelecek değer), tek metodu olan bir struct'tır. Soyutlamanın tamamı bu kadar:

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` (yoklama) bir sorudur: *"bitti mi?"* Cevap ya \`Poll::Ready(değer)\` ya da \`Poll::Pending\`'dir.

Burada thread yok, scheduler yok, sihir yok. Bir future, başkasının tekrar tekrar çağırmak zorunda olduğu bir durum makinesidir (state machine).`,
    },
    {
      kind: "theory",
      body: `İmzanın iki parçasını şimdiden adlandıralım ki gürültü olmaktan çıksınlar.

**\`Pin<&mut Self>\`.** Bir \`async\` bloğu, *kendi içine* referans tutabilen bir durum makinesine derlenir — bir \`.await\`'i aşan borrow, kendine referans veren bir struct'a dönüşür. Böyle bir değeri taşımak o pointer'ları geçersiz kılar; \`Pin\` (sabitleme) de değerin yerinden oynamayacağına dair sözdür. Kendine referansı olmayan, elle yazılmış bir future için \`Pin::new(&mut f)\` bedavadır ve sıradandır.

**\`Context\`.** Şu an tam olarak tek bir şey taşır: \`Waker\` (uyandırıcı). Bir future \`Pending\` döndürdüğünde, ilerleme mümkün olur olmaz waker'ın çağrılmasını ayarlamak onun sorumluluğudur — executor'ın (yürütücü) boşa dönmesini engelleyen şey budur. Üçüncü ders bir tane inşa ediyor.

Yalnızca imzadan çıkan kural: **\`poll\` asla bloklamamalı.** Hızla \`Pending\` döndürüp daha sonra yeniden poll edilmeli; yoksa aynı thread'i paylaşan diğer bütün future'lar durur.`,
    },
    {
      kind: "quiz",
      question: "Mekanik olarak bir `Future` nedir?",
      options: [
        "`Ready(v)` ya da `Pending` döndüren bir `poll` metoduna sahip bir durum makinesi — kendi kendine hiçbir şey onu çalıştırmaz",
        "Future oluşturulduğunda runtime'ın başlattığı bir thread'e handle",
        "İşletim sisteminin event loop'una kaydedilmiş bir callback",
      ],
      answer: 0,
      explain:
        "Rust'ın future'ları *poll tabanlıdır*; JavaScript'in promise'leri ise push tabanlıdır ve hemen çalışmaya başlar. Async Rust'taki neredeyse her sürpriz bu tek farktan doğar.",
    },
    {
      kind: "fill",
      prompt: "Future'ın bittiğini, değerini de taşıyarak bildir.",
      file: "main.rs",
      before: "fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {\n    Poll::",
      after: "(self.0)\n}",
      choices: ["Ready", "Pending", "Done"],
      answer: 0,
      explain:
        "`Poll`'un tam olarak iki varyantı vardır: `Ready(T)` ve `Pending`. `Pending` hiçbir şey taşımaz — henüz bir değer yoktur.",
    },
    {
      kind: "quiz",
      question: "`poll` neden `&mut self` yerine `Pin<&mut Self>` alır?",
      options: [
        "Bir `async` bloğu kendi durumuna referans tutabilir ve taşınması onları geçersiz kılar — `Pin` yerinden oynamayacağına söz verir",
        "`Pin`, iki thread'in aynı anda poll etmesini engelleyen bir lock'tur",
        "Runtime drop edene kadar future'ı hayatta tutar",
      ],
      answer: 0,
      explain:
        "`Pin`'in var olma sebebi tam olarak budur. Kendine referansı olmayan elle yazılmış bir future için `Pin::new(&mut f)` hiçbir şeye mal olmaz — `Pin` ile karşılaşmanın sebebi `async fn`'in ürettiği şeydir.",
    },
    {
      kind: "editor",
      intro: `### Future'ı elle implemente et

1. \`Future<Output = u32>\` implemente eden ve hemen \`Poll::Ready(self.0)\` döndüren bir \`struct Immediate(u32)\`.
2. \`Future<Output = u32>\` implemente eden bir \`struct Countdown { left: u32 }\`: \`left > 0\` olduğu sürece azalt ve \`Pending\` döndür; sıfırda \`Ready(0)\` döndür.
3. \`main\` içinde \`Waker::noop()\`'tan bir \`Context\` kur ve her future'ı elle poll et — \`Immediate\`'ı bir kez, \`Countdown\`'ı üç kez — her \`Poll\`'u \`{:?}\` ile yazdırarak.

Beklenen çıktı:

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

Bu programda executor yok. Executor sensin.`,
    },
  ],

  "rust-async-internals-2": [
    {
      kind: "theory",
      body: `Bir \`async fn\` çağırmak **gövdesinin hiçbir satırını çalıştırmaz**. Bir durum makinesi kurar ve sıfırıncı durumda bekler halde sana teslim eder:

\`\`\`rust
let fut = build();          // henüz hiçbir şey olmadı
\`\`\`

Gövde yalnızca biri onu poll ettiğinde çalışır. Bu, oluşturulduğu anda çalışmaya başlayan JavaScript promise'inin tam tersidir.

Await edilmemiş bir future'ın uyarı olmasının sebebi de bu: \`Future\` \`#[must_use]\`'dur ve birini sessizce drop etmek, istediğin işin hiç yapılmadığı anlamına gelir.`,
    },
    {
      kind: "theory",
      body: `Tembellik (laziness) bir özelliktir ve ondan üç gerçek davranış türer.

**Cancellation (iptal) bedavadır.** Future'ı drop et, iş hiç yapılmasın. Runtime'ın hiçbir şeyi kesmesi gerekmez — bunun temizlik için ne anlama geldiğini iki ders sonrası anlatıyor.

**Composition (birleştirme) bedavadır.** \`select!\` beş future kurup biri bitene kadar hepsini poll edebilir, sonra kalanları drop eder. Oluşturmak onları başlatsaydı, sıfır yerine dört boşa gitmiş işlem olurdu.

**Timeout'lar kesmez, sarar.** \`timeout(d, fut)\`, içtekini son tarihe kadar poll eden sıradan bir future'dır. Öldürülecek bir thread yoktur.

Tembelliğin bedeli hata modudur: \`.await\`'i unut, hiçbir şey çalışmaz, hiçbir hata görünmez ve seni son derece kafa karıştırıcı bir öğleden sonradan ayıran tek şey derleyicinin \`unused_must_use\` uyarısıdır.`,
    },
    {
      kind: "quiz",
      question:
        "`let fut = fetch_data();` yazıldı ve `.await` unutuldu. Ne olur?",
      options: [
        "Hiçbir şey çalışmaz — future poll edilmeden drop edilir ve bunu yalnızca `must_use` uyarısı ima eder",
        "İstek arka planda çalışır ve sonucu atılır",
        "Derleme hatasıdır, çünkü future'lar mutlaka await edilmelidir",
      ],
      answer: 0,
      explain:
        "'İstek arka planda çalışır' bir JavaScript promise'inin yaptığı şeydir ve bu sezgiyi Rust'a taşımak, async'teki en yaygın tek hatadır.",
    },
    {
      kind: "fill",
      prompt:
        "Bir async bloğunun durum makinesini elle poll edilebilsin diye sabitle.",
      file: "main.rs",
      before: "let mut fut = ",
      after: "(build());",
      choices: ["Box::pin", "Box::new", "Pin::new"],
      answer: 0,
      explain:
        "`Pin::new` değerin `Unpin` olmasını ister; bir `async` bloğu ise değildir. `Box::pin` tek adımda hem ayırır hem sabitler — `.await`'in perde arkasında senin için yaptığı tam olarak budur.",
    },
    {
      kind: "quiz",
      question: "Tembellik iptali neden ucuz kılar?",
      options: [
        "Çalışmamış işin kesilmesi gerekmez — future'ı drop etmek iptalin ta kendisidir",
        "Runtime her future için bir geri alma günlüğü tutar",
        "İptal edilen future'lar düzgün çözülsün diye bir kez daha poll edilir",
      ],
      answer: 0,
      explain:
        "Bu, iptalin neden *async* olamayacağını da açıklar: drop senkrondur, dolayısıyla await gerektiren her temizlik başka bir yolla ayarlanmalıdır.",
    },
    {
      kind: "editor",
      intro: `### Kendi kendine hiçbir şeyin çalışmadığını kanıtla

1. \`Future<Output = &'static str>\` implemente eden bir \`struct Effect { ran: bool }\`: \`poll\`, \`ran = true\` yapar ve \`Ready("side effect happened")\` döndürür.
2. \`"from an async fn"\` döndüren bir \`async fn build() -> &'static str\`.
3. \`main\` içinde: \`Effect\`'i oluştur ve \`ran\`'i yazdır (false). Bir kez poll et, \`Poll\`'u ve \`ran\`'i yeniden yazdır (true). Sonra \`build()\`'i çağır, hiçbir şeyin çalışmadığını yazdır, \`Box::pin\` ile sabitle ve poll et.

Beklenen çıktı:

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\``,
    },
  ],

  "rust-async-internals-3": [
    {
      kind: "theory",
      body: `Bir executor (yürütücü) bir döngüdür:

\`\`\`rust
loop {
    match future.as_mut().poll(&mut cx) {
        Poll::Ready(v) => return v,
        Poll::Pending  => /* uyandırılana kadar bekle */,
    }
}
\`\`\`

Tek zor kısım *"uyandırılana kadar bekle"*. Boşa dönmek işe yarardı ama bir çekirdeği yakardı. Onun yerine executor, \`Context\` içinde bir \`Waker\` verir ve thread'i park eder — future'ın işi de ilerleme mümkün olduğunda o waker'ı çağırmaktır.`,
    },
    {
      kind: "theory",
      body: `\`Waker\` elle kurulmuş bir vtable'dır, çünkü \`dyn\`'ın bu konumda kullanılabilir olmasından öncedir:

\`\`\`rust
static VTABLE: RawWakerVTable =
    RawWakerVTable::new(clone_raw, wake_raw, wake_by_ref_raw, drop_raw);
\`\`\`

Silinmiş bir \`*const ()\` üzerinde dört fonksiyon pointer'ı — o pointer da raw pointer'a sızdırdığımız (leak) ve her callback'te yeniden kurduğumuz bir \`Arc\`. \`clone\` refcount'u artırmalı, \`drop\` azaltmalı; bunu yanlış yapmak ya sızıntı ya da double-free demektir. Async Rust'ta gerçekten \`unsafe\`'e ihtiyaç duyduğun tek yer burasıdır ve her gerçek projenin bunun için bir crate kullanmasının sebebi de bu.

Park kısmı bir \`Mutex<bool>\` artı bir \`Condvar\`: \`wait\` bayrak set edilene kadar uyur, \`notify\` bayrağı set eder ve uyuyanı uyandırır. Bunu bir kez yazmak bir öğleden sonraya değer — bundan sonra \`block_on\`, bir crate'ten gelen gizemli bir fonksiyon değil, senin zaten yazdığın otuz satırdır.`,
    },
    {
      kind: "quiz",
      question: "`Waker`'ın işi nedir?",
      options: [
        "Future'ın executor'a 'beni yeniden poll et' demesini sağlamak — o olmadan executor ya boşa döner ya da sonsuza dek uyur",
        "Future'ın gövdesini bir arka plan thread'inde çalıştırmak",
        "Çok uzun sürdüğünde future'ı iptal etmek",
      ],
      answer: 0,
      explain:
        "Async'i verimli kılan sözleşme budur: `Pending` bir future, biri onu uyandırana kadar hiçbir şeye mal olmaz; dolayısıyla on bin boşta bağlantı, on bin park edilmiş durum makinesi ve sıfır CPU demektir.",
    },
    {
      kind: "fill",
      prompt:
        "Future'ı döngüde tekrar tekrar poll edilebilsin diye heap'te bir kez sabitle.",
      file: "main.rs",
      before: "let mut future = ",
      after: "(future);",
      choices: ["Box::pin", "Box::new", "Arc::new"],
      answer: 0,
      explain:
        "`block_on`, `Unpin` olmayan bir async bloğu dahil her `F: Future`'ı kabul eder, dolayısıyla onu sabitlemek zorundadır. Box'lamak en basit yol; gerçek executor'lar allocation'dan kaçınmak için stack'te sabitler.",
    },
    {
      kind: "quiz",
      question:
        "Elle yazılmış bir future `Pending` döndürüyor ve waker'ı hiç çağırmıyor. Gerçek bir executor'da ne olur?",
      options: [
        "Bir daha asla poll edilmez — task sonsuza dek askıda kalır; ne hata ne de CPU kullanımı vardır",
        "Executor varsayılan bir timeout'tan sonra onu yeniden poll eder",
        "Runtime eksik uyandırmayı tespit eder ve panic'ler",
      ],
      answer: 0,
      explain:
        "Bu, elle yazılmış future'ların klasik bug'ıdır ve görünmezdir: task öylece durur. Kimse seni uyarmaz, çünkü 'henüz hazır değil' ile 'asla hazır olmayacak' dışarıdan tıpatıp aynı görünür.",
    },
    {
      kind: "editor",
      intro: `### Gerçek bir block_on yaz

1. \`new() -> Arc<Signal>\`, \`wait(&self)\` (bayrak set edilene kadar uyu, sonra temizle) ve \`notify(&self)\` metotlarına sahip bir \`struct Signal { ready: Mutex<bool>, cv: Condvar }\`.
2. \`*const ()\`'a sızdırılmış bir \`Arc<Signal>\` üzerinde dört \`unsafe fn\` içeren bir \`static VTABLE: RawWakerVTable\`. \`clone\` sayacı artırır, \`wake_by_ref\` tüketmeden bildirir, \`wake\` bildirir ve tüketir, \`drop\` azaltır.
3. \`Waker::from_raw\` ile kuran bir \`fn waker_for(signal: &Arc<Signal>) -> Waker\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, context'i kur, sonra döngü: \`Ready\` döndürür, \`Pending\` \`signal.wait()\` çağırır.
5. Üç kez yield edip sonra \`Ready(7)\` döndüren bir \`struct Yield { left: u32 }\` ve onu await edip 1 ekleyen bir \`async fn work() -> u32\`.
6. \`block_on(async { 5u32 })\` ve \`block_on(work())\` çalıştır.

Beklenen çıktı:

\`\`\`text
simple: 5
yielding: 8
\`\`\`

Bu yoldaki en uzun alıştırma. Aynı zamanda, sonrasında her runtime'ı sıradan kod gibi okutan alıştırma.`,
    },
  ],

  "rust-async-internals-4": [
    {
      kind: "theory",
      body: `Async eşzamanlılık **kooperatiftir** (işbirlikçi). Bir task \`Pending\` döndürene kadar çalışır ve ancak o zaman aynı thread'deki başka bir task çalışabilir. Hiçbir şey onu önceden kesmez (preempt).

Yani modelin tek bir gereksinimi var: her task düzenli olarak \`Pending\` döndürmeli. Tek bir \`poll\` içinde 200ms hesap yapan bir task, runtime thread'ini 200ms boyunca tutar ve o thread'e atanmış diğer her task bekler — istemcileri timeout'a düşenler dahil.`,
    },
    {
      kind: "theory",
      body: `Bu hata modunun bir adı var — **executor'ı bloklamak** — ve üç yaygın sebebi:

- **Senkron I/O.** \`std::fs::read\`, bloklayan bir veritabanı sürücüsü, bir \`async fn\` içinde \`std::thread::sleep\`.
- **CPU ağırlıklı iş.** Hash'leme, sıkıştırma, büyük bir sıralama.
- **Bir \`.await\` boyunca tutulan lock.** Task lock'u elinde tutarken park olur ve herkes, çalışmıyor bile olan bir task'in arkasında kuyruğa girer.

Çözüm, işi async thread'lerin dışına taşımaktır: I/O ve kısa bloklayan çağrılar için \`tokio::task::spawn_blocking\`, ağır CPU işi için ayrı bir \`rayon\` pool'u. Pratik kural: bir poll onlarca mikrosaniyede tamamlanmalı.

Belirtinin bu kadar kafa karıştırıcı olmasının sebebi de bu. Gecikme, bloklamayı yapan endpoint'te değil, suçluyla aynı runtime thread'ini paylaşan endpoint'lerde yükselir — yani yavaş trace masum kodu gösterir.`,
    },
    {
      kind: "quiz",
      question:
        "Bir handler, bir `async fn` içinde 200ms'lik senkron bir dosya okuması yapıyor. Operatör ne görür?",
      options: [
        "p99 gecikmesi o runtime thread'ini paylaşan *diğer* endpoint'lerde yükselir — suçlu handler gayet iyi görünebilir",
        "Yalnızca o handler yavaşlar; runtime task'leri birbirinden izole eder",
        "Runtime bir uyarı loglar ve task'i bloklayan bir pool'a taşır",
      ],
      answer: 0,
      explain:
        "Debug'ı bu kadar pahalı kılan şey bu yanıltmadır. Tokio'nun `--cfg tokio_unstable` task metrikleri ve poll süresi histogramı tam olarak gerçek suçluyu göstermek için vardır.",
    },
    {
      kind: "fill",
      prompt:
        "Diğer task'ler ilerleyebilsin diye kontrolü executor'a geri ver.",
      file: "main.rs",
      before: "self.left -= 1;\ncx.waker().",
      after: "();\nPoll::Pending",
      choices: ["wake_by_ref", "wake", "clone"],
      answer: 0,
      explain:
        "`wake_by_ref`, waker'ı tüketmeden yeni bir poll planlar — waker sana verilen `Context` içinde yaşıyorken istediğin tam olarak budur.",
    },
    {
      kind: "quiz",
      question: "CPU ağırlıklı 500ms'lik bir hesap nerede çalışmalı?",
      options: [
        "Ayrı bir pool'da — `spawn_blocking` ya da bir `rayon` pool'u — asla bir async worker thread'indeki poll'un içinde değil",
        "`async fn`'in içinde, çünkü runtime bir dilimden sonra onu keser",
        "Runtime'ın otomatik olarak harmanladığı birçok `async fn`'e bölünmüş halde",
      ],
      answer: 0,
      explain:
        "Güvenilecek bir preemption yok. Birkaç `async fn`'e bölmek de hiçbir şeyi değiştirmez — arada bir `.await` yoksa hâlâ tek bir kesintisiz poll'dur.",
    },
    {
      kind: "editor",
      intro: `### Kooperatif olmak, ve olmadığında ne olur

1. \`Future<Output = ()>\` implemente eden bir \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\`: \`"<name>:<left>"\` logla; \`left\` sıfırsa \`Ready\` döndür, değilse azalt, uyandır ve \`Pending\` döndür.
2. Tek bir \`poll\`'u üç kayıt loglayıp \`Ready\` döndüren bir \`struct Hog { name, log }\` — bütün işi tek turda.
3. İki \`Task\`'i (\`a\` ve \`b\`, ikisi de \`left: 2\`) ikisi de bitene kadar dönüşümlü poll et ve logu yazdır.
4. Taze bir logla, bir \`Hog\`'u bitene kadar poll et, sonra \`starved\` adlı bir \`Task\`'i (\`left: 1\`), ve o logu yazdır.

Beklenen çıktı:

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

İlk log harmanlanır. İkincisi harmanlanmaz — hog, diğer task tek bir tur alamadan her şeyi bitirdi.`,
    },
  ],

  "rust-async-internals-5": [
    {
      kind: "theory",
      body: `Async Rust'ta \`cancel()\` yoktur. **Cancellation (iptal), future'ı drop etmektir.**

\`\`\`rust
{
    let mut req = Request { .. };
    poll(&mut req);          // başladı
    poll(&mut req);          // hâlâ pending
}                            // burada drop edildi — iptal
\`\`\`

Durum makinesi, askıya alındığı yer neresiyse orada yok edilir. Tuttuğu her yerel değişken olağan sırayla drop edilir. Temizlik mekanizmasının tamamı budur.`,
    },
    {
      kind: "theory",
      body: `Bir servisin yük altında doğru çalışıp çalışmayacağını belirleyen iki sonuç.

**Bir future herhangi bir \`.await\`'te drop edilebilir.** Bir istemci bağlantıyı kestiğinde ya da bir timeout tetiklendiğinde task iki ifade arasında durur. Yarım kalan her şey yarım kalır — dolayısıyla iki adımlı bir işlem ya idempotent olmalı ya da bir retry'ın güvenle tekrarlayabileceği şekilde sarılmalıdır. Bu özelliğin adı **cancellation safety** (iptal güvenliği) ve kütüphane dokümanları bunu açıkça belirtir: \`tokio::sync::mpsc::Receiver::recv\` ve \`AsyncReadExt::read\` cancel-safe'tir; \`read_exact\` değildir, çünkü drop edildiğinde byte'ları senin buffer'ına çoktan taşımış olabilir.

**Temizlik senkron olmalı.** \`Drop\` \`.await\` edemez, dolayısıyla bir future çıkarken zarif bir kapanışı await edemez. Standart çözümler: temizliği \`Drop\` içinde senkron yapmak ya da işi, iptal edilenden daha uzun yaşayan ayrık (detached) bir task'e devretmek.

Pratik şekil: await edilen bölgeyi küçük tut, her adımı idempotent yap ve mutlaka olması gereken her şeyi son \`.await\`'ten sonraya değil, bir \`Drop\` guard'ının arkasına koy.`,
    },
    {
      kind: "quiz",
      question: "Rust'ta uçuştaki bir async task nasıl iptal edilir?",
      options: [
        "Future'ı drop edilir — durum makinesi askıya alındığı yerde yok edilir ve her yerel değişkenin `Drop`'u çalışır",
        "Runtime ona yakalayıp ele alabileceği bir iptal sinyali gönderir",
        "`Context` içinde bir iptal bayrağı set edilerek son bir kez poll edilir",
      ],
      answer: 0,
      explain:
        "Düz bir `Drop` olduğu için iptal senkrondur ve await edilemez. Async Rust'taki neredeyse her zarif kapanış (graceful shutdown) zorluğunun kaynağı bu tek gerçektir.",
    },
    {
      kind: "fill",
      prompt:
        "Future uçuşun ortasında iptal edilse bile çalışacak bir temizlik ekle.",
      file: "main.rs",
      before: "impl ",
      after: " for Request {\n    fn drop(&mut self) { /* release */ }\n}",
      choices: ["Drop", "Future", "Cancel"],
      answer: 0,
      explain:
        "İptalde çalışan tek kanca `Drop`'tur. Son `.await`'ten sonraya konan kod çalışmaz, çünkü task oraya hiç ulaşmaz.",
    },
    {
      kind: "quiz",
      question:
        "Bir handler bir hesaptan para çekiyor, bir ağ çağrısını `.await` ediyor, sonra başka bir hesaba yatırıyor. İstemci await sırasında bağlantıyı kesiyor. Durum nedir?",
      options: [
        "Çekildi ama yatırılmadı — future uçuşun ortasında drop edildi ve para kayboldu",
        "Future drop edildiğinde iki adım da otomatik geri alınır",
        "Runtime, bağlantı kopmasına uymadan önce handler'ı bitirir",
      ],
      answer: 0,
      explain:
        "Bu, bir stil notu değil, bir doğruluk bug'ı olarak cancellation safety'dir. Çözüm bir transaction, bir idempotency key ya da telafi eden bir `Drop` guard'ıdır — istemcinin bağlı kalmasını ummak değil.",
    },
    {
      kind: "editor",
      intro: `### Bir iptalin temizlik yapışını izle

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`"cleanup <id>"\` push eden bir \`impl Drop\`.
3. \`poll\`'u \`"poll <id>"\` push eden, uyandıran ve sonsuza dek \`Pending\` döndüren bir \`impl Future<Output = u32>\`.
4. \`main\` içinde: bir blok içinde \`1\` numaralı isteği oluştur, **iki kez** poll et ve bloğun bitmesine izin ver — iptal budur. Bir \`"---"\` işareti push et. Sonra \`2\` numaralı isteği oluştur, bir kez poll et ve açıkça \`drop\` et.
5. Logu yazdır.

Beklenen çıktı:

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

İki istek de hiç \`Ready\` döndürmedi. İkisi de yine de temizlik yaptı.`,
    },
  ],

  "rust-async-internals-6": [
    {
      kind: "theory",
      body: `Bir timeout ne bir sinyaldir ne de bir thread. İki şeyi poll edip hangisi önce biterse onu döndüren bir future'dır:

\`\`\`rust
loop {
    if let Poll::Ready(v) = poll(&mut work)    { return v; }
    if let Poll::Ready(v) = poll(&mut deadline) { return v; }
}
\`\`\`

\`select!\` (yarıştırma) budur; \`timeout(d, fut)\` de bir tarafın timer olduğu özel haldir. Hiçbir şey kesilmez — **kaybeden öylece drop edilir**, ki önceki derse göre iptal tam olarak budur.`,
    },
    {
      kind: "theory",
      body: `Bundan üç şey çıkar ve her biri er ya da geç birini ısırır.

**Drop edilen dal uçuşun ortasında iptal edilir.** Kaybeden dal iki adımlı bir işlemin yarısını yapmışsa o yarı yapılmış kalır. Bir \`select!\` dalına yalnızca cancel-safe bir future koy, ya da kısmi durumun önemsiz olacağı şekilde yeniden yapılandır.

**Poll sırası bir adalet (fairness) meselesidir.** Her zaman önce ilk dalı poll eden naif bir \`select\`, ilk dal genellikle hazırsa ikinciyi aç bırakır (starvation). \`tokio::select!\` tam da bu yüzden dal sırasını varsayılan olarak rastgeleleştirir — gerçekten öncelik istediğinde \`biased;\` ile bunu kapatmana izin verir.

**Her dışa giden çağrının bir son tarihi olmalı.** Olmazsa, takılan bir bağımlılık senin kendi sınırsız kuyruğuna dönüşür: bağlantılar yığılır, bellek büyür ve kesinti seni kim çağırıyorsa ona yayılır. Timeout hata yönetimi değildir; bir hatanın yerel kalma biçimidir.`,
    },
    {
      kind: "quiz",
      question: "Bir `select!`'in kaybeden dalına ne olur?",
      options: [
        "Drop edilir — askıya alındığı yerde iptal edilir, kısmi işi olduğu gibi kalır",
        "Arka planda çalışmaya devam eder ve sonucu atılır",
        "Önce tamamlanana kadar poll edilir, sonra yok sayılır",
      ],
      answer: 0,
      explain:
        "`tokio` dokümanlarının future'ları cancel-safe olup olmadığına göre işaretlemesinin sebebi budur. Cancel-safe olmayan bir future'ı bir `select!` dalına koymak bir performans notu değil, bir doğruluk bug'ıdır.",
    },
    {
      kind: "fill",
      prompt:
        "Diğerini beklemeden, iki taraftan biri biter bitmez dön.",
      file: "main.rs",
      before: "if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) {\n    ",
      after: " v;\n}",
      choices: ["return", "break", "continue"],
      answer: 0,
      explain:
        "Hemen dönmek diğer future'ı drop eden şeydir — kaybeden, fonksiyonla birlikte scope dışına çıkar. O drop, iptalin *ta kendisidir*.",
    },
    {
      kind: "quiz",
      question:
        "`tokio::select!` hangi dalı önce poll edeceğini neden rastgeleleştirir?",
      options: [
        "Önceki bir dal genellikle hazır olduğunda sonraki dalların aç kalmasını önlemek için",
        "Makronun açılımını küçültmek için",
        "Yükü runtime worker thread'lerine eşit dağıtmak için",
      ],
      answer: 0,
      explain:
        "Sabit bir sıra bir öncelik sırasıdır ve istemediğin öncelik, starvation'dır. Öncelik bilinçli olduğunda `biased;` deterministik sıraya geri döner.",
    },
    {
      kind: "editor",
      intro: `### İki future'ı yarıştır

1. \`Future<Output = &'static str>\` implemente eden bir \`struct Ticks { label: &'static str, left: u32 }\`: sıfırda \`Ready(self.label)\` döndür, değilse azalt, uyandır, \`Pending\` döndür.
2. İkisi de \`Future<Output = &'static str> + Unpin\` olan bir \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` — döngüde önce \`a\`'yı sonra \`b\`'yi poll et, ilk \`Ready\`'yi döndür.
3. \`work\`'ü (\`left: 2\`) \`timeout\`'a (\`left: 5\`) karşı yarıştır, sonra \`work\`'ü (\`left: 9\`) \`timeout\`'a (\`left: 3\`) karşı.

Beklenen çıktı:

\`\`\`text
work
timeout
\`\`\`

Her iki durumda da kaybeden \`return\`'de drop edilir — ki bu tam olarak bir iptaldir.`,
    },
  ],

  "rust-async-internals-7": [
    {
      kind: "theory",
      body: `Tokio'nun sağladığı her şey, artık senin zaten inşa ettiğin bir şeyin adı.

| sen yazdın | Tokio |
| --- | --- |
| \`block_on\` içindeki \`loop\` | \`#[tokio::main]\` / \`Runtime::block_on\` |
| bir future'ı kuyruğa push etmek | \`tokio::spawn\` |
| kuyruk kaydının kendisi | \`JoinHandle<T>\` |
| senin \`race\` fonksiyonun | \`tokio::select!\` |
| bir sayaca karşı yarışmak | \`tokio::time::timeout\` |
| \`Signal\` + \`Condvar\` | reactor'ın waker kaydı |
| "poll'u bloklama" | \`tokio::task::spawn_blocking\` |

Listede fazladan bir kavram yok. Tokio'nun eklediği şey ölçek ve bir I/O reactor'ı.`,
    },
    {
      kind: "theory",
      body: `Kütüphaneden alınmaya, yazmak yerine gerçekten değecek parçalar:

**Bir epoll/kqueue reactor'ı.** Senin \`Signal\`'ın bir condvar'da uyandı. Gerçek bir runtime bir socket'i işletim sistemine kaydeder ve socket'i okunabilir hale gelen task'i, tam olarak onu uyandırır. Tek bir thread'in on bin bağlantıya hizmet etmesini sağlayan şey budur.

**Çok thread'li, work-stealing (iş çalan) bir scheduler.** Task'ler worker thread'lere dağıtılır ve boşta kalan bir worker, meşgul olanın kuyruğundan çalar. \`tokio::spawn\`'daki \`Send + 'static\` bound'unun (sınır) geldiği yer burasıdır: bir task herhangi bir await noktasında thread'ler arasında göç edebilir.

**Bir timer wheel.** Senin yarışın bir sayacı busy loop'ta poll etti. Tokio tek bir sıralı timer yapısı tutar ve her task'i son tarihinde uyandırır; böylece bir milyon bekleyen timeout neredeyse hiçbir şeye mal olmaz.

İnşa ettiğin zihinsel modeli koru. Bir task askıda kaldığında soru hâlâ *"waker'ı kim çağıracaktı ve neden çağırmadı?"* — ve artık bunun ne anlama geldiğini biliyorsun.`,
    },
    {
      kind: "quiz",
      question:
        "`tokio::spawn` neden future'ın `Send + 'static` olmasını ister?",
      options: [
        "Work-stealing scheduler task'i worker thread'ler arasında taşıyabilir ve task, onu spawn eden fonksiyondan daha uzun yaşayabilir",
        "Spawn edilen her task reactor'a gönderilmek üzere serileştirilir",
        "`'static`, task'in tüm process ömrü boyunca çalışmasını garanti eder",
      ],
      answer: 0,
      explain:
        "`tokio::task::spawn_local`, `Send` şartını tam da bir `LocalSet` task'leri tek bir thread'e sabitlediği için kaldırır — bound göçle ilgilidir, async'le değil.",
    },
    {
      kind: "fill",
      prompt:
        "Farklı türden future'ları tek bir kuyrukta sakla — mini runtime'ın task listesi.",
      file: "main.rs",
      before: "type Task = ",
      after: "<Box<dyn Future<Output = &'static str>>>;",
      choices: ["Pin", "Box", "Arc"],
      answer: 0,
      explain:
        "`Pin<Box<dyn Future>>` kanonik box'lanmış task tipidir — bilinmeyen boyut için `Box`, `poll` gerektirdiği için `Pin`. Tokio'nun dahili task tipi, biraz daha fazla defter tutmayla, budur.",
    },
    {
      kind: "quiz",
      question:
        "Production'daki bir task CPU kullanmadan ve hata vermeden sonsuza dek askıda kalıyor. İlk soru nedir?",
      options: [
        "Bu task'in waker'ını kim çağıracaktı ve neden çağırmadı?",
        "Hangi thread'i blokluyor ve onu nasıl keseriz?",
        "Stack'i ne kadar büyük ve taştı mı?",
      ],
      answer: 0,
      explain:
        "Sıfır CPU, bloklamayı eler — bloklanmış bir task thread'ini yakar. Hiç uyandırılmayan park edilmiş bir task sessizdir ve eksik bir wake'in şekli tam olarak budur.",
    },
    {
      kind: "editor",
      intro: `### Spawn'lı bir mini runtime

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`new()\`, \`Box::pin(f)\` push eden \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` ve pop edip poll eden, \`Ready\`'yi kaydedip \`Pending\`'i yeniden kuyruğa alan \`run(&mut self)\` metotlarına sahip bir \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\`.
3. Etiketini döndürmeden önce \`left\` kez yield eden bir \`struct Delayed { label: &'static str, left: u32 }\`.
4. \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` ve \`async { "immediate" }\` spawn et, çalıştır ve tamamlanma sırasını yazdır.

Beklenen çıktı:

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

Tamamlanma sırası spawn sırasına göre değil, *hazır olmaya* göredir. Bu runtime'ın koşulsuz yeniden kuyruğa aldığına ve dolayısıyla waker'ı tamamen yok saydığına dikkat et — onu gerçek bir runtime'dan ayıran tek şey bu.`,
    },
  ],
};
