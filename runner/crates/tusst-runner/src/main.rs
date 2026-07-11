//! tusst-runner — grades one submission inside the hardened sandbox.
//!
//! Contract with the host (tusst-web/src/lib/runner.ts):
//!   stdin:  checks.json (spec, hidden tests — never written to disk)
//!   mount:  /submission/main.rs (ro)
//!   stdout: one line — `__TUSST_REPORT__ {json}` (schema v1)
//!   exit:   always 0; a non-zero exit means infra trouble (daemon down,
//!           image missing, wall timeout), which the host maps to a 503.
//!
//! Container security posture (enforced by the host's docker flags —
//! non-negotiable, see tusst-web/src/lib/runner.ts): --network none,
//! --read-only, --tmpfs /tmp (exec), --cap-drop ALL, --pids-limit, --memory,
//! --cpus, non-root user, host wall timeout.

mod compile;
mod input;
mod report;
mod run;

use report::{CheckOutcome, Report, RunStatus};

fn main() {
    let mut report = Report::default();

    let spec = match input::read_spec_json().and_then(|json| tusst_syntest::parse_spec(&json)) {
        Ok(spec) => Some(spec),
        Err(e) => {
            report.spec_error = Some(e);
            None
        }
    };

    let source = match input::read_source() {
        Ok(s) => s,
        Err(e) => {
            // No/unreadable submission: infra-shaped failure, still exit 0.
            report.compile_error = format!("internal: {e}");
            report.emit();
            return;
        }
    };

    if let Some(spec) = &spec {
        let eval = tusst_syntest::evaluate(&source, &spec.checks);
        report.syntax_ok = eval.syntax_ok;
        report.checks = eval
            .outcomes
            .into_iter()
            .map(|o| CheckOutcome {
                name: o.name,
                passed: o.passed,
            })
            .collect();
        if !eval.spec_errors.is_empty() {
            report.spec_error = Some(eval.spec_errors.join("; "));
        }
    }

    // Compile even when AST checks failed — the student gets full feedback
    // (itemized checks + compiler verdict) in one round trip.
    let prog_path = std::env::var("TUSST_OUT_PATH").unwrap_or_else(|_| "/tmp/prog".to_string());
    let compiled = compile::compile(&input::src_path(), &prog_path);
    report.compiled = compiled.compiled;
    report.compile_error = compiled.error;

    if report.compiled {
        let outcome = run::execute(&prog_path);
        report.run = outcome.status;
        report.exit_code = outcome.exit_code;
        report.stdout = outcome.stdout;
    } else {
        report.run = RunStatus::Skipped;
    }

    report.emit();
}
