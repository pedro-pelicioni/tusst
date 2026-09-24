import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Prompt engineering",
  tagline: "Prompt mühendisliği: işe yarayan her prompt'un sahip olduğu dört parça.",
  steps: [
    {
      kind: "theory",
      body: `## Elinde yalnızca senin sözlerin var

Model repo'nu bilmiyor. Dünü hatırlamıyor ve *eklemediğin* dosyayı göremiyor. Bütün evreni, şu an önünde duran metinden ibaret.

Prompt yazmanın temel kuralı bu: **neyin var olduğuna sen karar veriyorsun.** Dışarıda bıraktığın şey modelde yok.

Dolayısıyla her prompt'un arkasındaki soru "bunu nasıl ifade ederim?" değil, *"modelin bunu doğru yapması için neye ihtiyacı var?"* Bu bölüm o cevabın ilk yarısı — sözlerin kendisi. Sonraki bölüm, zor olan yarısı.`,
    },
    {
      kind: "theory",
      body: `## Bir prompt'un anatomisi

İşe yarayan bir prompt, dört parçalı küçük bir mühendislik belgesidir:

1. **Rol ve talimatlar** — hangi iş yapılıyor ve nasıl: "Bir ödeme domain'inde tek bir use-case uyguluyorsun."
2. **Kısıtlar** — yapılması ve yapılmaması gerekenler: "Public API değişmeyecek. Yeni bağımlılık yok. Panic yok."
3. **Örnekler** — *iyi*den tek bir numune; kalite anlatılmak yerine gösterilir.
4. **İstek** — asıl görev; en sonda, kesin ve tek.

Kötü prompt'ların çoğu kötü *ifade edilmiş* değildir — **bir parçası eksiktir**, genellikle kısıtlar ya da örnek.`,
    },
    {
      kind: "diagram",
      body: "Dört parça, ait oldukları sırayla:",
      caption:
        "İstek bilerek en sonda: üstündeki her şey, modelin görevi içinden okuduğu çerçevedir.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "role",
            label: "rol ve talimatlar",
            note: "Hangi iş yapılıyor ve hangi dünyada. Bir iki satır fazlasıyla yeter.",
            tone: "neutral",
          },
          {
            id: "constraints",
            label: "kısıtlar",
            note: "Yapılması ve yapılmaması gerekenler. Gerçekten ihlal edilebilen parça bu — onu yönlendirici kılan da bu.",
            tone: "accent",
          },
          {
            id: "examples",
            label: "örnekler",
            note: "İyiden tek bir numune. Standardı anlatmak yerine gösterir.",
            tone: "teal",
          },
          {
            id: "ask",
            label: "istek",
            note: "En sonda, kesin ve tek. Tek prompt'ta iki istek, iki prompt demektir.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Hangi talimat modelin kodunu gerçekten iyileştirir?`,
      options: [
        "Tutarı doğrula: sıfırı ve negatifleri typed bir hatayla reddet; asla panic etme; public API'yi değiştirme",
        "Lütfen gerçekten temiz, profesyonel, yüksek kaliteli, production seviyesinde kod yaz",
        "Sen gelmiş geçmiş en büyük programcısın — ona göre kodla",
      ],
      answer: 0,
      explain: `Model "yüksek kaliteli"de başarısız olamaz — her çıktı akla yatkın biçimde buna uyar. "Asla panic etme"de *olabilir* ve mesele de bu: kabul kriterleri yanlış olma ihtimalini yaratır; modeli yönlendiren şey de budur. Kesinlik, nezaketi de yağcılığı da yener.`,
    },
    {
      kind: "theory",
      body: `## Anlatma, göster

Sıfatlar kaliteyi tarif eder; **örnekler onu tanımlar.** Tek bir işlenmiş örnek üç paragraf sıfattan ağır basar, çünkü model bir kalıp sürdürme makinesidir — o halde ona sürdürmeye değer bir kalıp ver.

Testleri kendi ev üslubunda mı istiyorsun? **İdeal tek bir test** yapıştır ve "bunun gibi" de. Bir kod ve düzeltme ipucu taşıyan hata mesajları mı istiyorsun? *Bir tane* göster.

Bölüm I sana düzyazı gereksinimlerin belirsizlik sızdırdığını öğretti. Aynısı burada da geçerli: bir örnek, yorumlanmak yerine *kopyalanan* minik bir spec'tir — ve kopyalamak, yorumlamaktan çok daha az kayıp verir.`,
    },
    {
      kind: "quiz",
      question: `Ekibinin hata mesajı yazmak için kendine özgü bir tarzı var. Modelin buna uymasını ne sağlar?`,
      options: [
        "Kod tabanından gerçek bir hata mesajı yapıştırıp “bunun gibi” demek",
        "Kuralı üç cümleyle özenle tarif etmek",
        "Ekibin yerleşik stil rehberine uymasını söylemek",
      ],
      answer: 0,
      explain: `Stil rehberini hiç okumadı ve kod tabanını göremiyor. Bir tarifin yorumlanması gerekir; bir örneğin ise yalnızca sürdürülmesi — ve sürdürmek, bu makinenin yapmak için inşa edildiği tek şey.`,
    },
    {
      kind: "fill",
      prompt: `Sahip olduğun en keskin prompt, zaten yazmış olduğun bir şey:`,
      file: "prompt.md",
      before: `Şu başarısız `,
      after: ` geçsin — assertion'larına dokunmadan.`,
      choices: ["test", "build", "demo", "deploy"],
      answer: 0,
      explain: `Başarısız bir test, çalıştırılabilir bir kabul kriteridir — davranış, sınır durumlar ve "bitti"nin tanımı, yanlış okunamayacak bir biçimde. Build, demo ve deploy de başarısız olabilir, ama assertion taşıyan yalnızca testtir: dişli spec'in, şimdi ek iş olarak prompt'luk yapıyor.`,
    },
    {
      kind: "theory",
      body: `## Yineleme, spec sıkılaştırmadır

İlk çıktı yanlış. Olsun — bu bir veri. Amatör hamle zarı yeniden atmaktır; mühendisin hamlesi **başarısızlığı okuyup eksik talimatı bulmak**.

Model bir sınır durumu es mi geçti? Kısıtların ondan hiç söz etmemiş. Yanlış üslup mu? Göstermek yerine anlatmışsın. Dokunmaması gereken dosyalara mı dokundu? Sınır belirtilmemiş.

Her başarısızlık, sözlerindeki bir deliğin adını söyler — yalnızca çıktıyı değil, *prompt'u* yama; tıpkı Bölüm I'in sana bir spec'i sıkılaştırmayı öğrettiği gibi.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## Sınav yapıcının sınavı: prompt'u yaz

İşte devretmek üzere olduğun görev:

> Bir ödeme kontratının \`refund\` fonksiyonu var. Şu anda herkes çağırabiliyor. Yalnızca orijinal ödeyen tarafından, yalnızca son tarihten önce çağrılabilmeli ve kontratı asla açık depozitolarının toplamından daha azını tutar halde bırakmamalı.

Göndereceğin **prompt'u** yaz — dört parçanın hepsi, sırasıyla. Uygulamayı yazma, spec'i de düzyazı olarak yazma: tezgâha gerçekten yapıştıracağın şeyi yaz.`,
      rubric: `1. Dört parçanın hepsi mevcut ve ayırt edilebilir: rol/talimatlar, kısıtlar, en az bir örnek ve tek bir nihai istek.
2. Kısıtlar İHLAL EDİLEBİLECEK biçimde ifade edilmiş — somut ve denetlenebilir; "temiz" ya da "yüksek kaliteli" değil.
3. İstenen üslubu yalnızca tarif etmek yerine en az bir işlenmiş örnek içeriyor (bir test, bir imza, bir hata mesajı, örnek bir çağrı).
4. İstek tek ve kesin — gevşekçe ilişkili dileklerin listesi değil, tek bir görev.
5. Bu bir prompt; bir uygulama ya da düzyazı spec değil.`,
      minChars: 160,
    },
    {
      kind: "theory",
      body: `## Zor olan yarı

Artık tam olarak ne istediğini söyleyen bir prompt yazabiliyorsun. Bu, kolay olan disiplin ve çoğu insan burada durur.

Zor olanı, **modelin neyi görmeye hakkı olduğuna** karar vermek — hangi dosyalar, hangi spec, hangi test ve çok daha önemlisi, neyin dışarıda kalacağı. İfade bir beceridir; seçim ise zanaat.

**Sırada:** tezgâhın kendisi — ve ona bir şey eklemenin neden bedava olmadığı.`,
    },
  ],
  testOut: [
    {
      question: `İşe yarayan bir prompt'un dört parçası var. En sık eksik olan hangisi?`,
      options: [
        "Kısıtlar — gerçekten ihlal edilebilen, yapılması ve yapılmaması gerekenler",
        "Modele kim olması gerektiğini söyleyen rol",
        "İş birliği tonu kuran selamlama",
      ],
      answer: 0,
    },
    {
      question: `"Asla panic etme" bir modeli neden "yüksek kaliteli kod yaz"dan daha iyi yönlendirir?`,
      options: [
        "Başarısız olunabilir — bir kabul kriteri, yanlış olma ihtimalini yaratır",
        "Daha kısa, dolayısıyla bağlamda daha uzun süre hayatta kalır",
        "Modellerin daha çok ağırlık verdiği emir kipinde bir fiil kullanıyor",
      ],
      answer: 0,
    },
    {
      question: `Ekibinin ev üslubunda çıktı istiyorsun. Ne işe yarar?`,
      options: [
        "Gerçek bir örnek yapıştırıp “bunun gibi” demek",
        "Üslubu özenle ve uzun uzun tarif etmek",
        "Ekibin izlediği stil rehberinin adını vermek",
      ],
      answer: 0,
    },
    {
      question: `İlk çıktı yanlış geldi. Mühendisin hamlesi nedir?`,
      options: [
        "Başarısızlığı oku, eksik olan talimatı bul ve prompt'u yama",
        "Yeniden çalıştır — aynı prompt her seferinde farklı çıktı üretir",
        "“Dikkatli ol ve adım adım düşün” ekleyip tekrar dene",
      ],
      answer: 0,
    },
  ],
};
