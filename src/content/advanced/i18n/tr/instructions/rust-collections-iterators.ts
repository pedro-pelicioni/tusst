// TR · editor instructions — Collections, Iterators & Closures.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-collections-iterators.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustCollectionsIteratorsInstructionsTr: Record<string, { instructions: string }> = {
  "rust-collections-iterators-1": {
    instructions: `## Doğru container, doğru maliyet

\`Vec<T>\` bitişiktir (contiguous): **sonda** O(1) push/pop, **başta** O(n) insert/remove. \`with_capacity\` tekrar tekrar ikiye katlamak yerine tek seferde ayırır.

\`VecDeque<T>\` bir ring buffer'dır: **iki** uçta da O(1).

### Görevin

1. \`Vec::with_capacity(4)\`, \`1..=4\` push et, vektörü \`{:?}\` ile ve \`capacity()\` değerini yazdır — hâlâ tam olarak 4.
2. Bir \`VecDeque<i32>\`: \`push_back(2)\`, \`push_back(3)\`, \`push_front(1)\`. \`{:?}\` ile yazdır, sonra \`pop_front()\` sonucunu \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\`

### İpuçları

- \`use std::collections::VecDeque;\`
- \`for n in 1..=4\` kapsayıcı (inclusive) bir aralıktır.
`,
  },

  "rust-collections-iterators-2": {
    instructions: `## Sıra mı hız mı

\`HashMap\` — ortalama O(1), **keyfi** iteration sırası (her çalıştırmada bilerek rastgeleleştirilir).
\`BTreeMap\` — O(log n), key'e göre **her zaman sıralı**, aralık sorgularını destekler.

Sıralı iteration, aralıklar ya da deterministik çıktı için \`BTreeMap\` seç. Aksi halde \`HashMap\`.

\`entry\` API'si, \`contains_key\` + \`insert\`'in iki kez hash'lediği yerde bir kez hash'ler:

\`\`\`rust
*hits.entry(m).or_insert(0) += 1;
\`\`\`

### Görevin

1. Bir \`HashMap<&str, u32>\` ile \`["getEvents", "sendTx", "getEvents"]\` içindeki tekrarları \`entry\` kullanarak say, sonra \`getEvents\` sayısını yazdır.
2. Bir \`BTreeMap<&str, u32>\` içine \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` girdilerini bu sırayla ekle, \`keys()\` değerlerini bir \`Vec<&str>\` içine topla ve yazdır.

Beklenen çıktı:

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\`

### İpuçları

- \`use std::collections::{BTreeMap, HashMap};\`
- \`.keys().copied().collect()\`, \`&&str\`'i \`&str\`'e çevirir.
`,
  },

  "rust-collections-iterators-3": {
    instructions: `## Borrow et, değiştir, tüket

| metot | üretir | sonrasında koleksiyon |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | dokunulmamış |
| \`.iter_mut()\` | \`&mut T\` | yerinde değiştirilmiş |
| \`.into_iter()\` | \`T\` | tüketilmiş |

\`for x in collection\`, \`into_iter()\`'a desugar olur — onu kullanan bir sonraki satırın derlenmemesinin sebebi bu.

### Görevin

\`let mut data = vec![1, 2, 3];\` ile:

1. \`.iter()\` + \`map\` ile her birini ikiye katlayıp yeni bir \`Vec<i32>\` oluştur; yazdır.
2. \`.iter_mut()\` ile her birine yerinde \`10\` ekle; \`data\`'yı yazdır.
3. \`.into_iter()\` + \`map\` ile her birini bir \`String\`'e çevir; \`Vec<String>\` içine topla ve yazdır.

Beklenen çıktı:

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\`
`,
  },

  "rust-collections-iterators-4": {
    instructions: `## Sen istemeden hiçbir şey çalışmaz

Adapter'lar (\`map\`, \`filter\`, \`filter_map\`) **lazy**'dir — bir pipeline kurarlar. İş ancak bir consumer'da başlar (\`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`).

Zincirlemenin aşamalar arasında hiçbir şey ayırmamasının sebebi bu: her eleman tüm zincirden teker teker akar.

### Görevin

\`let raw = vec!["12", "x", "30", "", "8"];\` ile:

1. \`.iter()\` → her girdiyi \`i64\` olarak parse edip başarılıları tutan \`filter_map\` → \`>= 10\` olanları tutan \`filter\` → \`Vec<i64>\` içine topla; yazdır.
2. Her girdiyi \`.len()\` değerine map'leyen ikinci bir zincir kur ve onu **tüketmeden** bir değişkene bağla. \`nothing ran yet\` yazdır, sonra \`Vec<usize>\` içine topla ve onu yazdır.

Beklenen çıktı:

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\`

### İpuçları

- \`s.parse::<i64>().ok()\`, \`Result\`'ı \`filter_map\`'in istediği \`Option\`'a çevirir.
- \`.collect::<Vec<usize>>()\` collect'i satır içinde tip-açıklamalı yapar.
`,
  },

  "rust-collections-iterators-5": {
    instructions: `## Üç yoldan topla

\`fold\`, açık bir başlangıç değerinden yola çıkarak dizi boyunca bir accumulator (biriktirici) taşır. \`reduce\` başlangıç değerini ilk elemandan alır, bu yüzden \`Option\` döndürür.

Accumulator'ın bir sayı olması şart değil — bir \`String\` kurmak, accumulator'ı string olan bir fold'dur.

### Görevin

\`let latencies = vec![12u64, 40, 7, 95, 23];\` ile:

1. \`0u64\`'ten başlayan bir \`fold\` ile toplamı bul; yazdır.
2. En kötüsü için \`.copied().reduce(u64::max)\`; \`{:?}\` ile yazdır.
3. \`String::new()\`'dan başlayan bir \`fold\` ile değerleri \`'|'\` ile birleştir; yazdır.

Beklenen çıktı:

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\`

### İpuçları

- String fold'unun closure'ı \`|mut acc, n|\` alır ve \`acc\` döndürür.
- Ayırıcıyı \`if !acc.is_empty()\` ile koru.
`,
  },

  "rust-collections-iterators-6": {
    instructions: `## Trait'i derleyici seçer

| trait | gövde ne yapar | çağrılabilirlik |
| --- | --- | --- |
| \`FnOnce\` | bir capture'ı tüketir | bir kez |
| \`FnMut\` | bir capture'ı değiştirir | çok kez, \`&mut\` ister |
| \`Fn\` | capture'ları yalnızca okur | çok kez, \`&\` üzerinden |

İç içe geçerler; dolayısıyla \`Fn\`, isteyebileceğin **en** kısıtlayıcı bound'dur. Seni ihtiyacın kadar sık çağırmaya izin veren en gevşek olanı bound olarak koy.

### Görevin

1. \`f(1) + f(2)\` döndüren \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\`. Yakalanan bir \`factor = 10\` ile çarpan bir closure'la çağır.
2. \`f()\`'i iki kez çağıran \`fn call_fn_mut<F: FnMut()>(mut f: F)\`. Yakalanan bir \`count\`'u artıran bir closure'la çağır, sonra \`count\`'u yazdır.
3. \`f()\`'i bir kez çağıran \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\`. Yakalanan bir \`String\` döndüren bir \`move\` closure'la çağır.

Beklenen çıktı:

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\`

### İpuçları

- \`FnMut\` parametresi \`mut f: F\` olmalı — onu çağırmak closure'ı exclusive olarak borrow eder.
- Yakalanan \`String\`, \`consumed\` değerini tutar.
`,
  },

  "rust-collections-iterators-7": {
    instructions: `## Scope'undan uzun yaşayan closure'lar

Bir closure varsayılan olarak referansla yakalar. \`move\`, her capture'ın **değer olarak** alınmasını zorlar — bir fonksiyondan döndürülen closure'ın ihtiyacı olan tam olarak budur.

\`impl Fn() -> T\` tek bir somut anonim tipi adlandırır: static dispatch, allocation yok. \`Box<dyn Fn() -> T>\` ise farklı dallar farklı closure'lar döndürdüğünde ya da birkaçını bir arada sakladığında zorunludur.

### Görevin

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — \`n\`'in sahibidir, her çağrıda artırıp döndürür.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — \`"hello <name>"\` döndürür.
3. \`main\` içinde sayacı üç kez **ayrı binding'lere** çağır, üçünü tek satırda yazdır, sonra \`rpc\` için greeter'ın çıktısını yazdır.

Beklenen çıktı:

\`\`\`text
11 12 13
hello rpc
\`\`\`

Sayaç \`10\`'dan başlar. Yazdırmadan önce her çağrıyı bağla — tek bir \`println!\` içinde üç \`&mut\` borrow, ihtiyacın olmayan bir kavgadır.
`,
  },
};
