import type { LessonStep } from "@/content/steps";

// Advanced · Macros, Unsafe, FFI & Money.

export const rustSystemsEdgesSteps: Record<string, LessonStep[]> = {
  "rust-systems-edges-1": [
    {
      kind: "theory",
      body: `Everything in Rust is **private by default**, and the module tree is what makes an invariant enforceable rather than merely documented.

\`\`\`rust
mod ledger {
    pub struct Balance { stroops: i64 }   // type public, field private
}
\`\`\`

Outside \`ledger\`, nobody can construct a \`Balance\` with a literal, read \`stroops\` directly, or mutate it. The only way in is the constructor you exposed — so "a balance is never negative" stops being a comment and becomes a property of the type.`,
    },
    {
      kind: "theory",
      body: `Four visibility levels, in the order you should reach for them:

| written | visible to |
| --- | --- |
| *(nothing)* | this module and its descendants |
| \`pub(crate)\` | anywhere in this crate |
| \`pub(super)\` | the parent module |
| \`pub\` | anyone, including other crates |

\`pub(crate)\` is the one people under-use. It is the right level for a helper that several modules share but that must never appear in your public API — and unlike \`pub\`, changing it later is not a breaking change for your users.

The layout convention: \`mod\` declares, \`use\` imports, \`super::\` reaches up, \`crate::\` starts from the root. A \`lib.rs\` that is mostly \`pub mod\` and \`pub use\` lines is the whole public API in one readable file, which is exactly what it should be.`,
    },
    {
      kind: "quiz",
      question:
        "`pub struct Balance { stroops: i64 }` — what can code outside the module do with it?",
      options: [
        "Only what the module's public functions permit — the field is private, so no literal construction and no direct reads",
        "Everything; `pub` on the struct makes its fields public too",
        "Nothing at all; the type is unusable outside its module",
      ],
      answer: 0,
      explain:
        "Field privacy is per-field and defaults to private. This is the mechanism behind every 'parse, don't validate' type in Rust — the constructor is the only door.",
    },
    {
      kind: "fill",
      prompt:
        "Expose a helper to the whole crate without adding it to the public API.",
      file: "main.rs",
      before: "    ",
      after: " fn raw(&self) -> i64 {",
      choices: ["pub(crate)", "pub", "pub(super)"],
      answer: 0,
      explain:
        "`pub(crate)` keeps it out of the published surface, so it can change without a breaking release. `pub(super)` would only reach the parent module.",
    },
    {
      kind: "quiz",
      question:
        "Why does making a helper `pub` rather than `pub(crate)` matter beyond style?",
      options: [
        "`pub` is part of your semver contract — removing or changing it later is a breaking release",
        "`pub` items are compiled separately and slow down the build",
        "`pub` disables inlining across module boundaries",
      ],
      answer: 0,
      explain:
        "Every `pub` item is a promise to strangers. The narrowest visibility that compiles is the one that leaves you free to change your mind.",
    },
    {
      kind: "editor",
      intro: `### Make the invariant unbreakable

1. \`mod ledger\` containing \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` — the **field stays private**.
2. In \`impl Balance\`: \`pub fn new(stroops: i64) -> Option<Balance>\` returning \`None\` for a negative value, \`pub fn stroops(&self) -> i64\`, and \`pub(crate) fn raw(&self) -> i64\`.
3. In \`main\`, \`use ledger::Balance;\` and print \`new(250)\` mapped to its stroops, \`new(-1)\` the same way, and \`raw()\` on a valid balance.

Expected output:

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

There is no way to build a negative \`Balance\` from \`main\`. That is the point.`,
    },
  ],

  "rust-systems-edges-2": [
    {
      kind: "theory",
      body: `\`macro_rules!\` matches **syntax** and expands to more syntax, before type checking. It does what a function cannot:

- take a variable number of arguments
- accept arguments of different types in the same position
- capture the *source text* of an expression (this is how \`assert_eq!\` prints both sides)

\`\`\`rust
macro_rules! metric {
    ($name:expr, $value:expr) => { format!("{}={}", $name, $value) };
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Two mechanics do most of the work.

**Fragment specifiers** say what kind of syntax each capture accepts: \`expr\`, \`ident\`, \`ty\`, \`literal\`, \`block\`, \`pat\`, \`tt\`. Using the narrowest one gives better errors — \`$n:ident\` rejects a full expression at the macro call site rather than deep inside the expansion.

**Repetition.** \`$( ... ),+\` matches one or more comma-separated groups, and the same \`$( ... )+\` in the body emits one copy per match:

\`\`\`rust
($name:expr, $value:expr, $($k:expr => $v:expr),+) => {{
    let mut out = format!("{}={}", $name, $value);
    $( out.push_str(&format!(",{}={}", $k, $v)); )+
    out
}};
\`\`\`

Note the double braces: \`{{ ... }}\` makes the expansion a block expression, so it can hold statements and still evaluate to a value.

The discipline: **reach for a function first.** A macro is harder to read, harder to debug, and invisible to \`rust-analyzer\`'s go-to-definition. Use one when the thing you need genuinely cannot be a function — variadic arguments, or capturing source text.`,
    },
    {
      kind: "quiz",
      question: "What can a `macro_rules!` macro do that a function cannot?",
      options: [
        "Take a variable number of arguments, mix types in one position, and capture the source text of an expression",
        "Run faster, because it is expanded at compile time",
        "Access private fields of types from other modules",
      ],
      answer: 0,
      explain:
        "Speed is not a reason: a macro expands to code the optimiser sees exactly as it would an inlined function. Variadics and source capture are the real, and only, motivations.",
    },
    {
      kind: "fill",
      prompt: "Match one or more comma-separated key/value pairs.",
      file: "main.rs",
      before: "($name:expr, $value:expr, $($k:expr => $v:expr)",
      after: ") => {{",
      choices: [",+", "*", ";?"],
      answer: 0,
      explain:
        "`,+` means 'one or more, comma separated'. `,*` would allow zero, which here collides with the two-argument rule above it.",
    },
    {
      kind: "quiz",
      question: "Why is `{{ ... }}` used in a macro expansion body?",
      options: [
        "The inner braces make the expansion a block expression, so it can hold statements and still evaluate to a value",
        "It escapes the braces so they appear literally in the output",
        "It is required syntax for any macro with repetition",
      ],
      answer: 0,
      explain:
        "The outer pair delimits the expansion; the inner pair is a real Rust block. Without it, a multi-statement expansion cannot be used where a value is expected.",
    },
    {
      kind: "editor",
      intro: `### A macro a function could not replace

Write \`macro_rules! metric\` with two rules:

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → the same, then \`",<k>=<v>"\` appended for each pair.

Then call it twice: with \`("requests", 42)\`, and with \`("latency", 95, "method" => "getEvents", "code" => 200)\`.

Expected output:

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

Two different arities, and the second is variadic — which is exactly why this cannot be a function.`,
    },
  ],

  "rust-systems-edges-3": [
    {
      kind: "theory",
      body: `\`#[derive(...)]\` is a **procedural macro**: it receives the token stream of your type and returns generated code, which is compiled alongside it.

\`#[derive(Debug)]\` writes a \`Debug\` impl that prints every field by name. \`#[derive(Clone)]\` writes a \`clone\` that clones every field. \`#[derive(PartialEq)]\` compares every field. \`#[derive(Default)]\` fills each field with **its own** default — \`0\`, \`false\`, \`String::new()\`.

Nothing is special-cased in the compiler. The output is ordinary Rust, and \`cargo expand\` will show it to you.`,
    },
    {
      kind: "theory",
      body: `Two consequences worth holding.

**A derive can only do what its inputs allow.** \`#[derive(Clone)]\` on a struct with a non-\`Clone\` field fails — and the error points at the derive, which is why those messages read oddly the first few times.

**Attributes configure the generated code.** \`#[serde(rename = "type")]\`, \`#[serde(default)]\`, \`#[serde(skip)]\` are read by Serde's derive as it generates the impl. They are not compiler features; they are arguments to a macro.

The three kinds of procedural macro, so the vocabulary is settled: **derive** (\`#[derive(Serialize)]\`), **attribute** (\`#[tokio::main]\`, which rewrites your \`fn main\` into one that starts a runtime), and **function-like** (\`sqlx::query!\`, which reaches the database at compile time to check your SQL). All three are ordinary Rust crates that run during compilation.`,
    },
    {
      kind: "quiz",
      question: "What does `#[tokio::main]` actually do?",
      options: [
        "It is an attribute macro that rewrites your `async fn main` into a sync `main` which builds a runtime and calls `block_on`",
        "It marks the function so the compiler links the Tokio runtime",
        "It is a compiler builtin that enables async support",
      ],
      answer: 0,
      explain:
        "`cargo expand` shows the rewrite in full — and it is the same `Runtime::new().block_on(...)` you would have written. Knowing this makes the 'cannot start a runtime from within a runtime' panic obvious.",
    },
    {
      kind: "fill",
      prompt:
        "Give the struct a value-equality comparison and a zeroed constructor.",
      file: "main.rs",
      before: "#[derive(Debug, Clone, ",
      after: ")]\nstruct Config {",
      choices: ["PartialEq, Default", "Eq, New", "Copy, Default"],
      answer: 0,
      explain:
        "`Copy` would fail here: the struct holds a `String`, which owns a heap allocation and therefore cannot be `Copy`.",
    },
    {
      kind: "quiz",
      question:
        "`#[derive(Clone)]` on a struct fails to compile. What is almost always the cause?",
      options: [
        "One of the fields is not itself `Clone`, and the derive can only generate what its inputs support",
        "The struct is missing `#[derive(Copy)]`, which `Clone` requires",
        "The struct has a lifetime parameter, which derives do not support",
      ],
      answer: 0,
      explain:
        "The dependency runs the other way — `Copy` requires `Clone`, never the reverse. And derives handle lifetimes fine.",
    },
    {
      kind: "editor",
      intro: `### See what a derive generates

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`.
2. Build one with endpoint \`https://rpc\`, retries \`3\`, verbose \`false\`, and \`clone()\` it.
3. Print the original with \`{:?}\`, whether the two are equal, and \`Config::default()\` with \`{:?}\`.

Expected output:

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Four impls, none of them written by you — and each one is ordinary Rust you could have written yourself.`,
    },
  ],

  "rust-systems-edges-4": [
    {
      kind: "theory",
      body: `\`unsafe\` does not turn off the borrow checker. It unlocks exactly five abilities:

1. dereference a raw pointer
2. call an \`unsafe\` function
3. access a \`static mut\`
4. implement an \`unsafe\` trait
5. access a union field

Everything else — ownership, borrowing, lifetimes, type checking — applies inside an \`unsafe\` block exactly as outside it.`,
    },
    {
      kind: "theory",
      body: `What \`unsafe\` really means is **"I am asserting an invariant the compiler cannot check."** So the skill being tested — the one a systems reviewer is actually paid for — is stating that invariant precisely.

The convention is a \`// SAFETY:\` comment on every \`unsafe\` block, saying *why* the assertion holds:

\`\`\`rust
// SAFETY: mid <= len, so both ranges lie within the same allocation, and
// they do not overlap — so the two &mut slices never alias.
unsafe {
    (from_raw_parts_mut(ptr, mid), from_raw_parts_mut(ptr.add(mid), len - mid))
}
\`\`\`

Two rules follow. **Keep the block as small as possible** — one operation, not a whole function body, so the reader knows exactly which line carries the claim. And **a safe function containing \`unsafe\` is promising the invariant holds for every possible input**; if a caller can break it with ordinary safe code, the function itself must be marked \`unsafe\`.

The standard library's \`split_at_mut\` is exactly this program: an API the borrow checker cannot express, made safe by an argument the author wrote down.`,
    },
    {
      kind: "quiz",
      question: "What does an `unsafe` block actually change?",
      options: [
        "It permits five specific operations, such as dereferencing a raw pointer — ownership, borrowing and type checking are unaffected",
        "It disables the borrow checker for the enclosed code",
        "It allows data races and skips bounds checks",
      ],
      answer: 0,
      explain:
        "This is the most common misconception. Borrow errors inside an `unsafe` block are still borrow errors — `unsafe` is a much narrower key than its reputation suggests.",
    },
    {
      kind: "fill",
      prompt: "Document the invariant this block is asserting.",
      file: "main.rs",
      before: "// ",
      after: ": mid <= len, so both ranges are in bounds and do not overlap.\nunsafe {",
      choices: ["SAFETY", "NOTE", "UNSAFE"],
      answer: 0,
      explain:
        "`// SAFETY:` is the ecosystem-wide convention, and clippy's `undocumented_unsafe_blocks` lint looks for exactly that prefix.",
    },
    {
      kind: "quiz",
      question:
        "When must a function containing an `unsafe` block itself be marked `unsafe fn`?",
      options: [
        "When a caller could break the invariant using only safe code — then the obligation belongs to the caller",
        "Always — any function containing `unsafe` must be `unsafe`",
        "Never — marking the block is sufficient",
      ],
      answer: 0,
      explain:
        "This is the whole design of safe abstractions. `Vec::push` uses `unsafe` internally and is safe, because no safe caller can violate its invariants. `slice::get_unchecked` is `unsafe` because a caller can pass any index.",
    },
    {
      kind: "editor",
      intro: `### A safe API over an unsafe core

Write \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` returning two non-overlapping mutable halves — something the borrow checker cannot express, and \`std\` provides as \`split_at_mut\`.

Use \`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\`, and a \`// SAFETY:\` comment stating why the two slices never alias.

In \`main\`, split \`[1, 2, 3, 4, 5, 6]\`, write \`100\` to the first element of the left half and \`200\` to the first of the right, print both halves, then print the whole array.

Expected output:

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\``,
    },
  ],

  "rust-systems-edges-5": [
    {
      kind: "theory",
      body: `A raw pointer — \`*const T\` or \`*mut T\` — is a plain address. It carries no lifetime, no ownership, no aliasing guarantee, and may be null or unaligned.

Creating one is **safe**. Dereferencing one is not:

\`\`\`rust
let p: *mut i64 = &mut value;    // safe — just an address
unsafe { *p += 1; }              // unsafe — you are asserting it is valid
\`\`\`

That split is deliberate: holding an address can never corrupt anything. Reading through it can.`,
    },
    {
      kind: "theory",
      body: `Dereferencing asserts four things at once, and all four are on you:

**Non-null.** \`ptr::null()\` exists and \`is_null()\` checks it — a raw pointer has no \`Option\` niche to lean on.
**Aligned.** \`*mut i64\` must sit on an 8-byte boundary. A misaligned read is undefined behaviour even on hardware that tolerates it.
**Pointing at a live value.** The original must not have been dropped or moved.
**Not aliasing a live \`&mut\`.** This is the one people miss. Rust's optimiser assumes \`&mut T\` is unique, and writing through a raw pointer that overlaps a live \`&mut\` breaks that assumption — the miscompilation can appear far from the offending line.

\`ptr.add(n)\` does pointer arithmetic in units of \`T\`, and requires the result to stay within the same allocation — one past the end is permitted, anything beyond is undefined even if you never read it.

The practical guidance: if you are reaching for raw pointers outside FFI or a data structure the borrow checker genuinely cannot express, there is almost certainly a safe way. Run \`cargo miri test\` when you do — it detects most of these violations at runtime.`,
    },
    {
      kind: "quiz",
      question:
        "Why is creating a raw pointer safe while dereferencing one is not?",
      options: [
        "Holding an address can never corrupt anything; reading or writing through it asserts validity the compiler cannot check",
        "Creation is checked at compile time, dereference at runtime",
        "Creating a raw pointer is also unsafe; the compiler simply does not enforce it",
      ],
      answer: 0,
      explain:
        "This is why `&raw const x` and casts are safe operations. The obligation attaches at the point of use, which is also where the `// SAFETY:` comment belongs.",
    },
    {
      kind: "fill",
      prompt: "Move a pointer forward by two elements, not two bytes.",
      file: "main.rs",
      before: "unsafe { println!(\"offset 2: {}\", *base.",
      after: "(2)); }",
      choices: ["add", "offset_bytes", "wrapping_byte_add"],
      answer: 0,
      explain:
        "`add` counts in units of `T`, so `base.add(2)` on a `*const i64` moves 16 bytes. The result must stay within the same allocation.",
    },
    {
      kind: "quiz",
      question:
        "Which raw-pointer violation is most likely to produce a bug that appears far from its cause?",
      options: [
        "Writing through a raw pointer that aliases a live `&mut` — the optimiser assumed uniqueness and miscompiles elsewhere",
        "Dereferencing a null pointer, which crashes immediately",
        "Reading one element past the end of an array",
      ],
      answer: 0,
      explain:
        "A null dereference segfaults on the line. An aliasing violation is silent, and the wrong code the optimiser emitted can be in a different function entirely — which is exactly what `cargo miri` exists to catch.",
    },
    {
      kind: "editor",
      intro: `### Handle addresses deliberately

1. Take \`let mut value = 42i64;\` and a \`*mut i64\` to it. In an \`unsafe\` block with a \`// SAFETY:\` comment, increment through the pointer and print the value read back through it. Then print the original binding — same value.
2. Take \`let arr = [10i64, 20, 30];\` and its \`as_ptr()\`. Print the element at offset \`2\` via \`add\`.
3. Build a \`std::ptr::null::<i64>()\` and print \`is_null()\` — a safe call, no block needed.

Expected output:

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\``,
    },
  ],

  "rust-systems-edges-6": [
    {
      kind: "theory",
      body: `An **ABI** is the machine-level calling convention: how arguments are passed, how values are returned, how a struct is laid out. Rust's own ABI is deliberately unstable, so crossing into C or C++ means opting into theirs.

Two attributes do it:

\`\`\`rust
#[repr(C)]                        // lay this struct out the way C would
pub struct Point { x: i64, y: i64 }

#[no_mangle]                      // keep the symbol name as written
pub extern "C" fn point_sum(p: *const Point) -> i64
\`\`\`

Without \`#[repr(C)]\`, Rust may reorder fields for packing. Without \`#[no_mangle]\`, the linker sees a mangled symbol no C caller can find.`,
    },
    {
      kind: "theory",
      body: `The hard part of FFI is not syntax, it is **ownership crossing a boundary the compiler cannot see through**.

\`\`\`rust
Box::into_raw(Box::new(Point { x, y }))   // ownership leaves Rust
drop(Box::from_raw(p))                    // ownership comes back, freed once
\`\`\`

Between those two calls, nothing in Rust is tracking that pointer. The rules that keep this survivable:

**Every \`into_raw\` needs exactly one matching \`from_raw\`.** Zero leaks; two is a double free. Ship the free function alongside the constructor, and document the pairing.

**Free with the same allocator that allocated.** Memory from Rust's \`Box\` must go back to Rust, never to C's \`free\`, and vice versa.

**Never let a panic cross the boundary.** Unwinding into C frames is undefined behaviour; catch it with \`catch_unwind\` at the edge and return an error code.

**Validate everything arriving.** A pointer from C may be null, misaligned, or dangling — check what you can, and put the rest in the function's \`# Safety\` documentation.

In practice reach for \`cxx\` (a checked Rust/C++ bridge) or \`bindgen\` (generates declarations from C headers) rather than hand-writing declarations. Both eliminate the transcription errors, which are the ones that actually bite.`,
    },
    {
      kind: "quiz",
      question: "What does `#[repr(C)]` guarantee?",
      options: [
        "Fields are laid out in declaration order with C's padding rules, so a C program can read the struct",
        "The struct can only be used from C code",
        "Every field is converted to a C type on access",
      ],
      answer: 0,
      explain:
        "Rust's default representation may reorder fields to reduce padding. That is a good optimisation and a fatal one if something on the other side expects a fixed layout.",
    },
    {
      kind: "fill",
      prompt: "Hand ownership of a heap value out across the boundary.",
      file: "main.rs",
      before: "    Box::",
      after: "(Box::new(Point { x, y }))",
      choices: ["into_raw", "leak", "as_ref"],
      answer: 0,
      explain:
        "`into_raw` gives up ownership and returns the pointer, which `from_raw` can later reclaim. `Box::leak` also gives up ownership but returns a `&'static mut` that can never be freed.",
    },
    {
      kind: "quiz",
      question: "Why must a panic never cross an FFI boundary?",
      options: [
        "Unwinding through C stack frames is undefined behaviour — catch it at the edge and return an error code",
        "C cannot display the panic message",
        "The panic would be silently swallowed and the error lost",
      ],
      answer: 0,
      explain:
        "`extern \"C\"` functions abort rather than unwind by default in current Rust, which turns UB into a crash. Wrapping the body in `catch_unwind` and returning a status is the version a caller can actually handle.",
    },
    {
      kind: "editor",
      intro: `### Ownership across the boundary

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — it must be \`pub\`, since the exported functions mention it.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — return \`0\` for null, otherwise \`x + y\`, with a \`// SAFETY:\` comment.
3. \`point_new(x, y) -> *mut Point\` via \`Box::into_raw\`, and \`point_free(p: *mut Point)\` via \`Box::from_raw\`, null-checked.
4. In \`main\`: build a point \`(3, 4)\`, print its sum, print the point itself through the raw pointer, free it, print \`size_of::<Point>()\`, then print \`point_sum\` of a null pointer.

Expected output:

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

One \`into_raw\`, one \`from_raw\`. That pairing is the entire contract.`,
    },
  ],

  "rust-systems-edges-7": [
    {
      kind: "theory",
      body: `**A balance is never a float.** \`f64\` cannot represent \`0.1\` exactly, so arithmetic accumulates error — and in a ledger, error means money that does not reconcile.

\`\`\`rust
0.1f64 + 0.2f64 == 0.3     // false
\`\`\`

The universal answer is **fixed point**: store the smallest indivisible unit as an integer. Stellar counts *stroops*, at \`10_000_000\` per XLM. Most currencies count cents. There is no rounding, because there is nothing to round.`,
    },
    {
      kind: "theory",
      body: `Integers do not silently lose precision, but they do **overflow** — and in release builds the check is compiled out, so \`i64::MAX + 1\` wraps to \`i64::MIN\` with no warning. A debug build panics; production does not. That difference has caused real incidents.

So be explicit. Rust gives four families, and the choice is a design decision:

| method | on overflow |
| --- | --- |
| \`checked_add\` | \`None\` — you handle it |
| \`saturating_add\` | clamps at the maximum |
| \`wrapping_add\` | wraps around |
| \`overflowing_add\` | \`(value, bool)\` |

**For money, always \`checked_\`.** An overflowing balance is an error the caller must see, not a value to clamp or wrap. \`checked_mul(..)?.checked_add(..)\` chains cleanly with \`?\` inside a function returning \`Option\` or \`Result\`.

\`saturating_\` is right for a metric that must not wrap; \`wrapping_\` for a hash or a sequence number where wrapping is the intended behaviour. Neither belongs anywhere near a balance.`,
    },
    {
      kind: "quiz",
      question: "Why must a monetary balance never be stored in an `f64`?",
      options: [
        "Binary floating point cannot represent most decimal fractions exactly, so arithmetic accumulates error the ledger cannot reconcile",
        "`f64` is slower than `i64` on modern hardware",
        "`f64` has a smaller range than `i64`",
      ],
      answer: 0,
      explain:
        "`f64` actually has a far larger range. Range was never the problem — exactness is, and `0.1 + 0.2 != 0.3` is the one-line proof.",
    },
    {
      kind: "fill",
      prompt: "Multiply so an overflow becomes a value the caller must handle.",
      file: "main.rs",
      before: "xlm.",
      after: "(STROOPS_PER_XLM)?.checked_add(fraction)",
      choices: ["checked_mul", "saturating_mul", "wrapping_mul"],
      answer: 0,
      explain:
        "`saturating_mul` would silently clamp to `i64::MAX` — inventing a balance nobody has. For money, the overflow must reach the caller.",
    },
    {
      kind: "quiz",
      question:
        "A service computes balances with plain `+` and works fine in staging, then produces a negative balance in production. What happened?",
      options: [
        "Overflow checks are on in debug and compiled out in release — the same expression panicked in staging and wrapped in production",
        "The database returned a corrupted value",
        "Release builds use a different integer width",
      ],
      answer: 0,
      explain:
        "This is why `overflow-checks = true` in the release profile is a defensible setting for financial code, and why `checked_` at the arithmetic itself is better still.",
    },
    {
      kind: "editor",
      intro: `### Money in integers

1. \`const STROOPS_PER_XLM: i64 = 10_000_000;\`
2. \`fn to_stroops(xlm: i64, fraction: i64) -> Option<i64>\` using \`checked_mul(..)?\` then \`checked_add(..)\`.
3. Print \`to_stroops(2, 5_000_000)\` and \`to_stroops(i64::MAX, 0)\` with \`{:?}\`.
4. Print \`100i64.checked_sub(30)\` and \`10i64.checked_sub(i64::MIN)\` with \`{:?}\`.
5. Print \`i64::MAX.saturating_add(1)\` and \`i64::MAX.wrapping_add(1)\`.
6. Print whether \`0.1f64 + 0.2f64 == 0.3\`.

Expected output:

\`\`\`text
2.5 XLM: Some(25000000)
overflow: None
checked_sub ok: Some(70)
checked_sub under: None
saturating: 9223372036854775807
wrapping: -9223372036854775808
float equality: false
\`\`\`

The last line is why the first six matter.`,
    },
  ],
};
