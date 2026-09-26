import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "SEP'ler: birlikte çalışabilirlik standartları",
  tagline: "SEP'ler: bir kez uygula, her kapı açılsın.",
  steps: [
    {
      kind: "theory",
      body: `## Standardı zorunlu kılan aritmetik

Entegrasyonları say. On cüzdan, on kapı; her çiftin kendi para yatırma akışına, kendi girişine, pasaport fotoğrafı istemenin kendi yoluna ihtiyacı var: **yüz ısmarlama entegrasyon** — ve iki taraftan birine on birinci geldiği anda yüz yirmi bir.

Bu varsayımsal bir çöküş senaryosu değil. Bir önceki nesil ödeme tesisatının başına gelen tam olarak bu; yurt dışına para göndermenin tarihsel olarak "bir bankadan, bir başka bankaya sormasını istemek" anlamına gelmesinin nedeni de bu.

N×M'den çıkmanın yalnızca iki yolu var. Biri tekel: herkes, kazanan tek kapıyla, onun şartlarına göre entegre olur. Diğeri bir **standart** — herhangi bir cüzdanın herhangi bir kapıyla tam olarak nasıl konuşacağını söyleyen halka açık bir belge; böylece iki taraf da birbirine değil, belgeye karşı inşa eder.

Stellar ikinci yolu seçti ve o belgelerin bir adı var.`,
    },
    {
      kind: "theory",
      body: `## SEP'ler: ortak dil

Bir sürü cüzdan, bir sürü anchor var. Standartlar olmasa her çift özel bir entegrasyona ihtiyaç duyardı — sonsuza dek N×M tesisat.

Stellar'ın cevabı **SEP**: *Stellar Ecosystem Proposal*. SEP'ler; cüzdanların, anchor'ların ve servislerin birbiriyle tam olarak nasıl konuşacağını tanımlayan halka açık standartlardır. Bir SEP'i bir kez uygula, cüzdanın onu uygulayan **her anchor'la** çalışsın — para yatırma akışları, kimlik doğrulama, kimlik, hepsi.

Bu "önce birlikte çalışabilirlik" kültürü sayesinde kullanıcılar istedikleri kapıyı seçebilir: bütün kapılar aynı anahtar şeklini paylaşır.`,
    },
    {
      kind: "theory",
      body: `## SEP-1 ve SEP-10: kimlik ve kanıt

İki küçük standart bütün kapıyı sırtlar:

- **SEP-1** — her ciddi domain bir \`stellar.toml\` yayımlar: **zincir üstü kimlik kartı**. Hangi varlıkları ihraç ettiği, hangi hesapların resmî olduğu, servislerinin nerede yaşadığı. Cüzdanlar bunu okuyarak gerçek ihraççıyı aynı varlık koduna sahip bir sahtekârdan ayırır.
- **SEP-10** — **web auth**: anchor sana bir *challenge transaction* (meydan okuma işlemi) gönderir, sen onu hesabının anahtarıyla imzalayıp geri verirsin. Sahiplik kanıtlandı, oturum açıldı — ve o challenge ledger'a **asla gönderilmez**.

İmzayla giriş yap: parola yok, e-posta yok.`,
    },
    {
      kind: "quiz",
      question: `SEP-10 web auth bir anchor'a tam olarak neyi kanıtlar?`,
      options: [
        "Hesabın gizli anahtarını kontrol ettiğini — ledger'a hiç dokunmayan bir challenge transaction'ı imzalayarak",
        "Yasal kimliğini — KYC kontrolünü SEP-10'un kendisi yapar",
        "Hesabında anchor'ın ücretlerini ödeyecek kadar XLM olduğunu",
      ],
      answer: 0,
      explain: `SEP-10 saf anahtar sahipliğidir. Yasal kimlik ayrı bir standart (SEP-12); anchor'lar onu sen kimliğini doğruladıktan *sonra* çalıştırır — önce imza, sonra evrak.`,
    },
    {
      kind: "fill",
      prompt: `Bir cüzdan, bir domain'in kimlik kartını nerede bulur?`,
      file: "discovery.txt",
      before: `https://anchor.example/`,
      after: `  →  varlıklar, resmî hesaplar, servis uç noktaları`,
      choices: [
        ".well-known/stellar.toml",
        "api/v2/anchor-manifest.json",
        "stellar/config.xml",
        "identity.pdf",
      ],
      answer: 0,
      explain: `SEP-1, hepsinin en basiti: bilinen bir yolda tek bir TOML dosyası. Domain'in sana ait olduğunu kanıtla, ihraççı hesaplarını dosyada listele; cüzdanlar da "anchor.example tarafından ihraç edildi" yazısını his değil, olgu olarak gösterebilsin.`,
    },
    {
      kind: "theory",
      body: `## Çalışan kapılar: 24, 31, 41

- **SEP-24** — *etkileşimli* para yatırma ve çekme. Cüzdanın, anchor'ın barındırdığı webview'i açar; KYC formlarını ve banka bilgilerini anchor halleder; havale netleşince token'lar gelir. İnsanlar için gündelik rampa.
- **SEP-31** — *işletmeler* arası sınır ötesi ödemeler: gönderen bir anchor ile alan bir anchor, her biri kendi yerel raylarını yönetirken Stellar üzerinden hesaplaşır.
- **SEP-41** — eski bir dost: Soroban kontratları için standart **token arayüzü**; her Stellar Asset Contract'ın konuştuğu dil.

İnsanlar için rampalar, kurumlar için raylar, kontratlar için tek bir token lehçesi.`,
    },
    {
      kind: "theory",
      body: `## Standart bir onay mührü değildir

Önünü kesmeye değer karışıklık şu, çünkü insanlara para kaybettiren tam olarak bu.

SEP-1, SEP-10 ve SEP-24'ü uygulayan bir kapı sana tam olarak tek bir şey söylemiştir: **tesisatı çalışıyor**. Kim olduğunu iddia ettiğini söyleyen bir dosya yayımlıyor. Bir imzayı doğrulayabiliyor. Cüzdanının açmayı bildiği bir para yatırma akışını yürütebiliyor.

Dolarların var olup olmadığı, kuruluşun herhangi bir yerde lisanslı olup olmadığı, saklamanın ayrıştırılmış olup olmadığı ya da geri ödeme istediğinde birinin cevap verip vermeyeceği hakkında sana hiçbir şey söylememiştir. Herkes bir \`stellar.toml\` barındırabilir. Dosya bir kimlik iddiasıdır, iyi hal belgesi değil — SEP-1 bir ihraççıyı **tanımlanabilir** kılar; bu, güvenin ön koşuludur, yerine geçen şey değil.

Öyleyse standartları oldukları gibi oku: ekosistemi *birlikte çalışabilir* kılarlar, *güvenli* değil. İlki bir protokol problemi, çözüldü. İkincisi özen işi ve senin sorumluluğunda kalıyor.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## Sınav yapıcının sınavı: dili seç

Bir koridor için cüzdan inşa ediyorsun:

> Brezilya'daki kullanıcılar bankada BRL tutuyor. Portekiz'deki ailelerine para göndermek istiyorlar; aile de euroyu yerel bir hesaba çekiyor. Biri Brezilyalı, biri Portekizli olmak üzere, hiçbirini senin kontrol etmediğin iki anchor'la entegre olacaksın.

**Entegrasyon planını bir standartlar dizisi olarak** yaz. Her adım için: hangi SEP, sana ne kazandırıyor ve atlarsan ne bozulur. Sonra bu koridorda hiçbir SEP'in senin yerine çözmeyeceği bir şeyi adlandır.

Yalnızca standartlar ve davranış — uç nokta yok, SDK çağrısı yok, kod yok.`,
      rubric: `1. Standartları işleyen bir sırayla adlandırır; anchor'a kimlik doğrulamadan önce anchor'ın kim olduğunun keşfiyle başlar.
2. Adlandırılan her standart için somut olarak ne sağladığını söyler — yalnızca numarasını ya da başlığını değil.
3. Adımlardan en az biri atlanırsa neyin bozulacağını belirtir.
4. Koridorda standartların çözmediği en az bir gerçek problemi adlandırır (döviz riski, lisanslama, iki kapıdan birinde likidite, KYC reddi, geri ödeme başarısızlığı…).
5. Yalnızca standartlar ve davranış — uç nokta yolu yok, SDK metot adı yok, kod yok.`,
      minChars: 180,
    },
    {
      kind: "theory",
      body: `## Klasik diyarın bittiği yer

Artık okuyabildiklerinin envanterini çıkar: konsensüs, zarflar, hesaplar ve varlıklar, ledger'ın içindeki piyasalar, para birimlerini aşan ödeme, iki uçtaki kapılar ve o kapıların iş birliği yapmasını sağlayan standartlar.

Bunların her biri **protokolün içine gömülü mekanizma**. Onu yapılandırdın, parasını ödedin, içinden yol aldın — ama hiçbirini sen yazmadın. Kurallar zaten oradaydı; sen olmayan insanlar tarafından kararlaştırılmıştı.

**Sırada:** diyarın kendin programladığın kısmı — kontratın deploy ettiğin bir şey olduğu, hatta depolamasının bile kalp atışı olduğu yer.`,
    },
  ],
  testOut: [
    {
      question: `Bir SEP hangi problemi çözmek için var?`,
      options: [
        "N×M ısmarlama tesisat — halka açık bir standartla herhangi bir cüzdan, onu uygulayan herhangi bir kapıyla çalışır",
        "Cüzdanlar ile anchor'lar arasındaki yavaş hesaplaşma",
        "Onaylı anchor'ların merkezi bir kaydının olmaması",
      ],
      answer: 0,
    },
    {
      question: `SEP-10 web auth bir anchor'a tam olarak neyi kanıtlar?`,
      options: [
        "Hesabın gizli anahtarını kontrol ettiğini — ledger'a asla gönderilmeyen bir challenge transaction'ı imzalayarak",
        "Yasal kimliğini, çünkü KYC kontrolünü SEP-10'un kendisi yapar",
        "Hesapta anchor'ın ücretlerini karşılayacak kadar XLM olduğunu",
      ],
      answer: 0,
    },
    {
      question: `Bir cüzdan, bir domain'in zincir üstü kimlik kartını nerede bulur?`,
      options: [
        "Domain'de bilinen bir yoldaki stellar.toml — SEP-1, hepsinin en basiti",
        "SDF'nin mainnet'te tuttuğu bir kayıt kontratı",
        "İhraççı hesabın manage_data girdileri",
      ],
      answer: 0,
    },
    {
      question: `İnsanlar için gündelik etkileşimli para yatırma ve çekme rampası hangi standart?`,
      options: [
        "SEP-24 — cüzdan, KYC'yi ve banka bilgilerini halleden, anchor'ın barındırdığı akışı açar",
        "SEP-31, işletmeler arasındaki sınır ötesi ödemeleri hesaplaşır",
        "SEP-41, Soroban kontratlarının konuştuğu token arayüzü",
      ],
      answer: 0,
    },
  ],
};
