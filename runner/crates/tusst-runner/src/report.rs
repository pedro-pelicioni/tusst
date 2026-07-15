//! The single JSON report line parsed by tusst-web/src/lib/runner.ts.
//!
//! Wire shape (schema v1):
//!   __TUSST_REPORT__ {"schema_version":1,"syntax_ok":...,...}
//!
//! The report is the ONLY line this binary writes to stdout; the student
//! program's stdout is captured through a pipe and embedded (capped) in the
//! `stdout` field. Byte caps are applied here, before serialization, so a
//! hostile program can never flood the docker pipe.

use serde::Serialize;

pub const SENTINEL: &str = "__TUSST_REPORT__";
pub const SCHEMA_VERSION: u32 = 1;
pub const MAX_COMPILE_ERR: usize = 4096;
pub const MAX_STDOUT: usize = 16384;

#[derive(Serialize, PartialEq, Debug, Clone, Copy)]
#[serde(rename_all = "snake_case")]
pub enum RunStatus {
    Ok,
    Timeout,
    Crash,
    /// Compilation failed — the program never ran.
    Skipped,
}

#[derive(Serialize)]
pub struct CheckOutcome {
    pub name: String,
    pub passed: bool,
}

#[derive(Serialize)]
pub struct Report {
    pub schema_version: u32,
    pub syntax_ok: bool,
    pub checks: Vec<CheckOutcome>,
    pub compiled: bool,
    pub compile_error: String,
    pub run: RunStatus,
    pub exit_code: Option<i32>,
    pub stdout: String,
    pub spec_error: Option<String>,
}

impl Default for Report {
    fn default() -> Self {
        Report {
            schema_version: SCHEMA_VERSION,
            syntax_ok: false,
            checks: Vec::new(),
            compiled: false,
            compile_error: String::new(),
            run: RunStatus::Skipped,
            exit_code: None,
            stdout: String::new(),
            spec_error: None,
        }
    }
}

impl Report {
    pub fn emit(&self) {
        // Serialization of this shape cannot fail; fall back to a bare infra
        // shape just in case rather than panicking (exit != 0 means infra).
        let json = serde_json::to_string(self).unwrap_or_else(|_| {
            format!(
                r#"{{"schema_version":{SCHEMA_VERSION},"syntax_ok":false,"checks":[],"compiled":false,"compile_error":"","run":"skipped","exit_code":null,"stdout":"","spec_error":"report serialization failed"}}"#
            )
        });
        println!("{SENTINEL} {json}");
    }
}

/// Truncate at a byte budget without splitting a UTF-8 code point.
pub fn cap(s: &str, max: usize) -> String {
    if s.len() <= max {
        return s.to_string();
    }
    let mut end = max;
    while end > 0 && !s.is_char_boundary(end) {
        end -= 1;
    }
    s[..end].to_string()
}
