import "server-only";

// Authored lesson content + hidden grading data.
//
// SERVER-ONLY by design: the checks below are the "hidden tests" — they must
// never ship to the client (Stellar Quest died partly from leaked answers).
// Pages pass `instructions`/`starterCode` down as props; checks stay here.
//
// Grading (Phase 4): Rust lessons compile & run for real in the hardened
// tusst-runner Docker sandbox — the regex checks are fast structural
// pre-checks, and `expectedOutput` is the authoritative stdout the compiled
// program must produce. Conceptual lessons (Stellar 101 configs) and Soroban
// contracts (need soroban-sdk in the runner — Stellar phase) stay regex-only;
// see lessonGrader() below.

export interface LessonCheck {
  name: string; // user-facing test name (safe to return)
  pattern: RegExp;
  forbidden?: boolean; // if true, the pattern must NOT match
}

export interface LessonContent {
  instructions: string; // markdown
  starterCode: string;
  checks: LessonCheck[];
  expectedOutput: string; // authoritative stdout (sandbox) / shown on pass (regex)
}

export type LessonGrader = "sandbox" | "regex";

export function lessonGrader(slug: string): LessonGrader {
  return slug.startsWith("stellar-101-") ||
    slug.startsWith("soroban-smart-contracts-")
    ? "regex"
    : "sandbox";
}

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
    checks: [
      { name: "defines a main function", pattern: /fn\s+main\s*\(\s*\)/ },
      { name: "uses the println! macro", pattern: /println!\s*\(/ },
      {
        name: 'prints exactly "Hello, World!"',
        pattern: /println!\s*\(\s*"Hello, World!"\s*\)/,
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
    checks: [
      { name: "declares score as mutable (let mut)", pattern: /let\s+mut\s+score/ },
      { name: "reassigns score to 100", pattern: /score\s*=\s*100/ },
      {
        name: "prints the score with println!",
        pattern: /println!\s*\(\s*"score: \{\}"\s*,\s*score\s*\)/,
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
    checks: [
      { name: "age is labeled i32", pattern: /let\s+age\s*:\s*i32\s*=/ },
      { name: "price is labeled f64", pattern: /let\s+price\s*:\s*f64\s*=/ },
      { name: "is_open is labeled bool", pattern: /let\s+is_open\s*:\s*bool\s*=/ },
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
    checks: [
      {
        name: "defines add(a: i32, b: i32) -> i32",
        pattern: /fn\s+add\s*\(\s*a\s*:\s*i32\s*,\s*b\s*:\s*i32\s*\)\s*->\s*i32/,
      },
      { name: "returns a + b", pattern: /a\s*\+\s*b/ },
      {
        name: "a + b has no semicolon (it's the return value)",
        pattern: /a\s*\+\s*b\s*;/,
        forbidden: true,
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
    checks: [
      {
        name: "clones sword instead of moving it",
        pattern: /let\s+copy\s*=\s*sword\s*\.\s*clone\s*\(\s*\)/,
      },
      { name: "still prints the original", pattern: /println!\s*\(\s*"original: \{\}"\s*,\s*sword\s*\)/ },
      { name: "still prints the copy", pattern: /println!\s*\(\s*"copy: \{\}"\s*,\s*copy\s*\)/ },
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
    checks: [
      { name: "greet borrows with &String", pattern: /fn\s+greet\s*\(\s*who\s*:\s*&\s*String\s*\)/ },
      { name: "greet is called with &name", pattern: /greet\s*\(\s*&\s*name\s*\)/ },
      { name: "goodbye line still uses name", pattern: /println!\s*\(\s*"goodbye, \{\}"\s*,\s*name\s*\)/ },
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
    checks: [
      { name: "checks torches > 0 with if", pattern: /if\s+torches\s*>\s*0/ },
      { name: "has an else branch", pattern: /else/ },
      { name: 'prints "The hall is lit"', pattern: /println!\s*\(\s*"The hall is lit"\s*\)/ },
      { name: 'prints "Darkness..." in the else', pattern: /println!\s*\(\s*"Darkness\.\.\."\s*\)/ },
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
    checks: [
      { name: "matches on door", pattern: /match\s+door/ },
      { name: "arm 1 => \"left\"", pattern: /1\s*=>\s*"left"/ },
      { name: "arm 2 => \"center\"", pattern: /2\s*=>\s*"center"/ },
      { name: "catch-all _ => \"no door\"", pattern: /_\s*=>\s*"no door"/ },
      { name: "prints the chosen path", pattern: /println!\s*\(\s*"\{\}"\s*,\s*path\s*\)/ },
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
    checks: [
      { name: "uses a loop block", pattern: /loop\s*\{/ },
      { name: "increments echoes", pattern: /echoes\s*\+=\s*1|echoes\s*=\s*echoes\s*\+\s*1/ },
      { name: "breaks when echoes == 3", pattern: /break/ },
      { name: "checks echoes == 3", pattern: /echoes\s*==\s*3/ },
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
    checks: [
      { name: "loops while floors > 0", pattern: /while\s+floors\s*>\s*0/ },
      { name: "prints the current floor", pattern: /println!\s*\(\s*"floor \{\}"\s*,\s*floors\s*\)/ },
      { name: "decrements floors", pattern: /floors\s*-=\s*1|floors\s*=\s*floors\s*-\s*1/ },
      { name: 'prints "Ground level!" after the loop', pattern: /println!\s*\(\s*"Ground level!"\s*\)/ },
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
    checks: [
      { name: "uses for over the range 1..=5", pattern: /for\s+\w+\s+in\s+1\s*\.\.=\s*5/ },
      { name: "prints each step", pattern: /println!\s*\(\s*"step \{\}"\s*,/ },
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
    checks: [
      { name: "loops for n in 1..=10", pattern: /for\s+n\s+in\s+1\s*\.\.=\s*10/ },
      { name: "checks divisibility by 3", pattern: /n\s*%\s*3\s*==\s*0/ },
      { name: 'prints "mirror" for multiples of 3', pattern: /println!\s*\(\s*"mirror"\s*\)/ },
      { name: "prints the number otherwise", pattern: /else[\s\S]*println!\s*\(\s*"\{\}"\s*,\s*n\s*\)/ },
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
    checks: [
      { name: "creates the satchel with vec!", pattern: /let\s+mut\s+satchel\s*=\s*vec!\s*\[\s*"torch"\s*,\s*"rope"\s*\]/ },
      { name: 'pushes "map"', pattern: /satchel\s*\.\s*push\s*\(\s*"map"\s*\)/ },
      { name: "prints the length", pattern: /println!\s*\(\s*"items: \{\}"\s*,\s*satchel\s*\.\s*len\s*\(\s*\)\s*\)/ },
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
    checks: [
      { name: "sums with coins.iter().sum()", pattern: /coins\s*\.\s*iter\s*\(\s*\)\s*\.\s*sum\s*\(\s*\)/ },
      { name: "labels total as i32", pattern: /let\s+total\s*:\s*i32\s*=/ },
      { name: "prints the total", pattern: /println!\s*\(\s*"total: \{\}"\s*,\s*total\s*\)/ },
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
    checks: [
      { name: "asks with vault.get(5)", pattern: /vault\s*\.\s*get\s*\(\s*5\s*\)/ },
      { name: "defaults with unwrap_or(&\"nothing\")", pattern: /unwrap_or\s*\(\s*&\s*"nothing"\s*\)/ },
      { name: "prints the result", pattern: /println!\s*\(\s*"found: \{\}"\s*,\s*tool\s*\)/ },
      { name: "never indexes with vault[5]", pattern: /vault\s*\[\s*5\s*\]/, forbidden: true },
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
    checks: [
      { name: "inserts gold → 100", pattern: /ledger\s*\.\s*insert\s*\(\s*"gold"\s*,\s*100\s*\)/ },
      { name: "inserts silver → 250", pattern: /ledger\s*\.\s*insert\s*\(\s*"silver"\s*,\s*250\s*\)/ },
      { name: "reads ledger[\"gold\"]", pattern: /ledger\s*\[\s*"gold"\s*\]/ },
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
    checks: [
      { name: 'appends with push_str(" of the Vaults")', pattern: /title\s*\.\s*push_str\s*\(\s*" of the Vaults"\s*\)/ },
      { name: "weaves the banner with format!", pattern: /let\s+banner\s*=\s*format!\s*\(\s*"The \{\}"\s*,\s*title\s*\)/ },
      { name: "prints the banner", pattern: /println!\s*\(\s*"\{\}"\s*,\s*banner\s*\)/ },
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
    checks: [
      { name: "takes the slice &shelf[1..4]", pattern: /&\s*shelf\s*\[\s*1\s*\.\.\s*4\s*\]/ },
      { name: "prints with the {:?} debug marker", pattern: /println!\s*\(\s*"middle: \{:\?\}"\s*,\s*middle\s*\)/ },
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
    checks: [
      { name: "returns Some(7) when present", pattern: /Some\s*\(\s*7\s*\)/ },
      { name: "returns None otherwise", pattern: /None/ },
      { name: "decides with if", pattern: /if\s+present/ },
      { name: "no todo!() left behind", pattern: /todo!\s*\(\s*\)/, forbidden: true },
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
    checks: [
      { name: "uses unwrap_or(0)", pattern: /ghost\s*\.\s*unwrap_or\s*\(\s*0\s*\)/ },
      { name: "prints the value", pattern: /println!\s*\(\s*"value: \{\}"\s*,\s*value\s*\)/ },
      { name: "never calls bare .unwrap()", pattern: /\.\s*unwrap\s*\(\s*\)/, forbidden: true },
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
    checks: [
      { name: "asks with if let Some(light)", pattern: /if\s+let\s+Some\s*\(\s*light\s*\)\s*=\s*lantern/ },
      { name: "prints the light", pattern: /println!\s*\(\s*"light: \{\}"\s*,\s*light\s*\)/ },
      { name: "handles darkness in the else", pattern: /println!\s*\(\s*"darkness"\s*\)/ },
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
    checks: [
      { name: "guards against b == 0", pattern: /if\s+b\s*==\s*0/ },
      { name: "returns Err with the reason", pattern: /Err\s*\(\s*String::from\s*\(\s*"division by zero"\s*\)\s*\)/ },
      { name: "returns Ok(a / b)", pattern: /Ok\s*\(\s*a\s*\/\s*b\s*\)/ },
      { name: "no todo!() left behind", pattern: /todo!\s*\(\s*\)/, forbidden: true },
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
    checks: [
      { name: "matches on the verdict", pattern: /match\s+verdict/ },
      { name: "handles Ok(v)", pattern: /Ok\s*\(\s*v\s*\)\s*=>/ },
      { name: "handles Err(e)", pattern: /Err\s*\(\s*e\s*\)\s*=>/ },
      { name: "prints granted with the value", pattern: /println!\s*\(\s*"granted: \{\}"\s*,\s*v\s*\)/ },
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
    checks: [
      { name: "propagates with parse(\"21\")?", pattern: /parse\s*\(\s*"21"\s*\)\s*\?/ },
      { name: "returns Ok(n * 2)", pattern: /Ok\s*\(\s*n\s*\*\s*2\s*\)/ },
      { name: "no todo!() left behind", pattern: /todo!\s*\(\s*\)/, forbidden: true },
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
    checks: [
      { name: "requires auth from the caller", pattern: /from\s*\.\s*require_auth\s*\(\s*\)/ },
    ],
    expectedOutput: "withdraw: authorized ✓\n",
  },
};

export function getLessonContent(slug: string): LessonContent | undefined {
  return lessons[slug];
}
