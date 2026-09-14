// TR · İnşacının Yolculuğu — /journey haritası ve kavram oynatıcısının chrome'u.
// Kavram adımlarının içeriği src/content/journey içinde yaşar (EN-first).
export const journey = {
  metaTitle: "İnşacının Yolculuğu — TUSST",
  metaDescription:
    "Temel yol: spec odaklı zanaat, TDD, clean architecture ve Stellar'ın gerçekte nasıl çalıştığı — bir yapay zekânın senin yerine öğrenmeyeceği mühendislik.",
  kicker: "temel yol",
  title: "İnşacının Yolculuğu",
  intro:
    "Tek yol, üç parça. Seviye 0: bir ledger (defter), bir anahtar ve bir kontrat gerçekte nedir — kod yok, kısaltma yok. Kısım I: yapay zekâ çağının talep ettiği ama sana bedavaya vermeyeceği mühendislik disiplinleri. Kısım II: Stellar ekosistemi uçtan uca, konsensüsten gizlilik sınırına. Kısa bölümler, gerçek derinlik — ve Rust'a açılan her kapı isteğe bağlı kalır.",
  mapHeading: "// bölümler",
  levels: {
    legend: "Üç kademe — hiçbir şeyin varsayılmadığı seviye 0'dan başla.",
    foundations: "seviye 0 · temeller",
    essential: "seviye 1 · temel",
    advanced: "seviye 2 · ileri",
  },
  arcs: {
    foundations: {
      title: "Seviye 0 — Temeller",
      blurb: "Zemin kat: ledger nedir, anahtar nedir, kontrat nedir. Kod yok, kısaltma yok, hiçbir şey varsayılmıyor. Üç kısa bölüm ve yolun geri kalanı korkutucu olmaktan çıkar.",
    },
    craft: {
      title: "Kısım I — Mühendislik Zanaatı",
      blurb: "Yapay zekâ çağında mühendislik: spec'ler, testler, sınırlı bağlamlar, mimari — ve direksiyonu teslim etmeden bir modeli nasıl sürersin.",
    },
    realm: {
      title: "Kısım II — Stellar Ekosistemi",
      blurb: "Stellar uçtan uca: konsensüs, işlemler, varlıklar, anchor'lar, kontratlar, akıllı cüzdanlar, gizlilik ve yaşayan protokol.",
    },
  },
  recommended: "sıradaki öneri",
  startHere: "buradan başla",
  chapter: {
    requires: "şunun üzerine kurulu: {chapters}",
    minutes: "{minutes} dk",
    xp: "{xp} xp",
    soon: "hazırlanıyor",
    completed: "tamamlandı",
    start: "Bölüme başla",
    revisit: "Tekrar ziyaret et",
  },
  player: {
    exit: "Bölümden ayrıl",
    branch: {
      kicker: "rust'ta gör",
      optional: "isteğe bağlı derin dalış",
      cta: "Rust dersini aç",
      locked: "Kampanya'nın {numeral} numaralı bölümüyle açılır",
    },
    lab: {
      kicker: "uygulamalı lab",
      completed: "lab tamamlandı ✓",
      cta: "Lab'ı aç",
      soon: "bu lab hâlâ hazırlanıyor",
    },
    exercise: {
      kicker: "spec incelemesi",
      rubricLabel: "değerlendirileceği rubrik",
      placeholder: "Spec'ini buraya yaz — davranış, değişmezler, uç durumlar…",
      submit: "Sınav yapıcıya gönder",
      checking: "sınav yapıcı okuyor…",
      passKicker: "spec kabul edildi",
      failKicker: "sınav yapıcı itiraz ediyor",
      revise: "Düzelt ve yeniden gönder",
      notConfigured: "Sınav yapıcı bu ortamda yapılandırılmamış.",
      rateLimited: "Sınav yapıcı mevcut kullanım sınırına ulaştı — daha sonra tekrar dene.",
      signedOut: "Oturumun sona erdi — göndermeden önce yeniden giriş yap.",
      invalid: "Spec gönderilemedi. Gözden geçirip tekrar dene.",
      unavailable: "Sınav yapıcıya şu an ulaşılamıyor — birazdan tekrar dene.",
    },
    claim: {
      title: "Bölümü tamamla",
      body: "Bu bölümü tamamlandı olarak işaretle, XP'si senin olsun.",
      cta: "Tamamlandı işaretle (+{xp} xp)",
      saving: "kaydediliyor…",
      signedOut:
        "İlerlemen yalnızca bu tarayıcıda yaşıyor. Bölümleri kaydetmek ve XP kazanmak için giriş yap.",
      signIn: "Kaydetmek için giriş yap",
    },
    done: {
      kicker: "bölüm tamamlandı",
      xpEarned: "+{xp} xp",
      levelUp: "Seviye {level} açıldı!",
      xpTotal: "toplam {xp} xp",
      already: "Zaten tamamlanmış.",
      next: "Sonraki bölüm",
      backToMap: "Yolculuk'a dön",
    },
  },
  testOut: {
    chapterCta: "Bunu zaten biliyorum",
    arcCta: "Bu kısmı sınavla geç",
    chapterKicker: "bölüm atlama sınavı",
    arcKicker: "kısım atlama sınavı",
    chapterTitle: "Atla: {title}",
    arcTitle: "Atla: {title}",
    chapterBlurb:
      "{count} soruyu hatasız cevapla, bölüm XP'siyle birlikte tamamlanmış sayılsın — okumak gerekmiyor.",
    arcBlurb:
      "{count} soruyu cevapla ({allowed} hata hakkı var), bu kısımdaki her bölüm tek seferde tamamlanmış sayılsın.",
    arcBlurbStrict:
      "{count} soruyu hatasız cevapla, bu kısımdaki her bölüm tek seferde tamamlanmış sayılsın.",
    question: "Soru {current} / {total}",
    submit: "Cevaplarımı kontrol et",
    checking: "kontrol ediliyor…",
    passKicker: "geçti",
    passBody: "{correct}/{total}. Tamamlanan: {chapters}.",
    failKicker: "bu sefer olmadı",
    failBody:
      "{correct}/{total}. Hiçbir şey tamamlandı olarak işaretlenmedi — buradan sonra en hızlı yol bölümü okumak.",
    readInstead: "Onun yerine bölümü oku",
    readArcInstead: "Baştan başla",
    tryAgain: "Yeni bir set dene",
    backToMap: "Yolculuk'a dön",
    signedOut: "Önce giriş yap — tamamlanan bir bölümün bir hesaba yazılması gerekir.",
    signIn: "Giriş yap",
    unavailable: "O soru seti şu an yüklenemedi — birazdan tekrar dene.",
  },
};
