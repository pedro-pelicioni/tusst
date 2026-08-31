import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Collections, Iterators & Closures — hidden grading data.

export const rustCollectionsIteratorsGraders: Record<
  string,
  AdvancedLessonContent
> = {
  "rust-collections-iterators-1": {
    instructions: `## Right container, right cost

\`Vec<T>\` is contiguous: O(1) push/pop at the **end**, O(n) insert/remove at the **front**. \`with_capacity\` allocates once instead of doubling repeatedly.

\`VecDeque<T>\` is a ring buffer: O(1) at **both** ends.

### Your task

1. \`Vec::with_capacity(4)\`, push \`1..=4\`, print the vector with \`{:?}\` and its \`capacity()\` — still exactly 4.
2. A \`VecDeque<i32>\`: \`push_back(2)\`, \`push_back(3)\`, \`push_front(1)\`. Print it with \`{:?}\`, then print \`pop_front()\` with \`{:?}\`.

Expected output:

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\`

### Hints

- \`use std::collections::VecDeque;\`
- \`for n in 1..=4\` is an inclusive range.
`,
    starterCode: `use std::collections::VecDeque;

fn main() {
    // 1. a Vec with a pre-allocated capacity

    // 2. a VecDeque pushed from both ends
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "pre-allocates the vector",
        kind: "expr_present",
        expr: "Vec::with_capacity(4)",
      },
      {
        name: "reports the capacity, not just the length",
        kind: "method_called",
        method: "capacity",
        receiver: "v",
      },
      {
        name: "pushes onto the front of the deque in O(1)",
        kind: "method_called",
        method: "push_front",
        receiver: "q",
      },
      {
        name: "pops from the front",
        kind: "method_called",
        method: "pop_front",
        receiver: "q",
      },
    ],
    expectedOutput: "vec: [1, 2, 3, 4] cap: 4\ndeque: [1, 2, 3]\nfront: Some(1)\n",
    referenceSolution: `use std::collections::VecDeque;

fn main() {
    let mut v: Vec<i32> = Vec::with_capacity(4);
    for n in 1..=4 {
        v.push(n);
    }
    println!("vec: {:?} cap: {}", v, v.capacity());

    let mut q: VecDeque<i32> = VecDeque::new();
    q.push_back(2);
    q.push_back(3);
    q.push_front(1);
    println!("deque: {:?}", q);
    println!("front: {:?}", q.pop_front());
}
`,
  },

  "rust-collections-iterators-2": {
    instructions: `## Order or speed

\`HashMap\` — O(1) average, **arbitrary** iteration order (randomised per run, on purpose).
\`BTreeMap\` — O(log n), **always sorted** by key, supports range queries.

Choose \`BTreeMap\` for sorted iteration, ranges, or deterministic output. \`HashMap\` otherwise.

The \`entry\` API hashes once where \`contains_key\` + \`insert\` hashes twice:

\`\`\`rust
*hits.entry(m).or_insert(0) += 1;
\`\`\`

### Your task

1. With a \`HashMap<&str, u32>\`, count occurrences in \`["getEvents", "sendTx", "getEvents"]\` using \`entry\`, then print the count for \`getEvents\`.
2. With a \`BTreeMap<&str, u32>\`, insert \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` in that order, collect its \`keys()\` into a \`Vec<&str>\`, and print them.

Expected output:

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\`

### Hints

- \`use std::collections::{BTreeMap, HashMap};\`
- \`.keys().copied().collect()\` turns \`&&str\` into \`&str\`.
`,
    starterCode: `use std::collections::{BTreeMap, HashMap};

fn main() {
    // 1. count with the entry API

    // 2. sorted keys from a BTreeMap
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "counts with the entry API rather than two lookups",
        kind: "method_called",
        method: "entry",
        receiver: "hits",
      },
      {
        name: "inserts a default of zero on first sight",
        kind: "method_called",
        method: "or_insert",
        args: "0",
      },
      {
        name: "does not pre-check with contains_key",
        kind: "method_called",
        method: "contains_key",
        forbidden: true,
      },
      {
        name: "reads the BTreeMap's keys in sorted order",
        kind: "method_called",
        method: "keys",
        receiver: "ordered",
      },
    ],
    expectedOutput: 'getEvents: 2\nsorted keys: ["api", "db", "rpc"]\n',
    referenceSolution: `use std::collections::{BTreeMap, HashMap};

fn main() {
    let mut hits: HashMap<&str, u32> = HashMap::new();
    for m in ["getEvents", "sendTx", "getEvents"] {
        *hits.entry(m).or_insert(0) += 1;
    }
    println!("getEvents: {}", hits["getEvents"]);

    let mut ordered: BTreeMap<&str, u32> = BTreeMap::new();
    for (k, v) in [("rpc", 3), ("api", 1), ("db", 2)] {
        ordered.insert(k, v);
    }
    let keys: Vec<&str> = ordered.keys().copied().collect();
    println!("sorted keys: {:?}", keys);
}
`,
  },

  "rust-collections-iterators-3": {
    instructions: `## Borrow, mutate, consume

| method | yields | collection after |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | untouched |
| \`.iter_mut()\` | \`&mut T\` | mutated in place |
| \`.into_iter()\` | \`T\` | consumed |

\`for x in collection\` desugars to \`into_iter()\` — which is why the next line using it will not compile.

### Your task

With \`let mut data = vec![1, 2, 3];\`:

1. \`.iter()\` + \`map\` doubling each into a new \`Vec<i32>\`; print it.
2. \`.iter_mut()\` adding \`10\` to each in place; print \`data\`.
3. \`.into_iter()\` + \`map\` turning each into a \`String\`; collect into \`Vec<String>\` and print it.

Expected output:

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\`
`,
    starterCode: `fn main() {
    let mut data = vec![1, 2, 3];

    // 1. borrow and double

    // 2. mutate in place

    // 3. consume into Strings
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "borrows without consuming",
        kind: "method_called",
        method: "iter",
        receiver: "data",
      },
      {
        name: "mutates every element in place",
        kind: "method_called",
        method: "iter_mut",
        receiver: "data",
      },
      {
        name: "consumes the vector at the end",
        kind: "method_called",
        method: "into_iter",
        receiver: "data",
      },
      {
        name: "writes through the mutable reference",
        kind: "expr_present",
        expr: "*n += 10",
      },
    ],
    expectedOutput:
      'borrowed: [2, 4, 6]\nmutated: [11, 12, 13]\nconsumed: ["11", "12", "13"]\n',
    referenceSolution: `fn main() {
    let mut data = vec![1, 2, 3];

    let doubled: Vec<i32> = data.iter().map(|n| n * 2).collect();
    println!("borrowed: {:?}", doubled);

    for n in data.iter_mut() {
        *n += 10;
    }
    println!("mutated: {:?}", data);

    let owned: Vec<String> = data.into_iter().map(|n| n.to_string()).collect();
    println!("consumed: {:?}", owned);
}
`,
  },

  "rust-collections-iterators-4": {
    instructions: `## Nothing runs until you ask

Adapters (\`map\`, \`filter\`, \`filter_map\`) are **lazy** — they build a pipeline. Work starts only at a consumer (\`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`).

That is why chaining allocates nothing between stages: each element flows through the whole chain one at a time.

### Your task

With \`let raw = vec!["12", "x", "30", "", "8"];\`:

1. \`.iter()\` → \`filter_map\` parsing each as \`i64\` and keeping successes → \`filter\` keeping \`>= 10\` → collect into \`Vec<i64>\`; print it.
2. Build a second chain mapping each entry to its \`.len()\` and bind it **without consuming**. Print \`nothing ran yet\`, then collect into \`Vec<usize>\` and print that.

Expected output:

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\`

### Hints

- \`s.parse::<i64>().ok()\` turns the \`Result\` into the \`Option\` \`filter_map\` wants.
- \`.collect::<Vec<usize>>()\` annotates the collect inline.
`,
    starterCode: `fn main() {
    let raw = vec!["12", "x", "30", "", "8"];

    // 1. parse, keep >= 10

    // 2. a lazy chain, consumed after the print
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "parses and filters in one pass",
        kind: "method_called",
        method: "filter_map",
      },
      { name: "filters the parsed values", kind: "method_called", method: "filter" },
      {
        name: "builds a chain without consuming it",
        kind: "let_binding",
        var: "lazy",
      },
      { name: "consumes the chains with collect", kind: "method_called", method: "collect" },
    ],
    expectedOutput:
      "kept: [12, 30]\nnothing ran yet\nlengths: [2, 1, 2, 0, 1]\n",
    referenceSolution: `fn main() {
    let raw = vec!["12", "x", "30", "", "8"];

    let parsed: Vec<i64> = raw
        .iter()
        .filter_map(|s| s.parse::<i64>().ok())
        .filter(|n| *n >= 10)
        .collect();
    println!("kept: {:?}", parsed);

    let lazy = raw.iter().map(|s| s.len());
    println!("nothing ran yet");
    println!("lengths: {:?}", lazy.collect::<Vec<usize>>());
}
`,
  },

  "rust-collections-iterators-5": {
    instructions: `## Aggregate three ways

\`fold\` carries an accumulator through the sequence from an explicit initial value. \`reduce\` takes its initial value from the first element, so it returns \`Option\`.

The accumulator need not be a number — building a \`String\` is a fold whose accumulator is the string.

### Your task

With \`let latencies = vec![12u64, 40, 7, 95, 23];\`:

1. \`fold\` from \`0u64\` to a total; print it.
2. \`.copied().reduce(u64::max)\` for the worst; print with \`{:?}\`.
3. \`fold\` from \`String::new()\` joining the values with \`'|'\`; print it.

Expected output:

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\`

### Hints

- The string fold's closure takes \`|mut acc, n|\` and returns \`acc\`.
- Guard the separator with \`if !acc.is_empty()\`.
`,
    starterCode: `fn main() {
    let latencies = vec![12u64, 40, 7, 95, 23];

    // 1. fold to a total

    // 2. reduce to the worst

    // 3. fold to a joined String
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "folds from an explicit zero",
        kind: "method_called",
        method: "fold",
        args: "0u64, |acc, n| acc + n",
      },
      {
        name: "reduces without an initial value",
        kind: "method_called",
        method: "reduce",
        args: "u64::max",
      },
      {
        name: "folds into a String accumulator",
        kind: "expr_present",
        expr: "String::new()",
      },
      {
        name: "separates the entries with a pipe",
        kind: "method_called",
        method: "push",
        args: "'|'",
      },
    ],
    expectedOutput: "total: 177\nworst: Some(95)\nsummary: 12|40|7|95|23\n",
    referenceSolution: `fn main() {
    let latencies = vec![12u64, 40, 7, 95, 23];

    let total = latencies.iter().fold(0u64, |acc, n| acc + n);
    println!("total: {}", total);

    let worst = latencies.iter().copied().reduce(u64::max);
    println!("worst: {:?}", worst);

    let summary = latencies.iter().fold(String::new(), |mut acc, n| {
        if !acc.is_empty() {
            acc.push('|');
        }
        acc.push_str(&n.to_string());
        acc
    });
    println!("summary: {}", summary);
}
`,
  },

  "rust-collections-iterators-6": {
    instructions: `## The compiler picks the trait

| trait | body does | callable |
| --- | --- | --- |
| \`FnOnce\` | consumes a capture | once |
| \`FnMut\` | mutates a capture | many times, needs \`&mut\` |
| \`Fn\` | only reads captures | many times, from \`&\` |

They nest, so \`Fn\` is the **most** restrictive bound you can ask for. Bound on the loosest one that lets you call it as often as you need.

### Your task

1. \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\` returning \`f(1) + f(2)\`. Call it with a closure multiplying by a captured \`factor = 10\`.
2. \`fn call_fn_mut<F: FnMut()>(mut f: F)\` calling \`f()\` twice. Call it with a closure incrementing a captured \`count\`, then print \`count\`.
3. \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` calling \`f()\` once. Call it with a \`move\` closure returning a captured \`String\`.

Expected output:

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\`

### Hints

- The \`FnMut\` parameter must be \`mut f: F\` — calling it borrows the closure exclusively.
- The captured \`String\` holds \`consumed\`.
`,
    starterCode: `fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64 {
    // f(1) + f(2)
}

fn call_fn_mut<F: FnMut()>(mut f: F) {
    // call twice
}

fn call_fn_once<F: FnOnce() -> String>(f: F) -> String {
    // call once
}

fn main() {
    // one closure per trait
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the Fn callback is called twice with different arguments",
        kind: "expr_present",
        expr: "f(1) + f(2)",
      },
      {
        name: "the FnMut parameter is bound mutably",
        kind: "fn_defined",
        fn: "call_fn_mut",
        params: [{ name: "f", ty: "F" }],
      },
      {
        name: "the FnOnce closure takes ownership with move",
        kind: "expr_present",
        expr: "call_fn_once(move || owned)",
      },
      {
        name: "the FnMut closure mutates its capture",
        kind: "expr_present",
        expr: "count += 1",
      },
    ],
    expectedOutput: "Fn: 30\nFnMut: 2\nFnOnce: consumed\n",
    referenceSolution: `fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64 {
    f(1) + f(2)
}

fn call_fn_mut<F: FnMut()>(mut f: F) {
    f();
    f();
}

fn call_fn_once<F: FnOnce() -> String>(f: F) -> String {
    f()
}

fn main() {
    let factor = 10;
    println!("Fn: {}", call_fn(|n| n * factor));

    let mut count = 0;
    call_fn_mut(|| count += 1);
    println!("FnMut: {}", count);

    let owned = String::from("consumed");
    println!("FnOnce: {}", call_fn_once(move || owned));
}
`,
  },

  "rust-collections-iterators-7": {
    instructions: `## Closures that outlive their scope

A closure captures by reference by default. \`move\` forces every capture to be taken **by value**, which is what a closure returned from a function needs.

\`impl Fn() -> T\` names one concrete anonymous type: static dispatch, no allocation. \`Box<dyn Fn() -> T>\` is required when different branches return different closures, or when you store several together.

### Your task

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — owns \`n\`, increments and returns it on each call.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — returns \`"hello <name>"\`.
3. In \`main\`, call the counter three times into **separate bindings**, print all three on one line, then print the greeter's output for \`rpc\`.

Expected output:

\`\`\`text
11 12 13
hello rpc
\`\`\`

The counter starts at \`10\`. Bind each call before printing — three \`&mut\` borrows inside one \`println!\` is a fight you do not need.
`,
    starterCode: `fn make_counter(start: u32) -> impl FnMut() -> u32 {
    // own the state, increment on each call
}

fn make_greeter(name: String) -> Box<dyn Fn() -> String> {
    // own the name, greet on each call
}

fn main() {
    // three counter calls, then the greeter
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the counter returns an owning closure with static dispatch",
        kind: "fn_defined",
        fn: "make_counter",
        returns: "impl FnMut() -> u32",
      },
      {
        name: "the greeter is boxed as a trait object",
        kind: "fn_defined",
        fn: "make_greeter",
        returns: "Box<dyn Fn() -> String>",
      },
      {
        name: "the greeter's closure takes ownership of the name",
        kind: "expr_present",
        expr: 'move || format!("hello {}", name)',
      },
      {
        name: "the counter is created starting at ten",
        kind: "expr_present",
        expr: "make_counter(10)",
      },
    ],
    expectedOutput: "11 12 13\nhello rpc\n",
    referenceSolution: `fn make_counter(start: u32) -> impl FnMut() -> u32 {
    let mut n = start;
    move || {
        n += 1;
        n
    }
}

fn make_greeter(name: String) -> Box<dyn Fn() -> String> {
    Box::new(move || format!("hello {}", name))
}

fn main() {
    let mut next = make_counter(10);
    let a = next();
    let b = next();
    let c = next();
    println!("{} {} {}", a, b, c);

    let greet = make_greeter(String::from("rpc"));
    println!("{}", greet());
}
`,
  },
};
