//! tusst-checkfile — run a lesson's AST check spec against a .rs file, locally.
//!
//! `npm run check:advanced` already compiles every `referenceSolution` and
//! diffs stdout. It never asked the other half of the question: do the lesson's
//! own `astChecks` actually hold on that same solution? A typo'd `expr`, a
//! renamed helper, or a `forbidden` check the reference solution happens to
//! trip produces a lesson that marks CORRECT student code as wrong — and the
//! student has no way to tell whether they or the lesson is broken.
//!
//! This binary closes that gap on the host. It is the same evaluator the
//! hardened runner uses (`tusst_syntest::evaluate`), driven from files instead
//! of from stdin + a read-only mount. No docker, no compilation, no network.
//!
//!   tusst-checkfile <checks.json|-> <source.rs> [--json]
//!
//! Exit: 0 = every check holds. 1 = at least one check failed or the spec had
//! an authoring error. 2 = usage / I/O trouble (the caller should treat this as
//! infra, not as a broken lesson).

use std::process::ExitCode;

use tusst_syntest::{evaluate, parse_spec, Check};

/// Why a single check did not hold. `None` means it did.
enum Verdict {
    Passed,
    /// Non-forbidden check: the shape is absent from the source.
    NotFound,
    /// `forbidden: true` check: the shape IS present.
    ForbiddenPresent,
    /// The spec snippet itself failed to parse — an authoring bug in the
    /// lesson, not a property of the source.
    SpecError(String),
    /// The source is not parseable Rust; syntest fails every check by design.
    SyntaxError,
}

impl Verdict {
    fn ok(&self) -> bool {
        matches!(self, Verdict::Passed)
    }

    fn code(&self) -> &'static str {
        match self {
            Verdict::Passed => "passed",
            Verdict::NotFound => "not_found",
            Verdict::ForbiddenPresent => "forbidden_present",
            Verdict::SpecError(_) => "spec_error",
            Verdict::SyntaxError => "syntax_error",
        }
    }

    fn detail(&self) -> String {
        match self {
            Verdict::Passed => "ok".to_string(),
            Verdict::NotFound => "pattern not found in the source".to_string(),
            Verdict::ForbiddenPresent => {
                "forbidden pattern IS present in the source".to_string()
            }
            Verdict::SpecError(e) => format!("spec snippet does not parse: {e}"),
            Verdict::SyntaxError => "source is not parseable Rust".to_string(),
        }
    }
}

fn usage() -> ExitCode {
    eprintln!("usage: tusst-checkfile <checks.json|-> <source.rs> [--json]");
    ExitCode::from(2)
}

fn fail(msg: String) -> ExitCode {
    eprintln!("tusst-checkfile: {msg}");
    ExitCode::from(2)
}

fn read_input(path: &str) -> Result<String, String> {
    if path == "-" {
        use std::io::Read;
        let mut s = String::new();
        std::io::stdin()
            .read_to_string(&mut s)
            .map_err(|e| format!("read stdin: {e}"))?;
        Ok(s)
    } else {
        std::fs::read_to_string(path).map_err(|e| format!("read {path}: {e}"))
    }
}

/// Evaluate one check at a time.
///
/// `evaluate` returns `spec_errors` as a flat list with no back-reference to
/// the check that produced them, and folds `forbidden` into `passed`. Feeding
/// it a one-element slice recovers both: the error belongs to this check, and
/// the check's own `forbidden` flag says which way a `false` fell. Lesson
/// sources are a few hundred lines, so the repeated parse is not worth
/// optimising away.
fn verdict_for(source: &str, check: &Check) -> (Verdict, bool) {
    let result = evaluate(source, std::slice::from_ref(check));
    if !result.syntax_ok {
        return (Verdict::SyntaxError, false);
    }
    if let Some(err) = result.spec_errors.into_iter().next() {
        return (Verdict::SpecError(err), true);
    }
    let verdict = match result.outcomes.first().map(|o| o.passed) {
        Some(true) => Verdict::Passed,
        Some(false) if check.forbidden => Verdict::ForbiddenPresent,
        Some(false) => Verdict::NotFound,
        // evaluate() always returns one outcome per input check.
        None => Verdict::SpecError("evaluator returned no outcome".to_string()),
    };
    (verdict, true)
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let json_mode = args.iter().any(|a| a == "--json");
    let positional: Vec<&String> = args.iter().filter(|a| !a.starts_with("--")).collect();
    if positional.len() != 2 {
        return usage();
    }

    let spec_json = match read_input(positional[0]) {
        Ok(s) => s,
        Err(e) => return fail(e),
    };
    let source = match read_input(positional[1]) {
        Ok(s) => s,
        Err(e) => return fail(e),
    };

    // A malformed or wrong-version spec is infra/authoring trouble that no
    // per-check verdict can describe, so it exits 2 rather than 1.
    let spec = match parse_spec(&spec_json) {
        Ok(s) => s,
        Err(e) => return fail(e),
    };

    // With no checks there is nothing to attribute a parse failure to, so ask
    // the evaluator directly; otherwise every per-check run reports it.
    let mut syntax_ok = evaluate(&source, &[]).syntax_ok;
    let verdicts: Vec<(&Check, Verdict)> = spec
        .checks
        .iter()
        .map(|c| {
            let (v, parsed) = verdict_for(&source, c);
            syntax_ok = parsed;
            (c, v)
        })
        .collect();

    let all_ok = verdicts.iter().all(|(_, v)| v.ok());

    if json_mode {
        let checks: Vec<serde_json::Value> = verdicts
            .iter()
            .map(|(c, v)| {
                serde_json::json!({
                    "name": c.name,
                    "forbidden": c.forbidden,
                    "passed": v.ok(),
                    "reason": v.code(),
                    "detail": v.detail(),
                })
            })
            .collect();
        let out = serde_json::json!({
            "syntax_ok": syntax_ok,
            "ok": all_ok,
            "checks": checks,
        });
        println!("{out}");
    } else {
        if !syntax_ok {
            println!("syntax: FAIL — source is not parseable Rust");
        }
        for (c, v) in &verdicts {
            let tag = if v.ok() { "PASS" } else { "FAIL" };
            let scope = if c.forbidden { " [forbidden]" } else { "" };
            if v.ok() {
                println!("{tag} {}{scope}", c.name);
            } else {
                println!("{tag} {}{scope} — {}", c.name, v.detail());
            }
        }
        let failed = verdicts.iter().filter(|(_, v)| !v.ok()).count();
        println!(
            "{}/{} check(s) hold",
            verdicts.len() - failed,
            verdicts.len()
        );
    }

    if all_ok {
        ExitCode::SUCCESS
    } else {
        ExitCode::FAILURE
    }
}
