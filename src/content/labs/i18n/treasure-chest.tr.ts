import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Hazine Sandığı",
    tagline: "Altını, yalnızca adı yazılı talep sahibinin açabileceği bir sandığa kilitle.",
  },
  steps: {
    intro: {
      body: `## Henüz kimsenin olmayan altın

Şimdiye dek karşılaştığın her bakiye bir hesaba aitti. **Talep edilebilir bakiye** (claimable balance) ise kimseye ait değildir: başlı başına bir ledger (defter) kaydıdır; bir miktar tutar, kimin alabileceğini ve hangi koşulla alabileceğini belirtir.

Gönderenin artık altını yok. Talep sahibinin de yok — uzanıp almadığı sürece. Arada altın ledger'da durur: herkese görünür, tam olarak tek bir adres tarafından harcanabilir.

Escrow, airdrop, vesting ve "al, hazır olunca kullanırsın" — hepsi tek satır kontrat kodu olmadan işte böyle kurulur.`,
    },
    "forge-keys": {
      title: "Anahtarlarını getir",
      body: `Forge'un kullandığı anahtar çiftinin aynısı. Başka bir lab'da zaten dövdüysen, burada sadece geri alınır.`,
      cta: "Anahtarları hazırla",
      successBody: `\`{address}\` olarak çalışıyorsun.`,
    },
    fund: {
      title: "Hesabı fonla",
      body: `Talep edilebilir bir bakiye, yaratıcısına bir rezerve mal olur — ledger, saklamak zorunda kaldığı her kayıt için ücret alır. Bir şey kilitlemeden önce XLM'e ihtiyacın var.`,
      cta: "Friendbot'u çağır",
      successBody: `Fonlandı: {balance} XLM.

Bu sayıyı aklında tut. İki adım sonra, kilitlediğin miktardan daha fazla düşmüş olacak — çünkü sandığın kendisinin de bir kirası var.`,
    },
    "quiz-nature": {
      question: `Bir arkadaşın için talep edilebilir bir bakiyeye 5 XLM kilitliyorsun. O talep etmeden önce bu 5 XLM kimin bakiyesinde?`,
      options: [
        "Kimsenin — talep sahibi alana kadar kendi başına bir ledger kaydı olarak durur",
        "Hâlâ senin, sadece rezerve olarak işaretli",
        "Zaten arkadaşının, sadece henüz fark etmedi",
      ],
      explain: `Bunu bekleyen bir ödemeden ayıran şey bu. Kayıt var, fonlar taahhüt edilmiş ve onları taşıyabilecek tek hesap, üstünde adı yazan hesap.`,
    },
    lock: {
      title: "Sandığı kilitle",
      body: `Beş XLM, talep sahibi sen. Kendini yazmak, mekaniği öğrenmenin dürüst yolu — talep sahibi başkası olduğunda her şey birebir aynı çalışır.

Buradaki koşul **koşulsuz**: var olduğu anda talep edilebilir. Stellar ayrıca "şu zamandan önce değil" demene de izin verir; vesting takvimi ya da gece yarısı kilit açılışı böyle yazılır.`,
      cta: "5 XLM kilitle",
      successBody: `Sandık ledger'da.

XLM bakiyen beşten fazla düştü: fazladan giden yarım XLM, kaydın kendisi için **rezerv**. Bakiyeyi sonra talep et, rezerv geri gelir — ledger alan kiralar, satmaz.`,
    },
    "balance-id": {
      prompt: `## Kendi sandığını bul

Motor sana sandığın id'sini hiç vermedi — işlem hash'i bakiye id'si değildir. O yüzden git ledger'ı oku.

**Forge → ledger** sayfasını aç, *claimable balances* seç ve talep sahibi alanına kendi adresini yaz. Sandığın, içinde \`5.0000000\` olan kayıt. \`id\` değerini — 72 hex karakter — kopyala ve buraya yapıştır.`,
      placeholder: "0000000000…",
      hint: "72 hex karakter, birkaç sıfırla başlar.",
    },
    claim: {
      title: "Sandığı aç",
      body: `Adı yazılı talep sahibi sensin ve koşul sağlandı. Altını geri al.`,
      cta: "Bakiyeyi talep et",
      successBody: `Talep edildi. Kayıt ledger'dan silindi, beş XLM bakiyene döndü — kirasını ödeyen yarım XLM'lik rezerv de öyle.

Ledger sorgusunu tekrar dene: sandık artık yok. Geriye kalan, geçmişindeki *operasyon* — ve bunu yaptığını kanıtlayan da tam olarak o.`,
    },
    "quiz-predicate": {
      question: `Kurucu ortağının **ancak vesting cliff'inden sonra**, bir yıl sonra açabileceği bir sandık istiyorsun. Ne değişir?`,
      options: [
        "Talep sahibinin predicate'i — koşulsuz yerine \"şu tarihten önce değil\"",
        "Onu tutmak için bir kontrat deploy etmen gerekir",
        "Hiçbir şey — kibarca beklemesini rica edersin",
      ],
      explain: `Predicate'ler birleşir: bir zamandan önce/sonra, başka predicate'lerin ve/veya/değil'i. Koca bir escrow sınıfının kontrata hiç ihtiyacı yok — ve kontrata ihtiyacı olmayanın kontrat bug'ı da olamaz.`,
    },
    "claim-xp": {
      body: `Değeri kimseye ait olmayan bir kayda kilitledin, ledger'ı kendin okuyarak buldun ve geri aldın.

Sunucu şimdi operasyon geçmişinde o \`create_claimable_balance\` operasyonunu arayacak. Sözüne güvenmez — asla güvenmez.`,
    },
  },
} satisfies LabTextOverlay;
