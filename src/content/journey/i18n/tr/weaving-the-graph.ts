import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Graph engineering",
  tagline: "Graph engineering: her biri kendi tezgâhında birçok küçük model, dokunmuş tek bir plan.",
  steps: [
    {
      kind: "theory",
      body: `## Tek döngü yetmediğinde

Bazı görevler tek bir zihne sığmaz: *bu kontratı denetle, bulduklarını düzelt, dokümanları güncelle, migration'ı hazırla.* Hepsini tek bir bağlama tıkıştır, kalite her adımda sulanır — nedenini geçen bölüm anlattı.

Hamle kadim: **ayrıştır**. Adımlardan bir **graf** kur:

- **Düğümler** — küçük, odaklı işler; her birinin *kendi özenle seçilmiş tezgâhı* var.
- **Kenarlar** — aralarında akan şey: bir spec, bir diff, bir rapor.

Bunu koda hayatın boyunca yaptın — küçük fonksiyonlar, tek görevler, açık girdi ve çıktılar. Şimdi işin kendisine yap.`,
    },
    {
      kind: "theory",
      body: `## Fan-out, fan-in

Bağımsızlık, zamanlayıcının en sevdiği kelimedir.

**Fan-out**: değerlendirilecek üç aday SDK mı var? Üç düğüm, paralel — her biri kendi tezgâhında, hiçbiri diğerine muhtaç değil, aralarında bağlam sızıntısı yok.

**Fan-in**: tek bir *sentez* düğümü üç raporu alır, ölçütlerine göre tartar ve öneride bulunur.

Disiplin, *gerçek* bağımsızlığı fark etmekte: paralel işler **hiçbir state paylaşmamalı** — aynı dosyayı düzenlemek için yarışan düğümler graf değil, kavgadır. Veri pipeline'larına zaten uyguladığın türden bağımlılık düşüncesi; şimdi zihinlere uygulanıyor.`,
    },
    {
      kind: "diagram",
      body: "Bir plan, üç işçi, bir hüküm:",
      caption: "Her işçi temiz başlar. Mesele tam da bu yalıtım — birindeki kötü bir hamle diğerlerini asla zehirlemez.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "plan",
            label: "PLAN",
            x: 50,
            y: 12,
            tone: "accent",
            shape: "box",
            note: "İşi, birbiriyle konuşması gerekmeyen parçalara böler.",
          },
          {
            id: "a",
            label: "A",
            x: 18,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Kendi bağlamı, kendi bütçesi. B'nin hatalarını asla görmez.",
          },
          {
            id: "b",
            label: "B",
            x: 50,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Aynı anda, aynı brief üzerinde, farklı bir parçada çalışır.",
          },
          {
            id: "c",
            label: "C",
            x: 82,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Üç ucuz deneme, kontrol edemediğin tek bir pahalı denemeyi yener.",
          },
          {
            id: "judge",
            label: "YARGIÇ",
            x: 50,
            y: 56,
            tone: "gold",
            shape: "box",
            note: "Üçünü de okur ve karar verir. Kalite gerçekte buradan gelir.",
          },
        ],
        edges: [
          {
            from: "plan",
            to: "a",
            style: "solid",
          },
          {
            from: "plan",
            to: "b",
            style: "solid",
          },
          {
            from: "plan",
            to: "c",
            style: "solid",
          },
          {
            from: "a",
            to: "judge",
            style: "dashed",
          },
          {
            from: "b",
            to: "judge",
            style: "dashed",
          },
          {
            from: "c",
            to: "judge",
            style: "dashed",
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "fan-out",
      body: `Dört iş, her birinde iki aşama, zamanlamanın üç yolu. **Süreleri ters çevir** ve hangi iki zamanlamanın aynı şey olmaktan çıktığını izle.`,
    },
    {
      kind: "quiz",
      question: `Hangi alt görev kümesini paralel olarak fan-out etmek güvenlidir?`,
      options: [
        "Üç aday kütüphaneyi aynı kontrol listesine göre değerlendirmek — bağımsız iş, paylaşılan state yok",
        "Bir migration script'i yazmak ve aynı script'i çalıştırmak — üst üste bindirmek zaman kazandırır",
        "Üç modelin aynı modülü aynı anda düzenlemesi, üç kat hızlı bitirmek için",
      ],
      answer: 0,
      explain: `Yazılmadan çalıştırmak bir bağımlılığı çiğner; paylaşılan dosyayı düzenlemekse fazladan adımlı bir merge-conflict fabrikasıdır. Test sıkıcı ve güvenilir: A düğümü B'nin çıktısını okumuyor ve B'nin state'ine dokunmuyorsa, birlikte çalışabilirler.`,
    },
    {
      kind: "quiz",
      question: `Beş düğümün her biri bir bulgu üretiyor ve her bulgunun ardından doğrulanması gerekiyor. **Herhangi bir** doğrulamaya başlamadan önce **beş bulgunun tamamını** beklemek ne zaman doğrudur?`,
      options: [
        "Yalnızca doğrulama adımı gerçekten kümenin tamamına tek seferde ihtiyaç duyduğunda — bulgular arasındaki tekrarları ayıklamak için, mesela, ya da sayı sıfırsa tamamen atlamak için",
        "Her zaman — temiz bir aşama sınırı pipeline hakkında akıl yürütmeyi kolaylaştırır",
        "Asla — paralel bir sistemde beklemek her zaman boşa harcanan zamandır",
      ],
      answer: 0,
      explain: `Bariyer gerçek bir araçtır ve gerçek bir bedeli vardır: en yavaş düğümün süresini, diğer dördüyle hiçbir şey yapmadan harcar. Bir sonraki aşama gerçekten *küme* hakkındaysa bu bedeli hak eder — tekrar ayıklama, sıfırda erken çıkış, sonuçlar arası karşılaştırma. "Daha temiz okunuyor" bu değildir; "önce listeyi düzleştirmem lazım" da değildir.`,
    },
    {
      kind: "theory",
      body: `## Demirci ve çürütücü

Harness bölümü seni uyarmıştı: kendi kendini incelemek, kendinin kör noktalarını paylaşır. Bir graf bunu *yapısal olarak* düzeltir.

Bir **doğrulayıcı düğüm** ekle: bir model işi döver; *farklı* bir düğüme — taze bağlam, çoktan verilmiş kararlara hiç bağlılık yok — **çürütmesi** söylenir: diff'in spec'i nerede çiğnediğini bul, uç durumların peşine düş, kırmaya çalış.

İş tanımı önemlidir. "Bunu incele" omuz silkerek onaylamaya davettir. *"Bunda yanlış olanı bul"* zihni deliklere nişanlar. Hasım çiftler, kendi kendini incelemenin yapısal olarak yakalayamadığını yakalar — gerçek demirhanelerin bir ustayı bir denetçiyle eşlemesinin nedeni bu.`,
    },
    {
      kind: "fill",
      prompt: `İkinci modele gerçek işini ver:`,
      file: "graph.toml",
      before: `verifier.goal = "forge düğümünün diff'ini `,
      after: `"`,
      choices: ["çürüt", "onayla", "özetle", "yeniden yaz"],
      answer: 0,
      explain: `Onaylaması söylenen bir doğrulayıcı, onaylamanın bir yolunu bulur. "Özetle" düzyazı üretir, titiz inceleme değil; "yeniden yaz" ise sadece kendi kör noktaları olan ikinci bir demirci yaratır. Düğümü deliklere nişanlayan tek hedef çürütmedir.`,
    },
    {
      kind: "theory",
      body: `## Bir biçim henüz bir sistem değildir

Artık tek bir tezgâha sığmayan bir görevi alıp her biri iyi yapılacak kadar küçük düğümlere kesebiliyorsun — ve kontrolü, ilkinin kararlarına hiç bağlanmamış ikinci bir zihne vermeyi biliyorsun.

Elindeki bir biçim. Henüz elinde olmayansa, birinin güvenebileceği bir makine. Sırada hangi düğümün çalışacağına kim karar veriyor? Biri başarısız olduğunda diğer düğümlere ne oluyor? Ve — en çok para kurtaran soru — ne zaman hiç graf kurmamalısın?

**Sırada:** biçimi güvenilir kılan kısım.`,
    },
  ],
  testOut: [
    {
      question: `Büyük bir görevi neden tek bir uzun prompt yerine düğümlerden oluşan bir grafa ayrıştırmalı?`,
      options: [
        "Her düğüm kendi özenle seçilmiş tezgâhını alır; böylece kalite, birbiriyle ilgisi olmayan adımlar arasında sulanmaz",
        "Modeller birkaç kısa istek için tek bir uzun istekten daha az ücret alır",
        "Modelin kendi iş sırasını seçmesine izin verir, bu da sonuçları iyileştirir",
      ],
      answer: 0,
    },
    {
      question: `İki düğümün paralel çalışıp çalışamayacağının testi nedir?`,
      options: [
        "A düğümü B düğümünün çıktısını okumuyor ve state'ine dokunmuyor",
        "İki düğümün de kabaca aynı sürede bitmesi bekleniyor",
        "İki düğüm de ağa yazmıyor",
      ],
      answer: 0,
    },
    {
      question: `İkinci modele neden "incele" değil de "çürüt" hedefi verilir?`,
      options: [
        "Onaylaması söylenen bir düğüm onaylamanın bir yolunu bulur — zihni deliklere nişanlayan tek hedef çürütmedir",
        "Çürütme daha kısa çıktı üretir, bu da daha ucuza gelir",
        "İnceleme orijinal bağlamı gerektirir, çürütme gerektirmez",
      ],
      answer: 0,
    },
    {
      question: `Dört iş fan-out ediliyor, her birinde iki aşama var. Her işin birinci aşamayı bitirmesini beklemek gerçekte neye mal olur?`,
      options: [
        "En yavaş işin birinci aşama süresine — diğerleriyle hiçbir şey yapmadan harcanır — ve ikinci aşamada bir daha",
        "Hiçbir şeye, işler her aşamanın içinde paralel çalıştığı sürece",
        "Yalnızca zamanlayıcının koordinasyon yüküne",
      ],
      answer: 0,
    },
  ],
};
