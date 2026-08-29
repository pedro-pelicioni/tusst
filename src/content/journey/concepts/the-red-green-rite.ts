import type { Concept } from "../types";

// Chapter II (craft) — test-driven development as the rite that makes AI
// output acceptable at all: tests are the executable spec the machine can't
// argue with. Red-green-refactor, arrange-act-assert, invariants-as-assertions,
// and the campaign's hidden trials revealed as TDD played as a game.

export const theRedGreenRite: Concept = {
  meta: {
    slug: "the-red-green-rite",
    title: "The Red-Green Rite",
    tagline: "TDD: tests first, forge second.",
    numeral: "II",
    arc: "craft",
    level: 1,
    requires: ["think-before-you-forge"],
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/the-red-green-rite.webp",
    glyph: "🟥",
  },
  steps: [
    {
      kind: "theory",
      body: `## The spec grows teeth

In Chapter I you learned to write down what *right* means. A **test** is that sentence made executable — a spec the machine re-checks in milliseconds, every time, forever.

This matters *more* with AI, not less. A golem can argue with your prose, reinterpret your intent, "improve" your requirements. It cannot argue with \`assert_eq!\`. **Tests are the spec the machine can't argue with** — the one place where a plausible answer and a right answer stop being confusable.

Write them **first**, and every forge that follows is graded from birth.`,
    },
    {
      kind: "theory",
      body: `## The rite: red, green, refactor

TDD is a three-beat rite, and the order is the point:

1. **Red** — write one small test for behavior that doesn't exist yet. Run it. **Watch it fail.**
2. **Green** — write the simplest code that makes it pass. Not the cleverest. The simplest.
3. **Refactor** — now, with the net up, make it clean. The tests guard your back while you move things.

Red proves the test can catch the bug it guards against. Green proves the behavior exists. Refactor is where good code actually gets made — *safely*.`,
    },
    {
      kind: "diagram",
      body: "Three moves, forever:",
      caption: "The order IS the discipline: a test written after the code only proves the code does what it does.",
      view: {
        kind: "flow",
        layout: "cycle",
        play: true,
        nodes: [
          {
            id: "red",
            label: "red",
            note: "Write the trial first and watch it fail. A test that never failed proves nothing.",
            tone: "bad",
          },
          {
            id: "green",
            label: "green",
            note: "The smallest change that makes it pass. Not the elegant one — the smallest.",
            tone: "good",
          },
          {
            id: "refactor",
            label: "refactor",
            note: "Now make it good, with the trial holding the behaviour still while you move things.",
            tone: "accent",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Your AI pair delivers a feature *and* a new test for it. You run the suite: everything is green on the very first try. What do you still owe the rite?`,
      options: [
        "Break the feature (or revert it) and watch the new test go red — a test never seen failing may be testing nothing",
        "Nothing — green on the first run is the best possible outcome",
        "Rerun the suite a few more times to make sure the green is stable",
      ],
      answer: 0,
      explain: `When the same golem forges both the code and its tests, a test that asserts too little stays green forever. Red is the only proof a test has teeth — one deliberate break tells you it bites.`,
    },
    {
      kind: "theory",
      body: `## Anatomy of a good trial

A good unit test reads in three moves — **arrange, act, assert**:

- **Arrange** — build the world: an escrow holding one deposit, deadline already past.
- **Act** — do *one* thing: the buyer calls refund.
- **Assert** — check *one behavior*: the buyer's balance grew by the deposit.

One behavior per test, and a name that states it: \`refund_after_deadline_returns_deposit\`. When that test fails, the failure *is* the diagnosis — no archaeology required.`,
    },
    {
      kind: "quiz",
      question: `A single test deposits, approves, releases, refunds, and asserts on four different behaviors. Tonight it's red. What's the real problem with this test?`,
      options: [
        "When it fails you can't tell which behavior broke — a many-behavior test turns every failure into archaeology",
        "Nothing — more assertions per test always means more protection",
        "It's too slow — the fix is merging it with other tests into one even bigger one",
      ],
      answer: 0,
      explain: `Coverage isn't the issue — diagnosis is. Four focused tests catch the same bugs, and the one that turns red *names* the broken behavior for free.`,
    },
    {
      kind: "theory",
      body: `## From examples to invariants

An example test pins one point: *this* input, *that* output. **Property-style thinking** pins a law: something that must hold for *every* input.

Your Chapter I invariants are exactly these laws:

> escrow balance = deposits − releases − refunds

Assert it after *every* operation your tests perform — deposit, release, refund, weird orderings — and you've built a tripwire across the whole state space, not a fence around one example. Every invariant in your spec deserves at least one assertion that never stops being checked.`,
    },
    {
      kind: "fill",
      prompt: `Turn Chapter I's invariant into an executable trial:`,
      file: "escrow_test.rs",
      before: `assert_eq!(escrow.balance(), deposits - releases - `,
      after: `);`,
      choices: ["refunds", "fees", "interest", "gas"],
      answer: 0,
      explain: `The same iron ring from Chapter I, now with teeth: money leaves the escrow only as releases or refunds. Written as an assertion, the machine re-checks it on every forge — free, forever.`,
    },
    {
      kind: "theory",
      body: `## Accepting the golem's work fearlessly

Here is the payoff. An AI hands you 300 lines. Without tests, your options are *read every line very carefully* or *trust*. Both fail at scale.

With a suite written first, acceptance is mechanical: **red — reject**, with the failure as feedback. **Green — accept**, and read for style at your leisure.

The same net makes refactoring fearless — yours *and* the golem's. "Rewrite this module, keep the tests green" is a safe instruction *only because* the trials exist and the golem didn't get to write them to fit its own code.`,
    },
    {
      kind: "quiz",
      question: `The golem proudly reports **100% line coverage**. What did you actually learn?`,
      options: [
        "Every line ran during the tests — which says nothing about how much behavior the assertions actually check",
        "The code is correct — every line was exercised and passed",
        "The suite is finished — past 100% there is nothing left worth testing",
      ],
      answer: 0,
      explain: `Coverage counts lines executed, not promises kept. A suite can touch every line and assert almost nothing. Chase behaviors and invariants; let coverage be a byproduct, never the goal.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "rust-fundamentals-1",
      body: `A secret about the Campaign: **every skirmish is graded by hidden trials** — you forge, the trials judge, red or green. The Campaign *is* TDD played as a game, and you've been inside the rite since your first skirmish. Next discipline: drawing the borders where a word changes its meaning — the map every spec depends on.`,
    },
  ],
};
