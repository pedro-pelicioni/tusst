import type { Concept } from "../types";

// Craft VII — context engineering, split out of Words of Power. Prompting is
// about phrasing; this is about selection, which is the harder half and the
// one people skip. The context-window widget is the payload: it makes the
// budget visible, so "adding is not free" stops being a slogan.

export const whatTheGolemSees: Concept = {
  meta: {
    slug: "what-the-golem-sees",
    title: "Context Engineering",
    tagline: "Context engineering: curation, not accumulation.",
    numeral: "X",
    arc: "craft",
    level: 2,
    requires: ["words-of-power"],
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/what-the-golem-sees.webp",
    glyph: "🪟",
  },
  steps: [
    {
      kind: "theory",
      body: `## Curation, not accumulation

Prompt engineering asks *how to phrase*. **Context engineering** asks the more important question: *what goes in front of the model at all?*

For a bug in the refund path, it needs three things:

- the **refund module** — the code actually in play,
- the **refund rules from the spec** — Chapter I's artifact,
- the **failing test** — the Rite's artifact, naming exactly what "fixed" means.

Not the whole repo. Not last month's migration notes. The skill is *selection*: the right two hundred lines beat the complete works of your codebase.`,
    },
    {
      kind: "theory",
      body: `## One bench, assembled

The refund bug, for real. Here is what goes on, with a size and a reason:

- \`refunds.rs\` (180 lines) — the code that is wrong. Not the module that calls it; the one that decides.
- The three refund clauses from the spec (14 lines) — so "correct" has a definition that isn't the model's opinion.
- \`test_refund_after_deadline\` and its failing output (20 lines) — the one trial that is red, and what it actually printed.

And what stays off, which is the harder half:

- \`payments.rs\`, even though refunds live under payments — it is not where the bug is, and **every file on the bench is a file the model may decide to improve**.
- The migration notes from the release that introduced the deadline. They describe a schema that has changed twice since, and stale material teaches confidently.
- The rest of the test suite. Six hundred lines of green say nothing about the one that is red.

Roughly 210 lines, against a repository of forty thousand. That ratio *is* the job.`,
    },
    {
      kind: "diagram",
      body: "What you think you sent, and what actually arrived:",
      caption:
        "Context is a budget, not a container. Everything you add competes with everything you already put there.",
      view: {
        kind: "compare",
        columns: [
          { id: "you", label: "what you meant", tone: "neutral" },
          { id: "model", label: "what it received", tone: "accent" },
        ],
        rows: [
          {
            label: "the task",
            cells: [
              { text: "\"fix the bug\"", tone: "neutral" },
              { text: "four words, no failing output, no file", tone: "accent" },
            ],
          },
          {
            label: "the codebase",
            cells: [
              { text: "\"it's all in the repo\"", tone: "neutral" },
              { text: "whatever fit — usually the wrong half", tone: "accent" },
            ],
          },
          {
            label: "the standard",
            cells: [
              { text: "\"you know our style\"", tone: "neutral" },
              { text: "nothing; it has never seen your review comments", tone: "accent" },
            ],
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "context-window",
      body: `Here is that budget. **Load the bench** and watch two numbers move at once — how much room is left, and how much of what is there is actually about the task.`,
    },
    {
      kind: "quiz",
      question: `You're sending the model to fix a bug in the refund path. What goes on the bench?`,
      options: [
        "The refund module, the spec's refund rules, and the failing test — and little else",
        "The entire repository, so that no potentially relevant detail is missing",
        "Only the error message — any code context would bias its fresh perspective",
      ],
      answer: 0,
      explain: `Starving and drowning are both failure modes: too little context forces guessing, while indiscriminate context buries the signal and invites edits you never asked for. Curation — the relevant module, the spec, the trial — is the craft itself.`,
    },
    {
      kind: "theory",
      body: `## Context rot

Here's the counterintuitive part: irrelevant context doesn't just waste space — it **actively harms**.

- A distractor file invites the model to "helpfully" touch it.
- Mixed vocabularies pull in the wrong model of Account — Chapter III's nightmare, self-inflicted.
- Stale docs and dead code teach old behavior as if it were current.
- And the longer the bench, the thinner the attention: your one crucial constraint now competes with ten thousand tokens of noise.

Curation cuts both ways. **Removing from the bench is as powerful as adding to it.**`,
    },
    {
      kind: "quiz",
      question: `Which of these does the most damage on a crowded bench?`,
      options: [
        "A stale doc describing how the module used to work — it teaches old behavior as current",
        "A long file that is simply unrelated and gets ignored",
        "Extra blank lines between the sections of the prompt",
      ],
      answer: 0,
      explain: `Unrelated material costs you room and attention. *Contradictory* material costs you correctness: the model has no way to know which of two accounts of the truth is the current one, and confident-and-wrong is the expensive failure mode.`,
    },
    {
      kind: "fill",
      prompt: `Complete the line that separates this discipline from prompting:`,
      file: "NOTES.md",
      before: `Context is a budget, not a container — which is why removing from the bench is `,
      after: ` .`,
      choices: [
        "as powerful as adding to it",
        "only worth doing when you run out of room",
        "a last resort when the model gets confused",
        "handled automatically by the model",
      ],
      answer: 0,
      explain: `This is the whole chapter in one line. Phrasing is a skill you can practise in an afternoon; deciding what the model never sees is the part that stays hard, and the part that separates a working bench from a full one.`,
    },
    {
      kind: "theory",
      body: `## Why this is the last quiet chapter

So far the model has done one thing at a time: you set the bench, you write the ask, you read the answer. You are still the loop.

The moment it starts acting on its own output — running the test it just wrote, reading the failure, trying again — everything here compounds. A bench that was merely cluttered becomes a bench that grows, on its own, with every step it takes.

**Next:** the loop that acts, observes and corrects — and how to tell it when to stop.`,
    },
  ],
  testOut: [
    {
      question: `What question does context engineering ask that prompt engineering does not?`,
      options: [
        "What goes in front of the model at all — which is a question of selection, not phrasing",
        "How to word the instruction so the model cannot misread it",
        "Which model to send the task to",
      ],
      answer: 0,
    },
    {
      question: `Why is irrelevant context worse than merely wasteful?`,
      options: [
        "A distractor invites edits you never asked for, and stale material teaches old behavior as current",
        "It slows the response down enough to break the flow of work",
        "Models charge more for longer inputs, so it is purely a cost problem",
      ],
      answer: 0,
    },
    {
      question: `Sending the whole repository instead of three relevant files gets you what?`,
      options: [
        "Whatever fit in the budget — and you do not get to choose which half that was",
        "A complete picture, at the cost of a slower answer",
        "The same result, since models ignore what is not relevant",
      ],
      answer: 0,
    },
    {
      question: `Both failure modes have names in this chapter. What are they?`,
      options: [
        "Starving — too little, so it guesses; and drowning — so much that the signal is buried",
        "Overfitting and underfitting",
        "Cold start and context rot",
      ],
      answer: 0,
    },
  ],
};
