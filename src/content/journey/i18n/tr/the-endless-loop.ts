import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Sonsuz Döngü",
  tagline: "Agentic loop'lar: uygula, gözle, düzelt — ve döngüyü tırmandıran sinyaller.",
  steps: [
    { kind: "theory", body: `## Dilekten döngüye

Tek atımlık prompt bir dilektir: tarif et, al, umut et. **Agentic loop** (ajan döngüsü) umudun yerine bir çevrim koyar:

> **uygula → gözle → düzelt → yeniden uygula**

Model kodu yazar, *çalıştırır*, derleyicinin şikâyetini okur, düzeltir, yeniden çalıştırır — tıpkı senin çalıştığın gibi, ama makine temposunda. Model kendi sonuçlarını görebildiği andan itibaren tek atımlık kalite ilginç bir sayı olmaktan çıktı.

Ama döngü sihir değil, makinedir. İyi ya da kötü tasarlanabilen parçaları vardır; bu bölüm, döngünün tırmanıp tırmanmayacağına karar veren o iki parça hakkında.` },
    { kind: "diagram", body: "Döngü ve önemli olan tek çıkış:",
      caption: "Bu dördünün üçü bu bölümün konusu. Dördüncüsü — durmaya karar vermek — sonraki bölüm; insanların atladığı da tam o.",
      view: { kind: "flow", layout: "cycle", play: true, nodes: [
        { id: "act", label: "uygula", note: "Planın izin verdiği en küçük adımı at, sonra dur ve bak.", tone: "accent" },
        { id: "observe", label: "gözle", note: "Dünyanın ne cevap verdiğini oku. Ne umduğunu değil.", tone: "teal" },
        { id: "correct", label: "düzelt", note: "Sadece son hamleyi değil, planı ayarla.", tone: "gold" },
        { id: "stop", label: "dur?", note: "Bitti, tıkandı ya da bütçe tükendi. Her turda bunu açıkça kararlaştır.", tone: "good" },
      ] } },
    { kind: "theory", body: `## Gözlem: döngünün gözleri

Bir döngü ancak **gözlemleri** doğru olduğu ölçüde ilerler. Düzeltmek için *neye doğru* düzelteceğini söyleyen bir sinyal gerekir:

- **exit code'lar** — komut başarısız oldu mu?
- **test çıktısı** — hangi test, hangi assertion, hangi satır?
- **on-chain durum** — çalıştırmadan sonra ledger gerçekte ne tutuyor?

Sinyaller, hisler değil. "Çıktı makul görünüyor" hiçbir şeyi düzeltmez, çünkü asla yanlış olamaz. Harness'e yerleştirdiğin her doğrulayıcı artık faiz getiriyor: döngüye bağlandığında, modelin dümen tuttuğu gözlere dönüşüyor — **her bir iterasyonda**.` },
    { kind: "quiz", question: `Hangi gözlem bir döngüyü gerçekten yönlendirebilir?`,
      options: [
        "Test runner'ın raporu: 3 geçti, 1 kaldı — refund_after_deadline, 41. satırdaki assertion",
        "Modelin kendi kapanış özeti: artık her şey doğru görünüyor",
        "Kodun ilk denemede derlenmiş olması — mantığın doğru olduğuna güçlü bir kanıt",
      ], answer: 0,
      explain: `Derlenmek tiplerin uyuştuğu anlamına gelir, davranışın istenen davranış olduğu anlamına değil — kendi özetiyse zihnin kendi ödevine not vermesidir. Yönlendirici bir sinyal dışarıdan gelmeli, spesifik olmalı ve kötü haber olabilmeli. "1 kaldı, 41. satır" bir başlıktır; "doğru görünüyor" hava durumudur.` },
    { kind: "theory", body: `## Tek bir tur, izlenmiş halde

Çevrimlere kafa sallamak kolay. İşte tek bir tur, kablodan gerçekte ne geçtiğiyle birlikte.

**Uygula.** Model \`refunds.rs\` dosyasını düzenler — deadline karşılaştırmasını \`>\` yerine \`>=\` yapar. Tek değişiklik, çünkü altı şeyi birden değiştiren bir tur hangisinin işe yaradığını söyleyemez.

**Gözle.** Harness sabit eval'leri çalıştırır ve tam olarak şunu geri verir:

> \`test_refund_after_deadline ... FAILED\`
> \`assertion failed: balance == 0, left: 40, right: 0\`
> \`4 passed, 3 failed\`

"Hâlâ bozuk" değil. Bir satır, bir sayı ve önceki turun sayısıyla karşılaştırılabilecek bir sayım.

**Düzelt.** Üç yeşil dört oldu. Demek ki karşılaştırma bug'lardan *biriydi* ama tek bug değildi: deadline halledildi, bakiye halledilmedi. Plan güncellenir — sonraki tur bakiyeye gider.

Bu turu değerli kılan şeye dikkat et. İlerlediğine model karar vermedi. **Sayım karar verdi.**` },
    { kind: "theory", body: `## Eval'ler: pusula

7. iterasyonun 6.'yı geçtiğini nereden bilirsin? Hisle değil. **Eval'ler** *sabit* bir kontrol kümesidir — test, lint, build, bir on-chain assertion — **her iterasyonda** çalıştırılır, böylece her deneme aynı cetvelle ölçülür.

Yükü taşıyan kelime *sabit*. Kontroller denemeden denemeye değişirse "ilerleme" ölçülemez hale gelir — farklı sınavların notlarını karşılaştırıyorsun demektir.

Pusulayla döngü, ilerleyip ilerlemediğini *kesin olarak* bilir: 7'de 4 yeşil, 7'de 6 oldu. Pusulasız, yalnızca hareket ettiğini bilir. İlerleme **hissedilmez, ölçülür**.` },
    { kind: "fill", prompt: `Pusulayı pusula yapan özelliği tamamla:`,
      file: "NOTES.md",
      before: `Eval'ler her iterasyonda çalışır ve kontrol kümesi `,
      after: ` kalmalıdır — yoksa iki deneme iki farklı sınavla notlanıyor demektir.`,
      choices: ["sabit", "rastgele", "isteğe bağlı", "her deneme için yeniden üretilmiş"], answer: 0,
      explain: `Hareket eden bir cetvel hiçbir şey ölçmez. "Model giderken kendi testlerini yazsın" fikrinin sinyali sessizce yok etmesinin sebebi de bu: sınav ile öğrenci ayrı şeyler olmaktan çıkar.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## Sınav yapıcının sınavı: bir gözlem sözleşmesi yaz

Bir döngü gerçek bir göreve yöneltilmek üzere:

> Bir Soroban kontratında hatalı bir davranış var: iadeler, deadline geçtikten **sonra** ödeniyor. Bunu bir agentic loop'a teslim edip bir süre gözetimsiz çalışmasına izin vereceksin.

Döngü tek bir tur dönmeden önce onun **gözlem sözleşmesini** yaz: bu döngü hangi sinyallerle dümen tutacak ve her birini güvenilir kılan ne? Yalnızca davranış — harness kodu yok, kütüphane adı yok.`,
      rubric: `1. En az iki somut, dış sinyal adlandırır (test çıktısı, exit code, on-chain durum, lint/build sonucu) — kendi kendini değerlendirme ya da "doğru görünüyor" değil.
2. En az bir sinyal için onu güvenilir kılan şeyi belirtir — deterministik, tekrarlanabilir ya da değiştirilen koddan bağımsız.
3. Neyin BİTTİ sayılacağını modelin görüşüyle değil, bu sinyallerle tanımlar.
4. Güvenilmemesi gereken en az bir sinyali ve nedenini adlandırır (kendi özeti, derlemenin başarılı olması, flaky bir test…).
5. Yalnızca davranış — harness implementasyonu yok, belirli bir araç ya da kütüphane şartı yok.`,
      minChars: 140 },
    { kind: "theory", body: `## Bu bölümün sana vermediği şey

Artık dürüstçe gören ve kendi ilerlemesini ölçen bir döngü kurabilirsin. Bir göreve yönelt, tırmanır.

Eksik olana dikkat et: buradaki hiçbir şey ne zaman **duracağına** karar vermiyor. Ne zaman bittiğine değil — o kısmı az önce yazdın — ne zaman *tıkandığına* ya da görevin değerinden fazlasını harcadığına. Gözleri iyi ama freni olmayan bir döngü gürültüyle başarısız olmaz. Faturada başarısız olur.

**Sırada:** frenler ve onların neden orada olduğunu anladığın o tek çalıştırma.` },
  ],
  testOut: [
    { question: `Tek atımlık prompt'a kıyasla bir agentic loop neyin yerini alır?`,
      options: ["Umudun — model artık kendi işinin sonucunu görür ve ona göre düzeltir","Spesifikasyon ihtiyacının, çünkü döngü gereksinimleri giderken keşfeder","Derleyicinin, çünkü döngü kodu kendisi kontrol eder"], answer: 0 },
    { question: `"Çıktı makul görünüyor" neden bir döngüyü asla yönlendiremez?`,
      options: ["Çünkü asla yanlış olamaz — kötü haber olamayan bir sinyal hiçbir bilgi taşımaz","Çünkü iterasyonda harekete geçilemeyecek kadar geç gelir","Çünkü modeller doğal dildeki yargıları değerlendirmek için eğitilmemiştir"], answer: 0 },
    { question: `Eval kümesi neden iterasyonlar arasında sabit kalmalıdır?`,
      options: ["Yoksa iki deneme iki farklı sınavla notlanır ve ilerleme ölçülemez hale gelir","Yoksa döngü her ek kontrolle yavaşlar","Yoksa model kontrolleri ezberler ve onları oyuna getirir"], answer: 0 },
    { question: `Bir döngü ilk denemede temiz derleniyor. Bu neyi kanıtlar?`,
      options: ["Tiplerin uyuştuğunu — davranışın istenen davranış olduğunu değil","Mantığın büyük ihtimalle doğru olduğunu, çünkü bug'ların çoğu tip hatasıdır","Hiçbir şeyi; derleme kod kalitesiyle ilgisizdir"], answer: 0 },
  ],
};
