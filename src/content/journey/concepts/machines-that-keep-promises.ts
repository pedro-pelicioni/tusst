import type { Concept } from "../types";

// Foundations III — what a smart contract is, using no code and no Soroban
// vocabulary. Its real job is the handoff: by the last step the reader should
// feel that a contract executes the promise *as written*, which is exactly
// why the Craft arc opens on specs rather than on syntax.

export const machinesThatKeepPromises: Concept = {
  meta: {
    slug: "machines-that-keep-promises",
    title: "Machines That Keep Promises",
    tagline: "What a smart contract is: a rule that runs itself, nothing more mystical.",
    numeral: "III",
    arc: "foundations",
    level: 0,
    requires: ["the-key-and-the-seal"],
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/machines-that-keep-promises.webp",
    glyph: "⚙️",
  },
  steps: [
    {
      kind: "theory",
      body: `## The vending machine already did this

A vending machine is a promise with no person behind it: *put in 3, press B4, receive the crisps.* It doesn't like you, doesn't check your name, doesn't decide whether today is a good day to honor the deal. The rule is the machine.

Compare that to a promise held by a person — a landlord returning a deposit, a marketplace releasing a payment once the package arrives. Those promises are real too, but they depend on someone *choosing* to keep them, and on somewhere to complain if they don't.

A **contract** on a shared ledger is the first arrangement: the vending machine, for money and rules, sitting inside the book from Chapter I.`,
    },
    {
      kind: "theory",
      body: `## What it actually is

Strip the mystique and a contract is three ordinary things:

- **A place in the book that holds value.** It can own funds the way an account can, and it has an address like any account.
- **A fixed set of rules** — "if this, then that" — written once and then published for anyone to read.
- **No hands.** It acts only when someone pokes it with a signed instruction, and when it does, it follows its rules exactly.

Nobody "runs" it. There is no server to switch off, no company to email, no operator with an override. Once it's in the book, thousands of machines run it identically and agree on the result.`,
    },
    {
      kind: "diagram",
      body: "The whole machine, end to end:",
      caption: "Four steps, and a person appears in only the first one.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "poke",
            label: "a signed instruction arrives",
            note: "Nothing happens until someone pokes it. A contract has no hands of its own.",
            tone: "accent",
          },
          {
            id: "rules",
            label: "it checks its rules",
            note: "The same rules anyone can read. No judgment, no exceptions, no bad days.",
            tone: "neutral",
          },
          {
            id: "move",
            label: "it moves value",
            note: "It owns funds the way an account does, and moves them only as its rules say.",
            tone: "teal",
          },
          {
            id: "book",
            label: "the line is in the book",
            note: "Permanent, public, and impossible to undo — including when the rule was wrong.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Which everyday arrangement is closest to how a contract behaves?`,
      options: [
        "A vending machine: fixed rules, no judgment, acts only when someone puts something in",
        "A helpful clerk: reads the situation and decides what's fair case by case",
        "A signed paper agreement: written down, but enforced later by a court",
      ],
      answer: 0,
      explain: `The clerk has judgment and the paper needs an enforcer. A contract has neither — the enforcement *is* the execution. That's its strength and, as you're about to see, its sharpest edge.`,
    },
    {
      kind: "theory",
      body: `## What it cannot do (this list matters more)

Newcomers overestimate contracts in four specific ways, and every one of them is worth unlearning right now:

- **It knows nothing about the outside world.** Not today's dollar price, not whether a package arrived, not the weather. Someone must *send* it that information — and choosing who is allowed to is a decision with real consequences.
- **It cannot change its mind.** No "but obviously I meant…". It does what it says, to the letter.
- **It cannot be un-run.** A movement it made is a line in the book. There is no undo.
- **It is not private.** Its rules and every movement it ever made are public, permanently, to anyone who cares to look.`,
    },
    {
      kind: "quiz",
      question: `A contract is written to release funds "after the deadline". Its author privately meant *the buyer asks and receives*; the contract as written releases to whoever asks first. On day one, a stranger asks first and receives.

What went wrong?`,
      options: [
        "The rule as written was honored — the intention that never made it into writing simply didn't exist",
        "The contract malfunctioned and should be rolled back",
        "The stranger broke a rule and can be reported",
      ],
      answer: 0,
      explain: `Nothing malfunctioned, and that is the uncomfortable part. The machine kept the promise it was given, not the one in its author's head. Unwritten intentions have no force here at all.`,
    },
    {
      kind: "fill",
      prompt: `Complete the sentence a builder should carry from this chapter:`,
      file: "NOTES.md",
      before: `A contract keeps `,
      after: ` .`,
      choices: [
        "the promise you wrote, not the promise you meant",
        "your funds safe from every possible bug",
        "a private record only you can read",
        "the promise a court decides is fairest",
      ],
      answer: 0,
      explain: `Every expensive incident in this industry is a variation of this one line. Which is why the next stretch of the road doesn't start with code.`,
    },
    {
      kind: "labLink",
      labSlug: "treasure-chest",
      body: `You can watch one of these machines keep a promise on the real testnet, right now. The Forge's **Treasure Chest** lab locks funds into a ledger entry that belongs to nobody — until the one named claimant takes it. No escrow agent, no company holding the money, no one who *could* change their mind. The rule releases it, or nothing does.`,
    },
    {
      kind: "theory",
      body: `## Why this is the last easy chapter

You now have the whole ground floor: a book nobody can quietly edit, a key that proves who you are, and machines that keep written promises exactly as written.

Notice what that adds up to. If the machine does precisely what was written — and cannot be argued with, corrected, or undone — then **the writing is the job**. Not the typing: an AI will type faster than you and never tire. The deciding, the pinning-down, the "what must be true here, and what must never happen".

**Next, on the Craft road:** how to write that down properly, before a single line of code exists. And on the Realm road: the machinery of Stellar itself, from how thousands of machines agree, to the contracts you just met — this time from the inside.`,
    },
  ],
  // Dedicated test-out bank — see the note in the-book-no-one-can-erase.
  testOut: [
    {
      question: `What makes a contract different from a promise kept by a person?`,
      options: [
        "It runs its own rules, with nobody choosing whether to honour them",
        "It is written down, and a spoken promise is not",
        "It can be enforced in court, and a promise cannot",
      ],
      answer: 0,
    },
    {
      question: `Who runs a published contract?`,
      options: [
        "Nobody in particular — thousands of machines execute it identically and agree on the result",
        "The author, on a server they keep online for it",
        "The network's operators, who take turns",
      ],
      answer: 0,
    },
    {
      question: `When does a contract act?`,
      options: [
        "Only when somebody pokes it with a signed instruction",
        "Continuously, checking its conditions in the background",
        "Once a day, when the network sweeps its stored rules",
      ],
      answer: 0,
    },
    {
      question: `Can the author switch a published contract off?`,
      options: [
        "Not unless the contract's own published rules say so",
        "Yes — the author always keeps an override",
        "Only by asking the network's operators to remove it",
      ],
      answer: 0,
    },
  ],
};
