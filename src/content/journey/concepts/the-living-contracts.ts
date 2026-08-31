import type { Concept } from "../types";

// Realm IX — the contract itself: Wasm on the ledger, the three shelves of
// storage, and the interface that travels with the code. What it costs to keep
// state alive and what a call costs to make are Realm X, because "where does
// data live" and "who pays rent on it" are separate lessons and the second one
// is the one that produces outages.

export const theLivingContracts: Concept = {
  meta: {
    slug: "the-living-contracts",
    title: "The Living Contracts",
    tagline: "Soroban: Wasm on the ledger, and three shelves to put state on.",
    numeral: "X",
    arc: "realm",
    level: 2,
    requires: ["the-common-tongue"],
    status: "live",
    estMinutes: 11,
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
      body: `## The interface travels with the contract

A compiled Soroban contract is not a mystery blob. The build embeds a **contract spec** into the Wasm itself: every function, argument and type, machine-readable.

Tooling drinks straight from it — the CLI can print a deployed contract's interface, and clients **auto-generate fully typed bindings** from the on-chain Wasm. No hunting for ABI JSON files, no version drift between the contract and its docs: the ledger *is* the documentation.

Call a contract you have never seen, with types checked at compile time. That is the developer experience the spec buys.`,
    },
    {
      kind: "quiz",
      question: `You are storing a user's session nonce, which is meaningless a few minutes after it is issued. Which shelf?`,
      options: [
        "Temporary — the cheapest rent, and forgetting it is exactly what you want",
        "Persistent, so it can be restored if a call arrives late",
        "Instance, so it disappears if the contract is ever archived",
      ],
      answer: 0,
      explain: `Matching the shelf to the data's actual lifetime is the whole design decision, and it is one people get wrong in the safe-looking direction: putting short-lived data on the persistent shelf costs more forever, for a guarantee the data never needed.`,
    },
    {
      kind: "fill",
      prompt: `Complete what a deployed contract carries with it:`,
      file: "NOTES.md",
      before: `A caller does not need your documentation to invoke a contract, because its `,
      after: ` can be read from the deployed code itself.`,
      choices: ["interface", "source code", "author's address", "audit report"],
      answer: 0,
      explain: `The source is not on the ledger — compiled Wasm is — and neither an address nor an audit tells a tool what functions exist or what they take. The interface travelling with the code is why tooling can build a call against a contract nobody documented.`,
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
    {
      kind: "theory",
      body: `## Nothing here is free

You can now say what a Soroban contract is, where its data lives, and how anyone calls it without your documentation.

What none of that told you is the part that wakes teams up at night: **state is rented, not owned.** Every entry on every shelf has a clock, and the shelves differ in exactly one way that matters — what happens when a clock reaches zero.

Get that wrong and the failure does not look like a bug. It looks like a contract that worked for six months and then, one Tuesday, started answering that the data does not exist.

**Next:** the heartbeat, and the bill.`,
    },
  ],
  testOut: [
    {
      question: `What is a Soroban contract, on the ledger?`,
      options: [
        "Compiled Wasm stored on the ledger, with an address, invoked through a transaction operation like any other verb",
        "A script the validators interpret from source at call time",
        "An off-chain service the protocol calls out to when needed",
      ],
      answer: 0,
    },
    {
      question: `Why does Soroban offer three separate kinds of storage rather than one?`,
      options: [
        "Different data has different value over time, and the shelves price and expire it differently",
        "Each kind is optimised for a different data size",
        "Older contracts use one kind and newer ones another",
      ],
      answer: 0,
    },
    {
      question: `What does it mean that the interface travels with the contract?`,
      options: [
        "The contract's spec is readable from the deployed code itself, so tooling can call it without external documentation",
        "The interface is registered in a public directory maintained by the SDF",
        "Callers must be given a client library by the contract's author",
      ],
      answer: 0,
    },
    {
      question: `Where does a contract call ride?`,
      options: [
        "Inside the same transaction envelope you already know, as an invoke_host_function operation",
        "On a separate contract-only channel with its own consensus",
        "Directly to a validator over RPC, bypassing the ledger",
      ],
      answer: 0,
    },
  ],
};
