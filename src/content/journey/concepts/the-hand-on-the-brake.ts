import type { Concept } from "../types";

// Craft IX — the brakes, split out of The Endless Loop. The widget is the
// payload: on a healthy run the brakes change nothing, which is exactly why
// people leave them out, and exactly why the run where the feedback lies is
// the one that decides whether this chapter was worth reading.

export const theHandOnTheBrake: Concept = {
  meta: {
    slug: "the-hand-on-the-brake",
    title: "The Hand on the Brake",
    tagline: "Agentic loops & guardrails: without a stopping rule it is not autonomy, it is a bill.",
    numeral: "XII",
    arc: "craft",
    level: 2,
    requires: ["the-endless-loop"],
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/the-hand-on-the-brake.webp",
    glyph: "🛑",
  },
  steps: [
    {
      kind: "theory",
      body: `## Every loop needs a brake

An unwatched loop doesn't converge — it **spends**. A loop without a stop is a bill, and occasionally an outage. Fit the brakes *before* the first turn:

- **Success criteria** — the checks that mean *done*, decided up front.
- **Budget** — tokens, minutes, dollars: whichever runs out first.
- **Max iterations** — a hard ceiling, always.
- **No-progress detection** — the same error twice means *change strategy or escalate*, never "again, but harder."

The rule of the realm: never start a loop you haven't decided how to stop.`,
    },
    {
      kind: "widget",
      component: "loop-brake",
      body: `Two switches, four runs. **Turn the loop** with the brakes on and the feedback honest, then take one thing away at a time and watch which removal you get away with.`,
    },
    {
      kind: "theory",
      body: `## What it costs when nothing stops it

The bill is the visible part, and it is the smaller one.

An unbraked loop that spent the night on a lying test does not hand you back nothing. It hands you a branch: forty commits, most of them edits to code that was never broken, each one plausible on its own, every one made to satisfy a red that was never real. The evals are still not green — so nothing in that branch tells you where the real work stopped and the superstition started.

The cheapest way forward is now to throw the whole night away and start again with the flake fixed. Which is exactly what the no-progress brake would have told you at iteration four, for the price of four iterations.

That is the shape of it: **the brake does not save you money on the good runs. It saves you the archaeology on the bad ones.**`,
    },
    {
      kind: "quiz",
      question: `Iteration 40, and the loop has been hitting the same failing eval with the same error message since iteration 12. What should the harness do?`,
      options: [
        "Stop and escalate to a human — repeating without progress is a stop condition, not persistence",
        "Keep going — iteration is the whole point of a loop, and attempt 41 might be the one",
        "Raise the model's temperature so it gets more creative about the fix",
      ],
      answer: 0,
      explain: `Twenty-eight identical failures are a message: the loop lacks something — context, a permission, a correct spec — that more iterations cannot supply. Randomizing harder buys scattered wrongness at the same price. Detect no-progress, stop, and hand a human the trail.`,
    },
    {
      kind: "fill",
      prompt: `Fit the brake before the loop turns:`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: ["budget.max_iterations", "usize::MAX", "evals.len()", "iterations + 1"],
      answer: 0,
      explain: `usize::MAX is "no brake — we'll discuss it on the invoice." A bound that moves with the counter (iterations + 1) never binds at all. And evals.len() confuses how many checks exist with how long to keep trying. The ceiling is a budget you chose on purpose.`,
    },
    {
      kind: "theory",
      body: `## Flaky feedback poisons the loop

A test that fails randomly — timing, ordering, a shared port — is an annoyance for humans. We sigh and re-run. For a loop it is **poison**, because the loop *acts on every signal*.

A phantom red arrives → the golem "fixes" code that was never broken → the change lands → next iteration, a new phantom → another fix. The loop is now learning superstitions, each one compounding, all from noise.

The rule: **make feedback deterministic before wiring it into a loop.** A flaky trial is worse than no trial — silence misleads no one; noise misleads tirelessly.`,
    },
    {
      kind: "quiz",
      question: `A test fails randomly one run in five, for timing reasons. For a human it's a nuisance. What is it for a loop?`,
      options: [
        "Poison — the loop treats every phantom failure as truth and 'fixes' healthy code, compounding wrongness each pass",
        "The same nuisance — over many iterations the randomness averages itself out",
        "Mildly useful — extra failures apply extra pressure to make the code more robust",
      ],
      answer: 0,
      explain: `Nothing averages out, because each false signal triggers a real code change that the next iteration then builds on. Humans discount noise; loops obediently act on it. Determinism isn't a nicety of the harness — it's a precondition for looping at all.`,
    },
    {
      kind: "diagram",
      body: "The same task, run twice:",
      caption:
        "On the good day the brakes are invisible. That is the whole reason they get left out.",
      view: {
        kind: "compare",
        columns: [
          { id: "braked", label: "with brakes", tone: "good" },
          { id: "loose", label: "without", tone: "bad" },
        ],
        rows: [
          {
            label: "feedback honest",
            cells: [
              { text: "converges; brakes never fire", tone: "good" },
              { text: "converges; identical outcome", tone: "neutral" },
            ],
          },
          {
            label: "feedback lies",
            cells: [
              { text: "stops in three turns, escalates", tone: "good" },
              { text: "runs to the ceiling that isn't there", tone: "bad" },
            ],
          },
          {
            label: "what you pay",
            cells: [
              { text: "a bounded, known amount", tone: "good" },
              { text: "whatever it took, found out afterwards", tone: "bad" },
            ],
          },
          {
            label: "damage to the code",
            cells: [
              { text: "caught early, few phantom fixes", tone: "good" },
              { text: "edits to code that was never broken", tone: "bad" },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## The right altitude

Where does the human stand while the loop turns? Not inside it — reviewing every keystroke means *you* are the loop, at golem tempo. And not above the clouds either, rubber-stamping whatever lands.

The right altitude is the **boundary**: review the *diff* against the *spec*. Did the evals pass? Does the change honor Chapter I's rules? Did anything move that had no business moving? Trust the loop's instruments for the small stuff; keep human judgment for what the instruments can't see.

**Next:** when one loop isn't enough — many small golems, one woven plan.`,
    },
  ],
  testOut: [
    {
      question: `A loop has been failing the same eval with the same error for twenty-eight iterations. What does the harness owe you?`,
      options: [
        "A stop and an escalation — repeating without progress is a stop condition, not persistence",
        "More iterations, since the next attempt is as likely as any to succeed",
        "A higher temperature, so the model varies its approach",
      ],
      answer: 0,
    },
    {
      question: `Why is a flaky test worse for a loop than for a human?`,
      options: [
        "The loop acts on every signal, so a phantom red becomes a real edit to healthy code",
        "The loop runs the suite more often, so it hits the flake more often",
        "It is the same problem; loops just surface it sooner",
      ],
      answer: 0,
    },
    {
      question: `On a run where the feedback is honest, what do the brakes change?`,
      options: [
        "Nothing at all — which is exactly why they get left out, and why that is a mistake",
        "They cut the number of iterations needed roughly in half",
        "They improve the final quality by forcing earlier convergence",
      ],
      answer: 0,
    },
    {
      question: `Where should the human stand while a loop runs?`,
      options: [
        "At the boundary — reviewing the diff against the spec, not every keystroke and not nothing",
        "Inside the loop, checking each action before it is taken",
        "Entirely outside it; a loop you supervise is not autonomous",
      ],
      answer: 0,
    },
  ],
};
