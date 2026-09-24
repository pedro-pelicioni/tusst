import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Konsensüs ve Stellar ağı",
  tagline: "Konsensüs (SCP): binlerce makine bir kral olmadan nasıl anlaşır.",
  steps: [
    {
      kind: "theory",
      body: `## Kralsız anlaşma

Her blockchain tek bir soruya cevap verir: **yabancılar ledger'ın (defterin) bir sonraki sayfasında nasıl anlaşır?**

- Proof-of-Work *elektrikle* cevap verir — en çok yakan yazar.
- Proof-of-Stake *kilitli sermayeyle* cevap verir — en çok stake eden yazar.
- **Stellar güvenle cevap verir**: her düğüm inandığı düğümleri adlandırır ve anlaşma bu beyanlar boyunca dalga dalga yayılır. Madencilik yok, staking yok — **Stellar Consensus Protocol (SCP)**.

Sonuç: ledger'lar ~5 saniyede kapanır, ücretler sentin kesirlerine mal olur ve ağ, bir üniversitenin karşılayabileceği makinelerde çalışır.`,
    },
    {
      kind: "theory",
      body: `## Quorum slice'lar: "benim konseyim"

Her düğüm bir **quorum slice** beyan eder — onsuz kıpırdamayı reddettiği küçük bir düğüm konseyi:

> "Bir ledger'ı, **konseyimin yeterince büyük bir kısmı** kabul ettiğinde kabul ederim."

Konseyler örtüşür: konsey üyelerinin kendi konseyleri vardır ve bu güven zincirleri bütün ağı birbirine örer. Bir **quorum**, *her üyesi için* tatmin olmuş bir konsey içeren düğüm kümesidir — bir quorum anlaştığı anda ledger kapanır.

Küresel liste yok. Kayıt ofisi yok. Güven yerel olarak beyan edilir ve küresel olarak anlaşmaya dönüşür — tıpkı insan kurumlarının federe olduğu gibi.`,
    },
    {
      kind: "widget",
      component: "scp-sim",
      body: `## Düğümler Konseyi

Yedi validator, her biri küçük bir konseye güveniyor. **Bir ledger öner** ve kabulün slice'lar boyunca dalga dalga yayılmasını izle. Sonra her iyi mühendisin bir konsensüs protokolüne yaptığını yap: **düğümlere tıklayıp onları devir** ve hayatta kalanların ne yaptığına bak.

Ağın *durduğu* noktayı bulmaya çalış — ve bölünmek yerine durduğunu fark et.`,
    },
    {
      kind: "quiz",
      question: `SCP'de tek bir düğüm bir ledger'ı ne zaman kabul eder?`,
      options: [
        "Kendi quorum slice'ının yeterince büyük bir kısmı kabul ettiğinde",
        "Dünyadaki tüm düğümlerin %51'i kabul ettiğinde",
        "Kriptografik bir bulmacayı ilk o çözdüğünde",
      ],
      answer: 0,
      explain: `Her şey yerel: bir düğüm, *konseyi* hareket edince hareket eder. Küresel anlaşma örtüşen konseylerden doğar — hiçbir düğümün bütün ağın nüfus sayımına ihtiyacı olmaz.`,
    },
    {
      kind: "theory",
      body: `## Listeyi sana kimse vermez

İşte ilk duyduğunda bug gibi gelen kısım: **resmî bir validator listesi yok.** Kimin sayılacağına hiçbir kayıt defteri karar vermiyor. Her katılımcı, bağlı olmaya razı olduğu diğerlerini adlandırır ve kayıt süreci bundan ibaret.

Bu da bariz itirazı doğurur. Herkes kendi konseyini seçiyorsa, ağın kendi içinde anlaşan ama birbiriyle anlaşamayan iki gruba bölünmesini ne engeller?

Cevap **örtüşme**. İki katılımcının aynı sonuca varması ancak güven çemberleri yeterince kesişiyorsa garanti edilebilir — ve pratikte kesişirler, çünkü herkes bağımsız olarak aynı bir avuç iyi yönetilen, kamuya hesap veren kurumu adlandırır. Bütün ağın güvenliği, kime bel bağlamaya değeceği hakkında verilen bir sürü ayrı, çıkarcı seçimin ortaya çıkardığı bir özelliktir.

Bu, "protokol seçer"den gerçekten farklıdır ve fark iki yönlü keser. Kimse etki kazanmak için kendini bir listeye ekleyemez. Ama kimse sana iyi bir yapılandırma da veremez — **kötü seçmek, yapmana izin verilen bir şeydir.** Bu yüzden validator çalıştıran herkes için pratik tavsiye sıkıcı ve doğrudur: yayınlanmış, iyi analiz edilmiş bir yapılandırmadan başla ve her sapmayı yapmadan önce anla.`,
    },
    {
      kind: "theory",
      body: `## Canlılıktan önce güvenlik

Simülatörde gördün: bir konseyin çok büyük kısmını devir, ağ **bekler**. Tahmin etmez. İki tarihe bölünmez.

Bu bilinçli bir takas ve bir adı var:

- **Güvenlik (safety)** — ağ asla birbiriyle çelişen iki ledger'ı onaylamaz.
- **Canlılık (liveness)** — ağ *bir şeyleri* onaylamaya devam eder.

Seçmek zorunda kaldığında SCP **fork'lamak yerine durur**. Para taşıyan bir ağ için — maaşlar, havaleler, hazineler — duraklamış bir ödeme, sonradan *olmamış hale gelen* bir ödemeden iyidir.`,
    },
    {
      kind: "diagram",
      body: "Bir ağın başarısız olabileceği iki yol — ve yalnızca biri paranı geri alır:",
      caption: "Canlılıktan önce güvenlik: SCP kendisiyle çelişmektense durmayı tercih eder.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "fork",
            label: "fork'lanan ağlar",
            tone: "bad",
          },
          {
            id: "scp",
            label: "Stellar",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "anlaşma başarısız olduğunda",
            cells: [
              {
                text: "iki tarih yan yana devam eder",
                tone: "bad",
              },
              {
                text: "ledger sadece kapanmayı bırakır",
                tone: "good",
              },
            ],
          },
          {
            label: "neyi beklersin",
            cells: [
              {
                text: "muhtemelen güvende olacak kadar onay",
                tone: "bad",
              },
              {
                text: "hiçbir şey — kapanmış ledger kesindir",
                tone: "good",
              },
            ],
          },
          {
            label: "en kötü durum",
            cells: [
              {
                text: "bir ödeme saatler sonra geri alınır",
                tone: "bad",
              },
              {
                text: "bir ödeme gecikir",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Düğümünün quorum slice'ındaki validator'ların üçte biri çevrimdışı oluyor. Düğümün ne yapar?`,
      options: [
        "Durur — slice'ı yeniden tatmin edilene kadar ledger onaylamayı reddeder",
        "Fork'lanıp tarihin kendi sürümünü sürdürür",
        "Onlar dönene kadar madenciliğe geçer",
      ],
      answer: 0,
      explain: `Dur, fork'lama. Düğümün konseyini bekler; ağın geri kalanı hâlâ çalışan quorum'lar içeriyorsa *onlar* ledger kapatmaya devam eder ve konseyi döndüğünde düğümün yetişir.`,
    },
    {
      kind: "theory",
      body: `## Bu, inşacılara ne kazandırır

Anlaşma ucuz olduğu için ağ, varsayılan olarak **hızlı ve düşük ücretli** olmayı göze alabilir:

- Ledger'lar yaklaşık her **5 saniyede** kapanır — bir ödeme *kesindir*, "6 bloktan sonra muhtemelen kesin" değil.
- Temel ücret **100 stroop** (0.00001 XLM) — spam ölçekte pahalı, insanlar fark etmez bile.
- Kesinlik gerçek: ledger'a girdi mi, korkulacak re-org yok.

Forge'daki her lab bu ritmin üstünde çalışır — cüzdan lab'ında bir işlemin onaylanmasını izlediysen zaten hissettin.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `Kampanya'nın Perde VI'sı — **Takımyıldız Kapısı** — bunu uygulamalı yaptırıyor: hesaplar, ücretler, trustline'lar ve ilk ödemen. İsteğe bağlı; teorinin arkasındaki haritayı istediğinde sapağa değer.`,
    },
  ],
  testOut: [
    { question: `Bir katılımcı kimin anlaşmasına bağlı olacağına nasıl karar verir?`,
      options: ["Kendi quorum slice'ını adlandırır — resmî bir validator listesi yoktur ve kayıt, o adlandırmadan ibarettir","Protokol ona stake'e göre bir küme atar","SDF her protokol sürümünde yetkili validator kümesini yayınlar"], answer: 0 },
    { question: `Herkes kendi konseyini seçiyorsa ağın bölünmesini ne engeller?`,
      options: ["Örtüşme — güvenlik, güven çemberleri yeterince kesiştiğinde korunur; pratikte de kesişirler, çünkü katılımcılar bağımsız olarak aynı iyi yönetilen kurumları adlandırır","Gruplar anlaşamadığında protokolün uyguladığı bir eşitlik bozma kuralı","Her slice'ın içermek zorunda olduğu asgari bir validator sayısı"], answer: 0 },
    { question: `SCP canlılıktan çok güvenliği tercih eder. Ağ sıkıntıdayken bu ne anlama gelir?`,
      options: ["Birbiriyle çelişen iki tarihi riske atmaktansa durur — durmak telafi edilebilir, geçmiş hakkında anlaşamamak edilemez",
        "Ledger üretmeye devam eder ve her fork'u sonradan uzlaştırır",
        "Kilitlenmeyi kırmak için geçici bir lider seçer"], answer: 0 },
    { question: `Madenciliksiz konsensüs bir inşacıya somut olarak ne kazandırır?`,
      options: ["Birkaç saniyede bir ledger, sentin kesirleriyle ölçülen bir ücret ve kesinlik demek olan tek bir kapanış",
        "Daha yavaş kesinlik pahasına daha yüksek throughput",
        "Ücretsiz işlemler, çünkü ödenecek madenci yok"], answer: 0 },
  ],
};
