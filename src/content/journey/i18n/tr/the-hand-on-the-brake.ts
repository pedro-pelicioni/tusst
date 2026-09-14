import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Frendeki El",
  tagline: "Agentic loop'lar ve guardrail'ler: durma kuralı yoksa bu otonomi değil, faturadır.",
  steps: [
    { kind: "theory", body: `## Her döngüye bir fren gerekir

Gözetimsiz bir döngü yakınsamaz — **harcar**. Durağı olmayan bir döngü bir faturadır, ara sıra da bir kesinti. Frenleri ilk turdan *önce* tak:

- **Başarı ölçütleri** — *bitti* demek olan kontroller, baştan kararlaştırılmış.
- **Bütçe** — token, dakika, dolar: hangisi önce biterse.
- **Maksimum iterasyon** — sert bir tavan, her zaman.
- **İlerleme yok tespiti** — aynı hata iki kez geliyorsa *strateji değiştir ya da yukarı bildir*; asla "yine, ama daha sert" değil.

Diyarın kuralı: nasıl durduracağına karar vermediğin bir döngüyü asla başlatma.` },
    { kind: "widget", component: "loop-brake",
      body: `İki anahtar, dört çalıştırma. Frenler takılı ve geri bildirim dürüstken **döngüyü döndür**, sonra her seferinde bir şeyi çıkar ve hangisini çıkarınca yırttığını izle.` },
    { kind: "theory", body: `## Hiçbir şey durdurmayınca bedeli ne olur

Fatura görünen kısım — ve küçük olanı.

Yalan söyleyen bir test üzerinde geceyi geçiren frensiz bir döngü sana hiçbir şey vermez demek yanlış. Sana bir branch verir: kırk commit, çoğu hiç bozulmamış koda yapılmış düzenlemeler, her biri tek başına makul, her biri hiç gerçek olmamış bir kırmızıyı memnun etmek için yapılmış. Eval'ler hâlâ yeşil değil — yani o branch'teki hiçbir şey gerçek işin nerede bitip batıl inancın nerede başladığını söylemiyor.

Artık en ucuz yol, bütün geceyi çöpe atıp flake'i düzelttikten sonra baştan başlamak. İlerleme yok freninin dördüncü iterasyonda, dört iterasyon fiyatına sana söyleyeceği tam olarak buydu.

Şekli bu: **fren iyi çalıştırmalarda sana para kazandırmaz. Kötü çalıştırmalarda seni arkeolojiden kurtarır.**` },
    { kind: "quiz", question: `40. iterasyon; döngü 12. iterasyondan beri aynı hata mesajıyla aynı başarısız eval'e çarpıp duruyor. Harness ne yapmalı?`,
      options: [
        "Durup bir insana yukarı bildirmeli — ilerlemeden tekrarlamak bir durma koşuludur, azim değil",
        "Devam etmeli — iterasyon zaten döngünün bütün amacı ve 41. deneme belki de doğru olan",
        "Modelin temperature'ını yükseltmeli ki düzeltme konusunda daha yaratıcı olsun",
      ], answer: 0,
      explain: `Yirmi sekiz özdeş başarısızlık bir mesajdır: döngüde bir şey eksik — bağlam, bir izin, doğru bir spec — ve daha fazla iterasyon bunu sağlayamaz. Daha sert rastgeleleştirmek aynı fiyata dağınık yanlışlık satın alır. İlerleme yokluğunu tespit et, dur ve izi bir insana teslim et.` },
    { kind: "fill", prompt: `Döngü dönmeden önce freni tak:`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: ["budget.max_iterations", "usize::MAX", "evals.len()", "iterations + 1"], answer: 0,
      explain: `usize::MAX, "fren yok — faturada konuşuruz" demektir. Sayaçla birlikte hareket eden bir sınır (iterations + 1) asla bağlamaz. evals.len() ise kaç kontrol olduğunu, ne kadar denemeye devam edileceğiyle karıştırır. Tavan, bilerek seçtiğin bir bütçedir.` },
    { kind: "theory", body: `## Flaky geri bildirim döngüyü zehirler

Rastgele başarısız olan bir test — zamanlama, sıralama, paylaşılan bir port — insanlar için bir rahatsızlıktır. İç çekip yeniden çalıştırırız. Bir döngü içinse **zehirdir**, çünkü döngü *her sinyale göre hareket eder*.

Hayalet bir kırmızı gelir → model hiç bozulmamış kodu "düzeltir" → değişiklik girer → sonraki iterasyonda yeni bir hayalet → bir düzeltme daha. Döngü artık batıl inançlar öğreniyor, her biri bir öncekinin üstüne bindiriliyor, hepsi gürültüden.

Kural: **bir döngüye bağlamadan önce geri bildirimi deterministik yap.** Flaky bir test, hiç test olmamasından kötüdür — sessizlik kimseyi yanıltmaz; gürültü yorulmadan yanıltır.` },
    { kind: "quiz", question: `Bir test zamanlama yüzünden beş çalıştırmada bir rastgele başarısız oluyor. İnsan için bu bir baş belası. Döngü için ne?`,
      options: [
        "Zehir — döngü her hayalet başarısızlığı gerçek sayar ve sağlıklı kodu 'düzeltir', her geçişte yanlışlığı büyütür",
        "Aynı baş belası — çok sayıda iterasyonda rastgelelik kendi kendini dengeler",
        "Az da olsa faydalı — ekstra başarısızlıklar kodu daha sağlam yapmak için ekstra baskı uygular",
      ], answer: 0,
      explain: `Hiçbir şey dengelenmez, çünkü her yanlış sinyal gerçek bir kod değişikliğini tetikler ve sonraki iterasyon onun üstüne inşa eder. İnsanlar gürültüyü hesaba katmaz; döngüler itaatkârca ona göre hareket eder. Determinizm harness'in bir inceliği değil — döngü kurmanın ön koşuludur.` },
    { kind: "diagram", body: "Aynı görev, iki kez çalıştırılmış:",
      caption: "İyi günde frenler görünmezdir. Dışarıda bırakılmalarının bütün sebebi bu.",
      view: { kind: "compare", columns: [
        { id: "braked", label: "frenli", tone: "good" },
        { id: "loose", label: "frensiz", tone: "bad" },
      ], rows: [
        { label: "geri bildirim dürüst", cells: [
          { text: "yakınsar; frenler hiç devreye girmez", tone: "good" },
          { text: "yakınsar; birebir aynı sonuç", tone: "neutral" },
        ] },
        { label: "geri bildirim yalan söylüyor", cells: [
          { text: "üç turda durur, yukarı bildirir", tone: "good" },
          { text: "var olmayan tavana kadar koşar", tone: "bad" },
        ] },
        { label: "ödediğin", cells: [
          { text: "sınırlı, bilinen bir miktar", tone: "good" },
          { text: "ne tuttuysa o, sonradan öğrenilir", tone: "bad" },
        ] },
        { label: "koda verilen hasar", cells: [
          { text: "erken yakalanır, birkaç hayalet düzeltme", tone: "good" },
          { text: "hiç bozulmamış koda düzenlemeler", tone: "bad" },
        ] },
      ] } },
    { kind: "theory", body: `## Doğru irtifa

Döngü dönerken insan nerede durur? İçinde değil — her tuş vuruşunu incelemek, model temposunda döngünün *sen* olman demektir. Bulutların üstünde de değil, inen her şeyi gözü kapalı onaylayarak.

Doğru irtifa **sınırdır**: *diff*'i *spec*'e karşı incele. Eval'ler geçti mi? Değişiklik Bölüm I'in kurallarına uyuyor mu? Hareket etmemesi gereken bir şey hareket etti mi? Küçük işler için döngünün aletlerine güven; insan yargısını aletlerin göremediği şeyler için sakla.

**Sırada:** tek döngü yetmediğinde — çok sayıda küçük model, tek bir dokunmuş plan.` },
  ],
  testOut: [
    { question: `Bir döngü yirmi sekiz iterasyondur aynı eval'de aynı hatayla kalıyor. Harness sana ne borçlu?`,
      options: ["Bir duruş ve bir yukarı bildirim — ilerlemeden tekrarlamak bir durma koşuludur, azim değil","Daha fazla iterasyon, çünkü sonraki deneme de diğerleri kadar başarılı olabilir","Daha yüksek bir temperature, ki model yaklaşımını çeşitlendirsin"], answer: 0 },
    { question: `Flaky bir test neden bir döngü için insana kıyasla daha kötüdür?`,
      options: ["Döngü her sinyale göre hareket eder, bu yüzden hayalet bir kırmızı sağlıklı koda yapılmış gerçek bir düzenlemeye dönüşür","Döngü test paketini daha sık çalıştırır, bu yüzden flake'e daha sık çarpar","Aynı problemdir; döngüler sadece onu daha erken ortaya çıkarır"], answer: 0 },
    { question: `Geri bildirimin dürüst olduğu bir çalıştırmada frenler neyi değiştirir?`,
      options: ["Hiçbir şeyi — dışarıda bırakılmalarının sebebi tam olarak bu, ve bunun bir hata olmasının da","Gereken iterasyon sayısını kabaca yarıya indirirler","Daha erken yakınsamayı zorlayarak nihai kaliteyi artırırlar"], answer: 0 },
    { question: `Bir döngü çalışırken insan nerede durmalı?`,
      options: ["Sınırda — diff'i spec'e karşı inceleyerek; ne her tuş vuruşunu ne de hiçbir şeyi","Döngünün içinde, her eylemi yapılmadan önce kontrol ederek","Tamamen dışında; gözettiğin bir döngü otonom değildir"], answer: 0 },
  ],
};
