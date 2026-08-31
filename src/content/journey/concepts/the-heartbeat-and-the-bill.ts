import type { Concept } from "../types";

// Realm X — state archival and fees, split out of The Living Contracts. The
// widget is the payload: the three shelves are identical until the clock hits
// zero, and that moment is the entire design decision.

export const theHeartbeatAndTheBill: Concept = {
  meta: {
    slug: "the-heartbeat-and-the-bill",
    title: "The Heartbeat and the Bill",
    tagline: "State is rented, and a call is measured — not auctioned.",
    numeral: "XI",
    arc: "realm",
    level: 2,
    requires: ["the-living-contracts"],
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-heartbeat-and-the-bill.webp",
    glyph: "⏳",
  },
  steps: [
    {
      kind: "theory",
      body: `## State has a heartbeat

Most chains let state pile up forever — every node drags around every abandoned entry from 2019. Stellar refuses: **every Soroban entry has a TTL** (time-to-live), counted in ledgers, and rent extends it.

When the TTL runs out:

- **Temporary** entries are deleted. Gone.
- **Persistent** and **instance** entries are **archived** — evicted from the live ledger, but restorable later with a proof, returning exactly as they were.

This is **state archival**, and no other major chain does it. The live ledger stays lean, validators stay cheap, history stays recoverable.`,
    },
    {
      kind: "widget",
      component: "state-archival",
      body: `The three shelves look identical while the clock is running. **Let the ledgers pass** on each one and watch what happens at zero — that moment is the entire difference between them.`,
    },
    {
      kind: "theory",
      body: `## One contract, three shelves

Abstract shelves become a design decision the moment you have real data. Take a simple escrow contract:

- **The admin address and the fee rate** go on **instance** storage. They belong to the contract itself, they are read on almost every call, and if the contract is archived they should go with it — there is nothing to salvage from a fee rate whose contract no longer exists.
- **Each open escrow** goes on **persistent** storage. Somebody's funds are in there. If its TTL lapses the entry must still be recoverable, because "we forgot" is not an acceptable answer to "where is my money".
- **A short-lived quote** a caller fetches before committing goes on **temporary** storage. It is worthless in ten minutes and nobody should pay rent to keep it.

Notice the question that decided each one. Not "how important is this?" — the fee rate is critical and still belongs on instance. The question is: **what should happen to this if nobody touches it for a long time?** Keep it with the contract, keep it recoverable, or let it go.

Get that backwards and the failure is quiet. Escrow entries on temporary storage do not throw an error on the day you write them. They work perfectly, for months.`,
    },
    {
      kind: "quiz",
      question: `Your contract tracks each user's token balance. Which storage tier?`,
      options: [
        "Persistent — balances must outlive any TTL lapse and be restorable from the archive",
        "Temporary — it's cheapest, and users can re-deposit if it expires",
        "Instance — balances belong to the contract, so they ride with it",
      ],
      answer: 0,
      explain: `Temporary deletion is *permanent* — a vanished balance is a rug-pull by negligence. And instance storage loads with every single call, so stuffing per-user data there makes everyone pay for everyone.`,
    },
    {
      kind: "fill",
      prompt: `Put the balance on the right shelf.`,
      file: "token/src/lib.rs",
      before: `env.storage().`,
      after: `().set(&user, &balance);`,
      choices: ["persistent", "temporary", "instance", "eternal"],
      answer: 0,
      explain: `The soroban-sdk mirrors the tiers one to one: \`env.storage().persistent()\`, \`.temporary()\`, \`.instance()\`. There is no \`eternal\` — that's the entire point of the rent design.`,
    },
    {
      kind: "theory",
      body: `## Fees that are measured, not auctioned

On gas-auction chains you *bid* for blockspace and pray; one popular mint can multiply everyone's costs.

Soroban **meters** instead. A transaction declares its **resources** — CPU instructions, memory, ledger reads and writes, bytes — and the fee is *computed* from those measured needs, plus rent for the storage it touches. Declare honestly (simulation does this for you) and the refundable portion of any over-estimate comes back.

The result is a cost you can quote in advance: "this action costs about a cent" stays true even when the network is having a busy day.`,
    },
    {
      kind: "theory",
      body: `## Simulate first, sign exactly that

Every Soroban client follows one rhythm:

1. **Simulate** the call against an RPC node — no signature, no cost.
2. The simulation returns the **footprint** — precisely which ledger entries the call will read and write — plus resource estimates and the auth it needs.
3. You **sign exactly what you simulated** and submit.

The signed transaction carries its footprint, so validators know its whole world before executing it; nothing outside the footprint may be touched. Skip simulation and you are guessing numbers the network will simply reject.`,
    },
    {
      kind: "quiz",
      question: `Why does the Soroban flow simulate before signing?`,
      options: [
        "Simulation computes the footprint and resource needs, so you sign a transaction with exact, enforceable bounds",
        "It's a courtesy dry-run for debugging — production apps skip it",
        "Simulation pre-executes the call so validators don't have to run it again",
      ],
      answer: 0,
      explain: `Validators always re-execute — but only within the declared footprint. Simulation is how a transaction learns its own bounds; the ledger then enforces them to the byte.`,
    },
  ],
  testOut: [
    {
      question: `A temporary entry's TTL reaches zero. What happens to the data?`,
      options: [
        "It is deleted — there is no restore for temporary storage, at any price",
        "It is archived and can be restored for a fee, like any other entry",
        "It is kept but becomes read-only until bumped",
      ],
      answer: 0,
    },
    {
      question: `A persistent entry's TTL reaches zero. What happens?`,
      options: [
        "It is archived, not deleted — calls that need it fail until someone restores it, and restoring is a fee",
        "It is deleted, the same as a temporary entry",
        "The contract is paused until the entry is rewritten",
      ],
      answer: 0,
    },
    {
      question: `Why does the protocol charge rent on state at all?`,
      options: [
        "Because state costs every validator storage forever, so a one-time write fee would let anyone impose an unbounded ongoing cost",
        "To discourage contracts from storing anything on-chain",
        "To fund validator operations, which are paid from archival fees",
      ],
      answer: 0,
    },
    {
      question: `What is the point of simulating a contract call before signing it?`,
      options: [
        "Simulation returns the exact resources and footprint the call needs, and you sign that — so the fee is measured rather than guessed at",
        "It checks the contract's source for known vulnerabilities",
        "It reserves a slot in the next ledger so the call cannot be crowded out",
      ],
      answer: 0,
    },
  ],
};
