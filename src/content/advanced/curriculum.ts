// The Advanced Path — Rust systems engineering, for people who already ship.
//
// WHY THIS EXISTS, AND WHY IT LOOKS NOTHING LIKE THE CAMPAIGN
// ----------------------------------------------------------
// The Campaign (`src/content/campaign.ts`) wraps tracks in a D&D narrative:
// Acts, territories, overlords, champion cards, "the old Forgeborn". That
// framing earns its keep for a newcomer who needs a reason to come back on
// day three. It actively costs us with the reader this path is for — a
// senior backend engineer who wants to know what `Ordering::Acquire`
// guarantees and has no patience for a wizard telling them.
//
// So this path carries NO narrative layer at all. No act, no numeral, no
// card, no sigil, no flavour text. A lesson title says what it teaches. The
// prose says the true thing in the fewest words that still teach it. If you
// are tempted to add a metaphor here, add a diagram instead.
//
// Deliberately OUTSIDE `acts`: that keeps the campaign's unlock ratchet, the
// champion-card economy and the pt/es/fr parity gate in `check-i18n.ts`
// untouched by everything below. These tracks are `active`, so they need no
// unlock at all — an advanced reader lands and starts.
//
// CALIBRATION
// -----------
// The syllabus is cut against a real job: SDF's Backend Engineer
// (Integrations & APIs), whose stated requirements are Rust/C++ systems
// work, RPC/API services at real scale, database architecture and indexing,
// and ownership of production infrastructure. Every track below names which
// of those it serves. That is the promise on the index page, so it must stay
// true as content lands.
//
// SLUGS ARE FOREVER. `Lesson.slug` keys `Progress`, and `XpEvent.sourceKey`
// keys the XP anti-replay guard. Renaming one orphans finished work and
// re-opens an XP grant. Titles and prose are free to change; slugs are not.

export type AdvancedTrackStatus = "active" | "soon";

export interface AdvancedLesson {
  /** Stable forever — see the slug warning above. */
  slug: string;
  title: string;
  /** One line, shown on the track page. Says what you can do after it. */
  summary: string;
}

export interface AdvancedTrack {
  slug: string;
  title: string;
  /** Two or three sentences. No story. What it teaches and why it matters. */
  description: string;
  /**
   * Which requirement of the target role this track serves. Rendered as a
   * chip on the index so the reader can pick by their own gap.
   */
  serves: string;
  estHours: number;
  tags: string[];
  status: AdvancedTrackStatus;
  /** Empty while `status: "soon"` — the syllabus is the promise until then. */
  lessons: AdvancedLesson[];
  /** Shown for `soon` tracks so the reader knows exactly what is coming. */
  syllabus?: string[];
}

export const advancedTracks: AdvancedTrack[] = [
  // ── 1 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-ownership-deep",
    title: "Ownership, Moves & Drops",
    description:
      "The model the borrow checker is actually enforcing. Where a value lives, when it moves, when it is copied instead, and the exact point it is destroyed.",
    serves: "Rust/C++ systems programming",
    estHours: 3.5,
    tags: ["ownership", "move", "drop", "memory"],
    status: "active",
    lessons: [
      {
        slug: "rust-ownership-deep-1",
        title: "Stack, Heap & Who Owns What",
        summary:
          "Read a value's real memory layout and say which part lives where.",
      },
      {
        slug: "rust-ownership-deep-2",
        title: "Move vs Copy",
        summary:
          "Predict whether an assignment moves or copies — and prove it compiles.",
      },
      {
        slug: "rust-ownership-deep-3",
        title: "Partial Moves",
        summary:
          "Move one field out of a struct and keep using the rest, legally.",
      },
      {
        slug: "rust-ownership-deep-4",
        title: "Borrowing Rules in Practice",
        summary:
          "Fix aliasing errors by narrowing scope instead of reaching for clone().",
      },
      {
        slug: "rust-ownership-deep-5",
        title: "Reborrowing & Deref Coercion",
        summary:
          "Explain why &mut T passes to a &T parameter, and why String passes as &str.",
      },
      {
        slug: "rust-ownership-deep-6",
        title: "Drop Order & RAII",
        summary:
          "Predict destruction order, and release a resource without a close() call.",
      },
    ],
  },

  // ── 2 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-lifetimes",
    title: "Lifetimes",
    description:
      "Annotations stop being noise once you read them as a constraint between inputs and outputs. Elision, structs that hold references, 'static, and what a bound really promises.",
    serves: "Rust/C++ systems programming",
    estHours: 3,
    tags: ["lifetimes", "borrowck", "'static"],
    status: "active",
    lessons: [
      {
        slug: "rust-lifetimes-1",
        title: "What a Lifetime Actually Says",
        summary:
          "Read 'a as a relationship between arguments, not a duration.",
      },
      {
        slug: "rust-lifetimes-2",
        title: "Elision Rules",
        summary:
          "Say which signatures need no annotation, and why yours does.",
      },
      {
        slug: "rust-lifetimes-3",
        title: "Multiple Lifetimes",
        summary:
          "Annotate a function whose output borrows from only one of two inputs.",
      },
      {
        slug: "rust-lifetimes-4",
        title: "Structs That Hold References",
        summary:
          "Build a zero-copy parser view over a buffer you do not own.",
      },
      {
        slug: "rust-lifetimes-5",
        title: "'static: Two Different Meanings",
        summary:
          "Distinguish a &'static str from a T: 'static bound — they are not the same claim.",
      },
    ],
  },

  // ── 3 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-traits-generics",
    title: "Traits, Generics & Dispatch",
    description:
      "How Rust reuses code without inheritance. Bounds, associated types, blanket impls, and the real cost difference between a generic and a dyn Trait.",
    serves: "Rust/C++ systems programming",
    estHours: 4,
    tags: ["traits", "generics", "dyn", "dispatch"],
    status: "active",
    lessons: [
      {
        slug: "rust-traits-generics-1",
        title: "Defining & Implementing a Trait",
        summary: "Write a trait with a default method and override it.",
      },
      {
        slug: "rust-traits-generics-2",
        title: "Trait Bounds & where Clauses",
        summary:
          "Constrain a generic so the body compiles, without over-constraining it.",
      },
      {
        slug: "rust-traits-generics-3",
        title: "Associated Types vs Generic Parameters",
        summary:
          "Choose correctly between them, and say why Iterator uses one and not the other.",
      },
      {
        slug: "rust-traits-generics-4",
        title: "Static Dispatch & Monomorphization",
        summary:
          "Explain what the compiler emits for a generic function, and what it costs.",
      },
      {
        slug: "rust-traits-generics-5",
        title: "Trait Objects & the Vtable",
        summary:
          "Store mixed types behind Box<dyn Trait> and name the runtime cost.",
      },
      {
        slug: "rust-traits-generics-6",
        title: "Object Safety",
        summary:
          "Predict which traits can become trait objects before the compiler tells you.",
      },
      {
        slug: "rust-traits-generics-7",
        title: "Blanket Impls & the Orphan Rule",
        summary:
          "Implement a trait for every type that satisfies a bound — and know when you may not.",
      },
    ],
  },

  // ── 4 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-error-handling",
    title: "Errors That Survive Production",
    description:
      "Result end to end: propagation, conversion, custom error types that carry cause, and an explicit policy for when a panic is correct and when it is an outage.",
    serves: "Ownership of production infrastructure",
    estHours: 3,
    tags: ["result", "errors", "panic", "from"],
    status: "active",
    lessons: [
      {
        slug: "rust-error-handling-1",
        title: "Result and the ? Operator",
        summary: "Propagate failure without a single match statement.",
      },
      {
        slug: "rust-error-handling-2",
        title: "Custom Error Types",
        summary: "Model your failures as an enum instead of a String.",
      },
      {
        slug: "rust-error-handling-3",
        title: "From, Into & Automatic Conversion",
        summary: "Make ? convert a foreign error into yours for free.",
      },
      {
        slug: "rust-error-handling-4",
        title: "Display, Debug & std::error::Error",
        summary:
          "Write the two messages an error owes you: the operator's and the log's.",
      },
      {
        slug: "rust-error-handling-5",
        title: "Error Chaining & source()",
        summary: "Keep the cause attached so a log line ends an investigation.",
      },
      {
        slug: "rust-error-handling-6",
        title: "When panic! Is Correct",
        summary:
          "Draw the line between a bug and a condition — and stop unwrapping across it.",
      },
    ],
  },

  // ── 5 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-collections-iterators",
    title: "Collections, Iterators & Closures",
    description:
      "Picking the right container on complexity rather than habit, then expressing the transformation lazily. Includes the Fn/FnMut/FnOnce distinction that decides what a closure may capture.",
    serves: "Rust/C++ systems programming",
    estHours: 4,
    tags: ["vec", "hashmap", "btreemap", "iterator", "closures"],
    status: "active",
    lessons: [
      {
        slug: "rust-collections-iterators-1",
        title: "Vec, VecDeque & Growth",
        summary:
          "Choose between them on push/pop position, and stop reallocating in a hot loop.",
      },
      {
        slug: "rust-collections-iterators-2",
        title: "HashMap vs BTreeMap",
        summary:
          "Pick on ordering and complexity, not on which one you typed last time.",
      },
      {
        slug: "rust-collections-iterators-3",
        title: "iter, iter_mut & into_iter",
        summary:
          "Say what each one hands you, and what it does to the collection.",
      },
      {
        slug: "rust-collections-iterators-4",
        title: "Adapters & Laziness",
        summary:
          "Chain map/filter/filter_map and explain why nothing ran until collect.",
      },
      {
        slug: "rust-collections-iterators-5",
        title: "fold, reduce & Custom Aggregation",
        summary: "Replace a mutable accumulator loop with one expression.",
      },
      {
        slug: "rust-collections-iterators-6",
        title: "Fn, FnMut & FnOnce",
        summary:
          "Predict which trait a closure implements from what it captures.",
      },
      {
        slug: "rust-collections-iterators-7",
        title: "move Closures & Escaping Captures",
        summary:
          "Hand a closure to something that outlives its scope, correctly.",
      },
    ],
  },

  // ── 6 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-smart-pointers",
    title: "Smart Pointers & Interior Mutability",
    description:
      "Box, Rc, RefCell, Cow and Weak — what each one buys, what it costs, and the compile-time versus runtime borrow distinction that decides which one you actually need.",
    serves: "Rust/C++ systems programming",
    estHours: 3.5,
    tags: ["box", "rc", "refcell", "cow", "weak"],
    status: "active",
    lessons: [
      {
        slug: "rust-smart-pointers-1",
        title: "Box<T> & Recursive Types",
        summary: "Give a recursive enum a known size.",
      },
      {
        slug: "rust-smart-pointers-2",
        title: "Rc<T> & Shared Ownership",
        summary: "Share one allocation between several owners on one thread.",
      },
      {
        slug: "rust-smart-pointers-3",
        title: "RefCell<T> & Runtime Borrowing",
        summary:
          "Move a borrow check from compile time to runtime — and accept the panic that buys.",
      },
      {
        slug: "rust-smart-pointers-4",
        title: "Weak<T> & Reference Cycles",
        summary: "Build a parent/child graph that actually gets freed.",
      },
      {
        slug: "rust-smart-pointers-5",
        title: "Cow<T> & Allocating Only When You Must",
        summary: "Return borrowed data on the common path, owned on the rare one.",
      },
      {
        slug: "rust-smart-pointers-6",
        title: "Deref, DerefMut & Custom Pointers",
        summary: "Make your own wrapper behave like the thing it wraps.",
      },
    ],
  },

  // ── 7 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-concurrency",
    title: "Threads, Send/Sync & Shared State",
    description:
      "The core of any RPC service under real load. Threads, the two auto traits that make sharing sound, Arc<Mutex<T>> and its alternatives, atomics with honest memory ordering, and channels.",
    serves: "RPC/API services at high scale",
    estHours: 5,
    tags: ["threads", "send", "sync", "arc", "mutex", "atomics", "channels"],
    status: "active",
    lessons: [
      {
        slug: "rust-concurrency-1",
        title: "Spawning & Joining Threads",
        summary: "Run work in parallel and collect every result deterministically.",
      },
      {
        slug: "rust-concurrency-2",
        title: "Send & Sync",
        summary:
          "Say why Rc is not Send and Arc is, from the definition rather than from memory.",
      },
      {
        slug: "rust-concurrency-3",
        title: "Arc<T>: Shared Ownership Across Threads",
        summary: "Share read-only state with N workers at the cost of one atomic.",
      },
      {
        slug: "rust-concurrency-4",
        title: "Mutex, Guards & Poisoning",
        summary:
          "Mutate shared state safely, and keep the critical section short on purpose.",
      },
      {
        slug: "rust-concurrency-5",
        title: "RwLock & Read-Heavy State",
        summary:
          "Choose RwLock over Mutex on evidence, and name the starvation risk you took.",
      },
      {
        slug: "rust-concurrency-6",
        title: "Deadlocks & Lock Ordering",
        summary: "Reproduce a deadlock, then remove it with a global lock order.",
      },
      {
        slug: "rust-concurrency-7",
        title: "Atomics & Memory Ordering",
        summary:
          "Use fetch_add and compare_exchange, and justify Relaxed vs Acquire/Release.",
      },
      {
        slug: "rust-concurrency-8",
        title: "Channels & Backpressure",
        summary:
          "Wire a producer/consumer with mpsc and explain what a bounded channel buys.",
      },
    ],
  },

  // ── 8 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-async-internals",
    title: "Async From First Principles",
    description:
      "Built up from the poll loop, not down from an attribute macro. You write a Future by hand, build a working block_on with a real Waker, and only then look at what Tokio adds on top.",
    serves: "RPC/API services at high scale",
    estHours: 4.5,
    tags: ["async", "future", "waker", "executor", "cancellation"],
    status: "active",
    lessons: [
      {
        slug: "rust-async-internals-1",
        title: "A Future Is a Poll Function",
        summary: "Implement Future by hand and see there is no magic in it.",
      },
      {
        slug: "rust-async-internals-2",
        title: "Nothing Runs Without an Executor",
        summary:
          "Prove that an un-awaited future does exactly nothing, and say why that is a feature.",
      },
      {
        slug: "rust-async-internals-3",
        title: "Build block_on",
        summary: "Write a real executor: Waker, RawWaker and a park/unpark loop.",
      },
      {
        slug: "rust-async-internals-4",
        title: "Cooperative Scheduling & Blocking Calls",
        summary:
          "Explain why one blocking call stalls an entire runtime thread.",
      },
      {
        slug: "rust-async-internals-5",
        title: "Cancellation Is a Drop",
        summary:
          "Make cleanup correct when a client disconnects mid-request.",
      },
      {
        slug: "rust-async-internals-6",
        title: "Timeouts & Select",
        summary:
          "Race a future against a deadline, and say which side won and what leaked.",
      },
      {
        slug: "rust-async-internals-7",
        title: "What Tokio Adds",
        summary:
          "Map every piece you built to its Tokio equivalent: spawn, JoinHandle, select!, spawn_blocking.",
      },
    ],
  },

  // ── 9 ──────────────────────────────────────────────────────────────────
  {
    slug: "rust-systems-edges",
    title: "Macros, Unsafe, FFI & Money",
    description:
      "The four edges a systems reviewer is expected to hold: what a derive expands to, what an unsafe block promises, what crossing into C++ costs, and why a float must never hold a balance.",
    serves: "Rust/C++ systems programming",
    estHours: 4,
    tags: ["macros", "unsafe", "ffi", "overflow", "modules"],
    status: "active",
    lessons: [
      {
        slug: "rust-systems-edges-1",
        title: "Modules, Visibility & Crate Layout",
        summary:
          "Use mod, pub and pub(crate) to make an invariant unbreakable from outside.",
      },
      {
        slug: "rust-systems-edges-2",
        title: "macro_rules! & Declarative Macros",
        summary: "Write a macro that a function could not have replaced.",
      },
      {
        slug: "rust-systems-edges-3",
        title: "Derive & Procedural Macros",
        summary:
          "Say what #[derive(Debug, Clone)] actually generates, and where Serde fits.",
      },
      {
        slug: "rust-systems-edges-4",
        title: "unsafe: The Contract",
        summary:
          "State the invariant an unsafe block assumes — the skill a reviewer is paid for.",
      },
      {
        slug: "rust-systems-edges-5",
        title: "Raw Pointers & Aliasing",
        summary:
          "Handle *const/*mut T and name the guarantee you just gave up.",
      },
      {
        slug: "rust-systems-edges-6",
        title: "FFI, extern \"C\" & the ABI Boundary",
        summary:
          "Pass ownership across a C boundary without leaking or double-freeing it.",
      },
      {
        slug: "rust-systems-edges-7",
        title: "Integer Money & Checked Arithmetic",
        summary:
          "Handle a balance in fixed-point integers, and pick between checked, saturating and wrapping deliberately.",
      },
    ],
  },

  // ── Declared, not yet authored ─────────────────────────────────────────
  // These are the non-Rust half of the same role. They are theory-led by
  // nature (no std-only Rust program can grade a query plan), so they need
  // an authoring mode the Forge sandbox does not provide — that is why they
  // are `soon` rather than thin. The syllabus is published so a reader can
  // see the whole road before deciding to start it.
  {
    slug: "backend-rpc-services",
    title: "RPC Services at Scale",
    description:
      "The service in front of the network: JSON-RPC 2.0 done exactly, Serde at the edge, Tower layers for timeout and rate limiting, and the architecture questions an interview will actually ask.",
    serves: "RPC/API services at high scale",
    estHours: 5,
    tags: ["json-rpc", "serde", "tower", "axum", "rate-limiting"],
    status: "active",
    lessons: [
      {
        slug: "backend-rpc-services-1",
        title: "The JSON-RPC 2.0 Envelope and Its Five Error Codes",
        summary:
          "Classify any inbound request into the right JSON-RPC error code, and know the two cases where the response id must be null rather than echoed.",
      },
      {
        slug: "backend-rpc-services-2",
        title: "Notifications, Batches and the Requests You Must Not Answer",
        summary:
          "Implement the two rules that break naive JSON-RPC servers: a notification gets no response at all, and an empty batch is itself an invalid request.",
      },
      {
        slug: "backend-rpc-services-3",
        title: "A Method Dispatch Table of Boxed Handlers",
        summary:
          "Build a router from a HashMap of boxed closures, and separate the three failures a call can have: no such method, bad arguments, handler blew up.",
      },
      {
        slug: "backend-rpc-services-4",
        title: "Service and Layer: Building Tower From Two Traits",
        summary:
          "Write the two traits the whole Tower ecosystem is made of, then wrap a backend in a timeout and prove the timed-out requests never reach it.",
      },
      {
        slug: "backend-rpc-services-5",
        title: "Concurrency Limits and Load Shedding",
        summary:
          "Simulate the same overload under two admission policies and read off what queueing actually costs: the same successes, plus 320ms of backend time spent on responses nobody can use.",
      },
      {
        slug: "backend-rpc-services-6",
        title: "A Token-Bucket Rate Limiter on a Simulated Clock",
        summary:
          "Implement per-client token buckets with lazy refill, return a retry_after the client can act on, and see why the limit you configure is not the limit your fleet enforces.",
      },
      {
        slug: "backend-rpc-services-7",
        title: "Pagination Contracts: Cursors, Offsets and Request IDs",
        summary:
          "Prove that OFFSET paging silently drops rows when the collection changes mid-walk, and write the cursor contract that does not.",
      },
    ],
  },
  {
    slug: "backend-data-layer",
    title: "The Data Layer",
    description:
      "Database architecture as the role describes it: indexing and query patterns first, then the Rust side — pools, transactions and prepared statements.",
    serves: "Database architecture, indexing & query patterns",
    estHours: 5,
    tags: ["sql", "indexes", "transactions", "postgres", "pools"],
    status: "active",
    lessons: [
      {
        slug: "backend-data-layer-1",
        title: "Index Scan vs Seq Scan: Rows Examined",
        summary:
          "Count rows examined for both plans and say which one the numbers favour.",
      },
      {
        slug: "backend-data-layer-2",
        title: "Composite Indexes & the Leftmost Prefix",
        summary:
          "Say which predicate sets a composite index can serve, and which it only filters.",
      },
      {
        slug: "backend-data-layer-3",
        title: "The Cost Model Behind EXPLAIN",
        summary:
          "Price an index scan against a seq scan and predict the planner's choice.",
      },
      {
        slug: "backend-data-layer-4",
        title: "Cursor Pagination vs OFFSET",
        summary: "Replace OFFSET with a keyset cursor and quantify what it saves.",
      },
      {
        slug: "backend-data-layer-5",
        title: "Isolation Levels & the Anomalies They Permit",
        summary:
          "Name which anomaly each isolation level permits, and prove it with a trace.",
      },
      {
        slug: "backend-data-layer-6",
        title: "Transactions, Rollback & Prepared Statements",
        summary:
          "Implement commit and rollback, and say what a prepared statement actually reuses.",
      },
      {
        slug: "backend-data-layer-7",
        title: "Connection Pools & Where Latency Goes",
        summary:
          "Read queue wait out of a pool simulation and size a pool for a reason.",
      },
    ],
  },
  {
    slug: "backend-indexers-distsys",
    title: "Indexers & Distributed Systems",
    description:
      "The path a transaction takes from client to consensus and back, and the indexer that makes it queryable. Cursors, replay, idempotency and the failure modes that only appear at scale.",
    serves: "Blockchain infrastructure in production",
    estHours: 5,
    tags: ["indexer", "consensus", "idempotency", "replay", "cap"],
    status: "active",
    lessons: [
      {
        slug: "backend-indexers-distsys-1",
        title: "The Indexer Pipeline and a Cursor That Survives Restart",
        summary:
          "Build the four-stage pipeline — ledger source, cursor, processor, store — and restart it mid-stream without losing or repeating work.",
      },
      {
        slug: "backend-indexers-distsys-2",
        title: "Commit the Cursor After the Effect, Never Before",
        summary:
          "Inject a crash between the two writes and measure both orderings: cursor-first silently loses an event, effect-first duplicates one — and only one of those is recoverable.",
      },
      {
        slug: "backend-indexers-distsys-3",
        title: "Idempotency Under At-Least-Once Delivery",
        summary:
          "Process a stream that duplicates and reorders events, twice over, and land on exactly the state a perfect exactly-once feed would have produced.",
      },
      {
        slug: "backend-indexers-distsys-4",
        title: "Surviving a Reorg: Roll Back to the Fork, Reapply the Branch",
        summary:
          "Detect that an incoming block forks below your head, unwind the orphaned blocks in reverse height order, and reapply the winning branch.",
      },
      {
        slug: "backend-indexers-distsys-5",
        title: "Transaction Status as a State Machine That Rejects",
        summary:
          "Encode Received/Validating/Submitted/Pending/Confirmed/Failed as a transition table whose default arm refuses illegal moves and leaves the state untouched.",
      },
      {
        slug: "backend-indexers-distsys-6",
        title: "Quorum Arithmetic: R + W > N, and What a Partition Does to It",
        summary:
          "Compute which (N, R, W) configurations guarantee a read sees the last write, then run a 3|2 partition and watch the minority side refuse both reads and writes.",
      },
      {
        slug: "backend-indexers-distsys-7",
        title: "Ordering Events Without a Clock: Lamport and Vector Stamps",
        summary:
          "Stamp a distributed event trace with both clock types and show the pair where Lamport reports an order that causality does not support.",
      },
    ],
  },
  {
    slug: "backend-production",
    title: "Running It in Production",
    description:
      "What separates a prototype from infrastructure someone is paged for: observability, honest percentiles, load testing, graceful shutdown and a reliability posture you can defend.",
    serves: "Ownership of production infrastructure",
    estHours: 4.5,
    tags: ["tracing", "metrics", "p99", "load-testing", "reliability"],
    status: "active",
    lessons: [
      {
        slug: "backend-production-1",
        title: "Counters, Gauges & Histograms",
        summary:
          "Pick the right instrument for a question, and see what each one cannot answer.",
      },
      {
        slug: "backend-production-2",
        title: "Percentiles From Buckets, and Why You Cannot Average Them",
        summary:
          "Compute p50/p95/p99 from bucket counts, and merge two instances without lying.",
      },
      {
        slug: "backend-production-3",
        title: "Structured Logs & a Correlation ID",
        summary:
          "Thread one ID through a call chain and reconstruct a single request out of an interleaved stream.",
      },
      {
        slug: "backend-production-4",
        title: "Backoff, Jitter & a Retry Budget",
        summary:
          "Bound retry amplification with a budget instead of hoping the dependency recovers.",
      },
      {
        slug: "backend-production-5",
        title: "A Circuit Breaker as a State Machine",
        summary:
          "Stop sending traffic into a dead dependency, and probe it back to life without a stampede.",
      },
      {
        slug: "backend-production-6",
        title: "Graceful Shutdown: Drain, Deadline, Force-Close",
        summary:
          "Take a pod out of rotation and finish its in-flight work without a deploy dropping requests.",
      },
      {
        slug: "backend-production-7",
        title: "Little's Law: A Latency Target Is a Concurrency Limit",
        summary:
          "Turn a latency SLO into the number of concurrent requests you are allowed to admit.",
      },
    ],
  },
];

export function advancedTrackBySlug(slug: string): AdvancedTrack | undefined {
  return advancedTracks.find((t) => t.slug === slug);
}

/** Every authored lesson slug, in curriculum order. */
export const advancedLessonSlugs: string[] = advancedTracks.flatMap((t) =>
  t.lessons.map((l) => l.slug),
);

export function isAdvancedLesson(slug: string): boolean {
  return advancedLessonSlugs.includes(slug);
}

/** The track a lesson belongs to — used by the player's breadcrumb. */
export function advancedTrackOfLesson(
  lessonSlug: string,
): AdvancedTrack | undefined {
  return advancedTracks.find((t) =>
    t.lessons.some((l) => l.slug === lessonSlug),
  );
}
