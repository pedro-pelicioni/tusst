import type { Concept } from "../types";

// Chapter VI — Soroban from the ledger's point of view: Wasm behind one
// operation, storage with a heartbeat (TTL + state archival), measured
// resource fees, and the simulate-then-sign flow every client follows.

export const theLivingContracts: Concept = {
  meta: {
    slug: "the-living-contracts",
    title: "The Living Contracts",
    tagline: "Soroban: Wasm, storage that expires, fees that make sense.",
    numeral: "VI",
    arc: "realm",
    level: 2,
    requires: ["machines-that-keep-promises", "gates-of-the-realm"],
    status: "live",
    estMinutes: 14,
    sigil: "/v2/journey/sigils/the-living-contracts.webp",
    glyph: "📦",
  },
  steps: [
    {
      kind: "theory",
      body: `## Contracts enter the realm

**Soroban** is Stellar's smart contract platform. A contract is **Rust compiled to WebAssembly**, uploaded to the ledger and executed inside a sandboxed host — every power it has (storage, crypto, calling other contracts) arrives through **host functions** the protocol provides.

And here is the elegant part: calling one needs no new transaction format. The envelope you dissected carries a single operation — \`invoke_host_function\` — and inside rides the call: which contract, which function, which arguments.

Same envelope, same signatures, same ~5-second close. The classic realm and the contract realm share one bloodstream.`,
    },
    {
      kind: "theory",
      body: `## Three shelves of storage

Soroban gives a contract three storage tiers — chosen per entry, priced differently:

- **Temporary** — cheap, short-lived, gone forever once it expires. Price quotes, nonces, time-boxed state.
- **Persistent** — the real archive: user balances, ownership records. Survives expiry through *archival* (next step).
- **Instance** — small state glued to the contract itself: admin address, configuration, the metadata every call needs.

Choosing the wrong shelf is a classic rookie tax: instance bloat makes every single call carry it, and temporary balances simply vanish. The shelf *is* part of the design.`,
    },
    {
      kind: "diagram",
      body: "Three shelves, three lifetimes:",
      caption: "State is rented, not owned. A contract nobody touches eventually stops paying rent and its data goes cold.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "instance",
            label: "instance",
            note: "The contract's own settings, living and dying with the contract itself.",
            tone: "gold",
          },
          {
            id: "persistent",
            label: "persistent",
            note: "User balances and anything that must survive. Archived if its rent lapses — recoverable, not lost.",
            tone: "accent",
          },
          {
            id: "temporary",
            label: "temporary",
            note: "Cheap and short-lived, for things that are allowed to vanish: nonces, sessions, rate limits.",
            tone: "teal",
          },
        ],
      },
    },
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
    {
      kind: "theory",
      body: `## The interface travels with the contract

A compiled Soroban contract is not a mystery blob. The build embeds a **contract spec** into the Wasm itself: every function, argument and type, machine-readable.

Tooling drinks straight from it — the CLI can print a deployed contract's interface, and clients **auto-generate fully typed bindings** from the on-chain Wasm. No hunting for ABI JSON files, no version drift between the contract and its docs: the ledger *is* the documentation.

Call a contract you have never seen, with types checked at compile time. That is the developer experience the spec buys.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `The Forge has a live lab for exactly this: open the **OpenZeppelin Token Wizard**, configure a real OZ token contract, and compile it through the Forge's own Soroban runner — spec, storage shelves and all. When the runner returns your Wasm, this chapter is the theory underneath every byte.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `Act VII of the Campaign puts the borrow checker to work on all of this — you write the Rust, compile the Wasm, and watch \`invoke_host_function\` carry *your* code onto the ledger. The full immersion is there whenever you want it.

Next chapter, a twist: contracts so capable they stop being apps — and become the **account itself**.`,
    },
  ],
};
