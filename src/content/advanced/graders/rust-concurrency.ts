import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Threads, Send/Sync & Shared State — hidden grading data.

export const rustConcurrencyGraders: Record<string, AdvancedLessonContent> = {
  "rust-concurrency-1": {
    instructions: `## Fan out, collect back

\`thread::spawn\` returns a \`JoinHandle<T>\`; \`join()\` blocks and gives you the closure's return value inside a \`Result\` — \`Err\` means that thread panicked.

The closure must be \`'static\`, so \`move\` is nearly always required.

### Your task

1. Spawn four threads, one per \`id\` in \`0..4u32\`, each returning \`id * id\`.
2. Collect the handles in a \`Vec\`.
3. Join them **in spawn order** into a \`Vec<u32>\`, print it with \`{:?}\`, then print the sum.

Expected output:

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

Execution order is not deterministic; joining in order makes the result deterministic anyway.

### Hints

- \`use std::thread;\`
- \`results.iter().sum::<u32>()\` annotates the sum inline.
`,
    starterCode: `use std::thread;

fn main() {
    // spawn four, collect handles, join in order
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "spawns threads",
        kind: "expr_present",
        expr: "thread::spawn",
      },
      {
        name: "the closure takes ownership of its capture",
        kind: "expr_present",
        expr: "move || id * id",
      },
      { name: "waits for each thread", kind: "method_called", method: "join" },
      {
        name: "sums the collected results",
        kind: "method_called",
        method: "sum",
      },
    ],
    expectedOutput: "results: [0, 1, 4, 9]\ntotal: 14\n",
    referenceSolution: `use std::thread;

fn main() {
    let mut handles = Vec::new();

    for id in 0..4u32 {
        handles.push(thread::spawn(move || id * id));
    }

    let mut results: Vec<u32> = Vec::new();
    for h in handles {
        results.push(h.join().unwrap());
    }

    println!("results: {:?}", results);
    println!("total: {}", results.iter().sum::<u32>());
}
`,
  },

  "rust-concurrency-2": {
    instructions: `## Prove the properties

**\`Send\`** — the value can be *moved* to another thread.
**\`Sync\`** — the value can be *shared by reference* across threads (\`T: Sync\` ⟺ \`&T: Send\`).

Both are auto traits: a type gets them when all its fields have them.

The instructive cases: \`Rc\` is neither (non-atomic count). \`Cell\` is \`Send\` but **not** \`Sync\` — moving the cell is fine, sharing \`&Cell\` races on \`set\`.

### Your task

1. \`fn assert_send<T: Send>(_: &T) -> &'static str\` returning \`"Send"\`, and \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` returning \`"Sync"\`.
2. Show \`Arc<u32>\` satisfies both.
3. Create an \`Rc<u32>\` holding \`42\` and just print its value — passing it to \`assert_send\` would not compile, which is the lesson.
4. Show \`Cell<u32>\` satisfies \`Send\`. Do **not** call \`assert_sync\` on it.

Expected output:

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\`

### Hints

- \`use std::rc::Rc;\`, \`use std::sync::Arc;\`, \`use std::cell::Cell;\`
- The helpers never move anything — the *bound* is what forces the proof.
`,
    starterCode: `use std::cell::Cell;
use std::rc::Rc;
use std::sync::Arc;

fn assert_send<T: Send>(_: &T) -> &'static str {
    "Send"
}

fn assert_sync<T: Sync>(_: &T) -> &'static str {
    "Sync"
}

fn main() {
    // Arc: both. Rc: neither. Cell: Send only.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "asserts Arc is Send",
        kind: "expr_present",
        expr: "assert_send(&arc)",
      },
      {
        name: "asserts Arc is Sync",
        kind: "expr_present",
        expr: "assert_sync(&arc)",
      },
      {
        name: "asserts Cell is Send",
        kind: "expr_present",
        expr: "assert_send(&cell)",
      },
      {
        name: "does not claim Cell is Sync",
        kind: "expr_present",
        expr: "assert_sync(&cell)",
        forbidden: true,
      },
      {
        name: "does not claim Rc is Send",
        kind: "expr_present",
        expr: "assert_send(&rc)",
        forbidden: true,
      },
    ],
    expectedOutput:
      "Arc<u32> is Send\nArc<u32> is Sync\nRc<u32> compiles here: 42\nCell<u32> is Send\n",
    referenceSolution: `use std::cell::Cell;
use std::rc::Rc;
use std::sync::Arc;

fn assert_send<T: Send>(_: &T) -> &'static str {
    "Send"
}

fn assert_sync<T: Sync>(_: &T) -> &'static str {
    "Sync"
}

fn main() {
    let arc = Arc::new(42u32);
    println!("Arc<u32> is {}", assert_send(&arc));
    println!("Arc<u32> is {}", assert_sync(&arc));

    let rc = Rc::new(42u32);
    println!("Rc<u32> compiles here: {}", rc);

    let cell = Cell::new(1u32);
    println!("Cell<u32> is {}", assert_send(&cell));
}
`,
  },

  "rust-concurrency-3": {
    instructions: `## Share one table with four workers

\`Arc<T>\` is \`Rc<T>\` with an atomic reference count, which is what makes it \`Send + Sync\`. On its own it gives **shared read-only** access — mutation needs an inner \`Mutex\` or \`RwLock\`.

The idiom is to shadow the binding inside the loop: \`let table = Arc::clone(&table);\` before the \`move\` closure.

### Your task

1. Build \`Arc<Vec<u64>>\` holding \`(1..=1000).collect()\`; print \`Arc::strong_count\`.
2. Spawn four threads. Each takes its own \`Arc::clone\` and sums a 250-element slice with \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Join, adding the partial sums, and print the total.
4. Print the strong count again — back to 1.

Expected output:

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\`

### Hints

- Annotate the collect: \`let table: Arc<Vec<u64>> = Arc::new((1..=1000).collect());\`
- \`chunk\` is a \`usize\` from \`0..4usize\`.
`,
    starterCode: `use std::sync::Arc;
use std::thread;

fn main() {
    // one table, four readers, no lock
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "shares the table across threads",
        kind: "expr_present",
        expr: "Arc::clone(&table)",
      },
      {
        name: "reads the owner count",
        kind: "expr_present",
        expr: "Arc::strong_count(&table)",
      },
      {
        name: "each worker sums its own slice",
        kind: "method_called",
        method: "take",
        args: "250",
      },
      {
        name: "no lock is taken for a read-only share",
        kind: "method_called",
        method: "lock",
        forbidden: true,
      },
    ],
    expectedOutput: "owners before: 1\ntotal: 500500\nowners after: 1\n",
    referenceSolution: `use std::sync::Arc;
use std::thread;

fn main() {
    let table: Arc<Vec<u64>> = Arc::new((1..=1000).collect());
    println!("owners before: {}", Arc::strong_count(&table));

    let mut handles = Vec::new();
    for chunk in 0..4usize {
        let table = Arc::clone(&table);
        handles.push(thread::spawn(move || {
            table.iter().skip(chunk * 250).take(250).sum::<u64>()
        }));
    }

    let mut total = 0u64;
    for h in handles {
        total += h.join().unwrap();
    }

    println!("total: {}", total);
    println!("owners after: {}", Arc::strong_count(&table));
}
`,
  },

  "rust-concurrency-4": {
    instructions: `## Eight threads, one counter

\`Mutex<T>\` **owns** its data — there is no way to reach the value without locking. The guard derefs to \`&mut T\` and releases on drop; there is no \`unlock()\`.

\`lock()\` returns a \`Result\` because of **poisoning**: a thread that panics while holding the lock marks it, and every later \`lock()\` returns \`Err\`.

Keep the critical section short. \`Drop\` runs at end of **scope**, not last use.

### Your task

1. Build \`Arc<Mutex<u64>>\` starting at \`0\`.
2. Spawn eight threads. Each takes its own \`Arc::clone\` and, one thousand times, locks and increments — the guard scoped to one iteration.
3. Join all eight, then print the final count and whether the mutex \`is_poisoned()\`.

Expected output:

\`\`\`text
count: 8000
poisoned: false
\`\`\`

### Hints

- \`use std::sync::{Arc, Mutex};\`
- \`*counter.lock().unwrap()\` reads the value at the end.
`,
    starterCode: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // eight threads, one thousand increments each
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the counter is shared and locked",
        kind: "expr_present",
        expr: "Arc::new(Mutex::new(0u64))",
      },
      {
        name: "each thread takes its own handle",
        kind: "expr_present",
        expr: "Arc::clone(&counter)",
      },
      { name: "locks before mutating", kind: "method_called", method: "lock" },
      {
        name: "reports the poison state",
        kind: "method_called",
        method: "is_poisoned",
        receiver: "counter",
      },
    ],
    expectedOutput: "count: 8000\npoisoned: false\n",
    referenceSolution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0u64));

    let mut handles = Vec::new();
    for _ in 0..8 {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..1000 {
                let mut guard = counter.lock().unwrap();
                *guard += 1;
            }
        }));
    }

    for h in handles {
        h.join().unwrap();
    }

    println!("count: {}", *counter.lock().unwrap());
    println!("poisoned: {}", counter.is_poisoned());
}
`,
  },

  "rust-concurrency-5": {
    instructions: `## Many readers, one writer

\`RwLock<T>\` allows many concurrent \`read()\` guards or one exclusive \`write()\` guard.

It is **not** a free upgrade: it costs more per operation than \`Mutex\`, and only wins when reads genuinely dominate *and* are slow enough to overlap. Writer starvation is a real risk, and the fairness policy comes from the OS, not from std.

Default to \`Mutex\`; move to \`RwLock\` on a profile.

### Your task

1. Build \`Arc<RwLock<Vec<u64>>>\` holding \`vec![10, 20, 30]\`.
2. Spawn four reader threads, each taking \`read()\` and returning \`.len()\`.
3. Join them, summing the returned lengths, print the total.
4. Take \`write()\` and push \`40\`, then print the vector through a fresh \`read()\`.

Expected output:

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\`

### Hints

- \`use std::sync::{Arc, RwLock};\`
- \`*cache.read().unwrap()\` derefs the guard for \`{:?}\`.
`,
    starterCode: `use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
    // four concurrent readers, then one writer
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "readers take a shared lock",
        kind: "method_called",
        method: "read",
        receiver: "cache",
      },
      {
        name: "the writer takes an exclusive lock",
        kind: "method_called",
        method: "write",
        receiver: "cache",
      },
      {
        name: "the lock is shared across threads",
        kind: "expr_present",
        expr: "Arc::clone(&cache)",
      },
      {
        name: "readers do not take the write lock",
        kind: "expr_present",
        expr: "cache.write().unwrap().len()",
        forbidden: true,
      },
    ],
    expectedOutput: "reads saw: 12\nafter write: [10, 20, 30, 40]\n",
    referenceSolution: `use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
    let cache = Arc::new(RwLock::new(vec![10u64, 20, 30]));

    let mut readers = Vec::new();
    for _ in 0..4 {
        let cache = Arc::clone(&cache);
        readers.push(thread::spawn(move || cache.read().unwrap().len()));
    }

    let mut seen = 0;
    for r in readers {
        seen += r.join().unwrap();
    }
    println!("reads saw: {}", seen);

    cache.write().unwrap().push(40);
    println!("after write: {:?}", *cache.read().unwrap());
}
`,
  },

  "rust-concurrency-6": {
    instructions: `## Order the locks

A deadlock needs two threads acquiring two locks in **opposite orders**. Rust prevents data races at compile time; it does not prevent deadlocks, because waiting forever is memory-safe.

The fix is a **global lock order**: pick a total ordering over your locks and always acquire in that order, whatever the operation's own direction.

### Your task

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — order the two by \`id\`, lock the lower first, then apply the debit and credit to the correct sides.
3. Build accounts \`1\` (balance \`100\`) and \`2\` (balance \`50\`) inside \`Arc\`s.
4. Spawn 100 threads: 50 transferring \`1\` from a to b, and 50 transferring \`1\` from b to a. Join them all.
5. Print each balance, then the total.

Expected output:

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Without the ordering this program deadlocks. With it, the net is zero and the total is conserved.

### Hints

- \`let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };\`
- After locking, check \`from.id == first.id\` to know which guard to debit.
`,
    starterCode: `use std::sync::{Arc, Mutex};
use std::thread;

struct Account {
    id: u32,
    balance: Mutex<i64>,
}

fn transfer(from: &Account, to: &Account, amount: i64) {
    // lock in a global order, then move the money
}

fn main() {
    // 100 opposing transfers, no deadlock
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "imposes a global lock order by id",
        kind: "expr_present",
        expr: "if from.id < to.id { (from, to) } else { (to, from) }",
      },
      {
        name: "locks the ordered pair, not the argument order",
        kind: "method_called",
        method: "lock",
        receiver: "first.balance",
      },
      {
        name: "locks the second account after the first",
        kind: "method_called",
        method: "lock",
        receiver: "second.balance",
      },
      {
        name: "never locks the arguments in their given order",
        kind: "method_called",
        method: "lock",
        receiver: "from.balance",
        forbidden: true,
      },
    ],
    expectedOutput: "a: 100\nb: 50\ntotal: 150\n",
    referenceSolution: `use std::sync::{Arc, Mutex};
use std::thread;

struct Account {
    id: u32,
    balance: Mutex<i64>,
}

fn transfer(from: &Account, to: &Account, amount: i64) {
    let (first, second) = if from.id < to.id {
        (from, to)
    } else {
        (to, from)
    };

    let mut g1 = first.balance.lock().unwrap();
    let mut g2 = second.balance.lock().unwrap();

    if from.id == first.id {
        *g1 -= amount;
        *g2 += amount;
    } else {
        *g2 -= amount;
        *g1 += amount;
    }
}

fn main() {
    let a = Arc::new(Account {
        id: 1,
        balance: Mutex::new(100),
    });
    let b = Arc::new(Account {
        id: 2,
        balance: Mutex::new(50),
    });

    let mut handles = Vec::new();
    for _ in 0..50 {
        let (x, y) = (Arc::clone(&a), Arc::clone(&b));
        handles.push(thread::spawn(move || transfer(&x, &y, 1)));

        let (x, y) = (Arc::clone(&a), Arc::clone(&b));
        handles.push(thread::spawn(move || transfer(&y, &x, 1)));
    }

    for h in handles {
        h.join().unwrap();
    }

    let a_balance = *a.balance.lock().unwrap();
    let b_balance = *b.balance.lock().unwrap();

    println!("a: {}", a_balance);
    println!("b: {}", b_balance);
    println!("total: {}", a_balance + b_balance);
}
`,
  },

  "rust-concurrency-7": {
    instructions: `## Count without a lock, elect one winner

An atomic is read-modify-written by the hardware with no lock. \`compare_exchange\` sets the value only if it currently equals what you expected — \`Ok(previous)\` if you won, \`Err(actual)\` if you lost.

\`Ordering\` is not a speed knob; it constrains how surrounding memory operations may be reordered:

- **\`Relaxed\`** — atomic on this value only. Right for a statistics counter.
- **\`Release\`/\`Acquire\`** — publish data written before a store to whoever loads it.
- **\`SeqCst\`** — a single total order all threads agree on. Safest, slowest.

### Your task

1. \`Arc<AtomicU64>\` at \`0\`. Spawn eight threads, each \`fetch_add(1, Ordering::Relaxed)\` one thousand times. Join, then print the value with an \`Acquire\` load.
2. An \`AtomicBool\` at \`false\`. Call \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\` **twice**, printing each result with \`{:?}\`.

Expected output:

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — we won, and replaced a \`false\`. \`Err(true)\` — we lost, and here is what we found.

### Hints

- \`use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};\`
`,
    starterCode: `use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::Arc;
use std::thread;

fn main() {
    // 1. a lock-free counter

    // 2. a one-winner claim
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "increments the counter atomically",
        kind: "method_called",
        method: "fetch_add",
        args: "1, Ordering::Relaxed",
      },
      {
        name: "reads the counter with an acquiring load",
        kind: "method_called",
        method: "load",
        args: "Ordering::Acquire",
      },
      {
        name: "elects a winner with compare_exchange",
        kind: "method_called",
        method: "compare_exchange",
        args: "false, true, Ordering::AcqRel, Ordering::Acquire",
      },
      {
        name: "no mutex is used for the counter",
        kind: "expr_present",
        expr: "Mutex::new",
        forbidden: true,
      },
    ],
    expectedOutput: "hits: 8000\nfirst claim: Ok(false)\nsecond claim: Err(true)\n",
    referenceSolution: `use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::Arc;
use std::thread;

fn main() {
    let hits = Arc::new(AtomicU64::new(0));

    let mut handles = Vec::new();
    for _ in 0..8 {
        let hits = Arc::clone(&hits);
        handles.push(thread::spawn(move || {
            for _ in 0..1000 {
                hits.fetch_add(1, Ordering::Relaxed);
            }
        }));
    }

    for h in handles {
        h.join().unwrap();
    }

    println!("hits: {}", hits.load(Ordering::Acquire));

    let claimed = AtomicBool::new(false);
    let first = claimed.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire);
    let second = claimed.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire);

    println!("first claim: {:?}", first);
    println!("second claim: {:?}", second);
}
`,
  },

  "rust-concurrency-8": {
    instructions: `## Fan in, then feel the backpressure

A channel moves **ownership** between threads. \`mpsc\` is multi-producer, single-consumer: clone the sender, keep one receiver.

The receiver's iterator ends only when **every** sender is gone — including the original in \`main\`, which is why \`drop(tx)\` is not optional.

\`channel()\` is unbounded: producers never wait, and a slow consumer becomes an out-of-memory kill. \`sync_channel(n)\` is bounded, and that blocking **is** backpressure.

### Your task

1. \`mpsc::channel::<u64>()\`. Spawn three producers; producer \`id\` sends \`id * 10 + n\` for \`n\` in \`0..3\`. **Drop the original sender**, then collect the receiver into a \`Vec<u64>\`, sort it, and print it and its length.
2. \`mpsc::sync_channel::<u64>(1)\`. Send one value, print whether a second \`try_send\` **fails**, then \`recv()\` and print what came out.

Expected output:

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Sorting is what makes the fan-in deterministic — arrival order is not.

### Hints

- \`use std::sync::mpsc;\`
- \`rx.iter().collect()\` drains the channel until every sender is gone.
`,
    starterCode: `use std::sync::mpsc;
use std::thread;

fn main() {
    // 1. three producers into one receiver

    // 2. a bounded channel that refuses a second message
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "each producer gets its own sender",
        kind: "method_called",
        method: "clone",
        receiver: "tx",
      },
      {
        name: "drops the original sender so the receiver can finish",
        kind: "expr_present",
        expr: "drop(tx)",
      },
      {
        name: "creates a bounded channel",
        kind: "expr_present",
        expr: "mpsc::sync_channel::<u64>(1)",
      },
      {
        name: "probes the bound without blocking",
        kind: "method_called",
        method: "try_send",
        receiver: "btx",
      },
    ],
    expectedOutput:
      "received: [0, 1, 2, 10, 11, 12, 20, 21, 22]\ncount: 9\nbounded full: true\ndrained: 1\n",
    referenceSolution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel::<u64>();

    for id in 0..3u64 {
        let tx = tx.clone();
        thread::spawn(move || {
            for n in 0..3 {
                tx.send(id * 10 + n).unwrap();
            }
        });
    }
    drop(tx);

    let mut received: Vec<u64> = rx.iter().collect();
    received.sort();
    println!("received: {:?}", received);
    println!("count: {}", received.len());

    let (btx, brx) = mpsc::sync_channel::<u64>(1);
    btx.send(1).unwrap();
    println!("bounded full: {}", btx.try_send(2).is_err());
    println!("drained: {}", brx.recv().unwrap());
}
`,
  },
};
