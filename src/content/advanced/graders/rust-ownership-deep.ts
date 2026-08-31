import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Ownership, Moves & Drops — hidden grading data.
// Every `referenceSolution` below is compiled and run by check:advanced.

export const rustOwnershipDeepGraders: Record<string, AdvancedLessonContent> = {
  "rust-ownership-deep-1": {
    instructions: `## Where a value actually lives

\`std::mem::size_of::<T>()\` is a **compile-time** constant: it reports how many bytes \`T\` occupies in a stack frame. It knows nothing about the heap, because the heap size is a runtime value.

- \`size_of::<i32>()\` → \`4\`. The whole value is those 4 bytes.
- \`size_of::<String>()\` → \`24\` on a 64-bit target. That is the *handle*: pointer, length, capacity. The characters are somewhere else.
- \`name.len()\` → the bytes actually held on the heap.

### Your task

Print all three, in that order.

Expected output:

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

### Hints

- \`use std::mem::size_of;\` lets you write \`size_of::<i32>()\` directly.
- The string is \`"stellar"\` — seven ASCII bytes.
`,
    starterCode: `use std::mem::size_of;

fn main() {
    let name = String::from("stellar");

    // Print the stack size of i32, the stack size of String,
    // and the heap bytes held by \`name\`.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "measures the stack size of i32",
        kind: "any_of",
        of: [
          { kind: "expr_present", expr: "size_of::<i32>()" },
          { kind: "expr_present", expr: "std::mem::size_of::<i32>()" },
        ],
      },
      {
        name: "measures the stack size of String",
        kind: "any_of",
        of: [
          { kind: "expr_present", expr: "size_of::<String>()" },
          { kind: "expr_present", expr: "std::mem::size_of::<String>()" },
        ],
      },
      {
        name: "reads the heap length with len()",
        kind: "method_called",
        method: "len",
        receiver: "name",
      },
      {
        name: "prints the results",
        kind: "macro_invoked",
        macro: "println",
      },
    ],
    expectedOutput: "i32 stack size: 4\nString stack size: 24\nheap bytes: 7\n",
    referenceSolution: `use std::mem::size_of;

fn main() {
    let name = String::from("stellar");
    println!("i32 stack size: {}", size_of::<i32>());
    println!("String stack size: {}", size_of::<String>());
    println!("heap bytes: {}", name.len());
}
`,
  },

  "rust-ownership-deep-2": {
    instructions: `## Move, copy, clone

Assignment does exactly one of two things:

- The type is \`Copy\` (every field is \`Copy\`, and it has no \`Drop\` impl) → the bits are duplicated, both bindings stay usable.
- Otherwise → ownership **moves**, and the source binding is dead.

\`.clone()\` is the explicit way to ask for the deep copy that \`=\` refused to make silently.

### Your task

Demonstrate all three behaviours:

1. Bind \`10\` to \`a\`, then \`a\` to \`b\`. Print both — \`i32\` is \`Copy\`, so this is legal.
2. Build a \`String\` holding \`ledger\`, \`clone()\` it into \`s2\`, print both.
3. Move \`s2\` into \`s3\` and print \`s3\`.

Expected output:

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\`
`,
    starterCode: `fn main() {
    // 1. a Copy type
    let a = 10;

    // 2. a String and an explicit clone

    // 3. a move
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "copies a into b",
        kind: "let_binding",
        var: "b",
        init: "a",
      },
      {
        name: "clones the String instead of moving it",
        kind: "let_binding",
        var: "s2",
        init: "s1.clone()",
      },
      {
        name: "moves the clone into s3",
        kind: "let_binding",
        var: "s3",
        init: "s2",
      },
      {
        name: "prints the copied pair",
        kind: "macro_invoked",
        macro: "println",
        args: '"copy: {} {}", a, b',
      },
      {
        name: "prints the cloned pair",
        kind: "macro_invoked",
        macro: "println",
        args: '"clone: {} {}", s1, s2',
      },
    ],
    expectedOutput: "copy: 10 10\nclone: ledger ledger\nmoved: ledger\n",
    referenceSolution: `fn main() {
    let a = 10;
    let b = a;
    println!("copy: {} {}", a, b);

    let s1 = String::from("ledger");
    let s2 = s1.clone();
    println!("clone: {} {}", s1, s2);

    let s3 = s2;
    println!("moved: {}", s3);
}
`,
  },

  "rust-ownership-deep-3": {
    instructions: `## Take one field, keep the rest

Ownership is tracked **per field**. Moving one field out of a struct leaves the struct partially moved: that field is dead, the others are still readable.

\`\`\`rust
let id = acct.id;              // moves just this field
println!("{}", acct.balance);  // still fine
\`\`\`

The struct can no longer be used *as a whole* — no passing it on, no \`{:?}\` — but reading an intact field is allowed.

### Your task

1. Define \`struct Account { id: String, balance: i64 }\`.
2. Build one with id \`GA7Q\` and balance \`250\`.
3. Move **only** \`id\` into its own binding.
4. Print the id, then the balance still held by the struct.

Expected output:

\`\`\`text
id: GA7Q
balance: 250
\`\`\`
`,
    starterCode: `struct Account {
    id: String,
    balance: i64,
}

fn main() {
    let acct = Account {
        id: String::from("GA7Q"),
        balance: 250,
    };

    // Move out only \`id\`, then print it and the remaining balance.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "defines Account with an owned id and an i64 balance",
        kind: "struct_defined",
        struct: "Account",
        fields: [
          { name: "id", ty: "String" },
          { name: "balance", ty: "i64" },
        ],
      },
      {
        name: "moves the id field out of the struct",
        kind: "let_binding",
        var: "id",
        init: "acct.id",
      },
      {
        name: "still reads the balance from the partially moved struct",
        kind: "macro_invoked",
        macro: "println",
        args: '"balance: {}", acct.balance',
      },
    ],
    expectedOutput: "id: GA7Q\nbalance: 250\n",
    referenceSolution: `struct Account {
    id: String,
    balance: i64,
}

fn main() {
    let acct = Account {
        id: String::from("GA7Q"),
        balance: 250,
    };

    let id = acct.id;
    println!("id: {}", id);
    println!("balance: {}", acct.balance);
}
`,
  },

  "rust-ownership-deep-4": {
    instructions: `## End the borrow before you mutate

A borrow lasts until its **last use**, not until the end of the block. So an aliasing error is usually fixed by finishing with the borrow earlier — or by extracting an owned summary out of it — rather than by cloning.

\`\`\`rust
let total: i32 = ledger.iter().sum();  // borrow starts and ends in this statement
ledger.push(total);                    // &mut is free to be taken now
\`\`\`

### Your task

Given \`let mut ledger = vec![10, 20, 30];\`:

1. Sum the entries into \`total\` with an iterator.
2. Push \`total\` onto \`ledger\`.
3. Print the vector with \`{:?}\`, then the total.

Expected output:

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\`
`,
    starterCode: `fn main() {
    let mut ledger = vec![10, 20, 30];

    // Sum with an iterator, then push the result and print both.
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "borrows the vector with iter()",
        kind: "method_called",
        method: "iter",
        receiver: "ledger",
      },
      { name: "aggregates with sum()", kind: "method_called", method: "sum" },
      {
        name: "pushes the total onto the vector",
        kind: "method_called",
        method: "push",
        receiver: "ledger",
        args: "total",
      },
      {
        name: "does not clone the vector to dodge the borrow checker",
        kind: "method_called",
        method: "clone",
        receiver: "ledger",
        forbidden: true,
      },
    ],
    expectedOutput: "ledger: [10, 20, 30, 60]\ntotal: 60\n",
    referenceSolution: `fn main() {
    let mut ledger = vec![10, 20, 30];

    let total: i32 = ledger.iter().sum();
    ledger.push(total);

    println!("ledger: {:?}", ledger);
    println!("total: {}", total);
}
`,
  },

  "rust-ownership-deep-5": {
    instructions: `## Deref coercion and reborrowing

**Deref coercion** converts \`&String\` to \`&str\` at a call site, for free. That is why a parameter should be \`&str\`: it accepts both a borrowed \`String\` and a literal.

**Reborrowing** is what makes \`&mut T\` usable more than once. \`&mut T\` is not \`Copy\`, so passing one ought to move it — instead the compiler passes \`&mut *handle\`, a fresh shorter borrow that expires when the callee returns.

### Your task

1. Write \`fn describe(s: &str) -> usize\` returning the length, and call it with a \`&String\` holding \`soroban\`.
2. Write \`fn bump(n: &mut i64)\` that adds \`1\`.
3. Bind \`let mut seq = 41;\` and take \`let handle = &mut seq;\`.
4. Call \`bump\` twice: once passing \`handle\` (implicit reborrow), once passing \`&mut *handle\` (explicit).
5. Print the final \`seq\`.

Expected output:

\`\`\`text
len: 7
seq: 43
\`\`\`
`,
    starterCode: `fn describe(s: &str) -> usize {
    // return the length
}

fn bump(n: &mut i64) {
    // add 1 through the reference
}

fn main() {
    let owned = String::from("soroban");
    // print the length via describe(&owned)

    let mut seq = 41;
    let handle = &mut seq;
    // call bump twice, then print seq
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "describe takes &str and returns usize",
        kind: "fn_defined",
        fn: "describe",
        params: [{ name: "s", ty: "&str" }],
        returns: "usize",
      },
      {
        name: "bump takes an exclusive reference",
        kind: "fn_defined",
        fn: "bump",
        params: [{ name: "n", ty: "&mut i64" }],
      },
      {
        name: "increments through the reference",
        kind: "expr_present",
        expr: "*n += 1",
      },
      {
        name: "relies on deref coercion at the call site",
        kind: "expr_present",
        expr: "describe(&owned)",
      },
      {
        name: "writes one reborrow explicitly",
        kind: "expr_present",
        expr: "bump(&mut *handle)",
      },
    ],
    expectedOutput: "len: 7\nseq: 43\n",
    referenceSolution: `fn describe(s: &str) -> usize {
    s.len()
}

fn bump(n: &mut i64) {
    *n += 1;
}

fn main() {
    let owned = String::from("soroban");
    println!("len: {}", describe(&owned));

    let mut seq = 41;
    let handle = &mut seq;
    bump(handle);
    bump(&mut *handle);
    println!("seq: {}", seq);
}
`,
  },

  "rust-ownership-deep-6": {
    instructions: `## Drop order and RAII

When a value goes out of scope, Rust runs its \`Drop\` impl. There is no \`finally\` and nothing to forget.

**Locals drop in reverse declaration order** — last declared, first released. (Struct *fields* drop in declaration order; the asymmetry is deliberate.)

This is the whole mechanism behind \`MutexGuard\`: wrapping a critical section in \`{ }\` releases the lock at the closing brace.

### Your task

1. Define \`struct Guard(&'static str)\`.
2. Implement \`Drop\` for it, printing \`release <name>\`.
3. In \`main\`: create a guard named \`outer\`, then open a block containing a guard named \`inner\` and \`println!("inside")\`. After the block, print \`outside\`.

Expected output:

\`\`\`text
inside
release inner
outside
release outer
\`\`\`
`,
    starterCode: `struct Guard(&'static str);

impl Drop for Guard {
    fn drop(&mut self) {
        // print "release <name>"
    }
}

fn main() {
    // outer guard, then an inner scope, then "outside"
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "implements Drop for Guard",
        kind: "impl_defined",
        type: "Guard",
        trait: "Drop",
      },
      {
        name: "the drop impl prints the guard's name",
        kind: "macro_invoked",
        macro: "println",
        args: '"release {}", self.0',
      },
      {
        name: "creates the outer guard",
        kind: "expr_present",
        expr: 'Guard("outer")',
      },
      {
        name: "creates the inner guard",
        kind: "expr_present",
        expr: 'Guard("inner")',
      },
    ],
    expectedOutput: "inside\nrelease inner\noutside\nrelease outer\n",
    referenceSolution: `struct Guard(&'static str);

impl Drop for Guard {
    fn drop(&mut self) {
        println!("release {}", self.0);
    }
}

fn main() {
    let _outer = Guard("outer");
    {
        let _inner = Guard("inner");
        println!("inside");
    }
    println!("outside");
}
`,
  },
};
