import type { Concept } from "../types";

// Realm V — the exchange that lives inside the protocol: order books as ledger
// entries, and pools as the standing water beside them. Path payments — the
// operation that spends this machinery without you ever touching it — are
// Realm VI, because "there is a market in here" and "you never have to shop in
// it" are different lessons.

export const riversOfValue: Concept = {
  meta: {
    slug: "rivers-of-value",
    title: "The DEX & Liquidity Pools",
    tagline: "The DEX & liquidity pools: a currency exchange inside the protocol itself.",
    numeral: "VI",
    arc: "realm",
    level: 2,
    requires: ["accounts-trust-and-assets"],
    status: "live",
    estMinutes: 11,
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
      kind: "theory",
      body: `## The same trade, two venues

Books and pools are not rivals with a winner. They fail in opposite directions, and the ledger carries both on purpose.

Say you want 5,000 USDC of XLM.

**The order book** fills you against whatever people actually posted. If a market maker is quoting tight, you get a price nobody could beat — real offers, real prices, no curve. If nobody is watching that pair this morning, the book is thin or empty, and you fill badly or not at all. A book's quality is somebody's attention.

**The pool** always quotes. It has no opinion, no hours and no day off — the curve prices your order whether or not anyone is awake. What it charges for that reliability is slippage: you pay for the privilege of being able to trade at 3 a.m. against nobody.

So the honest summary is boring: **the book is better when someone is minding it, and the pool is better when nobody is.** Which is precisely why aggregators exist, and why you should not be picking a venue by hand.`,
    },
    {
      kind: "widget",
      component: "amm-pool",
      body: `The curve is easier felt than read. **Sell into the pool** — then move the same order into a shallower one and watch what the price does to you.`,
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
      kind: "fill",
      prompt: `Complete what a constant-product pool actually promises:`,
      file: "NOTES.md",
      before: `A pool will always quote you a price. What it does not promise is that the price stays put — the bigger your order is relative to the pool, the `,
      after: ` .`,
      choices: [
        "worse the price you end up paying",
        "smaller the fee you are charged",
        "longer the trade takes to settle",
        "more likely the trade is rejected",
      ],
      answer: 0,
      explain: `The pool cannot run out and it cannot refuse you — that is the whole point of the curve. What it does instead is charge you more for every unit as you drain one side, so a large order in a small pool completes perfectly and expensively.`,
    },
    {
      kind: "theory",
      body: `## You will never do this by hand

You now know there is a market inside the ledger: books that match at close, pools that quote from a curve, and a price that moves when you lean on it.

Here is the part that makes it useful: **you are almost never going to interact with any of it directly.** You will not place an offer, walk the book, or pick a pool. You will state what you are sending and what must arrive — and something else will do the shopping.

**Next:** the operation that spends this entire machine on your behalf, in one atomic step.`,
    },
  ],
  testOut: [
    {
      question: `Who matches a buy offer with a sell offer on the Stellar DEX?`,
      options: [
        "The protocol itself, at ledger close — offers are ledger entries and matching is part of consensus",
        "A matching-engine smart contract maintained by the SDF",
        "Off-chain relayers who submit matched pairs for a cut",
      ],
      answer: 0,
    },
    {
      question: `What does it take to create a market for a new asset pair on the DEX?`,
      options: [
        "Two trustlines and an offer — every pair gets a book automatically, with no listing and no permission",
        "An application to the SDF, which curates which pairs are tradeable",
        "Deploying a market contract for that pair",
      ],
      answer: 0,
    },
    {
      question: `An order book needs active traders quoting prices. What does a liquidity pool need instead?`,
      options: [
        "Only deposits — the constant-product curve quotes a price at every moment without anyone watching",
        "A market maker bot, which the pool pays out of fees",
        "An oracle feeding it the current external price",
      ],
      answer: 0,
    },
    {
      question: `Your order is large relative to the pool. What happens?`,
      options: [
        "It completes, at a progressively worse price — the curve charges more for each unit as you drain one side",
        "It is rejected, because the pool cannot cover it",
        "It is queued until enough liquidity is deposited",
      ],
      answer: 0,
    },
  ],
};
