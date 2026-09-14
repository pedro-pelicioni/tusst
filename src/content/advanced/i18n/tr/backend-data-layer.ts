import type { LessonStep } from "@/content/steps";

// TR · The Data Layer.
//
// Overlay for ../../steps/backend-data-layer.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendDataLayerStepsTr: Record<string, LessonStep[]> = {
  "backend-data-layer-1": [
    {
      kind: "theory",
      body: `B-tree index'i sıralı bir yapıdır. Bir key aramak, iç node'lar boyunca bir **iniş** — O(log n) — ve ardından predicate (koşul) geçerli olduğu sürece zincirli leaf seviyesi boyunca bir **sıralı yürüyüş** — O(k); burada k, döndürülen satır sayısıdır. Toplam: O(log n + k).

Sequential scan (sıralı tarama) predicate ne olursa olsun O(n)'dir. Binde bir satırı döndürmek için bin satırın hepsini okur ve 999'unu atar.

\`\`\`text
seq scan     id BETWEEN 500 AND 500   →  1000 satır incelendi, 1 döndürüldü
index scan   id BETWEEN 500 AND 500   →     1 satır incelendi, 1 döndürüldü
\`\`\`

"İncelenen satır" bir söz sanatı değil. Planner'ın (plan seçici) bütçelediği sayıdır; \`EXPLAIN ANALYZE\`'ın her node'da \`rows\` olarak bastığı sayının ta kendisi. Bu ders de onu ekrana basıyor, böylece asimptotik davranış güvenine sığınman gereken bir iddia olmaktan çıkıyor.`,
    },
    {
      kind: "theory",
      body: `Defterin diğer sütunu.

Index, key sütunlarının **ikinci, sıralı bir kopyası** artı satıra giden bir pointer'dır. Her \`INSERT\`, her \`DELETE\` ve indexli bir sütuna dokunan her \`UPDATE\` onu da yazmak zorundadır. Sıcak bir tablodaki üç index, write amplification'ı (yazma büyütmesi) ve ardından replication ile backup'ın taşıması gereken WAL hacmini kabaca üçe katlar.

Ucuz olması için bellekte resident kalması da gerekir. Kimsenin üstünde filtrelemediği, join etmediği, sıralamadığı bir index saf maliyettir: her yazmada ödenir, sonsuza kadar.

Üstelik index okumada da her zaman kazanmaz. Maliyeti **eşleşen satır sayısıyla orantılıdır** ve gerçek bir motorda eşleşen her satır rastgele bir page fetch olabilir. %50 selectivity'de (seçicilik) sequential scan düpedüz daha ucuzdur, planner da bunu bilir. Ders 3 iki eğrinin tam olarak nerede kesiştiğini hesaplıyor; şimdilik bir crossover'ın (kesişim noktası) var olduğunu aklında tut.`,
    },
    {
      kind: "quiz",
      question:
        "10 milyon satırlık bir tabloda çalışan bir sorgu bunların 6 milyonuyla eşleşiyor. Predicate sütununda bir B-tree index'i var. Planner neden yine de sequential scan seçebilir?",
      options: [
        "Index scan'in maliyeti eşleşen satırla birlikte büyür; bir crossover'dan sonra seq scan'in sabit maliyetini aşar",
        "B-tree index'lerine yalnızca eşitlik predicate'lerinde bakılır, range'lerde asla",
        "Index ancak tablo planner'ın boyut eşiğini aştıktan sonra kullanılır",
      ],
      answer: 0,
      explain:
        "Index, *seçici* bir sorguyu hızlandırır. Seq scan tablonun tamamı için sabit bir bedel öder; index ise eşleşen satır başına, üstelik her seferinde bir rastgele fetch'le birlikte öder. Altı milyon eşleşen satır, sabit bedelin kelepir olduğu noktanın çok ötesindedir.",
    },
    {
      kind: "fill",
      prompt:
        "Index scan bütün index'i baştan sona yürümek yerine key aralığına seek etsin.",
      file: "main.rs",
      before: "for (_key, r) in ",
      after: " {",
      choices: [
        "idx.range(lo..=hi)",
        "idx.iter().filter(|(k, _)| **k >= lo && **k <= hi)",
        "idx.values().take((hi - lo + 1) as usize)",
      ],
      answer: 0,
      explain:
        "filter'lı sürüm aynı satırları döndürür ve cazip olan da odur — ama bunu yapmak için 1000 girdinin hepsini inceler; yani index adı takılmış bir sequential scan'dir. `take` doğru *sayıda* satırı yanlış *yerden* okur: aralıktakileri değil, ilk k girdiyi.",
    },
    {
      kind: "quiz",
      question:
        "Okuma ağırlıklı bir tabloya dördüncü bir index ekleniyor. Kabul ettiğin maliyet nedir?",
      options: [
        "O tabloya yapılan her yazma artık dördüncü bir sıralı yapıyı da bakımda tutar ve WAL bunu taşır",
        "Kayda değer bir şey yok — yükü okumalar domine ediyor, dolayısıyla bakım maliyeti amorti olur",
        "Yalnızca disk alanı; index bakımı arka planda, checkpoint anında yapılır",
      ],
      answer: 0,
      explain:
        "Bakım *yazma* başınadır, okuma başına değil; yani yüksek bir okuma:yazma oranı onu amorti etmez — sadece maliyetin daha az sayıda statement'a yıkıldığı anlamına gelir. O statement'lar da genellikle latency'ye duyarlı olanlardır.",
    },
    {
      kind: "editor",
      intro: `### Her planın incelediği satırları say

1. \`seq_scan(rows, lo, hi) -> (Vec<u32>, usize)\` — her satıra dokun, dokunduğun her satırı say, \`id\`'si aralıkta olanların \`amount\` değerini topla.
2. \`index_scan(idx, lo, hi) -> (Vec<u32>, usize)\` — \`idx.range(lo..=hi)\` kullan ve yalnızca aralığın gerçekten uğradığı girdileri say.
3. 1000 satır kur (\`id\` 1..=1000, \`amount = id * 3\`) ve üstüne bir \`BTreeMap<u32, Row>\` index'i inşa et.
4. İki planı da \`500..=500\`, \`500..=509\` ve \`500..=599\` üzerinde çalıştır, tabloyu bas, sonra iki planın da birebir aynı satırları döndürdüğünü doğrula.

Beklenen çıktı:

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

Aynı cevap, yapılan işte üç büyüklük mertebesi fark.`,
    },
  ],

  "backend-data-layer-2": [
    {
      kind: "theory",
      body: `\`(tenant, status, created)\` üzerindeki bir index, birleştirilmiş tuple'ı key alan **tek** bir sıralı yapıdır. Üç index değildir ve sütunları açısından simetrik de değildir.

Sıralama lexicographic'tir. Dolayısıyla yapının içerdiği yegâne bitişik key aralıkları, bir **leftmost prefix**'in (en soldan başlayan önek) sabitlediği aralıklardır:

\`\`\`text
(tenant)                     ✓ bitişik
(tenant, status)             ✓ bitişik
(tenant, status, created)    ✓ bitişik
(status)                     ✗ prefix değil
(created)                    ✗ prefix değil
(status, created)            ✗ prefix değil
\`\`\`

Tek başına \`status\` üzerindeki bir predicate hiçbir bitişik aralığı adlandırmaz — eşleşen girdiler, tenant başına bir kez olmak üzere index'in her yerine saçılmıştır. Seek edilecek bir yer yoktur, planner da tablonun sequential scan'ine geri düşer.`,
    },
    {
      kind: "theory",
      body: `Bir composite index'in tam seek'in gerisine düşmesinin iki yolu var.

**Ortada bir boşluk.** \`status\` olmadan \`tenant\` ve \`created\`, \`tenant\` üzerinde bir prefix seek'i artı bulduğu her şeye uygulanan bir **residual filter** (artık filtre) verir: o tenant'ın her satırını inceler ve yalnızca diğer koşullara da uyanları döndürür. İncelenen ile eşleşen arasındaki fark tam olarak \`EXPLAIN ANALYZE\`'daki \`Rows Removed by Filter\`'dır ve latency'nin saklandığı yer orasıdır — alıştırma 30 eşleşme için 100 inceleme basıyor.

**Range'i fazla erken kullanmak.** Seek'te kullanılan yalnızca *son* sütun bir range olabilir. \`status\` üzerinde bir range, \`created\`'i seek key'i olmaktan çıkarıp filtreye çevirir. Kural buradan gelir: önce eşitlik sütunları, en sonda range sütunu.

**Covering index.** Index, sorgunun okuduğu her sütunu taşıyorsa heap'e hiç dokunulmaz — index-only scan.

Aynı takas bir seviye yukarıda, şemada da var. Denormalize bir sütun, sonradan indexleyebileceğin materyalize edilmiş bir join'dir: okuma maliyetini write amplification ve update anomalisi ihtimaliyle satın alırsın. Index'in yaptığı pazarlığın aynısı, başka bir granülerlikte.`,
    },
    {
      kind: "quiz",
      question:
        "`(tenant, status, created)` üzerinde tek bir index varken hangi sorgu bunun bitişik bir aralığına seek edebilir?",
      options: [
        "`WHERE tenant = 3 AND status = 1` — bir leftmost prefix",
        "`WHERE status = 1 AND created > 700` — iki sütun da index'te, dolayısıyla index bunu karşılayabilir",
        "`WHERE created > 700` — range sütunu indexli, dolayısıyla aralık bitişiktir",
      ],
      answer: 0,
      explain:
        "Ölçüt index'te yer almak değil; konumdur. `status = 1` girdileri yalnızca bir tenant'ın *içinde* bitişiktir, dolayısıyla `tenant` predicate'i olmadan yapının her yerine saçılırlar. `(status, created)`'ı karşılamak, kendi yazma maliyetiyle birlikte ikinci bir index ister.",
    },
    {
      kind: "fill",
      prompt:
        "Doğrudan `tenant = 3, status = 1, created >= 700`'ün başlangıcına seek et.",
      file: "main.rs",
      before: "let (e, m) = index_scan(&idx, ",
      after: ", (3, 1, max), &all);",
      choices: ["(3, 1, 700)", "(3, 700, 1)", "(0, 0, 700)"],
      answer: 0,
      explain:
        "Key, predicate'lerin yazıldığı sıraya göre değil, index sırasına göre bir tuple'dır — `(tenant, status, created)`. `(0, 0, 700)` ise bir başlangıç key'inin yalnızca range sütununu kısıtlayabileceği inancıdır; index'in en başına seek eder ve her şeyi okur.",
    },
    {
      kind: "quiz",
      question:
        "`EXPLAIN ANALYZE`, `rows=30` ve `Rows Removed by Filter: 70` olan bir Index Scan gösteriyor. Ne oldu?",
      options: [
        "Index bir prefix'e seek etti, sonra bir residual filter incelediği 100 satırın 70'ini attı",
        "Index 30 satır döndürdü ve executor scan'in ürettiği 70 tekrarı attı",
        "70 satır sonraki bir join tarafından elendi; index tam olarak döndürdüğü 30 satırı inceledi",
      ],
      answer: 0,
      explain:
        "Seek *eksiksiz* bir prefix kullandığında index scan yalnızca döndürdüğü kadarını inceler. Ortada boşluk varsa prefix aralığının tamamını inceler ve filtreler. O satır, eksik sütunun maliyetinin sayıya dökülmüş hâlidir — ve index'in yalnızca döndürdüğüne dokunduğu yolundaki derli toplu inanç, insanlara bunu yanlış okutan şeydir.",
    },
    {
      kind: "editor",
      intro: `### Leftmost-prefix kuralını kanıtla

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`; \`created\` aynı zamanda satır id'si görevi görüyor.
2. \`index_scan(idx, lo, hi, keep) -> (examined, matched)\` — \`idx.range(lo..=hi)\` üzerinde yürü, uğradığın her girdiyi ve \`keep\`'in geçirdiği her girdiyi say.
3. \`seq_scan(rows, keep) -> (examined, matched)\` — hiçbir prefix'in karşılayamadığı predicate'ler için.
4. 1000 satır kur: \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\` ve üstlerine tek bir \`BTreeMap<Key, u32>\`.
5. Beş sorguyu çalıştır ve her birinin hangi prefix'i kullandığını bas.

Beklenen çıktı:

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

Dördüncü satır residual filter'dır. Beşinci satır ise eksik bir prefix'in gerçekte neye mal olduğudur.`,
    },
  ],

  "backend-data-layer-3": [
    {
      kind: "theory",
      body: `Planner milisaniyeden anlamaz. Aday planları sıralar ve her birini, bir avuç sabitten kurulmuş keyfi birimlerle fiyatlandırır:

\`\`\`text
seq_page_cost           1.0     sıralı okunan bir page
random_page_cost        4.0     rastgele fetch edilen bir page
cpu_tuple_cost          0.01    bir satırı işlemek
cpu_index_tuple_cost    0.005   bir index girdisini işlemek
\`\`\`

**Seq scan** = \`pages x seq_page_cost + rows x cpu_tuple_cost\`. Kaç satırın eşleştiğinden bağımsız, sabit bir fiyat.

**Index scan** = iniş + \`matched x (random_page_cost + cpu maliyetleri)\`. Eşleşen satır başına bir fiyat.

Biri düz, diğerinin eğimi var. Kesişirler ve planner, tahmini satır sayısında hangisi düşükse onu seçer. Plan seçiminin tamamı budur. \`EXPLAIN\`'deki \`cost=X..Y\` tam olarak bu sayılardır: önce startup cost, sonra total cost.

Bunlar Postgres'in kutudan çıkan varsayılanları. Alıştırma aynı birimlerle ama 100 ile çarpılmış hâlde çalışıyor ki hiçbir şey float'a bağlı olmasın; \`cpu_index_tuple_cost\`'u da bir birime yukarı yuvarlıyor — toplamdaki en küçük terim o ve crossover'ı yüz binde iki satırdan az kaydırıyor.`,
    },
    {
      kind: "theory",
      body: `Yukarıdaki her şey, planner'ın tahmin etmek zorunda olduğu tek bir girdiye bağlı: **kaç satır eşleşecek**.

Selectivity istatistiklerden gelir — \`n_distinct\`, en sık görülen değerler listesi ve histogram; hepsi \`ANALYZE\` tarafından toplanır. Plan, ancak o tahmin kadar iyidir.

Klasik production arızası bayat ya da eksik bir istatistiktir. Planner 10 satır tahmin eder, 200.000 alır ve hash join olması gereken yerde nested loop'ta ısrar eder. Bu yüzden \`EXPLAIN ANALYZE\` okurken **ilk iş** tahmini \`rows\` ile gerçek \`rows\`'u karşılaştır: oradaki 1000x'lik uçurum bug'ın kendisidir, plan yalnızca semptomu.

Crossover da sezginin söylediğinden çok daha erken gelir. Varsayılan sabitlerle index, tablonun %1'inin epey altında kaybeder. "Index kullanılmıyor" neredeyse her zaman "predicate yeterince seçici değil" demektir.

**Partitioning** formülü değil aritmetiği değiştirir: partition key'i üzerindeki bir predicate, maliyetlendirme öncesinde partition'ların tamamını eler (partition pruning), böylece planner daha küçük bir tabloyu fiyatlandırır. **Sharding** aynı kesiğin makineler arasına atılmış hâlidir — tek farkla: shard'lar arasında senin yerine plan yapan kimse yoktur. Fan-out da merge de senin uygulamanın kodudur.`,
    },
    {
      kind: "quiz",
      question:
        "Index kullanması gereken bir sorgu seq scan yapıyor. Hangi hamle gerçek nedeni hedefler?",
      options: [
        "`EXPLAIN ANALYZE`'da tahmini ve gerçek satırları karşılaştır, sonra tahmini ya da predicate'in selectivity'sini düzelt",
        "Tabloyu `REINDEX` et — index bozulmuş ve planner artık ona güvenmiyor",
        "Aynı sütunda ikinci bir index yarat ki planner'ın fiyatlandıracağı bir alternatifi olsun",
      ],
      answer: 0,
      explain:
        "Planner index'i gözden kaçırmadı; fiyatlandırdı ve pahalı buldu. Kopya bir index de aynı fiyatı alır. `REINDEX` bloat'u düzeltir — gerçek bir sorundur ama bu değildir. Kol demiri ya satır tahminidir (`ANALYZE`, extended statistics) ya da predicate'in kendisi.",
    },
    {
      kind: "fill",
      prompt:
        "Bir index scan'in eşleşen tek satırını fiyatlandır: page fetch'i sıralı değil, rastgeledir.",
      file: "main.rs",
      before: "    INDEX_DEPTH * RANDOM_PAGE_COST\n        + matched * (",
      after: ")",
      choices: [
        "RANDOM_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "SEQ_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "CPU_TUPLE_COST + CPU_INDEX_COST",
      ],
      answer: 0,
      explain:
        "Index sırası heap sırası değildir, dolayısıyla eşleşen her satır rastgele bir page'e gidilen bir fetch'tir — bir crossover'ın var olmasının tüm sebebi o 4x'tir. `seq_page_cost` yazmak crossover'ı dört katına iterdi; hiç page maliyeti yazmamak ise index'in hep kazandığı anlamına gelirdi ki sayıların çürüttüğü inanç tam olarak budur.",
    },
    {
      kind: "quiz",
      question:
        "Veritabanı NVMe üzerinde koşuyor. `random_page_cost`'u 4.0'tan 1.1'e düşürmek gerçekte ne yapar?",
      options: [
        "Veritabanındaki her sorgunun crossover noktasını kaydırır, planları topyekûn index scan'lere doğru iter",
        "Ölçülebilir hiçbir şey — operatörlere donanımı tarif eden bir dokümantasyon ayarıdır",
        "Yalnızca bitmap heap scan'lerde geçerlidir; orada rastgele fetch'ler zaten page sırasına dizilmiştir",
      ],
      answer: 0,
      explain:
        "Crossover'ı belirleyen şey `random_page_cost` ile `seq_page_cost` arasındaki orandır. Onu değiştirmek, planner'ın bundan sonra düşüneceği her index scan'i yeniden fiyatlandırır — sistemdeki en yüksek kaldıraçlı ayarlardan biri ve en sık dönen disklere göre ayarlanmış değerde unutulanı.",
    },
    {
      kind: "editor",
      intro: `### İki planı da fiyatlandır ve crossover'ı bul

1. \`seq_cost() -> u64\` — sıralı okunan page'ler, artı satır başına bir CPU maliyeti.
2. \`index_cost(matched: u64) -> u64\` — inmek için \`INDEX_DEPTH\` kadar rastgele fetch, sonra eşleşen satır başına bir rastgele page fetch'i artı CPU maliyetleri.
3. \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` içindeki her ppm (milyonda parça) selectivity için \`matched = ROWS * ppm / 1_000_000\` türet, iki planı da fiyatlandır ve planner'ın seçeceğini bas.
4. Sonra \`index_cost(m) >= seq_cost()\` olana dek \`m\`'i yukarı doğru tarayarak crossover'ı **bul** — sabit yazma.

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

100.000 satırın 371'i. "Index kullanılmıyor" tam da orada başlıyor.`,
    },
  ],

  "backend-data-layer-4": [
    {
      kind: "theory",
      body: `\`LIMIT 20 OFFSET 4980\` hiçbir yere atlamaz. Sunucu satırları sırayla üretir, ilk 4980'ini atar ve sonraki 20'yi döndürür. Maliyet O(offset + limit)'tir — sayfa 250, sayfa 1'in 250 katına mal olur.

Sıralama sütunundaki bir index **sort**'u kaldırır, **skip**'i değil. Satırlar zaten sıralı gelir ve yine de teker teker üretilip çöpe atılır.

\`\`\`text
sayfa   1   →   20 satır okundu,  20 döndürüldü
sayfa  10   →  200 satır okundu,  20 döndürüldü
sayfa 250   → 5000 satır okundu,  20 döndürüldü
\`\`\`

Asıl önemli sayı tüm taramanın toplamıdır, çünkü arka plandaki bir export ya da sonsuz kaydıran bir client gerçekte bunu yapar: 250 sayfa, \`OFFSET\` ile 627.500 satır okuması, cursor ile 5.000 satır okuması demektir.`,
    },
    {
      kind: "theory",
      body: `**Cursor**, son satırın sort key'idir. Sonraki sayfa şudur:

\`\`\`sql
WHERE (created_at, id) > ($1, $2)
ORDER BY created_at, id
LIMIT 20
\`\`\`

Bu, index'in seek edebileceği bir predicate'tir; dolayısıyla her sayfa, ne kadar derinde olursa olsun O(log n + limit)'e mal olur.

Tek bir şartı var: **tam sıralama**. Tek başına \`ORDER BY created_at\` tam sıralama değildir — eşitlikler satırların iki sayfada birden ya da hiçbir sayfada görünmesine yol açar. Benzersiz bir tiebreak ekle (primary key) ve tuple olarak karşılaştır.

Bu bir hız düzeltmesi olduğu kadar bir doğruluk düzeltmesidir. Insert alan bir tabloda \`OFFSET\` sayfa çekimleri arasında sessizce satır atlar ve satır tekrarlar, çünkü offset altından değişmiş bir sonuç kümesine göre ölçülür. Cursor bir satıra çapalıdır, bunu yapamaz. *RPC Services at Scale*, ders 7 bir client'ın bu şekilde kaybettiği satırları sayıyor; burada ölçülen şey maliyet.

Takas dürüst: bir cursor sayfa 47'ye atlayamaz ve sayfa sayısı gösteremez. UI büyük bir tablo üzerinde numaralı sayfalara ihtiyaç duyuyorsa bu, fiyat etiketi olan bir ürün kararıdır.

Shard'lar arasında fan-out'u karşılanabilir kılan şey cursor'dır — her shard kendi cursor'ına seek eder ve merge için \`limit\` kadar satır döndürür. \`OFFSET\` ile her shard \`offset + limit\` satır üretip neredeyse hepsini atmak zorundadır.`,
    },
    {
      kind: "quiz",
      question:
        "`ORDER BY` sütunu indexli ve sayfalanmış bir export'un 900. sayfası hâlâ timeout alıyor. Neden?",
      options: [
        "Index sıralamayı sağlıyor ama skip'i değil — öncesindeki 18.000 satır hâlâ üretilip atılıyor",
        "Index `LIMIT` ile kullanılamaz, dolayısıyla planner bir sort'a geri düşer",
        "Sonuç kümesi artık `work_mem`'e sığmıyor, dolayısıyla sort diske taşıyor",
      ],
      answer: 0,
      explain:
        "Bu, staging'de hızlı çalışan — çünkü orada hep sayfa 1'e bakarsın — ve production'da sayfa 900'de timeout veren bir sorguyu sahaya süren inançtır. Index sort'u kaldırdı. Skip'i kaldıran olmadı.",
    },
    {
      kind: "fill",
      prompt:
        "Önceki sayfanın döndürdüğü son id'den kesinlikle sonraki ilk satıra seek et.",
      file: "main.rs",
      before: "for (id, _) in idx.range((",
      after: ", Bound::Unbounded)) {",
      choices: [
        "Bound::Excluded(after)",
        "Bound::Included(after)",
        "Bound::Unbounded",
      ],
      answer: 0,
      explain:
        "`Included` her sayfada önceki sayfanın son satırını yeniden döndürür — klasik keyset off-by-one'ı ve biri sayana kadar doğru görünen türden. `Unbounded` her seferinde baştan başlar, yani sonsuza kadar `OFFSET 0`.",
    },
    {
      kind: "quiz",
      question: "Bir keyset cursor'ı `OFFSET`'ten neden daha hızlı yapar?",
      options: [
        "Son satırın sort key'ini taşır, böylece index'in seek edebileceği bir `WHERE` predicate'ine dönüşür",
        "Kodlanmış bir offset'tir ve sunucu tarafında çözülmesi sorgunun yeniden parse edilmesini önler",
        "Önceki sayfanın sonuç kümesini sunucuda cache'ler, böylece sonraki sayfa oradan devam eder",
      ],
      answer: 0,
      explain:
        "Kodlama ambalajdır, mekanizma değil — kodlanmış bir offset tıpatıp `OFFSET` gibi davranır. Onu hızlandıran şey, cursor değerinin index key'iyle karşılaştırılabilmesidir. İşin içinde sunucu tarafı state yoktur; zaten bir reconnect'ten sağ çıkmasının sebebi de budur.",
    },
    {
      kind: "editor",
      intro: `### OFFSET'in ne kadar okuduğunu say

1. \`offset_page(rows, offset, limit) -> (Vec<u32>, usize)\` — baştan oku, **atlananlar dahil** okuduğun her satırı say, sonra \`limit\` kadar satır topla.
2. \`cursor_page(idx, after, limit) -> (Vec<u32>, usize)\` — \`Bound::Excluded(after)\` ile seek et ve tam olarak \`limit\` satır oku.
3. 5000 satır, sayfa boyu 20. Sayfa 1, 10, 50 ve 250'yi karşılaştır ve iki yaklaşımın da birebir aynı sayfaları döndürdüğünü doğrula.
4. Sonra 250 sayfanın hepsini iki yöntemle de tara ve toplamları bas.

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

125 kat daha az satır okuması, birebir aynı çıktı için.`,
    },
  ],

  "backend-data-layer-5": [
    {
      kind: "theory",
      body: `Üç klasik anomalinin her biri, bir **yeniden okumanın** ne gördüğüyle tanımlanır.

**Dirty read** — başka bir transaction'ın yazdığı ama commit etmediği bir değeri görürsün. O transaction rollback ederse, hiç var olmamış bir veriye göre hareket etmişsindir.

**Non-repeatable read** — aynı satırı tek bir transaction içinde iki kez okursun ve iki farklı değer alırsın, çünkü arada başka bir transaction commit etmiştir.

**Phantom read** — aynı range sorgusunu iki kez çalıştırırsın ve ikincisi daha önce orada olmayan satırlar döndürür. Zaten okuduğun satırlar değişmedi; değişen *küme*.

ANSI isolation level'ları, bunlardan hangilerini yasakladıklarıyla tanımlanır — nasıl yasakladıklarıyla değil. Dersin özü bu ayrım: level bir sözleşmedir, mekanizma motorun kendi işidir.`,
    },
    {
      kind: "theory",
      body: `Implementasyonlar gerçekte ne yapıyor.

**Read Committed** her *statement* için taze bir snapshot alır. **Repeatable Read** her *transaction* için bir tane alır. Birazdan basacağın tablonun ikinci sütununu üreten şey, bu tek fark.

Level isimleri bir **taban, bir spesifikasyon değil**. Postgres'in \`REPEATABLE READ\`'i snapshot isolation'dır ve ANSI izin verse de phantom'lara izin vermez. MySQL'in InnoDB'si next-key lock kullanır ve onların çoğunu da engeller. Motorlar arasında bir level isminin gücüne dayanarak anomali varsayımı taşıma.

Snapshot isolation yine de **write skew**'e izin verir: iki transaction birer küme okur, her biri bir invariant'ı kontrol eder, her biri *farklı* bir satıra yazar ve hiçbiri çakışma görmediği hâlde invariant ihlal edilmiş olur. Bunu yalnızca gerçek \`SERIALIZABLE\` (Postgres'te SSI) yasaklar — üstelik yasaklama biçimi, transaction'lardan birini bir serialization hatasıyla **abort etmektir**. Retry döngüsü olmayan serializable kod pratikte serializable değildir.

Locking maliyet tarafıdır. Row lock'lar ucuz ve çoktur; page ve table lock'ları kabadır ve takibi ucuzdur. Bazı motorlar bellek baskısı altında row lock'ları table lock'a yükseltir, o noktada da concurrency çöker. Serializable bir range predicate'i, henüz var olmayan satırları kapsayan bir predicate ya da gap lock'a ihtiyaç duyar — pahalı level olmasının sebebi budur.`,
    },
    {
      kind: "quiz",
      question:
        "Uzun süren bir rapor `REPEATABLE READ`'de çalışıyor. Bu ne garanti eder?",
      options: [
        "Rapor tek bir tutarlı snapshot görür; diğer transaction'lar serbestçe commit eder, rapor onları basitçe görmez",
        "Rapor bitene kadar başka hiçbir transaction, raporun okuduğu satırlardaki değişiklikleri commit edemez",
        "Snapshot'ı sabit olduğu için raporun kendi yazmalarının commit anında başarılı olacağı garantidir",
      ],
      answer: 0,
      explain:
        "Isolation görünürlükle ilgilidir, dışlamayla değil. Uzun bir transaction'ı lock sanmak, kimsenin yazmadığı veriyi korumak uğruna vacuum horizon'ını bir saat açık tutmakla biten yoldur — üstelik o transaction'dan çıkan bir yazma commit anında yine reddedilebilir.",
    },
    {
      kind: "fill",
      prompt:
        "Read Committed statement başına taze bir snapshot alır — şu anda commit edilmiş neyse onu görür.",
      file: "main.rs",
      before: "        Level::ReadCommitted => ",
      after: ",",
      choices: [
        "store.committed.clone()",
        "snapshot.to_vec()",
        "store.pending.clone()",
      ],
      answer: 0,
      explain:
        "`snapshot.to_vec()` Repeatable Read'in kuralıdır — tüm transaction için tek snapshot — ve ikisini takas etmek bu level'lar arasındaki en yaygın karışıklıktır. Tek başına `pending` ise yalnızca commit edilmemiş yazmaları gösterir, commit edilmiş tablodan hiçbir şeyi göstermez.",
    },
    {
      kind: "quiz",
      question:
        "Bir servis `READ COMMITTED`'dan `SERIALIZABLE`'a geçiyor ve başka hiçbir şeyi değiştirmiyor. Muhtemel sonuç nedir?",
      options: [
        "Çekişme altında istekler serialization hatalarıyla düşmeye başlar, çünkü abort edilen transaction'ları yeniden deneyen bir şey yoktur",
        "Throughput düşer ama doğruluk kesin olarak artar, çünkü artık her anomali imkânsızdır",
        "Postgres'te hiçbir şey değişmez; orada `READ COMMITTED` zaten serializable semantiği sağlar",
      ],
      answer: 0,
      explain:
        "`SERIALIZABLE` sessiz anomalileri gürültülü abort'lara çevirir — ancak çağıran yeniden deniyorsa bir iyileşmedir. Retry döngüsü olmadan uygulama eskisinden daha az doğrudur, çünkü önceden birazcık yanlış cevap döndürdüğü yerde artık hata döndürür. (Bilmeye değer varsayılanlar: Postgres'te Read Committed, MySQL'de Repeatable Read.)",
    },
    {
      kind: "editor",
      intro: `### Anomali tablosunu bir trace'ten türet

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — tek fonksiyon, dört kural. Read Uncommitted \`pending\`'i \`committed\`'ın üstüne bindirir; Read Committed \`committed\`'ı döndürür; Repeatable Read snapshot'ı artı onda var olmayan satırları döndürür; Serializable yalnızca snapshot'ı döndürür.
2. \`read(...)\` görünür kümeden tek bir key seçer; \`count_at_least(...)\` üzerinde bir range sorgusu çalıştırır — phantom'ın belirdiği yer orasıdır.
3. Üç aşamayı trace et: key 1'e \`200\` değerinin pending yazması, sonra o yazmanın commit'i, sonra yeni bir 3 numaralı satırın insert'i.
4. Okumaları bas, sonra anomali tablosunu onlardan **türet** — elle iddia etme.

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

Merdiven basamakları asıl mesele: her level bir öncekinden bir anomali fazlasını yasaklıyor.`,
    },
  ],

  "backend-data-layer-6": [
    {
      kind: "theory",
      body: `Transaction, **bir yazma buffer'ı artı bir atomiklik kuralıdır**.

Transaction'ın içinde okumalar kendi commit edilmemiş yazmalarını görür. Dışında ise \`COMMIT\` olana dek hiçbir şey onları görmez. Read-your-own-writes'ın tamamı budur; alıştırma bunu, store'a bakmadan önce buffer'a bakan bir lookup olarak implemente ediyor.

Dolayısıyla \`ROLLBACK\` bir **undo değildir**. Değişiklikler başkasının görebileceği hiçbir yere zaten uygulanmamıştı — buffer atılır ya da WAL'ın commit edilmemiş kayıtları basitçe hiç replay edilmez. Bir milyon satırlık bir transaction'ı geri almak orantılı biçimde pahalı değildir.

Durability write-ahead log'dan gelir: \`COMMIT\`, data page'lerinin değil, log kaydının \`fsync\`'idir. O \`fsync\` yazma latency'sinin sert tabanıdır; 1000 satırı tek transaction'da commit etmenin 1000 transaction'ı yenmesinin ve group commit'in varlık sebebinin nedeni odur.

Uzun bir transaction'ın gerçek maliyeti rollback işi değildir. Tuttuğu lock'lar ve çivilediği vacuum ya da undo horizon'ıdır; o yüzden eski satır versiyonları geri kazanılamaz.`,
    },
    {
      kind: "theory",
      body: `Prepared statement **sunucu tarafı state'tir**.

\`PREPARE\` SQL'i parse eder, bir plan kurar ve ona isim verir. \`EXECUTE\` tel üzerinden SQL metni değil, parametre *değerleri* gönderir. Bu tekrar kullanım parse'ı ve genelde planı da kurtarır; kısa bir OLTP sorgusunda bu, toplam sürenin ciddi bir kısmıdır.

Aynı zamanda doğru injection savunmasıdır ve bunun yapısal bir sebebi vardır: parametreler bant dışından gelir ve parser'a hiç verilmez. Escaping yanlış yapabileceğin bir filtredir; parameter binding ise sözdizimi taşıyamayan bir kanaldır.

İki tuzak var.

**Connection başınadır.** Transaction modunda çalışan bir pooler her transaction için sana farklı bir backend verir, dolayısıyla isimli plan orada değildir. pgbouncer'ın transaction modu ile prepared statement'ların tarih boyunca kavga etmesinin somut sebebi budur; driver'ların reconnect sonrası yeniden prepare etmesinin de.

**Tekrar kullanılan bir plan generic bir plandır**; bu çağrının parametre değerleri bilinmeden seçilmiştir. Çarpık dağılımlı bir sütunda yeniden planlanmış bir plandan çok daha kötü olabilir; Postgres ilk beş execution için custom plan'leri fiyatlandırarak riski dağıtır ve sonra karar verir.

Deadlock'lar buraya aittir, çünkü transaction seviyesinde bir arızadır. Aynı iki satırı ters sırayla güncelleyen iki transaction bir döngü oluşturur; motor bunu tespit eder ve birini deadlock hatasıyla öldürür — asılı kalmaz. Çözüm: yazmaları sabit bir key'e göre sırala, transaction'ları kısa tut ve her çağıranı bir deadlock kurbanını yeniden deneyebilecek hâle getir.`,
    },
    {
      kind: "quiz",
      question:
        "Toplu bir iş tek transaction'da 2 milyon satır yazıyor ve sonra bir constraint ihlaline çarpıyor. `ROLLBACK` neye mal olur?",
      options: [
        "Neredeyse hiçbir şeye — yazmalar zaten commit edilmemişti, dolayısıyla başkalarının görebileceği yerde geri alınacak bir şey yok",
        "Kabaca yazmaların maliyeti kadar bir daha, çünkü her biri tersine çevrilmek zorunda",
        "Rollback anında hiçbir şeye, ama bir sonraki checkpoint'te tam bir tablo yeniden yazımına",
      ],
      answer: 0,
      explain:
        "Operasyonel olarak makul duran sonuç — 'o hâlde büyük yazmaları küçük transaction'lara böl ki rollback ucuz kalsın' — doğru tavsiyeye yanlış gerekçeyle varıyor. Böl, ama rollback pahalı olduğu için değil; lock süresi ve uzun transaction'ın çivilediği vacuum horizon'ı yüzünden.",
    },
    {
      kind: "fill",
      prompt:
        "Constraint düştü. Buffer'lanmış yazmaları uygulayıp tersine çevirmek yerine at gitsin.",
      file: "main.rs",
      before: "    if after < 0 {\n        ",
      after:
        ";\n        return Err(format!(\"CHECK balance >= 0 violated: {}\", after));\n    }",
      choices: ["txn.rollback()", "txn.set(from, a)", "txn.commit(db)"],
      answer: 0,
      explain:
        "`txn.set(from, a)` telafi yazmasıdır — transaction'ın yokken yaptığın şey. Telafi edilecek bir şey yok: store'a hiç dokunulmadı. `commit` ise kontrolün az önce reddettiği yazmayı uygular.",
    },
    {
      kind: "quiz",
      question: "Bir prepared statement gerçekte neyi tekrar kullanır?",
      options: [
        "Sunucu tarafındaki parse ve plan state'ini; connection başına tutulur ve isimle referans verilir",
        "Parametre değerleri gönderilmeden önce yerleştirilmiş, client tarafındaki bir SQL şablonunu",
        "Sunucudaki cache'lenmiş bir sonuç kümesini; aynı parametreler geldiğinde yeniden döndürülür",
      ],
      answer: 0,
      explain:
        "Bu tek olgu üç özelliği aynı anda açıklar: hızlıdır çünkü yeniden parse edilecek bir şey yoktur, injection'a kapalıdır çünkü değerler parser'a hiç ulaşmaz ve transaction modunda çalışan bir pooler altında bozulur çünkü state'i taşıyan connection geri aldığın connection değildir.",
    },
    {
      kind: "editor",
      intro: `### Commit et, rollback yap ve bir kez prepare et

1. \`Db\`; \`rows\`, derlenmiş \`plans\` ve bir \`executions\` sayacı tutar. \`prepare(sql)\`, o metin zaten derlenmişse mevcut handle'ı döndürür; \`execute(plan)\` yalnızca sayacı artırır.
2. \`Txn\` yazmaları bir \`BTreeMap<u32, i64>\` içinde buffer'lar. \`get\` önce buffer'dan okur, sonra store'a düşer; \`set\` buffer'lar; \`commit\` buffer'lanmış her yazmayı uygular; \`rollback\` buffer'ı atar.
3. \`transfer(...)\` borçlandırır, alacaklandırır, sonra \`balance >= 0\`'ı kontrol eder — buna göre commit ya da rollback eder.
4. \`30\`'luk bir transfer (commit eder) ve \`500\`'lük bir transfer (kontrolü ihlal eder) çalıştır. Aynı SQL'i iki kez prepare et ve handle'ın aynı olduğunu göster.

Beklenen çıktı:

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

Dört execution, bir derleme — ve rollback edilen transfer store'da hiçbir iz bırakmadı.`,
    },
  ],

  "backend-data-layer-7": [
    {
      kind: "theory",
      body: `Connection pool, **sabit bir slot sayısı artı bir kuyruktur**.

Bir Postgres connection'ı açmak bir TCP handshake'i, TLS, authentication ve fork edilmiş bir backend process'i demektir — tek haneli ila onlarca milisaniye. Pool bunu N tanesini açık tutup dağıtarak amorti eder: check out et, kullan, check in et.

Dolayısıyla bir client'ın gözlemlediği latency **kuyruk beklemesi + sorgu süresidir**. Pool doyduğunda ilk terim baskın gelir, ikincisi hiç değişmez. \`pg_stat_statements\`'ın hızlı bir sorgu gösterdiği anda client'ın yavaş bir istek görmesinin sebebi budur: iki sayı farklı aralıkları ölçüyor ve ikisi de doğru.

Tükenme bir checkout timeout'u olarak yüzeye çıkar — \`PoolTimedOut\`, \`TimeoutError: QueuePool limit ... overflow\`. Bu, veritabanı arızası değil, servisinin kapasitesine dair bir sinyaldir.

Simülasyon bunu somutlaştırıyor: kapasite 1'de, en uzun sorgusu 25 ms olan bir pool'da en kötü istek 198 ms bekliyor.`,
    },
    {
      kind: "theory",
      body: `Büyük olan iyi değildir.

Veritabanının işe yarar concurrency'sinin ötesinde — kabaca çekirdek sayısı artı etkin I/O paralelliği — fazladan pool slot'ları throughput eklemez. Kuyruğu, ölçülebilir ve sınırlı olduğu senin process'inden alıp, lock çekişmesine ve diğer her client'ı bozan context switch'e dönüştüğü veritabanına taşırlar. Alıştırma bunu apaçık gösteriyor: 8 slot ile 16 slot birebir aynı makespan'i üretiyor.

Gerçek tavan çarpımsaldır: **instance sayısı x pool boyutu, \`max_connections\`'a karşı**. Pool'u 20 olan on pod, tek bir servisten 200 connection demektir. Bunu daraltmak sunucu tarafı bir pooler'ın (pgbouncer, pgcat) işidir — transaction modunun session state üzerindeki kısıtları pahasına.

En ucuz çözüm genelde daha büyük bir pool değil, **daha kısa bir checkout**'tur. Bir connection'ı asla bir HTTP çağrısı boyunca elde tutma ve transaction'ı bitirmek için gereken her şey elinde olmadan asla açma.

Read replica'ların kendi pool'u ve kendi lag'i vardır. Replication varsayılan olarak asenkrondur, dolayısıyla kendi yazmandan milisaniyeler sonra atılan bir okuma, yazma öncesi değeri meşru biçimde döndürebilir. Read-your-writes, o okumayı primary'ye yönlendirmek ya da replica'nın commit'inin döndürdüğü LSN'e ulaşmasını beklemek demektir. "Nasılsa eventually consistent" bir tasarım değildir; tasarım, yönlendirme kuralıdır.`,
    },
    {
      kind: "quiz",
      question:
        "Bir endpoint'te p99, 30 ms'den 400 ms'ye fırlıyor. Veritabanı aynı sorguyu 4 ms ortalamayla, değişmemiş olarak raporluyor. İlk bakılacak şey nedir?",
      options: [
        "Connection checkout beklemesi — client'ın latency'si, veritabanının hiç görmediği kuyruk süresini de içerir",
        "Sorgu planı; 4 ms ortalamada 400 ms'lik bir p99, planın bazı parametre değerleri için döndüğü anlamına gelir",
        "Index bloat; bazı execution'ları yavaşlatır ama veritabanının raporladığı ortalamayı kıpırdatmaz",
      ],
      answer: 0,
      explain:
        "Sorguyu tune etme refleksi, hiçbir şey değişmeden bir gün harcatan şeydir. Veritabanının sayacı statement bir connection'a ulaştığında başlar; client'ınki istek geldiğinde. Doymuş bir pool altında aradaki fark regresyonun tamamıdır.",
    },
    {
      kind: "fill",
      prompt:
        "Sorgu başlamadan önce client'ın gerçekte yaşadığı şeyi ölç.",
      file: "main.rs",
      before: "        let wait = ",
      after: ";",
      choices: ["start - arrival", "free_at[slot] - arrival", "ms"],
      answer: 0,
      explain:
        "`ms` sorgunun kendi süresidir — veritabanının raporladığı ve client'ın p99'u patlarken düz kalan sayı. `free_at[slot] - arrival` ise slot istek gelmeden önce zaten boşsa underflow eder ki bu tam olarak çekişmesiz durumdur.",
    },
    {
      kind: "quiz",
      question:
        "Tepe yükte checkout timeout'ları beliriyor. Pool boyutunu büyütmek neden yanlış ilk hamledir?",
      options: [
        "Sınırlı ve görünür bir hatayı, veritabanının içindeki çekişmeyle — ve instance'larla çarpılınca her servisi vuran bir `too many connections` kesintisiyle — takas eder",
        "Pool boyutu uygulama yeniden başlatılmadan değiştirilemez, dolayısıyla olay anında zaten bir seçenek değildir",
        "Daha büyük bir pool connection başına bellek kullanımını artırır ve tek gerçek maliyet budur",
      ],
      answer: 0,
      explain:
        "Sınırlı bir pool'daki timeout, sistemin kendi kapasitesi hakkında doğruyu söylemesidir. Sınırı kaldırmak kapasite eklemez — kuyruğu göremeyeceğin bir yere taşır ve tek bir servis uğruna paylaşılan bir kaynağı riske atar.",
    },
    {
      kind: "editor",
      intro: `### Bir pool'dan kuyruk beklemesini oku

1. \`service_times()\` — deterministik bir LCG: seed \`1\`, \`next = seed * 1103515245 + 12345 mod 2^31\`, servis süresi \`= 5 + (next >> 16) % 21\`. On altı tane.
2. \`simulate(capacity, service) -> (max wait, mean wait, timeouts, makespan)\` — istekler her 3 ms'de bir gelir ve en erken boşalan slot'u alır. Bekleme \`start - arrival\`'dır; \`CHECKOUT_TIMEOUT\`'u aşan bir bekleme timeout sayılır.
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

Kapasite 1 ile kapasite 8 arasında hiçbir sorgu yavaşlamadı. Değişen tek şey bekleme oldu — ve 16 slot'un 8'e kıyasla hiçbir şey kazandırmadığına dikkat et.`,
    },
  ],
};
