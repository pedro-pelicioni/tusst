import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · The Data Layer — hidden grading data.

export const backendDataLayerGraders: Record<string, AdvancedLessonContent> = {
  "backend-data-layer-1": {
    instructions: `## Index Scan vs Seq Scan: Rows Examined

A B-tree lookup is a descent — O(log n) — followed by a walk along the leaf level — O(k). A sequential scan is O(n) whatever the predicate: it examines all 1000 rows to return 1.

"Rows examined" is the number \`EXPLAIN ANALYZE\` reports as \`rows\` on each node. Print it, and the asymptotics stop being a claim.

### Your task

1. \`seq_scan(rows: &[Row], lo: u32, hi: u32) -> (Vec<u32>, usize)\` — touch every row, count each one touched, collect the \`amount\` of the ones whose \`id\` falls in \`lo..=hi\`.
2. \`index_scan(idx: &BTreeMap<u32, Row>, lo: u32, hi: u32) -> (Vec<u32>, usize)\` — range over the index and count only the entries the range actually visits.
3. In \`main\`, build 1000 rows (\`id\` 1..=1000, \`amount = id * 3\`) and a \`BTreeMap<u32, Row>\` keyed on \`id\`.
4. Run both plans over \`(500, 500)\`, \`(500, 509)\` and \`(500, 599)\`, print the table, then print whether both plans returned identical rows.

Expected output:

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

### Hints

- \`idx.range(lo..=hi)\` yields \`(&u32, &Row)\` for exactly the keys in range — it does not visit the rest.
- The header and each row use \`"{:>11}  {:>7}  {:>9}  {:>9}"\`.
- \`format!("{}..={}", lo, hi)\` builds the range label so \`{:>11}\` can right-align it.
- Keep the count in a local \`examined\` and do \`examined += 1\` at the top of each loop body — counting the entries the plan visits is the measurement, so it has to happen before the predicate, not after it.
`,
    starterCode: `use std::collections::BTreeMap;

#[derive(Clone, Copy)]
struct Row {
    id: u32,
    amount: u32,
}

fn seq_scan(rows: &[Row], lo: u32, hi: u32) -> (Vec<u32>, usize) {
    // Touch every row. Count each one you touch, collect the ones in range.
    (Vec::new(), 0)
}

fn index_scan(idx: &BTreeMap<u32, Row>, lo: u32, hi: u32) -> (Vec<u32>, usize) {
    // Range over the index. Count only the entries the range actually visits.
    (Vec::new(), 0)
}

fn main() {
    // 1000 rows, one index, then the table.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "defines a counting sequential scan",
        kind: "fn_defined",
        fn: "seq_scan",
        returns: "(Vec<u32>, usize)",
      },
      {
        name: "defines a counting index scan",
        kind: "fn_defined",
        fn: "index_scan",
        returns: "(Vec<u32>, usize)",
      },
      {
        name: "seeks a key range instead of walking the index",
        kind: "method_called",
        method: "range",
      },
      {
        name: "counts every row the plan touches",
        kind: "expr_present",
        expr: "examined += 1",
      },
      {
        name: "the index scan does not iterate the whole index",
        kind: "expr_present",
        expr: "idx.iter()",
        forbidden: true,
      },
    ],
    expectedOutput:
      "      range  matched   seq rows   idx rows\n  500..=500        1       1000          1\n  500..=509       10       1000         10\n  500..=599      100       1000        100\nsame rows returned: true\n",
    referenceSolution: `use std::collections::BTreeMap;

#[derive(Clone, Copy)]
struct Row {
    id: u32,
    amount: u32,
}

fn seq_scan(rows: &[Row], lo: u32, hi: u32) -> (Vec<u32>, usize) {
    let mut hits = Vec::new();
    let mut examined = 0usize;
    for r in rows {
        examined += 1;
        if r.id >= lo && r.id <= hi {
            hits.push(r.amount);
        }
    }
    (hits, examined)
}

fn index_scan(idx: &BTreeMap<u32, Row>, lo: u32, hi: u32) -> (Vec<u32>, usize) {
    let mut hits = Vec::new();
    let mut examined = 0usize;
    for (_key, r) in idx.range(lo..=hi) {
        examined += 1;
        hits.push(r.amount);
    }
    (hits, examined)
}

fn main() {
    let rows: Vec<Row> = (1..=1000u32)
        .map(|id| Row { id, amount: id * 3 })
        .collect();

    let mut idx: BTreeMap<u32, Row> = BTreeMap::new();
    for r in &rows {
        idx.insert(r.id, *r);
    }

    println!(
        "{:>11}  {:>7}  {:>9}  {:>9}",
        "range", "matched", "seq rows", "idx rows"
    );

    let mut agree = true;
    for (lo, hi) in [(500u32, 500u32), (500, 509), (500, 599)] {
        let (seq_hits, seq_examined) = seq_scan(&rows, lo, hi);
        let (idx_hits, idx_examined) = index_scan(&idx, lo, hi);
        if seq_hits != idx_hits {
            agree = false;
        }
        println!(
            "{:>11}  {:>7}  {:>9}  {:>9}",
            format!("{}..={}", lo, hi),
            seq_hits.len(),
            seq_examined,
            idx_examined
        );
    }

    println!("same rows returned: {}", agree);
}
`,
  },

  "backend-data-layer-2": {
    instructions: `## Composite Indexes & the Leftmost Prefix

An index on \`(tenant, status, created)\` is **one** structure keyed on the concatenated tuple, ordered lexicographically. The only contiguous ranges it contains are the ones pinned by a leftmost prefix.

A gap in the middle degrades to a prefix seek plus a residual filter — \`Rows Removed by Filter\` in \`EXPLAIN\`. A predicate with no usable prefix gets a sequential scan.

### Your task

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`, with \`created\` doubling as the row id.
2. \`index_scan(idx, lo, hi, keep) -> (usize, usize)\` — walk \`idx.range(lo..=hi)\`, counting every entry visited and every one \`keep\` lets through.
3. \`seq_scan(rows, keep) -> (usize, usize)\` — touch every row, for the predicates no prefix can serve.
4. Build 1000 rows as \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\` for \`id\` in \`1..=1000\`, and one \`BTreeMap<Key, u32>\` over them.
5. Run these five queries — all of them against \`tenant = 3\`, \`status = 1\`, \`created >= 700\` — and report which prefix each one used:

| predicates | seek from | seek to | keep |
| --- | --- | --- | --- |
| tenant | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&all\` |
| tenant, status | \`(3, 1, 0)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, status, created | \`(3, 1, 700)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, created | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&late\` |
| status, created | *no prefix* — \`seq_scan\` | | a closure on \`k.1 == 1 && k.2 >= 700\` |

with \`let max = u32::MAX;\`, \`let all = \|_k: Key\| true;\` and \`let late = \|k: Key\| k.2 >= 700;\`. Row four is the gap in the middle: the seek can only pin \`tenant\`, and \`late\` filters the rest.

Expected output:

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

### Hints

- The upper bound of a prefix seek pads the unconstrained columns with \`u32::MAX\`.
- \`keep\` is a \`&dyn Fn(Key) -> bool\`; pass \`&all\` when the seek is exact and \`&late\` when a residual filter is doing the work.
- \`report\` uses \`"{:<24}{:<26}{:>9}{:>9}"\`, and so does the header.
`,
    starterCode: `use std::collections::BTreeMap;

type Key = (u32, u32, u32);

fn index_scan(idx: &BTreeMap<Key, u32>, lo: Key, hi: Key, keep: &dyn Fn(Key) -> bool) -> (usize, usize) {
    // Visit the key range. Count every entry visited, and every one \`keep\` lets through.
    (0, 0)
}

fn seq_scan(rows: &[Key], keep: &dyn Fn(Key) -> bool) -> (usize, usize) {
    // No usable prefix: touch every row.
    (0, 0)
}

fn report(predicates: &str, prefix: &str, examined: usize, matched: usize) {
    println!("{:<24}{:<26}{:>9}{:>9}", predicates, prefix, examined, matched);
}

fn main() {
    // Build the rows and the composite index, then run the five queries.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "builds one composite index on (tenant, status, created)",
        kind: "let_binding",
        var: "idx",
        mutable: true,
        ty: "BTreeMap<Key, u32>",
      },
      {
        name: "scans a key range of the index",
        kind: "fn_defined",
        fn: "index_scan",
      },
      {
        name: "keeps a sequential scan for what the index cannot serve",
        kind: "fn_defined",
        fn: "seq_scan",
      },
      {
        name: "seeks a prefix range rather than walking the index",
        kind: "method_called",
        method: "range",
      },
      {
        name: "the three-column query seeks straight to its start key",
        kind: "expr_present",
        expr: "(3, 1, 700)",
      },
    ],
    expectedOutput:
      "predicates              prefix used                examined  matched\ntenant                  tenant                          100      100\ntenant, status          tenant, status                   33       33\ntenant, status, created tenant, status, created          10       10\ntenant, created         tenant                          100       30\nstatus, created         none - seq scan                1000      100\n",
    referenceSolution: `use std::collections::BTreeMap;

type Key = (u32, u32, u32);

fn index_scan(idx: &BTreeMap<Key, u32>, lo: Key, hi: Key, keep: &dyn Fn(Key) -> bool) -> (usize, usize) {
    let mut examined = 0usize;
    let mut matched = 0usize;
    for (k, _id) in idx.range(lo..=hi) {
        examined += 1;
        if keep(*k) {
            matched += 1;
        }
    }
    (examined, matched)
}

fn seq_scan(rows: &[Key], keep: &dyn Fn(Key) -> bool) -> (usize, usize) {
    let mut examined = 0usize;
    let mut matched = 0usize;
    for k in rows {
        examined += 1;
        if keep(*k) {
            matched += 1;
        }
    }
    (examined, matched)
}

fn report(predicates: &str, prefix: &str, examined: usize, matched: usize) {
    println!("{:<24}{:<26}{:>9}{:>9}", predicates, prefix, examined, matched);
}

fn main() {
    // (tenant, status, created) — created doubles as the row id.
    let rows: Vec<Key> = (1..=1000u32)
        .map(|id| ((id - 1) % 10, ((id - 1) / 10) % 3, id))
        .collect();

    let mut idx: BTreeMap<Key, u32> = BTreeMap::new();
    for k in &rows {
        idx.insert(*k, k.2);
    }

    let all = |_k: Key| true;
    let late = |k: Key| k.2 >= 700;
    let max = u32::MAX;

    println!("{:<24}{:<26}{:>9}{:>9}", "predicates", "prefix used", "examined", "matched");

    let (e, m) = index_scan(&idx, (3, 0, 0), (3, max, max), &all);
    report("tenant", "tenant", e, m);

    let (e, m) = index_scan(&idx, (3, 1, 0), (3, 1, max), &all);
    report("tenant, status", "tenant, status", e, m);

    let (e, m) = index_scan(&idx, (3, 1, 700), (3, 1, max), &all);
    report("tenant, status, created", "tenant, status, created", e, m);

    let (e, m) = index_scan(&idx, (3, 0, 0), (3, max, max), &late);
    report("tenant, created", "tenant", e, m);

    let (e, m) = seq_scan(&rows, &|k| k.1 == 1 && k.2 >= 700);
    report("status, created", "none - seq scan", e, m);
}
`,
  },

  "backend-data-layer-3": {
    instructions: `## The Cost Model Behind EXPLAIN

The planner enumerates plans and prices each one in arbitrary units built from four constants — \`seq_page_cost\`, \`random_page_cost\`, \`cpu_tuple_cost\`, \`cpu_index_tuple_cost\`. A seq scan is a fixed price; an index scan is a per-matched-row price. They cross, and the planner takes the lower one.

The constants here are scaled to integers so nothing depends on floats.

### Your task

1. \`seq_cost() -> u64\` — \`ROWS / ROWS_PER_PAGE\` pages at \`SEQ_PAGE_COST\`, plus \`ROWS * CPU_TUPLE_COST\`.
2. \`index_cost(matched: u64) -> u64\` — \`INDEX_DEPTH\` random fetches to descend, then per matched row one random page fetch plus \`CPU_TUPLE_COST + CPU_INDEX_COST\`.
3. For each selectivity in \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` parts per million, derive \`matched\`, price both plans, and print the plan the planner would choose.
4. Find the crossover by scanning \`m\` upward until \`index_cost(m) >= seq_cost()\`. Do not hard-code it.

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

### Hints

- \`matched = ROWS * ppm / 1_000_000\`, in that order — dividing first loses the small selectivities.
- Header and rows share \`"{:>11}{:>9}{:>11}{:>12}  {}"\`.
- The crossover row's label is \`selectivity_label(crossover * 1_000_000 / ROWS)\`.
- Bind the two prices as \`seq\` and \`idx\` per row; the plan is \`if idx < seq { "Index Scan" } else { "Seq Scan" }\`, so a tie goes to the seq scan.
`,
    starterCode: `const ROWS: u64 = 100_000;
const ROWS_PER_PAGE: u64 = 200;
const SEQ_PAGE_COST: u64 = 100;
const RANDOM_PAGE_COST: u64 = 400;
const CPU_TUPLE_COST: u64 = 1;
const CPU_INDEX_COST: u64 = 1;
const INDEX_DEPTH: u64 = 3;

fn seq_cost() -> u64 {
    // pages read sequentially, plus one cpu cost per row
    0
}

fn index_cost(matched: u64) -> u64 {
    // descend the tree, then one random page fetch per matched row
    0
}

fn selectivity_label(ppm: u64) -> String {
    format!("{}.{:03}%", ppm / 10_000, (ppm % 10_000) / 10)
}

fn main() {
    // Price both plans at each selectivity, pick the cheaper, then find the crossover.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "prices the sequential scan",
        kind: "fn_defined",
        fn: "seq_cost",
        returns: "u64",
      },
      {
        name: "prices the index scan per matched row",
        kind: "fn_defined",
        fn: "index_cost",
        params: [{ name: "matched", ty: "u64" }],
        returns: "u64",
      },
      {
        name: "derives matched rows from selectivity",
        kind: "expr_present",
        expr: "ROWS * ppm / 1_000_000",
      },
      {
        name: "chooses the cheaper plan",
        kind: "expr_present",
        expr: "idx < seq",
      },
      {
        name: "finds the crossover instead of asserting it",
        kind: "expr_present",
        expr: "index_cost(m) >= seq_cost()",
      },
    ],
    expectedOutput:
      "selectivity  matched   seq cost  index cost  plan\n     0.010%       10     150000        5220  Index Scan\n     0.100%      100     150000       41400  Index Scan\n     0.300%      300     150000      121800  Index Scan\n     0.500%      500     150000      202200  Seq Scan\n     1.000%     1000     150000      403200  Seq Scan\n    10.000%    10000     150000     4021200  Seq Scan\ncrossover: seq scan wins from 371 rows (0.371%)\n",
    referenceSolution: `const ROWS: u64 = 100_000;
const ROWS_PER_PAGE: u64 = 200;
const SEQ_PAGE_COST: u64 = 100;
const RANDOM_PAGE_COST: u64 = 400;
const CPU_TUPLE_COST: u64 = 1;
const CPU_INDEX_COST: u64 = 1;
const INDEX_DEPTH: u64 = 3;

fn seq_cost() -> u64 {
    let pages = ROWS / ROWS_PER_PAGE;
    pages * SEQ_PAGE_COST + ROWS * CPU_TUPLE_COST
}

fn index_cost(matched: u64) -> u64 {
    INDEX_DEPTH * RANDOM_PAGE_COST
        + matched * (RANDOM_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST)
}

fn selectivity_label(ppm: u64) -> String {
    format!("{}.{:03}%", ppm / 10_000, (ppm % 10_000) / 10)
}

fn main() {
    println!(
        "{:>11}{:>9}{:>11}{:>12}  {}",
        "selectivity", "matched", "seq cost", "index cost", "plan"
    );

    for ppm in [100u64, 1_000, 3_000, 5_000, 10_000, 100_000] {
        let matched = ROWS * ppm / 1_000_000;
        let seq = seq_cost();
        let idx = index_cost(matched);
        let plan = if idx < seq { "Index Scan" } else { "Seq Scan" };
        println!(
            "{:>11}{:>9}{:>11}{:>12}  {}",
            selectivity_label(ppm),
            matched,
            seq,
            idx,
            plan
        );
    }

    let mut crossover = 0u64;
    for m in 0..=ROWS {
        if index_cost(m) >= seq_cost() {
            crossover = m;
            break;
        }
    }
    println!(
        "crossover: seq scan wins from {} rows ({})",
        crossover,
        selectivity_label(crossover * 1_000_000 / ROWS)
    );
}
`,
  },

  "backend-data-layer-4": {
    instructions: `## Cursor Pagination vs OFFSET

\`LIMIT 20 OFFSET 4980\` does not seek. The server produces rows in order and discards the first 4980. An index on the sort column removes the sort, not the skip.

A keyset cursor is the last row's sort key, which turns "the next page" into a predicate the index can seek on — O(log n + limit) at any depth.

### Your task

1. \`offset_page(rows: &[u32], offset: usize, limit: usize) -> (Vec<u32>, usize)\` — read from the start and count **every** row read, including the ones the offset discards.
2. \`cursor_page(idx: &BTreeMap<u32, u32>, after: u32, limit: usize) -> (Vec<u32>, usize)\` — seek strictly past \`after\` and read exactly \`limit\` rows.
3. 5000 rows, \`PAGE = 20\`. Compare pages 1, 10, 50 and 250, printing rows read for each approach, and track whether both returned identical pages.
4. Then crawl all 250 pages both ways and print the two totals.

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

### Hints

- \`idx.range((Bound::Excluded(after), Bound::Unbounded))\` is the seek. \`Bound::Included\` re-returns the previous page's last row.
- Page 1's cursor is \`0\`, which is below every id in the table.
- The table uses \`"{:>5}{:>10}{:>18}{:>18}"\`.
- Count into a local \`read\` with \`read += 1\` per row. Do **not** reach for \`.skip(offset)\` and add \`offset\` back on: the whole point is that the discarded rows are produced one at a time, and an iterator adaptor hides exactly the cost the lesson is measuring.
`,
    starterCode: `use std::collections::BTreeMap;
use std::ops::Bound;

const PAGE: usize = 20;

fn offset_page(rows: &[u32], offset: usize, limit: usize) -> (Vec<u32>, usize) {
    // Read from the start. The skipped rows are still read — count them.
    (Vec::new(), 0)
}

fn cursor_page(idx: &BTreeMap<u32, u32>, after: u32, limit: usize) -> (Vec<u32>, usize) {
    // Seek past \`after\` and read exactly \`limit\` rows.
    (Vec::new(), 0)
}

fn main() {
    // 5000 rows. Compare page 1, 10, 50 and 250, then the whole crawl.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "defines a counting OFFSET page",
        kind: "fn_defined",
        fn: "offset_page",
        returns: "(Vec<u32>, usize)",
      },
      {
        name: "defines a counting cursor page",
        kind: "fn_defined",
        fn: "cursor_page",
        returns: "(Vec<u32>, usize)",
      },
      {
        name: "the cursor seeks past the last id it returned",
        kind: "expr_present",
        expr: "Bound::Excluded(after)",
      },
      {
        name: "counts rows read, including the ones OFFSET discards",
        kind: "expr_present",
        expr: "read += 1",
      },
      {
        name: "does not skip the discarded rows with an iterator adaptor",
        kind: "method_called",
        method: "skip",
        forbidden: true,
      },
    ],
    expectedOutput:
      " page  first id  offset rows read  cursor rows read\n    1         1                20                20\n   10       181               200                20\n   50       981              1000                20\n  250      4981              5000                20\nfull crawl of 250 pages: offset reads 627500, cursor reads 5000\nsame rows on every page: true\n",
    referenceSolution: `use std::collections::BTreeMap;
use std::ops::Bound;

const PAGE: usize = 20;

fn offset_page(rows: &[u32], offset: usize, limit: usize) -> (Vec<u32>, usize) {
    let mut page = Vec::new();
    let mut read = 0usize;
    for id in rows {
        read += 1;
        if read > offset {
            page.push(*id);
            if page.len() == limit {
                break;
            }
        }
    }
    (page, read)
}

fn cursor_page(idx: &BTreeMap<u32, u32>, after: u32, limit: usize) -> (Vec<u32>, usize) {
    let mut page = Vec::new();
    let mut read = 0usize;
    for (id, _) in idx.range((Bound::Excluded(after), Bound::Unbounded)) {
        read += 1;
        page.push(*id);
        if page.len() == limit {
            break;
        }
    }
    (page, read)
}

fn main() {
    let rows: Vec<u32> = (1..=5000u32).collect();
    let mut idx: BTreeMap<u32, u32> = BTreeMap::new();
    for id in &rows {
        idx.insert(*id, *id);
    }

    println!("{:>5}{:>10}{:>18}{:>18}", "page", "first id", "offset rows read", "cursor rows read");

    let mut agree = true;
    for p in [1usize, 10, 50, 250] {
        let (by_offset, off_read) = offset_page(&rows, (p - 1) * PAGE, PAGE);
        let cursor = if p == 1 { 0 } else { ((p - 1) * PAGE) as u32 };
        let (by_cursor, cur_read) = cursor_page(&idx, cursor, PAGE);
        if by_offset != by_cursor {
            agree = false;
        }
        println!("{:>5}{:>10}{:>18}{:>18}", p, by_offset[0], off_read, cur_read);
    }

    let mut off_total = 0usize;
    let mut cur_total = 0usize;
    let pages = rows.len() / PAGE;
    for p in 1..=pages {
        off_total += offset_page(&rows, (p - 1) * PAGE, PAGE).1;
        cur_total += cursor_page(&idx, ((p - 1) * PAGE) as u32, PAGE).1;
    }

    println!("full crawl of {} pages: offset reads {}, cursor reads {}", pages, off_total, cur_total);
    println!("same rows on every page: {}", agree);
}
`,
  },

  "backend-data-layer-5": {
    instructions: `## Isolation Levels & the Anomalies They Permit

Each anomaly is defined by what a re-read sees. A **dirty read** sees an uncommitted write. A **non-repeatable read** sees a row change between two reads. A **phantom read** sees the *set* change between two range queries.

The ANSI levels are defined by which of these they forbid. Read Committed takes a snapshot per statement; Repeatable Read takes one per transaction.

### Your task

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — one function, four rules. \`ReadUncommitted\` overlays \`pending\` on \`committed\`; \`ReadCommitted\` returns \`committed\`; \`RepeatableRead\` returns the snapshot plus committed rows absent from it; \`Serializable\` returns the snapshot alone.
2. \`read(level, store, snapshot, key) -> i64\` picks one key out of the visible set (\`0\` when missing).
3. \`count_at_least(level, store, snapshot, min) -> usize\` runs a range query over the visible set.
4. Trace three stages: a **pending** write of \`200\` to key 1, then that write **committed**, then a new row \`(3, 100)\` inserted. Record each level's readings at each stage.
5. Print the readings, then **derive** the anomaly table from them — a dirty read is \`read #1 == 200\`, a non-repeatable read is \`read #2 != 100\`, a phantom is \`rows >= 100\` not equal to \`2\`.

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

### Hints

- The snapshot is \`vec![(1, 100), (2, 100)]\` and never changes.
- Repeatable Read is the interesting rule: it keeps the snapshot's *values* but still sees rows that did not exist in it, which is why it shows the phantom and not the non-repeatable read.
- \`"{:<20}{:>9}{:>9}{:>13}"\` for the first table, \`"{:<20}{:>5}{:>6}{:>6}{:>6}"\` for the second, and a bare \`println!();\` between them.
`,
    starterCode: `#[derive(Clone, Copy)]
enum Level {
    ReadUncommitted,
    ReadCommitted,
    RepeatableRead,
    Serializable,
}

struct Store {
    committed: Vec<(u32, i64)>,
    pending: Vec<(u32, i64)>,
}

fn visible(level: Level, store: &Store, snapshot: &[(u32, i64)]) -> Vec<(u32, i64)> {
    // What this level is allowed to see: pending writes, committed writes, or the snapshot.
    Vec::new()
}

fn read(level: Level, store: &Store, snapshot: &[(u32, i64)], key: u32) -> i64 {
    // One key out of the visible set.
    0
}

fn count_at_least(level: Level, store: &Store, snapshot: &[(u32, i64)], min: i64) -> usize {
    // A range query over the visible set — this is where the phantom shows up.
    0
}

fn yes_no(b: bool) -> &'static str {
    if b { "yes" } else { "no" }
}

fn main() {
    // Run the three-stage trace, then derive the anomaly table from what was read.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "one visibility rule drives every level",
        kind: "fn_defined",
        fn: "visible",
      },
      {
        name: "handles the uncommitted case",
        kind: "match_arm",
        pat: "Level::ReadUncommitted",
      },
      {
        name: "handles the serializable case",
        kind: "match_arm",
        pat: "Level::Serializable",
      },
      {
        name: "counts a range so the phantom can appear",
        kind: "fn_defined",
        fn: "count_at_least",
      },
      {
        name: "derives the dirty read from what read #1 actually saw",
        kind: "any_of",
        of: [
          { kind: "expr_present", expr: "yes_no(*v == 200)" },
          { kind: "expr_present", expr: "yes_no(v == 200)" },
          { kind: "expr_present", expr: "yes_no(first[i] == 200)" },
        ],
      },
    ],
    expectedOutput:
      "level                 read #1  read #2  rows >= 100\nread uncommitted          200      200            3\nread committed            100      200            3\nrepeatable read           100      100            3\nserializable              100      100            2\n\nanomaly                RU    RC    RR   SER\ndirty read            yes    no    no    no\nnon-repeatable read   yes   yes    no    no\nphantom read          yes   yes   yes    no\n",
    referenceSolution: `#[derive(Clone, Copy)]
enum Level {
    ReadUncommitted,
    ReadCommitted,
    RepeatableRead,
    Serializable,
}

struct Store {
    committed: Vec<(u32, i64)>,
    pending: Vec<(u32, i64)>,
}

fn visible(level: Level, store: &Store, snapshot: &[(u32, i64)]) -> Vec<(u32, i64)> {
    match level {
        Level::ReadUncommitted => {
            let mut rows = store.committed.clone();
            for (k, v) in &store.pending {
                match rows.iter_mut().find(|r| r.0 == *k) {
                    Some(r) => r.1 = *v,
                    None => rows.push((*k, *v)),
                }
            }
            rows
        }
        Level::ReadCommitted => store.committed.clone(),
        Level::RepeatableRead => {
            let mut rows = snapshot.to_vec();
            for (k, v) in &store.committed {
                if !snapshot.iter().any(|r| r.0 == *k) {
                    rows.push((*k, *v));
                }
            }
            rows
        }
        Level::Serializable => snapshot.to_vec(),
    }
}

fn read(level: Level, store: &Store, snapshot: &[(u32, i64)], key: u32) -> i64 {
    visible(level, store, snapshot)
        .iter()
        .find(|r| r.0 == key)
        .map(|r| r.1)
        .unwrap_or(0)
}

fn count_at_least(level: Level, store: &Store, snapshot: &[(u32, i64)], min: i64) -> usize {
    visible(level, store, snapshot).iter().filter(|r| r.1 >= min).count()
}

fn yes_no(b: bool) -> &'static str {
    if b { "yes" } else { "no" }
}

fn main() {
    let names = ["read uncommitted", "read committed", "repeatable read", "serializable"];
    let levels = [
        Level::ReadUncommitted,
        Level::ReadCommitted,
        Level::RepeatableRead,
        Level::Serializable,
    ];

    let snapshot = vec![(1u32, 100i64), (2, 100)];
    let mut store = Store { committed: vec![(1, 100), (2, 100)], pending: vec![(1, 200)] };

    let mut first = Vec::new();
    for l in levels {
        first.push(read(l, &store, &snapshot, 1));
    }

    store.committed = vec![(1, 200), (2, 100)];
    store.pending.clear();
    let mut second = Vec::new();
    for l in levels {
        second.push(read(l, &store, &snapshot, 1));
    }

    store.committed.push((3, 100));
    let mut counts = Vec::new();
    for l in levels {
        counts.push(count_at_least(l, &store, &snapshot, 100));
    }

    println!("{:<20}{:>9}{:>9}{:>13}", "level", "read #1", "read #2", "rows >= 100");
    for i in 0..4 {
        println!("{:<20}{:>9}{:>9}{:>13}", names[i], first[i], second[i], counts[i]);
    }

    println!();
    println!("{:<20}{:>5}{:>6}{:>6}{:>6}", "anomaly", "RU", "RC", "RR", "SER");
    let dirty: Vec<&str> = first.iter().map(|v| yes_no(*v == 200)).collect();
    let nonrep: Vec<&str> = second.iter().map(|v| yes_no(*v != 100)).collect();
    let phantom: Vec<&str> = counts.iter().map(|c| yes_no(*c != 2)).collect();
    println!("{:<20}{:>5}{:>6}{:>6}{:>6}", "dirty read", dirty[0], dirty[1], dirty[2], dirty[3]);
    println!("{:<20}{:>5}{:>6}{:>6}{:>6}", "non-repeatable read", nonrep[0], nonrep[1], nonrep[2], nonrep[3]);
    println!("{:<20}{:>5}{:>6}{:>6}{:>6}", "phantom read", phantom[0], phantom[1], phantom[2], phantom[3]);
}
`,
  },

  "backend-data-layer-6": {
    instructions: `## Transactions, Rollback & Prepared Statements

A transaction is a write buffer plus an atomicity rule: inside it, reads see your own uncommitted writes; outside, nothing does until \`COMMIT\`. \`ROLLBACK\` therefore undoes nothing — it discards a buffer that was never applied.

A prepared statement is server-side parse and plan state, named and reused. \`EXECUTE\` sends values, not SQL text.

### Your task

1. \`Db\` holds \`rows\`, a \`plans\` vector and an \`executions\` counter. \`prepare(sql)\` returns the existing handle if that exact text was already compiled, otherwise pushes and returns the new index. \`execute(plan)\` only increments \`executions\`.
2. \`Txn\` buffers writes in a \`BTreeMap<u32, i64>\`. \`get\` reads through the buffer then falls back to the store; \`set\` buffers; \`commit\` applies every buffered write to \`db.rows\`; \`rollback\` drops the buffer.
3. \`transfer(db, plan, from, to, amount)\` — debit \`from\`, credit \`to\` (calling \`execute\` for each), then re-read \`from\`. If it went negative, roll back and return \`Err(format!("CHECK balance >= 0 violated: {}", after))\`. Otherwise commit.
4. Open with \`a = 100\`, \`b = 50\`. Transfer \`30\` (commits), then \`prepare\` the same SQL again and transfer \`500\` (violates the check). Print the snapshots and the plan statistics.

Expected output:

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

### Hints

- \`self.plans.iter().position(|p| *p == sql)\` finds an already-compiled plan.
- \`commit(self, db)\` takes \`self\` by value, so the buffer cannot be used afterwards — that is the type system enforcing the lifecycle.
- \`-430\` is \`70 - 500\`: the debit is buffered before the check runs, which is what makes the check meaningful.
`,
    starterCode: `use std::collections::BTreeMap;

struct Db {
    rows: BTreeMap<u32, i64>,
    plans: Vec<&'static str>,
    executions: u32,
}

impl Db {
    fn prepare(&mut self, sql: &'static str) -> usize {
        // Return the existing handle if this text was already compiled.
        0
    }

    fn execute(&mut self, _plan: usize) {
        // One more execution of an already-compiled plan.
    }

    fn total(&self) -> i64 {
        self.rows.values().sum()
    }
}

struct Txn {
    writes: BTreeMap<u32, i64>,
}

impl Txn {
    fn begin() -> Txn {
        Txn { writes: BTreeMap::new() }
    }

    fn get(&self, db: &Db, id: u32) -> i64 {
        // Read through the write buffer, then fall back to the store.
        0
    }

    fn set(&mut self, id: u32, value: i64) {
        // Buffer the write. Nothing reaches the store yet.
    }

    fn commit(self, db: &mut Db) {
        // Apply every buffered write.
    }

    fn rollback(self) {}
}

fn transfer(db: &mut Db, plan: usize, from: u32, to: u32, amount: i64) -> Result<(), String> {
    // Debit, credit, then check the constraint. Commit or roll back.
    Ok(())
}

fn snapshot(label: &str, db: &Db) {
    println!("{:<16}a={:<6}b={:<6}total={}", label, db.rows[&1], db.rows[&2], db.total());
}

fn main() {
    // Two transfers: one that commits, one that violates the constraint.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the transaction is a type, not a convention",
        kind: "impl_defined",
        type: "Txn",
      },
      {
        name: "buffers writes instead of applying them",
        kind: "struct_defined",
        struct: "Txn",
        fields: [{ name: "writes", ty: "BTreeMap<u32, i64>" }],
      },
      {
        name: "discards the buffer when the constraint fails",
        kind: "method_called",
        method: "rollback",
      },
      {
        name: "compiles the statement once and reuses the handle",
        kind: "method_called",
        method: "prepare",
      },
      {
        name: "counts executions separately from compiles",
        kind: "expr_present",
        expr: "self.executions += 1",
      },
    ],
    expectedOutput:
      "opening         a=100   b=50    total=150\nafter commit    a=70    b=80    total=150\nrolled back: CHECK balance >= 0 violated: -430\nafter rollback  a=70    b=80    total=150\nplans compiled: 1  same handle: true  executions: 4\n",
    referenceSolution: `use std::collections::BTreeMap;

struct Db {
    rows: BTreeMap<u32, i64>,
    plans: Vec<&'static str>,
    executions: u32,
}

impl Db {
    fn prepare(&mut self, sql: &'static str) -> usize {
        if let Some(i) = self.plans.iter().position(|p| *p == sql) {
            return i;
        }
        self.plans.push(sql);
        self.plans.len() - 1
    }

    fn execute(&mut self, _plan: usize) {
        self.executions += 1;
    }

    fn total(&self) -> i64 {
        self.rows.values().sum()
    }
}

struct Txn {
    writes: BTreeMap<u32, i64>,
}

impl Txn {
    fn begin() -> Txn {
        Txn { writes: BTreeMap::new() }
    }

    fn get(&self, db: &Db, id: u32) -> i64 {
        match self.writes.get(&id) {
            Some(v) => *v,
            None => *db.rows.get(&id).unwrap(),
        }
    }

    fn set(&mut self, id: u32, value: i64) {
        self.writes.insert(id, value);
    }

    fn commit(self, db: &mut Db) {
        for (id, value) in self.writes {
            db.rows.insert(id, value);
        }
    }

    fn rollback(self) {}
}

fn transfer(db: &mut Db, plan: usize, from: u32, to: u32, amount: i64) -> Result<(), String> {
    let mut txn = Txn::begin();

    let a = txn.get(db, from);
    db.execute(plan);
    txn.set(from, a - amount);

    let b = txn.get(db, to);
    db.execute(plan);
    txn.set(to, b + amount);

    let after = txn.get(db, from);
    if after < 0 {
        txn.rollback();
        return Err(format!("CHECK balance >= 0 violated: {}", after));
    }

    txn.commit(db);
    Ok(())
}

fn snapshot(label: &str, db: &Db) {
    println!("{:<16}a={:<6}b={:<6}total={}", label, db.rows[&1], db.rows[&2], db.total());
}

fn main() {
    let mut db = Db {
        rows: BTreeMap::from([(1u32, 100i64), (2, 50)]),
        plans: Vec::new(),
        executions: 0,
    };

    let sql = "UPDATE accounts SET balance = $1 WHERE id = $2";
    let plan = db.prepare(sql);
    snapshot("opening", &db);

    match transfer(&mut db, plan, 1, 2, 30) {
        Ok(()) => snapshot("after commit", &db),
        Err(e) => println!("rolled back: {}", e),
    }

    let plan_again = db.prepare(sql);
    match transfer(&mut db, plan_again, 1, 2, 500) {
        Ok(()) => snapshot("after commit", &db),
        Err(e) => println!("rolled back: {}", e),
    }
    snapshot("after rollback", &db);

    println!("plans compiled: {}  same handle: {}  executions: {}",
        db.plans.len(), plan == plan_again, db.executions);
}
`,
  },

  "backend-data-layer-7": {
    instructions: `## Connection Pools & Where Latency Goes

A pool is a fixed slot count plus a queue. Client-observed latency is **queue wait + query time**, which is why the database reports a fast query while the client sees a slow request — the two numbers measure different intervals.

Past the database's useful concurrency, extra slots add no throughput; they relocate the queue into the database, where it becomes contention.

### Your task

1. \`service_times() -> Vec<u32>\` — a deterministic LCG. \`seed\` starts at \`1\`; each step \`seed = (seed * 1103515245 + 12345) % 2147483648\`, and the service time is \`5 + (seed >> 16) % 21\`. Produce \`REQUESTS\` of them.
2. \`simulate(capacity, service) -> (u32, u32, usize, u32)\` — request \`i\` arrives at \`i * ARRIVAL_GAP\` and takes the earliest-free slot. Return \`(max wait, mean wait, checkout timeouts, makespan)\`; a wait above \`CHECKOUT_TIMEOUT\` counts as a timeout.
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

### Hints

- Use \`wrapping_mul\` / \`wrapping_add\` on a \`u64\` seed so the multiply cannot overflow under \`-D warnings\`.
- \`free_at\` is \`vec![0u32; capacity]\`; a request starts at \`max(free_at[slot], arrival)\`, and its wait is \`start - arrival\`.
- Mean wait is integer division: \`total_wait / REQUESTS as u32\`.
- Nothing here touches the clock. The simulation must be deterministic.
`,
    starterCode: `const REQUESTS: usize = 16;
const ARRIVAL_GAP: u32 = 3;
const CHECKOUT_TIMEOUT: u32 = 50;

fn service_times() -> Vec<u32> {
    // Deterministic LCG: seed 1, next = seed * 1103515245 + 12345 mod 2^31,
    // service = 5 + (next >> 16) % 21.
    Vec::new()
}

fn simulate(capacity: usize, service: &[u32]) -> (u32, u32, usize, u32) {
    // Each request takes the earliest-free slot. Return
    // (max wait, mean wait, checkout timeouts, makespan).
    (0, 0, 0, 0)
}

fn main() {
    // Print the service times, then one row per pool capacity.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "generates service times deterministically",
        kind: "fn_defined",
        fn: "service_times",
        returns: "Vec<u32>",
      },
      {
        name: "simulates one pool capacity",
        kind: "fn_defined",
        fn: "simulate",
        returns: "(u32, u32, usize, u32)",
      },
      {
        name: "the pool has a fixed number of slots",
        kind: "let_binding",
        var: "free_at",
        mutable: true,
        init: "vec![0u32; capacity]",
      },
      {
        name: "measures queue wait rather than assuming it",
        kind: "expr_present",
        expr: "start - arrival",
      },
      {
        name: "reports exhaustion as a checkout timeout",
        kind: "expr_present",
        expr: "wait > CHECKOUT_TIMEOUT",
      },
      {
        name: "does not touch the wall clock",
        kind: "method_called",
        method: "sleep",
        forbidden: true,
      },
    ],
    expectedOutput:
      "service times (ms): [22, 9, 17, 6, 18, 25, 20, 11, 5, 17, 24, 25, 17, 11, 16, 13]\ntotal db work: 256 ms over 16 requests\n\n capacity  max wait  mean wait  timeouts  makespan\n        1       198         96        11       256\n        2        74         34         4       132\n        4        17          5         0        75\n        8         0          0         0        58\n       16         0          0         0        58\n",
    referenceSolution: `const REQUESTS: usize = 16;
const ARRIVAL_GAP: u32 = 3;
const CHECKOUT_TIMEOUT: u32 = 50;

fn service_times() -> Vec<u32> {
    let mut seed: u64 = 1;
    let mut out = Vec::new();
    for _ in 0..REQUESTS {
        seed = (seed.wrapping_mul(1103515245).wrapping_add(12345)) % 2147483648;
        out.push(5 + ((seed >> 16) % 21) as u32);
    }
    out
}

fn simulate(capacity: usize, service: &[u32]) -> (u32, u32, usize, u32) {
    let mut free_at = vec![0u32; capacity];
    let mut max_wait = 0u32;
    let mut total_wait = 0u32;
    let mut timeouts = 0usize;

    for (i, ms) in service.iter().enumerate() {
        let arrival = i as u32 * ARRIVAL_GAP;
        let mut slot = 0usize;
        for s in 0..capacity {
            if free_at[s] < free_at[slot] {
                slot = s;
            }
        }
        let start = if free_at[slot] > arrival { free_at[slot] } else { arrival };
        let wait = start - arrival;
        if wait > max_wait {
            max_wait = wait;
        }
        total_wait += wait;
        if wait > CHECKOUT_TIMEOUT {
            timeouts += 1;
        }
        free_at[slot] = start + ms;
    }

    let makespan = *free_at.iter().max().unwrap();
    (max_wait, total_wait / REQUESTS as u32, timeouts, makespan)
}

fn main() {
    let service = service_times();
    println!("service times (ms): {:?}", service);
    println!("total db work: {} ms over {} requests", service.iter().sum::<u32>(), REQUESTS);
    println!();
    println!("{:>9}{:>10}{:>11}{:>10}{:>10}", "capacity", "max wait", "mean wait", "timeouts", "makespan");

    for capacity in [1usize, 2, 4, 8, 16] {
        let (max_wait, mean_wait, timeouts, makespan) = simulate(capacity, &service);
        println!("{:>9}{:>10}{:>11}{:>10}{:>10}", capacity, max_wait, mean_wait, timeouts, makespan);
    }
}
`,
  },
};
