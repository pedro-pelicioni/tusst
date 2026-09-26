// TR · editor instructions — Indexers & Distributed Systems.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-indexers-distsys.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendIndexersDistsysInstructionsTr: Record<string, { instructions: string }> = {
  "backend-indexers-distsys-1": {
    instructions: `## Bir ledger'ı indeksle, öldürül, devam et

Bir indexer (indeksleyici) dört şeydir: sıralı ledger (defter) event'lerinden oluşan bir **source**, bitirdiğin sonuncusunu adlandıran bir **cursor**, her event'i state'e fold eden bir **processor** ve ikisini birden tutan bir **store**. Cursor store'un içinde yaşar — onu bir değişken değil de checkpoint (kontrol noktası) yapan şey budur.

Kaldığın yerden devam etmek bir filtredir, seek değil: \`e.seq <= store.cursor\` atlanır. Store bir \`HashMap\` değil de çiftlerden oluşan bir \`Vec\`, çünkü çıktının tekrar üretilebilir olması için iterasyon sırasının deterministik olması gerekiyor.

\`budget\` parametresi burada çökmenin yerini tutuyor.

### Görevin

1. \`Store::apply\`, \`e.delta\`'yı \`e.account\`'a ekler; hesap henüz yoksa onu push eder.
2. \`run\`, \`store.cursor\`'da veya altında kalan event'leri atlar, geri kalanın en fazla \`budget\` kadarını uygular, her apply'dan sonra \`store.cursor\`'ı \`e.seq\`'e ilerletir ve trace satırını yazdırır.
3. \`main\` içinde: 5 budget'ıyla run 1, checkpoint'i yazdır, kill satırını yazdır, sonra \`usize::MAX\` ile run 2, checkpoint'i yazdır, ardından hesap tablosunu yazdır.

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

### İpuçları

- Trace satırı: \`println!("  seq={} {:<6}{:>5}", e.seq, e.account, e.delta);\`
- Tablo satırı: \`println!("{:<8}{:>7}", account, balance);\`
- Uygulanan event'leri yerel bir \`done\` içinde say ve \`budget\`'a ulaşınca \`break\` et — zaten işlenmiş event'ler için \`continue\` önce gelmeli, yoksa budget atlamalara harcanır.
`,
  },

  "backend-indexers-distsys-2": {
    instructions: `## İki sıralamayı tek bir çökmeye karşı ölç

Her indexer adımı iki yazmadır — store üzerindeki efekt ve cursor commit'i — ve bir çökme ikisinin arasına düşebilir.

**Cursor-first** at-most-once'tır: checkpoint \`seq=3\` bitti der, bakiye hiç kımıldamaz ve hiçbir restart onu yeniden okumaz. **Effect-first** at-least-once'tır: efekt indi, checkpoint inmedi, dolayısıyla restart \`seq=3\`'ü replay eder. Bu ikisinden biri, hâlâ elinde olan veriden kurtarılabilir.

### Görevin

1. \`drain\`, \`store.cursor\`'ın ötesindeki event'leri gezer. \`Order::CursorFirst\` altında cursor'ı efektten **önce** commit eder; \`Order::EffectFirst\` altında **sonra**. \`e.seq == crash_at\`'e ulaşınca \`true\` döner, yarım kalmış state'i geride bırakır ve trace satırını yalnızca tamamlanan adımlar için yazdırır.
2. \`main\` içinde her sıralama için: taze bir \`Store\` kur, etiketi yazdır, \`crash_at = 3\` ile drain et ve çöktüyse restart satırını yazdırıp \`crash_at = 0\` ile tekrar drain et.
3. Sonra özet tablosunu ve iki hüküm satırını yazdır.

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

### İpuçları

- Trace: \`println!("  seq={} total={} cursor={}", e.seq, store.total, store.cursor);\`
- Özet satırı: \`println!("{:<14}{:>7}{:>7}{:>10}", label(*order), applies, total, expected);\`
- \`for order in [Order::CursorFirst, Order::EffectFirst]\` diziyi değer olarak gezer, çünkü \`Order\` \`Copy\`'dir.
- \`(order, store.total, store.applies)\` üçlülerini bir \`Vec\`'te topla ki tablo iki run'dan sonra yazdırılsın.
`,
  },

  "backend-indexers-distsys-3": {
    instructions: `## Processor'ı idempotent yap

At-least-once, aynı event id'sinin iki kez gelebileceği, event'lerin sırasız gelebileceği ve restart'tan sonra tüm stream'in yeniden teslim edilebileceği anlamına gelir. Üçü de \`delivered\` içinde oluyor.

Idempotency (idempotentlik) processor'ın özelliğidir, transport'un değil: uygulanmış event id'lerini veriyle aynı store'da tut, efektten önce kontrol et, aynı yazmanın parçası olarak kaydet. Dedupe key'i, producer'ın atadığı event id'si olmak zorunda: 2 ve 5 numaralı id'ler bob'a yapılan, byte byte aynı 40'lık ödemeler ve ikisi de inmek zorunda; buna karşılık id 2'nin iki kez gelmesi yalnızca bir kez inmeli. Bir payload hash'i bu iki vakayı birbirinden ayıramaz.

### Görevin

1. \`apply_naive\` koşulsuz alacak yazar.
2. \`apply_idempotent\`, \`e.id\` zaten \`self.seen\` içindeyse erken döner; değilse id'yi kaydeder ve alacak yazar.
3. \`main\` içinde \`delivered\`'ı iki store'a da iki kez ver, pass başına bir satır yazdır, sonra exactly-once toplamını, idempotent bakiye tablosunu ve seen-set boyutunu yazdır.

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

### İpuçları

- Pass satırı: \`println!("{:>4}{:>7}{:>12}", pass, naive.total(), safe.total());\`
- \`unique.iter().map(|e| e.amount).sum::<i64>()\` sana exactly-once toplamını verir.
- Seen-set burada sınırsız. Production'da o, event id'si üzerinde bir unique index ya da cursor'a bağlı bir penceredir.
`,
  },

  "backend-indexers-distsys-4": {
    instructions: `## Çatala geri sar, dalı yeniden uygula

Bir bloğun zincirini uzatıp uzatmadığını sana yüksekliği değil, **parent hash**'i söyler. \`b3\`, head \`a5\` iken 3 numaralı yükseklikte, parent'ı \`a2\` olarak geliyor — yalnızca yüksekliğe bakınca bu bir duplicate ya da bir boşluk gibi görünür.

Rollback head'den aşağı doğru koşar, her bloğun efektinin tersini uygular ve çatal noktasında durur. Efektler commutative olmaktan çıktığı anda ters sıra kritik hale gelir.

### Görevin

1. \`apply\` bloğun alacağını yazar, onu zincire push eder ve apply satırını yazdırır.
2. \`rollback_to\`, \`height\`'in üstündeki blokları head'den aşağı doğru pop eder, her biri için ters delta'yı yazar ve bir rollback satırı basar.
3. \`main\` içinde: kanonik zinciri indeksle ve \`report\` et; reorg satırını yazdır; zincirde \`branch[0].parent\`'ı bulup o bloğun yüksekliğini alarak çatalı tespit et; oraya \`rollback_to\` yap; çatal noktası satırını yazdır; dalı uygula; \`report\` et; carol hakkındaki kapanış satırını yazdır.

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

### İpuçları

- \`println!("  apply    {} height={} {} {:+}", b.hash, b.height, b.account, b.delta);\` — \`{:+}\` işareti her zaman yazdırır.
- \`while let Some(b) = self.chain.last().copied()\` sana head'i, \`pop\` boyunca bir borrow tutmadan verir.
- \`self.chain.iter().position(|b| b.hash == branch[0].parent).map(|i| self.chain[i].height).unwrap_or(0)\`.
`,
  },

  "backend-indexers-distsys-5": {
    instructions: `## Machine'i kodla, reddetmesini sağla

Altı string değeri olan bir status kolonu state machine değildir. Machine dediğin şey \`allowed(from, to)\` geçiş bağıntısıdır ve değerinin tamamı neye false döndürdüğünde saklıdır.

Her şeyi yakalayan \`_ => false\` tasarımın kendisidir: yazmadığın her kenar inşa gereği reddedilir. Terminal state'ler çıkan kolu olmayanlardır — \`Confirmed\` ve \`Failed\` hiç kol almaz; geç gelen duplicate bir webhook'un confirmed bir işlemi diriltememesinin sebebi de bu.

\`Submitted -> Confirmed\` reddedilir, herkesin istediği sonuç olmasına rağmen: \`Pending\`'i atlamak, işlemin mempool'da bulunduğuna dair kaydı yok eder.

### Görevin

1. \`allowed\`, \`(from, to)\` üzerinde match eder. Yasal kenarlar: \`Received -> Validating\`, \`Validating -> Submitted\`, \`Submitted -> Pending\`, \`Pending -> Confirmed\` ve \`Received\`, \`Validating\`, \`Submitted\`, \`Pending\`'in her birinden \`-> Failed\`. Geri kalan her şey \`_ => false\`.
2. \`Tx::transition\`, \`allowed\` ise hamleyi uygular; değilse \`rejected\`'ı artırır ve state'e dokunmaz — her iki durumda da from/to/verdict satırını yazdırır.
3. \`main\` içinde başlığı yazdır, önerilen her geçişi sür, son satırı yazdır, sonra \`Confirmed\` ve \`Failed\`'in çıkan kenarlarını say.

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

### İpuçları

- Verdict satırı: \`println!("{:<11} -> {:<11} accepted", name(from), name(to));\`
- Çıkan kenarları, altı status'ü \`allowed\`'dan geçirip filtreleyerek say: \`[..].iter().filter(|t| allowed(*s, **t)).count()\`.
- Mutasyondan önce \`let from = self.status;\` diye yakala ki satır, ayrıldığın state'i yazdırsın.
`,
  },

  "backend-indexers-distsys-6": {
    instructions: `## Örtüşmeyi hesapla, sonra cluster'ı böl

Örtüşme garantisi kesinlikle \`R + W > N\`. \`N=5, R=2, W=3\` satırının toplamı tam 5 eder ve **örtüşmez** — iki node'luk bir okuma quorum'u (yeter sayı), yazmayı alan üç node'dan tamamen ayrık olabilir ve hatasız biçimde bayat veri döner.

N=5, W=3 ve 3|2'lik bir ağ bölünmesinde (partition) çoğunluk tarafı hâlâ bir quorum toplar; azınlık tarafı ne R=3'e ne W=3'e ulaşır ve ikisini de reddeder. O ret CP tercihidir ve onu R ile W'yi seçtiğin anda yaptın.

Okumalar duvar saati zaman damgasına göre değil, **versiyon numarasına** göre çözülür.

### Görevin

1. \`write\`, erişilebilir tarafta en az \`w\` node yoksa false döner; varsa hepsinde \`version\` ve \`value\` alanlarını set eder ve true döner.
2. \`read\`, tarafta en az \`r\` node yoksa \`None\` döner; varsa görülen en yüksek \`(version, value)\` çiftini döner.
3. \`main\` içinde: \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\` için quorum tablosunu yazdır — N, R, W, R+W, \`r + w > n\` olup olmadığı ve her quorum'un hâlâ tolere ettiği arızalar (yazmada \`n - w\`, okumada \`n - r\`). Sonra R=3, W=3'te 3|2 bölünmesini koştur: her tarafta versiyon 2 / değer 250 yazmayı dene, her taraftan oku ve kapanış AP satırını yazdır.

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

### İpuçları

- Tablo satırı: \`println!("{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}", n, r, w, r + w, if overlaps { "yes" } else { "no" }, n - w, n - r);\`
- Bölünme satırındaki süslü parantezler \`{{\` ve \`}}\` olarak escape edilir.
- \`minority.iter().map(|n| n.id).collect::<Vec<_>>().join(",")\` node listesini kurar.
- \`read\`, bir \`best: (u32, i64)\` tuple'ına fold eder ve \`n.version > best.0\` olduğunda onu değiştirir — en yüksek versiyon kazanır, bir duvar saati zaman damgası ise node'lar arasında tam sıralama vermezdi.
`,
  },

  "backend-indexers-distsys-7": {
    instructions: `## Bir trace'i iki clock'la birden damgala

Bir Lamport clock iki kuraldan ibarettir: her event'te sayacını tıklat ve bir mesaj alırken, tıklatmadan önce sayacını en az göndericininki kadar yükselt. Bu, \`a -> b\` olmasının \`L(a) < L(b)\` gerektirdiğini garanti eder — fazlasını değil. \`c1\`'in L=1'i, \`a2\`'nin L=2'si var ve ikisi eşzamanlı.

Bir vector clock node başına bir sayaç tutar ve alışta eleman bazında max alır. Bileşen bazında \`a <= b\` olması ve en az birinin kesinlikle küçük olması \`a -> b\` demektir; hiçbir yönün tutmaması ise **eşzamanlı** demektir — Lamport'un yapısal olarak üretemeyeceği bir hüküm.

### Görevin

1. \`happens_before\`, \`a\`'nın her bileşeni \`b\`'ninkinden \`<=\` ise ve en az biri kesinlikle küçükse true döner.
2. Event'leri sırayla gez. Bir teslimde (\`Some(src)\`), bu node'un Lamport sayacını daha büyükse \`lamport_of[src]\`'e yükselt ve \`vector_of[src]\` ile eleman bazında max al. Sonra node'un Lamport sayacını ve kendi vektör bileşenini tıklat. İki damgayı da \`lamport_of[i]\` / \`vector_of[i]\` içine kaydet ve satırı yazdır.
3. \`(1,3)\`, \`(4,1)\` ve \`(2,4)\` event indeks çiftleri — yani \`a2,b2\`, \`c1,a2\` ve \`b1,c1\` — için hüküm satırlarını, Lamport karşılaştırma işareti ve vektör hükmüyle birlikte yazdır. Özet satırıyla kapat.

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

### İpuçları

- Trace satırı: \`println!("{}  {}     {}        [{},{},{}]", e.label, ["A", "B", "C"][e.node], lamport_of[i], vector_of[i][0], vector_of[i][1], vector_of[i][2]);\`
- Verdict satırı: \`println!("{},{}   {} {} {}    {}", ...)\` — işaret \`"<"\`, \`">"\` ya da \`"="\` olarak hesaplanır.
- \`for (i, e) in events.iter().enumerate()\` sana damgaları kaydedeceğin indeksi verir.
- İki çift dizi: node'a göre indekslenen **canlı** clock'lar \`lamport: [u64; 3]\` ve \`vector: [[u64; 3]; 3]\` — \`lamport[e.node] += 1\`, \`vector[e.node][e.node] += 1\` — ve event'e göre indekslenen, tıklattıktan sonra canlı clock'u içine kopyaladığın event başına damgalar \`lamport_of\` / \`vector_of\`.
`,
  },
};
