import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Lonca Kasası",
    tagline: "Multisig eşikleri — iki yetkiliye ihtiyaç duyan bir hazine.",
  },
  steps: {
    intro: {
      body: `## Tek anahtar, tek hata noktası

Şimdiye dek imzaladığın her şey tam olarak tek imza istedi: seninkini. Oyun hesabı için sorun değil, hazine için pervasızlık — her şeyi taşıyabilen anahtar, aynı zamanda çalınabilen, kaybedilebilen ya da zorla alınabilen anahtardır.

Diğer zincirlerdeki alışılmış cevap bir multisig kontratı deploy etmektir. Stellar'da hiçbir şey deploy etmezsin: **her hesabın zaten imzacıları ve eşikleri vardır**. Çıtayı yükseltmek bir ayar meselesi.`,
    },
    "forge-keys": {
      title: "İlk yetkili",
      body: `Kendi anahtar çiftin — kasaya dönüşecek hesap.`,
      cta: "Anahtarları hazırla",
      successBody: `Kasa \`{address}\` olacak.`,
    },
    fund: {
      title: "Kasayı fonla",
      body: `İmzacılar birer alt kayıttır ve alt kayıtlar rezerve mal olur. XLM'i olmayan bir kasa ikinci bir yetkiliyi karşılayamaz.`,
      cta: "Friendbot'u çağır",
      successBody: `Fonlandı: {balance} XLM.`,
    },
    weights: {
      body: `## Rol değil, ağırlık

Stellar'da "admin" kavramı yoktur. Aritmetik vardır.

Her imzacı bir **ağırlık** taşır. Her operasyon türü üç **eşikten** biriyle korunur — düşük, orta, yüksek. Bir işlem, imzalarının ağırlıkları taşıdığı operasyonun eşiğine ulaştığında yetkilendirilir.

- **Düşük** — allow trust, bump sequence.
- **Orta** — ödemeler, teklifler, günlük yaptığın neredeyse her şey.
- **Yüksek** — imzacıların ve eşiklerin kendisini değiştirmek.

Hesabın şu anda: ağırlığı 1 olan tek imzacı (master key), tüm eşikler 0. Tek imza her şeyi geçer.`,
    },
    "second-officer": {
      title: "İkinci yetkiliyi ata",
      body: `İkinci bir anahtar çifti. Burada yalnızca **açık** adresi önemli — kasanın kimin eş-imza atabileceğini bilmesi gerekir, gizli anahtarını değil.`,
      cta: "Bir yetkili ata",
      successBody: `İkinci yetkili: \`{companion}\`.

Bu adres şimdi kasanın kendi ledger kaydına, seninkinin yanına yazılacak.`,
    },
    "quiz-threshold": {
      question: `Yetkiliyi ağırlık 1 ile ekleyip **orta** eşiği 2'ye ayarlıyorsun. O andan itibaren master key tek başına ne yapabilir?`,
      options: [
        "Orta gerektiren hiçbir şeyi — bir ödeme artık iki imza ister",
        "Her şeyi, çünkü master key eşikleri her zaman ezer",
        "Yalnızca değişiklikten önce imzaladığı operasyonları",
      ],
      explain: `Ezme diye bir şey yok. Master key sadece ağırlığı olan bir imzacı; ağırlığı tek başına eşiğe ulaşmıyorsa imzası da tek başına yetmez. Güvenlik özelliğinin tamamı bu — ve bir sonraki adımın dikkat ettiği tuzağın da tamamı.`,
    },
    "raise-the-bar": {
      title: "Çıtayı yükselt",
      body: `Tek operasyon hepsini yapar: yetkiliyi ağırlık 1 ile ekle, master key'ini ağırlık 1'de tut ve **orta** eşiği 2 yap.

Bilerek dokunulmayana dikkat: **yüksek** eşik 0'da kalıyor, böylece bu düzeni tek imzayla hâlâ geri alabilirsin. Yüksek eşiği ortayla aynı anda 2'ye çıkarmak, insanların kendi kasalarının dışında sonsuza dek kalmasının yoludur.`,
      cta: "Eşikleri ayarla",
      successBody: `Kasa mühürlendi.

İki imzacı, her biri ağırlık 1, orta eşik 2. Bundan böyle bu hesaptan çıkan bir ödeme **her iki** yetkiliyi de ister — ve bunu senin süreç dokümanın değil, ledger uygular.

Forge'un **Hesap** sekmesini bu adresle aç: imzacılar ve eşikler tam orada, zincirin gördüğü haliyle.`,
    },
    "quiz-lockout": {
      question: `Bir lonca orta **ve** yüksek eşiği 3'e ayarlıyor; üç yetkili, her biri ağırlık 1. Bir yetkili anahtarını kaybediyor. O kasanın durumu ne?`,
      options: [
        "Kalıcı olarak donmuş — imzacıları değiştirmek yüksek ister ve yükseğe artık ulaşılamaz",
        "Sorun yok: kalan ikisi kayıp anahtarı oylayıp çıkarabilir",
        "Sorun yok: master key imzacıları her zaman sıfırlayabilir",
      ],
      explain: `Gerçek hazinelerin ölmesinin en yaygın yolu tam olarak bu. Hırsızı durduran kural, bir anahtar kaybolunca seni de durdurur. Her zaman eşiğine hâlâ ulaşabildiğin bir kurtarma yolu bırak.`,
    },
    "claim-xp": {
      body: `Tek satır kod deploy etmeden sıradan bir hesabı ikide-iki hazineye çevirdin.

Sunucu şimdi bu hesabı zincirden okuyup kendisi kontrol edecek: en az iki imzacı, orta eşik en az 2.`,
    },
  },
} satisfies LabTextOverlay;
