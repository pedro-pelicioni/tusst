import type { Concept } from "../types";

// Chapter VIII (craft) — graph engineering: decomposing work into nodes with
// curated contexts and deterministic edges. Fan-out/fan-in, adversarial
// verifier nodes, orchestration vs autonomy, containment as bulkheads — and
// the honesty to skip the graph when a simple loop will do.

export const weavingTheGraph: Concept = {
  meta: {
    slug: "weaving-the-graph",
    title: "Weaving the Graph",
    tagline: "Graph engineering: many small golems, one woven plan.",
    numeral: "VIII",
    arc: "craft",
    status: "live",
    estMinutes: 12,
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
      kind: "quiz",
      question: `Which set of subtasks is safe to fan out in parallel?`,
      options: [
        "Evaluating three candidate libraries against the same checklist — independent work, no shared state",
        "Writing a migration script and running that same script — overlapping them saves time",
        "Three golems editing the same module at once, to finish it three times faster",
      ],
      answer: 0,
      explain: `Run-before-written violates a dependency, and shared-file editing is a merge-conflict factory with extra steps. The test is boring and reliable: if node A neither reads node B's output nor touches node B's state, they may run together.`,
    },
    {
      kind: "theory",
      body: `## The forger and the refuter

The harness chapter warned you: self-review shares the blind spots of the self. A graph fixes that *structurally*.

Add a **verifier node**: one golem forges; a *different* node — fresh context, no attachment to the choices already made — is told to **refute**: find where the diff violates the spec, hunt the edge cases, try to break it.

The job description matters. "Review this" invites a shrug of approval. *"Find what's wrong with this"* aims the mind at holes. Adversarial pairs catch what self-review structurally cannot — the reason real forges pair a maker with an inspector.`,
    },
    {
      kind: "fill",
      prompt: `Give the second golem its true job:`,
      file: "graph.toml",
      before: `verifier.goal = "`,
      after: ` the forge node's diff"`,
      choices: ["refute", "approve", "summarize", "rewrite"],
      answer: 0,
      explain: `A verifier told to approve will find a way to approve. "Summarize" produces prose, not scrutiny; "rewrite" just makes a second forger with blind spots of its own. Refutation is the only goal that aims the node at the holes.`,
    },
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
      explain: `Improvised control flow means unreproducible failures — you can't debug a path that never happens the same way twice. And a pipeline with no judgment anywhere didn't need golems at all. Deterministic skeleton, judging organs: each kind of reliability where it belongs.`,
    },
    {
      kind: "theory",
      body: `## Bulkheads for reasoning

The graph's quietest gift is **containment**.

In one giant prompt, a single confusion at step two poisons everything after it — same context, no bulkheads, the error compounding politely to the end.

In a graph, a failed node **fails alone**. Its context is quarantined; its own evals catch the failure at *its* border — the last chapter's compass, now posted per node; the orchestrator retries it or routes around it. This is what pipeline and multi-agent tooling exists to give you — named steps, typed handoffs, retries — and it's the keep's blast-radius lesson again, one level up.`,
    },
    {
      kind: "quiz",
      question: `The task: rename one function and its call sites in a single file. What do you reach for?`,
      options: [
        "A simple loop — or just your editor; a graph's coordination costs would exceed the task itself",
        "A graph — more golems means more quality, on small tasks and large ones alike",
        "A graph — small tasks are exactly the place to practice for the big ones",
      ],
      answer: 0,
      explain: `Every node costs setup: context to curate, edges to define, failures to route. On a small task the scaffolding outweighs the work — a war council convened to swat a fly. Simple task, simple loop; the graph earns its keep only when decomposition does.`,
    },
    {
      kind: "theory",
      body: `## The craft, assembled

Look at what's on your belt now: **specs** that say what right means; **trials** that check it forever; **borders** that keep words honest; a **keep** that contains change; a **harness** that contains the golem; **words** that shape what it sees; **loops** that let it correct itself; and a **graph** that weaves many minds into one plan.

None of these will the AI carry for you. All of them make the AI worth ten of itself.

Next on the road: back to the realm — carry the craft into the Forge and spend it on the real network.`,
    },
  ],
};
