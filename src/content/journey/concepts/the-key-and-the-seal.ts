import type { Concept } from "../types";

// Foundations II — keys, addresses and signing, with zero cryptography. The
// chapter also carries the single most valuable safety habit we can teach a
// newcomer (nobody ever needs your secret key), and hands off to the Forge's
// wallet lab, where the abstraction becomes a funded account on testnet.

export const theKeyAndTheSeal: Concept = {
  meta: {
    slug: "the-key-and-the-seal",
    title: "The Key and the Seal",
    tagline: "Your account is a key. Signing is a seal. That's the whole idea.",
    numeral: "II",
    arc: "foundations",
    level: 0,
    requires: ["the-book-no-one-can-erase"],
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/the-key-and-the-seal.webp",
    glyph: "🔑",
  },
  steps: [
    {
      kind: "theory",
      body: `## A password is a promise someone else keeps

When you log into your bank, you type a password and the bank *checks* it. Every part of that sentence hides a dependency: the bank holds the list, the bank decides you're you, the bank can lock you out, and if the bank's list leaks, so does your password.

The shared book from the last chapter has no bank in it. There is nobody sitting behind it to check anything.

So it uses something better: not a secret you *tell* someone, but a secret you *prove you have* — **without ever showing it**.`,
    },
    {
      kind: "theory",
      body: `## One key, two halves

Your account is a pair of matching halves, created together, on your own device:

- The **public** half is your address. It looks like \`GABC…7XQ\`. Share it freely — it is where people send you things, exactly like an email address. Publishing it is not a risk; it is the entire point of it.
- The **secret** half never leaves your hands. It looks like \`SDXY…4KP\`. It is the thing that *moves* what the address holds.

Two halves, one relationship: the public half can always be derived from the secret half, and **never the other way around**. That one-way street is what the whole arrangement rests on.

A useful way to hold it: your address is the mailbox everyone can see, your secret key is the only key that opens it.`,
    },
    {
      kind: "quiz",
      question: `A marketplace asks for "your Stellar address" so it can pay you. Which half do you send?`,
      options: [
        "The public one, starting with G — it's an address, meant to be shared",
        "The secret one, starting with S — otherwise the payment can't reach you",
        "Neither: addresses are private and payments are arranged by email",
      ],
      answer: 0,
      explain: `Receiving needs nothing but your address. If anyone claims a payment requires your secret key, the request itself is the fraud — and now you know it on sight.`,
    },
    {
      kind: "theory",
      body: `## Signing: a seal nobody can forge

Here is where the secret half earns its keep. To move something, you write the instruction — *"send 10 to Bruno"* — and your device **seals** it with your secret key.

The seal has three properties, and they're worth reading slowly:

1. **Only your key could have made it.** Nobody can forge it.
2. **Anyone can check it** against your public address, without ever seeing your secret half.
3. **It covers this exact instruction.** Change one digit of the amount and the seal falls apart.

That is a **signature**. The network doesn't know you, doesn't trust you, and doesn't need to — it just verifies that the seal matches the address the money is leaving.`,
    },
    {
      kind: "widget",
      component: "seal-sign",
      body: `Try it. Write something, seal it — then change a single character and watch the seal stop matching.`,
    },
    {
      kind: "theory",
      body: `## The part where people lose everything

Because there is no bank behind the book, there is also no "forgot my password", no support line, no reversal. That cuts both ways, and honesty about the sharp edge matters more than enthusiasm:

- **Lose the secret key → the funds stay there forever, visible to all, reachable by no one.** They are not "in" the key; the key is simply the only thing that can move them.
- **Someone else gets the secret key → they are you.** No appeal exists, because to the network nothing wrong ever happened: a valid seal moved valid funds.

Hence the one rule that survives every scam ever run in this space: **nobody legitimate ever needs your secret key.** Not support, not a giveaway, not a "wallet validation", not an admin in a group chat. Not once, not ever.`,
    },
    {
      kind: "quiz",
      question: `Someone messaging you as "network support" says your account is stuck and asks for your secret key (or your 24 recovery words) to unlock it. What is actually happening?`,
      options: [
        "It's theft — a secret key is never needed by anyone but you, and handing it over is handing over the account",
        "It's routine — support needs the key to sign the unlock on your behalf",
        "It's safe as long as you change the key right afterwards",
      ],
      answer: 0,
      explain: `There is no third answer. Every variation of this message — support, airdrops, "wallet validation", a friendly stranger — is the same theft wearing a different costume. The rule has no exceptions to memorize, which is exactly why it works.`,
    },
    {
      kind: "fill",
      prompt: `Fill in the rule that keeps an account safe:`,
      file: "NOTES.md",
      before: `Share the public key freely; the secret key `,
      after: ` .`,
      choices: [
        "never leaves your device",
        "is given only to verified support",
        "is emailed to yourself as a backup",
        "is posted with the transaction",
      ],
      answer: 0,
      explain: `And "email it to yourself" is the trap answer: an inbox is a copy of your key sitting in someone else's building, protected by a password. Back a key up offline, on paper or on a device, or not at all.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Enough theory — go make one. **Your First Wallet** in the Forge creates a real key pair, funds it on Stellar's test network, and shows you the account appearing as a line in the shared book, seconds after you sign for it. Test network, play money, real machinery.`,
    },
    {
      kind: "theory",
      body: `## What you now hold

An account is a key pair. An address is the half you share. A signature is the seal only your secret half can make and anyone can check. Losing that half is final, and nobody honest will ever ask you for it.

**Next:** the book can hold more than balances. It can hold *rules* — and those rules run themselves, with nobody in the middle deciding whether to honor them.`,
    },
  ],
};
