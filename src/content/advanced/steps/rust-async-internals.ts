import type { LessonStep } from "@/content/steps";

// Advanced · Async From First Principles.
//
// Deliberately std-only: no Tokio anywhere until the final lesson, which is
// a mapping exercise rather than a dependency. Everything here compiles with
// plain rustc, which is both what the Forge sandbox allows and the better
// way to learn this — you cannot mistake the runtime for the language when
// you have written the runtime.

export const rustAsyncInternalsSteps: Record<string, LessonStep[]> = {
  "rust-async-internals-1": [
    {
      kind: "theory",
      body: `A \`Future\` is a struct with one method. That is the whole abstraction:

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` is a question: *"are you done?"* The answer is \`Poll::Ready(value)\` or \`Poll::Pending\`.

There is no thread here, no scheduler, no magic. A future is a state machine that someone else has to call repeatedly.`,
    },
    {
      kind: "theory",
      body: `Two pieces of the signature to name now, so they stop being noise.

**\`Pin<&mut Self>\`.** An \`async\` block compiles into a state machine that may hold references *into itself* — a borrow across an \`.await\` becomes a self-referential struct. Moving such a value would invalidate those pointers, so \`Pin\` is the promise that it will not move. For a hand-written future with no self-references, \`Pin::new(&mut f)\` is free and unremarkable.

**\`Context\`.** Currently it carries exactly one thing: the \`Waker\`. When a future returns \`Pending\`, it is responsible for arranging that the waker is called once progress becomes possible — that is what stops the executor spinning. Lesson three builds one.

The rule that follows from the signature alone: **\`poll\` must never block.** It must return \`Pending\` quickly and be polled again later, or every other future sharing the thread stops.`,
    },
    {
      kind: "quiz",
      question: "What is a `Future`, mechanically?",
      options: [
        "A state machine with a `poll` method that returns `Ready(v)` or `Pending` — nothing runs it on its own",
        "A handle to a thread the runtime started when the future was created",
        "A callback registered with the operating system's event loop",
      ],
      answer: 0,
      explain:
        "Rust's futures are *poll-based*, unlike JavaScript's promises which are push-based and start running immediately. Almost every surprise about async Rust follows from that one difference.",
    },
    {
      kind: "fill",
      prompt: "Report that the future has finished, carrying its value.",
      file: "main.rs",
      before: "fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {\n    Poll::",
      after: "(self.0)\n}",
      choices: ["Ready", "Pending", "Done"],
      answer: 0,
      explain:
        "`Poll` has exactly two variants: `Ready(T)` and `Pending`. `Pending` carries nothing — there is no value yet.",
    },
    {
      kind: "quiz",
      question: "Why does `poll` take `Pin<&mut Self>` rather than `&mut self`?",
      options: [
        "An `async` block can hold references into its own state, and moving it would invalidate them — `Pin` promises it will not move",
        "`Pin` is a lock that stops two threads polling at once",
        "It keeps the future alive until the runtime drops it",
      ],
      answer: 0,
      explain:
        "This is why `Pin` exists at all. For a hand-written future with no self-references, `Pin::new(&mut f)` costs nothing — you meet `Pin` because of what `async fn` generates.",
    },
    {
      kind: "editor",
      intro: `### Implement Future by hand

1. \`struct Immediate(u32)\` implementing \`Future<Output = u32>\`, returning \`Poll::Ready(self.0)\` at once.
2. \`struct Countdown { left: u32 }\` implementing \`Future<Output = u32>\`: while \`left > 0\`, decrement and return \`Pending\`; at zero, return \`Ready(0)\`.
3. In \`main\`, build a \`Context\` from \`Waker::noop()\` and poll each future by hand — \`Immediate\` once, \`Countdown\` three times — printing each \`Poll\` with \`{:?}\`.

Expected output:

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

There is no executor in this program. You are the executor.`,
    },
  ],

  "rust-async-internals-2": [
    {
      kind: "theory",
      body: `Calling an \`async fn\` **runs none of its body**. It builds a state machine and hands it to you, sitting at state zero:

\`\`\`rust
let fut = build();          // nothing has happened
\`\`\`

The body runs only when something polls it. This is the opposite of a JavaScript promise, which begins executing the moment it is created.

That is why an unawaited future is a warning: \`Future\` is \`#[must_use]\`, and dropping one silently means the work you asked for never happened.`,
    },
    {
      kind: "theory",
      body: `Laziness is a feature, and three real behaviours fall out of it.

**Cancellation is free.** Drop the future and the work simply never happens. A runtime does not need to interrupt anything — the next lesson but two covers what that means for cleanup.

**Composition is free.** \`select!\` can build five futures and poll them until one finishes, then drop the rest. If creating them had started them, that would be four wasted operations instead of zero.

**Timeouts wrap rather than interrupt.** \`timeout(d, fut)\` is just another future polling the inner one until the deadline. There is no thread to kill.

The cost of laziness is the failure mode: forget the \`.await\` and nothing runs, no error appears, and the compiler's \`unused_must_use\` warning is the only thing between you and a very confusing afternoon.`,
    },
    {
      kind: "quiz",
      question:
        "`let fut = fetch_data();` is written and `.await` is forgotten. What happens?",
      options: [
        "Nothing runs at all — the future is dropped un-polled, and only the `must_use` warning hints at it",
        "The request runs in the background and its result is discarded",
        "It is a compile error, since futures must be awaited",
      ],
      answer: 0,
      explain:
        "'The request runs in the background' is what a JavaScript promise does, and carrying that intuition into Rust is the single most common async mistake.",
    },
    {
      kind: "fill",
      prompt:
        "Pin an async block's state machine so it can be polled by hand.",
      file: "main.rs",
      before: "let mut fut = ",
      after: "(build());",
      choices: ["Box::pin", "Box::new", "Pin::new"],
      answer: 0,
      explain:
        "`Pin::new` requires the value to be `Unpin`, which an `async` block is not. `Box::pin` allocates and pins in one step — exactly what `.await` does for you under the hood.",
    },
    {
      kind: "quiz",
      question: "Why does laziness make cancellation cheap?",
      options: [
        "Un-run work needs no interruption — dropping the future is the cancellation",
        "The runtime keeps an undo log for each future",
        "Cancelled futures are polled once more to unwind cleanly",
      ],
      answer: 0,
      explain:
        "It also explains why cancellation cannot be *async*: dropping is synchronous, so any cleanup that needs to await must be arranged some other way.",
    },
    {
      kind: "editor",
      intro: `### Prove nothing runs on its own

1. \`struct Effect { ran: bool }\` implementing \`Future<Output = &'static str>\`: \`poll\` sets \`ran = true\` and returns \`Ready("side effect happened")\`.
2. \`async fn build() -> &'static str\` returning \`"from an async fn"\`.
3. In \`main\`: create the \`Effect\` and print \`ran\` (false). Poll it once, print the \`Poll\` and \`ran\` again (true). Then call \`build()\`, print that nothing ran, \`Box::pin\` it, and poll it.

Expected output:

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\``,
    },
  ],

  "rust-async-internals-3": [
    {
      kind: "theory",
      body: `An executor is a loop:

\`\`\`rust
loop {
    match future.as_mut().poll(&mut cx) {
        Poll::Ready(v) => return v,
        Poll::Pending  => /* wait until woken */,
    }
}
\`\`\`

The only hard part is *"wait until woken"*. Spinning would work and would burn a core. Instead the executor supplies a \`Waker\` in the \`Context\`, then parks the thread — and the future's job is to call that waker when progress becomes possible.`,
    },
    {
      kind: "theory",
      body: `\`Waker\` is a manually built vtable, because it predates \`dyn\` being usable in this position:

\`\`\`rust
static VTABLE: RawWakerVTable =
    RawWakerVTable::new(clone_raw, wake_raw, wake_by_ref_raw, drop_raw);
\`\`\`

Four function pointers over an erased \`*const ()\` — that pointer being an \`Arc\` we leaked into a raw pointer and rebuild in each callback. \`clone\` must bump the refcount, \`drop\` must decrement it, and getting that wrong leaks or double-frees. This is the one place in async Rust where you genuinely need \`unsafe\`, and it is why every real project uses a crate for it.

The park half is a \`Mutex<bool>\` plus a \`Condvar\`: \`wait\` sleeps until the flag is set, \`notify\` sets it and wakes the sleeper. Writing it once is worth an afternoon — after this, \`block_on\` is not a mystery function from a crate, it is thirty lines you have already written.`,
    },
    {
      kind: "quiz",
      question: "What is the `Waker`'s job?",
      options: [
        "To let a future tell the executor 'poll me again' — without it the executor must spin or sleep forever",
        "To run the future's body on a background thread",
        "To cancel the future when it takes too long",
      ],
      answer: 0,
      explain:
        "This is the contract that makes async efficient: a `Pending` future costs nothing until something wakes it, so ten thousand idle connections cost ten thousand parked state machines and no CPU.",
    },
    {
      kind: "fill",
      prompt:
        "Pin the future once, on the heap, so it can be polled repeatedly in the loop.",
      file: "main.rs",
      before: "let mut future = ",
      after: "(future);",
      choices: ["Box::pin", "Box::new", "Arc::new"],
      answer: 0,
      explain:
        "`block_on` accepts any `F: Future`, including a non-`Unpin` async block, so it must pin it. Boxing is the simplest way; real executors pin on the stack to avoid the allocation.",
    },
    {
      kind: "quiz",
      question:
        "A hand-written future returns `Pending` and never calls the waker. What happens in a real executor?",
      options: [
        "It is never polled again — the task hangs forever, with no error and no CPU use",
        "The executor polls it again after a default timeout",
        "The runtime detects the missing wake and panics",
      ],
      answer: 0,
      explain:
        "This is the classic hand-written-future bug, and it is invisible: the task simply stops. Nothing warns you, because 'not ready yet' and 'never going to be ready' look identical from outside.",
    },
    {
      kind: "editor",
      intro: `### Write a real block_on

1. \`struct Signal { ready: Mutex<bool>, cv: Condvar }\` with \`new() -> Arc<Signal>\`, \`wait(&self)\` (sleep until the flag is set, then clear it) and \`notify(&self)\`.
2. A \`static VTABLE: RawWakerVTable\` with four \`unsafe fn\`s over an \`Arc<Signal>\` leaked to \`*const ()\`. \`clone\` bumps the count, \`wake_by_ref\` notifies without consuming, \`wake\` notifies and consumes, \`drop\` decrements.
3. \`fn waker_for(signal: &Arc<Signal>) -> Waker\` building it with \`Waker::from_raw\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, build the context, then loop: \`Ready\` returns, \`Pending\` calls \`signal.wait()\`.
5. \`struct Yield { left: u32 }\` yielding three times then \`Ready(7)\`, and \`async fn work() -> u32\` awaiting it and adding 1.
6. Run \`block_on(async { 5u32 })\` and \`block_on(work())\`.

Expected output:

\`\`\`text
simple: 5
yielding: 8
\`\`\`

This is the longest exercise on the path. It is also the one that makes every runtime afterwards read like ordinary code.`,
    },
  ],

  "rust-async-internals-4": [
    {
      kind: "theory",
      body: `Async concurrency is **cooperative**. A task runs until it returns \`Pending\`, and only then can another task on that thread run. Nothing preempts it.

So the model has one requirement: every task must return \`Pending\` regularly. A task that computes for 200ms inside a single \`poll\` holds its runtime thread for 200ms, and every other task assigned to that thread waits — including the ones whose clients are timing out.`,
    },
    {
      kind: "theory",
      body: `The failure mode has a name — **blocking the executor** — and three common causes:

- **Synchronous I/O.** \`std::fs::read\`, a blocking database driver, \`std::thread::sleep\` inside an \`async fn\`.
- **CPU-bound work.** Hashing, compression, a large sort.
- **A lock held across an \`.await\`.** The task parks while holding it, and everyone else queues behind a task that is not even running.

The fix is to move the work off the async threads: \`tokio::task::spawn_blocking\` for I/O and short blocking calls, a dedicated \`rayon\` pool for heavy CPU work. The rule of thumb is that a poll should complete in tens of microseconds.

This is also why the symptom is so confusing. Latency rises on endpoints that share a runtime thread with the offender, not on the endpoint doing the blocking — so the slow trace points at innocent code.`,
    },
    {
      kind: "quiz",
      question:
        "One handler does a 200ms synchronous file read inside an `async fn`. What does an operator see?",
      options: [
        "p99 latency rises on *other* endpoints sharing that runtime thread — the guilty handler may look fine",
        "Only that handler slows down; the runtime isolates tasks from each other",
        "The runtime logs a warning and moves the task to a blocking pool",
      ],
      answer: 0,
      explain:
        "The misdirection is what makes this expensive to debug. Tokio's `--cfg tokio_unstable` task metrics and a poll-duration histogram exist precisely to point at the real culprit.",
    },
    {
      kind: "fill",
      prompt:
        "Yield control back to the executor so other tasks can make progress.",
      file: "main.rs",
      before: "self.left -= 1;\ncx.waker().",
      after: "();\nPoll::Pending",
      choices: ["wake_by_ref", "wake", "clone"],
      answer: 0,
      explain:
        "`wake_by_ref` schedules another poll without consuming the waker, which is what you want when the waker lives in the `Context` you were handed.",
    },
    {
      kind: "quiz",
      question: "Where should a CPU-bound 500ms computation run?",
      options: [
        "On a dedicated pool — `spawn_blocking` or a `rayon` pool — never inside a poll on an async worker thread",
        "Inside the `async fn`, since the runtime will preempt it after a slice",
        "Split across many `async fn`s, which the runtime interleaves automatically",
      ],
      answer: 0,
      explain:
        "There is no preemption to rely on. Splitting into several `async fn`s changes nothing either — without an `.await` in between, it is still one uninterrupted poll.",
    },
    {
      kind: "editor",
      intro: `### Cooperative, and what happens when you are not

1. \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\` implementing \`Future<Output = ()>\`: log \`"<name>:<left>"\`, and if \`left\` is zero return \`Ready\`, else decrement, wake, and return \`Pending\`.
2. \`struct Hog { name, log }\` whose single \`poll\` logs three entries and returns \`Ready\` — all its work in one turn.
3. Poll two \`Task\`s (\`a\` and \`b\`, both \`left: 2\`) alternately until both finish, and print the log.
4. With a fresh log, poll a \`Hog\` to completion, then a \`Task\` named \`starved\` (\`left: 1\`), and print that log.

Expected output:

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

The first log interleaves. The second does not — the hog finished everything before the other task got a single turn.`,
    },
  ],

  "rust-async-internals-5": [
    {
      kind: "theory",
      body: `There is no \`cancel()\` in async Rust. **Cancellation is dropping the future.**

\`\`\`rust
{
    let mut req = Request { .. };
    poll(&mut req);          // started
    poll(&mut req);          // still pending
}                            // dropped here — cancelled
\`\`\`

The state machine is destroyed wherever it happened to be suspended. Every local it was holding drops, in the usual order. That is the entire cleanup mechanism.`,
    },
    {
      kind: "theory",
      body: `Two consequences that decide whether a service is correct under load.

**A future can be dropped at any \`.await\`.** When a client disconnects or a timeout fires, the task stops between two statements. Anything that was half-done stays half-done — so a two-step operation must be idempotent, or wrapped so a retry can safely repeat it. This property is called **cancellation safety**, and library docs state it explicitly: \`tokio::sync::mpsc::Receiver::recv\` and \`AsyncReadExt::read\` are cancel-safe; \`read_exact\` is not, because it may already have moved bytes into your buffer when it is dropped.

**Cleanup must be synchronous.** \`Drop\` cannot \`.await\`, so a future cannot await a graceful close on the way out. The standard workarounds are to do the cleanup in \`Drop\` synchronously, or to hand the work to a detached task that outlives the cancelled one.

The practical shape: keep the awaited region small, make each step idempotent, and put anything that must happen behind a \`Drop\` guard rather than after the last \`.await\`.`,
    },
    {
      kind: "quiz",
      question: "How is an in-flight async task cancelled in Rust?",
      options: [
        "Its future is dropped — the state machine is destroyed where it was suspended, running each local's `Drop`",
        "The runtime sends it a cancellation signal it can catch and handle",
        "It is polled one final time with a cancellation flag set in the `Context`",
      ],
      answer: 0,
      explain:
        "Because it is a plain `Drop`, cancellation is synchronous and cannot be awaited. That single fact is the source of nearly every graceful-shutdown difficulty in async Rust.",
    },
    {
      kind: "fill",
      prompt:
        "Attach cleanup that runs even when the future is cancelled mid-flight.",
      file: "main.rs",
      before: "impl ",
      after: " for Request {\n    fn drop(&mut self) { /* release */ }\n}",
      choices: ["Drop", "Future", "Cancel"],
      answer: 0,
      explain:
        "`Drop` is the only hook that runs on cancellation. Code placed after the last `.await` does not run, because the task never reaches it.",
    },
    {
      kind: "quiz",
      question:
        "A handler debits an account, `.await`s a network call, then credits another. The client disconnects during the await. What is the state?",
      options: [
        "Debited and not credited — the future was dropped mid-flight, and money has gone missing",
        "Both steps roll back automatically when the future drops",
        "The runtime finishes the handler before honouring the disconnect",
      ],
      answer: 0,
      explain:
        "This is cancellation safety as a correctness bug rather than a style note. The fix is a transaction, an idempotency key, or a `Drop` guard that compensates — not hoping the client stays connected.",
    },
    {
      kind: "editor",
      intro: `### Watch a cancellation clean up

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`impl Drop\` pushing \`"cleanup <id>"\`.
3. \`impl Future<Output = u32>\` whose \`poll\` pushes \`"poll <id>"\`, wakes, and returns \`Pending\` forever.
4. In \`main\`: inside a block, create request \`1\`, poll it **twice**, and let the block end — that is the cancellation. Push a \`"---"\` marker. Then create request \`2\`, poll it once, and \`drop\` it explicitly.
5. Print the log.

Expected output:

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

Neither request ever returned \`Ready\`. Both cleaned up anyway.`,
    },
  ],

  "rust-async-internals-6": [
    {
      kind: "theory",
      body: `A timeout is not a signal and not a thread. It is a future that polls two things and returns whichever finishes first:

\`\`\`rust
loop {
    if let Poll::Ready(v) = poll(&mut work)    { return v; }
    if let Poll::Ready(v) = poll(&mut deadline) { return v; }
}
\`\`\`

That is \`select!\`, and \`timeout(d, fut)\` is the special case where one side is a timer. Nothing is interrupted — **the loser is simply dropped**, which by the previous lesson is exactly what cancellation is.`,
    },
    {
      kind: "theory",
      body: `Three things follow, and each of them bites someone eventually.

**A dropped branch is cancelled mid-flight.** If the losing branch had done half of a two-step operation, that half stays done. Only put a cancel-safe future in a \`select!\` branch, or restructure so the partial state cannot matter.

**Polling order is a fairness question.** A naive \`select\` that always polls the first branch first starves the second when the first is usually ready. \`tokio::select!\` randomises branch order by default for exactly this reason — and lets you turn it off with \`biased;\` when you actually want priority.

**Every outbound call needs a deadline.** Without one, a hung dependency turns into your own unbounded queue: connections pile up, memory grows, and the outage propagates to whoever calls you. A timeout is not error handling, it is how a failure stays local.`,
    },
    {
      kind: "quiz",
      question: "What happens to the losing branch of a `select!`?",
      options: [
        "It is dropped — cancelled wherever it was suspended, with any partial work left as it was",
        "It keeps running in the background and its result is discarded",
        "It is polled to completion first, then ignored",
      ],
      answer: 0,
      explain:
        "This is why `tokio`'s docs mark futures as cancel-safe or not. Putting a non-cancel-safe future in a `select!` branch is a correctness bug, not a performance note.",
    },
    {
      kind: "fill",
      prompt:
        "Return as soon as either side finishes, without waiting for the other.",
      file: "main.rs",
      before: "if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) {\n    ",
      after: " v;\n}",
      choices: ["return", "break", "continue"],
      answer: 0,
      explain:
        "Returning immediately is what drops the other future — the loser goes out of scope with the function. That drop *is* the cancellation.",
    },
    {
      kind: "quiz",
      question:
        "Why does `tokio::select!` randomise which branch it polls first?",
      options: [
        "To avoid starving later branches when an earlier one is usually ready",
        "To make the macro's expansion smaller",
        "To spread load evenly across runtime worker threads",
      ],
      answer: 0,
      explain:
        "A fixed order is a priority order, and priority you did not intend is starvation. `biased;` opts back into deterministic order when the priority is deliberate.",
    },
    {
      kind: "editor",
      intro: `### Race two futures

1. \`struct Ticks { label: &'static str, left: u32 }\` implementing \`Future<Output = &'static str>\`: at zero return \`Ready(self.label)\`, else decrement, wake, return \`Pending\`.
2. \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` where both are \`Future<Output = &'static str> + Unpin\` — loop polling \`a\` then \`b\`, returning the first \`Ready\`.
3. Race \`work\` (\`left: 2\`) against \`timeout\` (\`left: 5\`), then \`work\` (\`left: 9\`) against \`timeout\` (\`left: 3\`).

Expected output:

\`\`\`text
work
timeout
\`\`\`

In each case the loser is dropped at the \`return\` — which is precisely a cancellation.`,
    },
  ],

  "rust-async-internals-7": [
    {
      kind: "theory",
      body: `Everything Tokio provides is now a name for something you have already built.

| you wrote | Tokio |
| --- | --- |
| the \`loop\` in \`block_on\` | \`#[tokio::main]\` / \`Runtime::block_on\` |
| pushing a future onto a queue | \`tokio::spawn\` |
| the queue entry itself | \`JoinHandle<T>\` |
| your \`race\` function | \`tokio::select!\` |
| racing against a counter | \`tokio::time::timeout\` |
| \`Signal\` + \`Condvar\` | the reactor's waker registry |
| "do not block the poll" | \`tokio::task::spawn_blocking\` |

There is no extra concept in the list. What Tokio adds is scale and an I/O reactor.`,
    },
    {
      kind: "theory",
      body: `The parts genuinely worth taking from the library rather than writing:

**An epoll/kqueue reactor.** Your \`Signal\` woke on a condvar. A real runtime registers a socket with the OS and wakes the exact task whose socket became readable. This is what makes one thread serve ten thousand connections.

**A multi-threaded work-stealing scheduler.** Tasks are distributed across worker threads, and an idle worker steals from a busy one's queue. This is where the \`Send + 'static\` bound on \`tokio::spawn\` comes from: a task may migrate between threads at any await point.

**A timer wheel.** Your race polled a counter in a busy loop. Tokio keeps one sorted timer structure and wakes each task at its deadline, so a million pending timeouts cost almost nothing.

Keep the mental model you have built. When a task hangs, the question is still *"who was supposed to call the waker, and why didn't they?"* — and now you know what that means.`,
    },
    {
      kind: "quiz",
      question:
        "Why does `tokio::spawn` require the future to be `Send + 'static`?",
      options: [
        "The work-stealing scheduler may move the task between worker threads, and it may outlive the function that spawned it",
        "Every spawned task is serialised to be sent to the reactor",
        "`'static` guarantees the task runs for the whole process lifetime",
      ],
      answer: 0,
      explain:
        "`tokio::task::spawn_local` drops the `Send` requirement precisely because a `LocalSet` pins tasks to one thread — the bound is about migration, not about async.",
    },
    {
      kind: "fill",
      prompt:
        "Store heterogeneous futures in one queue — the mini-runtime's task list.",
      file: "main.rs",
      before: "type Task = ",
      after: "<Box<dyn Future<Output = &'static str>>>;",
      choices: ["Pin", "Box", "Arc"],
      answer: 0,
      explain:
        "`Pin<Box<dyn Future>>` is the canonical boxed task type — `Box` for the unknown size, `Pin` because `poll` requires it. Tokio's internal task type is this with more bookkeeping.",
    },
    {
      kind: "quiz",
      question:
        "A task in production hangs forever with no CPU use and no error. What is the first question?",
      options: [
        "Who was supposed to call this task's waker, and why didn't they?",
        "Which thread is it blocking, and how do we preempt it?",
        "How large is its stack, and did it overflow?",
      ],
      answer: 0,
      explain:
        "Zero CPU rules out blocking — a blocked task burns its thread. A parked task that is never woken is silent, and that is exactly the shape of a missing wake.",
    },
    {
      kind: "editor",
      intro: `### A mini runtime with spawn

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\` with \`new()\`, \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` pushing \`Box::pin(f)\`, and \`run(&mut self)\` that pops, polls, records \`Ready\` and requeues \`Pending\`.
3. \`struct Delayed { label: &'static str, left: u32 }\` yielding \`left\` times before returning its label.
4. Spawn \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` and \`async { "immediate" }\`, run, and print the completion order.

Expected output:

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

Completion order is by *readiness*, not spawn order. Note that this runtime requeues unconditionally and therefore ignores the waker entirely — which is the one thing separating it from a real one.`,
    },
  ],
};
