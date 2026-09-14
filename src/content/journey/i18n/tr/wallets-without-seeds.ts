import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Tohumsuz Cüzdanlar",
  tagline: "Akıllı hesaplar ve passkey'ler: üstüne, ücretini başkasının sponsor olduğu işlemler.",
  steps: [
    {
      kind: "theory",
      body: `## Yirmi dört kelime sorunu

Geleneksel cüzdanlar yeni kullanıcıyı bir ritüelle karşılar: *şu 24 kelimeyi yaz; kaybedersen paran sonsuza dek gider; birine gösterirsen daha da hızlı gider.*

Gerçek insanlar bu sınavda sürekli çakılır — ekran görüntüleri, çekmecedeki notlar, hiç alınmamış yedekler. Kayıp bir yapışkan not yüzünden koca servetler buharlaştı. Ve çoğu kullanıcı o noktaya bile gelmez: **onboarding, seed phrase ekranında ölür**.

Zincir rayları maaş ve market alışverişi taşıyacaksa, anahtar töreninin ortadan kalkması gerek. Stellar'da kalkabilir de — çünkü bir hesabın illa bir anahtar çifti *olması* gerekmiyor.`,
    },
    {
      kind: "theory",
      body: `## Kontrat olan hesaplar

Klasik bir hesabın tek bir kimlik doğrulama yolu vardır: protokol, ed25519 imzalarını hesabın imzacı listesiyle karşılaştırır. Sabit mantık, sonsuza dek.

**Akıllı hesap** farklıdır: kendisi bir Soroban kontratı*dır* ve bir işlem onun yetkisini talep ettiğinde protokol, kontratın \`__check_auth\` fonksiyonunu çağırıp sorar: *"bunu kabul ediyor musun?"*

İmzalama kuralı, **senin yazdığın koda** dönüşür. Farklı bir eğri doğrula. Belli bir eşiğin üstünde iki cihaz iste. Bir ihlalden sonra adresi değiştirmeden anahtarları döndür. Rust'ta ifade edebildiğin her politika artık bir tür imzadır.`,
    },
    {
      kind: "theory",
      body: `## Passkey'ler: kaybedemeyeceğin anahtar

Telefonunda zaten bir kasa var: **secure enclave** — çipten asla çıkmayan anahtarlarla imzalayan, Face ID ya da parmak iziyle açılan donanım. Bunun web standardı **WebAuthn** — yani passkey'ler — ve konuştuğu eğri **secp256r1**.

Stellar, secp256r1'i **yerel olarak** doğrular; bu yüzden bir akıllı hesap telefonunun enclave'ini doğrudan imzacı olarak kabul edebilir: biyometrik donanım imzalar, zincir passkey imzasını kendisi denetler.

Hiçbir aşamada bir seed phrase yok. "Cüzdan", bankacılık uygulamanı zaten koruyan aynı donanım — artık ledger (defter) işlemlerini imzalıyor.`,
    },
    {
      kind: "diagram",
      body: "Aynı hesap, onu tutmanın iki yolu:",
      caption: "Passkey, cihazın güvenli donanımından asla çıkmaz — tam da bu yüzden oltayla senden çekilip alınamaz.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "seed",
            label: "yirmi dört kelime",
            tone: "bad",
          },
          {
            id: "passkey",
            label: "bir passkey",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "nerede yaşar",
            cells: [
              {
                text: "bir ekran görüntüsü, bir not uygulaması, bir çekmece",
                tone: "bad",
              },
              {
                text: "cihazın secure enclave'i",
                tone: "good",
              },
            ],
          },
          {
            label: "nasıl kaybedilir",
            cells: [
              {
                text: "kâğıdın tek bir fotoğrafı yeter",
                tone: "bad",
              },
              {
                text: "dışarı kopyalanması hiç mümkün değil",
                tone: "good",
              },
            ],
          },
          {
            label: "giriş yapmak",
            cells: [
              {
                text: "hepsini yaz ya da yapıştır",
                tone: "bad",
              },
              {
                text: "bir parmak izi",
                tone: "good",
              },
            ],
          },
          {
            label: "cihaz ölürse",
            cells: [
              {
                text: "fark etmez — hesap, kelimelerin kendisi",
                tone: "neutral",
              },
              {
                text: "o günden önce ikinci bir imzacı ekle",
                tone: "gold",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Passkey'li bir akıllı cüzdanda seed phrase'in yerini ne alır?`,
      options: [
        "Ezberlenecek hiçbir şey — cihazın güvenli donanımında doğan bir anahtar imzalar, zincir de onu yerel olarak doğrular",
        "Hatırlaması daha kolay, altı kelimelik daha kısa bir ifade",
        "Seed phrase'i senin adına saklayan anchor",
      ],
      answer: 0,
      explain: `Özel anahtar enclave'den hiç çıkmaz ve kimseye hiç gösterilmemiştir — yazacak, fotoğraflayacak ya da oltayla çalınacak bir şey yok. Kurtarma bir politika sorusuna dönüşür (ek imzacılar, bir vasi cihaz), hafıza sınavına değil.`,
    },
    {
      kind: "theory",
      body: `## Politikalar: fikri olan imzalar

Auth kuralı koda dönüştüğünde, bir imzacı **politika** taşıyabilir:

- **Harcama limitleri** — passkey tek başına günde 50 USDC'ye kadar onaylar; ötesinde ikinci bir faktörün de imzalaması gerekir.
- **İzinli kontratlar** — *yalnızca* senin oyununla konuşabilen, DEX'le asla konuşamayan bir imzacı.
- **Oturum anahtarları** — bir dapp'e akşamlık, sınırlı kendi anahtarını ver; kendi kendine sona erer.

"Programlanabilir" kelimesinin kullanıcıya gerçekten kazandırdığı şey bu: uygulamanın kullanım şartlarındaki bir vaatle değil, ledger tarafından uygulanan korkuluklar.`,
    },
    {
      kind: "fill",
      prompt: `Hangi eğri, zincirin bir telefonun secure enclave imzasını doğrulamasını sağlar?`,
      file: "auth-stack.txt",
      before: `Face ID  →  secure enclave şununla imzalar:  `,
      after: `  →  ledger üstünde yerel olarak doğrulanır`,
      choices: ["secp256r1", "secp256k1", "ed25519", "curve25519"],
      answer: 0,
      explain: `ed25519 klasik Stellar'ın eğrisi; secp256k1 ise Bitcoin ve Ethereum'a ait. WebAuthn donanımı secp256r1 (namıdiğer P-256) konuşur ve protokol onu yerel olarak doğrular — hantal kontrat içi emülasyon yok, maliyet patlaması yok.`,
    },
    {
      kind: "theory",
      body: `## Ücretini başkasının ödediği işlemler

Bir duvar kaldı: yepyeni bir kullanıcının sıfır XLM'i var ve işlemlerin (küçücük de olsa) ücreti var. Ona "önce git bir borsadan XLM al" demek büyüyü öldürür.

Stellar'ın cevabı **ücret sponsorluğu**: başka bir hesap — genellikle uygulamanınki — kullanıcının işlemini sarmalar ve **ücretini öder**; rezervlere de sponsor olabilir. Kullanıcının zincir üstündeki ilk eylemi ona hiçbir şeye mal olmaz ve önceden fonlama gerektirmez.

Passkey artı sponsorluk, birlikte: "hesap oluştur"a dokun, Face ID'ye bir bak ve herkese açık bir ledger'da işlem yapıyorsun — borsa ziyareti yok, seed töreni yok, ortalıkta XLM yok.`,
    },
    {
      kind: "theory",
      body: `## Protocol 27 "Zipper": delegasyon geliyor

Akıllı hesaplar genç ve protokol onların yolunu aktif olarak döşüyor. **Protocol 27 — "Zipper"**, **Temmuz 2026**'dan beri mainnet'te canlı ve akıllı hesaplar için **CAP-71: kimlik doğrulama delegasyonu** özelliğini getirdi.

Delegasyon, bir yetkinin imzalama gücünü bir başkasına protokol düzeyinde, temiz biçimde devretmesini sağlar — bu da tam olarak bu bölümün anlattığı hesap desenleri için **multisig kurulumlarını sadeleştirir** ve **işlem maliyetlerini düşürür**.

İnşacılar için çevirisi: çok cihazlı cüzdanlar, vasi kurtarma ve politika ağırlıklı tasarımlar daha ucuz ve daha basit çalışır hale geldi. Protokol akıllı hesaplara sadece tahammül etmiyor, onlara *yaslanıyor*.`,
    },
    {
      kind: "quiz",
      question: `Protocol 27 "Zipper"daki CAP-71, akıllı hesaplar için neyi değiştirdi?`,
      options: [
        "Kimlik doğrulama delegasyonu — multisig'i sadeleştirip işlem maliyetlerini düşürdü",
        "Tüm akıllı hesap işlemlerini sonsuza dek ücretsiz yaptı",
        "Ağın tamamında ed25519'un yerine secp256r1'i koydu",
      ],
      answer: 0,
      explain: `Delegasyon havai fişek değil, tesisat: taşınacak daha az imza, daha ucuz çok taraflı auth. Klasik ed25519 hesapları eskisi gibi tıpatıp çalışmaya devam eder — iki hesap tarzı bir arada yaşar.`,
    },
    {
      kind: "labLink",
      labSlug: "passkey-smart-wallet",
      body: `Forge hazır: **Passkey Akıllı Cüzdan**'a gir, gerçek bir passkey kaydet, akıllı hesap kontratını testnet'e deploy et ve yepyeni bir WebAuthn challenge'ına kendi cihazınla cevap ver.

Ledger, deploy edilen kodun kanonik akıllı hesap Wasm'ı olduğunu onayladığında yola geri dön. Yol daha tuhaf bir yere kıvrılıyor: *tutarların kendisinin* örtü taktığı bir ledger.`,
    },
  ],
  testOut: [
    { question: `Akıllı hesap, klasik bir anahtar çiftinin çözemediği hangi sorunu çözer?`,
      options: ["Yetkilendirme programlanabilir hale gelir — tek bir anahtarın tek cevap olması yerine, neyin geçerli imza sayılacağına hesap karar verir",
        "Hesap sahibi için işlem ücretlerini kaldırır",
        "Bir hesabın trustline'ı olmayan varlıkları tutmasını sağlar"], answer: 0 },
    { question: `Passkey neyin yerini alır, neyin almaz?`,
      options: ["Bir insanın güvende tutması gereken seed phrase'in yerini alır; hesabın bir şeyi yetkilendirme ihtiyacını ortadan kaldırmaz",
        "Hesabın imzasının yerini tamamen alır — passkey'li hesaplar hiçbir şey imzalamaz",
        "Ağın ücretinin yerini alır, çünkü passkey'li hesaplar varsayılan olarak sponsorludur"], answer: 0 },
    { question: `Ücret sponsorluğu bir uygulamanın ne yapmasını sağlar?`,
      options: ["Kullanıcının ücretlerini ve rezervlerini ödemesini — böylece hiç XLM'i olmayan biri bile işlem yapabilir",
        "Kullanıcıları için temel ücreti protokol minimumunun altına indirmesini",
        "Kullanıcılarının işlemlerini tek bir zarfta toplayıp ücreti paylaştırmasını"], answer: 0 },
    { question: `"Kimsenin on iki kelime yazmak zorunda olmaması" neden sadece bir kolaylık değil, bir ürün kararıdır?`,
      options: ["Seed phrase'ler geri döndürülemez kullanıcı kaybının en büyük tek kaynağıdır — onları kaldırmak sadece sürtünmeyi değil, hata modunun kendisini kaldırır",
        "Çünkü kelime listeleri her dilde mevcut değil",
        "Çünkü çoğu yargı alanında seed phrase saklamak yasak"], answer: 0 },
  ],
};
