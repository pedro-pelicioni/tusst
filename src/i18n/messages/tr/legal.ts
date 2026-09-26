// ../en/legal.ts dosyasının Türkçe çevirisidir; tek doğruluk kaynağı İngilizce dosyadır.
export const legal = {
  privacy: {
    metaTitle: "Gizlilik Politikası — TUSST",
    metaDescription:
      "TUSST platformunun hangi kişisel verileri neden topladığı, bunları kimlerin aldığı ve haklarını nasıl kullanabileceğin.",
    kicker: "yasal",
    title: "Gizlilik Politikası",
    updated: "Son güncelleme: {date}",
    body: `TUSST, tusst.xyz adresinden erişilebilen, Rust ve Stellar ağı için ücretsiz ve açık kaynaklı bir öğrenme platformudur. Bu politika, platformu kullandığında hangi kişisel verileri topladığımızı, bunları neden topladığımızı, kimlerin aldığını ve haklarının neler olduğunu açıklar.

## Sorumlu kim

TUSST platformunun bakımı, Brezilya'da Pedro Pelicioni tarafından yapılır. Kişisel verilerinin veri sorumlusu odur; gizlilikle ilgili her türlü soru ya da talebin için başvuracağın kişi de odur (Brezilya LGPD'si kapsamındaki "encarregado", yani veri koruma sorumlusu): [pedro@vants.xyz](mailto:pedro@vants.xyz).

## Neleri topluyoruz

- **Hesabın.** GitHub ya da Discord ile giriş yaptığında görünen adını (belirlemediysen kullanıcı adını), o sağlayıcıdaki birincil e-posta adresini (GitHub'da gizli olsa bile) ve oradaki hesabının sayısal kimliğini saklarız. Profil fotoğrafını ya da diğer profil bilgilerini saklamayız. Giriş kütüphanesi, ilk girişinde sağlayıcının verdiği token'ları da saklar (Discord için buna bir yenileme token'ı da dahildir). Bu token'lar yalnızca profilini ve e-posta adresini okumaya izin verir ve onları GitHub ya da Discord hesabına erişmek için asla kullanmayız.
- **İlerlemen.** Tamamladığın dersler, Yolculuk bölümleri ve lab'lar ile bunları ne zaman tamamladığın, her birinin kazandırdığı deneyim puanları (XP) ve seviyen, seçtiğin kahraman, oyun içi altının, Cephanelik'ten satın aldığın eşyalar ile bunlar için ne ödediğin ve tercih ettiğin dil.
- **Gönderdiğin kod.** Bir dersin kodunu çalıştırdığında kodu, notlandırma sonuçlarını ve programın çıktısını tarih ve saatiyle birlikte saklarız. Bu sayede ilerlemen korunur ve bozuk ya da fazla zor dersleri düzeltebiliriz.
- **Mentor ve sınav yapıcı geri bildirimleri.** Yapay zekâ mentorundan ipucu istediğinde ya da Yolculuk sınav yapıcısına bir spec gönderdiğinde, onun sana yanıt olarak yazdığı metni (kodundan alıntılar içerebilir), bu metni yazan modeli, kullandığın dili, metnin ilgili olduğu dersi (varsa) ve ne zaman yazıldığını saklarız. Ona gönderdiğin Forge dosyalarını ya da spec'i saklamayız.
- **Lab kanıtları.** Bir lab'ın ödülünü aldığında, bu işlemle ilgili herkese açık Stellar testnet adresini, kontrat id'sini ve işlem hash'lerini saklarız.
- **Kullanım istatistikleri.** Vercel Web Analytics kullanırız; bu hizmet ziyaret ettiğin sayfaları, geldiğin siteyi, ülkeni, tarayıcını, işletim sistemini, cihaz türünü ve birkaç arayüz olayını (örneğin hangi giriş düğmesine tıklandığını ya da hangi kahramanı seçtiğini) kaydeder. Çerez kullanmaz ve hesabınla ilişkilendirilmez; ziyaretçiler, IP adresinden ve tarayıcıdan türetilen ve her gün değişen bir hash ile sayılır.
- **Teknik veriler.** Her web sitesinde olduğu gibi, barındırma sağlayıcımız (Vercel) ve kod çalıştırma sunucumuz (DigitalOcean), siteyi sunmak ve güvende tutmak için her istekle birlikte IP adresini ve temel tarayıcı bilgilerini alır. Kod çalıştırma sunucusu ayrıca her ziyaretçinin kaç build, test ve denetim başlatabileceğini sınırlamak için IP adresini kullanır; IP adresin yalnızca o sunucunun belleğinde tutulur ve veritabanımıza asla yazılmaz.

Giriş yapmak için bir GitHub ya da Discord hesabına ihtiyacın var. Giriş yapmadan da dersleri okuyabilir, ilk dersi çalıştırabilir ve Forge'u kullanabilirsin: bu şekilde çalıştırdığın kod notlandırılmak ya da build edilmek üzere kod çalıştırma sunucumuza gönderilir, saklanmaz ve hiç kimseyle ilişkilendirilmez. İlerlemen kaydedilmez; mentor ve sınav yapıcı da kullanılamaz.

## Tarayıcında kalanlar

Bazı veriler yalnızca cihazındaki tarayıcı depolamasında tutulur ve bunların hiçbir kopyasını saklamayız: gönderilmemiş ders kodu taslakların ve Yolculuk spec'lerin, Forge IDE projelerin, deploy geçmişin ve yerleşim düzenin, ödülünü almadan önceki lab ilerlemen, passkey lab'ında oluşturulan passkey cüzdanı verileri (passkey'in kendisi cihazında ya da şifre yöneticinde tutulur), haritalardaki konumun, öğretici ve müzik ayarların ve lab'larda ya da Forge'da oluşturduğun veya içe aktardığın herhangi bir testnet cüzdanının gizli anahtarı. Bu anahtarı asla almayız.

Bu verilerin bir kısmı bize yalnızca onlara ihtiyaç duyan bir özelliği kullandığında gönderilir: ders kodun, onu çalıştırdığında; Forge ya da lab proje dosyaların, onları her build ettiğinde, test ettiğinde ya da denetlediğinde (kod çalıştırma sunucumuza gider ve çalıştırma bittiğinde silinir); Forge dosyaların ve konsol çıktın, mentordan yardım istediğinde; adres ve işlem hash'leri ise bir lab'ın ödülünü aldığında. Tarayıcının site verilerini temizlemek, yalnızca tarayıcında saklanan her şeyi siler.

## Çerezler

Yalnızca sitenin çalışması için gereken çerezleri kullanırız: giriş oturumu çerezi (şifrelidir; adını, e-posta adresini ve hesap kimliğini içerir ve 30 gün boyunca kullanılmazsa süresi dolar), giriş adımını koruyan kısa ömürlü çerezler ve dilini bir yıl boyunca hatırlayan bir çerez. Karşılama (onboarding) sürecindeki bir soruya verdiğin yanıtı kaydeden eski bir çerez, tarayıcında varsa hâlâ okunur, ancak artık oluşturulmaz. Reklam çerezleri ya da siteler arası takip çerezleri kullanmayız; bu yüzden çerez bildirimi (banner) yoktur.

## Verilerini nasıl kullanıyoruz

- TUSST platformunu işletmek: girişini sağlamak, ilerlemeni kaydetmek, kodunu notlandırmak ve XP, altın ve eşya vermek.
- İstediğin mentor ipuçlarını üretmek ve Yolculuk alıştırmalarında gönderdiğin spec'leri bir yapay zekâ sınav yapıcısına bölümün rubriğine göre kontrol ettirmek. O alıştırmanın XP'sini kazanıp kazanmadığını sınav yapıcının kararı tek başına belirler; bir kararın yeniden incelenmesini ve kullanılan ölçütlerin açıklanmasını bizden isteyebilirsin (bkz. "Hakların").
- Destek taleplerini yanıtlamak ve dersleri düzeltmek; buna derslere gönderilen denemeleri incelemek de dahildir.
- Hileyi, kötüye kullanımı ve aşırı yüklenmeyi önleyerek platformu güvenli ve adil tutmak.
- Platformun nasıl kullanıldığını toplu olarak anlamak ve dersleri iyileştirmek.

Verilerini satmayız, reklam göstermeyiz ve pazarlama e-postaları göndermeyiz.

## Hukuki dayanaklar

Verilerini, kullandığın ya da kaydolduğun hizmeti sunmak için işleriz (LGPD art. 7, V; GDPR art. 6(1)(b)). Güvenlik, kötüye kullanımın önlenmesi ve istek sınırlaması, destek, gönderilen denemelere dayanarak derslerin düzeltilmesi ve toplu istatistikler için, güvenli ve faydalı, ücretsiz bir platform işletme konusundaki meşru menfaatimize dayanırız (LGPD art. 7, IX; GDPR art. 6(1)(f)).

## Verilerini kimler alıyor

- **Vercel**: siteyi barındırır ve kullanım istatistiklerini sağlar.
- **Neon**: veritabanımızı barındırır.
- **DigitalOcean**: kodunu yalıtılmış sandbox'larda derleyip çalıştıran kod çalıştırma sunucumuzu (forge.tusst.xyz, Amerika Birleşik Devletleri'nde) barındırır. Ders kodu bu sunucuya sitemiz üzerinden ulaşır; Forge ve lab build'leri ise ona doğrudan tarayıcından gönderilir, bu yüzden sunucu IP adresini de görür. Oraya gönderilen kod, çalıştırma biter bitmez silinir ve hesabınla ilişkilendirilmez.
- **Groq** (yapay zekâ modeli sağlayıcısı): mentordan ipucu istediğinde, son başarısız denemene ait kodu, başarısız kontrollerin adlarını ve derleyici ya da program çıktısını veya Forge projenin en fazla altı dosyasını ve projenin konsol çıktısını alır. Yolculuk sınav yapıcısına bir spec gönderdiğinde o spec'i alır. Ona hangi dilde yanıt vermesi gerektiği de bildirilir. Adını, e-posta adresini, hesap kimliğini ya da IP adresini asla almaz.
- **Raven (raven.stellar.buzz)**: bir Stellar dokümantasyon arama hizmeti. Bazı mentor ipuçlarını kaynaklara dayandırmak için sunucumuz ona bir ders başlığı ya da bir hatanın ilk satırı gibi kısa bir sorgu gönderebilir.
- **GitHub ve Discord**: giriş için onları seçtiğinde kimliğini bize doğrularlar. Verilerini bizim adımıza değil, kendi gizlilik politikaları çerçevesinde işlerler.
- **Stellar Development Foundation (SDF)**: lab'lar ve Forge, tarayıcından doğrudan SDF'nin herkese açık testnet sunucularına (Horizon, RPC ve Friendbot) bağlanır; bu sunucular IP adresini ve testnet adresini görür. Bir lab'ın ödülünü aldığında sunucumuz, çalışmanı kontrol etmek için testnet adresini bu sunucularda sorgular. Yaptığın işlemler, ilgili adresler ve deploy ettiğin her kontrat (derlenmiş kodu dahil), belirli aralıklarla sıfırlanan Stellar testnet'inde tasarımı gereği herkese açıktır. Sakladığımız adres, bu herkese açık etkinliği TUSST hesabınla ilişkilendirir.

## Tarayıcının doğrudan bağlandığı hizmetler

Bazı özellikler, tarayıcının doğrudan başka hizmetlere bağlanmasına neden olur. Bu hizmetler, kendi gizlilik politikaları çerçevesinde IP adresini ve neyin talep edildiğini görür:

- **jsDelivr**: derslerde ve Forge'da kullanılan kod editörünü sunar.
- **GitHub**: Forge'a herkese açık bir repo içe aktardığında.
- **Forge cüzdan menüsünde seçtiğin cüzdan** (örneğin Freighter ya da Albedo) ve bu menüdeki simgeleri sunan Creit Tech (stellar.creit.tech).

## Uluslararası aktarımlar

Bu hizmetlerin çoğu, başta Amerika Birleşik Devletleri olmak üzere, Brezilya ve Avrupa Birliği dışında bulunur. Verileri onlara, talep ettiğin hizmeti sunmak için gerekli olduğu için aktarırız (LGPD art. 33, IX). Bir sağlayıcı bunları sunuyorsa onun veri işleme koşullarına, standart sözleşme hükümlerine ya da EU–U.S. Data Privacy Framework kapsamındaki sertifikasına da dayanırız. Her sağlayıcı için hangi güvencenin geçerli olduğunu öğrenmek ya da bir kopyasını almak için bize yaz.

## Ne kadar süre saklıyoruz

Hesap verilerini, ilerlemeni, gönderdiğin kodu ve mentor ile sınav yapıcı geri bildirimlerini hesabın var olduğu sürece saklarız. Kod çalıştırma sunucumuz IP adreslerini yalnızca bellekte ve sunucu yeniden başlayana kadar tutar; diğer teknik veriler yalnızca barındırma sağlayıcılarımız istek kayıtlarını (log) sakladığı süre boyunca tutulur. Giriş çerezinin süresi 30 gün boyunca kullanılmadığında, dil çerezinin süresi ise bir yıl sonra dolar. Hesabının silinmesini istediğinde, hesabını ve ilişkili tüm verileri 30 gün içinde sileriz; veritabanı sağlayıcımızın kısa süreli yedeklerindeki kopyalar, bu yedeklerin süresi dolduğunda ortadan kalkar. Stellar testnet'inde herkese açık olanlar bizim kontrolümüz dışındadır.

## Hakların

Bizden verilerini işleyip işlemediğimizi teyit etmemizi; verilerine erişim sağlamamızı, verilerini düzeltmemizi, dışa aktarmamızı ya da silmemizi; gereksiz, aşırı ya da hukuka aykırı biçimde işlenen verileri anonim hâle getirmemizi, engellememizi ya da kısıtlamamızı; verilerini kimlerle paylaştığımızı sana bildirmemizi talep edebilir, meşru menfaate dayanan işlemeye itiraz edebilir ve Yolculuk sınav yapıcısının kararı gibi otomatik bir kararın yeniden incelenmesini isteyebilirsin. Hesabına bağlı e-posta adresinden [pedro@vants.xyz](mailto:pedro@vants.xyz) adresine yaz; 15 gün içinde yanıt veririz. Ayrıca Brezilya'nın veri koruma otoritesine (ANPD) ya da kendi ülkendeki otoriteye şikâyette bulunabilirsin.

## Çocuklar

TUSST, 13 yaşından küçük çocuklara yönelik değildir ve onların hesap oluşturmasına bilerek izin vermeyiz. 18 yaşından küçüksen TUSST platformunu bir ebeveynin ya da vasinin bilgisi dahilinde kullan. 13 yaşından küçük bir çocuğun hesabı olduğunu düşünüyorsan bize yaz, hesabı sileriz.

## Güvenlik

Trafik şifrelenir (HTTPS), kodun ağ erişimi olmayan yalıtılmış sandbox'larda çalışır ve üretim sistemlerine erişim yalnızca projenin bakımını yapan kişiyle sınırlıdır. Hiçbir sistem kusursuz biçimde güvenli değildir: verilerini etkileyen bir güvenlik olayından haberdar olursak, yasanın gerektirdiği şekilde seni ve yetkili otoriteyi bilgilendiririz.

## Bu politikadaki değişiklikler

Uygulamalarımız değiştiğinde bu sayfayı günceller ve en üstteki tarihi yenileriz. Önemli değişiklikler ayrıca sitede duyurulur.`,
  },
};
