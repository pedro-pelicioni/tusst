import type { LessonStep } from "@/content/steps";

// TR · RPC Services at Scale.
//
// Overlay for ../../steps/backend-rpc-services.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendRpcServicesStepsTr: Record<string, LessonStep[]> = {
  "backend-rpc-services-1": [
    {
      kind: "theory",
      body: `Bir JSON-RPC 2.0 Request'i (istek) dört üyeden oluşur: \`jsonrpc\`, \`method\`, opsiyonel bir \`params\` ve opsiyonel bir \`id\`. Response (yanıt) ise **ya** \`result\` **ya da** \`error\` taşır — asla ikisi birden, asla hiçbiri.

\`\`\`json
{"jsonrpc": "2.0", "method": "sum", "params": [1, 2], "id": 3}
{"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": 3}
\`\`\`

Beş kod rezerve edilmiştir ve hata uzayını tam da kontrol ettiğin sırayla bölümlere ayırırlar:

| kod | anlamı | çağıranın öğrendiği |
| --- | --- | --- |
| -32700 | Parse error | byte'lar JSON değildi |
| -32600 | Invalid Request | parse edildi, ama bir Request object'i değil |
| -32601 | Method not found | bu endpoint (uç nokta) yok |
| -32602 | Invalid params | var — farklı argümanlarla tekrar dene |
| -32603 | Internal error | sorun sende değil, sunucuda |

\`-32000\` ile \`-32099\` arası uygulamanın kendi sunucu hatalarına bırakılmıştır: \`-32001 Request timeout\`, \`-32002 Server busy\` ve kontratının (sözleşme) belgelediği başka ne varsa.`,
    },
    {
      kind: "theory",
      body: `JSON-RPC, HTTP hakkında **hiçbir şey** söylemez. Aynı zarf HTTP/1.1, HTTP/2 ya da ham bir socket üzerinde değişmeden yol alır; eşzamanlılığına protokol değil, altındaki transport karar verir.

**HTTP/1.1 keep-alive** bağlantı başına uçuşta tek bir request verir. N eşzamanlı çağrı N bağlantılık bir pool ister ve head-of-line blocking bağlantı başınadır — yavaş bir response yalnızca o socket'i tıkar.

**HTTP/2** tek bir bağlantı üzerinde çok sayıda stream'i multiplex eder; yani 2–4 bağlantılık bir pool bir backend'i doyurur. Bedeli şu: tek bir TCP kayıp olayı artık o bağlantıyı paylaşan bütün stream'leri tıkar.

Pool boyutlandırmak zevk meselesi değil, aritmetiktir. 200 bağlantı limiti olan bir servise karşı 8'lik bir pool, 30 client instance'ıyla 240 bağlantı eder — ve son 40 tanesi, kesinti gibi görünen bir refused-connection fırtınasıdır.

Sonradan canını yakacak iki zarf detayı: \`id\` geri **byte'ı byte'ına aynı** dönmelidir (string bir id string döner) ve sıra garanti değildir. Protokolün sana verdiği tek korelasyon id'dir.`,
    },
    {
      kind: "quiz",
      question:
        "Bir client `sbutract` çağırıyor — sunucuda olmayan bir method için yazım hatası. Hangi kod ve bu ayrım neden önemli?",
      options: [
        "-32601 Method not found: isim kayıtlı değil. -32602, *var olan* bir method'un argümanlarının typecheck'ten geçmediği durum içindir",
        "-32602 Invalid params, çünkü method adının kendisi request'in kötü bir parametresidir",
        "-32603 Internal error, çünkü sunucu çağrıyı tamamlayamadı",
      ],
      answer: 0,
      explain:
        "İkisini birbirine karıştırmak, çağıranın elinden 'bu endpoint yok' ile 'farklı argümanlarla tekrar dene'yi ayıran o tek biti alır. -32602 gören bir client, asla var olmayacak bir endpoint'i tekrar tekrar denemeye devam eder.",
    },
    {
      kind: "fill",
      prompt: "Sunucunun bilmediği bir method adının kendi kodu vardır.",
      file: "main.rs",
      before: "return Reply { code: ",
      after: ', message: "Method not found", id: r.id.clone() };',
      choices: ["-32601", "-32602", "-32600"],
      answer: 0,
      explain:
        "-32602, var olan bir method için argümanların yanlış olduğunu söylerdi; -32600 ise request object'inin kendisinin bozuk olduğunu. Burada ikisi de doğru değil — zarf gayet yerindeydi, isim kayıtlı değildi.",
    },
    {
      kind: "quiz",
      question:
        "Neden -32700 ve -32600 `id: null` ile yanıt verirken -32601, -32602 ve -32603 aldıkları id'yi geri yansıtıyor?",
      options: [
        "Geçerli bir Request object'i elinde olana kadar id'ye güvenilemez — body parse edilmemiş ya da id üyesi yanlış tipte olabilir",
        "Her error response'ta null kullanılır; yalnızca başarılı sonuçlar id taşır",
        "Id yalnızca handler çalıştığında yansıtılır, dolayısıyla -32601 ve -32602 de null gönderir",
      ],
      answer: 0,
      explain:
        "'Aldığın id'yi her zaman yansıt' yanılgının ta kendisi. Bir parse error'da ortada hiç id olmayabilir; bozuk bir Request object'inde ise o üye bir object ya da array olabilir. Request doğrulandıktan sonra kalan üç kodun üçü de yansıtır.",
    },
    {
      kind: "editor",
      intro: `### Gelen bir request'i sınıflandır

\`classify\`'ı doldur. Beş kontrolü sırayla çalıştır — parse, request şekli, method, params, handler — ve her birine kendi koduyla yanıt ver.

1. \`well_formed == false\` → \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. \`version\` \`Some("2.0")\` değilse ya da \`method\` eksikse → \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. \`methods\` içinde olmayan bir method → \`-32601\` \`"Method not found"\`, id'yi yansıtarak.
4. \`params_ok == false\` → \`-32602\` \`"Invalid params"\`, id'yi yansıtarak.
5. \`handler_ok == false\` → \`-32603\` \`"Internal error"\`, id'yi yansıtarak.
6. Aksi halde \`Reply { code: 0, message: "result", id }\`.

Beklenen çıktı:

\`\`\`text
request                   code  message           id
truncated body          -32700  Parse error       null
jsonrpc 1.0             -32600  Invalid Request   null
no method member        -32600  Invalid Request   null
method sbutract         -32601  Method not found  3
sum of strings          -32602  Invalid params    "a3"
sum, handler panicked   -32603  Internal error    5
sum, healthy                 -  result            6
\`\`\`

İki satır \`null\` ile yanıt veriyor, dördü yansıtıyor — ders tam da bu ayrımda.`,
    },
  ],

  "backend-rpc-services-2": [
    {
      kind: "theory",
      body: `\`id\` üyesi bir anahtardır. **id'si olmayan** bir Request object'i bir **notification**'dır (bildirim): sunucu handler'ı (işleyici) çalıştırır ve bir response object'i göndermemelidir — ne result, ne de error.

Bu bir optimizasyon değil, kontratın kendisi. Notification gönderen bir client yanıt okumuyordur; ona yanıt yazmak pipeline'lanmış bir bağlantının senkronunu bozar: sonraki her response yanlış request'le eşleşir.

Spec, insanların düzleştirdiği bir ayrımda titizdir:

| body | anlamı |
| --- | --- |
| \`{"jsonrpc":"2.0","method":"log"}\` | notification — yanıt yok |
| \`{"jsonrpc":"2.0","method":"log","id":null}\` | id'si tesadüfen null olan bir çağrı — \`"id":null\` ile yanıtla |

**Hiç olmayan** bir id ile açıkça **null** olan bir id farklı request'lerdir.`,
    },
    {
      kind: "theory",
      body: `Bir batch (toplu istek), Request object'lerinden oluşan bir JSON array'idir. Sunucu üyeleri istediği sırada ve eşzamanlı işleyebilir; response array'i yalnızca yanıt üreten üyeleri içerir. Naif sunucuları bozan üç sonuç:

- **Boş bir array** Request object'i değildir. Tek bir \`-32600\` alır, \`id: null\` ile.
- **Yalnızca notification'lardan** oluşan bir batch **hiç response body'si üretmez** — \`[]\` bile değil, hiçbir şey.
- **Bozuk bir üye** \`id: null\` ile yanıtlanır, çünkü sunucu o üyenin notification olacak olup olmadığını bilemez.

Bir de client tarafının uyması gereken sıralama kuralı: response'ları request'lerle **id üzerinden** eşle, asla pozisyona göre değil. Geri aldığın array gönderdiğinden kısadır ve herhangi bir sırada olabilir.`,
    },
    {
      kind: "quiz",
      question:
        "Bir client beş notification'lık bir batch gönderiyor. Doğru bir sunucu tele ne koyar?",
      options: [
        "Hiçbir şey — response body'si yok, çünkü hiçbir üye response object'i üretmedi",
        "`[]`, boş bir array; batch geçerliydi ve sadece sonuç üretmedi",
        "Üye başına bir tane olmak üzere beş adet `{\"jsonrpc\":\"2.0\",\"result\":null}` object'i",
      ],
      answer: 0,
      explain:
        "`[]` döndürmek gerçek bir interop bug'ıdır: katı bir client boş array'i protokol ihlali sayar, çünkü spec, döndürecek bir şey yokken sunucunun hiçbir şey döndürmediğini söyler. -32600 alan durum boş *request* array'idir — boş *response* değil.",
    },
    {
      kind: "fill",
      prompt:
        "Bir notification handler'ını çalıştırır, ardından tele hiç ulaşmayan şeyi üretir.",
      file: "main.rs",
      before: "Frame::Notify { method } => {\n    effects.push(method);\n    ",
      after: "\n}",
      choices: ["None", 'Some(String::new())', 'Some("[]".to_string())'],
      answer: 0,
      explain:
        "`Some(String::new())` sıfır uzunlukta bir body yazar, ki bu yine de bir yazmadır — ve `handle_batch` bunu bir yanıt sayıp `[]` yayardı. Üyeyi batch response'undan tamamen yok eden şey `None`'dır.",
    },
    {
      kind: "quiz",
      question:
        "Alıştırmanın batch'lerinde altı frame geliyor, ama dışarıya yalnızca üç response body'si çıkıyor. Bu oran notification'lar hakkında ne söylüyor?",
      options: [
        "Yan etki her notification için yine de çalışır — bastırılan şey iş değil, yanıttır",
        "Notification'lar fire-and-forget'tir, dolayısıyla sunucu yük altında handler'ı düşürebilir",
        "Eksik üç yanıt, handler'ları başarısız olduğu için düşürüldü",
      ],
      answer: 0,
      explain:
        "'Fire-and-forget, sunucu atlayabilir demektir' yanılgıdır ve kalıcı bir yazmayı sessiz bir no-op'a çevirir. Alıştırmadaki sayaç tam da bu ayrımı sayılabilir kılmak için var: altı handler çağrısı, üç body.",
    },
    {
      kind: "editor",
      intro: `### Yanıt almayan frame'ler

\`handle_one\` ve \`handle_batch\`'i doldur.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → method'u \`effects\`'e push et, \`None\` döndür.
3. \`Frame::Call { method, id }\` → \`"add"\` dışında bir method, id'yi yansıtan \`-32601\`'dir; aksi halde method'u push et ve \`"result":7\` taşıyan sonuç object'ini döndür.
4. \`handle_batch\` → boş bir slice, null id'li tek bir \`-32600\`'dür. Aksi halde \`handle_one\` üzerinden \`filter_map\` et; hiçbir şey yanıt vermediyse \`None\`, verdiyse köşeli parantez içinde \`,\` ile birleştirilmiş yanıtları döndür.

Beklenen çıktı:

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

Altı handler, üç body.`,
    },
  ],

  "backend-rpc-services-3": [
    {
      kind: "theory",
      body: `Handler'ların gövdeleri farklıdır ama tek bir imzayı paylaşmaları gerekir; bu yüzden her biri bir trait object'tir:

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
struct Router { routes: HashMap<&'static str, Handler> }
\`\`\`

Box süs değil — farklı somut tiplerdeki closure'ların tek bir koleksiyonda yaşamasını sağlayan şey odur. Bedeli çağrı başına tek bir pointer dolaylaması; karşısında ise zaten socket okumasının gölgesinde kalan bir hash lookup'ı var.

Method adı üzerinde elle yazılmış bir \`match\` aynı dispatch'e derlenir. Yapamadığı şey **runtime'da genişletilmek**: başlangıçta kendi method'larını kaydeden bir modül yok, \`rpc.discover\` yok, tablodan sayılan method başına metrik yok — üstelik her yeni method, match'in sahibi olan dosyayı yeniden derletir.

Deterministik çıktıyla ilgili bir tuzak: \`HashMap\` iterasyon sırası belirsizdir ve process'ten process'e değişir. Herhangi bir method listesi, yazdırılmadan ya da hash'lenmeden önce sıralanmalıdır.`,
    },
    {
      kind: "theory",
      body: `Kenarda (edge) doğrulama yapmak, \`-32602\`'nin anlamıdır. Gerçek bir serviste bu işi Serde yapar:

\`\`\`rust
#[derive(Deserialize)]
struct SumParams { values: Vec<i64> }
\`\`\`

Bu, "JSON, handler'ımın varsaydığı şekle sahip değildi"i sınırda tipli bir hataya çevirir — hem de hiçbir iş kodu çalışmadan önce. Untagged ve internally-tagged enum gösterimleri, bir params union'ının tel üzerindeki forma nasıl eşleneceğine karar verir.

Önemli olan ayrım:

| hata | kod | kimin suçu |
| --- | --- | --- |
| yanlış arity, yanlış tip, eksik alan | -32602 | çağıranın |
| handler çalıştı ve patladı | -32603 | sunucunun |

Ve \`-32603\` asla içeriden bir mesaj sızdırmamalı. Tele \`"Internal error"\`, log'lara request id'si ve stack trace — bir hata mesajı, tablo adları, dosya yolları ve sorgu metni için bir sızdırma kanalıdır.`,
    },
    {
      kind: "quiz",
      question:
        "Method string'i üzerinde bir `match` yerine neden boxed handler'lardan oluşan bir `HashMap` tercih edilir?",
      options: [
        "Tablo, başlangıçta bağımsız modüller tarafından doldurulabilir ve runtime'da sayılabilir; bir `match` ikisini de imkânsız kılar",
        "`HashMap` O(1) dispatch ederken string üzerindeki bir `match` doğrusal bir karşılaştırma zinciridir",
        "Boxed closure'lar, aksi halde binary'yi şişirecek olan monomorphisation'ı önler",
      ],
      answer: 0,
      explain:
        "String literal'ları üzerindeki bir `match`, uzunluk ve önek temelli bir karar ağacına derlenir; dolayısıyla performans argümanı neredeyse başa baş. Asıl fark kaydedilebilirlik ve introspection — bir plugin sınırının ihtiyacı da tam olarak bunlar.",
    },
    {
      kind: "fill",
      prompt:
        "Hash seed'i ne olursa olsun, method listesini her çalıştırmada aynı yap.",
      file: "main.rs",
      before:
        "let mut names: Vec<&'static str> = self.routes.keys().copied().collect();\nnames.",
      after: "();\nnames",
      choices: ["sort", "dedup", "reverse"],
      answer: 0,
      explain:
        "`dedup` yalnızca *bitişik* tekrarları siler; sırasız girdide bu neredeyse hiçbir şey yapmaz, zaten key'ler de benzersiz. `reverse` ise zaten keyfî olan bir sırayı ters çevirir.",
    },
    {
      kind: "quiz",
      question:
        "`div`, `[10, 0]` ile çağrılıyor. Params typecheck'ten geçti; handler sıfıra böldü. Hangi kod?",
      options: [
        "-32603 Internal error — handler'a girildi ve başarısız oldu",
        "-32602 Invalid params, çünkü hatayı tetikleyen şey parametrelerdi",
        "-32600 Invalid Request, çünkü bu request zaten hiçbir zaman başarılı olamazdı",
      ],
      answer: 0,
      explain:
        "Cezbedici cevap -32602: parametreler gerçekten de sebep oldu. Ama -32602, handler'a girilmeden *önce* yapılan şekil ve arity kontrolüne ayrılmıştır. Handler'ın içine girdiğin andan itibaren her hata senindir.",
    },
    {
      kind: "editor",
      intro: `### Boxed handler'lardan bir router

1. \`register\`, boxed handler'ı adının altında \`self.routes\`'a ekler.
2. \`dispatch\` method'u arar; \`None\` demek \`-32601\` \`"Method not found"\` demektir.
3. \`method_names\` key'leri toplar ve **sıralar**.
4. \`main\` içinde iki handler kaydet:
   - \`"sum"\` → \`Ok(params.iter().sum())\`.
   - \`"div"\` → \`params.len() != 2\` iken \`-32602\`, bölen sıfırken \`-32603\`, aksi halde \`Ok(params[0] / params[1])\`.

Beklenen çıktı:

\`\`\`text
methods: ["div", "sum"]
method     params     outcome
sum        [1, 2, 3]  result 6
div        [10, 2]    result 5
div        [10, 0]    -32603 Internal error
div        [10]       -32602 Invalid params
multiply   [3, 4]     -32601 Method not found
\`\`\`

Üç farklı hata, üç farklı kod, tek bir tablo lookup'ı.`,
    },
  ],

  "backend-rpc-services-4": [
    {
      kind: "theory",
      body: `Tüm Tower ekosistemi iki trait'ten ibaret.

\`\`\`rust
trait Service { fn call(&mut self, req: &Req) -> Resp; }
trait Layer<S> { type Svc; fn layer(&self, inner: S) -> Self::Svc; }
\`\`\`

\`Service\`: request girer, response çıkar. \`Layer\` bir servis alır ve bir servis döndürür. Soyutlamanın tamamı bu — timeout, retry, concurrency limit, auth, tracing, load balancing; hepsi içinde bir \`S\` tutan, bir şey yapıp sonra \`self.inner.call(req)\` çağırarak \`Service\` implement eden birer struct.

Gerçek Tower buna \`poll_ready\` ekler — backpressure kanalı; bir servisin, sen ona request'i vermeden **önce** "şimdi olmaz" dediği yer — artı ilişkili Response, Error ve Future tipleri. Burada inşa ettiğin şey bu şekil.`,
    },
    {
      kind: "theory",
      body: `\`TimeoutLayer.layer(CountLayer.layer(Backend))\` bir soğan inşa eder. Timeout en dıştadır; dolayısıyla bütçeyi aşan bir request, backend'e hiç girilmeden reddedilir ve sayaç **5'te 3** okur. İkisini ters çevir: beşi de backend'e ulaşır ve timeout yalnızca yanıtı sınırlar.

Bir layer yığını, kesişen kaygılar üzerinde tam bir sıralamadır ve bunu savunabilmen gerekir:

| karar | üstte | altta |
| --- | --- | --- |
| auth vs rate limit | kimliksiz trafik yine de kota tüketir | limiter'ın çöp trafik için kripto yapar |
| tracing vs retry | mantıksal çağrı başına bir span | deneme başına bir span |
| timeout vs concurrency limit | kuyrukta bekleme bütçeye sayılır | yalnızca servis süresi sayılır |

Bunların hiçbirinin evrensel bir cevabı yok. Hepsinin senin servisin için bir cevabı var.`,
    },
    {
      kind: "quiz",
      question:
        "Timeout layer'ı bir request'i 100ms'de reddediyor. Backend'in çoktan başlattığı işe ne oldu?",
      options: [
        "Sonuna kadar çalışır — timeout içteki future'ı drop eder, bu da bu thread'i serbest bırakır ama çoktan uçuşa geçmiş sorguyu bırakmaz",
        "Timeout tetiklendiği anda iptal edilir ve bağlantısı serbest bırakılır",
        "İptal bayrağı set'lenmiş halde bir kez daha poll edilir ve temizce unwind olur",
      ],
      answer: 0,
      explain:
        "Bir timeout'un bir veritabanını yavaş sorgudan korumamasının sebebi budur: future'ı drop etmek çağıranın thread'ini geri verir ama sunucu tarafındaki iş devam eder. Onu sınırlamak, bu taraftaki bir layer'ı değil, karşı taraftaki bir statement timeout'unu gerektirir.",
    },
    {
      kind: "fill",
      prompt: "Sayan layer çağrıyı kaydeder, sonra onu aşağı devreder.",
      file: "main.rs",
      before: "self.calls += 1;\n",
      after: "\n",
      choices: [
        "self.inner.call(req)",
        "Resp::Ok(req.cost_ms)",
        "Backend.call(req)",
      ],
      answer: 0,
      explain:
        "İkincisi request'i kendisi yanıtlar, dolayısıyla sayacın altındaki hiçbir şey çalışmaz. Üçüncüsü ise kendisine verilen servisi değil yepyeni bir `Backend` çağırır — bu da yığında altında kalan her layer'ı sessizce çöpe atar.",
    },
    {
      kind: "quiz",
      question:
        "Bunun yerine `CountLayer.layer(TimeoutLayer.layer(Backend))`. Sayaç ne okur ve ne değişti?",
      options: [
        "5 — sayaç artık en dıştadır, dolayısıyla timeout'un reddettiği ikisi dahil her request'i görür",
        "3 — aynı, çünkü timeout yine aynı iki request'i reddediyor",
        "0 — sayaç artık backend'i sarmalamıyor, dolayısıyla hiçbir şey saymaz",
      ],
      answer: 0,
      explain:
        "Sıra, her layer'ın ne *gördüğünü* belirler. Aynı iki request her iki halde de başarısız olur; yer değiştiren şey ölçümdür — 'alınan request'ler' ile 'servis edilen request'lerin' farklı metrikler olmasının ve yığında farklı pozisyonlar istemesinin sebebi tam olarak budur.",
    },
    {
      kind: "editor",
      intro: `### Service ve Layer

Dört impl yaz.

1. \`impl<S: Service> Service for Counted<S>\` — \`self.calls\`'ı artır, sonra \`self.inner.call(req)\`'e devret.
2. \`impl<S> Layer<S> for CountLayer\`, \`type Svc = Counted<S>\`, \`Counted { inner, calls: 0 }\` kurarak.
3. \`impl<S: Service> Service for Timeout<S>\` — \`req.cost_ms > self.limit_ms\` olduğunda, içteki servisi çağır**madan** \`Resp::Err(-32001, "Request timeout")\` döndür.
4. \`impl<S> Layer<S> for TimeoutLayer\`, \`type Svc = Timeout<S>\`, \`limit_ms\`'i taşıyarak.

Beklenen çıktı:

\`\`\`text
method      cost_ms  outcome
ping              5  ok in 5ms
report          250  -32001 Request timeout
sum              90  ok in 90ms
export          400  -32001 Request timeout
ping             12  ok in 12ms
requests: 5, reached the backend: 3
\`\`\`

Hiçbir şey uyumuyor: maliyet, request üzerindeki bir veri; timeout ise bir karşılaştırma. Son satır, sıranın bir tasarım kararı olduğunun kanıtı.`,
    },
  ],

  "backend-rpc-services-5": [
    {
      kind: "theory",
      body: `Bir concurrency limit, bir servisi gerçekten sınırlayan tek düğmedir. Thread'ler, bağlantılar, veritabanı handle'ları — bir şey sonludur ve sayıyı sen seçmezsen makine senin yerine kötü seçer: ömrünü context switch'lerde geçiren 500 thread'lik bir pool, ya da tek bir yavaş bağımlılık yüzünden tükenirken üzerindeki diğer bütün endpoint'lerin karardığı bir pool.

Bir limit layer'ı bir permit sayısı tutar. Permit'ler bittiğinde iki politika arasında seçim yapmak zorundadır ve bu ders o seçimle ilgili:

- **shed** — \`-32000..-32099\` aralığından belgelenmiş bir kodla anında reddet
- **queue** — bir permit boşalana kadar request'i tut

Burada ikisi de aynı request'leri başarısızlığa uğratıyor. Sadece biri bunu yaparken backend'in zamanını harcıyor.`,
    },
    {
      kind: "theory",
      body: `Kuyruğa almak kapasite yaratmaz. Reddi gecikmeye çevirir.

Little Yasası \`L = λW\`'dir: servis kapasitesinin üzerindeki bir varış hızında kuyruk uzunluğu ve bekleme sınırsız büyür. Dolu bir pool'un arkasında 150ms bekleyip sonra 150ms çalışan bir request, deadline'ı 200ms olan bir client'a 300ms'lik bir cevap üretmek için backend'in zamanını yakmıştır — üstelik o client çoktan retry etmiş, λ'yı ikiye katlamıştır.

Herkesin bir kez gördüğü metastable hata budur. Servis down değildir. %100 kullanımdadır, vardığı anda çöpe atılacak işi servis etmektedir ve retry'lar sürdüğü sürece toparlanmayacaktır.

Erken shed etmek, kabul edilen request'leri hızlı tutar ve hatayı okunabilir kılar: belgelenmiş bir \`-32002\`, bir \`retry_after\`, backoff ile retry edilebilir diyen bir client kontratı ve bir dashboard'a koyabileceğin bir ret sayacı. Backpressure aynı fikrin bir seviye üstüdür — doluluğu üreticiye geri giden bir sinyal olan, sınırlı bir kuyruk.`,
    },
    {
      kind: "quiz",
      question:
        "Doymuş bir servisin önündeki kuyruk, burst'leri emsin diye ikiye katlanıyor. Bu ne kazandırır?",
      options: [
        "Request'lerin başarısız olduğu gecikmenin yükselmesini — hızlı hataları yavaş hatalara çevirir ve toparlanmayı geciktirir",
        "Daha yüksek erişilebilirlik; reddedilecek olan request'ler artık başarılı oluyor",
        "Ölçülebilir hiçbir şey, çünkü kuyruk derinliği servis hızını hiçbir şekilde etkilemez",
      ],
      answer: 0,
      explain:
        "Daha büyük bir kuyruk yalnızca servis hızına göre kısa süren bir burst'te işe yarar. Sürekli aşırı yüke karşı ise, kabul edilen her request deadline'ını kaçırana kadar beklemeyi yükseltir — alıştırma birebir aynı başarı sayılarını gösteriyor, tek fark 320ms'lik boşa giden backend işi.",
    },
    {
      kind: "fill",
      prompt:
        "Herhangi bir şeyi kabul etmeden önce, işi çoktan bitmiş slot'ları at.",
      file: "main.rs",
      before: "busy_until.",
      after: "(|finish| *finish > now);",
      choices: ["retain", "iter", "drain"],
      answer: 0,
      explain:
        "`iter` tembel bir iterator kurar ve hiçbir şeyi mutate etmez; dolayısıyla pool dolar ve bir daha boşalmaz. `drain` bir predicate değil bir aralık alır ve pool'u toptan boşaltırdı.",
    },
    {
      kind: "quiz",
      question:
        "Bir client shed'in kendisi için daha kötü olduğunu savunuyor: ret bir başarısızlıktır, kuyruğa alınan bir request ise hâlâ başarılı olabilir. Cevap ne?",
      options: [
        "0ms'de gelen bir ret, bütçesinin içinde kalan ve retry edilebilir bir cevaptır; 310ms'de gelen bir timeout ise sunucuyu da tüketen bir başarısızlıktır. İkisi aynı başarısızlık değil",
        "Haklılar; çözüm, kuyruktaki request'lerin yetişebilmesi için daha uzun bir client deadline'ı",
        "Tek bir client açısından haklılar, ama sunucu maliyeti client deneyiminden ağır bastığı için yine de shed seçiliyor",
      ],
      answer: 0,
      explain:
        "Bunu belirleyen şey client'ın kendi deadline'ı. Bütçe içinde tamamlanamayacak bir request zaten başarısız olmuştur; onu kuyruğa almak yalnızca ne zamanını gizler. Shed etmek, bütçeyi hâlâ harcanabilirken client'a geri verir — bir retry'a, bir fallback'e ya da azaltılmış bir yanıta.",
    },
    {
      kind: "editor",
      intro: `### Shed mi, queue mu

\`simulate\`'i tamamla. Her varış için, sırayla:

1. \`now = req.at_ms\`; yalnızca hâlâ \`> now\` olan \`busy_until\` girdilerini \`retain\` et.
2. Dolu **ve** \`shed_early\` → bir ret say; wait \`0\`, latency \`0\`, backend \`"no"\`, \`"-32002 Server busy"\` yazdır ve devam et.
3. Aksi halde boş bir slot varsa \`now\`'da, yoksa **en erken** bitiş zamanında başla — o slot'u kaldır.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`, \`finish\`'i push et.
5. \`latency > DEADLINE_MS\` → bir ret say, \`doomed_ms\`'e \`req.cost_ms\` ekle, \`"-32001 Request timeout"\`; aksi halde \`"ok"\`. Backend her iki halde de \`"yes"\`.

Beklenen çıktı:

\`\`\`text
policy: shed early
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0      0        0        no  -32002 Server busy
  4       0      0        0        no  -32002 Server busy
  5      10      0        0        no  -32002 Server busy
failed: 3, backend-ms spent on doomed work: 0

policy: queue everything
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0    150      300       yes  -32001 Request timeout
  4       0    150      300       yes  -32001 Request timeout
  5      10    290      310       yes  -32001 Request timeout
failed: 3, backend-ms spent on doomed work: 320
\`\`\`

Aynı iki başarı, aynı üç başarısızlık; kuyruğa almanın tek kazandırdığı 320ms'lik backend zamanı.`,
    },
  ],

  "backend-rpc-services-6": [
    {
      kind: "theory",
      body: `Bir token bucket en fazla \`capacity\` kadar token tutar ve sabit bir hızda dolar. Bir request bir token'a mal olur; ödeyemeyen request reddedilir. İki özellik kendiliğinden çıkar ve bunun bir API kotası için doğru şekil olmasının sebebi de tam olarak bunlar:

- \`capacity\` kadarlık bir burst'e izin verir, sonra tam olarak refill hızına oturur
- hiçbir zaman pencere sınırı yoktur — dakikada 60'lık sabit bir pencere, bir client'ın dikişin iki yanında iki saniyede 120 request göndermesine izin verir

Önemli olan implementasyon detayı: **refill timer'ı çalıştırma.** Erişim anında, \`(now - last_seen) * rate\` üzerinden tembel doldur ve capacity'de kırp.

\`\`\`rust
let earned = (now_ms - self.last_ms) * REFILL_PER_MS;
self.tokens = (self.tokens + earned).min(CAPACITY);
\`\`\`

Tek satır aritmetik, arka plan görevi yok, client başına iki tam sayılık state. Milli-token'lar işi tam sayıda tutar, böylece kayan nokta kayması olmaz; \`(deficit + rate - 1) / rate\` ise bir açığı, client'ın uyabileceği bir \`retry_after\`'a çeviren tavan bölmedir.`,
    },
    {
      kind: "theory",
      body: `Bucket **key** başınadır ve key'i seçmek politikanın *ta kendisidir*. Client id, API key, tenant, IP — ve NAT ya da CDN arkasında IP'ye göre key'lemek, koca bir ofisi tek client olarak rate-limit eder.

O state aynı zamanda bir RPC filosunun neden yalnızca büyük ölçüde stateless olduğunun sebebi. Bu limiter'ı round-robin bir load balancer arkasındaki 10 node'da in-process çalıştır: 5/sn'lik bir limit 50/sn olur — ve filo her autoscale ettiğinde değişir. Seçenekler gerçekten şunlar:

| yaklaşım | bedeli |
| --- | --- |
| limiti node sayısına böl | bir node öldüğü ya da eklendiği anda yanlış |
| Redis'te merkezileştir | request yolunda bir ağ gidiş-dönüşü ve sert bir bağımlılık |
| yaklaşık dağıtık sayaçlar | ortalamada doğru, bilerek aşar |

Servisteki *diğer her şey* gerçekten stateless kalmalı: session affinity yok, bellekte kullanıcı state'i yok. O zaman herhangi bir node herhangi bir request'i servis eder ve rolling deploy bir veri göçü olmaz.`,
    },
    {
      kind: "quiz",
      question:
        "Neden her bucket'ı arka plan görevinden tick'lemek yerine erişim anında tembel doldurmalı?",
      options: [
        "Bir ticker, kimsenin kullanmadığı bucket'lar için tick başına O(client) iş demektir; tembel refill request başına O(1) ve aritmetik olarak birebir aynı",
        "Arka plan görevi bucket map'ini lock olmadan güvenle mutate edemez; tembel refill lock'tan kaçınır",
        "Tembel refill daha isabetlidir, çünkü bir ticker token'ları tick aralığına kuantalar",
      ],
      answer: 0,
      explain:
        "Lock argümanı gerçek ama ikincil — ikisinde de bir lock gerekiyor. İsabet argümanı ise yanlış: 1ms'lik bir ticker da tamdır, sadece bunun için boştaki key sayısıyla orantılı CPU harcar.",
    },
    {
      kind: "fill",
      prompt: "Geçen süreyi hesaba geç, ama asla bucket'ın tuttuğunun üstüne çıkma.",
      file: "main.rs",
      before: "self.tokens = (self.tokens + earned).",
      after: "(CAPACITY);",
      choices: ["min", "max", "rem_euclid"],
      answer: 0,
      explain:
        "`max` bucket'ı capacity'de tabanlardı, dolayısıyla bir saniye boşta kalan bir client sonsuz bütçe elde ederdi. Kırpma tamamen olmazsa, bir saat boşta kalan bir client 18.000 token'la gelir ve burst limitinin hiçbir anlamı kalmaz.",
    },
    {
      kind: "quiz",
      question:
        "Limiter in-process çalışıyor, client başına yalnızca iki tam sayı tutuyor ve servis yatay ölçeklenebilir diye tarif ediliyor. Bu tarifin nesi yanlış?",
      options: [
        "Node başına bucket'lar, ayarlanan limiti node sayısıyla çarpar ve autoscaling ile kayar — API dokümanındaki limit, uyguladığın limit değildir",
        "Hiçbir şey — load balancer round-robin olduğu sürece node başına limitleme tamdır",
        "Bucket state'i node'ları stateful yapar, dolayısıyla bir rolling deploy uçuştaki request'leri düşürür",
      ],
      answer: 0,
      explain:
        "Rolling deploy'un bucket state'ini kaybetmesi zararsızdır — client'lar dolu bucket'larla geri gelir, ki bu müşteri lehine bir sapmadır. Asıl bug çarpmadır: her biri 5/sn uygulayan 10 node 50/sn eder, 30 node ise 150/sn — sessizce, ölçeği büyüttüğün gün.",
    },
    {
      kind: "editor",
      intro: `### Client başına bir token bucket

1. \`Bucket::new\` client'ı dolu başlatır: \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\`, \`(now_ms - self.last_ms) * REFILL_PER_MS\` kadar kredi verir, \`CAPACITY\`'de kırpar, \`last_ms\`'i saklar.
3. \`take\`, yeterince token varsa \`COST\` düşer ve \`Ok(self.tokens)\` döndürür; aksi halde \`(deficit + REFILL_PER_MS - 1) / REFILL_PER_MS\` taşıyan bir \`Err\` döndürür — tam bir token oluşana kadarki milisaniye. Bir ret hiçbir şey harcamaz.

Beklenen çıktı:

\`\`\`text
  t_ms client   before   after  outcome
     0 alice     5.000   4.000  allowed
     0 alice     4.000   3.000  allowed
     0 alice     3.000   2.000  allowed
     0 alice     2.000   1.000  allowed
     0 alice     1.000   0.000  allowed
     0 alice     0.000   0.000  -32005 Rate limit exceeded, retry_after_ms=200
   200 alice     1.000   0.000  allowed
   250 alice     0.250   0.250  -32005 Rate limit exceeded, retry_after_ms=150
   250 bob       5.000   4.000  allowed
  1500 alice     5.000   4.000  allowed
final alice: 4.000 tokens
final bob: 4.000 tokens
\`\`\`

Beşlik bir burst, sonra tam olarak refill hızı. t=1500'de alice capacity'de, üstünde değil.`,
    },
  ],

  "backend-rpc-services-7": [
    {
      kind: "theory",
      body: `\`offset=3&limit=3\`, "koleksiyonun **şu anki haliyle** başından itibaren üç satır say" demektir. Bu, birden fazla request boyunca tutamayacağın bir sözdür.

Sayfa 1 ile sayfa 2 arasında bir satır sil: ondan sonraki her satır bir aşağı kayar. Sayfa 2 bir satır geç başlar ve client'ın hiç görmediği bir satır **sonsuza dek** atlanır — hata yok, çıktıda boşluk yok, alarm verecek hiçbir şey yok. Bir insert ise bunun ayna görüntüsü olan bug'ı üretir: bir tekrar.

Cursor (imleç), son satırın kararlı bir tam sıralamadaki konumunu kodlayan opak bir token'dır:

\`\`\`sql
SELECT * FROM rows WHERE id > $cursor ORDER BY id LIMIT 3
\`\`\`

Sonraki sayfa bir sayıyla değil içerikle tanımlanır; dolayısıyla cursor'ın öncesindeki düzenlemeler onu kaydıramaz. İki kontrat detayı: **benzersiz** bir şeye göre sırala — tek başına \`created_at\` aynı timestamp'i paylaşan satırları kaybeder, o yüzden key \`(created_at, id)\`'dir — ve token'ı opak tut (tuple'ı base64'le) ki içindekini client'ları kırmadan değiştirebilesin.

Sonlanma da kontratın parçası: \`next_cursor\` son sayfada **yoktur**. Client'ın işinin bittiğini anlamasının yolu boş bir sayfa değil, budur.

Cursor'lar için maliyet argümanı — \`OFFSET\`'in O(offset + limit), keyset seek'in ise herhangi bir derinlikte O(log n + limit) olması — *Veri katmanı*'nın 4. dersinin konusu. Bu ders diğer yarısıyla ilgili: iki kontrat, altından koleksiyonu değişen bir client'a ne söz veriyor?`,
    },
    {
      kind: "theory",
      body: `Kontratın geri kalanı, üç parça hâlinde.

**Versiyonlama.** Eklemeli değişiklikler — yeni bir opsiyonel alan, yeni bir method — versiyon gerektirmez. Kaldırılan bir alan ya da değişen bir tip gerektirir. JSON-RPC'de en ucuz mekanizma method adının kendisidir: \`user.get\` ve \`user.get.v2\`; bu, tüm API'yi en yavaş tüketicisinde dondurmak yerine endpoint başına versiyonlar. Deprecation'ı (kullanımdan kaldırma) umuda değil, yayımlanmış bir tarihe ve client başına kullanım metriklerine dayandır.

**Request ID'leri.** Client göndermediyse kenarda bir tane üret, her response'ta yansıt ve her log satırına, her downstream çağrısına koy. Bir request'in filo içindeki yolunu yeniden kurmanı sağlayan tek şey odur ve maliyeti bir header.

**Error şemaları.** Bir JSON-RPC error'ının \`data\` üyesi, makinenin okuyabileceği detayın yeridir — hangi alan başarısız oldu, \`retryable: true\`, bir \`retry_after_ms\`. Başarı tiplerin kadar kararlı olmalı, çünkü client'lar onun üzerinden dallanır.`,
    },
    {
      kind: "quiz",
      question:
        "Bir mühendis OFFSET sayfalamayı savunuyor: sıralama deterministik, dolayısıyla sayfalar da deterministik. Nesi yanlış?",
      options: [
        "Sorun sıralamanın determinizmi değil — çok request'li bir yürüyüşün altında koleksiyonun değişmesi; offset'ten önceki bir silme bir satırı sessizce atlar",
        "Sıralama deterministik değil, çünkü sıralama key'indeki eşitlikleri planlayıcı keyfî sıralar",
        "Sorgu tek bir repeatable-read transaction'ı içinde çalıştığı sürece hiçbir sorun yok",
      ],
      answer: 0,
      explain:
        "Eşitlik bozma gerçek ve ayrı bir bug; uzun ömürlü bir snapshot transaction'ı ise doğruluğu gerçekten düzeltir, ama client'ın düşünme süresi boyunca bir okuma görünümünü açık tutma pahasına. Argüman ikisi de değil: offset yürüyüşü kusursuz bir benzersiz sıralamayla bile yanlıştır, çünkü dayandığı sayı değişti.",
    },
    {
      kind: "fill",
      prompt:
        "Sonraki cursor, bu sayfanın teslim ettiği son satırın konumudur.",
      file: "main.rs",
      before: "let next = if page.len() == limit { page.",
      after: "().copied() } else { None };",
      choices: ["last", "first", "iter().next"],
      answer: 0,
      explain:
        "`first` (ve `iter().next`), client'ın çoktan geçtiği bir cursor'ı geri verir; dolayısıyla sonraki sayfa birinci satırdan sonraki her şeyi yeniden teslim eder — ilerliyormuş gibi görünen sonsuz bir döngü.",
    },
    {
      kind: "quiz",
      question:
        "Bir client boş bir sayfa alana kadar sayfalıyor. Ne bozulur?",
      options: [
        "Her yürüyüşte bir gidiş-dönüşü boşa harcar ve bir sayfa başka herhangi bir sebeple kısa geldiği anda bozulur — doğru bir kontrat, sonlanmayı olmayan bir next_cursor ile bildirir",
        "Hiçbir şey — boş sayfa, cursor pagination'ın (sayfalama) standart sonlanma sinyalidir",
        "Son sayfayı iki kez sayar, çünkü boş response yine de bir cursor taşır",
      ],
      answer: 0,
      explain:
        "Sayfalar sondan başka sebeplerle de kısa gelir: limit'ten sonra uygulanan bir filtre, çağıranın görmeye yetkili olmadığı bir satır, soft-delete edilmiş bir kayıt. Kısa-ama-boş-değil'i 'devam et' diye okuyan bir client iyidir; bunu son sanan client değildir — sinyalin sayfa uzunluğu değil cursor olmasının sebebi de budur.",
    },
    {
      kind: "editor",
      intro: `### OFFSET'in bir satır düşürdüğünü kanıtla

1. \`page_by_offset\` → \`skip(offset).take(limit)\`; kendisine hangi tablo verildiyse onun başından sayarak.
2. \`page_by_cursor\` → cursor'dan kesinlikle büyük id'ler (\`after\` \`None\` ise hepsi), \`take(limit)\`, sayfayı ve sonraki cursor'ını döndürerek: \`page.len() == limit\` iken sayfanın **son** id'si, sayfa kısa geldiyse \`None\`.
3. \`missed\` → hiçbir sayfada görünmemiş, hayatta kalan satırlar.

\`main\`, her iki client için de sayfa 1 ile sayfa 2 arasında 2 numaralı satırı siler.

Beklenen çıktı:

\`\`\`text
api=v1  page_size=3  row 2 is deleted between page 1 and page 2
client     req_id   argument     page
offset     a-1      offset=0     [1, 2, 3]
offset     a-2      offset=3     [5, 6, 7]
offset     a-3      offset=6     [8, 9]
cursor     b-1      after=start  [1, 2, 3]
cursor     b-2      after=3      [4, 5, 6]
cursor     b-3      after=6      [7, 8, 9]
rows still in the table: [1, 3, 4, 5, 6, 7, 8, 9]
offset client never saw: [4]
cursor client never saw: []
\`\`\`

4 numaralı satır hâlâ tabloda ve hiçbir sayfada görünmedi. Bug bu, adıyla sanıyla.`,
    },
  ],
};
