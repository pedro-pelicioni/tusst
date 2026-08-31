import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Async From First Principles — hidden grading data.
// Everything here is std-only: no runtime crate is available in the sandbox,
// and building the executor by hand is the better lesson anyway.

export const rustAsyncInternalsGraders: Record<string, AdvancedLessonContent> = {
  "rust-async-internals-1": {
    instructions: `## Implement Future by hand

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` asks "are you done?" and answers \`Ready(v)\` or \`Pending\`. Nothing runs a future on its own.

### Your task

1. \`struct Immediate(u32)\` implementing \`Future<Output = u32>\`, returning \`Poll::Ready(self.0)\` at once.
2. \`struct Countdown { left: u32 }\` implementing \`Future<Output = u32>\`: while \`left > 0\`, decrement and return \`Pending\`; at zero return \`Ready(0)\`.
3. In \`main\`, build a \`Context\` from \`Waker::noop()\` and poll each by hand — \`Immediate\` once, \`Countdown\` three times — printing each \`Poll\` with \`{:?}\`.

Expected output:

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

There is no executor in this program. You are the executor.

### Hints

- \`use std::task::{Context, Poll, Waker};\`
- \`Countdown::poll\` needs \`mut self: Pin<&mut Self>\` to decrement.
- \`Pin::new(&mut f).poll(&mut cx)\` polls a future that has not moved.
`,
    starterCode: `use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct Immediate(u32);

struct Countdown {
    left: u32,
}

// impl Future for both

fn main() {
    // build a Context from Waker::noop() and poll by hand
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "Immediate implements Future",
        kind: "impl_defined",
        type: "Immediate",
        trait: "Future",
      },
      {
        name: "Countdown implements Future",
        kind: "impl_defined",
        type: "Countdown",
        trait: "Future",
      },
      {
        name: "reports readiness with the value",
        kind: "expr_present",
        expr: "Poll::Ready(self.0)",
      },
      {
        name: "polls by hand through a Context",
        kind: "expr_present",
        expr: "Context::from_waker(waker)",
      },
    ],
    expectedOutput:
      "immediate: Ready(42)\npoll 1: Pending\npoll 2: Pending\npoll 3: Ready(0)\n",
    referenceSolution: `use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct Immediate(u32);

impl Future for Immediate {
    type Output = u32;

    fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {
        Poll::Ready(self.0)
    }
}

struct Countdown {
    left: u32,
}

impl Future for Countdown {
    type Output = u32;

    fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {
        if self.left == 0 {
            Poll::Ready(0)
        } else {
            self.left -= 1;
            Poll::Pending
        }
    }
}

fn main() {
    let waker = Waker::noop();
    let mut cx = Context::from_waker(waker);

    let mut immediate = Immediate(42);
    println!("immediate: {:?}", Pin::new(&mut immediate).poll(&mut cx));

    let mut counter = Countdown { left: 2 };
    println!("poll 1: {:?}", Pin::new(&mut counter).poll(&mut cx));
    println!("poll 2: {:?}", Pin::new(&mut counter).poll(&mut cx));
    println!("poll 3: {:?}", Pin::new(&mut counter).poll(&mut cx));
}
`,
  },

  "rust-async-internals-2": {
    instructions: `## Prove nothing runs on its own

Calling an \`async fn\` runs **none** of its body — it builds a state machine sitting at state zero. The body runs only when something polls it.

This is the opposite of a JavaScript promise, and it is why \`Future\` is \`#[must_use]\`: a dropped un-awaited future means the work never happened.

### Your task

1. \`struct Effect { ran: bool }\` implementing \`Future<Output = &'static str>\`: \`poll\` sets \`ran = true\` and returns \`Ready("side effect happened")\`.
2. \`async fn build() -> &'static str\` returning \`"from an async fn"\`.
3. In \`main\`: create the \`Effect\`, print \`ran\` (false). Poll it once, print the \`Poll\` and \`ran\` again (true). Then call \`build()\`, print that nothing ran, \`Box::pin\` it, and poll it.

Expected output:

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\`

### Hints

- An \`async\` block is not \`Unpin\`, so it needs \`Box::pin\`, not \`Pin::new\`.
- Poll the boxed future with \`fut.as_mut().poll(&mut cx)\`.
`,
    starterCode: `use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct Effect {
    ran: bool,
}

// impl Future for Effect

async fn build() -> &'static str {
    "from an async fn"
}

fn main() {
    // show the effect has not run, poll it, then do the same for build()
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "Effect implements Future",
        kind: "impl_defined",
        type: "Effect",
        trait: "Future",
      },
      {
        name: "the side effect happens inside poll, not at construction",
        kind: "expr_present",
        expr: "self.ran = true",
      },
      {
        name: "pins the async fn's state machine on the heap",
        kind: "expr_present",
        expr: "Box::pin(fut)",
      },
      {
        name: "polls the pinned future",
        kind: "method_called",
        method: "as_mut",
        receiver: "fut",
      },
    ],
    expectedOutput:
      'created, ran: false\npolled: Ready("side effect happened")\nnow ran: true\nasync fn created, nothing ran\nawaited: Ready("from an async fn")\n',
    referenceSolution: `use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct Effect {
    ran: bool,
}

impl Future for Effect {
    type Output = &'static str;

    fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<&'static str> {
        self.ran = true;
        Poll::Ready("side effect happened")
    }
}

async fn build() -> &'static str {
    "from an async fn"
}

fn main() {
    let waker = Waker::noop();
    let mut cx = Context::from_waker(waker);

    let mut effect = Effect { ran: false };
    println!("created, ran: {}", effect.ran);

    let out = Pin::new(&mut effect).poll(&mut cx);
    println!("polled: {:?}", out);
    println!("now ran: {}", effect.ran);

    let fut = build();
    println!("async fn created, nothing ran");

    let mut fut = Box::pin(fut);
    println!("awaited: {:?}", fut.as_mut().poll(&mut cx));
}
`,
  },

  "rust-async-internals-3": {
    instructions: `## Write a real block_on

An executor is a loop: poll, and on \`Pending\`, wait until woken. The \`Waker\` is how a future says "poll me again".

\`Waker\` is a hand-built vtable over an erased \`*const ()\` — here, an \`Arc<Signal>\` leaked to a raw pointer. \`clone\` must bump the refcount and \`drop\` must decrement it; this is the one place in async Rust that genuinely needs \`unsafe\`.

### Your task

1. \`struct Signal { ready: Mutex<bool>, cv: Condvar }\` with \`new() -> Arc<Signal>\`, \`wait(&self)\` (sleep until the flag is set, then clear it) and \`notify(&self)\`.
2. A \`static VTABLE: RawWakerVTable\` with four \`unsafe fn\`s: \`clone\` bumps the count, \`wake\` notifies and consumes, \`wake_by_ref\` notifies without consuming, \`drop\` decrements.
3. \`fn waker_for(signal: &Arc<Signal>) -> Waker\` via \`Waker::from_raw\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, build the context, loop: \`Ready\` returns, \`Pending\` calls \`signal.wait()\`.
5. \`struct Yield { left: u32 }\` yielding three times then \`Ready(7)\`; \`async fn work() -> u32\` awaiting it and adding 1.
6. Run \`block_on(async { 5u32 })\` and \`block_on(work())\`.

Expected output:

\`\`\`text
simple: 5
yielding: 8
\`\`\`

This is the longest exercise on the path, and the one that makes every runtime afterwards read like ordinary code.

### Hints

- \`Arc::into_raw\` / \`Arc::from_raw\` are the leak-and-rebuild pair; use \`std::mem::forget\` when you must not consume the rebuilt \`Arc\`.
- \`Yield\` must call \`cx.waker().wake_by_ref()\` before returning \`Pending\`, or \`wait()\` sleeps forever.
- \`Condvar::wait\` returns the guard back to you: \`ready = self.cv.wait(ready).unwrap();\`
`,
    starterCode: `use std::future::Future;
use std::pin::Pin;
use std::sync::{Arc, Condvar, Mutex};
use std::task::{Context, Poll, RawWaker, RawWakerVTable, Waker};

struct Signal {
    ready: Mutex<bool>,
    cv: Condvar,
}

// Signal::new / wait / notify
// static VTABLE + four unsafe fns
// waker_for, block_on
// Yield + work()

fn main() {
    // block_on an immediate async block, then a yielding one
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "builds a waker vtable by hand",
        kind: "expr_present",
        expr: "RawWakerVTable::new(clone_raw, wake_raw, wake_by_ref_raw, drop_raw)",
      },
      {
        name: "constructs the Waker from the raw parts",
        kind: "expr_present",
        expr: "Waker::from_raw(RawWaker::new(ptr, &VTABLE))",
      },
      {
        name: "block_on drives the future to completion",
        kind: "fn_defined",
        fn: "block_on",
        returns: "F::Output",
      },
      {
        name: "parks the thread instead of spinning on Pending",
        kind: "expr_present",
        expr: "signal.wait()",
      },
      {
        name: "the yielding future schedules its own next poll",
        kind: "expr_present",
        expr: "cx.waker().wake_by_ref()",
      },
    ],
    expectedOutput: "simple: 5\nyielding: 8\n",
    referenceSolution: `use std::future::Future;
use std::pin::Pin;
use std::sync::{Arc, Condvar, Mutex};
use std::task::{Context, Poll, RawWaker, RawWakerVTable, Waker};

struct Signal {
    ready: Mutex<bool>,
    cv: Condvar,
}

impl Signal {
    fn new() -> Arc<Signal> {
        Arc::new(Signal {
            ready: Mutex::new(false),
            cv: Condvar::new(),
        })
    }

    fn wait(&self) {
        let mut ready = self.ready.lock().unwrap();
        while !*ready {
            ready = self.cv.wait(ready).unwrap();
        }
        *ready = false;
    }

    fn notify(&self) {
        *self.ready.lock().unwrap() = true;
        self.cv.notify_one();
    }
}

static VTABLE: RawWakerVTable =
    RawWakerVTable::new(clone_raw, wake_raw, wake_by_ref_raw, drop_raw);

unsafe fn clone_raw(ptr: *const ()) -> RawWaker {
    let arc = Arc::from_raw(ptr as *const Signal);
    let cloned = Arc::clone(&arc);
    std::mem::forget(arc);
    RawWaker::new(Arc::into_raw(cloned) as *const (), &VTABLE)
}

unsafe fn wake_raw(ptr: *const ()) {
    let arc = Arc::from_raw(ptr as *const Signal);
    arc.notify();
}

unsafe fn wake_by_ref_raw(ptr: *const ()) {
    let arc = Arc::from_raw(ptr as *const Signal);
    arc.notify();
    std::mem::forget(arc);
}

unsafe fn drop_raw(ptr: *const ()) {
    drop(Arc::from_raw(ptr as *const Signal));
}

fn waker_for(signal: &Arc<Signal>) -> Waker {
    let ptr = Arc::into_raw(Arc::clone(signal)) as *const ();
    unsafe { Waker::from_raw(RawWaker::new(ptr, &VTABLE)) }
}

fn block_on<F: Future>(future: F) -> F::Output {
    let mut future = Box::pin(future);
    let signal = Signal::new();
    let waker = waker_for(&signal);
    let mut cx = Context::from_waker(&waker);

    loop {
        match future.as_mut().poll(&mut cx) {
            Poll::Ready(v) => return v,
            Poll::Pending => signal.wait(),
        }
    }
}

struct Yield {
    left: u32,
}

impl Future for Yield {
    type Output = u32;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<u32> {
        if self.left == 0 {
            Poll::Ready(7)
        } else {
            self.left -= 1;
            cx.waker().wake_by_ref();
            Poll::Pending
        }
    }
}

async fn work() -> u32 {
    let a = Yield { left: 3 }.await;
    a + 1
}

fn main() {
    println!("simple: {}", block_on(async { 5u32 }));
    println!("yielding: {}", block_on(work()));
}
`,
  },

  "rust-async-internals-4": {
    instructions: `## Cooperative, and what happens when you are not

A task runs until it returns \`Pending\`. Nothing preempts it. So a \`poll\` that computes for 200ms holds its runtime thread for 200ms, and every other task on that thread waits.

The confusing part in production: latency rises on the *other* endpoints sharing that thread, so the slow trace points at innocent code.

### Your task

1. \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\` implementing \`Future<Output = ()>\`: log \`"<name>:<left>"\`; if \`left\` is zero return \`Ready\`, else decrement, wake, return \`Pending\`.
2. \`struct Hog { name: &'static str, log: Rc<RefCell<Vec<String>>> }\` whose single \`poll\` logs three entries (\`"<name>:0"\`, \`"<name>:1"\`, \`"<name>:2"\`) and returns \`Ready\`.
3. Poll two \`Task\`s (\`a\` and \`b\`, both \`left: 2\`) alternately until both finish, then print the log.
4. With a fresh log, poll a \`Hog\` named \`hog\` to completion, then a \`Task\` named \`starved\` (\`left: 1\`), and print that log.

Expected output:

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

The first log interleaves. The second does not.

### Hints

- \`Poll::is_ready()\` is convenient for the alternating loop.
- \`{:?}\` on \`log.borrow()\` prints the inner \`Vec\`.
`,
    starterCode: `use std::cell::RefCell;
use std::future::Future;
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll, Waker};

struct Task {
    name: &'static str,
    left: u32,
    log: Rc<RefCell<Vec<String>>>,
}

struct Hog {
    name: &'static str,
    log: Rc<RefCell<Vec<String>>>,
}

// impl Future for both

fn main() {
    // interleave two Tasks, then let a Hog starve one
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the cooperative task yields between steps",
        kind: "expr_present",
        expr: "cx.waker().wake_by_ref()",
      },
      {
        name: "the hog finishes everything in one poll",
        kind: "impl_defined",
        type: "Hog",
        trait: "Future",
      },
      {
        name: "both futures write to a shared log",
        kind: "method_called",
        method: "borrow_mut",
        receiver: "self.log",
      },
      {
        name: "checks readiness without unwrapping the Poll",
        kind: "method_called",
        method: "is_ready",
      },
    ],
    expectedOutput:
      'cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]\nblocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]\n',
    referenceSolution: `use std::cell::RefCell;
use std::future::Future;
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll, Waker};

struct Task {
    name: &'static str,
    left: u32,
    log: Rc<RefCell<Vec<String>>>,
}

impl Future for Task {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<()> {
        self.log
            .borrow_mut()
            .push(format!("{}:{}", self.name, self.left));

        if self.left == 0 {
            return Poll::Ready(());
        }

        self.left -= 1;
        cx.waker().wake_by_ref();
        Poll::Pending
    }
}

struct Hog {
    name: &'static str,
    log: Rc<RefCell<Vec<String>>>,
}

impl Future for Hog {
    type Output = ();

    fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<()> {
        for i in 0..3 {
            self.log.borrow_mut().push(format!("{}:{}", self.name, i));
        }
        Poll::Ready(())
    }
}

fn main() {
    let waker = Waker::noop();
    let mut cx = Context::from_waker(waker);

    let log = Rc::new(RefCell::new(Vec::new()));
    let mut a = Task {
        name: "a",
        left: 2,
        log: Rc::clone(&log),
    };
    let mut b = Task {
        name: "b",
        left: 2,
        log: Rc::clone(&log),
    };

    let mut a_done = false;
    let mut b_done = false;
    while !(a_done && b_done) {
        if !a_done && Pin::new(&mut a).poll(&mut cx).is_ready() {
            a_done = true;
        }
        if !b_done && Pin::new(&mut b).poll(&mut cx).is_ready() {
            b_done = true;
        }
    }
    println!("cooperative: {:?}", log.borrow());

    let log2 = Rc::new(RefCell::new(Vec::new()));
    let mut hog = Hog {
        name: "hog",
        log: Rc::clone(&log2),
    };
    let mut starved = Task {
        name: "starved",
        left: 1,
        log: Rc::clone(&log2),
    };

    while !Pin::new(&mut hog).poll(&mut cx).is_ready() {}
    while !Pin::new(&mut starved).poll(&mut cx).is_ready() {}
    println!("blocking: {:?}", log2.borrow());
}
`,
  },

  "rust-async-internals-5": {
    instructions: `## Watch a cancellation clean up

There is no \`cancel()\`. **Cancellation is dropping the future** — the state machine is destroyed wherever it was suspended, and every local it held drops in the usual order.

Two consequences: a future can be dropped at any \`.await\`, so a partially-completed operation stays partial; and \`Drop\` cannot \`.await\`, so cleanup must be synchronous.

### Your task

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`impl Drop\` pushing \`"cleanup <id>"\`.
3. \`impl Future<Output = u32>\` whose \`poll\` pushes \`"poll <id>"\`, wakes, and returns \`Pending\` — forever.
4. In \`main\`: inside a block, create request \`1\`, poll it **twice**, and let the block end — that is the cancellation. Push a \`"---"\` marker. Then create request \`2\`, poll it once, and \`drop\` it explicitly.
5. Print the log.

Expected output:

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

Neither request ever returned \`Ready\`. Both cleaned up anyway.

### Hints

- \`Poll\` is \`#[must_use]\`; bind the result with \`let _ = ...\` to discard it.
`,
    starterCode: `use std::cell::RefCell;
use std::future::Future;
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll, Waker};

struct Request {
    id: u32,
    log: Rc<RefCell<Vec<String>>>,
}

// impl Drop and impl Future

fn main() {
    // cancel one by scope, one by explicit drop
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "cleanup is attached through Drop",
        kind: "impl_defined",
        type: "Request",
        trait: "Drop",
      },
      {
        name: "the future never completes",
        kind: "impl_defined",
        type: "Request",
        trait: "Future",
      },
      {
        name: "records the cleanup with the request id",
        kind: "macro_invoked",
        macro: "format",
        args: '"cleanup {}", self.id',
      },
      {
        name: "cancels the second request explicitly",
        kind: "expr_present",
        expr: "drop(done)",
      },
    ],
    expectedOutput:
      '["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]\n',
    referenceSolution: `use std::cell::RefCell;
use std::future::Future;
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll, Waker};

struct Request {
    id: u32,
    log: Rc<RefCell<Vec<String>>>,
}

impl Drop for Request {
    fn drop(&mut self) {
        self.log.borrow_mut().push(format!("cleanup {}", self.id));
    }
}

impl Future for Request {
    type Output = u32;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<u32> {
        self.log.borrow_mut().push(format!("poll {}", self.id));
        cx.waker().wake_by_ref();
        Poll::Pending
    }
}

fn main() {
    let waker = Waker::noop();
    let mut cx = Context::from_waker(waker);
    let log = Rc::new(RefCell::new(Vec::new()));

    {
        let mut req = Request {
            id: 1,
            log: Rc::clone(&log),
        };
        let _ = Pin::new(&mut req).poll(&mut cx);
        let _ = Pin::new(&mut req).poll(&mut cx);
    }

    log.borrow_mut().push(String::from("---"));

    let mut done = Request {
        id: 2,
        log: Rc::clone(&log),
    };
    let _ = Pin::new(&mut done).poll(&mut cx);
    drop(done);

    println!("{:?}", log.borrow());
}
`,
  },

  "rust-async-internals-6": {
    instructions: `## Race two futures

A timeout is not a signal and not a thread — it is a future polling two things and returning whichever finishes first. That is \`select!\`, and the **loser is dropped**, which is exactly a cancellation.

### Your task

1. \`struct Ticks { label: &'static str, left: u32 }\` implementing \`Future<Output = &'static str>\`: at zero return \`Ready(self.label)\`, else decrement, wake, return \`Pending\`.
2. \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` where both are \`Future<Output = &'static str> + Unpin\` — loop polling \`a\` then \`b\`, returning the first \`Ready\`.
3. Race \`work\` (\`left: 2\`) against \`timeout\` (\`left: 5\`), then \`work\` (\`left: 9\`) against \`timeout\` (\`left: 3\`).

Expected output:

\`\`\`text
work
timeout
\`\`\`

In each case the loser is dropped at the \`return\`.

### Hints

- \`if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) { return v; }\`
- The \`Unpin\` bound is what lets \`race\` use \`Pin::new\` rather than boxing.
`,
    starterCode: `use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct Ticks {
    label: &'static str,
    left: u32,
}

// impl Future for Ticks

fn race<A, B>(mut a: A, mut b: B) -> &'static str
where
    A: Future<Output = &'static str> + Unpin,
    B: Future<Output = &'static str> + Unpin,
{
    // poll both until one is ready
}

fn main() {
    // work wins, then timeout wins
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "race takes two independently pollable futures",
        kind: "fn_defined",
        fn: "race",
        returns: "&'static str",
      },
      {
        name: "returns as soon as the first side is ready",
        kind: "if_let",
        pat: "Poll::Ready(v)",
      },
      {
        name: "the ticking future yields between steps",
        kind: "expr_present",
        expr: "cx.waker().wake_by_ref()",
      },
      {
        name: "races the work against a deadline",
        kind: "expr_present",
        expr: 'Ticks { label: "timeout", left: 5 }',
      },
    ],
    expectedOutput: "work\ntimeout\n",
    referenceSolution: `use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct Ticks {
    label: &'static str,
    left: u32,
}

impl Future for Ticks {
    type Output = &'static str;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<&'static str> {
        if self.left == 0 {
            return Poll::Ready(self.label);
        }
        self.left -= 1;
        cx.waker().wake_by_ref();
        Poll::Pending
    }
}

fn race<A, B>(mut a: A, mut b: B) -> &'static str
where
    A: Future<Output = &'static str> + Unpin,
    B: Future<Output = &'static str> + Unpin,
{
    let waker = Waker::noop();
    let mut cx = Context::from_waker(waker);

    loop {
        if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) {
            return v;
        }
        if let Poll::Ready(v) = Pin::new(&mut b).poll(&mut cx) {
            return v;
        }
    }
}

fn main() {
    println!(
        "{}",
        race(
            Ticks {
                label: "work",
                left: 2
            },
            Ticks {
                label: "timeout",
                left: 5
            }
        )
    );

    println!(
        "{}",
        race(
            Ticks {
                label: "work",
                left: 9
            },
            Ticks {
                label: "timeout",
                left: 3
            }
        )
    );
}
`,
  },

  "rust-async-internals-7": {
    instructions: `## A mini runtime with spawn

Everything Tokio provides is a name for something you have now built: \`block_on\` is your loop, \`tokio::spawn\` is pushing onto a queue, \`select!\` is your \`race\`, \`timeout\` is a race against a timer.

What Tokio genuinely adds is an epoll/kqueue reactor, a work-stealing scheduler, and a timer wheel.

### Your task

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\` with \`new()\`, \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` pushing \`Box::pin(f)\`, and \`run(&mut self)\` popping, polling, recording \`Ready\` and requeueing \`Pending\`.
3. \`struct Delayed { label: &'static str, left: u32 }\` yielding \`left\` times before returning its label.
4. Spawn \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` and \`async { "immediate" }\`, run, print the completion order.

Expected output:

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

Completion order is by *readiness*, not spawn order. This runtime requeues unconditionally and so ignores the waker entirely — which is the one thing separating it from a real one.

### Hints

- \`use std::collections::VecDeque;\`
- \`while let Some(mut task) = self.queue.pop_front()\` drives the loop.
`,
    starterCode: `use std::collections::VecDeque;
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

type Task = Pin<Box<dyn Future<Output = &'static str>>>;

struct MiniRuntime {
    queue: VecDeque<Task>,
    done: Vec<&'static str>,
}

struct Delayed {
    label: &'static str,
    left: u32,
}

// impl MiniRuntime (new / spawn / run) and impl Future for Delayed

fn main() {
    // spawn three tasks and run them to completion
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "spawn pins the future on the heap before queueing it",
        kind: "expr_present",
        expr: "Box::pin(f)",
      },
      {
        name: "spawn accepts any 'static future of the right output",
        kind: "fn_defined",
        fn: "spawn",
      },
      {
        name: "pending tasks go back on the queue",
        kind: "method_called",
        method: "push_back",
        receiver: "self.queue",
      },
      {
        name: "the runtime pops from the front",
        kind: "method_called",
        method: "pop_front",
        receiver: "self.queue",
      },
    ],
    expectedOutput: 'completed: ["immediate", "fast", "slow"]\n',
    referenceSolution: `use std::collections::VecDeque;
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

type Task = Pin<Box<dyn Future<Output = &'static str>>>;

struct MiniRuntime {
    queue: VecDeque<Task>,
    done: Vec<&'static str>,
}

impl MiniRuntime {
    fn new() -> Self {
        MiniRuntime {
            queue: VecDeque::new(),
            done: Vec::new(),
        }
    }

    fn spawn<F>(&mut self, f: F)
    where
        F: Future<Output = &'static str> + 'static,
    {
        self.queue.push_back(Box::pin(f));
    }

    fn run(&mut self) {
        let waker = Waker::noop();
        let mut cx = Context::from_waker(waker);

        while let Some(mut task) = self.queue.pop_front() {
            match task.as_mut().poll(&mut cx) {
                Poll::Ready(v) => self.done.push(v),
                Poll::Pending => self.queue.push_back(task),
            }
        }
    }
}

struct Delayed {
    label: &'static str,
    left: u32,
}

impl Future for Delayed {
    type Output = &'static str;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<&'static str> {
        if self.left == 0 {
            return Poll::Ready(self.label);
        }
        self.left -= 1;
        cx.waker().wake_by_ref();
        Poll::Pending
    }
}

fn main() {
    let mut rt = MiniRuntime::new();

    rt.spawn(Delayed {
        label: "fast",
        left: 1,
    });
    rt.spawn(Delayed {
        label: "slow",
        left: 3,
    });
    rt.spawn(async { "immediate" });

    rt.run();

    println!("completed: {:?}", rt.done);
}
`,
  },
};
