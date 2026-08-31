import type { LessonStep } from "@/content/steps";

// Advanced · Ownership, Moves & Drops.
//
// House style for this path — read before authoring here:
//   · No narrative. No mascot image, no "runes", no second person plural.
//   · Every claim is either provable in the editor or shown in a diagram.
//   · A quiz answer must be wrong for a REASON, not wrong by being silly —
//     the reader is senior, and a giveaway distractor teaches nothing.
//   · Prefer showing the failing code and asking why it fails.

export const rustOwnershipDeepSteps: Record<string, LessonStep[]> = {
  "rust-ownership-deep-1": [
    {
      kind: "theory",
      body: `Every value in Rust has exactly one owner, and its type decides where its bytes actually live.

A \`i32\` is 4 bytes and lives entirely in the stack frame of the function that holds it. A \`String\` is different: the *handle* lives on the stack and is always the same size, while the characters live on the heap.

That handle is three words — a pointer, a length, and a capacity:

\`\`\`rust
let name = String::from("stellar");
// stack:  [ ptr | len: 7 | cap: 7 ]   = 24 bytes on a 64-bit target
// heap:   s t e l l a r               = 7 bytes
\`\`\``,
    },
    {
      kind: "theory",
      body: `This split is the entire reason ownership exists.

Copying 4 bytes of \`i32\` is free, so Rust just does it. Copying a \`String\` would mean either duplicating the heap allocation (expensive, and silently) or having two handles point at the same allocation (which frees it twice).

Rust refuses both. It transfers the handle instead — and that transfer is what "move" means. Nothing on the heap is touched.

\`std::mem::size_of::<T>()\` reports the **stack** size of a type, and never the heap payload behind it. That distinction is worth internalising now: it is the one people get wrong in interviews.`,
    },
    {
      kind: "quiz",
      question:
        "`size_of::<String>()` returns 24 on a 64-bit target, whether the string holds 3 characters or 3 million. Why?",
      options: [
        "It measures the stack handle — pointer, length and capacity — not the heap buffer it points to",
        "Rust caps every String at 24 bytes and spills the remainder into a side table",
        "24 is the size of the first cache line the allocator hands out",
      ],
      answer: 0,
      explain:
        "`size_of` is a compile-time constant, so it can only describe what the compiler knows: the fixed stack layout. Heap length is a runtime value — that's `.len()`.",
    },
    {
      kind: "fill",
      prompt:
        "Report the number of bytes the string data occupies on the heap — not the handle.",
      file: "main.rs",
      before: 'let name = String::from("stellar");\nprintln!("heap bytes: {}", name.',
      after: ");",
      choices: ["len()", "capacity()", "size_of()"],
      answer: 0,
      explain:
        "`len()` is the bytes actually in use. `capacity()` is the bytes reserved, which may be larger after a growth — a real distinction, just not the one asked for here.",
    },
    {
      kind: "quiz",
      question:
        "A function takes `data: Vec<u8>` by value and is called in a hot loop. What is copied at each call?",
      options: [
        "24 bytes — the vector's handle. The heap buffer is not touched, it is re-pointed",
        "The whole buffer, which is why passing by value in a loop is expensive",
        "Nothing — Rust passes every argument by reference under the hood",
      ],
      answer: 0,
      explain:
        "Moving is cheap: it is a memcpy of the handle. The cost people fear from `by value` is the *drop* at the end of the callee, not the transfer.",
    },
    {
      kind: "editor",
      intro: `### Measure the split

Print the stack size of an \`i32\`, the stack size of a \`String\`, and the heap bytes held by one particular string.

Expected output:

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

Use \`std::mem::size_of\` for the first two and \`.len()\` for the third.`,
    },
  ],

  "rust-ownership-deep-2": [
    {
      kind: "theory",
      body: `Assignment does one of two things, and the type decides which.

If the type implements \`Copy\`, the bits are duplicated and both bindings stay usable. If it does not, ownership **moves** and the source binding is dead — using it afterwards is a compile error, not a runtime surprise.

\`\`\`rust
let x = 10;
let y = x;
println!("{x}");        // fine — i32 is Copy

let s1 = String::from("hi");
let s2 = s1;
println!("{s1}");       // error: borrow of moved value: \`s1\`
\`\`\``,
    },
    {
      kind: "theory",
      body: `The rule for which types are \`Copy\` is not arbitrary: **a type can be \`Copy\` only if every one of its fields is, and it must not implement \`Drop\`.**

That excludes exactly the types where duplicating the bits would be wrong. \`String\`, \`Vec<T>\` and \`Box<T>\` all own a heap allocation and all implement \`Drop\` — two copies would mean two frees.

\`Clone\` is the explicit opt-in for the same thing: \`s1.clone()\` performs the deep copy that \`=\` refused to do silently. The verbosity is the point. An allocation should be visible in the source.`,
    },
    {
      kind: "quiz",
      question:
        "Why can a type that implements `Drop` never also implement `Copy`?",
      options: [
        "Copying the bits would produce two owners of the same resource, and `drop` would run twice on it",
        "`Drop` and `Copy` both define a method named `clone`, so they collide",
        "It can — the standard library simply chooses not to for `String`",
      ],
      answer: 0,
      explain:
        "This is a hard compiler rule, not a convention. `Copy` means 'duplicating the bits is a complete duplicate'; `Drop` means 'these bits own something that must be released once'. The two claims contradict each other.",
    },
    {
      kind: "fill",
      prompt:
        "Keep `s1` usable after producing a second, independent string.",
      file: "main.rs",
      before: 'let s1 = String::from("ledger");\nlet s2 = s1.',
      after: ';\nprintln!("{s1} {s2}");',
      choices: ["clone()", "as_str()", "to_owned().as_str()"],
      answer: 0,
      explain:
        "`clone()` allocates a second buffer, so both handles own their own data. `as_str()` would borrow instead — also valid Rust, but it does not give you a second `String`.",
    },
    {
      kind: "quiz",
      question:
        "`let t = (1i32, String::from(\"a\")); let u = t;` — what is the status of `t` afterwards?",
      options: [
        "Fully moved. A tuple is `Copy` only if every element is, and `String` is not",
        "Partially moved: `t.0` is still readable because `i32` is `Copy`",
        "Untouched — tuples are always copied element by element",
      ],
      answer: 0,
      explain:
        "Assigning the whole tuple moves the whole tuple. Field-by-field partial moves are possible, but only when you name the field — which is the next lesson.",
    },
    {
      kind: "editor",
      intro: `### Move, copy, clone

Show all three behaviours in one program:

1. Bind \`10\` to \`a\`, then \`a\` to \`b\`, and print both — this is a copy.
2. Build a \`String\` holding \`ledger\`, \`clone()\` it, and print both.
3. Move the clone into a third binding and print that.

Expected output:

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\``,
    },
  ],

  "rust-ownership-deep-3": [
    {
      kind: "theory",
      body: `Ownership is tracked **per field**, not only per value.

Moving one field out of a struct leaves the struct partially moved: the field you took is dead, every other field is still readable.

\`\`\`rust
struct Account { id: String, balance: i64 }

let acct = Account { id: String::from("GA7Q"), balance: 250 };
let id = acct.id;              // moves out just this field
println!("{}", acct.balance);  // fine
println!("{}", acct.id);       // error: value moved
println!("{:?}", acct);        // error: \`acct\` is not whole any more
\`\`\``,
    },
    {
      kind: "theory",
      body: `Two limits are worth knowing before you rely on this.

**A partially moved value cannot be used as a whole.** You may read the fields that remain, but you may not pass \`acct\` to a function, return it, or move it again.

**A type that implements \`Drop\` cannot be partially moved at all.** Its \`drop\` will run against the whole value, so the compiler cannot allow a hole in it. If you need a field out of such a type, either \`clone()\` it or use \`std::mem::take\`, which swaps in the default value and hands you the original.`,
    },
    {
      kind: "quiz",
      question:
        "`let id = acct.id;` compiles, but adding `#[derive(Debug)]` and then `println!(\"{acct:?}\")` after it does not. Why?",
      options: [
        "`Debug` formatting reads the whole struct, and one field no longer holds a valid value",
        "`derive(Debug)` takes ownership of the struct it is applied to",
        "Partial moves are only allowed on structs that derive nothing",
      ],
      answer: 0,
      explain:
        "The struct is not gone — it has a hole. Anything that needs all of it (Debug, passing it on, returning it) is rejected; reading an intact field is not.",
    },
    {
      kind: "fill",
      prompt:
        "`Session` implements `Drop`, so a field cannot be moved out of it. Take the token and leave an empty `String` behind.",
      file: "main.rs",
      before: "let token = std::mem::",
      after: "(&mut session.token);",
      choices: ["take", "drop", "swap"],
      answer: 0,
      explain:
        "`take` replaces the field with `Default::default()` and returns the original — the value stays whole, so `Drop` still has something valid to run against. `swap` works too, but you must supply the replacement yourself.",
    },
    {
      kind: "quiz",
      question:
        "You need one `String` field out of a struct you must also pass on to another function afterwards. What is correct?",
      options: [
        "`clone()` the field, or `mem::take` it if leaving an empty value behind is acceptable",
        "Move the field out and pass the struct on — the compiler patches the hole",
        "Wrap the struct in `Box` first; boxing makes partial moves whole again",
      ],
      answer: 0,
      explain:
        "The choice is a real trade: `clone` costs an allocation and keeps the original intact, `mem::take` is free but mutates the source. Neither is always right.",
    },
    {
      kind: "editor",
      intro: `### Take one field, keep the rest

Define \`struct Account { id: String, balance: i64 }\` and build one with id \`GA7Q\` and balance \`250\`.

Move **only** the \`id\` field into its own binding, then print the id and the balance that is still in the struct.

Expected output:

\`\`\`text
id: GA7Q
balance: 250
\`\`\``,
    },
  ],

  "rust-ownership-deep-4": [
    {
      kind: "theory",
      body: `The borrow checker enforces one rule: at any point, a value has **either** any number of shared references \`&T\`, **or** exactly one exclusive reference \`&mut T\`. Never both.

The part that trips people up is the phrase *at any point*. A borrow lasts until its **last use**, not until the end of the block. This is called NLL — non-lexical lifetimes — and it means most aliasing errors are fixed by moving a line, not by cloning.

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = &v[0];      // shared borrow starts
println!("{first}");    // ...and ends here, at its last use
v.push(4);              // fine — nothing is borrowing v any more
\`\`\``,
    },
    {
      kind: "theory",
      body: `Reordering only works when the borrow's *result* does not need to outlive the mutation. When it does, extract the value out of the borrow first:

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = v[0];       // i32 is Copy — this reads and ends the borrow
v.push(4);
println!("{first}");    // fine: \`first\` owns its 4 bytes
\`\`\`

For a non-\`Copy\` element the same move exists — \`.clone()\`, or computing a summary such as \`.len()\` or \`.iter().sum()\` — and it should be a deliberate choice, not a reflex. Reaching for \`clone()\` the moment the compiler complains is how a hot path quietly acquires an allocation per iteration.`,
    },
    {
      kind: "quiz",
      question:
        "Why does `let n = &v[0]; v.push(4); println!(\"{n}\");` fail, when moving the `println!` above the `push` compiles?",
      options: [
        "`push` may reallocate the buffer, so the reference could dangle — and the borrow is still live because it is used afterwards",
        "`push` requires the vector to have no references at any point in the whole function body",
        "The `println!` macro captures its arguments by value, which moves out of a borrow",
      ],
      answer: 0,
      explain:
        "Both halves matter: `push` needs `&mut`, and the shared borrow is still alive because a later line uses it. Move that line up and the borrow ends before `push` — which is exactly what NLL buys you.",
    },
    {
      kind: "fill",
      prompt:
        "Compute a total over the vector without holding a borrow past the line.",
      file: "main.rs",
      before: "let total: i32 = ledger.iter().",
      after: ";\nledger.push(total);",
      choices: ["sum()", "collect()", "count()"],
      answer: 0,
      explain:
        "`sum()` consumes the iterator and returns an owned `i32`, so the borrow of `ledger` is over by the end of the statement — `push` is then free to take `&mut`.",
    },
    {
      kind: "quiz",
      question:
        "Which of these is the *worst* habitual fix for a borrow-checker error in a hot loop?",
      options: [
        "Cloning the borrowed value, because it silently converts a compile error into an allocation per iteration",
        "Narrowing the scope of the borrow so it ends before the mutation",
        "Extracting a `Copy` summary of the data before mutating",
      ],
      answer: 0,
      explain:
        "`clone()` is not forbidden — sometimes it is genuinely the right call. The failure mode is using it *reflexively*, which makes the compiler stop complaining without making the code correct or fast.",
    },
    {
      kind: "editor",
      intro: `### End the borrow before you mutate

Given \`let mut ledger = vec![10, 20, 30];\`:

1. Sum the entries into \`total\` using an iterator.
2. Push \`total\` onto \`ledger\`.
3. Print the vector, then the total.

Expected output:

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\``,
    },
  ],

  "rust-ownership-deep-5": [
    {
      kind: "theory",
      body: `Two coercions run so often that they become invisible — and then confusing the first time they do not fire.

**Deref coercion.** \`&String\` becomes \`&str\`, \`&Vec<T>\` becomes \`&[T]\`, \`&Box<T>\` becomes \`&T\`. The compiler inserts the conversion at a call site whenever the target type does not match but a \`Deref\` impl bridges them.

\`\`\`rust
fn describe(s: &str) -> usize { s.len() }

let owned = String::from("soroban");
describe(&owned);   // &String coerced to &str — no allocation, no copy
\`\`\`

This is why you take \`&str\` in a parameter and \`String\` in a struct field: the parameter accepts both, the field owns its data.`,
    },
    {
      kind: "theory",
      body: `**Reborrowing.** \`&mut T\` is not \`Copy\` — there can only ever be one. So passing one to a function ought to move it and leave your binding dead. It does not:

\`\`\`rust
let mut seq = 41;
let handle = &mut seq;
bump(handle);           // implicit reborrow: &mut *handle
bump(&mut *handle);     // the same thing, written out
\`\`\`

The compiler silently passes \`&mut *handle\` — a *new*, shorter borrow derived from yours. It expires when the callee returns and your handle is live again. Without this, every \`&mut\` would be single-use and the language would be unbearable.

You have to write the reborrow yourself in one common case: storing a \`&mut\` in a struct, or returning it, where the compiler cannot infer the shorter lifetime you meant.`,
    },
    {
      kind: "quiz",
      question:
        "`fn bump(n: &mut i64)` is called twice in a row with the same `&mut` binding, and it compiles. Why isn't the first call a move?",
      options: [
        "The compiler inserts an implicit reborrow, `&mut *handle`, which expires when the call returns",
        "`&mut i64` is `Copy` because `i64` is `Copy`",
        "Function arguments are always passed by reference, so nothing moves",
      ],
      answer: 0,
      explain:
        "Reborrowing is the mechanism that makes exclusive references usable more than once. `&mut T` is never `Copy`, regardless of `T`.",
    },
    {
      kind: "fill",
      prompt:
        "Write the reborrow explicitly, so the second call gets its own short-lived exclusive borrow.",
      file: "main.rs",
      before: "bump(",
      after: "handle);",
      choices: ["&mut *", "&", "*"],
      answer: 0,
      explain:
        "`&mut *handle` dereferences to reach the value, then takes a fresh exclusive borrow of it. `&handle` would be a shared borrow *of the reference itself* — a different type.",
    },
    {
      kind: "quiz",
      question:
        "A public function takes `name: String` and only ever calls `.len()` on it. What should the signature be?",
      options: [
        "`&str` — it accepts `&String` by deref coercion and `&'static str` directly, and forces no allocation on the caller",
        "`String`, so the function owns its data and cannot be affected by the caller",
        "`&String`, which is the most precise type and therefore the fastest",
      ],
      answer: 0,
      explain:
        "`&String` is strictly worse than `&str`: it accepts less (a literal will not coerce *up*) and buys nothing. Take `String` only when you genuinely need to store or consume it.",
    },
    {
      kind: "editor",
      intro: `### Both coercions in one program

1. Write \`fn describe(s: &str) -> usize\` returning the string's length, and call it with a \`&String\` holding \`soroban\`.
2. Write \`fn bump(n: &mut i64)\` that adds 1.
3. Bind \`let mut seq = 41;\`, take \`let handle = &mut seq;\`, then call \`bump\` twice — once passing \`handle\`, once passing an explicit \`&mut *handle\`.
4. Print the final value of \`seq\`.

Expected output:

\`\`\`text
len: 7
seq: 43
\`\`\``,
    },
  ],

  "rust-ownership-deep-6": [
    {
      kind: "theory",
      body: `When a value goes out of scope, Rust runs its \`Drop\` impl — no \`finally\`, no \`defer\`, no \`close()\` you can forget. That is RAII: **acquiring the resource is constructing the value, and releasing it is the value ending.**

\`\`\`rust
struct Guard(&'static str);

impl Drop for Guard {
    fn drop(&mut self) {
        println!("release {}", self.0);
    }
}
\`\`\`

You never call \`drop\` yourself. \`std::mem::drop(value)\` exists, but all it does is take ownership and let the value fall out of scope early.`,
    },
    {
      kind: "theory",
      body: `The order is exact and worth memorising, because it is what makes lock guards and connection pools safe:

**Variables in a scope drop in reverse declaration order.** Last declared, first released — the stack unwinds the way it was built. Struct *fields*, by contrast, drop in declaration order.

\`\`\`rust
let _outer = Guard("outer");
{
    let _inner = Guard("inner");
}   // "release inner" here
    // "release outer" at the end of main
\`\`\`

This is why \`MutexGuard\` needs no unlock call, and why introducing a \`{ }\` block around a critical section is a real technique and not a style choice: the closing brace *is* the unlock.`,
    },
    {
      kind: "quiz",
      question:
        "Three guards `a`, `b`, `c` are declared in that order in one scope. What is printed?",
      options: [
        "c, then b, then a — reverse declaration order",
        "a, then b, then c — declaration order, like struct fields",
        "The order is unspecified and may vary between compiler versions",
      ],
      answer: 0,
      explain:
        "Reverse order for locals, forward order for struct fields. The asymmetry is deliberate: a local declared later may borrow from an earlier one, so it must die first.",
    },
    {
      kind: "fill",
      prompt:
        "Release a lock guard early, without waiting for the end of the function.",
      file: "main.rs",
      before: "let guard = lock.acquire();\n",
      after: "(guard);\nlong_running_work();",
      choices: ["drop", "guard.close", "std::mem::forget"],
      answer: 0,
      explain:
        "`drop` takes the value by ownership and ends it there. `mem::forget` does the opposite — it leaks the value on purpose and the lock is never released.",
    },
    {
      kind: "quiz",
      question:
        "Why is holding a `MutexGuard` across a slow call a problem, even in single-threaded test runs?",
      options: [
        "The guard lives until the end of its scope, so the lock is held for the whole call — every other thread blocks behind it",
        "`Drop` cannot run while a function call is on the stack, so the guard leaks",
        "It is not a problem; the compiler releases the lock at the last use of the guard",
      ],
      answer: 0,
      explain:
        "This is exactly the trap: NLL ends *borrows* at last use, but `Drop` runs at end of *scope*. A guard you stop reading is still holding the lock. Scope it deliberately with a block.",
    },
    {
      kind: "editor",
      intro: `### Prove the order

Define \`struct Guard(&'static str)\` with a \`Drop\` impl that prints \`release <name>\`.

In \`main\`, create a guard named \`outer\`, then open an inner block containing a guard named \`inner\` and a \`println!("inside")\`. After the block, print \`outside\`.

Expected output:

\`\`\`text
inside
release inner
outside
release outer
\`\`\``,
    },
  ],
};
