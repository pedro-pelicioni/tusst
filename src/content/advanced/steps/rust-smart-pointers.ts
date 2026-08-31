import type { LessonStep } from "@/content/steps";

// Advanced · Smart Pointers & Interior Mutability.

export const rustSmartPointersSteps: Record<string, LessonStep[]> = {
  "rust-smart-pointers-1": [
    {
      kind: "theory",
      body: `\`Box<T>\` is the simplest smart pointer: one heap allocation, one owner, freed when the box drops. It adds no reference counting and no runtime checks.

Its defining use is giving a **recursive type a known size**:

\`\`\`rust
enum Expr {
    Num(i64),
    Add(Expr, Expr),        // error: recursive type has infinite size
}
\`\`\`

To lay out \`Expr\`, the compiler must know how big \`Expr\` is — which requires knowing how big \`Expr\` is. A box breaks the loop: it is always one pointer wide, whatever it points to.`,
    },
    {
      kind: "theory",
      body: `\`\`\`rust
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),   // fine — two pointers
}
\`\`\`

This is how every tree, list and AST is built in Rust, and it is what \`Box<dyn Trait>\` is doing too: \`dyn Trait\` has no known size, so it lives behind a pointer.

Matching through a box needs nothing special — \`match e { Expr::Add(a, b) => ... }\` gives you \`&Box<Expr>\`, and deref coercion means you can pass it straight to a function taking \`&Expr\`.

The cost is one allocation per node and one pointer hop per traversal step. For an AST that is nothing. For a hot data structure with millions of nodes it is the reason arena allocators exist.`,
    },
    {
      kind: "quiz",
      question: "Why does a recursive enum need a `Box` around its own type?",
      options: [
        "The compiler must compute a fixed size for the type, and a directly nested variant makes that size infinite",
        "Recursion is only allowed on heap-allocated data in Rust",
        "Without `Box` the enum would be copied on every match",
      ],
      answer: 0,
      explain:
        "A `Box` is one pointer wide regardless of what it points to, so the size computation terminates. The heap allocation is a consequence, not the goal.",
    },
    {
      kind: "fill",
      prompt: "Make the recursive variant representable.",
      file: "main.rs",
      before: "enum Expr {\n    Num(i64),\n    Add(",
      after: ", Box<Expr>),\n}",
      choices: ["Box<Expr>", "Expr", "&Expr"],
      answer: 0,
      explain:
        "`&Expr` would also be one pointer wide, but it borrows — the enum would need a lifetime parameter and could not own its children.",
    },
    {
      kind: "quiz",
      question:
        "What does `Box<T>` add over holding a `T` directly, besides the heap allocation?",
      options: [
        "Nothing — no reference count, no runtime borrow checks, single ownership as usual",
        "Shared ownership, like a lightweight `Rc`",
        "Interior mutability, so the value can be modified through a shared reference",
      ],
      answer: 0,
      explain:
        "`Box` is the one smart pointer with no extra semantics. That is why it is the right default whenever you need indirection and nothing more.",
    },
    {
      kind: "editor",
      intro: `### An expression tree

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`.
2. \`fn eval(e: &Expr) -> i64\` matching both variants, recursing on \`Add\`.
3. In \`main\`, build \`2 + (3 + 4)\` as a tree, print the evaluated value, then print the tree with \`{:?}\`.

Expected output:

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

Note that \`Box\`'s \`Debug\` is transparent — it prints what it points to.`,
    },
  ],

  "rust-smart-pointers-2": [
    {
      kind: "theory",
      body: `\`Rc<T>\` is **reference counted shared ownership**, for a single thread. Every \`Rc::clone\` bumps a counter; every drop decrements it. The value is freed when the count reaches zero.

\`\`\`rust
let config = Rc::new(String::from("timeout=30s"));
let a = Rc::clone(&config);        // count: 2
let b = Rc::clone(&config);        // count: 3
drop(b);                           // count: 2
\`\`\`

\`Rc::clone(&x)\` is idiomatic rather than \`x.clone()\`, and the reason is readability: it makes it obvious at the call site that this is a cheap counter bump, not a deep copy of the data.`,
    },
    {
      kind: "theory",
      body: `Two properties decide when \`Rc\` is the right tool.

**It is immutable.** \`Rc<T>\` gives you \`&T\` and nothing else. Several owners each holding \`&mut T\` would break the aliasing rule, so mutation requires pairing it with \`RefCell\` — the next lesson.

**It is not \`Send\`.** The counter is a plain integer with non-atomic increments, so two threads cloning at once would corrupt it. The compiler rejects that at compile time, which is why the multi-threaded version, \`Arc\`, exists as a separate type: you pay for the atomic counter only when you actually share across threads.

Use \`Rc\` for a graph or tree where nodes have several parents, or for configuration shared by many single-threaded owners. Reach for it *after* trying plain borrows — a \`&T\` costs nothing and is usually enough.`,
    },
    {
      kind: "quiz",
      question:
        "Why is `Rc::clone(&x)` preferred over `x.clone()` when both compile to the same thing?",
      options: [
        "It makes the call site say 'this is a counter bump', not 'this deep-copies the data'",
        "`x.clone()` performs a deep copy of the inner value",
        "`x.clone()` does not increment the reference count",
      ],
      answer: 0,
      explain:
        "Purely a readability convention, and a valuable one: `clone()` on a large struct usually means an allocation, so distinguishing the cheap case at a glance is worth the extra characters.",
    },
    {
      kind: "fill",
      prompt: "Read how many owners currently hold the value.",
      file: "main.rs",
      before: 'println!("count: {}", Rc::',
      after: "(&config));",
      choices: ["strong_count", "len", "count"],
      answer: 0,
      explain:
        "`strong_count` is the owning count. Its counterpart `weak_count` tracks non-owning `Weak` handles, which do not keep the value alive.",
    },
    {
      kind: "quiz",
      question: "Why is `Rc<T>` deliberately not `Send`?",
      options: [
        "Its counter uses non-atomic increments, so two threads cloning at once would corrupt it",
        "The value it points to is always heap-allocated, and the heap is thread-local",
        "It is `Send`, but only when `T: Sync`",
      ],
      answer: 0,
      explain:
        "This is a deliberate split rather than an oversight: single-threaded code should not pay for atomics. `Arc` is the same type with an atomic counter.",
    },
    {
      kind: "editor",
      intro: `### Count the owners

1. Wrap a \`String\` holding \`timeout=30s\` in an \`Rc\` and print \`Rc::strong_count\`.
2. Make two clones with \`Rc::clone\`, print the count again, and print the value through one of them.
3. \`drop\` one clone and print the count once more.

Expected output:

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\``,
    },
  ],

  "rust-smart-pointers-3": [
    {
      kind: "theory",
      body: `\`RefCell<T>\` moves the borrow check from **compile time to runtime**. The rule is unchanged — many shared borrows or one exclusive borrow — but it is now counted at runtime, and violating it **panics** instead of failing to compile.

\`\`\`rust
let cell = RefCell::new(Vec::new());
cell.borrow_mut().push("started");    // &mut, released at end of statement
println!("{}", cell.borrow().len());  // & — fine, the mut borrow is gone
\`\`\`

This is **interior mutability**: mutating through a \`&self\`. It is what lets \`Rc<RefCell<T>>\` give several owners the ability to write.`,
    },
    {
      kind: "theory",
      body: `The panic is the price, and it is a real one — a runtime crash in exchange for a pattern the compiler could not verify. Two habits keep it manageable.

**Keep guards short-lived.** \`cell.borrow_mut().push(x)\` releases at the end of the statement. \`let g = cell.borrow_mut();\` holds until the end of the scope, and any \`borrow()\` in between panics. This is the same \`Drop\`-versus-NLL trap as \`MutexGuard\`.

**Use \`try_borrow_mut\` when a conflict is plausible.** It returns a \`Result\` instead of panicking, which turns a crash into a decision.

\`\`\`rust
let held = log.borrow();
log.try_borrow_mut().is_ok()    // false — a shared borrow is outstanding
\`\`\`

\`Cell<T>\` is the cheaper sibling for \`Copy\` types: \`get\`/\`set\` with no borrow tracking and no possibility of panic, because it never hands out a reference at all.`,
    },
    {
      kind: "quiz",
      question:
        "What does `RefCell` change relative to the normal borrow rules?",
      options: [
        "Nothing about the rules — only *when* they are checked, moving it from compile time to runtime, where a violation panics",
        "It permits several simultaneous mutable borrows",
        "It makes the value thread-safe to share",
      ],
      answer: 0,
      explain:
        "The last option is a common and dangerous confusion: `RefCell` is `!Sync`, so it cannot be shared across threads at all. `Mutex` is its multi-threaded counterpart.",
    },
    {
      kind: "fill",
      prompt:
        "Attempt an exclusive borrow without risking a panic if one is already outstanding.",
      file: "main.rs",
      before: "log.",
      after: "().is_ok()",
      choices: ["try_borrow_mut", "borrow_mut", "get_mut"],
      answer: 0,
      explain:
        "`borrow_mut` panics on conflict. `get_mut` takes `&mut self`, so it needs exclusive access to the `RefCell` itself — which is exactly what you do not have when it sits inside an `Rc`.",
    },
    {
      kind: "quiz",
      question:
        "A service panics intermittently with 'already borrowed: BorrowMutError'. What is the usual cause?",
      options: [
        "A `Ref` guard is being held across a call that borrows again — the guard lives to end of scope, not last use",
        "Two threads are borrowing the `RefCell` at once",
        "The `RefCell` was created before the `Rc` that holds it",
      ],
      answer: 0,
      explain:
        "It cannot be threads: `RefCell` is `!Sync`, so the compiler already prevented that. It is almost always a guard held longer than intended — scope it with a block, or clone the value out.",
    },
    {
      kind: "editor",
      intro: `### Borrowing, checked at runtime

1. Build \`Rc<RefCell<Vec<String>>>\` holding an empty vector.
2. Through a **clone** of the \`Rc\`, push \`started\` and then \`ready\` — each as its own statement, so the guard is released each time.
3. Print the length, then the first entry.
4. Hold a shared borrow in a binding, print whether \`try_borrow_mut()\` succeeds, then \`drop\` the binding and print it again.

Expected output:

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\``,
    },
  ],

  "rust-smart-pointers-4": [
    {
      kind: "theory",
      body: `Reference counting has one classic failure: a **cycle**. If A owns B and B owns A, neither count ever reaches zero and the memory is never freed. Rust does not prevent this — it is a leak, not unsoundness, and the borrow checker has nothing to say about it.

The standard shape where this appears is a tree with parent links:

\`\`\`rust
root.children  ->  Rc<Node>   (strong)
leaf.parent    ->  Rc<Node>   (strong)  // cycle: nothing is ever freed
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`Weak<T>\` breaks it. A weak handle does **not** own the value and does not keep it alive:

\`\`\`rust
parent: RefCell<Weak<Node>>          // Rc::downgrade(&root)
children: RefCell<Vec<Rc<Node>>>     // strong, as before
\`\`\`

Because a \`Weak\` may point at something already freed, you cannot read through it directly. \`upgrade()\` returns \`Option<Rc<T>>\` — \`Some\` if the value is still alive, \`None\` if it is gone. That \`Option\` is the whole safety story.

The rule to carry: **ownership goes down, references go up.** Parents own children strongly; children point back weakly. The same applies to observer lists and caches — the cache holds \`Weak\`, so caching something never keeps it alive on its own.`,
    },
    {
      kind: "quiz",
      question:
        "Why does `Weak::upgrade()` return `Option<Rc<T>>` rather than `Rc<T>`?",
      options: [
        "The value may already have been dropped — a weak handle does not keep it alive, so it might be gone",
        "Upgrading can fail if the strong count is at its maximum",
        "It returns `None` while another thread holds the value",
      ],
      answer: 0,
      explain:
        "That `Option` is the entire point of `Weak`: it makes 'the thing I point at may be gone' a value you must handle, rather than a dangling pointer.",
    },
    {
      kind: "fill",
      prompt: "Create a non-owning handle back to the parent.",
      file: "main.rs",
      before: "parent: RefCell::new(Rc::",
      after: "(&root)),",
      choices: ["downgrade", "clone", "new"],
      answer: 0,
      explain:
        "`Rc::downgrade` produces a `Weak` and bumps only the weak count. `Rc::clone` would bump the strong count and re-create the cycle.",
    },
    {
      kind: "quiz",
      question:
        "A cache holds `Rc<Entry>` and memory grows without bound even after every user is finished. What is the fix?",
      options: [
        "Hold `Weak<Entry>` in the cache, so caching an entry does not by itself keep it alive",
        "Call `drop` on the cache periodically",
        "Replace `Rc` with `Box`, which frees deterministically",
      ],
      answer: 0,
      explain:
        "A cache holding strong references is not a cache, it is a leak with a lookup table. `Weak` lets entries die when their real owners are done, and `upgrade()` tells you when that happened.",
    },
    {
      kind: "editor",
      intro: `### Ownership down, references up

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`.
2. Build a \`root\` with an empty \`Weak::new()\` parent, then a \`leaf\` whose parent is \`Rc::downgrade(&root)\`.
3. Push a clone of \`leaf\` into \`root\`'s children.
4. Print \`root\`'s strong count, then its weak count.
5. \`upgrade()\` the leaf's parent and print the parent's name with \`{:?}\`, mapping to a cloned \`String\`.

Expected output:

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

Root's strong count stays at 1 — that is the cycle not forming.`,
    },
  ],

  "rust-smart-pointers-5": [
    {
      kind: "theory",
      body: `\`Cow<'a, T>\` — clone on write — is an enum with two variants:

\`\`\`rust
enum Cow<'a, T> {
    Borrowed(&'a T),
    Owned(T::Owned),
}
\`\`\`

It lets a function return borrowed data on the common path and owned data only when it actually had to change something:

\`\`\`rust
fn sanitize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))   // allocated: we changed it
    } else {
        Cow::Borrowed(input)                  // free: nothing to do
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `The caller does not care which variant it got — \`Cow<str>\` derefs to \`&str\`, so it reads like a string either way.

The win shows up when the modifying path is rare. Sanitising a million identifiers of which twelve contain a space performs twelve allocations, where returning \`String\` unconditionally performs a million.

Its most common home is the parsing edge: percent-decoding a URL, unescaping a header, normalising a config value. When the input is already fine — which it usually is — nothing is copied.

Two smaller notes. \`.into_owned()\` forces the owned form when you need to store it. And if the modifying path is the common one, drop the \`Cow\`: you are paying an enum discriminant and a branch to avoid an allocation that almost always happens.`,
    },
    {
      kind: "quiz",
      question: "When does `Cow` actually pay off?",
      options: [
        "When the modifying path is rare, so most calls return a borrow and allocate nothing",
        "Always — it is strictly cheaper than returning `String`",
        "When the input is large, regardless of how often it is modified",
      ],
      answer: 0,
      explain:
        "If every call modifies, `Cow` adds a discriminant and a branch and then allocates anyway. It is a bet on the common case, and a bad bet costs a little.",
    },
    {
      kind: "fill",
      prompt: "Return the input untouched, without allocating.",
      file: "main.rs",
      before: "        Cow::",
      after: "(input)",
      choices: ["Borrowed", "Owned", "From"],
      answer: 0,
      explain:
        "`Cow::Owned(input.to_string())` would compile and be correct — and would allocate on exactly the path this whole type exists to keep free.",
    },
    {
      kind: "quiz",
      question:
        "A caller needs to store the result of a `Cow`-returning function in a long-lived struct. What must happen?",
      options: [
        "Call `.into_owned()` — the borrowed variant is tied to the input's lifetime and cannot be stored",
        "Nothing; `Cow` is `'static` by construction",
        "Wrap it in an `Rc` to extend its lifetime",
      ],
      answer: 0,
      explain:
        "This is the moment the deferred allocation is finally paid, and paying it here is right: the value is now being retained rather than used and discarded.",
    },
    {
      kind: "editor",
      intro: `### Allocate only when you must

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — if the input contains a space, return \`Cow::Owned\` with spaces replaced by \`_\`; otherwise return \`Cow::Borrowed\`.
2. Call it with \`"get_events"\` and with \`"get events now"\`.
3. For each, print the value and whether it is the borrowed variant, using \`matches!(&value, Cow::Borrowed(_))\` computed into its own binding first.

Expected output:

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\``,
    },
  ],

  "rust-smart-pointers-6": [
    {
      kind: "theory",
      body: `\`Deref\` is what makes a smart pointer feel like the thing it wraps. Implementing it gives you two things at once:

- the \`*\` operator
- **deref coercion** — \`&Wrapper<T>\` is accepted where \`&T\` is expected, and \`wrapper.method()\` finds \`T\`'s methods

\`\`\`rust
impl<T> Deref for Tracked<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.inner }
}
\`\`\`

This is exactly how \`Box\`, \`Rc\`, \`Arc\`, \`String\` (to \`str\`) and \`Vec\` (to \`[T]\`) work. There is no compiler magic in any of them.`,
    },
    {
      kind: "theory",
      body: `Method resolution searches the type itself **first**, then follows \`Deref\` outward. So an inherent method on the wrapper shadows a same-named method on the target — which is why \`Rc\` uses associated functions (\`Rc::clone(&x)\`, \`Rc::strong_count(&x)\`) rather than methods: they must not shadow anything on \`T\`.

The guidance from the standard library is narrow and worth respecting: **implement \`Deref\` only for smart pointers.** Using it to fake inheritance — a \`Dog\` that derefs to an \`Animal\` — produces surprising method resolution and error messages that point at the wrong type.

\`DerefMut\` is the same for \`&mut\`, and requires \`Deref\`. Note that \`deref\` is a real method call: putting work in it, as the exercise does, means it runs on every implicit coercion.`,
    },
    {
      kind: "quiz",
      question:
        "Why does `Rc` expose `Rc::strong_count(&x)` as an associated function rather than a method?",
      options: [
        "A method would shadow any same-named method on the wrapped type, since the wrapper's own methods are found first",
        "Associated functions are faster than methods",
        "Methods cannot be called on types that implement `Deref`",
      ],
      answer: 0,
      explain:
        "The `Rc::clone(&x)` convention has this same second motive on top of readability: as an associated function it can never accidentally shadow `T::clone`.",
    },
    {
      kind: "fill",
      prompt: "Name the type this wrapper dereferences to.",
      file: "main.rs",
      before: "impl<T> Deref for Tracked<T> {\n    type ",
      after: " = T;",
      choices: ["Target", "Item", "Output"],
      answer: 0,
      explain:
        "`Target` is `Deref`'s associated type. `Item` belongs to `Iterator` and `Output` to the operator traits like `Add`.",
    },
    {
      kind: "quiz",
      question:
        "Why is implementing `Deref` to model inheritance considered an anti-pattern?",
      options: [
        "Method resolution silently searches the target, so calls and error messages point at a type the reader never named",
        "It is a compile error outside the standard library",
        "`Deref` may only be implemented for types holding a pointer",
      ],
      answer: 0,
      explain:
        "It compiles perfectly. The cost is legibility: a reader cannot tell which type a method came from, and neither can the error message when it goes wrong.",
    },
    {
      kind: "editor",
      intro: `### Build a smart pointer

1. \`struct Tracked<T> { inner: T, reads: Cell<u32> }\` with \`fn new(inner: T) -> Self\` and \`fn reads(&self) -> u32\`.
2. \`impl<T> Deref for Tracked<T>\` with \`type Target = T\`, incrementing \`reads\` before returning \`&self.inner\`.
3. \`impl<T> DerefMut for Tracked<T>\` returning \`&mut self.inner\` (no counting).
4. In \`main\`, wrap \`vec![1, 2, 3]\`, print \`.len()\` through the coercion, \`push(4)\` through \`DerefMut\`, print \`*v\` with \`{:?}\`, then print the read count.

Expected output:

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

Two reads: \`.len()\` and \`*v\`. \`push\` goes through \`deref_mut\`, and \`reads()\` is inherent so it never coerces.`,
    },
  ],
};
