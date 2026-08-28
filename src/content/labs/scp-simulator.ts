import type { LabScenario } from "./types";

// Lab — "SCP: The Council of Nodes". Pure client simulation, no chain and no
// on-chain verify (empty verify[] = the claim endpoint pays on completion,
// the journey-chapter trust model). Doubles as the interactive heart of the
// journey's "The Realm of Stellar" chapter, which reuses the same ScpSim.

export const scpSimulator: LabScenario = {
  meta: {
    slug: "scp-simulator",
    title: "SCP: The Council of Nodes",
    tagline: "Build quorums, watch consensus converge, break it on purpose.",
    difficulty: "novice",
    estMinutes: 10,
    status: "live",
    emblem: "/v2/labs/emblems/scp-simulator.webp",
    glyph: "🕸",
  },
  steps: [
    {
      kind: "narrate",
      id: "intro",
      body: `## The council decides

No mining. No staking. Stellar closes a ledger every ~5 seconds because its validators run the **Stellar Consensus Protocol**: each node names a small **council** (its *quorum slice*) and moves when enough of that council moves.

Ahead of you sits a miniature network — seven validators across three organizations. You're going to make it agree… and then you're going to break it.`,
    },
    {
      kind: "sim",
      id: "sim-first-close",
      component: "scp-sim",
      body: `### First: make it agree

Press **Propose a ledger** and watch acceptance ripple outward, council by council, until every seat lights up — that's a ledger closing.

Close a few. Feel the rhythm.`,
    },
    {
      kind: "quiz",
      id: "quiz-local",
      question: `You watched acceptance spread node by node. What made each node light up?`,
      options: [
        "Enough of its own council had already accepted",
        "It received permission from a central coordinator",
        "It won a random lottery weighted by stake",
      ],
      answer: 0,
      explain: `All local: a node needs no census of the network, only its council. Overlapping councils turn local trust into global agreement.`,
    },
    {
      kind: "sim",
      id: "sim-break-it",
      component: "scp-sim",
      body: `### Now: break it

Strike down one node and propose — the network shrugs. Strike down more, concentrated in one region of trust, and find the moment the survivors **stall**.

Notice what they *don't* do: they never split into two competing histories.`,
    },
    {
      kind: "quiz",
      id: "quiz-safety",
      question: `You struck down enough of the council and the survivors froze instead of continuing. Why is that the *designed* behavior for a payments network?`,
      options: [
        "A paused payment is recoverable; a payment that later un-happens is not",
        "Freezing saves electricity during outages",
        "It gives the fallen nodes time to be replaced by miners",
      ],
      answer: 0,
      explain: `Safety over liveness: SCP halts rather than forks. Money that "settled" must stay settled — so when agreement is impossible, Stellar waits.`,
    },
    {
      kind: "quiz",
      id: "quiz-recovery",
      question: `You raise the fallen nodes again. What happens to the stalled seats?`,
      options: [
        "Their councils can be satisfied again — the network resumes closing ledgers",
        "They must re-download the chain from genesis",
        "Nothing; a stalled network is stalled forever",
      ],
      answer: 0,
      explain: `Try it in the simulator: raise the fallen, propose, and the rhythm returns. Stalls are pauses, not deaths.`,
    },
    {
      kind: "checkpoint",
      id: "claim",
      body: `You've closed ledgers, stalled a network, and healed it — the whole lifecycle of federated agreement, in one sitting. Seal the lab and take your XP.`,
    },
  ],
  // No chain, nothing to verify — completion is honor-based like a journey
  // chapter (the ledger's unique constraint still makes the XP replay-proof).
  verify: [],
};
