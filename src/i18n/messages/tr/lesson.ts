// Lesson experience chrome: LessonSteps, LessonPlayer, lesson page.
export const lesson = {
  // lesson page (server)
  lessonNumber: "ders {number}",
  completedBadge: "tamamlandı",
  skirmishTag: "ders · {act}",
  signIn: "giriş yap",
  signInSuffix: "kod çalıştırmak ve ilerlemeni kaydetmek için",
  comingSoon: "çok yakında",
  comingSoonBody:
    "Bu dersin etkileşimli içeriği hâlâ yazılıyor. Önceki dersleri şurada dene:",
  comingSoonEnd: ".",

  // LessonSteps (step player)
  praise: ["Güzel iş.", "İşte bu.", "Doğru.", "Tertemiz."],
  incorrect: "Tam değil — o kısmı bir daha oku.",
  skirmishComplete: "ders tamamlandı",
  doneSignedIn:
    "İlerleme hesabına kaydedildi.",
  doneAnonymous:
    "Burada henüz hiçbir şey kaydedilmiyor. İlerlemeni saklamak ve bölüm kartlarını toplamak için ücretsiz bir hesap oluştur.",
  saveProgress: "İlerlememi kaydet",
  nextSkirmish: "Sonraki ders ›",
  backToAct: "Bölüme dön",
  exitLesson: "Dersten çık",
  previousStep: "Önceki adım",
  nextStep: "Sonraki adım",
  stepProgress: "{current}/{total}",
  continueLabel: "Devam et",
  retry: "Tekrar dene",
  check: "Kontrol et",

  // LessonPlayer (editor + output)
  signInToRun: "Kodunu çalıştırmak ve ilerlemeni kaydetmek için giriş yap.",
  genericError: "Bir şeyler ters gitti.",
  networkError: "Ağ hatası — tekrar dene.",
  reset: "sıfırla",
  run: "çalıştır ⌘⏎",
  running: "çalışıyor…",
  loadingEditor: "editör yükleniyor…",
  output: "çıktı",
  statusIdle: "boşta",
  statusRunning: "çalışıyor",
  statusPass: "geçti",
  statusFail: "kaldı",
  statusError: "hata",
  idleHint: "// kodunu testlere karşı denemek için çalıştır (⌘⏎)",
  compiling: "derleniyor…",
  stdout: "// stdout",
  compilerError: "// derleyici hatası",
  actualOutput: "// senin çıktın",
  details: "// ayrıntılar",
  mentorAsk: "mentora sor",
  mentorThinking: "mentor düşünüyor…",
  mentorTitle: "// mentorun öğüdü",
  mentorRemaining: "bu ders için bugün {n} ipucu hakkın kaldı",
  mentorLimit:
    "mentor dinleniyor — bu ders için bugünkü ipuçlarını kullandın. Parşömenin kendi ipuçları hâlâ elinde:",
  mentorUnavailable:
    "mentora ulaşılamıyor — şu ipuçları yardımcı olabilir:",
  goldCoinAlt: "Altın sikke",
  goldEarned: "+{gold} altın",
  goldFirstReveal:
    "kemerinde gizli bir kese beliriyor — altının artık üst çubukta ve profilinde görünüyor",
  goldPouch: "kese: {total} altın",
  passedSaved: "tüm kontroller geçti — ilerleme kaydedildi",
  passed: "tüm kontroller geçti",
  continueStep: "devam et ›",
  nextLesson: "sonraki ders ›",
};
