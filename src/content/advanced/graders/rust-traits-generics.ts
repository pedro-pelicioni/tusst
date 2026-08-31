import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Traits, Generics & Dispatch — hidden grading data.

export const rustTraitsGenericsGraders: Record<string, AdvancedLessonContent> = {
  "rust-traits-generics-1": {
    instructions: `## One required method, one default

A trait may provide default method bodies written in terms of its required methods. Implementors get them for free and may override them.

\`\`\`rust
trait Health {
    fn name(&self) -> String;
    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

### Your task

1. Define \`Health\` as above.
2. Define unit structs \`Db\` and \`Rpc\`.
3. \`Db\` implements only \`name\`, returning \`db\`.
4. \`Rpc\` implements \`name\` (returning \`rpc\`) **and** overrides \`status\` to return \`"<name>: degraded"\`.
5. Print both statuses.

Expected output:

\`\`\`text
db: ok
rpc: degraded
\`\`\`

### Hints

- A unit struct is written \`struct Db;\` and used as the value \`Db\`.
- \`format!\` builds a \`String\` the same way \`println!\` builds a line.
`,
    starterCode: `trait Health {
    fn name(&self) -> String;

    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}

struct Db;
struct Rpc;

// impl Health for Db  — name only
// impl Health for Rpc — name and an overridden status

fn main() {
    // print Db's status, then Rpc's
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "Db implements Health",
        kind: "impl_defined",
        type: "Db",
        trait: "Health",
      },
      {
        name: "Rpc implements Health",
        kind: "impl_defined",
        type: "Rpc",
        trait: "Health",
      },
      {
        name: "Rpc overrides the default status",
        kind: "macro_invoked",
        macro: "format",
        args: '"{}: degraded", self.name()',
      },
      { name: "prints both statuses", kind: "macro_invoked", macro: "println" },
    ],
    expectedOutput: "db: ok\nrpc: degraded\n",
    referenceSolution: `trait Health {
    fn name(&self) -> String;

    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}

struct Db;
struct Rpc;

impl Health for Db {
    fn name(&self) -> String {
        String::from("db")
    }
}

impl Health for Rpc {
    fn name(&self) -> String {
        String::from("rpc")
    }

    fn status(&self) -> String {
        format!("{}: degraded", self.name())
    }
}

fn main() {
    println!("{}", Db.status());
    println!("{}", Rpc.status());
}
`,
  },

  "rust-traits-generics-2": {
    instructions: `## Bound exactly what you use

A bound is a two-way contract: the caller must supply a type that satisfies it, and in exchange the body may rely on it.

Bound the **minimum** the body needs. An unnecessary \`T: Clone\` on a function that never clones does not add safety — it rejects callers who had a perfectly good non-\`Clone\` type.

### Your task

Write \`fn describe_all<T>(items: &[T]) -> String\` with a \`where T: Display\` clause, joining every element with \`", "\`.

Call it with \`&[1, 2, 3]\` and with \`&["a", "b"]\`.

Expected output:

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

### Hints

- \`use std::fmt::Display;\`
- Build the result with \`push_str\`, not \`join\` — the point is to see the bound being used.
- \`.iter().enumerate()\` gives you the index, so you can skip the separator on the first element.
`,
    starterCode: `use std::fmt::Display;

fn describe_all<T>(items: &[T]) -> String
where
    T: Display,
{
    // join the elements with ", "
}

fn main() {
    // call it with numbers, then with strings
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "describe_all is generic over a slice",
        kind: "fn_defined",
        fn: "describe_all",
        params: [{ name: "items", ty: "&[T]" }],
        returns: "String",
      },
      {
        name: "builds the result incrementally",
        kind: "method_called",
        method: "push_str",
      },
      { name: "walks the slice", kind: "method_called", method: "iter" },
      {
        name: "called with a slice of integers",
        kind: "expr_present",
        expr: "describe_all(&[1, 2, 3])",
      },
    ],
    expectedOutput: "nums: 1, 2, 3\nstrs: a, b\n",
    referenceSolution: `use std::fmt::Display;

fn describe_all<T>(items: &[T]) -> String
where
    T: Display,
{
    let mut out = String::new();
    for (i, item) in items.iter().enumerate() {
        if i > 0 {
            out.push_str(", ");
        }
        out.push_str(&item.to_string());
    }
    out
}

fn main() {
    println!("nums: {}", describe_all(&[1, 2, 3]));
    println!("strs: {}", describe_all(&["a", "b"]));
}
`,
  },

  "rust-traits-generics-3": {
    instructions: `## One answer per type

An **associated type** is chosen once, in the single impl for a given type. A **generic parameter** allows many impls per type.

The test: *is there exactly one sensible answer per implementing type?* \`Iterator::Item\` is associated because a counter yields one kind of thing. \`From<T>\` is generic because a type should convert from many.

### Your task

1. \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`
2. \`struct Counter { n: u32 }\` implementing \`Source\` with \`type Item = u32;\` and \`fn next_item(&mut self) -> Option<u32>\` — the resolved type, not \`Option<Self::Item>\` — yielding \`1\`, \`2\`, \`3\`, then \`None\`.
3. \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` collecting everything the source yields.
4. Print the drained vector with \`{:?}\`.

Expected output:

\`\`\`text
items: [1, 2, 3]
\`\`\`

### Hints

- \`while let Some(item) = s.next_item()\` drains it cleanly.
- Note \`Vec<S::Item>\` — the associated type projected off the concrete \`S\`.
`,
    starterCode: `trait Source {
    type Item;
    fn next_item(&mut self) -> Option<Self::Item>;
}

struct Counter {
    n: u32,
}

// impl Source for Counter, with type Item = u32

fn drain<S: Source>(mut s: S) -> Vec<S::Item> {
    // collect everything the source yields
}

fn main() {
    // drain a Counter starting at 0 and print it
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "Counter implements Source",
        kind: "impl_defined",
        type: "Counter",
        trait: "Source",
      },
      {
        name: "the associated type resolves to u32",
        kind: "fn_defined",
        fn: "next_item",
        returns: "Option<u32>",
      },
      {
        name: "drain returns a Vec of the associated type",
        kind: "fn_defined",
        fn: "drain",
        returns: "Vec<S::Item>",
      },
      {
        name: "drains the source until it is empty",
        kind: "method_called",
        method: "next_item",
      },
    ],
    expectedOutput: "items: [1, 2, 3]\n",
    referenceSolution: `trait Source {
    type Item;
    fn next_item(&mut self) -> Option<Self::Item>;
}

struct Counter {
    n: u32,
}

impl Source for Counter {
    type Item = u32;

    fn next_item(&mut self) -> Option<u32> {
        if self.n < 3 {
            self.n += 1;
            Some(self.n)
        } else {
            None
        }
    }
}

fn drain<S: Source>(mut s: S) -> Vec<S::Item> {
    let mut out = Vec::new();
    while let Some(item) = s.next_item() {
        out.push(item);
    }
    out
}

fn main() {
    let items = drain(Counter { n: 0 });
    println!("items: {:?}", items);
}
`,
  },

  "rust-traits-generics-4": {
    instructions: `## Three call sites, three functions

The compiler **monomorphizes** a generic: it stamps out one specialised copy per concrete type it is called with. Each copy knows its type, so every call inside is direct and inlinable — that is what "zero-cost" means here.

The costs move to binary size and compile time.

### Your task

Write \`fn emit<T: Debug>(label: &str, value: T)\` printing \`"<label>: <value:?>"\`.

Call it with \`42u32\`, with \`"rpc"\`, and with \`vec![true, false]\` — three instantiations.

Expected output:

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

Note the quotes around \`rpc\`: that is \`Debug\` formatting, not \`Display\`, and the difference is the point.

### Hints

- \`use std::fmt::Debug;\`
- The formatter is \`{:?}\`.
`,
    starterCode: `use std::fmt::Debug;

fn emit<T: Debug>(label: &str, value: T) {
    // print "<label>: <value:?>"
}

fn main() {
    // three calls, three concrete types
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "emit is bounded on Debug",
        kind: "fn_defined",
        fn: "emit",
        params: [
          { name: "label", ty: "&str" },
          { name: "value", ty: "T" },
        ],
      },
      {
        name: "formats the value with the Debug formatter",
        kind: "macro_invoked",
        macro: "println",
        args: '"{}: {:?}", label, value',
      },
      {
        name: "instantiated with u32",
        kind: "expr_present",
        expr: 'emit("count", 42u32)',
      },
      {
        name: "instantiated with a Vec",
        kind: "expr_present",
        expr: 'emit("flags", vec![true, false])',
      },
    ],
    expectedOutput: 'count: 42\nname: "rpc"\nflags: [true, false]\n',
    referenceSolution: `use std::fmt::Debug;

fn emit<T: Debug>(label: &str, value: T) {
    println!("{}: {:?}", label, value);
}

fn main() {
    emit("count", 42u32);
    emit("name", "rpc");
    emit("flags", vec![true, false]);
}
`,
  },

  "rust-traits-generics-5": {
    instructions: `## A heterogeneous registry

A \`Vec<T>\` holds one type. When you need several, you need a trait object:

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` has no compile-time size, so it always lives behind a pointer — and that pointer is **fat**: one word to the data, one to the vtable.

### Your task

1. \`trait Check { fn run(&self) -> String; }\`
2. Unit structs \`Ping\` and \`Disk\` implementing it, returning \`ping ok\` and \`disk ok\`.
3. Build a \`Vec<Box<dyn Check>>\` holding one of each, iterate printing each result, then print the count.

Expected output:

\`\`\`text
ping ok
disk ok
count: 2
\`\`\`

### Hints

- Iterate with \`for c in &checks\` so the vector is not consumed before \`.len()\`.
`,
    starterCode: `trait Check {
    fn run(&self) -> String;
}

struct Ping;
struct Disk;

// impl Check for both

fn main() {
    // Vec<Box<dyn Check>>, iterate, then print the count
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "Ping implements Check",
        kind: "impl_defined",
        type: "Ping",
        trait: "Check",
      },
      {
        name: "Disk implements Check",
        kind: "impl_defined",
        type: "Disk",
        trait: "Check",
      },
      {
        name: "stores both behind a trait object",
        kind: "let_binding",
        var: "checks",
        ty: "Vec<Box<dyn Check>>",
      },
      {
        name: "iterates by reference so the Vec survives",
        kind: "for_loop",
        iter: "&checks",
      },
    ],
    expectedOutput: "ping ok\ndisk ok\ncount: 2\n",
    referenceSolution: `trait Check {
    fn run(&self) -> String;
}

struct Ping;
struct Disk;

impl Check for Ping {
    fn run(&self) -> String {
        String::from("ping ok")
    }
}

impl Check for Disk {
    fn run(&self) -> String {
        String::from("disk ok")
    }
}

fn main() {
    let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];

    for c in &checks {
        println!("{}", c.run());
    }

    println!("count: {}", checks.len());
}
`,
  },

  "rust-traits-generics-6": {
    instructions: `## Keep the trait usable as an object

A trait is **object safe** only if every method can be dispatched through a vtable. Two rules cause nearly every real failure:

1. **No generic methods** — a vtable is a fixed table, and a generic would need unboundedly many slots.
2. **No \`Self\` in return position** — the caller cannot know that type's size.

The fix for both is to move the hole from compile time to runtime: take \`&dyn Trait\` instead of a generic.

### Your task

1. \`trait Encode { fn encode(&self) -> String; }\`
2. \`struct Num(i64)\` implementing it as the number's decimal text.
3. \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — the \`&dyn\` is what keeps it object safe.
4. Unit struct \`Log\` implementing \`Sink\`, returning \`"log:<encoded>"\`.
5. Store it as \`Box<dyn Sink>\` and accept a \`Num(42)\`.

Expected output:

\`\`\`text
log:42
\`\`\`

If \`accept\` had been generic, step 5 would not compile.
`,
    starterCode: `trait Encode {
    fn encode(&self) -> String;
}

struct Num(i64);

// impl Encode for Num

trait Sink {
    fn accept(&self, value: &dyn Encode) -> String;
}

struct Log;

// impl Sink for Log

fn main() {
    // store Log as Box<dyn Sink> and accept a Num(42)
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "Num implements Encode",
        kind: "impl_defined",
        type: "Num",
        trait: "Encode",
      },
      {
        name: "Log implements Sink",
        kind: "impl_defined",
        type: "Log",
        trait: "Sink",
      },
      {
        name: "the sink is held as a trait object",
        kind: "let_binding",
        var: "sink",
        ty: "Box<dyn Sink>",
      },
      {
        name: "accepts an encodable value through the object-safe method",
        kind: "expr_present",
        expr: "sink.accept(&Num(42))",
      },
    ],
    expectedOutput: "log:42\n",
    referenceSolution: `trait Encode {
    fn encode(&self) -> String;
}

struct Num(i64);

impl Encode for Num {
    fn encode(&self) -> String {
        self.0.to_string()
    }
}

trait Sink {
    fn accept(&self, value: &dyn Encode) -> String;
}

struct Log;

impl Sink for Log {
    fn accept(&self, value: &dyn Encode) -> String {
        format!("log:{}", value.encode())
    }
}

fn main() {
    let sink: Box<dyn Sink> = Box::new(Log);
    println!("{}", sink.accept(&Num(42)));
}
`,
  },

  "rust-traits-generics-7": {
    instructions: `## One impl, every Display type

A **blanket impl** covers every type satisfying a bound at once:

\`\`\`rust
impl<T: Display> Loggable for T { ... }
\`\`\`

The standard library leans on this: \`ToString\` is a blanket impl over \`Display\`, and \`Into<U>\` over \`From<T>\` — which is why you implement \`From\` and get \`Into\` free.

The **orphan rule** is the limit: you may implement a trait for a type only if you own the trait or you own the type. The workaround is a newtype, which costs nothing at runtime.

### Your task

1. \`trait Loggable { fn log_line(&self) -> String; }\`
2. A blanket \`impl<T: Display> Loggable for T\` returning \`"[log] <value>"\`.
3. Call \`.log_line()\` on \`42\` and on \`"rpc down"\` — two types, zero extra impls.

Expected output:

\`\`\`text
[log] 42
[log] rpc down
\`\`\`
`,
    starterCode: `use std::fmt::Display;

trait Loggable {
    fn log_line(&self) -> String;
}

// one blanket impl covering every Display type

fn main() {
    // call log_line on an integer and on a string
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "one blanket impl over every Display type",
        kind: "impl_defined",
        type: "T",
        trait: "Loggable",
      },
      {
        name: "formats with the [log] prefix",
        kind: "macro_invoked",
        macro: "format",
        args: '"[log] {}", self',
      },
      {
        name: "used on an integer",
        kind: "method_called",
        method: "log_line",
        receiver: "42",
      },
      {
        name: "used on a string slice",
        kind: "method_called",
        method: "log_line",
        receiver: '"rpc down"',
      },
    ],
    expectedOutput: "[log] 42\n[log] rpc down\n",
    referenceSolution: `use std::fmt::Display;

trait Loggable {
    fn log_line(&self) -> String;
}

impl<T: Display> Loggable for T {
    fn log_line(&self) -> String {
        format!("[log] {}", self)
    }
}

fn main() {
    println!("{}", 42.log_line());
    println!("{}", "rpc down".log_line());
}
`,
  },
};
