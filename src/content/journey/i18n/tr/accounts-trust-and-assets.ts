import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Hesaplar, trustline'lar ve varlıklar",
  tagline: "Hesaplar, rezervler ve trustline'lar: bir varlığı tutmak neden opt-in'dir.",
  steps: [
    {
      kind: "theory",
      body: `## Hesap bir ledger kaydıdır

Cüzdan arayüzünü soyup at; geriye bir Stellar **hesabı** olarak çoğaltılmış ledger'da (defterde) tek bir satır kalır: bir public key, bir XLM bakiyesi, birkaç flag — ve zarfları parçalarken tanıştığın **sequence number** (replay'e karşı koruyan sayaç).

Satırlar bedava değil. Her validator her kaydı sakladığı için her kaydın bir **temel rezerv** XLM kilitlemesi gerekir — şu an 0.5 XLM; yeni bir hesap ise harcayamadığı en az iki rezerv (1 XLM) tutar. Kayıtları sil, rezerv geri gelir.

Rezerv bir ücret değil. **Depozitoyla kira**: şişkinliğin bir fiyat etiketi olduğu için ledger yalın kalır.`,
    },
    {
      kind: "theory",
      body: `## Trustline'lar: varlıklar opt-in'dir

Birçok zincirde herkes adresine çöp token airdrop'layabilir. Stellar'da yapamazlar: XLM dışında herhangi bir varlığı (asset) tutmak için hesabının önce ona bir **trustline** açması gerekir.

Trustline şunu der: *"Y ihraççısından (issuer) gelen X varlığını, şu **limite** kadar kabul ediyorum."* \`change_trust\` operasyonuyla oluşturulur, kendi başına bir ledger kaydıdır — yani **bir temel rezerv** kilitler — ve o var olana kadar sana o varlıkla yapılan bir ödeme \`op_no_trust\` ile başarısız olur.

Tasarım gereği opt-in: bilançonda yalnızca tutmayı kabul ettiklerin var.`,
    },
    {
      kind: "diagram",
      body: "İhraç edilmiş bir varlık ve ona kimlerin dokunabileceği:",
      caption: "Kesikli çizgiler trustline'lar — opt-in ve geri alınabilir. Düz çizgi ise yalnızca iki ucu da opt-in olduğu için var.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "issuer",
            label: "İHRAÇÇI",
            x: 50,
            y: 12,
            tone: "gold",
            shape: "box",
            note: "Varlığı, sadece ödeyerek var eder. Mint yok, arz tablosu yok.",
          },
          {
            id: "ana",
            label: "ANA",
            x: 16,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "Bir trustline açtı — bu opt-in, varlıktan bir miktar bile tutabilmesini sağlayan şey.",
          },
          {
            id: "bruno",
            label: "BRUNO",
            x: 50,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "O da opt-in yaptı, o yüzden Ana ona ödeme yapabilir. İki ucun da trustline'a ihtiyacı var.",
          },
          {
            id: "caio",
            label: "CAIO",
            x: 84,
            y: 45,
            tone: "neutral",
            shape: "box",
            note: "Hiç açmadı. Ne kadar uğraşırlarsa uğraşsınlar kimse ona bu varlığı gönderemez.",
          },
        ],
        edges: [
          {
            from: "issuer",
            to: "ana",
            label: "trustline",
            style: "dashed",
          },
          {
            from: "issuer",
            to: "bruno",
            style: "dashed",
          },
          {
            from: "ana",
            to: "bruno",
            label: "ödeme",
            style: "solid",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Rezerv, sayılmış hâliyle

Rezervlere dair soyut kurallar, birini toplamaya başladığın anda apaçık hale gelir. İşte sıradan, çalışan bir hesap:

- **Hesabın kendisi** — 2 temel rezerv.
- **Üç trustline** — USDC, EURC ve bir anchor'ın yerel token'ı: 3 daha.
- DEX'te **bir açık teklif** — 1 daha.

**0.5 XLM'den** altı kayıt: **3 XLM kilitli.** Hesapta 3.4 XLM varsa harcanabilir bakiye 0.4'tür — ve 1 XLM'lik bir ödeme, açıkça karşılıyormuş gibi görünen bir bakiyeyle başarısız olur.

O hatanın Stellar'daki her destek kuyruğunda bir adı var: *"Param var ama ödeme underfunded diyor."* Para orada. Sadece **kullanılabilir** değil, çünkü kullanılabilirlik toplam eksi rezervdir ve hesap yeni bir şey tutmayı her kabul ettiğinde rezerv büyüdü.

İyi haber şu: hiçbiri harcanmadı. Teklifi kapat, 0.5 XLM geri gelir. Artık ihtiyaç duymadığın bir trustline'ı kapat, bir 0.5 daha. Rezerv, ledger alanı için verilen bir depozito — kullanmayı bıraktığın anda iade edilir.`,
    },
    {
      kind: "theory",
      body: `## Opt-in aslında neyi engelliyor

Trustline, ledger'ı onsuz hayal edene kadar sürtünme gibi gelir.

Herkesin herhangi bir adrese token itebildiği bir zincirde cüzdanın, yabancıların yazabildiği herkese açık bir gelen kutusudur. Airdrop'lanan token'lar istenmeden gelir — kimi pazarlama, kimi gerçek bir varlığı taklit etmek için adlandırılmış, kimi de onlarla etkileşmen sana bir şeye mal olsun diye tasarlanmış. Sonra her cüzdana bir filtre, her filtreye bir liste gerekir ve her liste, neyi görmene izin verildiği hakkında birinin verdiği bir karardır.

Stellar bu kararı bir katman aşağıya, protokolün içine taşır: **bir varlık, ona trustline açmamış bir hesaba inemez.** Kimse, senin önceden verilmiş, açık ve ledger üzerindeki rızan olmadan hesabına hiçbir şey koyamaz.

Bu rızayı dürüst kılan şey rezerv. Her trustline 0.5 XLM kilitler; dolayısıyla birini açmak, bir script'in on bin kez yaptığı bir şey değil, küçük ama bilinçli bir eylemdir — kapatmak da rezervi geri verir.

Sürtünme, olayın ta kendisiydi.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Bunu zaten kendi ellerinle yaptın: Forge'daki **İlk Cüzdanın** lab'ı canlı testnet'te senin imzanla \`change_trust\` gönderiyor — bakiyende yeni bir varlığın belirdiği an, doğmakta olan bir trustline'dı. O lab'ı atladıysan, gidip gerçekten bir tane açmak için bundan iyi bölüm yok.`,
    },
    {
      kind: "theory",
      body: `## Tutmak ve yaratmak

Artık ledger'daki herhangi bir hesabı okuyabilirsin: var olmanın maliyeti, her kaydın bu maliyete ne eklediği ve hangi varlıkları tutmayı kabul ettiği.

Şimdiye kadar her şey tutanın tarafındandı. Tersine çevir, bambaşka bir soru seti belirir: bir varlık aslında nasıl var olur, kim bir tane yaratabilir ve — her regüle ihraççının cevaplamak zorunda olduğu soru — ihraççı sonrasında onu kimin tuttuğunu kontrol edebilir mi?

**Sırada:** trustline'ın öteki tarafı.`,
    },
  ],
  testOut: [
    { question: `Yapısal olarak Stellar'da hesap nedir?`,
      options: ["Bakiyesi, sequence number'ı ve imzacıları olan bir ledger kaydı — var olmaya devam etmesi asgari bir rezerve mal olur","Protokolün çağırdığı bir sistem kontratının içindeki bir kayıt","Bir public key; anahtar kullanılana kadar ledger hiçbir şey saklamaz"], answer: 0 },
    { question: `Her ek ledger kaydı bir hesabın asgari bakiyesini neden yükseltir?`,
      options: ["Her kayıt her validator'a storage'a mal olur; rezerv bu süregelen maliyeti fiyatlar — ve kayıt kaldırıldığında iade edilir","Validator operasyonlarını finanse eden bir ücrettir","Hesapları birden fazla varlık tutmaktan caydırır"], answer: 0 },
    { question: `Biri sana hiç duymadığın bir varlık gönderiyor. Ne olur?`,
      options: ["Ödeme başarısız olur — bir varlık, ona trustline açmamış bir hesaba inemez","Gelir ve sen kaldırana kadar bakiyelerinde görünür","Sen kabul ya da reddedene kadar protokol tarafından tutulur"], answer: 0 },
    { question: `Bir trustline açmak seni aslında neye bağlar?`,
      options: ["Bir rezerv kilitlemeye ve o belirli ihraççıdan o belirli varlığı tutmaya ledger üzerinde rıza göstermeye","İhraççının bakiyeni dondurmayacağına güvenmeye","Varlığı tuttuğun sürece yinelenen bir ücret ödemeye"], answer: 0 },
  ],
};
