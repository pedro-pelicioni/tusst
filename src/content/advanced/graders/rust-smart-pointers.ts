import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Smart Pointers & Interior Mutability — hidden grading data.

export const rustSmartPointersGraders: Record<string, AdvancedLessonContent> = {
  "rust-smart-pointers-1": {
    instructions: `## An expression tree

\`Box<T>\` is one heap allocation with one owner. Its defining use is giving a recursive type a **known size** — a box is one pointer wide whatever it points to, so the size computation terminates.

### Your task

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`
2. \`fn eval(e: &Expr) -> i64\` matching both variants and recursing on \`Add\`.
3. Build \`2 + (3 + 4)\` as a tree, print the evaluated value, then print the tree with \`{:?}\`.

Expected output:

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

\`Box\`'s \`Debug\` is transparent — it prints what it points to, not the box.

### Hints

- In \`match e\`, the \`Num(n)\` arm binds \`n: &i64\`, so return \`*n\`.
- The \`Add(a, b)\` arm binds \`&Box<Expr>\`, which coerces to \`&Expr\` at the recursive call.
`,
    starterCode: `#[derive(Debug)]
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),
}

fn eval(e: &Expr) -> i64 {
    // match and recurse
}

fn main() {
    // build 2 + (3 + 4), evaluate, print the tree
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the recursive variant is boxed",
        kind: "expr_present",
        expr: "Box::new",
      },
      {
        name: "eval walks the tree by reference",
        kind: "fn_defined",
        fn: "eval",
        params: [{ name: "e", ty: "&Expr" }],
        returns: "i64",
      },
      {
        name: "recurses through both branches",
        kind: "expr_present",
        expr: "eval(a) + eval(b)",
      },
      { name: "matches on the expression", kind: "match_on", scrutinee: "e" },
    ],
    expectedOutput: "value: 9\ntree: Add(Num(2), Add(Num(3), Num(4)))\n",
    referenceSolution: `#[derive(Debug)]
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),
}

fn eval(e: &Expr) -> i64 {
    match e {
        Expr::Num(n) => *n,
        Expr::Add(a, b) => eval(a) + eval(b),
    }
}

fn main() {
    let tree = Expr::Add(
        Box::new(Expr::Num(2)),
        Box::new(Expr::Add(Box::new(Expr::Num(3)), Box::new(Expr::Num(4)))),
    );

    println!("value: {}", eval(&tree));
    println!("tree: {:?}", tree);
}
`,
  },

  "rust-smart-pointers-2": {
    instructions: `## Count the owners

\`Rc<T>\` is reference-counted shared ownership for a **single thread**. \`Rc::clone\` bumps a counter; the value is freed when it reaches zero.

Write \`Rc::clone(&x)\`, not \`x.clone()\` — it says at the call site that this is a counter bump, not a deep copy.

### Your task

1. Wrap a \`String\` holding \`timeout=30s\` in an \`Rc\`, print \`Rc::strong_count\`.
2. Make two clones with \`Rc::clone\`, print the count again, and print the value through one of them.
3. \`drop\` one clone and print the count once more.

Expected output:

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\`

### Hints

- \`use std::rc::Rc;\`
- \`Rc::strong_count(&config)\` takes a reference.
`,
    starterCode: `use std::rc::Rc;

fn main() {
    // wrap, clone twice, print, drop one
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "shares one allocation behind an Rc",
        kind: "expr_present",
        expr: 'Rc::new(String::from("timeout=30s"))',
      },
      {
        name: "clones through the associated function",
        kind: "expr_present",
        expr: "Rc::clone(&config)",
      },
      {
        name: "reads the strong count",
        kind: "expr_present",
        expr: "Rc::strong_count(&config)",
      },
      { name: "releases one owner early", kind: "expr_present", expr: "drop(b)" },
    ],
    expectedOutput:
      "count: 1\nafter clones: 3\nvalue: timeout=30s\nafter drop: 2\n",
    referenceSolution: `use std::rc::Rc;

fn main() {
    let config = Rc::new(String::from("timeout=30s"));
    println!("count: {}", Rc::strong_count(&config));

    let a = Rc::clone(&config);
    let b = Rc::clone(&config);
    println!("after clones: {}", Rc::strong_count(&config));
    println!("value: {}", a);

    drop(b);
    println!("after drop: {}", Rc::strong_count(&config));
}
`,
  },

  "rust-smart-pointers-3": {
    instructions: `## Borrowing, checked at runtime

\`RefCell<T>\` keeps the borrow rules and moves the *check* to runtime, where a violation **panics**. That is what allows mutation through a \`&self\` — interior mutability — and what makes \`Rc<RefCell<T>>\` a shared, writable value.

Keep guards short: \`cell.borrow_mut().push(x)\` releases at the end of the statement, while \`let g = cell.borrow_mut();\` holds to the end of the scope.

### Your task

1. Build \`Rc<RefCell<Vec<String>>>\` holding an empty vector.
2. Through a **clone** of the \`Rc\`, push \`started\` then \`ready\` — each its own statement.
3. Print the length, then the first entry.
4. Hold a shared borrow in a binding, print whether \`try_borrow_mut()\` succeeds, \`drop\` the binding, and print it again.

Expected output:

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\`

### Hints

- \`use std::cell::RefCell;\` and \`use std::rc::Rc;\`
- \`RefCell::new(Vec::<String>::new())\` annotates the empty vector.
`,
    starterCode: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    // shared, writable log
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "mutates through a shared handle",
        kind: "method_called",
        method: "borrow_mut",
        receiver: "writer",
      },
      {
        name: "shares the cell through an Rc clone",
        kind: "expr_present",
        expr: "Rc::clone(&log)",
      },
      {
        name: "probes the borrow without panicking",
        kind: "method_called",
        method: "try_borrow_mut",
        receiver: "log",
      },
      {
        name: "releases the shared guard explicitly",
        kind: "expr_present",
        expr: "drop(held)",
      },
    ],
    expectedOutput:
      "entries: 2\nfirst: started\nmut while shared: false\nmut after release: true\n",
    referenceSolution: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let log = Rc::new(RefCell::new(Vec::<String>::new()));

    let writer = Rc::clone(&log);
    writer.borrow_mut().push(String::from("started"));
    writer.borrow_mut().push(String::from("ready"));

    println!("entries: {}", log.borrow().len());
    println!("first: {}", log.borrow()[0]);

    let held = log.borrow();
    println!("mut while shared: {}", log.try_borrow_mut().is_ok());
    drop(held);
    println!("mut after release: {}", log.try_borrow_mut().is_ok());
}
`,
  },

  "rust-smart-pointers-4": {
    instructions: `## Ownership down, references up

Two \`Rc\`s pointing at each other form a **cycle** — neither count reaches zero and the memory leaks. \`Weak<T>\` breaks it: a weak handle does not own the value, so \`upgrade()\` returns \`Option<Rc<T>>\`.

The rule: parents own children strongly, children point back weakly.

### Your task

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`
2. Build \`root\` with \`Weak::new()\` as its parent, then \`leaf\` whose parent is \`Rc::downgrade(&root)\`.
3. Push a clone of \`leaf\` into \`root\`'s children.
4. Print root's strong count, then its weak count.
5. \`upgrade()\` the leaf's parent and print the name with \`{:?}\`, mapping to a cloned \`String\`.

Expected output:

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

Root's strong count staying at 1 is the cycle not forming.

### Hints

- \`use std::rc::{Rc, Weak};\`
- \`leaf.parent.borrow().upgrade()\` gives \`Option<Rc<Node>>\`; \`.map(|p| p.name.clone())\` turns it into \`Option<String>\`.
`,
    starterCode: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    name: String,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    // root, leaf, downgrade, counts, upgrade
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the parent link is weak",
        kind: "expr_present",
        expr: "Rc::downgrade(&root)",
      },
      {
        name: "the child link is strong",
        kind: "expr_present",
        expr: "Rc::clone(&leaf)",
      },
      {
        name: "reads the weak count",
        kind: "expr_present",
        expr: "Rc::weak_count(&root)",
      },
      {
        name: "upgrades the weak handle before using it",
        kind: "method_called",
        method: "upgrade",
      },
    ],
    expectedOutput:
      'root strong: 1\nroot weak: 1\nleaf\'s parent: Some("root")\n',
    referenceSolution: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    name: String,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let root = Rc::new(Node {
        name: String::from("root"),
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(Vec::new()),
    });

    let leaf = Rc::new(Node {
        name: String::from("leaf"),
        parent: RefCell::new(Rc::downgrade(&root)),
        children: RefCell::new(Vec::new()),
    });

    root.children.borrow_mut().push(Rc::clone(&leaf));

    println!("root strong: {}", Rc::strong_count(&root));
    println!("root weak: {}", Rc::weak_count(&root));

    let parent = leaf.parent.borrow().upgrade();
    println!("leaf's parent: {:?}", parent.map(|p| p.name.clone()));
}
`,
  },

  "rust-smart-pointers-5": {
    instructions: `## Allocate only when you must

\`Cow<'a, T>\` is an enum: \`Borrowed(&'a T)\` or \`Owned(T::Owned)\`. It lets a function return borrowed data on the common path and allocate only when it actually changed something.

It pays off when the modifying path is **rare** — sanitising a million identifiers of which twelve need changing performs twelve allocations, not a million.

### Your task

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — if the input contains a space, return \`Cow::Owned\` with spaces replaced by \`_\`; otherwise \`Cow::Borrowed\`.
2. Call it with \`"get_events"\` and with \`"get events now"\`.
3. For each, compute \`matches!(&value, Cow::Borrowed(_))\` into its own binding, then print the value and that flag.

Expected output:

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\`

### Hints

- \`use std::borrow::Cow;\`
- \`input.replace(' ', "_")\` returns a \`String\`.
- Compute the flag before the \`println!\` so nothing is moved mid-format.
`,
    starterCode: `use std::borrow::Cow;

fn sanitize(input: &str) -> Cow<'_, str> {
    // Owned only when something changed
}

fn main() {
    // one clean input, one that needs work
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "returns a clone-on-write string",
        kind: "fn_defined",
        fn: "sanitize",
        params: [{ name: "input", ty: "&str" }],
        returns: "Cow<'_, str>",
      },
      {
        name: "the untouched path allocates nothing",
        kind: "expr_present",
        expr: "Cow::Borrowed(input)",
      },
      {
        name: "the modified path owns its result",
        kind: "expr_present",
        expr: "Cow::Owned(input.replace(' ', \"_\"))",
      },
      {
        name: "inspects the variant without consuming it",
        kind: "macro_invoked",
        macro: "matches",
      },
    ],
    expectedOutput:
      "clean: get_events borrowed: true\ndirty: get_events_now borrowed: false\n",
    referenceSolution: `use std::borrow::Cow;

fn sanitize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))
    } else {
        Cow::Borrowed(input)
    }
}

fn main() {
    let clean = sanitize("get_events");
    let clean_borrowed = matches!(&clean, Cow::Borrowed(_));
    println!("clean: {} borrowed: {}", clean, clean_borrowed);

    let dirty = sanitize("get events now");
    let dirty_borrowed = matches!(&dirty, Cow::Borrowed(_));
    println!("dirty: {} borrowed: {}", dirty, dirty_borrowed);
}
`,
  },

  "rust-smart-pointers-6": {
    instructions: `## Build a smart pointer

\`Deref\` gives you the \`*\` operator **and** deref coercion — \`wrapper.method()\` finds the target's methods. That is all \`Box\`, \`Rc\`, \`String\` and \`Vec\` are doing; there is no compiler magic.

Method resolution searches the wrapper first, then follows \`Deref\`. That is why \`Rc\` uses \`Rc::clone(&x)\` rather than a method — an inherent method would shadow the target's.

### Your task

1. \`struct Tracked<T> { inner: T, reads: Cell<u32> }\` with \`fn new(inner: T) -> Self\` and \`fn reads(&self) -> u32\`.
2. \`impl<T> Deref for Tracked<T>\` with \`type Target = T;\`, so \`fn deref(&self) -> &T\` — incrementing \`reads\` before returning \`&self.inner\`.
3. \`impl<T> DerefMut for Tracked<T>\` returning \`&mut self.inner\` — no counting.
4. In \`main\`: wrap \`vec![1, 2, 3]\`, print \`.len()\` through the coercion, \`push(4)\` through \`DerefMut\`, print \`*v\` with \`{:?}\`, then print the read count.

Expected output:

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

Two reads: \`.len()\` and \`*v\`. \`push\` goes through \`deref_mut\`, and \`reads()\` is inherent so it never coerces.

### Hints

- \`use std::cell::Cell;\` and \`use std::ops::{Deref, DerefMut};\`
- \`Cell\` is used rather than a plain \`u32\` because \`deref\` only has \`&self\`.
`,
    starterCode: `use std::cell::Cell;
use std::ops::{Deref, DerefMut};

struct Tracked<T> {
    inner: T,
    reads: Cell<u32>,
}

// inherent new/reads, then Deref and DerefMut

fn main() {
    // wrap a Vec and exercise both directions
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "implements Deref for the wrapper",
        kind: "impl_defined",
        type: "Tracked<T>",
        trait: "Deref",
      },
      {
        name: "implements DerefMut for the wrapper",
        kind: "impl_defined",
        type: "Tracked<T>",
        trait: "DerefMut",
      },
      {
        name: "deref hands back a reference to the target type",
        kind: "fn_defined",
        fn: "deref",
        returns: "&T",
      },
      {
        name: "counts each shared deref",
        kind: "method_called",
        method: "set",
        receiver: "self.reads",
      },
    ],
    expectedOutput: "len: 3\nafter push: [1, 2, 3, 4]\nreads: 2\n",
    referenceSolution: `use std::cell::Cell;
use std::ops::{Deref, DerefMut};

struct Tracked<T> {
    inner: T,
    reads: Cell<u32>,
}

impl<T> Tracked<T> {
    fn new(inner: T) -> Self {
        Tracked {
            inner,
            reads: Cell::new(0),
        }
    }

    fn reads(&self) -> u32 {
        self.reads.get()
    }
}

impl<T> Deref for Tracked<T> {
    type Target = T;

    fn deref(&self) -> &T {
        self.reads.set(self.reads.get() + 1);
        &self.inner
    }
}

impl<T> DerefMut for Tracked<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.inner
    }
}

fn main() {
    let mut v = Tracked::new(vec![1, 2, 3]);

    println!("len: {}", v.len());
    v.push(4);
    println!("after push: {:?}", *v);
    println!("reads: {}", v.reads());
}
`,
  },
};
