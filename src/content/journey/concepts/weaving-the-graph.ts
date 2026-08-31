import type { Concept } from "../types";

// Craft XIII — decomposition: nodes, edges, true independence, and the
// adversarial pair. How to make the resulting machine reliable — deterministic
// edges, per-node bulkheads, and knowing when NOT to build one — is Craft XIV.

export const weavingTheGraph: Concept = {
  meta: {
    slug: "weaving-the-graph",
    title: "Graph Engineering",
    tagline: "Graph engineering: many small models, each on its own bench, one woven plan.",
    numeral: "XIII",
    arc: "craft",
    level: 2,
    requires: ["the-hand-on-the-brake"],
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/weaving-the-graph.webp",
    glyph: "🕸️",
  },
  steps: [
    {
      kind: "theory",
      body: `## When one loop isn't enough

Some quests overflow a single mind: *audit this contract, fix what you find, update the docs, prepare the migration.* Stuff all of it into one context and quality dilutes with every step — the last chapter told you why.

The move is ancient: **decompose**. Build a **graph** of steps:

- **Nodes** — small, focused tasks, each with its *own curated bench*.
- **Edges** — what flows between them: a spec, a diff, a report.

You've done this to code all your life — small functions, single duties, explicit inputs and outputs. Now do it to the work itself.`,
    },
    {
      kind: "theory",
      body: `## Fan out, fan in

Independence is the scheduler's favorite word.

**Fan-out**: three candidate SDKs to evaluate? Three nodes, in parallel — each on its own bench, none needing the others, no context bleeding between them.

**Fan-in**: one *synthesis* node receives the three reports, weighs them against your criteria, and recommends.

The discipline is spotting *true* independence: parallel work must share **no state** — nodes racing to edit the same file aren't a graph, they're a fight. It's dependency thinking, the kind you already apply to data pipelines, now applied to minds.`,
    },
    {
      kind: "diagram",
      body: "One plan, three workers, one verdict:",
      caption: "Each worker starts clean. That isolation is the point — a bad turn in one never poisons the others.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "plan",
            label: "PLAN",
            x: 50,
            y: 12,
            tone: "accent",
            shape: "box",
            note: "Splits the work into pieces that do not need to talk to each other.",
          },
          {
            id: "a",
            label: "A",
            x: 18,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Own context, own budget. It never sees B's mistakes.",
          },
          {
            id: "b",
            label: "B",
            x: 50,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Runs at the same time, on the same brief, on a different piece.",
          },
          {
            id: "c",
            label: "C",
            x: 82,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Three cheap attempts beat one expensive one you cannot check.",
          },
          {
            id: "judge",
            label: "JUDGE",
            x: 50,
            y: 56,
            tone: "gold",
            shape: "box",
            note: "Reads all three and decides. This is where the quality actually comes from.",
          },
        ],
        edges: [
          {
            from: "plan",
            to: "a",
            style: "solid",
          },
          {
            from: "plan",
            to: "b",
            style: "solid",
          },
          {
            from: "plan",
            to: "c",
            style: "solid",
          },
          {
            from: "a",
            to: "judge",
            style: "dashed",
          },
          {
            from: "b",
            to: "judge",
            style: "dashed",
          },
          {
            from: "c",
            to: "judge",
            style: "dashed",
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "fan-out",
      body: `Four tasks, two stages each, three ways to schedule them. **Flip the durations** and watch which two schedules stop being the same thing.`,
    },
    {
      kind: "quiz",
      question: `Which set of subtasks is safe to fan out in parallel?`,
      options: [
        "Evaluating three candidate libraries against the same checklist — independent work, no shared state",
        "Writing a migration script and running that same script — overlapping them saves time",
        "Three models editing the same module at once, to finish it three times faster",
      ],
      answer: 0,
      explain: `Run-before-written violates a dependency, and shared-file editing is a merge-conflict factory with extra steps. The test is boring and reliable: if node A neither reads node B's output nor touches node B's state, they may run together.`,
    },
    {
      kind: "quiz",
      question: `Five nodes each produce a finding, and each finding then needs verifying. When is it right to wait for **all five** findings before starting **any** verification?`,
      options: [
        "Only when the verification step genuinely needs the whole set at once — to dedupe across findings, say, or to skip entirely if the count is zero",
        "Always — a clean stage boundary makes the pipeline easier to reason about",
        "Never — waiting is always wasted time in a parallel system",
      ],
      answer: 0,
      explain: `A barrier is a real tool with a real cost: it spends the slowest node's time doing nothing with the other four. It earns that cost when the next stage is genuinely about the *set* — deduplication, an early exit on zero, a comparison across results. "It reads more cleanly" is not that, and neither is "I need to flatten the list first."`,
    },
    {
      kind: "theory",
      body: `## The forger and the refuter

The harness chapter warned you: self-review shares the blind spots of the self. A graph fixes that *structurally*.

Add a **verifier node**: one model forges; a *different* node — fresh context, no attachment to the choices already made — is told to **refute**: find where the diff violates the spec, hunt the edge cases, try to break it.

The job description matters. "Review this" invites a shrug of approval. *"Find what's wrong with this"* aims the mind at holes. Adversarial pairs catch what self-review structurally cannot — the reason real forges pair a maker with an inspector.`,
    },
    {
      kind: "fill",
      prompt: `Give the second model its true job:`,
      file: "graph.toml",
      before: `verifier.goal = "`,
      after: ` the forge node's diff"`,
      choices: ["refute", "approve", "summarize", "rewrite"],
      answer: 0,
      explain: `A verifier told to approve will find a way to approve. "Summarize" produces prose, not scrutiny; "rewrite" just makes a second forger with blind spots of its own. Refutation is the only goal that aims the node at the holes.`,
    },
    {
      kind: "theory",
      body: `## A shape is not yet a system

You can now take a quest too big for one bench and cut it into nodes that are each small enough to do well — and you know to hand the checking to a second mind that was never attached to the first one's choices.

What you have is a shape. What you do not yet have is a machine anyone can rely on. Who decides which node runs next? What happens to the other nodes when one of them fails? And — the question that saves the most money — when should you not build a graph at all?

**Next:** the part that makes the shape trustworthy.`,
    },
  ],
  testOut: [
    {
      question: `Why decompose a large quest into a graph of nodes instead of one long prompt?`,
      options: [
        "Each node gets its own curated bench, so quality does not dilute across steps that have nothing to do with each other",
        "Models charge less for several short requests than for one long one",
        "It lets the model choose its own order of work, which improves results",
      ],
      answer: 0,
    },
    {
      question: `What is the test for whether two nodes may run in parallel?`,
      options: [
        "Node A neither reads node B's output nor touches its state",
        "Both nodes are expected to take roughly the same amount of time",
        "Neither node writes to the network",
      ],
      answer: 0,
    },
    {
      question: `Why give the second model the goal \"refute\" rather than \"review\"?`,
      options: [
        "A node told to approve will find a way to approve — refutation is the only goal that aims the mind at the holes",
        "Refutation produces shorter output, which costs less",
        "Review requires the original context, and refutation does not",
      ],
      answer: 0,
    },
    {
      question: `Four tasks fan out, each with two stages. What does waiting for every task to finish stage one actually cost?`,
      options: [
        "The slowest task's stage-one time, spent doing nothing with all the others — and again at stage two",
        "Nothing, as long as the tasks run in parallel within each stage",
        "Only the coordination overhead of the scheduler",
      ],
      answer: 0,
    },
  ],
};
