import type { LessonStep } from "@/content/steps";

// Advanced · Traits, Generics & Dispatch.

export const rustTraitsGenericsSteps: Record<string, LessonStep[]> = {
  "rust-traits-generics-1": [
    {
      kind: "theory",
      body: `A trait is a set of methods a type promises to provide. It is not a base class: there is no inheritance, no shared fields, and no constructor.

\`\`\`rust
trait Health {
    fn name(&self) -> String;

    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

\`name\` is required. \`status\` has a **default implementation**, written in terms of the required methods — an implementor gets it for free and may override it.`,
    },
    {
      kind: "theory",
      body: `The pattern of *one or two required methods plus a pile of defaults* is how the standard library stays usable. \`Iterator\` requires exactly one method, \`next\`, and gives you seventy-odd adapters on top of it.

Design your own traits the same way. Make the required surface as small as the abstraction allows, then build the convenience on top as defaults:

\`\`\`rust
impl Health for Db {
    fn name(&self) -> String { String::from("db") }
    // status() comes for free
}

impl Health for Rpc {
    fn name(&self) -> String { String::from("rpc") }
    fn status(&self) -> String { format!("{}: degraded", self.name()) }
}
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "A trait has one required method and one default method. What must an implementor write?",
      options: [
        "Only the required method — the default is inherited, and overriding it is optional",
        "Both, because a trait impl must be exhaustive",
        "Only the default method; required methods are provided by the compiler",
      ],
      answer: 0,
      explain:
        "This is exactly why defaults exist: they let a trait grow useful surface without breaking every existing implementor each time it does.",
    },
    {
      kind: "fill",
      prompt:
        "Give the trait a default method built from the required one.",
      file: "main.rs",
      before: "trait Health {\n    fn name(&self) -> String;\n\n    fn status(&self) -> String {\n        format!(\"{}: ok\", ",
      after: ")\n    }\n}",
      choices: ["self.name()", "Self::name", "name()"],
      answer: 0,
      explain:
        "A default body may call any other method on the trait through `self` — that is what makes it composable. `Self::name` without a receiver would not know which instance to ask.",
    },
    {
      kind: "quiz",
      question: "Why does Rust have no field access through a trait?",
      options: [
        "Traits describe behaviour, not layout — implementors may store their data in completely different shapes",
        "It does; `trait T { field: u32 }` is valid syntax",
        "Fields are accessible but only from default method bodies",
      ],
      answer: 0,
      explain:
        "This is the deliberate break from inheritance. If you need field-like access, add a getter to the trait — then a type computing that value on the fly can implement it too.",
    },
    {
      kind: "editor",
      intro: `### One required method, one default

1. Define \`trait Health\` with required \`fn name(&self) -> String\` and a default \`fn status(&self) -> String\` returning \`"<name>: ok"\`.
2. Define unit structs \`Db\` and \`Rpc\`.
3. \`Db\` implements only \`name\` (returning \`db\`). \`Rpc\` implements \`name\` (returning \`rpc\`) **and** overrides \`status\` to return \`"<name>: degraded"\`.
4. Print the status of each.

Expected output:

\`\`\`text
db: ok
rpc: degraded
\`\`\``,
    },
  ],

  "rust-traits-generics-2": [
    {
      kind: "theory",
      body: `A generic parameter with no bound is nearly useless: the body may only do what works for *every* type, which is almost nothing.

A **bound** buys back capability by narrowing the input:

\`\`\`rust
fn describe_all<T: Display>(items: &[T]) -> String
\`\`\`

Now the body may call \`.to_string()\`, because \`Display\` guarantees it exists. The bound is a two-way contract: the caller must supply a \`Display\` type, and in exchange the body may rely on it.`,
    },
    {
      kind: "theory",
      body: `\`where\` moves the bounds below the signature. It is not only cosmetic — some bounds cannot be written inline at all:

\`\`\`rust
fn process<T>(items: &[T]) -> String
where
    T: Display + Clone,
    for<'a> &'a T: IntoIterator,
{ ... }
\`\`\`

The discipline worth keeping: **bound exactly what the body uses, and nothing more.** An unnecessary \`T: Clone\` on a function that never clones does not make the function safer — it rejects callers who had a perfectly good non-\`Clone\` type. Over-bounding is the generic version of over-annotating a lifetime.`,
    },
    {
      kind: "quiz",
      question:
        "A helper takes `items: &[T]` and only ever formats each element. Which bound is right?",
      options: [
        "`T: Display` — the minimum the body actually needs",
        "`T: Display + Clone + Debug`, to keep the function flexible for the future",
        "No bound, and call `.to_string()` — it exists on every type",
      ],
      answer: 0,
      explain:
        "Adding bounds does not add flexibility; it removes it, from the caller's side. And `.to_string()` comes *from* `Display` via a blanket impl — without the bound there is no such method.",
    },
    {
      kind: "fill",
      prompt:
        "Bound the parameter so the body may format each element, using a `where` clause.",
      file: "main.rs",
      before: "fn describe_all<T>(items: &[T]) -> String\nwhere\n    T: ",
      after: ",\n{",
      choices: ["Display", "ToString + Clone", "Sized"],
      answer: 0,
      explain:
        "`ToString` would work but is the wrong direction: the standard library implements `ToString` for every `T: Display`, so bounding on `Display` accepts strictly more types.",
    },
    {
      kind: "quiz",
      question: "What does `impl Trait` in argument position mean?",
      options: [
        "It is shorthand for an anonymous generic parameter — `fn f(x: impl Display)` is `fn f<T: Display>(x: T)`",
        "It creates a trait object, boxing the argument at runtime",
        "It means the argument must be exactly that trait's only implementor",
      ],
      answer: 0,
      explain:
        "The one real difference: with `impl Trait` there is no name for the type, so a caller cannot turbofish it. Everything else — monomorphization, static dispatch — is identical.",
    },
    {
      kind: "editor",
      intro: `### Bound exactly what you use

Write \`fn describe_all<T>(items: &[T]) -> String\` with a \`where T: Display\` clause, joining every element with \`", "\`.

Call it twice in \`main\`: once with \`&[1, 2, 3]\`, once with \`&["a", "b"]\`.

Expected output:

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

Import \`std::fmt::Display\`. Build the string with \`push_str\`, not \`join\` — the point is to see the bound being used.`,
    },
  ],

  "rust-traits-generics-3": [
    {
      kind: "theory",
      body: `Both of these let a trait be generic over a type. They mean different things:

\`\`\`rust
trait Source      { type Item;    fn next_item(&mut self) -> Option<Self::Item>; }
trait Source<T>   {               fn next_item(&mut self) -> Option<T>; }
\`\`\`

With an **associated type**, a type implements \`Source\` **once**, and picks \`Item\` as part of that single implementation.

With a **generic parameter**, a type may implement \`Source<u32>\`, \`Source<String>\`, \`Source<Frame>\` — as many times as it likes.`,
    },
    {
      kind: "theory",
      body: `That difference decides which one you want, and there is a clean test: **is there exactly one sensible answer per implementing type?**

\`Iterator\` uses an associated type because a \`Counter\` yields one kind of thing. If \`Item\` were a generic parameter, \`counter.next()\` would be ambiguous at every call site and you would be writing turbofish forever.

\`From\` uses a generic parameter for the opposite reason: a type genuinely should convert *from* many others, and \`impl From<u8> for Wide\` alongside \`impl From<u16> for Wide\` is exactly right.

Associated types also read better downstream: \`fn drain<S: Source>(s: S) -> Vec<S::Item>\` names the output without a second parameter.`,
    },
    {
      kind: "quiz",
      question:
        "Why does `Iterator` use `type Item` rather than `trait Iterator<T>`?",
      options: [
        "A given iterator yields exactly one kind of element, so a second impl would only create ambiguity at every call site",
        "Associated types compile faster than generic parameters",
        "Generic parameters are not allowed on traits in the standard library",
      ],
      answer: 0,
      explain:
        "Try the counterfactual: with `Iterator<T>`, `v.iter().next()` could not infer `T` and every call would need annotation. The associated type makes the answer unique.",
    },
    {
      kind: "fill",
      prompt:
        "Name the output type in a downstream signature without adding a second parameter.",
      file: "main.rs",
      before: "fn drain<S: Source>(mut s: S) -> Vec<",
      after: "> {",
      choices: ["S::Item", "S", "Source::Item"],
      answer: 0,
      explain:
        "`S::Item` is the associated type projected off the concrete `S`. `Source::Item` has no `Self` to project from, so the compiler cannot resolve it.",
    },
    {
      kind: "quiz",
      question:
        "You are designing a `Converter` trait and a type should convert from `u8`, `u16` and `u32`. Which shape fits?",
      options: [
        "A generic parameter — the type needs three separate impls, one per source",
        "An associated type, with an enum covering all three",
        "Either; the two are interchangeable in every case",
      ],
      answer: 0,
      explain:
        "Multiple impls per type is precisely what a generic parameter allows and an associated type forbids. This is the same reason `From<T>` is generic.",
    },
    {
      kind: "editor",
      intro: `### One answer per type

1. Define \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`.
2. Define \`struct Counter { n: u32 }\` and implement \`Source\` with \`type Item = u32\`, yielding \`1\`, \`2\`, \`3\` then \`None\`.
3. Write \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` collecting everything the source yields.
4. Print the drained vector with \`{:?}\`.

Expected output:

\`\`\`text
items: [1, 2, 3]
\`\`\``,
    },
  ],

  "rust-traits-generics-4": [
    {
      kind: "theory",
      body: `A generic function is not one function. The compiler **monomorphizes** it: for every concrete type it is called with, it stamps out a separate specialised copy.

\`\`\`rust
fn emit<T: Debug>(label: &str, value: T) { ... }

emit("count", 42u32);        // emits emit::<u32>
emit("name", "rpc");         // emits emit::<&str>
emit("flags", vec![true]);   // emits emit::<Vec<bool>>
\`\`\`

Three call sites, three real functions in the binary. Each one knows its concrete type, so every method call inside is a **direct call** — no indirection, fully inlinable.`,
    },
    {
      kind: "theory",
      body: `That is what "zero-cost abstraction" means here: the generic version compiles to the same instructions you would have written by hand.

The costs are real but move elsewhere:

- **Binary size.** Every instantiation is duplicated code. A heavily generic library called with twenty types produces twenty copies.
- **Compile time.** This is the largest single reason Rust builds are slow.

The trade is almost always worth taking in a hot path, and often not worth taking for a plugin registry or a heterogeneous collection — which is what trait objects are for.`,
    },
    {
      kind: "quiz",
      question:
        "A generic function is called with three different concrete types. How many copies are in the binary?",
      options: [
        "Three — one specialised instantiation per concrete type used",
        "One, with the type passed as a hidden runtime argument",
        "One, plus a vtable per type",
      ],
      answer: 0,
      explain:
        "Instantiations are generated on demand: a generic never called is never codegened at all, which is why an unused generic helper costs nothing.",
    },
    {
      kind: "fill",
      prompt: "Bound the value so it can be printed with the `{:?}` formatter.",
      file: "main.rs",
      before: "fn emit<T: ",
      after: ">(label: &str, value: T) {",
      choices: ["Debug", "Display", "Sized"],
      answer: 0,
      explain:
        "`{:?}` is `Debug`; `{}` is `Display`. They are separate traits on purpose — `Debug` is for developers and may be derived, `Display` is for users and never is.",
    },
    {
      kind: "quiz",
      question:
        "When is dynamic dispatch the better choice despite the indirect call?",
      options: [
        "When you need a heterogeneous collection, or want to stop code size growing with the number of implementors",
        "Whenever the function is called more than once",
        "Whenever the trait has more than one method",
      ],
      answer: 0,
      explain:
        "`Vec<Box<dyn Check>>` has no generic equivalent — a `Vec<T>` holds one type. That is the case where trait objects are not a compromise but the only option.",
    },
    {
      kind: "editor",
      intro: `### Three call sites, three functions

Write \`fn emit<T: Debug>(label: &str, value: T)\` printing \`"<label>: <value:?>"\`.

Call it three times: with \`42u32\`, with \`"rpc"\`, and with \`vec![true, false]\`.

Expected output:

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

Note the quotes around \`rpc\` — that is \`Debug\`, not \`Display\`, and the difference is the point.`,
    },
  ],

  "rust-traits-generics-5": [
    {
      kind: "theory",
      body: `A generic gives you one type per instantiation. When you need **several different types in one collection**, you need a trait object:

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` is not a type with a known size, so it always appears behind a pointer — \`Box<dyn Check>\`, \`&dyn Check\`, \`Arc<dyn Check>\`. That pointer is **fat**: two words, one to the data and one to the vtable.`,
    },
    {
      kind: "theory",
      body: `The vtable is a small static table, one per (type, trait) pair, holding a function pointer for each method plus the size and the drop glue.

Calling \`c.run()\` on a \`&dyn Check\` therefore means: load the vtable pointer, load the slot for \`run\`, call through it. The cost is one extra indirection and — the part that actually matters in a hot loop — **the call cannot be inlined**, because the target is unknown until runtime.

For a health-check registry invoked once a second, that cost is unmeasurable and the flexibility is worth everything. For a comparator called a million times inside a sort, it is the difference you were looking for.`,
    },
    {
      kind: "quiz",
      question: "Why is `&dyn Check` two words wide when `&Ping` is one?",
      options: [
        "It carries a pointer to the data *and* a pointer to the vtable for that concrete type",
        "It stores the data inline, so the size varies by implementor",
        "It carries a reference count alongside the data pointer",
      ],
      answer: 0,
      explain:
        "This is why you cannot cast a `&dyn Trait` back to a `&T` for free, and why `Box<dyn Trait>` knows how to drop the right destructor: both facts live in the vtable.",
    },
    {
      kind: "fill",
      prompt: "Hold two different concrete types in one collection.",
      file: "main.rs",
      before: "let checks: Vec<",
      after: "> = vec![Box::new(Ping), Box::new(Disk)];",
      choices: ["Box<dyn Check>", "dyn Check", "Check"],
      answer: 0,
      explain:
        "`Vec<dyn Check>` cannot compile: `Vec` needs a `Sized` element, and `dyn Check` has no size known at compile time. The `Box` is what gives it one.",
    },
    {
      kind: "quiz",
      question:
        "The real cost of dynamic dispatch in a tight loop is usually not the extra pointer load. What is it?",
      options: [
        "The call cannot be inlined, which also blocks the optimisations inlining would have enabled",
        "Each call allocates a fresh vtable on the heap",
        "The vtable lookup requires a lock, so concurrent calls contend",
      ],
      answer: 0,
      explain:
        "Vtables are static data, allocated once at compile time — never per call. The optimisation barrier is the honest cost, and it is easy to underestimate.",
    },
    {
      kind: "editor",
      intro: `### A heterogeneous registry

1. Define \`trait Check { fn run(&self) -> String; }\`.
2. Define unit structs \`Ping\` and \`Disk\` implementing it, returning \`ping ok\` and \`disk ok\`.
3. Build a \`Vec<Box<dyn Check>>\` holding one of each, iterate it printing each result, then print the count.

Expected output:

\`\`\`text
ping ok
disk ok
count: 2
\`\`\``,
    },
  ],

  "rust-traits-generics-6": [
    {
      kind: "theory",
      body: `Not every trait can become a \`dyn Trait\`. A trait is **object safe** only if every method can be called through a vtable — that is, knowing nothing about the concrete type but its address.

Two rules cause almost every real failure:

1. **No generic methods.** \`fn build<T: Encode>(&self, v: T)\` would need one vtable slot per possible \`T\`, and the set is unbounded.
2. **No \`Self\` in return position.** \`fn clone_me(&self) -> Self\` cannot work: the caller has no idea what \`Self\` is or how big it is.`,
    },
    {
      kind: "theory",
      body: `Both have the same fix: replace the compile-time hole with a runtime one.

\`\`\`rust
trait Sink { fn accept<T: Encode>(&self, v: T) -> String; }   // not object safe
trait Sink { fn accept(&self, v: &dyn Encode) -> String; }    // object safe
\`\`\`

You have traded one indirection for the ability to store \`Box<dyn Sink>\` at all — usually the right trade, since a trait you want as an object is a trait you wanted for its flexibility.

When you need both, the standard pattern is two traits: a generic one for the fast path, and an object-safe one implemented blanket-style over it.`,
    },
    {
      kind: "quiz",
      question:
        "Why does a generic method make a trait non-object-safe?",
      options: [
        "A vtable is a fixed table built at compile time, and a generic method would need an unbounded number of slots",
        "Generic methods cannot take `&self`",
        "The compiler could support it but disallows it to keep vtables small",
      ],
      answer: 0,
      explain:
        "The vtable is built per (type, trait) pair when the trait object is created. It cannot know which instantiations a future caller will need.",
    },
    {
      kind: "fill",
      prompt:
        "Make the method object-safe: take the value as a trait object instead of a generic.",
      file: "main.rs",
      before: "trait Sink {\n    fn accept(&self, value: ",
      after: ") -> String;\n}",
      choices: ["&dyn Encode", "impl Encode", "T"],
      answer: 0,
      explain:
        "`impl Encode` in argument position is sugar for a generic parameter, so it fails object safety for exactly the same reason the explicit generic did.",
    },
    {
      kind: "quiz",
      question:
        "`Clone` is not object safe. Which of its requirements is responsible?",
      options: [
        "`fn clone(&self) -> Self` returns `Self` by value, and the caller cannot know that type's size",
        "`Clone` has a supertrait, and supertraits break object safety",
        "`clone` takes `&self`, and object-safe methods must take `self`",
      ],
      answer: 0,
      explain:
        "This is why `Box<dyn Trait>` cannot simply be cloned, and why crates working around it define a `fn clone_box(&self) -> Box<dyn Trait>` — a return type with a known size.",
    },
    {
      kind: "editor",
      intro: `### Keep the trait usable as an object

1. Define \`trait Encode { fn encode(&self) -> String; }\`.
2. Define \`struct Num(i64)\` implementing it as the number's decimal text.
3. Define \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — note the \`&dyn\`, which is what keeps it object safe.
4. Define unit struct \`Log\` implementing \`Sink\`, returning \`"log:<encoded>"\`.
5. In \`main\`, store it as \`Box<dyn Sink>\` and accept a \`Num(42)\`.

Expected output:

\`\`\`text
log:42
\`\`\`

If \`accept\` had been generic, step 5 would not compile.`,
    },
  ],

  "rust-traits-generics-7": [
    {
      kind: "theory",
      body: `A **blanket impl** implements a trait for every type satisfying a bound, in one block:

\`\`\`rust
impl<T: Display> Loggable for T {
    fn log_line(&self) -> String {
        format!("[log] {}", self)
    }
}
\`\`\`

Now \`42.log_line()\` and \`"rpc down".log_line()\` both work, and so does every type anyone will ever write that implements \`Display\`.

The standard library uses this heavily. \`ToString\` is a blanket impl over \`Display\`; \`Into<U>\` is a blanket impl over \`From<T>\`. That is why implementing \`From\` gives you \`Into\` for free and you should never implement \`Into\` by hand.`,
    },
    {
      kind: "theory",
      body: `The **orphan rule** is the limit: you may implement a trait for a type only if you own the trait, or you own the type. Both foreign is forbidden.

\`\`\`rust
impl Display for Vec<u8> { ... }   // forbidden: both are std's
\`\`\`

The reason is coherence. If two crates could each add that impl, adding a dependency could change which one applies — or make the program ambiguous and stop it compiling for reasons in neither crate.

The workaround is the newtype: \`struct Bytes(Vec<u8>);\` is *your* type, so you may implement anything for it. It costs nothing at runtime — a single-field tuple struct has identical layout to its field.`,
    },
    {
      kind: "quiz",
      question:
        "Why can't you `impl Display for Vec<u8>` in your own crate?",
      options: [
        "The orphan rule: both the trait and the type are foreign, so two crates could add conflicting impls",
        "`Vec<u8>` already implements `Display` in the standard library",
        "Blanket impls in `std` claim every type in advance",
      ],
      answer: 0,
      explain:
        "Coherence is a global property. Without the rule, whether your program compiles could depend on a transitive dependency you never named.",
    },
    {
      kind: "fill",
      prompt:
        "Implement your trait for every type that can already be displayed.",
      file: "main.rs",
      before: "impl<T: Display> Loggable for ",
      after: " {",
      choices: ["T", "dyn Display", "Self"],
      answer: 0,
      explain:
        "`for T` with the bound on the impl generics is the blanket form. `for dyn Display` would cover only the trait object, not the concrete types.",
    },
    {
      kind: "quiz",
      question:
        "You need `serde::Serialize` on a type from another crate. What is the standard move?",
      options: [
        "Wrap it in a newtype you own and implement the trait for that",
        "Fork the other crate and add the impl there",
        "Implement it anyway — the orphan rule only applies to `std`",
      ],
      answer: 0,
      explain:
        "The newtype is free at runtime and local in scope. (Serde also offers `#[serde(remote)]` for exactly this case, which generates the newtype-shaped code for you.)",
    },
    {
      kind: "editor",
      intro: `### One impl, every Display type

1. Define \`trait Loggable { fn log_line(&self) -> String; }\`.
2. Write a blanket \`impl<T: Display> Loggable for T\` returning \`"[log] <value>"\`.
3. Call \`.log_line()\` on the integer \`42\` and on the string \`"rpc down"\` — two types, zero extra impls.

Expected output:

\`\`\`text
[log] 42
[log] rpc down
\`\`\``,
    },
  ],
};
