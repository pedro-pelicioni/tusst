import type { LessonStep } from "@/content/steps";

// TR · Indexers & Distributed Systems.
//
// Overlay for ../../steps/backend-indexers-distsys.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendIndexersDistsysStepsTr: Record<string, LessonStep[]> = {
  "backend-indexers-distsys-1": [
    {
      kind: "theory",
      body: `Bir indexer (indeksleyici) dört şeydir, fazlası değil.

| parça | işi |
| --- | --- |
| source | sıralı ledger (defter) event'leri, herhangi bir noktadan replay edilebilir |
| cursor | bitirdiğin son event'in sıra numarası |
| processor | bir event'i state'e fold eder |
| store | fold edilmiş state'i **ve** cursor'ı tutar |

Asıl önemli olan son satır. Cursor yerel bir değişkende yaşıyorsa o bir ilerleme çubuğudur; veriyle aynı store'da yaşıyorsa bir checkpoint'tir (kontrol noktası) ve \`SIGKILL\`'den sağ çıkan tek şey checkpoint'tir.

\`\`\`rust
struct Store {
    balances: Vec<(&'static str, i64)>,
    cursor: u64,
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Kaldığın yerden devam etmek bir **filtredir**, seek değil:

\`\`\`rust
if e.seq <= store.cursor {
    continue;
}
\`\`\`

O tek predicate tüm restart hikâyesidir. Source sözleşmesinin "keyfî bir noktadan replay edilebilir" olmasının sebebi de budur — yalnızca bir kez tüketebildiğin bir feed, cursor ile efekti atomik yapmaya zorlar, bunu da iki ayrı sistem arasında yapamazsın.

Processor bir fold'dur. Aynı source, aynı başlangıç cursor'ı, aynı sonuç state — re-indexing'i bir kesinti olmaktan çıkarıp salı günü rahatça koşabileceğin rutin bir operasyona çeviren şey budur.

Store'un iterasyon sırası deterministik olmak zorunda, yoksa çıktı tekrar üretilebilir olmaz; tekrar üretilemeyen bir indexer de sıfırdan kurulmuş haliyle diff'lenemez. Buradaki store'un \`HashMap\` değil de çiftlerden oluşan bir \`Vec\` olmasının sebebi bu: \`HashMap\` iterasyon sırası tasarım gereği her process'te rastgeleleştirilir.`,
    },
    {
      kind: "quiz",
      question:
        "Store fold edilmiş bakiyeleri tutuyor. Bir çökmeden sonra onu tarayarak cursor'ı yeniden kurabilir misin?",
      options: [
        "Hayır — fold sıra numaralarını attı, dolayısıyla işlediğin en yüksek numara bakiyelerden geri getirilemez",
        "Evet — her hesap satırında saklanan en büyük sıra numarasını al",
        "Evet — uygulanan event sayısı cursor'a eşittir, satırları say",
      ],
      answer: 0,
      explain:
        "Cursor, verinin zaten bildiği bir şeyin cache'i değildir. Bağımsız bir state'tir; yazılı hâle getirilmesi gerekmesinin sebebi de tam olarak bu.",
    },
    {
      kind: "fill",
      prompt:
        "Store'un halihazırda fold ettiği her event'i atla. Checkpoint **bitirilmiş** son event'i adlandırır, dolayısıyla o event'in kendisi tekrar replay edilmemeli.",
      file: "main.rs",
      before: "for e in source {\n        if ",
      after: " {\n            continue;\n        }",
      choices: [
        "e.seq <= store.cursor",
        "e.seq < store.cursor",
        "e.seq == store.cursor",
      ],
      explain:
        "`<` her restart'ta checkpoint'lenmiş event'i yeniden oynatır — tam dikiş yerinde bir duplicate, fark etmesi en zor tür. `==` bir event'i atlar ve altındaki her şeyi yeniden işler.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "İlerlemeyi bellekte tutup çökmeden sonra sıra 0'dan yeniden başlamak şu durumda güvenlidir:",
      options: [
        "her processor efekti idempotent olduğunda, böylece tüm geçmişi replay etmek aynı state'e yakınsar",
        "ledger append-only olduğunda, çünkü head'in altındaki hiçbir şey değişemez",
        "restart, yeni hiçbir event gelmeyecek kadar hızlı gerçekleştiğinde",
      ],
      answer: 0,
      explain:
        "Append-only senin yan etkilerin hakkında hiçbir şey söylemez: iki kez uygulanan bir `+= delta`, source ne kadar değişmez olursa olsun yanlıştır. Idempotency önümüzdeki üç dersin konusu.",
    },
    {
      kind: "editor",
      intro: `### Bir ledger'ı indeksle, öldürül, devam et

1. \`Store::apply\`, \`e.delta\`'yı \`e.account\`'a ekler; hesap henüz yoksa onu push eder.
2. \`run\`, \`store.cursor\`'da veya altında kalan event'leri atlar, geri kalanın en fazla \`budget\` kadarını uygular, her apply'dan sonra \`store.cursor\`'ı \`e.seq\`'e ilerletir ve trace satırını yazdırır.
3. \`main\` içinde: 5 budget'ıyla run 1 (çökme), checkpoint'i yazdır, sonra sınırsız run 2, ardından hesap tablosunu yazdır.

Beklenen çıktı:

\`\`\`text
run 1: resume from cursor=0
  seq=1 alice   100
  seq=2 bob      50
  seq=3 alice   -30
  seq=4 carol    20
  seq=5 bob      -5
  checkpoint cursor=5
-- process killed, store survives --
run 2: resume from cursor=5
  seq=6 alice    60
  seq=7 carol    15
  seq=8 bob      25
  checkpoint cursor=8
account balance
alice       130
bob          70
carol        35
\`\`\`

Trace satırı \`"  seq={} {:<6}{:>5}"\`; tablo satırı \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-2": [
    {
      kind: "theory",
      body: `Her indexer adımı **iki yazmadır** — store üzerindeki efekt ve cursor commit'i. Çökme ikisinin arasına düşebilir ve sıraları hangi hata moduna düşeceğine karar verir. İkisini birden kapsayan bir transaction dışında üçüncü bir seçenek yok.

**Cursor-first** sana at-most-once verir. Checkpoint \`seq=3\` bitti der, bakiye hiç kımıldamaz, hiçbir restart onu yeniden okumaz. Run, beklenen \`150\`'ye karşılık \`total=120\` ile biter ve hiçbir hata raporlamaz.

**Effect-first** sana at-least-once verir. Efekt indi, checkpoint inmedi, dolayısıyla restart \`seq=3\`'ü replay eder ve \`180\`'e ulaşır. Yanlış — ama bir dedupe key'inin düzeltebileceği yönde yanlış.`,
    },
    {
      kind: "theory",
      body: `| sıralama | iki yazma arasında çökme | kurtarılabilir mi? |
| --- | --- | --- |
| cursor-first | event sessizce atlanır | hayır — komple yeniden indeksleme |
| effect-first | event iki kez uygulanır | evet — event id'si üzerinden dedupe |

Yani at-least-once, tolere ettiğin değil **üzerine inşa ettiğin** teslimat garantisidir. Bir message broker'da "exactly-once", at-least-once teslimat artı consumer tarafında idempotent işleme demektir; broker sana hâlâ yazmak zorunda olduğun yarıyı satıyor.

Efekt ile cursor aynı veritabanında yaşıyorsa, ikisini birden kapsayan tek bir transaction problemi tamamen ortadan kaldırır. Sıralama sorusu ancak yaşamadıkları anda karşına çıkar — satırlar Postgres'te, cursor Redis'te — ve bu ayrımı genelde bir latency gerekçesiyle, bir hata modu seçtiğini bilmeyen biri getirir.`,
    },
    {
      kind: "quiz",
      question:
        "\"Önce cursor'ı commit et, o zaman işi asla iki kez yapmazsın.\" Bunun nesi yanlış?",
      options: [
        "İki kez yapmıyorsun çünkü bazen hiç yapmıyorsun — atlanan event kurtarılamaz ve üstelik başarı olarak raporlanır",
        "Yanlış bir şey yok; doğru sıralama bu ve duplicate'ler daha ciddi bir hatadır",
        "Yalnızca cursor yazması efekt yazmasından yavaş olduğu için yanlış",
      ],
      answer: 0,
      explain:
        "Run 0 ile çıkar, log tertemizdir ve toplam bir event eksiktir. Bunu haftalar sonra bir mutabakat (reconciliation) işinden öğrenirsin — tabii varsa.",
    },
    {
      kind: "fill",
      prompt:
        "Effect-first: cursor commit'i o kolun **son** yazmasıdır, çökme noktasının ötesinde. Az önce gerçekten uyguladığın sırayı commit et.",
      file: "main.rs",
      before:
        "store.total += e.amount;\n            store.applies += 1;\n            if e.seq == crash_at {\n                return true;\n            }\n            ",
      after: "\n        }",
      choices: [
        "store.cursor = e.seq;",
        "store.cursor += 1;",
        "store.cursor = e.seq - 1;",
      ],
      explain:
        "`+= 1`, sıra numaralarının bitişik olduğunu varsayar — feed'de tek bir boşluk yeter, cursor sonsuza dek geride kalır. `- 1` ise her restart'ta az önce bitirdiğin event'i yeniden okur.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Kaybolan bir event ile duplicate olmuş bir event neden simetrik bug'lar değildir?",
      options: [
        "Duplicate, hâlâ elinde olan veriden kurtarılabilir; kayıp ise artık replay edemeyebileceğin bir source'a ihtiyaç duyar",
        "Simetrikler — ikisi de toplamı bir event'in tutarı kadar yanlış bırakır",
        "Duplicate daha kötüdür, çünkü state'i bozar, kayıp ise onu yalnızca geciktirir",
      ],
      answer: 0,
      explain:
        "Duplicate, bir dedupe key'iyle ileriye doğru düzeltebileceğin bir bug'dır. Kayıp ise ancak geçmişi yeniden okuyarak düzeltebileceğin bir bug — tabii retention penceresi geçmediyse.",
    },
    {
      kind: "editor",
      intro: `### İki sıralamayı tek bir çökmeye karşı ölç

1. \`drain\`, \`store.cursor\`'ın ötesindeki event'leri gezer. \`CursorFirst\` altında cursor'ı efektten **önce** commit eder; \`EffectFirst\` altında **sonra**. \`e.seq == crash_at\` olduğunda \`true\` döner ve yarım kalmış state'i geride bırakır.
2. \`main\` içinde iki sıralamayı da \`crash_at = 3\` ile koştur, çökmeden sonra her birini yeniden başlat (\`crash_at = 0\` hiç eşleşmez), sonra özet tablosunu ve iki hüküm satırını yazdır.

Beklenen çıktı:

\`\`\`text
cursor-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=3
  seq=4 total=70 cursor=4
  seq=5 total=120 cursor=5
effect-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=2
  seq=3 total=90 cursor=3
  seq=4 total=130 cursor=4
  seq=5 total=180 cursor=5
ordering      applies  total  expected
cursor-first        4    120       150
effect-first        6    180       150
cursor-first lost seq=3: no restart can recover it
effect-first applied seq=3 twice: dedupe can recover it
\`\`\`

Trace satırı yalnızca adım tamamlandığında yazdırılır; özet satırı \`"{:<14}{:>7}{:>7}{:>10}"\`.`,
    },
  ],

  "backend-indexers-distsys-3": [
    {
      kind: "theory",
      body: `At-least-once, consumer'ının başına üç ayrı şeyin gelebileceği anlamına gelir ve üçü de bu dersteki \`delivered\` slice'ında var:

- aynı event id'si **iki kez** gelir (id 2),
- event'ler **sırasız** gelir (id 3, id 2'den önce),
- restart'tan sonra tüm stream **yeniden teslim edilir** (pass 2).

Idempotency (idempotentlik) *processor*'ın özelliğidir, transport'un değil. Uygulanmış event id'lerinin kümesini veriyle aynı store'da tut, efektten önce kontrol et ve aynı yazmanın parçası olarak kaydet.

\`\`\`rust
fn apply_idempotent(&mut self, e: Event) {
    if self.seen.contains(&e.id) {
        return;
    }
    self.seen.push(e.id);
    self.credit(e.account, e.amount);
}
\`\`\`

Naif processor iki pass boyunca 305 → 610'a tırmanır. Idempotent olan ikisinde de 265'te durur — yani exactly-once toplamında.`,
    },
    {
      kind: "theory",
      body: `**Dedupe key'i, producer'ın atadığı event id'si olmak zorundadır.** Payload'ı hash'lemek, meşru biçimde birbirinin aynı olan iki event'i birbirine karıştırır: 2 ve 5 numaralı id'lerin ikisi de \`bob, 40\` ve bunlar iki farklı ödeme; id 2'nin ikinci teslimi ise aynı ödemenin iki kez gelmesi. Hash tek bir vaka görür; id ikisini birden.

**Sıra bağımsızlığı ile duplicate bağımsızlığı ayrı özelliklerdir.** Bir bakiyeye alacak yazmak commutative'dir, dolayısıyla bu derste yeniden sıralamanın maliyeti sıfır. Bir \`set\` operasyonu commutative değildir ve dedupe'un üstüne bir versiyon ya da sıra koruması ister — "yalnızca \`e.version > row.version\` ise uygula".

**Buradaki seen-set sınırsız ve production'da öyle olmamalı.** Onu event id'si üzerinde bir unique index ile sınırla (insert patlar, transaction geri alınır, efekt hiç inmez) ya da cursor'a bağlı bir pencereyle — çünkü checkpoint'in altındaki hiçbir şey meşru olarak yeniden ortaya çıkamaz.`,
    },
    {
      kind: "quiz",
      question:
        "Broker'ın exactly-once teslimat reklamı yapıyor. Consumer tarafında yine de ne yazılmak zorunda?",
      options: [
        "Consumer tarafındaki dedupe — exactly-once, at-least-once teslimat artı idempotent işlemedir ve broker yalnızca ilk yarıyı sağlar",
        "Hiçbir şey, yeter ki consumer her mesajı işlemeden önce acknowledge etsin",
        "Yalnızca bir retry politikası; broker'ın transaction'ı consumer'ın yazmalarını da kapsar",
      ],
      answer: 0,
      explain:
        "Bir broker'ın transaction'ı kendi log'unu kapsar. Senin veritabanına yazmayı kapsayamaz, dolayısıyla efektin broker'dan çıktığı anda garanti biter.",
    },
    {
      kind: "fill",
      prompt:
        "Event'in ne söylediğine göre değil, producer'ın ona verdiği kimliğe göre dedupe et.",
      file: "main.rs",
      before: "fn apply_idempotent(&mut self, e: Event) {\n        if self.seen.contains(",
      after: ") {\n            return;\n        }",
      choices: ["&e.id", "&e.amount", "&e.account"],
      explain:
        "Tutara göre dedupe et; id 5 — bob'a yapılan 40'lık ikinci, gerçek ödeme — parayla birlikte buhar olur. Hesaba göre dedupe et; hesap başına ömür boyu tam olarak bir event uygularsın.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Bir ödeme feed'inde event payload'ının hash'i neden kötü bir dedupe key'idir?",
      options: [
        "Meşru biçimde birbirinin aynı olan iki transfer aynı hash'i verir, dolayısıyla ikincisi sessizce düşürülür",
        "Hash'lemek, production hacminde her event'te koşamayacak kadar yavaştır",
        "Payload hash'leri, alakasız event'lerin karışacağı sıklıkta çakışır",
      ],
      answer: 0,
      explain:
        "Sorun kriptografik anlamda bir çakışma değil — iki event gerçekten byte byte aynı. Yine de bunlar iki farklı ödeme.",
    },
    {
      kind: "editor",
      intro: `### Processor'ı idempotent yap

1. \`apply_naive\` koşulsuz alacak yazar.
2. \`apply_idempotent\`, \`e.id\` zaten \`self.seen\` içindeyse erken döner; değilse id'yi kaydeder ve alacak yazar.
3. \`main\` içinde \`delivered\`'ı iki store'a da **iki kez** ver, pass başına bir satır yazdır, sonra exactly-once toplamını, idempotent bakiye tablosunu ve seen-set boyutunu yazdır.

Beklenen çıktı:

\`\`\`text
pass  naive  idempotent
   1    305         265
   2    610         265
exactly-once total: 265
account balance
alice       125
bob          80
carol        60
distinct event ids retained: 5
\`\`\`

Pass satırı \`"{:>4}{:>7}{:>12}"\`; bakiye satırı \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-4": [
    {
      kind: "theory",
      body: `Bir bloğun zincirini uzatıp uzatmadığını sana yüksekliği değil, **parent hash**'i söyler.

\`\`\`text
genesis - a1 - a2 - a3 - a4 - a5          <- indekslenmiş head
               \\
                b3 - b4 - b5 - b6         <- geliyor, parent = a2
\`\`\`

\`b3\`, head \`a5\` iken 3 numaralı yükseklikte geliyor. Yalnızca yüksekliğe bakınca bu bir duplicate ya da geriye sıçramış bir feed gibi görünür. \`parent\`'a bakınca hiçbir belirsizlik yok: head'in altında çatallanıyor, yani senin üç bloğun artık orphan.

Rollback **head'den aşağı doğru** koşar, her bloğun efektinin tersini uygular ve çatal noktasında durur. Efektler commutative olmaktan çıktığı anda ters sıra kritik hale gelir; ileri doğru geri sarmak, hiçbir dalın sahip olmadığı bir store üretir.`,
    },
    {
      kind: "theory",
      body: `Undo, tersini alabilecek kadarını saklamış olmanı gerektirir. Uygulanmış blokları bakiyelerin yanında tutmak bunun ucuz versiyonu — gerçek bir indexer bir undo log ya da yükseklik başına snapshot tutar, çünkü "genesis'ten yeniden hesapla" bir yanıt süresi değildir.

**Confirmed, final demek değildir.** carol'ın 20'si 4. yükseklikte alacak yazıldı ve iki blok boyunca yerinde durdu; reorg'dan (yeniden düzenleme) sonra bakiyesi 0 ve satır yalnızca kanıt olarak hayatta. Finality, *geri sarmaya razı olmayı bıraktığın* derinliktir — bloğun taşıdığı bir özellik değil, senin seçtiğin bir politika.

Pending-karşı-confirmed ayrımının seni asıl koruduğu şey bu. Çatalın üstünde confirmed olarak dışarı verdiğin ne varsa artık aşağı akışta geri çekilmek zorunda; bir indexer'ın salt satır güncellemesi değil de reorg event'leri yaymasının sebebi de bu: yalnızca yeni bakiyeyi gören bir consumer'ın, bir düzeltmeyi bir ödemeden ayırt etme şansı yok.`,
    },
    {
      kind: "quiz",
      question:
        "Head `a5`. `b6`, `a2`'de çatallanan bir dalda 6. yükseklikte geliyor. Neden öylece daha uzun zincire fast-forward yapmıyorsun?",
      options: [
        "`b3..b6`'yı `a5`'in üstüne uygulamak `a3`, `a4` ve `a5`'in efektlerini yerinde bırakır ve hiçbir zincirin sahip olmadığı bir state üretir",
        "Dal kesinlikle daha uzun olduğu sürece sorun yok — en uzun zincir kuralı bu",
        "Sorun yok, ama yalnızca `b3..b6` üzerindeki imzaları yeniden doğruladıktan sonra",
      ],
      answer: 0,
      explain:
        "En uzun zincir kuralı hangi dalın kanonik olduğunu söyler. Store'unu oraya nasıl taşıyacağın hakkında hiçbir şey söylemez ve store'un şu anda o dalın hiç içermediği üç blokluk efekt tutuyor.",
    },
    {
      kind: "fill",
      prompt:
        "Çatal noktasını bul: gelen dalın kendi parent'ı olarak adlandırdığı, senin zincirindeki blok.",
      file: "main.rs",
      before: "let fork = ix\n        .chain\n        .iter()\n        .position(|b| ",
      after: ")\n        .map(|i| ix.chain[i].height)\n        .unwrap_or(0);",
      choices: [
        "b.hash == branch[0].parent",
        "b.height == branch[0].height",
        "b.parent == branch[0].parent",
      ],
      explain:
        "Yüksekliğe göre eşleştirmek `a3`'ü bulur — yani orphan olan bloğu — ve 3'e geri sarar, `a3`'ü uygulanmış bırakır. Parent'ı parent'la eşleştirmek de aynı sebeple kardeş `a3`'ü bulur: ikisi de `a2`'yi adlandırıyor.",
      answer: 0,
    },
    {
      kind: "quiz",
      question: "\"Altı onay\" aslında sana ne veriyor?",
      options: [
        "Geri sarmayı bırakmayı seçeceğin kadar yüksek bir tersine çevirme maliyeti — ekonomik bir argüman, bir garanti değil",
        "O derinlikteki bir bloğun artık değiştirilemeyeceğine dair bir protokol garantisi",
        "Normal işleyişte geçerli olan, yalnızca zincir saldırıya uğrarsa geçersizleşen bir garanti",
      ],
      answer: 0,
      explain:
        "Altı, birinin seçtiği bir eşik. Indexer'ının hâlâ bir rollback yoluna ihtiyacı var, çünkü dün saldırıyı kârsız kılan o sayı bir piyasanın parametresi.",
    },
    {
      kind: "editor",
      intro: `### Çatala geri sar, dalı yeniden uygula

1. \`apply\` bloğun alacağını yazar, onu zincire push eder ve apply satırını yazdırır.
2. \`rollback_to\`, \`height\`'in üstündeki blokları head'den aşağı doğru pop eder, her biri için **ters** delta'yı yazar ve bir rollback satırı basar.
3. \`main\` içinde: kanonik zinciri indeksle ve raporla; zincirde \`branch[0].parent\`'ı bularak çatalı tespit et; geri sar; dalı uygula; raporla; carol hakkındaki kapanış satırını yazdır.

Beklenen çıktı:

\`\`\`text
  apply    a1 height=1 alice +100
  apply    a2 height=2 bob +50
  apply    a3 height=3 alice +30
  apply    a4 height=4 carol +20
  apply    a5 height=5 bob +10
head=a5 height=5
  alice    130
  bob       60
  carol     20
b3 arrives: parent=a2, our head=a5 -> reorg
  rollback a5 height=5 bob -10
  rollback a4 height=4 carol -20
  rollback a3 height=3 alice -30
  fork point height=2 hash=a2
  apply    b3 height=3 alice +5
  apply    b4 height=4 dave +70
  apply    b5 height=5 bob +10
  apply    b6 height=6 alice +15
head=b6 height=6
  alice    120
  bob       60
  carol      0
  dave      70
carol was credited in a4 and confirmed for 2 blocks; that credit is now gone
\`\`\`

İki trace satırı da delta için \`{:+}\` kullanır, böylece işaret her zaman yazdırılır.`,
    },
  ],

  "backend-indexers-distsys-5": [
    {
      kind: "theory",
      body: `Altı string değeri olan bir status kolonu state machine değildir. Machine dediğin şey **geçiş bağıntısıdır**:

\`\`\`rust
fn allowed(from: Status, to: Status) -> bool {
    match (from, to) {
        (Status::Received, Status::Validating) => true,
        (Status::Validating, Status::Submitted) => true,
        (Status::Submitted, Status::Pending) => true,
        (Status::Pending, Status::Confirmed) => true,
        // ... her state fail edebilir ...
        _ => false,
    }
}
\`\`\`

Değerinin tamamı neye **false** döndürdüğünde saklı. Her şeyi yakalayan \`_ => false\` bir formalite değil, tasarımın kendisi: yazmadığın her kenar inşa gereği reddedilir, böylece sonradan yedinci bir status eklemek bir düzine yeni geçişi sessizce serbest bırakmak yerine kapalı tarafa düşerek patlar.`,
    },
    {
      kind: "theory",
      body: `**Terminal state'ler, çıkan kolu olmayanlardır.** \`Confirmed\` ve \`Failed\` ikisi de 0 çıkan geçiş raporlar; geç gelen duplicate bir webhook'un confirmed bir işlemi \`Pending\`'e geri çekme denemesi bu yüzden onu diriltmek yerine reddedilir.

**Reddedilen bir geçiş, state'i değiştirmeden bırakmalı ve sayılmalı.** Buradaki yedi öneriden üçü reddediliyor ve işlem yine \`Confirmed\`'de bitiyor. Loglanmamış bir ret, ileride sıfırdan araştıracağın bir olaydır, çünkü olup bittiğine dair tek kanıt erken dönen bir branch'ti.

**\`Submitted → Confirmed\` reddedilir**, herkesin istediği sonuç olmasına rağmen. \`Pending\`'i atlamak, işlemin mempool'da bulunduğuna dair hiçbir kayıt bırakmaz; \`Pending\` için poll eden bir client onu hiç görmez — yani retry mantığı da, zamanlayıcısı da, arayüzü de hiç tetiklenmemiş bir kenara bağlı kalır.`,
    },
    {
      kind: "quiz",
      question:
        "İşlem her hâlükârda `Confirmed` oluyor. `Submitted → Pending → Confirmed`'i atlamak sana neye mal olur?",
      options: [
        "Denetim izine ve son state yerine aradaki kenarı gözleyen her consumer'a",
        "Ölçülebilir hiçbir şeye — ara state'ler arayüz için var ve asıl otorite terminal state",
        "Yalnızca iki state arasındaki zamanlama metriklerine",
      ],
      answer: 0,
      explain:
        "Mutabakat sorusu \"confirmed mı\" değil, \"oraya nasıl geldi\". Aradaki satır olmadan, hiç yayınlanmamış bir işlemle bir saniyede kazılmış bir işlem birebir aynı görünür.",
    },
    {
      kind: "fill",
      prompt:
        "Geçiş tablosunu kapat. Yukarıda yazılmamış her kenar reddedilmeli ve terminal state'ler terminal kalmalı.",
      file: "main.rs",
      before: "(Status::Pending, Status::Failed) => true,\n        ",
      after: "\n    }",
      choices: ["_ => false,", "(_, Status::Failed) => true,", "_ => true,"],
      explain:
        "`(_, Status::Failed) => true` \"her şey fail edebilir\" diye okunur ve sessizce `Confirmed → Failed`'e izin vererek terminalliği yok eder. `_ => true` ise machine'i, yasaklamayı akıl ettiğin şeylerin tablosuna çevirir.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Geçiş kontrolü nereye ait — API handler'ına mı, state'in yanına mı?",
      options: [
        "State'in yanına, çünkü reorg handler'ı, backfill işi ve elle yapılan düzeltme aynı kolona yazıyor ve hiçbiri handler'dan geçmiyor",
        "API handler'ına, çünkü her dış istek oraya geliyor ve hatanın döndürülmesi gereken yer orası",
        "Her ikisine, tekrarlı şekilde, böylece handler bir gidiş-dönüş olmadan 409 dönebilir",
      ],
      answer: 0,
      explain:
        "Birkaç giriş noktasından yalnızca birinde uygulanan bir kural, kural değil gelenektir. Onu atlayan yazıcılar tam olarak gece 3'te gözetimsiz koşanlardır.",
    },
    {
      kind: "editor",
      intro: `### Machine'i kodla, reddetmesini sağla

1. \`allowed\`, \`(from, to)\` üzerinde match eder: her yasal kenar için bir kol, geri kalan her şey için \`_ => false\`. \`Confirmed\` ve \`Failed\` **hiç** çıkan kol almaz.
2. \`Tx::transition\`, \`allowed\` ise hamleyi uygular; değilse \`rejected\`'ı artırır ve state'e dokunmaz — her iki durumda da from/to/verdict satırını yazdırır.
3. \`main\` içinde önerilen her geçişi sür, son satırı yazdır, sonra her terminal state'in çıkan kenarlarını say.

Beklenen çıktı:

\`\`\`text
from        -> to          verdict
Received    -> Validating  accepted
Validating  -> Submitted   accepted
Submitted   -> Confirmed   REJECTED
Submitted   -> Pending     accepted
Pending     -> Confirmed   accepted
Confirmed   -> Failed      REJECTED
Confirmed   -> Pending     REJECTED
final=Confirmed rejected=3
Confirmed has 0 outgoing transitions
Failed has 0 outgoing transitions
\`\`\`

Verdict satırı \`"{:<11} -> {:<11} accepted"\` / \`... REJECTED\`.`,
    },
  ],

  "backend-indexers-distsys-6": [
    {
      kind: "theory",
      body: `Örtüşme garantisi kesinlikle \`R + W > N\`. \`>=\` değil.

| N | R | W | R+W | örtüşür mü | yazma sağ kalır | okuma sağ kalır |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | 1 | 1 | 2 | hayır | 2 | 2 |
| 3 | 2 | 2 | 4 | evet | 1 | 1 |
| 3 | 1 | 3 | 4 | evet | 0 | 2 |
| 3 | 3 | 1 | 4 | evet | 2 | 0 |
| 5 | 2 | 3 | 5 | **hayır** | 2 | 3 |
| 5 | 3 | 3 | 6 | evet | 2 | 2 |

Beşinci satır, insanların güvenli sanarak production'a çıkardığı konfigürasyon. R+W, N'e eşit; dolayısıyla iki node'luk bir okuma quorum'u (yeter sayı), yazmayı alan üç node'dan tamamen ayrık olabilir. Bayat veri döner, hem de hatasız ve çağıranın bunu fark etmesinin hiçbir yolu olmadan.`,
    },
    {
      kind: "theory",
      body: `R ve W, soyut bir "tutarlılığa" karşı değil **birbirlerine** karşı takas edilen iki kadrandır. N=3'te \`W=1\` yazmada iki node arızasını tolere eder, okumada sıfır; \`W=3\` bunu tersine çevirir. Latency de aynı eğriyi izler, çünkü her quorum en yavaş üyesini bekler — yani W'yi yükseltmek özellikle yazma yolundaki p99'u yükseltir.

Bir partition (ağ bölünmesi) izin istemez. N=5, W=3 ve 3|2'lik bir bölünmede çoğunluk tarafı hâlâ bir quorum toplar ve versiyon 2'yi commit eder; azınlık tarafının iki erişilebilir node'u vardır ve ne R=3'e ne W=3'e ulaşabilir, dolayısıyla ikisini de reddeder.

O ret **tam olarak** CP tercihidir ve onu R ile W'yi seçtiğin anda yaptın. n4/n5'in bayat versiyon 1'ini servis etmek AP tercihi olurdu — erişilebilir ve yanlış. CAP ağın bir özelliği değildir; bu iki satırdan hangisini production'a çıkardığındır.

Okumayı çözülebilir kılan şey duvar saati zaman damgaları değil versiyon numaralarıdır: okuyucu, gerçekten alabildiği yanıtlar arasından en yüksek versiyonu seçer.`,
    },
    {
      kind: "quiz",
      question: "`R + W >= N` neden quorum kuralı değil?",
      options: [
        "Eşitlikte iki quorum ayrık olabilir — N=5, R=2, W=3'te okuma kümesi, yazmayı alan üç node'un hiçbirine değmeyebilir",
        "Kural bu zaten; katı form, bir node'luk payı olan muhafazakâr bir gelenek",
        "Yalnızca çift N'de bir eksik kalır, çünkü orada çoğunluk diye bir şey yoktur",
      ],
      answer: 0,
      explain:
        "Güvercin yuvası ilkesi: R+W > N en az bir node'u iki kümeye birden girmeye zorlar. R+W = N'de birbirlerinden kaçmalarına tam yetecek kadar yer vardır ve bayat okuma sessizdir.",
    },
    {
      kind: "fill",
      prompt:
        "Örtüşme koşulunu yaz. En az bir node'u hem okuma kümesine hem yazma kümesine girmeye zorlamak zorunda.",
      file: "main.rs",
      before: "let overlaps = ",
      after: ";",
      choices: ["r + w > n", "r + w >= n", "w > n / 2"],
      explain:
        "`>=` yukarıdaki N=5/R=2/W=3 satırını da kabul eder. `w > n / 2` ise *yazma* tarafının çoğunluk kuralıdır — eşzamanlı yazmaları serileştirir, ama bir okuyucunun onları görüp görmediği hakkında hiçbir şey söylemez.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "3|2 bölünmesi sırasında azınlık tarafı \"az geriden\" okuma servis etmeye devam edebilir mi?",
      options: [
        "Yalnızca R'yi 2 veya altına çekersen, ki bu takası açıkça yapmak demektir — ve o zaman çoğunluk tarafındaki okumalar da örtüşme garantisini kaybeder",
        "Evet — bölünme sırasında okumalar güvenlidir; yalnızca yazmaların quorum'a ihtiyacı var",
        "Evet, yeter ki yanıtı potansiyel olarak bayat diye işaretlesin",
      ],
      answer: 0,
      explain:
        "R, tüm cluster için tek bir sayıdır. Onu bölünmüş azınlık için düşürüp her yerde yüksek tutamazsın; tercihin olay anında değil konfigürasyon zamanında yapılmasının sebebi de bu.",
    },
    {
      kind: "editor",
      intro: `### Örtüşmeyi hesapla, sonra cluster'ı böl

1. \`write\`, erişilebilir taraf W node toplayamıyorsa reddeder; toplayabiliyorsa versiyonu ve değeri hepsine yazar.
2. \`read\`, taraf R node toplayamıyorsa reddeder; toplayabiliyorsa görülen **en yüksek versiyonu** döner.
3. \`main\` içinde: \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\` için quorum tablosunu yazdır, sonra N=5, R=3, W=3'te 3|2'lik bir bölünme koştur — her tarafta versiyon 2 / değer 250 yaz, her taraftan oku ve kapanış AP satırını yazdır.

Beklenen çıktı:

\`\`\`text
 N  R  W  R+W  overlaps  write survives  read survives
 3  1  1    2  no                     2              2
 3  2  2    4  yes                    1              1
 3  1  3    4  yes                    0              2
 3  3  1    4  yes                    2              0
 5  2  3    5  no                     2              3
 5  3  3    6  yes                    2              2
N=5 R=3 W=3, partition {n1,n2,n3} | {n4,n5}
  majority write v=2: ok
  minority write v=2: refused
  majority read: version=2 value=250
  minority read: refused
  minority still holds version=1 on n4,n5: serving that read is the AP choice
\`\`\`

Tablo satırı \`"{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}"\`; sağ kalma kolonları \`n - w\` ve \`n - r\`.`,
    },
  ],

  "backend-indexers-distsys-7": [
    {
      kind: "theory",
      body: `Bir Lamport clock iki kuraldan ibarettir: her event'te sayacını tıklat ve bir mesaj alırken, tıklatmadan önce sayacını en az göndericinin damgası kadar yükselt.

Bu, \`a → b\` olmasının \`L(a) < L(b)\` gerektirdiğini garanti eder. Clock'un iddia ettiği tek şey bu ve **tersi doğru değil**:

| çift | lamport | nedensellik |
| --- | --- | --- |
| a2, b2 | 2 < 3 | happens-before |
| c1, a2 | 1 < 2 | eşzamanlı |
| b1, c1 | 1 = 1 | eşzamanlı |

\`c1\`'in damgası \`a2\`'ninkinden küçük ve ikisi arasında hiçbir nedensel yol yok. Yani "Lamport zaman damgasına göre son yazan kazanır", eşzamanlı yazmalar arasından keyfî bir galip seçip onu cevap diye sunmaktır.`,
    },
    {
      kind: "theory",
      body: `Bir **vector clock** node başına bir sayaç tutar, yalnızca kendi bileşenini tıklatır ve alışta eleman bazında max alır.

\`\`\`rust
fn happens_before(a: &[u64; 3], b: &[u64; 3]) -> bool {
    let mut strict = false;
    for i in 0..3 {
        if a[i] > b[i] { return false; }
        if a[i] < b[i] { strict = true; }
    }
    strict
}
\`\`\`

Bileşen bazında \`a ≤ b\` olması ve en az birinin kesinlikle küçük olması \`a → b\` demektir. Hiçbir yönün tutmaması ise **eşzamanlı** demektir — Lamport'un yapısal olarak üretemeyeceği bir hüküm.

Bedeli, damganın şeklidir: Lamport'ta event başına O(1), vektörlerde O(node sayısı). Vektörlerin, serbestçe node ekleyen bir sistemle temas ettiğinde ayakta kalamamasının ve çakışma tespitinin genelde tüm cluster yerine tek bir key ile sınırlanmasının sebebi bu.

Eşzamanlı, karar verememek değil gerçek bir cevaptır. Onu tespit edebilmek, birbirini hiç görmemiş iki yazmadan birini sessizce düşürmek yerine kardeş versiyonları, bir merge'ü ya da kullanıcıya sorulan bir soruyu yüzeye çıkarmanı sağlar.`,
    },
    {
      kind: "quiz",
      question: "`L(a) < L(b)`. Bu sana nedensellik hakkında ne söyler?",
      options: [
        "Hiçbir şey — hem `a → b` ile hem de `a` ile `b`'nin eşzamanlı olmasıyla tutarlı, tıpkı c1/a2 satırının gösterdiği gibi",
        "`a`'nın `b`'den önce gerçekleştiğini; Lamport clock'ların verdiği garanti bu",
        "İki event aynı node'da değilse `a`'nın `b`'den önce gerçekleştiğini",
      ],
      answer: 0,
      explain:
        "Çıkarım tek yönlü işler: nedensellik sıralı damgaları gerektirir, tersi asla. Karşıt önerme hâlâ işine yarar — `L(a) >= L(b)`, `a`'nın `b`'ye sebep olmadığını kanıtlar.",
    },
    {
      kind: "fill",
      prompt:
        "Bir vector clock'un alış kuralı: kendi vektörünle göndericininkinin eleman bazında maksimumunu al, bileşen bileşen.",
      file: "main.rs",
      before: "for k in 0..3 {\n                if ",
      after:
        " {\n                    vector[e.node][k] = vector_of[src][k];\n                }\n            }",
      choices: [
        "vector_of[src][k] > vector[e.node][k]",
        "vector_of[src][k] != vector[e.node][k]",
        "vector_of[src][k] > vector[e.node][e.node]",
      ],
      explain:
        "`!=`, seninki daha büyük olduğunda bile göndericinin değerini kopyalar ve zaten gözlemlemiş olduğun geçmişi çöpe atar. `vector[e.node][e.node]` ile karşılaştırmak ise her bileşeni kendi sayacına karşı ölçer.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "NTP tüm filoyu birkaç milisaniye içinde tutuyor. Event'leri neden duvar saatine göre sıralamıyorsun?",
      options: [
        "Kayma (skew), sıralamaya çalıştığın aralığı rutin olarak aşar ve ona dayatılabilir bir üst sınır yok — bir alış, kendi gönderiminden daha erken bir zaman damgası taşıyabilir",
        "Duvar saatleri sıralama için gayet iyi; mantıksal clock'lar yalnızca bir zaman damgasının götürdüğü byte'ları kurtarmak için var",
        "Çünkü zaman damgalarının çözünürlüğü milisaniye ve eşitlikler bozulamaz",
      ],
      answer: 0,
      explain:
        "Bir VM duraklaması, bir leap-second yayması ya da bozuk bir NTP peer'ı saati, aynı key'e yapılan iki yazmayı ayıran mikrosaniyelerden çok daha fazla oynatır. Mantıksal clock'lar tam da o sınır dayatılamadığı için var.",
    },
    {
      kind: "editor",
      intro: `### Bir trace'i iki clock'la birden damgala

1. \`happens_before\`, \`a\`'nın her bileşeni \`b\`'ninkinden \`<=\` ise ve en az biri kesinlikle küçükse true döner.
2. Event'leri sırayla gez. Bir teslimde bu node'un Lamport sayacını göndericinin damgasına yükselt ve göndericinin vektörünün eleman bazında max'ını al; sonra node'un Lamport sayacını ve kendi vektör bileşenini tıklat. Event başına iki damgayı da kaydet ve tabloyu yazdır.
3. \`(a2,b2)\`, \`(c1,a2)\` ve \`(b1,c1)\` çiftleri için hüküm satırlarını yazdır — event indeksleri \`(1,3)\`, \`(4,1)\` ve \`(2,4)\`.

Beklenen çıktı:

\`\`\`text
ev  node  lamport  vector
a1  A     1        [1,0,0]
a2  A     2        [2,0,0]
b1  B     1        [0,1,0]
b2  B     3        [2,2,0]
c1  C     1        [0,0,1]
b3  B     4        [2,3,0]
c2  C     5        [2,3,2]
pair    lamport  vector verdict
a2,b2   2 < 3    happens-before
c1,a2   1 < 2    concurrent
b1,c1   1 = 1    concurrent
a smaller lamport stamp does not mean caused-by: see c1,a2
\`\`\`

Node harfi \`["A", "B", "C"][e.node]\` üzerinden gelir; trace satırı \`"{}  {}     {}        [{},{},{}]"\` ve hüküm satırı \`"{},{}   {} {} {}    {}"\`.`,
    },
  ],
};
