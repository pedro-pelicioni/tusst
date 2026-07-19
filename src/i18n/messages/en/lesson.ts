// Lesson experience chrome: LessonSteps, LessonPlayer, lesson page.
export const lesson = {
  // lesson page (server)
  lessonNumber: "lesson {number}",
  completedBadge: "completed",
  skirmishTag: "skirmish · {act}",
  signIn: "sign in",
  signInSuffix: "to run code and save progress",
  comingSoon: "coming soon",
  comingSoonBody:
    "This lesson's interactive content is still being written. Try the earlier lessons in",
  comingSoonEnd: ".",

  // LessonSteps (step player)
  praise: ["Well forged!", "That's it!", "The runes approve.", "Flawless."],
  incorrect: "Not quite — study the rune again.",
  skirmishComplete: "skirmish complete",
  doneSignedIn:
    "The beacon flickers a little brighter. Your progress is carved into the Ledgerstone.",
  doneAnonymous:
    "The beacon flickers a little brighter — but unwritten runes fade. Create a free account to save your progress and claim your champion cards.",
  saveProgress: "Save my progress",
  nextSkirmish: "Next skirmish ›",
  backToAct: "Back to the act",
  exitLesson: "Exit lesson",
  stepProgress: "{current}/{total}",
  continueLabel: "Continue",
  retry: "Retry",
  check: "Check",

  // LessonPlayer (editor + output)
  signInToRun: "Sign in to run your code and save progress.",
  genericError: "Something went wrong.",
  networkError: "Network error — try again.",
  reset: "reset",
  run: "run ⌘⏎",
  running: "running…",
  loadingEditor: "loading editor…",
  output: "output",
  statusIdle: "idle",
  statusRunning: "running",
  statusPass: "pass",
  statusFail: "fail",
  statusError: "error",
  idleHint: "// run your code to check it against the tests (⌘⏎)",
  compiling: "compiling…",
  stdout: "// stdout",
  compilerError: "// compiler error",
  actualOutput: "// your output",
  details: "// details",
  goldCoinAlt: "Gold coin",
  goldEarned: "+{gold} gold",
  goldFirstReveal:
    "a hidden pouch reveals itself at your belt — your gold now shows in the header and on your profile",
  goldPouch: "pouch: {total} gold",
  passedSaved: "all checks passed — progress saved",
  passed: "all checks passed",
  continueStep: "continue ›",
  nextLesson: "next lesson ›",
};
