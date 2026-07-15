//! tusst-syntest — AST-based structural checks for TUSST lesson submissions.
//!
//! The server ships a declarative spec (see [`spec`]); this crate parses the
//! student's source with syn and answers each check. All comparisons happen on
//! normalized token streams, so whitespace and comments never matter (code
//! inside comments or string literals does NOT count — it's not in the AST).
//!
//! Unparseable source: `syntax_ok` is false and every check reports
//! `passed: false` (including `forbidden` ones — the verdict already fails
//! via the "compiles" check, whose rustc error message is the useful one).

mod eval;
pub mod spec;
mod tokens;

use eval::{eval_kind, Index};
pub use spec::{parse_spec, Check, CheckSpecFile, SCHEMA_VERSION};

#[derive(Debug)]
pub struct CheckOutcome {
    pub name: String,
    pub passed: bool,
}

#[derive(Debug)]
pub struct EvalResult {
    pub syntax_ok: bool,
    pub outcomes: Vec<CheckOutcome>,
    /// Spec snippets that failed to parse — authoring bugs, surfaced to the
    /// server log via the report's `spec_error`, never to the student.
    pub spec_errors: Vec<String>,
}

pub fn evaluate(source: &str, checks: &[Check]) -> EvalResult {
    let file = match syn::parse_file(source) {
        Ok(f) => f,
        Err(_) => {
            return EvalResult {
                syntax_ok: false,
                outcomes: checks
                    .iter()
                    .map(|c| CheckOutcome {
                        name: c.name.clone(),
                        passed: false,
                    })
                    .collect(),
                spec_errors: Vec::new(),
            }
        }
    };

    let idx = Index::build(&file);
    let mut spec_errors = Vec::new();
    let outcomes = checks
        .iter()
        .map(|c| {
            let passed = match eval_kind(&c.kind, &idx) {
                Ok(found) => {
                    if c.forbidden {
                        !found
                    } else {
                        found
                    }
                }
                Err(e) => {
                    spec_errors.push(e);
                    false
                }
            };
            CheckOutcome {
                name: c.name.clone(),
                passed,
            }
        })
        .collect();

    EvalResult {
        syntax_ok: true,
        outcomes,
        spec_errors,
    }
}
