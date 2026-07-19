// Lesson experience chrome: LessonSteps, LessonPlayer, lesson page.
export const lesson = {
  // lesson page (server)
  lessonNumber: "lección {number}",
  completedBadge: "completada",
  skirmishTag: "escaramuza · {act}",
  signIn: "inicia sesión",
  signInSuffix: "para ejecutar código y guardar tu progreso",
  comingSoon: "muy pronto",
  comingSoonBody:
    "El contenido interactivo de esta lección aún se está escribiendo. Prueba las lecciones anteriores en",
  comingSoonEnd: ".",

  // LessonSteps (step player)
  praise: ["¡Bien forjado!", "¡Eso es!", "Las runas aprueban.", "Impecable."],
  incorrect: "No exactamente — estudia la runa de nuevo.",
  skirmishComplete: "escaramuza completada",
  doneSignedIn:
    "El faro parpadea un poco más brillante. Tu progreso queda tallado en la Ledgerstone.",
  doneAnonymous:
    "El faro parpadea un poco más brillante — pero las runas no escritas se desvanecen. Crea una cuenta gratis para guardar tu progreso y reclamar tus cartas de campeón.",
  saveProgress: "Guardar mi progreso",
  nextSkirmish: "Siguiente escaramuza ›",
  backToAct: "Volver al acto",
  exitLesson: "Salir de la lección",
  stepProgress: "{current}/{total}",
  continueLabel: "Continuar",
  retry: "Reintentar",
  check: "Comprobar",

  // LessonPlayer (editor + output)
  signInToRun: "Inicia sesión para ejecutar tu código y guardar tu progreso.",
  genericError: "Algo salió mal.",
  networkError: "Error de red — intenta de nuevo.",
  reset: "reiniciar",
  run: "ejecutar ⌘⏎",
  running: "ejecutando…",
  loadingEditor: "cargando editor…",
  output: "salida",
  statusIdle: "inactivo",
  statusRunning: "ejecutando",
  statusPass: "pasó",
  statusFail: "falló",
  statusError: "error",
  idleHint: "// ejecuta tu código para comprobarlo contra las pruebas (⌘⏎)",
  compiling: "compilando…",
  stdout: "// stdout",
  compilerError: "// error de compilación",
  actualOutput: "// tu salida",
  details: "// detalles",
  mentorAsk: "pedir consejo al mentor",
  mentorThinking: "el mentor reflexiona…",
  mentorTitle: "// consejo del mentor",
  mentorRemaining: "{n} pistas restantes para esta lección hoy",
  mentorLimit:
    "el mentor descansa — usaste las pistas de hoy para esta lección. Quedan las pistas del pergamino:",
  mentorUnavailable:
    "el mentor está lejos de la fragua — las pistas del pergamino pueden ayudar:",
  goldCoinAlt: "Moneda de oro",
  goldEarned: "+{gold} de oro",
  goldFirstReveal:
    "una bolsa oculta se revela en tu cinturón — tu oro ahora se muestra en el encabezado y en tu perfil",
  goldPouch: "bolsa: {total} de oro",
  passedSaved: "todas las comprobaciones pasaron — progreso guardado",
  passed: "todas las comprobaciones pasaron",
  continueStep: "continuar ›",
  nextLesson: "siguiente lección ›",
};
