import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Anchor'lar ve giriş/çıkış rampaları",
  tagline: "Anchor'lar: ledger'ın yere değdiği yer.",
  steps: [
    {
      kind: "theory",
      body: `## Anchor'lar: kapılar

Geçen bölümün nehirleri *ledger* varlıklarını taşıyor. Ama maaşın bir bankada duruyor. Aradaki köprü bir **anchor** (çapa): **fiat destekli varlık ihraç eden** ve **giriş/çıkış rampalarını** işleten, düzenlemeye tabi bir işletme.

Bir anchor'a dolar ver, ihraççı hesabından sana eşdeğer token'lar ödesin — iki bölüm önce öğrendiğin mekanizmanın ta kendisi: bir ihraççı, trustline'lar, uyumluluk için auth flag'leri. Token'ları geri ver, dolarları hesabına havale etsin.

Stellar'daki her ciddi fiat varlığın arkasında böyle bir kapı durur. Anchor'lar, ledger'ın yere değdiği yerdir.`,
    },
    {
      kind: "theory",
      body: `## "Destekli" aslında ne vaat ediyor

Bir anchor'ın ihraç ettiği token dolar değildir. **Bir işletme üzerindeki alacaktır** — ve bütün yapı, o işletmenin sözünü tutmasına dayanır.

Bu da demek oluyor ki herhangi bir fiat varlıkla ilgili ilginç sorular teknik değil:

- **İhraççı hukuken kim?** Bir yargı alanında düzenlemeye tabi bir kuruluş mu, yoksa anonim bir hesap mı?
- **Para nerede?** Ayrıştırılmış saklamada mı, yoksa maaşların ödendiği hesapta mı?
- **Kim kanıtlayabilir?** Okuyabileceğin bir tasdik mi, yoksa bir açılış sayfasındaki vaat mi?
- **Durdururlarsa ne olur?** Şirketi aşan bir geri ödeme yolu mu, yoksa sessizce hatıra eşyasına dönüşen bir token mı?

Ledger burada tam olarak tek bir konuda dürüst: *bu varlığı hangi hesabın ihraç ettiğini* sana kesin olarak ve sonsuza dek söyler. Ondan sonrası özen işi — bu yüzden tek başına bir varlık kodu hiçbir şey ifade etmez ve yanlış ihraççıdan gelen \`USDC\`, tesadüfen aynı adı paylaşan bambaşka bir varlıktır.`,
    },
    {
      kind: "quiz",
      question: `Bir cüzdan \`USDC\` bakiyesi gösteriyor. Tek başına varlık kodu sana ne söyler?`,
      options: [
        "Neredeyse hiçbir şey — bir varlık, kod *artı ihraççısıdır* ve USDC diye okunan bir kodu herkes ihraç edebilir",
        "Bunun o meşhur dolar stablecoin'i olduğunu, çünkü varlık kodları ledger'da benzersizdir",
        "Düzenlemeye tabi bir kuruluşun desteğini tasdik ettiğini",
      ],
      answer: 0,
      explain: `Ekosistemin en pahalı yanlış okuması bu, ve suçlu protokol değil: varlık kodları hiçbir zaman benzersiz olmadı, öyle olması da hiç amaçlanmadı. Kimlik, ihraççının adresidir; kod yalnızca bir etiket. Sana birini diğeri olmadan gösteren bir cüzdan, sana bir söylenti gösteriyor demektir.`,
    },
    {
      kind: "fill",
      prompt: `Bir varlığın gerçekte ne olduğunu tamamla:`,
      file: "NOTES.md",
      before: `Stellar'da bir varlık, bir varlık kodu artı `,
      after: ` demektir — ve yalnızca kodu paylaşan iki varlık, iki farklı varlıktır.`,
      choices: [
        "ihraççısının adresi",
        "dolaşımdaki miktarı",
        "anchor'ın domain adı",
        "SDF'nin varlık listesindeki bir kaydı",
      ],
      answer: 0,
      explain: `Domain yaklaşıyor ve gerçekten işe yarıyor — bir ihraççı kim olduğunu böyle yayımlar — ama o, üstüne eklenmiş bir iddia. Protokolün bizzat uyguladığı kimlik ihraççı hesaptır ve kimsenin taklit edemeyeceği tek parça da odur.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `Bir anchor, tek bir teknik eylemin etrafına sarılmış bir işletmedir: **token ihraç etmek**. O eylemi sen de yapabilirsin. Forge'daki **OZ Token Wizard**, testnet'te ihraççısı sen olan gerçek bir token döver — sana vermediği şeyse bir anchor'ı anchor yapan her şeydir: lisans, saklama, denetimler ve geri ödeme vaadi.`,
    },
    {
      kind: "theory",
      body: `## Kapıdan kapıya bir havale

Chicago'daki Ana'nın Lizbon'daki annesine para göndermesini izle:

1. Ana'nın cüzdanı ABD anchor'ının \`stellar.toml\` dosyasını okur (SEP-1), kimliğini doğrular (SEP-10) ve bir para yatırma işlemi açar (SEP-24). Dolarları ledger'da USDC olur.
2. Tek bir **path payment** nehri geçer: USDC çıkar, EURC teslim edilir — saniyeler, bir sentin altında ücret.
3. Annesinin cüzdanı bir Avrupa anchor'ı üzerinden para çeker (yine SEP-24). Eurolar banka hesabına iner.

İki düzenlemeye tabi kapı, ortada tek bir atomik nehir geçişi. Zincir hiç "dolar" görmedi — yalnızca kapıların sözünü tutmayı vaat ettiği varlıkları.`,
    },
    {
      kind: "diagram",
      body: "Banka parası girer, banka parası çıkar — ledger yalnızca ortayı tutar:",
      caption: "İki kapı hiç karşılaşmaz. Her birinin yalnızca aradaki ledger'a güvenmesi yeter.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "in",
            label: "gönderen kapı",
            note: "Bir anchor gerçek parayı alır ve onunla desteklenen bir token ihraç eder.",
            tone: "gold",
          },
          {
            id: "ledger",
            label: "ledger",
            note: "Beş saniye, bir sentin kesri ve ortalıkta tek bir muhabir banka yok.",
            tone: "accent",
          },
          {
            id: "out",
            label: "alan kapı",
            note: "Başka bir anchor token'ı yakar ve yerel parayla ödeme yapar.",
            tone: "gold",
          },
          {
            id: "done",
            label: "elde nakit",
            note: "Alıcı hiç cüzdan kurmadı, ledger kelimesini de hiç duymadı.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `O kapıdan kapıya havalede döviz dönüşümünü hangi parça yaptı?`,
      options: [
        "Path payment — USDC'yi ledger üzerindeki emir defterleri ve pool'lar üzerinden EURC'ye yönlendirerek",
        "Gönderen anchor'ın ledger dışındaki dahili döviz masası",
        "USDC'yi kilitleyip EURC basan bir köprü kontratı",
      ],
      answer: 0,
      explain: `Kapılar yalnızca banka parası ile ledger varlıkları arasında çeviri yapar. Döviz işleminin kendisi yolda, halka açık piyasalarda, herkesin doğrulayabileceği bir fiyattan gerçekleşir — eski havale raylarının sunamadığı parça tam olarak bu.`,
    },
    {
      kind: "theory",
      body: `## Antrenman kapıları: testanchor

Bütün bunlara karşı geliştirme yapmak için bankacılık lisansına ihtiyacın yok. SDF, testnet'te **testanchor** çalıştırıyor — SEP-1, SEP-10 ve SEP-24 konuşan, oyun parasıyla çalışan, tamamen işlevsel bir anchor. Cüzdan kodunu ona yönelt ve ortaya tek bir gerçek dolar girmeden önce bütün yatırma-çekme dansının provasını yap.

Kapılar, nehirler, güven — şimdiye kadarki her şey *klasik* diyardı: protokolün içine gömülü mekanizma. Sonraki bölümde kendin programladığın tarafa geçiyoruz: depolamanın bile kiralık olduğu **Soroban**.`,
    },
    {
      kind: "theory",
      body: `## Yanından geçip gittiğin kısaltmalar

Onları Ana'nın havalesinde gördün ve muhtemelen geçiştirdin: SEP-1, SEP-10, SEP-24. Üç iş yapan üç standart — *bu anchor kim*, *sen olduğunu kanıtla* ve *yatırmayı yürüt*.

Tesadüfi değillerdi. Onlar olmasa Ana'nın cüzdanı kendi anchor'ıyla ısmarlama bir entegrasyona, annesinin cüzdanı kendi anchor'ıyla bir başkasına ihtiyaç duyar, her yeni cüzdan da o işe sıfırdan başlardı. İki kapı yalnızca nasıl konuşacakları konusunda önceden anlaştıkları için iş birliği yapabildi.

**Sırada:** anlaşmanın kendisi — herhangi bir cüzdanın herhangi bir kapıya yürüyüp gidebilmesini sağlayan standartlar.`,
    },
  ],
  testOut: [
    {
      question: `Anchor nedir?`,
      options: [
        "Fiat destekli varlık ihraç eden ve banka parası ile ledger arasındaki giriş ve çıkış rampalarını işleten, düzenlemeye tabi bir işletme",
        "Fiat'ı otomatik olarak ledger varlıklarına dönüştüren bir protokol özelliği",
        "Ödeme trafiğinde uzmanlaşmış bir validator",
      ],
      answer: 0,
    },
    {
      question: `Bir cüzdan \`USDC\` gösteriyor. Tek başına varlık kodu neyi ortaya koyar?`,
      options: [
        "Neredeyse hiçbir şeyi — bir varlık, kod artı ihraççısıdır ve o kodu herhangi bir hesap ihraç edebilir",
        "Bunun o meşhur dolar stablecoin'i olduğunu; kodlar benzersizdir",
        "Birinin desteğini tasdik ettiğini",
      ],
      answer: 0,
    },
    {
      question: `Kapıdan kapıya bir havalede döviz dönüşümünü hangi parça yapar?`,
      options: [
        "Path payment — ledger üzerindeki emir defterleri ve pool'lar üzerinden, herkesin doğrulayabileceği bir fiyattan yönlendirerek",
        "Gönderen anchor'ın ledger dışındaki dahili döviz masası",
        "Bir varlığı kilitleyip diğerini basan bir köprü kontratı",
      ],
      answer: 0,
    },
    {
      question: `Neden bankacılık lisansı olmadan eksiksiz bir anchor entegrasyonu kurabilirsin?`,
      options: [
        "SDF testnet'te testanchor çalıştırıyor — bütün dansın provasını yapabileceğin, oyun parasıyla çalışan işlevsel bir anchor",
        "Anchor'lar geliştirme amacıyla üretim kimlik bilgilerini yayımlıyor",
        "Kuramazsın; anchor entegrasyonu önce imzalı bir anlaşma gerektirir",
      ],
      answer: 0,
    },
  ],
};
