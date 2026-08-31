import "server-only";

import type { AdvancedLessonContent } from "./types";

// Advanced · RPC Services at Scale — hidden grading data.

export const backendRpcServicesGraders: Record<string, AdvancedLessonContent> = {
  "backend-rpc-services-1": {
    instructions: `## Classify an inbound request

A JSON-RPC 2.0 Request is \`{"jsonrpc": "2.0", "method": ..., "params": ..., "id": ...}\`. A Response carries **either** \`result\` **or** \`error\`, never both. Five codes are reserved:

| code | meaning | when |
| --- | --- | --- |
| -32700 | Parse error | the bytes are not JSON |
| -32600 | Invalid Request | it parsed, but it is not a Request object |
| -32601 | Method not found | the name is not registered |
| -32602 | Invalid params | the method exists, the arguments do not typecheck |
| -32603 | Internal error | the handler ran and failed |

\`-32000\` to \`-32099\` is left for your own server errors.

The id rule catches people out: echo the id **byte-identically** once you have a valid Request object, and send \`id: null\` when you do not — a parse error may have produced no id at all, and a wrong-shaped request may have an id of the wrong type.

### Your task

Fill in \`classify\`. Run the five checks in order — parse, request shape, method, params, handler — and answer each with its code.

1. \`well_formed == false\` is \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. A \`version\` that is not \`Some("2.0")\`, or a missing \`method\`, is \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. A method not in \`methods\` is \`-32601\` \`"Method not found"\`, echoing the id.
4. \`params_ok == false\` is \`-32602\` \`"Invalid params"\`, echoing the id.
5. \`handler_ok == false\` is \`-32603\` \`"Internal error"\`, echoing the id.
6. Otherwise \`Reply { code: 0, message: "result", id }\` — \`main\` prints code \`0\` as \`-\`.

Expected output:

\`\`\`text
request                   code  message           id
truncated body          -32700  Parse error       null
jsonrpc 1.0             -32600  Invalid Request   null
no method member        -32600  Invalid Request   null
method sbutract         -32601  Method not found  3
sum of strings          -32602  Invalid params    "a3"
sum, handler panicked   -32603  Internal error    5
sum, healthy                 -  result            6
\`\`\`

### Hints

- \`Id\` is \`Clone\`, so \`r.id.clone()\` echoes it.
- \`methods.contains(&r.method.unwrap())\` — the \`unwrap\` is safe because check 2 already rejected a missing method.
- Early \`return\`s keep the order of the checks visible; that order *is* the classification.
`,
    starterCode: `#[derive(Debug, Clone, PartialEq)]
enum Id {
    Num(i64),
    Text(&'static str),
    Null,
}

struct Incoming {
    label: &'static str,
    well_formed: bool,
    version: Option<&'static str>,
    method: Option<&'static str>,
    id: Id,
    params_ok: bool,
    handler_ok: bool,
}

struct Reply {
    code: i64,
    message: &'static str,
    id: Id,
}

fn render_id(id: &Id) -> String {
    match id {
        Id::Num(n) => n.to_string(),
        Id::Text(s) => format!("\\"{}\\"", s),
        Id::Null => "null".to_string(),
    }
}

fn row(label: &str, code: &str, message: &str, id: &str) {
    println!("{:<22} {:>7}  {:<17} {}", label, code, message, id);
}

fn classify(r: &Incoming, methods: &[&str]) -> Reply {
    // Five checks, in this order: parse, request shape, method, params, handler.
    // Two of them must answer with a null id rather than the one that arrived.
    todo!()
}

fn main() {
    let methods = ["sum", "ping"];
    let inbox = [
        Incoming { label: "truncated body", well_formed: false, version: None, method: None, id: Id::Null, params_ok: true, handler_ok: true },
        Incoming { label: "jsonrpc 1.0", well_formed: true, version: Some("1.0"), method: Some("sum"), id: Id::Num(1), params_ok: true, handler_ok: true },
        Incoming { label: "no method member", well_formed: true, version: Some("2.0"), method: None, id: Id::Num(2), params_ok: true, handler_ok: true },
        Incoming { label: "method sbutract", well_formed: true, version: Some("2.0"), method: Some("sbutract"), id: Id::Num(3), params_ok: true, handler_ok: true },
        Incoming { label: "sum of strings", well_formed: true, version: Some("2.0"), method: Some("sum"), id: Id::Text("a3"), params_ok: false, handler_ok: true },
        Incoming { label: "sum, handler panicked", well_formed: true, version: Some("2.0"), method: Some("sum"), id: Id::Num(5), params_ok: true, handler_ok: false },
        Incoming { label: "sum, healthy", well_formed: true, version: Some("2.0"), method: Some("sum"), id: Id::Num(6), params_ok: true, handler_ok: true },
    ];

    row("request", "code", "message", "id");
    for r in inbox.iter() {
        let reply = classify(r, &methods);
        let code = if reply.code == 0 { "-".to_string() } else { reply.code.to_string() };
        row(r.label, &code, reply.message, &render_id(&reply.id));
    }
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "defines the classifier",
        kind: "fn_defined",
        fn: "classify",
        returns: "Reply"
      },
      {
        name: "answers an unparseable body with -32700",
        kind: "expr_present",
        expr: "-32700"
      },
      {
        name: "answers a wrong-shaped request with -32600",
        kind: "expr_present",
        expr: "-32600"
      },
      {
        name: "answers an unknown method with -32601",
        kind: "expr_present",
        expr: "-32601"
      },
      {
        name: "answers bad arguments with -32602",
        kind: "expr_present",
        expr: "-32602"
      },
      {
        name: "answers a failed handler with -32603",
        kind: "expr_present",
        expr: "-32603"
      },
      {
        name: "sends a null id when the id cannot be trusted",
        kind: "expr_present",
        expr: "Id::Null"
      }
    ],
    expectedOutput: "request                   code  message           id\ntruncated body          -32700  Parse error       null\njsonrpc 1.0             -32600  Invalid Request   null\nno method member        -32600  Invalid Request   null\nmethod sbutract         -32601  Method not found  3\nsum of strings          -32602  Invalid params    \"a3\"\nsum, handler panicked   -32603  Internal error    5\nsum, healthy                 -  result            6\n",
    referenceSolution: `#[derive(Debug, Clone, PartialEq)]
enum Id {
    Num(i64),
    Text(&'static str),
    Null,
}

struct Incoming {
    label: &'static str,
    well_formed: bool,
    version: Option<&'static str>,
    method: Option<&'static str>,
    id: Id,
    params_ok: bool,
    handler_ok: bool,
}

struct Reply {
    code: i64,
    message: &'static str,
    id: Id,
}

fn render_id(id: &Id) -> String {
    match id {
        Id::Num(n) => n.to_string(),
        Id::Text(s) => format!("\\"{}\\"", s),
        Id::Null => "null".to_string(),
    }
}

fn row(label: &str, code: &str, message: &str, id: &str) {
    println!("{:<22} {:>7}  {:<17} {}", label, code, message, id);
}

fn classify(r: &Incoming, methods: &[&str]) -> Reply {
    if !r.well_formed {
        return Reply { code: -32700, message: "Parse error", id: Id::Null };
    }
    if r.version != Some("2.0") || r.method.is_none() {
        return Reply { code: -32600, message: "Invalid Request", id: Id::Null };
    }
    if !methods.contains(&r.method.unwrap()) {
        return Reply { code: -32601, message: "Method not found", id: r.id.clone() };
    }
    if !r.params_ok {
        return Reply { code: -32602, message: "Invalid params", id: r.id.clone() };
    }
    if !r.handler_ok {
        return Reply { code: -32603, message: "Internal error", id: r.id.clone() };
    }
    Reply { code: 0, message: "result", id: r.id.clone() }
}

fn main() {
    let methods = ["sum", "ping"];
    let inbox = [
        Incoming { label: "truncated body", well_formed: false, version: None, method: None, id: Id::Null, params_ok: true, handler_ok: true },
        Incoming { label: "jsonrpc 1.0", well_formed: true, version: Some("1.0"), method: Some("sum"), id: Id::Num(1), params_ok: true, handler_ok: true },
        Incoming { label: "no method member", well_formed: true, version: Some("2.0"), method: None, id: Id::Num(2), params_ok: true, handler_ok: true },
        Incoming { label: "method sbutract", well_formed: true, version: Some("2.0"), method: Some("sbutract"), id: Id::Num(3), params_ok: true, handler_ok: true },
        Incoming { label: "sum of strings", well_formed: true, version: Some("2.0"), method: Some("sum"), id: Id::Text("a3"), params_ok: false, handler_ok: true },
        Incoming { label: "sum, handler panicked", well_formed: true, version: Some("2.0"), method: Some("sum"), id: Id::Num(5), params_ok: true, handler_ok: false },
        Incoming { label: "sum, healthy", well_formed: true, version: Some("2.0"), method: Some("sum"), id: Id::Num(6), params_ok: true, handler_ok: true },
    ];

    row("request", "code", "message", "id");
    for r in inbox.iter() {
        let reply = classify(r, &methods);
        let code = if reply.code == 0 { "-".to_string() } else { reply.code.to_string() };
        row(r.label, &code, reply.message, &render_id(&reply.id));
    }
}
`,
  },

  "backend-rpc-services-2": {
    instructions: `## The two frames that get no answer

The id member is a switch. A Request with **no id** is a **notification**: the server runs the handler and MUST NOT send a response object, not even an error. An explicit \`null\` id is a different thing — that is a call whose id happens to be null.

A batch is a JSON array of Request objects, and three of its rules break naive servers:

- An **empty array** is not a Request object, so it gets one \`-32600\` with \`id: null\`.
- A batch of **only notifications** produces **no response body at all** — not \`[]\`.
- A **malformed member** answers with \`id: null\`, because the server cannot know whether that member was going to be a notification.

Ordering is not guaranteed either: the client matches responses to requests by id, never by position.

### Your task

Fill in \`handle_one\` and \`handle_batch\`.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → push the method onto \`effects\` and return \`None\`. The side effect still runs; only the reply is suppressed.
3. \`Frame::Call { method, id }\` → a method other than \`"add"\` is \`Some(error_obj(-32601, "Method not found", &id.to_string()))\`; otherwise push the method and return \`Some(format!("{{\\"jsonrpc\\":\\"2.0\\",\\"result\\":7,\\"id\\":{}}}", id))\`.
4. \`handle_batch\`: an empty slice is one \`-32600\` with a null id. Otherwise \`filter_map\` the frames through \`handle_one\`, and return \`None\` when nothing replied, else the replies joined with \`,\` inside \`[\` \`]\`.

Expected output:

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

### Hints

- \`filter_map(|f| handle_one(f, effects))\` drops exactly the members that returned \`None\`.
- \`replies.join(",")\` builds the array body.
- Six handler invocations against three response bodies is the whole point: \`effects.len()\` counts work done, not answers sent.
`,
    starterCode: `#[derive(Clone)]
enum Frame {
    Call { method: &'static str, id: i64 },
    Notify { method: &'static str },
    Malformed,
}

fn error_obj(code: i64, message: &str, id: &str) -> String {
    format!(
        "{{\\"jsonrpc\\":\\"2.0\\",\\"error\\":{{\\"code\\":{},\\"message\\":\\"{}\\"}},\\"id\\":{}}}",
        code, message, id
    )
}

fn handle_one(frame: &Frame, effects: &mut Vec<&'static str>) -> Option<String> {
    // A reply, or None for the frame that must never be answered.
    todo!()
}

fn handle_batch(frames: &[Frame], effects: &mut Vec<&'static str>) -> Option<String> {
    // The empty batch is its own error. A batch with nothing to reply to
    // gets no response body at all.
    todo!()
}

fn show(label: &str, reply: Option<String>) {
    match reply {
        Some(body) => println!("{:<24} {}", label, body),
        None => println!("{:<24} (no response)", label),
    }
}

fn main() {
    let mut effects: Vec<&'static str> = Vec::new();

    let single_call = [Frame::Call { method: "add", id: 1 }];
    let single_notify = [Frame::Notify { method: "log" }];
    let empty: [Frame; 0] = [];
    let all_notify = [Frame::Notify { method: "log" }, Frame::Notify { method: "log" }];
    let mixed = [
        Frame::Notify { method: "log" },
        Frame::Call { method: "add", id: 2 },
        Frame::Malformed,
        Frame::Call { method: "remove", id: 3 },
    ];

    show("single call", handle_one(&single_call[0], &mut effects));
    show("single notification", handle_one(&single_notify[0], &mut effects));
    show("empty batch", handle_batch(&empty, &mut effects));
    show("batch of notifications", handle_batch(&all_notify, &mut effects));
    show("mixed batch", handle_batch(&mixed, &mut effects));

    println!("handlers run: {}", effects.len());
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "a single frame may produce no reply at all",
        kind: "fn_defined",
        fn: "handle_one",
        returns: "Option<String>"
      },
      {
        name: "a batch may produce no reply at all",
        kind: "fn_defined",
        fn: "handle_batch",
        returns: "Option<String>"
      },
      {
        name: "handles the notification frame",
        kind: "match_arm",
        pat: "Frame::Notify { method }"
      },
      {
        name: "rejects the empty batch before processing it",
        kind: "any_of",
        of: [
          { kind: "method_called", method: "is_empty", receiver: "frames" },
          { kind: "expr_present", expr: "frames.len() == 0" },
          { kind: "expr_present", expr: "frames.is_empty()" }
        ]
      },
      {
        name: "drops the members that get no response",
        kind: "method_called",
        method: "filter_map"
      },
      {
        name: "an unknown method in a batch still answers -32601",
        kind: "expr_present",
        expr: "-32601"
      }
    ],
    expectedOutput: "single call              {\"jsonrpc\":\"2.0\",\"result\":7,\"id\":1}\nsingle notification      (no response)\nempty batch              {\"jsonrpc\":\"2.0\",\"error\":{\"code\":-32600,\"message\":\"Invalid Request\"},\"id\":null}\nbatch of notifications   (no response)\nmixed batch              [{\"jsonrpc\":\"2.0\",\"result\":7,\"id\":2},{\"jsonrpc\":\"2.0\",\"error\":{\"code\":-32600,\"message\":\"Invalid Request\"},\"id\":null},{\"jsonrpc\":\"2.0\",\"error\":{\"code\":-32601,\"message\":\"Method not found\"},\"id\":3}]\nhandlers run: 6\n",
    referenceSolution: `#[derive(Clone)]
enum Frame {
    Call { method: &'static str, id: i64 },
    Notify { method: &'static str },
    Malformed,
}

fn error_obj(code: i64, message: &str, id: &str) -> String {
    format!(
        "{{\\"jsonrpc\\":\\"2.0\\",\\"error\\":{{\\"code\\":{},\\"message\\":\\"{}\\"}},\\"id\\":{}}}",
        code, message, id
    )
}

fn handle_one(frame: &Frame, effects: &mut Vec<&'static str>) -> Option<String> {
    match frame {
        Frame::Malformed => Some(error_obj(-32600, "Invalid Request", "null")),
        Frame::Notify { method } => {
            effects.push(method);
            None
        }
        Frame::Call { method, id } => {
            if *method != "add" {
                return Some(error_obj(-32601, "Method not found", &id.to_string()));
            }
            effects.push(method);
            Some(format!("{{\\"jsonrpc\\":\\"2.0\\",\\"result\\":7,\\"id\\":{}}}", id))
        }
    }
}

fn handle_batch(frames: &[Frame], effects: &mut Vec<&'static str>) -> Option<String> {
    if frames.is_empty() {
        return Some(error_obj(-32600, "Invalid Request", "null"));
    }
    let replies: Vec<String> = frames.iter().filter_map(|f| handle_one(f, effects)).collect();
    if replies.is_empty() {
        None
    } else {
        Some(format!("[{}]", replies.join(",")))
    }
}

fn show(label: &str, reply: Option<String>) {
    match reply {
        Some(body) => println!("{:<24} {}", label, body),
        None => println!("{:<24} (no response)", label),
    }
}

fn main() {
    let mut effects: Vec<&'static str> = Vec::new();

    let single_call = [Frame::Call { method: "add", id: 1 }];
    let single_notify = [Frame::Notify { method: "log" }];
    let empty: [Frame; 0] = [];
    let all_notify = [Frame::Notify { method: "log" }, Frame::Notify { method: "log" }];
    let mixed = [
        Frame::Notify { method: "log" },
        Frame::Call { method: "add", id: 2 },
        Frame::Malformed,
        Frame::Call { method: "remove", id: 3 },
    ];

    show("single call", handle_one(&single_call[0], &mut effects));
    show("single notification", handle_one(&single_notify[0], &mut effects));
    show("empty batch", handle_batch(&empty, &mut effects));
    show("batch of notifications", handle_batch(&all_notify, &mut effects));
    show("mixed batch", handle_batch(&mixed, &mut effects));

    println!("handlers run: {}", effects.len());
}
`,
  },

  "backend-rpc-services-3": {
    instructions: `## A router of boxed handlers

Handlers have different bodies and must share one signature, so each one is a trait object:

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
\`\`\`

The box is what lets closures of different concrete types live in one \`HashMap\`. The cost is a pointer indirection per call, against a hash lookup that is already dwarfed by the socket read. A hand-written \`match\` on the method name dispatches just as fast but cannot be extended at startup by an independent module, and cannot be enumerated at runtime.

Separating the three failures is the other half of the job. \`-32601\` is a name the table does not hold. \`-32602\` is the shape and arity check that happens **before** the handler is entered. \`-32603\` is a handler that reached real work and failed — and it must never leak an internal message onto the wire.

### Your task

1. \`register\` inserts the boxed handler into \`self.routes\` under its name.
2. \`dispatch\` looks the method up. \`Some(handler)\` calls it; \`None\` is \`Err(RpcError { code: -32601, message: "Method not found" })\`.
3. \`method_names\` collects the keys and **sorts** them — \`HashMap\` iteration order is unspecified and varies per process.
4. In \`main\`, register two handlers:
   - \`"sum"\` returns \`Ok(params.iter().sum())\`.
   - \`"div"\` returns \`-32602\` \`"Invalid params"\` when \`params.len() != 2\`, \`-32603\` \`"Internal error"\` when the divisor is zero, and otherwise \`Ok(params[0] / params[1])\`.

Expected output:

\`\`\`text
methods: ["div", "sum"]
method     params     outcome
sum        [1, 2, 3]  result 6
div        [10, 2]    result 5
div        [10, 0]    -32603 Internal error
div        [10]       -32602 Invalid params
multiply   [3, 4]     -32601 Method not found
\`\`\`

### Hints

- \`Box::new(|params: &[i64]| ...)\` — the closure needs its parameter type annotated to coerce into \`Handler\`.
- \`self.routes.keys().copied().collect()\` gives a \`Vec<&'static str>\` you can sort.
- Divide-by-zero is \`-32603\`, not \`-32602\`: the params typechecked, then the handler failed.
`,
    starterCode: `use std::collections::HashMap;

#[derive(Debug)]
struct RpcError {
    code: i64,
    message: &'static str,
}

type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;

struct Router {
    routes: HashMap<&'static str, Handler>,
}

fn row(method: &str, params: &str, outcome: &str) {
    println!("{:<10} {:<10} {}", method, params, outcome);
}

impl Router {
    fn new() -> Router {
        Router { routes: HashMap::new() }
    }

    fn register(&mut self, name: &'static str, handler: Handler) {
        // put the boxed handler in the table under its method name
    }

    fn dispatch(&self, method: &str, params: &[i64]) -> Result<i64, RpcError> {
        // look the method up; an unknown name is a specific error code
        todo!()
    }

    fn method_names(&self) -> Vec<&'static str> {
        // the keys, in an order that does not change between runs
        todo!()
    }
}

fn main() {
    let mut router = Router::new();

    // register "sum" and "div" as boxed handlers

    println!("methods: {:?}", router.method_names());

    let calls: [(&str, &[i64]); 5] = [
        ("sum", &[1, 2, 3]),
        ("div", &[10, 2]),
        ("div", &[10, 0]),
        ("div", &[10]),
        ("multiply", &[3, 4]),
    ];

    row("method", "params", "outcome");
    for (method, params) in calls.iter() {
        let outcome = match router.dispatch(method, params) {
            Ok(value) => format!("result {}", value),
            Err(e) => format!("{} {}", e.code, e.message),
        };
        row(method, &format!("{:?}", params), &outcome);
    }
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "stores handlers in the routing table",
        kind: "method_called",
        method: "insert",
        receiver: "self.routes"
      },
      {
        name: "looks the method up in the table",
        kind: "method_called",
        method: "get",
        receiver: "self.routes"
      },
      {
        name: "registers handlers as trait objects",
        kind: "expr_present",
        expr: "Box::new"
      },
      {
        name: "lists methods in an order that does not vary between runs",
        kind: "method_called",
        method: "sort"
      },
      {
        name: "an unknown method is -32601",
        kind: "expr_present",
        expr: "-32601"
      },
      {
        name: "wrong arity is -32602, not an internal error",
        kind: "expr_present",
        expr: "-32602"
      },
      {
        name: "a handler that ran and failed is -32603",
        kind: "expr_present",
        expr: "-32603"
      },
      {
        name: "dispatches through the table, not a chain of string comparisons",
        kind: "expr_present",
        expr: "method == \"sum\"",
        forbidden: true
      }
    ],
    expectedOutput: "methods: [\"div\", \"sum\"]\nmethod     params     outcome\nsum        [1, 2, 3]  result 6\ndiv        [10, 2]    result 5\ndiv        [10, 0]    -32603 Internal error\ndiv        [10]       -32602 Invalid params\nmultiply   [3, 4]     -32601 Method not found\n",
    referenceSolution: `use std::collections::HashMap;

#[derive(Debug)]
struct RpcError {
    code: i64,
    message: &'static str,
}

type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;

struct Router {
    routes: HashMap<&'static str, Handler>,
}

fn row(method: &str, params: &str, outcome: &str) {
    println!("{:<10} {:<10} {}", method, params, outcome);
}

impl Router {
    fn new() -> Router {
        Router { routes: HashMap::new() }
    }

    fn register(&mut self, name: &'static str, handler: Handler) {
        self.routes.insert(name, handler);
    }

    fn dispatch(&self, method: &str, params: &[i64]) -> Result<i64, RpcError> {
        match self.routes.get(method) {
            Some(handler) => handler(params),
            None => Err(RpcError { code: -32601, message: "Method not found" }),
        }
    }

    fn method_names(&self) -> Vec<&'static str> {
        let mut names: Vec<&'static str> = self.routes.keys().copied().collect();
        names.sort();
        names
    }
}

fn main() {
    let mut router = Router::new();

    router.register("sum", Box::new(|params: &[i64]| Ok(params.iter().sum())));

    router.register(
        "div",
        Box::new(|params: &[i64]| {
            if params.len() != 2 {
                return Err(RpcError { code: -32602, message: "Invalid params" });
            }
            if params[1] == 0 {
                return Err(RpcError { code: -32603, message: "Internal error" });
            }
            Ok(params[0] / params[1])
        }),
    );

    println!("methods: {:?}", router.method_names());

    let calls: [(&str, &[i64]); 5] = [
        ("sum", &[1, 2, 3]),
        ("div", &[10, 2]),
        ("div", &[10, 0]),
        ("div", &[10]),
        ("multiply", &[3, 4]),
    ];

    row("method", "params", "outcome");
    for (method, params) in calls.iter() {
        let outcome = match router.dispatch(method, params) {
            Ok(value) => format!("result {}", value),
            Err(e) => format!("{} {}", e.code, e.message),
        };
        row(method, &format!("{:?}", params), &outcome);
    }
}
`,
  },

  "backend-rpc-services-4": {
    instructions: `## Service and Layer

The whole Tower ecosystem is two traits. \`Service\` is one method — request in, response out. \`Layer<S>\` is one method — take a service, return a service. Every middleware you have used is a struct holding an inner \`S\` that implements \`Service\` by doing something and then calling \`self.inner.call(req)\`.

Real Tower adds \`poll_ready\` (the backpressure channel: a service says "not now" *before* you hand it a request) and associated Response/Error/Future types. The shape is what you build here.

Composition order is the decision the exercise measures. \`TimeoutLayer.layer(CountLayer.layer(Backend))\` puts the timeout outermost, so an over-budget request is rejected without the backend ever being entered — and the counter reads 3 of 5.

### Your task

Write four impls.

1. \`impl<S: Service> Service for Counted<S>\` — increment \`self.calls\`, then delegate to \`self.inner.call(req)\`.
2. \`impl<S> Layer<S> for CountLayer\` with \`type Svc = Counted<S>\`, building \`Counted { inner, calls: 0 }\`.
3. \`impl<S: Service> Service for Timeout<S>\` — if \`req.cost_ms > self.limit_ms\`, return \`Resp::Err(-32001, "Request timeout")\` **without** calling the inner service; otherwise delegate.
4. \`impl<S> Layer<S> for TimeoutLayer\` with \`type Svc = Timeout<S>\`, carrying \`limit_ms\` through.

Expected output:

\`\`\`text
method      cost_ms  outcome
ping              5  ok in 5ms
report          250  -32001 Request timeout
sum              90  ok in 90ms
export          400  -32001 Request timeout
ping             12  ok in 12ms
requests: 5, reached the backend: 3
\`\`\`

### Hints

- \`stack.inner\` is the \`Counted\`, because the timeout is the outer layer — that is what makes the count readable at the end.
- Nothing sleeps. The cost is data on the request; the timeout is a comparison.
- Flip the two layers and every request would reach the backend. The counter is the evidence that order is a design decision.
`,
    starterCode: `struct Req {
    method: &'static str,
    cost_ms: u64,
}

#[derive(Debug)]
enum Resp {
    Ok(u64),
    Err(i64, &'static str),
}

trait Service {
    fn call(&mut self, req: &Req) -> Resp;
}

trait Layer<S> {
    type Svc;
    fn layer(&self, inner: S) -> Self::Svc;
}

fn row(method: &str, cost_ms: &str, outcome: &str) {
    println!("{:<10} {:>8}  {}", method, cost_ms, outcome);
}

struct Backend;

impl Service for Backend {
    fn call(&mut self, req: &Req) -> Resp {
        Resp::Ok(req.cost_ms)
    }
}

// Four impls to write: Service for Counted<S>, Layer<S> for CountLayer,
// Service for Timeout<S>, Layer<S> for TimeoutLayer.

struct Counted<S> {
    inner: S,
    calls: u32,
}

struct CountLayer;

struct Timeout<S> {
    inner: S,
    limit_ms: u64,
}

struct TimeoutLayer {
    limit_ms: u64,
}

fn main() {
    let mut stack = TimeoutLayer { limit_ms: 100 }.layer(CountLayer.layer(Backend));

    let traffic = [
        Req { method: "ping", cost_ms: 5 },
        Req { method: "report", cost_ms: 250 },
        Req { method: "sum", cost_ms: 90 },
        Req { method: "export", cost_ms: 400 },
        Req { method: "ping", cost_ms: 12 },
    ];

    row("method", "cost_ms", "outcome");
    for req in traffic.iter() {
        let outcome = match stack.call(req) {
            Resp::Ok(ms) => format!("ok in {}ms", ms),
            Resp::Err(code, message) => format!("{} {}", code, message),
        };
        row(req.method, &req.cost_ms.to_string(), &outcome);
    }

    println!("requests: 5, reached the backend: {}", stack.inner.calls);
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "the counting wrapper is itself a Service",
        kind: "any_of",
        of: [
          {
            kind: "impl_defined",
            type: "Counted<S>",
            trait: "Service"
          },
          {
            kind: "impl_defined",
            type: "Counted",
            trait: "Service"
          }
        ]
      },
      {
        name: "the timeout wrapper is itself a Service",
        kind: "any_of",
        of: [
          {
            kind: "impl_defined",
            type: "Timeout<S>",
            trait: "Service"
          },
          {
            kind: "impl_defined",
            type: "Timeout",
            trait: "Service"
          }
        ]
      },
      {
        name: "CountLayer builds its service through Layer",
        kind: "any_of",
        of: [
          {
            kind: "impl_defined",
            type: "CountLayer",
            trait: "Layer<S>"
          },
          {
            kind: "impl_defined",
            type: "CountLayer",
            trait: "Layer"
          }
        ]
      },
      {
        name: "TimeoutLayer builds its service through Layer",
        kind: "any_of",
        of: [
          {
            kind: "impl_defined",
            type: "TimeoutLayer",
            trait: "Layer<S>"
          },
          {
            kind: "impl_defined",
            type: "TimeoutLayer",
            trait: "Layer"
          }
        ]
      },
      {
        name: "each wrapper delegates to the service it wraps",
        kind: "expr_present",
        expr: "self.inner.call(req)"
      },
      {
        name: "an over-budget request is rejected before the inner call",
        kind: "expr_present",
        expr: "Resp::Err(-32001, \"Request timeout\")"
      },
      {
        name: "decides the timeout from the request, never by sleeping",
        kind: "expr_present",
        expr: "thread::sleep",
        forbidden: true
      }
    ],
    expectedOutput: "method      cost_ms  outcome\nping              5  ok in 5ms\nreport          250  -32001 Request timeout\nsum              90  ok in 90ms\nexport          400  -32001 Request timeout\nping             12  ok in 12ms\nrequests: 5, reached the backend: 3\n",
    referenceSolution: `struct Req {
    method: &'static str,
    cost_ms: u64,
}

#[derive(Debug)]
enum Resp {
    Ok(u64),
    Err(i64, &'static str),
}

trait Service {
    fn call(&mut self, req: &Req) -> Resp;
}

trait Layer<S> {
    type Svc;
    fn layer(&self, inner: S) -> Self::Svc;
}

fn row(method: &str, cost_ms: &str, outcome: &str) {
    println!("{:<10} {:>8}  {}", method, cost_ms, outcome);
}

struct Backend;

impl Service for Backend {
    fn call(&mut self, req: &Req) -> Resp {
        Resp::Ok(req.cost_ms)
    }
}

struct Counted<S> {
    inner: S,
    calls: u32,
}

impl<S: Service> Service for Counted<S> {
    fn call(&mut self, req: &Req) -> Resp {
        self.calls += 1;
        self.inner.call(req)
    }
}

struct CountLayer;

impl<S> Layer<S> for CountLayer {
    type Svc = Counted<S>;
    fn layer(&self, inner: S) -> Counted<S> {
        Counted { inner, calls: 0 }
    }
}

struct Timeout<S> {
    inner: S,
    limit_ms: u64,
}

impl<S: Service> Service for Timeout<S> {
    fn call(&mut self, req: &Req) -> Resp {
        if req.cost_ms > self.limit_ms {
            return Resp::Err(-32001, "Request timeout");
        }
        self.inner.call(req)
    }
}

struct TimeoutLayer {
    limit_ms: u64,
}

impl<S> Layer<S> for TimeoutLayer {
    type Svc = Timeout<S>;
    fn layer(&self, inner: S) -> Timeout<S> {
        Timeout { inner, limit_ms: self.limit_ms }
    }
}

fn main() {
    let mut stack = TimeoutLayer { limit_ms: 100 }.layer(CountLayer.layer(Backend));

    let traffic = [
        Req { method: "ping", cost_ms: 5 },
        Req { method: "report", cost_ms: 250 },
        Req { method: "sum", cost_ms: 90 },
        Req { method: "export", cost_ms: 400 },
        Req { method: "ping", cost_ms: 12 },
    ];

    row("method", "cost_ms", "outcome");
    for req in traffic.iter() {
        let outcome = match stack.call(req) {
            Resp::Ok(ms) => format!("ok in {}ms", ms),
            Resp::Err(code, message) => format!("{} {}", code, message),
        };
        row(req.method, &req.cost_ms.to_string(), &outcome);
    }

    println!("requests: 5, reached the backend: {}", stack.inner.calls);
}
`,
  },

  "backend-rpc-services-5": {
    instructions: `## Shed or queue

A concurrency limit is the only knob that bounds a service. Threads, connections, database handles: something is finite, and if you do not choose the number the machine chooses it for you badly. When the permits are gone the limiter has exactly two options, and this simulation runs both against identical traffic.

Little's Law says \`L = λW\`: at an arrival rate above service capacity, queue length and wait grow without bound. A request that waits 150ms behind a full pool and then runs 150ms has burned the backend's time to produce a 300ms answer for a client whose deadline was 200ms — a client that has already retried, doubling λ. That is the metastable failure: the service is not down, it is spending all its capacity on work that will be thrown away.

### Your task

Complete \`simulate\`. For each arrival, in order:

1. Set \`now = req.at_ms\` and \`retain\` only the entries of \`busy_until\` that are still \`> now\`.
2. If \`busy_until.len() == CAPACITY\` and \`shed_early\`, count a rejection and print the row with wait \`0\`, latency \`0\`, backend \`"no"\`, outcome \`"-32002 Server busy"\`, then move on.
3. Otherwise pick a start time: \`now\` if there is a free slot, else the **earliest** finish time in \`busy_until\` — remove that slot and start there.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`; push \`finish\`.
5. A \`latency > DEADLINE_MS\` counts a rejection, adds \`req.cost_ms\` to \`doomed_ms\`, and reads \`"-32001 Request timeout"\`; otherwise \`"ok"\`. Print the row with backend \`"yes"\`.

Expected output:

\`\`\`text
policy: shed early
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0      0        0        no  -32002 Server busy
  4       0      0        0        no  -32002 Server busy
  5      10      0        0        no  -32002 Server busy
failed: 3, backend-ms spent on doomed work: 0

policy: queue everything
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0    150      300       yes  -32001 Request timeout
  4       0    150      300       yes  -32001 Request timeout
  5      10    290      310       yes  -32001 Request timeout
failed: 3, backend-ms spent on doomed work: 320
\`\`\`

### Hints

- \`busy_until.iter().min()\` finds the earliest free slot; \`position\` then locates it for \`remove\`.
- The wait column is \`start - now\`.
- Read the two totals against each other: the same three failures either way, and 320ms of backend time as the only thing queueing bought.
`,
    starterCode: `struct Arrival {
    id: u32,
    at_ms: u64,
    cost_ms: u64,
}

fn row(id: &str, arrive: &str, wait: &str, latency: &str, backend: &str, outcome: &str) {
    println!("{:>3} {:>7} {:>6} {:>8} {:>9}  {}", id, arrive, wait, latency, backend, outcome);
}

const CAPACITY: usize = 2;
const DEADLINE_MS: u64 = 200;

fn simulate(shed_early: bool) {
    let traffic = [
        Arrival { id: 1, at_ms: 0, cost_ms: 150 },
        Arrival { id: 2, at_ms: 0, cost_ms: 150 },
        Arrival { id: 3, at_ms: 0, cost_ms: 150 },
        Arrival { id: 4, at_ms: 0, cost_ms: 150 },
        Arrival { id: 5, at_ms: 10, cost_ms: 20 },
    ];

    let mut busy_until: Vec<u64> = Vec::new();
    let mut rejected = 0;
    let mut doomed_ms = 0;

    println!("policy: {}", if shed_early { "shed early" } else { "queue everything" });
    row("id", "arrive", "wait", "latency", "backend", "outcome");

    // Retire finished work, then either admit, shed, or queue behind the
    // earliest free slot. A queued request still costs the backend its full
    // service time even when it lands past the deadline.

    println!("failed: {}, backend-ms spent on doomed work: {}", rejected, doomed_ms);
}

fn main() {
    simulate(true);
    println!();
    simulate(false);
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "runs both admission policies from one simulation",
        kind: "fn_defined",
        fn: "simulate",
        params: [
          {
            name: "shed_early",
            ty: "bool"
          }
        ]
      },
      {
        name: "retires finished work before admitting anything",
        kind: "method_called",
        method: "retain",
        receiver: "busy_until"
      },
      {
        name: "queues behind the earliest free slot",
        kind: "method_called",
        method: "min",
        receiver: "busy_until.iter()"
      },
      {
        name: "sheds with a documented server-busy code",
        kind: "expr_present",
        expr: "\"-32002 Server busy\""
      },
      {
        name: "still times out the work it chose to queue",
        kind: "expr_present",
        expr: "\"-32001 Request timeout\""
      },
      {
        name: "measures latency against the deadline, not the service time",
        kind: "expr_present",
        expr: "latency > DEADLINE_MS"
      },
      {
        name: "simulates the clock rather than sleeping",
        kind: "expr_present",
        expr: "thread::sleep",
        forbidden: true
      }
    ],
    expectedOutput: "policy: shed early\n id  arrive   wait  latency   backend  outcome\n  1       0      0      150       yes  ok\n  2       0      0      150       yes  ok\n  3       0      0        0        no  -32002 Server busy\n  4       0      0        0        no  -32002 Server busy\n  5      10      0        0        no  -32002 Server busy\nfailed: 3, backend-ms spent on doomed work: 0\n\npolicy: queue everything\n id  arrive   wait  latency   backend  outcome\n  1       0      0      150       yes  ok\n  2       0      0      150       yes  ok\n  3       0    150      300       yes  -32001 Request timeout\n  4       0    150      300       yes  -32001 Request timeout\n  5      10    290      310       yes  -32001 Request timeout\nfailed: 3, backend-ms spent on doomed work: 320\n",
    referenceSolution: `struct Arrival {
    id: u32,
    at_ms: u64,
    cost_ms: u64,
}

fn row(id: &str, arrive: &str, wait: &str, latency: &str, backend: &str, outcome: &str) {
    println!("{:>3} {:>7} {:>6} {:>8} {:>9}  {}", id, arrive, wait, latency, backend, outcome);
}

const CAPACITY: usize = 2;
const DEADLINE_MS: u64 = 200;

fn simulate(shed_early: bool) {
    let traffic = [
        Arrival { id: 1, at_ms: 0, cost_ms: 150 },
        Arrival { id: 2, at_ms: 0, cost_ms: 150 },
        Arrival { id: 3, at_ms: 0, cost_ms: 150 },
        Arrival { id: 4, at_ms: 0, cost_ms: 150 },
        Arrival { id: 5, at_ms: 10, cost_ms: 20 },
    ];

    let mut busy_until: Vec<u64> = Vec::new();
    let mut rejected = 0;
    let mut doomed_ms = 0;

    println!("policy: {}", if shed_early { "shed early" } else { "queue everything" });
    row("id", "arrive", "wait", "latency", "backend", "outcome");

    for req in traffic.iter() {
        let now = req.at_ms;
        busy_until.retain(|finish| *finish > now);

        if busy_until.len() == CAPACITY && shed_early {
            rejected += 1;
            row(&req.id.to_string(), &now.to_string(), "0", "0", "no", "-32002 Server busy");
            continue;
        }

        let start = if busy_until.len() < CAPACITY {
            now
        } else {
            let earliest = *busy_until.iter().min().unwrap();
            let slot = busy_until.iter().position(|f| *f == earliest).unwrap();
            busy_until.remove(slot);
            earliest
        };

        let finish = start + req.cost_ms;
        let latency = finish - now;
        busy_until.push(finish);

        let outcome = if latency > DEADLINE_MS {
            rejected += 1;
            doomed_ms += req.cost_ms;
            "-32001 Request timeout"
        } else {
            "ok"
        };
        row(&req.id.to_string(), &now.to_string(), &(start - now).to_string(), &latency.to_string(), "yes", outcome);
    }

    println!("failed: {}, backend-ms spent on doomed work: {}", rejected, doomed_ms);
}

fn main() {
    simulate(true);
    println!();
    simulate(false);
}
`,
  },

  "backend-rpc-services-6": {
    instructions: `## A token bucket per client

A bucket holds up to \`capacity\` tokens and refills at a fixed rate; a request costs one token and a request that cannot pay is rejected. Two properties fall out: the bucket permits a burst of \`capacity\` and then settles to exactly the refill rate. A fixed window of 60/minute lets a client send 120 requests across a window boundary; a bucket never does.

Do **not** run a refill timer. Refill lazily on access from \`(now - last_seen) * rate\`, clamped at capacity: one arithmetic line, no background task, two integers of state per client. Everything here is in milli-tokens so integer arithmetic stays exact, and \`(deficit + rate - 1) / rate\` is the ceiling division that turns a shortfall into a \`retry_after\` the client can honour.

### Your task

1. \`Bucket::new\` starts a client full: \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\` credits \`(now_ms - self.last_ms) * REFILL_PER_MS\`, clamps with \`.min(CAPACITY)\`, and stores \`last_ms = now_ms\`.
3. \`take\` returns \`Ok(self.tokens)\` after subtracting \`COST\` when there are enough tokens. Otherwise compute \`deficit = COST - self.tokens\` and return \`Err((deficit + REFILL_PER_MS - 1) / REFILL_PER_MS)\` — the milliseconds until one whole token exists. A denial spends nothing.

Expected output:

\`\`\`text
  t_ms client   before   after  outcome
     0 alice     5.000   4.000  allowed
     0 alice     4.000   3.000  allowed
     0 alice     3.000   2.000  allowed
     0 alice     2.000   1.000  allowed
     0 alice     1.000   0.000  allowed
     0 alice     0.000   0.000  -32005 Rate limit exceeded, retry_after_ms=200
   200 alice     1.000   0.000  allowed
   250 alice     0.250   0.250  -32005 Rate limit exceeded, retry_after_ms=150
   250 bob       5.000   4.000  allowed
  1500 alice     5.000   4.000  allowed
final alice: 4.000 tokens
final bob: 4.000 tokens
\`\`\`

### Hints

- \`BTreeMap\` keeps the final listing in a fixed order; a \`HashMap\` would not.
- \`bob\` arrives at t=250 with a full bucket — the state is per key, and choosing the key is the policy.
- At t=1500 alice is back at capacity: 1250ms of credit clamped down to 5 tokens, not 6.25.
`,
    starterCode: `use std::collections::BTreeMap;

const CAPACITY: u64 = 5_000; // 5 tokens, in milli-tokens
const REFILL_PER_MS: u64 = 5; // 5 milli-tokens per ms = 5 tokens per second
const COST: u64 = 1_000; // one request costs one token

fn row(t_ms: &str, client: &str, before: &str, after: &str, outcome: &str) {
    println!("{:>6} {:<7} {:>7} {:>7}  {}", t_ms, client, before, after, outcome);
}

struct Bucket {
    tokens: u64,
    last_ms: u64,
}

impl Bucket {
    fn new() -> Bucket {
        // a new client starts with a full bucket
        todo!()
    }

    fn refill(&mut self, now_ms: u64) {
        // credit the elapsed milliseconds, never above the capacity
    }

    fn take(&mut self) -> Result<u64, u64> {
        // Ok(tokens left) or Err(ms until one whole token exists)
        todo!()
    }
}

fn tokens(milli: u64) -> String {
    format!("{}.{:03}", milli / 1000, milli % 1000)
}

fn main() {
    let traffic: [(u64, &str); 10] = [
        (0, "alice"),
        (0, "alice"),
        (0, "alice"),
        (0, "alice"),
        (0, "alice"),
        (0, "alice"),
        (200, "alice"),
        (250, "alice"),
        (250, "bob"),
        (1500, "alice"),
    ];

    let mut buckets: BTreeMap<&str, Bucket> = BTreeMap::new();

    row("t_ms", "client", "before", "after", "outcome");
    for (now_ms, client) in traffic.iter() {
        let bucket = buckets.entry(client).or_insert_with(Bucket::new);
        bucket.refill(*now_ms);
        let before = bucket.tokens;
        match bucket.take() {
            Ok(left) => row(&now_ms.to_string(), client, &tokens(before), &tokens(left), "allowed"),
            Err(retry_after) => row(
                &now_ms.to_string(),
                client,
                &tokens(before),
                &tokens(bucket.tokens),
                &format!("-32005 Rate limit exceeded, retry_after_ms={}", retry_after),
            ),
        }
    }

    for (client, bucket) in buckets.iter() {
        println!("final {}: {} tokens", client, tokens(bucket.tokens));
    }
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "refills lazily from the elapsed time",
        kind: "fn_defined",
        fn: "refill",
        params: [
          {
            name: "now_ms",
            ty: "u64"
          }
        ]
      },
      {
        name: "a denial carries the wait, not just a failure",
        kind: "fn_defined",
        fn: "take",
        returns: "Result<u64, u64>"
      },
      {
        name: "never refills past the bucket capacity",
        kind: "method_called",
        method: "min",
        args: "CAPACITY"
      },
      {
        name: "an allowed request spends a token",
        kind: "any_of",
        of: [
          { kind: "expr_present", expr: "self.tokens -= COST" },
          { kind: "expr_present", expr: "self.tokens = self.tokens - COST" }
        ]
      },
      {
        name: "computes the shortfall to derive retry_after",
        kind: "expr_present",
        expr: "COST - self.tokens"
      },
      {
        name: "reads the simulated clock, never the wall clock",
        kind: "any_of",
        forbidden: true,
        of: [
          {
            kind: "expr_present",
            expr: "Instant::now"
          },
          {
            kind: "expr_present",
            expr: "SystemTime::now"
          }
        ]
      }
    ],
    expectedOutput: "  t_ms client   before   after  outcome\n     0 alice     5.000   4.000  allowed\n     0 alice     4.000   3.000  allowed\n     0 alice     3.000   2.000  allowed\n     0 alice     2.000   1.000  allowed\n     0 alice     1.000   0.000  allowed\n     0 alice     0.000   0.000  -32005 Rate limit exceeded, retry_after_ms=200\n   200 alice     1.000   0.000  allowed\n   250 alice     0.250   0.250  -32005 Rate limit exceeded, retry_after_ms=150\n   250 bob       5.000   4.000  allowed\n  1500 alice     5.000   4.000  allowed\nfinal alice: 4.000 tokens\nfinal bob: 4.000 tokens\n",
    referenceSolution: `use std::collections::BTreeMap;

const CAPACITY: u64 = 5_000; // 5 tokens, in milli-tokens
const REFILL_PER_MS: u64 = 5; // 5 milli-tokens per ms = 5 tokens per second
const COST: u64 = 1_000; // one request costs one token

fn row(t_ms: &str, client: &str, before: &str, after: &str, outcome: &str) {
    println!("{:>6} {:<7} {:>7} {:>7}  {}", t_ms, client, before, after, outcome);
}

struct Bucket {
    tokens: u64,
    last_ms: u64,
}

impl Bucket {
    fn new() -> Bucket {
        Bucket { tokens: CAPACITY, last_ms: 0 }
    }

    fn refill(&mut self, now_ms: u64) {
        let earned = (now_ms - self.last_ms) * REFILL_PER_MS;
        self.tokens = (self.tokens + earned).min(CAPACITY);
        self.last_ms = now_ms;
    }

    fn take(&mut self) -> Result<u64, u64> {
        if self.tokens >= COST {
            self.tokens -= COST;
            Ok(self.tokens)
        } else {
            let deficit = COST - self.tokens;
            Err((deficit + REFILL_PER_MS - 1) / REFILL_PER_MS)
        }
    }
}

fn tokens(milli: u64) -> String {
    format!("{}.{:03}", milli / 1000, milli % 1000)
}

fn main() {
    let traffic: [(u64, &str); 10] = [
        (0, "alice"),
        (0, "alice"),
        (0, "alice"),
        (0, "alice"),
        (0, "alice"),
        (0, "alice"),
        (200, "alice"),
        (250, "alice"),
        (250, "bob"),
        (1500, "alice"),
    ];

    let mut buckets: BTreeMap<&str, Bucket> = BTreeMap::new();

    row("t_ms", "client", "before", "after", "outcome");
    for (now_ms, client) in traffic.iter() {
        let bucket = buckets.entry(client).or_insert_with(Bucket::new);
        bucket.refill(*now_ms);
        let before = bucket.tokens;
        match bucket.take() {
            Ok(left) => row(&now_ms.to_string(), client, &tokens(before), &tokens(left), "allowed"),
            Err(retry_after) => row(
                &now_ms.to_string(),
                client,
                &tokens(before),
                &tokens(bucket.tokens),
                &format!("-32005 Rate limit exceeded, retry_after_ms={}", retry_after),
            ),
        }
    }

    for (client, bucket) in buckets.iter() {
        println!("final {}: {} tokens", client, tokens(bucket.tokens));
    }
}
`,
  },

  "backend-rpc-services-7": {
    instructions: `## Prove OFFSET drops a row

\`offset=3&limit=3\` means "count three rows from the start of the collection **as it exists right now**". Between page 1 and page 2 the collection changes — one row is deleted and everything after it shifts down one, so page 2 starts one row late and a row the client has never seen is skipped forever. An insert produces the mirror bug: a duplicate.

A cursor encodes the last row's position in a stable total order (\`WHERE id > $cursor ORDER BY id LIMIT n\`), so the next page is defined by content rather than by a count, and edits before the cursor cannot shift it. Two contract details: order by something unique — \`created_at\` alone loses rows sharing a timestamp, so the key is \`(created_at, id)\` — and make the token opaque so you can change what is inside it without breaking clients.

Termination is part of the contract too. The next cursor is **absent** on the last page; that, not an empty page, is how a client knows it is done.

### Your task

1. \`page_by_offset\` returns \`ids.iter().skip(offset).take(limit)\` collected — counting from the start of whatever table it is handed.
2. \`page_by_cursor\` keeps ids strictly greater than the cursor (all of them when \`after\` is \`None\`), takes \`limit\`, and returns the page with its next cursor: the page's **last** id when \`page.len() == limit\`, and \`None\` when the page was short.
3. \`missed\` returns the surviving rows that never appeared on any page.

\`main\` deletes row 2 between page 1 and page 2 for both clients.

Expected output:

\`\`\`text
api=v1  page_size=3  row 2 is deleted between page 1 and page 2
client     req_id   argument     page
offset     a-1      offset=0     [1, 2, 3]
offset     a-2      offset=3     [5, 6, 7]
offset     a-3      offset=6     [8, 9]
cursor     b-1      after=start  [1, 2, 3]
cursor     b-2      after=3      [4, 5, 6]
cursor     b-3      after=6      [7, 8, 9]
rows still in the table: [1, 3, 4, 5, 6, 7, 8, 9]
offset client never saw: [4]
cursor client never saw: []
\`\`\`

### Hints

- \`page.last().copied()\` gives \`Option<u64>\` straight from a \`Vec<u64>\`.
- Row 4 is the row the offset client loses — it is still in the table and it appeared on no page.
- The \`req_id\` column is the other half of the contract: generate one at the edge, echo it in every response, and put it in every log line and downstream call.
`,
    starterCode: `fn row(client: &str, req_id: &str, argument: &str, page: &str) {
    println!("{:<10} {:<8} {:<12} {}", client, req_id, argument, page);
}

fn page_by_offset(ids: &[u64], offset: usize, limit: usize) -> Vec<u64> {
    // count rows from the start of the current table, every time
    todo!()
}

fn page_by_cursor(ids: &[u64], after: Option<u64>, limit: usize) -> (Vec<u64>, Option<u64>) {
    // rows strictly after the cursor; the next cursor is the last id of a
    // full page, and None when the page was short
    todo!()
}

fn missed(seen: &[u64], surviving: &[u64]) -> Vec<u64> {
    // rows that are still in the table but never appeared on a page
    todo!()
}

fn main() {
    let limit = 3;
    let full: Vec<u64> = (1..=9).collect();
    let after_delete: Vec<u64> = full.iter().filter(|id| **id != 2).copied().collect();

    println!("api=v1  page_size=3  row 2 is deleted between page 1 and page 2");

    let mut offset_seen: Vec<u64> = Vec::new();
    row("client", "req_id", "argument", "page");
    for page_no in 0..3 {
        let table = if page_no == 0 { &full } else { &after_delete };
        let offset = page_no * limit;
        let page = page_by_offset(table, offset, limit);
        offset_seen.extend(page.iter().copied());
        row("offset", &format!("a-{}", page_no + 1), &format!("offset={}", offset), &format!("{:?}", page));
    }

    let mut cursor_seen: Vec<u64> = Vec::new();
    let mut cursor: Option<u64> = None;
    for page_no in 0..3 {
        let table = if page_no == 0 { &full } else { &after_delete };
        let argument = match cursor {
            Some(c) => format!("after={}", c),
            None => "after=start".to_string(),
        };
        let (page, next) = page_by_cursor(table, cursor, limit);
        cursor_seen.extend(page.iter().copied());
        cursor = next;
        row("cursor", &format!("b-{}", page_no + 1), &argument, &format!("{:?}", page));
    }

    println!("rows still in the table: {:?}", after_delete);
    println!("offset client never saw: {:?}", missed(&offset_seen, &after_delete));
    println!("cursor client never saw: {:?}", missed(&cursor_seen, &after_delete));
}
`,
    grader: "sandbox",
    astChecks: [
      {
        name: "offset paging counts rows from the start",
        kind: "fn_defined",
        fn: "page_by_offset",
        returns: "Vec<u64>"
      },
      {
        name: "cursor paging returns the page and the next cursor",
        kind: "fn_defined",
        fn: "page_by_cursor",
        returns: "(Vec<u64>, Option<u64>)"
      },
      {
        name: "the offset page skips rows by count",
        kind: "method_called",
        method: "skip"
      },
      {
        name: "the cursor page selects by id rather than by count",
        kind: "method_called",
        method: "filter"
      },
      {
        name: "the next cursor is the last id on the page",
        kind: "method_called",
        method: "last",
        receiver: "page"
      },
      {
        name: "a short page ends the walk instead of an empty one",
        kind: "expr_present",
        expr: "page.len() == limit"
      },
      {
        name: "reports the rows a client never received",
        kind: "fn_defined",
        fn: "missed",
        returns: "Vec<u64>"
      }
    ],
    expectedOutput: "api=v1  page_size=3  row 2 is deleted between page 1 and page 2\nclient     req_id   argument     page\noffset     a-1      offset=0     [1, 2, 3]\noffset     a-2      offset=3     [5, 6, 7]\noffset     a-3      offset=6     [8, 9]\ncursor     b-1      after=start  [1, 2, 3]\ncursor     b-2      after=3      [4, 5, 6]\ncursor     b-3      after=6      [7, 8, 9]\nrows still in the table: [1, 3, 4, 5, 6, 7, 8, 9]\noffset client never saw: [4]\ncursor client never saw: []\n",
    referenceSolution: `fn row(client: &str, req_id: &str, argument: &str, page: &str) {
    println!("{:<10} {:<8} {:<12} {}", client, req_id, argument, page);
}

fn page_by_offset(ids: &[u64], offset: usize, limit: usize) -> Vec<u64> {
    ids.iter().skip(offset).take(limit).copied().collect()
}

fn page_by_cursor(ids: &[u64], after: Option<u64>, limit: usize) -> (Vec<u64>, Option<u64>) {
    let page: Vec<u64> = ids
        .iter()
        .filter(|id| match after {
            Some(cursor) => **id > cursor,
            None => true,
        })
        .take(limit)
        .copied()
        .collect();
    let next = if page.len() == limit { page.last().copied() } else { None };
    (page, next)
}

fn missed(seen: &[u64], surviving: &[u64]) -> Vec<u64> {
    surviving.iter().filter(|id| !seen.contains(id)).copied().collect()
}

fn main() {
    let limit = 3;
    let full: Vec<u64> = (1..=9).collect();
    let after_delete: Vec<u64> = full.iter().filter(|id| **id != 2).copied().collect();

    println!("api=v1  page_size=3  row 2 is deleted between page 1 and page 2");

    let mut offset_seen: Vec<u64> = Vec::new();
    row("client", "req_id", "argument", "page");
    for page_no in 0..3 {
        let table = if page_no == 0 { &full } else { &after_delete };
        let offset = page_no * limit;
        let page = page_by_offset(table, offset, limit);
        offset_seen.extend(page.iter().copied());
        row("offset", &format!("a-{}", page_no + 1), &format!("offset={}", offset), &format!("{:?}", page));
    }

    let mut cursor_seen: Vec<u64> = Vec::new();
    let mut cursor: Option<u64> = None;
    for page_no in 0..3 {
        let table = if page_no == 0 { &full } else { &after_delete };
        let argument = match cursor {
            Some(c) => format!("after={}", c),
            None => "after=start".to_string(),
        };
        let (page, next) = page_by_cursor(table, cursor, limit);
        cursor_seen.extend(page.iter().copied());
        cursor = next;
        row("cursor", &format!("b-{}", page_no + 1), &argument, &format!("{:?}", page));
    }

    println!("rows still in the table: {:?}", after_delete);
    println!("offset client never saw: {:?}", missed(&offset_seen, &after_delete));
    println!("cursor client never saw: {:?}", missed(&cursor_seen, &after_delete));
}
`,
  },
};
