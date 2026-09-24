import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Entity'ler, value object'ler ve aggregate'ler",
  tagline: "Taktik DDD: kimlik, değer ve tek parça halinde hareket etmesi gereken küme.",
  steps: [
    { kind: "theory", body: `## Entity'ler ve value object'ler

Her context'in içinde iki tür şey yaşar:

- Bir **entity**'nin (varlık) değişimi atlatan bir kimliği vardır. Bir Stellar **Account**'u bin ödemeden sonra da aynı hesaptır — adresi kimliğidir; bakiyeleri yalnızca durumdur.
- Bir **value object** (değer nesnesi) değerinin *kendisidir*. Bir Stellar **Asset**'i bir kod artı bir ihraççıdır: aynı ihraççıdan iki \`USDC\` birbirinin yerine geçer — hatta ayırt edilemez. İhraççıyı değiştir, asset'i düzenlemiş olmazsın; elinde *farklı* bir asset vardır.

Entity'ler takip edilir. Değerler karşılaştırılır. İkisini karıştırmak hayalet bug'ların doğuş hikâyesidir.` },
    { kind: "quiz", question: `Bunlardan hangisi Stellar'ın alanında bir **value object**'tir?`,
      options: [
        "Bir asset — kod + ihraççı; alanları eşit olan ikisi aynı şeydir, kendine ait bir kimliği yoktur",
        "Bir account — bakiyeleri altında değişirken kimliğini korur",
        "Bir validator — yeniden başlatmalar ve IP değişiklikleri boyunca aynı node olarak kalır",
      ], answer: 0,
      explain: `Diğer iki cevap da doğru şeyler anlatıyor — ama onlar *entity*: değişimi atlatan kimlik. Asset saf değerdir: eşitlik alan alan karşılaştırılır ve "hangisi orijinal?" anlamlı bir soru bile değildir.` },
    { kind: "diagram", body: "İki tür şey ve onları ayıran soru:",
      caption: "\"Bunu birebir aynı bir kopyayla değiştirsem bir şey değişir mi?\" diye sor — hayırsa değer, evetse entity.",
      view: { kind: "compare", columns: [
        { id: "entity", label: "entity", tone: "accent" },
        { id: "value", label: "value object", tone: "teal" },
      ], rows: [
        { label: "Stellar örneği", cells: [
          { text: "bir account (G…)", tone: "accent" },
          { text: "bir asset (kod + ihraççı)", tone: "teal" },
        ] },
        { label: "ikisini eşit yapan", cells: [
          { text: "aynı kimlik", tone: "accent" },
          { text: "aynı alanlar", tone: "teal" },
        ] },
        { label: "durum değişimini atlatır mı", cells: [
          { text: "evet — bakiyeler hareket eder, account kalır", tone: "accent" },
          { text: "hayır — ihraççıyı değiştir, farklı bir asset olur", tone: "teal" },
        ] },
        { label: "bu yüzden onu", cells: [
          { text: "takip edersin", tone: "accent" },
          { text: "karşılaştırırsın", tone: "teal" },
        ] },
      ] } },
    { kind: "theory", body: `## Aggregate'ler: zarf kuralı

Bazı nesneler yalnızca **birlikte** anlam taşır; kuralları uygulayan tek bir kök tarafından korunurlar. O kümeye **aggregate** denir.

Stellar sana kusursuz bir örnek veriyor: **transaction envelope** (işlem zarfı). Operasyonlar bir işlemin *içinde* yaşar — birlikte imzalanır, birlikte sıralanır ve **birlikte başarır ya da birlikte başarısız olur**. 3 numaralı operasyonu çekip tek başına uygulayamazsın; zarf tek kapıdır ve imzaları ile sequence number'ı o tutar.

Üretimdeki aggregate kalıbı tam olarak bu: tutarlılık *sınırda* uygulanır, böylece içerideki hiçbir şey asla yarım uygulanamaz.` },
    { kind: "theory", body: `## Sistemi yutan aggregate

Bunu yanlış yapmanın klasik yolu aggregate'i **fazla büyük** çizmektir.

Makul başlar: bu şeyler tutarlı kalmalı, o halde tek kökün altına koy. Sonra şunlar da. Çok geçmeden kök "Ledger" olur, her değişiklik ondan geçmek zorundadır ve birbiriyle alakasız iki operasyon aynı anda ilerleyemez, çünkü aynı bekçi için çekişirler. Tutarlılık bir kuyruk karşılığında satın alınmıştır.

Stellar ölçülü davranıyor. Envelope bir aggregate — ama **küçük** bir aggregate: en fazla yüz operasyon, tek bir hesabın sequence number'ı, başka hiçbir şey. Ledger'ı korumaz; tek bir gönderimi korur. Herkesin diğer envelope'ları aynı beş saniyede, dokunulmadan ilerler.

Pratik kural: bir aggregate, **birlikte doğru** olması gereken en küçük küme olmalı; tesadüfen **ilişkili** olan en büyük küme değil.` },
    { kind: "quiz", question: `İmzalı bir Stellar işlemi beş operasyon tutuyor ve umursadığın tek şey üçüncüsü. O operasyon ledger'a tek başına uygulanabilir mi?`,
      options: [
        "Hayır — operasyonlar yalnızca envelope'ları aracılığıyla uygulanır ve bütün işlem tek parça olarak başarır ya da başarısız olur",
        "Evet — her operasyon kendi imzasını taşır, dolayısıyla her biri tek başına durabilir",
        "Evet — o tek operasyon için ayrı bir ücret ödediğin sürece",
      ], answer: 0,
      explain: `Envelope aggregate köküdür: imzalar ve sequence number işleme bağlanır, asla operasyon başına değil. Çok operasyonlu atomik takasları güvenli kılan tam olarak bu — birinin yalnızca yarısının indiği bir dünya yoktur.` },
    { kind: "fill", prompt: `Aggregate'in yasasını tamamla:`,
      file: "NOTES.md",
      before: `Bir envelope'taki operasyonlar `,
      after: ` başarır ya da başarısız olur — tutarlılık birimi işlemdir.`,
      choices: ["birlikte", "bağımsız olarak", "ücret sırasına göre", "imza ağırlığına göre"], answer: 0,
      explain: `Atomiklik aggregate'in bütün vaadidir. Ücret sırası ve imza ağırlığı gerçek Stellar kavramları — ama bir envelope'un *uygulanıp uygulanmayacağına ve ne zaman* uygulanacağına karar verirler, *hangi parçalarının* uygulanacağına asla.` },
    { kind: "rustBranch", lessonSlug: "soroban-smart-contracts-1",
      body: `Bu iki şekil, onları depoladığın anda soyut olmaktan çıkar. Kampanya'nın Perde VII'sinde entity, kontrat depolamasında **anahtarla** ulaştığın şeydir; value object ise \`==\` ile karşılaştırdığın bir \`#[contracttype]\`. Bu eşleşmeyi yanlış kurmak, aynı asset'in iki ayrı anahtar altında depolanmasıyla sonuçlanır.` },
    { kind: "theory", body: `## Sınırın içinde, nerede yaşıyor?

Artık tek bir context için şunu söyleyebilirsin: neyin kimliği var, ne yalnızca değerinden ibaret ve hangi kümenin tek parça hareket etmesi gerekiyor.

Henüz söyleyemediğin şey, bunların herhangi birinin nerede **oturduğu**. Aggregate veritabanını biliyor mu? Ledger istemcisi alan kurallarına uzanabilir mi? Bu soruların bir cevabı var ve her seferinde aynı cevap.

**Sırada:** kale ve her bağımlılığın hangi yöne bakmasına izin verildiğine karar veren o tek kural.` },
  ],
  testOut: [
    { question: `Aynı ihraççıdan iki USDC. "Hangisi orijinal?" anlamlı bir soru mu?`,
      options: ["Hayır — asset bir value object'tir; eşitlik alan alan karşılaştırılır ve kendine ait bir kimliği yoktur","Evet — her token onu ayırt eden bir seri numarası taşır","Yalnızca farklı hesaplar tarafından tutuluyorlarsa"], answer: 0 },
    { question: `Bir hesap bin kez ödeme yapıyor. Hâlâ aynı hesap mı?`,
      options: ["Evet — bir entity, durumu altında değişirken kimliğini korur","Hayır — onu bakiyesi tanımlar, dolayısıyla değişen bakiye değişen hesaptır","Yalnızca sequence number başa sarmadıysa"], answer: 0 },
    { question: `Transaction envelope'u ders kitabı niteliğinde bir aggregate yapan ne?`,
      options: ["İçeri açılan tek kapı olması: imzalar ve sequence envelope'a bağlanır, içindekiler birlikte başarır ya da başarısız olur","Protokoldeki en büyük nesne olması, dolayısıyla diğer her şeyi içermesi","Yalnızca biri gerektiğinde operasyonlarına bölünebilmesi"], answer: 0 },
    { question: `Bir aggregate'i yanlış çizmenin klasik yolu nedir?`,
      options: ["Fazla büyük — tutarlılık bir kuyruk karşılığında satın alınır, çünkü alakasız işler tek kök için çekişir","Fazla küçük — o zaman her kural birkaç kök arasında bir işlem gerektirir","Köksüz, böylece invariant'ları hiçbir şey uygulamaz"], answer: 0 },
  ],
};
