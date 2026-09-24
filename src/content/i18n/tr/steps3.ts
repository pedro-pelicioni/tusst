import type { LessonStep } from "@/content/steps";

// TR · Localized lesson steps — PART 3 (soroban-smart-contracts, stellar-protocol-27, rust-standard-library-7/8).
export const steps3: Record<string, LessonStep[]> = {
  "soroban-smart-contracts-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `İstifçi'nin kasasında \`struct\` ve \`impl\`'i öğrendin: bir taslak ve ona davranış kazandıran kod. Kontratlar da aynı iki parçayı kullanır.

\`\`\`rust
#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract { /* ... */ }
\`\`\`

\`#[contract]\` ve \`#[contractimpl]\`, ledger'ın host'unun aynı struct ve impl'in üstünde okuduğu işaretler — yeni bir sözdizimi değil, üzerine mühür basılmış aynı biçim.`,
    },
    {
      kind: "theory",
      body: `Forgeborn, Kapı'nın ötesinde kurallar değişiyor. Bir **Soroban kontratı**, WASM'a derlenip Stellar ledger'ında saklanan bir Rust kütüphanesidir — orada herkes onu çağırabilir.

\`\`\`rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env};
\`\`\`

\`#![no_std]\` süs değil: on-chain'de OS yok, allocator yok, \`std\` yok. Makine artık ledger'ın kendisi ve senin standart kütüphanen \`soroban_sdk\`.`,
    },
    {
      kind: "theory",
      body: `İki attribute, sıradan Rust'ı kontrata çevirir:

\`\`\`rust
#[contract]
pub struct HelloContract;      // kontratın kimliği

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env) -> Symbol { ... }
}
\`\`\`

\`#[contractimpl]\` her \`pub fn\`'i çağrılabilir bir giriş noktası olarak dışa açar. Her biri ilk parametre olarak \`Env\` alır — storage'a, event'lere ve diğer kontratlara açılan kapın.`,
    },
    {
      kind: "theory",
      body: `On-chain'de her byte kiradır. String'ler ağırdır — bu yüzden kısa tanımlayıcılar \`Symbol\` kullanır, ledger'a özgü kompakt bir tip:

\`\`\`rust
use soroban_sdk::{symbol_short, Symbol};

let s: Symbol = symbol_short!("beacon");  // ≤ 9 karakter, [a-zA-Z0-9_]
\`\`\`

Bir web geliştiricisinin \`"ok"\` döndürdüğü yerde, bir Soroban geliştiricisi \`symbol_short!("ok")\` döndürür.`,
    },
    {
      kind: "quiz",
      question: "Bir Soroban kontratı neden `#![no_std]` ile başlar?",
      options: [
        "On-chain'de OS ya da allocator yok — tam std orada var olamaz",
        "Derlemeyi hızlandırır",
        "Sadece tercih meselesi — std on-chain'de gayet iyi çalışır",
      ],
      answer: 0,
      explain: "Ledger'daki WASM'ın altında bir işletim sistemi yok. std'nin yerini SDK alır.",
    },
    {
      kind: "fill",
      prompt: "impl bloğunu kontratın herkese açık arayüzü olarak dışa aç.",
      file: "lib.rs",
      before: "#[contract]\npub struct HelloContract;\n\n",
      after: "\nimpl HelloContract {\n    pub fn hello(env: Env) -> Symbol { /* ... */ }\n}",
      choices: ["#[contractimpl]", "#[contract]", "#[export]"],
      answer: 0,
      explain: "#[contract] struct'ı işaretler; #[contractimpl] fonksiyonları dışa açar.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — ilk gök rününü kazı

1. impl bloğunu \`#[contractimpl]\` ile işaretle.
2. \`hello\`'nun \`symbol_short!("beacon")\` döndürmesini sağla — ve \`todo!()\`'yu kaldır.

Beklenen çağrı:

\`\`\`text
hello() → Symbol(beacon)
\`\`\``,
    },
  ],

  "soroban-smart-contracts-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Kontratlar **çağrılar arasında hafıza tutmaz** — her yerel değişken, çağrı dönünce ölür. State, **ledger**'da yaşar; \`env.storage()\`'ın arkasında.

Kontrat geneli state için (sayaçlar, config, admin) doğru raf **instance storage**:

\`\`\`rust
env.storage().instance()
\`\`\`

Kontratın kendi ömrünü paylaşır — birlikte arşivlenir, birlikte geri yüklenir.`,
    },
    {
      kind: "theory",
      body: `Okuma ve yazma simetriktir ve her şey **referansla** geçer:

\`\`\`rust
const COUNTER: Symbol = symbol_short!("COUNTER");

let count: u32 = env.storage().instance()
    .get(&COUNTER)
    .unwrap_or(0);

env.storage().instance().set(&COUNTER, &count);
\`\`\`

\`get\` bir \`Option<T>\` döndürür — anahtar hiç yazılmamış olabilir ya da kirası (TTL) dolmuş olabilir. \`unwrap_or(0)\`, sayaç kalıbıdır.`,
    },
    {
      kind: "quiz",
      question: "`storage().get(&KEY)` neden `T` yerine `Option<T>` döndürür?",
      options: [
        "Anahtar hiç yazılmamış olabilir — ya da TTL'i dolmuş olabilir",
        "Tutarlılık için tüm SDK fonksiyonları Option döndürür",
        "Tip uyuşmazlıklarında hata yönetimini zorlamak için",
      ],
      answer: 0,
      explain: "Ledger storage'ı kiralanır, sahiplenilmez. Yokluk normal bir durumdur — ele al.",
    },
    {
      kind: "fill",
      prompt: "Sayaç hiç yazılmamışsa varsayılan olarak 0 kullan.",
      file: "lib.rs",
      before: "let count: u32 = env.storage().instance().get(&COUNTER).",
      after: ";",
      choices: ["unwrap_or(0)", "unwrap()", "expect(\"0\")"],
      answer: 0,
      explain: "unwrap() ilk çağrıda panic'lerdi — unwrap_or(0) yokluğu bir başlangıç noktasına çevirir.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — ledger'a hatırlat

\`increment\`'i yaz:

1. Sayacı instance storage'dan \`&COUNTER\` altında oku — varsayılan \`0\`.
2. \`1\` ekle.
3. Geri yazmak için \`set(&COUNTER, &count)\` çağır.
4. Yeni sayacı döndür (ve \`todo!()\`'yu kaldır).

Beklenen çağrı:

\`\`\`text
increment() → 1
\`\`\``,
    },
  ],

  "soroban-smart-contracts-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Herkese açık bir kontrat fonksiyonunu herkes çağırabilir ve argüman olarak **herhangi bir** \`Address\` geçebilir. Peki bir kasa, çağıranın gerçekten iddia ettiği kişi olduğunu nereden bilir?

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    from.require_auth();   // ← mühür
    // ...
}
\`\`\`

\`require_auth()\`, \`from\`'un tam olarak bu çağrıyı gerçekten **imzaladığını** (ya da önceden yetkilendirdiğini) doğrular. İmzalamadıysa çağrı **trap'e düşer** — geri alınır, state'e dokunulmaz.`,
    },
    {
      kind: "theory",
      body: `Beholder'ın kalesi tam da bu satırın yokluğu üzerine kuruldu. O satır olmadan:

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    // require_auth yok ← herkes SENİN adresini geçip seni boşaltır
}
\`\`\`

Diyarın kuralı: **değer taşıyan ya da birinin state'ini değiştiren her fonksiyon o kişinin auth'unu ister — ilk satırda, her şeyden önce.**`,
    },
    {
      kind: "quiz",
      question: "`from.require_auth()` başarısız olursa ne olur?",
      options: [
        "Çağrı trap'e düşer — her şey geri alınır, state'e dokunulmaz",
        "false döndürür ve fonksiyon devam eder",
        "Ledger'a bir uyarı loglar",
      ],
      answer: 0,
      explain: "Auth hatası ele alınacak bir durum değildir — çağrıyı olduğu yerde öldürür.",
    },
    {
      kind: "fill",
      prompt: "Kasayı mühürle: imzalayanın yetkisini iste.",
      file: "lib.rs",
      before: "pub fn withdraw(env: Env, from: Address, amount: i128) {\n    from.",
      after: ";\n    // transfer logic...\n}",
      choices: ["require_auth()", "verify()", "is_signed()"],
      answer: 0,
      explain: "require_auth() — Soroban'daki en önemli satır.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — imzalayanın mührü

Kasayı koru: \`withdraw\` içinde, her şeyden **önce** \`from\`'dan yetki iste.

Tek satır. Beholder onun yokluğu yüzünden düştü.

Beklenen çağrı:

\`\`\`text
withdraw: authorized ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Beholder gitti — ve gökyüzünün kendisi değişiyor. Stellar **konsensüsle** yükseltilir: validator'lar yeni bir protokol sürümünü kurmak için oy verir ve planlanan ledger'da *tüm ağ* aynı anda geçiş yapar. Fork yok, geride kalan yok.

İşte **protokol yükseltmesi** budur: gökyüzünün tek, koordineli bir dönüşü.`,
    },
    {
      kind: "theory",
      body: `**Protocol 27**, kod adı **"Zipper"**, 2026'nın yükseltmesi — ve zaman çizelgesi çoktan yaşandı:

- Stellar Core kararlı sürüm — **5 Haziran 2026**
- SDK'lar — 5–11 Haziran · RPC & Galexie — 10 Haziran · Horizon — 12 Haziran
- **Testnet yükseltildi — 18 Haziran 2026**
- **Mainnet oylaması — 8 Temmuz 2026**

Planın tamamı resmi [Protocol 27 yükseltme rehberinde](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide) yaşıyor.`,
    },
    {
      kind: "theory",
      body: `Zipper aslında neyi değiştiriyor? İki manşet özellik de [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) içinde yaşıyor:

1. **Kimlik doğrulama delegasyonu** — custom account'lar auth kontrolünü başka bir kontrata devredebilir.
2. **Adrese bağlı imzalar** — yalnızca kendi kapısını açan bir mühür.

(Önceki yükseltmeler CAP-0055, 0060 ve 0064'ü getirmişti — Zipper ise hesapların *kim olduklarını nasıl kanıtladığıyla* ilgili.) Bileşenlerin güncel sürümlerini [Software Versions](https://developers.stellar.org/docs/networks/software-versions) sayfasından takip et.`,
    },
    {
      kind: "quiz",
      question: "Bir Stellar protokol yükseltmesi nasıl yürürlüğe girer?",
      options: [
        "Validator'lar kurmak için oy verir; planlanan ledger'da tüm ağ aynı anda geçiş yapar",
        "Her node canı istediğinde yükseltir ve sürümler bir arada yaşar",
        "Foundation kendi sunucularında bir düğmeye basar",
      ],
      answer: 0,
      explain: "Ferman değil, konsensüs: oy onu kurar, tek bir ledger tüm gökyüzünü döndürür.",
    },
    {
      kind: "quiz",
      question: "Protocol 27 Mainnet oylaması ne zaman yapıldı?",
      options: ["8 Temmuz 2026", "18 Haziran 2026", "Henüz yapılmadı"],
      answer: 0,
      explain: "Testnet 18 Haziran'da döndü; Mainnet 8 Temmuz 2026'da oyladı. Zipper canlıda.",
    },
    {
      kind: "fill",
      prompt: "Fener'i validator'ların oyladığı sürümle kur.",
      file: "lib.rs",
      before: "pub const PROTOCOL_VERSION: u32 = ",
      after: ";",
      choices: ["27", "26", "28"],
      answer: 0,
      explain: "Protocol 27 — Zipper. (28, V1 credential'ların ölmeye gittiği yer.)",
    },
    {
      kind: "editor",
      intro: `### Son sınav — yükseltme fenerini yak

Yeniden dövülüşün gerçeklerini kaydet:

1. \`PROTOCOL_VERSION\` — ağın oyladığı sürüm.
2. \`CODENAME\` — küçük harflerle.
3. \`MAINNET_VOTE\` — \`YYYY-MM-DD\`.

Beklenen:

\`\`\`text
beacon lit: protocol 27 (zipper) ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Beholder'ın ininde bir kasayı \`require_auth()\` ile mühürledin. Peki mührü kim *doğruluyor*?

Normal bir hesap için protokol, hesabın anahtarlarına karşı bir ed25519 imzasını kontrol eder. Ama Soroban'da bir \`Address\` bir **kontrata** da ait olabilir — ve o zaman olağanüstü bir şey olur.`,
    },
    {
      kind: "theory",
      body: `\`require_auth\`, bir kontrata ait \`Address\` için tetiklendiğinde host o kontratın kendi giriş noktasını çağırır:

\`\`\`rust
pub fn __check_auth(
    env: Env,
    signature_payload: Hash<32>,
    signatures: ...,
    auth_contexts: Vec<Context>,
) { ... }
\`\`\`

Hesap bir kontrat**tır** ve \`__check_auth\` onun özel imza yasasıdır. Dönerek onayla; trap'e düşerek reddet.`,
    },
    {
      kind: "theory",
      body: `Her **custom account** sadece farklı bir \`__check_auth\`'tur:

- **Multisig** — 3 imzadan 2'sini iste
- **Sosyal kurtarma** — güvenilir arkadaşların kayıp bir anahtarı değiştirmesine izin ver
- **Passkey'ler** — ed25519 yerine bir WebAuthn imzası doğrula
- **Account abstraction** — Rust'ta yazabildiğin her kural

OpenZeppelin gibi inşacılar bunları zaten dövüyordu; [Protocol 27 zor kısımları birinci sınıf yapıyor](https://developers.stellar.org/meetings/2026/04/30#protocol-discussion-modular-custom-accounts-and-signature-security-in-protocol-27).`,
    },
    {
      kind: "quiz",
      question: "`__check_auth`'u kim çağırır?",
      options: [
        "Soroban host'u — require_auth bir custom account kontratına ait Address için her tetiklendiğinde",
        "Kullanıcı, her işlemden önce elle",
        "Derleyici, build zamanında",
      ],
      answer: 0,
      explain: "Host'un callback'i: kontratın, kendi mühürlerinin yargıcı olur.",
    },
    {
      kind: "fill",
      prompt: "Host'un bir custom account üzerinde çağırdığı giriş noktasını adlandır.",
      file: "lib.rs",
      before: "impl GuardianAccount {\n    pub fn ",
      after: "(env: Env, payload: Hash<32>, sig: BytesN<64>, ctx: Vec<Context>) {",
      choices: ["__check_auth", "check_auth", "require_auth"],
      answer: 0,
      explain: "Çift alt çizgi: __check_auth, host'un aradığı ayrılmış isimdir.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — hesap kendi yasasını yazar

1. impl bloğunu \`#[contractimpl]\` ile dışa aç.
2. Yer tutucuyu host'un gerçekten çağırdığı giriş noktasıyla yeniden adlandır.

Beklenen:

\`\`\`text
__check_auth: the account writes its own law ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Her şeyi tek bir anahtarın koruması, tek bir hata noktası demektir. Gerçek hesaplar şunu demek ister: *"kâhyam benim adıma kefil olsun."*

Zipper'dan önce protokolde bunun desteği yoktu — inşacılar delegasyonu, auth bağlamını yaymak için kırılgan **ön simülasyon** turlarıyla taklit ediyordu. Çalışıyordu. Zar zor. Bazen.`,
    },
    {
      kind: "theory",
      body: `Protocol 27 (CAP-0071-01), delegasyonu iki yeni host function ile yasa yapıyor:

\`\`\`rust
// SADECE __check_auth içinde:
delegate_account_auth(&delegate, &payload);

// ve çağrılan kontrat için:
get_delegated_signers_for_current_auth_check()
\`\`\`

İlki, mevcut auth kontrolünü delegenin kendi imza mantığına devreder. İkincisi, hangi delege imzacıların onayladığını açığa çıkarır.`,
    },
    {
      kind: "theory",
      body: `Aktarım formatı da eşleşen bir yükseltme aldı: \`SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES\` credential tipi, delege imzacıları ve imzalarını **tek** bir yetkilendirme girdisinde paketler.

Daha küçük işlemler, daha basit simülasyon — delegasyon kırılgan bir geçici çözümden desteklenen bir kalıba dönüşüyor. Tam spec: [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) · [CAP-71 özeti](https://developers.stellar.org/meetings/2026/04/30#cap-71-recap-authentication-delegation-for-custom-accounts).`,
    },
    {
      kind: "quiz",
      question: "`delegate_account_auth`, bir custom account'a ne yapma imkânı verir?",
      options: [
        "Mevcut auth kontrolünü bir delege kontratın kendi imza mantığına devretme",
        "Hesabın sahipliğini kalıcı olarak aktarma",
        "İmza doğrulamasını tamamen atlama",
      ],
      answer: 0,
      explain: "Taç sende kalır — kâhyaya yalnızca *kontrol* devredilir, çağrı başına.",
    },
    {
      kind: "fill",
      prompt: "Bu auth kontrolünü storage'daki kâhyaya devret — Protocol 27 usulü.",
      file: "lib.rs",
      before: "// __check_auth içinde:\n",
      after: "(&delegate, &signature_payload);",
      choices: ["delegate_account_auth", "require_auth", "get_delegated_signers_for_current_auth_check"],
      answer: 0,
      explain: "delegate_account_auth — yalnızca __check_auth içinde çağrılabilir, Protocol 27 ile yeni.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — tacı devret

Kâhyanın \`Address\`'i zaten yüklü. \`delegate_account_auth\`'u delege ve signature payload ile çağır — ve \`todo!()\`'yu kaldır.

Beklenen:

\`\`\`text
crown delegated: steward honored ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `**Replay saldırısı**, yeni isimli eski bir numaradır: geçerli bir şeyi al — bir imza, basılmış bir mühür, bir bilet koçanı — ve onu asla işe yaramaması gereken bir yerde yeniden kullan. İmzalayan ikinci kullanıma hiç onay vermedi. Mührün kendisinin hafızası yok; kendisine ikinci kez sorulduğunu anlayamaz.`,
    },
    {
      kind: "theory",
      body: `Yankı Hayaleti'nin versiyonu aynı anda üç şey ister:

1. İmzalanan payload'da **imzalayanın adresini adlandırmayan** admin tarzı bir kontrat.
2. Admin farklı bir adrese **rotasyonla değiştirilir**…
3. …ve iki adres de **aynı private key'i** paylaşır.

O zaman eski kapı için yapılmış bir mühür yenisini açar. Mükerrer mint'ler. Yetkisiz hareketler.`,
    },
    {
      kind: "theory",
      body: `Bu kombinasyon on-chain'de **hiç yaşanmadı** — ama olası hasarın çapı bir protokol düzeltmesini haklı çıkardı.

**\`SOROBAN_CREDENTIALS_ADDRESS_V2\`** (CAP-0071-02), signature payload'ı yapıldığı adrese bağlar. Çalınmış bir yankı artık başka bir kapıya uymaz.

Eski \`SOROBAN_CREDENTIALS_ADDRESS\`, **Protocol 28'e kadar** geçerli kalır — uçurum değil, bir geçiş penceresi.`,
    },
    {
      kind: "theory",
      body: `Geçiş yapana kadar admin tarzı kontratlar için geçici bir önlem var: **imzalayanın adresini payload'a kendin ekle** — o zaman paylaşılan anahtarla rotasyon yankılanamaz.

\`\`\`rust
let me: Address = env.current_contract_address();
// \`me\`'yi imzalanan malzemeye ekle
\`\`\`

Derinlemesine incelemeyi izle: [Stellar Developer Meeting — signature security](https://www.youtube.com/watch?v=5O1cDDGv7_o).`,
    },
    {
      kind: "quiz",
      question: "V2 credential'lar hangi saldırıyı kapatır?",
      options: [
        "Geçerli bir signature payload'ı, aynı imza anahtarını paylaşan farklı bir hesaba karşı yeniden oynatmak",
        "ed25519 private key'lere brute-force yapmak",
        "İşlemleri ledger'a ulaşmadan önce front-run etmek",
      ],
      answer: 0,
      explain: "Adrese bağlı payload'lar: mühür kapısının adını söyler, yankı ölür.",
    },
    {
      kind: "quiz",
      question: "Eski SOROBAN_CREDENTIALS_ADDRESS ne zamana kadar geçerli kalır?",
      options: [
        "Protocol 28 yükseltmesine kadar",
        "Protocol 27 etkinleştiği anda çalışmayı bıraktı",
        "Sonsuza kadar — V2 isteğe bağlı",
      ],
      answer: 0,
      explain: "Bir geçiş penceresi: V2'yi kendi hızında benimse, ama Protocol 28'den önce.",
    },
    {
      kind: "fill",
      prompt: "Mührü kapısına bağlayan credential'ı söyle.",
      file: "lib.rs",
      before: "pub const CREDENTIALS: &str = \"SOROBAN_CREDENTIALS_",
      after: "\";",
      choices: ["ADDRESS_V2", "ADDRESS", "ADDRESS_WITH_DELEGATES"],
      answer: 0,
      explain: "V2 = adrese bağlı payload'lar. (WITH_DELEGATES, VIII.3'teki delegasyon paketi.)",
    },
    {
      kind: "editor",
      intro: `### Son sınav — mührü bağla

1. \`CREDENTIALS\`'ı V2 adına yükselt.
2. V1'in hangi protokole kadar geçerli kaldığını kaydet.
3. \`binding_address\` içinde, \`env.current_contract_address()\` ile bu kontratın kendi \`Address\`'ini döndür — \`todo!()\`'yu kaldır.

Beklenen:

\`\`\`text
seal bound to its door: the echo dies ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Sürüm kervanı katı bir sırayla yol aldı:

**Core → SDK'lar → RPC & Galexie → Horizon → Testnet → Mainnet**

Her SDK — Rust, JavaScript, Go, Java, Python, iOS, PHP, .NET, Flutter, Elixir — bir Protocol 27 sürümü yayınladı. Mainnet dönmeden önce hepsi yükseltilmiş olmalı. Seninkini [Software Versions](https://developers.stellar.org/docs/networks/software-versions) sayfasından kontrol et.`,
    },
    {
      kind: "theory",
      body: `Çoğu uygulamanın hissettiği tek **breaking change** — burada yeniden yazım olarak değil, bir gerçek olarak kayda geçiyor:

\`\`\`rust
// Zipper'dan önce JS uygulamaları "@stellar/stellar-base"den import ediyordu
// sonrasında — base paketi "@stellar/stellar-sdk" içinde birleştirildi
pub const JS_XDR_PACKAGE: &str = "@stellar/stellar-sdk";
\`\`\`

Hangi SDK ile yayınlıyor olursan ol, kervan yoluna devam eder. Geçiş notlarının geri kalanı [resmi rehberde](https://developers.stellar.org/meetings/2026/04/30#migration-guidance) yaşıyor.`,
    },
    {
      kind: "theory",
      body: `Forgeborn'un geçiş kontrol listesi:

1. **Her SDK'yı** ve istemci kütüphanesini yükselt.
2. \`stellar-base\` import'larını \`stellar-sdk\` olarak **yeniden adlandır**.
3. Protocol 28'den önce **V2 credential geçişini planla**.
4. **Node operatörleri**: Core, RPC, Galexie, Horizon — hepsi oylamadan önce yükseltilmiş olmalı.

Tam manifesto [yükseltme rehberinde](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide).`,
    },
    {
      kind: "quiz",
      question: "JS uygulaman `@stellar/stellar-base`den import ediyor. Protocol 27'den sonra…",
      options: [
        "Import'u değiştir — paket @stellar/stellar-sdk içinde birleştirildi",
        "Hiçbir şey değişmez; hâlâ ayrı yayınlanıyor",
        "Uygulamayı Rust'ta yeniden yazmalısın",
      ],
      answer: 0,
      explain: "Tek bir yeniden adlandırma. Base paketi sdk'nın içine girdi ve bir daha çıkmadı.",
    },
    {
      kind: "fill",
      prompt: "Kapı'dan geçen paketi kaydet.",
      file: "lib.rs",
      before: "pub const JS_XDR_PACKAGE: &str = \"@stellar/stellar-",
      after: "\";",
      choices: ["sdk", "base", "core"],
      answer: 0,
      explain: "stellar-base, Protocol 27 sürümlerinde stellar-sdk içinde birleştirildi.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — kervan manifestosunu onayla

1. \`JS_XDR_PACKAGE\` — eski base'i içine alan paket.
2. \`TESTNET_UPGRADE\` — \`YYYY-MM-DD\`.
3. \`UPGRADE_ALL_SDKS\` — *her* SDK Kapı'dan geçiyor mu?

Beklenen:

\`\`\`text
caravan cleared the Gate: nothing left behind ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Hayalet, çalınmış bir mühür ve kusursuz bir yankıyla kasana geliyor. Yeniden Yazılan Gök boyunca dövdüklerini masaya ser:

- \`__check_auth\` — hesabının kendi yasası (VIII.2)
- \`delegate_account_auth\` — kâhya tacı (VIII.3)
- adrese bağlı mühürler — yankı katili (VIII.4)

Üçünü tek bir hesapta birleştirme zamanı.`,
    },
    {
      kind: "theory",
      body: `\`ZipperAccount\` planı, \`__check_auth\` içinde:

\`\`\`rust
// 1) kök imzacının public key'i, storage'dan:
let signer: BytesN<32> = env.storage().instance().get(&SIGNER).unwrap();

// 2) kötü bir mühür trap'e düşmeli:
env.crypto().ed25519_verify(&signer, &payload.into(), &signature);

// 3) Protocol 27 hamlesi — gerisini kâhyaya devret:
delegate_account_auth(...)
\`\`\`

Önce imza, sonra delegasyon. Hayalet'in yankısı 2. adımda ölür; sahte bir kâhya 3. adımda.`,
    },
    {
      kind: "quiz",
      question: "`__check_auth` içinde Yankı Hayaleti'nin replay'ini ne bozar?",
      options: [
        "Bu hesaba bağlı bir payload'ı doğrulamak — çalınmış bir yankı başka bir adrese uymaz",
        "Hayalet'ten iki kat hızlı imzalamak",
        "Kendi üzerinde özyinelemeli olarak require_auth çağırmak",
      ],
      answer: 0,
      explain: "Bağlı mühürler + doğrulanmış imzalar: yankının açacak kapısı kalmadı.",
    },
    {
      kind: "fill",
      prompt: "Kötü bir mühür trap'e düşmeli — imzayı payload üzerinde doğrula.",
      file: "lib.rs",
      before: "env.crypto().",
      after: "(&signer, &signature_payload.into(), &signature);",
      choices: ["ed25519_verify", "sha256", "delegate_account_auth"],
      answer: 0,
      explain: "ed25519_verify kötü imzada trap'e düşer — bir mühür kontrolünün yapması gereken tam olarak bu.",
    },
    {
      kind: "editor",
      intro: `### Hayalet'in son yankısı

\`__check_auth\` içinde:

1. Kök imzacıyı (\`BytesN<32>\`) storage'dan \`SIGNER\` altında yükle.
2. Payload üzerindeki ed25519 imzasını doğrula — \`env.crypto().ed25519_verify(...)\`.
3. Kâhyayı \`DELEGATE\` altında yükle ve \`delegate_account_auth\`'u çağır.

impl bloğunu dışa aç. Finalden hiçbir \`todo!()\` sağ çıkmaz.

Beklenen:

\`\`\`text
__check_auth: signature verified, steward honored — the echo is silent ✓
\`\`\``,
    },
  ],

  "rust-standard-library-7": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Sıra kendi tiplerini tanımlamakta. Her biri bir **taslak** olarak başlar:

\`\`\`rust
struct Player {
    name: String,
    hp: i32,
}
\`\`\`

Bir \`struct\`, birkaç değeri tek bir isimli biçimde bağlar. Bir kez tanımla, her yerde yeniden kullan.`,
    },
    {
      kind: "theory",
      body: `Taslağa hayat vermek için her alanı doldur — bir **struct literal**:

\`\`\`rust
let hero = Player { name: String::from("Ferrisia"), hp: 100 };
\`\`\`

İçine bir noktayla uzan: \`hero.name\`, \`hero.hp\`. Anahtar yok, arama yok — alan basitçe değerin *bir parçasıdır*.`,
    },
    {
      kind: "quiz",
      question: "`struct Player { name: String, hp: i32 }` verildiğinde, `hero`'nun hp alanını nasıl okursun?",
      options: ["hero.hp", "hero[\"hp\"]", "hero::hp"],
      answer: 0,
      explain: "Nokta gösterimi doğrudan alana uzanır — arama yok, köşeli parantez yok.",
    },
    {
      kind: "fill",
      prompt: "hero için struct literal'ı tamamla.",
      file: "main.rs",
      before: "let hero = Player { name: String::from(\"Ferrisia\"), ",
      after: " };",
      choices: ["hp: 100", "hp = 100", "100"],
      answer: 0,
      explain: "Literal içinde her alan `alan: değer` biçiminde yazılır, virgülle ayrılır.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — en derin kasadaki taslak

1. \`struct Player { name: String, hp: i32 }\`'yi tanımla.
2. \`let hero = Player { name: String::from("Ferrisia"), hp: 100 };\` oluştur.
3. \`Ferrisia has 100 hp\` yazdır.

Beklenen çıktı:

\`\`\`text
Ferrisia has 100 hp
\`\`\``,
    },
  ],

  "rust-standard-library-8": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Tek başına bir taslak biçim tutar ama davranış tutmaz. Davranış bir \`impl\` bloğuna yazılır.

\`\`\`rust
impl Player {
    fn new(name: &str) -> Player {
        Player { name: String::from(name), hp: 100 }
    }
}
\`\`\`

\`new\`, \`self\` almaz — var olan bir Player üzerinde çalışmaz, bir tane *yaratır*. Onu bir değerle değil, tip adıyla çağır: \`Player::new("Ferrisia")\`.`,
    },
    {
      kind: "theory",
      body: `\`&self\` *alan* bir fonksiyon ise bir **metottur** — belirli bir instance üzerinde çalışır, noktayla çağrılır:

\`\`\`rust
impl Player {
    fn is_alive(&self) -> bool {
        self.hp > 0
    }
}

hero.is_alive();
\`\`\`

Struct'ı \`#[derive(Debug)]\` ile işaretle ki Rust bedavaya bir debug görünümü üretsin — \`{:?}\` ile yazdırılabilir, metot gerekmez.`,
    },
    {
      kind: "quiz",
      question: "`Player::new(...)` neden `&self` almaz?",
      options: [
        "Player'ı o yaratır — üzerinde çalışılacak bir instance henüz yok",
        "self her impl bloğunda isteğe bağlıdır",
        "new hiç argüman almayan bir anahtar kelimedir",
      ],
      answer: 0,
      explain: "`new` gibi ilişkili fonksiyonlar değeri inşa eder — bir metot ise zaten var olan bir değer üzerinde çalışır.",
    },
    {
      kind: "fill",
      prompt: "Metot imzasını tamamla — instance'ı tüketmemeli, okumalı.",
      file: "main.rs",
      before: "fn is_alive(",
      after: ") -> bool {\n    self.hp > 0\n}",
      choices: ["&self", "self", "player: &Player"],
      answer: 0,
      explain: "&self instance'ı ödünç alır; böylece is_alive, hero'nun sahipliğini almadan hp'yi okuyabilir.",
    },
    {
      kind: "editor",
      intro: `### Son sınav — kabı uyandıran ritüel

1. \`Player\`'ın üstüne \`#[derive(Debug)]\` ekle.
2. \`impl Player\` içine \`new(name: &str) -> Player\` ve \`is_alive(&self) -> bool\` yaz.
3. \`hero\`'yu \`Player::new("Ferrisia")\` ile oluştur, \`hero.is_alive()\` ile \`alive: {}\` yazdır, sonra \`hero\`'yu \`{:?}\` ile yazdır.

Beklenen çıktı:

\`\`\`text
alive: true
Player { name: "Ferrisia", hp: 100 }
\`\`\``,
    },
  ],
};
