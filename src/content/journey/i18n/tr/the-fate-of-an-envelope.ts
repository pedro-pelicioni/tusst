import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Bir işlemin yaşam döngüsü",
  tagline: "Sequence, ücretler ve işlem yaşam döngüsü: gönderildi, dahil edildi, başarısız oldu, ücreti alındı.",
  steps: [
    {
      kind: "theory",
      body: `## Replay'i durduran sayaç

Her hesap bir sequence numarası taşır. Bir işlem \`current + 1\` demek zorundadır ve ledger dahil edildiğinde sayacı artırır — böylece imzalı bir işlem **asla tekrar oynatılamaz** (numarası harcanmıştır) ve aynı hesaptan iki işlem aynı yere **yarışamaz**.

Bu sonuncunun pratik bir keskin kenarı var. Backend'in aynı hesaptan aynı anda iki işlem imzalarsa, ikisi de \`current + 1\` der — ve tam olarak biri kazanır. Diğeri \`tx_bad_seq\` ile geri döner; bu "bozuk biçimli" demek *değildir*; *sayacını senden önce başkası ilerletti — yeniden kur ve yeniden imzala* demektir.

Olağan çözüm bir retry döngüsü değil. **Channel account** (kanal hesabı): sequence numaralarını sağlayan ayrı bir hesap; böylece paralel işler tek bir sayaç için asla kavga etmez.`,
    },
    {
      kind: "quiz",
      question: `İki sunucu aynı saniyede aynı hesaptan bir ödeme imzalıyor. İkisi de gönderiliyor. Ne olur?`,
      options: [
        "Biri dahil edilir; diğeri tx_bad_seq ile reddedilir ve yeniden kurulması gerekir",
        "İkisi de dahil edilir — ledger onları otomatik sıralar",
        "İkisi de reddedilir, çünkü bir işlem beklemedeyken hesap kilitlenir",
      ],
      answer: 0,
      explain: `Hakem sayaçtır. Hiçbir şey "kilitlenmez" ve senin için hiçbir şey kuyruğa alınmaz — ikinci zarf artık sırada olmayan bir sequence numarası belirtir ve geri çevrilir. Yeniden kurmak çözüm; channel account ise kalıcı ilaç.`,
    },
    {
      kind: "fill",
      prompt: `Yaşam döngüsünü sıraya koy — kurmakla göndermek arasında ne olur?`,
      file: "lifecycle.txt",
      before: `zarfı kur  →  `,
      after: `  →  gönder  →  ledger close`,
      choices: ["imzala", "mine et", "noterden geçir", "stake et"],
      answer: 0,
      explain: `Kur, **imzala**, gönder, kapat — uçtan uca yaklaşık beş saniye. Mining yok, çoğul "onaylar" beklemek yok: tek bir ledger close kesinliktir.`,
    },
    {
      kind: "diagram",
      body: "O beş saniye, aşama aşama:",
      caption:
        "İmzalama senin makinende, çevrimdışı gerçekleşir. Gizli anahtarın asla yolculuk etmez — yalnızca bitmiş zarf eder.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "build",
            label: "kur",
            note: "Kaynak, sequence, ücret ve operasyonları bir araya getir. Henüz hiçbir şey makinenden çıkmadı.",
            tone: "neutral",
          },
          {
            id: "sign",
            label: "imzala",
            note: "Gereken her imzacı zarfı yerel olarak mühürler. Gizli anahtarlar yerinden kıpırdamaz.",
            tone: "accent",
          },
          {
            id: "submit",
            label: "gönder",
            note: "Bir RPC ya da Horizon endpoint'ine gönderilir; o da validator'lara iletir.",
            tone: "teal",
          },
          {
            id: "validate",
            label: "doğrula",
            note: "İmzalar, sequence ve ücret kontrol edilir. Burada takılırsa ledger'a hiç ulaşmaz.",
            tone: "gold",
          },
          {
            id: "close",
            label: "ledger close",
            note: "~5 saniye. Tek bir close kesinliktir — beklenecek ikinci bir onay yok.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Herkesin bir kez yaptığı hata

"İşlemim başarısız oldu, yani hiçbir şey olmadı ve bana hiçbir şeye mal olmadı."

Bunun yarısı genellikle yanlış, çünkü **birbirinden çok farklı iki şeye aynı "başarısız" deniyor**:

- **Kapıda reddedildi.** Kötü imza, kötü sequence, çok düşük ücret. Zarf içeri hiç giremez. Ücret alınmaz, kayıt düşülmez, sayacın kıpırdamaz.
- **Ledger'da başarısız oldu.** Zarf geçerliydi, dolayısıyla *dahil edildi* — sonra bir operasyon çalışmadı. **Etkilerinin** hepsi geri alınır, ama işlem tarihe başarısız olarak yazılır; **ücret tüketilir ve sequence numarası harcanır.**`,
    },
    {
      kind: "diagram",
      body: "İkisi de başarısızlık gibi tınlayan iki kelime:",
      caption:
        "Fark, zarfın hiç geçerli olup olmadığında. Geçerli-ama-mahkûm olan yine de sana mal olur.",
      view: {
        kind: "compare",
        columns: [
          { id: "rejected", label: "kapıda reddedildi", tone: "neutral" },
          { id: "failed", label: "ledger'da başarısız", tone: "bad" },
        ],
        rows: [
          {
            label: "tipik kod",
            cells: [
              { text: "tx_bad_seq, tx_bad_auth", tone: "neutral" },
              { text: "op_underfunded, op_no_trust", tone: "bad" },
            ],
          },
          {
            label: "tarihe yazıldı mı",
            cells: [
              { text: "hayır", tone: "good" },
              { text: "evet, başarısız olarak işaretli", tone: "bad" },
            ],
          },
          {
            label: "ücret alındı mı",
            cells: [
              { text: "hayır", tone: "good" },
              { text: "evet", tone: "bad" },
            ],
          },
          {
            label: "sequence numarası",
            cells: [
              { text: "dokunulmadı", tone: "good" },
              { text: "harcandı — yeniden kurmak gerek", tone: "bad" },
            ],
          },
        ],
      },
    },
    {
      kind: "fill",
      prompt: `Çoğu insanı bir kez yakalayan kuralı tamamla:`,
      file: "NOTES.md",
      before: `Dahil edilecek kadar geçerli olan ama operasyonu başarısız olan bir işlem ledger'a başarısız olarak yazılır — ve ücreti `,
      after: ` .`,
      choices: [
        "yine de alınır",
        "otomatik olarak iade edilir",
        "hiç alınmaz",
        "yalnızca yeniden denemede alınır",
      ],
      answer: 0,
      explain: `Sana mal olan şey dahil edilmek, başarmak değil. Pratik sonucu: her hatayı aynı kefeye koyan bir retry döngüsü, sequence numarasını çoktan yakmış bir zarfı seve seve yeniden gönderir. Yeniden denemeden önce kodu oku.`,
    },
    {
      kind: "theory",
      body: `## Ücretler: bir rate limiter, gelir kaynağı değil

Temel ücret **operasyon başına 100 stroop** — 0,00001 XLM; bir insan için yuvarlama hatası, bir milyon çöp zarf içinse gerçek para. Bu asimetri tasarımın *ta kendisi*.

- **Maksimumu teklif edersin, minimumu ödersin.** Belirlediğin ücret bir tavandır. Ledger'da yer varken, ne kadar yüksek teklif verirsen ver temel ücret alınır; yalnızca talep kapasiteyi aştığında surge fiyatlaması ledger'ı teklife göre doldurur.
- **Başkası ödeyebilir.** Bir **fee-bump işlemi**, zaten imzalanmış bir zarfı sarar ve faturaya farklı bir hesabı yazar; mevcut imzaların tek birini bile geçersiz kılmadan. Bir uygulamanın elinde hiç XLM olmayan bir kullanıcıya sponsor olması böyle mümkün olur.`,
    },
    {
      kind: "quiz",
      question: `Ağ neden operasyon başına ücret (100 stroop = 0,00001 XLM) alıyor ki?`,
      options: [
        "Spam'i büyük ölçekte pahalı kılarken insanlar için görünmez kalmak",
        "Validator'lara maaş ödemek — onların iş modeli bu",
        "Friendbot'u sübvanse etmek",
      ],
      answer: 0,
      explain: `Stellar'da ücretler bir rate limiter'dır, gelir kaynağı değil — validator'lar ne blok ödülü ne de ücret geliri alır. Kimse validator'ı gelir için çalıştırmaz; ücretin bu kadar küçük kalabilmesinin büyük bir nedeni de bu.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `Kampanya'nın Perde VII'sinde aynı zarf \`invoke_host_function\` taşır — ve operasyonun payload'ı **senin kendi Rust kodun**. Buradaki her şey ona da aynen uygulanır: aynı sayaç, aynı yaşam döngüsü, reddedilenle başarısız olan arasındaki aynı ayrım.`,
    },
  ],
  testOut: [
    { question: `Sequence numarası neyi engeller?`,
      options: ["İmzalı bir işlemin tekrar oynatılmasını ve iki işlemin aynı yere yarışmasını","Yeniden denemede ücretin iki kez alınmasını","Bir hesabın aynı anda birden fazla varlık tutmasını"], answer: 0 },
    { question: `İşlemin tx_bad_seq ile reddedilmiş olarak geri geliyor. Sana neye mal oldu?`,
      options: ["Hiçbir şeye — ledger'a hiç girmedi, yani ne ücret alındı ne sayaç kıpırdadı","Ücrete, çünkü ağ yine de onu kontrol etmek zorunda kaldı","Ücrete ve sequence numarasına, diğer her başarısızlıkta olduğu gibi"], answer: 0 },
    { question: `Bir işlem dahil ediliyor ama ödemesinin bakiyesinin yetmediği ortaya çıkıyor. Ne harcandı?`,
      options: ["Ücret ve sequence numarası, hiçbir şey hareket etmemiş olsa bile","Hiçbir şey — geri alınan etkiler, geri alınan işlem demektir","Yalnızca sequence numarası; başarısızlıkta ücretler iade edilir"], answer: 0 },
    { question: `Bir uygulama, elinde hiç XLM olmayan bir kullanıcıyı sisteme almak istiyor. Bunu mümkün kılan ne?`,
      options: ["Mevcut imzalara dokunmadan faturaya farklı bir hesabı yazan bir fee-bump işlemi","Yeni hesaplar için ücreti sıfıra indirmek","İlk kez gelen kullanıcılar için mainnet'te ücretleri ödeyen Friendbot"], answer: 0 },
  ],
};
