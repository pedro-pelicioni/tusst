import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Temiz Kale",
  tagline: "Clean architecture: kaynak kodu bağımlılıkları içeri bakar, yalnızca içeri.",
  steps: [
    { kind: "theory", body: `## Kale ve surları

Mimari, defalarca verilen tek bir karardır: **ne neye bağımlı olabilir.**

Bir kale düşün. **İç halkada** *entity*'lerin ve *use-case*'lerin yaşar — dApp'ini senin yapan kurallar: fonları kim serbest bırakabilir, iade ne zaman gerekir. **Dış halkada** değişen dünya yaşar: UI, veritabanı, chain SDK'sı, cüzdan.

**Bağımlılık kuralı** kalenin tek yasasıdır: *kaynak kodu bağımlılıkları içeri bakar, yalnızca içeri.* Dış halka iç halkanın adını anabilir. İç halka dış halkanın adını asla — *asla* — anmaz.` },
    { kind: "theory", body: `## Neden içeri?

Çünkü iki halka farklı hızda yaşlanır. Framework'ler durmadan değişir: SDK major sürümleri iner, UI kütüphaneleri yükselir ve düşer, veritabanları değiştirilir. **İş kuralları hepsinden uzun yaşar** — "iki taraf da onaylamalı" beş yıl sonra hangi framework onu barındırıyorsa orada da doğru olacak.

Alanın chain SDK'sını import ediyorsa, SDK'daki her kırıcı değişiklik bir *alan* migrasyonuna dönüşür — en yavaş değişen kodun, en hızlı değişen bağımlılığına rehin. Okları içeri çevir, değişim ucuz olduğu yerde, dış halkada kalsın.

Mesele kaledir. Framework'ler mobilya.` },
    { kind: "diagram", body: "Kale, dıştan içe:",
      caption: "Her ok içeri bakar. Alan bir veritabanının adını asla öğrenmez.",
      view: { kind: "stack", bands: [
        { id: "infra", label: "altyapı", note: "Postgres, Horizon, dosya sistemi, saat. Tanım gereği değiştirilebilir.", tone: "neutral" },
        { id: "adapters", label: "adapter'lar", note: "Dış dünyayı, içerinin zaten konuştuğu şekillere çevirir.", tone: "teal" },
        { id: "app", label: "uygulama", note: "Use case'ler: tek bir isteğe cevap veren alan hamleleri dizisi.", tone: "accent" },
        { id: "domain", label: "alan", note: "Kâğıt üstünde de doğru kalacak kurallar. Hiçbir şey import etmez.", tone: "gold" },
      ] } },
    { kind: "widget", component: "dependency-rule",
      body: `Yasanın bir şekli var ve düzyazı onu çizemez. **Import'ları aç** ve yasal olanların nereye düştüğünü izle — sonra bilerek bir surda gedik aç ve sana neye mal olduğunu oku.` },
    { kind: "theory", body: `## Her gedik makuldü

Kimse kuralı kötü niyetle çiğnemez. Bir salı günü, iyi bir sebeple, teslim tarihi ensesindeyken çiğner.

Escrow use-case'i, deadline'ın geçip geçmediğine karar vermek için güncel ledger sequence'ına ihtiyaç duyar. Sayı tek bir \`server.ledgers()\` çağrısı uzaklıkta. Onun için bir port yazmak demek bir interface, bir adapter, testler için bir fake demek — *hemen orada* duran bir sayı için yirmi dakika. Böylece SDK alana import edilir, yanına da temizleneceğine söz veren bir yorum.

Sekiz ay sonra o tek import üç şey yapmıştır. Alan artık bir ağ istemcisi olmadan build olmuyor. Use-case testleri çalışan bir node istiyor, o yüzden yavaşladılar, o yüzden atlanır oldular. Ve SDK'nın major sürümü çıktı; bu da artık bir **alan** migrasyonu demek.

Yirmi dakika gerçekti. Faizi de.

Kural, hakkını tam da bürokrasi gibi hissettirdiği günlerde verir — çünkü gerekli hissettirdiği gün, bedelin çoktan ödendiği gündür.` },
    { kind: "quiz", question: `Bir Stellar dApp'inden üç import. Hangisi **bağımlılık kuralını çiğniyor**?`,
      options: [
        "domain/escrow.ts, bir işlem kurmak için @stellar/stellar-sdk import ediyor",
        "adapters/horizon.ts, implement etmek için alandaki PaymentsPort interface'ini import ediyor",
        "ui/ReleaseButton.tsx, çağırmak için alandaki release use-case'ini import ediyor",
      ], answer: 0,
      explain: `Diğer ikisi dış halkanın iç halkanın adını anması — kuralın tam tasarlandığı gibi işlemesi. Alanın SDK'yı import etmesi ise içerinin dışarının adını anması: artık bir tedarikçi her major sürüm çıkardığında kalenin en derin odaları sarsılıyor.` },
    { kind: "quiz", question: `Koku nerede?`,
      options: [
        "Escrow fonlarının serbest bırakılıp bırakılamayacağına kendisi karar verip sonra butonu render eden bir React bileşeni",
        "Bir PaymentsPort interface'ine bağımlı olan ve serbest bırakmayı orkestre eden bir use-case",
        "Horizon hata kodlarını alanın kendi hata tiplerine çeviren bir adapter",
      ], answer: 0,
      explain: `UI'da yaşayan bir iş kuralı çekirdek testlerine görünmezdir ve ona ihtiyaç duyan bir sonraki ekran onu kopyalar. Ayna ikizi alanın içindeki SQL'dir — iç halkanın dışarı uzanması. Kurallar çekirdeğe, çeviri kenara.` },
    { kind: "fill", prompt: `Test mekaniktir — bir alan dosyası aç ve import'larını oku:`,
      file: "domain/release-escrow.ts",
      before: `O import listesindeki bir framework ya da tedarikçi adı `,
      after: ` demektir.`,
      choices: ["bir surda gedik açılmış", "dosyaya neden diye açıklayan bir yorum gerekiyor", "import lazy yüklenmeli", "framework sürümü eskimiş"], answer: 0,
      explain: `Bunun için yargıya ihtiyacın yok, mesele de bu — bu bir grep. \`@stellar/stellar-sdk\`'nın, bir ORM'nin ya da bir React hook'unun adını anan bir alan dosyası, o günkü sebep ne kadar makul olursa olsun tartışmayı çoktan kaybetmiştir.` },
    { kind: "theory", body: `## Yasa ve eksik mekanizma

Artık her okun hangi yöne bakması gerektiğini söyleyebilir ve herhangi bir dosyayı saniyeler içinde kontrol edebilirsin.

Henüz söyleyemediğin şey, iç halkanın bir işi nasıl **yaptığı**. Chain SDK'sının adını anmamalı — ama bir ödemenin yine de gönderilmesi gerekiyor. Veritabanından haberi olmamalı — ama escrow'un yine de bir yerde depolanması gerekiyor. Yararlı şeyi imkânsız kılan bir yasaya kimse uymaz.

**Sırada:** kalenin kendi surlarına açtığı kapılar ve onların dışında kimin durmasına izin verildiği.` },
  ],
  testOut: [
    { question: `Bağımlılık kuralını söyle.`,
      options: ["Kaynak kodu bağımlılıkları yalnızca içeri bakar — dış halka iç halkanın adını anabilir, tersi asla","Her katman hemen altındaki katmana bağımlı olabilir, daha ötesine değil","Bağımlılıklar hangi modül en az değişiyorsa ona doğru bakar"], answer: 0 },
    { question: `Neden dışarı değil de içeri?`,
      options: ["Framework'ler durmadan değişir ve iş kuralları onlardan uzun yaşar — dışarı bakmak en yavaş kodunu en hızlı bağımlılığına rehin bırakır","İç modüller daha küçüktür, import'ları olmayınca daha hızlı derlenirler","Otomatik bağımlılık grafiklerini çizmeyi kolaylaştıran bir gelenektir"], answer: 0 },
    { question: `Hangi import kuralı çiğniyor?`,
      options: ["domain/escrow.ts'nin bir işlem kurmak için chain SDK'sını import etmesi","adapters/horizon.ts'nin implement etmek için bir alan interface'ini import etmesi","ui/ReleaseButton.tsx'in çağırmak için bir use-case import etmesi"], answer: 0 },
    { question: `Bir React bileşeni escrow fonlarının serbest bırakılıp bırakılamayacağına karar veriyor, sonra butonu render ediyor. Bunda yanlış olan ne?`,
      options: ["UI'daki bir iş kuralı çekirdeğin testlerine görünmezdir ve ona ihtiyaç duyan bir sonraki ekran onu kopyalar","Hiçbir şey — kararı render'a yakın vermek kodu bir arada tutar","Yalnızca performans: kontrol her render'da yeniden çalışır"], answer: 0 },
  ],
};
