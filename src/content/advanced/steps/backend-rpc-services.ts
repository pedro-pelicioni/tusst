import type { LessonStep } from "@/content/steps";

// Advanced · RPC Services at Scale.

export const backendRpcServicesSteps: Record<string, LessonStep[]> = {
  "backend-rpc-services-1": [
    {
      kind: "theory",
      body: `A JSON-RPC 2.0 Request is four members: \`jsonrpc\`, \`method\`, an optional \`params\`, and an optional \`id\`. A Response carries **either** \`result\` **or** \`error\` — never both, never neither.

\`\`\`json
{"jsonrpc": "2.0", "method": "sum", "params": [1, 2], "id": 3}
{"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": 3}
\`\`\`

Five codes are reserved, and they partition the failure space in the order you check them:

| code | meaning | what the caller learns |
| --- | --- | --- |
| -32700 | Parse error | the bytes were not JSON |
| -32600 | Invalid Request | it parsed, but it is not a Request object |
| -32601 | Method not found | this endpoint does not exist |
| -32602 | Invalid params | it exists — retry with different arguments |
| -32603 | Internal error | it is not you, it is the server |

\`-32000\` through \`-32099\` is left for the application's own server errors: \`-32001 Request timeout\`, \`-32002 Server busy\`, and whatever else your contract documents.`,
    },
    {
      kind: "theory",
      body: `JSON-RPC says **nothing** about HTTP. The same envelope rides HTTP/1.1, HTTP/2 or a raw socket unchanged, and the transport underneath decides your concurrency, not the protocol.

**HTTP/1.1 keep-alive** gives one in-flight request per connection. N concurrent calls need a pool of N connections, and head-of-line blocking is per connection — one slow response stalls only that socket.

**HTTP/2** multiplexes many streams over one connection, so a pool of 2–4 connections saturates a backend. The trade is that a single TCP loss event now stalls every stream sharing that connection.

Pool sizing is arithmetic, not taste. A pool of 8 against a service with a 200-connection limit, with 30 client instances, is 240 connections — and the last 40 are a refused-connection storm that looks like an outage.

Two envelope details that bite later: the \`id\` must come back **byte-identically** (a string id returns a string), and ordering is not guaranteed. The id is the only correlation the protocol gives you.`,
    },
    {
      kind: "quiz",
      question:
        "A client calls `sbutract` — a typo for a method the server does not have. Which code, and why does the distinction matter?",
      options: [
        "-32601 Method not found: the name is not registered. -32602 is for a method that *does* exist whose arguments do not typecheck",
        "-32602 Invalid params, because the method name is itself a bad parameter of the request",
        "-32603 Internal error, since the server could not complete the call",
      ],
      answer: 0,
      explain:
        "Conflating them costs the caller the one bit that separates 'this endpoint does not exist' from 'retry with different arguments'. A client that sees -32602 will keep retrying an endpoint that will never exist.",
    },
    {
      kind: "fill",
      prompt: "A method name the server does not know gets its own code.",
      file: "main.rs",
      before: "return Reply { code: ",
      after: ', message: "Method not found", id: r.id.clone() };',
      choices: ["-32601", "-32602", "-32600"],
      answer: 0,
      explain:
        "-32602 would say the arguments were wrong for a method that exists; -32600 would say the request object itself was malformed. Neither is true here — the envelope was fine and the name was not registered.",
    },
    {
      kind: "quiz",
      question:
        "Why do -32700 and -32600 answer with `id: null` while -32601, -32602 and -32603 echo the id they received?",
      options: [
        "The id cannot be trusted until you hold a valid Request object — the body may not have parsed, or the id member may be the wrong type",
        "Null is used for every error response; only successful results carry an id",
        "The id is echoed only when the handler ran, so -32601 and -32602 also send null",
      ],
      answer: 0,
      explain:
        "'Always echo the id you received' is the misconception. For a parse error there may be no id at all, and for an invalid Request object the member may be an object or an array. Once the request has been validated, all three remaining codes echo.",
    },
    {
      kind: "editor",
      intro: `### Classify an inbound request

Fill in \`classify\`. Run the five checks in order — parse, request shape, method, params, handler — and answer each with its code.

1. \`well_formed == false\` → \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. \`version\` not \`Some("2.0")\`, or a missing \`method\` → \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. A method not in \`methods\` → \`-32601\` \`"Method not found"\`, echoing the id.
4. \`params_ok == false\` → \`-32602\` \`"Invalid params"\`, echoing the id.
5. \`handler_ok == false\` → \`-32603\` \`"Internal error"\`, echoing the id.
6. Otherwise \`Reply { code: 0, message: "result", id }\`.

Expected output:

\`\`\`text
request                   code  message           id
truncated body          -32700  Parse error       null
jsonrpc 1.0             -32600  Invalid Request   null
no method member        -32600  Invalid Request   null
method sbutract         -32601  Method not found  3
sum of strings          -32602  Invalid params    "a3"
sum, handler panicked   -32603  Internal error    5
sum, healthy                 -  result            6
\`\`\`

Two rows answer with \`null\` and four echo — the split is the lesson.`,
    },
  ],

  "backend-rpc-services-2": [
    {
      kind: "theory",
      body: `The \`id\` member is a switch. A Request object with **no id** is a **notification**: the server runs the handler and MUST NOT send a response object — not a result, not even an error.

That is the contract, not an optimisation. A client that sent a notification is not reading for a reply, and writing one desynchronises a pipelined connection: every subsequent response is matched against the wrong request.

The spec is careful about one distinction people flatten:

| body | meaning |
| --- | --- |
| \`{"jsonrpc":"2.0","method":"log"}\` | notification — no reply |
| \`{"jsonrpc":"2.0","method":"log","id":null}\` | a call whose id happens to be null — reply with \`"id":null\` |

An **absent** id and an explicit **null** id are different requests.`,
    },
    {
      kind: "theory",
      body: `A batch is a JSON array of Request objects. The server MAY process members in any order and concurrently, and the response array contains only the members that produced a response. Three consequences break naive servers:

- An **empty array** is not a Request object. It gets one \`-32600\` with \`id: null\`.
- A batch of **only notifications** produces **no response body at all** — not \`[]\`, nothing.
- A **malformed member** answers with \`id: null\`, because the server cannot know whether that member was going to be a notification.

And the ordering rule the client side must honour: match responses to requests **by id**, never by position. The array you get back is shorter than the one you sent and may be in any order.`,
    },
    {
      kind: "quiz",
      question:
        "A client sends a batch of five notifications. What does a correct server put on the wire?",
      options: [
        "Nothing at all — no response body, because no member produced a response object",
        "`[]`, an empty array, since the batch was valid and simply produced no results",
        "Five `{\"jsonrpc\":\"2.0\",\"result\":null}` objects, one per member",
      ],
      answer: 0,
      explain:
        "Returning `[]` is a real interop bug: a strict client treats an empty array as a protocol violation, because the spec says the server returns nothing when there is nothing to return. The empty *request* array is the case that gets -32600 — not the empty *response*.",
    },
    {
      kind: "fill",
      prompt:
        "A notification runs its handler and then produces the thing that never reaches the wire.",
      file: "main.rs",
      before: "Frame::Notify { method } => {\n    effects.push(method);\n    ",
      after: "\n}",
      choices: ["None", 'Some(String::new())', 'Some("[]".to_string())'],
      answer: 0,
      explain:
        "`Some(String::new())` writes a zero-length body, which is still a write — and `handle_batch` would count it as a reply and emit a `[]`. `None` is what makes the member disappear from the batch response entirely.",
    },
    {
      kind: "quiz",
      question:
        "Six frames arrive across the exercise's batches, but only three response bodies go out. What does that ratio say about notifications?",
      options: [
        "The side effect still runs for every notification — what is suppressed is the reply, not the work",
        "Notifications are fire-and-forget, so the server may drop the handler under load",
        "The three missing replies were dropped because their handlers failed",
      ],
      answer: 0,
      explain:
        "'Fire-and-forget means the server can skip it' is the misconception, and it turns a durable write into a silent no-op. The counter in the exercise exists to make the distinction countable: six handler invocations, three bodies.",
    },
    {
      kind: "editor",
      intro: `### The frames that get no answer

Fill in \`handle_one\` and \`handle_batch\`.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → push the method onto \`effects\`, return \`None\`.
3. \`Frame::Call { method, id }\` → a method other than \`"add"\` is \`-32601\` echoing the id; otherwise push the method and return the result object with \`"result":7\`.
4. \`handle_batch\` → an empty slice is one \`-32600\` with a null id. Otherwise \`filter_map\` through \`handle_one\`, return \`None\` when nothing replied, else the replies joined with \`,\` inside brackets.

Expected output:

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

Six handlers, three bodies.`,
    },
  ],

  "backend-rpc-services-3": [
    {
      kind: "theory",
      body: `Handlers have different bodies but must share one signature, so each is a trait object:

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
struct Router { routes: HashMap<&'static str, Handler> }
\`\`\`

The box is not ceremony — it is what lets closures of different concrete types live in one collection. The cost is one pointer indirection per call, against a hash lookup that is already dominated by the socket read.

A hand-written \`match\` on the method name compiles to the same dispatch. What it cannot do is be **extended at runtime**: no module registering its own methods at startup, no \`rpc.discover\`, no per-method metrics enumerated from the table, and every new method recompiles the file that owns the match.

One deterministic-output trap: \`HashMap\` iteration order is unspecified and varies per process. Any method listing must be sorted before it is printed or hashed.`,
    },
    {
      kind: "theory",
      body: `Validating at the edge is what \`-32602\` means. In a real service Serde does this job:

\`\`\`rust
#[derive(Deserialize)]
struct SumParams { values: Vec<i64> }
\`\`\`

That turns "the JSON did not have the shape my handler assumes" into a typed failure at the boundary, before any business code runs. Untagged and internally-tagged enum representations decide how a params union is matched against the wire form.

The split that matters:

| failure | code | whose fault |
| --- | --- | --- |
| wrong arity, wrong type, missing field | -32602 | the caller's |
| the handler ran and blew up | -32603 | the server's |

And \`-32603\` must never leak an internal message. \`"Internal error"\` on the wire, the request id and the stack trace in the logs — an error message is an exfiltration channel for table names, file paths and query text.`,
    },
    {
      kind: "quiz",
      question:
        "Why prefer a `HashMap` of boxed handlers over a `match` on the method string?",
      options: [
        "The table can be populated at startup by independent modules and enumerated at runtime; a `match` makes both impossible",
        "The `HashMap` dispatches in O(1) while a `match` on strings is a linear chain of comparisons",
        "Boxed closures avoid the monomorphisation that would otherwise bloat the binary",
      ],
      answer: 0,
      explain:
        "A `match` on string literals is compiled to a length-and-prefix decision tree, so the performance argument is close to a wash. Registrability and introspection are the real difference, and they are what a plugin boundary needs.",
    },
    {
      kind: "fill",
      prompt:
        "Make the method listing identical on every run, whatever the hash seed was.",
      file: "main.rs",
      before:
        "let mut names: Vec<&'static str> = self.routes.keys().copied().collect();\nnames.",
      after: "();\nnames",
      choices: ["sort", "dedup", "reverse"],
      answer: 0,
      explain:
        "`dedup` only removes *adjacent* duplicates, which on unsorted input is nearly a no-op, and keys are unique anyway. `reverse` reverses an order that was already arbitrary.",
    },
    {
      kind: "quiz",
      question:
        "`div` is called with `[10, 0]`. The params typechecked; the handler divided by zero. Which code?",
      options: [
        "-32603 Internal error — the handler was entered and failed",
        "-32602 Invalid params, because the parameters are what caused the failure",
        "-32600 Invalid Request, since the request could never have succeeded",
      ],
      answer: 0,
      explain:
        "The tempting answer is -32602: the params did cause it. But -32602 is reserved for the shape and arity check that happens *before* the handler is entered. Once you are inside the handler, every failure is yours.",
    },
    {
      kind: "editor",
      intro: `### A router of boxed handlers

1. \`register\` inserts the boxed handler into \`self.routes\` under its name.
2. \`dispatch\` looks the method up; \`None\` is \`-32601\` \`"Method not found"\`.
3. \`method_names\` collects the keys and **sorts** them.
4. Register two handlers in \`main\`:
   - \`"sum"\` → \`Ok(params.iter().sum())\`.
   - \`"div"\` → \`-32602\` when \`params.len() != 2\`, \`-32603\` when the divisor is zero, else \`Ok(params[0] / params[1])\`.

Expected output:

\`\`\`text
methods: ["div", "sum"]
method     params     outcome
sum        [1, 2, 3]  result 6
div        [10, 2]    result 5
div        [10, 0]    -32603 Internal error
div        [10]       -32602 Invalid params
multiply   [3, 4]     -32601 Method not found
\`\`\`

Three different failures, three different codes, one table lookup.`,
    },
  ],

  "backend-rpc-services-4": [
    {
      kind: "theory",
      body: `The whole Tower ecosystem is two traits.

\`\`\`rust
trait Service { fn call(&mut self, req: &Req) -> Resp; }
trait Layer<S> { type Svc; fn layer(&self, inner: S) -> Self::Svc; }
\`\`\`

\`Service\` is request in, response out. \`Layer\` takes a service and returns a service. That is the entire abstraction — timeout, retry, concurrency limit, auth, tracing, load balancing are all one struct holding an inner \`S\`, implementing \`Service\` by doing something and then calling \`self.inner.call(req)\`.

Real Tower adds \`poll_ready\` — the backpressure channel, where a service says "not now" **before** you hand it a request — plus associated Response, Error and Future types. The shape is what you build here.`,
    },
    {
      kind: "theory",
      body: `\`TimeoutLayer.layer(CountLayer.layer(Backend))\` builds an onion. The timeout is outermost, so an over-budget request is rejected without the backend ever being entered, and the counter reads **3 of 5**. Flip the two and all five reach the backend, with the timeout only bounding the reply.

A layer stack is a total order over cross-cutting concerns, and you should be able to defend it:

| decision | above | below |
| --- | --- | --- |
| auth vs rate limit | unauthenticated traffic still consumes quota | your limiter does crypto for junk traffic |
| tracing vs retry | one span per logical call | one span per attempt |
| timeout vs concurrency limit | the queue wait counts against the budget | only the service time does |

None of those has a universal answer. All of them have an answer for your service.`,
    },
    {
      kind: "quiz",
      question:
        "The timeout layer rejects a request at 100ms. What happened to the work the backend had already started?",
      options: [
        "It runs to completion — the timeout drops the inner future, which frees this thread but not the query already in flight",
        "It is cancelled and its connection is released the moment the timeout fires",
        "It is polled once more with a cancellation flag set, and unwinds cleanly",
      ],
      answer: 0,
      explain:
        "This is why a timeout does not protect a database from a slow query: dropping the future returns the caller's thread but the server-side work continues. Bounding that needs a statement timeout on the other side, not a layer on this one.",
    },
    {
      kind: "fill",
      prompt: "The counting layer records the call, then hands it on.",
      file: "main.rs",
      before: "self.calls += 1;\n",
      after: "\n",
      choices: [
        "self.inner.call(req)",
        "Resp::Ok(req.cost_ms)",
        "Backend.call(req)",
      ],
      answer: 0,
      explain:
        "The second answers the request itself, so nothing below the counter ever runs. The third calls a fresh `Backend` rather than the service it was handed — which silently discards every layer underneath it in the stack.",
    },
    {
      kind: "quiz",
      question:
        "`CountLayer.layer(TimeoutLayer.layer(Backend))` instead. What does the counter read, and what changed?",
      options: [
        "5 — the counter is now outermost, so it sees every request including the two the timeout rejects",
        "3 — the same, since the timeout still rejects the same two requests",
        "0 — the counter no longer wraps the backend, so it counts nothing",
      ],
      answer: 0,
      explain:
        "Order determines what each layer *sees*. The same two requests fail either way; what moves is the measurement, which is exactly why 'requests received' and 'requests served' are different metrics and want different positions in the stack.",
    },
    {
      kind: "editor",
      intro: `### Service and Layer

Write four impls.

1. \`impl<S: Service> Service for Counted<S>\` — increment \`self.calls\`, then delegate to \`self.inner.call(req)\`.
2. \`impl<S> Layer<S> for CountLayer\`, \`type Svc = Counted<S>\`, building \`Counted { inner, calls: 0 }\`.
3. \`impl<S: Service> Service for Timeout<S>\` — when \`req.cost_ms > self.limit_ms\`, return \`Resp::Err(-32001, "Request timeout")\` **without** calling the inner service.
4. \`impl<S> Layer<S> for TimeoutLayer\`, \`type Svc = Timeout<S>\`, carrying \`limit_ms\` through.

Expected output:

\`\`\`text
method      cost_ms  outcome
ping              5  ok in 5ms
report          250  -32001 Request timeout
sum              90  ok in 90ms
export          400  -32001 Request timeout
ping             12  ok in 12ms
requests: 5, reached the backend: 3
\`\`\`

Nothing sleeps: the cost is data on the request and the timeout is a comparison. The last line is the evidence that order is a design decision.`,
    },
  ],

  "backend-rpc-services-5": [
    {
      kind: "theory",
      body: `A concurrency limit is the only knob that actually bounds a service. Threads, connections, database handles — something is finite, and if you do not choose the number the machine chooses it for you badly: a 500-thread pool spending its life in context switches, or a pool exhausted by one slow dependency while every other endpoint on it goes dark.

A limit layer holds a permit count. When the permits are gone it must choose between two policies, and that choice is this lesson:

- **shed** — reject immediately with a documented code from the \`-32000..-32099\` range
- **queue** — hold the request until a permit frees

Both fail the same requests here. Only one of them spends the backend's time doing it.`,
    },
    {
      kind: "theory",
      body: `Queueing does not create capacity. It converts rejection into latency.

Little's Law is \`L = λW\`: at an arrival rate above service capacity, queue length and wait grow without bound. A request that waits 150ms behind a full pool and then runs 150ms has burned the backend's time to produce a 300ms answer for a client whose deadline was 200ms — a client that has already retried, doubling λ.

That is the metastable failure everyone has seen once. The service is not down. It is at 100% utilisation, serving work that will be discarded on arrival, and it will not recover while the retries continue.

Shedding early keeps the admitted requests fast and keeps the failure legible: a documented \`-32002\`, a \`retry_after\`, a client contract that says retryable-with-backoff, and a rejection count you can put on a dashboard. Backpressure is the same idea one level up — a bounded queue whose fullness is a signal that travels back to the producer.`,
    },
    {
      kind: "quiz",
      question:
        "The queue in front of a saturated service is doubled to absorb bursts. What does that buy?",
      options: [
        "A higher latency at which requests fail — it converts fast failures into slow ones and delays recovery",
        "Higher availability, since requests that would have been rejected now succeed",
        "Nothing measurable, because the queue depth does not affect the service rate either way",
      ],
      answer: 0,
      explain:
        "A bigger queue only helps a burst that is short relative to the service rate. Against sustained overload it raises the wait until every admitted request misses its deadline — the exercise shows identical success counts with 320ms of doomed backend work as the only difference.",
    },
    {
      kind: "fill",
      prompt:
        "Before admitting anything, drop the slots whose work has already finished.",
      file: "main.rs",
      before: "busy_until.",
      after: "(|finish| *finish > now);",
      choices: ["retain", "iter", "drain"],
      answer: 0,
      explain:
        "`iter` builds a lazy iterator and mutates nothing, so the pool would fill and never free. `drain` takes a range, not a predicate, and would empty the pool wholesale.",
    },
    {
      kind: "quiz",
      question:
        "A client argues that shedding is worse for them: a rejection is a failure, while a queued request might still succeed. What is the answer?",
      options: [
        "A rejection at 0ms is a retryable answer inside their budget; a timeout at 310ms is a failure that also consumed the server. The two are not the same failure",
        "They are right, and the fix is a longer client deadline so queued requests have time to land",
        "They are right for a single client, but shedding is chosen anyway because server cost outweighs client experience",
      ],
      answer: 0,
      explain:
        "The client's own deadline is the thing that decides this. A request that cannot complete inside the budget has already failed; queueing it only hides when. Shedding returns the budget to the client while it is still spendable — on a retry, a fallback, or a degraded response.",
    },
    {
      kind: "editor",
      intro: `### Shed or queue

Complete \`simulate\`. For each arrival, in order:

1. \`now = req.at_ms\`; \`retain\` only the \`busy_until\` entries still \`> now\`.
2. Full **and** \`shed_early\` → count a rejection, print wait \`0\`, latency \`0\`, backend \`"no"\`, \`"-32002 Server busy"\`, continue.
3. Otherwise start at \`now\` if a slot is free, else at the **earliest** finish time — remove that slot.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`, push \`finish\`.
5. \`latency > DEADLINE_MS\` → count a rejection, add \`req.cost_ms\` to \`doomed_ms\`, \`"-32001 Request timeout"\`; else \`"ok"\`. Backend \`"yes"\` either way.

Expected output:

\`\`\`text
policy: shed early
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0      0        0        no  -32002 Server busy
  4       0      0        0        no  -32002 Server busy
  5      10      0        0        no  -32002 Server busy
failed: 3, backend-ms spent on doomed work: 0

policy: queue everything
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0    150      300       yes  -32001 Request timeout
  4       0    150      300       yes  -32001 Request timeout
  5      10    290      310       yes  -32001 Request timeout
failed: 3, backend-ms spent on doomed work: 320
\`\`\`

Same two successes, same three failures, 320ms of backend time as the only thing queueing bought.`,
    },
  ],

  "backend-rpc-services-6": [
    {
      kind: "theory",
      body: `A token bucket holds up to \`capacity\` tokens and refills at a fixed rate. A request costs one token; a request that cannot pay is rejected. Two properties fall out, and they are why this is the right shape for an API quota:

- it permits a burst of \`capacity\`, then settles to exactly the refill rate
- it never has a window boundary — a fixed window of 60/minute lets a client send 120 requests in two seconds across the seam

The implementation detail that matters: **do not run a refill timer.** Refill lazily on access from \`(now - last_seen) * rate\`, clamped at capacity.

\`\`\`rust
let earned = (now_ms - self.last_ms) * REFILL_PER_MS;
self.tokens = (self.tokens + earned).min(CAPACITY);
\`\`\`

One arithmetic line, no background task, two integers of state per client. Milli-tokens keep it in integers so there is no floating-point drift, and \`(deficit + rate - 1) / rate\` is the ceiling division that turns a shortfall into a \`retry_after\` the client can honour.`,
    },
    {
      kind: "theory",
      body: `The bucket is per **key**, and choosing the key *is* the policy. Client id, API key, tenant, IP — and keying on IP behind a NAT or a CDN rate-limits a whole office as one client.

That state is also the reason an RPC fleet is only mostly stateless. Run this limiter in-process on 10 nodes behind a round-robin load balancer and a 5/sec limit becomes 50/sec — and it changes every time the fleet autoscales. The options are the real ones:

| approach | cost |
| --- | --- |
| divide the limit by node count | wrong the moment a node dies or is added |
| centralise in Redis | a network round trip in the request path, and a hard dependency |
| approximate distributed counters | correct on average, overshoots on purpose |

Everything *else* in the service should stay genuinely stateless: no session affinity, no in-memory user state. Then any node serves any request and a rolling deploy is not a data migration.`,
    },
    {
      kind: "quiz",
      question:
        "Why refill lazily on access rather than ticking every bucket from a background task?",
      options: [
        "A ticker is O(clients) work per tick for buckets nobody is using; lazy refill is O(1) per request and arithmetically identical",
        "A background task cannot mutate the bucket map safely without a lock, and lazy refill avoids the lock",
        "Lazy refill is more accurate, because a ticker quantises tokens to the tick interval",
      ],
      answer: 0,
      explain:
        "The lock argument is real but secondary — you need one either way. The accuracy argument is wrong: a ticker at 1ms is exact too, it just spends CPU proportional to the number of idle keys to be so.",
    },
    {
      kind: "fill",
      prompt: "Credit the elapsed time, but never above what the bucket holds.",
      file: "main.rs",
      before: "self.tokens = (self.tokens + earned).",
      after: "(CAPACITY);",
      choices: ["min", "max", "rem_euclid"],
      answer: 0,
      explain:
        "`max` would floor the bucket at capacity, so a client idle for a second would get infinite budget. Without the clamp entirely, a client idle for an hour arrives with 18,000 tokens and the burst limit means nothing.",
    },
    {
      kind: "quiz",
      question:
        "The limiter runs in-process, holds only two integers per client, and the service is described as horizontally scalable. What is wrong with that description?",
      options: [
        "Per-node buckets multiply the configured limit by the node count and drift with autoscaling — the limit in your API docs is not the limit you enforce",
        "Nothing — per-node limiting is exact as long as the load balancer is round-robin",
        "The bucket state makes the nodes stateful, so a rolling deploy will drop in-flight requests",
      ],
      answer: 0,
      explain:
        "A rolling deploy losing bucket state is harmless — clients come back with full buckets, which errs toward the customer. The multiplication is the bug: 10 nodes enforcing 5/sec each is 50/sec, and 30 nodes is 150/sec, silently, on the day you scale up.",
    },
    {
      kind: "editor",
      intro: `### A token bucket per client

1. \`Bucket::new\` starts a client full: \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\` credits \`(now_ms - self.last_ms) * REFILL_PER_MS\`, clamps at \`CAPACITY\`, stores \`last_ms\`.
3. \`take\` subtracts \`COST\` and returns \`Ok(self.tokens)\` when there is enough; otherwise returns \`Err\` carrying \`(deficit + REFILL_PER_MS - 1) / REFILL_PER_MS\` — the milliseconds until one whole token exists. A denial spends nothing.

Expected output:

\`\`\`text
  t_ms client   before   after  outcome
     0 alice     5.000   4.000  allowed
     0 alice     4.000   3.000  allowed
     0 alice     3.000   2.000  allowed
     0 alice     2.000   1.000  allowed
     0 alice     1.000   0.000  allowed
     0 alice     0.000   0.000  -32005 Rate limit exceeded, retry_after_ms=200
   200 alice     1.000   0.000  allowed
   250 alice     0.250   0.250  -32005 Rate limit exceeded, retry_after_ms=150
   250 bob       5.000   4.000  allowed
  1500 alice     5.000   4.000  allowed
final alice: 4.000 tokens
final bob: 4.000 tokens
\`\`\`

A burst of five, then exactly the refill rate. At t=1500 alice is at capacity, not above it.`,
    },
  ],

  "backend-rpc-services-7": [
    {
      kind: "theory",
      body: `\`offset=3&limit=3\` means "count three rows from the start of the collection **as it exists right now**". That is a promise you cannot keep across more than one request.

Delete one row between page 1 and page 2 and every row after it shifts down one. Page 2 starts one row late, and a row the client has never seen is skipped **forever** — no error, no gap in the output, nothing to alert on. An insert produces the mirror bug: a duplicate.

A cursor is an opaque token encoding the last row's position in a stable total order:

\`\`\`sql
SELECT * FROM rows WHERE id > $cursor ORDER BY id LIMIT 3
\`\`\`

The next page is defined by content, not by a count, so edits before the cursor cannot shift it. Two contract details: order by something **unique** — \`created_at\` alone loses rows sharing a timestamp, so the key is \`(created_at, id)\` — and keep the token opaque (base64 the tuple) so you can change what is inside it without breaking clients.

Termination is part of the contract: \`next_cursor\` is **absent** on the last page. That, not an empty page, is how a client knows it is done.

The cost argument for cursors — that \`OFFSET\` is O(offset + limit) and a keyset seek is O(log n + limit) at any depth — is the subject of *The Data Layer*, lesson 4. This lesson is about the other half: what the two contracts promise a client whose collection is changing underneath it.`,
    },
    {
      kind: "theory",
      body: `The rest of the contract, in three parts.

**Versioning.** Additive changes — a new optional field, a new method — need no version. A removed field or a changed type does. The cheapest mechanism in JSON-RPC is the method name itself: \`user.get\` and \`user.get.v2\`, which versions per endpoint instead of freezing the whole API on its slowest consumer. Deprecate on a published date with per-client usage metrics, not on a hope.

**Request IDs.** Generate one at the edge if the client did not send one, echo it in every response, and put it in every log line and every downstream call. It is the only thing that lets you reconstruct one request's path across a fleet, and it costs a header.

**Error schemas.** The \`data\` member of a JSON-RPC error is where machine-readable detail belongs — which field failed, \`retryable: true\`, a \`retry_after_ms\`. It should be as stable as your success types, because clients branch on it.`,
    },
    {
      kind: "quiz",
      question:
        "An engineer defends OFFSET paging: the sort is deterministic, so the pages are deterministic. What is wrong?",
      options: [
        "Determinism of the sort is not the problem — the collection mutating under a multi-request walk is, and a delete before the offset silently skips a row",
        "The sort is not deterministic, because ties in the sort key are ordered arbitrarily by the planner",
        "Nothing is wrong as long as the query runs inside a single repeatable-read transaction",
      ],
      answer: 0,
      explain:
        "Tie-breaking is a real and separate bug, and a long-lived snapshot transaction does fix correctness at the cost of holding a read view open across client think-time. Neither is the argument: the offset walk is wrong even with a perfect unique sort, because the count it is based on changed.",
    },
    {
      kind: "fill",
      prompt:
        "The next cursor is the position of the last row this page delivered.",
      file: "main.rs",
      before: "let next = if page.len() == limit { page.",
      after: "().copied() } else { None };",
      choices: ["last", "first", "iter().next"],
      answer: 0,
      explain:
        "`first` (and `iter().next`) hands back a cursor the client has already walked past, so the next page re-delivers everything after row one — an infinite loop that looks like it is making progress.",
    },
    {
      kind: "quiz",
      question:
        "A client pages until it receives an empty page. What breaks?",
      options: [
        "It makes one wasted round trip every walk, and it breaks the moment a page is short for any other reason — a correct contract signals termination with an absent next_cursor",
        "Nothing — an empty page is the standard termination signal for cursor pagination",
        "It double-counts the last page, because the empty response still carries a cursor",
      ],
      answer: 0,
      explain:
        "Pages go short for reasons other than the end: a filter applied after the limit, a row the caller is not authorised to see, a soft-deleted record. A client that treats short-but-not-empty as 'keep going' is fine; one that treats it as the end is not — which is why the cursor, not the page length, is the signal.",
    },
    {
      kind: "editor",
      intro: `### Prove OFFSET drops a row

1. \`page_by_offset\` → \`skip(offset).take(limit)\`, counting from the start of whatever table it is handed.
2. \`page_by_cursor\` → ids strictly greater than the cursor (all of them when \`after\` is \`None\`), \`take(limit)\`, returning the page plus its next cursor: the page's **last** id when \`page.len() == limit\`, and \`None\` when the page was short.
3. \`missed\` → the surviving rows that never appeared on any page.

\`main\` deletes row 2 between page 1 and page 2 for both clients.

Expected output:

\`\`\`text
api=v1  page_size=3  row 2 is deleted between page 1 and page 2
client     req_id   argument     page
offset     a-1      offset=0     [1, 2, 3]
offset     a-2      offset=3     [5, 6, 7]
offset     a-3      offset=6     [8, 9]
cursor     b-1      after=start  [1, 2, 3]
cursor     b-2      after=3      [4, 5, 6]
cursor     b-3      after=6      [7, 8, 9]
rows still in the table: [1, 3, 4, 5, 6, 7, 8, 9]
offset client never saw: [4]
cursor client never saw: []
\`\`\`

Row 4 is still in the table and appeared on no page. That is the bug, named.`,
    },
  ],
};
