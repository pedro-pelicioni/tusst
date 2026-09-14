// TR · editor instructions — Lifetimes.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-lifetimes.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustLifetimesInstructionsTr: Record<string, { instructions: string }> = {
  "rust-lifetimes-1": {
    instructions: `## Çıktıyı girdilerine bağla

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Bunu çağırana verilmiş bir söz gibi oku: *bana iki referans ver, geri verdiğim referans iki girdi de geçerli olduğu sürece geçerli kalsın.* Hiçbir şey allocate edilmez, hiçbir şey uzatılmaz — \`'a\` yalnızca derleyicinin çıktıyı girdilere bağlamasını sağlar.

### Görevin

Uzun olan argümanı döndüren \`longest\` fonksiyonunu implemente et (uzunluklar eşitse \`a\`'yı döndür).

\`main\` içinde onu \`soroban\` tutan bir \`&String\` ve \`"rpc"\` literal'iyle çağır.

Beklenen çıktı:

\`\`\`text
longest: soroban
\`\`\`

### İpuçları

- Bir \`&str\` üzerinde \`.len()\` byte uzunluğunu verir.
- \`if\`/\`else\` bir ifadedir — fonksiyonun kuyruğu olabilir.
`,
  },

  "rust-lifetimes-2": {
    instructions: `## Bırak elision işini yapsın

Üç kural, yazmadığın lifetime'ları (yaşam sürelerini) doldurur:

1. Elide edilmiş her girdi referansı kendi lifetime parametresini alır.
2. **Tam olarak bir** girdi lifetime'ı varsa, elide edilmiş her çıktıya o atanır.
3. Bir \`&self\` alıcısı varsa, elide edilmiş her çıktıya **self'in** lifetime'ı atanır.

### Görevin

1. \`fn first_word(s: &str) -> &str\` — ilk boşluktan önceki her şey, boşluk yoksa string'in tamamı. Kural 2 sayesinde annotation gerekmez.
2. \`impl<'a> Parser<'a>\` ve \`self.input\` döndüren \`fn rest(&self) -> &str\` ile birlikte \`struct Parser<'a> { input: &'a str }\`. Metodu kural 3 kapsar.
3. \`first_word("submit tx now")\` sonucunu, ardından \`"ledger 42"\` üzerine kurulmuş bir parser'da \`rest()\` sonucunu yazdır.

Beklenen çıktı:

\`\`\`text
word: submit
rest: ledger 42
\`\`\`

### İpuçları

- \`s.find(' ')\`, \`Option<usize>\` döndürür — ilk eşleşmenin byte indeksi.
- \`&s[..i]\` o indekse kadar dilimler.
`,
  },

  "rust-lifetimes-3": {
    instructions: `## İki lifetime, biri önemsiz

İki girdi birbirinden bağımsızsa onları ayrı ayrı adlandır. Önemli olan hangisinin **çıktıda** göründüğüdür:

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

Bu, çağırana sonucun \`text\`'ten borrow ettiğini, \`sep\`'ten etmediğini söyler — dolayısıyla \`sep\` hemen drop edilebilir.

### Görevin

\`prefix\`'i implemente et: \`text\` içinde \`sep\`'in ilk geçtiği yerden öncesi, hiç geçmiyorsa \`text\`'in tamamı.

\`main\` içinde:

1. \`let text = String::from("GA7Q:250:live");\`
2. Bir **iç blokta** \`":"\` tutan bir ayırıcı \`String\` yarat, \`prefix\`'i çağır ve bloğun sonuca evaluate olmasını sağla.
3. Sonucu bloktan *sonra* yazdır — ayırıcının artık var olmadığı yerde.

Beklenen çıktı:

\`\`\`text
prefix: GA7Q
\`\`\`

Derleniyorsa, sonucun ayırıcıdan borrow etmediğini kanıtlamışsın demektir.
`,
  },

  "rust-lifetimes-4": {
    instructions: `## Zero-copy bir görünüm

Referans tutan bir struct'ın lifetime parametresine ihtiyacı vardır; bu parametre struct'ın içini gösterdiği buffer'dan daha uzun yaşamayacağına söz verir:

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

Her zero-copy parser'ın şekli budur: alan başına bir \`String\` yerine başkasının buffer'ından dilimler.

### Görevin

1. \`Frame<'a>\`'yı yukarıdaki gibi tanımla.
2. \`impl<'a> Frame<'a>\` içinde, ilk \`'|'\`'de bölen \`fn parse(raw: &'a str) -> Frame<'a>\` fonksiyonunu yaz. Öncesi \`method\`, sonrası \`params\`. \`'|'\` yoksa \`method\` girdinin tamamı, \`params\` ise \`""\` olur.
3. \`main\` içinde \`getLedgerEntries|[42]\` tutan bir \`String\`'i parse et ve iki alanı da yazdır.

Beklenen çıktı:

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

\`parse\` içinde hiçbir yerde \`String\` allocation'ı yok.
`,
  },

  "rust-lifetimes-5": {
    instructions: `## 'static iki farklı anlama gelir

**\`&'static T\`** — programın tamamı boyunca geçerli bir referans. String literal'leri bunu sağlar; çalışma zamanında hesaplanan neredeyse hiçbir şey sağlamaz.

**\`T: 'static\`** — tipin **kısa ömürlü hiçbir referans içermediği** anlamına gelen bir bound. Owned bir \`String\` bunu kolayca sağlar ve yine de kapsamının sonunda drop edilir. \`thread::spawn\` ve \`tokio::spawn\`'ın istediği bound budur: bir task kendisini spawn edenden uzun yaşayabilir, dolayısıyla onun yerel değişkenlerini borrow edemez.

### Görevin

1. \`baked into the binary\` tutan bir \`&'static str\`'i **açık tip annotation'ıyla** bağla ve yazdır.
2. Argümanını olduğu gibi döndüren \`fn spawn_like<T: Send + 'static>(value: T) -> T\` fonksiyonunu yaz.
3. \`owned at runtime\` tutan owned bir \`String\`'i içinden geçir ve sonucu yazdır — owned bir \`String\`'in \`'static\`'i sağladığını kanıtla.

Beklenen çıktı:

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\`
`,
  },
};
