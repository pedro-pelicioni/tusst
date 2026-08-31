import type { LessonStep } from "@/content/steps";

// Advanced · Lifetimes.

export const rustLifetimesSteps: Record<string, LessonStep[]> = {
  "rust-lifetimes-1": [
    {
      kind: "theory",
      body: `A lifetime annotation does not make anything live longer. It is a **constraint the caller must satisfy**, and the compiler checks it at every call site.

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Read it as a sentence about the caller, not about the function: *"give me two references, and I will give you back one that is valid for as long as both of the inputs are."*

Nothing is allocated. Nothing is extended. \`'a\` is a name for a region of code, invented so the return value can be tied to an argument.`,
    },
    {
      kind: "theory",
      body: `The common misreading is that \`'a\` on both parameters means the two arguments must live *equally* long. They do not.

When a function is called with references of different lifetimes, the compiler picks \`'a\` to be the **shorter** of the two — every \`'a\` slot is then satisfied, because a longer-lived reference is always usable where a shorter one is required.

\`\`\`rust
let long = String::from("soroban");
{
    let short = String::from("rpc");
    let winner = longest(&long, &short);
    println!("{winner}");     // fine — 'a is the inner scope
}
// \`winner\` cannot escape this block: 'a ended with \`short\`
\`\`\`

The result is only constrained by the region the compiler chose, which is why this compiles inside the block and is rejected outside it.`,
    },
    {
      kind: "quiz",
      question:
        "`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str` is called with one reference that lives for the whole program and one that lives for three lines. What is `'a`?",
      options: [
        "The shorter of the two regions — and the returned reference is only valid within it",
        "The longer of the two, because `'a` must cover both arguments",
        "It is a compile error: both arguments must have the same lifetime",
      ],
      answer: 0,
      explain:
        "Lifetimes are subtyping-like: a `&'long T` coerces to `&'short T`. The compiler picks the largest region where every constraint holds, which is the intersection — the shorter one.",
    },
    {
      kind: "fill",
      prompt:
        "Tie the return value to the inputs so the caller knows how long it is valid.",
      file: "main.rs",
      before: "fn longest<'a>(a: &'a str, b: &'a str) -> ",
      after: " {",
      choices: ["&'a str", "&str", "String"],
      answer: 0,
      explain:
        "`&str` alone will not compile here: with two input references the compiler cannot guess which one the output borrows from. `String` would compile but forces an allocation the function does not need.",
    },
    {
      kind: "quiz",
      question:
        "What does `<'a>` in a function signature actually cost at runtime?",
      options: [
        "Nothing. Lifetimes are erased after borrow checking and emit no code at all",
        "One extra machine word per reference, to carry the region tag",
        "A bounds check on every dereference of the annotated reference",
      ],
      answer: 0,
      explain:
        "Lifetimes exist only during compilation. This is why the borrow checker can be strict for free — there is no runtime representation to pay for.",
    },
    {
      kind: "editor",
      intro: `### Tie an output to its inputs

Write \`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str\` that returns whichever argument is longer (return \`a\` when they are equal).

In \`main\`, call it with a \`&String\` holding \`soroban\` and the literal \`"rpc"\`, and print the winner.

Expected output:

\`\`\`text
longest: soroban
\`\`\``,
    },
  ],

  "rust-lifetimes-2": [
    {
      kind: "theory",
      body: `Most signatures need no annotation, because three **elision rules** fill them in. Knowing them tells you exactly when you must write one yourself.

1. Every elided input lifetime gets its own distinct parameter.
2. If there is **exactly one** input lifetime, it is assigned to every elided output lifetime.
3. If one of the inputs is \`&self\` or \`&mut self\`, **its** lifetime is assigned to every elided output lifetime.

\`\`\`rust
fn first_word(s: &str) -> &str        // rule 2 — one input, no ambiguity
fn rest(&self) -> &str                // rule 3 — output borrows from self
\`\`\``,
    },
    {
      kind: "theory",
      body: `The rules are deliberately dumb: they never guess. When two input references could plausibly be the source of the output, elision simply gives up and you get an error asking for an annotation.

\`\`\`rust
fn pick(a: &str, b: &str) -> &str     // error: missing lifetime specifier
\`\`\`

That error is not the compiler being difficult. \`a\` and \`b\` may have completely different lifetimes, and the answer changes what the caller is allowed to do with the result. Only you know which one the output came from — so only you can write it down.`,
    },
    {
      kind: "quiz",
      question:
        "`fn head(&self, other: &str) -> &str` compiles with no annotations. Which lifetime does the returned `&str` get?",
      options: [
        "`self`'s — rule 3 takes precedence whenever a method has a `&self` receiver",
        "`other`'s, because it is the last reference in the parameter list",
        "The shorter of `self` and `other`, chosen at each call site",
      ],
      answer: 0,
      explain:
        "Rule 3 exists precisely because methods returning a view into `self` are the overwhelmingly common case. If you actually meant to return a borrow of `other`, you must annotate — elision will silently give you the wrong thing otherwise, and the error will appear at the call site.",
    },
    {
      kind: "fill",
      prompt:
        "This method returns a view into the struct's own buffer. Complete the impl header.",
      file: "main.rs",
      before: "struct Parser<'a> { input: &'a str }\n\nimpl",
      after: " Parser<'a> {\n    fn rest(&self) -> &str { self.input }\n}",
      choices: ["<'a>", "<'static>", ""],
      answer: 0,
      explain:
        "A struct with a lifetime parameter needs it declared on the impl block too — `impl<'a> Parser<'a>`. Inside the block, `rest` needs no annotation: rule 3 covers it.",
    },
    {
      kind: "quiz",
      question: "When does elision force you to write an explicit lifetime?",
      options: [
        "When there are two or more input references, no `&self`, and the function returns a reference",
        "Whenever the function returns a reference at all",
        "Whenever the function has more than one parameter",
      ],
      answer: 0,
      explain:
        "All three conditions must hold. One input reference is covered by rule 2, a `&self` receiver by rule 3, and returning an owned value needs no lifetime at all.",
    },
    {
      kind: "editor",
      intro: `### Let elision do its job

1. Write \`fn first_word(s: &str) -> &str\` returning everything before the first space (the whole string if there is none). No annotations — rule 2 covers it.
2. Define \`struct Parser<'a> { input: &'a str }\` with \`impl<'a> Parser<'a>\` and a method \`rest(&self) -> &str\` returning \`self.input\`.
3. Print \`first_word("submit tx now")\`, then \`rest()\` on a parser built over \`"ledger 42"\`.

Expected output:

\`\`\`text
word: submit
rest: ledger 42
\`\`\``,
    },
  ],

  "rust-lifetimes-3": [
    {
      kind: "theory",
      body: `When two inputs have genuinely unrelated lifetimes, give them separate names. The one that matters is the one on the **output**.

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

This says something precise and useful: the result borrows from \`text\` and **not** from \`sep\`. The caller may therefore drop \`sep\` immediately and keep using the result.

Collapsing both to \`'a\` would compile too — and would silently tie the result to \`sep\` as well, forcing the caller to keep alive something the function never borrowed from.`,
    },
    {
      kind: "theory",
      body: `That is the real cost of over-annotating: it does not make the function wrong, it makes it **needlessly restrictive**, and the restriction is felt by every caller.

\`\`\`rust
let cut = {
    let sep = String::from(":");
    prefix(&text, &sep)      // \`sep\` dies at the closing brace
};
println!("{cut}");           // still fine — \`cut\` only borrows from \`text\`
\`\`\`

With \`fn prefix<'a>(text: &'a str, sep: &'a str) -> &'a str\` this exact code stops compiling, for no reason the reader can see from the call site. Signatures are an API surface; lifetimes are part of the contract.`,
    },
    {
      kind: "quiz",
      question:
        "`prefix` is changed from `<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str` to `<'a>(text: &'a str, sep: &'a str) -> &'a str`. Callers start failing. Why?",
      options: [
        "The result is now tied to `sep` as well, so it cannot outlive a short-lived separator",
        "A single lifetime parameter cannot be used on more than one argument",
        "The function now returns a borrow of `sep` instead of `text`",
      ],
      answer: 0,
      explain:
        "`'a` becomes the intersection of both inputs' regions, so the output inherits the shorter one. The body is unchanged; only the promise to the caller got smaller.",
    },
    {
      kind: "fill",
      prompt:
        "The result is a slice of `text` only. Annotate the return type accordingly.",
      file: "main.rs",
      before: "fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> ",
      after: " {",
      choices: ["&'a str", "&'b str", "&'static str"],
      answer: 0,
      explain:
        "`&'b str` would be a lie the borrow checker catches in the body: the returned slice points into `text`, not into `sep`.",
    },
    {
      kind: "quiz",
      question:
        "A function takes two references and returns an owned `String`. How many lifetime annotations does it need?",
      options: [
        "None. Elision names the inputs, and an owned return value borrows from nothing",
        "Two — every reference parameter must be annotated explicitly",
        "One, shared by both parameters",
      ],
      answer: 0,
      explain:
        "Annotations are only ever forced by an output that is itself a reference. If you return owned data, the inputs' lifetimes stop being anyone's problem.",
    },
    {
      kind: "editor",
      intro: `### Two lifetimes, one of them irrelevant

Write \`fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str\` returning everything in \`text\` before the first occurrence of \`sep\` (or all of \`text\` if it does not occur).

In \`main\`, build \`let text = String::from("GA7Q:250:live");\`, then in an **inner block** create a separator \`String\` holding \`":"\`, call \`prefix\`, and bind the result outside the block. Print it after the block has ended.

Expected output:

\`\`\`text
prefix: GA7Q
\`\`\`

If it compiles, you have proved the result does not borrow from the separator.`,
    },
  ],

  "rust-lifetimes-4": [
    {
      kind: "theory",
      body: `A struct may hold references, and then it needs a lifetime parameter:

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

The parameter is a promise: **an instance of \`Frame\` may not outlive the buffer it points into.** The compiler enforces it, so the struct can never be left holding a dangling pointer into a freed allocation.

This is the shape of every zero-copy parser. Instead of allocating a \`String\` per field, you hand out slices of a buffer someone else owns.`,
    },
    {
      kind: "theory",
      body: `The trade is worth stating plainly, because it decides your whole API.

**Borrowed (\`&'a str\` fields).** No allocation per field, so parsing a large request is nearly free. The cost: the struct is tethered — it cannot be stored in a long-lived cache, sent to another thread that outlives the buffer, or returned from the function that owns the input.

**Owned (\`String\` fields).** Allocates, but the value is self-contained, \`'static\`, and goes anywhere.

For an RPC service that decodes a request, uses it, and drops it inside one handler, borrowed is the right call and the win is real. For anything you retain past the request, take the allocation.`,
    },
    {
      kind: "quiz",
      question:
        "A handler parses a request into `Frame<'a>` borrowed from the request buffer, then tries to push it into a `Vec` that lives in application state. What happens?",
      options: [
        "It does not compile — the `Vec` outlives the buffer, so the borrow cannot be stored there",
        "It compiles, and the frame's slices dangle once the buffer is freed",
        "It compiles, and Rust copies the underlying bytes into the Vec automatically",
      ],
      answer: 0,
      explain:
        "This is exactly the error the lifetime parameter exists to produce, and it is telling you something true: retaining that data requires owning it. Convert to `String` at the boundary where the lifetime ends.",
    },
    {
      kind: "fill",
      prompt:
        "Declare a struct that borrows two slices from the same buffer.",
      file: "main.rs",
      before: "struct Frame",
      after: " {\n    method: &'a str,\n    params: &'a str,\n}",
      choices: ["<'a>", "<'static>", "<T>"],
      answer: 0,
      explain:
        "`<'static>` would compile but would only accept references valid for the whole program — in practice, only literals. It is the classic overreaction to a lifetime error.",
    },
    {
      kind: "quiz",
      question:
        "Why is `fn parse(raw: &'a str) -> Frame<'a>` the right signature for the constructor?",
      options: [
        "It states that the frame's slices point into `raw`, so the compiler ties their fates together",
        "It forces `raw` to be copied into the frame, making the frame independent",
        "It is only stylistic — `fn parse(raw: &str) -> Frame` means the same thing",
      ],
      answer: 0,
      explain:
        "The third option is close enough to be dangerous: elision *would* fill this in identically here (one input reference, rule 2). Writing it out is still worth it — the signature documents that the return value is a view, not a copy.",
    },
    {
      kind: "editor",
      intro: `### A zero-copy view

1. Define \`struct Frame<'a> { method: &'a str, params: &'a str }\`.
2. In \`impl<'a> Frame<'a>\`, write \`fn parse(raw: &'a str) -> Frame<'a>\` that splits on the first \`'|'\` — text before it is \`method\`, text after it is \`params\`. With no \`'|'\`, \`method\` is the whole input and \`params\` is \`""\`.
3. In \`main\`, parse a \`String\` holding \`getLedgerEntries|[42]\` and print both fields.

Expected output:

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

No \`String\` allocation anywhere in \`parse\`.`,
    },
  ],

  "rust-lifetimes-5": [
    {
      kind: "theory",
      body: `\`'static\` means two different things depending on where it appears, and conflating them is one of the most common sources of confusion in async Rust.

**As a reference lifetime — \`&'static T\`** — it means: this reference is valid for the entire run of the program. String literals qualify, because they are baked into the binary.

\`\`\`rust
let s: &'static str = "baked into the binary";
\`\`\`

This is a strong claim, and very few runtime values can make it.`,
    },
    {
      kind: "theory",
      body: `**As a bound — \`T: 'static\`** — it means something much weaker: this type contains **no references with a lifetime shorter than the program**. It does *not* mean the value lives forever.

An owned \`String\` satisfies \`T: 'static\` easily. It borrows from nothing, so there is nothing that could dangle. It is still dropped at the end of its scope like any other value.

\`\`\`rust
fn spawn_like<T: Send + 'static>(value: T) -> T { value }

let owned = String::from("owned at runtime");
spawn_like(owned);      // fine: String: 'static
\`\`\`

This is why \`thread::spawn\` and \`tokio::spawn\` require \`'static\`. The task may outlive the function that created it, so it may not hold a borrow of that function's locals. Owned data is welcome; the bound is about *borrowing*, not about *duration*.`,
    },
    {
      kind: "quiz",
      question:
        "`thread::spawn` requires `F: 'static`. Does that mean the closure must live for the whole program?",
      options: [
        "No — it means the closure may not borrow anything shorter-lived than the program. It is dropped when the thread ends",
        "Yes — spawned closures are leaked and never dropped",
        "Yes, which is why every spawned closure must be `move` and use only literals",
      ],
      answer: 0,
      explain:
        "The bound restricts what may be *captured*, not how long the value lasts. That is why `move` closures capturing owned `String`s satisfy it without difficulty.",
    },
    {
      kind: "fill",
      prompt:
        "Bound a generic so it can be handed to another thread: no short-lived borrows, safe to transfer.",
      file: "main.rs",
      before: "fn spawn_like<T: ",
      after: ">(value: T) -> T {",
      choices: ["Send + 'static", "&'static", "Sync"],
      answer: 0,
      explain:
        "`Send` permits the transfer between threads; `'static` guarantees there is no borrow that could dangle once the spawning frame returns. `Sync` is about *sharing* a reference across threads — a different question.",
    },
    {
      kind: "quiz",
      question:
        "You hit `error: borrowed value does not live long enough` on a spawned task. Which fix is usually right?",
      options: [
        "Give the task owned data — clone into it, or move an `Arc` in",
        "Add `&'static` to the borrowed value's type",
        "Leak the value with `Box::leak` so it becomes `'static`",
      ],
      answer: 0,
      explain:
        "`Box::leak` does technically produce a `&'static` and is occasionally correct for a genuinely process-lifetime value — but reaching for it to silence a borrow error means allocating memory you can never reclaim, once per call.",
    },
    {
      kind: "editor",
      intro: `### Two meanings, one program

1. Bind a \`&'static str\` with the explicit type annotation, holding \`baked into the binary\`, and print it.
2. Write \`fn spawn_like<T: Send + 'static>(value: T) -> T\` that just returns its argument.
3. Pass an owned \`String\` holding \`owned at runtime\` through it and print the result — proving \`String\` satisfies \`'static\`.

Expected output:

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\``,
    },
  ],
};
