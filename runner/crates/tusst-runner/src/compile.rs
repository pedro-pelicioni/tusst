//! rustc invocation. Warnings fail the build (-D warnings) so
//! sloppy-but-compiling code (extra semicolons, unreachable code) doesn't
//! pass. Lints that legitimate lesson solutions trigger (e.g. lesson 2's
//! `let mut score = 50; score = 100;` hits unused_assignments) are allowed.

use std::process::Command;

use crate::report::{cap, MAX_COMPILE_ERR};

pub struct CompileOutcome {
    pub compiled: bool,
    /// Capped rustc stderr when compilation failed (empty on success).
    pub error: String,
}

pub fn compile(src_path: &str, out_path: &str) -> CompileOutcome {
    let result = Command::new("rustc")
        .args([
            "--edition",
            "2021",
            "--color",
            "never",
            "-D",
            "warnings",
            "-A",
            "unused_variables",
            "-A",
            "unused_assignments",
            "-A",
            "unused_mut",
            "-A",
            "dead_code",
            "-A",
            "unused_imports",
            "-o",
            out_path,
            src_path,
        ])
        .current_dir("/tmp")
        .output();

    match result {
        Ok(out) if out.status.success() => CompileOutcome {
            compiled: true,
            error: String::new(),
        },
        Ok(out) => CompileOutcome {
            compiled: false,
            error: cap(&String::from_utf8_lossy(&out.stderr), MAX_COMPILE_ERR),
        },
        Err(e) => CompileOutcome {
            compiled: false,
            error: format!("internal: failed to invoke rustc: {e}"),
        },
    }
}
