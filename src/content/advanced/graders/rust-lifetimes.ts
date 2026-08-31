import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Lifetimes — hidden grading data.

export const rustLifetimesGraders: Record<string, AdvancedLessonContent> = {
  "rust-lifetimes-1": {
    instructions: `## Tie an output to its inputs

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Read as a promise to the caller: *give me two references, and the one I return is valid for as long as both inputs are.* Nothing is allocated and nothing is extended — \`'a\` only lets the compiler connect the output to the inputs.

### Your task

Implement \`longest\`, returning whichever argument is longer (return \`a\` when the lengths are equal).

Call it in \`main\` with a \`&String\` holding \`soroban\` and the literal \`"rpc"\`.

Expected output:

\`\`\`text
longest: soroban
\`\`\`

### Hints

- \`.len()\` on a \`&str\` gives the byte length.
- An \`if\`/\`else\` is an expression — it can be the function's tail.
`,
    starterCode: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    // return the longer of the two
}

fn main() {
    let x = String::from("soroban");
    let y = "rpc";

    // print the winner
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "longest ties its output to both inputs",
        kind: "fn_defined",
        fn: "longest",
        params: [
          { name: "a", ty: "&'a str" },
          { name: "b", ty: "&'a str" },
        ],
        returns: "&'a str",
      },
      { name: "compares the two lengths", kind: "expr_present", expr: "a.len() >= b.len()" },
      {
        name: "calls longest with a borrowed String and a literal",
        kind: "expr_present",
        expr: "longest(&x, y)",
      },
    ],
    expectedOutput: "longest: soroban\n",
    referenceSolution: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() {
        a
    } else {
        b
    }
}

fn main() {
    let x = String::from("soroban");
    let y = "rpc";
    println!("longest: {}", longest(&x, y));
}
`,
  },

  "rust-lifetimes-2": {
    instructions: `## Let elision do its job

Three rules fill in the lifetimes you did not write:

1. Each elided input reference gets its own lifetime parameter.
2. With **exactly one** input lifetime, it is assigned to every elided output.
3. With a \`&self\` receiver, **self's** lifetime is assigned to every elided output.

### Your task

1. \`fn first_word(s: &str) -> &str\` — everything before the first space, or the whole string if there is none. Rule 2 means no annotation is needed.
2. \`struct Parser<'a> { input: &'a str }\` with \`impl<'a> Parser<'a>\` and \`fn rest(&self) -> &str\` returning \`self.input\`. Rule 3 covers the method.
3. Print \`first_word("submit tx now")\`, then \`rest()\` on a parser over \`"ledger 42"\`.

Expected output:

\`\`\`text
word: submit
rest: ledger 42
\`\`\`

### Hints

- \`s.find(' ')\` returns \`Option<usize>\` — the byte index of the first match.
- \`&s[..i]\` slices up to that index.
`,
    starterCode: `fn first_word(s: &str) -> &str {
    // everything before the first space
}

struct Parser<'a> {
    input: &'a str,
}

impl<'a> Parser<'a> {
    fn rest(&self) -> &str {
        // return the borrowed input
    }
}

fn main() {
    // print first_word(...) then rest()
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "first_word needs no annotation (elision rule 2)",
        kind: "fn_defined",
        fn: "first_word",
        params: [{ name: "s", ty: "&str" }],
        returns: "&str",
      },
      {
        name: "Parser borrows its input",
        kind: "struct_defined",
        struct: "Parser",
        fields: [{ name: "input", ty: "&'a str" }],
      },
      {
        name: "the impl block declares the lifetime",
        kind: "impl_defined",
        type: "Parser<'a>",
      },
      { name: "locates the first space", kind: "method_called", method: "find" },
    ],
    expectedOutput: "word: submit\nrest: ledger 42\n",
    referenceSolution: `fn first_word(s: &str) -> &str {
    match s.find(' ') {
        Some(i) => &s[..i],
        None => s,
    }
}

struct Parser<'a> {
    input: &'a str,
}

impl<'a> Parser<'a> {
    fn rest(&self) -> &str {
        self.input
    }
}

fn main() {
    println!("word: {}", first_word("submit tx now"));

    let p = Parser { input: "ledger 42" };
    println!("rest: {}", p.rest());
}
`,
  },

  "rust-lifetimes-3": {
    instructions: `## Two lifetimes, one of them irrelevant

When two inputs are unrelated, name them separately. What matters is which one appears on the **output**:

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

This tells the caller the result borrows from \`text\` and not from \`sep\` — so \`sep\` may be dropped immediately.

### Your task

Implement \`prefix\`: everything in \`text\` before the first occurrence of \`sep\`, or all of \`text\` if it does not occur.

In \`main\`:

1. \`let text = String::from("GA7Q:250:live");\`
2. In an **inner block**, create a separator \`String\` holding \`":"\`, call \`prefix\`, and let the block evaluate to the result.
3. Print the result *after* the block — where the separator no longer exists.

Expected output:

\`\`\`text
prefix: GA7Q
\`\`\`

If it compiles, you have proved the result does not borrow from the separator.
`,
    starterCode: `fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str {
    // everything before the first occurrence of \`sep\`
}

fn main() {
    let text = String::from("GA7Q:250:live");

    let cut = {
        let sep = String::from(":");
        // call prefix here
    };

    println!("prefix: {}", cut);
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the output borrows from text only",
        kind: "fn_defined",
        fn: "prefix",
        params: [
          { name: "text", ty: "&'a str" },
          { name: "sep", ty: "&'b str" },
        ],
        returns: "&'a str",
      },
      {
        name: "searches text for the separator",
        kind: "method_called",
        method: "find",
        receiver: "text",
      },
      {
        name: "the separator is created in an inner scope",
        kind: "let_binding",
        var: "sep",
        init: 'String::from(":")',
      },
    ],
    expectedOutput: "prefix: GA7Q\n",
    referenceSolution: `fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str {
    match text.find(sep) {
        Some(i) => &text[..i],
        None => text,
    }
}

fn main() {
    let text = String::from("GA7Q:250:live");

    let cut = {
        let sep = String::from(":");
        prefix(&text, &sep)
    };

    println!("prefix: {}", cut);
}
`,
  },

  "rust-lifetimes-4": {
    instructions: `## A zero-copy view

A struct holding references needs a lifetime parameter, which promises the struct may not outlive the buffer it points into:

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

This is the shape of every zero-copy parser: slices of someone else's buffer instead of a \`String\` per field.

### Your task

1. Define \`Frame<'a>\` as above.
2. In \`impl<'a> Frame<'a>\`, write \`fn parse(raw: &'a str) -> Frame<'a>\` that splits on the first \`'|'\`. Text before it is \`method\`, text after it is \`params\`. With no \`'|'\`, \`method\` is the whole input and \`params\` is \`""\`.
3. In \`main\`, parse a \`String\` holding \`getLedgerEntries|[42]\` and print both fields.

Expected output:

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

No \`String\` allocation anywhere inside \`parse\`.
`,
    starterCode: `struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}

impl<'a> Frame<'a> {
    fn parse(raw: &'a str) -> Frame<'a> {
        // split on the first '|'
    }
}

fn main() {
    let raw = String::from("getLedgerEntries|[42]");

    // parse and print both fields
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "Frame borrows both fields from one buffer",
        kind: "struct_defined",
        struct: "Frame",
        fields: [
          { name: "method", ty: "&'a str" },
          { name: "params", ty: "&'a str" },
        ],
      },
      {
        name: "parse ties the frame to the input buffer",
        kind: "fn_defined",
        fn: "parse",
        params: [{ name: "raw", ty: "&'a str" }],
        returns: "Frame<'a>",
      },
      {
        name: "splits on the first pipe",
        kind: "method_called",
        method: "find",
        receiver: "raw",
      },
      {
        name: "allocates no String while parsing",
        kind: "expr_present",
        expr: "String::from(raw)",
        forbidden: true,
      },
    ],
    expectedOutput: "method: getLedgerEntries\nparams: [42]\n",
    referenceSolution: `struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}

impl<'a> Frame<'a> {
    fn parse(raw: &'a str) -> Frame<'a> {
        match raw.find('|') {
            Some(i) => Frame {
                method: &raw[..i],
                params: &raw[i + 1..],
            },
            None => Frame {
                method: raw,
                params: "",
            },
        }
    }
}

fn main() {
    let raw = String::from("getLedgerEntries|[42]");
    let frame = Frame::parse(&raw);

    println!("method: {}", frame.method);
    println!("params: {}", frame.params);
}
`,
  },

  "rust-lifetimes-5": {
    instructions: `## 'static means two different things

**\`&'static T\`** — a reference valid for the whole program. String literals qualify; almost nothing computed at runtime does.

**\`T: 'static\`** — a bound meaning the type contains **no short-lived references**. An owned \`String\` satisfies it trivially, and is still dropped at the end of its scope. This is the bound \`thread::spawn\` and \`tokio::spawn\` require: a task may outlive its spawner, so it may not borrow the spawner's locals.

### Your task

1. Bind a \`&'static str\` **with the explicit type annotation**, holding \`baked into the binary\`, and print it.
2. Write \`fn spawn_like<T: Send + 'static>(value: T) -> T\` returning its argument unchanged.
3. Pass an owned \`String\` holding \`owned at runtime\` through it, and print the result — proving an owned \`String\` satisfies \`'static\`.

Expected output:

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\`
`,
    starterCode: `fn spawn_like<T: Send + 'static>(value: T) -> T {
    // hand it straight back
}

fn main() {
    // 1. an explicitly annotated &'static str

    // 2. an owned String through spawn_like
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the literal is annotated as &'static str",
        kind: "let_binding",
        var: "literal",
        ty: "&'static str",
      },
      {
        name: "spawn_like bounds its parameter with Send + 'static",
        kind: "fn_defined",
        fn: "spawn_like",
        params: [{ name: "value", ty: "T" }],
        returns: "T",
      },
      {
        name: "an owned String is passed through the 'static bound",
        kind: "expr_present",
        expr: "spawn_like(owned)",
      },
    ],
    expectedOutput: "literal: baked into the binary\nbound: owned at runtime\n",
    referenceSolution: `fn spawn_like<T: Send + 'static>(value: T) -> T {
    value
}

fn main() {
    let literal: &'static str = "baked into the binary";
    println!("literal: {}", literal);

    let owned = String::from("owned at runtime");
    let moved = spawn_like(owned);
    println!("bound: {}", moved);
}
`,
  },
};
