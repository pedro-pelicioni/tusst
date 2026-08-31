import type { LessonStep } from "@/content/steps";

// Advanced · Collections, Iterators & Closures.

export const rustCollectionsIteratorsSteps: Record<string, LessonStep[]> = {
  "rust-collections-iterators-1": [
    {
      kind: "theory",
      body: `\`Vec<T>\` is a contiguous, growable array. Its costs are worth knowing exactly:

| operation | cost |
| --- | --- |
| \`push\` / \`pop\` at the end | O(1) amortised |
| \`insert\` / \`remove\` at the front | O(n) — everything shifts |
| index | O(1) |

"Amortised" covers the growth: when the buffer is full, \`Vec\` allocates a larger one (typically double) and copies everything across. Averaged over many pushes that is O(1), but any *individual* push can be the expensive one.`,
    },
    {
      kind: "theory",
      body: `Two consequences you can act on.

**If you know the size, say so.** \`Vec::with_capacity(n)\` allocates once. In a loop pushing a known number of items, this removes every reallocation and every copy — the cheapest performance win in the language.

**If you push and pop at both ends, use \`VecDeque<T>\`.** It is a ring buffer: \`push_front\` and \`pop_front\` are O(1), where \`Vec::insert(0, x)\` is O(n). This is the difference between a queue that scales and one that quietly becomes quadratic.

\`\`\`rust
let mut q: VecDeque<i32> = VecDeque::new();
q.push_back(2);
q.push_front(1);     // O(1) — a Vec would shift every element
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "A loop pushes exactly 10 000 known items into a `Vec::new()`. What does `with_capacity(10_000)` save?",
      options: [
        "Roughly a dozen reallocations, each copying everything pushed so far",
        "Nothing — `Vec` already allocates its final size on the first push",
        "The bounds check on each push",
      ],
      answer: 0,
      explain:
        "Doubling from 4 to 10 000 is about eleven growth steps, and the last few copy thousands of elements each. One up-front allocation removes all of it.",
    },
    {
      kind: "fill",
      prompt: "Add to the front of a queue in constant time.",
      file: "main.rs",
      before: "let mut q: VecDeque<i32> = VecDeque::new();\nq.",
      after: "(1);",
      choices: ["push_front", "insert", "push"],
      answer: 0,
      explain:
        "`VecDeque` is a ring buffer, so a front insert is a pointer move. The same operation on a `Vec` shifts every element.",
    },
    {
      kind: "quiz",
      question:
        "A job queue does `jobs.remove(0)` on a `Vec` each tick, with thousands of jobs. What is the symptom?",
      options: [
        "Throughput degrades with queue depth — each pop shifts every remaining element",
        "Memory grows without bound because `remove` never frees",
        "Nothing measurable; `remove(0)` is optimised to a pointer bump",
      ],
      answer: 0,
      explain:
        "The classic quadratic queue. It is invisible in a test with ten jobs and dominates the profile at ten thousand — replace the `Vec` with a `VecDeque` and it disappears.",
    },
    {
      kind: "editor",
      intro: `### Right container, right cost

1. Build a \`Vec<i32>\` with \`Vec::with_capacity(4)\`, push \`1..=4\`, and print the vector with \`{:?}\` and its \`capacity()\` — it should still be exactly 4.
2. Build a \`VecDeque<i32>\`, \`push_back\` \`2\` then \`3\`, \`push_front\` \`1\`, print it with \`{:?}\`, then print \`pop_front()\` with \`{:?}\`.

Expected output:

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\``,
    },
  ],

  "rust-collections-iterators-2": [
    {
      kind: "theory",
      body: `The two maps differ on one axis that decides everything else: **ordering**.

\`HashMap<K, V>\` — O(1) average lookup, insert and remove. Iteration order is **arbitrary and deliberately randomised** between runs. Requires \`K: Hash + Eq\`.

\`BTreeMap<K, V>\` — O(log n) for the same operations. Iteration is **always in sorted key order**, and it supports range queries: \`map.range("a".."m")\`. Requires \`K: Ord\`.`,
    },
    {
      kind: "theory",
      body: `Pick \`BTreeMap\` when you need sorted iteration, range scans, or deterministic output (a config dump, a test snapshot, a signed payload). Pick \`HashMap\` otherwise — it is faster and it is the right default.

The \`entry\` API is the idiom worth memorising for either one:

\`\`\`rust
*hits.entry(method).or_insert(0) += 1;
\`\`\`

One lookup, not two. The naive version — \`if map.contains_key(k) { ... } else { ... }\` — hashes the key twice and borrows the map twice, which the borrow checker will also object to. \`or_insert_with(Vec::new)\` is the same pattern when the default is not free to construct.`,
    },
    {
      kind: "quiz",
      question:
        "Iterating the same `HashMap` twice in one process can yield different orders. Why is that deliberate?",
      options: [
        "Randomised hashing defends against collision attacks, and unstable order stops code depending on an accident",
        "It is a bug in the standard library retained for compatibility",
        "The order depends on how much memory is free at the time",
      ],
      answer: 0,
      explain:
        "Both halves are the point: a predictable hash lets an attacker force every key into one bucket, and code that quietly relies on iteration order breaks on any resize.",
    },
    {
      kind: "fill",
      prompt: "Increment a counter, creating it at zero on first sight.",
      file: "main.rs",
      before: "*hits.",
      after: "(m).or_insert(0) += 1;",
      choices: ["entry", "get", "insert"],
      answer: 0,
      explain:
        "`entry` hashes once and hands back a slot you can fill or modify. `get` followed by `insert` hashes twice and needs two separate borrows.",
    },
    {
      kind: "quiz",
      question:
        "A service dumps its config as JSON, and the diff between two runs is noisy despite no config change. What is the likely cause?",
      options: [
        "It is serialising from a `HashMap`, whose iteration order varies per run — a `BTreeMap` would make the output deterministic",
        "The JSON serialiser is not deterministic",
        "The config is being read before it is fully loaded",
      ],
      answer: 0,
      explain:
        "Deterministic output is the standard reason to pay `BTreeMap`'s O(log n). The same applies to anything hashed or signed, where byte-for-byte stability is required.",
    },
    {
      kind: "editor",
      intro: `### Order or speed

1. With a \`HashMap<&str, u32>\`, count occurrences in \`["getEvents", "sendTx", "getEvents"]\` using the \`entry\` API, then print the count for \`getEvents\`.
2. With a \`BTreeMap<&str, u32>\`, insert \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` in that order, then collect its keys into a \`Vec<&str>\` and print them — sorted, regardless of insertion order.

Expected output:

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-3": [
    {
      kind: "theory",
      body: `Three ways to iterate, and the difference is what each hands you:

| method | yields | collection after |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | untouched |
| \`.iter_mut()\` | \`&mut T\` | mutated in place |
| \`.into_iter()\` | \`T\` | **consumed** |

\`\`\`rust
let doubled: Vec<i32> = data.iter().map(|n| n * 2).collect();  // data survives
for n in data.iter_mut() { *n += 10; }                          // data changes
let owned: Vec<String> = data.into_iter().map(...).collect();   // data is gone
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`for x in &collection\` is sugar for \`.iter()\`, \`for x in &mut collection\` for \`.iter_mut()\`, and \`for x in collection\` for \`.into_iter()\`.

That last one is the one that surprises people: writing \`for item in items\` **moves** \`items\`, and the next line that uses it will not compile. The fix is almost always a single \`&\`.

Choose \`into_iter\` deliberately, not by accident. When you are transforming owned data into other owned data and will not need the original — mapping \`Vec<Row>\` into \`Vec<Response>\` — it is exactly right, and it avoids cloning every element.`,
    },
    {
      kind: "quiz",
      question:
        "`for item in items { ... }` compiles, but the next line using `items` does not. Why?",
      options: [
        "The loop desugars to `into_iter()`, which consumed the collection",
        "The loop borrowed `items` and the borrow lasts to the end of the function",
        "`items` must be declared `mut` to be read after a loop",
      ],
      answer: 0,
      explain:
        "One character fixes it: `for item in &items`. Worth internalising, because the error message points at the second line and the cause is on the first.",
    },
    {
      kind: "fill",
      prompt: "Modify every element of the vector in place.",
      file: "main.rs",
      before: "for n in data.",
      after: "() {\n    *n += 10;\n}",
      choices: ["iter_mut", "iter", "into_iter"],
      answer: 0,
      explain:
        "`iter_mut` yields `&mut i32`, so `*n += 10` writes through it. `iter` would yield `&i32`, which cannot be assigned to.",
    },
    {
      kind: "quiz",
      question:
        "You are turning a `Vec<Row>` into a `Vec<Response>` and will not need the rows again. Which is right?",
      options: [
        "`into_iter()` — it moves each row into the mapping closure, with no clone per element",
        "`iter()` plus `.clone()` inside the closure, to leave the original intact",
        "`iter_mut()`, mutating each row into a response",
      ],
      answer: 0,
      explain:
        "This is where `into_iter` earns its place. Reaching for `iter().cloned()` out of habit here allocates once per element for data you were about to drop.",
    },
    {
      kind: "editor",
      intro: `### Borrow, mutate, consume

With \`let mut data = vec![1, 2, 3];\`:

1. \`.iter()\` and \`map\` to double each into a new \`Vec<i32>\`, print it — \`data\` survives.
2. \`.iter_mut()\` to add \`10\` to each in place, print \`data\`.
3. \`.into_iter()\` and \`map\` to turn each into a \`String\`, collect into \`Vec<String>\`, print it.

Expected output:

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-4": [
    {
      kind: "theory",
      body: `Iterator adapters are **lazy**. \`map\`, \`filter\` and \`filter_map\` build a new iterator and run nothing:

\`\`\`rust
let lazy = raw.iter().map(|s| s.len());   // zero elements processed
\`\`\`

Work begins only when something *consumes* the iterator: \`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`. Until then you are assembling a pipeline, not running one.`,
    },
    {
      kind: "theory",
      body: `Laziness is what makes chaining free. \`filter\` then \`map\` does **not** build an intermediate \`Vec\` — each element flows through the whole chain one at a time, and the compiler usually collapses it into a single loop with no allocation.

It also allows short-circuiting: \`.find(...)\` on a million-element chain stops at the first match, and the elements after it are never touched.

\`filter_map\` is worth calling out. It maps and filters in one pass, keeping only the \`Some\`:

\`\`\`rust
.filter_map(|s| s.parse::<i64>().ok())    // parse, drop the failures
\`\`\`

That is the idiomatic way to parse a batch where some entries are junk — and it discards the reason, so use \`.map(...).collect::<Result<Vec<_>, _>>()\` instead when a failure should abort the batch.`,
    },
    {
      kind: "quiz",
      question:
        "`raw.iter().map(expensive).filter(pred)` is assigned to a variable and never consumed. How many times does `expensive` run?",
      options: [
        "Zero — adapters build a pipeline and nothing executes until a consumer asks for elements",
        "Once per element, when the chain is constructed",
        "Once, on the first element, to infer the types",
      ],
      answer: 0,
      explain:
        "This is also why `#[must_use]` is on `Iterator`: an unconsumed chain is almost always a bug, and the compiler warns about it.",
    },
    {
      kind: "fill",
      prompt: "Parse each entry and silently drop the ones that fail.",
      file: "main.rs",
      before: "raw.iter().",
      after: "(|s| s.parse::<i64>().ok())",
      choices: ["filter_map", "map", "filter"],
      answer: 0,
      explain:
        "`filter_map` keeps the `Some` and discards the `None` in one pass. `map` alone would leave you with `Vec<Option<i64>>`.",
    },
    {
      kind: "quiz",
      question:
        "When is `filter_map(|x| f(x).ok())` the wrong choice for parsing a batch?",
      options: [
        "When a single bad entry should fail the whole batch — it discards the error along with the element",
        "When the batch is large, because `filter_map` allocates per element",
        "When the closure captures a variable from the enclosing scope",
      ],
      answer: 0,
      explain:
        "Silently dropping malformed entries is a real decision, and often the wrong one for financial data. `.collect::<Result<Vec<_>, _>>()` fails the batch on the first error instead.",
    },
    {
      kind: "editor",
      intro: `### Nothing runs until you ask

With \`let raw = vec!["12", "x", "30", "", "8"];\`:

1. Chain \`.iter()\`, \`filter_map\` parsing each as \`i64\` and keeping the successes, then \`filter\` keeping only values \`>= 10\`. Collect into \`Vec<i64>\` and print it.
2. Build a second chain mapping each entry to its \`.len()\` and bind it **without** consuming it. Print \`nothing ran yet\`, then collect it into \`Vec<usize>\` and print that.

Expected output:

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\``,
    },
  ],

  "rust-collections-iterators-5": [
    {
      kind: "theory",
      body: `\`fold\` carries an accumulator through the whole sequence. It is the most general consumer there is — \`sum\`, \`count\`, \`max\` and \`collect\` are all folds underneath.

\`\`\`rust
let total = latencies.iter().fold(0u64, |acc, n| acc + n);
\`\`\`

Three parts: the initial value, the accumulator, the current element. The closure returns the next accumulator.

\`reduce\` is \`fold\` with no initial value — it uses the first element instead, and therefore returns \`Option\` because an empty sequence has no answer:

\`\`\`rust
let worst = latencies.iter().copied().reduce(u64::max);   // Option<u64>
\`\`\``,
    },
    {
      kind: "theory",
      body: `The accumulator does not have to be a number. Building a \`String\` is a fold whose accumulator is the string being built:

\`\`\`rust
.fold(String::new(), |mut acc, n| {
    if !acc.is_empty() { acc.push('|'); }
    acc.push_str(&n.to_string());
    acc
})
\`\`\`

Note \`|mut acc, ...|\` and returning \`acc\` — the accumulator is *moved* through each step, which is what keeps this allocation-free per iteration.

Do not force it. If a plain \`for\` loop with a mutable local is clearer, write that: the compiler produces the same code, and the fold version of a complex body is genuinely harder to read.`,
    },
    {
      kind: "quiz",
      question: "Why does `reduce` return `Option<T>` when `fold` does not?",
      options: [
        "It takes its initial value from the first element, so an empty sequence has no result to give",
        "It may fail if the closure panics",
        "It is lazy, and the `Option` signals whether it has been consumed",
      ],
      answer: 0,
      explain:
        "`fold` always has an answer because you supplied the identity. `reduce` on an empty iterator is genuinely undefined, and the `Option` says so.",
    },
    {
      kind: "fill",
      prompt: "Carry a running total through the sequence from an explicit zero.",
      file: "main.rs",
      before: "latencies.iter().",
      after: "(0u64, |acc, n| acc + n)",
      choices: ["fold", "reduce", "scan"],
      answer: 0,
      explain:
        "`reduce` takes no initial value. `scan` is the variant that yields *every* intermediate accumulator instead of only the last.",
    },
    {
      kind: "quiz",
      question:
        "Which of these is the honest reason to prefer a `for` loop over a `fold`?",
      options: [
        "The body is complex enough that the fold reads worse — the generated code is the same either way",
        "`fold` allocates a closure on the heap per call",
        "`for` loops are faster because they avoid the iterator protocol",
      ],
      answer: 0,
      explain:
        "Both compile to the same loop. Readability is the whole decision, and 'more functional' is not automatically more readable.",
    },
    {
      kind: "editor",
      intro: `### Aggregate three ways

With \`let latencies = vec![12u64, 40, 7, 95, 23];\`:

1. \`fold\` from \`0u64\` to a total, print it.
2. \`.copied().reduce(u64::max)\` for the worst, print with \`{:?}\`.
3. \`fold\` from \`String::new()\` joining the values with \`'|'\`, print it.

Expected output:

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\``,
    },
  ],

  "rust-collections-iterators-6": [
    {
      kind: "theory",
      body: `A closure implements one of three traits, and **you do not choose** — the compiler decides from what the body does with its captures.

| trait | body does | callable |
| --- | --- | --- |
| \`FnOnce\` | **consumes** a capture | once |
| \`FnMut\` | **mutates** a capture | many times, needs \`&mut\` |
| \`Fn\` | only **reads** captures | many times, from \`&\` |

They nest: every \`Fn\` is also \`FnMut\`, and every \`FnMut\` is also \`FnOnce\`. So bounding a parameter on \`Fn\` is the *most* restrictive thing you can ask for.`,
    },
    {
      kind: "theory",
      body: `Which means the rule for writing a signature is the inverse of the intuition:

**Bound on the loosest trait that lets you call it as often as you need.** \`FnOnce\` if you call it once, \`FnMut\` if you call it repeatedly and do not mind it holding mutable state, \`Fn\` only if you need to call it from several places at once — for instance from multiple threads.

\`\`\`rust
fn call_once<F: FnOnce() -> String>(f: F) -> String { f() }
fn call_mut<F: FnMut()>(mut f: F) { f(); f(); }
fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64 { f(1) + f(2) }
\`\`\`

Note \`mut f\` in the \`FnMut\` case: calling it needs an exclusive borrow of the closure itself, because the closure owns the state it is mutating.`,
    },
    {
      kind: "quiz",
      question:
        "A closure body does `count += 1` on a captured local. Which traits does it implement?",
      options: [
        "`FnMut` and `FnOnce` — but not `Fn`, because calling it mutates its captured state",
        "All three — mutation of a capture does not affect the trait",
        "`FnOnce` only, because mutation consumes the capture",
      ],
      answer: 0,
      explain:
        "This is why a parameter bounded `F: Fn()` rejects a counter closure. The traits describe what calling *does*, not what the closure returns.",
    },
    {
      kind: "fill",
      prompt:
        "Bound a callback that will be invoked twice and is allowed to keep mutable state.",
      file: "main.rs",
      before: "fn call_fn_mut<F: ",
      after: ">(mut f: F) {",
      choices: ["FnMut()", "Fn()", "FnOnce()"],
      answer: 0,
      explain:
        "`FnOnce` cannot be called twice, and `Fn` would reject any closure that mutates a capture — which excludes most useful callbacks.",
    },
    {
      kind: "quiz",
      question:
        "A callback parameter is bounded `F: Fn()` and a caller's closure fails to compile. What is the usual fix?",
      options: [
        "Loosen the bound to `FnMut` — unless the callback genuinely needs to be called from several places at once",
        "Ask the caller to wrap their state in a `RefCell`",
        "Change the parameter to `&dyn Fn()`",
      ],
      answer: 0,
      explain:
        "`RefCell` does work — it converts the compile-time restriction into a runtime one — but reaching for it to satisfy an over-tight bound is solving your own API's problem in the caller's code.",
    },
    {
      kind: "editor",
      intro: `### The compiler picks the trait

1. \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\` returning \`f(1) + f(2)\`. Call it with a closure multiplying by a captured \`factor = 10\`.
2. \`fn call_fn_mut<F: FnMut()>(mut f: F)\` calling \`f()\` twice. Call it with a closure incrementing a captured \`count\`, then print \`count\`.
3. \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` calling \`f()\` once. Call it with a \`move\` closure returning a captured \`String\`.

Expected output:

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\``,
    },
  ],

  "rust-collections-iterators-7": [
    {
      kind: "theory",
      body: `By default a closure captures by reference — the least it can get away with. That is right for a closure used immediately, and wrong for one that **outlives the scope it was created in**.

\`move\` forces every capture to be taken by value:

\`\`\`rust
fn make_greeter(name: String) -> Box<dyn Fn() -> String> {
    Box::new(move || format!("hello {name}"))
}
\`\`\`

Without \`move\`, the closure would hold a reference to \`name\`, which dies when the function returns. With it, the closure owns \`name\` and can go anywhere.`,
    },
    {
      kind: "theory",
      body: `Two return shapes for a closure, and the choice is the same generic-versus-object trade as before:

**\`impl Fn() -> T\`** — one concrete anonymous type, static dispatch, no allocation. Use it when the function returns exactly one closure.

**\`Box<dyn Fn() -> T>\`** — heap-allocated, dynamically dispatched. Necessary when different branches return *different* closures, or when you need to store several in a collection.

\`\`\`rust
fn make_counter(start: u32) -> impl FnMut() -> u32 {
    let mut n = start;
    move || { n += 1; n }
}
\`\`\`

That closure owns \`n\`. Each call mutates its own state and it survives every call — this is a state machine with no struct declaration.`,
    },
    {
      kind: "quiz",
      question:
        "A function returns `impl Fn() -> String` over a locally built `String`, without `move`. What happens?",
      options: [
        "It does not compile — the closure borrows a local that dies when the function returns",
        "It compiles, and the returned closure sees an empty string",
        "It compiles; Rust extends the local's lifetime to match the closure",
      ],
      answer: 0,
      explain:
        "This is one of the most common `move` prompts in the language, and the compiler's suggestion is exactly right: add `move`.",
    },
    {
      kind: "fill",
      prompt:
        "Return a closure that owns its captured state, with static dispatch and no allocation.",
      file: "main.rs",
      before: "fn make_counter(start: u32) -> ",
      after: " {\n    let mut n = start;\n    move || { n += 1; n }\n}",
      choices: ["impl FnMut() -> u32", "Box<dyn Fn() -> u32>", "fn() -> u32"],
      answer: 0,
      explain:
        "It must be `FnMut` (it mutates `n`), and `impl` avoids the box. `fn() -> u32` is a plain function pointer, which cannot carry captured state at all.",
    },
    {
      kind: "quiz",
      question: "When must you box a returned closure instead of using `impl Fn`?",
      options: [
        "When different branches return different closures — `impl Trait` names one concrete type",
        "Whenever the closure is `move`",
        "Whenever the closure captures more than one variable",
      ],
      answer: 0,
      explain:
        "Every closure is its own anonymous type, so two closure literals are two types even if they look identical. `impl Trait` can only stand for one of them.",
    },
    {
      kind: "editor",
      intro: `### Closures that outlive their scope

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — owns \`n\`, increments and returns it on each call.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — returns \`"hello <name>"\`.
3. In \`main\`, call the counter three times into separate bindings and print all three on one line, then print the greeter's output for \`rpc\`.

Expected output:

\`\`\`text
11 12 13
hello rpc
\`\`\`

The counter starts at \`10\`. Bind each call to its own variable before printing — three \`&mut\` borrows inside one \`println!\` is a fight you do not need.`,
    },
  ],
};
