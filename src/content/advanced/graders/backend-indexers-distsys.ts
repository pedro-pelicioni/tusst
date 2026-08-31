import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Indexers & Distributed Systems — hidden grading data.

export const backendIndexersDistsysGraders: Record<
  string,
  AdvancedLessonContent
> = {
  "backend-indexers-distsys-1": {
    instructions: `## Index a ledger, get killed, resume

An indexer is four things: a **source** of ordered ledger events, a **cursor** naming the last one you finished, a **processor** that folds each event into state, and a **store** holding both. The cursor lives in the store — that is what makes it a checkpoint rather than a variable.

Resumption is a filter, not a seek: \`e.seq <= store.cursor\` is skipped. The store is a \`Vec\` of pairs and not a \`HashMap\` because iteration order has to be deterministic for the output to be reproducible.

The \`budget\` parameter stands in for the crash.

### Your task

1. \`Store::apply\` adds \`e.delta\` to \`e.account\`, pushing the account if it is not present yet.
2. \`run\` skips events at or below \`store.cursor\`, applies at most \`budget\` of the rest, advances \`store.cursor\` to \`e.seq\` after each apply, and prints the trace line.
3. In \`main\`: run 1 with a budget of 5, print the checkpoint, print the kill line, then run 2 with \`usize::MAX\`, print the checkpoint, then print the account table.

Expected output:

\`\`\`text
run 1: resume from cursor=0
  seq=1 alice   100
  seq=2 bob      50
  seq=3 alice   -30
  seq=4 carol    20
  seq=5 bob      -5
  checkpoint cursor=5
-- process killed, store survives --
run 2: resume from cursor=5
  seq=6 alice    60
  seq=7 carol    15
  seq=8 bob      25
  checkpoint cursor=8
account balance
alice       130
bob          70
carol        35
\`\`\`

### Hints

- Trace line: \`println!("  seq={} {:<6}{:>5}", e.seq, e.account, e.delta);\`
- Table row: \`println!("{:<8}{:>7}", account, balance);\`
- Count applied events in a local \`done\` and \`break\` when it reaches \`budget\` — the \`continue\` for already-processed events must come first, or the budget is spent on skips.
`,
    starterCode: `#[derive(Clone, Copy)]
struct LedgerEvent {
    seq: u64,
    account: &'static str,
    delta: i64,
}

struct Store {
    balances: Vec<(&'static str, i64)>,
    cursor: u64,
}

impl Store {
    fn new() -> Store {
        Store {
            balances: Vec::new(),
            cursor: 0,
        }
    }

    fn apply(&mut self, e: LedgerEvent) {
        // add e.delta to e.account, pushing the account if it is not there yet
    }
}

fn run(store: &mut Store, source: &[LedgerEvent], budget: usize) {
    // skip events at or below store.cursor, apply at most \`budget\` of the rest,
    // advance store.cursor to e.seq after each apply, and print the trace line
}

fn main() {
    let source = [
        LedgerEvent { seq: 1, account: "alice", delta: 100 },
        LedgerEvent { seq: 2, account: "bob", delta: 50 },
        LedgerEvent { seq: 3, account: "alice", delta: -30 },
        LedgerEvent { seq: 4, account: "carol", delta: 20 },
        LedgerEvent { seq: 5, account: "bob", delta: -5 },
        LedgerEvent { seq: 6, account: "alice", delta: 60 },
        LedgerEvent { seq: 7, account: "carol", delta: 15 },
        LedgerEvent { seq: 8, account: "bob", delta: 25 },
    ];

    let mut store = Store::new();
    // run 1 with a budget of 5, print the checkpoint, then run 2 unbounded,
    // then print the account/balance table
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the store carries its own cursor",
        kind: "struct_defined",
        struct: "Store",
        fields: [
          { name: "balances", ty: "Vec<(&'static str, i64)>" },
          { name: "cursor", ty: "u64" },
        ],
      },
      {
        name: "resumption is driven by the persisted cursor",
        kind: "any_of",
        of: [
          { kind: "expr_present", expr: "e.seq <= store.cursor" },
          { kind: "expr_present", expr: "e.seq > store.cursor" },
        ],
      },
      {
        name: "advances the cursor to the sequence just applied",
        kind: "expr_present",
        expr: "store.cursor = e.seq",
      },
      {
        name: "the processor is a reusable function, not inlined in main",
        kind: "fn_defined",
        fn: "run",
      },
      {
        name: "keeps store iteration deterministic (no HashMap)",
        kind: "expr_present",
        expr: "HashMap::new",
        forbidden: true,
      },
    ],
    expectedOutput: `run 1: resume from cursor=0
  seq=1 alice   100
  seq=2 bob      50
  seq=3 alice   -30
  seq=4 carol    20
  seq=5 bob      -5
  checkpoint cursor=5
-- process killed, store survives --
run 2: resume from cursor=5
  seq=6 alice    60
  seq=7 carol    15
  seq=8 bob      25
  checkpoint cursor=8
account balance
alice       130
bob          70
carol        35
`,
    referenceSolution: `#[derive(Clone, Copy)]
struct LedgerEvent {
    seq: u64,
    account: &'static str,
    delta: i64,
}

struct Store {
    balances: Vec<(&'static str, i64)>,
    cursor: u64,
}

impl Store {
    fn new() -> Store {
        Store {
            balances: Vec::new(),
            cursor: 0,
        }
    }

    fn apply(&mut self, e: LedgerEvent) {
        for slot in self.balances.iter_mut() {
            if slot.0 == e.account {
                slot.1 += e.delta;
                return;
            }
        }
        self.balances.push((e.account, e.delta));
    }
}

fn run(store: &mut Store, source: &[LedgerEvent], budget: usize) {
    let mut done = 0usize;
    for e in source {
        if e.seq <= store.cursor {
            continue;
        }
        if done == budget {
            break;
        }
        store.apply(*e);
        store.cursor = e.seq;
        done += 1;
        println!("  seq={} {:<6}{:>5}", e.seq, e.account, e.delta);
    }
}

fn main() {
    let source = [
        LedgerEvent { seq: 1, account: "alice", delta: 100 },
        LedgerEvent { seq: 2, account: "bob", delta: 50 },
        LedgerEvent { seq: 3, account: "alice", delta: -30 },
        LedgerEvent { seq: 4, account: "carol", delta: 20 },
        LedgerEvent { seq: 5, account: "bob", delta: -5 },
        LedgerEvent { seq: 6, account: "alice", delta: 60 },
        LedgerEvent { seq: 7, account: "carol", delta: 15 },
        LedgerEvent { seq: 8, account: "bob", delta: 25 },
    ];

    let mut store = Store::new();

    println!("run 1: resume from cursor={}", store.cursor);
    run(&mut store, &source, 5);
    println!("  checkpoint cursor={}", store.cursor);

    println!("-- process killed, store survives --");

    println!("run 2: resume from cursor={}", store.cursor);
    run(&mut store, &source, usize::MAX);
    println!("  checkpoint cursor={}", store.cursor);

    println!("account balance");
    for (account, balance) in &store.balances {
        println!("{:<8}{:>7}", account, balance);
    }
}
`,
  },

  "backend-indexers-distsys-2": {
    instructions: `## Measure both orderings against one crash

Every indexer step is two writes — the effect on the store, and the cursor commit — and a crash can land between them.

**Cursor-first** is at-most-once: the checkpoint says \`seq=3\` is done, the balance never moved, and no restart re-reads it. **Effect-first** is at-least-once: the effect landed, the checkpoint did not, so the restart replays \`seq=3\`. One of those is recoverable from data you still hold.

### Your task

1. \`drain\` walks events past \`store.cursor\`. Under \`Order::CursorFirst\` it commits the cursor **before** the effect; under \`Order::EffectFirst\`, **after**. It returns \`true\` on reaching \`e.seq == crash_at\`, leaving the half-finished state behind, and prints the trace line only for steps that complete.
2. In \`main\`, for each ordering: build a fresh \`Store\`, print the label, drain with \`crash_at = 3\`, and if it crashed print the restart line and drain again with \`crash_at = 0\`.
3. Then print the summary table and the two verdict lines.

Expected output:

\`\`\`text
cursor-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=3
  seq=4 total=70 cursor=4
  seq=5 total=120 cursor=5
effect-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=2
  seq=3 total=90 cursor=3
  seq=4 total=130 cursor=4
  seq=5 total=180 cursor=5
ordering      applies  total  expected
cursor-first        4    120       150
effect-first        6    180       150
cursor-first lost seq=3: no restart can recover it
effect-first applied seq=3 twice: dedupe can recover it
\`\`\`

### Hints

- Trace: \`println!("  seq={} total={} cursor={}", e.seq, store.total, store.cursor);\`
- Summary row: \`println!("{:<14}{:>7}{:>7}{:>10}", label(*order), applies, total, expected);\`
- \`for order in [Order::CursorFirst, Order::EffectFirst]\` iterates an array by value because \`Order\` is \`Copy\`.
- Collect \`(order, store.total, store.applies)\` into a \`Vec\` so the table prints after both runs.
`,
    starterCode: `#[derive(Clone, Copy)]
struct Event {
    seq: u64,
    amount: i64,
}

#[derive(Clone, Copy, PartialEq)]
enum Order {
    CursorFirst,
    EffectFirst,
}

struct Store {
    total: i64,
    cursor: u64,
    applies: u32,
}

fn drain(store: &mut Store, events: &[Event], order: Order, crash_at: u64) -> bool {
    // for each event past store.cursor: under CursorFirst commit the cursor
    // before the effect, under EffectFirst commit it after. Return true if
    // e.seq == crash_at is reached, leaving the half-finished state behind.
    false
}

fn label(order: Order) -> &'static str {
    if order == Order::CursorFirst {
        "cursor-first"
    } else {
        "effect-first"
    }
}

fn main() {
    let events = [
        Event { seq: 1, amount: 10 },
        Event { seq: 2, amount: 20 },
        Event { seq: 3, amount: 30 },
        Event { seq: 4, amount: 40 },
        Event { seq: 5, amount: 50 },
    ];
    let expected: i64 = 150;

    // run both orderings with crash_at = 3, restart each after the crash,
    // then print the summary table and the two verdict lines
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "both orderings run through one drain function",
        kind: "fn_defined",
        fn: "drain",
      },
      {
        name: "branches on the commit ordering",
        kind: "expr_present",
        expr: "order == Order::CursorFirst",
      },
      {
        name: "injects the crash at the configured sequence",
        kind: "expr_present",
        expr: "e.seq == crash_at",
      },
      {
        name: "commits the cursor as its own write",
        kind: "expr_present",
        expr: "store.cursor = e.seq",
      },
      {
        name: "resumes from the persisted cursor after the crash",
        kind: "expr_present",
        expr: "e.seq <= store.cursor",
      },
    ],
    expectedOutput: `cursor-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=3
  seq=4 total=70 cursor=4
  seq=5 total=120 cursor=5
effect-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=2
  seq=3 total=90 cursor=3
  seq=4 total=130 cursor=4
  seq=5 total=180 cursor=5
ordering      applies  total  expected
cursor-first        4    120       150
effect-first        6    180       150
cursor-first lost seq=3: no restart can recover it
effect-first applied seq=3 twice: dedupe can recover it
`,
    referenceSolution: `#[derive(Clone, Copy)]
struct Event {
    seq: u64,
    amount: i64,
}

#[derive(Clone, Copy, PartialEq)]
enum Order {
    CursorFirst,
    EffectFirst,
}

struct Store {
    total: i64,
    cursor: u64,
    applies: u32,
}

fn drain(store: &mut Store, events: &[Event], order: Order, crash_at: u64) -> bool {
    for e in events {
        if e.seq <= store.cursor {
            continue;
        }
        if order == Order::CursorFirst {
            store.cursor = e.seq;
            if e.seq == crash_at {
                return true;
            }
            store.total += e.amount;
            store.applies += 1;
        } else {
            store.total += e.amount;
            store.applies += 1;
            if e.seq == crash_at {
                return true;
            }
            store.cursor = e.seq;
        }
        println!("  seq={} total={} cursor={}", e.seq, store.total, store.cursor);
    }
    false
}

fn label(order: Order) -> &'static str {
    if order == Order::CursorFirst {
        "cursor-first"
    } else {
        "effect-first"
    }
}

fn main() {
    let events = [
        Event { seq: 1, amount: 10 },
        Event { seq: 2, amount: 20 },
        Event { seq: 3, amount: 30 },
        Event { seq: 4, amount: 40 },
        Event { seq: 5, amount: 50 },
    ];
    let expected: i64 = 150;

    let mut summary: Vec<(Order, i64, u32)> = Vec::new();

    for order in [Order::CursorFirst, Order::EffectFirst] {
        let mut store = Store { total: 0, cursor: 0, applies: 0 };
        println!("{}", label(order));
        let crashed = drain(&mut store, &events, order, 3);
        if crashed {
            println!("  CRASH during seq=3, restart from cursor={}", store.cursor);
            drain(&mut store, &events, order, 0);
        }
        summary.push((order, store.total, store.applies));
    }

    println!("ordering      applies  total  expected");
    for (order, total, applies) in &summary {
        println!("{:<14}{:>7}{:>7}{:>10}", label(*order), applies, total, expected);
    }
    println!("cursor-first lost seq=3: no restart can recover it");
    println!("effect-first applied seq=3 twice: dedupe can recover it");
}
`,
  },

  "backend-indexers-distsys-3": {
    instructions: `## Make the processor idempotent

At-least-once means the same event id can arrive twice, events can arrive out of order, and the whole stream can be redelivered after a restart. All three happen in \`delivered\`.

Idempotency is a property of the processor, not the transport: keep the applied event ids in the same store as the data, check before the effect, record as part of the same write. The dedupe key must be the producer-assigned event id: ids 2 and 5 are byte-identical payments of 40 to bob and both must land, while id 2 arriving twice must land once. A payload hash cannot tell those two cases apart.

### Your task

1. \`apply_naive\` credits unconditionally.
2. \`apply_idempotent\` returns early when \`e.id\` is already in \`self.seen\`; otherwise it records the id and credits.
3. In \`main\`, feed \`delivered\` to both stores twice, printing a row per pass, then print the exactly-once total, the idempotent balance table, and the seen-set size.

Expected output:

\`\`\`text
pass  naive  idempotent
   1    305         265
   2    610         265
exactly-once total: 265
account balance
alice       125
bob          80
carol        60
distinct event ids retained: 5
\`\`\`

### Hints

- Pass row: \`println!("{:>4}{:>7}{:>12}", pass, naive.total(), safe.total());\`
- \`unique.iter().map(|e| e.amount).sum::<i64>()\` gives the exactly-once total.
- The seen-set is unbounded here. In production it is a unique index on the event id, or a window keyed by the cursor.
`,
    starterCode: `#[derive(Clone, Copy)]
struct Event {
    id: u64,
    account: &'static str,
    amount: i64,
}

struct Store {
    balances: Vec<(&'static str, i64)>,
    seen: Vec<u64>,
}

impl Store {
    fn new() -> Store {
        Store {
            balances: Vec::new(),
            seen: Vec::new(),
        }
    }

    fn credit(&mut self, account: &'static str, amount: i64) {
        for slot in self.balances.iter_mut() {
            if slot.0 == account {
                slot.1 += amount;
                return;
            }
        }
        self.balances.push((account, amount));
    }

    fn apply_naive(&mut self, e: Event) {
        // credit unconditionally
    }

    fn apply_idempotent(&mut self, e: Event) {
        // return early if this event id was already applied, otherwise record
        // the id and credit
    }

    fn total(&self) -> i64 {
        self.balances.iter().map(|s| s.1).sum()
    }
}

fn main() {
    let unique = [
        Event { id: 1, account: "alice", amount: 100 },
        Event { id: 2, account: "bob", amount: 40 },
        Event { id: 3, account: "alice", amount: 25 },
        Event { id: 4, account: "carol", amount: 60 },
        // id 5 is byte-identical to id 2 and is a second, real payment.
        Event { id: 5, account: "bob", amount: 40 },
    ];
    // at-least-once delivery: id 2 arrives twice, id 3 arrives before id 2.
    let delivered = [unique[0], unique[2], unique[1], unique[1], unique[3], unique[4]];

    // feed \`delivered\` to both stores twice, printing a row per pass, then the
    // exactly-once total, the idempotent balance table and the seen-set size
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "defines the idempotent processor",
        kind: "fn_defined",
        fn: "apply_idempotent",
      },
      {
        name: "dedupes on the event id",
        kind: "method_called",
        method: "contains",
        args: "&e.id",
      },
      {
        name: "records the id in the same store as the balances",
        kind: "expr_present",
        expr: "self.seen.push(e.id)",
      },
      {
        name: "the naive path still applies unconditionally",
        kind: "expr_present",
        expr: "self.credit(e.account, e.amount)",
      },
      {
        name: "does not dedupe on the payload amount",
        kind: "method_called",
        method: "contains",
        args: "&e.amount",
        forbidden: true,
      },
    ],
    expectedOutput: `pass  naive  idempotent
   1    305         265
   2    610         265
exactly-once total: 265
account balance
alice       125
bob          80
carol        60
distinct event ids retained: 5
`,
    referenceSolution: `#[derive(Clone, Copy)]
struct Event {
    id: u64,
    account: &'static str,
    amount: i64,
}

struct Store {
    balances: Vec<(&'static str, i64)>,
    seen: Vec<u64>,
}

impl Store {
    fn new() -> Store {
        Store {
            balances: Vec::new(),
            seen: Vec::new(),
        }
    }

    fn credit(&mut self, account: &'static str, amount: i64) {
        for slot in self.balances.iter_mut() {
            if slot.0 == account {
                slot.1 += amount;
                return;
            }
        }
        self.balances.push((account, amount));
    }

    fn apply_naive(&mut self, e: Event) {
        self.credit(e.account, e.amount);
    }

    fn apply_idempotent(&mut self, e: Event) {
        if self.seen.contains(&e.id) {
            return;
        }
        self.seen.push(e.id);
        self.credit(e.account, e.amount);
    }

    fn total(&self) -> i64 {
        self.balances.iter().map(|s| s.1).sum()
    }
}

fn main() {
    let unique = [
        Event { id: 1, account: "alice", amount: 100 },
        Event { id: 2, account: "bob", amount: 40 },
        Event { id: 3, account: "alice", amount: 25 },
        Event { id: 4, account: "carol", amount: 60 },
        // id 5 is byte-identical to id 2 and is a second, real payment.
        Event { id: 5, account: "bob", amount: 40 },
    ];
    // at-least-once delivery: id 2 arrives twice, id 3 arrives before id 2.
    let delivered = [unique[0], unique[2], unique[1], unique[1], unique[3], unique[4]];

    let mut naive = Store::new();
    let mut safe = Store::new();

    println!("pass  naive  idempotent");
    for pass in 1..=2 {
        for e in delivered.iter() {
            naive.apply_naive(*e);
            safe.apply_idempotent(*e);
        }
        println!("{:>4}{:>7}{:>12}", pass, naive.total(), safe.total());
    }

    println!("exactly-once total: {}", unique.iter().map(|e| e.amount).sum::<i64>());
    println!("account balance");
    for (account, balance) in &safe.balances {
        println!("{:<8}{:>7}", account, balance);
    }
    println!("distinct event ids retained: {}", safe.seen.len());
}
`,
  },

  "backend-indexers-distsys-4": {
    instructions: `## Roll back to the fork, reapply the branch

A block's **parent hash**, not its height, tells you whether it extends your chain. \`b3\` arrives at height 3 with parent \`a2\` while the head is \`a5\` — on height alone that looks like a duplicate or a gap.

Rollback runs head-downwards, applying the inverse of each block's effect, and stops at the fork point. Reverse order matters as soon as effects are non-commutative.

### Your task

1. \`apply\` credits the block, pushes it onto the chain, and prints the apply line.
2. \`rollback_to\` pops blocks above \`height\` from the head down, crediting the inverse delta for each and printing a rollback line.
3. In \`main\`: index the canonical chain and \`report\`; print the reorg line; find the fork by locating \`branch[0].parent\` in the chain and taking that block's height; \`rollback_to\` it; print the fork-point line; apply the branch; \`report\`; print the closing line about carol.

Expected output:

\`\`\`text
  apply    a1 height=1 alice +100
  apply    a2 height=2 bob +50
  apply    a3 height=3 alice +30
  apply    a4 height=4 carol +20
  apply    a5 height=5 bob +10
head=a5 height=5
  alice    130
  bob       60
  carol     20
b3 arrives: parent=a2, our head=a5 -> reorg
  rollback a5 height=5 bob -10
  rollback a4 height=4 carol -20
  rollback a3 height=3 alice -30
  fork point height=2 hash=a2
  apply    b3 height=3 alice +5
  apply    b4 height=4 dave +70
  apply    b5 height=5 bob +10
  apply    b6 height=6 alice +15
head=b6 height=6
  alice    120
  bob       60
  carol      0
  dave      70
carol was credited in a4 and confirmed for 2 blocks; that credit is now gone
\`\`\`

### Hints

- \`println!("  apply    {} height={} {} {:+}", b.hash, b.height, b.account, b.delta);\` — \`{:+}\` always prints the sign.
- \`while let Some(b) = self.chain.last().copied()\` gives you the head without holding a borrow across the \`pop\`.
- \`self.chain.iter().position(|b| b.hash == branch[0].parent).map(|i| self.chain[i].height).unwrap_or(0)\`.
`,
    starterCode: `#[derive(Clone, Copy)]
struct Block {
    height: u64,
    hash: &'static str,
    parent: &'static str,
    account: &'static str,
    delta: i64,
}

struct Indexer {
    balances: Vec<(&'static str, i64)>,
    chain: Vec<Block>,
}

impl Indexer {
    fn head(&self) -> &'static str {
        match self.chain.last() {
            Some(b) => b.hash,
            None => "genesis",
        }
    }

    fn credit(&mut self, account: &'static str, delta: i64) {
        for slot in self.balances.iter_mut() {
            if slot.0 == account {
                slot.1 += delta;
                return;
            }
        }
        self.balances.push((account, delta));
    }

    fn apply(&mut self, b: Block) {
        // credit the block, push it onto the chain, print the apply line
    }

    fn rollback_to(&mut self, height: u64) {
        // pop blocks above \`height\` from the head down, crediting the inverse
        // delta for each, printing a rollback line
    }

    fn report(&self) {
        println!("head={} height={}", self.head(), self.chain.len());
        for (account, balance) in &self.balances {
            println!("  {:<7}{:>5}", account, balance);
        }
    }
}

fn main() {
    let canonical = [
        Block { height: 1, hash: "a1", parent: "genesis", account: "alice", delta: 100 },
        Block { height: 2, hash: "a2", parent: "a1", account: "bob", delta: 50 },
        Block { height: 3, hash: "a3", parent: "a2", account: "alice", delta: 30 },
        Block { height: 4, hash: "a4", parent: "a3", account: "carol", delta: 20 },
        Block { height: 5, hash: "a5", parent: "a4", account: "bob", delta: 10 },
    ];
    let branch = [
        Block { height: 3, hash: "b3", parent: "a2", account: "alice", delta: 5 },
        Block { height: 4, hash: "b4", parent: "b3", account: "dave", delta: 70 },
        Block { height: 5, hash: "b5", parent: "b4", account: "bob", delta: 10 },
        Block { height: 6, hash: "b6", parent: "b5", account: "alice", delta: 15 },
    ];

    let mut ix = Indexer { balances: Vec::new(), chain: Vec::new() };
    // index the canonical chain and report, then find the fork point by
    // locating branch[0].parent in the chain, roll back to it, apply the
    // branch, report again, and print the closing line about carol
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "unwinds to the fork point",
        kind: "fn_defined",
        fn: "rollback_to",
      },
      {
        name: "applies the inverse delta when rolling a block back",
        kind: "expr_present",
        expr: "self.credit(b.account, -b.delta)",
      },
      {
        name: "unwinds from the head downwards",
        kind: "method_called",
        method: "pop",
        receiver: "self.chain",
      },
      {
        name: "locates the fork by parent hash, not by height",
        kind: "expr_present",
        expr: "b.hash == branch[0].parent",
      },
      {
        name: "keeps the applied blocks so the effects can be inverted",
        kind: "struct_defined",
        struct: "Indexer",
        fields: [
          { name: "balances", ty: "Vec<(&'static str, i64)>" },
          { name: "chain", ty: "Vec<Block>" },
        ],
      },
    ],
    expectedOutput: `  apply    a1 height=1 alice +100
  apply    a2 height=2 bob +50
  apply    a3 height=3 alice +30
  apply    a4 height=4 carol +20
  apply    a5 height=5 bob +10
head=a5 height=5
  alice    130
  bob       60
  carol     20
b3 arrives: parent=a2, our head=a5 -> reorg
  rollback a5 height=5 bob -10
  rollback a4 height=4 carol -20
  rollback a3 height=3 alice -30
  fork point height=2 hash=a2
  apply    b3 height=3 alice +5
  apply    b4 height=4 dave +70
  apply    b5 height=5 bob +10
  apply    b6 height=6 alice +15
head=b6 height=6
  alice    120
  bob       60
  carol      0
  dave      70
carol was credited in a4 and confirmed for 2 blocks; that credit is now gone
`,
    referenceSolution: `#[derive(Clone, Copy)]
struct Block {
    height: u64,
    hash: &'static str,
    parent: &'static str,
    account: &'static str,
    delta: i64,
}

struct Indexer {
    balances: Vec<(&'static str, i64)>,
    chain: Vec<Block>,
}

impl Indexer {
    fn head(&self) -> &'static str {
        match self.chain.last() {
            Some(b) => b.hash,
            None => "genesis",
        }
    }

    fn credit(&mut self, account: &'static str, delta: i64) {
        for slot in self.balances.iter_mut() {
            if slot.0 == account {
                slot.1 += delta;
                return;
            }
        }
        self.balances.push((account, delta));
    }

    fn apply(&mut self, b: Block) {
        self.credit(b.account, b.delta);
        self.chain.push(b);
        println!("  apply    {} height={} {} {:+}", b.hash, b.height, b.account, b.delta);
    }

    fn rollback_to(&mut self, height: u64) {
        while let Some(b) = self.chain.last().copied() {
            if b.height <= height {
                break;
            }
            self.chain.pop();
            self.credit(b.account, -b.delta);
            println!("  rollback {} height={} {} {:+}", b.hash, b.height, b.account, -b.delta);
        }
    }

    fn report(&self) {
        println!("head={} height={}", self.head(), self.chain.len());
        for (account, balance) in &self.balances {
            println!("  {:<7}{:>5}", account, balance);
        }
    }
}

fn main() {
    let canonical = [
        Block { height: 1, hash: "a1", parent: "genesis", account: "alice", delta: 100 },
        Block { height: 2, hash: "a2", parent: "a1", account: "bob", delta: 50 },
        Block { height: 3, hash: "a3", parent: "a2", account: "alice", delta: 30 },
        Block { height: 4, hash: "a4", parent: "a3", account: "carol", delta: 20 },
        Block { height: 5, hash: "a5", parent: "a4", account: "bob", delta: 10 },
    ];
    let branch = [
        Block { height: 3, hash: "b3", parent: "a2", account: "alice", delta: 5 },
        Block { height: 4, hash: "b4", parent: "b3", account: "dave", delta: 70 },
        Block { height: 5, hash: "b5", parent: "b4", account: "bob", delta: 10 },
        Block { height: 6, hash: "b6", parent: "b5", account: "alice", delta: 15 },
    ];

    let mut ix = Indexer { balances: Vec::new(), chain: Vec::new() };
    for b in canonical.iter() {
        ix.apply(*b);
    }
    ix.report();

    println!("{} arrives: parent={}, our head={} -> reorg", branch[0].hash, branch[0].parent, ix.head());
    let fork = ix
        .chain
        .iter()
        .position(|b| b.hash == branch[0].parent)
        .map(|i| ix.chain[i].height)
        .unwrap_or(0);
    ix.rollback_to(fork);
    println!("  fork point height={} hash={}", fork, ix.head());
    for b in branch.iter() {
        ix.apply(*b);
    }
    ix.report();
    println!("carol was credited in a4 and confirmed for 2 blocks; that credit is now gone");
}
`,
  },

  "backend-indexers-distsys-5": {
    instructions: `## Encode the machine, and make it reject

A status column with six string values is not a state machine. The machine is the transition relation \`allowed(from, to)\`, and its value is entirely in what it returns false for.

The catch-all \`_ => false\` is the design: every edge you did not write down is refused by construction. Terminal states are the ones with no outgoing arm — \`Confirmed\` and \`Failed\` each get none, which is how a late duplicate webhook fails to resurrect a confirmed transaction.

\`Submitted -> Confirmed\` is refused even though it is the outcome everyone wants: skipping \`Pending\` destroys the record of the transaction having been in the mempool.

### Your task

1. \`allowed\` matches on \`(from, to)\`. Legal edges: \`Received -> Validating\`, \`Validating -> Submitted\`, \`Submitted -> Pending\`, \`Pending -> Confirmed\`, and \`-> Failed\` from each of \`Received\`, \`Validating\`, \`Submitted\` and \`Pending\`. Everything else is \`_ => false\`.
2. \`Tx::transition\` applies the move if \`allowed\`, otherwise increments \`rejected\` and leaves the state untouched — printing the from/to/verdict line either way.
3. In \`main\`, print the header, drive every proposed transition, print the final line, then count the outgoing edges of \`Confirmed\` and \`Failed\`.

Expected output:

\`\`\`text
from        -> to          verdict
Received    -> Validating  accepted
Validating  -> Submitted   accepted
Submitted   -> Confirmed   REJECTED
Submitted   -> Pending     accepted
Pending     -> Confirmed   accepted
Confirmed   -> Failed      REJECTED
Confirmed   -> Pending     REJECTED
final=Confirmed rejected=3
Confirmed has 0 outgoing transitions
Failed has 0 outgoing transitions
\`\`\`

### Hints

- Verdict line: \`println!("{:<11} -> {:<11} accepted", name(from), name(to));\`
- Count outgoing edges by filtering all six statuses through \`allowed\`: \`[..].iter().filter(|t| allowed(*s, **t)).count()\`.
- Capture \`let from = self.status;\` before mutating, so the line prints the state you left.
`,
    starterCode: `#[derive(Clone, Copy, PartialEq)]
enum Status {
    Received,
    Validating,
    Submitted,
    Pending,
    Confirmed,
    Failed,
}

fn name(s: Status) -> &'static str {
    match s {
        Status::Received => "Received",
        Status::Validating => "Validating",
        Status::Submitted => "Submitted",
        Status::Pending => "Pending",
        Status::Confirmed => "Confirmed",
        Status::Failed => "Failed",
    }
}

fn allowed(from: Status, to: Status) -> bool {
    // match on (from, to): one arm per legal edge, everything else false.
    // Confirmed and Failed are terminal — they get no outgoing arm.
    false
}

struct Tx {
    status: Status,
    rejected: u32,
}

impl Tx {
    fn transition(&mut self, to: Status) {
        // apply the move if \`allowed\`, otherwise count it and leave the state
        // untouched; print the from/to/verdict line either way
    }
}

fn main() {
    let proposed = [
        Status::Validating,
        Status::Submitted,
        Status::Confirmed,
        Status::Pending,
        Status::Confirmed,
        Status::Failed,
        Status::Pending,
    ];

    let mut tx = Tx { status: Status::Received, rejected: 0 };
    // print the header, drive every proposed transition, print the final line,
    // then count the outgoing edges of Confirmed and Failed
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the transition relation is a function of both states",
        kind: "fn_defined",
        fn: "allowed",
        params: [
          { name: "from", ty: "Status" },
          { name: "to", ty: "Status" },
        ],
        returns: "bool",
      },
      {
        name: "matches on the (from, to) pair",
        kind: "match_on",
        scrutinee: "(from, to)",
      },
      {
        name: "permits Pending -> Confirmed",
        kind: "match_arm",
        pat: "(Status::Pending, Status::Confirmed)",
        body: "true",
      },
      {
        name: "refuses every edge not written down",
        kind: "match_arm",
        pat: "_",
        body: "false",
      },
      {
        name: "rejects Submitted -> Confirmed, which would skip Pending",
        kind: "match_arm",
        pat: "(Status::Submitted, Status::Confirmed)",
        forbidden: true,
      },
      {
        name: "treats Confirmed as terminal (no outgoing edge)",
        kind: "match_arm",
        pat: "(Status::Confirmed, Status::Failed)",
        forbidden: true,
      },
    ],
    expectedOutput: `from        -> to          verdict
Received    -> Validating  accepted
Validating  -> Submitted   accepted
Submitted   -> Confirmed   REJECTED
Submitted   -> Pending     accepted
Pending     -> Confirmed   accepted
Confirmed   -> Failed      REJECTED
Confirmed   -> Pending     REJECTED
final=Confirmed rejected=3
Confirmed has 0 outgoing transitions
Failed has 0 outgoing transitions
`,
    referenceSolution: `#[derive(Clone, Copy, PartialEq)]
enum Status {
    Received,
    Validating,
    Submitted,
    Pending,
    Confirmed,
    Failed,
}

fn name(s: Status) -> &'static str {
    match s {
        Status::Received => "Received",
        Status::Validating => "Validating",
        Status::Submitted => "Submitted",
        Status::Pending => "Pending",
        Status::Confirmed => "Confirmed",
        Status::Failed => "Failed",
    }
}

fn allowed(from: Status, to: Status) -> bool {
    match (from, to) {
        (Status::Received, Status::Validating) => true,
        (Status::Validating, Status::Submitted) => true,
        (Status::Submitted, Status::Pending) => true,
        (Status::Pending, Status::Confirmed) => true,
        (Status::Received, Status::Failed) => true,
        (Status::Validating, Status::Failed) => true,
        (Status::Submitted, Status::Failed) => true,
        (Status::Pending, Status::Failed) => true,
        _ => false,
    }
}

struct Tx {
    status: Status,
    rejected: u32,
}

impl Tx {
    fn transition(&mut self, to: Status) {
        let from = self.status;
        if allowed(from, to) {
            self.status = to;
            println!("{:<11} -> {:<11} accepted", name(from), name(to));
        } else {
            self.rejected += 1;
            println!("{:<11} -> {:<11} REJECTED", name(from), name(to));
        }
    }
}

fn main() {
    let proposed = [
        Status::Validating,
        Status::Submitted,
        Status::Confirmed,
        Status::Pending,
        Status::Confirmed,
        Status::Failed,
        Status::Pending,
    ];

    let mut tx = Tx { status: Status::Received, rejected: 0 };
    println!("from        -> to          verdict");
    for to in proposed.iter() {
        tx.transition(*to);
    }
    println!("final={} rejected={}", name(tx.status), tx.rejected);

    let terminal = [Status::Confirmed, Status::Failed];
    for s in terminal.iter() {
        let out = [
            Status::Received,
            Status::Validating,
            Status::Submitted,
            Status::Pending,
            Status::Confirmed,
            Status::Failed,
        ]
        .iter()
        .filter(|t| allowed(*s, **t))
        .count();
        println!("{} has {} outgoing transitions", name(*s), out);
    }
}
`,
  },

  "backend-indexers-distsys-6": {
    instructions: `## Compute the overlap, then partition the cluster

The overlap guarantee is strictly \`R + W > N\`. The row \`N=5, R=2, W=3\` sums to exactly 5 and does **not** overlap — a read quorum of two can be entirely disjoint from the three nodes that took the write, and returns stale data with no error.

A partition does not ask permission. With N=5, W=3 and a 3|2 split, the majority side still musters a quorum; the minority side reaches neither R=3 nor W=3 and refuses both. That refusal is the CP choice, and you made it when you picked R and W.

Reads resolve by **version number**, not by wall-clock timestamp.

### Your task

1. \`write\` returns false unless the reachable side has at least \`w\` nodes; otherwise it sets \`version\` and \`value\` on all of them and returns true.
2. \`read\` returns \`None\` unless the side has at least \`r\` nodes; otherwise it returns the highest \`(version, value)\` seen.
3. In \`main\`: print the quorum table for \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\` — N, R, W, R+W, whether \`r + w > n\`, and the failures each quorum still tolerates (\`n - w\` on write, \`n - r\` on read). Then run the 3|2 partition at R=3, W=3: attempt a write of version 2 / value 250 on each side, read from each side, and print the closing AP line.

Expected output:

\`\`\`text
 N  R  W  R+W  overlaps  write survives  read survives
 3  1  1    2  no                     2              2
 3  2  2    4  yes                    1              1
 3  1  3    4  yes                    0              2
 3  3  1    4  yes                    2              0
 5  2  3    5  no                     2              3
 5  3  3    6  yes                    2              2
N=5 R=3 W=3, partition {n1,n2,n3} | {n4,n5}
  majority write v=2: ok
  minority write v=2: refused
  majority read: version=2 value=250
  minority read: refused
  minority still holds version=1 on n4,n5: serving that read is the AP choice
\`\`\`

### Hints

- Table row: \`println!("{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}", n, r, w, r + w, if overlaps { "yes" } else { "no" }, n - w, n - r);\`
- The literal braces in the partition line are escaped as \`{{\` and \`}}\`.
- \`minority.iter().map(|n| n.id).collect::<Vec<_>>().join(",")\` builds the node list.
- \`read\` folds into a \`best: (u32, i64)\` tuple, replacing it whenever \`n.version > best.0\` — the highest version wins, and a wall-clock timestamp would not be a total order across nodes.
`,
    starterCode: `struct Node {
    id: &'static str,
    version: u32,
    value: i64,
}

fn write(side: &mut [&mut Node], w: usize, version: u32, value: i64) -> bool {
    // refuse unless the reachable side can muster W nodes; otherwise write
    // the version and value to all of them
    false
}

fn read(side: &[&mut Node], r: usize) -> Option<(u32, i64)> {
    // refuse unless the reachable side can muster R nodes; otherwise return
    // the highest version seen
    None
}

fn main() {
    // print the quorum table for (3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3),
    // one row each: N, R, W, R+W, whether R+W > N, and the failures each
    // quorum still tolerates

    let mut n1 = Node { id: "n1", version: 1, value: 100 };
    let mut n2 = Node { id: "n2", version: 1, value: 100 };
    let mut n3 = Node { id: "n3", version: 1, value: 100 };
    let mut n4 = Node { id: "n4", version: 1, value: 100 };
    let mut n5 = Node { id: "n5", version: 1, value: 100 };

    let (r, w) = (3usize, 3usize);
    let mut majority: Vec<&mut Node> = vec![&mut n1, &mut n2, &mut n3];
    let mut minority: Vec<&mut Node> = vec![&mut n4, &mut n5];

    // attempt a write of version 2 / value 250 on each side of the partition,
    // then a read on each side, then the closing AP line
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "overlap requires R + W strictly greater than N",
        kind: "expr_present",
        expr: "r + w > n",
      },
      {
        name: "does not settle for R + W >= N",
        kind: "expr_present",
        expr: "r + w >= n",
        forbidden: true,
      },
      {
        name: "refuses a write below the write quorum",
        kind: "expr_present",
        expr: "side.len() < w",
      },
      {
        name: "refuses a read below the read quorum",
        kind: "expr_present",
        expr: "side.len() < r",
      },
      {
        name: "a read returns a version, or nothing at all",
        kind: "fn_defined",
        fn: "read",
        returns: "Option<(u32, i64)>",
      },
      {
        name: "resolves a read by highest version",
        kind: "expr_present",
        expr: "n.version > best.0",
      },
    ],
    expectedOutput: ` N  R  W  R+W  overlaps  write survives  read survives
 3  1  1    2  no                     2              2
 3  2  2    4  yes                    1              1
 3  1  3    4  yes                    0              2
 3  3  1    4  yes                    2              0
 5  2  3    5  no                     2              3
 5  3  3    6  yes                    2              2
N=5 R=3 W=3, partition {n1,n2,n3} | {n4,n5}
  majority write v=2: ok
  minority write v=2: refused
  majority read: version=2 value=250
  minority read: refused
  minority still holds version=1 on n4,n5: serving that read is the AP choice
`,
    referenceSolution: `struct Node {
    id: &'static str,
    version: u32,
    value: i64,
}

fn write(side: &mut [&mut Node], w: usize, version: u32, value: i64) -> bool {
    if side.len() < w {
        return false;
    }
    for n in side.iter_mut() {
        n.version = version;
        n.value = value;
    }
    true
}

fn read(side: &[&mut Node], r: usize) -> Option<(u32, i64)> {
    if side.len() < r {
        return None;
    }
    let mut best = (0u32, 0i64);
    for n in side.iter() {
        if n.version > best.0 {
            best = (n.version, n.value);
        }
    }
    Some(best)
}

fn main() {
    println!(" N  R  W  R+W  overlaps  write survives  read survives");
    for (n, r, w) in [(3, 1, 1), (3, 2, 2), (3, 1, 3), (3, 3, 1), (5, 2, 3), (5, 3, 3)] {
        let overlaps = r + w > n;
        println!(
            "{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}",
            n,
            r,
            w,
            r + w,
            if overlaps { "yes" } else { "no" },
            n - w,
            n - r
        );
    }

    let mut n1 = Node { id: "n1", version: 1, value: 100 };
    let mut n2 = Node { id: "n2", version: 1, value: 100 };
    let mut n3 = Node { id: "n3", version: 1, value: 100 };
    let mut n4 = Node { id: "n4", version: 1, value: 100 };
    let mut n5 = Node { id: "n5", version: 1, value: 100 };

    let (r, w) = (3usize, 3usize);
    println!("N=5 R={} W={}, partition {{n1,n2,n3}} | {{n4,n5}}", r, w);

    let mut majority: Vec<&mut Node> = vec![&mut n1, &mut n2, &mut n3];
    let mut minority: Vec<&mut Node> = vec![&mut n4, &mut n5];

    println!(
        "  majority write v=2: {}",
        if write(&mut majority, w, 2, 250) { "ok" } else { "refused" }
    );
    println!(
        "  minority write v=2: {}",
        if write(&mut minority, w, 2, 250) { "ok" } else { "refused" }
    );
    match read(&majority, r) {
        Some((v, value)) => println!("  majority read: version={} value={}", v, value),
        None => println!("  majority read: refused"),
    }
    match read(&minority, r) {
        Some((v, value)) => println!("  minority read: version={} value={}", v, value),
        None => println!("  minority read: refused"),
    }
    println!(
        "  minority still holds version={} on {}: serving that read is the AP choice",
        minority[0].version,
        minority.iter().map(|n| n.id).collect::<Vec<_>>().join(",")
    );
}
`,
  },

  "backend-indexers-distsys-7": {
    instructions: `## Stamp a trace with both clocks

A Lamport clock is two rules: tick your counter on every event, and on receiving a message raise your counter to at least the sender's before ticking. That guarantees \`a -> b\` implies \`L(a) < L(b)\` — and nothing more. \`c1\` has L=1, \`a2\` has L=2, and they are concurrent.

A vector clock keeps one counter per node and takes the elementwise max on receive. \`a <= b\` componentwise with at least one strictly less means \`a -> b\`; neither direction means **concurrent**, a verdict Lamport structurally cannot produce.

### Your task

1. \`happens_before\` returns true when every component of \`a\` is \`<=\` \`b\` and at least one is strictly less.
2. Walk the events in order. On a delivery (\`Some(src)\`), raise this node's Lamport counter to \`lamport_of[src]\` if that is larger, and take the elementwise max of \`vector_of[src]\`. Then tick the node's Lamport counter and its own vector component. Record both stamps into \`lamport_of[i]\` / \`vector_of[i]\` and print the row.
3. Print the verdict rows for event index pairs \`(1,3)\`, \`(4,1)\` and \`(2,4)\` — that is \`a2,b2\`, \`c1,a2\` and \`b1,c1\` — with the Lamport comparison sign and the vector verdict. Close with the summary line.

Expected output:

\`\`\`text
ev  node  lamport  vector
a1  A     1        [1,0,0]
a2  A     2        [2,0,0]
b1  B     1        [0,1,0]
b2  B     3        [2,2,0]
c1  C     1        [0,0,1]
b3  B     4        [2,3,0]
c2  C     5        [2,3,2]
pair    lamport  vector verdict
a2,b2   2 < 3    happens-before
c1,a2   1 < 2    concurrent
b1,c1   1 = 1    concurrent
a smaller lamport stamp does not mean caused-by: see c1,a2
\`\`\`

### Hints

- Trace row: \`println!("{}  {}     {}        [{},{},{}]", e.label, ["A", "B", "C"][e.node], lamport_of[i], vector_of[i][0], vector_of[i][1], vector_of[i][2]);\`
- Verdict row: \`println!("{},{}   {} {} {}    {}", ...)\` with the sign computed as \`"<"\`, \`">"\` or \`"="\`.
- \`for (i, e) in events.iter().enumerate()\` gives you the index to record the stamps under.
- Two pairs of arrays: the **live** clocks \`lamport: [u64; 3]\` and \`vector: [[u64; 3]; 3]\`, indexed by node — \`lamport[e.node] += 1\`, \`vector[e.node][e.node] += 1\` — and the per-event stamps \`lamport_of\` / \`vector_of\`, indexed by event, which you copy the live clock into after ticking.
`,
    starterCode: `struct Event {
    label: &'static str,
    node: usize,
    // index of the send event this receive delivers, or None for a local event
    delivers: Option<usize>,
}

fn happens_before(a: &[u64; 3], b: &[u64; 3]) -> bool {
    // true when every component of \`a\` is <= \`b\` and at least one is strictly
    // less — that is the vector-clock definition of causal precedence
    false
}

fn verdict(a: &[u64; 3], b: &[u64; 3]) -> &'static str {
    if happens_before(a, b) {
        "happens-before"
    } else if happens_before(b, a) {
        "happens-after"
    } else {
        "concurrent"
    }
}

fn main() {
    let events = [
        Event { label: "a1", node: 0, delivers: None },
        Event { label: "a2", node: 0, delivers: None },
        Event { label: "b1", node: 1, delivers: None },
        Event { label: "b2", node: 1, delivers: Some(1) },
        Event { label: "c1", node: 2, delivers: None },
        Event { label: "b3", node: 1, delivers: None },
        Event { label: "c2", node: 2, delivers: Some(5) },
    ];

    let mut lamport_of = [0u64; 7];
    let mut vector_of = [[0u64; 3]; 7];
    let mut lamport = [0u64; 3];
    let mut vector = [[0u64; 3]; 3];

    // walk the events in order: on a delivery raise this node's lamport counter
    // and vector to the sender's, then tick the node's own component. Record
    // both stamps per event and print the table.

    // then print the verdict rows for the pairs (a2,b2), (c1,a2) and (b1,c1)
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "implements the vector-clock happens-before test",
        kind: "fn_defined",
        fn: "happens_before",
        returns: "bool",
      },
      {
        name: "requires at least one strictly smaller component",
        kind: "let_binding",
        var: "strict",
        mutable: true,
        init: "false",
      },
      {
        name: "raises the lamport counter past the sender's stamp",
        kind: "expr_present",
        expr: "lamport_of[src] > lamport[e.node]",
      },
      {
        name: "takes the elementwise max of the sender's vector",
        kind: "expr_present",
        expr: "vector_of[src][k] > vector[e.node][k]",
      },
      {
        name: "ticks the lamport counter on every event",
        kind: "expr_present",
        expr: "lamport[e.node] += 1",
      },
      {
        name: "ticks only its own vector component",
        kind: "expr_present",
        expr: "vector[e.node][e.node] += 1",
      },
    ],
    expectedOutput: `ev  node  lamport  vector
a1  A     1        [1,0,0]
a2  A     2        [2,0,0]
b1  B     1        [0,1,0]
b2  B     3        [2,2,0]
c1  C     1        [0,0,1]
b3  B     4        [2,3,0]
c2  C     5        [2,3,2]
pair    lamport  vector verdict
a2,b2   2 < 3    happens-before
c1,a2   1 < 2    concurrent
b1,c1   1 = 1    concurrent
a smaller lamport stamp does not mean caused-by: see c1,a2
`,
    referenceSolution: `struct Event {
    label: &'static str,
    node: usize,
    // index of the send event this receive delivers, or None for a local event
    delivers: Option<usize>,
}

fn happens_before(a: &[u64; 3], b: &[u64; 3]) -> bool {
    let mut strict = false;
    for i in 0..3 {
        if a[i] > b[i] {
            return false;
        }
        if a[i] < b[i] {
            strict = true;
        }
    }
    strict
}

fn verdict(a: &[u64; 3], b: &[u64; 3]) -> &'static str {
    if happens_before(a, b) {
        "happens-before"
    } else if happens_before(b, a) {
        "happens-after"
    } else {
        "concurrent"
    }
}

fn main() {
    let events = [
        Event { label: "a1", node: 0, delivers: None },
        Event { label: "a2", node: 0, delivers: None },
        Event { label: "b1", node: 1, delivers: None },
        Event { label: "b2", node: 1, delivers: Some(1) },
        Event { label: "c1", node: 2, delivers: None },
        Event { label: "b3", node: 1, delivers: None },
        Event { label: "c2", node: 2, delivers: Some(5) },
    ];

    let mut lamport_of = [0u64; 7];
    let mut vector_of = [[0u64; 3]; 7];
    let mut lamport = [0u64; 3];
    let mut vector = [[0u64; 3]; 3];

    println!("ev  node  lamport  vector");
    for (i, e) in events.iter().enumerate() {
        if let Some(src) = e.delivers {
            if lamport_of[src] > lamport[e.node] {
                lamport[e.node] = lamport_of[src];
            }
            for k in 0..3 {
                if vector_of[src][k] > vector[e.node][k] {
                    vector[e.node][k] = vector_of[src][k];
                }
            }
        }
        lamport[e.node] += 1;
        vector[e.node][e.node] += 1;
        lamport_of[i] = lamport[e.node];
        vector_of[i] = vector[e.node];
        println!(
            "{}  {}     {}        [{},{},{}]",
            e.label,
            ["A", "B", "C"][e.node],
            lamport_of[i],
            vector_of[i][0],
            vector_of[i][1],
            vector_of[i][2]
        );
    }

    println!("pair    lamport  vector verdict");
    for (x, y) in [(1usize, 3usize), (4, 1), (2, 4)] {
        let sign = if lamport_of[x] < lamport_of[y] {
            "<"
        } else if lamport_of[x] > lamport_of[y] {
            ">"
        } else {
            "="
        };
        println!(
            "{},{}   {} {} {}    {}",
            events[x].label,
            events[y].label,
            lamport_of[x],
            sign,
            lamport_of[y],
            verdict(&vector_of[x], &vector_of[y])
        );
    }
    println!("a smaller lamport stamp does not mean caused-by: see c1,a2");
}
`,
  },
};
