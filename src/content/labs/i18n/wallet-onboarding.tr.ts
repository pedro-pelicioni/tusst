import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "İlk Cüzdanın",
    tagline: "Bir anahtar çifti döv, bir hesabı uyandır, bir trustline aç, altın gönder.",
  },
  steps: {
    "intro": {
      body: `## Her kahramanın bir mührü olmalı

Stellar'da kimliğin bir **anahtar çiftidir**: dünyaya gösterdiğin bir açık adres (\`G\` ile başlar) ve canın pahasına koruduğun bir gizli anahtar (\`S\` ile başlar).

Form yok. E-posta yok. İzin yok. Kimliğini saf matematikten *dövüyorsun* — ve önümüzdeki birkaç dakika içinde bu kimlik fon tutacak, bir varlığa güvenecek ve başka bir hesaba ödeme yapacak. Hepsi gerçek, **testnet** üzerinde: Stellar'ın antrenman sahası; paralar oyuncak ama makine aynı.`,
    },
    "forge-keys": {
      title: "Anahtarlarını döv",
      body: `Çekicin tek vuruşu 32 bayt rastgelelik üretir ve iki anahtarı da ondan türetir. Gizli anahtar **tarayıcında** kalır — TUSST onu asla görmez ve bugün imzaladığın hiçbir şeye bir sunucu karışmaz.`,
      cta: "Anahtar çiftini döv",
      successBody: `Mührün basıldı:

\`{address}\`

Bu adres herkese açık — gönül rahatlığıyla paylaş. Altındaki gizli anahtar senin adına imza atar; onu elinde tutan herkes *sen* olur. Testnet'te sorun değil. Mainnet'te ise onu bir ejderha gibi koru.`,
    },
    "friendbot": {
      title: "Hesabı uyandır",
      body: `Şu an adresin sadece matematik — **ledger (defter) onu daha hiç duymadı**. Bir hesap ancak biri onu *temel rezervin* (ledger kaydının bedelini ödeyen küçük bir XLM depozitosu) üstüne fonladığında var olur.

Testnet'te **Friendbot** adlı yorulmak bilmez bir ruh, isteyen herkesi fonlar.`,
      cta: "Friendbot'u çağır",
      successBody: `Friendbot yanıt verdi — hesabın artık {balance} XLM ile **ledger'da var**.

Onunla birlikte iki şey doğdu: bir **bakiye** ve imzalayacağın her işlemi sayan bir **sıra numarası**. Herhangi bir explorer'da ara — artık kamuya açık kayıt.`,
    },
    "quiz-reserve": {
      question: `Friendbot'tan önce, adresine XLM göndermek özel bir \`create_account\` operasyonu gerektirirdi. Stellar neden yeni hesapların bir **temel rezerv** tutmasını ister?`,
      options: [
        "Hesabın ledger'daki kalıcı kaydının bedelini öder ve spam hesap açmayı pahalı tutar",
        "Validator'ların kâr olarak topladığı bir ücrettir",
        "Anahtarını kaybedersen Stellar desteğinin iade ettiği bir sigortadır",
      ],
      explain: `Tam isabet — her ledger kaydı (hesap, trustline, teklif) küçük bir rezerv kilitler ki ledger bedava çöple doldurulamasın. Kaydı sil, rezervi geri al.`,
    },
    "trustline": {
      title: "Bir trustline aç",
      body: `Hesabın XLM'i doğal olarak tutar — ama başka her varlığın **içeri davet edilmesi** gerekir. *Trustline* (güven hattı), senin ledger'a şunu demendir: "Circle'ın ihraç ettiği USDC'yi, şu limite kadar kabul ediyorum."

Stellar'da kimsenin sana çöp token airdrop'layamamasının sebebi bu: **trustline yoksa token da yok**. Bu işlem aynı zamanda ilk imzan.`,
      cta: "USDC'ye güven",
      successBody: `Trustline açık — hesabın artık **USDC** tutabilir (Circle'ın testnet ihracı).

Maliyetine dikkat: minicik bir ücret (~0.00001 XLM) ve kilitlenen bir temel rezerv daha, çünkü trustline yeni bir ledger kaydı. Sıra numaran da bir tık ilerledi.`,
    },
    "shrine": {
      title: "Bir yoldaş mührü kazı",
      body: `Boşluğa ödeme gönderemezsin — bir **hedef** lazım. İkinci bir adres kazıyalım: ilk adağını alacak küçük bir tapınak.

Onu üretip *gizli anahtarını denize atacağız*. Hesap var olacak, gönderdiklerini tutacak ve kimseye hesap vermeyecek. Bir anıt.`,
      cta: "Mührü kazı",
      successBody: `Tapınağın mührü:

\`{companion}\`

Henüz ledger'da yok — tıpkı Friendbot'tan önceki senin gibi. Ama bu kez ona hayat veren **sen** olacaksın.`,
    },
    "create-companion": {
      title: "Tapınağı yükselt",
      body: `Bir \`create_account\` operasyonu yeni bir adresi temel rezervin üstüne fonlar — Friendbot'un senin için yaptığının tam da aynısı. Şimdi bunu tapınak için **kendi** bakiyenden sen yapıyorsun: 100 XLM testnet altını.`,
      cta: "Yükselt (100 XLM gönder)",
      successBody: `Tapınak ayakta. Friendbot'un senin için yaptığı ayini az önce sen yaptın — **hesaplar hesap yaratır**. Bütün hiyerarşi bu; kayıt memuru diye bir şey yok.`,
    },
    "payment": {
      title: "Bir adak sun",
      body: `Klasik olan. Bir \`payment\` operasyonu değeri bir hesaptan diğerine taşır — ~5 saniyede kesinleşir, ücreti yaklaşık **0.00001 XLM**. Stellar'ın etrafında inşa edildiği işlem tam olarak bu.`,
      cta: "25 XLM gönder",
      successBody: `Adak teslim edildi — 25 XLM, kesin, geri alınamaz, kamu kaydında:

\`{tx}\`

Ücret, sıra numarası artışı, iki bakiye güncellendi, bir ledger kapandı. Beş saniye. Stellar ödemesi işte bu.`,
    },
    "quiz-recap": {
      question: `Biri tapınak hesabına **USDC** göndermek istiyor. Ulaşır mı?`,
      options: [
        "Hayır — tapınak hiç USDC trustline'ı açmadı, o yüzden ledger reddeder",
        "Evet — her hesap her varlığı alabilir",
        "Sadece daha yüksek ücret öderlerse",
      ],
      explain: `Doğru. Trustline'lar hesap başına, varlık başınadır. Ana hesabın USDC'ye güveniyor; tapınak yalnızca doğal XLM tutuyor. Ve gizli anahtarı denizin dibinde olduğundan, kimse onun için asla bir tane açamaz.`,
    },
    "claim": {
      body: `Ledger az önce yaptığın her şeyi hatırlıyor: doğan bir hesap, açılan bir trustline, kesinleşen bir ödeme. Adresini sun; Forge, XP'ni ödemeden önce zinciri kendisi okuyacak — **vaat değil, kanıt**.`,
    },
  },
} satisfies LabTextOverlay;
