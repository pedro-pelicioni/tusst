import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Running It in Production — hidden grading data.

export const backendProductionGraders: Record<string, AdvancedLessonContent> = {
  "backend-production-1": {
    instructions: `## Counters, gauges and histograms

A **counter** is monotonic and meaningless as a value — you read its rate. A **gauge** is a point-in-time level that moves both ways. A **histogram** is cumulative bucket counters plus \`_sum\` and \`_count\`.

Two traps. A gauge is only ever seen at scrape time, so anything that rises and falls between scrapes is invisible. And every distinct label value is a separate time series — labels are for bounded sets, never for a user id.

### Your task

1. Implement \`Histogram\`: \`observe(v)\` adds \`v\` to \`sum\` and bumps the first bucket whose bound is \`>= v\`; \`count()\` totals the observations; \`above(bound)\` reads the tail out of the buckets.
2. Walk the 12 ticks. The counter takes \`ARRIVALS[t]\`; the gauge takes \`ARRIVALS[t] - DEPARTURES[t]\`. Track the true peak every tick and the peak a scrape would see, scraping when \`t % 3 == 2\`.
3. Observe every latency, print the bucket row, then the mean and how many exceeded 100 ms.

Expected output:

\`\`\`text
tick  accepted  active  scrape
   0         4       4  -
   1        10       9  -
   2        12       3  yes
   3        21      11  -
   4        26      14  -
   5        27       4  yes
   6        30       5  -
   7        37      11  -
   8        39       5  yes
   9        43       8  -
  10        46       9  -
  11        47       2  yes

counter accepted_total = 47 (monotonic)
gauge   active = 2, true peak = 14, peak seen by scrapes = 5

le<=10 le<=50 le<=100 le<=500 +Inf
    15      2       0       3    0
mean = 42.2 ms; over 100 ms = 3 of 20
\`\`\`

### Hints

- \`observe\` walks \`BOUNDS\` while \`v > BOUNDS[i]\`, so a value equal to a bound stays in that bucket. The index that falls out of the loop is \`4\` (the \`+Inf\` bucket) for anything above \`500\`.
- \`above(100)\` finds the first bound \`>= 100\` and sums every bucket after it. Do not keep the samples and sort them — the point is that the buckets already know.
- The scrape column prints \`"yes"\` or \`"-"\`; the header is \`tick  accepted  active  scrape\` with widths \`{:>4}  {:>8}  {:>6}\`.
- Call the gauge \`active\`: \`Gauge\` carries both \`value\` and \`peak\`, and the true peak is kept with \`if active.value > active.peak { active.peak = active.value; }\` on every tick — not only on a scrape.
`,
    starterCode: `const ARRIVALS: [i64; 12] = [4, 6, 2, 9, 5, 1, 3, 7, 2, 4, 3, 1];
const DEPARTURES: [i64; 12] = [0, 1, 8, 1, 2, 11, 2, 1, 8, 1, 2, 8];
const LATENCY_MS: [u32; 20] = [
    2, 4, 3, 9, 6, 4, 12, 7, 3, 5, 41, 8, 2, 130, 6, 4, 380, 3, 5, 210,
];
const BOUNDS: [u32; 4] = [10, 50, 100, 500];

struct Counter {
    total: u64,
}

struct Gauge {
    value: i64,
    peak: i64,
}

struct Histogram {
    counts: [u32; 5],
    sum: u64,
}

impl Histogram {
    // observe(v): add v to sum, then bump the first bucket whose bound >= v
    // count(): total observations
    // above(bound): observations strictly above \`bound\`, read from the buckets
}

fn main() {
    // 1. walk the ticks: counter += arrivals, gauge += arrivals - departures
    // 2. track the true peak every tick, and the peak a scrape would see
    // 3. observe every latency, then answer "how many over 100 ms"
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "records every latency into a bucket",
        kind: "method_called",
        method: "observe",
      },
      {
        name: "reads the tail out of the buckets",
        kind: "method_called",
        method: "above",
      },
      {
        name: "the gauge keeps its peak, not only its last value",
        kind: "expr_present",
        expr: "active.value > active.peak",
      },
      {
        name: "samples the gauge on a fixed scrape interval",
        kind: "expr_present",
        expr: "t % 3 == 2",
      },
      {
        name: "answers the tail from buckets, not from a kept list of samples",
        kind: "method_called",
        method: "sort",
        forbidden: true,
      },
    ],
    expectedOutput: "tick  accepted  active  scrape\n   0         4       4  -\n   1        10       9  -\n   2        12       3  yes\n   3        21      11  -\n   4        26      14  -\n   5        27       4  yes\n   6        30       5  -\n   7        37      11  -\n   8        39       5  yes\n   9        43       8  -\n  10        46       9  -\n  11        47       2  yes\n\ncounter accepted_total = 47 (monotonic)\ngauge   active = 2, true peak = 14, peak seen by scrapes = 5\n\nle<=10 le<=50 le<=100 le<=500 +Inf\n    15      2       0       3    0\nmean = 42.2 ms; over 100 ms = 3 of 20\n",
    referenceSolution: `// Three instruments over one workload.
const ARRIVALS: [i64; 12] = [4, 6, 2, 9, 5, 1, 3, 7, 2, 4, 3, 1];
const DEPARTURES: [i64; 12] = [0, 1, 8, 1, 2, 11, 2, 1, 8, 1, 2, 8];
const LATENCY_MS: [u32; 20] = [
    2, 4, 3, 9, 6, 4, 12, 7, 3, 5, 41, 8, 2, 130, 6, 4, 380, 3, 5, 210,
];
const BOUNDS: [u32; 4] = [10, 50, 100, 500];

struct Counter {
    total: u64,
}

struct Gauge {
    value: i64,
    peak: i64,
}

struct Histogram {
    counts: [u32; 5],
    sum: u64,
}

impl Histogram {
    fn observe(&mut self, v: u32) {
        self.sum += v as u64;
        let mut i = 0;
        while i < BOUNDS.len() && v > BOUNDS[i] {
            i += 1;
        }
        self.counts[i] += 1;
    }
    fn count(&self) -> u32 {
        self.counts.iter().sum()
    }
    fn above(&self, bound: u32) -> u32 {
        let mut n = 0;
        for i in 0..BOUNDS.len() {
            if BOUNDS[i] >= bound {
                for j in (i + 1)..self.counts.len() {
                    n += self.counts[j];
                }
                break;
            }
        }
        n
    }
}

fn main() {
    let mut accepted = Counter { total: 0 };
    let mut active = Gauge { value: 0, peak: 0 };
    let mut scraped_peak: i64 = 0;

    println!("tick  accepted  active  scrape");
    for t in 0..ARRIVALS.len() {
        accepted.total += ARRIVALS[t] as u64;
        active.value += ARRIVALS[t] - DEPARTURES[t];
        if active.value > active.peak {
            active.peak = active.value;
        }
        let scrape = t % 3 == 2;
        if scrape && active.value > scraped_peak {
            scraped_peak = active.value;
        }
        println!(
            "{:>4}  {:>8}  {:>6}  {}",
            t,
            accepted.total,
            active.value,
            if scrape { "yes" } else { "-" }
        );
    }

    println!();
    println!("counter accepted_total = {} (monotonic)", accepted.total);
    println!(
        "gauge   active = {}, true peak = {}, peak seen by scrapes = {}",
        active.value, active.peak, scraped_peak
    );

    let mut h = Histogram {
        counts: [0; 5],
        sum: 0,
    };
    for ms in LATENCY_MS {
        h.observe(ms);
    }
    println!();
    println!("le<=10 le<=50 le<=100 le<=500 +Inf");
    println!(
        "{:>6} {:>6} {:>7} {:>7} {:>4}",
        h.counts[0], h.counts[1], h.counts[2], h.counts[3], h.counts[4]
    );
    println!(
        "mean = {:.1} ms; over 100 ms = {} of {}",
        h.sum as f64 / h.count() as f64,
        h.above(100),
        h.count()
    );
}
`,
  },

  "backend-production-2": {
    instructions: `## Percentiles from buckets

The mean is exact: \`_sum / _count\`. A quantile is not — you compute a rank, walk the cumulative bucket counts until you cross it, and report that bucket's **upper bound**. Your boundaries are the resolution of your answer.

Percentiles are not linear, so per-instance p99s cannot be averaged or maxed. **Bucket counts can be added**, which is why the fleet query sums buckets before computing the quantile.

### Your task

1. Implement \`count()\`, \`mean()\` and \`quantile(q)\` — rank \`ceil(q · n)\`, walk the cumulative counts, return the crossing bucket's upper bound (\`f64::INFINITY\` for \`+Inf\`).
2. Build \`api-1\` and \`api-2\` from the counts in the starter comments, then \`merged\` by adding the buckets and adding the sums.
3. Print the bucket table, then a row of count/sum/mean/p50/p95/p99 per histogram.
4. Print the mean of the two p95s against the true merged p95, and the same for p99.

Expected output:

\`\`\`text
le       api-1  api-2  merged
1         120      0     120
2         300      0     300
5         380      2     382
10        150      3     153
25         40     10      50
100         5     20      25
500         4     40      44
2000        1     25      26
+Inf        0      0       0

          count       sum    mean     p50     p95     p99
api-1      1000      4200     4.2       5      10      25
api-2       100     42000   420.0     500    2000    2000
merged     1100     46200    42.0       5     500    2000

mean of the p95s: 1005.0   true merged p95: 500
mean of the p99s: 1012.5   true merged p99: 2000
\`\`\`

### Hints

- A \`row(h: &Hist)\` helper keeps the three rows identical: \`"{:<8} {:>6} {:>9.0} {:>7.1} {:>7.0} {:>7.0} {:>7.0}"\`.
- The bucket table's label is \`"+Inf"\` when \`i == BOUNDS.len()\`, otherwise \`BOUNDS[i].to_string()\`.
- The header row is printed with the same format string as the data rows, with \`""\` in the name column.
- Inside \`quantile\`, walk with a local \`cum\`: \`cum += self.counts[i]\`, and return as soon as \`cum >= rank\`.
`,
    starterCode: `const BOUNDS: [u32; 8] = [1, 2, 5, 10, 25, 100, 500, 2000];

struct Hist {
    name: &'static str,
    counts: [u64; 9],
    sum: f64,
}

impl Hist {
    // count(): sum of the buckets
    // mean(): sum / count -- the exact mean, from _sum and _count
    // quantile(q): rank = ceil(q * n), then walk cumulative counts and
    //              return the upper bound of the bucket that crosses it
}

fn main() {
    // api-1: counts [120, 300, 380, 150, 40, 5, 4, 1, 0], sum 4200.0
    // api-2: counts [0, 0, 2, 3, 10, 20, 40, 25, 0],       sum 42000.0
    // merged: add the buckets, add the sums
    //
    // print the bucket table, then count/sum/mean/p50/p95/p99 per instance,
    // then the mean of the two p95s against the true merged p95, same for p99
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "gives the histogram its own methods",
        kind: "impl_defined",
        type: "Hist",
      },
      {
        name: "turns a quantile into a rank",
        kind: "expr_present",
        expr: "(q * n as f64).ceil() as u64",
      },
      {
        name: "walks cumulative bucket counts",
        kind: "expr_present",
        expr: "cum += self.counts[i]",
      },
      {
        name: "merges instances by adding bucket counts",
        kind: "expr_present",
        expr: "a.counts[i] + b.counts[i]",
      },
      {
        name: "reports the true merged p99",
        kind: "expr_present",
        expr: "merged.quantile(0.99)",
      },
      {
        name: "takes the mean from _sum and _count",
        kind: "method_called",
        method: "mean",
      },
    ],
    expectedOutput: "le       api-1  api-2  merged\n1         120      0     120\n2         300      0     300\n5         380      2     382\n10        150      3     153\n25         40     10      50\n100         5     20      25\n500         4     40      44\n2000        1     25      26\n+Inf        0      0       0\n\n          count       sum    mean     p50     p95     p99\napi-1      1000      4200     4.2       5      10      25\napi-2       100     42000   420.0     500    2000    2000\nmerged     1100     46200    42.0       5     500    2000\n\nmean of the p95s: 1005.0   true merged p95: 500\nmean of the p99s: 1012.5   true merged p99: 2000\n",
    referenceSolution: `const BOUNDS: [u32; 8] = [1, 2, 5, 10, 25, 100, 500, 2000];

struct Hist {
    name: &'static str,
    counts: [u64; 9],
    sum: f64,
}

impl Hist {
    fn count(&self) -> u64 {
        self.counts.iter().sum()
    }
    fn mean(&self) -> f64 {
        self.sum / self.count() as f64
    }
    fn quantile(&self, q: f64) -> f64 {
        let n = self.count();
        let rank = (q * n as f64).ceil() as u64;
        let mut cum = 0u64;
        for i in 0..self.counts.len() {
            cum += self.counts[i];
            if cum >= rank {
                if i == BOUNDS.len() {
                    return f64::INFINITY;
                }
                return BOUNDS[i] as f64;
            }
        }
        f64::INFINITY
    }
}

fn row(h: &Hist) {
    println!(
        "{:<8} {:>6} {:>9.0} {:>7.1} {:>7.0} {:>7.0} {:>7.0}",
        h.name,
        h.count(),
        h.sum,
        h.mean(),
        h.quantile(0.50),
        h.quantile(0.95),
        h.quantile(0.99)
    );
}

fn main() {
    let a = Hist {
        name: "api-1",
        counts: [120, 300, 380, 150, 40, 5, 4, 1, 0],
        sum: 4200.0,
    };
    let b = Hist {
        name: "api-2",
        counts: [0, 0, 2, 3, 10, 20, 40, 25, 0],
        sum: 42000.0,
    };

    let mut merged = Hist {
        name: "merged",
        counts: [0; 9],
        sum: a.sum + b.sum,
    };
    for i in 0..9 {
        merged.counts[i] = a.counts[i] + b.counts[i];
    }

    println!("le       api-1  api-2  merged");
    for i in 0..9 {
        let label = if i == BOUNDS.len() {
            "+Inf".to_string()
        } else {
            BOUNDS[i].to_string()
        };
        println!(
            "{:<6} {:>6} {:>6} {:>7}",
            label, a.counts[i], b.counts[i], merged.counts[i]
        );
    }

    println!();
    println!("{:<8} {:>6} {:>9} {:>7} {:>7} {:>7} {:>7}", "", "count", "sum", "mean", "p50", "p95", "p99");
    row(&a);
    row(&b);
    row(&merged);

    println!();
    println!(
        "mean of the p95s: {:.1}   true merged p95: {:.0}",
        (a.quantile(0.95) + b.quantile(0.95)) / 2.0,
        merged.quantile(0.95)
    );
    println!(
        "mean of the p99s: {:.1}   true merged p99: {:.0}",
        (a.quantile(0.99) + b.quantile(0.99)) / 2.0,
        merged.quantile(0.99)
    );
}
`,
  },

  "backend-production-3": {
    instructions: `## Structured logs and a correlation ID

\`level=error event=user_load_failed user_id=91 org_id=4 err=timeout\` is a record with queryable dimensions. A formatted sentence is one opaque string you can only regex.

A production log is many requests interleaved, so a request ID carried through every layer is what turns the stream back into one story. Add \`depth\` and you get the span tree — and root minus children is the handler's own time.

### Your task

1. \`fn emit(...) -> String\` builds one line: \`seq\` zero-padded to two digits, then \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — plus \`dur_ms\` **only on an end**, and \`level=warn\` when an end exceeds 40 ms.
2. Emit all 12 events in order, seq starting at 1.
3. Filter to \`req=7f3a\`. For each start, find its matching end, and print the span indented by \`depth * 2\` with its duration.
4. Print root, children and unaccounted, then how many of the 12 lines matched.

Expected output:

\`\`\`text
--- log stream (two requests interleaved) ---
seq=01 level=info req=7f3a span=http.request depth=0 event=start
seq=02 level=info req=7f3a span=auth.verify depth=1 event=start
seq=03 level=info req=b91c span=http.request depth=0 event=start
seq=04 level=info req=7f3a span=auth.verify depth=1 event=end dur_ms=3
seq=05 level=info req=b91c span=auth.verify depth=1 event=start
seq=06 level=info req=7f3a span=db.query depth=1 event=start
seq=07 level=info req=b91c span=auth.verify depth=1 event=end dur_ms=2
seq=08 level=info req=b91c span=db.query depth=1 event=start
seq=09 level=warn req=7f3a span=db.query depth=1 event=end dur_ms=41
seq=10 level=warn req=7f3a span=http.request depth=0 event=end dur_ms=46
seq=11 level=info req=b91c span=db.query depth=1 event=end dur_ms=7
seq=12 level=info req=b91c span=http.request depth=0 event=end dur_ms=11

--- filtered req=7f3a ---
http.request      46ms
  auth.verify      3ms
  db.query        41ms
root 46ms, children 44ms, unaccounted 2ms
lines matching req=7f3a: 6 of 12
\`\`\`

### Hints

- \`"seq={:02} level={} req={} span={} depth={} event={}"\`, then \`push_str\` the \`" dur_ms={}"\` suffix on an end.
- The tree row uses runtime widths: \`"{:indent$}{:<w$}{:>4}ms"\` with \`indent = depth * 2\` and \`w = 16 - depth * 2\`.
- Children are the \`end\` events at \`depth == 1\`; the root is \`depth == 0\`. Do not sum both.
- Bind the root's duration as \`total\` and the children's sum as \`child\`; the handler's own work is \`total - child\`.
`,
    starterCode: `// (req, span, depth, event, dur_ms)
const EVENTS: [(&str, &str, usize, &str, u32); 12] = [
    ("7f3a", "http.request", 0, "start", 0),
    ("7f3a", "auth.verify", 1, "start", 0),
    ("b91c", "http.request", 0, "start", 0),
    ("7f3a", "auth.verify", 1, "end", 3),
    ("b91c", "auth.verify", 1, "start", 0),
    ("7f3a", "db.query", 1, "start", 0),
    ("b91c", "auth.verify", 1, "end", 2),
    ("b91c", "db.query", 1, "start", 0),
    ("7f3a", "db.query", 1, "end", 41),
    ("7f3a", "http.request", 0, "end", 46),
    ("b91c", "db.query", 1, "end", 7),
    ("b91c", "http.request", 0, "end", 11),
];

fn main() {
    // 1. emit one structured line per event, seq starting at 1;
    //    level=warn on an end over 40 ms, and dur_ms only on end
    // 2. filter to req=7f3a, print each span indented by depth with its duration
    // 3. root vs children vs unaccounted, then how many lines matched
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "builds one structured line per event",
        kind: "fn_defined",
        fn: "emit",
        returns: "String",
      },
      {
        name: "filters the stream by correlation ID",
        kind: "expr_present",
        expr: "e.0 == \"7f3a\"",
      },
      {
        name: "pairs each start with its matching end",
        kind: "method_called",
        method: "find",
      },
      {
        name: "separates the handler's own time from its children's",
        kind: "expr_present",
        expr: "total - child",
      },
      {
        name: "orders the log by a logical sequence, not the wall clock",
        kind: "expr_present",
        expr: "Instant::now()",
        forbidden: true,
      },
    ],
    expectedOutput: "--- log stream (two requests interleaved) ---\nseq=01 level=info req=7f3a span=http.request depth=0 event=start\nseq=02 level=info req=7f3a span=auth.verify depth=1 event=start\nseq=03 level=info req=b91c span=http.request depth=0 event=start\nseq=04 level=info req=7f3a span=auth.verify depth=1 event=end dur_ms=3\nseq=05 level=info req=b91c span=auth.verify depth=1 event=start\nseq=06 level=info req=7f3a span=db.query depth=1 event=start\nseq=07 level=info req=b91c span=auth.verify depth=1 event=end dur_ms=2\nseq=08 level=info req=b91c span=db.query depth=1 event=start\nseq=09 level=warn req=7f3a span=db.query depth=1 event=end dur_ms=41\nseq=10 level=warn req=7f3a span=http.request depth=0 event=end dur_ms=46\nseq=11 level=info req=b91c span=db.query depth=1 event=end dur_ms=7\nseq=12 level=info req=b91c span=http.request depth=0 event=end dur_ms=11\n\n--- filtered req=7f3a ---\nhttp.request      46ms\n  auth.verify      3ms\n  db.query        41ms\nroot 46ms, children 44ms, unaccounted 2ms\nlines matching req=7f3a: 6 of 12\n",
    referenceSolution: `// (req, span, depth, event, dur_ms)
const EVENTS: [(&str, &str, usize, &str, u32); 12] = [
    ("7f3a", "http.request", 0, "start", 0),
    ("7f3a", "auth.verify", 1, "start", 0),
    ("b91c", "http.request", 0, "start", 0),
    ("7f3a", "auth.verify", 1, "end", 3),
    ("b91c", "auth.verify", 1, "start", 0),
    ("7f3a", "db.query", 1, "start", 0),
    ("b91c", "auth.verify", 1, "end", 2),
    ("b91c", "db.query", 1, "start", 0),
    ("7f3a", "db.query", 1, "end", 41),
    ("7f3a", "http.request", 0, "end", 46),
    ("b91c", "db.query", 1, "end", 7),
    ("b91c", "http.request", 0, "end", 11),
];

fn emit(seq: u32, req: &str, span: &str, depth: usize, event: &str, dur_ms: u32) -> String {
    let level = if event == "end" && dur_ms > 40 { "warn" } else { "info" };
    let mut line = format!(
        "seq={:02} level={} req={} span={} depth={} event={}",
        seq, level, req, span, depth, event
    );
    if event == "end" {
        line.push_str(&format!(" dur_ms={}", dur_ms));
    }
    line
}

fn main() {
    let mut log: Vec<(String, &str)> = Vec::new();
    for (i, ev) in EVENTS.iter().enumerate() {
        log.push((emit(i as u32 + 1, ev.0, ev.1, ev.2, ev.3, ev.4), ev.0));
    }

    println!("--- log stream (two requests interleaved) ---");
    for (line, _) in &log {
        println!("{}", line);
    }

    println!();
    println!("--- filtered req=7f3a ---");
    let mut total = 0u32;
    for ev in EVENTS.iter().filter(|e| e.0 == "7f3a" && e.3 == "start") {
        let dur = EVENTS
            .iter()
            .find(|e| e.0 == ev.0 && e.1 == ev.1 && e.3 == "end")
            .map(|e| e.4)
            .unwrap_or(0);
        println!(
            "{:indent$}{:<w$}{:>4}ms",
            "",
            ev.1,
            dur,
            indent = ev.2 * 2,
            w = 16 - ev.2 * 2
        );
        if ev.2 == 0 {
            total = dur;
        }
    }

    let child: u32 = EVENTS
        .iter()
        .filter(|e| e.0 == "7f3a" && e.3 == "end" && e.2 == 1)
        .map(|e| e.4)
        .sum();
    println!("root {}ms, children {}ms, unaccounted {}ms", total, child, total - child);

    let matched = log.iter().filter(|(_, r)| *r == "7f3a").count();
    println!("lines matching req=7f3a: {} of {}", matched, log.len());
}
`,
  },

  "backend-production-4": {
    instructions: `## Backoff, jitter and a retry budget

Exponential backoff spreads retries out but **synchronises** them: clients that failed together retry together. Full jitter — a delay drawn uniformly from \`[0, backoff]\` — is what decorrelates them, and a cap stops a client holding a connection slot for 17 minutes.

Retries multiply load exactly when capacity is lowest. A retry budget bounds the amplification as a fraction of request volume, at the client, whatever the failure rate.

### Your task

1. Implement the LCG: \`next()\` multiplies by \`6364136223846793005\` and adds \`1442695040888963407\` (wrapping), returning \`state >> 33\`; \`below(n)\` is \`next() % n\`, and \`0\` when \`n\` is \`0\`.
2. Seed with \`0x2545F491\` and print, for attempts \`0..5\`, the capped backoff (\`BASE_MS << attempt\`, capped at \`CAP_MS\`) beside a full-jitter draw.
3. Count total attempts with no budget: every failing call takes \`MAX_RETRIES\`.
4. Count them again with a budget: earn \`BUDGET_PER_CALL\` per call, pay \`RETRY_COST\` per retry, deny when you cannot pay. Print attempts, amplification and the granted/denied split for both.

Expected output:

\`\`\`text
attempt  backoff_ms  full_jitter_ms
      0         100              45
      1         200               1
      2         400             169
      3         800             501
      4        1000             517

40 calls, 25 of them failing, max 3 retries each
policy       attempts  amplification  granted  denied
no budget         115           2.88x       75       0
10% budget         43           1.07x        3      72
\`\`\`

### Hints

- Draw the jitter with \`rng.below(b + 1)\` so the whole closed interval is reachable — that is why attempt 1 shows 1 ms.
- \`BASE_MS.saturating_mul(1u64 << attempt)\`, then clamp to \`CAP_MS\`.
- Compute the delay; never sleep it. The lesson is deterministic on purpose.
- The two policy rows share \`"{:<12} {:>8}  {:>13.2}x {:>8}  {:>6}"\`; the no-budget row's granted count is \`naive - CALLS\`.
- Hold the budget balance in a local \`tokens\`: \`tokens += BUDGET_PER_CALL\` per call, and \`tokens -= RETRY_COST\` for each retry you grant.
`,
    starterCode: `const BASE_MS: u64 = 100;
const CAP_MS: u64 = 1000;
const MAX_RETRIES: u32 = 3;
const CALLS: u32 = 40;
const BUDGET_PER_CALL: u32 = 10; // centi-tokens: 10 = a 10% retry budget
const RETRY_COST: u32 = 100;

struct Lcg {
    state: u64,
}

impl Lcg {
    // next(): state = state * 6364136223846793005 + 1442695040888963407
    //         (wrapping), then return state >> 33
    // below(n): next() % n, and 0 when n is 0
}

fn failing(i: u32) -> bool {
    i % 8 < 5
}

fn main() {
    // 1. seed the LCG with 0x2545F491 and print backoff vs full jitter for
    //    attempts 0..5 -- BASE_MS << attempt, capped at CAP_MS
    // 2. count attempts with no budget: every failing call retries MAX_RETRIES
    // 3. count attempts with a budget: earn BUDGET_PER_CALL per call,
    //    pay RETRY_COST per retry, deny the retry when you cannot pay
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the LCG advances with wrapping arithmetic",
        kind: "method_called",
        method: "wrapping_mul",
      },
      {
        name: "backoff doubles per attempt",
        kind: "expr_present",
        expr: "1u64 << attempt",
      },
      {
        name: "the backoff is capped",
        kind: "expr_present",
        expr: "raw > CAP_MS",
      },
      {
        name: "the delay is jittered, not the raw backoff",
        kind: "method_called",
        method: "below",
        receiver: "rng",
      },
      {
        name: "every retry is paid for out of the budget",
        kind: "expr_present",
        expr: "tokens -= RETRY_COST",
      },
      {
        name: "computes the delay rather than sleeping it",
        kind: "expr_present",
        expr: "thread::sleep",
        forbidden: true,
      },
    ],
    expectedOutput: "attempt  backoff_ms  full_jitter_ms\n      0         100              45\n      1         200               1\n      2         400             169\n      3         800             501\n      4        1000             517\n\n40 calls, 25 of them failing, max 3 retries each\npolicy       attempts  amplification  granted  denied\nno budget         115           2.88x       75       0\n10% budget         43           1.07x        3      72\n",
    referenceSolution: `const BASE_MS: u64 = 100;
const CAP_MS: u64 = 1000;
const MAX_RETRIES: u32 = 3;
const CALLS: u32 = 40;
const BUDGET_PER_CALL: u32 = 10; // centi-tokens: 10 = 10% retry budget
const RETRY_COST: u32 = 100;

struct Lcg {
    state: u64,
}

impl Lcg {
    fn next(&mut self) -> u64 {
        self.state = self
            .state
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        self.state >> 33
    }
    fn below(&mut self, n: u64) -> u64 {
        if n == 0 {
            0
        } else {
            self.next() % n
        }
    }
}

fn backoff(attempt: u32) -> u64 {
    let raw = BASE_MS.saturating_mul(1u64 << attempt);
    if raw > CAP_MS {
        CAP_MS
    } else {
        raw
    }
}

fn failing(i: u32) -> bool {
    i % 8 < 5
}

fn main() {
    let mut rng = Lcg { state: 0x2545F491 };

    println!("attempt  backoff_ms  full_jitter_ms");
    for attempt in 0..5 {
        let b = backoff(attempt);
        println!("{:>7}  {:>10}  {:>14}", attempt, b, rng.below(b + 1));
    }

    let mut naive = 0u32;
    for i in 0..CALLS {
        naive += 1;
        if failing(i) {
            naive += MAX_RETRIES;
        }
    }

    let mut tokens = 0u32;
    let mut budgeted = 0u32;
    let mut granted = 0u32;
    let mut denied = 0u32;
    for i in 0..CALLS {
        tokens += BUDGET_PER_CALL;
        budgeted += 1;
        if failing(i) {
            for _ in 0..MAX_RETRIES {
                if tokens >= RETRY_COST {
                    tokens -= RETRY_COST;
                    granted += 1;
                    budgeted += 1;
                } else {
                    denied += 1;
                }
            }
        }
    }

    let fails = (0..CALLS).filter(|i| failing(*i)).count();
    println!();
    println!("{} calls, {} of them failing, max {} retries each", CALLS, fails, MAX_RETRIES);
    println!("policy       attempts  amplification  granted  denied");
    println!(
        "{:<12} {:>8}  {:>13.2}x {:>8}  {:>6}",
        "no budget", naive, naive as f64 / CALLS as f64, naive - CALLS, 0
    );
    println!(
        "{:<12} {:>8}  {:>13.2}x {:>8}  {:>6}",
        "10% budget", budgeted, budgeted as f64 / CALLS as f64, granted, denied
    );
}
`,
  },

  "backend-production-5": {
    instructions: `## A circuit breaker as a state machine

**Closed** passes calls; a run of failures trips it. **Open** makes no call at all — the caller fails in microseconds instead of on a 30-second timeout. After a cooldown, **half-open** admits exactly one probe: success closes and clears the run, failure re-opens and restarts the cooldown.

The breaker protects the caller's threads and connection slots at least as much as it protects the dependency.

### Your task

Print \`t\`, the state on entry, the action, the result and the next state, for all 22 ticks.

- **closed** — call. \`THRESHOLD\` consecutive failures trips it to open, recording \`opened_at\`.
- **open** — short-circuit. \`COOLDOWN\` ticks after \`opened_at\`, move to half-open.
- **half-open** — one probe. Success closes and clears the run; failure re-opens and restarts the cooldown.

Finish with the number of downstream calls made and the number of ticks short-circuited.

Expected output:

\`\`\`text
t   state      action         result    next
0   closed     call           ok        closed
1   closed     call           ok        closed
2   closed     call           ok        closed
3   closed     call           fail 1/3  closed
4   closed     call           fail 2/3  closed
5   closed     call           fail 3/3  open
6   open       short-circuit  -         open
7   open       short-circuit  -         open
8   open       short-circuit  -         open
9   half-open  probe          fail      open
10  open       short-circuit  -         open
11  open       short-circuit  -         open
12  open       short-circuit  -         open
13  half-open  probe          fail      open
14  open       short-circuit  -         open
15  open       short-circuit  -         open
16  open       short-circuit  -         open
17  half-open  probe          ok        closed
18  closed     call           ok        closed
19  closed     call           ok        closed
20  closed     call           ok        closed
21  closed     call           ok        closed

downstream calls: 13, short-circuited: 9 of 22 ticks
\`\`\`

### Hints

- Apply the cooldown transition at the *top* of the tick, then snapshot \`before = state\` — the row prints the state on entry and the state on exit.
- The result column is \`"fail {}/{}"\` for a closed-state failure but a bare \`"fail"\` for a failed probe, so branch on \`before == State::HalfOpen\`.
- \`t.saturating_sub(opened_at) >= COOLDOWN\` keeps t=0 safe.
- Row format: \`"{:<3} {:<10} {:<14} {:<9} {}"\`.
- The failure run is a local \`consecutive\`: a failure increments it and trips at \`consecutive >= THRESHOLD\`; any success sets \`consecutive = 0\`.
`,
    starterCode: `const THRESHOLD: u32 = 3;
const COOLDOWN: u32 = 4;
// true = the dependency would answer successfully at this tick
const HEALTHY: [bool; 22] = [
    true, true, true, false, false, false, false, false, false, false, false, false, false, false,
    true, true, true, true, true, true, true, true,
];

#[derive(Clone, Copy, PartialEq)]
enum State {
    Closed,
    Open,
    HalfOpen,
}

fn main() {
    // Walk every tick and print t, state on entry, action, result, next state.
    //
    // closed:    call. THRESHOLD consecutive failures -> open (record opened_at)
    // open:      short-circuit, no call at all. COOLDOWN ticks later -> half-open
    // half-open: one probe. ok -> closed and reset the run; fail -> open again
    //
    // Finish with downstream calls made and ticks short-circuited.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "models half-open as a state of its own",
        kind: "match_arm",
        pat: "State::HalfOpen",
      },
      {
        name: "trips on a run of failures, not a lifetime total",
        kind: "expr_present",
        expr: "consecutive >= THRESHOLD",
      },
      {
        name: "a success clears the failure run",
        kind: "expr_present",
        expr: "consecutive = 0",
      },
      {
        name: "leaves the open state only after the cooldown",
        kind: "expr_present",
        expr: "t.saturating_sub(opened_at) >= COOLDOWN",
      },
      {
        name: "half-open admits a single probe",
        kind: "expr_present",
        expr: "before == State::HalfOpen",
      },
      {
        name: "advances on logical ticks rather than sleeping",
        kind: "expr_present",
        expr: "thread::sleep",
        forbidden: true,
      },
    ],
    expectedOutput: "t   state      action         result    next\n0   closed     call           ok        closed\n1   closed     call           ok        closed\n2   closed     call           ok        closed\n3   closed     call           fail 1/3  closed\n4   closed     call           fail 2/3  closed\n5   closed     call           fail 3/3  open\n6   open       short-circuit  -         open\n7   open       short-circuit  -         open\n8   open       short-circuit  -         open\n9   half-open  probe          fail      open\n10  open       short-circuit  -         open\n11  open       short-circuit  -         open\n12  open       short-circuit  -         open\n13  half-open  probe          fail      open\n14  open       short-circuit  -         open\n15  open       short-circuit  -         open\n16  open       short-circuit  -         open\n17  half-open  probe          ok        closed\n18  closed     call           ok        closed\n19  closed     call           ok        closed\n20  closed     call           ok        closed\n21  closed     call           ok        closed\n\ndownstream calls: 13, short-circuited: 9 of 22 ticks\n",
    referenceSolution: `const THRESHOLD: u32 = 3;
const COOLDOWN: u32 = 4;
// true = the dependency would answer successfully at this tick
const HEALTHY: [bool; 22] = [
    true, true, true, false, false, false, false, false, false, false, false, false, false, false,
    true, true, true, true, true, true, true, true,
];

#[derive(Clone, Copy, PartialEq)]
enum State {
    Closed,
    Open,
    HalfOpen,
}

impl State {
    fn label(self) -> &'static str {
        match self {
            State::Closed => "closed",
            State::Open => "open",
            State::HalfOpen => "half-open",
        }
    }
}

fn main() {
    let mut state = State::Closed;
    let mut consecutive = 0u32;
    let mut opened_at = 0u32;
    let mut calls = 0u32;
    let mut shed = 0u32;

    println!("t   state      action         result    next");
    for t in 0..HEALTHY.len() as u32 {
        if state == State::Open && t.saturating_sub(opened_at) >= COOLDOWN {
            state = State::HalfOpen;
        }
        let before = state;

        let (action, result) = match state {
            State::Open => {
                shed += 1;
                ("short-circuit", "-".to_string())
            }
            State::Closed | State::HalfOpen => {
                calls += 1;
                let ok = HEALTHY[t as usize];
                if ok {
                    consecutive = 0;
                    state = State::Closed;
                } else if state == State::HalfOpen {
                    state = State::Open;
                    opened_at = t;
                } else {
                    consecutive += 1;
                    if consecutive >= THRESHOLD {
                        state = State::Open;
                        opened_at = t;
                    }
                }
                let detail = if ok {
                    "ok".to_string()
                } else if before == State::HalfOpen {
                    "fail".to_string()
                } else {
                    format!("fail {}/{}", consecutive, THRESHOLD)
                };
                (
                    if before == State::HalfOpen { "probe" } else { "call" },
                    detail,
                )
            }
        };

        println!(
            "{:<3} {:<10} {:<14} {:<9} {}",
            t,
            before.label(),
            action,
            result,
            state.label()
        );
    }

    println!();
    println!(
        "downstream calls: {}, short-circuited: {} of {} ticks",
        calls,
        shed,
        HEALTHY.len()
    );
}
`,
  },

  "backend-production-6": {
    instructions: `## Graceful shutdown

Four phases, in order: stop accepting (readiness fails first, then the listener closes), drain what is in flight, bound the drain with a deadline, force-close the rest.

Exiting immediately on SIGTERM kills every in-flight request. Draining kills only the ones still running at the deadline — and the deadline must sit under the orchestrator's grace period, or SIGKILL arrives first and there was no drain at all.

### Your task

Each tick: admit the tick's arrivals only while accepting (otherwise count a 503), decrement every in-flight request, retire the ones that reach 0, and print the row.

- At \`SIGTERM_AT\`: stop accepting, flip readiness to \`503\`, and record how many were in flight.
- Stop when \`in_flight\` is empty (clean drain), or when \`DEADLINE\` ticks have passed since SIGTERM — then force-close what is left, printing the ids with \`{:?}\`.
- Finish with completed, rejected and force-closed, then what an immediate exit would have killed instead.

Expected output:

\`\`\`text
t   accepting  ready  arrived  admitted  in_flight  done
0   yes        200    2        2         2          0
1   yes        200    1        1         1          2
2   yes        200    3        3         3          3
3   yes        200    1        1         3          4
4   yes        200    2        2         5          4
5   no         503    2        0         4          5
6   no         503    0        0         2          7
7   no         503    0        0         2          7
8   no         503    0        0         1          8
9   no         503    0        0         1          8
10  no         503    0        0         1          8
11  no         503    0        0         1          8
12  no         503    0        0         1          8
13  no         503    0        0         1          8
deadline hit at t=13 -- force-closing [8]

completed 8, rejected 2 (503 after SIGTERM), force-closed 1
immediate exit at t=5 would have killed 5 in-flight instead
\`\`\`

### Hints

- Loop \`for t in 0..20u32\` and \`break\` out; the run ends at t=13.
- Decrement first, then \`in_flight.retain(|r| r.left > 0)\`; \`completed\` is the drop in length.
- Arrivals past \`ARRIVALS.len()\` are \`0\`, so t=5's two arrivals are the only rejections.
- Row format: \`"{:<3} {:<10} {:<6} {:<8} {:<9} {:<10} {}"\`.
- Record the signal's tick as \`sigterm_tick\`; the drain ends when \`t - sigterm_tick >= DEADLINE\`.
`,
    starterCode: `const SIGTERM_AT: u32 = 5;
const DEADLINE: u32 = 8; // ticks allowed for draining after SIGTERM
const ARRIVALS: [u32; 6] = [2, 1, 3, 1, 2, 2];
// service time in ticks for request n, in arrival order
const SERVICE: [u32; 9] = [2, 3, 1, 4, 5, 2, 6, 3, 20];

struct Req {
    id: u32,
    left: u32,
}

fn main() {
    // Each tick: admit arrivals only while accepting (else 503), decrement
    // every in-flight request, retire the ones that reached 0, print the row.
    //
    // At SIGTERM_AT: stop accepting, remember how many were in flight.
    // Stop when in_flight is empty (clean drain) or DEADLINE ticks have
    // passed since SIGTERM (force-close whatever is left, by id).
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "stops accepting before it starts draining",
        kind: "expr_present",
        expr: "accepting = false",
      },
      {
        name: "readiness flips to 503 so the balancer stops routing here",
        kind: "expr_present",
        expr: "if accepting { \"200\" } else { \"503\" }",
      },
      {
        name: "in-flight work keeps progressing after SIGTERM",
        kind: "expr_present",
        expr: "r.left -= 1",
      },
      {
        name: "retires requests that finished",
        kind: "method_called",
        method: "retain",
      },
      {
        name: "the drain is bounded by a deadline",
        kind: "expr_present",
        expr: "t - sigterm_tick >= DEADLINE",
      },
      {
        name: "does not exit the moment the signal arrives",
        kind: "expr_present",
        expr: "process::exit",
        forbidden: true,
      },
    ],
    expectedOutput: "t   accepting  ready  arrived  admitted  in_flight  done\n0   yes        200    2        2         2          0\n1   yes        200    1        1         1          2\n2   yes        200    3        3         3          3\n3   yes        200    1        1         3          4\n4   yes        200    2        2         5          4\n5   no         503    2        0         4          5\n6   no         503    0        0         2          7\n7   no         503    0        0         2          7\n8   no         503    0        0         1          8\n9   no         503    0        0         1          8\n10  no         503    0        0         1          8\n11  no         503    0        0         1          8\n12  no         503    0        0         1          8\n13  no         503    0        0         1          8\ndeadline hit at t=13 -- force-closing [8]\n\ncompleted 8, rejected 2 (503 after SIGTERM), force-closed 1\nimmediate exit at t=5 would have killed 5 in-flight instead\n",
    referenceSolution: `const SIGTERM_AT: u32 = 5;
const DEADLINE: u32 = 8; // ticks allowed for draining after SIGTERM
const ARRIVALS: [u32; 6] = [2, 1, 3, 1, 2, 2];
// service time in ticks for request n, in arrival order
const SERVICE: [u32; 9] = [2, 3, 1, 4, 5, 2, 6, 3, 20];

struct Req {
    id: u32,
    left: u32,
}

fn main() {
    let mut next_id = 0usize;
    let mut in_flight: Vec<Req> = Vec::new();
    let mut accepting = true;
    let mut completed = 0u32;
    let mut rejected = 0u32;
    let mut sigterm_tick = 0u32;
    let mut at_sigterm = 0usize;

    println!("t   accepting  ready  arrived  admitted  in_flight  done");
    for t in 0..20u32 {
        if t == SIGTERM_AT {
            accepting = false;
            sigterm_tick = t;
            at_sigterm = in_flight.len();
        }

        let arrived = if (t as usize) < ARRIVALS.len() {
            ARRIVALS[t as usize]
        } else {
            0
        };
        let mut admitted = 0;
        for _ in 0..arrived {
            if accepting && next_id < SERVICE.len() {
                in_flight.push(Req {
                    id: next_id as u32,
                    left: SERVICE[next_id],
                });
                next_id += 1;
                admitted += 1;
            } else {
                rejected += 1;
            }
        }

        for r in in_flight.iter_mut() {
            r.left -= 1;
        }
        let before = in_flight.len();
        in_flight.retain(|r| r.left > 0);
        completed += (before - in_flight.len()) as u32;

        println!(
            "{:<3} {:<10} {:<6} {:<8} {:<9} {:<10} {}",
            t,
            if accepting { "yes" } else { "no" },
            if accepting { "200" } else { "503" },
            arrived,
            admitted,
            in_flight.len(),
            completed
        );

        if !accepting && in_flight.is_empty() {
            println!("drained cleanly at t={}", t);
            break;
        }
        if !accepting && t - sigterm_tick >= DEADLINE {
            let killed: Vec<u32> = in_flight.iter().map(|r| r.id).collect();
            println!("deadline hit at t={} -- force-closing {:?}", t, killed);
            break;
        }
    }

    println!();
    println!(
        "completed {}, rejected {} (503 after SIGTERM), force-closed {}",
        completed,
        rejected,
        in_flight.len()
    );
    println!(
        "immediate exit at t={} would have killed {} in-flight instead",
        SIGTERM_AT, at_sigterm
    );
}
`,
  },

  "backend-production-7": {
    instructions: `## Little's Law

\`L = λ · W\`. L is the requests in the system, λ the arrival rate, W the time in the system. It holds for any stable system with no assumption about the arrival distribution.

Below capacity, latency is service time. Past it the backlog grows linearly and without bound, so the latency target is what fixes the concurrency limit: admit L, shed the next one immediately.

### Your task

1. \`capacity()\` is \`WORKERS / SERVICE_S\`. \`concurrency(lambda, w_s)\` is \`lambda * w_s\` — write Little's Law once and reuse it.
2. For each offered rate print L, utilisation, the backlog after one second of overload, the resulting latency (\`SERVICE_S + backlog / capacity()\`) and a verdict of \`ok\`, \`at capacity\` or \`saturated\`.
3. Print the workers needed to serve the peak at the current service time.
4. Turn \`TARGET_MS\` into a concurrency limit, split it into in-service and queued, and print how long overload takes to fill the queue.

Expected output:

\`\`\`text
capacity = L / W = 32 / 0.020s = 1600 rps

offered      L  util%  backlog_1s  latency_ms  verdict
    400    8.0   25.0           0        20.0  ok
    800   16.0   50.0           0        20.0  ok
   1200   24.0   75.0           0        20.0  ok
   1600   32.0  100.0           0        20.0  at capacity
   1800   36.0  112.5         200       145.0  saturated
   2000   40.0  125.0         400       270.0  saturated

to serve 2000 rps at W = 20 ms you need L = 2000 * 0.020 = 40 workers
latency target 50 ms at 1600 rps: L = 1600 * 0.050 = 80 in system
  = 32 in service + 48 queued -> concurrency limit 80, shed beyond it
  at 1800 rps the queue passes 48 after 0.24s of overload
\`\`\`

### Hints

- \`concurrency\` takes **seconds**, so pass \`TARGET_MS / 1000.0\`.
- Under capacity the backlog is \`0.0\` and the latency is \`SERVICE_S * 1000.0\`; the verdict is \`"at capacity"\` only when utilisation reaches 100.
- The table row is \`"{:>7.0} {:>6.1} {:>6.1} {:>11.0} {:>11.1}  {}"\`.
- \`queue_max / overload\` at 1800 rps is \`48 / 200 = 0.24\` seconds.
`,
    starterCode: `const WORKERS: f64 = 32.0;
const SERVICE_S: f64 = 0.020; // 20 ms of work per request
const WINDOW_S: f64 = 1.0;
const OFFERED: [f64; 6] = [400.0, 800.0, 1200.0, 1600.0, 1800.0, 2000.0];
const TARGET_MS: f64 = 50.0;

fn main() {
    // capacity() = WORKERS / SERVICE_S
    // concurrency(lambda, w_s) = lambda * w_s        <- Little's Law
    //
    // For each offered rate print L, utilisation, the backlog after one
    // second of overload, the resulting latency (service + backlog/capacity)
    // and a verdict.
    //
    // Then: workers needed to serve the peak at the current service time,
    // and the concurrency limit a TARGET_MS latency target implies --
    // L = capacity * target, split into in-service and queued.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "L = lambda * W is written once and reused",
        kind: "fn_defined",
        fn: "concurrency",
        returns: "f64",
      },
      {
        name: "capacity is workers divided by service time",
        kind: "expr_present",
        expr: "WORKERS / SERVICE_S",
      },
      {
        name: "queue wait is backlog over drain rate",
        kind: "expr_present",
        expr: "backlog / capacity()",
      },
      {
        name: "turns the latency target into a concurrency limit",
        kind: "expr_present",
        expr: "concurrency(capacity(), TARGET_MS / 1000.0)",
      },
      {
        name: "splits the limit into in-service and queued",
        kind: "expr_present",
        expr: "l_max - WORKERS",
      },
      {
        name: "does not invert L = lambda * W",
        kind: "expr_present",
        expr: "capacity() / WORKERS",
        forbidden: true,
      },
    ],
    expectedOutput: "capacity = L / W = 32 / 0.020s = 1600 rps\n\noffered      L  util%  backlog_1s  latency_ms  verdict\n    400    8.0   25.0           0        20.0  ok\n    800   16.0   50.0           0        20.0  ok\n   1200   24.0   75.0           0        20.0  ok\n   1600   32.0  100.0           0        20.0  at capacity\n   1800   36.0  112.5         200       145.0  saturated\n   2000   40.0  125.0         400       270.0  saturated\n\nto serve 2000 rps at W = 20 ms you need L = 2000 * 0.020 = 40 workers\nlatency target 50 ms at 1600 rps: L = 1600 * 0.050 = 80 in system\n  = 32 in service + 48 queued -> concurrency limit 80, shed beyond it\n  at 1800 rps the queue passes 48 after 0.24s of overload\n",
    referenceSolution: `const WORKERS: f64 = 32.0;
const SERVICE_S: f64 = 0.020; // 20 ms of work per request
const WINDOW_S: f64 = 1.0;
const OFFERED: [f64; 6] = [400.0, 800.0, 1200.0, 1600.0, 1800.0, 2000.0];
const TARGET_MS: f64 = 50.0;

fn capacity() -> f64 {
    WORKERS / SERVICE_S
}

/// L = lambda * W — the concurrency an arrival rate implies.
fn concurrency(lambda: f64, w_s: f64) -> f64 {
    lambda * w_s
}

fn main() {
    println!("capacity = L / W = {} / {:.3}s = {:.0} rps", WORKERS, SERVICE_S, capacity());
    println!();
    println!("offered      L  util%  backlog_1s  latency_ms  verdict");

    for lambda in OFFERED {
        let l = concurrency(lambda, SERVICE_S);
        let util = 100.0 * l / WORKERS;
        let excess = lambda - capacity();
        let (backlog, latency_ms, verdict) = if excess <= 0.0 {
            (
                0.0,
                SERVICE_S * 1000.0,
                if util >= 100.0 { "at capacity" } else { "ok" },
            )
        } else {
            let backlog = excess * WINDOW_S;
            (
                backlog,
                (SERVICE_S + backlog / capacity()) * 1000.0,
                "saturated",
            )
        };
        println!(
            "{:>7.0} {:>6.1} {:>6.1} {:>11.0} {:>11.1}  {}",
            lambda, l, util, backlog, latency_ms, verdict
        );
    }

    println!();
    let peak = OFFERED[OFFERED.len() - 1];
    let needed = concurrency(peak, SERVICE_S);
    println!(
        "to serve {:.0} rps at W = {:.0} ms you need L = {:.0} * {:.3} = {:.0} workers",
        peak, SERVICE_S * 1000.0, peak, SERVICE_S, needed
    );
    let l_max = concurrency(capacity(), TARGET_MS / 1000.0);
    let queue_max = l_max - WORKERS;
    println!(
        "latency target {:.0} ms at {:.0} rps: L = {:.0} * {:.3} = {:.0} in system",
        TARGET_MS,
        capacity(),
        capacity(),
        TARGET_MS / 1000.0,
        l_max
    );
    println!(
        "  = {:.0} in service + {:.0} queued -> concurrency limit {:.0}, shed beyond it",
        WORKERS, queue_max, l_max
    );
    let overload = OFFERED[4] - capacity();
    println!(
        "  at {:.0} rps the queue passes {:.0} after {:.2}s of overload",
        OFFERED[4], queue_max, queue_max / overload
    );
}
`,
  },
};
