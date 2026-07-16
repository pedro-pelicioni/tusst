import "server-only";

// Declarative AST check specs for sandbox lessons.
//
// SERVER-ONLY: these are the hidden tests. They are serialized to JSON and
// piped to the tusst-runner container over STDIN (never mounted on disk —
// the student's program can read /submission) where the tusst-syntest crate
// evaluates them against the parsed AST.
//
// This union mirrors the serde enum in
// runner/crates/tusst-syntest/src/spec.rs 1:1. Changing either side means
// changing both and bumping the schema version (the crate's `errors.rs`
// tests pin the wire shape; the runner rejects mismatched versions at
// runtime).
//
// All code-shaped params (`expr`, `ty`, `pat`, `init`, `args`, ...) are Rust
// source snippets compared by normalized token stream — whitespace and
// comments never matter, and code inside comments or string literals does
// NOT count (it isn't in the AST).

export const CHECKS_SCHEMA_VERSION = 2;

export type AstCheckSpec =
  | {
      kind: "fn_defined";
      fn: string;
      params?: { name?: string; ty: string }[];
      returns?: string;
    }
  | {
      kind: "let_binding";
      var: string;
      mutable?: boolean;
      ty?: string;
      init?: string;
    }
  | { kind: "macro_invoked"; macro: string; args?: string }
  | { kind: "method_called"; method: string; receiver?: string; args?: string }
  | { kind: "expr_present"; expr: string }
  | {
      kind: "uses_construct";
      construct: "loop" | "if" | "else" | "match" | "for" | "while";
    }
  | { kind: "for_loop"; pat?: string; iter?: string }
  | { kind: "while_loop"; cond?: string }
  | { kind: "if_let"; pat: string; scrutinee?: string }
  | { kind: "match_on"; scrutinee: string }
  | { kind: "match_arm"; pat: string; body?: string }
  | { kind: "tail_expr"; fn?: string; expr: string }
  | {
      kind: "struct_defined";
      struct: string;
      fields?: { name?: string; ty: string }[];
    }
  | {
      kind: "impl_defined";
      type: string;
      trait?: string;
    }
  | {
      kind: "derive_present";
      type: string;
      derives: string[];
    }
  | { kind: "any_of"; of: AstCheckSpec[] };

export type AstCheck = {
  name: string; // user-facing test name (safe to return)
  forbidden?: boolean; // if true, the shape must NOT be present
} & AstCheckSpec;

export function serializeChecks(checks: AstCheck[]): string {
  return JSON.stringify({
    schema_version: CHECKS_SCHEMA_VERSION,
    checks,
  });
}
