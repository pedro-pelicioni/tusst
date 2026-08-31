import type { LessonStep } from "@/content/steps";

// Advanced · Threads, Send/Sync & Shared State.

export const rustConcurrencySteps: Record<string, LessonStep[]> = {
  "rust-concurrency-1": [
    {
      kind: "theory",
      body: `\`thread::spawn\` starts a real OS thread and returns a \`JoinHandle<T>\`, where \`T\` is whatever the closure returns.

\`\`\`rust
let h = thread::spawn(move || id * id);
let value = h.join().unwrap();
\`\`\`

\`join()\` blocks until that thread finishes and gives you its return value — wrapped in a \`Result\`, because the thread may have **panicked**. \`Err\` means the panic; \`unwrap()\` here propagates it into the parent.`,
    },
    {
      kind: "theory",
      body: `Two things about \`spawn\` that shape everything you write with it.

**The closure must be \`'static\`.** The thread may outlive the function that created it, so it may not borrow that function's locals. \`move\` is almost always required, and it is why sharing data means \`Arc\`, not \`&\`.

**Detached threads are killed at exit.** If \`main\` returns without joining, outstanding threads are terminated wherever they are — no unwinding, no destructors. Collecting handles and joining them all is not tidiness, it is how you know the work finished.

\`\`\`rust
for h in handles { results.push(h.join().unwrap()); }
\`\`\`

Joining in spawn order makes the *results* deterministic even though the *execution* was not — which is what makes a parallel computation testable.`,
    },
    {
      kind: "quiz",
      question: "Why does `join()` return a `Result`?",
      options: [
        "The thread may have panicked, and `Err` carries the panic payload rather than losing it",
        "The thread may still be running, and `Err` means 'not finished'",
        "The `Result` reports whether the OS could allocate a thread",
      ],
      answer: 0,
      explain:
        "A panic in a spawned thread does not abort the process by default — it ends that thread. Without checking the `Result` you would silently treat a crashed worker as one that did no work.",
    },
    {
      kind: "fill",
      prompt:
        "Give the thread ownership of the captured value, so it need not borrow a local.",
      file: "main.rs",
      before: "handles.push(thread::spawn(",
      after: "|| id * id));",
      choices: ["move ", "", "&"],
      answer: 0,
      explain:
        "Without `move` the closure borrows `id`, and the compiler rejects it: the thread may outlive the loop iteration that owns it.",
    },
    {
      kind: "quiz",
      question:
        "`main` spawns four workers and returns without joining any. What happens to them?",
      options: [
        "They are killed at process exit, mid-work, with no unwinding and no destructors run",
        "The process waits for every thread before exiting",
        "They are promoted to daemon threads and keep running after exit",
      ],
      answer: 0,
      explain:
        "This is a real source of lost writes and truncated output. Join the handles, or hold something the workers signal before you return.",
    },
    {
      kind: "editor",
      intro: `### Fan out, collect back

1. Spawn four threads, one per \`id\` in \`0..4u32\`, each returning \`id * id\`.
2. Push each \`JoinHandle\` into a \`Vec\`.
3. Join them **in spawn order** into a \`Vec<u32>\`, print it with \`{:?}\`, then print the sum.

Expected output:

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

Execution order is not deterministic; joining in order makes the *result* deterministic anyway.`,
    },
  ],

  "rust-concurrency-2": [
    {
      kind: "theory",
      body: `Two marker traits carry the whole of Rust's thread safety. Neither has any methods — they are claims the compiler checks and then enforces.

**\`Send\`** — the value can be **moved** to another thread.
**\`Sync\`** — the value can be **shared** by reference across threads. Formally: \`T\` is \`Sync\` if and only if \`&T\` is \`Send\`.

They are **auto traits**: a type gets them automatically when all its fields have them. You almost never implement them by hand, and doing so requires \`unsafe\` because you are making a promise the compiler cannot verify.`,
    },
    {
      kind: "theory",
      body: `The instructive cases are the types that have one and not the other.

**\`Rc<T>\`: neither.** Its reference count is a plain integer with non-atomic increments. Two threads cloning at once would race and free the value early — a use-after-free. \`Arc<T>\` is the same type with an atomic counter, and it is both.

**\`Cell<T>\`: \`Send\` but not \`Sync\`.** Moving a whole \`Cell\` to another thread is fine — only one thread has it. *Sharing* \`&Cell\` is not: \`set\` is a plain write, so two threads writing at once race. This is the pair that makes the distinction click.

**\`MutexGuard\`: \`Sync\` but not \`Send\`.** Some platforms require the thread that locked a mutex to be the one that unlocks it, so the guard must not cross threads.

Everything else follows: \`Mutex<T>\` is \`Sync\` when \`T: Send\`, which is exactly why \`Arc<Mutex<T>>\` is the shared-mutable-state type.`,
    },
    {
      kind: "quiz",
      question: "Why is `Cell<T>` `Send` but not `Sync`?",
      options: [
        "Moving the whole cell is fine because only one thread holds it; sharing `&Cell` is not, because `set` is an unsynchronised write",
        "`Cell` contains a lock, and locks cannot be shared",
        "It is `Sync`; only `RefCell` is not",
      ],
      answer: 0,
      explain:
        "This is the cleanest illustration of the split. `Send` is about handing the value over; `Sync` is about two threads touching it at once.",
    },
    {
      kind: "fill",
      prompt:
        "Bound a helper so it only accepts values that may be moved to another thread.",
      file: "main.rs",
      before: "fn assert_send<T: ",
      after: ">(_: &T) -> &'static str {",
      choices: ["Send", "Sync", "Copy"],
      answer: 0,
      explain:
        "The helper never actually moves anything — it exists so the *bound* forces the compiler to prove the property. Calling it with an `Rc` is a compile error, which is the demonstration.",
    },
    {
      kind: "quiz",
      question:
        "You get 'the trait `Send` is not implemented for `Rc<Config>`' on a spawned task. What is the fix?",
      options: [
        "Use `Arc<Config>` — the same shared ownership with an atomic reference count",
        "Wrap the `Rc` in a `Mutex`, which makes any type `Send`",
        "Add `unsafe impl Send for Rc<Config>`",
      ],
      answer: 0,
      explain:
        "`Mutex` does not rescue it: `Mutex<T>` is only `Send`/`Sync` when `T` is `Send`. And the `unsafe impl` would compile and then race — the compiler was right.",
    },
    {
      kind: "editor",
      intro: `### Prove the properties

1. Write \`fn assert_send<T: Send>(_: &T) -> &'static str\` returning \`"Send"\`, and \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` returning \`"Sync"\`.
2. Show \`Arc<u32>\` satisfies both.
3. Create an \`Rc<u32>\` and just print its value — passing it to \`assert_send\` would not compile, and that is the lesson.
4. Show \`Cell<u32>\` satisfies \`Send\`. (It is not \`Sync\`, so do not call \`assert_sync\` on it.)

Expected output:

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\``,
    },
  ],

  "rust-concurrency-3": [
    {
      kind: "theory",
      body: `\`Arc<T>\` is \`Rc<T>\` with an **atomic** reference count. That single difference is what makes it \`Send + Sync\` (when \`T\` is), and it is the standard way to hand the same data to several threads.

\`\`\`rust
let table = Arc::new(big_vec);
for chunk in 0..4 {
    let table = Arc::clone(&table);      // one atomic increment
    thread::spawn(move || { /* reads table */ });
}
\`\`\`

The shadowing \`let table = Arc::clone(&table);\` inside the loop is the idiom: it clones the handle for this iteration, and the \`move\` closure takes that clone rather than the outer binding.`,
    },
    {
      kind: "theory",
      body: `\`Arc<T>\` alone gives **shared read-only access** — it hands out \`&T\`, never \`&mut T\`. For a large lookup table, a config, or a compiled route map, that is exactly what you want and it needs no lock at all.

The cost is honest but small: an atomic increment on clone and an atomic decrement on drop, each of which is a synchronised operation on a cache line every thread shares. Cloning an \`Arc\` in a tight inner loop is measurable; cloning it once per task is not.

For **mutation**, pair it: \`Arc<Mutex<T>>\` or \`Arc<RwLock<T>>\`. The \`Arc\` provides shared ownership across threads, the inner type provides synchronised access. They are orthogonal, and confusing the two is the most common source of "why doesn't this compile" in early concurrent Rust.`,
    },
    {
      kind: "quiz",
      question:
        "What does `Arc<T>` on its own let several threads do with the value?",
      options: [
        "Read it — it hands out `&T` only. Mutation needs an inner `Mutex` or `RwLock`",
        "Read and write it; the atomic count synchronises access",
        "Nothing until it is locked; every `Arc` access takes a lock",
      ],
      answer: 0,
      explain:
        "The atomic count protects the *count*, not the data. `Arc` and `Mutex` solve two different problems and are composed for that reason.",
    },
    {
      kind: "fill",
      prompt: "Give this iteration's thread its own handle to the shared table.",
      file: "main.rs",
      before: "let table = Arc::",
      after: "(&table);",
      choices: ["clone", "new", "get_mut"],
      answer: 0,
      explain:
        "`Arc::new` would allocate a second, unrelated table. `get_mut` returns `Some` only when the count is 1, which is never the case here.",
    },
    {
      kind: "quiz",
      question:
        "After four worker threads have joined, `Arc::strong_count` reads 1 again. Why?",
      options: [
        "Each thread's clone was dropped when its closure ended, decrementing the count back down",
        "`join` resets the count to 1",
        "The count was never above 1; clones share a single counter slot",
      ],
      answer: 0,
      explain:
        "This is `Drop` doing its job across thread boundaries: each moved clone dies with the closure that owned it.",
    },
    {
      kind: "editor",
      intro: `### Share one table with four workers

1. Build \`Arc<Vec<u64>>\` holding \`(1..=1000).collect()\`, print \`Arc::strong_count\`.
2. Spawn four threads. Each takes its own \`Arc::clone\`, and sums a 250-element slice: \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Join them, adding up the partial sums, and print the total.
4. Print the strong count again — it is back to 1.

Expected output:

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\``,
    },
  ],

  "rust-concurrency-4": [
    {
      kind: "theory",
      body: `\`Mutex<T>\` **owns** its data. There is no way to reach the value without locking, so "forgot to take the lock" is not a bug you can write.

\`\`\`rust
let mut guard = counter.lock().unwrap();
*guard += 1;
\`\`\`

\`lock()\` returns \`Result<MutexGuard<T>, PoisonError<_>>\`. The guard derefs to \`&mut T\`, and **releases the lock when it drops**. There is no \`unlock()\`.`,
    },
    {
      kind: "theory",
      body: `The \`Result\` is **poisoning**. If a thread panics while holding the lock, the mutex is marked poisoned and every later \`lock()\` returns \`Err\` — the data may have been left half-updated, and the compiler makes you acknowledge that. \`PoisonError::into_inner()\` gives you the data anyway if you decide it is safe.

The rule that matters in production: **keep the critical section short, and never hold a guard across a slow call.**

\`\`\`rust
let value = { cache.lock().unwrap().get(&key).cloned() };   // released here
expensive_io(value);                                        // no lock held
\`\`\`

The trap is that \`Drop\` runs at end of **scope**, not at last use. A guard you stopped reading is still holding the lock — so scope it deliberately with a block, or bind the value out and drop the guard.`,
    },
    {
      kind: "quiz",
      question: "What does a poisoned `Mutex` mean?",
      options: [
        "A thread panicked while holding the lock, so the data may be half-updated and every later `lock()` returns `Err`",
        "Two threads deadlocked and the runtime broke the cycle",
        "The lock was held longer than a built-in timeout",
      ],
      answer: 0,
      explain:
        "It is a correctness signal, not a liveness one. `into_inner()` lets you take the data anyway once you have decided the invariant survived.",
    },
    {
      kind: "fill",
      prompt: "Release the lock as soon as the value is out.",
      file: "main.rs",
      before: "let value = { cache.lock().unwrap().get(&key).",
      after: "() };",
      choices: ["cloned", "as_ref", "unwrap"],
      answer: 0,
      explain:
        "`cloned()` copies the value out so the guard can die at the closing brace. Returning a reference would keep the guard alive to satisfy the borrow.",
    },
    {
      kind: "quiz",
      question:
        "A handler locks a cache, then makes an HTTP call, then writes the result — all in one scope. What is the symptom under load?",
      options: [
        "Throughput collapses to one request at a time: every other thread waits behind the network call",
        "The mutex poisons because the call takes too long",
        "Nothing — the guard is released at its last use, before the call",
      ],
      answer: 0,
      explain:
        "The last option is the exact misconception that ships this bug. NLL ends *borrows* at last use; `Drop` runs at end of *scope*, and the lock is held for both calls.",
    },
    {
      kind: "editor",
      intro: `### Eight threads, one counter

1. Build \`Arc<Mutex<u64>>\` starting at \`0\`.
2. Spawn eight threads. Each takes its own \`Arc::clone\` and, one thousand times, locks and increments — the guard scoped to a single iteration.
3. Join all eight, then print the final count and whether the mutex \`is_poisoned()\`.

Expected output:

\`\`\`text
count: 8000
poisoned: false
\`\`\`

Eight thousand increments with no lost updates — that is the mutex, not luck.`,
    },
  ],

  "rust-concurrency-5": [
    {
      kind: "theory",
      body: `\`RwLock<T>\` splits the lock in two:

- \`read()\` — **many** readers at once
- \`write()\` — **one** writer, excluding all readers

\`\`\`rust
let len = cache.read().unwrap().len();     // concurrent with other readers
cache.write().unwrap().push(40);           // exclusive
\`\`\`

The API is otherwise identical to \`Mutex\`: guards, poisoning, release on drop.`,
    },
    {
      kind: "theory",
      body: `\`RwLock\` is not a free upgrade, and reaching for it by default is a common mistake.

**It is slower than \`Mutex\` per operation.** It tracks a reader count as well as the write flag, so an uncontended \`read()\` costs more than an uncontended \`lock()\`.

**It only wins when reads genuinely dominate and are slow enough to overlap.** A read that copies one integer finishes before a second thread arrives; you paid for concurrency you never used. A read that walks a large structure while eight threads do the same is where it pays.

**Writer starvation is a real risk.** With a read-preferring implementation and a steady stream of readers, a writer can wait indefinitely. Rust's \`RwLock\` delegates to the OS primitive, so the fairness policy is the platform's, not the standard library's — do not rely on it.

Default to \`Mutex\`. Move to \`RwLock\` when a profile shows read contention, not when the workload merely sounds read-heavy.`,
    },
    {
      kind: "quiz",
      question:
        "A workload is described as 'mostly reads', so `Mutex` is swapped for `RwLock` and nothing gets faster. Why?",
      options: [
        "The reads are too short to overlap — each finishes before the next thread arrives, so only the higher per-operation cost is paid",
        "`RwLock` serialises reads unless they are explicitly batched",
        "The reads must be marked `#[inline]` to run concurrently",
      ],
      answer: 0,
      explain:
        "Concurrency only helps when operations actually overlap in time. For a read that finishes in nanoseconds, the extra bookkeeping is the only thing you bought.",
    },
    {
      kind: "fill",
      prompt: "Take a shared lock so several readers proceed at once.",
      file: "main.rs",
      before: "cache.",
      after: "().unwrap().len()",
      choices: ["read", "write", "lock"],
      answer: 0,
      explain:
        "`write()` would exclude the other readers and serialise them — the exact thing `RwLock` exists to avoid.",
    },
    {
      kind: "quiz",
      question: "What is writer starvation, and who decides whether it happens?",
      options: [
        "A writer waiting indefinitely behind a continuous stream of readers — and the fairness policy comes from the OS primitive, not from std",
        "A writer being poisoned by a reader's panic; std chooses the policy",
        "A writer losing its data when readers hold the lock; the compiler prevents it",
      ],
      answer: 0,
      explain:
        "Because std delegates to the platform, the same code can behave differently on Linux and macOS. That is a good reason not to depend on the policy at all.",
    },
    {
      kind: "editor",
      intro: `### Many readers, one writer

1. Build \`Arc<RwLock<Vec<u64>>>\` holding \`vec![10, 20, 30]\`.
2. Spawn four reader threads, each taking \`read()\` and returning \`.len()\`.
3. Join them, summing the returned lengths, and print the total.
4. Take \`write()\` and push \`40\`, then print the vector through a fresh \`read()\`.

Expected output:

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\``,
    },
  ],

  "rust-concurrency-6": [
    {
      kind: "theory",
      body: `A deadlock needs two threads and two locks acquired in **opposite orders**:

\`\`\`text
thread 1: lock A ─── wants B
thread 2: lock B ─── wants A
\`\`\`

Neither can proceed and neither will time out. Rust prevents data races at compile time; it does **not** prevent deadlocks, because a deadlock is not unsound — it is a liveness bug, and the type system has nothing to say about it.

A transfer function is the canonical way to write one by accident: \`transfer(a, b)\` and \`transfer(b, a)\` running at once acquire in opposite orders.`,
    },
    {
      kind: "theory",
      body: `The fix is a **global lock order**: pick a total ordering over your locks and always acquire in that order, regardless of the operation's own direction.

\`\`\`rust
let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };
let g1 = first.balance.lock().unwrap();
let g2 = second.balance.lock().unwrap();
\`\`\`

Now every thread acquires the lower id first, so the cycle cannot form. Any stable key works — an id, an index, even the pointer address.

Two supporting tactics. **Hold one lock at a time** where the algorithm permits, since a single lock cannot deadlock against itself. And **\`try_lock\` with a back-off** turns a potential deadlock into a retry — useful as a safety net, but a poor substitute for an ordering, since it can livelock instead.`,
    },
    {
      kind: "quiz",
      question:
        "Why does Rust's type system prevent data races but not deadlocks?",
      options: [
        "A deadlock is a liveness bug, not unsoundness — nothing is corrupted, the program simply stops",
        "Deadlocks are prevented, but only in release builds",
        "The borrow checker would prevent them if `Mutex` were used without `Arc`",
      ],
      answer: 0,
      explain:
        "`Send`/`Sync` and the borrow rules make it impossible to *observe torn data*. Waiting forever is perfectly memory-safe, and no static analysis in the language is trying to catch it.",
    },
    {
      kind: "fill",
      prompt:
        "Impose a global order so two opposing transfers cannot form a cycle.",
      file: "main.rs",
      before: "let (first, second) = if from.id ",
      after: " to.id { (from, to) } else { (to, from) };",
      choices: ["<", "==", "!="],
      answer: 0,
      explain:
        "Any total order works; what matters is that every thread applies the *same* one. Comparing for equality or inequality gives no ordering at all.",
    },
    {
      kind: "quiz",
      question:
        "Why is `try_lock` with retry a weaker answer than a global lock order?",
      options: [
        "It can livelock — threads repeatedly grab and release without progress — where an ordering makes the cycle impossible",
        "`try_lock` is unsafe and requires an `unsafe` block",
        "`try_lock` poisons the mutex on failure",
      ],
      answer: 0,
      explain:
        "Retry is a reasonable safety net, especially with randomised back-off. As the primary strategy it converts a hang you can debug into a spin you cannot.",
    },
    {
      kind: "editor",
      intro: `### Order the locks

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — order the two accounts by \`id\`, lock the lower first, then apply the debit and credit to the right sides.
3. Build accounts \`1\` (balance \`100\`) and \`2\` (balance \`50\`) in \`Arc\`s.
4. Spawn 100 threads: 50 transferring \`1\` from a to b, 50 transferring \`1\` from b to a. Join them all.
5. Print each balance and the total.

Expected output:

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Without the ordering this program deadlocks. With it, the net is zero and the total is conserved.`,
    },
  ],

  "rust-concurrency-7": [
    {
      kind: "theory",
      body: `An atomic is a single value the hardware can read-modify-write without a lock. For a counter, it is dramatically cheaper than \`Mutex<u64>\`:

\`\`\`rust
hits.fetch_add(1, Ordering::Relaxed);
\`\`\`

\`compare_exchange\` is the primitive everything else is built from — set the value **only if** it currently equals what you expected:

\`\`\`rust
claimed.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
// Ok(false)  — we won, it was false and is now true
// Err(true)  — someone else won; the value is what we found
\`\`\`

That is how you elect exactly one winner among N threads with no lock at all.`,
    },
    {
      kind: "theory",
      body: `The \`Ordering\` argument is not a performance knob — it constrains how surrounding memory operations may be reordered by the compiler and the CPU.

- **\`Relaxed\`** — atomic on this value only. No ordering guarantees about anything else. Correct for a statistics counter nobody reads to make a decision.
- **\`Release\`** on a store — everything written before it is visible to a thread that later \`Acquire\`-loads that value.
- **\`Acquire\`** on a load — everything the releasing thread wrote before its store is now visible to you.
- **\`AcqRel\`** — both, for a read-modify-write.
- **\`SeqCst\`** — additionally, a single total order all threads agree on. The safest and the slowest.

The honest rule: **\`Relaxed\` for counters, \`Acquire\`/\`Release\` to publish data, \`SeqCst\` when you are not sure.** Reaching for \`Relaxed\` to make a flag "faster" is how you ship a bug that appears only on ARM, only under load, once a week.`,
    },
    {
      kind: "quiz",
      question:
        "A worker writes a buffer then sets a `ready` flag; a reader spins on the flag then reads the buffer. Both use `Relaxed`. What can go wrong?",
      options: [
        "The reader can see `ready == true` before the buffer writes are visible, and read garbage",
        "Nothing — `Relaxed` still guarantees the write happens first in program order",
        "The flag can be torn, showing a value that is neither true nor false",
      ],
      answer: 0,
      explain:
        "This is the publish pattern, and it needs `Release` on the store and `Acquire` on the load. `Relaxed` makes each *operation* atomic and orders nothing around it.",
    },
    {
      kind: "fill",
      prompt: "Increment a statistics counter with the cheapest correct ordering.",
      file: "main.rs",
      before: "hits.fetch_add(1, Ordering::",
      after: ");",
      choices: ["Relaxed", "SeqCst", "Acquire"],
      answer: 0,
      explain:
        "Nothing else depends on this counter's ordering, so `Relaxed` is both correct and cheapest. `Acquire` is not even valid on a store-side operation on its own.",
    },
    {
      kind: "quiz",
      question:
        "Which is the honest description of `SeqCst`?",
      options: [
        "The strongest and slowest — a single total order every thread agrees on; the right default when you are unsure",
        "The fastest, since the CPU can optimise a total order best",
        "Identical to `AcqRel` with a different name",
      ],
      answer: 0,
      explain:
        "Starting at `SeqCst` and weakening with a benchmark in hand is a sound way to work. Starting at `Relaxed` and hoping is not.",
    },
    {
      kind: "editor",
      intro: `### Count without a lock, elect one winner

1. Build \`Arc<AtomicU64>\` at \`0\`. Spawn eight threads, each doing \`fetch_add(1, Ordering::Relaxed)\` one thousand times. Join and print the value with an \`Acquire\` load.
2. Create an \`AtomicBool\` at \`false\`. Call \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\` **twice** and print each result with \`{:?}\`.

Expected output:

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — we won, and the value we replaced was \`false\`. \`Err(true)\` — we lost, and here is what we actually found.`,
    },
  ],

  "rust-concurrency-8": [
    {
      kind: "theory",
      body: `A channel moves **ownership** between threads. \`mpsc\` is multi-producer, single-consumer: clone the sender as many times as you need, keep one receiver.

\`\`\`rust
let (tx, rx) = mpsc::channel::<u64>();
for id in 0..3 {
    let tx = tx.clone();
    thread::spawn(move || { tx.send(id).unwrap(); });
}
drop(tx);                       // drop the original, or rx never ends
for value in rx { ... }
\`\`\`

That \`drop(tx)\` is the detail people miss. The receiver's iterator ends when **every** sender is gone — and the original \`tx\` in \`main\` is one of them.`,
    },
    {
      kind: "theory",
      body: `\`channel()\` is **unbounded**. A producer never waits, which sounds good and is the classic way to build a memory leak: if consumers are slower than producers, the queue grows until the process is killed.

\`sync_channel(n)\` is **bounded**. Once \`n\` messages are buffered, \`send\` blocks:

\`\`\`rust
let (tx, rx) = mpsc::sync_channel::<u64>(1);
tx.send(1).unwrap();
tx.try_send(2).is_err();     // true — full
\`\`\`

That blocking *is* **backpressure**: the queue's depth becomes a signal that travels back up to whoever is producing, so an overloaded system slows its intake instead of buffering its way into an out-of-memory kill.

For a service, prefer bounded. An unbounded queue does not remove the limit, it just moves it to a place where you find out about it as a page rather than as a metric.`,
    },
    {
      kind: "quiz",
      question:
        "A `for value in rx` loop never terminates even though every worker finished. Why?",
      options: [
        "The original sender in `main` was never dropped, so the channel still has a live sender",
        "The receiver must be explicitly closed with `rx.close()`",
        "The workers must call `tx.flush()` before exiting",
      ],
      answer: 0,
      explain:
        "The iterator ends when the sender count reaches zero. Cloning for each worker and forgetting the original leaves exactly one sender alive — in the thread that is waiting.",
    },
    {
      kind: "fill",
      prompt: "Create a bounded channel so producers feel backpressure.",
      file: "main.rs",
      before: "let (btx, brx) = mpsc::",
      after: "::<u64>(1);",
      choices: ["sync_channel", "channel", "bounded"],
      answer: 0,
      explain:
        "`channel()` is unbounded and takes no capacity argument. `bounded` is Crossbeam's name for this — std calls it `sync_channel`.",
    },
    {
      kind: "quiz",
      question:
        "What actually goes wrong with an unbounded queue in front of a slow consumer?",
      options: [
        "Memory grows without bound until the process is OOM-killed — the limit still exists, it is just the machine's",
        "Messages are silently dropped once an internal limit is reached",
        "Senders begin to block, which is the desired backpressure",
      ],
      answer: 0,
      explain:
        "Unbounded does not mean 'no limit', it means 'the limit is RAM and you find out by being paged'. A bounded queue makes the limit yours, and visible as latency.",
    },
    {
      kind: "editor",
      intro: `### Fan in, then feel the backpressure

1. \`mpsc::channel::<u64>()\`. Spawn three producers; producer \`id\` sends \`id * 10 + n\` for \`n\` in \`0..3\`. **Drop the original sender**, then collect the receiver into a \`Vec<u64>\`, sort it, print it and its length.
2. \`mpsc::sync_channel::<u64>(1)\`. Send one value, print whether \`try_send\` of a second **fails**, then \`recv()\` and print what came out.

Expected output:

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Sorting is what makes the fan-in deterministic — arrival order is not.`,
    },
  ],
};
