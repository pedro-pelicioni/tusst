import type { Concept } from "../types";

// Chapter II — the Stellar Consensus Protocol, taught by breaking it.
// The scp-sim widget is the heart: build intuition by killing nodes and
// watching the council stall (safety) or close ledgers anyway (liveness).

export const theRealmOfStellar: Concept = {
  meta: {
    slug: "the-realm-of-stellar",
    title: "Consensus & the Stellar Network",
    tagline: "Consensus (SCP): how thousands of machines agree without a king.",
    numeral: "I",
    arc: "realm",
    level: 1,
    requires: ["the-book-no-one-can-erase"],
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/the-realm-of-stellar.webp",
    glyph: "🕸",
  },
  steps: [
    {
      kind: "theory",
      body: `## Agreement without a king

Every blockchain answers one question: **how do strangers agree on the next page of the ledger?**

- Proof-of-Work answers with *electricity* — whoever burns the most, writes.
- Proof-of-Stake answers with *locked capital* — whoever stakes the most, writes.
- **Stellar answers with trust**: every node names the nodes it believes, and agreement ripples through those declarations. No mining, no staking — the **Stellar Consensus Protocol (SCP)**.

The result: ledgers close in ~5 seconds, fees cost fractions of a cent, and the network runs on machines a university can afford.`,
    },
    {
      kind: "theory",
      body: `## Quorum slices: "my council"

Each node declares a **quorum slice** — a small council of nodes it refuses to move without:

> "I accept a ledger when **enough of my council** accepts it."

Councils overlap: your council members have councils of their own, and those chains of trust knit the whole network together. A **quorum** is a set of nodes that contains a satisfied council *for every member* — once a quorum agrees, the ledger closes.

No global list. No admission office. Trust is declared locally and becomes agreement globally — the same way human institutions federate.`,
    },
    {
      kind: "widget",
      component: "scp-sim",
      body: `## The Council of Nodes

Seven validators, each trusting a small council. **Propose a ledger** and watch acceptance ripple through the slices. Then do what every good engineer does to a consensus protocol: **click nodes to strike them down** and see what the survivors do.

Try to find the point where the network *stalls* — and notice that it stalls rather than splits.`,
    },
    {
      kind: "quiz",
      question: `In SCP, when does a single node accept a ledger?`,
      options: [
        "When enough of its own quorum slice has accepted it",
        "When 51% of all nodes on Earth have accepted it",
        "When it solves a cryptographic puzzle first",
      ],
      answer: 0,
      explain: `Everything is local: a node moves when its *council* moves. Global agreement emerges from overlapping councils — no node ever needs a census of the whole network.`,
    },
    {
      kind: "theory",
      body: `## Nobody hands you the list

Here is the part that sounds like a bug the first time you hear it: **there is no official list of validators.** No registry decides who counts. Each participant names the others it is willing to depend on, and that is the whole enrolment process.

Which raises the obvious objection. If everyone picks their own council, what stops the network splitting into two groups that each agree internally and disagree with each other?

The answer is **overlap**. Two participants can only be guaranteed to reach the same conclusion if their circles of trust intersect enough — and in practice they do, because everyone independently ends up naming the same handful of well-run, publicly accountable institutions. The safety of the whole network is an emergent property of a lot of separate, self-interested choices about who is worth depending on.

That is genuinely different from "the protocol picks", and the difference cuts both ways. Nobody can add themselves to a list to gain influence. And nobody can hand you a good configuration either — **choosing badly is a thing you are allowed to do.** Which is why the practical advice for anyone running a validator is boring and correct: start from a published, well-analysed configuration, and understand any deviation before you make it.`,
    },
    {
      kind: "theory",
      body: `## Safety over liveness

You saw it in the simulator: strike down too much of a council and the network **waits**. It does not guess. It does not split into two histories.

That is a deliberate trade, and it has a name:

- **Safety** — the network never confirms two conflicting ledgers.
- **Liveness** — the network keeps confirming *something*.

When forced to choose, SCP **halts instead of forking**. For a network that moves money — salaries, remittances, treasuries — a paused payment beats a payment that later *un-happens*.`,
    },
    {
      kind: "diagram",
      body: "Two ways a network can fail — and only one of them takes your money back:",
      caption: "Safety over liveness: SCP would rather stall than disagree with itself.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "fork",
            label: "networks that fork",
            tone: "bad",
          },
          {
            id: "scp",
            label: "Stellar",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "when agreement fails",
            cells: [
              {
                text: "two histories continue side by side",
                tone: "bad",
              },
              {
                text: "the ledger simply stops closing",
                tone: "good",
              },
            ],
          },
          {
            label: "what you wait for",
            cells: [
              {
                text: "enough confirmations to be probably safe",
                tone: "bad",
              },
              {
                text: "nothing — a closed ledger is final",
                tone: "good",
              },
            ],
          },
          {
            label: "the worst case",
            cells: [
              {
                text: "a payment is undone hours later",
                tone: "bad",
              },
              {
                text: "a payment is delayed",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `A third of the validators in your node's quorum slice go offline. What does your node do?`,
      options: [
        "Stalls — it refuses to confirm ledgers until its slice can be satisfied again",
        "Forks off and keeps its own version of history",
        "Switches to mining until they return",
      ],
      answer: 0,
      explain: `Halt, don't fork. Your node waits for its council; if the rest of the network still contains working quorums, *they* keep closing ledgers and your node catches up when its council returns.`,
    },
    {
      kind: "theory",
      body: `## What this buys builders

Because agreement is cheap, the network can afford to be **fast and small-fee by default**:

- Ledgers close about every **5 seconds** — a payment is *final*, not "probably final after 6 blocks".
- The base fee is **100 stroops** (0.00001 XLM) — spam is expensive at scale, humans barely notice it.
- Finality is real: once in the ledger, there is no re-org to fear.

Every lab in the Forge runs on top of this rhythm — you already felt it if you watched a transaction confirm in the wallet lab.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `The Campaign's Act VI — **The Constellation Gate** — walks this same sky hands-on: network passphrases, horizons, and your first star-charts. Optional, and worth the detour when you want the map behind the theory.`,
    },
  ],
  testOut: [
    { question: `How does a participant decide whose agreement it depends on?`,
      options: ["It names its own quorum slice — there is no official validator list, and enrolment is that naming","The protocol assigns it a set based on stake","The SDF publishes the authoritative validator set each protocol release"], answer: 0 },
    { question: `If everyone picks their own council, what keeps the network from splitting?`,
      options: ["Overlap — safety holds when circles of trust intersect enough, and in practice they do because participants independently name the same well-run institutions","A tie-breaker rule the protocol applies when groups disagree","A minimum number of validators that every slice must contain"], answer: 0 },
    { question: `SCP prefers safety over liveness. What does that mean when the network is in trouble?`,
      options: ["It halts rather than risk two conflicting histories — stopping is recoverable, disagreeing about the past is not",
        "It keeps producing ledgers and reconciles any fork afterwards",
        "It elects a temporary leader to break the deadlock"], answer: 0 },
    { question: `What does consensus without mining buy a builder, concretely?`,
      options: ["A ledger every few seconds with a fee measured in fractions of a cent, and one close as finality",
        "Higher throughput at the cost of slower finality",
        "Free transactions, since there are no miners to pay"], answer: 0 },
  ],
};
