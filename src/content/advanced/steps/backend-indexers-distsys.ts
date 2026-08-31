import type { LessonStep } from "@/content/steps";

// Advanced · Indexers & Distributed Systems.

export const backendIndexersDistsysSteps: Record<string, LessonStep[]> = {
  "backend-indexers-distsys-1": [
    {
      kind: "theory",
      body: `An indexer is four things and no more.

| part | job |
| --- | --- |
| source | ordered ledger events, replayable from any point |
| cursor | the sequence number of the last event you finished |
| processor | folds one event into state |
| store | holds the folded state **and** the cursor |

The last row is the one that matters. If the cursor lives in a local variable it is a progress bar; if it lives in the same store as the data it is a checkpoint, and a checkpoint is the only thing that survives \`SIGKILL\`.

\`\`\`rust
struct Store {
    balances: Vec<(&'static str, i64)>,
    cursor: u64,
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Resumption is a **filter**, not a seek:

\`\`\`rust
if e.seq <= store.cursor {
    continue;
}
\`\`\`

That single predicate is the whole restart story. It is also why the source contract is "replayable from an arbitrary point" — a feed you can only consume once forces you to make the cursor and the effect atomic, which you cannot do across two systems.

The processor is a fold. Same source, same starting cursor, same resulting state — which is what turns re-indexing from an outage into a routine operation you can run on a Tuesday.

Store iteration order has to be deterministic or the output is not reproducible, and a non-reproducible indexer cannot be diffed against a rebuild. That is why the store here is a \`Vec\` of pairs and not a \`HashMap\`: \`HashMap\` iteration order is randomised per process by design.`,
    },
    {
      kind: "quiz",
      question:
        "The store holds folded balances. Can you rebuild the cursor by scanning it after a crash?",
      options: [
        "No — the fold discarded the sequence numbers, so the highest one you processed is not recoverable from balances",
        "Yes — take the maximum sequence number stored on each account row",
        "Yes — the number of applied events equals the cursor, so count the rows",
      ],
      answer: 0,
      explain:
        "The cursor is not a cache of something the data already knows. It is independent state, which is precisely why it has to be written down.",
    },
    {
      kind: "fill",
      prompt:
        "Skip every event the store has already folded in. The checkpoint names the last event **finished**, so that event itself must not be replayed.",
      file: "main.rs",
      before: "for e in source {\n        if ",
      after: " {\n            continue;\n        }",
      choices: [
        "e.seq <= store.cursor",
        "e.seq < store.cursor",
        "e.seq == store.cursor",
      ],
      explain:
        "`<` replays the checkpointed event on every restart — a duplicate at exactly the seam, which is the hardest kind to spot. `==` skips one event and reprocesses everything below it.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Keeping progress in memory and restarting from sequence 0 after a crash is safe when:",
      options: [
        "every processor effect is idempotent, so replaying the whole history converges on the same state",
        "the ledger is append-only, since nothing below the head can change",
        "the restart happens quickly enough that no new events have arrived",
      ],
      answer: 0,
      explain:
        "Append-only says nothing about your side effects: a `+= delta` applied twice is wrong regardless of how immutable the source is. Idempotency is the next three lessons.",
    },
    {
      kind: "editor",
      intro: `### Index a ledger, get killed, resume

1. \`Store::apply\` adds \`e.delta\` to \`e.account\`, pushing the account if it is not present yet.
2. \`run\` skips events at or below \`store.cursor\`, applies at most \`budget\` of the rest, advances \`store.cursor\` to \`e.seq\` after each apply, and prints the trace line.
3. In \`main\`: run 1 with a budget of 5 (the crash), print the checkpoint, then run 2 unbounded, then print the account table.

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

The trace line is \`"  seq={} {:<6}{:>5}"\`; the table row is \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-2": [
    {
      kind: "theory",
      body: `Every indexer step is **two writes** — the effect on the store, and the cursor commit. A crash can land between them, and their order decides which failure mode you get. There is no third option short of a transaction spanning both.

**Cursor-first** gives at-most-once. The checkpoint says \`seq=3\` is done, the balance never moved, no restart re-reads it. The run finishes with \`total=120\` against an expected \`150\` and reports no error at all.

**Effect-first** gives at-least-once. The effect landed, the checkpoint did not, so the restart replays \`seq=3\` and reaches \`180\`. Wrong — but wrong in a direction a dedupe key can fix.`,
    },
    {
      kind: "theory",
      body: `| ordering | crash between the writes | recoverable? |
| --- | --- | --- |
| cursor-first | event silently skipped | no — full re-index |
| effect-first | event applied twice | yes — dedupe on the event id |

At-least-once is therefore the delivery guarantee you **build on**, not one you tolerate. "Exactly-once" in a message broker means at-least-once delivery plus idempotent processing at the consumer; the broker is selling you the half you still have to write.

If the effect and the cursor live in the same database, one transaction covering both collapses the problem entirely. The ordering question is what you face the moment they do not — rows in Postgres, cursor in Redis — and that split is usually introduced for a latency reason by someone who did not know they were choosing a failure mode.`,
    },
    {
      kind: "quiz",
      question:
        "\"Commit the cursor first, then you never do the work twice.\" What is wrong with that?",
      options: [
        "You never do it twice because you sometimes never do it at all — the skipped event is unrecoverable and reported as success",
        "Nothing is wrong; it is the correct ordering, and duplicates are the more serious failure",
        "It is wrong only because the cursor write is slower than the effect write",
      ],
      answer: 0,
      explain:
        "The run exits 0, the log is clean, and the total is short by one event. You find out from a reconciliation job, weeks later, if you have one.",
    },
    {
      kind: "fill",
      prompt:
        "Effect-first: the cursor commit is the **last** write in the arm, past the crash point. Commit the sequence you actually just applied.",
      file: "main.rs",
      before:
        "store.total += e.amount;\n            store.applies += 1;\n            if e.seq == crash_at {\n                return true;\n            }\n            ",
      after: "\n        }",
      choices: [
        "store.cursor = e.seq;",
        "store.cursor += 1;",
        "store.cursor = e.seq - 1;",
      ],
      explain:
        "`+= 1` assumes sequence numbers are contiguous — a single gap in the feed and the cursor drifts behind forever. `- 1` re-reads the event you just finished on every restart.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Why are a lost event and a duplicated event not symmetric bugs?",
      options: [
        "The duplicate is recoverable from data you still hold; the loss needs a source you may no longer be able to replay",
        "They are symmetric — both leave the total wrong by one event's amount",
        "The duplicate is worse, because it corrupts state while the loss only delays it",
      ],
      answer: 0,
      explain:
        "A duplicate is a bug you can fix forward with a dedupe key. A loss is a bug you can only fix by re-reading history — assuming the retention window has not passed.",
    },
    {
      kind: "editor",
      intro: `### Measure both orderings against one crash

1. \`drain\` walks events past \`store.cursor\`. Under \`CursorFirst\` it commits the cursor **before** the effect; under \`EffectFirst\`, **after**. It returns \`true\` when it reaches \`e.seq == crash_at\`, leaving the half-finished state behind.
2. In \`main\`, run both orderings with \`crash_at = 3\`, restart each after the crash (\`crash_at = 0\` never matches), then print the summary table and the two verdict lines.

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

The trace line prints only when the step completes; the summary row is \`"{:<14}{:>7}{:>7}{:>10}"\`.`,
    },
  ],

  "backend-indexers-distsys-3": [
    {
      kind: "theory",
      body: `At-least-once means three distinct things can happen to your consumer, and all three appear in this lesson's \`delivered\` slice:

- the same event id arrives **twice** (id 2),
- events arrive **out of order** (id 3 before id 2),
- the whole stream is **redelivered** after a restart (pass 2).

Idempotency is a property of the *processor*, not of the transport. Keep the set of applied event ids in the same store as the data, check it before the effect, and record it as part of the same write.

\`\`\`rust
fn apply_idempotent(&mut self, e: Event) {
    if self.seen.contains(&e.id) {
        return;
    }
    self.seen.push(e.id);
    self.credit(e.account, e.amount);
}
\`\`\`

The naive processor climbs 305 → 610 across two passes. The idempotent one sits at 265 — the exactly-once total — both times.`,
    },
    {
      kind: "theory",
      body: `**The dedupe key must be the producer-assigned event id.** Hashing the payload conflates two legitimately identical events: ids 2 and 5 are both \`bob, 40\` and are two different payments, while the second delivery of id 2 is the same payment twice. A hash sees one case; the id sees both.

**Order-independence and duplicate-independence are separate properties.** Crediting a balance is commutative, so reordering costs nothing in this lesson. A \`set\` operation is not commutative, and needs a version or sequence guard — "apply only if \`e.version > row.version\`" — on top of the dedupe.

**The seen-set is unbounded here and must not be in production.** Bound it with a unique index on the event id (the insert fails, the transaction rolls back, the effect never lands), or with a window keyed by the cursor, since anything below the checkpoint can never legitimately reappear.`,
    },
    {
      kind: "quiz",
      question:
        "Your broker advertises exactly-once delivery. What still has to be written on the consumer?",
      options: [
        "The consumer-side dedupe — exactly-once is at-least-once delivery plus idempotent processing, and the broker only supplies the first half",
        "Nothing, provided the consumer acknowledges each message before processing it",
        "Only a retry policy; the broker's transaction covers the consumer's writes",
      ],
      answer: 0,
      explain:
        "A broker's transaction covers its own log. It cannot cover a write to your database, so the moment your effect leaves the broker the guarantee stops.",
    },
    {
      kind: "fill",
      prompt:
        "Dedupe on the producer-assigned identity of the event, not on what it happens to say.",
      file: "main.rs",
      before: "fn apply_idempotent(&mut self, e: Event) {\n        if self.seen.contains(",
      after: ") {\n            return;\n        }",
      choices: ["&e.id", "&e.amount", "&e.account"],
      explain:
        "Dedupe on the amount and id 5 — a second, real payment of 40 to bob — vanishes with the money. Dedupe on the account and you apply exactly one event per account, ever.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Why is a hash of the event payload a poor dedupe key for a payments feed?",
      options: [
        "Two legitimately identical transfers hash the same, so the second is silently dropped",
        "Hashing is too slow to run on every event at production volume",
        "Payload hashes collide often enough that unrelated events are conflated",
      ],
      answer: 0,
      explain:
        "The failure is not collision in the cryptographic sense — the two events really are byte-identical. They are still two different payments.",
    },
    {
      kind: "editor",
      intro: `### Make the processor idempotent

1. \`apply_naive\` credits unconditionally.
2. \`apply_idempotent\` returns early when \`e.id\` is already in \`self.seen\`; otherwise it records the id and credits.
3. In \`main\`, feed \`delivered\` to both stores **twice**, printing a row per pass, then the exactly-once total, the idempotent balance table and the seen-set size.

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

The pass row is \`"{:>4}{:>7}{:>12}"\`; the balance row is \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-4": [
    {
      kind: "theory",
      body: `A block's **parent hash**, not its height, tells you whether it extends your chain.

\`\`\`text
genesis - a1 - a2 - a3 - a4 - a5          <- indexed head
               \\
                b3 - b4 - b5 - b6         <- arrives, parent = a2
\`\`\`

\`b3\` arrives at height 3 while the head is \`a5\`. On height alone that looks like a duplicate, or a feed that jumped backwards. On \`parent\` it is unambiguous: it forks below the head, so three blocks of yours are now orphaned.

Rollback runs **head-downwards**, applying the inverse of each block's effect, and stops at the fork point. Reverse order matters the moment effects stop commuting; unwinding forwards produces a store that no branch ever had.`,
    },
    {
      kind: "theory",
      body: `Undo requires that you kept enough to invert. Storing the applied blocks next to the balances is the cheap version — a real indexer keeps an undo log or per-height snapshots, because "recompute from genesis" is not a response time.

**Confirmed is not final.** carol's 20 was credited at height 4 and stood for two blocks; after the reorg her balance is 0 and the row survives only as evidence. Finality is the depth at which you *stop being willing to unwind* — a policy you choose, not a property the block carries.

This is what pending-versus-confirmed is actually protecting you from. Anything you exposed as confirmed above the fork must now be retracted downstream, which is why an indexer emits reorg events and not merely row updates: a consumer that only sees the new balance has no way to tell a correction from a payment.`,
    },
    {
      kind: "quiz",
      question:
        "Head is `a5`. `b6` arrives at height 6 on a branch forking at `a2`. Why not simply fast-forward onto the longer chain?",
      options: [
        "Applying `b3..b6` on top of `a5` keeps the effects of `a3`, `a4` and `a5`, producing a state no chain ever had",
        "It is fine as long as the branch is strictly longer — that is the longest-chain rule",
        "It is fine, but only after re-verifying the signatures on `b3..b6`",
      ],
      answer: 0,
      explain:
        "Longest-chain says which branch is canonical. It says nothing about how to get your store there, and your store is currently holding three blocks' worth of effects that branch never contained.",
    },
    {
      kind: "fill",
      prompt:
        "Locate the fork point: the block in your chain that the incoming branch names as its parent.",
      file: "main.rs",
      before: "let fork = ix\n        .chain\n        .iter()\n        .position(|b| ",
      after: ")\n        .map(|i| ix.chain[i].height)\n        .unwrap_or(0);",
      choices: [
        "b.hash == branch[0].parent",
        "b.height == branch[0].height",
        "b.parent == branch[0].parent",
      ],
      explain:
        "Matching on height finds `a3` — the block being orphaned — and rolls back to 3, leaving `a3` applied. Matching parent-to-parent finds the sibling `a3` for the same reason: both name `a2`.",
      answer: 0,
    },
    {
      kind: "quiz",
      question: "What does \"six confirmations\" actually give you?",
      options: [
        "A cost of reversal high enough that you choose to stop unwinding — an economic argument, not a guarantee",
        "A protocol guarantee that a block at that depth can no longer be replaced",
        "A guarantee under normal operation, void only if the chain is attacked",
      ],
      answer: 0,
      explain:
        "Six is a threshold someone picked. Your indexer still needs a rollback path, because the number that made it uneconomic yesterday is a parameter of a market.",
    },
    {
      kind: "editor",
      intro: `### Roll back to the fork, reapply the branch

1. \`apply\` credits the block, pushes it onto the chain, and prints the apply line.
2. \`rollback_to\` pops blocks above \`height\` from the head down, crediting the **inverse** delta for each and printing a rollback line.
3. In \`main\`: index the canonical chain and report; find the fork by locating \`branch[0].parent\` in the chain; roll back; apply the branch; report; print the closing line about carol.

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

Both trace lines use \`{:+}\` for the delta so the sign is always printed.`,
    },
  ],

  "backend-indexers-distsys-5": [
    {
      kind: "theory",
      body: `A status column with six string values is not a state machine. The machine is the **transition relation**:

\`\`\`rust
fn allowed(from: Status, to: Status) -> bool {
    match (from, to) {
        (Status::Received, Status::Validating) => true,
        (Status::Validating, Status::Submitted) => true,
        (Status::Submitted, Status::Pending) => true,
        (Status::Pending, Status::Confirmed) => true,
        // ... every state may fail ...
        _ => false,
    }
}
\`\`\`

Its value is entirely in what it returns **false** for. The catch-all \`_ => false\` is the design, not a formality: every edge you did not write down is refused by construction, so adding a seventh status later fails closed rather than silently permitting a dozen new transitions.`,
    },
    {
      kind: "theory",
      body: `**Terminal states are the ones with no outgoing arm.** \`Confirmed\` and \`Failed\` each report 0 outgoing transitions, which is how a late duplicate webhook trying to move a confirmed transaction back to \`Pending\` gets rejected instead of resurrecting it.

**A rejected transition must leave the state unchanged and be counted.** Three of the seven proposals here are refused and the transaction still ends at \`Confirmed\`. An unlogged rejection is an incident you will later investigate from scratch, because the only evidence it happened was a branch that returned early.

**\`Submitted → Confirmed\` is refused** even though it is the outcome everyone wants. Skipping \`Pending\` means there is no record of the transaction having been in the mempool, and a client polling for \`Pending\` never sees it — so its retry logic, its timer and its UI all key off an edge that never fired.`,
    },
    {
      kind: "quiz",
      question:
        "The transaction ends up `Confirmed` either way. What does skipping `Submitted → Pending → Confirmed` cost you?",
      options: [
        "The audit trail, and every consumer that watches for the intermediate edge rather than the final state",
        "Nothing measurable — intermediate states exist for the UI, and the terminal state is authoritative",
        "Only the timing metrics between the two states",
      ],
      answer: 0,
      explain:
        "The reconciliation question is not \"is it confirmed\" but \"how did it get there\". Without the intermediate row, a transaction that was never broadcast and one that was mined in a second look identical.",
    },
    {
      kind: "fill",
      prompt:
        "Close the transition table. Every edge that is not written above must be refused, and terminal states must stay terminal.",
      file: "main.rs",
      before: "(Status::Pending, Status::Failed) => true,\n        ",
      after: "\n    }",
      choices: ["_ => false,", "(_, Status::Failed) => true,", "_ => true,"],
      explain:
        "`(_, Status::Failed) => true` reads as \"anything can fail\" and quietly permits `Confirmed → Failed`, destroying terminality. `_ => true` inverts the machine into a table of things you happen to forbid.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Where does the transition check belong — the API handler, or next to the state?",
      options: [
        "Next to the state, because the reorg handler, the backfill job and the manual fix all write the same column and none of them go through the handler",
        "The API handler, since that is where every external request arrives and where the error must be returned",
        "Both, duplicated, so the handler can return a 409 without a round trip",
      ],
      answer: 0,
      explain:
        "A rule enforced at one of several entry points is not a rule, it is a convention. The writers that bypass it are exactly the ones running unattended at 3am.",
    },
    {
      kind: "editor",
      intro: `### Encode the machine, and make it reject

1. \`allowed\` matches on \`(from, to)\`: one arm per legal edge, \`_ => false\` for everything else. \`Confirmed\` and \`Failed\` get **no** outgoing arm.
2. \`Tx::transition\` applies the move if \`allowed\`, otherwise increments \`rejected\` and leaves the state untouched — printing the from/to/verdict line either way.
3. In \`main\`, drive every proposed transition, print the final line, then count the outgoing edges of each terminal state.

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

The verdict line is \`"{:<11} -> {:<11} accepted"\` / \`... REJECTED\`.`,
    },
  ],

  "backend-indexers-distsys-6": [
    {
      kind: "theory",
      body: `The overlap guarantee is strictly \`R + W > N\`. Not \`>=\`.

| N | R | W | R+W | overlaps | write survives | read survives |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | 1 | 1 | 2 | no | 2 | 2 |
| 3 | 2 | 2 | 4 | yes | 1 | 1 |
| 3 | 1 | 3 | 4 | yes | 0 | 2 |
| 3 | 3 | 1 | 4 | yes | 2 | 0 |
| 5 | 2 | 3 | 5 | **no** | 2 | 3 |
| 5 | 3 | 3 | 6 | yes | 2 | 2 |

Row five is the configuration people ship believing it is safe. R+W equals N, so a read quorum of two nodes can be entirely disjoint from the three that took the write. It returns stale data, with no error and no way for the caller to tell.`,
    },
    {
      kind: "theory",
      body: `R and W are two dials that trade against **each other**, not against some abstract "consistency". At N=3, \`W=1\` tolerates two node failures on write and zero on read; \`W=3\` inverts it. Latency follows the same curve, because each quorum waits for its slowest member — so raising W raises p99 on the write path specifically.

A partition does not ask permission. With N=5, W=3 and a 3|2 split, the majority side still musters a quorum and commits version 2; the minority side has two reachable nodes and cannot reach either R=3 or W=3, so it refuses both.

That refusal **is** the CP choice, and you made it when you picked R and W. Serving n4/n5's stale version 1 would have been the AP choice — available, and wrong. CAP is not a property of the network; it is which of those two lines you shipped.

Version numbers, not wall-clock timestamps, make the read resolvable: the reader takes the highest version among the responses it did get.`,
    },
    {
      kind: "quiz",
      question: "Why is `R + W >= N` not the quorum rule?",
      options: [
        "At equality the two quorums can be disjoint — N=5, R=2, W=3 has a read set that touches none of the three nodes that took the write",
        "It is the rule; the strict form is a conservative convention with one node of slack",
        "It is off by one only for even N, where no majority exists",
      ],
      answer: 0,
      explain:
        "Pigeonhole: R+W > N forces at least one node into both sets. At R+W = N there is exactly enough room for them to avoid each other, and the stale read is silent.",
    },
    {
      kind: "fill",
      prompt:
        "State the overlap condition. It has to force at least one node into both the read set and the write set.",
      file: "main.rs",
      before: "let overlaps = ",
      after: ";",
      choices: ["r + w > n", "r + w >= n", "w > n / 2"],
      explain:
        "`>=` admits the N=5/R=2/W=3 row above. `w > n / 2` is the *write*-side majority rule — it makes concurrent writes serialise, but says nothing about whether a reader sees them.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "During the 3|2 partition, can the minority side keep serving reads \"just slightly behind\"?",
      options: [
        "Only if you set R at or below 2, which is the trade made explicit — and then reads on the majority side lose their overlap guarantee too",
        "Yes — reads are safe during a partition; only writes need a quorum",
        "Yes, provided it marks the response as potentially stale",
      ],
      answer: 0,
      explain:
        "R is one number for the whole cluster. You cannot lower it for the partitioned minority and keep it high everywhere else, which is why the choice is made at configuration time and not during the incident.",
    },
    {
      kind: "editor",
      intro: `### Compute the overlap, then partition the cluster

1. \`write\` refuses unless the reachable side can muster W nodes; otherwise it writes the version and value to all of them.
2. \`read\` refuses unless the side can muster R nodes; otherwise it returns the **highest version** seen.
3. In \`main\`: print the quorum table for \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\`, then run a 3|2 partition at N=5, R=3, W=3 — write version 2 / value 250 on each side, read from each side, and print the closing AP line.

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

The table row is \`"{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}"\`; the survival columns are \`n - w\` and \`n - r\`.`,
    },
  ],

  "backend-indexers-distsys-7": [
    {
      kind: "theory",
      body: `A Lamport clock is two rules: tick your counter on every event, and on receiving a message raise your counter to at least the sender's stamp before ticking.

That guarantees \`a → b\` implies \`L(a) < L(b)\`. It is all the clock ever claimed, and the **converse is false**:

| pair | lamport | causality |
| --- | --- | --- |
| a2, b2 | 2 < 3 | happens-before |
| c1, a2 | 1 < 2 | concurrent |
| b1, c1 | 1 = 1 | concurrent |

\`c1\` has a smaller stamp than \`a2\` and there is no causal path between them. So "last write wins by Lamport timestamp" is picking an arbitrary winner among concurrent writes and presenting it as an answer.`,
    },
    {
      kind: "theory",
      body: `A **vector clock** keeps one counter per node, ticks only its own component, and takes the elementwise max on receive.

\`\`\`rust
fn happens_before(a: &[u64; 3], b: &[u64; 3]) -> bool {
    let mut strict = false;
    for i in 0..3 {
        if a[i] > b[i] { return false; }
        if a[i] < b[i] { strict = true; }
    }
    strict
}
\`\`\`

\`a ≤ b\` componentwise with at least one strictly less means \`a → b\`. Neither direction means **concurrent** — a verdict Lamport structurally cannot produce.

The cost is the shape of the stamp: O(1) per event for Lamport, O(nodes) for vectors. That is why vectors do not survive contact with a system that adds nodes freely, and why conflict detection is usually scoped to a key rather than to a whole cluster.

Concurrent is a real answer, not a failure to decide. Detecting it is what lets you surface sibling versions, a merge, or a user prompt, instead of silently dropping one of two writes that never saw each other.`,
    },
    {
      kind: "quiz",
      question: "`L(a) < L(b)`. What does that tell you about causality?",
      options: [
        "Nothing — it is consistent with `a → b` and with `a` and `b` being concurrent, as the c1/a2 row shows",
        "That `a` happened before `b`, which is the guarantee Lamport clocks provide",
        "That `a` happened before `b` unless the two events are on the same node",
      ],
      answer: 0,
      explain:
        "The implication runs one way only: causality implies ordered stamps, never the reverse. The contrapositive is still useful — `L(a) >= L(b)` proves `a` did not cause `b`.",
    },
    {
      kind: "fill",
      prompt:
        "The receive rule for a vector clock: take the elementwise maximum of your vector and the sender's, component by component.",
      file: "main.rs",
      before: "for k in 0..3 {\n                if ",
      after:
        " {\n                    vector[e.node][k] = vector_of[src][k];\n                }\n            }",
      choices: [
        "vector_of[src][k] > vector[e.node][k]",
        "vector_of[src][k] != vector[e.node][k]",
        "vector_of[src][k] > vector[e.node][e.node]",
      ],
      explain:
        "`!=` copies the sender's value even when yours is larger, discarding history you had already observed. Comparing against `vector[e.node][e.node]` compares every component against your own counter.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "NTP holds the fleet within a few milliseconds. Why not order events by wall clock?",
      options: [
        "Skew routinely exceeds the interval you are trying to order, and no bound on it is enforceable — a receive can carry a timestamp earlier than its send",
        "Wall clocks are fine for ordering; logical clocks exist only to save the bytes a timestamp costs",
        "Because timestamps have millisecond resolution, and ties cannot be broken",
      ],
      answer: 0,
      explain:
        "A VM pause, a leap-second smear or a bad NTP peer moves a clock by more than the microseconds separating two writes to the same key. Logical clocks exist because that bound cannot be enforced.",
    },
    {
      kind: "editor",
      intro: `### Stamp a trace with both clocks

1. \`happens_before\` is true when every component of \`a\` is \`<=\` \`b\` and at least one is strictly less.
2. Walk the events in order. On a delivery, raise this node's Lamport counter to the sender's stamp and take the elementwise max of the sender's vector; then tick the node's Lamport counter and its own vector component. Record both stamps per event and print the table.
3. Print the verdict rows for the pairs \`(a2,b2)\`, \`(c1,a2)\` and \`(b1,c1)\` — event indices \`(1,3)\`, \`(4,1)\` and \`(2,4)\`.

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

The node letter comes from \`["A", "B", "C"][e.node]\`; the trace line is \`"{}  {}     {}        [{},{},{}]"\` and the verdict line is \`"{},{}   {} {} {}    {}"\`.`,
    },
  ],
};
