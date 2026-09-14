// TR · editor instructions — Async From First Principles.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-async-internals.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustAsyncInternalsInstructionsTr: Record<string, { instructions: string }> = {
  "rust-async-internals-1": {
    instructions: `## Future'ı elle implemente et

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` (yoklama) "bitti mi?" diye sorar ve \`Ready(v)\` ya da \`Pending\` diye cevap verir. Bir future'ı (gelecek değer) kendi kendine hiçbir şey çalıştırmaz.

### Görevin

1. \`Future<Output = u32>\` implemente eden ve hemen \`Poll::Ready(self.0)\` döndüren bir \`struct Immediate(u32)\`.
2. \`Future<Output = u32>\` implemente eden bir \`struct Countdown { left: u32 }\`: \`left > 0\` olduğu sürece azalt ve \`Pending\` döndür; sıfırda \`Ready(0)\` döndür.
3. \`main\` içinde \`Waker::noop()\`'tan bir \`Context\` kur ve her birini elle poll et — \`Immediate\`'ı bir kez, \`Countdown\`'ı üç kez — her \`Poll\`'u \`{:?}\` ile yazdırarak.

Beklenen çıktı:

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

Bu programda executor (yürütücü) yok. Executor sensin.

### İpuçları

- \`use std::task::{Context, Poll, Waker};\`
- \`Countdown::poll\`'un azaltabilmek için \`mut self: Pin<&mut Self>\` alması gerekir.
- \`Pin::new(&mut f).poll(&mut cx)\`, yerinden oynamamış bir future'ı poll eder.
`,
  },

  "rust-async-internals-2": {
    instructions: `## Kendi kendine hiçbir şeyin çalışmadığını kanıtla

Bir \`async fn\` çağırmak gövdesinin **hiçbir satırını** çalıştırmaz — sıfırıncı durumda bekleyen bir durum makinesi (state machine) kurar. Gövde yalnızca biri onu poll ettiğinde çalışır.

Bu, JavaScript promise'inin tam tersidir ve \`Future\`'ın \`#[must_use]\` olmasının sebebidir: await edilmeden drop edilen bir future, işin hiç yapılmadığı anlamına gelir.

### Görevin

1. \`Future<Output = &'static str>\` implemente eden bir \`struct Effect { ran: bool }\`: \`poll\`, \`ran = true\` yapar ve \`Ready("side effect happened")\` döndürür.
2. \`"from an async fn"\` döndüren bir \`async fn build() -> &'static str\`.
3. \`main\` içinde: \`Effect\`'i oluştur, \`ran\`'i yazdır (false). Bir kez poll et, \`Poll\`'u ve \`ran\`'i yeniden yazdır (true). Sonra \`build()\`'i çağır, hiçbir şeyin çalışmadığını yazdır, \`Box::pin\` ile sabitle ve poll et.

Beklenen çıktı:

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\`

### İpuçları

- Bir \`async\` bloğu \`Unpin\` değildir, dolayısıyla \`Pin::new\` değil \`Box::pin\` ister.
- Box'lanmış future'ı \`fut.as_mut().poll(&mut cx)\` ile poll et.
`,
  },

  "rust-async-internals-3": {
    instructions: `## Gerçek bir block_on yaz

Bir executor bir döngüdür: poll et, \`Pending\` gelirse uyandırılana kadar bekle. \`Waker\` (uyandırıcı), bir future'ın "beni yeniden poll et" deme biçimidir.

\`Waker\`, silinmiş bir \`*const ()\` üzerinde elle kurulmuş bir vtable'dır — burada, raw pointer'a sızdırılmış (leak) bir \`Arc<Signal>\`. \`clone\` refcount'u artırmalı, \`drop\` azaltmalı; async Rust'ta gerçekten \`unsafe\` gerektiren tek yer burasıdır.

### Görevin

1. \`new() -> Arc<Signal>\`, \`wait(&self)\` (bayrak set edilene kadar uyu, sonra temizle) ve \`notify(&self)\` metotlarına sahip bir \`struct Signal { ready: Mutex<bool>, cv: Condvar }\`.
2. Dört \`unsafe fn\` içeren bir \`static VTABLE: RawWakerVTable\`: \`clone\` sayacı artırır, \`wake\` bildirir ve tüketir, \`wake_by_ref\` tüketmeden bildirir, \`drop\` azaltır.
3. \`Waker::from_raw\` üzerinden bir \`fn waker_for(signal: &Arc<Signal>) -> Waker\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, context'i kur, döngü: \`Ready\` döndürür, \`Pending\` \`signal.wait()\` çağırır.
5. Üç kez yield edip sonra \`Ready(7)\` döndüren bir \`struct Yield { left: u32 }\`; onu await edip 1 ekleyen bir \`async fn work() -> u32\`.
6. \`block_on(async { 5u32 })\` ve \`block_on(work())\` çalıştır.

Beklenen çıktı:

\`\`\`text
simple: 5
yielding: 8
\`\`\`

Bu yoldaki en uzun alıştırma ve sonrasında her runtime'ı sıradan kod gibi okutan alıştırma.

### İpuçları

- \`Arc::into_raw\` / \`Arc::from_raw\` sızdır-ve-yeniden-kur çiftidir; yeniden kurulan \`Arc\`'ı tüketmemen gerektiğinde \`std::mem::forget\` kullan.
- \`Yield\`, \`Pending\` döndürmeden önce \`cx.waker().wake_by_ref()\` çağırmalı; yoksa \`wait()\` sonsuza dek uyur.
- \`Condvar::wait\` guard'ı sana geri verir: \`ready = self.cv.wait(ready).unwrap();\`
`,
  },

  "rust-async-internals-4": {
    instructions: `## Kooperatif olmak, ve olmadığında ne olur

Bir task \`Pending\` döndürene kadar çalışır. Hiçbir şey onu önceden kesmez (preempt). Dolayısıyla 200ms hesap yapan bir \`poll\`, runtime thread'ini 200ms boyunca tutar ve o thread'deki diğer her task bekler.

Production'daki kafa karıştırıcı kısım: gecikme o thread'i paylaşan *diğer* endpoint'lerde yükselir, yani yavaş trace masum kodu gösterir.

### Görevin

1. \`Future<Output = ()>\` implemente eden bir \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\`: \`"<name>:<left>"\` logla; \`left\` sıfırsa \`Ready\` döndür, değilse azalt, uyandır, \`Pending\` döndür.
2. Tek bir \`poll\`'u üç kayıt (\`"<name>:0"\`, \`"<name>:1"\`, \`"<name>:2"\`) loglayıp \`Ready\` döndüren bir \`struct Hog { name: &'static str, log: Rc<RefCell<Vec<String>>> }\`.
3. İki \`Task\`'i (\`a\` ve \`b\`, ikisi de \`left: 2\`) ikisi de bitene kadar dönüşümlü poll et, sonra logu yazdır.
4. Taze bir logla, \`hog\` adlı bir \`Hog\`'u bitene kadar poll et, sonra \`starved\` adlı bir \`Task\`'i (\`left: 1\`), ve o logu yazdır.

Beklenen çıktı:

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

İlk log harmanlanır. İkincisi harmanlanmaz.

### İpuçları

- Dönüşümlü döngü için \`Poll::is_ready()\` kullanışlıdır.
- \`log.borrow()\` üzerinde \`{:?}\`, içteki \`Vec\`'i yazdırır.
`,
  },

  "rust-async-internals-5": {
    instructions: `## Bir iptalin temizlik yapışını izle

\`cancel()\` diye bir şey yok. **Cancellation (iptal), future'ı drop etmektir** — durum makinesi askıya alındığı yer neresiyse orada yok edilir ve tuttuğu her yerel değişken olağan sırayla drop edilir.

İki sonuç: bir future herhangi bir \`.await\`'te drop edilebilir, dolayısıyla kısmen tamamlanmış bir işlem kısmi kalır; ve \`Drop\` \`.await\` edemez, dolayısıyla temizlik senkron olmalıdır.

### Görevin

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`"cleanup <id>"\` push eden bir \`impl Drop\`.
3. \`poll\`'u \`"poll <id>"\` push eden, uyandıran ve \`Pending\` döndüren — sonsuza dek — bir \`impl Future<Output = u32>\`.
4. \`main\` içinde: bir blok içinde \`1\` numaralı isteği oluştur, **iki kez** poll et ve bloğun bitmesine izin ver — iptal budur. Bir \`"---"\` işareti push et. Sonra \`2\` numaralı isteği oluştur, bir kez poll et ve açıkça \`drop\` et.
5. Logu yazdır.

Beklenen çıktı:

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

İki istek de hiç \`Ready\` döndürmedi. İkisi de yine de temizlik yaptı.

### İpuçları

- \`Poll\` \`#[must_use]\`'dur; sonucu atmak için \`let _ = ...\` ile bağla.
`,
  },

  "rust-async-internals-6": {
    instructions: `## İki future'ı yarıştır

Bir timeout ne sinyaldir ne de thread — iki şeyi poll eden ve önce biteni döndüren bir future'dır. \`select!\` işte budur ve **kaybeden drop edilir**, ki bu tam olarak bir cancellation'dır.

### Görevin

1. \`Future<Output = &'static str>\` implemente eden bir \`struct Ticks { label: &'static str, left: u32 }\`: sıfırda \`Ready(self.label)\` döndür, değilse azalt, uyandır, \`Pending\` döndür.
2. İkisi de \`Future<Output = &'static str> + Unpin\` olan bir \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` — önce \`a\`'yı sonra \`b\`'yi poll eden bir döngü kur ve ilk \`Ready\` olanı döndür.
3. \`work\`'ü (\`left: 2\`) \`timeout\`'a (\`left: 5\`) karşı yarıştır, sonra \`work\`'ü (\`left: 9\`) \`timeout\`'a (\`left: 3\`) karşı.

Beklenen çıktı:

\`\`\`text
work
timeout
\`\`\`

Her iki durumda da kaybeden, \`return\` anında drop edilir.

### İpuçları

- \`if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) { return v; }\`
- \`race\`'in box'lamak yerine \`Pin::new\` kullanabilmesini sağlayan şey \`Unpin\` bound'udur.
`,
  },

  "rust-async-internals-7": {
    instructions: `## spawn'lı bir mini runtime

Tokio'nun sunduğu her şey, artık kendi elinle inşa ettiğin bir şeyin adıdır: \`block_on\` senin döngün, \`tokio::spawn\` bir kuyruğa itmek, \`select!\` senin \`race\`'in, \`timeout\` ise bir timer'a karşı yarış.

Tokio'nun gerçekten eklediği şey ise bir epoll/kqueue reactor'ı, work-stealing bir scheduler ve bir timer wheel.

### Görevin

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`new()\`, \`Box::pin(f)\` iten \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` ve kuyruğun başından çekip poll eden, \`Ready\` olanları kaydedip \`Pending\` olanları kuyruğa geri koyan \`run(&mut self)\` metotlarına sahip bir \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\`.
3. Kendi label'ını döndürmeden önce \`left\` kez yield eden bir \`struct Delayed { label: &'static str, left: u32 }\`.
4. \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` ve \`async { "immediate" }\` spawn et, çalıştır, tamamlanma sırasını yazdır.

Beklenen çıktı:

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

Tamamlanma sırası spawn sırasına göre değil, *hazır oluşa* göredir. Bu runtime koşulsuz olarak kuyruğa geri koyar ve dolayısıyla waker'ı tamamen yok sayar — onu gerçeğinden ayıran tek şey de budur.

### İpuçları

- \`use std::collections::VecDeque;\`
- Döngüyü \`while let Some(mut task) = self.queue.pop_front()\` sürükler.
`,
  },
};
