import type { Concept } from "../types";

// Chapter VII (craft) — agentic loops: act, observe, correct. Observation as
// the loop's ceiling, stopping conditions as the brake, evals as the compass,
// flaky feedback as poison, and the human standing at the right altitude —
// reviewing diffs against specs, not keystrokes.

export const theEndlessLoop: Concept = {
  meta: {
    slug: "the-endless-loop",
    title: "The Endless Loop",
    tagline: "Agentic loops: act, observe, correct — and know when to stop.",
    numeral: "VII",
    arc: "craft",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-endless-loop.webp",
    glyph: "🔁",
  },
  steps: [
    {
      kind: "theory",
      body: `## From wish to loop

One-shot prompting is a wish: describe, receive, hope. The **agentic loop** replaces hope with a cycle:

> **act → observe → correct → act again**

The golem writes code, *runs* it, reads the compiler's complaint, fixes, runs again — the way you work, at machine tempo. One-shot quality stopped being the interesting number the moment the golem could see its own results.

But a loop is machinery, not magic. It has parts that can be engineered well or badly — and each of the next screens is one of those parts.`,
    },
    {
      kind: "theory",
      body: `## Observation: the loop's eyes

A loop improves only as far as its **observations** are true. Correction needs a signal to correct *toward*:

- **exit codes** — did the command fail?
- **test output** — which trial, which assertion, which line?
- **on-chain state** — what does the ledger actually hold after the run?

Signals, not vibes. "The output looks reasonable" corrects nothing, because it can never be false. Every verifier you built into the harness now earns interest: wired into the loop, it becomes the eyes the golem steers by — **on every single iteration**.`,
    },
    {
      kind: "quiz",
      question: `Which observation can actually steer a loop?`,
      options: [
        "The test runner's report: 3 passed, 1 failed — refund_after_deadline, assertion at line 41",
        "The golem's own closing summary: everything looks correct now",
        "The fact that the code compiled on the first try — strong evidence the logic is right",
      ],
      answer: 0,
      explain: `Compiling means the types line up, not that the behavior is wanted — and a self-summary is the mind grading its own homework. A steering signal must be external, specific, and capable of being bad news. "1 failed, line 41" is a heading; "looks correct" is weather.`,
    },
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
      body: `## Evals: the compass

How do you know iteration 7 beat iteration 6? Not by feel. **Evals** are a *fixed* set of checks — tests, lint, build, an on-chain assertion — run **every iteration**, so every attempt is measured against the same yardstick.

*Fixed* is the load-bearing word. If the checks shift between attempts, "progress" becomes unmeasurable — you're comparing scores from different exams.

With a compass, the loop knows *for a fact* whether it moved: 4 green out of 7 became 6 out of 7. Without one, it only knows that it moved. Progress is **measured, not felt**.`,
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
      kind: "theory",
      body: `## The right altitude

Where does the human stand while the loop turns? Not inside it — reviewing every keystroke means *you* are the loop, at golem tempo. And not above the clouds either, rubber-stamping whatever lands.

The right altitude is the **boundary**: review the *diff* against the *spec*. Did the evals pass? Does the change honor Chapter I's rules? Did anything move that had no business moving? Trust the loop's instruments for the small stuff; keep human judgment for what the instruments can't see.

Next discipline: when one loop isn't enough — many small golems, one woven plan.`,
    },
  ],
};
