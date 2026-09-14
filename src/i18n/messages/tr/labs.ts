import { LAB_TEXT } from "@/content/labs/i18n";

// TR · Forge — /labs dizini (rehberli lab'lar + serbest mod IDE kartı) ve lab
// oynatıcısının chrome'u. Adım içeriği src/content/labs içinde yaşar (EN-first).
export const labs = {
  metaTitle: "Forge — TUSST",
  metaDescription:
    "Rehberli Stellar lab'ları: gerçek testnet'te cüzdan fonlayan, trustline açan ve kontrat deploy eden büyük düğmeler — sen de her basışın ne yaptığını öğrenirken.",
  kicker: "forge",
  title: "Forge Açık",
  intro:
    "Her büyük düğmenin testnet'te gerçek bir şey yaptığı rehberli lab'lar — cüzdanlar fonlanır, trustline'lar açılır, ödemeler tamamlanır — ve metin, ledger'da az önce tam olarak ne olduğunu anlatır.",
  liveHeading: "// lab'lar",
  soonHeading: "// hazırlanıyor",
  freeMode: {
    title: "Serbest mod — IDE",
    blurb:
      "Tarayıcında tam teşekküllü Soroban atölyesi: Rust yaz, build et, testnet'e deploy et, çağır. Ray yok, duvar yok.",
    cta: "IDE'yi aç",
    badge: "giriş yok · kurulum yok",
  },
  card: {
    minutes: "{minutes} dk",
    xp: "{xp} xp",
    soon: "hazırlanıyor",
    completed: "tamamlandı",
    start: "Lab'a gir",
    resume: "Devam et",
    replay: "Tekrar oyna",
  },
  difficulty: {
    novice: "çırak",
    adept: "usta adayı",
    master: "usta",
  },
  sim: {
    ariaLabel: "SCP quorum simülatörü",
    nodeAria: "Düğüm {node}",
    propose: "Bir ledger öner",
    reset: "Konseyi sıfırla",
    running: "konsey müzakere ediyor…",
    closed: "Ledger {n} kapandı ✓",
    stalled: "{count} koltuk konseyini bekliyor — canlılıktan önce güvenlik.",
    halted: "Hiçbir quorum oluşamıyor — ağ çatallanmak yerine bekliyor.",
    hint: "Öner'e bas ve kabulün dalga dalga yayılışını izle. Bir düğümü devirmek (ya da geri kaldırmak) için tıkla.",
    ledgers: "kapanan ledger: {n}",
  },
  content: LAB_TEXT.tr,
  player: {
    exit: "Lab'dan ayrıl",
    wallet: {
      none: "henüz mühür yok",
      yours: "senin mührün",
      copy: "Adresi kopyala",
      copied: "Kopyalandı",
    },
    phases: {
      prepare: "hazırlanıyor",
      passkey: "passkey'in bekleniyor",
      queued: "forge kuyruğunda",
      building: "rust → wasm derleniyor",
      sign: "imzalanıyor",
      submit: "ağa gönderiliyor",
      confirm: "ledger'da onaylanıyor",
    },
    viewTx: "İşlemi explorer'da gör",
    viewAccount: "Hesabını explorer'da gör",
    viewContract: "Akıllı cüzdanı explorer'da gör",
    retry: "Tekrar dene",
    errors: {
      testnetBusy: "Testnet meşgul — birazdan tekrar dene.",
      walletRequired: "Önce anahtarlarını dövmelisin — bir ekran geri git.",
      missingState: "Önceki bir adım atlanmış — geri gidip tamamla.",
      forgeCold: "Forge soğuk — runner'a ulaşılamıyor. Birazdan tekrar dene.",
      buildFailed: "Derleme başarısız — runner bu kontratı reddetti. Tekrar dene.",
      buildTimeout: "Derleme zaman aşımına uğradı — Forge meşguldü. Tekrar dene.",
      localWalletRequired:
        "Bu ritüel, deploy ücretlerini ödemek için Forge'un yerel testnet anahtarına ihtiyaç duyar — önceki adımda döv.",
      passkeyUnavailable:
        "Passkey'ler güvenli bir tarayıcı bağlamı ve WebAuthn desteği ister. Bu lab'ı passkey destekleyen bir cihazda HTTPS üzerinden aç.",
      passkeyMismatch:
        "O passkey başka bir akıllı cüzdana ait. Tekrar dene ve az önce oluşturduğun kimlik bilgisini seç.",
      passkeyFailed:
        "Passkey töreni tamamlanmadı. Cihaz istemini onayla ve tekrar dene.",
      smartWalletDeployFailed:
        "Passkey oluşturuldu ama akıllı cüzdanı testnet'e ulaşmadı. Birazdan tekrar dene.",
      smartWalletFundFailed:
        "Akıllı cüzdan deploy edildi ama Friendbot imza testi için onu fonlayamadı. Birazdan tekrar dene.",
      passkeyTransactionFailed:
        "Passkey ile imzalanan transfer testnet'e ulaşmadı. Cihaz istemini onayla ve tekrar dene.",
    },
    checkpoint: {
      title: "Ödülünü al",
      cta: "Ledger'ı oku ve XP'yi al",
      verifying: "ledger'a danışılıyor…",
      anonymous:
        "Koşun bu tarayıcıda yaşıyor. Giriş yap, Forge onu zincir üstünde doğrulasın — vaat değil, kanıt — ve XP'ni ödesin.",
      signIn: "Almak için giriş yap",
      failed:
        "Ledger aynı fikirde değil — bazı kahramanlıklar eksik: {checks}. Yukarıdaki adımları bitir ve tekrar al.",
      checkNames: {
        "account-exists": "yaşayan bir hesap",
        trustline: "USDC trustline'ı",
        "payment-sent": "gönderilmiş bir ödeme",
        "token-balance-positive": "kontratında bir token bakiyesi",
        "smart-account-code": "kanonik smart-account kontratı",
        "smart-account-native-balance": "akıllı cüzdanda yerel XLM",
        "claimable-balance-created": "kilitlediğin bir sandık",
        "account-thresholds": "iki imza isteyen bir kasa",
      },
    },
    done: {
      kicker: "lab tamamlandı",
      xpEarned: "+{xp} xp",
      levelUp: "Seviye {level} açıldı!",
      xpTotal: "toplam {xp} xp",
      already: "Zaten alınmış — ledger unutmaz.",
      backToForge: "Forge'a dön",
      openIde: "IDE'de devam et",
    },
  },
};
