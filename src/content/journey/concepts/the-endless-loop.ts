import type { Concept } from "../types";

// Craft VIII — the loop as machinery: act, observe, correct, and the two
// things that decide whether it climbs at all — honest observations and a
// fixed compass. The brakes are Craft IX, because "how a loop works" and
// "how a loop is stopped" are separate lessons and only one of them is the
// one that costs money when skipped.

export const theEndlessLoop: Concept = {
  meta: {
    slug: "the-endless-loop",
    title: "The Endless Loop",
    tagline: "Agentic loops: act, observe, correct — and the signals that make it climb.",
    numeral: "XI",
    arc: "craft",
    level: 2,
    requires: ["what-the-golem-sees"],
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

But a loop is machinery, not magic. It has parts that can be engineered well or badly, and this chapter is about the two that decide whether it climbs at all.`,
    },
    {
      kind: "diagram",
      body: "The loop, and the only exit that matters:",
      caption:
        "Three of these four are this chapter. The fourth — deciding to stop — is the next one, and it is the one people skip.",
      view: {
        kind: "flow",
        layout: "cycle",
        play: true,
        nodes: [
          {
            id: "act",
            label: "act",
            note: "Take the smallest step the plan allows, then stop and look.",
            tone: "accent",
          },
          {
            id: "observe",
            label: "observe",
            note: "Read what the world answered. Not what you hoped it would.",
            tone: "teal",
          },
          {
            id: "correct",
            label: "correct",
            note: "Adjust the plan, not just the last move.",
            tone: "gold",
          },
          {
            id: "stop",
            label: "stop?",
            note: "Done, blocked, or out of budget. Decide it explicitly, every turn.",
            tone: "good",
          },
        ],
      },
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
      body: `## One turn, traced

Cycles are easy to nod at. Here is a single turn, with what actually crosses the wire.

**Act.** The golem edits \`refunds.rs\` — moves the deadline comparison from \`>\` to \`>=\`. One change, because a turn that changes six things cannot tell you which one worked.

**Observe.** The harness runs the fixed evals and hands back exactly this:

> \`test_refund_after_deadline ... FAILED\`
> \`assertion failed: balance == 0, left: 40, right: 0\`
> \`4 passed, 3 failed\`

Not "still broken". A line, a number, and a count that can be compared with last turn's count.

**Correct.** Three green became four. So the comparison was *one* of the bugs and not the only one: the deadline is handled, the balance is not. The plan updates — next turn goes at the balance.

Notice what made that turn worth anything. The golem did not decide it had improved. **The count did.**`,
    },
    {
      kind: "theory",
      body: `## Evals: the compass

How do you know iteration 7 beat iteration 6? Not by feel. **Evals** are a *fixed* set of checks — tests, lint, build, an on-chain assertion — run **every iteration**, so every attempt is measured against the same yardstick.

*Fixed* is the load-bearing word. If the checks shift between attempts, "progress" becomes unmeasurable — you're comparing scores from different exams.

With a compass, the loop knows *for a fact* whether it moved: 4 green out of 7 became 6 out of 7. Without one, it only knows that it moved. Progress is **measured, not felt**.`,
    },
    {
      kind: "fill",
      prompt: `Complete the property that makes a compass a compass:`,
      file: "NOTES.md",
      before: `Evals run every iteration, and the set of checks must stay `,
      after: ` — otherwise two attempts are being graded by two different exams.`,
      choices: [
        "fixed",
        "randomized",
        "optional",
        "regenerated for each attempt",
      ],
      answer: 0,
      explain: `A moving yardstick measures nothing. This is also why "let the golem write its own tests as it goes" quietly destroys the signal: the exam and the student stop being different things.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## The examiner's trial: write an observation contract

A loop is about to be pointed at a real task:

> A Soroban contract has a failing behavior: refunds are being paid out **after** the deadline has passed. You are going to hand this to an agentic loop and let it work unattended for a while.

Before it turns once, write its **observation contract**: what signals this loop will steer by, and what makes each one trustworthy. Behavior only — no harness code, no library names.`,
      rubric: `1. Names at least two concrete, external signals (test output, exit code, on-chain state, lint/build result) — not self-assessment and not "looks right".
2. For at least one signal, states what makes it trustworthy — deterministic, reproducible, or independent of the code under change.
3. States what counts as DONE in terms of those signals, not in terms of the golem's opinion.
4. Names at least one signal that must NOT be trusted, and why (a self-summary, a compile success, a flaky test…).
5. Behavior only — no harness implementation, no specific tools or libraries required.`,
      minChars: 140,
    },
    {
      kind: "theory",
      body: `## What this chapter did not give you

You can now build a loop that sees honestly and measures its own progress. Point it at a task and it will climb.

Notice what is missing: nothing here decides when it **stops**. Not when it is done — that part you just wrote down — but when it is *stuck*, or when it has spent more than the task was worth. A loop with good eyes and no brake does not fail loudly. It fails on the invoice.

**Next:** the brakes, and the one run where you find out why they were there.`,
    },
  ],
  testOut: [
    {
      question: `What does an agentic loop replace, compared to one-shot prompting?`,
      options: [
        "Hope — the golem now sees the result of its own work and corrects against it",
        "The need for a specification, since the loop discovers requirements as it goes",
        "The compiler, since the loop checks the code itself",
      ],
      answer: 0,
    },
    {
      question: `Why can "the output looks reasonable" never steer a loop?`,
      options: [
        "Because it can never be false — a signal that cannot be bad news carries no information",
        "Because it arrives too late in the iteration to be acted on",
        "Because models are not trained to evaluate natural-language judgements",
      ],
      answer: 0,
    },
    {
      question: `Why must the set of evals stay fixed between iterations?`,
      options: [
        "Otherwise two attempts are graded by two different exams and progress is unmeasurable",
        "Otherwise the loop runs slower with each additional check",
        "Otherwise the model memorises the checks and games them",
      ],
      answer: 0,
    },
    {
      question: `A loop compiles clean on its first attempt. What does that prove?`,
      options: [
        "That the types line up — not that the behavior is the one that was wanted",
        "That the logic is very likely correct, since most bugs are type errors",
        "Nothing at all; compilation is unrelated to code quality",
      ],
      answer: 0,
    },
  ],
};
