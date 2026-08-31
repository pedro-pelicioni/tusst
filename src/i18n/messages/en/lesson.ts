// Lesson experience chrome: LessonSteps, LessonPlayer, lesson page.
export const lesson = {
  // lesson page (server)
  lessonNumber: "lesson {number}",
  completedBadge: "completed",
  skirmishTag: "lesson · {act}",
  signIn: "sign in",
  signInSuffix: "to run code and save progress",
  comingSoon: "coming soon",
  comingSoonBody:
    "This lesson's interactive content is still being written. Try the earlier lessons in",
  comingSoonEnd: ".",

  // LessonSteps (step player)
  praise: ["Nicely done.", "That's it.", "Correct.", "Clean."],
  incorrect: "Not quite — read that part again.",
  skirmishComplete: "lesson complete",
  doneSignedIn:
    "Progress saved to your account.",
  doneAnonymous:
    "Nothing here is saved yet. Create a free account to keep your progress and collect the section cards.",
  saveProgress: "Save my progress",
  nextSkirmish: "Next lesson ›",
  backToAct: "Back to the section",
  exitLesson: "Exit lesson",
  previousStep: "Previous step",
  nextStep: "Next step",
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
  mentorAsk: "ask the mentor",
  mentorThinking: "the mentor ponders…",
  mentorTitle: "// mentor's counsel",
  mentorRemaining: "{n} hints left for this lesson today",
  mentorLimit:
    "the mentor rests — you've used today's hints for this lesson. The scroll's own hints remain:",
  mentorUnavailable:
    "the mentor is unavailable — these hints may help:",
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
