import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Errors That Survive Production — hidden grading data.

export const rustErrorHandlingGraders: Record<string, AdvancedLessonContent> = {
  "rust-error-handling-1": {
    instructions: `## Propagate, don't panic

\`?\` unwraps \`Ok\` and returns early on \`Err\`, converting the error with \`From\` on the way out. It is a control-flow operator, not an unwrap — the failure keeps travelling until someone handles it.

### Your task

Write \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` that trims the input, parses it as \`i64\` **with \`?\`**, and returns double the value.

In \`main\`, call it with \`" 21 "\` and with \`"x"\`, matching each result and printing \`ok: <v>\` or \`err: <e>\`.

Expected output:

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

The second line is \`ParseIntError\`'s own \`Display\` text — you do not write it.

### Hints

- \`raw.trim().parse()\` infers its target type from the binding's annotation.
- \`Ok(n * 2)\` is the success path.
`,
    starterCode: `fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError> {
    // parse with ?, return double
}

fn main() {
    // match both calls and print ok:/err:
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "parse_amount returns a Result",
        kind: "fn_defined",
        fn: "parse_amount",
        params: [{ name: "raw", ty: "&str" }],
        returns: "Result<i64, std::num::ParseIntError>",
      },
      { name: "trims before parsing", kind: "method_called", method: "trim" },
      { name: "parses the input", kind: "method_called", method: "parse" },
      {
        name: "propagates instead of unwrapping",
        kind: "method_called",
        method: "unwrap",
        forbidden: true,
      },
      { name: "matches on the result", kind: "uses_construct", construct: "match" },
    ],
    expectedOutput: "ok: 42\nerr: invalid digit found in string\n",
    referenceSolution: `fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError> {
    let n: i64 = raw.trim().parse()?;
    Ok(n * 2)
}

fn main() {
    match parse_amount(" 21 ") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }

    match parse_amount("x") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
}
`,
  },

  "rust-error-handling-2": {
    instructions: `## Model the failure, don't stringify it

\`Result<T, String>\` cannot be matched on and carries no structured data. Model failure as an enum, one variant per thing that can actually go wrong, with the data an operator will need already inside the variant.

### Your task

1. \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`
2. \`fn validate(size: u32) -> Result<u32, TxError>\`: \`0\` → \`Empty\`; over \`100\` → \`TooLarge\` with limit \`100\`; otherwise \`Ok(size)\`.
3. Print the \`{:?}\` of \`validate(50)\`, \`validate(0)\`, \`validate(150)\`.

Expected output:

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\`

### Hints

- \`return Err(...)\` early for each failing case, then \`Ok(size)\` as the tail.
`,
    starterCode: `#[derive(Debug)]
enum TxError {
    Empty,
    TooLarge { limit: u32, got: u32 },
}

fn validate(size: u32) -> Result<u32, TxError> {
    // Empty, TooLarge, or Ok
}

fn main() {
    // print the Debug of three calls
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "validate returns a Result over the custom error",
        kind: "fn_defined",
        fn: "validate",
        params: [{ name: "size", ty: "u32" }],
        returns: "Result<u32, TxError>",
      },
      {
        name: "rejects the empty case",
        kind: "expr_present",
        expr: "Err(TxError::Empty)",
      },
      {
        name: "carries the limit and the actual size in the variant",
        kind: "expr_present",
        expr: "TxError::TooLarge { limit: 100, got: size }",
      },
      {
        name: "does not fall back to a String error",
        kind: "expr_present",
        expr: "String::from",
        forbidden: true,
      },
    ],
    expectedOutput:
      "Ok(50)\nErr(Empty)\nErr(TooLarge { limit: 100, got: 150 })\n",
    referenceSolution: `#[derive(Debug)]
enum TxError {
    Empty,
    TooLarge { limit: u32, got: u32 },
}

fn validate(size: u32) -> Result<u32, TxError> {
    if size == 0 {
        return Err(TxError::Empty);
    }
    if size > 100 {
        return Err(TxError::TooLarge {
            limit: 100,
            got: size,
        });
    }
    Ok(size)
}

fn main() {
    println!("{:?}", validate(50));
    println!("{:?}", validate(0));
    println!("{:?}", validate(150));
}
`,
  },

  "rust-error-handling-3": {
    instructions: `## Let ? do the conversion

\`?\` calls \`From::from\` on the error as it leaves the function. Implement \`From\` once and every \`?\` in the module converts for free.

Never implement \`Into\` by hand — std's blanket impl gives it to you from \`From\`, and \`?\` looks for \`From\`.

### Your task

1. \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`
2. \`impl From<ParseIntError> for ConfigError\` producing \`BadNumber\`.
3. \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\`: \`ok_or\` the \`Missing\` case, then \`parse()?\` — with **no** explicit conversion anywhere.
4. Print the \`{:?}\` of \`read_port(Some("8080"))\`, \`read_port(None)\`, \`read_port(Some("no"))\`.

Expected output:

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\`

### Hints

- \`use std::num::ParseIntError;\`
- \`raw.ok_or(ConfigError::Missing)?\` turns the \`Option\` into a \`Result\` and unwraps it.
`,
    starterCode: `use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    BadNumber(ParseIntError),
    Missing,
}

// impl From<ParseIntError> for ConfigError

fn read_port(raw: Option<&str>) -> Result<u16, ConfigError> {
    // ok_or, then parse()? — no manual conversion
}

fn main() {
    // print the Debug of three calls
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "implements From for the foreign error",
        kind: "impl_defined",
        type: "ConfigError",
        trait: "From<ParseIntError>",
      },
      {
        name: "bridges the Option into the Result chain",
        kind: "expr_present",
        expr: "raw.ok_or(ConfigError::Missing)?",
      },
      {
        name: "relies on ? for the conversion, with no manual map_err",
        kind: "method_called",
        method: "map_err",
        forbidden: true,
      },
      {
        name: "read_port returns the custom error",
        kind: "fn_defined",
        fn: "read_port",
        returns: "Result<u16, ConfigError>",
      },
    ],
    expectedOutput:
      "Ok(8080)\nErr(Missing)\nErr(BadNumber(ParseIntError { kind: InvalidDigit }))\n",
    referenceSolution: `use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    BadNumber(ParseIntError),
    Missing,
}

impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadNumber(e)
    }
}

fn read_port(raw: Option<&str>) -> Result<u16, ConfigError> {
    let raw = raw.ok_or(ConfigError::Missing)?;
    let port: u16 = raw.parse()?;
    Ok(port)
}

fn main() {
    println!("{:?}", read_port(Some("8080")));
    println!("{:?}", read_port(None));
    println!("{:?}", read_port(Some("no")));
}
`,
  },

  "rust-error-handling-4": {
    instructions: `## The two messages an error owes

**\`Debug\`** is for a developer, in a log or a test failure — derive it.
**\`Display\`** is for a human, one sentence, lowercase, no trailing period — write it.

\`impl std::error::Error\` (often an empty block) is what makes the type an *error*: it unlocks \`Box<dyn Error>\`, \`?\` into erased types, and \`source()\` chaining.

### Your task

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`
2. \`impl fmt::Display\` printing \`request timed out after <ms>ms\`.
3. \`impl Error for TimeoutError {}\` — empty.
4. In \`main\`: print one instance (\`ms: 5000\`) with \`{}\` and with \`{:?}\`, then box a second (\`ms: 250\`) as \`Box<dyn Error>\` and print it.

Expected output:

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\`

### Hints

- \`use std::error::Error;\` and \`use std::fmt;\`
- The signature is \`fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result\`.
`,
    starterCode: `use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct TimeoutError {
    ms: u64,
}

// impl fmt::Display, then impl Error

fn main() {
    // Display, Debug, then boxed as Box<dyn Error>
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "implements Display by hand",
        kind: "impl_defined",
        type: "TimeoutError",
        trait: "fmt::Display",
      },
      {
        name: "declares the type an Error",
        kind: "impl_defined",
        type: "TimeoutError",
        trait: "Error",
      },
      {
        name: "writes the message through the formatter",
        kind: "macro_invoked",
        macro: "write",
        args: 'f, "request timed out after {}ms", self.ms',
      },
      {
        name: "erases the concrete type behind Box<dyn Error>",
        kind: "let_binding",
        var: "boxed",
        ty: "Box<dyn Error>",
      },
    ],
    expectedOutput:
      "display: request timed out after 5000ms\ndebug: TimeoutError { ms: 5000 }\nboxed: request timed out after 250ms\n",
    referenceSolution: `use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct TimeoutError {
    ms: u64,
}

impl fmt::Display for TimeoutError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "request timed out after {}ms", self.ms)
    }
}

impl Error for TimeoutError {}

fn main() {
    let e = TimeoutError { ms: 5000 };
    println!("display: {}", e);
    println!("debug: {:?}", e);

    let boxed: Box<dyn Error> = Box::new(TimeoutError { ms: 250 });
    println!("boxed: {}", boxed);
}
`,
  },

  "rust-error-handling-5": {
    instructions: `## Keep the cause attached

\`Error::source\` attaches the reason. Each layer states **its own intent** and keeps the layer below intact — never inlining the cause into its own \`Display\`, or an N-level chain prints the same text N times over.

### Your task

1. \`#[derive(Debug)] struct Io(String)\` — \`Display\` prints \`io failure: <text>\`, empty \`Error\` impl.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` — \`Display\` prints exactly \`could not load config\`, with no mention of the cause.
3. \`impl Error for LoadFailed\` with \`source()\` returning \`Some(&self.cause)\`.
4. In \`main\`: build one with cause \`permission denied\`, print it, then walk the chain printing \`"  caused by: <e>"\` at each level.

Expected output:

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\`

### Hints

- The chain walk is \`let mut cause = err.source(); while let Some(e) = cause { ...; cause = e.source(); }\`
- \`source\`'s return type is \`Option<&(dyn Error + 'static)>\`.
`,
    starterCode: `use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct Io(String);

#[derive(Debug)]
struct LoadFailed {
    cause: Io,
}

// Display + Error for both; LoadFailed also implements source()

fn main() {
    // print the top error, then walk the chain
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "LoadFailed exposes its cause through source()",
        kind: "fn_defined",
        fn: "source",
        returns: "Option<&(dyn Error + 'static)>",
      },
      {
        name: "the wrapper's Display does not inline the cause",
        kind: "macro_invoked",
        macro: "write",
        args: 'f, "could not load config"',
      },
      {
        name: "the inner error describes itself",
        kind: "macro_invoked",
        macro: "write",
        args: 'f, "io failure: {}", self.0',
      },
      {
        name: "walks the chain rather than printing one level",
        kind: "expr_present",
        expr: "e.source()",
      },
    ],
    expectedOutput:
      "could not load config\n  caused by: io failure: permission denied\n",
    referenceSolution: `use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct Io(String);

impl fmt::Display for Io {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "io failure: {}", self.0)
    }
}

impl Error for Io {}

#[derive(Debug)]
struct LoadFailed {
    cause: Io,
}

impl fmt::Display for LoadFailed {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "could not load config")
    }
}

impl Error for LoadFailed {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        Some(&self.cause)
    }
}

fn main() {
    let err = LoadFailed {
        cause: Io(String::from("permission denied")),
    };

    println!("{}", err);

    let mut cause = err.source();
    while let Some(e) = cause {
        println!("  caused by: {}", e);
        cause = e.source();
    }
}
`,
  },

  "rust-error-handling-6": {
    instructions: `## Condition or bug

**A condition** is something the outside world is allowed to do — malformed input, a timeout, a closed connection. Not a bug. It gets a \`Result\` or an \`Option\`.

**A bug** is a violated invariant your own code was supposed to maintain. Continuing past it means computing on data you have already proved wrong. It gets a \`panic!\` or an \`assert!\`.

In a handler, an \`unwrap\` on input is a denial-of-service anyone can trigger deliberately.

### Your task

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — a condition. Use \`.get(i).copied()\`.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — the caller guarantees the range, so a violation is a bug. \`assert!\` with a message naming the index and the length, then index directly.
3. In \`main\`, with \`vec![10, 20, 30]\`: print \`checked_index\` at \`1\` and at \`9\` with \`{:?}\`, then \`invariant_index\` at \`2\`.

Expected output:

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\`

### Hints

- \`.get()\` gives \`Option<&i64>\`; \`.copied()\` makes it \`Option<i64>\`.
- \`assert!(cond, "…{}…", value)\` takes format arguments.
`,
    starterCode: `fn checked_index(data: &[i64], i: usize) -> Option<i64> {
    // a condition — no panic
}

fn invariant_index(data: &[i64], i: usize) -> i64 {
    // a bug if violated — assert, then index
}

fn main() {
    let data = vec![10, 20, 30];

    // in range, out of range, then the invariant call
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the fallible read returns an Option",
        kind: "fn_defined",
        fn: "checked_index",
        returns: "Option<i64>",
      },
      {
        name: "reads without panicking",
        kind: "method_called",
        method: "get",
        receiver: "data",
      },
      {
        name: "the invariant is asserted with a message",
        kind: "macro_invoked",
        macro: "assert",
      },
      {
        name: "the condition path never unwraps",
        kind: "method_called",
        method: "unwrap",
        forbidden: true,
      },
    ],
    expectedOutput:
      "in range: Some(20)\nout of range: None\ninvariant holds: 30\n",
    referenceSolution: `fn checked_index(data: &[i64], i: usize) -> Option<i64> {
    data.get(i).copied()
}

fn invariant_index(data: &[i64], i: usize) -> i64 {
    assert!(
        i < data.len(),
        "index {} out of range for {} entries",
        i,
        data.len()
    );
    data[i]
}

fn main() {
    let data = vec![10, 20, 30];

    println!("in range: {:?}", checked_index(&data, 1));
    println!("out of range: {:?}", checked_index(&data, 9));
    println!("invariant holds: {}", invariant_index(&data, 2));
}
`,
  },
};
