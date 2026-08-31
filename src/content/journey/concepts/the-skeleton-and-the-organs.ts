import type { Concept } from "../types";

// Craft XIV — what turns a graph into something you can rely on: edges that
// are plain deterministic code, failures that stay inside one node, and the
// judgement to not build one at all. Closes the arc, so it also carries the
// assembled-belt recap and the handoff into the Realm.

export const theSkeletonAndTheOrgans: Concept = {
  meta: {
    slug: "the-skeleton-and-the-organs",
    title: "Orchestration",
    tagline: "Orchestration: deterministic edges, judgement inside the nodes.",
    numeral: "XIV",
    arc: "craft",
    level: 2,
    requires: ["weaving-the-graph"],
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-skeleton-and-the-organs.webp",
    glyph: "🦴",
  },
  steps: [
    {
      kind: "theory",
      body: `## Orchestration vs. autonomy

Split the graph's two jobs cleanly:

- **Edges are deterministic.** Plain code decides what runs when, what flows where, what a retry looks like — control flow you can read, test, and replay.
- **Judgment lives inside nodes.** Within its box, the model brings full craft to its one task.

Blur the split — let the model improvise which step comes next — and failures stop being reproducible: every run is a new adventure through a different graph. Keep the structure boring and the minds contained: **reliability from the skeleton, intelligence from the organs.**`,
    },
    {
      kind: "quiz",
      question: `In a well-built graph, where does model judgment live?`,
      options: [
        "Inside the nodes — while the edges between them stay deterministic code you can test and replay",
        "In the edges — letting the model improvise which node runs next keeps the system flexible",
        "Nowhere — a serious pipeline is deterministic end to end, or it isn't engineering",
      ],
      answer: 0,
      explain: `Improvised control flow means unreproducible failures — you can't debug a path that never happens the same way twice. And a pipeline with no judgment anywhere didn't need models at all. Deterministic skeleton, judging organs: each kind of reliability where it belongs.`,
    },
    {
      kind: "fill",
      prompt: `Complete the split that makes a graph debuggable:`,
      file: "graph.toml",
      before: `The edges are `,
      after: ` code; the judgement lives inside the nodes.`,
      choices: [
        "deterministic",
        "model-generated",
        "adaptive",
        "self-modifying",
      ],
      answer: 0,
      explain: `Every other answer buys the same thing: a run you cannot reproduce. If the path through the graph is itself a model output, then two runs of the same failure took two different routes — and there is nothing to step through, because the thing that went wrong was the map.`,
    },
    {
      kind: "theory",
      body: `## Bulkheads for reasoning

The graph's quietest gift is **containment**.

In one giant prompt, a single confusion at step two poisons everything after it — same context, no bulkheads, the error compounding politely to the end.

In a graph, a failed node **fails alone**. Its context is quarantined; its own evals catch the failure at *its* border — the last chapter's compass, now posted per node; the orchestrator retries it or routes around it. This is what pipeline and multi-agent tooling exists to give you — named steps, typed handoffs, retries — and it's the keep's blast-radius lesson again, one level up.`,
    },
    {
      kind: "diagram",
      body: "One confusion at step two, two architectures:",
      caption:
        "Same mistake, same model. The only difference is whether anything stood between step two and step five.",
      view: {
        kind: "compare",
        columns: [
          { id: "mono", label: "one long prompt", tone: "bad" },
          { id: "graph", label: "a graph", tone: "good" },
        ],
        rows: [
          {
            label: "where the error goes",
            cells: [
              { text: "into the context every later step reads", tone: "bad" },
              { text: "nowhere — the node's context is its own", tone: "good" },
            ],
          },
          {
            label: "who notices",
            cells: [
              { text: "you, at the end, from the output", tone: "bad" },
              { text: "that node's own evals, at its border", tone: "good" },
            ],
          },
          {
            label: "what it costs",
            cells: [
              { text: "every step after it, redone", tone: "bad" },
              { text: "one node, retried or routed around", tone: "good" },
            ],
          },
          {
            label: "what you can debug",
            cells: [
              { text: "one long transcript", tone: "bad" },
              { text: "the failing node, in isolation", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `The task: rename one function and its call sites in a single file. What do you reach for?`,
      options: [
        "A simple loop — or just your editor; a graph's coordination costs would exceed the task itself",
        "A graph — more models means more quality, on small tasks and large ones alike",
        "A graph — small tasks are exactly the place to practice for the big ones",
      ],
      answer: 0,
      explain: `Every node costs setup: context to curate, edges to define, failures to route. On a small task the scaffolding outweighs the work — a war council convened to swat a fly. Simple task, simple loop; the graph earns its keep only when decomposition does.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## The examiner's trial: weave one

A quest that will not fit on a single bench:

> A Soroban token contract needs a security pass before mainnet. Audit it for the common classes of bug, fix what is found, update the README to match the fixed behavior, and produce a short migration note for anyone already on the old version.

Design the **graph**. Name the nodes and what each one is for; say which of them may run in parallel and why they are genuinely independent; say where a verifier sits and what its goal is; and name one node whose failure must not take the rest down, and what happens when it does fail.

Design only — no orchestration code, no tool or framework names.`,
      rubric: `1. Names at least four nodes, each with a stated single purpose.
2. Identifies which nodes may run in parallel AND justifies the independence — neither reads the other's output nor touches its state.
3. Places at least one verifier node and states its goal as refutation, not approval.
4. Names at least one node whose failure is contained, and says what the orchestrator does about it (retry, route around, stop and escalate).
5. Design only — no orchestration code, no framework or tool names, and control flow is not left to a model to improvise.`,
      minChars: 200,
    },
    {
      kind: "theory",
      body: `## The craft, assembled

Look at what's on your belt now: **specs** that say what right means; **trials** that check it forever; **borders** that keep words honest; a **keep** that contains change; a **harness** that contains the model; **words** that shape what it sees; **loops** that let it correct itself; and a **graph** that weaves many minds into one plan.

None of these will the AI carry for you. All of them make the AI worth ten of itself.

Next on the road: back to the realm — carry the craft into the Forge and spend it on the real network.`,
    },
  ],
  testOut: [
    {
      question: `In a well-built graph, where does model judgement live?`,
      options: [
        "Inside the nodes, while the edges between them stay deterministic code you can test and replay",
        "In the edges — letting the model pick the next node keeps the system flexible",
        "Nowhere; a serious pipeline is deterministic end to end",
      ],
      answer: 0,
    },
    {
      question: `What goes wrong when the model decides which step runs next?`,
      options: [
        "Failures stop being reproducible — you cannot debug a path that never happens the same way twice",
        "Nothing, provided each node still has its own evals",
        "It costs more, because the routing decision is an extra call",
      ],
      answer: 0,
    },
    {
      question: `A node fails halfway through a graph. What should happen?`,
      options: [
        "It fails alone — its context is quarantined, its own evals catch it, and the orchestrator retries or routes around",
        "The whole run aborts, since downstream results would be based on a failure",
        "The next node inherits its partial output and carries on",
      ],
      answer: 0,
    },
    {
      question: `The task: rename one function and its call sites in a single file. What do you reach for?`,
      options: [
        "A simple loop, or just your editor — a graph's coordination would cost more than the task",
        "A graph, since more nodes means more quality at any size",
        "A graph, because small tasks are where you practise for the large ones",
      ],
      answer: 0,
    },
  ],
};
