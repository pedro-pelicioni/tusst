import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Diyarın Sınırları",
  tagline: "DDD ve bounded context'ler: tek kelime, üç anlam ve bunu güvenli kılan sınırlar.",
  steps: [
    { kind: "theory", body: `## Tek kelime, üç anlam

Stellar'daki üç ekibe **Account** (hesap) nedir diye sor:

- Bir *cüzdan* ekibi: "bakiye sahibi — lumen'leri ve varlıkları olan biri."
- Bir *anchor* ekibi: "KYC öznesi — para taşımadan önce kimliğini doğrulamamız gereken biri."
- Bir *borsa* ekibi: "emir defteri katılımcısı — açık teklifleri olan biri."

Aynı kelime. Hatta aynı G-adresi. **Üç farklı model.** "İletişim kazası" denen bug'ların çoğu tam olarak bu: iki kişi bir kelimeyi iki kavram için kullanıyor, her biri diğerinin hemfikir olduğundan emin.

Domain-Driven Design burada başlar: dili *bilerek* keskinleştir.` },
    { kind: "theory", body: `## Ubiquitous language, bounded context'ler

Tek bir ekip ve sistemin tek bir parçası içinde DDD bir **ubiquitous language** (ortak dil) ister: bir kelime, bir anlam, *her yerde* aynı — sohbette, spec'te ve kodda. Spec "release" diyorsa fonksiyon \`release\`'dir, \`transfer_out\` değil.

Ama hiçbir dil bütün diyara hükmetmez. **Bounded context** (sınırlı bağlam), bir kelimenin anlamının değişmesine izin verilen sınırdır: *Payments* içinde Account bir bakiye sahibidir; *Compliance*'a geç, aynı adres bir KYC öznesine dönüşür.

Sınır bir tasarım hatası değil. **Sınır, tasarımın ta kendisi.**` },
    { kind: "diagram", body: "Aynı kelime, üç sınır:",
      caption: "Kesikli çizgiler çeviridir, paylaşılan kod değil. Başka bir context'in modelini import eden context'in sınırı falan yoktur.",
      view: { kind: "graph", nodes: [
        { id: "pay", label: "PAYMENTS", x: 22, y: 20, tone: "accent", shape: "box", note: "Burada bir \"account\" bir kaynak, bir sequence number ve bir ücret bütçesidir." },
        { id: "trade", label: "TRADING", x: 78, y: 20, tone: "teal", shape: "box", note: "Burada ise bir açık teklifler kümesi ve bunların cinsinden yazıldığı varlıklardır." },
        { id: "custody", label: "CUSTODY", x: 50, y: 50, tone: "gold", shape: "box", note: "Burada da eşikleri olan bir imzacı kümesi. Aynı kelime, üç anlam." },
      ], edges: [
        { from: "pay", to: "trade", style: "dashed" },
        { from: "pay", to: "custody", style: "dashed" },
        { from: "trade", to: "custody", style: "dashed" },
      ] } },
    { kind: "quiz", question: `Compliance ekibi Payments context'inin Account modeline \`kyc_status\` ve \`risk_score\` eklemeni istiyor — "sonuçta aynı hesap." DDD'nin okuması ne?`,
      options: [
        "Ayrı sınırların arkasında ayrı modeller tut, hesabın adresiyle birbirine bağla — her context yalnızca ihtiyacı olanı modeller",
        "Birleştir — bütün sistem için tek bir paylaşılan Account modeli, daha büyük kötülük olan tekrardan kaçınır",
        "Alanları ekle ama opsiyonel işaretle, böylece Payments kodu onları görmezden gelebilir",
      ], answer: 0,
      explain: `Paylaşılan bir model, hiçbir context diğerini bozmadan kıpırdayamayana kadar her context'in alanlarını ve kurallarını büyütür. Bir ID paylaşan iki yalın model tekrar değildir — tek bir adres hakkında iki hakikattir, her biri anlaşıldığı yerde sahiplenilmiş.` },
    { kind: "fill", prompt: `Sınırı sınır yapan kuralı tamamla:`,
      file: "NOTES.md",
      before: `Tek bir context içinde bir kelimenin tam olarak tek bir anlamı vardır. Sınırda bu anlamın `,
      after: ` izin verilir.`,
      choices: ["değişmesine", "aynı kalmasına", "opsiyonel olmasına", "sonraki context'e miras kalmasına"], answer: 0,
      explain: `Anlam değişemeseydi sınıra ihtiyacın olmazdı — tek bir paylaşılan modele ihtiyacın olurdu, ki sınırlar tam da bunu önlemek için var. Sınır, "Account"un bilerek, geçişte bir çeviriyle başka bir şey anlamına gelmesine izin verilen yerin ta kendisidir.` },
    { kind: "theory", body: `## Context'ler arası köprüler: anchor

Context'ler yine de konuşmak zorunda. **Context mapping** sınırları adlandırıp bilinçli köprüler kurmaktır — kenarda çeviri, böylece hiçbir tarafın dili diğerine sızmaz.

Stellar'ın **anchor**'ları, iş modeli eklenmiş haliyle bu kalıptır. Bir yanda *bankacılık context'i* — IBAN'lar, iş günleri, uyum blokajları. Diğer yanda *ledger context'i* — trustline'lar, varlıklar, 5 saniyelik kesinlik. Anchor **çevirir**: gelen bir havale ihraç edilmiş token'lara dönüşür; geri alınan bir token bir banka ödemesine.

İki dünyanın hiçbiri diğerinin modelini benimsemek zorunda kalmadı. Sağlıklı sınır budur: çeviriyle geçilir, sızıntıyla asla.` },
    { kind: "theory", body: `## Sessizce eriyen sınır

Sınırlar nadiren tek seferde yıkılır. Aşınırlar — ve hep aynı nazik hamleyle: *"bu iki context sadece azıcık paylaşsın."*

Tek bir tiple başlar. Payments'ın da Compliance'ın da bir adrese ihtiyacı var, o yüzden paylaşılan bir \`Account\` import ederler — yalnızca tanımlayıcı, başka hiçbir şey. Sonra Compliance'ın üstünde status'a ihtiyacı olur. Sonra Payments'ın bir makbuz için tek bir Compliance alanına. Altı ay sonra paylaşılan tipin on dört alanı vardır, yarısı iki context'te de anlamsızdır ve hiçbir taraf toplantı yapmadan onu değiştiremez.

İşaret, paylaşılan şeyin boyutu değil. **Onu değiştirmek için kime danışmak gerektiği.** Çeviri olmadan geçemediğin sınır sınırdır. Import ederek geçtiğin sınır süstür.

Sağlıklı kalan köprü, her tarafın kendi modelini tuttuğu ve ortadaki bir şeyin dönüştürdüğü köprüdür — anchor tam olarak bunu yapar, paylaşılan tip ise tam olarak yapmaz.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## Sınav yapıcının sınavı: sınırları çiz

İşte bir sistem, bir kurucunun anlatacağı gibi anlatılmış:

> Bir havale uygulaması. Kullanıcılar kaydolur ve kimlik kontrollerinden geçer. Banka transferiyle bakiye yükler, başka bir ülkedeki alıcılara para gönderir; alıcı yerel bir ortakta nakde çevirir. Destek ekibi bir hesabı dondurabilir ve eksiksiz bir denetim izini görüntüleyebilir.

Çizeceğin **bounded context**'leri adlandır; her biri için: o sınırda anlamı değişen kelimeleri ve context'lerin birbiriyle nasıl konuştuğunu. Yalnızca modelleme — şema yok, servis yok, framework adı yok.`,
      rubric: `1. Her biri tek satırlık sorumlulukla, en az üç makul bounded context adlandırır.
2. Bu context'lerin ikisinde gerçekten farklı anlamlara gelen en az bir kelime belirler ve her birinde ne anlama geldiğini söyler.
3. En az bir context çiftinin nasıl iletişim kurduğunu açıklar — kenarda bir çeviri, paylaşılan bir model değil.
4. Farkları herkes için tek bir paylaşılan model önererek çözmez.
5. Yalnızca modelleme — veritabanı şeması yok, servis ya da framework adı yok, kod yok.`,
      minChars: 180 },
    { kind: "theory", body: `## Model neden senin haritana muhtaç

Bir LLM, "account", "transfer" ve "balance"ın hepsinin farklı anlamlara geldiği bir milyon kod tabanı okudu. Sınırlarını söylemeden bırak, **dosyanın ortasında sözcük dağarcıklarını karıştırır** — bir KYC kuralı payments modeline sürüklenir, bir borsanın Account fikri cüzdanınkine karışır — her satır yerel olarak makul.

O yüzden sınırı tezgâha yaz: *"Payments context'indeyiz. Account, bakiye sahibi demek. Compliance ayrı bir model — yalnızca adresle referans ver."* Söylenmiş bir context, modelin saygı duyduğu bir çittir.

**Sırada:** çizgileri çizdin. Birinin içinde gerçekte ne yaşıyor — ve hangi şeylerin yalnızca birlikte değişmesine izin var.` },
  ],
  testOut: [
    { question: `Üç ekip "Account"u üç farklı şekilde tanımlıyor. DDD, anlamın değişmesine izin verilen yere ne der?`,
      options: ["Bounded context — sınır tasarımın kendisidir, bir hatası değil","Namespace çakışması; birini yeniden adlandırarak çözülür","Teknik borç; modeli birleştirerek ödenir"], answer: 0 },
    { question: `Compliance, Payments context'inin Account'una \`kyc_status\` eklemeni istiyor. DDD'nin okuması ne?`,
      options: ["Ayrı sınırların arkasında ayrı modeller tut, adresle birbirine bağla — her context yalnızca ihtiyacı olanı modeller","Birleştir, çünkü tekrar daha büyük kötülüktür","Alanları opsiyonel olarak ekle ki Payments görmezden gelebilsin"], answer: 0 },
    { question: `Bu bölümün diliyle bir Stellar anchor'ı nedir?`,
      options: ["İş modeline dönüşmüş bir context map — bankacılık context'i ile ledger context'i arasında çeviri yapar","Hem bankaların hem ledger'ın benimsemeyi kabul ettiği paylaşılan bir model","Her iki context'in üstünde oturup onları yöneten bir uyum katmanı"], answer: 0 },
    { question: `Söylenmemiş bir sınır, kodu bir yapay zekâ yazarken neden daha çok canını yakar?`,
      options: ["O kelimelerin başka anlamlara geldiği bir milyon kod tabanı okudu ve dosyanın ortasında sözcük dağarcıklarını karıştıracak","Alan terimlerini hiç okuyamaz, teknik adlara ihtiyaç duyar","Her terim resmen tanımlanana kadar ilerlemeyi reddeder"], answer: 0 },
  ],
};
