// TR · editor instructions — Ownership, Moves & Drops.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-ownership-deep.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustOwnershipDeepInstructionsTr: Record<string, { instructions: string }> = {
  "rust-ownership-deep-1": {
    instructions: `## Bir değer gerçekte nerede yaşar

\`std::mem::size_of::<T>()\` bir **compile-time** sabitidir: \`T\`'nin bir stack frame'de kaç byte kapladığını raporlar. Heap hakkında hiçbir şey bilmez, çünkü heap boyutu bir runtime değeridir.

- \`size_of::<i32>()\` → \`4\`. Değerin tamamı o 4 byte'tır.
- \`size_of::<String>()\` → 64-bit hedefte \`24\`. Bu *handle*'dır: pointer, uzunluk, kapasite. Karakterler başka bir yerdedir.
- \`name.len()\` → heap'te gerçekten tutulan byte'lar.

### Görevin

Üçünü de bu sırayla yazdır.

Beklenen çıktı:

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

### İpuçları

- \`use std::mem::size_of;\` sayesinde doğrudan \`size_of::<i32>()\` yazabilirsin.
- String \`"stellar"\` — yedi ASCII byte'ı.
`,
  },

  "rust-ownership-deep-2": {
    instructions: `## Move, copy, clone

Atama tam olarak iki şeyden birini yapar:

- Tip \`Copy\` ise (her alanı \`Copy\`'dir ve \`Drop\` impl'i yoktur) → bit'ler çoğaltılır, iki binding de kullanılabilir kalır.
- Aksi halde → ownership (sahiplik) **move** edilir ve kaynak binding ölür.

\`.clone()\`, \`=\`'in sessizce yapmayı reddettiği derin kopyayı istemenin açık yoludur.

### Görevin

Üç davranışı da göster:

1. \`10\`'u \`a\`'ya, sonra \`a\`'yı \`b\`'ye bağla. İkisini de yazdır — \`i32\` \`Copy\`'dir, dolayısıyla bu geçerli.
2. \`ledger\` tutan bir \`String\` oluştur, \`clone()\` ile \`s2\`'ye kopyala, ikisini de yazdır.
3. \`s2\`'yi \`s3\`'e move et ve \`s3\`'ü yazdır.

Beklenen çıktı:

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\`
`,
  },

  "rust-ownership-deep-3": {
    instructions: `## Bir alanı al, gerisini koru

Ownership **alan başına** takip edilir. Bir struct'tan tek bir alanı move etmek struct'ı kısmen move edilmiş bırakır: o alan ölüdür, diğerleri hâlâ okunabilir.

\`\`\`rust
let id = acct.id;              // yalnızca bu alanı move eder
println!("{}", acct.balance);  // hâlâ sorun yok
\`\`\`

Struct artık *bütün olarak* kullanılamaz — başka yere geçirmek yok, \`{:?}\` yok — ama bozulmamış bir alanı okumaya izin vardır.

### Görevin

1. \`struct Account { id: String, balance: i64 }\` tanımla.
2. id'si \`GA7Q\`, balance'ı \`250\` olan bir tane oluştur.
3. **Yalnızca** \`id\`'yi kendi binding'ine move et.
4. id'yi, sonra struct'ın hâlâ tuttuğu balance'ı yazdır.

Beklenen çıktı:

\`\`\`text
id: GA7Q
balance: 250
\`\`\`
`,
  },

  "rust-ownership-deep-4": {
    instructions: `## Mutasyondan önce borrow'u bitir

Bir borrow (ödünç alma) bloğun sonuna kadar değil, **son kullanımına** kadar sürer. Dolayısıyla bir aliasing hatası genellikle clone'layarak değil, borrow'la işini daha erken bitirerek — ya da içinden sahipli bir özet çıkararak — düzelir.

\`\`\`rust
let total: i32 = ledger.iter().sum();  // borrow bu ifadede başlar ve biter
ledger.push(total);                    // &mut artık serbestçe alınabilir
\`\`\`

### Görevin

\`let mut ledger = vec![10, 20, 30];\` verildiğinde:

1. Bir iterator ile girdileri \`total\`'a topla.
2. \`total\`'ı \`ledger\`'a push et.
3. Vektörü \`{:?}\` ile, sonra toplamı yazdır.

Beklenen çıktı:

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\`
`,
  },

  "rust-ownership-deep-5": {
    instructions: `## Deref coercion ve reborrowing

**Deref coercion** (örtük dönüşüm) çağrı noktasında \`&String\`'i \`&str\`'ye bedavaya dönüştürür. Bir parametrenin \`&str\` olması gerekmesinin sebebi budur: hem borrow edilmiş bir \`String\`'i hem de bir literal'ı kabul eder.

**Reborrowing** (yeniden ödünç alma), \`&mut T\`'yi birden fazla kez kullanılabilir kılan şeydir. \`&mut T\` \`Copy\` değildir, dolayısıyla onu geçirmek onu move etmeliydi — onun yerine derleyici \`&mut *handle\` geçirir: çağrılan fonksiyon döndüğünde sona eren taze, daha kısa bir borrow.

### Görevin

1. Uzunluğu döndüren \`fn describe(s: &str) -> usize\` yaz ve \`soroban\` tutan bir \`&String\` ile çağır.
2. \`1\` ekleyen \`fn bump(n: &mut i64)\` yaz.
3. \`let mut seq = 41;\` bağla ve \`let handle = &mut seq;\` al.
4. \`bump\`'ı iki kez çağır: bir kez \`handle\` geçirerek (örtük reborrow), bir kez \`&mut *handle\` geçirerek (açık).
5. \`seq\`'in son değerini yazdır.

Beklenen çıktı:

\`\`\`text
len: 7
seq: 43
\`\`\`
`,
  },

  "rust-ownership-deep-6": {
    instructions: `## Drop sırası ve RAII

Bir değer kapsam dışına çıktığında Rust onun \`Drop\` impl'ini çalıştırır. \`finally\` yoktur ve unutulacak bir şey de yoktur.

**Yerel değişkenler ters bildirim sırasıyla drop edilir** — son bildirilen ilk serbest bırakılır. (Struct *alanları* bildirim sırasıyla drop edilir; bu asimetri bilinçlidir.)

\`MutexGuard\`'ın arkasındaki mekanizmanın tamamı budur: kritik bir bölümü \`{ }\` içine almak, lock'u kapanan süslü parantezde serbest bırakır.

### Görevin

1. \`struct Guard(&'static str)\` tanımla.
2. Onun için \`release <name>\` yazdıran bir \`Drop\` implemente et.
3. \`main\` içinde: \`outer\` adlı bir guard oluştur, sonra \`inner\` adlı bir guard ve \`println!("inside")\` içeren bir blok aç. Bloktan sonra \`outside\` yazdır.

Beklenen çıktı:

\`\`\`text
inside
release inner
outside
release outer
\`\`\`
`,
  },
};
