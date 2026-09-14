import type { LabTextOverlay } from "../localize";

export const labText = {
  "meta": {
    "title": "Passkey Akıllı Cüzdan",
    "tagline": "Seed phrase'i olmayan bir cüzdan — cihazın imzalar."
  },
  "steps": {
    "intro": {
      "body": "## Hiç görmediğin anahtar\n\nKlasik bir Stellar cüzdanı bir `S…` gizli anahtarıyla başlar. **Passkey cüzdan** ise telefonunun ya da bilgisayarının güvenli donanımının içinde başlar. WebAuthn o donanımdan bir **secp256r1** anahtarı yaratmasını ister ve yalnızca açık yarısını dışarı verir; Face ID, Touch ID, bir PIN ya da bir güvenlik anahtarı her imzanın kilidini açar.\n\nBugün gerçek bir passkey kaydedecek, testnet'e gerçek bir **akıllı hesap kontratı** deploy edecek ve onunla taze bir kimlik doğrulama challenge'ına yanıt vereceksin. Hiçbir seed phrase gösterilmeyecek — çünkü seed phrase diye bir şey yok."
    },
    "forge-deployer": {
      "title": "Fırlatma hesabını hazırla",
      "body": "Bir kontrat kendi doğumunun ücretini ödeyemez. Bu yüzden Forge'un onu fırlatmak için küçük, sıradan bir **G-hesabına** ihtiyacı var. Zaten bir tane dövdüysen geri gelir; yoksa bu tarayıcıda yalnızca testnet için yeni bir anahtar çifti yaratılır.\n\nBu fırlatma hesabı akıllı cüzdanın imzacısı **değildir**. Deploy'un ücretini öder ve salt'ını sağlar — o kadar.",
      "cta": "Fırlatma hesabını hazırla",
      "successBody": "Fırlatma hesabı hazır:\n\n`{address}`\n\nGizli anahtarı bu tarayıcıda kalır. Birazdan yaratacağın passkey ise ayrı olarak güvenli donanımda yaşayacak."
    },
    "fund-deployer": {
      "title": "Fırlatmaya yakıt ver",
      "body": "Bir Soroban kontratı deploy etmek, zarf ücreti ve ledger kaynakları için testnet XLM'i tüketir. Friendbot fırlatma hesabını fonlar; hesap zaten varsa Forge onu yeniden kullanır.",
      "cta": "Friendbot ile fonla",
      "successBody": "{balance} XLM artık fırlatma hesabına yakıt veriyor. Akıllı cüzdanı relayer olmadan ve fırlatma anahtarına onun üstünde hiçbir yetki vermeden deploy etmeye yeter."
    },
    "quiz-secret": {
      "question": "Bir passkey'in özel yarısı nerede yaşar?",
      "options": [
        "Authenticator'ın güvenli donanımının içinde; uygulama imzaları alır, özel anahtarı asla",
        "Sunucu sonradan imzalayabilsin diye TUSST'un veritabanında şifreli olarak",
        "Akıllı hesap kontratının içinde, kamuya açık ledger verisi olarak"
      ],
      "explain": "Tam isabet. Tarayıcı authenticator'a bir challenge iletir. Zincir bir açık anahtar ve bir imza görür; TUSST asla özel anahtar materyali almaz."
    },
    "create-passkey-wallet": {
      "title": "Passkey'i kaydet ve deploy et",
      "body": "Cihazın kendi passkey istemini açacak. Onayladıktan sonra Forge, varsayılan imzacısı o kimlik bilgisi olan bir **Protocol 27 akıllı hesabı** kurar; ardından fırlatma hesabı deploy ücretini doğrudan RPC üzerinden öder.\n\nHesap kodu, `smart-account-kit@0.6.2` ile yayımlanan OpenZeppelin tabanlı kanonik Wasm'dır.",
      "cta": "Passkey yarat ve cüzdanı deploy et",
      "successBody": "Seed'siz cüzdanın testnet'te yaşıyor:\n\n`{contract}`\n\nAdres **C** ile başlıyor, çünkü cüzdan bir kontrat. Yetkilendirme kuralı az önce yarattığın passkey'i gösteriyor — deploy ücretini ödeyen G-hesabını değil."
    },
    "quiz-authority": {
      "question": "G-hesabı akıllı cüzdanın deploy'unu ödedi. Gizli anahtarı yeni C-hesabından harcamaya yetki verebilir mi?",
      "options": [
        "Hayır — deploy'u ödemek onu imzacı yapmaz; akıllı hesabın kendi auth kuralları karar verir",
        "Evet — ücreti ödeyen, deploy ettiği her kontrata kalıcı olarak sahip olur",
        "Yalnızca bir sonraki ledger kapanana kadar"
      ],
      "explain": "Doğru. Kaynak hesap, ücreti ödeyen, deployer salt'ı ve akıllı hesap imzacısı ayrı rollerdir. Bu cüzdanın varsayılan imzacısı WebAuthn kimlik bilgisidir."
    },
    "authenticate-passkey": {
      "title": "Passkey imzalasın",
      "body": "Deploy bir açık anahtar kaydetti, ama bir cüzdan ancak zincir imzalarını kabul ederse işe yarar. Forge yeni C-hesabını testnet XLM'i ile fonlar, **fırlatma hesabına geri 1 XLM'lik bir transfer** kurar ve tam olarak `{contract}` adresine bağlı kimlik bilgisinden bunu yetkilendirmesini ister.\n\nCihaz istemini onayla. Bu kez imza zincire gider ve akıllı hesabın `__check_auth` fonksiyonu onu kabul etmek zorunda.",
      "cta": "Passkey ile imzala ve 1 XLM gönder",
      "successBody": "Transfer gerçekleşti. Güvenli donanımın imzaladı, WebAuthn doğrulayıcısı secp256r1 kanıtını kontrol etti ve `__check_auth` akıllı cüzdanın **1 XLM** göndermesine yetki verdi.\n\nBu işlem, passkey'in `{contract}` adresini kontrol ettiğinin kamuya açık kanıtı — sadece bir tarayıcı diyaloğunun açıldığının değil."
    },
    "quiz-cap71": {
      "question": "Protocol 27'deki CAP-71, akıllı hesaplar için neyi kolaylaştırdı?",
      "options": [
        "Kimlik doğrulamayı temiz biçimde devretmeyi; böylece çok imzacılı yetkilendirme akışlarının ağırlığı ve maliyeti düşer",
        "Her klasik G-hesabını otomatik olarak passkey'e çevirmeyi",
        "Ağdaki tüm işlem ücretlerini kaldırmayı"
      ],
      "explain": "Devretme protokol tesisatıdır: bir otorite, eski tam auth yapısını her işlemde sürüklemeden kimlik doğrulama işini bir başkasına devredebilir. Akıllı hesaplara yardımcı olur; ücretleri silmez, klasik hesapları yeniden yazmaz."
    },
    "claim": {
      "body": "Forge şimdi testnet'i bizzat inceleyecek: fırlatma G-hesabı var olmalı, C-adresi **kanonik Protocol 27 akıllı hesap koduna** çözümlenmeli ve o akıllı cüzdan, passkey imzalı transferinden sonra hâlâ doğal XLM tutuyor olmalı. Ledger lab'ın XP'sini ancak o zaman öder."
    }
  }
} satisfies LabTextOverlay;
