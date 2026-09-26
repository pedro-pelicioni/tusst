import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "SCP: Düğümler Konseyi",
    tagline: "Quorum kur, konsensüsün yakınsamasını izle, sonra bile isteye kır.",
  },
  steps: {
    "intro": {
      body: `## Konsey karar verir

Madencilik yok. Staking yok. Stellar her ~5 saniyede bir ledger (defter) kapatır, çünkü validator'ları **Stellar Consensus Protocol**'ü çalıştırır: her düğüm küçük bir **konsey** (kendi *quorum slice*'ı) belirler ve o konseyin yeterince üyesi hareket edince kendisi de hareket eder.

Karşında minyatür bir ağ duruyor — üç organizasyona yayılmış yedi validator. Onu uzlaştıracaksın… sonra da kıracaksın.`,
    },
    "sim-first-close": {
      body: `### Önce: uzlaştır

**Ledger öner**'e bas ve kabulün konseyden konseye dalga dalga yayılıp her koltuk yanana kadar izle — bir ledger'ın kapanması işte bu.

Birkaç tane kapat. Ritmi hisset.`,
    },
    "quiz-local": {
      question: `Kabulün düğümden düğüme yayılmasını izledin. Her düğümü yakan neydi?`,
      options: [
        "Kendi konseyinin yeterince üyesi zaten kabul etmişti",
        "Merkezi bir koordinatörden izin aldı",
        "Stake ağırlıklı rastgele bir piyangoyu kazandı",
      ],
      explain: `Tamamen yerel: bir düğümün ağın nüfus sayımına değil, yalnızca kendi konseyine ihtiyacı var. Örtüşen konseyler yerel güveni küresel uzlaşıya dönüştürür.`,
    },
    "sim-break-it": {
      body: `### Şimdi: kır

Bir düğümü devir ve öner — ağ omuz silker. Aynı güven bölgesinde yoğunlaşmış daha fazlasını devir ve hayatta kalanların **durakladığı** anı bul.

Yapmadıkları şeye dikkat: asla iki rakip tarihe bölünmüyorlar.`,
    },
    "quiz-safety": {
      question: `Konseyin yeterince üyesini devirdin ve hayatta kalanlar devam etmek yerine dondu. Bir ödeme ağı için *tasarlanmış* davranış neden bu?`,
      options: [
        "Duraklamış bir ödeme kurtarılabilir; sonradan hiç olmamış sayılan bir ödeme kurtarılamaz",
        "Donmak, kesintiler sırasında elektrik tasarrufu sağlar",
        "Düşen düğümlerin madencilerle değiştirilmesi için zaman kazandırır",
      ],
      explain: `Canlılıktan önce güvenlik: SCP fork'lamaktansa durur. "Kesinleşen" para kesinleşmiş kalmalı — o yüzden uzlaşı imkânsız olduğunda Stellar bekler.`,
    },
    "quiz-recovery": {
      question: `Düşen düğümleri yeniden ayağa kaldırıyorsun. Duraklamış koltuklara ne olur?`,
      options: [
        "Konseyleri yeniden tatmin edilebilir — ağ ledger kapatmaya devam eder",
        "Zinciri genesis'ten itibaren yeniden indirmeleri gerekir",
        "Hiçbir şey; duraklamış bir ağ sonsuza dek duraklamış kalır",
      ],
      explain: `Simülatörde dene: düşenleri kaldır, öner, ritim geri gelir.`,
    },
    "claim": {
      body: `Ledger'lar kapattın, bir ağı durdurdun ve iyileştirdin — federe uzlaşının tüm yaşam döngüsü, tek oturuşta. Lab'ı mühürle ve XP'ni al.`,
    },
  },
} satisfies LabTextOverlay;
