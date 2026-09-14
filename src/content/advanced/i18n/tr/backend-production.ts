import type { LessonStep } from "@/content/steps";

// TR · Running It in Production.
//
// Overlay for ../../steps/backend-production.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendProductionStepsTr: Record<string, LessonStep[]> = {
  "backend-production-1": [
    {
      kind: "theory",
      body: `Üç instrument tipi var ve her biri farklı bir soruya cevap veriyor.

Bir **counter** monotondur — yalnızca yukarı gider ve onu ancak bir process restart'ı sıfırlar. Anlık değeri hiçbir şey ifade etmez; sen onun *rate*'ini (hız) okursun.

\`\`\`text
rate(http_requests_total[5m])
\`\`\`

Bir **gauge** iki yöne birden hareket eden, o ana ait bir seviyedir: aktif bağlantılar, kuyruk derinliği, pool boyutu, in-flight (uçuştaki) istekler.

Bir **histogram**, kümülatif bucket counter'ları artı \`_sum\` ve \`_count\` demektir. İçine değer observe eder, dışından dağılım sorgularsın.

Elini atman gereken üçlü bunlar. Prometheus bir de **summary** getirir; quantile'larını process'in içinde hesaplayıp bitmiş sayılar olarak export eder — ve quantile'lar, bucket sayılarının aksine, toplanamaz; yani bir summary bir filo genelinde birleştirilemez. Bir sonraki dersin bütün konusu bu, ve histogram'ın varsayılan olmasının sebebi de bu.

Tipi yanlış seçmek bir stil hatası değildir — bir counter sana concurrency'yi (eşzamanlılık) söyleyemez, bir gauge de rate'i söyleyemez.`,
    },
    {
      kind: "theory",
      body: `İki tuzak, ve ikisi de production'da ısırır.

**Bir gauge yalnızca scrape anında görülür**, tipik olarak her 15–30 s'de bir. İki scrape arasındaki her şey görünmezdir. Alıştırmada 14 in-flight isteklik gerçek zirve hiç gözlemlenmez, çünkü her scrape bir çukura denk gelip 5 raporlar. Önemli olan zirveyse — pool tükenmesi, kuyruğun en yüksek seviyesi — anlık gauge'in yanında bir "son scrape'ten beri max" gauge'i de export et, ya da histogram kullan.

**Her farklı label değeri ayrı bir time series'tir.** 9 bucket'lı bir histogram üzerinde \`user_id\` label'ı ve 100k kullanıcı 900.000 seri eder; kendi metrik backend'ini işte böyle düşürürsün. Label'lar sınırlı kümeler içindir: route, method, status sınıfı.`,
    },
    {
      kind: "quiz",
      question: "In-flight istekleri sayan bir gauge her 15 s'de bir scrape ediliyor. Gün boyunca kaydedilen en yüksek örnek 5. Bu, gerçek zirve hakkında neyi kanıtlar?",
      options: [
        "Yalnızca bir scrape'in 5 gördüğünü — iki scrape arasında yükselip düşen hiçbir şey örneklenmedi, dolayısıyla gerçek zirve çok daha yüksek olabilir",
        "Gerçek zirve 5'ti: bir gauge, önceki scrape'ten beri ulaşılan maksimumu export eder",
        "Gerçek zirve 5'ti, çünkü bir istek scrape aralığından uzun yaşar, yani örneklerin arasına hiçbir şey saklanamaz",
      ],
      answer: 0,
      explain: "Düz bir gauge, okunduğu andaki değeri raporlar; aralık üzerindeki bir max'ı değil — o, bilerek export etmen gereken ayrı bir instrument'tır. Üçüncü seçenek insanların gerçekten öne sürdüğü argümandır ve tam da önemli olduğu yerde çöker: kısa isteklerden oluşan patlamalar, bir pool'u tüketen zirvelerin ta kendisidir.",
    },
    {
      kind: "fill",
      prompt: "Bir observation'ı bir bucket'a ata. Prometheus bucket'ları `le`'dir — sınırdan küçük **ya da ona eşit**.",
      file: "main.rs",
      before: "while i < BOUNDS.len() && v ",
      after: " BOUNDS[i] {\n    i += 1;\n}",
      choices: ["> ", ">= ", "< "],
      answer: 0,
      explain: "`>=` ile, sınıra eşit bir değer kendi bucket'ının üstünden atlar: 10 ms'lik bir istek `le<=50`'ye düşer ve `le<=10` sayısı sessizce eksik raporlar. `<` tamamen ters yöne yürür ve her şeyi ilk bucket'a koyar.",
    },
    {
      kind: "quiz",
      question: "Bir servis `http_request_duration_sum` ve `http_request_duration_count` export ediyor, başka hiçbir şey yok. Hangi soruya cevap veremez?",
      options: [
        "Kaç isteğin 100 ms'den uzun sürdüğü — o bir bucket sayısıdır ve bir sum ile bir count onu yeniden kuramaz",
        "Son beş dakikanın ortalama latency'si — bir sum ile bir count bir pencere üzerinde rate'lenemez",
        "Servisin istekleri servis ederken harcadığı toplam süre — `_sum` istek sayısıdır, sürelerin toplamı değil",
      ],
      answer: 0,
      explain: "Ortalama tam olarak o ikisinin sana verdiği şeydir: `rate(_sum[5m]) / rate(_count[5m])`. Alıştırmada ortalama 42.2 ms, oysa 20 isteğin 15'i 10 ms'nin altında bitti — ortalama gerçektir ve kuyruk (tail) için aynı zamanda işe yaramazdır.",
    },
    {
      kind: "editor",
      intro: `### Tek bir iş yükü üzerinde üç instrument

1. \`Histogram\`'ı implement et: \`observe(v)\`, \`v\`'yi \`sum\`'a ekler ve sınırı \`>= v\` olan ilk bucket'ı artırır; \`count()\` observation'ları toplar; \`above(bound)\` kuyruğu bucket'lardan okur.
2. 12 tick'i dolaş. Counter \`ARRIVALS[t]\`'yi alır; gauge \`ARRIVALS[t] - DEPARTURES[t]\`'yi alır. Her tick'te gerçek zirveyi ve bir scrape'in göreceği zirveyi takip et; \`t % 3 == 2\` olduğunda scrape et.
3. Her latency'yi observe et, bucket satırını, sonra ortalamayı ve kaçının 100 ms'yi aştığını yazdır.

Beklenen çıktı:

\`\`\`text
tick  accepted  active  scrape
   0         4       4  -
   1        10       9  -
   2        12       3  yes
   3        21      11  -
   4        26      14  -
   5        27       4  yes
   6        30       5  -
   7        37      11  -
   8        39       5  yes
   9        43       8  -
  10        46       9  -
  11        47       2  yes

counter accepted_total = 47 (monotonic)
gauge   active = 2, true peak = 14, peak seen by scrapes = 5

le<=10 le<=50 le<=100 le<=500 +Inf
    15      2       0       3    0
mean = 42.2 ms; over 100 ms = 3 of 20
\`\`\`

Gauge'in gerçek zirvesi 14 ve her scrape onu kaçırıyor. Ortalama 42.2 ms ve 20 isteğin 15'i 10 ms'nin altında bitti.`,
    },
  ],

  "backend-production-2": [
    {
      kind: "theory",
      body: `Prometheus \`_bucket{le="..."}\` değerlerini **kümülatif** sayılar olarak, artı \`_sum\` ve \`_count\` olarak sunar.

Ortalama kesindir: \`_sum / _count\`. Bir quantile değildir. Bir rank hesaplarsın, kümülatif sayıları onu geçene kadar yürürsün ve o bucket'ın üst sınırını raporlarsın:

\`\`\`text
rank = ceil(q · n)
cum >= rank olana kadar kümülatif sayıları yürü
cevap = o bucket'ın üst sınırı
\`\`\`

Yani raporlanan 2000 ms'lik bir p99 yalnızca "500 ile 2000 ms arasında bir yerde" demektir. **Bucket sınırların, cevabının çözünürlüğüdür**; SLO'nun iki yanına düşmeleri gerekmesinin sebebi budur. Bir SLO'yu sıkılaştırmak sınır eklemek demektir, örnek eklemek değil.`,
    },
    {
      kind: "theory",
      body: `Percentile'lar lineer değildir. Onları instance'lar arasında ortalayamazsın, max'ını da alamazsın. **Bucket sayılarını toplamak geçerlidir**, çünkü her bucket bir counter'dır — Prometheus histogram'larının bu şekilde tasarlanmasının tüm sebebi bu, ve filo sorgusunun quantile'ı hesaplamadan *önce* bucket'ları toplamasının da:

\`\`\`text
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_bucket[5m])))
\`\`\`

Alıştırma hatayı iki yönde de görünür kılıyor. Yoğun ve sağlıklı bir instance (1000 istek) ile sakin ve hasta bir tanesi (100 istek), p99'ların ortalaması olarak 1012.5 veriyor — gerçeği 2000; p95'lerin ortalaması olarak 1005 veriyor — gerçeği 500. Ortalama almak birini olduğundan küçük gösterdi, diğerini ikiye katladı, çünkü ağırlıksız ortalama api-1'in trafiğin %91'ini taşıdığını umursamıyor.

Birleşmiş ortalama 42 ms, birleşmiş p99 ise 2000 ms — 48 kat fark. 42 ms'lik bir ortalama kimseyi gece yarısı uyandırmaz; yüz kullanıcıdan biri iki saniye bekliyordur. Criterion sana bir benchmark için aynı dağılımı verir; flamegraph ise histogram kuyruğun var olduğunu söyledikten sonra o sürenin *nereye* gittiğini söyler.`,
    },
    {
      kind: "quiz",
      question: "On iki instance'ın her biri bir p99 export ediyor. Filonun p99'u nedir?",
      options: [
        "Instance başına p99'ların hiçbiri birleştirilemez — önce bucket'ları instance'lar arasında topla, sonra quantile'ı birleşmiş sayılardan hesapla",
        "Onların maksimumu: p99 en kötü durum ölçüsüdür, dolayısıyla filonunkini en kötü instance belirler",
        "Her instance'ın istek sayısıyla ağırlıklandırılmış ortalamaları — quantile'ların istek ağırlıklı ortalaması kesindir",
      ],
      answer: 0,
      explain: "Ağırlıklı ortalama, işin ustaca görünen yanlış cevabıdır ve yine de yanlıştır: ağırlıklandırma trafik çarpıklığını düzeltir, ama bir karışımın quantile'ı parçaların quantile'larının hiçbir ortalaması değildir. Yalnızca bucket'lar toplanabilir.",
    },
    {
      kind: "fill",
      prompt: "İki instance'ın histogram'ını tek bir histogram'da birleştir.",
      file: "main.rs",
      before: "for i in 0..9 {\n    merged.counts[i] = ",
      after: ";\n}",
      choices: ["a.counts[i] + b.counts[i]", "(a.counts[i] + b.counts[i]) / 2", "a.counts[i].max(b.counts[i])"],
      answer: 0,
      explain: "Her bucket bir counter'dır, dolayısıyla birleştirme toplamadır. Ortalama almak filonun observation sayısını yarıya indirir ve kimsenin yaşamadığı bir dağılım raporlar; max almak ise hiçbir şeyi iki kez saymaz ama sakin instance'ın kuyruğunu tamamen çöpe atar.",
    },
    {
      kind: "quiz",
      question: "Bucket'ların `..., 500, 2000, +Inf` ve dashboard p99 = 2000 ms raporluyor. Sana ne söylemiş oldu?",
      options: [
        "İsteklerin %99'unun 2000 ms içinde bittiğini — gerçek p99 500 ms'nin üzerinde bir yerde, ve 2000 senin seçtiğin bir sınır, bir ölçüm değil",
        "En yavaş %1'lik isteklerin her birinin yaklaşık 2000 ms sürdüğünü",
        "Yüz istekten birinin tam olarak 2000 ms sürdüğünü — histogram o rank'teki gözlenen değeri saklar",
      ],
      answer: 0,
      explain: "Bucket'lı bir histogram hiç örnek saklamaz, yalnızca sayı. 500 ile 2000 arasındaki her p99 2000 raporlar; 900 ms'lik bir SLO'yu çözebilmek için 1000 ms'lik bir sınır eklersin.",
    },
    {
      kind: "editor",
      intro: `### İki instance'ı yalan söylemeden birleştir

1. \`count()\`, \`mean()\` (\`_sum / _count\`) ve \`quantile(q)\`'yu implement et — rank \`ceil(q · n)\`, kümülatif sayıları yürü, geçilen bucket'ın üst sınırını döndür.
2. \`api-1\` ve \`api-2\`'yi starter yorumlarındaki sayılardan kur, sonra \`merged\`'i **bucket'ları toplayarak** ve sum'ları toplayarak kur.
3. Bucket tablosunu, sonra histogram başına bir count/sum/mean/p50/p95/p99 satırını yazdır.
4. İki p95'in ortalamasını gerçek birleşmiş p95'e karşı yazdır; p99 için de aynısını.

Beklenen çıktı:

\`\`\`text
le       api-1  api-2  merged
1         120      0     120
2         300      0     300
5         380      2     382
10        150      3     153
25         40     10      50
100         5     20      25
500         4     40      44
2000        1     25      26
+Inf        0      0       0

          count       sum    mean     p50     p95     p99
api-1      1000      4200     4.2       5      10      25
api-2       100     42000   420.0     500    2000    2000
merged     1100     46200    42.0       5     500    2000

mean of the p95s: 1005.0   true merged p95: 500
mean of the p99s: 1012.5   true merged p99: 2000
\`\`\`

p95'leri ortalamak gerçeği ikiye katlıyor; p99'ları ortalamak yarıya indiriyor.`,
    },
  ],

  "backend-production-3": [
    {
      kind: "theory",
      body: `Bir log satırı key=value'dur, cümle değil.

\`\`\`rust
error!("failed to load user {} for org {}", uid, org);
\`\`\`

Bu tek bir opak string'tir. Onu aggregate edemez, index'leyemez ya da üzerine alert kuramazsın — birinin ifadeyi düzenlediği ilk seferde kırılacak bir regex olmadan. Kayıt (record) şudur:

\`\`\`text
level=error event=user_load_failed user_id=91 org_id=4 err=timeout
\`\`\`

Her alan sorgulanabilir bir boyuttur, mesaj metni sabittir ve aynı satır bir ingest pipeline'ı için değişmeden JSON'a serileşir. \`tracing\`'in sana \`log\` üzerine verdiği şey budur: bir \`Subscriber\` önceden render edilmiş bir string yerine yapılandırılmış alanları formatlar, \`#[instrument]\` ise bir span'ın alanlarını içindeki her event'e otomatik olarak iliştirir.`,
    },
    {
      kind: "theory",
      body: `Bir production log'u, iç içe geçmiş birçok istektir. Alıştırmada seq 01–12 iki request ID arasında dönüşümlü ilerler ve **hiçbir satır ait olduğu satırın yanında değildir**. Kenarda üretilip her katmandan taşınan — ve downstream servislere \`traceparent\` olarak tel üzerinden çıkan — bir request ID, o akışı yeniden bir hikâyeye çeviren şeydir.

\`depth\` ekle, ya da gerçek bir span parent'ı, ve ağacı süreleriyle birlikte yeniden kurabilirsin. Ne ortaya çıktığına dikkat et:

\`\`\`text
root 46ms, children 44ms, unaccounted 2ms
\`\`\`

O 2 ms, handler'ın kendi işidir. Kendi kodunu mu yoksa bağımlılığını mı optimize edeceğini söyleyen sayı odur ve onu iki süreden yalnızca biriyle elde edemezsin.

Cardinality kuralı: bir request ID bir log **alanı** olarak gayet iyidir, bir metrik **label**'ı olarak ise felakettir.`,
    },
    {
      kind: "quiz",
      question: "Ekibin correlation ID'si yok ama her satırda `user_id` ve `endpoint` logluyor. Bu neden eşdeğer değil?",
      options: [
        "Aynı kullanıcıdan aynı endpoint'e giden iki eşzamanlı istek, hiçbir filtrenin ayıramayacağı iç içe geçmiş satırlar üretir",
        "`user_id` ve `endpoint` yüksek cardinality'li alanlardır, bu yüzden log backend'i onları index'lemeyi reddeder",
        "Bir isteğin log satırları akışta bitişiktir, dolayısıyla en baştan filtreye gerek yoktur",
      ],
      answer: 0,
      explain: "Tam da ihtiyacın olduğu anda bozulur: yük altında, retry yapan bir client'ta, olay (incident) sırasında. Diğer iki seçenek log backend'i hakkında yanlıştır (alanlar ucuzdur; pahalı olan metrik *label*'larıdır) ve akış hakkında yanlıştır (iç içe geçme varsayılandır).",
    },
    {
      kind: "fill",
      prompt: "Child span'ları topla ki handler'ın kendi süresi çağırdıklarınınkinden ayrılabilsin.",
      file: "main.rs",
      before: "EVENTS.iter()\n    .filter(|e| e.0 == \"7f3a\" && e.3 == \"end\" && ",
      after: ")\n    .map(|e| e.4)\n    .sum()",
      choices: ["e.2 == 1", "e.2 == 0", "e.2 >= 0"],
      answer: 0,
      explain: "Depth 0 root'tur — çıkarma yaptığın span'ın ta kendisi. Onu dahil etmek unaccounted'ı 0 ms raporlar ve handler'ın kendi maliyetini gizler; her şeyi dahil etmek ise 46 ms'lik bir root'un içine 90 ms'lik child verir.",
    },
    {
      kind: "quiz",
      question: "Bir root span 46 ms ve iki child span'ı toplam 44 ms. Handler'ın kendisi ne yapıyor?",
      options: [
        "2 ms'lik iş — child span'lar çağrılanların süresidir, fark ise çağıranın kendisininki",
        "44 ms'lik iş — child'lar handler'ın kendi işlemleridir, instrument edilmiş hâlleri",
        "46 ms'lik iş — root span handler'ın yaptığı her şeyi ölçer, child'lar dahil",
      ],
      answer: 0,
      explain: "İkisini karıştırmak seni yanlış process'i optimize etmeye gönderir. `db.query`'deki 41 ms'ye karşı 2 ms'lik self time, cevabın bir index ya da bir sorgu yeniden yazımı olduğu anlamına gelir; daha hızlı bir handler değil.",
    },
    {
      kind: "editor",
      intro: `### İç içe geçmiş bir akıştan tek bir isteği yeniden kur

1. \`fn emit(...) -> String\` tek bir yapılandırılmış satır kurar: iki haneye sıfır doldurulmuş \`seq\`, ardından \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — artı **yalnızca bir end'de** \`dur_ms\`, ve bir end 40 ms'yi aştığında \`level=warn\`.
2. 12 event'in hepsini sırayla, seq 1'den başlayarak emit et.
3. \`req=7f3a\`'ya filtrele. Her start için eşleşen end'ini bul ve span'ı \`depth * 2\` kadar girintili olarak süresiyle yazdır.
4. root, children ve unaccounted'ı, sonra 12 satırdan kaçının eşleştiğini yazdır.

Beklenen çıktı:

\`\`\`text
--- log stream (two requests interleaved) ---
seq=01 level=info req=7f3a span=http.request depth=0 event=start
seq=02 level=info req=7f3a span=auth.verify depth=1 event=start
seq=03 level=info req=b91c span=http.request depth=0 event=start
seq=04 level=info req=7f3a span=auth.verify depth=1 event=end dur_ms=3
seq=05 level=info req=b91c span=auth.verify depth=1 event=start
seq=06 level=info req=7f3a span=db.query depth=1 event=start
seq=07 level=info req=b91c span=auth.verify depth=1 event=end dur_ms=2
seq=08 level=info req=b91c span=db.query depth=1 event=start
seq=09 level=warn req=7f3a span=db.query depth=1 event=end dur_ms=41
seq=10 level=warn req=7f3a span=http.request depth=0 event=end dur_ms=46
seq=11 level=info req=b91c span=db.query depth=1 event=end dur_ms=7
seq=12 level=info req=b91c span=http.request depth=0 event=end dur_ms=11

--- filtered req=7f3a ---
http.request      46ms
  auth.verify      3ms
  db.query        41ms
root 46ms, children 44ms, unaccounted 2ms
lines matching req=7f3a: 6 of 12
\`\`\`

2 ms unaccounted, handler'ın kendi işidir. 46 ms'nin 41'i \`db.query\`'dedir.`,
    },
  ],

  "backend-production-4": [
    {
      kind: "theory",
      body: `Sabit bir retry aralığı, hiç retry yapmamaktan daha kötüdür: zorlanan bir bağımlılığa tam olarak yanlış anda, üstelik tekrar tekrar vurur. Exponential backoff — \`base · 2^attempt\`, üst sınırlı — denemeleri yayar.

Ama **tek başına backoff senkronize eder**. 500 client aynı anda başarısız olursa hepsi t+100 ms'de, sonra hepsi t+300 ms'de retry eder: düzenli bir takvim üzerinde gürleyen bir sürü (thundering herd). Full jitter onları dekorele eder:

\`\`\`text
delay = uniform(0, min(cap, base · 2^attempt))
\`\`\`

Üst sınır (cap) da önemli. 100 ms'lik bir base'ten sınırsız ikiye katlama, 13. denemede \`100 << 13\` = 819.200 ms'ye — on üç buçuk dakikaya — ulaşır; kullanıcıdan çoktan vazgeçmiş bir client hâlâ bir bağlantı slot'unu tutuyordur.

Alıştırmanın LCG'si bilerek deterministik seed'lenmiş — yeniden üretemediğin bir retry politikası, test edemediğin bir retry politikasıdır. 1. denemenin 1 ms jitter çekmesine dikkat: full jitter gerçekten de sıfıra yakın dönebilir; bazı sistemlerin tabanlı decorrelated jitter'ı tercih etmesinin sebebi de budur.`,
    },
    {
      kind: "theory",
      body: `Retry'lar yükü tam da sistemin onu emecek en az kapasiteye sahip olduğu anda çarpar. %62 başarısız olma olasılığı olan bir çağrıda 3 retry ile alıştırma, sunulan yükü 40 denemeden 115'e çıkarıyor — **zaten çökmüş bir bağımlılığa nişan almış 2.88x amplification (büyütme)**. Çoğu zincirleme kesintinin şekli budur: retry mantığı, bozulmuş bir bağımlılığı ölmüş bir bağımlılığa çevirir.

Bunu client tarafında bir **retry budget** düzeltir. Retry'lar istek hacminin en fazla sabit bir kesrini tüketebilir — burada %10; çağrı başına 10 senti-token kazanan ve retry başına 100 ödeyen bir token bucket olarak implement edilmiş. Amplification 1.07x'e düşüyor, 75 retry'ın 72'si reddediliyor ve bağımlılık toparlanacak yer buluyor.

Pazarlığa kapalı iki kural: yalnızca idempotent operasyonları retry et, ve bir 4xx'i asla retry etme. Bağımlılık doğru cevap verdi; yanlış olan istek, ve ikinci seferde de aynı derecede yanlış olacak.`,
    },
    {
      kind: "quiz",
      question: "Her client exponential backoff kullanıyor. Thundering herd neden yine de oluşabilir?",
      options: [
        "Birlikte başarısız olan client'lar aynı miktarlarda geri çekilir, dolayısıyla her retry'da birlikte varırlar — backoff sürünün ne zaman vardığını değiştirir, vardığı gerçeğini değil",
        "Backoff gecikmeyi sınırlar; her client sınıra dayandığında sonsuza dek sınırın frekansıyla retry ederler",
        "Üstel büyüme bağımlılığın toparlanmasını geçer, dolayısıyla sürü bağımlılık zaten sağlıklı olduktan sonra oluşur",
      ],
      answer: 0,
      explain: "Korelasyonu kıran şey jitter'dır. Sınıra dayanmış client'lar seçeneği gerçek bir kararlı durumu tarif eder, ama sürü sınırdan çok önce zaten senkronizedir — ilk retry'dan itibaren senkronizedir.",
    },
    {
      kind: "fill",
      prompt: "Bir backoff'u full-jitter gecikmesine çevir.",
      file: "main.rs",
      before: "let b = backoff(attempt);\nlet delay = ",
      after: ";",
      choices: ["rng.below(b + 1)", "b / 2 + rng.below(b / 2 + 1)", "b + rng.below(b + 1)"],
      answer: 0,
      explain: "Full jitter, `[0, b]` aralığının tamamı üzerinde uniform'dur. İkinci seçenek *equal* jitter'dır — `b/2`'de tabanı olan gerçek bir AWS varyantı; yayılımı yarıya indirir, dolayısıyla daha az dekorele eder. Üçüncüsü jitter'ı backoff'un üstüne ekler; bu da her client'ı geciktirir ama onları hiç dekorele etmez.",
    },
    {
      kind: "quiz",
      question: "Her client çağrı başına 3 retry ile sınırlı. Bu neden bağımlılığın gördüğü yük için bir üst sınır değil?",
      options: [
        "Çağrı başına bir sınır tek bir çağrıyı sınırlar ve hacim hakkında hiçbir şey söylemez: %100 hata oranında filo yine normal trafiğinin 4 katını teslim eder",
        "Sınır client başınadır ve client'lar birbirini göremez, dolayısıyla düşük bir hata oranında bile toplam sınırsızdır",
        "İlk deneme bir hata döndürmek yerine timeout'a düştüğünde retry'lar sınırı atlar",
      ],
      answer: 0,
      explain: "Amplification filonun bir özelliğidir, dolayısıyla üst sınırın da filo hacmine karşı ifade edilmesi gerekir. İsteklerin %10'u kadar bir budget her hata oranında tutar; 3'lük bir sınır yalnızca senin kontrol etmediğin bir hata oranında tutar.",
    },
    {
      kind: "editor",
      intro: `### Amplification'ı sınırla

1. LCG'yi implement et: \`next()\`, \`6364136223846793005\` ile çarpar ve \`1442695040888963407\` ekler (wrapping), \`state >> 33\` döndürür; \`below(n)\` \`next() % n\`'dir, \`n\` \`0\` olduğunda \`0\`.
2. \`0x2545F491\` ile seed'le ve \`0..5\` denemeleri için sınırlanmış backoff'u (\`BASE_MS << attempt\`, \`CAP_MS\`'te sınırlı) bir full-jitter çekiminin yanında yazdır.
3. Budget'sız toplam deneme sayısını say: başarısız olan her çağrı \`MAX_RETRIES\` alır.
4. Budget ile tekrar say: çağrı başına \`BUDGET_PER_CALL\` kazan, retry başına \`RETRY_COST\` öde, ödeyemediğinde retry'ı reddet. İkisi için de denemeleri, amplification'ı ve granted/denied dağılımını yazdır.

Beklenen çıktı:

\`\`\`text
attempt  backoff_ms  full_jitter_ms
      0         100              45
      1         200               1
      2         400             169
      3         800             501
      4        1000             517

40 calls, 25 of them failing, max 3 retries each
policy       attempts  amplification  granted  denied
no budget         115           2.88x       75       0
10% budget         43           1.07x        3      72
\`\`\`

2.88x 1.07x'e dönüşüyor, ve 75 retry'ın 72'si client'ı hiç terk etmiyor.`,
    },
  ],

  "backend-production-5": [
    {
      kind: "theory",
      body: `Üç durum, ve aralarındaki geçişler mekanizmanın tamamı.

**Closed** — çağrılar geçer. Eşiğe ulaşan bir başarısızlık serisi onu attırır.
**Open** — hiç çağrı yapılmaz. Çağıran, 30 saniyelik bir connect timeout yerine mikrosaniyeler içinde breaker'ın kendi hatasıyla başarısız olur.
**Half-open** (yarı açık) — bir cooldown'dan sonra ulaşılır. Tam olarak bir probe'un geçmesine izin verilir. Başarı breaker'ı kapatır ve başarısızlık serisini temizler; başarısızlık onu yeniden açar ve cooldown'ı yeniden başlatır.

Alıştırma yürüyüşün tamamını yazdırıyor: t=5'te trip, t=9, 13 ve 17'de probe'lar, 17'de kapanış. Bağımlılık hâlâ çökmüşken breaker'ın ne satın aldığına dikkat et — 22 tick'in 9'u short-circuit edildi, yani ölüme mahkûm bir çağrıda asla bloke olmayan 9 thread ya da bağlantı slot'u.

Asıl mesele bu. **Bir circuit breaker (devre kesici), çağıranı kaynak tükenmesinden en az çağrılanı koruduğu kadar korur.**`,
    },
    {
      kind: "theory",
      body: `Parametreler, ve nerede yanlış gittikleri.

**Ardışık başarısızlıklar üzerine bir eşik basittir ama sinirlidir.** Production kütüphaneleri bunun yerine kayan (rolling) bir hata oranı kullanır — "son 100 çağrının %50'sinden fazlası, en az 20 çağrı" — çünkü bu, tek bir şanssız çift yüzünden trip olmaz ve sürekli %40'lık bir hata oranı altında kapalı kalmaz.

**Half-open bir probe kabul etmeli, normal trafiği sürdürmemeli.** Doğrudan tam yüke kapanmak, cold cache (soğuk önbellek) ile yeni dönmüş bir bağımlılığı yeniden sular ve breaker'ı anında tekrar attırır.

**Her başarısızlık sayılmaz.** Bir connect timeout ya da bir 503 sayılmalı; bir 400 sayılmamalı — bağımlılık doğru cevap verdi ve bir dahaki sefere de aynı şekilde cevap verecek.

İlgili, ve ayrı tutmaya değer: bir **liveness** probe'u "orchestrator beni restart etmeli mi" sorusunu cevaplar ve downstream hiçbir şeye bağlı olmamalıdır, yoksa hasta tek bir bağımlılık bütün filonu restart eder. Bir **readiness** probe'u "load balancer bana route etmeli mi" sorusunu cevaplar ve meşru olarak bağlı olabilir.`,
    },
    {
      kind: "quiz",
      question: "Cooldown doluyor. Breaker neden doğrudan closed'a değil de half-open'a geçiyor?",
      options: [
        "Kapanmak, kimsenin test etmediği bir bağımlılığa tam yükü gönderir; half-open önce tam olarak bir istek harcayıp öğrenir",
        "Half-open, bir seri sürerken closed'ın yapamayacağı bir şeyi, hata sayacını sıfırlamayı yapmak için vardır",
        "Cooldown bir alt sınırdır ve half-open, bağımlılık kendini sağlıklı bildirene kadar breaker'ı açık tutar",
      ],
      answer: 0,
      explain: "Toparlanan bağımlılık kırılgan olan durumdur: cold cache'ler, soğuk connection pool'ları, eritilecek bir backlog. Bir probe ucuz bir sorudur; gürleyen bir yeniden bağlanma dalgası ise onu tekrar yere seren şeydir.",
    },
    {
      kind: "fill",
      prompt: "Half-open probe'u başarısız oldu. Breaker'ı yeniden aç.",
      file: "main.rs",
      before: "} else if state == State::HalfOpen {\n    state = State::Open;\n    opened_at = ",
      after: ";\n}",
      choices: ["t", "opened_at", "0"],
      answer: 0,
      explain: "Cooldown *bu* başarısızlıktan itibaren yeniden başlamalı. Orijinal `opened_at`'i korumak cooldown'ı çoktan dolmuş bırakır, dolayısıyla breaker hemen bir sonraki tick'te tekrar half-open olur ve her tick'te ölü bir bağımlılığı probe eder — breaker'ın var olma sebebi olan çekiçlemenin ta kendisi. `0` aynı bug'ın kalıcı hâlidir.",
    },
    {
      kind: "quiz",
      question: "Bir circuit breaker önce neyi korur?",
      options: [
        "Çağıranı — thread'leri ve bağlantı slot'ları, nasıl olsa timeout'a düşecek çağrılar tarafından tüketilmeyi bırakır",
        "Çağrılanı — yük atmak (load shedding), zorlanan bir bağımlılığın toparlanmasını sağlayan şeydir",
        "Kullanıcıyı — hızlı bir hata, yavaş bir hatadan daha iyi bir deneyimdir",
      ],
      answer: 0,
      explain: "Bağımlılığı kollamak ve hızlı başarısız olmak gerçek faydalardır, ama ikisi de birer sonuçtur. Breaker'ı olmayan bir çağıran, çağrılanın hastalığından ölür: her worker 30 saniyelik bir timeout'ta park etmiş hâlde, ve tek bir bağımlılıktaki kesinti senin servisindeki kesintiye dönüşmüş olur.",
    },
    {
      kind: "editor",
      intro: `### Durum makinesini yürüt

22 tick'in hepsi için \`t\`'yi, girişteki durumu, eylemi, sonucu ve sonraki durumu yazdır.

- **closed** — çağır. \`THRESHOLD\` ardışık başarısızlık onu open'a attırır ve \`opened_at\`'i kaydeder.
- **open** — short-circuit; hiç çağrı yapma. \`opened_at\`'ten \`COOLDOWN\` tick sonra half-open'a geç.
- **half-open** — bir probe. Başarı breaker'ı kapatır ve seriyi temizler; başarısızlık onu yeniden açar ve cooldown'ı yeniden başlatır.

Yapılan downstream çağrı sayısı ve short-circuit edilen tick sayısıyla bitir.

Beklenen çıktı:

\`\`\`text
t   state      action         result    next
0   closed     call           ok        closed
1   closed     call           ok        closed
2   closed     call           ok        closed
3   closed     call           fail 1/3  closed
4   closed     call           fail 2/3  closed
5   closed     call           fail 3/3  open
6   open       short-circuit  -         open
7   open       short-circuit  -         open
8   open       short-circuit  -         open
9   half-open  probe          fail      open
10  open       short-circuit  -         open
11  open       short-circuit  -         open
12  open       short-circuit  -         open
13  half-open  probe          fail      open
14  open       short-circuit  -         open
15  open       short-circuit  -         open
16  open       short-circuit  -         open
17  half-open  probe          ok        closed
18  closed     call           ok        closed
19  closed     call           ok        closed
20  closed     call           ok        closed
21  closed     call           ok        closed

downstream calls: 13, short-circuited: 9 of 22 ticks
\`\`\`

22 yerine 13 çağrı, ve başarısız olan iki probe bir izdiham yerine birer istek maliyetinde.`,
    },
  ],

  "backend-production-6": [
    {
      kind: "theory",
      body: `Dört faz, bu sırayla.

**1. Kabul etmeyi durdur.** SIGTERM'de readiness probe'unu başarısıza çevir ve listener'ı kapat ki load balancer, process hâlâ hayattayken buraya yeni istek route etmeyi bıraksın. Gerçek bir cluster'da readiness, listener kapanmadan *önce* dönmeli — LB'nin fark etmesi birkaç saniye sürer; production shutdown handler'larının bir şeyi kapatmadan önce uyumasının sebebi de budur.

**2. Drain (boşaltma).** Zaten uçuşta olanı servis etmeye devam et. Alıştırmanın drain eğrisi, istekler emekli oldukça 5 → 4 → 2 → 1.

**3. Deadline.** Drain sınırsız olamaz: tek bir takılı istek pod'u sonsuza dek tutar, ve orchestrator'ın kendi grace period'u beklemez. Kubernetes sana 30 s verir, sonra SIGKILL gönderir.

**4. Kalanı zorla kapat**, ve hangi istekleri öldürdüğünü logla — burada 8 numaralı istek, 20 tick'lik aykırı değer.`,
    },
    {
      kind: "theory",
      body: `Bunun ne kazandırdığı, ve ne kazandırmadığı.

SIGTERM'de anında çıkmak uçuştaki 5 isteği öldürür. Drain 1 tanesini öldürür. Bu fark, p99 sıçraması ve bir dizi 502 olarak görünen deploy ile kimsenin fark etmediği deploy arasındaki farktır — üstelik rolling update'teki her pod ile çarpılmış hâlde.

Reddedilen istekler hata değil, doğru davranıştır: bağlantı kapanırken dönen bir 503, balancer'a başka yere route etmesi için bir sinyaldir.

Graceful shutdown'ın sana vermediği iki şey. Sana **idempotency** vermez — deadline'da öldürülen bir istek yarı commit etmiş olabilir, dolayısıyla işin kendisinin retry'a güvenli olması gerekir. Ve **uzun süren işi** kurtarmaz: 10 dakikalık bir job bir isteğin arkasına ait değildir; tüketicisi kesilip devam ettirilebilen bir kuyruğa aittir.

Rollback'ler de aynı düşünce ailesinden. Bir rollback bir deploy kadar otomatik olmalıdır, çünkü etki yarıçapını zaten anladığın tek düzeltmedir.`,
    },
    {
      kind: "quiz",
      question: "Listener'ı kapatmak ile readiness'ı başarısıza çevirmek eşdeğer mi, yoksa sıra önemli mi?",
      options: [
        "Önce readiness: balancer hâlâ bu pod'a inanırken socket'i kapatmak, aktif olarak buraya route ettiği bağlantıları reddeder",
        "Önce listener: balancer'ı route etmeye devam ettiren şey açık bir socket'tir, dolayısıyla trafiği asıl boşaltan şey onu kapatmaktır",
        "Eşdeğer — ikisi de pod'u erişilemez kılar ve balancer bir sonraki health check'inde hangisi olursa olsun fark eder",
      ],
      answer: 0,
      explain: "İkisi iki farklı şeyi boşaltır. Readiness dönüşü *routing*'i boşaltır; listener'ı kapatmak *socket*'i boşaltır. Önce socket'i yap, ve balancer'ın fark etmesinden önceki saniyelerde gönderdiği her istek connection refused alır — yani tam da kaçınmaya çalıştığın 502 dalgası.",
    },
    {
      kind: "fill",
      prompt: "Bir gelişi yalnızca sunucu hâlâ kabul ediyorken içeri al.",
      file: "main.rs",
      before: "for _ in 0..arrived {\n    if ",
      after: " && next_id < SERVICE.len() { /* admit */ } else { rejected += 1; }\n}",
      choices: ["accepting", "t < SIGTERM_AT + DEADLINE", "in_flight.len() < 5"],
      answer: 0,
      explain: "İkinci seçenek drain penceresi boyunca kabul etmeye devam eder — deadline'da zorla kapatmaya söz verdiğin işi kabul etmiş olursun. Üçüncüsü bir concurrency limitidir: sahip olmak iyidir ve yerine geçmez, çünkü yer olduğu sürece SIGTERM'den sonra da yeni istekleri neşeyle içeri alır.",
    },
    {
      kind: "quiz",
      question: "Drain deadline'ı hiç tetiklenmemesi gereken bir emniyet ağı olarak tarif ediliyor, bu yüzden 60 s'ye ayarlanmış. Bunun nesi yanlış?",
      options: [
        "Tam da zaten patolojik olan isteklerde tetiklenir, ve 60 s Kubernetes'in 30 s'lik grace period'unu aşar — önce SIGKILL gelir ve drain hiç tamamlanmaz",
        "Uzun bir deadline pod'un bağlantılarını açık tutar, dolayısıyla balancer 60 s boyunca ona route etmeye devam eder",
        "Deadline istek başınadır, dolayısıyla 60 s'lik bir deadline, uygulanmadan önce 60 s'lik yeni işin birikmesine izin verir",
      ],
      answer: 0,
      explain: "Orchestrator'ın grace period'undan uzun bir deadline, var olmayan bir deadline'dır; ve kaçınmaya çalıştığın zarif olmayan kapanışı elde edersin. Onu grace period'un altında seç ve tetiklenmesini bekle — öldürdüğü istekler zaten hiç bitmeyecek olanlardır.",
    },
    {
      kind: "editor",
      intro: `### Drain, deadline, zorla kapatma

Her tick: tick'in gelişlerini yalnızca kabul ediyorken içeri al (aksi hâlde bir 503 say), uçuştaki her isteği azalt, 0'a ulaşanları emekli et ve satırı yazdır.

- \`SIGTERM_AT\`'te: kabul etmeyi durdur, readiness'ı \`503\`'e çevir ve kaç tanesinin uçuşta olduğunu hatırla.
- \`in_flight\` boşaldığında (temiz bir drain) ya da SIGTERM'den beri \`DEADLINE\` tick geçtiğinde dur — sonra kalan ne varsa zorla kapat ve id'leri yazdır.
- completed, rejected ve force-closed ile bitir; sonra anında bir çıkışın bunun yerine neyi öldüreceğiyle.

Beklenen çıktı:

\`\`\`text
t   accepting  ready  arrived  admitted  in_flight  done
0   yes        200    2        2         2          0
1   yes        200    1        1         1          2
2   yes        200    3        3         3          3
3   yes        200    1        1         3          4
4   yes        200    2        2         5          4
5   no         503    2        0         4          5
6   no         503    0        0         2          7
7   no         503    0        0         2          7
8   no         503    0        0         1          8
9   no         503    0        0         1          8
10  no         503    0        0         1          8
11  no         503    0        0         1          8
12  no         503    0        0         1          8
13  no         503    0        0         1          8
deadline hit at t=13 -- force-closing [8]

completed 8, rejected 2 (503 after SIGTERM), force-closed 1
immediate exit at t=5 would have killed 5 in-flight instead
\`\`\`

Beş yerine bir istek öldürüldü, ve öldürülen o istek zaten hiç bitmeyecek olan 20 tick'lik aykırı değer.`,
    },
  ],

  "backend-production-7": [
    {
      kind: "theory",
      body: `\`\`\`text
L = λ · W
\`\`\`

**L** *sistemdeki* istek sayısıdır — servis edilenler artı kuyruktakiler. **λ** geliş hızıdır. **W** bir isteğin sistemde geçirdiği süredir.

Kararlı her sistem için geçerlidir, geliş dağılımı hakkında hiçbir varsayım yapmadan. Ezberlemeye değer tek kuyruk teorisi sonucu olmasının sebebi budur.

Onu üç şekilde oku.

**İleri doğru** — 250 ms hedefinde 1200 rps, 300 eşzamanlı slot ister.
**Geri doğru** — her biri 20 ms servis süreli 32 worker, 32/0.020 = 1600 rps kapasite demektir, nokta; bu iki sayıdan biri değişmeden hiçbir tuning daha fazlasını vermez.
**Yandan** — 40 in-flight, 1200 rps ve 20 ms latency gösteren bir dashboard sana yanlış bir sayı gösteriyordur, çünkü 1200 · 0.020 = 24'tür.`,
    },
    {
      kind: "theory",
      body: `Kapasitenin altında latency sadece servis süresidir ve kuyruk boştur. Onun ötesinde gelişler gidişleri aşar ve **backlog lineer olarak, sınırsız büyür**. 1600'e karşı 1800 rps'te, bir saniyelik aşırı yük 200 isteği kuyrukta bırakır; her biri kendi 20 ms'lik işinin üstüne 200/1600 = 125 ms bekler. Latency zarifçe bozulmaz; fazlanın hızında bozulur.

O yüzden limiti bilerek koy. 1600 rps kapasiteyle 50 ms hedefinde L = 1600 · 0.050 = sistemde 80: 32'si serviste, 48'i kuyrukta olabilir. **80'i içeri al. 81.'sini anında bir 503 ile at (load shedding)**, çünkü o noktadan sonra kabul edilen bir istek zaten 50 ms'yi tutturamaz ve tutturamazken bir slot işgal eder.

Bir load test'in ölçtüğü şey budur. Kapasiteyi bulmak için rampa çık (sustained), hata modunu bulmak için aş (saturation), toparlanmanın zarif olup olmadığını görmek için basamak fonksiyonu uygula (spike). Ortalamayı değil, tail latency'yi izle — doyuma giden bir sistemin ortalaması şaşırtıcı derecede uzun süre saygın kalır.`,
    },
    {
      kind: "quiz",
      question: "%100 kullanım neden verimli çalışma noktası değil?",
      options: [
        "%100'de gelişlerdeki varyansı emecek boşluk yoktur, dolayısıyla her patlama asla tam boşalmayan bir kuyruk kurar ve throughput hâlâ iyi görünürken latency tırmanır",
        "%100'de scheduler zamanının çoğunu context switch'lere harcar, dolayısıyla efektif throughput kapasitenin altına düşer",
        "%100 kullanım verimlidir — %60–70 geleneği, latency ile değil, çöken bir replica'ya yer bırakmakla ilgilidir",
      ],
      answer: 0,
      explain: "Gelişler eşit aralıklı değildir. Sıfır boşlukla her patlama, bir sonraki sakin dönemin eritecek yedek kapasitesinin olmadığı bir kalıntı bırakır ve λ değişmezken W tırmanır — hareket edebilen tek terim kuyruktur.",
    },
    {
      kind: "fill",
      prompt: "Bir latency hedefini bir concurrency limitine çevir. `concurrency` saniye alır.",
      file: "main.rs",
      before: "let l_max = concurrency(capacity(), ",
      after: ");",
      choices: ["TARGET_MS / 1000.0", "TARGET_MS", "SERVICE_S"],
      answer: 0,
      explain: "Saniye başına bir hıza karşı milisaniye geçmek L = 80.000 verir — Little Yasası'nı yanlış gösteren birim hatası. `SERVICE_S` geçmek L = 32 verir, yani worker sayısını: limitin pool boyutu olduğu ve hiç kuyruğa izin verilmediği yanılgısı.",
    },
    {
      kind: "quiz",
      question: "Servis doyuma ulaşıyor, bu yüzden istek kuyruğu 100'den 10.000'e büyütülüyor. Bu neyi değiştirir?",
      options: [
        "Kapasite hakkında hiçbir şeyi: bir erişilebilirlik problemini bir latency problemine çevirir, bu da bir patlama için zaman kazandırır ve sürekli aşırı yükün hızlı yerine yavaş başarısız olmasını sağlar, o kadar",
        "Efektif kapasiteyi artırır, çünkü saniyede daha az istek reddedilir ve worker'lar birinin gelmesini bekleyerek asla boş kalmaz",
        "p99'u düşürür, çünkü atılacak olan istekler artık client tarafından retry edilmek yerine tamamlanır",
      ],
      answer: 0,
      explain: "Bir kuyruk bir tampondur, bir sunucu değil. Sürekli aşırı yüke karşı artık her istek önce bekler sonra başarısız olur; bu da anında başarısız olmaktan kesinlikle daha kötüdür. Yük atmayı bir kaza değil bir karar hâline getiren şey, bir concurrency limitidir.",
    },
    {
      kind: "editor",
      intro: `### Bir latency hedefinden bir kabul limitine

1. \`capacity()\` \`WORKERS / SERVICE_S\`'tir. \`concurrency(lambda, w_s)\` \`lambda * w_s\`'tir — Little Yasası, bir kez yazılmış.
2. Sunulan her hız için L'yi, kullanım oranını, bir saniyelik aşırı yükten sonraki backlog'u, ortaya çıkan latency'yi (\`SERVICE_S + backlog / capacity()\`) ve \`ok\`, \`at capacity\` ya da \`saturated\` hükmünü yazdır.
3. Mevcut servis süresinde zirveyi karşılamak için gereken worker sayısını yazdır.
4. \`TARGET_MS\`'i bir concurrency limitine çevir — \`L = capacity · target\` — onu serviste ve kuyrukta olarak ayır, ve aşırı yükün kuyruğu doldurmasının ne kadar sürdüğünü yazdır.

Beklenen çıktı:

\`\`\`text
capacity = L / W = 32 / 0.020s = 1600 rps

offered      L  util%  backlog_1s  latency_ms  verdict
    400    8.0   25.0           0        20.0  ok
    800   16.0   50.0           0        20.0  ok
   1200   24.0   75.0           0        20.0  ok
   1600   32.0  100.0           0        20.0  at capacity
   1800   36.0  112.5         200       145.0  saturated
   2000   40.0  125.0         400       270.0  saturated

to serve 2000 rps at W = 20 ms you need L = 2000 * 0.020 = 40 workers
latency target 50 ms at 1600 rps: L = 1600 * 0.050 = 80 in system
  = 32 in service + 48 queued -> concurrency limit 80, shed beyond it
  at 1800 rps the queue passes 48 after 0.24s of overload
\`\`\`

1600 rps'nin ötesinde fazlayı emebilen tek terim kuyruktur, ve bunu lineer olarak yapar.`,
    },
  ],
};
