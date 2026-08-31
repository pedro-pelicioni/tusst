import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · Macros, Unsafe, FFI & Money — hidden grading data.

export const rustSystemsEdgesGraders: Record<string, AdvancedLessonContent> = {
  "rust-systems-edges-1": {
    instructions: `## Make the invariant unbreakable

Everything is private by default, and \`pub\` on a struct does **not** make its fields public. That is what turns "a balance is never negative" from a comment into a property of the type: the constructor is the only door.

| written | visible to |
| --- | --- |
| *(nothing)* | this module and its descendants |
| \`pub(crate)\` | anywhere in this crate |
| \`pub(super)\` | the parent module |
| \`pub\` | anyone, including other crates |

### Your task

1. \`mod ledger\` containing \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` — the field **stays private**.
2. In \`impl Balance\`: \`pub fn new(stroops: i64) -> Option<Balance>\` (\`None\` if negative), \`pub fn stroops(&self) -> i64\`, and \`pub(crate) fn raw(&self) -> i64\`.
3. In \`main\`, \`use ledger::Balance;\` and print \`new(250)\` mapped to its stroops, \`new(-1)\` likewise, and \`raw()\` on a valid balance of \`10\`.

Expected output:

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

### Hints

- \`Balance::new(250).map(|b| b.stroops())\` gives \`Option<i64>\`.
`,
    starterCode: `mod ledger {
    #[derive(Debug)]
    pub struct Balance {
        stroops: i64,
    }

    // impl Balance: new, stroops, raw
}

use ledger::Balance;

fn main() {
    // a valid balance, an invalid one, and the crate-visible accessor
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "reads go through the accessor, never the field",
        kind: "expr_present",
        expr: "b.stroops",
        forbidden: true,
      },
      {
        name: "construction is fallible",
        kind: "fn_defined",
        fn: "new",
        params: [{ name: "stroops", ty: "i64" }],
        returns: "Option<Balance>",
      },
      {
        name: "the crate-only accessor exists alongside the public one",
        kind: "fn_defined",
        fn: "raw",
        returns: "i64",
      },
      {
        name: "constructs through the module's public constructor",
        kind: "expr_present",
        expr: "Balance::new(250)",
      },
    ],
    expectedOutput: "valid: Some(250)\ninvalid: None\ncrate-visible: 10\n",
    referenceSolution: `mod ledger {
    #[derive(Debug)]
    pub struct Balance {
        stroops: i64,
    }

    impl Balance {
        pub fn new(stroops: i64) -> Option<Balance> {
            if stroops < 0 {
                None
            } else {
                Some(Balance { stroops })
            }
        }

        pub fn stroops(&self) -> i64 {
            self.stroops
        }

        pub(crate) fn raw(&self) -> i64 {
            self.stroops
        }
    }
}

use ledger::Balance;

fn main() {
    println!("valid: {:?}", Balance::new(250).map(|b| b.stroops()));
    println!("invalid: {:?}", Balance::new(-1).map(|b| b.stroops()));

    let b = Balance::new(10).unwrap();
    println!("crate-visible: {}", b.raw());
}
`,
  },

  "rust-systems-edges-2": {
    instructions: `## A macro a function could not replace

\`macro_rules!\` matches syntax and expands to syntax, before type checking. It does what a function cannot: variadic arguments, mixed types in one position, and capturing an expression's source text.

Repetition: \`$( ... ),+\` matches one or more comma-separated groups, and the same shape in the body emits one copy per match. \`{{ ... }}\` makes the expansion a block expression, so it can hold statements and still produce a value.

### Your task

Write \`macro_rules! metric\` with two rules:

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → the same, then \`",<k>=<v>"\` appended per pair.

Call it with \`("requests", 42)\` and with \`("latency", 95, "method" => "getEvents", "code" => 200)\`.

Expected output:

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

### Hints

- The second rule's body needs \`let mut out = format!(...)\`, then a repeated \`out.push_str(...)\`, then \`out\` as the tail.
- Put the two-argument rule first; macro rules are matched in order.
`,
    starterCode: `macro_rules! metric {
    // rule 1: name and value

    // rule 2: name, value, and one or more key => value pairs
}

fn main() {
    // call both forms
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "metric is a macro, not a function",
        kind: "fn_defined",
        fn: "metric",
        forbidden: true,
      },
      {
        name: "invokes the two-argument form",
        kind: "macro_invoked",
        macro: "metric",
        args: "\"requests\", 42",
      },
      {
        name: "invokes the variadic form with two key/value pairs",
        kind: "macro_invoked",
        macro: "metric",
        args: "\"latency\", 95, \"method\" => \"getEvents\", \"code\" => 200",
      },
    ],
    expectedOutput: "requests=42\nlatency=95,method=getEvents,code=200\n",
    referenceSolution: `macro_rules! metric {
    ($name:expr, $value:expr) => {
        format!("{}={}", $name, $value)
    };
    ($name:expr, $value:expr, $($k:expr => $v:expr),+) => {{
        let mut out = format!("{}={}", $name, $value);
        $( out.push_str(&format!(",{}={}", $k, $v)); )+
        out
    }};
}

fn main() {
    println!("{}", metric!("requests", 42));
    println!(
        "{}",
        metric!("latency", 95, "method" => "getEvents", "code" => 200)
    );
}
`,
  },

  "rust-systems-edges-3": {
    instructions: `## See what a derive generates

\`#[derive(...)]\` is a procedural macro: it reads your type's tokens and returns ordinary Rust. Nothing is special-cased in the compiler, and \`cargo expand\` will show you the output.

\`Debug\` prints every field by name. \`Clone\` clones every field. \`PartialEq\` compares every field. \`Default\` fills each field with **its own** default.

### Your task

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`
2. Build one with endpoint \`https://rpc\`, retries \`3\`, verbose \`false\`, and \`clone()\` it.
3. Print the original with \`{:?}\`, whether the two are equal, and \`Config::default()\` with \`{:?}\`.

Expected output:

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Four impls, none of them written by you.
`,
    starterCode: `// derive Debug, Clone, PartialEq and Default
struct Config {
    endpoint: String,
    retries: u32,
    verbose: bool,
}

fn main() {
    // build, clone, compare, and show the default
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "derives all four traits",
        kind: "derive_present",
        type: "Config",
        derives: ["Debug", "Clone", "PartialEq", "Default"],
      },
      {
        name: "clones the config rather than moving it",
        kind: "method_called",
        method: "clone",
        receiver: "a",
      },
      {
        name: "compares by value using the derived PartialEq",
        kind: "expr_present",
        expr: "a == b",
      },
      {
        name: "uses the derived Default",
        kind: "expr_present",
        expr: "Config::default()",
      },
    ],
    expectedOutput:
      'debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }\nequal: true\ndefault: Config { endpoint: "", retries: 0, verbose: false }\n',
    referenceSolution: `#[derive(Debug, Clone, PartialEq, Default)]
struct Config {
    endpoint: String,
    retries: u32,
    verbose: bool,
}

fn main() {
    let a = Config {
        endpoint: String::from("https://rpc"),
        retries: 3,
        verbose: false,
    };
    let b = a.clone();

    println!("debug: {:?}", a);
    println!("equal: {}", a == b);
    println!("default: {:?}", Config::default());
}
`,
  },

  "rust-systems-edges-4": {
    instructions: `## A safe API over an unsafe core

\`unsafe\` unlocks five abilities — dereference a raw pointer, call an \`unsafe\` fn, touch a \`static mut\`, implement an \`unsafe\` trait, read a union field. Ownership, borrowing and type checking are **unchanged**.

What it means is "I am asserting an invariant the compiler cannot check", so every block gets a \`// SAFETY:\` comment saying why the assertion holds.

A safe function containing \`unsafe\` promises the invariant holds for *every* input. That is what makes \`split_at_mut\` safe.

### Your task

Write \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` returning two non-overlapping mutable halves, using \`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\` and a \`// SAFETY:\` comment.

In \`main\`, split \`[1, 2, 3, 4, 5, 6]\`, write \`100\` to the left half's first element and \`200\` to the right half's, print both halves, then print the whole array.

Expected output:

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\`

### Hints

- Read \`len()\` and \`mid\` **before** taking the pointer, so no borrow is live across it.
- \`ptr.add(mid)\` moves forward by \`mid\` elements.
`,
    starterCode: `fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64]) {
    // two non-overlapping halves, via raw parts
}

fn main() {
    let mut data = [1i64, 2, 3, 4, 5, 6];

    // split, write to each half, print both, then the whole
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "returns two independent mutable halves",
        kind: "fn_defined",
        fn: "split_at_mid",
        params: [{ name: "data", ty: "&mut [i64]" }],
        returns: "(&mut [i64], &mut [i64])",
      },
      {
        name: "takes a raw pointer to the buffer",
        kind: "method_called",
        method: "as_mut_ptr",
        receiver: "data",
      },
      {
        name: "rebuilds both halves from raw parts",
        kind: "expr_present",
        expr: "std::slice::from_raw_parts_mut(ptr.add(mid), len - mid)",
      },
      {
        name: "does not simply delegate to the standard library",
        kind: "method_called",
        method: "split_at_mut",
        forbidden: true,
      },
    ],
    expectedOutput:
      "left: [100, 2, 3]\nright: [200, 5, 6]\nwhole: [100, 2, 3, 200, 5, 6]\n",
    referenceSolution: `fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64]) {
    let len = data.len();
    let mid = len / 2;
    let ptr = data.as_mut_ptr();

    // SAFETY: mid <= len, so both ranges lie within the same allocation.
    // The ranges [0, mid) and [mid, len) do not overlap, so the two &mut
    // slices never alias — which is the invariant the borrow checker
    // cannot verify for itself here.
    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

fn main() {
    let mut data = [1i64, 2, 3, 4, 5, 6];

    let (left, right) = split_at_mid(&mut data);
    left[0] = 100;
    right[0] = 200;

    println!("left: {:?}", left);
    println!("right: {:?}", right);
    println!("whole: {:?}", data);
}
`,
  },

  "rust-systems-edges-5": {
    instructions: `## Handle addresses deliberately

A raw pointer is a plain address: no lifetime, no ownership, no aliasing guarantee. **Creating one is safe; dereferencing one is not.**

A dereference asserts four things at once — non-null, aligned, pointing at a live value, and not aliasing a live \`&mut\`. The last is the one people miss, and its bugs surface far from the offending line.

### Your task

1. \`let mut value = 42i64;\` and a \`*mut i64\` to it. In an \`unsafe\` block with a \`// SAFETY:\` comment, increment through the pointer and print the value read back through it. Then print the original binding.
2. \`let arr = [10i64, 20, 30];\` and its \`as_ptr()\`. Print the element at offset \`2\` via \`add\`.
3. Build \`std::ptr::null::<i64>()\` and print \`is_null()\` — a safe call, no block needed.

Expected output:

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\`

### Hints

- \`let p: *mut i64 = &mut value;\` coerces the reference to a raw pointer.
- \`add\` counts in units of \`T\`, so \`add(2)\` on a \`*const i64\` moves 16 bytes.
`,
    starterCode: `fn main() {
    // 1. write through a *mut i64

    // 2. read an offset through a *const i64

    // 3. a null pointer, checked safely
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "takes a mutable raw pointer",
        kind: "let_binding",
        var: "p",
        ty: "*mut i64",
      },
      {
        name: "writes through the raw pointer",
        kind: "expr_present",
        expr: "*p += 1",
      },
      {
        name: "offsets in units of the element type",
        kind: "expr_present",
        expr: "*base.add(2)",
      },
      {
        name: "checks for null without dereferencing",
        kind: "method_called",
        method: "is_null",
        receiver: "null",
      },
    ],
    expectedOutput:
      "through raw: 43\nthrough binding: 43\noffset 2: 30\nnull is null: true\n",
    referenceSolution: `fn main() {
    let mut value = 42i64;
    let p: *mut i64 = &mut value;

    // SAFETY: \`p\` was derived from a live &mut to \`value\`, which is still in
    // scope and not otherwise borrowed. It is non-null and aligned by
    // construction, and no other reference to \`value\` is live here.
    unsafe {
        *p += 1;
        println!("through raw: {}", *p);
    }

    println!("through binding: {}", value);

    let arr = [10i64, 20, 30];
    let base: *const i64 = arr.as_ptr();

    // SAFETY: index 2 is within the bounds of a 3-element array, so the
    // offset pointer stays inside the same allocation.
    unsafe {
        println!("offset 2: {}", *base.add(2));
    }

    let null: *const i64 = std::ptr::null();
    println!("null is null: {}", null.is_null());
}
`,
  },

  "rust-systems-edges-6": {
    instructions: `## Ownership across the boundary

Rust's ABI is deliberately unstable, so crossing into C means opting into theirs: \`#[repr(C)]\` for layout, \`#[no_mangle]\` and \`extern "C"\` for the symbol and calling convention.

The hard part is ownership crossing a boundary the compiler cannot see through. Every \`Box::into_raw\` needs exactly one matching \`Box::from_raw\` — zero leaks, two is a double free.

### Your task

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — it must be \`pub\`, since the exported functions mention it.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — \`0\` for null, otherwise \`x + y\`, with a \`// SAFETY:\` comment.
3. \`point_new(x, y) -> *mut Point\` via \`Box::into_raw\`, and \`point_free(p: *mut Point)\` via \`Box::from_raw\`, null-checked.
4. In \`main\`: build \`(3, 4)\`, print its sum, print the point through the raw pointer, free it, print \`size_of::<Point>()\`, then \`point_sum\` of a null pointer.

Expected output:

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

One \`into_raw\`, one \`from_raw\`. That pairing is the entire contract.

### Hints

- \`std::ptr::null()\` for the last call.
- Free the point **before** printing the size, or the borrow order will confuse you.
`,
    starterCode: `#[repr(C)]
#[derive(Debug)]
pub struct Point {
    x: i64,
    y: i64,
}

// point_sum, point_new, point_free — all extern "C" and #[no_mangle]

fn main() {
    // build, read, free, then probe the null path
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "reports the C layout size of the exported struct",
        kind: "expr_present",
        expr: "std::mem::size_of::<Point>()",
      },
      {
        name: "exports point_sum over a raw pointer to the struct",
        kind: "fn_defined",
        fn: "point_sum",
        params: [{ name: "p", ty: "*const Point" }],
        returns: "i64",
      },
      {
        name: "hands ownership out with into_raw",
        kind: "expr_present",
        expr: "Box::into_raw(Box::new(Point { x, y }))",
      },
      {
        name: "reclaims ownership exactly once with from_raw",
        kind: "expr_present",
        expr: "drop(Box::from_raw(p))",
      },
      {
        name: "null-checks the incoming pointer",
        kind: "method_called",
        method: "is_null",
        receiver: "p",
      },
    ],
    expectedOutput:
      "sum: 7\npoint: Point { x: 3, y: 4 }\nlayout size: 16\nnull sum: 0\n",
    referenceSolution: `#[repr(C)]
#[derive(Debug)]
pub struct Point {
    x: i64,
    y: i64,
}

#[no_mangle]
pub extern "C" fn point_sum(p: *const Point) -> i64 {
    if p.is_null() {
        return 0;
    }
    // SAFETY: the caller promises \`p\` points to a live, aligned Point for
    // the duration of this call. Null is rejected above.
    unsafe { (*p).x + (*p).y }
}

#[no_mangle]
pub extern "C" fn point_new(x: i64, y: i64) -> *mut Point {
    Box::into_raw(Box::new(Point { x, y }))
}

#[no_mangle]
pub extern "C" fn point_free(p: *mut Point) {
    if p.is_null() {
        return;
    }
    // SAFETY: \`p\` came from point_new's Box::into_raw and is reclaimed
    // exactly once here. The caller must not use it afterwards.
    unsafe {
        drop(Box::from_raw(p));
    }
}

fn main() {
    let p = point_new(3, 4);
    println!("sum: {}", point_sum(p));

    // SAFETY: \`p\` is live and owned by this frame until point_free below.
    unsafe {
        println!("point: {:?}", *p);
    }

    point_free(p);

    println!("layout size: {}", std::mem::size_of::<Point>());
    println!("null sum: {}", point_sum(std::ptr::null()));
}
`,
  },

  "rust-systems-edges-7": {
    instructions: `## Money in integers

A balance is never a float — \`f64\` cannot represent most decimal fractions exactly, and in a ledger that error is money that does not reconcile. Store the smallest indivisible unit as an integer: stroops, cents, satoshis.

Integers do not lose precision, but they **overflow** — and the check is compiled out in release builds. Be explicit:

| method | on overflow |
| --- | --- |
| \`checked_add\` | \`None\` — you handle it |
| \`saturating_add\` | clamps at the maximum |
| \`wrapping_add\` | wraps around |

For money, always \`checked_\`.

### Your task

1. \`const STROOPS_PER_XLM: i64 = 10_000_000;\`
2. \`fn to_stroops(xlm: i64, fraction: i64) -> Option<i64>\` using \`checked_mul(..)?\` then \`checked_add(..)\`.
3. Print \`to_stroops(2, 5_000_000)\` and \`to_stroops(i64::MAX, 0)\` with \`{:?}\`.
4. Print \`100i64.checked_sub(30)\` and \`10i64.checked_sub(i64::MIN)\` with \`{:?}\`.
5. Print \`i64::MAX.saturating_add(1)\` and \`i64::MAX.wrapping_add(1)\`.
6. Print whether \`0.1f64 + 0.2f64 == 0.3\`.

Expected output:

\`\`\`text
2.5 XLM: Some(25000000)
overflow: None
checked_sub ok: Some(70)
checked_sub under: None
saturating: 9223372036854775807
wrapping: -9223372036854775808
float equality: false
\`\`\`

The last line is why the first six matter.
`,
    starterCode: `const STROOPS_PER_XLM: i64 = 10_000_000;

fn to_stroops(xlm: i64, fraction: i64) -> Option<i64> {
    // checked all the way
}

fn main() {
    // conversions, then the three overflow policies, then the float
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the conversion cannot silently overflow",
        kind: "fn_defined",
        fn: "to_stroops",
        returns: "Option<i64>",
      },
      {
        name: "multiplies with an overflow check",
        kind: "method_called",
        method: "checked_mul",
        receiver: "xlm",
      },
      {
        name: "adds with an overflow check",
        kind: "method_called",
        method: "checked_add",
        args: "fraction",
      },
      {
        name: "shows the saturating policy for contrast",
        kind: "method_called",
        method: "saturating_add",
        args: "1",
      },
      {
        name: "no floating point is used for the balance itself",
        kind: "expr_present",
        expr: "xlm as f64",
        forbidden: true,
      },
    ],
    expectedOutput:
      "2.5 XLM: Some(25000000)\noverflow: None\nchecked_sub ok: Some(70)\nchecked_sub under: None\nsaturating: 9223372036854775807\nwrapping: -9223372036854775808\nfloat equality: false\n",
    referenceSolution: `const STROOPS_PER_XLM: i64 = 10_000_000;

fn to_stroops(xlm: i64, fraction: i64) -> Option<i64> {
    xlm.checked_mul(STROOPS_PER_XLM)?.checked_add(fraction)
}

fn main() {
    println!("2.5 XLM: {:?}", to_stroops(2, 5_000_000));
    println!("overflow: {:?}", to_stroops(i64::MAX, 0));

    println!("checked_sub ok: {:?}", 100i64.checked_sub(30));
    println!("checked_sub under: {:?}", 10i64.checked_sub(i64::MIN));

    println!("saturating: {}", i64::MAX.saturating_add(1));
    println!("wrapping: {}", i64::MAX.wrapping_add(1));

    let sum = 0.1f64 + 0.2f64;
    println!("float equality: {}", sum == 0.3);
}
`,
  },
};
