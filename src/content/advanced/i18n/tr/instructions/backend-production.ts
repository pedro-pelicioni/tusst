// TR · editor instructions — Running It in Production.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-production.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendProductionInstructionsTr: Record<string, { instructions: string }> = {
  "backend-production-1": {
    instructions: `## Counter'lar, gauge'ler ve histogram'lar

Bir **counter** monotondur ve bir değer olarak anlamsızdır — sen onun rate'ini (hız) okursun. Bir **gauge** iki yöne birden hareket eden, o ana ait bir seviyedir. Bir **histogram**, kümülatif bucket counter'ları artı \`_sum\` ve \`_count\` demektir.

İki tuzak. Bir gauge yalnızca scrape anında görülür, dolayısıyla iki scrape arasında yükselip düşen her şey görünmezdir. Ve her farklı label değeri ayrı bir time series'tir — label'lar sınırlı kümeler içindir, asla bir kullanıcı id'si için değil.

### Görevin

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

### İpuçları

- \`observe\`, \`v > BOUNDS[i]\` olduğu sürece \`BOUNDS\` üzerinde yürür; böylece bir sınıra eşit değer o bucket'ta kalır. Döngüden düşen index, \`500\`'ün üstündeki her şey için \`4\`'tür (\`+Inf\` bucket'ı).
- \`above(100)\`, \`>= 100\` olan ilk sınırı bulur ve ondan sonraki her bucket'ı toplar. Örnekleri saklayıp sıralama — bütün mesele bucket'ların zaten biliyor olması.
- scrape sütunu \`"yes"\` ya da \`"-"\` yazdırır; başlık \`tick  accepted  active  scrape\`, genişlikler \`{:>4}  {:>8}  {:>6}\`.
- Gauge'in adı \`active\` olsun: \`Gauge\` hem \`value\` hem \`peak\` taşır, ve gerçek zirve her tick'te \`if active.value > active.peak { active.peak = active.value; }\` ile tutulur — yalnızca bir scrape'te değil.
`,
  },

  "backend-production-2": {
    instructions: `## Bucket'lardan percentile'lar

Ortalama kesindir: \`_sum / _count\`. Bir quantile değildir — bir rank hesaplar, kümülatif bucket sayılarını onu geçene kadar yürür ve o bucket'ın **üst sınırını** raporlarsın. Sınırların, cevabının çözünürlüğüdür.

Percentile'lar lineer değildir, dolayısıyla instance başına p99'lar ortalanamaz ya da max'lanamaz. **Bucket sayıları toplanabilir**; filo sorgusunun quantile'ı hesaplamadan önce bucket'ları toplamasının sebebi budur.

### Görevin

1. \`count()\`, \`mean()\` ve \`quantile(q)\`'yu implement et — rank \`ceil(q · n)\`, kümülatif sayıları yürü, geçilen bucket'ın üst sınırını döndür (\`+Inf\` için \`f64::INFINITY\`).
2. \`api-1\` ve \`api-2\`'yi starter yorumlarındaki sayılardan kur, sonra \`merged\`'i bucket'ları toplayarak ve sum'ları toplayarak kur.
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

### İpuçları

- Bir \`row(h: &Hist)\` yardımcısı üç satırı da birbirinin aynısı tutar: \`"{:<8} {:>6} {:>9.0} {:>7.1} {:>7.0} {:>7.0} {:>7.0}"\`.
- Bucket tablosunun etiketi \`i == BOUNDS.len()\` olduğunda \`"+Inf"\`, aksi hâlde \`BOUNDS[i].to_string()\`.
- Başlık satırı veri satırlarıyla aynı format string'iyle yazdırılır; isim sütununda \`""\` vardır.
- \`quantile\`'ın içinde yerel bir \`cum\` ile yürü: \`cum += self.counts[i]\`, ve \`cum >= rank\` olur olmaz döndür.
`,
  },

  "backend-production-3": {
    instructions: `## Yapılandırılmış log'lar ve bir correlation ID

\`level=error event=user_load_failed user_id=91 org_id=4 err=timeout\`, sorgulanabilir boyutları olan bir kayıttır. Formatlanmış bir cümle ise ancak regex'leyebileceğin tek bir opak string'tir.

Bir production log'u iç içe geçmiş birçok istektir, dolayısıyla her katmandan taşınan bir request ID, akışı yeniden tek bir hikâyeye çeviren şeydir. \`depth\` ekle, span ağacını elde edersin — ve root eksi children, handler'ın kendi süresidir.

### Görevin

1. \`fn emit(...) -> String\` tek bir satır kurar: iki haneye sıfır doldurulmuş \`seq\`, ardından \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — artı **yalnızca bir end'de** \`dur_ms\`, ve bir end 40 ms'yi aştığında \`level=warn\`.
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

### İpuçları

- \`"seq={:02} level={} req={} span={} depth={} event={}"\`, sonra bir end'de \`" dur_ms={}"\` sonekini \`push_str\` et.
- Ağaç satırı runtime genişlikleri kullanır: \`indent = depth * 2\` ve \`w = 16 - depth * 2\` ile \`"{:indent$}{:<w$}{:>4}ms"\`.
- Children, \`depth == 1\` olan \`end\` event'leridir; root ise \`depth == 0\`. İkisini birden toplama.
- Root'un süresini \`total\`, children'ın toplamını \`child\` olarak bağla; handler'ın kendi işi \`total - child\`.
`,
  },

  "backend-production-4": {
    instructions: `## Backoff, jitter ve bir retry budget

Exponential backoff retry'ları yayar ama onları **senkronize eder**: birlikte başarısız olan client'lar birlikte retry eder. Onları dekorele eden şey full jitter'dır — \`[0, backoff]\` aralığından uniform olarak çekilen bir gecikme; bir cap (üst sınır) ise bir client'ın 17 dakika boyunca bir bağlantı slot'unu tutmasını engeller.

Retry'lar yükü tam da kapasitenin en düşük olduğu anda çarpar. Bir retry budget, amplification'ı (büyütme) istek hacminin bir kesri olarak, client tarafında, hata oranı ne olursa olsun sınırlar.

### Görevin

1. LCG'yi implement et: \`next()\`, \`6364136223846793005\` ile çarpar ve \`1442695040888963407\` ekler (wrapping), \`state >> 33\` döndürür; \`below(n)\` \`next() % n\`'dir, \`n\` \`0\` olduğunda \`0\`.
2. \`0x2545F491\` ile seed'le ve \`0..5\` denemeleri için sınırlanmış backoff'u (\`BASE_MS << attempt\`, \`CAP_MS\`'te sınırlı) bir full-jitter çekiminin yanında yazdır.
3. Budget'sız toplam deneme sayısını say: başarısız olan her çağrı \`MAX_RETRIES\` alır.
4. Budget ile tekrar say: çağrı başına \`BUDGET_PER_CALL\` kazan, retry başına \`RETRY_COST\` öde, ödeyemediğinde reddet. İkisi için de denemeleri, amplification'ı ve granted/denied dağılımını yazdır.

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

### İpuçları

- Jitter'ı \`rng.below(b + 1)\` ile çek ki kapalı aralığın tamamına ulaşılabilsin — 1. denemenin 1 ms göstermesinin sebebi budur.
- \`BASE_MS.saturating_mul(1u64 << attempt)\`, sonra \`CAP_MS\`'e clamp'le.
- Gecikmeyi hesapla; asla uyuma. Ders bilerek deterministik.
- İki politika satırı \`"{:<12} {:>8}  {:>13.2}x {:>8}  {:>6}"\` formatını paylaşır; budget'sız satırın granted sayısı \`naive - CALLS\`.
- Budget bakiyesini yerel bir \`tokens\`'ta tut: çağrı başına \`tokens += BUDGET_PER_CALL\`, ve verdiğin her retry için \`tokens -= RETRY_COST\`.
`,
  },

  "backend-production-5": {
    instructions: `## Bir durum makinesi olarak circuit breaker

**Closed** çağrıları geçirir; bir başarısızlık serisi onu attırır. **Open** hiç çağrı yapmaz — çağıran, 30 saniyelik bir timeout yerine mikrosaniyeler içinde başarısız olur. Bir cooldown'dan sonra **half-open** (yarı açık) tam olarak bir probe kabul eder: başarı kapatır ve seriyi temizler, başarısızlık yeniden açar ve cooldown'ı yeniden başlatır.

Breaker, çağıranın thread'lerini ve bağlantı slot'larını en az bağımlılığı koruduğu kadar korur.

### Görevin

22 tick'in hepsi için \`t\`'yi, girişteki durumu, eylemi, sonucu ve sonraki durumu yazdır.

- **closed** — çağır. \`THRESHOLD\` ardışık başarısızlık onu open'a attırır ve \`opened_at\`'i kaydeder.
- **open** — short-circuit. \`opened_at\`'ten \`COOLDOWN\` tick sonra half-open'a geç.
- **half-open** — bir probe. Başarı kapatır ve seriyi temizler; başarısızlık yeniden açar ve cooldown'ı yeniden başlatır.

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

### İpuçları

- Cooldown geçişini tick'in *başında* uygula, sonra \`before = state\` anlık görüntüsünü al — satır, girişteki ve çıkıştaki durumu yazdırır.
- Sonuç sütunu closed durumundaki bir başarısızlık için \`"fail {}/{}"\`, başarısız bir probe için ise düz \`"fail"\`; o yüzden \`before == State::HalfOpen\` üzerinden dallan.
- \`t.saturating_sub(opened_at) >= COOLDOWN\` t=0'ı güvende tutar.
- Satır formatı: \`"{:<3} {:<10} {:<14} {:<9} {}"\`.
- Başarısızlık serisi yerel bir \`consecutive\`'dir: bir başarısızlık onu artırır ve \`consecutive >= THRESHOLD\` olunca attırır; herhangi bir başarı \`consecutive = 0\` yapar.
`,
  },

  "backend-production-6": {
    instructions: `## Graceful shutdown

Dört faz, sırayla: kabul etmeyi durdur (önce readiness başarısız olur, sonra listener kapanır), uçuşta olanı drain et (boşalt), drain'i bir deadline ile sınırla, kalanı zorla kapat.

SIGTERM'de anında çıkmak uçuştaki her isteği öldürür. Drain yalnızca deadline'da hâlâ çalışanları öldürür — ve deadline orchestrator'ın grace period'unun altında durmalıdır, yoksa önce SIGKILL gelir ve hiç drain olmamış olur.

### Görevin

Her tick: tick'in gelişlerini yalnızca kabul ediyorken içeri al (aksi hâlde bir 503 say), uçuştaki her isteği azalt, 0'a ulaşanları emekli et ve satırı yazdır.

- \`SIGTERM_AT\`'te: kabul etmeyi durdur, readiness'ı \`503\`'e çevir ve kaç tanesinin uçuşta olduğunu kaydet.
- \`in_flight\` boşaldığında (temiz drain) ya da SIGTERM'den beri \`DEADLINE\` tick geçtiğinde dur — sonra kalanı zorla kapat ve id'leri \`{:?}\` ile yazdır.
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

### İpuçları

- \`for t in 0..20u32\` ile döngü kur ve \`break\` ile çık; koşu t=13'te biter.
- Önce azalt, sonra \`in_flight.retain(|r| r.left > 0)\`; \`completed\` uzunluktaki düşüştür.
- \`ARRIVALS.len()\`'in ötesindeki gelişler \`0\`'dır, dolayısıyla t=5'teki iki geliş tek reddedilenlerdir.
- Satır formatı: \`"{:<3} {:<10} {:<6} {:<8} {:<9} {:<10} {}"\`.
- Sinyalin tick'ini \`sigterm_tick\` olarak kaydet; drain \`t - sigterm_tick >= DEADLINE\` olduğunda biter.
`,
  },

  "backend-production-7": {
    instructions: `## Little Yasası

\`L = λ · W\`. L sistemdeki istek sayısı, λ geliş hızı, W ise sistemde geçirilen süredir. Kararlı her sistem için, geliş dağılımı hakkında hiçbir varsayım yapmadan geçerlidir.

Kapasitenin altında latency servis süresidir. Onun ötesinde backlog lineer olarak ve sınırsız büyür, dolayısıyla concurrency limitini sabitleyen şey latency hedefidir: L'yi içeri al, sonrakini anında at.

### Görevin

1. \`capacity()\` \`WORKERS / SERVICE_S\`'tir. \`concurrency(lambda, w_s)\` \`lambda * w_s\`'tir — Little Yasası'nı bir kez yaz ve yeniden kullan.
2. Sunulan her hız için L'yi, kullanım oranını, bir saniyelik aşırı yükten sonraki backlog'u, ortaya çıkan latency'yi (\`SERVICE_S + backlog / capacity()\`) ve \`ok\`, \`at capacity\` ya da \`saturated\` hükmünü yazdır.
3. Mevcut servis süresinde zirveyi karşılamak için gereken worker sayısını yazdır.
4. \`TARGET_MS\`'i bir concurrency limitine çevir, onu serviste ve kuyrukta olarak ayır, ve aşırı yükün kuyruğu doldurmasının ne kadar sürdüğünü yazdır.

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

### İpuçları

- \`concurrency\` **saniye** alır, o yüzden \`TARGET_MS / 1000.0\` geç.
- Kapasitenin altında backlog \`0.0\` ve latency \`SERVICE_S * 1000.0\`'dır; hüküm yalnızca kullanım %100'e ulaştığında \`"at capacity"\` olur.
- Tablo satırı \`"{:>7.0} {:>6.1} {:>6.1} {:>11.0} {:>11.1}  {}"\`.
- 1800 rps'te \`queue_max / overload\` \`48 / 200 = 0.24\` saniyedir.
`,
  },
};
