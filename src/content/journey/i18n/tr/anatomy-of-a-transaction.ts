import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Bir İşlemin Anatomisi",
  tagline: "İşlem zarfı: ledger'ı değiştiren her şeyi taşıyan tek bir biçim.",
  steps: [
    {
      kind: "theory",
      body: `## Zarf

Stellar ledger'ını (defterini) değiştiren her şey tek bir biçimin içinde yolculuk eder — bir **işlem zarfı**:

- **Kaynak hesap** — kimin hareket ettiği (ve ücreti kimin ödediği).
- **Sequence numarası** — bu hesabın işlem sayacı.
- **Ücret** — dahil edilmek için verdiğin teklif.
- **Operasyonlar** — asıl fiiller (1'den 100'e kadar).
- **İmzalar** — kaynağın (ve gereken diğer herkesin) onayladığının kanıtı.

İkinci bir biçim yok. Bir ödeme, bir token ihracı, bir akıllı kontrat çağrısı, DEX'te bir takas — hepsi içinde farklı fiiller olan bu aynı zarf. Bir kez öğren, Stellar'daki her explorer sayfası ve her SDK çağrısı aynı anda okunabilir hale gelsin.`,
    },
    {
      kind: "diagram",
      body: "Zarf, açılmış halde:",
      caption:
        "İmza zarfın tamamını kapsar. İçeride herhangi bir yerde tek bir byte değiştir, her imza eşleşmeyi bırakır.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "source",
            label: "kaynak hesap",
            note: "Ücreti kim ödüyor ve kimin sequence numarası ilerliyor.",
            tone: "neutral",
          },
          {
            id: "fee",
            label: "ücret",
            note: "Operasyon başına 100 stroop — her biri bir XLM'in yüz binde biri.",
            tone: "gold",
          },
          {
            id: "seq",
            label: "sequence numarası",
            note: "Tam olarak bir kez kullanılır, sonsuza dek. Replay'i imkânsız kılan şey bu.",
            tone: "accent",
          },
          {
            id: "ops",
            label: "operasyonlar",
            note: "En fazla 100, sırayla uygulanır. Ya hepsi geçer ya hiçbiri.",
            tone: "teal",
            bands: [
              {
                id: "op1",
                label: "payment",
                note: "Bir varlığı bir hesaptan diğerine taşır.",
                tone: "teal",
              },
              {
                id: "op2",
                label: "change trust",
                note: "Hedefin o varlığı tutmasını sağlayan trustline'ı açar.",
                tone: "teal",
              },
            ],
          },
          {
            id: "sigs",
            label: "imzalar",
            note: "Gereken her imzacı için bir tane. Herkes onları kaynağın adresiyle karşılaştırabilir — kimse taklit edemez.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Operasyonlar: fiiller

Bir **operasyon** tek bir atomik fiildir. Yaklaşık 26 tane var, bir avuç aileye bölünmüş:

- **Değer taşı** — \`payment\`, \`path_payment_strict_send\`, \`create_account\`.
- **Değer tut** — \`change_trust\`, \`set_trust_line_flags\`, \`clawback\`.
- **Takas yap** — \`manage_sell_offer\`, \`liquidity_pool_deposit\`.
- **Hesabı yönet** — \`set_options\`, \`manage_data\`, \`account_merge\`.
- **Kod çağır** — \`invoke_host_function\`, akıllı kontrata ulaşan o tek operasyon.

Çoğu insanın aylarca gözünden kaçan bir ayrıntı: **her operasyon kendi kaynak hesabını belirtebilir**, zarfınkinden farklı olarak. Bir sonraki sayfayı mümkün kılan, o tek alan.`,
    },
    {
      kind: "quiz",
      question: `Zarfın üç operasyon taşıyor: bir ödeme, bir trustline ve bakiyesi yetmediği ortaya çıkan ikinci bir ödeme. Ledger'a ne yazılır?`,
      options: [
        "Hiçbir şey — tek bir başarısız operasyon bütün işlemi başarısız kılar",
        "İlk iki operasyon — üçüncüden itibaren başarısız olur",
        "Üçü de — başarısızlıklar uyarı olarak kaydedilir",
      ],
      answer: 0,
      explain: `Mesele atomiklik: bir işlem ya hep ya hiçtir; çok adımlı kurulumların (oluştur + fonla + güven) tek pakette güvenle gönderilebilmesinin sebebi de bu.`,
    },
    {
      kind: "theory",
      body: `## Bir zarf, üç fiil, iki imzacı

Ana, Bruno'yu Stellar'a getirmek ve ona 50 USDC vermek istiyor. Hepsinin tek bir zarfa nasıl sığdığını izle:

- **Kaynak:** Ana. Sequence numarası ilerler; ücreti o öder.
- **Op 1 —** \`create_account\`, hedef Bruno, başlangıç bakiyesi **2 XLM**.
- **Op 2 —** USDC için \`change_trust\`, **kaynak: Bruno**. Trustline onu tutan kişiye aittir, dolayısıyla bu operasyon Ana'nın değil, Bruno'nun.
- **Op 3 —** \`payment\`, Bruno'ya 50 USDC.

**Ücret:** 3 operasyon × 100 stroop = **300 stroop**, yani 0,00003 XLM.

Peki Bruno'nun 2 XLM'i? Bir hesap 2 temel rezerv, bir trustline 1 rezerv daha tutar, her biri 0,5 XLM: **1,5 XLM kilitli**, 0,5 XLM serbest. Rezervler ücret değildir — trustline'ı bir gün kapatırsa geri gelirler.`,
    },
    {
      kind: "quiz",
      question: `O zarfta Bruno neden imzalamak zorunda — sadece alıyor, öyle değil mi?`,
      options: [
        "Çünkü op 2 *onun* trustline'ını açıyor ve bir operasyonu kendi kaynak hesabı yetkilendirir",
        "Çünkü bir işlemde herhangi bir yerde adı geçen her hesap onu imzalamak zorundadır",
        "Çünkü ödeme, başlangıç bakiyesinden büyük",
      ],
      answer: 0,
      explain: `Almak asla imzanı gerektirmez — ama almanı sağlayan trustline'ı açmak gerektirir. Bu zarfı Bruno'nun imzası olmadan gönder, ağ \`tx_bad_auth\` cevabını verir: hiçbir şey olmaz, op 1 bile.`,
    },
    {
      kind: "fill",
      prompt: `Paketlemeyi güvenli kılan kuralı tamamla:`,
      file: "NOTES.md",
      before: `Tek zarf, en fazla 100 operasyon, sırayla uygulanır — ve içlerinden tek biri bile başarısız olursa `,
      after: ` .`,
      choices: [
        "hiçbiri etkili olmaz",
        "geri kalanlar yine de etkili olur",
        "başarısız olan atlanır",
        "ağ onu otomatik olarak yeniden dener",
      ],
      answer: 0,
      explain: `Ya hep ya hiç. "Hesabı oluştur *ve* trustline'ını aç *ve* fonla" işinin üç umut dolu adım değil de tek bir zarf olmasının sebebi bu — Bruno'nun var olup da ona gönderdiğini tutamadığı bir durum yok.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `O zarf varsayımsal değil. Forge'daki **İlk Cüzdanın** lab'ı \`create_account\`, \`change_trust\` ve \`payment\` operasyonlarını gerçek testnet'te senin imzanla yürütür — aynı üç fiil, sonunda kendi işlem hash'inle.`,
    },
    {
      kind: "theory",
      body: `## Artık okuyabildiklerin

Kaynak, sequence, ücret, operasyonlar, imzalar. Herhangi bir Stellar explorer'ında herhangi bir işleme bakıp her parçasını adıyla söyleyebilirsin ve çok adımlı bir kurulumun neden tek pakette güvenle gönderilebildiğini biliyorsun.

**Sırada:** geçerli bir zarf kurabiliyorsun — ama gönder tuşuna bastıktan sonra olanlar başlı başına bir hikâye. Bir işlem neden kapıdan geri çevrilirken bir diğeri tarihe başarısız olarak yazılır *ve üstüne bir de ücreti alınır*: bir sonraki bölüm.`,
    },
  ],
  testOut: [
    { question: `Stellar ledger'ındaki bir değişikliği kaç farklı biçim taşıyabilir?`,
      options: ["Bir — ödeme, takas ve kontrat çağrısı, içinde farklı fiiller olan aynı zarftır","Üç — biri ödemeler, biri takaslar, biri kontratlar için","Operasyon türü başına bir tane, yaklaşık 26"], answer: 0 },
    { question: `Zarfının içindeki bir operasyon, zarfınkinden farklı bir kaynak hesap belirtiyor. Bunun sonucu ne?`,
      options: ["O hesap da zarfı imzalamak zorunda","Operasyon yine de zarfın kaynağı adına uygulanır","Zarf reddedilir — operasyonlar zarfın kaynağını paylaşmak zorundadır"], answer: 0 },
    { question: `Bir zarf dört operasyon taşıyor ve üçüncüsü başarısız oluyor. Ledger'a ne yazılır?`,
      options: ["Dördü de etkili olmaz","İlk ikisi — zarf kırıldığı yerde durur","Dördü de, üçüncüsü uyarı olarak işaretlenmiş halde"], answer: 0 },
    { question: `Ücret neye göre ölçeklenir?`,
      options: ["Zarftaki operasyon sayısına","Taşınan değerin miktarına","Zarfın dahil edilmek için ne kadar beklediğine"], answer: 0 },
  ],
};
