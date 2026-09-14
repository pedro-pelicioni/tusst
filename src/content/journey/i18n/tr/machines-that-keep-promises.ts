import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Sözünü Tutan Makineler",
  tagline: "Akıllı kontrat nedir: kendi kendine çalışan bir kural, daha mistik bir şey değil.",
  steps: [
    {
      kind: "theory",
      body: `## Otomat bunu zaten yapıyordu

Otomat, arkasında kimse olmayan bir sözdür: *3 at, B4'e bas, cipsini al.* Seni sevmez, adını kontrol etmez, bugün anlaşmayı yerine getirmek için iyi bir gün mü diye karar vermez. Kural, makinenin kendisidir.

Bunu bir insanın tuttuğu sözle karşılaştır — depozitoyu iade eden bir ev sahibi, paket teslim edilince ödemeyi serbest bırakan bir pazar yeri. O sözler de gerçek, ama birinin onları tutmayı *seçmesine* ve tutmazsa şikâyet edecek bir yerin olmasına bağlılar.

Paylaşılan bir ledger'daki (defterdeki) **kontrat**, ilk düzendir: para ve kurallar için bir otomat, Bölüm I'deki defterin içine yerleşmiş.`,
    },
    {
      kind: "theory",
      body: `## Gerçekte ne olduğu

Gizemi sıyır, geriye üç sıradan şey kalır:

- **Defterde değer tutan bir yer.** Bir hesabın sahip olabildiği gibi fonlara sahip olabilir ve her hesap gibi bir adresi vardır.
- **Sabit bir kural kümesi** — "bu olursa, şu olur" — bir kez yazılmış, sonra herkesin okuması için yayınlanmış.
- **El yok.** Yalnızca biri onu imzalı bir talimatla dürttüğünde harekete geçer; geçtiğinde de kurallarını harfiyen uygular.

Onu kimse "çalıştırmıyor". Kapatılacak bir sunucu, e-posta atılacak bir şirket, elinde override tuşu olan bir operatör yok. Deftere girdiği andan itibaren binlerce makine onu birebir aynı şekilde çalıştırır ve sonuç üzerinde uzlaşır.`,
    },
    {
      kind: "diagram",
      body: "Bütün makine, uçtan uca:",
      caption: "Dört adım — ve insan yalnızca ilkinde görünüyor.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "poke",
            label: "imzalı bir talimat gelir",
            note: "Biri dürtene kadar hiçbir şey olmaz. Kontratın kendine ait eli yoktur.",
            tone: "accent",
          },
          {
            id: "rules",
            label: "kurallarını kontrol eder",
            note: "Herkesin okuyabildiği aynı kurallar. Yargı yok, istisna yok, kötü gün yok.",
            tone: "neutral",
          },
          {
            id: "move",
            label: "değeri hareket ettirir",
            note: "Bir hesap gibi fonlara sahiptir ve onları yalnızca kurallarının dediği gibi hareket ettirir.",
            tone: "teal",
          },
          {
            id: "book",
            label: "satır deftere yazılır",
            note: "Kalıcı, herkese açık ve geri alınamaz — kural yanlış olduğunda bile.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Günlük hayattaki hangi düzen bir kontratın davranışına en yakın?`,
      options: [
        "Otomat: sabit kurallar, yargı yok, yalnızca biri içine bir şey attığında harekete geçer",
        "Yardımsever bir tezgâhtar: durumu okur ve neyin adil olduğuna duruma göre karar verir",
        "İmzalı bir kâğıt sözleşme: yazıya dökülmüş, ama daha sonra mahkeme tarafından uygulanır",
      ],
      answer: 0,
      explain: `Tezgâhtarın yargısı var, kâğıdınsa bir uygulayıcıya ihtiyacı var. Kontratta ikisi de yok — uygulama, çalıştırmanın *ta kendisi*. Bu onun gücü ve birazdan göreceğin gibi, en keskin kenarı.`,
    },
    {
      kind: "theory",
      body: `## Yapamadıkları (bu liste daha önemli)

Yeni gelenler kontratları dört belirli şekilde abartır ve her birini şimdi, hemen unutmakta fayda var:

- **Dış dünya hakkında hiçbir şey bilmez.** Ne bugünkü dolar kurunu, ne paketin gelip gelmediğini, ne havayı. Bu bilgiyi birinin ona *göndermesi* gerekir — ve buna kimin izinli olacağını seçmek, gerçek sonuçları olan bir karardır.
- **Fikrini değiştiremez.** "Ama belli ki demek istediğim…" yok. Ne yazıyorsa onu yapar, harfi harfine.
- **Geri sarılamaz.** Yaptığı bir hareket defterde bir satırdır. Geri alma yok.
- **Gizli değildir.** Kuralları ve bugüne kadar yaptığı her hareket, bakmak isteyen herkese, sonsuza dek açıktır.`,
    },
    {
      kind: "quiz",
      question: `Bir kontrat fonları "son tarihten sonra" serbest bırakacak şekilde yazılmış. Yazarı içinden *alıcı ister ve alır* demek istemiş; yazıldığı haliyle kontrat ise ilk isteyene veriyor. Daha ilk gün bir yabancı önce istiyor ve alıyor.

Ne ters gitti?`,
      options: [
        "Yazılı kural yerine getirildi — yazıya hiç dökülmemiş niyet zaten hiç var olmamıştı",
        "Kontrat arızalandı ve geri alınmalı",
        "Yabancı bir kuralı çiğnedi ve şikâyet edilebilir",
      ],
      answer: 0,
      explain: `Hiçbir şey arızalanmadı ve rahatsız edici kısım da bu. Makine, kendisine verilen sözü tuttu; yazarının kafasındakini değil. Yazıya dökülmemiş niyetlerin burada hiçbir gücü yok.`,
    },
    {
      kind: "fill",
      prompt: `Bir inşacının bu bölümden yanında götürmesi gereken cümleyi tamamla:`,
      file: "NOTES.md",
      before: `Bir kontrat `,
      after: ` .`,
      choices: [
        "yazdığın sözü tutar, demek istediğin sözü değil",
        "fonlarını olası her bug'dan korur",
        "yalnızca senin okuyabildiğin gizli bir kayıt tutar",
        "mahkemenin en adil bulduğu sözü tutar",
      ],
      answer: 0,
      explain: `Bu sektördeki her pahalı olay, bu tek satırın bir çeşitlemesi. Yolun bir sonraki etabının kodla başlamamasının sebebi de bu.`,
    },
    {
      kind: "labLink",
      labSlug: "treasure-chest",
      body: `Bu makinelerden birinin gerçek testnet'te söz tuttuğunu şu anda, hemen izleyebilirsin. Forge'daki **Hazine Sandığı** lab'ı fonları kimseye ait olmayan bir ledger girdisine kilitler — ta ki adı yazılı tek talep sahibi onu alana kadar. Emanetçi yok, parayı tutan şirket yok, fikrini *değiştirebilecek* kimse yok. Ya kural serbest bırakır ya da hiçbir şey.`,
    },
    {
      kind: "theory",
      body: `## Neden bu son kolay bölüm

Artık zemin katın tamamı elinde: kimsenin sessizce düzenleyemediği bir defter, kim olduğunu kanıtlayan bir anahtar ve yazılı sözleri tam yazıldığı gibi tutan makineler.

Bunların toplamına dikkat et. Makine tam olarak yazılanı yapıyorsa — ve onunla tartışılamıyor, düzeltilemiyor, geri alınamıyorsa — o zaman **asıl iş yazmaktır**. Klavyede tuşlamak değil: bir yapay zekâ senden hızlı yazar ve hiç yorulmaz. Karar vermek, netleştirmek, "burada ne doğru olmak zorunda ve ne asla olmamalı" demek.

**Sırada, Zanaat yolunda:** tek bir satır kod bile yokken bunu düzgünce nasıl yazacağın. Diyar yolunda ise: Stellar'ın kendi makinesi; binlerce makinenin nasıl uzlaştığından az önce tanıştığın kontratlara kadar — bu kez içeriden.`,
    },
  ],
  testOut: [
    { question: `Bir kontratı, bir insanın tuttuğu sözden ayıran ne?`,
      options: ["Kendi kurallarını kendi çalıştırır; onları yerine getirip getirmemeyi seçen kimse yoktur","Yazıya dökülmüştür, sözlü bir söz ise değildir","Mahkemede uygulatılabilir, bir söz ise uygulatılamaz"], answer: 0 },
    { question: `Yayınlanmış bir kontratı kim çalıştırır?`,
      options: ["Özellikle kimse — binlerce makine onu birebir aynı şekilde çalıştırır ve sonuç üzerinde uzlaşır","Yazarı, bunun için açık tuttuğu bir sunucuda","Ağın operatörleri, sırayla"], answer: 0 },
    { question: `Bir kontrat ne zaman harekete geçer?`,
      options: ["Yalnızca biri onu imzalı bir talimatla dürttüğünde","Sürekli, koşullarını arka planda kontrol ederek","Günde bir kez, ağ kayıtlı kuralları taradığında"], answer: 0 },
    { question: `Yazar, yayınlanmış bir kontratı kapatabilir mi?`,
      options: ["Kontratın kendi yayınlanmış kuralları öyle demiyorsa hayır","Evet — yazar her zaman bir override tutar","Yalnızca ağın operatörlerinden kaldırmalarını isteyerek"], answer: 0 },
  ],
};
