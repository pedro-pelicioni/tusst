import type { LessonStep } from "@/content/steps";

// Advanced · The Data Layer.

export const backendDataLayerSteps: Record<string, LessonStep[]> = {
  "backend-data-layer-1": [
    {
      kind: "theory",
      body: `A B-tree index is an ordered structure. Looking up a key is a **descent** through the internal nodes — O(log n) — followed by a **sequential walk** along the linked leaf level for as long as the predicate holds — O(k), where k is the number of rows returned. Total: O(log n + k).

A sequential scan is O(n) whatever the predicate. To return one row out of a thousand it reads all thousand and discards 999.

\`\`\`text
seq scan     id BETWEEN 500 AND 500   →  1000 rows examined, 1 returned
index scan   id BETWEEN 500 AND 500   →     1 row  examined, 1 returned
\`\`\`

"Rows examined" is not a figure of speech. It is the number the planner budgets, and the number \`EXPLAIN ANALYZE\` prints as \`rows\` on each node. This lesson prints it too, so the asymptotics stop being a claim you have to take on trust.`,
    },
    {
      kind: "theory",
      body: `The other side of the ledger.

An index is a **second, ordered copy** of the key columns plus a pointer to the row. Every \`INSERT\`, every \`DELETE\`, and every \`UPDATE\` that touches an indexed column has to write it too. Three indexes on a hot table roughly triples the write amplification and the WAL volume that replication and backup then have to carry.

It also has to stay resident to be cheap. An index nobody filters, joins or sorts on is pure cost, paid on every write, forever.

And the index does not always win on reads either. Its cost is **proportional to the rows matched**, and in a real engine each matched row may be a random page fetch. At 50% selectivity the sequential scan is simply cheaper, and the planner knows it. Lesson 3 computes exactly where the two curves cross; for now, hold on to the fact that a crossover exists.`,
    },
    {
      kind: "quiz",
      question:
        "A query on a 10-million-row table matches 6 million of them. There is a B-tree index on the predicate column. Why might the planner still choose a sequential scan?",
      options: [
        "The index scan's cost grows with the rows matched, so past a crossover it exceeds the seq scan's fixed cost",
        "B-tree indexes are only consulted for equality predicates, never for ranges",
        "The index is only used once the table exceeds the planner's size threshold",
      ],
      answer: 0,
      explain:
        "An index makes a *selective* query fast. The seq scan pays a fixed price for the whole table; the index pays per matched row plus a random fetch each time. Six million matched rows is far past the point where the fixed price is the bargain.",
    },
    {
      kind: "fill",
      prompt:
        "Make the index scan seek the key range instead of walking the whole index.",
      file: "main.rs",
      before: "for (_key, r) in ",
      after: " {",
      choices: [
        "idx.range(lo..=hi)",
        "idx.iter().filter(|(k, _)| **k >= lo && **k <= hi)",
        "idx.values().take((hi - lo + 1) as usize)",
      ],
      answer: 0,
      explain:
        "The filter version returns the same rows and is the tempting one — but it examines all 1000 entries to do it, which is a sequential scan wearing an index's name. `take` reads the right *count* from the wrong *place*: the first k entries, not the ones in range.",
    },
    {
      kind: "quiz",
      question:
        "A read-heavy table gets a fourth index. What is the cost you have just accepted?",
      options: [
        "Every write to that table now maintains a fourth ordered structure, and the WAL carries it",
        "Nothing meaningful — reads dominate the workload, so the maintenance is amortised away",
        "Only the disk space; index maintenance happens in the background at checkpoint time",
      ],
      answer: 0,
      explain:
        "Maintenance is per *write*, not per read, so a high read:write ratio does not amortise it — it just means the cost lands on a smaller number of statements. Those statements are usually the latency-sensitive ones.",
    },
    {
      kind: "editor",
      intro: `### Count the rows each plan examines

1. \`seq_scan(rows, lo, hi) -> (Vec<u32>, usize)\` — touch every row, count each one touched, collect the \`amount\` of the ones whose \`id\` is in range.
2. \`index_scan(idx, lo, hi) -> (Vec<u32>, usize)\` — use \`idx.range(lo..=hi)\` and count only the entries the range actually visits.
3. Build 1000 rows (\`id\` 1..=1000, \`amount = id * 3\`) and a \`BTreeMap<u32, Row>\` index over them.
4. Run both plans over \`500..=500\`, \`500..=509\` and \`500..=599\`, print the table, then confirm both plans returned identical rows.

Expected output:

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

Same answer, three orders of magnitude apart in work done.`,
    },
  ],

  "backend-data-layer-2": [
    {
      kind: "theory",
      body: `An index on \`(tenant, status, created)\` is **one** ordered structure keyed on the concatenated tuple. It is not three indexes, and it is not symmetric in its columns.

The ordering is lexicographic. So the only contiguous key ranges the structure contains are the ones pinned by a **leftmost prefix**:

\`\`\`text
(tenant)                     ✓ contiguous
(tenant, status)             ✓ contiguous
(tenant, status, created)    ✓ contiguous
(status)                     ✗ not a prefix
(created)                    ✗ not a prefix
(status, created)            ✗ not a prefix
\`\`\`

A predicate on \`status\` alone names no contiguous range at all — the matching entries are scattered across the whole index, once per tenant. There is nothing to seek to, so the planner falls back to a sequential scan of the table.`,
    },
    {
      kind: "theory",
      body: `Two ways a composite index degrades short of a full seek.

**A gap in the middle.** \`tenant\` and \`created\` with no \`status\` gives a prefix seek on \`tenant\` plus a **residual filter** on everything it finds: it examines every row of that tenant and returns only the ones that also match. The gap between examined and matched is precisely \`Rows Removed by Filter\` in \`EXPLAIN ANALYZE\`, and it is where the latency hides — the exercise prints 100 examined for 30 matched.

**A range too early.** Only the *last* column used in the seek may be a range. A range on \`status\` turns \`created\` into a filter rather than a seek key. Hence the rule: equality columns first, range column last.

**Covering index.** If the index carries every column the query reads, the heap is never touched — an index-only scan.

The same trade exists one level up in the schema. A denormalized column is a materialized join that you can then index: you buy read cost with write amplification and the possibility of update anomalies. Exactly the bargain an index makes, at a different granularity.`,
    },
    {
      kind: "quiz",
      question:
        "Given one index on `(tenant, status, created)`, which query can seek a contiguous range of it?",
      options: [
        "`WHERE tenant = 3 AND status = 1` — a leftmost prefix",
        "`WHERE status = 1 AND created > 700` — both columns are in the index, so the index can serve it",
        "`WHERE created > 700` — the range column is indexed, so the range is contiguous",
      ],
      answer: 0,
      explain:
        "Membership is not the criterion; position is. The entries for `status = 1` are contiguous only *within* a tenant, so without a `tenant` predicate they are scattered across the whole structure. Serving `(status, created)` needs a second index, with its own write cost.",
    },
    {
      kind: "fill",
      prompt:
        "Seek straight to the start of `tenant = 3, status = 1, created >= 700`.",
      file: "main.rs",
      before: "let (e, m) = index_scan(&idx, ",
      after: ", (3, 1, max), &all);",
      choices: ["(3, 1, 700)", "(3, 700, 1)", "(0, 0, 700)"],
      answer: 0,
      explain:
        "The key is a tuple in index order — `(tenant, status, created)` — not in the order the predicates were written. `(0, 0, 700)` is the belief that a start key can constrain only the range column; it would seek to the very front of the index and read everything.",
    },
    {
      kind: "quiz",
      question:
        "`EXPLAIN ANALYZE` shows an Index Scan with `rows=30` and `Rows Removed by Filter: 70`. What happened?",
      options: [
        "The index seeked a prefix, then a residual filter discarded 70 of the 100 rows it examined",
        "The index returned 30 rows and the executor discarded 70 duplicates produced by the scan",
        "70 rows were removed by a later join, and the index examined exactly the 30 it returned",
      ],
      answer: 0,
      explain:
        "An index scan examines only what it returns when the seek uses a *full* prefix. With a gap, it examines the whole prefix range and filters. That line is the cost of the missing column, quantified — and the tidy belief that an index only touches what it returns is what makes people misread it.",
    },
    {
      kind: "editor",
      intro: `### Prove the leftmost-prefix rule

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`, with \`created\` doubling as the row id.
2. \`index_scan(idx, lo, hi, keep) -> (examined, matched)\` — walk \`idx.range(lo..=hi)\`, count every entry visited and every one \`keep\` lets through.
3. \`seq_scan(rows, keep) -> (examined, matched)\` — for the predicates no prefix can serve.
4. Build 1000 rows: \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\`, and one \`BTreeMap<Key, u32>\` over them.
5. Run the five queries and print which prefix each one used.

Expected output:

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

Row four is the residual filter. Row five is what a missing prefix actually costs.`,
    },
  ],

  "backend-data-layer-3": [
    {
      kind: "theory",
      body: `The planner does not know milliseconds. It enumerates candidate plans and prices each one in arbitrary units assembled from a handful of constants:

\`\`\`text
seq_page_cost           1.0     one sequentially-read page
random_page_cost        4.0     one randomly-fetched page
cpu_tuple_cost          0.01    processing one row
cpu_index_tuple_cost    0.005   processing one index entry
\`\`\`

**Seq scan** = \`pages x seq_page_cost + rows x cpu_tuple_cost\`. A fixed price, independent of how many rows match.

**Index scan** = descent + \`matched x (random_page_cost + cpu costs)\`. A per-matched-row price.

One is flat, the other has slope. They cross, and the planner picks whichever is lower at the estimated row count. That is the whole of plan selection. The \`cost=X..Y\` in \`EXPLAIN\` is exactly these numbers: startup cost, then total cost.

Those are Postgres's shipped defaults. The exercise works in the same units multiplied by 100 so nothing depends on floats, and rounds \`cpu_index_tuple_cost\` up to one unit — it is the smallest term in the sum and moves the crossover by under two rows in a hundred thousand.`,
    },
    {
      kind: "theory",
      body: `Everything above depends on one input the planner has to guess: **how many rows will match**.

Selectivity comes from statistics — \`n_distinct\`, the most-common-values list, and the histogram, all collected by \`ANALYZE\`. The plan is only ever as good as that estimate.

The classic production failure is a stale or missing statistic. The planner estimates 10 rows, gets 200,000, and sticks with a nested loop that should have been a hash join. So when you read \`EXPLAIN ANALYZE\`, compare estimated \`rows\` against actual \`rows\` **first**: a 1000x gap there is the bug, and the plan is only its symptom.

The crossover also arrives far earlier than intuition suggests. With the default constants the index loses at well under 1% of the table. "The index is not being used" almost always means "the predicate is not selective enough".

**Partitioning** changes the arithmetic rather than the formula: a predicate on the partition key eliminates whole partitions before costing (partition pruning), so the planner prices a smaller table. **Sharding** is the same cut across machines — with the difference that nothing plans across shards for you. The fan-out and the merge are your application's code.`,
    },
    {
      kind: "quiz",
      question:
        "A query that should use an index is doing a seq scan. Which action addresses the actual cause?",
      options: [
        "Check estimated vs actual rows in `EXPLAIN ANALYZE`, then fix the estimate or the predicate's selectivity",
        "`REINDEX` the table — the index has degraded and the planner no longer trusts it",
        "Create a second index on the same column so the planner has an alternative to cost",
      ],
      answer: 0,
      explain:
        "The planner did not overlook the index; it priced it and found it dearer. A duplicate index gets the same price. `REINDEX` fixes bloat, which is a real problem and not this one — the lever is the row estimate (`ANALYZE`, extended statistics) or the predicate itself.",
    },
    {
      kind: "fill",
      prompt:
        "Price one matched row of an index scan: the page fetch is random, not sequential.",
      file: "main.rs",
      before: "    INDEX_DEPTH * RANDOM_PAGE_COST\n        + matched * (",
      after: ")",
      choices: [
        "RANDOM_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "SEQ_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "CPU_TUPLE_COST + CPU_INDEX_COST",
      ],
      answer: 0,
      explain:
        "Index order is not heap order, so each matched row is a fetch to an arbitrary page — that 4x is the entire reason a crossover exists. Charging `seq_page_cost` would push the crossover out by a factor of four; charging no page cost at all would mean the index always wins, which is exactly the belief the numbers refute.",
    },
    {
      kind: "quiz",
      question:
        "The database runs on NVMe. What does lowering `random_page_cost` from 4.0 to 1.1 actually do?",
      options: [
        "It moves the crossover point for every query in the database, shifting plans toward index scans across the board",
        "Nothing measurable — it is a documentation setting describing the hardware to operators",
        "It applies only to bitmap heap scans, where random fetches are already sorted into page order",
      ],
      answer: 0,
      explain:
        "The ratio between `random_page_cost` and `seq_page_cost` is the thing that sets the crossover. Changing it re-prices every index scan the planner will ever consider — one of the highest-leverage settings in the system, and the one most often left at a value tuned for spinning disks.",
    },
    {
      kind: "editor",
      intro: `### Price both plans and find the crossover

1. \`seq_cost() -> u64\` — pages read sequentially, plus one CPU cost per row.
2. \`index_cost(matched: u64) -> u64\` — \`INDEX_DEPTH\` random fetches to descend, then one random page fetch plus CPU costs per matched row.
3. For each selectivity in \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` parts per million, derive \`matched = ROWS * ppm / 1_000_000\`, price both plans, and print the one the planner would pick.
4. Then **find** the crossover by scanning \`m\` upward until \`index_cost(m) >= seq_cost()\` — do not hard-code it.

Expected output:

\`\`\`text
selectivity  matched   seq cost  index cost  plan
     0.010%       10     150000        5220  Index Scan
     0.100%      100     150000       41400  Index Scan
     0.300%      300     150000      121800  Index Scan
     0.500%      500     150000      202200  Seq Scan
     1.000%     1000     150000      403200  Seq Scan
    10.000%    10000     150000     4021200  Seq Scan
crossover: seq scan wins from 371 rows (0.371%)
\`\`\`

371 rows out of 100,000. That is where "the index is not being used" begins.`,
    },
  ],

  "backend-data-layer-4": [
    {
      kind: "theory",
      body: `\`LIMIT 20 OFFSET 4980\` does not jump anywhere. The server produces rows in order, discards the first 4980, and returns the next 20. The cost is O(offset + limit) — page 250 costs 250 times page 1.

An index on the sort column removes the **sort**, not the **skip**. The rows arrive already ordered, and are then still produced and thrown away one at a time.

\`\`\`text
page   1   →  20 rows read,  20 returned
page  10   → 200 rows read,  20 returned
page 250   → 5000 rows read, 20 returned
\`\`\`

The number that matters is the whole crawl, because that is what a background export or an infinite-scrolling client actually performs: 250 pages costs 627,500 row reads by \`OFFSET\` and 5,000 by cursor.`,
    },
    {
      kind: "theory",
      body: `A **cursor** is the last row's sort key. The next page is:

\`\`\`sql
WHERE (created_at, id) > ($1, $2)
ORDER BY created_at, id
LIMIT 20
\`\`\`

That is a predicate the index can seek on, so every page costs O(log n + limit) no matter how deep it is.

It has one requirement: a **total order**. \`ORDER BY created_at\` alone is not one — ties make rows appear on two pages or on none. Append a unique tiebreak (the primary key) and compare as a tuple.

This is a correctness fix as much as a speed one. Over a table taking inserts, \`OFFSET\` silently skips and duplicates rows between page fetches, because the offset is measured against a result set that changed underneath it. A cursor is anchored to a row, so it cannot. *RPC Services at Scale*, lesson 7, counts the rows a client loses that way; here the measurement is cost.

The trade is honest: a cursor cannot jump to page 47 and cannot show a page count. If the UI needs numbered pages over a large table, that is a product decision with a price attached.

Across shards the cursor is what makes fan-out affordable — each shard seeks its own cursor and returns \`limit\` rows to merge. With \`OFFSET\`, every shard must produce \`offset + limit\` rows and discard nearly all of them.`,
    },
    {
      kind: "quiz",
      question:
        "The `ORDER BY` column is indexed, and page 900 of a paginated export still times out. Why?",
      options: [
        "The index supplies the ordering but not the skip — all 18,000 preceding rows are still produced and discarded",
        "The index cannot be used with `LIMIT`, so the planner falls back to a sort",
        "The result set no longer fits in `work_mem`, so the sort spills to disk",
      ],
      answer: 0,
      explain:
        "This is the belief that ships a query which is fast in staging, where you only ever look at page 1, and times out in production on page 900. The index removed the sort. Nothing removed the skip.",
    },
    {
      kind: "fill",
      prompt:
        "Seek to the first row strictly after the last id the previous page returned.",
      file: "main.rs",
      before: "for (id, _) in idx.range((",
      after: ", Bound::Unbounded)) {",
      choices: [
        "Bound::Excluded(after)",
        "Bound::Included(after)",
        "Bound::Unbounded",
      ],
      answer: 0,
      explain:
        "`Included` re-returns the last row of the previous page on every page — the classic keyset off-by-one, and one that looks correct until somebody counts. `Unbounded` restarts from the beginning each time, which is `OFFSET 0` forever.",
    },
    {
      kind: "quiz",
      question: "What makes a keyset cursor faster than `OFFSET`?",
      options: [
        "It carries the last row's sort key, so it becomes a `WHERE` predicate the index can seek on",
        "It is an encoded offset, and decoding it server-side avoids re-parsing the query",
        "It caches the previous page's result set on the server, so the next page continues from it",
      ],
      answer: 0,
      explain:
        "The encoding is packaging, not mechanism — an encoded offset performs exactly like `OFFSET`. What makes it fast is that the cursor value can be compared against the index key. There is no server-side state involved, which is also why it survives a reconnect.",
    },
    {
      kind: "editor",
      intro: `### Count what OFFSET reads

1. \`offset_page(rows, offset, limit) -> (Vec<u32>, usize)\` — read from the start, count every row read **including the skipped ones**, then collect \`limit\` rows.
2. \`cursor_page(idx, after, limit) -> (Vec<u32>, usize)\` — seek with \`Bound::Excluded(after)\` and read exactly \`limit\` rows.
3. 5000 rows, page size 20. Compare pages 1, 10, 50 and 250, and check both approaches return identical pages.
4. Then crawl all 250 pages both ways and print the totals.

Expected output:

\`\`\`text
 page  first id  offset rows read  cursor rows read
    1         1                20                20
   10       181               200                20
   50       981              1000                20
  250      4981              5000                20
full crawl of 250 pages: offset reads 627500, cursor reads 5000
same rows on every page: true
\`\`\`

125x fewer rows read, for the identical output.`,
    },
  ],

  "backend-data-layer-5": [
    {
      kind: "theory",
      body: `The three classical anomalies are each defined by what a **re-read** sees.

**Dirty read** — you observe a value another transaction wrote and has not committed. If it rolls back, you acted on data that never existed.

**Non-repeatable read** — you read the same row twice in one transaction and get two different values, because another transaction committed in between.

**Phantom read** — you run the same range query twice and the second returns rows that were not there before. The rows you already read did not change; the *set* changed.

The ANSI isolation levels are defined by which of these they forbid — not by how. That distinction is the lesson: the level is a contract, the mechanism is the engine's business.`,
    },
    {
      kind: "theory",
      body: `What the implementations actually do.

**Read Committed** takes a fresh snapshot per *statement*. **Repeatable Read** takes one per *transaction*. That single difference produces the second column of the table you are about to print.

The level names are a **floor, not a specification**. Postgres's \`REPEATABLE READ\` is snapshot isolation and does not permit phantoms, though ANSI allows it to. MySQL's InnoDB uses next-key locks and blocks most of them too. Never port an assumption about anomalies between engines on the strength of a level name.

Snapshot isolation still permits **write skew**: two transactions each read a set, each check an invariant, each write a *different* row, and the invariant ends up violated although neither saw a conflict. Only true \`SERIALIZABLE\` (SSI in Postgres) forbids it — and it forbids it by **aborting** one transaction with a serialization failure. Serializable code without a retry loop is not serializable in practice.

Locking is the cost side. Row locks are cheap and numerous; page and table locks are coarse and cheap to track. Some engines escalate row locks to table locks under memory pressure, at which point concurrency collapses. A serializable range predicate needs a predicate or gap lock covering rows that do not exist yet — which is why it is the expensive level.`,
    },
    {
      kind: "quiz",
      question:
        "A long-running report runs at `REPEATABLE READ`. What does that guarantee?",
      options: [
        "The report sees one consistent snapshot; other transactions commit freely and it simply does not see them",
        "No other transaction can commit changes to the rows the report reads until it finishes",
        "The report's own writes are guaranteed to succeed at commit, since its snapshot is fixed",
      ],
      answer: 0,
      explain:
        "Isolation is about visibility, not exclusion. Treating a long transaction as a lock is how people end up holding the vacuum horizon open for an hour to protect data nobody was writing — and a write from that transaction can still be rejected at commit.",
    },
    {
      kind: "fill",
      prompt:
        "Read Committed takes a fresh snapshot per statement — it sees whatever is committed right now.",
      file: "main.rs",
      before: "        Level::ReadCommitted => ",
      after: ",",
      choices: [
        "store.committed.clone()",
        "snapshot.to_vec()",
        "store.pending.clone()",
      ],
      answer: 0,
      explain:
        "`snapshot.to_vec()` is Repeatable Read's rule — one snapshot for the whole transaction — and swapping the two is the single most common confusion between the levels. `pending` alone would show only the uncommitted writes and none of the committed table.",
    },
    {
      kind: "quiz",
      question:
        "A service moves from `READ COMMITTED` to `SERIALIZABLE` and changes nothing else. What is the likely result?",
      options: [
        "Requests start failing under contention with serialization errors, because nothing retries the aborted transactions",
        "Throughput drops but correctness strictly improves, since every anomaly is now impossible",
        "Nothing changes on Postgres, where `READ COMMITTED` already provides serializable semantics",
      ],
      answer: 0,
      explain:
        "`SERIALIZABLE` converts silent anomalies into loud aborts — an improvement only if the caller retries. Without a retry loop, the application is less correct than it was, because it now returns errors where it previously returned slightly-wrong answers. (Defaults worth knowing: Read Committed in Postgres, Repeatable Read in MySQL.)",
    },
    {
      kind: "editor",
      intro: `### Derive the anomaly table from a trace

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — one function, four rules. Read Uncommitted overlays \`pending\` on \`committed\`; Read Committed returns \`committed\`; Repeatable Read returns the snapshot plus rows that did not exist in it; Serializable returns the snapshot alone.
2. \`read(...)\` picks one key out of the visible set; \`count_at_least(...)\` runs a range query over it — that is where the phantom appears.
3. Trace three stages: a pending write of \`200\` to key 1, then that write committed, then a new row 3 inserted.
4. Print the readings, then **derive** the anomaly table from them — do not assert it.

Expected output:

\`\`\`text
level                 read #1  read #2  rows >= 100
read uncommitted          200      200            3
read committed            100      200            3
repeatable read           100      100            3
serializable              100      100            2

anomaly                RU    RC    RR   SER
dirty read            yes    no    no    no
non-repeatable read   yes   yes    no    no
phantom read          yes   yes   yes    no
\`\`\`

The staircase is the point: each level forbids one more anomaly than the last.`,
    },
  ],

  "backend-data-layer-6": [
    {
      kind: "theory",
      body: `A transaction is a **write buffer plus an atomicity rule**.

Inside the transaction, reads see your own uncommitted writes. Outside it, nothing sees them until \`COMMIT\`. That is the whole of read-your-own-writes, and the exercise implements it as a lookup that checks the buffer before the store.

\`ROLLBACK\` is therefore **not an undo**. The changes were never applied anywhere anyone else could see them — the buffer is discarded, or the WAL's uncommitted records are simply never replayed. Rolling back a million-row transaction is not proportionally expensive.

Durability comes from the write-ahead log: \`COMMIT\` is an \`fsync\` of the log record, not of the data pages. That \`fsync\` is the hard floor on write latency, which is why committing 1000 rows in one transaction beats 1000 transactions, and why group commit exists at all.

What a long transaction really costs is not rollback work. It is the locks it holds and the vacuum or undo horizon it pins, so old row versions cannot be reclaimed.`,
    },
    {
      kind: "theory",
      body: `A prepared statement is **server-side state**.

\`PREPARE\` parses the SQL, builds a plan, and names it. \`EXECUTE\` sends parameter *values* over the wire, not SQL text. The reuse saves the parse and usually the plan, which for a short OLTP query is a real fraction of total time.

It is also the correct injection defence, for a structural reason: parameters arrive out of band and are never handed to the parser. Escaping is a filter you can get wrong; parameter binding is a channel that cannot carry syntax.

Two catches.

**It is per-connection.** A pooler in transaction mode hands you a different backend for each transaction, so the named plan is not there. That is the concrete reason pgbouncer's transaction mode and prepared statements have historically fought, and why drivers re-prepare after a reconnect.

**A reused plan is a generic plan**, chosen without knowing this call's parameter values. On a skewed column it can be far worse than a re-planned one; Postgres hedges by costing custom plans for the first five executions before deciding.

Deadlocks belong here because they are a transaction-level failure. Two transactions updating the same two rows in opposite orders form a cycle; the engine detects it and kills one with a deadlock error — it does not hang. Fix it by ordering writes on a stable key and keeping transactions short, and make every caller able to retry a deadlock victim.`,
    },
    {
      kind: "quiz",
      question:
        "A bulk job writes 2 million rows in one transaction and then hits a constraint violation. What does `ROLLBACK` cost?",
      options: [
        "Almost nothing — the writes were never committed, so there is nothing to undo where others could see it",
        "Roughly the cost of the writes again, since each one must be reversed",
        "Nothing at rollback time, but a full table rewrite at the next checkpoint",
      ],
      answer: 0,
      explain:
        "The operationally sensible-sounding conclusion — 'so split big writes into small transactions to keep rollback cheap' — has the right advice and the wrong reason. Split them because of lock duration and the vacuum horizon the long transaction pins, not because rollback is expensive.",
    },
    {
      kind: "fill",
      prompt:
        "The constraint failed. Discard the buffered writes rather than applying and reversing them.",
      file: "main.rs",
      before: "    if after < 0 {\n        ",
      after:
        ";\n        return Err(format!(\"CHECK balance >= 0 violated: {}\", after));\n    }",
      choices: ["txn.rollback()", "txn.set(from, a)", "txn.commit(db)"],
      answer: 0,
      explain:
        "`txn.set(from, a)` is the compensating write — what you do when you have no transaction. There is nothing to compensate: the store was never touched. `commit` applies the very write the check just rejected.",
    },
    {
      kind: "quiz",
      question: "What does a prepared statement actually reuse?",
      options: [
        "Server-side parse and plan state, held per connection and referenced by name",
        "A client-side SQL template with the parameter values interpolated before sending",
        "A cached result set on the server, returned again when the same parameters arrive",
      ],
      answer: 0,
      explain:
        "That one fact explains all three properties at once: it is fast because there is nothing to re-parse, injection-proof because values never reach the parser, and broken under a transaction-mode pooler because the connection carrying the state is not the one you get back.",
    },
    {
      kind: "editor",
      intro: `### Commit, roll back, and prepare once

1. \`Db\` holds \`rows\`, the compiled \`plans\`, and an \`executions\` counter. \`prepare(sql)\` returns the existing handle if that text was already compiled; \`execute(plan)\` only bumps the counter.
2. \`Txn\` buffers writes in a \`BTreeMap<u32, i64>\`. \`get\` reads through the buffer then falls back to the store; \`set\` buffers; \`commit\` applies every buffered write; \`rollback\` drops the buffer.
3. \`transfer(...)\` debits, credits, then checks \`balance >= 0\` — committing or rolling back accordingly.
4. Run a transfer of \`30\` (commits) and a transfer of \`500\` (violates the check). Prepare the same SQL twice and show the handle is the same.

Expected output:

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

Four executions, one compile — and the rolled-back transfer left no trace in the store.`,
    },
  ],

  "backend-data-layer-7": [
    {
      kind: "theory",
      body: `A connection pool is a **fixed slot count plus a queue**.

Opening a Postgres connection costs a TCP handshake, TLS, authentication and a forked backend process — single-digit to tens of milliseconds. A pool amortises that by keeping N open and handing them out: check out, use, check in.

So the latency a client observes is **queue wait + query time**. When the pool is saturated the first term dominates and the second is unchanged. That is why \`pg_stat_statements\` shows a fast query at the same moment the client sees a slow request: the two numbers measure different intervals, and they are both correct.

Exhaustion surfaces as a checkout timeout — \`PoolTimedOut\`, \`TimeoutError: QueuePool limit ... overflow\`. That is a capacity signal about your service, not a database fault.

The simulation makes it concrete: at capacity 1, the worst request waits 198 ms for a pool whose longest query is 25 ms.`,
    },
    {
      kind: "theory",
      body: `Bigger is not better.

Past the database's useful concurrency — roughly cores plus effective I/O parallelism — extra pool slots add no throughput. They move the queue out of your process, where it is measurable and bounded, and into the database, where it becomes lock contention and context switching that degrades every other client. The exercise shows it plainly: 8 slots and 16 slots produce an identical makespan.

The real ceiling is multiplicative: **instances x pool size vs \`max_connections\`**. Ten pods with a pool of 20 is 200 connections from one service. Collapsing that is what a server-side pooler (pgbouncer, pgcat) is for, at the price of transaction mode's restrictions on session state.

The cheapest fix is usually not a bigger pool but a **shorter checkout**. Never hold a connection across an HTTP call, and never open the transaction before you have everything needed to finish it.

Read replicas have their own pool and their own lag. Replication is asynchronous by default, so a read issued milliseconds after your own write can legitimately return the pre-write value. Read-your-writes means routing that read to the primary, or waiting for the replica to reach the LSN your commit returned. "It's eventually consistent" is not a design; the routing rule is.`,
    },
    {
      kind: "quiz",
      question:
        "p99 on an endpoint jumps from 30 ms to 400 ms. The database reports the same query at 4 ms mean, unchanged. What is the first thing to look at?",
      options: [
        "Connection checkout wait — the client's latency includes queue time the database never sees",
        "The query plan, since a 400 ms p99 on a 4 ms mean means the plan flipped for some parameter values",
        "Index bloat, which slows some executions without moving the mean the database reports",
      ],
      answer: 0,
      explain:
        "The reflex to tune the query is what costs a day for no change. The database's number starts when the statement arrives on a connection; the client's starts when the request does. Under a saturated pool the gap between them is the entire regression.",
    },
    {
      kind: "fill",
      prompt:
        "Measure what the client actually experiences before the query begins.",
      file: "main.rs",
      before: "        let wait = ",
      after: ";",
      choices: ["start - arrival", "free_at[slot] - arrival", "ms"],
      answer: 0,
      explain:
        "`ms` is the query's own duration — the number the database reports, and the one that stays flat while the client's p99 explodes. `free_at[slot] - arrival` underflows when the slot was already free before the request arrived, which is precisely the uncontended case.",
    },
    {
      kind: "quiz",
      question:
        "Checkout timeouts appear under peak load. Why is raising the pool size the wrong first move?",
      options: [
        "It trades a bounded, visible error for contention inside the database — and, multiplied across instances, for a `too many connections` outage affecting every service",
        "Pool size cannot be changed without restarting the application, so it is not an option during an incident",
        "A larger pool increases per-connection memory, and that is the only real cost",
      ],
      answer: 0,
      explain:
        "A timeout at a bounded pool is the system telling the truth about its capacity. Removing the bound does not add capacity — it relocates the queue somewhere you cannot see it, and puts a shared resource at risk on behalf of one service.",
    },
    {
      kind: "editor",
      intro: `### Read queue wait out of a pool

1. \`service_times()\` — a deterministic LCG: seed \`1\`, \`next = seed * 1103515245 + 12345 mod 2^31\`, service \`= 5 + (next >> 16) % 21\`. Sixteen of them.
2. \`simulate(capacity, service) -> (max wait, mean wait, timeouts, makespan)\` — requests arrive every 3 ms and take the earliest-free slot. Wait is \`start - arrival\`; a wait over \`CHECKOUT_TIMEOUT\` counts as a timeout.
3. Print the service times and the total database work, then one row per capacity in \`[1, 2, 4, 8, 16]\`.

Expected output:

\`\`\`text
service times (ms): [22, 9, 17, 6, 18, 25, 20, 11, 5, 17, 24, 25, 17, 11, 16, 13]
total db work: 256 ms over 16 requests

 capacity  max wait  mean wait  timeouts  makespan
        1       198         96        11       256
        2        74         34         4       132
        4        17          5         0        75
        8         0          0         0        58
       16         0          0         0        58
\`\`\`

No query got slower between capacity 1 and capacity 8. Only the waiting changed — and note that 16 slots buy nothing over 8.`,
    },
  ],
};
