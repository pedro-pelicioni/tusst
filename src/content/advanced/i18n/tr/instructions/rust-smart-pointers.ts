// TR · editor instructions — Smart Pointers & Interior Mutability.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-smart-pointers.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustSmartPointersInstructionsTr: Record<string, { instructions: string }> = {
  "rust-smart-pointers-1": {
    instructions: `## Bir ifade ağacı

\`Box<T>\`, tek sahipli tek bir heap allocation'ıdır. Onu tanımlayan kullanım, recursive bir tipe **bilinen bir boyut** kazandırmaktır — bir box neyi gösterirse göstersin tek pointer genişliğindedir, dolayısıyla boyut hesabı sonlanır.

### Görevin

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`
2. Her iki varyantı match eden ve \`Add\` üzerinde recursion yapan \`fn eval(e: &Expr) -> i64\`.
3. \`2 + (3 + 4)\`'ü ağaç olarak kur, hesaplanan değeri yazdır, ardından ağacı \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

\`Box\`'ın \`Debug\`'ı şeffaftır — box'ı değil, gösterdiği şeyi yazdırır.

### İpuçları

- \`match e\` içinde \`Num(n)\` kolu \`n: &i64\` bağlar, dolayısıyla \`*n\` döndür.
- \`Add(a, b)\` kolu \`&Box<Expr>\` bağlar; recursive çağrıda bu \`&Expr\`'e coerce olur.
`,
  },

  "rust-smart-pointers-2": {
    instructions: `## Sahipleri say

\`Rc<T>\`, **tek bir thread** için reference count'lu paylaşımlı sahipliktir. \`Rc::clone\` bir sayacı artırır; sayaç sıfıra ulaştığında değer serbest bırakılır.

\`x.clone()\` değil, \`Rc::clone(&x)\` yaz — çağrı noktasında bunun derin bir kopya değil, bir sayaç artışı olduğunu söyler.

### Görevin

1. \`timeout=30s\` tutan bir \`String\`'i bir \`Rc\` içine sar, \`Rc::strong_count\`'u yazdır.
2. \`Rc::clone\` ile iki clone yap, sayacı yeniden yazdır ve değeri onlardan biri üzerinden yazdır.
3. Bir clone'u \`drop\` et ve sayacı bir kez daha yazdır.

Beklenen çıktı:

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\`

### İpuçları

- \`use std::rc::Rc;\`
- \`Rc::strong_count(&config)\` bir referans alır.
`,
  },

  "rust-smart-pointers-3": {
    instructions: `## Runtime'da kontrol edilen borrow

\`RefCell<T>\` borrow kurallarını korur ve *kontrolü* çalışma zamanına taşır; orada bir ihlal **panic** üretir. Bir \`&self\` üzerinden mutasyona — interior mutability (iç değiştirilebilirlik) — izin veren ve \`Rc<RefCell<T>>\`'yi paylaşımlı, yazılabilir bir değer yapan şey budur.

Guard'ları kısa tut: \`cell.borrow_mut().push(x)\` ifadenin sonunda serbest bırakırken \`let g = cell.borrow_mut();\` scope'un sonuna kadar tutar.

### Görevin

1. Boş bir vektör tutan bir \`Rc<RefCell<Vec<String>>>\` kur.
2. \`Rc\`'nin bir **clone**'u üzerinden \`started\` ve ardından \`ready\` push et — her biri kendi ifadesi olsun.
3. Uzunluğu, ardından ilk girdiyi yazdır.
4. Bir binding'de paylaşımlı bir borrow tut, \`try_borrow_mut()\`'un başarılı olup olmadığını yazdır, binding'i \`drop\` et ve yeniden yazdır.

Beklenen çıktı:

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\`

### İpuçları

- \`use std::cell::RefCell;\` ve \`use std::rc::Rc;\`
- \`RefCell::new(Vec::<String>::new())\` boş vektörün tipini belirtir.
`,
  },

  "rust-smart-pointers-4": {
    instructions: `## Sahiplik aşağı, referanslar yukarı

Birbirini gösteren iki \`Rc\` bir **döngü** (cycle) oluşturur — hiçbir sayaç sıfıra ulaşmaz ve bellek sızar. \`Weak<T>\` onu kırar: weak bir handle değere sahip değildir, dolayısıyla \`upgrade()\` bir \`Option<Rc<T>>\` döndürür.

Kural: ebeveynler çocuklarına strong olarak sahiptir, çocuklar geriye weak olarak işaret eder.

### Görevin

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`
2. Ebeveyni \`Weak::new()\` olan bir \`root\`, ardından ebeveyni \`Rc::downgrade(&root)\` olan bir \`leaf\` kur.
3. \`leaf\`'in bir clone'unu \`root\`'un çocuklarına push et.
4. root'un strong sayacını, ardından weak sayacını yazdır.
5. leaf'in ebeveynini \`upgrade()\` et ve adı, clone'lanmış bir \`String\`'e map'leyerek \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

Root'un strong sayacının 1'de kalması, döngünün oluşmaması demektir.

### İpuçları

- \`use std::rc::{Rc, Weak};\`
- \`leaf.parent.borrow().upgrade()\` bir \`Option<Rc<Node>>\` verir; \`.map(|p| p.name.clone())\` onu \`Option<String>\`'e çevirir.
`,
  },

  "rust-smart-pointers-5": {
    instructions: `## Yalnızca mecbur kaldığında allocate et

\`Cow<'a, T>\` bir enum'dur: \`Borrowed(&'a T)\` ya da \`Owned(T::Owned)\`. Bir fonksiyonun yaygın yolda borrow edilmiş veri döndürmesine ve yalnızca gerçekten bir şeyi değiştirdiğinde allocate etmesine izin verir.

Değiştiren yol **nadir** olduğunda kazandırır — on ikisinin değişmesi gereken bir milyon tanımlayıcıyı temizlemek bir milyon değil, on iki allocation yapar.

### Görevin

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — girdi bir boşluk içeriyorsa boşlukları \`_\` ile değiştirilmiş bir \`Cow::Owned\` döndür; aksi halde \`Cow::Borrowed\`.
2. Onu \`"get_events"\` ve \`"get events now"\` ile çağır.
3. Her biri için \`matches!(&value, Cow::Borrowed(_))\`'i kendi binding'inde hesapla, ardından değeri ve o bayrağı yazdır.

Beklenen çıktı:

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\`

### İpuçları

- \`use std::borrow::Cow;\`
- \`input.replace(' ', "_")\` bir \`String\` döndürür.
- Bayrağı \`println!\`'den önce hesapla ki formatlamanın ortasında hiçbir şey move edilmesin.
`,
  },

  "rust-smart-pointers-6": {
    instructions: `## Bir smart pointer kur

\`Deref\` sana \`*\` operatörünü **ve** deref coercion'ı verir — \`wrapper.method()\`, hedefin metodlarını bulur. \`Box\`, \`Rc\`, \`String\` ve \`Vec\`'in yaptığının tamamı budur; derleyici sihri yoktur.

Metod çözümlemesi önce wrapper'da arar, sonra \`Deref\`'i izler. \`Rc\`'nin bir metod yerine \`Rc::clone(&x)\` kullanmasının sebebi budur — inherent bir metod hedefinkini gölgelerdi.

### Görevin

1. \`fn new(inner: T) -> Self\` ve \`fn reads(&self) -> u32\` ile \`struct Tracked<T> { inner: T, reads: Cell<u32> }\`.
2. \`type Target = T;\` ile \`impl<T> Deref for Tracked<T>\`, yani \`fn deref(&self) -> &T\` — \`&self.inner\`'ı döndürmeden önce \`reads\`'i artırsın.
3. \`&mut self.inner\` döndüren \`impl<T> DerefMut for Tracked<T>\` — sayım yok.
4. \`main\`'de: \`vec![1, 2, 3]\`'ü sar, coercion üzerinden \`.len()\`'i yazdır, \`DerefMut\` üzerinden \`push(4)\` yap, \`*v\`'yi \`{:?}\` ile yazdır, ardından okuma sayısını yazdır.

Beklenen çıktı:

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

İki okuma: \`.len()\` ve \`*v\`. \`push\`, \`deref_mut\` üzerinden geçer ve \`reads()\` inherent olduğundan asla coerce etmez.

### İpuçları

- \`use std::cell::Cell;\` ve \`use std::ops::{Deref, DerefMut};\`
- Düz bir \`u32\` yerine \`Cell\` kullanılıyor, çünkü \`deref\`'in elinde yalnızca \`&self\` var.
`,
  },
};
