import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Path payment'lar",
  tagline: "Path payment'lar: bir para birimi gönder, başkasını teslim et, atomik olarak.",
  steps: [
    {
      kind: "theory",
      body: `## Path payment'lar: öldürücü özellik

\`path_payment_strict_send\`, neredeyse hiçbir zincirin yerli olarak yapmadığı bir şey yapar: **bir varlık gönder, başkasını teslim et** — atomik olarak, tek bir operasyonda.

USDC gönderirsin. Ağ onu emir defterleri ve likidite pool'larından geçirir — belki USDC → XLM → EURC — ve büyükannen EURC alır. Tek işlem. Hiçbir rota senin sınırların içinde teslim edemiyorsa, **hiçbir şey olmaz**: swap'ın ortasında mahsur kalan fon yok.

İki tat:

- **Strict send** — ödediğini sabitle; alıcı rotanın verdiğini alır (minimumunun üstünde).
- **Strict receive** — alacaklarını sabitle; sen ne tutarsa onu ödersin (maksimumunun altında).`,
    },
    {
      kind: "diagram",
      body: "Bir ödeme, üç para birimi, tek bir atomik işlem:",
      caption: "Herhangi bir sıçrama senin koyduğun fiyattan dolmazsa hiçbir şey olmaz — ortada mahsur kalmış yarı dönüşmüş para yok.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "send",
            label: "BRL gönderiyorsun",
            note: "Aradaki para birimlerine asla dokunmaz, onları asla elinde tutmazsın.",
            tone: "accent",
          },
          {
            id: "hop1",
            label: "BRL → XLM",
            note: "Emir defteri bu sıçramayı piyasanın şu an sunduğu fiyattan doldurur.",
            tone: "teal",
          },
          {
            id: "hop2",
            label: "XLM → EURC",
            note: "Ve sonrakini, aynı anda, aynı işlemin içinde.",
            tone: "teal",
          },
          {
            id: "recv",
            label: "EURC alıyorlar",
            note: "Garantili miktar, ya da her şey geri alınır. Kısmi varış diye bir şey yok.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "path-payment",
      body: `**Para birimleri arasında bir ödeme gönder** ve miktar büyüdükçe protokolün hangi rotayı seçtiğini izle — sonra hiçbirinin teslim edemeyeceği kadarını iste ve bütün işin sadece gerçekleşmeyişini izle.`,
    },
    {
      kind: "quiz",
      question: `Fatura tam olarak 900 EURC ve hazinen USDC tutuyor. Hangi operasyon uyar?`,
      options: [
        "path_payment_strict_receive — teslim edilecek 900 EURC'yi sabitle, harcayacağın USDC'ye tavan koy",
        "path_payment_strict_send — 900 USDC değerinde kadar gönder ve kurun denk düşmesini um",
        "İki işlem: DEX'te USDC'yi EURC'ye çevir, sonra düz bir ödeme",
      ],
      answer: 0,
      explain: `Strict receive tam olarak "fatura sabit" durumları için var. Ve tek bir atomik operasyon, çevir-sonra-gönder'i yener: adımlar arasında fiyat kayması yok, artakalan kırıntı yok, temizlenecek yarım kalmış state yok.`,
    },
    {
      kind: "fill",
      prompt: `Bir path payment'ta gönderme ile teslimat arasında ne olur?`,
      file: "remittance.txt",
      before: `100 USDC gönder  →  `,
      after: `  →  EURC teslim et — tek bir atomik işlem`,
      choices: [
        "emir defterleri ve likidite pool'larından geçir",
        "başka bir zincirdeki wrapped token'lar üzerinden köprüle",
        "dönüşüm için bir anchor'ın döviz masasında sıraya gir",
        "ödemeyi piyasa yapıcı bot'lara açık artırmayla sat",
      ],
      answer: 0,
      explain: `Yönlendirme on-ledger ve atomiktir: protokol teslimatı bulmak için teklifleri ve pool'ları dolaşır; ya bütün yol ledger kapanışında yürütülür ya da hiçbiri.`,
    },
    {
      kind: "theory",
      body: `## Sınır, tasarımın ta kendisi

Yukarıdaki her şey senin verdiğin tek bir sayıya asılı: kabul edeceğin en az, ya da harcayacağın en çok. Onu yanlış almanın iki yolu da sessizdir.

**Fazla dar** olursa ödemelerin sadece olmamaya başlar. Gürültüyle değil — sınırını karşılayamayan bir path payment geri alınır ve bu, kimsenin göndermediği bir ödemeyle tıpatıp aynı görünür. Bir yerlerde bir kuyruk "geçmeyen" transferlerle dolar ve sebep, birinin bir zamanlar ayarlayıp bir daha dönüp bakmadığı bir toleranstır.

**Fazla gevşek** olursa, zarfının indiği anda rotanın neye mal olduysa ona açık çek yazmışsındır. Protokol berbat bir fiyatı iyi bir fiyat kadar sadakatle yerine getirir; hayır diyen tek şey sınırdı.

İşe yarayan alışkanlık zekice değil, sadece disiplinli: **önce kotasyon al, sonra sınırı o kotasyon artı bilerek seçtiğin bir toleranstan belirle.** Bir örnekten kopyalanmış ya da makul göründüğü için yuvarlak bir sayıda bırakılmış bir sınır, kimsenin sorumlu olmadığı bir sayıdır — ve kullanıcılarının para alıp almayacağına karar veren de odur.`,
    },
    {
      kind: "theory",
      body: `## Onu kullanılabilir kılan özellik

Bunun her parçası ters gidebilirdi. Rota ince olabilir, fiyat imzaladığın anla yürütüldüğü an arasında oynayabilir, bir sıçrama dolmayabilirdi.

Ve hepsinin cevabı aynı; path payment'ları üstüne gerçekten iş kurabileceğin bir şey yapan da bu: **ya bütün yol ledger kapanışında yürütülür ya da hiçbiri.**

BRL'nin gidip XLM olup durduğu bir state yoktur. Kimsenin istemediği bir para biriminde bekleyen yarı dönüşmüş bakiye yoktur. *"Para ortada bir yerde"* diye başlayan destek talebi yoktur.

Bu bir incelik değil. Bir ödeme rayı ile bir bilim deneyi arasındaki farktır — ve koyduğun sınırın bir tercih değil, kontratın kendisi olmasının nedeni de bu: *en az bu kadarını teslim et, yoksa fonuma dokunma.*`,
    },
    {
      kind: "theory",
      body: `## Havale inşacıları neden buraya gelir

Eski raylar: sınır ötesi bir transfer muhabir bankalar arasında **2–5 gün** sıçrar ve yol boyunca ücretlere yüzde birkaç kaptırır.

Nehir: dolarlar bir kıyıda USDC olur, bir **path payment** yaklaşık **beş saniyede**, sentin kesirleriyle ölçülen bir ücret karşılığında EURC'ye çevirip teslim eder ve öbür kıyıdan euro çıkar.

Döviz dönüşümü — tarihsel olarak pahalı, opak orta kısım — herkese açık emir defterleri ve pool'lar üzerinden şeffaf bir sıçramaya dönüşür. Saniyeler içinde çapraz para birimli mutabakat, Stellar'ın ilk günden hedeflendiği kullanım senaryosu.`,
    },
    {
      kind: "theory",
      body: `## Nehrin üstündeki katman

Yerli makinenin üstüne ekosistem Soroban'da inşa ediyor: **Soroswap**, **Phoenix** ve **Aquarius** AMM protokollerini akıllı kontrat olarak çalıştırıyor; aggregator'lar ise en iyi fiyatın peşinde her takası yerli defterler, yerli pool'lar ve kontrat pool'ları arasında yönlendiriyor. İç yapılarına henüz ihtiyacın yok — sadece yerli bir katman ve onun üstünde bir kontrat katmanı olduğunu bil.

Açık kalan tek soru: *gerçek* dolarlar ve eurolar nereden girip çıkıyor? O, anchor'ların işi — diyarın kapıları ve bir sonraki bölüm.`,
    },
  ],
  testOut: [
    {
      question: `\`path_payment_strict_send\` düz bir ödemenin yapamadığı neyi yapar?`,
      options: [
        "Bir varlık gönderip farklı birini teslim eder; tek bir atomik operasyonun içinde defterler ve pool'lardan geçerek",
        "Aynı anda birden çok alıcıya gönderir",
        "Bir ödemeyi gelecekteki bir ledger'da yürütülmek üzere zamanlar",
      ],
      answer: 0,
    },
    {
      question: `Fatura tam olarak 900 EURC ve hazinen USDC tutuyor. Hangi operasyon uyar?`,
      options: [
        "path_payment_strict_receive — teslim edilecek 900 EURC'yi sabitle, harcayacağın USDC'ye tavan koy",
        "path_payment_strict_send — kabaca 900 USDC değerinde gönder ve kurun denk düşmesini um",
        "İki işlem: DEX'te çevir, sonra düz bir ödeme",
      ],
      answer: 0,
    },
    {
      question: `Hiçbir rota koyduğun sınır içinde teslim edemiyor. Fonuna ne olur?`,
      options: [
        "Hiçbir şey — ya bütün yol yürütülür ya da hiçbiri, dolayısıyla hiçbir yerde yarı dönüşmüş bakiye yoktur",
        "Rotanın gidebildiği yere kadar dönüşür, kalanı bir sonraki ledger'da iade edilir",
        "Bir rota açılana kadar protokol tarafından tutulur",
      ],
      answer: 0,
    },
    {
      question: `Bir uygulama, bir ödemenin hangi rotayı izleyeceğini neden sabit kodlamamalı?`,
      options: [
        "En iyi rota miktara bağlıdır — en ince defter çoğu zaman en iyi kuru verir ve büyüklük altında çöker",
        "Rotalar özeldir ve göndermeden önce incelenemez",
        "Kendin belirlediğin bir rota için protokol daha fazla ücret alır",
      ],
      answer: 0,
    },
  ],
};
