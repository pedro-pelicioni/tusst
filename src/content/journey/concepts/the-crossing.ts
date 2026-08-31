import type { Concept } from "../types";

// Realm VI — path payments, split out of Rivers of Value. Send one asset,
// deliver another, atomically, with the protocol doing the shopping. The
// widget carries the property nobody believes until they watch it: if no
// route clears your bound, the payment simply does not happen.

export const theCrossing: Concept = {
  meta: {
    slug: "the-crossing",
    title: "The Crossing",
    tagline: "Path payments: send one currency, deliver another, atomically.",
    numeral: "VII",
    arc: "realm",
    level: 2,
    requires: ["rivers-of-value"],
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/the-crossing.webp",
    glyph: "🛶",
  },
  steps: [
    {
      kind: "theory",
      body: `## Path payments: the killer feature

\`path_payment_strict_send\` does something almost no other chain does natively: **send one asset, deliver another** — atomically, in one operation.

You send USDC. The network routes it through order books and liquidity pools — maybe USDC → XLM → EURC — and your grandmother receives EURC. One transaction. If no route can deliver within your bounds, **nothing happens at all**: no funds stranded mid-swap.

Two flavors:

- **Strict send** — fix what you pay; the destination receives what the route yields (above your minimum).
- **Strict receive** — fix what they get; you pay what it costs (below your maximum).`,
    },
    {
      kind: "diagram",
      body: "One payment, three currencies, one atomic transaction:",
      caption: "If any hop cannot fill at the price you set, nothing happens at all — no half-converted money stranded in the middle.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "send",
            label: "you send BRL",
            note: "You never touch the currencies in between, and never hold them.",
            tone: "accent",
          },
          {
            id: "hop1",
            label: "BRL → XLM",
            note: "The order book fills this hop at whatever the market offers right now.",
            tone: "teal",
          },
          {
            id: "hop2",
            label: "XLM → EURC",
            note: "And the next one, in the same instant, inside the same transaction.",
            tone: "teal",
          },
          {
            id: "recv",
            label: "they receive EURC",
            note: "Guaranteed amount, or the whole thing reverts. There is no partial arrival.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "widget",
      component: "path-payment",
      body: `**Send a payment across currencies** and watch which route the protocol picks as the amount grows — then demand more than any of them can deliver, and watch the whole thing simply not happen.`,
    },
    {
      kind: "quiz",
      question: `An invoice is exactly 900 EURC and your treasury holds USDC. Which operation fits?`,
      options: [
        "path_payment_strict_receive — pin the 900 EURC delivered, cap the USDC you'll spend",
        "path_payment_strict_send — send about 900 USDC worth and hope the rate lands near even",
        "Two transactions: swap USDC for EURC on the DEX, then a plain payment",
      ],
      answer: 0,
      explain: `Strict receive exists exactly for "the bill is fixed" cases. And one atomic operation beats swap-then-send: no price drift between steps, no leftover dust, no half-completed state to clean up.`,
    },
    {
      kind: "fill",
      prompt: `Chart the river — what happens between sending and delivery in a path payment?`,
      file: "remittance.txt",
      before: `send 100 USDC  →  `,
      after: `  →  deliver EURC — one atomic transaction`,
      choices: [
        "route through order books and liquidity pools",
        "bridge through wrapped tokens on another chain",
        "queue at an anchor's FX desk for conversion",
        "auction the payment to market-maker bots",
      ],
      answer: 0,
      explain: `The routing is on-ledger and atomic: the protocol walks offers and pools to find delivery, and either the whole path executes at ledger close or none of it does.`,
    },
    {
      kind: "theory",
      body: `## The bound is the whole design

Everything above hangs on one number you supply: the least you will accept, or the most you will spend. Both ways of getting it wrong are quiet.

**Too tight** and your payments simply stop happening. Not loudly — a path payment that cannot clear its bound reverts, which looks identical to a payment nobody sent. Somewhere a queue fills with transfers that "didn't go through", and the cause is a tolerance somebody set once and never revisited.

**Too loose** and you have written a blank cheque to whatever the route happens to cost at the moment your envelope lands. The protocol will honour a terrible price as faithfully as a good one; the bound is the only thing that ever said no.

The working habit is not clever, just disciplined: **quote first, then set the bound from that quote plus a tolerance you chose on purpose.** A bound copied from an example, or left at a round number because it looked reasonable, is a number nobody is responsible for — and it is the one deciding whether your users get paid.`,
    },
    {
      kind: "theory",
      body: `## The property that makes it usable

Every part of this could go wrong. The route could be thin, the price could move between the moment you signed and the moment it executed, a hop could fail to fill.

And the answer to all of it is the same, which is what makes path payments something you can actually build a business on: **either the whole path executes at ledger close, or none of it does.**

There is no state where your BRL left, became XLM, and stopped. No half-converted balance sitting in a currency nobody asked for. No support ticket that begins *"the money is somewhere in the middle."*

That is not a nicety. It is the difference between a payment rail and a science experiment — and it is why the bound you set is not a preference but the contract: *deliver at least this much, or do not touch my funds.*`,
    },
    {
      kind: "theory",
      body: `## Why remittance builders come here

The old rails: a cross-border transfer hops between correspondent banks for **2–5 days** and sheds a few percent in fees along the way.

The river: dollars become USDC at one edge, a **path payment** converts and delivers EURC in about **five seconds** for a fee measured in fractions of a cent, and euros come out the other edge.

The FX conversion — historically the expensive, opaque middle — becomes a transparent hop across public order books and pools. Cross-currency settlement in seconds is the use case Stellar was pointed at from day one.`,
    },
    {
      kind: "theory",
      body: `## The layer above the river

On top of the native machinery, the ecosystem builds in Soroban: **Soroswap**, **Phoenix** and **Aquarius** run AMM protocols as smart contracts, and aggregators route each trade across native books, native pools and contract pools hunting the best price. You don't need their internals yet — just know the river has both a bedrock and a busy harbor built on top.

One question remains open: where do the *real* dollars and euros enter and leave? That is the business of anchors — the gates of the realm, and the next chapter.`,
    },
  ],
  testOut: [
    {
      question: `What does \`path_payment_strict_send\` do that a plain payment cannot?`,
      options: [
        "Send one asset and deliver a different one, routing through books and pools inside a single atomic operation",
        "Send to several destinations at once",
        "Schedule a payment to execute at a future ledger",
      ],
      answer: 0,
    },
    {
      question: `An invoice is exactly 900 EURC and your treasury holds USDC. Which operation fits?`,
      options: [
        "path_payment_strict_receive — pin the 900 EURC delivered, cap the USDC you will spend",
        "path_payment_strict_send — send roughly 900 USDC worth and hope the rate lands near even",
        "Two transactions: swap on the DEX, then a plain payment",
      ],
      answer: 0,
    },
    {
      question: `No route can deliver within the bound you set. What happens to your funds?`,
      options: [
        "Nothing at all — the whole path executes or none of it does, so there is no half-converted balance anywhere",
        "They convert as far as the route got, and the remainder is returned next ledger",
        "They are held by the protocol until a route opens",
      ],
      answer: 0,
    },
    {
      question: `Why should an application not hard-code which route a payment takes?`,
      options: [
        "The best route depends on the amount — the thinnest book often quotes the best rate and collapses under size",
        "Routes are private and cannot be inspected before submission",
        "The protocol charges more for a route you specified yourself",
      ],
      answer: 0,
    },
  ],
};
