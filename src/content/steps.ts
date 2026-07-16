// Bite-sized lesson steps — the Mimo/Duolingo-style flow.
//
// CLIENT-SAFE by design: everything here is shown to the learner (theory
// chunks, quiz answers, fill-in blanks give instant client feedback). The
// FINAL editor challenge's hidden checks stay in `content/lessons.ts`
// (server-only) and are graded through /api/submissions — nothing leaks.

export interface TheoryStep {
  kind: "theory";
  body: string; // markdown
  image?: string; // optional illustration (public path)
}

export interface QuizStep {
  kind: "quiz";
  question: string;
  options: string[];
  answer: number; // index into options
  explain?: string; // shown in the success sheet
}

export interface FillStep {
  kind: "fill";
  prompt: string; // markdown shown above the code
  file: string; // e.g. "main.rs"
  before: string; // code before the blank
  after: string; // code after the blank
  choices: string[];
  answer: number; // index into choices
  explain?: string;
}

export interface EditorStep {
  kind: "editor";
  intro: string; // markdown task recap shown above the editor
}

export type LessonStep = TheoryStep | QuizStep | FillStep | EditorStep;

// The Mimo-style "delayed signup" trial: this lesson can be played (and its
// final challenge graded) without an account. Progress isn't persisted.
export const TRIAL_LESSON_SLUG = "rust-fundamentals-1";

const steps: Record<string, LessonStep[]> = {
  "rust-fundamentals-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Welcome to **Rust**, the language the old Forgeborn used to hold the sky together.

Every Rust program starts at the \`main\` function — the entry point. When your program runs, \`main\` is what gets called.

\`\`\`rust
fn main() {
    // your runes go here
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `To print text to the console, Rust gives you the \`println!\` **macro**.

\`\`\`rust
println!("your text here");
\`\`\`

The \`!\` means it's a *macro*, not a function — you'll learn why that matters later. For now: see a \`!\`, think "macro".`,
    },
    {
      kind: "quiz",
      question: "What does the `!` in `println!` tell you?",
      options: [
        "It's a macro, not a function",
        "The text is printed loudly",
        "The line can never fail",
      ],
      answer: 0,
      explain: "The `!` marks a macro invocation — println! is Rust's most famous one.",
    },
    {
      kind: "fill",
      prompt: "Complete the rune so it prints text to the console.",
      file: "main.rs",
      before: "fn main() {\n    ",
      after: `("Hello, World!");\n}`,
      choices: ["println!", "print", "echo!"],
      answer: 0,
      explain: "println! prints the text followed by a new line.",
    },
    {
      kind: "quiz",
      question: "Statements in Rust end with…",
      options: ["a semicolon ;", "a period .", "nothing — line breaks are enough"],
      answer: 0,
      explain: "The beacon is pedantic: every statement ends with `;`.",
    },
    {
      kind: "editor",
      intro: `### Final trial — speak the waking words

Make the program print **exactly**:

\`\`\`text
Hello, World!
\`\`\`

Capitalization matters: capital H, capital W. The text goes between double quotes, inside the parentheses — and mind your semicolon.`,
    },
  ],

  "rust-fundamentals-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Programs need to **remember** values to display or change them. For that, Rust has **variables**, declared with \`let\`:

\`\`\`rust
let score = 50;
\`\`\`

Like labeled chests, variables have contents — and names that tell us what's inside.`,
    },
    {
      kind: "theory",
      body: `Here's the old law of the armory: variables in Rust are **immutable by default**. Once bound, the value can't change.

\`\`\`rust
let x = 5;
x = 10; // ❌ compile error: cannot assign twice
\`\`\`

The compiler — your harshest ally — will refuse to forge this.`,
    },
    {
      kind: "quiz",
      question: "What happens when you compile this?\n\n`let x = 5; x = 10;`",
      options: [
        "Compile error — x is immutable",
        "x becomes 10",
        "x becomes 15",
      ],
      answer: 0,
      explain: "Once forged, never changed — unless you declare otherwise.",
    },
    {
      kind: "theory",
      body: `To allow reassignment, declare your intent to the steel itself with \`mut\`:

\`\`\`rust
let mut x = 5;
x = 10; // ✅ fine
\`\`\`

\`mut\` is a promise made out loud: *this value will change*.`,
    },
    {
      kind: "fill",
      prompt: "Make `score` reforgeable — declare it mutable.",
      file: "main.rs",
      before: "let ",
      after: " score = 50;\nscore = 100;",
      choices: ["mut", "var", "flex"],
      answer: 0,
      explain: "let mut score = 50; — now the reassignment compiles.",
    },
    {
      kind: "quiz",
      question: "Which declaration allows reassignment later?",
      options: ["let mut power = 7;", "let power = 7;", "immutable power = 7;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Final trial — reforge the blade

The starter code declares \`score\` immutably and then tries to change it — it won't compile. Fix it:

1. Make \`score\` **mutable**.
2. Keep the reassignment to \`100\`.
3. Print the final score with \`println!("score: {}", score);\`

Expected output:

\`\`\`text
score: 100
\`\`\``,
    },
  ],

  /* ───────────────────────── Act I · 3–6 ───────────────────────── */

  "rust-fundamentals-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Every value in Rust has a **type** — its shape. Think of Ferrisia's vials: each one is labeled with what's inside.

The three shapes you'll use most:

- \`i32\` — a **whole number**: \`3\`, \`-7\`, \`2026\`
- \`f64\` — a **decimal number**: \`2.5\`, \`0.1\`
- \`bool\` — a **yes/no value**: \`true\` or \`false\``,
    },
    {
      kind: "theory",
      body: `Rust can usually guess the type — but you can label it yourself, and the Citadel prefers you do:

\`\`\`rust
let torches: i32 = 3;
let weight: f64 = 2.5;
let is_lit: bool = true;
\`\`\`

The pattern is always the same: \`let name: type = value;\` — the label goes after the name, behind a colon.`,
    },
    {
      kind: "quiz",
      question: "Which type fits the value `4.5`?",
      options: ["f64 — a decimal number", "i32 — a whole number", "bool — a yes/no value"],
      answer: 0,
      explain: "Anything with a decimal point needs a floating-point type like f64.",
    },
    {
      kind: "fill",
      prompt: "Label the vial: `is_open` holds `true` — a yes/no value.",
      file: "main.rs",
      before: "let is_open: ",
      after: " = true;",
      choices: ["bool", "i32", "yes"],
      answer: 0,
      explain: "true and false live in the bool type.",
    },
    {
      kind: "quiz",
      question: "Where does the type label go?\n\n`let age ___ = 12;`",
      options: [": i32 — after the name, behind a colon", "i32: — before the name", "as i32 — after the value"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Final trial — label the vials

Three unlabeled vials sit on the shelf. Add the type to each:

1. \`age\` is a whole number → \`i32\`
2. \`price\` is a decimal → \`f64\`
3. \`is_open\` is yes/no → \`bool\`

Expected output:

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\``,
    },
  ],

  "rust-fundamentals-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `You've been writing code inside \`main\` — but a program that's all \`main\` is a forge with one giant recipe nailed to the wall.

A **function** is a recipe you write once and use forever: it takes ingredients, does the work, and hands back a result.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Read the recipe piece by piece:

- \`fn double\` — the recipe's **name**
- \`(x: i32)\` — the **ingredient** and its type
- \`-> i32\` — the type of what comes **back**

And the secret of the last line: \`x * 2\` has **no semicolon**. In Rust, the final expression without a semicolon *is* the returned value.`,
    },
    {
      kind: "quiz",
      question: "In `fn double(x: i32) -> i32 { x * 2 }`, why does `x * 2` have no semicolon?",
      options: [
        "It's the return value — expressions without ; are handed back",
        "Semicolons are optional in Rust",
        "It's a typo",
      ],
      answer: 0,
      explain: "The last expression without a semicolon is what the function returns.",
    },
    {
      kind: "fill",
      prompt: "Complete the recipe's signature: it returns an `i32`.",
      file: "main.rs",
      before: "fn add(a: i32, b: i32) ",
      after: " i32 {\n    a + b\n}",
      choices: ["->", "=>", ":"],
      answer: 0,
      explain: "-> declares the return type. (=> belongs to match arms.)",
    },
    {
      kind: "quiz",
      question: "How do you call the recipe `add` with 2 and 3, storing the result?",
      options: ["let sum = add(2, 3);", "let sum = add 2 3;", "call add(2, 3) into sum;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Final trial — write the recipe

\`main\` already calls \`add(2, 3)\` — but the recipe doesn't exist yet. Write it below \`main\`:

1. Name: \`add\`, parameters \`a: i32\` and \`b: i32\`.
2. Returns an \`i32\`.
3. Returns \`a + b\` — **no semicolon** on that line.

Expected output:

\`\`\`text
2 + 3 = 5
\`\`\``,
    },
  ],

  "rust-fundamentals-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Now the law that makes Rust *Rust* — the one carved on the vault door:

**Every value has exactly one owner.**

\`\`\`rust
let sword = String::from("blade");
\`\`\`

Here \`sword\` **owns** that String. One treasure, one keeper. No exceptions.`,
    },
    {
      kind: "theory",
      body: `Hand the treasure to another name, and ownership **moves**:

\`\`\`rust
let a = String::from("gem");
let b = a;            // the gem now belongs to b
println!("{}", a);    // ❌ error: a owns nothing
\`\`\`

This isn't cruelty — it's how Rust knows exactly who must clean up every value, with no garbage collector and no leaks.`,
    },
    {
      kind: "quiz",
      question: "After `let b = a;` (where `a` is a String), what can you do with `a`?",
      options: [
        "Nothing — ownership moved to b",
        "Use it normally",
        "Read it, but not change it",
      ],
      answer: 0,
      explain: "The value moved. Reach for a again and the wards will burn you — at compile time.",
    },
    {
      kind: "theory",
      body: `Sometimes you truly need **two** treasures. Then you forge a real, independent copy:

\`\`\`rust
let b = a.clone();   // ✅ two Strings, two owners
\`\`\`

\`.clone()\` costs real work — the smiths use it deliberately, not by habit.`,
    },
    {
      kind: "fill",
      prompt: "Keep both names usable: make `copy` a true copy instead of a move.",
      file: "main.rs",
      before: "let sword = String::from(\"blade\");\nlet copy = sword",
      after: ";",
      choices: [".clone()", ".copy()", ".dup()"],
      answer: 0,
      explain: "clone() forges an independent String — both owners live on.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the law of one keeper

The starter code moves \`sword\` into \`copy\`, then tries to use \`sword\` again — the wards refuse. Fix it by **cloning** instead of moving.

Expected output:

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\``,
    },
  ],

  "rust-fundamentals-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Cloning everything would bankrupt the forge. The Borrow Warden teaches a better way:

**You don't have to give a value away for someone to read it. Lend it.**

A **reference** (\`&\`) lets a function *borrow* a value — and it returns to your hand automatically when they're done.`,
    },
    {
      kind: "theory",
      body: `Two small marks make it work:

\`\`\`rust
fn inspect(item: &String) {  // ① borrows, doesn't take
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);               // ② lend with &
println!("{}", gem);         // ✅ still yours
\`\`\`

\`&String\` in the recipe, \`&gem\` at the call. Lend, read, returned.`,
    },
    {
      kind: "quiz",
      question: "What does `&` mean in `inspect(&gem)`?",
      options: [
        "Lend gem — inspect borrows it and gives it back",
        "Move gem into inspect permanently",
        "Make a full copy of gem",
      ],
      answer: 0,
      explain: "A reference borrows. Ownership never leaves your hands.",
    },
    {
      kind: "fill",
      prompt: "Fix the recipe so it *borrows* the name instead of taking it.",
      file: "main.rs",
      before: "fn greet(who: ",
      after: ") {\n    println!(\"welcome, {}\", who);\n}",
      choices: ["&String", "String", "clone String"],
      answer: 0,
      explain: "&String borrows — main keeps ownership of the name.",
    },
    {
      kind: "editor",
      intro: `### Final trial — lend the blade

\`greet\` currently **takes** the name, so \`main\` loses it. Fix both marks:

1. The parameter becomes \`who: &String\`.
2. The call becomes \`greet(&name);\`

Expected output:

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\``,
    },
  ],

  /* ───────────────────────── Act II · control flow ───────────────────────── */

  "control-flow-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `So far your programs run straight down, line by line. But the labyrinth demands **decisions**.

\`if\` runs code only when a condition is true:

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
}
\`\`\`

The condition (\`torches > 0\`) must be a \`bool\` — a true/false question. No parentheses needed around it.`,
    },
    {
      kind: "theory",
      body: `\`else\` catches everything the \`if\` didn't:

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
} else {
    println!("Darkness...");
}
\`\`\`

Exactly one of the two doors opens. Never both, never neither.`,
    },
    {
      kind: "quiz",
      question: "With `let torches = 0;`, what does the code above print?",
      options: ["Darkness...", "The hall is lit", "Nothing"],
      answer: 0,
      explain: "0 > 0 is false, so the else door opens.",
    },
    {
      kind: "fill",
      prompt: "Complete the condition: enter the vault only if `keys` is greater than 0.",
      file: "main.rs",
      before: "if keys ",
      after: " 0 {\n    println!(\"enter\");\n}",
      choices: [">", "=", "=>"],
      answer: 0,
      explain: "> asks \"greater than?\". A single = is assignment, not a question.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the two doors

The chamber has \`torches = 3\`. Write the decision:

1. **If** \`torches > 0\` → print \`The hall is lit\`
2. **Else** → print \`Darkness...\`

Expected output:

\`\`\`text
The hall is lit
\`\`\``,
    },
  ],

  "control-flow-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A chain of \`if / else if / else\` gets clumsy fast. For "compare one value against many possibilities", Rust has something sharper: \`match\`.

\`\`\`rust
match number {
    1 => println!("one"),
    2 => println!("two"),
    _ => println!("many"),
}
\`\`\`

Each line is an **arm**: \`pattern => what to do\`.`,
    },
    {
      kind: "theory",
      body: `Two rules make \`match\` the Overlord's favorite:

1. **Every case must be covered.** The \`_\` arm means "anything else" — forget it and the compiler refuses.
2. **A match produces a value** you can store:

\`\`\`rust
let word = match number {
    1 => "one",
    _ => "many",
};
\`\`\``,
    },
    {
      kind: "quiz",
      question: "What does the `_` arm in a match mean?",
      options: [
        "Anything else — the catch-all case",
        "An empty value",
        "Skip this match",
      ],
      answer: 0,
      explain: "match must cover every possibility; _ sweeps up the rest.",
    },
    {
      kind: "fill",
      prompt: "Complete the arm: door `2` leads to the center.",
      file: "main.rs",
      before: "let path = match door {\n    1 => \"left\",\n    2 ",
      after: " \"center\",\n    _ => \"no door\",\n};",
      choices: ["=>", "->", ":"],
      answer: 0,
      explain: "Match arms use => (functions use -> for return types).",
    },
    {
      kind: "editor",
      intro: `### Final trial — every reflection named

\`door = 2\`. Build the match:

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. \`_\` → \`"no door"\`
4. Store the result in \`path\`, then \`println!("{}", path);\`

Expected output:

\`\`\`text
center
\`\`\``,
    },
  ],

  "control-flow-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Sometimes you need to repeat something until *you* decide to stop. Rust's simplest repetition is \`loop\` — it runs **forever**:

\`\`\`rust
loop {
    println!("again...");
}
\`\`\`

Forever. Unless you escape.`,
    },
    {
      kind: "theory",
      body: `\`break\` is the escape word — it exits the loop immediately:

\`\`\`rust
let mut count = 0;
loop {
    count += 1;      // += adds and stores: count = count + 1
    if count == 3 {
        break;       // out!
    }
}
\`\`\`

Note \`==\` (a question: "equal?") versus \`=\` (an order: "store this").`,
    },
    {
      kind: "quiz",
      question: "What happens to a `loop` with no `break` inside?",
      options: [
        "It runs forever — the program never moves on",
        "It runs once",
        "The compiler adds a break automatically",
      ],
      answer: 0,
      explain: "Travelers who walk it forever become part of the wall.",
    },
    {
      kind: "fill",
      prompt: "Escape when the count reaches 3.",
      file: "main.rs",
      before: "loop {\n    count += 1;\n    if count == 3 {\n        ",
      after: ";\n    }\n}",
      choices: ["break", "stop", "exit"],
      answer: 0,
      explain: "break exits the loop mid-stride.",
    },
    {
      kind: "editor",
      intro: `### Final trial — break the endless corridor

1. Inside a \`loop\`, add \`1\` to \`echoes\` each pass (\`echoes += 1;\`).
2. When \`echoes == 3\`, \`break\`.

Expected output:

\`\`\`text
escaped after 3 echoes
\`\`\``,
    },
  ],

  "control-flow-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`loop\` + \`if\` + \`break\` works, but there's a cleaner rune when the exit condition is known up front: \`while\`.

\`\`\`rust
while floors > 0 {
    println!("descending...");
    floors -= 1;
}
\`\`\`

**While the condition holds, repeat.** The check happens *before* every pass — if it's false from the start, the body never runs.`,
    },
    {
      kind: "quiz",
      question: "With `let mut floors = 0;`, how many times does `while floors > 0 { ... }` run?",
      options: [
        "Zero — the condition is checked before the first pass",
        "Once, then it stops",
        "Forever",
      ],
      answer: 0,
      explain: "while checks first, acts second. 0 > 0 is already false.",
    },
    {
      kind: "theory",
      body: `One danger: if the condition never becomes false, \`while\` loops forever — just like \`loop\`.

That's why the body usually **changes** something the condition depends on:

\`\`\`rust
while floors > 0 {
    floors -= 1;   // ← the tide that ends the loop
}
\`\`\``,
    },
    {
      kind: "fill",
      prompt: "Keep descending while there are floors left.",
      file: "main.rs",
      before: "",
      after: " floors > 0 {\n    println!(\"floor {}\", floors);\n    floors -= 1;\n}",
      choices: ["while", "until", "if"],
      answer: 0,
      explain: "while repeats; if decides only once.",
    },
    {
      kind: "editor",
      intro: `### Final trial — outrun the tide

1. **While** \`floors > 0\`: print \`floor {}\`, then \`floors -= 1;\`
2. After the loop: print \`Ground level!\`

Expected output:

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\``,
    },
  ],

  "control-flow-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `When you know the path in advance — "every number from 1 to 5" — managing your own counter is beneath you. \`for\` walks the sequence for you:

\`\`\`rust
for n in 1..=5 {
    println!("step {}", n);
}
\`\`\`

Each pass, \`n\` takes the next value: 1, 2, 3, 4, 5. No counter to forget, no way to overshoot.`,
    },
    {
      kind: "theory",
      body: `\`1..=5\` is a **range** — and the \`=\` matters:

- \`1..=5\` → 1, 2, 3, 4, **5** (inclusive)
- \`1..5\` → 1, 2, 3, 4 (stops *before* 5)

The off-by-one error is the oldest trap in the labyrinth. The \`=\` is how you disarm it.`,
    },
    {
      kind: "quiz",
      question: "What numbers does `for n in 1..4` produce?",
      options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"],
      answer: 0,
      explain: "Without the =, the range stops before its end.",
    },
    {
      kind: "fill",
      prompt: "Walk stones 1 through 5 — **including** 5.",
      file: "main.rs",
      before: "for n in 1",
      after: "5 {\n    println!(\"step {}\", n);\n}",
      choices: ["..=", "..", "to"],
      answer: 0,
      explain: "..= includes the final stone.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the counted steps

Cross the five stepping stones:

1. \`for\` over the range \`1..=5\`
2. Print \`step {}\` for each number.

Expected output:

\`\`\`text
step 1
step 2
step 3
step 4
step 5
\`\`\``,
    },
  ],

  "control-flow-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `You know every rune now — \`if\`, \`match\`, \`loop\`, \`while\`, \`for\`. The Overlord's maze demands you **combine** them: a decision *inside* a repetition.

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `The new symbol \`%\` gives the **remainder** of a division:

- \`7 % 3\` → \`1\` (7 ÷ 3 = 2, remainder **1**)
- \`9 % 3\` → \`0\` (divides evenly)

So \`n % 3 == 0\` asks: *"is n divisible by 3?"* — the classic way to find every third mirror.`,
    },
    {
      kind: "quiz",
      question: "What is `10 % 3`?",
      options: ["1 — the remainder of 10 ÷ 3", "3 — the result of the division", "0 — it divides evenly"],
      answer: 0,
      explain: "10 = 3×3 + 1. The % operator hands you that 1.",
    },
    {
      kind: "fill",
      prompt: "Ask the question: is `n` divisible by 3?",
      file: "main.rs",
      before: "if n % 3 ",
      after: " 0 {\n    println!(\"mirror\");\n}",
      choices: ["==", "=", "%"],
      answer: 0,
      explain: "== compares. A single = would try to assign.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the Overlord's maze

Walk the ten mirrors:

1. \`for n in 1..=10\`
2. **If** \`n % 3 == 0\` → print \`mirror\`
3. **Else** → print the number \`n\`

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
\`\`\``,
    },
  ],

  /* ───────────────────── Act III · standard library ───────────────────── */

  "rust-standard-library-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A variable holds **one** value. But adventures produce *lists*: items, coins, names. For that, the realm's favorite tool is the \`Vec\` — a satchel that grows:

\`\`\`rust
let mut items = vec!["torch", "rope"];
\`\`\`

\`vec![...]\` creates it with contents already inside. It needs \`mut\` if you plan to change it — and you do.`,
    },
    {
      kind: "theory",
      body: `Two moves you'll use constantly:

\`\`\`rust
items.push("map");    // add to the end — the satchel grows
items.len()           // how many inside? → 3
\`\`\`

And the old gods' rule: positions count **from zero**. \`items[0]\` is \`"torch"\`, \`items[1]\` is \`"rope"\`.`,
    },
    {
      kind: "quiz",
      question: "After `let mut v = vec![10, 20]; v.push(30);` — what is `v[0]`?",
      options: ["10 — positions count from zero", "30 — push puts it first", "20 — the second item"],
      answer: 0,
      explain: "push adds to the END; indexing starts at 0, as the old gods intended.",
    },
    {
      kind: "fill",
      prompt: "Grow the satchel: add `\"map\"` to the end.",
      file: "main.rs",
      before: "let mut satchel = vec![\"torch\", \"rope\"];\nsatchel.",
      after: "(\"map\");",
      choices: ["push", "add", "append_one"],
      answer: 0,
      explain: "push adds one item to the end of a Vec.",
    },
    {
      kind: "editor",
      intro: `### Final trial — pack the satchel

1. Create a **mutable** \`satchel\` with \`vec!["torch", "rope"]\`.
2. \`push\` \`"map"\`.
3. Print \`items: {}\` with \`satchel.len()\`.

Expected output:

\`\`\`text
items: 3
\`\`\``,
    },
  ],

  "rust-standard-library-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Meet the laziest workers in the realm: **iterators**. An iterator promises to walk a collection — and then does *nothing* until you demand a result.

\`\`\`rust
coins.iter()   // a chain of lazy spirits, waiting
\`\`\`

You've already commanded them without knowing: \`for n in 1..=5\` drives an iterator underneath.`,
    },
    {
      kind: "theory",
      body: `The magic is in **finishing the chain**. Ask for a result, and the spirits finally work:

\`\`\`rust
let coins = vec![5, 10, 25];
let total: i32 = coins.iter().sum();   // → 40
\`\`\`

The type label \`: i32\` on \`total\` tells \`.sum()\` what to produce — don't skip it.`,
    },
    {
      kind: "quiz",
      question: "What does `coins.iter()` do **by itself**, with no `.sum()` after it?",
      options: [
        "Nothing yet — iterators are lazy until collected",
        "Immediately adds up the coins",
        "Copies the whole Vec",
      ],
      answer: 0,
      explain: "They lift no finger until you collect. That laziness is what makes chains cheap.",
    },
    {
      kind: "fill",
      prompt: "Finish the chain: make the spirits add everything up.",
      file: "main.rs",
      before: "let total: i32 = coins.iter().",
      after: "();",
      choices: ["sum", "total", "add_all"],
      answer: 0,
      explain: ".sum() consumes the chain and returns one value.",
    },
    {
      kind: "editor",
      intro: `### Final trial — collect the fortune

\`coins = vec![5, 10, 25]\`.

1. Sum them: \`let total: i32 = coins.iter().sum();\`
2. Print \`total: {}\`.

Expected output:

\`\`\`text
total: 40
\`\`\``,
    },
  ],

  "rust-standard-library-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `The Hoarder's favorite trap: a Vec with 2 items, and an adventurer reaching for slot 5.

\`\`\`rust
let vault = vec!["hammer", "chisel"];
vault[5]   // 💥 PANIC — the program crashes
\`\`\`

Square brackets *assume* the slot exists. Assumptions, in the vaults, are fatal.`,
    },
    {
      kind: "theory",
      body: `The polite question is \`.get()\`:

\`\`\`rust
vault.get(0)   // → Some(&"hammer")  — the slot exists
vault.get(5)   // → None             — no crash, just "nothing there"
\`\`\`

That \`Some / None\` answer is an \`Option\` — your first taste of the Vanishing Marsh. Pair it with a fallback: \`vault.get(5).unwrap_or(&"nothing")\`.`,
    },
    {
      kind: "quiz",
      question: "`vault` has 2 items. What does `vault.get(5)` return?",
      options: [
        "None — a calm \"nothing there\"",
        "It crashes the program",
        "The last item",
      ],
      answer: 0,
      explain: "get never crashes — it answers Some(&item) or None.",
    },
    {
      kind: "fill",
      prompt: "Ask for slot 5 **politely** — no crashing allowed.",
      file: "main.rs",
      before: "let tool = vault.",
      after: "(5).unwrap_or(&\"nothing\");",
      choices: ["get", "[]", "grab"],
      answer: 0,
      explain: "get(5) returns an Option; unwrap_or supplies the fallback.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the shelf that may be empty

The vault has 2 tools. Ask for slot \`5\` anyway — safely:

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. Print \`found: {}\`.

Expected output:

\`\`\`text
found: nothing
\`\`\``,
    },
  ],

  "rust-standard-library-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A Vec answers by **position**. But the Hoarder's ledger answers by **name**: ask "gold?" and it says "100".

That's a \`HashMap\` — keys bound to values:

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
\`\`\`

It lives deeper in the vaults (\`std::collections\`), so it needs the \`use\` line at the top.`,
    },
    {
      kind: "theory",
      body: `Writing and reading the ledger:

\`\`\`rust
ledger.insert("gold", 100);     // bind key → value
ledger.insert("silver", 250);

println!("{}", ledger["gold"]); // ask by key → 100
\`\`\`

Entries keep **no particular order** — the enchantment trades order for instant answers.`,
    },
    {
      kind: "quiz",
      question: "What happens if you `insert(\"gold\", 999)` when \"gold\" already exists?",
      options: [
        "The old value is replaced — one value per key",
        "The map keeps both values",
        "It crashes with a duplicate error",
      ],
      answer: 0,
      explain: "A key binds to exactly one value; inserting again overwrites it.",
    },
    {
      kind: "fill",
      prompt: "Record the treasure: bind `\"gold\"` to `100`.",
      file: "main.rs",
      before: "ledger.",
      after: "(\"gold\", 100);",
      choices: ["insert", "push", "set"],
      answer: 0,
      explain: "HashMaps insert(key, value) — push belongs to Vec.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the enchanted ledger

1. Insert \`("gold", 100)\` and \`("silver", 250)\`.
2. Print \`gold: {}\` using \`ledger["gold"]\`.

Expected output:

\`\`\`text
gold: 100
\`\`\``,
    },
  ],

  "rust-standard-library-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `You've met \`String\` in the ownership vault — now learn to make it **grow**:

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");   // append text to the end
\`\`\`

\`push_str\` is the chisel for living inscriptions. (Its cousin \`push\` adds a single character.)`,
    },
    {
      kind: "theory",
      body: `And the weaving spell — \`format!\`:

\`\`\`rust
let banner = format!("The {}", s);
\`\`\`

It works **exactly** like \`println!\` — same \`{}\` slots — but instead of printing, it hands you the new String to keep.`,
    },
    {
      kind: "quiz",
      question: "What's the difference between `println!(\"The {}\", s)` and `format!(\"The {}\", s)`?",
      options: [
        "println! prints it; format! returns the String instead",
        "format! is faster",
        "println! can't use {} slots",
      ],
      answer: 0,
      explain: "Same spell, different destination — the console, or your hands.",
    },
    {
      kind: "fill",
      prompt: "Grow the inscription: append `\" of the Vaults\"`.",
      file: "main.rs",
      before: "let mut title = String::from(\"Keeper\");\ntitle.",
      after: "(\" of the Vaults\");",
      choices: ["push_str", "push", "append"],
      answer: 0,
      explain: "push_str appends text; push appends a single character.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the living inscription

1. Append \`" of the Vaults"\` to \`title\` with \`push_str\`.
2. \`let banner = format!("The {}", title);\`
3. Print the banner.

Expected output:

\`\`\`text
The Keeper of the Vaults
\`\`\``,
    },
  ],

  "rust-standard-library-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `The Hoarder won't let treasure leave — but he'll let you **look**. A **slice** is a window into a stretch of a collection:

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

No copy is made. The \`&\` marks it as a borrow — you're viewing the Hoarder's shelf, not carrying it out.`,
    },
    {
      kind: "theory",
      body: `Mind the edges — same rule as \`for\` ranges:

- \`1..4\` → slots 1, 2, 3 (**excludes** the end)
- \`1..=4\` → slots 1, 2, 3, 4 (includes it)

And to print a whole slice, use the **debug marker** \`{:?}\`:

\`\`\`rust
println!("{:?}", window);   // [2, 3, 4]
\`\`\``,
    },
    {
      kind: "quiz",
      question: "For `vec![10, 20, 30, 40]`, what is `&v[0..2]`?",
      options: ["[10, 20] — the end is excluded", "[10, 20, 30] — the end is included", "[20, 30]"],
      answer: 0,
      explain: "0..2 covers slots 0 and 1. The window excludes its end.",
    },
    {
      kind: "fill",
      prompt: "Print the window — slices need the debug marker.",
      file: "main.rs",
      before: "println!(\"",
      after: "\", window);",
      choices: ["{:?}", "{}", "{window}"],
      answer: 0,
      explain: "{:?} is the debug marker — collections print with it.",
    },
    {
      kind: "editor",
      intro: `### Final trial — a window into the hoard

1. Take the middle: \`let middle = &shelf[1..4];\`
2. Print \`middle: {:?}\`.

Expected output:

\`\`\`text
middle: [2, 3, 4]
\`\`\``,
    },
  ],

  "rust-standard-library-7": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Deep in the Hoarder's vault, past every satchel and ledger, sits a workshop nobody enters uninvited. Here, treasure doesn't begin as treasure — it begins as a **blueprint**:

\`\`\`rust
struct Player {
    name: String,
    hp: i32,
}
\`\`\`

A \`struct\` binds several values into one named shape. Define it once; the vault remembers the shape forever after.`,
    },
    {
      kind: "theory",
      body: `To bring the blueprint to life, fill in every field — a **struct literal**:

\`\`\`rust
let hero = Player { name: String::from("Ferrisia"), hp: 100 };
\`\`\`

Reach into it with a dot: \`hero.name\`, \`hero.hp\`. No key, no lookup — the field is simply *part of* the value.`,
    },
    {
      kind: "quiz",
      question: "Given `struct Player { name: String, hp: i32 }`, how do you read the hp field of `hero`?",
      options: ["hero.hp", "hero[\"hp\"]", "hero::hp"],
      answer: 0,
      explain: "Dot notation reaches straight into a field — no lookup, no brackets.",
    },
    {
      kind: "fill",
      prompt: "Complete the struct literal for hero.",
      file: "main.rs",
      before: "let hero = Player { name: String::from(\"Ferrisia\"), ",
      after: " };",
      choices: ["hp: 100", "hp = 100", "100"],
      answer: 0,
      explain: "Every field needs `field: value` inside the literal, separated by commas.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the blueprint in the deepest vault

1. Define \`struct Player { name: String, hp: i32 }\`.
2. Create \`let hero = Player { name: String::from("Ferrisia"), hp: 100 };\`.
3. Print \`Ferrisia has 100 hp\`.

Expected output:

\`\`\`text
Ferrisia has 100 hp
\`\`\``,
    },
  ],

  "rust-standard-library-8": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A blueprint alone is inert — it holds shape, but no behavior. The Hoarder teaches you the rite that wakes it: an \`impl\` block.

\`\`\`rust
impl Player {
    fn new(name: &str) -> Player {
        Player { name: String::from(name), hp: 100 }
    }
}
\`\`\`

\`new\` takes no \`self\` — it doesn't act on an existing Player, it *makes* one. Call it \`Player::new("Ferrisia")\`, with the type name, not a value.`,
    },
    {
      kind: "theory",
      body: `A function that *does* take \`&self\` is a **method** — it acts on one specific instance, called with the dot:

\`\`\`rust
impl Player {
    fn is_alive(&self) -> bool {
        self.hp > 0
    }
}

hero.is_alive();
\`\`\`

And mark the struct \`#[derive(Debug)]\` to let Rust generate a debug view for free — printable with \`{:?}\`, no method required.`,
    },
    {
      kind: "quiz",
      question: "Why doesn't `Player::new(...)` take `&self`?",
      options: [
        "It creates the Player — there's no instance yet to act on",
        "self is optional in every impl block",
        "new is a keyword that never takes arguments",
      ],
      answer: 0,
      explain: "Associated functions like `new` build the value — a method acts on one that already exists.",
    },
    {
      kind: "fill",
      prompt: "Complete the method signature — it needs to read the instance, not consume it.",
      file: "main.rs",
      before: "fn is_alive(",
      after: ") -> bool {\n    self.hp > 0\n}",
      choices: ["&self", "self", "player: &Player"],
      answer: 0,
      explain: "&self borrows the instance so is_alive can read hp without taking ownership of hero.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the rite that wakes the vessel

1. Add \`#[derive(Debug)]\` above \`Player\`.
2. Write \`new(name: &str) -> Player\` and \`is_alive(&self) -> bool\` inside \`impl Player\`.
3. Create \`hero\` with \`Player::new("Ferrisia")\`, print \`alive: {}\` with \`hero.is_alive()\`, then print \`hero\` with \`{:?}\`.

Expected output:

\`\`\`text
alive: true
Player { name: "Ferrisia", hp: 100 }
\`\`\``,
    },
  ],

  /* ───────────────────── Act IV · Option ───────────────────── */

  "mastering-option-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `In most realms, "nothing" is an ambush — a null that crashes you at midnight. The marsh does it differently: **absence is part of the type**.

\`\`\`rust
enum Option<T> {
    Some(T),   // there IS a value, wrapped inside
    None,      // there is nothing — honestly declared
}
\`\`\`

You met Option at the Hoarder's shelf. Now you master it.`,
    },
    {
      kind: "theory",
      body: `A function that might not have an answer says so in its signature:

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

Note: no semicolons on \`Some(7)\` / \`None\` — the \`if/else\` is an expression, and its result is returned.`,
    },
    {
      kind: "quiz",
      question: "Why does `find` return `Option<i32>` instead of plain `i32`?",
      options: [
        "It's honest — there may be no answer, and the type says so",
        "Option is faster than i32",
        "All Rust functions must return Option",
      ],
      answer: 0,
      explain: "The type forces every caller to handle the None case. No midnight ambushes.",
    },
    {
      kind: "fill",
      prompt: "Wrap the found value — villager 7 exists.",
      file: "main.rs",
      before: "if present { ",
      after: "(7) } else { None }",
      choices: ["Some", "Ok", "Value"],
      answer: 0,
      explain: "Some wraps presence; None declares absence. (Ok belongs to Result — next act.)",
    },
    {
      kind: "editor",
      intro: `### Final trial — Some, or None?

Complete \`find\`: if \`present\` is true return \`Some(7)\`, otherwise \`None\` — and remove the \`todo!()\`.

Expected output:

\`\`\`text
Some(7)
\`\`\``,
    },
  ],

  "mastering-option-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`.unwrap()\` rips the value out of an Option:

\`\`\`rust
let x = Some(5).unwrap();   // → 5. fine.
let y = ghost.unwrap();     // ghost is None → 💥 PANIC
\`\`\`

On \`None\`, unwrap **panics** — the whole program drowns. The gravestones in this marsh all say the same thing.`,
    },
    {
      kind: "theory",
      body: `The survivors carry a **default**:

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

You've used this idiom twice already — at the Hoarder's shelf, and it will guard you again in the Soroban fortress. It's the most useful rune in the marsh.`,
    },
    {
      kind: "quiz",
      question: "`let ghost: Option<i32> = None;` — what does `ghost.unwrap()` do?",
      options: [
        "Panics — the program crashes",
        "Returns 0",
        "Returns None",
      ],
      answer: 0,
      explain: "Never unwrap what you haven't checked. The marsh is full of those who did.",
    },
    {
      kind: "fill",
      prompt: "Extract safely: default to 0 if the ghost is None.",
      file: "main.rs",
      before: "let value = ghost.",
      after: "(0);",
      choices: ["unwrap_or", "unwrap", "or_else"],
      answer: 0,
      explain: "unwrap_or never panics — absence becomes your default.",
    },
    {
      kind: "editor",
      intro: `### Final trial — never unwrap blindly

\`ghost\` is \`None\`. Extract a value safely:

1. \`let value = ghost.unwrap_or(0);\` — no \`.unwrap()\` anywhere.
2. Print \`value: {}\`.

Expected output:

\`\`\`text
value: 0
\`\`\``,
    },
  ],

  "mastering-option-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A full \`match\` on an Option works — but when you only care about the \`Some\` case, the marsh has a shortcut:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);
}
\`\`\`

\`if let\` asks and unwraps in one stroke: *if the pattern fits, name the value and enter.*`,
    },
    {
      kind: "theory",
      body: `And it composes with \`else\`, just like a regular \`if\`:

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light is the unwrapped i32
} else {
    println!("darkness");
}
\`\`\`

Inside the first branch, \`light\` is a plain value — no Option, no unwrapping, no danger.`,
    },
    {
      kind: "quiz",
      question: "In `if let Some(light) = lantern { ... }`, what is `light` inside the braces?",
      options: [
        "The unwrapped value — a plain i32",
        "Still an Option<i32>",
        "A boolean",
      ],
      answer: 0,
      explain: "The pattern peeled the Some away — inside, you hold the value itself.",
    },
    {
      kind: "fill",
      prompt: "Ask the lantern: if there's light, take it by name.",
      file: "main.rs",
      before: "if let ",
      after: "(light) = lantern {\n    println!(\"light: {}\", light);\n}",
      choices: ["Some", "Option", "Has"],
      answer: 0,
      explain: "if let Some(light) — the pattern names the wrapped value.",
    },
    {
      kind: "editor",
      intro: `### Final trial — ask the marsh itself

The lantern holds \`Some(3)\`:

1. \`if let Some(light) = lantern\` → print \`light: {}\`
2. \`else\` → print \`darkness\`

Expected output:

\`\`\`text
light: 3
\`\`\``,
    },
  ],

  /* ───────────────────── Act V · Result ───────────────────── */

  "mastering-result-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `The marsh taught you *absence*. The High Court judges **failure** — and failure always states its reason:

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // it worked — here's the value
    Err(E),   // it failed — here's WHY
}
\`\`\`

Where \`Option\` says "nothing", \`Result\` says "here's what went wrong".`,
    },
    {
      kind: "theory",
      body: `A function that can fail returns a Result — and rules explicitly:

\`\`\`rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}
\`\`\`

No crash, no silent wrong answer — a verdict, for the record.`,
    },
    {
      kind: "quiz",
      question: "When should a function return `Result` instead of `Option`?",
      options: [
        "When the caller needs to know WHY it failed",
        "When it never fails",
        "Result and Option are interchangeable",
      ],
      answer: 0,
      explain: "None is silent; Err carries the reason. Courts keep records.",
    },
    {
      kind: "fill",
      prompt: "Rule on the failure: division by zero is an error.",
      file: "main.rs",
      before: "if b == 0 {\n    ",
      after: "(String::from(\"division by zero\"))\n} else {\n    Ok(a / b)\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Err(reason) — failure with the why attached.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the two verdicts

Complete \`divide\` (and remove the \`todo!()\`):

1. \`b == 0\` → \`Err(String::from("division by zero"))\`
2. Otherwise → \`Ok(a / b)\`

Expected output:

\`\`\`text
Ok(5)
\`\`\``,
    },
  ],

  "mastering-result-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A sealed verdict arrives. You don't guess — you \`match\`, and the compiler makes sure **both** outcomes are handled:

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

The patterns unwrap as they match: \`v\` is the value, \`e\` is the reason.`,
    },
    {
      kind: "theory",
      body: `Over the courtroom door: \`#[must_use]\`.

It means Rust **warns you** if you receive a Result and ignore it — an unread verdict is a bug waiting to happen. Every Result must be read, matched, or deliberately passed along. The Court forgets nothing.`,
    },
    {
      kind: "quiz",
      question: "What does the compiler do if you call a Result-returning function and ignore the verdict?",
      options: [
        "Warns you — Result is #[must_use]",
        "Nothing — ignoring is fine",
        "Refuses to compile, always",
      ],
      answer: 0,
      explain: "The unused-Result warning is the Court's motto enforced in code.",
    },
    {
      kind: "fill",
      prompt: "Handle the failure arm — unwrap the reason as `e`.",
      file: "main.rs",
      before: "match verdict {\n    Ok(v) => println!(\"granted: {}\", v),\n    ",
      after: "(e) => println!(\"denied: {}\", e),\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Ok and Err — both arms, both handled. The compiler accepts nothing less.",
    },
    {
      kind: "editor",
      intro: `### Final trial — reading the judgment

The court hands you \`Ok(42)\`. Match both verdicts:

1. \`Ok(v)\` → print \`granted: {}\`
2. \`Err(e)\` → print \`denied: {}\`

Expected output:

\`\`\`text
granted: 42
\`\`\``,
    },
  ],

  "mastering-result-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Matching every Result where it happens buries your logic in ceremony. Some courts don't rule — they **pass the case upward**.

The smallest rune in the realm:

\`\`\`rust
let n = parse("21")?;
\`\`\`

That \`?\` means: *on Ok, unwrap and continue. On Err, return the error to my caller — right now.*`,
    },
    {
      kind: "theory",
      body: `One condition: \`?\` only works inside a function that **itself returns Result** — the error needs somewhere to go:

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // Err would exit here, upward
    Ok(n * 2)               // happy path stays clean
}
\`\`\`

This is how real Rust code stays readable: errors flow uphill, logic stays flat.`,
    },
    {
      kind: "theory",
      body: `One more rune sits in the \`parse\` helper you're given, already written:

\`\`\`rust
text.parse().map_err(|_| String::from("not a number"))
\`\`\`

\`|_| String::from("not a number")\` is a **closure** — a small, anonymous function. The \`_\` means "take the argument, I don't need it"; the body is what the closure hands back. You don't need to write one yet — just know \`map_err\` calls it only when there's an \`Err\` to translate.`,
    },
    {
      kind: "quiz",
      question: "What does `?` do when the Result is `Err`?",
      options: [
        "Returns the Err from the current function immediately",
        "Panics",
        "Converts it to None",
      ],
      answer: 0,
      explain: "One mark, and the judgment flows uphill to whoever called you.",
    },
    {
      kind: "fill",
      prompt: "Propagate: unwrap on Ok, return upward on Err.",
      file: "main.rs",
      before: "let n = parse(\"21\")",
      after: ";\nOk(n * 2)",
      choices: ["?", ".unwrap()", "!"],
      answer: 0,
      explain: "? propagates; unwrap panics. In court, you never panic.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the mark of propagation

Complete \`double_first\` (and remove the \`todo!()\`):

1. \`let n = parse("21")?;\`
2. Return \`Ok(n * 2)\`.

Expected output:

\`\`\`text
Ok(42)
\`\`\``,
    },
  ],

  /* ───────────────── Act VI · Stellar 101 (conceptual) ───────────────── */

  "stellar-101-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Welcome to the sky, Forgeborn. **Stellar** is a public ledger — a shared book of accounts that no single power controls, settling payments in ~5 seconds.

Every actor on it is an **account** (a star-keep), controlled by a **keypair**: two keys, born together, with opposite duties.`,
    },
    {
      kind: "theory",
      body: `The two keys:

- **Public key** — starts with \`G\`. Your address. Shout it from the towers; it's how others find and pay you.
- **Secret key** — starts with \`S\`. Signs everything you do. **Never** share it, never paste it, never commit it. Lose it → the account is gone forever. No support desk in the sky.

And to exist on the ledger at all, an account holds a minimum **base reserve: 1 XLM**.`,
    },
    {
      kind: "quiz",
      question: "Someone asks for your address to send you lumens. Which key do you give?",
      options: [
        "The G... public key — that's what it's for",
        "The S... secret key — it proves you own the account",
        "Both, to be safe",
      ],
      answer: 0,
      explain: "G is for sharing. S signs — anyone holding it OWNS your account.",
    },
    {
      kind: "quiz",
      question: "You lose your secret key (S...). What now?",
      options: [
        "The account is unrecoverable — nothing can sign for it again",
        "Stellar support can reset it",
        "The public key can regenerate it",
      ],
      answer: 0,
      explain: "No custodian, no reset. The seed IS the ownership — guard it with your life.",
    },
    {
      kind: "fill",
      prompt: "Fill the charter: which sigil starts a **public** key?",
      file: "star-chart.toml",
      before: "public_key_starts_with = \"",
      after: "\"",
      choices: ["G", "S", "X"],
      answer: 0,
      explain: "G for the address you share; S for the seed you guard.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the star-keep charter

Complete the charter: the two sigils, and the base reserve (in XLM) an account needs to exist.

Expected output:

\`\`\`text
star-keep chartered ✓
\`\`\``,
    },
  ],

  "stellar-101-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `The sky's native currency is the **lumen (XLM)**. Its smallest spark is the **stroop**:

\`\`\`text
1 XLM = 10,000,000 stroops
\`\`\`

Ten million. All amounts on the ledger are really counted in stroops — the decimals are for humans.`,
    },
    {
      kind: "theory",
      body: `Every transaction pays a small toll — the **base fee: 100 stroops** (0.00001 XLM).

It's not revenue. It's anti-spam: expensive enough to stop anyone flooding the sky with noise, cheap enough that a million real payments cost about a dollar. When traffic surges, fees rise briefly — an auction for space.`,
    },
    {
      kind: "quiz",
      question: "Roughly what does sending a payment on Stellar cost?",
      options: [
        "100 stroops — a hundredth of a cent",
        "1 XLM per payment",
        "A percentage of the amount sent",
      ],
      answer: 0,
      explain: "Flat, tiny, anti-spam. The amount you send doesn't change the toll.",
    },
    {
      kind: "fill",
      prompt: "How many stroops make one lumen?",
      file: "star-chart.toml",
      before: "stroops_per_lumen = ",
      after: "",
      choices: ["10_000_000", "1_000", "100"],
      answer: 0,
      explain: "Ten million sparks per lumen.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the toll of the gate

Fill in the plaque: stroops per lumen, and the base fee in stroops.

Expected output:

\`\`\`text
toll paid ✓
\`\`\``,
    },
  ],

  "stellar-101-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `The sky carries more than lumens. **Any account can issue an asset** — dollars, gold, tickets, points. An asset is defined by two things together:

- an **asset code**: \`USDC\`, \`EURC\`, ...
- its **issuer**: the \`G...\` account that created it

Same code, different issuer → different asset entirely. The issuer IS the identity.`,
    },
    {
      kind: "theory",
      body: `But here's the sky's rule of consent: your account can't hold an asset it hasn't explicitly accepted.

A **trustline** is that acceptance — a bridge you open from your account to one asset from one issuer:

\`\`\`text
trustline = "I accept USDC, issued by G...CENTRE"
\`\`\`

No trustline, no balance — payments in that asset simply can't reach you. (Each open trustline also raises your reserve slightly.)`,
    },
    {
      kind: "quiz",
      question: "Someone sends you USDC but you never opened a trustline to it. What happens?",
      options: [
        "The payment fails — no bridge, no cargo",
        "It arrives as XLM instead",
        "It waits in a pending queue",
      ],
      answer: 0,
      explain: "The sky takes consent seriously: you hold nothing you didn't accept.",
    },
    {
      kind: "quiz",
      question: "Two assets both named USDC, from two different issuers. Are they the same asset?",
      options: [
        "No — code + issuer define the asset; the issuer is the identity",
        "Yes — the code is what matters",
        "Only if they have the same price",
      ],
      answer: 0,
      explain: "Anyone can name an asset USDC. WHO issued it is what you trust.",
    },
    {
      kind: "fill",
      prompt: "The issuer of an asset is always... what kind of thing?",
      file: "star-chart.toml",
      before: "asset_issuer_starts_with = \"",
      after: "\"   # issuers are accounts",
      choices: ["G", "S", "USD"],
      answer: 0,
      explain: "Issuers are accounts — identified by their public G... key.",
    },
    {
      kind: "editor",
      intro: `### Final trial — open the light-bridge

Fill in the trustline for **USDC**: the asset code, and the sigil every issuer address starts with.

Expected output:

\`\`\`text
light-bridge opened ✓
\`\`\``,
    },
  ],

  "stellar-101-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Everything converges. A **payment operation** needs exactly three things:

1. **destination** — the receiving account (\`G...\`)
2. **asset** — what you're sending (\`XLM\` for the native lumen)
3. **amount** — how much

You sign it with your secret key, pay the ~100-stroop toll, and in ~5 seconds it is **final**. No banks. No business days. No borders.`,
    },
    {
      kind: "theory",
      body: `The full journey of your payment:

\`\`\`text
build the operation
  → sign with your S... key
    → submit to the network
      → validators agree (~5s)
        → final. forever. on the ledger.
\`\`\`

This is the sky the Beholder broke — and the one you're about to relight. After this Gate: Soroban, where the ledger runs *your* Rust.`,
    },
    {
      kind: "quiz",
      question: "What makes a payment operation valid to submit?",
      options: [
        "It's signed with the sender's secret key",
        "The destination approves it first",
        "A bank clears it within 2 business days",
      ],
      answer: 0,
      explain: "The signature is the authority — that's why the S... key is sacred.",
    },
    {
      kind: "fill",
      prompt: "Chart the cargo: the native asset's code.",
      file: "star-chart.toml",
      before: "asset = \"",
      after: "\"",
      choices: ["XLM", "USD", "STR"],
      answer: 0,
      explain: "XLM — the lumen, the sky's native asset.",
    },
    {
      kind: "editor",
      intro: `### Final trial — first light across the sky

Chart the payment: destination sigil, native asset code, and send **25**.

Expected output:

\`\`\`text
lumens flowing ✓
\`\`\``,
    },
  ],

  /* ───────────────── Act VII · Soroban (assumes Rust mastery) ───────────────── */

  "soroban-smart-contracts-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Before the Gate, in the Hoarder's vault, you learned the rite of \`struct\` and \`impl\` — a blueprint, and the maker that gives it life. Nothing beyond the Gate is different in kind.

\`\`\`rust
#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract { /* ... */ }
\`\`\`

\`#[contract]\` and \`#[contractimpl]\` are marks the ledger's host reads on top of that same struct and impl — not new syntax, the same shape with a seal pressed into it.`,
    },
    {
      kind: "theory",
      body: `Forgeborn, the rules change beyond the Gate. A **Soroban contract** is a Rust library compiled to WASM and stored on the Stellar ledger — where anyone can invoke it.

\`\`\`rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env};
\`\`\`

\`#![no_std]\` is not decoration: there is no OS, no allocator, no \`std\` on-chain. The ledger is the machine, and the \`soroban_sdk\` is your standard library now.`,
    },
    {
      kind: "theory",
      body: `Two attributes turn plain Rust into a contract:

\`\`\`rust
#[contract]
pub struct HelloContract;      // the contract's identity

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env) -> Symbol { ... }
}
\`\`\`

\`#[contractimpl]\` exports every \`pub fn\` as an invocable entry point. Each takes \`Env\` first — your handle to storage, events, and other contracts.`,
    },
    {
      kind: "theory",
      body: `On-chain, every byte is rent. Strings are heavy — so short identifiers use \`Symbol\`, a compact on-ledger type:

\`\`\`rust
use soroban_sdk::{symbol_short, Symbol};

let s: Symbol = symbol_short!("beacon");  // ≤ 9 chars, [a-zA-Z0-9_]
\`\`\`

Where a web dev returns \`"ok"\`, a Soroban dev returns \`symbol_short!("ok")\`.`,
    },
    {
      kind: "quiz",
      question: "Why does a Soroban contract start with `#![no_std]`?",
      options: [
        "There's no OS or allocator on-chain — the full std can't exist there",
        "It makes compilation faster",
        "It's optional style — std works fine on-chain",
      ],
      answer: 0,
      explain: "WASM on the ledger has no operating system beneath it. The SDK replaces std.",
    },
    {
      kind: "fill",
      prompt: "Export the impl block as the contract's public interface.",
      file: "lib.rs",
      before: "#[contract]\npub struct HelloContract;\n\n",
      after: "\nimpl HelloContract {\n    pub fn hello(env: Env) -> Symbol { /* ... */ }\n}",
      choices: ["#[contractimpl]", "#[contract]", "#[export]"],
      answer: 0,
      explain: "#[contract] marks the struct; #[contractimpl] exports the functions.",
    },
    {
      kind: "editor",
      intro: `### Final trial — carve the first sky-rune

1. Mark the impl block with \`#[contractimpl]\`.
2. Make \`hello\` return \`symbol_short!("beacon")\` — and remove the \`todo!()\`.

Expected invocation:

\`\`\`text
hello() → Symbol(beacon)
\`\`\``,
    },
  ],

  "soroban-smart-contracts-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Contracts hold **no memory between invocations** — every local variable dies when the call returns. State lives in the **ledger**, behind \`env.storage()\`.

For contract-wide state (counters, config, admin), the right shelf is **instance storage**:

\`\`\`rust
env.storage().instance()
\`\`\`

It shares the contract's own lifetime — archived and restored together.`,
    },
    {
      kind: "theory",
      body: `Reading and writing are symmetric, and everything passes **by reference**:

\`\`\`rust
const COUNTER: Symbol = symbol_short!("COUNTER");

let count: u32 = env.storage().instance()
    .get(&COUNTER)
    .unwrap_or(0);

env.storage().instance().set(&COUNTER, &count);
\`\`\`

\`get\` returns an \`Option<T>\` — the key may never have been written, or its rent (TTL) may have expired. \`unwrap_or(0)\` is the counter idiom.`,
    },
    {
      kind: "quiz",
      question: "Why does `storage().get(&KEY)` return an `Option<T>` instead of `T`?",
      options: [
        "The key may never have been written — or its TTL expired",
        "All SDK functions return Option for consistency",
        "To force error handling on type mismatches",
      ],
      answer: 0,
      explain: "Ledger storage is rented, not owned. Absence is a normal state — handle it.",
    },
    {
      kind: "fill",
      prompt: "Default to 0 when the counter has never been written.",
      file: "lib.rs",
      before: "let count: u32 = env.storage().instance().get(&COUNTER).",
      after: ";",
      choices: ["unwrap_or(0)", "unwrap()", "expect(\"0\")"],
      answer: 0,
      explain: "unwrap() would panic on first call — unwrap_or(0) makes absence a starting point.",
    },
    {
      kind: "editor",
      intro: `### Final trial — make the ledger remember

Implement \`increment\`:

1. Read the count from instance storage under \`&COUNTER\` — default \`0\`.
2. Add \`1\`.
3. \`set(&COUNTER, &count)\` to write it back.
4. Return the new count (and remove the \`todo!()\`).

Expected invocation:

\`\`\`text
increment() → 1
\`\`\``,
    },
  ],

  "soroban-smart-contracts-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Anyone can invoke a public contract function, passing **any** \`Address\` as an argument. So how does a vault know the caller really is who they claim?

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    from.require_auth();   // ← the seal
    // ...
}
\`\`\`

\`require_auth()\` verifies that \`from\` actually **signed** (or pre-authorized) this exact invocation. If not, the call **traps** — reverted, state untouched.`,
    },
    {
      kind: "theory",
      body: `This is the line whose absence built the Beholder's fortress. Without it:

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    // no require_auth ← anyone passes YOUR address and drains you
}
\`\`\`

The rule of the realm: **any function that moves value or changes someone's state requires their auth — first line, before anything else.**`,
    },
    {
      kind: "quiz",
      question: "What happens when `from.require_auth()` fails?",
      options: [
        "The invocation traps — everything reverts, state untouched",
        "It returns false and the function continues",
        "It logs a warning on the ledger",
      ],
      answer: 0,
      explain: "Auth failure is not a condition to handle — it kills the invocation outright.",
    },
    {
      kind: "fill",
      prompt: "Seal the vault: demand the signer's authorization.",
      file: "lib.rs",
      before: "pub fn withdraw(env: Env, from: Address, amount: i128) {\n    from.",
      after: ";\n    // transfer logic...\n}",
      choices: ["require_auth()", "verify()", "is_signed()"],
      answer: 0,
      explain: "require_auth() — the most important line in Soroban.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the seal of the signer

Guard the vault: in \`withdraw\`, require authorization from \`from\` **before** anything else.

One line. The Beholder fell for the lack of it.

Expected invocation:

\`\`\`text
withdraw: authorized ✓
\`\`\``,
    },
  ],

  // ---- Act VIII — Stellar Protocol 27 ("The Zipper") -----------------------

  "stellar-protocol-27-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `The Beholder is gone — and the sky itself is changing. Stellar upgrades **by consensus**: validators vote to arm a new protocol version, and at a scheduled ledger the *entire network* switches at once. No forks, no stragglers.

That's what a **protocol upgrade** is: one coordinated turning of the sky.`,
    },
    {
      kind: "theory",
      body: `**Protocol 27**, codename **"Zipper"**, is the 2026 upgrade — and its timeline already played out:

- Stellar Core stable — **June 5, 2026**
- SDKs — June 5–11 · RPC & Galexie — June 10 · Horizon — June 12
- **Testnet upgraded — June 18, 2026**
- **Mainnet vote — July 8, 2026**

The full plan lives in the official [Protocol 27 upgrade guide](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide).`,
    },
    {
      kind: "theory",
      body: `What does the Zipper actually change? Both headline features live in [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md):

1. **Authentication delegation** — custom accounts can hand their auth check to another contract.
2. **Address-bound signatures** — a seal that only opens its own door.

(Earlier upgrades shipped CAP-0055, 0060, 0064 — the Zipper is about how accounts *prove who they are*.) Track live component versions at [Software Versions](https://developers.stellar.org/docs/networks/software-versions).`,
    },
    {
      kind: "quiz",
      question: "How does a Stellar protocol upgrade take effect?",
      options: [
        "Validators vote to arm it; at the scheduled ledger the whole network switches at once",
        "Each node upgrades whenever it wants and versions coexist",
        "The Foundation flips a switch on its own servers",
      ],
      answer: 0,
      explain: "Consensus, not decree: the vote arms it, one ledger turns the whole sky.",
    },
    {
      kind: "quiz",
      question: "When did the Protocol 27 Mainnet vote take place?",
      options: ["July 8, 2026", "June 18, 2026", "It hasn't happened yet"],
      answer: 0,
      explain: "Testnet turned June 18; Mainnet voted July 8, 2026. The Zipper is live.",
    },
    {
      kind: "fill",
      prompt: "Arm the beacon with the version the validators voted in.",
      file: "lib.rs",
      before: "pub const PROTOCOL_VERSION: u32 = ",
      after: ";",
      choices: ["27", "26", "28"],
      answer: 0,
      explain: "Protocol 27 — the Zipper. (28 is where V1 credentials go to die.)",
    },
    {
      kind: "editor",
      intro: `### Final trial — light the upgrade beacon

Record the facts of the reforging:

1. \`PROTOCOL_VERSION\` — the version the network voted in.
2. \`CODENAME\` — lowercase.
3. \`MAINNET_VOTE\` — \`YYYY-MM-DD\`.

Expected:

\`\`\`text
beacon lit: protocol 27 (zipper) ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `In the Lair you sealed a vault with \`require_auth()\`. But who *verifies* the seal?

For a normal account, the protocol checks an ed25519 signature against the account's keys. But an \`Address\` in Soroban can also belong to a **contract** — and then something remarkable happens.`,
    },
    {
      kind: "theory",
      body: `When \`require_auth\` fires for a contract-owned \`Address\`, the host invokes that contract's own entry point:

\`\`\`rust
pub fn __check_auth(
    env: Env,
    signature_payload: Hash<32>,
    signatures: ...,
    auth_contexts: Vec<Context>,
) { ... }
\`\`\`

The account **is** a contract, and \`__check_auth\` is its private law of signatures. Approve by returning; reject by trapping.`,
    },
    {
      kind: "theory",
      body: `Every **custom account** is just a different \`__check_auth\`:

- **Multisig** — require 2 of 3 signatures
- **Social recovery** — let trusted friends rotate a lost key
- **Passkeys** — verify a WebAuthn signature instead of ed25519
- **Account abstraction** — any rule you can write in Rust

Builders like OpenZeppelin were already forging these; [Protocol 27 makes the hard parts first-class](https://developers.stellar.org/meetings/2026/04/30#protocol-discussion-modular-custom-accounts-and-signature-security-in-protocol-27).`,
    },
    {
      kind: "quiz",
      question: "Who invokes `__check_auth`?",
      options: [
        "The Soroban host, whenever require_auth fires for an Address owned by a custom account contract",
        "The user, manually, before each transaction",
        "The compiler, at build time",
      ],
      answer: 0,
      explain: "It's the host's callback: your contract becomes the judge of its own seals.",
    },
    {
      kind: "fill",
      prompt: "Name the entry point the host calls on a custom account.",
      file: "lib.rs",
      before: "impl GuardianAccount {\n    pub fn ",
      after: "(env: Env, payload: Hash<32>, sig: BytesN<64>, ctx: Vec<Context>) {",
      choices: ["__check_auth", "check_auth", "require_auth"],
      answer: 0,
      explain: "Double underscore: __check_auth is the reserved name the host looks for.",
    },
    {
      kind: "editor",
      intro: `### Final trial — the account writes its own law

1. Export the impl block with \`#[contractimpl]\`.
2. Rename the placeholder to the entry point the host actually calls.

Expected:

\`\`\`text
__check_auth: the account writes its own law ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A crown that guards every vault alone soon breaks. Real accounts want to say: *"let my steward vouch for me."*

Before the Zipper there was no protocol support for that — builders faked delegation with fragile rounds of **pre-simulation** to propagate the auth context. It worked. Barely. Sometimes.`,
    },
    {
      kind: "theory",
      body: `Protocol 27 (CAP-0071-01) makes delegation law with two new host functions:

\`\`\`rust
// inside __check_auth ONLY:
delegate_account_auth(&delegate, &payload);

// and for the contract being called:
get_delegated_signers_for_current_auth_check()
\`\`\`

The first hands the current auth check to the delegate's own signature logic. The second reveals which delegated signers approved.`,
    },
    {
      kind: "theory",
      body: `The wire format got a matching upgrade: the credential type \`SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES\` bundles delegated signers and their signatures into **one** authorization entry.

Smaller transactions, simpler simulation — delegation goes from fragile workaround to supported pattern. Full spec: [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) · [CAP-71 recap](https://developers.stellar.org/meetings/2026/04/30#cap-71-recap-authentication-delegation-for-custom-accounts).`,
    },
    {
      kind: "quiz",
      question: "What does `delegate_account_auth` let a custom account do?",
      options: [
        "Hand the current auth check to a delegate contract's own signature logic",
        "Transfer ownership of the account permanently",
        "Skip signature verification entirely",
      ],
      answer: 0,
      explain: "The crown stays yours — only the *check* is handed to the steward, per call.",
    },
    {
      kind: "fill",
      prompt: "Hand this auth check to the stored steward — the Protocol 27 way.",
      file: "lib.rs",
      before: "// inside __check_auth:\n",
      after: "(&delegate, &signature_payload);",
      choices: ["delegate_account_auth", "require_auth", "get_delegated_signers_for_current_auth_check"],
      answer: 0,
      explain: "delegate_account_auth — callable only inside __check_auth, new in Protocol 27.",
    },
    {
      kind: "editor",
      intro: `### Final trial — delegate the crown

The steward's \`Address\` is already loaded. Call \`delegate_account_auth\` with the delegate and the signature payload — and remove the \`todo!()\`.

Expected:

\`\`\`text
crown delegated: steward honored ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `A **replay attack** is an old trick with a new name: take something valid — a signature, a stamped seal, a ticket stub — and reuse it somewhere it was never meant to work. The signer never agreed to the second use. The seal itself has no memory; it can't tell it's being asked twice.`,
    },
    {
      kind: "theory",
      body: `The Echo Wraith's version needs three things at once:

1. An admin-style contract that **doesn't name the signer's address** in the signed payload.
2. The admin gets **rotated** to a different address…
3. …and both addresses share the **same private key**.

Then a seal made for the old door opens the new one. Duplicate mints. Unauthorized moves.`,
    },
    {
      kind: "theory",
      body: `This exact combination has **never occurred on-chain** — but the blast radius justified a protocol fix.

**\`SOROBAN_CREDENTIALS_ADDRESS_V2\`** (CAP-0071-02) binds the signature payload to the address it was made for. A stolen echo no longer matches a different door.

The old \`SOROBAN_CREDENTIALS_ADDRESS\` stays valid **until Protocol 28** — a migration window, not a cliff.`,
    },
    {
      kind: "theory",
      body: `Until you migrate, there's an interim safeguard for admin-style contracts: **include the signer's address in the payload yourself** — then rotation with a shared key can't be echoed.

\`\`\`rust
let me: Address = env.current_contract_address();
// append \`me\` to the signed material
\`\`\`

Watch the deep dive: [Stellar Developer Meeting — signature security](https://www.youtube.com/watch?v=5O1cDDGv7_o).`,
    },
    {
      kind: "quiz",
      question: "What attack do V2 credentials close?",
      options: [
        "Replaying a valid signature payload against a different account that shares the same signing key",
        "Brute-forcing ed25519 private keys",
        "Front-running transactions before they reach the ledger",
      ],
      answer: 0,
      explain: "Address-bound payloads: the seal names its door, so the echo dies.",
    },
    {
      kind: "quiz",
      question: "How long does the old SOROBAN_CREDENTIALS_ADDRESS remain valid?",
      options: [
        "Until the Protocol 28 upgrade",
        "It stopped working the moment Protocol 27 activated",
        "Forever — V2 is optional",
      ],
      answer: 0,
      explain: "A migration window: adopt V2 at your own pace, but before Protocol 28.",
    },
    {
      kind: "fill",
      prompt: "Speak the credential that binds the seal to its door.",
      file: "lib.rs",
      before: "pub const CREDENTIALS: &str = \"SOROBAN_CREDENTIALS_",
      after: "\";",
      choices: ["ADDRESS_V2", "ADDRESS", "ADDRESS_WITH_DELEGATES"],
      answer: 0,
      explain: "V2 = address-bound payloads. (WITH_DELEGATES is the delegation bundle from VIII.3.)",
    },
    {
      kind: "editor",
      intro: `### Final trial — bind the seal

1. Upgrade \`CREDENTIALS\` to the V2 name.
2. Record until which protocol V1 stays valid.
3. In \`binding_address\`, return this contract's own \`Address\` via \`env.current_contract_address()\` — remove the \`todo!()\`.

Expected:

\`\`\`text
seal bound to its door: the echo dies ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Nothing crosses into the reforged sky unchanged. The release caravan traveled in strict order:

**Core → SDKs → RPC & Galexie → Horizon → Testnet → Mainnet**

Every SDK — Rust, JavaScript, Go, Java, Python, iOS, PHP, .NET, Flutter, Elixir — shipped a Protocol-27 release. All of them must be upgraded before Mainnet turns. Check yours against [Software Versions](https://developers.stellar.org/docs/networks/software-versions).`,
    },
    {
      kind: "theory",
      body: `The one **breaking change** most apps feel — recorded here as a fact, not a rewrite:

\`\`\`rust
// before the Zipper, JS apps imported from "@stellar/stellar-base"
// after — the base package was consolidated into "@stellar/stellar-sdk"
pub const JS_XDR_PACKAGE: &str = "@stellar/stellar-sdk";
\`\`\`

Whatever SDK you ship in, the caravan moves on. The rest of the migration notes live in the [official guidance](https://developers.stellar.org/meetings/2026/04/30#migration-guidance).`,
    },
    {
      kind: "theory",
      body: `The Forgeborn's migration checklist:

1. **Upgrade every SDK** and client library.
2. **Rename** \`stellar-base\` imports to \`stellar-sdk\`.
3. **Plan the V2 credential move** before Protocol 28.
4. **Node operators**: Core, RPC, Galexie, Horizon — all upgraded before the vote.

The [upgrade guide](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide) has the full manifest.`,
    },
    {
      kind: "quiz",
      question: "Your JS app imports from `@stellar/stellar-base`. After Protocol 27…",
      options: [
        "Change the import — the package was consolidated into @stellar/stellar-sdk",
        "Nothing changes; it still ships separately",
        "You must rewrite the app in Rust",
      ],
      answer: 0,
      explain: "One rename. The base package rode into the sdk and didn't come back out.",
    },
    {
      kind: "fill",
      prompt: "Record the package that crossed the Gate.",
      file: "lib.rs",
      before: "pub const JS_XDR_PACKAGE: &str = \"@stellar/stellar-",
      after: "\";",
      choices: ["sdk", "base", "core"],
      answer: 0,
      explain: "stellar-base was consolidated into stellar-sdk in the Protocol 27 releases.",
    },
    {
      kind: "editor",
      intro: `### Final trial — clear the caravan manifest

1. \`JS_XDR_PACKAGE\` — the package that absorbed the old base.
2. \`TESTNET_UPGRADE\` — \`YYYY-MM-DD\`.
3. \`UPGRADE_ALL_SDKS\` — does *every* SDK cross the Gate?

Expected:

\`\`\`text
caravan cleared the Gate: nothing left behind ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `The Wraith comes for your vault carrying a stolen seal and a perfect echo. Lay out what you've forged across the Rewritten Sky:

- \`__check_auth\` — your account's own law (VIII.2)
- \`delegate_account_auth\` — the steward crown (VIII.3)
- address-bound seals — the echo-killer (VIII.4)

Time to combine all three into one account.`,
    },
    {
      kind: "theory",
      body: `The \`ZipperAccount\` plan, inside \`__check_auth\`:

\`\`\`rust
// 1) the root signer's public key, from storage:
let signer: BytesN<32> = env.storage().instance().get(&SIGNER).unwrap();

// 2) a bad seal must trap:
env.crypto().ed25519_verify(&signer, &payload.into(), &signature);

// 3) the Protocol 27 stroke — hand the rest to the steward:
delegate_account_auth(...)
\`\`\`

Signature first, delegation second. The Wraith's echo dies at step 2; a forged steward dies at step 3.`,
    },
    {
      kind: "quiz",
      question: "Inside `__check_auth`, what defeats the Echo Wraith's replay?",
      options: [
        "Verifying a payload bound to this account — a stolen echo won't match another address",
        "Signing twice as fast as the Wraith",
        "Calling require_auth on yourself, recursively",
      ],
      answer: 0,
      explain: "Bound seals + verified signatures: the echo has no door left to open.",
    },
    {
      kind: "fill",
      prompt: "A bad seal must trap — verify the signature over the payload.",
      file: "lib.rs",
      before: "env.crypto().",
      after: "(&signer, &signature_payload.into(), &signature);",
      choices: ["ed25519_verify", "sha256", "delegate_account_auth"],
      answer: 0,
      explain: "ed25519_verify traps on a bad signature — exactly what a seal check should do.",
    },
    {
      kind: "editor",
      intro: `### The Wraith's last echo

Inside \`__check_auth\`:

1. Load the root signer (\`BytesN<32>\`) from storage under \`SIGNER\`.
2. Verify the ed25519 signature over the payload — \`env.crypto().ed25519_verify(...)\`.
3. Load the steward under \`DELEGATE\` and call \`delegate_account_auth\`.

Export the impl block. No \`todo!()\` survives the finale.

Expected:

\`\`\`text
__check_auth: signature verified, steward honored — the echo is silent ✓
\`\`\``,
    },
  ],
};

export function getLessonSteps(slug: string): LessonStep[] | undefined {
  return steps[slug];
}
