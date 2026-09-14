// TR · editor instructions — RPC Services at Scale.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-rpc-services.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendRpcServicesInstructionsTr: Record<string, { instructions: string }> = {
  "backend-rpc-services-1": {
    instructions: `## Gelen bir request'i sınıflandır

Bir JSON-RPC 2.0 Request'i (istek) şudur: \`{"jsonrpc": "2.0", "method": ..., "params": ..., "id": ...}\`. Response (yanıt) ise **ya** \`result\` **ya da** \`error\` taşır, asla ikisini birden. Beş kod rezerve edilmiştir:

| kod | anlamı | ne zaman |
| --- | --- | --- |
| -32700 | Parse error | byte'lar JSON değil |
| -32600 | Invalid Request | parse edildi, ama bir Request object'i değil |
| -32601 | Method not found | isim kayıtlı değil |
| -32602 | Invalid params | method var, argümanlar typecheck'ten geçmiyor |
| -32603 | Internal error | handler (işleyici) çalıştı ve başarısız oldu |

\`-32000\` ile \`-32099\` arası senin kendi sunucu hatalarına bırakılmıştır.

Id kuralı herkesi tökezletir: geçerli bir Request object'i elindeyse id'yi **byte'ı byte'ına** yansıt, değilse \`id: null\` gönder — bir parse error'da ortada hiç id olmamış olabilir, bozuk şekilli bir request ise yanlış tipte bir id taşıyor olabilir.

### Görevin

\`classify\`'ı doldur. Beş kontrolü sırayla çalıştır — parse, request şekli, method, params, handler — ve her birine kendi koduyla yanıt ver.

1. \`well_formed == false\` \`-32700\` \`"Parse error"\`tur, id \`Id::Null\`.
2. \`Some("2.0")\` olmayan bir \`version\` ya da eksik bir \`method\` \`-32600\` \`"Invalid Request"\`tur, id \`Id::Null\`.
3. \`methods\` içinde olmayan bir method \`-32601\` \`"Method not found"\`tur, id'yi yansıtarak.
4. \`params_ok == false\` \`-32602\` \`"Invalid params"\`tur, id'yi yansıtarak.
5. \`handler_ok == false\` \`-32603\` \`"Internal error"\`tur, id'yi yansıtarak.
6. Aksi halde \`Reply { code: 0, message: "result", id }\` — \`main\`, \`0\` kodunu \`-\` olarak yazdırır.

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

### İpuçları

- \`Id\` \`Clone\`'dur, dolayısıyla \`r.id.clone()\` onu yansıtır.
- \`methods.contains(&r.method.unwrap())\` — \`unwrap\` güvenli, çünkü 2. kontrol eksik method'u zaten reddetti.
- Erken \`return\`'ler kontrollerin sırasını görünür tutar; o sıra sınıflandırmanın *ta kendisidir*.
`,
  },

  "backend-rpc-services-2": {
    instructions: `## Yanıt almayan iki frame

Id üyesi bir anahtardır. **id'si olmayan** bir Request bir **notification**'dır (bildirim): sunucu handler'ı çalıştırır ve bir response object'i göndermemelidir, error bile. Açıkça \`null\` olan bir id ise başka bir şeydir — o, id'si tesadüfen null olan bir çağrıdır.

Bir batch (toplu istek), Request object'lerinden oluşan bir JSON array'idir ve kurallarından üçü naif sunucuları bozar:

- **Boş bir array** Request object'i değildir, dolayısıyla tek bir \`-32600\` alır, \`id: null\` ile.
- **Yalnızca notification'lardan** oluşan bir batch **hiç response body'si üretmez** — \`[]\` bile değil.
- **Bozuk bir üye** \`id: null\` ile yanıtlanır, çünkü sunucu o üyenin notification olacak olup olmadığını bilemez.

Sıra da garanti değildir: client, response'ları request'lerle id üzerinden eşler, asla pozisyona göre değil.

### Görevin

\`handle_one\` ve \`handle_batch\`'i doldur.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → method'u \`effects\`'e push et ve \`None\` döndür. Yan etki yine de çalışır; bastırılan yalnızca yanıttır.
3. \`Frame::Call { method, id }\` → \`"add"\` dışında bir method \`Some(error_obj(-32601, "Method not found", &id.to_string()))\`tur; aksi halde method'u push et ve \`Some(format!("{{\\"jsonrpc\\":\\"2.0\\",\\"result\\":7,\\"id\\":{}}}", id))\` döndür.
4. \`handle_batch\`: boş bir slice, null id'li tek bir \`-32600\`'dür. Aksi halde frame'leri \`handle_one\` üzerinden \`filter_map\` et; hiçbir şey yanıt vermediyse \`None\`, verdiyse \`[\` \`]\` içinde \`,\` ile birleştirilmiş yanıtları döndür.

Beklenen çıktı:

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

### İpuçları

- \`filter_map(|f| handle_one(f, effects))\` tam olarak \`None\` döndüren üyeleri düşürür.
- \`replies.join(",")\` array gövdesini kurar.
- Üç response body'sine karşılık altı handler çağrısı işin özü: \`effects.len()\` gönderilen yanıtları değil, yapılan işi sayar.
`,
  },

  "backend-rpc-services-3": {
    instructions: `## Boxed handler'lardan bir router

Handler'ların gövdeleri farklıdır ve tek bir imzayı paylaşmaları gerekir; bu yüzden her biri bir trait object'tir:

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
\`\`\`

Box, farklı somut tiplerdeki closure'ların tek bir \`HashMap\`'te yaşamasını sağlayan şeydir. Bedeli çağrı başına bir pointer dolaylaması; karşısında ise zaten socket okumasının yanında cüce kalan bir hash lookup'ı var. Method adı üzerinde elle yazılmış bir \`match\` de aynı hızda dispatch eder, ama başlangıçta bağımsız bir modül tarafından genişletilemez ve runtime'da sayılamaz.

İşin diğer yarısı üç hatayı ayırmak. \`-32601\`, tablonun tutmadığı bir isimdir. \`-32602\`, handler'a girilmeden **önce** yapılan şekil ve arity kontrolüdür. \`-32603\` ise gerçek işe ulaşıp başarısız olan bir handler'dır — ve asla tele içeriden bir mesaj sızdırmamalıdır.

### Görevin

1. \`register\`, boxed handler'ı adının altında \`self.routes\`'a ekler.
2. \`dispatch\` method'u arar. \`Some(handler)\` onu çağırır; \`None\` ise \`Err(RpcError { code: -32601, message: "Method not found" })\`tur.
3. \`method_names\` key'leri toplar ve **sıralar** — \`HashMap\` iterasyon sırası belirsizdir ve process'ten process'e değişir.
4. \`main\` içinde iki handler kaydet:
   - \`"sum"\`, \`Ok(params.iter().sum())\` döndürür.
   - \`"div"\`, \`params.len() != 2\` iken \`-32602\` \`"Invalid params"\`, bölen sıfırken \`-32603\` \`"Internal error"\`, aksi halde \`Ok(params[0] / params[1])\` döndürür.

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

### İpuçları

- \`Box::new(|params: &[i64]| ...)\` — closure'ın \`Handler\`'a coerce olabilmesi için parametre tipinin belirtilmesi gerekir.
- \`self.routes.keys().copied().collect()\` sana sıralayabileceğin bir \`Vec<&'static str>\` verir.
- Sıfıra bölme \`-32602\` değil \`-32603\`'tür: params typecheck'ten geçti, sonra handler başarısız oldu.
`,
  },

  "backend-rpc-services-4": {
    instructions: `## Service ve Layer

Tüm Tower ekosistemi iki trait'ten ibaret. \`Service\` tek bir method'tur — request girer, response çıkar. \`Layer<S>\` tek bir method'tur — bir servis al, bir servis döndür. Kullandığın her middleware (ara katman), içinde bir \`S\` tutan ve bir şey yapıp sonra \`self.inner.call(req)\` çağırarak \`Service\` implement eden bir struct'tır.

Gerçek Tower buna \`poll_ready\` ekler (backpressure kanalı: bir servis, sen ona request'i vermeden *önce* "şimdi olmaz" der) ve ilişkili Response/Error/Future tiplerini. Burada inşa ettiğin şey bu şekil.

Alıştırmanın ölçtüğü karar kompozisyon sırası. \`TimeoutLayer.layer(CountLayer.layer(Backend))\` timeout'u en dışa koyar; dolayısıyla bütçeyi aşan bir request backend'e hiç girilmeden reddedilir — ve sayaç 5'te 3 okur.

### Görevin

Dört impl yaz.

1. \`impl<S: Service> Service for Counted<S>\` — \`self.calls\`'ı artır, sonra \`self.inner.call(req)\`'e devret.
2. \`impl<S> Layer<S> for CountLayer\`, \`type Svc = Counted<S>\` ile; \`Counted { inner, calls: 0 }\` kurar.
3. \`impl<S: Service> Service for Timeout<S>\` — \`req.cost_ms > self.limit_ms\` ise içteki servisi çağır**madan** \`Resp::Err(-32001, "Request timeout")\` döndür; aksi halde devret.
4. \`impl<S> Layer<S> for TimeoutLayer\`, \`type Svc = Timeout<S>\` ile; \`limit_ms\`'i taşır.

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

### İpuçları

- \`stack.inner\` \`Counted\`'dır, çünkü dış layer timeout'tur — sonda sayacın okunabilir olmasını sağlayan da bu.
- Hiçbir şey uyumuyor. Maliyet, request üzerindeki bir veri; timeout ise bir karşılaştırma.
- İki layer'ı ters çevir: her request backend'e ulaşırdı. Sayaç, sıranın bir tasarım kararı olduğunun kanıtı.
`,
  },

  "backend-rpc-services-5": {
    instructions: `## Shed mi, queue mu

Bir concurrency limit, bir servisi sınırlayan tek düğmedir. Thread'ler, bağlantılar, veritabanı handle'ları: bir şey sonludur ve sayıyı sen seçmezsen makine senin yerine kötü seçer. Permit'ler bittiğinde limiter'ın tam olarak iki seçeneği vardır ve bu simülasyon ikisini de aynı trafiğe karşı çalıştırır.

Little Yasası \`L = λW\` der: servis kapasitesinin üzerindeki bir varış hızında kuyruk uzunluğu ve bekleme sınırsız büyür. Dolu bir pool'un arkasında 150ms bekleyip sonra 150ms çalışan bir request, deadline'ı 200ms olan bir client'a 300ms'lik bir cevap üretmek için backend'in zamanını yakmıştır — üstelik o client çoktan retry etmiş, λ'yı ikiye katlamıştır. Metastable hata budur: servis down değildir, tüm kapasitesini çöpe atılacak işe harcamaktadır.

### Görevin

\`simulate\`'i tamamla. Her varış için, sırayla:

1. \`now = req.at_ms\` yap ve \`busy_until\` girdilerinden yalnızca hâlâ \`> now\` olanları \`retain\` et.
2. \`busy_until.len() == CAPACITY\` ve \`shed_early\` ise bir ret say ve satırı wait \`0\`, latency \`0\`, backend \`"no"\`, outcome \`"-32002 Server busy"\` ile yazdır, sonra devam et.
3. Aksi halde bir başlangıç zamanı seç: boş bir slot varsa \`now\`, yoksa \`busy_until\` içindeki **en erken** bitiş zamanı — o slot'u kaldır ve orada başla.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`; \`finish\`'i push et.
5. \`latency > DEADLINE_MS\` bir ret sayar, \`doomed_ms\`'e \`req.cost_ms\` ekler ve \`"-32001 Request timeout"\` okur; aksi halde \`"ok"\`. Satırı backend \`"yes"\` ile yazdır.

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

### İpuçları

- \`busy_until.iter().min()\` en erken boşalan slot'u bulur; \`position\` ise onu \`remove\` için konumlandırır.
- Wait sütunu \`start - now\`.
- İki toplamı birbirine karşı oku: her iki halde de aynı üç başarısızlık, ve kuyruğa almanın tek kazandırdığı 320ms'lik backend zamanı.
`,
  },

  "backend-rpc-services-6": {
    instructions: `## Client başına bir token bucket

Bir bucket en fazla \`capacity\` kadar token tutar ve sabit bir hızda dolar; bir request bir token'a mal olur ve ödeyemeyen request reddedilir. İki özellik kendiliğinden çıkar: bucket \`capacity\` kadarlık bir burst'e izin verir, sonra tam olarak refill hızına oturur. Dakikada 60'lık sabit bir pencere, bir client'ın pencere sınırının iki yanında 120 request göndermesine izin verir; bir bucket asla vermez.

Bir refill timer'ı **çalıştırma**. Erişim anında \`(now - last_seen) * rate\` üzerinden tembel doldur ve capacity'de kırp: tek satır aritmetik, arka plan görevi yok, client başına iki tam sayılık state. Buradaki her şey milli-token cinsinden, böylece tam sayı aritmetiği tam kalır; \`(deficit + rate - 1) / rate\` ise bir açığı, client'ın uyabileceği bir \`retry_after\`'a çeviren tavan bölmedir.

### Görevin

1. \`Bucket::new\` client'ı dolu başlatır: \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\`, \`(now_ms - self.last_ms) * REFILL_PER_MS\` kadar kredi verir, \`.min(CAPACITY)\` ile kırpar ve \`last_ms = now_ms\` saklar.
3. \`take\`, yeterince token varken \`COST\` düştükten sonra \`Ok(self.tokens)\` döndürür. Aksi halde \`deficit = COST - self.tokens\` hesapla ve \`Err((deficit + REFILL_PER_MS - 1) / REFILL_PER_MS)\` döndür — tam bir token oluşana kadarki milisaniye. Bir ret hiçbir şey harcamaz.

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

### İpuçları

- \`BTreeMap\` son listelemeyi sabit bir sırada tutar; \`HashMap\` tutmazdı.
- \`bob\` t=250'de dolu bir bucket'la geliyor — state key başınadır ve key'i seçmek politikanın kendisidir.
- t=1500'de alice yeniden capacity'de: 1250ms'lik kredi 6,25 değil 5 token'a kırpılıyor.
`,
  },

  "backend-rpc-services-7": {
    instructions: `## OFFSET'in bir satır düşürdüğünü kanıtla

\`offset=3&limit=3\`, "koleksiyonun **şu anki haliyle** başından itibaren üç satır say" demektir. Sayfa 1 ile sayfa 2 arasında koleksiyon değişir — bir satır silinir ve ondan sonraki her şey bir aşağı kayar; dolayısıyla sayfa 2 bir satır geç başlar ve client'ın hiç görmediği bir satır sonsuza dek atlanır. Bir insert ise bunun ayna görüntüsü olan bug'ı üretir: bir tekrar.

Cursor (imleç), son satırın kararlı bir tam sıralamadaki konumunu kodlar (\`WHERE id > $cursor ORDER BY id LIMIT n\`); böylece sonraki sayfa bir sayıyla değil içerikle tanımlanır ve cursor'ın öncesindeki düzenlemeler onu kaydıramaz. İki kontrat detayı: benzersiz bir şeye göre sırala — tek başına \`created_at\` aynı timestamp'i paylaşan satırları kaybeder, o yüzden key \`(created_at, id)\`'dir — ve token'ı opak tut ki içindekini client'ları kırmadan değiştirebilesin.

Sonlanma da kontratın parçası. Sonraki cursor son sayfada **yoktur**; client'ın işinin bittiğini anlamasının yolu boş bir sayfa değil, budur.

### Görevin

1. \`page_by_offset\`, \`ids.iter().skip(offset).take(limit)\`'in toplanmış halini döndürür — kendisine hangi tablo verildiyse onun başından sayarak.
2. \`page_by_cursor\`, cursor'dan kesinlikle büyük id'leri tutar (\`after\` \`None\` ise hepsini), \`limit\` kadar alır ve sayfayı sonraki cursor'ıyla döndürür: \`page.len() == limit\` iken sayfanın **son** id'si, sayfa kısa geldiyse \`None\`.
3. \`missed\`, hiçbir sayfada görünmemiş, hayatta kalan satırları döndürür.

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

### İpuçları

- \`page.last().copied()\` sana bir \`Vec<u64>\`'ten doğrudan \`Option<u64>\` verir.
- 4 numaralı satır, offset client'ının kaybettiği satır — hâlâ tabloda ve hiçbir sayfada görünmedi.
- \`req_id\` sütunu kontratın diğer yarısı: kenarda bir tane üret, her response'ta yansıt ve her log satırına ve downstream çağrısına koy.
`,
  },
};
