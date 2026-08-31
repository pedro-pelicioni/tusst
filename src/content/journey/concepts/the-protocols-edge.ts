import type { Concept } from "../types";

// Chapter IX — the protocol as a living thing: CAPs vs SEPs, named
// upgrades voted in by validators, SDK majors tracking protocol versions,
// and the testnet-to-mainnet window a builder learns to surf.

export const theProtocolsEdge: Concept = {
  meta: {
    slug: "the-protocols-edge",
    title: "The Protocol's Edge",
    tagline: "CAPs, SEPs, named upgrades — riding a living protocol.",
    numeral: "XV",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-protocols-edge.webp",
    glyph: "⚡",
  },
  steps: [
    {
      kind: "theory",
      body: `## A protocol that levels up

Everything you have studied — SCP, path payments, Soroban, ZK host functions — arrived in **numbered protocol versions**, and new ones keep coming.

Upgrades on Stellar are not chaotic hard forks. **Validators vote**: when enough of the network agrees, the upgrade activates at a chosen ledger and every node steps forward **together**. One network before, one network after.

That is SCP doing double duty — the same consensus that agrees on transactions also agrees on *the rules themselves*. A blockchain is software; this one ships releases like it knows it.`,
    },
    {
      kind: "theory",
      body: `## Two rivers of change: CAPs and SEPs

Change flows through two channels, and the split is worth memorizing:

- **CAPs** — *Core Advancement Proposals* — change the **protocol itself**: consensus, ledger rules, new host functions, fee mechanics. They need validator votes because every node must execute identically.
- **SEPs** — *Stellar Ecosystem Proposals* — the standards **around** the chain: wallet-anchor flows, token interfaces, stellar.toml. Adopted by implementation, not by vote.

Chain law versus trade custom. CAP-59 gave you ZK curves; SEP-24 gave you deposit flows. Different rivers, both public, both shaped in open discussion.`,
    },
    {
      kind: "diagram",
      body: "How a change reaches the ledger you are building on:",
      caption: "Nobody upgrades your code for you — but nobody changes the rules under you overnight either.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "draft",
            label: "a CAP is drafted",
            note: "Anyone may write one. It argues for a change to the protocol itself.",
            tone: "neutral",
          },
          {
            id: "review",
            label: "review in the open",
            note: "Discussed, revised, and often rejected. This is the slow part, deliberately.",
            tone: "accent",
          },
          {
            id: "vote",
            label: "validators vote",
            note: "The network upgrades only when enough validators agree to run it.",
            tone: "teal",
          },
          {
            id: "you",
            label: "your turn",
            note: "Bump the SDK, re-run your tests, redeploy. The date is public months ahead.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `You want (a) a new host function in the protocol and (b) a new wallet-to-anchor flow. Which documents do you write?`,
      options: [
        "(a) a CAP — it changes core; (b) a SEP — it's an ecosystem standard",
        "(a) a SEP — host functions are ecosystem; (b) a CAP — anchors are core",
        "Both are CAPs — SEPs are only for token listings",
      ],
      answer: 0,
      explain: `The test: must every validator execute it identically? Then it's core — a CAP. If it's a convention that services agree on over HTTP, it's a SEP.`,
    },
    {
      kind: "theory",
      body: `## The recent cadence, by name

Upgrades get names now, and the rhythm is brisk:

- **Protocol 26 "Yardstick"** — a precision-and-reliability release; with Protocol 25 it completed the BN254 + Poseidon ZK toolkit from last chapter.
- **Protocol 27 "Zipper"** — mainnet **July 2026**, carrying **CAP-71** authentication delegation for smart accounts.
- **Protocol 28 "Adapter"** — **testnet upgraded August 27, 2026**; mainnet scheduled for **September 16, 2026**.

Roughly a season apart, each named, each announced with upgrade guides. The realm does not drift into the future — it marches on a published schedule.`,
    },
    {
      kind: "theory",
      body: `## What an upgrade asks of you

A protocol release is also a **tooling release**. SDK majors track protocol versions: **js-stellar-sdk v17.0.0 is the Protocol 28 release** — when the network steps to 28, you step to the SDK built for it.

The builder's drill:

1. Read the **upgrade guide** when the version is announced.
2. Bump SDKs and the CLI in a branch.
3. **Test on testnet during the window** — testnet upgrades weeks before mainnet precisely so you can.

As of late August 2026 that window is **open right now**: testnet already runs 28; mainnet follows September 16.`,
    },
    {
      kind: "quiz",
      question: `It's early September 2026 and your app runs on mainnet (Protocol 27). What's the professional move?`,
      options: [
        "Point staging at testnet — already on Protocol 28 — update to SDK v17, and fix issues before mainnet upgrades September 16",
        "Do nothing — mainnet upgrades are always fully compatible with old SDKs",
        "Freeze all deployments until the protocol stabilizes for a year",
      ],
      answer: 0,
      explain: `The testnet-first window exists exactly for this rehearsal. Most upgrades are smooth — but "developers must update their SDKs" is written on the Protocol 28 announcement for a reason.`,
    },
    {
      kind: "fill",
      prompt: `Pin the SDK that speaks Protocol 28.`,
      file: "package.json",
      before: `"@stellar/stellar-sdk": "`,
      after: `"`,
      choices: ["^17.0.0", "^16.2.0", "^28.0.0", "^2.8.0"],
      answer: 0,
      explain: `Majors track protocols, but the numbers differ: v17 is the Protocol 28 release (v17.0.1 shipped August 25, 2026), while older majors target older protocols. Reading the release title tells you which network version an SDK speaks.`,
    },
    {
      kind: "theory",
      body: `## Watching the edge

Surfing a living protocol is a reading habit, not a heroic effort:

- The **stellar.org dev blog** — upgrade announcements, dates, and "what builders must do" guides.
- The **CAP repository** on GitHub — proposals long before they ship; today's draft is next year's host function.
- **Open protocol meetings** — where CAPs are debated in public.

Half an hour a month keeps you ahead of every deadline in this chapter. The builder who reads upgrade notes surfs the wave; the one who doesn't gets versioned out.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-protocol-27-1",
      body: `The Campaign's **Act VIII** does this chapter for real: you take a working project through a protocol upgrade hands-on — bumping SDKs, reading release notes, testing against the new version like a professional crew.

And with that, the realm is mapped — consensus to contracts, gates to veils, edge to edge. What remains is the best part: **go build in it**. The Forge is open.`,
    },
  ],
  testOut: [
    { question: `What is a CAP, and how does it differ from a SEP?`,
      options: ["A CAP changes the protocol itself and ships in a numbered release; a SEP standardises how services talk to each other and needs no protocol change",
        "A CAP is a draft and a SEP is its ratified form",
        "A CAP governs contracts and a SEP governs classic operations"], answer: 0 },
    { question: `Why does it matter that protocol upgrades are numbered and named?`,
      options: ["A feature exists as of a specific protocol version, so \"does Stellar support this?\" is really \"which protocol is this network on?\"",
        "The numbering determines the order in which validators apply changes",
        "Named releases are the only ones the SDF supports in production"], answer: 0 },
    { question: `A feature is live on testnet but not yet on mainnet. What does that tell you?`,
      options: ["The protocol release reached testnet first — building against it is fine, shipping to real users is not, until mainnet follows",
        "The feature was rejected and testnet is where it is retired",
        "Nothing; testnet and mainnet always run the same protocol"], answer: 0 },
    { question: `Why should a builder read the protocol's changelog rather than only its documentation?`,
      options: ["Documentation describes what is true now; the changelog is where you see what is about to be true, and in time to prepare for it",
        "Documentation is often out of date, and the changelog replaces it",
        "The changelog contains the only authoritative API reference"], answer: 0 },
  ],
};
