import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "İhraççının Tarafı",
  tagline: "Varlık ihracı: herkes mint edebilir — zanaat, ondan sonra gelen her şeydir.",
  steps: [
    {
      kind: "theory",
      body: `## Varlık ihraç etmek: sadece öde

Klasik Stellar'da "token deploy etme" ritüeli yok. Bir **varlık (asset) bir çifttir**: kısa bir kod artı **ihraççının (issuer) adresi** — Circle'ın hesabından gelen \`USDC\` ile bir yabancıdan gelen \`USDC\` farklı varlıklardır.

İhraç etmek için ihraççı, varlığı kendi hesabından trustline'ı olan birine düpedüz **öder**. O ilk ödeme mint'in *ta kendisidir*. Arz, ihraççının ödeyip geri almadığı ne varsa odur — ledger (defter) bunu trustline'lar üzerinden otomatik olarak takip eder.

Her hesap ihraç edebilir. Bir varlığı önemli kılan, iznin değil güvenin kıtlığıdır.`,
    },
    {
      kind: "quiz",
      question: `Klasik Stellar'da yepyeni bir varlığı var etmek için ne gerekir?`,
      options: [
        "İhraççı onu trustline açmış bir hesaba öder — ilk ödeme mint'tir",
        "Bir token kontratı deploy edip doğrulamak, sonra ticker'ı SDF'ye kaydettirmek",
        "Hedeflenen arzla orantılı XLM stake etmek",
      ],
      answer: 0,
      explain: `Bir varlık kod + ihraççı ile tanımlanır; yani ilk hareket ettiği anda "var olur". Kontratlar hikâyeye ancak programlanabilir davranış istediğinde girer — ya da bu bölümün sonunda bekleyen SAC köprüsüyle.`,
    },
    {
      kind: "theory",
      body: `## İki hesap, tek varlık: ihraççı hijyeni

Ciddi ihraççılar rolleri ayırır:

- **İhraç hesabı** neredeyse hiçbir şey imzalamaz. Dağıtım hesabına ödeyerek mint eder, sonra uykuya döner — soğuk anahtarlar, minimum saldırı yüzeyi.
- **Dağıtım hesabı** çalışan arzı tutar ve günlük trafiği çevirir: müşteriler, borsalar, sıcak yollar.

Dağıtım anahtarları sızarsa bir bakiye kaybedersin — matbaayı değil. Bir ihraççı daha da ileri gidebilir: ihraç hesabının imzacılarını kilitler, böylece *hiç kimse* bir daha ihraç edemez ve maksimum arz sonsuza dek sabitlenir. Ledger'ın kendisi denetim olur.`,
    },
    {
      kind: "theory",
      body: `## Yetkilendirme flag'leri: kapı bekçisi olarak ihraççı

Gerçek dünya varlıkları gerçek dünya hukukunu taşır; bu yüzden bir ihraççı kendi üzerinde flag'ler ayarlayabilir:

- **Auth required** — trustline'lar yetkisiz başlar; ihraççı her tutucuyu tek tek onaylar (KYC kapıları).
- **Auth revocable** — ihraççı yetkili bir trustline'ı dondurabilir, o bakiyeyi olduğu yerde durdurur.
- **Clawback** — ihraççı varlığı tamamen geri çekebilir (mahkeme kararları, çalınan fonlar, yanlış tuşa basılmış ödemeler).

Regüle kurumların herkese açık bir ledger'da ihraç yapabilmesinin sebebi bu flag'ler: uyumluluk bir PDF'teki sözle değil, *protokol tarafından* uygulanır.`,
    },
    {
      kind: "quiz",
      question: `Regüle bir ihraççı, bir tutucunun hesabının hack'lendiğini öğreniyor. Hangi flag o bakiyenin hareket etmesini — hemen şimdi — durdurur?`,
      options: [
        "Auth revocable — trustline'ın yetkisini iptal et, bakiye olduğu yerde donar",
        "Auth required — hacker'ın önceki yatırmalarını geriye dönük engeller",
        "Auth immutable — bütün varlığı herkes için kilitler",
      ],
      answer: 0,
      explain: `Auth required yalnızca *yeni* trustline'ları kapıda tutar; auth immutable ise sadece flag'lerin asla değişmeyeceğine söz verir. Dondurmak hareketi durdurur; **clawback** bir adım öteye gider ve varlığı ihraççıya geri çeker.`,
    },
    {
      kind: "fill",
      prompt: `Klasik bir varlığın kimliğini tamamla — USDC'yi *gerçek* USDC yapan ne?`,
      file: "asset-identity.txt",
      before: `asset  =  asset code  +  `,
      after: `   (aynı kod, farklı ihraççı → farklı varlık)`,
      choices: [
        "ihraççının hesap adresi",
        "kontratın Wasm hash'i",
        "küresel bir ticker kaydı",
        "anchor'ın ana sayfa URL'si",
      ],
      answer: 0,
      explain: `Üstüne çöreklenecek bir namespace yok. Cüzdanlar hangi \`USDC\`'nin gerçek olduğunu ihraççının adresiyle çözer — ve anchor'lara geldiğimizde göreceğin gibi, o ihraççı kendini kendi domain'indeki bir dosyayla kanıtlar.`,
    },
    {
      kind: "theory",
      body: `## Stellar Asset Contract

Klasik varlıklar ve akıllı kontratlar tek bir diyarı paylaşır; köprü de **Stellar Asset Contract (SAC)**. Herhangi bir klasik varlık — XLM dahil — bir kontrat olarak *çağrılabilir*: tek bir deploy, yazılacak sıfır kod, ve varlık artık standart Soroban token arayüzü **SEP-41**'i konuşuyor.

Aynı varlık, aynı arz, tek bilanço — ama artık kontratlar onu tutabilir, taşıyabilir ve üstüne inşa edebilir. Bir lending pool'undaki USDC ile büyükannenin trustline'ındaki USDC *aynı USDC*.

Her ciddi Soroban protokolü bu köprüye her gün yaslanır.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `Bu sayfadaki her şey bir sözdizimi değil, bir karar. Forge'daki **OZ Token Wizard** seni testnet'te gerçekten ihraç tarafına koyuyor — ilginç olan çalışması değil; orada verdiğin her seçimin, yanına bir uyumluluk departmanı eklenmiş haliyle bir anchor'ın da verdiği bir seçim olması.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `Kampanya'nın Perde VI'sı — **Takımyıldız Kapısı** — aynı zemini Rust'tan yürür: hesaplar, bakiyeler ve trustline'lar düzyazı yerine kodla sorgulanır ve dövülür. Parmaklarını ledger kayıtlarının kendisine değdirmek istediğinde bu sapağa gir.

Yolda sırada: *hareket halindeki* varlıklar — uçuş ortasında para birimi değiştiren ödemeler ve protokolün içine gömülü bir borsa.`,
    },
  ],
  testOut: [
    { question: `Stellar'da yeni bir varlık nasıl yaratılır?`,
      options: ["Ödeyerek — bir ihraç hesabı hiç tutmadığı bir varlığı düpedüz gönderir ve arz var olur","Onu mint eden bir token kontratı deploy ederek","İlk kullanımdan önce varlık kodunu SDF'ye kaydettirerek"], answer: 0 },
    { question: `İhraççılar neden ihraç hesabından ödemek yerine ayrı bir dağıtım hesabı tutar?`,
      options: ["İhraç hesabının bakiyesi anlamsızdır — arz, ödediği şeydir — dolayısıyla dolaşımdaki arzı okunur kılan ve ihraççının anahtarlarını nadiren kullandıran şey dağıtım hesabıdır","Protokol bir ihraç hesabının kendi varlığını tutmasını yasaklar","İlgili trustline'ların rezerv maliyetini yarıya indirir"], answer: 0 },
    { question: `İhraççının yetkilendirme flag'leri ona ne yapma imkânı verir?`,
      options: ["Varlığı kimin tutabileceğini kapıda denetlemek ve belirli bir tutucunun trustline'ını dondurmak — ihraççının regülasyon altında çalışmak için ihtiyaç duyduğu kontrol","Tekil ödemeleri kesinleştikten sonra geri almak","Varlığın DEX'te işlem göreceği fiyatı belirlemek"], answer: 0 },
    { question: `Stellar Asset Contract klasik bir varlığa ne verir?`,
      options: ["Bir kontrat arayüzü; böylece klasik bir varlık, Soroban kontratları tarafından bir kontrat token'ıymış gibi kullanılabilir","Klasiği yansıtan ikinci, kontrat tabanlı bir arz","Kontrat tabanlı AMM'lerde otomatik listelenme"], answer: 0 },
  ],
};
