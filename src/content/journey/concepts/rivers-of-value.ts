import type { Concept } from "../types";

// Chapter IV — value in motion: the on-ledger DEX, native AMM pools, and
// path payments that convert currencies mid-flight in one atomic stroke.
// The remittance story is the thread that ties the machinery together.

export const riversOfValue: Concept = {
  meta: {
    slug: "rivers-of-value",
    title: "Rivers of Value",
    tagline: "Payments, path payments, the DEX and the AMMs.",
    numeral: "IV",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/rivers-of-value.webp",
    glyph: "🌊",
  },
  steps: [
    {
      kind: "theory",
      body: `## Rivers, not vaults

You already dissected a plain \`payment\`: one asset, A to B, final in ~5 seconds. That is a canal — straight, useful, boring.

The interesting part is that Stellar's ledger is not just a vault of balances. It carries a **full currency exchange inside the protocol**: order books, liquidity pools, and payment operations that *trade while they travel*.

No external exchange, no bridge, no wrapped detour — conversion is a native power of the ledger. This chapter follows the water: first the offers, then the pools, then the operation that makes remittances feel like magic.`,
    },
    {
      kind: "theory",
      body: `## An order book *on* the ledger

The **Stellar DEX** is not a contract someone deployed — it is protocol machinery.

- \`manage_sell_offer\` / \`manage_buy_offer\` place an offer: *"I give X, I want Y, at this price."*
- Each offer is a **ledger entry**, sitting in the order book like any other state.
- **Matching happens at ledger close**: when offers cross, the protocol executes the trade as part of consensus itself.

Every asset pair gets an order book automatically — no listings, no permission from a market operator. Two trustlines and an offer, and you *are* the market.`,
    },
    {
      kind: "quiz",
      question: `Who matches a buy offer with a sell offer on the Stellar DEX?`,
      options: [
        "The protocol itself, at ledger close — offers are ledger entries and matching is part of consensus",
        "A matching-engine smart contract maintained by the SDF",
        "Off-chain relayers who submit matched pairs for a cut",
      ],
      answer: 0,
      explain: `This is the rare chain where the exchange lives *in* the protocol. No deployed matcher means no matcher to hack, bribe, or rug — and trades settle with the same finality as payments.`,
    },
    {
      kind: "theory",
      body: `## Pools: the standing water

Order books need active traders quoting prices. **Liquidity pools** need only deposits:

- Anyone deposits a pair of assets into a **constant-product pool** — the same x · y = k curve Uniswap made famous.
- Trades push the ratio; arbitrage pulls it back; depositors earn a small fee on every swap.
- On Stellar these pools are **protocol-native ledger entries** — not contracts — managed with \`liquidity_pool_deposit\` and \`liquidity_pool_withdraw\`.

Books and pools coexist on equal footing, and — as you are about to see — a single payment can drink from both.`,
    },
    {
      kind: "quiz",
      question: `How do Stellar's native liquidity pools differ from Uniswap-style AMMs?`,
      options: [
        "They are protocol features — ledger entries managed by operations, not deployed contracts",
        "They use order-book matching internally instead of a pricing curve",
        "They only support pairs that include XLM",
      ],
      answer: 0,
      explain: `Same constant-product math, different home: the pool lives in the protocol itself, any asset pair welcome. Contract-based AMMs exist too, one layer up — you'll meet their names shortly.`,
    },
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
};
