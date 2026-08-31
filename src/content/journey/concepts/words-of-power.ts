import type { Concept } from "../types";

// Craft VI — prompt engineering alone: the anatomy of a working prompt,
// specificity over politeness, examples over adjectives, and iteration as
// spec-tightening. The other half of the old chapter — what goes on the
// bench at all — is now Craft VII, because "how to phrase" and "what to
// send" are different disciplines and one of them is the harder one.

export const wordsOfPower: Concept = {
  meta: {
    slug: "words-of-power",
    title: "Words of Power",
    tagline: "Prompt engineering: the four parts every working prompt has.",
    numeral: "IX",
    arc: "craft",
    level: 2,
    requires: ["think-before-you-forge"],
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/words-of-power.webp",
    glyph: "🪶",
  },
  steps: [
    {
      kind: "theory",
      body: `## Your words are all it has

The golem does not know your repo. It does not remember yesterday, and it cannot see the file you *didn't* attach. Its entire universe is the text sitting in front of it right now.

That is the deepest rule of prompting, and it isn't mystical: **you are deciding what exists.** Whatever you put in front of it is the world; whatever you leave out never happened.

So the question behind every prompt is not "how do I phrase this?" but *"what does the golem need in order to get this right?"* This chapter is the first half of that answer — the words themselves. The next one is the harder half.`,
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
      kind: "diagram",
      body: "The four parts, in the order they belong:",
      caption:
        "The ask goes last on purpose: everything above it is the frame the golem reads the task through.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "role",
            label: "role & instructions",
            note: "What job is being done, and in what world. One or two lines is plenty.",
            tone: "neutral",
          },
          {
            id: "constraints",
            label: "constraints",
            note: "The musts and must-nots. This is the part that can actually be violated — which is what makes it steer.",
            tone: "accent",
          },
          {
            id: "examples",
            label: "examples",
            note: "One sample of good. Shows the standard instead of describing it.",
            tone: "teal",
          },
          {
            id: "ask",
            label: "the ask",
            note: "Last, precise, and single. Two asks in one prompt is two prompts.",
            tone: "gold",
          },
        ],
      },
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

Chapter I taught you that prose requirements leak ambiguity. The same holds here: an example is a tiny spec that gets *copied* instead of interpreted — and copying loses far less than interpreting does.`,
    },
    {
      kind: "quiz",
      question: `Your team has a distinctive way of writing error messages. What gets the golem to match it?`,
      options: [
        "Paste one real error message from the codebase and say “like this”",
        "Describe the convention carefully in three sentences",
        "Tell it to follow the team's established style guide",
      ],
      answer: 0,
      explain: `It has never read your style guide and cannot see your codebase. A description has to be interpreted; an example only has to be continued — and continuation is the one thing this machine is built to do.`,
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

Golem ignored an edge case? Your constraints never mentioned it. Wrong style? You told instead of showed. Touched files it shouldn't have? The border was unstated.

Each failure names a hole in your words — patch the *prompt*, not just the output, exactly the way Chapter I taught you to tighten a spec.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## The examiner's trial: write the prompt

Here is the task you are about to hand over:

> A payments contract has a \`refund\` function. It currently lets anyone call it. It must only be callable by the original payer, only before the deadline, and it must never leave the contract holding less than the sum of its open deposits.

Write the **prompt** you would send — all four parts, in order. Do not write the implementation, and do not write the spec as prose: write the thing you would actually paste into the bench.`,
      rubric: `1. All four parts are present and distinguishable: role/instructions, constraints, at least one example, and a single final ask.
2. The constraints are stated so they can be VIOLATED — concrete and checkable, not "clean" or "high-quality".
3. Includes at least one worked example (a test, a signature, an error message, a sample call) rather than only describing the desired style.
4. The ask is single and precise — one task, not a list of loosely related wishes.
5. It is a prompt, not an implementation and not a prose specification.`,
      minChars: 160,
    },
    {
      kind: "theory",
      body: `## The half that is harder

You can now write a prompt that says exactly what it wants. That is the easier discipline, and most people stop here.

The harder one is deciding **what the golem gets to see at all** — which files, which spec, which test, and, far more importantly, what to leave out. Phrasing is a skill; selection is the craft.

**Next:** the bench itself, and why adding to it is not free.`,
    },
  ],
  testOut: [
    {
      question: `A working prompt has four parts. Which one is most often the missing one?`,
      options: [
        "The constraints — the musts and must-nots that can actually be violated",
        "The role, which tells the model who it is supposed to be",
        "The greeting, which sets a cooperative tone",
      ],
      answer: 0,
    },
    {
      question: `Why does "never panic" steer a model better than "write high-quality code"?`,
      options: [
        "It can be failed — an acceptance criterion creates the possibility of being wrong",
        "It is shorter, so it survives further into the context",
        "It uses an imperative verb, which models weight more heavily",
      ],
      answer: 0,
    },
    {
      question: `You want output in your team's house style. What works?`,
      options: [
        "Paste one real example and say “like this”",
        "Describe the style carefully and at length",
        "Name the style guide the team follows",
      ],
      answer: 0,
    },
    {
      question: `The first output comes back wrong. What is the engineer's move?`,
      options: [
        "Read the failure, find the instruction that was missing, and patch the prompt",
        "Re-run it — the same prompt produces different output each time",
        "Add “be careful and think step by step” and try again",
      ],
      answer: 0,
    },
  ],
};
