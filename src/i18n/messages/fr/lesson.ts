// Lesson experience chrome: LessonSteps, LessonPlayer, lesson page.
export const lesson = {
  // lesson page (server)
  lessonNumber: "leçon {number}",
  completedBadge: "terminée",
  skirmishTag: "escarmouche · {act}",
  signIn: "connecte-toi",
  signInSuffix: "pour exécuter du code et sauvegarder ta progression",
  comingSoon: "bientôt disponible",
  comingSoonBody:
    "Le contenu interactif de cette leçon est encore en cours d'écriture. Essaie les leçons précédentes dans",
  comingSoonEnd: ".",

  // LessonSteps (step player)
  praise: ["Bien forgé !", "C'est ça !", "Les runes approuvent.", "Sans faute."],
  incorrect: "Pas tout à fait — étudie la rune encore une fois.",
  skirmishComplete: "escarmouche terminée",
  doneSignedIn:
    "Le phare brille un peu plus fort. Ta progression est gravée dans la Ledgerstone.",
  doneAnonymous:
    "Le phare brille un peu plus fort — mais les runes non écrites s'effacent. Crée un compte gratuit pour sauvegarder ta progression et réclamer tes cartes de champion.",
  saveProgress: "Sauvegarder ma progression",
  nextSkirmish: "Escarmouche suivante ›",
  backToAct: "Retour à l'acte",
  exitLesson: "Quitter la leçon",
  stepProgress: "{current}/{total}",
  continueLabel: "Continuer",
  retry: "Réessayer",
  check: "Vérifier",

  // LessonPlayer (editor + output)
  signInToRun: "Connecte-toi pour exécuter ton code et sauvegarder ta progression.",
  genericError: "Quelque chose a mal tourné.",
  networkError: "Erreur réseau — réessaie.",
  reset: "réinitialiser",
  run: "exécuter ⌘⏎",
  running: "exécution…",
  loadingEditor: "chargement de l'éditeur…",
  output: "sortie",
  statusIdle: "inactif",
  statusRunning: "exécution",
  statusPass: "réussi",
  statusFail: "échec",
  statusError: "erreur",
  idleHint: "// exécute ton code pour le confronter aux tests (⌘⏎)",
  compiling: "compilation…",
  stdout: "// stdout",
  compilerError: "// erreur de compilation",
  actualOutput: "// ta sortie",
  details: "// détails",
  mentorAsk: "demander conseil au mentor",
  mentorThinking: "le mentor réfléchit…",
  mentorTitle: "// conseil du mentor",
  mentorRemaining: "{n} indices restants pour cette leçon aujourd'hui",
  mentorLimit:
    "le mentor se repose — tu as utilisé les indices du jour pour cette leçon. Restent les indices du parchemin :",
  mentorUnavailable:
    "le mentor est loin de la forge — les indices du parchemin peuvent aider :",
  goldCoinAlt: "Pièce d'or",
  goldEarned: "+{gold} or",
  goldFirstReveal:
    "une bourse cachée se révèle à ta ceinture — ton or s'affiche désormais dans l'en-tête et sur ton profil",
  goldPouch: "bourse : {total} or",
  passedSaved: "toutes les vérifications sont passées — progression sauvegardée",
  passed: "toutes les vérifications sont passées",
  continueStep: "continuer ›",
  nextLesson: "leçon suivante ›",
};
