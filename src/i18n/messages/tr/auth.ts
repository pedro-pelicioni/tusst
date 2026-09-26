// Login page.
export const auth = {
  metaTitle: "Giriş yap — TUSST",
  kicker: "yolculuğun burada başlıyor",
  signIn: "Diyara gir",
  tagline: "Kahramanını, XP'ni ve temizlediğin her görevi kaydetmek için giriş yap.",
  note: "Şifre yok, form yok — tek tıkla haritadasın.",
  backHome: "← Açılış sayfasına dön",
  continueTo: "Kaldığın yere geri gönderileceksin.",
  errors: {
    title: "Kapı açılmadı",
    OAuthAccountNotLinked:
      "Bu e-posta zaten başka bir giriş yöntemine bağlı. İlk kaydolduğun sağlayıcıyı kullan.",
    OAuthCallbackError: "Sağlayıcı yanıt vermedi. Birazdan tekrar dene.",
    OAuthSignin: "Bu sağlayıcıyla girişi başlatamadık. Tekrar dene.",
    AccessDenied: "Sağlayıcı erişimi reddetti. Tekrar dene ya da diğer sağlayıcıyı kullan.",
    Configuration: "Giriş bizim tarafımızda yanlış yapılandırılmış. Birkaç dakika sonra tekrar dene.",
    Verification: "Bu giriş bağlantısının süresi dolmuş ya da zaten kullanılmış. Yenisini iste.",
    default: "Giriş yapılırken bir şeyler ters gitti. Tekrar dene.",
  },
  continueWithGitHub: "GitHub ile devam et",
  continueWithDiscord: "Discord ile devam et",
  emailPlaceholder: "sen@eposta.com",
  emailMagicLink: "Bana sihirli bağlantı gönder",
  devLogin: "dev girişi",
  devNamePlaceholder: "bir isim seç",
  devContinue: "Devam et",
  noProviders:
    "Yapılandırılmış bir kimlik doğrulama sağlayıcısı yok. Girişi etkinleştirmek için yerel geliştirmede AUTH_DEV_LOGIN=true ayarla (ya da GitHub / Discord / e-posta ortam değişkenlerini).",
};
