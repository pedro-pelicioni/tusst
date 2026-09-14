import type { TrackText } from "../types";

// TR · Yerelleştirilmiş parkur/ders katalog başlıkları (render sırasında DB değerlerini geçersiz kılar).
export const trackText: Record<string, TrackText> = {
  "rust-fundamentals": {
    title: "Rust Temelleri",
    description:
      "Sözdiziminden ownership kavramlarına, Rust programlama dilinin temellerinde ustalaş.",
  },
  "control-flow": {
    title: "Kontrol Akışı",
    description:
      "Döngüler ve koşullu ifadelerle Rust programının akışını nasıl yöneteceğini öğren.",
  },
  "rust-standard-library": {
    title: "Rust Standart Kütüphanesi",
    description:
      "Rust Standart Kütüphanesi'ni keşfet ve güçlü özelliklerini nasıl kullanacağını öğren.",
  },
  "mastering-option": {
    title: "Option<T> Ustalığı",
    description:
      "Rust'ta isteğe bağlı değerleri ele almak için Option<T> tipini nasıl kullanacağını öğren.",
  },
  "mastering-result": {
    title: "Result<T, E> Ustalığı",
    description:
      "Rust'ta hataları ele almak için Result<T, E> tipini nasıl kullanacağını öğren.",
  },
  "stellar-101": {
    title: "Stellar 101",
    description:
      "Stellar ağına ilk adımını at: hesaplar, anahtar çiftleri, Lumen'ler, trustline'lar ve varlıklar.",
  },
  "soroban-smart-contracts": {
    title: "Soroban Akıllı Kontratları",
    description:
      "Güncel Stellar testnet'inde Rust ile Soroban akıllı kontratları yaz, test et ve deploy et.",
  },
  "stellar-protocol-27": {
    title: "Stellar Protocol 27: Zipper",
    description:
      "Protocol 27 yükseltmesinde ustalaş: authentication delegasyonu, adrese bağlı imzalar ve her SDK için migrasyon yolu.",
  },
};

export const lessonTitles: Record<string, string> = {
  // Rust Fundamentals
  "rust-fundamentals-1": "Hello, World!",
  "rust-fundamentals-2": "Değişkenler & Mutability",
  "rust-fundamentals-3": "Veri Tipleri",
  "rust-fundamentals-4": "Fonksiyonlar",
  "rust-fundamentals-5": "Ownership Temelleri",
  "rust-fundamentals-6": "Borrow & Referanslar",

  // Control Flow
  "control-flow-1": "if / else",
  "control-flow-2": "match İfadeleri",
  "control-flow-3": "loop",
  "control-flow-4": "while Döngüleri",
  "control-flow-5": "for Döngüleri",
  "control-flow-6": "İç İçe Kontrol Akışı",

  // Rust Standard Library
  "rust-standard-library-1": "Vec Temelleri",
  "rust-standard-library-2": "Iterator'lar",
  "rust-standard-library-3": "Option & map",
  "rust-standard-library-4": "HashMap",
  "rust-standard-library-5": "String İşleme",
  "rust-standard-library-6": "Slice'lar",
  "rust-standard-library-7": "Struct'lar",
  "rust-standard-library-8": "impl & Metotlar",

  // Mastering Option<T>
  "mastering-option-1": "Some ya da None",
  "mastering-option-2": "Güvenle Unwrap",
  "mastering-option-3": "if let",

  // Mastering Result<T, E>
  "mastering-result-1": "Ok ya da Err",
  "mastering-result-2": "Hükmü Okumak",
  "mastering-result-3": "? Operatörü",

  // Stellar 101
  "stellar-101-1": "Hesaplar & Anahtar Çiftleri",
  "stellar-101-2": "Lumen'ler & Ücretler",
  "stellar-101-3": "Trustline'lar & Varlıklar",
  "stellar-101-4": "İlk Ödemen",

  // Soroban Smart Contracts
  "soroban-smart-contracts-1": "İlk Kontratın",
  "soroban-smart-contracts-2": "Kontrat Storage'ı",
  "soroban-smart-contracts-3": "Yetkilendirme",

  // Stellar Protocol 27
  "stellar-protocol-27-1": "Protocol 27: Zipper",
  "stellar-protocol-27-2": "Smart Account'lar & __check_auth",
  "stellar-protocol-27-3": "Authentication Delegasyonu (CAP-0071)",
  "stellar-protocol-27-4": "İmza Güvenliği & V2 Credential'lar",
  "stellar-protocol-27-5": "Protocol 27'ye Geçiş",
  "stellar-protocol-27-6": "Boss: Delege Edilmiş Hesap",
};
