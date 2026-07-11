import "server-only";

import type { AstCheck } from "@/content/lesson-checks";

// Authored lesson content + hidden grading data.
//
// SERVER-ONLY by design: the checks below are the "hidden tests" — they must
// never ship to the client (Stellar Quest died partly from leaked answers).
// Pages pass `instructions`/`starterCode` down as props; checks stay here.
//
// Grading: Rust lessons (grader "sandbox") compile & run for real in the
// hardened tusst-runner Docker sandbox. Structural checks are declarative
// AST specs (see lesson-checks.ts) evaluated by the tusst-syntest crate
// inside the container; `expectedOutput` is the authoritative stdout the
// compiled program must produce. Conceptual lessons (Stellar 101 configs)
// and Soroban contracts (need soroban-sdk in the runner — Stellar phase)
// aren't Rust programs and stay regex-graded (grader "regex").

export interface LessonCheck {
  name: string; // user-facing test name (safe to return)
  pattern: RegExp;
  forbidden?: boolean; // if true, the pattern must NOT match
}

interface LessonBase {
  instructions: string; // markdown
  starterCode: string;
  expectedOutput: string; // authoritative stdout (sandbox) / shown on pass (regex)
}

export type LessonContent =
  | (LessonBase & { grader: "sandbox"; astChecks: AstCheck[] })
  | (LessonBase & { grader: "regex"; checks: LessonCheck[] });

export type LessonGrader = LessonContent["grader"];

const lessons: Record<string, LessonContent> = {
  "rust-fundamentals-1": {
    instructions: `## Hello, World!

Every Rust program starts at the \`main\` function. It's the entry point — when your program runs, \`main\` is what gets called.

To print text to the console, Rust gives you the \`println!\` **macro** (the \`!\` means it's a macro, not a function — you'll learn why that matters later).

\`\`\`rust
println!("your text here");
\`\`\`

### Your task

Make the program print exactly:

\`\`\`text
Hello, World!
\`\`\`

### Hints

- The text goes between double quotes, inside the parentheses.
- Statements in Rust end with a semicolon \`;\`.
- Capitalization matters: \`Hello, World!\` — capital H, capital W.
`,
    starterCode: `fn main() {
    // Print "Hello, World!" to the console
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "defines a main function", kind: "fn_defined", fn: "main" },
      { name: "uses the println! macro", kind: "macro_invoked", macro: "println" },
      {
        name: 'prints exactly "Hello, World!"',
        kind: "macro_invoked",
        macro: "println",
        args: '"Hello, World!"',
      },
    ],
    expectedOutput: "Hello, World!\n",
  },

  "rust-fundamentals-2": {
    instructions: `## Variables & Mutability

In Rust, variables are declared with \`let\` — and they are **immutable by default**. Once bound, the value can't change:

\`\`\`rust
let x = 5;
x = 10; // ❌ compile error: cannot assign twice to immutable variable
\`\`\`

To allow reassignment, mark the variable as mutable with \`mut\`:

\`\`\`rust
let mut x = 5;
x = 10; // ✅ fine
\`\`\`

### Your task

The starter code declares \`score\` immutably and then tries to change it — it won't compile. Fix it:

1. Make \`score\` **mutable**.
2. Keep the reassignment to \`100\`.
3. Print the final score with \`println!("score: {}", score);\`

Expected output:

\`\`\`text
score: 100
\`\`\`
`,
    starterCode: `fn main() {
    let score = 50;
    score = 100;
    println!("score: {}", score);
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "declares score as mutable (let mut)",
        kind: "let_binding",
        var: "score",
        mutable: true,
      },
      { name: "reassigns score to 100", kind: "expr_present", expr: "score = 100" },
      {
        name: "prints the score with println!",
        kind: "macro_invoked",
        macro: "println",
        args: '"score: {}", score',
      },
    ],
    expectedOutput: "score: 100\n",
  },

  /* ───────────────────────── Act I · 3–6 ───────────────────────── */

  "rust-fundamentals-3": {
    instructions: `## Data Types

Every value in Rust has a **type** — its shape. Rust can usually guess it, but you can (and often should) label it yourself:

\`\`\`rust
let torches: i32 = 3;      // whole number
let weight: f64 = 2.5;     // decimal number
let is_lit: bool = true;   // yes/no value
\`\`\`

### Your task

Label the three vials in the starter code with their types:

1. \`age\` is a whole number → \`i32\`
2. \`price\` is a decimal number → \`f64\`
3. \`is_open\` is a yes/no value → \`bool\`

Expected output:

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\`

### Hints

- The type goes after the name, separated by a colon: \`let name: type = value;\`
`,
    starterCode: `fn main() {
    let age = 12;        // ← label me: i32
    let price = 4.5;     // ← label me: f64
    let is_open = true;  // ← label me: bool

    println!("age: {}", age);
    println!("price: {}", price);
    println!("open: {}", is_open);
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "age is labeled i32", kind: "let_binding", var: "age", ty: "i32" },
      { name: "price is labeled f64", kind: "let_binding", var: "price", ty: "f64" },
      { name: "is_open is labeled bool", kind: "let_binding", var: "is_open", ty: "bool" },
    ],
    expectedOutput: "age: 12\nprice: 4.5\nopen: true\n",
  },

  "rust-fundamentals-4": {
    instructions: `## Functions

A **function** is a recipe: it takes ingredients (parameters), does the work, and hands back a result.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\`

- Parameters list their types: \`x: i32\`.
- \`-> i32\` says what type comes back.
- The last line **without a semicolon** is the returned value.

### Your task

\`main\` already calls \`add(2, 3)\` — but the recipe doesn't exist yet. Write it below \`main\`:

1. Name it \`add\`, with two parameters \`a: i32\` and \`b: i32\`.
2. It returns an \`i32\`.
3. It returns \`a + b\` (no semicolon on that line!).

Expected output:

\`\`\`text
2 + 3 = 5
\`\`\`
`,
    starterCode: `fn main() {
    let sum = add(2, 3);
    println!("2 + 3 = {}", sum);
}

// Write the add function here:
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "defines add(a: i32, b: i32) -> i32",
        kind: "fn_defined",
        fn: "add",
        params: [
          { name: "a", ty: "i32" },
          { name: "b", ty: "i32" },
        ],
        returns: "i32",
      },
      { name: "returns a + b", kind: "expr_present", expr: "a + b" },
      {
        name: "a + b has no semicolon (it's the return value)",
        kind: "tail_expr",
        fn: "add",
        expr: "a + b",
      },
    ],
    expectedOutput: "2 + 3 = 5\n",
  },

  "rust-fundamentals-5": {
    instructions: `## Ownership Basics

Rust's oldest law: **every value has exactly one owner.** When you assign a \`String\` to another variable, ownership *moves* — the old name can't be used anymore:

\`\`\`rust
let a = String::from("gem");
let b = a;            // ownership moves to b
println!("{}", a);    // ❌ error: a no longer owns anything
\`\`\`

If you truly need two, forge a real copy with \`.clone()\`:

\`\`\`rust
let b = a.clone();    // ✅ two independent Strings
\`\`\`

### Your task

The starter code moves \`sword\` into \`copy\`, then tries to use \`sword\` again — it won't compile. Fix it by **cloning** instead of moving.

Expected output:

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\`
`,
    starterCode: `fn main() {
    let sword = String::from("Unbending Blade");
    let copy = sword; // ← ownership moves here! Make it a clone instead.

    println!("original: {}", sword);
    println!("copy: {}", copy);
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "clones sword instead of moving it",
        kind: "let_binding",
        var: "copy",
        init: "sword.clone()",
      },
      {
        name: "still prints the original",
        kind: "macro_invoked",
        macro: "println",
        args: '"original: {}", sword',
      },
      {
        name: "still prints the copy",
        kind: "macro_invoked",
        macro: "println",
        args: '"copy: {}", copy',
      },
    ],
    expectedOutput: "original: Unbending Blade\ncopy: Unbending Blade\n",
  },

  "rust-fundamentals-6": {
    instructions: `## Borrowing & References

You don't have to *give away* a value for someone to read it — you can **lend** it. A reference (\`&\`) lets a function borrow a value and hand it back automatically:

\`\`\`rust
fn inspect(item: &String) {   // borrows, doesn't take
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);                // lend it with &
println!("{}", gem);          // ✅ still yours
\`\`\`

### Your task

\`greet\` currently **takes ownership** of the name, so \`main\` can't use it afterwards. Fix it:

1. Change \`greet\` to borrow: the parameter becomes \`who: &String\`.
2. Call it with a reference: \`greet(&name);\`

Expected output:

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\`
`,
    starterCode: `fn main() {
    let name = String::from("Forgeborn");
    greet(name); // ← name is moved away here. Lend it instead!
    println!("goodbye, {}", name);
}

fn greet(who: String) { // ← make this borrow
    println!("welcome, {}", who);
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "greet borrows with &String",
        kind: "fn_defined",
        fn: "greet",
        params: [{ name: "who", ty: "&String" }],
      },
      { name: "greet is called with &name", kind: "expr_present", expr: "greet(&name)" },
      {
        name: "goodbye line still uses name",
        kind: "macro_invoked",
        macro: "println",
        args: '"goodbye, {}", name',
      },
    ],
    expectedOutput: "welcome, Forgeborn\ngoodbye, Forgeborn\n",
  },

  /* ───────────────────────── Act II · control flow ───────────────────────── */

  "control-flow-1": {
    instructions: `## if / else

Programs decide with \`if\`. The condition must be a \`bool\` — no parentheses needed:

\`\`\`rust
if torches > 0 {
    // runs when the condition is true
} else {
    // runs otherwise
}
\`\`\`

### Your task

The chamber has \`torches = 3\`. Write the decision:

1. **If** \`torches\` is greater than \`0\`, print \`The hall is lit\`.
2. **Else**, print \`Darkness...\`.

Expected output:

\`\`\`text
The hall is lit
\`\`\`
`,
    starterCode: `fn main() {
    let torches = 3;

    // if torches > 0 → print "The hall is lit"
    // else           → print "Darkness..."
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "checks torches > 0 with if", kind: "expr_present", expr: "torches > 0" },
      { name: "has an else branch", kind: "uses_construct", construct: "else" },
      {
        name: 'prints "The hall is lit"',
        kind: "macro_invoked",
        macro: "println",
        args: '"The hall is lit"',
      },
      {
        name: 'prints "Darkness..." in the else',
        kind: "macro_invoked",
        macro: "println",
        args: '"Darkness..."',
      },
    ],
    expectedOutput: "The hall is lit\n",
  },

  "control-flow-2": {
    instructions: `## match Expressions

\`match\` compares a value against patterns — and Rust **forces you to cover every case**. The \`_\` pattern means "anything else":

\`\`\`rust
let word = match number {
    1 => "one",
    2 => "two",
    _ => "many",
};
\`\`\`

A \`match\` is an *expression*: it produces a value you can store.

### Your task

The chamber has three doors and \`door = 2\`. Build a \`match\`:

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. anything else (\`_\`) → \`"no door"\`
4. Store the result in \`path\` and print it.

Expected output:

\`\`\`text
center
\`\`\`
`,
    starterCode: `fn main() {
    let door = 2;

    // let path = match door { ... };

    // println!("{}", path);
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "matches on door", kind: "match_on", scrutinee: "door" },
      { name: 'arm 1 => "left"', kind: "match_arm", pat: "1", body: '"left"' },
      { name: 'arm 2 => "center"', kind: "match_arm", pat: "2", body: '"center"' },
      { name: 'catch-all _ => "no door"', kind: "match_arm", pat: "_", body: '"no door"' },
      {
        name: "prints the chosen path",
        kind: "macro_invoked",
        macro: "println",
        args: '"{}", path',
      },
    ],
    expectedOutput: "center\n",
  },

  "control-flow-3": {
    instructions: `## loop

\`loop\` repeats **forever** — until you \`break\` out:

\`\`\`rust
loop {
    // runs again and again...
    if enough {
        break; // ...until this
    }
}
\`\`\`

### Your task

Escape the endless corridor:

1. Inside a \`loop\`, add \`1\` to \`echoes\` each pass.
2. When \`echoes\` reaches \`3\` (\`echoes == 3\`), \`break\`.
3. The final print is already written for you.

Expected output:

\`\`\`text
escaped after 3 echoes
\`\`\`
`,
    starterCode: `fn main() {
    let mut echoes = 0;

    // loop:
    //   add 1 to echoes
    //   if echoes == 3 → break

    println!("escaped after {} echoes", echoes);
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "uses a loop block", kind: "uses_construct", construct: "loop" },
      {
        name: "increments echoes",
        kind: "any_of",
        of: [
          { kind: "expr_present", expr: "echoes += 1" },
          { kind: "expr_present", expr: "echoes = echoes + 1" },
        ],
      },
      { name: "breaks when echoes == 3", kind: "expr_present", expr: "break" },
      { name: "checks echoes == 3", kind: "expr_present", expr: "echoes == 3" },
    ],
    expectedOutput: "escaped after 3 echoes\n",
  },

  "control-flow-4": {
    instructions: `## while Loops

\`while\` repeats **as long as a condition holds** — it checks before every pass:

\`\`\`rust
while supplies > 0 {
    // one more day...
}
\`\`\`

### Your task

Descend the sinking gallery:

1. **While** \`floors\` is greater than \`0\`: print \`floor {}\` (the current floor), then subtract \`1\` from \`floors\`.
2. After the loop, print \`Ground level!\`.

Expected output:

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\`
`,
    starterCode: `fn main() {
    let mut floors = 3;

    // while floors > 0:
    //   print "floor {}"
    //   floors -= 1

    // then print "Ground level!"
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "loops while floors > 0", kind: "while_loop", cond: "floors > 0" },
      {
        name: "prints the current floor",
        kind: "macro_invoked",
        macro: "println",
        args: '"floor {}", floors',
      },
      {
        name: "decrements floors",
        kind: "any_of",
        of: [
          { kind: "expr_present", expr: "floors -= 1" },
          { kind: "expr_present", expr: "floors = floors - 1" },
        ],
      },
      {
        name: 'prints "Ground level!" after the loop',
        kind: "macro_invoked",
        macro: "println",
        args: '"Ground level!"',
      },
    ],
    expectedOutput: "floor 3\nfloor 2\nfloor 1\nGround level!\n",
  },

  "control-flow-5": {
    instructions: `## for Loops

\`for\` walks through a sequence — no counter to manage, no way to overshoot:

\`\`\`rust
for n in 1..=5 {
    // n is 1, 2, 3, 4, 5
}
\`\`\`

\`1..=5\` is a **range**: from 1 **up to and including** 5. (Without the \`=\`, \`1..5\` stops at 4.)

### Your task

Cross the five stepping stones:

1. Use \`for\` with the range \`1..=5\`.
2. Print \`step {}\` for each number.

Expected output:

\`\`\`text
step 1
step 2
step 3
step 4
step 5
\`\`\`
`,
    starterCode: `fn main() {
    // for each number from 1 to 5 (inclusive), print "step {}"
}
`,
    grader: "sandbox",
    astChecks: [
      // pat omitted on purpose: any loop-variable name is fine (the old regex
      // allowed \w+); expectedOutput pins the printed result.
      { name: "uses for over the range 1..=5", kind: "for_loop", iter: "1..=5" },
      { name: "prints each step", kind: "macro_invoked", macro: "println" },
    ],
    expectedOutput: "step 1\nstep 2\nstep 3\nstep 4\nstep 5\n",
  },

  "control-flow-6": {
    instructions: `## Nested Control Flow

The real power move: a decision **inside** a loop. The \`%\` operator gives the division remainder — \`n % 3 == 0\` means "n is divisible by 3":

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\`

### Your task

Walk the Overlord's ten mirrors:

1. \`for n in 1..=10\`
2. **If** \`n\` is divisible by 3 (\`n % 3 == 0\`), print \`mirror\`.
3. **Else**, print the number \`n\`.

Expected output:

\`\`\`text
1
2
mirror
4
5
mirror
7
8
mirror
10
\`\`\`
`,
    starterCode: `fn main() {
    // for n in 1..=10:
    //   if n % 3 == 0 → print "mirror"
    //   else          → print n
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "loops for n in 1..=10", kind: "for_loop", pat: "n", iter: "1..=10" },
      { name: "checks divisibility by 3", kind: "expr_present", expr: "n % 3 == 0" },
      {
        name: 'prints "mirror" for multiples of 3',
        kind: "macro_invoked",
        macro: "println",
        args: '"mirror"',
      },
      // The old regex demanded this println after an `else`; position isn't
      // expressible declaratively — expectedOutput guarantees the branching.
      {
        name: "prints the number otherwise",
        kind: "macro_invoked",
        macro: "println",
        args: '"{}", n',
      },
    ],
    expectedOutput: "1\n2\nmirror\n4\n5\nmirror\n7\n8\nmirror\n10\n",
  },

  /* ───────────────────── Act III · standard library ───────────────────── */

  "rust-standard-library-1": {
    instructions: `## Vec Basics

A \`Vec\` is a growable list — the satchel of the realm:

\`\`\`rust
let mut items = vec!["torch", "rope"];  // create with contents
items.push("map");                       // grow it
items.len()                              // how many? → 3
\`\`\`

### Your task

1. Create a **mutable** \`satchel\` with \`vec!["torch", "rope"]\`.
2. \`push\` \`"map"\` into it.
3. Print \`items: {}\` with \`satchel.len()\`.

Expected output:

\`\`\`text
items: 3
\`\`\`
`,
    starterCode: `fn main() {
    // 1) let mut satchel = vec!["torch", "rope"];
    // 2) push "map"
    // 3) print "items: {}" with satchel.len()
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "creates the satchel with vec!",
        kind: "let_binding",
        var: "satchel",
        mutable: true,
        init: 'vec!["torch", "rope"]',
      },
      {
        name: 'pushes "map"',
        kind: "method_called",
        method: "push",
        receiver: "satchel",
        args: '"map"',
      },
      {
        name: "prints the length",
        kind: "macro_invoked",
        macro: "println",
        args: '"items: {}", satchel.len()',
      },
    ],
    expectedOutput: "items: 3\n",
  },

  "rust-standard-library-2": {
    instructions: `## Iterators

An **iterator** walks a collection lazily — it does no work until you ask for a result:

\`\`\`rust
let total: i32 = coins.iter().sum();
\`\`\`

\`.iter()\` starts the chain; \`.sum()\` collects it into one value. (The type label on \`total\` tells \`sum\` what to produce.)

### Your task

The satchel holds \`coins = vec![5, 10, 25]\`.

1. Sum them with \`.iter().sum()\` into \`total: i32\`.
2. Print \`total: {}\`.

Expected output:

\`\`\`text
total: 40
\`\`\`
`,
    starterCode: `fn main() {
    let coins = vec![5, 10, 25];

    // let total: i32 = ...
    // print "total: {}"
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "sums with coins.iter().sum()",
        kind: "method_called",
        method: "sum",
        receiver: "coins.iter()",
      },
      { name: "labels total as i32", kind: "let_binding", var: "total", ty: "i32" },
      {
        name: "prints the total",
        kind: "macro_invoked",
        macro: "println",
        args: '"total: {}", total',
      },
    ],
    expectedOutput: "total: 40\n",
  },

  "rust-standard-library-3": {
    instructions: `## Safe Indexing with .get

\`vault[5]\` on a 2-item Vec **crashes** the program. The polite question is \`.get(5)\` — it returns an \`Option\`: \`Some(&item)\` if the slot exists, \`None\` if it doesn't.

\`\`\`rust
let tool = vault.get(5).unwrap_or(&"nothing");
\`\`\`

\`unwrap_or\` supplies a fallback when the answer is \`None\`. (Note the \`&\` — \`get\` hands out references.)

### Your task

The vault has 2 tools; ask for slot \`5\` anyway:

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. Print \`found: {}\`.

Expected output:

\`\`\`text
found: nothing
\`\`\`
`,
    starterCode: `fn main() {
    let vault = vec!["hammer", "chisel"];

    // ask for slot 5 politely, defaulting to &"nothing"
    // print "found: {}"
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "asks with vault.get(5)",
        kind: "method_called",
        method: "get",
        receiver: "vault",
        args: "5",
      },
      {
        name: 'defaults with unwrap_or(&"nothing")',
        kind: "method_called",
        method: "unwrap_or",
        args: '&"nothing"',
      },
      {
        name: "prints the result",
        kind: "macro_invoked",
        macro: "println",
        args: '"found: {}", tool',
      },
      {
        name: "never indexes with vault[5]",
        kind: "expr_present",
        expr: "vault[5]",
        forbidden: true,
      },
    ],
    expectedOutput: "found: nothing\n",
  },

  "rust-standard-library-4": {
    instructions: `## HashMap

A \`HashMap\` binds **keys to values** — ask by key, get the value instantly:

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
ledger.insert("gold", 100);
println!("{}", ledger["gold"]);  // → 100
\`\`\`

It lives in \`std::collections\`, so it needs the \`use\` line at the top.

### Your task

1. Insert \`("gold", 100)\` and \`("silver", 250)\` into the ledger.
2. Print \`gold: {}\` using \`ledger["gold"]\`.

Expected output:

\`\`\`text
gold: 100
\`\`\`
`,
    starterCode: `use std::collections::HashMap;

fn main() {
    let mut ledger = HashMap::new();

    // insert ("gold", 100) and ("silver", 250)
    // print "gold: {}" with ledger["gold"]
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "inserts gold → 100",
        kind: "method_called",
        method: "insert",
        receiver: "ledger",
        args: '"gold", 100',
      },
      {
        name: "inserts silver → 250",
        kind: "method_called",
        method: "insert",
        receiver: "ledger",
        args: '"silver", 250',
      },
      { name: 'reads ledger["gold"]', kind: "expr_present", expr: 'ledger["gold"]' },
    ],
    expectedOutput: "gold: 100\n",
  },

  "rust-standard-library-5": {
    instructions: `## String Handling

A \`String\` is growable text. Two spells today:

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");              // append text

let banner = format!("The {}", s);   // weave strings into a new one
\`\`\`

\`format!\` works exactly like \`println!\` — but returns the String instead of printing it.

### Your task

1. Append \`" of the Vaults"\` to \`title\` with \`push_str\`.
2. Build \`banner\` with \`format!("The {}", title)\`.
3. Print the banner.

Expected output:

\`\`\`text
The Keeper of the Vaults
\`\`\`
`,
    starterCode: `fn main() {
    let mut title = String::from("Keeper");

    // 1) append " of the Vaults"
    // 2) let banner = format!(...);
    // 3) print the banner
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: 'appends with push_str(" of the Vaults")',
        kind: "method_called",
        method: "push_str",
        receiver: "title",
        args: '" of the Vaults"',
      },
      {
        name: "weaves the banner with format!",
        kind: "let_binding",
        var: "banner",
        init: 'format!("The {}", title)',
      },
      {
        name: "prints the banner",
        kind: "macro_invoked",
        macro: "println",
        args: '"{}", banner',
      },
    ],
    expectedOutput: "The Keeper of the Vaults\n",
  },

  "rust-standard-library-6": {
    instructions: `## Slices

A **slice** is a window into a stretch of a collection — no copying, just a view:

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

The range includes its start and **excludes** its end (\`1..4\` → slots 1, 2, 3). Print a slice with the debug marker \`{:?}\`.

### Your task

1. Take the middle of the shelf: \`&shelf[1..4]\`.
2. Print \`middle: {:?}\`.

Expected output:

\`\`\`text
middle: [2, 3, 4]
\`\`\`
`,
    starterCode: `fn main() {
    let shelf = vec![1, 2, 3, 4, 5];

    // let middle = a window into slots 1..4
    // print "middle: {:?}"
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "takes the slice &shelf[1..4]", kind: "expr_present", expr: "&shelf[1..4]" },
      {
        name: "prints with the {:?} debug marker",
        kind: "macro_invoked",
        macro: "println",
        args: '"middle: {:?}", middle',
      },
    ],
    expectedOutput: "middle: [2, 3, 4]\n",
  },

  /* ───────────────────── Act IV · Option ───────────────────── */

  "mastering-option-1": {
    instructions: `## Some or None

\`Option<T>\` is how Rust says *"there may be a value — or not"*:

\`\`\`rust
enum Option<T> {
    Some(T),   // there is a value, wrapped inside
    None,      // there is nothing
}
\`\`\`

A function that might not have an answer returns \`Option\`:

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

### Your task

Complete \`find\`: if \`present\` is true return \`Some(7)\`, otherwise \`None\`.

Expected output:

\`\`\`text
Some(7)
\`\`\`
`,
    starterCode: `fn main() {
    let found = find(true);
    println!("{:?}", found);
}

fn find(present: bool) -> Option<i32> {
    // if present → Some(7)
    // else       → None
    todo!()
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "returns Some(7) when present", kind: "expr_present", expr: "Some(7)" },
      { name: "returns None otherwise", kind: "expr_present", expr: "None" },
      { name: "decides with if", kind: "uses_construct", construct: "if" },
      {
        name: "no todo!() left behind",
        kind: "macro_invoked",
        macro: "todo",
        forbidden: true,
      },
    ],
    expectedOutput: "Some(7)\n",
  },

  "mastering-option-2": {
    instructions: `## Unwrap Safely

\`.unwrap()\` rips the value out of an Option — and **panics** (crashes) on \`None\`. The marsh is full of those who unwrapped.

The safe idiom carries a default:

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

### Your task

\`ghost\` is \`None\`. Extract a value **safely**:

1. \`let value = ghost.unwrap_or(0);\` — no \`.unwrap()\` anywhere.
2. Print \`value: {}\`.

Expected output:

\`\`\`text
value: 0
\`\`\`
`,
    starterCode: `fn main() {
    let ghost: Option<i32> = None;

    // extract safely with a default of 0
    // print "value: {}"
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "uses unwrap_or(0)",
        kind: "method_called",
        method: "unwrap_or",
        receiver: "ghost",
        args: "0",
      },
      {
        name: "prints the value",
        kind: "macro_invoked",
        macro: "println",
        args: '"value: {}", value',
      },
      {
        name: "never calls bare .unwrap()",
        kind: "method_called",
        method: "unwrap",
        forbidden: true,
      },
    ],
    expectedOutput: "value: 0\n",
  },

  "mastering-option-3": {
    instructions: `## if let

When you only care about the \`Some\` case, \`if let\` unwraps and names the value in one stroke:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light is the unwrapped value
} else {
    println!("darkness");
}
\`\`\`

### Your task

The lantern holds \`Some(3)\`. Ask it properly:

1. \`if let Some(light) = lantern\` → print \`light: {}\`.
2. \`else\` → print \`darkness\`.

Expected output:

\`\`\`text
light: 3
\`\`\`
`,
    starterCode: `fn main() {
    let lantern: Option<i32> = Some(3);

    // if let Some(light) = lantern → print "light: {}"
    // else → print "darkness"
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "asks with if let Some(light)",
        kind: "if_let",
        pat: "Some(light)",
        scrutinee: "lantern",
      },
      {
        name: "prints the light",
        kind: "macro_invoked",
        macro: "println",
        args: '"light: {}", light',
      },
      {
        name: "handles darkness in the else",
        kind: "macro_invoked",
        macro: "println",
        args: '"darkness"',
      },
    ],
    expectedOutput: "light: 3\n",
  },

  /* ───────────────────── Act V · Result ───────────────────── */

  "mastering-result-1": {
    instructions: `## Ok or Err

Where \`Option\` models *absence*, \`Result\` models **failure with a reason**:

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // it worked — here's the value
    Err(E),   // it failed — here's why
}
\`\`\`

### Your task

Complete \`divide\`:

1. If \`b == 0\` → \`Err(String::from("division by zero"))\`
2. Otherwise → \`Ok(a / b)\`

Expected output:

\`\`\`text
Ok(5)
\`\`\`
`,
    starterCode: `fn main() {
    println!("{:?}", divide(10, 2));
}

fn divide(a: i32, b: i32) -> Result<i32, String> {
    // if b == 0 → Err with the reason "division by zero"
    // else      → Ok(a / b)
    todo!()
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "guards against b == 0", kind: "expr_present", expr: "b == 0" },
      {
        name: "returns Err with the reason",
        kind: "expr_present",
        expr: 'Err(String::from("division by zero"))',
      },
      { name: "returns Ok(a / b)", kind: "expr_present", expr: "Ok(a / b)" },
      {
        name: "no todo!() left behind",
        kind: "macro_invoked",
        macro: "todo",
        forbidden: true,
      },
    ],
    expectedOutput: "Ok(5)\n",
  },

  "mastering-result-2": {
    instructions: `## Reading the Verdict

You don't guess at a \`Result\` — you \`match\` it, and the compiler makes sure **both** verdicts are handled:

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

### Your task

The court hands you \`Ok(42)\`. Read it:

1. \`Ok(v)\` → print \`granted: {}\`
2. \`Err(e)\` → print \`denied: {}\`

Expected output:

\`\`\`text
granted: 42
\`\`\`
`,
    starterCode: `fn main() {
    let verdict: Result<i32, String> = Ok(42);

    // match both arms: Ok(v) and Err(e)
}
`,
    grader: "sandbox",
    astChecks: [
      { name: "matches on the verdict", kind: "match_on", scrutinee: "verdict" },
      { name: "handles Ok(v)", kind: "match_arm", pat: "Ok(v)" },
      { name: "handles Err(e)", kind: "match_arm", pat: "Err(e)" },
      {
        name: "prints granted with the value",
        kind: "macro_invoked",
        macro: "println",
        args: '"granted: {}", v',
      },
    ],
    expectedOutput: "granted: 42\n",
  },

  "mastering-result-3": {
    instructions: `## The ? Operator

Handling every \`Result\` where it happens buries the logic. The \`?\` mark **propagates**: on \`Ok\` it unwraps and continues; on \`Err\` it returns the error to *your* caller immediately.

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // Err? → returned upward, right here
    Ok(n * 2)
}
\`\`\`

\`?\` only works inside functions that themselves return \`Result\` (or \`Option\`).

### Your task

Complete \`double_first\`:

1. \`let n = parse("21")?;\`
2. Return \`Ok(n * 2)\`.

Expected output:

\`\`\`text
Ok(42)
\`\`\`
`,
    starterCode: `fn main() {
    println!("{:?}", double_first());
}

fn parse(text: &str) -> Result<i32, String> {
    text.parse().map_err(|_| String::from("not a number"))
}

fn double_first() -> Result<i32, String> {
    // let n = parse("21") with the ? mark
    // return Ok(n * 2)
    todo!()
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: 'propagates with parse("21")?',
        kind: "expr_present",
        expr: 'parse("21")?',
      },
      { name: "returns Ok(n * 2)", kind: "expr_present", expr: "Ok(n * 2)" },
      {
        name: "no todo!() left behind",
        kind: "macro_invoked",
        macro: "todo",
        forbidden: true,
      },
    ],
    expectedOutput: "Ok(42)\n",
  },

  /* ───────────────────── Act VI · Stellar 101 (conceptual) ───────────────────── */

  "stellar-101-1": {
    instructions: `## Accounts & Keypairs

Every actor on Stellar is an **account**, controlled by a **keypair**:

- **Public key** — starts with \`G\`. Your address; share it freely.
- **Secret key** — starts with \`S\`. Signs everything; **never** share it. Lose it and the account is gone forever.

An account must hold a minimum balance (**base reserve**) of **1 XLM** to exist on the ledger.

### Your task

Complete the star-keep charter — fill in the three values.

Expected output:

\`\`\`text
star-keep chartered ✓
\`\`\`
`,
    starterCode: `# ── star-keep charter ──────────────────────────
# Fill in the sigils and the reserve.

public_key_starts_with = ""   # share freely
secret_key_starts_with = ""   # NEVER share
min_balance_xlm = 0           # base reserve to exist
`,
    grader: "regex",
    checks: [
      { name: 'public keys start with "G"', pattern: /public_key_starts_with\s*=\s*"G"/ },
      { name: 'secret keys start with "S"', pattern: /secret_key_starts_with\s*=\s*"S"/ },
      { name: "base reserve is 1 XLM", pattern: /min_balance_xlm\s*=\s*1\b/ },
    ],
    expectedOutput: "star-keep chartered ✓\n",
  },

  "stellar-101-2": {
    instructions: `## Lumens & Fees

The native asset is the **lumen (XLM)**, and its smallest unit is the **stroop**:

- \`1 XLM = 10_000_000 stroops\` (ten million)
- Every transaction pays a small fee — the base fee is **100 stroops** (0.00001 XLM)

The fee isn't revenue — it's an anti-spam toll that keeps the network fast for everyone.

### Your task

Fill in the two numbers on the toll plaque.

Expected output:

\`\`\`text
toll paid ✓
\`\`\`
`,
    starterCode: `# ── the toll of the gate ───────────────────────

stroops_per_lumen = 0   # hint: ten million (underscores allowed)
base_fee_stroops = 0    # hint: one hundred
`,
    grader: "regex",
    checks: [
      { name: "1 XLM = 10,000,000 stroops", pattern: /stroops_per_lumen\s*=\s*10_?000_?000\b/ },
      { name: "base fee is 100 stroops", pattern: /base_fee_stroops\s*=\s*100\b/ },
    ],
    expectedOutput: "toll paid ✓\n",
  },

  "stellar-101-3": {
    instructions: `## Trustlines & Assets

Beyond XLM, any account can **issue assets** (dollars, points, tickets…). An asset is identified by two things:

- an **asset code** — e.g. \`USDC\`
- the **issuer** — the account (a \`G...\` address) that created it

But your account holds nothing it hasn't consented to: you must open a **trustline** to an asset before you can receive it. No trustline, no balance.

### Your task

Open the light-bridge: fill in the trustline for **USDC**.

Expected output:

\`\`\`text
light-bridge opened ✓
\`\`\`
`,
    starterCode: `# ── open a trustline ───────────────────────────

[trustline]
asset_code = ""                  # the USD coin's code
asset_issuer_starts_with = ""    # issuers are accounts — which sigil?
`,
    grader: "regex",
    checks: [
      { name: 'asset code is "USDC"', pattern: /asset_code\s*=\s*"USDC"/ },
      { name: 'issuers are G... accounts', pattern: /asset_issuer_starts_with\s*=\s*"G"/ },
    ],
    expectedOutput: "light-bridge opened ✓\n",
  },

  "stellar-101-4": {
    instructions: `## Your First Payment

A **payment operation** needs exactly three things:

1. **destination** — the receiving account (\`G...\`)
2. **asset** — what you're sending (\`XLM\` for the native lumen)
3. **amount** — how much

Sign it with your secret key, pay the ~100-stroop toll, and in ~5 seconds it's final. No banks, no business days.

### Your task

Chart the first payment since the Panic: **25 XLM**.

Expected output:

\`\`\`text
lumens flowing ✓
\`\`\`
`,
    starterCode: `# ── first light across the sky ─────────────────

[payment]
destination_starts_with = ""   # the receiving star-keep's sigil
asset = ""                     # the native asset's code
amount = 0                     # send 25
`,
    grader: "regex",
    checks: [
      { name: "destination is a G... account", pattern: /destination_starts_with\s*=\s*"G"/ },
      { name: 'the native asset is "XLM"', pattern: /asset\s*=\s*"XLM"/ },
      { name: "sends 25", pattern: /amount\s*=\s*25\b/ },
    ],
    expectedOutput: "lumens flowing ✓\n",
  },

  /* ───────────────────── Act VII · Soroban (assumes Rust) ───────────────────── */

  "soroban-smart-contracts-1": {
    instructions: `## Your First Contract

A Soroban contract is a Rust library compiled to WASM and carved into the ledger. Three things make it a contract:

- \`#![no_std]\` — no OS, no heap allocator, no standard library. The ledger is the machine.
- \`#[contract]\` on a unit struct — the contract's identity.
- \`#[contractimpl]\` on the impl block — exports its \`pub fn\`s as invocable entries. Every entry takes \`Env\` first: your handle to storage, events, and cross-contract calls.

Strings are expensive on-chain; short identifiers use \`Symbol\` (≤ 9 chars via \`symbol_short!\`).

### Your task

1. Mark the impl block with \`#[contractimpl]\`.
2. Make \`hello\` return \`symbol_short!("beacon")\`.

Expected invocation result:

\`\`\`text
hello() → Symbol(beacon)
\`\`\`
`,
    starterCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

#[contract]
pub struct HelloContract;

// TODO: export this impl block as the contract interface
impl HelloContract {
    pub fn hello(_env: Env) -> Symbol {
        // return the symbol "beacon"
        todo!()
    }
}
`,
    grader: "regex",
    checks: [
      { name: "impl block is marked #[contractimpl]", pattern: /#\[contractimpl\]/ },
      { name: "hello returns symbol_short!(\"beacon\")", pattern: /symbol_short!\s*\(\s*"beacon"\s*\)/ },
      { name: "no todo!() left behind", pattern: /todo!\s*\(\s*\)/, forbidden: true },
    ],
    expectedOutput: "hello() → Symbol(beacon)\n",
  },

  "soroban-smart-contracts-2": {
    instructions: `## Contract Storage

Contracts are stateless between invocations — state lives in the **ledger**, behind \`env.storage()\`. For contract-wide state, use **instance** storage:

\`\`\`rust
let count: u32 = env.storage().instance().get(&KEY).unwrap_or(0);
env.storage().instance().set(&KEY, &count);
\`\`\`

\`get\` returns \`Option<T>\` — the key may have never been written (or its rent expired), so \`unwrap_or(0)\` is the idiom for counters. Keys and values pass by reference.

### Your task

Implement \`increment\`:

1. Read the current count from instance storage under \`COUNTER\` (default \`0\`).
2. Add \`1\`.
3. Write it back with \`set\`.
4. Return the new count.

Expected invocation result:

\`\`\`text
increment() → 1
\`\`\`
`,
    starterCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    pub fn increment(env: Env) -> u32 {
        // 1) read (default 0)  2) add 1  3) write back  4) return
        todo!()
    }
}
`,
    grader: "regex",
    checks: [
      { name: "reads from instance storage", pattern: /env\s*\.\s*storage\s*\(\s*\)\s*\.\s*instance\s*\(\s*\)\s*\.\s*get/ },
      { name: "defaults to 0 with unwrap_or", pattern: /unwrap_or\s*\(\s*0\s*\)/ },
      { name: "writes back with set(&COUNTER, ...)", pattern: /\.\s*set\s*\(\s*&COUNTER\s*,/ },
      { name: "no todo!() left behind", pattern: /todo!\s*\(\s*\)/, forbidden: true },
    ],
    expectedOutput: "increment() → 1\n",
  },

  "soroban-smart-contracts-3": {
    instructions: `## Authorization

Every \`Address\` in Soroban can prove it approved a call. The contract-side check is one line:

\`\`\`rust
from.require_auth();
\`\`\`

If the transaction wasn't signed (or pre-authorized) by \`from\`, the invocation **traps** — state untouched. Skipping this line on a fund-moving function is the classic fatal bug: anyone could pass any address and drain it.

### Your task

Guard the vault. In \`withdraw\`, require authorization from \`from\` **before** anything else happens.

Expected invocation result:

\`\`\`text
withdraw: authorized ✓
\`\`\`
`,
    starterCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct VaultContract;

#[contractimpl]
impl VaultContract {
    pub fn withdraw(_env: Env, from: Address, amount: i128) {
        // one line: make sure \`from\` authorized this call

        let _ = amount; // (transfer logic arrives in a later skirmish)
    }
}
`,
    grader: "regex",
    checks: [
      { name: "requires auth from the caller", pattern: /from\s*\.\s*require_auth\s*\(\s*\)/ },
    ],
    expectedOutput: "withdraw: authorized ✓\n",
  },
};

export function getLessonContent(slug: string): LessonContent | undefined {
  return lessons[slug];
}
