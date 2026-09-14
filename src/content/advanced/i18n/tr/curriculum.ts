import type { AdvancedTrackText } from "../types";

// TR · İleri Seviye Yol müfredat metası — /advanced ve /advanced/[slug]
// sayfalarında görünen parkur ve ders adları.
//
// CLIENT-SAFE. ../../curriculum.ts içindeki İngilizce kaynakla aynı slug'larla
// anahtarlanır ve KISMİdir: eksik bir anahtar İngilizceye düşer.
//
// Rust terimleri çevrilmez — ownership, borrow, trait, lifetime, closure.
// Onları çevirmek okuru, o kelimeyle yeniden karşılaşacağı gerçek derleyici
// hatasından uzaklaştırır.

export const trAdvancedTrackText: Record<string, AdvancedTrackText> = {
  "rust-ownership-deep": {
    title: "Ownership, move'lar ve drop'lar",
    description:
      "Borrow checker'ın aslında dayattığı model. Bir değer nerede yaşar, ne zaman move edilir, ne zaman onun yerine kopyalanır ve tam olarak hangi noktada yok edilir.",
    serves: "Rust/C++ sistem programlama",
  },
  "rust-lifetimes": {
    title: "Lifetime'lar",
    description:
      "Annotation'ları girdilerle çıktılar arasında bir kısıt olarak okumaya başladığın an gürültü olmaktan çıkarlar. Elision, referans tutan struct'lar, 'static ve bir bound'un gerçekte ne vaat ettiği.",
    serves: "Rust/C++ sistem programlama",
  },
  "rust-traits-generics": {
    title: "Trait'ler, generic'ler ve dispatch",
    description:
      "Rust kalıtım olmadan kodu nasıl yeniden kullanır. Bound'lar, associated type'lar, blanket impl'ler ve bir generic ile bir dyn Trait arasındaki gerçek maliyet farkı.",
    serves: "Rust/C++ sistem programlama",
  },
  "rust-error-handling": {
    title: "Üretimde ayakta kalan hatalar",
    description:
      "Baştan sona Result: propagation, dönüşüm, sebebi taşıyan kendi hata tiplerin ve bir panic'in ne zaman doğru, ne zaman bir kesinti olduğuna dair açık bir politika.",
    serves: "üretim altyapısının sahipliği",
  },
  "rust-collections-iterators": {
    title: "Koleksiyonlar, iterator'lar ve closure'lar",
    description:
      "Doğru container'ı alışkanlığa göre değil karmaşıklığa göre seçmek, sonra dönüşümü lazy biçimde ifade etmek. Bir closure'ın neyi capture edebileceğine karar veren Fn/FnMut/FnOnce ayrımı da dâhil.",
    serves: "Rust/C++ sistem programlama",
  },
  "rust-smart-pointers": {
    title: "Smart pointer'lar ve interior mutability",
    description:
      "Box, Rc, RefCell, Cow ve Weak — her biri sana ne kazandırır, neye mal olur ve hangisine gerçekten ihtiyacın olduğuna karar veren compile-time/runtime borrow ayrımı.",
    serves: "Rust/C++ sistem programlama",
  },
  "rust-concurrency": {
    title: "Thread'ler, Send/Sync ve paylaşılan durum",
    description:
      "Gerçek yük altındaki her RPC servisinin çekirdeği. Thread'ler, paylaşımı sağlam kılan iki auto trait, Arc<Mutex<T>> ve alternatifleri, dürüst memory ordering'li atomic'ler ve channel'lar.",
    serves: "yüksek ölçekli RPC/API servisleri",
  },
  "rust-async-internals": {
    title: "İlk ilkelerden async",
    description:
      "Bir attribute macro'dan aşağı doğru değil, poll loop'undan yukarı doğru kurulur. Elle bir Future yazarsın, gerçek bir Waker'la çalışan bir block_on kurarsın ve Tokio'nun üstüne ne eklediğine ancak ondan sonra bakarsın.",
    serves: "yüksek ölçekli RPC/API servisleri",
  },
  "rust-systems-edges": {
    title: "Macro'lar, unsafe, FFI ve para",
    description:
      "Bir sistem kodu reviewer'ından tutması beklenen dört kenar: bir derive neye açılır, bir unsafe blok neyi vaat eder, C++ tarafına geçmek neye mal olur ve bir float neden asla bir bakiye tutmamalıdır.",
    serves: "Rust/C++ sistem programlama",
  },
  "backend-rpc-services": {
    title: "Ölçekte RPC servisleri",
    description:
      "Ağın önündeki servis: JSON-RPC 2.0'ın tam olarak doğrusu, sınırda Serde, timeout ve rate limiting için Tower katmanları ve bir mülakatın gerçekten soracağı mimari sorular.",
    serves: "yüksek ölçekli RPC/API servisleri",
  },
  "backend-data-layer": {
    title: "Veri katmanı",
    description:
      "Rolün tarif ettiği haliyle veritabanı mimarisi: önce indeksleme ve sorgu kalıpları, sonra Rust tarafı — pool'lar, transaction'lar ve prepared statement'lar.",
    serves: "veritabanı mimarisi, indeksleme ve sorgu kalıpları",
  },
  "backend-indexers-distsys": {
    title: "Indexer'lar ve dağıtık sistemler",
    description:
      "Bir işlemin istemciden konsensusa gidip geri dönerken izlediği yol ve onu sorgulanabilir kılan indexer. Cursor'lar, replay, idempotency ve yalnızca ölçekte ortaya çıkan hata modları.",
    serves: "üretimde blockchain altyapısı",
  },
  "backend-production": {
    title: "Üretimde çalıştırmak",
    description:
      "Bir prototipi, birinin gecenin ortasında çağrıldığı bir altyapıdan ayıran şey: observability, dürüst percentile'lar, yük testi, graceful shutdown ve savunabileceğin bir güvenilirlik duruşu.",
    serves: "üretim altyapısının sahipliği",
  },
};

export const trAdvancedLessonText: Record<
  string,
  { title: string; summary: string }
> = {
  // ownership
  "rust-ownership-deep-1": {
    title: "Stack, heap ve neyin sahibi kim",
    summary:
      "Bir değerin gerçek bellek layout'unu oku ve hangi parçanın nerede yaşadığını söyle.",
  },
  "rust-ownership-deep-2": {
    title: "Move mu copy mi",
    summary:
      "Bir atamanın move mu yoksa copy mi yaptığını önceden söyle — ve derlendiğini kanıtla.",
  },
  "rust-ownership-deep-3": {
    title: "Kısmi move'lar",
    summary:
      "Bir struct'tan tek bir alanı dışarı move et ve gerisini kurallara uygun şekilde kullanmaya devam et.",
  },
  "rust-ownership-deep-4": {
    title: "Pratikte borrow kuralları",
    summary:
      "Aliasing hatalarını clone()'a uzanmak yerine kapsamı daraltarak düzelt.",
  },
  "rust-ownership-deep-5": {
    title: "Reborrowing ve deref coercion",
    summary:
      "Bir &mut T'nin neden bir &T parametresine geçtiğini, bir String'in neden &str olarak geçtiğini açıkla.",
  },
  "rust-ownership-deep-6": {
    title: "Drop sırası ve RAII",
    summary:
      "Yok edilme sırasını önceden söyle ve bir kaynağı close() çağrısı olmadan serbest bırak.",
  },
  // lifetimes
  "rust-lifetimes-1": {
    title: "Bir lifetime aslında ne söyler",
    summary:
      "'a işaretini bir süre olarak değil, argümanlar arasındaki bir ilişki olarak oku.",
  },
  "rust-lifetimes-2": {
    title: "Elision kuralları",
    summary:
      "Hangi imzaların annotation'a ihtiyaç duymadığını, seninkinin neden duyduğunu söyle.",
  },
  "rust-lifetimes-3": {
    title: "Birden fazla lifetime",
    summary:
      "Çıktısı iki girdiden yalnızca birinden borrow eden bir fonksiyonu annotate et.",
  },
  "rust-lifetimes-4": {
    title: "Referans tutan struct'lar",
    summary:
      "Sahibi olmadığın bir buffer üzerinde zero-copy bir parser görünümü kur.",
  },
  "rust-lifetimes-5": {
    title: "'static: iki farklı anlam",
    summary:
      "Bir &'static str'yi bir T: 'static bound'undan ayır — ikisi aynı iddia değil.",
  },
  // traits & generics
  "rust-traits-generics-1": {
    title: "Bir trait tanımlamak ve implemente etmek",
    summary: "Default metotlu bir trait yaz, sonra onu override et.",
  },
  "rust-traits-generics-2": {
    title: "Trait bound'ları ve where cümleleri",
    summary:
      "Bir generic'i gövde derlenecek kadar kısıtla, gereğinden fazlasını değil.",
  },
  "rust-traits-generics-3": {
    title: "Associated type'lar mı generic parametreler mi",
    summary:
      "İkisi arasında doğru seçimi yap ve Iterator'ın neden birini kullanıp diğerini kullanmadığını söyle.",
  },
  "rust-traits-generics-4": {
    title: "Static dispatch ve monomorphization",
    summary:
      "Derleyicinin bir generic fonksiyon için ne ürettiğini ve bunun neye mal olduğunu açıkla.",
  },
  "rust-traits-generics-5": {
    title: "Trait object'ler ve vtable",
    summary:
      "Karışık tipleri Box<dyn Trait> arkasında sakla ve runtime maliyetini adlandır.",
  },
  "rust-traits-generics-6": {
    title: "Object safety",
    summary:
      "Hangi trait'lerin trait object olabileceğini derleyici sana söylemeden kestir.",
  },
  "rust-traits-generics-7": {
    title: "Blanket impl'ler ve orphan kuralı",
    summary:
      "Bir bound'u sağlayan her tip için bir trait implemente et — ve bunu ne zaman yapamayacağını bil.",
  },
  // errors
  "rust-error-handling-1": {
    title: "Result ve ? operatörü",
    summary: "Tek bir match yazmadan hatayı yukarı taşı.",
  },
  "rust-error-handling-2": {
    title: "Kendi hata tiplerin",
    summary: "Hatalarını bir String yerine bir enum olarak modelle.",
  },
  "rust-error-handling-3": {
    title: "From, Into ve otomatik dönüşüm",
    summary: "? operatörü yabancı bir hatayı bedavaya seninkine çevirsin.",
  },
  "rust-error-handling-4": {
    title: "Display, Debug ve std::error::Error",
    summary:
      "Bir hatanın sana borçlu olduğu iki mesajı yaz: operatörün gördüğü ve log'a düşen.",
  },
  "rust-error-handling-5": {
    title: "Hata zincirleme ve source()",
    summary:
      "Sebebi iliştirilmiş tut ki tek bir log satırı bir soruşturmayı bitirsin.",
  },
  "rust-error-handling-6": {
    title: "panic! ne zaman doğrudur",
    summary:
      "Bir bug ile bir durum arasına çizgiyi çek — ve o çizginin ötesinde unwrap etmeyi bırak.",
  },
  // collections
  "rust-collections-iterators-1": {
    title: "Vec, VecDeque ve büyüme",
    summary:
      "İkisi arasında push/pop'un hangi uçtan olduğuna göre seç ve sıcak bir döngüde yeniden allocate etmeyi bırak.",
  },
  "rust-collections-iterators-2": {
    title: "HashMap mı BTreeMap mi",
    summary:
      "Sıralamaya ve karmaşıklığa göre seç, geçen sefer hangisini yazdığına göre değil.",
  },
  "rust-collections-iterators-3": {
    title: "iter, iter_mut ve into_iter",
    summary:
      "Her birinin sana ne verdiğini ve koleksiyona ne yaptığını söyle.",
  },
  "rust-collections-iterators-4": {
    title: "Adapter'lar ve lazy davranış",
    summary:
      "map/filter/filter_map'i zincirle ve collect'e kadar neden hiçbir şeyin çalışmadığını açıkla.",
  },
  "rust-collections-iterators-5": {
    title: "fold, reduce ve kendi toplama mantığın",
    summary:
      "Mutable accumulator'lı bir döngüyü tek bir ifadeyle değiştir.",
  },
  "rust-collections-iterators-6": {
    title: "Fn, FnMut ve FnOnce",
    summary:
      "Bir closure'ın hangi trait'i implemente ettiğini neyi capture ettiğinden kestir.",
  },
  "rust-collections-iterators-7": {
    title: "move closure'lar ve kaçan capture'lar",
    summary:
      "Bir closure'ı kendi kapsamından uzun yaşayan bir şeye doğru şekilde teslim et.",
  },
  // smart pointers
  "rust-smart-pointers-1": {
    title: "Box<T> ve özyinelemeli tipler",
    summary: "Özyinelemeli bir enum'a bilinen bir boyut ver.",
  },
  "rust-smart-pointers-2": {
    title: "Rc<T> ve paylaşılan ownership",
    summary:
      "Tek bir thread'de bir allocation'ı birden çok sahip arasında paylaş.",
  },
  "rust-smart-pointers-3": {
    title: "RefCell<T> ve runtime'da borrow",
    summary:
      "Bir borrow kontrolünü compile time'dan runtime'a taşı — ve bunun bedeli olan panic'i kabullen.",
  },
  "rust-smart-pointers-4": {
    title: "Weak<T> ve referans döngüleri",
    summary: "Gerçekten serbest bırakılan bir parent/child grafiği kur.",
  },
  "rust-smart-pointers-5": {
    title: "Cow<T> ve yalnızca mecbur kalınca allocate etmek",
    summary:
      "Sık yolda borrow edilmiş veri döndür, nadir yolda sahipli veri.",
  },
  "rust-smart-pointers-6": {
    title: "Deref, DerefMut ve kendi pointer'ların",
    summary: "Kendi wrapper'ın sardığı şey gibi davransın.",
  },
  // concurrency
  "rust-concurrency-1": {
    title: "Thread açmak ve join etmek",
    summary: "İşi paralel çalıştır ve her sonucu deterministik biçimde topla.",
  },
  "rust-concurrency-2": {
    title: "Send ve Sync",
    summary:
      "Rc'nin neden Send olmadığını, Arc'ın neden olduğunu ezberden değil tanımdan söyle.",
  },
  "rust-concurrency-3": {
    title: "Arc<T>: thread'ler arası paylaşılan ownership",
    summary:
      "Salt okunur durumu tek bir atomic karşılığında N worker'la paylaş.",
  },
  "rust-concurrency-4": {
    title: "Mutex, guard'lar ve poisoning",
    summary:
      "Paylaşılan durumu güvenle değiştir ve kritik bölümü bilerek kısa tut.",
  },
  "rust-concurrency-5": {
    title: "RwLock ve okuma ağırlıklı durum",
    summary:
      "RwLock'ı Mutex'e kanıta dayanarak tercih et ve göze aldığın starvation riskini adlandır.",
  },
  "rust-concurrency-6": {
    title: "Deadlock'lar ve lock sırası",
    summary:
      "Bir deadlock'ı yeniden üret, sonra global bir lock sırasıyla ortadan kaldır.",
  },
  "rust-concurrency-7": {
    title: "Atomic'ler ve memory ordering",
    summary:
      "fetch_add ve compare_exchange kullan, Relaxed ile Acquire/Release tercihini gerekçelendir.",
  },
  "rust-concurrency-8": {
    title: "Channel'lar ve backpressure",
    summary:
      "mpsc ile bir producer/consumer kur ve bounded bir channel'ın ne kazandırdığını açıkla.",
  },
  // async
  "rust-async-internals-1": {
    title: "Bir Future bir poll fonksiyonudur",
    summary: "Future'ı elle implemente et ve içinde sihir olmadığını gör.",
  },
  "rust-async-internals-2": {
    title: "Executor olmadan hiçbir şey çalışmaz",
    summary:
      "await edilmemiş bir future'ın tam olarak hiçbir şey yapmadığını kanıtla ve bunun neden bir özellik olduğunu söyle.",
  },
  "rust-async-internals-3": {
    title: "block_on'u kendin yaz",
    summary:
      "Gerçek bir executor yaz: Waker, RawWaker ve bir park/unpark döngüsü.",
  },
  "rust-async-internals-4": {
    title: "Kooperatif zamanlama ve bloklayan çağrılar",
    summary:
      "Tek bir bloklayan çağrının bütün bir runtime thread'ini neden durdurduğunu açıkla.",
  },
  "rust-async-internals-5": {
    title: "İptal bir drop'tur",
    summary:
      "Bir istemci isteğin ortasında koptuğunda temizliğin doğru çalışmasını sağla.",
  },
  "rust-async-internals-6": {
    title: "Timeout'lar ve select",
    summary:
      "Bir future'ı bir deadline'la yarıştır, hangi tarafın kazandığını ve neyin sızdığını söyle.",
  },
  "rust-async-internals-7": {
    title: "Tokio ne ekler",
    summary:
      "Kurduğun her parçayı Tokio'daki karşılığına eşle: spawn, JoinHandle, select!, spawn_blocking.",
  },
  // systems edges
  "rust-systems-edges-1": {
    title: "Modüller, görünürlük ve crate düzeni",
    summary:
      "Bir invariant'ı dışarıdan kırılamaz kılmak için mod, pub ve pub(crate) kullan.",
  },
  "rust-systems-edges-2": {
    title: "macro_rules! ve bildirimsel macro'lar",
    summary: "Bir fonksiyonun yerini tutamayacağı bir macro yaz.",
  },
  "rust-systems-edges-3": {
    title: "Derive ve procedural macro'lar",
    summary:
      "#[derive(Debug, Clone)] gerçekte ne üretiyor, Serde nereye oturuyor — söyle.",
  },
  "rust-systems-edges-4": {
    title: "unsafe: sözleşme",
    summary:
      "Bir unsafe bloğun varsaydığı invariant'ı açıkça ifade et — bir reviewer'a parası tam da bunun için ödenir.",
  },
  "rust-systems-edges-5": {
    title: "Raw pointer'lar ve aliasing",
    summary:
      "*const/*mut T ile çalış ve az önce vazgeçtiğin garantiyi adlandır.",
  },
  "rust-systems-edges-6": {
    title: 'FFI, extern "C" ve ABI sınırı',
    summary:
      "Ownership'i bir C sınırının ötesine sızdırmadan ve iki kez free etmeden geçir.",
  },
  "rust-systems-edges-7": {
    title: "Parayı tam sayıyla tutmak ve checked aritmetik",
    summary:
      "Bir bakiyeyi sabit noktalı tam sayılarla tut ve checked, saturating ve wrapping arasında bilinçli seç.",
  },
  // ── backend / altyapı ─────────────────────────────────────────────────
  "backend-rpc-services-1": {
    title: "JSON-RPC 2.0 zarfı ve beş hata kodu",
    summary:
      "Gelen her isteği doğru JSON-RPC hata koduna sınıfla ve yanıtın id'sinin yansıtılmak yerine null olması gereken iki durumu bil.",
  },
  "backend-rpc-services-2": {
    title: "Notification'lar, batch'ler ve yanıtlamaman gereken istekler",
    summary:
      "Saf JSON-RPC sunucularını bozan iki kuralı uygula: bir notification hiçbir yanıt almaz ve boş bir batch'in kendisi geçersiz bir istektir.",
  },
  "backend-rpc-services-3": {
    title: "Box'lanmış handler'lardan bir metot dispatch tablosu",
    summary:
      "Box'lanmış closure'lardan oluşan bir HashMap'ten router kur ve bir çağrının başına gelebilecek üç hatayı ayır: böyle bir metot yok, argümanlar bozuk, handler patladı.",
  },
  "backend-rpc-services-4": {
    title: "Service ve Layer: Tower'ı iki trait'ten kurmak",
    summary:
      "Bütün Tower ekosisteminin yapıldığı iki trait'i yaz, sonra bir backend'i bir timeout'a sar ve zaman aşımına uğrayan isteklerin ona hiç ulaşmadığını kanıtla.",
  },
  "backend-rpc-services-5": {
    title: "Eşzamanlılık limitleri ve yük atma",
    summary:
      "Aynı aşırı yükü iki farklı kabul politikasıyla simüle et ve kuyruğa almanın gerçek maliyetini oku: aynı sayıda başarı, üstüne kimsenin kullanamayacağı yanıtlara harcanmış 320 ms backend zamanı.",
  },
  "backend-rpc-services-6": {
    title: "Simüle bir saat üzerinde token-bucket rate limiter",
    summary:
      "İstemci başına lazy refill'li token bucket'lar yaz, istemcinin işine yarayacak bir retry_after döndür ve yapılandırdığın limitin neden filonun uyguladığı limit olmadığını gör.",
  },
  "backend-rpc-services-7": {
    title: "Sayfalama sözleşmeleri: cursor'lar, offset'ler ve istek id'leri",
    summary:
      "Koleksiyon gezinti sırasında değiştiğinde OFFSET'li sayfalamanın satırları sessizce düşürdüğünü kanıtla ve bunu yapmayan cursor sözleşmesini yaz.",
  },
  "backend-data-layer-1": {
    title: "Index scan mı seq scan mi: incelenen satırlar",
    summary:
      "İki plan için de incelenen satırları say ve sayıların hangisini işaret ettiğini söyle.",
  },
  "backend-data-layer-2": {
    title: "Bileşik indeksler ve en soldaki önek",
    summary:
      "Bir bileşik indeksin hangi predicate kümelerine hizmet edebildiğini, hangilerini yalnızca filtrelediğini söyle.",
  },
  "backend-data-layer-3": {
    title: "EXPLAIN'in arkasındaki maliyet modeli",
    summary:
      "Bir index scan'i bir seq scan'e karşı fiyatla ve planlayıcının seçimini önceden söyle.",
  },
  "backend-data-layer-4": {
    title: "Cursor'lu sayfalama mı OFFSET mi",
    summary:
      "OFFSET'i bir keyset cursor'ıyla değiştir ve ne kazandırdığını sayıyla göster.",
  },
  "backend-data-layer-5": {
    title: "İzolasyon seviyeleri ve izin verdikleri anomaliler",
    summary:
      "Her izolasyon seviyesinin hangi anomaliye izin verdiğini adlandır ve bunu bir trace'le kanıtla.",
  },
  "backend-data-layer-6": {
    title: "Transaction'lar, rollback ve prepared statement'lar",
    summary:
      "Commit ve rollback'i yaz ve bir prepared statement'ın gerçekte neyi yeniden kullandığını söyle.",
  },
  "backend-data-layer-7": {
    title: "Connection pool'lar ve gecikme nereye gidiyor",
    summary:
      "Bir pool simülasyonundan kuyruk bekleme süresini oku ve bir pool'u gerekçesiyle boyutlandır.",
  },
  "backend-indexers-distsys-1": {
    title: "Indexer pipeline'ı ve yeniden başlatmayı atlatan bir cursor",
    summary:
      "Dört aşamalı pipeline'ı kur — ledger (defter) kaynağı, cursor, processor, store — ve akışın ortasında iş kaybetmeden ya da tekrarlamadan yeniden başlat.",
  },
  "backend-indexers-distsys-2": {
    title: "Cursor'ı etkiden sonra commit et, asla önce değil",
    summary:
      "İki yazma arasına bir çökme enjekte et ve iki sırayı da ölç: önce-cursor sessizce bir olay kaybeder, önce-etki bir olayı tekrarlar — ve bunlardan yalnızca biri telafi edilebilir.",
  },
  "backend-indexers-distsys-3": {
    title: "En az bir kez teslimat altında idempotency",
    summary:
      "Olayları tekrarlayan ve sırasını bozan bir akışı iki kez işle ve kusursuz bir exactly-once beslemesinin üreteceği durumun tam olarak aynısına var.",
  },
  "backend-indexers-distsys-4": {
    title: "Bir reorg'u atlatmak: fork'a geri sar, dalı yeniden uygula",
    summary:
      "Gelen bir bloğun head'inin altından çatallandığını tespit et, öksüz kalan blokları ters yükseklik sırasıyla geri al ve kazanan dalı yeniden uygula.",
  },
  "backend-indexers-distsys-5": {
    title: "Reddeden bir durum makinesi olarak işlem durumu",
    summary:
      "Received/Validating/Submitted/Pending/Confirmed/Failed durumlarını, default kolu kuraldışı geçişleri reddedip durumu olduğu gibi bırakan bir geçiş tablosu olarak kodla.",
  },
  "backend-indexers-distsys-6": {
    title: "Quorum aritmetiği: R + W > N ve bir bölünmenin ona yaptığı",
    summary:
      "Hangi (N, R, W) yapılandırmalarının bir okumanın son yazmayı görmesini garanti ettiğini hesapla, sonra 3|2'lik bir bölünme çalıştır ve azınlık tarafın hem okumayı hem yazmayı reddedişini izle.",
  },
  "backend-indexers-distsys-7": {
    title: "Saat olmadan olayları sıralamak: Lamport ve vektör damgaları",
    summary:
      "Dağıtık bir olay trace'ini iki saat tipiyle de damgala ve Lamport'un, nedenselliğin desteklemediği bir sıra bildirdiği çifti göster.",
  },
  "backend-production-1": {
    title: "Counter'lar, gauge'lar ve histogram'lar",
    summary:
      "Bir soru için doğru ölçüm aracını seç ve her birinin neyi yanıtlayamadığını gör.",
  },
  "backend-production-2": {
    title: "Bucket'lardan percentile'lar ve neden ortalamaları alınamaz",
    summary:
      "Bucket sayılarından p50/p95/p99 hesapla ve iki instance'ı yalan söylemeden birleştir.",
  },
  "backend-production-3": {
    title: "Yapılandırılmış log'lar ve bir correlation id",
    summary:
      "Tek bir id'yi bir çağrı zinciri boyunca geçir ve iç içe geçmiş bir akıştan tek bir isteği yeniden kur.",
  },
  "backend-production-4": {
    title: "Backoff, jitter ve bir retry bütçesi",
    summary:
      "Retry büyümesini, bağımlılığın kendine gelmesini ummak yerine bir bütçeyle sınırla.",
  },
  "backend-production-5": {
    title: "Durum makinesi olarak bir circuit breaker",
    summary:
      "Ölü bir bağımlılığa trafik göndermeyi kes ve onu izdiham yaratmadan yoklayarak hayata döndür.",
  },
  "backend-production-6": {
    title: "Graceful shutdown: boşalt, deadline, zorla kapat",
    summary:
      "Bir pod'u rotasyondan çıkar ve bir deploy istek düşürmeden uçuştaki işini bitir.",
  },
  "backend-production-7": {
    title: "Little Yasası: bir gecikme hedefi bir eşzamanlılık limitidir",
    summary:
      "Bir gecikme SLO'sunu, kabul etmene izin verilen eşzamanlı istek sayısına çevir.",
  },
};
