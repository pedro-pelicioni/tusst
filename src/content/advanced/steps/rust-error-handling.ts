import type { LessonStep } from "@/content/steps";

// Advanced · Errors That Survive Production.

export const rustErrorHandlingSteps: Record<string, LessonStep[]> = {
  "rust-error-handling-1": [
    {
      kind: "theory",
      body: `\`Result<T, E>\` is an ordinary enum. There is nothing built into the language about it except one operator.

\`\`\`rust
enum Result<T, E> { Ok(T), Err(E) }
\`\`\`

\`?\` is that operator. Applied to a \`Result\`, it unwraps \`Ok\` and **returns early** on \`Err\`:

\`\`\`rust
let n: i64 = raw.trim().parse()?;
\`\`\`

which is exactly:

\`\`\`rust
let n: i64 = match raw.trim().parse() {
    Ok(v) => v,
    Err(e) => return Err(From::from(e)),
};
\`\`\``,
    },
    {
      kind: "theory",
      body: `Two details in that desugaring earn their keep.

**\`From::from(e)\`.** \`?\` converts the error on its way out. That is why a function returning \`Result<T, MyError>\` can use \`?\` on a \`ParseIntError\` — as long as \`MyError: From<ParseIntError>\` exists. This is the whole mechanism behind ergonomic error handling in Rust, and it is the next-but-one lesson.

**The early return.** \`?\` can only appear in a function that returns \`Result\` (or \`Option\`, or another \`Try\` type). It is not an unwrap that panics — it is a control-flow operator, and the failure keeps travelling up until someone handles it.`,
    },
    {
      kind: "quiz",
      question:
        "What does `?` do that `.unwrap()` does not?",
      options: [
        "It returns the error from the enclosing function, converting it with `From` — the caller decides what happens",
        "It retries the operation once before giving up",
        "It logs the error and continues with a default value",
      ],
      answer: 0,
      explain:
        "`unwrap` ends the process. `?` moves the decision one frame up, which is the only thing that lets a library stay usable inside someone else's service.",
    },
    {
      kind: "fill",
      prompt:
        "Propagate the parse failure to the caller instead of panicking on it.",
      file: "main.rs",
      before: "let n: i64 = raw.trim().parse()",
      after: ";",
      choices: ["?", ".unwrap()", ".expect(\"bad\")"],
      answer: 0,
      explain:
        "All three compile. Only `?` leaves the caller a choice — and in a request handler, the other two turn a bad input into a crashed task.",
    },
    {
      kind: "quiz",
      question:
        "Why does `?` fail to compile inside a `fn main()` with no return type?",
      options: [
        "`?` returns early with an `Err`, and a function returning `()` has nothing to return it as",
        "`main` is special-cased and never permits error propagation",
        "`?` requires an explicit `use std::ops::Try` import",
      ],
      answer: 0,
      explain:
        "The fix is to give main a return type: `fn main() -> Result<(), Box<dyn Error>>`. Rust then prints the `Debug` of the error and exits non-zero.",
    },
    {
      kind: "editor",
      intro: `### Propagate, don't panic

Write \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` that trims the input, parses it as \`i64\` with \`?\`, and returns double the value.

In \`main\`, call it twice — with \`" 21 "\` and with \`"x"\` — and \`match\` each result, printing \`ok: <v>\` or \`err: <e>\`.

Expected output:

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

The second line is \`ParseIntError\`'s own \`Display\` text.`,
    },
  ],

  "rust-error-handling-2": [
    {
      kind: "theory",
      body: `\`Result<T, String>\` is where error handling goes to die. A \`String\` cannot be matched on, cannot carry structured fields, and forces every caller to parse English to decide what to do.

Model failure as an enum instead — one variant per thing that can actually go wrong:

\`\`\`rust
#[derive(Debug)]
enum TxError {
    Empty,
    TooLarge { limit: u32, got: u32 },
}
\`\`\`

Now a caller can \`match\` on the variant, and \`TooLarge\` carries the numbers a log line or an HTTP error body actually needs.`,
    },
    {
      kind: "theory",
      body: `Two habits make this pay off.

**Put the data in the variant.** \`TooLarge { limit, got }\` costs nothing and answers the operator's first question. \`TooLarge\` alone forces them to go read the code to find the limit.

**Keep the enum closed and small.** One variant per *decision the caller might make differently*, not one per line of code that can fail. Ten variants that all mean "the request was malformed" is a worse API than one \`Malformed { field: String }\`.

In a real crate you would derive \`Display\` and \`Error\` with \`thiserror\` rather than writing them by hand. It generates exactly what the next two lessons write manually — worth doing by hand once, so you know what the macro is doing.`,
    },
    {
      kind: "quiz",
      question:
        "Why is `Result<T, String>` a poor choice for a library's public error type?",
      options: [
        "Callers cannot match on it, so recovering from one specific failure means string-matching English prose",
        "`String` errors allocate, which is too slow for any production service",
        "`String` does not implement `std::error::Error`, so `?` cannot be used at all",
      ],
      answer: 0,
      explain:
        "The allocation is real but rarely the deciding factor — a failure path is not usually hot. The lost ability to *branch* on the failure is what actually hurts.",
    },
    {
      kind: "fill",
      prompt:
        "Give the variant the numbers an operator will need, without a separate lookup.",
      file: "main.rs",
      before: "enum TxError {\n    Empty,\n    TooLarge ",
      after: ",\n}",
      choices: ["{ limit: u32, got: u32 }", "(String)", ""],
      answer: 0,
      explain:
        "Named fields on a variant read better at the construction site than a tuple variant: `TooLarge { limit: 100, got: size }` needs no comment.",
    },
    {
      kind: "quiz",
      question:
        "How many variants should a request-validation error enum have?",
      options: [
        "One per decision a caller might make differently — not one per fallible line",
        "One per call to `?` in the module, so every failure is traceable",
        "Exactly one, carrying a message field",
      ],
      answer: 0,
      explain:
        "The enum is an API. Its shape should follow what callers need to distinguish, and the detail that is only for humans belongs in the fields.",
    },
    {
      kind: "editor",
      intro: `### Model the failure, don't stringify it

1. Define \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`.
2. Write \`fn validate(size: u32) -> Result<u32, TxError>\`: \`0\` is \`Empty\`, anything over \`100\` is \`TooLarge\` with limit \`100\`, everything else is \`Ok(size)\`.
3. Print the \`{:?}\` of \`validate(50)\`, \`validate(0)\` and \`validate(150)\`.

Expected output:

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\``,
    },
  ],

  "rust-error-handling-3": [
    {
      kind: "theory",
      body: `\`?\` calls \`From::from\` on the error as it leaves. Implement \`From\` once, and every \`?\` in the module converts for free:

\`\`\`rust
impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadNumber(e)
    }
}
\`\`\`

Now this compiles, even though \`parse\` returns \`ParseIntError\` and the function returns \`ConfigError\`:

\`\`\`rust
fn read_port(raw: &str) -> Result<u16, ConfigError> {
    let port: u16 = raw.parse()?;    // converted on the way out
    Ok(port)
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Never implement \`Into\` by hand. \`std\` has a blanket \`impl<T, U: From<T>> Into<U> for T\`, so implementing \`From\` gives you \`Into\` automatically — and the reverse does not hold.

For an \`Option\` in the middle of a \`Result\` chain, bridge it explicitly:

\`\`\`rust
let raw = raw.ok_or(ConfigError::Missing)?;
\`\`\`

\`ok_or\` turns \`None\` into \`Err(...)\`; \`ok_or_else\` takes a closure and is the one to use when constructing the error is not free. Its mirror image, \`.ok()\`, discards a \`Result\`'s error and gives you an \`Option\` — convenient, and worth being suspicious of, since it throws away the reason.`,
    },
    {
      kind: "quiz",
      question:
        "You implemented `From<ParseIntError> for ConfigError`. What else do you get?",
      options: [
        "`Into<ConfigError> for ParseIntError`, from the blanket impl in std — and `?` conversion at every call site",
        "Nothing else; `Into` must be implemented separately",
        "`TryFrom` in the opposite direction, automatically",
      ],
      answer: 0,
      explain:
        "This is why the guidance is always 'implement From, never Into'. Implementing `Into` directly gets you no `From`, and `?` looks for `From`.",
    },
    {
      kind: "fill",
      prompt:
        "Turn a missing value into your own error so `?` can carry it onward.",
      file: "main.rs",
      before: "let raw = raw.",
      after: "(ConfigError::Missing)?;",
      choices: ["ok_or", "unwrap_or", "expect"],
      answer: 0,
      explain:
        "`ok_or` maps `Option<T>` to `Result<T, E>`. `unwrap_or` would substitute a default and hide the fact that the value was absent.",
    },
    {
      kind: "quiz",
      question:
        "When should you reach for `ok_or_else` instead of `ok_or`?",
      options: [
        "When building the error value is not free — `ok_or` evaluates its argument eagerly, even on the `Some` path",
        "When the `Option` is `None` more often than `Some`",
        "When the error type does not implement `Clone`",
      ],
      answer: 0,
      explain:
        "Same rule as `unwrap_or` versus `unwrap_or_else`. If the argument is a plain unit variant, `ok_or` is fine and reads better; if it allocates or formats, take the closure.",
    },
    {
      kind: "editor",
      intro: `### Let ? do the conversion

1. Define \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`.
2. Implement \`From<ParseIntError> for ConfigError\` producing \`BadNumber\`.
3. Write \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\`: \`ok_or\` the \`Missing\` case, then \`parse()?\` — with no explicit conversion anywhere.
4. Print the \`{:?}\` of three calls: \`Some("8080")\`, \`None\`, \`Some("no")\`.

Expected output:

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\``,
    },
  ],

  "rust-error-handling-4": [
    {
      kind: "theory",
      body: `An error owes two different messages to two different readers.

**\`Debug\`** — for you, in a log or a test failure. Derive it. It shows the structure, including field names, and is never shown to a user.

**\`Display\`** — for a human, in a log line or an API response. Write it by hand. One sentence, lowercase, no trailing period, no "Error:" prefix (the caller adds context around it).

\`\`\`rust
impl fmt::Display for TimeoutError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "request timed out after {}ms", self.ms)
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`impl std::error::Error for TimeoutError {}\` — often an empty block — is what makes the type an *error* rather than a struct that happens to be printable.

It requires \`Debug + Display\`, and in exchange unlocks the ecosystem: your type can be boxed as \`Box<dyn Error>\`, returned from \`fn main()\`, carried by \`anyhow\`, and chained with \`source()\`.

\`\`\`rust
let boxed: Box<dyn Error> = Box::new(TimeoutError { ms: 250 });
println!("{boxed}");        // uses your Display
\`\`\`

\`Box<dyn Error>\` is the right error type for an application's top level, where you no longer intend to match on the variant. A **library** should keep its concrete enum, so its callers still can.`,
    },
    {
      kind: "quiz",
      question:
        "Why does `std::error::Error` require both `Debug` and `Display`?",
      options: [
        "They serve different readers: `Debug` shows the structure for a developer, `Display` writes one sentence for a log or a user",
        "`Debug` is used on the success path and `Display` on the failure path",
        "It is historical; `Display` alone would be sufficient today",
      ],
      answer: 0,
      explain:
        "It also has a practical consequence: `fn main() -> Result<(), E>` prints the `Debug`, not the `Display` — which surprises people who only wrote a nice `Display`.",
    },
    {
      kind: "fill",
      prompt:
        "Declare the type an error, inheriting the default methods.",
      file: "main.rs",
      before: "impl Error for TimeoutError ",
      after: "",
      choices: ["{}", "{ fn description(&self) -> &str { \"\" } }", ";"],
      answer: 0,
      explain:
        "Every method on `Error` has a default, so an empty block is complete. `description` is deprecated — `Display` replaced it.",
    },
    {
      kind: "quiz",
      question:
        "When is `Box<dyn Error>` the right error type, and when is it wrong?",
      options: [
        "Right at an application's top level where nobody matches on it; wrong for a library, whose callers still need to distinguish failures",
        "Right everywhere — it is strictly more flexible than a concrete enum",
        "Wrong everywhere: it allocates on every error path",
      ],
      answer: 0,
      explain:
        "This is the same split as `anyhow` versus `thiserror`. Erasing the type is a convenience you may only spend on your own behalf, never on your callers'.",
    },
    {
      kind: "editor",
      intro: `### The two messages an error owes

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`.
2. Implement \`fmt::Display\` printing \`request timed out after <ms>ms\`.
3. Implement \`std::error::Error\` with an empty block.
4. In \`main\`, print one instance with \`{}\` and with \`{:?}\`, then box a second (\`ms: 250\`) as \`Box<dyn Error>\` and print it.

Expected output:

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\``,
    },
  ],

  "rust-error-handling-5": [
    {
      kind: "theory",
      body: `A single-line error is often useless on its own. *"could not load config"* tells an operator nothing they did not already know.

\`Error::source\` is the standard way to attach the reason:

\`\`\`rust
impl Error for LoadFailed {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        Some(&self.cause)
    }
}
\`\`\`

Each layer adds *what it was trying to do* and keeps the layer below intact. Walking the chain then produces the whole story, from the intent down to the syscall.`,
    },
    {
      kind: "theory",
      body: `Walking it is a plain loop:

\`\`\`rust
let mut cause = err.source();
while let Some(e) = cause {
    println!("  caused by: {e}");
    cause = e.source();
}
\`\`\`

The rule that makes this worth doing: **each layer's \`Display\` describes its own intent, never the layer below.** If \`LoadFailed\` prints "could not load config: permission denied", the chain now says "permission denied" twice and the duplication grows with every level.

This is what \`anyhow\`'s \`.context("could not load config")\` builds automatically, and it is why a good Rust log line can end an investigation instead of starting one.`,
    },
    {
      kind: "quiz",
      question:
        "Why should a wrapping error's `Display` not include its source's message?",
      options: [
        "The chain is printed layer by layer, so embedding it repeats the same text at every level",
        "`Display` is not allowed to call other `Display` impls",
        "The source may not exist yet when `Display` runs",
      ],
      answer: 0,
      explain:
        "Every layer that inlines its cause turns an N-level chain into O(N²) text. Each layer states its own intent; the chain supplies the rest.",
    },
    {
      kind: "fill",
      prompt: "Expose the underlying failure so the chain can be walked.",
      file: "main.rs",
      before: "impl Error for LoadFailed {\n    fn ",
      after: "(&self) -> Option<&(dyn Error + 'static)> {\n        Some(&self.cause)\n    }\n}",
      choices: ["source", "cause", "inner"],
      answer: 0,
      explain:
        "`cause` was the old name and is deprecated. `source` is the one the whole ecosystem walks.",
    },
    {
      kind: "quiz",
      question:
        "An operator sees `could not load config` with no further detail. What is most likely missing?",
      options: [
        "The wrapping error does not implement `source()`, so the chain ends at the first layer",
        "The error was logged with `{}` instead of `{:?}`",
        "The log level is too low to show nested errors",
      ],
      answer: 0,
      explain:
        "`source()` has a default returning `None`, so forgetting it fails silently — the chain simply stops, and nothing warns you.",
    },
    {
      kind: "editor",
      intro: `### Keep the cause attached

1. \`#[derive(Debug)] struct Io(String)\` with \`Display\` printing \`io failure: <text>\`, and an empty \`Error\` impl.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` with \`Display\` printing exactly \`could not load config\` — no mention of the cause.
3. Implement \`Error\` for \`LoadFailed\` with \`source()\` returning \`Some(&self.cause)\`.
4. In \`main\`, build one with cause \`permission denied\`, print it, then walk the chain printing \`"  caused by: <e>"\` for each level.

Expected output:

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\``,
    },
  ],

  "rust-error-handling-6": [
    {
      kind: "theory",
      body: `The line is not "panics are bad". It is a question about *whose* mistake the condition represents.

**A condition** is something the outside world is allowed to do: malformed input, a missing file, a timeout, a closed connection. It is not a bug. It gets a \`Result\`.

**A bug** is a violated invariant your own code was supposed to maintain: an index the function itself computed being out of range, a state machine reaching an unreachable arm. Continuing past it means computing on data you have already proved wrong. It gets a \`panic!\`.`,
    },
    {
      kind: "theory",
      body: `In a request handler, that distinction becomes an availability property.

An \`unwrap()\` on user input turns a malformed request into a panic. Depending on the runtime, that either unwinds one task — and returns a bare 500 with no useful log — or aborts the process and takes every in-flight request with it. Either way, an attacker who found it has a denial-of-service.

Practical rules:

- \`unwrap\`/\`expect\` on anything derived from input: **never** in a handler.
- \`expect("...")\` at startup, where the alternative is running misconfigured: **fine**, and better than a \`Result\` nobody reads.
- \`assert!\` for an invariant with a message naming what was violated: **good**, and it documents the assumption.
- In tests: \`unwrap\` freely. A failed test *should* be loud.`,
    },
    {
      kind: "quiz",
      question:
        "A handler does `let id = params.get(\"id\").unwrap();`. What is the real risk?",
      options: [
        "Any request without `id` panics the task — a denial-of-service anyone can trigger on purpose",
        "The response is slower because unwinding is expensive",
        "None, as long as the client is well-behaved",
      ],
      answer: 0,
      explain:
        "Absent input is a condition, not a bug. The third answer is the reasoning that ships this: the client is exactly the part of the system you do not control.",
    },
    {
      kind: "fill",
      prompt:
        "Read an index that may legitimately be out of range, without panicking.",
      file: "main.rs",
      before: "data.",
      after: "(i).copied()",
      choices: ["get", "index", "iter().nth"],
      answer: 0,
      explain:
        "`get` returns `Option<&T>`; `.copied()` turns `Option<&i64>` into `Option<i64>`. `data[i]` panics, which is right only when being out of range would be a bug.",
    },
    {
      kind: "quiz",
      question:
        "Where is `expect(\"DATABASE_URL must be set\")` a defensible choice?",
      options: [
        "At startup — the alternative is a process running misconfigured, and the message names exactly what is missing",
        "Nowhere; `expect` is `unwrap` with extra steps",
        "In a request handler, as long as the message is descriptive",
      ],
      answer: 0,
      explain:
        "Failing fast at boot is a feature: the process never reaches the load balancer. The same call inside a handler is a per-request crash.",
    },
    {
      kind: "editor",
      intro: `### Condition or bug

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — a possibly-absent value is a **condition**. Use \`.get(i).copied()\`.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — the caller guarantees the range, so a violation is a **bug**. \`assert!\` with a message naming the index and the length, then index directly.
3. In \`main\`, with \`vec![10, 20, 30]\`: print \`checked_index\` at \`1\` and at \`9\` with \`{:?}\`, then \`invariant_index\` at \`2\`.

Expected output:

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\``,
    },
  ],
};
