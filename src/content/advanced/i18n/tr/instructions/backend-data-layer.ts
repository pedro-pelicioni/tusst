// TR · editor instructions — The Data Layer.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-data-layer.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendDataLayerInstructionsTr: Record<string, { instructions: string }> = {
  "backend-data-layer-1": {
    instructions: `## Index Scan vs Seq Scan: incelenen satırlar

Bir B-tree araması bir iniştir — O(log n) — ve ardından leaf seviyesi boyunca bir yürüyüş gelir — O(k). Sequential scan (sıralı tarama) ise predicate (koşul) ne olursa olsun O(n)'dir: 1 satır döndürmek için 1000 satırın hepsini inceler.

"İncelenen satır", \`EXPLAIN ANALYZE\`'ın her node'da \`rows\` olarak raporladığı sayıdır. Onu ekrana bas, asimptotik davranış bir iddia olmaktan çıksın.

### Görevin

1. \`seq_scan(rows: &[Row], lo: u32, hi: u32) -> (Vec<u32>, usize)\` — her satıra dokun, dokunduğun her satırı say, \`id\`'si \`lo..=hi\` aralığına düşenlerin \`amount\` değerini topla.
2. \`index_scan(idx: &BTreeMap<u32, Row>, lo: u32, hi: u32) -> (Vec<u32>, usize)\` — index üzerinde range al ve yalnızca aralığın gerçekten uğradığı girdileri say.
3. \`main\` içinde 1000 satır kur (\`id\` 1..=1000, \`amount = id * 3\`) ve \`id\` üzerinde key'lenmiş bir \`BTreeMap<u32, Row>\` oluştur.
4. İki planı da \`(500, 500)\`, \`(500, 509)\` ve \`(500, 599)\` üzerinde çalıştır, tabloyu bas, sonra iki planın birebir aynı satırları döndürüp döndürmediğini bas.

Beklenen çıktı:

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

### İpuçları

- \`idx.range(lo..=hi)\` tam olarak aralıktaki key'ler için \`(&u32, &Row)\` üretir — geri kalanına uğramaz.
- Başlık ve her satır \`"{:>11}  {:>7}  {:>9}  {:>9}"\` kullanır.
- \`format!("{}..={}", lo, hi)\` aralık etiketini kurar, böylece \`{:>11}\` onu sağa yaslayabilir.
- Sayacı yerel bir \`examined\` içinde tut ve her döngü gövdesinin başında \`examined += 1\` yap — ölçtüğümüz şey planın uğradığı girdi sayısı olduğundan, sayma predicate'ten sonra değil önce olmalı.
`,
  },

  "backend-data-layer-2": {
    instructions: `## Composite index'ler ve leftmost prefix

\`(tenant, status, created)\` üzerindeki bir index, birleştirilmiş tuple'ı key alan, lexicographic sıralı **tek** bir yapıdır. İçerdiği yegâne bitişik aralıklar, bir leftmost prefix'in (en soldan başlayan önek) sabitlediği aralıklardır.

Ortadaki bir boşluk, yapıyı bir prefix seek'i artı bir residual filter'a (artık filtre) düşürür — \`EXPLAIN\`'deki \`Rows Removed by Filter\`. Kullanılabilir prefix'i olmayan bir predicate ise sequential scan yer.

### Görevin

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`; \`created\` aynı zamanda satır id'si görevi görüyor.
2. \`index_scan(idx, lo, hi, keep) -> (usize, usize)\` — \`idx.range(lo..=hi)\` üzerinde yürü, uğradığın her girdiyi ve \`keep\`'in geçirdiği her girdiyi say.
3. \`seq_scan(rows, keep) -> (usize, usize)\` — hiçbir prefix'in karşılayamadığı predicate'ler için her satıra dokun.
4. \`id\` \`1..=1000\` için 1000 satırı \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\` olarak kur ve üstlerine tek bir \`BTreeMap<Key, u32>\` inşa et.
5. Şu beş sorguyu çalıştır — hepsi \`tenant = 3\`, \`status = 1\`, \`created >= 700\` koşuluna karşı — ve her birinin hangi prefix'i kullandığını raporla:

| predicate'ler | seek başlangıcı | seek bitişi | keep |
| --- | --- | --- | --- |
| tenant | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&all\` |
| tenant, status | \`(3, 1, 0)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, status, created | \`(3, 1, 700)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, created | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&late\` |
| status, created | *prefix yok* — \`seq_scan\` | | \`k.1 == 1 && k.2 >= 700\` üzerinde bir closure |

şunlarla: \`let max = u32::MAX;\`, \`let all = \|_k: Key\| true;\` ve \`let late = \|k: Key\| k.2 >= 700;\`. Dördüncü satır ortadaki boşluktur: seek yalnızca \`tenant\`'ı sabitleyebilir, gerisini \`late\` filtreler.

Beklenen çıktı:

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

### İpuçları

- Bir prefix seek'inin üst sınırı, kısıtlanmamış sütunları \`u32::MAX\` ile doldurur.
- \`keep\` bir \`&dyn Fn(Key) -> bool\`'dur; seek tamsa \`&all\`, işi bir residual filter yapıyorsa \`&late\` geç.
- \`report\` \`"{:<24}{:<26}{:>9}{:>9}"\` kullanır, başlık da öyle.
`,
  },

  "backend-data-layer-3": {
    instructions: `## EXPLAIN'in arkasındaki maliyet modeli

Planner (plan seçici) planları sıralar ve her birini dört sabitten kurulmuş keyfi birimlerle fiyatlandırır — \`seq_page_cost\`, \`random_page_cost\`, \`cpu_tuple_cost\`, \`cpu_index_tuple_cost\`. Seq scan sabit bir fiyattır; index scan eşleşen satır başına bir fiyattır. Kesişirler ve planner düşük olanı alır.

Buradaki sabitler tam sayıya ölçeklenmiştir ki hiçbir şey float'a bağlı olmasın.

### Görevin

1. \`seq_cost() -> u64\` — \`SEQ_PAGE_COST\` ile \`ROWS / ROWS_PER_PAGE\` page, artı \`ROWS * CPU_TUPLE_COST\`.
2. \`index_cost(matched: u64) -> u64\` — inmek için \`INDEX_DEPTH\` kadar rastgele fetch, sonra eşleşen satır başına bir rastgele page fetch'i artı \`CPU_TUPLE_COST + CPU_INDEX_COST\`.
3. \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` içindeki her ppm (milyonda parça) selectivity için \`matched\`'i türet, iki planı da fiyatlandır ve planner'ın seçeceği planı bas.
4. \`index_cost(m) >= seq_cost()\` olana dek \`m\`'i yukarı doğru tarayarak crossover'ı bul. Sabit yazma.

Beklenen çıktı:

\`\`\`text
selectivity  matched   seq cost  index cost  plan
     0.010%       10     150000        5220  Index Scan
     0.100%      100     150000       41400  Index Scan
     0.300%      300     150000      121800  Index Scan
     0.500%      500     150000      202200  Seq Scan
     1.000%     1000     150000      403200  Seq Scan
    10.000%    10000     150000     4021200  Seq Scan
crossover: seq scan wins from 371 rows (0.371%)
\`\`\`

### İpuçları

- \`matched = ROWS * ppm / 1_000_000\`, tam bu sırayla — önce bölersen küçük selectivity'leri kaybedersin.
- Başlık ve satırlar aynı \`"{:>11}{:>9}{:>11}{:>12}  {}"\` formatını paylaşır.
- Crossover satırının etiketi \`selectivity_label(crossover * 1_000_000 / ROWS)\`'tur.
- İki fiyatı satır başına \`seq\` ve \`idx\` olarak bağla; plan \`if idx < seq { "Index Scan" } else { "Seq Scan" }\`'dir, yani beraberlikte seq scan kazanır.
`,
  },

  "backend-data-layer-4": {
    instructions: `## Cursor pagination vs OFFSET

\`LIMIT 20 OFFSET 4980\` seek etmez. Sunucu satırları sırayla üretir ve ilk 4980'ini atar. Sıralama sütunundaki bir index sort'u kaldırır, skip'i değil.

Keyset cursor'ı son satırın sort key'idir; "sonraki sayfa"yı index'in seek edebileceği bir predicate'e çevirir — hangi derinlikte olursa olsun O(log n + limit).

### Görevin

1. \`offset_page(rows: &[u32], offset: usize, limit: usize) -> (Vec<u32>, usize)\` — baştan oku ve okunan **her** satırı say, offset'in attıkları dahil.
2. \`cursor_page(idx: &BTreeMap<u32, u32>, after: u32, limit: usize) -> (Vec<u32>, usize)\` — \`after\`'ın kesinlikle ötesine seek et ve tam olarak \`limit\` satır oku.
3. 5000 satır, \`PAGE = 20\`. Sayfa 1, 10, 50 ve 250'yi karşılaştır, her yaklaşım için okunan satırları bas ve ikisinin birebir aynı sayfaları döndürüp döndürmediğini izle.
4. Sonra 250 sayfanın hepsini iki yöntemle de tara ve iki toplamı bas.

Beklenen çıktı:

\`\`\`text
 page  first id  offset rows read  cursor rows read
    1         1                20                20
   10       181               200                20
   50       981              1000                20
  250      4981              5000                20
full crawl of 250 pages: offset reads 627500, cursor reads 5000
same rows on every page: true
\`\`\`

### İpuçları

- Seek şudur: \`idx.range((Bound::Excluded(after), Bound::Unbounded))\`. \`Bound::Included\` önceki sayfanın son satırını yeniden döndürür.
- Sayfa 1'in cursor'ı \`0\`'dır; tablodaki her id'nin altındadır.
- Tablo \`"{:>5}{:>10}{:>18}{:>18}"\` kullanır.
- Yerel bir \`read\`'e say: satır başına \`read += 1\`. \`.skip(offset)\` kullanıp sonradan \`offset\`'i geri eklemeye **kalkışma**: bütün mesele atılan satırların teker teker üretilmesi ve bir iterator adaptörü, dersin ölçtüğü maliyetin ta kendisini gizliyor.
`,
  },

  "backend-data-layer-5": {
    instructions: `## Isolation level'ları ve izin verdikleri anomaliler

Her anomali, bir yeniden okumanın ne gördüğüyle tanımlanır. **Dirty read** commit edilmemiş bir yazmayı görür. **Non-repeatable read** iki okuma arasında bir satırın değiştiğini görür. **Phantom read** iki range sorgusu arasında *kümenin* değiştiğini görür.

ANSI level'ları bunlardan hangilerini yasakladıklarıyla tanımlanır. Read Committed statement başına bir snapshot alır; Repeatable Read transaction başına bir tane alır.

### Görevin

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — tek fonksiyon, dört kural. \`ReadUncommitted\` \`pending\`'i \`committed\`'ın üstüne bindirir; \`ReadCommitted\` \`committed\`'ı döndürür; \`RepeatableRead\` snapshot'ı artı onda bulunmayan commit'li satırları döndürür; \`Serializable\` yalnızca snapshot'ı döndürür.
2. \`read(level, store, snapshot, key) -> i64\` görünür kümeden tek bir key seçer (yoksa \`0\`).
3. \`count_at_least(level, store, snapshot, min) -> usize\` görünür küme üzerinde bir range sorgusu çalıştırır.
4. Üç aşamayı trace et: key 1'e \`200\` değerinin **pending** yazması, sonra o yazmanın **commit** edilmesi, sonra yeni bir \`(3, 100)\` satırının insert'i. Her level'ın her aşamadaki okumalarını kaydet.
5. Okumaları bas, sonra anomali tablosunu onlardan **türet** — dirty read \`read #1 == 200\`, non-repeatable read \`read #2 != 100\`, phantom ise \`rows >= 100\` değerinin \`2\`'ye eşit olmamasıdır.

Beklenen çıktı:

\`\`\`text
level                 read #1  read #2  rows >= 100
read uncommitted          200      200            3
read committed            100      200            3
repeatable read           100      100            3
serializable              100      100            2

anomaly                RU    RC    RR   SER
dirty read            yes    no    no    no
non-repeatable read   yes   yes    no    no
phantom read          yes   yes   yes    no
\`\`\`

### İpuçları

- Snapshot \`vec![(1, 100), (2, 100)]\`'dür ve hiç değişmez.
- İlginç kural Repeatable Read'inki: snapshot'ın *değerlerini* korur ama onda var olmayan satırları yine de görür; phantom'ı gösterip non-repeatable read'i göstermemesinin sebebi budur.
- İlk tablo için \`"{:<20}{:>9}{:>9}{:>13}"\`, ikincisi için \`"{:<20}{:>5}{:>6}{:>6}{:>6}"\` ve aralarında çıplak bir \`println!();\`.
`,
  },

  "backend-data-layer-6": {
    instructions: `## Transaction'lar, rollback ve prepared statement'lar

Transaction, bir yazma buffer'ı artı bir atomiklik kuralıdır: içinde okumalar kendi commit edilmemiş yazmalarını görür; dışında \`COMMIT\` olana dek hiçbir şey görmez. Dolayısıyla \`ROLLBACK\` hiçbir şeyi geri almaz — zaten hiç uygulanmamış bir buffer'ı atar.

Prepared statement, sunucu tarafındaki parse ve plan state'idir; isimlendirilir ve tekrar kullanılır. \`EXECUTE\` SQL metni değil, değer gönderir.

### Görevin

1. \`Db\`; \`rows\`, bir \`plans\` vektörü ve bir \`executions\` sayacı tutar. \`prepare(sql)\`, tam olarak o metin zaten derlenmişse mevcut handle'ı döndürür, aksi hâlde push edip yeni index'i döndürür. \`execute(plan)\` yalnızca \`executions\`'ı artırır.
2. \`Txn\` yazmaları bir \`BTreeMap<u32, i64>\` içinde buffer'lar. \`get\` önce buffer'dan okur, sonra store'a düşer; \`set\` buffer'lar; \`commit\` buffer'lanmış her yazmayı \`db.rows\`'a uygular; \`rollback\` buffer'ı atar.
3. \`transfer(db, plan, from, to, amount)\` — \`from\`'u borçlandır, \`to\`'yu alacaklandır (her biri için \`execute\` çağırarak), sonra \`from\`'u yeniden oku. Negatife düştüyse rollback yap ve \`Err(format!("CHECK balance >= 0 violated: {}", after))\` döndür. Aksi hâlde commit et.
4. \`a = 100\`, \`b = 50\` ile aç. \`30\` transfer et (commit eder), sonra aynı SQL'i tekrar \`prepare\` et ve \`500\` transfer et (kontrolü ihlal eder). Snapshot'ları ve plan istatistiklerini bas.

Beklenen çıktı:

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

### İpuçları

- \`self.plans.iter().position(|p| *p == sql)\` zaten derlenmiş bir planı bulur.
- \`commit(self, db)\` \`self\`'i değer olarak alır, dolayısıyla buffer sonrasında kullanılamaz — yaşam döngüsünü dayatan şey tip sistemidir.
- \`-430\`, \`70 - 500\`'dür: borçlandırma kontrol çalışmadan önce buffer'lanır, kontrolü anlamlı kılan da budur.
`,
  },

  "backend-data-layer-7": {
    instructions: `## Connection pool'ları ve latency'nin gittiği yer

Pool, sabit bir slot sayısı artı bir kuyruktur. Client'ın gözlemlediği latency **kuyruk beklemesi + sorgu süresidir**; veritabanının hızlı bir sorgu raporlarken client'ın yavaş bir istek görmesinin sebebi budur — iki sayı farklı aralıkları ölçüyor.

Veritabanının işe yarar concurrency'sinin ötesinde fazladan slot'lar throughput eklemez; kuyruğu veritabanının içine taşırlar ve orada çekişmeye dönüşür.

### Görevin

1. \`service_times() -> Vec<u32>\` — deterministik bir LCG. \`seed\` \`1\`'den başlar; her adımda \`seed = (seed * 1103515245 + 12345) % 2147483648\` ve servis süresi \`5 + (seed >> 16) % 21\`'dir. Bunlardan \`REQUESTS\` kadar üret.
2. \`simulate(capacity, service) -> (u32, u32, usize, u32)\` — istek \`i\`, \`i * ARRIVAL_GAP\` anında gelir ve en erken boşalan slot'u alır. \`(max wait, mean wait, checkout timeout sayısı, makespan)\` döndür; \`CHECKOUT_TIMEOUT\`'un üstündeki bir bekleme timeout sayılır.
3. Servis sürelerini ve toplam veritabanı işini bas, sonra \`[1, 2, 4, 8, 16]\` içindeki her kapasite için bir satır.

Beklenen çıktı:

\`\`\`text
service times (ms): [22, 9, 17, 6, 18, 25, 20, 11, 5, 17, 24, 25, 17, 11, 16, 13]
total db work: 256 ms over 16 requests

 capacity  max wait  mean wait  timeouts  makespan
        1       198         96        11       256
        2        74         34         4       132
        4        17          5         0        75
        8         0          0         0        58
       16         0          0         0        58
\`\`\`

### İpuçları

- \`u64\` bir seed üzerinde \`wrapping_mul\` / \`wrapping_add\` kullan ki çarpma \`-D warnings\` altında overflow edemesin.
- \`free_at\` \`vec![0u32; capacity]\`'dir; bir istek \`max(free_at[slot], arrival)\` anında başlar ve beklemesi \`start - arrival\`'dır.
- Ortalama bekleme tam sayı bölmesidir: \`total_wait / REQUESTS as u32\`.
- Burada hiçbir şey saate dokunmuyor. Simülasyon deterministik olmak zorunda.
`,
  },
};
