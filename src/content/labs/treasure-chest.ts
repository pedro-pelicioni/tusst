import type { LabScenario } from "./types";

// Lab — "The Treasure Chest". The first lab built on the Anvil's expanded
// classic operations: a claimable balance is a ledger entry that is nobody's
// balance until its claimant takes it.
//
// The balance id is NOT handed over by the engine — classic-op returns only a
// transaction hash — so the lab sends the learner to look it up on the chain
// instead. That is deliberate: finding your own entry in the ledger is the
// lesson, and it puts the Forge's ledger explorer to work.

export const treasureChest: LabScenario = {
  meta: {
    slug: "treasure-chest",
    title: "The Treasure Chest",
    tagline: "Lock gold in a chest only its named claimant can open.",
    difficulty: "novice",
    estMinutes: 9,
    status: "live",
    emblem: "/v2/labs/emblems/treasure-chest.webp",
    glyph: "🧰",
  },
  steps: [
    {
      kind: "narrate",
      id: "intro",
      body: `## Gold that is nobody's, yet

Every balance you have met so far belongs to an account. A **claimable balance** belongs to no one: it is a ledger entry of its own, holding an amount, naming who may take it, and under what condition.

The sender no longer has the gold. The claimant does not have it either — not until they reach in. In between, it sits on the ledger, visible to everyone, spendable by exactly one address.

That is how escrow, airdrops, vesting and "here, take this when you're ready" all get built without a single line of contract code.`,
    },
    {
      kind: "action",
      id: "forge-keys",
      title: "Bring your keys",
      body: `The same keypair the Forge uses. If you already forged one in another lab, this simply picks it back up.`,
      cta: "Ready the keys",
      action: { type: "generate-keypair", target: "wallet" },
      successBody: `Working as \`{address}\`.`,
    },
    {
      kind: "action",
      id: "fund",
      title: "Fund the account",
      body: `A claimable balance costs its creator a reserve — the ledger charges for every entry it has to store. You need XLM before you can lock any away.`,
      cta: "Summon Friendbot",
      action: { type: "friendbot" },
      successBody: `Funded: {balance} XLM.

Remember that number. In two steps it will be smaller by more than the amount you lock — because the chest itself has a rent.`,
      explorer: "account",
    },
    {
      kind: "quiz",
      id: "quiz-nature",
      question: `You lock 5 XLM into a claimable balance for a friend. Before they claim it, whose balance holds those 5 XLM?`,
      options: [
        "Nobody's — it sits as its own ledger entry until the claimant takes it",
        "Still yours, just marked as reserved",
        "Already your friend's, they simply haven't noticed",
      ],
      explain: `This is what makes it different from a pending payment. The entry exists, the funds are committed, and the only account that can move them is the one named on it.`,
      answer: 0,
    },
    {
      kind: "action",
      id: "lock",
      title: "Lock the chest",
      body: `Five XLM, claimable by you. Naming yourself is the honest way to learn the mechanic — everything works identically when the claimant is someone else.

The condition here is **unconditional**: claimable the moment it exists. Stellar also lets you say "not before this time", which is how a vesting schedule or a midnight unlock is written.`,
      cta: "Lock 5 XLM away",
      action: {
        type: "classic-op",
        ops: (ctx) => [
          {
            type: "create-claimable-balance",
            amount: "5",
            claimant: ctx.walletAddress ?? "",
          },
        ],
      },
      successBody: `The chest is on the ledger.

Your XLM balance dropped by more than five: the extra half is the **reserve** for the entry itself. Claim the balance later and that reserve comes back — the ledger rents space, it does not sell it.`,
      explorer: "tx",
    },
    {
      kind: "input",
      id: "balance-id",
      prompt: `## Find your own chest

The engine never handed you the chest's id — a transaction hash is not a balance id. So go and read the ledger.

Open the **Forge → ledger**, choose *claimable balances*, and put your own address in the claimant field. Your chest is the entry with \`5.0000000\` in it. Copy its \`id\` — 72 hex characters — and paste it here.`,
      stateKey: "balanceId",
      placeholder: "0000000000…",
      pattern: "^[0-9a-fA-F]{72}$",
      hint: "72 hex characters, starting with several zeros.",
    },
    {
      kind: "action",
      id: "claim",
      title: "Open the chest",
      body: `You are the named claimant, and the condition is met. Take the gold back.`,
      cta: "Claim the balance",
      action: {
        type: "classic-op",
        ops: (ctx) => [
          {
            type: "claim-claimable-balance",
            balanceId: ctx.state.balanceId ?? "",
          },
        ],
      },
      successBody: `Claimed. The entry is gone from the ledger, the five XLM are back in your balance — and so is the half-XLM reserve that was paying its rent.

Try the ledger query again: the chest no longer exists. What remains is the *operation* in your history, which is exactly what proves you did this.`,
      explorer: "tx",
    },
    {
      kind: "quiz",
      id: "quiz-predicate",
      question: `You want a chest your co-founder can open **only after the vesting cliff**, one year out. What changes?`,
      options: [
        "The claimant's predicate — \"not before that date\" instead of unconditional",
        "You have to deploy a contract to hold it",
        "Nothing — you just ask them politely to wait",
      ],
      explain: `Predicates compose: before/after a time, and/or/not of other predicates. A whole class of escrow never needs a contract at all — and what needs no contract cannot have a contract bug.`,
      answer: 0,
    },
    {
      kind: "checkpoint",
      id: "claim-xp",
      body: `You locked value into an entry that belonged to no one, found it by reading the ledger yourself, and took it back.

The server is about to check your operation history for that \`create_claimable_balance\`. It does not take your word for it — it never does.`,
    },
  ],
  verify: [{ check: "account-exists" }, { check: "claimable-balance-created" }],
};
