import type { Concept } from "../types";

// Chapter VI (craft) — prompt & context engineering: the context window is the
// golem's entire world. Prompt anatomy, specificity over politeness, worked
// examples over adjectives, curation over accumulation, context rot, and the
// spec/tests from earlier chapters revealed as the sharpest prompts you own.

export const wordsOfPower: Concept = {
  meta: {
    slug: "words-of-power",
    title: "Words of Power",
    tagline: "Prompt & context engineering — what the golem actually sees.",
    numeral: "VI",
    arc: "craft",
    level: 2,
    requires: ["think-before-you-forge"],
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/words-of-power.webp",
    glyph: "🪶",
  },
  steps: [
    {
      kind: "theory",
      body: `## The bench is the whole world

The golem does not know your repo. It does not remember yesterday, and it cannot see the file you *didn't* attach. Its entire universe is the **context window** — the text sitting in front of it right now.

That is the deepest rule of prompting, and it isn't mystical: **you are deciding what exists.** Whatever is on the bench is the world; whatever is off the bench never happened.

So the question behind every prompt is not "how do I phrase this?" but *"what does the golem need to see to get this right?"*`,
    },
    {
      kind: "theory",
      body: `## Anatomy of a prompt

A working prompt is a small engineering document with four parts:

1. **Role & instructions** — what job is being done, and how: "You are implementing one use-case in a payments domain."
2. **Constraints** — the musts and must-nots: "Public API unchanged. No new dependencies. No panics."
3. **Examples** — one sample of *good*, so quality is shown rather than described.
4. **The ask** — the actual task, stated last, precise and single.

Most bad prompts aren't badly *worded* — they're **missing a part**, usually the constraints or the example.`,
    },
    {
      kind: "quiz",
      question: `Which instruction actually improves the golem's code?`,
      options: [
        "Validate the amount: reject zero and negatives with a typed error; never panic; keep the public API unchanged",
        "Please write really clean, professional, high-quality, production-grade code",
        "You are the greatest programmer who has ever lived — code accordingly",
      ],
      answer: 0,
      explain: `The golem can't fail "high-quality" — every output plausibly qualifies. It *can* fail "never panic", and that's the point: acceptance criteria create the possibility of being wrong, which is what steers a model. Specificity beats politeness — and flattery.`,
    },
    {
      kind: "theory",
      body: `## Show, don't tell

Adjectives describe quality; **examples define it.** One worked example outweighs three paragraphs of adjectives, because the golem is a pattern-continuation machine — so hand it a pattern worth continuing.

Want tests in your house style? Paste **one ideal test** and say "like this." Want error messages that carry a code and a remediation hint? Show *one*.

Chapter I taught you that prose requirements leak ambiguity. The same holds on the bench: an example is a tiny spec that gets *copied* instead of interpreted — and copying loses far less than interpreting does.`,
    },
    {
      kind: "theory",
      body: `## Context engineering: curation, not accumulation

Prompt engineering asks *how to phrase*. **Context engineering** asks the more important question: *what goes on the bench at all?*

For a bug in the refund path, the golem needs:

- the **refund module** — the code actually in play,
- the **spec** for refunds — Chapter I's artifact,
- the **failing test** — the Rite's artifact, naming exactly what "fixed" means.

Not the whole repo. Not last month's migration notes. The skill is *selection*: the right two hundred lines beat the complete works of your codebase.`,
    },
    {
      kind: "diagram",
      body: "What you think you sent, and what actually arrived:",
      caption: "Context is a budget, not a container. Everything you add competes with everything you already put there.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "you",
            label: "what you meant",
            tone: "neutral",
          },
          {
            id: "model",
            label: "what it received",
            tone: "accent",
          },
        ],
        rows: [
          {
            label: "the task",
            cells: [
              {
                text: "\"fix the bug\"",
                tone: "neutral",
              },
              {
                text: "four words, no failing output, no file",
                tone: "accent",
              },
            ],
          },
          {
            label: "the codebase",
            cells: [
              {
                text: "\"it's all in the repo\"",
                tone: "neutral",
              },
              {
                text: "whatever fit — usually the wrong half",
                tone: "accent",
              },
            ],
          },
          {
            label: "the standard",
            cells: [
              {
                text: "\"you know our style\"",
                tone: "neutral",
              },
              {
                text: "nothing; it has never seen your review comments",
                tone: "accent",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Context rot

Here's the counterintuitive part: irrelevant context doesn't just waste space — it **actively harms**.

- A distractor file invites the golem to "helpfully" touch it.
- Mixed vocabularies pull in the wrong model of Account — Chapter III's nightmare, self-inflicted.
- Stale docs and dead code teach old behavior as if it were current.
- And the longer the bench, the thinner the attention: your one crucial constraint now competes with ten thousand tokens of noise.

Curation cuts both ways. **Removing from the bench is as powerful as adding to it.**`,
    },
    {
      kind: "quiz",
      question: `You're sending the golem to fix a bug in the refund path. What goes on the bench?`,
      options: [
        "The refund module, the spec's refund rules, and the failing test — and little else",
        "The entire repository, so that no potentially relevant detail is missing",
        "Only the error message — any code context would bias its fresh perspective",
      ],
      answer: 0,
      explain: `Starving and drowning are both failure modes: too little context forces guessing, while indiscriminate context buries the signal and invites edits you never asked for. Curation — the relevant module, the spec, the trial — is the craft itself.`,
    },
    {
      kind: "fill",
      prompt: `The sharpest prompt you own is one you already wrote:`,
      file: "prompt.md",
      before: `Make this failing `,
      after: ` pass, without changing its assertions.`,
      choices: ["test", "build", "demo", "deploy"],
      answer: 0,
      explain: `A failing test is an executable acceptance criterion — behavior, edges, and done-ness in a form that can't be misread. Builds, demos, and deploys can fail too, but only a test carries assertions: your spec with teeth, now moonlighting as a prompt.`,
    },
    {
      kind: "theory",
      body: `## Iteration is spec-tightening

The first output is wrong. Fine — that's data. The amateur move is re-rolling the dice; the engineer's move is **reading the failure and finding the missing instruction**.

Golem ignored an edge case? Your constraints never mentioned it. Wrong style? You told instead of showed. Touched files it shouldn't have? The bench was cluttered, or the border unstated.

Each failure names a hole in your words — patch the *prompt*, not just the output, exactly the way Chapter I taught you to tighten a spec.

Next discipline: setting the words in motion — the loop that acts, observes, and corrects.`,
    },
  ],
};
