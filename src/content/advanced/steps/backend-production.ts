import type { LessonStep } from "@/content/steps";

// Advanced · Running It in Production.

export const backendProductionSteps: Record<string, LessonStep[]> = {
  "backend-production-1": [
    {
      kind: "theory",
      body: `Three instrument types, and each answers a different question.

A **counter** is monotonic — it only goes up, and it is reset only by a process restart. Its instantaneous value is meaningless; you read its *rate*.

\`\`\`text
rate(http_requests_total[5m])
\`\`\`

A **gauge** is a point-in-time level that moves in both directions: active connections, queue depth, pool size, in-flight requests.

A **histogram** is a set of cumulative bucket counters plus \`_sum\` and \`_count\`. You observe values into it and query distributions out of it.

These three are the ones you should reach for. Prometheus also ships a **summary**, which computes its quantiles inside the process and exports them as finished numbers — and quantiles, unlike bucket counts, cannot be added, so a summary is unmergeable across a fleet. That is the whole subject of the next lesson, and the reason a histogram is the default.

Getting the type wrong is not a style mistake — a counter cannot tell you concurrency, and a gauge cannot tell you rate.`,
    },
    {
      kind: "theory",
      body: `Two traps, and both bite in production.

**A gauge is only ever seen at scrape time**, typically every 15–30 s. Everything between scrapes is invisible. In the exercise the true peak of 14 in-flight requests is never observed, because every scrape lands on a trough and reports 5. If the peak is what matters — pool exhaustion, queue high-water — export a max-since-last-scrape gauge alongside the instantaneous one, or use a histogram.

**Every distinct label value is a separate time series.** A \`user_id\` label on a histogram with 9 buckets and 100k users is 900,000 series, and that is how you take down your own metrics backend. Labels are for bounded sets: route, method, status class.`,
    },
    {
      kind: "quiz",
      question: "An in-flight-requests gauge is scraped every 15 s. The highest sample recorded all day is 5. What does that establish about the true peak?",
      options: [
        "Only that some scrape saw 5 — anything that rose and fell between two scrapes was never sampled, so the real peak can be far higher",
        "The true peak was 5: a gauge exports the maximum reached since the previous scrape",
        "The true peak was 5, because a request lives longer than the scrape interval, so nothing can hide between samples",
      ],
      answer: 0,
      explain: "A plain gauge reports the value at the instant it is read, not a max over the interval — that is a separate instrument you have to export deliberately. The third option is the argument people actually make, and it fails exactly when it matters: bursts of short requests are the spikes that exhaust a pool.",
    },
    {
      kind: "fill",
      prompt: "Assign an observation to a bucket. Prometheus buckets are `le` — less than **or equal to** the bound.",
      file: "main.rs",
      before: "while i < BOUNDS.len() && v ",
      after: " BOUNDS[i] {\n    i += 1;\n}",
      choices: ["> ", ">= ", "< "],
      answer: 0,
      explain: "With `>=`, a value equal to the bound skips past its own bucket: a 10 ms request lands in `le<=50` and the `le<=10` count silently under-reports. `<` walks the wrong way entirely and puts everything in the first bucket.",
    },
    {
      kind: "quiz",
      question: "A service exports `http_request_duration_sum` and `http_request_duration_count` and nothing else. Which question can it not answer?",
      options: [
        "How many requests took longer than 100 ms — that is a bucket count, and a sum and a count cannot reconstruct one",
        "The mean latency over the last five minutes — a sum and a count cannot be rated over a window",
        "The total time the service spent serving requests — `_sum` is a count of requests, not a total of durations",
      ],
      answer: 0,
      explain: "The mean is exactly what those two give you: `rate(_sum[5m]) / rate(_count[5m])`. In the exercise the mean is 42.2 ms while 15 of 20 requests finished under 10 ms — the mean is real and it is also useless for the tail.",
    },
    {
      kind: "editor",
      intro: `### Three instruments over one workload

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

The gauge's true peak is 14 and every scrape misses it. The mean is 42.2 ms and 15 of 20 requests finished under 10 ms.`,
    },
  ],

  "backend-production-2": [
    {
      kind: "theory",
      body: `Prometheus exposes \`_bucket{le="..."}\` as **cumulative** counts, plus \`_sum\` and \`_count\`.

The mean is exact: \`_sum / _count\`. A quantile is not. You compute a rank, walk the cumulative counts until you cross it, and report that bucket's upper bound:

\`\`\`text
rank = ceil(q · n)
walk cumulative counts until cum >= rank
answer = that bucket's upper bound
\`\`\`

So a reported p99 of 2000 ms means only "somewhere between 500 and 2000 ms". **Your bucket boundaries are the resolution of your answer**, which is why they must straddle your SLO. Tightening an SLO means adding boundaries, not adding samples.`,
    },
    {
      kind: "theory",
      body: `Percentiles are not linear. You cannot average them across instances, and you cannot take the max either. **Adding bucket counts is valid**, because every bucket is a counter — that is the whole reason Prometheus histograms are shaped this way, and why the fleet query sums buckets *before* computing the quantile:

\`\`\`text
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_bucket[5m])))
\`\`\`

The exercise makes the error visible in both directions. A busy healthy instance (1000 req) and a quiet sick one (100 req) give mean-of-p99s = 1012.5 against a true 2000, and mean-of-p95s = 1005 against a true 500. Averaging understated one and doubled the other, because the unweighted mean ignores that api-1 carries 91% of the traffic.

The merged mean is 42 ms and the merged p99 is 2000 ms — a 48x gap. A mean of 42 ms never pages anyone; one user in a hundred is waiting two seconds. Criterion gives you the same distribution for a benchmark, and a flamegraph tells you *where* the tail time went once the histogram has told you it exists.`,
    },
    {
      kind: "quiz",
      question: "Twelve instances each export a p99. What is the fleet's p99?",
      options: [
        "None of the per-instance p99s can be combined — sum the buckets across instances first, then compute the quantile from the merged counts",
        "The maximum of them: p99 is a worst-case measure, so the worst instance sets the fleet's",
        "The average of them, weighted by each instance's request count — a request-weighted mean of quantiles is exact",
      ],
      answer: 0,
      explain: "The weighted mean is the sophisticated wrong answer, and it is still wrong: weighting fixes the traffic skew but a quantile of a mixture is not any mean of the parts' quantiles. Only the buckets are additive.",
    },
    {
      kind: "fill",
      prompt: "Merge two instances' histograms into one.",
      file: "main.rs",
      before: "for i in 0..9 {\n    merged.counts[i] = ",
      after: ";\n}",
      choices: ["a.counts[i] + b.counts[i]", "(a.counts[i] + b.counts[i]) / 2", "a.counts[i].max(b.counts[i])"],
      answer: 0,
      explain: "Each bucket is a counter, so the merge is addition. Averaging halves the fleet's observation count and reports a distribution nobody experienced; taking the max double-counts nothing and discards the quiet instance's tail entirely.",
    },
    {
      kind: "quiz",
      question: "Your buckets are `..., 500, 2000, +Inf` and the dashboard reports p99 = 2000 ms. What has it told you?",
      options: [
        "That 99% of requests finished within 2000 ms — the true p99 is somewhere above 500 ms, and 2000 is a boundary you chose, not a measurement",
        "That the slowest 1% of requests each took approximately 2000 ms",
        "That one request in a hundred took exactly 2000 ms — the histogram stores the observed value at that rank",
      ],
      answer: 0,
      explain: "A bucketed histogram keeps no samples at all, only counts. Every p99 between 500 and 2000 reports 2000; to resolve a 900 ms SLO you add a 1000 ms boundary.",
    },
    {
      kind: "editor",
      intro: `### Merge two instances without lying

1. Implement \`count()\`, \`mean()\` (\`_sum / _count\`) and \`quantile(q)\` — rank \`ceil(q · n)\`, walk the cumulative counts, return the crossing bucket's upper bound.
2. Build \`api-1\` and \`api-2\` from the counts in the starter comments, then \`merged\` by **adding the buckets** and adding the sums.
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

Averaging the p95s doubles the truth; averaging the p99s halves it.`,
    },
  ],

  "backend-production-3": [
    {
      kind: "theory",
      body: `A log line is key=value, not a sentence.

\`\`\`rust
error!("failed to load user {} for org {}", uid, org);
\`\`\`

That is one opaque string. You cannot aggregate it, index it, or alert on it without a regex that breaks the next time someone edits the wording. This is a record:

\`\`\`text
level=error event=user_load_failed user_id=91 org_id=4 err=timeout
\`\`\`

Every field is a queryable dimension, the message text is stable, and the same line serialises to JSON for an ingest pipeline unchanged. That is what \`tracing\` gives you over \`log\`: a \`Subscriber\` formats structured fields rather than a pre-rendered string, and \`#[instrument]\` attaches a span's fields to every event inside it automatically.`,
    },
    {
      kind: "theory",
      body: `A production log is many requests interleaved. In the exercise, seq 01–12 alternate between two request IDs and **no line is adjacent to the line it belongs with**. A request ID generated at the edge and carried through every layer — and out over the wire as \`traceparent\` to downstream services — is what turns that stream back into a story.

Add \`depth\`, or a real span parent, and you can reconstruct the tree with durations. Note what falls out:

\`\`\`text
root 46ms, children 44ms, unaccounted 2ms
\`\`\`

That 2 ms is the handler's own work. It is the number that tells you whether to optimise your code or your dependency, and you cannot get it from either duration alone.

Cardinality rule: a request ID is fine as a log **field**, and catastrophic as a metric **label**.`,
    },
    {
      kind: "quiz",
      question: "The team has no correlation ID but does log `user_id` and `endpoint` on every line. Why is that not equivalent?",
      options: [
        "Two concurrent requests from the same user to the same endpoint produce interleaved lines that no filter can separate",
        "`user_id` and `endpoint` are high-cardinality fields, so the log backend refuses to index them",
        "Log lines for one request are contiguous in the stream, so a filter is unnecessary in the first place",
      ],
      answer: 0,
      explain: "It degrades exactly when you need it: under load, on a retrying client, during the incident. The other two options are false about a log backend (fields are cheap; it is metric *labels* that are not) and false about the stream (interleaving is the default).",
    },
    {
      kind: "fill",
      prompt: "Sum the child spans, so the handler's own time can be separated from its callees'.",
      file: "main.rs",
      before: "EVENTS.iter()\n    .filter(|e| e.0 == \"7f3a\" && e.3 == \"end\" && ",
      after: ")\n    .map(|e| e.4)\n    .sum()",
      choices: ["e.2 == 1", "e.2 == 0", "e.2 >= 0"],
      answer: 0,
      explain: "Depth 0 is the root — the very span you are subtracting from. Including it reports 0 ms unaccounted and hides the handler's own cost; including everything gives 90 ms of children inside a 46 ms root.",
    },
    {
      kind: "quiz",
      question: "A root span is 46 ms and its two child spans total 44 ms. What is the handler itself doing?",
      options: [
        "2 ms of work — child spans are the callees' time, and the difference is the caller's own",
        "44 ms of work — the children are the handler's own operations, instrumented",
        "46 ms of work — the root span measures everything the handler does, children included",
      ],
      answer: 0,
      explain: "Confusing the two sends you optimising the wrong process. 2 ms of self time against 41 ms in `db.query` means the answer is an index or a query rewrite, not a faster handler.",
    },
    {
      kind: "editor",
      intro: `### Reconstruct one request from an interleaved stream

1. \`fn emit(...) -> String\` builds one structured line: \`seq\` zero-padded to two digits, \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — plus \`dur_ms\` **only on an end**, and \`level=warn\` when an end exceeds 40 ms.
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

2 ms unaccounted is the handler's own work. 41 of the 46 ms is in \`db.query\`.`,
    },
  ],

  "backend-production-4": [
    {
      kind: "theory",
      body: `A fixed retry interval is worse than no retry: it hits a struggling dependency at exactly the wrong moment, repeatedly. Exponential backoff — \`base · 2^attempt\`, capped — spreads the attempts out.

But **backoff alone synchronises**. If 500 clients fail at the same instant, they all retry at t+100 ms, then all at t+300 ms: a thundering herd on a tidy schedule. Full jitter decorrelates them:

\`\`\`text
delay = uniform(0, min(cap, base · 2^attempt))
\`\`\`

The cap matters too. Uncapped doubling from a 100 ms base reaches \`100 << 13\` = 819,200 ms — thirteen and a half minutes — by attempt 13, and a client that has long given up on the user is still holding a connection slot.

The exercise's LCG is seeded deterministically on purpose — a retry policy you cannot reproduce is a retry policy you cannot test. Note attempt 1 drawing 1 ms of jitter: full jitter genuinely can return near-zero, which is why some systems prefer decorrelated jitter with a floor.`,
    },
    {
      kind: "theory",
      body: `Retries multiply load exactly when the system has the least capacity to absorb it. With 3 retries on a call that is 62% likely to fail, the exercise takes offered load from 40 attempts to 115 — **2.88x amplification aimed at a dependency that is already down**. That is the shape of most cascading outages: the retry logic converts a degraded dependency into a dead one.

A **retry budget** fixes it at the client. Retries may consume at most a fixed fraction of request volume — 10% here, implemented as a token bucket that earns 10 centi-tokens per call and pays 100 per retry. Amplification falls to 1.07x, 72 of 75 retries are denied, and the dependency gets room to recover.

Two rules that are not negotiable: retry only idempotent operations, and never retry a 4xx. The dependency answered correctly; the request is wrong, and it will be just as wrong the second time.`,
    },
    {
      kind: "quiz",
      question: "Every client uses exponential backoff. Why can a thundering herd still form?",
      options: [
        "Clients that failed together back off by the same amounts, so they arrive together at each retry — backoff changes when the herd arrives, not that it does",
        "Backoff caps the delay, and once every client is at the cap they retry at the cap's frequency forever",
        "Exponential growth outruns the dependency's recovery, so the herd forms after the dependency is already healthy",
      ],
      answer: 0,
      explain: "Jitter is what breaks the correlation. The capped-clients option describes a real steady state, but the herd is already synchronised long before the cap — it is synchronised from the first retry.",
    },
    {
      kind: "fill",
      prompt: "Turn a backoff into a full-jitter delay.",
      file: "main.rs",
      before: "let b = backoff(attempt);\nlet delay = ",
      after: ";",
      choices: ["rng.below(b + 1)", "b / 2 + rng.below(b / 2 + 1)", "b + rng.below(b + 1)"],
      answer: 0,
      explain: "Full jitter is uniform over the whole interval `[0, b]`. The second choice is *equal* jitter — a real AWS variant with a floor at `b/2`, which halves the spread and so decorrelates less. The third adds jitter on top of the backoff, which delays every client without decorrelating them at all.",
    },
    {
      kind: "quiz",
      question: "Every client is capped at 3 retries per call. Why is that not a bound on the load the dependency sees?",
      options: [
        "A per-call cap bounds one call and says nothing about volume: at a 100% failure rate the fleet still delivers 4x its normal traffic",
        "The cap is per client, and clients cannot see each other, so the total is unbounded even at a low failure rate",
        "Retries bypass the cap when the first attempt times out rather than returning an error",
      ],
      answer: 0,
      explain: "Amplification is a property of the fleet, so the bound has to be expressed against fleet volume. A budget of 10% of requests holds at any failure rate; a cap of 3 holds only at a failure rate you do not control.",
    },
    {
      kind: "editor",
      intro: `### Bound the amplification

1. Implement the LCG: \`next()\` multiplies by \`6364136223846793005\` and adds \`1442695040888963407\` (wrapping), returning \`state >> 33\`; \`below(n)\` is \`next() % n\`, and \`0\` when \`n\` is \`0\`.
2. Seed with \`0x2545F491\` and print, for attempts \`0..5\`, the capped backoff (\`BASE_MS << attempt\`, capped at \`CAP_MS\`) beside a full-jitter draw.
3. Count total attempts with no budget: every failing call takes \`MAX_RETRIES\`.
4. Count them again with a budget: earn \`BUDGET_PER_CALL\` per call, pay \`RETRY_COST\` per retry, deny the retry when you cannot pay. Print attempts, amplification and the granted/denied split for both.

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

2.88x becomes 1.07x, and 72 of 75 retries never leave the client.`,
    },
  ],

  "backend-production-5": [
    {
      kind: "theory",
      body: `Three states, and the transitions between them are the whole mechanism.

**Closed** — calls pass through. A run of failures reaching the threshold trips it.
**Open** — no call is made at all. The caller fails immediately with the breaker's own error, in microseconds instead of a 30-second connect timeout.
**Half-open** — reached after a cooldown. Exactly one probe is allowed through. Success closes the breaker and clears the failure run; failure re-opens it and restarts the cooldown.

The exercise prints the whole walk: trip at t=5, probes at t=9, 13 and 17, close at 17. Note what the breaker buys while the dependency is still down — 9 of 22 ticks short-circuited, which is 9 threads or connection slots never blocked on a doomed call.

That is the real point. **A breaker protects the caller from resource exhaustion at least as much as it protects the callee.**`,
    },
    {
      kind: "theory",
      body: `The parameters, and where they go wrong.

**A threshold on consecutive failures is simple but twitchy.** Production libraries use a rolling failure rate instead — "more than 50% of the last 100 calls, minimum 20 calls" — because that does not trip on one unlucky pair and does not stay closed under a steady 40% failure rate.

**Half-open must admit one probe, not resume normal traffic.** Closing straight into full load re-floods a dependency that has just come back with a cold cache, and trips the breaker again immediately.

**Not every failure counts.** A connect timeout or a 503 should; a 400 should not — the dependency answered correctly and it will answer the same way next time.

Related, and worth keeping straight: a **liveness** probe answers "should the orchestrator restart me" and must not depend on anything downstream, or one sick dependency restarts your whole fleet. A **readiness** probe answers "should the load balancer route to me" and legitimately may.`,
    },
    {
      kind: "quiz",
      question: "The cooldown expires. Why does the breaker go to half-open rather than straight back to closed?",
      options: [
        "Closing sends the full load into a dependency nobody has tested; half-open spends exactly one request finding out first",
        "Half-open exists to reset the failure counter, which closed cannot do while a run is in progress",
        "The cooldown is a minimum, and half-open holds the breaker open until the dependency reports itself healthy",
      ],
      answer: 0,
      explain: "The recovering dependency is the fragile case: cold caches, cold connection pools, a backlog to work off. One probe is a cheap question; a thundering reconnect is the thing that puts it back down.",
    },
    {
      kind: "fill",
      prompt: "The half-open probe failed. Re-open the breaker.",
      file: "main.rs",
      before: "} else if state == State::HalfOpen {\n    state = State::Open;\n    opened_at = ",
      after: ";\n}",
      choices: ["t", "opened_at", "0"],
      answer: 0,
      explain: "The cooldown has to restart from *this* failure. Keeping the original `opened_at` leaves the cooldown already expired, so the breaker half-opens again on the very next tick and probes a dead dependency every tick — the hammering the breaker exists to stop. `0` is the same bug, permanently.",
    },
    {
      kind: "quiz",
      question: "What does a circuit breaker protect first?",
      options: [
        "The caller — its threads and connection slots stop being consumed by calls that are going to time out anyway",
        "The callee — shedding load is what lets a struggling dependency recover",
        "The user — a fast error is a better experience than a slow one",
      ],
      answer: 0,
      explain: "Sparing the dependency and failing fast are both real benefits, but they are consequences. A caller without a breaker dies of the callee's illness: every worker parked on a 30-second timeout, and an outage in one dependency becomes an outage in your service.",
    },
    {
      kind: "editor",
      intro: `### Walk the state machine

Print \`t\`, the state on entry, the action, the result and the next state, for all 22 ticks.

- **closed** — call. \`THRESHOLD\` consecutive failures trips it to open, recording \`opened_at\`.
- **open** — short-circuit; make no call at all. \`COOLDOWN\` ticks after \`opened_at\`, move to half-open.
- **half-open** — one probe. Success closes the breaker and clears the run; failure re-opens it and restarts the cooldown.

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

13 calls instead of 22, and the two failed probes cost one request each rather than a stampede.`,
    },
  ],

  "backend-production-6": [
    {
      kind: "theory",
      body: `Four phases, in this order.

**1. Stop accepting.** On SIGTERM, flip the readiness probe to failing and close the listener, so the load balancer stops routing new requests here while the process is still alive. Readiness must flip *before* the listener closes in a real cluster — the LB needs a few seconds to notice, which is why production shutdown handlers sleep before closing anything.

**2. Drain.** Keep serving what is already in flight. The exercise's drain curve is 5 → 4 → 2 → 1 as requests retire.

**3. Deadline.** Draining cannot be unbounded: one stuck request would hold the pod forever, and the orchestrator's own grace period will not wait. Kubernetes gives you 30 s and then sends SIGKILL.

**4. Force-close** what is left, and log which requests you killed — request 8 here, the 20-tick outlier.`,
    },
    {
      kind: "theory",
      body: `What this buys, and what it does not.

Exiting immediately on SIGTERM kills 5 in-flight requests. Draining kills 1. That difference is the deploy that shows up as a p99 spike and a burst of 502s versus the deploy nobody notices — multiplied by every pod in a rolling update.

The rejected requests are correct behaviour, not errors: a 503 with the connection closing is a signal to the balancer to route elsewhere.

Two things graceful shutdown does **not** give you. It does not give you **idempotency** — a request killed at the deadline may have half-committed, so the work itself has to be safe to retry. And it does not rescue **long-running work**: a 10-minute job does not belong behind a request, it belongs on a queue whose consumer can be interrupted and resumed.

Rollbacks are the same family of thinking. A rollback must be as automatic as a deploy because it is the one remediation whose blast radius you already understand.`,
    },
    {
      kind: "quiz",
      question: "Is it equivalent to close the listener and flip readiness to failing, or does the order matter?",
      options: [
        "Readiness first: closing the socket while the balancer still believes in this pod refuses connections it is actively routing here",
        "Listener first: an open socket is what keeps the balancer routing, so closing it is what actually drains traffic",
        "Equivalent — both make the pod unreachable, and the balancer discovers either one on its next health check",
      ],
      answer: 0,
      explain: "They drain two different things. The readiness flip drains the *routing*; the listener close drains the *socket*. Do the socket first and every request the balancer sends in the seconds before it notices gets a connection refused, which is exactly the 502 burst you were avoiding.",
    },
    {
      kind: "fill",
      prompt: "Admit an arrival only while the server is still accepting.",
      file: "main.rs",
      before: "for _ in 0..arrived {\n    if ",
      after: " && next_id < SERVICE.len() { /* admit */ } else { rejected += 1; }\n}",
      choices: ["accepting", "t < SIGTERM_AT + DEADLINE", "in_flight.len() < 5"],
      answer: 0,
      explain: "The second choice keeps admitting all through the drain window — accepting work you have already promised to force-close at the deadline. The third is a concurrency limit: a good thing to have, and no substitute, since it happily admits new requests after SIGTERM whenever there is room.",
    },
    {
      kind: "quiz",
      question: "The drain deadline is described as a safety net that should never fire, so it is set to 60 s. What is wrong with that?",
      options: [
        "It fires on precisely the requests that are already pathological, and 60 s exceeds Kubernetes' 30 s grace period — SIGKILL arrives first and the drain never completes",
        "A long deadline holds the pod's connections open, so the balancer keeps routing to it for the full 60 s",
        "The deadline is per request, so a 60 s deadline lets 60 s of new work accumulate before it applies",
      ],
      answer: 0,
      explain: "A deadline longer than the orchestrator's grace period is a deadline that does not exist, and you get the ungraceful shutdown you were trying to avoid. Pick it under the grace period, and expect it to fire — the requests it kills are the ones that were never going to finish.",
    },
    {
      kind: "editor",
      intro: `### Drain, deadline, force-close

Each tick: admit the tick's arrivals only while accepting (otherwise count a 503), decrement every in-flight request, retire the ones that reach 0, and print the row.

- At \`SIGTERM_AT\`: stop accepting, flip readiness to \`503\`, and remember how many were in flight.
- Stop when \`in_flight\` is empty (a clean drain), or when \`DEADLINE\` ticks have passed since SIGTERM — then force-close whatever is left, printing the ids.
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

One request killed instead of five, and the one killed is the 20-tick outlier that was never going to finish.`,
    },
  ],

  "backend-production-7": [
    {
      kind: "theory",
      body: `\`\`\`text
L = λ · W
\`\`\`

**L** is the number of requests *in the system* — being served plus queued. **λ** is the arrival rate. **W** is the time a request spends in the system.

It holds for any stable system, with no assumption about the arrival distribution. That is why it is the one queueing result worth memorising.

Read it three ways.

**Forwards** — 1200 rps at a 250 ms target needs 300 concurrent slots.
**Backwards** — 32 workers at 20 ms of service each is 32/0.020 = 1600 rps of capacity, full stop; no tuning gets more without changing one of those two numbers.
**Sideways** — a dashboard showing 40 in-flight, 1200 rps and 20 ms latency is showing you a wrong number, because 1200 · 0.020 is 24.`,
    },
    {
      kind: "theory",
      body: `Below capacity, latency is just service time and the queue is empty. Past it, arrivals exceed departures and **the backlog grows linearly and without bound**. At 1800 rps against 1600, one second of overload leaves 200 queued, each waiting 200/1600 = 125 ms on top of their 20 ms of work. Latency does not degrade gracefully; it degrades at the rate of the excess.

So set the limit deliberately. At a 50 ms target with 1600 rps of capacity, L = 1600 · 0.050 = 80 in system: 32 in service, 48 may queue. **Admit 80. Shed the 81st with an immediate 503**, because a request admitted past that point cannot meet 50 ms anyway and will occupy a slot while failing to.

This is what a load test measures. Ramp to find capacity (sustained), overshoot to find the failure mode (saturation), step-function it to see whether recovery is graceful (spike). Watch tail latency, not the mean — a saturating system's mean stays respectable for a surprisingly long time.`,
    },
    {
      kind: "quiz",
      question: "Why is 100% utilisation not the efficient operating point?",
      options: [
        "At 100% there is no slack to absorb variance in arrivals, so any burst builds a queue that never fully drains and latency climbs while throughput still looks fine",
        "At 100% the scheduler spends most of its time on context switches, so effective throughput falls below capacity",
        "100% utilisation is efficient — the 60–70% convention is about leaving room for a failed replica, not about latency",
      ],
      answer: 0,
      explain: "Arrivals are not evenly spaced. With zero headroom, every burst leaves a residue that the next quiet period has no spare capacity to work off, and W climbs while λ is unchanged — the queue is the only term that can move.",
    },
    {
      kind: "fill",
      prompt: "Turn a latency target into a concurrency limit. `concurrency` takes seconds.",
      file: "main.rs",
      before: "let l_max = concurrency(capacity(), ",
      after: ");",
      choices: ["TARGET_MS / 1000.0", "TARGET_MS", "SERVICE_S"],
      answer: 0,
      explain: "Passing milliseconds against a per-second rate gives L = 80,000 — the units error that makes Little's Law look wrong. Passing `SERVICE_S` gives L = 32, which is the worker count: the misconception that the limit is the pool size and no queueing is allowed at all.",
    },
    {
      kind: "quiz",
      question: "The service saturates, so the request queue is enlarged from 100 to 10,000. What does that change?",
      options: [
        "Nothing about capacity: it converts an availability problem into a latency one, which buys time for a burst and only makes sustained overload fail slowly instead of fast",
        "It raises effective capacity, since fewer requests are rejected per second and workers are never idle waiting for one to arrive",
        "It lowers p99, because requests that would have been shed now complete instead of being retried by the client",
      ],
      answer: 0,
      explain: "A queue is a buffer, not a server. Against sustained overload every request now waits and then fails, which is strictly worse than failing immediately. A concurrency limit is what makes shedding a decision rather than an accident.",
    },
    {
      kind: "editor",
      intro: `### From a latency target to an admission limit

1. \`capacity()\` is \`WORKERS / SERVICE_S\`. \`concurrency(lambda, w_s)\` is \`lambda * w_s\` — Little's Law, written once.
2. For each offered rate print L, utilisation, the backlog after one second of overload, the resulting latency (\`SERVICE_S + backlog / capacity()\`) and a verdict of \`ok\`, \`at capacity\` or \`saturated\`.
3. Print the workers needed to serve the peak at the current service time.
4. Turn \`TARGET_MS\` into a concurrency limit — \`L = capacity · target\` — split it into in-service and queued, and print how long overload takes to fill the queue.

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

Beyond 1600 rps the queue is the only term that can absorb the excess, and it does so linearly.`,
    },
  ],
};
