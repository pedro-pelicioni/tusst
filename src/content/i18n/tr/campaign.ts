import type { ActText, CardText, SkirmishText } from "../types";

// TR · Yerelleştirilmiş kampanya anlatısı. Kart ADLARI ve perde numaraları olduğu gibi kalır.
export const actText: Record<string, ActText> = {
  "rust-fundamentals": {
    title: "Rust Temelleri",
    territory: "sözdizimi, tipler, ownership",
    synopsis:
      "Dilin zemin katı: yazdırma, binding'ler ve mutability, tipler, fonksiyonlar ve geri kalan her şeyin dayandığı ownership ile borrow kuralları.",
  },
  "control-flow": {
    title: "Kontrol Akışı",
    territory: "dallanma, match, döngüler",
    overlord: null,
    synopsis:
      "Rust'ta dallanma ve tekrar; eksiksiz (exhaustive) `match` dahil — ileride `Option` ve `Result`'ı güvenle ele almanı sağlayan mekanizma.",
  },
  "rust-standard-library": {
    title: "Standart Kütüphane",
    territory: "koleksiyonlar, iterator'lar, struct'lar",
    overlord: null,
    synopsis:
      "Her gün elinin gideceği tipler: `Vec`, `HashMap`, string'ler ve slice'lar, iterator'lar ve `impl` ile kendi tiplerine davranış kazandırmak.",
  },
  "mastering-option": {
    title: "Option<T>",
    territory: "yokluk, bir tip olarak modellenmiş",
    synopsis:
      "Rust'ta null yok. `Option<T>`, 'burada bir şey olmayabilir' durumunu derleyicinin seni ele almaya zorladığı bir hâle getirir.",
  },
  "mastering-result": {
    title: "Result<T, E>",
    territory: "başarısızlık, bir değer olarak modellenmiş",
    synopsis:
      "Hatalar birer değerdir, exception değil. Onları match et, dönüştür ve stack'i çözmek yerine `?` ile yukarı aktar.",
  },
  "stellar-101": {
    title: "Stellar 101",
    territory: "hesaplar, lumen'ler, trustline'lar, ödemeler",
    synopsis:
      "Ağ gerçekte nasıl çalışır: hesap nedir, bir lumen neyin bedelini öder, bir varlığı tutmak neden isteğe bağlıdır ve bir ödeme nasıl kurulup gönderilir.",
  },
  "soroban-smart-contracts": {
    title: "Soroban Akıllı Kontratları",
    territory: "kontratlar, storage, yetkilendirme",
    overlord: null,
    synopsis:
      "Rust'ta bir Soroban kontratı yazmak, içinde state saklamak ve onu güvenceye almak — her gerçek kontratın ihtiyaç duyduğu üç şey.",
  },
  "stellar-protocol-27": {
    title: "Protocol 27",
    territory: "smart account'lar & auth delegasyonu",
    overlord: null,
    synopsis:
      "Güncel yükseltme: kendi auth politikasını tanımlayan smart account'lar, CAP-0071 ile delegasyon, adrese bağlı imzalar ve migrasyon yolu.",
  },
};

export const skirmishText: Record<string, SkirmishText> = {
  // Perde I — Paslı Kale
  "rust-fundamentals-1": {
    title: "Hello, World!",
    intro:
      "Her Rust programı `main`'de başlar. Tam olarak bir satır yazdıracak ve `println!` makrosuyla tanışacaksın — bundan sonra her şeyi incelemek için kullanacağın araç.",
  },
  "rust-fundamentals-2": {
    title: "Değişkenler & Mutability",
    intro:
      "Binding'ler varsayılan olarak immutable'dır. Bunun yol açtığı derleme hatasını görecek ve `mut` ile düzelteceksin — Rust'ın niyetini açıkça belirtmeni istediği pek çok yerden ilki.",
  },
  "rust-fundamentals-3": {
    title: "Veri Tipleri",
    intro:
      "Tam sayılar, ondalıklar, boolean'lar ve karakterler; bir de derleyicinin kendi başına çıkaramadığı bir tipi senin belirtmen gerektiği anlar.",
  },
  "rust-fundamentals-4": {
    title: "Fonksiyonlar",
    intro:
      "Parametreler, dönüş tipleri ve Rust'ın örtük dönüşü: noktalı virgülsüz son ifade, değerin kendisidir. Bu tek kural ileride pek çok sözdizimini açıklar.",
  },
  "rust-fundamentals-5": {
    title: "Ownership Temelleri",
    intro:
      "Her değerin tam olarak bir sahibi vardır. Bir `String`'i atamak onu taşır (move) ve eski binding ölür — Rust'ın geri kalanının üzerine kurulduğu tek fikir.",
  },
  "rust-fundamentals-6": {
    title: "Borrow & Referanslar",
    intro:
      "Bir fonksiyonun bir değeri okuması için onu elden çıkarman gerekmez. `&` ile bir referans ödünç ver, geri gelir — clone'lamanın gündelik alternatifi.",
  },

  // Perde II — Çatallanan Yolların Salonu
  "control-flow-1": {
    title: "if / else",
    intro:
      "Rust'ta dallanma sadece bir statement değil, bir expression'dır — yani bir `if`, doğrudan bağlayabileceğin bir değer üretebilir.",
  },
  "control-flow-2": {
    title: "match İfadeleri",
    intro:
      "`match` eksiksiz olmak zorunda: derleyici unuttuğun her durumu reddeder. İleride `Option` ve `Result`'ı güvenle ele almanın arkasındaki mekanizma budur.",
  },
  "control-flow-3": {
    title: "loop",
    intro:
      "Koşulsuz bir döngü ve değer taşıyan `break` — bir şey başarana kadar yeniden denemenin idiyomatik yolu.",
  },
  "control-flow-4": {
    title: "while Döngüleri",
    intro:
      "Bir koşul sağlandığı sürece döngüde kal. `while let`'in neden var olduğunu ve düz bir `while`'ı nerede geçtiğini de göreceksin.",
  },
  "control-flow-5": {
    title: "for Döngüleri",
    intro:
      "Bir aralığı ya da koleksiyonu dolaşmak — gerçekte yazacağın döngü ve iterator'ların ilk göründüğü yer.",
  },
  "control-flow-6": {
    title: "İç İçe Kontrol Akışı",
    intro:
      "Dalları ve döngüleri birleştirmek; mantık basit olmaktan çıktığında sonucu okunur tutmak.",
  },

  // Perde III — Sonsuz Kasalar
  "rust-standard-library-1": {
    title: "Vec Temelleri",
    intro:
      "Büyüyebilen bir dizi: push, index ve `Vec`'in neredeyse her Rust programında varsayılan koleksiyon olmasının nedeni.",
  },
  "rust-standard-library-2": {
    title: "Iterator'lar",
    intro:
      "`map`, `filter` ve `collect` — ve bir tüketici öğe isteyene kadar hiçbir şeyin çalışmadığı gerçeği.",
  },
  "rust-standard-library-3": {
    title: "Option & map",
    intro:
      "Orada olmayabilecek bir değeri, önce unwrap etmeden dönüştürmek.",
  },
  "rust-standard-library-4": {
    title: "HashMap",
    intro:
      "Anahtar/değer araması ve tek bir hash'le okuyan ya da ekleyen `entry` API'si.",
  },
  "rust-standard-library-5": {
    title: "String İşleme",
    intro:
      "`String` ile `&str` farkı, bir string'i neden sayıyla index'leyemediğin ve UTF-8'in bununla ne ilgisi olduğu.",
  },
  "rust-standard-library-6": {
    title: "Slice'lar",
    intro:
      "Bir koleksiyonun bir parçasına ödünç alınmış bir bakış — kopya yok, allocation yok.",
  },
  "rust-standard-library-7": {
    title: "Struct'lar",
    intro:
      "İlişkili verileri tek bir ad altında toplamak; her alanın tipi belirtilmiş hâlde.",
  },
  "rust-standard-library-8": {
    title: "impl & Metotlar",
    intro:
      "Bir tipe davranış eklemek ve `self`, `&self` ile `&mut self` arasındaki fark.",
  },

  // Perde IV — Kaybolan Bataklık
  "mastering-option-1": {
    title: "Some ya da None",
    intro:
      "`Option<T>` yokluğu, derleyicinin seni ele almaya zorladığı bir duruma dönüştürür — Rust'ta null olmamasının nedeni bu.",
  },
  "mastering-option-2": {
    title: "Güvenle Unwrap",
    intro:
      "`unwrap_or`, `unwrap_or_else` ve `expect`; bir de `unwrap()`'ın production'da ne zaman kabul edilebilir olduğunun kuralı.",
  },
  "mastering-option-3": {
    title: "if let",
    intro:
      "Tam bir `match` gürültü olacağında, tek bir durumu eşleyip gerisini yok saymak.",
  },

  // Perde V — İki Kaderin Duruşması
  "mastering-result-1": {
    title: "Ok ya da Err",
    intro:
      "`Result<T, E>` ya değeri ya da başarısızlığın nedenini taşır — ve `#[must_use]`, onu sessizce görmezden gelemeyeceğin anlamına gelir.",
  },
  "mastering-result-2": {
    title: "Result'ı Match Etmek",
    intro:
      "İki kolu da açıkça ele almak ve bir başarısızlığın kurtarılabilir olup olmadığına her çağrı noktasında ayrı karar vermek.",
  },
  "mastering-result-3": {
    title: "? Operatörü",
    intro:
      "Her seviyede bir `match` yazmak yerine, bir başarısızlığı tek karakterle çağırana aktarmak.",
  },

  // Perde VI — Takımyıldız Kapısı
  "stellar-101-1": {
    title: "Hesaplar & Anahtar Çiftleri",
    intro:
      "Bir Stellar hesabı bir public key'dir. Secret key imzalar; public key kimliği belirler. Geri kalan her şey bunun üzerine kurulur.",
  },
  "stellar-101-2": {
    title: "Lumen'ler & Ücretler",
    intro:
      "XLM, stroop'lar, base reserve ve her hesabın neden bir minimum bakiye tutmak zorunda olduğu.",
  },
  "stellar-101-3": {
    title: "Trustline'lar & Varlıklar",
    intro:
      "Yerel olmayan bir varlığı tutmak isteğe bağlıdır: önce bir trustline açarsın ve bu, bilinçli bir protokol tasarımıdır.",
  },
  "stellar-101-4": {
    title: "İlk Ödemen",
    intro:
      "Bir ödemeyi kurmak, imzalamak ve göndermek — her Stellar işleminin paylaştığı biçim.",
  },

  // Perde VII — Beholder'ın İni
  "soroban-smart-contracts-1": {
    title: "İlk Kontratın",
    intro:
      "`#[contract]`, `#[contractimpl]` ve dışa açılan bir fonksiyon — bir Soroban kontratının var olmak için ihtiyaç duyduğu asgari şey.",
  },
  "soroban-smart-contracts-2": {
    title: "Kontrat Storage'ı",
    intro:
      "Instance, persistent ve temporary storage: farklı ömürleri ve farklı maliyetleri olan üç raf.",
  },
  "soroban-smart-contracts-3": {
    title: "Yetkilendirme",
    intro:
      "`require_auth`, herkesin boşaltabileceği bir kontratla yalnızca sahibinin oynatabileceği bir kontrat arasındaki çizgidir.",
  },

  // Perde VIII — Yeniden Yazılan Gökyüzü
  "stellar-protocol-27-1": {
    title: "Protocol 27'ye Genel Bakış",
    intro:
      "Yükseltmenin neyi değiştirdiği ve cüzdan geliştiren herkes için authentication delegasyonunun neden önemli olduğu.",
  },
  "stellar-protocol-27-2": {
    title: "Smart Account'lar & __check_auth",
    intro:
      "Bir kontrat hesabı, neyin geçerli imza sayılacağına kendisi karar verir — o fonksiyon, politikanın tamamıdır.",
  },
  "stellar-protocol-27-3": {
    title: "Authentication Delegasyonu (CAP-0071)",
    intro:
      "Bir hesabın auth kontrolünü bir başkasına devretmesine izin vermek ve bunun kurtarma ile session key'ler için neyin kilidini açtığı.",
  },
  "stellar-protocol-27-4": {
    title: "İmza Güvenliği & V2 Credential'lar",
    intro:
      "Adrese bağlı imzalar ve V2 credential formatının kapattığı replay saldırısı.",
  },
  "stellar-protocol-27-5": {
    title: "Protocol 27'ye Geçiş",
    intro:
      "Ne bozulur, ne bozulmaz ve SDK'lar boyunca değişiklikleri hangi sırayla yapmalı.",
  },
  "stellar-protocol-27-6": {
    title: "Hepsini Birleştirmek: Delege Edilmiş Bir Hesap",
    intro:
      "`__check_auth`'u uçtan uca uygula: imzayı doğrula, delege'ye saygı göster ve replay'i reddet.",
  },
};

export const cardText: Record<string, CardText> = {
  stroowarrior: {
    type: "Savaşçı",
    flavor:
      "Gerçek savaşçı, sarsılmaz ışığını ancak dünya titrediğinde gösterir.",
  },
  stropillusion: {
    epithet: "Aynalar Salonu Kâşifi",
    type: "Stropie · İllüzyonist",
    flavor:
      "Yansımalar aldatır, sırlar gizli kalır — o, sonsuz aynaların içinde gerçekliği büker.",
  },
  stroopkeeper: {
    epithet: "Sonsuz Kasaların Bekçisi",
    type: "Stropie · Arşivci",
    flavor:
      "Dövülmüş her alet onun kasalarında uyur — eski tanrıların dilediği gibi sıfırdan indekslenmiş.",
  },
  stroophantom: {
    epithet: "Belki de Orada Olmayan Şövalye",
    type: "Stropie · Hayalet",
    flavor:
      "Ona orada olup olmadığını sor. Asla varsayma. Bataklık, unwrap edenlerle dolu.",
  },
  strooracle: {
    epithet: "İki Kaderin Hakemi",
    type: "Stropie · Kâhin",
    flavor:
      "İki kapı, tek hüküm. Hiçbir Result'ı görmezden gelmedi; seninkiyle de başlamayacak.",
  },
  astrostroopie: {
    epithet: "Takımyıldız Kapısı'nın Gezgini",
    type: "Stropie · Gezgin",
    flavor:
      "Gökyüzünün haritasını yaralarından çıkardı ve ışığın söndüğü yerde Kapı'yı geçti.",
  },
  stroopbeholder: {
    type: "Stropie · Ucube",
    flavor:
      "Yıkımın derinliklerinden, sayısız gözü yalnızca fethi görür.",
  },
  stroopzipper: {
    epithet: "Yeniden Yazılan Gökyüzünün Habercisi",
    type: "Stropie · Haberci",
    flavor:
      "Gökyüzü değişirken kırılmaz — kendini yeniden fermuarlar, ışıltılı dikiş dikiş.",
  },
};
