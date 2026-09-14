import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Onu Ne Yakalar?",
  tagline: "En az yetki ve hata yolları: her araç bir patlama yarıçapıdır.",
  steps: [
    {
      kind: "theory",
      body: `## En az yetki: daha az diş, lütfen

Elinin altında \`rm -rf\` olan bir model, onu *er geç* çalıştıracak bir modeldir — kötü niyetten değil, sabahın ikisinde kendinden emin ama yanlış bir plandan. Çare eski ve kanıtlanmış: **en az yetki** (least privilege).

- Genel olarak araç değil, *bu iş* için araç ver.
- Yazmanın iş olmadığı her yerde **salt okunur** erişimi tercih et.
- Tek bir dizine sınırla; çalışan her şeyi sandbox'a al.
- Eline **yalnızca testnet anahtarları** ver — kaybı gerçekten canını yakacak bir anahtarı asla.

"Ne olur ne olmaz" diye verilen güç, olayların başladığı yerdir. Her araç bir patlama yarıçapıdır; ona göre ver.`,
    },
    {
      kind: "widget",
      component: "blast-radius",
      body: `İki gösterge, ve birlikte hareket etmiyorlar. **Modele bir düzelt-ve-kanıtla işinin ihtiyaç duyduğunu ver**, sonra eklemeye devam et — ve hangi çubuğun tepki verdiğini izle.`,
    },
    {
      kind: "fill",
      prompt: `İşe başlamadan önce modelin gücünü sınırla:`,
      file: "harness.toml",
      before: `signing_keys = "`,
      after: `"`,
      choices: ["testnet", "mainnet", "all-networks", "treasury"],
      answer: 0,
      explain: `Pratik kural: bir model yalnızca tamamen kaybolmasına omuz silkebileceğin anahtarları tutar. Testnet lumen'leri friendbot'tan bedava; otomatik bir döngünün içindeki mainnet ya da hazine anahtarıysa geri sayımı başlamış bir olaydır.`,
    },
    {
      kind: "theory",
      body: `## Kimsenin verdiğini hatırlamadığı yetki

Fazla yetki vermek nadiren bir karardır. Bir salı öğleden sonrasıdır.

Modelin bir bakiyeye bakması gerekir, o yüzden ağ erişimi alır — dar, sadece bunun için. Bir hafta sonra bir bağımlılık kurması gerekir, o yüzden ağ açık kalır. Biri bir mainnet sorununu debug ediyordur ve ortama "sadece bu çalıştırma için" gerçek bir anahtar bırakır; kimse onu kaldırmaz, çünkü kaldırmak bir iştir ve şu anda bozuk bir şey yoktur.

Şimdi geri dön ve harness'ın cevaplamak için var olduğu soruyu sor: *bu yanlış olduğunda onu ne yakalar?* Açık ağ artı gerçek anahtar artı kendinden emin ama yanlış bir plan, varsayımsal bir risk profili değildir. Üst üste yığılmış üç sıradan salıdır.

Denetim ucuzdur ve kimse yapmaz: **modelin bugün elinde ne olduğunu listele ve her biri için, ona ihtiyaç duyan işin adını yaz.** O sütunda adı olmayan her şey, kimsenin verdiğini hatırlamadığı bir yetkidir.`,
    },
    {
      kind: "quiz",
      question: `Zaten repo'yu okuyan, testleri çalıştıran, tek bir dizine yazan ve testnet anahtarları tutan bir modele açık ağ erişimi ve her yere yazma yetkisi ekliyorsun. Bu iki yetki ne satın aldı?`,
      options: [
        "Neredeyse hiç yeni yetenek, ve patlama yarıçapında büyük bir sıçrama",
        "Her ikisinde de büyük bir sıçrama — kabul ettiğin takas bu",
        "Çoğunlukla yetenek, çünkü ağ erişimi neredeyse her işin kilidini açar",
      ],
      answer: 0,
      explain: `İçselleştirmeye değer biçim şu: yetenek erken doyar, patlama yarıçapı doymaz. İlk birkaç yetki faydalı işin neredeyse tamamını yapar; yani "ne olur ne olmaz" diye eklenenler hemen hemen her zaman saf maruziyettir. Önündeki iş için ver, ileride hayal edebileceğin iş için değil.`,
    },
    {
      kind: "theory",
      body: `## Hata yolunu tasarla

Amatörler model *haklıyken* ne olacağını tasarlar. Mühendisler **yanıldığında** ne olacağını tasarlar — çünkü bazen yanılacak.

- Başarısız bir kontrol **merge'ü engeller**; boşluğa bir uyarı yazıp geçmez.
- Yeniden denemelerin bir **bütçesi** vardır; böylece takılan bir model faturaya değil, durmuş bir modele dönüşür.
- Bir insan **bağlamıyla birlikte bir diff** inceler; asla çoktan production'a girmiş bir oldubittiyi değil.
- Rollback test edilmiş bir yoldur, bir dua değil.

Harness'ın her adımı için tek bir soru sor: *"bu yanlış olduğunda onu ne yakalar?"* Cevap "umarım hiçbir şey ters gitmez" ise — o bir dilek, tasarım değil.`,
    },
    {
      kind: "diagram",
      body: "Bir dilek ve tasarlanmış bir yol, yan yana:",
      caption:
        "Code review'da ikisi de tedbir gibi görünür. Önemli olduğu gün bir şey yapan yalnızca biri.",
      view: {
        kind: "compare",
        columns: [
          { id: "wish", label: "bir dilek", tone: "bad" },
          { id: "designed", label: "tasarlanmış bir yol", tone: "good" },
        ],
        rows: [
          {
            label: "ne olduğu",
            cells: [
              { text: "\"dikkatli ol ve bir daha kontrol et\"", tone: "bad" },
              { text: "merge'ü engelleyen kırmızı bir test paketi", tone: "good" },
            ],
          },
          {
            label: "model yanıldığında",
            cells: [
              { text: "kendinden emin, devam eder", tone: "bad" },
              { text: "tuzak telinde durur", tone: "good" },
            ],
          },
          {
            label: "kim öğrenir",
            cells: [
              { text: "bug'a kim çarparsa", tone: "bad" },
              { text: "elinde diff ve hata olan bir insan", tone: "good" },
            ],
          },
          {
            label: "ne zaman",
            cells: [
              { text: "production'da, sonradan", tone: "bad" },
              { text: "hiçbir şey merge olmadan önce", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Bunlardan hangisi **tasarlanmış** bir hata yoludur?`,
      options: [
        "Kırmızı bir test paketi auto-merge'ü engeller ve bir insan diff'i ve başarısız çıktıyı alır",
        "Prompt modele son derece dikkatli olmasını ve her şeyi bir daha kontrol etmesini sıkı sıkıya tembihler",
        "Döngü aynı işi, çıktı sonunda geçene kadar sınırsızca yeniden dener",
      ],
      answer: 0,
      explain: `Talimatlar umuttur — faydalıdır, ama hiçbir şeyi *yakalamaz*. Sınırsız yeniden deneme, tavanı olmayan bir faturadır (ileriki bir bölüm çareyi adlandırıyor). Tasarlanmış bir yolda bir tuzak teli, bir duruş ve harekete geçecek kadar bağlamı olan bir insan vardır.`,
    },
    {
      kind: "theory",
      body: `## Baştan beri birinin içindeydin

Etrafına bak: **TUSST bir harness.**

Forge'un notlandıran runner'ı bir doğrulama harness'ı — çözümün bir sandbox'ta çalışır, gizli sınavlar onu yargılar ve ne kadar kendinden emin yazarsan yaz, hiçbir düzyazı kırmızıyı yeşile çevirmez. On-chain lab'lar daha da ileri gider: deploy ettiğini *söyleyip söylemediğini* sormazlar — **zinciri okur** ve kontrol ederler.

Disiplin tek bir görüntüde bu: tezgâhı öyle kur ki yanılmak *tespit edilebilir*, haklı olmak *kanıtlanabilir* olsun — modeller için de insanlar için de.

**Sırada:** kelimelerin kendisi — modelin tezgâhta gerçekte ne gördüğü.`,
    },
  ],
  testOut: [
    {
      question: `Otomatik bir döngüye neden mainnet değil de testnet anahtarları verilir?`,
      options: [
        "Bir model yalnızca tamamen kaybolmasına omuz silkebileceğin anahtarları tutmalı — friendbot lumen'leri bedava, hazine anahtarıysa geri sayımı başlamış bir olay",
        "Çoğu SDK otomatik bağlamlarda mainnet anahtarlarını reddeder",
        "Testnet işlemleri daha hızlıdır, böylece döngü daha erken yinelenir",
      ],
      answer: 0,
    },
    {
      question: `Bunlardan hangisi tasarlanmış bir hata yoludur?`,
      options: [
        "Kırmızı bir test paketi auto-merge'ü engeller ve bir insan diff'i ve başarısız çıktıyı alır",
        "Prompt modele dikkatli olmasını ve her şeyi bir daha kontrol etmesini sıkı sıkıya tembihler",
        "Döngü aynı işi bir şey geçene kadar sınırsızca yeniden dener",
      ],
      answer: 0,
    },
    {
      question: `Bir harness'taki her adıma sorulacak tek soru nedir?`,
      options: [
        "Bu yanlış olduğunda onu ne yakalar?",
        "Bu adım pratikte ne sıklıkla başarısız oluyor?",
        "Bu adım daha hızlı ya da daha ucuz hale getirilebilir mi?",
      ],
      answer: 0,
    },
    {
      question: `Modele açık ağ erişimi ve her yere yazabildiği bir dizin veriyorsun. Bu gerçekte ne satın aldı?`,
      options: [
        "Neredeyse hiç ek yetenek, ve bolca patlama yarıçapı — \"ne olur ne olmaz\" yetkisinin klasik biçimi",
        "Yetenek ve riskte kabaca orantılı kazanımlar",
        "Riskten çok yetenek, çünkü çoğu iş er geç ikisine de ihtiyaç duyar",
      ],
      answer: 0,
    },
  ],
};
